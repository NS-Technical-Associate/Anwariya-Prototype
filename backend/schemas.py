from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    role: str


class CampaignCreate(BaseModel):
    vendor_id: int
    product_name: str
    description: str


class ChatCreate(BaseModel):
    campaign_id: int
    vendor_id: int
    influencer_id: int


class MessageCreate(BaseModel):
    chat_id: int
    sender_id: int
    text: str


class MessageOut(BaseModel):
    id: int
    chat_id: int
    sender_id: int
    text: str
    created_at: datetime

    class Config:
        orm_mode = True

