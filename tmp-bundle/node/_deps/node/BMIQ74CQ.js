import {
  a as t,
  d as u
} from "./V7X2J7BI.js";

// node_modules/@vercel/oidc/dist/token-error.js
var y = u((P, i) => {
  "use strict";
  var n = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, O = Object.getOwnPropertyNames, h = Object.prototype.hasOwnProperty, l = /* @__PURE__ */ t((r, e) => {
    for (var o in e)
      n(r, o, { get: e[o], enumerable: !0 });
  }, "__export"), v = /* @__PURE__ */ t((r, e, o, c) => {
    if (e && typeof e == "object" || typeof e == "function")
      for (let s of O(e))
        !h.call(r, s) && s !== o && n(r, s, { get: /* @__PURE__ */ t(() => e[s], "get"), enumerable: !(c = _(e, s)) || c.enumerable });
    return r;
  }, "__copyProps"), g = /* @__PURE__ */ t((r) => v(n({}, "__esModule", { value: !0 }), r), "__toCommonJS"), p = {};
  l(p, {
    VercelOidcTokenError: /* @__PURE__ */ t(() => a, "VercelOidcTokenError")
  });
  i.exports = g(p);
  var a = class extends Error {
    static {
      t(this, "VercelOidcTokenError");
    }
    constructor(e, o) {
      super(e), this.name = "VercelOidcTokenError", this.cause = o;
    }
    toString() {
      return this.cause ? `${this.name}: ${this.message}: ${this.cause}` : `${this.name}: ${this.message}`;
    }
  };
});

export {
  y as a
};
//# sourceMappingURL=BMIQ74CQ.js.map
