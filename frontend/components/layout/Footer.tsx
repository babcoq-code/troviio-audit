"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Send, CheckCircle2, ShieldCheck } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch { /* non bloquant */ }
  };

  return (
    <footer className="border-t border-zinc-200 bg-white pt-16 pb-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white">
                <Sparkles className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-xl font-bold text-zinc-900 dark:text-white">Troviio</span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 mb-6">
              Pas le meilleur. Le tien. Comparateur IA indépendant pour trouver
              le produit qui correspond vraiment à votre vie.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 w-fit px-3 py-1.5 rounded-full">
              <ShieldCheck className="h-4 w-4" />
              Site indépendant. Zéro biais.
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Accueil", href: "/" },
                { label: "Guides d'achat", href: "/guide" },
                { label: "Notre méthodologie", href: "/methodologie" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
              Légal & Info
            </h3>
            <ul className="space-y-3">
              {[
                { label: "À propos", href: "/a-propos" },
                { label: "Politique d'affiliation", href: "/affiliation" },
                { label: "Mentions légales", href: "/mentions-legales" },
                { label: "Confidentialité & Cookies", href: "/cookies" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
              Newsletter hebdo
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Le bon choix atterrit dans ta boîte. Un email par semaine, zéro spam.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-900"
              />
              <button
                type="submit"
                disabled={isSubscribed}
                className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white hover:bg-emerald-600 dark:bg-white dark:text-zinc-900 transition-colors"
              >
                {isSubscribed ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
            {isSubscribed && (
              <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 transition-opacity">
                Bienvenue à bord ! 🎉
              </p>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between border-t border-zinc-200 pt-8 dark:border-zinc-800 md:flex-row">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} Troviio — Tous droits réservés. Site indépendant.
          </p>
        </div>
      </div>
    </footer>
  );
}
