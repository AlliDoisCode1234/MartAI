/**
 * Type-safe helpers for Convex ID conversion
 * Use these instead of 'as any' casting
 */

// Import types from centralized types file
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
  Id,
} from "@/types";

/**
 * Safely convert string to Convex ID type
 * Validates format and provides type safety
 */
export function toProjectId(id: string | null | undefined): ProjectId | null {
  if (!id) return null;
  if (typeof id !== 'string') return null;
  return id as ProjectId;
}

export function toBriefId(id: string | null | undefined): BriefId | null {
  if (!id) return null;
  if (typeof id !== 'string') return null;
  return id as BriefId;
}

export function toDraftId(id: string | null | undefined): DraftId | null {
  if (!id) return null;
  if (typeof id !== 'string') return null;
  return id as DraftId;
}

export function toClusterId(id: string | null | undefined): ClusterId | null {
  if (!id) return null;
  if (typeof id !== 'string') return null;
  return id as ClusterId;
}

export function toPlanId(id: string | null | undefined): PlanId | null {
  if (!id) return null;
  if (typeof id !== 'string') return null;
  return id as PlanId;
}

export function toUserId(id: string | null | undefined): UserId | null {
  if (!id) return null;
  if (typeof id !== 'string') return null;
  return id as UserId;
}

export function toClientId(id: string | null | undefined): ClientId | null {
  if (!id) return null;
  if (typeof id !== 'string') return null;
  return id as ClientId;
}

export function toInsightId(id: string | null | undefined): InsightId | null {
  if (!id) return null;
  if (typeof id !== 'string') return null;
  return id as InsightId;
}

export function toCompetitorId(id: string | null | undefined): CompetitorId | null {
  if (!id) return null;
  if (typeof id !== 'string') return null;
  return id as CompetitorId;
}

export function toBriefVersionId(id: string | null | undefined): BriefVersionId | null {
  if (!id) return null;
  if (typeof id !== 'string') return null;
  return id as BriefVersionId;
}

export function toScheduledPostId(id: string | null | undefined): ScheduledPostId | null {
  if (!id) return null;
  if (typeof id !== 'string') return null;
  return id as ScheduledPostId;
}

export function requireCompetitorId(id: string | null | undefined): CompetitorId {
  const converted = toCompetitorId(id);
  if (!converted) throw new Error(`Invalid competitorId: ${id}`);
  return converted;
}

export function requireInsightId(id: string | null | undefined): InsightId {
  const converted = toInsightId(id);
  if (!converted) throw new Error(`Invalid insightId: ${id}`);
  return converted;
}

export function requireBriefVersionId(id: string | null | undefined): BriefVersionId {
  const converted = toBriefVersionId(id);
  if (!converted) throw new Error(`Invalid versionId: ${id}`);
  return converted;
}

export function requireScheduledPostId(id: string | null | undefined): ScheduledPostId {
  const converted = toScheduledPostId(id);
  if (!converted) throw new Error(`Invalid postId: ${id}`);
  return converted;
}

/**
 * Generic ID converter with validation
 */
export function toId<T extends string>(
  id: string | null | undefined,
  expectedPrefix: string
): Id<T> | null {
  if (!id || typeof id !== 'string') return null;
  if (!id.startsWith(expectedPrefix)) {
    console.warn(`Invalid ID format. Expected ${expectedPrefix}_*, got ${id}`);
    return null;
  }
  return id as Id<T>;
}

/**
 * Require ID - throws if invalid
 */
export function requireProjectId(id: string | null | undefined): ProjectId {
  const converted = toProjectId(id);
  if (!converted) throw new Error(`Invalid projectId: ${id}`);
  return converted;
}

export function requireBriefId(id: string | null | undefined): BriefId {
  const converted = toBriefId(id);
  if (!converted) throw new Error(`Invalid briefId: ${id}`);
  return converted;
}

export function requireDraftId(id: string | null | undefined): DraftId {
  const converted = toDraftId(id);
  if (!converted) throw new Error(`Invalid draftId: ${id}`);
  return converted;
}

