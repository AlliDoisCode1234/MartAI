/**
 * AI Writer Personas Module
 *
 * Per-project AI content writers that learn brand voice over time.
 *
 * Component Hierarchy:
 * convex/ai/writerPersonas/
 * ├── index.ts (this file) - Core CRUD and queries
 * ├── learning.ts - Feedback processing and evolution
 * └── prompts.ts - Prompt injection utilities
 *
 * Usage:
 * 1. getOrCreatePersona(projectId) - Auto-creates on first content generation
 * 2. injectPersonaContext(prompt, persona) - Enhances prompts with learned rules
 * 3. recordFeedback(personaId, contentId, feedback) - Learns from user actions
 */

import { v } from 'convex/values';
import { mutation, query, internalMutation } from '../../_generated/server';
import { Id } from '../../_generated/dataModel';

// Default persona settings for new projects
const DEFAULT_PERSONA = {
  name: 'Content Expert',
  description: 'AI-powered content writer that learns your brand voice',
  brandVoice: {
    tone: 'professional',
    style: 'educational',
    vocabulary: [],
    avoidWords: [],
    sentenceStyle: 'varied',
  },
  seoPreferences: {
    keywordDensity: 'moderate',
    internalLinkingStyle: 'moderate',
    ctaStyle: 'direct',
    preferredContentLength: 'standard',
  },
  metrics: {
    totalGenerated: 0,
    approvedCount: 0,
    editedCount: 0,
    rejectedCount: 0,
  },
};

// Tier limits for personas per project
const PERSONA_LIMITS: Record<string, number> = {
  free: 1,
  solo: 1,
  starter: 1,
  growth: 3,
  pro: 3,
  enterprise: 999,
};

/**
 * Get or create the default persona for a project.
 * Auto-creates on first call for seamless UX.
 */
export const getOrCreatePersona = mutation({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    // Check for existing active persona
    const existing = await ctx.db
      .query('aiWriterPersonas')
      .withIndex('by_project_status', (q) =>
        q.eq('projectId', args.projectId).eq('status', 'active')
      )
      .first();

    if (existing) {
      return existing;
    }

    // Get project for industry context
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error('Project not found');

    // Get user for creator reference
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity.email))
      .first();

    // Create new persona
    const now = Date.now();
    const personaId = await ctx.db.insert('aiWriterPersonas', {
      projectId: args.projectId,
      createdBy: user?._id,
      name: DEFAULT_PERSONA.name,
      description: DEFAULT_PERSONA.description,
      brandVoice: DEFAULT_PERSONA.brandVoice,
      seoPreferences: DEFAULT_PERSONA.seoPreferences,
      metrics: DEFAULT_PERSONA.metrics,
      industry: project.industry,
      targetAudience: project.targetAudience,
      status: 'training',
      trainingProgress: 0,
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(personaId);
  },
});

/**
 * Internal: Get or create persona for internal/background flows
 */
export const getOrCreatePersonaInternal = internalMutation({
  args: {
    projectId: v.id('projects'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Check for existing active persona
    const existing = await ctx.db
      .query('aiWriterPersonas')
      .withIndex('by_project_status', (q) =>
        q.eq('projectId', args.projectId).eq('status', 'active')
      )
      .first();

    if (existing) {
      return existing;
    }

    // Get project for industry context
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error('Project not found');

    // Create new persona
    const now = Date.now();
    const personaId = await ctx.db.insert('aiWriterPersonas', {
      projectId: args.projectId,
      createdBy: args.userId,
      name: DEFAULT_PERSONA.name,
      description: DEFAULT_PERSONA.description,
      brandVoice: DEFAULT_PERSONA.brandVoice,
      seoPreferences: DEFAULT_PERSONA.seoPreferences,
      metrics: DEFAULT_PERSONA.metrics,
      industry: project.industry,
      targetAudience: project.targetAudience,
      status: 'training',
      trainingProgress: 0,
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(personaId);
  },
});

/**
 * Get active persona for a project (read-only).
 */
export const getActivePersona = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query('aiWriterPersonas')
      .withIndex('by_project_status', (q) =>
        q.eq('projectId', args.projectId).eq('status', 'active')
      )
      .first();
  },
});

/**
 * Get all personas for a project.
 */
export const getProjectPersonas = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query('aiWriterPersonas')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

/**
 * Update persona settings.
 */
