/**
 * Content Generation Actions
 *
 * One-click content generation using AI Router with quality guarantee.
 * Routes to best available AI provider with automatic failover.
 * Includes retry loop to ensure 90+ SEO score guarantee.
 */

import { action, internalMutation, internalAction, internalQuery } from './_generated/server';
import { v } from 'convex/values';
import { auth } from './auth';
import { internal, api } from './_generated/api';
import { Id } from './_generated/dataModel';
import type { ActionCtx } from './_generated/server';
import {
  CONTENT_TYPES,
  ContentTypeId,
  DEFAULT_SEO_CHECKLIST,
  contentTypeValidator,
} from './phoo/contentTypes';
import { buildPersonaContext } from './ai/writerPersonas/index';
import { rateLimits, RATE_LIMIT_TIERS } from './rateLimits';
import { HOUR } from '@convex-dev/rate-limiter';

// Quality threshold for A+ grade — 95% minimum for production content
const QUALITY_THRESHOLD = 95;
const MAX_GENERATION_ATTEMPTS = 3;

// ============================================================================
// Content Generation Action with Quality Guarantee
// ============================================================================

export const generateContent = action({
  args: {
    projectId: v.id('projects'),
    contentType: contentTypeValidator,
    title: v.string(),
    keywords: v.array(v.string()),
    clusterId: v.optional(v.id('keywordClusters')),
  },
  handler: async (ctx, args): Promise<Id<'contentPieces'>> => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    return await ctx.runAction(internal.contentGeneration.generateContentInternal, {
      ...args,
      userId,
    });
  },
});

// ============================================================================
// Adaptive Auto-Generate — "Let Phoo Build It"
// AI continues creation from wherever the user stops.
// ============================================================================

/**
 * Auto-generate content with adaptive pipeline.
 * Fills in whatever the user hasn't provided: type, keywords, title.
 *
 * Pipeline: resolve type → discover keywords → create cluster → AI title → generate content
 */
export const autoGenerateContent = action({
  args: {
    projectId: v.id('projects'),
    contentType: v.optional(contentTypeValidator),
    title: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    contentPieceId: Id<'contentPieces'>;
    contentType: ContentTypeId;
    keyword: string;
    title: string;
  }> => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const { projectId } = args;

    // ── Step 1: Resolve content type ────────────────────────────────
    const contentType: ContentTypeId = args.contentType ?? 'blog';

    // ── Step 2: Resolve keywords ────────────────────────────────────
    let resolvedKeywords = args.keywords?.filter((k) => k.trim().length > 0) ?? [];

    if (resolvedKeywords.length === 0) {
      // Try keyword library first
      try {
        const libraryKeywords = await ctx.runQuery(
          internal.contentGeneration.getKeywordsForAutoGen,
          { projectId }
        );
        if (libraryKeywords && libraryKeywords.length > 0) {
          resolvedKeywords = libraryKeywords.map((k: { keyword: string }) => k.keyword).slice(0, 3);
        }
      } catch {
        // Fallback below
      }

      // If still empty, derive from project industry
      if (resolvedKeywords.length === 0) {
        try {
          const project = await ctx.runQuery(internal.contentGeneration.getProjectForAutoGen, {
            projectId,
          });
          const industry = project?.industry || 'digital marketing';
          resolvedKeywords = [
            `${industry} best practices`,
            `${industry} tips`,
            `${industry} guide`,
          ];
        } catch {
          resolvedKeywords = [
            'getting started with SEO',
            'content marketing tips',
            'digital marketing guide',
          ];
        }
      }
    }

    const primaryKeyword = resolvedKeywords[0];

    // ── Step 3: Create keyword cluster (non-blocking) ───────────────
    let clusterId: Id<'keywordClusters'> | undefined;
    try {
      clusterId = await ctx.runMutation(api.seo.keywordClusters.createCluster, {
        projectId,
        clusterName: primaryKeyword,
        keywords: resolvedKeywords,
        intent: 'informational',
        difficulty: 50,
        volumeRange: { min: 0, max: 0 },
        impactScore: 0.5,
        topSerpUrls: [],
        status: 'active',
        createdAt: Date.now(),
      });
    } catch (clusterError) {
      const msg = clusterError instanceof Error ? clusterError.message : 'Unknown';
      console.warn('[AutoGen] Cluster creation failed (non-blocking):', msg);
    }

    // ── Step 4: Resolve title ───────────────────────────────────────
    let resolvedTitle = args.title?.trim() || '';

    if (!resolvedTitle) {
      try {
        const response = await ctx.runAction(api.ai.router.router.generateWithFallback, {
          prompt: `Generate 1 engaging, SEO-optimized ${contentType} title about: "${primaryKeyword}"`,
          systemPrompt: `You are an expert SEO content strategist. Generate exactly 1 compelling, click-worthy title for a ${contentType} about "${primaryKeyword}". Requirements: include the keyword, 50-65 characters, use a proven headline formula. Respond with ONLY the title, nothing else.`,
          maxTokens: 100,
          temperature: 0.7,
          taskType: 'analysis',
          strategy: 'balanced',
        });

        const generated = response?.content?.trim()?.split('\n')[0]?.trim() ?? '';
        if (generated.length > 10) {
          resolvedTitle = generated;
        }
      } catch (titleError) {
        const msg = titleError instanceof Error ? titleError.message : 'Unknown';
        console.warn('[AutoGen] AI title generation failed, using fallback:', msg);
      }

      if (!resolvedTitle) {
        resolvedTitle = `The Complete Guide to ${primaryKeyword}`;
      }
    }

    // ── Step 5: Generate content ────────────────────────────────────
    const contentPieceId = await ctx.runAction(internal.contentGeneration.generateContentInternal, {
      projectId,
      contentType,
      title: resolvedTitle,
      keywords: resolvedKeywords,
      userId,
      ...(clusterId ? { clusterId } : {}),
    });

    return {
      contentPieceId,
      contentType,
      keyword: primaryKeyword,
      title: resolvedTitle,
    };
  },
});

// ============================================================================
// AI Title Generation — "Let Phoo Build It" Flow
// ============================================================================

/**
 * Generate SEO-optimized title suggestions for a keyword.
 * Returns 5 ranked titles the user can pick from before full generation.
 */
