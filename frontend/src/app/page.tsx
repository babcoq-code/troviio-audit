"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { chatWithAI, subscribeNewsletter, fetchTopProducts } from "@/lib/api";
import type { Product } from "@/lib/types";
import { ScoreRing } from "@/components/ScoreRing";

const ChatBubble = dynamic(() => import("@/components/ChatBubble"), { ssr: false });
const ProductCard = dynamic(() => import("@/components/ProductCard"), { ssr: false });

const SUGGESTIONS = [
  { label: "🤖 aspirateur robot", value: "aspirateur robot" },
  { label: "☕ machine à café", value: "machine à café" },
  { label: "📺 TV OLED", value: "TV OLED" },
];

const STATS = [
  { value: "10 000+", label: "avis analysés" },
  { value: "15", label: "catégories" },
  { value: "DeepSeek V4", label: "IA embarquée" },
];

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSend = async (overrideMsg?: string) => {
    const userMsg = (overrideMsg ?? message).trim();
    if (!userMsg || loading) return;
    setMessage("");
    setChat((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await chatWithAI(userMsg, history);
      const aiText = res.reply;
      setChat((prev) => [...prev, { role: "ai", text: aiText }]);
      setHistory((prev) => [
        ...prev,
        { role: "user", content: userMsg },
        { role: "assistant", content: aiText },
      ]);
    } catch {
      setChat((prev) => [...prev, { role: "ai", text: "Désolé, une erreur s'est produite. Réessaie !" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    try { await subscribeNewsletter(email); } catch {}
    setSubscribed(true);
  };

  const loadTop = async (cat: string) => {
    try { setProducts(await fetchTopProducts(cat)); } catch {}
  };

  return (
    <div className="min-h-screen bg-night text-white">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-night/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <img src="/logo-dark.svg" alt="Picksy" style={{ height: 34 }} />
          <span className="text-xs text-muted hidden sm:block tracking-wide uppercase">L&apos;IA anti-regret</span>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4">
        {/* Glow background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blueberry/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            <span className="text-white/80">IA entraînée sur 10 000+ avis</span>
          </div>

          {/* H1 */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight" style={{ fontFamily: "Sora, Inter, sans-serif" }}>
            Le bon produit,<br />
            <span style={{
              background: "linear-gradient(135deg, #FF6B5F 0%, #FFB020 42%, #3ED6A3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              sans le regret
            </span>
          </h1>

          {/* Sous-titre */}
          <p className="text-lg text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Dis-nous ce que tu cherches — notre IA analyse des milliers d&apos;avis
            et te recommande le meilleur choix pour <em>ta</em> situation.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-white" style={{ fontFamily: "Sora, sans-serif" }}>{s.value}</div>
                <div className="text-xs text-muted mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHAT ── */}
      <section className="max-w-2xl mx-auto px-4 mb-16">
        <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden shadow-2xl">

          {/* Messages */}
          <div className="h-[420px] overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-surface-light">
            {chat.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <div className="text-5xl">🛍️</div>
                <div>
                  <p className="font-semibold text-white text-base mb-1">Quel produit tu cherches ?</p>
                  <p className="text-sm text-muted">Notre IA t&apos;accompagne étape par étape</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleSend(s.value)}
                      className="px-4 py-2 rounded-full bg-surface-light border border-white/10 text-sm font-medium hover:border-coral/50 hover:bg-white/5 transition-all"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {chat.map((msg, i) => (
                  <div key={i}>
                    <ChatBubble role={msg.role} text={msg.text} />
                    {msg.role === "ai" && msg.text.includes("[Lancer la recherche pour moi]") && (
                      <div className="flex justify-center mt-3">
                        <button
                          onClick={() => handleSend("Lancer la recherche")}
                          style={{
                            background: "linear-gradient(135deg, #FF6B5F, #FFB020)",
                            boxShadow: "0 8px 24px rgba(255,107,95,0.35)",
                          }}
                          className="px-6 py-3 rounded-full text-white text-sm font-semibold transition-all hover:-translate-y-0.5"
                        >
                          🎯 Lancer la recherche pour moi
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-1 px-4 py-3 rounded-2xl bg-surface-light w-fit">
                    <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
                <div ref={chatEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-white/5 p-4">
            <form
              className="flex gap-2"
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            >
              <input
                type="text"
                placeholder="Ex : aspirateur robot silencieux moins de 300€…"
                className="flex-1 bg-surface-light rounded-xl px-4 py-3 text-sm outline-none border border-white/8 focus:border-coral/50 focus:ring-1 focus:ring-coral/30 transition-all text-white placeholder-muted"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                style={{ background: "linear-gradient(135deg, #FF6B5F, #E5554A)", boxShadow: "0 4px 16px rgba(255,107,95,0.3)" }}
                className="text-white px-5 py-3 rounded-xl font-semibold transition-all text-sm whitespace-nowrap disabled:opacity-40 hover:-translate-y-0.5"
              >
                {loading ? "⏳" : "Analyser ✨"}
              </button>
            </form>
          </div>
        </div>

        {/* Score ring démo */}
        <div className="flex items-center justify-center gap-3 mt-4 text-sm text-muted">
          <ScoreRing score={94} size="sm" />
          <span>Précision moyenne des recommandations</span>
        </div>
      </section>

      {/* ── TOP CATÉGORIES ── */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Sora, sans-serif" }}>🔥 Top catégories</h2>
        <div className="flex gap-3 flex-wrap mb-8">
          {[
            { label: "🤖 Aspirateur robot", cat: "aspirateur robot" },
            { label: "📺 TV OLED", cat: "tv oled" },
            { label: "☕ Machine à café", cat: "machine à café" },
            { label: "🎧 Casque audio", cat: "casque audio" },
            { label: "💻 Laptop étudiant", cat: "ordinateur étudiant" },
          ].map(({ label, cat }) => (
            <button
              key={cat}
              onClick={() => loadTop(cat)}
              className="px-4 py-2 rounded-xl bg-surface border border-white/8 hover:border-blueberry/50 hover:bg-surface-light text-sm font-medium transition-all"
            >
              {label}
            </button>
          ))}
        </div>

        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── SLOGAN ── */}
      <section className="max-w-3xl mx-auto px-4 mb-16 text-center">
        <div className="bg-surface rounded-2xl border border-white/5 p-10">
          <p className="text-2xl font-bold leading-snug" style={{ fontFamily: "Sora, sans-serif" }}>
            <span style={{
              background: "linear-gradient(135deg, #FF6B5F 0%, #FFB020 42%, #3ED6A3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              &ldquo;C&apos;est l&apos;objet qui s&apos;adapte à lui,<br />pas l&apos;inverse.&rdquo;
            </span>
          </p>
          <p className="text-sm text-muted mt-3">La philosophie Picksy</p>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="max-w-2xl mx-auto px-4 mb-20">
        <div className="rounded-2xl border border-white/5 p-8 text-center" style={{ background: "linear-gradient(135deg, #1A1D2E, #242840)" }}>
          <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "Sora, sans-serif" }}>💌 Ne rate rien</h3>
          <p className="text-sm text-muted mb-6">Reçois les meilleures recommandations Picksy chaque semaine.</p>
          {subscribed ? (
            <p className="font-semibold" style={{ color: "#3ED6A3" }}>✅ Parfait, tu es inscrit !</p>
          ) : (
            <form className="flex gap-2 max-w-md mx-auto" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="ton@email.com"
                className="flex-1 bg-surface rounded-xl px-4 py-3 text-sm outline-none border border-white/8 focus:border-coral/50 text-white placeholder-muted"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                style={{ background: "linear-gradient(135deg, #FF6B5F, #E5554A)" }}
                className="text-white px-5 py-3 rounded-xl font-semibold transition-all text-sm whitespace-nowrap hover:-translate-y-0.5"
              >
                OK
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.svg" alt="" style={{ height: 24, opacity: 0.7 }} />
            <span className="font-semibold text-white">Picksy</span>
            <span>· L&apos;IA anti-regret pour tes achats maison</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Liens affiliés Amazon</span>
            <span>·</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
