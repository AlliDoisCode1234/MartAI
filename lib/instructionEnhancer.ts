/**
 * Instruction Enhancer
 *
 * Transforms vague user instructions into actionable AI prompts
 * by injecting content context (SEO scores, readability, word count, keywords).
 *
 * The user says "make it better" → the AI receives a ranked list of
 * specific improvements to make based on the content's actual deficiencies.
 */

import type { SEOScoreResult } from './seoScoring';

// ── Intent Classification ──────────────────────────────────────────

type Intent =
  | 'VAGUE_IMPROVE'    // "make it better", "improve", "enhance"
  | 'VAGUE_DISLIKE'    // "I don't like it", "not great", "meh"
  | 'CONDENSE'         // "too long", "shorten", "cut it down"
  | 'EXPAND'           // "too short", "add more", "make longer"
  | 'ENGAGE'           // "boring", "bland", "more interesting"
  | 'TONE_FORMAL'      // "more professional", "formal", "business"
  | 'TONE_CASUAL'      // "more casual", "friendly", "conversational"
  | 'SIMPLIFY'         // "simpler", "easier to read", "dumb it down"
  | 'SEO_FIX'          // "fix SEO", "optimize", "better ranking"
  | 'STRUCTURE'        // "organize", "better structure", "add sections"
  | 'SPECIFIC';        // anything else — pass through with context

const INTENT_PATTERNS: ReadonlyArray<{ intent: Intent; patterns: ReadonlyArray<RegExp> }> = [
  {
    intent: 'CONDENSE',
    patterns: [
      /\b(too|way too)\s+(long|wordy|verbose)\b/i,
      /\b(shorten|condense|trim|cut)\b/i,
      /\b(make\s+it\s+shorter|less\s+wordy)\b/i,
      /\b(too\s+much|reduce)\b/i,
    ],
  },
  {
    intent: 'EXPAND',
    patterns: [
      /\b(too\s+short|not\s+enough|more\s+detail)\b/i,
      /\b(add\s+more|expand|elaborate|flesh\s+out)\b/i,
      /\b(make\s+it\s+longer|more\s+depth|go\s+deeper)\b/i,
      /\b(needs?\s+more)\b/i,
    ],
  },
  {
    intent: 'SIMPLIFY',
    patterns: [
      /\b(simpl(er|ify|e)|easier|dumb\s+(it\s+)?down)\b/i,
      /\b(too\s+(complex|complicated|dense|hard))\b/i,
      /\b(layman|plain\s+(english|language))\b/i,
      /\b(easier\s+to\s+(read|understand))\b/i,
    ],
  },
  {
    intent: 'ENGAGE',
    patterns: [
      /\b(boring|bland|dry|flat|lifeless|dull)\b/i,
      /\b(more\s+(interesting|engaging|exciting|lively|dynamic))\b/i,
      /\b(spice\s+(it\s+)?up|jazz\s+(it\s+)?up|punch\s+(it\s+)?up)\b/i,
    ],
  },
  {
    intent: 'TONE_FORMAL',
    patterns: [
      /\b(more\s+)?(professional|formal|business|corporate|polished)\b/i,
      /\b(executive|authoritative|serious)\s+(tone|voice)?\b/i,
    ],
  },
  {
    intent: 'TONE_CASUAL',
    patterns: [
      /\b(more\s+)?(casual|friendly|conversational|relax(ed)?|informal)\b/i,
      /\b(warm(er)?|approachable|human)\s*(tone|voice)?\b/i,
    ],
  },
  {
    intent: 'SEO_FIX',
    patterns: [
      /\b(fix|improve|boost|optimize)\s+(the\s+)?(seo|ranking|score)\b/i,
      /\b(seo|search\s+engine)\s+(optimiz|fix|improv)/i,
      /\b(keyword|rank)\s+(better|higher)\b/i,
    ],
  },
  {
    intent: 'STRUCTURE',
    patterns: [
      /\b(organiz|restructur|reorder|rearrang)/i,
      /\b(better\s+structure|add\s+sections|more\s+headings|break\s+(it\s+)?up)\b/i,
      /\b(outline|table\s+of\s+contents)\b/i,
    ],
  },
  {
    intent: 'VAGUE_DISLIKE',
    patterns: [
      /\b(don'?t\s+like|not\s+great|not\s+good|meh|bad|sucks|terrible|awful|hate)\b/i,
      /\b(doesn'?t?\s+(work|sound|feel|look)\s+(good|right|great))\b/i,
      /\b(yuck|ugh|cringe|no|nope|redo)\b/i,
    ],
  },
  {
    intent: 'VAGUE_IMPROVE',
    patterns: [
      /\b(make\s+it\s+better|improve|enhance|upgrade|polish)\b/i,
      /\b(better|fix\s+it|help|clean\s+(it\s+)?up)\b/i,
      /\b(do\s+your\s+(thing|magic)|work\s+your\s+magic)\b/i,
      /\b(just\s+fix|fix\s+this|make\s+this\s+good)\b/i,
    ],
  },
];

function classifyIntent(instruction: string): Intent {
  const normalized = instruction.trim().toLowerCase();
  const wordCount = normalized.split(/\s+/).length;

  // Guard: very long inputs skip regex classification to prevent ReDoS
  if (normalized.length > 500) return 'SPECIFIC';

  for (const { intent, patterns } of INTENT_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(normalized)) {
        return intent;
      }
    }
  }

  // Very short input (1-3 words) that didn't match any pattern = vague improve
  if (wordCount <= 3) return 'VAGUE_IMPROVE';

  return 'SPECIFIC';
}


