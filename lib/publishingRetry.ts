/**
 * Retry utility for publishing operations with exponential backoff
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  retryableErrors: [
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
    'ECONNREFUSED',
    'timeout',
    'network',
    'rate limit',
    '429',
    '503',
    '502',
    '500',
  ],
};

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: unknown, retryableErrors: string[]): boolean {
  if (!error) return false;
  
  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  const errorString = JSON.stringify(error).toLowerCase();
  
  return retryableErrors.some((retryable) => 
    errorMessage.includes(retryable.toLowerCase()) || 
    errorString.includes(retryable.toLowerCase())
  );
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;
  let delay = opts.initialDelayMs;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if it's the last attempt
      if (attempt === opts.maxRetries) {
        break;
      }

      // Don't retry if error is not retryable
      if (!isRetryableError(error, opts.retryableErrors)) {
        break;
      }

      // Wait before retrying
      await sleep(Math.min(delay, opts.maxDelayMs));
      delay *= opts.backoffMultiplier;
    }
  }

  throw lastError;
}

/**
 * Publishing result with retry information
 */
export interface PublishingResult {
  success: boolean;
  url?: string;
  error?: string;
  retries?: number;
  duration?: number;
}

/**
 * Publish with retry logic
 */
export async function publishWithRetry<T>(
  publishFn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<PublishingResult> {
  const startTime = Date.now();
  let retries = 0;

  try {
    const result = await retryWithBackoff(
      async () => {
        retries++;
        return await publishFn();
      },
      options
    );

    return {
      success: true,
      ...(typeof result === 'object' && result !== null && 'url' in result 
        ? { url: result.url as string } 
        : {}),
      retries: retries - 1, // Subtract 1 because first attempt isn't a retry
      duration: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      retries: retries - 1,
      duration: Date.now() - startTime,
    };
  }
}

