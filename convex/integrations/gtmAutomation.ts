import { internalAction, mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';
import { fetchWithExponentialBackoff } from '../lib/apiResilience';
import { encryptCredential, decryptCredential } from '../lib/encryption';

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
  handler: async (ctx, args) => {
    console.log(`[GTM] Starting container provisioning for ${args.domain}`);
    const headers = {
      Authorization: `Bearer ${args.accessToken}`,
      'Content-Type': 'application/json',
    };

    try {
      // 1. Check Accounts or Create Account
      const accountsRes = await fetchWithExponentialBackoff(GTM_API_BASE, { headers });
      if (!accountsRes.ok) throw new Error(`Failed to list accounts: ${await accountsRes.text()}`);

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

      if (!containerRes.ok)
        throw new Error(`Failed to create container: ${await containerRes.text()}`);
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
      if (!workspacesRes.ok)
        throw new Error(`Failed to list workspaces: ${await workspacesRes.text()}`);

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
      if (!triggerRes.ok) throw new Error(`Failed to create trigger: ${await triggerRes.text()}`);
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
      if (!tagRes.ok) throw new Error(`Failed to create GA4 tag: ${await tagRes.text()}`);

      // 6. Publish Version
      console.log(`[GTM] Publishing container workspace...`);
      const publishRes = await fetchWithExponentialBackoff(`${workspacePath}/versions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'Initial Automated Setup (Phoo.ai)',
        }),
      });
      if (!publishRes.ok) throw new Error(`Failed to publish version: ${await publishRes.text()}`);

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
    } catch (e: any) {
      console.error('[GTM] Provisioning Error:', e);
      return { success: false, error: String(e) };
    }
  },
});

export const storeConnection = mutation({
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
    const connection = await ctx.db
      .query('gtmConnections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    if (!connection) return null;

    return {
      ...connection,
      accessToken: connection.accessToken
        ? await decryptCredential(connection.accessToken)
        : undefined,
      refreshToken: connection.refreshToken
        ? await decryptCredential(connection.refreshToken)
        : undefined,
    };
  },
});
