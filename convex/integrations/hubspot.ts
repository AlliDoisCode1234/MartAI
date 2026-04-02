/**
 * HubSpot Integration
 *
 * Sync MartAI users and prospects to HubSpot for marketing automation.
 */
'use node';

import { action, internalAction } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';
import { Id } from '../_generated/dataModel';
import {
  mapUserToHubSpot,
  mapWaitlistToHubSpot,
  mapProspectToHubSpot,
  mapAbandonedSignupToHubSpot,
  mapApiAccessToHubSpot,
  mapPRScoreToHubSpot,
  mapLifecycleChangeToHubSpot,
  mapOrganizationToHubSpot,
} from './hubspotMapper';

// HubSpot API base URL
const HUBSPOT_API_URL = 'https://api.hubapi.com';

/**
 * Check if HubSpot integration is enabled
 */
function isHubSpotEnabled(): boolean {
  return !!process.env.HUBSPOT_API_KEY;
}

/**
 * HubSpot API helper
 */
async function hubspotRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH',
  body?: any
): Promise<any> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  if (!apiKey) {
    console.log('[HubSpot] Skipping API call - HUBSPOT_API_KEY not set');
    throw new Error('HUBSPOT_API_KEY not configured');
  }

  const response = await fetch(`${HUBSPOT_API_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[HubSpot] API error: ${response.status}`, errorText);
    throw new Error(`HubSpot API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Create or update a contact in HubSpot
 * Uses search-before-create for idempotent upsert by email.
 */
async function upsertContact(
  email: string,
  properties: Record<string, string | number | boolean>
): Promise<{ id: string; isNew: boolean }> {
  // Step 1: Search for existing contact by email
  let existingContactId: string | null = null;

  try {
    const searchResult = await hubspotRequest('/crm/v3/objects/contacts/search', 'POST', {
      filterGroups: [
        {
          filters: [{ propertyName: 'email', operator: 'EQ', value: email }],
        },
      ],
    });

    if (searchResult.results?.length > 0) {
      existingContactId = searchResult.results[0].id;
    }
  } catch (e) {
    // Search failed — fall through to create
    console.warn(`[HubSpot] Search failed for ${email}, will attempt create:`, e);
  }

  // Step 2: If found, update (PATCH errors propagate to caller)
  if (existingContactId) {
    await hubspotRequest(`/crm/v3/objects/contacts/${existingContactId}`, 'PATCH', { properties });
    console.log(`[HubSpot] Updated contact: ${email} (ID: ${existingContactId})`);
    return { id: existingContactId, isNew: false };
  }

  // Step 3: Not found — create new contact
  const createResult = await hubspotRequest('/crm/v3/objects/contacts', 'POST', {
    properties: { email, ...properties },
  });

  console.log(`[HubSpot] Created contact: ${email} (ID: ${createResult.id})`);
  return { id: createResult.id, isNew: true };
}

/**
 * Create or update a company in HubSpot
 * Uses search-before-create based on the unique Convex Organization ID.
 */
async function upsertCompany(
  convexOrgId: string,
  properties: Record<string, string | number | boolean>
): Promise<{ id: string; isNew: boolean }> {
  let existingCompanyId: string | null = null;

  try {
    const searchResult = await hubspotRequest('/crm/v3/objects/companies/search', 'POST', {
      filterGroups: [
        {
          filters: [{ propertyName: 'phoo_organization_id', operator: 'EQ', value: convexOrgId }],
        },
      ],
    });

    if (searchResult.results?.length > 0) {
      existingCompanyId = searchResult.results[0].id;
    }
  } catch (e) {
    console.warn(`[HubSpot] Search failed for company ${convexOrgId}, will attempt create:`, e);
  }

  if (existingCompanyId) {
    await hubspotRequest(`/crm/v3/objects/companies/${existingCompanyId}`, 'PATCH', {
      properties: { phoo_organization_id: convexOrgId, ...properties },
    });
    console.log(`[HubSpot] Updated company: ${convexOrgId} (ID: ${existingCompanyId})`);
    return { id: existingCompanyId, isNew: false };
  }

  const createResult = await hubspotRequest('/crm/v3/objects/companies', 'POST', {
    properties: { phoo_organization_id: convexOrgId, ...properties },
  });

  console.log(`[HubSpot] Created company: ${convexOrgId} (ID: ${createResult.id})`);
  return { id: createResult.id, isNew: true };
}

/**
 * Link a Contact to a Company in HubSpot (B2B SaaS structure)
 */
async function associateContactToCompany(
  contactId: string,
  companyId: string
): Promise<void> {
  try {
    await hubspotRequest(
      `/crm/v3/objects/contacts/${contactId}/associations/companies/${companyId}/contact_to_company`,
      'PUT'
    );
    console.log(`[HubSpot] Associated Contact ${contactId} to Company ${companyId}`);
  } catch (e) {
    console.error(`[HubSpot] Failed association for Contact ${contactId} -> Company ${companyId}`, e);
    // Suppress error so it doesn't crash the entire user sync
  }
}

/**
 * Sync a user to HubSpot
 * Uses centralized mapper for phoo_* properties.
 */
export const syncUserToHubspot = action({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    if (!isHubSpotEnabled()) {
      console.log('[HubSpot] Skipping user sync - no API key configured');
      return { success: false, reason: 'no_api_key' };
    }

    const user = await ctx.runQuery(api.users.getById, { userId: args.userId });
    if (!user || !user.email) {
      console.log(`[HubSpot] User ${args.userId} has no email, skipping`);
      return { success: false, reason: 'no_email' };
    }

    // Get user's projects
    const projects = await ctx.runQuery(api.projects.projects.getProjectsByUser, {
      userId: args.userId,
    });

    // Organization processing (B2B SaaS Multi-Org)
    let companyId: string | null = null;
    
    if (user.organizationId) {
      try {
        const org = await ctx.runQuery(internal.teams.teams.getOrganizationForSync, { 
          organizationId: user.organizationId 
        });
        
        if (org) {
          const orgProperties = mapOrganizationToHubSpot({
            id: org._id,
            name: org.name,
            planTier: org.plan,
            seatCount: org.maxMembers,
            projectCount: org.projectCount,
            createdAt: org.createdAt
          });
          const companyResult = await upsertCompany(org._id, orgProperties);
          companyId = companyResult.id;
        }
      } catch(e) {
         console.error("[HubSpot] Failed to sync organization", e);
      }
    }

    // Get latest PR score if they have a project
    let prScore: number | null = null;
    let prTier: string | null = null;
    let primaryWebsite: string | null = null;

    if (projects.length > 0) {
      primaryWebsite = projects[0].websiteUrl;
      try {
        const prData = await ctx.runQuery(api.analytics.martaiRatingQueries.getLatestScore, {
          projectId: projects[0]._id,
        });
        if (prData) {
          prScore = prData.overall;
          if (prScore !== null) {
            if (prScore >= 80) prTier = 'thriving';
            else if (prScore >= 65) prTier = 'growing';
            else if (prScore >= 50) prTier = 'building';
            else prTier = 'needs_work';
          }
        }
      } catch (e) {
        // No PR score yet
      }
    }

    // Use centralized mapper (phoo_* prefix)
    const properties = mapUserToHubSpot({
      ...user,
      onboardingSteps: user.onboardingSteps as Record<
        string,
        boolean | string | number | undefined
      >,
      projectCount: projects.length,
      primaryWebsite: primaryWebsite ?? undefined,
      prScore,
      prTier,
    });

    const result = await upsertContact(user.email, properties);
    
    // Associate Contact to Company
    if (companyId && result.id) {
       await associateContactToCompany(result.id, companyId);
    }

    return {
      success: true,
      hubspotId: result.id,
      isNew: result.isNew,
    };
  },
});

export const syncProspectToHubspot = action({
  args: { prospectId: v.id('prospects') },
  handler: async (ctx, args) => {
    if (!isHubSpotEnabled()) {
      console.log('[HubSpot] Skipping prospect sync - no API key configured');
      return { success: false, reason: 'no_api_key' };
    }

    const prospect = await ctx.runQuery(api.prospects.prospects.getProspect, {
      prospectId: args.prospectId,
    });

    if (!prospect?.prospect?.email) {
      console.log(`[HubSpot] Prospect ${args.prospectId} has no email, skipping`);
      return { success: false, reason: 'no_email' };
    }

    const p = prospect.prospect;

    // Use centralized mapper (phoo_* prefix)
    const properties = mapProspectToHubSpot({
      firstName: p.firstName,
      lastName: p.lastName,
      phone: p.phone,
      companyName: p.companyName,
      source: p.source,
      status: p.status,
      monthlyRevenue: p.monthlyRevenue,
      timeline: p.timeline,
      marketingFrustration: p.marketingFrustration,
    });

    const result = await upsertContact(p.email!, properties);

    return {
      success: true,
      hubspotId: result.id,
      isNew: result.isNew,
    };
  },
});

/**
 * Mark an abandoned signup in HubSpot
 */
export const markAbandonedSignup = action({
  args: {
    email: v.string(),
    abandonedAtStep: v.string(),
    firstName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Use centralized mapper (phoo_* prefix)
    const properties = mapAbandonedSignupToHubSpot({
      abandonedAtStep: args.abandonedAtStep,
      firstName: args.firstName,
    });

    const result = await upsertContact(args.email, properties);

    return {
      success: true,
      hubspotId: result.id,
      isNew: result.isNew,
    };
  },
});

/**
 * Sync API access request to HubSpot (Enterprise lead)
 */
export const syncApiAccessRequest = action({
  args: { requestId: v.id('apiAccessRequests') },
  handler: async (ctx, args) => {
    if (!isHubSpotEnabled()) {
      console.log('[HubSpot] Skipping API access request sync - no API key configured');
      return { success: false, reason: 'no_api_key' };
    }

    const request = await ctx.runQuery(api.apiAccessRequests.getRequest, {
      requestId: args.requestId,
    });

    if (!request?.email) {
      console.log(`[HubSpot] API access request ${args.requestId} has no email, skipping`);
      return { success: false, reason: 'no_email' };
    }

    // Use centralized mapper (phoo_* prefix)
    const properties = mapApiAccessToHubSpot({
      companyName: request.companyName,
      useCase: request.useCase,
      expectedMonthlyVolume: request.expectedMonthlyVolume,
      status: request.status,
      contactName: request.contactName,
    });

    const result = await upsertContact(request.email, properties);

    // Update request with HubSpot ID
    await ctx.runMutation(api.apiAccessRequests.updateHubspotSync, {
      requestId: args.requestId,
      hubspotContactId: result.id,
    });

    return {
      success: true,
      hubspotId: result.id,
      isNew: result.isNew,
    };
  },
});

/**
 * Update MR score for a user (called by weekly cron)
 * Includes churn risk calculation for sales outreach
 */
export const updateMRScore = internalAction({
  args: { userId: v.id('users') },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    reason?: string;
    mrScore?: number;
    mrTier?: string | null;
    churnRisk?: boolean;
  }> => {
    if (!isHubSpotEnabled()) {
      console.log('[HubSpot] Skipping PR score update - no API key configured');
      return { success: false, reason: 'no_api_key' };
    }

    const user = await ctx.runQuery(api.users.getById, { userId: args.userId });
    if (!user?.email) {
      return { success: false, reason: 'no_email' };
    }

    const projects = await ctx.runQuery(api.projects.projects.getProjectsByUser, {
      userId: args.userId,
    });

    if (projects.length === 0) {
      return { success: false, reason: 'no_projects' };
    }

    // Get latest PR score
    let prScore: number | null = null;
    let prTier: string | null = null;

    try {
      const prData = await ctx.runQuery(api.analytics.martaiRatingQueries.getLatestScore, {
        projectId: projects[0]._id,
      });
      if (prData) {
        prScore = prData.overall;
        if (prScore !== null) {
          if (prScore >= 80) prTier = 'thriving';
          else if (prScore >= 65) prTier = 'growing';
          else if (prScore >= 50) prTier = 'building';
          else prTier = 'needs_work';
        }
      }
    } catch (e) {
      return { success: false, reason: 'no_mr_score' };
    }

    if (prScore === null) {
      return { success: false, reason: 'no_mr_score' };
    }

    const churnRisk = prScore < 50 || prTier === 'needs_work';

    // Use centralized mapper (phoo_* prefix)
    const properties = mapPRScoreToHubSpot({
      prScore,
      prTier: prTier ?? undefined,
      churnRisk,
      lastActiveAt: user.lastActiveAt,
    });

    await upsertContact(user.email, properties);

    return { success: true, mrScore: prScore, mrTier: prTier, churnRisk };
  },
});

/**
 * Bulk sync all users to HubSpot (one-time migration)
 */
export const bulkSyncUsers = action({
  args: {},
  handler: async (
    ctx
  ): Promise<{ synced: number; skipped: number; errors: number; total: number }> => {
    const users = await ctx.runQuery(api.users.listAll, {});

    let synced = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of users) {
      try {
        const result = await ctx.runAction(api.integrations.hubspot.syncUserToHubspot, {
          userId: user._id,
        });
        if (result.success) {
          synced++;
        } else {
          skipped++;
        }
      } catch (e) {
        console.error(`[HubSpot] Failed to sync user ${user._id}:`, e);
        errors++;
      }

      // Rate limit: 10 requests per second
      await new Promise((r) => setTimeout(r, 100));
    }

    return { synced, skipped, errors, total: users.length };
  },
});

/**
 * Bulk sync all prospects to HubSpot (one-time migration)
 */
export const bulkSyncProspects = action({
  args: {},
  handler: async (
    ctx
  ): Promise<{ synced: number; skipped: number; errors: number; total: number }> => {
    const prospectData = await ctx.runQuery(api.prospects.prospects.listProspects, {});

    let synced = 0;
    let skipped = 0;
    let errors = 0;

    for (const item of prospectData) {
      try {
        const result = await ctx.runAction(api.integrations.hubspot.syncProspectToHubspot, {
          prospectId: item.prospect._id,
        });
        if (result.success) {
          synced++;
        } else {
          skipped++;
        }
      } catch (e) {
        console.error(`[HubSpot] Failed to sync prospect ${item.prospect._id}:`, e);
        errors++;
      }

      // Rate limit
      await new Promise((r) => setTimeout(r, 100));
    }

    return { synced, skipped, errors, total: prospectData.length };
  },
});

/**
 * Sync a waitlist signup to HubSpot (Phoo.ai beta leads)
 * Uses centralized mapper for consistent property naming.
 */
export const syncWaitlistToHubspot = action({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Graceful skip if no API key
    if (!isHubSpotEnabled()) {
      console.warn(
        `[HubSpot] SKIPPED waitlist sync for ${args.email} - HUBSPOT_API_KEY not set in environment`
      );
      return { success: false, reason: 'no_api_key' };
    }

    // Use centralized mapper (already imported at top)
    const properties = mapWaitlistToHubSpot({
      email: args.email,
      source: args.source,
      utmSource: args.utmSource,
      utmMedium: args.utmMedium,
      utmCampaign: args.utmCampaign,
    });

    try {
      const result = await upsertContact(args.email, properties);
      console.log(`[HubSpot] Synced waitlist signup: ${args.email} (ID: ${result.id})`);
      return {
        success: true,
        hubspotId: result.id,
        isNew: result.isNew,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[HubSpot] FAILED to sync waitlist for ${args.email}: ${errorMessage}`);
      return { success: false, reason: 'api_error', error: errorMessage };
    }
  },
});

