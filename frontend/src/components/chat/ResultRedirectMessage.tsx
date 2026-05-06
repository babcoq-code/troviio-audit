"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ResultRedirectMessageProps = {
  result_id: string;
};

const REDIRECT_DELAY_SECONDS = 3;

export function ResultRedirectMessage({ result_id }: ResultRedirectMessageProps) {
  const router = useRouter();
  const [remainingSeconds, setRemainingSeconds] = useState(REDIRECT_DELAY_SECONDS);
  const redirectedRef = useRef(false);

  const doRedirect = useCallback(() => {
    if (redirectedRef.current) return;
    redirectedRef.current = true;

    // Nettoyer localStorage pour éviter re-déclenchement
    try {
      window.localStorage.removeItem("troviio.chat.history.v2");
    } catch {}

    router.push(`/resultats/${encodeURIComponent(result_id)}`);
  }, [result_id, router]);

  useEffect(() => {
    if (!result_id || redirectedRef.current) return;

    const countdownInterval = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    const redirectTimeout = window.setTimeout(doRedirect, REDIRECT_DELAY_SECONDS * 1000);

    return () => {
      window.clearInterval(countdownInterval);
      window.clearTimeout(redirectTimeout);
    };
  }, [result_id, doRedirect]);

  const openNow = () => doRedirect();

  return (
    <section
      className="my-4 overflow-hidden rounded-3xl p-5 text-white shadow-xl"
      style={{
        background: "linear-gradient(135deg, #FF6B5F 0%, #E5554A 100%)",
      }}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="font-semibold text-lg leading-tight">
          🎯 J'ai trouvé ton produit !
        </p>
        <p className="text-sm opacity-90">
          Redirection vers les résultats dans <strong>{remainingSeconds}s</strong>
        </p>
        <button
          onClick={openNow}
          className="mt-1 rounded-full bg-white/20 px-6 py-2 text-sm font-bold backdrop-blur-sm transition hover:bg-white/30"
        >
          Voir les résultats ✨
        </button>
      </div>
    </section>
  );
}
