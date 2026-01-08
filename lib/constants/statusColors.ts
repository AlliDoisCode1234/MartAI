/**
 * Content Status Colors
 *
 * Unified status color definitions for content pieces, calendar items, and briefs.
 * Single source of truth to ensure consistent visual language across the app.
 */

/** Full status color config for complex components (glassmorphic cards) */
export const CONTENT_STATUS_STYLES = {
  draft: {
    bg: 'rgba(113, 128, 150, 0.1)',
    border: 'rgba(113, 128, 150, 0.3)',
    text: 'gray.400',
    hex: '#718096',
    colorScheme: 'gray',
  },
  generating: {
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.3)',
    text: 'blue.400',
    hex: '#3B82F6',
    colorScheme: 'blue',
  },
  scheduled: {
    bg: 'rgba(139, 92, 246, 0.1)',
    border: 'rgba(139, 92, 246, 0.3)',
    text: 'purple.400',
    hex: '#8B5CF6',
    colorScheme: 'purple',
  },
  approved: {
    bg: 'rgba(255, 157, 0, 0.1)',
    border: 'rgba(255, 157, 0, 0.3)',
    text: 'orange.400',
    hex: '#FF9D00',
    colorScheme: 'orange',
  },
  published: {
    bg: 'rgba(34, 197, 94, 0.1)',
    border: 'rgba(34, 197, 94, 0.3)',
    text: 'green.400',
    hex: '#22C55E',
    colorScheme: 'green',
  },
  pending: {
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.3)',
    text: 'yellow.400',
    hex: '#F59E0B',
    colorScheme: 'yellow',
  },
} as const;

export type ContentStatus = keyof typeof CONTENT_STATUS_STYLES;

/** Default fallback for unknown statuses */
const DEFAULT_STATUS_STYLE = CONTENT_STATUS_STYLES.draft;

/**
 * Gets the full style object for a content status.
 */
export function getStatusStyle(status: string) {
  return CONTENT_STATUS_STYLES[status as ContentStatus] ?? DEFAULT_STATUS_STYLE;
}

/**
 * Gets just the Chakra colorScheme string for badges.
 */
export function getStatusColorScheme(status: string): string {
  return getStatusStyle(status).colorScheme;
}

/**
 * Gets the hex color for a status.
 */
export function getStatusHex(status: string): string {
  return getStatusStyle(status).hex;
}