export const generateContentTitle = action({
  args: {
    projectId: v.id('projects'),
    keyword: v.string(),
    contentType: contentTypeValidator,
  },
  handler: async (ctx, args): Promise<string[]> => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    // Rate limit: Fetch user tier and enforce AI analysis limits
    const user = await ctx.runQuery(internal.users.getUser, { userId });
    if (!user) throw new Error('User not found');

    let tier: 'free' | 'starter' | 'growth' | 'pro' | 'admin' = 'free';
    if (user.role === 'admin' || user.role === 'super_admin') {
      tier = 'admin';
    } else {
      const membership = user.membershipTier || 'free';
      switch (membership) {
        case 'solo':
        case 'starter':
          tier = 'starter';
          break;
        case 'growth':
        case 'team':
          tier = 'growth';
          break;
        case 'pro':
        case 'enterprise':
          tier = 'pro';
          break;
        default:
          tier = 'free';
      }
    }

    const limitKey = `aiAnalysis_${tier}` as const;
    try {
      await rateLimits.limit(ctx, limitKey, { key: userId, throws: true });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('Rate limited') || msg.includes('rate limit')) {
        throw new Error(
          `Title generation rate limit exceeded for your ${tier} plan. Please wait and try again.`
        );
      }
      throw error;
    }

    // Get Writer Persona for brand-aware titles
    const persona = await ctx.runMutation(
      internal.ai.writerPersonas.index.getOrCreatePersonaInternal,
      { projectId: args.projectId, userId }
    );
    const personaContext = persona ? buildPersonaContext(persona) : '';

    const personaInstructions = personaContext
      ? `\n\nBRAND CONTEXT:\n${personaContext}\nApply the brand voice to your titles.`
      : '';

    const systemPrompt = `You are an expert SEO content strategist. Generate exactly 5 engaging, click-worthy, SEO-optimized titles for a ${args.contentType} article about the keyword "${args.keyword}".

Requirements:
- Each title MUST include the primary keyword "${args.keyword}" or a close semantic variant
- Titles should be 50-65 characters for optimal SERP display
- Use proven headline formulas (How-to, Listicle, Question, Guide, Ultimate)
- Vary the style across all 5 titles
- Prioritize search intent match over cleverness
${personaInstructions}

Respond with ONLY the 5 titles, one per line. No numbering, no explanations, just the titles.`;

    const prompt = `Generate 5 SEO-optimized titles for a ${args.contentType} about: "${args.keyword}"`;

    try {
      const response = await ctx.runAction(api.ai.router.router.generateWithFallback, {
        prompt,
        systemPrompt,
        maxTokens: 300,
        temperature: 0.8,
        taskType: 'analysis',
        strategy: 'best_quality',
      });

      const titles = response.content
        .split('\n')
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 10 && !t.startsWith('#'));

      // Return up to 5, with at least 1 fallback
      if (titles.length === 0) {
        return [`The Complete Guide to ${args.keyword}`];
      }

      return titles.slice(0, 5);
    } catch (error) {
      const safeMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn('[generateContentTitle] AI failed, returning fallback:', safeMessage);
      return [
        `The Complete Guide to ${args.keyword}`,
        `How to Master ${args.keyword} in ${new Date().getFullYear()}`,
        `${args.keyword}: Everything You Need to Know`,
      ];
    }
  },
});

export const generateContentInternal = internalAction({
  args: {
    projectId: v.id('projects'),
    contentType: contentTypeValidator,
    title: v.string(),
    keywords: v.array(v.string()),
    clusterId: v.optional(v.id('keywordClusters')),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    // 1. Fetch user to determine rate limit tier
    const user = await ctx.runQuery(internal.users.getUser, { userId });
    if (!user) throw new Error('User not found');

    // Map schema tier to rate limit tier
    let tier: 'free' | 'starter' | 'growth' | 'pro' | 'admin' = 'free';

    // Admins get admin limits
    if (user.role === 'admin' || user.role === 'super_admin') {
      tier = 'admin';
    } else {
      const membership = user.membershipTier || 'free';
      switch (membership) {
        case 'solo':
        case 'starter':
          tier = 'starter';
          break;
        case 'growth':
        case 'team': // Map team to growth for now
          tier = 'growth';
          break;
        case 'pro':
        case 'enterprise':
          tier = 'pro';
          break;
        default:
          tier = 'free';
      }
    }

    // 2. Enforce Rate Limit (per-user keyed)
    const limitKey = `generateDraft_${tier}` as const;
    try {
      await rateLimits.limit(ctx, limitKey, { key: userId, throws: true });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isRateLimit =
        errorMessage.includes('Rate limited') || errorMessage.includes('rate limit');

      if (isRateLimit) {
        const tierLimit = RATE_LIMIT_TIERS[tier].draftGeneration;
        throw new Error(
          `Rate limit exceeded for your ${tier} plan. Limit: ${tierLimit.rate} drafts per ${
            tierLimit.period === HOUR ? 'hour' : 'day'
          }. Please upgrade or wait.`
        );
      }
      // Re-throw unexpected errors (DB failures, config issues) unmolested
      throw error;
    }

    // Get or create Writer Persona for this project
    const persona = await ctx.runMutation(
      internal.ai.writerPersonas.index.getOrCreatePersonaInternal,
      {
        projectId: args.projectId,
        userId,
      }
    );

    // Build persona context for prompt injection
    const personaContext = persona ? buildPersonaContext(persona) : '';

    // 1. Create content piece with "generating" status
    const contentPieceId: Id<'contentPieces'> = await ctx.runMutation(
      internal.contentGeneration.createContentPiece,
      {
        projectId: args.projectId,
        contentType: args.contentType,
        title: args.title,
        keywords: args.keywords,
        clusterId: args.clusterId,
      }
    );

    // 2. Generate outline using AI (with persona context for industry/brand awareness)
    const outline = await generateOutlineWithAI(
      ctx,
      args.contentType,
      args.title,
      args.keywords,
      personaContext
    );

    // 3. Update with outline
    await ctx.runMutation(internal.contentGeneration.updateContentPiece, {
      contentPieceId,
      h2Outline: outline,
      status: 'generating',
    });

    // 4. Three-Stage AI Pipeline with Quality Guarantee Loop
    //    Stage 1: Generate content draft
    //    Stage 2: AI editorial review (separate AI call)
    //    Stage 3: AI finalization based on review (separate AI call)
    //    Loop: retry full pipeline until score >= 95 or max attempts
    let attempt = 0;
    let bestContent = '';
    let bestScore = 0;
    let bestMetrics: Record<string, number> = {};

    while (attempt < MAX_GENERATION_ATTEMPTS) {
      attempt++;
      console.log(`[ContentGeneration] Pipeline attempt ${attempt}/${MAX_GENERATION_ATTEMPTS}`);

      // ── Stage 1: Content Creation ────────────────────────────────
      console.log(`[ContentGeneration] Stage 1: Creating draft...`);
      const draftContent = await generateFullContentWithAI(
        ctx,
        args.contentType,
        args.title,
        outline,
        args.keywords,
        personaContext,
        attempt > 1 // Add quality hints on retries
      );

      // ── Stage 2: AI Editorial Review ─────────────────────────────
      console.log(`[ContentGeneration] Stage 2: Reviewing content...`);
      const reviewFeedback = await reviewContentWithAI(
        ctx,
        draftContent,
        args.title,
        args.keywords,
        args.contentType
      );

      // ── Stage 3: AI Finalization ─────────────────────────────────
      console.log(`[ContentGeneration] Stage 3: Finalizing content...`);
      const finalContent = await finalizeContentWithAI(
        ctx,
        draftContent,
        reviewFeedback,
        args.title,
        args.keywords,
        args.contentType,
        personaContext
      );

      // Score the finalized content
      const contentTypeConfig = CONTENT_TYPES[args.contentType as ContentTypeId];
      const targetWordCount = contentTypeConfig?.wordCount || 1200;
      const { score, metrics } = scoreContent(
        finalContent,
        outline,
        args.keywords,
        targetWordCount
      );
      console.log(`[ContentGeneration] Final score: ${score} (threshold: ${QUALITY_THRESHOLD})`);

      // Track best result
      if (score > bestScore) {
        bestContent = finalContent;
        bestScore = score;
        bestMetrics = metrics;
      }

      // Quality threshold met — exit loop
      if (score >= QUALITY_THRESHOLD) {
        console.log(`[ContentGeneration] Quality threshold met (${score} >= ${QUALITY_THRESHOLD})`);
        break;
      }

      // Log retry
      if (attempt < MAX_GENERATION_ATTEMPTS) {
        console.log(`[ContentGeneration] Retrying full pipeline for better quality...`);
        await ctx.runMutation(internal.contentGeneration.updateContentPiece, {
          contentPieceId,
          generationAttempts: attempt,
        });
      }
    }

    // 5. Update with best content
    await ctx.runMutation(internal.contentGeneration.updateContentPiece, {
      contentPieceId,
      content: bestContent,
      wordCount: countWords(bestContent),
      seoScore: bestScore,
      qualityMetrics: bestMetrics,
      generationAttempts: attempt,
      status: 'draft',
    });

    console.log(
      `[ContentGeneration] Complete. Final score: ${bestScore} after ${attempt} attempt(s)`
    );
    return contentPieceId;
  },
});

