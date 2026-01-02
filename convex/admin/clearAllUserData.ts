/**
 * Database Cleanup Script
 *
 * Clears all user data while PRESERVING the global keywordLibrary table.
 * Run with: npx convex run admin/clearAllUserData:clearAllUserData
 *
 * Add --dry-run to preview what would be deleted without actually deleting.
 */
import { internalMutation } from '../_generated/server';
import { v } from 'convex/values';

export const clearAllUserData = internalMutation({
  args: {
    dryRun: v.optional(v.boolean()),
    confirmPhrase: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Safety check - require confirmation phrase for real deletes
    if (!args.dryRun && args.confirmPhrase !== 'DELETE_ALL_USER_DATA') {
      return {
        error: 'Safety check failed. Pass confirmPhrase: "DELETE_ALL_USER_DATA" to proceed.',
        dryRun: true,
      };
    }

    const stats: Record<string, number> = {};
    const isDryRun = args.dryRun ?? true;

    // Helper to clear a table
    const clearTable = async (tableName: string) => {
      // @ts-expect-error - dynamic table access
      const docs = await ctx.db.query(tableName).collect();
      stats[tableName] = docs.length;

      if (!isDryRun) {
        for (const doc of docs) {
          await ctx.db.delete(doc._id);
        }
      }
    };

    // Phase 1: Deep Children (No Dependencies)
    await clearTable('briefVersions');
    await clearTable('contentChecks');
    await clearTable('webhookDeliveries');
    await clearTable('submittedUrls');
    await clearTable('prospectDetails');
    await clearTable('gscKeywordSnapshots');
    await clearTable('aiRoutingLogs');
    await clearTable('aiGenerations');

    // Phase 2: Content & SEO
    await clearTable('contentPieces');
    await clearTable('contentCalendars');
    await clearTable('briefs');
    await clearTable('drafts');
    await clearTable('scheduledPosts');
    await clearTable('keywords'); // Project-scoped, DELETE
    await clearTable('keywordClusters');
    await clearTable('keywordIdeas');
    await clearTable('rankings');
    await clearTable('serpAnalyses');
    await clearTable('seoAudits');
    await clearTable('seoStatistics');
    await clearTable('insights');
    await clearTable('projectScores');
    await clearTable('quarterlyPlans');
    await clearTable('competitors');

    // Phase 3: Connections & Analytics
    await clearTable('ga4Connections');
    await clearTable('gscConnections');
    await clearTable('platformConnections');
    await clearTable('analyticsData');
    await clearTable('competitorAnalytics');
    await clearTable('analyticsEvents');
    await clearTable('apiKeys');
    await clearTable('oauthTokens');
    await clearTable('generatedPages');

    // Phase 4: Projects & Prospects
    await clearTable('aiReports');
    await clearTable('projects');
    await clearTable('prospects');

    // Phase 5: Billing & Auth
    await clearTable('subscriptions');
    await clearTable('usageLimits');
    await clearTable('clients');
    await clearTable('apiAccessRequests');
    await clearTable('passwordResetTokens');
    await clearTable('contentTemplates');
    await clearTable('personas');

    // Phase 6: Organizations
    await clearTable('organizationInvitations');
    await clearTable('teamMembers');
    await clearTable('webhooks');
    await clearTable('organizations');

    // Phase 7: Users (Convex Auth tables)
    await clearTable('authSessions');
    await clearTable('authAccounts');
    await clearTable('authRefreshTokens');
    await clearTable('authVerificationCodes');
    await clearTable('authVerifiers');
    await clearTable('authRateLimits');
    await clearTable('users');

    // Calculate totals
    const totalRecords = Object.values(stats).reduce((a, b) => a + b, 0);

    return {
      dryRun: isDryRun,
      message: isDryRun
        ? `DRY RUN: Would delete ${totalRecords} records across ${Object.keys(stats).length} tables`
        : `DELETED ${totalRecords} records across ${Object.keys(stats).length} tables`,
      stats,
      preserved: ['keywordLibrary', 'aiProviders', 'aiModels', 'aiProviderHealth'],
    };
  },
});
