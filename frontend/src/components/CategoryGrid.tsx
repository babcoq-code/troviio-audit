"use client";

import { useMemo, useState } from "react";

type Tab = "Tout" | "Maison" | "Tech" | "Mobilité" | "Confort";

interface Cat {
  id: string; label: string; desc: string;
  group: Exclude<Tab, "Tout">; emoji: string; category_slug: string;
}

const TABS: Tab[] = ["Tout", "Maison", "Tech", "Mobilité", "Confort"];

const CATS: Cat[] = [
  { id: "aspirateurs-robots",       label: "Robot aspirateur",    desc: "Sol, animaux, patience",       group: "Maison",   emoji: "🤖", category_slug: "aspirateur-robot" },
  { id: "aspirateurs-balai",        label: "Aspirateur balai",    desc: "Léger, puissant, sans fil",    group: "Maison",   emoji: "🧹", category_slug: "aspirateur-balai" },
  { id: "lave-linge",               label: "Lave-linge",          desc: "Capacité, bruit, conso",       group: "Maison",   emoji: "🌀", category_slug: "lave-linge" },
  { id: "lave-vaisselle",           label: "Lave-vaisselle",      desc: "Taille, silencieux, eco",      group: "Maison",   emoji: "🍽️", category_slug: "lave-vaisselle" },
  { id: "refrigerateurs",           label: "Réfrigérateur",       desc: "Volume, No Frost, portes",     group: "Maison",   emoji: "🧊", category_slug: "refrigerateur" },
  { id: "fours-encastrables",       label: "Four encastrable", desc: "Pyrolyse, vapeur, cuisson",   group: "Maison",   emoji: "🔥", category_slug: "four-encastrable" },
  { id: "fours-micro-ondes",        label: "Micro-ondes", desc: "Capacité, puissance, combiné", group: "Maison",   emoji: "🔥", category_slug: "four-micro-ondes" },
  { id: "purificateurs-air",        label: "Purificateur d'air",  desc: "Allergies, surface, bruit",    group: "Maison",   emoji: "💨", category_slug: "purificateur-air" },
  { id: "friteuses-air",            label: "Friteuse à air",      desc: "Capacité, rapidité, nettoyage",group: "Maison",   emoji: "🍟", category_slug: "friteuse-air" },
  { id: "machines-a-cafe",          label: "Machine à café",      desc: "Grains, capsules, silence",    group: "Maison",   emoji: "☕", category_slug: "machine-a-cafe" },
  { id: "robots-cuisine",           label: "Robot cuisine",       desc: "Pâtisserie, cuisson, polyv.",  group: "Maison",   emoji: "🍳", category_slug: "robot-cuisine" },
  { id: "caves-a-vin",              label: "Cave à vin",          desc: "Capacité, température, style", group: "Maison",   emoji: "🍷", category_slug: "cave-a-vin" },
  { id: "climatiseurs-portables",   label: "Climatiseur portable",desc: "Frais, mobile, silencieux",    group: "Maison",   emoji: "❄️", category_slug: "climatiseur-portable" },
  { id: "ventilateurs-colonne",     label: "Ventilateur colonne", desc: "Silencieux, puissant, design", group: "Maison",   emoji: "💨", category_slug: "ventilateur-colonne" },
  { id: "tv-oled",                  label: "TV OLED",             desc: "Salon, luminosité, gaming",    group: "Tech",     emoji: "📺", category_slug: "tv" },
  { id: "casques-audio",            label: "Casque audio",        desc: "Nomade, réduction, qualité",   group: "Tech",     emoji: "🎧", category_slug: "casque-audio" },
  { id: "smartphones",              label: "Smartphone",          desc: "Photo, batterie, budget",      group: "Tech",     emoji: "📱", category_slug: "smartphone" },
  { id: "ordinateurs-portables",    label: "Laptop étudiant",     desc: "Autonomie, légèreté, perfs",   group: "Tech",     emoji: "💻", category_slug: "ordinateur-portable" },
  { id: "laptops-gamer",            label: "Laptop gamer",        desc: "Perfs, RGB, mobilité",         group: "Tech",     emoji: "🎮", category_slug: "laptop-gamer" },
  { id: "imprimantes",              label: "Imprimante",          desc: "Jet, laser, couleur",          group: "Tech",     emoji: "🖨️", category_slug: "imprimante" },
  { id: "barres-de-son",            label: "Barre de son",        desc: "TV, gaming, Dolby",            group: "Tech",     emoji: "🔊", category_slug: "barre-de-son" },
  { id: "enceintes-bt",             label: "Enceinte Bluetooth",  desc: "Son, portable, résistant",     group: "Tech",     emoji: "🎵", category_slug: "enceinte-bt" },
  { id: "cameras-securite",         label: "Caméra sécurité",     desc: "Intérieur, extérieur, cloud",  group: "Tech",     emoji: "📷", category_slug: "camera-securite" },
  { id: "thermostats-connectes",    label: "Thermostat connecté", desc: "Économies, confort, compat.",   group: "Tech",     emoji: "🌡️", category_slug: "thermostat-connecte" },
  { id: "stations-charge-usb-c",    label: "Station charge USB-C",desc: "Puissance, ports, GaN",         group: "Tech",     emoji: "🔌", category_slug: "station-charge-usb-c" },
  { id: "onduleurs-ups",            label: "Onduleur UPS",        desc: "Protection, autonomie, pro",   group: "Tech",     emoji: "⚡", category_slug: "onduleur-ups" },
  { id: "claviers",                 label: "Clavier",            desc: "Gaming, mécanique, Hall Eff.", group: "Tech",     emoji: "⌨️", category_slug: "clavier" },
  { id: "bureaux-electriques",      label: "Bureau électrique",  desc: "Assis-debout, moteur, gain",   group: "Confort",  emoji: "🪑", category_slug: "bureau-electrique" },
  { id: "trottinettes-electriques", label: "Trottinette élec.",   desc: "Autonomie, poids, homologuée", group: "Mobilité", emoji: "🛴", category_slug: "trottinette" },
  { id: "velos-electriques",        label: "Vélo électrique",     desc: "Autonomie, moteur, confort",   group: "Mobilité", emoji: "🚲", category_slug: "velo-electrique" },
  { id: "matelas",                  label: "Matelas",             desc: "Fermeté, couple, dos",         group: "Confort",  emoji: "🛏️", category_slug: "matelas" },
  { id: "poussettes",               label: "Poussette",           desc: "Légère, pliable, tout terrain",group: "Confort",  emoji: "👶", category_slug: "poussette" },
  { id: "tablettes",                label: "Tablette / iPad",     desc: "Créa, stream, productivité",   group: "Tech",     emoji: "📱", category_slug: "tablette" },
  { id: "manettes-switch",          label: "Manette Switch",      desc: "Pro, Hall Effect, budget",     group: "Tech",     emoji: "🎮", category_slug: "manette-switch" },
  { id: "poeles",    label: "Poêle",     desc: "Antiadhésif, acier, santé",  group: "Maison",  emoji: "🍳", category_slug: "poele" },
];

