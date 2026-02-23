import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestContext, seedUser } from './testHelpers';
import { api, internal } from '../../convex/_generated/api';

(globalThis as any).vi = vi;

describe('Password Reset', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should validate tokens and handle password reset properly', async () => {
    const t = createTestContext();
    const userId = await seedUser(t, { email: 'reset@example.com' });

    // We have to seed a reset token manually since generate is typically outside this file
    const token = 'raw_unhashed_token_123';

    // Hash it the same way the backend expects (SHA-256)
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const tokenHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    await t.run(async (ctx) => {
      await ctx.db.insert('passwordResetTokens', {
        userId,
        tokenHash,
        expiresAt: Date.now() + 1000 * 60 * 60, // 1 hour
        createdAt: Date.now(),
      });
    });

    // 1. Validate Token (Public)
    const validation = await t.query(api.auth.passwordReset.validateToken, {
      token,
    });

    expect(validation.valid).toBe(true);
    expect(validation.email).toBe('reset@example.com');

    // 2. Perform Reset (Public)
    const reset = await t.mutation(api.auth.passwordReset.resetPassword, {
      token,
      newPassword: 'StrongPassword123!',
    });

    expect(reset.success).toBe(true);

    // 3. Ensure token is marked used
    const validationAfter = await t.query(api.auth.passwordReset.validateToken, {
      token,
    });

    expect(validationAfter.valid).toBe(false);
    expect(validationAfter.reason).toBe('used');

    await t.finishAllScheduledFunctions(() => vi.runAllTimers());
  });

  it('should cleanup expired tokens via internal cron job mutation', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);

    await t.run(async (ctx) => {
      await ctx.db.insert('passwordResetTokens', {
        userId,
        tokenHash: 'expired_hash',
        expiresAt: Date.now() - 48 * 60 * 60 * 1000, // 48 hours ago
        createdAt: Date.now() - 49 * 60 * 60 * 1000,
      });
    });

    const cleanup = await t.mutation(internal.auth.passwordReset.cleanupExpiredTokens, {});
    expect(cleanup.deleted).toBe(1);
    await t.finishAllScheduledFunctions(() => vi.runAllTimers());
  });
});
