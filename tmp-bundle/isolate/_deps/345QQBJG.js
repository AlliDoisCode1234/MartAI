import {
  a as i
} from "./RUVYHBJQ.js";

// node_modules/@anthropic-ai/sdk/internal/tslib.mjs
function u(s, e, t, r, n) {
  if (r === "m")
    throw new TypeError("Private method is not writable");
  if (r === "a" && !n)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? s !== e || !n : !e.has(s))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return r === "a" ? n.call(s, t) : n ? n.value = t : e.set(s, t), t;
}
i(u, "__classPrivateFieldSet");
function a(s, e, t, r) {
  if (t === "a" && !r)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? s !== e || !r : !e.has(s))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? r : t === "a" ? r.call(s) : r ? r.value : e.get(s);
}
i(a, "__classPrivateFieldGet");

// node_modules/@anthropic-ai/sdk/internal/utils/uuid.mjs
var Mt = /* @__PURE__ */ i(function() {
  let { crypto: s } = globalThis;
  if (s?.randomUUID)
    return Mt = s.randomUUID.bind(s), s.randomUUID();
  let e = new Uint8Array(1), t = s ? () => s.getRandomValues(e)[0] : () => Math.random() * 255 & 255;
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (r) => (+r ^ t() & 15 >> +r / 4).toString(16));
}, "uuid4");

// node_modules/@anthropic-ai/sdk/internal/errors.mjs
function q(s) {
  return typeof s == "object" && s !== null && // Spec-compliant fetch implementations
  ("name" in s && s.name === "AbortError" || // Expo fetch
  "message" in s && String(s.message).includes("FetchRequestCanceledException"));
}
i(q, "isAbortError");
var Re = /* @__PURE__ */ i((s) => {
  if (s instanceof Error)
    return s;
  if (typeof s == "object" && s !== null) {
    try {
      if (Object.prototype.toString.call(s) === "[object Error]") {
        let e = new Error(s.message, s.cause ? { cause: s.cause } : {});
        return s.stack && (e.stack = s.stack), s.cause && !e.cause && (e.cause = s.cause), s.name && (e.name = s.name), e;
      }
    } catch {
    }
    try {
      return new Error(JSON.stringify(s));
    } catch {
    }
  }
  return new Error(s);
}, "castToError");

// node_modules/@anthropic-ai/sdk/core/error.mjs
var d = class extends Error {
  static {
    i(this, "AnthropicError");
  }
}, S = class s extends d {
  static {
    i(this, "APIError");
  }
  constructor(e, t, r, n) {
    super(`${s.makeMessage(e, t, r)}`), this.status = e, this.headers = n, this.requestID = n?.get("request-id"), this.error = t;
  }
  static makeMessage(e, t, r) {
    let n = t?.message ? typeof t.message == "string" ? t.message : JSON.stringify(t.message) : t ? JSON.stringify(t) : r;
    return e && n ? `${e} ${n}` : e ? `${e} status code (no body)` : n || "(no status code or body)";
  }
  static generate(e, t, r, n) {
    if (!e || !n)
      return new D({ message: r, cause: Re(t) });
    let o = t;
    return e === 400 ? new ie(e, o, r, n) : e === 401 ? new ae(e, o, r, n) : e === 403 ? new ce(e, o, r, n) : e === 404 ? new le(e, o, r, n) : e === 409 ? new ue(e, o, r, n) : e === 422 ? new he(e, o, r, n) : e === 429 ? new de(e, o, r, n) : e >= 500 ? new fe(e, o, r, n) : new s(e, o, r, n);
  }
}, P = class extends S {
  static {
    i(this, "APIUserAbortError");
  }
  constructor({ message: e } = {}) {
    super(void 0, void 0, e || "Request was aborted.", void 0);
  }
}, D = class extends S {
  static {
    i(this, "APIConnectionError");
  }
  constructor({ message: e, cause: t }) {
    super(void 0, void 0, e || "Connection error.", void 0), t && (this.cause = t);
  }
}, oe = class extends D {
  static {
    i(this, "APIConnectionTimeoutError");
  }
  constructor({ message: e } = {}) {
    super({ message: e ?? "Request timed out." });
  }
}, ie = class extends S {
  static {
    i(this, "BadRequestError");
  }
}, ae = class extends S {
  static {
    i(this, "AuthenticationError");
  }
}, ce = class extends S {
  static {
    i(this, "PermissionDeniedError");
  }
}, le = class extends S {
  static {
    i(this, "NotFoundError");
  }
}, ue = class extends S {
  static {
    i(this, "ConflictError");
  }
}, he = class extends S {
  static {
    i(this, "UnprocessableEntityError");
  }
}, de = class extends S {
  static {
    i(this, "RateLimitError");
  }
}, fe = class extends S {
  static {
    i(this, "InternalServerError");
  }
};

// node_modules/@anthropic-ai/sdk/internal/utils/values.mjs
var Ur = /^[a-z][a-z0-9+.-]*:/i, er = /* @__PURE__ */ i((s) => Ur.test(s), "isAbsoluteURL"), Rt = /* @__PURE__ */ i((s) => (Rt = Array.isArray, Rt(s)), "isArray"), Et = Rt;
function ze(s) {
  return typeof s != "object" ? {} : s ?? {};
}
i(ze, "maybeObj");
function tr(s) {
  if (!s)
    return !0;
  for (let e in s)
    return !1;
  return !0;
}
i(tr, "isEmptyObj");
function rr(s, e) {
  return Object.prototype.hasOwnProperty.call(s, e);
}
i(rr, "hasOwn");
var sr = /* @__PURE__ */ i((s, e) => {
  if (typeof e != "number" || !Number.isInteger(e))
    throw new d(`${s} must be an integer`);
  if (e < 0)
    throw new d(`${s} must be a positive integer`);
  return e;
}, "validatePositiveInteger");
var Qe = /* @__PURE__ */ i((s) => {
  try {
    return JSON.parse(s);
  } catch {
    return;
  }
}, "safeJSON");

// node_modules/@anthropic-ai/sdk/internal/utils/sleep.mjs
var nr = /* @__PURE__ */ i((s) => new Promise((e) => setTimeout(e, s)), "sleep");

// node_modules/@anthropic-ai/sdk/version.mjs
var H = "0.71.2";

// node_modules/@anthropic-ai/sdk/internal/detect-platform.mjs
var cr = /* @__PURE__ */ i(() => (
  // @ts-ignore
  typeof window < "u" && // @ts-ignore
  typeof window.document < "u" && // @ts-ignore
  typeof navigator < "u"
), "isRunningInBrowser");
function Cr() {
  return typeof Deno < "u" && Deno.build != null ? "deno" : typeof EdgeRuntime < "u" ? "edge" : Object.prototype.toString.call(typeof globalThis.process < "u" ? globalThis.process : 0) === "[object process]" ? "node" : "unknown";
}
i(Cr, "getDetectedPlatform");
var Wr = /* @__PURE__ */ i(() => {
  let s = Cr();
  if (s === "deno")
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": H,
      "X-Stainless-OS": ir(Deno.build.os),
      "X-Stainless-Arch": or(Deno.build.arch),
      "X-Stainless-Runtime": "deno",
      "X-Stainless-Runtime-Version": typeof Deno.version == "string" ? Deno.version : Deno.version?.deno ?? "unknown"
    };
  if (typeof EdgeRuntime < "u")
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": H,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": `other:${EdgeRuntime}`,
      "X-Stainless-Runtime": "edge",
      "X-Stainless-Runtime-Version": globalThis.process.version
    };
  if (s === "node")
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": H,
      "X-Stainless-OS": ir(globalThis.process.platform ?? "unknown"),
      "X-Stainless-Arch": or(globalThis.process.arch ?? "unknown"),
      "X-Stainless-Runtime": "node",
      "X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
    };
  let e = Dr();
  return e ? {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": H,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": `browser:${e.browser}`,
    "X-Stainless-Runtime-Version": e.version
  } : {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": H,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": "unknown",
    "X-Stainless-Runtime-Version": "unknown"
  };
}, "getPlatformProperties");
function Dr() {
  if (typeof navigator > "u" || !navigator)
    return null;
  let s = [
    { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "chrome", pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "firefox", pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "safari", pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ }
  ];
  for (let { key: e, pattern: t } of s) {
    let r = t.exec(navigator.userAgent);
    if (r) {
      let n = r[1] || 0, o = r[2] || 0, c = r[3] || 0;
      return { browser: e, version: `${n}.${o}.${c}` };
    }
  }
  return null;
}
i(Dr, "getBrowserInfo");
var or = /* @__PURE__ */ i((s) => s === "x32" ? "x32" : s === "x86_64" || s === "x64" ? "x64" : s === "arm" ? "arm" : s === "aarch64" || s === "arm64" ? "arm64" : s ? `other:${s}` : "unknown", "normalizeArch"), ir = /* @__PURE__ */ i((s) => (s = s.toLowerCase(), s.includes("ios") ? "iOS" : s === "android" ? "Android" : s === "darwin" ? "MacOS" : s === "win32" ? "Windows" : s === "freebsd" ? "FreeBSD" : s === "openbsd" ? "OpenBSD" : s === "linux" ? "Linux" : s ? `Other:${s}` : "Unknown"), "normalizePlatform"), ar, lr = /* @__PURE__ */ i(() => ar ?? (ar = Wr()), "getPlatformHeaders");

