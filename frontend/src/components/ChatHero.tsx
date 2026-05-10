"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useChatStream } from "@/hooks/useChatStream";
// @ts-ignore - hooks in src/
import type { ChatMessage } from "@/types/chat";
import ChatBubble from "@/components/ChatBubble";

const STORAGE_KEY = "troviio.chat.history.v2";

const PLACEHOLDERS = [
  "Studio 30m², un chat productif en poils, je déteste passer l'aspirateur...",
  "Machine à café silencieuse pour cuisine ouverte, je me lève à 6h...",
  "TV OLED pour salon lumineux, gaming 120Hz, budget 1 500€ max...",
  "Smartphone avec bonne autonomie, photo correcte, moins de 700€...",
  "Station USB-C pour ne plus ramper sous le bureau comme un technicien des années 90...",
];

const CHIP_PROMPTS: Record<string, string> = {
  "🤖 Robot aspirateur": "J'ai la flemme de faire le ménage chaque jour et je cherche un robot aspirateur comme assistant propreté",
  "☕ Machine café": "Je veux un café digne de ce nom sans sortir de chez moi, tu me conseilles quelle machine ?",
  "📺 TV OLED": "J'aimerais regarder mes séries dans des noirs profonds, je cherche une TV OLED qui déchire",
  "📱 Smartphone": "Je cherche un smartphone qui correspond à mon quotidien, sans compromis sur l'autonomie",
  "🧹 Aspirateur balai": "Le sol de ma maison c'est le Far West, j'ai besoin d'un aspirateur balai qui craint rien",
  "💻 Laptop étudiant": "Je suis étudiant et j'ai pas un rond. Enfin si, un budget. Quel laptop me conseilles-tu sans que je doive vendre un rein ?",
  "🎮 Laptop gamer": "Je veux un laptop qui fait tourner Cyberpunk en ultra sans ressembler à un sapin de Noël. Des idées ?",
  "🔊 Enceinte BT": "Je cherche une enceinte Bluetooth portable pour l'apéro en terrasse et la douche. Des recommandations ?",
  "🚲 Vélo électrique": "Je veux remplacer ma voiture pour les trajets quotidiens, tu me conseilles quel vélo électrique ?",
  "⌚ Montre connectée": "Je cherche une montre connectée qui me suit à la salle, au bureau et au lit. Pas besoin de satellite, juste une bonne batterie et des notifs fiables.",
  "🚗 Voiture électrique": "Je veux passer à l'électrique mais j'y connais rien. Entre autonomie, recharge et bonus, tu m'aides à y voir clair ?",
  "🔌 Station USB-C": "J'en ai marre de ramper sous mon bureau pour brancher mon laptop, ma batterie externe et mon téléphone en même temps. Trouve-moi une station USB-C qui me sauve la vie (et mon dos).",
  "🔋 Dock Thunderbolt": "Je veux un dock Thunderbolt pour brancher tous mes périphériques et deux écrans 4K sans que mon laptop choke. Une station d'accueil digne de ce nom, quoi.",
};
const CHIP_CATEGORIES: Record<string, string> = {
  "🤖 Robot aspirateur": "aspirateur-robot",
  "☕ Machine café": "machine-a-cafe",
  "📺 TV OLED": "tv",
  "📱 Smartphone": "smartphone",
  "🧹 Aspirateur balai": "aspirateur-balai",
  "💻 Laptop étudiant": "ordinateur-portable",
  "🎮 Laptop gamer": "laptop-gamer",
  "🔊 Enceinte BT": "enceinte-bt",
  "🚲 Vélo électrique": "velo-electrique",
  "🔌 Station USB-C": "station-charge-usb-c",
  "🔋 Dock Thunderbolt": "station-daccueil-usbc",
  "⌚ Montre connectée": "montre-connectee",
  "🚗 Voiture électrique": "voiture-electrique",
};
const CHIPS = Object.keys(CHIP_CATEGORIES);

const LOADING_MESSAGES = [
  "On interroge les fiches techniques...",
  "On sépare le vrai du marketing...",
  "Sur 240 offres, on garde 3 candidats...",
  "Analyse croisée en cours...",
  "On élimine les 'numéro 1'...",
  "L'IA cherche pour de vrai...",
  "On lit les avis à votre place...",
  "On compare les specs qui comptent...",
  "Nos robots fouillent Amazon...",
  "On prépare le verdict...",
];

// ── Lancer recherche trigger ───────────────────────────────────────────────────
// Détecte si le dernier message assistant contient "Lancer la recherche"
function hasLaunchOption(text: string): boolean {
  const lower = text.toLowerCase();
  return lower.includes("lancer la recherche") || lower.includes("lance la recherche") || lower.includes("🚀");
}

