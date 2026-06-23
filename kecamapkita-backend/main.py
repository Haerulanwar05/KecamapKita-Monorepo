import os
import jwt
import urllib.request
import urllib.parse
import json
import math
import asyncio
from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import google.generativeai as genai

import hashlib
import datetime

from database import get_db
from models import Spot, Kecamatan, Checkin, User
from schemas import SpotResponse, CheckinBase, CheckinResponse, ChatRequest, UserCreate, LoginRequest, UserResponse

app = FastAPI(title="KecamapKita Spatial Backend")

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    raise ValueError("FATAL: JWT_SECRET_KEY is not set in environment!")
ALGORITHM = "HS256"

async def get_current_user_id(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except:
        return None

def calculate_level(xp: int) -> int:
    if xp < 150: return 1
    if xp < 300: return 2
    if xp < 600: return 3
    if xp < 1200: return 4
    return 5

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlam/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

def get_password_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return get_password_hash(plain_password) == hashed_password

@app.post("/api/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    query = select(User).where((User.username == user.username) | (User.email == user.email))
    result = await db.execute(query)
    if result.first():
        raise HTTPException(status_code=400, detail="Username or email already registered")
        
    db_user = User(
        username=user.username,
        email=user.email,
        display_name=user.display_name,
        avatar=user.avatar or "🤠",
        hashed_password=get_password_hash(user.password)
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@app.post("/api/auth/login")
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.username == req.username)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
        
    payload = {
        "sub": str(user.id),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=ALGORITHM)
    # Get stats
    checkin_res = await db.execute(select(func.count(Checkin.id)).where(Checkin.user_id == user.id))
    c_count = checkin_res.scalar() or 0
    
    user_dict = UserResponse.model_validate(user).model_dump()
    user_dict["checkin_count"] = c_count
    user_dict["district_count"] = c_count // 3 if c_count > 0 else 0
    
    return {"access_token": token, "token_type": "bearer", "user": user_dict}

@app.get("/api/auth/me", response_model=UserResponse)
async def get_me(user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db)):
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    checkin_res = await db.execute(select(func.count(Checkin.id)).where(Checkin.user_id == user_id))
    c_count = checkin_res.scalar() or 0
    
    user_dict = UserResponse.model_validate(user).model_dump()
    user_dict["checkin_count"] = c_count
    user_dict["district_count"] = c_count // 3 if c_count > 0 else 0
    
    return user_dict

def fetch_osm_spots_sync(lat: float, lng: float, radius: int = 15000):
    url = "https://overpass-api.de/api/interpreter"
    query = f"""
    [out:json];
    (
      node["tourism"](around:{radius},{lat},{lng});
      node["historic"](around:{radius},{lat},{lng});
      node["leisure"="park"](around:{radius},{lat},{lng});
    );
    out center 15;
    """
    data = urllib.parse.urlencode({'data': query}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'User-Agent': 'KecamapKitaApp/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result.get('elements', [])
    except Exception as e:
        print("OSM Error:", e)
        return []

@app.get("/api/kecamatan/active")
async def get_active_kecamatan(lat: float, lng: float, db: AsyncSession = Depends(get_db)):
    client_point = func.ST_SetSRID(func.ST_MakePoint(lng, lat), 4326)
    query = select(Kecamatan).where(func.ST_Contains(Kecamatan.geom, client_point))
    result = await db.execute(query)
    kecamatan = result.scalar_one_or_none()
    if kecamatan:
        return {"name": kecamatan.name}
    return {"name": "Luar Area"}

@app.get("/api/spots", response_model=list[SpotResponse])
async def get_spots(lat: float, lng: float, vibe: str = "all", weather_state: str = "clear", db: AsyncSession = Depends(get_db)):
    client_point = func.ST_SetSRID(func.ST_MakePoint(lng, lat), 4326)
    
    # query spots with distance, maximum radius 15km (15000 meters)
    query = select(
        Spot, 
        func.ST_Y(Spot.geom).label("lat"), 
        func.ST_X(Spot.geom).label("lng"),
        func.ST_DistanceSphere(Spot.geom, client_point).label("distance")
    ).where(
        func.ST_DistanceSphere(Spot.geom, client_point) <= 15000
    )
    
    if vibe != "all":
        query = query.where(Spot.vibe == vibe)
        
    result = await db.execute(query)
    spots_data = result.all()
    
    response_spots = []
    for row in spots_data:
        spot = row[0]
        s_dict = spot.__dict__.copy()
        s_dict["lat"] = row[1]
        s_dict["lng"] = row[2]
        s_dict["distance"] = row[3]
        response_spots.append(SpotResponse(**s_dict))
        
    # Fitur Otomatis: Jika database kosong di area ini, ambil data gratis dari OpenStreetMap (Overpass API)
    if len(response_spots) < 3:
        try:
            osm_elements = await asyncio.to_thread(fetch_osm_spots_sync, lat, lng, 15000)
            for el in osm_elements:
                name = el.get('tags', {}).get('name')
                if not name: continue
                
                e_lat = el.get('lat', lat)
                e_lng = el.get('lon', lng)
                dist = haversine(lat, lng, e_lat, e_lng)
                
                spot_id = el['id'] % 2147483647 # Hindari error integer di Frontend
                
                if vibe != "all" and vibe != "santai":
                    continue # Sederhanakan filter vibe untuk data OSM
                    
                response_spots.append(SpotResponse(
                    id=spot_id,
                    name=name,
                    description=el.get('tags', {}).get('description', f"Destinasi {name} yang menarik di sekitar Anda."),
                    image_url="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
                    hours=el.get('tags', {}).get('opening_hours', "08.00 - 18.00"),
                    price="Bervariasi",
                    best_time="Pagi/Sore",
                    vibe="santai",
                    type="outdoor" if el.get('tags', {}).get('tourism') in ['park', 'viewpoint'] else "indoor",
                    crowdedness_pagi=20,
                    crowdedness_siang=50,
                    crowdedness_sore=70,
                    crowdedness_malam=40,
                    lat=e_lat,
                    lng=e_lng,
                    distance=dist
                ))
        except Exception as e:
            print("Error fetching OSM:", e)
        
    # Weather-adaptive sorting
    if weather_state == "rain":
        response_spots.sort(key=lambda x: (x.type != "indoor", x.distance or 0))
    else:
        response_spots.sort(key=lambda x: x.distance or 0)
        
    return response_spots

@app.post("/api/spots/{spot_id}/checkin", response_model=CheckinResponse)
async def checkin(spot_id: int, payload: CheckinBase, db: AsyncSession = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    client_point = func.ST_SetSRID(func.ST_MakePoint(payload.lng, payload.lat), 4326)
    
    query = select(Spot).where(Spot.id == spot_id)
    result = await db.execute(query)
    spot = result.scalar_one_or_none()
    
    distance = None
    if spot:
        query_dist = select(func.ST_DistanceSphere(Spot.geom, client_point)).where(Spot.id == spot_id)
        result_dist = await db.execute(query_dist)
        distance = result_dist.scalar_one_or_none()
    elif payload.spot_lat is not None and payload.spot_lng is not None:
        distance = haversine(payload.lng, payload.lat, payload.spot_lng, payload.spot_lat) * 1000
        # Assign checkin to a dummy spot for foreign key
        dummy_query = select(Spot).where(Spot.id == 999999)
        dummy_res = await db.execute(dummy_query)
        if not dummy_res.scalar_one_or_none():
            dummy_spot = Spot(id=999999, name="Eksplorasi OSM", type="outdoor", vibe="bebas", geom=func.ST_SetSRID(func.ST_MakePoint(0, 0), 4326))
            db.add(dummy_spot)
            await db.commit()
        spot_id = 999999

    if distance is None:
        raise HTTPException(status_code=404, detail="Spot not found")
        
    if distance > 100:
        raise HTTPException(status_code=400, detail="Anda terlalu jauh dari lokasi (<100m).")
        
    checkin_rec = Checkin(user_id=user_id, spot_id=spot_id)
    db.add(checkin_rec)
    
    level_up = False
    new_level = 1
    total_xp = 0
    
    if user_id:
        result = await db.execute(select(User).where(User.id == user_id).with_for_update())
        user = result.scalar_one_or_none()
        if user:
            old_level = user.level
            user.total_xp += 150
            user.level = calculate_level(user.total_xp)
            if user.level > old_level:
                level_up = True
            new_level = user.level
            total_xp = user.total_xp
            
    await db.commit()
    await db.refresh(checkin_rec)
    
    return CheckinResponse(
        id=checkin_rec.id,
        user_id=checkin_rec.user_id,
        spot_id=checkin_rec.spot_id,
        visited_at=checkin_rec.visited_at,
        xp_earned=150,
        total_xp=total_xp,
        level_up=level_up,
        new_level=new_level
    )

@app.post("/api/ai/chat")
async def chat_ai(payload: ChatRequest, db: AsyncSession = Depends(get_db)):
    # Gunakan nama kecamatan asli yang dikirim dari HP, bukan hanya mengandalkan database lokal!
    active_kec_name = payload.district
    
    system_prompt = f"""Kamu adalah "Pak RT" dari KecamapKita.
Kamu ramah, lokal, dan sering pakai bahasa Indonesia yang santai atau slang lokal.
Lokasi pengguna saat ini (Berdasarkan GPS Asli): Kecamatan {active_kec_name}.
Tugas: Jawab pertanyaan terkait wisata lokal, cuaca, dan tempat hangout."""

    model = genai.GenerativeModel('gemini-2.5-flash', system_instruction=system_prompt)
    response = await model.generate_content_async(payload.message)
    
    return {"reply": response.text, "kecamatan_detected": active_kec_name}
