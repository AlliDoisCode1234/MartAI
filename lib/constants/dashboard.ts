/**
 * Dashboard Constants
 *
 * Mock data and configuration for dashboard components.
 */

export const MOCK_TRAFFIC_DATA = [
  { name: 'Jan', traffic: 4000, keywords: 240 },
  { name: 'Feb', traffic: 3000, keywords: 221 },
  { name: 'Mar', traffic: 5000, keywords: 290 },
  { name: 'Apr', traffic: 7800, keywords: 350 },
  { name: 'May', traffic: 8900, keywords: 410 },
  { name: 'Jun', traffic: 9500, keywords: 480 },
];

export const MOCK_KEYWORD_PERFORMANCE = [
  { keyword: 'SEO automation', position: 3, volume: 2400, trend: 'up' as const },
  { keyword: 'AI content writing', position: 7, volume: 1800, trend: 'up' as const },
  { keyword: 'keyword research tool', position: 12, volume: 3200, trend: 'down' as const },
  { keyword: 'content marketing', position: 5, volume: 5100, trend: 'up' as const },
  { keyword: 'SEO strategy', position: 9, volume: 2900, trend: 'stable' as const },
];

export type KeywordTrend = 'up' | 'down' | 'stable';

export function getPositionColorScheme(position: number): string {
  if (position <= 5) return 'green';
  if (position <= 10) return 'yellow';
  return 'gray';
}

export function getTrendBadge(trend: KeywordTrend): { colorScheme: string; symbol: string } {
  switch (trend) {
    case 'up':
      return { colorScheme: 'green', symbol: '↑' };
    case 'down':
      return { colorScheme: 'red', symbol: '↓' };
    default:
      return { colorScheme: 'gray', symbol: '→' };
  }
}

export function getPerformanceValue(position: number): number {
  if (position <= 3) return 90;
  if (position <= 10) return 60;
  return 30;
}
