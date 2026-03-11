/**
 * Metric Descriptions
 *
 * Centralized tooltip text for all ambiguous metrics across the member portal.
 * Used by MetricTooltip to provide consistent, accessible explanations.
 */

export const METRIC_DESCRIPTIONS: Record<string, string> = {
  // Dashboard KPIs
  'phoo-rating':
    'Your SEO health score (0-100) based on visibility, keyword strategy, content execution, topic clusters, and GEO readiness. Higher is better.',
  'leads-generated':
    'Conversion events attributed to your organic content, tracked via your GTM Measurement ID.',
  'site-traffic': 'Total unique organic visitors to your site in the last 30 days (from GA4).',
  sessions:
    'Total organic visits in the last 30 days. A single user can generate multiple sessions (from GA4).',
  'avg-session': 'Average time a visitor spends on your site per visit. Longer usually means more engaged users.',
  'avg-rank':
    'Your average position in Google search results. Lower is better — position 1 means you appear first.',
  'click-rate':
    'The percentage of people who click your link after seeing it in Google search results.',

  // Keyword metrics
  kd: 'Keyword Difficulty (0-100). How hard it is to rank on page 1 for this keyword. Lower means easier to rank.',
  'foundation-keywords':
    'Informational and awareness-stage keywords that build topical authority and attract early-stage visitors.',
  'authority-keywords':
    'Expert-level, competitive keywords that establish your domain as a thought leader in your industry.',
  'revenue-ready-keywords':
    'Bottom-of-funnel keywords with transactional or commercial intent that directly drive leads and conversions.',
  'total-keywords': 'All tracked keywords across every intent stage in your keyword library.',

  // Intelligence metrics
  'coverage-score': 'How comprehensively your content covers the key topics in your industry (0-100).',
  confidence:
    "How confident Phoo's AI analysis is in the accuracy of this report, based on data completeness.",
  'organic-keywords': 'The number of keywords your site currently ranks for in organic search.',
  'traffic-estimate': 'Estimated monthly organic traffic based on your keyword positions and search volumes.',

  // PR Score
  pr: 'Phoo Rating — your composite SEO health score. Combines visibility, traffic health, CTR, engagement, content velocity, and quick-win potential.',
  visibility: 'How frequently your site appears in search results relative to your keyword portfolio.',
  'traffic-health': 'The quality and consistency of your organic traffic patterns over time.',
  'ctr-performance': 'How well your search snippets convert impressions into clicks vs. industry benchmarks.',
  'engagement-quality': 'How deeply users engage with your content — session duration, pages per session, and bounce rate.',
  'quick-win-potential': 'How many keywords are close to page 1 that could be boosted with targeted content.',
  'content-velocity': 'The rate at which you are publishing new content relative to your strategy goals.',
} as const;
