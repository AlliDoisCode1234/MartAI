import {
  b as m
} from "../_deps/HXEST5WA.js";
import {
  c as l,
  d as w
} from "../_deps/MF3OI5Q7.js";
import {
  a as u
} from "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a as d,
  c
} from "../_deps/K33OSGN4.js";
import {
  c as e,
  e as b
} from "../_deps/4U34M3I6.js";
import {
  a as i
} from "../_deps/RUVYHBJQ.js";

// convex/projects/projects.ts
b();
var A = c({
  args: {
    name: e.string(),
    websiteUrl: e.string(),
    industry: e.optional(e.string()),
    // Phase 3: Organization support
    organizationId: e.optional(e.id("organizations")),
    // PROJ-001: Project type (defaults to 'own')
    projectType: e.optional(e.union(e.literal("own"), e.literal("competitor"))),
    // Context fields from onboarding
    targetAudience: e.optional(e.string()),
    businessGoals: e.optional(e.string()),
    competitors: e.optional(e.array(e.string()))
  },
  handler: /* @__PURE__ */ i(async (r, t) => {
    let o = await u.getUserId(r);
    if (!o)
      throw new Error("Unauthorized: User must be logged in to create a project");
    let n = await r.db.get(o);
    if (!n)
      throw new Error("User not found");
    let a = await r.db.query("projects").withIndex("by_user", (g) => g.eq("userId", o)).collect(), s = n.membershipTier ?? "none", p = m(s)?.features.maxUrls ?? 0;
    if (a.length >= p)
      throw p === 0 ? new Error(
        "LIMIT_REACHED: Payment required. Please subscribe to a plan to start MartAI."
      ) : new Error(
        `LIMIT_REACHED: Upgrade your plan to manage more websites. Current limit: ${p}`
      );
    return await r.db.insert("projects", {
      userId: o,
      organizationId: t.organizationId,
      name: t.name,
      websiteUrl: t.websiteUrl,
      industry: t.industry,
      // PROJ-001: Set project type and lock URL
      projectType: t.projectType ?? "own",
      urlLocked: !0,
      // URL cannot be changed after creation
      serpAnalysisUsed: !1,
      // Track SERP quota usage
      targetAudience: t.targetAudience,
      businessGoals: t.businessGoals,
      competitors: t.competitors,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }, "handler")
}), z = d({
  args: { userId: e.id("users") },
  handler: /* @__PURE__ */ i(async (r, t) => await r.db.query("projects").withIndex("by_user", (o) => o.eq("userId", t.userId)).collect(), "handler")
}), E = d({
  args: {},
  handler: /* @__PURE__ */ i(async (r) => {
    let t = await u.getUserId(r);
    return t ? await r.db.query("projects").withIndex("by_user", (o) => o.eq("userId", t)).collect() : [];
  }, "handler")
}), D = d({
  args: { organizationId: e.id("organizations") },
  handler: /* @__PURE__ */ i(async (r, t) => {
    let o = await u.getUserId(r);
    return o ? await r.db.query("teamMembers").withIndex(
      "by_user_org",
      (a) => a.eq("userId", o).eq("organizationId", t.organizationId)
    ).first() ? await r.db.query("projects").withIndex("by_org", (a) => a.eq("organizationId", t.organizationId)).collect() : [] : [];
  }, "handler")
}), P = d({
  args: { projectId: e.id("projects") },
  handler: /* @__PURE__ */ i(async (r, t) => await r.db.get(t.projectId), "handler")
}), T = c({
  args: {
    projectId: e.id("projects"),
    name: e.optional(e.string()),
    websiteUrl: e.optional(e.string()),
    industry: e.optional(e.string()),
    organizationId: e.optional(e.id("organizations")),
    targetAudience: e.optional(e.string()),
    businessGoals: e.optional(e.string()),
    competitors: e.optional(e.array(e.string())),
    // Generation status for onboarding visibility
    generationStatus: e.optional(
      e.union(e.literal("idle"), e.literal("generating"), e.literal("complete"), e.literal("error"))
    )
  },
  handler: /* @__PURE__ */ i(async (r, t) => {
    if (await l(r, t.projectId, "editor"), t.websiteUrl !== void 0 && (await r.db.get(t.projectId))?.urlLocked)
      throw new Error("URL_LOCKED: Website URL cannot be changed after project creation.");
    let o = { updatedAt: Date.now() };
    return t.name !== void 0 && (o.name = t.name), t.websiteUrl !== void 0 && (o.websiteUrl = t.websiteUrl), t.industry !== void 0 && (o.industry = t.industry), t.generationStatus !== void 0 && (o.generationStatus = t.generationStatus), await r.db.patch(t.projectId, o);
  }, "handler")
}), _ = c({
  args: { projectId: e.id("projects") },
  handler: /* @__PURE__ */ i(async (r, t) => {
    await l(r, t.projectId, "admin"), await r.db.delete(t.projectId);
  }, "handler")
}), L = c({
  args: {
    name: e.string(),
    websiteUrl: e.string()
  },
  handler: /* @__PURE__ */ i(async (r, t) => {
    await w(r);
    let o = "test-dogfood@martai.com", n = await r.db.query("users").withIndex("email", (s) => s.eq("email", o)).first();
    if (!n) {
      let s = await r.db.insert("users", {
        email: o,
        name: "Dogfood Tester",
        role: "admin",
        membershipTier: "enterprise",
        // Startup with high limits
        onboardingStatus: "completed",
        createdAt: Date.now()
      });
      n = await r.db.get(s);
    }
    if (!n) throw new Error("Failed to create test user");
    return await r.db.insert("projects", {
      userId: n._id,
      name: t.name,
      websiteUrl: t.websiteUrl,
      industry: "Testing",
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }, "handler")
});
export {
  A as createProject,
  L as createTestProject,
  _ as deleteProject,
  P as getProjectById,
  D as getProjectsByOrganization,
  z as getProjectsByUser,
  E as list,
  T as updateProject
};
//# sourceMappingURL=projects.js.map
