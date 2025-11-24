import type { KeywordCluster } from '@/types';

type DemoRequest = {
  url: string;
  companyName?: string;
  industry?: string;
  targetAudience?: string;
};

type DemoSeoAudit = {
  overallScore: number;
  technicalSeo: DemoAuditSection;
  onPageSeo: DemoAuditSection;
  contentQuality: DemoAuditSection;
  backlinks: DemoAuditSection;
  priorityActions: string[];
};

type DemoAuditSection = {
  score: number;
  issues: string[];
  recommendations: string[];
};

export type DemoData = {
  site: {
    url: string;
    host: string;
    companyName: string;
    industry: string;
    targetAudience: string;
    tone: 'playful' | 'friendly' | 'professional';
    monthlyRevenueGoal: string;
    lastCrawledAt: number;
  };
  seoAudit: DemoSeoAudit;
  keywordClusters: KeywordCluster[];
  contentIdeas: {
    heroStatement: string;
    taglines: string[];
    valueProps: string[];
    faqs: { question: string; answer: string }[];
  };
  plan: {
    goals: { traffic: number; leads: number; timeframe: string };
    roadmap: { week: string; focus: string; deliverables: string[] }[];
  };
  analytics: {
    trafficTrend: { month: string; visits: number }[];
    conversionRate: number;
    topPages: { title: string; change: string; visits: number }[];
  };
  socialPosts: {
    linkedin: string[];
    twitter: string[];
    instagram: string[];
  };
};

const FALLBACK_INDUSTRY = 'local services';
const FALLBACK_AUDIENCE = 'busy professionals';