// ── Context Building ───────────────────────────────────────────────

interface ContentContext {
  seoScore: SEOScoreResult | null;
  wordCount: number;
  targetWordCount: number;
  keywords: string[];
  content: string;
  industry?: string;
}

interface Deficiency {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  area: string;
  detail: string;
}

function buildDeficiencies(ctx: ContentContext): Deficiency[] {
  const deficiencies: Deficiency[] = [];
  const metrics = ctx.seoScore?.metrics;

  if (!metrics) return deficiencies;

  // Guard: no content = no deficiency analysis
  if (!ctx.content || ctx.wordCount === 0) return deficiencies;

  // Word count
  const wordRatio = ctx.wordCount / ctx.targetWordCount;
  if (wordRatio < 0.5) {
    deficiencies.push({
      priority: 'CRITICAL',
      area: 'Word Count',
      detail: `Only ${ctx.wordCount} of ${ctx.targetWordCount} target words. Needs significant expansion with depth, examples, and data.`,
    });
  } else if (wordRatio < 0.8) {
    deficiencies.push({
      priority: 'HIGH',
      area: 'Word Count',
      detail: `${ctx.wordCount} of ${ctx.targetWordCount} target words. Needs ${ctx.targetWordCount - ctx.wordCount} more words.`,
    });
  }

  // Readability
  if (metrics.readabilityScore < 40) {
    deficiencies.push({
      priority: 'CRITICAL',
      area: 'Readability',
      detail: `Score ${metrics.readabilityScore}/100. Too dense — break long sentences, use simpler words, add bullet lists.`,
    });
  } else if (metrics.readabilityScore < 60) {
    deficiencies.push({
      priority: 'HIGH',
      area: 'Readability',
      detail: `Score ${metrics.readabilityScore}/100. Use shorter sentences and simpler word choices.`,
    });
  }

  // Keywords
  const missingKeywords = ctx.keywords.filter(
    (kw) => !ctx.content.toLowerCase().includes(kw.toLowerCase())
  );
  if (missingKeywords.length > 0) {
    const severity = missingKeywords.length > ctx.keywords.length / 2 ? 'CRITICAL' : 'HIGH';
    const quotedKeywords = missingKeywords.map((k) => '"' + k + '"').join(', ');
    deficiencies.push({
      priority: severity,
      area: 'Keywords',
      detail: `Missing: ${quotedKeywords}. Weave naturally into headings and body.`,
    });
  }

  // Structure (H2s)
  if (metrics.h2Score < 50) {
    deficiencies.push({
      priority: 'MEDIUM',
      area: 'Structure',
      detail: `Low heading score (${metrics.h2Score}/100). Add more H2/H3 sections for scannability.`,
    });
  }

  return deficiencies;
}


// ── Intent-Specific Instructions ───────────────────────────────────

