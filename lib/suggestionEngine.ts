/**
 * Suggestion Engine
 *
 * Pure business logic for generating content coaching suggestions
 * based on SEO score breakdowns. Extracted from ContentSuggestionsPanel
 * for testability.
 *
 * This module is deterministic — no AI calls, no side effects.
 * It maps numeric scores to human-readable coaching and AI-targeted fixInstructions.
 */

import type { SEOScoreResult } from './seoScoring';
import { countKeywordsUsed, INDUSTRY_READABILITY } from './seoScoring';

// ============================================================================
// Types
// ============================================================================

export type SuggestionSeverity = 'issue' | 'suggestion' | 'tip' | 'success';
export type SuggestionCategory = 'readability' | 'keywords' | 'structure' | 'wordcount';

/** Icon key used to map to the actual React icon in the UI layer */
export type SuggestionIconKey = 'edit' | 'type' | 'hash' | 'file';

export interface Suggestion {
  id: string;
  category: SuggestionCategory;
  severity: SuggestionSeverity;
  title: string;
  coaching: string;
  /** AI-targeted instruction for Fix with Phoo (different from human-facing coaching) */
  fixInstruction?: string;
  /** Icon key — mapped to actual React icon in the UI component */
  iconKey: SuggestionIconKey;
  fixable: boolean;
}

// ============================================================================
// Suggestion Generation (Deterministic Rules)
// ============================================================================

