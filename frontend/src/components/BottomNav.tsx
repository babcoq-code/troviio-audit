"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Sparkles, Trophy } from "lucide-react";

const items = [
  { href: "/", icon: Home, label: "Accueil" },
  { href: "/catalogue", icon: LayoutGrid, label: "Catalogue" },
  { href: "/#chat", icon: Sparkles, label: "Chat IA", featured: true },
  { href: "/tops", icon: Trophy, label: "Tops" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t pb-[env(safe-area-inset-bottom)]"
      style={{ backgroundColor: "rgba(14,16,32,0.97)", borderColor: "var(--border)", backdropFilter: "blur(12px)" }}>
      <ul className="grid grid-cols-4 h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex flex-col items-center justify-center h-full gap-1 text-xs font-medium transition-colors"
                style={{ color: active ? "var(--mint)" : "var(--text-muted)" }}
              >
                <div
                  className={
                    item.featured
                      ? "flex items-center justify-center w-10 h-10 rounded-full -mt-4 shadow-lg"
                      : ""
                  }
                  style={item.featured ? { backgroundColor: "var(--coral)" } : {}}
                >
                  <Icon className="h-5 w-5" style={item.featured ? { color: "white" } : {}} />
                </div>
                <span className={item.featured ? "mt-1" : ""}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
