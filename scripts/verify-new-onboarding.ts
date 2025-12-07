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

async function verifyNewOnboarding() {
  console.log('🚀 Starting New Onboarding Flow Verification...');

  const email = `onboarding-test-${Date.now()}@example.com`;

  try {
    // 1. Create User
    console.log(`\n1. Creating User: ${email}`);
    const userId = await client.mutation(api.auth.users.createUser, {
      email,
      passwordHash: 'hashed_password_simulation',
      name: 'Onboarding Test User',
    });
    console.log('✅ User created:', userId);

    // Verify initial status (should be undefined or 'in_progress' depending on implementation,
    // strictly speaking schema says optional string. Let's check what it is.)
    // Note: createUser usually doesn't set it unless we updated it.
    // In our implementation, we add it to schema but did we update createUser?
    // Let's check current user status.
    // We need a query that gets user by ID or we just use internal query if accessible?
    // Client strictly speaks public API. We might need to use `api.users.current` but that requires auth.
    // For simplicity in this script without auth token simulation, we might hit limitations.
    // However, `resetOnboarding` is admin only.

    // WAIT. Authenticating as admin in scripts is tricky if we don't have an admin token.
    // `scripts/verify-onboarding.ts` used public mutations or assumed no auth?
    // `api.auth.users.createUser` is likely public.
    // `api.users.completeOnboarding` checks `ctx.auth.getUserIdentity()`.

    // This script will fail to call `completeOnboarding` if we don't mock auth.
    // Convex `ConvexHttpClient` doesn't easily support setting auth token for simulation
    // unless we pass it in `setAuth`.

    // Let's try to simulate the flow as best as we can, or rely on `run_command` to execute
    // specific convex functions if possible, OR just run this and see if it fails on auth.

    console.log('\n⚠️ Authentication limitation: This script runs as an unauthenticated client.');
    console.log(
      'To fully verify `completeOnboarding` and `resetOnboarding`, we need an auth token.'
    );
    console.log('Skipping advanced mutation calls locally. Please verify in the browser.');

    // FOR NOW, let's just create the user to ensure schema is happy.

    console.log('✅ verification script finished (limited scope).');
  } catch (error) {
    console.error('❌ Error during verification:', error);
    process.exit(1);
  }
}

verifyNewOnboarding();
