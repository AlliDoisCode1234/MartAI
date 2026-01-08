/**
 * SEO Grading Utilities
 *
 * Shared scoring and grading functions for content quality metrics.
 * Used across Content Studio, Calendar, and Dashboard components.
 */

interface GradeResult {
  grade: string;
  color: string;
}

/**
 * Converts an SEO score (0-100) to a letter grade with associated color.
 * Handles undefined/null scores gracefully.
 */
export function getSeoGrade(score?: number | null): GradeResult {
  if (!score || score === 0) return { grade: '—', color: 'gray.500' };
  if (score >= 90) return { grade: 'A+', color: '#22C55E' };
  if (score >= 80) return { grade: 'A', color: '#22C55E' };
  if (score >= 70) return { grade: 'B+', color: '#FF9D00' };
  if (score >= 60) return { grade: 'B', color: '#FF9D00' };
  if (score >= 50) return { grade: 'C', color: '#EF4444' };
  return { grade: 'D', color: '#EF4444' };
}

/**
 * Gets just the color for a score (used in progress bars, backgrounds).
 */
export function getSeoColor(score?: number | null): string {
  if (!score || score === 0) return 'gray.500';
  if (score >= 90) return '#22C55E';
  if (score >= 70) return '#FF9D00';
  return '#EF4444';
}

/**
 * Gets Chakra colorScheme string for a score.
 */
export function getSeoColorScheme(score?: number | null): string {
  if (!score || score === 0) return 'gray';
  if (score >= 90) return 'green';
  if (score >= 70) return 'orange';
  return 'red';
}
