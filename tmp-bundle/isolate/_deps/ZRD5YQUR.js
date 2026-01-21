import {
  c as h,
  d as Bo,
  e as te,
  h as Jo,
  i as Mo,
  k as dn,
  m as nt,
  x as Wa
} from "./4U34M3I6.js";
import {
  a as o,
  c as Ka,
  d as $o,
  e as Na
} from "./RUVYHBJQ.js";

// node_modules/cookie/dist/index.js
var Go = Ka((oe) => {
  "use strict";
  Object.defineProperty(oe, "__esModule", { value: !0 });
  oe.parseCookie = Vo;
  oe.parse = Vo;
  oe.stringifyCookie = ja;
  oe.stringifySetCookie = Ut;
  oe.serialize = Ut;
  oe.parseSetCookie = Va;
  oe.stringifySetCookie = Ut;
  oe.serialize = Ut;
  var zo = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/, jo = /^[\u0021-\u003A\u003C-\u007E]*$/, $a = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i, Ba = /^[\u0020-\u003A\u003D-\u007E]*$/, Ja = /^-?\d+$/, Ma = Object.prototype.toString, za = /* @__PURE__ */ (() => {
    let e = /* @__PURE__ */ o(function() {
    }, "C");
    return e.prototype = /* @__PURE__ */ Object.create(null), e;
  })();
  function Vo(e, t) {
    let r = new za(), n = e.length;
    if (n < 2)
      return r;
    let i = t?.decode || Fo, s = 0;
    do {
      let a = fn(e, s, n);
      if (a === -1)
        break;
      let c = ln(e, s, n);
      if (a > c) {
        s = e.lastIndexOf(";", a - 1) + 1;
        continue;
      }
      let d = pe(e, s, a);
      r[d] === void 0 && (r[d] = i(pe(e, a + 1, c))), s = c + 1;
    } while (s < n);
    return r;
  }
  o(Vo, "parseCookie");
  function ja(e, t) {
    let r = t?.encode || encodeURIComponent, n = [];
    for (let i of Object.keys(e)) {
      let s = e[i];
      if (s === void 0)
        continue;
      if (!zo.test(i))
        throw new TypeError(`cookie name is invalid: ${i}`);
      let a = r(s);
      if (!jo.test(a))
        throw new TypeError(`cookie val is invalid: ${s}`);
      n.push(`${i}=${a}`);
    }
    return n.join("; ");
  }
  o(ja, "stringifyCookie");
  function Ut(e, t, r) {
    let n = typeof e == "object" ? e : { ...r, name: e, value: String(t) }, s = (typeof t == "object" ? t : r)?.encode || encodeURIComponent;
    if (!zo.test(n.name))
      throw new TypeError(`argument name is invalid: ${n.name}`);
    let a = n.value ? s(n.value) : "";
    if (!jo.test(a))
      throw new TypeError(`argument val is invalid: ${n.value}`);
    let c = n.name + "=" + a;
    if (n.maxAge !== void 0) {
      if (!Number.isInteger(n.maxAge))
        throw new TypeError(`option maxAge is invalid: ${n.maxAge}`);
      c += "; Max-Age=" + n.maxAge;
    }
    if (n.domain) {
      if (!$a.test(n.domain))
        throw new TypeError(`option domain is invalid: ${n.domain}`);
      c += "; Domain=" + n.domain;
    }
    if (n.path) {
      if (!Ba.test(n.path))
        throw new TypeError(`option path is invalid: ${n.path}`);
      c += "; Path=" + n.path;
    }
    if (n.expires) {
      if (!Fa(n.expires) || !Number.isFinite(n.expires.valueOf()))
        throw new TypeError(`option expires is invalid: ${n.expires}`);
      c += "; Expires=" + n.expires.toUTCString();
    }
    if (n.httpOnly && (c += "; HttpOnly"), n.secure && (c += "; Secure"), n.partitioned && (c += "; Partitioned"), n.priority)
      switch (typeof n.priority == "string" ? n.priority.toLowerCase() : void 0) {
        case "low":
          c += "; Priority=Low";
          break;
        case "medium":
          c += "; Priority=Medium";
          break;
        case "high":
          c += "; Priority=High";
          break;
        default:
          throw new TypeError(`option priority is invalid: ${n.priority}`);
      }
    if (n.sameSite)
      switch (typeof n.sameSite == "string" ? n.sameSite.toLowerCase() : n.sameSite) {
        case !0:
        case "strict":
          c += "; SameSite=Strict";
          break;
        case "lax":
          c += "; SameSite=Lax";
          break;
        case "none":
          c += "; SameSite=None";
          break;
        default:
          throw new TypeError(`option sameSite is invalid: ${n.sameSite}`);
      }
    return c;
  }
  o(Ut, "stringifySetCookie");
  function Va(e, t) {
    let r = t?.decode || Fo, n = e.length, i = ln(e, 0, n), s = fn(e, 0, i), a = s === -1 ? { name: "", value: r(pe(e, 0, i)) } : {
      name: pe(e, 0, s),
      value: r(pe(e, s + 1, i))
    }, c = i + 1;
    for (; c < n; ) {
      let d = ln(e, c, n), u = fn(e, c, d), f = u === -1 ? pe(e, c, d) : pe(e, c, u), l = u === -1 ? void 0 : pe(e, u + 1, d);
      switch (f.toLowerCase()) {
        case "httponly":
          a.httpOnly = !0;
          break;
        case "secure":
          a.secure = !0;
          break;
        case "partitioned":
          a.partitioned = !0;
          break;
        case "domain":
          a.domain = l;
          break;
        case "path":
          a.path = l;
          break;
        case "max-age":
          l && Ja.test(l) && (a.maxAge = Number(l));
          break;
        case "expires":
          if (!l)
            break;
          let y = new Date(l);
          Number.isFinite(y.valueOf()) && (a.expires = y);
          break;
        case "priority":
          if (!l)
            break;
          let p = l.toLowerCase();
          (p === "low" || p === "medium" || p === "high") && (a.priority = p);
          break;
        case "samesite":
          if (!l)
            break;
          let m = l.toLowerCase();
          (m === "lax" || m === "strict" || m === "none") && (a.sameSite = m);
          break;
      }
      c = d + 1;
    }
    return a;
  }
  o(Va, "parseSetCookie");
  function ln(e, t, r) {
    let n = e.indexOf(";", t);
    return n === -1 ? r : n;
  }
  o(ln, "endIndex");
  function fn(e, t, r) {
    let n = e.indexOf("=", t);
    return n < r ? n : -1;
  }
  o(fn, "eqIndex");
  function pe(e, t, r) {
    let n = t, i = r;
    do {
      let s = e.charCodeAt(n);
      if (s !== 32 && s !== 9)
        break;
    } while (++n < i);
    for (; i > n; ) {
      let s = e.charCodeAt(i - 1);
      if (s !== 32 && s !== 9)
        break;
      i--;
    }
    return e.slice(n, i);
  }
  o(pe, "valueSlice");
  function Fo(e) {
    if (e.indexOf("%") === -1)
      return e;
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }
  o(Fo, "decode");
  function Fa(e) {
    return Ma.call(e) === "[object Date]";
  }
  o(Fa, "isDate");
});

// node_modules/@convex-dev/auth/dist/server/implementation/index.js
Wa();
te();
var un = Na(Go(), 1);

// node_modules/@convex-dev/auth/dist/server/utils.js
function F(e) {
  let t = process.env[e];
  if (t === void 0)
    throw new Error(`Missing environment variable \`${e}\``);
  return t;
}
o(F, "requireEnv");
function Ot(e) {
  return /(localhost|127\.0\.0\.1):\d+/.test(e ?? "");
}
o(Ot, "isLocalHost");

// node_modules/@convex-dev/auth/dist/server/cookies.js
var ie = {
  httpOnly: !0,
  sameSite: "none",
  secure: !0,
  path: "/",
  partitioned: !0
}, Ga = 900;
function qo(e, t) {
  return {
    name: Zo(e),
    value: t,
    options: { ...ie, maxAge: Ga }
  };
}
o(qo, "redirectToParamCookie");
function Xo(e, t) {
  let r = Zo(e), n = t[r];
  if (n === void 0)
    return null;
  let i = {
    name: r,
    value: "",
    options: { ...ie, maxAge: 0 }
  };
  return { redirectTo: n, updatedCookie: i };
}
o(Xo, "useRedirectToParam");
function Zo(e) {
  return (Ot(process.env.CONVEX_SITE_URL) ? "" : "__Host-") + e + "RedirectTo";
}
o(Zo, "redirectToParamCookieName");

// node_modules/@auth/core/lib/utils/cookie.js
var Ke = function(e, t, r, n) {
  if (r === "a" && !n) throw new TypeError("Private accessor was defined without a getter");
  if (typeof t == "function" ? e !== t || !n : !t.has(e)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return r === "m" ? n : r === "a" ? n.call(e) : n ? n.value : t.get(e);
}, qa, ot, Qo, Yo, Xa, Za;
ot = /* @__PURE__ */ new WeakMap(), Qo = /* @__PURE__ */ new WeakMap(), Yo = /* @__PURE__ */ new WeakMap(), qa = /* @__PURE__ */ new WeakSet(), Xa = /* @__PURE__ */ o(function(t) {
  let r = Math.ceil(t.value.length / 3936);
  if (r === 1)
    return Ke(this, ot, "f")[t.name] = t.value, [t];
  let n = [];
  for (let i = 0; i < r; i++) {
    let s = `${t.name}.${i}`, a = t.value.substr(i * 3936, 3936);
    n.push({ ...t, name: s, value: a }), Ke(this, ot, "f")[s] = a;
  }
  return Ke(this, Yo, "f").debug("CHUNKING_SESSION_COOKIE", {
    message: "Session cookie exceeds allowed 4096 bytes.",
    emptyCookieSize: 160,
    valueSize: t.value.length,
    chunks: n.map((i) => i.value.length + 160)
  }), n;
}, "_SessionStore_chunk"), Za = /* @__PURE__ */ o(function() {
  let t = {};
  for (let r in Ke(this, ot, "f"))
    delete Ke(this, ot, "f")?.[r], t[r] = {
      name: r,
      value: "",
      options: { ...Ke(this, Qo, "f").options, maxAge: 0 }
    };
  return t;
}, "_SessionStore_clean");

// node_modules/@auth/core/errors.js
var T = class extends Error {
  static {
    o(this, "AuthError");
  }
  constructor(t, r) {
    t instanceof Error ? super(void 0, {
      cause: { err: t, ...t.cause, ...r }
    }) : typeof t == "string" ? (r instanceof Error && (r = { err: r, ...r.cause }), super(t, r)) : super(void 0, t), this.name = this.constructor.name, this.type = this.constructor.type ?? "AuthError", this.kind = this.constructor.kind ?? "error", Error.captureStackTrace?.(this, this.constructor);
    let n = `https://errors.authjs.dev#${this.type.toLowerCase()}`;
    this.message += `${this.message ? ". " : ""}Read more at ${n}`;
  }
}, se = class extends T {
  static {
    o(this, "SignInError");
  }
};
se.kind = "signIn";
var it = class extends T {
  static {
    o(this, "AdapterError");
  }
};
it.type = "AdapterError";
var st = class extends T {
  static {
    o(this, "AccessDenied");
  }
};
st.type = "AccessDenied";
var Lt = class extends T {
  static {
    o(this, "CallbackRouteError");
  }
};
Lt.type = "CallbackRouteError";
var Ht = class extends T {
  static {
    o(this, "ErrorPageLoop");
  }
};
Ht.type = "ErrorPageLoop";
var Dt = class extends T {
  static {
    o(this, "EventError");
  }
};
Dt.type = "EventError";
var Kt = class extends T {
  static {
    o(this, "InvalidCallbackUrl");
  }
};
Kt.type = "InvalidCallbackUrl";
var at = class extends se {
  static {
    o(this, "CredentialsSignin");
  }
  constructor() {
    super(...arguments), this.code = "credentials";
  }
};
at.type = "CredentialsSignin";
var Nt = class extends T {
  static {
    o(this, "InvalidEndpoints");
  }
};
Nt.type = "InvalidEndpoints";
var he = class extends T {
  static {
    o(this, "InvalidCheck");
  }
};
he.type = "InvalidCheck";
var Wt = class extends T {
  static {
    o(this, "JWTSessionError");
  }
};
Wt.type = "JWTSessionError";
var ct = class extends T {
  static {
    o(this, "MissingAdapter");
  }
};
ct.type = "MissingAdapter";
var $t = class extends T {
  static {
    o(this, "MissingAdapterMethods");
  }
};
$t.type = "MissingAdapterMethods";
var Bt = class extends T {
  static {
    o(this, "MissingAuthorize");
  }
};
Bt.type = "MissingAuthorize";
var ut = class extends T {
  static {
    o(this, "MissingSecret");
  }
};
ut.type = "MissingSecret";
var Jt = class extends se {
  static {
    o(this, "OAuthAccountNotLinked");
  }
};
Jt.type = "OAuthAccountNotLinked";
var Mt = class extends se {
  static {
    o(this, "OAuthCallbackError");
  }
};
Mt.type = "OAuthCallbackError";
var zt = class extends T {
  static {
    o(this, "OAuthProfileParseError");
  }
};
zt.type = "OAuthProfileParseError";
var jt = class extends T {
  static {
    o(this, "SessionTokenError");
  }
};
jt.type = "SessionTokenError";
var pn = class extends se {
  static {
    o(this, "OAuthSignInError");
  }
};
pn.type = "OAuthSignInError";
var hn = class extends se {
  static {
    o(this, "EmailSignInError");
  }
};
hn.type = "EmailSignInError";
var Vt = class extends T {
  static {
    o(this, "SignOutError");
  }
};
Vt.type = "SignOutError";
var Ne = class extends T {
  static {
    o(this, "UnknownAction");
  }
};
Ne.type = "UnknownAction";
var Ft = class extends T {
  static {
    o(this, "UnsupportedStrategy");
  }
};
Ft.type = "UnsupportedStrategy";
var dt = class extends T {
  static {
    o(this, "InvalidProvider");
  }
};
dt.type = "InvalidProvider";
var Gt = class extends T {
  static {
    o(this, "UntrustedHost");
  }
};
Gt.type = "UntrustedHost";
var qt = class extends T {
  static {
    o(this, "Verification");
  }
};
qt.type = "Verification";
var Xt = class extends se {
  static {
    o(this, "MissingCSRF");
  }
};
Xt.type = "MissingCSRF";
var Zt = class extends T {
  static {
    o(this, "DuplicateConditionalUI");
  }
};
Zt.type = "DuplicateConditionalUI";
var Qt = class extends T {
  static {
    o(this, "MissingWebAuthnAutocomplete");
  }
};
Qt.type = "MissingWebAuthnAutocomplete";
var Yt = class extends T {
  static {
    o(this, "WebAuthnVerificationError");
  }
};
Yt.type = "WebAuthnVerificationError";
var er = class extends se {
  static {
    o(this, "AccountNotLinked");
  }
};
er.type = "AccountNotLinked";
var tr = class extends T {
  static {
    o(this, "ExperimentalFeatureNotEnabled");
  }
};
tr.type = "ExperimentalFeatureNotEnabled";

// node_modules/@panva/hkdf/dist/web/runtime/hkdf.js
var Ya = /* @__PURE__ */ o(() => {
  if (typeof globalThis < "u")
    return globalThis;
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  throw new Error("unable to locate global object");
}, "getGlobal"), ti = /* @__PURE__ */ o(async (e, t, r, n, i) => {
  let { crypto: { subtle: s } } = Ya();
  return new Uint8Array(await s.deriveBits({
    name: "HKDF",
    hash: `SHA-${e.substr(3)}`,
    salt: r,
    info: n
  }, await s.importKey("raw", t, "HKDF", !1, ["deriveBits"]), i << 3));
}, "default");

// node_modules/@panva/hkdf/dist/web/index.js
function ec(e) {
  switch (e) {
    case "sha256":
    case "sha384":
    case "sha512":
    case "sha1":
      return e;
    default:
      throw new TypeError('unsupported "digest" value');
  }
}
o(ec, "normalizeDigest");
function mn(e, t) {
  if (typeof e == "string")
    return new TextEncoder().encode(e);
  if (!(e instanceof Uint8Array))
    throw new TypeError(`"${t}"" must be an instance of Uint8Array or a string`);
  return e;
}
o(mn, "normalizeUint8Array");
function tc(e) {
  let t = mn(e, "ikm");
  if (!t.byteLength)
    throw new TypeError('"ikm" must be at least one byte in length');
  return t;
}
o(tc, "normalizeIkm");
function rc(e) {
  let t = mn(e, "info");
  if (t.byteLength > 1024)
    throw TypeError('"info" must not contain more than 1024 bytes');
  return t;
}
o(rc, "normalizeInfo");
function nc(e, t) {
  if (typeof e != "number" || !Number.isInteger(e) || e < 1)
    throw new TypeError('"keylen" must be a positive integer');
  let r = parseInt(t.substr(3), 10) >> 3 || 20;
  if (e > 255 * r)
    throw new TypeError('"keylen" too large');
  return e;
}
o(nc, "normalizeKeylen");
async function ri(e, t, r, n, i) {
  return ti(ec(e), tc(t), mn(r, "salt"), rc(n), nc(i, e));
}
o(ri, "hkdf");

// node_modules/jose/dist/browser/runtime/webcrypto.js
var _ = crypto, K = /* @__PURE__ */ o((e) => e instanceof CryptoKey, "isCryptoKey");

// node_modules/jose/dist/browser/runtime/digest.js
var oc = /* @__PURE__ */ o(async (e, t) => {
  let r = `SHA-${e.slice(-3)}`;
  return new Uint8Array(await _.subtle.digest(r, t));
}, "digest"), rr = oc;

// node_modules/jose/dist/browser/lib/buffer_utils.js
var U = new TextEncoder(), Q = new TextDecoder(), nr = 2 ** 32;
function j(...e) {
  let t = e.reduce((i, { length: s }) => i + s, 0), r = new Uint8Array(t), n = 0;
  for (let i of e)
    r.set(i, n), n += i.length;
  return r;
}
o(j, "concat");
function ni(e, t) {
  return j(U.encode(e), new Uint8Array([0]), t);
}
o(ni, "p2s");
function yn(e, t, r) {
  if (t < 0 || t >= nr)
    throw new RangeError(`value must be >= 0 and <= ${nr - 1}. Received ${t}`);
  e.set([t >>> 24, t >>> 16, t >>> 8, t & 255], r);
}
o(yn, "writeUInt32BE");
function or(e) {
  let t = Math.floor(e / nr), r = e % nr, n = new Uint8Array(8);
  return yn(n, t, 0), yn(n, r, 4), n;
}
o(or, "uint64be");
function ir(e) {
  let t = new Uint8Array(4);
  return yn(t, e), t;
}
o(ir, "uint32be");
function sr(e) {
  return j(ir(e.length), e);
}
o(sr, "lengthAndInput");
async function oi(e, t, r) {
  let n = Math.ceil((t >> 3) / 32), i = new Uint8Array(n * 32);
  for (let s = 0; s < n; s++) {
    let a = new Uint8Array(4 + e.length + r.length);
    a.set(ir(s + 1)), a.set(e, 4), a.set(r, 4 + e.length), i.set(await rr("sha256", a), s * 32);
  }
  return i.slice(0, t >> 3);
}
o(oi, "concatKdf");

// node_modules/jose/dist/browser/runtime/base64url.js
var ic = /* @__PURE__ */ o((e) => {
  let t = e;
  typeof t == "string" && (t = U.encode(t));
  let r = 32768, n = [];
  for (let i = 0; i < t.length; i += r)
    n.push(String.fromCharCode.apply(null, t.subarray(i, i + r)));
  return btoa(n.join(""));
}, "encodeBase64"), O = /* @__PURE__ */ o((e) => ic(e).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_"), "encode"), sc = /* @__PURE__ */ o((e) => {
  let t = atob(e), r = new Uint8Array(t.length);
  for (let n = 0; n < t.length; n++)
    r[n] = t.charCodeAt(n);
  return r;
}, "decodeBase64"), W = /* @__PURE__ */ o((e) => {
  let t = e;
  t instanceof Uint8Array && (t = Q.decode(t)), t = t.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  try {
    return sc(t);
  } catch {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
}, "decode");

// node_modules/jose/dist/browser/util/errors.js
var M = class extends Error {
  static {
    o(this, "JOSEError");
  }
  constructor(t, r) {
    super(t, r), this.code = "ERR_JOSE_GENERIC", this.name = this.constructor.name, Error.captureStackTrace?.(this, this.constructor);
  }
};
M.code = "ERR_JOSE_GENERIC";
var B = class extends M {
  static {
    o(this, "JWTClaimValidationFailed");
  }
  constructor(t, r, n = "unspecified", i = "unspecified") {
    super(t, { cause: { claim: n, reason: i, payload: r } }), this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED", this.claim = n, this.reason = i, this.payload = r;
  }
};
B.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
var We = class extends M {
  static {
    o(this, "JWTExpired");
  }
  constructor(t, r, n = "unspecified", i = "unspecified") {
    super(t, { cause: { claim: n, reason: i, payload: r } }), this.code = "ERR_JWT_EXPIRED", this.claim = n, this.reason = i, this.payload = r;
  }
};
We.code = "ERR_JWT_EXPIRED";
var $e = class extends M {
  static {
    o(this, "JOSEAlgNotAllowed");
  }
  constructor() {
    super(...arguments), this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
  }
};
$e.code = "ERR_JOSE_ALG_NOT_ALLOWED";
var E = class extends M {
  static {
    o(this, "JOSENotSupported");
  }
  constructor() {
    super(...arguments), this.code = "ERR_JOSE_NOT_SUPPORTED";
  }
};
E.code = "ERR_JOSE_NOT_SUPPORTED";
var Ee = class extends M {
  static {
    o(this, "JWEDecryptionFailed");
  }
  constructor(t = "decryption operation failed", r) {
    super(t, r), this.code = "ERR_JWE_DECRYPTION_FAILED";
  }
};
Ee.code = "ERR_JWE_DECRYPTION_FAILED";
var w = class extends M {
  static {
    o(this, "JWEInvalid");
  }
  constructor() {
    super(...arguments), this.code = "ERR_JWE_INVALID";
  }
};
w.code = "ERR_JWE_INVALID";
var de = class extends M {
  static {
    o(this, "JWSInvalid");
  }
  constructor() {
    super(...arguments), this.code = "ERR_JWS_INVALID";
  }
};
de.code = "ERR_JWS_INVALID";
var ke = class extends M {
  static {
    o(this, "JWTInvalid");
  }
  constructor() {
    super(...arguments), this.code = "ERR_JWT_INVALID";
  }
};
ke.code = "ERR_JWT_INVALID";
var lt = class extends M {
  static {
    o(this, "JWKInvalid");
  }
  constructor() {
    super(...arguments), this.code = "ERR_JWK_INVALID";
  }
};
lt.code = "ERR_JWK_INVALID";
var wn = class extends M {
  static {
    o(this, "JWKSInvalid");
  }
  constructor() {
    super(...arguments), this.code = "ERR_JWKS_INVALID";
  }
};
wn.code = "ERR_JWKS_INVALID";
var gn = class extends M {
  static {
    o(this, "JWKSNoMatchingKey");
  }
  constructor(t = "no applicable key found in the JSON Web Key Set", r) {
    super(t, r), this.code = "ERR_JWKS_NO_MATCHING_KEY";
  }
};
gn.code = "ERR_JWKS_NO_MATCHING_KEY";
var bn = class extends M {
  static {
    o(this, "JWKSMultipleMatchingKeys");
  }
  constructor(t = "multiple matching keys found in the JSON Web Key Set", r) {
    super(t, r), this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
  }
};
bn.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
var _n = class extends M {
  static {
    o(this, "JWKSTimeout");
  }
  constructor(t = "request timed out", r) {
    super(t, r), this.code = "ERR_JWKS_TIMEOUT";
  }
};
_n.code = "ERR_JWKS_TIMEOUT";
var xn = class extends M {
  static {
    o(this, "JWSSignatureVerificationFailed");
  }
  constructor(t = "signature verification failed", r) {
    super(t, r), this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
  }
};
xn.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";

// node_modules/jose/dist/browser/runtime/random.js
var Be = _.getRandomValues.bind(_);

// node_modules/jose/dist/browser/lib/iv.js
function Sn(e) {
  switch (e) {
    case "A128GCM":
    case "A128GCMKW":
    case "A192GCM":
    case "A192GCMKW":
    case "A256GCM":
    case "A256GCMKW":
      return 96;
    case "A128CBC-HS256":
    case "A192CBC-HS384":
    case "A256CBC-HS512":
      return 128;
    default:
      throw new E(`Unsupported JWE Algorithm: ${e}`);
  }
}
o(Sn, "bitLength");
var ii = /* @__PURE__ */ o((e) => Be(new Uint8Array(Sn(e) >> 3)), "default");

// node_modules/jose/dist/browser/lib/check_iv_length.js
var uc = /* @__PURE__ */ o((e, t) => {
  if (t.length << 3 !== Sn(e))
    throw new w("Invalid Initialization Vector length");
}, "checkIvLength"), ar = uc;

// node_modules/jose/dist/browser/runtime/check_cek_length.js
var dc = /* @__PURE__ */ o((e, t) => {
  let r = e.byteLength << 3;
  if (r !== t)
    throw new w(`Invalid Content Encryption Key length. Expected ${t} bits, got ${r} bits`);
}, "checkCekLength"), Je = dc;

// node_modules/jose/dist/browser/runtime/timing_safe_equal.js
var lc = /* @__PURE__ */ o((e, t) => {
  if (!(e instanceof Uint8Array))
    throw new TypeError("First argument must be a buffer");
  if (!(t instanceof Uint8Array))
    throw new TypeError("Second argument must be a buffer");
  if (e.length !== t.length)
    throw new TypeError("Input buffers must have the same length");
  let r = e.length, n = 0, i = -1;
  for (; ++i < r; )
    n |= e[i] ^ t[i];
  return n === 0;
}, "timingSafeEqual"), si = lc;

// node_modules/jose/dist/browser/lib/crypto_key.js
function J(e, t = "algorithm.name") {
  return new TypeError(`CryptoKey does not support this operation, its ${t} must be ${e}`);
}
o(J, "unusable");
function le(e, t) {
  return e.name === t;
}
o(le, "isAlgorithm");
function cr(e) {
  return parseInt(e.name.slice(4), 10);
}
o(cr, "getHashLength");
function fc(e) {
  switch (e) {
    case "ES256":
      return "P-256";
    case "ES384":
      return "P-384";
    case "ES512":
      return "P-521";
    default:
      throw new Error("unreachable");
  }
}
o(fc, "getNamedCurve");
function ai(e, t) {
  if (t.length && !t.some((r) => e.usages.includes(r))) {
    let r = "CryptoKey does not support this operation, its usages must include ";
    if (t.length > 2) {
      let n = t.pop();
      r += `one of ${t.join(", ")}, or ${n}.`;
    } else t.length === 2 ? r += `one of ${t[0]} or ${t[1]}.` : r += `${t[0]}.`;
    throw new TypeError(r);
  }
}
o(ai, "checkUsage");
function ci(e, t, ...r) {
  switch (t) {
    case "HS256":
    case "HS384":
    case "HS512": {
      if (!le(e.algorithm, "HMAC"))
        throw J("HMAC");
      let n = parseInt(t.slice(2), 10);
      if (cr(e.algorithm.hash) !== n)
        throw J(`SHA-${n}`, "algorithm.hash");
      break;
    }
    case "RS256":
    case "RS384":
    case "RS512": {
      if (!le(e.algorithm, "RSASSA-PKCS1-v1_5"))
        throw J("RSASSA-PKCS1-v1_5");
      let n = parseInt(t.slice(2), 10);
      if (cr(e.algorithm.hash) !== n)
        throw J(`SHA-${n}`, "algorithm.hash");
      break;
    }
    case "PS256":
    case "PS384":
    case "PS512": {
      if (!le(e.algorithm, "RSA-PSS"))
        throw J("RSA-PSS");
      let n = parseInt(t.slice(2), 10);
      if (cr(e.algorithm.hash) !== n)
        throw J(`SHA-${n}`, "algorithm.hash");
      break;
    }
    case "EdDSA": {
      if (e.algorithm.name !== "Ed25519" && e.algorithm.name !== "Ed448")
        throw J("Ed25519 or Ed448");
      break;
    }
    case "Ed25519": {
      if (!le(e.algorithm, "Ed25519"))
        throw J("Ed25519");
      break;
    }
    case "ES256":
    case "ES384":
    case "ES512": {
      if (!le(e.algorithm, "ECDSA"))
        throw J("ECDSA");
      let n = fc(t);
      if (e.algorithm.namedCurve !== n)
        throw J(n, "algorithm.namedCurve");
      break;
    }
    default:
      throw new TypeError("CryptoKey does not support this operation");
  }
  ai(e, r);
}
o(ci, "checkSigCryptoKey");
function G(e, t, ...r) {
  switch (t) {
    case "A128GCM":
    case "A192GCM":
    case "A256GCM": {
      if (!le(e.algorithm, "AES-GCM"))
        throw J("AES-GCM");
      let n = parseInt(t.slice(1, 4), 10);
      if (e.algorithm.length !== n)
        throw J(n, "algorithm.length");
      break;
    }
    case "A128KW":
    case "A192KW":
    case "A256KW": {
      if (!le(e.algorithm, "AES-KW"))
        throw J("AES-KW");
      let n = parseInt(t.slice(1, 4), 10);
      if (e.algorithm.length !== n)
        throw J(n, "algorithm.length");
      break;
    }
    case "ECDH": {
      switch (e.algorithm.name) {
        case "ECDH":
        case "X25519":
        case "X448":
          break;
        default:
          throw J("ECDH, X25519, or X448");
      }
      break;
    }
    case "PBES2-HS256+A128KW":
    case "PBES2-HS384+A192KW":
    case "PBES2-HS512+A256KW":
      if (!le(e.algorithm, "PBKDF2"))
        throw J("PBKDF2");
      break;
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512": {
      if (!le(e.algorithm, "RSA-OAEP"))
        throw J("RSA-OAEP");
      let n = parseInt(t.slice(9), 10) || 1;
      if (cr(e.algorithm.hash) !== n)
        throw J(`SHA-${n}`, "algorithm.hash");
      break;
    }
    default:
      throw new TypeError("CryptoKey does not support this operation");
  }
  ai(e, r);
}
o(G, "checkEncCryptoKey");

