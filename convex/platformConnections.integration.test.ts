import { convexTest } from 'convex-test';
import { expect, test, describe, beforeEach } from 'vitest';
import { api } from './_generated/api';
import { Id } from './_generated/dataModel';
import schema from './schema';

/**
 * Platform Connections Integration Tests
 *
 * Tests CRUD operations for WordPress, Shopify, and Wix connections.
 * Using convex-test for real handler execution.
 */

describe('PlatformConnections CRUD Integration', () => {
  let t: ReturnType<typeof convexTest>;
  let testProjectId: Id<'projects'>;
  let testUserId: Id<'users'>;

  beforeEach(async () => {
    t = convexTest(schema);

    const result = await t.run(async (ctx) => {
      const userId = await ctx.db.insert('users', {
        email: 'test@integrations.com',
        role: 'user',
        onboardingStatus: 'completed',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const projectId = await ctx.db.insert('projects', {
        userId,
        name: 'Integration Test Project',
        websiteUrl: 'https://test-integrations.com',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { userId, projectId };
    });

    testUserId = result.userId;
    testProjectId = result.projectId;
  });

  describe('Save Connection', () => {
    test('should create new WordPress connection', async () => {
      const connectionId = await t.mutation(api.integrations.platformConnections.saveConnection, {
        projectId: testProjectId,
        platform: 'wordpress',
        siteUrl: 'https://blog.example.com',
        siteName: 'Example Blog',
        credentials: {
          username: 'admin',
          applicationPassword: 'xxxx xxxx xxxx',
        },
      });

      expect(connectionId).toBeDefined();

      const connection = await t.query(api.integrations.platformConnections.getConnection, {
        projectId: testProjectId,
        platform: 'wordpress',
      });

      expect(connection).not.toBeNull();
      expect(connection?.siteUrl).toBe('https://blog.example.com');
      expect(connection?.siteName).toBe('Example Blog');
      expect(connection?.platform).toBe('wordpress');
      expect(connection?.isValid).toBe(false); // Not validated yet
    });

    test('should create new Shopify connection', async () => {
      const connectionId = await t.mutation(api.integrations.platformConnections.saveConnection, {
        projectId: testProjectId,
        platform: 'shopify',
        siteUrl: 'https://mystore.myshopify.com',
        siteName: 'My Shopify Store',
        credentials: {
          accessToken: 'shpat_xxxxx',
        },
      });

      expect(connectionId).toBeDefined();

      const connection = await t.query(api.integrations.platformConnections.getConnection, {
        projectId: testProjectId,
        platform: 'shopify',
      });

      expect(connection?.platform).toBe('shopify');
      expect(connection?.credentials.accessToken).toBe('shpat_xxxxx');
    });

    test('should create new Wix connection', async () => {
      const connectionId = await t.mutation(api.integrations.platformConnections.saveConnection, {
        projectId: testProjectId,
        platform: 'wix',
        siteUrl: 'https://user123.wixsite.com/mysite',
        siteName: 'My Wix Site',
        credentials: {
          accessToken: 'wix_access_token',
          refreshToken: 'wix_refresh_token',
        },
      });

      expect(connectionId).toBeDefined();

      const connection = await t.query(api.integrations.platformConnections.getConnection, {
        projectId: testProjectId,
        platform: 'wix',
      });

      expect(connection?.platform).toBe('wix');
      expect(connection?.credentials.refreshToken).toBe('wix_refresh_token');
    });

    test('should update existing connection (upsert behavior)', async () => {
      // Create initial connection
      await t.mutation(api.integrations.platformConnections.saveConnection, {
        projectId: testProjectId,
        platform: 'wordpress',
        siteUrl: 'https://old-url.com',
        siteName: 'Old Name',
        credentials: {
          username: 'olduser',
          applicationPassword: 'old-pass',
        },
      });

      // Update with new values
      await t.mutation(api.integrations.platformConnections.saveConnection, {
        projectId: testProjectId,
        platform: 'wordpress',
        siteUrl: 'https://new-url.com',
        siteName: 'New Name',
        credentials: {
          username: 'newuser',
          applicationPassword: 'new-pass',
        },
      });

      // Should only have one connection
      const connections = await t.query(api.integrations.platformConnections.listConnections, {
        projectId: testProjectId,
      });

      expect(connections.length).toBe(1);
      expect(connections[0].siteUrl).toBe('https://new-url.com');
      expect(connections[0].siteName).toBe('New Name');
    });
  });

  describe('List Connections', () => {
    test('should list all connections for a project', async () => {
      // Create multiple connections
      await t.mutation(api.integrations.platformConnections.saveConnection, {
        projectId: testProjectId,
        platform: 'wordpress',
        siteUrl: 'https://wp.example.com',
        credentials: { username: 'admin', applicationPassword: 'pass' },
      });

      await t.mutation(api.integrations.platformConnections.saveConnection, {
        projectId: testProjectId,
        platform: 'shopify',
        siteUrl: 'https://store.myshopify.com',
        credentials: { accessToken: 'token' },
      });

      await t.mutation(api.integrations.platformConnections.saveConnection, {
        projectId: testProjectId,
        platform: 'wix',
        siteUrl: 'https://wix.example.com',
        credentials: { accessToken: 'wix-token' },
      });

      const connections = await t.query(api.integrations.platformConnections.listConnections, {
        projectId: testProjectId,
      });

      expect(connections.length).toBe(3);

      const platforms = connections.map((c: { platform: string }) => c.platform);
      expect(platforms).toContain('wordpress');
      expect(platforms).toContain('shopify');
      expect(platforms).toContain('wix');
    });

    test('should return empty array for project with no connections', async () => {
      const connections = await t.query(api.integrations.platformConnections.listConnections, {
        projectId: testProjectId,
      });

      expect(connections).toEqual([]);
    });
  });

  describe('Get Connection', () => {
    test('should return null for non-existent connection', async () => {
      const connection = await t.query(api.integrations.platformConnections.getConnection, {
        projectId: testProjectId,
        platform: 'shopify',
      });

      expect(connection).toBeNull();
    });

    test('should get specific platform connection', async () => {
      // Create WordPress and Shopify
      await t.mutation(api.integrations.platformConnections.saveConnection, {
        projectId: testProjectId,
        platform: 'wordpress',
        siteUrl: 'https://wp.example.com',
        credentials: { username: 'wp-admin', applicationPassword: 'pass' },
      });

      await t.mutation(api.integrations.platformConnections.saveConnection, {
        projectId: testProjectId,
        platform: 'shopify',
        siteUrl: 'https://store.myshopify.com',
        credentials: { accessToken: 'shopify-token' },
      });

      // Get only Shopify
      const shopify = await t.query(api.integrations.platformConnections.getConnection, {
        projectId: testProjectId,
        platform: 'shopify',
      });

      expect(shopify?.platform).toBe('shopify');
      expect(shopify?.credentials.accessToken).toBe('shopify-token');
    });
  });

  describe('Delete Connection', () => {
    test('should remove connection', async () => {
      const connectionId = await t.mutation(api.integrations.platformConnections.saveConnection, {
        projectId: testProjectId,
        platform: 'wordpress',
        siteUrl: 'https://to-delete.com',
        credentials: { username: 'admin', applicationPassword: 'pass' },
      });

      // Verify it exists
      let connection = await t.query(api.integrations.platformConnections.getConnection, {
        projectId: testProjectId,
        platform: 'wordpress',
      });
      expect(connection).not.toBeNull();

      // Delete
      await t.mutation(api.integrations.platformConnections.deleteConnection, {
        connectionId,
      });

      // Verify it's gone
      connection = await t.query(api.integrations.platformConnections.getConnection, {
        projectId: testProjectId,
        platform: 'wordpress',
      });
      expect(connection).toBeNull();
    });
  });
});

describe('PlatformConnections Edge Cases', () => {
  let t: ReturnType<typeof convexTest>;
  let testProjectId: Id<'projects'>;

  beforeEach(async () => {
    t = convexTest(schema);

    const result = await t.run(async (ctx) => {
      const userId = await ctx.db.insert('users', {
        email: 'edge@integrations.com',
        role: 'user',
        onboardingStatus: 'completed',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const projectId = await ctx.db.insert('projects', {
        userId,
        name: 'Edge Case Project',
        websiteUrl: 'https://edge-test.com',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { projectId };
    });

    testProjectId = result.projectId;
  });

  test('should handle connection with default settings', async () => {
    await t.mutation(api.integrations.platformConnections.saveConnection, {
      projectId: testProjectId,
      platform: 'wordpress',
      siteUrl: 'https://defaults.example.com',
      credentials: { username: 'admin', applicationPassword: 'pass' },
      defaultPostType: 'post',
      defaultStatus: 'draft',
    });

    const connection = await t.query(api.integrations.platformConnections.getConnection, {
      projectId: testProjectId,
      platform: 'wordpress',
    });

    expect(connection?.defaultPostType).toBe('post');
    expect(connection?.defaultStatus).toBe('draft');
  });

  test('should handle connection with no siteName', async () => {
    await t.mutation(api.integrations.platformConnections.saveConnection, {
      projectId: testProjectId,
      platform: 'shopify',
      siteUrl: 'https://no-name.myshopify.com',
      credentials: { accessToken: 'token' },
    });

    const connection = await t.query(api.integrations.platformConnections.getConnection, {
      projectId: testProjectId,
      platform: 'shopify',
    });

    expect(connection?.siteName).toBeUndefined();
    expect(connection?.siteUrl).toBe('https://no-name.myshopify.com');
  });

  test('should isolate connections between projects', async () => {
    // Create second project
    const project2Id = await t.run(async (ctx) => {
      const userId = await ctx.db.insert('users', {
        email: 'project2@test.com',
        role: 'user',
        onboardingStatus: 'completed',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return ctx.db.insert('projects', {
        userId,
        name: 'Project 2',
        websiteUrl: 'https://project2.com',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    // Add WordPress to project 1
    await t.mutation(api.integrations.platformConnections.saveConnection, {
      projectId: testProjectId,
      platform: 'wordpress',
      siteUrl: 'https://project1-wp.com',
      credentials: { username: 'admin', applicationPassword: 'pass' },
    });

    // Add WordPress to project 2
    await t.mutation(api.integrations.platformConnections.saveConnection, {
      projectId: project2Id,
      platform: 'wordpress',
      siteUrl: 'https://project2-wp.com',
      credentials: { username: 'admin', applicationPassword: 'pass' },
    });

    // Each project should only see its own
    const p1Connections = await t.query(api.integrations.platformConnections.listConnections, {
      projectId: testProjectId,
    });
    const p2Connections = await t.query(api.integrations.platformConnections.listConnections, {
      projectId: project2Id,
    });

    expect(p1Connections.length).toBe(1);
    expect(p1Connections[0].siteUrl).toBe('https://project1-wp.com');

    expect(p2Connections.length).toBe(1);
    expect(p2Connections[0].siteUrl).toBe('https://project2-wp.com');
  });
});
