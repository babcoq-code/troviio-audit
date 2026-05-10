"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import LogoTroviio from "@/components/LogoTroviio";

/* ── Catégories pour le mega-menu ─────────────────────── */

interface HeaderCategory {
  slug: string;
  label: string;
  emoji: string;
  group: string;
}

const CATEGORIES: HeaderCategory[] = [
  { slug: "aspirateur-robot",    label: "Robot aspirateur",    emoji: "🤖", group: "Maison" },
  { slug: "aspirateur-balai",    label: "Aspirateur balai",    emoji: "🧹", group: "Maison" },
  { slug: "aspirateur-laveur",   label: "Aspirateur laveur",   emoji: "🧹", group: "Maison" },
  { slug: "lave-linge",          label: "Lave-linge",          emoji: "🌀", group: "Maison" },
  { slug: "lave-vaisselle",      label: "Lave-vaisselle",      emoji: "🍽️", group: "Maison" },
  { slug: "refrigerateur",       label: "Réfrigérateur",       emoji: "🧊", group: "Maison" },
  { slug: "four-micro-ondes",    label: "Micro-ondes",  emoji: "🔥", group: "Maison" },
  { slug: "purificateur-air",    label: "Purificateur d'air",   emoji: "💨", group: "Maison" },
  { slug: "friteuse-air",        label: "Friteuse à air",      emoji: "🍟", group: "Maison" },
  { slug: "machine-a-cafe",      label: "Machine à café",      emoji: "☕", group: "Maison" },
  { slug: "robot-cuisine",       label: "Robot cuisine",       emoji: "🍳", group: "Maison" },
  { slug: "cave-a-vin",          label: "Cave à vin",          emoji: "🍷", group: "Maison" },
  { slug: "climatiseur-portable",label: "Climatiseur portable",emoji: "❄️", group: "Maison" },
  { slug: "ventilateur-colonne", label: "Ventilateur colonne", emoji: "🌀", group: "Maison" },
  { slug: "tv",                  label: "TV / OLED",           emoji: "📺", group: "Tech" },
  { slug: "casque-audio",        label: "Casque audio",        emoji: "🎧", group: "Tech" },
  { slug: "smartphone",          label: "Smartphone",          emoji: "📱", group: "Tech" },
  { slug: "ordinateur-portable", label: "Laptop étudiant",     emoji: "💻", group: "Tech" },
  { slug: "laptop-gamer",        label: "Laptop gamer",        emoji: "🎮", group: "Tech" },
  { slug: "tablette",            label: "Tablette / iPad",     emoji: "📱", group: "Tech" },
  { slug: "imprimante",          label: "Imprimante",          emoji: "🖨️", group: "Tech" },
  { slug: "barre-de-son",        label: "Barre de son",        emoji: "🔊", group: "Tech" },
  { slug: "enceinte-bt",         label: "Enceinte Bluetooth",  emoji: "🔊", group: "Tech" },
  { slug: "camera-securite",     label: "Caméra sécurité",     emoji: "📷", group: "Tech" },
  { slug: "thermostat-connecte", label: "Thermostat connecté", emoji: "🌡️", group: "Tech" },
  { slug: "station-charge-usb-c",label: "Station charge USB-C",emoji: "🔌", group: "Tech" },
  { slug: "onduleur-ups",        label: "Onduleur UPS",        emoji: "⚡", group: "Tech" },
  { slug: "clavier",             label: "Clavier",             emoji: "⌨️", group: "Tech" },
  { slug: "bureau-electrique",   label: "Bureau électrique",   emoji: "🪑", group: "Confort" },
  { slug: "matelas",             label: "Matelas",             emoji: "🛏️", group: "Confort" },
  { slug: "poussette",           label: "Poussette",           emoji: "👶", group: "Confort" },
  { slug: "trottinette",         label: "Trottinette élec.",   emoji: "🛴", group: "Mobilité" },
  { slug: "velo-electrique",     label: "Vélo électrique",     emoji: "🚲", group: "Mobilité" },
  { slug: "accessoire-velo",     label: "Accessoire vélo",     emoji: "🔧", group: "Mobilité" },
  { slug: "manette-switch",      label: "Manette Switch",      emoji: "🎮", group: "Tech" },
  { slug: "brosse-dent-electrique", label: "Brosse à dents élec.", emoji: "🪥", group: "Confort" },
  { slug: "tondeuse-cheveux",    label: "Tondeuse cheveux",    emoji: "✂️", group: "Confort" },
  { slug: "rasoir-electrique",   label: "Rasoir électrique",   emoji: "🪒", group: "Confort" },
  { slug: "epilateur-lumiere-pulsee", label: "Épilateur LPL",  emoji: "✨", group: "Confort" },
  { slug: "moniteur-cardiaque",  label: "Montre / Cardio",     emoji: "⌚", group: "Tech" },
  { slug: "enceinte-connectee",  label: "Enceinte connectée",  emoji: "📻", group: "Tech" },
];

const GROUPS = ["Maison", "Tech", "Confort", "Mobilité"];