// node_modules/jose/dist/browser/lib/invalid_key_input.js
function ui(e, t, ...r) {
  if (r = r.filter(Boolean), r.length > 2) {
    let n = r.pop();
    e += `one of type ${r.join(", ")}, or ${n}.`;
  } else r.length === 2 ? e += `one of type ${r[0]} or ${r[1]}.` : e += `of type ${r[0]}.`;
  return t == null ? e += ` Received ${t}` : typeof t == "function" && t.name ? e += ` Received function ${t.name}` : typeof t == "object" && t != null && t.constructor?.name && (e += ` Received an instance of ${t.constructor.name}`), e;
}
o(ui, "message");
var N = /* @__PURE__ */ o((e, ...t) => ui("Key must be ", e, ...t), "default");
function vn(e, t, ...r) {
  return ui(`Key for the ${e} algorithm must be `, t, ...r);
}
o(vn, "withAlg");

// node_modules/jose/dist/browser/runtime/is_key_like.js
var An = /* @__PURE__ */ o((e) => K(e) ? !0 : e?.[Symbol.toStringTag] === "KeyObject", "default"), H = ["CryptoKey"];

// node_modules/jose/dist/browser/runtime/decrypt.js
async function pc(e, t, r, n, i, s) {
  if (!(t instanceof Uint8Array))
    throw new TypeError(N(t, "Uint8Array"));
  let a = parseInt(e.slice(1, 4), 10), c = await _.subtle.importKey("raw", t.subarray(a >> 3), "AES-CBC", !1, ["decrypt"]), d = await _.subtle.importKey("raw", t.subarray(0, a >> 3), {
    hash: `SHA-${a << 1}`,
    name: "HMAC"
  }, !1, ["sign"]), u = j(s, n, r, or(s.length << 3)), f = new Uint8Array((await _.subtle.sign("HMAC", d, u)).slice(0, a >> 3)), l;
  try {
    l = si(i, f);
  } catch {
  }
  if (!l)
    throw new Ee();
  let y;
  try {
    y = new Uint8Array(await _.subtle.decrypt({ iv: n, name: "AES-CBC" }, c, r));
  } catch {
  }
  if (!y)
    throw new Ee();
  return y;
}
o(pc, "cbcDecrypt");
async function hc(e, t, r, n, i, s) {
  let a;
  t instanceof Uint8Array ? a = await _.subtle.importKey("raw", t, "AES-GCM", !1, ["decrypt"]) : (G(t, e, "decrypt"), a = t);
  try {
    return new Uint8Array(await _.subtle.decrypt({
      additionalData: s,
      iv: n,
      name: "AES-GCM",
      tagLength: 128
    }, a, j(r, i)));
  } catch {
    throw new Ee();
  }
}
o(hc, "gcmDecrypt");
var mc = /* @__PURE__ */ o(async (e, t, r, n, i, s) => {
  if (!K(t) && !(t instanceof Uint8Array))
    throw new TypeError(N(t, ...H, "Uint8Array"));
  if (!n)
    throw new w("JWE Initialization Vector missing");
  if (!i)
    throw new w("JWE Authentication Tag missing");
  switch (ar(e, n), e) {
    case "A128CBC-HS256":
    case "A192CBC-HS384":
    case "A256CBC-HS512":
      return t instanceof Uint8Array && Je(t, parseInt(e.slice(-3), 10)), pc(e, t, r, n, i, s);
    case "A128GCM":
    case "A192GCM":
    case "A256GCM":
      return t instanceof Uint8Array && Je(t, parseInt(e.slice(1, 4), 10)), hc(e, t, r, n, i, s);
    default:
      throw new E("Unsupported JWE Content Encryption Algorithm");
  }
}, "decrypt"), ur = mc;

// node_modules/jose/dist/browser/lib/is_disjoint.js
var yc = /* @__PURE__ */ o((...e) => {
  let t = e.filter(Boolean);
  if (t.length === 0 || t.length === 1)
    return !0;
  let r;
  for (let n of t) {
    let i = Object.keys(n);
    if (!r || r.size === 0) {
      r = new Set(i);
      continue;
    }
    for (let s of i) {
      if (r.has(s))
        return !1;
      r.add(s);
    }
  }
  return !0;
}, "isDisjoint"), Me = yc;

// node_modules/jose/dist/browser/lib/is_object.js
function wc(e) {
  return typeof e == "object" && e !== null;
}
o(wc, "isObjectLike");
function z(e) {
  if (!wc(e) || Object.prototype.toString.call(e) !== "[object Object]")
    return !1;
  if (Object.getPrototypeOf(e) === null)
    return !0;
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; )
    t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t;
}
o(z, "isObject");

// node_modules/jose/dist/browser/runtime/bogus.js
var gc = [
  { hash: "SHA-256", name: "HMAC" },
  !0,
  ["sign"]
], ze = gc;

// node_modules/jose/dist/browser/runtime/aeskw.js
function di(e, t) {
  if (e.algorithm.length !== parseInt(t.slice(1, 4), 10))
    throw new TypeError(`Invalid key size for alg: ${t}`);
}
o(di, "checkKeySize");
function li(e, t, r) {
  if (K(e))
    return G(e, t, r), e;
  if (e instanceof Uint8Array)
    return _.subtle.importKey("raw", e, "AES-KW", !0, [r]);
  throw new TypeError(N(e, ...H, "Uint8Array"));
}
o(li, "getCryptoKey");
var ft = /* @__PURE__ */ o(async (e, t, r) => {
  let n = await li(t, e, "wrapKey");
  di(n, e);
  let i = await _.subtle.importKey("raw", r, ...ze);
  return new Uint8Array(await _.subtle.wrapKey("raw", i, n, "AES-KW"));
}, "wrap"), pt = /* @__PURE__ */ o(async (e, t, r) => {
  let n = await li(t, e, "unwrapKey");
  di(n, e);
  let i = await _.subtle.unwrapKey("raw", r, n, "AES-KW", ...ze);
  return new Uint8Array(await _.subtle.exportKey("raw", i));
}, "unwrap");

// node_modules/jose/dist/browser/runtime/ecdhes.js
async function dr(e, t, r, n, i = new Uint8Array(0), s = new Uint8Array(0)) {
  if (!K(e))
    throw new TypeError(N(e, ...H));
  if (G(e, "ECDH"), !K(t))
    throw new TypeError(N(t, ...H));
  G(t, "ECDH", "deriveBits");
  let a = j(sr(U.encode(r)), sr(i), sr(s), ir(n)), c;
  e.algorithm.name === "X25519" ? c = 256 : e.algorithm.name === "X448" ? c = 448 : c = Math.ceil(parseInt(e.algorithm.namedCurve.substr(-3), 10) / 8) << 3;
  let d = new Uint8Array(await _.subtle.deriveBits({
    name: e.algorithm.name,
    public: e
  }, t, c));
  return oi(d, n, a);
}
o(dr, "deriveKey");
async function fi(e) {
  if (!K(e))
    throw new TypeError(N(e, ...H));
  return _.subtle.generateKey(e.algorithm, !0, ["deriveBits"]);
}
o(fi, "generateEpk");
function lr(e) {
  if (!K(e))
    throw new TypeError(N(e, ...H));
  return ["P-256", "P-384", "P-521"].includes(e.algorithm.namedCurve) || e.algorithm.name === "X25519" || e.algorithm.name === "X448";
}
o(lr, "ecdhAllowed");

// node_modules/jose/dist/browser/lib/check_p2s.js
function En(e) {
  if (!(e instanceof Uint8Array) || e.length < 8)
    throw new w("PBES2 Salt Input must be 8 or more octets");
}
o(En, "checkP2s");

// node_modules/jose/dist/browser/runtime/pbes2kw.js
function bc(e, t) {
  if (e instanceof Uint8Array)
    return _.subtle.importKey("raw", e, "PBKDF2", !1, ["deriveBits"]);
  if (K(e))
    return G(e, t, "deriveBits", "deriveKey"), e;
  throw new TypeError(N(e, ...H, "Uint8Array"));
}
o(bc, "getCryptoKey");
async function hi(e, t, r, n) {
  En(e);
  let i = ni(t, e), s = parseInt(t.slice(13, 16), 10), a = {
    hash: `SHA-${t.slice(8, 11)}`,
    iterations: r,
    name: "PBKDF2",
    salt: i
  }, c = {
    length: s,
    name: "AES-KW"
  }, d = await bc(n, t);
  if (d.usages.includes("deriveBits"))
    return new Uint8Array(await _.subtle.deriveBits(a, d, s));
  if (d.usages.includes("deriveKey"))
    return _.subtle.deriveKey(a, d, c, !1, ["wrapKey", "unwrapKey"]);
  throw new TypeError('PBKDF2 key "usages" must include "deriveBits" or "deriveKey"');
}
o(hi, "deriveKey");
var mi = /* @__PURE__ */ o(async (e, t, r, n = 2048, i = Be(new Uint8Array(16))) => {
  let s = await hi(i, e, n, t);
  return { encryptedKey: await ft(e.slice(-6), s, r), p2c: n, p2s: O(i) };
}, "encrypt"), yi = /* @__PURE__ */ o(async (e, t, r, n, i) => {
  let s = await hi(i, e, n, t);
  return pt(e.slice(-6), s, r);
}, "decrypt");

// node_modules/jose/dist/browser/runtime/subtle_rsaes.js
function je(e) {
  switch (e) {
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512":
      return "RSA-OAEP";
    default:
      throw new E(`alg ${e} is not supported either by JOSE or your javascript runtime`);
  }
}
o(je, "subtleRsaEs");

// node_modules/jose/dist/browser/runtime/check_key_length.js
var ht = /* @__PURE__ */ o((e, t) => {
  if (e.startsWith("RS") || e.startsWith("PS")) {
    let { modulusLength: r } = t.algorithm;
    if (typeof r != "number" || r < 2048)
      throw new TypeError(`${e} requires key modulusLength to be 2048 bits or larger`);
  }
}, "default");

// node_modules/jose/dist/browser/runtime/rsaes.js
var wi = /* @__PURE__ */ o(async (e, t, r) => {
  if (!K(t))
    throw new TypeError(N(t, ...H));
  if (G(t, e, "encrypt", "wrapKey"), ht(e, t), t.usages.includes("encrypt"))
    return new Uint8Array(await _.subtle.encrypt(je(e), t, r));
  if (t.usages.includes("wrapKey")) {
    let n = await _.subtle.importKey("raw", r, ...ze);
    return new Uint8Array(await _.subtle.wrapKey("raw", n, t, je(e)));
  }
  throw new TypeError('RSA-OAEP key "usages" must include "encrypt" or "wrapKey" for this operation');
}, "encrypt"), gi = /* @__PURE__ */ o(async (e, t, r) => {
  if (!K(t))
    throw new TypeError(N(t, ...H));
  if (G(t, e, "decrypt", "unwrapKey"), ht(e, t), t.usages.includes("decrypt"))
    return new Uint8Array(await _.subtle.decrypt(je(e), t, r));
  if (t.usages.includes("unwrapKey")) {
    let n = await _.subtle.unwrapKey("raw", r, t, je(e), ...ze);
    return new Uint8Array(await _.subtle.exportKey("raw", n));
  }
  throw new TypeError('RSA-OAEP key "usages" must include "decrypt" or "unwrapKey" for this operation');
}, "decrypt");

// node_modules/jose/dist/browser/lib/is_jwk.js
function Ie(e) {
  return z(e) && typeof e.kty == "string";
}
o(Ie, "isJWK");
function bi(e) {
  return e.kty !== "oct" && typeof e.d == "string";
}
o(bi, "isPrivateJWK");
function _i(e) {
  return e.kty !== "oct" && typeof e.d > "u";
}
o(_i, "isPublicJWK");
function xi(e) {
  return Ie(e) && e.kty === "oct" && typeof e.k == "string";
}
o(xi, "isSecretJWK");

// node_modules/jose/dist/browser/runtime/jwk_to_key.js
function xc(e) {
  let t, r;
  switch (e.kty) {
    case "RSA": {
      switch (e.alg) {
        case "PS256":
        case "PS384":
        case "PS512":
          t = { name: "RSA-PSS", hash: `SHA-${e.alg.slice(-3)}` }, r = e.d ? ["sign"] : ["verify"];
          break;
        case "RS256":
        case "RS384":
        case "RS512":
          t = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${e.alg.slice(-3)}` }, r = e.d ? ["sign"] : ["verify"];
          break;
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
          t = {
            name: "RSA-OAEP",
            hash: `SHA-${parseInt(e.alg.slice(-3), 10) || 1}`
          }, r = e.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
          break;
        default:
          throw new E('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "EC": {
      switch (e.alg) {
        case "ES256":
          t = { name: "ECDSA", namedCurve: "P-256" }, r = e.d ? ["sign"] : ["verify"];
          break;
        case "ES384":
          t = { name: "ECDSA", namedCurve: "P-384" }, r = e.d ? ["sign"] : ["verify"];
          break;
        case "ES512":
          t = { name: "ECDSA", namedCurve: "P-521" }, r = e.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          t = { name: "ECDH", namedCurve: e.crv }, r = e.d ? ["deriveBits"] : [];
          break;
        default:
          throw new E('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "OKP": {
      switch (e.alg) {
        case "Ed25519":
          t = { name: "Ed25519" }, r = e.d ? ["sign"] : ["verify"];
          break;
        case "EdDSA":
          t = { name: e.crv }, r = e.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          t = { name: e.crv }, r = e.d ? ["deriveBits"] : [];
          break;
        default:
          throw new E('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    default:
      throw new E('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
  }
  return { algorithm: t, keyUsages: r };
}
o(xc, "subtleMapping");
var Sc = /* @__PURE__ */ o(async (e) => {
  if (!e.alg)
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
  let { algorithm: t, keyUsages: r } = xc(e), n = [
    t,
    e.ext ?? !1,
    e.key_ops ?? r
  ], i = { ...e };
  return delete i.alg, delete i.use, _.subtle.importKey("jwk", i, ...n);
}, "parse"), fr = Sc;

// node_modules/jose/dist/browser/runtime/normalize_key.js
var Si = /* @__PURE__ */ o((e) => W(e), "exportKeyValue"), Ve, Fe, vi = /* @__PURE__ */ o((e) => e?.[Symbol.toStringTag] === "KeyObject", "isKeyObject"), pr = /* @__PURE__ */ o(async (e, t, r, n, i = !1) => {
  let s = e.get(t);
  if (s?.[n])
    return s[n];
  let a = await fr({ ...r, alg: n });
  return i && Object.freeze(t), s ? s[n] = a : e.set(t, { [n]: a }), a;
}, "importAndCache"), vc = /* @__PURE__ */ o((e, t) => {
  if (vi(e)) {
    let r = e.export({ format: "jwk" });
    return delete r.d, delete r.dp, delete r.dq, delete r.p, delete r.q, delete r.qi, r.k ? Si(r.k) : (Fe || (Fe = /* @__PURE__ */ new WeakMap()), pr(Fe, e, r, t));
  }
  return Ie(e) ? e.k ? W(e.k) : (Fe || (Fe = /* @__PURE__ */ new WeakMap()), pr(Fe, e, e, t, !0)) : e;
}, "normalizePublicKey"), Ac = /* @__PURE__ */ o((e, t) => {
  if (vi(e)) {
    let r = e.export({ format: "jwk" });
    return r.k ? Si(r.k) : (Ve || (Ve = /* @__PURE__ */ new WeakMap()), pr(Ve, e, r, t));
  }
  return Ie(e) ? e.k ? W(e.k) : (Ve || (Ve = /* @__PURE__ */ new WeakMap()), pr(Ve, e, e, t, !0)) : e;
}, "normalizePrivateKey"), Te = { normalizePublicKey: vc, normalizePrivateKey: Ac };

// node_modules/jose/dist/browser/lib/cek.js
function mt(e) {
  switch (e) {
    case "A128GCM":
      return 128;
    case "A192GCM":
      return 192;
    case "A256GCM":
    case "A128CBC-HS256":
      return 256;
    case "A192CBC-HS384":
      return 384;
    case "A256CBC-HS512":
      return 512;
    default:
      throw new E(`Unsupported JWE Algorithm: ${e}`);
  }
}
o(mt, "bitLength");
var me = /* @__PURE__ */ o((e) => Be(new Uint8Array(mt(e) >> 3)), "default");

// node_modules/jose/dist/browser/runtime/asn1.js
var ye = /* @__PURE__ */ o((e, t, r = 0) => {
  r === 0 && (t.unshift(t.length), t.unshift(6));
  let n = e.indexOf(t[0], r);
  if (n === -1)
    return !1;
  let i = e.subarray(n, n + t.length);
  return i.length !== t.length ? !1 : i.every((s, a) => s === t[a]) || ye(e, t, n + 1);
}, "findOid"), Ai = /* @__PURE__ */ o((e) => {
  switch (!0) {
    case ye(e, [42, 134, 72, 206, 61, 3, 1, 7]):
      return "P-256";
    case ye(e, [43, 129, 4, 0, 34]):
      return "P-384";
    case ye(e, [43, 129, 4, 0, 35]):
      return "P-521";
    case ye(e, [43, 101, 110]):
      return "X25519";
    case ye(e, [43, 101, 111]):
      return "X448";
    case ye(e, [43, 101, 112]):
      return "Ed25519";
    case ye(e, [43, 101, 113]):
      return "Ed448";
    default:
      throw new E("Invalid or unsupported EC Key Curve or OKP Key Sub Type");
  }
}, "getNamedCurve"), Ec = /* @__PURE__ */ o(async (e, t, r, n, i) => {
  let s, a, c = new Uint8Array(atob(r.replace(e, "")).split("").map((u) => u.charCodeAt(0))), d = t === "spki";
  switch (n) {
    case "PS256":
    case "PS384":
    case "PS512":
      s = { name: "RSA-PSS", hash: `SHA-${n.slice(-3)}` }, a = d ? ["verify"] : ["sign"];
      break;
    case "RS256":
    case "RS384":
    case "RS512":
      s = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${n.slice(-3)}` }, a = d ? ["verify"] : ["sign"];
      break;
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512":
      s = {
        name: "RSA-OAEP",
        hash: `SHA-${parseInt(n.slice(-3), 10) || 1}`
      }, a = d ? ["encrypt", "wrapKey"] : ["decrypt", "unwrapKey"];
      break;
    case "ES256":
      s = { name: "ECDSA", namedCurve: "P-256" }, a = d ? ["verify"] : ["sign"];
      break;
    case "ES384":
      s = { name: "ECDSA", namedCurve: "P-384" }, a = d ? ["verify"] : ["sign"];
      break;
    case "ES512":
      s = { name: "ECDSA", namedCurve: "P-521" }, a = d ? ["verify"] : ["sign"];
      break;
    case "ECDH-ES":
    case "ECDH-ES+A128KW":
    case "ECDH-ES+A192KW":
    case "ECDH-ES+A256KW": {
      let u = Ai(c);
      s = u.startsWith("P-") ? { name: "ECDH", namedCurve: u } : { name: u }, a = d ? [] : ["deriveBits"];
      break;
    }
    case "Ed25519":
      s = { name: "Ed25519" }, a = d ? ["verify"] : ["sign"];
      break;
    case "EdDSA":
      s = { name: Ai(c) }, a = d ? ["verify"] : ["sign"];
      break;
    default:
      throw new E('Invalid or unsupported "alg" (Algorithm) value');
  }
  return _.subtle.importKey(t, c, s, i?.extractable ?? !1, a);
}, "genericImport"), Ei = /* @__PURE__ */ o((e, t, r) => Ec(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, "pkcs8", e, t, r), "fromPKCS8");

// node_modules/jose/dist/browser/key/import.js
async function kn(e, t, r) {
  if (typeof e != "string" || e.indexOf("-----BEGIN PRIVATE KEY-----") !== 0)
    throw new TypeError('"pkcs8" must be PKCS#8 formatted string');
  return Ei(e, t, r);
}
o(kn, "importPKCS8");
async function In(e, t) {
  if (!z(e))
    throw new TypeError("JWK must be an object");
  switch (t || (t = e.alg), e.kty) {
    case "oct":
      if (typeof e.k != "string" || !e.k)
        throw new TypeError('missing "k" (Key Value) Parameter value');
      return W(e.k);
    case "RSA":
      if ("oth" in e && e.oth !== void 0)
        throw new E('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
    case "EC":
    case "OKP":
      return fr({ ...e, alg: t });
    default:
      throw new E('Unsupported "kty" (Key Type) Parameter value');
  }
}
o(In, "importJWK");

// node_modules/jose/dist/browser/lib/check_key_type.js
var Ge = /* @__PURE__ */ o((e) => e?.[Symbol.toStringTag], "tag"), Tn = /* @__PURE__ */ o((e, t, r) => {
  if (t.use !== void 0 && t.use !== "sig")
    throw new TypeError("Invalid key for this operation, when present its use must be sig");
  if (t.key_ops !== void 0 && t.key_ops.includes?.(r) !== !0)
    throw new TypeError(`Invalid key for this operation, when present its key_ops must include ${r}`);
  if (t.alg !== void 0 && t.alg !== e)
    throw new TypeError(`Invalid key for this operation, when present its alg must be ${e}`);
  return !0;
}, "jwkMatchesOp"), kc = /* @__PURE__ */ o((e, t, r, n) => {
  if (!(t instanceof Uint8Array)) {
    if (n && Ie(t)) {
      if (xi(t) && Tn(e, t, r))
        return;
      throw new TypeError('JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present');
    }
    if (!An(t))
      throw new TypeError(vn(e, t, ...H, "Uint8Array", n ? "JSON Web Key" : null));
    if (t.type !== "secret")
      throw new TypeError(`${Ge(t)} instances for symmetric algorithms must be of type "secret"`);
  }
}, "symmetricTypeCheck"), Ic = /* @__PURE__ */ o((e, t, r, n) => {
  if (n && Ie(t))
    switch (r) {
      case "sign":
        if (bi(t) && Tn(e, t, r))
          return;
        throw new TypeError("JSON Web Key for this operation be a private JWK");
      case "verify":
        if (_i(t) && Tn(e, t, r))
          return;
        throw new TypeError("JSON Web Key for this operation be a public JWK");
    }
  if (!An(t))
    throw new TypeError(vn(e, t, ...H, n ? "JSON Web Key" : null));
  if (t.type === "secret")
    throw new TypeError(`${Ge(t)} instances for asymmetric algorithms must not be of type "secret"`);
  if (r === "sign" && t.type === "public")
    throw new TypeError(`${Ge(t)} instances for asymmetric algorithm signing must be of type "private"`);
  if (r === "decrypt" && t.type === "public")
    throw new TypeError(`${Ge(t)} instances for asymmetric algorithm decryption must be of type "private"`);
  if (t.algorithm && r === "verify" && t.type === "private")
    throw new TypeError(`${Ge(t)} instances for asymmetric algorithm verifying must be of type "public"`);
  if (t.algorithm && r === "encrypt" && t.type === "private")
    throw new TypeError(`${Ge(t)} instances for asymmetric algorithm encryption must be of type "public"`);
}, "asymmetricTypeCheck");
function ki(e, t, r, n) {
  t.startsWith("HS") || t === "dir" || t.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(t) ? kc(t, r, n, e) : Ic(t, r, n, e);
}
o(ki, "checkKeyType");
var hr = ki.bind(void 0, !1), Ii = ki.bind(void 0, !0);

// node_modules/jose/dist/browser/runtime/encrypt.js
async function Tc(e, t, r, n, i) {
  if (!(r instanceof Uint8Array))
    throw new TypeError(N(r, "Uint8Array"));
  let s = parseInt(e.slice(1, 4), 10), a = await _.subtle.importKey("raw", r.subarray(s >> 3), "AES-CBC", !1, ["encrypt"]), c = await _.subtle.importKey("raw", r.subarray(0, s >> 3), {
    hash: `SHA-${s << 1}`,
    name: "HMAC"
  }, !1, ["sign"]), d = new Uint8Array(await _.subtle.encrypt({
    iv: n,
    name: "AES-CBC"
  }, a, t)), u = j(i, n, d, or(i.length << 3)), f = new Uint8Array((await _.subtle.sign("HMAC", c, u)).slice(0, s >> 3));
  return { ciphertext: d, tag: f, iv: n };
}
o(Tc, "cbcEncrypt");
async function Rc(e, t, r, n, i) {
  let s;
  r instanceof Uint8Array ? s = await _.subtle.importKey("raw", r, "AES-GCM", !1, ["encrypt"]) : (G(r, e, "encrypt"), s = r);
  let a = new Uint8Array(await _.subtle.encrypt({
    additionalData: i,
    iv: n,
    name: "AES-GCM",
    tagLength: 128
  }, s, t)), c = a.slice(-16);
  return { ciphertext: a.slice(0, -16), tag: c, iv: n };
}
o(Rc, "gcmEncrypt");
var Cc = /* @__PURE__ */ o(async (e, t, r, n, i) => {
  if (!K(r) && !(r instanceof Uint8Array))
    throw new TypeError(N(r, ...H, "Uint8Array"));
  switch (n ? ar(e, n) : n = ii(e), e) {
    case "A128CBC-HS256":
    case "A192CBC-HS384":
    case "A256CBC-HS512":
      return r instanceof Uint8Array && Je(r, parseInt(e.slice(-3), 10)), Tc(e, t, r, n, i);
    case "A128GCM":
    case "A192GCM":
    case "A256GCM":
      return r instanceof Uint8Array && Je(r, parseInt(e.slice(1, 4), 10)), Rc(e, t, r, n, i);
    default:
      throw new E("Unsupported JWE Content Encryption Algorithm");
  }
}, "encrypt"), mr = Cc;

// node_modules/jose/dist/browser/lib/aesgcmkw.js
async function Ti(e, t, r, n) {
  let i = e.slice(0, 7), s = await mr(i, r, t, n, new Uint8Array(0));
  return {
    encryptedKey: s.ciphertext,
    iv: O(s.iv),
    tag: O(s.tag)
  };
}
o(Ti, "wrap");
async function Ri(e, t, r, n, i) {
  let s = e.slice(0, 7);
  return ur(s, t, r, n, i, new Uint8Array(0));
}
o(Ri, "unwrap");

// node_modules/jose/dist/browser/lib/decrypt_key_management.js
async function Pc(e, t, r, n, i) {
  switch (hr(e, t, "decrypt"), t = await Te.normalizePrivateKey?.(t, e) || t, e) {
    case "dir": {
      if (r !== void 0)
        throw new w("Encountered unexpected JWE Encrypted Key");
      return t;
    }
    case "ECDH-ES":
      if (r !== void 0)
        throw new w("Encountered unexpected JWE Encrypted Key");
    case "ECDH-ES+A128KW":
    case "ECDH-ES+A192KW":
    case "ECDH-ES+A256KW": {
      if (!z(n.epk))
        throw new w('JOSE Header "epk" (Ephemeral Public Key) missing or invalid');
      if (!lr(t))
        throw new E("ECDH with the provided key is not allowed or not supported by your javascript runtime");
      let s = await In(n.epk, e), a, c;
      if (n.apu !== void 0) {
        if (typeof n.apu != "string")
          throw new w('JOSE Header "apu" (Agreement PartyUInfo) invalid');
        try {
          a = W(n.apu);
        } catch {
          throw new w("Failed to base64url decode the apu");
        }
      }
      if (n.apv !== void 0) {
        if (typeof n.apv != "string")
          throw new w('JOSE Header "apv" (Agreement PartyVInfo) invalid');
        try {
          c = W(n.apv);
        } catch {
          throw new w("Failed to base64url decode the apv");
        }
      }
      let d = await dr(s, t, e === "ECDH-ES" ? n.enc : e, e === "ECDH-ES" ? mt(n.enc) : parseInt(e.slice(-5, -2), 10), a, c);
      if (e === "ECDH-ES")
        return d;
      if (r === void 0)
        throw new w("JWE Encrypted Key missing");
      return pt(e.slice(-6), d, r);
    }
    case "RSA1_5":
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512": {
      if (r === void 0)
        throw new w("JWE Encrypted Key missing");
      return gi(e, t, r);
    }
    case "PBES2-HS256+A128KW":
    case "PBES2-HS384+A192KW":
    case "PBES2-HS512+A256KW": {
      if (r === void 0)
        throw new w("JWE Encrypted Key missing");
      if (typeof n.p2c != "number")
        throw new w('JOSE Header "p2c" (PBES2 Count) missing or invalid');
      let s = i?.maxPBES2Count || 1e4;
      if (n.p2c > s)
        throw new w('JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds');
      if (typeof n.p2s != "string")
        throw new w('JOSE Header "p2s" (PBES2 Salt) missing or invalid');
      let a;
      try {
        a = W(n.p2s);
      } catch {
        throw new w("Failed to base64url decode the p2s");
      }
      return yi(e, t, r, n.p2c, a);
    }
    case "A128KW":
    case "A192KW":
    case "A256KW": {
      if (r === void 0)
        throw new w("JWE Encrypted Key missing");
      return pt(e, t, r);
    }
    case "A128GCMKW":
    case "A192GCMKW":
    case "A256GCMKW": {
      if (r === void 0)
        throw new w("JWE Encrypted Key missing");
      if (typeof n.iv != "string")
        throw new w('JOSE Header "iv" (Initialization Vector) missing or invalid');
      if (typeof n.tag != "string")
        throw new w('JOSE Header "tag" (Authentication Tag) missing or invalid');
      let s;
      try {
        s = W(n.iv);
      } catch {
        throw new w("Failed to base64url decode the iv");
      }
      let a;
      try {
        a = W(n.tag);
      } catch {
        throw new w("Failed to base64url decode the tag");
      }
      return Ri(e, t, r, s, a);
    }
    default:
      throw new E('Invalid or unsupported "alg" (JWE Algorithm) header value');
  }
}
o(Pc, "decryptKeyManagement");
var Ci = Pc;

