import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export interface BriefDetails {
  titleOptions: string[];
  h2Outline: string[];
  faqs: Array<{ question: string; answer: string }>;
  metaTitle: string;
  metaDescription: string;
  internalLinks: string[];
  schemaSuggestion: string;
}

export interface ClusterInfo {
  clusterName: string;
  keywords: string[];
  intent: string;
  volumeRange: { min: number; max: number };
}

/**
 * Generate brief details from keyword cluster
 */
export async function generateBriefDetails(
  cluster: ClusterInfo,
  websiteUrl?: string,
  industry?: string,
  brandVoice?: string
): Promise<BriefDetails> {
  // Check for OpenAI API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OpenAI API key not found. Using mock data for brief generation.');
    return generateMockBrief(cluster);
  }

  const model = openai('gpt-4o');

  const prompt = `You are an SEO content strategist creating a detailed content brief.

${websiteUrl ? `Website: ${websiteUrl}` : ''}
${industry ? `Industry: ${industry}` : ''}
${brandVoice ? `Brand Voice: ${brandVoice}` : ''}

Keyword Cluster: ${cluster.clusterName}
Keywords: ${cluster.keywords.join(', ')}
Intent: ${cluster.intent}
Volume: ${cluster.volumeRange.min}-${cluster.volumeRange.max} searches/month

Create a comprehensive content brief with:

1. **Title Options** (3-5 variations):
   - SEO-optimized, compelling titles
   - Include primary keyword naturally
   - 50-60 characters for best CTR
   - Mix of question, how-to, and benefit-driven formats

2. **H2 Outline** (6-10 main sections):
   - Logical content flow
   - Cover user intent comprehensively
   - Include comparison/cost sections if commercial intent
   - Progressive disclosure from basics to advanced

3. **FAQs** (5-8 questions):
   - Address common user questions
   - Include long-tail keyword variations
   - Provide concise, helpful answers
   - Cover objections and concerns

4. **Meta Title** (50-60 chars):
   - Primary keyword included
   - Compelling and click-worthy
   - Brand name if space allows

5. **Meta Description** (150-160 chars):
   - Summarize value proposition
   - Include call-to-action
   - Primary keyword naturally included

6. **Internal Links** (5-10 suggestions):
   - Related content topics
   - Pillar page connections
   - Supporting articles
   - Format as topic suggestions, not URLs

7. **Schema Suggestion**:
   - Recommended schema.org type (FAQPage, HowTo, Article, Product, etc.)
   - Brief explanation of why

Return ONLY a valid JSON object with this exact structure (no markdown):
{
  "titleOptions": ["string"],
  "h2Outline": ["string"],
  "faqs": [{"question": "string", "answer": "string"}],
  "metaTitle": "string",
  "metaDescription": "string",
  "internalLinks": ["string"],
  "schemaSuggestion": "string"
}`;

  try {
    const result = await generateText({
      model,
      prompt,
      temperature: 0.7,
    });

    // Parse the JSON response
    let briefData;
    try {
      const jsonMatch =
        result.text.match(/```json\n([\s\S]*?)\n```/) ||
        result.text.match(/```\n([\s\S]*?)\n```/) ||
        result.text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : result.text;
      briefData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, result.text);
      throw new Error('Invalid response from AI');
    }

    // Validate and format
    return {
      titleOptions: briefData.titleOptions ?? [],
      h2Outline: briefData.h2Outline ?? [],
      faqs: Array.isArray(briefData.faqs)
        ? briefData.faqs.map((f: any) => ({
            question: f.question ?? f.q ?? '',
            answer: f.answer ?? f.a ?? '',
          }))
        : [],
      metaTitle: briefData.metaTitle ?? '',
      metaDescription: briefData.metaDescription ?? '',
      internalLinks: briefData.internalLinks ?? [],
      schemaSuggestion: briefData.schemaSuggestion ?? 'Article',
    };
  } catch (error) {
    console.error('Error generating brief details:', error);
    console.warn('Falling back to mock data for brief generation.');
    return generateMockBrief(cluster);
  }
}

/**
 * Generate mock brief for testing without API key
 */
function generateMockBrief(cluster: ClusterInfo): BriefDetails {
  const mainKeyword = cluster.keywords[0] ?? cluster.clusterName;
  const capitalizedKeyword = mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1);

  return {
    titleOptions: [
      `The Ultimate Guide to ${capitalizedKeyword} in 2025`,
      `How to Master ${capitalizedKeyword}: A Step-by-Step Guide`,
      `${capitalizedKeyword}: Everything You Need to Know`,
      `5 Proven Strategies for ${capitalizedKeyword} Success`,
      `Why ${capitalizedKeyword} Matters for Your Business`,
    ],
    h2Outline: [
      `What is ${capitalizedKeyword}?`,
      `Benefits of ${capitalizedKeyword}`,
      `How ${capitalizedKeyword} Works`,
      `Key Features to Look For`,
      `Common Mistakes to Avoid`,
      `Best Practices for ${capitalizedKeyword}`,
      `Future Trends in ${capitalizedKeyword}`,
      `Conclusion`,
    ],
    faqs: [
      {
        question: `What is the cost of ${mainKeyword}?`,
        answer: `The cost of ${mainKeyword} varies depending on your specific needs and the scope of implementation. Generally, you can expect...`,
      },
      {
        question: `How long does it take to see results from ${mainKeyword}?`,
        answer: `Results from ${mainKeyword} typically start to appear within 3-6 months, though this can vary based on...`,
      },
      {
        question: `Is ${mainKeyword} suitable for small businesses?`,
        answer: `Yes, ${mainKeyword} is highly scalable and can be adapted for businesses of all sizes, including small startups.`,
      },
    ],
    metaTitle: `${capitalizedKeyword}: The Complete Guide for 2025 | BrandName`,
    metaDescription: `Learn everything about ${mainKeyword} in this comprehensive guide. Discover strategies, benefits, and best practices to grow your business today.`,
    internalLinks: [
      `Related Topic A`,
      `Related Topic B`,
      `Advanced ${capitalizedKeyword} Strategies`,
      `Case Studies`,
    ],
    schemaSuggestion: `Article`,
  };
}

/**
 * Validate SEO checklist items
 */
export function validateSEOChecklist(brief: BriefDetails): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Title options
  if (brief.titleOptions.length < 3) {
    issues.push('Need at least 3 title options');
  }

  // H2 outline
  if (brief.h2Outline.length < 5) {
    issues.push('Need at least 5 H2 sections for comprehensive content');
  }

  // Meta title length
  if (brief.metaTitle.length > 60) {
    issues.push(`Meta title too long (${brief.metaTitle.length} chars, max 60)`);
  }
  if (brief.metaTitle.length < 30) {
    issues.push(`Meta title too short (${brief.metaTitle.length} chars, min 30)`);
  }

  // Meta description length
  if (brief.metaDescription.length > 160) {
    issues.push(`Meta description too long (${brief.metaDescription.length} chars, max 160)`);
  }
  if (brief.metaDescription.length < 120) {
    issues.push(`Meta description too short (${brief.metaDescription.length} chars, min 120)`);
  }

  // FAQs
  if (brief.faqs.length < 3) {
    issues.push('Need at least 3 FAQs for better SEO');
  }

  // Internal links
  if (brief.internalLinks.length < 3) {
    issues.push('Need at least 3 internal link suggestions');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
