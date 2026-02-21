/**
 * Studio Design Tokens — Test Suite
 *
 * Validates that design tokens are correctly defined,
 * consistent, and produce valid CSS values.
 */

import { describe, it, expect } from 'vitest';
import {
  STUDIO_COLORS,
  STUDIO_GRADIENTS,
  STUDIO_CARD,
  STUDIO_CARD_HOVER,
  STUDIO_LAYOUT,
  STUDIO_ANIMATIONS,
  SCORE_THRESHOLDS,
  getScoreColor,
  getScoreColorScheme,
  STATUS_COLORS,
  getStatusColor,
} from './studioTokens';

// ============================================================================
// Color Token Validation
// ============================================================================

describe('STUDIO_COLORS', () => {
  it('defines all required background colors', () => {
    expect(STUDIO_COLORS.pageBg).toBeDefined();
    expect(STUDIO_COLORS.pageBgEnd).toBeDefined();
    expect(STUDIO_COLORS.cardBg).toBeDefined();
    expect(STUDIO_COLORS.cardBgSolid).toBeDefined();
    expect(STUDIO_COLORS.cardBgHover).toBeDefined();
    expect(STUDIO_COLORS.sidebarBg).toBeDefined();
  });

  it('defines all required accent colors', () => {
    expect(STUDIO_COLORS.amber).toBe('#FF9D00');
    expect(STUDIO_COLORS.green).toBe('#22C55E');
    expect(STUDIO_COLORS.coral).toBe('#FF6B6B');
    expect(STUDIO_COLORS.blue).toBe('#3B82F6');
    expect(STUDIO_COLORS.purple).toBe('#8B5CF6');
  });

  it('defines text hierarchy colors', () => {
    expect(STUDIO_COLORS.textPrimary).toBe('#FFFFFF');
    expect(STUDIO_COLORS.textSecondary).toBeDefined();
    expect(STUDIO_COLORS.textMuted).toBeDefined();
    expect(STUDIO_COLORS.textDim).toBeDefined();
  });

  it('hex colors are valid hex format', () => {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    expect(STUDIO_COLORS.pageBg).toMatch(hexPattern);
    expect(STUDIO_COLORS.amber).toMatch(hexPattern);
    expect(STUDIO_COLORS.green).toMatch(hexPattern);
    expect(STUDIO_COLORS.coral).toMatch(hexPattern);
    expect(STUDIO_COLORS.blue).toMatch(hexPattern);
    expect(STUDIO_COLORS.purple).toMatch(hexPattern);
  });

  it('rgba colors are valid rgba format', () => {
    const rgbaPattern = /^rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/;
    expect(STUDIO_COLORS.cardBg).toMatch(rgbaPattern);
    expect(STUDIO_COLORS.cardBgHover).toMatch(rgbaPattern);
    expect(STUDIO_COLORS.cardBorder).toMatch(rgbaPattern);
    expect(STUDIO_COLORS.textSecondary).toMatch(rgbaPattern);
  });

  it('has no undefined values', () => {
    const values = Object.values(STUDIO_COLORS);
    values.forEach((val) => {
      expect(val).toBeDefined();
      expect(val).not.toBe('');
    });
  });
});

// ============================================================================
// Gradient Validation
// ============================================================================

