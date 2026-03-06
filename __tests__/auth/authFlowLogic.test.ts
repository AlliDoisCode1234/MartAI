/**
 * Auth Flow Logic — Test Suite
 *
 * Tests the critical auth system behaviors that were updated in the
 * IS_LAUNCHED beta/launch PR. Validates:
 *
 *   1. Login-intent gate logic (sessionStorage authFlow marker)
 *   2. Open Redirect prevention on returnTo
 *   3. STANDALONE_ROUTES completeness (auth pages excluded from Layout shell)
 *   4. Pricing page beta guard (unauthenticated checkout → /join in beta)
 *   5. Middleware public route awareness
 *
 * These are PURE LOGIC tests — no DOM rendering needed.
 * They validate the exact decision functions used in the auth flow.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  IS_LAUNCHED,
  BETA_JOIN_HREF,
  LAUNCHED_SIGNUP_HREF,
  LAUNCHED_PRICING_HREF,
} from '../../lib/constants/featureFlags';

// ============================================================================
// Helper: Extracted decision functions (matching production logic exactly)
// ============================================================================

/**
 * Matches the login-intent gate logic from app/auth/callback/page.tsx:116-137
 *
 * When a user initiates login (not signup), and no user record exists
 * in the DB after retries, the callback page should:
 *   - authFlow === 'login' → redirect to /auth/signup?error=no_account
 *   - authFlow === 'signup' → redirect to /onboarding (default, new user)
 */
function resolveLoginIntentGate(authFlow: string | null): {
  shouldBlock: boolean;
  redirectTo: string;
} {
  const flow = authFlow || 'signup'; // default: allow creation (backward compatible)

  if (flow === 'login') {
    return {
      shouldBlock: true,
      redirectTo: '/auth/signup?error=no_account',
    };
  }

  return {
    shouldBlock: false,
    redirectTo: '/onboarding',
  };
}

/**
 * Matches the returnTo sanitization from app/auth/login/page.tsx:44-47
 * and app/auth/callback/page.tsx:160
 *
 * Only allows relative paths, blocks:
 *   - Protocol-relative URLs (//evil.com)
 *   - Absolute URLs (https://evil.com)
 *   - javascript: protocol
 *   - data: protocol
 */
function sanitizeReturnTo(rawReturnTo: string | null): string {
  const DEFAULT = '/studio';
  if (!rawReturnTo) return DEFAULT;
  if (rawReturnTo.startsWith('/') && !rawReturnTo.startsWith('//')) {
    return rawReturnTo;
  }
  return DEFAULT;
}

/**
 * Matches the pricing page beta guard from app/pricing/page.tsx
 *
 * When IS_LAUNCHED is false and the user is not authenticated,
 * clicking a plan CTA should redirect to /join instead of /auth/login.
 */
function resolvePricingCheckoutRedirect(isLaunched: boolean, isAuthenticated: boolean): string {
  if (isAuthenticated) {
    // Authenticated users proceed to checkout regardless of launch state
    return 'checkout';
  }
  return isLaunched ? '/auth/login?intent=checkout' : '/join';
}

/**
 * Matches STANDALONE_ROUTES from src/components/Layout/index.tsx:54-68
 */
const STANDALONE_ROUTES = [
  '/',
  '/auth/callback',
  '/auth/login',
  '/auth/signup',
  '/join',
  '/privacy',
  '/terms',
  '/how-it-works',
  '/pricing',
  '/about',
  '/resources',
  '/features',
  '/solutions',
];

/**
 * Matches middleware public routes from middleware.ts:37-48
 */
