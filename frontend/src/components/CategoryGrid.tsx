"use client";

import { useMemo, useState } from "react";

type Tab = "Tout" | "Maison" | "Tech" | "Mobilité" | "Confort";

interface Cat {
  id: string; label: string; desc: string;
  group: Exclude<Tab, "Tout">; emoji: string;
}

const TABS: Tab[] = ["Tout", "Maison", "Tech", "Mobilité", "Confort"];

const CATS: Cat[] = [
  { id: "aspirateurs-robots",       label: "Robot aspirateur",    desc: "Sol, animaux, patience",       group: "Maison",   emoji: "🤖" },
  { id: "aspirateurs-balai",        label: "Aspirateur balai",    desc: "Léger, puissant, sans fil",    group: "Maison",   emoji: "🧹" },
  { id: "lave-linge",               label: "Lave-linge",          desc: "Capacité, bruit, conso",       group: "Maison",   emoji: "🌀" },
  { id: "lave-vaisselle",           label: "Lave-vaisselle",      desc: "Taille, silencieux, eco",      group: "Maison",   emoji: "🍽️" },
  { id: "refrigerateurs",           label: "Réfrigérateur",       desc: "Volume, No Frost, portes",     group: "Maison",   emoji: "🧊" },
  { id: "purificateurs-air",        label: "Purificateur d'air",  desc: "Allergies, surface, bruit",    group: "Maison",   emoji: "💨" },
  { id: "friteuses-air",            label: "Friteuse à air",      desc: "Capacité, rapidité, nettoyage",group: "Maison",   emoji: "🍟" },
  { id: "machines-a-cafe",          label: "Machine à café",      desc: "Grains, capsules, silence",    group: "Maison",   emoji: "☕" },
  { id: "robots-cuisine",           label: "Robot cuisine",       desc: "Pâtisserie, cuisson, polyv.",  group: "Maison",   emoji: "🍳" },
  { id: "caves-a-vin",              label: "Cave à vin",          desc: "Capacité, température, style", group: "Maison",   emoji: "🍷" },
  { id: "tv-oled",                  label: "TV OLED",             desc: "Salon, luminosité, gaming",    group: "Tech",     emoji: "📺" },
  { id: "casques-audio",            label: "Casque audio",        desc: "Nomade, réduction, qualité",   group: "Tech",     emoji: "🎧" },
  { id: "smartphones",              label: "Smartphone",          desc: "Photo, batterie, budget",      group: "Tech",     emoji: "📱" },
  { id: "ordinateurs-portables",    label: "Laptop étudiant",     desc: "Autonomie, légèreté, perfs",   group: "Tech",     emoji: "💻" },
  { id: "imprimantes",              label: "Imprimante",          desc: "Jet, laser, couleur",          group: "Tech",     emoji: "🖨️" },
  { id: "barres-de-son",            label: "Barre de son",        desc: "TV, gaming, Dolby",            group: "Tech",     emoji: "🔊" },
  { id: "cameras-securite",         label: "Caméra sécurité",     desc: "Intérieur, extérieur, cloud",  group: "Tech",     emoji: "📷" },
  { id: "thermostats-connectes",    label: "Thermostat connecté", desc: "Économies, confort, compat.",  group: "Tech",     emoji: "🌡️" },
  { id: "trottinettes-electriques", label: "Trottinette élec.",   desc: "Autonomie, poids, homologuée", group: "Mobilité", emoji: "🛴" },
  { id: "velos-electriques",        label: "Vélo électrique",     desc: "Urbain, trail, autonomie",     group: "Mobilité", emoji: "🚲" },
  { id: "matelas",                  label: "Matelas",             desc: "Fermeté, couple, dos",         group: "Confort",  emoji: "🛏️" },
  { id: "poussettes",               label: "Poussette",           desc: "Légère, pliable, tout terrain",group: "Confort",  emoji: "👶" },
];

function openChatForCat(cat: Cat) {
  window.dispatchEvent(
    new CustomEvent("troviio:open-chat-category", {
      detail: {
        category: cat.label,
        prompt: `Je cherche ${cat.emoji} ${cat.label.toLowerCase()}. Pose-moi quelques questions pour trouver le meilleur choix pour ma situation.`,
      },
    })
  );
  const hero = document.getElementById("chat-hero");
  if (hero) hero.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CategoryGrid() {
  const [tab, setTab] = useState<Tab>("Tout");

  const visible = useMemo(
    () => (tab === "Tout" ? CATS : CATS.filter((c) => c.group === tab)),
    [tab]
  );

  return (
    <section id="categories" className="px-4 pb-24 pt-8 sm:px-6 lg:px-8"
             style={{ backgroundColor: "#0A0A0B" }}>
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#FF6B2B" }}>
            Explorer par catégorie
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "#FAFAFA" }}>
            Troviio sait tout choisir.{" "}
            <span style={{ color: "#8B8B9A" }}>Même ce à quoi tu n'avais pas pensé.</span>
          </h2>
          <p className="mt-3 text-sm" style={{ color: "#8B8B9A" }}>
            Clique sur une catégorie — l'IA démarre la conversation.
          </p>
        </div>

        <div className="-mx-4 mb-7 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-2 sm:flex-wrap sm:justify-center sm:min-w-0">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className="rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none"
                style={
                  t === tab
                    ? { borderColor: "#FF6B2B", backgroundColor: "#FF6B2B", color: "white" }
                    : { borderColor: "#1E1E24", backgroundColor: "#111113", color: "#8B8B9A" }
                }
                onMouseEnter={(e) => { if (t !== tab) e.currentTarget.style.color = "#FAFAFA"; }}
                onMouseLeave={(e) => { if (t !== tab) e.currentTarget.style.color = "#8B8B9A"; }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => openChatForCat(cat)}
              className="group rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 focus:outline-none focus:ring-2"
              style={{ borderColor: "#1E1E24", backgroundColor: "#111113" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,107,43,0.38)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1E1E24")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 text-2xl">{cat.emoji}</div>
                  <h3 className="text-sm font-semibold" style={{ color: "#FAFAFA" }}>{cat.label}</h3>
                  <p className="mt-1 text-xs" style={{ color: "#8B8B9A" }}>{cat.desc}</p>
                </div>
                <span className="mt-1 text-sm shrink-0 transition group-hover:translate-x-1"
                      style={{ color: "#8B8B9A" }}>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
