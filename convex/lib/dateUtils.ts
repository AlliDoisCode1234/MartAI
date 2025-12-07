import { format, startOfMonth, endOfMonth } from 'date-fns';

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
