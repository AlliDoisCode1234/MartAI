import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export interface BriefInfo {
  title: string;
  titleOptions?: string[];
  h2Outline?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  metaTitle?: string;
  metaDescription?: string;
  internalLinks?: string[];
  schemaSuggestion?: string;
  cluster?: {
    clusterName: string;
    keywords: string[];
    intent: string;
  };
}

export interface DraftResult {
  content: string; // Markdown
  qualityScore: number; // 0-100
  toneScore: number; // 0-100
  wordCount: number;
  issues: string[];
  strengths: string[];
}

/**
 * Generate content draft from brief
 */
/**
 * Construct the prompt for draft generation
 */
export function constructDraftPrompt(
  brief: BriefInfo,
  websiteUrl?: string,
  industry?: string,
  brandVoice?: string,
  regenerationNotes?: string,
  ragContext?: string
): string {
  const primaryTitle =
    brief.titleOptions && brief.titleOptions.length > 0 ? brief.titleOptions[0] : brief.title;

  return `You are an expert SEO content writer creating a comprehensive, high-quality blog post.

${websiteUrl ? `Website: ${websiteUrl}` : ''}
${industry ? `Industry: ${industry}` : ''}
${brandVoice ? `Brand Voice: ${brandVoice}` : ''}
${regenerationNotes ? `Previous feedback: ${regenerationNotes}` : ''}
${ragContext ? `\nRELEVANT CONTEXT (Use this to add depth, examples, and competitive nuance):\n${ragContext}\n` : ''}

**Content Brief:**
Title: ${primaryTitle}
${brief.metaDescription ? `Meta: ${brief.metaDescription}` : ''}
${brief.cluster ? `Keywords: ${brief.cluster.keywords.join(', ')}` : ''}
${brief.cluster ? `Intent: ${brief.cluster.intent}` : ''}

**H2 Outline:**
${brief.h2Outline?.map((h, i) => `${i + 1}. ${h}`).join('\n') ?? 'Create logical sections'}

**FAQs to Address:**
${brief.faqs?.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n') ?? ''}

Write a comprehensive, SEO-optimized blog post that:

1. **Structure**:
   - Use the primary title as H1
   - Follow the H2 outline exactly
   - Include all FAQs naturally in the content
   - Use H3 for subsections
   - Include internal link placeholders: [[topic name]]

2. **Content Quality**:
   - Minimum 800 words (target 1200-2000)
   - Write in-depth, valuable content
   - Include transparent sections for costs, problems, comparisons where relevant
   - Use the keyword cluster naturally throughout
   - Address user intent comprehensively
   - Include examples, data, and actionable insights

3. **Tone & Style**:
   ${brandVoice ? `- Match brand voice: ${brandVoice}` : '- Professional yet approachable'}
   - Clear and engaging
   - Avoid fluff and filler
   - Use active voice
   - Include specific details and numbers

4. **SEO Optimization**:
   - Include primary keyword in first paragraph
   - Use keyword variations naturally
   - Add internal link placeholders: [[related topic]]
   - Ensure proper heading hierarchy
   - Include schema-worthy content

Return the content as clean markdown. Start with the H1 title, then proceed with the content.`;
}

/**
 * Process the generated content to calculate scores and identify issues
 */
export function processDraftResult(
  content: string,
  brief: BriefInfo,
  brandVoice?: string
): DraftResult {
  const wordCount = content.split(/\s+/).length;

  // Calculate quality and tone scores
  const qualityScore = calculateQualityScore(content, brief);
  const toneScore = calculateToneScore(content, brandVoice);

  // Identify issues and strengths
  const { issues, strengths } = analyzeDraft(content, brief, wordCount);

  return {
    content,
    qualityScore,
    toneScore,
    wordCount,
    issues,
    strengths,
  };
}

/**
 * Generate content draft from brief
 */
