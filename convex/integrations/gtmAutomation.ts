import {
  internalAction,
  query,
  action,
  internalMutation,
  internalQuery,
} from '../_generated/server';
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
 * 4. Creates All Pages trigger + GA4 Config Tag.
 * 5. Enables form built-in variables.
 * 5.5. Creates Form Submission trigger.
 * 5.6. Creates Custom Event fallback trigger (for AJAX/third-party forms).
 * 5.7. Creates GA4 generate_lead Event Tag.
 * 6. Publishes the Container.
 * 7. Stores the connection in Convex.
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

      // 5. Enable form-related built-in variables
      console.log(`[GTM] Enabling form built-in variables...`);
      const builtInVarRes = await fetchWithExponentialBackoff(
        `${workspacePath}/built_in_variables?type=formId&type=formClasses&type=formText&type=formUrl`,
        { method: 'POST', headers }
      );
      if (!builtInVarRes.ok) {
        // Non-fatal: log but continue — lead tracking still works without variable enrichment
        const body = await builtInVarRes.text();
        console.warn(`[GTM] Failed to enable built-in variables (${builtInVarRes.status}):`, body);
      }

      // 5.5. Create Form Submission trigger
      console.log(`[GTM] Creating Form Submission trigger...`);
      const formTriggerRes = await fetchWithExponentialBackoff(`${workspacePath}/triggers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'Form Submission - All Forms (Phoo Automated)',
          type: 'formSubmission',
          waitForTags: { type: 'BOOLEAN', value: 'true' },
          checkValidation: { type: 'BOOLEAN', value: 'true' },
          waitForTagsTimeout: { type: 'TEMPLATE', value: '2000' },
        }),
      });
      if (!formTriggerRes.ok) {
        const body = await formTriggerRes.text();
        console.error(`[GTM] Failed to create form trigger (${formTriggerRes.status}):`, body);
        throw new Error('GTM_FORM_TRIGGER_ERROR');
      }
      const formTriggerData = await formTriggerRes.json();
      const formTriggerId = formTriggerData.triggerId;

      // 5.6. Create Custom Event fallback trigger (for AJAX/third-party forms like JotForm, Typeform)
      console.log(`[GTM] Creating Custom Event fallback trigger...`);
      const customEventTriggerRes = await fetchWithExponentialBackoff(`${workspacePath}/triggers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'Custom Event - generate_lead (Phoo Automated)',
          type: 'customEvent',
          customEventFilter: [
            {
              type: 'EQUALS',
              parameter: [
                { type: 'TEMPLATE', key: 'arg0', value: '{{_event}}' },
                { type: 'TEMPLATE', key: 'arg1', value: 'generate_lead' },
              ],
            },
          ],
        }),
      });
      if (!customEventTriggerRes.ok) {
        const body = await customEventTriggerRes.text();
        console.error(
          `[GTM] Failed to create custom event trigger (${customEventTriggerRes.status}):`,
          body
        );
        throw new Error('GTM_CUSTOM_EVENT_TRIGGER_ERROR');
      }
      const customEventTriggerData = await customEventTriggerRes.json();
      const customEventTriggerId = customEventTriggerData.triggerId;

      // 5.7. Create GA4 generate_lead Event Tag (fires on both form submission AND custom event)
      console.log(`[GTM] Creating GA4 generate_lead Event Tag...`);
      const leadTagRes = await fetchWithExponentialBackoff(`${workspacePath}/tags`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'GA4 Event - Generate Lead (Phoo Automated)',
          type: 'gaawe',
          parameter: [
            { type: 'TEMPLATE', key: 'eventName', value: 'generate_lead' },
            {
              type: 'TEMPLATE',
              key: 'measurementIdOverride',
              value: args.ga4MeasurementId,
            },
            {
              type: 'LIST',
              key: 'eventParameters',
              list: [
                {
                  type: 'MAP',
                  map: [
                    { type: 'TEMPLATE', key: 'name', value: 'form_id' },
                    { type: 'TEMPLATE', key: 'value', value: '{{Form ID}}' },
                  ],
                },
              ],
            },
          ],
          firingTriggerId: [formTriggerId, customEventTriggerId],
        }),
      });
      if (!leadTagRes.ok) {
        const body = await leadTagRes.text();
        console.error(`[GTM] Failed to create generate_lead tag (${leadTagRes.status}):`, body);
        throw new Error('GTM_LEAD_TAG_ERROR');
      }

      console.log(`[GTM] Lead tracking tags and triggers created successfully`);

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

/**
 * Upgrade an existing GTM container to include lead tracking tags.
 * Idempotent — checks for existing "Generate Lead" tag before creating.
 */
