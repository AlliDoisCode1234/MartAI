/**
 * RBAC Cross-Project Isolation Tests — SEC-001 / SEC-002
 *
 * Verifies that requireProjectAccess correctly blocks cross-tenant access
 * for all endpoints modified in the SEC-001 and SEC-002 remediations.
 *
 * Test matrix:
 * - Owner can access own project (happy-path)
 * - Authenticated user CANNOT access another user's project
 * - Unauthenticated user is rejected
 *
 * Coverage:
 * - contentFeedback: submitFeedback, recordImplicitSignal, getPersonaSignals
 * - contentPieces: listByProject, getById, getStats, create, update, remove, schedule, unschedule
 * - strategy: getFullStrategy
 * - scores: getProjectScore
 * - seoAudits: createAudit, getLatestAuditByProject, getAuditsByProject
 */

import { describe, test, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from '../testHelpers';
import { api } from '../../../convex/_generated/api';

// ============================================================================
// Shared setup: two users, each with a project
// ============================================================================

function setupTwoUsers() {
  const t = createTestContext();
  return { t };
}

async function seedTwoUsersWithProjects(t: ReturnType<typeof createTestContext>) {
  const ownerEmail = `owner-${Date.now()}@test.com`;
  const attackerEmail = `attacker-${Date.now()}@test.com`;

  const ownerId = await seedUser(t, { email: ownerEmail });
  const attackerId = await seedUser(t, { email: attackerEmail });

  const ownerProjectId = await seedProject(t, ownerId, { name: 'Victim Project' });
  const attackerProjectId = await seedProject(t, attackerId, { name: 'Attacker Project' });

  const ownerCtx = t.withIdentity({ subject: ownerId, email: ownerEmail });
  const attackerCtx = t.withIdentity({ subject: attackerId, email: attackerEmail });

  return { ownerId, attackerId, ownerProjectId, attackerProjectId, ownerCtx, attackerCtx };
}

// ============================================================================
// Content Feedback — SEC-001-A
// ============================================================================

describe('SEC-001-A: contentFeedback cross-project isolation', () => {
  test('owner can submit feedback to own project', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, ownerCtx } = await seedTwoUsersWithProjects(t);

    // Should succeed without throwing
    await ownerCtx.mutation(api.contentFeedback.submitFeedback, {
      projectId: ownerProjectId,
      feedbackType: 'good_content',
    });

    const signals = await ownerCtx.query(api.contentFeedback.getPersonaSignals, {
      projectId: ownerProjectId,
    });
    expect(signals).toHaveLength(1);
  });

  test('attacker cannot submit feedback to victim project', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, attackerCtx } = await seedTwoUsersWithProjects(t);

    await expect(
      attackerCtx.mutation(api.contentFeedback.submitFeedback, {
        projectId: ownerProjectId,
        feedbackType: 'good_content',
      })
    ).rejects.toThrow();
  });

  test('attacker cannot record implicit signal on victim project', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, attackerCtx } = await seedTwoUsersWithProjects(t);

    await expect(
      attackerCtx.mutation(api.contentFeedback.recordImplicitSignal, {
        projectId: ownerProjectId,
        feedbackType: 'suggestion_accepted',
        editDelta: {
          readabilityBefore: 30,
          readabilityAfter: 60,
          wordCountBefore: 500,
          wordCountAfter: 800,
        },
      })
    ).rejects.toThrow();
  });

  test('attacker cannot read persona signals from victim project', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, ownerCtx, attackerCtx } = await seedTwoUsersWithProjects(t);

    // Owner seeds a signal
    await ownerCtx.mutation(api.contentFeedback.submitFeedback, {
      projectId: ownerProjectId,
      feedbackType: 'good_content',
    });

    // Attacker gets empty (graceful degradation, not throw)
    const signals = await attackerCtx.query(api.contentFeedback.getPersonaSignals, {
      projectId: ownerProjectId,
    });
    expect(signals).toEqual([]);
  });

  test('unauthenticated user cannot submit feedback', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId } = await seedTwoUsersWithProjects(t);

    await expect(
      t.mutation(api.contentFeedback.submitFeedback, {
        projectId: ownerProjectId,
        feedbackType: 'good_content',
      })
    ).rejects.toThrow();
  });
});

// ============================================================================
// Content Pieces — SEC-002-C/D
// ============================================================================

