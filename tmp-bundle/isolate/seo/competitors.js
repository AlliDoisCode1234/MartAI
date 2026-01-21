import {
  c as d
} from "../_deps/MF3OI5Q7.js";
import "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a,
  c as n
} from "../_deps/K33OSGN4.js";
import {
  c as e,
  e as c
} from "../_deps/4U34M3I6.js";
import {
  a as i
} from "../_deps/RUVYHBJQ.js";

// convex/seo/competitors.ts
c();
var I = n({
  args: {
    projectId: e.id("projects"),
    domain: e.string(),
    priority: e.optional(e.number()),
    notes: e.optional(e.string())
  },
  handler: /* @__PURE__ */ i(async (o, t) => {
    await d(o, t.projectId, "editor");
    let r = await o.db.query("competitors").withIndex("by_project", (p) => p.eq("projectId", t.projectId)).filter((p) => p.eq(p.field("domain"), t.domain)).first();
    return r ? await o.db.patch(r._id, {
      priority: t.priority,
      notes: t.notes,
      updatedAt: Date.now()
    }) : await o.db.insert("competitors", {
      projectId: t.projectId,
      domain: t.domain,
      priority: t.priority || 3,
      notes: t.notes,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }, "handler")
}), y = a({
  args: { projectId: e.id("projects") },
  handler: /* @__PURE__ */ i(async (o, t) => (await d(o, t.projectId, "viewer"), await o.db.query("competitors").withIndex("by_project", (r) => r.eq("projectId", t.projectId)).order("desc").collect()), "handler")
}), j = n({
  args: {
    competitorId: e.id("competitors"),
    priority: e.number()
  },
  handler: /* @__PURE__ */ i(async (o, t) => {
    let r = await o.db.get(t.competitorId);
    if (!r) throw new Error("Competitor not found");
    await d(o, r.projectId, "editor"), await o.db.patch(t.competitorId, {
      priority: t.priority,
      updatedAt: Date.now()
    });
  }, "handler")
}), u = n({
  args: { competitorId: e.id("competitors") },
  handler: /* @__PURE__ */ i(async (o, t) => {
    let r = await o.db.get(t.competitorId);
    if (!r) throw new Error("Competitor not found");
    await d(o, r.projectId, "editor"), await o.db.delete(t.competitorId);
  }, "handler")
});
export {
  I as addCompetitor,
  y as getCompetitorsByProject,
  u as removeCompetitor,
  j as updateCompetitorPriority
};
//# sourceMappingURL=competitors.js.map
