from __future__ import annotations
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class DraftStatus(str, Enum):
    EMPTY = "empty"
    GENERATED = "generated"
    APPROVED = "approved"
    SENT = "sent"
    CANCELLED = "cancelled"


class NewsletterDraft(BaseModel):
    draft_id: str
    month: str
    theme: Optional[str] = None
    subject: str
    summary: str
    html: str
    text: Optional[str] = None
    status: DraftStatus = DraftStatus.GENERATED


class NewsletterStats(BaseModel):
    draft_id: Optional[str] = None
    sent_count: int = 0
    delivered_count: int = 0
    open_rate: Optional[float] = None
    click_rate: Optional[float] = None
    raw: dict = Field(default_factory=dict)
