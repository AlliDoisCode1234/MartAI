import { describe, test, expect } from 'vitest';
import {
  mapUserToHubSpot,
  mapWaitlistToHubSpot,
  mapPRScoreToHubSpot,
  HUBSPOT_CUSTOM_PROPERTIES,
} from './hubspotMapper';

/**
 * HubSpot Mapper Unit Tests
 *
 * Tests the pure mapping functions that transform Convex data
 * to HubSpot property format. These are critical for onboarding sync.
 */

describe('HubSpot Mapper: mapUserToHubSpot', () => {
  test('should map basic user properties', () => {
    const user = {
      email: 'test@example.com',
      name: 'John Doe',
      membershipTier: 'pro',
      onboardingStatus: 'completed',
    };

    const result = mapUserToHubSpot(user);

    expect(result.firstname).toBe('John');
    expect(result.lastname).toBe('Doe');
    expect(result.phoo_plan).toBe('pro');
    expect(result.phoo_onboarding_status).toBe('completed');
  });

  test('should handle single name (no last name)', () => {
    const user = { name: 'Madonna' };
    const result = mapUserToHubSpot(user);

    expect(result.firstname).toBe('Madonna');
    expect(result.lastname).toBe('');
  });

  test('should map GA4/GSC connection status', () => {
    const user = {
      onboardingSteps: {
        ga4Connected: true,
        gscConnected: false,
      },
    };

    const result = mapUserToHubSpot(user);

    expect(result.phoo_ga4_connected).toBe(true);
    expect(result.phoo_gsc_connected).toBe(false);
  });

  test('should map acquisition metadata', () => {
    const now = Date.now();
    const user = {
      acquisitionSource: 'referral',
      acquisitionDate: now,
      lastActiveAt: now,
    };

    const result = mapUserToHubSpot(user);

    expect(result.phoo_lead_source).toBe('referral');
    expect(result.phoo_acquisition_date).toBe(now);
    expect(result.phoo_last_activity).toBe(now);
  });

  test('should return empty object for empty user', () => {
    const result = mapUserToHubSpot({});
    expect(Object.keys(result).length).toBe(0);
  });
});

describe('HubSpot Mapper: mapWaitlistToHubSpot', () => {
  test('should set required waitlist properties', () => {
    const result = mapWaitlistToHubSpot({ email: 'lead@example.com' });

    expect(result.lifecyclestage).toBe('lead');
    expect(result.hs_lead_status).toBe('NEW');
    expect(result.phoo_waitlist_signup).toBe(true);
    expect(result.phoo_lead_source).toBe('waitlist_beta');
    expect(result.phoo_onboarding_status).toBe('not_started');
    expect(result.phoo_account_status).toBe('inactive');
  });

  test('should map custom source', () => {
    const result = mapWaitlistToHubSpot({
      email: 'lead@example.com',
      source: 'partner',
    });

    expect(result.phoo_lead_source).toBe('partner');
  });

  test('should map UTM parameters', () => {
    const result = mapWaitlistToHubSpot({
      email: 'lead@example.com',
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'spring_2026',
    });

    expect(result.hs_analytics_source).toBe('google');
    expect(result.hs_analytics_medium).toBe('cpc');
    expect(result.hs_analytics_campaign).toBe('spring_2026');
  });

  test('should NOT set acquisition date (HubSpot handles natively)', () => {
    const result = mapWaitlistToHubSpot({ email: 'lead@example.com' });
    expect(result.phoo_acquisition_date).toBeUndefined();
  });
});

describe('HubSpot Mapper: mapPRScoreToHubSpot', () => {
  test('should map PR score and needs attention flag', () => {
    const result = mapPRScoreToHubSpot({
      prScore: 75,
      needsAttention: true,
    });

    expect(result.phoo_pr_score).toBe(75);
    expect(result.phoo_needs_attention).toBe(true);
  });

  test('should default needsAttention to false', () => {
    const result = mapPRScoreToHubSpot({ prScore: 90 });

    expect(result.phoo_needs_attention).toBe(false);
  });

  test('should map PR tier', () => {
    const result = mapPRScoreToHubSpot({
      prScore: 85,
      prTier: 'thriving',
    });

    expect(result.phoo_pr_tier).toBe('thriving');
  });

  test('should map last activity timestamp', () => {
    const now = Date.now();
    const result = mapPRScoreToHubSpot({
      prScore: 60,
      lastActiveAt: now,
    });

    expect(result.phoo_last_activity).toBe(now);
  });
});

describe('HubSpot: Property Registry', () => {
  test('should have all required custom properties defined', () => {
    // Critical properties for onboarding sync
    const required = [
      'phoo_lead_source',
      'phoo_onboarding_status',
      'phoo_plan',
      'phoo_ga4_connected',
      'phoo_gsc_connected',
      'phoo_waitlist_signup',
    ];

    for (const prop of required) {
      expect(HUBSPOT_CUSTOM_PROPERTIES).toHaveProperty(prop);
    }
  });

  test('should have valid property types', () => {
    const validTypes = ['string', 'number', 'enumeration', 'date', 'datetime', 'booleancheckbox'];

    for (const [key, config] of Object.entries(HUBSPOT_CUSTOM_PROPERTIES)) {
      expect(validTypes).toContain((config as { type: string }).type);
    }
  });
});
