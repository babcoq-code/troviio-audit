"use client";

import { useState, useEffect, useCallback } from "react";

export interface WishlistItem {
  productId: string;
  productName: string;
  troviioScore?: number;
  categoryId?: string;
  slug: string;
  savedAt: string;
  priceAtSave?: number;
}

const STORAGE_KEY = "troviio_wishlist";

function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WishlistItem[];
  } catch {
    return [];
  }
}

function setWishlist(items: WishlistItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("WishlistButton: failed to save to localStorage", e);
  }
}

interface WishlistButtonProps {
  productId: string;
  productName: string;
  troviioScore?: number;
  categoryId?: string;
  slug: string;
  priceAtSave?: number;
  /** Override the default size: "sm" | "md" | "lg" */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { button: "w-8 h-8", icon: "text-lg" },
  md: { button: "w-10 h-10", icon: "text-xl" },
  lg: { button: "w-12 h-12", icon: "text-2xl" },
};

export default function WishlistButton({
  productId,
  productName,
  troviioScore,
  categoryId,
  slug,
  priceAtSave,
  size = "md",
  className = "",
}: WishlistButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Check initial state
  useEffect(() => {
    const items = getWishlist();
    setIsSaved(items.some((item) => item.productId === productId));
  }, [productId]);

  const handleToggle = useCallback(() => {
    const items = getWishlist();
    const exists = items.find((item) => item.productId === productId);

    if (exists) {
      // Remove from wishlist
      const updated = items.filter((item) => item.productId !== productId);
      setWishlist(updated);
      setIsSaved(false);
    } else {
      // Add to wishlist
      const newItem: WishlistItem = {
        productId,
        productName,
        troviioScore,
        categoryId,
        slug,
        savedAt: new Date().toISOString(),
        priceAtSave,
      };
      const updated = [newItem, ...items];
      setWishlist(updated);
      setIsSaved(true);
    }

    // Trigger animation
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
  }, [productId, productName, troviioScore, categoryId, slug, priceAtSave]);

  const s = sizeMap[size];

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isSaved ? "Retirer de la wishlist" : "Ajouter à la wishlist"}
      className={`relative inline-flex items-center justify-center rounded-full transition-all duration-200 active:scale-90 ${s.button} ${className}`}
      style={{
        backgroundColor: isSaved ? "rgba(255,107,95,0.15)" : "rgba(255,255,255,0.06)",
        border: isSaved ? "1px solid rgba(255,107,95,0.35)" : "1px solid rgba(255,255,255,0.1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isSaved
          ? "rgba(255,107,95,0.22)"
          : "rgba(255,255,255,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isSaved
          ? "rgba(255,107,95,0.15)"
          : "rgba(255,255,255,0.06)";
      }}
    >
      <span
        className={`${s.icon} transition-transform duration-300 ${
          animating ? "scale-125" : "scale-100"
        }`}
        style={{
          filter: isSaved ? "none" : "grayscale(0.8)",
          opacity: isSaved ? 1 : 0.5,
        }}
      >
        {isSaved ? "❤️" : "♡"}
      </span>
    </button>
  );
}
