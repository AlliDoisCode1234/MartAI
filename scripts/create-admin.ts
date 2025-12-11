#!/usr/bin/env npx ts-node

/**
 * Admin User Management Script
 *
 * Create or promote users to admin/super_admin roles.
 *
 * Usage:
 *   npx ts-node scripts/create-admin.ts <email> [--super]
 *
 * Examples:
 *   npx ts-node scripts/create-admin.ts john@example.com         # Makes admin
 *   npx ts-node scripts/create-admin.ts john@example.com --super # Makes super_admin
 *   npx ts-node scripts/create-admin.ts --list                   # List all admins
 */

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

const CONVEX_URL = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error('❌ Error: CONVEX_URL or NEXT_PUBLIC_CONVEX_URL environment variable is required');
  console.error('   Set it in your .env.local file or pass it directly:');
  console.error(
    '   CONVEX_URL=https://your-project.convex.cloud npx ts-node scripts/create-admin.ts ...'
  );
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  // List all admins
  if (args.includes('--list')) {
    await listAdmins();
    return;
  }

  const email = args.find((arg) => !arg.startsWith('--'));
  const isSuperAdmin = args.includes('--super');

  if (!email) {
    console.error('❌ Error: Email is required');
    printUsage();
    process.exit(1);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error(`❌ Error: Invalid email format: ${email}`);
    process.exit(1);
  }

  const role = isSuperAdmin ? 'super_admin' : 'admin';

  console.log(`\n🔐 Admin Management Script`);
  console.log(`   Email: ${email}`);
  console.log(`   Role:  ${role}`);
  console.log('');

  try {
    // Check if user exists
    const existingUser = await client.query(api.admin.users.getUserByEmail, { email });

    if (existingUser) {
      // Update existing user's role
      console.log(`👤 Found existing user: ${existingUser.name || email}`);
      console.log(`   Current role: ${existingUser.role || 'user'}`);

      await client.mutation(api.admin.users.updateUserRole, {
        userId: existingUser._id,
        role,
      });

      console.log(`✅ Updated role to: ${role}`);
    } else {
      console.log(`❌ User not found with email: ${email}`);
      console.log('');
      console.log('   The user must first sign up via the app, then you can promote them.');
      console.log('   Or use the Convex dashboard to manually create the user.');
      process.exit(1);
    }

    console.log('');
    console.log('🎉 Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

async function listAdmins() {
  console.log('\n👥 Current Admins:\n');

  try {
    const admins = await client.query(api.admin.users.listAdmins, {});

    if (admins.length === 0) {
      console.log('   No admins found.');
    } else {
      console.log('   Email                          | Role        | Name');
      console.log('   -------------------------------|-------------|----------------');
      for (const admin of admins) {
        const email = (admin.email || '').padEnd(30);
        const role = (admin.role || 'user').padEnd(12);
        const name = admin.name || '-';
        console.log(`   ${email} | ${role}| ${name}`);
      }
    }

    console.log(`\n   Total: ${admins.length} admin(s)`);
  } catch (error) {
    console.error('❌ Error fetching admins:', error);
    process.exit(1);
  }
}

function printUsage() {
  console.log(`
🔐 Admin User Management Script

Usage:
  npx ts-node scripts/create-admin.ts <email> [options]

Options:
  --super    Make the user a super_admin (full access)
  --list     List all current admins
  --help     Show this help message

Examples:
  # Promote user to admin
  npx ts-node scripts/create-admin.ts john@example.com

  # Promote user to super_admin
  npx ts-node scripts/create-admin.ts john@example.com --super

  # List all admins
  npx ts-node scripts/create-admin.ts --list

Roles:
  - user        : Default, can use the app
  - admin       : Can access admin portal, manage keyword library
  - super_admin : Full access, can manage other users
`);
}

main().catch(console.error);
