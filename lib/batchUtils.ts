/**
 * Batch Processing Utilities
 *
 * Utilities for processing arrays in batches with controlled concurrency.
 * Useful for workflows that need to process multiple items without overwhelming APIs.
 */

/**
 * Process items in batches with controlled concurrency
 *
 * @param items - Array of items to process
 * @param processor - Async function to process each item
 * @param options - Configuration options
 * @returns Array of results
 */
export async function processBatch<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  options: {
    /** Max concurrent operations (default: 3) */
    concurrency?: number;
    /** Delay between starting each operation in ms (default: 100) */
    delayMs?: number;
    /** Continue on error? (default: false) */
    continueOnError?: boolean;
  } = {}
): Promise<{ results: R[]; errors: Array<{ index: number; error: Error }> }> {
  const { concurrency = 3, delayMs = 100, continueOnError = false } = options;

  const results: R[] = [];
  const errors: Array<{ index: number; error: Error }> = [];

  // Process in chunks based on concurrency
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);

    const chunkPromises = chunk.map(async (item, chunkIndex) => {
      const actualIndex = i + chunkIndex;

      // Stagger starts within the chunk
      if (chunkIndex > 0 && delayMs > 0) {
        await delay(delayMs * chunkIndex);
      }

      try {
        return await processor(item, actualIndex);
      } catch (error) {
        if (continueOnError) {
          errors.push({ index: actualIndex, error: error as Error });
          return null;
        }
        throw error;
      }
    });

    const chunkResults = await Promise.all(chunkPromises);
    results.push(...(chunkResults.filter((r) => r !== null) as R[]));

    // Delay between chunks
    if (i + concurrency < items.length && delayMs > 0) {
      await delay(delayMs);
    }
  }

  return { results, errors };
}

/**
 * Process items sequentially with delay between each
 *
 * @param items - Array of items to process
 * @param processor - Async function to process each item
 * @param delayMs - Delay between operations in ms (default: 500)
 * @returns Array of results
 */
export async function processSequential<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  delayMs: number = 500
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i++) {
    const result = await processor(items[i], i);
    results.push(result);

    // Delay between operations (skip after last item)
    if (i < items.length - 1 && delayMs > 0) {
      await delay(delayMs);
    }
  }

  return results;
}

/**
 * Chunk an array into smaller arrays of specified size
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Simple delay utility
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
