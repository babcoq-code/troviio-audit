from __future__ import annotations
from typing import List, Optional
import httpx
from app.config import get_settings
from app.models import NewsletterDraft


class BrevoClient:
    BASE_URL = "https://api.brevo.com/v3"

    def __init__(self) -> None:
        self.settings = get_settings()

    def _headers(self) -> dict:
        return {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "api-key": self.settings.brevo_api_key,
        }

    async def send_campaign(self, draft: NewsletterDraft,
                            list_ids: Optional[List[int]] = None) -> dict:
        list_ids = list_ids or self.settings.brevo_list_id_values
        if not list_ids:
            raise ValueError("Aucun BREVO_LIST_IDS configuré.")

        campaign_payload = {
            "name": f"TROViiO - {draft.month} - {draft.subject}",
            "subject": draft.subject,
            "sender": {
                "name": self.settings.brevo_sender_name,
                "email": self.settings.brevo_sender_email,
            },
            "type": "classic",
            "htmlContent": draft.html,
            "recipients": {"listIds": list_ids},
        }

        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(
                f"{self.BASE_URL}/emailCampaigns",
                headers=self._headers(),
                json=campaign_payload,
            )
            r.raise_for_status()
            campaign_id = r.json()["id"]

            send_r = await client.post(
                f"{self.BASE_URL}/emailCampaigns/{campaign_id}/sendNow",
                headers=self._headers(),
            )
            send_r.raise_for_status()

        return {"campaign_id": campaign_id, "status": "sent"}

    async def send_test_email(self, draft: NewsletterDraft) -> dict:
        if not self.settings.brevo_test_email:
            raise ValueError("BREVO_TEST_EMAIL non configuré.")
        payload = {
            "sender": {
                "name": self.settings.brevo_sender_name,
                "email": self.settings.brevo_sender_email,
            },
            "to": [{"email": self.settings.brevo_test_email, "name": "Sébastien"}],
            "subject": f"[TEST] {draft.subject}",
            "htmlContent": draft.html,
            "textContent": draft.text or draft.summary,
        }
        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(
                f"{self.BASE_URL}/smtp/email",
                headers=self._headers(),
                json=payload,
            )
            r.raise_for_status()
        return r.json()
