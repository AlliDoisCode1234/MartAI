import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export interface PlanGoals {
  traffic?: number;
  leads?: number;
  revenue?: number;
}

export interface BriefPlaceholder {
  title: string;
  scheduledDate: number;
  clusterId?: string;
  week: number;
  dayOfWeek: number;
}

export interface QuarterlyPlan {
  contentVelocity: number;
  startDate: number;
  goals: PlanGoals;
  assumptions: string;
  briefs: BriefPlaceholder[];
}

/**
 * Generate a 12-week quarterly plan with brief placeholders
 */
export function generateQuarterlyPlan(
  contentVelocity: number, // posts per week
  startDate: number = Date.now(),
  goals: PlanGoals = {},
  keywordClusters: Array<{ _id: string; clusterName: string; impactScore: number }> = []
): BriefPlaceholder[] {
  const briefs: BriefPlaceholder[] = [];
  const weeks = 12;
  const totalPosts = weeks * contentVelocity;

  // Sort clusters by impact score
  const sortedClusters = [...keywordClusters].sort((a, b) => b.impactScore - a.impactScore);

  // Distribute posts across 12 weeks
  let postIndex = 0;
  for (let week = 0; week < weeks; week++) {
    // Distribute posts evenly across the week
    const daysPerPost = 7 / contentVelocity;
    
    for (let post = 0; post < contentVelocity; post++) {
      const dayOffset = week * 7 + Math.floor(post * daysPerPost);
      const scheduledDate = startDate + (dayOffset * 24 * 60 * 60 * 1000);
      
      // Assign cluster based on impact (prioritize high-impact clusters)
      const clusterIndex = postIndex % sortedClusters.length;
      const cluster = sortedClusters[clusterIndex];
      
      briefs.push({
        title: cluster 
          ? `Content for ${cluster.clusterName}` 
          : `Content Brief ${postIndex + 1}`,
        scheduledDate,
        clusterId: cluster?._id,
        week: week + 1,
        dayOfWeek: dayOffset % 7,
      });
      
      postIndex++;
    }
  }

  return briefs;
}

/**
 * Generate plan assumptions and goals summary using AI
 */
export async function generatePlanSummary(
  contentVelocity: number,
  goals: PlanGoals,
  keywordClustersCount: number,
  industry?: string
): Promise<string> {
  const model = openai('gpt-4o');
  
  const prompt = `You are an SEO strategist creating a quarterly content plan summary.

Content Velocity: ${contentVelocity} posts per week
Keyword Clusters: ${keywordClustersCount}
${industry ? `Industry: ${industry}` : ''}
Goals: ${JSON.stringify(goals)}

Generate a concise plan summary (2-3 sentences) that includes:
1. Expected outcomes based on content velocity
2. Key assumptions about traffic and engagement
3. Strategic focus areas

Be realistic and data-driven.`;

  try {
    const result = await generateText({
      model,
      prompt,
      temperature: 0.7,
    });

    return result.text;
  } catch (error) {
    console.error('Error generating plan summary:', error);
    return `Quarterly plan with ${contentVelocity} posts/week targeting ${keywordClustersCount} keyword clusters.`;
  }
}

/**
 * Calculate estimated traffic based on content velocity and assumptions
 */
export function estimateTraffic(
  contentVelocity: number,
  avgTrafficPerPost: number = 100, // Default assumption
  weeks: number = 12
): number {
  const totalPosts = contentVelocity * weeks;
  return Math.round(totalPosts * avgTrafficPerPost);
}

/**
 * Calculate estimated leads based on traffic and conversion rate
 */
export function estimateLeads(
  estimatedTraffic: number,
  conversionRate: number = 0.02 // 2% default
): number {
  return Math.round(estimatedTraffic * conversionRate);
}

/**
 * Check for scheduling conflicts
 */
export function checkSchedulingConflicts(
  briefs: BriefPlaceholder[],
  toleranceHours: number = 24
): Array<{ brief1: BriefPlaceholder; brief2: BriefPlaceholder }> {
  const conflicts: Array<{ brief1: BriefPlaceholder; brief2: BriefPlaceholder }> = [];
  
  for (let i = 0; i < briefs.length; i++) {
    for (let j = i + 1; j < briefs.length; j++) {
      const timeDiff = Math.abs(briefs[i].scheduledDate - briefs[j].scheduledDate);
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff < toleranceHours) {
        conflicts.push({ brief1: briefs[i], brief2: briefs[j] });
      }
    }
  }
  
  return conflicts;
}

