/**
 * Test script to verify strategy data is accessible for demo user
 * Run with: npx tsx scripts/testStrategyData.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;
const DEMO_EMAIL = process.env.DEMO_ADMIN_EMAIL || "demo+admin@martai.com";

if (!CONVEX_URL) {
  throw new Error("Please set NEXT_PUBLIC_CONVEX_URL or CONVEX_URL before running this script.");
}

async function testStrategyData() {
  const client = new ConvexHttpClient(CONVEX_URL);

  console.log("\n🔍 Testing Strategy Data Access");
  console.log("=".repeat(50));

  try {
    // 1. Get demo user
    console.log("\n1️⃣ Finding demo user...");
    const user = await client.query(api.auth.users.getUserSnapshotByEmail, {
      email: DEMO_EMAIL,
    });

    if (!user?._id) {
      console.error(`❌ Demo user not found: ${DEMO_EMAIL}`);
      console.error("   Run: npx tsx scripts/seedDemoAccount.ts");
      process.exit(1);
    }

    console.log(`   ✅ Found user: ${user.username} (${user._id})`);

    // 2. Get user's projects
    // NOTE: getProjectsByUser is @deprecated. Test scripts still use it because
    // ConvexHttpClient lacks auth context for projects.list. Migrate when test infra supports auth.
    console.log("\n2️⃣ Finding user projects...");
    const projects = await client.query(api.projects.projects.getProjectsByUser, {
      userId: user._id,
    });

    if (!projects || projects.length === 0) {
      console.error("❌ No projects found for demo user");
      console.error("   Run: npx tsx scripts/seedDemoAccount.ts");
      process.exit(1);
    }

    console.log(`   ✅ Found ${projects.length} project(s)`);
    const projectId = projects[0]._id;
    console.log(`   📁 Project: ${projects[0].name} (${projectId})`);

    // 3. Test strategy query
    console.log("\n3️⃣ Testing strategy query...");
    const strategy = await client.query(api.seo.strategy.getStrategyByProject, {
      projectId,
    });

    console.log("\n📊 Strategy Data Summary:");
    console.log("=".repeat(50));
    console.log(`   Project ID: ${strategy.projectId}`);
    console.log(`   Clusters: ${strategy.stats.clusterCount} total, ${strategy.stats.activeClusterCount} active`);
    console.log(`   Plan: ${strategy.stats.planExists ? "✅ Exists" : "❌ Missing"}`);
    console.log(`   Briefs: ${strategy.stats.briefCount}`);

    // 4. Display cluster details
    if (strategy.clusters.length > 0) {
      console.log("\n📈 Clusters:");
      strategy.clusters.slice(0, 5).forEach((cluster: any, idx: number) => {
        console.log(`   ${idx + 1}. ${cluster.clusterName || cluster.topic || "Untitled"}`);
        console.log(`      Keywords: ${cluster.keywords?.length || 0}`);
        console.log(`      Impact: ${cluster.impactScore || 0}`);
        console.log(`      Status: ${cluster.status || "active"}`);
      });
      if (strategy.clusters.length > 5) {
        console.log(`   ... and ${strategy.clusters.length - 5} more`);
      }
    } else {
      console.log("\n⚠️  No clusters found");
    }

    // 5. Display plan details
    if (strategy.plan) {
      console.log("\n📅 Quarterly Plan:");
      console.log(`   Content Velocity: ${strategy.plan.contentVelocity} posts/week`);
      console.log(`   Start Date: ${new Date(strategy.plan.startDate).toLocaleDateString()}`);
      console.log(`   Goals: Traffic ${strategy.plan.goals?.traffic || "N/A"}, Leads ${strategy.plan.goals?.leads || "N/A"}`);
      
      if (strategy.plan.briefs && strategy.plan.briefs.length > 0) {
        console.log(`   Briefs: ${strategy.plan.briefs.length} scheduled`);
        console.log(`   First brief: "${strategy.plan.briefs[0]?.title || "Untitled"}"`);
        console.log(`   Scheduled: ${new Date(strategy.plan.briefs[0]?.scheduledDate || 0).toLocaleDateString()}`);
      }
    } else {
      console.log("\n⚠️  No plan found");
    }

    // 6. Summary
    console.log("\n" + "=".repeat(50));
    if (strategy.stats.clusterCount > 0 && strategy.stats.planExists) {
      console.log("✅ Strategy data is properly seeded!");
      console.log(`\n💡 Use Convex directly: api.seo.strategy.getStrategyByProject`);
      console.log(`   Project ID tested: ${projectId}`);
      console.log(`   (After logging in as ${DEMO_EMAIL})`);
    } else {
      console.log("⚠️  Strategy data incomplete:");
      if (strategy.stats.clusterCount === 0) {
        console.log("   - No clusters found");
      }
      if (!strategy.stats.planExists) {
        console.log("   - No plan found");
      }
      console.log("\n💡 Run: npx tsx scripts/seedDemoAccount.ts");
    }

  } catch (error: any) {
    console.error("\n❌ Error testing strategy data:", error);
    console.error("   Details:", error.message);
    process.exit(1);
  }
}

testStrategyData().catch((error) => {
  console.error("❌ Test failed:", error);
  process.exit(1);
});

