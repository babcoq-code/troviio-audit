"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import type { HistoryItem } from "@/hooks/useHistory";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return "";
  }
}

function categoryEmoji(category: string): string {
  const map: Record<string, string> = {
    "machine-cafe": "☕",
    "robot-aspirateur": "🤖",
    "casque-audio": "🎧",
    ecran: "🖥️",
    smartphone: "📱",
    ordinateur: "💻",
    "machine-a-laver": "🧺",
    frigo: "🧊",
    aspirateur: "🧹",
    montre: "⌚",
    enceinte: "🔊",
    gaming: "🎮",
    velo: "🚲",
    voiture: "🚗",
  };
  return map[category] ?? "🔍";
}

// ─── Props ────────────────────────────────────────────────────────────────────

type Position = "sidebar" | "bottom-bar" | "cards";

type HistorySidebarProps = {
  items: HistoryItem[];
  onRemove?: (id: string) => void;
  onClear?: () => void;
  position?: Position;
  /** IDs sélectionnés pour la comparaison */
  compareIds?: string[];
  onToggleCompare?: (id: string) => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function HistorySidebar({
  items,
  onRemove,
  onClear,
  position = "sidebar",
  compareIds = [],
  onToggleCompare,
}: HistorySidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCompare = useCallback(
    (id: string) => {
      if (onToggleCompare) onToggleCompare(id);
    },
    [onToggleCompare]
  );

  if (items.length === 0) return null;

  // ── Mode cartes (page d'accueil) ──────────────────────────────────────
  if (position === "cards") {
    return (
      <section
        className="w-full rounded-[2rem] border p-6 shadow-lg sm:p-8"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-sora text-xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            📋 Mes dernières recherches
          </h2>
          {onClear && items.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-full px-3 py-1 text-xs font-semibold transition hover:opacity-70"
              style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
            >
              Tout effacer
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const isCompareActive = compareIds.includes(item.id);
            return (
              <article
                key={item.id}
                className="group relative flex flex-col rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg)",
                }}
              >
                <Link
                  href={`/resultats/${item.id}`}
                  className="absolute inset-0 z-0 rounded-2xl"
                  aria-label={`Voir la recherche ${item.label}`}
                />

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{categoryEmoji(item.category)}</span>
                    <div>
                      <p className="font-sora text-sm font-bold leading-tight" style={{ color: "var(--text)" }}>
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                        {item.budget}
                      </p>
                    </div>
                  </div>

                  {onToggleCompare && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleCompare(item.id);
                      }}
                      className={`relative z-20 shrink-0 rounded-lg border px-2 py-1 text-xs font-semibold transition ${
                        isCompareActive
                          ? "border-[#FF6B5F] bg-[#FF6B5F]/10 text-[#FF6B5F]"
                          : "border-[var(--border)] text-[var(--text-muted)] hover:border-[#FF6B5F]/50"
                      }`}
                      aria-label={isCompareActive ? "Retirer de la comparaison" : "Ajouter à la comparaison"}
                    >
                      {isCompareActive ? "✓ Comparer" : "Comparer"}
                    </button>
                  )}
                </div>

                {item.topProducts.length > 0 && (
                  <div className="relative z-10 mt-3 flex flex-wrap gap-1.5">
                    {item.topProducts.map((name) => (
                      <span
                        key={name}
                        className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                        style={{ backgroundColor: "rgba(66,87,255,0.1)", color: "#4257FF" }}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="relative z-10 mt-3 flex items-center justify-between">
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {fmtDate(item.created_at)}
                  </span>

                  {onRemove && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onRemove(item.id);
                      }}
                      className="relative z-20 rounded-full p-1 text-xs opacity-0 transition hover:bg-red-500/10 group-hover:opacity-100"
                      style={{ color: "var(--text-muted)" }}
                      aria-label={`Supprimer ${item.label}`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Fenêtre de comparaison si ≥ 2 éléments sélectionnés */}
        {compareIds.length >= 2 && (
          <CompareBar
            items={items.filter((i) => compareIds.includes(i.id))}
            onClose={() => onToggleCompare?.(compareIds[0])}
            onToggleCompare={toggleCompare}
          />
        )}
      </section>
    );
  }

  // ── Mode sidebar / bottom-bar (page résultat) ─────────────────────────
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border px-4 py-2 shadow-lg backdrop-blur-xl"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-surface)",
          color: "var(--text)",
        }}
      >
        <span className="text-lg">📋</span>
        <span className="text-sm font-semibold">{items.length}</span>
      </button>
    );
  }

  return (
    <aside
      className={`fixed z-50 ${
        position === "sidebar"
          ? "right-4 top-24 bottom-4 w-72 overflow-y-auto"
          : "bottom-4 left-4 right-4 max-h-48 overflow-y-auto rounded-2xl"
      } rounded-2xl border shadow-xl backdrop-blur-xl`}
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        <h3 className="font-sora text-sm font-bold" style={{ color: "var(--text)" }}>
          📋 Historique
        </h3>
        <div className="flex items-center gap-2">
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold transition hover:opacity-70"
              style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
            >
              Effacer
            </button>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="rounded-full p-1 text-sm transition hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
            aria-label="Réduire"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className="p-3 space-y-2">
        {items.map((item) => {
          const isCompareActive = compareIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="group relative flex items-start gap-3 rounded-xl border p-3 transition hover:-translate-y-0.5"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg)",
              }}
            >
              <Link
                href={`/resultats/${item.id}`}
                className="absolute inset-0 z-0 rounded-xl"
                aria-label={`Voir ${item.label}`}
              />

              <span className="relative z-10 mt-0.5 text-lg">{categoryEmoji(item.category)}</span>

              <div className="relative z-10 min-w-0 flex-1">
                <p className="truncate text-sm font-bold" style={{ color: "var(--text)" }}>
                  {item.label}
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {item.budget} · {fmtDate(item.created_at)}
                </p>
                {item.topProducts.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.topProducts.slice(0, 2).map((name) => (
                      <span
                        key={name}
                        className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{ backgroundColor: "rgba(66,87,255,0.1)", color: "#4257FF" }}
                      >
                        {name}
                      </span>
                    ))}
                    {item.topProducts.length > 2 && (
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        +{item.topProducts.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="relative z-10 flex flex-col items-center gap-1">
                {onToggleCompare && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleCompare(item.id);
                    }}
                    className={`rounded-lg border px-2 py-0.5 text-[11px] font-semibold transition ${
                      isCompareActive
                        ? "border-[#FF6B5F] bg-[#FF6B5F]/10 text-[#FF6B5F]"
                        : "border-[var(--border)] text-[var(--text-muted)] hover:border-[#FF6B5F]/50"
                    }`}
                    aria-label={isCompareActive ? "Retirer la comparaison" : "Ajouter à la comparaison"}
                  >
                    {isCompareActive ? "✓" : "+"}
                  </button>
                )}
                {onRemove && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onRemove(item.id);
                    }}
                    className="rounded-full p-0.5 text-[11px] opacity-0 transition hover:bg-red-500/10 group-hover:opacity-100"
                    style={{ color: "var(--text-muted)" }}
                    aria-label="Supprimer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparaison */}
      {compareIds.length >= 2 && (
        <CompareBar
          items={items.filter((i) => compareIds.includes(i.id))}
          onClose={() => onToggleCompare?.(compareIds[0])}
          onToggleCompare={toggleCompare}
        />
      )}
    </aside>
  );
}

// ─── CompareBar (fenêtre de comparaison flottante) ──────────────────────────

type CompareBarProps = {
  items: HistoryItem[];
  onClose: () => void;
  onToggleCompare: (id: string) => void;
};

function CompareBar({ items, onClose, onToggleCompare }: CompareBarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t px-4 py-3 shadow-2xl backdrop-blur-xl"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            Comparer ({items.length})
          </span>
          <div className="hidden gap-2 sm:flex">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggleCompare(item.id)}
                className="flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition hover:border-[#FF6B5F]/50"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                {categoryEmoji(item.category)} {item.label}
                <span className="ml-1 opacity-50">✕</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/comparer?ids=${items.map((i) => i.id).join(",")}`}
            className="rounded-full bg-[#FF6B5F] px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-[#e55a4d]"
          >
            Voir côte à côte →
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-sm transition hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
