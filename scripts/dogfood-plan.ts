
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

async function dogfoodPlan() {
  console.log('🚀 Starting Strategic Planning Dogfooding...');

  try {
    // 1. Create User & Project
    const email = `martai-plan-${Date.now()}@example.com`;
    const userId = await client.mutation(api.auth.users.createUser, {
      email,
      passwordHash: 'hashed',
      name: 'MartAI Planner',
    });
    console.log('✅ User created');

    const projectId = await client.mutation(api.projects.projects.createProject, {
      userId,
      name: 'MartAI Planning',
      websiteUrl: 'https://martai.com',
      industry: 'AI Marketing Software',
    });
    console.log('✅ Project created:', projectId);

    // 2. Generate Plan
    console.log('\n2. Generating Quarterly Plan...');
    // Note: generatePlan is an ACTION because it uses OpenAI to generate summary/assumptions.
    // If OpenAI key is missing, it might fail or fallback?
    // Let's check convex/content/quarterlyPlans.ts: generatePlan
    // It calls generatePlanSummary (lib/quarterlyPlanning).
    // If it fails, it catches error and uses fallback string.
    // So it SHOULD succeed even without OpenAI key.
    
    const result = await client.action(api.content.quarterlyPlans.generatePlan, {
      projectId,
      contentVelocity: 3, // 3 posts/week
      startDate: Date.now(),
      goals: {
        traffic: 10000,
        leads: 500,
      }
    });

    if (result.success) {
      console.log('✅ Plan Generated:', result.planId);
      console.log('   Assumptions:', result.assumptions);
    } else {
      console.error('❌ Plan Generation Failed');
      process.exit(1);
    }

    // 3. Verify Plan & Briefs
    console.log('\n3. Verifying Plan Details...');
    const plan = await client.query(api.content.quarterlyPlans.getPlanByProject, { projectId });
    
    if (plan) {
      console.log(`✅ Plan Found: ${plan._id}`);
      console.log(`   Briefs Created: ${plan.briefs?.length || 0}`);
      
      if (plan.briefs && plan.briefs.length > 0) {
        console.log('   First Brief:', plan.briefs[0].title);
        console.log('   Scheduled Date:', new Date(plan.briefs[0].scheduledDate).toISOString());
      } else {
        console.warn('⚠️ No briefs found in plan');
      }
    } else {
      console.error('❌ Plan not found in DB');
      process.exit(1);
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
    if (error.data) console.error('Error Data:', JSON.stringify(error.data, null, 2));
    process.exit(1);
  }
}

dogfoodPlan();
