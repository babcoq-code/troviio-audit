'use client';

import { useWishlist, type WishlistItem } from './useWishlist';
import { useState } from 'react';

interface WishlistButtonProps {
  productId: string;
  productSlug: string;
  productName: string;
  productBrand?: string;
  productImage?: string;
  troviioScore: number;
  categorySlug?: string;
  priceAtSave?: number;
  className?: string;
  /** Variante d'affichage */
  variant?: 'icon' | 'full' | 'compact';
}

export function WishlistButton({
  productId,
  productSlug,
  productName,
  productBrand,
  productImage,
  troviioScore,
  categorySlug,
  priceAtSave,
  className = '',
  variant = 'full',
}: WishlistButtonProps) {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(productId);
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    const item: WishlistItem = {
      productId,
      productSlug,
      productName,
      productBrand,
      productImage,
      troviioScore,
      categorySlug,
      priceAtSave,
      savedAt: new Date().toISOString(),
    };
    toggle(item);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`transition-transform ${animating ? 'scale-125' : 'scale-100'} ${className}`}
        aria-label={saved ? 'Retirer de ma liste' : 'Ajouter à ma liste'}
        title={saved ? 'Retirer de ma liste' : 'Sauvegarder'}
      >
        <span className={`text-xl ${saved ? 'text-[#FF6B5F]' : 'text-[#8B8FA3] hover:text-white'}`}>
          {saved ? '❤️' : '🤍'}
        </span>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
          saved
            ? 'bg-[#FF6B5F]/20 text-[#FF6B5F] border border-[#FF6B5F]/30'
            : 'bg-white/5 text-[#8B8FA3] border border-white/10 hover:bg-white/10 hover:text-white'
        } ${animating ? 'scale-105' : 'scale-100'} ${className}`}
      >
        <span>{saved ? '❤️' : '🤍'}</span>
        <span>{saved ? 'Sauvegardé' : 'Sauvegarder'}</span>
      </button>
    );
  }

  // variant 'full'
  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
        saved
          ? 'bg-[#FF6B5F]/15 text-[#FF6B5F] border border-[#FF6B5F]/30'
          : 'bg-white/5 text-[#8B8FA3] border border-white/10 hover:bg-white/10 hover:text-white'
      } ${animating ? 'scale-105' : 'scale-100'} ${className}`}
    >
      <span className="text-lg">{saved ? '❤️' : '🤍'}</span>
      <span>{saved ? 'Dans ma liste' : 'Ajouter à ma liste'}</span>
    </button>
  );
}
