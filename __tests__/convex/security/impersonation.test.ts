/**
 * Admin Impersonation Integration Tests
 *
 * Security-focused tests for the dev impersonation feature.
 * Following Kent C. Dodds Testing Trophy - mostly integration tests.
 *
 * Test Hierarchy:
 * __tests__/convex/security/
 * └── impersonation.test.ts (this file)
 */

import { convexTest } from 'convex-test';
import { expect, describe, it, beforeEach } from 'vitest';
import { v } from 'convex/values';
import { api, internal } from '../../../convex/_generated/api';
import schema from '../../../convex/schema';

describe('Admin Impersonation', () => {
  describe('startImpersonation', () => {
    it('should allow super_admin to impersonate regular user', async () => {
      const t = convexTest(schema);

      // Setup: Create super_admin and regular user
      const adminId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'admin@example.com',
          name: 'Super Admin',
          role: 'super_admin',
          createdAt: Date.now(),
        });
      });

      const targetUserId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user',
          createdAt: Date.now(),
        });
      });

      // Act
      const result = await t
        .withIdentity({ email: 'admin@example.com' })
        .mutation(api.admin.impersonation.startImpersonation, {
          targetUserId,
          reason: 'Testing impersonation flow',
        });

      // Assert
      expect(result).toBeDefined();
      expect(result.sessionId).toBeDefined();
      expect(result.targetUser.id).toBe(targetUserId);
      expect(result.expiresAt).toBeGreaterThan(Date.now());
    });

    it('should reject non-super_admin from impersonating', async () => {
      const t = convexTest(schema);

      // Setup: Create regular admin and user
      const adminId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'regular-admin@example.com',
          name: 'Regular Admin',
          role: 'admin', // Not super_admin
          createdAt: Date.now(),
        });
      });

      const targetUserId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'user@example.com',
          name: 'Target User',
          role: 'user',
          createdAt: Date.now(),
        });
      });

      // Act & Assert
      await expect(
        t
          .withIdentity({ email: 'regular-admin@example.com' })
          .mutation(api.admin.impersonation.startImpersonation, {
            targetUserId,
          })
      ).rejects.toThrow('Unauthorized');
    });

    it('should prevent impersonating other super_admins', async () => {
      const t = convexTest(schema);

      // Setup: Create two super_admins
      const admin1Id = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'admin1@example.com',
          name: 'Super Admin 1',
          role: 'super_admin',
          createdAt: Date.now(),
        });
      });

      const admin2Id = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'admin2@example.com',
          name: 'Super Admin 2',
          role: 'super_admin',
          createdAt: Date.now(),
        });
      });

      // Act & Assert
      await expect(
        t
          .withIdentity({ email: 'admin1@example.com' })
          .mutation(api.admin.impersonation.startImpersonation, {
            targetUserId: admin2Id,
          })
      ).rejects.toThrow('Unauthorized');
    });

    it('should end existing session when starting new one', async () => {
      const t = convexTest(schema);

      // Setup
      const adminId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'admin@example.com',
          name: 'Super Admin',
          role: 'super_admin',
          createdAt: Date.now(),
        });
      });

      const user1Id = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'user1@example.com',
          role: 'user',
          createdAt: Date.now(),
        });
      });

      const user2Id = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'user2@example.com',
          role: 'user',
          createdAt: Date.now(),
        });
      });

      // Create first session manually
      const session1Id = await t.run(async (ctx) => {
        return await ctx.db.insert('impersonationSessions', {
          adminUserId: adminId,
          adminEmail: 'admin@example.com',
          targetUserId: user1Id,
          targetEmail: 'user1@example.com',
          status: 'active',
          permissions: 'full_access',
          startedAt: Date.now(),
          expiresAt: Date.now() + 3600000,
        });
      });

      // Act: Start new session for user2
      const result = await t
        .withIdentity({ email: 'admin@example.com' })
        .mutation(api.admin.impersonation.startImpersonation, {
          targetUserId: user2Id,
        });

      // Assert: First session should be ended
      const session1 = await t.run(async (ctx) => {
        return await ctx.db.get(session1Id);
      });

      expect(session1?.status).toBe('ended');
      expect(session1?.endReason).toBe('admin_logout');
      expect(result.targetUser.id).toBe(user2Id);
    });
  });

  describe('endImpersonation', () => {
    it('should end active session', async () => {
      const t = convexTest(schema);

      // Setup
      const adminId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'admin@example.com',
          role: 'super_admin',
          createdAt: Date.now(),
        });
      });

      const targetId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'user@example.com',
          role: 'user',
          createdAt: Date.now(),
        });
      });

      const sessionId = await t.run(async (ctx) => {
        return await ctx.db.insert('impersonationSessions', {
          adminUserId: adminId,
          adminEmail: 'admin@example.com',
          targetUserId: targetId,
          targetEmail: 'user@example.com',
          status: 'active',
          permissions: 'full_access',
          startedAt: Date.now(),
          expiresAt: Date.now() + 3600000,
        });
      });

      // Act
      const result = await t
        .withIdentity({ email: 'admin@example.com' })
        .mutation(api.admin.impersonation.endImpersonation, {
          sessionId,
        });

      // Assert
      expect(result.ended).toBe(true);

      const session = await t.run(async (ctx) => {
        return await ctx.db.get(sessionId);
      });
      expect(session?.status).toBe('ended');
      expect(session?.endReason).toBe('manual');
    });

    it('should prevent ending another admin session', async () => {
      const t = convexTest(schema);

      // Setup: Two admins
      const admin1Id = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'admin1@example.com',
          role: 'super_admin',
          createdAt: Date.now(),
        });
      });

      const admin2Id = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'admin2@example.com',
          role: 'super_admin',
          createdAt: Date.now(),
        });
      });

      const targetId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'user@example.com',
          role: 'user',
          createdAt: Date.now(),
        });
      });

      // Admin1's session
      const sessionId = await t.run(async (ctx) => {
        return await ctx.db.insert('impersonationSessions', {
          adminUserId: admin1Id,
          adminEmail: 'admin1@example.com',
          targetUserId: targetId,
          targetEmail: 'user@example.com',
          status: 'active',
          permissions: 'full_access',
          startedAt: Date.now(),
          expiresAt: Date.now() + 3600000,
        });
      });

      // Act: Admin2 tries to end Admin1's session
      await expect(
        t
          .withIdentity({ email: 'admin2@example.com' })
          .mutation(api.admin.impersonation.endImpersonation, {
            sessionId,
          })
      ).rejects.toThrow("Cannot end another admin's session");
    });
  });

  describe('trackImpersonationAction', () => {
    it('should increment action count for session owner', async () => {
      const t = convexTest(schema);

      // Setup
      const adminId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'admin@example.com',
          role: 'super_admin',
          createdAt: Date.now(),
        });
      });

      const targetId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'user@example.com',
          role: 'user',
          createdAt: Date.now(),
        });
      });

      const sessionId = await t.run(async (ctx) => {
        return await ctx.db.insert('impersonationSessions', {
          adminUserId: adminId,
          adminEmail: 'admin@example.com',
          targetUserId: targetId,
          targetEmail: 'user@example.com',
          status: 'active',
          permissions: 'full_access',
          startedAt: Date.now(),
          expiresAt: Date.now() + 3600000,
          actionsCount: 0,
        });
      });

      // Act: Track 3 actions
      await t
        .withIdentity({ email: 'admin@example.com' })
        .mutation(api.admin.impersonation.trackImpersonationAction, { sessionId });
      await t
        .withIdentity({ email: 'admin@example.com' })
        .mutation(api.admin.impersonation.trackImpersonationAction, { sessionId });
      await t
        .withIdentity({ email: 'admin@example.com' })
        .mutation(api.admin.impersonation.trackImpersonationAction, { sessionId });

      // Assert
      const session = await t.run(async (ctx) => {
        return await ctx.db.get(sessionId);
      });
      expect(session?.actionsCount).toBe(3);
    });

    it('should reject tracking from non-session-owner', async () => {
      const t = convexTest(schema);

      // Setup: Session owned by admin1, admin2 tries to track
      const admin1Id = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'admin1@example.com',
          role: 'super_admin',
          createdAt: Date.now(),
        });
      });

      const admin2Id = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'admin2@example.com',
          role: 'super_admin',
          createdAt: Date.now(),
        });
      });

      const targetId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'user@example.com',
          role: 'user',
          createdAt: Date.now(),
        });
      });

      const sessionId = await t.run(async (ctx) => {
        return await ctx.db.insert('impersonationSessions', {
          adminUserId: admin1Id,
          adminEmail: 'admin1@example.com',
          targetUserId: targetId,
          targetEmail: 'user@example.com',
          status: 'active',
          permissions: 'full_access',
          startedAt: Date.now(),
          expiresAt: Date.now() + 3600000,
          actionsCount: 0,
        });
      });

      // Act & Assert: Admin2 cannot track on Admin1's session
      await expect(
        t
          .withIdentity({ email: 'admin2@example.com' })
          .mutation(api.admin.impersonation.trackImpersonationAction, { sessionId })
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('cleanupExpiredSessions', () => {
    it('should mark expired sessions as expired', async () => {
      const t = convexTest(schema);

      // Setup: Create expired session
      const adminId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'admin@example.com',
          role: 'super_admin',
          createdAt: Date.now(),
        });
      });

      const targetId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'user@example.com',
          role: 'user',
          createdAt: Date.now(),
        });
      });

      const expiredSessionId = await t.run(async (ctx) => {
        return await ctx.db.insert('impersonationSessions', {
          adminUserId: adminId,
          adminEmail: 'admin@example.com',
          targetUserId: targetId,
          targetEmail: 'user@example.com',
          status: 'active',
          permissions: 'full_access',
          startedAt: Date.now() - 7200000, // 2 hours ago
          expiresAt: Date.now() - 3600000, // Expired 1 hour ago
        });
      });

      // Act: Run cleanup
      const result = await t.mutation(internal.admin.impersonation.cleanupExpiredSessions, {});

      // Assert
      expect(result.cleanedCount).toBeGreaterThanOrEqual(1);

      const session = await t.run(async (ctx) => {
        return await ctx.db.get(expiredSessionId);
      });
      expect(session?.status).toBe('expired');
      expect(session?.endReason).toBe('expired');
    });
  });

  describe('getImpersonationHistory', () => {
    it('should return history for super_admin only', async () => {
      const t = convexTest(schema);

      // Setup: Create sessions
      const adminId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'admin@example.com',
          role: 'super_admin',
          createdAt: Date.now(),
        });
      });

      const targetId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'user@example.com',
          role: 'user',
          createdAt: Date.now(),
        });
      });

      await t.run(async (ctx) => {
        await ctx.db.insert('impersonationSessions', {
          adminUserId: adminId,
          adminEmail: 'admin@example.com',
          targetUserId: targetId,
          targetEmail: 'user@example.com',
          status: 'ended',
          permissions: 'full_access',
          startedAt: Date.now() - 3600000,
          expiresAt: Date.now(),
          endedAt: Date.now() - 1800000,
          actionsCount: 5,
        });
      });

      // Act
      const history = await t
        .withIdentity({ email: 'admin@example.com' })
        .query(api.admin.impersonation.getImpersonationHistory, {
          limit: 10,
        });

      // Assert
      expect(history).toHaveLength(1);
      expect(history[0].adminEmail).toBe('admin@example.com');
      expect(history[0].targetEmail).toBe('user@example.com');
      expect(history[0].actionsCount).toBe(5);
    });

    it('should return empty for non-super_admin', async () => {
      const t = convexTest(schema);

      // Setup: Regular user
      await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'user@example.com',
          role: 'user',
          createdAt: Date.now(),
        });
      });

      // Act
      const history = await t.query(api.admin.impersonation.getImpersonationHistory, {});

      // Assert
      expect(history).toEqual([]);
    });
  });
});
