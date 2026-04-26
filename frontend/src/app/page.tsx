"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { chatWithAI, subscribeNewsletter, fetchTopProducts } from "@/lib/api";
import type { Product } from "@/lib/types";
import { ScoreRing } from "@/components/ScoreRing";

const ChatBubble = dynamic(() => import("@/components/ChatBubble"), { ssr: false });
const ProductCard = dynamic(() => import("@/components/ProductCard"), { ssr: false });

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

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
      setChat((prev) => [...prev, { role: "ai", text: "Désolé, je n'ai pas pu répondre. Réessaie !" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    try {
      await subscribeNewsletter(email);
      setSubscribed(true);
    } catch {}
  };

  const loadTop = async (cat: string) => {
    try {
      const res = await fetchTopProducts(cat);
      setProducts(res);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-night text-white">
      <header className="sticky top-0 z-50 bg-night/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo-dark.svg" alt="Picksy" height={36} style={{ height: 36 }} />
          </div>
          <span className="text-sm text-muted hidden sm:block">L&apos;IA anti-regret</span>
        </div>
      </header>

      <section className="relative overflow-hidden pt-20 pb-16 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(66,87,255,0.15)_0%,transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blueberry/10 text-blueberry-light text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse-glow" />
            IA entraînée sur 10 000+ avis
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
            Le bon produit, <br />
            <span className="bg-gradient-to-r from-coral to-mint bg-clip-text text-transparent">sans le regret</span>
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto mb-8">
            Dis-nous ce que tu cherches, notre IA analyse des milliers d&apos;avis pour te recommander le meilleur rapport qualité-prix.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted">
            <ScoreRing score={94} size="sm" />
            <span>Précision des recommandations</span>
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 mb-12">
        <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
          <div className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {chat.length === 0 ? (
              <div className="text-center text-muted mt-16">
                <div className="text-5xl mb-4">🛍️</div>
                <p className="font-semibold text-white text-base">Quel produit tu cherches ?</p>
                <p className="text-sm mt-2">Notre IA analyse des milliers d&apos;avis pour toi</p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {["🤖 aspirateur robot", "☕ machine à café", "📺 TV OLED"].map((ex) => (
                    <button
                      key={ex}
                      onClick={() => handleSend(ex.split(" ").slice(1).join(" "))}
                      className="px-3 py-1.5 rounded-full bg-surface-light border border-white/10 text-xs font-medium hover:border-blueberry/50 transition-all"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              chat.map((msg, i) => (
                <div key={i}>
                  <ChatBubble role={msg.role} text={msg.text} />
                  {msg.role === "ai" && msg.text.includes("[Lancer la recherche pour moi]") && (
                    <div className="flex justify-center mt-2">
                      <button
                        onClick={() => handleSend("Lancer la recherche")}
                        className="px-5 py-2.5 rounded-full bg-coral hover:bg-coral-dark text-white text-sm font-semibold transition-all shadow-lg"
                      >
                        🎯 Lancer la recherche pour moi
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="border-t border-white/5 p-3">
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
              <input
                type="text"
                placeholder="Ex : aspirateur robot silencieux moins de 300€"
                className="flex-1 bg-surface-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-coral/50 border border-white/10 focus:border-coral/50 transition-all text-white placeholder-muted"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="bg-coral hover:bg-coral-dark disabled:opacity-40 text-white px-5 py-3 rounded-xl font-semibold transition-all text-sm whitespace-nowrap"
              >
                {loading ? "⏳" : "Analyser ✨"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mb-16">
        <h2 className="text-xl font-bold mb-6">🔥 Top catégories</h2>
        <div className="flex gap-3 flex-wrap mb-8">
          {["aspirateur robot", "tv oled", "machine à café"].map((cat) => (
            <button key={cat} onClick={() => loadTop(cat)} className="px-4 py-2 rounded-xl bg-surface border border-white/5 hover:border-blueberry/50 text-sm font-medium transition-all">
              {cat}
            </button>
          ))}
        </div>
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      <section className="max-w-2xl mx-auto px-4 mb-20">
        <div className="bg-gradient-to-br from-surface to-surface-light rounded-2xl border border-white/5 p-8 text-center">
          <h3 className="text-lg font-bold mb-2">💌 Ne rate rien</h3>
          <p className="text-sm text-muted mb-6">Reçois les meilleures recommandations Picksy chaque semaine.</p>
          {subscribed ? (
            <p className="text-mint font-medium">✅ Tu es inscrit !</p>
          ) : (
            <form className="flex gap-2 max-w-md mx-auto" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="ton@email.com"
                className="flex-1 bg-surface-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blueberry/50 text-white placeholder-muted"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="bg-coral hover:bg-coral-dark text-white px-5 py-3 rounded-xl font-medium transition-all text-sm whitespace-nowrap">OK</button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Picksy</span>
            <span>· L&apos;IA anti-regret pour tes achats maison</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Liens affiliés Amazon</span><span>·</span><span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
