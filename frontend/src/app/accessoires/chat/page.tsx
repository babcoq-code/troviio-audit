"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useChatStream } from "@/hooks/useChatStream";
import type { ChatMessage } from "@/types/chat";
import ChatBubble from "@/components/ChatBubble";

export default function AccessoriesChatPage() {
  const [input, setInput] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const { state, messages, streamedResponse, error, sendMessage } = useChatStream();
  const busy = state === "loading" || (state === "response" && streamedResponse.length > 0);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const msg = input.trim();
    if (!msg || busy) return;
    setInput("");
    await sendMessage(msg, { history: messages, forceAccessory: true });
  };

  const handleKey = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSubmit();
    }
  };

  const handleSuggestion = async (value: string) => {
    if (busy) return;
    await sendMessage(value, { history: messages, forceAccessory: true });
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, streamedResponse]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium"
               style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            <span className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: "#22C55E", boxShadow: "0 0 12px rgba(34,197,94,0.9)" }} />
            Accessoires IA
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl"
              style={{ color: "var(--text)" }}>
            Trouve les accessoires parfaits 🛠️
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base"
             style={{ color: "var(--text-muted)" }}>
            Donne le modèle de ton appareil, réponds à 1 ou 2 questions, et
            Troviio trouve les accessoires compatibles.
          </p>
        </div>

        {/* Chat history */}
        <div className="rounded-3xl border p-5"
             style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div
            ref={chatRef}
            className="max-h-80 space-y-3 overflow-y-auto pr-2"
          >
            {messages.length === 0 && (
              <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                Dis-moi quel appareil tu as !<br />
                <span className="text-xs">
                  Ex: &quot;Roborock Qrevo S&quot;, &quot;Dreame L10s Ultra&quot;,
                  &quot;Samsung TV 65S90F&quot;, &quot;Dyson V15&quot;...
                </span>
              </p>
            )}
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                role={msg.role === "user" ? "user" : "ai"}
                text={msg.content}
                result_id={msg.result_id ?? undefined}
                onSuggestionSelect={msg.role === "assistant" ? handleSuggestion : undefined}
              />
            ))}

            {/* Stream du texte */}
            {streamedResponse && (
              <div className="flex justify-start">
                <ChatBubble
                  role="ai"
                  text={streamedResponse}
                  onSuggestionSelect={handleSuggestion}
                />
              </div>
            )}

            {/* Loader */}
            {state === "loading" && !streamedResponse && (
              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-500" />
                Troviio réfléchit...
              </div>
            )}

            {/* Erreur */}
            {error && (
              <div className="rounded-2xl border px-4 py-3 text-sm"
                   style={{ borderColor: "rgba(255,107,95,0.2)", backgroundColor: "rgba(255,107,95,0.08)", color: "var(--coral-light)" }}>
                ⚠️ Service momentanément indisponible.
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex gap-2">
              <textarea
                ref={taRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                disabled={busy}
                placeholder="Marque et modèle de ton appareil..."
                className="flex-1 resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition disabled:opacity-50"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg)",
                  color: "var(--text)",
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                className="rounded-full px-6 py-3 text-sm font-bold text-white transition disabled:opacity-50"
                style={{ backgroundColor: "var(--coral)" }}
              >
                {busy ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white inline-block" />
                ) : (
                  "🔍"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Modèles populaires */}
        {messages.length === 0 && (
          <div className="mt-8">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider"
               style={{ color: "var(--text-muted)" }}>
              Modèles populaires
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Roborock Qrevo S",
                "Dreame L10s Ultra",
                "Samsung TV 65S90F",
                "Dyson V15 Detect",
                "Roomba j7+",
                "Nespresso Vertuo",
              ].map((model) => (
                <button
                  key={model}
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setInput(model);
                    taRef.current?.focus();
                  }}
                  className="rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)", color: "var(--text-muted)" }}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reset */}
        {messages.length > 0 && state !== "done" && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-sm underline"
              style={{ color: "var(--text-muted)" }}
            >
              ← Recommencer
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
