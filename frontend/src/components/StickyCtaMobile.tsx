"use client";

import * as React from "react";

export interface StickyCtaMobileProps {
  productName: string;
  price: number;
  affiliateUrl: string;
}

export function StickyCtaMobile({
  productName,
  price,
  affiliateUrl,
}: StickyCtaMobileProps): React.JSX.Element {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky-cta-mobile ${visible ? "sticky-cta-mobile--visible" : ""}`}
    >
      <div className="sticky-cta-mobile__inner">
        <div className="sticky-cta-mobile__info">
          <span className="sticky-cta-mobile__name">{productName}</span>
          <span className="sticky-cta-mobile__price">
            {price.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="sticky-cta-mobile__button"
        >
          Voir le meilleur prix →
        </a>
      </div>
    </div>
  );
}

export default StickyCtaMobile;