function buildIntentInstruction(intent: Intent, ctx: ContentContext): string {
  const deficiencies = buildDeficiencies(ctx);
  const defText = deficiencies.length > 0
    ? deficiencies
        .map((d, i) => `${i + 1}. [${d.priority}] ${d.area}: ${d.detail}`)
        .join('\n')
    : 'No major deficiencies detected — content is performing well.';

  switch (intent) {
    case 'VAGUE_IMPROVE':
    case 'VAGUE_DISLIKE':
      return [
        'Improve this content. The user wants it to be better overall.',
        'Based on automated analysis, here are the priority areas to address:',
        defText,
        intent === 'VAGUE_DISLIKE'
          ? 'The user expressed dissatisfaction — prioritize readability and tone improvements to make the content more engaging and polished.'
          : 'Focus on the highest-priority issues first.',
      ].join('\n');

    case 'CONDENSE':
      return [
        `Condense this content significantly. Current word count: ${ctx.wordCount}.`,
        'Remove redundancy, tighten sentences, and eliminate filler. Keep key points and data.',
        'Do NOT remove entire sections — instead make each section more concise.',
      ].join('\n');

    case 'EXPAND': {
      const wordsNeeded = Math.max(0, ctx.targetWordCount - ctx.wordCount);
      if (wordsNeeded > 0) {
        return [
          `Expand this content to AT LEAST ${ctx.targetWordCount} words (currently ${ctx.wordCount}).`,
          `You MUST add at least ${wordsNeeded} more words. This is a hard requirement — do not return content shorter than ${ctx.targetWordCount} words.`,
          'Add depth to existing sections with real-world examples, data points, and step-by-step instructions.',
          'Add a FAQ section with 3-5 questions and detailed answers if one does not exist.',
          'Do NOT sacrifice readability to increase word count — maintain the current quality.',
          defText ? `\nAdditional context:\n${defText}` : '',
        ].join('\n');
      }
      // Content already meets word count target — focus on depth, not length
      return [
        `This content is ${ctx.wordCount} words (target: ${ctx.targetWordCount}). The word count is sufficient.`,
        'Focus on adding DEPTH and QUALITY to existing sections:',
        '- Add real-world examples, case studies, and data points to support claims.',
        '- Add step-by-step instructions where processes are described vaguely.',
        '- Add a FAQ section with 3-5 questions and detailed answers if one does not exist.',
        '- Add H2/H3 subsections to break up long paragraphs for better scannability.',
        'Do NOT pad content with filler — every addition must provide genuine value.',
        defText ? `\nAdditional context:\n${defText}` : '',
      ].join('\n');
    }

    case 'ENGAGE':
      return [
        'Make this content more engaging and interesting.',
        'Add rhetorical questions, real-world analogies, surprising statistics, and vivid examples.',
        'Use active voice. Start some paragraphs with hooks. Break up monotonous patterns.',
        'Keep the same information but make it compelling to read.',
      ].join('\n');

    case 'TONE_FORMAL':
      return [
        'Rewrite in a professional, authoritative business tone.',
        'Use precise language, industry terminology, and confident assertions.',
        'Remove casual phrases, contractions, and colloquialisms.',
        'Maintain the same content and structure.',
      ].join('\n');

    case 'TONE_CASUAL':
      return [
        'Rewrite in a warm, conversational tone — like explaining to a smart friend.',
        'Use contractions, casual transitions, and approachable language.',
        'Add personal touches — "you" and "your" instead of passive voice.',
        'Keep the same information but make it feel human.',
      ].join('\n');

    case 'SIMPLIFY':
      return [
        'Simplify this content significantly. You MUST make it noticeably easier to read.',
        'Break EVERY sentence over 20 words into two shorter ones.',
        'Replace ALL jargon with plain language equivalents.',
        'Use bullet lists for any lists of 3+ items.',
        'Target a 6th-8th grade reading level.',
        `Current readability: ${ctx.seoScore?.metrics?.readabilityScore ?? 'unknown'}/100. You MUST raise it above 60/100.`,
        'Do NOT reduce word count below the current level — maintain content depth while simplifying language.',
      ].join('\n');

    case 'SEO_FIX':
      return [
        'Optimize this content for search engines.',
        'Analysis results:',
        defText,
        'Address ALL deficiencies — improve keyword integration, heading structure, and content depth.',
      ].join('\n');

    case 'STRUCTURE':
      return [
        'Reorganize this content with better structure.',
        'Create 5-7 clear H2 sections with descriptive headings.',
        'Add H3 subsections where a topic needs deeper breakdown.',
        'Ensure logical flow: introduction → core topics → comparison/analysis → conclusion.',
        `Current structure score: ${ctx.seoScore?.metrics?.h2Score ?? 'unknown'}/100.`,
      ].join('\n');

    case 'SPECIFIC':
    default:
      // For specific instructions, append context but don't override
      if (deficiencies.length > 0) {
        return [
          'Additional context about this content (for your awareness):',
          defText,
        ].join('\n');
      }
      return '';
  }
}


// ── Public API ─────────────────────────────────────────────────────

/**
 * Enhance a user instruction with content context.
 *
 * Takes a raw user instruction (potentially vague like "make it better")
 * and returns a rich, actionable AI prompt that includes:
 * - Classified intent
 * - Ranked SEO deficiencies
 * - Specific improvement directives
 *
 * @returns Enhanced instruction string ready for the AI
 */
export function enhanceInstruction(
  rawInstruction: string,
  context: ContentContext
): string {
  const intent = classifyIntent(rawInstruction);
  const intentInstruction = buildIntentInstruction(intent, context);

  console.log(`[InstructionEnhancer] Intent: ${intent}, Raw: "${rawInstruction.slice(0, 80)}"`);

  // Cap enhanced instruction at 1800 chars to stay under backend 2000-char limit
  let result: string;
  if (intent === 'SPECIFIC') {
    result = intentInstruction ? `${rawInstruction}\n\n${intentInstruction}` : rawInstruction;
  } else {
    result = `${intentInstruction}\n\nThe user's original instruction was: "${rawInstruction}"`;
  }

  return result.slice(0, 1800);
}

// Re-export for testing
export { classifyIntent, buildDeficiencies };
export type { Intent, ContentContext, Deficiency };
