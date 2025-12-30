import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware - Runs on every request
 * Adds security headers to ALL responses (pages and API routes)
 * Handles legacy route redirects
 */
export function middleware(request: NextRequest) {
  // ==========================================================================
  // Legacy Route Redirects (Content Studio Consolidation)
  // ==========================================================================
  const pathname = request.nextUrl.pathname;

  // /calendar → /studio/calendar (301 permanent redirect)
  if (pathname === '/calendar') {
    return NextResponse.redirect(new URL('/studio/calendar', request.url), 301);
  }

  // /content → /studio/library (301 permanent redirect)
  if (pathname === '/content' || pathname.startsWith('/content/')) {
    const newPath = pathname.replace('/content', '/studio/library');
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }

  // ==========================================================================
  // Security Headers
  // ==========================================================================
  const response = NextResponse.next();

  // Security headers for all responses
  const securityHeaders = {
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // Enable XSS protection (legacy but still useful)
    'X-XSS-Protection': '1; mode=block',

    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions Policy (formerly Feature Policy)
    'Permissions-Policy': [
      'geolocation=()',
      'microphone=()',
      'camera=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
    ].join(', '),

    // Content Security Policy
    // Note: CSP can be strict in production, but needs to allow Next.js development features
    // Adjust based on your needs
    ...(process.env.NODE_ENV === 'production' && {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-* needed for Next.js
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://*.convex.cloud https://api.openai.com",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        'upgrade-insecure-requests',
      ].join('; '),
    }),

    // Strict Transport Security (HTTPS only in production)
    ...(process.env.NODE_ENV === 'production' && {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    }),

    // Cross-Origin policies
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  };

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    }
  });

  // API routes already have security via secureResponse(), but we can add extra protection here
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Additional API-specific security
    response.headers.set('X-DNS-Prefetch-Control', 'off');
    response.headers.set('X-Download-Options', 'noopen');
  }

  return response;
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)',
  ],
};
