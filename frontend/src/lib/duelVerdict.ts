// ─── Verdict Types ──────────────────────────────────────────

export interface VerdictProduct {
  id: string;
  name: string;
  score: number;
  valueScore: number;
  price: number;
}

export interface VerdictResult {
  winner: VerdictProduct;
  loser: VerdictProduct;
  reason: string;
}

// ─── computeVerdict ─────────────────────────────────────────
// Logique de décision :
// - Si scoreGap ≥ 5 ET priceGap ≤ 50€  → winner = meilleur score
// - Si priceGap > 100€ ET scoreGap ≤ 3   → winner = meilleur Q/P (valueScore)
// - Sinon                                → winner = meilleur valueScore

export function computeVerdict(
  produitA: VerdictProduct,
  produitB: VerdictProduct,
): VerdictResult {
  const scoreGap = Math.abs(produitA.score - produitB.score);
  const priceGap = Math.abs(produitA.price - produitB.price);

  // Determine which product has higher score and which has higher valueScore
  const aHigherScore = produitA.score >= produitB.score;
  const higherScore = aHigherScore ? produitA : produitB;
  const lowerScore = aHigherScore ? produitB : produitA;

  const aHigherValue = produitA.valueScore >= produitB.valueScore;
  const higherValue = aHigherValue ? produitA : produitB;
  const lowerValue = aHigherValue ? produitB : produitA;

  // ── Décision ──
  let winner: VerdictProduct;
  let loser: VerdictProduct;
  let reason: string;

  if (scoreGap >= 5 && priceGap <= 50) {
    // Le meilleur score domine clairement à prix quasi équivalent
    winner = higherScore;
    loser = lowerScore;
    reason = `${winner.name} domine largement avec ${Math.round(scoreGap)} points d'écart au Troviio Score, pour seulement ${Math.round(priceGap)}€ d'écart de prix. Le choix est sans appel.`;
  } else if (priceGap > 100 && scoreGap <= 3) {
    // Énorme écart de prix, scores quasi identiques → meilleur rapport Q/P
    winner = higherValue;
    loser = winner.id === higherValue.id ? lowerScore : higherScore;
    // La logique : le gagnant est celui avec le meilleur valueScore
    // Le perdant est l'autre produit
    loser = winner.id === produitA.id ? produitB : produitA;
    const eco = Math.round(priceGap);
    reason = `À performances quasi identiques (${Math.round(scoreGap)} pts d'écart), ${winner.name} coûte ${eco}€ de moins. Le meilleur rapport qualité-prix.`;
  } else {
    // Cas par défaut : on suit le valueScore
    winner = higherValue;
    loser = lowerValue;
    const diff = Math.round(Math.abs(winner.valueScore - loser.valueScore));
    reason = `Sur l'équilibre global score/prix, ${winner.name} prend l'avantage avec ${diff} points de plus au valueScore.`;
  }

  return { winner, loser, reason };
}
