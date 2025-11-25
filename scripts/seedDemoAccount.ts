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
  const clientId = await ensureClient(client, userId, demo);
  
  await seedKeywordClusters(client, projectId, demo);
  const planId = await seedQuarterlyPlan(client, projectId);
  await seedBriefDetails(client, projectId, planId, demo);
  await seedDrafts(client, projectId, demo);
  await seedScheduledPosts(client, projectId, demo);
  await seedAnalytics(client, projectId, demo);
  await seedInsights(client, projectId, demo);
  await seedIntegrations(client, projectId, demo);
  await seedKeywords(client, clientId, demo);

  console.log("\n✅ Demo admin account fully seeded!");
  console.log(`Email:    ${DEMO_EMAIL}`);
  console.log(`Password: ${DEMO_PASSWORD}`);
  console.log(`Project:  ${demo.site.companyName} (${demo.site.url})`);
  console.log(`\n📊 All pages now have demo data ready!`);
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

  // Generate additional demo clusters for better reveal experience
  const demoClusters = [
    ...demo.keywordClusters,
    // Add more clusters for variety
    {
      topic: `${demo.site.industry} best practices`,
      primaryKeyword: `${demo.site.industry} guide`,
      supportingKeywords: [`${demo.site.industry} tips`, `${demo.site.industry} strategies`, `how to ${demo.site.industry}`],
      searchIntent: 'informational' as const,
      difficulty: 42,
    },
    {
      topic: `${demo.site.industry} tools comparison`,
      primaryKeyword: `best ${demo.site.industry} tools`,
      supportingKeywords: [`${demo.site.industry} software`, `${demo.site.industry} platforms`, `${demo.site.industry} reviews`],
      searchIntent: 'commercial' as const,
      difficulty: 58,
    },
    {
      topic: `${demo.site.industry} case studies`,
      primaryKeyword: `${demo.site.industry} success stories`,
      supportingKeywords: [`${demo.site.industry} examples`, `${demo.site.industry} results`, `${demo.site.industry} ROI`],
      searchIntent: 'commercial' as const,
      difficulty: 48,
    },
  ];

  for (const [index, cluster] of demoClusters.entries()) {
    const keywords = Array.from(new Set([
      cluster.primaryKeyword || cluster.topic,
      ...(cluster.supportingKeywords || [])
    ]));
    
    await client.mutation(api.seo.keywordClusters.createCluster, {
      projectId,
      clusterName: cluster.topic || `${demo.site.industry} opportunity ${index + 1}`,
      keywords: keywords.length > 0 ? keywords : [`${demo.site.industry} ${index + 1}`],
      intent: cluster.searchIntent || 'commercial',
      difficulty: cluster.difficulty ?? 50,
      volumeRange: {
        min: 200 + index * 50,
        max: 1500 + index * 100,
      },
      impactScore: Math.min(0.95, 0.65 + index * 0.05),
      topSerpUrls: [
        `https://${demo.site.host}/blog/${slugify(cluster.topic || `topic-${index}`)}`,
        `https://example.com/${slugify(cluster.topic || `topic-${index}`)}`,
      ],
      status: "active",
      createdAt: Date.now() - index * 86400000,
    });
  }

  console.log(`   - Inserted ${demoClusters.length} clusters.`);
}

async function ensureClient(client: ConvexHttpClient, userId: any, demo: ReturnType<typeof generateDemoData>) {
  console.log("\n➡️  Ensuring client exists...");
  const existingClients = await client.query(api.projects.clients.getClientsByUser, {
    userId: userId.toString(),
  });

  const existing = existingClients?.find((c: any) => c.website === demo.site.url);
  if (existing?._id) {
    console.log("   - Client already exists.");
    return existing._id;
  }

  const clientId = await client.mutation(api.projects.clients.createClient, {
    userId: userId.toString(),
    companyName: demo.site.companyName,
    website: demo.site.url,
    industry: demo.site.industry,
    targetAudience: DEMO_AUDIENCE,
  });

  console.log("   - Created client.");
  return clientId;
}

