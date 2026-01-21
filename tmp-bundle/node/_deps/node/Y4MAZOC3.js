import {
  a as o,
  b as m,
  d as w
} from "./V7X2J7BI.js";

// node_modules/ms/index.js
var ne = w((gt, re) => {
  var L = 1e3, B = L * 60, q = B * 60, T = q * 24, xe = T * 7, Pe = T * 365.25;
  re.exports = function(e, r) {
    r = r || {};
    var t = typeof e;
    if (t === "string" && e.length > 0)
      return Ie(e);
    if (t === "number" && isFinite(e))
      return r.long ? Ae(e) : Re(e);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(e)
    );
  };
  function Ie(e) {
    if (e = String(e), !(e.length > 100)) {
      var r = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        e
      );
      if (r) {
        var t = parseFloat(r[1]), n = (r[2] || "ms").toLowerCase();
        switch (n) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return t * Pe;
          case "weeks":
          case "week":
          case "w":
            return t * xe;
          case "days":
          case "day":
          case "d":
            return t * T;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return t * q;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return t * B;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return t * L;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return t;
          default:
            return;
        }
      }
    }
  }
  o(Ie, "parse");
  function Re(e) {
    var r = Math.abs(e);
    return r >= T ? Math.round(e / T) + "d" : r >= q ? Math.round(e / q) + "h" : r >= B ? Math.round(e / B) + "m" : r >= L ? Math.round(e / L) + "s" : e + "ms";
  }
  o(Re, "fmtShort");
  function Ae(e) {
    var r = Math.abs(e);
    return r >= T ? U(e, r, T, "day") : r >= q ? U(e, r, q, "hour") : r >= B ? U(e, r, B, "minute") : r >= L ? U(e, r, L, "second") : e + " ms";
  }
  o(Ae, "fmtLong");
  function U(e, r, t, n) {
    var s = r >= t * 1.5;
    return Math.round(e / t) + " " + n + (s ? "s" : "");
  }
  o(U, "plural");
});

// node_modules/debug/src/common.js
var Y = w((mt, se) => {
  function Me(e) {
    t.debug = t, t.default = t, t.coerce = P, t.disable = g, t.enable = s, t.enabled = b, t.humanize = ne(), t.destroy = A, Object.keys(e).forEach((i) => {
      t[i] = e[i];
    }), t.names = [], t.skips = [], t.formatters = {};
    function r(i) {
      let c = 0;
      for (let u = 0; u < i.length; u++)
        c = (c << 5) - c + i.charCodeAt(u), c |= 0;
      return t.colors[Math.abs(c) % t.colors.length];
    }
    o(r, "selectColor"), t.selectColor = r;
    function t(i) {
      let c, u = null, f, F;
      function p(...h) {
        if (!p.enabled)
          return;
        let x = p, S = Number(/* @__PURE__ */ new Date()), M = S - (c || S);
        x.diff = M, x.prev = c, x.curr = S, c = S, h[0] = t.coerce(h[0]), typeof h[0] != "string" && h.unshift("%O");
        let I = 0;
        h[0] = h[0].replace(/%([a-zA-Z%])/g, (j, N) => {
          if (j === "%%")
            return "%";
          I++;
          let te = t.formatters[N];
          if (typeof te == "function") {
            let Ee = h[I];
            j = te.call(x, Ee), h.splice(I, 1), I--;
          }
          return j;
        }), t.formatArgs.call(x, h), (x.log || t.log).apply(x, h);
      }
      return o(p, "debug"), p.namespace = i, p.useColors = t.useColors(), p.color = t.selectColor(i), p.extend = n, p.destroy = t.destroy, Object.defineProperty(p, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: /* @__PURE__ */ o(() => u !== null ? u : (f !== t.namespaces && (f = t.namespaces, F = t.enabled(i)), F), "get"),
        set: /* @__PURE__ */ o((h) => {
          u = h;
        }, "set")
      }), typeof t.init == "function" && t.init(p), p;
    }
    o(t, "createDebug");
    function n(i, c) {
      let u = t(this.namespace + (typeof c > "u" ? ":" : c) + i);
      return u.log = this.log, u;
    }
    o(n, "extend");
    function s(i) {
      t.save(i), t.namespaces = i, t.names = [], t.skips = [];
      let c = (typeof i == "string" ? i : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (let u of c)
        u[0] === "-" ? t.skips.push(u.slice(1)) : t.names.push(u);
    }
    o(s, "enable");
    function a(i, c) {
      let u = 0, f = 0, F = -1, p = 0;
      for (; u < i.length; )
        if (f < c.length && (c[f] === i[u] || c[f] === "*"))
          c[f] === "*" ? (F = f, p = u, f++) : (u++, f++);
        else if (F !== -1)
          f = F + 1, p++, u = p;
        else
          return !1;
      for (; f < c.length && c[f] === "*"; )
        f++;
      return f === c.length;
    }
    o(a, "matchesTemplate");
    function g() {
      let i = [
        ...t.names,
        ...t.skips.map((c) => "-" + c)
      ].join(",");
      return t.enable(""), i;
    }
    o(g, "disable");
    function b(i) {
      for (let c of t.skips)
        if (a(i, c))
          return !1;
      for (let c of t.names)
        if (a(i, c))
          return !0;
      return !1;
    }
    o(b, "enabled");
    function P(i) {
      return i instanceof Error ? i.stack || i.message : i;
    }
    o(P, "coerce");
    function A() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return o(A, "destroy"), t.enable(t.load()), t;
  }
  o(Me, "setup");
  se.exports = Me;
});