// node_modules/jose/dist/browser/lib/validate_crit.js
function Uc(e, t, r, n, i) {
  if (i.crit !== void 0 && n?.crit === void 0)
    throw new e('"crit" (Critical) Header Parameter MUST be integrity protected');
  if (!n || n.crit === void 0)
    return /* @__PURE__ */ new Set();
  if (!Array.isArray(n.crit) || n.crit.length === 0 || n.crit.some((a) => typeof a != "string" || a.length === 0))
    throw new e('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  let s;
  r !== void 0 ? s = new Map([...Object.entries(r), ...t.entries()]) : s = t;
  for (let a of n.crit) {
    if (!s.has(a))
      throw new E(`Extension Header Parameter "${a}" is not recognized`);
    if (i[a] === void 0)
      throw new e(`Extension Header Parameter "${a}" is missing`);
    if (s.get(a) && n[a] === void 0)
      throw new e(`Extension Header Parameter "${a}" MUST be integrity protected`);
  }
  return new Set(n.crit);
}
o(Uc, "validateCrit");
var qe = Uc;

// node_modules/jose/dist/browser/lib/validate_algorithms.js
var Oc = /* @__PURE__ */ o((e, t) => {
  if (t !== void 0 && (!Array.isArray(t) || t.some((r) => typeof r != "string")))
    throw new TypeError(`"${e}" option must be an array of strings`);
  if (t)
    return new Set(t);
}, "validateAlgorithms"), Rn = Oc;

// node_modules/jose/dist/browser/jwe/flattened/decrypt.js
async function Pi(e, t, r) {
  if (!z(e))
    throw new w("Flattened JWE must be an object");
  if (e.protected === void 0 && e.header === void 0 && e.unprotected === void 0)
    throw new w("JOSE Header missing");
  if (e.iv !== void 0 && typeof e.iv != "string")
    throw new w("JWE Initialization Vector incorrect type");
  if (typeof e.ciphertext != "string")
    throw new w("JWE Ciphertext missing or incorrect type");
  if (e.tag !== void 0 && typeof e.tag != "string")
    throw new w("JWE Authentication Tag incorrect type");
  if (e.protected !== void 0 && typeof e.protected != "string")
    throw new w("JWE Protected Header incorrect type");
  if (e.encrypted_key !== void 0 && typeof e.encrypted_key != "string")
    throw new w("JWE Encrypted Key incorrect type");
  if (e.aad !== void 0 && typeof e.aad != "string")
    throw new w("JWE AAD incorrect type");
  if (e.header !== void 0 && !z(e.header))
    throw new w("JWE Shared Unprotected Header incorrect type");
  if (e.unprotected !== void 0 && !z(e.unprotected))
    throw new w("JWE Per-Recipient Unprotected Header incorrect type");
  let n;
  if (e.protected)
    try {
      let k = W(e.protected);
      n = JSON.parse(Q.decode(k));
    } catch {
      throw new w("JWE Protected Header is invalid");
    }
  if (!Me(n, e.header, e.unprotected))
    throw new w("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
  let i = {
    ...n,
    ...e.header,
    ...e.unprotected
  };
  if (qe(w, /* @__PURE__ */ new Map(), r?.crit, n, i), i.zip !== void 0)
    throw new E('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
  let { alg: s, enc: a } = i;
  if (typeof s != "string" || !s)
    throw new w("missing JWE Algorithm (alg) in JWE Header");
  if (typeof a != "string" || !a)
    throw new w("missing JWE Encryption Algorithm (enc) in JWE Header");
  let c = r && Rn("keyManagementAlgorithms", r.keyManagementAlgorithms), d = r && Rn("contentEncryptionAlgorithms", r.contentEncryptionAlgorithms);
  if (c && !c.has(s) || !c && s.startsWith("PBES2"))
    throw new $e('"alg" (Algorithm) Header Parameter value not allowed');
  if (d && !d.has(a))
    throw new $e('"enc" (Encryption Algorithm) Header Parameter value not allowed');
  let u;
  if (e.encrypted_key !== void 0)
    try {
      u = W(e.encrypted_key);
    } catch {
      throw new w("Failed to base64url decode the encrypted_key");
    }
  let f = !1;
  typeof t == "function" && (t = await t(n, e), f = !0);
  let l;
  try {
    l = await Ci(s, t, u, i, r);
  } catch (k) {
    if (k instanceof TypeError || k instanceof w || k instanceof E)
      throw k;
    l = me(a);
  }
  let y, p;
  if (e.iv !== void 0)
    try {
      y = W(e.iv);
    } catch {
      throw new w("Failed to base64url decode the iv");
    }
  if (e.tag !== void 0)
    try {
      p = W(e.tag);
    } catch {
      throw new w("Failed to base64url decode the tag");
    }
  let m = U.encode(e.protected ?? ""), S;
  e.aad !== void 0 ? S = j(m, U.encode("."), U.encode(e.aad)) : S = m;
  let I;
  try {
    I = W(e.ciphertext);
  } catch {
    throw new w("Failed to base64url decode the ciphertext");
  }
  let b = { plaintext: await ur(a, l, I, y, p, S) };
  if (e.protected !== void 0 && (b.protectedHeader = n), e.aad !== void 0)
    try {
      b.additionalAuthenticatedData = W(e.aad);
    } catch {
      throw new w("Failed to base64url decode the aad");
    }
  return e.unprotected !== void 0 && (b.sharedUnprotectedHeader = e.unprotected), e.header !== void 0 && (b.unprotectedHeader = e.header), f ? { ...b, key: t } : b;
}
o(Pi, "flattenedDecrypt");

// node_modules/jose/dist/browser/jwe/compact/decrypt.js
async function Ui(e, t, r) {
  if (e instanceof Uint8Array && (e = Q.decode(e)), typeof e != "string")
    throw new w("Compact JWE must be a string or Uint8Array");
  let { 0: n, 1: i, 2: s, 3: a, 4: c, length: d } = e.split(".");
  if (d !== 5)
    throw new w("Invalid Compact JWE");
  let u = await Pi({
    ciphertext: a,
    iv: s || void 0,
    protected: n,
    tag: c || void 0,
    encrypted_key: i || void 0
  }, t, r), f = { plaintext: u.plaintext, protectedHeader: u.protectedHeader };
  return typeof t == "function" ? { ...f, key: u.key } : f;
}
o(Ui, "compactDecrypt");

// node_modules/jose/dist/browser/lib/private_symbols.js
var Oi = Symbol();

// node_modules/jose/dist/browser/runtime/key_to_jwk.js
var Lc = /* @__PURE__ */ o(async (e) => {
  if (e instanceof Uint8Array)
    return {
      kty: "oct",
      k: O(e)
    };
  if (!K(e))
    throw new TypeError(N(e, ...H, "Uint8Array"));
  if (!e.extractable)
    throw new TypeError("non-extractable CryptoKey cannot be exported as a JWK");
  let { ext: t, key_ops: r, alg: n, use: i, ...s } = await _.subtle.exportKey("jwk", e);
  return s;
}, "keyToJWK"), Li = Lc;

// node_modules/jose/dist/browser/key/export.js
async function Hi(e) {
  return Li(e);
}
o(Hi, "exportJWK");

// node_modules/jose/dist/browser/lib/encrypt_key_management.js
async function Hc(e, t, r, n, i = {}) {
  let s, a, c;
  switch (hr(e, r, "encrypt"), r = await Te.normalizePublicKey?.(r, e) || r, e) {
    case "dir": {
      c = r;
      break;
    }
    case "ECDH-ES":
    case "ECDH-ES+A128KW":
    case "ECDH-ES+A192KW":
    case "ECDH-ES+A256KW": {
      if (!lr(r))
        throw new E("ECDH with the provided key is not allowed or not supported by your javascript runtime");
      let { apu: d, apv: u } = i, { epk: f } = i;
      f || (f = (await fi(r)).privateKey);
      let { x: l, y, crv: p, kty: m } = await Hi(f), S = await dr(r, f, e === "ECDH-ES" ? t : e, e === "ECDH-ES" ? mt(t) : parseInt(e.slice(-5, -2), 10), d, u);
      if (a = { epk: { x: l, crv: p, kty: m } }, m === "EC" && (a.epk.y = y), d && (a.apu = O(d)), u && (a.apv = O(u)), e === "ECDH-ES") {
        c = S;
        break;
      }
      c = n || me(t);
      let I = e.slice(-6);
      s = await ft(I, S, c);
      break;
    }
    case "RSA1_5":
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512": {
      c = n || me(t), s = await wi(e, r, c);
      break;
    }
    case "PBES2-HS256+A128KW":
    case "PBES2-HS384+A192KW":
    case "PBES2-HS512+A256KW": {
      c = n || me(t);
      let { p2c: d, p2s: u } = i;
      ({ encryptedKey: s, ...a } = await mi(e, r, c, d, u));
      break;
    }
    case "A128KW":
    case "A192KW":
    case "A256KW": {
      c = n || me(t), s = await ft(e, r, c);
      break;
    }
    case "A128GCMKW":
    case "A192GCMKW":
    case "A256GCMKW": {
      c = n || me(t);
      let { iv: d } = i;
      ({ encryptedKey: s, ...a } = await Ti(e, r, c, d));
      break;
    }
    default:
      throw new E('Invalid or unsupported "alg" (JWE Algorithm) header value');
  }
  return { cek: c, encryptedKey: s, parameters: a };
}
o(Hc, "encryptKeyManagement");
var Di = Hc;

// node_modules/jose/dist/browser/jwe/flattened/encrypt.js
var yr = class {
  static {
    o(this, "FlattenedEncrypt");
  }
  constructor(t) {
    if (!(t instanceof Uint8Array))
      throw new TypeError("plaintext must be an instance of Uint8Array");
    this._plaintext = t;
  }
  setKeyManagementParameters(t) {
    if (this._keyManagementParameters)
      throw new TypeError("setKeyManagementParameters can only be called once");
    return this._keyManagementParameters = t, this;
  }
  setProtectedHeader(t) {
    if (this._protectedHeader)
      throw new TypeError("setProtectedHeader can only be called once");
    return this._protectedHeader = t, this;
  }
  setSharedUnprotectedHeader(t) {
    if (this._sharedUnprotectedHeader)
      throw new TypeError("setSharedUnprotectedHeader can only be called once");
    return this._sharedUnprotectedHeader = t, this;
  }
  setUnprotectedHeader(t) {
    if (this._unprotectedHeader)
      throw new TypeError("setUnprotectedHeader can only be called once");
    return this._unprotectedHeader = t, this;
  }
  setAdditionalAuthenticatedData(t) {
    return this._aad = t, this;
  }
  setContentEncryptionKey(t) {
    if (this._cek)
      throw new TypeError("setContentEncryptionKey can only be called once");
    return this._cek = t, this;
  }
  setInitializationVector(t) {
    if (this._iv)
      throw new TypeError("setInitializationVector can only be called once");
    return this._iv = t, this;
  }
  async encrypt(t, r) {
    if (!this._protectedHeader && !this._unprotectedHeader && !this._sharedUnprotectedHeader)
      throw new w("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
    if (!Me(this._protectedHeader, this._unprotectedHeader, this._sharedUnprotectedHeader))
      throw new w("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
    let n = {
      ...this._protectedHeader,
      ...this._unprotectedHeader,
      ...this._sharedUnprotectedHeader
    };
    if (qe(w, /* @__PURE__ */ new Map(), r?.crit, this._protectedHeader, n), n.zip !== void 0)
      throw new E('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
    let { alg: i, enc: s } = n;
    if (typeof i != "string" || !i)
      throw new w('JWE "alg" (Algorithm) Header Parameter missing or invalid');
    if (typeof s != "string" || !s)
      throw new w('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
    let a;
    if (this._cek && (i === "dir" || i === "ECDH-ES"))
      throw new TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${i}`);
    let c;
    {
      let S;
      ({ cek: c, encryptedKey: a, parameters: S } = await Di(i, s, t, this._cek, this._keyManagementParameters)), S && (r && Oi in r ? this._unprotectedHeader ? this._unprotectedHeader = { ...this._unprotectedHeader, ...S } : this.setUnprotectedHeader(S) : this._protectedHeader ? this._protectedHeader = { ...this._protectedHeader, ...S } : this.setProtectedHeader(S));
    }
    let d, u, f;
    this._protectedHeader ? u = U.encode(O(JSON.stringify(this._protectedHeader))) : u = U.encode(""), this._aad ? (f = O(this._aad), d = j(u, U.encode("."), U.encode(f))) : d = u;
    let { ciphertext: l, tag: y, iv: p } = await mr(s, this._plaintext, c, this._iv, d), m = {
      ciphertext: O(l)
    };
    return p && (m.iv = O(p)), y && (m.tag = O(y)), a && (m.encrypted_key = O(a)), f && (m.aad = f), this._protectedHeader && (m.protected = Q.decode(u)), this._sharedUnprotectedHeader && (m.unprotected = this._sharedUnprotectedHeader), this._unprotectedHeader && (m.header = this._unprotectedHeader), m;
  }
};

// node_modules/jose/dist/browser/runtime/subtle_dsa.js
function Cn(e, t) {
  let r = `SHA-${e.slice(-3)}`;
  switch (e) {
    case "HS256":
    case "HS384":
    case "HS512":
      return { hash: r, name: "HMAC" };
    case "PS256":
    case "PS384":
    case "PS512":
      return { hash: r, name: "RSA-PSS", saltLength: e.slice(-3) >> 3 };
    case "RS256":
    case "RS384":
    case "RS512":
      return { hash: r, name: "RSASSA-PKCS1-v1_5" };
    case "ES256":
    case "ES384":
    case "ES512":
      return { hash: r, name: "ECDSA", namedCurve: t.namedCurve };
    case "Ed25519":
      return { name: "Ed25519" };
    case "EdDSA":
      return { name: t.name };
    default:
      throw new E(`alg ${e} is not supported either by JOSE or your javascript runtime`);
  }
}
o(Cn, "subtleDsa");

// node_modules/jose/dist/browser/runtime/get_sign_verify_key.js
async function Pn(e, t, r) {
  if (r === "sign" && (t = await Te.normalizePrivateKey(t, e)), r === "verify" && (t = await Te.normalizePublicKey(t, e)), K(t))
    return ci(t, e, r), t;
  if (t instanceof Uint8Array) {
    if (!e.startsWith("HS"))
      throw new TypeError(N(t, ...H));
    return _.subtle.importKey("raw", t, { hash: `SHA-${e.slice(-3)}`, name: "HMAC" }, !1, [r]);
  }
  throw new TypeError(N(t, ...H, "Uint8Array", "JSON Web Key"));
}
o(Pn, "getCryptoKey");

// node_modules/jose/dist/browser/lib/epoch.js
var ae = /* @__PURE__ */ o((e) => Math.floor(e.getTime() / 1e3), "default");

// node_modules/jose/dist/browser/lib/secs.js
var Dc = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i, Re = /* @__PURE__ */ o((e) => {
  let t = Dc.exec(e);
  if (!t || t[4] && t[1])
    throw new TypeError("Invalid time period format");
  let r = parseFloat(t[2]), n = t[3].toLowerCase(), i;
  switch (n) {
    case "sec":
    case "secs":
    case "second":
    case "seconds":
    case "s":
      i = Math.round(r);
      break;
    case "minute":
    case "minutes":
    case "min":
    case "mins":
    case "m":
      i = Math.round(r * 60);
      break;
    case "hour":
    case "hours":
    case "hr":
    case "hrs":
    case "h":
      i = Math.round(r * 3600);
      break;
    case "day":
    case "days":
    case "d":
      i = Math.round(r * 86400);
      break;
    case "week":
    case "weeks":
    case "w":
      i = Math.round(r * 604800);
      break;
    default:
      i = Math.round(r * 31557600);
      break;
  }
  return t[1] === "-" || t[4] === "ago" ? -i : i;
}, "default");

// node_modules/jose/dist/browser/lib/jwt_claims_set.js
var Ki = /* @__PURE__ */ o((e) => e.toLowerCase().replace(/^application\//, ""), "normalizeTyp"), Kc = /* @__PURE__ */ o((e, t) => typeof e == "string" ? t.includes(e) : Array.isArray(e) ? t.some(Set.prototype.has.bind(new Set(e))) : !1, "checkAudiencePresence"), Ni = /* @__PURE__ */ o((e, t, r = {}) => {
  let n;
  try {
    n = JSON.parse(Q.decode(t));
  } catch {
  }
  if (!z(n))
    throw new ke("JWT Claims Set must be a top-level JSON object");
  let { typ: i } = r;
  if (i && (typeof e.typ != "string" || Ki(e.typ) !== Ki(i)))
    throw new B('unexpected "typ" JWT header value', n, "typ", "check_failed");
  let { requiredClaims: s = [], issuer: a, subject: c, audience: d, maxTokenAge: u } = r, f = [...s];
  u !== void 0 && f.push("iat"), d !== void 0 && f.push("aud"), c !== void 0 && f.push("sub"), a !== void 0 && f.push("iss");
  for (let m of new Set(f.reverse()))
    if (!(m in n))
      throw new B(`missing required "${m}" claim`, n, m, "missing");
  if (a && !(Array.isArray(a) ? a : [a]).includes(n.iss))
    throw new B('unexpected "iss" claim value', n, "iss", "check_failed");
  if (c && n.sub !== c)
    throw new B('unexpected "sub" claim value', n, "sub", "check_failed");
  if (d && !Kc(n.aud, typeof d == "string" ? [d] : d))
    throw new B('unexpected "aud" claim value', n, "aud", "check_failed");
  let l;
  switch (typeof r.clockTolerance) {
    case "string":
      l = Re(r.clockTolerance);
      break;
    case "number":
      l = r.clockTolerance;
      break;
    case "undefined":
      l = 0;
      break;
    default:
      throw new TypeError("Invalid clockTolerance option type");
  }
  let { currentDate: y } = r, p = ae(y || /* @__PURE__ */ new Date());
  if ((n.iat !== void 0 || u) && typeof n.iat != "number")
    throw new B('"iat" claim must be a number', n, "iat", "invalid");
  if (n.nbf !== void 0) {
    if (typeof n.nbf != "number")
      throw new B('"nbf" claim must be a number', n, "nbf", "invalid");
    if (n.nbf > p + l)
      throw new B('"nbf" claim timestamp check failed', n, "nbf", "check_failed");
  }
  if (n.exp !== void 0) {
    if (typeof n.exp != "number")
      throw new B('"exp" claim must be a number', n, "exp", "invalid");
    if (n.exp <= p - l)
      throw new We('"exp" claim timestamp check failed', n, "exp", "check_failed");
  }
  if (u) {
    let m = p - n.iat, S = typeof u == "number" ? u : Re(u);
    if (m - l > S)
      throw new We('"iat" claim timestamp check failed (too far in the past)', n, "iat", "check_failed");
    if (m < 0 - l)
      throw new B('"iat" claim timestamp check failed (it should be in the past)', n, "iat", "check_failed");
  }
  return n;
}, "default");

// node_modules/jose/dist/browser/jwt/decrypt.js
async function Un(e, t, r) {
  let n = await Ui(e, t, r), i = Ni(n.protectedHeader, n.plaintext, r), { protectedHeader: s } = n;
  if (s.iss !== void 0 && s.iss !== i.iss)
    throw new B('replicated "iss" claim header parameter mismatch', i, "iss", "mismatch");
  if (s.sub !== void 0 && s.sub !== i.sub)
    throw new B('replicated "sub" claim header parameter mismatch', i, "sub", "mismatch");
  if (s.aud !== void 0 && JSON.stringify(s.aud) !== JSON.stringify(i.aud))
    throw new B('replicated "aud" claim header parameter mismatch', i, "aud", "mismatch");
  let a = { payload: i, protectedHeader: s };
  return typeof t == "function" ? { ...a, key: n.key } : a;
}
o(Un, "jwtDecrypt");

// node_modules/jose/dist/browser/jwe/compact/encrypt.js
var wr = class {
  static {
    o(this, "CompactEncrypt");
  }
  constructor(t) {
    this._flattened = new yr(t);
  }
  setContentEncryptionKey(t) {
    return this._flattened.setContentEncryptionKey(t), this;
  }
  setInitializationVector(t) {
    return this._flattened.setInitializationVector(t), this;
  }
  setProtectedHeader(t) {
    return this._flattened.setProtectedHeader(t), this;
  }
  setKeyManagementParameters(t) {
    return this._flattened.setKeyManagementParameters(t), this;
  }
  async encrypt(t, r) {
    let n = await this._flattened.encrypt(t, r);
    return [n.protected, n.encrypted_key, n.iv, n.ciphertext, n.tag].join(".");
  }
};

// node_modules/jose/dist/browser/runtime/sign.js
var Nc = /* @__PURE__ */ o(async (e, t, r) => {
  let n = await Pn(e, t, "sign");
  ht(e, n);
  let i = await _.subtle.sign(Cn(e, n.algorithm), n, r);
  return new Uint8Array(i);
}, "sign"), Wi = Nc;

// node_modules/jose/dist/browser/jws/flattened/sign.js
var gr = class {
  static {
    o(this, "FlattenedSign");
  }
  constructor(t) {
    if (!(t instanceof Uint8Array))
      throw new TypeError("payload must be an instance of Uint8Array");
    this._payload = t;
  }
  setProtectedHeader(t) {
    if (this._protectedHeader)
      throw new TypeError("setProtectedHeader can only be called once");
    return this._protectedHeader = t, this;
  }
  setUnprotectedHeader(t) {
    if (this._unprotectedHeader)
      throw new TypeError("setUnprotectedHeader can only be called once");
    return this._unprotectedHeader = t, this;
  }
  async sign(t, r) {
    if (!this._protectedHeader && !this._unprotectedHeader)
      throw new de("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
    if (!Me(this._protectedHeader, this._unprotectedHeader))
      throw new de("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
    let n = {
      ...this._protectedHeader,
      ...this._unprotectedHeader
    }, i = qe(de, /* @__PURE__ */ new Map([["b64", !0]]), r?.crit, this._protectedHeader, n), s = !0;
    if (i.has("b64") && (s = this._protectedHeader.b64, typeof s != "boolean"))
      throw new de('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    let { alg: a } = n;
    if (typeof a != "string" || !a)
      throw new de('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    Ii(a, t, "sign");
    let c = this._payload;
    s && (c = U.encode(O(c)));
    let d;
    this._protectedHeader ? d = U.encode(O(JSON.stringify(this._protectedHeader))) : d = U.encode("");
    let u = j(d, U.encode("."), c), f = await Wi(a, t, u), l = {
      signature: O(f),
      payload: ""
    };
    return s && (l.payload = Q.decode(c)), this._unprotectedHeader && (l.header = this._unprotectedHeader), this._protectedHeader && (l.protected = Q.decode(d)), l;
  }
};

// node_modules/jose/dist/browser/jws/compact/sign.js
var br = class {
  static {
    o(this, "CompactSign");
  }
  constructor(t) {
    this._flattened = new gr(t);
  }
  setProtectedHeader(t) {
    return this._flattened.setProtectedHeader(t), this;
  }
  async sign(t, r) {
    let n = await this._flattened.sign(t, r);
    if (n.payload === void 0)
      throw new TypeError("use the flattened module for creating JWS with b64: false");
    return `${n.protected}.${n.payload}.${n.signature}`;
  }
};

// node_modules/jose/dist/browser/jwt/produce.js
function Ce(e, t) {
  if (!Number.isFinite(t))
    throw new TypeError(`Invalid ${e} input`);
  return t;
}
o(Ce, "validateInput");
var Xe = class {
  static {
    o(this, "ProduceJWT");
  }
  constructor(t = {}) {
    if (!z(t))
      throw new TypeError("JWT Claims Set MUST be an object");
    this._payload = t;
  }
  setIssuer(t) {
    return this._payload = { ...this._payload, iss: t }, this;
  }
  setSubject(t) {
    return this._payload = { ...this._payload, sub: t }, this;
  }
  setAudience(t) {
    return this._payload = { ...this._payload, aud: t }, this;
  }
  setJti(t) {
    return this._payload = { ...this._payload, jti: t }, this;
  }
  setNotBefore(t) {
    return typeof t == "number" ? this._payload = { ...this._payload, nbf: Ce("setNotBefore", t) } : t instanceof Date ? this._payload = { ...this._payload, nbf: Ce("setNotBefore", ae(t)) } : this._payload = { ...this._payload, nbf: ae(/* @__PURE__ */ new Date()) + Re(t) }, this;
  }
  setExpirationTime(t) {
    return typeof t == "number" ? this._payload = { ...this._payload, exp: Ce("setExpirationTime", t) } : t instanceof Date ? this._payload = { ...this._payload, exp: Ce("setExpirationTime", ae(t)) } : this._payload = { ...this._payload, exp: ae(/* @__PURE__ */ new Date()) + Re(t) }, this;
  }
  setIssuedAt(t) {
    return typeof t > "u" ? this._payload = { ...this._payload, iat: ae(/* @__PURE__ */ new Date()) } : t instanceof Date ? this._payload = { ...this._payload, iat: Ce("setIssuedAt", ae(t)) } : typeof t == "string" ? this._payload = {
      ...this._payload,
      iat: Ce("setIssuedAt", ae(/* @__PURE__ */ new Date()) + Re(t))
    } : this._payload = { ...this._payload, iat: Ce("setIssuedAt", t) }, this;
  }
};

// node_modules/jose/dist/browser/jwt/sign.js
var yt = class extends Xe {
  static {
    o(this, "SignJWT");
  }
  setProtectedHeader(t) {
    return this._protectedHeader = t, this;
  }
  async sign(t, r) {
    let n = new br(U.encode(JSON.stringify(this._payload)));
    if (n.setProtectedHeader(this._protectedHeader), Array.isArray(this._protectedHeader?.crit) && this._protectedHeader.crit.includes("b64") && this._protectedHeader.b64 === !1)
      throw new ke("JWTs MUST NOT use unencoded payload");
    return n.sign(t, r);
  }
};

// node_modules/jose/dist/browser/jwt/encrypt.js
var wt = class extends Xe {
  static {
    o(this, "EncryptJWT");
  }
  setProtectedHeader(t) {
    if (this._protectedHeader)
      throw new TypeError("setProtectedHeader can only be called once");
    return this._protectedHeader = t, this;
  }
  setKeyManagementParameters(t) {
    if (this._keyManagementParameters)
      throw new TypeError("setKeyManagementParameters can only be called once");
    return this._keyManagementParameters = t, this;
  }
  setContentEncryptionKey(t) {
    if (this._cek)
      throw new TypeError("setContentEncryptionKey can only be called once");
    return this._cek = t, this;
  }
  setInitializationVector(t) {
    if (this._iv)
      throw new TypeError("setInitializationVector can only be called once");
    return this._iv = t, this;
  }
  replicateIssuerAsHeader() {
    return this._replicateIssuerAsHeader = !0, this;
  }
  replicateSubjectAsHeader() {
    return this._replicateSubjectAsHeader = !0, this;
  }
  replicateAudienceAsHeader() {
    return this._replicateAudienceAsHeader = !0, this;
  }
  async encrypt(t, r) {
    let n = new wr(U.encode(JSON.stringify(this._payload)));
    return this._replicateIssuerAsHeader && (this._protectedHeader = { ...this._protectedHeader, iss: this._payload.iss }), this._replicateSubjectAsHeader && (this._protectedHeader = { ...this._protectedHeader, sub: this._payload.sub }), this._replicateAudienceAsHeader && (this._protectedHeader = { ...this._protectedHeader, aud: this._payload.aud }), n.setProtectedHeader(this._protectedHeader), this._iv && n.setInitializationVector(this._iv), this._cek && n.setContentEncryptionKey(this._cek), this._keyManagementParameters && n.setKeyManagementParameters(this._keyManagementParameters), n.encrypt(t, r);
  }
};

// node_modules/jose/dist/browser/jwk/thumbprint.js
var we = /* @__PURE__ */ o((e, t) => {
  if (typeof e != "string" || !e)
    throw new lt(`${t} missing or invalid`);
}, "check");
async function _r(e, t) {
  if (!z(e))
    throw new TypeError("JWK must be an object");
  if (t ?? (t = "sha256"), t !== "sha256" && t !== "sha384" && t !== "sha512")
    throw new TypeError('digestAlgorithm must one of "sha256", "sha384", or "sha512"');
  let r;
  switch (e.kty) {
    case "EC":
      we(e.crv, '"crv" (Curve) Parameter'), we(e.x, '"x" (X Coordinate) Parameter'), we(e.y, '"y" (Y Coordinate) Parameter'), r = { crv: e.crv, kty: e.kty, x: e.x, y: e.y };
      break;
    case "OKP":
      we(e.crv, '"crv" (Subtype of Key Pair) Parameter'), we(e.x, '"x" (Public Key) Parameter'), r = { crv: e.crv, kty: e.kty, x: e.x };
      break;
    case "RSA":
      we(e.e, '"e" (Exponent) Parameter'), we(e.n, '"n" (Modulus) Parameter'), r = { e: e.e, kty: e.kty, n: e.n };
      break;
    case "oct":
      we(e.k, '"k" (Key Value) Parameter'), r = { k: e.k, kty: e.kty };
      break;
    default:
      throw new E('"kty" (Key Type) Parameter missing or unsupported');
  }
  let n = U.encode(JSON.stringify(r));
  return O(await rr(t, n));
}
o(_r, "calculateJwkThumbprint");

// node_modules/jose/dist/browser/util/base64url.js
var gt = {};
$o(gt, {
  decode: () => $c,
  encode: () => Wc
});
var Wc = O, $c = W;

// node_modules/@auth/core/lib/vendored/cookie.js
var bt = {};
$o(bt, {
  parse: () => Fc,
  serialize: () => Gc
});
var Bc = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/, Jc = /^("?)[\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]*\1$/, Mc = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i, zc = /^[\u0020-\u003A\u003D-\u007E]*$/, jc = Object.prototype.toString, Vc = /* @__PURE__ */ (() => {
  let e = /* @__PURE__ */ o(function() {
  }, "C");
  return e.prototype = /* @__PURE__ */ Object.create(null), e;
})();
function Fc(e, t) {
  let r = new Vc(), n = e.length;
  if (n < 2)
    return r;
  let i = t?.decode || qc, s = 0;
  do {
    let a = e.indexOf("=", s);
    if (a === -1)
      break;
    let c = e.indexOf(";", s), d = c === -1 ? n : c;
    if (a > d) {
      s = e.lastIndexOf(";", a - 1) + 1;
      continue;
    }
    let u = $i(e, s, a), f = Bi(e, a, u), l = e.slice(u, f);
    if (r[l] === void 0) {
      let y = $i(e, a + 1, d), p = Bi(e, d, y), m = i(e.slice(y, p));
      r[l] = m;
    }
    s = d + 1;
  } while (s < n);
  return r;
}
o(Fc, "parse");
function $i(e, t, r) {
  do {
    let n = e.charCodeAt(t);
    if (n !== 32 && n !== 9)
      return t;
  } while (++t < r);
  return r;
}
o($i, "startIndex");
function Bi(e, t, r) {
  for (; t > r; ) {
    let n = e.charCodeAt(--t);
    if (n !== 32 && n !== 9)
      return t + 1;
  }
  return r;
}
o(Bi, "endIndex");
function Gc(e, t, r) {
  let n = r?.encode || encodeURIComponent;
  if (!Bc.test(e))
    throw new TypeError(`argument name is invalid: ${e}`);
  let i = n(t);
  if (!Jc.test(i))
    throw new TypeError(`argument val is invalid: ${t}`);
  let s = e + "=" + i;
  if (!r)
    return s;
  if (r.maxAge !== void 0) {
    if (!Number.isInteger(r.maxAge))
      throw new TypeError(`option maxAge is invalid: ${r.maxAge}`);
    s += "; Max-Age=" + r.maxAge;
  }
  if (r.domain) {
    if (!Mc.test(r.domain))
      throw new TypeError(`option domain is invalid: ${r.domain}`);
    s += "; Domain=" + r.domain;
  }
  if (r.path) {
    if (!zc.test(r.path))
      throw new TypeError(`option path is invalid: ${r.path}`);
    s += "; Path=" + r.path;
  }
  if (r.expires) {
    if (!Xc(r.expires) || !Number.isFinite(r.expires.valueOf()))
      throw new TypeError(`option expires is invalid: ${r.expires}`);
    s += "; Expires=" + r.expires.toUTCString();
  }
  if (r.httpOnly && (s += "; HttpOnly"), r.secure && (s += "; Secure"), r.partitioned && (s += "; Partitioned"), r.priority)
    switch (typeof r.priority == "string" ? r.priority.toLowerCase() : void 0) {
      case "low":
        s += "; Priority=Low";
        break;
      case "medium":
        s += "; Priority=Medium";
        break;
      case "high":
        s += "; Priority=High";
        break;
      default:
        throw new TypeError(`option priority is invalid: ${r.priority}`);
    }
  if (r.sameSite)
    switch (typeof r.sameSite == "string" ? r.sameSite.toLowerCase() : r.sameSite) {
      case !0:
      case "strict":
        s += "; SameSite=Strict";
        break;
      case "lax":
        s += "; SameSite=Lax";
        break;
      case "none":
        s += "; SameSite=None";
        break;
      default:
        throw new TypeError(`option sameSite is invalid: ${r.sameSite}`);
    }
  return s;
}
o(Gc, "serialize");
function qc(e) {
  if (e.indexOf("%") === -1)
    return e;
  try {
    return decodeURIComponent(e);
  } catch {
    return e;
  }
}
o(qc, "decode");
function Xc(e) {
  return jc.call(e) === "[object Date]";
}
o(Xc, "isDate");

// node_modules/@auth/core/jwt.js
var { parse: Qy } = bt, Qc = 720 * 60 * 60, Yc = /* @__PURE__ */ o(() => Date.now() / 1e3 | 0, "now"), Ji = "dir", On = "A256CBC-HS512";
async function xr(e) {
  let { token: t = {}, secret: r, maxAge: n = Qc, salt: i } = e, s = Array.isArray(r) ? r : [r], a = await Mi(On, s[0], i), c = await _r({ kty: "oct", k: gt.encode(a) }, `sha${a.byteLength << 3}`);
  return await new wt(t).setProtectedHeader({ alg: Ji, enc: On, kid: c }).setIssuedAt().setExpirationTime(Yc() + n).setJti(crypto.randomUUID()).encrypt(a);
}
o(xr, "encode");
async function Sr(e) {
  let { token: t, secret: r, salt: n } = e, i = Array.isArray(r) ? r : [r];
  if (!t)
    return null;
  let { payload: s } = await Un(t, async ({ kid: a, enc: c }) => {
    for (let d of i) {
      let u = await Mi(c, d, n);
      if (a === void 0)
        return u;
      let f = await _r({ kty: "oct", k: gt.encode(u) }, `sha${u.byteLength << 3}`);
      if (a === f)
        return u;
    }
    throw new Error("no matching decryption secret");
  }, {
    clockTolerance: 15,
    keyManagementAlgorithms: [Ji],
    contentEncryptionAlgorithms: [On, "A256GCM"]
  });
  return s;
}
o(Sr, "decode");
async function Mi(e, t, r) {
  let n;
  switch (e) {
    case "A256CBC-HS512":
      n = 64;
      break;
    case "A256GCM":
      n = 32;
      break;
    default:
      throw new Error("Unsupported JWT Content Encryption Algorithm");
  }
  return await ri("sha256", t, r, `Auth.js Generated Encryption Key (${r})`, n);
}
o(Mi, "getDerivedEncryptionKey");

// node_modules/@auth/core/lib/utils/logger.js
var Ln = "\x1B[31m", tu = "\x1B[33m", ru = "\x1B[90m", _t = "\x1B[0m", nu = {
  error(e) {
    let t = e instanceof T ? e.type : e.name;
    if (console.error(`${Ln}[auth][error]${_t} ${t}: ${e.message}`), e.cause && typeof e.cause == "object" && "err" in e.cause && e.cause.err instanceof Error) {
      let { err: r, ...n } = e.cause;
      console.error(`${Ln}[auth][cause]${_t}:`, r.stack), n && console.error(`${Ln}[auth][details]${_t}:`, JSON.stringify(n, null, 2));
    } else e.stack && console.error(e.stack.replace(/.*/, "").substring(1));
  },
  warn(e) {
    let t = `https://warnings.authjs.dev#${e}`;
    console.warn(`${tu}[auth][warn][${e}]${_t}`, `Read more: ${t}`);
  },
  debug(e, t) {
    console.log(`${ru}[auth][debug]:${_t} ${e}`, JSON.stringify(t, null, 2));
  }
};
function xt(e) {
  let t = {
    ...nu
  };
  return e.debug || (t.debug = () => {
  }), e.logger?.error && (t.error = e.logger.error), e.logger?.warn && (t.warn = e.logger.warn), e.logger?.debug && (t.debug = e.logger.debug), e.logger ?? (e.logger = t), t;
}
o(xt, "setLogger");

// node_modules/@auth/core/lib/utils/web.js
var { parse: dw, serialize: lw } = bt;

// node_modules/@auth/core/lib/symbols.js
var Hn = Symbol("skip-csrf-check"), Vi = Symbol("return-type-raw"), ge = Symbol("custom-fetch"), iu = Symbol("conform-internal");

// node_modules/preact/dist/preact.module.js
var Zi, D, Qi, au, Pe, Fi, Yi, Kn, Bn, Nn, Wn, cu, $n = {}, es = [], uu = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, Jn = Array.isArray;
function be(e, t) {
  for (var r in t) e[r] = t[r];
  return e;
}
o(be, "d");
function ts(e) {
  e && e.parentNode && e.parentNode.removeChild(e);
}
o(ts, "w");
function Dn(e, t, r, n, i) {
  var s = { type: e, props: t, key: r, ref: n, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: i ?? ++Qi, __i: -1, __u: 0 };
  return i == null && D.vnode != null && D.vnode(s), s;
}
o(Dn, "g");
function Ue(e) {
  return e.children;
}
o(Ue, "b");
function Ar(e, t) {
  this.props = e, this.context = t;
}
o(Ar, "k");
function Ze(e, t) {
  if (t == null) return e.__ ? Ze(e.__, e.__i + 1) : null;
  for (var r; t < e.__k.length; t++) if ((r = e.__k[t]) != null && r.__e != null) return r.__e;
  return typeof e.type == "function" ? Ze(e) : null;
}
o(Ze, "x");
function rs(e) {
  var t, r;
  if ((e = e.__) != null && e.__c != null) {
    for (e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++) if ((r = e.__k[t]) != null && r.__e != null) {
      e.__e = e.__c.base = r.__e;
      break;
    }
    return rs(e);
  }
}
o(rs, "C");
function Gi(e) {
  (!e.__d && (e.__d = !0) && Pe.push(e) && !Er.__r++ || Fi !== D.debounceRendering) && ((Fi = D.debounceRendering) || Yi)(Er);
}
o(Gi, "S");
function Er() {
  var e, t, r, n, i, s, a, c;
  for (Pe.sort(Kn); e = Pe.shift(); ) e.__d && (t = Pe.length, n = void 0, s = (i = (r = e).__v).__e, a = [], c = [], r.__P && ((n = be({}, i)).__v = i.__v + 1, D.vnode && D.vnode(n), is(r.__P, n, i, r.__n, r.__P.namespaceURI, 32 & i.__u ? [s] : null, a, s ?? Ze(i), !!(32 & i.__u), c), n.__v = i.__v, n.__.__k[n.__i] = n, fu(a, n, c), n.__e != s && rs(n)), Pe.length > t && Pe.sort(Kn));
  Er.__r = 0;
}
o(Er, "M");
function ns(e, t, r, n, i, s, a, c, d, u, f) {
  var l, y, p, m, S, I = n && n.__k || es, A = t.length;
  for (r.__d = d, du(r, t, I), d = r.__d, l = 0; l < A; l++) (p = r.__k[l]) != null && (y = p.__i === -1 ? $n : I[p.__i] || $n, p.__i = l, is(e, p, y, i, s, a, c, d, u, f), m = p.__e, p.ref && y.ref != p.ref && (y.ref && Mn(y.ref, null, p), f.push(p.ref, p.__c || m, p)), S == null && m != null && (S = m), 65536 & p.__u || y.__k === p.__k ? d = os(p, d, e) : typeof p.type == "function" && p.__d !== void 0 ? d = p.__d : m && (d = m.nextSibling), p.__d = void 0, p.__u &= -196609);
  r.__d = d, r.__e = S;
}
o(ns, "P");
function du(e, t, r) {
  var n, i, s, a, c, d = t.length, u = r.length, f = u, l = 0;
  for (e.__k = [], n = 0; n < d; n++) (i = t[n]) != null && typeof i != "boolean" && typeof i != "function" ? (a = n + l, (i = e.__k[n] = typeof i == "string" || typeof i == "number" || typeof i == "bigint" || i.constructor == String ? Dn(null, i, null, null, null) : Jn(i) ? Dn(Ue, { children: i }, null, null, null) : i.constructor === void 0 && i.__b > 0 ? Dn(i.type, i.props, i.key, i.ref ? i.ref : null, i.__v) : i).__ = e, i.__b = e.__b + 1, s = null, (c = i.__i = lu(i, r, a, f)) !== -1 && (f--, (s = r[c]) && (s.__u |= 131072)), s == null || s.__v === null ? (c == -1 && l--, typeof i.type != "function" && (i.__u |= 65536)) : c !== a && (c == a - 1 ? l-- : c == a + 1 ? l++ : (c > a ? l-- : l++, i.__u |= 65536))) : i = e.__k[n] = null;
  if (f) for (n = 0; n < u; n++) (s = r[n]) != null && (131072 & s.__u) == 0 && (s.__e == e.__d && (e.__d = Ze(s)), ss(s, s));
}
o(du, "$");
function os(e, t, r) {
  var n, i;
  if (typeof e.type == "function") {
    for (n = e.__k, i = 0; n && i < n.length; i++) n[i] && (n[i].__ = e, t = os(n[i], t, r));
    return t;
  }
  e.__e != t && (t && e.type && !r.contains(t) && (t = Ze(e)), r.insertBefore(e.__e, t || null), t = e.__e);
  do
    t = t && t.nextSibling;
  while (t != null && t.nodeType === 8);
  return t;
}
o(os, "I");
function lu(e, t, r, n) {
  var i = e.key, s = e.type, a = r - 1, c = r + 1, d = t[r];
  if (d === null || d && i == d.key && s === d.type && (131072 & d.__u) == 0) return r;
  if (n > (d != null && (131072 & d.__u) == 0 ? 1 : 0)) for (; a >= 0 || c < t.length; ) {
    if (a >= 0) {
      if ((d = t[a]) && (131072 & d.__u) == 0 && i == d.key && s === d.type) return a;
      a--;
    }
    if (c < t.length) {
      if ((d = t[c]) && (131072 & d.__u) == 0 && i == d.key && s === d.type) return c;
      c++;
    }
  }
  return -1;
}
o(lu, "L");
function qi(e, t, r) {
  t[0] === "-" ? e.setProperty(t, r ?? "") : e[t] = r == null ? "" : typeof r != "number" || uu.test(t) ? r : r + "px";
}
o(qi, "T");
function vr(e, t, r, n, i) {
  var s;
  e: if (t === "style") if (typeof r == "string") e.style.cssText = r;
  else {
    if (typeof n == "string" && (e.style.cssText = n = ""), n) for (t in n) r && t in r || qi(e.style, t, "");
    if (r) for (t in r) n && r[t] === n[t] || qi(e.style, t, r[t]);
  }
  else if (t[0] === "o" && t[1] === "n") s = t !== (t = t.replace(/(PointerCapture)$|Capture$/i, "$1")), t = t.toLowerCase() in e || t === "onFocusOut" || t === "onFocusIn" ? t.toLowerCase().slice(2) : t.slice(2), e.l || (e.l = {}), e.l[t + s] = r, r ? n ? r.u = n.u : (r.u = Bn, e.addEventListener(t, s ? Wn : Nn, s)) : e.removeEventListener(t, s ? Wn : Nn, s);
  else {
    if (i == "http://www.w3.org/2000/svg") t = t.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (t != "width" && t != "height" && t != "href" && t != "list" && t != "form" && t != "tabIndex" && t != "download" && t != "rowSpan" && t != "colSpan" && t != "role" && t != "popover" && t in e) try {
      e[t] = r ?? "";
      break e;
    } catch {
    }
    typeof r == "function" || (r == null || r === !1 && t[4] !== "-" ? e.removeAttribute(t) : e.setAttribute(t, t == "popover" && r == 1 ? "" : r));
  }
}
o(vr, "A");
function Xi(e) {
  return function(t) {
    if (this.l) {
      var r = this.l[t.type + e];
      if (t.t == null) t.t = Bn++;
      else if (t.t < r.u) return;
      return r(D.event ? D.event(t) : t);
    }
  };
}
o(Xi, "F");
function is(e, t, r, n, i, s, a, c, d, u) {
  var f, l, y, p, m, S, I, A, b, k, P, Z, V, Ae, De, rt, ne = t.type;
  if (t.constructor !== void 0) return null;
  128 & r.__u && (d = !!(32 & r.__u), s = [c = t.__e = r.__e]), (f = D.__b) && f(t);
  e: if (typeof ne == "function") try {
    if (A = t.props, b = "prototype" in ne && ne.prototype.render, k = (f = ne.contextType) && n[f.__c], P = f ? k ? k.props.value : f.__ : n, r.__c ? I = (l = t.__c = r.__c).__ = l.__E : (b ? t.__c = l = new ne(A, P) : (t.__c = l = new Ar(A, P), l.constructor = ne, l.render = hu), k && k.sub(l), l.props = A, l.state || (l.state = {}), l.context = P, l.__n = n, y = l.__d = !0, l.__h = [], l._sb = []), b && l.__s == null && (l.__s = l.state), b && ne.getDerivedStateFromProps != null && (l.__s == l.state && (l.__s = be({}, l.__s)), be(l.__s, ne.getDerivedStateFromProps(A, l.__s))), p = l.props, m = l.state, l.__v = t, y) b && ne.getDerivedStateFromProps == null && l.componentWillMount != null && l.componentWillMount(), b && l.componentDidMount != null && l.__h.push(l.componentDidMount);
    else {
      if (b && ne.getDerivedStateFromProps == null && A !== p && l.componentWillReceiveProps != null && l.componentWillReceiveProps(A, P), !l.__e && (l.shouldComponentUpdate != null && l.shouldComponentUpdate(A, l.__s, P) === !1 || t.__v === r.__v)) {
        for (t.__v !== r.__v && (l.props = A, l.state = l.__s, l.__d = !1), t.__e = r.__e, t.__k = r.__k, t.__k.some(function(Pt) {
          Pt && (Pt.__ = t);
        }), Z = 0; Z < l._sb.length; Z++) l.__h.push(l._sb[Z]);
        l._sb = [], l.__h.length && a.push(l);
        break e;
      }
      l.componentWillUpdate != null && l.componentWillUpdate(A, l.__s, P), b && l.componentDidUpdate != null && l.__h.push(function() {
        l.componentDidUpdate(p, m, S);
      });
    }
    if (l.context = P, l.props = A, l.__P = e, l.__e = !1, V = D.__r, Ae = 0, b) {
      for (l.state = l.__s, l.__d = !1, V && V(t), f = l.render(l.props, l.state, l.context), De = 0; De < l._sb.length; De++) l.__h.push(l._sb[De]);
      l._sb = [];
    } else do
      l.__d = !1, V && V(t), f = l.render(l.props, l.state, l.context), l.state = l.__s;
    while (l.__d && ++Ae < 25);
    l.state = l.__s, l.getChildContext != null && (n = be(be({}, n), l.getChildContext())), b && !y && l.getSnapshotBeforeUpdate != null && (S = l.getSnapshotBeforeUpdate(p, m)), ns(e, Jn(rt = f != null && f.type === Ue && f.key == null ? f.props.children : f) ? rt : [rt], t, r, n, i, s, a, c, d, u), l.base = t.__e, t.__u &= -161, l.__h.length && a.push(l), I && (l.__E = l.__ = null);
  } catch (Pt) {
    if (t.__v = null, d || s != null) {
      for (t.__u |= d ? 160 : 128; c && c.nodeType === 8 && c.nextSibling; ) c = c.nextSibling;
      s[s.indexOf(c)] = null, t.__e = c;
    } else t.__e = r.__e, t.__k = r.__k;
    D.__e(Pt, t, r);
  }
  else s == null && t.__v === r.__v ? (t.__k = r.__k, t.__e = r.__e) : t.__e = pu(r.__e, t, r, n, i, s, a, d, u);
  (f = D.diffed) && f(t);
}
o(is, "O");
function fu(e, t, r) {
  t.__d = void 0;
  for (var n = 0; n < r.length; n++) Mn(r[n], r[++n], r[++n]);
  D.__c && D.__c(t, e), e.some(function(i) {
    try {
      e = i.__h, i.__h = [], e.some(function(s) {
        s.call(i);
      });
    } catch (s) {
      D.__e(s, i.__v);
    }
  });
}
o(fu, "j");
function pu(e, t, r, n, i, s, a, c, d) {
  var u, f, l, y, p, m, S, I = r.props, A = t.props, b = t.type;
  if (b === "svg" ? i = "http://www.w3.org/2000/svg" : b === "math" ? i = "http://www.w3.org/1998/Math/MathML" : i || (i = "http://www.w3.org/1999/xhtml"), s != null) {
    for (u = 0; u < s.length; u++) if ((p = s[u]) && "setAttribute" in p == !!b && (b ? p.localName === b : p.nodeType === 3)) {
      e = p, s[u] = null;
      break;
    }
  }
  if (e == null) {
    if (b === null) return document.createTextNode(A);
    e = document.createElementNS(i, b, A.is && A), c && (D.__m && D.__m(t, s), c = !1), s = null;
  }
  if (b === null) I === A || c && e.data === A || (e.data = A);
  else {
    if (s = s && Zi.call(e.childNodes), I = r.props || $n, !c && s != null) for (I = {}, u = 0; u < e.attributes.length; u++) I[(p = e.attributes[u]).name] = p.value;
    for (u in I) if (p = I[u], u != "children") {
      if (u == "dangerouslySetInnerHTML") l = p;
      else if (!(u in A)) {
        if (u == "value" && "defaultValue" in A || u == "checked" && "defaultChecked" in A) continue;
        vr(e, u, null, p, i);
      }
    }
    for (u in A) p = A[u], u == "children" ? y = p : u == "dangerouslySetInnerHTML" ? f = p : u == "value" ? m = p : u == "checked" ? S = p : c && typeof p != "function" || I[u] === p || vr(e, u, p, I[u], i);
    if (f) c || l && (f.__html === l.__html || f.__html === e.innerHTML) || (e.innerHTML = f.__html), t.__k = [];
    else if (l && (e.innerHTML = ""), ns(e, Jn(y) ? y : [y], t, r, n, b === "foreignObject" ? "http://www.w3.org/1999/xhtml" : i, s, a, s ? s[0] : r.__k && Ze(r, 0), c, d), s != null) for (u = s.length; u--; ) ts(s[u]);
    c || (u = "value", b === "progress" && m == null ? e.removeAttribute("value") : m !== void 0 && (m !== e[u] || b === "progress" && !m || b === "option" && m !== I[u]) && vr(e, u, m, I[u], i), u = "checked", S !== void 0 && S !== e[u] && vr(e, u, S, I[u], i));
  }
  return e;
}
o(pu, "z");
function Mn(e, t, r) {
  try {
    if (typeof e == "function") {
      var n = typeof e.__u == "function";
      n && e.__u(), n && t == null || (e.__u = e(t));
    } else e.current = t;
  } catch (i) {
    D.__e(i, r);
  }
}
o(Mn, "N");
function ss(e, t, r) {
  var n, i;
  if (D.unmount && D.unmount(e), (n = e.ref) && (n.current && n.current !== e.__e || Mn(n, null, t)), (n = e.__c) != null) {
    if (n.componentWillUnmount) try {
      n.componentWillUnmount();
    } catch (s) {
      D.__e(s, t);
    }
    n.base = n.__P = null;
  }
  if (n = e.__k) for (i = 0; i < n.length; i++) n[i] && ss(n[i], t, r || typeof e.type != "function");
  r || ts(e.__e), e.__c = e.__ = e.__e = e.__d = void 0;
}
o(ss, "V");
function hu(e, t, r) {
  return this.constructor(e, r);
}
o(hu, "q");
Zi = es.slice, D = { __e: /* @__PURE__ */ o(function(e, t, r, n) {
  for (var i, s, a; t = t.__; ) if ((i = t.__c) && !i.__) try {
    if ((s = i.constructor) && s.getDerivedStateFromError != null && (i.setState(s.getDerivedStateFromError(e)), a = i.__d), i.componentDidCatch != null && (i.componentDidCatch(e, n || {}), a = i.__d), a) return i.__E = i;
  } catch (c) {
    e = c;
  }
  throw e;
}, "__e") }, Qi = 0, au = /* @__PURE__ */ o(function(e) {
  return e != null && e.constructor == null;
}, "t"), Ar.prototype.setState = function(e, t) {
  var r;
  r = this.__s != null && this.__s !== this.state ? this.__s : this.__s = be({}, this.state), typeof e == "function" && (e = e(be({}, r), this.props)), e && be(r, e), e != null && this.__v && (t && this._sb.push(t), Gi(this));
}, Ar.prototype.forceUpdate = function(e) {
  this.__v && (this.__e = !0, e && this.__h.push(e), Gi(this));
}, Ar.prototype.render = Ue, Pe = [], Yi = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Kn = /* @__PURE__ */ o(function(e, t) {
  return e.__v.__b - t.__v.__b;
}, "f"), Er.__r = 0, Bn = 0, Nn = Xi(!1), Wn = Xi(!0), cu = 0;

// node_modules/oauth4webapi/build/index.js
var Vn;
(typeof navigator > "u" || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) && (Vn = "oauth4webapi/v3.8.3");
function At(e, t) {
  if (e == null)
    return !1;
  try {
    return e instanceof t || Object.getPrototypeOf(e)[Symbol.toStringTag] === t.prototype[Symbol.toStringTag];
  } catch {
    return !1;
  }
}
o(At, "looseInstanceOf");
var Y = "ERR_INVALID_ARG_VALUE", q = "ERR_INVALID_ARG_TYPE";
function C(e, t, r) {
  let n = new TypeError(e, { cause: r });
  return Object.assign(n, { code: t }), n;
}
o(C, "CodedTypeError");
var fe = Symbol(), ds = Symbol(), yu = Symbol(), xe = Symbol(), Rr = Symbol(), Fn = Symbol(), Cg = Symbol(), wu = new TextEncoder(), gu = new TextDecoder();
function ce(e) {
  return typeof e == "string" ? wu.encode(e) : gu.decode(e);
}
o(ce, "buf");
var Gn;
Uint8Array.prototype.toBase64 ? Gn = /* @__PURE__ */ o((e) => (e instanceof ArrayBuffer && (e = new Uint8Array(e)), e.toBase64({ alphabet: "base64url", omitPadding: !0 })), "encodeBase64Url") : Gn = /* @__PURE__ */ o((t) => {
  t instanceof ArrayBuffer && (t = new Uint8Array(t));
  let r = [];
  for (let n = 0; n < t.byteLength; n += 32768)
    r.push(String.fromCharCode.apply(null, t.subarray(n, n + 32768)));
  return btoa(r.join("")).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}, "encodeBase64Url");
var qn;
Uint8Array.fromBase64 ? qn = /* @__PURE__ */ o((e) => {
  try {
    return Uint8Array.fromBase64(e, { alphabet: "base64url" });
  } catch (t) {
    throw C("The input to be decoded is not correctly encoded.", Y, t);
  }
}, "decodeBase64Url") : qn = /* @__PURE__ */ o((e) => {
  try {
    let t = atob(e.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "")), r = new Uint8Array(t.length);
    for (let n = 0; n < t.length; n++)
      r[n] = t.charCodeAt(n);
    return r;
  } catch (t) {
    throw C("The input to be decoded is not correctly encoded.", Y, t);
  }
}, "decodeBase64Url");
function ue(e) {
  return typeof e == "string" ? qn(e) : Gn(e);
}
o(ue, "b64u");
var X = class extends Error {
  static {
    o(this, "UnsupportedOperationError");
  }
  code;
  constructor(t, r) {
    super(t, r), this.name = this.constructor.name, this.code = od, Error.captureStackTrace?.(this, this.constructor);
  }
}, Xn = class extends Error {
  static {
    o(this, "OperationProcessingError");
  }
  code;
  constructor(t, r) {
    super(t, r), this.name = this.constructor.name, r?.code && (this.code = r?.code), Error.captureStackTrace?.(this, this.constructor);
  }
};
function x(e, t, r) {
  return new Xn(e, { code: t, cause: r });
}
o(x, "OPE");
function bu(e, t) {
  if (!(e instanceof CryptoKey))
    throw C(`${t} must be a CryptoKey`, q);
}
o(bu, "assertCryptoKey");
function _u(e, t) {
  if (bu(e, t), e.type !== "private")
    throw C(`${t} must be a private CryptoKey`, Y);
}
o(_u, "assertPrivateKey");
function kr(e) {
  return !(e === null || typeof e != "object" || Array.isArray(e));
}
o(kr, "isJsonObject");
function Cr(e) {
  At(e, Headers) && (e = Object.fromEntries(e.entries()));
  let t = new Headers(e ?? {});
  if (Vn && !t.has("user-agent") && t.set("user-agent", Vn), t.has("authorization"))
    throw C('"options.headers" must not include the "authorization" header name', Y);
  return t;
}
o(Cr, "prepareHeaders");
function eo(e, t) {
  if (t !== void 0) {
    if (typeof t == "function" && (t = t(e.href)), !(t instanceof AbortSignal))
      throw C('"options.signal" must return or be an instance of AbortSignal', q);
    return t;
  }
}
o(eo, "signal");
function ls(e) {
  return e.includes("//") ? e.replace("//", "/") : e;
}
o(ls, "replaceDoubleSlash");
function xu(e, t, r = !1) {
  return e.pathname === "/" ? e.pathname = t : e.pathname = ls(`${t}/${r ? e.pathname : e.pathname.replace(/(\/)$/, "")}`), e;
}
o(xu, "prependWellKnown");
function Su(e, t) {
  return e.pathname = ls(`${e.pathname}/${t}`), e;
}
o(Su, "appendWellKnown");
async function vu(e, t, r, n) {
  if (!(e instanceof URL))
    throw C(`"${t}" must be an instance of URL`, q);
  to(e, n?.[fe] !== !0);
  let i = r(new URL(e.href)), s = Cr(n?.headers);
  return s.set("accept", "application/json"), (n?.[xe] || fetch)(i.href, {
    body: void 0,
    headers: Object.fromEntries(s.entries()),
    method: "GET",
    redirect: "manual",
    signal: eo(i, n?.signal)
  });
}
o(vu, "performDiscovery");
async function fs(e, t) {
  return vu(e, "issuerIdentifier", (r) => {
    switch (t?.algorithm) {
      case void 0:
      case "oidc":
        Su(r, ".well-known/openid-configuration");
        break;
      case "oauth2":
        xu(r, ".well-known/oauth-authorization-server");
        break;
      default:
        throw C('"options.algorithm" must be "oidc" (default), or "oauth2"', Y);
    }
    return r;
  }, t);
}
o(fs, "discoveryRequest");
function St(e, t, r, n, i) {
  try {
    if (typeof e != "number" || !Number.isFinite(e))
      throw C(`${r} must be a number`, q, i);
    if (e > 0)
      return;
    if (t) {
      if (e !== 0)
        throw C(`${r} must be a non-negative number`, Y, i);
      return;
    }
    throw C(`${r} must be a positive number`, Y, i);
  } catch (s) {
    throw n ? x(s.message, n, i) : s;
  }
}
o(St, "assertNumber");
function $(e, t, r, n) {
  try {
    if (typeof e != "string")
      throw C(`${t} must be a string`, q, n);
    if (e.length === 0)
      throw C(`${t} must not be empty`, Y, n);
  } catch (i) {
    throw r ? x(i.message, r, n) : i;
  }
}
o($, "assertString");
async function ps(e, t) {
  let r = e;
  if (!(r instanceof URL) && r !== us)
    throw C('"expectedIssuerIdentifier" must be an instance of URL', q);
  if (!At(t, Response))
    throw C('"response" must be an instance of Response', q);
  if (t.status !== 200)
    throw x('"response" is not a conform Authorization Server Metadata response (unexpected HTTP status code)', oo, t);
  Wr(t);
  let n = await so(t);
  if ($(n.issuer, '"response" body "issuer" property', R, { body: n }), r !== us && new URL(n.issuer).href !== r.href)
    throw x('"response" body "issuer" property does not match the expected value', Ps, { expected: r.href, body: n, attribute: "issuer" });
  return n;
}
o(ps, "processDiscoveryResponse");
function hs(e) {
  Eu(e, "application/json");
}
o(hs, "assertApplicationJson");
function Au(e, ...t) {
  let r = '"response" content-type must be ';
  if (t.length > 2) {
    let n = t.pop();
    r += `${t.join(", ")}, or ${n}`;
  } else t.length === 2 ? r += `${t[0]} or ${t[1]}` : r += t[0];
  return x(r, ad, e);
}
o(Au, "notJson");
function Eu(e, t) {
  if (xs(e) !== t)
    throw Au(e, t);
}
o(Eu, "assertContentType");
function Pr() {
  return ue(crypto.getRandomValues(new Uint8Array(32)));
}
o(Pr, "randomBytes");
function Ur() {
  return Pr();
}
o(Ur, "generateRandomCodeVerifier");
function Or() {
  return Pr();
}
o(Or, "generateRandomState");
function Lr() {
  return Pr();
}
o(Lr, "generateRandomNonce");
async function Hr(e) {
  return $(e, "codeVerifier"), ue(await crypto.subtle.digest("SHA-256", ce(e)));
}
o(Hr, "calculatePKCECodeChallenge");
function ku(e) {
  return e instanceof CryptoKey ? { key: e } : e?.key instanceof CryptoKey ? (e.kid !== void 0 && $(e.kid, '"kid"'), {
    key: e.key,
    kid: e.kid
  }) : {};
}
o(ku, "getKeyAndKid");
function Iu(e) {
  switch (e.algorithm.hash.name) {
    case "SHA-256":
      return "PS256";
    case "SHA-384":
      return "PS384";
    case "SHA-512":
      return "PS512";
    default:
      throw new X("unsupported RsaHashedKeyAlgorithm hash name", {
        cause: e
      });
  }
}
o(Iu, "psAlg");
function Tu(e) {
  switch (e.algorithm.hash.name) {
    case "SHA-256":
      return "RS256";
    case "SHA-384":
      return "RS384";
    case "SHA-512":
      return "RS512";
    default:
      throw new X("unsupported RsaHashedKeyAlgorithm hash name", {
        cause: e
      });
  }
}
o(Tu, "rsAlg");
function Ru(e) {
  switch (e.algorithm.namedCurve) {
    case "P-256":
      return "ES256";
    case "P-384":
      return "ES384";
    case "P-521":
      return "ES512";
    default:
      throw new X("unsupported EcKeyAlgorithm namedCurve", { cause: e });
  }
}
o(Ru, "esAlg");
function Cu(e) {
  switch (e.algorithm.name) {
    case "RSA-PSS":
      return Iu(e);
    case "RSASSA-PKCS1-v1_5":
      return Tu(e);
    case "ECDSA":
      return Ru(e);
    case "Ed25519":
    case "ML-DSA-44":
    case "ML-DSA-65":
    case "ML-DSA-87":
      return e.algorithm.name;
    case "EdDSA":
      return "Ed25519";
    default:
      throw new X("unsupported CryptoKey algorithm name", { cause: e });
  }
}
o(Cu, "keyToJws");
function Qe(e) {
  let t = e?.[ds];
  return typeof t == "number" && Number.isFinite(t) ? t : 0;
}
o(Qe, "getClockSkew");
function Dr(e) {
  let t = e?.[yu];
  return typeof t == "number" && Number.isFinite(t) && Math.sign(t) !== -1 ? t : 30;
}
o(Dr, "getClockTolerance");
function Kr() {
  return Math.floor(Date.now() / 1e3);
}
o(Kr, "epochTime");
function Et(e) {
  if (typeof e != "object" || e === null)
    throw C('"as" must be an object', q);
  $(e.issuer, '"as.issuer"');
}
o(Et, "assertAs");
function kt(e) {
  if (typeof e != "object" || e === null)
    throw C('"client" must be an object', q);
  $(e.client_id, '"client.client_id"');
}
o(kt, "assertClient");
function ms(e) {
  return $(e, '"clientSecret"'), (t, r, n, i) => {
    n.set("client_id", r.client_id), n.set("client_secret", e);
  };
}
o(ms, "ClientSecretPost");
function ys(e, t) {
  let r = Kr() + Qe(t);
  return {
    jti: Pr(),
    aud: e.issuer,
    exp: r + 60,
    iat: r,
    nbf: r,
    iss: t.client_id,
    sub: t.client_id
  };
}
o(ys, "clientAssertionPayload");
function ws(e, t) {
  let { key: r, kid: n } = ku(e);
  return _u(r, '"clientPrivateKey.key"'), async (i, s, a, c) => {
    let d = { alg: Cu(r), kid: n }, u = ys(i, s);
    t?.[Rr]?.(d, u), a.set("client_id", s.client_id), a.set("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"), a.set("client_assertion", await Pu(d, u, r));
  };
}
o(ws, "PrivateKeyJwt");
function gs(e, t) {
  $(e, '"clientSecret"');
  let r = t?.[Rr], n;
  return async (i, s, a, c) => {
    n ||= await crypto.subtle.importKey("raw", ce(e), { hash: "SHA-256", name: "HMAC" }, !1, ["sign"]);
    let d = { alg: "HS256" }, u = ys(i, s);
    r?.(d, u);
    let f = `${ue(ce(JSON.stringify(d)))}.${ue(ce(JSON.stringify(u)))}`, l = await crypto.subtle.sign(n.algorithm, n, ce(f));
    a.set("client_id", s.client_id), a.set("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"), a.set("client_assertion", `${f}.${ue(new Uint8Array(l))}`);
  };
}
o(gs, "ClientSecretJwt");
async function Pu(e, t, r) {
  if (!r.usages.includes("sign"))
    throw C('CryptoKey instances used for signing assertions must include "sign" in their "usages"', Y);
  let n = `${ue(ce(JSON.stringify(e)))}.${ue(ce(JSON.stringify(t)))}`, i = ue(await crypto.subtle.sign(pd(r), r, ce(n)));
  return `${n}.${i}`;
}
o(Pu, "signJwt");
var Uu = URL.parse ? (e, t) => URL.parse(e, t) : (e, t) => {
  try {
    return new URL(e, t);
  } catch {
    return null;
  }
};
function to(e, t) {
  if (t && e.protocol !== "https:")
    throw x("only requests to HTTPS are allowed", cd, e);
  if (e.protocol !== "https:" && e.protocol !== "http:")
    throw x("only HTTP and HTTPS requests are allowed", ud, e);
}
o(to, "checkProtocol");
function as(e, t, r, n) {
  let i;
  if (typeof e != "string" || !(i = Uu(e)))
    throw x(`authorization server metadata does not contain a valid ${r ? `"as.mtls_endpoint_aliases.${t}"` : `"as.${t}"`}`, e === void 0 ? dd : ld, { attribute: r ? `mtls_endpoint_aliases.${t}` : t });
  return to(i, n), i;
}
o(as, "validateEndpoint");
function bs(e, t, r, n) {
  return r && e.mtls_endpoint_aliases && t in e.mtls_endpoint_aliases ? as(e.mtls_endpoint_aliases[t], t, r, n) : as(e[t], t, r, n);
}
o(bs, "resolveEndpoint");
var Zn = class extends Error {
  static {
    o(this, "ResponseBodyError");
  }
  cause;
  code;
  error;
  status;
  error_description;
  response;
  constructor(t, r) {
    super(t, r), this.name = this.constructor.name, this.code = nd, this.cause = r.cause, this.error = r.cause.error, this.status = r.response.status, this.error_description = r.cause.error_description, Object.defineProperty(this, "response", { enumerable: !1, value: r.response }), Error.captureStackTrace?.(this, this.constructor);
  }
}, vt = class extends Error {
  static {
    o(this, "AuthorizationResponseError");
  }
  cause;
  code;
  error;
  error_description;
  constructor(t, r) {
    super(t, r), this.name = this.constructor.name, this.code = id, this.cause = r.cause, this.error = r.cause.get("error"), this.error_description = r.cause.get("error_description") ?? void 0, Error.captureStackTrace?.(this, this.constructor);
  }
}, Qn = class extends Error {
  static {
    o(this, "WWWAuthenticateChallengeError");
  }
  cause;
  code;
  response;
  status;
  constructor(t, r) {
    super(t, r), this.name = this.constructor.name, this.code = rd, this.cause = r.cause, this.status = r.response.status, this.response = r.response, Object.defineProperty(this, "response", { enumerable: !1 }), Error.captureStackTrace?.(this, this.constructor);
  }
}, Ir = "[a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+", Ou = "[a-zA-Z0-9\\-\\._\\~\\+\\/]+={0,2}", Lu = '"((?:[^"\\\\]|\\\\[\\s\\S])*)"', Hu = "(" + Ir + ")\\s*=\\s*" + Lu, Du = "(" + Ir + ")\\s*=\\s*(" + Ir + ")", Ku = new RegExp("^[,\\s]*(" + Ir + ")"), Nu = new RegExp("^[,\\s]*" + Hu + "[,\\s]*(.*)"), Wu = new RegExp("^[,\\s]*" + Du + "[,\\s]*(.*)"), $u = new RegExp("^(" + Ou + ")(?:$|[,\\s])(.*)");
function Bu(e) {
  if (!At(e, Response))
    throw C('"response" must be an instance of Response', q);
  let t = e.headers.get("www-authenticate");
  if (t === null)
    return;
  let r = [], n = t;
  for (; n; ) {
    let i = n.match(Ku), s = i?.[1].toLowerCase();
    if (!s)
      return;
    let a = n.substring(i[0].length);
    if (a && !a.match(/^[\s,]/))
      return;
    let c = a.match(/^\s+(.*)$/), d = !!c;
    n = c ? c[1] : void 0;
    let u = {}, f;
    if (d)
      for (; n; ) {
        let y, p;
        if (i = n.match(Nu)) {
          if ([, y, p, n] = i, p.includes("\\"))
            try {
              p = JSON.parse(`"${p}"`);
            } catch {
            }
          u[y.toLowerCase()] = p;
          continue;
        }
        if (i = n.match(Wu)) {
          [, y, p, n] = i, u[y.toLowerCase()] = p;
          continue;
        }
        if (i = n.match($u)) {
          if (Object.keys(u).length)
            break;
          [, f, n] = i;
          break;
        }
        return;
      }
    else
      n = a || void 0;
    let l = { scheme: s, parameters: u };
    f && (l.token68 = f), r.push(l);
  }
  if (r.length)
    return r;
}
o(Bu, "parseWwwAuthenticateChallenges");
async function Ju(e) {
  if (e.status > 399 && e.status < 500) {
    Wr(e), hs(e);
    try {
      let t = await e.clone().json();
      if (kr(t) && typeof t.error == "string" && t.error.length)
        return t;
    } catch {
    }
  }
}
o(Ju, "parseOAuthResponseErrorBody");
async function Mu(e, t, r) {
  if (e.status !== t) {
    ks(e);
    let n;
    throw (n = await Ju(e)) ? (await e.body?.cancel(), new Zn("server responded with an error in the response body", {
      cause: n,
      response: e
    })) : x(`"response" is not a conform ${r} response (unexpected HTTP status code)`, oo, e);
  }
}
o(Mu, "checkOAuthBodyError");
function _s(e) {
  if (!no.has(e))
    throw C('"options.DPoP" is not a valid DPoPHandle', Y);
}
o(_s, "assertDPoP");
async function zu(e, t, r, n, i, s) {
  if ($(e, '"accessToken"'), !(r instanceof URL))
    throw C('"url" must be an instance of URL', q);
  to(r, s?.[fe] !== !0), n = Cr(n), s?.DPoP && (_s(s.DPoP), await s.DPoP.addProof(r, n, t.toUpperCase(), e)), n.set("authorization", `${n.has("dpop") ? "DPoP" : "Bearer"} ${e}`);
  let a = await (s?.[xe] || fetch)(r.href, {
    body: i,
    headers: Object.fromEntries(n.entries()),
    method: t,
    redirect: "manual",
    signal: eo(r, s?.signal)
  });
  return s?.DPoP?.cacheNonce(a, r), a;
}
o(zu, "resourceRequest");
async function ro(e, t, r, n) {
  Et(e), kt(t);
  let i = bs(e, "userinfo_endpoint", t.use_mtls_endpoint_aliases, n?.[fe] !== !0), s = Cr(n?.headers);
  return t.userinfo_signed_response_alg ? s.set("accept", "application/jwt") : (s.set("accept", "application/json"), s.append("accept", "application/jwt")), zu(r, "GET", i, s, null, {
    ...n,
    [ds]: Qe(t)
  });
}
o(ro, "userInfoRequest");
var ju = Symbol();
function xs(e) {
  return e.headers.get("content-type")?.split(";")[0];
}
o(xs, "getContentType");
async function Ss(e, t, r, n, i) {
  if (Et(e), kt(t), !At(n, Response))
    throw C('"response" must be an instance of Response', q);
  if (ks(n), n.status !== 200)
    throw x('"response" is not a conform UserInfo Endpoint response (unexpected HTTP status code)', oo, n);
  Wr(n);
  let s;
  if (xs(n) === "application/jwt") {
    let { claims: a, jwt: c } = await Us(await n.text(), Os.bind(void 0, t.userinfo_signed_response_alg, e.userinfo_signing_alg_values_supported, void 0), Qe(t), Dr(t), i?.[Fn]).then(Gu.bind(void 0, t.client_id)).then(qu.bind(void 0, e));
    As.set(n, c), s = a;
  } else {
    if (t.userinfo_signed_response_alg)
      throw x("JWT UserInfo Response expected", sd, n);
    s = await so(n);
  }
  switch ($(s.sub, '"response" body "sub" property', R, { body: s }), r) {
    case ju:
      break;
    default:
      if ($(r, '"expectedSubject"'), s.sub !== r)
        throw x('unexpected "response" body "sub" property value', Ps, {
          expected: r,
          body: s,
          attribute: "sub"
        });
  }
  return s;
}
o(Ss, "processUserInfoResponse");
async function Vu(e, t, r, n, i, s, a) {
  return await r(e, t, i, s), s.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"), (a?.[xe] || fetch)(n.href, {
    body: i,
    headers: Object.fromEntries(s.entries()),
    method: "POST",
    redirect: "manual",
    signal: eo(n, a?.signal)
  });
}
o(Vu, "authenticatedRequest");
async function Fu(e, t, r, n, i, s) {
  let a = bs(e, "token_endpoint", t.use_mtls_endpoint_aliases, s?.[fe] !== !0);
  i.set("grant_type", n);
  let c = Cr(s?.headers);
  c.set("accept", "application/json"), s?.DPoP !== void 0 && (_s(s.DPoP), await s.DPoP.addProof(a, c, "POST"));
  let d = await Vu(e, t, r, a, i, c, s);
  return s?.DPoP?.cacheNonce(d, a), d;
}
o(Fu, "tokenEndpointRequest");
var vs = /* @__PURE__ */ new WeakMap(), As = /* @__PURE__ */ new WeakMap();
function Nr(e) {
  if (!e.id_token)
    return;
  let t = vs.get(e);
  if (!t)
    throw C('"ref" was already garbage collected or did not resolve from the proper sources', Y);
  return t;
}
o(Nr, "getValidatedIdTokenClaims");
async function Es(e, t, r, n, i, s) {
  if (Et(e), kt(t), !At(r, Response))
    throw C('"response" must be an instance of Response', q);
  await Mu(r, 200, "Token Endpoint"), Wr(r);
  let a = await so(r);
  if ($(a.access_token, '"response" body "access_token" property', R, {
    body: a
  }), $(a.token_type, '"response" body "token_type" property', R, {
    body: a
  }), a.token_type = a.token_type.toLowerCase(), a.expires_in !== void 0) {
    let c = typeof a.expires_in != "number" ? parseFloat(a.expires_in) : a.expires_in;
    St(c, !0, '"response" body "expires_in" property', R, {
      body: a
    }), a.expires_in = c;
  }
  if (a.refresh_token !== void 0 && $(a.refresh_token, '"response" body "refresh_token" property', R, {
    body: a
  }), a.scope !== void 0 && typeof a.scope != "string")
    throw x('"response" body "scope" property must be a string', R, { body: a });
  if (a.id_token !== void 0) {
    $(a.id_token, '"response" body "id_token" property', R, {
      body: a
    });
    let c = ["aud", "exp", "iat", "iss", "sub"];
    t.require_auth_time === !0 && c.push("auth_time"), t.default_max_age !== void 0 && (St(t.default_max_age, !0, '"client.default_max_age"'), c.push("auth_time")), n?.length && c.push(...n);
    let { claims: d, jwt: u } = await Us(a.id_token, Os.bind(void 0, t.id_token_signed_response_alg, e.id_token_signing_alg_values_supported, "RS256"), Qe(t), Dr(t), i).then(Yu.bind(void 0, c)).then(Ts.bind(void 0, e)).then(Is.bind(void 0, t.client_id));
    if (Array.isArray(d.aud) && d.aud.length !== 1) {
      if (d.azp === void 0)
        throw x('ID Token "aud" (audience) claim includes additional untrusted audiences', _e, { claims: d, claim: "aud" });
      if (d.azp !== t.client_id)
        throw x('unexpected ID Token "azp" (authorized party) claim value', _e, { expected: t.client_id, claims: d, claim: "azp" });
    }
    d.auth_time !== void 0 && St(d.auth_time, !0, 'ID Token "auth_time" (authentication time)', R, { claims: d }), As.set(r, u), vs.set(a, d);
  }
  if (s?.[a.token_type] !== void 0)
    s[a.token_type](r, a);
  else if (a.token_type !== "dpop" && a.token_type !== "bearer")
    throw new X("unsupported `token_type` value", { cause: { body: a } });
  return a;
}
o(Es, "processGenericAccessTokenResponse");
function ks(e) {
  let t;
  if (t = Bu(e))
    throw new Qn("server responded with a challenge in the WWW-Authenticate HTTP Header", { cause: t, response: e });
}
o(ks, "checkAuthenticationChallenges");
function Gu(e, t) {
  return t.claims.aud !== void 0 ? Is(e, t) : t;
}
o(Gu, "validateOptionalAudience");
function Is(e, t) {
  if (Array.isArray(t.claims.aud)) {
    if (!t.claims.aud.includes(e))
      throw x('unexpected JWT "aud" (audience) claim value', _e, {
        expected: e,
        claims: t.claims,
        claim: "aud"
      });
  } else if (t.claims.aud !== e)
    throw x('unexpected JWT "aud" (audience) claim value', _e, {
      expected: e,
      claims: t.claims,
      claim: "aud"
    });
  return t;
}
o(Is, "validateAudience");
function qu(e, t) {
  return t.claims.iss !== void 0 ? Ts(e, t) : t;
}
o(qu, "validateOptionalIssuer");
function Ts(e, t) {
  let r = e[md]?.(t) ?? e.issuer;
  if (t.claims.iss !== r)
    throw x('unexpected JWT "iss" (issuer) claim value', _e, {
      expected: r,
      claims: t.claims,
      claim: "iss"
    });
  return t;
}
o(Ts, "validateIssuer");
var no = /* @__PURE__ */ new WeakSet();
function Xu(e) {
  return no.add(e), e;
}
o(Xu, "brand");
var Zu = Symbol();
async function Rs(e, t, r, n, i, s, a) {
  if (Et(e), kt(t), !no.has(n))
    throw C('"callbackParameters" must be an instance of URLSearchParams obtained from "validateAuthResponse()", or "validateJwtAuthResponse()', Y);
  $(i, '"redirectUri"');
  let c = Le(n, "code");
  if (!c)
    throw x('no authorization code in "callbackParameters"', R);
  let d = new URLSearchParams(a?.additionalParameters);
  return d.set("redirect_uri", i), d.set("code", c), s !== Zu && ($(s, '"codeVerifier"'), d.set("code_verifier", s)), Fu(e, t, r, "authorization_code", d, a);
}
o(Rs, "authorizationCodeGrantRequest");
var Qu = {
  aud: "audience",
  c_hash: "code hash",
  client_id: "client id",
  exp: "expiration time",
  iat: "issued at",
  iss: "issuer",
  jti: "jwt id",
  nonce: "nonce",
  s_hash: "state hash",
  sub: "subject",
  ath: "access token hash",
  htm: "http method",
  htu: "http uri",
  cnf: "confirmation",
  auth_time: "authentication time"
};
function Yu(e, t) {
  for (let r of e)
    if (t.claims[r] === void 0)
      throw x(`JWT "${r}" (${Qu[r]}) claim missing`, R, {
        claims: t.claims
      });
  return t;
}
o(Yu, "validatePresence");
var zn = Symbol(), jn = Symbol();
async function Cs(e, t, r, n) {
  return typeof n?.expectedNonce == "string" || typeof n?.maxAge == "number" || n?.requireIdToken ? ed(e, t, r, n.expectedNonce, n.maxAge, n[Fn], n.recognizedTokenTypes) : td(e, t, r, n?.[Fn], n?.recognizedTokenTypes);
}
o(Cs, "processAuthorizationCodeResponse");
async function ed(e, t, r, n, i, s, a) {
  let c = [];
  switch (n) {
    case void 0:
      n = zn;
      break;
    case zn:
      break;
    default:
      $(n, '"expectedNonce" argument'), c.push("nonce");
  }
  switch (i ??= t.default_max_age, i) {
    case void 0:
      i = jn;
      break;
    case jn:
      break;
    default:
      St(i, !0, '"maxAge" argument'), c.push("auth_time");
  }
  let d = await Es(e, t, r, c, s, a);
  $(d.id_token, '"response" body "id_token" property', R, {
    body: d
  });
  let u = Nr(d);
  if (i !== jn) {
    let f = Kr() + Qe(t), l = Dr(t);
    if (u.auth_time + i < f - l)
      throw x("too much time has elapsed since the last End-User authentication", Tr, { claims: u, now: f, tolerance: l, claim: "auth_time" });
  }
  if (n === zn) {
    if (u.nonce !== void 0)
      throw x('unexpected ID Token "nonce" claim value', _e, {
        expected: void 0,
        claims: u,
        claim: "nonce"
      });
  } else if (u.nonce !== n)
    throw x('unexpected ID Token "nonce" claim value', _e, {
      expected: n,
      claims: u,
      claim: "nonce"
    });
  return d;
}
o(ed, "processAuthorizationCodeOpenIDResponse");
async function td(e, t, r, n, i) {
  let s = await Es(e, t, r, void 0, n, i), a = Nr(s);
  if (a) {
    if (t.default_max_age !== void 0) {
      St(t.default_max_age, !0, '"client.default_max_age"');
      let c = Kr() + Qe(t), d = Dr(t);
      if (a.auth_time + t.default_max_age < c - d)
        throw x("too much time has elapsed since the last End-User authentication", Tr, { claims: a, now: c, tolerance: d, claim: "auth_time" });
    }
    if (a.nonce !== void 0)
      throw x('unexpected ID Token "nonce" claim value', _e, {
        expected: void 0,
        claims: a,
        claim: "nonce"
      });
  }
  return s;
}
o(td, "processAuthorizationCodeOAuth2Response");
var rd = "OAUTH_WWW_AUTHENTICATE_CHALLENGE", nd = "OAUTH_RESPONSE_BODY_ERROR", od = "OAUTH_UNSUPPORTED_OPERATION", id = "OAUTH_AUTHORIZATION_RESPONSE_ERROR", sd = "OAUTH_JWT_USERINFO_EXPECTED", Yn = "OAUTH_PARSE_ERROR", R = "OAUTH_INVALID_RESPONSE";
var ad = "OAUTH_RESPONSE_IS_NOT_JSON", oo = "OAUTH_RESPONSE_IS_NOT_CONFORM", cd = "OAUTH_HTTP_REQUEST_FORBIDDEN", ud = "OAUTH_REQUEST_PROTOCOL_FORBIDDEN", Tr = "OAUTH_JWT_TIMESTAMP_CHECK_FAILED", _e = "OAUTH_JWT_CLAIM_COMPARISON_FAILED", Ps = "OAUTH_JSON_ATTRIBUTE_COMPARISON_FAILED";
var dd = "OAUTH_MISSING_SERVER_METADATA", ld = "OAUTH_INVALID_SERVER_METADATA";
function Wr(e) {
  if (e.bodyUsed)
    throw C('"response" body has been used already', Y);
}
o(Wr, "assertReadableResponse");
function cs(e) {
  let { algorithm: t } = e;
  if (typeof t.modulusLength != "number" || t.modulusLength < 2048)
    throw new X(`unsupported ${t.name} modulusLength`, {
      cause: e
    });
}
o(cs, "checkRsaKeyAlgorithm");
function fd(e) {
  let { algorithm: t } = e;
  switch (t.namedCurve) {
    case "P-256":
      return "SHA-256";
    case "P-384":
      return "SHA-384";
    case "P-521":
      return "SHA-512";
    default:
      throw new X("unsupported ECDSA namedCurve", { cause: e });
  }
}
o(fd, "ecdsaHashName");
function pd(e) {
  switch (e.algorithm.name) {
    case "ECDSA":
      return {
        name: e.algorithm.name,
        hash: fd(e)
      };
    case "RSA-PSS":
      switch (cs(e), e.algorithm.hash.name) {
        case "SHA-256":
        case "SHA-384":
        case "SHA-512":
          return {
            name: e.algorithm.name,
            saltLength: parseInt(e.algorithm.hash.name.slice(-3), 10) >> 3
          };
        default:
          throw new X("unsupported RSA-PSS hash name", { cause: e });
      }
    case "RSASSA-PKCS1-v1_5":
      return cs(e), e.algorithm.name;
    case "ML-DSA-44":
    case "ML-DSA-65":
    case "ML-DSA-87":
    case "Ed25519":
      return e.algorithm.name;
  }
  throw new X("unsupported CryptoKey algorithm name", { cause: e });
}
o(pd, "keyToSubtle");
async function Us(e, t, r, n, i) {
  let { 0: s, 1: a, length: c } = e.split(".");
  if (c === 5)
    if (i !== void 0)
      e = await i(e), { 0: s, 1: a, length: c } = e.split(".");
    else
      throw new X("JWE decryption is not configured", { cause: e });
  if (c !== 3)
    throw x("Invalid JWT", R, e);
  let d;
  try {
    d = JSON.parse(ce(ue(s)));
  } catch (l) {
    throw x("failed to parse JWT Header body as base64url encoded JSON", Yn, l);
  }
  if (!kr(d))
    throw x("JWT Header must be a top level object", R, e);
  if (t(d), d.crit !== void 0)
    throw new X('no JWT "crit" header parameter extensions are supported', {
      cause: { header: d }
    });
  let u;
  try {
    u = JSON.parse(ce(ue(a)));
  } catch (l) {
    throw x("failed to parse JWT Payload body as base64url encoded JSON", Yn, l);
  }
  if (!kr(u))
    throw x("JWT Payload must be a top level object", R, e);
  let f = Kr() + r;
  if (u.exp !== void 0) {
    if (typeof u.exp != "number")
      throw x('unexpected JWT "exp" (expiration time) claim type', R, { claims: u });
    if (u.exp <= f - n)
      throw x('unexpected JWT "exp" (expiration time) claim value, expiration is past current timestamp', Tr, { claims: u, now: f, tolerance: n, claim: "exp" });
  }
  if (u.iat !== void 0 && typeof u.iat != "number")
    throw x('unexpected JWT "iat" (issued at) claim type', R, { claims: u });
  if (u.iss !== void 0 && typeof u.iss != "string")
    throw x('unexpected JWT "iss" (issuer) claim type', R, { claims: u });
  if (u.nbf !== void 0) {
    if (typeof u.nbf != "number")
      throw x('unexpected JWT "nbf" (not before) claim type', R, { claims: u });
    if (u.nbf > f + n)
      throw x('unexpected JWT "nbf" (not before) claim value', Tr, {
        claims: u,
        now: f,
        tolerance: n,
        claim: "nbf"
      });
  }
  if (u.aud !== void 0 && typeof u.aud != "string" && !Array.isArray(u.aud))
    throw x('unexpected JWT "aud" (audience) claim type', R, { claims: u });
  return { header: d, claims: u, jwt: e };
}
o(Us, "validateJwt");
function Os(e, t, r, n) {
  if (e !== void 0) {
    if (typeof e == "string" ? n.alg !== e : !e.includes(n.alg))
      throw x('unexpected JWT "alg" header parameter', R, {
        header: n,
        expected: e,
        reason: "client configuration"
      });
    return;
  }
  if (Array.isArray(t)) {
    if (!t.includes(n.alg))
      throw x('unexpected JWT "alg" header parameter', R, {
        header: n,
        expected: t,
        reason: "authorization server metadata"
      });
    return;
  }
  if (r !== void 0) {
    if (typeof r == "string" ? n.alg !== r : typeof r == "function" ? !r(n.alg) : !r.includes(n.alg))
      throw x('unexpected JWT "alg" header parameter', R, {
        header: n,
        expected: r,
        reason: "default value"
      });
    return;
  }
  throw x('missing client or server configuration to verify used JWT "alg" header parameter', void 0, { client: e, issuer: t, fallback: r });
}
o(Os, "checkSigningAlgorithm");
function Le(e, t) {
  let { 0: r, length: n } = e.getAll(t);
  if (n > 1)
    throw x(`"${t}" parameter must be provided only once`, R);
  return r;
}
o(Le, "getURLSearchParameter");
var io = Symbol(), hd = Symbol();
function Ls(e, t, r, n) {
  if (Et(e), kt(t), r instanceof URL && (r = r.searchParams), !(r instanceof URLSearchParams))
    throw C('"parameters" must be an instance of URLSearchParams, or URL', q);
  if (Le(r, "response"))
    throw x('"parameters" contains a JARM response, use validateJwtAuthResponse() instead of validateAuthResponse()', R, { parameters: r });
  let i = Le(r, "iss"), s = Le(r, "state");
  if (!i && e.authorization_response_iss_parameter_supported)
    throw x('response parameter "iss" (issuer) missing', R, { parameters: r });
  if (i && i !== e.issuer)
    throw x('unexpected "iss" (issuer) response parameter value', R, {
      expected: e.issuer,
      parameters: r
    });
  switch (n) {
    case void 0:
    case hd:
      if (s !== void 0)
        throw x('unexpected "state" response parameter encountered', R, {
          expected: void 0,
          parameters: r
        });
      break;
    case io:
      break;
    default:
      if ($(n, '"expectedState" argument'), s !== n)
        throw x(s === void 0 ? 'response parameter "state" missing' : 'unexpected "state" response parameter value', R, { expected: n, parameters: r });
  }
  if (Le(r, "error"))
    throw new vt("authorization response from the server is an error", {
      cause: r
    });
  let c = Le(r, "id_token"), d = Le(r, "token");
  if (c !== void 0 || d !== void 0)
    throw new X("implicit and hybrid flows are not supported");
  return Xu(new URLSearchParams(r));
}
o(Ls, "validateAuthResponse");
async function so(e, t = hs) {
  let r;
  try {
    r = await e.json();
  } catch (n) {
    throw t(e), x('failed to parse "response" body as JSON', Yn, n);
  }
  if (!kr(r))
    throw x('"response" body must be a top level object', R, { body: r });
  return r;
}
o(so, "getResponseJsonBody");
var us = Symbol(), md = Symbol();

// node_modules/@auth/core/lib/actions/callback/oauth/checks.js
var ao = 900;
async function co(e, t, r) {
  let { cookies: n, logger: i } = r, s = n[e], a = /* @__PURE__ */ new Date();
  a.setTime(a.getTime() + ao * 1e3), i.debug(`CREATE_${e.toUpperCase()}`, {
    name: s.name,
    payload: t,
    COOKIE_TTL: ao,
    expires: a
  });
  let c = await xr({
    ...r.jwt,
    maxAge: ao,
    token: { value: t },
    salt: s.name
  }), d = { ...s.options, expires: a };
  return { name: s.name, value: c, options: d };
}
o(co, "sealCookie");
async function yd(e, t, r) {
  try {
    let { logger: n, cookies: i, jwt: s } = r;
    if (n.debug(`PARSE_${e.toUpperCase()}`, { cookie: t }), !t)
      throw new he(`${e} cookie was missing`);
    let a = await Sr({
      ...s,
      token: t,
      salt: i[e].name
    });
    if (a?.value)
      return a.value;
    throw new Error("Invalid cookie");
  } catch (n) {
    throw new he(`${e} value could not be parsed`, {
      cause: n
    });
  }
}
o(yd, "parseCookie");
function wd(e, t, r) {
  let { logger: n, cookies: i } = t, s = i[e];
  n.debug(`CLEAR_${e.toUpperCase()}`, { cookie: s }), r.push({
    name: s.name,
    value: "",
    options: { ...i[e].options, maxAge: 0 }
  });
}
o(wd, "clearCookie");
function uo(e, t) {
  return async function(r, n, i) {
    let { provider: s, logger: a } = i;
    if (!s?.checks?.includes(e))
      return;
    let c = r?.[i.cookies[t].name];
    a.debug(`USE_${t.toUpperCase()}`, { value: c });
    let d = await yd(t, c, i);
    return wd(t, i, n), d;
  };
}
o(uo, "useCookie");
var Ds = {
  /** Creates a PKCE code challenge and verifier pair. The verifier in stored in the cookie. */
  async create(e) {
    let t = Ur(), r = await Hr(t);
    return { cookie: await co("pkceCodeVerifier", t, e), value: r };
  },
  /**
   * Returns code_verifier if the provider is configured to use PKCE,
   * and clears the container cookie afterwards.
   * An error is thrown if the code_verifier is missing or invalid.
   */
  use: uo("pkce", "pkceCodeVerifier")
}, gd = 900, Hs = "encodedState", lo = {
  /** Creates a state cookie with an optionally encoded body. */
  async create(e, t) {
    let { provider: r } = e;
    if (!r.checks.includes("state")) {
      if (t)
        throw new he("State data was provided but the provider is not configured to use state");
      return;
    }
    let n = {
      origin: t,
      random: Or()
    }, i = await xr({
      secret: e.jwt.secret,
      token: n,
      salt: Hs,
      maxAge: gd
    });
    return { cookie: await co("state", i, e), value: i };
  },
  /**
   * Returns state if the provider is configured to use state,
   * and clears the container cookie afterwards.
   * An error is thrown if the state is missing or invalid.
   */
  use: uo("state", "state"),
  /** Decodes the state. If it could not be decoded, it throws an error. */
  async decode(e, t) {
    try {
      t.logger.debug("DECODE_STATE", { state: e });
      let r = await Sr({
        secret: t.jwt.secret,
        token: e,
        salt: Hs
      });
      if (r)
        return r;
      throw new Error("Invalid state");
    } catch (r) {
      throw new he("State could not be decoded", { cause: r });
    }
  }
}, Ks = {
  async create(e) {
    if (!e.provider.checks.includes("nonce"))
      return;
    let t = Lr();
    return { cookie: await co("nonce", t, e), value: t };
  },
  /**
   * Returns nonce if the provider is configured to use nonce,
   * and clears the container cookie afterwards.
   * An error is thrown if the nonce is missing or invalid.
   * @see https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes
   * @see https://danielfett.de/2020/05/16/pkce-vs-nonce-equivalent-or-not/#nonce
   */
  use: uo("nonce", "nonce")
};

// node_modules/@auth/core/lib/utils/env.js
function fo(e, t, r = !1) {
  try {
    let n = e.AUTH_URL;
    n && (t.basePath ? r || xt(t).warn("env-url-basepath-redundant") : t.basePath = new URL(n).pathname);
  } catch {
  } finally {
    t.basePath ?? (t.basePath = "/auth");
  }
  if (!t.secret?.length) {
    t.secret = [];
    let n = e.AUTH_SECRET;
    n && t.secret.push(n);
    for (let i of [1, 2, 3]) {
      let s = e[`AUTH_SECRET_${i}`];
      s && t.secret.unshift(s);
    }
  }
  t.redirectProxyUrl ?? (t.redirectProxyUrl = e.AUTH_REDIRECT_PROXY_URL), t.trustHost ?? (t.trustHost = !!(e.AUTH_URL ?? e.AUTH_TRUST_HOST ?? e.VERCEL ?? e.CF_PAGES ?? e.NODE_ENV !== "production")), t.providers = t.providers.map((n) => {
    let { id: i } = typeof n == "function" ? n({}) : n, s = i.toUpperCase().replace(/-/g, "_"), a = e[`AUTH_${s}_ID`], c = e[`AUTH_${s}_SECRET`], d = e[`AUTH_${s}_ISSUER`], u = e[`AUTH_${s}_KEY`], f = typeof n == "function" ? n({ clientId: a, clientSecret: c, issuer: d, apiKey: u }) : n;
    return f.type === "oauth" || f.type === "oidc" ? (f.clientId ?? (f.clientId = a), f.clientSecret ?? (f.clientSecret = c), f.issuer ?? (f.issuer = d)) : f.type === "email" && (f.apiKey ?? (f.apiKey = u)), f;
  });
}
o(fo, "setEnvDefaults");

// node_modules/@convex-dev/auth/dist/server/provider_utils.js
function Ws(e) {
  let t = mo(e), r = t.providers.filter((n) => n.type === "credentials").map((n) => n.extraProviders).flat().filter((n) => n !== void 0);
  return {
    ...t,
    extraProviders: Id(r),
    theme: t.theme ?? {
      colorScheme: "auto",
      logo: "",
      brandColor: "",
      buttonText: ""
    }
  };
}
o(Ws, "configDefaults");
function $s(e) {
  let t = { providers: [e] };
  return mo(t), t.providers[0];
}
o($s, "materializeProvider");
function Id(e) {
  let t = { providers: e };
  return mo(t), t.providers;
}
o(Id, "materializeProviders");
function mo(e) {
  let t = e.providers.map((n) => Td(typeof n == "function" ? n() : n)), r = { ...e, providers: t };
  return fo(process.env, r), r.providers.forEach((n) => {
    if (n.type === "phone") {
      let i = n.id.toUpperCase().replace(/-/g, "_");
      n.apiKey ??= process.env[`AUTH_${i}_KEY`];
    }
  }), r;
}
o(mo, "materializeAndDefaultProviders");
function Td(e) {
  let t = ho(e, e.options);
  return t.type === "oauth" || t.type === "oidc" ? Pd(t) : t;
}
o(Td, "providerDefaults");
var Rd = /* @__PURE__ */ o((e) => Bs({
  id: e.sub ?? e.id ?? crypto.randomUUID(),
  name: e.name ?? e.nickname ?? e.preferred_username,
  email: e.email ?? void 0,
  image: e.picture ?? void 0
}), "defaultProfile"), Cd = /* @__PURE__ */ o((e) => Bs({
  access_token: e.access_token,
  id_token: e.id_token,
  refresh_token: e.refresh_token,
  expires_at: e.expires_at,
  scope: e.scope,
  token_type: e.token_type,
  session_state: e.session_state
}), "defaultAccount");
function Bs(e) {
  let t = {};
  for (let [r, n] of Object.entries(e))
    n !== void 0 && (t[r] = n);
  return t;
}
o(Bs, "stripUndefined");
function Pd(e) {
  e.issuer && (e.wellKnown ??= `${e.issuer}/.well-known/openid-configuration`);
  let t = e.checks ?? ["pkce"];
  return e.redirectProxyUrl && (t.includes("state") || t.push("state"), e.redirectProxyUrl = `${e.redirectProxyUrl}/callback/${e.id}`), {
    ...e,
    checks: t,
    profile: e.profile ?? Rd,
    account: e.account ?? Cd
  };
}
o(Pd, "normalizeOAuth");
var Ud = "convexauth.mumbojumbo", Od = `https://${Ud}`;
function He(e, t) {
  if (!e && t)
    return;
  if (typeof e == "string")
    return { url: new URL(e) };
  let r = new URL(e?.url ?? Od);
  if (e?.params != null)
    for (let [n, i] of Object.entries(e.params))
      r.searchParams.set(n, String(n === "claims" ? JSON.stringify(i) : i));
  return { url: r, request: e?.request, conform: e?.conform };
}
o(He, "normalizeEndpoint");
function ho(e, ...t) {
  if (!t.length)
    return e;
  let r = t.shift();
  if (po(e) && po(r))
    for (let n in r)
      po(r[n]) ? (e[n] || Object.assign(e, { [n]: {} }), ho(e[n], r[n])) : Object.assign(e, { [n]: r[n] });
  return ho(e, ...t);
}
o(ho, "merge");
function po(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
o(po, "isObject");
function Js(e, t) {
  let r = e.providers.concat(t ? e.extraProviders : []).map((n) => `\`${n.id}\``);
  return r.length > 0 ? r.join(", ") : "no providers have been configured";
}
o(Js, "listAvailableProviders");

// node_modules/@oslojs/binary/dist/uint.js
var yo = class {
  static {
    o(this, "BigEndian");
  }
  uint8(t, r) {
    if (t.byteLength < r + 1)
      throw new TypeError("Insufficient bytes");
    return t[r];
  }
  uint16(t, r) {
    if (t.byteLength < r + 2)
      throw new TypeError("Insufficient bytes");
    return t[r] << 8 | t[r + 1];
  }
  uint32(t, r) {
    if (t.byteLength < r + 4)
      throw new TypeError("Insufficient bytes");
    let n = 0;
    for (let i = 0; i < 4; i++)
      n |= t[r + i] << 24 - i * 8;
    return n;
  }
  uint64(t, r) {
    if (t.byteLength < r + 8)
      throw new TypeError("Insufficient bytes");
    let n = 0n;
    for (let i = 0; i < 8; i++)
      n |= BigInt(t[r + i]) << BigInt(56 - i * 8);
    return n;
  }
  putUint8(t, r, n) {
    if (t.length < n + 1)
      throw new TypeError("Not enough space");
    if (r < 0 || r > 255)
      throw new TypeError("Invalid uint8 value");
    t[n] = r;
  }
  putUint16(t, r, n) {
    if (t.length < n + 2)
      throw new TypeError("Not enough space");
    if (r < 0 || r > 65535)
      throw new TypeError("Invalid uint16 value");
    t[n] = r >> 8, t[n + 1] = r & 255;
  }
  putUint32(t, r, n) {
    if (t.length < n + 4)
      throw new TypeError("Not enough space");
    if (r < 0 || r > 4294967295)
      throw new TypeError("Invalid uint32 value");
    for (let i = 0; i < 4; i++)
      t[n + i] = r >> (3 - i) * 8 & 255;
  }
  putUint64(t, r, n) {
    if (t.length < n + 8)
      throw new TypeError("Not enough space");
    if (r < 0 || r > 18446744073709551615n)
      throw new TypeError("Invalid uint64 value");
    for (let i = 0; i < 8; i++)
      t[n + i] = Number(r >> BigInt((7 - i) * 8) & 0xffn);
  }
}, wo = class {
  static {
    o(this, "LittleEndian");
  }
  uint8(t, r) {
    if (t.byteLength < r + 1)
      throw new TypeError("Insufficient bytes");
    return t[r];
  }
  uint16(t, r) {
    if (t.byteLength < r + 2)
      throw new TypeError("Insufficient bytes");
    return t[r] | t[r + 1] << 8;
  }
  uint32(t, r) {
    if (t.byteLength < r + 4)
      throw new TypeError("Insufficient bytes");
    let n = 0;
    for (let i = 0; i < 4; i++)
      n |= t[r + i] << i * 8;
    return n;
  }
  uint64(t, r) {
    if (t.byteLength < r + 8)
      throw new TypeError("Insufficient bytes");
    let n = 0n;
    for (let i = 0; i < 8; i++)
      n |= BigInt(t[r + i]) << BigInt(i * 8);
    return n;
  }
  putUint8(t, r, n) {
    if (t.length < 1 + n)
      throw new TypeError("Insufficient space");
    if (r < 0 || r > 255)
      throw new TypeError("Invalid uint8 value");
    t[n] = r;
  }
  putUint16(t, r, n) {
    if (t.length < 2 + n)
      throw new TypeError("Insufficient space");
    if (r < 0 || r > 65535)
      throw new TypeError("Invalid uint16 value");
    t[n + 1] = r >> 8, t[n] = r & 255;
  }
  putUint32(t, r, n) {
    if (t.length < 4 + n)
      throw new TypeError("Insufficient space");
    if (r < 0 || r > 4294967295)
      throw new TypeError("Invalid uint32 value");
    for (let i = 0; i < 4; i++)
      t[n + i] = r >> i * 8 & 255;
  }
  putUint64(t, r, n) {
    if (t.length < 8 + n)
      throw new TypeError("Insufficient space");
    if (r < 0 || r > 18446744073709551615n)
      throw new TypeError("Invalid uint64 value");
    for (let i = 0; i < 8; i++)
      t[n + i] = Number(r >> BigInt(i * 8) & 0xffn);
  }
}, Ye = new yo(), Ld = new wo();

// node_modules/@oslojs/binary/dist/bits.js
function ee(e, t) {
  return (e << 32 - t | e >>> t) >>> 0;
}
o(ee, "rotr32");

// node_modules/@oslojs/binary/dist/big.js
function $r(e) {
  if (e.byteLength < 1)
    throw new TypeError("Empty Uint8Array");
  let t = 0n;
  for (let r = 0; r < e.byteLength; r++)
    t += BigInt(e[r]) << BigInt((e.byteLength - 1 - r) * 8);
  return t;
}
o($r, "bigIntFromBytes");

// node_modules/@oslojs/crypto/dist/sha2/sha224.js
var J_ = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);

// node_modules/@oslojs/crypto/dist/sha2/sha256.js
function go(e) {
  let t = new Br();
  return t.update(e), t.digest();
}
o(go, "sha256");
var Br = class {
  static {
    o(this, "SHA256");
  }
  blockSize = 64;
  size = 32;
  blocks = new Uint8Array(64);
  currentBlockSize = 0;
  H = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  l = 0n;
  w = new Uint32Array(64);
  update(t) {
    if (this.l += BigInt(t.byteLength) * 8n, this.currentBlockSize + t.byteLength < 64) {
      this.blocks.set(t, this.currentBlockSize), this.currentBlockSize += t.byteLength;
      return;
    }
    let r = 0;
    if (this.currentBlockSize > 0) {
      let n = t.slice(0, 64 - this.currentBlockSize);
      this.blocks.set(n, this.currentBlockSize), this.process(), r += n.byteLength, this.currentBlockSize = 0;
    }
    for (; r + 64 <= t.byteLength; ) {
      let n = t.slice(r, r + 64);
      this.blocks.set(n), this.process(), r += 64;
    }
    if (t.byteLength - r > 0) {
      let n = t.slice(r);
      this.blocks.set(n), this.currentBlockSize = n.byteLength;
    }
  }
  digest() {
    this.blocks[this.currentBlockSize] = 128, this.currentBlockSize += 1, 64 - this.currentBlockSize < 8 && (this.blocks.fill(0, this.currentBlockSize), this.process(), this.currentBlockSize = 0), this.blocks.fill(0, this.currentBlockSize), Ye.putUint64(this.blocks, this.l, this.blockSize - 8), this.process();
    let t = new Uint8Array(32);
    for (let r = 0; r < 8; r++)
      Ye.putUint32(t, this.H[r], r * 4);
    return t;
  }
  process() {
    for (let u = 0; u < 16; u++)
      this.w[u] = (this.blocks[u * 4] << 24 | this.blocks[u * 4 + 1] << 16 | this.blocks[u * 4 + 2] << 8 | this.blocks[u * 4 + 3]) >>> 0;
    for (let u = 16; u < 64; u++) {
      let f = (ee(this.w[u - 2], 17) ^ ee(this.w[u - 2], 19) ^ this.w[u - 2] >>> 10) >>> 0, l = (ee(this.w[u - 15], 7) ^ ee(this.w[u - 15], 18) ^ this.w[u - 15] >>> 3) >>> 0;
      this.w[u] = f + this.w[u - 7] + l + this.w[u - 16] | 0;
    }
    let t = this.H[0], r = this.H[1], n = this.H[2], i = this.H[3], s = this.H[4], a = this.H[5], c = this.H[6], d = this.H[7];
    for (let u = 0; u < 64; u++) {
      let f = (ee(s, 6) ^ ee(s, 11) ^ ee(s, 25)) >>> 0, l = (s & a ^ ~s & c) >>> 0, y = d + f + l + Dd[u] + this.w[u] | 0, p = (ee(t, 2) ^ ee(t, 13) ^ ee(t, 22)) >>> 0, m = (t & r ^ t & n ^ r & n) >>> 0, S = p + m | 0;
      d = c, c = a, a = s, s = i + y | 0, i = n, n = r, r = t, t = y + S | 0;
    }
    this.H[0] = t + this.H[0] | 0, this.H[1] = r + this.H[1] | 0, this.H[2] = n + this.H[2] | 0, this.H[3] = i + this.H[3] | 0, this.H[4] = s + this.H[4] | 0, this.H[5] = a + this.H[5] | 0, this.H[6] = c + this.H[6] | 0, this.H[7] = d + this.H[7] | 0;
  }
}, Dd = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);

// node_modules/@oslojs/crypto/dist/sha2/sha512.js
var Z_ = new BigUint64Array([
  0x428a2f98d728ae22n,
  0x7137449123ef65cdn,
  0xb5c0fbcfec4d3b2fn,
  0xe9b5dba58189dbbcn,
  0x3956c25bf348b538n,
  0x59f111f1b605d019n,
  0x923f82a4af194f9bn,
  0xab1c5ed5da6d8118n,
  0xd807aa98a3030242n,
  0x12835b0145706fben,
  0x243185be4ee4b28cn,
  0x550c7dc3d5ffb4e2n,
  0x72be5d74f27b896fn,
  0x80deb1fe3b1696b1n,
  0x9bdc06a725c71235n,
  0xc19bf174cf692694n,
  0xe49b69c19ef14ad2n,
  0xefbe4786384f25e3n,
  0x0fc19dc68b8cd5b5n,
  0x240ca1cc77ac9c65n,
  0x2de92c6f592b0275n,
  0x4a7484aa6ea6e483n,
  0x5cb0a9dcbd41fbd4n,
  0x76f988da831153b5n,
  0x983e5152ee66dfabn,
  0xa831c66d2db43210n,
  0xb00327c898fb213fn,
  0xbf597fc7beef0ee4n,
  0xc6e00bf33da88fc2n,
  0xd5a79147930aa725n,
  0x06ca6351e003826fn,
  0x142929670a0e6e70n,
  0x27b70a8546d22ffcn,
  0x2e1b21385c26c926n,
  0x4d2c6dfc5ac42aedn,
  0x53380d139d95b3dfn,
  0x650a73548baf63den,
  0x766a0abb3c77b2a8n,
  0x81c2c92e47edaee6n,
  0x92722c851482353bn,
  0xa2bfe8a14cf10364n,
  0xa81a664bbc423001n,
  0xc24b8b70d0f89791n,
  0xc76c51a30654be30n,
  0xd192e819d6ef5218n,
  0xd69906245565a910n,
  0xf40e35855771202an,
  0x106aa07032bbd1b8n,
  0x19a4c116b8d2d0c8n,
  0x1e376c085141ab53n,
  0x2748774cdf8eeb99n,
  0x34b0bcb5e19b48a8n,
  0x391c0cb3c5c95a63n,
  0x4ed8aa4ae3418acbn,
  0x5b9cca4f7763e373n,
  0x682e6ff3d6b2b8a3n,
  0x748f82ee5defb2fcn,
  0x78a5636f43172f60n,
  0x84c87814a1f0ab72n,
  0x8cc702081a6439ecn,
  0x90befffa23631e28n,
  0xa4506cebde82bde9n,
  0xbef9a3f7b2c67915n,
  0xc67178f2e372532bn,
  0xca273eceea26619cn,
  0xd186b8c721c0c207n,
  0xeada7dd6cde0eb1en,
  0xf57d4f7fee6ed178n,
  0x06f067aa72176fban,
  0x0a637dc5a2c898a6n,
  0x113f9804bef90daen,
  0x1b710b35131c471bn,
  0x28db77f523047d84n,
  0x32caab7b40c72493n,
  0x3c9ebe0a15c9bebcn,
  0x431d67c49c100d4cn,
  0x4cc5d4becb3e42b6n,
  0x597f299cfc657e2an,
  0x5fcb6fab3ad6faecn,
  0x6c44198c4a475817n
]);

// node_modules/@oslojs/encoding/dist/hex.js
function bo(e) {
  let t = "";
  for (let r = 0; r < e.length; r++)
    t += zs[e[r] >> 4], t += zs[e[r] & 15];
  return t;
}
o(bo, "encodeHexLowerCase");
function Kd(e) {
  if (e.length % 2 !== 0)
    throw new Error("Invalid hex string");
  let t = new Uint8Array(e.length / 2);
  for (let r = 0; r < e.length; r += 2) {
    if (!(e[r] in Jr))
      throw new Error("Invalid character");
    if (!(e[r + 1] in Jr))
      throw new Error("Invalid character");
    t[r / 2] |= Jr[e[r]] << 4, t[r / 2] |= Jr[e[r + 1]];
  }
  return t;
}
o(Kd, "decodeHex");
var zs = "0123456789abcdef", Jr = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  A: 10,
  b: 11,
  B: 11,
  c: 12,
  C: 12,
  d: 13,
  D: 13,
  e: 14,
  E: 14,
  f: 15,
  F: 15
};

// node_modules/@oslojs/encoding/dist/base32.js
var js;
(function(e) {
  e[e.Include = 0] = "Include", e[e.None = 1] = "None";
})(js || (js = {}));
var Vs;
(function(e) {
  e[e.Required = 0] = "Required", e[e.Ignore = 1] = "Ignore";
})(Vs || (Vs = {}));

// node_modules/@oslojs/encoding/dist/base64.js
var Fs;
(function(e) {
  e[e.Include = 0] = "Include", e[e.None = 1] = "None";
})(Fs || (Fs = {}));
var Gs;
(function(e) {
  e[e.Required = 0] = "Required", e[e.Ignore = 1] = "Ignore";
})(Gs || (Gs = {}));

// node_modules/@oslojs/crypto/dist/random/index.js
function Nd(e, t) {
  if (t < 2)
    throw new Error("Argument 'max' must be a positive integer larger than 1");
  let r = (t - 1n).toString(2).length, n = r % 8, i = new Uint8Array(Math.ceil(r / 8));
  try {
    e.read(i);
  } catch (a) {
    throw new Error("Failed to retrieve random bytes", {
      cause: a
    });
  }
  n !== 0 && (i[0] &= (1 << n) - 1);
  let s = $r(i);
  for (; s >= t; ) {
    try {
      e.read(i);
    } catch (a) {
      throw new Error("Failed to retrieve random bytes", {
        cause: a
      });
    }
    n !== 0 && (i[0] &= (1 << n) - 1), s = $r(i);
  }
  return s;
}
o(Nd, "generateRandomInteger");
function Wd(e, t) {
  if (t < 2 || t > Number.MAX_SAFE_INTEGER)
    throw new Error("Argument 'max' must be a positive integer larger than 1");
  return Number(Nd(e, BigInt(t)));
}
o(Wd, "generateRandomIntegerNumber");
function qs(e, t, r) {
  let n = "";
  for (let i = 0; i < r; i++)
    n += t[Wd(e, t.length)];
  return n;
}
o(qs, "generateRandomString");

// node_modules/@convex-dev/auth/dist/server/implementation/utils.js
var Se = "|", xo = "|";
function Mr(e) {
  return e !== void 0 ? Number(e) : void 0;
}
o(Mr, "stringToNumber");
async function et(e) {
  return bo(go(new TextEncoder().encode(e)));
}
o(et, "sha256");
function zr(e, t) {
  return qs({
    read(n) {
      crypto.getRandomValues(n);
    }
  }, t, e);
}
o(zr, "generateRandomString");
function So(e) {
  g(v.ERROR, e instanceof Error ? e.message + `
` + e.stack?.replace("\\n", `
`) : e);
}
o(So, "logError");
var v = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG"
};
function g(e, ...t) {
  let r = v[process.env.AUTH_LOG_LEVEL ?? "INFO"] ?? "INFO";
  switch (e) {
    case "ERROR":
      console.error(...t);
      break;
    case "WARN":
      r !== "ERROR" && console.warn(...t);
      break;
    case "INFO":
      (r === "INFO" || r === "DEBUG") && console.info(...t);
      break;
    case "DEBUG":
      r === "DEBUG" && console.debug(...t);
      break;
  }
}
o(g, "logWithLevel");
var _o = 5;
function L(e) {
  return e === "" ? "" : process.env.AUTH_LOG_SECRETS !== "true" ? e.length < _o * 2 ? "<redacted>" : e.substring(0, _o) + "<redacted>" + e.substring(e.length - _o) : e;
}
o(L, "maybeRedact");

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/index.js
te();

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/signIn.js
te();

