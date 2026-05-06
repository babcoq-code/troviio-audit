"use client";

import { BadgeCheck, Brain, Eye, Gift } from "lucide-react";

const items = [
  { icon: Gift, title: "Gratuit", description: "Aucun coût pour comparer." },
  { icon: BadgeCheck, title: "Sans inscription", description: "Une r\u00e9ponse imm\u00e9diate." },
  { icon: Eye, title: "Liens affili\u00e9s transparents", description: "Commission possible, prix inchang\u00e9." },
  { icon: Brain, title: "IA ind\u00e9pendante", description: "Recommandations selon votre usage." },
];

export default function TrustBar() {
  return (
    <section className="border-y border-white/5" style={{ backgroundColor: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl p-4"
                style={{ backgroundColor: "var(--bg-surface)" }}
              >
                <div
                  className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full shadow-sm ring-1"
                  style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--mint)" }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-5" style={{ color: "var(--text-muted)" }}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
