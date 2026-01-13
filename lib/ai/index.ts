/**
 * AI Content Quality Module Index
 *
 * Exports all content quality tools for use in content generation.
 */

// Readability scoring
export {
  calculateReadability,
  meetsReadabilityThreshold,
  type ReadabilityMetrics,
  type ReadabilityResult,
} from './readability';

// Voice consistency checking
export {
  checkVoiceConsistency,
  getVoiceImprovementPrompt,
  type VoiceIssue,
  type VoiceConsistencyResult,
} from './voiceChecker';

// Strategic content suggestions
export {
  analyzeContentStrategically,
  getStrategicImprovementPrompt,
  type StrategicSuggestion,
  type StrategicAnalysis,
} from './strategicSuggestions';

// Writer personas
export {
  CONTENT_DIRECTOR,
  CONTENT_MANAGERS,
  WRITER_POOL,
  selectWriterPersona,
  getWritersForCategory,
  generatePersonaPrompt,
  type WriterPersona,
  type ToneStyle,
  type VoiceType,
  type PacingStyle,
  type StructurePreference,
} from './writerPersonas';

// Master quality engine
export {
  calculateContentQuality,
  generateImprovementHints,
  type QualityBreakdown,
  type QualityReport,
  type SEOMetrics,
} from './qualityEngine';
