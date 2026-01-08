import { format, startOfMonth, endOfMonth, startOfDay, endOfDay, subDays } from 'date-fns';

/**
 * Formats a date using date-fns.
 * Falls back to 'PP' (e.g. "Apr 29, 2023") if no pattern is provided.
 */
export function formatDate(date: Date | number | string, pattern: string = 'PP'): string {
  return format(new Date(date), pattern);
}

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

/**
 * Formats a timestamp as a human-readable relative time string.
 * Examples: "5m ago", "2h ago", "3d ago", or a formatted date for older items.
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
