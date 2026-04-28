import ChatHero from "@/components/ChatHero";
import CategoryGrid from "@/components/CategoryGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Troviio | Pas le meilleur. Le tien.",
  description: "Décris ta vie, tes contraintes, ton budget. Troviio croise tout pour te donner UNE réponse claire.",
  alternates: { canonical: "https://www.troviio.com/" },
};

export default function HomePage() {
  return (
    <>
      <ChatHero />
      <CategoryGrid />
    </>
  );
}