// node_modules/debug/src/browser.js
var oe = w((C, H) => {
  C.formatArgs = Te;
  C.save = Ne;
  C.load = Le;
  C.useColors = je;
  C.storage = Be();
  C.destroy = /* @__PURE__ */ (() => {
    let e = !1;
    return () => {
      e || (e = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
    };
  })();
  C.colors = [
    "#0000CC",
    "#0000FF",
    "#0033CC",
    "#0033FF",
    "#0066CC",
    "#0066FF",
    "#0099CC",
    "#0099FF",
    "#00CC00",
    "#00CC33",
    "#00CC66",
    "#00CC99",
    "#00CCCC",
    "#00CCFF",
    "#3300CC",
    "#3300FF",
    "#3333CC",
    "#3333FF",
    "#3366CC",
    "#3366FF",
    "#3399CC",
    "#3399FF",
    "#33CC00",
    "#33CC33",
    "#33CC66",
    "#33CC99",
    "#33CCCC",
    "#33CCFF",
    "#6600CC",
    "#6600FF",
    "#6633CC",
    "#6633FF",
    "#66CC00",
    "#66CC33",
    "#9900CC",
    "#9900FF",
    "#9933CC",
    "#9933FF",
    "#99CC00",
    "#99CC33",
    "#CC0000",
    "#CC0033",
    "#CC0066",
    "#CC0099",
    "#CC00CC",
    "#CC00FF",
    "#CC3300",
    "#CC3333",
    "#CC3366",
    "#CC3399",
    "#CC33CC",
    "#CC33FF",
    "#CC6600",
    "#CC6633",
    "#CC9900",
    "#CC9933",
    "#CCCC00",
    "#CCCC33",
    "#FF0000",
    "#FF0033",
    "#FF0066",
    "#FF0099",
    "#FF00CC",
    "#FF00FF",
    "#FF3300",
    "#FF3333",
    "#FF3366",
    "#FF3399",
    "#FF33CC",
    "#FF33FF",
    "#FF6600",
    "#FF6633",
    "#FF9900",
    "#FF9933",
    "#FFCC00",
    "#FFCC33"
  ];
  function je() {
    if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
      return !0;
    if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
      return !1;
    let e;
    return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
    typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    typeof navigator < "u" && navigator.userAgent && (e = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(e[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
    typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }
  o(je, "useColors");
  function Te(e) {
    if (e[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + e[0] + (this.useColors ? "%c " : " ") + "+" + H.exports.humanize(this.diff), !this.useColors)
      return;
    let r = "color: " + this.color;
    e.splice(1, 0, r, "color: inherit");
    let t = 0, n = 0;
    e[0].replace(/%[a-zA-Z%]/g, (s) => {
      s !== "%%" && (t++, s === "%c" && (n = t));
    }), e.splice(n, 0, r);
  }
  o(Te, "formatArgs");
  C.log = console.debug || console.log || (() => {
  });
  function Ne(e) {
    try {
      e ? C.storage.setItem("debug", e) : C.storage.removeItem("debug");
    } catch {
    }
  }
  o(Ne, "save");
  function Le() {
    let e;
    try {
      e = C.storage.getItem("debug") || C.storage.getItem("DEBUG");
    } catch {
    }
    return !e && typeof process < "u" && "env" in process && (e = process.env.DEBUG), e;
  }
  o(Le, "load");
  function Be() {
    try {
      return localStorage;
    } catch {
    }
  }
  o(Be, "localstorage");
  H.exports = Y()(C);
  var { formatters: qe } = H.exports;
  qe.j = function(e) {
    try {
      return JSON.stringify(e);
    } catch (r) {
      return "[UnexpectedJSONParseError]: " + r.message;
    }
  };
});

// node_modules/has-flag/index.js
var ce = w((vt, ie) => {
  "use strict";
  ie.exports = (e, r = process.argv) => {
    let t = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = r.indexOf(t + e), s = r.indexOf("--");
    return n !== -1 && (s === -1 || n < s);
  };
});

// node_modules/supports-color/index.js
var fe = w((wt, ae) => {
  "use strict";
  var De = m("os"), ue = m("tty"), O = ce(), { env: l } = process, R;
  O("no-color") || O("no-colors") || O("color=false") || O("color=never") ? R = 0 : (O("color") || O("colors") || O("color=true") || O("color=always")) && (R = 1);
  "FORCE_COLOR" in l && (l.FORCE_COLOR === "true" ? R = 1 : l.FORCE_COLOR === "false" ? R = 0 : R = l.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(l.FORCE_COLOR, 10), 3));
  function K(e) {
    return e === 0 ? !1 : {
      level: e,
      hasBasic: !0,
      has256: e >= 2,
      has16m: e >= 3
    };
  }
  o(K, "translateLevel");
  function Z(e, r) {
    if (R === 0)
      return 0;
    if (O("color=16m") || O("color=full") || O("color=truecolor"))
      return 3;
    if (O("color=256"))
      return 2;
    if (e && !r && R === void 0)
      return 0;
    let t = R || 0;
    if (l.TERM === "dumb")
      return t;
    if (process.platform === "win32") {
      let n = De.release().split(".");
      return Number(n[0]) >= 10 && Number(n[2]) >= 10586 ? Number(n[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in l)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((n) => n in l) || l.CI_NAME === "codeship" ? 1 : t;
    if ("TEAMCITY_VERSION" in l)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(l.TEAMCITY_VERSION) ? 1 : 0;
    if (l.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in l) {
      let n = parseInt((l.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (l.TERM_PROGRAM) {
        case "iTerm.app":
          return n >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(l.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(l.TERM) || "COLORTERM" in l ? 1 : t;
  }
  o(Z, "supportsColor");
  function ke(e) {
    let r = Z(e, e && e.isTTY);
    return K(r);
  }
  o(ke, "getSupportLevel");
  ae.exports = {
    supportsColor: ke,
    stdout: K(Z(!0, ue.isatty(1))),
    stderr: K(Z(!0, ue.isatty(2)))
  };
});

// node_modules/debug/src/node.js
var de = w((d, z) => {
  var $e = m("tty"), G = m("util");
  d.init = We;
  d.log = ze;
  d.formatArgs = He;
  d.save = Ve;
  d.load = Je;
  d.useColors = Ue;
  d.destroy = G.deprecate(
    () => {
    },
    "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
  );
  d.colors = [6, 2, 3, 4, 5, 1];
  try {
    let e = fe();
    e && (e.stderr || e).level >= 2 && (d.colors = [
      20,
      21,
      26,
      27,
      32,
      33,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      56,
      57,
      62,
      63,
      68,
      69,
      74,
      75,
      76,
      77,
      78,
      79,
      80,
      81,
      92,
      93,
      98,
      99,
      112,
      113,
      128,
      129,
      134,
      135,
      148,
      149,
      160,
      161,
      162,
      163,
      164,
      165,
      166,
      167,
      168,
      169,
      170,
      171,
      172,
      173,
      178,
      179,
      184,
      185,
      196,
      197,
      198,
      199,
      200,
      201,
      202,
      203,
      204,
      205,
      206,
      207,
      208,
      209,
      214,
      215,
      220,
      221
    ]);
  } catch {
  }
  d.inspectOpts = Object.keys(process.env).filter((e) => /^debug_/i.test(e)).reduce((e, r) => {
    let t = r.substring(6).toLowerCase().replace(/_([a-z])/g, (s, a) => a.toUpperCase()), n = process.env[r];
    return /^(yes|on|true|enabled)$/i.test(n) ? n = !0 : /^(no|off|false|disabled)$/i.test(n) ? n = !1 : n === "null" ? n = null : n = Number(n), e[t] = n, e;
  }, {});
  function Ue() {
    return "colors" in d.inspectOpts ? !!d.inspectOpts.colors : $e.isatty(process.stderr.fd);
  }
  o(Ue, "useColors");
  function He(e) {
    let { namespace: r, useColors: t } = this;
    if (t) {
      let n = this.color, s = "\x1B[3" + (n < 8 ? n : "8;5;" + n), a = `  ${s};1m${r} \x1B[0m`;
      e[0] = a + e[0].split(`
`).join(`
` + a), e.push(s + "m+" + z.exports.humanize(this.diff) + "\x1B[0m");
    } else
      e[0] = Ge() + r + " " + e[0];
  }
  o(He, "formatArgs");
  function Ge() {
    return d.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
  }
  o(Ge, "getDate");
  function ze(...e) {
    return process.stderr.write(G.formatWithOptions(d.inspectOpts, ...e) + `
`);
  }
  o(ze, "log");
  function Ve(e) {
    e ? process.env.DEBUG = e : delete process.env.DEBUG;
  }
  o(Ve, "save");
  function Je() {
    return process.env.DEBUG;
  }
  o(Je, "load");
  function We(e) {
    e.inspectOpts = {};
    let r = Object.keys(d.inspectOpts);
    for (let t = 0; t < r.length; t++)
      e.inspectOpts[r[t]] = d.inspectOpts[r[t]];
  }
  o(We, "init");
  z.exports = Y()(d);
  var { formatters: le } = z.exports;
  le.o = function(e) {
    return this.inspectOpts.colors = this.useColors, G.inspect(e, this.inspectOpts).split(`
`).map((r) => r.trim()).join(" ");
  };
  le.O = function(e) {
    return this.inspectOpts.colors = this.useColors, G.inspect(e, this.inspectOpts);
  };
});

// node_modules/debug/src/index.js
var X = w((Et, Q) => {
  typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Q.exports = oe() : Q.exports = de();
});

// node_modules/agent-base/dist/helpers.js
var Ce = w((y) => {
  "use strict";
  var Ye = y && y.__createBinding || (Object.create ? (function(e, r, t, n) {
    n === void 0 && (n = t);
    var s = Object.getOwnPropertyDescriptor(r, t);
    (!s || ("get" in s ? !r.__esModule : s.writable || s.configurable)) && (s = { enumerable: !0, get: /* @__PURE__ */ o(function() {
      return r[t];
    }, "get") }), Object.defineProperty(e, n, s);
  }) : (function(e, r, t, n) {
    n === void 0 && (n = t), e[n] = r[t];
  })), Ke = y && y.__setModuleDefault || (Object.create ? (function(e, r) {
    Object.defineProperty(e, "default", { enumerable: !0, value: r });
  }) : function(e, r) {
    e.default = r;
  }), pe = y && y.__importStar || function(e) {
    if (e && e.__esModule) return e;
    var r = {};
    if (e != null) for (var t in e) t !== "default" && Object.prototype.hasOwnProperty.call(e, t) && Ye(r, e, t);
    return Ke(r, e), r;
  };
  Object.defineProperty(y, "__esModule", { value: !0 });
  y.req = y.json = y.toBuffer = void 0;
  var Ze = pe(m("http")), Qe = pe(m("https"));
  async function he(e) {
    let r = 0, t = [];
    for await (let n of e)
      r += n.length, t.push(n);
    return Buffer.concat(t, r);
  }
  o(he, "toBuffer");
  y.toBuffer = he;
  async function Xe(e) {
    let t = (await he(e)).toString("utf8");
    try {
      return JSON.parse(t);
    } catch (n) {
      let s = n;
      throw s.message += ` (input: ${t})`, s;
    }
  }
  o(Xe, "json");
  y.json = Xe;
  function et(e, r = {}) {
    let n = ((typeof e == "string" ? e : e.href).startsWith("https:") ? Qe : Ze).request(e, r), s = new Promise((a, g) => {
      n.once("response", a).once("error", g).end();
    });
    return n.then = s.then.bind(s), n;
  }
  o(et, "req");
  y.req = et;
});

// node_modules/agent-base/dist/index.js
var me = w((_) => {
  "use strict";
  var ge = _ && _.__createBinding || (Object.create ? (function(e, r, t, n) {
    n === void 0 && (n = t);
    var s = Object.getOwnPropertyDescriptor(r, t);
    (!s || ("get" in s ? !r.__esModule : s.writable || s.configurable)) && (s = { enumerable: !0, get: /* @__PURE__ */ o(function() {
      return r[t];
    }, "get") }), Object.defineProperty(e, n, s);
  }) : (function(e, r, t, n) {
    n === void 0 && (n = t), e[n] = r[t];
  })), tt = _ && _.__setModuleDefault || (Object.create ? (function(e, r) {
    Object.defineProperty(e, "default", { enumerable: !0, value: r });
  }) : function(e, r) {
    e.default = r;
  }), be = _ && _.__importStar || function(e) {
    if (e && e.__esModule) return e;
    var r = {};
    if (e != null) for (var t in e) t !== "default" && Object.prototype.hasOwnProperty.call(e, t) && ge(r, e, t);
    return tt(r, e), r;
  }, rt = _ && _.__exportStar || function(e, r) {
    for (var t in e) t !== "default" && !Object.prototype.hasOwnProperty.call(r, t) && ge(r, e, t);
  };
  Object.defineProperty(_, "__esModule", { value: !0 });
  _.Agent = void 0;
  var nt = be(m("net")), ye = be(m("http")), st = m("https");
  rt(Ce(), _);
  var E = Symbol("AgentBaseInternalState"), ee = class extends ye.Agent {
    static {
      o(this, "Agent");
    }
    constructor(r) {
      super(r), this[E] = {};
    }
    /**
     * Determine whether this is an `http` or `https` request.
     */
    isSecureEndpoint(r) {
      if (r) {
        if (typeof r.secureEndpoint == "boolean")
          return r.secureEndpoint;
        if (typeof r.protocol == "string")
          return r.protocol === "https:";
      }
      let { stack: t } = new Error();
      return typeof t != "string" ? !1 : t.split(`
`).some((n) => n.indexOf("(https.js:") !== -1 || n.indexOf("node:https:") !== -1);
    }
    // In order to support async signatures in `connect()` and Node's native
    // connection pooling in `http.Agent`, the array of sockets for each origin
    // has to be updated synchronously. This is so the length of the array is
    // accurate when `addRequest()` is next called. We achieve this by creating a
    // fake socket and adding it to `sockets[origin]` and incrementing
    // `totalSocketCount`.
    incrementSockets(r) {
      if (this.maxSockets === 1 / 0 && this.maxTotalSockets === 1 / 0)
        return null;
      this.sockets[r] || (this.sockets[r] = []);
      let t = new nt.Socket({ writable: !1 });
      return this.sockets[r].push(t), this.totalSocketCount++, t;
    }
    decrementSockets(r, t) {
      if (!this.sockets[r] || t === null)
        return;
      let n = this.sockets[r], s = n.indexOf(t);
      s !== -1 && (n.splice(s, 1), this.totalSocketCount--, n.length === 0 && delete this.sockets[r]);
    }
    // In order to properly update the socket pool, we need to call `getName()` on
    // the core `https.Agent` if it is a secureEndpoint.
    getName(r) {
      return this.isSecureEndpoint(r) ? st.Agent.prototype.getName.call(this, r) : super.getName(r);
    }
    createSocket(r, t, n) {
      let s = {
        ...t,
        secureEndpoint: this.isSecureEndpoint(t)
      }, a = this.getName(s), g = this.incrementSockets(a);
      Promise.resolve().then(() => this.connect(r, s)).then((b) => {
        if (this.decrementSockets(a, g), b instanceof ye.Agent)
          try {
            return b.addRequest(r, s);
          } catch (P) {
            return n(P);
          }
        this[E].currentSocket = b, super.createSocket(r, t, n);
      }, (b) => {
        this.decrementSockets(a, g), n(b);
      });
    }
    createConnection() {
      let r = this[E].currentSocket;
      if (this[E].currentSocket = void 0, !r)
        throw new Error("No socket was returned in the `connect()` function");
      return r;
    }
    get defaultPort() {
      return this[E].defaultPort ?? (this.protocol === "https:" ? 443 : 80);
    }
    set defaultPort(r) {
      this[E] && (this[E].defaultPort = r);
    }
    get protocol() {
      return this[E].protocol ?? (this.isSecureEndpoint() ? "https:" : "http:");
    }
    set protocol(r) {
      this[E] && (this[E].protocol = r);
    }
  };
  _.Agent = ee;
});

// node_modules/https-proxy-agent/dist/parse-proxy-response.js
var _e = w((D) => {
  "use strict";
  var ot = D && D.__importDefault || function(e) {
    return e && e.__esModule ? e : { default: e };
  };
  Object.defineProperty(D, "__esModule", { value: !0 });
  D.parseProxyResponse = void 0;
  var it = ot(X()), V = (0, it.default)("https-proxy-agent:parse-proxy-response");
  function ct(e) {
    return new Promise((r, t) => {
      let n = 0, s = [];
      function a() {
        let i = e.read();
        i ? A(i) : e.once("readable", a);
      }
      o(a, "read");
      function g() {
        e.removeListener("end", b), e.removeListener("error", P), e.removeListener("readable", a);
      }
      o(g, "cleanup");
      function b() {
        g(), V("onend"), t(new Error("Proxy connection ended before receiving CONNECT response"));
      }
      o(b, "onend");
      function P(i) {
        g(), V("onerror %o", i), t(i);
      }
      o(P, "onerror");
      function A(i) {
        s.push(i), n += i.length;
        let c = Buffer.concat(s, n), u = c.indexOf(`\r
\r
`);
        if (u === -1) {
          V("have not received end of HTTP headers yet..."), a();
          return;
        }
        let f = c.slice(0, u).toString("ascii").split(`\r
`), F = f.shift();
        if (!F)
          return e.destroy(), t(new Error("No header received from proxy CONNECT response"));
        let p = F.split(" "), h = +p[1], x = p.slice(2).join(" "), S = {};
        for (let M of f) {
          if (!M)
            continue;
          let I = M.indexOf(":");
          if (I === -1)
            return e.destroy(), t(new Error(`Invalid header from proxy CONNECT response: "${M}"`));
          let $ = M.slice(0, I).toLowerCase(), j = M.slice(I + 1).trimStart(), N = S[$];
          typeof N == "string" ? S[$] = [N, j] : Array.isArray(N) ? N.push(j) : S[$] = j;
        }
        V("got proxy server response: %o %o", F, S), g(), r({
          connect: {
            statusCode: h,
            statusText: x,
            headers: S
          },
          buffered: c
        });
      }
      o(A, "ondata"), e.on("error", P), e.on("end", b), a();
    });
  }
  o(ct, "parseProxyResponse");
  D.parseProxyResponse = ct;
});

// node_modules/https-proxy-agent/dist/index.js
var yt = w((v) => {
  var ut = v && v.__createBinding || (Object.create ? (function(e, r, t, n) {
    n === void 0 && (n = t);
    var s = Object.getOwnPropertyDescriptor(r, t);
    (!s || ("get" in s ? !r.__esModule : s.writable || s.configurable)) && (s = { enumerable: !0, get: /* @__PURE__ */ o(function() {
      return r[t];
    }, "get") }), Object.defineProperty(e, n, s);
  }) : (function(e, r, t, n) {
    n === void 0 && (n = t), e[n] = r[t];
  })), at = v && v.__setModuleDefault || (Object.create ? (function(e, r) {
    Object.defineProperty(e, "default", { enumerable: !0, value: r });
  }) : function(e, r) {
    e.default = r;
  }), Fe = v && v.__importStar || function(e) {
    if (e && e.__esModule) return e;
    var r = {};
    if (e != null) for (var t in e) t !== "default" && Object.prototype.hasOwnProperty.call(e, t) && ut(r, e, t);
    return at(r, e), r;
  }, Se = v && v.__importDefault || function(e) {
    return e && e.__esModule ? e : { default: e };
  };
  Object.defineProperty(v, "__esModule", { value: !0 });
  v.HttpsProxyAgent = void 0;
  var J = Fe(m("net")), Oe = Fe(m("tls")), ft = Se(m("assert")), lt = Se(X()), dt = me(), pt = m("url"), ht = _e(), k = (0, lt.default)("https-proxy-agent"), ve = /* @__PURE__ */ o((e) => e.servername === void 0 && e.host && !J.isIP(e.host) ? {
    ...e,
    servername: e.host
  } : e, "setServernameFromNonIpHost"), W = class extends dt.Agent {
    static {
      o(this, "HttpsProxyAgent");
    }
    constructor(r, t) {
      super(t), this.options = { path: void 0 }, this.proxy = typeof r == "string" ? new pt.URL(r) : r, this.proxyHeaders = t?.headers ?? {}, k("Creating new HttpsProxyAgent instance: %o", this.proxy.href);
      let n = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""), s = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
      this.connectOpts = {
        // Attempt to negotiate http/1.1 for proxy servers that support http/2
        ALPNProtocols: ["http/1.1"],
        ...t ? we(t, "headers") : null,
        host: n,
        port: s
      };
    }
    /**
     * Called when the node-core HTTP client library is creating a
     * new HTTP request.
     */
    async connect(r, t) {
      let { proxy: n } = this;
      if (!t.host)
        throw new TypeError('No "host" provided');
      let s;
      n.protocol === "https:" ? (k("Creating `tls.Socket`: %o", this.connectOpts), s = Oe.connect(ve(this.connectOpts))) : (k("Creating `net.Socket`: %o", this.connectOpts), s = J.connect(this.connectOpts));
      let a = typeof this.proxyHeaders == "function" ? this.proxyHeaders() : { ...this.proxyHeaders }, g = J.isIPv6(t.host) ? `[${t.host}]` : t.host, b = `CONNECT ${g}:${t.port} HTTP/1.1\r
`;
      if (n.username || n.password) {
        let u = `${decodeURIComponent(n.username)}:${decodeURIComponent(n.password)}`;
        a["Proxy-Authorization"] = `Basic ${Buffer.from(u).toString("base64")}`;
      }
      a.Host = `${g}:${t.port}`, a["Proxy-Connection"] || (a["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close");
      for (let u of Object.keys(a))
        b += `${u}: ${a[u]}\r
`;
      let P = (0, ht.parseProxyResponse)(s);
      s.write(`${b}\r
`);
      let { connect: A, buffered: i } = await P;
      if (r.emit("proxyConnect", A), this.emit("proxyConnect", A, r), A.statusCode === 200)
        return r.once("socket", Ct), t.secureEndpoint ? (k("Upgrading socket connection to TLS"), Oe.connect({
          ...we(ve(t), "host", "path", "port"),
          socket: s
        })) : s;
      s.destroy();
      let c = new J.Socket({ writable: !1 });
      return c.readable = !0, r.once("socket", (u) => {
        k("Replaying proxy buffer for failed request"), (0, ft.default)(u.listenerCount("data") > 0), u.push(i), u.push(null);
      }), c;
    }
  };
  W.protocols = ["http", "https"];
  v.HttpsProxyAgent = W;
  function Ct(e) {
    e.resume();
  }
  o(Ct, "resume");
  function we(e, ...r) {
    let t = {}, n;
    for (n in e)
      r.includes(n) || (t[n] = e[n]);
    return t;
  }
  o(we, "omit");
});
export default yt();
//# sourceMappingURL=Y4MAZOC3.js.map
