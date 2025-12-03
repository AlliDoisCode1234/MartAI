
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

async function dogfoodBriefs() {
  console.log('🚀 Starting Brief Generation Dogfooding...');

  try {
    // 1. Create User & Project (or use existing if we could find it, but sticking to self-contained)
    const email = `martai-briefs-${Date.now()}@example.com`;
    const userId = await client.mutation(api.auth.users.createUser, {
      email,
      passwordHash: 'hashed',
      name: 'MartAI Editor',
    });
    console.log('✅ User created');

    const projectId = await client.mutation(api.projects.projects.createProject, {
      userId,
      name: 'MartAI Content',
      websiteUrl: 'https://martai.com',
      industry: 'AI Marketing Software',
    });
    console.log('✅ Project created:', projectId);

    // 2. Create a Plan (to get briefs)
    console.log('\n2. Generating Plan...');
    const planResult = await client.action((api as any).content.quarterlyPlanActions.generatePlan, {
      projectId,
      contentVelocity: 3,
      startDate: Date.now(),
    });

    if (!planResult.success) {
      throw new Error('Plan generation failed');
    }
    console.log('✅ Plan Generated');

    // 3. Get Briefs
    const plan = await client.query(api.content.quarterlyPlans.getPlanByProject, { projectId });
    if (!plan || !plan.briefs || plan.briefs.length === 0) {
      throw new Error('No briefs found');
    }

    const firstBrief = plan.briefs[0];
    console.log(`\n3. Generating Details for Brief: "${firstBrief.title}" (${firstBrief._id})`);

    // 4. Generate Brief Details
    // Note: This requires OPENAI_API_KEY in Convex env.
    const result = await client.action(api.content.briefActions.generateBrief, {
      briefId: firstBrief._id,
      projectId,
      clusterId: firstBrief.clusterId,
    });

    if (result.success) {
      console.log('✅ Brief Details Generated');
      
      // Verify details
      const updatedBrief = await client.query(api.content.briefs.getBriefById, { briefId: firstBrief._id });
      if (updatedBrief && updatedBrief.h2Outline && updatedBrief.h2Outline.length > 0) {
        console.log('   H2 Outline:', updatedBrief.h2Outline.length, 'sections');
        console.log('   FAQs:', updatedBrief.faqs?.length, 'questions');
        console.log('   Meta Title:', updatedBrief.metaTitle);
      } else {
        console.error('❌ Brief details missing after generation');
        process.exit(1);
      }
    } else {
      console.error('❌ Brief Generation Failed');
      process.exit(1);
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
    if (error.data) console.error('Error Data:', JSON.stringify(error.data, null, 2));
    process.exit(1);
  }
}

dogfoodBriefs();