// node_modules/@convex-dev/auth/dist/server/implementation/tokens.js
var $d = 1e3 * 60 * 60;
async function Xs(e, t) {
  let r = await kn(F("JWT_PRIVATE_KEY"), "RS256"), n = new Date(Date.now() + (t.jwt?.durationMs ?? $d));
  return await new yt({
    sub: e.userId + Se + e.sessionId
  }).setProtectedHeader({ alg: "RS256" }).setIssuedAt().setIssuer(F("CONVEX_SITE_URL")).setAudience("convex").setExpirationTime(n).sign(r);
}
o(Xs, "generateToken");

// node_modules/@convex-dev/auth/dist/server/implementation/refreshTokens.js
var Bd = 1e3 * 60 * 60 * 24 * 30, jr = 10 * 1e3;
async function Zs(e, t, r, n) {
  let i = Date.now() + (t.session?.inactiveDurationMs ?? Mr(process.env.AUTH_SESSION_INACTIVE_DURATION_MS) ?? Bd);
  return await e.db.insert("authRefreshTokens", {
    sessionId: r,
    expirationTime: i,
    parentRefreshTokenId: n ?? void 0
  });
}
o(Zs, "createRefreshToken");
var Qs = /* @__PURE__ */ o((e, t) => `${e}${xo}${t}`, "formatRefreshToken"), Vr = /* @__PURE__ */ o((e) => {
  let [t, r] = e.split(xo);
  if (!t || !r)
    throw new Error(`Can't parse refresh token: ${L(e)}`);
  return {
    refreshTokenId: t,
    sessionId: r
  };
}, "parseRefreshToken");
async function Ys(e, t) {
  let r = [t], n = [t._id];
  for (; n.length > 0; ) {
    let i = [];
    for (let s of n) {
      let a = await e.db.query("authRefreshTokens").withIndex("sessionIdAndParentRefreshTokenId", (c) => c.eq("sessionId", t.sessionId).eq("parentRefreshTokenId", s)).collect();
      r.push(...a), i.push(...a.map((c) => c._id));
    }
    n = i;
  }
  for (let i of r)
    (i.firstUsedTime === void 0 || i.firstUsedTime > Date.now() - jr) && await e.db.patch(i._id, {
      firstUsedTime: Date.now() - jr
    });
  return r;
}
o(Ys, "invalidateRefreshTokensInSubtree");
async function Fr(e, t) {
  let r = await e.db.query("authRefreshTokens").withIndex("sessionIdAndParentRefreshTokenId", (n) => n.eq("sessionId", t)).collect();
  for (let n of r)
    await e.db.delete(n._id);
}
o(Fr, "deleteAllRefreshTokens");
async function ea(e, t, r) {
  let n = await e.db.get(t);
  if (n === null)
    return g(v.ERROR, "Invalid refresh token"), null;
  if (n.expirationTime < Date.now())
    return g(v.ERROR, "Expired refresh token"), null;
  if (n.sessionId !== r)
    return g(v.ERROR, "Invalid refresh token session ID"), null;
  let i = await e.db.get(n.sessionId);
  return i === null ? (g(v.ERROR, "Invalid refresh token session"), null) : i.expirationTime < Date.now() ? (g(v.ERROR, "Expired refresh token session"), null) : { session: i, refreshTokenDoc: n };
}
o(ea, "refreshTokenIfValid");
async function ta(e, t) {
  return e.db.query("authRefreshTokens").withIndex("sessionId", (r) => r.eq("sessionId", t)).filter((r) => r.eq(r.field("firstUsedTime"), void 0)).order("desc").first();
}
o(ta, "loadActiveRefreshToken");

