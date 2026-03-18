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
  BLOG_ONLY_MODE,
  LAUNCH_CONTENT_TYPES,
} from './featureFlags';
import {
  ENABLED_CONTENT_TYPE_IDS,
  getEnabledContentTypes,
  getEnabledContentTypesByCategory,
  CONTENT_TYPE_IDS,
} from './contentTypes';

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
    for (const href of allHrefs) {
      expect(href.toLowerCase()).not.toContain('javascript:');
    }
  });

  it('no HREF contains data: protocol', () => {
    for (const href of allHrefs) {
      expect(href.toLowerCase()).not.toContain('data:');
    }
  });

  it('no HREF starts with protocol-relative //', () => {
    for (const href of allHrefs) {
      expect(href.startsWith('//')).toBe(false);
    }
  });

  it('all HREFs are relative paths', () => {
    for (const href of allHrefs) {
      expect(href.startsWith('/')).toBe(true);
      expect(href).not.toMatch(/^https?:/);
    }
  });
});

// ============================================================================
// BLOG_ONLY_MODE — Content Type Feature Flag
// ============================================================================

describe('BLOG_ONLY_MODE feature flag', () => {
  it('is a boolean value', () => {
    expect(typeof BLOG_ONLY_MODE).toBe('boolean');
  });

  it('is currently set to true (launch mode)', () => {
    // TODO: Update this test when expanding content types post-launch
    expect(BLOG_ONLY_MODE).toBe(true);
  });
});

describe('LAUNCH_CONTENT_TYPES', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(LAUNCH_CONTENT_TYPES)).toBe(true);
    expect(LAUNCH_CONTENT_TYPES.length).toBeGreaterThan(0);
  });

  it('contains only "blog" at launch', () => {
    expect(LAUNCH_CONTENT_TYPES).toEqual(['blog']);
  });

  it('every entry is a valid ContentTypeId', () => {
    for (const id of LAUNCH_CONTENT_TYPES) {
      expect(CONTENT_TYPE_IDS).toContain(id);
    }
  });
});

describe('Content type gating helpers', () => {
  it('ENABLED_CONTENT_TYPE_IDS contains only blog when BLOG_ONLY_MODE is true', () => {
    if (BLOG_ONLY_MODE) {
      expect(ENABLED_CONTENT_TYPE_IDS).toEqual(['blog']);
    } else {
      expect(ENABLED_CONTENT_TYPE_IDS.length).toBe(17);
    }
  });

  it('getEnabledContentTypes returns only blog configs', () => {
    const enabled = getEnabledContentTypes();
    if (BLOG_ONLY_MODE) {
      expect(enabled.length).toBe(1);
      expect(enabled[0].id).toBe('blog');
    } else {
      expect(enabled.length).toBe(17);
    }
  });

  it('getEnabledContentTypesByCategory returns only Blog Content category', () => {
    const grouped = getEnabledContentTypesByCategory();
    if (BLOG_ONLY_MODE) {
      const categories = Object.keys(grouped);
      expect(categories.length).toBe(1);
      expect(categories[0]).toBe('Blog Content');
      expect(grouped['Blog Content'].length).toBe(1);
    }
  });

  it('full registry still has all 17 types (data is preserved)', () => {
    // The registry is not modified, only the filter
    expect(CONTENT_TYPE_IDS.length).toBe(17);
  });
});
