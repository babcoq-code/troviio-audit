"""PICKSY — Celery App + tâches planifiées"""

import os
from celery import Celery
from celery.schedules import crontab
from dotenv import load_dotenv

load_dotenv()

app = Celery(
    "troviio",
    broker=os.getenv("CELERY_BROKER_URL", "redis://redis:6379/1"),
    backend=os.getenv("CELERY_RESULT_BACKEND", "redis://redis:6379/2"),
    include=[
        "app.tasks.scraper",
        "app.tasks.prices",
        "app.tasks.newsletter_task",
        "app.tasks.scraping",
        "app.tasks.top3_scraper",
    ],
)

# Tâches planifiées
app.conf.beat_schedule = {
    # Mise à jour prix Amazon
    "daily-prices-morning": {
        "task": "app.tasks.prices.update_amazon_prices",
        "schedule": crontab(hour=7, minute=0),
    },
    "daily-prices-evening": {
        "task": "app.tasks.prices.update_amazon_prices",
        "schedule": crontab(hour=19, minute=0),
    },
    # Scraping bi-mensuel des nouveaux produits (1er et 15 du mois à 3h00)
    "bi-monthly-scraping": {
        "task": "app.tasks.newsletter_task.scrape_new_products",
        "schedule": crontab(hour=3, minute=0, day_of_month="1,15"),
    },
    # Newsletter mensuelle — envoi le 2 et le 16 à 10h00 (après le scraping)
    "monthly-newsletter": {
        "task": "app.tasks.newsletter_task.send_monthly_newsletter",
        "schedule": crontab(hour=10, minute=0, day_of_month="2,16"),
    },
    # Top 3 hebdomadaire — chaque dimanche 4h00 (complément)
    "weekly-top3": {
        "task": "app.tasks.top3_scraper.run_top3_cycle",
        "schedule": crontab(hour=4, minute=0, day_of_week="sunday"),
    },
}

app.conf.timezone = "Europe/Paris"
app.conf.task_serializer = "json"
app.conf.result_serializer = "json"
app.conf.accept_content = ["json"]
app.conf.task_track_started = True
app.conf.task_time_limit = 1200
app.conf.task_soft_time_limit = 1080
app.conf.worker_prefetch_multiplier = 1
app.conf.worker_max_tasks_per_child = 100

# Routing
app.conf.task_routes = {
    "troviio.scraping.run_product_pipeline": {"queue": "scraping"},
    "app.tasks.scraping.*": {"queue": "scraping"},
}
