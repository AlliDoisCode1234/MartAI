/**
 * Seed a full demo admin account with project, clusters, plan, analytics, and insights.
 * Run with: npx tsx scripts/seedDemoAccount.ts
 */

import { ConvexHttpClient } from "convex/browser";
import bcrypt from "bcryptjs";
import { api } from "../convex/_generated/api";
import { generateDemoData } from "../lib/demoData";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;

if (!CONVEX_URL) {
  console.error("ERROR: CONVEX_URL environment variable not set");
  console.error("Please set NEXT_PUBLIC_CONVEX_URL or CONVEX_URL before running this script.");
  process.exit(1);
}

const DEMO_EMAIL = process.env.DEMO_ADMIN_EMAIL || "demo+admin@martai.com";
const DEMO_PASSWORD = process.env.DEMO_ADMIN_PASSWORD || "demo1234";
const DEMO_NAME = process.env.DEMO_ADMIN_NAME || "Demo Admin";
const DEMO_URL = process.env.DEMO_URL || "https://demo.martai.com";
const DEMO_COMPANY = process.env.DEMO_COMPANY || "MartAI Demo Workspace";
const DEMO_INDUSTRY = process.env.DEMO_INDUSTRY || "AI Marketing";
const DEMO_AUDIENCE = process.env.DEMO_AUDIENCE || "growth teams";

async function main() {
  const client = new ConvexHttpClient(CONVEX_URL);
  const demo = generateDemoData({
    url: DEMO_URL,
    companyName: DEMO_COMPANY,
    industry: DEMO_INDUSTRY,
    targetAudience: DEMO_AUDIENCE,
  });

  const userId = await ensureAdminUser(client);
  const projectId = await ensureProject(client, userId, demo);
  await seedKeywordClusters(client, projectId, demo);
  await seedQuarterlyPlan(client, projectId);
  await seedAnalytics(client, projectId, demo);
  await seedInsights(client, projectId);

  console.log("\n✅ Demo admin account ready!");
  console.log(`Email:    ${DEMO_EMAIL}`);
  console.log(`Password: ${DEMO_PASSWORD}`);
  console.log(`Project:  ${demo.site.companyName} (${demo.site.url})`);
}

