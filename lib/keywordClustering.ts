import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Keyword cluster schema
const KeywordClusterSchema = z.object({
  clusterName: z.string().describe('A descriptive name for this keyword cluster'),
  keywords: z.array(z.string()).describe('Array of related keywords in this cluster'),
  intent: z
    .enum(['informational', 'commercial', 'transactional', 'navigational'])
    .describe('Search intent of this cluster'),
  estimatedVolume: z
    .object({
      min: z.number().describe('Minimum estimated monthly search volume'),
      max: z.number().describe('Maximum estimated monthly search volume'),
    })
    .describe('Estimated search volume range'),
  difficulty: z.number().min(0).max(100).describe('Estimated ranking difficulty (0-100)'),
  reasoning: z.string().describe('Brief explanation of why these keywords are grouped together'),
});

const ClusteringResultSchema = z.object({
  clusters: z.array(KeywordClusterSchema).describe('Array of keyword clusters'),
  summary: z.string().describe('Summary of the clustering analysis'),
});

export interface KeywordInput {
  keyword: string;
  volume?: number;
  difficulty?: number;
  cpc?: number;
  intent?: string;
}

export interface ClusterResult {
  clusterName: string;
  keywords: string[];
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  volumeRange: { min: number; max: number };
  difficulty: number;
  impactScore: number;
  topSerpUrls: string[];
  reasoning?: string;
}

/**
 * Generate keyword clusters from a list of keywords
 */
export async function generateKeywordClusters(
  keywords: KeywordInput[],
  websiteUrl?: string,
  industry?: string
): Promise<ClusterResult[]> {
  if (keywords.length === 0) {
    return [];
  }

  // Prepare keyword list for AI
  const keywordList = keywords.map((k) => ({
    keyword: k.keyword,
    volume: k.volume ?? 0,
    difficulty: k.difficulty ?? 50,
    intent: k.intent ?? 'unknown',
  }));

  // Check for OpenAI API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OpenAI API key not found. Using mock data for keyword clustering.');
    return generateMockClusters(keywords);
  }

  const prompt = `You are an SEO expert analyzing keywords for clustering. 

${websiteUrl ? `Website: ${websiteUrl}` : ''}
${industry ? `Industry: ${industry}` : ''}

Analyze the following keywords and group them into logical clusters based on:
1. Semantic similarity and search intent
2. User journey stage (awareness → consideration → purchase)
3. Topic/thematic relevance
4. Search volume patterns

Keywords to analyze:
${JSON.stringify(keywordList, null, 2)}

For each cluster, provide:
- A descriptive cluster name
- All keywords that belong together
- Search intent (informational, commercial, transactional, navigational)
- Estimated volume range (min/max)
- Difficulty estimate (0-100, where 0 is easy to rank, 100 is very competitive)
- Brief reasoning for the grouping

Create 5-15 clusters depending on the number of keywords. Prioritize clusters with high commercial or transactional intent.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "clusters": [
    {
      "clusterName": "string",
      "keywords": ["string"],
      "intent": "informational|commercial|transactional|navigational",
      "estimatedVolume": {"min": number, "max": number},
      "difficulty": number,
      "reasoning": "string"
    }
  ],
  "summary": "string"
}`;

  try {
    const model = openai('gpt-4o');

    const result = await generateText({
      model,
      prompt,
      temperature: 0.7,
    });

    // Parse the JSON response
    let clustersData;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch =
        result.text.match(/```json\n([\s\S]*?)\n```/) ||
        result.text.match(/```\n([\s\S]*?)\n```/) ||
        result.text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : result.text;
      clustersData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, result.text);
      throw new Error('Invalid response from AI');
    }

    // Validate with schema
    const validated = ClusteringResultSchema.parse(clustersData);

    // Convert to ClusterResult format and calculate impact scores
    const clusters: ClusterResult[] = validated.clusters.map((cluster) => {
      // Calculate impact score
      const avgVolume = (cluster.estimatedVolume.min + cluster.estimatedVolume.max) / 2;
      const normalizedVolume = Math.min(avgVolume / 10000, 1);

      const intentScores: Record<string, number> = {
        transactional: 1.0,
        commercial: 0.8,
        informational: 0.6,
        navigational: 0.4,
      };

      const intentScore = intentScores[cluster.intent] ?? 0.5;
      const normalizedDifficulty = 1 - cluster.difficulty / 100;

      // Impact = volume_weight*volume + intent_weight*intent - difficulty_weight*difficulty
      const volumeWeight = 0.4;
      const intentWeight = 0.3;
      const difficultyWeight = 0.3;

      const impactScore =
        volumeWeight * normalizedVolume +
        intentWeight * intentScore +
        difficultyWeight * normalizedDifficulty;

      return {
        clusterName: cluster.clusterName,
        keywords: cluster.keywords,
        intent: cluster.intent as any,
        volumeRange: cluster.estimatedVolume,
        difficulty: cluster.difficulty,
        impactScore: Math.round(impactScore * 100) / 100,
        topSerpUrls: [], // Will be populated by SERP analysis
        reasoning: cluster.reasoning,
      };
    });

    // Sort by impact score descending
    clusters.sort((a, b) => b.impactScore - a.impactScore);

    return clusters;
  } catch (error) {
    console.error('Error generating keyword clusters:', error);
    console.warn('Falling back to mock data for keyword clustering.');
    return generateMockClusters(keywords);
  }
}

