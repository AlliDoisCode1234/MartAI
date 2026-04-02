import { action, ActionCtx } from '../_generated/server';
import { v } from 'convex/values';
import { api } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import { generateKeywords } from '../../lib/generators/keywordGenerator';

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
  serpNotes?: string;
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
  ): Promise<
    | {
        success: false;
        error: string;
      }
    | {
        success: true;
        reportId: string;
        metrics: FusionResult;
        keywordIdeasCreated: number;
      }
  > => {
    // Get authenticated user
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get user to check membership tier and role
    const user = await ctx.runQuery(api.users.current);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Determine rate limit tier
    let tier: MembershipTier;
    if (user.role === 'admin' || user.role === 'super_admin') {
      tier = 'admin';
    } else {
      tier = (user.membershipTier as MembershipTier) || 'starter';
    }

    // Check rate limit
    const rateLimitKey = getRateLimitKey('aiAnalysis', tier);
    const { ok, retryAfter } = await (rateLimits as unknown as { limit: (ctx: ActionCtx, key: string, opts: { key: string }) => Promise<{ ok: boolean; retryAfter: number }> }).limit(ctx, rateLimitKey, {
      key: userId as string,
    });

    if (!ok) {
      const retryMinutes = Math.ceil(retryAfter / 1000 / 60);
      return { 
        success: false, 
        error: `Rate limit exceeded. You can generate ${tier === 'starter' ? '2 reports per day' : tier === 'admin' ? '50 reports per day' : `${tier} tier limit reached`}. Try again in ${retryMinutes} minute${retryMinutes !== 1 ? 's' : ''}.`
      };
    }

    if (!args.prospectId && !args.projectId && !args.url) {
      return { success: false, error: 'Provide a prospectId, projectId, or url to analyze.' };
    }

    let target: TargetInfo;
    try {
      target = await resolveTarget(ctx, args);
    } catch (e: unknown) {
      return { success: false, error: e instanceof Error ? e.message : 'Failed to resolve analysis target' };
    }
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
      
      // -- GSC Intelligence Engine (TKT-2) --
      let gscData: { keyword: string; clicks: number; impressions: number; position: number }[] | undefined = undefined;
      if (typedProjectId) {
        try {
          // Fetch up to 100 recent GSC queries for the Optimization Engine
          const latestKeywords = await ctx.runQuery(api.analytics.gscKeywords.getLatestKeywords as never, {
            projectId: typedProjectId,
            limit: 100,
          }) as Array<{ keyword: string; clicks: number; impressions: number; position: number }> | null;
          
          if (latestKeywords && Array.isArray(latestKeywords) && latestKeywords.length > 0) {
            // Sort by impressions descending to give the LLM the highest impact keywords
            const sorted = latestKeywords.sort((a, b) => b.impressions - a.impressions).slice(0, 50);
            gscData = sorted.map((kw) => ({
              keyword: kw.keyword,
              clicks: kw.clicks,
              impressions: kw.impressions,
              position: kw.position,
            }));
          }
        } catch (e) {
          console.warn('GSC Keyword fetch failed. Falling back to Discovery Engine heuristics.', e);
        }
      }

      const keywordCandidates = await getKeywordIdeas(target, fusion, gscData);

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
        success: true,
        reportId: reportId.toString(),
        metrics: fusion,
        keywordIdeasCreated: keywordCandidates.length,
      };
    } catch (error: unknown) {
      console.error('MartAI pipeline failed', error);
      await ctx.runMutation(api.ai.reports.updateAiReport, {
        reportId,
        status: 'failed',
        summary: error instanceof Error ? error.message : 'Pipeline failed unexpectedly',
      });
      return { success: false, error: error instanceof Error ? error.message : 'Pipeline failed unexpectedly' };
    }
  },
});

async function resolveTarget(ctx: ActionCtx, args: PipelineArgs): Promise<TargetInfo> {
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

async function getKeywordIdeas(target: TargetInfo, fusion: FusionResult, gscData?: { keyword: string; clicks: number; impressions: number; position: number }[]): Promise<KeywordIdeaCandidate[]> {
  try {
    const suggestions = await generateKeywords(
      target.hints.companyName || 'Unknown Company',
      target.hints.industry || 'General',
      'Broad Audience',
      target.url,
      undefined,
      gscData
    );

    // Map back to KeywordIdeaCandidate, taking metrics strictly from gscData if it exists (TKT-3)
    return suggestions.map((s, index) => {
      // strictly enforce metric fidelity
      const realGsc = gscData?.find(g => g.keyword.toLowerCase() === s.keyword.toLowerCase());
      
      const serpNotes = realGsc 
        ? `GSC Optimization Keyword: Currently Position ${realGsc.position.toFixed(1)} with ${realGsc.clicks} clicks.` 
        : `Generated by MartAI Discovery Engine on ${new Date().toISOString()} (Estimated Volumes)`;

      return {
        primaryKeyword: s.keyword,
        supportingKeywords: s.relatedKeywords || [
          `${s.keyword} strategy`,
          `${s.intent} content ideas`
        ],
        intent: s.intent || 'informational',
        trafficPotential: realGsc ? realGsc.impressions : Math.max(10, fusion.trafficEstimate - index * 120),
        kdScore: 0,
        cpc: s.cpc || (2.5 + index),
        priority: s.priority || 'medium',
        serpNotes
      };
    });
  } catch (error) {
    console.error('Failed to generate keywords via LLM, falling back to heuristics', error);
    return generateKeywordIdeasFallback(target, fusion);
  }
}

function generateKeywordIdeasFallback(target: TargetInfo, fusion: FusionResult): KeywordIdeaCandidate[] {
  const base = target.hints.companyName?.toLowerCase().includes('chef') ? 'culinary' : 'engine';
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
    serpNotes: 'Generated via fallback math heuristics'
  }));
}

async function persistKeywordIdeas(ctx: ActionCtx, ideas: KeywordIdeaCandidate[], target: TargetInfo) {
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
      serpNotes: idea.serpNotes,
    });
  }
}

async function persistCalendarPreview(ctx: ActionCtx, ideas: KeywordIdeaCandidate[], target: TargetInfo) {
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