async function ensureAdminUser(client: ConvexHttpClient) {
  console.log("\n➡️  Ensuring demo admin user exists...");
  const existing = await client.query(api.auth.users.getUserSnapshotByEmail, {
    email: DEMO_EMAIL,
  });

  if (existing?._id) {
    console.log("   - Demo admin user already exists.");
    return existing._id;
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const userId = await client.mutation(api.auth.users.createUser, {
    email: DEMO_EMAIL,
    name: DEMO_NAME,
    passwordHash,
    role: "admin",
  });

  console.log("   - Created new demo admin user.");
  return userId;
}

async function ensureProject(client: ConvexHttpClient, userId: any, demo: ReturnType<typeof generateDemoData>) {
  console.log("\n➡️  Ensuring demo project exists...");
  const existingProjects = await client.query(api.projects.projects.getProjectsByUser, {
    userId,
  });

  const existing = existingProjects.find((p: any) => p.websiteUrl === demo.site.url);
  if (existing?._id) {
    console.log("   - Demo project already exists.");
    return existing._id;
  }

  const projectId = await client.mutation(api.projects.projects.createProject, {
    userId,
    name: demo.site.companyName,
    websiteUrl: demo.site.url,
    industry: demo.site.industry,
  });

  console.log("   - Created new demo project.");
  return projectId;
}

async function seedKeywordClusters(client: ConvexHttpClient, projectId: any, demo: ReturnType<typeof generateDemoData>) {
  console.log("\n➡️  Seeding keyword clusters...");
  const existing = await client.query(api.seo.keywordClusters.getClustersByProject, {
    projectId,
  });

  if (existing.length > 0) {
    console.log("   - Keyword clusters already present.");
    return;
  }

  for (const [index, cluster] of demo.keywordClusters.entries()) {
    await client.mutation(api.seo.keywordClusters.createCluster, {
      projectId,
      clusterName: cluster.topic,
      keywords: Array.from(new Set([cluster.primaryKeyword, ...cluster.supportingKeywords])),
      intent: cluster.searchIntent,
      difficulty: cluster.difficulty ?? 50,
      volumeRange: {
        min: 200 + index * 50,
        max: 1500 + index * 100,
      },
      impactScore: Math.min(1, 0.65 + index * 0.08),
      topSerpUrls: [
        `https://${demo.site.host}/blog/${slugify(cluster.topic)}`,
        `https://example.com/${slugify(cluster.topic)}`,
      ],
      status: "active",
      createdAt: Date.now() - index * 86400000,
    });
  }

  console.log(`   - Inserted ${demo.keywordClusters.length} clusters.`);
}

async function seedQuarterlyPlan(client: ConvexHttpClient, projectId: any) {
  console.log("\n➡️  Ensuring quarterly plan exists...");
  const existingPlan = await client.query(api.content.quarterlyPlans.getPlanByProject, {
    projectId,
  });

  if (existingPlan) {
    console.log("   - Plan and briefs already exist.");
    return;
  }

  await client.mutation(api.content.quarterlyPlans.createQuarterlyPlan, {
    projectId,
    contentVelocity: 2,
    startDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
    goals: {
      traffic: 4000,
      leads: 150,
      revenue: 25000,
    },
    assumptions: "Targets assume consistent publishing cadence and active distribution.",
  });

  console.log("   - Created quarterly plan with auto-generated briefs.");
}

async function seedAnalytics(client: ConvexHttpClient, projectId: any, demo: ReturnType<typeof generateDemoData>) {
  console.log("\n➡️  Seeding analytics data...");
  const existing = await client.query(api.analytics.analytics.getAnalyticsData, {
    projectId,
    startDate: Date.now() - 120 * 24 * 60 * 60 * 1000,
    endDate: Date.now(),
  });

  if (existing.length > 0) {
    console.log("   - Analytics data already present.");
    return;
  }

  const now = new Date();
  demo.analytics.trafficTrend.forEach(async (point, idx) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (demo.analytics.trafficTrend.length - idx - 1), 15).getTime();
    const sessions = point.visits;
    const leads = Math.round(sessions * demo.analytics.conversionRate);

    await client.mutation(api.analytics.analytics.storeAnalyticsData, {
      projectId,
      date,
      source: "ga4",
      sessions,
      leads,
      revenue: leads * 250,
    });

    await client.mutation(api.analytics.analytics.storeAnalyticsData, {
      projectId,
      date,
      source: "gsc",
      clicks: Math.round(sessions * 0.4),
      impressions: sessions * 20,
      ctr: 3.5,
      avgPosition: 14 - idx,
    });
  });

  console.log("   - Inserted synthetic GA4 + GSC metrics.");
}

async function seedInsights(client: ConvexHttpClient, projectId: any, demo: ReturnType<typeof generateDemoData>) {
  console.log("\n➡️  Seeding insights...");
  const existing = await client.query(api.analytics.analytics.getInsights, {
    projectId,
  });

  if (existing.length > 0) {
    console.log("   - Insights already present.");
    return;
  }

  const insights = [
    {
      type: "quick_win",
      title: "Repurpose high-performing guide into a webinar",
      description: "The Automation Playbook post drove +22% MoM visits. Convert it into a webinar funnel for mid-funnel leads.",
      action: "Create webinar landing page + nurture sequence",
    },
    {
      type: "top_gainer",
      title: "Pricing page CTR up 14%",
      description: "Recent copy tweak lifted CTR. Double down with testimonial carousel + in-line ROI calculator.",
      action: "Add calculator widget + social proof module",
    },
    {
      type: "underperformer",
      title: "Case study hub needs refresh",
      description: "Low dwell time suggests content skimmable but shallow. Add quantified outcomes and executive summaries.",
      action: "Record 2 customer interviews + update hub",
    },
  ];

  for (const insight of insights) {
    await client.mutation(api.analytics.analytics.storeInsight, {
      projectId,
      type: insight.type,
      title: insight.title,
      description: insight.description,
      action: insight.action,
      metadata: { severity: "medium" },
    });
  }

  console.log("   - Inserted demo insights.");
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

main().catch((error) => {
  console.error("❌ Demo seeding failed:", error);
  process.exit(1);
});


