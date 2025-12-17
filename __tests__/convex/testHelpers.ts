/**
 * Test Helpers for Convex Integration Tests
 *
 * Provides utilities for:
 * - Setting up authenticated test contexts
 * - Seeding databases with test data
 * - Mocking external services
 * - Common assertions
 */

import { convexTest, type ConvexTestingHelper } from 'convex-test';
import schema from '../../convex/schema';
import { modules } from '../../convex/test.setup';
import { Id } from '../../convex/_generated/dataModel';

// Re-export convexTest configured with our schema AND modules
export const createTestContext = () => convexTest(schema, modules);

/**
 * Seed a user in the test database
 */
export async function seedUser(
  t: ConvexTestingHelper<typeof schema>,
  overrides: Partial<{
    email: string;
    name: string;
    role: 'super_admin' | 'admin' | 'user' | 'viewer';
    onboardingStatus: 'in_progress' | 'completed';
  }> = {}
): Promise<Id<'users'>> {
  return await t.run(async (ctx) => {
    return await ctx.db.insert('users', {
      email: overrides.email ?? `test_${Date.now()}@test.com`,
      name: overrides.name ?? 'Test User',
      role: overrides.role ?? 'user',
      onboardingStatus: overrides.onboardingStatus ?? 'completed',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  });
}

/**
 * Seed a project in the test database
 */
export async function seedProject(
  t: ConvexTestingHelper<typeof schema>,
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
  t: ConvexTestingHelper<typeof schema>,
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
  t: ConvexTestingHelper<typeof schema>,
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
  t: ConvexTestingHelper<typeof schema>,
  projectId: Id<'projects'>,
  overrides: Partial<{
    clusterId: Id<'keywordClusters'>;
    title: string;
    scheduledDate: number;
    status: string;
  }> = {}
): Promise<Id<'briefs'>> {
  return await t.run(async (ctx) => {
    return await ctx.db.insert('briefs', {
      projectId,
      clusterId: overrides.clusterId,
      title: overrides.title ?? 'Test Brief',
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
