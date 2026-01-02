/**
 * Content Calendar Generation
 *
 * Zero-click content calendar automation.
 * Generates 6-month calendar from URL + industry detection.
 */

import { v } from 'convex/values';
import { action, internalAction, internalMutation } from '../_generated/server';
import { internal, api } from '../_generated/api';
import { Id } from '../_generated/dataModel';
import { INDUSTRY_TEMPLATES, IndustryId, ContentPlanItem } from '../phoo/industryTemplates';
import { CONTENT_TYPES, ContentTypeId } from '../phoo/contentTypes';

// ============================================================================
// Types
// ============================================================================

interface GeneratedCalendarItem {
  contentType: ContentTypeId;
  title: string;
  keywords: string[];
  scheduledDate: number;
  priority: 'P0' | 'P1' | 'P2';
}

interface CalendarGenerationResult {
  success: boolean;
  industry: IndustryId;
  itemsGenerated: number;
  contentPieceIds: Id<'contentPieces'>[];
  error?: string;
}

// ============================================================================
// Calendar Generation Action
// ============================================================================

/**
 * Generate a full 6-month content calendar for a project.
 * Called during onboarding after GA4/GSC integration step.
 */
export const generateFullCalendar = action({
  args: {
    projectId: v.id('projects'),
    websiteUrl: v.optional(v.string()),
    businessDescription: v.optional(v.string()),
    monthsAhead: v.optional(v.number()), // default: 6
    useGa4Gsc: v.optional(v.boolean()), // true if connected
  },
  handler: async (ctx, args): Promise<CalendarGenerationResult> => {
    const months = args.monthsAhead || 6;

    try {
      // 1. Get project details
      const project = await ctx.runQuery(api.projects.projects.getProjectById, {
        projectId: args.projectId,
      });

      if (!project) {
        return {
          success: false,
          industry: 'general',
          itemsGenerated: 0,
          contentPieceIds: [],
          error: 'Project not found',
        };
      }

      // 2. Detect industry from URL/description
      const industryId = await ctx.runAction(internal.phoo.industryTemplates.detectIndustry, {
        url: args.websiteUrl || project.websiteUrl || '',
        businessDescription: args.businessDescription || project.industry || '',
      });

      console.log(`[generateFullCalendar] Detected industry: ${industryId}`);

      // 3. Get industry template
      const template = INDUSTRY_TEMPLATES[industryId as IndustryId] || INDUSTRY_TEMPLATES.general;

      // 4. Get keywords (from GA4/GSC if available, otherwise use template seeds)
      let keywords: string[] = [];

      if (args.useGa4Gsc) {
        // Try to get keywords from GA4/GSC
        try {
          const gscKeywords = await ctx.runQuery(api.analytics.gscQueries.getTopQueries, {
            projectId: args.projectId,
            limit: 50,
          });
          if (gscKeywords && gscKeywords.length > 0) {
            keywords = gscKeywords.map((k: { query: string }) => k.query);
          }
        } catch (e) {
          console.log('[generateFullCalendar] GSC keywords not available, using template seeds');
        }
      }

      // Fallback to template seed keywords
      if (keywords.length === 0) {
        keywords = template.keywords;
      }

      // 5. Generate calendar items
      const calendarItems: GeneratedCalendarItem[] = [];
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;

      for (const planItem of template.contentPlan) {
        if (planItem.month > months) continue;

        const contentType = CONTENT_TYPES[planItem.contentType];
        if (!contentType) continue;

        // Calculate scheduled date
        // Month 1 = starts 2-7 days from now (current month content)
        // Month 2+ = subsequent months offset
        const baseOffset = 2 * dayMs; // Start 2 days from now
        const monthOffset = (planItem.month - 1) * 30 * dayMs;
        const daySpread = (calendarItems.length % 7) * dayMs; // Spread within week
        const scheduledDate = now + baseOffset + monthOffset + daySpread;

        // Replace template variables
        // Extract location from project name or use default
        const location = 'Your City'; // TODO: Add location field to projects
        const companyName = project.name || 'Your Company';

        const title = planItem.titleTemplate
          .replace(/\{\{location\}\}/g, location)
          .replace(/\{\{companyName\}\}/g, companyName)
          .replace(/\{\{industry\}\}/g, template.name);

        const itemKeywords = planItem.suggestedKeywords
          .map((kw) =>
            kw
              .replace(/\{\{location\}\}/g, location)
              .replace(/\{\{companyName\}\}/g, companyName)
              .replace(/\{\{industry\}\}/g, template.name)
          )
          .filter((kw) => !kw.includes('{{'));

        calendarItems.push({
          contentType: planItem.contentType,
          title,
          keywords: [...itemKeywords, ...keywords.slice(0, 3)],
          scheduledDate,
          priority: planItem.priority,
        });
      }

      // 6. Create content pieces in batch
      const contentPieceIds = await ctx.runMutation(
        internal.contentCalendar.generateCalendar.createCalendarContentPieces,
        {
          projectId: args.projectId,
          items: calendarItems,
        }
      );

      console.log(
        `[generateFullCalendar] Generated ${contentPieceIds.length} content pieces for ${industryId}`
      );

      return {
        success: true,
        industry: industryId,
        itemsGenerated: contentPieceIds.length,
        contentPieceIds,
      };
    } catch (error: unknown) {
      console.error('[generateFullCalendar] Error:', error);
      return {
        success: false,
        industry: 'general',
        itemsGenerated: 0,
        contentPieceIds: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

/**
 * Internal mutation to batch create content pieces
 */
export const createCalendarContentPieces = internalMutation({
  args: {
    projectId: v.id('projects'),
    items: v.array(
      v.object({
        contentType: v.string(),
        title: v.string(),
        keywords: v.array(v.string()),
        scheduledDate: v.number(),
        priority: v.union(v.literal('P0'), v.literal('P1'), v.literal('P2')),
      })
    ),
  },
  handler: async (ctx, args): Promise<Id<'contentPieces'>[]> => {
    const now = Date.now();
    const ids: Id<'contentPieces'>[] = [];

    for (const item of args.items) {
      // Schema now supports all 17 content types directly
      const id = await ctx.db.insert('contentPieces', {
        projectId: args.projectId,
        contentType: item.contentType as
          | 'homepage'
          | 'about'
          | 'service'
          | 'landing'
          | 'blog'
          | 'blogVersus'
          | 'blogVideo'
          | 'contentRefresh'
          | 'leadMagnet'
          | 'paidProduct'
          | 'areasWeServe'
          | 'employment'
          | 'mentorship'
          | 'donate'
          | 'events'
          | 'partner'
          | 'program',
        title: item.title,
        keywords: item.keywords,
        status: 'draft',
        scheduledDate: item.scheduledDate,
        priority: item.priority,
        createdAt: now,
        updatedAt: now,
        seoScore: 0,
        wordCount: 0,
      });

      ids.push(id);
    }

    return ids;
  },
});

/**
 * Trigger calendar generation during onboarding
 */
export const triggerOnboardingCalendarGeneration = internalAction({
  args: {
    projectId: v.id('projects'),
    hasGa4: v.boolean(),
    hasGsc: v.boolean(),
  },
  handler: async (ctx, args): Promise<CalendarGenerationResult> => {
    console.log(
      `[triggerOnboardingCalendarGeneration] Starting for project ${args.projectId}, GA4: ${args.hasGa4}, GSC: ${args.hasGsc}`
    );

    const result = await ctx.runAction(api.contentCalendar.generateCalendar.generateFullCalendar, {
      projectId: args.projectId,
      useGa4Gsc: args.hasGa4 || args.hasGsc,
    });

    return result;
  },
});