// node_modules/@convex-dev/auth/dist/server/implementation/sessions.js
var Jd = 1e3 * 60 * 60 * 24 * 30;
async function Gr(e, t, r, n, i) {
  return {
    userId: r,
    sessionId: n,
    tokens: i ? await Tt(e, t, {
      userId: r,
      sessionId: n,
      issuedRefreshTokenId: null,
      parentRefreshTokenId: null
    }) : null
  };
}
o(Gr, "maybeGenerateTokensForSession");
async function qr(e, t, r) {
  let n = await re(e);
  if (n !== null) {
    let i = await e.db.get(n);
    i !== null && await Rt(e, i);
  }
  return await Md(e, r, t);
}
o(qr, "createNewAndDeleteExistingSession");
async function Tt(e, t, r) {
  let n = { userId: r.userId, sessionId: r.sessionId }, i = r.issuedRefreshTokenId ?? await Zs(e, t, r.sessionId, r.parentRefreshTokenId), s = {
    token: await Xs(n, t),
    refreshToken: Qs(i, r.sessionId)
  };
  return g(v.DEBUG, `Generated token ${L(s.token)} and refresh token ${L(i)} for session ${L(r.sessionId)}`), s;
}
o(Tt, "generateTokensForSession");
async function Md(e, t, r) {
  let n = Date.now() + (r.session?.totalDurationMs ?? Mr(process.env.AUTH_SESSION_TOTAL_DURATION_MS) ?? Jd);
  return await e.db.insert("authSessions", { expirationTime: n, userId: t });
}
o(Md, "createSession");
async function Rt(e, t) {
  await e.db.delete(t._id), await Fr(e, t._id);
}
o(Rt, "deleteSession");
async function re(e) {
  let t = await e.auth.getUserIdentity();
  if (t === null)
    return null;
  let [, r] = t.subject.split(Se);
  return r;
}
o(re, "getAuthSessionId");

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/signIn.js
var ra = h.object({
  userId: h.id("users"),
  sessionId: h.optional(h.id("authSessions")),
  generateTokens: h.boolean()
});
async function na(e, t, r) {
  g(v.DEBUG, "signInImpl args:", t);
  let { userId: n, sessionId: i, generateTokens: s } = t, a = i ?? await qr(e, r, n);
  return await Gr(e, r, n, a, s);
}
o(na, "signInImpl");
var vo = /* @__PURE__ */ o(async (e, t) => e.runMutation("auth:store", {
  args: {
    type: "signIn",
    ...t
  }
}), "callSignIn");

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/signOut.js
async function oa(e) {
  let t = await re(e);
  if (t !== null) {
    let r = await e.db.get(t);
    if (r !== null)
      return await Rt(e, r), { userId: r.userId, sessionId: r._id };
  }
  return null;
}
o(oa, "signOutImpl");
var Ao = /* @__PURE__ */ o(async (e) => e.runMutation("auth:store", {
  args: {
    type: "signOut"
  }
}), "callSignOut");

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/refreshSession.js
te();
var ia = h.object({
  refreshToken: h.string()
});
async function sa(e, t, r, n) {
  let { refreshToken: i } = t, { refreshTokenId: s, sessionId: a } = Vr(i);
  g("DEBUG", `refreshSessionImpl args: Token ID: ${L(s)} Session ID: ${L(a)}`);
  let c = await ea(e, s, a);
  if (c === null) {
    let p = await e.db.get(a);
    return p !== null && await e.db.delete(p._id), await Fr(e, a), null;
  }
  let { session: d } = c, u = d._id, f = d.userId, l = c.refreshTokenDoc.firstUsedTime;
  if (l === void 0) {
    await e.db.patch(s, {
      firstUsedTime: Date.now()
    });
    let p = await Tt(e, n, {
      userId: f,
      sessionId: u,
      issuedRefreshTokenId: null,
      parentRefreshTokenId: s
    }), { refreshTokenId: m } = Vr(p.refreshToken);
    return g("DEBUG", `Exchanged ${L(c.refreshTokenDoc._id)} (first use) for new refresh token ${L(m)}`), p;
  }
  let y = await ta(e, a);
  if (g("DEBUG", `Active refresh token: ${L(y?._id ?? "(none)")}, parent ${L(y?.parentRefreshTokenId ?? "(none)")}`), y !== null && y.parentRefreshTokenId === s)
    return g("DEBUG", `Token ${L(c.refreshTokenDoc._id)} is parent of active refresh token ${L(y._id)}, so returning that token`), await Tt(e, n, {
      userId: f,
      sessionId: u,
      issuedRefreshTokenId: y._id,
      parentRefreshTokenId: s
    });
  if (l + jr > Date.now()) {
    let p = await Tt(e, n, {
      userId: f,
      sessionId: u,
      issuedRefreshTokenId: null,
      parentRefreshTokenId: s
    }), { refreshTokenId: m } = Vr(p.refreshToken);
    return g("DEBUG", `Exchanged ${L(c.refreshTokenDoc._id)} (reuse) for new refresh token ${L(m)}`), p;
  } else {
    g("ERROR", "Refresh token used outside of reuse window"), g("DEBUG", `Token ${L(c.refreshTokenDoc._id)} being used outside of reuse window, so invalidating all refresh tokens in subtree`);
    let p = await Ys(e, c.refreshTokenDoc);
    return g("DEBUG", `Invalidated ${p.length} refresh tokens in subtree: ${p.map((m) => L(m._id)).join(", ")}`), null;
  }
}
o(sa, "refreshSessionImpl");
var Eo = /* @__PURE__ */ o(async (e, t) => e.runMutation("auth:store", {
  args: {
    type: "refreshSession",
    ...t
  }
}), "callRefreshSession");

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/verifyCodeAndSignIn.js
te();

