
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

async function verifyAnalytics() {
  console.log('🚀 Starting Analytics Verification...');

  try {
    // 1. Create User & Project
    const email = `martai-analytics-${Date.now()}@example.com`;
    const userId = await client.mutation(api.auth.users.createUser, {
      email,
      passwordHash: 'hashed',
      name: 'Analytics Tester',
    });
    console.log('✅ User created');

    const projectId = await client.mutation(api.projects.projects.createProject, {
      userId,
      name: 'Analytics Demo',
      websiteUrl: 'https://example.com',
      industry: 'Tech',
    });
    console.log('✅ Project created:', projectId);

    // 2. Store Data
    const today = Date.now();
    const yesterday = today - 86400000;

    console.log('\n2. Storing Analytics Data...');
    
    // GA4 Data
    await client.mutation(api.analytics.analytics.storeAnalyticsData, {
      projectId,
      date: today,
      source: 'ga4',
      sessions: 100,
      leads: 5,
      revenue: 500,
    });
    await client.mutation(api.analytics.analytics.storeAnalyticsData, {
      projectId,
      date: yesterday,
      source: 'ga4',
      sessions: 80,
      leads: 3,
      revenue: 300,
    });

    // GSC Data
    await client.mutation(api.analytics.analytics.storeAnalyticsData, {
      projectId,
      date: today,
      source: 'gsc',
      clicks: 50,
      impressions: 1000,
      avgPosition: 10.5,
    });
    await client.mutation(api.analytics.analytics.storeAnalyticsData, {
      projectId,
      date: yesterday,
      source: 'gsc',
      clicks: 40,
      impressions: 800,
      avgPosition: 11.0,
    });

    console.log('✅ Data stored');

    // 3. Verify KPIs
    console.log('\n3. Verifying KPIs...');
    const kpis = await client.query(api.analytics.analytics.getKPIs, {
      projectId,
      startDate: yesterday,
      endDate: today,
    });

    console.log('   Sessions:', kpis.sessions);
    console.log('   Leads:', kpis.leads);
    console.log('   Clicks:', kpis.clicks);
    console.log('   Impressions:', kpis.impressions);
    console.log('   Conversion Rate:', kpis.conversionRate.toFixed(2) + '%');

    // Expected values
    // Sessions: 100 + 80 = 180
    // Leads: 5 + 3 = 8
    // Clicks: 50 + 40 = 90
    // Impressions: 1000 + 800 = 1800
    // Conversion Rate: (8 / 180) * 100 = 4.44%

    if (kpis.sessions === 180 && kpis.leads === 8 && kpis.clicks === 90) {
      console.log('✅ KPIs match expected values');
    } else {
      console.error('❌ KPI mismatch');
      console.error('Expected: Sessions=180, Leads=8, Clicks=90');
      process.exit(1);
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
    process.exit(1);
  }
}

verifyAnalytics();