export const updatePersona = mutation({
  args: {
    personaId: v.id('aiWriterPersonas'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    brandVoice: v.optional(
      v.object({
        tone: v.optional(v.string()),
        style: v.optional(v.string()),
        vocabulary: v.optional(v.array(v.string())),
        avoidWords: v.optional(v.array(v.string())),
        sentenceStyle: v.optional(v.string()),
      })
    ),
    industry: v.optional(v.string()),
    targetAudience: v.optional(v.string()),
    competitorContext: v.optional(v.string()),
    uniqueSellingPoints: v.optional(v.array(v.string())),
    seoPreferences: v.optional(
      v.object({
        keywordDensity: v.optional(v.string()),
        internalLinkingStyle: v.optional(v.string()),
        ctaStyle: v.optional(v.string()),
        preferredContentLength: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const persona = await ctx.db.get(args.personaId);
    if (!persona) throw new Error('Persona not found');

    const { personaId, ...updates } = args;
    await ctx.db.patch(personaId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(personaId);
  },
});

/**
 * Add an explicit rule to a persona.
 */
export const addLearnedRule = mutation({
  args: {
    personaId: v.id('aiWriterPersonas'),
    rule: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const persona = await ctx.db.get(args.personaId);
    if (!persona) throw new Error('Persona not found');

    const existingRules = persona.learnedRules || [];
    const newRule = {
      rule: args.rule,
      source: 'explicit' as const,
      confidence: 1.0,
      learnedAt: Date.now(),
      appliedCount: 0,
    };

    await ctx.db.patch(args.personaId, {
      learnedRules: [...existingRules, newRule],
      updatedAt: Date.now(),
    });
  },
});

/**
 * Remove a learned rule.
 */
export const removeLearnedRule = mutation({
  args: {
    personaId: v.id('aiWriterPersonas'),
    ruleIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const persona = await ctx.db.get(args.personaId);
    if (!persona) throw new Error('Persona not found');

    const existingRules = persona.learnedRules || [];
    const updatedRules = existingRules.filter((_, idx) => idx !== args.ruleIndex);

    await ctx.db.patch(args.personaId, {
      learnedRules: updatedRules,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Archive a persona.
 */
export const archivePersona = mutation({
  args: {
    personaId: v.id('aiWriterPersonas'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    await ctx.db.patch(args.personaId, {
      status: 'archived',
      updatedAt: Date.now(),
    });
  },
});

/**
 * Internal: Update persona metrics after content generation.
 */
export const updateMetrics = internalMutation({
  args: {
    personaId: v.id('aiWriterPersonas'),
    outcome: v.union(v.literal('approved'), v.literal('edited'), v.literal('rejected')),
    seoScore: v.optional(v.number()),
    editDistance: v.optional(v.number()),
    contentType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const persona = await ctx.db.get(args.personaId);
    if (!persona) return;

    const metrics = persona.metrics || {
      totalGenerated: 0,
      approvedCount: 0,
      editedCount: 0,
      rejectedCount: 0,
    };

    // Update counts
    metrics.totalGenerated += 1;
    if (args.outcome === 'approved') metrics.approvedCount += 1;
    if (args.outcome === 'edited') metrics.editedCount += 1;
    if (args.outcome === 'rejected') metrics.rejectedCount += 1;

    // Update averages
    if (args.seoScore !== undefined) {
      const currentAvg = metrics.avgSeoScore || 0;
      const count = metrics.totalGenerated;
      metrics.avgSeoScore = (currentAvg * (count - 1) + args.seoScore) / count;
    }

    if (args.editDistance !== undefined && args.outcome === 'edited') {
      const currentAvg = metrics.avgEditDistance || 0;
      const editCount = metrics.editedCount;
      metrics.avgEditDistance = (currentAvg * (editCount - 1) + args.editDistance) / editCount;
    }

    // Update training progress
    let trainingProgress = persona.trainingProgress || 0;
    let status = persona.status;
    if (metrics.totalGenerated >= 5 && status === 'training') {
      status = 'active';
      trainingProgress = 100;
    } else if (status === 'training') {
      trainingProgress = Math.min(100, (metrics.totalGenerated / 5) * 100);
    }

    await ctx.db.patch(args.personaId, {
      metrics,
      status,
      trainingProgress,
      lastUsedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

/**
 * Build persona context for prompt injection.
 * Returns a formatted string to prepend to AI prompts.
 */
export function buildPersonaContext(persona: {
  name: string;
  industry?: string;
  targetAudience?: string;
  brandVoice?: {
    tone?: string;
    style?: string;
    vocabulary?: string[];
    avoidWords?: string[];
    sentenceStyle?: string;
  };
  seoPreferences?: {
    keywordDensity?: string;
    internalLinkingStyle?: string;
    ctaStyle?: string;
    preferredContentLength?: string;
  };
  learnedRules?: { rule: string; confidence?: number }[];
  uniqueSellingPoints?: string[];
}): string {
  const sections: string[] = [];

  // Identity
  sections.push(`You are ${persona.name}, an expert content writer.`);

  // Industry context
  if (persona.industry) {
    sections.push(`\nINDUSTRY: ${persona.industry}`);
  }

  // Target audience
  if (persona.targetAudience) {
    sections.push(`TARGET AUDIENCE: ${persona.targetAudience}`);
  }

  // Brand voice
  if (persona.brandVoice) {
    const voice = persona.brandVoice;
    sections.push('\nBRAND VOICE:');
    if (voice.tone) sections.push(`- Tone: ${voice.tone}`);
    if (voice.style) sections.push(`- Style: ${voice.style}`);
    if (voice.sentenceStyle) sections.push(`- Sentence style: ${voice.sentenceStyle}`);
    if (voice.vocabulary?.length) {
      sections.push(`- Use terms like: ${voice.vocabulary.join(', ')}`);
    }
    if (voice.avoidWords?.length) {
      sections.push(`- AVOID: ${voice.avoidWords.join(', ')}`);
    }
  }

  // SEO preferences
  if (persona.seoPreferences) {
    const seo = persona.seoPreferences;
    sections.push('\nSEO PREFERENCES:');
    if (seo.keywordDensity) sections.push(`- Keyword density: ${seo.keywordDensity}`);
    if (seo.ctaStyle) sections.push(`- CTA style: ${seo.ctaStyle}`);
    if (seo.preferredContentLength) sections.push(`- Length: ${seo.preferredContentLength}`);
  }

  // USPs
  if (persona.uniqueSellingPoints?.length) {
    sections.push('\nKEY DIFFERENTIATORS TO EMPHASIZE:');
    persona.uniqueSellingPoints.forEach((usp) => sections.push(`- ${usp}`));
  }

  // Learned rules (high confidence only)
  const highConfidenceRules = persona.learnedRules?.filter((r) => (r.confidence ?? 1) >= 0.7) || [];
  if (highConfidenceRules.length > 0) {
    sections.push('\nLEARNED WRITING RULES (follow these strictly):');
    highConfidenceRules.forEach((r) => sections.push(`- ${r.rule}`));
  }

  return sections.join('\n');
}
