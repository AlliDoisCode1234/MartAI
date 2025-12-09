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
 */
async function upsertContact(
  email: string,
  properties: Record<string, string | number | boolean>
): Promise<{ id: string; isNew: boolean }> {
  // First, try to find existing contact by email
  try {
    const searchResult = await hubspotRequest('/crm/v3/objects/contacts/search', 'POST', {
      filterGroups: [
        {
          filters: [{ propertyName: 'email', operator: 'EQ', value: email }],
        },
      ],
    });

    if (searchResult.results?.length > 0) {
      // Update existing contact
      const contactId = searchResult.results[0].id;
      await hubspotRequest(`/crm/v3/objects/contacts/${contactId}`, 'PATCH', { properties });
      console.log(`[HubSpot] Updated contact: ${email} (ID: ${contactId})`);
      return { id: contactId, isNew: false };
    }
  } catch (e) {
    // Contact not found, will create new
  }

  // Create new contact
  const createResult = await hubspotRequest('/crm/v3/objects/contacts', 'POST', {
    properties: { email, ...properties },
  });

  console.log(`[HubSpot] Created contact: ${email} (ID: ${createResult.id})`);
  return { id: createResult.id, isNew: true };
}

/**
 * Sync a user to HubSpot
 */
export const syncUserToHubspot = action({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    // Graceful skip if no API key
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

    // Get latest MR score if they have a project
    let mrScore: number | null = null;
    let mrTier: string | null = null;
    let primaryWebsite: string | null = null;

    if (projects.length > 0) {
      primaryWebsite = projects[0].websiteUrl;
      try {
        const mrData = await ctx.runQuery(api.analytics.martaiRatingQueries.getLatestScore, {
          projectId: projects[0]._id,
        });
        if (mrData) {
          mrScore = mrData.overall;
          if (mrScore !== null) {
            if (mrScore >= 80) mrTier = 'thriving';
            else if (mrScore >= 65) mrTier = 'growing';
            else if (mrScore >= 50) mrTier = 'building';
            else mrTier = 'needs_work';
          }
        }
      } catch (e) {
        // No MR score yet
      }
    }

    // Parse name
    const nameParts = (user.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Build properties
    const properties: Record<string, string | number | boolean> = {
      firstname: firstName,
      lastname: lastName,
      // Custom MartAI properties
      martai_plan: user.membershipTier || 'free',
      martai_onboarding_status: user.onboardingStatus || 'not_started',
      martai_project_count: projects.length,
      martai_signup_abandoned: false,
    };

    // Add onboarding step details
    if (user.onboardingSteps) {
      const steps = user.onboardingSteps;
      if (steps.signupCompleted !== undefined) {
        properties.martai_signup_completed = steps.signupCompleted;
      }
      if (steps.planSelected) {
        properties.martai_selected_plan = steps.planSelected;
      }
      if (steps.paymentCompleted !== undefined) {
        properties.martai_payment_completed = steps.paymentCompleted;
      }
      if (steps.projectCreated !== undefined) {
        properties.martai_project_created = steps.projectCreated;
      }
      if (steps.ga4Connected !== undefined) {
        properties.martai_ga4_connected = steps.ga4Connected;
      }
      if (steps.gscConnected !== undefined) {
        properties.martai_gsc_connected = steps.gscConnected;
      }
    }

    // Add MR score if available
    if (mrScore !== null) {
      properties.martai_mr_score = mrScore;
    }
    if (mrTier) {
      properties.martai_mr_tier = mrTier;
    }
    if (primaryWebsite) {
      properties.martai_website = primaryWebsite;
    }

    // Add last activity for churn tracking
    if (user.lastActiveAt) {
      properties.martai_last_activity = user.lastActiveAt;
    }

    // Sync to HubSpot
    const result = await upsertContact(user.email, properties);

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
    // Graceful skip if no API key
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

    const properties: Record<string, string | number | boolean> = {
      firstname: p.firstName || '',
      lastname: p.lastName || '',
      phone: p.phone || '',
      company: p.companyName || '',
      martai_lead_source: p.source || 'website',
      martai_prospect_status: p.status || 'draft',
    };

    if (p.monthlyRevenue) {
      properties.martai_monthly_revenue = p.monthlyRevenue;
    }
    if (p.timeline) {
      properties.martai_timeline = p.timeline;
    }
    if (p.marketingFrustration) {
      properties.martai_marketing_frustration = p.marketingFrustration;
    }

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
    abandonedAtStep: v.string(), // 'signup' | 'plan' | 'payment' | 'onboarding'
    firstName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const properties: Record<string, string | number | boolean> = {
      martai_signup_abandoned: true,
      martai_abandoned_at_step: args.abandonedAtStep,
    };

    if (args.firstName) {
      properties.firstname = args.firstName;
    }

    const result = await upsertContact(args.email, properties);

    return {
      success: true,
      hubspotId: result.id,
      isNew: result.isNew,
    };
  },
});

/**
 * Update MR score for a user (called by weekly cron)
 */
export const updateMRScore = internalAction({
  args: { userId: v.id('users') },
  handler: async (
    ctx,
    args
  ): Promise<{ success: boolean; reason?: string; mrScore?: number; mrTier?: string | null }> => {
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

    // Get latest MR score
    let mrScore: number | null = null;
    let mrTier: string | null = null;

    try {
      const mrData = await ctx.runQuery(api.analytics.martaiRatingQueries.getLatestScore, {
        projectId: projects[0]._id,
      });
      if (mrData) {
        mrScore = mrData.overall;
        if (mrScore !== null) {
          if (mrScore >= 80) mrTier = 'thriving';
          else if (mrScore >= 65) mrTier = 'growing';
          else if (mrScore >= 50) mrTier = 'building';
          else mrTier = 'needs_work';
        }
      }
    } catch (e) {
      return { success: false, reason: 'no_mr_score' };
    }

    if (mrScore === null) {
      return { success: false, reason: 'no_mr_score' };
    }

    const properties: Record<string, string | number | boolean> = {
      martai_mr_score: mrScore,
    };
    if (mrTier) {
      properties.martai_mr_tier = mrTier;
    }

    await upsertContact(user.email, properties);

    return { success: true, mrScore, mrTier };
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
