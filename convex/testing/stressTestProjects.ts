import { internalAction, internalMutation } from '../_generated/server';
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { planConfig } from '../subscriptions/subscriptions';

/**
 * Executes a simulated burst-attack of parallel project creations 
 * to verify that Convex's serializable transactional isolation guarantees 
 * properly enforce user limits without race-condition gaps.
 */
export const triggerCreationStressTest = internalAction({
  args: { 
    userId: v.id('users'),
    simulatedBurstCount: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const burstCount = args.simulatedBurstCount ?? 15;
    console.log(`Starting Stress Test for User: ${args.userId} with burst size: ${burstCount}`);
    
    // Launch N simultaneous creation attempts
    const burst = Array.from({ length: burstCount }).map(async (_, i) => {
      try {
        await ctx.runMutation(internal.testing.stressTestProjects.mockCreateProject, {
          userId: args.userId,
          name: `Stress Test Project ${i}`,
          websiteUrl: `https://stress-${i}.com`,
        });
        return { index: i, status: 'SUCCESS' };
      } catch (err: any) {
        return { index: i, status: 'REJECTED', reason: err.message };
      }
    });

    const settled = await Promise.all(burst);
    const successes = settled.filter(s => s.status === 'SUCCESS').length;
    const rejections = settled.filter(s => s.status === 'REJECTED').length;

    console.log(`Stress Test Completed. Successes: ${successes}, Rejections: ${rejections}`);
    
    // Attempt cleanup
    const cleanupMap = settled.filter(s => s.status === 'SUCCESS').map(s => s.index);
    if (cleanupMap.length > 0) {
      console.log(`Need to cleanup ${cleanupMap.length} test projects, but skipping for manual verification... (use adminDeleteProject if needed)`);
    }

    return { successes, rejections, log: settled };
  }
});

/**
 * Exact replica of the limit extraction from projects.ts -> createProject,
 * modified exclusively to accept `userId` programmatically rather than via HTTP Auth Context.
 */
export const mockCreateProject = internalMutation({
  args: {
    userId: v.id('users'),
    name: v.string(),
    websiteUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Default to global org boundary representation
    const orgId = user?.organizationId;

    const projects = orgId
      ? await ctx.db
          .query('projects')
          .withIndex('by_org', (q) => q.eq('organizationId', orgId))
          .collect()
      : await ctx.db
          .query('projects')
          .withIndex('by_user', (q) => q.eq('userId', args.userId))
          .collect();

    let effectiveTier = user.membershipTier ?? 'none';
    
    if (orgId) {
      const org = await ctx.db.get(orgId);
      if (org && org.ownerId) {
        const owner = await ctx.db.get(org.ownerId);
        if (owner) {
          effectiveTier = owner.membershipTier ?? 'none';
        }
      }
    }

    const config = planConfig(effectiveTier);
    const limit: number = orgId 
      ? (await ctx.db.get(orgId))?.maxProjects ?? config?.features.maxUrls ?? 0 
      : config?.features.maxUrls ?? 0;

    if (projects.length >= limit) {
      if (limit === 0) {
        throw new Error(
          'LIMIT_REACHED: Payment required. Please subscribe to a plan to start MartAI.'
        );
      }
      throw new Error(
        `LIMIT_REACHED: Upgrade your plan to manage more websites. Current limit: ${limit}`
      );
    }

    const projectId = await ctx.db.insert('projects', {
      userId: args.userId,
      organizationId: orgId,
      name: args.name,
      websiteUrl: args.websiteUrl,
      projectType: 'own',
      urlLocked: true, 
      serpAnalysisUsed: false, 
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return projectId;
  }
});