/**
 * Backfill a single waitlist entry to HubSpot.
 * Internal action - callable from dashboard or by the bulk backfill.
 */
export const backfillSingleWaitlistEntry = internalAction({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!isHubSpotEnabled()) {
      console.warn(`[HubSpot Backfill] SKIPPED ${args.email} - HUBSPOT_API_KEY not set`);
      return { success: false, reason: 'no_api_key' };
    }

    const properties = mapWaitlistToHubSpot({
      email: args.email,
      source: args.source,
      utmSource: args.utmSource,
      utmMedium: args.utmMedium,
      utmCampaign: args.utmCampaign,
    });

    const result = await upsertContact(args.email, properties);
    console.log(
      `[HubSpot Backfill] Synced: ${args.email} (ID: ${result.id}, new: ${result.isNew})`
    );
    return { success: true, hubspotId: result.id, isNew: result.isNew };
  },
});

/**
 * Backfill all waitlist entries added after a given date to HubSpot.
 * Internal action - run from Convex Dashboard for post-Jan-20-2026 recovery.
 *
 * Usage from Convex Dashboard:
 *   Function: integrations/hubspot:backfillWaitlistToHubspot
 *   Args: { "cutoffTimestamp": 1737417600000 }
 *   (1737417600000 = Jan 21 2026 00:00:00 UTC)
 */