/* ── Header ───────────────────────────────────────────── */

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const catRef = useRef<HTMLDivElement>(null);
  const catBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close category mega-menu on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        catOpen &&
        catRef.current &&
        !catRef.current.contains(e.target as Node) &&
        catBtnRef.current &&
        !catBtnRef.current.contains(e.target as Node)
      ) {
        setCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [catOpen]);

  // Close mobile menu on resize
  useEffect(() => {
    const fn = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalogue?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(10,10,11,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(22px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* LOGO */}
          <Link href="/" className="flex-shrink-0 no-underline hover:no-underline">
            <LogoTroviio />
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Catégories dropdown */}
            <div className="relative">
              <button
                ref={catBtnRef}
                type="button"
                onClick={() => setCatOpen(!catOpen)}
                onMouseEnter={() => setCatOpen(true)}
                className="flex items-center gap-1.5 px-3 xl:px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap hover:bg-white/5"
                style={{ color: catOpen ? "var(--coral)" : "var(--text-muted)" }}
                aria-expanded={catOpen}
                aria-haspopup="true"
              >
                <span>☰</span> Catégories
                <svg
                  width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"
                  viewBox="0 0 24 24"
                  className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Mega-menu */}
              {catOpen && (
                <div
                  ref={catRef}
                  onMouseLeave={() => setCatOpen(false)}
                  className="absolute left-0 top-full mt-2 rounded-2xl border shadow-2xl overflow-hidden"
                  style={{
                    width: 680,
                    borderColor: "var(--border)",
                    backgroundColor: "rgba(17,17,19,0.98)",
                    backdropFilter: "blur(24px)",
                  }}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                        🔍 Toutes les catégories
                      </span>
                      <Link
                        href="/catalogue"
                        className="text-xs font-medium transition-colors"
                        style={{ color: "var(--coral)" }}
                        onClick={() => setCatOpen(false)}
                      >
                        Voir tout →</Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/categorie/${cat.slug}`}
                          onClick={() => setCatOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors hover:bg-white/5"
                          style={{ color: "var(--text-muted)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
                        >
                          <span className="text-base shrink-0">{cat.emoji}</span>
                          <span className="truncate">{cat.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation links */}
            {[
              { label: "Duels", href: "/duels" },
              { label: "Catalogue", href: "/catalogue" },
              { label: "Méthodologie", href: "/methodologie" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 xl:px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap hover:bg-white/5"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                {l.label}
              </Link>
            ))}

            {/* Search bar */}
            <div className="ml-2 xl:ml-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  aria-label="Rechercher un produit"
                  className="w-36 xl:w-44 h-9 rounded-full border bg-transparent pl-9 pr-3 text-xs outline-none transition-all focus:w-48 xl:focus:w-56"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                />
                <svg
                  width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                >
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </form>
            </div>

            {/* CTA */}
            <a
              href="/"
              className="ml-2 xl:ml-3 px-4 xl:px-5 py-2 rounded-full text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg whitespace-nowrap"
              style={{
                background: "var(--grad-coral)",
                boxShadow: "0 10px 24px -10px rgba(229,85,74,0.6)",
              }}
            >
              Trouver le mien ✨
            </a>
          </nav>

          {/* BURGER MOBILE */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-md transition-colors"
              style={{ color: "var(--text-muted)" }}
              aria-label="Rechercher"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            <button
              className="p-2 rounded-md focus:outline-none transition-colors"
              style={{ color: "var(--text-muted)" }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="lg:hidden pb-3">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                aria-label="Rechercher"
                className="w-full h-11 rounded-xl border bg-transparent px-4 text-sm outline-none"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text)",
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div
          className="lg:hidden w-full border-b shadow-xl px-4 pt-2 pb-6 space-y-1"
          style={{
            backgroundColor: "rgba(10,10,11,0.98)",
            borderColor: "var(--border)",
            backdropFilter: "blur(22px)",
          }}
        >
          {/* Catégories in mobile */}
          <div className="mb-2 px-3 py-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Catégories
          </div>
          <div className="grid grid-cols-2 gap-1 mb-4">
            {CATEGORIES.slice(0, 12).map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorie/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <span>{cat.emoji}</span>
                <span className="truncate">{cat.label}</span>
              </Link>
            ))}
          </div>
          <Link
            href="/catalogue"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            📦 Toutes les catégories →
          </Link>

          <hr className="my-3" style={{ borderColor: "var(--border)" }} />

          {[
            { label: "⚔️ Duels", href: "/duels" },
            { label: "📦 Catalogue", href: "/catalogue" },
            { label: "🧪 Méthodologie", href: "/methodologie" },
            { label: "🏆 Top 3", href: "/tops" },
            { label: "📝 Guides", href: "/guide" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-3 text-base font-medium rounded-md"
              style={{ color: "var(--text)" }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block mt-3 px-4 py-3 text-center rounded-full font-semibold text-white"
            style={{ background: "var(--grad-coral)" }}
          >
            Trouver le mien ✨
          </a>
        </div>
      )}
    </header>
  );
}
