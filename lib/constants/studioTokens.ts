/**
 * Content Studio Design Tokens
 *
 * Shared design system constants for the Content Studio.
 * All studio pages and components import from here for visual consistency.
 *
 * Color system: Light, airy content area with dark navy sidebar.
 * Inspired by Notion, Linear, and Instantly.ai — trustworthy & modern.
 */

// ============================================================================
// Core Colors
// ============================================================================

export const STUDIO_COLORS = {
  // Backgrounds
  pageBg: '#EDF2F7',
  pageBgEnd: '#E2E8F0',
  cardBg: '#FFFFFF',
  cardBgSolid: '#FFFFFF',
  cardBgHover: '#F8FAFC',
  sidebarBg: '#0f172a',

  // Borders
  cardBorder: '#E2E8F0',
  subtleBorder: '#EDF2F7',
  activeBorder: '#CBD5E0',

  // Accents
  amber: '#F7941E',
  amberDark: '#E8851A',
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
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#A0AEC0',
  textDim: '#CBD5E0',
} as const;

// ============================================================================
// Gradients
// ============================================================================

export const STUDIO_GRADIENTS = {
  // Page background
  pageBg: `linear-gradient(180deg, ${STUDIO_COLORS.pageBg} 0%, ${STUDIO_COLORS.pageBgEnd} 100%)`,

  // Hero KPI card left-accent borders (colored stripe on white card)
  hero1: `linear-gradient(135deg, ${STUDIO_COLORS.amber} 0%, ${STUDIO_COLORS.amberDark} 100%)`,
  hero2: `linear-gradient(135deg, ${STUDIO_COLORS.blue} 0%, ${STUDIO_COLORS.blueDark} 100%)`,
  hero3: `linear-gradient(135deg, ${STUDIO_COLORS.green} 0%, ${STUDIO_COLORS.greenDark} 100%)`,
  hero4: `linear-gradient(135deg, ${STUDIO_COLORS.purple} 0%, ${STUDIO_COLORS.purpleDark} 100%)`,

  // Accent gradients
  amber: `linear-gradient(135deg, ${STUDIO_COLORS.amber}, ${STUDIO_COLORS.amberDark})`,
  green: `linear-gradient(135deg, ${STUDIO_COLORS.green}, ${STUDIO_COLORS.greenDark})`,
  blue: `linear-gradient(135deg, ${STUDIO_COLORS.blue}, ${STUDIO_COLORS.blueDark})`,
  purple: `linear-gradient(135deg, ${STUDIO_COLORS.purple}, ${STUDIO_COLORS.purpleDark})`,

  // Sidebar active item
  sidebarActive: 'linear-gradient(90deg, rgba(247, 148, 30, 0.15) 0%, transparent 100%)',
} as const;

// ============================================================================
// Card Styles (Chakra-compatible spread objects)
// ============================================================================

export const STUDIO_CARD = {
  bg: STUDIO_COLORS.cardBg,
  borderWidth: '1px',
  borderColor: STUDIO_COLORS.cardBorder,
  borderRadius: 'xl',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
} as const;

/** Elevated card for hero KPIs, featured sections, and primary CTAs */
export const STUDIO_CARD_ELEVATED = {
  bg: STUDIO_COLORS.cardBg,
  borderWidth: '1px',
  borderColor: STUDIO_COLORS.cardBorder,
  borderRadius: '2xl',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.10)',
} as const;

export const STUDIO_CARD_HOVER = {
  bg: STUDIO_COLORS.cardBgHover,
  borderColor: STUDIO_COLORS.activeBorder,
  transform: 'translateY(-2px)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.10)',
} as const;

export const STUDIO_CARD_HOVER_ELEVATED = {
  borderColor: STUDIO_COLORS.amber,
  transform: 'translateY(-3px)',
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
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
