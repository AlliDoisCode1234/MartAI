import {
  c as d,
  d as u
} from "../_deps/K33OSGN4.js";
import {
  c as t,
  e as m
} from "../_deps/4U34M3I6.js";
import {
  a as l
} from "../_deps/RUVYHBJQ.js";

// convex/lib/engagementMilestones.ts
m();
async function c(e, r, s, i = !0) {
  let o = await e.db.get(r);
  if (!o) return;
  let g = Date.now(), f = o.engagementMilestones || {}, a = {
    keyword: { first: "firstKeywordCreatedAt", total: "totalKeywords" },
    cluster: { first: "firstClusterCreatedAt", total: "totalClusters" },
    brief: { first: "firstBriefCreatedAt", total: "totalBriefs" },
    draft: { first: "firstDraftCreatedAt", total: "totalDrafts" },
    published: { first: "firstContentPublishedAt", total: "totalPublished" },
    ga4: { first: "firstGa4ConnectedAt" },
    gsc: { first: "firstGscConnectedAt" },
    wordpress: { first: "firstWordPressConnectedAt" }
  }[s];
  if (!a) return;
  let n = {};
  if (f[a.first] || (n[a.first] = g), i && a.total) {
    let p = f[a.total] || 0;
    n[a.total] = p + 1;
  }
  Object.keys(n).length > 0 && await e.db.patch(r, {
    engagementMilestones: {
      ...f,
      ...n
    }
  });
}
l(c, "updateMilestone");
var h = u({
  args: {
    userId: t.id("users"),
    milestone: t.union(
      t.literal("keyword"),
      t.literal("cluster"),
      t.literal("brief"),
      t.literal("draft"),
      t.literal("published"),
      t.literal("ga4"),
      t.literal("gsc"),
      t.literal("wordpress")
    ),
    incrementTotal: t.optional(t.boolean())
  },
  handler: /* @__PURE__ */ l(async (e, { userId: r, milestone: s, incrementTotal: i = !0 }) => {
    await c(e, r, s, i);
  }, "handler")
}), C = d({
  args: {
    integration: t.union(t.literal("ga4"), t.literal("gsc"), t.literal("wordpress"))
  },
  handler: /* @__PURE__ */ l(async (e, { integration: r }) => {
    let s = await e.auth.getUserIdentity();
    if (!s) throw new Error("Unauthorized");
    let i = await e.db.query("users").filter((o) => o.eq(o.field("email"), s.email)).first();
    if (!i) throw new Error("User not found");
    await c(e, i._id, r, !1);
  }, "handler")
});
export {
  h as trackEngagement,
  C as trackIntegrationConnected
};
//# sourceMappingURL=engagementMilestones.js.map
