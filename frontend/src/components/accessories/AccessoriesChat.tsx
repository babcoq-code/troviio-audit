'use client';

import { useRef, useState, useMemo } from 'react';
import { AccessoriesChatMessage } from '@/lib/types/accessories';

const AMAZON_TAG = 'troviio-21';

/** Extrait les options cliquables (avec ou sans lien Amazon) du texte */
function parseOptions(text: string): { label: string; url?: string }[] {
  const options: { label: string; url?: string }[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    // Pattern: "N. [label] → https://..." ou "N. [label]"
    const withLink = trimmed.match(/^\d+[.)]\s*(.+?)\s*→\s*(https?:\/\/[^\s]+)/);
    const noLink = trimmed.match(/^\d+[.)]\s*(.+)/);

    if (withLink) {
      options.push({ label: withLink[1].trim(), url: withLink[2].trim() });
    } else if (noLink) {
      const label = noLink[1].trim();
      // Si c'est "Lancer la recherche" ou "🚀", pas de lien
      if (label.toLowerCase().includes('lancer') || label.toLowerCase().includes('🚀')) {
        options.push({ label, url: undefined });
      } else {
        // Option sans lien explicite → créer un lien Amazon générique
        const encoded = encodeURIComponent(label.replace(/[🔌🔧🛠️🎧💻📱🖨️🔊]/g, '').trim());
        options.push({
          label,
          url: `https://www.amazon.fr/s?k=${encoded}&tag=${AMAZON_TAG}`,
        });
      }
    }
  }

  return options;
}

export function AccessoriesChat({
  productId, productName,
}: {
  productId?: string; productName?: string;
}) {
  const [messages, setMessages] = useState<AccessoriesChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Je vous aide à choisir ${productName ? `les meilleurs accessoires pour ${productName}` : 'vos accessoires'}. Que cherchez-vous ?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || streaming) return;

    const userMsg: AccessoriesChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const assistantId = crypto.randomUUID();
    const assistantMsg: AccessoriesChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
    };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const res = await fetch('/api/accessories/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: userMsg.content,
          productId,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error('Erreur');
      const reader = res.body?.getReader();
      if (!reader) throw new Error('Pas de reader');

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readDone } = await reader.read();
        done = readDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            )
          );
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: m.content || 'Désolé, une erreur est survenue. Réessayez.' }
            : m
        )
      );
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleOptionClick = (option: { label: string; url?: string }) => {
    if (option.url) {
      // Lien Amazon → ouvrir dans un nouvel onglet
      window.open(option.url, '_blank', 'noopener,noreferrer');
    } else if (option.label.toLowerCase().includes('lancer') || option.label.toLowerCase().includes('🚀')) {
      // "Lancer la recherche" → envoyer un message pour déclencher la recherche
      setInput('🚀 Lancer la recherche');
      // On soumet automatiquement
      setTimeout(() => {
        const form = document.querySelector('#accessory-chat-form') as HTMLFormElement;
        form?.requestSubmit();
      }, 100);
    } else {
      // Option sans URL → l'envoyer comme message
      setInput(option.label);
      setTimeout(() => {
        const form = document.querySelector('#accessory-chat-form') as HTMLFormElement;
        form?.requestSubmit();
      }, 100);
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-[var(--bg-surface)] shadow-xl">
      <div className="p-6 md:p-8">
        <h2 className="font-sora text-xl font-bold text-white">💬 Un conseil accessoire ?</h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          Demandez à Troviio quel accessoire correspond à votre appareil.
        </p>
      </div>

      <div className="max-h-96 space-y-4 overflow-y-auto px-6 pb-4 md:px-8 scrollbar-thin">
        {messages.map((msg) => {
          // Extraire les options du message assistant
          const options = msg.role === 'assistant' ? parseOptions(msg.content) : [];
          // Texte sans les lignes d'options (pour éviter la duplication)
          const cleanContent = msg.content
            .split('\n')
            .filter((line) => !/^\d+[.)]/.test(line.trim()))
            .join('\n')
            .trim();

          return (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} flex-col`}>
              {/* Bulle de texte */}
              {cleanContent && (
                <div
                  className={`max-w-[85%] rounded-3xl px-5 py-3 text-sm leading-6 whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-[#FF6B5F] text-white'
                      : 'bg-[#161827] text-[#C9CCDA] border border-white/5'
                  }`}
                >
                  {cleanContent || (msg.role === 'assistant' && streaming ? '...' : '')}
                </div>
              )}

              {/* Options cliquables */}
              {options.length > 0 && (
                <div className="mt-2 space-y-2 max-w-[85%]">
                  {options.map((opt, i) => {
                    const isLaunch = opt.label.toLowerCase().includes('lancer') || opt.label.toLowerCase().includes('🚀');
                    const hasLink = !!opt.url;
                    return (
                      <button
                        key={i}
                        onClick={() => handleOptionClick(opt)}
                        disabled={streaming}
                        className={`w-full text-left rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                          isLaunch
                            ? 'bg-[#4257FF] text-white hover:bg-[#5870FF] shadow-lg'
                            : hasLink
                            ? 'border border-[#3ED6A3]/30 bg-[#3ED6A3]/8 text-[#3ED6A3] hover:bg-[#3ED6A3]/15'
                            : 'border border-white/10 bg-white/5 text-[#C9CCDA] hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex-1">{opt.label}</span>
                          {hasLink && (
                            <span className="shrink-0 text-xs opacity-70">↗</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/10 p-6 md:p-8">
        <form id="accessory-chat-form" onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question…"
            disabled={streaming}
            className="min-w-0 flex-1 rounded-2xl px-5 py-3 text-sm outline-none transition disabled:opacity-50"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
          />
          {streaming ? (
            <button type="button" onClick={handleCancel}
              className="inline-flex items-center justify-center rounded-2xl bg-[#FF6B5F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e55a4d]">
              ✕
            </button>
          ) : (
            <button type="submit" disabled={!input.trim()}
              className="inline-flex items-center justify-center rounded-2xl bg-[#4257FF] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5870FF] disabled:opacity-50">
              Envoyer
            </button>
          )}
        </form>
      </div>
    </section>
  );
}
