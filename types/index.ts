/**
 * Centralized TypeScript types for MartAI
 * Product-wide type definitions to maintain type safety and inference
 *
 * This file should be the single source of truth for all domain types.
 * Import from here instead of defining types inline or using 'as any'.
 */

// ============================================================================
// Convex ID Types
// ============================================================================

// Import Convex generated types
// Use try-catch pattern to handle when Convex not initialized
let ConvexIdType: any;
try {
  ConvexIdType = require('../convex/_generated/dataModel').Id;
} catch {
  // Fallback when Convex not generated
  ConvexIdType = <T extends string>(value: string): string & { __brand: T } => value as any;
}

// Import Convex Id type properly
// Handle case where Convex types not generated yet
type ConvexIdModule = typeof import('../convex/_generated/dataModel');

// Use actual Convex Id type if available, otherwise branded string
export type Id<T extends string> = ConvexIdModule extends { Id: infer U }
  ? U extends (arg: any) => infer R
    ? R
    : string & { __brand: T }
  : string & { __brand: T };

// Id type defined above to handle Convex not being initialized
// Don't re-export to avoid conflicts

// Specific ID types for each table
export type ClientId = Id<'clients'>;
export type ProjectId = Id<'projects'>;
export type UserId = Id<'users'>;
export type SessionId = Id<'sessions'>;
export type KeywordId = Id<'keywords'>;
export type ClusterId = Id<'keywordClusters'>;
export type PlanId = Id<'quarterlyPlans'>;
export type BriefId = Id<'briefs'>;
export type BriefVersionId = Id<'briefVersions'>;
export type DraftId = Id<'drafts'>;
export type ScheduledPostId = Id<'scheduledPosts'>;
export type GA4ConnectionId = Id<'ga4Connections'>;
export type GSCConnectionId = Id<'gscConnections'>;
export type OAuthTokenId = Id<'oauthTokens'>;
export type AnalyticsDataId = Id<'analyticsData'>;
export type InsightId = Id<'insights'>;
export type CompetitorId = Id<'competitors'>;
export type SEOAuditId = Id<'seoAudits'>;
export type RankingId = Id<'rankings'>;
export type StatisticsId = Id<'seoStatistics'>;
export type GeneratedPageId = Id<'generatedPages'>;
export type ProspectId = Id<'prospects'>;
export type ProspectDetailId = Id<'prospectDetails'>;
export type SubmittedUrlId = Id<'submittedUrls'>;
export type AIReportId = Id<'aiReports'>;
export type KeywordIdeaId = Id<'keywordIdeas'>;
export type ContentCalendarId = Id<'contentCalendars'>;
export type SubscriptionId = Id<'subscriptions'>;
export type UsageSnapshotId = Id<'usageLimits'>;

// ============================================================================
// Core Domain Types
// ============================================================================

// User roles
export type UserRole = 'admin' | 'user' | 'viewer';
export type PlanTier = 'starter' | 'growth' | 'scale';

// Public user model (safe for UI and API responses)
interface UserCore {
  _id: UserId;
  name?: string;
  role?: UserRole; // User role: admin, user, viewer (default: user)
  avatarUrl?: string;
  bio?: string;
  preferences?: UserPreferences;
  createdAt: number;
  updatedAt?: number;
}

// Public user model (safe for UI and API responses)
export interface UserSnapshot extends UserCore {
  username: string;
}

// Alias for backwards compatibility
export type User = UserSnapshot;

// Internal user record (includes sensitive fields - server only)
export interface UserRecord extends UserCore {
  email: string;
  passwordHash: string; // Never expose this in API responses
}

// User preferences
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  notifications?: boolean;
  timezone?: string;
}

// Minimal user info for auth context
export interface AuthUser {
  userId: string;
  username: string;
  role?: UserRole;
}

