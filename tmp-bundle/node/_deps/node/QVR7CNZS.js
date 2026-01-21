import {
  a as q,
  b as ze,
  c as Ne,
  d as z,
  e as fe,
  f as ce,
  g as De,
  h as Me,
  i as We,
  j as Ve,
  k as Ge
} from "./HRR3KFHV.js";
import {
  a as i,
  c as g
} from "./V7X2J7BI.js";

// node_modules/data-uri-to-buffer/dist/index.js
function Ke(r) {
  if (!/^data:/i.test(r))
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  r = r.replace(/\r?\n/g, "");
  let e = r.indexOf(",");
  if (e === -1 || e <= 4)
    throw new TypeError("malformed data: URI");
  let t = r.substring(5, e).split(";"), n = "", o = !1, s = t[0] || "text/plain", a = s;
  for (let x = 1; x < t.length; x++)
    t[x] === "base64" ? o = !0 : t[x] && (a += `;${t[x]}`, t[x].indexOf("charset=") === 0 && (n = t[x].substring(8)));
  !t[0] && !n.length && (a += ";charset=US-ASCII", n = "US-ASCII");
  let l = o ? "base64" : "ascii", u = unescape(r.substring(e + 1)), f = Buffer.from(u, l);
  return f.type = s, f.typeFull = a, f.charset = n, f;
}
var le, ue = g(() => {
  i(Ke, "dataUriToBuffer");
  le = Ke;
});

// node_modules/node-fetch/src/errors/base.js
var v, W = g(() => {
  v = class extends Error {
    static {
      i(this, "FetchBaseError");
    }
    constructor(e, t) {
      super(e), Error.captureStackTrace(this, this.constructor), this.type = t;
    }
    get name() {
      return this.constructor.name;
    }
    get [Symbol.toStringTag]() {
      return this.constructor.name;
    }
  };
});

// node_modules/node-fetch/src/errors/fetch-error.js
var m, ee = g(() => {
  W();
  m = class extends v {
    static {
      i(this, "FetchError");
    }
    /**
     * @param  {string} message -      Error message for human
     * @param  {string} [type] -        Error type for machine
     * @param  {SystemError} [systemError] - For Node.js system error
     */
    constructor(e, t, n) {
      super(e, t), n && (this.code = this.errno = n.code, this.erroredSysCall = n.syscall);
    }
  };
});

// node_modules/node-fetch/src/utils/is.js
var V, re, N, he, de, pe, G = g(() => {
  V = Symbol.toStringTag, re = /* @__PURE__ */ i((r) => typeof r == "object" && typeof r.append == "function" && typeof r.delete == "function" && typeof r.get == "function" && typeof r.getAll == "function" && typeof r.has == "function" && typeof r.set == "function" && typeof r.sort == "function" && r[V] === "URLSearchParams", "isURLSearchParameters"), N = /* @__PURE__ */ i((r) => r && typeof r == "object" && typeof r.arrayBuffer == "function" && typeof r.type == "string" && typeof r.stream == "function" && typeof r.constructor == "function" && /^(Blob|File)$/.test(r[V]), "isBlob"), he = /* @__PURE__ */ i((r) => typeof r == "object" && (r[V] === "AbortSignal" || r[V] === "EventTarget"), "isAbortSignal"), de = /* @__PURE__ */ i((r, e) => {
    let t = new URL(e).hostname, n = new URL(r).hostname;
    return t === n || t.endsWith(`.${n}`);
  }, "isDomainOrSubdomain"), pe = /* @__PURE__ */ i((r, e) => {
    let t = new URL(e).protocol, n = new URL(r).protocol;
    return t === n;
  }, "isSameProtocol");
});

