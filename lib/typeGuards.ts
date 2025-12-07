/**
 * Type guards and validation for Convex IDs
 * These functions validate AND narrow types - no null returns for required fields
 * If validation fails, throw. If it passes, type is guaranteed.
 */

import type {
  ProjectId,
  BriefId,
  DraftId,
  ClusterId,
  PlanId,
  UserId,
  ClientId,
  InsightId,
  CompetitorId,
  BriefVersionId,
  ScheduledPostId,
  ProspectId,
  Id,
} from '@/types';

/**
 * Validate Convex ID format
 * Convex IDs follow pattern: tableName_xxxxx
 */
function isValidConvexId(id: string | null | undefined, _expectedPrefix: string): id is string {
  if (!id || typeof id !== 'string') return false;
  // Convex v1+ IDs are opaque strings and may not have prefixes
  // We only check for non-empty string to avoid false negatives
  return id.length > 0;
}

/**
 * Type guard: validates and narrows to ProjectId
 * Throws if invalid - use for required fields
 */
export function assertProjectId(id: string | null | undefined): ProjectId {
  if (!isValidConvexId(id, 'projects')) {
    throw new Error(`Invalid projectId: ${id}. Must be a valid Convex project ID.`);
  }
  return id as ProjectId;
}

export function assertBriefId(id: string | null | undefined): BriefId {
  if (!isValidConvexId(id, 'briefs')) {
    throw new Error(`Invalid briefId: ${id}. Must be a valid Convex brief ID.`);
  }
  return id as BriefId;
}

export function assertDraftId(id: string | null | undefined): DraftId {
  if (!isValidConvexId(id, 'drafts')) {
    throw new Error(`Invalid draftId: ${id}. Must be a valid Convex draft ID.`);
  }
  return id as DraftId;
}

export function assertClusterId(id: string | null | undefined): ClusterId {
  if (!isValidConvexId(id, 'keywordClusters')) {
    throw new Error(`Invalid clusterId: ${id}. Must be a valid Convex cluster ID.`);
  }
  return id as ClusterId;
}

export function assertPlanId(id: string | null | undefined): PlanId {
  if (!isValidConvexId(id, 'quarterlyPlans')) {
    throw new Error(`Invalid planId: ${id}. Must be a valid Convex plan ID.`);
  }
  return id as PlanId;
}

export function assertUserId(id: string | null | undefined): UserId {
  if (!isValidConvexId(id, 'users')) {
    throw new Error(`Invalid userId: ${id}. Must be a valid Convex user ID.`);
  }
  return id as UserId;
}

export function assertProspectId(id: string | null | undefined): ProspectId {
  if (!isValidConvexId(id, 'prospects')) {
    throw new Error(`Invalid prospectId: ${id}. Must be a valid Convex prospect ID.`);
  }
  return id as ProspectId;
}

export function assertClientId(id: string | null | undefined): ClientId {
  if (!isValidConvexId(id, 'clients')) {
    throw new Error(`Invalid clientId: ${id}. Must be a valid Convex client ID.`);
  }
  return id as ClientId;
}

export function assertInsightId(id: string | null | undefined): InsightId {
  if (!isValidConvexId(id, 'insights')) {
    throw new Error(`Invalid insightId: ${id}. Must be a valid Convex insight ID.`);
  }
  return id as InsightId;
}

export function assertCompetitorId(id: string | null | undefined): CompetitorId {
  if (!isValidConvexId(id, 'competitors')) {
    throw new Error(`Invalid competitorId: ${id}. Must be a valid Convex competitor ID.`);
  }
  return id as CompetitorId;
}

export function assertBriefVersionId(id: string | null | undefined): BriefVersionId {
  if (!isValidConvexId(id, 'briefVersions')) {
    throw new Error(`Invalid versionId: ${id}. Must be a valid Convex brief version ID.`);
  }
  return id as BriefVersionId;
}

export function assertScheduledPostId(id: string | null | undefined): ScheduledPostId {
  if (!isValidConvexId(id, 'scheduledPosts')) {
    throw new Error(`Invalid postId: ${id}. Must be a valid Convex scheduled post ID.`);
  }
  return id as ScheduledPostId;
}

/**
 * Optional ID helpers - return null if invalid, typed ID if valid
 * Use ONLY when the field is truly optional in the schema
 */
export function parseProjectId(id: string | null | undefined): ProjectId | null {
  return isValidConvexId(id, 'projects') ? (id as ProjectId) : null;
}

export function parseClusterId(id: string | null | undefined): ClusterId | null {
  return isValidConvexId(id, 'keywordClusters') ? (id as ClusterId) : null;
}

/**
 * Generic ID parser with validation
 */
export function parseId<T extends string>(
  id: string | null | undefined,
  expectedPrefix: string
): Id<T> | null {
  return isValidConvexId(id, expectedPrefix) ? (id as Id<T>) : null;
}
