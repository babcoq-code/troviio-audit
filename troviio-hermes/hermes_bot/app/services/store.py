from __future__ import annotations
import json
from pathlib import Path
from typing import Optional
from app.config import get_settings
from app.models import NewsletterDraft, DraftStatus


class DraftStore:
    def __init__(self) -> None:
        settings = get_settings()
        self.data_dir = Path(settings.data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.file_path = self.data_dir / "current_draft.json"

    async def save(self, draft: NewsletterDraft) -> None:
        self.file_path.write_text(draft.model_dump_json(indent=2), encoding="utf-8")

    async def load(self) -> Optional[NewsletterDraft]:
        if not self.file_path.exists():
            return None
        raw = self.file_path.read_text(encoding="utf-8")
        if not raw.strip():
            return None
        return NewsletterDraft.model_validate(json.loads(raw))

    async def clear(self) -> None:
        if self.file_path.exists():
            self.file_path.unlink()

    async def set_status(self, status: DraftStatus) -> Optional[NewsletterDraft]:
        draft = await self.load()
        if not draft:
            return None
        draft.status = status
        await self.save(draft)
        return draft
