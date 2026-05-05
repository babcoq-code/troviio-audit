'use client';

import Image from 'next/image';
import Link from 'next/link';
import { trackClick } from '@/lib/tracking';

interface PodiumAccessory {
  rank: 1 | 2 | 3;
  name: string;
  brand: string;
  slug: string;
  imageUrl: string | null;
  affiliateUrl: string | null;
  score: number;
  description: string | null;
}

const ACCESSORIES: PodiumAccessory[] = [
  {
    rank: 1,
    name: 'Carte microSD 128 Go SanDisk',
    brand: 'SanDisk',
    slug: 'carte-microsd-128go-haute-endurance',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUijiP_f3U-owRXPS_rKnt7jqVSdx3-S0ay7ZbKcuL1S7oq9zS42kFYjlu&s=10',
    affiliateUrl: 'https://www.amazon.fr/dp/B0B7M13C9T?tag=troviio-21',
    score: 96,
    description: 'Stockage robuste pour caméras, dashcams et smartphones. Résiste aux chocs et à l\'usure.',
  },
  {
    rank: 2,
    name: 'Belkin BoostCharge Pro 8000mAh Qi2',
    brand: 'Belkin',
    slug: 'belkin-boostcharge-pro-8000mah',
    imageUrl: 'https://m.media-amazon.com/images/I/517ylufYO3L.jpg',
    affiliateUrl: 'https://www.amazon.fr/dp/B0CZX91ZMJ?tag=troviio-21',
    score: 96,
    description: 'Batterie externe magnétique Qi2 avec socle intégré. Charge iPhone, AirPods sans fil.',
  },
  {
    rank: 3,
    name: 'UGREEN Revodok 1071 Hub USB-C 7-en-1',
    brand: 'UGREEN',
    slug: 'hub-usb-c-7-en-1',
    imageUrl: 'https://m.media-amazon.com/images/I/71m-IcVc03L._AC_SY355_.jpg',
    affiliateUrl: 'https://www.amazon.fr/dp/B0BLNDNBG1?tag=troviio-21',
    score: 85,
    description: 'Hub 7-en-1 : HDMI 4K, USB-A 5Gbps, SD/TF, PD 100W. Compatible MacBook, iPad, iPhone.',
  },
];

const PODIUM_STYLES = {
  1: {
    border: 'border-amber-300 bg-gradient-to-b from-amber-50/90 to-white',
    medal: '🥇',
    label: 'Meilleur accessoire',
    color: '#D97706',
  },
  2: {
    border: 'border-stone-300 bg-gradient-to-b from-stone-50/90 to-white',
    medal: '🥈',
    label: 'Coup de cœur',
    color: '#78716C',
  },
  3: {
    border: 'border-orange-300 bg-gradient-to-b from-orange-50/90 to-white',
    medal: '🥉',
    label: 'Indispensable',
    color: '#EA580C',
  },
};

function PodiumCard({ item }: { item: PodiumAccessory }) {
  const style = PODIUM_STYLES[item.rank];

  const handleAffiliateClick = async () => {
    await trackClick({
      type: 'affiliate_click',
      accessoryId: item.slug,
      url: item.affiliateUrl || '#',
      placement: 'accessory_podium',
    });
  };

  return (
    <div className="flex flex-col items-center">
      {/* Medals row */}
      <div className="mb-3 flex items-center gap-1.5">
        <span className="text-2xl">{style.medal}</span>
        <span
          className="rounded-full px-3 py-0.5 text-xs font-bold text-white shadow-sm"
          style={{ backgroundColor: style.color }}
        >
          {style.label}
        </span>
      </div>

      {/* Card */}
      <div
        className={`group relative flex w-full max-w-[280px] flex-col overflow-hidden rounded-2xl border-2 ${style.border} bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg`}
      >
        {/* Score badge */}
        <div className="absolute right-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white font-bold text-xs shadow"
             style={{ color: item.score >= 90 ? '#16A34A' : '#D97706' }}>
          {item.score}
        </div>

        {/* Image area - cliquable vers fiche accessoire */}
        <Link
          href={`/accessoires/${item.slug}`}
          className="flex h-32 items-center justify-center bg-white p-4"
        >
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt={item.name} width={120} height={120}
              className="max-h-28 w-auto object-contain transition duration-300 group-hover:scale-110" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-stone-100 text-4xl">
              {item.rank === 1 ? '💾' : item.rank === 2 ? '⚡' : '🔌'}
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="flex flex-1 flex-col px-4 pb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{item.brand}</p>
          <Link href={`/accessoires/${item.slug}`}>
            <h3 className="mt-0.5 text-sm font-bold leading-tight text-stone-900 line-clamp-2 hover:text-stone-600 transition-colors">
              {item.name}
            </h3>
          </Link>
          {item.description && (
            <p className="mt-1 text-xs leading-5 text-stone-500 line-clamp-2">{item.description}</p>
          )}

          <div className="mt-auto pt-3">
            <a
              href={item.affiliateUrl || '#'}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={handleAffiliateClick}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-stone-700 active:scale-95"
            >
              Voir sur Amazon
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccessoryPodium() {
  const ordered = [ACCESSORIES[1], ACCESSORIES[0], ACCESSORIES[2]];

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
          🏆 Sélection Troviio
        </p>
        <h2 className="mt-1.5 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
          Top 3 des accessoires les mieux notés
        </h2>
        <p className="mx-auto mt-1 max-w-lg text-sm text-stone-500">
          Indispensables, testés et notés par notre équipe — peu importe votre appareil
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-5 md:flex-row md:items-end md:gap-5">
        {ordered.map((item) => (
          <div key={item.rank} className={`w-full md:w-1/3 ${item.rank === 1 ? 'md:-mt-4 md:mb-0 z-10' : ''}`}>
            <PodiumCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
