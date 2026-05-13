'use client';

import { useEffect, useState, useCallback } from 'react';

export interface WishlistItem {
  productId: string;
  productSlug: string;
  productName: string;
  productBrand?: string;
  productImage?: string;
  troviioScore: number;
  categorySlug?: string;
  savedAt: string;
  priceAtSave?: number;
}

const STORAGE_KEY = 'troviio_wishlist';

// Hook personnalisé pour la wishlist
export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  const save = useCallback((newItems: WishlistItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch { /* localStorage plein ou désactivé */ }
  }, []);

  const add = useCallback((item: WishlistItem) => {
    setItems(prev => {
      const exists = prev.some(i => i.productId === item.productId);
      if (exists) return prev;
      const updated = [item, ...prev].slice(0, 50); // max 50
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch { /* ignore */ }
      return updated;
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems(prev => {
      const updated = prev.filter(i => i.productId !== productId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch { /* ignore */ }
      return updated;
    });
  }, []);

  const isSaved = useCallback((productId: string) => {
    return items.some(i => i.productId === productId);
  }, [items]);

  const toggle = useCallback((item: WishlistItem) => {
    if (items.some(i => i.productId === item.productId)) {
      remove(item.productId);
      return false;
    } else {
      add(item);
      return true;
    }
  }, [items, add, remove]);

  const count = items.length;

  return { items, add, remove, toggle, isSaved, count, loaded };
}
