import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('SEO Audits', () => {
  it('should create an SEO audit for a project and retrieve it', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    const authT = t.withIdentity({ subject: userId });

    // 1. Create the Audit
    const auditId = await authT.mutation(api.seo.seoAudits.createAudit, {
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
    const latest = await authT.query(api.seo.seoAudits.getLatestAuditByProject, { projectId });
    expect(latest).not.toBeNull();
    expect(latest?.overallScore).toBe(85);
    expect(latest?.onPageSeo.issues).toContain('Missing H1');
  });
});
