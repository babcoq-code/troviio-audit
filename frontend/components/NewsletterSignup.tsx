"use client";

import { useState } from "react";
import { Sparkles, Send, CheckCircle2 } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("Merci ! Vous recevrez le Top 3 chaque mois ✨");
        setEmail("");
      } else {
        const data = await res.json();
        if (data.status === "already_exists") {
          setStatus("success");
          setMessage("Vous êtes déjà inscrit ! 🎉");
        } else {
          setStatus("error");
          setMessage(data.error || "Une erreur est survenue.");
        }
      }
    } catch {
      setStatus("error");
      setMessage("Erreur de connexion. Réessayez plus tard.");
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 4000);
  };

  return (
    <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 text-center dark:border-emerald-800 dark:from-emerald-950/30 dark:to-zinc-900">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
        <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
        Ne manquez pas le Top 3 du mois
      </h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
        Recevez chaque mois la sélection des 3 meilleurs produits dans chaque catégorie, directement dans votre boîte mail.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-900"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {status === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>

      {message && (
        <p
          className={`mt-2 text-xs font-medium ${
            status === "success"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
