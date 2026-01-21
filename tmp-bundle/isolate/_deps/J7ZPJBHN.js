import {
  c as g,
  e as G
} from "./GTU362KY.js";
import {
  c as e,
  e as m,
  g as w,
  i as b,
  x as A
} from "./4U34M3I6.js";
import {
  a as d
} from "./RUVYHBJQ.js";

// node_modules/@convex-dev/rate-limiter/dist/client/index.js
A();
m();

// node_modules/@convex-dev/rate-limiter/dist/shared.js
m();
var C = e.object({
  kind: e.literal("token bucket"),
  rate: e.number(),
  period: e.number(),
  capacity: e.optional(e.number()),
  maxReserved: e.optional(e.number()),
  shards: e.optional(e.number()),
  start: e.optional(e.null())
}), R = e.object({
  kind: e.literal("fixed window"),
  rate: e.number(),
  period: e.number(),
  capacity: e.optional(e.number()),
  maxReserved: e.optional(e.number()),
  shards: e.optional(e.number()),
  start: e.optional(e.number())
}), y = e.union(C, R), v = {
  name: e.string(),
  key: e.optional(e.string()),
  count: e.optional(e.number()),
  reserve: e.optional(e.boolean()),
  throws: e.optional(e.boolean()),
  config: y
  // TODO: allow specifying the shard to use here
}, M = e.union(e.object({
  ok: e.literal(!0),
  retryAfter: e.optional(e.number())
}), e.object({
  ok: e.literal(!1),
  // TODO: include the shard here they should retry with
  retryAfter: e.number()
})), h = e.object({
  name: e.optional(e.string()),
  key: e.optional(e.string()),
  sampleShards: e.optional(e.number()),
  config: e.optional(y)
}), _ = e.object({
  value: e.number(),
  ts: e.number(),
  shard: e.number(),
  config: y
});

// node_modules/@convex-dev/rate-limiter/dist/client/index.js
var P = 1e3, s = 60 * P, o = 60 * s, L = 24 * o, B = 7 * L;
var c = class {
  static {
    d(this, "RateLimiter");
  }
  component;
  limits;
  constructor(a, t) {
    this.component = a, this.limits = t;
  }
  /**
   * Check a rate limit.
   * This function will check the rate limit and return whether the request is
   * allowed, and if not, when it could be retried.
   * Unlike {@link limit}, this function does not consume any tokens.
   *
   * @param ctx The ctx object from a query or mutation, including runQuery.
   * @param name The name of the rate limit.
   * @param options The rate limit arguments. `config` is required if the rate
   * limit was not defined in {@link RateLimiter}. See {@link RateLimitArgs}.
   * @returns `{ ok, retryAfter }`: `ok` is true if the rate limit is not exceeded.
   * `retryAfter` is the duration in milliseconds when retrying could succeed.
   * If `reserve` is true, `ok` is true if there's enough capacity including
   * reservation. If there is a maxiumum reservation limit, `ok` will be false
   * when it is exceeded. When `ok` is true and `retryAfter` is defined, it is
   * the duration you must wait before executing the work.
   * e.g.:
   * ```ts
   * if (status.retryAfter) {
   *   await ctx.scheduler.runAfter(retryAfter, ...)
   * ```
   */
  async check(a, t, ...i) {
    return a.runQuery(this.component.lib.checkRateLimit, {
      ...i[0],
      name: t,
      config: this.getConfig(i[0], t)
    });
  }
  /**
   * Rate limit a request.
   * This function will check the rate limit and return whether the request is
   * allowed, and if not, when it could be retried.
   *
   * @param ctx The ctx object from a mutation, including runMutation.
   * @param name The name of the rate limit.
   * @param options The rate limit arguments. `config` is required if the rate
   * limit was not defined in {@link RateLimiter}. See {@link RateLimitArgs}.
   * @returns `{ ok, retryAfter }`: `ok` is true if the rate limit is not exceeded.
   * `retryAfter` is the duration in milliseconds when retrying could succeed.
   * If `reserve` is true, `ok` is true if there's enough capacity including
   * reservation. If there is a maxiumum reservation limit, `ok` will be false
   * when it is exceeded. When `ok` is true and `retryAfter` is defined, it is
   * the duration you must wait before executing the work.
   * e.g.:
   * ```ts
   * if (status.retryAfter) {
   *   await ctx.scheduler.runAfter(retryAfter, ...)
   * ```
   */
  async limit(a, t, ...i) {
    return a.runMutation(this.component.lib.rateLimit, {
      ...i[0],
      name: t,
      config: this.getConfig(i[0], t)
    });
  }
  /**
   * Reset a rate limit. This will remove the rate limit from the database.
   * The next request will start fresh.
   * Note: In the case of a fixed window without a specified `start`,
   * the new window will be a random time.
   * @param ctx The ctx object from a mutation, including runMutation.
   * @param name The name of the rate limit to reset, including all shards.
   * @param key If a key is provided, it will reset the rate limit for that key.
   * If not, it will reset the rate limit for the shared value.
   */
  async reset({ runMutation: a }, t, i) {
    await a(this.component.lib.resetRateLimit, {
      ...i ?? null,
      name: t
    });
  }
  /**
   * Get the current value and metadata of a rate limit.
   * This function returns the current token utilization data without consuming any tokens.
   *
   * @param ctx The ctx object from a query, including runQuery.
   * @param name The name of the rate limit.
   * @param options The rate limit arguments. `config` is required if the rate
   * limit was not defined in {@link RateLimiter}. See {@link RateLimitArgs}.
   * @returns An object containing the current value, timestamp, window start time (for fixed window),
   * and the rate limit configuration.
   */
  async getValue(a, t, ...i) {
    return a.runQuery(this.component.lib.getValue, {
      ...i[0],
      name: t,
      config: this.getConfig(i[0], t)
    });
  }
  /**
   * Creates a public query that can be exported from your API that returns the
   * current value of a rate limit.
   * This is a convenience function to re-export the query for client use.
   *
   * @param name The name of the rate limit.
   * @returns An object containing a getRateLimit function that can be exported.
   *
   * Example:
   * ```ts
   * // In your API file:
   * export const getRateLimit = rateLimiter.getValueQuery("myLimit");
   *
   * // In your client:
   * const { status, getValue, retryAt } = useRateLimit(api.getRateLimit, 10);
   * ```
   */
  hookAPI(a, ...t) {
    return {
      getRateLimit: b({
        args: h,
        returns: _,
        handler: /* @__PURE__ */ d(async (i, p) => {
          let k = p.name ?? a, { key: l, ...x } = t[0] ?? {}, u;
          if (p.key && !l)
            throw new Error("To allow client-provided key, provide a `key` function in the hook options.");
          return typeof l == "function" ? u = await l(i, p.key) : l !== void 0 && (u = l), i.runQuery(this.component.lib.getValue, {
            ...x,
            ...p,
            key: u,
            name: k,
            config: p.config ?? this.getConfig(t[0], k)
          });
        }, "handler")
      }),
      getServerTime: w({
        args: {},
        returns: e.number(),
        handler: /* @__PURE__ */ d(async () => Date.now(), "handler")
      })
    };
  }
  getConfig(a, t) {
    let i = a && "config" in a && a.config || this.limits && this.limits[t];
    if (!i)
      throw new Error(`Rate limit ${t} not defined. You must provide a config inline or define it in the constructor.`);
    return i;
  }
};