// node_modules/@convex-dev/auth/dist/server/implementation/rateLimit.js
async function Xr(e, t, r) {
  let n = await aa(e, t, r);
  return n === null ? !1 : n.attempsLeft < 1;
}
o(Xr, "isSignInRateLimited");
async function Zr(e, t, r) {
  let n = await aa(e, t, r);
  if (n !== null)
    await e.db.patch(n.limit._id, {
      attemptsLeft: n.attempsLeft - 1,
      lastAttemptTime: Date.now()
    });
  else {
    let i = ca(r);
    await e.db.insert("authRateLimits", {
      identifier: t,
      attemptsLeft: i - 1,
      lastAttemptTime: Date.now()
    });
  }
}
o(Zr, "recordFailedSignIn");
async function Qr(e, t) {
  let r = await e.db.query("authRateLimits").withIndex("identifier", (n) => n.eq("identifier", t)).unique();
  r !== null && await e.db.delete(r._id);
}
o(Qr, "resetSignInRateLimit");
async function aa(e, t, r) {
  let n = Date.now(), i = ca(r), s = await e.db.query("authRateLimits").withIndex("identifier", (u) => u.eq("identifier", t)).unique();
  if (s === null)
    return null;
  let a = n - s.lastAttemptTime, c = i / (3600 * 1e3), d = Math.min(i, s.attemptsLeft + a * c);
  return { limit: s, attempsLeft: d };
}
o(aa, "getRateLimitState");
function ca(e) {
  return e.signIn?.maxFailedAttempsPerHour ?? 10;
}
o(ca, "configuredMaxAttempsPerHour");

