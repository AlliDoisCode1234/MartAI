/**
 * computeKeywordPhooScore
 *
 * Pure utility — no UI dependencies.
 * Weighted formula: position (40%), volume (25%), difficulty inverse (20%), CTR (15%).
 *
 * Module Hierarchy:
 * lib → utils → phooScore (this file)
 */

export function computeKeywordPhooScore({
  position,
  volume,
  difficulty,
  ctr,
}: {
  position: number | null;
  volume: number | null;
  difficulty: number | null;
  ctr: number | null;
}): number {
  // Position score (1 = best = 100, 100+ = worst = 0)
  const posScore = position ? Math.max(0, 100 - (position - 1) * 1.5) : 30;

  // Volume score (normalized, 10000+ = 100)
  const volScore = volume ? Math.min(100, (volume / 5000) * 100) : 20;

  // Difficulty inverse (lower difficulty = higher score)
  const diffScore = difficulty !== null ? 100 - difficulty : 50;

  // CTR score (5%+ = 100, 0% = 0)
  const ctrScore = ctr ? Math.min(100, ctr * 2000) : 30;

  const weighted = posScore * 0.4 + volScore * 0.25 + diffScore * 0.2 + ctrScore * 0.15;
  return Math.round(Math.max(0, Math.min(100, weighted)));
}