export async function generateDraftFromBrief(
  brief: BriefInfo,
  websiteUrl?: string,
  industry?: string,
  brandVoice?: string,
  regenerationNotes?: string,
  ragContext?: string
): Promise<DraftResult> {
  // Check for OpenAI API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OpenAI API key not found. Using mock data for draft generation.');
    return generateMockDraft(brief);
  }

  const model = openai('gpt-4o');
  const prompt = constructDraftPrompt(
    brief,
    websiteUrl,
    industry,
    brandVoice,
    regenerationNotes,
    ragContext
  );

  try {
    const result = await generateText({
      model,
      prompt,
      temperature: 0.7,
    });

    return processDraftResult(result.text, brief, brandVoice);
  } catch (error) {
    console.error('Error generating draft:', error);
    console.warn('Falling back to mock data for draft generation.');
    return generateMockDraft(brief);
  }
}

/**
 * Generate mock draft for testing without API key
 */
function generateMockDraft(brief: BriefInfo): DraftResult {
  const primaryTitle =
    brief.titleOptions && brief.titleOptions.length > 0 ? brief.titleOptions[0] : brief.title;

  const sections = brief.h2Outline ?? [
    'Introduction',
    'Main Point 1',
    'Main Point 2',
    'Conclusion',
  ];

  let content = `# ${primaryTitle}\n\n`;

  // Introduction
  content += `In today's fast-paced digital landscape, understanding **${brief.cluster?.keywords[0] ?? 'this topic'}** is more important than ever. Whether you're a beginner or an expert, this guide will walk you through everything you need to know.\n\n`;

  // Generate sections
  sections.forEach((section) => {
    content += `## ${section}\n\n`;
    content += `This is a placeholder section for "${section}". In a real article, this would contain detailed, high-quality content generated by AI. It would discuss the nuances of the topic, provide examples, and offer actionable advice.\n\n`;
    content += `For example, consider the impact of [[related topic]] on your strategy. Data shows that 75% of businesses see improvement when they implement these practices.\n\n`;
    content += `### Key Takeaways\n\n- Point 1: Important detail about ${section}\n- Point 2: Another crucial aspect\n- Point 3: Actionable tip for immediate implementation\n\n`;
  });

  // FAQs
  if (brief.faqs && brief.faqs.length > 0) {
    content += `## Frequently Asked Questions\n\n`;
    brief.faqs.forEach((faq) => {
      content += `### ${faq.question}\n\n${faq.answer}\n\n`;
    });
  }

  // Conclusion
  content += `## Conclusion\n\n`;
  content += `Mastering **${brief.cluster?.keywords[0] ?? 'this topic'}** takes time and effort, but the results are worth it. Start implementing these strategies today to see a real difference in your performance.\n\n`;

  const wordCount = content.split(/\s+/).length;

  return {
    content,
    qualityScore: 85,
    toneScore: 90,
    wordCount,
    issues: ['Mock data used - content is repetitive'],
    strengths: ['Good structure', 'FAQs included', 'Internal links present'],
  };
}

/**
 * Calculate quality score based on content metrics
 */