// node_modules/node-fetch/src/body.js
import B, { PassThrough as me } from "node:stream";
import { types as ye, deprecate as oe, promisify as Ye } from "node:util";
import { Buffer as S } from "node:buffer";
async function te(r) {
  if (r[y].disturbed)
    throw new TypeError(`body used already for: ${r.url}`);
  if (r[y].disturbed = !0, r[y].error)
    throw r[y].error;
  let { body: e } = r;
  if (e === null)
    return S.alloc(0);
  if (!(e instanceof B))
    return S.alloc(0);
  let t = [], n = 0;
  try {
    for await (let o of e) {
      if (r.size > 0 && n + o.length > r.size) {
        let s = new m(`content size at ${r.url} over limit: ${r.size}`, "max-size");
        throw e.destroy(s), s;
      }
      n += o.length, t.push(o);
    }
  } catch (o) {
    throw o instanceof v ? o : new m(`Invalid response body while trying to fetch ${r.url}: ${o.message}`, "system", o);
  }
  if (e.readableEnded === !0 || e._readableState.ended === !0)
    try {
      return t.every((o) => typeof o == "string") ? S.from(t.join("")) : S.concat(t, n);
    } catch (o) {
      throw new m(`Could not create Buffer from response body for ${r.url}: ${o.message}`, "system", o);
    }
  else
    throw new m(`Premature close of server response while trying to fetch ${r.url}`);
}
var Je, y, P, k, _e, K, ge, we, Y = g(() => {
  ze();
  ce();
  ee();
  W();
  G();
  Je = Ye(B.pipeline), y = Symbol("Body internals"), P = class {
    static {
      i(this, "Body");
    }
    constructor(e, {
      size: t = 0
    } = {}) {
      let n = null;
      e === null ? e = null : re(e) ? e = S.from(e.toString()) : N(e) || S.isBuffer(e) || (ye.isAnyArrayBuffer(e) ? e = S.from(e) : ArrayBuffer.isView(e) ? e = S.from(e.buffer, e.byteOffset, e.byteLength) : e instanceof B || (e instanceof z ? (e = fe(e), n = e.type.split("=")[1]) : e = S.from(String(e))));
      let o = e;
      S.isBuffer(e) ? o = B.Readable.from(e) : N(e) && (o = B.Readable.from(e.stream())), this[y] = {
        body: e,
        stream: o,
        boundary: n,
        disturbed: !1,
        error: null
      }, this.size = t, e instanceof B && e.on("error", (s) => {
        let a = s instanceof v ? s : new m(`Invalid response body while trying to fetch ${this.url}: ${s.message}`, "system", s);
        this[y].error = a;
      });
    }
    get body() {
      return this[y].stream;
    }
    get bodyUsed() {
      return this[y].disturbed;
    }
    /**
     * Decode response as ArrayBuffer
     *
     * @return  Promise
     */
    async arrayBuffer() {
      let { buffer: e, byteOffset: t, byteLength: n } = await te(this);
      return e.slice(t, t + n);
    }
    async formData() {
      let e = this.headers.get("content-type");
      if (e.startsWith("application/x-www-form-urlencoded")) {
        let n = new z(), o = new URLSearchParams(await this.text());
        for (let [s, a] of o)
          n.append(s, a);
        return n;
      }
      let { toFormData: t } = await import("./ONVEAPKL.js");
      return t(this.body, e);
    }
    /**
     * Return raw response as Blob
     *
     * @return Promise
     */
    async blob() {
      let e = this.headers && this.headers.get("content-type") || this[y].body && this[y].body.type || "", t = await this.arrayBuffer();
      return new q([t], {
        type: e
      });
    }
    /**
     * Decode response as json
     *
     * @return  Promise
     */
    async json() {
      let e = await this.text();
      return JSON.parse(e);
    }
    /**
     * Decode response as text
     *
     * @return  Promise
     */
    async text() {
      let e = await te(this);
      return new TextDecoder().decode(e);
    }
    /**
     * Decode response as buffer (non-spec api)
     *
     * @return  Promise
     */
    buffer() {
      return te(this);
    }
  };
  P.prototype.buffer = oe(P.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
  Object.defineProperties(P.prototype, {
    body: { enumerable: !0 },
    bodyUsed: { enumerable: !0 },
    arrayBuffer: { enumerable: !0 },
    blob: { enumerable: !0 },
    json: { enumerable: !0 },
    text: { enumerable: !0 },
    data: { get: oe(
      () => {
      },
      "data doesn't exist, use json(), text(), arrayBuffer(), or body instead",
      "https://github.com/node-fetch/node-fetch/issues/1000 (response)"
    ) }
  });
  i(te, "consumeBody");
  k = /* @__PURE__ */ i((r, e) => {
    let t, n, { body: o } = r[y];
    if (r.bodyUsed)
      throw new Error("cannot clone body after it is used");
    return o instanceof B && typeof o.getBoundary != "function" && (t = new me({ highWaterMark: e }), n = new me({ highWaterMark: e }), o.pipe(t), o.pipe(n), r[y].stream = t, o = n), o;
  }, "clone"), _e = oe(
    (r) => r.getBoundary(),
    "form-data doesn't follow the spec and requires special treatment. Use alternative package",
    "https://github.com/node-fetch/node-fetch/issues/1167"
  ), K = /* @__PURE__ */ i((r, e) => r === null ? null : typeof r == "string" ? "text/plain;charset=UTF-8" : re(r) ? "application/x-www-form-urlencoded;charset=UTF-8" : N(r) ? r.type || null : S.isBuffer(r) || ye.isAnyArrayBuffer(r) || ArrayBuffer.isView(r) ? null : r instanceof z ? `multipart/form-data; boundary=${e[y].boundary}` : r && typeof r.getBoundary == "function" ? `multipart/form-data;boundary=${_e(r)}` : r instanceof B ? null : "text/plain;charset=UTF-8", "extractContentType"), ge = /* @__PURE__ */ i((r) => {
    let { body: e } = r[y];
    return e === null ? 0 : N(e) ? e.size : S.isBuffer(e) ? e.length : e && typeof e.getLengthSync == "function" && e.hasKnownLength && e.hasKnownLength() ? e.getLengthSync() : null;
  }, "getTotalBytes"), we = /* @__PURE__ */ i(async (r, { body: e }) => {
    e === null ? r.end() : await Je(e, r);
  }, "writeToStream");
});

// node_modules/node-fetch/src/headers.js
import { types as be } from "node:util";
import _ from "node:http";
function Se(r = []) {
  return new w(
    r.reduce((e, t, n, o) => (n % 2 === 0 && e.push(o.slice(n, n + 2)), e), []).filter(([e, t]) => {
      try {
        return J(e), ne(e, String(t)), !0;
      } catch {
        return !1;
      }
    })
  );
}
var J, ne, w, Z = g(() => {
  J = typeof _.validateHeaderName == "function" ? _.validateHeaderName : (r) => {
    if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(r)) {
      let e = new TypeError(`Header name must be a valid HTTP token [${r}]`);
      throw Object.defineProperty(e, "code", { value: "ERR_INVALID_HTTP_TOKEN" }), e;
    }
  }, ne = typeof _.validateHeaderValue == "function" ? _.validateHeaderValue : (r, e) => {
    if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(e)) {
      let t = new TypeError(`Invalid character in header content ["${r}"]`);
      throw Object.defineProperty(t, "code", { value: "ERR_INVALID_CHAR" }), t;
    }
  }, w = class r extends URLSearchParams {
    static {
      i(this, "Headers");
    }
    /**
     * Headers class
     *
     * @constructor
     * @param {HeadersInit} [init] - Response headers
     */
    constructor(e) {
      let t = [];
      if (e instanceof r) {
        let n = e.raw();
        for (let [o, s] of Object.entries(n))
          t.push(...s.map((a) => [o, a]));
      } else if (e != null)
        if (typeof e == "object" && !be.isBoxedPrimitive(e)) {
          let n = e[Symbol.iterator];
          if (n == null)
            t.push(...Object.entries(e));
          else {
            if (typeof n != "function")
              throw new TypeError("Header pairs must be iterable");
            t = [...e].map((o) => {
              if (typeof o != "object" || be.isBoxedPrimitive(o))
                throw new TypeError("Each header pair must be an iterable object");
              return [...o];
            }).map((o) => {
              if (o.length !== 2)
                throw new TypeError("Each header pair must be a name/value tuple");
              return [...o];
            });
          }
        } else
          throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
      return t = t.length > 0 ? t.map(([n, o]) => (J(n), ne(n, String(o)), [String(n).toLowerCase(), String(o)])) : void 0, super(t), new Proxy(this, {
        get(n, o, s) {
          switch (o) {
            case "append":
            case "set":
              return (a, l) => (J(a), ne(a, String(l)), URLSearchParams.prototype[o].call(
                n,
                String(a).toLowerCase(),
                String(l)
              ));
            case "delete":
            case "has":
            case "getAll":
              return (a) => (J(a), URLSearchParams.prototype[o].call(
                n,
                String(a).toLowerCase()
              ));
            case "keys":
              return () => (n.sort(), new Set(URLSearchParams.prototype.keys.call(n)).keys());
            default:
              return Reflect.get(n, o, s);
          }
        }
      });
    }
    get [Symbol.toStringTag]() {
      return this.constructor.name;
    }
    toString() {
      return Object.prototype.toString.call(this);
    }
    get(e) {
      let t = this.getAll(e);
      if (t.length === 0)
        return null;
      let n = t.join(", ");
      return /^content-encoding$/i.test(e) && (n = n.toLowerCase()), n;
    }
    forEach(e, t = void 0) {
      for (let n of this.keys())
        Reflect.apply(e, t, [this.get(n), n, this]);
    }
    *values() {
      for (let e of this.keys())
        yield this.get(e);
    }
    /**
     * @type {() => IterableIterator<[string, string]>}
     */
    *entries() {
      for (let e of this.keys())
        yield [e, this.get(e)];
    }
    [Symbol.iterator]() {
      return this.entries();
    }
    /**
     * Node-fetch non-spec method
     * returning all headers and their values as array
     * @returns {Record<string, string[]>}
     */
    raw() {
      return [...this.keys()].reduce((e, t) => (e[t] = this.getAll(t), e), {});
    }
    /**
     * For better console.log(headers) and also to convert Headers into Node.js Request compatible format
     */
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return [...this.keys()].reduce((e, t) => {
        let n = this.getAll(t);
        return t === "host" ? e[t] = n[0] : e[t] = n.length > 1 ? n : n[0], e;
      }, {});
    }
  };
  Object.defineProperties(
    w.prototype,
    ["get", "entries", "forEach", "values"].reduce((r, e) => (r[e] = { enumerable: !0 }, r), {})
  );
  i(Se, "fromRawHeaders");
});

