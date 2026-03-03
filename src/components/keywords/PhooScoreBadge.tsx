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

// Re-export pure utility for backwards compatibility
export { computeKeywordPhooScore } from '../../lib/utils/phooScore';
