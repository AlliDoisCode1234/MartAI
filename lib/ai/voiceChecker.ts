/**
 * Voice Consistency Checker
 *
 * Verifies generated content matches the selected writer persona's style.
 * Catches banned phrases, tone mismatches, and style violations.
 */

import type { WriterPersona } from './writerPersonas';

export interface VoiceIssue {
  type: 'banned_phrase' | 'tone_mismatch' | 'style_violation' | 'generic_opening' | 'weak_closing';
  location: number;
  text: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

export interface VoiceConsistencyResult {
  score: number;
  issues: VoiceIssue[];
  passesThreshold: boolean;
}

// Universal banned phrases that indicate low-quality AI content
const GENERIC_AI_PHRASES = [
  'in this article',
  'in this comprehensive guide',
  'without further ado',
  "let's dive in",
  "let's get started",
  'as we all know',
  'it is important to note',
  'it goes without saying',
  'needless to say',
  'at the end of the day',
  'in conclusion',
  'to sum up',
  'in summary',
  'last but not least',
  'first and foremost',
  'each and every',
  'in order to',
  'due to the fact that',
  'at this point in time',
  'for all intents and purposes',
  'in the event that',
  "in today's world",
  "in today's fast-paced world",
  "in today's digital age",
  'cutting-edge',
  'game-changing',
  'revolutionary',
  'state-of-the-art',
  'best-in-class',
  'world-class',
  'leverage',
  'synergy',
  'paradigm shift',
  'think outside the box',
  'move the needle',
  'low-hanging fruit',
  'deep dive',
  'circle back',
  'touch base',
  'take it to the next level',
];

// Weak opening patterns
const WEAK_OPENINGS = [
  /^(this|these|the|a|an) (article|guide|post|blog)/i,
  /^welcome to/i,
  /^in this (article|guide|post)/i,
  /^today we('ll| will)/i,
  /^have you ever wondered/i,
  /^are you looking for/i,
];

// Weak closing patterns
const WEAK_CLOSINGS = [
  /thanks for reading/i,
  /we hope you (found|enjoyed)/i,
  /in conclusion/i,
  /to sum up/i,
  /that's (it|all) for (today|now)/i,
  /until next time/i,
];

/**
 * Check content against writer persona's voice requirements
 */
export function checkVoiceConsistency(
  content: string,
  persona: WriterPersona
): VoiceConsistencyResult {
  const issues: VoiceIssue[] = [];
  const contentLower = content.toLowerCase();

  // Check persona-specific banned phrases
  for (const banned of persona.avoidPatterns) {
    const index = contentLower.indexOf(banned.toLowerCase());
    if (index !== -1) {
      issues.push({
        type: 'banned_phrase',
        location: index,
        text: banned,
        suggestion: `Remove "${banned}" - not in ${persona.name}'s voice. Consider alternatives that match their ${persona.tone} tone.`,
        severity: 'high',
      });
    }
  }

  // Check universal generic AI phrases
  for (const generic of GENERIC_AI_PHRASES) {
    const index = contentLower.indexOf(generic.toLowerCase());
    if (index !== -1) {
      issues.push({
        type: 'generic_opening',
        location: index,
        text: generic,
        suggestion: `Remove generic phrase "${generic}". This sounds AI-generated.`,
        severity: 'medium',
      });
    }
  }

  // Check opening (first 200 chars)
  const opening = content.substring(0, 200).toLowerCase();
  for (const pattern of WEAK_OPENINGS) {
    if (pattern.test(opening)) {
      issues.push({
        type: 'generic_opening',
        location: 0,
        text: opening.match(pattern)?.[0] || 'Opening',
        suggestion: `Weak opening detected. ${persona.name} would use: "${persona.openingStyles[0]}"`,
        severity: 'high',
      });
      break;
    }
  }

  // Check closing (last 300 chars)
  const closing = content.substring(content.length - 300).toLowerCase();
  for (const pattern of WEAK_CLOSINGS) {
    if (pattern.test(closing)) {
      issues.push({
        type: 'weak_closing',
        location: content.length - 300,
        text: closing.match(pattern)?.[0] || 'Closing',
        suggestion: `Weak closing detected. ${persona.name} would use: "${persona.closingStyles[0]}"`,
        severity: 'medium',
      });
      break;
    }
  }

  // Check tone consistency (basic heuristics)
  if (persona.tone === 'formal') {
    const informalPatterns = [/\byou're\b/g, /\bwon't\b/g, /\bcan't\b/g, /\bdon't\b/g];
    for (const pattern of informalPatterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 5) {
        issues.push({
          type: 'tone_mismatch',
          location: 0,
          text: 'Multiple contractions',
          suggestion: `${persona.name} uses formal tone - reduce contractions or use full forms.`,
          severity: 'low',
        });
        break;
      }
    }
  }

  if (persona.tone === 'conversational' || persona.tone === 'witty') {
    const formalPatterns = [/\bthus\b/gi, /\btherefore\b/gi, /\bfurthermore\b/gi, /\bmoreover\b/gi];
    let formalCount = 0;
    for (const pattern of formalPatterns) {
      const matches = content.match(pattern);
      if (matches) formalCount += matches.length;
    }
    if (formalCount > 3) {
      issues.push({
        type: 'tone_mismatch',
        location: 0,
        text: 'Overly formal language',
        suggestion: `${persona.name} uses ${persona.tone} tone - use more casual transitions.`,
        severity: 'low',
      });
    }
  }

  // Calculate score (start at 100, deduct for issues)
  let score = 100;
  for (const issue of issues) {
    switch (issue.severity) {
      case 'high':
        score -= 15;
        break;
      case 'medium':
        score -= 8;
        break;
      case 'low':
        score -= 3;
        break;
    }
  }
  score = Math.max(0, score);

  return {
    score,
    issues,
    passesThreshold: score >= 70,
  };
}

/**
 * Get suggestions for improving voice consistency
 */
export function getVoiceImprovementPrompt(issues: VoiceIssue[], persona: WriterPersona): string {
  if (issues.length === 0) return '';

  const highPriority = issues.filter((i) => i.severity === 'high');

  return `
VOICE CORRECTION REQUIRED for ${persona.name}'s style:

${highPriority.map((i) => `- REMOVE: "${i.text}" - ${i.suggestion}`).join('\n')}

Remember ${persona.name}'s signature traits:
${persona.signatureTraits.map((t) => `- ${t}`).join('\n')}

NEVER use these patterns:
${persona.avoidPatterns.map((p) => `- "${p}"`).join('\n')}
`.trim();
}
