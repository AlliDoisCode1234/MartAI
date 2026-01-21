import {
  a as d,
  c as s
} from "../_deps/K33OSGN4.js";
import {
  c as t,
  e as u
} from "../_deps/4U34M3I6.js";
import {
  a
} from "../_deps/RUVYHBJQ.js";

// convex/projects/clients.ts
u();
var c = s({
  args: {
    companyName: t.string(),
    website: t.string(),
    industry: t.string(),
    targetAudience: t.string(),
    monthlyRevenueGoal: t.optional(t.string()),
    userId: t.string()
  },
  handler: /* @__PURE__ */ a(async (n, e) => {
    let i = await n.db.query("clients").withIndex("by_user", (r) => r.eq("userId", e.userId)).filter((r) => r.eq(r.field("website"), e.website)).first();
    return i ? await n.db.patch(i._id, {
      companyName: e.companyName,
      industry: e.industry,
      targetAudience: e.targetAudience,
      monthlyRevenueGoal: e.monthlyRevenueGoal,
      updatedAt: Date.now()
    }) : await n.db.insert("clients", {
      companyName: e.companyName,
      website: e.website,
      industry: e.industry,
      targetAudience: e.targetAudience,
      monthlyRevenueGoal: e.monthlyRevenueGoal,
      userId: e.userId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }, "handler")
}), y = d({
  args: { clientId: t.id("clients") },
  handler: /* @__PURE__ */ a(async (n, e) => await n.db.get(e.clientId), "handler")
}), m = d({
  args: { userId: t.string() },
  handler: /* @__PURE__ */ a(async (n, e) => await n.db.query("clients").withIndex("by_user", (i) => i.eq("userId", e.userId)).collect(), "handler")
});
export {
  c as createClient,
  y as getClient,
  m as getClientsByUser
};
//# sourceMappingURL=clients.js.map
