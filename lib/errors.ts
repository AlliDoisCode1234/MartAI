/**
 * MartAI Error Types
 *
 * Structured error types for better error handling, propagation, and user feedback.
 */

/**
 * Base error class for all MartAI errors
 */
export class MartAIError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'MartAIError';
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

/**
 * Quota/limit exceeded errors
 */
export class QuotaExceededError extends MartAIError {
  constructor(resource: string, limit: number, current: number) {
    super('QUOTA_EXCEEDED', `${resource} limit exceeded. Limit: ${limit}, Current: ${current}`, {
      resource,
      limit,
      current,
    });
    this.name = 'QuotaExceededError';
  }
}

/**
 * Integration connection errors
 */
export class IntegrationError extends MartAIError {
  constructor(
    integration: 'ga4' | 'gsc' | 'wordpress' | 'shopify' | 'webflow',
    operation: string,
    originalError?: Error
  ) {
    super(
      'INTEGRATION_ERROR',
      `${integration.toUpperCase()} ${operation} failed: ${originalError?.message || 'Unknown error'}`,
      { integration, operation, originalMessage: originalError?.message }
    );
    this.name = 'IntegrationError';
  }
}

/**
 * AI generation errors
 */
export class AIGenerationError extends MartAIError {
  constructor(operation: string, traceId?: string, originalError?: Error) {
    super(
      'AI_GENERATION_ERROR',
      `AI generation failed during ${operation}: ${originalError?.message || 'Unknown error'}`,
      { operation, traceId, originalMessage: originalError?.message }
    );
    this.name = 'AIGenerationError';
  }
}

/**
 * Authentication/authorization errors
 */
export class AuthError extends MartAIError {
  constructor(reason: 'unauthenticated' | 'unauthorized' | 'token_expired') {
    const messages = {
      unauthenticated: 'User is not logged in',
      unauthorized: 'User does not have permission for this action',
      token_expired: 'Session has expired, please log in again',
    };
    super('AUTH_ERROR', messages[reason], { reason });
    this.name = 'AuthError';
  }
}

/**
 * Validation errors
 */
export class ValidationError extends MartAIError {
  constructor(field: string, message: string) {
    super('VALIDATION_ERROR', `${field}: ${message}`, { field });
    this.name = 'ValidationError';
  }
}

/**
 * Resource not found errors
 */
export class NotFoundError extends MartAIError {
  constructor(resource: string, id: string) {
    super('NOT_FOUND', `${resource} not found: ${id}`, { resource, id });
    this.name = 'NotFoundError';
  }
}

/**
 * Rate limit errors
 */
export class RateLimitError extends MartAIError {
  constructor(operation: string, retryAfter?: number) {
    super(
      'RATE_LIMIT',
      `Too many requests for ${operation}. ${retryAfter ? `Retry after ${retryAfter}s` : 'Please try again later.'}`,
      { operation, retryAfter }
    );
    this.name = 'RateLimitError';
  }
}

/**
 * Helper to safely wrap async operations with structured error handling
 */
export async function withErrorHandling<T>(
  operation: string,
  fn: () => Promise<T>,
  defaultValue?: T
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof MartAIError) {
      throw error;
    }
    console.error(`[${operation}] Error:`, error);
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new MartAIError(
      'UNKNOWN_ERROR',
      `${operation} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
}