async function seedQuarterlyPlan(client: ConvexHttpClient, projectId: any) {
  console.log("\n➡️  Ensuring quarterly plan exists...");
  const existingPlan = await client.query(api.content.quarterlyPlans.getPlanByProject, {
    projectId,
  });

  if (existingPlan) {
    console.log("   - Plan and briefs already exist.");
    return existingPlan._id;
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

  // Get plan ID to return
  const plan = await client.query(api.content.quarterlyPlans.getPlanByProject, {
    projectId,
  });

  console.log("   - Created quarterly plan with auto-generated briefs.");
  return plan?._id;
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

async function seedInsights(client: ConvexHttpClient, projectId: any) {
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

async function seedBriefDetails(client: ConvexHttpClient, projectId: any, planId: any, demo: ReturnType<typeof generateDemoData>) {
  console.log("\n➡️  Seeding brief details...");
  
  if (!planId) {
    console.log("   - No plan found, skipping brief details.");
    return;
  }

  const plan = await client.query(api.content.quarterlyPlans.getPlanByProject, {
    projectId,
  });

  if (!plan || !plan.briefs || plan.briefs.length === 0) {
    console.log("   - No briefs found, skipping.");
    return;
  }

  // Get clusters for context
  const clusters = await client.query(api.seo.keywordClusters.getClustersByProject, {
    projectId,
  });

  let updatedCount = 0;
  for (const brief of plan.briefs.slice(0, 8)) { // Seed details for first 8 briefs
    if (brief.titleOptions && brief.titleOptions.length > 0) {
      continue; // Already has details
    }

    // Find cluster for this brief
    const cluster = brief.clusterId 
      ? clusters.find((c: any) => c._id === brief.clusterId)
      : clusters[updatedCount % clusters.length];

    if (!cluster) continue;

    // Generate mock brief details
    const briefDetails = generateMockBriefDetails(cluster, demo);

    await client.mutation(api.content.briefs.updateBrief, {
      briefId: brief._id,
      ...briefDetails,
      status: updatedCount < 3 ? "in_progress" : "planned", // First 3 in progress
    });

    updatedCount++;
  }

  console.log(`   - Updated ${updatedCount} briefs with details.`);
}

function generateMockBriefDetails(cluster: any, demo: ReturnType<typeof generateDemoData>) {
  const baseTitle = cluster.clusterName || cluster.topic || "SEO Guide";
  const intent = cluster.intent || "informational";
  
  const titleOptions = [
    `The Ultimate Guide to ${baseTitle}`,
    `How to Master ${baseTitle} in 2024`,
    `${baseTitle}: Complete Guide for Beginners`,
    `${baseTitle} Best Practices and Strategies`,
  ];

  const h2Outline = [
    `What is ${baseTitle}?`,
    `Why ${baseTitle} Matters`,
    `Key Benefits of ${baseTitle}`,
    `How to Get Started with ${baseTitle}`,
    `Advanced ${baseTitle} Strategies`,
    `Common Mistakes to Avoid`,
    `Tools and Resources`,
    `Conclusion: Next Steps`,
  ];

  const faqs = [
    {
      question: `What is ${baseTitle}?`,
      answer: `${baseTitle} is a comprehensive approach that helps businesses achieve better results. It involves strategic planning and execution.`,
    },
    {
      question: `How long does it take to see results with ${baseTitle}?`,
      answer: `Typically, you can see initial results within 3-6 months, with significant improvements after 6-12 months of consistent implementation.`,
    },
    {
      question: `Is ${baseTitle} suitable for small businesses?`,
      answer: `Yes, ${baseTitle} can be adapted for businesses of all sizes. The key is to start with the fundamentals and scale as you grow.`,
    },
  ];

  return {
    titleOptions,
    h2Outline,
    faqs,
    metaTitle: `${baseTitle} Guide | Complete Resource 2024`,
    metaDescription: `Discover everything you need to know about ${baseTitle}. Expert tips, strategies, and best practices to help you succeed.`,
    internalLinks: [
      `${demo.site.industry} best practices`,
      `${demo.site.industry} case studies`,
      `${demo.site.industry} tools`,
    ],
    schemaSuggestion: intent === "commercial" ? "Product" : "Article",
  };
}

async function seedDrafts(client: ConvexHttpClient, projectId: any, demo: ReturnType<typeof generateDemoData>) {
  console.log("\n➡️  Seeding drafts...");
  
  const plan = await client.query(api.content.quarterlyPlans.getPlanByProject, {
    projectId,
  });

  if (!plan || !plan.briefs || plan.briefs.length === 0) {
    console.log("   - No briefs found, skipping drafts.");
    return;
  }

  // Get briefs with details (in_progress status)
  const briefsWithDetails = plan.briefs.filter((b: any) => 
    b.status === "in_progress" && b.titleOptions && b.titleOptions.length > 0
  );

  let draftCount = 0;
  for (const brief of briefsWithDetails.slice(0, 3)) { // Create drafts for first 3 in-progress briefs
    const existingDraft = await client.query(api.content.drafts.getDraftByBrief, {
      briefId: brief._id,
    });

    if (existingDraft) continue;

    const draftContent = generateMockDraftContent(brief);
    const wordCount = draftContent.split(/\s+/).length;

    await client.mutation(api.content.drafts.createDraft, {
      briefId: brief._id,
      projectId,
      content: draftContent,
      qualityScore: 85 + Math.floor(Math.random() * 10),
      toneScore: 82 + Math.floor(Math.random() * 8),
      wordCount,
      status: "draft",
    });

    draftCount++;
  }

  console.log(`   - Created ${draftCount} drafts.`);
}

function generateMockDraftContent(brief: any) {
  const title = brief.titleOptions?.[0] || brief.title;
  const h2s = brief.h2Outline || [];
  const faqs = brief.faqs || [];

  let content = `# ${title}\n\n`;
  content += `This comprehensive guide covers everything you need to know about ${brief.title}.\n\n`;

  // Add H2 sections
  h2s.forEach((h2: string, idx: number) => {
    content += `## ${h2}\n\n`;
    content += `This section explores ${h2.toLowerCase()}. `;
    content += `Understanding this concept is crucial for success. `;
    content += `Let's dive deeper into the key aspects.\n\n`;
    
    if (idx < h2s.length - 1) {
      content += `### Key Points\n\n`;
      content += `- Important consideration #1\n`;
      content += `- Important consideration #2\n`;
      content += `- Important consideration #3\n\n`;
    }
  });

  // Add FAQs section
  if (faqs.length > 0) {
    content += `## Frequently Asked Questions\n\n`;
    faqs.forEach((faq: any) => {
      content += `### ${faq.question}\n\n`;
      content += `${faq.answer}\n\n`;
    });
  }

  content += `## Conclusion\n\n`;
  content += `In summary, ${brief.title} is an essential aspect of modern business strategy. `;
  content += `By following the guidelines in this guide, you'll be well-equipped to succeed.\n`;

  return content;
}

async function seedScheduledPosts(client: ConvexHttpClient, projectId: any, demo: ReturnType<typeof generateDemoData>) {
  console.log("\n➡️  Seeding scheduled posts...");
  
  const drafts = await client.query(api.content.drafts.getDraftsByProject, {
    projectId,
  });

  if (!drafts || drafts.length === 0) {
    console.log("   - No drafts found, skipping scheduled posts.");
    return;
  }

  let scheduledCount = 0;
  for (const draft of drafts.slice(0, 2)) { // Schedule first 2 drafts
    const brief = await client.query(api.content.briefs.getBriefById, {
      briefId: draft.briefId,
    });

    if (!brief) continue;

    // Check if already scheduled
    const existingPosts = await client.query(api.publishing.scheduledPosts.getScheduledPosts, {
      projectId,
    });

    const alreadyScheduled = existingPosts.some((p: any) => p.draftId === draft._id);
    if (alreadyScheduled) continue;

    // Schedule for next week
    const publishDate = Date.now() + (scheduledCount + 1) * 7 * 24 * 60 * 60 * 1000;

    await client.mutation(api.publishing.scheduledPosts.createScheduledPost, {
      draftId: draft._id,
      projectId,
      briefId: brief._id,
      publishDate,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      platform: "wordpress",
      tags: ["seo", "content-marketing", demo.site.industry.toLowerCase()],
      categories: ["Blog"],
      slug: slugify(brief.title || "post"),
      status: "scheduled",
    });

    scheduledCount++;
  }

  console.log(`   - Scheduled ${scheduledCount} posts.`);
}

async function seedIntegrations(client: ConvexHttpClient, projectId: any, demo: ReturnType<typeof generateDemoData>) {
  console.log("\n➡️  Seeding integrations...");
  
  // Check for existing GA4 connection
  const existingGA4 = await client.query(api.integrations.ga4Connections.getGA4Connection, {
    projectId,
  });

  if (!existingGA4) {
    await client.mutation(api.integrations.ga4Connections.upsertGA4Connection, {
      projectId,
      propertyId: "demo-property-123",
      propertyName: `${demo.site.companyName} (Demo)`,
      accessToken: "demo-access-token-123",
      refreshToken: "demo-refresh-token-123",
    });
    console.log("   - Created mock GA4 connection.");
  } else {
    console.log("   - GA4 connection already exists.");
  }

  // Check for existing GSC connection
  const existingGSC = await client.query(api.integrations.gscConnections.getGSCConnection, {
    projectId,
  });

  if (!existingGSC) {
    await client.mutation(api.integrations.gscConnections.upsertGSCConnection, {
      projectId,
      siteUrl: demo.site.url,
      accessToken: "demo-gsc-access-token-123",
      refreshToken: "demo-gsc-refresh-token-123",
    });
    console.log("   - Created mock GSC connection.");
  } else {
    console.log("   - GSC connection already exists.");
  }
}

async function seedKeywords(client: ConvexHttpClient, clientId: any, demo: ReturnType<typeof generateDemoData>) {
  console.log("\n➡️  Seeding keywords...");
  
  const existing = await client.query(api.seo.keywords.getKeywordsByClient, {
    clientId,
  });

  if (existing && existing.length > 0) {
    console.log("   - Keywords already exist.");
    return;
  }

  const keywords = [
    { keyword: `${demo.site.industry} services`, searchVolume: 2400, difficulty: 45, cpc: 3.50, intent: "commercial", priority: "high" },
    { keyword: `best ${demo.site.industry} tools`, searchVolume: 1900, difficulty: 52, cpc: 4.20, intent: "commercial", priority: "high" },
    { keyword: `${demo.site.industry} guide`, searchVolume: 1600, difficulty: 38, cpc: 2.80, intent: "informational", priority: "medium" },
    { keyword: `${demo.site.industry} pricing`, searchVolume: 1200, difficulty: 48, cpc: 5.10, intent: "commercial", priority: "high" },
    { keyword: `how to ${demo.site.industry.toLowerCase()}`, searchVolume: 980, difficulty: 35, cpc: 2.40, intent: "informational", priority: "medium" },
    { keyword: `${demo.site.industry} case study`, searchVolume: 850, difficulty: 42, cpc: 3.90, intent: "commercial", priority: "medium" },
    { keyword: `${demo.site.industry} software`, searchVolume: 2100, difficulty: 55, cpc: 4.60, intent: "commercial", priority: "high" },
    { keyword: `${demo.site.industry} best practices`, searchVolume: 1100, difficulty: 40, cpc: 3.20, intent: "informational", priority: "medium" },
  ];

  await client.mutation(api.seo.keywords.addKeywords, {
    clientId,
    keywords,
  });

  console.log(`   - Inserted ${keywords.length} keywords.`);
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

main().catch((error) => {
  console.error("❌ Demo seeding failed:", error);
  process.exit(1);
});


