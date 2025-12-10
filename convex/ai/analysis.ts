import { action } from '../_generated/server';
import { v } from 'convex/values';
import { api } from '../_generated/api';
import type { Id } from '../_generated/dataModel';

interface ResolveTargetArgs {
  prospectId?: Id<'prospects'>;
  projectId?: Id<'projects'>;
}

interface PipelineArgs extends ResolveTargetArgs {
  url?: string;
  force?: boolean;
}

interface TargetInfo {
  prospectId?: Id<'prospects'>;
  projectId?: Id<'projects'>;
  url: string;
  hints: {
    companyName?: string;
    industry?: string;
  };
}

interface CrawlResult {
  url: string;
  htmlSample: string;
  wordCount: number;
  headings: string[];
  metadata: { title?: string; description?: string };
  loadTime: number;
}

interface FusionResult {
  summary: string;
  coverageScore: number;
  backlinksProxy: number;
  domainRatingProxy: number;
  organicKeywords: number;
  trafficEstimate: number;
  sources: string[];
}

interface KeywordIdeaCandidate {
  primaryKeyword: string;
  supportingKeywords: string[];
  intent: string;
  trafficPotential: number;
  kdScore: number;
  cpc: number;
  priority: string;
}

import { auth } from '../auth';
import { rateLimits, getRateLimitKey, type MembershipTier } from '../rateLimits';
import { ConvexError } from 'convex/values';

export const runPipeline = action({
  args: {
    prospectId: v.optional(v.id('prospects')),
    projectId: v.optional(v.id('projects')),
    url: v.optional(v.string()),
    force: v.optional(v.boolean()),
  },
  handler: async (
    ctx,
    args: PipelineArgs
  ): Promise<{
    reportId: string;
    metrics: FusionResult;
    keywordIdeasCreated: number;
  }> => {
    // Get authenticated user
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Get user to check membership tier and role
    const user = await ctx.runQuery(api.users.current);
    if (!user) {
      throw new Error('User not found');
    }

    // Determine rate limit tier
    let tier: MembershipTier;
    if (user.role === 'admin' || user.role === 'super_admin') {
      tier = 'admin';
    } else {
      tier = (user.membershipTier as MembershipTier) || 'free';
    }

    // Check rate limit
    const rateLimitKey = getRateLimitKey('aiAnalysis', tier);
    // rateLimitKey is dynamic (tier-based) so we need type assertion
    const { ok, retryAfter } = await (rateLimits as any).limit(ctx, rateLimitKey, {
      key: userId as string,
    });

    if (!ok) {
      const retryMinutes = Math.ceil(retryAfter / 1000 / 60);
      throw new ConvexError({
        kind: 'RateLimitError',
        message: `Rate limit exceeded. You can generate ${tier === 'free' ? '2 reports per day' : tier === 'admin' ? '50 reports per day' : `${tier} tier limit reached`}. Try again in ${retryMinutes} minute${retryMinutes !== 1 ? 's' : ''}.`,
        retryAfter,
      });
    }

    if (!args.prospectId && !args.projectId && !args.url) {
      throw new Error('Provide a prospectId, projectId, or url to analyze.');
    }

    const target = await resolveTarget(ctx, args);
    const typedProspectId = target.prospectId as Id<'prospects'> | undefined;
    const typedProjectId = target.projectId as Id<'projects'> | undefined;
    console.info('Starting MartAI pipeline', target);

    const initialSummary = `Running MartAI intelligence pipeline for ${target.url}`;
    const reportId = await ctx.runMutation(api.ai.reports.createAiReport, {
      prospectId: typedProspectId,
      projectId: typedProjectId,
      url: target.url,
      status: 'pending',
      summary: initialSummary,
      metrics: {
        coverageScore: 0,
        backlinksProxy: 0,
        domainRatingProxy: 0,
        organicKeywords: 0,
        trafficEstimate: 0,
      },
      confidence: {
        score: 0,
        sources: [],
      },
      dataSources: [],
    });

    try {
      const crawl = await smartCrawl(target.url);
      const fusion = await knowledgeFusion(target, crawl);
      const confidence = scoreConfidence(crawl, fusion);
      const keywordCandidates = generateKeywordIdeas(target, fusion);

      await ctx.runMutation(api.ai.reports.updateAiReport, {
        reportId,
        status: 'completed',
        summary: fusion.summary,
        metrics: {
          coverageScore: fusion.coverageScore,
          backlinksProxy: fusion.backlinksProxy,
          domainRatingProxy: fusion.domainRatingProxy,
          organicKeywords: fusion.organicKeywords,
          trafficEstimate: fusion.trafficEstimate,
        },
        confidence,
        dataSources: fusion.sources,
        crawlData: {
          title: crawl.metadata.title,
          description: crawl.metadata.description,
          wordCount: crawl.wordCount,
          headings: crawl.headings,
          loadTime: crawl.loadTime,
          htmlSample: crawl.htmlSample,
        },
      });

      await persistKeywordIdeas(ctx, keywordCandidates, {
        ...target,
        prospectId: typedProspectId,
        projectId: typedProjectId,
      });
      await persistCalendarPreview(ctx, keywordCandidates, {
        ...target,
        prospectId: typedProspectId,
        projectId: typedProjectId,
      });

      return {
        reportId: reportId.toString(),
        metrics: fusion,
        keywordIdeasCreated: keywordCandidates.length,
      };
    } catch (error: any) {
      console.error('MartAI pipeline failed', error);
      await ctx.runMutation(api.ai.reports.updateAiReport, {
        reportId,
        status: 'failed',
        summary: error?.message || 'Pipeline failed unexpectedly',
      });
      throw error;
    }
  },
});