// node_modules/@anthropic-ai/sdk/internal/shims.mjs
function ur() {
  if (typeof fetch < "u")
    return fetch;
  throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
}
i(ur, "getDefaultFetch");
function At(...s) {
  let e = globalThis.ReadableStream;
  if (typeof e > "u")
    throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
  return new e(...s);
}
i(At, "makeReadableStream");
function Ye(s) {
  let e = Symbol.asyncIterator in s ? s[Symbol.asyncIterator]() : s[Symbol.iterator]();
  return At({
    start() {
    },
    async pull(t) {
      let { done: r, value: n } = await e.next();
      r ? t.close() : t.enqueue(n);
    },
    async cancel() {
      await e.return?.();
    }
  });
}
i(Ye, "ReadableStreamFrom");
function Ee(s) {
  if (s[Symbol.asyncIterator])
    return s;
  let e = s.getReader();
  return {
    async next() {
      try {
        let t = await e.read();
        return t?.done && e.releaseLock(), t;
      } catch (t) {
        throw e.releaseLock(), t;
      }
    },
    async return() {
      let t = e.cancel();
      return e.releaseLock(), await t, { done: !0, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
i(Ee, "ReadableStreamToAsyncIterable");
async function hr(s) {
  if (s === null || typeof s != "object")
    return;
  if (s[Symbol.asyncIterator]) {
    await s[Symbol.asyncIterator]().return?.();
    return;
  }
  let e = s.getReader(), t = e.cancel();
  e.releaseLock(), await t;
}
i(hr, "CancelReadableStream");

// node_modules/@anthropic-ai/sdk/internal/request-options.mjs
var dr = /* @__PURE__ */ i(({ headers: s, body: e }) => ({
  bodyHeaders: {
    "content-type": "application/json"
  },
  body: JSON.stringify(e)
}), "FallbackEncoder");

// node_modules/@anthropic-ai/sdk/internal/utils/bytes.mjs
function mr(s) {
  let e = 0;
  for (let n of s)
    e += n.length;
  let t = new Uint8Array(e), r = 0;
  for (let n of s)
    t.set(n, r), r += n.length;
  return t;
}
i(mr, "concatBytes");
var fr;
function Ae(s) {
  let e;
  return (fr ?? (e = new globalThis.TextEncoder(), fr = e.encode.bind(e)))(s);
}
i(Ae, "encodeUTF8");
var pr;
function Tt(s) {
  let e;
  return (pr ?? (e = new globalThis.TextDecoder(), pr = e.decode.bind(e)))(s);
}
i(Tt, "decodeUTF8");

// node_modules/@anthropic-ai/sdk/internal/decoders/line.mjs
var M, R, L = class {
  static {
    i(this, "LineDecoder");
  }
  constructor() {
    M.set(this, void 0), R.set(this, void 0), u(this, M, new Uint8Array(), "f"), u(this, R, null, "f");
  }
  decode(e) {
    if (e == null)
      return [];
    let t = e instanceof ArrayBuffer ? new Uint8Array(e) : typeof e == "string" ? Ae(e) : e;
    u(this, M, mr([a(this, M, "f"), t]), "f");
    let r = [], n;
    for (; (n = Xr(a(this, M, "f"), a(this, R, "f"))) != null; ) {
      if (n.carriage && a(this, R, "f") == null) {
        u(this, R, n.index, "f");
        continue;
      }
      if (a(this, R, "f") != null && (n.index !== a(this, R, "f") + 1 || n.carriage)) {
        r.push(Tt(a(this, M, "f").subarray(0, a(this, R, "f") - 1))), u(this, M, a(this, M, "f").subarray(a(this, R, "f")), "f"), u(this, R, null, "f");
        continue;
      }
      let o = a(this, R, "f") !== null ? n.preceding - 1 : n.preceding, c = Tt(a(this, M, "f").subarray(0, o));
      r.push(c), u(this, M, a(this, M, "f").subarray(n.index), "f"), u(this, R, null, "f");
    }
    return r;
  }
  flush() {
    return a(this, M, "f").length ? this.decode(`
`) : [];
  }
};
M = /* @__PURE__ */ new WeakMap(), R = /* @__PURE__ */ new WeakMap();
L.NEWLINE_CHARS = /* @__PURE__ */ new Set([`
`, "\r"]);
L.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
function Xr(s, e) {
  for (let n = e ?? 0; n < s.length; n++) {
    if (s[n] === 10)
      return { preceding: n, index: n + 1, carriage: !1 };
    if (s[n] === 13)
      return { preceding: n, index: n + 1, carriage: !0 };
  }
  return null;
}
i(Xr, "findNewlineIndex");
function gr(s) {
  for (let r = 0; r < s.length - 1; r++) {
    if (s[r] === 10 && s[r + 1] === 10 || s[r] === 13 && s[r + 1] === 13)
      return r + 2;
    if (s[r] === 13 && s[r + 1] === 10 && r + 3 < s.length && s[r + 2] === 13 && s[r + 3] === 10)
      return r + 4;
  }
  return -1;
}
i(gr, "findDoubleNewlineIndex");

// node_modules/@anthropic-ai/sdk/internal/utils/log.mjs
var et = {
  off: 0,
  error: 200,
  warn: 300,
  info: 400,
  debug: 500
}, It = /* @__PURE__ */ i((s, e, t) => {
  if (s) {
    if (rr(et, s))
      return s;
    k(t).warn(`${e} was set to ${JSON.stringify(s)}, expected one of ${JSON.stringify(Object.keys(et))}`);
  }
}, "parseLogLevel");
function Te() {
}
i(Te, "noop");
function Ze(s, e, t) {
  return !e || et[s] > et[t] ? Te : e[s].bind(e);
}
i(Ze, "makeLogFn");
var Vr = {
  error: Te,
  warn: Te,
  info: Te,
  debug: Te
}, _r = /* @__PURE__ */ new WeakMap();
function k(s) {
  let e = s.logger, t = s.logLevel ?? "off";
  if (!e)
    return Vr;
  let r = _r.get(e);
  if (r && r[0] === t)
    return r[1];
  let n = {
    error: Ze("error", e, t),
    warn: Ze("warn", e, t),
    info: Ze("info", e, t),
    debug: Ze("debug", e, t)
  };
  return _r.set(e, [t, n]), n;
}
i(k, "loggerFor");
var j = /* @__PURE__ */ i((s) => (s.options && (s.options = { ...s.options }, delete s.options.headers), s.headers && (s.headers = Object.fromEntries((s.headers instanceof Headers ? [...s.headers] : Object.entries(s.headers)).map(([e, t]) => [
  e,
  e.toLowerCase() === "x-api-key" || e.toLowerCase() === "authorization" || e.toLowerCase() === "cookie" || e.toLowerCase() === "set-cookie" ? "***" : t
]))), "retryOfRequestLogID" in s && (s.retryOfRequestLogID && (s.retryOf = s.retryOfRequestLogID), delete s.retryOfRequestLogID), s), "formatRequestDetails");

// node_modules/@anthropic-ai/sdk/core/streaming.mjs
var Ie, F = class s {
  static {
    i(this, "Stream");
  }
  constructor(e, t, r) {
    this.iterator = e, Ie.set(this, void 0), this.controller = t, u(this, Ie, r, "f");
  }
  static fromSSEResponse(e, t, r) {
    let n = !1, o = r ? k(r) : console;
    async function* c() {
      if (n)
        throw new d("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      n = !0;
      let l = !1;
      try {
        for await (let h of Kr(e, t)) {
          if (h.event === "completion")
            try {
              yield JSON.parse(h.data);
            } catch (p) {
              throw o.error("Could not parse message into JSON:", h.data), o.error("From chunk:", h.raw), p;
            }
          if (h.event === "message_start" || h.event === "message_delta" || h.event === "message_stop" || h.event === "content_block_start" || h.event === "content_block_delta" || h.event === "content_block_stop")
            try {
              yield JSON.parse(h.data);
            } catch (p) {
              throw o.error("Could not parse message into JSON:", h.data), o.error("From chunk:", h.raw), p;
            }
          if (h.event !== "ping" && h.event === "error")
            throw new S(void 0, Qe(h.data) ?? h.data, void 0, e.headers);
        }
        l = !0;
      } catch (h) {
        if (q(h))
          return;
        throw h;
      } finally {
        l || t.abort();
      }
    }
    return i(c, "iterator"), new s(c, t, r);
  }
  /**
   * Generates a Stream from a newline-separated ReadableStream
   * where each item is a JSON value.
   */
  static fromReadableStream(e, t, r) {
    let n = !1;
    async function* o() {
      let l = new L(), h = Ee(e);
      for await (let p of h)
        for (let y of l.decode(p))
          yield y;
      for (let p of l.flush())
        yield p;
    }
    i(o, "iterLines");
    async function* c() {
      if (n)
        throw new d("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      n = !0;
      let l = !1;
      try {
        for await (let h of o())
          l || h && (yield JSON.parse(h));
        l = !0;
      } catch (h) {
        if (q(h))
          return;
        throw h;
      } finally {
        l || t.abort();
      }
    }
    return i(c, "iterator"), new s(c, t, r);
  }
  [(Ie = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    return this.iterator();
  }
  /**
   * Splits the stream into two streams which can be
   * independently read from at different speeds.
   */
  tee() {
    let e = [], t = [], r = this.iterator(), n = /* @__PURE__ */ i((o) => ({
      next: /* @__PURE__ */ i(() => {
        if (o.length === 0) {
          let c = r.next();
          e.push(c), t.push(c);
        }
        return o.shift();
      }, "next")
    }), "teeIterator");
    return [
      new s(() => n(e), this.controller, a(this, Ie, "f")),
      new s(() => n(t), this.controller, a(this, Ie, "f"))
    ];
  }
  /**
   * Converts this stream to a newline-separated ReadableStream of
   * JSON stringified values in the stream
   * which can be turned back into a Stream with `Stream.fromReadableStream()`.
   */
  toReadableStream() {
    let e = this, t;
    return At({
      async start() {
        t = e[Symbol.asyncIterator]();
      },
      async pull(r) {
        try {
          let { value: n, done: o } = await t.next();
          if (o)
            return r.close();
          let c = Ae(JSON.stringify(n) + `
`);
          r.enqueue(c);
        } catch (n) {
          r.error(n);
        }
      },
      async cancel() {
        await t.return?.();
      }
    });
  }
};
async function* Kr(s, e) {
  if (!s.body)
    throw e.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative" ? new d("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api") : new d("Attempted to iterate over a response with no body");
  let t = new Ot(), r = new L(), n = Ee(s.body);
  for await (let o of Gr(n))
    for (let c of r.decode(o)) {
      let l = t.decode(c);
      l && (yield l);
    }
  for (let o of r.flush()) {
    let c = t.decode(o);
    c && (yield c);
  }
}
i(Kr, "_iterSSEMessages");
async function* Gr(s) {
  let e = new Uint8Array();
  for await (let t of s) {
    if (t == null)
      continue;
    let r = t instanceof ArrayBuffer ? new Uint8Array(t) : typeof t == "string" ? Ae(t) : t, n = new Uint8Array(e.length + r.length);
    n.set(e), n.set(r, e.length), e = n;
    let o;
    for (; (o = gr(e)) !== -1; )
      yield e.slice(0, o), e = e.slice(o);
  }
  e.length > 0 && (yield e);
}
i(Gr, "iterSSEChunks");
var Ot = class {
  static {
    i(this, "SSEDecoder");
  }
  constructor() {
    this.event = null, this.data = [], this.chunks = [];
  }
  decode(e) {
    if (e.endsWith("\r") && (e = e.substring(0, e.length - 1)), !e) {
      if (!this.event && !this.data.length)
        return null;
      let o = {
        event: this.event,
        data: this.data.join(`
`),
        raw: this.chunks
      };
      return this.event = null, this.data = [], this.chunks = [], o;
    }
    if (this.chunks.push(e), e.startsWith(":"))
      return null;
    let [t, r, n] = zr(e, ":");
    return n.startsWith(" ") && (n = n.substring(1)), t === "event" ? this.event = n : t === "data" && this.data.push(n), null;
  }
};
function zr(s, e) {
  let t = s.indexOf(e);
  return t !== -1 ? [s.substring(0, t), e, s.substring(t + e.length)] : [s, "", ""];
}
i(zr, "partition");

// node_modules/@anthropic-ai/sdk/internal/parse.mjs
async function tt(s, e) {
  let { response: t, requestLogID: r, retryOfRequestLogID: n, startTime: o } = e, c = await (async () => {
    if (e.options.stream)
      return k(s).debug("response", t.status, t.url, t.headers, t.body), e.options.__streamClass ? e.options.__streamClass.fromSSEResponse(t, e.controller) : F.fromSSEResponse(t, e.controller);
    if (t.status === 204)
      return null;
    if (e.options.__binaryResponse)
      return t;
    let h = t.headers.get("content-type")?.split(";")[0]?.trim();
    if (h?.includes("application/json") || h?.endsWith("+json")) {
      let w = await t.json();
      return Bt(w, t);
    }
    return await t.text();
  })();
  return k(s).debug(`[${r}] response parsed`, j({
    retryOfRequestLogID: n,
    url: t.url,
    status: t.status,
    body: c,
    durationMs: Date.now() - o
  })), c;
}
i(tt, "defaultParseResponse");
function Bt(s, e) {
  return !s || typeof s != "object" || Array.isArray(s) ? s : Object.defineProperty(s, "_request_id", {
    value: e.headers.get("request-id"),
    enumerable: !1
  });
}
i(Bt, "addRequestID");

// node_modules/@anthropic-ai/sdk/core/api-promise.mjs
var Oe, Q = class s extends Promise {
  static {
    i(this, "APIPromise");
  }
  constructor(e, t, r = tt) {
    super((n) => {
      n(null);
    }), this.responsePromise = t, this.parseResponse = r, Oe.set(this, void 0), u(this, Oe, e, "f");
  }
  _thenUnwrap(e) {
    return new s(a(this, Oe, "f"), this.responsePromise, async (t, r) => Bt(e(await this.parseResponse(t, r), r), r.response));
  }
  /**
   * Gets the raw `Response` instance instead of parsing the response
   * data.
   *
   * If you want to parse the response body but still get the `Response`
   * instance, you can use {@link withResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
   * to your `tsconfig.json`.
   */
  asResponse() {
    return this.responsePromise.then((e) => e.response);
  }
  /**
   * Gets the parsed response data, the raw `Response` instance and the ID of the request,
   * returned via the `request-id` header which is useful for debugging requests and resporting
   * issues to Anthropic.
   *
   * If you just want to get the raw `Response` instance without parsing it,
   * you can use {@link asResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
   * to your `tsconfig.json`.
   */
  async withResponse() {
    let [e, t] = await Promise.all([this.parse(), this.asResponse()]);
    return { data: e, response: t, request_id: t.headers.get("request-id") };
  }
  parse() {
    return this.parsedPromise || (this.parsedPromise = this.responsePromise.then((e) => this.parseResponse(a(this, Oe, "f"), e))), this.parsedPromise;
  }
  then(e, t) {
    return this.parse().then(e, t);
  }
  catch(e) {
    return this.parse().catch(e);
  }
  finally(e) {
    return this.parse().finally(e);
  }
};
Oe = /* @__PURE__ */ new WeakMap();

// node_modules/@anthropic-ai/sdk/core/pagination.mjs
var rt, st = class {
  static {
    i(this, "AbstractPage");
  }
  constructor(e, t, r, n) {
    rt.set(this, void 0), u(this, rt, e, "f"), this.options = n, this.response = t, this.body = r;
  }
  hasNextPage() {
    return this.getPaginatedItems().length ? this.nextPageRequestOptions() != null : !1;
  }
  async getNextPage() {
    let e = this.nextPageRequestOptions();
    if (!e)
      throw new d("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
    return await a(this, rt, "f").requestAPIList(this.constructor, e);
  }
  async *iterPages() {
    let e = this;
    for (yield e; e.hasNextPage(); )
      e = await e.getNextPage(), yield e;
  }
  async *[(rt = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    for await (let e of this.iterPages())
      for (let t of e.getPaginatedItems())
        yield t;
  }
}, Be = class extends Q {
  static {
    i(this, "PagePromise");
  }
  constructor(e, t, r) {
    super(e, t, async (n, o) => new r(n, o.response, await tt(n, o), o.options));
  }
  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  async *[Symbol.asyncIterator]() {
    let e = await this;
    for await (let t of e)
      yield t;
  }
}, A = class extends st {
  static {
    i(this, "Page");
  }
  constructor(e, t, r, n) {
    super(e, t, r, n), this.data = r.data || [], this.has_more = r.has_more || !1, this.first_id = r.first_id || null, this.last_id = r.last_id || null;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  hasNextPage() {
    return this.has_more === !1 ? !1 : super.hasNextPage();
  }
  nextPageRequestOptions() {
    if (this.options.query?.before_id) {
      let t = this.first_id;
      return t ? {
        ...this.options,
        query: {
          ...ze(this.options.query),
          before_id: t
        }
      } : null;
    }
    let e = this.last_id;
    return e ? {
      ...this.options,
      query: {
        ...ze(this.options.query),
        after_id: e
      }
    } : null;
  }
};
var pe = class extends st {
  static {
    i(this, "PageCursor");
  }
  constructor(e, t, r, n) {
    super(e, t, r, n), this.data = r.data || [], this.has_more = r.has_more || !1, this.next_page = r.next_page || null;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  hasNextPage() {
    return this.has_more === !1 ? !1 : super.hasNextPage();
  }
  nextPageRequestOptions() {
    let e = this.next_page;
    return e ? {
      ...this.options,
      query: {
        ...ze(this.options.query),
        page: e
      }
    } : null;
  }
};

// node_modules/@anthropic-ai/sdk/internal/uploads.mjs
var Nt = /* @__PURE__ */ i(() => {
  if (typeof File > "u") {
    let { process: s } = globalThis, e = typeof s?.versions?.node == "string" && parseInt(s.versions.node.split(".")) < 20;
    throw new Error("`File` is not defined as a global, which is required for file uploads." + (e ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
  }
}, "checkFileSupport");
function Y(s, e, t) {
  return Nt(), new File(s, e ?? "unknown_file", t);
}
i(Y, "makeFile");
function ve(s) {
  return (typeof s == "object" && s !== null && ("name" in s && s.name && String(s.name) || "url" in s && s.url && String(s.url) || "filename" in s && s.filename && String(s.filename) || "path" in s && s.path && String(s.path)) || "").split(/[\\/]/).pop() || void 0;
}
i(ve, "getName");
var Ft = /* @__PURE__ */ i((s) => s != null && typeof s == "object" && typeof s[Symbol.asyncIterator] == "function", "isAsyncIterable");
var me = /* @__PURE__ */ i(async (s, e) => ({ ...s, body: await Zr(s.body, e) }), "multipartFormRequestOptions"), yr = /* @__PURE__ */ new WeakMap();
function Yr(s) {
  let e = typeof s == "function" ? s : s.fetch, t = yr.get(e);
  if (t)
    return t;
  let r = (async () => {
    try {
      let n = "Response" in e ? e.Response : (await e("data:,")).constructor, o = new FormData();
      return o.toString() !== await new n(o).text();
    } catch {
      return !0;
    }
  })();
  return yr.set(e, r), r;
}
i(Yr, "supportsFormData");
var Zr = /* @__PURE__ */ i(async (s, e) => {
  if (!await Yr(e))
    throw new TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
  let t = new FormData();
  return await Promise.all(Object.entries(s || {}).map(([r, n]) => vt(t, r, n))), t;
}, "createForm"), es = /* @__PURE__ */ i((s) => s instanceof Blob && "name" in s, "isNamedBlob");
var vt = /* @__PURE__ */ i(async (s, e, t) => {
  if (t !== void 0) {
    if (t == null)
      throw new TypeError(`Received null for "${e}"; to pass null in FormData, you must use the string 'null'`);
    if (typeof t == "string" || typeof t == "number" || typeof t == "boolean")
      s.append(e, String(t));
    else if (t instanceof Response) {
      let r = {}, n = t.headers.get("Content-Type");
      n && (r = { type: n }), s.append(e, Y([await t.blob()], ve(t), r));
    } else if (Ft(t))
      s.append(e, Y([await new Response(Ye(t)).blob()], ve(t)));
    else if (es(t))
      s.append(e, Y([t], ve(t), { type: t.type }));
    else if (Array.isArray(t))
      await Promise.all(t.map((r) => vt(s, e + "[]", r)));
    else if (typeof t == "object")
      await Promise.all(Object.entries(t).map(([r, n]) => vt(s, `${e}[${r}]`, n)));
    else
      throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${t} instead`);
  }
}, "addFormValue");

// node_modules/@anthropic-ai/sdk/internal/to-file.mjs
var br = /* @__PURE__ */ i((s) => s != null && typeof s == "object" && typeof s.size == "number" && typeof s.type == "string" && typeof s.text == "function" && typeof s.slice == "function" && typeof s.arrayBuffer == "function", "isBlobLike"), ts = /* @__PURE__ */ i((s) => s != null && typeof s == "object" && typeof s.name == "string" && typeof s.lastModified == "number" && br(s), "isFileLike"), rs = /* @__PURE__ */ i((s) => s != null && typeof s == "object" && typeof s.url == "string" && typeof s.blob == "function", "isResponseLike");
async function nt(s, e, t) {
  if (Nt(), s = await s, e || (e = ve(s)), ts(s))
    return s instanceof File && e == null && t == null ? s : Y([await s.arrayBuffer()], e ?? s.name, {
      type: s.type,
      lastModified: s.lastModified,
      ...t
    });
  if (rs(s)) {
    let n = await s.blob();
    return e || (e = new URL(s.url).pathname.split(/[\\/]/).pop()), Y(await $t(n), e, t);
  }
  let r = await $t(s);
  if (!t?.type) {
    let n = r.find((o) => typeof o == "object" && "type" in o && o.type);
    typeof n == "string" && (t = { ...t, type: n });
  }
  return Y(r, e, t);
}
i(nt, "toFile");
async function $t(s) {
  let e = [];
  if (typeof s == "string" || ArrayBuffer.isView(s) || // includes Uint8Array, Buffer, etc.
  s instanceof ArrayBuffer)
    e.push(s);
  else if (br(s))
    e.push(s instanceof Blob ? s : await s.arrayBuffer());
  else if (Ft(s))
    for await (let t of s)
      e.push(...await $t(t));
  else {
    let t = s?.constructor?.name;
    throw new Error(`Unexpected data type: ${typeof s}${t ? `; constructor: ${t}` : ""}${ss(s)}`);
  }
  return e;
}
i($t, "getBytes");
function ss(s) {
  return typeof s != "object" || s === null ? "" : `; props: [${Object.getOwnPropertyNames(s).map((t) => `"${t}"`).join(", ")}]`;
}
i(ss, "propsForError");

// node_modules/@anthropic-ai/sdk/core/resource.mjs
var g = class {
  static {
    i(this, "APIResource");
  }
  constructor(e) {
    this._client = e;
  }
};

// node_modules/@anthropic-ai/sdk/internal/headers.mjs
var wr = Symbol.for("brand.privateNullableHeaders");
function* os(s) {
  if (!s)
    return;
  if (wr in s) {
    let { values: r, nulls: n } = s;
    yield* r.entries();
    for (let o of n)
      yield [o, null];
    return;
  }
  let e = !1, t;
  s instanceof Headers ? t = s.entries() : Et(s) ? t = s : (e = !0, t = Object.entries(s ?? {}));
  for (let r of t) {
    let n = r[0];
    if (typeof n != "string")
      throw new TypeError("expected header name to be a string");
    let o = Et(r[1]) ? r[1] : [r[1]], c = !1;
    for (let l of o)
      l !== void 0 && (e && !c && (c = !0, yield [n, null]), yield [n, l]);
  }
}
i(os, "iterateHeaders");
var f = /* @__PURE__ */ i((s) => {
  let e = new Headers(), t = /* @__PURE__ */ new Set();
  for (let r of s) {
    let n = /* @__PURE__ */ new Set();
    for (let [o, c] of os(r)) {
      let l = o.toLowerCase();
      n.has(l) || (e.delete(o), n.add(l)), c === null ? (e.delete(o), t.add(l)) : (e.append(o, c), t.delete(l));
    }
  }
  return { [wr]: !0, values: e, nulls: t };
}, "buildHeaders");

// node_modules/@anthropic-ai/sdk/internal/utils/path.mjs
function Sr(s) {
  return s.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
i(Sr, "encodeURIPath");
var xr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null)), is = /* @__PURE__ */ i((s = Sr) => /* @__PURE__ */ i(function(t, ...r) {
  if (t.length === 1)
    return t[0];
  let n = !1, o = [], c = t.reduce((y, w, O) => {
    /[?#]/.test(w) && (n = !0);
    let m = r[O], B = (n ? encodeURIComponent : s)("" + m);
    return O !== r.length && (m == null || typeof m == "object" && // handle values from other realms
    m.toString === Object.getPrototypeOf(Object.getPrototypeOf(m.hasOwnProperty ?? xr) ?? xr)?.toString) && (B = m + "", o.push({
      start: y.length + w.length,
      length: B.length,
      error: `Value of type ${Object.prototype.toString.call(m).slice(8, -1)} is not a valid path parameter`
    })), y + w + (O === r.length ? "" : B);
  }, ""), l = c.split(/[?#]/, 1)[0], h = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi, p;
  for (; (p = h.exec(l)) !== null; )
    o.push({
      start: p.index,
      length: p[0].length,
      error: `Value "${p[0]}" can't be safely passed as a path parameter`
    });
  if (o.sort((y, w) => y.start - w.start), o.length > 0) {
    let y = 0, w = o.reduce((O, m) => {
      let B = " ".repeat(m.start - y), kt = "^".repeat(m.length);
      return y = m.start + m.length, O + B + kt;
    }, "");
    throw new d(`Path parameters result in path with invalid segments:
${o.map((O) => O.error).join(`
`)}
${c}
${w}`);
  }
  return c;
}, "path"), "createPathTagFunction"), _ = /* @__PURE__ */ is(Sr);

// node_modules/@anthropic-ai/sdk/resources/beta/files.mjs
var ge = class extends g {
  static {
    i(this, "Files");
  }
  /**
   * List Files
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const fileMetadata of client.beta.files.list()) {
   *   // ...
   * }
   * ```
   */
  list(e = {}, t) {
    let { betas: r, ...n } = e ?? {};
    return this._client.getAPIList("/v1/files", A, {
      query: n,
      ...t,
      headers: f([
        { "anthropic-beta": [...r ?? [], "files-api-2025-04-14"].toString() },
        t?.headers
      ])
    });
  }
  /**
   * Delete File
   *
   * @example
   * ```ts
   * const deletedFile = await client.beta.files.delete(
   *   'file_id',
   * );
   * ```
   */
  delete(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.delete(_`/v1/files/${e}`, {
      ...r,
      headers: f([
        { "anthropic-beta": [...n ?? [], "files-api-2025-04-14"].toString() },
        r?.headers
      ])
    });
  }
  /**
   * Download File
   *
   * @example
   * ```ts
   * const response = await client.beta.files.download(
   *   'file_id',
   * );
   *
   * const content = await response.blob();
   * console.log(content);
   * ```
   */
  download(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.get(_`/v1/files/${e}/content`, {
      ...r,
      headers: f([
        {
          "anthropic-beta": [...n ?? [], "files-api-2025-04-14"].toString(),
          Accept: "application/binary"
        },
        r?.headers
      ]),
      __binaryResponse: !0
    });
  }
  /**
   * Get File Metadata
   *
   * @example
   * ```ts
   * const fileMetadata =
   *   await client.beta.files.retrieveMetadata('file_id');
   * ```
   */
  retrieveMetadata(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.get(_`/v1/files/${e}`, {
      ...r,
      headers: f([
        { "anthropic-beta": [...n ?? [], "files-api-2025-04-14"].toString() },
        r?.headers
      ])
    });
  }
  /**
   * Upload File
   *
   * @example
   * ```ts
   * const fileMetadata = await client.beta.files.upload({
   *   file: fs.createReadStream('path/to/file'),
   * });
   * ```
   */
  upload(e, t) {
    let { betas: r, ...n } = e;
    return this._client.post("/v1/files", me({
      body: n,
      ...t,
      headers: f([
        { "anthropic-beta": [...r ?? [], "files-api-2025-04-14"].toString() },
        t?.headers
      ])
    }, this._client));
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/models.mjs
var _e = class extends g {
  static {
    i(this, "Models");
  }
  /**
   * Get a specific model.
   *
   * The Models API response can be used to determine information about a specific
   * model or resolve a model alias to a model ID.
   *
   * @example
   * ```ts
   * const betaModelInfo = await client.beta.models.retrieve(
   *   'model_id',
   * );
   * ```
   */
  retrieve(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.get(_`/v1/models/${e}?beta=true`, {
      ...r,
      headers: f([
        { ...n?.toString() != null ? { "anthropic-beta": n?.toString() } : void 0 },
        r?.headers
      ])
    });
  }
  /**
   * List available models.
   *
   * The Models API response can be used to determine which models are available for
   * use in the API. More recently released models are listed first.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaModelInfo of client.beta.models.list()) {
   *   // ...
   * }
   * ```
   */
  list(e = {}, t) {
    let { betas: r, ...n } = e ?? {};
    return this._client.getAPIList("/v1/models?beta=true", A, {
      query: n,
      ...t,
      headers: f([
        { ...r?.toString() != null ? { "anthropic-beta": r?.toString() } : void 0 },
        t?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/internal/constants.mjs
var ot = {
  "claude-opus-4-20250514": 8192,
  "claude-opus-4-0": 8192,
  "claude-4-opus-20250514": 8192,
  "anthropic.claude-opus-4-20250514-v1:0": 8192,
  "claude-opus-4@20250514": 8192,
  "claude-opus-4-1-20250805": 8192,
  "anthropic.claude-opus-4-1-20250805-v1:0": 8192,
  "claude-opus-4-1@20250805": 8192
};

// node_modules/@anthropic-ai/sdk/lib/beta-parser.mjs
function qt(s, e, t) {
  return !e || !("parse" in (e.output_format ?? {})) ? {
    ...s,
    content: s.content.map((r) => {
      if (r.type === "text") {
        let n = Object.defineProperty({ ...r }, "parsed_output", {
          value: null,
          enumerable: !1
        });
        return Object.defineProperty(n, "parsed", {
          get() {
            return t.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead."), null;
          },
          enumerable: !1
        });
      }
      return r;
    }),
    parsed_output: null
  } : Lt(s, e, t);
}
i(qt, "maybeParseBetaMessage");
function Lt(s, e, t) {
  let r = null, n = s.content.map((o) => {
    if (o.type === "text") {
      let c = ls(e, o.text);
      r === null && (r = c);
      let l = Object.defineProperty({ ...o }, "parsed_output", {
        value: c,
        enumerable: !1
      });
      return Object.defineProperty(l, "parsed", {
        get() {
          return t.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead."), c;
        },
        enumerable: !1
      });
    }
    return o;
  });
  return {
    ...s,
    content: n,
    parsed_output: r
  };
}
i(Lt, "parseBetaMessage");
function ls(s, e) {
  if (s.output_format?.type !== "json_schema")
    return null;
  try {
    return "parse" in s.output_format ? s.output_format.parse(e) : JSON.parse(e);
  } catch (t) {
    throw new d(`Failed to parse structured output: ${t}`);
  }
}
i(ls, "parseBetaOutputFormat");

// node_modules/@anthropic-ai/sdk/_vendor/partial-json-parser/parser.mjs
var us = /* @__PURE__ */ i((s) => {
  let e = 0, t = [];
  for (; e < s.length; ) {
    let r = s[e];
    if (r === "\\") {
      e++;
      continue;
    }
    if (r === "{") {
      t.push({
        type: "brace",
        value: "{"
      }), e++;
      continue;
    }
    if (r === "}") {
      t.push({
        type: "brace",
        value: "}"
      }), e++;
      continue;
    }
    if (r === "[") {
      t.push({
        type: "paren",
        value: "["
      }), e++;
      continue;
    }
    if (r === "]") {
      t.push({
        type: "paren",
        value: "]"
      }), e++;
      continue;
    }
    if (r === ":") {
      t.push({
        type: "separator",
        value: ":"
      }), e++;
      continue;
    }
    if (r === ",") {
      t.push({
        type: "delimiter",
        value: ","
      }), e++;
      continue;
    }
    if (r === '"') {
      let l = "", h = !1;
      for (r = s[++e]; r !== '"'; ) {
        if (e === s.length) {
          h = !0;
          break;
        }
        if (r === "\\") {
          if (e++, e === s.length) {
            h = !0;
            break;
          }
          l += r + s[e], r = s[++e];
        } else
          l += r, r = s[++e];
      }
      r = s[++e], h || t.push({
        type: "string",
        value: l
      });
      continue;
    }
    if (r && /\s/.test(r)) {
      e++;
      continue;
    }
    let o = /[0-9]/;
    if (r && o.test(r) || r === "-" || r === ".") {
      let l = "";
      for (r === "-" && (l += r, r = s[++e]); r && o.test(r) || r === "."; )
        l += r, r = s[++e];
      t.push({
        type: "number",
        value: l
      });
      continue;
    }
    let c = /[a-z]/i;
    if (r && c.test(r)) {
      let l = "";
      for (; r && c.test(r) && e !== s.length; )
        l += r, r = s[++e];
      if (l == "true" || l == "false" || l === "null")
        t.push({
          type: "name",
          value: l
        });
      else {
        e++;
        continue;
      }
      continue;
    }
    e++;
  }
  return t;
}, "tokenize"), ye = /* @__PURE__ */ i((s) => {
  if (s.length === 0)
    return s;
  let e = s[s.length - 1];
  switch (e.type) {
    case "separator":
      return s = s.slice(0, s.length - 1), ye(s);
      break;
    case "number":
      let t = e.value[e.value.length - 1];
      if (t === "." || t === "-")
        return s = s.slice(0, s.length - 1), ye(s);
    case "string":
      let r = s[s.length - 2];
      if (r?.type === "delimiter")
        return s = s.slice(0, s.length - 1), ye(s);
      if (r?.type === "brace" && r.value === "{")
        return s = s.slice(0, s.length - 1), ye(s);
      break;
    case "delimiter":
      return s = s.slice(0, s.length - 1), ye(s);
      break;
  }
  return s;
}, "strip"), hs = /* @__PURE__ */ i((s) => {
  let e = [];
  return s.map((t) => {
    t.type === "brace" && (t.value === "{" ? e.push("}") : e.splice(e.lastIndexOf("}"), 1)), t.type === "paren" && (t.value === "[" ? e.push("]") : e.splice(e.lastIndexOf("]"), 1));
  }), e.length > 0 && e.reverse().map((t) => {
    t === "}" ? s.push({
      type: "brace",
      value: "}"
    }) : t === "]" && s.push({
      type: "paren",
      value: "]"
    });
  }), s;
}, "unstrip"), ds = /* @__PURE__ */ i((s) => {
  let e = "";
  return s.map((t) => {
    switch (t.type) {
      case "string":
        e += '"' + t.value + '"';
        break;
      default:
        e += t.value;
        break;
    }
  }), e;
}, "generate"), it = /* @__PURE__ */ i((s) => JSON.parse(ds(hs(ye(us(s))))), "partialParse");

// node_modules/@anthropic-ai/sdk/lib/BetaMessageStream.mjs
var T, J, be, Ne, at, Fe, $e, ct, qe, U, Le, lt, ut, Z, ht, dt, je, jt, kr, ft, Ut, Ct, Wt, Pr, Mr = "__json_buf";
function Rr(s) {
  return s.type === "tool_use" || s.type === "server_tool_use" || s.type === "mcp_tool_use";
}
i(Rr, "tracksToolInput");
var pt = class s {
  static {
    i(this, "BetaMessageStream");
  }
  constructor(e, t) {
    T.add(this), this.messages = [], this.receivedMessages = [], J.set(this, void 0), be.set(this, null), this.controller = new AbortController(), Ne.set(this, void 0), at.set(this, () => {
    }), Fe.set(this, () => {
    }), $e.set(this, void 0), ct.set(this, () => {
    }), qe.set(this, () => {
    }), U.set(this, {}), Le.set(this, !1), lt.set(this, !1), ut.set(this, !1), Z.set(this, !1), ht.set(this, void 0), dt.set(this, void 0), je.set(this, void 0), ft.set(this, (r) => {
      if (u(this, lt, !0, "f"), q(r) && (r = new P()), r instanceof P)
        return u(this, ut, !0, "f"), this._emit("abort", r);
      if (r instanceof d)
        return this._emit("error", r);
      if (r instanceof Error) {
        let n = new d(r.message);
        return n.cause = r, this._emit("error", n);
      }
      return this._emit("error", new d(String(r)));
    }), u(this, Ne, new Promise((r, n) => {
      u(this, at, r, "f"), u(this, Fe, n, "f");
    }), "f"), u(this, $e, new Promise((r, n) => {
      u(this, ct, r, "f"), u(this, qe, n, "f");
    }), "f"), a(this, Ne, "f").catch(() => {
    }), a(this, $e, "f").catch(() => {
    }), u(this, be, e, "f"), u(this, je, t?.logger ?? console, "f");
  }
  get response() {
    return a(this, ht, "f");
  }
  get request_id() {
    return a(this, dt, "f");
  }
  /**
   * Returns the `MessageStream` data, the raw `Response` instance and the ID of the request,
   * returned vie the `request-id` header which is useful for debugging requests and resporting
   * issues to Anthropic.
   *
   * This is the same as the `APIPromise.withResponse()` method.
   *
   * This method will raise an error if you created the stream using `MessageStream.fromReadableStream`
   * as no `Response` is available.
   */
  async withResponse() {
    u(this, Z, !0, "f");
    let e = await a(this, Ne, "f");
    if (!e)
      throw new Error("Could not resolve a `Response` object");
    return {
      data: this,
      response: e,
      request_id: e.headers.get("request-id")
    };
  }
  /**
   * Intended for use on the frontend, consuming a stream produced with
   * `.toReadableStream()` on the backend.
   *
   * Note that messages sent to the model do not appear in `.on('message')`
   * in this context.
   */
  static fromReadableStream(e) {
    let t = new s(null);
    return t._run(() => t._fromReadableStream(e)), t;
  }
  static createMessage(e, t, r, { logger: n } = {}) {
    let o = new s(t, { logger: n });
    for (let c of t.messages)
      o._addMessageParam(c);
    return u(o, be, { ...t, stream: !0 }, "f"), o._run(() => o._createMessage(e, { ...t, stream: !0 }, { ...r, headers: { ...r?.headers, "X-Stainless-Helper-Method": "stream" } })), o;
  }
  _run(e) {
    e().then(() => {
      this._emitFinal(), this._emit("end");
    }, a(this, ft, "f"));
  }
  _addMessageParam(e) {
    this.messages.push(e);
  }
  _addMessage(e, t = !0) {
    this.receivedMessages.push(e), t && this._emit("message", e);
  }
  async _createMessage(e, t, r) {
    let n = r?.signal, o;
    n && (n.aborted && this.controller.abort(), o = this.controller.abort.bind(this.controller), n.addEventListener("abort", o));
    try {
      a(this, T, "m", Ut).call(this);
      let { response: c, data: l } = await e.create({ ...t, stream: !0 }, { ...r, signal: this.controller.signal }).withResponse();
      this._connected(c);
      for await (let h of l)
        a(this, T, "m", Ct).call(this, h);
      if (l.controller.signal?.aborted)
        throw new P();
      a(this, T, "m", Wt).call(this);
    } finally {
      n && o && n.removeEventListener("abort", o);
    }
  }
  _connected(e) {
    this.ended || (u(this, ht, e, "f"), u(this, dt, e?.headers.get("request-id"), "f"), a(this, at, "f").call(this, e), this._emit("connect"));
  }
  get ended() {
    return a(this, Le, "f");
  }
  get errored() {
    return a(this, lt, "f");
  }
  get aborted() {
    return a(this, ut, "f");
  }
  abort() {
    this.controller.abort();
  }
  /**
   * Adds the listener function to the end of the listeners array for the event.
   * No checks are made to see if the listener has already been added. Multiple calls passing
   * the same combination of event and listener will result in the listener being added, and
   * called, multiple times.
   * @returns this MessageStream, so that calls can be chained
   */
  on(e, t) {
    return (a(this, U, "f")[e] || (a(this, U, "f")[e] = [])).push({ listener: t }), this;
  }
  /**
   * Removes the specified listener from the listener array for the event.
   * off() will remove, at most, one instance of a listener from the listener array. If any single
   * listener has been added multiple times to the listener array for the specified event, then
   * off() must be called multiple times to remove each instance.
   * @returns this MessageStream, so that calls can be chained
   */
  off(e, t) {
    let r = a(this, U, "f")[e];
    if (!r)
      return this;
    let n = r.findIndex((o) => o.listener === t);
    return n >= 0 && r.splice(n, 1), this;
  }
  /**
   * Adds a one-time listener function for the event. The next time the event is triggered,
   * this listener is removed and then invoked.
   * @returns this MessageStream, so that calls can be chained
   */
  once(e, t) {
    return (a(this, U, "f")[e] || (a(this, U, "f")[e] = [])).push({ listener: t, once: !0 }), this;
  }
  /**
   * This is similar to `.once()`, but returns a Promise that resolves the next time
   * the event is triggered, instead of calling a listener callback.
   * @returns a Promise that resolves the next time given event is triggered,
   * or rejects if an error is emitted.  (If you request the 'error' event,
   * returns a promise that resolves with the error).
   *
   * Example:
   *
   *   const message = await stream.emitted('message') // rejects if the stream errors
   */
  emitted(e) {
    return new Promise((t, r) => {
      u(this, Z, !0, "f"), e !== "error" && this.once("error", r), this.once(e, t);
    });
  }
  async done() {
    u(this, Z, !0, "f"), await a(this, $e, "f");
  }
  get currentMessage() {
    return a(this, J, "f");
  }
  /**
   * @returns a promise that resolves with the the final assistant Message response,
   * or rejects if an error occurred or the stream ended prematurely without producing a Message.
   * If structured outputs were used, this will be a ParsedMessage with a `parsed` field.
   */
  async finalMessage() {
    return await this.done(), a(this, T, "m", jt).call(this);
  }
  /**
   * @returns a promise that resolves with the the final assistant Message's text response, concatenated
   * together if there are more than one text blocks.
   * Rejects if an error occurred or the stream ended prematurely without producing a Message.
   */
  async finalText() {
    return await this.done(), a(this, T, "m", kr).call(this);
  }
  _emit(e, ...t) {
    if (a(this, Le, "f"))
      return;
    e === "end" && (u(this, Le, !0, "f"), a(this, ct, "f").call(this));
    let r = a(this, U, "f")[e];
    if (r && (a(this, U, "f")[e] = r.filter((n) => !n.once), r.forEach(({ listener: n }) => n(...t))), e === "abort") {
      let n = t[0];
      !a(this, Z, "f") && !r?.length && Promise.reject(n), a(this, Fe, "f").call(this, n), a(this, qe, "f").call(this, n), this._emit("end");
      return;
    }
    if (e === "error") {
      let n = t[0];
      !a(this, Z, "f") && !r?.length && Promise.reject(n), a(this, Fe, "f").call(this, n), a(this, qe, "f").call(this, n), this._emit("end");
    }
  }
  _emitFinal() {
    this.receivedMessages.at(-1) && this._emit("finalMessage", a(this, T, "m", jt).call(this));
  }
  async _fromReadableStream(e, t) {
    let r = t?.signal, n;
    r && (r.aborted && this.controller.abort(), n = this.controller.abort.bind(this.controller), r.addEventListener("abort", n));
    try {
      a(this, T, "m", Ut).call(this), this._connected(null);
      let o = F.fromReadableStream(e, this.controller);
      for await (let c of o)
        a(this, T, "m", Ct).call(this, c);
      if (o.controller.signal?.aborted)
        throw new P();
      a(this, T, "m", Wt).call(this);
    } finally {
      r && n && r.removeEventListener("abort", n);
    }
  }
  [(J = /* @__PURE__ */ new WeakMap(), be = /* @__PURE__ */ new WeakMap(), Ne = /* @__PURE__ */ new WeakMap(), at = /* @__PURE__ */ new WeakMap(), Fe = /* @__PURE__ */ new WeakMap(), $e = /* @__PURE__ */ new WeakMap(), ct = /* @__PURE__ */ new WeakMap(), qe = /* @__PURE__ */ new WeakMap(), U = /* @__PURE__ */ new WeakMap(), Le = /* @__PURE__ */ new WeakMap(), lt = /* @__PURE__ */ new WeakMap(), ut = /* @__PURE__ */ new WeakMap(), Z = /* @__PURE__ */ new WeakMap(), ht = /* @__PURE__ */ new WeakMap(), dt = /* @__PURE__ */ new WeakMap(), je = /* @__PURE__ */ new WeakMap(), ft = /* @__PURE__ */ new WeakMap(), T = /* @__PURE__ */ new WeakSet(), jt = /* @__PURE__ */ i(function() {
    if (this.receivedMessages.length === 0)
      throw new d("stream ended without producing a Message with role=assistant");
    return this.receivedMessages.at(-1);
  }, "_BetaMessageStream_getFinalMessage"), kr = /* @__PURE__ */ i(function() {
    if (this.receivedMessages.length === 0)
      throw new d("stream ended without producing a Message with role=assistant");
    let t = this.receivedMessages.at(-1).content.filter((r) => r.type === "text").map((r) => r.text);
    if (t.length === 0)
      throw new d("stream ended without producing a content block with type=text");
    return t.join(" ");
  }, "_BetaMessageStream_getFinalText"), Ut = /* @__PURE__ */ i(function() {
    this.ended || u(this, J, void 0, "f");
  }, "_BetaMessageStream_beginRequest"), Ct = /* @__PURE__ */ i(function(t) {
    if (this.ended)
      return;
    let r = a(this, T, "m", Pr).call(this, t);
    switch (this._emit("streamEvent", t, r), t.type) {
      case "content_block_delta": {
        let n = r.content.at(-1);
        switch (t.delta.type) {
          case "text_delta": {
            n.type === "text" && this._emit("text", t.delta.text, n.text || "");
            break;
          }
          case "citations_delta": {
            n.type === "text" && this._emit("citation", t.delta.citation, n.citations ?? []);
            break;
          }
          case "input_json_delta": {
            Rr(n) && n.input && this._emit("inputJson", t.delta.partial_json, n.input);
            break;
          }
          case "thinking_delta": {
            n.type === "thinking" && this._emit("thinking", t.delta.thinking, n.thinking);
            break;
          }
          case "signature_delta": {
            n.type === "thinking" && this._emit("signature", n.signature);
            break;
          }
          default:
            t.delta;
        }
        break;
      }
      case "message_stop": {
        this._addMessageParam(r), this._addMessage(qt(r, a(this, be, "f"), { logger: a(this, je, "f") }), !0);
        break;
      }
      case "content_block_stop": {
        this._emit("contentBlock", r.content.at(-1));
        break;
      }
      case "message_start": {
        u(this, J, r, "f");
        break;
      }
      case "content_block_start":
      case "message_delta":
        break;
    }
  }, "_BetaMessageStream_addStreamEvent"), Wt = /* @__PURE__ */ i(function() {
    if (this.ended)
      throw new d("stream has ended, this shouldn't happen");
    let t = a(this, J, "f");
    if (!t)
      throw new d("request ended without sending any chunks");
    return u(this, J, void 0, "f"), qt(t, a(this, be, "f"), { logger: a(this, je, "f") });
  }, "_BetaMessageStream_endRequest"), Pr = /* @__PURE__ */ i(function(t) {
    let r = a(this, J, "f");
    if (t.type === "message_start") {
      if (r)
        throw new d(`Unexpected event order, got ${t.type} before receiving "message_stop"`);
      return t.message;
    }
    if (!r)
      throw new d(`Unexpected event order, got ${t.type} before "message_start"`);
    switch (t.type) {
      case "message_stop":
        return r;
      case "message_delta":
        return r.container = t.delta.container, r.stop_reason = t.delta.stop_reason, r.stop_sequence = t.delta.stop_sequence, r.usage.output_tokens = t.usage.output_tokens, r.context_management = t.context_management, t.usage.input_tokens != null && (r.usage.input_tokens = t.usage.input_tokens), t.usage.cache_creation_input_tokens != null && (r.usage.cache_creation_input_tokens = t.usage.cache_creation_input_tokens), t.usage.cache_read_input_tokens != null && (r.usage.cache_read_input_tokens = t.usage.cache_read_input_tokens), t.usage.server_tool_use != null && (r.usage.server_tool_use = t.usage.server_tool_use), r;
      case "content_block_start":
        return r.content.push(t.content_block), r;
      case "content_block_delta": {
        let n = r.content.at(t.index);
        switch (t.delta.type) {
          case "text_delta": {
            n?.type === "text" && (r.content[t.index] = {
              ...n,
              text: (n.text || "") + t.delta.text
            });
            break;
          }
          case "citations_delta": {
            n?.type === "text" && (r.content[t.index] = {
              ...n,
              citations: [...n.citations ?? [], t.delta.citation]
            });
            break;
          }
          case "input_json_delta": {
            if (n && Rr(n)) {
              let o = n[Mr] || "";
              o += t.delta.partial_json;
              let c = { ...n };
              if (Object.defineProperty(c, Mr, {
                value: o,
                enumerable: !1,
                writable: !0
              }), o)
                try {
                  c.input = it(o);
                } catch (l) {
                  let h = new d(`Unable to parse tool parameter JSON from model. Please retry your request or adjust your prompt. Error: ${l}. JSON: ${o}`);
                  a(this, ft, "f").call(this, h);
                }
              r.content[t.index] = c;
            }
            break;
          }
          case "thinking_delta": {
            n?.type === "thinking" && (r.content[t.index] = {
              ...n,
              thinking: n.thinking + t.delta.thinking
            });
            break;
          }
          case "signature_delta": {
            n?.type === "thinking" && (r.content[t.index] = {
              ...n,
              signature: t.delta.signature
            });
            break;
          }
          default:
            t.delta;
        }
        return r;
      }
      case "content_block_stop":
        return r;
    }
  }, "_BetaMessageStream_accumulateMessage"), Symbol.asyncIterator)]() {
    let e = [], t = [], r = !1;
    return this.on("streamEvent", (n) => {
      let o = t.shift();
      o ? o.resolve(n) : e.push(n);
    }), this.on("end", () => {
      r = !0;
      for (let n of t)
        n.resolve(void 0);
      t.length = 0;
    }), this.on("abort", (n) => {
      r = !0;
      for (let o of t)
        o.reject(n);
      t.length = 0;
    }), this.on("error", (n) => {
      r = !0;
      for (let o of t)
        o.reject(n);
      t.length = 0;
    }), {
      next: /* @__PURE__ */ i(async () => e.length ? { value: e.shift(), done: !1 } : r ? { value: void 0, done: !0 } : new Promise((o, c) => t.push({ resolve: o, reject: c })).then((o) => o ? { value: o, done: !1 } : { value: void 0, done: !0 }), "next"),
      return: /* @__PURE__ */ i(async () => (this.abort(), { value: void 0, done: !0 }), "return")
    };
  }
  toReadableStream() {
    return new F(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
  }
};

// node_modules/@anthropic-ai/sdk/lib/tools/CompactionControl.mjs
var Er = `You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:
1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified
2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced
3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)
4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain
5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user
Be concise but complete\u2014err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.
Wrap your summary in <summary></summary> tags.`;

// node_modules/@anthropic-ai/sdk/lib/tools/BetaToolRunner.mjs
var Ue, we, ee, x, Ce, E, C, X, We, Ar, Dt;
function Tr() {
  let s, e;
  return { promise: new Promise((r, n) => {
    s = r, e = n;
  }), resolve: s, reject: e };
}
i(Tr, "promiseWithResolvers");
var xe = class {
  static {
    i(this, "BetaToolRunner");
  }
  constructor(e, t, r) {
    Ue.add(this), this.client = e, we.set(this, !1), ee.set(this, !1), x.set(this, void 0), Ce.set(this, void 0), E.set(this, void 0), C.set(this, void 0), X.set(this, void 0), We.set(this, 0), u(this, x, {
      params: {
        // You can't clone the entire params since there are functions as handlers.
        // You also don't really need to clone params.messages, but it probably will prevent a foot gun
        // somewhere.
        ...t,
        messages: structuredClone(t.messages)
      }
    }, "f"), u(this, Ce, {
      ...r,
      headers: f([{ "x-stainless-helper": "BetaToolRunner" }, r?.headers])
    }, "f"), u(this, X, Tr(), "f");
  }
  async *[(we = /* @__PURE__ */ new WeakMap(), ee = /* @__PURE__ */ new WeakMap(), x = /* @__PURE__ */ new WeakMap(), Ce = /* @__PURE__ */ new WeakMap(), E = /* @__PURE__ */ new WeakMap(), C = /* @__PURE__ */ new WeakMap(), X = /* @__PURE__ */ new WeakMap(), We = /* @__PURE__ */ new WeakMap(), Ue = /* @__PURE__ */ new WeakSet(), Ar = /* @__PURE__ */ i(async function() {
    let t = a(this, x, "f").params.compactionControl;
    if (!t || !t.enabled)
      return !1;
    let r = 0;
    if (a(this, E, "f") !== void 0)
      try {
        let p = await a(this, E, "f");
        r = p.usage.input_tokens + (p.usage.cache_creation_input_tokens ?? 0) + (p.usage.cache_read_input_tokens ?? 0) + p.usage.output_tokens;
      } catch {
        return !1;
      }
    let n = t.contextTokenThreshold ?? 1e5;
    if (r < n)
      return !1;
    let o = t.model ?? a(this, x, "f").params.model, c = t.summaryPrompt ?? Er, l = a(this, x, "f").params.messages;
    if (l[l.length - 1].role === "assistant") {
      let p = l[l.length - 1];
      if (Array.isArray(p.content)) {
        let y = p.content.filter((w) => w.type !== "tool_use");
        y.length === 0 ? l.pop() : p.content = y;
      }
    }
    let h = await this.client.beta.messages.create({
      model: o,
      messages: [
        ...l,
        {
          role: "user",
          content: [
            {
              type: "text",
              text: c
            }
          ]
        }
      ],
      max_tokens: a(this, x, "f").params.max_tokens
    }, {
      headers: { "x-stainless-helper": "compaction" }
    });
    if (h.content[0]?.type !== "text")
      throw new d("Expected text response for compaction");
    return a(this, x, "f").params.messages = [
      {
        role: "user",
        content: h.content
      }
    ], !0;
  }, "_BetaToolRunner_checkAndCompact"), Symbol.asyncIterator)]() {
    var e;
    if (a(this, we, "f"))
      throw new d("Cannot iterate over a consumed stream");
    u(this, we, !0, "f"), u(this, ee, !0, "f"), u(this, C, void 0, "f");
    try {
      for (; ; ) {
        let t;
        try {
          if (a(this, x, "f").params.max_iterations && a(this, We, "f") >= a(this, x, "f").params.max_iterations)
            break;
          u(this, ee, !1, "f"), u(this, C, void 0, "f"), u(this, We, (e = a(this, We, "f"), e++, e), "f"), u(this, E, void 0, "f");
          let { max_iterations: r, compactionControl: n, ...o } = a(this, x, "f").params;
          if (o.stream ? (t = this.client.beta.messages.stream({ ...o }, a(this, Ce, "f")), u(this, E, t.finalMessage(), "f"), a(this, E, "f").catch(() => {
          }), yield t) : (u(this, E, this.client.beta.messages.create({ ...o, stream: !1 }, a(this, Ce, "f")), "f"), yield a(this, E, "f")), !await a(this, Ue, "m", Ar).call(this)) {
            if (!a(this, ee, "f")) {
              let { role: h, content: p } = await a(this, E, "f");
              a(this, x, "f").params.messages.push({ role: h, content: p });
            }
            let l = await a(this, Ue, "m", Dt).call(this, a(this, x, "f").params.messages.at(-1));
            if (l)
              a(this, x, "f").params.messages.push(l);
            else if (!a(this, ee, "f"))
              break;
          }
        } finally {
          t && t.abort();
        }
      }
      if (!a(this, E, "f"))
        throw new d("ToolRunner concluded without a message from the server");
      a(this, X, "f").resolve(await a(this, E, "f"));
    } catch (t) {
      throw u(this, we, !1, "f"), a(this, X, "f").promise.catch(() => {
      }), a(this, X, "f").reject(t), u(this, X, Tr(), "f"), t;
    }
  }
  setMessagesParams(e) {
    typeof e == "function" ? a(this, x, "f").params = e(a(this, x, "f").params) : a(this, x, "f").params = e, u(this, ee, !0, "f"), u(this, C, void 0, "f");
  }
  /**
   * Get the tool response for the last message from the assistant.
   * Avoids redundant tool executions by caching results.
   *
   * @returns A promise that resolves to a BetaMessageParam containing tool results, or null if no tools need to be executed
   *
   * @example
   * const toolResponse = await runner.generateToolResponse();
   * if (toolResponse) {
   *   console.log('Tool results:', toolResponse.content);
   * }
   */
  async generateToolResponse() {
    let e = await a(this, E, "f") ?? this.params.messages.at(-1);
    return e ? a(this, Ue, "m", Dt).call(this, e) : null;
  }
  /**
   * Wait for the async iterator to complete. This works even if the async iterator hasn't yet started, and
   * will wait for an instance to start and go to completion.
   *
   * @returns A promise that resolves to the final BetaMessage when the iterator completes
   *
   * @example
   * // Start consuming the iterator
   * for await (const message of runner) {
   *   console.log('Message:', message.content);
   * }
   *
   * // Meanwhile, wait for completion from another part of the code
   * const finalMessage = await runner.done();
   * console.log('Final response:', finalMessage.content);
   */
  done() {
    return a(this, X, "f").promise;
  }
  /**
   * Returns a promise indicating that the stream is done. Unlike .done(), this will eagerly read the stream:
   * * If the iterator has not been consumed, consume the entire iterator and return the final message from the
   * assistant.
   * * If the iterator has been consumed, waits for it to complete and returns the final message.
   *
   * @returns A promise that resolves to the final BetaMessage from the conversation
   * @throws {AnthropicError} If no messages were processed during the conversation
   *
   * @example
   * const finalMessage = await runner.runUntilDone();
   * console.log('Final response:', finalMessage.content);
   */
  async runUntilDone() {
    if (!a(this, we, "f"))
      for await (let e of this)
        ;
    return this.done();
  }
  /**
   * Get the current parameters being used by the ToolRunner.
   *
   * @returns A readonly view of the current ToolRunnerParams
   *
   * @example
   * const currentParams = runner.params;
   * console.log('Current model:', currentParams.model);
   * console.log('Message count:', currentParams.messages.length);
   */
  get params() {
    return a(this, x, "f").params;
  }
  /**
   * Add one or more messages to the conversation history.
   *
   * @param messages - One or more BetaMessageParam objects to add to the conversation
   *
   * @example
   * runner.pushMessages(
   *   { role: 'user', content: 'Also, what about the weather in NYC?' }
   * );
   *
   * @example
   * // Adding multiple messages
   * runner.pushMessages(
   *   { role: 'user', content: 'What about NYC?' },
   *   { role: 'user', content: 'And Boston?' }
   * );
   */
  pushMessages(...e) {
    this.setMessagesParams((t) => ({
      ...t,
      messages: [...t.messages, ...e]
    }));
  }
  /**
   * Makes the ToolRunner directly awaitable, equivalent to calling .runUntilDone()
   * This allows using `await runner` instead of `await runner.runUntilDone()`
   */
  then(e, t) {
    return this.runUntilDone().then(e, t);
  }
};
Dt = /* @__PURE__ */ i(async function(e) {
  return a(this, C, "f") !== void 0 ? a(this, C, "f") : (u(this, C, ps(a(this, x, "f").params, e), "f"), a(this, C, "f"));
}, "_BetaToolRunner_generateToolResponse");
async function ps(s, e = s.messages.at(-1)) {
  if (!e || e.role !== "assistant" || !e.content || typeof e.content == "string")
    return null;
  let t = e.content.filter((n) => n.type === "tool_use");
  return t.length === 0 ? null : {
    role: "user",
    content: await Promise.all(t.map(async (n) => {
      let o = s.tools.find((c) => ("name" in c ? c.name : c.mcp_server_name) === n.name);
      if (!o || !("run" in o))
        return {
          type: "tool_result",
          tool_use_id: n.id,
          content: `Error: Tool '${n.name}' not found`,
          is_error: !0
        };
      try {
        let c = n.input;
        "parse" in o && o.parse && (c = o.parse(c));
        let l = await o.run(c);
        return {
          type: "tool_result",
          tool_use_id: n.id,
          content: l
        };
      } catch (c) {
        return {
          type: "tool_result",
          tool_use_id: n.id,
          content: `Error: ${c instanceof Error ? c.message : String(c)}`,
          is_error: !0
        };
      }
    }))
  };
}
i(ps, "generateToolResponse");

// node_modules/@anthropic-ai/sdk/internal/decoders/jsonl.mjs
var Se = class s {
  static {
    i(this, "JSONLDecoder");
  }
  constructor(e, t) {
    this.iterator = e, this.controller = t;
  }
  async *decoder() {
    let e = new L();
    for await (let t of this.iterator)
      for (let r of e.decode(t))
        yield JSON.parse(r);
    for (let t of e.flush())
      yield JSON.parse(t);
  }
  [Symbol.asyncIterator]() {
    return this.decoder();
  }
  static fromResponse(e, t) {
    if (!e.body)
      throw t.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative" ? new d("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api") : new d("Attempted to iterate over a response with no body");
    return new s(Ee(e.body), t);
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/messages/batches.mjs
var ke = class extends g {
  static {
    i(this, "Batches");
  }
  /**
   * Send a batch of Message creation requests.
   *
   * The Message Batches API can be used to process multiple Messages API requests at
   * once. Once a Message Batch is created, it begins processing immediately. Batches
   * can take up to 24 hours to complete.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaMessageBatch =
   *   await client.beta.messages.batches.create({
   *     requests: [
   *       {
   *         custom_id: 'my-custom-id-1',
   *         params: {
   *           max_tokens: 1024,
   *           messages: [
   *             { content: 'Hello, world', role: 'user' },
   *           ],
   *           model: 'claude-sonnet-4-5-20250929',
   *         },
   *       },
   *     ],
   *   });
   * ```
   */
  create(e, t) {
    let { betas: r, ...n } = e;
    return this._client.post("/v1/messages/batches?beta=true", {
      body: n,
      ...t,
      headers: f([
        { "anthropic-beta": [...r ?? [], "message-batches-2024-09-24"].toString() },
        t?.headers
      ])
    });
  }
  /**
   * This endpoint is idempotent and can be used to poll for Message Batch
   * completion. To access the results of a Message Batch, make a request to the
   * `results_url` field in the response.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaMessageBatch =
   *   await client.beta.messages.batches.retrieve(
   *     'message_batch_id',
   *   );
   * ```
   */
  retrieve(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.get(_`/v1/messages/batches/${e}?beta=true`, {
      ...r,
      headers: f([
        { "anthropic-beta": [...n ?? [], "message-batches-2024-09-24"].toString() },
        r?.headers
      ])
    });
  }
  /**
   * List all Message Batches within a Workspace. Most recently created batches are
   * returned first.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaMessageBatch of client.beta.messages.batches.list()) {
   *   // ...
   * }
   * ```
   */
  list(e = {}, t) {
    let { betas: r, ...n } = e ?? {};
    return this._client.getAPIList("/v1/messages/batches?beta=true", A, {
      query: n,
      ...t,
      headers: f([
        { "anthropic-beta": [...r ?? [], "message-batches-2024-09-24"].toString() },
        t?.headers
      ])
    });
  }
  /**
   * Delete a Message Batch.
   *
   * Message Batches can only be deleted once they've finished processing. If you'd
   * like to delete an in-progress batch, you must first cancel it.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaDeletedMessageBatch =
   *   await client.beta.messages.batches.delete(
   *     'message_batch_id',
   *   );
   * ```
   */
  delete(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.delete(_`/v1/messages/batches/${e}?beta=true`, {
      ...r,
      headers: f([
        { "anthropic-beta": [...n ?? [], "message-batches-2024-09-24"].toString() },
        r?.headers
      ])
    });
  }
  /**
   * Batches may be canceled any time before processing ends. Once cancellation is
   * initiated, the batch enters a `canceling` state, at which time the system may
   * complete any in-progress, non-interruptible requests before finalizing
   * cancellation.
   *
   * The number of canceled requests is specified in `request_counts`. To determine
   * which requests were canceled, check the individual results within the batch.
   * Note that cancellation may not result in any canceled requests if they were
   * non-interruptible.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaMessageBatch =
   *   await client.beta.messages.batches.cancel(
   *     'message_batch_id',
   *   );
   * ```
   */
  cancel(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.post(_`/v1/messages/batches/${e}/cancel?beta=true`, {
      ...r,
      headers: f([
        { "anthropic-beta": [...n ?? [], "message-batches-2024-09-24"].toString() },
        r?.headers
      ])
    });
  }
  /**
   * Streams the results of a Message Batch as a `.jsonl` file.
   *
   * Each line in the file is a JSON object containing the result of a single request
   * in the Message Batch. Results are not guaranteed to be in the same order as
   * requests. Use the `custom_id` field to match results to requests.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaMessageBatchIndividualResponse =
   *   await client.beta.messages.batches.results(
   *     'message_batch_id',
   *   );
   * ```
   */
  async results(e, t = {}, r) {
    let n = await this.retrieve(e);
    if (!n.results_url)
      throw new d(`No batch \`results_url\`; Has it finished processing? ${n.processing_status} - ${n.id}`);
    let { betas: o } = t ?? {};
    return this._client.get(n.results_url, {
      ...r,
      headers: f([
        {
          "anthropic-beta": [...o ?? [], "message-batches-2024-09-24"].toString(),
          Accept: "application/binary"
        },
        r?.headers
      ]),
      stream: !0,
      __binaryResponse: !0
    })._thenUnwrap((c, l) => Se.fromResponse(l.response, l.controller));
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/messages/messages.mjs
var Ir = {
  "claude-1.3": "November 6th, 2024",
  "claude-1.3-100k": "November 6th, 2024",
  "claude-instant-1.1": "November 6th, 2024",
  "claude-instant-1.1-100k": "November 6th, 2024",
  "claude-instant-1.2": "November 6th, 2024",
  "claude-3-sonnet-20240229": "July 21st, 2025",
  "claude-3-opus-20240229": "January 5th, 2026",
  "claude-2.1": "July 21st, 2025",
  "claude-2.0": "July 21st, 2025",
  "claude-3-7-sonnet-latest": "February 19th, 2026",
  "claude-3-7-sonnet-20250219": "February 19th, 2026"
}, V = class extends g {
  static {
    i(this, "Messages");
  }
  constructor() {
    super(...arguments), this.batches = new ke(this._client);
  }
  create(e, t) {
    let { betas: r, ...n } = e;
    n.model in Ir && console.warn(`The model '${n.model}' is deprecated and will reach end-of-life on ${Ir[n.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
    let o = this._client._options.timeout;
    if (!n.stream && o == null) {
      let c = ot[n.model] ?? void 0;
      o = this._client.calculateNonstreamingTimeout(n.max_tokens, c);
    }
    return this._client.post("/v1/messages?beta=true", {
      body: n,
      timeout: o ?? 6e5,
      ...t,
      headers: f([
        { ...r?.toString() != null ? { "anthropic-beta": r?.toString() } : void 0 },
        t?.headers
      ]),
      stream: e.stream ?? !1
    });
  }
  /**
   * Send a structured list of input messages with text and/or image content, along with an expected `output_format` and
   * the response will be automatically parsed and available in the `parsed_output` property of the message.
   *
   * @example
   * ```ts
   * const message = await client.beta.messages.parse({
   *   model: 'claude-3-5-sonnet-20241022',
   *   max_tokens: 1024,
   *   messages: [{ role: 'user', content: 'What is 2+2?' }],
   *   output_format: zodOutputFormat(z.object({ answer: z.number() }), 'math'),
   * });
   *
   * console.log(message.parsed_output?.answer); // 4
   * ```
   */
  parse(e, t) {
    return t = {
      ...t,
      headers: f([
        { "anthropic-beta": [...e.betas ?? [], "structured-outputs-2025-11-13"].toString() },
        t?.headers
      ])
    }, this.create(e, t).then((r) => Lt(r, e, { logger: this._client.logger ?? console }));
  }
  /**
   * Create a Message stream
   */
  stream(e, t) {
    return pt.createMessage(this, e, t);
  }
  /**
   * Count the number of tokens in a Message.
   *
   * The Token Count API can be used to count the number of tokens in a Message,
   * including tools, images, and documents, without creating it.
   *
   * Learn more about token counting in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/token-counting)
   *
   * @example
   * ```ts
   * const betaMessageTokensCount =
   *   await client.beta.messages.countTokens({
   *     messages: [{ content: 'string', role: 'user' }],
   *     model: 'claude-opus-4-5-20251101',
   *   });
   * ```
   */
  countTokens(e, t) {
    let { betas: r, ...n } = e;
    return this._client.post("/v1/messages/count_tokens?beta=true", {
      body: n,
      ...t,
      headers: f([
        { "anthropic-beta": [...r ?? [], "token-counting-2024-11-01"].toString() },
        t?.headers
      ])
    });
  }
  toolRunner(e, t) {
    return new xe(this._client, e, t);
  }
};
V.Batches = ke;
V.BetaToolRunner = xe;

// node_modules/@anthropic-ai/sdk/resources/beta/skills/versions.mjs
var Pe = class extends g {
  static {
    i(this, "Versions");
  }
  /**
   * Create Skill Version
   *
   * @example
   * ```ts
   * const version = await client.beta.skills.versions.create(
   *   'skill_id',
   * );
   * ```
   */
  create(e, t = {}, r) {
    let { betas: n, ...o } = t ?? {};
    return this._client.post(_`/v1/skills/${e}/versions?beta=true`, me({
      body: o,
      ...r,
      headers: f([
        { "anthropic-beta": [...n ?? [], "skills-2025-10-02"].toString() },
        r?.headers
      ])
    }, this._client));
  }
  /**
   * Get Skill Version
   *
   * @example
   * ```ts
   * const version = await client.beta.skills.versions.retrieve(
   *   'version',
   *   { skill_id: 'skill_id' },
   * );
   * ```
   */
  retrieve(e, t, r) {
    let { skill_id: n, betas: o } = t;
    return this._client.get(_`/v1/skills/${n}/versions/${e}?beta=true`, {
      ...r,
      headers: f([
        { "anthropic-beta": [...o ?? [], "skills-2025-10-02"].toString() },
        r?.headers
      ])
    });
  }
  /**
   * List Skill Versions
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const versionListResponse of client.beta.skills.versions.list(
   *   'skill_id',
   * )) {
   *   // ...
   * }
   * ```
   */
  list(e, t = {}, r) {
    let { betas: n, ...o } = t ?? {};
    return this._client.getAPIList(_`/v1/skills/${e}/versions?beta=true`, pe, {
      query: o,
      ...r,
      headers: f([
        { "anthropic-beta": [...n ?? [], "skills-2025-10-02"].toString() },
        r?.headers
      ])
    });
  }
  /**
   * Delete Skill Version
   *
   * @example
   * ```ts
   * const version = await client.beta.skills.versions.delete(
   *   'version',
   *   { skill_id: 'skill_id' },
   * );
   * ```
   */
  delete(e, t, r) {
    let { skill_id: n, betas: o } = t;
    return this._client.delete(_`/v1/skills/${n}/versions/${e}?beta=true`, {
      ...r,
      headers: f([
        { "anthropic-beta": [...o ?? [], "skills-2025-10-02"].toString() },
        r?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/skills/skills.mjs
var te = class extends g {
  static {
    i(this, "Skills");
  }
  constructor() {
    super(...arguments), this.versions = new Pe(this._client);
  }
  /**
   * Create Skill
   *
   * @example
   * ```ts
   * const skill = await client.beta.skills.create();
   * ```
   */
  create(e = {}, t) {
    let { betas: r, ...n } = e ?? {};
    return this._client.post("/v1/skills?beta=true", me({
      body: n,
      ...t,
      headers: f([
        { "anthropic-beta": [...r ?? [], "skills-2025-10-02"].toString() },
        t?.headers
      ])
    }, this._client));
  }
  /**
   * Get Skill
   *
   * @example
   * ```ts
   * const skill = await client.beta.skills.retrieve('skill_id');
   * ```
   */
  retrieve(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.get(_`/v1/skills/${e}?beta=true`, {
      ...r,
      headers: f([
        { "anthropic-beta": [...n ?? [], "skills-2025-10-02"].toString() },
        r?.headers
      ])
    });
  }
  /**
   * List Skills
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const skillListResponse of client.beta.skills.list()) {
   *   // ...
   * }
   * ```
   */
  list(e = {}, t) {
    let { betas: r, ...n } = e ?? {};
    return this._client.getAPIList("/v1/skills?beta=true", pe, {
      query: n,
      ...t,
      headers: f([
        { "anthropic-beta": [...r ?? [], "skills-2025-10-02"].toString() },
        t?.headers
      ])
    });
  }
  /**
   * Delete Skill
   *
   * @example
   * ```ts
   * const skill = await client.beta.skills.delete('skill_id');
   * ```
   */
  delete(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.delete(_`/v1/skills/${e}?beta=true`, {
      ...r,
      headers: f([
        { "anthropic-beta": [...n ?? [], "skills-2025-10-02"].toString() },
        r?.headers
      ])
    });
  }
};
te.Versions = Pe;

// node_modules/@anthropic-ai/sdk/resources/beta/beta.mjs
var v = class extends g {
  static {
    i(this, "Beta");
  }
  constructor() {
    super(...arguments), this.models = new _e(this._client), this.messages = new V(this._client), this.files = new ge(this._client), this.skills = new te(this._client);
  }
};
v.Models = _e;
v.Messages = V;
v.Files = ge;
v.Skills = te;

// node_modules/@anthropic-ai/sdk/resources/completions.mjs
var re = class extends g {
  static {
    i(this, "Completions");
  }
  create(e, t) {
    let { betas: r, ...n } = e;
    return this._client.post("/v1/complete", {
      body: n,
      timeout: this._client._options.timeout ?? 6e5,
      ...t,
      headers: f([
        { ...r?.toString() != null ? { "anthropic-beta": r?.toString() } : void 0 },
        t?.headers
      ]),
      stream: e.stream ?? !1
    });
  }
};

// node_modules/@anthropic-ai/sdk/lib/MessageStream.mjs
var I, K, De, mt, He, Je, gt, Xe, W, Ve, _t, yt, se, bt, wt, Ht, Or, Jt, Xt, Vt, Kt, Br, vr = "__json_buf";
function Nr(s) {
  return s.type === "tool_use" || s.type === "server_tool_use";
}
i(Nr, "tracksToolInput");
var xt = class s {
  static {
    i(this, "MessageStream");
  }
  constructor() {
    I.add(this), this.messages = [], this.receivedMessages = [], K.set(this, void 0), this.controller = new AbortController(), De.set(this, void 0), mt.set(this, () => {
    }), He.set(this, () => {
    }), Je.set(this, void 0), gt.set(this, () => {
    }), Xe.set(this, () => {
    }), W.set(this, {}), Ve.set(this, !1), _t.set(this, !1), yt.set(this, !1), se.set(this, !1), bt.set(this, void 0), wt.set(this, void 0), Jt.set(this, (e) => {
      if (u(this, _t, !0, "f"), q(e) && (e = new P()), e instanceof P)
        return u(this, yt, !0, "f"), this._emit("abort", e);
      if (e instanceof d)
        return this._emit("error", e);
      if (e instanceof Error) {
        let t = new d(e.message);
        return t.cause = e, this._emit("error", t);
      }
      return this._emit("error", new d(String(e)));
    }), u(this, De, new Promise((e, t) => {
      u(this, mt, e, "f"), u(this, He, t, "f");
    }), "f"), u(this, Je, new Promise((e, t) => {
      u(this, gt, e, "f"), u(this, Xe, t, "f");
    }), "f"), a(this, De, "f").catch(() => {
    }), a(this, Je, "f").catch(() => {
    });
  }
  get response() {
    return a(this, bt, "f");
  }
  get request_id() {
    return a(this, wt, "f");
  }
  /**
   * Returns the `MessageStream` data, the raw `Response` instance and the ID of the request,
   * returned vie the `request-id` header which is useful for debugging requests and resporting
   * issues to Anthropic.
   *
   * This is the same as the `APIPromise.withResponse()` method.
   *
   * This method will raise an error if you created the stream using `MessageStream.fromReadableStream`
   * as no `Response` is available.
   */
  async withResponse() {
    u(this, se, !0, "f");
    let e = await a(this, De, "f");
    if (!e)
      throw new Error("Could not resolve a `Response` object");
    return {
      data: this,
      response: e,
      request_id: e.headers.get("request-id")
    };
  }
  /**
   * Intended for use on the frontend, consuming a stream produced with
   * `.toReadableStream()` on the backend.
   *
   * Note that messages sent to the model do not appear in `.on('message')`
   * in this context.
   */
  static fromReadableStream(e) {
    let t = new s();
    return t._run(() => t._fromReadableStream(e)), t;
  }
  static createMessage(e, t, r) {
    let n = new s();
    for (let o of t.messages)
      n._addMessageParam(o);
    return n._run(() => n._createMessage(e, { ...t, stream: !0 }, { ...r, headers: { ...r?.headers, "X-Stainless-Helper-Method": "stream" } })), n;
  }
  _run(e) {
    e().then(() => {
      this._emitFinal(), this._emit("end");
    }, a(this, Jt, "f"));
  }
  _addMessageParam(e) {
    this.messages.push(e);
  }
  _addMessage(e, t = !0) {
    this.receivedMessages.push(e), t && this._emit("message", e);
  }
  async _createMessage(e, t, r) {
    let n = r?.signal, o;
    n && (n.aborted && this.controller.abort(), o = this.controller.abort.bind(this.controller), n.addEventListener("abort", o));
    try {
      a(this, I, "m", Xt).call(this);
      let { response: c, data: l } = await e.create({ ...t, stream: !0 }, { ...r, signal: this.controller.signal }).withResponse();
      this._connected(c);
      for await (let h of l)
        a(this, I, "m", Vt).call(this, h);
      if (l.controller.signal?.aborted)
        throw new P();
      a(this, I, "m", Kt).call(this);
    } finally {
      n && o && n.removeEventListener("abort", o);
    }
  }
  _connected(e) {
    this.ended || (u(this, bt, e, "f"), u(this, wt, e?.headers.get("request-id"), "f"), a(this, mt, "f").call(this, e), this._emit("connect"));
  }
  get ended() {
    return a(this, Ve, "f");
  }
  get errored() {
    return a(this, _t, "f");
  }
  get aborted() {
    return a(this, yt, "f");
  }
  abort() {
    this.controller.abort();
  }
  /**
   * Adds the listener function to the end of the listeners array for the event.
   * No checks are made to see if the listener has already been added. Multiple calls passing
   * the same combination of event and listener will result in the listener being added, and
   * called, multiple times.
   * @returns this MessageStream, so that calls can be chained
   */
  on(e, t) {
    return (a(this, W, "f")[e] || (a(this, W, "f")[e] = [])).push({ listener: t }), this;
  }
  /**
   * Removes the specified listener from the listener array for the event.
   * off() will remove, at most, one instance of a listener from the listener array. If any single
   * listener has been added multiple times to the listener array for the specified event, then
   * off() must be called multiple times to remove each instance.
   * @returns this MessageStream, so that calls can be chained
   */
  off(e, t) {
    let r = a(this, W, "f")[e];
    if (!r)
      return this;
    let n = r.findIndex((o) => o.listener === t);
    return n >= 0 && r.splice(n, 1), this;
  }
  /**
   * Adds a one-time listener function for the event. The next time the event is triggered,
   * this listener is removed and then invoked.
   * @returns this MessageStream, so that calls can be chained
   */
  once(e, t) {
    return (a(this, W, "f")[e] || (a(this, W, "f")[e] = [])).push({ listener: t, once: !0 }), this;
  }
  /**
   * This is similar to `.once()`, but returns a Promise that resolves the next time
   * the event is triggered, instead of calling a listener callback.
   * @returns a Promise that resolves the next time given event is triggered,
   * or rejects if an error is emitted.  (If you request the 'error' event,
   * returns a promise that resolves with the error).
   *
   * Example:
   *
   *   const message = await stream.emitted('message') // rejects if the stream errors
   */
  emitted(e) {
    return new Promise((t, r) => {
      u(this, se, !0, "f"), e !== "error" && this.once("error", r), this.once(e, t);
    });
  }
  async done() {
    u(this, se, !0, "f"), await a(this, Je, "f");
  }
  get currentMessage() {
    return a(this, K, "f");
  }
  /**
   * @returns a promise that resolves with the the final assistant Message response,
   * or rejects if an error occurred or the stream ended prematurely without producing a Message.
   */
  async finalMessage() {
    return await this.done(), a(this, I, "m", Ht).call(this);
  }
  /**
   * @returns a promise that resolves with the the final assistant Message's text response, concatenated
   * together if there are more than one text blocks.
   * Rejects if an error occurred or the stream ended prematurely without producing a Message.
   */
  async finalText() {
    return await this.done(), a(this, I, "m", Or).call(this);
  }
  _emit(e, ...t) {
    if (a(this, Ve, "f"))
      return;
    e === "end" && (u(this, Ve, !0, "f"), a(this, gt, "f").call(this));
    let r = a(this, W, "f")[e];
    if (r && (a(this, W, "f")[e] = r.filter((n) => !n.once), r.forEach(({ listener: n }) => n(...t))), e === "abort") {
      let n = t[0];
      !a(this, se, "f") && !r?.length && Promise.reject(n), a(this, He, "f").call(this, n), a(this, Xe, "f").call(this, n), this._emit("end");
      return;
    }
    if (e === "error") {
      let n = t[0];
      !a(this, se, "f") && !r?.length && Promise.reject(n), a(this, He, "f").call(this, n), a(this, Xe, "f").call(this, n), this._emit("end");
    }
  }
  _emitFinal() {
    this.receivedMessages.at(-1) && this._emit("finalMessage", a(this, I, "m", Ht).call(this));
  }
  async _fromReadableStream(e, t) {
    let r = t?.signal, n;
    r && (r.aborted && this.controller.abort(), n = this.controller.abort.bind(this.controller), r.addEventListener("abort", n));
    try {
      a(this, I, "m", Xt).call(this), this._connected(null);
      let o = F.fromReadableStream(e, this.controller);
      for await (let c of o)
        a(this, I, "m", Vt).call(this, c);
      if (o.controller.signal?.aborted)
        throw new P();
      a(this, I, "m", Kt).call(this);
    } finally {
      r && n && r.removeEventListener("abort", n);
    }
  }
  [(K = /* @__PURE__ */ new WeakMap(), De = /* @__PURE__ */ new WeakMap(), mt = /* @__PURE__ */ new WeakMap(), He = /* @__PURE__ */ new WeakMap(), Je = /* @__PURE__ */ new WeakMap(), gt = /* @__PURE__ */ new WeakMap(), Xe = /* @__PURE__ */ new WeakMap(), W = /* @__PURE__ */ new WeakMap(), Ve = /* @__PURE__ */ new WeakMap(), _t = /* @__PURE__ */ new WeakMap(), yt = /* @__PURE__ */ new WeakMap(), se = /* @__PURE__ */ new WeakMap(), bt = /* @__PURE__ */ new WeakMap(), wt = /* @__PURE__ */ new WeakMap(), Jt = /* @__PURE__ */ new WeakMap(), I = /* @__PURE__ */ new WeakSet(), Ht = /* @__PURE__ */ i(function() {
    if (this.receivedMessages.length === 0)
      throw new d("stream ended without producing a Message with role=assistant");
    return this.receivedMessages.at(-1);
  }, "_MessageStream_getFinalMessage"), Or = /* @__PURE__ */ i(function() {
    if (this.receivedMessages.length === 0)
      throw new d("stream ended without producing a Message with role=assistant");
    let t = this.receivedMessages.at(-1).content.filter((r) => r.type === "text").map((r) => r.text);
    if (t.length === 0)
      throw new d("stream ended without producing a content block with type=text");
    return t.join(" ");
  }, "_MessageStream_getFinalText"), Xt = /* @__PURE__ */ i(function() {
    this.ended || u(this, K, void 0, "f");
  }, "_MessageStream_beginRequest"), Vt = /* @__PURE__ */ i(function(t) {
    if (this.ended)
      return;
    let r = a(this, I, "m", Br).call(this, t);
    switch (this._emit("streamEvent", t, r), t.type) {
      case "content_block_delta": {
        let n = r.content.at(-1);
        switch (t.delta.type) {
          case "text_delta": {
            n.type === "text" && this._emit("text", t.delta.text, n.text || "");
            break;
          }
          case "citations_delta": {
            n.type === "text" && this._emit("citation", t.delta.citation, n.citations ?? []);
            break;
          }
          case "input_json_delta": {
            Nr(n) && n.input && this._emit("inputJson", t.delta.partial_json, n.input);
            break;
          }
          case "thinking_delta": {
            n.type === "thinking" && this._emit("thinking", t.delta.thinking, n.thinking);
            break;
          }
          case "signature_delta": {
            n.type === "thinking" && this._emit("signature", n.signature);
            break;
          }
          default:
            t.delta;
        }
        break;
      }
      case "message_stop": {
        this._addMessageParam(r), this._addMessage(r, !0);
        break;
      }
      case "content_block_stop": {
        this._emit("contentBlock", r.content.at(-1));
        break;
      }
      case "message_start": {
        u(this, K, r, "f");
        break;
      }
      case "content_block_start":
      case "message_delta":
        break;
    }
  }, "_MessageStream_addStreamEvent"), Kt = /* @__PURE__ */ i(function() {
    if (this.ended)
      throw new d("stream has ended, this shouldn't happen");
    let t = a(this, K, "f");
    if (!t)
      throw new d("request ended without sending any chunks");
    return u(this, K, void 0, "f"), t;
  }, "_MessageStream_endRequest"), Br = /* @__PURE__ */ i(function(t) {
    let r = a(this, K, "f");
    if (t.type === "message_start") {
      if (r)
        throw new d(`Unexpected event order, got ${t.type} before receiving "message_stop"`);
      return t.message;
    }
    if (!r)
      throw new d(`Unexpected event order, got ${t.type} before "message_start"`);
    switch (t.type) {
      case "message_stop":
        return r;
      case "message_delta":
        return r.stop_reason = t.delta.stop_reason, r.stop_sequence = t.delta.stop_sequence, r.usage.output_tokens = t.usage.output_tokens, t.usage.input_tokens != null && (r.usage.input_tokens = t.usage.input_tokens), t.usage.cache_creation_input_tokens != null && (r.usage.cache_creation_input_tokens = t.usage.cache_creation_input_tokens), t.usage.cache_read_input_tokens != null && (r.usage.cache_read_input_tokens = t.usage.cache_read_input_tokens), t.usage.server_tool_use != null && (r.usage.server_tool_use = t.usage.server_tool_use), r;
      case "content_block_start":
        return r.content.push({ ...t.content_block }), r;
      case "content_block_delta": {
        let n = r.content.at(t.index);
        switch (t.delta.type) {
          case "text_delta": {
            n?.type === "text" && (r.content[t.index] = {
              ...n,
              text: (n.text || "") + t.delta.text
            });
            break;
          }
          case "citations_delta": {
            n?.type === "text" && (r.content[t.index] = {
              ...n,
              citations: [...n.citations ?? [], t.delta.citation]
            });
            break;
          }
          case "input_json_delta": {
            if (n && Nr(n)) {
              let o = n[vr] || "";
              o += t.delta.partial_json;
              let c = { ...n };
              Object.defineProperty(c, vr, {
                value: o,
                enumerable: !1,
                writable: !0
              }), o && (c.input = it(o)), r.content[t.index] = c;
            }
            break;
          }
          case "thinking_delta": {
            n?.type === "thinking" && (r.content[t.index] = {
              ...n,
              thinking: n.thinking + t.delta.thinking
            });
            break;
          }
          case "signature_delta": {
            n?.type === "thinking" && (r.content[t.index] = {
              ...n,
              signature: t.delta.signature
            });
            break;
          }
          default:
            t.delta;
        }
        return r;
      }
      case "content_block_stop":
        return r;
    }
  }, "_MessageStream_accumulateMessage"), Symbol.asyncIterator)]() {
    let e = [], t = [], r = !1;
    return this.on("streamEvent", (n) => {
      let o = t.shift();
      o ? o.resolve(n) : e.push(n);
    }), this.on("end", () => {
      r = !0;
      for (let n of t)
        n.resolve(void 0);
      t.length = 0;
    }), this.on("abort", (n) => {
      r = !0;
      for (let o of t)
        o.reject(n);
      t.length = 0;
    }), this.on("error", (n) => {
      r = !0;
      for (let o of t)
        o.reject(n);
      t.length = 0;
    }), {
      next: /* @__PURE__ */ i(async () => e.length ? { value: e.shift(), done: !1 } : r ? { value: void 0, done: !0 } : new Promise((o, c) => t.push({ resolve: o, reject: c })).then((o) => o ? { value: o, done: !1 } : { value: void 0, done: !0 }), "next"),
      return: /* @__PURE__ */ i(async () => (this.abort(), { value: void 0, done: !0 }), "return")
    };
  }
  toReadableStream() {
    return new F(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
  }
};

// node_modules/@anthropic-ai/sdk/resources/messages/batches.mjs
var Me = class extends g {
  static {
    i(this, "Batches");
  }
  /**
   * Send a batch of Message creation requests.
   *
   * The Message Batches API can be used to process multiple Messages API requests at
   * once. Once a Message Batch is created, it begins processing immediately. Batches
   * can take up to 24 hours to complete.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const messageBatch = await client.messages.batches.create({
   *   requests: [
   *     {
   *       custom_id: 'my-custom-id-1',
   *       params: {
   *         max_tokens: 1024,
   *         messages: [
   *           { content: 'Hello, world', role: 'user' },
   *         ],
   *         model: 'claude-sonnet-4-5-20250929',
   *       },
   *     },
   *   ],
   * });
   * ```
   */
  create(e, t) {
    return this._client.post("/v1/messages/batches", { body: e, ...t });
  }
  /**
   * This endpoint is idempotent and can be used to poll for Message Batch
   * completion. To access the results of a Message Batch, make a request to the
   * `results_url` field in the response.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const messageBatch = await client.messages.batches.retrieve(
   *   'message_batch_id',
   * );
   * ```
   */
  retrieve(e, t) {
    return this._client.get(_`/v1/messages/batches/${e}`, t);
  }
  /**
   * List all Message Batches within a Workspace. Most recently created batches are
   * returned first.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const messageBatch of client.messages.batches.list()) {
   *   // ...
   * }
   * ```
   */
  list(e = {}, t) {
    return this._client.getAPIList("/v1/messages/batches", A, { query: e, ...t });
  }
  /**
   * Delete a Message Batch.
   *
   * Message Batches can only be deleted once they've finished processing. If you'd
   * like to delete an in-progress batch, you must first cancel it.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const deletedMessageBatch =
   *   await client.messages.batches.delete('message_batch_id');
   * ```
   */
  delete(e, t) {
    return this._client.delete(_`/v1/messages/batches/${e}`, t);
  }
  /**
   * Batches may be canceled any time before processing ends. Once cancellation is
   * initiated, the batch enters a `canceling` state, at which time the system may
   * complete any in-progress, non-interruptible requests before finalizing
   * cancellation.
   *
   * The number of canceled requests is specified in `request_counts`. To determine
   * which requests were canceled, check the individual results within the batch.
   * Note that cancellation may not result in any canceled requests if they were
   * non-interruptible.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const messageBatch = await client.messages.batches.cancel(
   *   'message_batch_id',
   * );
   * ```
   */
  cancel(e, t) {
    return this._client.post(_`/v1/messages/batches/${e}/cancel`, t);
  }
  /**
   * Streams the results of a Message Batch as a `.jsonl` file.
   *
   * Each line in the file is a JSON object containing the result of a single request
   * in the Message Batch. Results are not guaranteed to be in the same order as
   * requests. Use the `custom_id` field to match results to requests.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const messageBatchIndividualResponse =
   *   await client.messages.batches.results('message_batch_id');
   * ```
   */
  async results(e, t) {
    let r = await this.retrieve(e);
    if (!r.results_url)
      throw new d(`No batch \`results_url\`; Has it finished processing? ${r.processing_status} - ${r.id}`);
    return this._client.get(r.results_url, {
      ...t,
      headers: f([{ Accept: "application/binary" }, t?.headers]),
      stream: !0,
      __binaryResponse: !0
    })._thenUnwrap((n, o) => Se.fromResponse(o.response, o.controller));
  }
};

// node_modules/@anthropic-ai/sdk/resources/messages/messages.mjs
var G = class extends g {
  static {
    i(this, "Messages");
  }
  constructor() {
    super(...arguments), this.batches = new Me(this._client);
  }
  create(e, t) {
    e.model in Fr && console.warn(`The model '${e.model}' is deprecated and will reach end-of-life on ${Fr[e.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
    let r = this._client._options.timeout;
    if (!e.stream && r == null) {
      let n = ot[e.model] ?? void 0;
      r = this._client.calculateNonstreamingTimeout(e.max_tokens, n);
    }
    return this._client.post("/v1/messages", {
      body: e,
      timeout: r ?? 6e5,
      ...t,
      stream: e.stream ?? !1
    });
  }
  /**
   * Create a Message stream
   */
  stream(e, t) {
    return xt.createMessage(this, e, t);
  }
  /**
   * Count the number of tokens in a Message.
   *
   * The Token Count API can be used to count the number of tokens in a Message,
   * including tools, images, and documents, without creating it.
   *
   * Learn more about token counting in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/token-counting)
   *
   * @example
   * ```ts
   * const messageTokensCount =
   *   await client.messages.countTokens({
   *     messages: [{ content: 'string', role: 'user' }],
   *     model: 'claude-opus-4-5-20251101',
   *   });
   * ```
   */
  countTokens(e, t) {
    return this._client.post("/v1/messages/count_tokens", { body: e, ...t });
  }
}, Fr = {
  "claude-1.3": "November 6th, 2024",
  "claude-1.3-100k": "November 6th, 2024",
  "claude-instant-1.1": "November 6th, 2024",
  "claude-instant-1.1-100k": "November 6th, 2024",
  "claude-instant-1.2": "November 6th, 2024",
  "claude-3-sonnet-20240229": "July 21st, 2025",
  "claude-3-opus-20240229": "January 5th, 2026",
  "claude-2.1": "July 21st, 2025",
  "claude-2.0": "July 21st, 2025",
  "claude-3-7-sonnet-latest": "February 19th, 2026",
  "claude-3-7-sonnet-20250219": "February 19th, 2026"
};
G.Batches = Me;

// node_modules/@anthropic-ai/sdk/resources/models.mjs
var ne = class extends g {
  static {
    i(this, "Models");
  }
  /**
   * Get a specific model.
   *
   * The Models API response can be used to determine information about a specific
   * model or resolve a model alias to a model ID.
   */
  retrieve(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.get(_`/v1/models/${e}`, {
      ...r,
      headers: f([
        { ...n?.toString() != null ? { "anthropic-beta": n?.toString() } : void 0 },
        r?.headers
      ])
    });
  }
  /**
   * List available models.
   *
   * The Models API response can be used to determine which models are available for
   * use in the API. More recently released models are listed first.
   */
  list(e = {}, t) {
    let { betas: r, ...n } = e ?? {};
    return this._client.getAPIList("/v1/models", A, {
      query: n,
      ...t,
      headers: f([
        { ...r?.toString() != null ? { "anthropic-beta": r?.toString() } : void 0 },
        t?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/internal/utils/env.mjs
var Ke = /* @__PURE__ */ i((s) => {
  if (typeof globalThis.process < "u")
    return globalThis.process.env?.[s]?.trim() ?? void 0;
  if (typeof globalThis.Deno < "u")
    return globalThis.Deno.env?.get?.(s)?.trim();
}, "readEnv");

// node_modules/@anthropic-ai/sdk/client.mjs
var Gt, zt, St, $r, qr = "\\n\\nHuman:", Lr = "\\n\\nAssistant:", b = class {
  static {
    i(this, "BaseAnthropic");
  }
  /**
   * API Client for interfacing with the Anthropic API.
   *
   * @param {string | null | undefined} [opts.apiKey=process.env['ANTHROPIC_API_KEY'] ?? null]
   * @param {string | null | undefined} [opts.authToken=process.env['ANTHROPIC_AUTH_TOKEN'] ?? null]
   * @param {string} [opts.baseURL=process.env['ANTHROPIC_BASE_URL'] ?? https://api.anthropic.com] - Override the default base URL for the API.
   * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
   * @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
   * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
   */
  constructor({ baseURL: e = Ke("ANTHROPIC_BASE_URL"), apiKey: t = Ke("ANTHROPIC_API_KEY") ?? null, authToken: r = Ke("ANTHROPIC_AUTH_TOKEN") ?? null, ...n } = {}) {
    Gt.add(this), St.set(this, void 0);
    let o = {
      apiKey: t,
      authToken: r,
      ...n,
      baseURL: e || "https://api.anthropic.com"
    };
    if (!o.dangerouslyAllowBrowser && cr())
      throw new d(`It looks like you're running in a browser-like environment.

This is disabled by default, as it risks exposing your secret API credentials to attackers.
If you understand the risks and have appropriate mitigations in place,
you can set the \`dangerouslyAllowBrowser\` option to \`true\`, e.g.,

new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
`);
    this.baseURL = o.baseURL, this.timeout = o.timeout ?? zt.DEFAULT_TIMEOUT, this.logger = o.logger ?? console;
    let c = "warn";
    this.logLevel = c, this.logLevel = It(o.logLevel, "ClientOptions.logLevel", this) ?? It(Ke("ANTHROPIC_LOG"), "process.env['ANTHROPIC_LOG']", this) ?? c, this.fetchOptions = o.fetchOptions, this.maxRetries = o.maxRetries ?? 2, this.fetch = o.fetch ?? ur(), u(this, St, dr, "f"), this._options = o, this.apiKey = typeof t == "string" ? t : null, this.authToken = r;
  }
  /**
   * Create a new client instance re-using the same options given to the current client with optional overriding.
   */
  withOptions(e) {
    return new this.constructor({
      ...this._options,
      baseURL: this.baseURL,
      maxRetries: this.maxRetries,
      timeout: this.timeout,
      logger: this.logger,
      logLevel: this.logLevel,
      fetch: this.fetch,
      fetchOptions: this.fetchOptions,
      apiKey: this.apiKey,
      authToken: this.authToken,
      ...e
    });
  }
  defaultQuery() {
    return this._options.defaultQuery;
  }
  validateHeaders({ values: e, nulls: t }) {
    if (!(e.get("x-api-key") || e.get("authorization")) && !(this.apiKey && e.get("x-api-key")) && !t.has("x-api-key") && !(this.authToken && e.get("authorization")) && !t.has("authorization"))
      throw new Error('Could not resolve authentication method. Expected either apiKey or authToken to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted');
  }
  async authHeaders(e) {
    return f([await this.apiKeyAuth(e), await this.bearerAuth(e)]);
  }
  async apiKeyAuth(e) {
    if (this.apiKey != null)
      return f([{ "X-Api-Key": this.apiKey }]);
  }
  async bearerAuth(e) {
    if (this.authToken != null)
      return f([{ Authorization: `Bearer ${this.authToken}` }]);
  }
  /**
   * Basic re-implementation of `qs.stringify` for primitive types.
   */
  stringifyQuery(e) {
    return Object.entries(e).filter(([t, r]) => typeof r < "u").map(([t, r]) => {
      if (typeof r == "string" || typeof r == "number" || typeof r == "boolean")
        return `${encodeURIComponent(t)}=${encodeURIComponent(r)}`;
      if (r === null)
        return `${encodeURIComponent(t)}=`;
      throw new d(`Cannot stringify type ${typeof r}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
    }).join("&");
  }
  getUserAgent() {
    return `${this.constructor.name}/JS ${H}`;
  }
  defaultIdempotencyKey() {
    return `stainless-node-retry-${Mt()}`;
  }
  makeStatusError(e, t, r, n) {
    return S.generate(e, t, r, n);
  }
  buildURL(e, t, r) {
    let n = !a(this, Gt, "m", $r).call(this) && r || this.baseURL, o = er(e) ? new URL(e) : new URL(n + (n.endsWith("/") && e.startsWith("/") ? e.slice(1) : e)), c = this.defaultQuery();
    return tr(c) || (t = { ...c, ...t }), typeof t == "object" && t && !Array.isArray(t) && (o.search = this.stringifyQuery(t)), o.toString();
  }
  _calculateNonstreamingTimeout(e) {
    if (3600 * e / 128e3 > 600)
      throw new d("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#streaming-responses for more details");
    return 600 * 1e3;
  }
  /**
   * Used as a callback for mutating the given `FinalRequestOptions` object.
   */
  async prepareOptions(e) {
  }
  /**
   * Used as a callback for mutating the given `RequestInit` object.
   *
   * This is useful for cases where you want to add certain headers based off of
   * the request properties, e.g. `method` or `url`.
   */
  async prepareRequest(e, { url: t, options: r }) {
  }
  get(e, t) {
    return this.methodRequest("get", e, t);
  }
  post(e, t) {
    return this.methodRequest("post", e, t);
  }
  patch(e, t) {
    return this.methodRequest("patch", e, t);
  }
  put(e, t) {
    return this.methodRequest("put", e, t);
  }
  delete(e, t) {
    return this.methodRequest("delete", e, t);
  }
  methodRequest(e, t, r) {
    return this.request(Promise.resolve(r).then((n) => ({ method: e, path: t, ...n })));
  }
  request(e, t = null) {
    return new Q(this, this.makeRequest(e, t, void 0));
  }
  async makeRequest(e, t, r) {
    let n = await e, o = n.maxRetries ?? this.maxRetries;
    t == null && (t = o), await this.prepareOptions(n);
    let { req: c, url: l, timeout: h } = await this.buildRequest(n, {
      retryCount: o - t
    });
    await this.prepareRequest(c, { url: l, options: n });
    let p = "log_" + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, "0"), y = r === void 0 ? "" : `, retryOf: ${r}`, w = Date.now();
    if (k(this).debug(`[${p}] sending request`, j({
      retryOfRequestLogID: r,
      method: n.method,
      url: l,
      options: n,
      headers: c.headers
    })), n.signal?.aborted)
      throw new P();
    let O = new AbortController(), m = await this.fetchWithTimeout(l, c, h, O).catch(Re), B = Date.now();
    if (m instanceof globalThis.Error) {
      let $ = `retrying, ${t} attempts remaining`;
      if (n.signal?.aborted)
        throw new P();
      let N = q(m) || /timed? ?out/i.test(String(m) + ("cause" in m ? String(m.cause) : ""));
      if (t)
        return k(this).info(`[${p}] connection ${N ? "timed out" : "failed"} - ${$}`), k(this).debug(`[${p}] connection ${N ? "timed out" : "failed"} (${$})`, j({
          retryOfRequestLogID: r,
          url: l,
          durationMs: B - w,
          message: m.message
        })), this.retryRequest(n, t, r ?? p);
      throw k(this).info(`[${p}] connection ${N ? "timed out" : "failed"} - error; no more retries left`), k(this).debug(`[${p}] connection ${N ? "timed out" : "failed"} (error; no more retries left)`, j({
        retryOfRequestLogID: r,
        url: l,
        durationMs: B - w,
        message: m.message
      })), N ? new oe() : new D({ cause: m });
    }
    let kt = [...m.headers.entries()].filter(([$]) => $ === "request-id").map(([$, N]) => ", " + $ + ": " + JSON.stringify(N)).join(""), Pt = `[${p}${y}${kt}] ${c.method} ${l} ${m.ok ? "succeeded" : "failed"} with status ${m.status} in ${B - w}ms`;
    if (!m.ok) {
      let $ = await this.shouldRetry(m);
      if (t && $) {
        let Ge = `retrying, ${t} attempts remaining`;
        return await hr(m.body), k(this).info(`${Pt} - ${Ge}`), k(this).debug(`[${p}] response error (${Ge})`, j({
          retryOfRequestLogID: r,
          url: m.url,
          status: m.status,
          headers: m.headers,
          durationMs: B - w
        })), this.retryRequest(n, t, r ?? p, m.headers);
      }
      let N = $ ? "error; no more retries left" : "error; not retryable";
      k(this).info(`${Pt} - ${N}`);
      let Qt = await m.text().catch((Ge) => Re(Ge).message), Yt = Qe(Qt), Zt = Yt ? void 0 : Qt;
      throw k(this).debug(`[${p}] response error (${N})`, j({
        retryOfRequestLogID: r,
        url: m.url,
        status: m.status,
        headers: m.headers,
        message: Zt,
        durationMs: Date.now() - w
      })), this.makeStatusError(m.status, Yt, Zt, m.headers);
    }
    return k(this).info(Pt), k(this).debug(`[${p}] response start`, j({
      retryOfRequestLogID: r,
      url: m.url,
      status: m.status,
      headers: m.headers,
      durationMs: B - w
    })), { response: m, options: n, controller: O, requestLogID: p, retryOfRequestLogID: r, startTime: w };
  }
  getAPIList(e, t, r) {
    return this.requestAPIList(t, { method: "get", path: e, ...r });
  }
  requestAPIList(e, t) {
    let r = this.makeRequest(t, null, void 0);
    return new Be(this, r, e);
  }
  async fetchWithTimeout(e, t, r, n) {
    let { signal: o, method: c, ...l } = t || {};
    o && o.addEventListener("abort", () => n.abort());
    let h = setTimeout(() => n.abort(), r), p = globalThis.ReadableStream && l.body instanceof globalThis.ReadableStream || typeof l.body == "object" && l.body !== null && Symbol.asyncIterator in l.body, y = {
      signal: n.signal,
      ...p ? { duplex: "half" } : {},
      method: "GET",
      ...l
    };
    c && (y.method = c.toUpperCase());
    try {
      return await this.fetch.call(void 0, e, y);
    } finally {
      clearTimeout(h);
    }
  }
  async shouldRetry(e) {
    let t = e.headers.get("x-should-retry");
    return t === "true" ? !0 : t === "false" ? !1 : e.status === 408 || e.status === 409 || e.status === 429 || e.status >= 500;
  }
  async retryRequest(e, t, r, n) {
    let o, c = n?.get("retry-after-ms");
    if (c) {
      let h = parseFloat(c);
      Number.isNaN(h) || (o = h);
    }
    let l = n?.get("retry-after");
    if (l && !o) {
      let h = parseFloat(l);
      Number.isNaN(h) ? o = Date.parse(l) - Date.now() : o = h * 1e3;
    }
    if (!(o && 0 <= o && o < 60 * 1e3)) {
      let h = e.maxRetries ?? this.maxRetries;
      o = this.calculateDefaultRetryTimeoutMillis(t, h);
    }
    return await nr(o), this.makeRequest(e, t - 1, r);
  }
  calculateDefaultRetryTimeoutMillis(e, t) {
    let o = t - e, c = Math.min(0.5 * Math.pow(2, o), 8), l = 1 - Math.random() * 0.25;
    return c * l * 1e3;
  }
  calculateNonstreamingTimeout(e, t) {
    if (36e5 * e / 128e3 > 6e5 || t != null && e > t)
      throw new d("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#long-requests for more details");
    return 6e5;
  }
  async buildRequest(e, { retryCount: t = 0 } = {}) {
    let r = { ...e }, { method: n, path: o, query: c, defaultBaseURL: l } = r, h = this.buildURL(o, c, l);
    "timeout" in r && sr("timeout", r.timeout), r.timeout = r.timeout ?? this.timeout;
    let { bodyHeaders: p, body: y } = this.buildBody({ options: r }), w = await this.buildHeaders({ options: e, method: n, bodyHeaders: p, retryCount: t });
    return { req: {
      method: n,
      headers: w,
      ...r.signal && { signal: r.signal },
      ...globalThis.ReadableStream && y instanceof globalThis.ReadableStream && { duplex: "half" },
      ...y && { body: y },
      ...this.fetchOptions ?? {},
      ...r.fetchOptions ?? {}
    }, url: h, timeout: r.timeout };
  }
  async buildHeaders({ options: e, method: t, bodyHeaders: r, retryCount: n }) {
    let o = {};
    this.idempotencyHeader && t !== "get" && (e.idempotencyKey || (e.idempotencyKey = this.defaultIdempotencyKey()), o[this.idempotencyHeader] = e.idempotencyKey);
    let c = f([
      o,
      {
        Accept: "application/json",
        "User-Agent": this.getUserAgent(),
        "X-Stainless-Retry-Count": String(n),
        ...e.timeout ? { "X-Stainless-Timeout": String(Math.trunc(e.timeout / 1e3)) } : {},
        ...lr(),
        ...this._options.dangerouslyAllowBrowser ? { "anthropic-dangerous-direct-browser-access": "true" } : void 0,
        "anthropic-version": "2023-06-01"
      },
      await this.authHeaders(e),
      this._options.defaultHeaders,
      r,
      e.headers
    ]);
    return this.validateHeaders(c), c.values;
  }
  buildBody({ options: { body: e, headers: t } }) {
    if (!e)
      return { bodyHeaders: void 0, body: void 0 };
    let r = f([t]);
    return (
      // Pass raw type verbatim
      ArrayBuffer.isView(e) || e instanceof ArrayBuffer || e instanceof DataView || typeof e == "string" && // Preserve legacy string encoding behavior for now
      r.values.has("content-type") || // `Blob` is superset of `File`
      globalThis.Blob && e instanceof globalThis.Blob || // `FormData` -> `multipart/form-data`
      e instanceof FormData || // `URLSearchParams` -> `application/x-www-form-urlencoded`
      e instanceof URLSearchParams || // Send chunked stream (each chunk has own `length`)
      globalThis.ReadableStream && e instanceof globalThis.ReadableStream ? { bodyHeaders: void 0, body: e } : typeof e == "object" && (Symbol.asyncIterator in e || Symbol.iterator in e && "next" in e && typeof e.next == "function") ? { bodyHeaders: void 0, body: Ye(e) } : a(this, St, "f").call(this, { body: e, headers: r })
    );
  }
};
zt = b, St = /* @__PURE__ */ new WeakMap(), Gt = /* @__PURE__ */ new WeakSet(), $r = /* @__PURE__ */ i(function() {
  return this.baseURL !== "https://api.anthropic.com";
}, "_BaseAnthropic_baseURLOverridden");
b.Anthropic = zt;
b.HUMAN_PROMPT = qr;
b.AI_PROMPT = Lr;
b.DEFAULT_TIMEOUT = 6e5;
b.AnthropicError = d;
b.APIError = S;
b.APIConnectionError = D;
b.APIConnectionTimeoutError = oe;
b.APIUserAbortError = P;
b.NotFoundError = le;
b.ConflictError = ue;
b.RateLimitError = de;
b.BadRequestError = ie;
b.AuthenticationError = ae;
b.InternalServerError = fe;
b.PermissionDeniedError = ce;
b.UnprocessableEntityError = he;
b.toFile = nt;
var z = class extends b {
  static {
    i(this, "Anthropic");
  }
  constructor() {
    super(...arguments), this.completions = new re(this), this.messages = new G(this), this.models = new ne(this), this.beta = new v(this);
  }
};
z.Completions = re;
z.Messages = G;
z.Models = ne;
z.Beta = v;
export {
  Lr as AI_PROMPT,
  D as APIConnectionError,
  oe as APIConnectionTimeoutError,
  S as APIError,
  Q as APIPromise,
  P as APIUserAbortError,
  z as Anthropic,
  d as AnthropicError,
  ae as AuthenticationError,
  ie as BadRequestError,
  b as BaseAnthropic,
  ue as ConflictError,
  qr as HUMAN_PROMPT,
  fe as InternalServerError,
  le as NotFoundError,
  Be as PagePromise,
  ce as PermissionDeniedError,
  de as RateLimitError,
  he as UnprocessableEntityError,
  z as default,
  nt as toFile
};
//# sourceMappingURL=345QQBJG.js.map
