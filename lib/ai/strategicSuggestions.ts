/**
 * Strategic Content Suggestions
 *
 * Grammarly-style suggestions for improving content quality.
 * Analyzes structure, engagement, and SEO elements.
 */

export interface StrategicSuggestion {
  type:
    | 'add_statistic'
    | 'add_example'
    | 'add_cta'
    | 'add_internal_link'
    | 'strengthen_claim'
    | 'add_transition'
    | 'improve_heading'
    | 'add_list'
    | 'add_image_suggestion'
    | 'expand_section';
  section: string;
  suggestion: string;
  priority: 'low' | 'medium' | 'high';
  impact: 'seo' | 'engagement' | 'conversion' | 'readability';
}

export interface StrategicAnalysis {
  suggestions: StrategicSuggestion[];
  score: number;
  summary: {
    hasStatistics: boolean;
    hasExamples: boolean;
    hasCTA: boolean;
    hasLists: boolean;
    hasInternalLinks: boolean;
    avgSectionLength: number;
    shortSections: number;
  };
}

/**
 * Analyze content and generate strategic suggestions
 */
export function analyzeContentStrategically(
  content: string,
  contentType: string,
  keywords: string[]
): StrategicAnalysis {
  const suggestions: StrategicSuggestion[] = [];
  const primaryKeyword = keywords[0] || '';

  // Split into sections by H2
  const sections = content.split(/^## /m).filter((s) => s.trim());
  const sectionLengths = sections.map((s) => s.split(/\s+/).length);
  const avgSectionLength =
    sectionLengths.reduce((a, b) => a + b, 0) / Math.max(1, sectionLengths.length);
  const shortSections = sectionLengths.filter((l) => l < 100).length;

  // Check for statistics/data
  const hasStatistics =
    /\d+%|\d+ percent|\d+ out of \d+|\$\d+|studies show|research (shows|indicates)|according to/i.test(
      content
    );
  if (!hasStatistics) {
    suggestions.push({
      type: 'add_statistic',
      section: 'body',
      suggestion:
        'Add specific statistics or data points to increase credibility and E-E-A-T score.',
      priority: 'high',
      impact: 'seo',
    });
  }

  // Check for examples
  const hasExamples =
    /for example|for instance|such as|like when|consider (this|the)|case study|real-world/i.test(
      content
    );
  if (!hasExamples) {
    suggestions.push({
      type: 'add_example',
      section: 'body',
      suggestion: 'Add real-world examples or case studies to illustrate key points.',
      priority: 'medium',
      impact: 'engagement',
    });
  }

  // Check for CTA
  const hasCTA =
    /contact us|call (us|today|now)|schedule|book (a|your)|get (started|in touch)|sign up|subscribe|download|learn more|click here/i.test(
      content
    );
  if (!hasCTA && ['service', 'landing', 'homepage', 'leadMagnet'].includes(contentType)) {
    suggestions.push({
      type: 'add_cta',
      section: 'conclusion',
      suggestion: 'Add a clear call-to-action. For service pages, encourage contact or booking.',
      priority: 'high',
      impact: 'conversion',
    });
  }

  // Check for lists
  const hasLists = /^[-*]\s/m.test(content) || /^\d+\.\s/m.test(content);
  if (!hasLists && content.length > 1500) {
    suggestions.push({
      type: 'add_list',
      section: 'body',
      suggestion: 'Add bullet points or numbered lists to improve scannability.',
      priority: 'medium',
      impact: 'readability',
    });
  }

  // Check for internal linking opportunities
  const hasInternalLinks = /\[([^\]]+)\]\(\/[^)]+\)/i.test(content);
  if (!hasInternalLinks) {
    suggestions.push({
      type: 'add_internal_link',
      section: 'body',
      suggestion: 'Add internal links to related content on your site for SEO.',
      priority: 'medium',
      impact: 'seo',
    });
  }

  // Check for short sections
  if (shortSections > 2) {
    suggestions.push({
      type: 'expand_section',
      section: 'multiple',
      suggestion: `${shortSections} sections are under 100 words. Expand with more detail, examples, or data.`,
      priority: 'medium',
      impact: 'seo',
    });
  }

  // Check keyword usage in headings
  const h2s = content.match(/^## .+$/gm) || [];
  const keywordInH2 = h2s.some((h2) => h2.toLowerCase().includes(primaryKeyword.toLowerCase()));
  if (!keywordInH2 && primaryKeyword) {
    suggestions.push({
      type: 'improve_heading',
      section: 'headings',
      suggestion: `Include primary keyword "${primaryKeyword}" in at least one H2 heading.`,
      priority: 'high',
      impact: 'seo',
    });
  }

  // Check for weak transitions
  const transitionWords =
    /however|moreover|furthermore|additionally|consequently|therefore|nonetheless|meanwhile|subsequently|accordingly/gi;
  const transitionCount = (content.match(transitionWords) || []).length;
  if (transitionCount < 3 && sections.length > 4) {
    suggestions.push({
      type: 'add_transition',
      section: 'between sections',
      suggestion: 'Add transition sentences between sections for better flow.',
      priority: 'low',
      impact: 'readability',
    });
  }

  // Check for questions (engagement)
  const hasQuestions = /\?/.test(content.split(/^## /m)[0] || '');
  if (!hasQuestions) {
    suggestions.push({
      type: 'strengthen_claim',
      section: 'introduction',
      suggestion: 'Start with a question or bold statement to hook readers.',
      priority: 'low',
      impact: 'engagement',
    });
  }

  // Calculate strategic score
  let score = 100;
  for (const suggestion of suggestions) {
    switch (suggestion.priority) {
      case 'high':
        score -= 12;
        break;
      case 'medium':
        score -= 6;
        break;
      case 'low':
        score -= 3;
        break;
    }
  }
  score = Math.max(0, score);

  return {
    suggestions,
    score,
    summary: {
      hasStatistics,
      hasExamples,
      hasCTA,
      hasLists,
      hasInternalLinks,
      avgSectionLength: Math.round(avgSectionLength),
      shortSections,
    },
  };
}

/**
 * Generate improvement prompt based on strategic analysis
 */
export function getStrategicImprovementPrompt(analysis: StrategicAnalysis): string {
  const highPriority = analysis.suggestions.filter((s) => s.priority === 'high');
  if (highPriority.length === 0) return '';

  return `
CONTENT IMPROVEMENT REQUIRED:

${highPriority.map((s) => `- [${s.impact.toUpperCase()}] ${s.suggestion}`).join('\n')}

Focus on these specific improvements to increase overall quality score.
`.trim();
}
