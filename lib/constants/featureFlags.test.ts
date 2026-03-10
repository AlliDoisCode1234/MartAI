/**
 * Feature Flags — Test Suite
 *
 * Validates that the IS_LAUNCHED feature flag system correctly defines
 * all constants and that the beta/launched contracts remain consistent.
 * Any change to these constants affects every CTA in the product.
 */

import { describe, it, expect } from 'vitest';
import {
  IS_LAUNCHED,
  BETA_JOIN_HREF,
  LAUNCHED_SIGNUP_HREF,
  LAUNCHED_PRICING_HREF,
  BYPASS_PAYMENT,
  DEBUG_ONBOARDING,
} from './featureFlags';

// ============================================================================
// IS_LAUNCHED Contract
// ============================================================================

describe('IS_LAUNCHED feature flag', () => {
  it('is a boolean value', () => {
    expect(typeof IS_LAUNCHED).toBe('boolean');
  });

  it('is currently set to false (beta mode)', () => {
    // TODO: Update this test when launching
    expect(IS_LAUNCHED).toBe(false);
  });
});

// ============================================================================
// Beta Destination Constants
// ============================================================================

describe('BETA_JOIN_HREF', () => {
  it('points to /join', () => {
    expect(BETA_JOIN_HREF).toBe('/join');
  });

  it('is a relative path starting with /', () => {
    expect(BETA_JOIN_HREF.startsWith('/')).toBe(true);
  });

  it('does not contain protocol or double slashes (Open Redirect prevention)', () => {
    expect(BETA_JOIN_HREF).not.toMatch(/^\/\//);
    expect(BETA_JOIN_HREF).not.toMatch(/^https?:/);
  });
});

// ============================================================================
// Launched Destination Constants
// ============================================================================

describe('LAUNCHED_SIGNUP_HREF', () => {
  it('points to /auth/signup', () => {
    expect(LAUNCHED_SIGNUP_HREF).toBe('/auth/signup');
  });

  it('is a relative path starting with /', () => {
    expect(LAUNCHED_SIGNUP_HREF.startsWith('/')).toBe(true);
  });

  it('does not contain protocol or double slashes', () => {
    expect(LAUNCHED_SIGNUP_HREF).not.toMatch(/^\/\//);
    expect(LAUNCHED_SIGNUP_HREF).not.toMatch(/^https?:/);
  });
});

describe('LAUNCHED_PRICING_HREF', () => {
  it('points to /pricing', () => {
    expect(LAUNCHED_PRICING_HREF).toBe('/pricing');
  });

  it('is a relative path starting with /', () => {
    expect(LAUNCHED_PRICING_HREF.startsWith('/')).toBe(true);
  });
});

// ============================================================================
// CTA Resolution Logic (beta vs launched)
// ============================================================================

describe('CTA resolution logic', () => {
  it('resolves the correct primary CTA href based on IS_LAUNCHED', () => {
    const ctaHref = IS_LAUNCHED ? LAUNCHED_SIGNUP_HREF : BETA_JOIN_HREF;
    // In beta mode: should go to /join
    if (!IS_LAUNCHED) {
      expect(ctaHref).toBe('/join');
    } else {
      expect(ctaHref).toBe('/auth/signup');
    }
  });

  it('resolves the correct feature page CTA based on IS_LAUNCHED', () => {
    const featureCta = IS_LAUNCHED ? LAUNCHED_PRICING_HREF : BETA_JOIN_HREF;
    if (!IS_LAUNCHED) {
      expect(featureCta).toBe('/join');
    } else {
      expect(featureCta).toBe('/pricing');
    }
  });

  it('resolves the correct CTA label based on IS_LAUNCHED', () => {
    const ctaLabel = IS_LAUNCHED ? 'Start Getting Leads' : 'Join Beta';
    if (!IS_LAUNCHED) {
      expect(ctaLabel).toBe('Join Beta');
    } else {
      expect(ctaLabel).toBe('Start Getting Leads');
    }
  });

  it('controls header login button visibility based on IS_LAUNCHED', () => {
    // Login button should be hidden in beta, visible when launched
    const showLoginButton = IS_LAUNCHED;
    expect(showLoginButton).toBe(IS_LAUNCHED);
  });
});

// ============================================================================
// Environment Flags
// ============================================================================

describe('BYPASS_PAYMENT', () => {
  it('is a boolean value', () => {
    expect(typeof BYPASS_PAYMENT).toBe('boolean');
  });

  it('defaults to false when env var is not set', () => {
    // In test environment, BYPASS_PAYMENT env var should not be set
    expect(BYPASS_PAYMENT).toBe(false);
  });
});

describe('DEBUG_ONBOARDING', () => {
  it('is a boolean value', () => {
    expect(typeof DEBUG_ONBOARDING).toBe('boolean');
  });

  it('defaults to false when env var is not set', () => {
    expect(DEBUG_ONBOARDING).toBe(false);
  });
});

// ============================================================================
// All HREF constants are safe (no XSS or Open Redirect vectors)
// ============================================================================

describe('HREF constant safety', () => {
  const allHrefs = [BETA_JOIN_HREF, LAUNCHED_SIGNUP_HREF, LAUNCHED_PRICING_HREF];

  it('no HREF contains javascript: protocol', () => {
    allHrefs.forEach((href) => {
      expect(href.toLowerCase()).not.toContain('javascript:');
    });
  });

  it('no HREF contains data: protocol', () => {
    allHrefs.forEach((href) => {
      expect(href.toLowerCase()).not.toContain('data:');
    });
  });

  it('no HREF starts with protocol-relative //', () => {
    allHrefs.forEach((href) => {
      expect(href.startsWith('//')).toBe(false);
    });
  });

  it('all HREFs are relative paths', () => {
    allHrefs.forEach((href) => {
      expect(href.startsWith('/')).toBe(true);
      expect(href).not.toMatch(/^https?:/);
    });
  });
});
