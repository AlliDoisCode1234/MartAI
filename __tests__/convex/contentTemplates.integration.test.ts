import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { api, internal } from '../../convex/_generated/api';

describe('Content Templates', () => {
  it('should seed and retrieve global templates', async () => {
    const t = createTestContext();

    await t.mutation(internal.content.contentTemplates.seedDefaultTemplates, {});
    const globals = await t.query(api.content.contentTemplates.getTemplatesByProject, {});
    expect(globals.length).toBeGreaterThan(0);

    const blogTemplate = await t.query(api.content.contentTemplates.getTemplateByPageType, {
      pageType: 'blog',
    });
    expect(blogTemplate).toBeDefined();
    expect(blogTemplate?.name).toBe('Blog Post Template');
  });

  it('should allow project specific template overrides', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    await t.mutation(api.content.contentTemplates.upsertTemplate, {
      projectId,
      pageType: 'blog',
      name: 'Custom Blog Post Template',
      promptTemplate: 'Write a custom blog post.',
    });

    const customTemplate = await t.query(api.content.contentTemplates.getTemplateByPageType, {
      projectId,
      pageType: 'blog',
    });
    expect(customTemplate).toBeDefined();
    expect(customTemplate?.name).toBe('Custom Blog Post Template');
  });
});