export interface Project {
  _id: ProjectId;
  userId: UserId;
  name: string;
  websiteUrl: string;
  industry?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Client {
  _id: ClientId;
  projectId: ProjectId;
  businessName: string;
  websiteUrl: string;
  industry?: string;
  competitors?: string[];
  goals?: string;
  brandVoice?: string;
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// Prospecting Types
// ============================================================================

export type ProspectStatus = 'draft' | 'initial_submitted' | 'details_submitted';

export interface Prospect {
  _id: ProspectId;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  monthlyRevenue?: string;
  marketingFrustration?: string;
  investedBefore?: string;
  timeline?: string;
  source?: string;
  status: ProspectStatus;
  userId?: UserId;
  createdAt: number;
  updatedAt: number;
}

export interface ProspectDetail {
  _id: ProspectDetailId;
  prospectId: ProspectId;
  businessName?: string;
  topPriority?: string;
  marketingTried?: string;
  goals?: string;
  supportNeeds?: string[];
  idealOutcome?: string;
  additionalNotes?: string;
  hearAbout?: string;
  sendSms?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SubmittedUrl {
  _id: SubmittedUrlId;
  prospectId: ProspectId;
  label: string;
  url: string;
  createdAt: number;
}

export interface AIReport {
  _id: AIReportId;
  prospectId?: ProspectId;
  projectId?: ProjectId;
  url?: string;
  status: 'pending' | 'completed' | 'failed';
  summary?: string;
  metrics?: {
    coverageScore?: number;
    backlinksProxy?: number;
    domainRatingProxy?: number;
    organicKeywords?: number;
    trafficEstimate?: number;
  };
  confidence: {
    score: number;
    sources: string[];
  };
  dataSources?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface KeywordIdea {
  _id: KeywordIdeaId;
  prospectId?: ProspectId;
  projectId?: ProjectId;
  primaryKeyword: string;
  supportingKeywords?: string[];
  intent?: string;
  trafficPotential?: number;
  kdScore?: number;
  cpc?: number;
  entities?: string[];
  serpNotes?: string;
  priority?: string;
  status: 'candidate' | 'shortlisted' | 'scheduled';
  createdAt: number;
  updatedAt: number;
}

export interface ContentCalendarEntry {
  _id: ContentCalendarId;
  prospectId?: ProspectId;
  projectId?: ProjectId;
  title: string;
  contentType: string;
  primaryKeyword?: string;
  supportingKeywords?: string[];
  status: 'idea' | 'scheduled' | 'published';
  publishDate?: number;
  notes?: string;
  heroOffer?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SubscriptionFeatures {
  maxUrls: number;
  maxKeywordIdeas: number;
  maxAiReports: number;
  maxContentPieces: number;
}

export interface Subscription {
  _id: SubscriptionId;
  userId: UserId;
  planTier: PlanTier;
  status: 'active' | 'past_due' | 'cancelled';
  priceMonthly: number;
  features: SubscriptionFeatures;
  oneTimeFeePaid?: boolean;
  startsAt: number;
  renewsAt?: number;
  cancelAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface UsageSnapshot {
  _id: UsageSnapshotId;
  userId: UserId;
  periodStart: number;
  periodEnd: number;
  urlsAnalyzed: number;
  keywordIdeasGenerated: number;
  aiReportsGenerated: number;
  contentPiecesPlanned: number;
  updatedAt: number;
}

// ============================================================================
// SEO Intelligence Types
// ============================================================================

export interface Keyword {
  _id: KeywordId;
  projectId: ProjectId;
  keyword: string;
  intent?: 'informational' | 'commercial' | 'transactional' | 'navigational';
  difficulty?: number;
  volume?: number;
  priority?: number;
  createdAt: number;
}

export interface KeywordCluster {
  _id: ClusterId;
  projectId: ProjectId;
  clusterName: string;
  keywords: string[];
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  difficulty: number;
  volumeRange: { min: number; max: number };
  impactScore: number;
  topSerpUrls: string[];
  status: 'active' | 'hidden' | 'favorite';
  reasoning?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface Competitor {
  _id: CompetitorId;
  projectId: ProjectId;
  domain: string;
  priority?: number; // 1-5
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// Planning Types
// ============================================================================

export interface PlanGoals {
  traffic?: number;
  leads?: number;
  revenue?: number;
}

export interface BriefPlaceholder {
  title: string;
  scheduledDate: number;
  clusterId?: ClusterId;
  week?: number;
}

export interface QuarterlyPlan {
  _id: PlanId;
  projectId: ProjectId;
  contentVelocity: number; // posts per week
  startDate: number;
  endDate: number;
  goals: PlanGoals;
  assumptions?: string;
  briefs: Brief[];
  createdAt?: number;
  updatedAt?: number;
}

export interface Brief {
  _id: BriefId;
  planId?: PlanId;
  projectId: ProjectId;
  title: string;
  h2Outline: string[];
  faqs: Array<{ question: string; answer: string }>;
  metaTitle?: string;
  metaDescription?: string;
  internalLinks?: string[];
  schema?: Record<string, any>;
  scheduledDate: number;
  clusterId?: ClusterId;
  status: 'draft' | 'approved' | 'published' | 'planned' | 'in_progress';
  week?: number;
  createdAt?: number;
  updatedAt?: number;
  // Additional fields from Convex
  titleOptions?: string[];
  schemaSuggestion?: string;
  // Populated by API responses
  cluster?: {
    clusterName: string;
    keywords: string[];
    intent?: string;
  };
  seoCheck?: {
    valid: boolean;
    issues: string[];
    suggestions?: string[];
  };
}

export interface BriefVersion {
  _id: BriefVersionId;
  briefId: BriefId;
  versionNumber: number;
  data: {
    title: string;
    h2Outline: string[];
    faqs: Array<{ question: string; answer: string }>;
    metaTitle?: string;
    metaDescription?: string;
    internalLinks?: string[];
    schema?: Record<string, any>;
  };
  notes?: string;
  createdAt: number;
}

// ============================================================================
// Content Creation Types
// ============================================================================

export interface Draft {
  _id: DraftId;
  briefId: BriefId;
  projectId: ProjectId;
  content: string; // Markdown
  qualityScore?: number;
  toneScore?: number;
  wordCount?: number;
  status: 'draft' | 'approved' | 'published';
  notes?: string;
  createdAt?: number;
  updatedAt?: number;
  // Populated by API responses
  brief?: Brief;
  seoCheck?: {
    valid: boolean;
    checklist?: Array<{ item: string; passed: boolean; note?: string }>;
    issues?: string[];
    strengths?: string[];
  };
  // Additional fields from API
  issues?: string[];
  strengths?: string[];
}

export interface BriefInfo {
  title: string;
  h2Outline: string[];
  faqs: Array<{ question: string; answer: string }>;
  metaTitle?: string;
  metaDescription?: string;
  internalLinks?: string[];
  schema?: Record<string, any>;
}

export interface ClusterInfo {
  clusterName: string;
  keywords: string[];
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  difficulty: number;
  volumeRange: { min: number; max: number };
}

export interface DraftResult {
  content: string;
  qualityScore: number;
  toneScore: number;
  wordCount: number;
}

export interface BriefDetails {
  titleOptions: string[];
  h2Outline: string[];
  faqs: Array<{ question: string; answer: string }>;
  metaTitle: string;
  metaDescription: string;
  internalLinks: string[];
  schema: Record<string, any>;
}

// ============================================================================
// Publishing Types
// ============================================================================

export interface ScheduledPost {
  _id: ScheduledPostId;
  projectId: ProjectId;
  draftId: DraftId;
  platform: 'wordpress' | 'shopify' | 'webflow';
  publishDate: number;
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  cmsUrl?: string;
  slug?: string;
  tags?: string[];
  categories?: string[];
  timezone?: string;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// Connection Types
// ============================================================================

export interface GA4Connection {
  _id: GA4ConnectionId;
  projectId: ProjectId;
  userId: UserId;
  propertyId: string;
  propertyName: string;
  accessToken: string;
  refreshToken?: string;
  lastSync?: number;
  createdAt: number;
  updatedAt: number;
}

export interface GSCConnection {
  _id: GSCConnectionId;
  projectId: ProjectId;
  userId: UserId;
  siteUrl: string;
  accessToken: string;
  refreshToken?: string;
  lastSync?: number;
  createdAt: number;
  updatedAt: number;
}

export interface OAuthToken {
  _id: OAuthTokenId;
  clientId: ClientId;
  platform: 'wordpress' | 'shopify' | 'webflow';
  accessToken: string;
  refreshToken?: string;
  tokenExpiry?: number;
  siteUrl: string;
  shopifyShop?: string;
  wordpressSiteId?: string;
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface AnalyticsData {
  _id: AnalyticsDataId;
  projectId: ProjectId;
  date: number; // timestamp
  source: 'ga4' | 'gsc';
  sessions?: number;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  avgPosition?: number;
  leads?: number;
  revenue?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Insight {
  _id: InsightId;
  projectId: ProjectId;
  type: 'top_gainer' | 'underperformer' | 'quick_win';
  title: string;
  description: string;
  action?: string;
  metadata?: Record<string, any>;
  status: 'active' | 'applied' | 'dismissed';
  createdAt: number;
  updatedAt: number;
}

export interface KPIs {
  sessions: { value: number; change: number; previous: number };
  clicks: { value: number; change: number; previous: number };
  ctr: { value: number; change: number; previous: number };
  avgPosition: { value: number; change: number; previous: number };
  leads: { value: number; change: number; previous: number };
  revenue: { value: number; change: number; previous: number };
  conversionRate: { value: number; change: number; previous: number };
}

/** MartAI Rating Score - computed from analytics data */
export interface MRScoreData {
  overall: number;
  tier: string;
  visibility?: number;
  trafficHealth?: number;
  ctrPerformance?: number;
  engagementQuality?: number;
  quickWinPotential?: number;
  contentVelocity?: number;
  previousScore?: number;
}

/** Strategy data aggregation for dashboard/strategy pages */
export interface StrategyData {
  clusters?: KeywordCluster[];
  plan?: QuarterlyPlan;
  stats?: {
    briefCount?: number;
    keywordCount?: number;
    clusterCount?: number;
  };
}

/** Generic connection shape for GA4/GSC */
export interface ConnectionData {
  _id: string;
  projectId: string;
  connected: boolean;
  lastSync?: number;
  siteUrl?: string; // GSC site URL
  propertyName?: string; // GA4 property name
}

// ============================================================================
// CMS Integration Types
// ============================================================================

export interface WordPressPage {
  id?: number;
  title: string;
  content: string;
  slug?: string;
  status?: 'publish' | 'draft' | 'private';
  excerpt?: string;
  meta?: Record<string, any>;
}

export interface WordPressAuth {
  siteUrl: string;
  username: string;
  password: string; // Application password or OAuth token
}

export interface ShopifyPage {
  title: string;
  body_html: string;
  handle?: string;
  published?: boolean;
  template_suffix?: string;
  metafields?: Array<{
    namespace: string;
    key: string;
    value: string;
    type: string;
  }>;
}

export interface ShopifyAuth {
  shopDomain: string;
  accessToken: string;
  apiVersion?: string;
}

export interface WebflowPage {
  name: string;
  slug: string;
  htmlContent?: string;
  seoTitle?: string;
  seoDescription?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  isDraft?: boolean;
}

export interface WebflowAuth {
  siteId: string;
  accessToken: string;
  collectionId?: string; // CMS collection ID for pages
}

export interface CMSTestResult {
  valid: boolean;
  siteName?: string;
  shopName?: string;
  error?: string;
  canPublish?: boolean;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

// AuthUser is defined above with User types
// UserPayload is for JWT tokens
export interface UserPayload {
  userId: string;
  email: string;
}

export interface Integration {
  platform: string;
  connected: boolean;
  siteUrl?: string;
  propertyName?: string;
  lastSync?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

// Helper to extract ID type from any entity
export type EntityId<T> = T extends { _id: infer Id } ? Id : never;

// Helper for API responses
export interface APIResponse<T = any> {
  success?: boolean;
  error?: string;
  data?: T;
  [key: string]: any;
}

// Helper for paginated responses
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Helper for Convex mutation/query args
export type ConvexArgs<T> = T extends (...args: infer Args) => any
  ? Args extends [infer First, ...infer Rest]
    ? First
    : never
  : never;

// ============================================================================
// Component Props Types (for passing whole objects)
// ============================================================================

// Pass whole objects to maintain type inference
export interface BriefProps {
  brief: Brief;
  onUpdate?: (brief: Brief) => void;
  onDelete?: (briefId: BriefId) => void;
}

export interface ClusterProps {
  cluster: KeywordCluster;
  onUpdate?: (cluster: KeywordCluster) => void;
  onDelete?: (clusterId: ClusterId) => void;
}

export interface DraftProps {
  draft: Draft;
  brief?: Brief;
  onUpdate?: (draft: Draft) => void;
  onApprove?: (draftId: DraftId) => void;
}

export interface PlanProps {
  plan: QuarterlyPlan;
  clusters: KeywordCluster[];
  onUpdate?: (plan: QuarterlyPlan) => void;
  onRescheduleBrief?: (briefId: BriefId, newDate: number) => void;
}

export interface InsightProps {
  insight: Insight;
  onApply?: (insightId: InsightId, action: string) => void;
  onDismiss?: (insightId: InsightId) => void;
}

// ============================================================================
// Lexical Editor Types
// ============================================================================

export interface ToneMetrics {
  activeVoice: number;
  engagement: number;
  clarity: number;
  overall: number;
}

export interface SEOCheck {
  keywordDensity: number;
  hasH1: boolean;
  h2Count: number;
  wordCount: number;
  internalLinks: number;
  isValid: boolean;
  issues: string[];
}

export interface LexicalEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  showToolbar?: boolean;
}

// ============================================================================
// Type Guards
// ============================================================================

// Type guards are in lib/typeGuards.ts
// Import from there for runtime validation

// ID conversion helpers are in lib/typeGuards.ts
// Import from there: assertProjectId, assertBriefId, etc.
