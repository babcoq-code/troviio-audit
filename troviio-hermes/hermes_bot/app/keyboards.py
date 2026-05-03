from telegram import InlineKeyboardButton, InlineKeyboardMarkup

CALLBACK_PREVIEW   = "preview"
CALLBACK_APPROVE   = "approve"
CALLBACK_SEND      = "send"
CALLBACK_TEST      = "test_send"
CALLBACK_STATS     = "stats"
CALLBACK_CANCEL    = "cancel"


def draft_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([
        [
            InlineKeyboardButton("👀 Preview",      callback_data=CALLBACK_PREVIEW),
            InlineKeyboardButton("✅ Approuver",    callback_data=CALLBACK_APPROVE),
        ],
        [
            InlineKeyboardButton("🧪 Test email",   callback_data=CALLBACK_TEST),
            InlineKeyboardButton("📤 Envoyer",      callback_data=CALLBACK_SEND),
        ],
        [
            InlineKeyboardButton("📊 Stats",        callback_data=CALLBACK_STATS),
            InlineKeyboardButton("❌ Annuler",      callback_data=CALLBACK_CANCEL),
        ],
    ])


def approved_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([
        [
            InlineKeyboardButton("📤 Envoyer maintenant", callback_data=CALLBACK_SEND),
            InlineKeyboardButton("📊 Stats",              callback_data=CALLBACK_STATS),
        ],
        [
            InlineKeyboardButton("❌ Annuler", callback_data=CALLBACK_CANCEL),
        ],
    ])
