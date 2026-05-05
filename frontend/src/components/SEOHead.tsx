"use client";

import { useEffect } from "react";

export default function SEOHead() {
  useEffect(() => {
    // Ajouter og:image et twitter:image si pas déjà présents
    const addMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      if (!document.querySelector(`meta[${attr}="${name}"]`)) {
        const meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };

    addMeta("og:image", "https://troviio.com/og-image.png", true);
    addMeta("og:image:width", "1200", true);
    addMeta("og:image:height", "630", true);
    addMeta("og:image:type", "image/png", true);
    addMeta("twitter:image", "https://troviio.com/og-image.png");
  }, []);

  return null;
}