export const upgradeExistingContainer = internalAction({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args): Promise<{ success: boolean; skipped?: boolean; error?: string }> => {
    const connection = await ctx.runQuery(
      internal.integrations.gtmAutomation.getGTMConnectionInternal,
      { projectId: args.projectId }
    );

    if (!connection) {
      return { success: false, error: 'No GTM connection found for this project.' };
    }

    const accessToken = await decryptCredential(connection.accessToken);
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    const workspacePath = `${GTM_API_BASE}/${connection.accountId}/containers/${connection.containerId}/workspaces/${connection.workspaceId}`;

    try {
      // Check if the generate_lead tag already exists (idempotency)
      const tagsRes = await fetchWithExponentialBackoff(`${workspacePath}/tags`, { headers });
      if (!tagsRes.ok) {
        throw new Error(`Failed to list tags: ${tagsRes.status}`);
      }
      const tagsData = await tagsRes.json();
      const existingLeadTag = (tagsData.tag || []).find(
        (t: { name: string }) => t.name === 'GA4 Event - Generate Lead (Phoo Automated)'
      );

      if (existingLeadTag) {
        console.log(
          `[GTM Upgrade] Lead tag already exists for project ${args.projectId}. Skipping.`
        );
        return { success: true, skipped: true };
      }

      // Enable form built-in variables (safe to re-enable)
      await fetchWithExponentialBackoff(
        `${workspacePath}/built_in_variables?type=formId&type=formClasses&type=formText&type=formUrl`,
        { method: 'POST', headers }
      );

      // Create Form Submission trigger
      const formTriggerRes = await fetchWithExponentialBackoff(`${workspacePath}/triggers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'Form Submission - All Forms (Phoo Automated)',
          type: 'formSubmission',
          waitForTags: { type: 'BOOLEAN', value: 'true' },
          checkValidation: { type: 'BOOLEAN', value: 'true' },
          waitForTagsTimeout: { type: 'TEMPLATE', value: '2000' },
        }),
      });
      if (!formTriggerRes.ok) throw new Error('Failed to create form trigger');
      const formTriggerId = (await formTriggerRes.json()).triggerId;

      // Create Custom Event fallback trigger
      const customTriggerRes = await fetchWithExponentialBackoff(`${workspacePath}/triggers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'Custom Event - generate_lead (Phoo Automated)',
          type: 'customEvent',
          customEventFilter: [
            {
              type: 'EQUALS',
              parameter: [
                { type: 'TEMPLATE', key: 'arg0', value: '{{_event}}' },
                { type: 'TEMPLATE', key: 'arg1', value: 'generate_lead' },
              ],
            },
          ],
        }),
      });
      if (!customTriggerRes.ok) throw new Error('Failed to create custom event trigger');
      const customTriggerId = (await customTriggerRes.json()).triggerId;

      // Retrieve GA4 Config tag to get measurement ID
      const ga4ConfigTag = (tagsData.tag || []).find((t: { type: string }) => t.type === 'gaawc');
      const measurementId =
        ga4ConfigTag?.parameter?.find((p: { key: string }) => p.key === 'measurementId')?.value ||
        '';

      if (!measurementId) {
        console.warn(`[GTM Upgrade] No GA4 measurement ID found for project ${args.projectId}`);
      }

      // Create GA4 generate_lead Event Tag
      const leadTagRes = await fetchWithExponentialBackoff(`${workspacePath}/tags`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'GA4 Event - Generate Lead (Phoo Automated)',
          type: 'gaawe',
          parameter: [
            { type: 'TEMPLATE', key: 'eventName', value: 'generate_lead' },
            { type: 'TEMPLATE', key: 'measurementIdOverride', value: measurementId },
            {
              type: 'LIST',
              key: 'eventParameters',
              list: [
                {
                  type: 'MAP',
                  map: [
                    { type: 'TEMPLATE', key: 'name', value: 'form_id' },
                    { type: 'TEMPLATE', key: 'value', value: '{{Form ID}}' },
                  ],
                },
              ],
            },
          ],
          firingTriggerId: [formTriggerId, customTriggerId],
        }),
      });
      if (!leadTagRes.ok) throw new Error('Failed to create generate_lead tag');

      // Publish new version
      const publishRes = await fetchWithExponentialBackoff(`${workspacePath}/versions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'Lead Tracking Upgrade (Phoo.ai)',
        }),
      });
      if (!publishRes.ok) {
        console.warn(`[GTM Upgrade] Failed to publish — changes saved as draft`);
      }

      console.log(`[GTM Upgrade] Successfully upgraded container for project ${args.projectId}`);
      return { success: true };
    } catch (e: unknown) {
      console.error(`[GTM Upgrade] Error for project ${args.projectId}:`, e);
      return {
        success: false,
        error: e instanceof Error ? e.message : 'Unknown upgrade error',
      };
    }
  },
});

/**
 * Batch upgrade all existing GTM containers to include lead tracking.
 * Admin-only migration action.
 */
export const upgradeAllContainers = internalAction({
  args: {},
  handler: async (ctx) => {
    const connections = await ctx.runQuery(
      internal.integrations.gtmAutomation.listAllGTMConnections
    );

    const results: Array<{
      projectId: string;
      success: boolean;
      skipped?: boolean;
      error?: string;
    }> = [];

    for (const conn of connections) {
      try {
        const result = await ctx.runAction(
          internal.integrations.gtmAutomation.upgradeExistingContainer,
          { projectId: conn.projectId }
        );
        results.push({ projectId: conn.projectId as string, ...result });
      } catch (e: unknown) {
        results.push({
          projectId: conn.projectId as string,
          success: false,
          error: e instanceof Error ? e.message : 'Unknown error',
        });
      }
    }

    const upgraded = results.filter((r) => r.success && !r.skipped).length;
    const skipped = results.filter((r) => r.skipped).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(
      `[GTM Upgrade] Batch complete: ${upgraded} upgraded, ${skipped} skipped, ${failed} failed`
    );
    return { results, summary: { upgraded, skipped, failed } };
  },
});

/**
 * Internal query to get GTM connection with encrypted tokens (server-side only).
 */
export const getGTMConnectionInternal = internalQuery({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('gtmConnections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();
  },
});

/**
 * Internal query to list all GTM connections for batch operations.
 */
export const listAllGTMConnections = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('gtmConnections').collect();
  },
});
