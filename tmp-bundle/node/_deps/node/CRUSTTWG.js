import {
  a as f
} from "./ZBWRTCFB.js";
import {
  a as k
} from "./BMIQ74CQ.js";
import {
  a as t,
  d as _
} from "./V7X2J7BI.js";

// node_modules/@vercel/oidc/dist/token.js
var y = _((P, l) => {
  var p = Object.defineProperty, O = Object.getOwnPropertyDescriptor, d = Object.getOwnPropertyNames, u = Object.prototype.hasOwnProperty, v = /* @__PURE__ */ t((e, r) => {
    for (var o in r)
      p(e, o, { get: r[o], enumerable: !0 });
  }, "__export"), T = /* @__PURE__ */ t((e, r, o, i) => {
    if (r && typeof r == "object" || typeof r == "function")
      for (let a of d(r))
        !u.call(e, a) && a !== o && p(e, a, { get: /* @__PURE__ */ t(() => r[a], "get"), enumerable: !(i = O(r, a)) || i.enumerable });
    return e;
  }, "__copyProps"), w = /* @__PURE__ */ t((e) => T(p({}, "__esModule", { value: !0 }), e), "__toCommonJS"), s = {};
  v(s, {
    refreshToken: /* @__PURE__ */ t(() => h, "refreshToken")
  });
  l.exports = w(s);
  var c = k(), n = f();
  async function h() {
    let { projectId: e, teamId: r } = (0, n.findProjectInfo)(), o = (0, n.loadToken)(e);
    if (!o || (0, n.isExpired)((0, n.getTokenPayload)(o.token))) {
      let i = (0, n.getVercelCliToken)();
      if (!i)
        throw new c.VercelOidcTokenError(
          "Failed to refresh OIDC token: login to vercel cli"
        );
      if (!e)
        throw new c.VercelOidcTokenError(
          "Failed to refresh OIDC token: project id not found"
        );
      if (o = await (0, n.getVercelOidcToken)(i, e, r), !o)
        throw new c.VercelOidcTokenError("Failed to refresh OIDC token");
      (0, n.saveToken)(o, e);
    }
    process.env.VERCEL_OIDC_TOKEN = o.token;
  }
  t(h, "refreshToken");
});
export default y();
//# sourceMappingURL=CRUSTTWG.js.map
