/**
 * Canonical BI Event Taxonomy
 *
 * Component Hierarchy:
 * convex/lib/eventTypes.ts (Single Source of Truth)
 *
 * Every BI event in the system MUST use one of these event names.
 * The constants provide compile-time safety; the validator provides runtime safety.
 *
 * IMPORTANT: The schema keeps `event: v.string()` for backward compatibility
 * with existing data. The validator is used in mutation args only (new writes).
 */

import { v } from 'convex/values';

// ════════════════════════════════════════
// EVENT NAMES — Canonical Registry
// ════════════════════════════════════════

export const BI_EVENTS = {
  // ── Signup & Onboarding ──
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',

  // ── Project Lifecycle ──
  PROJECT_CREATED: 'project_created',
  PROJECT_DELETED: 'project_deleted',

  // ── Content Pipeline ──
  CONTENT_GENERATED: 'content_generated',
  CONTENT_EDITED: 'content_edited',
  CONTENT_PUBLISHED: 'content_published',

  // ── SEO & Research ──
  KEYWORD_RESEARCH_RUN: 'keyword_research_run',
  KEYWORDS_IMPORTED: 'keywords_imported',
  CLUSTERS_GENERATED: 'clusters_generated',
  AI_REPORT_GENERATED: 'ai_report_generated',

  // ── Integrations ──
  GSC_CONNECTED: 'gsc_connected',
  GA4_CONNECTED: 'ga4_connected',
  WORDPRESS_CONNECTED: 'wordpress_connected',

  // ── Revenue / Billing ──
  PLAN_UPGRADED: 'plan_upgraded',
  PLAN_DOWNGRADED: 'plan_downgraded',
  SUBSCRIPTION_CREATED: 'subscription_created',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',

  // ── Team Management ──
  TEAM_INVITE_SENT: 'team_invite_sent',
  TEAM_INVITE_ACCEPTED: 'team_invite_accepted',
  TEAM_MEMBER_REMOVED: 'team_member_removed',
  TEAM_MEMBER_LEFT: 'team_member_left',
  TEAM_OWNERSHIP_TRANSFERRED: 'team_ownership_transferred',

  // ── Engagement ──
  PAGE_VIEW: 'page_view',
  FEATURE_USED: 'feature_used',
  BRIEF_CREATED: 'brief_created',

  // ── Errors ──
  ERROR_OCCURRED: 'error_occurred',
} as const;

export type BiEventName = (typeof BI_EVENTS)[keyof typeof BI_EVENTS];

/**
 * Convex validator for BI event names.
 * Explicit literals — no spread pattern to avoid Convex build issues.
 * Used in mutation args for runtime validation on new writes.
 */
export const biEventValidator = v.union(
  // ── Signup & Onboarding ──
  v.literal('signup_started'),
  v.literal('signup_completed'),
  v.literal('onboarding_step_completed'),
  // ── Project Lifecycle ──
  v.literal('project_created'),
  v.literal('project_deleted'),
  // ── Content Pipeline ──
  v.literal('content_generated'),
  v.literal('content_edited'),
  v.literal('content_published'),
  // ── SEO & Research ──
  v.literal('keyword_research_run'),
  v.literal('keywords_imported'),
  v.literal('clusters_generated'),
  v.literal('ai_report_generated'),
  // ── Integrations ──
  v.literal('gsc_connected'),
  v.literal('ga4_connected'),
  v.literal('wordpress_connected'),
  // ── Revenue / Billing ──
  v.literal('plan_upgraded'),
  v.literal('plan_downgraded'),
  v.literal('subscription_created'),
  v.literal('subscription_cancelled'),
  // ── Team Management ──
  v.literal('team_invite_sent'),
  v.literal('team_invite_accepted'),
  v.literal('team_member_removed'),
  v.literal('team_member_left'),
  v.literal('team_ownership_transferred'),
  // ── Engagement ──
  v.literal('page_view'),
  v.literal('feature_used'),
  v.literal('brief_created'),
  // ── Errors ──
  v.literal('error_occurred')
);
