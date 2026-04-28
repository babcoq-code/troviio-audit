"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X, User } from "lucide-react";

const NAV_LINKS = [
  { name: "Accueil", href: "/" },
  { name: "Guides", href: "/guide" },
  { name: "À propos", href: "/a-propos" },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-zinc-900/80"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white transition-transform group-hover:scale-105">
              <Sparkles className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Troviio
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-1 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 h-0.5 w-full bg-emerald-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center gap-4 border-l border-zinc-200 pl-6 dark:border-zinc-800">
              <Link
                href="/"
                className="rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:opacity-90 active:scale-95 transition-all"
              >
                Trouver mon produit
              </Link>
            </div>
          </nav>

          {/* Mobile button */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-zinc-600 dark:text-zinc-300 p-2"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 transition-all">
          <nav className="flex flex-col space-y-4 px-4 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-lg font-medium ${
                  pathname === link.href
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-600 dark:text-zinc-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4">
              <Link
                href="/"
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-base font-semibold text-white"
              >
                Trouver mon produit
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
