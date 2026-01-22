/**
 * Priority Display Utilities
 *
 * Maps internal priority codes (P0, P1, P2) to user-friendly display labels.
 * Follows industry standard pattern (ClickUp, Monday.com, Asana).
 *
 * Schema values remain unchanged - this is display-only.
 */

// Priority levels following industry standard (ClickUp pattern)
export const PRIORITY_CONFIG = {
  P0: {
    label: 'Urgent',
    color: '#EF4444', // Red
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  P1: {
    label: 'High',
    color: '#FF9D00', // Brand orange
    bgColor: 'rgba(255, 157, 0, 0.15)',
    borderColor: 'rgba(255, 157, 0, 0.3)',
  },
  P2: {
    label: 'Normal',
    color: '#3B82F6', // Blue
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  default: {
    label: 'Low',
    color: '#6B7280', // Gray
    bgColor: 'rgba(107, 114, 128, 0.15)',
    borderColor: 'rgba(107, 114, 128, 0.3)',
  },
} as const;

export type PriorityCode = 'P0' | 'P1' | 'P2';

/**
 * Get display configuration for a priority code
 * @param priority - The schema priority value (P0, P1, P2) or undefined
 * @returns Display configuration with label, colors
 */
export function getPriorityDisplay(priority?: PriorityCode | string) {
  if (priority && priority in PRIORITY_CONFIG) {
    return PRIORITY_CONFIG[priority as PriorityCode];
  }
  return PRIORITY_CONFIG.default;
}

/**
 * Get just the display label for a priority
 * @param priority - The schema priority value
 * @returns Human-readable label (Urgent, High, Normal, Low)
 */
export function getPriorityLabel(priority?: PriorityCode | string): string {
  return getPriorityDisplay(priority).label;
}

/**
 * Priority options for dropdowns/filters
 * Includes 'all' option for filter views
 */
export const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All Priority' },
  { value: 'P0', label: 'Urgent' },
  { value: 'P1', label: 'High' },
  { value: 'P2', label: 'Normal' },
] as const;

/**
 * Priority options for forms (without 'all')
 */
export const PRIORITY_FORM_OPTIONS = [
  { value: 'P0', label: 'Urgent' },
  { value: 'P1', label: 'High' },
  { value: 'P2', label: 'Normal' },
] as const;
