/**
 * CMS Capability Integration Tests
 *
 * Tests for Wave 4 CMS capability flags:
 * - Publish button visibility based on CMS connection status
 * - Content type → platform compatibility mapping
 *
 * @see cms_capability_flags_ldd.md
 */

import { convexTest } from 'convex-test';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { api } from '../_generated/api';
import schema from '../schema';
import type { Id } from '../_generated/dataModel';

describe('CMS Capability Flags', () => {
  let t: ReturnType<typeof convexTest>;
  let testProjectId: Id<'projects'>;
  let testUserId: Id<'users'>;

  beforeEach(async () => {
    t = convexTest(schema);

    // Create a test user first (required for projects)
    testUserId = await t.run(async (ctx) => {
      return await ctx.db.insert('users', {
        name: 'Test User',
        email: 'test@example.com',
      });
    });

    // Create a test project (requires userId)
    testProjectId = await t.run(async (ctx) => {
      return await ctx.db.insert('projects', {
        userId: testUserId,
        name: 'Test CMS Project',
        websiteUrl: 'https://test.com',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });
  });

  afterEach(async () => {
    // Clean up
    await t.run(async (ctx) => {
      const connections = await ctx.db.query('platformConnections').collect();
      for (const conn of connections) {
        await ctx.db.delete(conn._id);
      }
      const projects = await ctx.db.query('projects').collect();
      for (const project of projects) {
        await ctx.db.delete(project._id);
      }
      const users = await ctx.db.query('users').collect();
      for (const user of users) {
        await ctx.db.delete(user._id);
      }
    });
  });

  describe('listConnections Query', () => {
    it('should return empty array when no CMS is connected', async () => {
      const connections = await t.query(api.integrations.platformConnections.listConnections, {
        projectId: testProjectId,
      });

      expect(connections).toEqual([]);
    });

    it('should return connections when CMS is connected', async () => {
      // Add a WordPress connection
      await t.run(async (ctx) => {
        await ctx.db.insert('platformConnections', {
          projectId: testProjectId,
          platform: 'wordpress',
          siteUrl: 'https://test.wordpress.com',
          siteName: 'Test WordPress',
          credentials: {
            username: 'test',
            applicationPassword: 'test-password',
          },
          isValid: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      const connections = await t.query(api.integrations.platformConnections.listConnections, {
        projectId: testProjectId,
      });

      expect(connections.length).toBe(1);
      expect(connections[0].platform).toBe('wordpress');
    });

    it('should return multiple connections when multiple CMS platforms are connected', async () => {
      // Add WordPress and Shopify connections
      await t.run(async (ctx) => {
        await ctx.db.insert('platformConnections', {
          projectId: testProjectId,
          platform: 'wordpress',
          siteUrl: 'https://test.wordpress.com',
          siteName: 'Test WordPress',
          credentials: { username: 'test', applicationPassword: 'test-password' },
          isValid: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        await ctx.db.insert('platformConnections', {
          projectId: testProjectId,
          platform: 'shopify',
          siteUrl: 'https://test.myshopify.com',
          siteName: 'Test Shopify',
          credentials: { accessToken: 'test-token' },
          isValid: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      const connections = await t.query(api.integrations.platformConnections.listConnections, {
        projectId: testProjectId,
      });

      expect(connections.length).toBe(2);
      const platforms = connections.map((c: { platform: string }) => c.platform).sort();
      expect(platforms).toEqual(['shopify', 'wordpress']);
    });
  });

  describe('Publishing Capability Logic', () => {
    it('hasCmsConnection should be false when no connections exist', async () => {
      const connections = await t.query(api.integrations.platformConnections.listConnections, {
        projectId: testProjectId,
      });

      // This mirrors the logic in [contentId]/page.tsx
      const hasCmsConnection = connections && connections.length > 0;
      expect(hasCmsConnection).toBe(false);
    });

    it('hasCmsConnection should be true when at least one connection exists', async () => {
      // Add a connection
      await t.run(async (ctx) => {
        await ctx.db.insert('platformConnections', {
          projectId: testProjectId,
          platform: 'wordpress',
          siteUrl: 'https://test.wordpress.com',
          credentials: { username: 'test', applicationPassword: 'test' },
          isValid: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      const connections = await t.query(api.integrations.platformConnections.listConnections, {
        projectId: testProjectId,
      });

      const hasCmsConnection = connections && connections.length > 0;
      expect(hasCmsConnection).toBe(true);
    });

    it('should distinguish between valid and invalid connections', async () => {
      // Add an invalid connection
      await t.run(async (ctx) => {
        await ctx.db.insert('platformConnections', {
          projectId: testProjectId,
          platform: 'wordpress',
          siteUrl: 'https://test.wordpress.com',
          credentials: { username: 'test', applicationPassword: 'test' },
          isValid: false,
          validationError: 'Invalid credentials',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      const connections = await t.query(api.integrations.platformConnections.listConnections, {
        projectId: testProjectId,
      });

      expect(connections.length).toBe(1);
      expect(connections[0].isValid).toBe(false);
      // Note: UI should probably also check isValid, not just existence
      // For now, we're matching the current implementation
    });
  });
});
