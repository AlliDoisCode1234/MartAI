
import { api } from '../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.error('NEXT_PUBLIC_CONVEX_URL is not defined');
  process.exit(1);
}

const client = new ConvexHttpClient(convexUrl);

async function verifyOnboarding() {
  console.log('🚀 Starting Onboarding Verification...');

  // 1. Simulate Signup (we can't easily call Next.js API route from here without running server, 
  // so we will simulate what the API does by calling Convex directly for this test script, 
  // OR we can use fetch if we assume the server is running. 
  // Since I can't guarantee server is running, I will verify the Convex mutations directly 
  // which mimics the API logic).
  
  // Actually, to truly verify "Onboarding", I should test the API endpoints if possible.
  // But without a running server, I'll test the Convex mutations that the API calls.
  
  const email = `martai-test-${Date.now()}@example.com`;
  const password = 'password123';
  
  console.log(`\n1. Creating User: ${email}`);
  // We can't call hashPassword here easily without importing bcrypt which might not be available in this script context 
  // if it's not compiled. 
  // Let's assume we are testing the Convex side.
  
  // Wait, I can run this script with ts-node.
  // I'll try to use the actual API logic if possible, but calling API routes requires a server.
  // I will simulate the Convex calls.
  
  try {
    // Create User
    const userId = await client.mutation(api.auth.users.createUser, {
      email,
      passwordHash: 'hashed_password_simulation',
      name: 'MartAI Test User',
    });
    console.log('✅ User created:', userId);

    // Create Session
    const sessionId = await client.mutation(api.auth.sessions.createSession, {
      userId,
      token: 'mock_refresh_token',
      expiresAt: Date.now() + 3600000,
    });
    console.log('✅ Session created:', sessionId);

    // 2. Create Project
    console.log('\n2. Creating Project...');
    const projectId = await client.mutation(api.projects.projects.createProject, {
      userId,
      name: 'MartAI Dogfooding',
      websiteUrl: 'https://martai.com',
      industry: 'AI Software',
    });
    console.log('✅ Project created:', projectId);

    // 3. Verify Data
    console.log('\n3. Verifying Data...');
    const project = await client.query(api.projects.projects.getProjectById, { projectId });
    
    if (project && project.name === 'MartAI Dogfooding') {
      console.log('✅ Verification Successful: Project found in DB');
    } else {
      console.error('❌ Verification Failed: Project not found or mismatch');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error during verification:', error);
    process.exit(1);
  }
}

verifyOnboarding();