export const backfillWaitlistToHubspot = internalAction({
  args: {
    cutoffTimestamp: v.number(),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    synced: number;
    skipped: number;
    errors: number;
    total: number;
    errorDetails: Array<{ email: string; error: string }>;
  }> => {
    if (!isHubSpotEnabled()) {
      console.error(
        '[HubSpot Backfill] HUBSPOT_API_KEY not set - cannot backfill. Set the env var and retry.'
      );
      return { synced: 0, skipped: 0, errors: 0, total: 0, errorDetails: [] };
    }

    // Fetch all waitlist entries after the cutoff date
    const entries = await ctx.runQuery(internal.waitlist.listWaitlistEntriesAfterDate, {
      afterTimestamp: args.cutoffTimestamp,
    });

    console.log(
      `[HubSpot Backfill] Found ${entries.length} waitlist entries after ${new Date(args.cutoffTimestamp).toISOString()}`
    );

    let synced = 0;
    let skipped = 0;
    let errors = 0;
    const errorDetails: Array<{ email: string; error: string }> = [];

    for (const entry of entries) {
      try {
        const properties = mapWaitlistToHubSpot({
          email: entry.email,
          source: entry.source,
          utmSource: entry.metadata?.utmSource,
          utmMedium: entry.metadata?.utmMedium,
          utmCampaign: entry.metadata?.utmCampaign,
        });

        const result = await upsertContact(entry.email, properties);
        console.log(
          `[HubSpot Backfill] ${result.isNew ? 'Created' : 'Updated'}: ${entry.email} (ID: ${result.id})`
        );
        synced++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[HubSpot Backfill] FAILED: ${entry.email} - ${errorMessage}`);
        errorDetails.push({ email: entry.email, error: errorMessage });
        errors++;
      }

      // Rate limit: HubSpot allows 10 requests/second
      await new Promise((r) => setTimeout(r, 100));
    }

    console.log(
      `[HubSpot Backfill] Complete: ${synced} synced, ${skipped} skipped, ${errors} errors out of ${entries.length} total`
    );

    return { synced, skipped, errors, total: entries.length, errorDetails };
  },
});

/**
 * Sync a subscription lifecycle change to HubSpot.
 * Used by subscription mutations to keep HubSpot in sync with account status.
 * Fire-and-forget via ctx.scheduler.runAfter(0, ...)
 */
export const syncLifecycleChangeToHubspot = internalAction({
  args: {
    userId: v.id('users'),
    accountStatus: v.string(),
    membershipTier: v.optional(v.string()),
    lifecyclestage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!isHubSpotEnabled()) {
      console.log('[HubSpot] Skipping lifecycle sync - no API key configured');
      return { success: false, reason: 'no_api_key' };
    }

    const user = await ctx.runQuery(api.users.getById, { userId: args.userId });
    if (!user?.email) {
      console.log(`[HubSpot] User ${args.userId} has no email, skipping lifecycle sync`);
      return { success: false, reason: 'no_email' };
    }

    const properties = mapLifecycleChangeToHubSpot({
      accountStatus: args.accountStatus,
      membershipTier: args.membershipTier,
      lifecyclestage: args.lifecyclestage,
    });

    try {
      const result = await upsertContact(user.email, properties);
      console.log(
        `[HubSpot] Lifecycle sync: ${user.email} → ${args.accountStatus} (ID: ${result.id})`
      );
      return { success: true, hubspotId: result.id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[HubSpot] FAILED lifecycle sync for ${user.email}: ${errorMessage}`);
      return { success: false, reason: 'api_error', error: errorMessage };
    }
  },
});

