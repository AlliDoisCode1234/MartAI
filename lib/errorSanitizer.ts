/**
 * Error Sanitization Utility
 *
 * Prevents exposure of internal Convex/server errors to users.
 * All error messages shown to users should go through this utility.
 *
 * SECURITY: Never expose stack traces, function names, or internal paths.
 */

// Known safe error messages that can be shown to users
const SAFE_ERROR_PATTERNS: Record<string, string> = {
  'Rate limit exceeded': 'Too many requests. Please wait a moment and try again.',
  Unauthorized: 'Please sign in to continue.',
  'Not found': 'The requested item could not be found.',
  'Access denied': 'You do not have permission to perform this action.',
  super_admin: 'This feature requires elevated permissions.',
  'Admin access required': 'This feature requires admin permissions.',
  'Invalid input': 'Please check your input and try again.',
  'Network error': 'Connection issue. Please check your internet and try again.',
  timeout: 'The request took too long. Please try again.',
};

// Patterns that indicate internal errors (should be hidden)
const INTERNAL_ERROR_PATTERNS = [
  /convex/i,
  /mutation/i,
  /query/i,
  /handler/i,
  /ctx\./i,
  /undefined is not/i,
  /cannot read prop/i,
  /is not a function/i,
  /unexpected token/i,
  /syntax error/i,
  /stack trace/i,
  /at \w+\s*\(/i, // Stack trace pattern
  /\.ts:|\.tsx:|\.js:/i, // File paths
  /node_modules/i,
  /internal server/i,
];

// Default user-friendly error message
const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/**
 * Sanitize an error message for display to users
 * @param error - The error object or message
 * @param fallback - Optional custom fallback message
 */
export function sanitizeErrorMessage(
  error: unknown,
  fallback: string = DEFAULT_ERROR_MESSAGE
): string {
  // Extract message
  let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (typeof error === 'object' && error !== null) {
    message = (error as { message?: string }).message || String(error);
  } else {
    return fallback;
  }

  // Check for known safe patterns
  for (const [pattern, safeMessage] of Object.entries(SAFE_ERROR_PATTERNS)) {
    if (message.toLowerCase().includes(pattern.toLowerCase())) {
      return safeMessage;
    }
  }

  // Check for internal error patterns - hide these
  for (const pattern of INTERNAL_ERROR_PATTERNS) {
    if (pattern.test(message)) {
      console.error('[Security] Hiding internal error:', message);
      return fallback;
    }
  }

  // If message is very long (likely a stack trace), hide it
  if (message.length > 200) {
    console.error('[Security] Hiding long error message:', message.substring(0, 100) + '...');
    return fallback;
  }

  // If message looks like a user-facing message (no code patterns), allow it
  // But still log for monitoring
  console.warn('[Security] Allowing error message:', message);
  return message;
}

/**
 * Get error type for analytics
 */
export function getErrorType(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('Rate limit')) return 'rate_limit';
  if (message.includes('Unauthorized')) return 'auth';
  if (message.includes('timeout')) return 'timeout';
  if (message.includes('Network')) return 'network';
  if (message.includes('Not found')) return 'not_found';
  if (message.includes('Access denied')) return 'access_denied';

  return 'unknown';
}

/**
 * Hook for handling errors in components
 */
export function useErrorHandler() {
  const handleError = (error: unknown, context?: string) => {
    const sanitized = sanitizeErrorMessage(error);
    const errorType = getErrorType(error);

    // Log full error for debugging (never shown to user)
    console.error(`[${context || 'Error'}]`, error);

    return {
      message: sanitized,
      type: errorType,
    };
  };

  return { handleError, sanitizeErrorMessage };
}
