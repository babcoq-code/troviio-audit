"use client";

import { useCallback, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "troviio_history";
const MAX_ITEMS = 5;

export type HistoryItem = {
  id: string;
  category: string;
  label: string;
  created_at: string;
  topProducts: string[];
  budget: string;
};

export type HistoryData = {
  results: HistoryItem[];
};

// ─── Helpers (safe localStorage) ──────────────────────────────────────────────

function safeRead(): HistoryData {
  if (typeof window === "undefined") return { results: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { results: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.results)) {
      return { results: [] };
    }
    return parsed as HistoryData;
  } catch {
    return { results: [] };
  }
}

function safeWrite(data: HistoryData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage might be full or unavailable
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useHistory() {
  const [history, setHistory] = useState<HistoryData>({ results: [] });
  const [loaded, setLoaded] = useState(false);

  // Charger au montage
  useEffect(() => {
    setHistory(safeRead());
    setLoaded(true);
  }, []);

  // Recharger depuis localStorage
  const load = useCallback((): HistoryData => {
    const data = safeRead();
    setHistory(data);
    return data;
  }, []);

  // Ajouter un résultat en tête (max 5)
  const save = useCallback((item: HistoryItem) => {
    setHistory((prev) => {
      const filtered = prev.results.filter((r) => r.id !== item.id);
      const results = [item, ...filtered].slice(0, MAX_ITEMS);
      const data: HistoryData = { results };
      safeWrite(data);
      return data;
    });
  }, []);

  // Supprimer un résultat par son id
  const remove = useCallback((id: string) => {
    setHistory((prev) => {
      const results = prev.results.filter((r) => r.id !== id);
      const data: HistoryData = { results };
      safeWrite(data);
      return data;
    });
  }, []);

  // Vider tout l'historique
  const clear = useCallback(() => {
    const data: HistoryData = { results: [] };
    safeWrite(data);
    setHistory(data);
  }, []);

  return { history, loaded, load, save, remove, clear };
}
