"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useChatStream } from "@/hooks/useChatStream";
// @ts-ignore - hooks in src/
import type { ChatMessage } from "@/types/chat";
import ChatBubble from "@/components/ChatBubble";

const STORAGE_KEY = "troviio.chat.history.v2";

const PLACEHOLDERS = [
  "Robot aspirateur pour 70m² avec un chien, parquet clair...",
  "Machine à café silencieuse pour cuisine ouverte sur salon...",
  "TV OLED pour salon très lumineux, budget 1 200€...",
  "Smartphone photo avec bonne autonomie, moins de 800€...",
];

const CHIPS = [
  "🤖 Robot aspirateur",
  "☕ Machine café",
  "📺 TV OLED",
  "📱 Smartphone photo",
  "🚲 Vélo électrique",
];

export default function ChatHero({ category }: { category?: string }) {
  const [input, setInput] = useState("");
  const [pidx, setPidx] = useState(0);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const respRef = useRef<HTMLDivElement>(null);
  const { state, messages, streamedResponse, error, sendMessage, setMessages } = useChatStream();

  const busy = state === "loading" || (state === "response" && streamedResponse.length > 0);

  useEffect(() => {
    const id = window.setInterval(() => setPidx((i) => (i + 1) % PLACEHOLDERS.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch { window.localStorage.removeItem(STORAGE_KEY); }
  }, [setMessages]);

  useEffect(() => {
    if (messages.length === 0) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-12)));
  }, [messages]);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(Math.max(ta.scrollHeight, 72), 144)}px`;
  }, [input]);

  useEffect(() => {
    if (streamedResponse && respRef.current) {
      respRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [streamedResponse]);

  useEffect(() => {
    const fn = (e: Event) => {
      const ev = e as CustomEvent<{ prompt?: string }>;
      const p = ev.detail?.prompt?.trim();
      if (p) {
        setInput(p);
        window.setTimeout(() => taRef.current?.focus(), 50);
      }
    };
    window.addEventListener("troviio:open-chat-category", fn);
    return () => window.removeEventListener("troviio:open-chat-category", fn);
  }, []);

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    const t = input.trim();
    if (!t || busy) return;
    setInput("");
    await sendMessage(t, { category, history: messages });
  };

  const handleKey = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); await submit(); }
  };

  /** Callback quand l'utilisateur clique sur une suggestion chip */
  const handleSuggestion = async (value: string) => {
    if (busy) return;
    await sendMessage(value, { category, history: messages });
  };

  // Filtrer le dernier message assistant steamé + les messages historiques à afficher
  const historyMessages = messages.filter((m) => {
    // On garde tout sauf le dernier s'il est en cours de stream
    return true;
  });

  return (
    <section
      id="chat-hero"
      className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 troviio-hero-radial" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
             style={{ backgroundColor: "#FF6B2B", opacity: 0.13 }} />
        <div className="absolute inset-x-0 top-0 h-px"
             style={{ background: "linear-gradient(to right, transparent, #FF6B2B, transparent)", opacity: 0.35 }} />
      </div>

      <div className="mx-auto w-full max-w-4xl flex flex-col items-center">

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-xl"
             style={{ borderColor: "#1E1E24", backgroundColor: "#111113", color: "#FAFAFA" }}>
          <span className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "#22C55E", boxShadow: "0 0 12px rgba(34,197,94,0.9)" }} />
          IA produit en ligne
        </div>

        <div className="max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ color: "#FAFAFA" }}>
            Décris ton besoin.
            <span className="block" style={{ color: "#FF6B2B" }}>
              Troviio trouve le bon produit.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-7"
             style={{ color: "#8B8B9A" }}>
            Pas de filtres interminables. Explique ton usage, ton budget, tes contraintes — l'IA fait le tri.
          </p>
        </div>

        {/* Historique des messages (si on a déjà parlé) */}
        {messages.length > 0 && (
          <div className="mt-8 w-full space-y-3 max-h-80 overflow-y-auto pr-2">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                role={msg.role === "user" ? "user" : "ai"}
                text={msg.content}
                onSuggestionSelect={msg.role === "assistant" ? handleSuggestion : undefined}
              />
            ))}
          </div>
        )}

        {/* Message en cours de stream */}
        {(streamedResponse || (state === "loading" && !streamedResponse)) && (
          <div
            ref={respRef}
            className="mt-3 w-full rounded-3xl border p-5 shadow-xl"
            style={{ borderColor: "#1E1E24", backgroundColor: "rgba(17,17,19,0.85)" }}
            aria-live="polite"
            aria-atomic="false"
          >
            {state === "loading" && !streamedResponse ? (
              <div className="flex items-center gap-3 text-sm" style={{ color: "#8B8B9A" }}>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-500" />
                Troviio analyse ta demande...
              </div>
            ) : streamedResponse ? (
              <ChatBubble
                role="ai"
                text={streamedResponse}
                onSuggestionSelect={handleSuggestion}
              />
            ) : null}
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="mt-4 w-full rounded-2xl border px-4 py-3 text-sm"
               style={{ borderColor: "rgba(255,107,43,0.2)", backgroundColor: "rgba(255,107,43,0.08)", color: "#FFB99A" }}>
            ⚠️ Service IA temporairement indisponible. Réponse de secours affichée.
          </div>
        )}

        <form
          onSubmit={submit}
          className="mt-8 w-full rounded-3xl border p-3 shadow-2xl"
          style={{ borderColor: "#1E1E24", backgroundColor: "rgba(17,17,19,0.92)" }}
        >
          <div className="relative">
            {!input && (
              <div
                key={pidx}
                className="pointer-events-none absolute left-4 top-4 select-none text-sm sm:text-base troviio-placeholder-anim truncate max-w-[calc(100%-2rem)]"
                style={{ color: "#3D3D4A" }}
              >
                {PLACEHOLDERS[pidx]}
              </div>
            )}
            <textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={3}
              disabled={busy}
              aria-label="Décris le produit que tu cherches"
              className="block w-full resize-none rounded-2xl border border-transparent px-4 py-4 text-base leading-6 outline-none transition focus:border-orange-500/60 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "#0A0A0B", color: "#FAFAFA", minHeight: "72px", maxHeight: "144px" }}
            />
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setInput(chip.replace(/^[^\s]+\s/, ""));
                    window.setTimeout(() => submit(), 100);
                  }}
                  disabled={busy}
                  className="rounded-full border px-3 py-1.5 text-xs font-medium transition focus:outline-none disabled:opacity-50"
                  style={{ borderColor: "#1E1E24", backgroundColor: "#0A0A0B", color: "#8B8B9A" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,107,43,0.45)"; e.currentTarget.style.color = "#FAFAFA"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E1E24"; e.currentTarget.style.color = "#8B8B9A"; }}
                >
                  {chip}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={!input.trim() || busy}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#FF6B2B", boxShadow: "0 4px 20px rgba(255,107,43,0.35)" }}
              onMouseEnter={(e) => { if (!busy) e.currentTarget.style.backgroundColor = "#e55a20"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#FF6B2B"; }}
            >
              {busy ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Troviio réfléchit...
                </>
              ) : "Trouver le mien ✨"}
            </button>
          </div>
        </form>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm" style={{ color: "#8B8B9A" }}>
          <span>✅ Gratuit · Sans inscription</span>
          <span>🔍 22 catégories</span>
          <span>⭐ 94% de précision</span>
          <span>🔒 Données privées</span>
        </div>
      </div>
    </section>
  );
}
