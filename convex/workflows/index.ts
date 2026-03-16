/**
 * Convex Workflows Configuration
 *
 * This file exports all workflows and provides utilities for workflow management
 */

// ── NEW: Durable workflows wrapping current production patterns ──────
export { contentGenerationWorkflow } from './contentGenerationWorkflow';
export { calendarGenerationWorkflow } from './calendarGenerationWorkflow';

// ── Legacy workflow definitions (not yet wired to triggers) ──────────
// Content Workflows
export { articleGenerationWorkflow } from './contentWorkflows';

// Keyword Workflows
export {
  keywordResearchWorkflow,
  gscImportWorkflow,
  clusterRefinementWorkflow,
} from './keywordWorkflows';

// Analytics Workflows
// NOTE: contentPerformanceWorkflow removed (WF-004) — referenced deleted briefs table
export {
  analyticsSyncWorkflow,
  competitorAnalysisWorkflow,
} from './analyticsWorkflows';

// Onboarding (Types and Utilities)
export {
  ONBOARDING_STEPS,
  ONBOARDING_STEP_LABELS,
  calculateProgress,
  type OnboardingStep,
} from './onboardingWorkflows';

/**
 * Workflow Registry
 *
 * Maps workflow names to their implementations for easy lookup
 */
export const WORKFLOW_REGISTRY = {
  // ── Active (wired to triggers in workflowTriggers.ts) ──────────────
  'content:generate': 'workflows/contentGenerationWorkflow:contentGenerationWorkflow',
  'calendar:generate': 'workflows/calendarGenerationWorkflow:calendarGenerationWorkflow',

  // ── Legacy (not yet wired to triggers) ─────────────────────────────
  'article:generate': 'workflows/contentWorkflows:articleGenerationWorkflow',
  'keywords:research': 'workflows/keywordWorkflows:keywordResearchWorkflow',
  'keywords:importGSC': 'workflows/keywordWorkflows:gscImportWorkflow',
  'keywords:refineCluster': 'workflows/keywordWorkflows:clusterRefinementWorkflow',
  'analytics:sync': 'workflows/analyticsWorkflows:analyticsSyncWorkflow',
  'analytics:analyzeCompetitors': 'workflows/analyticsWorkflows:competitorAnalysisWorkflow',
  // NOTE: 'analytics:analyzeContent' removed (WF-004) — referenced deleted briefs table
} as const;

/**
 * Workflow Status Types
 */
export type WorkflowStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'paused';

/**
 * Workflow Metadata
 */
export interface WorkflowMetadata {
  id: string;
  name: string;
  status: WorkflowStatus;
  startedAt: number;
  completedAt?: number;
  error?: string;
  progress?: {
    current: number;
    total: number;
    message?: string;
  };
}
