"use client";

import { useState, useEffect, useRef } from "react";

interface CountItem {
  label: string;
  target: number;
  suffix?: string;
  emoji: string;
}

export default function TrustCounter() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const items: CountItem[] = [
    { label: "Produits analysés", target: 408, emoji: "📊" },
    { label: "Avis vérifiés croisés", target: 125000, suffix: "+", emoji: "✅" },
    { label: "Catégories couvertes", target: 43, emoji: "📁" },
    { label: "Duels tranchés", target: 24, emoji: "⚔️" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const durations = [2000, 2500, 1500, 1800]; // ms
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newCounts: Record<string, number> = {};

      items.forEach((item, i) => {
        const progress = Math.min(elapsed / durations[i], 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        newCounts[item.label] = Math.round(eased * item.target);
      });

      setCounts({ ...newCounts });

      const allDone = items.every((_, i) => elapsed >= durations[i]);
      if (!allDone) {
        requestAnimationFrame(animate);
      } else {
        // Final snap
        const final: Record<string, number> = {};
        items.forEach((item) => { final[item.label] = item.target; });
        setCounts(final);
      }
    };

    requestAnimationFrame(animate);
  }, [visible]);

  function format(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k";
    return n.toString();
  }

  return (
    <section ref={ref} className="mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border p-6 sm:p-10" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="mb-6 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--coral)" }}>
              📈 TROVIIO EN CHIFFRES
            </p>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl" style={{ color: "var(--text)" }}>
              La donnée parle plus fort que les promesses
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
            {items.map((item) => (
              <div key={item.label} className="text-center">
                <span className="text-2xl sm:text-3xl">{item.emoji}</span>
                <p
                  className="mt-2 text-3xl font-black tracking-tight sm:text-4xl tabular-nums transition-all duration-300"
                  style={{
                    color: "var(--text)",
                    fontFamily: "'Nunito', sans-serif",
                    fontVariationSettings: "'wght' 900",
                  }}
                >
                  {visible ? format(counts[item.label] ?? 0) : "0"}
                  {item.suffix || ""}
                </p>
                <p className="mt-1 text-[11px] font-medium leading-tight" style={{ color: "var(--text-muted)" }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
