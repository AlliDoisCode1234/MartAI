import {
  format,
  formatDistanceToNow,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  subDays,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
} from 'date-fns';

// =============================================================================
// DISPLAY FORMATTING
// =============================================================================

/**
 * Formats a date using date-fns with a custom pattern.
 * Falls back to 'PP' (e.g. "Apr 29, 2023") if no pattern is provided.
 */
export function formatDate(date: Date | number | string, pattern: string = 'PP'): string {
  if (!date) return '—';
  return format(new Date(date), pattern);
}

/**
 * "Jan 7, 2026" — Short date for lists and cards
 */
export function formatShortDate(date: Date | number): string {
  if (!date) return '—';
  return format(new Date(date), 'MMM d, yyyy');
}

/**
 * "January 7, 2026" — Long date for profile, formal displays
 */
export function formatLongDate(date: Date | number): string {
  if (!date) return '—';
  return format(new Date(date), 'MMMM d, yyyy');
}

/**
 * "Jan 7" — Month and day without year (for calendars)
 */
export function formatMonthDay(date: Date | number): string {
  if (!date) return '—';
  return format(new Date(date), 'MMM d');
}

/**
 * "Jan 7, 2026 at 3:45 PM" — Full datetime for scheduling
 */
export function formatDateTime(date: Date | number): string {
  if (!date) return '—';
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
}

/**
 * "3:45 PM" — Time only
 */
export function formatTime(date: Date | number): string {
  if (!date) return '—';
  return format(new Date(date), 'h:mm a');
}

/**
 * "Mon" — Short weekday name
 */
export function formatWeekday(date: Date | number): string {
  if (!date) return '—';
  return format(new Date(date), 'EEE');
}

/**
 * "Mon, Jan 7" — Weekday with month and day
 */
export function formatWeekdayDate(date: Date | number): string {
  if (!date) return '—';
  return format(new Date(date), 'EEE, MMM d');
}

/**
 * "January 2026" — Month and year for calendar headers
 */
export function formatMonthYear(date: Date | number): string {
  if (!date) return '—';
  return format(new Date(date), 'MMMM yyyy');
}

/**
 * "5 minutes ago", "2 hours ago", "3 days ago" — Relative time using date-fns
 */
export function formatTimeAgo(date: Date | number): string {
  if (!date) return '—';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Formats a timestamp as a human-readable relative time string.
 * Uses custom short format for recent times, date-fns format() for older items.
 * Examples: "just now", "5m ago", "2h ago", "3d ago", "Jan 7, 2026"
 */
export function formatRelativeTime(timestamp: number): string {
  if (!timestamp) return '—';

  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  // Use date-fns format for older dates (per Board feedback)
  return format(new Date(timestamp), 'MMM d, yyyy');
}

// =============================================================================
// DATE MATH & BOUNDARIES
// =============================================================================

/**
 * Returns the current date as a Date object.
 */
export function getCurrentDate(): Date {
  return new Date();
}

/**
 * Returns the start and end timestamps (milliseconds) for the month of the given date.
 */
export function getMonthBoundaries(date: Date | number = new Date()): {
  start: number;
  end: number;
} {
  const d = new Date(date);
  return {
    start: startOfMonth(d).getTime(),
    end: endOfMonth(d).getTime(),
  };
}

/**
 * Calculates the relative week number from now for a given timestamp.
 */
export function getRelativeWeek(targetDate: number): number {
  const diff = targetDate - Date.now();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
}

/**
 * Returns the start of the day for the given date.
 */
export function getStartOfDay(date: Date | number = new Date()): Date {
  return startOfDay(new Date(date));
}

/**
 * Returns the end of the day for the given date.
 */
export function getEndOfDay(date: Date | number = new Date()): Date {
  return endOfDay(new Date(date));
}

/**
 * Subtracts the specified number of days from the given date.
 */
export function subtractDays(date: Date | number, amount: number): Date {
  return subDays(new Date(date), amount);
}

// =============================================================================
// RE-EXPORTS FROM DATE-FNS (for calendar components)
// =============================================================================

export {
  isSameDay,
  addDays,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
};
