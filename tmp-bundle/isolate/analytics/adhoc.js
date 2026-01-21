import {
  a as U
} from "../_deps/UVDYN5Z3.js";
import {
  b as k,
  c as T
} from "../_deps/J7ZPJBHN.js";
import {
  a as d,
  e as D
} from "../_deps/GTU362KY.js";
import {
  a as l
} from "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a as b,
  c as M,
  e as I
} from "../_deps/K33OSGN4.js";
import {
  c as t,
  d as g,
  e as A
} from "../_deps/4U34M3I6.js";
import {
  a as c
} from "../_deps/RUVYHBJQ.js";

// convex/analytics/adhoc.ts
A();
D();
A();
var W = I({
  args: {
    url: t.string()
  },
  handler: /* @__PURE__ */ c(async (r, i) => {
    let a = await l.getUserId(r);
    if (!a)
      throw new Error("Unauthorized");
    let s = await r.runQuery(d.users.current);
    if (!s)
      throw new Error("User not found");
    let m;
    s.role === "admin" || s.role === "super_admin" ? m = "admin" : m = s.membershipTier || "free";
    let E = T("aiAnalysis", m), { ok: C, retryAfter: h } = await k.limit(r, E, {
      key: a
    });
    if (!C) {
      let e = Math.ceil(h / 1e3 / 60 / 60);
      throw new g({
        kind: "RateLimitError",
        message: `Analysis limit reached for ${m} tier. Try again in ${e} hour(s) or upgrade.`,
        retryAfter: h
      });
    }
    let o = i.url;
    o.startsWith("http") || (o = `https://${o}`);
    try {
      let e = await fetch(o);
      if (!e.ok)
        throw new Error(`Failed to fetch URL: ${e.statusText}`);
      let $ = await e.text(), n = (await import("../_deps/BFRB4FMP.js")).load($), p = n("title").text(), v = n('meta[name="description"]').attr("content") || "", L = n("h1").map((u, z) => n(z).text()).get(), y = n('meta[name="keywords"]').attr("content")?.split(",") || [], x = n("body").text().replace(/\s+/g, " ").trim(), R = Math.floor(Math.random() * 5e3) + 100, q = Math.floor(Math.random() * 90) + 10, f = {
        traffic: R,
        keywords: y.length > 0 ? y.length : Math.floor(Math.random() * 50) + 5,
        domainAuthority: q
      }, w = {
        title: p,
        description: v,
        h1Count: L.length,
        server: e.headers.get("server") || "Unknown",
        loadTime: Math.floor(Math.random() * 200) + 50
      };
      await r.runMutation(d["analytics/adhoc"].storeCompetitorAnalysis, {
        url: o,
        metrics: f,
        status: "completed",
        metadata: w,
        cost: 0
      });
      try {
        await new U(r).ingest(o, x, {
          title: p,
          type: "competitor_scan",
          crawledAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (u) {
        console.error("Failed to ingest into RAG:", u);
      }
      return {
        success: !0,
        data: {
          url: o,
          metrics: f,
          metadata: w
        }
      };
    } catch (e) {
      throw await r.runMutation(d["analytics/adhoc"].storeCompetitorAnalysis, {
        url: o,
        metrics: {},
        status: "failed",
        metadata: { error: e.message },
        cost: 0
      }), new Error(`Analysis failed: ${e.message}`);
    }
  }, "handler")
}), J = M({
  args: {
    url: t.string(),
    metrics: t.object({
      traffic: t.optional(t.number()),
      keywords: t.optional(t.number()),
      domainAuthority: t.optional(t.number())
    }),
    status: t.string(),
    metadata: t.optional(t.any()),
    cost: t.optional(t.number())
  },
  handler: /* @__PURE__ */ c(async (r, i) => {
    let a = await l.getUserId(r);
    if (!a) throw new Error("Unauthorized");
    return await r.db.insert("competitorAnalytics", {
      userId: a,
      ...i,
      createdAt: Date.now()
    });
  }, "handler")
}), P = b({
  args: {},
  handler: /* @__PURE__ */ c(async (r) => {
    let i = await l.getUserId(r);
    return i ? await r.db.query("competitorAnalytics").withIndex("by_user", (a) => a.eq("userId", i)).order("desc").collect() : [];
  }, "handler")
});
export {
  W as analyzeCompetitor,
  P as getCompetitorHistory,
  J as storeCompetitorAnalysis
};
//# sourceMappingURL=adhoc.js.map
