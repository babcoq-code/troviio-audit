"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, TrendingUp, ArrowRight } from "lucide-react";

interface SearchHit {
  slug: string;
  name: string;
  brand: string;
  category_name?: string;
  category_slug?: string;
  estimated_score: number;
  image_url?: string;
}

const DEBOUNCE_MS = 250;
const POPULAR_SEARCHES = [
  "machine à café", "aspirateur robot", "TV", "casque audio",
  "matelas", "friteuse à air", "enceinte", "smartphone"
];

export default function SearchOmnibox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const hasResults = results.length > 0;

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(q.trim())}&limit=8`, {
        signal: controller.signal,
      });
      if (!res.ok) return;
      const data = await res.json();
      const hits = Array.isArray(data) ? data : data.products || data.results || [];
      setResults(hits);
      setOpen(true);
      setSelectedIdx(-1);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("SearchOmnibox error", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = useCallback(
    (val: string) => {
      setQuery(val);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => search(val), DEBOUNCE_MS);
    },
    [search]
  );

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open || results.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIdx >= 0) {
          const hit = results[selectedIdx];
          if (hit) window.location.href = `/produit/${hit.slug}`;
        } else if (query.trim()) {
          window.location.href = `/produit/${query.trim().toLowerCase().replace(/\s+/g, '-')}`;
        }
      } else if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    },
    [open, results, selectedIdx, query]
  );

  // Close on click outside
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const clear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  const popularSearch = (term: string) => {
    setQuery(term);
    search(term);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6 px-4 sm:px-0">
      {/* Label */}
      <label className="block text-center text-sm font-medium mb-3" style={{ color: "var(--text-muted)" }}>
        🔍 <span className="font-semibold" style={{ color: "var(--text)" }}>Recherche directe</span>
        {" — "}Trouve un produit par son nom ou sa marque
      </label>

      {/* Input wrapper */}
      <div
        className="relative flex items-center rounded-2xl border-2 transition-all duration-300 shadow-lg"
        style={{
          borderColor: open && query.length >= 2
            ? "var(--coral)"
            : "var(--border)",
          backgroundColor: "rgba(17,17,19,0.92)",
          boxShadow: open && query.length >= 2
            ? "0 0 0 4px rgba(255,107,95,0.12), 0 8px 32px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(0,0,0,0.25)",
        }}
      >
        <Search
          className="ml-4 h-5 w-5 shrink-0 transition-colors duration-200"
          style={{ color: loading ? "var(--coral)" : query ? "var(--coral)" : "var(--text-muted)" }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder="Cherche un produit par nom, marque..."
          aria-label="Rechercher un produit"
          aria-expanded={open}
          aria-controls="search-results"
          aria-autocomplete="list"
          role="combobox"
          className="h-14 w-full bg-transparent px-3 text-base outline-none placeholder:text-sm placeholder:opacity-60 tracking-wide"
          style={{ color: "var(--text)" }}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="mr-2 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10 active:scale-95"
            aria-label="Effacer la recherche"
          >
            <X className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
          </button>
        )}
        {loading && (
          <span className="mr-4 h-5 w-5 shrink-0 animate-spin rounded-full border-2"
            style={{ borderColor: "var(--border)", borderTopColor: "var(--coral)" }} />
        )}
      </div>

      {/* Results dropdown */}
      {open && (
        <div
          ref={listRef}
          id="search-results"
          role="listbox"
          className="absolute left-4 right-4 sm:left-0 sm:right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border shadow-2xl animate-fade-in"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "rgba(20,22,35,0.98)",
            backdropFilter: "blur(20px)",
          }}
        >
          {hasResults ? (
            <>
              <div className="px-4 py-2 text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {results.length} résultat{results.length > 1 ? "s" : ""}
              </div>
              {results.map((hit, idx) => (
                <Link
                  key={hit.slug}
                  id={`search-hit-${idx}`}
                  href={`/produit/${hit.slug}`}
                  role="option"
                  aria-selected={idx === selectedIdx}
                  className="flex items-center gap-3 px-4 py-3 text-sm transition-all duration-150"
                  style={{
                    backgroundColor: idx === selectedIdx
                      ? "rgba(255,107,95,0.10)"
                      : "transparent",
                    borderBottom: idx < results.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    transform: idx === selectedIdx ? "translateX(4px)" : "none",
                  }}
                  onMouseEnter={() => setSelectedIdx(idx)}
                >
                  {/* Image */}
                  {hit.image_url ? (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                      style={{ backgroundColor: "var(--bg)" }}>
                      <img
                        src={hit.image_url}
                        alt=""
                        className="h-full w-full object-contain p-1"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
                      style={{ backgroundColor: "var(--bg)" }}>
                      📦
                    </div>
                  )}

                  {/* Infos */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-sm" style={{ color: "var(--text)" }}>
                      {hit.name}
                    </p>
                    <p className="truncate text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {hit.brand}
                      {hit.category_name && <span> · <span style={{ color: "var(--coral-light)" }}>{hit.category_name}</span></span>}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-xs font-bold rounded-full px-2.5 py-1"
                      style={{
                        color: "var(--mint)",
                        backgroundColor: "rgba(52,211,153,0.10)",
                        border: "1px solid rgba(52,211,153,0.15)",
                      }}
                    >
                      {hit.estimated_score?.toFixed(0) || "?"}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
                  </div>
                </Link>
              ))}
            </>
          ) : query.length >= 2 && !loading ? (
            <div className="p-6 text-center" style={{ color: "var(--text-muted)" }}>
              <p className="text-sm">Aucun produit trouvé pour &quot;{query}&quot;</p>
              <p className="text-xs mt-2 opacity-60">Essaie avec un autre terme ou consulte nos catégories</p>
            </div>
          ) : query.length < 2 && (
            <div className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                🔥 Recherches populaires
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => popularSearch(term)}
                    className="rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all hover:scale-105 active:scale-95"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text-muted)",
                      backgroundColor: "rgba(255,255,255,0.03)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--coral)"; e.currentTarget.style.color = "var(--text)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                  >
                    {term}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-3 opacity-40" style={{ color: "var(--text-muted)" }}>
                Tape au moins 2 caractères pour lancer la recherche
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
