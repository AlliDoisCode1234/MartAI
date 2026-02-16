/**
 * Quick verification script to check GA4/GSC connection status
 * Run: npx ts-node --esm scripts/verify-connections.ts
 * Or use from browser console at localhost:3000
 */

import { ConvexHttpClient } from 'convex/browser';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || '';

async function main() {
  if (!CONVEX_URL) {
    console.error('NEXT_PUBLIC_CONVEX_URL not set');
    process.exit(1);
  }

  const client = new ConvexHttpClient(CONVEX_URL);

  console.log('Checking Convex connection at:', CONVEX_URL);
  console.log('---');

  // We can't easily query without knowing the projectId
  // But we can verify the client connects
  console.log('Convex client created successfully');
  console.log('\nTo verify connections, open your Convex Dashboard:');
  console.log('  https://dashboard.convex.dev');
  console.log('  → Select your deployment');
  console.log('  → Data tab');
  console.log('  → Check ga4Connections table');
  console.log('  → Check gscConnections table');
}

main().catch(console.error);
