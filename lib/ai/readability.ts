/**
 * Readability Scoring
 *
 * Real implementation of Flesch-Kincaid and other readability metrics.
 * Replaces placeholder scoring in content generation.
 */

export interface ReadabilityMetrics {
  fleschKincaid: number; // Grade level (target: 6-8)
  fleschReadingEase: number; // Score 0-100 (target: 60-70)
  avgSentenceLength: number; // Words per sentence
  avgSyllablesPerWord: number;
  sentenceCount: number;
  wordCount: number;
  syllableCount: number;
  complexWordCount: number; // Words with 3+ syllables
  complexWordPercent: number;
}

export interface ReadabilityResult {
  score: number; // 0-100 normalized score for quality calculation
  metrics: ReadabilityMetrics;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  suggestions: string[];
}

/**
 * Count syllables in a word
 * Uses common English syllable patterns
 */
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;

  // Remove silent e
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');

  // Count vowel groups
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

/**
 * Calculate Flesch-Kincaid Grade Level
 * Lower is more readable (target: 6-8 for web content)
 */
function calculateFleschKincaid(
  wordCount: number,
  sentenceCount: number,
  syllableCount: number
): number {
  if (sentenceCount === 0 || wordCount === 0) return 0;

  const avgSentenceLength = wordCount / sentenceCount;
  const avgSyllablesPerWord = syllableCount / wordCount;

  return 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;
}

/**
 * Calculate Flesch Reading Ease Score
 * Higher is more readable (target: 60-70 for web content)
 * 90-100: Very easy (5th grade)
 * 80-89: Easy (6th grade)
 * 70-79: Fairly easy (7th grade)
 * 60-69: Standard (8th-9th grade)
 * 50-59: Fairly difficult (10th-12th grade)
 * 30-49: Difficult (college)
 * 0-29: Very difficult (graduate)
 */
function calculateFleschReadingEase(
  wordCount: number,
  sentenceCount: number,
  syllableCount: number
): number {
  if (sentenceCount === 0 || wordCount === 0) return 0;

  const avgSentenceLength = wordCount / sentenceCount;
  const avgSyllablesPerWord = syllableCount / wordCount;

  const score = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;
  return Math.max(0, Math.min(100, score));
}

/**
 * Parse content into sentences
 */
function getSentences(content: string): string[] {
  // Strip markdown
  const text = content
    .replace(/^#+\s+/gm, '') // Headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
    .replace(/\*([^*]+)\*/g, '$1') // Italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/`[^`]+`/g, '') // Code
    .replace(/```[\s\S]*?```/g, ''); // Code blocks

  // Split on sentence boundaries
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.split(/\s+/).length >= 2);
}

/**
 * Parse content into words
 */
function getWords(content: string): string[] {
  // Strip markdown and punctuation
  const text = content
    .replace(/^#+\s+/gm, '')
    .replace(/[*_`\[\]()#]/g, '')
    .replace(/https?:\/\/\S+/g, '');

  return text
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z]/g, '').toLowerCase())
    .filter((w) => w.length > 0);
}

/**
 * Calculate comprehensive readability metrics
 */
export function calculateReadability(content: string): ReadabilityResult {
  const sentences = getSentences(content);
  const words = getWords(content);

  const sentenceCount = sentences.length;
  const wordCount = words.length;

  // Calculate syllables
  let syllableCount = 0;
  let complexWordCount = 0;

  for (const word of words) {
    const syllables = countSyllables(word);
    syllableCount += syllables;
    if (syllables >= 3) {
      complexWordCount++;
    }
  }

  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  const avgSyllablesPerWord = wordCount > 0 ? syllableCount / wordCount : 0;
  const complexWordPercent = wordCount > 0 ? (complexWordCount / wordCount) * 100 : 0;

  const fleschKincaid = calculateFleschKincaid(wordCount, sentenceCount, syllableCount);
  const fleschReadingEase = calculateFleschReadingEase(wordCount, sentenceCount, syllableCount);

  const metrics: ReadabilityMetrics = {
    fleschKincaid: Math.round(fleschKincaid * 10) / 10,
    fleschReadingEase: Math.round(fleschReadingEase * 10) / 10,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
    sentenceCount,
    wordCount,
    syllableCount,
    complexWordCount,
    complexWordPercent: Math.round(complexWordPercent * 10) / 10,
  };

  // Normalize to 0-100 score
  // Web content targets 60-70, but 30-60 is acceptable for professional/medical content
  let score: number;
  if (fleschReadingEase >= 50 && fleschReadingEase <= 70) {
    // Optimal range: 50-70
    score = 100;
  } else if (fleschReadingEase > 70) {
    // Too easy - slight penalty (still readable, just simplified)
    score = Math.max(75, 100 - (fleschReadingEase - 70));
  } else if (fleschReadingEase >= 30) {
    // Professional/technical range (30-50) - moderate score, not failure
    score = 70 + ((fleschReadingEase - 30) / 20) * 30; // 70-100 scale
  } else {
    // Below 30 - genuinely difficult (graduate level)
    score = Math.max(40, fleschReadingEase * 2);
  }

  // Generate suggestions
  const suggestions: string[] = [];

  if (avgSentenceLength > 25) {
    suggestions.push('Sentences are too long. Aim for 15-20 words per sentence.');
  }

  if (complexWordPercent > 20) {
    suggestions.push('Too many complex words. Use simpler alternatives where possible.');
  }

  if (fleschReadingEase < 50) {
    suggestions.push('Content is difficult to read. Simplify vocabulary and sentence structure.');
  }

  if (fleschKincaid > 12) {
    suggestions.push('Grade level too high. Target 6-8th grade level for web content.');
  }

  // Calculate grade
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';

  return {
    score: Math.round(score),
    metrics,
    grade,
    suggestions,
  };
}

/**
 * Quick check if content meets readability threshold
 */
export function meetsReadabilityThreshold(content: string, threshold: number = 60): boolean {
  const result = calculateReadability(content);
  return result.score >= threshold;
}
