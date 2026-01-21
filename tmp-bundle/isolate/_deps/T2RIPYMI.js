import {
  a as o
} from "./RUVYHBJQ.js";

// convex/workflows/onboardingWorkflows.ts
var a = [
  "signupCompleted",
  "planSelected",
  "paymentCompleted",
  "projectCreated",
  "ga4Connected",
  "gscConnected"
], l = {
  signupCompleted: "Account Created",
  planSelected: "Plan Selected",
  paymentCompleted: "Payment Complete",
  projectCreated: "Project Created",
  ga4Connected: "GA4 Connected",
  gscConnected: "GSC Connected"
};
function C(p) {
  let d = [
    "signupCompleted",
    "planSelected",
    "paymentCompleted",
    "projectCreated"
  ], r = ["ga4Connected", "gscConnected"], e = [...d, ...r], c = e.filter((t) => {
    let n = p[t];
    return n === !0 || t === "planSelected" && typeof n == "string";
  }).length;
  return Math.round(c / e.length * 100);
}
o(C, "calculateProgress");

export {
  a,
  l as b,
  C as c
};
//# sourceMappingURL=T2RIPYMI.js.map
