import os
import jwt
from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import google.generativeai as genai

from database import get_db
from models import Spot, Kecamatan, Checkin, User
from schemas import SpotResponse, CheckinBase, CheckinResponse, ChatRequest

app = FastAPI(title="KecamapKita Spatial Backend")

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "123anwarjakarta?")
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

@app.get("/api/spots", response_model=list[SpotResponse])
async def get_spots(lat: float, lng: float, vibe: str = "all", weather_state: str = "clear", db: AsyncSession = Depends(get_db)):
    client_point = f"POINT({lng} {lat})"
    
    # query spots with distance
    query = select(
        Spot, 
        func.ST_Y(Spot.geom).label("lat"), 
        func.ST_X(Spot.geom).label("lng"),
        func.ST_DistanceSphere(Spot.geom, func.ST_GeomFromText(client_point, 4326)).label("distance")
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
        
    # Weather-adaptive sorting
    if weather_state == "rain":
        response_spots.sort(key=lambda x: (x.type != "indoor", x.distance or 0))
    else:
        response_spots.sort(key=lambda x: x.distance or 0)
        
    return response_spots

@app.post("/api/spots/{spot_id}/checkin", response_model=CheckinResponse)
async def checkin(spot_id: int, payload: CheckinBase, db: AsyncSession = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    client_point = f"POINT({payload.lng} {payload.lat})"
    
    query = select(func.ST_DistanceSphere(Spot.geom, func.ST_GeomFromText(client_point, 4326))).where(Spot.id == spot_id)
    result = await db.execute(query)
    distance = result.scalar_one_or_none()
    
    if distance is None:
        raise HTTPException(status_code=404, detail="Spot not found")
        
    if distance > 100:
        raise HTTPException(status_code=400, detail="Client is too far from the spot (must be <100m).")
        
    checkin_rec = Checkin(user_id=user_id, spot_id=spot_id)
    db.add(checkin_rec)
    
    level_up = False
    new_level = 1
    total_xp = 0
    
    if user_id:
        user = await db.get(User, user_id)
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
    client_point = f"POINT({payload.lng} {payload.lat})"
    
    kecamatan_query = select(Kecamatan.name).where(
        func.ST_Contains(Kecamatan.geom, func.ST_GeomFromText(client_point, 4326))
    )
    result = await db.execute(kecamatan_query)
    active_kec_name = result.scalar_one_or_none() or "Tidak diketahui"
    
    system_prompt = f"""Kamu adalah "Pak RT" dari KecamapKita.
Kamu ramah, lokal, dan sering pakai bahasa Indonesia yang santai atau slang lokal.
Lokasi pengguna saat ini (terdeteksi dari sub-distrik): {active_kec_name}.
Tugas: Jawab pertanyaan terkait wisata lokal, cuaca, dan tempat hangout."""

    model = genai.GenerativeModel('gemini-3.5-flash', system_instruction=system_prompt)
    response = model.generate_content(payload.message)
    
    return {"reply": response.text, "kecamatan_detected": active_kec_name}
