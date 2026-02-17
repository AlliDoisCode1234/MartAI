'use client';

/**
 * PhooScoreBadge
 *
 * Component Hierarchy:
 * App -> Keywords -> KeywordTable -> PhooScoreBadge (this file)
 *
 * Circular progress indicator for per-keyword Phoo Score (0-100).
 * Computed from position, volume, difficulty, and CTR.
 */

import { Box, Text } from '@chakra-ui/react';

type Props = {
  score: number; // 0-100
};

function getScoreColor(score: number): string {
  if (score >= 80) return '#34d399';
  if (score >= 60) return '#F99F2A';
  if (score >= 40) return '#fb923c';
  return '#ef4444';
}

export function PhooScoreBadge({ score }: Props) {
  const color = getScoreColor(score);
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const remaining = circumference - progress;

  return (
    <Box
      position="relative"
      w="40px"
      h="40px"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
    >
      <svg width="40" height="40" viewBox="0 0 40 40">
        {/* Background circle */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="3"
        />
        {/* Progress arc */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${progress} ${remaining}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
        />
      </svg>
      <Text position="absolute" fontSize="11px" fontWeight="bold" color={color}>
        {score}
      </Text>
    </Box>
  );
}

/**
 * Compute a per-keyword Phoo Score from available data.
 * Weighted formula: position (40%), volume (25%), difficulty inverse (20%), CTR (15%).
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
