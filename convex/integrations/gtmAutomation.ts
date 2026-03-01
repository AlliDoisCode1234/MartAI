import { internalAction, query, action, internalMutation } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';
import { fetchWithExponentialBackoff } from '../lib/apiResilience';
import { encryptCredential, decryptCredential } from '../lib/encryption';
import { requireProjectAccess } from '../lib/rbac';

export const provisionTenantContainerPublic = action({
  args: {
    projectId: v.id('projects'),
    ga4MeasurementId: v.string(),
  },
  handler: async (
    ctx,
    args
  ): Promise<{ success: boolean; containerPublicId?: string; error?: string }> => {
    // 1. Access check
    const { project } = await requireProjectAccess(ctx, args.projectId, 'editor');

    // 2. Validate measurement ID format
    if (!/^G-[A-Z0-9]+$/.test(args.ga4MeasurementId)) {
      throw new Error('Invalid GA4 Measurement ID format. Expected: G-XXXXXXX');
    }

    // 3. Fetch tokens server-side
    const ga4Connection = await ctx.runQuery(
      internal.integrations.ga4Connections.getGA4ConnectionInternal,
      { projectId: args.projectId }
    );
    if (!ga4Connection?.accessToken) {
      throw new Error('No Google account connected. Please connect GA4 first.');
    }

    // 4. Extract domain from project URL
    const domain = new URL(project.websiteUrl).hostname;

    // 5. Delegate to internal action
    const result = await ctx.runAction(
      internal.integrations.gtmAutomation.provisionTenantContainer,
      {
        projectId: args.projectId,
        domain,
        ga4MeasurementId: args.ga4MeasurementId,
        accessToken: ga4Connection.accessToken,
        refreshToken: ga4Connection.refreshToken,
      }
    );

    if (!result.success) {
      // Log detailed error server-side, return generic message
      console.error('[GTM] Provisioning failed:', result.error);
      return { success: false, error: 'Automation failed. Please try again.' };
    }

    return { success: true, containerPublicId: result.containerPublicId };
  },
});

const GTM_API_BASE = 'https://tagmanager.googleapis.com/tagmanager/v2/accounts';

/**
 * Automate GTM Setup:
 * 1. Checks for existing GTM Accounts. If none, creates one.
 * 2. Creates a Container for the domain.
 * 3. Finds the Default Workspace.
 * 4. Injects GA4 Config Tag + All Pages Trigger.
 * 5. Publishes the Container.
 */