// node_modules/@convex-dev/auth/dist/server/implementation/users.js
async function ve(e, t, r, n, i) {
  let s = await zd(e, t, "existingAccount" in r ? r.existingAccount : null, n, i), a = await Fd(e, s, r, n);
  return { userId: s, accountId: a };
}
o(ve, "upsertUserAndAccount");
async function zd(e, t, r, n, i) {
  g(v.DEBUG, "defaultCreateOrUpdateUser args:", {
    existingAccountId: r?._id,
    existingSessionId: t,
    args: n
  });
  let s = r?.userId ?? null;
  if (i.callbacks?.createOrUpdateUser !== void 0)
    return g(v.DEBUG, "Using custom createOrUpdateUser callback"), await i.callbacks.createOrUpdateUser(e, {
      existingUserId: s,
      ...n
    });
  let { provider: a, profile: { emailVerified: c, phoneVerified: d, ...u } } = n, f = c ?? ((a.type === "oauth" || a.type === "oidc") && a.allowDangerousEmailAccountLinking !== !1), l = d ?? !1, y = n.shouldLinkViaEmail || f || a.type === "email", p = n.shouldLinkViaPhone || l || a.type === "phone", m = s;
  if (s === null) {
    let b = typeof u.email == "string" && y ? (await jd(e, u.email))?._id ?? null : null, k = typeof u.phone == "string" && p ? (await Vd(e, u.phone))?._id ?? null : null;
    b !== null && k !== null ? (g(v.DEBUG, `Found existing email and phone verified users, so not linking: email: ${b}, phone: ${k}`), m = null) : b !== null ? (g(v.DEBUG, `Found existing email verified user, linking: ${b}`), m = b) : k !== null ? (g(v.DEBUG, `Found existing phone verified user, linking: ${k}`), m = k) : (g(v.DEBUG, "No existing verified users found, creating new user"), m = null);
  }
  let S = {
    ...f ? { emailVerificationTime: Date.now() } : null,
    ...l ? { phoneVerificationTime: Date.now() } : null,
    ...u
  }, I = m;
  if (m !== null)
    try {
      await e.db.patch(m, S);
    } catch (b) {
      throw new Error(`Could not update user document with ID \`${m}\`, either the user has been deleted but their account has not, or the profile data doesn't match the \`users\` table schema: ${b.message}`);
    }
  else
    m = await e.db.insert("users", S);
  let A = i.callbacks?.afterUserCreatedOrUpdated;
  return A !== void 0 ? (g(v.DEBUG, "Calling custom afterUserCreatedOrUpdated callback"), await A(e, {
    userId: m,
    existingUserId: I,
    ...n
  })) : g(v.DEBUG, "No custom afterUserCreatedOrUpdated callback, skipping"), m;
}
o(zd, "defaultCreateOrUpdateUser");
async function jd(e, t) {
  let r = await e.db.query("users").withIndex("email", (n) => n.eq("email", t)).filter((n) => n.neq(n.field("emailVerificationTime"), void 0)).take(2);
  return r.length === 1 ? r[0] : null;
}
o(jd, "uniqueUserWithVerifiedEmail");
async function Vd(e, t) {
  let r = await e.db.query("users").withIndex("phone", (n) => n.eq("phone", t)).filter((n) => n.neq(n.field("phoneVerificationTime"), void 0)).take(2);
  return r.length === 1 ? r[0] : null;
}
o(Vd, "uniqueUserWithVerifiedPhone");
async function Fd(e, t, r, n) {
  let i = "existingAccount" in r ? r.existingAccount._id : await e.db.insert("authAccounts", {
    userId: t,
    provider: n.provider.id,
    providerAccountId: r.providerAccountId,
    secret: r.secret
  });
  return "existingAccount" in r && r.existingAccount.userId !== t && await e.db.patch(i, { userId: t }), n.profile.emailVerified && await e.db.patch(i, { emailVerified: n.profile.email }), n.profile.phoneVerified && await e.db.patch(i, { phoneVerified: n.profile.phone }), i;
}
o(Fd, "createOrUpdateAccount");
async function ua(e, t) {
  let r = await e.db.get(t);
  if (r === null)
    throw new Error(`Expected an account to exist for ID "${t}"`);
  return r;
}
o(ua, "getAccountOrThrow");

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/verifyCodeAndSignIn.js
var da = h.object({
  params: h.any(),
  provider: h.optional(h.string()),
  verifier: h.optional(h.string()),
  generateTokens: h.boolean(),
  allowExtraProviders: h.boolean()
});
async function la(e, t, r, n) {
  g(v.DEBUG, "verifyCodeAndSignInImpl args:", {
    params: { email: t.params.email, phone: t.params.phone },
    provider: t.provider,
    verifier: t.verifier,
    generateTokens: t.generateTokens,
    allowExtraProviders: t.allowExtraProviders
  });
  let { generateTokens: i, provider: s, allowExtraProviders: a } = t, c = t.params.email ?? t.params.phone;
  if (c !== void 0 && await Xr(e, c, n))
    return g(v.ERROR, "Too many failed attempts to verify code for this email"), null;
  let d = await Gd(e, t, s ?? null, r, a, n, await re(e));
  if (d === null)
    return c !== void 0 && await Zr(e, c, n), null;
  c !== void 0 && await Qr(e, c);
  let { userId: u } = d, f = await qr(e, n, u);
  return await Gr(e, n, u, f, i);
}
o(la, "verifyCodeAndSignInImpl");
var Ct = /* @__PURE__ */ o(async (e, t) => e.runMutation("auth:store", {
  args: {
    type: "verifyCodeAndSignIn",
    ...t
  }
}), "callVerifyCodeAndSignIn");
async function Gd(e, t, r, n, i, s, a) {
  let { params: c, verifier: d } = t, u = await et(c.code), f = await e.db.query("authVerificationCodes").withIndex("code", (b) => b.eq("code", u)).unique();
  if (f === null)
    return g(v.ERROR, "Invalid verification code"), null;
  if (await e.db.delete(f._id), f.verifier !== d)
    return g(v.ERROR, "Invalid verifier"), null;
  if (f.expirationTime < Date.now())
    return g(v.ERROR, "Expired verification code"), null;
  let { accountId: l, emailVerified: y, phoneVerified: p } = f, m = await e.db.get(l);
  if (m === null)
    return g(v.ERROR, "Account associated with this email has been deleted"), null;
  if (r !== null && f.provider !== r)
    return g(v.ERROR, `Invalid provider "${r}" for given \`code\`, which was generated by provider "${f.provider}"`), null;
  let S = n(f.provider, i);
  S !== null && (S.type === "email" || S.type === "phone") && S.authorize !== void 0 && await S.authorize(t.params, m);
  let I = m.userId, A = n(m.provider);
  return A.type === "oauth" || A.type === "oidc" || ({ userId: I } = await ve(e, a, { existingAccount: m }, {
    type: "verification",
    provider: A,
    profile: {
      ...y !== void 0 ? { email: y, emailVerified: !0 } : {},
      ...p !== void 0 ? { phone: p, phoneVerified: !0 } : {}
    }
  }, s)), { providerAccountId: m.providerAccountId, userId: I };
}
o(Gd, "verifyCodeOnly");

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/verifierSignature.js
te();
var fa = h.object({
  verifier: h.string(),
  signature: h.string()
});
async function pa(e, t) {
  let { verifier: r, signature: n } = t, i = await e.db.get(r);
  if (i === null)
    throw new Error("Invalid verifier");
  return await e.db.patch(i._id, { signature: n });
}
o(pa, "verifierSignatureImpl");
var ko = /* @__PURE__ */ o(async (e, t) => e.runMutation("auth:store", {
  args: {
    type: "verifierSignature",
    ...t
  }
}), "callVerifierSignature");

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/userOAuth.js
te();
var qd = 1e3 * 60 * 2, ha = h.object({
  provider: h.string(),
  providerAccountId: h.string(),
  profile: h.any(),
  signature: h.string()
});
async function ma(e, t, r, n) {
  g("DEBUG", "userOAuthImpl args:", t);
  let { profile: i, provider: s, providerAccountId: a, signature: c } = t, d = r(s), u = await e.db.query("authAccounts").withIndex("providerAndAccountId", (m) => m.eq("provider", s).eq("providerAccountId", a)).unique(), f = await e.db.query("authVerifiers").withIndex("signature", (m) => m.eq("signature", c)).unique();
  if (f === null)
    throw new Error("Invalid state");
  let { accountId: l } = await ve(e, f.sessionId ?? null, u !== null ? { existingAccount: u } : { providerAccountId: a }, { type: "oauth", provider: d, profile: i }, n), y = zr(8, "0123456789");
  await e.db.delete(f._id);
  let p = await e.db.query("authVerificationCodes").withIndex("accountId", (m) => m.eq("accountId", l)).unique();
  return p !== null && await e.db.delete(p._id), await e.db.insert("authVerificationCodes", {
    code: await et(y),
    accountId: l,
    provider: s,
    expirationTime: Date.now() + qd,
    // The use of a verifier means we don't need an identifier
    // during verification.
    verifier: f._id
  }), y;
}
o(ma, "userOAuthImpl");
var Io = /* @__PURE__ */ o(async (e, t) => e.runMutation("auth:store", {
  args: {
    type: "userOAuth",
    ...t
  }
}), "callUserOAuth");

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/createVerificationCode.js
te();
var ya = h.object({
  accountId: h.optional(h.id("authAccounts")),
  provider: h.string(),
  email: h.optional(h.string()),
  phone: h.optional(h.string()),
  code: h.string(),
  expirationTime: h.number(),
  allowExtraProviders: h.boolean()
});
async function wa(e, t, r, n) {
  g(v.DEBUG, "createVerificationCodeImpl args:", t);
  let { email: i, phone: s, code: a, expirationTime: c, provider: d, accountId: u, allowExtraProviders: f } = t, l = u !== void 0 ? await ua(e, u) : await e.db.query("authAccounts").withIndex("providerAndAccountId", (m) => m.eq("provider", d).eq("providerAccountId", i ?? s)).unique(), y = r(d, f), { accountId: p } = await ve(e, await re(e), l !== null ? { existingAccount: l } : { providerAccountId: i ?? s }, y.type === "email" ? { type: "email", provider: y, profile: { email: i } } : { type: "phone", provider: y, profile: { phone: s } }, n);
  return await Xd(e, p, d, a, c, { email: i, phone: s }), i ?? s;
}
o(wa, "createVerificationCodeImpl");
var To = /* @__PURE__ */ o(async (e, t) => e.runMutation("auth:store", {
  args: {
    type: "createVerificationCode",
    ...t
  }
}), "callCreateVerificationCode");
async function Xd(e, t, r, n, i, { email: s, phone: a }) {
  let c = await e.db.query("authVerificationCodes").withIndex("accountId", (d) => d.eq("accountId", t)).unique();
  c !== null && await e.db.delete(c._id), await e.db.insert("authVerificationCodes", {
    accountId: t,
    provider: r,
    code: await et(n),
    expirationTime: i,
    emailVerified: s,
    phoneVerified: a
  });
}
o(Xd, "generateUniqueVerificationCode");

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/createAccountFromCredentials.js
te();

// node_modules/@convex-dev/auth/dist/server/implementation/provider.js
async function Yr(e, t) {
  if (e.type !== "credentials")
    throw new Error(`Provider ${e.id} is not a credentials provider`);
  let r = e.crypto?.hashSecret;
  if (r === void 0)
    throw new Error(`Provider ${e.id} does not have a \`crypto.hashSecret\` function`);
  return await r(t);
}
o(Yr, "hash");
async function en(e, t, r) {
  if (e.type !== "credentials")
    throw new Error(`Provider ${e.id} is not a credentials provider`);
  let n = e.crypto?.verifySecret;
  if (n === void 0)
    throw new Error(`Provider ${e.id} does not have a \`crypto.verifySecret\` function`);
  return await n(t, r);
}
o(en, "verify");

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/createAccountFromCredentials.js
var ba = h.object({
  provider: h.string(),
  account: h.object({ id: h.string(), secret: h.optional(h.string()) }),
  profile: h.any(),
  shouldLinkViaEmail: h.optional(h.boolean()),
  shouldLinkViaPhone: h.optional(h.boolean())
});
async function _a(e, t, r, n) {
  g(v.DEBUG, "createAccountFromCredentialsImpl args:", {
    provider: t.provider,
    account: {
      id: t.account.id,
      secret: L(t.account.secret ?? "")
    }
  });
  let { provider: i, account: s, profile: a, shouldLinkViaEmail: c, shouldLinkViaPhone: d } = t, u = r(i), f = await e.db.query("authAccounts").withIndex("providerAndAccountId", (m) => m.eq("provider", u.id).eq("providerAccountId", s.id)).unique();
  if (f !== null) {
    if (s.secret !== void 0 && !await en(u, s.secret, f.secret ?? ""))
      throw new Error(`Account ${s.id} already exists`);
    return {
      account: f,
      // TODO: Ian removed this,
      user: await e.db.get(f.userId)
    };
  }
  let l = s.secret !== void 0 ? await Yr(u, s.secret) : void 0, { userId: y, accountId: p } = await ve(e, await re(e), { providerAccountId: s.id, secret: l }, {
    type: "credentials",
    provider: u,
    profile: a,
    shouldLinkViaEmail: c,
    shouldLinkViaPhone: d
  }, n);
  return {
    account: await e.db.get(p),
    user: await e.db.get(y)
  };
}
o(_a, "createAccountFromCredentialsImpl");
var Ro = /* @__PURE__ */ o(async (e, t) => e.runMutation("auth:store", {
  args: {
    type: "createAccountFromCredentials",
    ...t
  }
}), "callCreateAccountFromCredentials");

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/retrieveAccountWithCredentials.js
te();
var xa = h.object({
  provider: h.string(),
  account: h.object({ id: h.string(), secret: h.optional(h.string()) })
});
async function Sa(e, t, r, n) {
  let { provider: i, account: s } = t;
  g(v.DEBUG, "retrieveAccountWithCredentialsImpl args:", {
    provider: i,
    account: {
      id: s.id,
      secret: L(s.secret ?? "")
    }
  });
  let a = await e.db.query("authAccounts").withIndex("providerAndAccountId", (c) => c.eq("provider", i).eq("providerAccountId", s.id)).unique();
  if (a === null)
    return "InvalidAccountId";
  if (s.secret !== void 0) {
    if (await Xr(e, a._id, n))
      return "TooManyFailedAttempts";
    if (!await en(r(i), s.secret, a.secret ?? ""))
      return await Zr(e, a._id, n), "InvalidSecret";
    await Qr(e, a._id);
  }
  return {
    account: a,
    // TODO: Ian removed this
    user: await e.db.get(a.userId)
  };
}
o(Sa, "retrieveAccountWithCredentialsImpl");
var Co = /* @__PURE__ */ o(async (e, t) => e.runMutation("auth:store", {
  args: {
    type: "retrieveAccountWithCredentials",
    ...t
  }
}), "callRetreiveAccountWithCredentials");

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/modifyAccount.js
te();
var va = h.object({
  provider: h.string(),
  account: h.object({ id: h.string(), secret: h.string() })
});
async function Aa(e, t, r) {
  let { provider: n, account: i } = t;
  g(v.DEBUG, "retrieveAccountWithCredentialsImpl args:", {
    provider: n,
    account: {
      id: i.id,
      secret: L(i.secret ?? "")
    }
  });
  let s = await e.db.query("authAccounts").withIndex("providerAndAccountId", (a) => a.eq("provider", n).eq("providerAccountId", i.id)).unique();
  if (s === null)
    throw new Error(`Cannot modify account with ID ${i.id} because it does not exist`);
  await e.db.patch(s._id, {
    secret: await Yr(r(n), i.secret)
  });
}
o(Aa, "modifyAccountImpl");
var Po = /* @__PURE__ */ o(async (e, t) => e.runMutation("auth:store", {
  args: {
    type: "modifyAccount",
    ...t
  }
}), "callModifyAccount");

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/invalidateSessions.js
te();
var Ea = h.object({
  userId: h.id("users"),
  except: h.optional(h.array(h.id("authSessions")))
}), Uo = /* @__PURE__ */ o(async (e, t) => e.runMutation("auth:store", {
  args: {
    type: "invalidateSessions",
    ...t
  }
}), "callInvalidateSessions"), ka = /* @__PURE__ */ o(async (e, t) => {
  g(v.DEBUG, "invalidateSessionsImpl args:", t);
  let { userId: r, except: n } = t, i = new Set(n ?? []), s = await e.db.query("authSessions").withIndex("userId", (a) => a.eq("userId", r)).collect();
  for (let a of s)
    i.has(a._id) || await Rt(e, a);
}, "invalidateSessionsImpl");

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/verifier.js
async function Ia(e) {
  return await e.db.insert("authVerifiers", {
    sessionId: await re(e) ?? void 0
  });
}
o(Ia, "verifierImpl");
var Oo = /* @__PURE__ */ o(async (e) => e.runMutation("auth:store", {
  args: {
    type: "verifier"
  }
}), "callVerifier");

