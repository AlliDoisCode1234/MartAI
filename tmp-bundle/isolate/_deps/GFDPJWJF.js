import {
  a as l,
  c as w,
  d as p
} from "./K33OSGN4.js";
import {
  c as o,
  e as I
} from "./4U34M3I6.js";
import {
  a as s
} from "./RUVYHBJQ.js";

// convex/ai/health/circuitBreaker.ts
I();
var v = {
  failureThreshold: 5,
  successThreshold: 2,
  openTimeoutMs: 3e4,
  halfOpenMaxRequests: 3
}, S = l({
  args: {
    providerId: o.id("aiProviders")
  },
  handler: /* @__PURE__ */ s(async (t, r) => await t.db.query("aiProviderHealth").withIndex("by_provider", (e) => e.eq("providerId", r.providerId)).first(), "handler")
}), P = l({
  args: {},
  handler: /* @__PURE__ */ s(async (t) => {
    let r = await t.db.query("aiProviderHealth").collect();
    return (await t.db.query("aiProviders").collect()).map((i) => ({
      ...i,
      health: r.find((c) => c.providerId === i._id) || {
        status: "unknown",
        circuitState: "closed",
        avgLatencyMs: 0,
        errorRate: 0
      }
    }));
  }, "handler")
}), b = l({
  args: {
    providerId: o.id("aiProviders")
  },
  handler: /* @__PURE__ */ s(async (t, r) => {
    let e = await t.db.query("aiProviderHealth").withIndex("by_provider", (i) => i.eq("providerId", r.providerId)).first();
    return e ? e.circuitState === "open" && e.circuitOpenUntil ? !(Date.now() > e.circuitOpenUntil) : e.circuitState === "open" : !1;
  }, "handler")
}), g = w({
  args: {
    providerId: o.id("aiProviders")
  },
  handler: /* @__PURE__ */ s(async (t, r) => {
    let e = await t.db.query("aiProviderHealth").withIndex("by_provider", (i) => i.eq("providerId", r.providerId)).first();
    return e ? e._id : await t.db.insert("aiProviderHealth", {
      providerId: r.providerId,
      status: "healthy",
      avgLatencyMs: 0,
      errorRate: 0,
      successCount: 0,
      errorCount: 0,
      circuitState: "closed",
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      lastHealthCheckAt: Date.now(),
      updatedAt: Date.now()
    });
  }, "handler")
}), _ = p({
  args: {
    providerId: o.id("aiProviders"),
    latencyMs: o.number()
  },
  handler: /* @__PURE__ */ s(async (t, r) => {
    let e = await t.db.query("aiProviderHealth").withIndex("by_provider", (f) => f.eq("providerId", r.providerId)).first();
    if (!e) {
      console.warn(`[CircuitBreaker] No health record for provider ${r.providerId}`);
      return;
    }
    let i = e.successCount + 1, c = e.consecutiveSuccesses + 1, h = i + e.errorCount, u = (e.avgLatencyMs * e.successCount + r.latencyMs) / i, d = e.circuitState, a = e.status;
    e.circuitState === "half_open" && c >= v.successThreshold && (d = "closed", console.log(`[CircuitBreaker] Provider ${r.providerId} circuit CLOSED (recovered)`));
    let n = e.errorCount / Math.max(h, 1);
    n < 0.05 ? a = "healthy" : n < 0.2 && (a = "degraded"), await t.db.patch(e._id, {
      successCount: i,
      consecutiveSuccesses: c,
      consecutiveFailures: 0,
      // Reset on success
      avgLatencyMs: u,
      errorRate: n,
      circuitState: d,
      status: a,
      lastSuccessAt: Date.now(),
      updatedAt: Date.now()
    });
  }, "handler")
}), q = p({
  args: {
    providerId: o.id("aiProviders"),
    errorMessage: o.string()
  },
  handler: /* @__PURE__ */ s(async (t, r) => {
    let e = await t.db.query("aiProviderHealth").withIndex("by_provider", (f) => f.eq("providerId", r.providerId)).first();
    if (!e) {
      console.warn(`[CircuitBreaker] No health record for provider ${r.providerId}`);
      return;
    }
    let i = e.errorCount + 1, c = e.consecutiveFailures + 1, h = e.successCount + i, u = i / Math.max(h, 1), d = e.circuitState, a = e.status, n = e.circuitOpenUntil;
    c >= v.failureThreshold ? (d = "open", n = Date.now() + v.openTimeoutMs, a = "circuit_open", console.log(
      `[CircuitBreaker] Provider ${r.providerId} circuit OPEN (${c} failures)`
    )) : u >= 0.5 ? a = "unhealthy" : u >= 0.2 && (a = "degraded"), e.circuitState === "half_open" && (d = "open", n = Date.now() + v.openTimeoutMs, a = "circuit_open", console.log(`[CircuitBreaker] Provider ${r.providerId} circuit REOPENED from half-open`)), await t.db.patch(e._id, {
      errorCount: i,
      consecutiveFailures: c,
      consecutiveSuccesses: 0,
      // Reset on failure
      errorRate: u,
      circuitState: d,
      circuitOpenUntil: n,
      status: a,
      lastErrorAt: Date.now(),
      lastErrorMessage: r.errorMessage.substring(0, 500),
      updatedAt: Date.now()
    });
  }, "handler")
}), M = p({
  args: {
    providerId: o.id("aiProviders")
  },
  handler: /* @__PURE__ */ s(async (t, r) => {
    let e = await t.db.query("aiProviderHealth").withIndex("by_provider", (i) => i.eq("providerId", r.providerId)).first();
    e && e.circuitState === "open" && e.circuitOpenUntil && Date.now() > e.circuitOpenUntil && (await t.db.patch(e._id, {
      circuitState: "half_open",
      consecutiveSuccesses: 0,
      updatedAt: Date.now()
    }), console.log(`[CircuitBreaker] Provider ${r.providerId} circuit HALF_OPEN`));
  }, "handler")
}), m = w({
  args: {
    providerId: o.id("aiProviders")
  },
  handler: /* @__PURE__ */ s(async (t, r) => {
    let e = await t.db.query("aiProviderHealth").withIndex("by_provider", (i) => i.eq("providerId", r.providerId)).first();
    e && (await t.db.patch(e._id, {
      status: "healthy",
      avgLatencyMs: 0,
      errorRate: 0,
      successCount: 0,
      errorCount: 0,
      circuitState: "closed",
      circuitOpenUntil: void 0,
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      lastErrorMessage: void 0,
      updatedAt: Date.now()
    }), console.log(`[CircuitBreaker] Reset health for provider ${r.providerId}`));
  }, "handler")
});

export {
  S as a,
  P as b,
  b as c,
  g as d,
  _ as e,
  q as f,
  M as g,
  m as h
};
//# sourceMappingURL=GFDPJWJF.js.map