export function generateDemoData(request: DemoRequest): DemoData {
  const { url, companyName, industry, targetAudience } = request;
  const host = safeHost(url);
  const inferredCompany = companyName || formatCompanyName(host);
  const inferredIndustry = industry || FALLBACK_INDUSTRY;
  const inferredAudience = targetAudience || FALLBACK_AUDIENCE;

  const tone = inferTone(inferredIndustry);
  const baseScore = 78;

  const keywordClusters: KeywordCluster[] = [
    {
      _id: `demo-cluster-1` as any,
      projectId: `demo-project` as any,
      topic: `Best ${inferredIndustry} solutions`,
      primaryKeyword: `${inferredIndustry} services`,
      supportingKeywords: [
        `${inferredIndustry} pricing`,
        `${inferredIndustry} packages`,
        `${inferredIndustry} reviews`,
      ],
      contentType: 'pillar',
      searchIntent: 'commercial',
      difficulty: 52,
      priority: 'high',
      lastAnalyzedAt: Date.now(),
      performance: {
        clicks: 180,
        impressions: 5400,
        ctr: 3.3,
        avgRank: 18,
      },
    },
    {
      _id: `demo-cluster-2` as any,
      projectId: `demo-project` as any,
      topic: `${inferredAudience} pain points`,
      primaryKeyword: `${inferredAudience} challenges`,
      supportingKeywords: [
        `${inferredAudience} guide`,
        `how to help ${inferredAudience}`,
        `${inferredAudience} tips`,
      ],
      contentType: 'guide',
      searchIntent: 'informational',
      difficulty: 38,
      priority: 'medium',
      lastAnalyzedAt: Date.now(),
      performance: {
        clicks: 95,
        impressions: 2200,
        ctr: 4.3,
        avgRank: 15,
      },
    },
    {
      _id: `demo-cluster-3` as any,
      projectId: `demo-project` as any,
      topic: `${inferredIndustry} ROI`,
      primaryKeyword: `${inferredIndustry} ROI calculator`,
      supportingKeywords: [
        `${inferredIndustry} cost savings`,
        `automating ${inferredIndustry}`,
        `${inferredIndustry} case study`,
      ],
      contentType: 'case-study',
      searchIntent: 'transactional',
      difficulty: 45,
      priority: 'high',
      lastAnalyzedAt: Date.now(),
      performance: {
        clicks: 60,
        impressions: 1100,
        ctr: 5.4,
        avgRank: 12,
      },
    },
  ];

  const seoAudit: DemoSeoAudit = {
    overallScore: baseScore,
    technicalSeo: {
      score: baseScore - 5,
      issues: [
        'Largest Contentful Paint above 3.5s on mobile',
        'Missing structured data for key templates',
        'Render-blocking scripts in the header',
      ],
      recommendations: [
        'Implement code splitting and defer non-critical JS',
        'Add FAQ + HowTo schema to top converting pages',
        'Upgrade hosting tier for faster TTFB',
      ],
    },
    onPageSeo: {
      score: baseScore + 2,
      issues: [
        'Multiple pages competing for the same keyword',
        'Thin meta descriptions on blog archive',
        'Duplicate H1 tags on service pages',
      ],
      recommendations: [
        'Assign clear primary keywords per URL',
        'Rewrite meta descriptions with unique CTAs',
        'Ensure single H1 per page with matched intent',
      ],
    },
    contentQuality: {
      score: baseScore - 3,
      issues: [
        'Blog cadence inconsistent (last post 90 days ago)',
        'Limited case studies highlighting outcomes',
        'No content repurposing strategy for social',
      ],
      recommendations: [
        'Publish 2 long-form guides per month',
        'Add success metrics to testimonial pages',
        'Turn each guide into 4-5 social snippets',
      ],
    },
    backlinks: {
      score: baseScore - 8,
      issues: [
        'Backlink profile dominated by directories',
        'Few industry publications linking back',
        'Reclaimed links not monitored',
      ],
      recommendations: [
        'Launch PR outreach for data-driven stories',
        'Sponsor 2 niche newsletters per quarter',
        'Set up link monitoring for high-value pages',
      ],
    },
    priorityActions: [
      'Fix technical SEO bottlenecks (render-blocking + schema)',
      'Consolidate cannibalizing keywords into pillar pages',
      'Launch content calendar focused on audience pain points',
      'Build authority via industry partnerships + PR',
    ],
  };

  const contentIdeas = {
    heroStatement: `${inferredCompanyName(inferredCompany)} helps ${inferredAudience} get more from ${inferredIndustry}.`,
    taglines: [
      `${inferredCompanyName(inferredCompany)} | Smarter ${inferredIndustry} for modern teams`,
      `Built for ${inferredAudience}: ${inferredIndustry} that just works`,
      `Automate the busywork. Focus on what matters.`,
    ],
    valueProps: [
      'Guided workflows with built-in best practices',
      'Real-time performance insights with clear next steps',
      'Templates that convert across SEO, email, and social',
    ],
    faqs: [
      {
        question: `How fast can I see results with ${inferredCompanyName(inferredCompany)}?`,
        answer: 'Most teams see SEO traffic lift within 4-6 weeks after publishing the recommended content plan.',
      },
      {
        question: `Do I need technical knowledge to use this platform?`,
        answer: `${inferredCompanyName(inferredCompany)} is built for operators and founders. We guide you with tooltips, templates, and AI-prepared briefs.`,
      },
      {
        question: `What makes this different from generic AI writers?`,
        answer: 'We analyze your website, audience, and goals to create channel-specific strategies, not just raw text output.',
      },
    ],
  };

  const plan = {
    goals: {
      traffic: 3000,
      leads: 120,
      timeframe: '90 days',
    },
    roadmap: [
      {
        week: 'Week 1-2',
        focus: 'Technical quick wins + analytics readiness',
        deliverables: [
          'Implement structured data on top 5 pages',
          'Clean up metadata + consolidate cannibalizing URLs',
          'Baseline analytics dashboard created',
        ],
      },
      {
        week: 'Week 3-6',
        focus: 'Content sprints + distribution',
        deliverables: [
          'Publish 3 pillar guides with supporting briefs',
          'Create 12 social snippets tied to each guide',
          'Launch newsletter experiment with curated tips',
        ],
      },
      {
        week: 'Week 7-10',
        focus: 'Authority + conversion optimization',
        deliverables: [
          'Produce 2 customer proof assets (case study + testimonial)',
          'Run CRO test on pricing or signup page',
          'Pitch guest posts to 5 industry publications',
        ],
      },
    ],
  };

  const analytics = {
    trafficTrend: [
      { month: 'Jan', visits: 1800 },
      { month: 'Feb', visits: 1950 },
      { month: 'Mar', visits: 2100 },
      { month: 'Apr', visits: 2380 },
    ],
    conversionRate: 0.035,
    topPages: [
      { title: 'Pricing', change: '+14%', visits: 620 },
      { title: 'Guide: Automation Playbook', change: '+22%', visits: 510 },
      { title: 'Blog: 2025 SEO Trends', change: '+8%', visits: 420 },
    ],
  };

  const socialPosts = {
    linkedin: [
      `🚀 ${inferredCompanyName(inferredCompany)} just updated our SEO automation playbook. Here's how ${inferredAudience} teams can launch high-converting content in 2025.`,
      `We analyzed ${host} and found three quick wins that take <45 minutes. Thread below. 👇`,
    ],
    twitter: [
      `2025 SEO formula:\n\n✔ Strategic workflows\n✔ Atomic content system\n✔ Feedback loops\n\n${inferredCompanyName(inferredCompany)} maps each step for ${inferredAudience}.`,
      `Stop publishing guesswork. Start shipping customer-ready assets. #seo #contentmarketing`,
    ],
    instagram: [
      `🎯 Mini-win for ${inferredAudience}: Convert your top performing blog into 5 social posts + 1 email drip. We packaged prompts + templates inside ${inferredCompanyName(inferredCompany)}.`,
    ],
  };

  return {
    site: {
      url,
      host,
      companyName: inferredCompany,
      industry: inferredIndustry,
      targetAudience: inferredAudience,
      tone,
      monthlyRevenueGoal: '$25k',
      lastCrawledAt: Date.now() - 1000 * 60 * 25,
    },
    seoAudit,
    keywordClusters,
    contentIdeas,
    plan,
    analytics,
    socialPosts,
  };
}

function safeHost(url: string): string {
  try {
    const parsed = new URL(url.includes('://') ? url : `https://${url}`);
    return parsed.hostname.replace('www.', '');
  } catch {
    return 'example.com';
  }
}

function formatCompanyName(host: string): string {
  return host
    .split('.')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function inferredCompanyName(name: string): string {
  return name.replace(/\s+/g, ' ').trim();
}

function inferTone(industry: string): 'playful' | 'friendly' | 'professional' {
  if (/agency|studio|creative/i.test(industry)) return 'playful';
  if (/health|wellness|education/i.test(industry)) return 'friendly';
  return 'professional';
}