/**
 * Generate mock clusters for testing without API key
 */
function generateMockClusters(keywords: KeywordInput[]): ClusterResult[] {
  // Group keywords into chunks of 3-5
  const chunkSize = 4;
  const clusters: ClusterResult[] = [];

  for (let i = 0; i < keywords.length; i += chunkSize) {
    const chunk = keywords.slice(i, i + chunkSize);
    const mainKeyword = chunk[0].keyword;

    // Determine intent based on keyword
    let intent: 'informational' | 'commercial' | 'transactional' | 'navigational' = 'informational';
    if (
      mainKeyword.includes('buy') ||
      mainKeyword.includes('price') ||
      mainKeyword.includes('cost')
    ) {
      intent = 'transactional';
    } else if (
      mainKeyword.includes('best') ||
      mainKeyword.includes('vs') ||
      mainKeyword.includes('review')
    ) {
      intent = 'commercial';
    }

    // Calculate mock metrics
    const avgVolume = chunk.reduce((sum, k) => sum + (k.volume || 100), 0) / chunk.length;
    const avgDifficulty = chunk.reduce((sum, k) => sum + (k.difficulty || 50), 0) / chunk.length;

    // Calculate impact score
    const normalizedVolume = Math.min(avgVolume / 10000, 1);
    const intentScores = {
      transactional: 1.0,
      commercial: 0.8,
      informational: 0.6,
      navigational: 0.4,
    };
    const intentScore = intentScores[intent];
    const normalizedDifficulty = 1 - avgDifficulty / 100;
    const impactScore = 0.4 * normalizedVolume + 0.3 * intentScore + 0.3 * normalizedDifficulty;

    clusters.push({
      clusterName: `${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)} Cluster`,
      keywords: chunk.map((k) => k.keyword),
      intent,
      volumeRange: { min: Math.floor(avgVolume * 0.8), max: Math.floor(avgVolume * 1.2) },
      difficulty: Math.round(avgDifficulty),
      impactScore: Math.round(impactScore * 100) / 100,
      topSerpUrls: [],
      reasoning: 'Mock cluster generated for testing purposes.',
    });
  }

  return clusters.sort((a, b) => b.impactScore - a.impactScore);
}

/**
 * Analyze SERP for a keyword cluster
 */
export async function analyzeSerpForCluster(
  keywords: string[],
  maxUrls: number = 5
): Promise<string[]> {
  // For now, return empty array
  // In production, this would:
  // 1. Call Google Custom Search API or SERP API
  // 2. Get top ranking URLs for the primary keyword
  // 3. Cache results for 24 hours
  // 4. Return top URLs

  // Placeholder: could integrate with SerpAPI, DataForSEO, or similar
  return [];
}

/**
 * Re-rank clusters by impact score with custom weights
 */
export function rerankClustersByImpact(
  clusters: ClusterResult[],
  volumeWeight: number = 0.4,
  intentWeight: number = 0.3,
  difficultyWeight: number = 0.3
): ClusterResult[] {
  const intentScores: Record<string, number> = {
    transactional: 1.0,
    commercial: 0.8,
    informational: 0.6,
    navigational: 0.4,
  };

  return clusters
    .map((cluster) => {
      const avgVolume = (cluster.volumeRange.min + cluster.volumeRange.max) / 2;
      const normalizedVolume = Math.min(avgVolume / 10000, 1);
      const intentScore = intentScores[cluster.intent] ?? 0.5;
      const normalizedDifficulty = 1 - cluster.difficulty / 100;

      const impactScore =
        volumeWeight * normalizedVolume +
        intentWeight * intentScore +
        difficultyWeight * normalizedDifficulty;

      return {
        ...cluster,
        impactScore: Math.round(impactScore * 100) / 100,
      };
    })
    .sort((a, b) => b.impactScore - a.impactScore);
}

/**
 * Import keywords from GSC data
 */
export function importKeywordsFromGSC(gscData: any): KeywordInput[] {
  if (!gscData?.rows) {
    return [];
  }

  return gscData.rows.map((row: any) => ({
    keyword: row.keys?.[0] || '',
    volume: row.impressions || 0,
    difficulty: 50, // Default, can be enhanced with external API
    intent: 'informational', // Default, can be enhanced with AI
  }));
}
