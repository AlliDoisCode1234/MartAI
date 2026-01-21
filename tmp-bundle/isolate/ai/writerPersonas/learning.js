import {
  b as p,
  e as m
} from "../../_deps/GTU362KY.js";
import {
  d as u
} from "../../_deps/K33OSGN4.js";
import {
  c as t,
  e as f
} from "../../_deps/4U34M3I6.js";
import {
  a as l
} from "../../_deps/RUVYHBJQ.js";

// convex/ai/writerPersonas/learning.ts
f();
m();
var P = u({
  args: {
    personaId: t.id("aiWriterPersonas"),
    contentPieceId: t.id("contentPieces"),
    feedback: t.union(t.literal("approved"), t.literal("edited"), t.literal("rejected")),
    originalContent: t.optional(t.string()),
    editedContent: t.optional(t.string()),
    rejectionReason: t.optional(t.string()),
    seoScore: t.optional(t.number())
  },
  handler: /* @__PURE__ */ l(async (o, e) => {
    if (!await o.db.get(e.personaId)) return;
    let n;
    e.feedback === "edited" && e.originalContent && e.editedContent && (n = w(e.originalContent, e.editedContent)), await o.runMutation(p.ai.writerPersonas.index.updateMetrics, {
      personaId: e.personaId,
      outcome: e.feedback,
      seoScore: e.seoScore,
      editDistance: n
    }), e.feedback === "rejected" && e.rejectionReason && await R(o, e.personaId, e.rejectionReason);
  }, "handler")
});
async function R(o, e, r) {
  let n = await o.db.get(e);
  if (!n) return;
  let s = n.learnedRules || [], d = s.find(
    (i) => i.rule.toLowerCase().includes(r.toLowerCase().slice(0, 20))
  );
  if (d) {
    let i = s.map(
      (a) => a === d ? { ...a, confidence: Math.min(1, (a.confidence || 0.5) + 0.1) } : a
    );
    await o.db.patch(e, { learnedRules: i });
  } else {
    let i = {
      rule: `Avoid: ${r}`,
      source: "rejection",
      confidence: 0.6,
      learnedAt: Date.now(),
      appliedCount: 0
    };
    await o.db.patch(e, {
      learnedRules: [...s, i]
    });
  }
}
l(R, "learnFromRejection");
function w(o, e) {
  let r = o.toLowerCase(), n = e.toLowerCase(), s = r.split(/\s+/), d = n.split(/\s+/), i = 0, a = Math.max(s.length, d.length);
  for (let c = 0; c < a; c++)
    s[c] !== d[c] && i++;
  return a > 0 ? i / a * 100 : 0;
}
l(w, "calculateEditDistance");
var j = u({
  args: {
    personaId: t.id("aiWriterPersonas")
  },
  handler: /* @__PURE__ */ l(async (o, e) => {
    let r = await o.db.get(e.personaId);
    if (!r || !r.metrics) return;
    let { metrics: n, learnedRules: s = [] } = r, d = s.filter((c) => (c.confidence ?? 0.5) >= 0.3), i = [];
    n.rejectedCount > 0 && n.rejectedCount / n.totalGenerated > 0.2 && i.push("High rejection rate - needs more training");
    let a = [];
    n.approvedCount > 5 && a.push("blog-post"), await o.db.patch(e.personaId, {
      learnedRules: d,
      metrics: {
        ...n,
        weakAreas: i,
        topPerformingTypes: a
      },
      updatedAt: Date.now()
    });
  }, "handler")
}), I = u({
  args: {},
  handler: /* @__PURE__ */ l(async (o) => {
    let e = await o.db.query("aiWriterPersonas").withIndex("by_status", (n) => n.eq("status", "active")).collect(), r = 0;
    for (let n of e)
      n.metrics && n.metrics.totalGenerated >= 5 && (await o.runMutation(p.ai.writerPersonas.learning.evolvePersona, {
        personaId: n._id
      }), r++);
    return console.log(`[PersonaEvolution] Evolved ${r} personas`), { evolvedCount: r };
  }, "handler")
});
export {
  I as evolveAllPersonas,
  j as evolvePersona,
  P as recordFeedback
};
//# sourceMappingURL=learning.js.map
