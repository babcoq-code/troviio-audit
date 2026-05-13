"use client";

export default function HowItWorks() {
  const steps = [
    {
      num: "1",
      emoji: "💬",
      title: "Décris ton besoin",
      desc: "Budget, usage, contraintes — en langage naturel, comme tu parlerais à un pote.",
    },
    {
      num: "2",
      emoji: "🤖",
      title: "L'IA pose les bonnes questions",
      desc: "Troviio affine ton profil en 3-4 questions. Pas de blabla, que de l'utile.",
    },
    {
      num: "3",
      emoji: "🎯",
      title: "Tu reçois TA reco",
      desc: "Un seul produit. Pas un Top 10. Celui qui est fait pour toi, point.",
    },
  ];

  return (
    <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--bg-surface, #111113)" }}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--coral)" }}>
            Comment ça marche
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "var(--text)" }}>
            Trouve le bon produit en <span style={{ color: "var(--coral)" }}>90 secondes</span>
          </h2>
          <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
            Pas de compte, pas de piège, pas de pub déguisée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center p-6 rounded-2xl border"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
              {/* Numéro */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold mb-4"
                style={{ backgroundColor: "var(--coral)", color: "white" }}>
                {step.num}
              </div>
              {/* Emoji */}
              <div className="text-4xl mb-3">{step.emoji}</div>
              {/* Titre */}
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>{step.title}</h3>
              {/* Desc */}
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{step.desc}</p>
              {/* Connecteur mobile */}

            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href="#hero"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: "var(--coral)" }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
            }}>
            🎯 Commencer mon diagnostic
          </a>
        </div>
      </div>
    </section>
  );
}