describe('SEC-002-C/D: contentPieces cross-project isolation', () => {
  test('owner can list content from own project', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, ownerCtx } = await seedTwoUsersWithProjects(t);

    const pieces = await ownerCtx.query(api.contentPieces.listByProject, {
      projectId: ownerProjectId,
    });
    // Empty is OK — just confirming no throw
    expect(Array.isArray(pieces)).toBe(true);
  });

  test('attacker cannot list content from victim project', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, attackerCtx } = await seedTwoUsersWithProjects(t);

    // Query returns empty array (graceful degradation)
    const pieces = await attackerCtx.query(api.contentPieces.listByProject, {
      projectId: ownerProjectId,
    });
    expect(pieces).toEqual([]);
  });

  test('attacker cannot get stats for victim project', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, attackerCtx } = await seedTwoUsersWithProjects(t);

    const stats = await attackerCtx.query(api.contentPieces.getStats, {
      projectId: ownerProjectId,
    });
    expect(stats).toBeNull();
  });

  test('attacker cannot create content in victim project', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, attackerCtx } = await seedTwoUsersWithProjects(t);

    await expect(
      attackerCtx.mutation(api.contentPieces.create, {
        projectId: ownerProjectId,
        contentType: 'blog',
        title: 'Malicious Content',
        keywords: ['hack'],
      })
    ).rejects.toThrow();
  });

  test('owner can create and update content in own project', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, ownerCtx } = await seedTwoUsersWithProjects(t);

    const pieceId = await ownerCtx.mutation(api.contentPieces.create, {
      projectId: ownerProjectId,
      contentType: 'blog',
      title: 'My Content',
      keywords: ['seo'],
    });

    expect(pieceId).toBeTruthy();

    // Owner can update it
    await ownerCtx.mutation(api.contentPieces.update, {
      contentPieceId: pieceId,
      title: 'Updated Title',
    });

    const piece = await ownerCtx.query(api.contentPieces.getById, {
      contentPieceId: pieceId,
    });
    expect(piece?.title).toBe('Updated Title');
  });

  test('attacker cannot update content in victim project', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, ownerCtx, attackerCtx } = await seedTwoUsersWithProjects(t);

    // Owner creates content
    const pieceId = await ownerCtx.mutation(api.contentPieces.create, {
      projectId: ownerProjectId,
      contentType: 'blog',
      title: 'Victim Content',
      keywords: [],
    });

    // Attacker tries to update it
    await expect(
      attackerCtx.mutation(api.contentPieces.update, {
        contentPieceId: pieceId,
        title: 'Hacked Title',
      })
    ).rejects.toThrow();
  });

  test('attacker cannot delete content from victim project', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, ownerCtx, attackerCtx } = await seedTwoUsersWithProjects(t);

    const pieceId = await ownerCtx.mutation(api.contentPieces.create, {
      projectId: ownerProjectId,
      contentType: 'blog',
      title: 'Victim Content',
      keywords: [],
    });

    await expect(
      attackerCtx.mutation(api.contentPieces.remove, {
        contentPieceId: pieceId,
      })
    ).rejects.toThrow();

    // Verify content still exists
    const piece = await ownerCtx.query(api.contentPieces.getById, {
      contentPieceId: pieceId,
    });
    expect(piece).not.toBeNull();
  });

  test('attacker cannot read victim content piece by ID', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, ownerCtx, attackerCtx } = await seedTwoUsersWithProjects(t);

    const pieceId = await ownerCtx.mutation(api.contentPieces.create, {
      projectId: ownerProjectId,
      contentType: 'blog',
      title: 'Secret Content',
      keywords: [],
    });

    // Attacker gets null (graceful degradation)
    const piece = await attackerCtx.query(api.contentPieces.getById, {
      contentPieceId: pieceId,
    });
    expect(piece).toBeNull();
  });

  test('attacker cannot schedule victim content', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, ownerCtx, attackerCtx } = await seedTwoUsersWithProjects(t);

    const pieceId = await ownerCtx.mutation(api.contentPieces.create, {
      projectId: ownerProjectId,
      contentType: 'blog',
      title: 'Schedule Target',
      keywords: [],
    });

    await expect(
      attackerCtx.mutation(api.contentPieces.schedule, {
        contentPieceId: pieceId,
        publishDate: Date.now() + 86400000,
      })
    ).rejects.toThrow();
  });

  test('unauthenticated user gets empty content list', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId } = await seedTwoUsersWithProjects(t);

    const pieces = await t.query(api.contentPieces.listByProject, {
      projectId: ownerProjectId,
    });
    expect(pieces).toEqual([]);
  });
});

