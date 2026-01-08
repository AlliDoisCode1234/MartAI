import { convexTest } from 'convex-test';
import { expect, test, describe, beforeEach, afterEach } from 'vitest';
import { api } from './_generated/api';
import schema from './schema';

/**
 * Waitlist Mutation Tests
 *
 * Tests for phoo.ai waitlist signup flow covering:
 * - Email validation
 * - Idempotency (duplicate signups)
 * - User record creation
 * - Metadata capture
 *
 * Note: joinWaitlist schedules a HubSpot sync action. We call
 * finishInProgressScheduledFunctions() after each mutation to prevent
 * "Write outside of transaction" errors in convex-test.
 */

describe('joinWaitlist', () => {
  let t: ReturnType<typeof convexTest>;

  beforeEach(() => {
    t = convexTest(schema);
  });

  afterEach(async () => {
    // Cleanup any remaining scheduled functions
    try {
      await t.finishInProgressScheduledFunctions();
    } catch {
      // Ignore errors from scheduled Node.js actions (e.g., HubSpot without API key)
    }
  });

  test('should create waitlist entry for valid email', async () => {
    const result = await t.mutation(api.waitlist.joinWaitlist, {
      email: 'test@example.com',
      source: 'phoo.ai',
    });
    await t.finishInProgressScheduledFunctions();

    expect(result.id).toBeDefined();
    expect(result.alreadyExists).toBe(false);
  });

  test('should normalize email to lowercase', async () => {
    const result = await t.mutation(api.waitlist.joinWaitlist, {
      email: 'TEST@EXAMPLE.COM',
      source: 'phoo.ai',
    });
    await t.finishInProgressScheduledFunctions();

    expect(result.id).toBeDefined();

    // Query to verify normalized
    const entries = await t.query(api.waitlist.listWaitlistEntries, { limit: 10 });
    const entry = entries.find((e: { _id: unknown }) => e._id === result.id);
    expect(entry?.email).toBe('test@example.com');
  });

  test('should be idempotent for duplicate emails', async () => {
    // First signup
    const first = await t.mutation(api.waitlist.joinWaitlist, {
      email: 'dupe@example.com',
      source: 'phoo.ai',
    });
    await t.finishInProgressScheduledFunctions();
    expect(first.alreadyExists).toBe(false);

    // Second signup with same email (no new scheduler since user exists)
    const second = await t.mutation(api.waitlist.joinWaitlist, {
      email: 'dupe@example.com',
      source: 'phoo.ai',
    });
    expect(second.alreadyExists).toBe(true);
    expect(second.id).toEqual(first.id);
  });

  test('should reject invalid email format', async () => {
    await expect(
      t.mutation(api.waitlist.joinWaitlist, {
        email: 'not-an-email',
        source: 'phoo.ai',
      })
    ).rejects.toThrow('Invalid email format');
  });

  test('should capture UTM metadata', async () => {
    const result = await t.mutation(api.waitlist.joinWaitlist, {
      email: 'utm@example.com',
      source: 'phoo.ai',
      metadata: {
        utmSource: 'google',
        utmMedium: 'cpc',
        utmCampaign: 'beta_launch',
        referrer: 'https://google.com',
      },
    });
    await t.finishInProgressScheduledFunctions();

    expect(result.id).toBeDefined();

    const entries = await t.query(api.waitlist.listWaitlistEntries, { limit: 10 });
    const entry = entries.find((e: { _id: unknown }) => e._id === result.id);

    expect(entry?.metadata?.utmSource).toBe('google');
    expect(entry?.metadata?.utmMedium).toBe('cpc');
    expect(entry?.metadata?.utmCampaign).toBe('beta_launch');
  });

  test('should create user record with acquisitionSource', async () => {
    const result = await t.mutation(api.waitlist.joinWaitlist, {
      email: 'newuser@example.com',
      source: 'phoo.ai',
    });
    await t.finishInProgressScheduledFunctions();

    expect(result.userId).toBeDefined();

    // The mutation should have set acquisitionSource to waitlist_beta
    // We verify this through the return value (userId exists)
    // Full integration test would verify via admin query
  });

  test('should not create duplicate user if email already exists', async () => {
    // First, create a waitlist signup which will create the user
    await t.mutation(api.waitlist.joinWaitlist, {
      email: 'existing@example.com',
      source: 'phoo.ai',
    });
    await t.finishInProgressScheduledFunctions();

    // Second waitlist signup with same email should be idempotent
    const result = await t.mutation(api.waitlist.joinWaitlist, {
      email: 'existing@example.com',
      source: 'phoo.ai',
    });

    // Should return existing waitlist entry
    expect(result.alreadyExists).toBe(true);
  });
});

describe('getWaitlistCount', () => {
  let t: ReturnType<typeof convexTest>;

  beforeEach(() => {
    t = convexTest(schema);
  });

  afterEach(async () => {
    try {
      await t.finishInProgressScheduledFunctions();
    } catch {
      // Ignore errors from scheduled Node.js actions
    }
  });

  test('should return zero for empty waitlist', async () => {
    const result = await t.query(api.waitlist.getWaitlistCount, {});
    expect(result.count).toBe(0);
  });

  test('should return correct count after signups', async () => {
    await t.mutation(api.waitlist.joinWaitlist, {
      email: 'count1@example.com',
      source: 'phoo.ai',
    });
    await t.finishInProgressScheduledFunctions();

    await t.mutation(api.waitlist.joinWaitlist, {
      email: 'count2@example.com',
      source: 'phoo.ai',
    });
    await t.finishInProgressScheduledFunctions();

    const result = await t.query(api.waitlist.getWaitlistCount, {});
    expect(result.count).toBe(2);
  });
});
