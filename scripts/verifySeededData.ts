/**
 * Verify that all seeded data exists and is properly structured
 * Run with: npx tsx scripts/verifySeededData.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
const DEMO_EMAIL = process.env.DEMO_ADMIN_EMAIL || "demo+admin@martai.com";

if (!CONVEX_URL) {
  console.error("ERROR: CONVEX_URL environment variable not set");
  process.exit(1);
}

async function verifySeededData() {
  const client = new ConvexHttpClient(CONVEX_URL);

  console.log("\n🔍 Verifying All Seeded Data");
  console.log("=" .repeat(60));

  let allPassed = true;

  try {
    // 1. Verify User
    console.log("\n1️⃣ Verifying User...");
    const user = await client.query(api.auth.users.getUserSnapshotByEmail, {
      email: DEMO_EMAIL,
    });

    if (!user?._id) {
      console.error("   ❌ User not found");
      allPassed = false;
    } else {
      console.log(`   ✅ User: ${user.email} (${user._id})`);
      console.log(`      Role: ${user.role || 'user'}`);
    }

    if (!user?._id) {
      console.error("\n❌ Cannot continue without user. Run: npx tsx scripts/seedDemoAccount.ts");
      process.exit(1);
    }

    // 2. Verify Project
    console.log("\n2️⃣ Verifying Project...");
    const projects = await client.query(api.projects.projects.getProjectsByUser, {
      userId: user._id,
    });

    if (projects.length === 0) {
      console.error("   ❌ No projects found");
      allPassed = false;
    } else {
      const project = projects[0];
      console.log(`   ✅ Project: ${project.name} (${project._id})`);
      console.log(`      URL: ${project.websiteUrl}`);
      
      const projectId = project._id;

      // 3. Verify Clusters
      console.log("\n3️⃣ Verifying Keyword Clusters...");
      const clusters = await client.query(api.seo.keywordClusters.getClustersByProject, {
        projectId,
      });
      if (clusters.length === 0) {
        console.error("   ❌ No clusters found");
        allPassed = false;
      } else {
        console.log(`   ✅ Clusters: ${clusters.length} total`);
        console.log(`      Active: ${clusters.filter((c: any) => c.status === 'active').length}`);
      }

      // 4. Verify Plan & Briefs
      console.log("\n4️⃣ Verifying Quarterly Plan & Briefs...");
      const plan = await client.query(api.content.quarterlyPlans.getPlanByProject, {
        projectId,
      });
      if (!plan) {
        console.error("   ❌ No plan found");
        allPassed = false;
      } else {
        console.log(`   ✅ Plan exists with ${plan.briefs?.length || 0} briefs`);
        const briefsWithDetails = plan.briefs?.filter((b: any) => 
          b.titleOptions && b.titleOptions.length > 0
        ) || [];
        console.log(`      Briefs with details: ${briefsWithDetails.length}`);
      }

      // 5. Verify Drafts
      console.log("\n5️⃣ Verifying Drafts...");
      const drafts = await client.query(api.content.drafts.getDraftsByProject, {
        projectId,
      });
      if (drafts.length === 0) {
        console.warn("   ⚠️  No drafts found (optional)");
      } else {
        console.log(`   ✅ Drafts: ${drafts.length}`);
      }

      // 6. Verify Scheduled Posts
      console.log("\n6️⃣ Verifying Scheduled Posts...");
      const posts = await client.query(api.publishing.scheduledPosts.getScheduledPosts, {
        projectId,
      });
      if (posts.length === 0) {
        console.warn("   ⚠️  No scheduled posts found (optional)");
      } else {
        console.log(`   ✅ Scheduled Posts: ${posts.length}`);
      }

      // 7. Verify Analytics
      console.log("\n7️⃣ Verifying Analytics Data...");
      const analytics = await client.query(api.analytics.analytics.getAnalyticsData, {
        projectId,
        startDate: Date.now() - 120 * 24 * 60 * 60 * 1000,
        endDate: Date.now(),
      });
      if (analytics.length === 0) {
        console.warn("   ⚠️  No analytics data found (optional)");
      } else {
        console.log(`   ✅ Analytics: ${analytics.length} data points`);
      }

      // 8. Verify Insights
      console.log("\n8️⃣ Verifying Insights...");
      const insights = await client.query(api.analytics.analytics.getInsights, {
        projectId,
      });
      if (insights.length === 0) {
        console.warn("   ⚠️  No insights found (optional)");
      } else {
        console.log(`   ✅ Insights: ${insights.length}`);
      }

      // 9. Verify Integrations
      console.log("\n9️⃣ Verifying Integrations...");
      const ga4 = await client.query(api.integrations.ga4Connections.getGA4Connection, {
        projectId,
      });
      const gsc = await client.query(api.integrations.gscConnections.getGSCConnection, {
        projectId,
      });
      console.log(`   ${ga4 ? '✅' : '⚠️'} GA4: ${ga4 ? 'Connected' : 'Not connected'}`);
      console.log(`   ${gsc ? '✅' : '⚠️'} GSC: ${gsc ? 'Connected' : 'Not connected'}`);

      // 10. Verify Keywords
      console.log("\n🔟 Verifying Keywords...");
      try {
        const keywords = await client.query(api.seo.keywordsData.getKeywordsByProject, {
          projectId,
        });
        if (!keywords.stats || keywords.stats.total === 0) {
          console.warn("   ⚠️  No keywords found (optional)");
        } else {
          console.log(`   ✅ Keywords: ${keywords.stats.total} total`);
          console.log(`      High priority: ${keywords.stats.highPriority || 0}`);
        }
      } catch (error: any) {
        console.warn(`   ⚠️  Keywords query error: ${error.message}`);
      }
    }

    console.log("\n" + "=".repeat(60));
    if (allPassed) {
      console.log("✅ All required data verified!");
      console.log("\n💡 The demo account is ready for UI testing.");
    } else {
      console.log("⚠️  Some required data is missing.");
      console.log("💡 Run: npx tsx scripts/seedDemoAccount.ts");
    }

  } catch (error: any) {
    console.error("\n❌ Verification failed:", error);
    console.error("   Details:", error.message);
    process.exit(1);
  }
}

verifySeededData().catch((error) => {
  console.error("❌ Verification failed:", error);
  process.exit(1);
});

