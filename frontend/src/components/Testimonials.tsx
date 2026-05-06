"use client";

const TESTIMONIALS = [
  {
    quote:
      "J'ai acheté le Dreame L10s Ultra grâce à Troviio. Il ne réveille plus mon bébé quand il aspire la nuit. Un bonheur.",
    author: "Laura",
    age: 31,
  },
  {
    quote:
      "Je cherchais une machine à café mais je ne voyais que des tests sponsorisés. Troviio m'a proposé la Jura E8 qui correspond EXACTEMENT à mon usage (5 expressos par jour).",
    author: "Marc",
    age: 42,
  },
  {
    quote:
      "Je n'y connaissais rien en thermostats connectés. Le chat m'a posé les bonnes questions et m'a orienté vers le Tado°. Installé en 15 min, déjà 80€ économisés.",
    author: "Sophie",
    age: 35,
  },
  {
    quote:
      "Après 3 aspirateurs balais achetés au hasard, Troviio m'a trouvé le Dyson V15. La différence est flagrante. Plus jamais je n'achète sans demander l'IA.",
    author: "Thomas",
    age: 28,
  },
];

function QuoteIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "var(--coral)", opacity: 0.5 }}
      aria-hidden="true"
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section
      className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <p
            className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--coral)" }}
          >
            Ils ont trouvé le leur
          </p>
          <h2
            className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
            style={{ color: "var(--text)" }}
          >
            Ce que disent ceux qui ont testé
          </h2>
          <p
            className="mx-auto mt-3 max-w-xl text-sm leading-6"
            style={{ color: "var(--text-muted)" }}
          >
            Des vrais retours, pas des avis payés. Chaque histoire est une
            personne qui a arrêté de chercher.
          </p>
        </div>

        {/* Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={i}
              className="group relative flex flex-col rounded-2xl border p-6 transition duration-300 sm:p-7"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-surface)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,107,95,0.25)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px -12px rgba(255,107,95,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Quote icon */}
              <div className="mb-4">
                <QuoteIcon />
              </div>

              {/* Quote text */}
              <blockquote
                className="flex-1 text-base leading-relaxed sm:text-[15px] sm:leading-7"
                style={{ color: "var(--text)" }}
              >
                "{t.quote}"
              </blockquote>

              {/* Author */}
              <footer className="mt-5 flex items-center gap-2 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: "rgba(255,107,95,0.15)",
                    color: "var(--coral)",
                  }}
                >
                  {t.author[0]}
                </div>
                <div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    {t.author}
                  </span>
                  <span
                    className="ml-2 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t.age} ans
                  </span>
                </div>
              </footer>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            Envie d'être le prochain témoignage ?{" "}
            <a
              href="/"
              className="font-medium underline decoration-dotted underline-offset-2 transition hover:no-underline"
              style={{ color: "var(--coral)" }}
            >
              Trouve ton produit
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
