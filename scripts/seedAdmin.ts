/**
 * Script to seed an admin user
 * Run with: npx tsx scripts/seedAdmin.ts
 * 
 * Or use the Convex dashboard to call the internal mutation directly
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;

if (!CONVEX_URL) {
  console.error("ERROR: CONVEX_URL environment variable not set");
  console.error("Please set NEXT_PUBLIC_CONVEX_URL or CONVEX_URL");
  process.exit(1);
}

async function seedAdmin() {
  const client = new ConvexHttpClient(CONVEX_URL);

  const adminEmail = process.env.ADMIN_EMAIL || "admin@martai.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminName = process.env.ADMIN_NAME || "Admin User";

  console.log(`Creating admin user: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);

  try {
    const result = await client.mutation(api.auth.seed.createAdminUser, {
      email: adminEmail,
      password: adminPassword,
      name: adminName,
    });

    console.log("✅ Admin user created successfully!");
    console.log("User ID:", result.userId);
    console.log("Email:", result.email);
    console.log("Role:", result.role);
    console.log("\nYou can now login with:");
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      console.log("ℹ️  Admin user already exists");
      console.log(`Email: ${adminEmail}`);
    } else {
      console.error("❌ Error creating admin user:", error.message);
      process.exit(1);
    }
  }
}

seedAdmin();

