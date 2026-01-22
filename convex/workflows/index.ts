/**
 * Convex Workflows Configuration
 *
 * This file exports all workflows and provides utilities for workflow management
 */

// Content Workflows
// NOTE: contentCreationWorkflow, draftGenerationWorkflow, publishingWorkflow removed (2026-01-22)
// They referenced non-existent briefs/drafts tables. Use contentPieces instead.
export { articleGenerationWorkflow } from './contentWorkflows';

// Keyword Workflows
export {
  keywordResearchWorkflow,
  gscImportWorkflow,
  clusterRefinementWorkflow,
} from './keywordWorkflows';

// Analytics Workflows
export {
  analyticsSyncWorkflow,
  contentPerformanceWorkflow,
  competitorAnalysisWorkflow,
  rankTrackingWorkflow,
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
  // Content Workflows
  // NOTE: 'content:create', 'content:generateDraft', 'content:publish' removed
  // Use generateCalendar.ts or articleGenerationWorkflow instead
  'article:generate': 'workflows/contentWorkflows:articleGenerationWorkflow',

  // Keyword Workflows
  'keywords:research': 'workflows/keywordWorkflows:keywordResearchWorkflow',
  'keywords:importGSC': 'workflows/keywordWorkflows:gscImportWorkflow',
  'keywords:refineCluster': 'workflows/keywordWorkflows:clusterRefinementWorkflow',

  // Analytics Workflows
  'analytics:sync': 'workflows/analyticsWorkflows:analyticsSyncWorkflow',
  'analytics:analyzeContent': 'workflows/analyticsWorkflows:contentPerformanceWorkflow',
  'analytics:analyzeCompetitors': 'workflows/analyticsWorkflows:competitorAnalysisWorkflow',
  'analytics:trackRankings': 'workflows/analyticsWorkflows:rankTrackingWorkflow',
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