export const provisionTenantContainer = internalAction({
  args: {
    projectId: v.id('projects'),
    domain: v.string(),
    ga4MeasurementId: v.string(), // E.g. 'G-XXXXXXX'
    accessToken: v.string(),
    refreshToken: v.optional(v.string()), // Used to save to DB
  },
  handler: async (
    ctx,
    args
  ): Promise<{ success: boolean; containerPublicId?: string; error?: string }> => {
    console.log(`[GTM] Starting container provisioning for ${args.domain}`);
    const headers = {
      Authorization: `Bearer ${args.accessToken}`,
      'Content-Type': 'application/json',
    };

    try {
      // 1. Check Accounts or Create Account
      const accountsRes = await fetchWithExponentialBackoff(GTM_API_BASE, { headers });
      if (!accountsRes.ok) {
        const body = await accountsRes.text();
        console.error(`[GTM] Failed to list accounts (${accountsRes.status}):`, body);
        throw new Error('GTM_ACCOUNTS_ERROR');
      }

      const accountsData = await accountsRes.json();
      let accountId = '';

      if (accountsData.account && accountsData.account.length > 0) {
        accountId = accountsData.account[0].accountId;
        console.log(`[GTM] Found existing account: ${accountId}`);
      } else {
        return {
          success: false,
          error:
            "No Google Tag Manager account found, and the API doesn't support programmatic root account creation. Please create a Free GTM Account manually first.",
        };
      }

      // 2. Create Container
      const accountPath = `${GTM_API_BASE}/${accountId}`;
      console.log(`[GTM] Creating container for ${args.domain}`);
      const containerRes = await fetchWithExponentialBackoff(`${accountPath}/containers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: `${args.domain} (Phoo Automated)`,
          usageContext: ['web'],
        }),
      });

      if (!containerRes.ok) {
        const body = await containerRes.text();
        console.error(`[GTM] Failed to create container (${containerRes.status}):`, body);
        throw new Error('GTM_CONTAINER_ERROR');
      }
      const containerData = await containerRes.json();
      const containerId = containerData.containerId;
      const containerPublicId = containerData.publicId; // GTM-XXXX
      const containerPath = containerData.path;

      // 3. Find Default Workspace
      console.log(`[GTM] Looking up default workspace for container ${containerId}`);
      const workspacesRes = await fetchWithExponentialBackoff(
        `${GTM_API_BASE}/${accountId}/containers/${containerId}/workspaces`,
        { headers }
      );
      if (!workspacesRes.ok) {
        const body = await workspacesRes.text();
        console.error(`[GTM] Failed to list workspaces (${workspacesRes.status}):`, body);
        throw new Error('GTM_WORKSPACES_ERROR');
      }

      const workspacesData = await workspacesRes.json();
      const workspacePath = workspacesData.workspace[0].path;
      const workspaceId = workspacesData.workspace[0].workspaceId;

      // 4. Create Trigger (All Pages)
      console.log(`[GTM] Creating All Pages trigger...`);
      const triggerRes = await fetchWithExponentialBackoff(`${workspacePath}/triggers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'All Pages (Phoo Automated)',
          type: 'pageview',
        }),
      });
      if (!triggerRes.ok) {
        const body = await triggerRes.text();
        console.error(`[GTM] Failed to create trigger (${triggerRes.status}):`, body);
        throw new Error('GTM_TRIGGER_ERROR');
      }
      const triggerData = await triggerRes.json();
      const triggerId = triggerData.triggerId;

      // 5. Create Tag (GA4 Config)
      console.log(`[GTM] Creating GA4 Configuration Tag...`);
      const tagRes = await fetchWithExponentialBackoff(`${workspacePath}/tags`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'GA4 Configuration (Phoo Automated)',
          type: 'gaawc', // GA4 Web Configuration
          parameter: [
            {
              type: 'template',
              key: 'measurementId',
              value: args.ga4MeasurementId,
            },
          ],
          firingTriggerId: [triggerId],
        }),
      });
      if (!tagRes.ok) {
        const body = await tagRes.text();
        console.error(`[GTM] Failed to create GA4 tag (${tagRes.status}):`, body);
        throw new Error('GTM_TAG_ERROR');
      }

      // 6. Publish Version
      console.log(`[GTM] Publishing container workspace...`);
      const publishRes = await fetchWithExponentialBackoff(`${workspacePath}/versions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'Initial Automated Setup (Phoo.ai)',
        }),
      });
      if (!publishRes.ok) {
        const body = await publishRes.text();
        console.error(`[GTM] Failed to publish version (${publishRes.status}):`, body);
        throw new Error('GTM_PUBLISH_ERROR');
      }

      console.log(`[GTM] Successfully published container ${containerPublicId}`);

      // 7. Store connection in Convex
      await ctx.runMutation(internal.integrations.gtmAutomation.storeConnection, {
        projectId: args.projectId,
        accountId,
        containerId,
        containerPublicId,
        workspaceId,
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
      });

      return {
        success: true,
        containerPublicId,
      };
    } catch (e: unknown) {
      console.error('[GTM] Provisioning Error:', e);
      return { success: false, error: 'GTM provisioning failed. See server logs for details.' };
    }
  },
});

export const storeConnection = internalMutation({
  args: {
    projectId: v.id('projects'),
    accountId: v.string(),
    containerId: v.string(),
    containerPublicId: v.string(),
    workspaceId: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if one exists
    const existing = await ctx.db
      .query('gtmConnections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    const encryptedAccessToken = await encryptCredential(args.accessToken);
    const encryptedRefreshToken = args.refreshToken
      ? await encryptCredential(args.refreshToken)
      : undefined;

    const data = {
      projectId: args.projectId,
      accountId: args.accountId,
      containerId: args.containerId,
      containerPublicId: args.containerPublicId,
      workspaceId: args.workspaceId,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      lastSync: Date.now(),
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert('gtmConnections', {
        ...data,
        createdAt: Date.now(),
      });
    }
  },
});

export const getGTMConnection = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    // Access check
    await requireProjectAccess(ctx, args.projectId, 'viewer');

    const connection = await ctx.db
      .query('gtmConnections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    if (!connection) return null;

    // Limited projection — NO tokens
    return {
      _id: connection._id,
      projectId: connection.projectId,
      accountId: connection.accountId,
      containerId: connection.containerId,
      containerPublicId: connection.containerPublicId,
      workspaceId: connection.workspaceId,
      lastSync: connection.lastSync,
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt,
    };
  },
});
