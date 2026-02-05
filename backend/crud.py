import json
import os
from fastapi import HTTPException
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai
from sqlalchemy.orm import Session
import models

# --------------------
# USERS
# --------------------

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def create_or_get_user(db: Session, email: str, role: str):
    user = db.query(models.User).filter(models.User.email == email).first()

    if user:
        if user.role != role:
            raise HTTPException(
                status_code=403,
                detail=f"User is registered as {user.role}, not {role}"
            )
        return user

    user = models.User(email=email, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_tokens(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    return user.tokens if user else 0

def deduct_tokens(db: Session, user_id: int, amount: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or user.tokens < amount:
        return "INSUFFICIENT"
    user.tokens -= amount
    db.commit()
    return user.tokens

def create_campaign(db: Session, vendor_id: int, product_name: str, description: str):
    campaign = models.Campaign(
        vendor_id=vendor_id,
        product_name=product_name,
        description=description
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign


def get_all_campaigns(db: Session):
    return db.query(models.Campaign).all()

# --------------------
# ANALYTICS → AI ADAPTER
# --------------------

def extract_ai_analytics(analytics: dict) -> dict:
    sales = analytics.get("sales", [])
    kpis = analytics.get("kpis", {})

    total_revenue = kpis.get("total_revenue", 0)
    total_units = kpis.get("total_units_sold", 0)

    avg_order_value = total_revenue / total_units if total_units else 0

    top_products = sorted(sales, key=lambda x: x["quantity"], reverse=True)[:3]
    low_products = sorted(sales, key=lambda x: x["quantity"])[:3]

    return {
        "revenue": {
            "total": total_revenue
        },
        "orders": {
            "total": total_units,
            "average_order_value": round(avg_order_value, 2)
        },
        "products": {
            "top": top_products,
            "low": low_products
        }
    }

def validate_ai_analytics(data: dict):
    if data["orders"]["total"] == 0:
        raise HTTPException(status_code=400, detail="No sales data for AI insights")
    if data["revenue"]["total"] < 1000:
        raise HTTPException(status_code=400, detail="Revenue too low for AI insights")

# --------------------
# GEMINI AI
# --------------------

def create_message(db: Session, chat_id: int, sender_id: int, text: str):
    message = models.Message(
        chat_id=chat_id,
        sender_id=sender_id,
        text=text
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def get_messages_by_chat(db: Session, chat_id: int):
    return (
        db.query(models.Message)
        .filter(models.Message.chat_id == chat_id)
        .order_by(models.Message.created_at)
        .all()
    )

# --------------------
# TOKENS
# --------------------

def get_user_tokens(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    return user.tokens if user else None


def deduct_tokens(db: Session, user_id: int, amount: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        return None

    if user.tokens < amount:
        return "INSUFFICIENT"

    user.tokens -= amount
    db.commit()
    db.refresh(user)
    return user.tokens
    

def get_profile(db: Session, user_id: int):
    profile = db.query(models.InfluencerProfile)\
        .filter(models.InfluencerProfile.user_id == user_id)\
        .first()

    if not profile:
        return None

    return {
        "user_id": profile.user_id,
        "name": profile.name,
        "niche": profile.niche,
        "followers_range": profile.followers_range,
        "engagement": profile.engagement,
        "bio": profile.bio,
        "availability": profile.availability,
        "content_types": profile.content_types.split(",") if profile.content_types else []
    }


def create_or_update_profile(db: Session, data):
    profile = db.query(models.InfluencerProfile)\
        .filter(models.InfluencerProfile.user_id == data.user_id)\
        .first()

    content_types_str = ",".join(data.content_types)

    if profile:
        profile.name = data.name
        profile.niche = data.niche
        profile.followers_range = data.followers_range
        profile.engagement = data.engagement
        profile.bio = data.bio
        profile.availability = data.availability
        profile.content_types = content_types_str
    else:
        profile = models.InfluencerProfile(
            user_id=data.user_id,
            name=data.name,
            niche=data.niche,
            followers_range=data.followers_range,
            engagement=data.engagement,
            bio=data.bio,
            availability=data.availability,
            content_types=content_types_str,
        )
        db.add(profile)

    db.commit()
    db.refresh(profile)
    return get_profile(db, data.user_id)


# -------- PRODUCTS --------
def create_product(db: Session, data):
    product = models.Product(**data.dict())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def get_products(db: Session, vendor_id: int):
    return db.query(models.Product).filter(
        models.Product.vendor_id == vendor_id
    ).all()


# -------- BILLS --------
def create_bill(db: Session, bill):
    product = db.query(models.Product).filter(
        models.Product.id == bill.product_id,
        models.Product.vendor_id == bill.vendor_id
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.quantity_available < bill.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    # 🔑 CORE LOGIC
    cost_price = product.cost_price           # PER UNIT
    selling_price = bill.selling_price        # PER UNIT

    profit_per_unit = selling_price - cost_price
    total_profit = profit_per_unit * bill.quantity

    new_bill = models.Bill(
        vendor_id=bill.vendor_id,
        product_id=bill.product_id,
        quantity=bill.quantity,
        selling_price=selling_price,
        cost_price=cost_price,
        profit=total_profit
    )

    product.quantity_available -= bill.quantity

    db.add(new_bill)
    db.commit()
    db.refresh(new_bill)

    return new_bill

def build_marketing_prompt(analytics: dict) -> str:
    return f"""
You are a senior performance marketing strategist.

Rules:
- Use ONLY the provided data
- Do NOT invent numbers
- Do NOT give generic advice
- Base every suggestion on actual sales data
- If data is insufficient, clearly say so

Analytics data (JSON):
{json.dumps(analytics, indent=2)}

Return STRICT JSON only in this format:

{{
  "key_insights": [],
  "problems": [],
  "recommended_actions": [
    {{
      "priority": "HIGH | MEDIUM | LOW",
      "action": "",
      "reason": "",
      "metric_to_track": ""
    }}
  ],
  "budget_advice": ""
}}
"""

def generate_marketing_insights(ai_analytics: dict) -> str:
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(status_code=500, detail="Gemini API key not configured")

    model = genai.GenerativeModel("gemini-1.5-pro")

    response = model.generate_content(
        build_marketing_prompt(ai_analytics),
        generation_config={
            "temperature": 0.4
        }
    )

    return response.text

def safe_parse_ai_response(text: str):
    try:
        return json.loads(text)
    except Exception:
        return {
            "error": "Invalid AI response",
            "raw_response": text
        }
