import {
  c as s,
  e as i
} from "./_deps/GTU362KY.js";
import "./_deps/4U34M3I6.js";
import {
  a
} from "./_deps/RUVYHBJQ.js";

// convex/cache.ts
i();
var u = {
  BRIEF_GENERATION: 10080 * 60 * 1e3,
  // 7 days
  DRAFT_GENERATION: 4320 * 60 * 1e3,
  // 3 days
  KEYWORD_CLUSTERING: 720 * 60 * 60 * 1e3,
  // 30 days
  SERP_ANALYSIS: 1440 * 60 * 1e3,
  // 24 hours
  QUARTERLY_PLANNING: 10080 * 60 * 1e3
  // 7 days
}, g = {
  get: /* @__PURE__ */ a(async (r, n) => {
    let t = await r.runQuery(s.actionCache.lib.get, {
      name: "manual_cache",
      args: n,
      ttl: null
    });
    return t.kind === "hit" ? t.value : null;
  }, "get"),
  set: /* @__PURE__ */ a(async (r, n, t, e) => {
    await r.runMutation(s.actionCache.lib.put, {
      name: "manual_cache",
      args: n,
      value: t,
      ttl: e
    });
  }, "set")
};
function l(r, n) {
  let t = Object.keys(n).sort().reduce((e, c) => (e[c] = n[c], e), {});
  return `${r}:${JSON.stringify(t)}`;
}
a(l, "getCacheKey");
export {
  u as CACHE_TTL,
  g as cache,
  l as getCacheKey
};
//# sourceMappingURL=cache.js.map