/**
 * Sync an admin analytics funnel event to HubSpot as a datetime flag.
 * Used by the central analyticsEvent dispatcher.
 */
export const syncFunnelEventToHubspot = internalAction({
  args: {
    userId: v.id('users'),
    eventName: v.string(),
  },
  handler: async (ctx, args) => {
    if (!isHubSpotEnabled()) {
      return { success: false, reason: 'no_api_key' };
    }

    const user = await ctx.runQuery(api.users.getById, { userId: args.userId });
    if (!user || !user.email) {
      return { success: false, reason: 'no_email' };
    }

    // Map the eventName to the correct HubSpot property
    const propertyMap: Record<string, string> = {
      'signup_started': 'phoo_funnel_signup_started_at',
      'signup_completed': 'phoo_funnel_signup_completed_at',
      'project_created': 'phoo_funnel_project_created_at',
      'gsc_connected': 'phoo_funnel_gsc_connected_at',
      'keywords_imported': 'phoo_funnel_keywords_imported_at',
      'clusters_generated': 'phoo_funnel_clusters_generated_at',
      'brief_created': 'phoo_funnel_brief_created_at',
      'content_published': 'phoo_funnel_content_published_at',
    };

    const propertyName = propertyMap[args.eventName];
    if (!propertyName) {
      // Not a tracked HubSpot funnel event — ignore silently
      return { success: false, reason: 'unmapped_event' };
    }

    try {
      const properties: Record<string, string | number | boolean> = {
        [propertyName]: Date.now(),
      };

      await upsertContact(user.email, properties);
      console.log(`[HubSpot] Funnel Event Synced: ${args.eventName} for ${user.email}`);
      return { success: true };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error(`[HubSpot] Failed to sync funnel event ${args.eventName} for ${user.email}`, errorMessage);
      return { success: false, error: errorMessage };
    }
  },
});
