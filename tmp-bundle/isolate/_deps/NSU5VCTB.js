import {
  b as d
} from "./BQGJI6AX.js";
import {
  b as i
} from "./L63FM7PU.js";
import {
  b as n
} from "./II2L62UT.js";
import {
  a as e
} from "./RUVYHBJQ.js";

// convex/ai/providers/index.ts
var t = [i, n, d];
function g() {
  return t;
}
e(g, "getAllProviders");
function m() {
  return t.filter((r) => r.isConfigured());
}
e(m, "getConfiguredProviders");
function p(r) {
  return t.find((o) => o.name === r);
}
e(p, "getProvider");
function c() {
  let r = {};
  for (let o of t)
    r[o.name] = {
      configured: o.isConfigured(),
      models: o.getModels().length
    };
  return r;
}
e(c, "getProviderStatus");

export {
  g as a,
  m as b,
  p as c,
  c as d
};
//# sourceMappingURL=NSU5VCTB.js.map
