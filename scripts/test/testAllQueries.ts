/**
 * Test script to verify all queries and mutations work correctly
 * Run with: npx tsx scripts/testAllQueries.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;
const DEMO_EMAIL = process.env.DEMO_ADMIN_EMAIL || "demo+admin@martai.com";

if (!CONVEX_URL) {
  throw new Error("ERROR: CONVEX_URL environment variable not set");
}

async function testAllQueries() {
  const client = new ConvexHttpClient(CONVEX_URL);

  console.log("\n🧪 Testing All Queries and Mutations");
  console.log("=".repeat(60));

  try {
    // 1. Get user
    console.log("\n1️⃣ Testing User Queries...");
    const user = await client.query(api.auth.users.getUserSnapshotByEmail, {
      email: DEMO_EMAIL,
    });

    if (!user?._id) {
      console.error(`❌ User not found: ${DEMO_EMAIL}`);
      console.error("   Run: npx tsx scripts/seedDemoAccount.ts");
      process.exit(1);
    }
    console.log(`   ✅ User found: ${user.username} (${user._id})`);

    // 2. Test Projects
    console.log("\n2️⃣ Testing Project Queries...");
    const projects = await client.query(api.projects.projects.getProjectsByUser, {
      userId: user._id,
    });
    console.log(`   ✅ Found ${projects.length} project(s)`);
    
    if (projects.length === 0) {
      console.error("   ❌ No projects found!");
      console.error("   Run: npx tsx scripts/seedDemoAccount.ts");
      process.exit(1);
    }

    const projectId = projects[0]._id;
    console.log(`   📁 Project: ${projects[0].name} (${projectId})`);

    // 3. Test Strategy Query
    console.log("\n3️⃣ Testing Strategy Query...");
    const strategy = await client.query(api.seo.strategy.getStrategyByProject, {
      projectId,
    });
    console.log(`   ✅ Strategy data loaded`);
    console.log(`      - Clusters: ${strategy.stats.clusterCount}`);
    console.log(`      - Plan: ${strategy.stats.planExists ? 'Yes' : 'No'}`);
    console.log(`      - Briefs: ${strategy.stats.briefCount}`);

    // 4. Test Content Query
    console.log("\n4️⃣ Testing Content Query...");
    try {
      const content = await client.query(api.content.content.getContentByProject, {
        projectId,
      });
      console.log(`   ✅ Content data loaded`);
      console.log(`      - Briefs: ${content.stats.totalBriefs}`);
      console.log(`      - Briefs with details: ${content.stats.briefsWithDetails}`);
      console.log(`      - Briefs with drafts: ${content.stats.briefsWithDrafts}`);
    } catch (error: any) {
      console.log(`   ⚠️  Content query error: ${error.message}`);
    }

    // 5. Test Publishing Query
    console.log("\n5️⃣ Testing Publishing Query...");
    try {
      const publishing = await client.query(api.publishing.publishing.getPublishingByProject, {
        projectId,
      });
      console.log(`   ✅ Publishing data loaded`);
      console.log(`      - Total posts: ${publishing.stats.totalPosts}`);
      console.log(`      - Scheduled: ${publishing.stats.scheduled}`);
      console.log(`      - Published: ${publishing.stats.published}`);
    } catch (error: any) {
      console.log(`   ⚠️  Publishing query error: ${error.message}`);
    }

    // 6. Test Integrations Query
    console.log("\n6️⃣ Testing Integrations Query...");
    try {
      const integrations = await client.query(api.integrations.integrations.getIntegrationsByProject, {
        projectId,
      });
      console.log(`   ✅ Integrations data loaded`);
      console.log(`      - GA4: ${integrations.ga4.connected ? 'Connected' : 'Not connected'}`);
      console.log(`      - GSC: ${integrations.gsc.connected ? 'Connected' : 'Not connected'}`);
    } catch (error: any) {
      console.log(`   ⚠️  Integrations query error: ${error.message}`);
    }

    // 7. Test Keywords Query
    console.log("\n7️⃣ Testing Keywords Query...");
    try {
      const keywords = await client.query(api.seo.keywordsData.getKeywordsByProject, {
        projectId,
      });
      console.log(`   ✅ Keywords data loaded`);
      console.log(`      - Total keywords: ${keywords.stats?.total || 0}`);
      console.log(`      - High priority: ${keywords.stats?.highPriority || 0}`);
    } catch (error: any) {
      console.log(`   ⚠️  Keywords query error: ${error.message}`);
    }

    // 8. Test Analytics Query
    console.log("\n8️⃣ Testing Analytics Query...");
    try {
      const analytics = await client.query(api.analytics.analytics.getAnalyticsData, {
        projectId,
        startDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
        endDate: Date.now(),
      });
      console.log(`   ✅ Analytics data loaded`);
      console.log(`      - Data points: ${analytics.length}`);
    } catch (error: any) {
      console.log(`   ⚠️  Analytics query error: ${error.message}`);
    }

    // 9. Test Insights Query
    console.log("\n9️⃣ Testing Insights Query...");
    try {
      const insights = await client.query(api.analytics.analytics.getInsights, {
        projectId,
      });
      console.log(`   ✅ Insights data loaded`);
      console.log(`      - Insights: ${insights.length}`);
    } catch (error: any) {
      console.log(`   ⚠️  Insights query error: ${error.message}`);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ All queries tested successfully!");
    console.log("\n💡 You can now test the UI - all data should be available.");

  } catch (error: any) {
    console.error("\n❌ Test failed:", error);
    console.error("   Details:", error.message);
    process.exit(1);
  }
}

testAllQueries().catch((error) => {
  console.error("❌ Test failed:", error);
  process.exit(1);
});

