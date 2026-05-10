"use client";

const PROMPTS = [
  { emoji: "🏠", text: "Un aspirateur pour appart 60m² avec un chien qui perd ses poils" },
  { emoji: "🎧", text: "Casque audio pour télétravail open space, max 200€" },
  { emoji: "☕", text: "Machine à café expresso pour 2 personnes, simple à entretenir" },
  { emoji: "💻", text: "PC portable pour étudiant en design, budget 1200€" },
  { emoji: "🍳", text: "Robot cuisine pour famille de 4, je cuisine peu" },
  { emoji: "🏃", text: "Montre running débutant, je veux pas un truc gadget" },
];

interface StarterPromptsProps {
  onSelect?: (text: string) => void;
}

export default function StarterPrompts({ onSelect }: StarterPromptsProps) {
  const handleClick = (text: string) => {
    if (onSelect) {
      onSelect(text);
      return;
    }
    // Default: dispatch custom event for ChatHero — qui soumet automatiquement
    window.dispatchEvent(
      new CustomEvent("troviio:open-chat-category", {
        detail: { prompt: text, autoSend: true },
      })
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-6">
      <p className="text-sm text-white/50 mb-3 text-center">
        Pas d&apos;inspiration ? Essayez l&apos;une de ces situations :
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => handleClick(p.text)}
            className="group relative flex items-start gap-3 p-4 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#FF6B5F]/40 rounded-xl text-left transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FF6B5F]/10"
          >
            <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
              {p.emoji}
            </span>
            <span className="text-sm text-white/80 group-hover:text-white leading-snug">
              {p.text}
            </span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF6B5F] opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
