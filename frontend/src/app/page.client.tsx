"use client";

import { useCallback, useState } from "react";
import { useHistory } from "@/hooks/useHistory";
import HistorySidebar from "@/components/HistorySidebar";
import ChatHero from "@/components/ChatHero";
import CategoryGrid from "@/components/CategoryGrid";
import Top3Home from "@/components/Top3Home";
import SearchOmnibox from "@/components/SearchOmnibox";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function HomePageClient() {
  const { history, loaded, remove, clear } = useHistory();
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  return (
    <>
      <section className="pt-20 sm:pt-28">
        <SearchOmnibox />
      </section>
      <ChatHero />
      <Top3Home />
      <CategoryGrid />

      {/* Historique des recherches */}
      {loaded && history.results.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <HistorySidebar
            items={history.results}
            onRemove={remove}
            onClear={clear}
            position="cards"
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
          />
        </div>
      )}

      <NewsletterSignup />
    </>
  );
}
