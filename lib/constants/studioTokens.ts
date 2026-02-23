/**
 * Content Studio Design Tokens
 *
 * Shared design system constants for the Content Studio.
 * All studio pages and components import from here for visual consistency.
 *
 * Color system: warm amber-to-deep-purple gradient palette.
 * Inspired by premium dashboard UIs (Linear, Vercel, Raycast).
 */

// ============================================================================
// Core Colors
// ============================================================================

export const STUDIO_COLORS = {
  // Backgrounds
  pageBg: '#0f172a',
  pageBgEnd: '#1e1b4b',
  cardBg: 'rgba(255, 255, 255, 0.03)',
  cardBgSolid: '#1e1b4b',
  cardBgHover: 'rgba(255, 255, 255, 0.05)',
  sidebarBg: 'rgba(26, 12, 0, 0.95)', // kept for reference, but sidebar is light now

  // Borders
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  subtleBorder: 'rgba(255, 255, 255, 0.08)',
  activeBorder: 'rgba(255, 255, 255, 0.2)',

  // Accents
  amber: '#FF9D00',
  amberDark: '#FF6B00',
  green: '#22C55E',
  greenDark: '#16A34A',
  coral: '#FF6B6B',
  coralDark: '#EF4444',
  blue: '#3B82F6',
  blueDark: '#2563EB',
  purple: '#8B5CF6',
  purpleDark: '#7C3AED',
  yellow: '#FACC15',
  cyan: '#06B6D4',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.45)',
  textDim: 'rgba(255, 255, 255, 0.3)',
} as const;

// ============================================================================
// Gradients
// ============================================================================

export const STUDIO_GRADIENTS = {
  // Page background
  pageBg: `linear-gradient(180deg, ${STUDIO_COLORS.pageBg} 0%, ${STUDIO_COLORS.pageBgEnd} 100%)`,

  // Hero KPI card backgrounds (each card has a unique tinted gradient)
  hero1: 'linear-gradient(135deg, #2b1305 0%, #4e1b05 100%)', // Orange-tinted
  hero2: 'linear-gradient(135deg, #351a10 0%, #4e2b1b 100%)', // Amber-tinted
  hero3: 'linear-gradient(135deg, #1f2b10 0%, #2f4e1b 100%)', // Green-tinted
  hero4: 'linear-gradient(135deg, #2b1021 0%, #4e1b3a 100%)', // Coral/Pink-tinted

  // Accent gradients
  amber: `linear-gradient(135deg, ${STUDIO_COLORS.amber}, ${STUDIO_COLORS.amberDark})`,
  green: `linear-gradient(135deg, ${STUDIO_COLORS.green}, ${STUDIO_COLORS.greenDark})`,
  blue: `linear-gradient(135deg, ${STUDIO_COLORS.blue}, ${STUDIO_COLORS.blueDark})`,
  purple: `linear-gradient(135deg, ${STUDIO_COLORS.purple}, ${STUDIO_COLORS.purpleDark})`,

  // Sidebar active item
  sidebarActive: 'linear-gradient(90deg, rgba(255, 157, 0, 0.15) 0%, transparent 100%)',
} as const;

// ============================================================================
// Card Styles (Chakra-compatible spread objects)
// ============================================================================

export const STUDIO_CARD = {
  bg: STUDIO_COLORS.cardBg,
  backdropFilter: 'blur(12px)',
  borderWidth: '1px',
  borderColor: STUDIO_COLORS.cardBorder,
  borderRadius: 'xl',
} as const;

export const STUDIO_CARD_HOVER = {
  bg: STUDIO_COLORS.cardBgHover,
  borderColor: STUDIO_COLORS.activeBorder,
  transform: 'translateY(-1px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
} as const;

// ============================================================================
// Spacing & Layout
// ============================================================================

export const STUDIO_LAYOUT = {
  sidebarWidth: '200px',
  sidebarWidthCollapsed: '64px',
  contentPadding: { base: 4, md: 8 },
  cardGap: 6,
  sectionGap: 8,
} as const;

// ============================================================================
// Animation Presets (Framer Motion compatible)
// ============================================================================

export const STUDIO_ANIMATIONS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 },
  },
  staggerChildren: {
    animate: { transition: { staggerChildren: 0.1 } },
  },
} as const;

// ============================================================================
// Score Thresholds (for color-coding metrics)
// ============================================================================

export const SCORE_THRESHOLDS = {
  excellent: 80,
  good: 60,
  moderate: 40,
} as const;

/**
 * Returns the appropriate color for a score value (0-100).
 */
export function getScoreColor(score: number): string {
  if (score >= SCORE_THRESHOLDS.excellent) return STUDIO_COLORS.green;
  if (score >= SCORE_THRESHOLDS.good) return STUDIO_COLORS.amber;
  if (score >= SCORE_THRESHOLDS.moderate) return STUDIO_COLORS.yellow;
  return STUDIO_COLORS.coral;
}

/**
 * Returns a Chakra colorScheme string for a score value.
 */
export function getScoreColorScheme(score: number): string {
  if (score >= SCORE_THRESHOLDS.excellent) return 'green';
  if (score >= SCORE_THRESHOLDS.good) return 'orange';
  if (score >= SCORE_THRESHOLDS.moderate) return 'yellow';
  return 'red';
}

// ============================================================================
// Status Colors
// ============================================================================

export const STATUS_COLORS: Record<string, string> = {
  published: STUDIO_COLORS.green,
  approved: STUDIO_COLORS.blue,
  scheduled: STUDIO_COLORS.purple,
  draft: STUDIO_COLORS.amber,
  generating: STUDIO_COLORS.cyan,
  'in-review': STUDIO_COLORS.yellow,
};

/**
 * Returns the color for a content piece status.
 */
export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || STUDIO_COLORS.textMuted;
}
