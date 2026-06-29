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

class LoginRequest(BaseModel):
    username: str
    password: str

class GoogleLoginRequest(BaseModel):
    email: str
    display_name: str
    avatar: Optional[str] = "🤠"

class UserResponse(UserBase):
    id: str
    total_xp: int
    level: int
    checkin_count: Optional[int] = 0
    district_count: Optional[int] = 0
    class Config:
        from_attributes = True

class CheckinBase(BaseModel):
    lat: float
    lng: float
    spot_lat: Optional[float] = None
    spot_lng: Optional[float] = None

class CheckinResponse(BaseModel):
    id: str
    user_id: Optional[str]
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
    ai_advice: Optional[str] = None
    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
    lat: float
    lng: float
    district: Optional[str] = "Tidak diketahui"

class AvatarUpdateRequest(BaseModel):
    avatar: str

class CheckinHistoryItem(BaseModel):
    spot_name: str
    visited_at: datetime
    vibe: str

class BadgeItem(BaseModel):
    name: str
    icon: str
    current: int
    target: int
    unlocked: bool

class UserProfileData(UserResponse):
    history: List[CheckinHistoryItem] = []
    badges: List[BadgeItem] = []
