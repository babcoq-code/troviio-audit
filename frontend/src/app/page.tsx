"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { chatWithAI, subscribeNewsletter, fetchTopProducts } from "@/lib/api";
import type { Product } from "@/lib/types";
import { ScoreRing } from "@/components/ScoreRing";
import { ThinkingIndicator } from "@/components/chat/ThinkingIndicator";

const ChatBubble = dynamic(() => import("@/components/ChatBubble"), { ssr: false });
const ProductCard = dynamic(() => import("@/components/ProductCard"), { ssr: false });

const SUGGESTIONS = [
  { label: "🤖 Aspirateur robot avec animaux et parquet", value: "Aspirateur robot avec animaux et parquet" },
  { label: "☕ Machine à café silencieuse pour cuisine ouverte", value: "Machine à café silencieuse pour cuisine ouverte" },
  { label: "📺 TV OLED pour salon très lumineux, budget 1 200€", value: "TV OLED pour salon très lumineux, budget 1 200€" },
];

const CATEGORIES = [
  {
    label: "🤖 Aspirateur robot",
    cat: "aspirateur robot",
    sub: "Pour ton sol, tes animaux, tes meubles et ton niveau de patience.",
  },
  {
    label: "📺 TV OLED",
    cat: "tv oled",
    sub: "Pour ton salon, ta lumière, tes films, ton gaming et ton budget.",
  },
  {
    label: "☕ Machine à café",
    cat: "machine à café",
    sub: "Pour ton goût, ta routine, ton bruit acceptable et ton plan de travail.",
  },
  { label: "🎧 Casque audio", cat: "casque audio", sub: "" },
  { label: "💻 Laptop étudiant", cat: "ordinateur étudiant", sub: "" },
];

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "ai"; text: string; result_id?: string | null }[]>([]);
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

      // ✅ AJOUT : stocker result_id dans le message IA
      setChat((prev) => [
        ...prev,
        { role: "ai", text: aiText, result_id: res.result_id ?? null },
      ]);
      setHistory((prev) => [
        ...prev,
        { role: "user", content: userMsg },
        { role: "assistant", content: aiText },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "Désolé, une erreur s'est produite. Réessaie !", result_id: null },
      ]);
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
          <span className="text-xs text-muted hidden sm:block tracking-wide uppercase">Le conseiller maison</span>
        </div>
      </header>

      {/* ══════════════════════════════════════
          1. HERO
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4">
        {/* Glow background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blueberry/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
              <span className="text-white/80">IA nourrie par des milliers d&apos;avis — guidée par TA vie</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium backdrop-blur-sm">
              <span className="text-white/80">Zéro biais. Transparence totale. Zéro pression.</span>
            </div>
          </div>

          {/* H1 */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-3 tracking-tight"
            style={{ fontFamily: "Sora, Inter, sans-serif" }}
          >
            <span style={{
              background: "linear-gradient(135deg, #FF6B5F 0%, #FFB020 42%, #3ED6A3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Pas le meilleur.
            </span>
            <br />Le tien.
          </h1>

          {/* Ligne secondaire */}
          <p className="text-base sm:text-lg text-muted font-medium mb-6 tracking-wide">
            Les vendeurs vendent. Picksy trouve.
          </p>

          {/* Sous-titre */}
          <p className="text-lg text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Dis-nous comment tu vis, ce que tu veux éviter, ton budget et tes contraintes.
            Picksy croise ta vraie vie avec des milliers d&apos;avis pour te donner une réponse claire — pas une liste.
          </p>
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
                  <p className="text-sm text-muted">Picksy t&apos;accompagne étape par étape</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleSend(s.value)}
                      className="px-4 py-2 rounded-full bg-surface-light border border-white/10 text-sm font-medium hover:border-coral/50 hover:bg-white/5 transition-all text-left"
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
                    <ChatBubble
                      role={msg.role}
                      text={msg.text}
                      result_id={msg.result_id}
                      onSuggestionSelect={handleSend}
                    />
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start px-2">
                    <ThinkingIndicator />
                  </div>
                )}
                <div ref={chatEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-white/5 p-4">
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
              <input
                type="text"
                placeholder="Décris ton besoin réel : espace, budget, contraintes, usage..."
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
                {loading ? "⏳" : "Trouve le mien ✨"}
              </button>
            </form>
            <p className="text-xs text-muted text-center mt-2">
              Exemple : &ldquo;Un aspirateur robot pour 70m² avec un chien, sans y passer mes soirées.&rdquo;
            </p>
          </div>
        </div>

        {/* Score ring démo */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <div className="flex items-center gap-3 text-sm text-muted">
            <ScoreRing score={94} size="sm" />
            <span>Précision moyenne des recommandations</span>
          </div>
          <p className="text-xs text-muted">Gratuit. Sans inscription. Recommandations indépendantes.</p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. ADN PICKSY
      ══════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: "Sora, sans-serif" }}>
            Picksy ne compare pas des produits.<br />
            <span style={{
              background: "linear-gradient(135deg, #FF6B5F, #3ED6A3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Picksy comprend ta vie.</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Un bon achat n&apos;est pas universel. Il dépend de ton espace, ton budget, tes contraintes et ce que tu refuses de supporter.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: "🔍",
              title: "Tes contraintes d'abord",
              text: "Surface, bruit, animaux, enfants, place disponible, budget, usage réel : Picksy commence par ce qui compte chez toi.",
            },
            {
              icon: "📊",
              title: "Des milliers d'avis ensuite",
              text: "Picksy lit les signaux faibles : les défauts qui reviennent, les usages où le produit déçoit, les profils pour qui ça marche vraiment.",
            },
            {
              icon: "✅",
              title: "Une réponse, pas une liste",
              text: "Tu ne viens pas chercher 47 options. Tu viens chercher le choix qui a le plus de chances de marcher chez toi.",
            },
          ].map((b) => (
            <div key={b.title} className="bg-surface rounded-2xl border border-white/5 p-6">
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="font-bold text-white mb-2" style={{ fontFamily: "Sora, sans-serif" }}>{b.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. COMMENT PICKSY TROUVE LE TIEN
      ══════════════════════════════════════ */}
      <section className="max-w-3xl mx-auto px-4 mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ fontFamily: "Sora, sans-serif" }}>
          Comment Picksy trouve le tien
        </h2>
        <div className="space-y-6">
          {[
            {
              n: "1",
              title: "Tu décris ta vraie situation",
              text: "Budget, pièce, usage, contraintes, préférences et irritants.",
            },
            {
              n: "2",
              title: "Picksy lit entre les lignes",
              text: "Picksy croise les avis, les défauts récurrents et les usages réels sur des milliers de produits.",
            },
            {
              n: "3",
              title: "Tu obtiens une recommandation claire",
              text: "Pas une liste infinie. Un choix expliqué, avec les raisons de l'acheter ou de l'éviter.",
            },
          ].map((step) => (
            <div key={step.n} className="flex gap-5 items-start bg-surface rounded-2xl border border-white/5 p-6">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                style={{ background: "linear-gradient(135deg, #FF6B5F, #FFB020)" }}
              >
                {step.n}
              </div>
              <div>
                <h3 className="font-bold text-white mb-1" style={{ fontFamily: "Sora, sans-serif" }}>{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. DIFFÉRENCIATION VS COMPARATEURS
      ══════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center" style={{ fontFamily: "Sora, sans-serif" }}>
          Les comparateurs notent. Picksy choisit avec toi.
        </h2>
        <div className="rounded-2xl border border-white/5 overflow-hidden">
          <div className="grid grid-cols-2 bg-surface-light">
            <div className="p-4 text-sm font-semibold text-muted border-r border-white/5">Un comparateur classique</div>
            <div className="p-4 text-sm font-semibold" style={{ color: "#3ED6A3" }}>Picksy</div>
          </div>
          {[
            ["Classe les produits par score moyen", "Comprend ton contexte et tes contraintes"],
            ["Te laisse arbitrer seul face à 20 options", "Écarte ce qui risque de te décevoir"],
            ["Parle à tout le monde pareil", "Te donne une recommandation adaptée à TA situation"],
            ["Tests labo sans connaître ton logement", "Croise tests experts ET avis d'usage réel"],
            ["Revenus générés par l'affiliation", "Zéro biais, transparence totale"],
          ].map(([left, right], i) => (
            <div key={i} className={`grid grid-cols-2 ${i % 2 === 0 ? "bg-surface" : "bg-surface-light"}`}>
              <div className="p-4 text-sm text-muted border-r border-white/5">{left}</div>
              <div className="p-4 text-sm text-white">{right}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          5. ANTI-VENDEUR HUMAIN
      ══════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 mb-20 text-center">
        <div className="bg-surface rounded-2xl border border-white/5 p-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
            Un vendeur sans commission, sans fatigue, sans baratin.
          </h2>
          <p className="text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            Picksy ne pousse pas un stock, ne touche pas de prime et ne te fait pas choisir sous pression.
            Il garde en tête des milliers de produits, lit les avis à ta place et reste disponible quand tu veux acheter, même à 23h.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["✅ Recommandations indépendantes", "✅ Zéro pression", "✅ Disponible 24/7", "✅ 10 000+ produits analysés"].map((b) => (
              <span key={b} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          6. TOP CATÉGORIES
      ══════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
          🔥 Les choix qu&apos;on veut arrêter de regretter
        </h2>
        <div className="flex gap-3 flex-wrap mb-8">
          {CATEGORIES.map(({ label, cat, sub }) => (
            <button
              key={cat}
              onClick={() => loadTop(cat)}
              className="flex flex-col items-start px-4 py-3 rounded-xl bg-surface border border-white/8 hover:border-blueberry/50 hover:bg-surface-light text-sm font-medium transition-all text-left"
            >
              <span>{label}</span>
              {sub && <span className="text-xs text-muted mt-1 font-normal max-w-[200px]">{sub}</span>}
            </button>
          ))}
        </div>

        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          7. PREUVE QUALITATIVE — CE QUE PICKSY ÉVITE
      ══════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <h2 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: "Sora, sans-serif" }}>
          Ce que Picksy évite
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              quote: "Je voulais juste un aspirateur robot. Picksy m'a évité celui qui se bloque sous mon canapé.",
              cas: "Cas typique : appartement 50m², meubles bas",
            },
            {
              quote: "Picksy m'a surtout demandé combien de bruit j'acceptais le matin. Pas la machine à café qui me convenait.",
              cas: "Cas typique : cuisine ouverte sur salon",
            },
            {
              quote: "La TV la mieux notée n'était pas la meilleure pour mon salon très lumineux.",
              cas: "Cas typique : pièce très éclairée",
            },
          ].map((t, i) => (
            <div key={i} className="bg-surface rounded-2xl border border-white/5 p-6 flex flex-col gap-3">
              <p className="text-white leading-relaxed text-sm italic">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-xs text-muted mt-auto">{t.cas}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          8. NEWSLETTER
      ══════════════════════════════════════ */}
      <section className="max-w-2xl mx-auto px-4 mb-20">
        <div className="rounded-2xl border border-white/5 p-8 text-center" style={{ background: "linear-gradient(135deg, #1A1D2E, #242840)" }}>
          <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
            💌 Rentre chez toi. Picksy s&apos;occupe du choix.
          </h3>
          <p className="text-sm text-muted mb-6">
            Chaque semaine, reçois des recommandations pensées pour la vraie vie : petits espaces, budgets serrés, animaux, enfants, bruit, entretien, durabilité.
          </p>
          {subscribed ? (
            <p className="font-semibold" style={{ color: "#3ED6A3" }}>✅ Parfait, tu es inscrit !</p>
          ) : (
            <form className="flex gap-2 max-w-md mx-auto" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Ton email"
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
                Recevoir les bons choix →
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          9. CTA FINAL
      ══════════════════════════════════════ */}
      <section className="max-w-3xl mx-auto px-4 mb-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "Sora, sans-serif" }}>
          Tu n&apos;as pas besoin du meilleur produit.
        </h2>
        <p className="text-lg text-muted mb-8">
          Tu as besoin de celui qui va vraiment marcher chez toi.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              background: "linear-gradient(135deg, #FF6B5F, #FFB020)",
              boxShadow: "0 8px 32px rgba(255,107,95,0.35)",
            }}
            className="px-8 py-4 rounded-full text-white text-base font-bold hover:-translate-y-0.5 transition-all"
          >
            Trouve le mien ✨
          </button>
          <a
            href="#adn"
            className="text-sm text-muted underline underline-offset-4 hover:text-white transition-colors"
          >
            Comprendre la méthode →
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════
          10. FOOTER
      ══════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted mb-6">
            <a href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="/politique-confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</a>
            <a href="/affiliation" className="hover:text-white transition-colors">Affiliation Amazon</a>
            <a href="/methodologie" className="hover:text-white transition-colors">Méthodologie</a>
            <a href="/a-propos" className="hover:text-white transition-colors">À propos</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          {/* Brand + copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted border-t border-white/5 pt-6">
            <div className="flex items-center gap-3">
              <img src="/logo-icon.svg" alt="" style={{ height: 24, opacity: 0.7 }} />
              <span className="font-semibold text-white">Picksy</span>
              <span>· Le conseiller maison pour tes achats maison</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs">Liens affiliés Amazon · Recommandations indépendantes</span>
              <span className="hidden sm:inline">·</span>
              <span>© 2026 Picksy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