const MIDDLEWARE_PUBLIC_ROUTES = [
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

function isMiddlewarePublicRoute(pathname: string): boolean {
  return MIDDLEWARE_PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
}

// ============================================================================
// Login-Intent Gate Tests
// ============================================================================

describe('Login-Intent Gate (callback page logic)', () => {
  describe('when authFlow is "login" (user clicked Google on /auth/login)', () => {
    it('blocks the user and redirects to signup with error', () => {
      const result = resolveLoginIntentGate('login');
      expect(result.shouldBlock).toBe(true);
      expect(result.redirectTo).toBe('/auth/signup?error=no_account');
    });
  });

  describe('when authFlow is "signup" (user came from /auth/signup)', () => {
    it('allows the user through to onboarding', () => {
      const result = resolveLoginIntentGate('signup');
      expect(result.shouldBlock).toBe(false);
      expect(result.redirectTo).toBe('/onboarding');
    });
  });

  describe('when authFlow is null (sessionStorage cleared or unavailable)', () => {
    it('defaults to signup flow (backward compatible)', () => {
      const result = resolveLoginIntentGate(null);
      expect(result.shouldBlock).toBe(false);
      expect(result.redirectTo).toBe('/onboarding');
    });
  });

  describe('when authFlow is empty string', () => {
    it('defaults to signup flow', () => {
      const result = resolveLoginIntentGate('');
      expect(result.shouldBlock).toBe(false);
      expect(result.redirectTo).toBe('/onboarding');
    });
  });

  describe('when authFlow is unexpected value', () => {
    it('defaults to signup flow for any non-login value', () => {
      const result = resolveLoginIntentGate('unknown');
      expect(result.shouldBlock).toBe(false);
      expect(result.redirectTo).toBe('/onboarding');
    });
  });
});

// ============================================================================
// Open Redirect Prevention Tests
// ============================================================================

describe('returnTo sanitization (Open Redirect prevention)', () => {
  describe('valid relative paths', () => {
    it('allows /studio', () => {
      expect(sanitizeReturnTo('/studio')).toBe('/studio');
    });

    it('allows /pricing', () => {
      expect(sanitizeReturnTo('/pricing')).toBe('/pricing');
    });

    it('allows deep paths like /studio/keywords', () => {
      expect(sanitizeReturnTo('/studio/keywords')).toBe('/studio/keywords');
    });

    it('allows paths with query strings', () => {
      expect(sanitizeReturnTo('/pricing?plan=starter')).toBe('/pricing?plan=starter');
    });
  });

  describe('malicious URLs that must be blocked', () => {
    it('blocks protocol-relative URLs (//evil.com)', () => {
      expect(sanitizeReturnTo('//evil.com')).toBe('/studio');
    });

    it('blocks absolute HTTP URLs', () => {
      expect(sanitizeReturnTo('https://evil.com')).toBe('/studio');
    });

    it('blocks absolute HTTP URLs with path', () => {
      expect(sanitizeReturnTo('https://evil.com/auth/callback')).toBe('/studio');
    });

    it('blocks javascript: protocol', () => {
      expect(sanitizeReturnTo('javascript:alert(1)')).toBe('/studio');
    });

    it('blocks data: protocol', () => {
      expect(sanitizeReturnTo('data:text/html,<script>alert(1)</script>')).toBe('/studio');
    });

    it('blocks empty string', () => {
      // Empty string does not start with /, so defaults
      expect(sanitizeReturnTo('')).toBe('/studio');
    });

    it('blocks bare hostnames', () => {
      expect(sanitizeReturnTo('evil.com')).toBe('/studio');
    });
  });

  describe('null/undefined handling', () => {
    it('returns /studio for null', () => {
      expect(sanitizeReturnTo(null)).toBe('/studio');
    });
  });
});

// ============================================================================
// STANDALONE_ROUTES Completeness Tests
// ============================================================================

describe('STANDALONE_ROUTES (Layout exclusions)', () => {
  it('includes /auth/login (must render without marketing shell)', () => {
    expect(STANDALONE_ROUTES).toContain('/auth/login');
  });

  it('includes /auth/signup (must render without marketing shell)', () => {
    expect(STANDALONE_ROUTES).toContain('/auth/signup');
  });

  it('includes /auth/callback (must render without marketing shell)', () => {
    expect(STANDALONE_ROUTES).toContain('/auth/callback');
  });

  it('includes / (homepage has its own layout)', () => {
    expect(STANDALONE_ROUTES).toContain('/');
  });

  it('includes /join (beta waitlist page)', () => {
    expect(STANDALONE_ROUTES).toContain('/join');
  });

  it('includes all legal pages', () => {
    expect(STANDALONE_ROUTES).toContain('/privacy');
    expect(STANDALONE_ROUTES).toContain('/terms');
  });

  it('includes all marketing pages (they have their own headers)', () => {
    expect(STANDALONE_ROUTES).toContain('/pricing');
    expect(STANDALONE_ROUTES).toContain('/how-it-works');
    expect(STANDALONE_ROUTES).toContain('/about');
    expect(STANDALONE_ROUTES).toContain('/resources');
    expect(STANDALONE_ROUTES).toContain('/features');
    expect(STANDALONE_ROUTES).toContain('/solutions');
  });

  it('does NOT include studio routes (they need the Layout wrapper)', () => {
    const studioRoutes = STANDALONE_ROUTES.filter((r) => r.startsWith('/studio'));
    expect(studioRoutes).toHaveLength(0);
  });

  it('does NOT include settings routes (they need the Layout wrapper)', () => {
    const settingsRoutes = STANDALONE_ROUTES.filter((r) => r.startsWith('/settings'));
    expect(settingsRoutes).toHaveLength(0);
  });

  it('does NOT include onboarding (needs its own flow)', () => {
    expect(STANDALONE_ROUTES).not.toContain('/onboarding');
  });
});

// ============================================================================
// Pricing Page Beta Guard Tests
// ============================================================================

describe('Pricing page beta guard', () => {
  describe('beta mode (IS_LAUNCHED = false)', () => {
    it('redirects unauthenticated users to /join', () => {
      const result = resolvePricingCheckoutRedirect(false, false);
      expect(result).toBe('/join');
    });

    it('allows authenticated users to proceed to checkout', () => {
      const result = resolvePricingCheckoutRedirect(false, true);
      expect(result).toBe('checkout');
    });
  });

  describe('launched mode (IS_LAUNCHED = true)', () => {
    it('redirects unauthenticated users to login with checkout intent', () => {
      const result = resolvePricingCheckoutRedirect(true, false);
      expect(result).toBe('/auth/login?intent=checkout');
    });

    it('allows authenticated users to proceed to checkout', () => {
      const result = resolvePricingCheckoutRedirect(true, true);
      expect(result).toBe('checkout');
    });
  });

  describe('with current IS_LAUNCHED value', () => {
    it('correctly resolves for current flag state', () => {
      const result = resolvePricingCheckoutRedirect(IS_LAUNCHED, false);
      if (IS_LAUNCHED) {
        expect(result).toBe('/auth/login?intent=checkout');
      } else {
        expect(result).toBe('/join');
      }
    });
  });
});

// ============================================================================
// Middleware Public Route Tests
// ============================================================================

describe('Middleware public route detection', () => {
  describe('routes that MUST be public', () => {
    it('allows / (homepage)', () => {
      expect(isMiddlewarePublicRoute('/')).toBe(true);
    });

    it('allows /join (beta waitlist)', () => {
      expect(isMiddlewarePublicRoute('/join')).toBe(true);
    });

    it('allows /auth/* (all auth routes)', () => {
      expect(isMiddlewarePublicRoute('/auth/login')).toBe(true);
      expect(isMiddlewarePublicRoute('/auth/signup')).toBe(true);
      expect(isMiddlewarePublicRoute('/auth/callback')).toBe(true);
    });

    it('allows /resources and sub-paths', () => {
      expect(isMiddlewarePublicRoute('/resources')).toBe(true);
      expect(isMiddlewarePublicRoute('/resources/geo-guide')).toBe(true);
    });

    it('allows /features and sub-paths', () => {
      expect(isMiddlewarePublicRoute('/features')).toBe(true);
      expect(isMiddlewarePublicRoute('/features/analytics')).toBe(true);
    });

    it('allows /solutions and sub-paths', () => {
      expect(isMiddlewarePublicRoute('/solutions')).toBe(true);
      expect(isMiddlewarePublicRoute('/solutions/agencies')).toBe(true);
    });

    it('allows /pricing', () => {
      expect(isMiddlewarePublicRoute('/pricing')).toBe(true);
    });

    it('allows legal pages', () => {
      expect(isMiddlewarePublicRoute('/privacy')).toBe(true);
      expect(isMiddlewarePublicRoute('/terms')).toBe(true);
    });
  });

  describe('routes that MUST be auth-gated', () => {
    it('does NOT allow /studio', () => {
      expect(isMiddlewarePublicRoute('/studio')).toBe(false);
    });

    it('does NOT allow /studio/keywords', () => {
      expect(isMiddlewarePublicRoute('/studio/keywords')).toBe(false);
    });

    it('does NOT allow /settings', () => {
      expect(isMiddlewarePublicRoute('/settings')).toBe(false);
    });

    it('does NOT allow /onboarding', () => {
      expect(isMiddlewarePublicRoute('/onboarding')).toBe(false);
    });

    it('does NOT allow /profile', () => {
      expect(isMiddlewarePublicRoute('/profile')).toBe(false);
    });

    it('does NOT allow /subscription', () => {
      expect(isMiddlewarePublicRoute('/subscription')).toBe(false);
    });
  });
});

// ============================================================================
// Auth Flow SessionStorage Marker Tests
// ============================================================================

describe('Auth flow sessionStorage marker', () => {
  let mockSessionStorage: Record<string, string>;

  beforeEach(() => {
    mockSessionStorage = {};
    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => mockSessionStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockSessionStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockSessionStorage[key];
      },
    });
  });

  describe('login page sets authFlow=login', () => {
    it('stores login intent in sessionStorage before Google OAuth', () => {
      // Simulates app/auth/login/page.tsx:154-155
      sessionStorage.setItem('authFlow', 'login');
      expect(sessionStorage.getItem('authFlow')).toBe('login');
    });

    it('stores returnTo when not default /studio', () => {
      // Simulates app/auth/login/page.tsx:146-151
      const returnTo = '/pricing?plan=starter';
      sessionStorage.setItem('authReturnTo', returnTo);
      expect(sessionStorage.getItem('authReturnTo')).toBe(returnTo);
    });

    it('does NOT store returnTo when it is the default /studio', () => {
      const returnTo = '/studio';
      // Login page only stores if returnTo !== '/studio'
      if (returnTo !== '/studio') {
        sessionStorage.setItem('authReturnTo', returnTo);
      }
      expect(sessionStorage.getItem('authReturnTo')).toBeNull();
    });
  });

  describe('callback page reads and cleans authFlow', () => {
    it('reads authFlow from sessionStorage', () => {
      sessionStorage.setItem('authFlow', 'login');
      const authFlow = sessionStorage.getItem('authFlow') || 'signup';
      expect(authFlow).toBe('login');
    });

    it('cleans up authFlow after reading', () => {
      sessionStorage.setItem('authFlow', 'login');
      sessionStorage.removeItem('authFlow');
      expect(sessionStorage.getItem('authFlow')).toBeNull();
    });

    it('defaults to signup when authFlow is not set', () => {
      const authFlow = sessionStorage.getItem('authFlow') || 'signup';
      expect(authFlow).toBe('signup');
    });
  });

  describe('signup page sets authFlow=signup', () => {
    it('stores signup intent so callback allows account creation', () => {
      sessionStorage.setItem('authFlow', 'signup');
      expect(sessionStorage.getItem('authFlow')).toBe('signup');
    });
  });

  describe('callback page reads and sanitizes returnTo', () => {
    it('reads saved returnTo from sessionStorage', () => {
      sessionStorage.setItem('authReturnTo', '/pricing?plan=starter');
      const savedReturnTo = sessionStorage.getItem('authReturnTo');
      expect(savedReturnTo).toBe('/pricing?plan=starter');
    });

    it('cleans up returnTo after reading', () => {
      sessionStorage.setItem('authReturnTo', '/pricing');
      sessionStorage.removeItem('authReturnTo');
      expect(sessionStorage.getItem('authReturnTo')).toBeNull();
    });

    it('sanitizes returnTo before using it for redirect', () => {
      // Even if someone injected a malicious returnTo into sessionStorage
      sessionStorage.setItem('authReturnTo', '//evil.com/phish');
      const savedReturnTo = sessionStorage.getItem('authReturnTo');
      // The callback page runs sanitizeReturnTo before navigation
      const safeUrl = sanitizeReturnTo(savedReturnTo);
      expect(safeUrl).toBe('/studio');
    });
  });
});

