/**
 * Generate SVG Badge Utility
 *
 * Creates MR Score badge as SVG for embedding on external sites.
 * Generates backlinks when users embed badges.
 */

type BadgeStyle = 'compact' | 'full';
type BadgeTheme = 'light' | 'dark';

type Props = {
  score: number;
  style?: BadgeStyle;
  theme?: BadgeTheme;
};

function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e'; // green-500
  if (score >= 60) return '#eab308'; // yellow-500
  if (score >= 40) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
}

function getStars(score: number): string {
  const filled = Math.round(score / 20); // 0-5 stars
  return '★'.repeat(filled) + '☆'.repeat(5 - filled);
}

export function generateBadgeSvg({ score, style = 'compact', theme = 'light' }: Props): string {
  const bgColor = theme === 'light' ? '#ffffff' : '#1f2937';
  const textColor = theme === 'light' ? '#374151' : '#f3f4f6';
  const scoreColor = getScoreColor(score);
  const stars = getStars(score);

  if (style === 'compact') {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="28" viewBox="0 0 120 28">
  <rect width="120" height="28" rx="4" fill="${bgColor}" stroke="#e5e7eb" stroke-width="1"/>
  <text x="8" y="18" font-family="system-ui, sans-serif" font-size="11" fill="${textColor}">MR</text>
  <text x="28" y="18" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="${scoreColor}">${score}</text>
  <text x="52" y="17" font-family="system-ui, sans-serif" font-size="8" fill="#f59e0b">${stars}</text>
</svg>`.trim();
  }

  // Full style
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="48" viewBox="0 0 180 48">
  <rect width="180" height="48" rx="6" fill="${bgColor}" stroke="#e5e7eb" stroke-width="1"/>
  <text x="12" y="22" font-family="system-ui, sans-serif" font-size="12" fill="${textColor}">MR Score</text>
  <text x="12" y="38" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="${scoreColor}">${score}</text>
  <text x="50" y="38" font-family="system-ui, sans-serif" font-size="12" fill="#f59e0b">${stars}</text>
  <text x="112" y="38" font-family="system-ui, sans-serif" font-size="8" fill="#9ca3af">MartAI</text>
</svg>`.trim();
}