const CAT_PROMPTS: Record<string, string> = {
  "aspirateur-robot": "J'ai la flemme de passer l'aspirateur tous les jours, je veux un robot qui s'en occupe à ma place",
  "aspirateur-balai": "Le sol de ma maison c'est le bazar, j'ai besoin d'un aspirateur balai qui aspire tout sans se prendre la tête",
  "lave-linge": "Ma machine à laver a 15 ans et fait un bruit d'enfer, aide-moi à trouver la remplaçante idéale",
  "lave-vaisselle": "Je déteste faire la vaisselle, trouve-moi un lave-vaisselle silencieux qui nettoie même les plats carbonisés",
  "refrigerateur": "Mon frigo actuel est trop petit et fait de la glace partout, je cherche un modèle spacieux et pratique",
  "four-micro-ondes": "Mon micro-ondes a 10 piges et réchauffe de travers, je cherche un combiné four qui cuit et réchauffe bien",
  "four-encastrable": "Je veux un four encastrable qui cuit parfaitement, avec pyrolyse et si possible vapeur. Tu m'aides à choisir ?",
  "purificateur-air": "Je me réveille avec le nez bouché tous les matins, j'ai besoin d'un purificateur d'air qui change ma vie",
  "friteuse-air": "Je veux manger des frites croustillantes sans noyer ma cuisine dans l'huile, une friteuse à air c'est la solution ?",
  "machine-a-cafe": "Je veux un vrai café sans mettre un pied dehors, quelle machine me conseilles-tu ?",
  "robot-cuisine": "Je passe trop de temps à cuisiner, je veux un robot multifonction qui fait tout à ma place",
  "cave-a-vin": "Mes bouteilles de vin souffrent de la température de ma cuisine, j'ai besoin d'une vraie cave à vin",
  "climatiseur-portable": "Mon appart se transforme en four l'été, je veux un climatiseur portable qui rafraîchit sans ruiner ma facture",
  "ventilateur-colonne": "Je cherche un ventilateur colonne silencieux pour ma chambre, qui ne fait pas un bruit de tracteur la nuit",
  "tv": "Je regarde mes séries dans le noir et je veux des noirs profonds, une TV OLED c'est le Graal ?",
  "casque-audio": "Mes voisins du métro m'empêchent d'écouter ma musique, je veux un casque qui isole vraiment du bruit",
  "smartphone": "Mon téléphone me lâche à 15h, j'en ai marre. Je cherche un smartphone avec une batterie qui tient la journée",
  "ordinateur-portable": "Je bosse en alternance et mon PC actuel rame sur 3 onglets, il me faut un laptop étudiant fiable",
  "laptop-gamer": "Je veux jouer à Cyberpunk en ultra sans que mon PC prenne feu, un laptop gamer c'est assez puissant ?",
  "imprimante": "À chaque fois que j'ai besoin d'imprimer un truc urgent, l'encre a séché. Je veux une imprimante qui marche quand j'en ai besoin",
  "barre-de-son": "Le son de ma TV est tout plat, je veux une barre de son qui donne envie de regarder des films",
  "enceinte-bt": "Je veux mettre l'ambiance dans mon salon avec une enceinte Bluetooth portable qui sonne bien",
  "camera-securite": "Je reçois des colis et j'aimerais savoir qui passe devant chez moi, une caméra sécurité c'est la solution ?",
  "thermostat-connecte": "Je chauffe mon appart alors que je suis au bureau, je veux un thermostat connecté qui m'économise de l'argent",
  "station-charge-usb-c": "J'ai trop d'appareils et pas assez de prises, une station de charge USB-C pour tout brancher au même endroit ?",
  "onduleur-ups": "Mon PC plante à chaque micro-coupure, j'ai besoin d'un onduleur UPS pour protéger mon matos",
  "clavier": "Je passe mes journées à taper et mes soirées à gamer, j'ai besoin d'un clavier qui assure dans les deux mondes",
  "bureau-electrique": "Je commence à avoir mal au dos à force de rester assis toute la journée, un bureau électrique assis-debout ça m'aiderait ?",
  "trottinette": "Les transports en commun me gâchent la vie, aide-moi à choisir une trottinette électrique pour aller au taf",
  "velo-electrique": "Je veux arrêter la voiture pour les petits trajets, un vélo électrique c'est le bon plan ?",
  "matelas": "Je me réveille avec mal au dos tous les matins, je cherche un matelas qui me fera dormir comme un bébé",
  "poussette": "Je vais être parent et je dois trouver une poussette qui passe partout sans me ruiner",
  "tablette": "Je veux une tablette pour dessiner, regarder des films et bosser en mobilité, tu me conseilles laquelle ?",
  "manette-switch": "Je viens d'acheter une Nintendo Switch et je sais pas quelle manette prendre, la Pro officielle ou une alternative ?",
  "poele": "Ma poêle antiadhésive commence à s'écailler et j'ai peur des PFAS, je cherche une poêle saine et durable sans produits toxiques",
};