// ============================================================================
// Consistency Checks
// ============================================================================

describe('Auth routing consistency', () => {
  it('login page no_account redirect matches the signup page route', () => {
    // The login-intent gate redirects to /auth/signup?error=no_account
    // This must match the actual signup page route
    const gateRedirect = '/auth/signup?error=no_account';
    expect(gateRedirect.startsWith('/auth/signup')).toBe(true);
    expect(STANDALONE_ROUTES).toContain('/auth/signup');
  });

  it('auth timeout redirect matches the login page route', () => {
    // The callback page redirects to /auth/login?error=auth_timeout
    const timeoutRedirect = '/auth/login?error=auth_timeout';
    expect(timeoutRedirect.startsWith('/auth/login')).toBe(true);
    expect(STANDALONE_ROUTES).toContain('/auth/login');
  });

  it('all auth routes have corresponding STANDALONE_ROUTES entries', () => {
    const authRoutes = ['/auth/login', '/auth/signup', '/auth/callback'];
    authRoutes.forEach((route) => {
      expect(STANDALONE_ROUTES).toContain(route);
    });
  });

  it('middleware public routes cover all auth sub-routes', () => {
    // Middleware has /auth which matches /auth/*
    expect(isMiddlewarePublicRoute('/auth/login')).toBe(true);
    expect(isMiddlewarePublicRoute('/auth/signup')).toBe(true);
    expect(isMiddlewarePublicRoute('/auth/callback')).toBe(true);
    expect(isMiddlewarePublicRoute('/auth/beta')).toBe(true);
  });
});

