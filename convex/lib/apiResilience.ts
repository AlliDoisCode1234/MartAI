// `convex/lib/apiResilience.ts`
/**
 * Core resilience utilities for external API integrations.
 * Implements exponential backoff with jitter to gracefully handle quota limits (429s)
 * and temporary service unavailability (503s).
 */

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
}

interface BackoffOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  retryableStatuses?: number[];
}

const DEFAULT_BACKOFF_OPTIONS: Required<BackoffOptions> = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
  retryableStatuses: [429, 503, 502, 504],
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Wraps the native `fetch` with exponential backoff and jitter.
 */
export async function fetchWithExponentialBackoff(
  url: string | URL | Request,
  fetchOptions?: FetchOptions,
  backoffOptions?: BackoffOptions
): Promise<Response> {
  const options = { ...DEFAULT_BACKOFF_OPTIONS, ...backoffOptions };
  let attempt = 0;

  while (attempt <= options.maxRetries) {
    try {
      const response = await fetch(url, fetchOptions);

      // If the response is OK, or it's an error we shouldn't retry (like a 400 or 401), return it immediately.
      if (response.ok || !options.retryableStatuses.includes(response.status)) {
        return response;
      }

      // It's a retryable error (e.g., 429 Too Many Requests), but we are out of retries.
      if (attempt === options.maxRetries) {
        console.warn(
          `[API Resilience] Max retries (${options.maxRetries}) reached for ${url}. Returning final response with status ${response.status}.`
        );
        return response;
      }
    } catch (error) {
      // Network errors (e.g., DNS resolution failed, connection reset)
      console.error(`[API Resilience] Network error on attempt ${attempt + 1} for ${url}:`, error);

      if (attempt === options.maxRetries) {
        throw error;
      }
    }

    // Calculate delay: baseDelay * (2 ^ attempt) + random jitter (0% to 30% of calculated delay)
    // The jitter prevents "thundering herd" scenarios.
    const exponentialDelay = options.baseDelayMs * Math.pow(2, attempt);
    const jitter = Math.random() * 0.3 * exponentialDelay; // Up to 30% jitter
    const waitTime = Math.min(exponentialDelay + jitter, options.maxDelayMs);

    console.log(
      `[API Resilience] Attempt ${attempt + 1} failed. Retrying in ${Math.round(waitTime)}ms...`
    );
    await delay(waitTime);

    attempt++;
  }

  throw new Error('Unreachable block reached in fetchWithExponentialBackoff');
}
