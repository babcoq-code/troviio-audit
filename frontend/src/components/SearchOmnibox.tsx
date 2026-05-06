"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

interface SearchHit {
  slug: string;
  name: string;
  brand: string;
  category_name?: string;
  estimated_score: number;
  image_url?: string;
}

const DEBOUNCE_MS = 200;

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

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    // Cancel previous request
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
      // data can be array directly or { products: [...] }
      const hits = Array.isArray(data) ? data : data.products || data.results || [];
      setResults(hits);
      setOpen(hits.length > 0);
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
      } else if (e.key === "Enter" && selectedIdx >= 0) {
        e.preventDefault();
        const hit = results[selectedIdx];
        if (hit) window.location.href = `/produit/${hit.slug}`;
      } else if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    },
    [open, results, selectedIdx]
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

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6">
      <div
        className="relative flex items-center rounded-2xl border transition-all duration-200 focus-within:shadow-lg"
        style={{
          borderColor: open && results.length > 0 ? "var(--coral)" : "var(--border)",
          backgroundColor: "rgba(17,17,19,0.9)",
        }}
      >
        <Search
          className="ml-4 h-5 w-5 shrink-0"
          style={{ color: loading ? "var(--coral)" : "var(--text-muted)" }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder="Cherche un produit par nom, marque, catégorie..."
          aria-label="Rechercher un produit"
          aria-expanded={open}
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-activedescendant={selectedIdx >= 0 ? `search-hit-${selectedIdx}` : undefined}
          className="h-12 w-full bg-transparent px-3 text-sm outline-none placeholder:text-sm"
          style={{ color: "var(--text)" }}
          autoComplete="off"
          role="combobox"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="mr-2 flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            aria-label="Effacer la recherche"
          >
            <X className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
          </button>
        )}
        {loading && (
          <span className="mr-4 h-4 w-4 animate-spin rounded-full border-2" 
            style={{ borderColor: "var(--border)", borderTopColor: "var(--coral)" }} />
        )}
      </div>

      {open && results.length > 0 && (
        <div
          ref={listRef}
          id="search-results"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border shadow-2xl"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "rgba(20,22,35,0.98)",
          }}
        >
          {results.map((hit, idx) => (
            <Link
              key={hit.slug}
              id={`search-hit-${idx}`}
              href={`/produit/${hit.slug}`}
              role="option"
              aria-selected={idx === selectedIdx}
              className="flex items-center gap-3 px-4 py-3 text-sm transition-colors"
              style={{
                backgroundColor:
                  idx === selectedIdx ? "rgba(255,107,95,0.12)" : "transparent",
                borderBottom:
                  idx < results.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
              onMouseEnter={() => setSelectedIdx(idx)}
            >
              {/* Mini image si dispo */}
              {hit.image_url ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                  style={{ backgroundColor: "var(--bg)" }}>
                  <img
                    src={hit.image_url}
                    alt=""
                    className="h-full w-full object-contain p-1"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
                  style={{ backgroundColor: "var(--bg)" }}>
                  🔍
                </div>
              )}

              {/* Infos */}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold" style={{ color: "var(--text)" }}>
                  {hit.name}
                </p>
                <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
                  {hit.brand}
                  {hit.category_name && <span> · {hit.category_name}</span>}
                </p>
              </div>

              {/* Score */}
              <span
                className="shrink-0 text-xs font-bold rounded-full px-2 py-1"
                style={{
                  color: "var(--mint)",
                  backgroundColor: "rgba(52,211,153,0.1)",
                }}
              >
                {hit.estimated_score?.toFixed(0) || "?"}/100
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Aucun résultat */}
      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border p-4 text-center text-sm shadow-2xl"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "rgba(20,22,35,0.98)",
            color: "var(--text-muted)",
          }}
        >
          Aucun produit trouvé pour &quot;{query}&quot;.
        </div>
      )}
    </div>
  );
}