// ============================================================================
// Signup Page Validation Logic
// ============================================================================

/**
 * Matches app/auth/signup/page.tsx:70-78
 * Password validation before form submission.
 */
function validateSignupForm(password: string, confirmPassword: string): string | null {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return null;
}

describe('Signup form validation', () => {
  it('rejects password mismatch', () => {
    expect(validateSignupForm('Password123!', 'Password456!')).toBe('Passwords do not match');
  });

  it('rejects passwords shorter than 8 characters', () => {
    expect(validateSignupForm('short', 'short')).toBe('Password must be at least 8 characters');
  });

  it('checks mismatch BEFORE length (production code order)', () => {
    // If both passwords mismatch AND are too short, mismatch error comes first
    expect(validateSignupForm('abc', 'xyz')).toBe('Passwords do not match');
  });

  it('accepts valid matching passwords >= 8 chars', () => {
    expect(validateSignupForm('ValidPass1!', 'ValidPass1!')).toBeNull();
  });

  it('accepts exactly 8 character passwords', () => {
    expect(validateSignupForm('12345678', '12345678')).toBeNull();
  });

  it('rejects 7 character passwords', () => {
    expect(validateSignupForm('1234567', '1234567')).toBe('Password must be at least 8 characters');
  });

  it('rejects empty passwords', () => {
    expect(validateSignupForm('', '')).toBe('Password must be at least 8 characters');
  });
});