// node_modules/@convex-dev/auth/dist/server/implementation/mutations/index.js
var Ta = h.object({
  args: h.union(h.object({
    type: h.literal("signIn"),
    ...ra.fields
  }), h.object({
    type: h.literal("signOut")
  }), h.object({
    type: h.literal("refreshSession"),
    ...ia.fields
  }), h.object({
    type: h.literal("verifyCodeAndSignIn"),
    ...da.fields
  }), h.object({
    type: h.literal("verifier")
  }), h.object({
    type: h.literal("verifierSignature"),
    ...fa.fields
  }), h.object({
    type: h.literal("userOAuth"),
    ...ha.fields
  }), h.object({
    type: h.literal("createVerificationCode"),
    ...ya.fields
  }), h.object({
    type: h.literal("createAccountFromCredentials"),
    ...ba.fields
  }), h.object({
    type: h.literal("retrieveAccountWithCredentials"),
    ...xa.fields
  }), h.object({
    type: h.literal("modifyAccount"),
    ...va.fields
  }), h.object({
    type: h.literal("invalidateSessions"),
    ...Ea.fields
  }))
}), Ra = /* @__PURE__ */ o(async (e, t, r, n) => {
  let i = t.args;
  switch (g(v.INFO, `\`auth:store\` type: ${i.type}`), i.type) {
    case "signIn":
      return na(e, i, n);
    case "signOut":
      return oa(e);
    case "refreshSession":
      return sa(e, i, r, n);
    case "verifyCodeAndSignIn":
      return la(e, i, r, n);
    case "verifier":
      return Ia(e);
    case "verifierSignature":
      return pa(e, i);
    case "userOAuth":
      return ma(e, i, r, n);
    case "createVerificationCode":
      return wa(e, i, r, n);
    case "createAccountFromCredentials":
      return _a(e, i, r, n);
    case "retrieveAccountWithCredentials":
      return Sa(e, i, r, n);
    case "modifyAccount":
      return Aa(e, i, r);
    case "invalidateSessions":
      return ka(e, i);
    default:
  }
}, "storeImpl");

// node_modules/@convex-dev/auth/dist/server/implementation/redirects.js
async function tn(e, t) {
  if (t.redirectTo !== void 0) {
    if (typeof t.redirectTo != "string")
      throw new Error(`Expected \`redirectTo\` to be a string, got ${t.redirectTo}`);
    return await (e.callbacks?.redirect ?? Zd)(t);
  }
  return Ca();
}
o(tn, "redirectAbsoluteUrl");
async function Zd({ redirectTo: e }) {
  let t = Ca();
  if (e.startsWith("?") || e.startsWith("/"))
    return `${t}${e}`;
  if (e.startsWith(t)) {
    let r = e[t.length];
    if (r === void 0 || r === "?" || r === "/")
      return e;
  }
  throw new Error(`Invalid \`redirectTo\` ${e} for configured SITE_URL: ${t.toString()}`);
}
o(Zd, "defaultRedirectCallback");
function rn(e, t, r) {
  let n = /([^:]+):(.*)/, [, i, s] = e.match(n), a = /^\/\/(?:\/|$|\?)/.test(s), c = a && s.startsWith("///"), d = new URL(`http:${a ? "//googblibok" + s.slice(2) : s}`);
  d.searchParams.set(t, r);
  let [, , u] = d.toString().match(n);
  return `${i}:${a ? (c ? "/" : "") + "//" + u.slice(13) : u}`;
}
o(rn, "setURLSearchParam");
function Ca() {
  return F("SITE_URL").replace(/\/$/, "");
}
o(Ca, "siteUrl");

// node_modules/@convex-dev/auth/dist/server/implementation/signIn.js
var Qd = 3600 * 24;
async function Lo(e, t, r, n) {
  if (t === null && r.refreshToken)
    return { kind: "refreshTokens", signedIn: { tokens: await Eo(e, {
      refreshToken: r.refreshToken
    }) } };
  if (t === null && r.params?.code !== void 0)
    return {
      kind: "signedIn",
      signedIn: await Ct(e, {
        params: r.params,
        verifier: r.verifier,
        generateTokens: !0,
        allowExtraProviders: n.allowExtraProviders
      })
    };
  if (t === null)
    throw new Error("Cannot sign in: Missing `provider`, `params.code` or `refreshToken`");
  if (t.type === "email" || t.type === "phone")
    return Yd(e, t, r, n);
  if (t.type === "credentials")
    return el(e, t, r, n);
  if (t.type === "oauth" || t.type === "oidc")
    return tl(e, t, r, n);
  let i = t;
  throw new Error(`Provider type ${t.type} is not supported yet`);
}
o(Lo, "signInImpl");
async function Yd(e, t, r, n) {
  if (r.params?.code !== void 0) {
    let f = await Ct(e, {
      params: r.params,
      provider: t.id,
      generateTokens: n.generateTokens,
      allowExtraProviders: n.allowExtraProviders
    });
    if (f === null)
      throw new Error("Could not verify code");
    return {
      kind: "signedIn",
      signedIn: f
    };
  }
  let s = t.generateVerificationToken ? await t.generateVerificationToken() : zr(32, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"), a = Date.now() + (t.maxAge ?? Qd) * 1e3, c = await To(e, {
    provider: t.id,
    accountId: r.accountId,
    email: r.params?.email,
    phone: r.params?.phone,
    code: s,
    expirationTime: a,
    allowExtraProviders: n.allowExtraProviders
  }), d = await tn(e.auth.config, r.params ?? {}), u = {
    identifier: c,
    url: rn(d, "code", s),
    token: s,
    expires: new Date(a)
  };
  return t.type === "email" ? await t.sendVerificationRequest(
    {
      ...u,
      provider: {
        ...t,
        from: (
          // Simplifies demo configuration of Resend
          t.from === "Auth.js <no-reply@authjs.dev>" && t.id === "resend" ? "My App <onboarding@resend.dev>" : t.from
        )
      },
      request: new Request("http://localhost"),
      // TODO: Document
      theme: e.auth.config.theme
    },
    // @ts-expect-error Figure out typing for email providers so they can
    // access ctx.
    e
  ) : t.type === "phone" && await t.sendVerificationRequest({ ...u, provider: t }, e), { kind: "started", started: !0 };
}
o(Yd, "handleEmailAndPhoneProvider");
async function el(e, t, r, n) {
  let i = await t.authorize(r.params ?? {}, e);
  return i === null ? { kind: "signedIn", signedIn: null } : {
    kind: "signedIn",
    signedIn: await vo(e, {
      userId: i.userId,
      sessionId: i.sessionId,
      generateTokens: n.generateTokens
    })
  };
}
o(el, "handleCredentials");
async function tl(e, t, r, n) {
  if (r.params?.code !== void 0)
    return {
      kind: "signedIn",
      signedIn: await Ct(e, {
        params: r.params,
        verifier: r.verifier,
        generateTokens: !0,
        allowExtraProviders: n.allowExtraProviders
      })
    };
  let i = new URL((process.env.CUSTOM_AUTH_SITE_URL ?? F("CONVEX_SITE_URL")) + `/api/auth/signin/${t.id}`), s = await Oo(e);
  if (i.searchParams.set("code", s), r.params?.redirectTo !== void 0) {
    if (typeof r.params.redirectTo != "string")
      throw new Error(`Expected \`redirectTo\` to be a string, got ${r.params.redirectTo}`);
    i.searchParams.set("redirectTo", r.params.redirectTo);
  }
  return { kind: "redirect", redirect: i.toString(), verifier: s };
}
o(tl, "handleOAuthProvider");

// node_modules/@convex-dev/auth/dist/server/oauth/checks.js
var Pa = 900;
async function Ho(e, t, r) {
  let { cookies: n } = r, i = n[e], s = /* @__PURE__ */ new Date();
  s.setTime(s.getTime() + Pa * 1e3), g("DEBUG", `CREATE_${e.toUpperCase()}`, {
    name: i.name,
    payload: t,
    COOKIE_TTL: Pa,
    expires: s
  });
  let a = { ...i.options, expires: s };
  return { name: i.name, value: t, options: a };
}
o(Ho, "createCookie");
function rl(e, t, r) {
  let { cookies: n } = t, i = n[e];
  g("DEBUG", `CLEAR_${e.toUpperCase()}`, { cookie: i }), r.push({
    name: i.name,
    value: "",
    options: { ...n[e].options, maxAge: 0 }
  });
}
o(rl, "clearCookie");
function Do(e, t) {
  return async function(r, n, i) {
    let { provider: s } = i;
    if (!s?.checks?.includes(e))
      return;
    let a = r?.[i.cookies[t].name];
    return g("DEBUG", `USE_${t.toUpperCase()}`, { value: a }), rl(t, i, n), a;
  };
}
o(Do, "useCookie");
var nn = {
  /** Creates a PKCE code challenge and verifier pair. The verifier is stored in the cookie. */
  async create(e) {
    let t = Ur(), r = await Hr(t);
    return { cookie: await Ho("pkceCodeVerifier", t, e), codeChallenge: r, codeVerifier: t };
  },
  /**
   * Returns code_verifier if the provider is configured to use PKCE,
   * and clears the container cookie afterwards.
   * An error is thrown if the code_verifier is missing or invalid.
   */
  use: Do("pkce", "pkceCodeVerifier")
}, on = {
  /** Creates a state cookie with an optionally encoded body. */
  async create(e, t) {
    let { provider: r } = e;
    if (!r.checks.includes("state")) {
      if (t)
        throw new Error("State data was provided but the provider is not configured to use state");
      return;
    }
    let n = Or();
    return { cookie: await Ho("state", n, e), value: n };
  },
  /**
   * Returns state if the provider is configured to use state,
   * and clears the container cookie afterwards.
   * An error is thrown if the state is missing or invalid.
   */
  use: Do("state", "state")
}, sn = {
  async create(e) {
    if (!e.provider.checks.includes("nonce"))
      return;
    let t = Lr();
    return { cookie: await Ho("nonce", t, e), value: t };
  },
  /**
   * Returns nonce if the provider is configured to use nonce,
   * and clears the container cookie afterwards.
   * An error is thrown if the nonce is missing or invalid.
   * @see https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes
   * @see https://danielfett.de/2020/05/16/pkce-vs-nonce-equivalent-or-not/#nonce
   */
  use: Do("nonce", "nonce")
};

// node_modules/@convex-dev/auth/dist/server/oauth/lib/utils/customFetch.js
function tt(e) {
  return { [xe]: e[ge] ?? fetch };
}
o(tt, "fetchOpt");

// node_modules/@convex-dev/auth/dist/server/oauth/convexAuth.js
function an(e) {
  return (process.env.CUSTOM_AUTH_SITE_URL ?? F("CONVEX_SITE_URL")) + "/api/auth/callback/" + e;
}
o(an, "callbackUrl");
function cn({ codeVerifier: e, state: t, nonce: r }) {
  return [e, t, r].filter((n) => n !== void 0).join(" ");
}
o(cn, "getAuthorizationSignature");
function Ko(e, t) {
  return (Ot(process.env.CONVEX_SITE_URL) ? "" : "__Host-") + t + "OAuth" + e;
}
o(Ko, "oauthStateCookieName");
var No = /* @__PURE__ */ o((e) => ({
  pkceCodeVerifier: {
    name: Ko("pkce", e),
    options: {
      ...ie
    }
  },
  state: {
    name: Ko("state", e),
    options: {
      ...ie
    }
  },
  nonce: {
    name: Ko("nonce", e),
    options: {
      ...ie
    }
  },
  // ConvexAuth: We don't support webauthn, so this value doesn't actually matter
  webauthnChallenge: {
    name: "ConvexAuth_shouldNotBeUsed_webauthnChallenge",
    options: {
      ...ie
    }
  },
  // ConvexAuth: We don't use these cookies, so their values should never be used
  sessionToken: {
    name: "ConvexAuth_shouldNotBeUsed_sessionToken",
    options: {
      ...ie
    }
  },
  callbackUrl: {
    name: "ConvexAuth_shouldNotBeUsed_callbackUrl",
    options: {
      ...ie
    }
  },
  csrfToken: {
    name: "ConvexAuth_shouldNotBeUsed_csrfToken",
    options: {
      ...ie
    }
  }
}), "defaultCookiesOptions");
async function Wo(e) {
  if (!e.authorization || !e.token || !e.userinfo) {
    if (!e.issuer)
      throw new Error(`Provider \`${e.id}\` is missing an \`issuer\` URL configuration. Consult the provider docs.`);
    let i = new URL(e.issuer), s = await fs(i, {
      ...tt(e),
      [fe]: !0
    }), a = await ps(i, s);
    if (!a.token_endpoint)
      throw new TypeError("TODO: Authorization server did not provide a token endpoint.");
    let c = a;
    return {
      ...e,
      checks: e.checks,
      profile: e.profile,
      account: e.account,
      clientId: e.clientId,
      idToken: e.type === "oidc" ? e.idToken : void 0,
      // ConvexAuth: Apparently it's important for us to normalize the endpoint after
      // service discovery (https://github.com/get-convex/convex-auth/commit/35bf716bfb0d29dbce1cbca318973b0732f75015)
      authorization: He({
        ...e.authorization,
        url: c.authorization_endpoint
      }),
      token: He({
        ...e.token,
        url: c.token_endpoint
      }),
      userinfo: c.userinfo_endpoint ? He({
        ...e.userinfo,
        url: c.userinfo_endpoint
      }) : e.userinfo,
      as: c,
      configSource: "discovered"
    };
  }
  let t = He(e.authorization), r = He(e.token), n = e.userinfo ? He(e.userinfo) : void 0;
  return {
    ...e,
    checks: e.checks,
    profile: e.profile,
    account: e.account,
    clientId: e.clientId,
    idToken: e.type === "oidc" ? e.idToken : void 0,
    authorization: t,
    token: r,
    userinfo: n,
    as: {
      issuer: e.issuer ?? "theremustbeastringhere.dev",
      authorization_endpoint: t?.url.toString(),
      token_endpoint: r?.url.toString(),
      userinfo_endpoint: n?.url.toString()
    },
    configSource: "provided"
  };
}
o(Wo, "oAuthConfigToInternalProvider");

// node_modules/@convex-dev/auth/dist/server/oauth/authorizationUrl.js
async function Oa(e) {
  let { provider: t } = e, r = t.authorization?.url, { as: n, authorization: i, configSource: s } = t;
  if (!i)
    throw new TypeError("Could not determine the authorization endpoint.");
  r || (r = new URL(i.url));
  let a = r.searchParams, c = an(t.id), d = Object.assign({
    response_type: "code",
    // clientId can technically be undefined, should we check this in assert.ts or rely on the Authorization Server to do it?
    client_id: t.clientId,
    redirect_uri: c,
    // @ts-expect-error TODO:
    ...t.authorization?.params
  }, Object.fromEntries(r.searchParams.entries() ?? []));
  for (let m in d)
    a.set(m, d[m]);
  let u = [], f = await on.create(e);
  f && (a.set("state", f.value), u.push(f.cookie));
  let l;
  if (t.checks?.includes("pkce"))
    if (s === "discovered" && !n.code_challenge_methods_supported?.includes("S256"))
      t.type === "oidc" && (t.checks = ["nonce"]);
    else {
      let m = await nn.create(e);
      a.set("code_challenge", m.codeChallenge), a.set("code_challenge_method", "S256"), u.push(m.cookie), l = m.codeVerifier;
    }
  let y = await sn.create(e);
  y && (a.set("nonce", y.value), u.push(y.cookie)), t.type === "oidc" && !r.searchParams.has("scope") && r.searchParams.set("scope", "openid profile email"), g("DEBUG", "authorization url is ready", {
    url: r,
    cookies: u,
    provider: t
  });
  let p = cn({
    codeVerifier: l,
    state: a.get("state") ?? void 0,
    nonce: a.get("nonce") ?? void 0
  });
  return { redirect: r.toString(), cookies: u, signature: p };
}
o(Oa, "getAuthorizationUrl");

// node_modules/@convex-dev/auth/dist/server/oauth/lib/utils/providers.js
function La(e) {
  return e.type === "oidc";
}
o(La, "isOIDCProvider");

// node_modules/@convex-dev/auth/dist/server/oauth/callback.js
function Ha(e) {
  return encodeURIComponent(e).replace(/%20/g, "+");
}
o(Ha, "formUrlEncode");
function nl(e, t) {
  let r = Ha(e), n = Ha(t);
  return `Basic ${btoa(`${r}:${n}`)}`;
}
o(nl, "clientSecretBasic");
async function Da(e, t, r) {
  let { provider: n } = r, { userinfo: i, as: s } = n, a = {
    client_id: n.clientId,
    ...n.client
  }, c;
  switch (a.token_endpoint_auth_method) {
    // TODO: in the next breaking major version have undefined be `client_secret_post`
    case void 0:
    case "client_secret_basic":
      c = /* @__PURE__ */ o((k, P, Z, V) => {
        V.set("authorization", nl(n.clientId, n.clientSecret));
      }, "clientAuth");
      break;
    case "client_secret_post":
      c = ms(n.clientSecret);
      break;
    case "client_secret_jwt":
      c = gs(n.clientSecret);
      break;
    case "private_key_jwt":
      c = ws(n.token.clientPrivateKey, {
        // TODO: review in the next breaking change
        [Rr](k, P) {
          P.aud = [s.issuer, s.token_endpoint];
        }
      });
      break;
    default:
      throw new Error("unsupported client authentication method");
  }
  let d = [], u = await on.use(t, d, r), f;
  try {
    f = Ls(s, a, new URLSearchParams(e), n.checks.includes("state") ? u : io);
  } catch (k) {
    if (k instanceof vt) {
      let P = {
        providerId: n.id,
        ...Object.fromEntries(k.cause.entries())
      };
      throw g("DEBUG", "OAuthCallbackError", P), new Error("OAuth Provider returned an error", { cause: P });
    }
    throw k;
  }
  let l = await nn.use(t, d, r), y = an(n.id), p = await Rs(s, a, c, f, y, l ?? "decoy", {
    // TODO: move away from allowing insecure HTTP requests
    [fe]: !0,
    [xe]: (...k) => (n.checks.includes("pkce") || k[1].body.delete("code_verifier"), tt(n)[xe](...k))
  });
  n.token?.conform && (p = await n.token.conform(p.clone()) ?? p);
  let m = {}, S = await sn.use(t, d, r), I = La(n), A = await Cs(s, a, p, {
    expectedNonce: S,
    requireIdToken: I
  }), b = A;
  if (I) {
    let k = Nr(A);
    if (k === void 0)
      throw new Error("ID Token claims are missing");
    let P = k;
    if (m = P, n.id === "apple")
      try {
        m.user = JSON.parse(e?.user);
      } catch {
      }
    if (n.idToken === !1) {
      let Z = await ro(s, a, A.access_token, {
        ...tt(n),
        // TODO: move away from allowing insecure HTTP requests
        [fe]: !0
      });
      m = await Ss(s, a, P.sub, Z);
    }
  } else if (i?.request) {
    let k = await i.request({ tokens: b, provider: n });
    k instanceof Object && (m = k);
  } else if (i?.url)
    m = await (await ro(s, a, A.access_token, tt(n))).json();
  else
    throw new TypeError("No userinfo endpoint configured");
  return b.expires_in && (b.expires_at = Math.floor(Date.now() / 1e3) + Number(b.expires_in)), {
    profile: m,
    tokens: b,
    cookies: d,
    signature: cn({ codeVerifier: l, state: u, nonce: S })
  };
}
o(Da, "handleOAuth");

// node_modules/@convex-dev/auth/dist/server/implementation/index.js
function ol(e) {
  let t = Ws(e), r = t.providers.some((c) => c.type === "oauth" || c.type === "oidc"), n = /* @__PURE__ */ o((c, d = !1) => t.providers.find((u) => u.id === c) ?? (d ? t.extraProviders.find((u) => u.id === c) : void 0), "getProvider"), i = /* @__PURE__ */ o((c, d = !1) => {
    let u = n(c, d);
    if (u === void 0) {
      let f = `Provider \`${c}\` is not configured, available providers are ${Js(t, d)}.`;
      throw g(v.ERROR, f), new Error(f);
    }
    return u;
  }, "getProviderOrThrow"), s = /* @__PURE__ */ o((c) => ({ ...c, auth: { ...c.auth, config: t } }), "enrichCtx");
  return {
    /**
     * Helper for configuring HTTP actions.
     */
    auth: {
      /**
       * @deprecated - Use `getAuthUserId` from "@convex-dev/auth/server":
       *
       * ```ts
       * import { getAuthUserId } from "@convex-dev/auth/server";
       * ```
       *
       * @hidden
       */
      getUserId: /* @__PURE__ */ o(async (c) => {
        let d = await c.auth.getUserIdentity();
        if (d === null)
          return null;
        let [u] = d.subject.split(Se);
        return u;
      }, "getUserId"),
      /**
       * @deprecated - Use `getAuthSessionId` from "@convex-dev/auth/server":
       *
       * ```
       * import { getAuthSessionId } from "@convex-dev/auth/server";
       * ```
       *
       * @hidden
       */
      getSessionId: /* @__PURE__ */ o(async (c) => {
        let d = await c.auth.getUserIdentity();
        if (d === null)
          return null;
        let [, u] = d.subject.split(Se);
        return u;
      }, "getSessionId"),
      /**
       * Add HTTP actions for JWT verification and OAuth sign-in.
       *
       * ```ts
       * import { httpRouter } from "convex/server";
       * import { auth } from "./auth.js";
       *
       * const http = httpRouter();
       *
       * auth.addHttpRoutes(http);
       *
       * export default http;
       * ```
       *
       * The following routes are handled always:
       *
       * - `/.well-known/openid-configuration`
       * - `/.well-known/jwks.json`
       *
       * The following routes are handled if OAuth is configured:
       *
       * - `/api/auth/signin/*`
       * - `/api/auth/callback/*`
       *
       * @param http your HTTP router
       */
      addHttpRoutes: /* @__PURE__ */ o((c) => {
        if (c.route({
          path: "/.well-known/openid-configuration",
          method: "GET",
          handler: nt(async () => new Response(JSON.stringify({
            issuer: F("CONVEX_SITE_URL"),
            jwks_uri: F("CONVEX_SITE_URL") + "/.well-known/jwks.json",
            authorization_endpoint: F("CONVEX_SITE_URL") + "/oauth/authorize"
          }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=15, stale-while-revalidate=15, stale-if-error=86400"
            }
          }))
        }), c.route({
          path: "/.well-known/jwks.json",
          method: "GET",
          handler: nt(async () => new Response(F("JWKS"), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=15, stale-while-revalidate=15, stale-if-error=86400"
            }
          }))
        }), r) {
          c.route({
            pathPrefix: "/api/auth/signin/",
            method: "GET",
            handler: nt(ll(400, async (u, f) => {
              let l = new URL(f.url), p = l.pathname.split("/").at(-1);
              if (p === null)
                throw new Error("Missing provider id");
              let m = l.searchParams.get("code");
              if (m === null)
                throw new Error("Missing sign-in verifier");
              let S = i(p), { redirect: I, cookies: A, signature: b } = await Oa({
                provider: await Wo(S),
                cookies: No(p)
              });
              await ko(u, {
                verifier: m,
                signature: b
              });
              let k = l.searchParams.get("redirectTo");
              k !== null && A.push(qo(p, k));
              let P = new Headers({ Location: I });
              for (let { name: Z, value: V, options: Ae } of A)
                P.append("Set-Cookie", (0, un.serialize)(Z, V, Ae));
              return new Response(null, { status: 302, headers: P });
            }))
          });
          let d = nt(async (u, f) => {
            let l = u, y = new URL(f.url), m = y.pathname.split("/").at(-1);
            g(v.DEBUG, "Handling OAuth callback for provider:", m);
            let S = i(m), I = fl(f), A = Xo(S.id, I), b = await tn(t, {
              redirectTo: A?.redirectTo
            }), k = y.searchParams;
            if (f.headers.get("Content-Type") === "application/x-www-form-urlencoded") {
              let P = await f.formData();
              for (let [Z, V] of P.entries())
                typeof V == "string" && k.append(Z, V);
            }
            try {
              let { profile: P, tokens: Z, signature: V } = await Da(Object.fromEntries(k.entries()), I, {
                provider: await Wo(S),
                cookies: No(S.id)
              }), { id: Ae, ...De } = await S.profile(P, Z);
              if (typeof Ae != "string")
                throw new Error(`The profile method of the ${m} config must return a string ID`);
              let rt = await Io(l, {
                provider: m,
                providerAccountId: Ae,
                profile: De,
                signature: V
              });
              return new Response(null, {
                status: 302,
                headers: {
                  Location: rn(b, "code", rt),
                  "Cache-Control": "must-revalidate"
                }
              });
            } catch (P) {
              return So(P), Response.redirect(b);
            }
          });
          c.route({
            pathPrefix: "/api/auth/callback/",
            method: "GET",
            handler: d
          }), c.route({
            pathPrefix: "/api/auth/callback/",
            method: "POST",
            handler: d
          });
        }
      }, "addHttpRoutes")
    },
    /**
     * Action called by the client to sign the user in.
     *
     * Also used for refreshing the session.
     */
    signIn: dn({
      args: {
        provider: h.optional(h.string()),
        params: h.optional(h.any()),
        verifier: h.optional(h.string()),
        refreshToken: h.optional(h.string()),
        calledBy: h.optional(h.string())
      },
      handler: /* @__PURE__ */ o(async (c, d) => {
        d.calledBy !== void 0 && g("INFO", `\`auth:signIn\` called by ${d.calledBy}`);
        let u = d.provider !== void 0 ? i(d.provider) : null, f = await Lo(s(c), u, d, {
          generateTokens: !0,
          allowExtraProviders: !1
        });
        switch (f.kind) {
          case "redirect":
            return { redirect: f.redirect, verifier: f.verifier };
          case "signedIn":
          case "refreshTokens":
            return { tokens: f.signedIn?.tokens ?? null };
          case "started":
            return { started: !0 };
          default: {
            let l = f;
            throw new Error(`Unexpected result from signIn, ${f}`);
          }
        }
      }, "handler")
    }),
    /**
     * Action called by the client to invalidate the current session.
     */
    signOut: dn({
      args: {},
      handler: /* @__PURE__ */ o(async (c) => {
        await Ao(c);
      }, "handler")
    }),
    /**
     * Internal mutation used by the library to read and write
     * to the database during signin and signout.
     */
    store: Jo({
      args: Ta,
      handler: /* @__PURE__ */ o(async (c, d) => Ra(c, d, i, t), "handler")
    }),
    /**
     * Utility function for frameworks to use to get the current auth state
     * based on credentials that they've supplied separately.
     */
    isAuthenticated: Mo({
      args: {},
      handler: /* @__PURE__ */ o(async (c, d) => await c.auth.getUserIdentity() !== null, "handler")
    })
  };
}
o(ol, "convexAuth");
async function il(e) {
  let t = await e.auth.getUserIdentity();
  if (t === null)
    return null;
  let [r] = t.subject.split(Se);
  return r;
}
o(il, "getAuthUserId");
async function sl(e, t) {
  return await Ro(e, t);
}
o(sl, "createAccount");
async function al(e, t) {
  let n = await Co(e, t);
  if (typeof n == "string")
    throw new Error(n);
  return n;
}
o(al, "retrieveAccount");
async function cl(e, t) {
  return await Po(e, t);
}
o(cl, "modifyAccountCredentials");
async function ul(e, t) {
  return await Uo(e, t);
}
o(ul, "invalidateSessions");
async function dl(e, t, r) {
  let n = await Lo(e, $s(t), r, {
    generateTokens: !1,
    allowExtraProviders: !0
  });
  return n.kind === "signedIn" && n.signedIn !== null ? { userId: n.signedIn.userId, sessionId: n.signedIn.sessionId } : null;
}
o(dl, "signInViaProvider");
function ll(e, t) {
  return async (r, n) => {
    try {
      return await t(r, n);
    } catch (i) {
      return i instanceof Bo ? new Response(null, {
        status: e,
        statusText: i.data
      }) : (So(i), new Response(null, {
        status: 500,
        statusText: "Internal Server Error"
      }));
    }
  };
}
o(ll, "convertErrorsToResponse");
function fl(e) {
  return (0, un.parse)(e.headers.get("Cookie") ?? "");
}
o(fl, "getCookies");

export {
  bo as a,
  Kd as b,
  ol as c,
  il as d,
  sl as e,
  al as f,
  cl as g,
  ul as h,
  dl as i
};
/*! Bundled license information:

@auth/core/lib/vendored/cookie.js:
  (**
   * @source https://github.com/jshttp/cookie
   * @author blakeembrey
   * @license MIT
   *)
*/
//# sourceMappingURL=ZRD5YQUR.js.map
