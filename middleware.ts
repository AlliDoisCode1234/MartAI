import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware - Runs on every request
 * - Adds security headers to ALL responses (pages and API routes)
 * - Handles phoo.ai domain routing (landing page + password protection)
 * - Handles legacy route redirects
 */

// Password protection credentials (set in Vercel environment variables)
const PHOO_PASSWORD = process.env.PHOO_BETA_PASSWORD || 'phoo2026';

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
  // Phoo.ai Domain Routing (STRICT JOIN-FIRST)
  //
  // Architecture:
  // - /join → Only public route (waitlist signup)
  // - /v1/* → Password-protected entry for testers (Basic Auth required)
  // - Everything else → Redirects to /join (protected, need to auth via /v1/*)
  // ==========================================================================
  if (isPhooAiDomain(request)) {
    // Root path on phoo.ai → /join (waitlist)
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone();
      url.pathname = '/join';
      return NextResponse.redirect(url);
    }

    // /join route → Rewrite to /landing (our waitlist page)
    if (pathname === '/join') {
      const url = request.nextUrl.clone();
      url.pathname = '/landing';
      return NextResponse.rewrite(url);
    }

    // /v1/* routes → Password-protected entry point for testers
    // EXCEPT /v1/auth/* routes which must be public for login flow
    if (pathname.startsWith('/v1')) {
      // Auth routes are exempt from Basic Auth - users need to access login page first
      const isAuthRoute = pathname.startsWith('/v1/auth');

      if (!isAuthRoute && !checkBasicAuth(request)) {
        return unauthorizedResponse();
      }
      // Rewrite /v1/path to /path for the actual app
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(/^\/v1/, '') || '/dashboard';
      return NextResponse.rewrite(url);
    }

    // API routes must be allowed for the app to function
    if (pathname.startsWith('/api')) {
      // Continue to security headers
    } else {
      // All other routes on phoo.ai → Redirect to /join
      // Users must enter via /v1/auth/login to access the product
      const url = request.nextUrl.clone();
      url.pathname = '/join';
      return NextResponse.redirect(url);
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
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com", // Google OAuth
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://*.convex.site https://api.openai.com https://accounts.google.com",
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