async function resolveTarget(ctx: any, args: PipelineArgs): Promise<TargetInfo> {
  if (args.url) {
    return {
      url: normalizeUrl(args.url),
      prospectId: args.prospectId,
      projectId: args.projectId,
      hints: {},
    };
  }

  if (args.prospectId) {
    const prospectRecord = await ctx.runQuery(api.prospects.prospects.getProspect, {
      prospectId: args.prospectId,
    });
    if (!prospectRecord) {
      throw new Error('Prospect not found');
    }
    const firstUrl = prospectRecord.urls?.[0]?.url;
    if (!firstUrl) {
      throw new Error('Prospect is missing URLs to analyze');
    }
    return {
      url: normalizeUrl(firstUrl),
      prospectId: args.prospectId,
      hints: {
        companyName: prospectRecord.prospect?.companyName,
        industry: undefined,
      },
    };
  }

  if (args.projectId) {
    const project = await ctx.runQuery(api.projects.projects.getProjectById, {
      projectId: args.projectId,
    });
    if (!project) {
      throw new Error('Project not found');
    }
    return {
      url: normalizeUrl(project.websiteUrl),
      projectId: args.projectId,
      hints: {
        companyName: project.name,
        industry: project.industry,
      },
    };
  }

  throw new Error('Unable to resolve target.');
}

async function smartCrawl(url: string): Promise<CrawlResult> {
  try {
    const response = await fetch(url, { method: 'GET' });
    const html = await response.text();
    const textOnly = html.replace(/<[^>]+>/g, ' ');
    const words = textOnly.split(/\s+/).filter(Boolean);
    const loadTime = Number(response.headers.get('Server-Timing')?.split('=')[1]) || 1200;

    return {
      url,
      htmlSample: html.slice(0, 4000),
      wordCount: words.length,
      headings: extractHeadings(html),
      metadata: {
        title: extractTag(html, 'title'),
        description: extractMeta(html, 'description'),
      },
      loadTime,
    };
  } catch (error) {
    return {
      url,
      htmlSample: '',
      wordCount: 0,
      headings: [],
      metadata: {},
      loadTime: 0,
    };
  }
}

