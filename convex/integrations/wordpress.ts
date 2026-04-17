import { query } from '../_generated/server';
import { v } from 'convex/values';
import {
  decryptPlatformCredentials,
  type EncryptedCredentials,
  type PlatformCredentials,
} from '../lib/encryptedCredentials';
import { requireProjectAccess } from "../lib/rbac";

export const getConnection = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {

          // GLASSWING BOLA PATCH: Verify project-level RBAC via Glasswing Protocol
          await requireProjectAccess(ctx, args.projectId, 'viewer');
    // Use platformConnections (replaced legacy oauthTokens + clients pattern)
    const connection = await ctx.db
      .query('platformConnections')
      .withIndex('by_project_platform', (q) =>
        q.eq('projectId', args.projectId).eq('platform', 'wordpress')
      )
      .first();

    if (!connection) return null;

    // Decrypt credentials before returning (they are encrypted at rest)
    const decrypted = await decryptPlatformCredentials(
      connection.credentials as EncryptedCredentials | PlatformCredentials
    );

    return {
      url: connection.siteUrl,
      username: decrypted.username ?? 'admin',
      password: decrypted.applicationPassword ?? '',
    };
  },
});
