/**
 * Mock Data Factories for M1 Integration Tests
 *
 * Provides factory functions to generate valid mock data for testing
 * the complete M1 flow: User → Project → Keywords → Clusters → Briefs → Calendar
 */

import { Id } from '../../convex/_generated/dataModel';

// Type definitions for mock data
type MockUser = {
  _id: Id<'users'>;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'super_admin';
  onboardingStatus: 'in_progress' | 'completed';
  createdAt: number;
  updatedAt: number;
};

type MockProject = {
  _id: Id<'projects'>;
  userId: Id<'users'>;
  name: string;
  websiteUrl: string;
  projectType: 'own' | 'competitor';
  createdAt: number;
  updatedAt: number;
};

type MockKeyword = {
  _id: Id<'keywords'>;
  projectId: Id<'projects'>;
  keyword: string;
  searchVolume: number;
  difficulty: number;
  intent: 'informational' | 'commercial' | 'transactional';
  priority: 'high' | 'medium' | 'low';
  status: 'suggested' | 'approved' | 'implemented';
  createdAt: number;
};

type MockCluster = {
  _id: Id<'keywordClusters'>;
  projectId: Id<'projects'>;
  clusterName: string;
  keywords: string[];
  intent: string;
  difficulty: number;
  volumeRange: { min: number; max: number };
  impactScore: number;
  topSerpUrls: string[];
  status: 'active' | 'hidden' | 'favorite';
  createdAt: number;
  updatedAt: number;
};

type MockBrief = {
  _id: Id<'briefs'>;
  projectId: Id<'projects'>;
  clusterId?: Id<'keywordClusters'>;
  title: string;
  scheduledDate: number;
  status: 'planned' | 'in_progress' | 'approved' | 'published';
  createdAt: number;
  updatedAt: number;
};

type MockContentCalendar = {
  _id: Id<'contentCalendars'>;
  projectId: Id<'projects'>;
  briefId?: Id<'briefs'>;
  title: string;
  contentType: string;
  status: 'idea' | 'scheduled' | 'in_progress' | 'published';
  publishDate?: number;
  createdAt: number;
  updatedAt: number;
};

// Counter for generating unique IDs
let idCounter = 0;
const generateId = <T extends string>(table: T): Id<T> => {
  idCounter++;
  return `mock_${table}_${idCounter}` as unknown as Id<T>;
};

// Reset counter between test runs
export const resetMockIds = () => {
  idCounter = 0;
};

/**
 * Create a mock user
 */
export const createMockUser = (overrides: Partial<Omit<MockUser, '_id'>> = {}): MockUser => {
  const now = Date.now();
  return {
    _id: generateId('users'),
    email: `test_user_${idCounter}@test.com`,
    name: `Test User ${idCounter}`,
    role: 'user',
    onboardingStatus: 'completed',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

/**
 * Create a mock project linked to a user
 */
export const createMockProject = (
  userId: Id<'users'>,
  overrides: Partial<Omit<MockProject, '_id' | 'userId'>> = {}
): MockProject => {
  const now = Date.now();
  return {
    _id: generateId('projects'),
    userId,
    name: `Test Project ${idCounter}`,
    websiteUrl: `https://test-project-${idCounter}.com`,
    projectType: 'own',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

/**
 * Create a mock keyword linked to a project
 */
export const createMockKeyword = (
  projectId: Id<'projects'>,
  overrides: Partial<Omit<MockKeyword, '_id' | 'projectId'>> = {}
): MockKeyword => {
  const now = Date.now();
  return {
    _id: generateId('keywords'),
    projectId,
    keyword: `test keyword ${idCounter}`,
    searchVolume: Math.floor(Math.random() * 10000) + 100,
    difficulty: Math.floor(Math.random() * 100),
    intent: 'informational',
    priority: 'medium',
    status: 'suggested',
    createdAt: now,
    ...overrides,
  };
};

/**
 * Create multiple mock keywords at once
 */
export const createMockKeywords = (
  projectId: Id<'projects'>,
  count: number,
  overrides: Partial<Omit<MockKeyword, '_id' | 'projectId'>> = {}
): MockKeyword[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockKeyword(projectId, {
      keyword: `test keyword ${i + 1}`,
      ...overrides,
    })
  );
};

/**
 * Create a mock keyword cluster from keywords
 */
export const createMockCluster = (
  projectId: Id<'projects'>,
  keywords: string[],
  overrides: Partial<Omit<MockCluster, '_id' | 'projectId'>> = {}
): MockCluster => {
  const now = Date.now();
  const volumes = keywords.map(() => Math.floor(Math.random() * 5000) + 100);

  return {
    _id: generateId('keywordClusters'),
    projectId,
    clusterName: `Topic Cluster: ${keywords[0] || 'Untitled'}`,
    keywords,
    intent: 'informational',
    difficulty: Math.floor(Math.random() * 100),
    volumeRange: {
      min: Math.min(...volumes),
      max: Math.max(...volumes),
    },
    impactScore: Math.random(),
    topSerpUrls: ['https://example.com/article-1', 'https://example.com/article-2'],
    status: 'active',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

/**
 * Create a mock brief from a cluster
 */
export const createMockBrief = (
  projectId: Id<'projects'>,
  clusterId?: Id<'keywordClusters'>,
  overrides: Partial<Omit<MockBrief, '_id' | 'projectId'>> = {}
): MockBrief => {
  const now = Date.now();
  const scheduledDate = now + 7 * 24 * 60 * 60 * 1000; // 1 week from now

  return {
    _id: generateId('briefs'),
    projectId,
    clusterId,
    title: `Article Brief ${idCounter}`,
    scheduledDate,
    status: 'planned',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

/**
 * Create a mock content calendar entry
 */
export const createMockContentCalendar = (
  projectId: Id<'projects'>,
  briefId?: Id<'briefs'>,
  overrides: Partial<Omit<MockContentCalendar, '_id' | 'projectId'>> = {}
): MockContentCalendar => {
  const now = Date.now();

  return {
    _id: generateId('contentCalendars'),
    projectId,
    briefId,
    title: `Content Calendar Entry ${idCounter}`,
    contentType: 'blog',
    status: 'scheduled',
    publishDate: now + 14 * 24 * 60 * 60 * 1000, // 2 weeks from now
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

/**
 * Create a complete M1 flow mock dataset
 * Returns user, project, keywords, clusters, briefs, and calendar entries
 */
export const createMockM1Flow = (keywordCount = 12, clusterCount = 2) => {
  resetMockIds();

  const user = createMockUser();
  const project = createMockProject(user._id);
  const keywords = createMockKeywords(project._id, keywordCount);

  // Group keywords into clusters
  const keywordsPerCluster = Math.floor(keywords.length / clusterCount);
  const clusters = Array.from({ length: clusterCount }, (_, i) => {
    const clusterKeywords = keywords
      .slice(i * keywordsPerCluster, (i + 1) * keywordsPerCluster)
      .map((k) => k.keyword);
    return createMockCluster(project._id, clusterKeywords);
  });

  // Create briefs from clusters
  const briefs = clusters.map((cluster) =>
    createMockBrief(project._id, cluster._id, {
      title: `Article: ${cluster.clusterName}`,
    })
  );

  // Create calendar entries from briefs
  const calendarEntries = briefs.map((brief) =>
    createMockContentCalendar(project._id, brief._id, {
      title: brief.title,
    })
  );

  return {
    user,
    project,
    keywords,
    clusters,
    briefs,
    calendarEntries,
  };
};
