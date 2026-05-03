from __future__ import annotations
import logging
from telegram.ext import (
    Application, CallbackQueryHandler, CommandHandler, ConversationHandler,
)
from app.config import get_settings
from app.handlers import (
    APPROVED, SENT, WAITING_FOR_APPROVAL, WAITING_FOR_GENERATION,
    cmd_approve, button_callback, cmd_cancel, cmd_generate,
    cmd_preview, cmd_send, cmd_start, cmd_stats, cmd_test,
)


def configure_logging() -> None:
    logging.basicConfig(
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
        level=get_settings().log_level.upper(),
    )


def build_application() -> Application:
    settings = get_settings()
    app = (
        Application.builder()
        .token(settings.telegram_bot_token)
        .concurrent_updates(False)
        .build()
    )

    conv = ConversationHandler(
        entry_points=[
            CommandHandler("start", cmd_start),
            CommandHandler("generate", cmd_generate),
        ],
        states={
            WAITING_FOR_GENERATION: [
                CommandHandler("generate", cmd_generate),
                CommandHandler("cancel", cmd_cancel),
            ],
            WAITING_FOR_APPROVAL: [
                CallbackQueryHandler(button_callback),
                CommandHandler("preview", cmd_preview),
                CommandHandler("approve", cmd_approve),
                CommandHandler("test", cmd_test),
                CommandHandler("send", cmd_send),
                CommandHandler("stats", cmd_stats),
                CommandHandler("cancel", cmd_cancel),
            ],
            APPROVED: [
                CallbackQueryHandler(button_callback),
                CommandHandler("send", cmd_send),
                CommandHandler("stats", cmd_stats),
                CommandHandler("cancel", cmd_cancel),
            ],
            SENT: [
                CommandHandler("stats", cmd_stats),
            ],
        },
        fallbacks=[CommandHandler("cancel", cmd_cancel)],
        allow_reentry=True,
    )

    app.add_handler(conv)
    # Commandes globales hors conversation
    for cmd, handler in [
        ("preview", cmd_preview), ("approve", cmd_approve),
        ("test", cmd_test), ("send", cmd_send),
        ("stats", cmd_stats), ("cancel", cmd_cancel),
    ]:
        app.add_handler(CommandHandler(cmd, handler))
    app.add_handler(CallbackQueryHandler(button_callback))

    return app


def main() -> None:
    configure_logging()
    application = build_application()
    logging.getLogger(__name__).info("Hermes démarre en polling...")
    application.run_polling(
        allowed_updates=["message", "callback_query"],
        close_loop=False,
    )


if __name__ == "__main__":
    main()
