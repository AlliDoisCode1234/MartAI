import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Security configuration
const API_KEY_HEADER = 'X-API-Key';
const CSRF_TOKEN_HEADER = 'X-CSRF-Token';
const REQUEST_ID_HEADER = 'X-Request-ID';
const SIGNATURE_HEADER = 'X-Request-Signature';
const TIMESTAMP_HEADER = 'X-Request-Timestamp';

// Environment variables for security secrets
const API_SECRET_KEY = process.env.API_SECRET_KEY || (process.env.NODE_ENV === 'production' ? null : 'dev-api-secret-key-change-in-production');
const CSRF_SECRET = process.env.CSRF_SECRET || (process.env.NODE_ENV === 'production' ? null : 'dev-csrf-secret-change-in-production');
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'];

// Request timestamp tolerance (5 minutes)
const TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000;

// In-memory CSRF token store (use Redis in production)
const csrfTokens = new Map<string, { token: string; expiresAt: number }>();

export interface SecurityHeaders {
  'X-API-Key'?: string;
  'X-CSRF-Token'?: string;
  'X-Request-ID'?: string;
  'X-Request-Signature'?: string;
  'X-Request-Timestamp'?: string;
  'Origin'?: string;
  'Referer'?: string;
}

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
  csrfTokens.set(token, { token, expiresAt });
  return token;
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(token: string | null): boolean {
  if (!token) return false;
  
  const stored = csrfTokens.get(token);
  if (!stored) return false;
  
  // Check expiration
  if (Date.now() > stored.expiresAt) {
    csrfTokens.delete(token);
    return false;
  }
  
  return true;
}

/**
 * Clean expired CSRF tokens (run periodically)
 */
export function cleanExpiredCsrfTokens() {
  const now = Date.now();
  for (const [token, data] of csrfTokens.entries()) {
    if (now > data.expiresAt) {
      csrfTokens.delete(token);
    }
  }
}

/**
 * Generate API key hash for validation
 */
export function generateApiKeyHash(apiKey: string): string {
  if (!API_SECRET_KEY) {
    throw new Error('API_SECRET_KEY not configured');
  }
  return crypto.createHmac('sha256', API_SECRET_KEY).update(apiKey).digest('hex');
}

/**
 * Validate API key header
 */
export function validateApiKey(request: NextRequest): boolean {
  if (!API_SECRET_KEY) {
    // In development without API_SECRET_KEY, allow requests
    return process.env.NODE_ENV !== 'production';
  }

  const apiKey = request.headers.get(API_KEY_HEADER);
  if (!apiKey) return false;

  // In production, you'd validate against a database or environment variable
  // For now, we'll check against expected hash
  const expectedHash = process.env.API_KEY_HASH;
  if (expectedHash) {
    const providedHash = generateApiKeyHash(apiKey);
    return crypto.timingSafeEqual(
      Buffer.from(providedHash),
      Buffer.from(expectedHash)
    );
  }

  // Fallback: check if API key matches configured key
  return apiKey === API_SECRET_KEY;
}

/**
 * Validate Origin/Referer headers
 */
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Allow same-origin requests
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Check origin
  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.hostname === hostname || ALLOWED_ORIGINS.includes(origin)) {
        return true;
      }
    } catch {
      // Invalid origin URL
    }
  }

  // Check referer
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.hostname === hostname || ALLOWED_ORIGINS.some(allowed => referer.includes(allowed))) {
        return true;
      }
    } catch {
      // Invalid referer URL
    }
  }

  // For same-origin requests without origin/referer (like from server-side)
  return !origin && !referer;
}

/**
 * Generate request signature for sensitive operations
 */
export function generateRequestSignature(
  method: string,
  path: string,
  body: string,
  timestamp: number
): string {
  if (!API_SECRET_KEY) {
    throw new Error('API_SECRET_KEY not configured');
  }

  const payload = `${method}:${path}:${body}:${timestamp}`;
  return crypto
    .createHmac('sha256', API_SECRET_KEY)
    .update(payload)
    .digest('hex');
}

/**
 * Validate request signature
 */
