from __future__ import annotations
import html
import logging
from telegram import Update
from telegram.constants import ParseMode
from telegram.ext import ContextTypes, ConversationHandler
import httpx

from app.keyboards import (
    CALLBACK_APPROVE, CALLBACK_CANCEL, CALLBACK_PREVIEW,
    CALLBACK_SEND, CALLBACK_STATS, CALLBACK_TEST,
    approved_keyboard, draft_keyboard,
)
from app.models import NewsletterDraft, DraftStatus
from app.security import restricted
from app.services.brevo_client import BrevoClient
from app.services.fastapi_client import FastAPIClient
from app.services.store import DraftStore

logger = logging.getLogger(__name__)
WAITING_FOR_GENERATION, WAITING_FOR_APPROVAL, APPROVED, SENT = range(4)


def _fmt_draft(draft: NewsletterDraft) -> str:
    return (
        "📰 <b>Newsletter générée</b>\n\n"
        f"<b>ID :</b> <code>{html.escape(draft.draft_id)}</code>\n"
        f"<b>Mois :</b> {html.escape(draft.month)}\n"
        f"<b>Thème :</b> {html.escape(draft.theme or 'Non précisé')}\n"
        f"<b>Objet :</b> {html.escape(draft.subject)}\n"
        f"<b>Statut :</b> {html.escape(draft.status.value)}\n\n"
        f"<b>Résumé :</b>\n{html.escape(draft.summary)}"
    )


def _fmt_preview(draft: NewsletterDraft) -> str:
    text = draft.text or draft.summary
    return (
        "👀 <b>Preview newsletter</b>\n\n"
        f"<b>Objet :</b> {html.escape(draft.subject)}\n\n"
        f"{html.escape(text[:3500])}"
    )


@restricted
async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.effective_message.reply_text(
        "👋 <b>Hermes — Agent Newsletter TROViiO</b>\n\n"
        "Commandes :\n"
        "/generate [mois] [theme] — Générer\n"
        "/preview — Voir le brouillon\n"
        "/approve — Approuver\n"
        "/test — Email de test\n"
        "/send — Envoyer\n"
        "/stats — Statistiques\n"
        "/cancel — Annuler",
        parse_mode=ParseMode.HTML,
    )
    return ConversationHandler.END


