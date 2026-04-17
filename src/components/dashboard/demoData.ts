export const DEMO_STATS = {
  totalClicks: 2145,
  keywordsInTop10: 42,
  sessions: 8900,
  users: 7200,
  pageViews: 14500,
  avgSessionDuration: 185, // seconds
  avgPosition: 12.4,
  impressions: 48900,
  visibilityScore: 68,
  visibilityChange: 5,
  sessionsChange: 12.4,
  pageViewsChange: 15.2,
  totalLeads: 24,
  leadConversionRate: 0.85,
  publishedPieces: 15,
};

export const DEMO_KEYWORDS_CLIMBED = [
  { keyword: 'ai content generation', rank: 3, clicks: 420 },
  { keyword: 'how to generate leads', rank: 5, clicks: 315 },
  { keyword: 'b2b marketing automation', rank: 8, clicks: 185 },
  { keyword: 'seo forecasting tools', rank: 11, clicks: 95 },
  { keyword: 'data driven marketing strategy', rank: 14, clicks: 68 },
];

export const DEMO_QUICK_WINS = [
  { keyword: 'marketing agency alternative', searchVolume: 1200, difficulty: 'Medium' },
  { keyword: 'inbound lead pipeline setup', searchVolume: 850, difficulty: 'Low' },
  { keyword: 'ai vs traditional seo', searchVolume: 2400, difficulty: 'High' },
];

export const DEMO_RECENT_CONTENT = [
  {
    _id: 'demo_1',
    title: 'The Ultimate Guide to AI Content Generation in 2026',
    wordCount: 2450,
    status: 'published',
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    contentType: 'article',
  },
  {
    _id: 'demo_2',
    title: 'Why Most B2B Agencies Fail at Predictable Lead Gen',
    wordCount: 1800,
    status: 'scheduled',
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    contentType: 'blogPost',
  },
  {
    _id: 'demo_3',
    title: 'SEO vs SEM: Where to Allocate Your Q3 Budget',
    wordCount: 3100,
    status: 'approved',
    updatedAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    contentType: 'article',
  },
];

export function getDemoGrowthTimeline() {
  const timeline = [];
  const now = new Date();
  let currentSessions = 1500;
  let currentClicks = 300;

  // Generate 30 days of compounding realistic growth data
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Compound slightly each day with some random noise
    const sessionGrowth = 1.01 + (Math.random() * 0.04);
    const clickGrowth = 1.015 + (Math.random() * 0.05);

    currentSessions = Math.floor(currentSessions * sessionGrowth);
    currentClicks = Math.floor(currentClicks * clickGrowth);

    timeline.push({
      label,
      sessions: currentSessions,
      clicks: currentClicks,
    });
  }

  return timeline;
}
