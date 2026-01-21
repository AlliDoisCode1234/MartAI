import {
  a as g,
  c as l,
  d as y
} from "./K33OSGN4.js";
import {
  c as e,
  e as f
} from "./4U34M3I6.js";
import {
  a as s
} from "./RUVYHBJQ.js";

// convex/ai/writerPersonas/index.ts
f();
var d = {
  name: "Content Expert",
  description: "AI-powered content writer that learns your brand voice",
  brandVoice: {
    tone: "professional",
    style: "educational",
    vocabulary: [],
    avoidWords: [],
    sentenceStyle: "varied"
  },
  seoPreferences: {
    keywordDensity: "moderate",
    internalLinkingStyle: "moderate",
    ctaStyle: "direct",
    preferredContentLength: "standard"
  },
  metrics: {
    totalGenerated: 0,
    approvedCount: 0,
    editedCount: 0,
    rejectedCount: 0
  }
};
var I = l({
  args: {
    projectId: e.id("projects")
  },
  handler: /* @__PURE__ */ s(async (r, t) => {
    let i = await r.auth.getUserIdentity();
    if (!i) throw new Error("Not authenticated");
    let n = await r.db.query("aiWriterPersonas").withIndex(
      "by_project_status",
      (p) => p.eq("projectId", t.projectId).eq("status", "active")
    ).first();
    if (n)
      return n;
    let o = await r.db.get(t.projectId);
    if (!o) throw new Error("Project not found");
    let a = await r.db.query("users").filter((p) => p.eq(p.field("email"), i.email)).first(), c = Date.now(), u = await r.db.insert("aiWriterPersonas", {
      projectId: t.projectId,
      createdBy: a?._id,
      name: d.name,
      description: d.description,
      brandVoice: d.brandVoice,
      seoPreferences: d.seoPreferences,
      metrics: d.metrics,
      industry: o.industry,
      targetAudience: o.targetAudience,
      status: "training",
      trainingProgress: 0,
      createdAt: c,
      updatedAt: c
    });
    return await r.db.get(u);
  }, "handler")
}), b = y({
  args: {
    projectId: e.id("projects"),
    userId: e.id("users")
  },
  handler: /* @__PURE__ */ s(async (r, t) => {
    let i = await r.db.query("aiWriterPersonas").withIndex(
      "by_project_status",
      (c) => c.eq("projectId", t.projectId).eq("status", "active")
    ).first();
    if (i)
      return i;
    let n = await r.db.get(t.projectId);
    if (!n) throw new Error("Project not found");
    let o = Date.now(), a = await r.db.insert("aiWriterPersonas", {
      projectId: t.projectId,
      createdBy: t.userId,
      name: d.name,
      description: d.description,
      brandVoice: d.brandVoice,
      seoPreferences: d.seoPreferences,
      metrics: d.metrics,
      industry: n.industry,
      targetAudience: n.targetAudience,
      status: "training",
      trainingProgress: 0,
      createdAt: o,
      updatedAt: o
    });
    return await r.db.get(a);
  }, "handler")
}), P = g({
  args: {
    projectId: e.id("projects")
  },
  handler: /* @__PURE__ */ s(async (r, t) => await r.auth.getUserIdentity() ? await r.db.query("aiWriterPersonas").withIndex(
    "by_project_status",
    (n) => n.eq("projectId", t.projectId).eq("status", "active")
  ).first() : null, "handler")
}), j = g({
  args: {
    projectId: e.id("projects")
  },
  handler: /* @__PURE__ */ s(async (r, t) => await r.auth.getUserIdentity() ? await r.db.query("aiWriterPersonas").withIndex("by_project", (n) => n.eq("projectId", t.projectId)).collect() : [], "handler")
}), m = l({
  args: {
    personaId: e.id("aiWriterPersonas"),
    name: e.optional(e.string()),
    description: e.optional(e.string()),
    brandVoice: e.optional(
      e.object({
        tone: e.optional(e.string()),
        style: e.optional(e.string()),
        vocabulary: e.optional(e.array(e.string())),
        avoidWords: e.optional(e.array(e.string())),
        sentenceStyle: e.optional(e.string())
      })
    ),
    industry: e.optional(e.string()),
    targetAudience: e.optional(e.string()),
    competitorContext: e.optional(e.string()),
    uniqueSellingPoints: e.optional(e.array(e.string())),
    seoPreferences: e.optional(
      e.object({
        keywordDensity: e.optional(e.string()),
        internalLinkingStyle: e.optional(e.string()),
        ctaStyle: e.optional(e.string()),
        preferredContentLength: e.optional(e.string())
      })
    )
  },
  handler: /* @__PURE__ */ s(async (r, t) => {
    if (!await r.auth.getUserIdentity()) throw new Error("Not authenticated");
    if (!await r.db.get(t.personaId)) throw new Error("Persona not found");
    let { personaId: o, ...a } = t;
    return await r.db.patch(o, {
      ...a,
      updatedAt: Date.now()
    }), await r.db.get(o);
  }, "handler")
}), E = l({
  args: {
    personaId: e.id("aiWriterPersonas"),
    rule: e.string()
  },
  handler: /* @__PURE__ */ s(async (r, t) => {
    if (!await r.auth.getUserIdentity()) throw new Error("Not authenticated");
    let n = await r.db.get(t.personaId);
    if (!n) throw new Error("Persona not found");
    let o = n.learnedRules || [], a = {
      rule: t.rule,
      source: "explicit",
      confidence: 1,
      learnedAt: Date.now(),
      appliedCount: 0
    };
    await r.db.patch(t.personaId, {
      learnedRules: [...o, a],
      updatedAt: Date.now()
    });
  }, "handler")
}), S = l({
  args: {
    personaId: e.id("aiWriterPersonas"),
    ruleIndex: e.number()
  },
  handler: /* @__PURE__ */ s(async (r, t) => {
    if (!await r.auth.getUserIdentity()) throw new Error("Not authenticated");
    let n = await r.db.get(t.personaId);
    if (!n) throw new Error("Persona not found");
    let a = (n.learnedRules || []).filter((c, u) => u !== t.ruleIndex);
    await r.db.patch(t.personaId, {
      learnedRules: a,
      updatedAt: Date.now()
    });
  }, "handler")
}), A = l({
  args: {
    personaId: e.id("aiWriterPersonas")
  },
  handler: /* @__PURE__ */ s(async (r, t) => {
    if (!await r.auth.getUserIdentity()) throw new Error("Not authenticated");
    await r.db.patch(t.personaId, {
      status: "archived",
      updatedAt: Date.now()
    });
  }, "handler")
}), v = y({
  args: {
    personaId: e.id("aiWriterPersonas"),
    outcome: e.union(e.literal("approved"), e.literal("edited"), e.literal("rejected")),
    seoScore: e.optional(e.number()),
    editDistance: e.optional(e.number()),
    contentType: e.optional(e.string())
  },
  handler: /* @__PURE__ */ s(async (r, t) => {
    let i = await r.db.get(t.personaId);
    if (!i) return;
    let n = i.metrics || {
      totalGenerated: 0,
      approvedCount: 0,
      editedCount: 0,
      rejectedCount: 0
    };
    if (n.totalGenerated += 1, t.outcome === "approved" && (n.approvedCount += 1), t.outcome === "edited" && (n.editedCount += 1), t.outcome === "rejected" && (n.rejectedCount += 1), t.seoScore !== void 0) {
      let c = n.avgSeoScore || 0, u = n.totalGenerated;
      n.avgSeoScore = (c * (u - 1) + t.seoScore) / u;
    }
    if (t.editDistance !== void 0 && t.outcome === "edited") {
      let c = n.avgEditDistance || 0, u = n.editedCount;
      n.avgEditDistance = (c * (u - 1) + t.editDistance) / u;
    }
    let o = i.trainingProgress || 0, a = i.status;
    n.totalGenerated >= 5 && a === "training" ? (a = "active", o = 100) : a === "training" && (o = Math.min(100, n.totalGenerated / 5 * 100)), await r.db.patch(t.personaId, {
      metrics: n,
      status: a,
      trainingProgress: o,
      lastUsedAt: Date.now(),
      updatedAt: Date.now()
    });
  }, "handler")
});
function C(r) {
  let t = [];
  if (t.push(`You are ${r.name}, an expert content writer.`), r.industry && t.push(`
INDUSTRY: ${r.industry}`), r.targetAudience && t.push(`TARGET AUDIENCE: ${r.targetAudience}`), r.brandVoice) {
    let n = r.brandVoice;
    t.push(`
BRAND VOICE:`), n.tone && t.push(`- Tone: ${n.tone}`), n.style && t.push(`- Style: ${n.style}`), n.sentenceStyle && t.push(`- Sentence style: ${n.sentenceStyle}`), n.vocabulary?.length && t.push(`- Use terms like: ${n.vocabulary.join(", ")}`), n.avoidWords?.length && t.push(`- AVOID: ${n.avoidWords.join(", ")}`);
  }
  if (r.seoPreferences) {
    let n = r.seoPreferences;
    t.push(`
SEO PREFERENCES:`), n.keywordDensity && t.push(`- Keyword density: ${n.keywordDensity}`), n.ctaStyle && t.push(`- CTA style: ${n.ctaStyle}`), n.preferredContentLength && t.push(`- Length: ${n.preferredContentLength}`);
  }
  r.uniqueSellingPoints?.length && (t.push(`
KEY DIFFERENTIATORS TO EMPHASIZE:`), r.uniqueSellingPoints.forEach((n) => t.push(`- ${n}`)));
  let i = r.learnedRules?.filter((n) => (n.confidence ?? 1) >= 0.7) || [];
  return i.length > 0 && (t.push(`
LEARNED WRITING RULES (follow these strictly):`), i.forEach((n) => t.push(`- ${n.rule}`))), t.join(`
`);
}
s(C, "buildPersonaContext");

export {
  I as a,
  b,
  P as c,
  j as d,
  m as e,
  E as f,
  S as g,
  A as h,
  v as i,
  C as j
};
//# sourceMappingURL=JABLGPTX.js.map
