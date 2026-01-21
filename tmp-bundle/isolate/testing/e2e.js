import {
  b as a,
  e as w
} from "../_deps/GTU362KY.js";
import {
  b as g,
  d as l,
  f as m
} from "../_deps/K33OSGN4.js";
import {
  c as n,
  e as p
} from "../_deps/4U34M3I6.js";
import {
  a as r
} from "../_deps/RUVYHBJQ.js";

// convex/testing/e2e.ts
p();
w();
var y = l({
  args: { name: n.string(), email: n.string() },
  handler: /* @__PURE__ */ r(async (e, t) => await e.db.insert("users", {
    name: t.name,
    email: t.email,
    role: "admin",
    onboardingStatus: "completed",
    createdAt: Date.now(),
    updatedAt: Date.now()
  }), "handler")
}), b = l({
  args: { userId: n.id("users"), name: n.string(), url: n.string() },
  handler: /* @__PURE__ */ r(async (e, t) => await e.db.insert("projects", {
    userId: t.userId,
    name: t.name,
    websiteUrl: t.url,
    industry: "SaaS",
    projectType: "own",
    urlLocked: !0,
    serpAnalysisUsed: !1,
    targetAudience: "Business Owners",
    businessGoals: "Growth",
    createdAt: Date.now(),
    updatedAt: Date.now()
  }), "handler")
}), h = g({
  args: { contentPieceId: n.id("contentPieces") },
  handler: /* @__PURE__ */ r(async (e, t) => await e.db.get(t.contentPieceId), "handler")
}), T = m({
  args: { targetUrl: n.string() },
  handler: /* @__PURE__ */ r(async (e, t) => {
    console.log("--- STARTING E2E VALIDATION ---");
    let u = `validator_${Date.now()}@test.com`, o = await e.runMutation(a.testing.e2e.createUser, {
      name: "Launch Validator",
      email: u
    });
    console.log(`[E2E] User created: ${o} (${u})`), await e.runMutation(a.subscriptions.subscriptions.upsertSubscription, {
      userId: o,
      planTier: "team",
      status: "active",
      oneTimeFeePaid: !1,
      startsAt: Date.now()
    }), console.log("[E2E] Subscription provisioned: Team Tier");
    let i = await e.runMutation(a.testing.e2e.createProject, {
      userId: o,
      name: "Validator Project",
      url: t.targetUrl
    });
    console.log(`[E2E] Project created: ${i}`), await e.runAction(
      a.contentCalendar.generateCalendar.triggerOnboardingCalendarGeneration,
      {
        projectId: i,
        hasGa4: !1,
        hasGsc: !1
      }
    ), console.log("[E2E] Calendar generated");
    let d = `The Future of AI in SaaS: Why ${t.targetUrl} Matters`;
    console.log(`[E2E] Generating article: "${d}"... (This takes time)`);
    let c = await e.runAction(a.contentGeneration.generateContentInternal, {
      projectId: i,
      userId: o,
      contentType: "blog",
      title: d,
      keywords: ["ai future", "saas innovation", "automation"]
    });
    console.log(`[E2E] Article generated: ${c}`);
    let s = await e.runQuery(a.testing.e2e.getContent, { contentPieceId: c });
    return {
      step: "COMPLETE",
      articleId: c,
      content: s?.content,
      seoScore: s?.seoScore,
      wordCount: s?.wordCount,
      metrics: s?.qualityMetrics
    };
  }, "handler")
});
export {
  b as createProject,
  y as createUser,
  h as getContent,
  T as validateLaunch
};
//# sourceMappingURL=e2e.js.map
