/**
 * Strategy Constants
 *
 * Shared constants for strategy-related components.
 */

export const INTENT_COLORS: Record<string, string> = {
  transactional: 'red',
  commercial: 'orange',
  informational: 'blue',
  navigational: 'gray',
};

export function getIntentColor(intent: string): string {
  return INTENT_COLORS[intent] || 'gray';
}

export const STRATEGY_STAGES = {
  FIND_TOPICS: 1,
  ORGANIZE: 2,
  PLAN: 3,
  WRITE: 4,
} as const;

/**
 * Calculate current strategy stage based on data
 * Stage 1: Find Topics (no keywords/clusters)
 * Stage 2: Organize (has keywords, no clusters)
 * Stage 3: Plan (has clusters, no briefs)
 * Stage 4: Write (has briefs)
 */
export function calculateStrategyStage(
  keywordCount: number,
  clusterCount: number,
  briefCount: number,
  draftCount: number
): number {
  if (draftCount > 0) return STRATEGY_STAGES.WRITE;
  if (briefCount > 0) return STRATEGY_STAGES.WRITE;
  if (clusterCount > 0) return STRATEGY_STAGES.PLAN;
  if (keywordCount > 0) return STRATEGY_STAGES.ORGANIZE;
  return STRATEGY_STAGES.FIND_TOPICS;
}

export const DEFAULT_PLAN_FORM = {
  contentVelocity: 2,
  startDate: new Date().toISOString().split('T')[0],
  trafficGoal: '',
  leadsGoal: '',
};
