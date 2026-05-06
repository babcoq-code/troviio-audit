import Link from "next/link";
import { getCrossLinks, type CrossLink } from "@/lib/seo/cross-linking-map";

interface CrossCategoryLinksProps {
  currentCategorySlug: string;
  categoryName: string;
  max?: number;
}

export function CrossCategoryLinks({
  currentCategorySlug,
  categoryName,
  max = 3,
}: CrossCategoryLinksProps) {
  const links = getCrossLinks(currentCategorySlug, max);
  if (!links.length) return null;

  return (
    <aside className="my-10 rounded-2xl border border-white/5 bg-[#161827] p-6">
      <h2 className="mb-4 text-lg font-bold text-white">
        💡 À explorer pour compléter votre {categoryName}
      </h2>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.slug}>
            <Link
              href={link.slug}
              className="group flex items-start gap-3 text-[#8B8FA3] hover:text-white transition-colors"
            >
              <span className="mt-1 text-[#6B6B7A] group-hover:text-[#3ED6A3]" aria-hidden="true">
                →
              </span>
              <span>
                <strong className="font-semibold group-hover:underline group-hover:text-[#3ED6A3]">
                  {link.label}
                </strong>
                <span className="ml-1 text-sm text-[#6B6B7A]">
                  — {link.reason}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
