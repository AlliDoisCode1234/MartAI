import {
  b as m
} from "./NSU5VCTB.js";
import {
  a as p,
  b as n,
  e as y
} from "./GTU362KY.js";
import {
  d as h,
  e as d,
  f as u
} from "./K33OSGN4.js";
import {
  c as l,
  e as g
} from "./4U34M3I6.js";
import {
  a as s
} from "./RUVYHBJQ.js";

// convex/ai/health/healthActions.ts
g();
y();
var H = u({
  args: {},
  handler: /* @__PURE__ */ s(async (e) => {
    let o = m(), t = {}, a = await e.runQuery(p.ai.health.circuitBreaker.getAllProviderHealth, {});
    for (let i of o) {
      let c = a.find((r) => r.name === i.name);
      if (c)
        try {
          let r = await i.healthCheck();
          t[i.name] = r, r.healthy ? await e.runMutation(n.ai.health.circuitBreaker.recordSuccess, {
            providerId: c._id,
            latencyMs: r.latencyMs
          }) : await e.runMutation(n.ai.health.circuitBreaker.recordFailure, {
            providerId: c._id,
            errorMessage: r.error || "Health check failed"
          }), await e.runMutation(n.ai.health.healthActions.updateHealthCheckTime, {
            providerId: c._id
          }), console.log(
            `[HealthCheck] ${i.name}: ${r.healthy ? "\u2713" : "\u2717"} (${r.latencyMs}ms)`
          );
        } catch (r) {
          t[i.name] = {
            healthy: !1,
            latencyMs: 0,
            error: r.message
          }, await e.runMutation(n.ai.health.circuitBreaker.recordFailure, {
            providerId: c._id,
            errorMessage: r.message
          }), console.error(`[HealthCheck] ${i.name} error:`, r.message);
        }
    }
    return console.log(`[HealthCheck] Completed for ${Object.keys(t).length} providers`), t;
  }, "handler")
}), b = d({
  args: {},
  handler: /* @__PURE__ */ s(async (e) => await e.runAction(n.ai.health.healthActions.runHealthChecks, {}), "handler")
}), M = h({
  args: {
    providerId: l.id("aiProviders")
  },
  handler: /* @__PURE__ */ s(async (e, o) => {
    let t = await e.db.query("aiProviderHealth").withIndex("by_provider", (a) => a.eq("providerId", o.providerId)).first();
    t && await e.db.patch(t._id, {
      lastHealthCheckAt: Date.now()
    });
  }, "handler")
}), P = h({
  args: {},
  handler: /* @__PURE__ */ s(async (e) => {
    let o = Date.now(), t = await e.db.query("aiProviderHealth").collect();
    for (let a of t)
      if (a.circuitState === "open" && a.circuitOpenUntil && o > a.circuitOpenUntil) {
        await e.db.patch(a._id, {
          circuitState: "half_open",
          consecutiveSuccesses: 0,
          updatedAt: o
        });
        let i = await e.db.get(a.providerId);
        console.log(`[CircuitBreaker] ${i?.name} transitioned to HALF_OPEN`);
      }
  }, "handler")
});

export {
  H as a,
  b,
  M as c,
  P as d
};
//# sourceMappingURL=A5RAFBQL.js.map
