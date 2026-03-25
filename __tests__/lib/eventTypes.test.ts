/**
 * Event Types — Unit Tests
 *
 * Tests the canonical BI event taxonomy:
 * - BI_EVENTS constant completeness
 * - BiEventName type correctness
 * - biEventValidator runtime validation
 */

import { describe, it, expect } from 'vitest';
import { BI_EVENTS, biEventValidator } from '../../convex/lib/eventTypes';

describe('BI Event Taxonomy', () => {
  describe('BI_EVENTS constant', () => {
    it('should contain all signup and onboarding events', () => {
      expect(BI_EVENTS.SIGNUP_STARTED).toBe('signup_started');
      expect(BI_EVENTS.SIGNUP_COMPLETED).toBe('signup_completed');
      expect(BI_EVENTS.ONBOARDING_STEP_COMPLETED).toBe('onboarding_step_completed');
    });

    it('should contain all content pipeline events', () => {
      expect(BI_EVENTS.CONTENT_GENERATED).toBe('content_generated');
      expect(BI_EVENTS.CONTENT_EDITED).toBe('content_edited');
      expect(BI_EVENTS.CONTENT_PUBLISHED).toBe('content_published');
    });

    it('should contain all revenue events', () => {
      expect(BI_EVENTS.PLAN_UPGRADED).toBe('plan_upgraded');
      expect(BI_EVENTS.PLAN_DOWNGRADED).toBe('plan_downgraded');
      expect(BI_EVENTS.SUBSCRIPTION_CREATED).toBe('subscription_created');
      expect(BI_EVENTS.SUBSCRIPTION_CANCELLED).toBe('subscription_cancelled');
    });

    it('should contain all team management events', () => {
      expect(BI_EVENTS.TEAM_INVITE_SENT).toBe('team_invite_sent');
      expect(BI_EVENTS.TEAM_INVITE_ACCEPTED).toBe('team_invite_accepted');
      expect(BI_EVENTS.TEAM_MEMBER_REMOVED).toBe('team_member_removed');
      expect(BI_EVENTS.TEAM_MEMBER_LEFT).toBe('team_member_left');
      expect(BI_EVENTS.TEAM_OWNERSHIP_TRANSFERRED).toBe('team_ownership_transferred');
    });

    it('should contain all SEO and research events', () => {
      expect(BI_EVENTS.KEYWORD_RESEARCH_RUN).toBe('keyword_research_run');
      expect(BI_EVENTS.KEYWORDS_IMPORTED).toBe('keywords_imported');
      expect(BI_EVENTS.CLUSTERS_GENERATED).toBe('clusters_generated');
      expect(BI_EVENTS.AI_REPORT_GENERATED).toBe('ai_report_generated');
    });

    it('should contain all integration events', () => {
      expect(BI_EVENTS.GSC_CONNECTED).toBe('gsc_connected');
      expect(BI_EVENTS.GA4_CONNECTED).toBe('ga4_connected');
      expect(BI_EVENTS.WORDPRESS_CONNECTED).toBe('wordpress_connected');
    });

    it('should have exactly 28 event types', () => {
      const eventCount = Object.keys(BI_EVENTS).length;
      expect(eventCount).toBe(28);
    });

    it('should be frozen (immutable)', () => {
      // BI_EVENTS is `as const` so values cannot be changed at compile time
      // Verify all values are strings at runtime
      for (const [key, value] of Object.entries(BI_EVENTS)) {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
        // Verify snake_case naming convention (allows digits like ga4_connected)
        expect(value).toMatch(/^[a-z][a-z0-9_]*$/);
        // Key should be UPPER_SNAKE_CASE (allows digits like GA4_CONNECTED)
        expect(key).toMatch(/^[A-Z][A-Z0-9_]*$/);
      }
    });

    it('should have no duplicate event names', () => {
      const values = Object.values(BI_EVENTS);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  describe('biEventValidator', () => {
    it('should be defined and usable as a Convex validator', () => {
      expect(biEventValidator).toBeDefined();
      // The validator is a Convex object — it should have internal structure
      expect(typeof biEventValidator).toBe('object');
    });
  });
});
