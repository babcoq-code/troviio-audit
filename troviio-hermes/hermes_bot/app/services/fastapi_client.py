from __future__ import annotations
from typing import Optional
import httpx
from app.config import get_settings
from app.models import NewsletterDraft, NewsletterStats


class FastAPIClient:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.base_url = self.settings.fastapi_base_url.rstrip("/")

    def _headers(self) -> dict:
        headers = {"Accept": "application/json", "Content-Type": "application/json"}
        if self.settings.fastapi_api_key:
            headers["Authorization"] = f"Bearer {self.settings.fastapi_api_key}"
        return headers

    async def generate_newsletter(self, month: str, theme: Optional[str] = None) -> NewsletterDraft:
        async with httpx.AsyncClient(timeout=180) as client:
            r = await client.post(
                f"{self.base_url}/newsletter/generate",
                headers=self._headers(),
                json={"month": month, "theme": theme},
            )
            r.raise_for_status()
        data = r.json()
        return NewsletterDraft(
            draft_id=data["draft_id"],
            month=data["month"],
            theme=data.get("theme"),
            subject=data["subject"],
            summary=data["summary"],
            html=data["html"],
            text=data.get("text"),
        )

    async def get_stats(self, draft_id: str) -> NewsletterStats:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.get(
                f"{self.base_url}/newsletter/{draft_id}/stats",
                headers=self._headers(),
            )
            r.raise_for_status()
        return NewsletterStats.model_validate(r.json())
