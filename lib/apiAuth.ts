import { createHash, randomBytes } from 'crypto';

/**
 * lib/apiAuth.ts
 *
 * Enterprise-grade API authentication and response utilities
 * for the public API (/api/v1/*)
 *
 * @see docs/API_REFERENCE.md
 */

// ============================================
// TYPES
// ============================================

export type ApiPermission = 'read' | 'write' | 'admin';

export type ApiKeyValidation = {
  keyId: string;
  userId: string;
  projectId: string;
  permissions: ApiPermission[];
};

export type ApiErrorCode =
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'rate_limited'
  | 'validation_error'
  | 'internal_error';

// ============================================
// CONSTANTS
// ============================================

const API_KEY_PREFIX = 'mart_';

/**
 * Standard headers included on all API responses
 * Includes CORS, security, and API metadata headers
 */
const BASE_HEADERS = {
  // CORS
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-API-Key, Content-Type, Idempotency-Key',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Access-Control-Expose-Headers':
    'X-Request-ID, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After',

  // Security headers (OWASP recommended)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains', // Force HTTPS for 1 year
  'X-Content-Type-Options': 'nosniff', // Prevent MIME sniffing
  'X-Frame-Options': 'DENY', // Prevent clickjacking
  'X-XSS-Protection': '1; mode=block', // Legacy XSS protection
  'Cache-Control': 'no-store', // Don't cache API responses

  // API metadata
  'X-MartAI-Version': '2024-12-01',
};

// Rate limit defaults for Enterprise tier
const RATE_LIMIT_PER_MINUTE = 100;

// ============================================
// HASHING (SHA-256)
// ============================================

/**
 * Hash an API key for lookup
 * Must match the hash function in convex/apiKeys.ts
 */
export function hashApiKey(key: string): string {
  // Helper: simple 32-bit hash
  const hash32 = (str: string, seed: number): number => {
    let h = seed;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  };

  // Generate 8 hash values for 64 chars total
  const h1 = hash32(key, 5381).toString(16).padStart(8, '0');
  const h2 = hash32(key, 33).toString(16).padStart(8, '0');
  const h3 = hash32(key.split('').reverse().join(''), 5381).toString(16).padStart(8, '0');
  const h4 = hash32(key.split('').reverse().join(''), 33).toString(16).padStart(8, '0');
  const h5 = hash32(key + key, 7919)
    .toString(16)
    .padStart(8, '0');
  const h6 = hash32(key, 65599).toString(16).padStart(8, '0');
  const h7 = hash32(key.slice(0, Math.floor(key.length / 2)), 5381)
    .toString(16)
    .padStart(8, '0');
  const h8 = hash32(key.slice(Math.floor(key.length / 2)), 5381)
    .toString(16)
    .padStart(8, '0');

  return h1 + h2 + h3 + h4 + h5 + h6 + h7 + h8;
}

/**
 * Generate a unique request ID for tracing
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${randomBytes(8).toString('hex')}`;
}

// ============================================
// REQUEST PARSING
// ============================================

/**
 * Extract API key from request headers
 * Supports both Authorization: Bearer and X-API-Key headers
 */
export function extractApiKey(request: Request): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith(`Bearer ${API_KEY_PREFIX}`)) {
    return authHeader.slice(7); // Remove 'Bearer '
  }

  // Fallback to X-API-Key header
  const xApiKey = request.headers.get('X-API-Key');
  if (xApiKey?.startsWith(API_KEY_PREFIX)) {
    return xApiKey;
  }

  return null;
}

// ============================================
// PERMISSION CHECKING
// ============================================

/**
 * Check if validation has the required permission
 * - Admin has all permissions
 * - Write includes read
 */
export function hasPermission(
  validation: ApiKeyValidation | null,
  required: ApiPermission
): boolean {
  if (!validation) return false;

  // Admin has all permissions
  if (validation.permissions.includes('admin')) return true;

  // Write includes read
  if (required === 'read' && validation.permissions.includes('write')) return true;

  return validation.permissions.includes(required);
}

// ============================================
// RESPONSE BUILDERS
// ============================================

/**
 * Build standard headers for all API responses
 */