async function knowledgeFusion(target: TargetInfo, crawl: CrawlResult): Promise<FusionResult> {
  const coverageScore = Math.min(100, Math.round(crawl.wordCount / 25));
  const backlinksProxy = Math.round(coverageScore * 2.1);
  const domainRatingProxy = Math.min(100, Math.round(backlinksProxy / 3));
  const organicKeywords = Math.max(25, Math.round(coverageScore * 3));
  const trafficEstimate = Math.round(organicKeywords * 12);

  const summary = [
    `Analyzed ${target.hints.companyName || 'the site'} (${target.url}).`,
    `Estimated traffic: ${trafficEstimate.toLocaleString()} visits / mo.`,
    `Keyword coverage: ${coverageScore}% with ~${organicKeywords} organic phrases.`,
  ].join(' ');

  return {
    summary,
    coverageScore,
    backlinksProxy,
    domainRatingProxy,
    organicKeywords,
    trafficEstimate,
    sources: ['smart_crawl', 'heuristic_ai'],
  };
}

function scoreConfidence(crawl: CrawlResult, fusion: FusionResult) {
  const hasContent = crawl.wordCount > 0 ? 40 : 0;
  const hasMeta = crawl.metadata.title ? 15 : 0;
  const combined = Math.min(100, hasContent + hasMeta + fusion.coverageScore * 0.3);
  return {
    score: Math.round(combined),
    sources: ['smart_crawl', 'heuristic_ai'],
  };
}

function generateKeywordIdeas(target: TargetInfo, fusion: FusionResult): KeywordIdeaCandidate[] {
  const base = target.hints.companyName?.toLowerCase().includes('chef') ? 'culinary' : 'growth';
  const intents = ['informational', 'commercial', 'transactional'];
  return intents.map((intent, index) => ({
    primaryKeyword: `${base} ${intent} strategy ${index + 1}`,
    supportingKeywords: [
      `${base} keyword research`,
      `${intent} content ideas`,
      `${base} automation`,
    ],
    intent,
    trafficPotential: fusion.trafficEstimate - index * 120,
    kdScore: Math.max(12, fusion.domainRatingProxy - index * 5),
    cpc: 2.5 + index,
    priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
  }));
}

async function persistKeywordIdeas(ctx: any, ideas: KeywordIdeaCandidate[], target: TargetInfo) {
  for (const idea of ideas) {
    await ctx.runMutation(api.seo.keywordIdeas.createKeywordIdea, {
      prospectId: target.prospectId,
      projectId: target.projectId,
      primaryKeyword: idea.primaryKeyword,
      supportingKeywords: idea.supportingKeywords,
      intent: idea.intent,
      trafficPotential: idea.trafficPotential,
      kdScore: idea.kdScore,
      cpc: idea.cpc,
      priority: idea.priority,
      serpNotes: `Generated by MartAI pipeline on ${new Date().toISOString()}`,
    });
  }
}

async function persistCalendarPreview(ctx: any, ideas: KeywordIdeaCandidate[], target: TargetInfo) {
  if (!target.projectId || ideas.length === 0) {
    return;
  }

  const firstIdea = ideas[0];
  await ctx.runMutation(api.content.calendars.upsertCalendarItem, {
    projectId: target.projectId,
    prospectId: target.prospectId,
    title: `Keyword Focus: ${capitalize(firstIdea.primaryKeyword)}`,
    contentType: 'long_form_article',
    primaryKeyword: firstIdea.primaryKeyword,
    supportingKeywords: firstIdea.supportingKeywords,
    status: 'idea',
    publishDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
    notes: 'Autogenerated by MartAI intelligence layer. Adjust schedule before committing.',
  });
}

function extractTag(html: string, tag: string) {
  const match = html.match(new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, 'i'));
  return match ? match[1].trim() : undefined;
}

function extractMeta(html: string, name: string) {
  const regex = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["'](.*?)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : undefined;
}

function extractHeadings(html: string) {
  const matches = Array.from(html.matchAll(/<(h[1-3])[^>]*>(.*?)<\/\1>/gi));
  return matches.map((m) => m[2].replace(/<[^>]+>/g, '').trim());
}

function normalizeUrl(url: string) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

function capitalize(str?: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
