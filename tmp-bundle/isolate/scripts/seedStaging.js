import {
  c as d
} from "../_deps/K33OSGN4.js";
import "../_deps/4U34M3I6.js";
import {
  a as n
} from "../_deps/RUVYHBJQ.js";

// convex/scripts/seedStaging.ts
var m = d({
  args: {},
  handler: /* @__PURE__ */ n(async (e) => {
    let t = await e.db.query("users").filter((r) => r.eq(r.field("email"), "test@phoo.ai")).first();
    if (t)
      return {
        message: "Staging already seeded",
        userId: t._id,
        alreadySeeded: !0
      };
    let s = await e.db.insert("users", {
      email: "test@phoo.ai",
      name: "Test User",
      membershipTier: "growth",
      role: "user",
      createdAt: Date.now(),
      onboardingStatus: "completed"
    }), a = await e.db.insert("projects", {
      userId: s,
      name: "Test Project - Staging",
      websiteUrl: "https://example.com",
      industry: "technology",
      projectType: "own",
      createdAt: Date.now(),
      updatedAt: Date.now()
    }), o = await e.db.insert("users", {
      email: "admin@phoo.ai",
      name: "Admin User",
      membershipTier: "enterprise",
      role: "super_admin",
      createdAt: Date.now(),
      onboardingStatus: "completed"
    }), i = await e.db.insert("users", {
      email: "viewer@phoo.ai",
      name: "Viewer User",
      membershipTier: "starter",
      role: "viewer",
      createdAt: Date.now(),
      onboardingStatus: "completed"
    });
    return {
      message: "Staging data seeded successfully",
      testUserId: s,
      testProjectId: a,
      adminUserId: o,
      viewerUserId: i,
      alreadySeeded: !1
    };
  }, "handler")
}), c = d({
  args: {},
  handler: /* @__PURE__ */ n(async (e) => {
    let t = process.env.SITE_URL ?? "";
    if (t.includes("phoo.ai") && !t.includes("staging"))
      throw new Error("SAFETY: Cannot clear data on production deployment!");
    let s = ["test@phoo.ai", "admin@phoo.ai", "viewer@phoo.ai"], a = 0;
    for (let o of s) {
      let i = await e.db.query("users").filter((r) => r.eq(r.field("email"), o)).first();
      i && (await e.db.delete(i._id), a++);
    }
    return {
      message: `Cleared ${a} seeded users`,
      deletedCount: a
    };
  }, "handler")
});
export {
  c as clearStagingData,
  m as seedTestData
};
//# sourceMappingURL=seedStaging.js.map