// convex/rateLimits.ts
G();
var n = 24 * o, r = {
  // Legacy fallback - restricted limits for edge cases only
  free: {
    briefGeneration: { rate: 3, period: n },
    draftGeneration: { rate: 3, period: n },
    keywordClusters: { rate: 5, period: n },
    quarterlyPlans: { rate: 1, period: n },
    aiAnalysis: { rate: 2, period: n }
  },
  starter: {
    briefGeneration: { rate: 5, period: o },
    draftGeneration: { rate: 5, period: o },
    keywordClusters: { rate: 10, period: o },
    quarterlyPlans: { rate: 2, period: n },
    aiAnalysis: { rate: 3, period: n }
  },
  growth: {
    briefGeneration: { rate: 10, period: o },
    draftGeneration: { rate: 10, period: o },
    keywordClusters: { rate: 20, period: o },
    quarterlyPlans: { rate: 5, period: n },
    aiAnalysis: { rate: 10, period: n }
  },
  pro: {
    briefGeneration: { rate: 20, period: o },
    draftGeneration: { rate: 20, period: o },
    keywordClusters: { rate: 50, period: o },
    quarterlyPlans: { rate: 10, period: n },
    aiAnalysis: { rate: 20, period: n }
  },
  admin: {
    // Generous limits for testing
    briefGeneration: { rate: 100, period: o },
    draftGeneration: { rate: 100, period: o },
    keywordClusters: { rate: 200, period: o },
    quarterlyPlans: { rate: 50, period: n },
    aiAnalysis: { rate: 100, period: n }
  }
}, H = new c(g.rateLimiter, {
  // Brief generation - token bucket for smooth usage
  generateBrief_free: {
    kind: "token bucket",
    rate: r.free.briefGeneration.rate,
    period: r.free.briefGeneration.period,
    capacity: 1
  },
  generateBrief_starter: {
    kind: "token bucket",
    rate: r.starter.briefGeneration.rate,
    period: r.starter.briefGeneration.period,
    capacity: 2
  },
  generateBrief_growth: {
    kind: "token bucket",
    rate: r.growth.briefGeneration.rate,
    period: r.growth.briefGeneration.period,
    capacity: 3
  },
  generateBrief_pro: {
    kind: "token bucket",
    rate: r.pro.briefGeneration.rate,
    period: r.pro.briefGeneration.period,
    capacity: 5
  },
  generateBrief_admin: {
    kind: "token bucket",
    rate: r.admin.briefGeneration.rate,
    period: r.admin.briefGeneration.period,
    capacity: 20
  },
  // Draft generation
  generateDraft_free: {
    kind: "token bucket",
    rate: r.free.draftGeneration.rate,
    period: r.free.draftGeneration.period,
    capacity: 1
  },
  generateDraft_starter: {
    kind: "token bucket",
    rate: r.starter.draftGeneration.rate,
    period: r.starter.draftGeneration.period,
    capacity: 2
  },
  generateDraft_growth: {
    kind: "token bucket",
    rate: r.growth.draftGeneration.rate,
    period: r.growth.draftGeneration.period,
    capacity: 3
  },
  generateDraft_pro: {
    kind: "token bucket",
    rate: r.pro.draftGeneration.rate,
    period: r.pro.draftGeneration.period,
    capacity: 5
  },
  generateDraft_admin: {
    kind: "token bucket",
    rate: r.admin.draftGeneration.rate,
    period: r.admin.draftGeneration.period,
    capacity: 20
  },
  // Keyword clustering
  generateKeywordClusters_free: {
    kind: "token bucket",
    rate: r.free.keywordClusters.rate,
    period: r.free.keywordClusters.period,
    capacity: 2
  },
  generateKeywordClusters_starter: {
    kind: "token bucket",
    rate: r.starter.keywordClusters.rate,
    period: r.starter.keywordClusters.period,
    capacity: 3
  },
  generateKeywordClusters_growth: {
    kind: "token bucket",
    rate: r.growth.keywordClusters.rate,
    period: r.growth.keywordClusters.period,
    capacity: 5
  },
  generateKeywordClusters_pro: {
    kind: "token bucket",
    rate: r.pro.keywordClusters.rate,
    period: r.pro.keywordClusters.period,
    capacity: 10
  },
  generateKeywordClusters_admin: {
    kind: "token bucket",
    rate: r.admin.keywordClusters.rate,
    period: r.admin.keywordClusters.period,
    capacity: 50
  },
  // Quarterly planning - fixed window
  createQuarterlyPlan_free: {
    kind: "fixed window",
    rate: r.free.quarterlyPlans.rate,
    period: r.free.quarterlyPlans.period
  },
  createQuarterlyPlan_starter: {
    kind: "fixed window",
    rate: r.starter.quarterlyPlans.rate,
    period: r.starter.quarterlyPlans.period
  },
  createQuarterlyPlan_growth: {
    kind: "fixed window",
    rate: r.growth.quarterlyPlans.rate,
    period: r.growth.quarterlyPlans.period
  },
  createQuarterlyPlan_pro: {
    kind: "fixed window",
    rate: r.pro.quarterlyPlans.rate,
    period: r.pro.quarterlyPlans.period
  },
  createQuarterlyPlan_admin: {
    kind: "fixed window",
    rate: r.admin.quarterlyPlans.rate,
    period: r.admin.quarterlyPlans.period
  },
  // AI analysis - fixed window
  aiAnalysis_free: {
    kind: "fixed window",
    rate: r.free.aiAnalysis.rate,
    period: r.free.aiAnalysis.period
  },
  aiAnalysis_starter: {
    kind: "fixed window",
    rate: r.starter.aiAnalysis.rate,
    period: r.starter.aiAnalysis.period
  },
  aiAnalysis_growth: {
    kind: "fixed window",
    rate: r.growth.aiAnalysis.rate,
    period: r.growth.aiAnalysis.period
  },
  aiAnalysis_pro: {
    kind: "fixed window",
    rate: r.pro.aiAnalysis.rate,
    period: r.pro.aiAnalysis.period
  },
  aiAnalysis_admin: {
    kind: "fixed window",
    rate: r.admin.aiAnalysis.rate,
    period: r.admin.aiAnalysis.period
  },
  // ============================================
  // PUBLIC API RATE LIMITS (Enterprise tier)
  // ============================================
  // API endpoints - token bucket for burst handling
  api_keywords_read: {
    kind: "token bucket",
    rate: 100,
    // 100 requests per minute
    period: s,
    capacity: 20
    // Allow burst of 20
  },
  api_keywords_write: {
    kind: "token bucket",
    rate: 50,
    // 50 writes per minute
    period: s,
    capacity: 10
  },
  api_clusters_read: {
    kind: "token bucket",
    rate: 100,
    period: s,
    capacity: 20
  },
  api_briefs_read: {
    kind: "token bucket",
    rate: 100,
    period: s,
    capacity: 20
  },
  api_analytics_read: {
    kind: "token bucket",
    rate: 60,
    // Slightly lower for analytics (more expensive)
    period: s,
    capacity: 10
  },
  // ============================================
  // ADMIN OPERATIONS RATE LIMITS
  // ============================================
  // Impersonation - prevent brute-force session creation
  // 5 impersonations per hour per admin
  admin_impersonation: {
    kind: "fixed window",
    rate: 5,
    period: o
  }
});
function W(f, a) {
  return `${f}_${a}`;
}
d(W, "getRateLimitKey");

export {
  r as a,
  H as b,
  W as c
};
//# sourceMappingURL=J7ZPJBHN.js.map
