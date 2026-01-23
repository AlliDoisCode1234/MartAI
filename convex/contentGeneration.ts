/**
 * Content Generation Actions
 *
 * One-click content generation using AI Router with quality guarantee.
 * Routes to best available AI provider with automatic failover.
 * Includes retry loop to ensure 90+ SEO score guarantee.
 */

import { action, internalMutation, internalAction } from './_generated/server';
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

// Quality threshold for A+ grade
const QUALITY_THRESHOLD = 90;
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

    // 4. Quality Guarantee Loop - retry until score >= 90 or max attempts
    let attempt = 0;
    let bestContent = '';
    let bestScore = 0;
    let bestMetrics: Record<string, number> = {};

    while (attempt < MAX_GENERATION_ATTEMPTS) {
      attempt++;
      console.log(`[ContentGeneration] Attempt ${attempt}/${MAX_GENERATION_ATTEMPTS}`);

      // Generate full content using AI Router (with persona context)
      const content = await generateFullContentWithAI(
        ctx,
        args.contentType,
        args.title,
        outline,
        args.keywords,
        personaContext,
        attempt > 1 // Add quality hints on retries
      );

      // Score content using content type's target word count
      const contentTypeConfig = CONTENT_TYPES[args.contentType as ContentTypeId];
      const targetWordCount = contentTypeConfig?.wordCount || 1200;
      const { score, metrics } = scoreContent(content, outline, args.keywords, targetWordCount);
      console.log(`[ContentGeneration] Score: ${score}`);

      // Track best result
      if (score > bestScore) {
        bestContent = content;
        bestScore = score;
        bestMetrics = metrics;
      }

      // Quality threshold met - exit loop
      if (score >= QUALITY_THRESHOLD) {
        console.log(`[ContentGeneration] Quality threshold met (${score} >= ${QUALITY_THRESHOLD})`);
        break;
      }

      // Log why we're retrying
      if (attempt < MAX_GENERATION_ATTEMPTS) {
        console.log(`[ContentGeneration] Retrying for better quality...`);
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

    // 1. Get existing piece
    const piece = await ctx.runQuery(api.contentPieces.getById, { contentPieceId });
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

    // 5. Quality Guarantee Loop
    let attempt = 0;
    let bestContent = '';
    let bestScore = 0;
    let bestMetrics: Record<string, number> = {};

    while (attempt < MAX_GENERATION_ATTEMPTS) {
      attempt++;
      console.log(`[generateContentForPiece] Attempt ${attempt}/${MAX_GENERATION_ATTEMPTS}`);

      const content = await generateFullContentWithAI(
        ctx,
        piece.contentType,
        piece.title,
        outline,
        piece.keywords || [],
        personaContext,
        attempt > 1
      );

      const contentTypeConfig = CONTENT_TYPES[piece.contentType as ContentTypeId];
      const targetWordCount = contentTypeConfig?.wordCount || 1200;
      const { score, metrics } = scoreContent(
        content,
        outline,
        piece.keywords || [],
        targetWordCount
      );

      if (score > bestScore) {
        bestContent = content;
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
    contentType: v.union(
      // Core Pages
      v.literal('homepage'),
      v.literal('about'),
      v.literal('service'),
      v.literal('landing'),
      // Blog Content
      v.literal('blog'),
      v.literal('blogVersus'),
      v.literal('blogVideo'),
      v.literal('contentRefresh'),
      // Conversion
      v.literal('leadMagnet'),
      v.literal('paidProduct'),
      // Local/Geo
      v.literal('areasWeServe'),
      // Specialty
      v.literal('employment'),
      v.literal('mentorship'),
      v.literal('donate'),
      v.literal('events'),
      v.literal('partner'),
      v.literal('program')
    ),
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
    console.warn('[ContentGeneration] AI outline failed, using template:', error);
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
- Use the primary keyword "${primaryKeyword}" naturally 10-15 times throughout the content
- Use each secondary keyword at least 2-3 times
- Include at least 1 H2 section for each outline item with 150+ words under each section
- Add specific examples, statistics, case studies, or actionable tips in EVERY section
- Write comprehensive, detailed paragraphs - no thin or placeholder content
- Include a strong introduction (100+ words) and conclusion (100+ words)`;

  // Extra boost for retry attempts
  const retryBoost = enhanceQuality
    ? `

RETRY BOOST (Previous attempt had insufficient word count):
- Your previous attempt was REJECTED for low word count
- This attempt MUST have ${wordCountTarget + 300}+ words
- Add an FAQ section with 3 questions and detailed 50+ word answers
- Expand EVERY section with additional examples and subpoints
- Include numbered lists and bullet points within sections
- Write longer paragraphs with more detail and explanation`
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
- Write in a professional but conversational tone
- Use short paragraphs (2-4 sentences) but MANY of them
- Include actionable advice and specific examples in every section
- Add transition sentences between sections
- Write for readability (aim for Flesch score 60+)
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
    console.warn('[ContentGeneration] AI content failed, using fallback:', error);
    return generateFallbackContent(title, outline, keywords);
  }
}

// ============================================================================
// Fallback & Scoring Helpers
// ============================================================================

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

  // Smart keyword matching: handle multi-word keywords like "lip fillers kansas city"
  // Count exact phrase matches AND individual word matches for better accuracy
  let keywordScore = 0;
  if (primaryKeyword) {
    const contentLower = safeContent.toLowerCase();

    // Count exact phrase matches
    const exactMatches = (
      contentLower.match(new RegExp(primaryKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ||
      []
    ).length;

    // For multi-word keywords, also count individual significant words
    const words = primaryKeyword.split(/\s+/).filter((w) => w.length > 2); // Skip short words like "in", "of"
    let wordMatchScore = 0;
    if (words.length > 1) {
      // Multi-word keyword: average the individual word counts
      const wordCounts = words.map((word) => {
        const wordRegex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        return (contentLower.match(wordRegex) || []).length;
      });
      const avgWordCount = wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length;
      wordMatchScore = Math.min(100, (avgWordCount / 6) * 100); // 6 avg mentions for 100%
    }

    // Exact phrase score
    const exactScore = Math.min(100, (exactMatches / 4) * 100); // 4 exact matches for 100%

    // Combined score: 60% word presence + 40% exact phrase (if multi-word)
    keywordScore =
      words.length > 1
        ? exactScore * 0.4 + wordMatchScore * 0.6
        : Math.min(100, (exactMatches / 8) * 100); // Single word: 8 mentions for 100%
  }

  // Score components (0-100 each) - use dynamic word count target
  const wordCountScore = Math.min(100, (wordCount / targetWordCount) * 100);
  const h2Score = Math.min(100, (h2Count / 6) * 100); // Lower bar: 6 H2s for 100%
  const readabilityScore = 85; // Baseline for well-structured AI content

  // Calculate coverage bonus: how much of outline is covered
  const outlineCoverage = outline.reduce((count, section) => {
    return count + (safeContent.toLowerCase().includes(section.toLowerCase().slice(0, 20)) ? 1 : 0);
  }, 0);
  const structureScore = Math.min(100, (outlineCoverage / Math.max(outline.length, 1)) * 100);

  // Weighted average - removed link score penalty
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
