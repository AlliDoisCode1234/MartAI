import {
  a as h
} from "./BMIQ74CQ.js";
import {
  a as o,
  b as l,
  d as y
} from "./V7X2J7BI.js";

// node_modules/@vercel/oidc/dist/token-io.js
var T = y((re, P) => {
  "use strict";
  var x = Object.create, p = Object.defineProperty, m = Object.getOwnPropertyDescriptor, A = Object.getOwnPropertyNames, I = Object.getPrototypeOf, U = Object.prototype.hasOwnProperty, C = /* @__PURE__ */ o((e, r) => {
    for (var t in r)
      p(e, t, { get: r[t], enumerable: !0 });
  }, "__export"), g = /* @__PURE__ */ o((e, r, t, n) => {
    if (r && typeof r == "object" || typeof r == "function")
      for (let i of A(r))
        !U.call(e, i) && i !== t && p(e, i, { get: /* @__PURE__ */ o(() => r[i], "get"), enumerable: !(n = m(r, i)) || n.enumerable });
    return e;
  }, "__copyProps"), k = /* @__PURE__ */ o((e, r, t) => (t = e != null ? x(I(e)) : {}, g(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    r || !e || !e.__esModule ? p(t, "default", { value: e, enumerable: !0 }) : t,
    e
  )), "__toESM"), F = /* @__PURE__ */ o((e) => g(p({}, "__esModule", { value: !0 }), e), "__toCommonJS"), j = {};
  C(j, {
    findRootDir: /* @__PURE__ */ o(() => q, "findRootDir"),
    getUserDataDir: /* @__PURE__ */ o(() => J, "getUserDataDir")
  });
  P.exports = F(j);
  var u = k(l("path")), N = k(l("fs")), _ = k(l("os")), w = h();
  function q() {
    try {
      let e = process.cwd();
      for (; e !== u.default.dirname(e); ) {
        let r = u.default.join(e, ".vercel");
        if (N.default.existsSync(r))
          return e;
        e = u.default.dirname(e);
      }
    } catch {
      throw new w.VercelOidcTokenError(
        "Token refresh only supported in node server environments"
      );
    }
    throw new w.VercelOidcTokenError("Unable to find root directory");
  }
  o(q, "findRootDir");
  function J() {
    if (process.env.XDG_DATA_HOME)
      return process.env.XDG_DATA_HOME;
    switch (_.default.platform()) {
      case "darwin":
        return u.default.join(_.default.homedir(), "Library/Application Support");
      case "linux":
        return u.default.join(_.default.homedir(), ".local/share");
      case "win32":
        return process.env.LOCALAPPDATA ? process.env.LOCALAPPDATA : null;
      default:
        return null;
    }
  }
  o(J, "getUserDataDir");
});