describe('STUDIO_GRADIENTS', () => {
  it('contains valid CSS gradient strings', () => {
    const gradientPattern = /^linear-gradient\(/;
    expect(STUDIO_GRADIENTS.pageBg).toMatch(gradientPattern);
    expect(STUDIO_GRADIENTS.hero1).toMatch(gradientPattern);
    expect(STUDIO_GRADIENTS.hero2).toMatch(gradientPattern);
    expect(STUDIO_GRADIENTS.hero3).toMatch(gradientPattern);
    expect(STUDIO_GRADIENTS.hero4).toMatch(gradientPattern);
    expect(STUDIO_GRADIENTS.amber).toMatch(gradientPattern);
    expect(STUDIO_GRADIENTS.sidebarActive).toMatch(gradientPattern);
  });

  it('each hero gradient has a unique color', () => {
    const heroGradients = [
      STUDIO_GRADIENTS.hero1,
      STUDIO_GRADIENTS.hero2,
      STUDIO_GRADIENTS.hero3,
      STUDIO_GRADIENTS.hero4,
    ];
    const uniqueGradients = new Set(heroGradients);
    expect(uniqueGradients.size).toBe(4);
  });
});

// ============================================================================
// Card Style Validation
// ============================================================================

describe('STUDIO_CARD', () => {
  it('defines required card properties', () => {
    expect(STUDIO_CARD.bg).toBeDefined();
    expect(STUDIO_CARD.backdropFilter).toContain('blur');
    expect(STUDIO_CARD.borderWidth).toBe('1px');
    expect(STUDIO_CARD.borderColor).toBeDefined();
    expect(STUDIO_CARD.borderRadius).toBe('xl');
  });

  it('hover state adds elevation', () => {
    expect(STUDIO_CARD_HOVER.transform).toBeDefined();
    expect(STUDIO_CARD_HOVER.boxShadow).toBeDefined();
  });
});

// ============================================================================
// Layout Constants
// ============================================================================

describe('STUDIO_LAYOUT', () => {
  it('defines sidebar widths', () => {
    expect(STUDIO_LAYOUT.sidebarWidth).toBe('200px');
    expect(STUDIO_LAYOUT.sidebarWidthCollapsed).toBe('64px');
  });

  it('defines responsive content padding', () => {
    expect(STUDIO_LAYOUT.contentPadding).toHaveProperty('base');
    expect(STUDIO_LAYOUT.contentPadding).toHaveProperty('md');
  });
});

// ============================================================================
// Animation Presets
// ============================================================================

describe('STUDIO_ANIMATIONS', () => {
  it('fadeInUp has correct initial and animate states', () => {
    expect(STUDIO_ANIMATIONS.fadeInUp.initial).toHaveProperty('opacity', 0);
    expect(STUDIO_ANIMATIONS.fadeInUp.initial).toHaveProperty('y', 20);
    expect(STUDIO_ANIMATIONS.fadeInUp.animate).toHaveProperty('opacity', 1);
    expect(STUDIO_ANIMATIONS.fadeInUp.animate).toHaveProperty('y', 0);
    expect(STUDIO_ANIMATIONS.fadeInUp.transition.duration).toBeGreaterThan(0);
  });

  it('all animation presets are defined', () => {
    expect(STUDIO_ANIMATIONS.fadeInLeft).toBeDefined();
    expect(STUDIO_ANIMATIONS.fadeInRight).toBeDefined();
    expect(STUDIO_ANIMATIONS.staggerChildren).toBeDefined();
  });
});

// ============================================================================
// Score Color Functions
// ============================================================================

describe('getScoreColor', () => {
  it('returns green for excellent scores (>= 80)', () => {
    expect(getScoreColor(80)).toBe(STUDIO_COLORS.green);
    expect(getScoreColor(95)).toBe(STUDIO_COLORS.green);
    expect(getScoreColor(100)).toBe(STUDIO_COLORS.green);
  });

  it('returns amber for good scores (60-79)', () => {
    expect(getScoreColor(60)).toBe(STUDIO_COLORS.amber);
    expect(getScoreColor(75)).toBe(STUDIO_COLORS.amber);
    expect(getScoreColor(79)).toBe(STUDIO_COLORS.amber);
  });

  it('returns yellow for moderate scores (40-59)', () => {
    expect(getScoreColor(40)).toBe(STUDIO_COLORS.yellow);
    expect(getScoreColor(55)).toBe(STUDIO_COLORS.yellow);
    expect(getScoreColor(59)).toBe(STUDIO_COLORS.yellow);
  });

  it('returns coral for poor scores (< 40)', () => {
    expect(getScoreColor(0)).toBe(STUDIO_COLORS.coral);
    expect(getScoreColor(20)).toBe(STUDIO_COLORS.coral);
    expect(getScoreColor(39)).toBe(STUDIO_COLORS.coral);
  });

  it('handles exact threshold boundaries correctly', () => {
    expect(getScoreColor(SCORE_THRESHOLDS.excellent)).toBe(STUDIO_COLORS.green);
    expect(getScoreColor(SCORE_THRESHOLDS.good)).toBe(STUDIO_COLORS.amber);
    expect(getScoreColor(SCORE_THRESHOLDS.moderate)).toBe(STUDIO_COLORS.yellow);
    expect(getScoreColor(SCORE_THRESHOLDS.moderate - 1)).toBe(STUDIO_COLORS.coral);
  });
});

describe('getScoreColorScheme', () => {
  it('returns Chakra color scheme strings', () => {
    expect(getScoreColorScheme(90)).toBe('green');
    expect(getScoreColorScheme(70)).toBe('orange');
    expect(getScoreColorScheme(50)).toBe('yellow');
    expect(getScoreColorScheme(20)).toBe('red');
  });
});

// ============================================================================
// Status Colors
// ============================================================================

describe('STATUS_COLORS', () => {
  it('maps all known statuses', () => {
    expect(STATUS_COLORS['published']).toBe(STUDIO_COLORS.green);
    expect(STATUS_COLORS['approved']).toBe(STUDIO_COLORS.blue);
    expect(STATUS_COLORS['scheduled']).toBe(STUDIO_COLORS.purple);
    expect(STATUS_COLORS['draft']).toBe(STUDIO_COLORS.amber);
    expect(STATUS_COLORS['generating']).toBe(STUDIO_COLORS.cyan);
  });
});

describe('getStatusColor', () => {
  it('returns correct color for known statuses', () => {
    expect(getStatusColor('published')).toBe(STUDIO_COLORS.green);
    expect(getStatusColor('draft')).toBe(STUDIO_COLORS.amber);
  });

  it('returns muted text color for unknown statuses', () => {
    expect(getStatusColor('nonexistent')).toBe(STUDIO_COLORS.textMuted);
    expect(getStatusColor('')).toBe(STUDIO_COLORS.textMuted);
  });
});
