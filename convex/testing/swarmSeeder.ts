import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { auth } from '../auth';

export const seedSwarmAccount = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Only execute locally
    if (process.env.NODE_ENV !== 'development') return false;

    const userId = await auth.getUserId(ctx);
    if (!userId) return false;

    const user = await ctx.db.get(userId);
    if (!user) return false;

    let tier: 'starter' | 'engine' | 'agency' = 'starter';
    let targetProjects = 0;
    let newRole: string | undefined = undefined;

    if (args.email.includes('starter')) {
      tier = 'starter';
      targetProjects = 0; // limit is 1, so 1st will succeed, 2nd block
    } else if (args.email.includes('engine')) {
      tier = 'engine';
      targetProjects = 2; // limit is 3, so 3rd will succeed, 4th block
    } else if (args.email.includes('agency')) {
      tier = 'agency';
      targetProjects = 9; // limit is 10, so 10th will succeed, 11th block
    } else if (args.email.includes('superadmin')) {
      tier = 'agency';
      targetProjects = 1; 
      newRole = 'super_admin';
    } else {
      return false; // Not a swarm testing email
    }

    // Assign the tier to bypass Stripe constraints via beta logic/override
    const patchData: any = {
      membershipTier: tier,
      subscriptionStatus: 'active',
    };
    if (newRole) patchData.role = newRole;

    await ctx.db.patch(userId, patchData);

    // Count existing projects
    const existing = await ctx.db
      .query('projects')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const needed = targetProjects - existing.length;

    // Create the required number of fake projects to hit N-1
    for (let i = 0; i < needed; i++) {
      await ctx.db.insert('projects', {
        userId,
        name: `Swarm Seed ${i + 1}`,
        domain: `https://seed${i}.swarmsite.com`,
        organizationId: user.organizationId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        settings: { industry: 'Testing' },
      } as any);
    }

    return true;
  },
});
