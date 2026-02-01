from sqlalchemy.orm import Session
import models


# --------------------
# USERS
# --------------------

def create_or_get_user(db: Session, email: str, role: str):
    user = db.query(models.User).filter(models.User.email == email).first()

    if user:
        return user

    user = models.User(email=email, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


# --------------------
# CAMPAIGNS
# --------------------

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
# CHATS
# --------------------

def create_or_get_chat(
    db: Session,
    campaign_id: int,
    vendor_id: int,
    influencer_id: int
):
    chat = (
        db.query(models.Chat)
        .filter(
            models.Chat.campaign_id == campaign_id,
            models.Chat.vendor_id == vendor_id,
            models.Chat.influencer_id == influencer_id
        )
        .first()
    )

    if not chat:
        chat = models.Chat(
            campaign_id=campaign_id,
            vendor_id=vendor_id,
            influencer_id=influencer_id
        )
        db.add(chat)
        db.commit()
        db.refresh(chat)

    return chat


def get_chats_by_user(db: Session, user_id: int):
    return (
        db.query(models.Chat)
        .filter(
            (models.Chat.vendor_id == user_id) |
            (models.Chat.influencer_id == user_id)
        )
        .all()
    )


# --------------------
# MESSAGES
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
