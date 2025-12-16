/**
 * Onboarding Constants
 *
 * Plan options and configuration for onboarding flow.
 */

export const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$49/mo',
    description: '1 website, basic analytics',
    features: ['1 Website', 'Basic SEO Audit', 'Weekly Reports'],
    color: 'blue',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$149/mo',
    description: '3 websites, full features',
    features: ['3 Websites', 'Full SEO Suite', 'Daily Sync', 'AI Briefs'],
    color: 'purple',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored to your needs',
    features: ['Unlimited Websites', 'Dedicated Support', 'Custom Integrations', 'SLA Guarantee'],
    color: 'orange',
    cta: 'Contact Us',
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
