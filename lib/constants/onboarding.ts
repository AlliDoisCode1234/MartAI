/**
 * Onboarding Constants
 *
 * Plan options and configuration for onboarding flow.
 * Updated Feb 2026: Lead Generation System positioning
 *   - Lead Starter ($197) replaces Solo ($59)
 *   - Growth Engine ($397) replaces Growth ($149)
 *   - Agency ($697) replaces Team ($299)
 *   - Enterprise removed from onboarding (Contact Sales only)
 */

export const PLANS = [
  {
    id: 'starter',
    name: 'Lead Starter',
    price: '$197/mo',
    description: 'Your in-house lead engine',
    features: [
      '1 Website',
      'Lead-Focused Content Engine',
      'SEO + GEO Optimization',
      'CMS Publishing Automation',
      'Monthly Performance Dashboard',
      'Email Support',
    ],
    color: 'blue',
  },
  {
    id: 'engine',
    name: 'Growth Engine',
    price: '$397/mo',
    description: 'Replace your marketing agency',
    features: [
      '3 Websites',
      'Advanced Keyword Strategy',
      'AI Content Briefs',
      'Conversion Optimization',
      'Lead Tracking Integration',
      '5 Team Members',
      'Priority Support',
    ],
    color: 'purple',
    popular: true,
  },
  {
    id: 'agency',
    name: 'Agency',
    price: '$697/mo',
    description: 'For agencies & multi-location',
    features: [
      '10 Websites',
      'White-Label Reports',
      'Client Access Portals',
      'Revenue Tracking',
      '25 Team Members',
      'Dedicated Onboarding Strategist',
    ],
    color: 'green',
  },
] as const;

export type Plan = (typeof PLANS)[number];

export const TOTAL_STEPS = 5;

/**
 * Get user email with localStorage fallback
 * Convex Auth may not populate user.email immediately
 */
export function getUserEmail(user: { email?: string } | null): string | null {
  if (user?.email) return user.email;
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.email || parsed.username || null;
      }
    } catch {
      // Ignore parse errors
    }
  }
  return null;
}

/**
 * Cache email to localStorage when user is loaded
 */
export function cacheUserEmail(email: string): void {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('user');
      const existing = stored ? JSON.parse(stored) : {};
      localStorage.setItem('user', JSON.stringify({ ...existing, email }));
    } catch {
      // Ignore
    }
  }
}
