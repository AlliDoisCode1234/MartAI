import {
  b,
  d as f
} from "../_deps/K33OSGN4.js";
import {
  c as d,
  e as T
} from "../_deps/4U34M3I6.js";
import {
  a as i
} from "../_deps/RUVYHBJQ.js";

// convex/admin/cleanup.ts
T();
var G = b({
  args: {},
  handler: /* @__PURE__ */ i(async (t) => {
    let r = [
      "aiGenerations",
      "analyticsEvents",
      "aiRoutingLogs",
      "gscKeywordSnapshots",
      "analyticsData",
      "passwordResetTokens",
      "rankings",
      "keywords",
      "keywordClusters",
      "briefs",
      "drafts",
      "contentChecks",
      "insights",
      "projectScores"
    ], e = {};
    for (let o of r)
      try {
        let s = await t.db.query(o).collect();
        e[o] = s.length;
      } catch {
        e[o] = -1;
      }
    let l = Object.entries(e).filter(([, o]) => o > 0).sort(([, o], [, s]) => s - o);
    return console.log("[Cleanup] Table counts:", l), { counts: e, sorted: l };
  }, "handler")
}), S = f({
  args: {
    olderThanDays: d.optional(d.number())
  },
  handler: /* @__PURE__ */ i(async (t, r) => {
    let e = r.olderThanDays ?? 7, l = Date.now() - e * 24 * 60 * 60 * 1e3, o = await t.db.query("aiGenerations").filter((n) => n.lt(n.field("createdAt"), l)).collect(), s = 0;
    for (let n of o)
      await t.db.delete(n._id), s++;
    return console.log(`[Cleanup] Deleted ${s} AI generations older than ${e} days`), { deleted: s };
  }, "handler")
}), E = f({
  args: {
    olderThanDays: d.optional(d.number())
  },
  handler: /* @__PURE__ */ i(async (t, r) => {
    let e = r.olderThanDays ?? 30, l = Date.now() - e * 24 * 60 * 60 * 1e3, o = await t.db.query("analyticsEvents").filter((n) => n.lt(n.field("timestamp"), l)).collect(), s = 0;
    for (let n of o)
      await t.db.delete(n._id), s++;
    return console.log(`[Cleanup] Deleted ${s} analytics events older than ${e} days`), { deleted: s };
  }, "handler")
}), A = f({
  args: {
    olderThanDays: d.optional(d.number())
  },
  handler: /* @__PURE__ */ i(async (t, r) => {
    let e = r.olderThanDays ?? 30, l = Date.now() - e * 24 * 60 * 60 * 1e3, o = await t.db.query("gscKeywordSnapshots").filter((n) => n.lt(n.field("syncDate"), l)).collect(), s = 0;
    for (let n of o)
      await t.db.delete(n._id), s++;
    return console.log(`[Cleanup] Deleted ${s} GSC snapshots older than ${e} days`), { deleted: s };
  }, "handler")
}), _ = f({
  args: {},
  handler: /* @__PURE__ */ i(async (t) => {
    let r = Date.now(), e = await t.db.query("passwordResetTokens").filter((o) => o.lt(o.field("expiresAt"), r)).collect(), l = 0;
    for (let o of e)
      await t.db.delete(o._id), l++;
    return console.log(`[Cleanup] Deleted ${l} expired password reset tokens`), { deleted: l };
  }, "handler")
}), $ = f({
  args: {
    dryRun: d.optional(d.boolean())
  },
  handler: /* @__PURE__ */ i(async (t, r) => {
    if (r.dryRun) {
      let a = [
        "aiGenerations",
        "analyticsEvents",
        "gscKeywordSnapshots",
        "passwordResetTokens"
      ], y = {}, h = Date.now() - 6048e5, g = Date.now() - 720 * 60 * 60 * 1e3, D = await t.db.query("aiGenerations").filter((c) => c.lt(c.field("createdAt"), h)).collect();
      y["aiGenerations (>7d)"] = D.length;
      let v = await t.db.query("analyticsEvents").filter((c) => c.lt(c.field("timestamp"), g)).collect();
      y["analyticsEvents (>30d)"] = v.length;
      let k = await t.db.query("gscKeywordSnapshots").filter((c) => c.lt(c.field("syncDate"), g)).collect();
      y["gscKeywordSnapshots (>30d)"] = k.length;
      let m = await t.db.query("passwordResetTokens").filter((c) => c.lt(c.field("expiresAt"), Date.now())).collect();
      return y["passwordResetTokens (expired)"] = m.length, console.log("[Cleanup] Dry run preview:", y), { dryRun: !0, preview: y };
    }
    let e = {
      aiGenerations: 0,
      analyticsEvents: 0,
      gscSnapshots: 0,
      passwordTokens: 0
    }, l = Date.now() - 10080 * 60 * 1e3, o = await t.db.query("aiGenerations").filter((a) => a.lt(a.field("createdAt"), l)).collect();
    for (let a of o)
      await t.db.delete(a._id), e.aiGenerations++;
    let s = Date.now() - 720 * 60 * 60 * 1e3, n = await t.db.query("analyticsEvents").filter((a) => a.lt(a.field("timestamp"), s)).collect();
    for (let a of n)
      await t.db.delete(a._id), e.analyticsEvents++;
    let u = await t.db.query("gscKeywordSnapshots").filter((a) => a.lt(a.field("syncDate"), s)).collect();
    for (let a of u)
      await t.db.delete(a._id), e.gscSnapshots++;
    let p = await t.db.query("passwordResetTokens").filter((a) => a.lt(a.field("expiresAt"), Date.now())).collect();
    for (let a of p)
      await t.db.delete(a._id), e.passwordTokens++;
    let w = e.aiGenerations + e.analyticsEvents + e.gscSnapshots + e.passwordTokens;
    return console.log(`[Cleanup] Full cleanup complete. Deleted ${w} documents.`, e), { dryRun: !1, results: e, total: w };
  }, "handler")
}), K = f({
  args: {
    confirmDelete: d.boolean()
  },
  handler: /* @__PURE__ */ i(async (t, r) => {
    if (!r.confirmDelete) {
      let s = {}, n = [
        "aiGenerations",
        "analyticsEvents",
        "insights",
        "gscKeywordSnapshots",
        "passwordResetTokens",
        "rankings",
        "contentChecks"
      ];
      for (let u of n)
        try {
          let p = await t.db.query(u).collect();
          s[u] = p.length;
        } catch {
          s[u] = 0;
        }
      return console.log("[DevCleanup] Preview - would delete:", s), { deleted: !1, preview: s };
    }
    let e = {}, l = [
      "aiGenerations",
      "analyticsEvents",
      "insights",
      "gscKeywordSnapshots",
      "passwordResetTokens",
      "rankings",
      "contentChecks"
    ];
    for (let s of l)
      try {
        let n = await t.db.query(s).collect();
        for (let u of n)
          await t.db.delete(u._id);
        e[s] = n.length;
      } catch {
        e[s] = 0;
      }
    let o = Object.values(e).reduce((s, n) => s + n, 0);
    return console.log(`[DevCleanup] Deleted ${o} documents:`, e), { deleted: !0, results: e, total: o };
  }, "handler")
});
export {
  S as cleanupAiGenerations,
  E as cleanupAnalyticsEvents,
  A as cleanupGscSnapshots,
  _ as cleanupPasswordTokens,
  K as devCleanup,
  G as getTableCounts,
  $ as runFullCleanup
};
//# sourceMappingURL=cleanup.js.map
