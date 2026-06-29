from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Float
from sqlalchemy.orm import declarative_base, relationship
import uuid
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    display_name = Column(String, nullable=False)
    avatar = Column(String, default="🤠")
    total_xp = Column(Integer, default=0)
    level = Column(Integer, default=1)

    checkins = relationship("Checkin", back_populates="user")

class Kecamatan(Base):
    __tablename__ = "kecamatan"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)
    lat = Column(Float, default=0.0)
    lng = Column(Float, default=0.0)

class Spot(Base):
    __tablename__ = "spots"
    id = Column(Integer, primary_key=True, autoincrement=False)
    name = Column(String, nullable=False)
    description = Column(String)
    image_url = Column(String)
    hours = Column(String)
    price = Column(String)
    best_time = Column(String)
    vibe = Column(String)
    type = Column(String)
    crowdedness_pagi = Column(Integer, default=0)
    crowdedness_siang = Column(Integer, default=0)
    crowdedness_sore = Column(Integer, default=0)
    crowdedness_malam = Column(Integer, default=0)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)

    checkins = relationship("Checkin", back_populates="spot")

class Checkin(Base):
    __tablename__ = "checkins"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    spot_id = Column(Integer, ForeignKey("spots.id"), nullable=False)
    visited_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="checkins")
    spot = relationship("Spot", back_populates="checkins")
