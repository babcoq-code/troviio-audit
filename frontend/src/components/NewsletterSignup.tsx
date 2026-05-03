"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("✅ Inscrit ! Tu recevras le Top 3 chaque mois.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "❌ Erreur, réessaie.");
      }
    } catch {
      setStatus("error");
      setMessage("❌ Erreur réseau.");
    }
  };

  return (
    <section
      className="mx-auto mt-12 max-w-2xl rounded-[2rem] border p-8 text-center sm:p-10"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      <p className="font-sora text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--coral)" }}>
        Newsletter
      </p>
      <h2 className="mt-3 font-sora text-2xl font-bold tracking-tight sm:text-3xl">
        Le Top 3 du mois, dans ta boîte mail
      </h2>
      <p className="mt-3 text-sm leading-6" style={{ color: "var(--text-muted)" }}>
        Chaque mois, reçois les mises à jour du Top 3 par catégorie. Nouveaux produits,
        scores mis à jour, meilleures affaires. Zéro spam, désinscription 1 clic.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.fr"
          required
          className="flex-1 rounded-full border px-5 py-3 text-sm outline-none transition"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg)",
            color: "var(--text)",
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "var(--coral)" }}
        >
          {status === "loading" ? "..." : "Je m'inscris ✨"}
        </button>
      </form>

      {message && (
        <p className="mt-3 text-sm" style={{ color: status === "success" ? "var(--mint)" : "var(--coral)" }}>
          {message}
        </p>
      )}
    </section>
  );
}
