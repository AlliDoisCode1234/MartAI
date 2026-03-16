/**
 * Calendar Generation Workflow (WF-002)
 *
 * Durable wrapper around the existing generateFullCalendar pipeline.
 * Replaces scheduler.runAfter(0) fire-and-forget with step-level durability.
 *
 * Steps:
 * 1. Get project details
 * 2. Detect industry via AI
 * 3. Resolve keywords (GSC or template fallback)
 * 4. Generate calendar items from industry template
 * 5. Batch create content pieces
 * 6-N. Generate content for first 3 pieces (each individually retryable)
 */

import { workflow } from '../index';
import { v } from 'convex/values';
import { internal, api } from '../_generated/api';
import { INDUSTRY_TEMPLATES, IndustryId, ContentPlanItem } from '../phoo/industryTemplates';
import { CONTENT_TYPES, ContentTypeId } from '../phoo/contentTypes';

export const calendarGenerationWorkflow = workflow.define({
  args: {
    projectId: v.id('projects'),
    userId: v.id('users'),
    websiteUrl: v.optional(v.string()),
    businessDescription: v.optional(v.string()),
    monthsAhead: v.optional(v.number()),
    useGa4Gsc: v.optional(v.boolean()),
  },
  returns: v.object({
    success: v.boolean(),
    industry: v.string(),
    itemsGenerated: v.number(),
    message: v.string(),
  }),
  handler: async (step, args): Promise<any> => {
    const months = args.monthsAhead || 6;

    // ── Step 1: Get project details ────────────────────────────────
    const project = await step.runQuery(api.projects.projects.getProjectById, {
      projectId: args.projectId,
    });

    if (!project) {
      return {
        success: false,
        industry: 'general',
        itemsGenerated: 0,
        message: 'Project not found',
      };
    }

    // ── Step 2: Detect industry via AI ─────────────────────────────
    const industryId: string = await step.runAction(
      internal.phoo.industryTemplates.detectIndustry,
      {
        url: args.websiteUrl || project.websiteUrl || '',
        businessDescription: args.businessDescription || project.industry || '',
      }
    );

    // ── Step 3: Resolve keywords ───────────────────────────────────
    const template = INDUSTRY_TEMPLATES[industryId as IndustryId] || INDUSTRY_TEMPLATES.general;
    let keywords: string[] = template.keywords;

    if (args.useGa4Gsc) {
      try {
        const gscKeywords = await step.runQuery(api.analytics.gscQueries.getTopQueries, {
          projectId: args.projectId,
          limit: 50,
        });
        if (gscKeywords && gscKeywords.length > 0) {
          keywords = gscKeywords.map((k: { query: string }) => k.query);
        }
      } catch {
        // Fallback to template keywords (already set)
      }
    }

    // ── Step 4: Generate calendar items from template ──────────────
    const calendarItems: Array<{
      contentType: string;
      title: string;
      keywords: string[];
      scheduledDate: number;
      priority: 'P0' | 'P1' | 'P2';
    }> = [];

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const companyName = project.name || 'Your Company';
    const location = 'Your City';

    for (const planItem of template.contentPlan) {
      if (planItem.month > months) continue;
      if (!CONTENT_TYPES[planItem.contentType]) continue;

      const baseOffset = 2 * dayMs;
      const monthOffset = (planItem.month - 1) * 30 * dayMs;
      const daySpread = (calendarItems.length % 7) * dayMs;
      const scheduledDate = now + baseOffset + monthOffset + daySpread;

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

    // ── Step 5: Enforce subscription usage limit (CR-002) ──────────
    // Record usage for ALL pieces BEFORE creation.
    // If limit exceeded, fail fast before spending AI tokens.
    try {
      // CR-005: Use internalRecordUsage — workflow steps run in internal context
      await step.runMutation(internal.subscriptions.subscriptions.internalRecordUsage, {
        userId: args.userId,
        metric: 'contentPieces' as const,
        amount: calendarItems.length,
      });
    } catch {
      return {
        success: false,
        industry: industryId,
        itemsGenerated: 0,
        message: `Monthly content limit reached. Calendar requires ${calendarItems.length} pieces. Upgrade your plan.`,
      };
    }

    // ── Step 6: Batch create content pieces ────────────────────────
    const contentPieceIds = await step.runMutation(
      internal.contentCalendar.generateCalendar.createCalendarContentPieces,
      {
        projectId: args.projectId,
        items: calendarItems,
      }
    );

    // ── Step 6-N: Generate content for first 3 pieces (durable) ───
    // Each piece generation is individually retryable on failure.
    // This replaces the scheduler.runAfter(0) fire-and-forget pattern.
    const piecesToGenerate = contentPieceIds.slice(0, 3);
    let generatedCount = 0;

    for (const pieceId of piecesToGenerate) {
      try {
        await step.runAction(internal.contentGeneration.generateContentForPiece, {
          contentPieceId: pieceId,
          userId: args.userId,
        });
        generatedCount++;
      } catch (error) {
        // Log but don't fail the whole workflow for one piece
        console.error(
          `[CalendarWorkflow] Failed to generate piece ${pieceId}:`,
          error instanceof Error ? error.message : 'Unknown'
        );
      }
    }

    return {
      success: true,
      industry: industryId,
      itemsGenerated: contentPieceIds.length,
      message: `Calendar created: ${contentPieceIds.length} pieces planned, ${generatedCount} generated with AI content.`,
    };
  },
});
