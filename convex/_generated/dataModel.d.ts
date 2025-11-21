/* eslint-disable */
/**
 * Generated data model.
 * Run `npx convex dev` to regenerate this file with proper types.
 */

import type { GenericId } from "convex/values";

export type Id<T extends string> = GenericId<T>;
export type TableNames = "clients" | "keywords" | "oauthTokens" | "generatedPages" | "rankings" | "seoAudits" | "seoStatistics";

export type DataModel = {
  clients: {
    _id: Id<"clients">;
    _creationTime: number;
    companyName: string;
    website: string;
    industry: string;
    targetAudience: string;
    monthlyRevenueGoal?: string;
    userId: string;
    createdAt: number;
    updatedAt: number;
  };
  keywords: {
    _id: Id<"keywords">;
    _creationTime: number;
    clientId: Id<"clients">;
    keyword: string;
    searchVolume?: number;
    difficulty?: number;
    cpc?: number;
    intent?: string;
    priority?: string;
    status: string;
    createdAt: number;
  };
  oauthTokens: {
    _id: Id<"oauthTokens">;
    _creationTime: number;
    clientId: Id<"clients">;
    platform: string;
    accessToken: string;
    refreshToken?: string;
    tokenExpiry?: number;
    siteUrl: string;
    shopifyShop?: string;
    wordpressSiteId?: string;
    createdAt: number;
    updatedAt: number;
  };
  generatedPages: {
    _id: Id<"generatedPages">;
    _creationTime: number;
    clientId: Id<"clients">;
    platform: string;
    pageId: string;
    pageUrl: string;
    title: string;
    content: string;
    keywords: string[];
    status: string;
    createdAt: number;
    updatedAt: number;
  };
  rankings: {
    _id: Id<"rankings">;
    _creationTime: number;
    clientId: Id<"clients">;
    keyword: string;
    position: number;
    url: string;
    searchEngine: string;
    location?: string;
    date: number;
  };
  seoAudits: {
    _id: Id<"seoAudits">;
    _creationTime: number;
    clientId: Id<"clients">;
    website: string;
    overallScore: number;
    technicalSeo: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
    onPageSeo: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
    contentQuality: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
    backlinks: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
    priorityActions: string[];
    pageSpeed?: number;
    mobileFriendly?: boolean;
    sslEnabled?: boolean;
    indexedPages?: number;
    crawlErrors?: number;
    createdAt: number;
  };
  seoStatistics: {
    _id: Id<"seoStatistics">;
    _creationTime: number;
    clientId: Id<"clients">;
    organicTraffic?: number;
    organicKeywords?: number;
    backlinks?: number;
    referringDomains?: number;
    avgPosition?: number;
    clickThroughRate?: number;
    impressions?: number;
    periodStart: number;
    periodEnd: number;
    createdAt: number;
  };
};
