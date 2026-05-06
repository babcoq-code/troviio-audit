import Link from "next/link";
import type {{ Metadata }} from "next";

export const dynamic = "force-dynamic";

const metaTitle = `META_TITLE`;
const metaDesc = `META_DESC`;

export const metadata: Metadata = {{
  title: metaTitle,
  description: metaDesc,
  openGraph: {{ title: metaTitle, description: metaDesc }},
}};

function AmazonBtn({{ url, label = "Voir le prix sur Amazon →" }}: {{ url: string; label?: string }}) {{
  if (!url) return null;
  return (
    <a href={{url}} target="_blank" rel="nofollow sponsored noopener noreferrer"
      className="block w-full text-center bg-gradient-to-r from-[#FF6B5F] to-[#E5554A] text-white py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110 shadow-lg shadow-[#FF6B5F]/20">
      {{label}}
    </a>
  );
}}

function ProsCons({{ pros, cons }}: {{ pros: string[]; cons: string[] }}) {{
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div>
        <h4 className="text-sm font-semibold text-[#3ED6A3]">✅ Points forts</h4>
        <ul className="mt-2 space-y-1 text-sm text-[#8B8FA3]">
          {{pros.map((p, i) => <li key={{i}} className="flex gap-2"><span className="text-[#3ED6A3] shrink-0">+</span><span>{{p}}</span></li>)}}
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-[#FF6B5F]">⚠️ Limites</h4>
        <ul className="mt-2 space-y-1 text-sm text-[#8B8FA3]">
          {{cons.map((c, i) => <li key={{i}} className="flex gap-2"><span className="text-[#8B8FA3] shrink-0">•</span><span>{{c}}</span></li>)}}
        </ul>
      </div>
    </div>
  );
}}

const INTRO_TEXT = `INTRO`;

const RAPIDE_ITEMS = RAPIDE_LIST;

const CRITERES_LIST = CRITERES;

const PROFILS_LIST = PROFILS;

const ERREURS_LIST = ERREURS;

const FAQ_LIST = FAQ_ITEMS;

export default function GuidePage() {{
  return (
    <main className="min-h-screen bg-[#0E1020] text-white">
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="flex items-center gap-2 text-sm text-[#8B8FA3] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/c/CAT_SLUG" className="hover:text-white transition-colors">CAT_NAME</Link>
            <span>/</span>
            <span className="text-white font-medium">H1_TEXT</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d&apos;achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">H1_TEXT</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">META_DESC</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">{{INTRO_TEXT}}</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">⚡ La réponse rapide</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {{RAPIDE_ITEMS}}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">📋 Les critères importants</h2>
          <div className="space-y-4">
            {{CRITERES_LIST}}
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">🎯 Notre sélection détaillée</h2>
        <div className="space-y-6 mb-12">
          PRODUCT_CARDS
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">🎯 Quel modèle selon votre profil</h2>
          <div className="space-y-3">
            {{PROFILS_LIST}}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">🚨 Les erreurs à éviter</h2>
          <div className="space-y-3">
            {{ERREURS_LIST}}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">❓ Questions fréquentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            {{FAQ_LIST}}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">📚 Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/CAT_SLUG" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir tous les produits →</Link>
            <Link href="/tops" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">🏆 Le Top 3 Troviio</Link>
            <Link href="/catalogue" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">📋 Tout le catalogue</Link>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs leading-6 text-[#6B6B7A]">* Les prix indiqués sont susceptibles de varier. Troviio participe au Programme d&apos;Associés d&apos;Amazon EU...</p>
        </div>
      </section>
    </main>
  );
}}
