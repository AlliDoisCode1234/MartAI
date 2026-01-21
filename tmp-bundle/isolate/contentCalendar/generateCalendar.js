import {
  a as I
} from "../_deps/XGN6ADC2.js";
import {
  d as j
} from "../_deps/T2KGGNQC.js";
import {
  a as l,
  b as g,
  e as N
} from "../_deps/GTU362KY.js";
import {
  d as w,
  e as G,
  f as P
} from "../_deps/K33OSGN4.js";
import {
  c as e,
  e as F
} from "../_deps/4U34M3I6.js";
import {
  a as d
} from "../_deps/RUVYHBJQ.js";

// convex/contentCalendar/generateCalendar.ts
F();
N();
var q = G({
  args: {
    projectId: e.id("projects"),
    websiteUrl: e.optional(e.string()),
    businessDescription: e.optional(e.string()),
    monthsAhead: e.optional(e.number()),
    // default: 6
    useGa4Gsc: e.optional(e.boolean())
    // true if connected
  },
  handler: /* @__PURE__ */ d(async (s, t) => {
    let c = t.monthsAhead || 6;
    try {
      let r = await s.runQuery(l.projects.projects.getProjectById, {
        projectId: t.projectId
      });
      if (!r)
        return {
          success: !1,
          industry: "general",
          itemsGenerated: 0,
          contentPieceIds: [],
          error: "Project not found"
        };
      let o = await s.runAction(g.phoo.industryTemplates.detectIndustry, {
        url: t.websiteUrl || r.websiteUrl || "",
        businessDescription: t.businessDescription || r.industry || ""
      });
      console.log(`[generateFullCalendar] Detected industry: ${o}`);
      let a = I[o] || I.general, i = [];
      if (t.useGa4Gsc)
        try {
          let n = await s.runQuery(l.analytics.gscQueries.getTopQueries, {
            projectId: t.projectId,
            limit: 50
          });
          n && n.length > 0 && (i = n.map((h) => h.query));
        } catch {
          console.log("[generateFullCalendar] GSC keywords not available, using template seeds");
        }
      i.length === 0 && (i = a.keywords);
      let p = [], T = Date.now(), u = 1440 * 60 * 1e3;
      for (let n of a.contentPlan) {
        if (n.month > c || !j[n.contentType]) continue;
        let b = 2 * u, D = (n.month - 1) * 30 * u, k = p.length % 7 * u, A = T + b + D + k, C = "Your City", f = r.name || "Your Company", S = n.titleTemplate.replace(/\{\{location\}\}/g, C).replace(/\{\{companyName\}\}/g, f).replace(/\{\{industry\}\}/g, a.name), E = n.suggestedKeywords.map(
          (m) => m.replace(/\{\{location\}\}/g, C).replace(/\{\{companyName\}\}/g, f).replace(/\{\{industry\}\}/g, a.name)
        ).filter((m) => !m.includes("{{"));
        p.push({
          contentType: n.contentType,
          title: S,
          keywords: [...E, ...i.slice(0, 3)],
          scheduledDate: A,
          priority: n.priority
        });
      }
      let y = await s.runMutation(
        g.contentCalendar.generateCalendar.createCalendarContentPieces,
        {
          projectId: t.projectId,
          items: p
        }
      );
      return console.log(
        `[generateFullCalendar] Generated ${y.length} content pieces for ${o}`
      ), {
        success: !0,
        industry: o,
        itemsGenerated: y.length,
        contentPieceIds: y
      };
    } catch (r) {
      return console.error("[generateFullCalendar] Error:", r), {
        success: !1,
        industry: "general",
        itemsGenerated: 0,
        contentPieceIds: [],
        error: r instanceof Error ? r.message : "Unknown error"
      };
    }
  }, "handler")
}), v = w({
  args: {
    projectId: e.id("projects"),
    items: e.array(
      e.object({
        contentType: e.string(),
        title: e.string(),
        keywords: e.array(e.string()),
        scheduledDate: e.number(),
        priority: e.union(e.literal("P0"), e.literal("P1"), e.literal("P2"))
      })
    )
  },
  handler: /* @__PURE__ */ d(async (s, t) => {
    let c = Date.now(), r = [];
    for (let o of t.items) {
      let a = await s.db.insert("contentPieces", {
        projectId: t.projectId,
        contentType: o.contentType,
        title: o.title,
        keywords: o.keywords,
        status: "draft",
        scheduledDate: o.scheduledDate,
        priority: o.priority,
        createdAt: c,
        updatedAt: c,
        seoScore: 0,
        wordCount: 0
      });
      r.push(a);
    }
    return r;
  }, "handler")
}), _ = P({
  args: {
    projectId: e.id("projects"),
    hasGa4: e.boolean(),
    hasGsc: e.boolean()
  },
  handler: /* @__PURE__ */ d(async (s, t) => (console.log(
    `[triggerOnboardingCalendarGeneration] Starting for project ${t.projectId}, GA4: ${t.hasGa4}, GSC: ${t.hasGsc}`
  ), await s.runAction(l.contentCalendar.generateCalendar.generateFullCalendar, {
    projectId: t.projectId,
    useGa4Gsc: t.hasGa4 || t.hasGsc
  })), "handler")
});
export {
  v as createCalendarContentPieces,
  q as generateFullCalendar,
  _ as triggerOnboardingCalendarGeneration
};
//# sourceMappingURL=generateCalendar.js.map
