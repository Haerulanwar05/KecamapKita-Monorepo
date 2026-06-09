from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str
    display_name: str
    avatar: Optional[str] = "🤠"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: UUID
    total_xp: int
    level: int
    class Config:
        from_attributes = True

class CheckinBase(BaseModel):
    lat: float
    lng: float

class CheckinResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID]
    spot_id: int
    visited_at: datetime
    xp_earned: int
    total_xp: int
    level_up: bool
    new_level: int
    class Config:
        from_attributes = True

class SpotResponse(BaseModel):
    id: int
    name: str
    description: str
    image_url: str
    hours: str
    price: str
    best_time: str
    vibe: str
    type: str
    crowdedness_pagi: int
    crowdedness_siang: int
    crowdedness_sore: int
    crowdedness_malam: int
    lat: float
    lng: float
    distance: Optional[float] = None
    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
    lat: float
    lng: float
