/**
 * Content Templates
 *
 * AI prompts and SEO checklists per page type.
 * Global templates (projectId: null) seed defaults.
 * Project templates override globals.
 */

import { mutation, query, internalMutation } from '../_generated/server';
import { v } from 'convex/values';

// Default SEO checklist from helps2
const DEFAULT_SEO_CHECKLIST = [
  { rule: 'wordCount', value: '750' },
  { rule: 'faqCount', value: '3' },
  { rule: 'mainKeywordCount', value: '4' },
  { rule: 'secondaryKeywordCount', value: '2' },
  { rule: 'internalLinks', value: '3' },
  { rule: 'keywordInFirst100Words', value: 'true' },
  { rule: 'metaDescriptionLength', value: '150-160' },
  { rule: 'imageAltText', value: 'true' },
];

// Get template by page type (project override or global default)
export const getTemplateByPageType = query({
  args: {
    projectId: v.optional(v.id('projects')),
    pageType: v.string(),
  },
  handler: async (ctx, args) => {
    // Try project-specific first
    if (args.projectId) {
      const projectTemplate = await ctx.db
        .query('contentTemplates')
        .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
        .filter((q) => q.eq(q.field('pageType'), args.pageType))
        .first();
      if (projectTemplate) return projectTemplate;
    }

    // Fall back to global default
    const globalTemplate = await ctx.db
      .query('contentTemplates')
      .withIndex('by_page_type', (q) => q.eq('pageType', args.pageType))
      .filter((q) => q.eq(q.field('projectId'), undefined))
      .first();

    return globalTemplate;
  },
});

// Get all templates for a project
export const getTemplatesByProject = query({
  args: {
    projectId: v.optional(v.id('projects')),
  },
  handler: async (ctx, args) => {
    if (args.projectId) {
      return await ctx.db
        .query('contentTemplates')
        .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
        .collect();
    }
    // Get global defaults
    return await ctx.db
      .query('contentTemplates')
      .withIndex('by_default', (q) => q.eq('isDefault', true))
      .collect();
  },
});

// Create or update template
export const upsertTemplate = mutation({
  args: {
    templateId: v.optional(v.id('contentTemplates')),
    projectId: v.optional(v.id('projects')),
    pageType: v.string(),
    name: v.string(),
    promptTemplate: v.string(),
    seoChecklist: v.optional(
      v.array(v.object({ rule: v.string(), value: v.optional(v.string()) }))
    ),
    wordCountTarget: v.optional(v.number()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    if (args.templateId) {
      await ctx.db.patch(args.templateId, {
        pageType: args.pageType,
        name: args.name,
        promptTemplate: args.promptTemplate,
        seoChecklist: args.seoChecklist,
        wordCountTarget: args.wordCountTarget,
        isDefault: args.isDefault,
        updatedAt: now,
      });
      return args.templateId;
    }

    return await ctx.db.insert('contentTemplates', {
      projectId: args.projectId,
      pageType: args.pageType,
      name: args.name,
      promptTemplate: args.promptTemplate,
      seoChecklist: args.seoChecklist,
      wordCountTarget: args.wordCountTarget,
      isDefault: args.isDefault,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Seed default templates (run once)
export const seedDefaultTemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query('contentTemplates')
      .withIndex('by_default', (q) => q.eq('isDefault', true))
      .first();

    if (existing) {
      console.log('Default templates already exist');
      return;
    }

    const now = Date.now();

    // Blog template
    await ctx.db.insert('contentTemplates', {
      projectId: undefined,
      pageType: 'blog',
      name: 'Blog Post Template',
      promptTemplate: `Write a {{wordCount}}-word blog post titled "{{title}}" for {{companyName}}.

Target keywords (use each multiple times naturally):
{{keywords}}

Requirements:
- Include 3 FAQ questions with clear answers
- Write a compelling meta description (150-160 characters)
- Use the main keyword in the first 100 words
- Include a strong call to action
- Use H2 and H3 subheadings
- Write for humans first, search engines second

Return JSON: { content, metaDescription, faqs: [{question, answer}], cta }`,
      seoChecklist: DEFAULT_SEO_CHECKLIST,
      wordCountTarget: 1200,
      isDefault: true,
      createdAt: now,
      updatedAt: now,
    });

    // Service page template
    await ctx.db.insert('contentTemplates', {
      projectId: undefined,
      pageType: 'service',
      name: 'Service Page Template',
      promptTemplate: `Optimize content for the {{pageType}} page on {{companyName}} website.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- 800-1200 words
- Include metadata
- Strong call to action
- Focus on benefits and outcomes

Current content to optimize:
{{existingContent}}

Return JSON: { content, metaDescription, cta }`,
      seoChecklist: DEFAULT_SEO_CHECKLIST,
      wordCountTarget: 1000,
      isDefault: true,
      createdAt: now,
      updatedAt: now,
    });

    // Homepage template
    await ctx.db.insert('contentTemplates', {
      projectId: undefined,
      pageType: 'homepage',
      name: 'Homepage Template',
      promptTemplate: `Optimize the homepage for {{companyName}}.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- 400-600 words
- Clear value proposition
- Main service offerings
- Trust signals and social proof
- Primary CTA

Return JSON: { content, metaDescription, cta }`,
      seoChecklist: [
        { rule: 'wordCount', value: '500' },
        { rule: 'mainKeywordCount', value: '3' },
      ],
      wordCountTarget: 500,
      isDefault: true,
      createdAt: now,
      updatedAt: now,
    });

    console.log('Seeded default content templates');
  },
});
