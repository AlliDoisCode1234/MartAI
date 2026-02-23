import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('SEO Audits', () => {
  it('should create an SEO audit for a project and retrieve it', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    // 1. Create the Audit
    const auditId = await t.mutation(api.seo.seoAudits.createAudit, {
      projectId,
      website: 'https://test-project.com',
      overallScore: 85,
      technicalSeo: { score: 90, issues: [], recommendations: [] },
      onPageSeo: { score: 80, issues: ['Missing H1'], recommendations: ['Add H1'] },
      contentQuality: { score: 85, issues: [], recommendations: [] },
      backlinks: { score: 70, issues: [], recommendations: [] },
      priorityActions: ['Fix H1'],
      pageSpeed: 95,
      mobileFriendly: true,
      sslEnabled: true,
    });

    expect(auditId).toBeDefined();

    // 2. Retrieve Latest Audit by Project
    const latest = await t.query(api.seo.seoAudits.getLatestAuditByProject, { projectId });
    expect(latest).not.toBeNull();
    expect(latest?.overallScore).toBe(85);
    expect(latest?.onPageSeo.issues).toContain('Missing H1');
  });

  it('should enforce that either clientId or projectId must be provided', async () => {
    const t = createTestContext();

    await expect(
      t.mutation(api.seo.seoAudits.createAudit, {
        website: 'https://test-project.com',
        overallScore: 85,
        technicalSeo: { score: 90, issues: [], recommendations: [] },
        onPageSeo: { score: 80, issues: [], recommendations: [] },
        contentQuality: { score: 85, issues: [], recommendations: [] },
        backlinks: { score: 70, issues: [], recommendations: [] },
        priorityActions: [],
      })
    ).rejects.toThrow('Either clientId or projectId must be provided.');
  });

  it('should get latest audit and list of audits by clientId', async () => {
    const t = createTestContext();

    // Seed a generic client
    const userId = await seedUser(t);
    const clientId = await t.run(async (ctx) => {
      return await ctx.db.insert('clients', {
        companyName: 'Test Client',
        website: 'https://client.com',
        industry: 'Tech',
        targetAudience: 'Everyone',
        userId: userId, // Auth user ID
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    // Create First Audit
    await t.mutation(api.seo.seoAudits.createAudit, {
      clientId,
      website: 'https://client.com',
      overallScore: 40,
      technicalSeo: { score: 40, issues: [], recommendations: [] },
      onPageSeo: { score: 40, issues: [], recommendations: [] },
      contentQuality: { score: 40, issues: [], recommendations: [] },
      backlinks: { score: 40, issues: [], recommendations: [] },
      priorityActions: [],
    });

    // Create Second (Latest) Audit
    await t.mutation(api.seo.seoAudits.createAudit, {
      clientId,
      website: 'https://client.com',
      overallScore: 90,
      technicalSeo: { score: 90, issues: [], recommendations: [] },
      onPageSeo: { score: 90, issues: [], recommendations: [] },
      contentQuality: { score: 90, issues: [], recommendations: [] },
      backlinks: { score: 90, issues: [], recommendations: [] },
      priorityActions: [],
    });

    // Fetch Latest
    const latest = await t.query(api.seo.seoAudits.getLatestAudit, { clientId });
    expect(latest?.overallScore).toBe(90);

    // Fetch All
    const allAudits = await t.query(api.seo.seoAudits.getAuditsByClient, { clientId });
    expect(allAudits).toHaveLength(2);
    // Ordered by desc (createdAt)
    expect(allAudits[0].overallScore).toBe(90);
    expect(allAudits[1].overallScore).toBe(40);
  });
});