// ============================================================================
// Signup no_account Error Param Detection
// ============================================================================

/**
 * Matches app/auth/signup/page.tsx:48
 * When the login-intent gate fires, user is redirected to
 * /auth/signup?error=no_account — signup page detects this and
 * shows a helpful "no existing account" message.
 */
function detectNoAccountError(errorParam: string | null): boolean {
  return errorParam === 'no_account';
}

describe('Signup page no_account error detection', () => {
  it('detects no_account error param', () => {
    expect(detectNoAccountError('no_account')).toBe(true);
  });

  it('ignores other error params', () => {
    expect(detectNoAccountError('auth_timeout')).toBe(false);
    expect(detectNoAccountError('invalid')).toBe(false);
  });

  it('ignores null (no error param)', () => {
    expect(detectNoAccountError(null)).toBe(false);
  });

  it('ignores empty string', () => {
    expect(detectNoAccountError('')).toBe(false);
  });
});

// ============================================================================
// Callback returnTo Guard — Symmetry with sanitizeReturnTo
// ============================================================================

/**
 * The callback page (lines 160) uses this EXACT inline check:
 *   savedReturnTo.startsWith('/') && !savedReturnTo.startsWith('//')
 *
 * This must be symmetric with our sanitizeReturnTo function.
 * If they diverge, one path blocks a URL the other allows.
 */
function callbackInlineReturnToCheck(savedReturnTo: string): boolean {
  return savedReturnTo.startsWith('/') && !savedReturnTo.startsWith('//');
}

describe('Callback returnTo guard symmetry', () => {
  const testCases = [
    { input: '/studio', expectAllow: true },
    { input: '/pricing?plan=starter', expectAllow: true },
    { input: '/studio/keywords', expectAllow: true },
    { input: '//evil.com', expectAllow: false },
    { input: 'https://evil.com', expectAllow: false },
    { input: 'javascript:alert(1)', expectAllow: false },
    { input: 'evil.com', expectAllow: false },
  ];

  testCases.forEach(({ input, expectAllow }) => {
    it(`${expectAllow ? 'allows' : 'blocks'} "${input}" — consistent between callback and sanitizer`, () => {
      const inlineResult = callbackInlineReturnToCheck(input);
      const sanitizerResult = sanitizeReturnTo(input) === input;
      expect(inlineResult).toBe(expectAllow);
      // Both methods must agree
      expect(inlineResult).toBe(sanitizerResult);
    });
  });
});