@restricted
async def cmd_generate(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    args = context.args or []
    if not args:
        await update.effective_message.reply_text(
            "Usage : /generate [mois] [theme]\n"
            "Exemple : /generate juin-2026 climatiseurs"
        )
        return WAITING_FOR_GENERATION

    month = args[0]
    theme = " ".join(args[1:]) if len(args) > 1 else None

    msg = await update.effective_message.reply_text(
        f"⏳ Génération newsletter <b>{html.escape(month)}</b>...",
        parse_mode=ParseMode.HTML,
    )

    try:
        draft = await FastAPIClient().generate_newsletter(month=month, theme=theme)
        await DraftStore().save(draft)
        await msg.edit_text(
            _fmt_draft(draft),
            parse_mode=ParseMode.HTML,
            reply_markup=draft_keyboard(),
        )
        return WAITING_FOR_APPROVAL
    except httpx.HTTPStatusError as exc:
        await msg.edit_text(
            f"❌ Erreur API : HTTP {exc.response.status_code}\n"
            f"<code>{html.escape(exc.response.text[:800])}</code>",
            parse_mode=ParseMode.HTML,
        )
        return ConversationHandler.END
    except Exception as exc:
        await msg.edit_text(
            f"❌ Erreur : <code>{html.escape(str(exc))}</code>",
            parse_mode=ParseMode.HTML,
        )
        return ConversationHandler.END


@restricted
async def cmd_preview(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    draft = await DraftStore().load()
    if not draft:
        await update.effective_message.reply_text("Aucun brouillon en cours.")
        return ConversationHandler.END
    keyboard = draft_keyboard() if draft.status == DraftStatus.GENERATED else approved_keyboard()
    await update.effective_message.reply_text(
        _fmt_preview(draft),
        parse_mode=ParseMode.HTML,
        reply_markup=keyboard,
    )
    return WAITING_FOR_APPROVAL if draft.status == DraftStatus.GENERATED else APPROVED


@restricted
async def cmd_approve(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    store = DraftStore()
    draft = await store.load()
    if not draft:
        await update.effective_message.reply_text("Aucun brouillon à approuver.")
        return ConversationHandler.END
    if draft.status == DraftStatus.SENT:
        await update.effective_message.reply_text("Cette newsletter a déjà été envoyée.")
        return SENT
    draft.status = DraftStatus.APPROVED
    await store.save(draft)
    await update.effective_message.reply_text(
        "✅ <b>Newsletter approuvée.</b>\n\nClique sur Envoyer ou utilise /send.",
        parse_mode=ParseMode.HTML,
        reply_markup=approved_keyboard(),
    )
    return APPROVED


@restricted
async def cmd_test(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    draft = await DraftStore().load()
    if not draft:
        await update.effective_message.reply_text("Aucun brouillon pour le test.")
        return ConversationHandler.END
    await update.effective_message.reply_text("🧪 Envoi du test email...")
    try:
        await BrevoClient().send_test_email(draft)
        await update.effective_message.reply_text(
            "✅ Test email envoyé !",
            reply_markup=draft_keyboard(),
        )
    except Exception as exc:
        await update.effective_message.reply_text(
            f"❌ Erreur test : <code>{html.escape(str(exc))}</code>",
            parse_mode=ParseMode.HTML,
        )
    return WAITING_FOR_APPROVAL


@restricted
async def cmd_send(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    store = DraftStore()
    draft = await store.load()
    if not draft:
        await update.effective_message.reply_text("Aucun brouillon à envoyer.")
        return ConversationHandler.END
    if draft.status == DraftStatus.SENT:
        await update.effective_message.reply_text("Déjà envoyée.")
        return SENT
    if draft.status != DraftStatus.APPROVED:
        await update.effective_message.reply_text("⚠️ Approuve d'abord avec /approve.")
        return WAITING_FOR_APPROVAL
    await update.effective_message.reply_text("📤 Envoi en cours via Brevo...")
    try:
        result = await BrevoClient().send_campaign(draft)
        draft.status = DraftStatus.SENT
        await store.save(draft)
        await update.effective_message.reply_text(
            f"✅ <b>Newsletter envoyée !</b>\n\n"
            f"Campaign ID : <code>{result.get('campaign_id', 'N/A')}</code>",
            parse_mode=ParseMode.HTML,
        )
        return SENT
    except Exception as exc:
        await update.effective_message.reply_text(
            f"❌ Erreur envoi : <code>{html.escape(str(exc))}</code>",
            parse_mode=ParseMode.HTML,
        )
        return APPROVED


@restricted
async def cmd_stats(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    draft = await DraftStore().load()
    if not draft:
        await update.effective_message.reply_text("Aucun brouillon.")
        return ConversationHandler.END
    try:
        s = await FastAPIClient().get_stats(draft.draft_id)
        await update.effective_message.reply_text(
            "📊 <b>Statistiques newsletter</b>\n\n"
            f"<b>Envoyés :</b> {s.sent_count}\n"
            f"<b>Délivrés :</b> {s.delivered_count}\n"
            f"<b>Taux de clic :</b> {(s.click_rate or 0):.2%}\n"
            f"<b>Taux d'ouverture :</b> {(s.open_rate or 0):.2%}",
            parse_mode=ParseMode.HTML,
        )
    except Exception as exc:
        await update.effective_message.reply_text(
            f"❌ Erreur stats : <code>{html.escape(str(exc))}</code>",
            parse_mode=ParseMode.HTML,
        )
    return ConversationHandler.END


@restricted
async def cmd_cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    store = DraftStore()
    draft = await store.load()
    if draft:
        draft.status = DraftStatus.CANCELLED
        await store.save(draft)
    await update.effective_message.reply_text("❌ Opération annulée.")
    return ConversationHandler.END


@restricted
async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    if not query:
        return ConversationHandler.END
    await query.answer()
    action = query.data

    dispatch = {
        "preview":   cmd_preview,
        "approve":   cmd_approve,
        "send":      cmd_send,
        "test_send": cmd_test,
        "stats":     cmd_stats,
        "cancel":    cmd_cancel,
    }

    handler = dispatch.get(action)
    if handler:
        return await handler(update, context)

    await query.edit_message_text("Action inconnue.")
    return ConversationHandler.END
