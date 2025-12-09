/**
 * Publishing retry utility
 *
 * Provides retry logic for publishing operations with configurable options.
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  retryableErrors?: string[];
}

export interface PublishResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Execute a publish operation with retry logic
 */
export async function publishWithRetry(
  operation: () => Promise<{ url: string }>,
  options: RetryOptions = {}
): Promise<PublishResult> {
  const { maxRetries = 3, initialDelayMs = 1000, retryableErrors = [] } = options;

  let lastError: Error | null = null;
  let delay = initialDelayMs;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await operation();
      return { success: true, url: result.url };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const errorMessage = lastError.message.toLowerCase();

      // Check if error is retryable
      const isRetryable =
        retryableErrors.length === 0 ||
        retryableErrors.some((r) => errorMessage.includes(r.toLowerCase()));

      if (!isRetryable || attempt === maxRetries - 1) {
        break;
      }

      console.log(`[PublishRetry] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }

  return { success: false, error: lastError?.message || 'Unknown error' };
}
