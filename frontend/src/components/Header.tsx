"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const nav = [
    { label: "Catégories", href: "/#categories" },
    { label: "Méthode", href: "/methodologie" },
    { label: "À propos", href: "/a-propos" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3 border-b border-white/10 shadow-lg" : "py-5"
      }`}
      style={{ backgroundColor: scrolled ? "rgba(10,10,11,0.92)" : "transparent",
               backdropFilter: scrolled ? "blur(12px)" : "none" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex-shrink-0 no-underline hover:no-underline">
          <span className="font-bold text-2xl tracking-tight" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            <span style={{ color: "#FF6B2B" }}>T</span>
            <span style={{ color: "#FAFAFA" }}>roviio</span>
          </span>
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium transition-colors hover:text-[#FF6B2B]"
              style={{ color: "rgba(250,250,250,0.75)" }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="/"
            className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all shadow-md hover:bg-[#e55a20]"
            style={{ backgroundColor: "#FF6B2B", boxShadow: "0 2px 16px rgba(255,107,43,0.35)" }}
          >
            Trouver le mien ✨
          </a>
        </nav>

        {/* BURGER MOBILE */}
        <button
          className="md:hidden p-2 rounded-md focus:outline-none transition-colors"
          style={{ color: "rgba(250,250,250,0.8)" }}
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

      {/* MENU MOBILE */}
      {menuOpen && (
        <div
          className="md:hidden absolute w-full border-b border-white/10 shadow-xl px-4 pt-2 pb-6 space-y-1"
          style={{ backgroundColor: "#111113" }}
        >
          {nav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-3 text-base font-medium rounded-md"
              style={{ color: "#FAFAFA" }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block mt-3 px-4 py-3 text-center rounded-full font-semibold text-white"
            style={{ backgroundColor: "#FF6B2B" }}
          >
            Trouver le mien ✨
          </a>
        </div>
      )}
    </header>
  );
}
