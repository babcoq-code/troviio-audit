from __future__ import annotations
from functools import wraps
from typing import Callable, Awaitable, Any
from telegram import Update
from telegram.ext import ContextTypes
from app.config import get_settings


def is_allowed_user(update: Update) -> bool:
    user = update.effective_user
    if user is None:
        return False
    return user.id in get_settings().allowed_user_ids


def restricted(handler: Callable[[Update, ContextTypes.DEFAULT_TYPE], Awaitable[Any]]):
    @wraps(handler)
    async def wrapper(update: Update, context: ContextTypes.DEFAULT_TYPE):
        if not is_allowed_user(update):
            user = update.effective_user
            user_id = user.id if user else "unknown"
            if update.effective_message:
                await update.effective_message.reply_text(
                    f"⛔ Accès refusé. user_id={user_id}"
                )
            return None
        return await handler(update, context)
    return wrapper
