import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware - Runs on every request
 * - Adds security headers to ALL responses (pages and API routes)
 * - Handles phoo.ai domain routing (landing page)
 */

/**
 * Check if request is from phoo.ai domain
 */
function isPhooAiDomain(request: NextRequest): boolean {
  const host = request.headers.get('host') || '';
  return host.includes('phoo.ai') || host.includes('phoo-ai');
}

/**
 * Check if request is from MarkUp.io proxy
 */
function isMarkUpProxy(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  const isMarkUpHeader = request.headers.get('markup-request') === 'true';
  const isMarkUpAgent = userAgent.includes('Markup/1.0');
  
  // The vendor proxy IP list for MarkUp.io
  const MARKUP_IPS = ['34.229.37.143', '34.229.37.212', '34.229.37.152'];
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '';
  const isMarkUpIp = MARKUP_IPS.includes(ip.trim());

  return (isMarkUpHeader || isMarkUpAgent) && isMarkUpIp;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - always accessible
  const publicRoutes = [
    '/',
    '/join',
    '/auth',
    '/privacy',
    '/terms',
    '/resources',
    '/how-it-works',
    '/pricing',
    '/features',
    '/solutions',
  ];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // API routes - always accessible (needed for app functionality)
  const isApiRoute = pathname.startsWith('/api');

  // ==========================================================================
  // Phoo.ai Domain Routing (Beta Launch - Feb 2026)
  // ==========================================================================
  if (isPhooAiDomain(request)) {
    if (!isPublicRoute && !isApiRoute) {
      // Fall through to security headers
      // Layout component will check auth and redirect to / if needed
    }
  }

  // ==========================================================================
  // Security Headers
  // ==========================================================================
  const response = NextResponse.next();

  // Validate MarkUp Cloud Proxy execution on Public Routes (Debugging Workflow: Option A implementation)
  const isMarkUpVerified = isPublicRoute && isMarkUpProxy(request);

  // Dynamic Clickjacking Protection
  // - Public routes: Allow markup.io framing via CSP
  // - Private routes: Strict CSP + fallback X-Frame-Options
  const frameAncestors = isPublicRoute
    ? "frame-ancestors 'self' https://app.markup.io https://*.markup.io"
    : "frame-ancestors 'self'";

  const securityHeaders: Record<string, string> = {
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

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

    // Cross-Origin Resource Policy
    'Cross-Origin-Resource-Policy': 'cross-origin',
  };

  // Legacy fallback for browsers that don't support CSP frame-ancestors
  if (!isPublicRoute) {
    securityHeaders['X-Frame-Options'] = 'DENY';
  }

  // Cross-Origin policies (skip for auth routes to allow OAuth popups/redirects)
  // Skip COEP for verified MarkUp proxies to allow their visual overlay scripts
  if (!pathname.startsWith('/auth') && !isMarkUpVerified) {
    securityHeaders['Cross-Origin-Embedder-Policy'] = 'require-corp';
    securityHeaders['Cross-Origin-Opener-Policy'] = 'same-origin';
  }

    // Content Security Policy
  if (process.env.NODE_ENV === 'production') {
    const mk = isMarkUpVerified ? " https://*.markup.io" : "";
    const mkData = isMarkUpVerified ? " https://*.markup.io" : "";

    securityHeaders['Content-Security-Policy'] = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://www.googletagmanager.com${mk}`, // Google OAuth + GA4 + MarkUp
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com${mk}`,
      `font-src 'self' https://fonts.gstatic.com data:${mkData}`,
      `img-src 'self' data: https: blob:${mkData}`,
      `connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://*.convex.site https://api.openai.com https://accounts.google.com https://www.googletagmanager.com https://www.google-analytics.com${mk}`,
      "frame-src https://accounts.google.com", // Google OAuth popup
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://accounts.google.com",
      frameAncestors,
      "upgrade-insecure-requests",
    ].join('; ');

    // Strict Transport Security (HTTPS only in production)
    securityHeaders['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  } else {
    // In non-production, always enforce at least frame-ancestors to prevent clickjacking regressions
    securityHeaders['Content-Security-Policy'] = frameAncestors;
  }

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