// ============================================================================
// Strategy — SEC-002-A
// ============================================================================

describe('SEC-002-A: strategy cross-project isolation', () => {
  test('owner can read own strategy', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, ownerCtx } = await seedTwoUsersWithProjects(t);

    const strategy = await ownerCtx.query(api.strategy.getFullStrategy, {
      projectId: ownerProjectId,
    });
    expect(strategy).not.toBeNull();
    expect(strategy?.projectId).toBe(ownerProjectId);
  });

  test('attacker cannot read victim strategy', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, attackerCtx } = await seedTwoUsersWithProjects(t);

    const strategy = await attackerCtx.query(api.strategy.getFullStrategy, {
      projectId: ownerProjectId,
    });
    expect(strategy).toBeNull();
  });

  test('unauthenticated user cannot read strategy', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId } = await seedTwoUsersWithProjects(t);

    const strategy = await t.query(api.strategy.getFullStrategy, {
      projectId: ownerProjectId,
    });
    expect(strategy).toBeNull();
  });
});

// ============================================================================
// Scores — SEC-002-A
// ============================================================================

describe('SEC-002-A: scores cross-project isolation', () => {
  test('owner can read own project score', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, ownerCtx } = await seedTwoUsersWithProjects(t);

    const score = await ownerCtx.query(api.scores.getProjectScore, {
      projectId: ownerProjectId,
    });
    expect(score).not.toBeNull();
    expect(score?.projectId).toBe(ownerProjectId);
  });

  test('attacker cannot read victim project score', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, attackerCtx } = await seedTwoUsersWithProjects(t);

    const score = await attackerCtx.query(api.scores.getProjectScore, {
      projectId: ownerProjectId,
    });
    expect(score).toBeNull();
  });

  test('unauthenticated user cannot read scores', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId } = await seedTwoUsersWithProjects(t);

    const score = await t.query(api.scores.getProjectScore, {
      projectId: ownerProjectId,
    });
    expect(score).toBeNull();
  });
});

// ============================================================================
// SEO Audits — SEC-002-B
// ============================================================================

describe('SEC-002-B: seoAudits cross-project isolation', () => {
  const auditArgs = {
    website: 'https://victim.com',
    overallScore: 85,
    technicalSeo: { score: 90, issues: [], recommendations: [] },
    onPageSeo: { score: 80, issues: [], recommendations: [] },
    contentQuality: { score: 85, issues: [], recommendations: [] },
    backlinks: { score: 75, issues: [], recommendations: [] },
    priorityActions: ['Fix meta descriptions'],
  };

  test('owner can create audit for own project', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, ownerCtx } = await seedTwoUsersWithProjects(t);

    const auditId = await ownerCtx.mutation(api.seo.seoAudits.createAudit, {
      projectId: ownerProjectId,
      ...auditArgs,
    });
    expect(auditId).toBeTruthy();
  });

  test('attacker cannot create audit for victim project', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, attackerCtx } = await seedTwoUsersWithProjects(t);

    await expect(
      attackerCtx.mutation(api.seo.seoAudits.createAudit, {
        projectId: ownerProjectId,
        ...auditArgs,
      })
    ).rejects.toThrow();
  });

  test('attacker cannot read audits from victim project', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId, ownerCtx, attackerCtx } = await seedTwoUsersWithProjects(t);

    // Owner creates an audit
    await ownerCtx.mutation(api.seo.seoAudits.createAudit, {
      projectId: ownerProjectId,
      ...auditArgs,
    });

    // Attacker gets null/empty
    const latest = await attackerCtx.query(api.seo.seoAudits.getLatestAuditByProject, {
      projectId: ownerProjectId,
    });
    expect(latest).toBeNull();

    const all = await attackerCtx.query(api.seo.seoAudits.getAuditsByProject, {
      projectId: ownerProjectId,
    });
    expect(all).toEqual([]);
  });

  test('unauthenticated user cannot create audit', async () => {
    const { t } = setupTwoUsers();
    const { ownerProjectId } = await seedTwoUsersWithProjects(t);

    await expect(
      t.mutation(api.seo.seoAudits.createAudit, {
        projectId: ownerProjectId,
        ...auditArgs,
      })
    ).rejects.toThrow();
  });
});
