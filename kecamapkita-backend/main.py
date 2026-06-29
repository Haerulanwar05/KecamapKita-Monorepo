import os
import jwt
import urllib.request
import urllib.parse
import json
import math
import asyncio
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import google.generativeai as genai

import hashlib
import datetime

from database import get_db
from models import Spot, Kecamatan, Checkin, User
from schemas import SpotResponse, CheckinBase, CheckinResponse, ChatRequest, UserCreate, LoginRequest, GoogleLoginRequest, UserResponse, UserProfileData, AvatarUpdateRequest, CheckinHistoryItem, BadgeItem

app = FastAPI(title="KecamapKita Spatial Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    profile_data = await build_user_profile_data(user, db)
    
    return {"access_token": token, "token_type": "bearer", "user": profile_data}

@app.post("/api/auth/google")
async def google_login(req: GoogleLoginRequest, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == req.email)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user:
        username_base = req.email.split("@")[0]
        username = username_base
        u_query = select(User).where(User.username == username)
        u_res = await db.execute(u_query)
        if u_res.first():
            import random
            username = f"{username_base}{random.randint(100, 999)}"
            
        user = User(
            username=username,
            email=req.email,
            display_name=req.display_name or username,
            avatar=req.avatar or "🤠",
            hashed_password=get_password_hash("google_oauth_dummy_secret_pass_99")
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
    payload = {
        "sub": str(user.id),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=ALGORITHM)
    profile_data = await build_user_profile_data(user, db)
    
    return {"access_token": token, "token_type": "bearer", "user": profile_data}

async def build_user_profile_data(user: User, db: AsyncSession) -> UserProfileData:
    query = select(Checkin, Spot).join(Spot, Checkin.spot_id == Spot.id).where(Checkin.user_id == user.id).order_by(Checkin.visited_at.desc())
    res = await db.execute(query)
    rows = res.all()
    
    history = []
    vibe_counts = {}
    district_set = set()
    
    for checkin, spot in rows:
        history.append(CheckinHistoryItem(
            spot_name=spot.name,
            visited_at=checkin.visited_at,
            vibe=spot.vibe or "syahdu"
        ))
        vibe = (spot.vibe or "").lower()
        vibe_counts[vibe] = vibe_counts.get(vibe, 0) + 1
        district_set.add(spot.name.split()[0])
        
    c_count = len(rows)
    d_count = len(district_set)
    
    badges = [
        BadgeItem(name="Penyembuh Jiwa", icon="🌿", current=vibe_counts.get("syahdu", 0), target=2, unlocked=vibe_counts.get("syahdu", 0) >= 2),
        BadgeItem(name="Kolektor Rasa", icon="🍜", current=vibe_counts.get("kenyang", 0), target=3, unlocked=vibe_counts.get("kenyang", 0) >= 3),
        BadgeItem(name="Si Paling Kreatif", icon="💡", current=vibe_counts.get("kreatif", 0), target=2, unlocked=vibe_counts.get("kreatif", 0) >= 2),
        BadgeItem(name="Penjelajah Sejati", icon="🗺️", current=c_count, target=5, unlocked=c_count >= 5),
    ]
    
    user_dict = UserResponse.model_validate(user).model_dump()
    user_dict["checkin_count"] = c_count
    user_dict["district_count"] = d_count
    user_dict["id"] = str(user.id)
    
    return UserProfileData(**user_dict, history=history[:15], badges=badges)

@app.get("/api/auth/me", response_model=UserProfileData)
async def get_me(user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db)):
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return await build_user_profile_data(user, db)

@app.post("/api/user/avatar", response_model=UserProfileData)
async def update_avatar(req: AvatarUpdateRequest, user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db)):
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.avatar = req.avatar
    await db.commit()
    await db.refresh(user)
    return await build_user_profile_data(user, db)

OSM_CACHE = {}

