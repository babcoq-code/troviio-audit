"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LogoTroviio from "@/components/LogoTroviio";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const nav = [
    { label: "🔍 Catégories", href: "/#categories" },
    { label: "🏆 Top 3", href: "/tops" },
    { label: "🔧 Accessoires", href: "/accessoires/chat" },
    { label: "💘 Score Troviio", href: "/score" },
    { label: "🧪 Méthode", href: "/methodologie" },
    { label: "📝 Guides", href: "/guide" },
    { label: "🏠 À propos", href: "/a-propos" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3 shadow-lg" : "py-5"
      }`}
      style={{
        backgroundColor: "var(--bg)",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(22px) saturate(180%)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex-shrink-0 no-underline hover:no-underline">
          <LogoTroviio />
        </Link>

        {/* NAV DESKTOP — passe au menu hamburger plus tôt (lg au lieu de md) pour éviter le chevauchement sur iPad */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
          {nav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium transition-colors whitespace-nowrap hover:text-[var(--coral-dark)]"
              style={{ color: "var(--text-muted)" }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="/"
            className="px-4 xl:px-5 py-2 rounded-full text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            style={{
              background: "var(--grad-coral)",
              boxShadow: "0 10px 24px -10px rgba(229,85,74,0.6)",
            }}
          >
            Trouver le mien ✨
          </a>
        </nav>

        {/* BURGER MOBILE + TABLET (iPad) */}
        <button
          className="lg:hidden p-2 rounded-md focus:outline-none transition-colors"
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

      {/* MENU MOBILE + TABLET */}
      {menuOpen && (
        <div
          className="lg:hidden absolute w-full border-b border-[var(--border)] shadow-xl px-4 pt-2 pb-6 space-y-1"
          style={{ backgroundColor: "var(--bg)" }}
        >
          {nav.map((l) => (
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
