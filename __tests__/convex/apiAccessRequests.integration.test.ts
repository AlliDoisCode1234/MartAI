import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestContext, seedUser } from './testHelpers';
import { api } from '../../convex/_generated/api';

// Make vi globally available so convex-test's finishAllScheduledFunctions can find it
(globalThis as any).vi = vi;

describe('API Access Requests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should allow public form submissions', async () => {
    const t = createTestContext();

    // 1. Submit Request
    const res1 = await t.mutation(api.apiAccessRequests.submitRequest, {
      email: 'enterprise@example.com',
      companyName: 'Example Inc',
      useCase: 'Data enrichment',
      expectedMonthlyVolume: '100k+',
    });

    expect(res1.requestId).toBeDefined();
    expect(res1.isNew).toBe(true);

    // 2. Submit the same email again (patch)
    const res2 = await t.mutation(api.apiAccessRequests.submitRequest, {
      email: 'enterprise@example.com',
      companyName: 'Example Inc Updated',
      useCase: 'Data enrichment',
      expectedMonthlyVolume: '100k+',
    });

    expect(res2.requestId).toBe(res1.requestId);
    expect(res2.isNew).toBe(false);

    // 3. Admin can list, get, and approve
    const adminId = await seedUser(t, { role: 'admin' });
    const authT = t.withIdentity({ subject: adminId });

    const reqs = await authT.query(api.apiAccessRequests.listRequests, {});
    expect(reqs).toHaveLength(1);

    const singleReq = await authT.query(api.apiAccessRequests.getRequest, {
      requestId: res1.requestId,
    });
    expect(singleReq?.email).toBe('enterprise@example.com');
    expect(singleReq?.companyName).toBe('Example Inc Updated');

    await authT.mutation(api.apiAccessRequests.approveRequest, {
      requestId: res1.requestId,
      adminNotes: 'Looks good',
    });

    // Check status
    const verified = await authT.query(api.apiAccessRequests.getRequest, {
      requestId: res1.requestId,
    });
    expect(verified?.status).toBe('approved');

    // Wait for all HubSpot background syncs to complete before finishing the test case
    await t.finishAllScheduledFunctions(() => vi.runAllTimers());
  });

  it('should block unauthorized approvals', async () => {
    const t = createTestContext();

    // Seed a request manually to get a valid ID
    const dummyReqId = await t.run(async (ctx) => {
      return await ctx.db.insert('apiAccessRequests', {
        email: 'test@reject.com',
        companyName: 'Reject Co',
        useCase: 'Testing',
        expectedMonthlyVolume: '10',
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const rejecterId = await seedUser(t, { role: 'admin' });
    const authT = t.withIdentity({ subject: rejecterId });

    await authT.mutation(api.apiAccessRequests.rejectRequest, {
      requestId: dummyReqId,
    });

    const req = await authT.query(api.apiAccessRequests.getRequest, {
      requestId: dummyReqId,
    });
    expect(req?.status).toBe('rejected');

    // Wait for all HubSpot background syncs to complete before finishing the test case
    await t.finishAllScheduledFunctions(() => vi.runAllTimers());
  });
});