export default function ChatHero({ category }: { category?: string }) {
  const [input, setInput] = useState("");
  const [pidx, setPidx] = useState(0);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const respRef = useRef<HTMLDivElement>(null);
  const { state, messages, streamedResponse, error, sendMessage, reset, setMessages } = useChatStream();

  const busy = state === "loading" || (state === "response" && streamedResponse.length > 0);
  // Un échange = un message utilisateur (les history sont déjà envoyés)
  const exchangeCount = useMemo(() => messages.filter(m => m.role === "user").length + 1, [messages]);

  useEffect(() => {
    const id = window.setInterval(() => setPidx((i) => (i + 1) % PLACEHOLDERS.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  // Faire tourner les loading messages
  useEffect(() => {
    if (state !== "loading") return;
    const id = window.setInterval(() => setLoadingMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length), 1800);
    return () => window.clearInterval(id);
  }, [state]);

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

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [categoryFromEvent, setCategoryFromEvent] = useState<string | undefined>(category);

  // Lire la catégorie du category prop et de l'event — et la conserver après clic sur chip
  const [persistedCategory, setPersistedCategory] = useState<string | undefined>(category);
  const activeCategory = persistedCategory || category || categoryFromEvent;

  useEffect(() => {
    const fn = async (e: Event) => {
      const ev = e as CustomEvent<{ prompt?: string; category?: string; autoSend?: boolean }>;
      const p = ev.detail?.prompt?.trim();
      const cat = ev.detail?.category?.trim();
      if (p) {
        // Toujours préremplir l'input (fallback si sendMessage échoue)
        setInput(p);
        if (cat) setCategoryFromEvent(cat);

        // Si autoSend est présent, soumettre directement le message
        if (ev.detail?.autoSend) {
          await sendMessage(p, { category: cat || activeCategory, history: messages });
        } else {
          window.setTimeout(() => taRef.current?.focus(), 50);
        }
      }
    };
    window.addEventListener("troviio:open-chat-category", fn);
    return () => window.removeEventListener("troviio:open-chat-category", fn);
  }, [sendMessage, messages, activeCategory]);

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    const t = input.trim();
    if (!t || busy) return;
    setInput("");

    // Tracking événement
    try {
      const { trackEvent } = await import("@/lib/analytics");
      trackEvent("chat_message_sent", {
        category: activeCategory || "unknown",
        message_length: t.length,
        turn_number: exchangeCount,
      });
    } catch {}

    await sendMessage(t, { category: activeCategory, history: messages });
  };

  const handleKey = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); await submit(); }
  };

  /** Callback quand l'utilisateur clique sur une suggestion chip */
  const handleSuggestion = async (value: string) => {
    if (busy) return;
    await sendMessage(value, { category: activeCategory, history: messages });
  };

  /** Déclencher la recherche */
  const handleLaunch = async () => {
    if (busy) return;
    await sendMessage("Lance", { category: activeCategory, history: messages });
  };

  // Auto-scroll vers le bas à chaque nouveau message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  /** Clear complet : réinitialise le state + localStorage */
  const handleNewChat = () => {
    reset();
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem("troviio.chat.history.v2");
    if (taRef.current) taRef.current.focus();
  };

  // Vérifier si le dernier message assistant propose "Lancer la recherche"
  const lastAIMessage = useMemo(() => {
    const aiMsgs = messages.filter((m) => m.role === "assistant" && !m.result_id);
    return aiMsgs[aiMsgs.length - 1]?.content || streamedResponse || "";
  }, [messages, streamedResponse]);
  // Le bouton apparaît si :
  // - DeepSeek a explicitement proposé "Lancer la recherche" dans son texte, OU
  // - On est au tour 5 ou plus (le SYTEM_PROMPT demande d'ajouter l'option à partir du tour 5)
  const showLaunchButton = (lastAIMessage && hasLaunchOption(lastAIMessage)) || (!busy && exchangeCount >= 5);

  return (
    <section
      id="chat-hero"
      className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 troviio-hero-radial" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
             style={{ backgroundColor: "var(--coral)", opacity: 0.13 }} />
        <div className="absolute inset-x-0 top-0 h-px"
             style={{ background: "linear-gradient(to right, transparent, var(--coral), transparent)", opacity: 0.35 }} />
      </div>

      <div className="mx-auto w-full max-w-4xl flex flex-col items-center">

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-xl"
             style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text)" }}>
          <span className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "#22C55E", boxShadow: "0 0 12px rgba(34,197,94,0.9)" }} />
          IA produit active
        </div>

        <div className="max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ color: "var(--text)" }}>
            Arrêtez de regretter
            <span className="block" style={{ color: "var(--coral)" }}>
              vos achats Amazon.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-7"
             style={{ color: "var(--text-muted)" }}>
            73% des acheteurs se trompent de produit. Troviio vous pose les bonnes questions,
            analyse 1000+ avis vérifiés et vous évite les mauvaises surprises. En 90 secondes.
          </p>
        </div>

        {/* Proof Points — 4 colonnes sous le hero */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {[
            ["🎯", "Reco personnalisée", "Pas un Top 10 générique"],
            ["📊", "1000+ avis analysés", "Sources vérifiées"],
            ["⏱️", "Résultat en 90s", "Pas de scroll infini"],
            ["💰", "100% gratuit", "On vit grâce aux marchands"],
          ].map(([emoji, title, sub]) => (
            <div
              key={title}
              className="flex flex-col items-center text-center p-3 rounded-xl border border-white/5 bg-white/[0.02]"
            >
              <span className="text-xl mb-1">{emoji}</span>
              <span className="text-xs font-semibold text-white/80">{title}</span>
              <span className="text-[10px] text-white/40 mt-0.5">{sub}</span>
            </div>
          ))}
        </div>

        {/* Historique des messages */}
        {messages.length > 0 && (
          <>
          <div className="mt-6 mb-2 flex w-full items-center justify-end">
            <button
              type="button"
              onClick={handleNewChat}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition hover:bg-white/10 focus:outline-none"
              style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Nouvelle conversation
            </button>
          </div>
          <div ref={chatContainerRef} className="w-full space-y-3 max-h-80 overflow-y-auto pr-2">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                role={msg.role === "user" ? "user" : "ai"}
                text={msg.content}
                result_id={msg.result_id ?? undefined}
                onSuggestionSelect={msg.role === "assistant" ? handleSuggestion : undefined}
              />
            ))}
          </div>
          </>
        )}

        {/* Message en cours de stream */}
        {(streamedResponse || (state === "loading" && !streamedResponse)) && (
          <div
            ref={respRef}
            className="mt-3 w-full rounded-3xl border p-5 shadow-xl"
            style={{ borderColor: "var(--border)", backgroundColor: "rgba(17,17,19,0.85)" }}
            aria-live="polite"
            aria-atomic="false"
          >
            {state === "loading" && !streamedResponse ? (
              <div className="flex items-center gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-500" />
              {LOADING_MESSAGES[loadingMsgIdx]}
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

        {/* Bouton "Lancer la recherche" — en dessous du dernier message */}
        {showLaunchButton && !busy && (
          <div className="mt-4 w-full flex justify-center">
            <button
              type="button"
              onClick={handleLaunch}
              disabled={busy}
              className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-bold text-white shadow-[0_12px_32px_rgba(229,85,74,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(229,85,74,0.6)] focus:outline-none focus:ring-4 focus:ring-orange-500/25 animate-fade-in"
              style={{ background: "linear-gradient(135deg, #FF6B5F, #e55a4d)" }}
            >
              🚀 Lancer la recherche
            </button>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="mt-4 w-full rounded-2xl border px-4 py-3 text-sm"
               style={{ borderColor: "rgba(255,107,95,0.2)", backgroundColor: "rgba(255,107,95,0.08)", color: "var(--coral-light)" }}>
            ⚠️ Service IA temporairement indisponible. Réponse de secours affichée.
          </div>
        )}

        <form
          onSubmit={submit}
          className="mt-8 w-full rounded-3xl border p-3 shadow-2xl"
          style={{ borderColor: "var(--border)", backgroundColor: "rgba(17,17,19,0.92)" }}
        >
          <div className="relative">
            {!input && (
              <div
                key={pidx}
                className="pointer-events-none absolute left-4 top-4 select-none text-sm sm:text-base troviio-placeholder-anim truncate max-w-[calc(100%-2rem)]"
                style={{ color: "var(--text-muted)" }}
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
              style={{ background: "var(--bg)", color: "var(--text)", minHeight: "72px", maxHeight: "144px" }}
            />
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    const selectedCat = CHIP_CATEGORIES[chip] || category;
                    setPersistedCategory(selectedCat);
                    const prompt = CHIP_PROMPTS[chip] || chip;
                    setInput(prompt);
                    window.setTimeout(() => {
                      sendMessage(prompt, { category: selectedCat, history: messages });
                    }, 100);
                  }}
                  disabled={busy}
                  className="rounded-full border px-3 py-1.5 text-xs font-medium transition focus:outline-none disabled:opacity-50"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)", color: "var(--text-muted)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,107,95,0.45)"; e.currentTarget.style.color = "var(--text)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                >
                  {chip}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={!input.trim() || busy}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--coral)", boxShadow: "0 4px 20px rgba(229,85,74,0.6)" }}
              onMouseEnter={(e) => { if (!busy) e.currentTarget.style.backgroundColor = "var(--coral-dark)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--coral)"; }}
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

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm" style={{ color: "var(--text-muted)" }}>
          <span>✅ Gratuit · Sans inscription</span>
          <span>🔍 41 catégories</span>
          <span>⭐ 94% de précision</span>
          <span>🔒 Données privées</span>
        </div>

        {/* Microcopy sous CTA */}
        <p className="mt-6 text-center text-xs" style={{ color: "var(--text-muted)" }}>
          Ça prend 2 min. Moins de temps que de choisir un film ce soir.
        </p>
      </div>
    </section>
  );
}
