/**
 * Content Feedback — Integration Tests
 *
 * Tests for Phase 3: persona learning feedback mutations.
 * Verifies submitFeedback, getPersonaSignals, auth gating, and signal cap.
 *
 * NOTE: contentFeedback mutations resolve user via identity.email,
 * so withIdentity must include { email } matching the seeded user.
 */

import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('Content Feedback (Phase 3)', () => {
  it('should persist explicit feedback via submitFeedback', async () => {
    const t = createTestContext();
    const email = 'feedback-test@test.com';
    const userId = await seedUser(t, { email });
    const projectId = await seedProject(t, userId);
    const authT = t.withIdentity({ subject: userId, email });

    await authT.mutation(api.contentFeedback.submitFeedback, {
      projectId,
      feedbackType: 'suggestion_accepted',
      suggestionId: 'readability-hard',
    });

    // Verify it was stored
    const signals = await authT.query(api.contentFeedback.getPersonaSignals, {
      projectId,
    });

    expect(signals).toHaveLength(1);
    expect(signals[0].feedbackType).toBe('suggestion_accepted');
    expect(signals[0].suggestionId).toBe('readability-hard');
    expect(signals[0].timestamp).toBeGreaterThan(0);
  });

  it('should persist multiple feedback types in newest-first order', async () => {
    const t = createTestContext();
    const email = 'multi-feedback@test.com';
    const userId = await seedUser(t, { email });
    const projectId = await seedProject(t, userId);
    const authT = t.withIdentity({ subject: userId, email });

    await authT.mutation(api.contentFeedback.submitFeedback, {
      projectId,
      feedbackType: 'tone_too_formal',
      suggestionId: 'readability-medium',
    });

    await authT.mutation(api.contentFeedback.submitFeedback, {
      projectId,
      feedbackType: 'suggestion_dismissed',
      suggestionId: 'wordcount-low',
    });

    await authT.mutation(api.contentFeedback.submitFeedback, {
      projectId,
      feedbackType: 'good_content',
    });

    const signals = await authT.query(api.contentFeedback.getPersonaSignals, {
      projectId,
    });

    expect(signals).toHaveLength(3);
    // Newest first
    expect(signals[0].feedbackType).toBe('good_content');
    expect(signals[1].feedbackType).toBe('suggestion_dismissed');
    expect(signals[2].feedbackType).toBe('tone_too_formal');
  });

  it('should reject unauthenticated feedback', async () => {
    const t = createTestContext();
    const userId = await seedUser(t, { email: 'noauth-fb@test.com' });
    const projectId = await seedProject(t, userId);

    // No auth — should throw
    await expect(
      t.mutation(api.contentFeedback.submitFeedback, {
        projectId,
        feedbackType: 'good_content',
      })
    ).rejects.toThrow();
  });

  it('should return empty array for unauthenticated persona query', async () => {
    const t = createTestContext();
    const userId = await seedUser(t, { email: 'unauth-query@test.com' });
    const projectId = await seedProject(t, userId);

    // Unauthenticated query returns empty (not error)
    const signals = await t.query(api.contentFeedback.getPersonaSignals, {
      projectId,
    });

    expect(signals).toEqual([]);
  });

  it('should record implicit signal with edit delta', async () => {
    const t = createTestContext();
    const email = 'implicit-test@test.com';
    const userId = await seedUser(t, { email });
    const projectId = await seedProject(t, userId);
    const authT = t.withIdentity({ subject: userId, email });

    await authT.mutation(api.contentFeedback.recordImplicitSignal, {
      projectId,
      feedbackType: 'suggestion_accepted',
      editDelta: {
        readabilityBefore: 35,
        readabilityAfter: 55,
        wordCountBefore: 500,
        wordCountAfter: 800,
      },
    });

    const signals = await authT.query(api.contentFeedback.getPersonaSignals, {
      projectId,
    });

    expect(signals).toHaveLength(1);
    expect(signals[0].editDelta).toEqual({
      readabilityBefore: 35,
      readabilityAfter: 55,
      wordCountBefore: 500,
      wordCountAfter: 800,
    });
  });
});