def get_creative_image_url(name: str, osm_tags: dict, spot_id: int) -> str:
    if osm_tags.get("image"): return osm_tags.get("image")
    if osm_tags.get("image_url"): return osm_tags.get("image_url")
    
    n = name.lower()
    if any(k in n for k in ["kopi", "cafe", "kafe", "coffee", "roastery", "nongkrong", "co-working", "coworking"]):
        photos = [
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80"
        ]
        return photos[spot_id % len(photos)]
    if any(k in n for k in ["warung", "makan", "resto", "nasi", "sate", "bakso", "mie", "kedai", "kuliner", "ayam", "bebek"]):
        photos = [
            "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80"
        ]
        return photos[spot_id % len(photos)]
    if any(k in n for k in ["taman", "alun", "park", "hutan", "ridge", "green", "sawah", "kebun", "suropati", "pinus"]):
        photos = [
            "https://images.unsplash.com/photo-1596306499317-8490232098fa?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1558230315-5927395092cf?auto=format&fit=crop&w=800&q=80"
        ]
        return photos[spot_id % len(photos)]
    if any(k in n for k in ["pantai", "curug", "air terjun", "danau", "situ", "laut", "river", "sungai"]):
        photos = [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
        ]
        return photos[spot_id % len(photos)]
    if any(k in n for k in ["museum", "candi", "monumen", "sejarah", "masjid", "gereja", "puri", "kraton", "galeri"]):
        photos = [
            "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80"
        ]
        return photos[spot_id % len(photos)]
        
    default_photos = [
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80"
    ]
    return default_photos[spot_id % len(default_photos)]

def fetch_osm_spots_sync(lat: float, lng: float, radius: int = 15000):
    cache_key = (round(lat, 2), round(lng, 2))
    now = datetime.datetime.utcnow().timestamp()
    if cache_key in OSM_CACHE:
        ts, data = OSM_CACHE[cache_key]
        if now - ts < 3600:
            return data

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
            elements = result.get('elements', [])
            OSM_CACHE[cache_key] = (now, elements)
            return elements
    except Exception as e:
        print("OSM Error:", e)
        return []

@app.get("/api/kecamatan/active")
async def get_active_kecamatan(lat: float, lng: float, db: AsyncSession = Depends(get_db)):
    query = select(Kecamatan)
    result = await db.execute(query)
    kecamatans = result.scalars().all()
    
    # Cari kecamatan terdekat dengan haversine
    best_name = "Luar Area"
    min_dist = float("inf")
    for k in kecamatans:
        if k.lat != 0.0 and k.lng != 0.0:
            dist = haversine(lat, lng, k.lat, k.lng)
            if dist < min_dist and dist < 10000: # Dalam 10km
                min_dist = dist
                best_name = k.name
        elif best_name == "Luar Area":
            best_name = k.name
            
    return {"name": best_name}

@app.get("/api/spots", response_model=list[SpotResponse])
async def get_spots(lat: float, lng: float, vibe: str = "all", weather_state: str = "clear", db: AsyncSession = Depends(get_db)):
    query = select(Spot)
    if vibe != "all":
        query = query.where(Spot.vibe == vibe)
        
    result = await db.execute(query)
    spots_data = result.scalars().all()
    
    response_spots = []
    for spot in spots_data:
        dist = haversine(lat, lng, spot.lat, spot.lng)
        if dist <= 15000: # Filter radius 15 KM (15000 meter)
            s_dict = spot.__dict__.copy()
            s_dict["distance"] = dist
            v = (spot.vibe or "").lower()
            if v == "syahdu":
                s_dict["ai_advice"] = f"Pak RT menyarankan datang pas sore hari ke {spot.name}. Cocok banget buat healing dan melepas penat!"
            elif v == "kenyang":
                s_dict["ai_advice"] = f"Wajib cobain kuliner khas di {spot.name}! Kata Pak RT rasanya juara dan harganya ramah di kantong."
            elif v == "kreatif":
                s_dict["ai_advice"] = f"Tempat favorit anak muda kreatif! Banyak spot foto estetik di {spot.name} menurut pantauan Pak RT."
            else:
                s_dict["ai_advice"] = f"Rekomendasi Pak RT: {spot.name} adalah pilihan tepat untuk menghabiskan waktu luang bersama kerabat!"
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
                    image_url=get_creative_image_url(name, el.get('tags', {}), spot_id),
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
                    distance=dist,
                    ai_advice=f"💡 Pak RT merekomendasikan {name} hasil temuan satelit! Udah terbukti jadi tempat favorit warga lokal."
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
    query = select(Spot).where(Spot.id == spot_id)
    result = await db.execute(query)
    spot = result.scalar_one_or_none()
    
    distance = None
    if spot:
        distance = haversine(payload.lat, payload.lng, spot.lat, spot.lng)
    elif payload.spot_lat is not None and payload.spot_lng is not None:
        distance = haversine(payload.lat, payload.lng, payload.spot_lat, payload.spot_lng)
        # Assign checkin to a dummy spot for foreign key
        dummy_query = select(Spot).where(Spot.id == 999999)
        dummy_res = await db.execute(dummy_query)
        if not dummy_res.scalar_one_or_none():
            dummy_spot = Spot(id=999999, name="Eksplorasi OSM", type="outdoor", vibe="bebas", lat=0.0, lng=0.0)
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