function buildHeaders(
  requestId: string,
  extra: Record<string, string> = {}
): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-Request-ID': requestId,
    ...BASE_HEADERS,
    ...extra,
  };
}

/**
 * Rate limit info to include in responses
 */
export type RateLimitInfo = {
  limit: number;
  remaining: number;
  resetAt: number; // Unix timestamp
};

/**
 * Create a success response with optional rate limit info
 */
export function apiResponse<T>(
  data: T,
  status = 200,
  requestId?: string,
  rateLimit?: RateLimitInfo
): Response {
  const reqId = requestId || generateRequestId();

  // Build rate limit headers
  const rateLimitHeaders: Record<string, string> = {
    'X-RateLimit-Limit': String(rateLimit?.limit ?? RATE_LIMIT_PER_MINUTE),
  };
  if (rateLimit) {
    rateLimitHeaders['X-RateLimit-Remaining'] = String(rateLimit.remaining);
    rateLimitHeaders['X-RateLimit-Reset'] = String(rateLimit.resetAt);
  }

  return new Response(
    JSON.stringify({
      success: true,
      data,
      meta: {
        requestId: reqId,
        timestamp: new Date().toISOString(),
      },
    }),
    {
      status,
      headers: buildHeaders(reqId, rateLimitHeaders),
    }
  );
}

/**
 * Create an error response with typed error codes
 */
export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
  requestId?: string,
  details?: Record<string, unknown>
): Response {
  const reqId = requestId || generateRequestId();
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
      meta: {
        requestId: reqId,
        timestamp: new Date().toISOString(),
      },
    }),
    {
      status,
      headers: buildHeaders(reqId),
    }
  );
}

// ============================================
// CONVENIENCE ERROR RESPONSES
// ============================================

/**
 * 401 Unauthorized
 */
export function unauthorizedResponse(
  message = 'Invalid or missing API key',
  requestId?: string
): Response {
  const reqId = requestId || generateRequestId();
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        code: 'unauthorized',
        message,
      },
      meta: {
        requestId: reqId,
        timestamp: new Date().toISOString(),
      },
    }),
    {
      status: 401,
      headers: {
        ...buildHeaders(reqId),
        'WWW-Authenticate': 'Bearer realm="MartAI API"',
      },
    }
  );
}

/**
 * 403 Forbidden
 */
export function forbiddenResponse(
  message = 'Insufficient permissions',
  requestId?: string
): Response {
  return apiError('forbidden', message, 403, requestId);
}

/**
 * 404 Not Found
 */
export function notFoundResponse(message = 'Resource not found', requestId?: string): Response {
  return apiError('not_found', message, 404, requestId);
}

/**
 * 429 Rate Limited
 */
export function rateLimitedResponse(retryAfterSeconds: number, requestId?: string): Response {
  const reqId = requestId || generateRequestId();
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        code: 'rate_limited',
        message: 'Rate limit exceeded. Please slow down.',
        retryAfter: retryAfterSeconds,
      },
      meta: {
        requestId: reqId,
        timestamp: new Date().toISOString(),
      },
    }),
    {
      status: 429,
      headers: {
        ...buildHeaders(reqId),
        'Retry-After': String(retryAfterSeconds),
        'X-RateLimit-Remaining': '0',
      },
    }
  );
}

/**
 * 400 Validation Error
 */
export function validationErrorResponse(
  message: string,
  details?: Record<string, unknown>,
  requestId?: string
): Response {
  return apiError('validation_error', message, 400, requestId, details);
}

/**
 * 500 Internal Error (for unexpected errors)
 */
export function internalErrorResponse(
  message = 'An unexpected error occurred',
  requestId?: string
): Response {
  return apiError('internal_error', message, 500, requestId);
}

// ============================================
// CORS PREFLIGHT HANDLER
// ============================================

/**
 * Handle OPTIONS preflight requests for CORS
 */
export function corsPreflightResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: BASE_HEADERS,
  });
}

// ============================================
// LEGACY COMPATIBILITY
// ============================================

/**
 * @deprecated Use apiError instead
 */
export function errorResponse(message: string, status = 400): Response {
  return apiError('validation_error', message, status);
}
