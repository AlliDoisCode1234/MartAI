
import { api } from '../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.error('NEXT_PUBLIC_CONVEX_URL is not defined');
  process.exit(1);
}

const client = new ConvexHttpClient(convexUrl);

async function dogfoodKeywords() {
  console.log('🚀 Starting Keyword Dogfooding...');

  try {
    // 1. Create User & Project
    const email = `martai-dogfood-${Date.now()}@example.com`;
    const userId = await client.mutation(api.auth.users.createUser, {
      email,
      passwordHash: 'hashed',
      name: 'MartAI Admin',
    });
    console.log('✅ User created');

    const projectId = await client.mutation(api.projects.projects.createProject, {
      userId,
      name: 'MartAI Production',
      websiteUrl: 'https://martai.com',
      industry: 'AI Marketing Software',
    });
    console.log('✅ Project created:', projectId);

    // 2. Generate Clusters
    console.log('\n2. Generating Clusters...');
    const seedKeywords = [
      { keyword: "AI SEO Tool", volume: 1000, difficulty: 40, intent: "commercial" },
      { keyword: "Automated Content Generation", volume: 800, difficulty: 35, intent: "commercial" },
      { keyword: "Lead Generation AI", volume: 1200, difficulty: 50, intent: "transactional" },
      { keyword: "How to scale SEO", volume: 500, difficulty: 20, intent: "informational" },
      { keyword: "Best SEO software 2025", volume: 300, difficulty: 60, intent: "commercial" }
    ];

    const result = await client.action(api.seo.keywordActions.generateClusters, {
      projectId,
      keywords: seedKeywords,
      importFromGSC: false,
    });

    console.log(`✅ Clusters Generated: ${result.count}`);

    // 3. Verify Clusters
    console.log('\n3. Verifying Clusters...');
    const clusters = await client.query(api.seo.keywordClusters.getClustersByProject, { projectId });
    
    if (clusters.length > 0) {
      console.log(`✅ Found ${clusters.length} clusters:`);
      clusters.forEach(c => {
        console.log(`   - [${c.intent}] ${c.clusterName} (Impact: ${c.impactScore})`);
      });
    } else {
      console.error('❌ No clusters found');
      process.exit(1);
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
    if (error.data) console.error('Error Data:', JSON.stringify(error.data, null, 2));
    process.exit(1);
  }
}

dogfoodKeywords();