export function generateSuggestions(
  score: SEOScoreResult,
  content: string,
  keywords: string[],
  targetWordCount: number,
  industry?: string
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const { metrics } = score;
  const wordCount = (content || '').split(/\s+/).filter((w) => w.length > 0).length;

  // ── Readability (industry-calibrated) ─────────────────────────────────
  // readabilityScore is already industry-normalized (0-100) from seoScoring.ts
  const thresholds = INDUSTRY_READABILITY[industry || ''] || INDUSTRY_READABILITY.default;
  const isDenseIndustry = thresholds.floor <= 35; // tech, healthcare, legal, finance

  if (metrics.readabilityScore < 40) {
    suggestions.push({
      id: 'readability-hard',
      category: 'readability',
      severity: 'issue',
      title: 'Readability needs work',
      coaching: isDenseIndustry
        ? 'Even for your technical audience, this is too dense. Try splitting long sentences, using bullet lists, and defining jargon on first use.'
        : 'Your writing is dense — readers may bounce before finishing. Try splitting sentences over 20 words, swapping jargon for simpler words, and breaking up long paragraphs into 3-4 sentence chunks.',
      fixInstruction: `CRITICAL: Current readability score is ${metrics.readabilityScore}/100. You MUST raise it above 60/100. To do this:\n1. Break EVERY sentence longer than 20 words into two shorter sentences.\n2. Replace ALL jargon and complex vocabulary with simpler, everyday words.\n3. Split ALL paragraphs longer than 4 sentences into shorter paragraphs.\n4. Add bullet lists for any lists of 3+ items.\n5. Use active voice instead of passive voice throughout.\n6. Add transition words between paragraphs.\nKeep ALL the same information but make it dramatically easier to read. This is not a light polish — the content needs a significant rewrite for clarity.\n\nCRITICAL CONSTRAINT: You MUST maintain or increase the current word count of ${wordCount} words. Do NOT shorten the content. Do NOT break the outline structure or remove any H2 headings. Only improve readability while keeping everything else intact.`,
      iconKey: 'edit',
      fixable: true,
    });
  } else if (metrics.readabilityScore < 60) {
    suggestions.push({
      id: 'readability-medium',
      category: 'readability',
      severity: 'suggestion',
      title: isDenseIndustry ? 'Could be slightly clearer' : 'Almost readable',
      coaching: isDenseIndustry
        ? 'Your content is acceptably technical, but a few simpler transitions would improve flow. Your audience can handle complexity — just make sure it\'s intentional, not accidental.'
        : 'You\'re close! A few shorter sentences and simpler word choices will make this much easier to scan. Aim for a conversational tone — write like you\'re explaining to a smart friend.',
      fixInstruction: `Current readability score is ${metrics.readabilityScore}/100. You MUST raise it to at least 65/100 (above the 60-point threshold). To do this:\n1. Find the 5-10 longest sentences and split each into two shorter ones.\n2. Replace complex words with simpler alternatives (e.g., "utilize" -> "use", "approximately" -> "about").\n3. Use a conversational tone — write like explaining to a smart friend.\n4. Add transition phrases between paragraphs for better flow.\nKeep the same content but make it noticeably more readable. A light polish is NOT enough — the score must cross 60.\n\nCRITICAL CONSTRAINT: You MUST maintain or increase the current word count of ${wordCount} words. Do NOT shorten the content. Do NOT break the outline structure or remove any H2 headings. Only improve readability while keeping everything else intact.`,
      iconKey: 'edit',
      fixable: true,
    });
  } else if (metrics.readabilityScore >= 80) {
    suggestions.push({
      id: 'readability-great',
      category: 'readability',
      severity: 'success',
      title: isDenseIndustry
        ? 'Well-calibrated for your technical audience'
        : 'Excellent readability',
      coaching: isDenseIndustry
        ? 'Your content strikes the right balance of depth and clarity for your industry.'
        : 'Your writing flows naturally. Readers will find this easy to digest.',
      iconKey: 'edit',
      fixable: false,
    });
  }

  // ── Keywords ─────────────────────────────────────────────────────
  if (keywords.length > 0) {
    const usedCount = countKeywordsUsed(content, keywords);
    const missingKeywords = keywords.filter(
      (kw) => !(content || '').toLowerCase().includes(kw.toLowerCase())
    );

    if (missingKeywords.length > 0) {
      const severity: SuggestionSeverity =
        missingKeywords.length > keywords.length / 2 ? 'issue' : 'suggestion';
      suggestions.push({
        id: 'keywords-missing',
        category: 'keywords',
        severity,
        title: `${missingKeywords.length} keyword${missingKeywords.length > 1 ? 's' : ''} missing`,
        coaching: `Weave these naturally into your writing: ${missingKeywords.slice(0, 5).map((k) => `"${k}"`).join(', ')}${missingKeywords.length > 5 ? ` and ${missingKeywords.length - 5} more` : ''}. Don't force them — find spots where they fit the flow.`,
        fixInstruction: `Naturally weave these keywords into the content: ${missingKeywords.slice(0, 5).map((k) => `"${k}"`).join(', ')}. Add them where they fit the context naturally — in headings, topic sentences, or supporting details. Do NOT keyword-stuff. The content should read naturally.\n\nCRITICAL CONSTRAINT: Do NOT reduce word count, break the outline structure, or reduce readability. Only add keywords while keeping all other metrics equal or better.`,
        iconKey: 'type',
        fixable: true,
      });
    } else if (usedCount === keywords.length) {
      suggestions.push({
        id: 'keywords-complete',
        category: 'keywords',
        severity: 'success',
        title: 'All keywords covered',
        coaching: 'Every target keyword appears in your content. Well done.',
        iconKey: 'type',
        fixable: false,
      });
    }
  }

  // ── Word Count ───────────────────────────────────────────────────
  const wordRatio = wordCount / targetWordCount;
  if (wordRatio < 0.5) {
    suggestions.push({
      id: 'wordcount-low',
      category: 'wordcount',
      severity: 'issue',
      title: 'Content is too short',
      coaching: `You're at ${wordCount.toLocaleString()} words — aim for ${targetWordCount.toLocaleString()} to compete for this topic. Add depth: examples, data points, "how-to" steps, or expert quotes.`,
      fixInstruction: `CRITICAL: This content is only ${wordCount} words. You MUST expand it to AT LEAST ${targetWordCount} words (currently ${Math.round((wordCount/targetWordCount)*100)}% of target). This is a hard requirement — do not return content shorter than ${targetWordCount} words.\n\nTo reach the target:\n1. Expand EVERY existing section with 2-3 additional paragraphs of depth, real-world examples, and data points.\n2. Add at least 2-3 NEW subsections covering related subtopics.\n3. Add a comprehensive FAQ section with 5+ questions and detailed 3-4 sentence answers.\n4. Add step-by-step instructions or how-to guides where relevant.\n5. Include expert insights, statistics, or case studies.\n\nThe final output MUST be at least ${targetWordCount} words. Count carefully.\n\nCRITICAL CONSTRAINT: You MUST maintain ALL existing H2 headings and outline structure. Do NOT remove or rename any sections. Do NOT reduce readability — keep sentences clear and scannable. Only ADD content, do not remove or simplify existing content.`,
      iconKey: 'file',
      fixable: true,
    });
  } else if (wordRatio < 0.8) {
    const wordsNeeded = targetWordCount - wordCount;
    suggestions.push({
      id: 'wordcount-medium',
      category: 'wordcount',
      severity: 'tip',
      title: 'Almost there on word count',
      coaching: `${wordsNeeded.toLocaleString()} more words to hit the sweet spot. Consider expanding your weakest section or adding a FAQ.`,
      fixInstruction: `This content is ${wordCount} words but needs to be at least ${targetWordCount} words. You MUST add at least ${wordsNeeded} more words — this is a hard requirement, not a suggestion.\n\nTo reach the target:\n1. Expand the thinnest sections with additional depth, examples, and detail.\n2. Add a FAQ section with 3-5 common questions and detailed 3-4 sentence answers.\n3. Add practical examples or case studies to support key points.\n4. Elaborate on any claims that lack supporting evidence.\n\nThe final output MUST be at least ${targetWordCount} words total.\n\nCRITICAL CONSTRAINT: You MUST maintain ALL existing H2 headings and outline structure. Do NOT remove or rename any sections. Do NOT reduce readability — keep sentences clear and scannable. Only ADD content, do not remove or simplify existing content.`,
      iconKey: 'file',
      fixable: true,
    });
  } else if (wordRatio >= 1) {
    suggestions.push({
      id: 'wordcount-great',
      category: 'wordcount',
      severity: 'success',
      title: 'Word count on target',
      coaching: `${wordCount.toLocaleString()} words — strong depth for this topic.`,
      iconKey: 'file',
      fixable: false,
    });
  }

  // ── Structure (H2s) ──────────────────────────────────────────────
  if (metrics.h2Score < 50) {
    suggestions.push({
      id: 'structure-low',
      category: 'structure',
      severity: 'suggestion',
      title: 'Add more sections',
      coaching:
        'Search engines love scannable structure. Break your content into clear H2 sections — each covering one subtopic. Aim for 5-7 sections for a comprehensive piece.',
      fixInstruction: `Reorganize this content into 5-7 clearly defined H2 sections, each covering a distinct subtopic. Add H3 subsections where appropriate. Make the structure scannable with clear headings that tell the reader what each section covers.\n\nCRITICAL CONSTRAINT: You MUST maintain or increase the current word count of ${wordCount} words. Do NOT reduce readability. Keep all existing content — only improve the heading structure and organization.`,
      iconKey: 'hash',
      fixable: true,
    });
  } else if (metrics.structureScore < 70) {
    suggestions.push({
      id: 'structure-outline',
      category: 'structure',
      severity: 'tip',
      title: 'Check your outline coverage',
      coaching:
        'Some sections from your brief outline aren\'t reflected in the content yet. Review your brief and make sure each topic is addressed.',
      fixInstruction: `Some sections from the original outline are not fully covered in the content. Identify any outline topics that are missing or underrepresented, then seamlessly integrate them into the article.\n\nRULES:\n1. Do NOT add a "Missing Sections" header or any meta-commentary about what was missing. The reader should never know sections were added after the fact.\n2. Do NOT use emojis anywhere in the content.\n3. Integrate each missing topic as a natural H2 or H3 section that fits the flow of the existing article. Place it where it logically belongs in the narrative.\n4. Match the tone, voice, and writing style of the existing content exactly.\n5. Each new section should have at least 2-3 substantive paragraphs.\n\nCRITICAL CONSTRAINT: You MUST maintain or increase the current word count of ${wordCount} words. Do NOT reduce readability or remove existing content. The output should read as one cohesive article, not a patchwork.`,
      iconKey: 'hash',
      fixable: true,
    });
  }

  return suggestions;
}