function openChatForCat(cat: Cat) {
  try { localStorage.removeItem("troviio.chat.history.v2"); } catch {}
  const prompt = CAT_PROMPTS[cat.category_slug] || `Je cherche un(e) ${cat.label.toLowerCase()}. Aide-moi à trouver le meilleur choix pour moi.`;
  window.dispatchEvent(
    new CustomEvent("troviio:open-chat-category", {
      detail: {
        category: cat.category_slug,
        prompt: prompt,
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
             style={{ backgroundColor: "var(--bg)" }}>
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--coral)" }}>
            Explorer par catégorie
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "var(--text)" }}>
            Troviio sait tout choisir.{" "}
            <span style={{ color: "var(--text-muted)" }}>Même ce à quoi tu n'avais pas pensé.</span>
          </h2>
          <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
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
                    ? { borderColor: "var(--coral)", backgroundColor: "var(--coral)", color: "white" }
                    : { borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }
                }
                onMouseEnter={(e) => { if (t !== tab) e.currentTarget.style.color = "var(--text)"; }}
                onMouseLeave={(e) => { if (t !== tab) e.currentTarget.style.color = "var(--text-muted)"; }}
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
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,107,95,0.38)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 text-2xl">{cat.emoji}</div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>{cat.label}</h3>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{cat.desc}</p>
                </div>
                <span className="mt-1 text-sm shrink-0 transition group-hover:translate-x-1"
                      style={{ color: "var(--text-muted)" }}>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
