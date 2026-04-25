"""
PICKSY — Celery App + tâches planifiées
"""

import os
from celery import Celery
from celery.schedules import crontab
from dotenv import load_dotenv

load_dotenv()

app = Celery(
    "picksy",
    broker=os.getenv("CELERY_BROKER_URL", "redis://redis:6379/1"),
    backend=os.getenv("CELERY_RESULT_BACKEND", "redis://redis:6379/2"),
    include=["app.tasks.scraper", "app.tasks.prices", "app.tasks.newsletter_task"],
)

# Tâches planifiées
app.conf.beat_schedule = {
    # Scraping hebdomadaire — dimanche 3h00
    "weekly-scraping": {
        "task": "app.tasks.scraper.run_weekly_discovery",
        "schedule": crontab(hour=3, minute=0, day_of_week="sunday"),
    },
    # Newsletter hebdomadaire — lundi 9h00
    "weekly-newsletter": {
        "task": "app.tasks.newsletter_task.send_weekly_newsletter",
        "schedule": crontab(hour=9, minute=0, day_of_week="monday"),
    },
    # Mise à jour prix Amazon — tous les jours 7h00 et 19h00
    "daily-prices-morning": {
        "task": "app.tasks.prices.update_amazon_prices",
        "schedule": crontab(hour=7, minute=0),
    },
    "daily-prices-evening": {
        "task": "app.tasks.prices.update_amazon_prices",
        "schedule": crontab(hour=19, minute=0),
    },
}

app.conf.timezone = "Europe/Paris"
