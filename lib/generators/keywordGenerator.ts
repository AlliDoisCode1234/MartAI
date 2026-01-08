import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { withRetry } from '../utils';

export interface KeywordSuggestion {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
  cpc?: number;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  relatedKeywords?: string[];
}

export async function generateKeywords(
  companyName: string,
  industry: string,
  targetAudience: string,
  website: string,
  existingContent?: string[]
): Promise<KeywordSuggestion[]> {
  // Note: Retrier, rate limiting, and caching are implemented in the Convex layer
  // See: convex/lib/services/intelligence.ts and convex/rateLimits.ts

  // Skip OpenAI call if key is not available
  if (!process.env.OPENAI_API_KEY && !process.env.VERCEL_AI_GATEWAY_KEY) {
    console.warn('OpenAI API key not found, returning mock keywords');
    return [
      {
        keyword: `${industry} services`,
        intent: 'commercial',
        priority: 'high',
        reasoning: 'Primary service keyword (Mock Data)',
        searchVolume: 1000,
        difficulty: 45,
      },
      {
        keyword: `best ${industry} for ${targetAudience}`,
        intent: 'commercial',
        priority: 'high',
        reasoning: 'High intent long-tail keyword (Mock Data)',
        searchVolume: 500,
        difficulty: 30,
      },
      {
        keyword: `${industry} trends 2025`,
        intent: 'informational',
        priority: 'medium',
        reasoning: 'Trending topic for authority (Mock Data)',
        searchVolume: 2000,
        difficulty: 60,
      },
      {
        keyword: `how to choose ${industry}`,
        intent: 'informational',
        priority: 'medium',
        reasoning: 'Educational content for top of funnel (Mock Data)',
        searchVolume: 800,
        difficulty: 25,
      },
      {
        keyword: `${industry} pricing`,
        intent: 'transactional',
        priority: 'high',
        reasoning: 'Bottom of funnel intent (Mock Data)',
        searchVolume: 300,
        difficulty: 50,
      },
    ];
  }

  const model = openai('gpt-4o');

  const prompt = `You are an expert SEO keyword researcher. Generate a comprehensive list of 20-30 high-value keywords for ${companyName}, a ${industry} company targeting ${targetAudience}.

Website: ${website}

Consider:
1. Primary service/product keywords
2. Long-tail keywords with buyer intent
3. Local SEO keywords if applicable
4. Competitor analysis keywords
5. Content gap opportunities
6. Commercial and transactional intent keywords

For each keyword, provide:
- The keyword phrase
- Estimated search intent (informational, commercial, transactional, navigational)
- Priority level (high, medium, low) based on relevance and opportunity
- Brief reasoning for why this keyword is valuable
- 2-3 related keyword variations

Focus on keywords that would help improve their website's visibility and drive qualified traffic.`;

  const result = await withRetry(
    async () => {
      return await generateText({
        model,
        prompt,
        tools: {
          generateKeywords: tool({
            description: 'Generate SEO keyword suggestions with intent, priority, and reasoning',
            inputSchema: z.object({
              keywords: z.array(
                z.object({
                  keyword: z.string().describe('The keyword phrase'),
                  intent: z
                    .enum(['informational', 'commercial', 'transactional', 'navigational'])
                    .describe('Search intent'),
                  priority: z.enum(['high', 'medium', 'low']).describe('Priority level'),
                  reasoning: z.string().describe('Why this keyword is valuable'),
                  relatedKeywords: z
                    .array(z.string())
                    .optional()
                    .describe('Related keyword variations'),
                  estimatedVolume: z
                    .number()
                    .optional()
                    .describe('Estimated monthly search volume'),
                  estimatedDifficulty: z
                    .number()
                    .optional()
                    .describe('Estimated keyword difficulty 0-100'),
                })
              ),
            }),
            execute: async ({ keywords }) => {
              return keywords.map((kw) => ({
                keyword: kw.keyword,
                searchVolume: kw.estimatedVolume,
                difficulty: kw.estimatedDifficulty,
                intent: kw.intent,
                priority: kw.priority,
                reasoning: kw.reasoning,
                relatedKeywords: kw.relatedKeywords,
              }));
            },
          }),
        },
      });
    },
    {
      onRetry: (err: unknown, attempt: number) =>
        console.log(
          `Retry attempt ${attempt} for generateKeywords:`,
          err instanceof Error ? err.message : String(err)
        ),
    }
  );

  const toolResults = result.toolResults ?? [];
  if (toolResults.length > 0) {
    const firstResult = toolResults[0] as { output?: unknown; result?: unknown };
    // Check for 'output' or 'result' property
    const output = firstResult?.output ?? firstResult?.result;
    if (output && Array.isArray(output)) {
      return output as KeywordSuggestion[];
    }
  }

  // Fallback: parse from text if tool didn't execute
  return parseKeywordsFromText(result.text);
}

function parseKeywordsFromText(text: string): KeywordSuggestion[] {
  const keywords: KeywordSuggestion[] = [];
  const lines = text.split('\n').filter((line) => line.trim());

  let currentKeyword: Partial<KeywordSuggestion> | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Check if line contains a keyword
    if (trimmed.match(/^\d+\.|^[-*]/) || trimmed.includes('keyword:')) {
      if (currentKeyword && currentKeyword.keyword) {
        keywords.push({
          keyword: currentKeyword.keyword,
          intent: currentKeyword.intent ?? 'informational',
          priority: currentKeyword.priority ?? 'medium',
          reasoning: currentKeyword.reasoning ?? '',
        } as KeywordSuggestion);
      }

      const keywordMatch = trimmed.match(/(?:keyword:)?\s*([^:]+)/i);
      if (keywordMatch) {
        currentKeyword = {
          keyword: keywordMatch[1].trim(),
          intent: 'informational',
          priority: 'medium',
          reasoning: '',
        };
      }
    } else if (currentKeyword) {
      if (trimmed.toLowerCase().includes('intent:')) {
        const intentMatch = trimmed.match(/intent:\s*(\w+)/i);
        if (intentMatch) {
          const intent = intentMatch[1].toLowerCase();
          if (['informational', 'commercial', 'transactional', 'navigational'].includes(intent)) {
            currentKeyword.intent = intent as KeywordSuggestion['intent'];
          }
        }
      } else if (trimmed.toLowerCase().includes('priority:')) {
        const priorityMatch = trimmed.match(/priority:\s*(\w+)/i);
        if (priorityMatch) {
          const priority = priorityMatch[1].toLowerCase();
          if (['high', 'medium', 'low'].includes(priority)) {
            currentKeyword.priority = priority as KeywordSuggestion['priority'];
          }
        }
      } else if (
        trimmed.toLowerCase().includes('reasoning:') ||
        trimmed.toLowerCase().includes('why:')
      ) {
        currentKeyword.reasoning = trimmed.split(':').slice(1).join(':').trim();
      } else if (!currentKeyword.reasoning) {
        currentKeyword.reasoning = trimmed;
      }
    }
  }

  if (currentKeyword && currentKeyword.keyword) {
    keywords.push({
      keyword: currentKeyword.keyword,
      intent: currentKeyword.intent ?? 'informational',
      priority: currentKeyword.priority ?? 'medium',
      reasoning: currentKeyword.reasoning ?? '',
    } as KeywordSuggestion);
  }

  return keywords.slice(0, 30); // Limit to 30 keywords
}
