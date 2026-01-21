/**
 * Google SEO Feed Integration
 *
 * Monitors Google Search Central Blog for algorithm updates and SEO changes.
 * Stores updates and can trigger notifications for major changes.
 *
 * Official Sources:
 * - Google Search Central Blog: https://developers.google.com/search/blog
 * - Search Status Dashboard: https://status.search.google.com/
 */

import { action, mutation, query, internalAction, internalMutation } from '../_generated/server';
import { v } from 'convex/values';
import { internal, api } from '../_generated/api';

// ============================================================================
// Types
// ============================================================================

interface SeoUpdateEntry {
  title: string;
  link: string;
  publishedAt: number;
  summary: string;
  category: 'algorithm' | 'feature' | 'documentation' | 'announcement' | 'other';
  severity: 'critical' | 'important' | 'informational';
}

// ============================================================================
// Queries
// ============================================================================

/**
 * Get recent SEO updates
 */
export const getRecentUpdates = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    return await ctx.db.query('seoUpdates').order('desc').take(limit);
  },
});

/**
 * Get critical updates that haven't been acknowledged
 */
export const getCriticalUpdates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('seoUpdates')
      .filter((q) =>
        q.and(q.eq(q.field('severity'), 'critical'), q.eq(q.field('acknowledged'), false))
      )
      .order('desc')
      .collect();
  },
});

// ============================================================================
// Mutations
// ============================================================================

/**
 * Store a new SEO update
 */
export const storeUpdate = internalMutation({
  args: {
    title: v.string(),
    link: v.string(),
    publishedAt: v.number(),
    summary: v.string(),
    category: v.union(
      v.literal('algorithm'),
      v.literal('feature'),
      v.literal('documentation'),
      v.literal('announcement'),
      v.literal('other')
    ),
    severity: v.union(v.literal('critical'), v.literal('important'), v.literal('informational')),
  },
  handler: async (ctx, args) => {
    // Check if update already exists
    const existing = await ctx.db
      .query('seoUpdates')
      .filter((q) => q.eq(q.field('link'), args.link))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert('seoUpdates', {
      ...args,
      acknowledged: false,
      createdAt: Date.now(),
    });
  },
});

/**
 * Acknowledge an update (user has seen it)
 */
export const acknowledgeUpdate = mutation({
  args: {
    updateId: v.id('seoUpdates'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.updateId, {
      acknowledged: true,
      acknowledgedAt: Date.now(),
    });
  },
});

// ============================================================================
// Actions
// ============================================================================

/**
 * Fetch and process Google Search Central Blog RSS feed
 * This should be run by a cron job (weekly recommended)
 */
export const fetchGoogleSeoFeed = internalAction({
  args: {},
  handler: async (ctx) => {
    console.log('[SEO Feed] Fetching Google Search Central Blog...');

    try {
      // Google Search Central Blog RSS feed
      const feedUrl = 'https://developers.google.com/search/blog/feed.xml';

      const response = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'Phoo-SEO-Monitor/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`Feed fetch failed: ${response.status}`);
      }

      const xmlText = await response.text();

      // Parse RSS feed (simple XML parsing)
      const entries = parseRssFeed(xmlText);

      console.log(`[SEO Feed] Found ${entries.length} entries`);

      // Store each entry
      let newCount = 0;
      for (const entry of entries.slice(0, 20)) {
        // Last 20 entries
        const category = categorizeUpdate(entry.title, entry.summary);
        const severity = determineSeverity(entry.title, entry.summary);

        await ctx.runMutation(internal.seo.googleSeoFeed.storeUpdate, {
          title: entry.title,
          link: entry.link,
          publishedAt: entry.publishedAt,
          summary: entry.summary,
          category,
          severity,
        });
        newCount++;
      }

      console.log(`[SEO Feed] Stored ${newCount} updates`);

      return {
        success: true,
        entriesFound: entries.length,
        entriesStored: newCount,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[SEO Feed] Error:', message);
      return {
        success: false,
        error: message,
      };
    }
  },
});

/**
 * Manually trigger SEO feed refresh (admin only)
 */
export const refreshSeoFeed = action({
  args: {},
  handler: async (ctx) => {
    return await ctx.runAction(internal.seo.googleSeoFeed.fetchGoogleSeoFeed, {});
  },
});

// ============================================================================
// Helpers
// ============================================================================

/**
 * Simple RSS feed parser for Google blog
 */
function parseRssFeed(xml: string): SeoUpdateEntry[] {
  const entries: SeoUpdateEntry[] = [];

  // Match <entry> elements (Atom feed format)
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entryXml = match[1];

    // Extract title
    const titleMatch = /<title[^>]*>([^<]+)<\/title>/.exec(entryXml);
    const title = titleMatch ? decodeHtmlEntities(titleMatch[1]) : 'Untitled';

    // Extract link
    const linkMatch = /<link[^>]*href="([^"]+)"[^>]*\/>/.exec(entryXml);
    const link = linkMatch ? linkMatch[1] : '';

    // Extract published date
    const publishedMatch = /<published>([^<]+)<\/published>/.exec(entryXml);
    const publishedAt = publishedMatch ? new Date(publishedMatch[1]).getTime() : Date.now();

    // Extract summary/content
    const summaryMatch = /<summary[^>]*>([^<]+)<\/summary>/.exec(entryXml);
    const contentMatch = /<content[^>]*>([\s\S]*?)<\/content>/.exec(entryXml);
    const summary = summaryMatch
      ? decodeHtmlEntities(summaryMatch[1]).slice(0, 500)
      : contentMatch
        ? decodeHtmlEntities(contentMatch[1].replace(/<[^>]+>/g, '')).slice(0, 500)
        : '';

    entries.push({
      title,
      link,
      publishedAt,
      summary,
      category: 'other',
      severity: 'informational',
    });
  }

  return entries;
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

/**
 * Categorize update based on content
 */
function categorizeUpdate(
  title: string,
  summary: string
): 'algorithm' | 'feature' | 'documentation' | 'announcement' | 'other' {
  const text = `${title} ${summary}`.toLowerCase();

  if (
    text.includes('core update') ||
    text.includes('algorithm') ||
    text.includes('ranking') ||
    text.includes('spam update') ||
    text.includes('helpful content')
  ) {
    return 'algorithm';
  }

  if (
    text.includes('new feature') ||
    text.includes('now available') ||
    text.includes('introducing')
  ) {
    return 'feature';
  }

  if (text.includes('documentation') || text.includes('guide') || text.includes('best practices')) {
    return 'documentation';
  }

  if (text.includes('announce') || text.includes('deprecat') || text.includes('change')) {
    return 'announcement';
  }

  return 'other';
}

/**
 * Determine severity based on content
 */
function determineSeverity(
  title: string,
  summary: string
): 'critical' | 'important' | 'informational' {
  const text = `${title} ${summary}`.toLowerCase();

  // Critical: Core algorithm updates, major ranking changes
  if (
    text.includes('core update') ||
    text.includes('spam update') ||
    text.includes('major change') ||
    text.includes('ranking system') ||
    text.includes('helpful content update')
  ) {
    return 'critical';
  }

  // Important: New features, deprecations
  if (
    text.includes('deprecat') ||
    text.includes('new feature') ||
    text.includes('required') ||
    text.includes('must') ||
    text.includes('deadline')
  ) {
    return 'important';
  }

  return 'informational';
}
