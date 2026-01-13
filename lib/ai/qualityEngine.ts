/**
 * Content Quality Engine
 *
 * Unified quality scoring that combines:
 * - SEO metrics (keyword density, H2s, word count)
 * - Readability (Flesch-Kincaid)
 * - Voice consistency (persona matching)
 * - Strategic elements (CTAs, examples, data)
 *
 * This is the master quality calculator for content generation.
 */

import { calculateReadability, type ReadabilityResult } from './readability';
import { checkVoiceConsistency, type VoiceConsistencyResult } from './voiceChecker';
import { analyzeContentStrategically, type StrategicAnalysis } from './strategicSuggestions';
import type { WriterPersona } from './writerPersonas';

export interface QualityBreakdown {
  seoScore: number;
  readabilityScore: number;
  voiceScore: number;
  strategicScore: number;
}

export interface QualityReport {
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: QualityBreakdown;
  readability: ReadabilityResult;
  voice: VoiceConsistencyResult | null;
  strategic: StrategicAnalysis;
  suggestions: string[];
  passesThreshold: boolean;
}

export interface SEOMetrics {
  wordCount: number;
  wordCountScore: number;
  h2Count: number;
  h2Score: number;
  keywordCount: number;
  keywordScore: number;
  keywordDensity: number;
}

/**
 * Calculate SEO-specific metrics
 */
function calculateSEOMetrics(
  content: string,
  keywords: string[],
  targetWordCount: number = 1200
): { score: number; metrics: SEOMetrics } {
  const wordCount = content.split(/\s+/).filter((w) => w.length > 0).length;
  const h2Count = (content.match(/^## /gm) || []).length;

  const primaryKeyword = keywords[0]?.toLowerCase() || '';
  const keywordCount = primaryKeyword
    ? (
        content
          .toLowerCase()
          .match(new RegExp(primaryKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []
      ).length
    : 0;

  const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

  // Score components (0-100 each)
  const wordCountScore = Math.min(100, (wordCount / targetWordCount) * 100);
  const h2Score = Math.min(100, (h2Count / 7) * 100);

  // Optimal keyword density is 1-2%
  let keywordScore: number;
  if (keywordDensity >= 1 && keywordDensity <= 2) {
    keywordScore = 100;
  } else if (keywordDensity < 1) {
    keywordScore = keywordDensity * 100;
  } else {
    // Penalize keyword stuffing
    keywordScore = Math.max(0, 100 - (keywordDensity - 2) * 20);
  }

  // Weighted average
  const score = Math.round(wordCountScore * 0.35 + h2Score * 0.25 + keywordScore * 0.4);

  return {
    score: Math.min(100, score),
    metrics: {
      wordCount,
      wordCountScore: Math.round(wordCountScore),
      h2Count,
      h2Score: Math.round(h2Score),
      keywordCount,
      keywordScore: Math.round(keywordScore),
      keywordDensity: Math.round(keywordDensity * 100) / 100,
    },
  };
}

/**
 * Calculate overall content quality with comprehensive metrics
 */
export function calculateContentQuality(
  content: string,
  contentType: string,
  keywords: string[],
  persona?: WriterPersona,
  targetWordCount: number = 1200
): QualityReport {
  // Calculate all metric groups
  const seo = calculateSEOMetrics(content, keywords, targetWordCount);
  const readability = calculateReadability(content);
  const voice = persona ? checkVoiceConsistency(content, persona) : null;
  const strategic = analyzeContentStrategically(content, contentType, keywords);

  // Weight the scores
  // SEO: 30%, Readability: 25%, Voice: 20%, Strategic: 25%
  const voiceScore = voice?.score ?? 80; // Default if no persona

  const overallScore = Math.round(
    seo.score * 0.3 + readability.score * 0.25 + voiceScore * 0.2 + strategic.score * 0.25
  );

  // Determine grade
  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  if (overallScore >= 95) grade = 'A+';
  else if (overallScore >= 90) grade = 'A';
  else if (overallScore >= 80) grade = 'B';
  else if (overallScore >= 70) grade = 'C';
  else if (overallScore >= 60) grade = 'D';
  else grade = 'F';

  // Collect top suggestions
  const suggestions: string[] = [];

  // Add readability suggestions
  suggestions.push(...readability.suggestions);

  // Add voice suggestions (if any high severity)
  if (voice) {
    const highVoiceIssues = voice.issues.filter((i) => i.severity === 'high');
    suggestions.push(...highVoiceIssues.map((i) => i.suggestion));
  }

  // Add strategic suggestions (high priority only)
  const highStrategic = strategic.suggestions.filter((s) => s.priority === 'high');
  suggestions.push(...highStrategic.map((s) => s.suggestion));

  // Limit to top 5 suggestions
  const topSuggestions = suggestions.slice(0, 5);

  return {
    overallScore,
    grade,
    breakdown: {
      seoScore: seo.score,
      readabilityScore: readability.score,
      voiceScore,
      strategicScore: strategic.score,
    },
    readability,
    voice,
    strategic,
    suggestions: topSuggestions,
    passesThreshold: overallScore >= 90,
  };
}

/**
 * Generate improvement hints for AI regeneration
 */
export function generateImprovementHints(report: QualityReport): string {
  const hints: string[] = [];

  if (report.breakdown.seoScore < 90) {
    hints.push('INCREASE word count and keyword mentions');
  }

  if (report.breakdown.readabilityScore < 80) {
    hints.push('SIMPLIFY sentence structure and vocabulary');
  }

  if (report.breakdown.voiceScore < 80) {
    hints.push('AVOID generic AI phrases and maintain unique voice');
  }

  if (report.breakdown.strategicScore < 80) {
    hints.push('ADD statistics, examples, and clear CTA');
  }

  return hints.length > 0
    ? `QUALITY IMPROVEMENT REQUIRED:\n${hints.map((h) => `- ${h}`).join('\n')}`
    : '';
}
