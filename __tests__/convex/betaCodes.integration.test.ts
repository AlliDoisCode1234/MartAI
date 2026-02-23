import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestContext, seedUser } from './testHelpers';
import { api, internal } from '../../convex/_generated/api';

(globalThis as any).vi = vi;

describe('Beta Access Codes', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should generate, validate, and mark codes as used', async () => {
    const t = createTestContext();
    const adminId = await seedUser(t, { role: 'admin' });
    const authT = t.withIdentity({ subject: adminId });

    // 1. Generate Codes (Admin)
    const generated = await authT.mutation(api.betaCodes.generate, {
      count: 2,
      prefix: 'BETA',
    });

    expect(generated.codes).toHaveLength(2);
    expect(generated.codes[0].startsWith('BETA-')).toBe(true);

    const validCode = generated.codes[0];

    // 2. Validate Code (Public)
    const publicValidation = await t.query(api.betaCodes.validate, {
      code: validCode.toLowerCase(), // testing case insensitivity
    });

    expect(publicValidation.valid).toBe(true);
    expect(publicValidation.code).toBe(validCode);

    // 3. Mark Used (Auth flow)
    const userId = await seedUser(t);
    await t.mutation(api.betaCodes.markUsed, {
      code: validCode,
      userId,
    });

    // 4. Check Stats (Admin)
    const stats = await authT.query(api.betaCodes.getStats, {});
    expect(stats.total).toBe(2);
    expect(stats.active).toBe(1);
    expect(stats.used).toBe(1);

    // 5. Revoke Code (Admin)
    await authT.mutation(api.betaCodes.revoke, {
      codeId: await t.run(async (ctx) => {
        return (await ctx.db.query('betaCodes').first())!._id;
      }),
    });

    await t.finishAllScheduledFunctions(() => vi.runAllTimers());
  });

  it('should enforce batch limits on generation', async () => {
    const t = createTestContext();
    const adminId = await seedUser(t, { role: 'admin' });
    const authT = t.withIdentity({ subject: adminId });

    await expect(authT.mutation(api.betaCodes.generate, { count: 101 })).rejects.toThrow(
      'Maximum 100 codes per batch'
    );
  });
});
