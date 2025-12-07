import { action } from '../_generated/server';
import { v } from 'convex/values';
import { api } from '../_generated/api';
import { auth } from '../auth';
import { rateLimits, getRateLimitKey, type MembershipTier } from '../rateLimits';
import { ConvexError } from 'convex/values';

export const analyzeCompetitor = action({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const user = await ctx.runQuery((api as any).users.current);
    if (!user) {
      throw new Error('User not found');
    }

    // Determine tier
    let tier: MembershipTier;
    if (user.role === 'admin' || user.role === 'super_admin') {
      tier = 'admin';
    } else {
      tier = (user.membershipTier as MembershipTier) || 'free';
    }

    // Check Rate Limit (aiAnalysis limit)
    const rateLimitKey = getRateLimitKey('aiAnalysis', tier);
    const { ok, retryAfter } = await rateLimits.limit(ctx, rateLimitKey as any, {
      key: userId as string,
    });

    if (!ok) {
      const retryHours = Math.ceil(retryAfter / 1000 / 60 / 60);
      throw new ConvexError({
        kind: 'RateLimitError',
        message: `Analysis limit reached for ${tier} tier. Try again in ${retryHours} hour(s) or upgrade.`,
        retryAfter,
      });
    }

    // validate URL
    let targetUrl = args.url;
    if (!targetUrl.startsWith('http')) {
      targetUrl = `https://${targetUrl}`;
    }

    try {
      // 1. Basic Fetch for Metadata
      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }
      const html = await response.text();

      // Simple regex extraction (cheerio is heavy/not available in standard edge runtime without polyfills sometimes, but we are in node auth usually. We'll use regex for speed here or cheerio if installed. Package.json has cheerio!)
      // Let's use cheerio since it is in package.json
      const cheerio = await import('cheerio');
      const $ = cheerio.load(html);

      const title = $('title').text();
      const description = $('meta[name="description"]').attr('content') || '';
      const h1s = $('h1')
        .map((i, el) => $(el).text())
        .get();
      const keywords = $('meta[name="keywords"]').attr('content')?.split(',') || [];

      // 2. Simulate "Advanced" Metrics (Since we don't have Ahrefs/SEMRush connected yet)
      // In a real app, this would call an external SEO API.
      const simulatedTraffic = Math.floor(Math.random() * 5000) + 100;
      const simulatedDA = Math.floor(Math.random() * 90) + 10;

      const metrics = {
        traffic: simulatedTraffic,
        keywords: keywords.length > 0 ? keywords.length : Math.floor(Math.random() * 50) + 5,
        domainAuthority: simulatedDA,
      };

      const metadata = {
        title,
        description,
        h1Count: h1s.length,
        server: response.headers.get('server') || 'Unknown',
        loadTime: Math.floor(Math.random() * 200) + 50, // simulated ms
      };

      // 3. Store Results
      const analysisId = await ctx.runMutation(
        (api as any).analytics.adhoc.storeCompetitorAnalysis,
        {
          url: targetUrl,
          metrics,
          status: 'completed',
          metadata,
          cost: 0, // Placeholder for neutral-cost
        }
      );

      return {
        success: true,
        data: {
          url: targetUrl,
          metrics,
          metadata,
        },
      };
    } catch (error: any) {
      // Record failure
      await ctx.runMutation((api as any).analytics.adhoc.storeCompetitorAnalysis, {
        url: targetUrl,
        metrics: {},
        status: 'failed',
        metadata: { error: error.message },
        cost: 0,
      });
      throw new Error(`Analysis failed: ${error.message}`);
    }
  },
});

import { mutation } from '../_generated/server';

export const storeCompetitorAnalysis = mutation({
  args: {
    url: v.string(),
    metrics: v.object({
      traffic: v.optional(v.number()),
      keywords: v.optional(v.number()),
      domainAuthority: v.optional(v.number()),
    }),
    status: v.string(),
    metadata: v.optional(v.any()),
    cost: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    return await ctx.db.insert('competitorAnalytics', {
      userId,
      ...args,
      createdAt: Date.now(),
    });
  },
});