// node_modules/@vercel/oidc/dist/token-util.js
var ee = y((oe, S) => {
  var M = Object.create, d = Object.defineProperty, R = Object.getOwnPropertyDescriptor, $ = Object.getOwnPropertyNames, L = Object.getPrototypeOf, B = Object.prototype.hasOwnProperty, G = /* @__PURE__ */ o((e, r) => {
    for (var t in r)
      d(e, t, { get: r[t], enumerable: !0 });
  }, "__export"), D = /* @__PURE__ */ o((e, r, t, n) => {
    if (r && typeof r == "object" || typeof r == "function")
      for (let i of $(r))
        !B.call(e, i) && i !== t && d(e, i, { get: /* @__PURE__ */ o(() => r[i], "get"), enumerable: !(n = R(r, i)) || n.enumerable });
    return e;
  }, "__copyProps"), b = /* @__PURE__ */ o((e, r, t) => (t = e != null ? M(L(e)) : {}, D(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    r || !e || !e.__esModule ? d(t, "default", { value: e, enumerable: !0 }) : t,
    e
  )), "__toESM"), H = /* @__PURE__ */ o((e) => D(d({}, "__esModule", { value: !0 }), e), "__toCommonJS"), E = {};
  G(E, {
    assertVercelOidcTokenResponse: /* @__PURE__ */ o(() => v, "assertVercelOidcTokenResponse"),
    findProjectInfo: /* @__PURE__ */ o(() => K, "findProjectInfo"),
    getTokenPayload: /* @__PURE__ */ o(() => Y, "getTokenPayload"),
    getVercelCliToken: /* @__PURE__ */ o(() => X, "getVercelCliToken"),
    getVercelDataDir: /* @__PURE__ */ o(() => V, "getVercelDataDir"),
    getVercelOidcToken: /* @__PURE__ */ o(() => z, "getVercelOidcToken"),
    isExpired: /* @__PURE__ */ o(() => Z, "isExpired"),
    loadToken: /* @__PURE__ */ o(() => W, "loadToken"),
    saveToken: /* @__PURE__ */ o(() => Q, "saveToken")
  });
  S.exports = H(E);
  var s = b(l("path")), c = b(l("fs")), a = h(), f = T();
  function V() {
    let e = "com.vercel.cli", r = (0, f.getUserDataDir)();
    return r ? s.join(r, e) : null;
  }
  o(V, "getVercelDataDir");
  function X() {
    let e = V();
    if (!e)
      return null;
    let r = s.join(e, "auth.json");
    if (!c.existsSync(r))
      return null;
    let t = c.readFileSync(r, "utf8");
    return t ? JSON.parse(t).token : null;
  }
  o(X, "getVercelCliToken");
  async function z(e, r, t) {
    try {
      let n = `https://api.vercel.com/v1/projects/${r}/token?source=vercel-oidc-refresh${t ? `&teamId=${t}` : ""}`, i = await fetch(n, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${e}`
        }
      });
      if (!i.ok)
        throw new a.VercelOidcTokenError(
          `Failed to refresh OIDC token: ${i.statusText}`
        );
      let O = await i.json();
      return v(O), O;
    } catch (n) {
      throw new a.VercelOidcTokenError("Failed to refresh OIDC token", n);
    }
  }
  o(z, "getVercelOidcToken");
  function v(e) {
    if (!e || typeof e != "object")
      throw new TypeError("Expected an object");
    if (!("token" in e) || typeof e.token != "string")
      throw new TypeError("Expected a string-valued token property");
  }
  o(v, "assertVercelOidcTokenResponse");
  function K() {
    let e = (0, f.findRootDir)();
    if (!e)
      throw new a.VercelOidcTokenError("Unable to find root directory");
    try {
      let r = s.join(e, ".vercel", "project.json");
      if (!c.existsSync(r))
        throw new a.VercelOidcTokenError("project.json not found");
      let t = JSON.parse(c.readFileSync(r, "utf8"));
      if (typeof t.projectId != "string" && typeof t.orgId != "string")
        throw new TypeError("Expected a string-valued projectId property");
      return { projectId: t.projectId, teamId: t.orgId };
    } catch (r) {
      throw new a.VercelOidcTokenError("Unable to find project ID", r);
    }
  }
  o(K, "findProjectInfo");
  function Q(e, r) {
    try {
      let t = (0, f.getUserDataDir)();
      if (!t)
        throw new a.VercelOidcTokenError("Unable to find user data directory");
      let n = s.join(t, "com.vercel.token", `${r}.json`), i = JSON.stringify(e);
      c.mkdirSync(s.dirname(n), { mode: 504, recursive: !0 }), c.writeFileSync(n, i), c.chmodSync(n, 432);
      return;
    } catch (t) {
      throw new a.VercelOidcTokenError("Failed to save token", t);
    }
  }
  o(Q, "saveToken");
  function W(e) {
    try {
      let r = (0, f.getUserDataDir)();
      if (!r)
        return null;
      let t = s.join(r, "com.vercel.token", `${e}.json`);
      if (!c.existsSync(t))
        return null;
      let n = JSON.parse(c.readFileSync(t, "utf8"));
      return v(n), n;
    } catch (r) {
      throw new a.VercelOidcTokenError("Failed to load token", r);
    }
  }
  o(W, "loadToken");
  function Y(e) {
    let r = e.split(".");
    if (r.length !== 3)
      throw new a.VercelOidcTokenError("Invalid token");
    let t = r[1].replace(/-/g, "+").replace(/_/g, "/"), n = t.padEnd(
      t.length + (4 - t.length % 4) % 4,
      "="
    );
    return JSON.parse(Buffer.from(n, "base64").toString("utf8"));
  }
  o(Y, "getTokenPayload");
  function Z(e) {
    return e.exp * 1e3 < Date.now();
  }
  o(Z, "isExpired");
});

export {
  ee as a
};
//# sourceMappingURL=ZBWRTCFB.js.map
