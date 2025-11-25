/**
 * Quick regression test for the prospect intake Convex services.
 *
 * Run with: npx tsx scripts/testProspectService.ts
 *
 * Requires NEXT_PUBLIC_CONVEX_URL or CONVEX_URL to be set.
 */

import { randomUUID } from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;

if (!CONVEX_URL) {
  throw new Error("Please set NEXT_PUBLIC_CONVEX_URL or CONVEX_URL before running this script.");
}

async function main() {
  const client = new ConvexHttpClient(CONVEX_URL);
  const suffix = randomUUID().split("-")[0];
  const email = `prospect+test+${suffix}@martai.com`;

  console.log("🔁 Starting prospect service smoke test...");

  // 1. Create draft
  const prospectId = await client.mutation(api.prospects.prospects.createProspect, {
    firstName: "Service",
    lastName: "Test",
    email,
    companyName: "Service Test Co",
    marketingFrustration: "Need to confirm prospect service pipeline.",
    timeline: "ASAP",
    monthlyRevenue: "$50k - $100k",
    investedBefore: "yes",
    source: "service-test-script",
    status: "draft",
  });

  console.log(`   ✅ Created draft prospect ${prospectId}`);

  // 2. Autosave details (draft)
  await client.mutation(api.prospects.prospects.saveProspectDetails, {
    prospectId,
    businessName: "Service Test Co",
    topPriority: "Validate intake service",
    marketingTried: "SEO, Paid Ads",
    goals: "Launch automated onboarding",
    supportNeeds: ["SEO or Website Traffic", "Marketing Consultation"],
    idealOutcome: "Full prospect intake flow ready for demo",
    hearAbout: "internal",
    urls: [
      { label: "Website", value: "https://example.com" },
      { label: "Deck", value: "https://example.com/deck.pdf" },
    ],
  });

  console.log("   ✅ Draft details saved");

  // 3. Complete intake (new mutation)
  const completion = await client.mutation(
    api.prospects.prospects.completeProspectIntake,
    {
      prospectId,
      businessName: "Service Test Co",
      topPriority: "Validate intake service",
      marketingTried: "SEO, Paid Ads",
      goals: "Launch automated onboarding",
      supportNeeds: ["SEO or Website Traffic", "Marketing Consultation"],
      idealOutcome: "Full prospect intake flow ready for demo",
      hearAbout: "internal",
      urls: [
        { label: "Website", value: "https://example.com" },
        { label: "Deck", value: "https://example.com/deck.pdf" },
      ],
    }
  );

  console.log("   ✅ Intake completion mutation returned:", {
    success: completion.success,
    hasProspect: !!completion.prospect,
    hasDetail: !!completion.detail,
    urls: completion.urls?.length ?? 0,
  });

  // 4. Fetch final record to validate status + persisted fields
  const record = await client.query(api.prospects.prospects.getProspect, { prospectId });
  if (!record) {
    throw new Error("Prospect not found after completion");
  }

  console.log("\n📄 Final persisted record:");
  console.table({
    prospectId: prospectId,
    status: record.prospect.status,
    detailSupportNeeds: record.detail?.supportNeeds?.join(", "),
    urlCount: record.urls?.length ?? 0,
  });

  if (record.prospect.status !== "details_submitted") {
    throw new Error(`Unexpected status ${record.prospect.status}`);
  }

  console.log("\n✅ Prospect service test passed!");
}

main().catch((error) => {
  console.error("\n❌ Prospect service test failed:", error);
  process.exit(1);
});

