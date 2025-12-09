import { createHash } from 'crypto';

/**
 * lib/apiAuth.ts
 *
 * Middleware for validating public API requests with API keys
 */

type ApiKeyValidation = {
  keyId: string;
  userId: string;
  projectId: string;
  permissions: ('read' | 'write' | 'admin')[];
};

/**
 * Hash an API key for lookup
 */
export function hashApiKey(key: string): string {
  // Simple hash for matching the Convex storage format
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return 'hash_' + Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Extract API key from request headers
 */
export function extractApiKey(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');

  if (authHeader?.startsWith('Bearer mart_')) {
    return authHeader.slice(7); // Remove 'Bearer '
  }

  // Also check X-API-Key header
  const xApiKey = request.headers.get('X-API-Key');
  if (xApiKey?.startsWith('mart_')) {
    return xApiKey;
  }

  return null;
}

/**
 * Create an unauthorized response
 */
export function unauthorizedResponse(message = 'Unauthorized'): Response {
  return new Response(
    JSON.stringify({
      error: 'unauthorized',
      message,
    }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'WWW-Authenticate': 'Bearer realm="MartAI API"',
      },
    }
  );
}

/**
 * Create a forbidden response
 */
export function forbiddenResponse(message = 'Insufficient permissions'): Response {
  return new Response(
    JSON.stringify({
      error: 'forbidden',
      message,
    }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Create a success response
 */
export function apiResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify({ data }), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create an error response
 */
export function errorResponse(message: string, status = 400): Response {
  return new Response(
    JSON.stringify({
      error: 'error',
      message,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Check if validation has required permission
 */
export function hasPermission(
  validation: ApiKeyValidation | null,
  required: 'read' | 'write' | 'admin'
): boolean {
  if (!validation) return false;

  // Admin has all permissions
  if (validation.permissions.includes('admin')) return true;

  // Write includes read
  if (required === 'read' && validation.permissions.includes('write')) return true;

  return validation.permissions.includes(required);
}
