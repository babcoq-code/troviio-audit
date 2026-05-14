"use client";

const TESTIMONIALS = [
  {
    name: "Sophie L.",
    role: "35 ans, Paris",
    avatar: "👩",
    text: "J'ai testé pour un aspirateur robot. Troviio m'a posé 4 questions et m'a recommandé un modèle que je n'aurais jamais regardé. Résultat : 120€ de moins que mon premier choix et il aspire mieux.",
    product: "Dreame L40s Pro Ultra",
    score: 94,
  },
  {
    name: "Thomas M.",
    role: "42 ans, Lyon",
    avatar: "👨‍💼",
    text: "Je cherchais une machine à café silencieuse. Les guides en ligne disent tous la même chose. Troviio a analysé mon vrai besoin (cuisine ouverte, lever à 6h) et m'a conseillé une machine que je n'aurais jamais trouvée seule.",
    product: "Philips Series 5500",
    score: 89,
  },
  {
    name: "Camille D.",
    role: "28 ans, Bordeaux",
    avatar: "👩‍💻",
    text: "J'y connais rien en TV et j'avais peur de me faire arnaquer. Troviio m'a envoyé vers une OLED 65 pouces parfaite pour mon salon lumineux. 6 mois après, toujours aucun regret.",
    product: "LG G6 OLED 65\"",
    score: 92,
  },
  {
    name: "Romain B.",
    role: "31 ans, Marseille",
    avatar: "🧔",
    text: "J'ai hésité 3 semaines entre deux robots cuiseurs. Troviio a tranché en 2 minutes. Le verdict était tellement logique par rapport à mon utilisation que j'aurais dû commencer par ça.",
    product: "Magimix Cook Expert XL",
    score: 87,
  },
];

export default function Testimonials() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--bg-subtle, #0C0C0E)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
            💬 Vrais utilisateurs, vrais avis
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "'Sora', sans-serif", color: "var(--text)" }}>
            Ils ont trouvé <span style={{ color: "var(--coral)" }}>le leur</span>
          </h2>
          <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
            Et ils ne regrettent pas leur achat. Promis, on vous les a pas payés.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={i}
              className="relative flex flex-col rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              {/* Avatar + nom */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{t.avatar}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.role}</p>
                </div>
              </div>

              {/* Texte */}
              <blockquote className="flex-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                &ldquo;{t.text}&rdquo;
              </blockquote>

              {/* Badge produit */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <span className="text-xs font-medium truncate max-w-[70%]" style={{ color: "var(--text)" }}>
                  🏆 {t.product}
                </span>
                <span className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor: t.score >= 90 ? "rgba(61, 214, 163, 0.15)" : "rgba(255, 107, 95, 0.15)",
                    color: t.score >= 90 ? "#3ED6A3" : "var(--coral)",
                  }}>
                  {t.score}/100
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