function calculateQualityScore(content: string, brief: BriefInfo): number {
  let score = 50; // Base score

  const wordCount = content.split(/\s+/).length;

  // Word count (target 1200-2000)
  if (wordCount >= 1200 && wordCount <= 2000) {
    score += 20;
  } else if (wordCount >= 800 && wordCount < 1200) {
    score += 10;
  } else if (wordCount < 800) {
    score -= 20;
  }

  // H2 structure
  const h2Count = (content.match(/^##\s/gm) || []).length;
  if (h2Count >= 5) score += 10;
  else if (h2Count < 3) score -= 10;

  // FAQs included
  if (brief.faqs && brief.faqs.length > 0) {
    const faqKeywords = brief.faqs.map((f) => f.question.split(' ')[0]).join('|');
    const faqMentions = (content.match(new RegExp(faqKeywords, 'gi')) || []).length;
    if (faqMentions >= brief.faqs.length) score += 10;
  }

  // Internal link placeholders
  const internalLinks = (content.match(/\[\[([^\]]+)\]\]/g) || []).length;
  if (internalLinks >= 3) score += 10;

  // Keyword usage
  if (brief.cluster && brief.cluster.keywords.length > 0) {
    const primaryKeyword = brief.cluster.keywords[0];
    const keywordCount = (content.match(new RegExp(primaryKeyword, 'gi')) || []).length;
    if (keywordCount >= 3 && keywordCount <= 10) score += 10;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate tone score (simplified)
 */
function calculateToneScore(content: string, brandVoice?: string): number {
  let score = 70; // Base score

  // Check for active voice
  const passiveVoice = (content.match(/\b(is|are|was|were)\s+\w+ed\b/gi) || []).length;
  if (passiveVoice < content.split('.').length * 0.1) score += 10;

  // Check for engaging language
  const engagingWords = (
    content.match(/\b(you|your|we|our|let's|discover|learn|explore)\b/gi) || []
  ).length;
  if (engagingWords > 20) score += 10;

  // Check for specific details (numbers, examples)
  const hasNumbers = /\d+/.test(content);
  const hasExamples = content.includes('for example') || content.includes('such as');
  if (hasNumbers && hasExamples) score += 10;

  return Math.min(100, Math.max(0, score));
}

/**
 * Analyze draft for issues and strengths
 */
function analyzeDraft(
  content: string,
  brief: BriefInfo,
  wordCount: number
): { issues: string[]; strengths: string[] } {
  const issues: string[] = [];
  const strengths: string[] = [];

  // Word count
  if (wordCount < 800) {
    issues.push(`Content too short (${wordCount} words, minimum 800)`);
  } else if (wordCount >= 1200) {
    strengths.push(`Comprehensive length (${wordCount} words)`);
  }

  // H2 structure
  const h2Count = (content.match(/^##\s/gm) || []).length;
  if (h2Count < 5) {
    issues.push(`Insufficient H2 sections (${h2Count}, recommend 5+)`);
  } else {
    strengths.push(`Well-structured with ${h2Count} main sections`);
  }

  // FAQs
  if (brief.faqs && brief.faqs.length > 0) {
    const faqCoverage = brief.faqs.filter((faq) =>
      content.toLowerCase().includes(faq.question.toLowerCase().split(' ')[0])
    ).length;
    if (faqCoverage < brief.faqs.length) {
      issues.push(`Not all FAQs addressed (${faqCoverage}/${brief.faqs.length})`);
    } else {
      strengths.push('All FAQs naturally integrated');
    }
  }

  // Internal links
  const internalLinks = (content.match(/\[\[([^\]]+)\]\]/g) || []).length;
  if (internalLinks < 3) {
    issues.push(`Few internal link placeholders (${internalLinks}, recommend 3+)`);
  } else {
    strengths.push(`${internalLinks} internal link opportunities`);
  }

  // Keyword usage
  if (brief.cluster && brief.cluster.keywords.length > 0) {
    const primaryKeyword = brief.cluster.keywords[0];
    const keywordCount = (content.match(new RegExp(primaryKeyword, 'gi')) || []).length;
    if (keywordCount < 3) {
      issues.push(`Primary keyword underused (${keywordCount} times)`);
    } else if (keywordCount > 15) {
      issues.push(`Primary keyword overused (${keywordCount} times, may be keyword stuffing)`);
    } else {
      strengths.push(`Natural keyword usage (${keywordCount} times)`);
    }
  }

  return { issues, strengths };
}

/**
 * Validate SEO checklist for draft
 */
export function validateDraftSEO(
  draft: DraftResult,
  brief: BriefInfo
): {
  valid: boolean;
  checklist: Array<{ item: string; passed: boolean; note?: string }>;
} {
  const checklist = [
    {
      item: 'Word count ≥ 800',
      passed: draft.wordCount >= 800,
      note: `${draft.wordCount} words`,
    },
    {
      item: 'Quality score ≥ 70',
      passed: draft.qualityScore >= 70,
      note: `Score: ${draft.qualityScore}`,
    },
    {
      item: 'Tone score ≥ 70',
      passed: draft.toneScore >= 70,
      note: `Score: ${draft.toneScore}`,
    },
    {
      item: 'H2 sections ≥ 5',
      passed: (draft.content.match(/^##\s/gm) || []).length >= 5,
    },
    {
      item: 'Internal links ≥ 3',
      passed: (draft.content.match(/\[\[([^\]]+)\]\]/g) || []).length >= 3,
    },
    {
      item: 'FAQs addressed',
      passed: brief.faqs
        ? brief.faqs.every((faq) =>
            draft.content.toLowerCase().includes(faq.question.toLowerCase().split(' ')[0])
          )
        : true,
    },
  ];

  const valid = checklist.every((item) => item.passed);

  return { valid, checklist };
}
