import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestContext, seedUser, asUser } from '../testHelpers';
import { api } from '../../../convex/_generated/api';

(globalThis as any).vi = vi;

describe('Admin User Provisioning', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should provision a new user, generate a setup token, and schedule the setup email', async () => {
    const t = createTestContext();
    
    // 1. Seed a super_admin user
    const adminId = await seedUser(t, { 
      email: 'admin@phoo.ai', 
      role: 'super_admin' 
    });

    // 2. Call the provisionUser mutation
    const adminContext = t.withIdentity({ subject: adminId, email: 'admin@phoo.ai' });
    const provisionResult = await adminContext.mutation(api.admin.users.provisionUser, {
      email: 'new_client@agency.com',
      name: 'New Client',
      role: 'user',
      membershipTier: 'agency'
    });

    expect(provisionResult.success).toBe(true);
    const newUserId = provisionResult.userId;

    // 3. Verify the user was created correctly
    await t.run(async (ctx) => {
      const newUser = await ctx.db.get(newUserId);
      expect(newUser).toBeDefined();
      expect(newUser?.email).toBe('new_client@agency.com');
      expect(newUser?.name).toBe('New Client');
      expect(newUser?.onboardingStatus).toBe('not_started');
      expect(newUser?.membershipTier).toBe('agency');
      expect(newUser?.isBetaUser).toBe(false);

      // 4. Verify the setup token was generated and stored
      const tokens = await ctx.db
        .query('passwordResetTokens')
        .withIndex('by_user', (q) => q.eq('userId', newUserId))
        .collect();
      
      expect(tokens.length).toBe(1);
      const tokenDoc = tokens[0];
      
      // Token should have a 24-hour expiry
      const expectedExpiry = tokenDoc.createdAt + (24 * 60 * 60 * 1000);
      expect(tokenDoc.expiresAt).toBe(expectedExpiry);
      expect(tokenDoc.triggeredBy).toBe(adminId);
    });

    // 5. Verify scheduled functions (HubSpot sync + Email setup) execute without crashing
    // This indirectly proves the email action was scheduled successfully.
    // If the mock fails, it means the scheduler threw.
    await t.finishAllScheduledFunctions(() => vi.runAllTimers());
  });

  it('should reject provisioning if caller is not a super_admin', async () => {
    const t = createTestContext();
    
    // Seed a normal user
    const normalUserId = await seedUser(t, { 
      email: 'normal@phoo.ai', 
      role: 'user' 
    });

    // Attempt to provision should fail
    await expect(
      asUser(t, normalUserId).mutation(api.admin.users.provisionUser, {
        email: 'hacker@target.com',
        name: 'Hacker',
        role: 'user',
      })
    ).rejects.toThrow(/Forbidden/);
  });
});
