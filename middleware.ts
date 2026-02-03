import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware - Runs on every request
 * - Adds security headers to ALL responses (pages and API routes)
 * - Handles phoo.ai domain routing (landing page + password protection)
 * - Handles legacy route redirects
 */

// Password protection credentials (set in Vercel environment variables)
const PHOO_PASSWORD = process.env.PHOO_BETA_PASSWORD;

if (!PHOO_PASSWORD && process.env.NODE_ENV === 'production') {
  console.error('PHOO_BETA_PASSWORD not set in production');
}

/**
 * Check if request is from phoo.ai domain
 */
function isPhooAiDomain(request: NextRequest): boolean {
  const host = request.headers.get('host') || '';
  return host.includes('phoo.ai') || host.includes('phoo-ai');
}

/**
 * Basic auth check for password-protected routes
 * Returns true if authenticated, false otherwise
 */
function checkBasicAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const base64Credentials = authHeader.substring(6);
  try {
    const credentials = atob(base64Credentials);
    // Format: "username:password" - we only check password
    const [, password] = credentials.split(':');
    return password === PHOO_PASSWORD;
  } catch {
    return false;
  }
}

/**
 * Return 401 Unauthorized response with Basic Auth challenge
 */
function unauthorizedResponse(): NextResponse {
  return new NextResponse('Unauthorized - Please enter password', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Phoo Beta Access"',
      'Content-Type': 'text/plain',
    },
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ==========================================================================
  // Phoo.ai Domain Routing
  //
  // Architecture (Beta Launch - Feb 2026):
  // - / → Public landing page (no redirect, renders directly)
  // - /join → Public waitlist page (for marketing)
  // - /auth/* → Public auth routes (login, callback)
  // - /api/* → API routes (needed for app to function)
  // - Everything else → Let Layout handle auth gating
  //   (Layout redirects unauthenticated users to /)
  // ==========================================================================
  if (isPhooAiDomain(request)) {
    // BETA LAUNCH: Root path renders directly - no redirect to /join
    // Users see landing page at phoo.ai/ for Google OAuth compliance

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
    ];
    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
    );

    // API routes - always accessible (needed for app functionality)
    const isApiRoute = pathname.startsWith('/api');

    // All other routes pass through - Layout handles auth gating
    // If user is authenticated (via OAuth), they can access the product
    // If not authenticated, Layout redirects them to /
    if (!isPublicRoute && !isApiRoute) {
      // Fall through to security headers
      // Layout component will check auth and redirect to / if needed
    }
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
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://www.googletagmanager.com", // Google OAuth + GA4
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://*.convex.site https://api.openai.com https://accounts.google.com https://www.googletagmanager.com https://www.google-analytics.com",
        'frame-src https://accounts.google.com', // Google OAuth popup
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self' https://accounts.google.com",
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
    'Cross-Origin-Resource-Policy': 'cross-origin',
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