// node_modules/node-fetch/src/utils/is-redirect.js
var Ze, Q, se = g(() => {
  Ze = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]), Q = /* @__PURE__ */ i((r) => Ze.has(r), "isRedirect");
});

// node_modules/node-fetch/src/response.js
var R, T, Te = g(() => {
  Z();
  Y();
  se();
  R = Symbol("Response internals"), T = class r extends P {
    static {
      i(this, "Response");
    }
    constructor(e = null, t = {}) {
      super(e, t);
      let n = t.status != null ? t.status : 200, o = new w(t.headers);
      if (e !== null && !o.has("Content-Type")) {
        let s = K(e, this);
        s && o.append("Content-Type", s);
      }
      this[R] = {
        type: "default",
        url: t.url,
        status: n,
        statusText: t.statusText || "",
        headers: o,
        counter: t.counter,
        highWaterMark: t.highWaterMark
      };
    }
    get type() {
      return this[R].type;
    }
    get url() {
      return this[R].url || "";
    }
    get status() {
      return this[R].status;
    }
    /**
     * Convenience property representing if the request ended normally
     */
    get ok() {
      return this[R].status >= 200 && this[R].status < 300;
    }
    get redirected() {
      return this[R].counter > 0;
    }
    get statusText() {
      return this[R].statusText;
    }
    get headers() {
      return this[R].headers;
    }
    get highWaterMark() {
      return this[R].highWaterMark;
    }
    /**
     * Clone this response
     *
     * @return  Response
     */
    clone() {
      return new r(k(this, this.highWaterMark), {
        type: this.type,
        url: this.url,
        status: this.status,
        statusText: this.statusText,
        headers: this.headers,
        ok: this.ok,
        redirected: this.redirected,
        size: this.size,
        highWaterMark: this.highWaterMark
      });
    }
    /**
     * @param {string} url    The URL that the new response is to originate from.
     * @param {number} status An optional status code for the response (e.g., 302.)
     * @returns {Response}    A Response object.
     */
    static redirect(e, t = 302) {
      if (!Q(t))
        throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
      return new r(null, {
        headers: {
          location: new URL(e).toString()
        },
        status: t
      });
    }
    static error() {
      let e = new r(null, { status: 0, statusText: "" });
      return e[R].type = "error", e;
    }
    static json(e = void 0, t = {}) {
      let n = JSON.stringify(e);
      if (n === void 0)
        throw new TypeError("data is not JSON serializable");
      let o = new w(t && t.headers);
      return o.has("content-type") || o.set("content-type", "application/json"), new r(n, {
        ...t,
        headers: o
      });
    }
    get [Symbol.toStringTag]() {
      return "Response";
    }
  };
  Object.defineProperties(T.prototype, {
    type: { enumerable: !0 },
    url: { enumerable: !0 },
    status: { enumerable: !0 },
    ok: { enumerable: !0 },
    redirected: { enumerable: !0 },
    statusText: { enumerable: !0 },
    headers: { enumerable: !0 },
    clone: { enumerable: !0 }
  });
});

