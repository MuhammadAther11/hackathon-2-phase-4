from typing import Optional
from datetime import datetime, timezone, timedelta
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Column, DateTime
from pydantic import BaseModel

# Pakistan Standard Time (UTC+5)
PKT = timezone(timedelta(hours=5))

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)

class User(UserBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    password_hash: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(PKT),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(PKT),
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            onupdate=lambda: datetime.now(PKT)
        )
    )

class UserCreate(UserBase):
    password: str

class UserPublic(UserBase):
    id: UUID
    created_at: datetime

    class Config:
        json_encoders = {
            datetime: lambda dt: (
                dt.astimezone(PKT).isoformat()
                if dt and dt.tzinfo
                else dt.replace(tzinfo=timezone.utc).astimezone(PKT).isoformat()
                if dt
                else None
            )
        }

    @classmethod
    def from_orm(cls, user: User):
        return cls(
            id=user.id,
            email=user.email,
            created_at=user.created_at
        )