export function validateRequestSignature(request: NextRequest, body: string): boolean {
  const signature = request.headers.get(SIGNATURE_HEADER);
  const timestampHeader = request.headers.get(TIMESTAMP_HEADER);

  if (!signature || !timestampHeader) return false;

  const timestamp = parseInt(timestampHeader, 10);
  if (isNaN(timestamp)) return false;

  // Check timestamp is within tolerance (prevent replay attacks)
  const now = Date.now();
  if (Math.abs(now - timestamp) > TIMESTAMP_TOLERANCE_MS) {
    return false;
  }

  const url = new URL(request.url);
  const expectedSignature = generateRequestSignature(
    request.method,
    url.pathname + url.search,
    body,
    timestamp
  );

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Validate Content-Type header
 */
export function validateContentType(request: NextRequest, allowedTypes: string[] = ['application/json']): boolean {
  const contentType = request.headers.get('content-type');
  if (!contentType) return false;
  
  return allowedTypes.some(type => contentType.includes(type));
}

/**
 * Add security headers to response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // CORS headers (configure as needed)
  response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0] || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, X-CSRF-Token, X-Request-ID');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}

/**
 * Extract client IP address
 */
export function extractClientIp(request: NextRequest): string {
  // Check various headers for real client IP (behind proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  const reqWithIp = request as NextRequest & { ip?: string | null };
  return reqWithIp.ip ?? 'unknown';
}

/**
 * Comprehensive API security validation
 */
export interface SecurityValidationOptions {
  requireAuth?: boolean;
  requireCsrf?: boolean;
  requireApiKey?: boolean;
  requireSignature?: boolean;
  requireOrigin?: boolean;
  allowedMethods?: string[];
  allowedContentTypes?: string[];
}

export interface SecurityValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
  requestId?: string;
}

/**
 * Validate API request security
 */
export async function validateApiSecurity(
  request: NextRequest,
  options: SecurityValidationOptions = {}
): Promise<SecurityValidationResult> {
  const requestId = generateRequestId();
  
  // Check HTTP method
  if (options.allowedMethods && !options.allowedMethods.includes(request.method)) {
    return {
      valid: false,
      error: `Method ${request.method} not allowed`,
      code: 'METHOD_NOT_ALLOWED',
      requestId,
    };
  }

  // Check Content-Type for POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    if (options.allowedContentTypes) {
      if (!validateContentType(request, options.allowedContentTypes)) {
        return {
          valid: false,
          error: 'Invalid Content-Type',
          code: 'INVALID_CONTENT_TYPE',
          requestId,
        };
      }
    }
  }

  // Validate Origin/Referer
  if (options.requireOrigin && !validateOrigin(request)) {
    return {
      valid: false,
      error: 'Invalid origin',
      code: 'INVALID_ORIGIN',
      requestId,
    };
  }

  // Validate API Key
  if (options.requireApiKey && !validateApiKey(request)) {
    return {
      valid: false,
      error: 'Invalid or missing API key',
      code: 'INVALID_API_KEY',
      requestId,
    };
  }

  // Validate CSRF token (for state-changing operations)
  if (options.requireCsrf) {
    const csrfToken = request.headers.get(CSRF_TOKEN_HEADER);
    if (!validateCsrfToken(csrfToken)) {
      return {
        valid: false,
        error: 'Invalid or missing CSRF token',
        code: 'INVALID_CSRF_TOKEN',
        requestId,
      };
    }
  }

  // Validate request signature (for sensitive operations)
  if (options.requireSignature) {
    const body = await request.text();
    if (!validateRequestSignature(request, body)) {
      return {
        valid: false,
        error: 'Invalid request signature',
        code: 'INVALID_SIGNATURE',
        requestId,
      };
    }
    // Re-create request with body for further processing
    (request as any).bodyUsed = false;
  }

  return {
    valid: true,
    requestId,
  };
}

/**
 * Create unauthorized response with security headers
 */
export function unauthorizedResponse(error: string = 'Unauthorized', code?: string): NextResponse {
  const response = NextResponse.json(
    { error, code },
    { status: 401 }
  );
  return addSecurityHeaders(response);
}

/**
 * Create forbidden response with security headers
 */
export function forbiddenResponse(error: string = 'Forbidden', code?: string): NextResponse {
  const response = NextResponse.json(
    { error, code },
    { status: 403 }
  );
  return addSecurityHeaders(response);
}

// Clean expired tokens every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanExpiredCsrfTokens, 60 * 60 * 1000);
}

