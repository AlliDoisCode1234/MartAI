/**
 * Test Helpers for Convex Integration Tests
 *
 * Provides utilities for:
 * - Setting up authenticated test contexts
 * - Seeding databases with test data
 * - Mocking external services
 * - Common assertions
 */

import { convexTest } from 'convex-test';
import schema from '../../convex/schema';
import { modules } from '../../convex/test.setup';
import { Id } from '../../convex/_generated/dataModel';

// Re-export convexTest configured with our schema AND modules
export const createTestContext = () => convexTest(schema, modules);

/**
 * Seed a user in the test database
 */
export async function seedUser(
  t: ReturnType<typeof convexTest>,
  overrides: Partial<{
    email: string;
    name: string;
    role: 'super_admin' | 'admin' | 'user' | 'viewer';
    onboardingStatus: 'in_progress' | 'completed';
  }> = {}
): Promise<Id<'users'>> {
  return await t.run(async (ctx) => {
    const userId = await ctx.db.insert('users', {
      email: overrides.email ?? `test_${Date.now()}@test.com`,
      name: overrides.name ?? 'Test User',
      role: (overrides.role === 'admin' || overrides.role === 'super_admin') ? 'user' : (overrides.role ?? 'user'),
      membershipTier: 'starter',
      onboardingStatus: overrides.onboardingStatus ?? 'completed',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    if (overrides.role === 'admin' || overrides.role === 'super_admin') {
      await ctx.db.insert('internalAdmins', {
        userId,
        role: overrides.role,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return userId;
  });
}

/**
 * Seed a project in the test database
 */
export async function seedProject(
  t: ReturnType<typeof convexTest>,
  userId: Id<'users'>,
  overrides: Partial<{
    name: string;
    websiteUrl: string;
    projectType: 'own' | 'competitor';
    industry: string;
  }> = {}
): Promise<Id<'projects'>> {
  return await t.run(async (ctx) => {
    return await ctx.db.insert('projects', {
      userId,
      name: overrides.name ?? 'Test Project',
      websiteUrl: overrides.websiteUrl ?? 'https://test-project.com',
      projectType: overrides.projectType ?? 'own',
      industry: overrides.industry,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  });
}

/**
 * Seed keywords in the test database
 */
export async function seedKeywords(
  t: ReturnType<typeof convexTest>,
  projectId: Id<'projects'>,
  keywords: Array<{
    keyword: string;
    searchVolume?: number;
    difficulty?: number;
    intent?: string;
    priority?: string;
    status?: string;
  }>
): Promise<Id<'keywords'>[]> {
  const ids: Id<'keywords'>[] = [];
  for (const kw of keywords) {
    const id = await t.run(async (ctx) => {
      return await ctx.db.insert('keywords', {
        projectId,
        keyword: kw.keyword,
        searchVolume: kw.searchVolume ?? Math.floor(Math.random() * 5000) + 100,
        difficulty: kw.difficulty ?? Math.floor(Math.random() * 100),
        intent: kw.intent ?? 'informational',
        priority: kw.priority ?? 'medium',
        status: kw.status ?? 'suggested',
        createdAt: Date.now(),
      });
    });
    ids.push(id);
  }
  return ids;
}

/**
 * Seed a cluster in the test database
 */
export async function seedCluster(
  t: ReturnType<typeof convexTest>,
  projectId: Id<'projects'>,
  overrides: Partial<{
    clusterName: string;
    keywords: string[];
    intent: string;
    difficulty: number;
    volumeRange: { min: number; max: number };
    impactScore: number;
    status: string;
  }> = {}
): Promise<Id<'keywordClusters'>> {
  return await t.run(async (ctx) => {
    return await ctx.db.insert('keywordClusters', {
      projectId,
      clusterName: overrides.clusterName ?? 'Test Cluster',
      keywords: overrides.keywords ?? ['test keyword 1', 'test keyword 2'],
      intent: overrides.intent ?? 'informational',
      difficulty: overrides.difficulty ?? 45,
      volumeRange: overrides.volumeRange ?? { min: 100, max: 5000 },
      impactScore: overrides.impactScore ?? 0.75,
      topSerpUrls: ['https://example.com/1', 'https://example.com/2'],
      status: overrides.status ?? 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  });
}

/**
 * Seed a brief in the test database
 */
export async function seedBrief(
  t: ReturnType<typeof convexTest>,
  projectId: Id<'projects'>,
  overrides: Partial<{
    clusterId: Id<'keywordClusters'>;
    title: string;
    scheduledDate: number;
    status: string;
  }> = {}
): Promise<Id<'contentPieces'>> {
  return await t.run(async (ctx) => {
    return await ctx.db.insert('contentPieces', {
      projectId,
      clusterId: overrides.clusterId,
      title: overrides.title ?? 'Test Brief',
      contentType: 'blog',
      stage: 'idea',
      scheduledDate: overrides.scheduledDate ?? Date.now() + 7 * 24 * 60 * 60 * 1000,
      status: overrides.status ?? 'planned',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  });
}

/**
 * Generate test keyword data
 */
export function generateKeywordData(count: number): Array<{
  keyword: string;
  searchVolume: number;
  difficulty: number;
  intent: string;
}> {
  return Array.from({ length: count }, (_, i) => ({
    keyword: `test keyword ${i + 1}`,
    searchVolume: Math.floor(Math.random() * 5000) + 100,
    difficulty: Math.floor(Math.random() * 100),
    intent: ['informational', 'commercial', 'transactional'][i % 3],
  }));
}

/**
 * Assert that a mutation throws with expected error
 */
export async function expectMutationToThrow(
  fn: () => Promise<unknown>,
  expectedError: string | RegExp
): Promise<void> {
  try {
    await fn();
    throw new Error('Expected mutation to throw, but it succeeded');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (typeof expectedError === 'string') {
      if (!message.includes(expectedError)) {
        throw new Error(`Expected error to contain "${expectedError}", got "${message}"`);
      }
    } else {
      if (!expectedError.test(message)) {
        throw new Error(`Expected error to match ${expectedError}, got "${message}"`);
      }
    }
  }
}


/**
 * Seed an organization with owner as team member
 */
export async function seedOrganization(
  t: ReturnType<typeof convexTest>,
  ownerId: Id<'users'>,
  overrides: Partial<{
    name: string;
    slug: string;
    plan: string;
    maxMembers: number;
    membershipTier: string;
  }> = {}
): Promise<Id<'organizations'>> {
  return await t.run(async (ctx) => {
    const now = Date.now();

    // Optionally set owner's membership tier for seat limit calculations
    if (overrides.membershipTier) {
      await ctx.db.patch(ownerId, { membershipTier: overrides.membershipTier });
    }

    const orgId = await ctx.db.insert('organizations', {
      name: overrides.name ?? 'Test Organization',
      slug: overrides.slug ?? `test-org-${now}`,
      ownerId,
      plan: overrides.plan ?? 'starter',
      maxMembers: overrides.maxMembers ?? 5,
      createdAt: now,
      updatedAt: now,
    });

    // Add owner as team member
    await ctx.db.insert('teamMembers', {
      userId: ownerId,
      organizationId: orgId,
      role: 'owner',
      status: 'active',
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // Set user's organizationId
    await ctx.db.patch(ownerId, { organizationId: orgId });

    return orgId;
  });
}

/**
 * Seed a team member in an organization
 */
export async function seedTeamMember(
  t: ReturnType<typeof convexTest>,
  userId: Id<'users'>,
  organizationId: Id<'organizations'>,
  role: 'admin' | 'editor' | 'viewer'
): Promise<Id<'teamMembers'>> {
  return await t.run(async (ctx) => {
    const now = Date.now();

    const memberId = await ctx.db.insert('teamMembers', {
      userId,
      organizationId,
      role,
      status: 'active',
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(userId, { organizationId });

    return memberId;
  });
}

/**
 * Common test data for edge cases
 */
export const EDGE_CASES = {
  emptyString: '',
  veryLongString: 'a'.repeat(10000),
  unicodeString: '关键词 キーワード مفتاح',
  specialChars: '!@#$%^&*()[]{}|;:,.<>?',
  sqlInjection: "'; DROP TABLE users; --",
  xssAttempt: '<script>alert("xss")</script>',
  zeroNumber: 0,
  negativeNumber: -1,
  maxNumber: Number.MAX_SAFE_INTEGER,
  infinityNumber: Infinity,
  nanNumber: NaN,
  nullValue: null,
  undefinedValue: undefined,
  emptyArray: [],
  largeArray: Array.from({ length: 1000 }, (_, i) => `item_${i}`),
};