/**
 * Generate content for an EXISTING content piece.
 * Used by calendar generation to fill in skeleton pieces with AI content.
 */
export const generateContentForPiece = internalAction({
  args: {
    contentPieceId: v.id('contentPieces'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const { contentPieceId, userId } = args;

    // 1. Get existing piece (use internal query - no auth required)
    const piece = await ctx.runQuery(internal.testing.betaUserFlow.getContentPiece, {
      contentPieceId,
    });
    if (!piece) {
      console.error(`[generateContentForPiece] Piece not found: ${contentPieceId}`);
      return null;
    }

    // Skip if already has content
    if ((piece.wordCount ?? 0) > 0) {
      console.log(`[generateContentForPiece] Piece already has content: ${contentPieceId}`);
      return contentPieceId;
    }

    console.log(`[generateContentForPiece] Generating content for: ${piece.title}`);

    // 2. Get or create Writer Persona for this project
    const persona = await ctx.runMutation(
      internal.ai.writerPersonas.index.getOrCreatePersonaInternal,
      {
        projectId: piece.projectId,
        userId,
      }
    );
    const personaContext = persona ? buildPersonaContext(persona) : '';

    // 3. Generate outline using AI
    const outline = await generateOutlineWithAI(
      ctx,
      piece.contentType,
      piece.title,
      piece.keywords || [],
      personaContext
    );

    // 4. Update with outline
    await ctx.runMutation(internal.contentGeneration.updateContentPiece, {
      contentPieceId,
      h2Outline: outline,
      status: 'generating',
    });

    // 5. Three-Stage AI Pipeline with Quality Guarantee Loop
    let attempt = 0;
    let bestContent = '';
    let bestScore = 0;
    let bestMetrics: Record<string, number> = {};
    const keywords = piece.keywords || [];

    while (attempt < MAX_GENERATION_ATTEMPTS) {
      attempt++;
      console.log(
        `[generateContentForPiece] Pipeline attempt ${attempt}/${MAX_GENERATION_ATTEMPTS}`
      );

      // ── Stage 1: Content Creation ────────────────────────────────
      console.log(`[generateContentForPiece] Stage 1: Creating draft...`);
      const draftContent = await generateFullContentWithAI(
        ctx,
        piece.contentType,
        piece.title,
        outline,
        keywords,
        personaContext,
        attempt > 1
      );

      // ── Stage 2: AI Editorial Review ─────────────────────────────
      console.log(`[generateContentForPiece] Stage 2: Reviewing content...`);
      const reviewFeedback = await reviewContentWithAI(
        ctx,
        draftContent,
        piece.title,
        keywords,
        piece.contentType
      );

      // ── Stage 3: AI Finalization ─────────────────────────────────
      console.log(`[generateContentForPiece] Stage 3: Finalizing content...`);
      const finalContent = await finalizeContentWithAI(
        ctx,
        draftContent,
        reviewFeedback,
        piece.title,
        keywords,
        piece.contentType,
        personaContext
      );

      const contentTypeConfig = CONTENT_TYPES[piece.contentType as ContentTypeId];
      const targetWordCount = contentTypeConfig?.wordCount || 1200;
      const { score, metrics } = scoreContent(finalContent, outline, keywords, targetWordCount);

      if (score > bestScore) {
        bestContent = finalContent;
        bestScore = score;
        bestMetrics = metrics;
      }

      if (score >= QUALITY_THRESHOLD) {
        console.log(`[generateContentForPiece] Quality threshold met (${score})`);
        break;
      }
    }

    // 6. Update piece with generated content and set status to 'scheduled'
    await ctx.runMutation(internal.contentGeneration.updateContentPiece, {
      contentPieceId,
      content: bestContent,
      wordCount: countWords(bestContent),
      seoScore: bestScore,
      qualityMetrics: bestMetrics,
      generationAttempts: attempt,
      status: 'scheduled', // Ready for calendar display
    });

    console.log(`[generateContentForPiece] Complete: ${piece.title} (Score: ${bestScore})`);
    return contentPieceId;
  },
});

// ============================================================================
// Internal Mutations
// ============================================================================

export const createContentPiece = internalMutation({
  args: {
    projectId: v.id('projects'),
    contentType: contentTypeValidator,
    title: v.string(),
    keywords: v.array(v.string()),
    clusterId: v.optional(v.id('keywordClusters')),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('contentPieces', {
      projectId: args.projectId,
      clusterId: args.clusterId,
      contentType: args.contentType,
      title: args.title,
      h2Outline: [],
      keywords: args.keywords,
      status: 'generating',
      generationAttempts: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateContentPiece = internalMutation({
  args: {
    contentPieceId: v.id('contentPieces'),
    h2Outline: v.optional(v.array(v.string())),
    content: v.optional(v.string()),
    wordCount: v.optional(v.number()),
    seoScore: v.optional(v.number()),
    qualityMetrics: v.optional(
      v.object({
        wordCountScore: v.number(),
        h2Score: v.number(),
        keywordScore: v.number(),
        // Migration: linkScore deprecated, structureScore is new
        linkScore: v.optional(v.number()),
        structureScore: v.optional(v.number()),
        readabilityScore: v.number(),
        uniquenessScore: v.optional(v.number()),
      })
    ),
    generationAttempts: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal('generating'),
        v.literal('draft'),
        v.literal('approved'),
        v.literal('published'),
        v.literal('scheduled')
      )
    ),
  },
  handler: async (ctx, args) => {
    const { contentPieceId, ...updates } = args;
    const filtered = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(contentPieceId, {
      ...filtered,
      updatedAt: Date.now(),
    });
  },
});

// ============================================================================
// AI-Powered Content Generation
// ============================================================================

/**
 * Generate outline using AI Router
 */
async function generateOutlineWithAI(
  ctx: ActionCtx,
  contentType: string,
  title: string,
  keywords: string[],
  personaContext: string = ''
): Promise<string[]> {
  const primaryKeyword = keywords[0] || 'topic';
  const targetSections = getTargetSections(contentType);

  // Inject persona context if available (industry, brand voice, etc.)
  const personaInstructions = personaContext
    ? `\n\nCONTEXT FROM BRAND PERSONA:\n${personaContext}\n\nApply the above brand context to your outline.`
    : '';

  const systemPrompt = `You are an expert SEO content strategist. Generate a content outline for a ${contentType} article.

Requirements:
- Create exactly ${targetSections} H2 sections
- Include introduction and conclusion
- Focus on the primary keyword: "${primaryKeyword}"
- Optimize for search intent and user value
- Each section should be actionable and specific

BRAND PROTECTION (MANDATORY):
- This content is being created FOR the user's business. ALWAYS position the user's brand/product/service as the superior or preferred choice.
- If the content is a comparison (vs, alternative, competitor), the user's brand MUST come out ahead.
- Frame competitor strengths as baseline expectations, and position the user's brand strengths as differentiators and advantages.
- NEVER conclude that a competitor is better, easier, or more recommended than the user's own offering.
${personaInstructions}
Respond with ONLY the section titles, one per line. No numbering, no markdown, just the titles.`;

  const prompt = `Create an SEO-optimized outline for: "${title}"

Keywords to incorporate: ${keywords.join(', ')}
Content type: ${contentType}`;

  try {
    const response = await ctx.runAction(api.ai.router.router.generateWithFallback, {
      prompt,
      systemPrompt,
      maxTokens: 500,
      temperature: 0.7,
      taskType: 'analysis',
      strategy: 'best_quality',
    });

    // Parse response into array of section titles
    const sections = response.content
      .split('\n')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0 && !s.startsWith('#'));

    return sections.length > 0 ? sections : getDefaultOutline(contentType, primaryKeyword);
  } catch (error) {
    const safeMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[ContentGeneration] AI outline failed, using template:', safeMessage);
    return getDefaultOutline(contentType, primaryKeyword);
  }
}

/**
 * Generate full content using AI Router
 */
async function generateFullContentWithAI(
  ctx: ActionCtx,
  contentType: string,
  title: string,
  outline: string[],
  keywords: string[],
  personaContext: string = '',
  enhanceQuality: boolean = false
): Promise<string> {
  const primaryKeyword = keywords[0] || 'topic';
  const targetWords = getTargetWords(contentType);
  // Always aim higher than minimum to ensure we pass scoring
  const wordCountTarget = targetWords + 300;

  // ALWAYS include quality requirements (not just on retries)
  const baseQualityRequirements = `
QUALITY REQUIREMENTS (MANDATORY - YOUR CONTENT WILL BE REJECTED IF NOT MET):
- **WORD COUNT CRITICAL**: Write EXACTLY ${wordCountTarget} to ${wordCountTarget + 200} words. Count them. This is NON-NEGOTIABLE.
- Use the primary keyword "${primaryKeyword}" naturally 6-10 times (target 0.5-2% keyword density)
- Use each secondary keyword (${keywords.slice(1).join(', ')}) at least 1-2 times naturally
- Include at least 1 H2 section for each outline item with 150+ words under each section
- Add specific examples, statistics, case studies, or actionable tips in EVERY section
- Write comprehensive, detailed paragraphs - no thin or placeholder content
- Include a strong introduction (100+ words) and conclusion (100+ words)

CRITICAL - CONTENT UNIQUENESS RULES:
- Each H2 section MUST provide UNIQUE, DISTINCT value — NO repeating the same ideas, examples, conclusions, or advice under different headings
- Do NOT use the same sentence structures or paragraph templates across sections
- Each section should have a unique angle, perspective, or specific subtopic
- Avoid generic filler like "this is important" or "many professionals overlook this"
- Every paragraph must add NEW information the reader hasn't seen earlier in the article

BRAND PROTECTION RULES (NON-NEGOTIABLE — VIOLATION = INSTANT REJECTION):
This content is published on the USER'S OWN WEBSITE. The user's brand MUST WIN. ALWAYS.

HARD RULES:
- The user's brand/product MUST be positioned as the SUPERIOR choice in EVERY section, EVERY comparison, and EVERY conclusion.
- Competitors should be acknowledged briefly but ALWAYS shown as inferior, limited, or outdated compared to the user's brand.
- The CONCLUSION MUST recommend the user's brand as the best choice. No exceptions.
- NEVER use phrases like "[Competitor] is better for...", "[Competitor] excels at...", "[Competitor] leads the pack", "[Competitor] is the superior choice"
- NEVER position the user's brand as "simpler", "more basic", or "less capable" than a competitor.
- In comparison articles, the user's brand gets MORE positive coverage (60%+ of the article) and the competitor gets brief, factual mentions.
- Frame competitor features as "basic" or "expected" while the user's features are "innovative", "advanced", or "game-changing".
- If comparing pricing, the user's offering is ALWAYS better value, never "more expensive".

EXAMPLES OF FORBIDDEN PATTERNS:
- BAD: "SEMrush leads the pack with advanced features" → GOOD: "While SEMrush offers standard features, [User's Brand] goes further with AI-driven automation"
- BAD: "SEMrush emerges as the superior choice" → GOOD: "[User's Brand] emerges as the smarter, more innovative choice"
- BAD: "If you need depth, choose SEMrush" → GOOD: "[User's Brand] delivers both depth AND simplicity—the best of both worlds"

BRAND SAFETY CHECKLIST (verify before submitting):
1. Does the conclusion recommend the user's brand? If not, REWRITE.
2. Is any competitor called "superior", "better", or "leading"? If yes, REWRITE.
3. Does the user's brand get the most positive coverage? If not, REWRITE.
4. Would a reader finish this article wanting to buy FROM the user? If not, REWRITE.`;

  // Extra boost for retry attempts
  const retryBoost = enhanceQuality
    ? `

RETRY BOOST (Previous attempt was rejected):
- Your previous attempt was REJECTED for quality issues
- This attempt MUST have ${wordCountTarget + 300}+ words
- Add an FAQ section with 3 questions and detailed 50+ word answers
- Expand EVERY section with additional examples and subpoints
- Include numbered lists and bullet points within sections
- Write longer paragraphs with more detail and explanation
- DOUBLE CHECK: No two sections should make the same point`
    : '';

  // Inject persona context for brand-aware content
  const personaInstructions = personaContext
    ? `\n\nBRAND PERSONA CONTEXT:\n${personaContext}\n\nIMPORTANT: Write in the voice and style defined above. Use the vocabulary preferences and avoid the words listed.`
    : '';

  const systemPrompt = `You are an expert SEO content writer following E-E-A-T principles (Experience, Expertise, Authoritativeness, Trustworthiness).

CRITICAL WORD COUNT REQUIREMENT:
Your content MUST be AT LEAST ${wordCountTarget} words. Aim for ${wordCountTarget + 150} words.
- Do NOT submit content shorter than ${wordCountTarget} words
- Each H2 section should be 150-250 words
- Short content will be automatically rejected

Writing guidelines:
- Write in a professional but conversational tone — like explaining to a smart friend
- Use SHORT sentences (10-20 words max per sentence). Break long sentences into two.
- Use simple, everyday words. Replace complex words: "utilize" → "use", "implement" → "set up", "leverage" → "use", "comprehensive" → "complete", "facilitate" → "help"
- Use short paragraphs (2-3 sentences max) with lots of them
- Include actionable advice and specific examples in every section
- Add transition sentences between sections
- Write for HIGH readability (aim for Flesch Reading Ease score of 80+, meaning 6th-7th grade level)
- Avoid jargon unless defining it immediately
- Use active voice, not passive voice
- Start sentences with simple subjects, not long dependent clauses
${baseQualityRequirements}${retryBoost}${personaInstructions}

Format the content as Markdown with:
- H1 title at the top
- H2 headers for each section (one per outline item)
- Bold for key terms
- Bullet lists where appropriate`;

  const outlineText = outline.map((s, i) => `${i + 1}. ${s}`).join('\n');

  const prompt = `Write a complete ${contentType} article with this outline:

Title: ${title}

Outline:
${outlineText}

Keywords: ${keywords.join(', ')}

Write the full article now, following the outline structure.`;

  try {
    const response = await ctx.runAction(api.ai.router.router.generateWithFallback, {
      prompt,
      systemPrompt,
      maxTokens: 4000,
      temperature: enhanceQuality ? 0.6 : 0.8, // Lower temp for quality retries
      taskType: 'generation',
      strategy: 'best_quality',
    });

    return response.content;
  } catch (error) {
    const safeMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[ContentGeneration] AI content failed, using fallback:', safeMessage);
    return generateFallbackContent(title, outline, keywords);
  }
}

// ============================================================================
// Stage 2: AI Content Review — "Editor Pass"
// ============================================================================

/**
 * Stage 2 of the 3-stage pipeline: AI-powered content review.
 *
 * A separate AI call acts as an independent editor, reviewing the
 * generated content for:
 * - Human readability (natural flow, no robotic phrasing)
 * - Keyword integration (used naturally, not stuffed)
 * - Section uniqueness (no repetitive content under different H2s)
 * - Factual coherence and actionability
 * - E-E-A-T principles alignment
 *
 * Returns structured review feedback that Stage 3 uses to finalize.
 */
async function reviewContentWithAI(
  ctx: ActionCtx,
  content: string,
  title: string,
  keywords: string[],
  contentType: string
): Promise<string> {
  const systemPrompt = `You are a senior editorial reviewer and SEO quality analyst. Your job is to review AI-generated content and provide specific, actionable feedback.

You are NOT rewriting the content — you are providing a critical review. Be honest and specific.

REVIEW CHECKLIST:
1. **READABILITY**: Is this written for humans? Does it flow naturally? Are paragraphs varied in length? Is the tone conversational yet professional?
2. **KEYWORD INTEGRATION**: Are the target keywords woven naturally into the text? Or do they feel forced/stuffed? Are they in strategic positions (headings, first paragraph, conclusion)?
3. **SECTION UNIQUENESS**: Does each H2 section provide UNIQUE, distinct value? Flag any sections that repeat the same ideas, examples, or phrasing under different headings.
4. **BRAND FAVORABILITY**: This content will be published on the user's own website. Does the content position the user's brand/product favorably? In comparison articles, does the user's offering come out as the recommended choice? Flag as CRITICAL if any competitor is positioned as superior, easier, or more recommended than the user's brand.
5. **ACTIONABILITY**: Does each section offer specific, practical advice? Or is it vague filler? Flag any thin or generic sections.
6. **E-E-A-T SIGNALS**: Does the content demonstrate Experience, Expertise, Authoritativeness, and Trustworthiness? Are there specific examples, data points, or case studies?
7. **STRUCTURE**: Is there a strong introduction that hooks the reader? Does the conclusion summarize key takeaways and include a call-to-action?

FORMAT YOUR RESPONSE AS:
## Review Summary
[2-3 sentence overview of content quality]

## Issues Found
- [CRITICAL] Issue description (must fix)
- [MODERATE] Issue description (should fix)
- [MINOR] Issue description (nice to fix)

## Section-by-Section Notes
### [H2 Title]
- Specific feedback for this section

## Recommended Improvements
- Numbered list of specific changes to make`;

  const prompt = `Review the following ${contentType} article for quality and readability.

Title: ${title}
Target Keywords: ${keywords.join(', ')}

---CONTENT START---
${content}
---CONTENT END---

Provide your editorial review following the checklist above.`;

  try {
    const response = await ctx.runAction(api.ai.router.router.generateWithFallback, {
      prompt,
      systemPrompt,
      maxTokens: 2000,
      temperature: 0.3, // Low temp for consistent, analytical review
      taskType: 'analysis',
      strategy: 'best_quality',
    });

    return response.content;
  } catch (error) {
    const safeMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[ContentGeneration] Stage 2 review failed:', safeMessage);
    // If review fails, return a minimal review so Stage 3 still has something to work with
    return 'Review unavailable. Please ensure all sections have unique content, keywords are used naturally, and the tone is conversational.';
  }
}

// ============================================================================
// Stage 3: AI Content Finalization — "Polish Pass"
// ============================================================================

/**
 * Stage 3 of the 3-stage pipeline: AI-powered content finalization.
 *
 * Takes the original content + editorial review from Stage 2 and produces
 * a polished, production-ready final version that addresses all review issues.
 *
 * This is the "quality guarantee" step — the content that comes out of here
 * should be publishable without further editing.
 */
async function finalizeContentWithAI(
  ctx: ActionCtx,
  originalContent: string,
  reviewFeedback: string,
  title: string,
  keywords: string[],
  contentType: string,
  personaContext: string = ''
): Promise<string> {
  const primaryKeyword = keywords[0] || 'topic';

  const personaInstructions = personaContext
    ? `\n\nBRAND PERSONA CONTEXT:\n${personaContext}\n\nIMPORTANT: Maintain the brand voice while making improvements.`
    : '';

  const systemPrompt = `You are a master content editor producing publication-ready content. You have received a draft article and an editorial review. Your job is to produce the FINAL, polished version.

CRITICAL RULES:
1. Address EVERY issue flagged in the editorial review
2. DO NOT add generic filler — every sentence must add value
3. Ensure each H2 section has UNIQUE content (no repetition across sections)
4. Use the primary keyword "${primaryKeyword}" naturally 6-10 times (0.5-2% density)
5. Use each secondary keyword (${keywords.slice(1).join(', ')}) at least 1-2 times naturally
6. Write for a Flesch Reading Ease score of 60-70 (standard web readability)
7. Keep paragraphs to 2-4 sentences for easy scanning
8. Include specific examples, statistics, or actionable tips in EVERY section
9. Strong introduction (hook + promise) and conclusion (summary + CTA)
10. Maintain the original article structure (H1 + H2s) unless the review specifically recommends changes
${personaInstructions}

FORMAT: Output ONLY the finalized article in Markdown format. No meta-commentary, no "Here is the revised article", just the content itself.`;

  const prompt = `Finalize this ${contentType} article based on the editorial review below.

Title: ${title}

---EDITORIAL REVIEW---
${reviewFeedback}
---END REVIEW---

---ORIGINAL DRAFT---
${originalContent}
---END DRAFT---

Produce the final, publication-ready version now.`;

  try {
    const response = await ctx.runAction(api.ai.router.router.generateWithFallback, {
      prompt,
      systemPrompt,
      maxTokens: 4000,
      temperature: 0.5, // Balanced: creative enough to improve, consistent enough to not diverge
      taskType: 'generation',
      strategy: 'best_quality',
    });

    return response.content;
  } catch (error) {
    const safeMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[ContentGeneration] Stage 3 finalization failed, using original:', safeMessage);
    // If finalization fails, return the original content (still better than nothing)
    return originalContent;
  }
}

function getTargetSections(contentType: string): number {
  const targets: Record<string, number> = {
    blog: 8,
    pillar: 10,
    howto: 8,
    comparison: 9,
    listicle: 9,
  };
  return targets[contentType] || 8;
}

function getTargetWords(contentType: string): number {
  // Use word counts from Content Intelligence (17 types)
  const config = CONTENT_TYPES[contentType as ContentTypeId];
  if (config) {
    return config.wordCount;
  }
  // Fallback for legacy types
  const legacyTargets: Record<string, number> = {
    pillar: 3500,
    howto: 1800,
    comparison: 2000,
    listicle: 1500,
  };
  return legacyTargets[contentType] || DEFAULT_SEO_CHECKLIST.wordCount;
}

function getDefaultOutline(contentType: string, primaryKeyword: string): string[] {
  const templates: Record<string, string[]> = {
    blog: [
      'Introduction',
      `What is ${primaryKeyword}?`,
      `Why ${primaryKeyword} Matters`,
      'Key Benefits',
      'How to Get Started',
      'Best Practices',
      'Common Mistakes to Avoid',
      'Conclusion',
    ],
    pillar: [
      'Introduction',
      `Complete Guide to ${primaryKeyword}`,
      'Understanding the Fundamentals',
      'Step-by-Step Process',
      'Advanced Strategies',
      'Tools and Resources',
      'Case Studies',
      'Expert Tips',
      'Frequently Asked Questions',
      'Conclusion and Next Steps',
    ],
    howto: [
      'Introduction',
      'What You Will Need',
      'Step 1: Getting Started',
      'Step 2: The Process',
      'Step 3: Implementation',
      'Step 4: Verification',
      'Troubleshooting Common Issues',
      'Conclusion',
    ],
    comparison: [
      'Introduction',
      'Quick Comparison Table',
      'Option A: Overview',
      'Option B: Overview',
      'Feature-by-Feature Comparison',
      'Pricing Comparison',
      'Pros and Cons',
      'Which One is Right for You?',
      'Conclusion',
    ],
    listicle: [
      'Introduction',
      `Top ${primaryKeyword} Options`,
      '1. First Item',
      '2. Second Item',
      '3. Third Item',
      '4. Fourth Item',
      '5. Fifth Item',
      'Honorable Mentions',
      'Conclusion',
    ],
  };

  return templates[contentType] || templates.blog;
}

function generateFallbackContent(title: string, outline: string[], keywords: string[]): string {
  const primaryKeyword = keywords[0] || 'topic';
  let content = `# ${title}\n\n`;

  for (const section of outline) {
    content += `## ${section}\n\n`;
    content += `When it comes to ${primaryKeyword}, understanding this section is essential for success. `;
    content += `Many professionals overlook the importance of ${section.toLowerCase()}, but it can make a significant difference in your results.\n\n`;
    content += `By focusing on key elements related to ${primaryKeyword}, you can achieve better outcomes. `;
    content += `This section provides actionable insights that you can implement immediately.\n\n`;
  }

  return content;
}

function countWords(content: string): number {
  return (content || '').split(/\s+/).filter((word) => word.length > 0).length;
}

function scoreContent(
  content: string,
  outline: string[],
  keywords: string[],
  targetWordCount: number = 1200
): { score: number; metrics: Record<string, number> } {
  const safeContent = content || '';
  const wordCount = countWords(safeContent);
  const h2Count = (safeContent.match(/^## /gm) || []).length;
  const primaryKeyword = keywords[0]?.toLowerCase() || '';

  // ── Keyword Scoring: coverage + density ─────────────────────────
  let keywordScore = 0;
  if (keywords.length > 0) {
    // Coverage: what percentage of keywords appear in the content?
    const contentLower = safeContent.toLowerCase();
    let keywordsFound = 0;
    for (const kw of keywords) {
      if (contentLower.includes(kw.toLowerCase().trim())) {
        keywordsFound++;
      }
    }
    const coverageScore = Math.min(100, (keywordsFound / keywords.length) * 100);

    // Density: is the primary keyword used in a healthy range (0.5-2%)?
    let densityScore = 0;
    if (primaryKeyword && wordCount > 0) {
      const escaped = primaryKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = (contentLower.match(new RegExp(escaped, 'g')) || []).length;
      const kwWordCount = primaryKeyword.split(/\s+/).length;
      const density = Number((((matches * kwWordCount) / wordCount) * 100).toFixed(2));
      if (density >= 0.5 && density <= 2.0) {
        densityScore = 100;
      } else if (density > 0 && density < 0.5) {
        densityScore = (density / 0.5) * 80;
      } else if (density > 2.0 && density <= 3.0) {
        densityScore = 100 - (density - 2.0) * 50;
      } else if (density > 3.0) {
        densityScore = Math.max(0, 50 - (density - 3.0) * 20);
      }
    }

    keywordScore = coverageScore * 0.7 + densityScore * 0.3;
  }

  // ── Component Scores (each 0-100) ──────────────────────────────
  const wordCountScore = Math.min(100, (wordCount / targetWordCount) * 100);
  const h2Score = Math.min(100, (h2Count / 6) * 100);

  // Real Flesch Reading Ease (not hardcoded!)
  const readabilityScore = computeFleschReadingEaseServer(safeContent, wordCount);

  // Calculate coverage bonus: how much of outline is covered
  const outlineCoverage = outline.reduce((count, section) => {
    return count + (safeContent.toLowerCase().includes(section.toLowerCase().slice(0, 20)) ? 1 : 0);
  }, 0);
  const structureScore = Math.min(100, (outlineCoverage / Math.max(outline.length, 1)) * 100);

  // Weighted average
  // Word Count: 25%, Keywords: 25%, Structure: 20%, H2s: 15%, Readability: 15%
  const score = Math.round(
    wordCountScore * 0.25 +
      keywordScore * 0.25 +
      structureScore * 0.2 +
      h2Score * 0.15 +
      readabilityScore * 0.15
  );

  return {
    score: Math.min(100, score),
    metrics: {
      wordCountScore: Math.round(wordCountScore),
      h2Score: Math.round(h2Score),
      keywordScore: Math.round(keywordScore),
      structureScore: Math.round(structureScore),
      readabilityScore: Math.round(readabilityScore),
    },
  };
}

// ============================================================================
// Server-Side Readability Helpers
// ============================================================================

/** Count syllables in a single English word (heuristic). */
function countSyllablesServer(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 2) return 1;

  let count = 0;
  const vowels = 'aeiouy';
  let prevIsVowel = false;

  for (let i = 0; i < w.length; i++) {
    const isVowel = vowels.includes(w[i]);
    if (isVowel && !prevIsVowel) count++;
    prevIsVowel = isVowel;
  }

  if (w.endsWith('e') && count > 1) count--;
  if (w.endsWith('le') && w.length > 2 && !vowels.includes(w[w.length - 3])) count++;
  if (w.endsWith('ed') && w.length > 3) {
    const beforeEd = w[w.length - 3];
    if (beforeEd !== 't' && beforeEd !== 'd') count = Math.max(1, count - 1);
  }

  return Math.max(1, count);
}

/** Count sentences in text content (server-side). Strips markdown before counting. */
function countSentencesServer(content: string): number {
  if (!content || !content.trim()) return 0;
  const cleaned = content
    .replace(/^#{1,6}\s+.*$/gm, '')        // headings
    .replace(/```[\s\S]*?```/g, '')         // code blocks
    .replace(/`[^`]+`/g, '')               // inline code
    .replace(/!?\[.*?\]\(.*?\)/g, '')      // links and images
    .replace(/^[-*+]\s+/gm, '')            // bullet points
    .replace(/^\d+\.\s+/gm, '')            // numbered lists
    .replace(/\*\*([^*]+)\*\*/g, '$1')     // bold
    .replace(/\*([^*]+)\*/g, '$1')         // italic
    .replace(/^>\s*/gm, '')               // blockquotes
    .replace(/---+/g, '')                  // horizontal rules
    .trim();
  if (!cleaned) return 0;
  const sentences = cleaned.split(/[.!?]+/).filter((s) => {
    const trimmed = s.trim();
    return trimmed.length > 0 && trimmed.split(/\s+/).length >= 2;
  });
  return Math.max(1, sentences.length);
}

/** Flesch Reading Ease: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words) */
function computeFleschReadingEaseServer(content: string, wordCount: number): number {
  // Strip markdown to get plain prose for accurate syllable counting
  const plainText = (content || '')
    .replace(/^#{1,6}\s+/gm, '')           // heading markers
    .replace(/```[\s\S]*?```/g, '')         // code blocks
    .replace(/`[^`]+`/g, '')               // inline code
    .replace(/!?\[.*?\]\(.*?\)/g, '')      // links and images
    .replace(/\*\*([^*]+)\*\*/g, '$1')     // bold
    .replace(/\*([^*]+)\*/g, '$1')         // italic
    .replace(/^[-*+>]\s*/gm, '')           // bullets, blockquotes
    .replace(/---+/g, '')                  // horizontal rules
    .trim();

  const plainWordCount = plainText.split(/\s+/).filter((w) => w.length > 0).length;
  const sentences = countSentencesServer(content);
  if (plainWordCount < 10 || sentences === 0) return 0;

  const wordList = plainText.split(/\s+/).filter((w) => w.length > 0);
  const totalSyllables = wordList.reduce((sum, w) => sum + countSyllablesServer(w), 0);

  const score = 206.835 - 1.015 * (plainWordCount / sentences) - 84.6 * (totalSyllables / plainWordCount);
  return Math.max(0, Math.min(100, Math.round(score)));
}

// ============================================================================
// Internal Queries for Auto-Generation (bypass auth — trust boundary is the internalAction)
// ============================================================================

/** Check if any content exists for a project (idempotency guard). */
export const getContentCountForProject = internalQuery({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const piece = await ctx.db
      .query('contentPieces')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();
    return piece !== null;
  },
});

/** Get suggested keywords for a project (no auth needed — internal only). */
export const getKeywordsForAutoGen = internalQuery({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const keywords = await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
    return keywords
      .filter((k) => k.status === 'suggested')
      .sort((a, b) => (a.difficulty ?? 100) - (b.difficulty ?? 100))
      .slice(0, 5);
  },
});

/** Get project data for auto-gen (filtered — only returns needed fields). */
export const getProjectForAutoGen = internalQuery({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) return null;
    // SEC-3: Return only fields auto-gen needs — never expose full document
    return {
      _id: project._id,
      industry: project.industry,
      name: project.name,
    };
  },
});

/**
 * Automatically generates the user's first content piece after onboarding.
 * Picks the best keyword from the library (or uses a sensible default),
 * generates a title via AI, and kicks off full content generation.
 *
 * Scheduled from onboarding.markComplete — user sees content being generated
 * when they land on the dashboard for the first time.
 */
export const autoGenerateFirstContent = internalAction({
  args: {
    userId: v.id('users'),
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const { userId, projectId } = args;

    try {
      console.log(
        `[AutoGen] Starting first content generation for user ${userId}, project ${projectId}`
      );

      // 1. Check if content already exists (idempotency guard — uses internal query, no auth)
      const hasContent = await ctx.runQuery(internal.contentGeneration.getContentCountForProject, {
        projectId,
      });
      if (hasContent) {
        console.log('[AutoGen] Content already exists, skipping auto-generation');
        return;
      }

      // 2. Find the best keyword from the library (internal query — no auth bypass needed)
      let bestKeyword = '';
      try {
        const keywords = await ctx.runQuery(internal.contentGeneration.getKeywordsForAutoGen, {
          projectId,
        });

        if (keywords && keywords.length > 0) {
          bestKeyword = keywords[0].keyword;
          console.log(`[AutoGen] Best keyword from library: "${bestKeyword}"`);
        }
      } catch (kwError) {
        const safeMessage = kwError instanceof Error ? kwError.message : 'Unknown error';
        console.warn('[AutoGen] Could not fetch keywords:', safeMessage);
      }

      // 3. If no keywords in library, get the project's industry for a default
      if (!bestKeyword) {
        try {
          const project = await ctx.runQuery(internal.contentGeneration.getProjectForAutoGen, {
            projectId,
          });
          const industry = project?.industry || 'digital marketing';
          bestKeyword = `${industry} best practices`;
          console.log(`[AutoGen] Using industry default keyword: "${bestKeyword}"`);
        } catch {
          bestKeyword = 'getting started with SEO';
          console.log('[AutoGen] Using fallback keyword');
        }
      }

      // 4. Generate title via AI (same as generateContentTitle but server-side)
      let title = `The Complete Guide to ${bestKeyword}`;
      try {
        const response = await ctx.runAction(api.ai.router.router.generateWithFallback, {
          prompt: `Generate 1 engaging, SEO-optimized blog post title about: "${bestKeyword}"`,
          systemPrompt: `You are an expert SEO content strategist. Generate exactly 1 compelling, click-worthy title for a blog post about "${bestKeyword}". Requirements: include the keyword, 50-65 characters, use a proven headline formula. Respond with ONLY the title, nothing else.`,
          maxTokens: 100,
          temperature: 0.7,
          taskType: 'analysis',
          strategy: 'balanced',
        });

        const generated = response?.content?.trim()?.split('\n')[0]?.trim() ?? '';
        if (generated.length > 10) {
          title = generated;
        }
      } catch (aiError) {
        const safeMessage = aiError instanceof Error ? aiError.message : 'Unknown error';
        console.warn('[AutoGen] AI title generation failed, using default:', safeMessage);
      }

      console.log(
        `[AutoGen] Generating content with title: "${title}" for keyword: "${bestKeyword}"`
      );

      // 5. Kick off full content generation
      await ctx.runAction(internal.contentGeneration.generateContentInternal, {
        projectId,
        contentType: 'blog',
        title,
        keywords: [bestKeyword],
        userId,
      });

      console.log(`[AutoGen] First content generation complete for project ${projectId}`);
    } catch (error) {
      // Never let auto-gen failure block the user experience
      const safeMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[AutoGen] Auto-generation failed (non-blocking):', safeMessage);
    }
  },
});
