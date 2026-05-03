"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { legalPages } from "@/lib/site";

export function LegalNavigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigation des pages légales" className="rounded-2xl p-4 shadow-sm" style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }}>
      <p className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Pages légales</p>
      <ul className="space-y-1">
        {legalPages.map((page) => {
          const isActive = pathname === page.href;
          return (
            <li key={page.href}>
              <Link href={page.href} aria-current={isActive ? "page" : undefined}
                className={`block rounded-xl px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isActive
                    ? "font-medium text-white"
                    : "hover:opacity-80"
                }`}
                style={{
                  backgroundColor: isActive ? "var(--coral)" : "transparent",
                  color: isActive ? "#fff" : "var(--text-muted)",
                }}
              >
                {page.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
