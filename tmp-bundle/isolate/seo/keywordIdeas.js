import {
  a as c,
  c as s
} from "../_deps/K33OSGN4.js";
import {
  c as t,
  e as I
} from "../_deps/4U34M3I6.js";
import {
  a as n
} from "../_deps/RUVYHBJQ.js";

// convex/seo/keywordIdeas.ts
I();
var u = {
  prospectId: t.optional(t.id("prospects")),
  projectId: t.optional(t.id("projects")),
  primaryKeyword: t.string(),
  supportingKeywords: t.optional(t.array(t.string())),
  intent: t.optional(t.string()),
  trafficPotential: t.optional(t.number()),
  kdScore: t.optional(t.number()),
  cpc: t.optional(t.number()),
  entities: t.optional(t.array(t.string())),
  serpNotes: t.optional(t.string()),
  priority: t.optional(t.string()),
  status: t.optional(t.string())
};
async function y(o, e) {
  let r = Date.now();
  return await o.db.insert("keywordIdeas", {
    prospectId: e.prospectId,
    projectId: e.projectId,
    primaryKeyword: e.primaryKeyword,
    supportingKeywords: e.supportingKeywords ?? [],
    intent: e.intent,
    trafficPotential: e.trafficPotential,
    kdScore: e.kdScore,
    cpc: e.cpc,
    entities: e.entities ?? [],
    serpNotes: e.serpNotes,
    priority: e.priority,
    status: e.status ?? "candidate",
    createdAt: r,
    updatedAt: r
  });
}
n(y, "insertIdea");
var b = s({
  args: u,
  handler: /* @__PURE__ */ n(async (o, e) => await y(o, e), "handler")
}), K = s({
  args: {
    ideaId: t.optional(t.id("keywordIdeas")),
    ...u
  },
  handler: /* @__PURE__ */ n(async (o, e) => {
    let { ideaId: r, ...d } = e;
    if (!r)
      return await y(o, d);
    if (!await o.db.get(r))
      throw new Error("Keyword idea not found");
    let a = { updatedAt: Date.now() };
    for (let [w, p] of Object.entries(d))
      p !== void 0 && (a[w] = p);
    return await o.db.patch(r, a), r;
  }, "handler")
}), j = c({
  args: {
    prospectId: t.optional(t.id("prospects")),
    projectId: t.optional(t.id("projects")),
    status: t.optional(t.string())
  },
  handler: /* @__PURE__ */ n(async (o, e) => {
    let r = o.db.query("keywordIdeas").order("desc");
    e.prospectId ? r = o.db.query("keywordIdeas").withIndex("by_prospect", (i) => i.eq("prospectId", e.prospectId)).order("desc") : e.projectId && (r = o.db.query("keywordIdeas").withIndex("by_project", (i) => i.eq("projectId", e.projectId)).order("desc"));
    let d = await r.collect();
    return e.status ? d.filter((i) => i.status === e.status) : d;
  }, "handler")
}), k = s({
  args: {
    ideaId: t.id("keywordIdeas"),
    status: t.string()
  },
  handler: /* @__PURE__ */ n(async (o, e) => {
    let { ideaId: r, status: d } = e;
    if (!await o.db.get(r))
      throw new Error("Keyword idea not found");
    return await o.db.patch(r, { status: d, updatedAt: Date.now() }), { success: !0 };
  }, "handler")
});
export {
  b as createKeywordIdea,
  j as listKeywordIdeas,
  k as updateKeywordIdeaStatus,
  K as upsertKeywordIdea
};
//# sourceMappingURL=keywordIdeas.js.map
