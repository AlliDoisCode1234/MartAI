import {
  b as d,
  e as h
} from "../_deps/GTU362KY.js";
import {
  b as m,
  d as E,
  e as C,
  f as T
} from "../_deps/K33OSGN4.js";
import {
  c as n,
  e as A
} from "../_deps/4U34M3I6.js";
import {
  a as l
} from "../_deps/RUVYHBJQ.js";

// convex/testing/betaUserFlow.ts
A();
h();
var $ = [
  "homepage",
  "about",
  "service",
  "blog",
  "blogVersus",
  "leadMagnet",
  "paidProduct",
  "landing",
  "areasWeServe",
  "employment",
  "mentorship",
  "donate",
  "events",
  "partner",
  "program",
  "contentRefresh",
  "blogVideo"
], f = ["blog", "service", "landing"], R = E({
  args: { email: n.string(), name: n.optional(n.string()) },
  handler: /* @__PURE__ */ l(async (t, e) => {
    let o = Date.now(), r = 4320 * 60 * 60 * 1e3;
    return await t.db.insert("users", {
      email: e.email,
      name: e.name || "E2E Beta Tester",
      role: "user",
      onboardingStatus: "completed",
      accountStatus: "active",
      acquisitionSource: "waitlist_beta",
      isBetaUser: !0,
      betaExpiresAt: o + r,
      membershipTier: "solo",
      createdAt: o,
      updatedAt: o
    });
  }, "handler")
}), _ = E({
  args: {
    userId: n.id("users"),
    name: n.string(),
    url: n.string(),
    industry: n.string()
  },
  handler: /* @__PURE__ */ l(async (t, e) => {
    let o = Date.now();
    return await t.db.insert("projects", {
      userId: e.userId,
      name: e.name,
      websiteUrl: e.url,
      industry: e.industry,
      projectType: "own",
      urlLocked: !0,
      serpAnalysisUsed: !1,
      targetAudience: "Business Owners",
      businessGoals: "Growth",
      createdAt: o,
      updatedAt: o
    });
  }, "handler")
}), B = m({
  args: { contentPieceId: n.id("contentPieces") },
  handler: /* @__PURE__ */ l(async (t, e) => await t.db.get(e.contentPieceId), "handler")
}), M = m({
  args: { projectId: n.id("projects") },
  handler: /* @__PURE__ */ l(async (t, e) => await t.db.query("contentPieces").withIndex("by_project", (o) => o.eq("projectId", e.projectId)).collect(), "handler")
}), v = E({
  args: { userId: n.id("users"), projectId: n.id("projects") },
  handler: /* @__PURE__ */ l(async (t, e) => {
    let o = await t.db.query("contentPieces").withIndex("by_project", (i) => i.eq("projectId", e.projectId)).collect();
    for (let i of o)
      await t.db.delete(i._id);
    await t.db.delete(e.projectId);
    let r = await t.db.query("subscriptions").withIndex("by_user", (i) => i.eq("userId", e.userId)).first();
    return r && await t.db.delete(r._id), await t.db.delete(e.userId), { cleaned: !0 };
  }, "handler")
}), k = T({
  args: {
    projectId: n.id("projects"),
    userId: n.id("users"),
    contentType: n.string()
  },
  handler: /* @__PURE__ */ l(async (t, e) => {
    let o = e.contentType, r = `E2E Test: ${o} - ${Date.now()}`, i = ["test keyword", "e2e validation", o];
    try {
      console.log(`[E2E] Generating ${o}...`);
      let s = await t.runAction(
        d.contentGeneration.generateContentInternal,
        {
          projectId: e.projectId,
          userId: e.userId,
          contentType: o,
          title: r,
          keywords: i
        }
      ), p = await t.runQuery(d.testing.betaUserFlow.getContentPiece, {
        contentPieceId: s
      }), c = p?.seoScore || 0, g = p?.wordCount || 0, u = c >= 90;
      return console.log(`[E2E] ${o}: Score=${c}, Words=${g}, Passed=${u}`), {
        contentType: o,
        contentPieceId: s,
        title: r,
        seoScore: c,
        wordCount: g,
        passed: u
      };
    } catch (s) {
      let p = s instanceof Error ? s.message : "Unknown error";
      return console.error(`[E2E] ${o} FAILED:`, p), {
        contentType: o,
        contentPieceId: "",
        title: r,
        seoScore: 0,
        wordCount: 0,
        passed: !1,
        error: p
      };
    }
  }, "handler")
}), q = C({
  args: {
    targetUrl: n.optional(n.string()),
    industry: n.optional(n.string()),
    smokeTest: n.optional(n.boolean())
    // Only test 3 types instead of 17
  },
  handler: /* @__PURE__ */ l(async (t, e) => {
    let o = Date.now(), r = e.targetUrl || "https://test-company.com", i = e.industry || "SaaS", s = e.smokeTest ? f : $;
    console.log("=".repeat(60)), console.log("STARTING BETA USER E2E VALIDATION"), console.log(`Content Types: ${s.length} (${e.smokeTest ? "Smoke" : "Full"})`), console.log("=".repeat(60));
    let p = `e2e_beta_${Date.now()}@test.phoo.ai`, c = await t.runMutation(d.testing.betaUserFlow.createBetaUser, {
      email: p,
      name: "E2E Beta Tester"
    });
    console.log(`[E2E] Step 1: Beta User created: ${c}`), await t.runMutation(d.subscriptions.subscriptions.upsertSubscription, {
      userId: c,
      planTier: "solo",
      status: "active",
      oneTimeFeePaid: !1,
      startsAt: Date.now()
    }), console.log("[E2E] Step 2: Solo subscription provisioned");
    let g = await t.runMutation(d.testing.betaUserFlow.createTestProject, {
      userId: c,
      name: "E2E Validation Project",
      url: r,
      industry: i
    });
    console.log(`[E2E] Step 3: Project created: ${g}`), console.log(`[E2E] Step 4: Generating ${s.length} content types...`);
    let u = [];
    for (let a of s) {
      let j = await t.runAction(d.testing.betaUserFlow.generateSingleContentType, {
        projectId: g,
        userId: c,
        contentType: a
      });
      u.push(j);
    }
    let w = await t.runQuery(d.testing.betaUserFlow.getProjectContentPieces, {
      projectId: g
    });
    console.log(`[E2E] Step 5: Content library has ${w.length} pieces`);
    let I = u.filter((a) => a.passed).length, y = u.filter((a) => !a.passed).length, b = y === 0 ? "PASSED" : I === 0 ? "FAILED" : "PARTIAL", S = Date.now() - o, P = `
=== E2E BETA USER FLOW RESULTS ===
Status: ${b}
Duration: ${(S / 1e3).toFixed(1)}s
Content Types Tested: ${s.length}
Passed (Score >= 90): ${I}
Failed: ${y}
Library Total: ${w.length}

${u.map((a) => `  ${a.passed ? "\u2713" : "\u2717"} ${a.contentType}: ${a.seoScore}/100 (${a.wordCount} words)`).join(`
`)}
===================================
`;
    return console.log(P), {
      status: b,
      userId: c,
      projectId: g,
      totalTypes: s.length,
      passedCount: I,
      failedCount: y,
      results: u,
      summary: P,
      durationMs: S
    };
  }, "handler")
}), G = T({
  args: {
    userId: n.id("users"),
    projectId: n.id("projects")
  },
  handler: /* @__PURE__ */ l(async (t, e) => (console.log("[E2E] Cleaning up test data..."), await t.runMutation(d.testing.betaUserFlow.cleanupTestData, {
    userId: e.userId,
    projectId: e.projectId
  }), console.log("[E2E] Cleanup complete"), { cleaned: !0 }), "handler")
});
export {
  G as cleanupBetaE2E,
  v as cleanupTestData,
  R as createBetaUser,
  _ as createTestProject,
  k as generateSingleContentType,
  B as getContentPiece,
  M as getProjectContentPieces,
  q as runBetaE2E
};
//# sourceMappingURL=betaUserFlow.js.map