// node_modules/node-fetch/src/utils/get-search.js
var Re, xe = g(() => {
  Re = /* @__PURE__ */ i((r) => {
    if (r.search)
      return r.search;
    let e = r.href.length - 1, t = r.hash || (r.href[e] === "#" ? "#" : "");
    return r.href[e - t.length] === "?" ? "?" : "";
  }, "getSearch");
});

// node_modules/node-fetch/src/utils/referrer.js
import { isIP as Qe } from "node:net";
function Ee(r, e = !1) {
  return r == null || (r = new URL(r), /^(about|blob|data):$/.test(r.protocol)) ? "no-referrer" : (r.username = "", r.password = "", r.hash = "", e && (r.pathname = "", r.search = ""), r);
}
function Ue(r) {
  if (!Pe.has(r))
    throw new TypeError(`Invalid referrerPolicy: ${r}`);
  return r;
}
function Xe(r) {
  if (/^(http|ws)s:$/.test(r.protocol))
    return !0;
  let e = r.host.replace(/(^\[)|(]$)/g, ""), t = Qe(e);
  return t === 4 && /^127\./.test(e) || t === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(e) ? !0 : r.host === "localhost" || r.host.endsWith(".localhost") ? !1 : r.protocol === "file:";
}
function O(r) {
  return /^about:(blank|srcdoc)$/.test(r) || r.protocol === "data:" || /^(blob|filesystem):$/.test(r.protocol) ? !0 : Xe(r);
}
function ve(r, { referrerURLCallback: e, referrerOriginCallback: t } = {}) {
  if (r.referrer === "no-referrer" || r.referrerPolicy === "")
    return null;
  let n = r.referrerPolicy;
  if (r.referrer === "about:client")
    return "no-referrer";
  let o = r.referrer, s = Ee(o), a = Ee(o, !0);
  s.toString().length > 4096 && (s = a), e && (s = e(s)), t && (a = t(a));
  let l = new URL(r.url);
  switch (n) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return a;
    case "unsafe-url":
      return s;
    case "strict-origin":
      return O(s) && !O(l) ? "no-referrer" : a.toString();
    case "strict-origin-when-cross-origin":
      return s.origin === l.origin ? s : O(s) && !O(l) ? "no-referrer" : a;
    case "same-origin":
      return s.origin === l.origin ? s : "no-referrer";
    case "origin-when-cross-origin":
      return s.origin === l.origin ? s : a;
    case "no-referrer-when-downgrade":
      return O(s) && !O(l) ? "no-referrer" : s;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${n}`);
  }
}
function Be(r) {
  let e = (r.get("referrer-policy") || "").split(/[,\s]+/), t = "";
  for (let n of e)
    n && Pe.has(n) && (t = n);
  return t;
}
var Pe, Le, ie = g(() => {
  i(Ee, "stripURLForUseAsAReferrer");
  Pe = /* @__PURE__ */ new Set([
    "",
    "no-referrer",
    "no-referrer-when-downgrade",
    "same-origin",
    "origin",
    "strict-origin",
    "origin-when-cross-origin",
    "strict-origin-when-cross-origin",
    "unsafe-url"
  ]), Le = "strict-origin-when-cross-origin";
  i(Ue, "validateReferrerPolicy");
  i(Xe, "isOriginPotentiallyTrustworthy");
  i(O, "isUrlPotentiallyTrustworthy");
  i(ve, "determineRequestsReferrer");
  i(Be, "parseReferrerPolicyFromHeader");
});

// node_modules/node-fetch/src/request.js
import { format as je } from "node:url";
import { deprecate as qe } from "node:util";
var h, D, er, $, Ae, Ce = g(() => {
  Z();
  Y();
  G();
  xe();
  ie();
  h = Symbol("Request internals"), D = /* @__PURE__ */ i((r) => typeof r == "object" && typeof r[h] == "object", "isRequest"), er = qe(
    () => {
    },
    ".data is not a valid RequestInit property, use .body instead",
    "https://github.com/node-fetch/node-fetch/issues/1000 (request)"
  ), $ = class r extends P {
    static {
      i(this, "Request");
    }
    constructor(e, t = {}) {
      let n;
      if (D(e) ? n = new URL(e.url) : (n = new URL(e), e = {}), n.username !== "" || n.password !== "")
        throw new TypeError(`${n} is an url with embedded credentials.`);
      let o = t.method || e.method || "GET";
      if (/^(delete|get|head|options|post|put)$/i.test(o) && (o = o.toUpperCase()), !D(t) && "data" in t && er(), (t.body != null || D(e) && e.body !== null) && (o === "GET" || o === "HEAD"))
        throw new TypeError("Request with GET/HEAD method cannot have body");
      let s = t.body ? t.body : D(e) && e.body !== null ? k(e) : null;
      super(s, {
        size: t.size || e.size || 0
      });
      let a = new w(t.headers || e.headers || {});
      if (s !== null && !a.has("Content-Type")) {
        let f = K(s, this);
        f && a.set("Content-Type", f);
      }
      let l = D(e) ? e.signal : null;
      if ("signal" in t && (l = t.signal), l != null && !he(l))
        throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
      let u = t.referrer == null ? e.referrer : t.referrer;
      if (u === "")
        u = "no-referrer";
      else if (u) {
        let f = new URL(u);
        u = /^about:(\/\/)?client$/.test(f) ? "client" : f;
      } else
        u = void 0;
      this[h] = {
        method: o,
        redirect: t.redirect || e.redirect || "follow",
        headers: a,
        parsedURL: n,
        signal: l,
        referrer: u
      }, this.follow = t.follow === void 0 ? e.follow === void 0 ? 20 : e.follow : t.follow, this.compress = t.compress === void 0 ? e.compress === void 0 ? !0 : e.compress : t.compress, this.counter = t.counter || e.counter || 0, this.agent = t.agent || e.agent, this.highWaterMark = t.highWaterMark || e.highWaterMark || 16384, this.insecureHTTPParser = t.insecureHTTPParser || e.insecureHTTPParser || !1, this.referrerPolicy = t.referrerPolicy || e.referrerPolicy || "";
    }
    /** @returns {string} */
    get method() {
      return this[h].method;
    }
    /** @returns {string} */
    get url() {
      return je(this[h].parsedURL);
    }
    /** @returns {Headers} */
    get headers() {
      return this[h].headers;
    }
    get redirect() {
      return this[h].redirect;
    }
    /** @returns {AbortSignal} */
    get signal() {
      return this[h].signal;
    }
    // https://fetch.spec.whatwg.org/#dom-request-referrer
    get referrer() {
      if (this[h].referrer === "no-referrer")
        return "";
      if (this[h].referrer === "client")
        return "about:client";
      if (this[h].referrer)
        return this[h].referrer.toString();
    }
    get referrerPolicy() {
      return this[h].referrerPolicy;
    }
    set referrerPolicy(e) {
      this[h].referrerPolicy = Ue(e);
    }
    /**
     * Clone this request
     *
     * @return  Request
     */
    clone() {
      return new r(this);
    }
    get [Symbol.toStringTag]() {
      return "Request";
    }
  };
  Object.defineProperties($.prototype, {
    method: { enumerable: !0 },
    url: { enumerable: !0 },
    headers: { enumerable: !0 },
    redirect: { enumerable: !0 },
    clone: { enumerable: !0 },
    signal: { enumerable: !0 },
    referrer: { enumerable: !0 },
    referrerPolicy: { enumerable: !0 }
  });
  Ae = /* @__PURE__ */ i((r) => {
    let { parsedURL: e } = r[h], t = new w(r[h].headers);
    t.has("Accept") || t.set("Accept", "*/*");
    let n = null;
    if (r.body === null && /^(post|put)$/i.test(r.method) && (n = "0"), r.body !== null) {
      let l = ge(r);
      typeof l == "number" && !Number.isNaN(l) && (n = String(l));
    }
    n && t.set("Content-Length", n), r.referrerPolicy === "" && (r.referrerPolicy = Le), r.referrer && r.referrer !== "no-referrer" ? r[h].referrer = ve(r) : r[h].referrer = "no-referrer", r[h].referrer instanceof URL && t.set("Referer", r.referrer), t.has("User-Agent") || t.set("User-Agent", "node-fetch"), r.compress && !t.has("Accept-Encoding") && t.set("Accept-Encoding", "gzip, deflate, br");
    let { agent: o } = r;
    typeof o == "function" && (o = o(e));
    let s = Re(e), a = {
      // Overwrite search to retain trailing ? (issue #776)
      path: e.pathname + s,
      // The following options are not expressed in the URL
      method: r.method,
      headers: t[Symbol.for("nodejs.util.inspect.custom")](),
      insecureHTTPParser: r.insecureHTTPParser,
      agent: o
    };
    return {
      /** @type {URL} */
      parsedURL: e,
      options: a
    };
  }, "getNodeRequestOptions");
});

// node_modules/node-fetch/src/errors/abort-error.js
var X, $e = g(() => {
  W();
  X = class extends v {
    static {
      i(this, "AbortError");
    }
    constructor(e, t = "aborted") {
      super(e, t);
    }
  };
});

// node_modules/node-fetch/src/index.js
import rr from "node:http";
import tr from "node:https";
import H from "node:zlib";
import Fe, { PassThrough as ke, pipeline as I } from "node:stream";
import { Buffer as j } from "node:buffer";
async function Oe(r, e) {
  return new Promise((t, n) => {
    let o = new $(r, e), { parsedURL: s, options: a } = Ae(o);
    if (!or.has(s.protocol))
      throw new TypeError(`node-fetch cannot load ${r}. URL scheme "${s.protocol.replace(/:$/, "")}" is not supported.`);
    if (s.protocol === "data:") {
      let c = le(o.url), L = new T(c, { headers: { "Content-Type": c.typeFull } });
      t(L);
      return;
    }
    let l = (s.protocol === "https:" ? tr : rr).request, { signal: u } = o, f = null, x = /* @__PURE__ */ i(() => {
      let c = new X("The operation was aborted.");
      n(c), o.body && o.body instanceof Fe.Readable && o.body.destroy(c), !(!f || !f.body) && f.body.emit("error", c);
    }, "abort");
    if (u && u.aborted) {
      x();
      return;
    }
    let M = /* @__PURE__ */ i(() => {
      x(), C();
    }, "abortAndFinalize"), A = l(s.toString(), a);
    u && u.addEventListener("abort", M);
    let C = /* @__PURE__ */ i(() => {
      A.abort(), u && u.removeEventListener("abort", M);
    }, "finalize");
    A.on("error", (c) => {
      n(new m(`request to ${o.url} failed, reason: ${c.message}`, "system", c)), C();
    }), nr(A, (c) => {
      f && f.body && f.body.destroy(c);
    }), process.version < "v14" && A.on("socket", (c) => {
      let L;
      c.prependListener("end", () => {
        L = c._eventsCount;
      }), c.prependListener("close", (d) => {
        if (f && L < c._eventsCount && !d) {
          let U = new Error("Premature close");
          U.code = "ERR_STREAM_PREMATURE_CLOSE", f.body.emit("error", U);
        }
      });
    }), A.on("response", (c) => {
      A.setTimeout(0);
      let L = Se(c.rawHeaders);
      if (Q(c.statusCode)) {
        let p = L.get("Location"), E = null;
        try {
          E = p === null ? null : new URL(p, o.url);
        } catch {
          if (o.redirect !== "manual") {
            n(new m(`uri requested responds with an invalid redirect URL: ${p}`, "invalid-redirect")), C();
            return;
          }
        }
        switch (o.redirect) {
          case "error":
            n(new m(`uri requested responds with a redirect, redirect mode is set to error: ${o.url}`, "no-redirect")), C();
            return;
          case "manual":
            break;
          case "follow": {
            if (E === null)
              break;
            if (o.counter >= o.follow) {
              n(new m(`maximum redirect reached at: ${o.url}`, "max-redirect")), C();
              return;
            }
            let b = {
              headers: new w(o.headers),
              follow: o.follow,
              counter: o.counter + 1,
              agent: o.agent,
              compress: o.compress,
              method: o.method,
              body: k(o),
              signal: o.signal,
              size: o.size,
              referrer: o.referrer,
              referrerPolicy: o.referrerPolicy
            };
            if (!de(o.url, E) || !pe(o.url, E))
              for (let Ie of ["authorization", "www-authenticate", "cookie", "cookie2"])
                b.headers.delete(Ie);
            if (c.statusCode !== 303 && o.body && e.body instanceof Fe.Readable) {
              n(new m("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), C();
              return;
            }
            (c.statusCode === 303 || (c.statusCode === 301 || c.statusCode === 302) && o.method === "POST") && (b.method = "GET", b.body = void 0, b.headers.delete("content-length"));
            let ae = Be(L);
            ae && (b.referrerPolicy = ae), t(Oe(new $(E, b))), C();
            return;
          }
          default:
            return n(new TypeError(`Redirect option '${o.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      u && c.once("end", () => {
        u.removeEventListener("abort", M);
      });
      let d = I(c, new ke(), (p) => {
        p && n(p);
      });
      process.version < "v12.10" && c.on("aborted", M);
      let U = {
        url: o.url,
        status: c.statusCode,
        statusText: c.statusMessage,
        headers: L,
        size: o.size,
        counter: o.counter,
        highWaterMark: o.highWaterMark
      }, F = L.get("Content-Encoding");
      if (!o.compress || o.method === "HEAD" || F === null || c.statusCode === 204 || c.statusCode === 304) {
        f = new T(d, U), t(f);
        return;
      }
      let He = {
        flush: H.Z_SYNC_FLUSH,
        finishFlush: H.Z_SYNC_FLUSH
      };
      if (F === "gzip" || F === "x-gzip") {
        d = I(d, H.createGunzip(He), (p) => {
          p && n(p);
        }), f = new T(d, U), t(f);
        return;
      }
      if (F === "deflate" || F === "x-deflate") {
        let p = I(c, new ke(), (E) => {
          E && n(E);
        });
        p.once("data", (E) => {
          (E[0] & 15) === 8 ? d = I(d, H.createInflate(), (b) => {
            b && n(b);
          }) : d = I(d, H.createInflateRaw(), (b) => {
            b && n(b);
          }), f = new T(d, U), t(f);
        }), p.once("end", () => {
          f || (f = new T(d, U), t(f));
        });
        return;
      }
      if (F === "br") {
        d = I(d, H.createBrotliDecompress(), (p) => {
          p && n(p);
        }), f = new T(d, U), t(f);
        return;
      }
      f = new T(d, U), t(f);
    }), we(A, o).catch(n);
  });
}
function nr(r, e) {
  let t = j.from(`0\r
\r
`), n = !1, o = !1, s;
  r.on("response", (a) => {
    let { headers: l } = a;
    n = l["transfer-encoding"] === "chunked" && !l["content-length"];
  }), r.on("socket", (a) => {
    let l = /* @__PURE__ */ i(() => {
      if (n && !o) {
        let f = new Error("Premature close");
        f.code = "ERR_STREAM_PREMATURE_CLOSE", e(f);
      }
    }, "onSocketClose"), u = /* @__PURE__ */ i((f) => {
      o = j.compare(f.slice(-5), t) === 0, !o && s && (o = j.compare(s.slice(-3), t.slice(0, 3)) === 0 && j.compare(f.slice(-2), t.slice(3)) === 0), s = f;
    }, "onData");
    a.prependListener("close", l), a.on("data", u), r.on("close", () => {
      a.removeListener("close", l), a.removeListener("data", u);
    });
  });
}
var or, sr = g(() => {
  ue();
  Y();
  Te();
  Z();
  Ce();
  ee();
  $e();
  se();
  ce();
  G();
  ie();
  Ge();
  or = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
  i(Oe, "fetch");
  i(nr, "fixResponseChunkedTransferBadEnding");
});
sr();
export {
  X as AbortError,
  q as Blob,
  m as FetchError,
  Ne as File,
  z as FormData,
  w as Headers,
  $ as Request,
  T as Response,
  Me as blobFrom,
  De as blobFromSync,
  Oe as default,
  We as fileFrom,
  Ve as fileFromSync,
  Q as isRedirect
};
//# sourceMappingURL=QVR7CNZS.js.map
