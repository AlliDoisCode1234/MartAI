import {
  m as Ho,
  x as Mu
} from "./4U34M3I6.js";
import {
  a as s,
  c as T,
  d as $o,
  e as Iu
} from "./RUVYHBJQ.js";

// node_modules/es-errors/type.js
var ae = T((hh, Bo) => {
  "use strict";
  Bo.exports = TypeError;
});

// (disabled):node_modules/object-inspect/util.inspect
var zo = T(() => {
});

// node_modules/object-inspect/index.js
var Ve = T((yh, pn) => {
  var jr = typeof Map == "function" && Map.prototype, qr = Object.getOwnPropertyDescriptor && jr ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null, Ct = jr && qr && typeof qr.get == "function" ? qr.get : null, jo = jr && Map.prototype.forEach, Wr = typeof Set == "function" && Set.prototype, Nr = Object.getOwnPropertyDescriptor && Wr ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null, It = Wr && Nr && typeof Nr.get == "function" ? Nr.get : null, Wo = Wr && Set.prototype.forEach, Gu = typeof WeakMap == "function" && WeakMap.prototype, je = Gu ? WeakMap.prototype.has : null, Du = typeof WeakSet == "function" && WeakSet.prototype, We = Du ? WeakSet.prototype.has : null, ku = typeof WeakRef == "function" && WeakRef.prototype, Ko = ku ? WeakRef.prototype.deref : null, qu = Boolean.prototype.valueOf, Nu = Object.prototype.toString, Fu = Function.prototype.toString, Lu = String.prototype.match, Kr = String.prototype.slice, Z = String.prototype.replace, Uu = String.prototype.toUpperCase, Vo = String.prototype.toLowerCase, on = RegExp.prototype.test, Qo = Array.prototype.concat, z = Array.prototype.join, $u = Array.prototype.slice, Jo = Math.floor, Ur = typeof BigInt == "function" ? BigInt.prototype.valueOf : null, Fr = Object.getOwnPropertySymbols, $r = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Symbol.prototype.toString : null, ge = typeof Symbol == "function" && typeof Symbol.iterator == "object", Ke = typeof Symbol == "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === ge || !0) ? Symbol.toStringTag : null, nn = Object.prototype.propertyIsEnumerable, Yo = (typeof Reflect == "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(t) {
    return t.__proto__;
  } : null);
  function Xo(t, e) {
    if (t === 1 / 0 || t === -1 / 0 || t !== t || t && t > -1e3 && t < 1e3 || on.call(/e/, e))
      return e;
    var r = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
    if (typeof t == "number") {
      var o = t < 0 ? -Jo(-t) : Jo(t);
      if (o !== t) {
        var i = String(o), a = Kr.call(e, i.length + 1);
        return Z.call(i, r, "$&_") + "." + Z.call(Z.call(a, /([0-9]{3})/g, "$&_"), /_$/, "");
      }
    }
    return Z.call(e, r, "$&_");
  }
  s(Xo, "addNumericSeparator");
  var Hr = zo(), Zo = Hr.custom, en = ln(Zo) ? Zo : null, sn = {
    __proto__: null,
    double: '"',
    single: "'"
  }, Hu = {
    __proto__: null,
    double: /(["\\])/g,
    single: /(['\\])/g
  };
  pn.exports = /* @__PURE__ */ s(function t(e, r, o, i) {
    var a = r || {};
    if (J(a, "quoteStyle") && !J(sn, a.quoteStyle))
      throw new TypeError('option "quoteStyle" must be "single" or "double"');
    if (J(a, "maxStringLength") && (typeof a.maxStringLength == "number" ? a.maxStringLength < 0 && a.maxStringLength !== 1 / 0 : a.maxStringLength !== null))
      throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    var l = J(a, "customInspect") ? a.customInspect : !0;
    if (typeof l != "boolean" && l !== "symbol")
      throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
    if (J(a, "indent") && a.indent !== null && a.indent !== "	" && !(parseInt(a.indent, 10) === a.indent && a.indent > 0))
      throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
    if (J(a, "numericSeparator") && typeof a.numericSeparator != "boolean")
      throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
    var p = a.numericSeparator;
    if (typeof e > "u")
      return "undefined";
    if (e === null)
      return "null";
    if (typeof e == "boolean")
      return e ? "true" : "false";
    if (typeof e == "string")
      return cn(e, a);
    if (typeof e == "number") {
      if (e === 0)
        return 1 / 0 / e > 0 ? "0" : "-0";
      var h = String(e);
      return p ? Xo(e, h) : h;
    }
    if (typeof e == "bigint") {
      var m = String(e) + "n";
      return p ? Xo(e, m) : m;
    }
    var u = typeof a.depth > "u" ? 5 : a.depth;
    if (typeof o > "u" && (o = 0), o >= u && u > 0 && typeof e == "object")
      return Br(e) ? "[Array]" : "[Object]";
    var d = sc(a, o);
    if (typeof i > "u")
      i = [];
    else if (un(i, e) >= 0)
      return "[Circular]";
    function c(H, X, Q) {
      if (X && (i = $u.call(i), i.push(X)), Q) {
        var Be = {
          depth: a.depth
        };
        return J(a, "quoteStyle") && (Be.quoteStyle = a.quoteStyle), t(H, Be, o + 1, i);
      }
      return t(H, a, o + 1, i);
    }
    if (s(c, "inspect"), typeof e == "function" && !tn(e)) {
      var y = Yu(e), f = At(e, c);
      return "[Function" + (y ? ": " + y : " (anonymous)") + "]" + (f.length > 0 ? " { " + z.call(f, ", ") + " }" : "");
    }
    if (ln(e)) {
      var g = ge ? Z.call(String(e), /^(Symbol\(.*\))_[^)]*$/, "$1") : $r.call(e);
      return typeof e == "object" && !ge ? ze(g) : g;
    }
    if (oc(e)) {
      for (var P = "<" + Vo.call(String(e.nodeName)), S = e.attributes || [], x = 0; x < S.length; x++)
        P += " " + S[x].name + "=" + an(Bu(S[x].value), "double", a);
      return P += ">", e.childNodes && e.childNodes.length && (P += "..."), P += "</" + Vo.call(String(e.nodeName)) + ">", P;
    }
    if (Br(e)) {
      if (e.length === 0)
        return "[]";
      var v = At(e, c);
      return d && !ic(v) ? "[" + zr(v, d) + "]" : "[ " + z.call(v, ", ") + " ]";
    }
    if (ju(e)) {
      var E = At(e, c);
      return !("cause" in Error.prototype) && "cause" in e && !nn.call(e, "cause") ? "{ [" + String(e) + "] " + z.call(Qo.call("[cause]: " + c(e.cause), E), ", ") + " }" : E.length === 0 ? "[" + String(e) + "]" : "{ [" + String(e) + "] " + z.call(E, ", ") + " }";
    }
    if (typeof e == "object" && l) {
      if (en && typeof e[en] == "function" && Hr)
        return Hr(e, { depth: u - o });
      if (l !== "symbol" && typeof e.inspect == "function")
        return e.inspect();
    }
    if (Xu(e)) {
      var w = [];
      return jo && jo.call(e, function(H, X) {
        w.push(c(X, e, !0) + " => " + c(H, e));
      }), rn("Map", Ct.call(e), w, d);
    }
    if (tc(e)) {
      var $ = [];
      return Wo && Wo.call(e, function(H) {
        $.push(c(H, e));
      }), rn("Set", It.call(e), $, d);
    }
    if (Zu(e))
      return Lr("WeakMap");
    if (rc(e))
      return Lr("WeakSet");
    if (ec(e))
      return Lr("WeakRef");
    if (Ku(e))
      return ze(c(Number(e)));
    if (Qu(e))
      return ze(c(Ur.call(e)));
    if (Vu(e))
      return ze(qu.call(e));
    if (Wu(e))
      return ze(c(String(e)));
    if (typeof window < "u" && e === window)
      return "{ [object Window] }";
    if (typeof globalThis < "u" && e === globalThis || typeof global < "u" && e === global)
      return "{ [object globalThis] }";
    if (!zu(e) && !tn(e)) {
      var I = At(e, c), F = Yo ? Yo(e) === Object.prototype : e instanceof Object || e.constructor === Object, q = e instanceof Object ? "" : "null prototype", M = !F && Ke && Object(e) === e && Ke in e ? Kr.call(ee(e), 8, -1) : q ? "Object" : "", ve = F || typeof e.constructor != "function" ? "" : e.constructor.name ? e.constructor.name + " " : "", Pe = ve + (M || q ? "[" + z.call(Qo.call([], M || [], q || []), ": ") + "] " : "");
      return I.length === 0 ? Pe + "{}" : d ? Pe + "{" + zr(I, d) + "}" : Pe + "{ " + z.call(I, ", ") + " }";
    }
    return String(e);
  }, "inspect_");
  function an(t, e, r) {
    var o = r.quoteStyle || e, i = sn[o];
    return i + t + i;
  }
  s(an, "wrapQuotes");
  function Bu(t) {
    return Z.call(String(t), /"/g, "&quot;");
  }
  s(Bu, "quote");
  function le(t) {
    return !Ke || !(typeof t == "object" && (Ke in t || typeof t[Ke] < "u"));
  }
  s(le, "canTrustToString");
  function Br(t) {
    return ee(t) === "[object Array]" && le(t);
  }
  s(Br, "isArray");
  function zu(t) {
    return ee(t) === "[object Date]" && le(t);
  }
  s(zu, "isDate");
  function tn(t) {
    return ee(t) === "[object RegExp]" && le(t);
  }
  s(tn, "isRegExp");
  function ju(t) {
    return ee(t) === "[object Error]" && le(t);
  }
  s(ju, "isError");
  function Wu(t) {
    return ee(t) === "[object String]" && le(t);
  }
  s(Wu, "isString");
  function Ku(t) {
    return ee(t) === "[object Number]" && le(t);
  }
  s(Ku, "isNumber");
  function Vu(t) {
    return ee(t) === "[object Boolean]" && le(t);
  }
  s(Vu, "isBoolean");
  function ln(t) {
    if (ge)
      return t && typeof t == "object" && t instanceof Symbol;
    if (typeof t == "symbol")
      return !0;
    if (!t || typeof t != "object" || !$r)
      return !1;
    try {
      return $r.call(t), !0;
    } catch {
    }
    return !1;
  }
  s(ln, "isSymbol");
  function Qu(t) {
    if (!t || typeof t != "object" || !Ur)
      return !1;
    try {
      return Ur.call(t), !0;
    } catch {
    }
    return !1;
  }
  s(Qu, "isBigInt");
  var Ju = Object.prototype.hasOwnProperty || function(t) {
    return t in this;
  };
  function J(t, e) {
    return Ju.call(t, e);
  }
  s(J, "has");
  function ee(t) {
    return Nu.call(t);
  }
  s(ee, "toStr");
  function Yu(t) {
    if (t.name)
      return t.name;
    var e = Lu.call(Fu.call(t), /^function\s*([\w$]+)/);
    return e ? e[1] : null;
  }
  s(Yu, "nameOf");
  function un(t, e) {
    if (t.indexOf)
      return t.indexOf(e);
    for (var r = 0, o = t.length; r < o; r++)
      if (t[r] === e)
        return r;
    return -1;
  }
  s(un, "indexOf");
  function Xu(t) {
    if (!Ct || !t || typeof t != "object")
      return !1;
    try {
      Ct.call(t);
      try {
        It.call(t);
      } catch {
        return !0;
      }
      return t instanceof Map;
    } catch {
    }
    return !1;
  }
  s(Xu, "isMap");
  function Zu(t) {
    if (!je || !t || typeof t != "object")
      return !1;
    try {
      je.call(t, je);
      try {
        We.call(t, We);
      } catch {
        return !0;
      }
      return t instanceof WeakMap;
    } catch {
    }
    return !1;
  }
  s(Zu, "isWeakMap");
  function ec(t) {
    if (!Ko || !t || typeof t != "object")
      return !1;
    try {
      return Ko.call(t), !0;
    } catch {
    }
    return !1;
  }
  s(ec, "isWeakRef");
  function tc(t) {
    if (!It || !t || typeof t != "object")
      return !1;
    try {
      It.call(t);
      try {
        Ct.call(t);
      } catch {
        return !0;
      }
      return t instanceof Set;
    } catch {
    }
    return !1;
  }
  s(tc, "isSet");
  function rc(t) {
    if (!We || !t || typeof t != "object")
      return !1;
    try {
      We.call(t, We);
      try {
        je.call(t, je);
      } catch {
        return !0;
      }
      return t instanceof WeakSet;
    } catch {
    }
    return !1;
  }
  s(rc, "isWeakSet");
  function oc(t) {
    return !t || typeof t != "object" ? !1 : typeof HTMLElement < "u" && t instanceof HTMLElement ? !0 : typeof t.nodeName == "string" && typeof t.getAttribute == "function";
  }
  s(oc, "isElement");
  function cn(t, e) {
    if (t.length > e.maxStringLength) {
      var r = t.length - e.maxStringLength, o = "... " + r + " more character" + (r > 1 ? "s" : "");
      return cn(Kr.call(t, 0, e.maxStringLength), e) + o;
    }
    var i = Hu[e.quoteStyle || "single"];
    i.lastIndex = 0;
    var a = Z.call(Z.call(t, i, "\\$1"), /[\x00-\x1f]/g, nc);
    return an(a, "single", e);
  }
  s(cn, "inspectString");
  function nc(t) {
    var e = t.charCodeAt(0), r = {
      8: "b",
      9: "t",
      10: "n",
      12: "f",
      13: "r"
    }[e];
    return r ? "\\" + r : "\\x" + (e < 16 ? "0" : "") + Uu.call(e.toString(16));
  }
  s(nc, "lowbyte");
  function ze(t) {
    return "Object(" + t + ")";
  }
  s(ze, "markBoxed");
  function Lr(t) {
    return t + " { ? }";
  }
  s(Lr, "weakCollectionOf");
  function rn(t, e, r, o) {
    var i = o ? zr(r, o) : z.call(r, ", ");
    return t + " (" + e + ") {" + i + "}";
  }
  s(rn, "collectionOf");
  function ic(t) {
    for (var e = 0; e < t.length; e++)
      if (un(t[e], `
`) >= 0)
        return !1;
    return !0;
  }
  s(ic, "singleLineValues");
  function sc(t, e) {
    var r;
    if (t.indent === "	")
      r = "	";
    else if (typeof t.indent == "number" && t.indent > 0)
      r = z.call(Array(t.indent + 1), " ");
    else
      return null;
    return {
      base: r,
      prev: z.call(Array(e + 1), r)
    };
  }
  s(sc, "getIndent");
  function zr(t, e) {
    if (t.length === 0)
      return "";
    var r = `
` + e.prev + e.base;
    return r + z.call(t, "," + r) + `
` + e.prev;
  }
  s(zr, "indentedJoin");
  function At(t, e) {
    var r = Br(t), o = [];
    if (r) {
      o.length = t.length;
      for (var i = 0; i < t.length; i++)
        o[i] = J(t, i) ? e(t[i], t) : "";
    }
    var a = typeof Fr == "function" ? Fr(t) : [], l;
    if (ge) {
      l = {};
      for (var p = 0; p < a.length; p++)
        l["$" + a[p]] = a[p];
    }
    for (var h in t)
      J(t, h) && (r && String(Number(h)) === h && h < t.length || ge && l["$" + h] instanceof Symbol || (on.call(/[^\w$]/, h) ? o.push(e(h, t) + ": " + e(t[h], t)) : o.push(h + ": " + e(t[h], t))));
    if (typeof Fr == "function")
      for (var m = 0; m < a.length; m++)
        nn.call(t, a[m]) && o.push("[" + e(a[m]) + "]: " + e(t[a[m]], t));
    return o;
  }
  s(At, "arrObjKeys");
});

// node_modules/side-channel-list/index.js
var hn = T((Ph, dn) => {
  "use strict";
  var ac = Ve(), lc = ae(), Mt = /* @__PURE__ */ s(function(t, e, r) {
    for (var o = t, i; (i = o.next) != null; o = i)
      if (i.key === e)
        return o.next = i.next, r || (i.next = /** @type {NonNullable<typeof list.next>} */
        t.next, t.next = i), i;
  }, "listGetNode"), uc = /* @__PURE__ */ s(function(t, e) {
    if (t) {
      var r = Mt(t, e);
      return r && r.value;
    }
  }, "listGet"), cc = /* @__PURE__ */ s(function(t, e, r) {
    var o = Mt(t, e);
    o ? o.value = r : t.next = /** @type {import('./list.d.ts').ListNode<typeof value, typeof key>} */
    {
      // eslint-disable-line no-param-reassign, no-extra-parens
      key: e,
      next: t.next,
      value: r
    };
  }, "listSet"), pc = /* @__PURE__ */ s(function(t, e) {
    return t ? !!Mt(t, e) : !1;
  }, "listHas"), dc = /* @__PURE__ */ s(function(t, e) {
    if (t)
      return Mt(t, e, !0);
  }, "listDelete");
  dn.exports = /* @__PURE__ */ s(function() {
    var e, r = {
      assert: /* @__PURE__ */ s(function(o) {
        if (!r.has(o))
          throw new lc("Side channel does not contain " + ac(o));
      }, "assert"),
      delete: /* @__PURE__ */ s(function(o) {
        var i = e && e.next, a = dc(e, o);
        return a && i && i === a && (e = void 0), !!a;
      }, "delete"),
      get: /* @__PURE__ */ s(function(o) {
        return uc(e, o);
      }, "get"),
      has: /* @__PURE__ */ s(function(o) {
        return pc(e, o);
      }, "has"),
      set: /* @__PURE__ */ s(function(o, i) {
        e || (e = {
          next: void 0
        }), cc(
          /** @type {NonNullable<typeof $o>} */
          e,
          o,
          i
        );
      }, "set")
    };
    return r;
  }, "getSideChannelList");
});

// node_modules/es-object-atoms/index.js
var Vr = T((Th, mn) => {
  "use strict";
  mn.exports = Object;
});

// node_modules/es-errors/index.js
var yn = T((Sh, fn) => {
  "use strict";
  fn.exports = Error;
});

// node_modules/es-errors/eval.js
var Pn = T((_h, vn) => {
  "use strict";
  vn.exports = EvalError;
});

// node_modules/es-errors/range.js
var Tn = T((Eh, gn) => {
  "use strict";
  gn.exports = RangeError;
});

// node_modules/es-errors/ref.js
var _n = T((xh, Sn) => {
  "use strict";
  Sn.exports = ReferenceError;
});

// node_modules/es-errors/syntax.js
var xn = T((bh, En) => {
  "use strict";
  En.exports = SyntaxError;
});

// node_modules/es-errors/uri.js
var On = T((Oh, bn) => {
  "use strict";
  bn.exports = URIError;
});

// node_modules/math-intrinsics/abs.js
var Rn = T((wh, wn) => {
  "use strict";
  wn.exports = Math.abs;
});

// node_modules/math-intrinsics/floor.js
var Cn = T((Rh, An) => {
  "use strict";
  An.exports = Math.floor;
});

// node_modules/math-intrinsics/max.js
var Mn = T((Ah, In) => {
  "use strict";
  In.exports = Math.max;
});

// node_modules/math-intrinsics/min.js
var Dn = T((Ch, Gn) => {
  "use strict";
  Gn.exports = Math.min;
});

// node_modules/math-intrinsics/pow.js
var qn = T((Ih, kn) => {
  "use strict";
  kn.exports = Math.pow;
});

// node_modules/math-intrinsics/round.js
var Fn = T((Mh, Nn) => {
  "use strict";
  Nn.exports = Math.round;
});

// node_modules/math-intrinsics/isNaN.js
var Un = T((Gh, Ln) => {
  "use strict";
  Ln.exports = Number.isNaN || /* @__PURE__ */ s(function(e) {
    return e !== e;
  }, "isNaN");
});

// node_modules/math-intrinsics/sign.js
var Hn = T((kh, $n) => {
  "use strict";
  var hc = Un();
  $n.exports = /* @__PURE__ */ s(function(e) {
    return hc(e) || e === 0 ? e : e < 0 ? -1 : 1;
  }, "sign");
});

// node_modules/gopd/gOPD.js
var zn = T((Nh, Bn) => {
  "use strict";
  Bn.exports = Object.getOwnPropertyDescriptor;
});

// node_modules/gopd/index.js
var Qr = T((Fh, jn) => {
  "use strict";
  var Gt = zn();
  if (Gt)
    try {
      Gt([], "length");
    } catch {
      Gt = null;
    }
  jn.exports = Gt;
});

// node_modules/es-define-property/index.js
var Kn = T((Lh, Wn) => {
  "use strict";
  var Dt = Object.defineProperty || !1;
  if (Dt)
    try {
      Dt({}, "a", { value: 1 });
    } catch {
      Dt = !1;
    }
  Wn.exports = Dt;
});

// node_modules/has-symbols/shams.js
var Qn = T((Uh, Vn) => {
  "use strict";
  Vn.exports = /* @__PURE__ */ s(function() {
    if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
      return !1;
    if (typeof Symbol.iterator == "symbol")
      return !0;
    var e = {}, r = Symbol("test"), o = Object(r);
    if (typeof r == "string" || Object.prototype.toString.call(r) !== "[object Symbol]" || Object.prototype.toString.call(o) !== "[object Symbol]")
      return !1;
    var i = 42;
    e[r] = i;
    for (var a in e)
      return !1;
    if (typeof Object.keys == "function" && Object.keys(e).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(e).length !== 0)
      return !1;
    var l = Object.getOwnPropertySymbols(e);
    if (l.length !== 1 || l[0] !== r || !Object.prototype.propertyIsEnumerable.call(e, r))
      return !1;
    if (typeof Object.getOwnPropertyDescriptor == "function") {
      var p = (
        /** @type {PropertyDescriptor} */
        Object.getOwnPropertyDescriptor(e, r)
      );
      if (p.value !== i || p.enumerable !== !0)
        return !1;
    }
    return !0;
  }, "hasSymbols");
});

// node_modules/has-symbols/index.js
var Xn = T((Hh, Yn) => {
  "use strict";
  var Jn = typeof Symbol < "u" && Symbol, mc = Qn();
  Yn.exports = /* @__PURE__ */ s(function() {
    return typeof Jn != "function" || typeof Symbol != "function" || typeof Jn("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : mc();
  }, "hasNativeSymbols");
});

// node_modules/get-proto/Reflect.getPrototypeOf.js
var Jr = T((zh, Zn) => {
  "use strict";
  Zn.exports = typeof Reflect < "u" && Reflect.getPrototypeOf || null;
});

// node_modules/get-proto/Object.getPrototypeOf.js
var Yr = T((jh, ei) => {
  "use strict";
  var fc = Vr();
  ei.exports = fc.getPrototypeOf || null;
});

// node_modules/function-bind/implementation.js
var oi = T((Wh, ri) => {
  "use strict";
  var yc = "Function.prototype.bind called on incompatible ", vc = Object.prototype.toString, Pc = Math.max, gc = "[object Function]", ti = /* @__PURE__ */ s(function(e, r) {
    for (var o = [], i = 0; i < e.length; i += 1)
      o[i] = e[i];
    for (var a = 0; a < r.length; a += 1)
      o[a + e.length] = r[a];
    return o;
  }, "concatty"), Tc = /* @__PURE__ */ s(function(e, r) {
    for (var o = [], i = r || 0, a = 0; i < e.length; i += 1, a += 1)
      o[a] = e[i];
    return o;
  }, "slicy"), Sc = /* @__PURE__ */ s(function(t, e) {
    for (var r = "", o = 0; o < t.length; o += 1)
      r += t[o], o + 1 < t.length && (r += e);
    return r;
  }, "joiny");
  ri.exports = /* @__PURE__ */ s(function(e) {
    var r = this;
    if (typeof r != "function" || vc.apply(r) !== gc)
      throw new TypeError(yc + r);
    for (var o = Tc(arguments, 1), i, a = /* @__PURE__ */ s(function() {
      if (this instanceof i) {
        var u = r.apply(
          this,
          ti(o, arguments)
        );
        return Object(u) === u ? u : this;
      }
      return r.apply(
        e,
        ti(o, arguments)
      );
    }, "binder"), l = Pc(0, r.length - o.length), p = [], h = 0; h < l; h++)
      p[h] = "$" + h;
    if (i = Function("binder", "return function (" + Sc(p, ",") + "){ return binder.apply(this,arguments); }")(a), r.prototype) {
      var m = /* @__PURE__ */ s(function() {
      }, "Empty");
      m.prototype = r.prototype, i.prototype = new m(), m.prototype = null;
    }
    return i;
  }, "bind");
});

// node_modules/function-bind/index.js
var Qe = T((Vh, ni) => {
  "use strict";
  var _c = oi();
  ni.exports = Function.prototype.bind || _c;
});

// node_modules/call-bind-apply-helpers/functionCall.js
var kt = T((Qh, ii) => {
  "use strict";
  ii.exports = Function.prototype.call;
});

// node_modules/call-bind-apply-helpers/functionApply.js
var Xr = T((Jh, si) => {
  "use strict";
  si.exports = Function.prototype.apply;
});

// node_modules/call-bind-apply-helpers/reflectApply.js
var li = T((Yh, ai) => {
  "use strict";
  ai.exports = typeof Reflect < "u" && Reflect && Reflect.apply;
});

// node_modules/call-bind-apply-helpers/actualApply.js
var ci = T((Xh, ui) => {
  "use strict";
  var Ec = Qe(), xc = Xr(), bc = kt(), Oc = li();
  ui.exports = Oc || Ec.call(bc, xc);
});

// node_modules/call-bind-apply-helpers/index.js
var Zr = T((Zh, pi) => {
  "use strict";
  var wc = Qe(), Rc = ae(), Ac = kt(), Cc = ci();
  pi.exports = /* @__PURE__ */ s(function(e) {
    if (e.length < 1 || typeof e[0] != "function")
      throw new Rc("a function is required");
    return Cc(wc, Ac, e);
  }, "callBindBasic");
});

// node_modules/dunder-proto/get.js
var vi = T((tm, yi) => {
  "use strict";
  var Ic = Zr(), di = Qr(), mi;
  try {
    mi = /** @type {{ __proto__?: typeof Array.prototype }} */
    [].__proto__ === Array.prototype;
  } catch (t) {
    if (!t || typeof t != "object" || !("code" in t) || t.code !== "ERR_PROTO_ACCESS")
      throw t;
  }
  var eo = !!mi && di && di(
    Object.prototype,
    /** @type {keyof typeof Object.prototype} */
    "__proto__"
  ), fi = Object, hi = fi.getPrototypeOf;
  yi.exports = eo && typeof eo.get == "function" ? Ic([eo.get]) : typeof hi == "function" ? (
    /** @type {import('./get')} */
    /* @__PURE__ */ s(function(e) {
      return hi(e == null ? e : fi(e));
    }, "getDunder")
  ) : !1;
});

// node_modules/get-proto/index.js
var _i = T((om, Si) => {
  "use strict";
  var Pi = Jr(), gi = Yr(), Ti = vi();
  Si.exports = Pi ? /* @__PURE__ */ s(function(e) {
    return Pi(e);
  }, "getProto") : gi ? /* @__PURE__ */ s(function(e) {
    if (!e || typeof e != "object" && typeof e != "function")
      throw new TypeError("getProto: not an object");
    return gi(e);
  }, "getProto") : Ti ? /* @__PURE__ */ s(function(e) {
    return Ti(e);
  }, "getProto") : null;
});

// node_modules/hasown/index.js
var xi = T((im, Ei) => {
  "use strict";
  var Mc = Function.prototype.call, Gc = Object.prototype.hasOwnProperty, Dc = Qe();
  Ei.exports = Dc.call(Mc, Gc);
});

// node_modules/get-intrinsic/index.js
var Ft = T((sm, Ci) => {
  "use strict";
  var _, kc = Vr(), qc = yn(), Nc = Pn(), Fc = Tn(), Lc = _n(), Ee = xn(), _e = ae(), Uc = On(), $c = Rn(), Hc = Cn(), Bc = Mn(), zc = Dn(), jc = qn(), Wc = Fn(), Kc = Hn(), Ri = Function, to = /* @__PURE__ */ s(function(t) {
    try {
      return Ri('"use strict"; return (' + t + ").constructor;")();
    } catch {
    }
  }, "getEvalledConstructor"), Je = Qr(), Vc = Kn(), ro = /* @__PURE__ */ s(function() {
    throw new _e();
  }, "throwTypeError"), Qc = Je ? (function() {
    try {
      return arguments.callee, ro;
    } catch {
      try {
        return Je(arguments, "callee").get;
      } catch {
        return ro;
      }
    }
  })() : ro, Te = Xn()(), D = _i(), Jc = Yr(), Yc = Jr(), Ai = Xr(), Ye = kt(), Se = {}, Xc = typeof Uint8Array > "u" || !D ? _ : D(Uint8Array), ue = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError > "u" ? _ : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer > "u" ? _ : ArrayBuffer,
    "%ArrayIteratorPrototype%": Te && D ? D([][Symbol.iterator]()) : _,
    "%AsyncFromSyncIteratorPrototype%": _,
    "%AsyncFunction%": Se,
    "%AsyncGenerator%": Se,
    "%AsyncGeneratorFunction%": Se,
    "%AsyncIteratorPrototype%": Se,
    "%Atomics%": typeof Atomics > "u" ? _ : Atomics,
    "%BigInt%": typeof BigInt > "u" ? _ : BigInt,
    "%BigInt64Array%": typeof BigInt64Array > "u" ? _ : BigInt64Array,
    "%BigUint64Array%": typeof BigUint64Array > "u" ? _ : BigUint64Array,
    "%Boolean%": Boolean,
    "%DataView%": typeof DataView > "u" ? _ : DataView,
    "%Date%": Date,
    "%decodeURI%": decodeURI,
    "%decodeURIComponent%": decodeURIComponent,
    "%encodeURI%": encodeURI,
    "%encodeURIComponent%": encodeURIComponent,
    "%Error%": qc,
    "%eval%": eval,
    // eslint-disable-line no-eval
    "%EvalError%": Nc,
    "%Float16Array%": typeof Float16Array > "u" ? _ : Float16Array,
    "%Float32Array%": typeof Float32Array > "u" ? _ : Float32Array,
    "%Float64Array%": typeof Float64Array > "u" ? _ : Float64Array,
    "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? _ : FinalizationRegistry,
    "%Function%": Ri,
    "%GeneratorFunction%": Se,
    "%Int8Array%": typeof Int8Array > "u" ? _ : Int8Array,
    "%Int16Array%": typeof Int16Array > "u" ? _ : Int16Array,
    "%Int32Array%": typeof Int32Array > "u" ? _ : Int32Array,
    "%isFinite%": isFinite,
    "%isNaN%": isNaN,
    "%IteratorPrototype%": Te && D ? D(D([][Symbol.iterator]())) : _,
    "%JSON%": typeof JSON == "object" ? JSON : _,
    "%Map%": typeof Map > "u" ? _ : Map,
    "%MapIteratorPrototype%": typeof Map > "u" || !Te || !D ? _ : D((/* @__PURE__ */ new Map())[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": kc,
    "%Object.getOwnPropertyDescriptor%": Je,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise > "u" ? _ : Promise,
    "%Proxy%": typeof Proxy > "u" ? _ : Proxy,
    "%RangeError%": Fc,
    "%ReferenceError%": Lc,
    "%Reflect%": typeof Reflect > "u" ? _ : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set > "u" ? _ : Set,
    "%SetIteratorPrototype%": typeof Set > "u" || !Te || !D ? _ : D((/* @__PURE__ */ new Set())[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? _ : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": Te && D ? D(""[Symbol.iterator]()) : _,
    "%Symbol%": Te ? Symbol : _,
    "%SyntaxError%": Ee,
    "%ThrowTypeError%": Qc,
    "%TypedArray%": Xc,
    "%TypeError%": _e,
    "%Uint8Array%": typeof Uint8Array > "u" ? _ : Uint8Array,
    "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? _ : Uint8ClampedArray,
    "%Uint16Array%": typeof Uint16Array > "u" ? _ : Uint16Array,
    "%Uint32Array%": typeof Uint32Array > "u" ? _ : Uint32Array,
    "%URIError%": Uc,
    "%WeakMap%": typeof WeakMap > "u" ? _ : WeakMap,
    "%WeakRef%": typeof WeakRef > "u" ? _ : WeakRef,
    "%WeakSet%": typeof WeakSet > "u" ? _ : WeakSet,
    "%Function.prototype.call%": Ye,
    "%Function.prototype.apply%": Ai,
    "%Object.defineProperty%": Vc,
    "%Object.getPrototypeOf%": Jc,
    "%Math.abs%": $c,
    "%Math.floor%": Hc,
    "%Math.max%": Bc,
    "%Math.min%": zc,
    "%Math.pow%": jc,
    "%Math.round%": Wc,
    "%Math.sign%": Kc,
    "%Reflect.getPrototypeOf%": Yc
  };
  if (D)
    try {
      null.error;
    } catch (t) {
      bi = D(D(t)), ue["%Error.prototype%"] = bi;
    }
  var bi, Zc = /* @__PURE__ */ s(function t(e) {
    var r;
    if (e === "%AsyncFunction%")
      r = to("async function () {}");
    else if (e === "%GeneratorFunction%")
      r = to("function* () {}");
    else if (e === "%AsyncGeneratorFunction%")
      r = to("async function* () {}");
    else if (e === "%AsyncGenerator%") {
      var o = t("%AsyncGeneratorFunction%");
      o && (r = o.prototype);
    } else if (e === "%AsyncIteratorPrototype%") {
      var i = t("%AsyncGenerator%");
      i && D && (r = D(i.prototype));
    }
    return ue[e] = r, r;
  }, "doEval"), Oi = {
    __proto__: null,
    "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
    "%ArrayPrototype%": ["Array", "prototype"],
    "%ArrayProto_entries%": ["Array", "prototype", "entries"],
    "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
    "%ArrayProto_keys%": ["Array", "prototype", "keys"],
    "%ArrayProto_values%": ["Array", "prototype", "values"],
    "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
    "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
    "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
    "%BooleanPrototype%": ["Boolean", "prototype"],
    "%DataViewPrototype%": ["DataView", "prototype"],
    "%DatePrototype%": ["Date", "prototype"],
    "%ErrorPrototype%": ["Error", "prototype"],
    "%EvalErrorPrototype%": ["EvalError", "prototype"],
    "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
    "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
    "%FunctionPrototype%": ["Function", "prototype"],
    "%Generator%": ["GeneratorFunction", "prototype"],
    "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
    "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
    "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
    "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
    "%JSONParse%": ["JSON", "parse"],
    "%JSONStringify%": ["JSON", "stringify"],
    "%MapPrototype%": ["Map", "prototype"],
    "%NumberPrototype%": ["Number", "prototype"],
    "%ObjectPrototype%": ["Object", "prototype"],
    "%ObjProto_toString%": ["Object", "prototype", "toString"],
    "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
    "%PromisePrototype%": ["Promise", "prototype"],
    "%PromiseProto_then%": ["Promise", "prototype", "then"],
    "%Promise_all%": ["Promise", "all"],
    "%Promise_reject%": ["Promise", "reject"],
    "%Promise_resolve%": ["Promise", "resolve"],
    "%RangeErrorPrototype%": ["RangeError", "prototype"],
    "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
    "%RegExpPrototype%": ["RegExp", "prototype"],
    "%SetPrototype%": ["Set", "prototype"],
    "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
    "%StringPrototype%": ["String", "prototype"],
    "%SymbolPrototype%": ["Symbol", "prototype"],
    "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
    "%TypedArrayPrototype%": ["TypedArray", "prototype"],
    "%TypeErrorPrototype%": ["TypeError", "prototype"],
    "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
    "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
    "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
    "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
    "%URIErrorPrototype%": ["URIError", "prototype"],
    "%WeakMapPrototype%": ["WeakMap", "prototype"],
    "%WeakSetPrototype%": ["WeakSet", "prototype"]
  }, Xe = Qe(), qt = xi(), ep = Xe.call(Ye, Array.prototype.concat), tp = Xe.call(Ai, Array.prototype.splice), wi = Xe.call(Ye, String.prototype.replace), Nt = Xe.call(Ye, String.prototype.slice), rp = Xe.call(Ye, RegExp.prototype.exec), op = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, np = /\\(\\)?/g, ip = /* @__PURE__ */ s(function(e) {
    var r = Nt(e, 0, 1), o = Nt(e, -1);
    if (r === "%" && o !== "%")
      throw new Ee("invalid intrinsic syntax, expected closing `%`");
    if (o === "%" && r !== "%")
      throw new Ee("invalid intrinsic syntax, expected opening `%`");
    var i = [];
    return wi(e, op, function(a, l, p, h) {
      i[i.length] = p ? wi(h, np, "$1") : l || a;
    }), i;
  }, "stringToPath"), sp = /* @__PURE__ */ s(function(e, r) {
    var o = e, i;
    if (qt(Oi, o) && (i = Oi[o], o = "%" + i[0] + "%"), qt(ue, o)) {
      var a = ue[o];
      if (a === Se && (a = Zc(o)), typeof a > "u" && !r)
        throw new _e("intrinsic " + e + " exists, but is not available. Please file an issue!");
      return {
        alias: i,
        name: o,
        value: a
      };
    }
    throw new Ee("intrinsic " + e + " does not exist!");
  }, "getBaseIntrinsic");
  Ci.exports = /* @__PURE__ */ s(function(e, r) {
    if (typeof e != "string" || e.length === 0)
      throw new _e("intrinsic name must be a non-empty string");
    if (arguments.length > 1 && typeof r != "boolean")
      throw new _e('"allowMissing" argument must be a boolean');
    if (rp(/^%?[^%]*%?$/, e) === null)
      throw new Ee("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    var o = ip(e), i = o.length > 0 ? o[0] : "", a = sp("%" + i + "%", r), l = a.name, p = a.value, h = !1, m = a.alias;
    m && (i = m[0], tp(o, ep([0, 1], m)));
    for (var u = 1, d = !0; u < o.length; u += 1) {
      var c = o[u], y = Nt(c, 0, 1), f = Nt(c, -1);
      if ((y === '"' || y === "'" || y === "`" || f === '"' || f === "'" || f === "`") && y !== f)
        throw new Ee("property names with quotes must have matching quotes");
      if ((c === "constructor" || !d) && (h = !0), i += "." + c, l = "%" + i + "%", qt(ue, l))
        p = ue[l];
      else if (p != null) {
        if (!(c in p)) {
          if (!r)
            throw new _e("base intrinsic for " + e + " exists, but the property is not available.");
          return;
        }
        if (Je && u + 1 >= o.length) {
          var g = Je(p, c);
          d = !!g, d && "get" in g && !("originalValue" in g.get) ? p = g.get : p = p[c];
        } else
          d = qt(p, c), p = p[c];
        d && !h && (ue[l] = p);
      }
    }
    return p;
  }, "GetIntrinsic");
});

// node_modules/call-bound/index.js
var oo = T((lm, Gi) => {
  "use strict";
  var Ii = Ft(), Mi = Zr(), ap = Mi([Ii("%String.prototype.indexOf%")]);
  Gi.exports = /* @__PURE__ */ s(function(e, r) {
    var o = (
      /** @type {(this: unknown, ...args: unknown[]) => unknown} */
      Ii(e, !!r)
    );
    return typeof o == "function" && ap(e, ".prototype.") > -1 ? Mi(
      /** @type {const} */
      [o]
    ) : o;
  }, "callBoundIntrinsic");
});

// node_modules/side-channel-map/index.js
var no = T((cm, ki) => {
  "use strict";
  var lp = Ft(), Ze = oo(), up = Ve(), cp = ae(), Di = lp("%Map%", !0), pp = Ze("Map.prototype.get", !0), dp = Ze("Map.prototype.set", !0), hp = Ze("Map.prototype.has", !0), mp = Ze("Map.prototype.delete", !0), fp = Ze("Map.prototype.size", !0);
  ki.exports = !!Di && /** @type {Exclude<import('.'), false>} */
  /* @__PURE__ */ s(function() {
    var e, r = {
      assert: /* @__PURE__ */ s(function(o) {
        if (!r.has(o))
          throw new cp("Side channel does not contain " + up(o));
      }, "assert"),
      delete: /* @__PURE__ */ s(function(o) {
        if (e) {
          var i = mp(e, o);
          return fp(e) === 0 && (e = void 0), i;
        }
        return !1;
      }, "delete"),
      get: /* @__PURE__ */ s(function(o) {
        if (e)
          return pp(e, o);
      }, "get"),
      has: /* @__PURE__ */ s(function(o) {
        return e ? hp(e, o) : !1;
      }, "has"),
      set: /* @__PURE__ */ s(function(o, i) {
        e || (e = new Di()), dp(e, o, i);
      }, "set")
    };
    return r;
  }, "getSideChannelMap");
});

// node_modules/side-channel-weakmap/index.js
var Ni = T((dm, qi) => {
  "use strict";
  var yp = Ft(), Ut = oo(), vp = Ve(), Lt = no(), Pp = ae(), xe = yp("%WeakMap%", !0), gp = Ut("WeakMap.prototype.get", !0), Tp = Ut("WeakMap.prototype.set", !0), Sp = Ut("WeakMap.prototype.has", !0), _p = Ut("WeakMap.prototype.delete", !0);
  qi.exports = xe ? (
    /** @type {Exclude<import('.'), false>} */
    /* @__PURE__ */ s(function() {
      var e, r, o = {
        assert: /* @__PURE__ */ s(function(i) {
          if (!o.has(i))
            throw new Pp("Side channel does not contain " + vp(i));
        }, "assert"),
        delete: /* @__PURE__ */ s(function(i) {
          if (xe && i && (typeof i == "object" || typeof i == "function")) {
            if (e)
              return _p(e, i);
          } else if (Lt && r)
            return r.delete(i);
          return !1;
        }, "delete"),
        get: /* @__PURE__ */ s(function(i) {
          return xe && i && (typeof i == "object" || typeof i == "function") && e ? gp(e, i) : r && r.get(i);
        }, "get"),
        has: /* @__PURE__ */ s(function(i) {
          return xe && i && (typeof i == "object" || typeof i == "function") && e ? Sp(e, i) : !!r && r.has(i);
        }, "has"),
        set: /* @__PURE__ */ s(function(i, a) {
          xe && i && (typeof i == "object" || typeof i == "function") ? (e || (e = new xe()), Tp(e, i, a)) : Lt && (r || (r = Lt()), r.set(i, a));
        }, "set")
      };
      return o;
    }, "getSideChannelWeakMap")
  ) : Lt;
});

// node_modules/side-channel/index.js
var io = T((mm, Fi) => {
  "use strict";
  var Ep = ae(), xp = Ve(), bp = hn(), Op = no(), wp = Ni(), Rp = wp || Op || bp;
  Fi.exports = /* @__PURE__ */ s(function() {
    var e, r = {
      assert: /* @__PURE__ */ s(function(o) {
        if (!r.has(o))
          throw new Ep("Side channel does not contain " + xp(o));
      }, "assert"),
      delete: /* @__PURE__ */ s(function(o) {
        return !!e && e.delete(o);
      }, "delete"),
      get: /* @__PURE__ */ s(function(o) {
        return e && e.get(o);
      }, "get"),
      has: /* @__PURE__ */ s(function(o) {
        return !!e && e.has(o);
      }, "has"),
      set: /* @__PURE__ */ s(function(o, i) {
        e || (e = Rp()), e.set(o, i);
      }, "set")
    };
    return r;
  }, "getSideChannel");
});

// node_modules/qs/lib/formats.js
var $t = T((ym, Li) => {
  "use strict";
  var Ap = String.prototype.replace, Cp = /%20/g, so = {
    RFC1738: "RFC1738",
    RFC3986: "RFC3986"
  };
  Li.exports = {
    default: so.RFC3986,
    formatters: {
      RFC1738: /* @__PURE__ */ s(function(t) {
        return Ap.call(t, Cp, "+");
      }, "RFC1738"),
      RFC3986: /* @__PURE__ */ s(function(t) {
        return String(t);
      }, "RFC3986")
    },
    RFC1738: so.RFC1738,
    RFC3986: so.RFC3986
  };
});

// node_modules/qs/lib/utils.js
var po = T((Pm, Hi) => {
  "use strict";
  var Ip = $t(), Mp = io(), ao = Object.prototype.hasOwnProperty, ce = Array.isArray, Bt = Mp(), Ui = /* @__PURE__ */ s(function(e, r) {
    return Bt.set(e, r), e;
  }, "markOverflow"), Ht = /* @__PURE__ */ s(function(e) {
    return Bt.has(e);
  }, "isOverflow"), uo = /* @__PURE__ */ s(function(e) {
    return Bt.get(e);
  }, "getMaxIndex"), $i = /* @__PURE__ */ s(function(e, r) {
    Bt.set(e, r);
  }, "setMaxIndex"), j = (function() {
    for (var t = [], e = 0; e < 256; ++e)
      t.push("%" + ((e < 16 ? "0" : "") + e.toString(16)).toUpperCase());
    return t;
  })(), Gp = /* @__PURE__ */ s(function(e) {
    for (; e.length > 1; ) {
      var r = e.pop(), o = r.obj[r.prop];
      if (ce(o)) {
        for (var i = [], a = 0; a < o.length; ++a)
          typeof o[a] < "u" && i.push(o[a]);
        r.obj[r.prop] = i;
      }
    }
  }, "compactQueue"), co = /* @__PURE__ */ s(function(e, r) {
    for (var o = r && r.plainObjects ? { __proto__: null } : {}, i = 0; i < e.length; ++i)
      typeof e[i] < "u" && (o[i] = e[i]);
    return o;
  }, "arrayToObject"), Dp = /* @__PURE__ */ s(function t(e, r, o) {
    if (!r)
      return e;
    if (typeof r != "object" && typeof r != "function") {
      if (ce(e))
        e.push(r);
      else if (e && typeof e == "object")
        if (Ht(e)) {
          var i = uo(e) + 1;
          e[i] = r, $i(e, i);
        } else (o && (o.plainObjects || o.allowPrototypes) || !ao.call(Object.prototype, r)) && (e[r] = !0);
      else
        return [e, r];
      return e;
    }
    if (!e || typeof e != "object") {
      if (Ht(r)) {
        for (var a = Object.keys(r), l = o && o.plainObjects ? { __proto__: null, 0: e } : { 0: e }, p = 0; p < a.length; p++) {
          var h = parseInt(a[p], 10);
          l[h + 1] = r[a[p]];
        }
        return Ui(l, uo(r) + 1);
      }
      return [e].concat(r);
    }
    var m = e;
    return ce(e) && !ce(r) && (m = co(e, o)), ce(e) && ce(r) ? (r.forEach(function(u, d) {
      if (ao.call(e, d)) {
        var c = e[d];
        c && typeof c == "object" && u && typeof u == "object" ? e[d] = t(c, u, o) : e.push(u);
      } else
        e[d] = u;
    }), e) : Object.keys(r).reduce(function(u, d) {
      var c = r[d];
      return ao.call(u, d) ? u[d] = t(u[d], c, o) : u[d] = c, u;
    }, m);
  }, "merge"), kp = /* @__PURE__ */ s(function(e, r) {
    return Object.keys(r).reduce(function(o, i) {
      return o[i] = r[i], o;
    }, e);
  }, "assignSingleSource"), qp = /* @__PURE__ */ s(function(t, e, r) {
    var o = t.replace(/\+/g, " ");
    if (r === "iso-8859-1")
      return o.replace(/%[0-9a-f]{2}/gi, unescape);
    try {
      return decodeURIComponent(o);
    } catch {
      return o;
    }
  }, "decode"), lo = 1024, Np = /* @__PURE__ */ s(function(e, r, o, i, a) {
    if (e.length === 0)
      return e;
    var l = e;
    if (typeof e == "symbol" ? l = Symbol.prototype.toString.call(e) : typeof e != "string" && (l = String(e)), o === "iso-8859-1")
      return escape(l).replace(/%u[0-9a-f]{4}/gi, function(y) {
        return "%26%23" + parseInt(y.slice(2), 16) + "%3B";
      });
    for (var p = "", h = 0; h < l.length; h += lo) {
      for (var m = l.length >= lo ? l.slice(h, h + lo) : l, u = [], d = 0; d < m.length; ++d) {
        var c = m.charCodeAt(d);
        if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || a === Ip.RFC1738 && (c === 40 || c === 41)) {
          u[u.length] = m.charAt(d);
          continue;
        }
        if (c < 128) {
          u[u.length] = j[c];
          continue;
        }
        if (c < 2048) {
          u[u.length] = j[192 | c >> 6] + j[128 | c & 63];
          continue;
        }
        if (c < 55296 || c >= 57344) {
          u[u.length] = j[224 | c >> 12] + j[128 | c >> 6 & 63] + j[128 | c & 63];
          continue;
        }
        d += 1, c = 65536 + ((c & 1023) << 10 | m.charCodeAt(d) & 1023), u[u.length] = j[240 | c >> 18] + j[128 | c >> 12 & 63] + j[128 | c >> 6 & 63] + j[128 | c & 63];
      }
      p += u.join("");
    }
    return p;
  }, "encode"), Fp = /* @__PURE__ */ s(function(e) {
    for (var r = [{ obj: { o: e }, prop: "o" }], o = [], i = 0; i < r.length; ++i)
      for (var a = r[i], l = a.obj[a.prop], p = Object.keys(l), h = 0; h < p.length; ++h) {
        var m = p[h], u = l[m];
        typeof u == "object" && u !== null && o.indexOf(u) === -1 && (r.push({ obj: l, prop: m }), o.push(u));
      }
    return Gp(r), e;
  }, "compact"), Lp = /* @__PURE__ */ s(function(e) {
    return Object.prototype.toString.call(e) === "[object RegExp]";
  }, "isRegExp"), Up = /* @__PURE__ */ s(function(e) {
    return !e || typeof e != "object" ? !1 : !!(e.constructor && e.constructor.isBuffer && e.constructor.isBuffer(e));
  }, "isBuffer"), $p = /* @__PURE__ */ s(function(e, r, o, i) {
    if (Ht(e)) {
      var a = uo(e) + 1;
      return e[a] = r, $i(e, a), e;
    }
    var l = [].concat(e, r);
    return l.length > o ? Ui(co(l, { plainObjects: i }), l.length - 1) : l;
  }, "combine"), Hp = /* @__PURE__ */ s(function(e, r) {
    if (ce(e)) {
      for (var o = [], i = 0; i < e.length; i += 1)
        o.push(r(e[i]));
      return o;
    }
    return r(e);
  }, "maybeMap");
  Hi.exports = {
    arrayToObject: co,
    assign: kp,
    combine: $p,
    compact: Fp,
    decode: qp,
    encode: Np,
    isBuffer: Up,
    isOverflow: Ht,
    isRegExp: Lp,
    maybeMap: Hp,
    merge: Dp
  };
});

// node_modules/qs/lib/stringify.js
var Vi = T((Tm, Ki) => {
  "use strict";
  var zi = io(), zt = po(), et = $t(), Bp = Object.prototype.hasOwnProperty, ji = {
    brackets: /* @__PURE__ */ s(function(e) {
      return e + "[]";
    }, "brackets"),
    comma: "comma",
    indices: /* @__PURE__ */ s(function(e, r) {
      return e + "[" + r + "]";
    }, "indices"),
    repeat: /* @__PURE__ */ s(function(e) {
      return e;
    }, "repeat")
  }, W = Array.isArray, zp = Array.prototype.push, Wi = /* @__PURE__ */ s(function(t, e) {
    zp.apply(t, W(e) ? e : [e]);
  }, "pushToArray"), jp = Date.prototype.toISOString, Bi = et.default, G = {
    addQueryPrefix: !1,
    allowDots: !1,
    allowEmptyArrays: !1,
    arrayFormat: "indices",
    charset: "utf-8",
    charsetSentinel: !1,
    commaRoundTrip: !1,
    delimiter: "&",
    encode: !0,
    encodeDotInKeys: !1,
    encoder: zt.encode,
    encodeValuesOnly: !1,
    filter: void 0,
    format: Bi,
    formatter: et.formatters[Bi],
    // deprecated
    indices: !1,
    serializeDate: /* @__PURE__ */ s(function(e) {
      return jp.call(e);
    }, "serializeDate"),
    skipNulls: !1,
    strictNullHandling: !1
  }, Wp = /* @__PURE__ */ s(function(e) {
    return typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "symbol" || typeof e == "bigint";
  }, "isNonNullishPrimitive"), ho = {}, Kp = /* @__PURE__ */ s(function t(e, r, o, i, a, l, p, h, m, u, d, c, y, f, g, P, S, x) {
    for (var v = e, E = x, w = 0, $ = !1; (E = E.get(ho)) !== void 0 && !$; ) {
      var I = E.get(e);
      if (w += 1, typeof I < "u") {
        if (I === w)
          throw new RangeError("Cyclic object value");
        $ = !0;
      }
      typeof E.get(ho) > "u" && (w = 0);
    }
    if (typeof u == "function" ? v = u(r, v) : v instanceof Date ? v = y(v) : o === "comma" && W(v) && (v = zt.maybeMap(v, function(kr) {
      return kr instanceof Date ? y(kr) : kr;
    })), v === null) {
      if (l)
        return m && !P ? m(r, G.encoder, S, "key", f) : r;
      v = "";
    }
    if (Wp(v) || zt.isBuffer(v)) {
      if (m) {
        var F = P ? r : m(r, G.encoder, S, "key", f);
        return [g(F) + "=" + g(m(v, G.encoder, S, "value", f))];
      }
      return [g(r) + "=" + g(String(v))];
    }
    var q = [];
    if (typeof v > "u")
      return q;
    var M;
    if (o === "comma" && W(v))
      P && m && (v = zt.maybeMap(v, m)), M = [{ value: v.length > 0 ? v.join(",") || null : void 0 }];
    else if (W(u))
      M = u;
    else {
      var ve = Object.keys(v);
      M = d ? ve.sort(d) : ve;
    }
    var Pe = h ? String(r).replace(/\./g, "%2E") : String(r), H = i && W(v) && v.length === 1 ? Pe + "[]" : Pe;
    if (a && W(v) && v.length === 0)
      return H + "[]";
    for (var X = 0; X < M.length; ++X) {
      var Q = M[X], Be = typeof Q == "object" && Q && typeof Q.value < "u" ? Q.value : v[Q];
      if (!(p && Be === null)) {
        var Dr = c && h ? String(Q).replace(/\./g, "%2E") : String(Q), Cu = W(v) ? typeof o == "function" ? o(H, Dr) : H : H + (c ? "." + Dr : "[" + Dr + "]");
        x.set(e, w);
        var Uo = zi();
        Uo.set(ho, x), Wi(q, t(
          Be,
          Cu,
          o,
          i,
          a,
          l,
          p,
          h,
          o === "comma" && P && W(v) ? null : m,
          u,
          d,
          c,
          y,
          f,
          g,
          P,
          S,
          Uo
        ));
      }
    }
    return q;
  }, "stringify"), Vp = /* @__PURE__ */ s(function(e) {
    if (!e)
      return G;
    if (typeof e.allowEmptyArrays < "u" && typeof e.allowEmptyArrays != "boolean")
      throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
    if (typeof e.encodeDotInKeys < "u" && typeof e.encodeDotInKeys != "boolean")
      throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
    if (e.encoder !== null && typeof e.encoder < "u" && typeof e.encoder != "function")
      throw new TypeError("Encoder has to be a function.");
    var r = e.charset || G.charset;
    if (typeof e.charset < "u" && e.charset !== "utf-8" && e.charset !== "iso-8859-1")
      throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
    var o = et.default;
    if (typeof e.format < "u") {
      if (!Bp.call(et.formatters, e.format))
        throw new TypeError("Unknown format option provided.");
      o = e.format;
    }
    var i = et.formatters[o], a = G.filter;
    (typeof e.filter == "function" || W(e.filter)) && (a = e.filter);
    var l;
    if (e.arrayFormat in ji ? l = e.arrayFormat : "indices" in e ? l = e.indices ? "indices" : "repeat" : l = G.arrayFormat, "commaRoundTrip" in e && typeof e.commaRoundTrip != "boolean")
      throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
    var p = typeof e.allowDots > "u" ? e.encodeDotInKeys === !0 ? !0 : G.allowDots : !!e.allowDots;
    return {
      addQueryPrefix: typeof e.addQueryPrefix == "boolean" ? e.addQueryPrefix : G.addQueryPrefix,
      allowDots: p,
      allowEmptyArrays: typeof e.allowEmptyArrays == "boolean" ? !!e.allowEmptyArrays : G.allowEmptyArrays,
      arrayFormat: l,
      charset: r,
      charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : G.charsetSentinel,
      commaRoundTrip: !!e.commaRoundTrip,
      delimiter: typeof e.delimiter > "u" ? G.delimiter : e.delimiter,
      encode: typeof e.encode == "boolean" ? e.encode : G.encode,
      encodeDotInKeys: typeof e.encodeDotInKeys == "boolean" ? e.encodeDotInKeys : G.encodeDotInKeys,
      encoder: typeof e.encoder == "function" ? e.encoder : G.encoder,
      encodeValuesOnly: typeof e.encodeValuesOnly == "boolean" ? e.encodeValuesOnly : G.encodeValuesOnly,
      filter: a,
      format: o,
      formatter: i,
      serializeDate: typeof e.serializeDate == "function" ? e.serializeDate : G.serializeDate,
      skipNulls: typeof e.skipNulls == "boolean" ? e.skipNulls : G.skipNulls,
      sort: typeof e.sort == "function" ? e.sort : null,
      strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : G.strictNullHandling
    };
  }, "normalizeStringifyOptions");
  Ki.exports = function(t, e) {
    var r = t, o = Vp(e), i, a;
    typeof o.filter == "function" ? (a = o.filter, r = a("", r)) : W(o.filter) && (a = o.filter, i = a);
    var l = [];
    if (typeof r != "object" || r === null)
      return "";
    var p = ji[o.arrayFormat], h = p === "comma" && o.commaRoundTrip;
    i || (i = Object.keys(r)), o.sort && i.sort(o.sort);
    for (var m = zi(), u = 0; u < i.length; ++u) {
      var d = i[u], c = r[d];
      o.skipNulls && c === null || Wi(l, Kp(
        c,
        d,
        p,
        h,
        o.allowEmptyArrays,
        o.strictNullHandling,
        o.skipNulls,
        o.encodeDotInKeys,
        o.encode ? o.encoder : null,
        o.filter,
        o.sort,
        o.allowDots,
        o.serializeDate,
        o.format,
        o.formatter,
        o.encodeValuesOnly,
        o.charset,
        m
      ));
    }
    var y = l.join(o.delimiter), f = o.addQueryPrefix === !0 ? "?" : "";
    return o.charsetSentinel && (o.charset === "iso-8859-1" ? f += "utf8=%26%2310003%3B&" : f += "utf8=%E2%9C%93&"), y.length > 0 ? f + y : "";
  };
});

// node_modules/qs/lib/parse.js
var Xi = T((_m, Yi) => {
  "use strict";
  var te = po(), jt = Object.prototype.hasOwnProperty, Qi = Array.isArray, R = {
    allowDots: !1,
    allowEmptyArrays: !1,
    allowPrototypes: !1,
    allowSparse: !1,
    arrayLimit: 20,
    charset: "utf-8",
    charsetSentinel: !1,
    comma: !1,
    decodeDotInKeys: !1,
    decoder: te.decode,
    delimiter: "&",
    depth: 5,
    duplicates: "combine",
    ignoreQueryPrefix: !1,
    interpretNumericEntities: !1,
    parameterLimit: 1e3,
    parseArrays: !0,
    plainObjects: !1,
    strictDepth: !1,
    strictNullHandling: !1,
    throwOnLimitExceeded: !1
  }, Qp = /* @__PURE__ */ s(function(t) {
    return t.replace(/&#(\d+);/g, function(e, r) {
      return String.fromCharCode(parseInt(r, 10));
    });
  }, "interpretNumericEntities"), Ji = /* @__PURE__ */ s(function(t, e, r) {
    if (t && typeof t == "string" && e.comma && t.indexOf(",") > -1)
      return t.split(",");
    if (e.throwOnLimitExceeded && r >= e.arrayLimit)
      throw new RangeError("Array limit exceeded. Only " + e.arrayLimit + " element" + (e.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
    return t;
  }, "parseArrayValue"), Jp = "utf8=%26%2310003%3B", Yp = "utf8=%E2%9C%93", Xp = /* @__PURE__ */ s(function(e, r) {
    var o = { __proto__: null }, i = r.ignoreQueryPrefix ? e.replace(/^\?/, "") : e;
    i = i.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
    var a = r.parameterLimit === 1 / 0 ? void 0 : r.parameterLimit, l = i.split(
      r.delimiter,
      r.throwOnLimitExceeded ? a + 1 : a
    );
    if (r.throwOnLimitExceeded && l.length > a)
      throw new RangeError("Parameter limit exceeded. Only " + a + " parameter" + (a === 1 ? "" : "s") + " allowed.");
    var p = -1, h, m = r.charset;
    if (r.charsetSentinel)
      for (h = 0; h < l.length; ++h)
        l[h].indexOf("utf8=") === 0 && (l[h] === Yp ? m = "utf-8" : l[h] === Jp && (m = "iso-8859-1"), p = h, h = l.length);
    for (h = 0; h < l.length; ++h)
      if (h !== p) {
        var u = l[h], d = u.indexOf("]="), c = d === -1 ? u.indexOf("=") : d + 1, y, f;
        if (c === -1 ? (y = r.decoder(u, R.decoder, m, "key"), f = r.strictNullHandling ? null : "") : (y = r.decoder(u.slice(0, c), R.decoder, m, "key"), y !== null && (f = te.maybeMap(
          Ji(
            u.slice(c + 1),
            r,
            Qi(o[y]) ? o[y].length : 0
          ),
          function(P) {
            return r.decoder(P, R.decoder, m, "value");
          }
        ))), f && r.interpretNumericEntities && m === "iso-8859-1" && (f = Qp(String(f))), u.indexOf("[]=") > -1 && (f = Qi(f) ? [f] : f), y !== null) {
          var g = jt.call(o, y);
          g && r.duplicates === "combine" ? o[y] = te.combine(
            o[y],
            f,
            r.arrayLimit,
            r.plainObjects
          ) : (!g || r.duplicates === "last") && (o[y] = f);
        }
      }
    return o;
  }, "parseQueryStringValues"), Zp = /* @__PURE__ */ s(function(t, e, r, o) {
    var i = 0;
    if (t.length > 0 && t[t.length - 1] === "[]") {
      var a = t.slice(0, -1).join("");
      i = Array.isArray(e) && e[a] ? e[a].length : 0;
    }
    for (var l = o ? e : Ji(e, r, i), p = t.length - 1; p >= 0; --p) {
      var h, m = t[p];
      if (m === "[]" && r.parseArrays)
        te.isOverflow(l) ? h = l : h = r.allowEmptyArrays && (l === "" || r.strictNullHandling && l === null) ? [] : te.combine(
          [],
          l,
          r.arrayLimit,
          r.plainObjects
        );
      else {
        h = r.plainObjects ? { __proto__: null } : {};
        var u = m.charAt(0) === "[" && m.charAt(m.length - 1) === "]" ? m.slice(1, -1) : m, d = r.decodeDotInKeys ? u.replace(/%2E/g, ".") : u, c = parseInt(d, 10);
        !r.parseArrays && d === "" ? h = { 0: l } : !isNaN(c) && m !== d && String(c) === d && c >= 0 && r.parseArrays && c <= r.arrayLimit ? (h = [], h[c] = l) : d !== "__proto__" && (h[d] = l);
      }
      l = h;
    }
    return l;
  }, "parseObject"), ed = /* @__PURE__ */ s(function(e, r) {
    var o = r.allowDots ? e.replace(/\.([^.[]+)/g, "[$1]") : e;
    if (r.depth <= 0)
      return !r.plainObjects && jt.call(Object.prototype, o) && !r.allowPrototypes ? void 0 : [o];
    var i = /(\[[^[\]]*])/, a = /(\[[^[\]]*])/g, l = i.exec(o), p = l ? o.slice(0, l.index) : o, h = [];
    if (p) {
      if (!r.plainObjects && jt.call(Object.prototype, p) && !r.allowPrototypes)
        return;
      h.push(p);
    }
    for (var m = 0; (l = a.exec(o)) !== null && m < r.depth; ) {
      m += 1;
      var u = l[1].slice(1, -1);
      if (!r.plainObjects && jt.call(Object.prototype, u) && !r.allowPrototypes)
        return;
      h.push(l[1]);
    }
    if (l) {
      if (r.strictDepth === !0)
        throw new RangeError("Input depth exceeded depth option of " + r.depth + " and strictDepth is true");
      h.push("[" + o.slice(l.index) + "]");
    }
    return h;
  }, "splitKeyIntoSegments"), td = /* @__PURE__ */ s(function(e, r, o, i) {
    if (e) {
      var a = ed(e, o);
      if (a)
        return Zp(a, r, o, i);
    }
  }, "parseQueryStringKeys"), rd = /* @__PURE__ */ s(function(e) {
    if (!e)
      return R;
    if (typeof e.allowEmptyArrays < "u" && typeof e.allowEmptyArrays != "boolean")
      throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
    if (typeof e.decodeDotInKeys < "u" && typeof e.decodeDotInKeys != "boolean")
      throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
    if (e.decoder !== null && typeof e.decoder < "u" && typeof e.decoder != "function")
      throw new TypeError("Decoder has to be a function.");
    if (typeof e.charset < "u" && e.charset !== "utf-8" && e.charset !== "iso-8859-1")
      throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
    if (typeof e.throwOnLimitExceeded < "u" && typeof e.throwOnLimitExceeded != "boolean")
      throw new TypeError("`throwOnLimitExceeded` option must be a boolean");
    var r = typeof e.charset > "u" ? R.charset : e.charset, o = typeof e.duplicates > "u" ? R.duplicates : e.duplicates;
    if (o !== "combine" && o !== "first" && o !== "last")
      throw new TypeError("The duplicates option must be either combine, first, or last");
    var i = typeof e.allowDots > "u" ? e.decodeDotInKeys === !0 ? !0 : R.allowDots : !!e.allowDots;
    return {
      allowDots: i,
      allowEmptyArrays: typeof e.allowEmptyArrays == "boolean" ? !!e.allowEmptyArrays : R.allowEmptyArrays,
      allowPrototypes: typeof e.allowPrototypes == "boolean" ? e.allowPrototypes : R.allowPrototypes,
      allowSparse: typeof e.allowSparse == "boolean" ? e.allowSparse : R.allowSparse,
      arrayLimit: typeof e.arrayLimit == "number" ? e.arrayLimit : R.arrayLimit,
      charset: r,
      charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : R.charsetSentinel,
      comma: typeof e.comma == "boolean" ? e.comma : R.comma,
      decodeDotInKeys: typeof e.decodeDotInKeys == "boolean" ? e.decodeDotInKeys : R.decodeDotInKeys,
      decoder: typeof e.decoder == "function" ? e.decoder : R.decoder,
      delimiter: typeof e.delimiter == "string" || te.isRegExp(e.delimiter) ? e.delimiter : R.delimiter,
      // eslint-disable-next-line no-implicit-coercion, no-extra-parens
      depth: typeof e.depth == "number" || e.depth === !1 ? +e.depth : R.depth,
      duplicates: o,
      ignoreQueryPrefix: e.ignoreQueryPrefix === !0,
      interpretNumericEntities: typeof e.interpretNumericEntities == "boolean" ? e.interpretNumericEntities : R.interpretNumericEntities,
      parameterLimit: typeof e.parameterLimit == "number" ? e.parameterLimit : R.parameterLimit,
      parseArrays: e.parseArrays !== !1,
      plainObjects: typeof e.plainObjects == "boolean" ? e.plainObjects : R.plainObjects,
      strictDepth: typeof e.strictDepth == "boolean" ? !!e.strictDepth : R.strictDepth,
      strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : R.strictNullHandling,
      throwOnLimitExceeded: typeof e.throwOnLimitExceeded == "boolean" ? e.throwOnLimitExceeded : !1
    };
  }, "normalizeParseOptions");
  Yi.exports = function(t, e) {
    var r = rd(e);
    if (t === "" || t === null || typeof t > "u")
      return r.plainObjects ? { __proto__: null } : {};
    for (var o = typeof t == "string" ? Xp(t, r) : t, i = r.plainObjects ? { __proto__: null } : {}, a = Object.keys(o), l = 0; l < a.length; ++l) {
      var p = a[l], h = td(p, o[p], r, typeof t == "string");
      i = te.merge(i, h, r);
    }
    return r.allowSparse === !0 ? i : te.compact(i);
  };
});

// node_modules/qs/lib/index.js
var es = T((xm, Zi) => {
  "use strict";
  var od = Vi(), nd = Xi(), id = $t();
  Zi.exports = {
    formats: id,
    parse: nd,
    stringify: od
  };
});

// node_modules/@convex-dev/stripe/dist/client/index.js
Mu();

// node_modules/stripe/esm/utils.js
var ts = Iu(es(), 1);
var mo = [
  "apiKey",
  "idempotencyKey",
  "stripeAccount",
  "apiVersion",
  "maxNetworkRetries",
  "timeout",
  "host",
  "authenticator",
  "stripeContext",
  "additionalHeaders",
  "streaming"
];
function rs(t) {
  return t && typeof t == "object" && mo.some((e) => Object.prototype.hasOwnProperty.call(t, e));
}
s(rs, "isOptionsHash");
function re(t, e) {
  return ts.stringify(t, {
    serializeDate: /* @__PURE__ */ s((r) => Math.floor(r.getTime() / 1e3).toString(), "serializeDate"),
    // Always use indexed format for arrays
    arrayFormat: "indices"
  }).replace(/%5B/g, "[").replace(/%5D/g, "]");
}
s(re, "queryStringifyRequestData");
var Kt = /* @__PURE__ */ (() => {
  let t = {
    "\n": "\\n",
    '"': '\\"',
    "\u2028": "\\u2028",
    "\u2029": "\\u2029"
  };
  return (e) => {
    let r = e.replace(/["\n\r\u2028\u2029]/g, (o) => t[o]);
    return (o) => r.replace(/\{([\s\S]+?)\}/g, (i, a) => {
      let l = o[a];
      return sd(l) ? encodeURIComponent(l) : "";
    });
  };
})();
function sd(t) {
  return ["number", "string", "boolean"].includes(typeof t);
}
s(sd, "isValidEncodeUriComponentType");
function os(t) {
  let e = t.match(/\{\w+\}/g);
  return e ? e.map((r) => r.replace(/[{}]/g, "")) : [];
}
s(os, "extractUrlParams");
function be(t) {
  if (!Array.isArray(t) || !t[0] || typeof t[0] != "object")
    return {};
  if (!rs(t[0]))
    return t.shift();
  let e = Object.keys(t[0]), r = e.filter((o) => mo.includes(o));
  return r.length > 0 && r.length !== e.length && rt(`Options found in arguments (${r.join(", ")}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options.`), {};
}
s(be, "getDataFromArgs");
function Vt(t) {
  let e = {
    host: null,
    headers: {},
    settings: {},
    streaming: !1
  };
  if (t.length > 0) {
    let r = t[t.length - 1];
    if (typeof r == "string")
      e.authenticator = Wt(t.pop());
    else if (rs(r)) {
      let o = Object.assign({}, t.pop()), i = Object.keys(o).filter((a) => !mo.includes(a));
      if (i.length && rt(`Invalid options found (${i.join(", ")}); ignoring.`), o.apiKey && (e.authenticator = Wt(o.apiKey)), o.idempotencyKey && (e.headers["Idempotency-Key"] = o.idempotencyKey), o.stripeAccount && (e.headers["Stripe-Account"] = o.stripeAccount), o.stripeContext) {
        if (e.headers["Stripe-Account"])
          throw new Error("Can't specify both stripeAccount and stripeContext.");
        e.headers["Stripe-Context"] = o.stripeContext;
      }
      if (o.apiVersion && (e.headers["Stripe-Version"] = o.apiVersion), Number.isInteger(o.maxNetworkRetries) && (e.settings.maxNetworkRetries = o.maxNetworkRetries), Number.isInteger(o.timeout) && (e.settings.timeout = o.timeout), o.host && (e.host = o.host), o.authenticator) {
        if (o.apiKey)
          throw new Error("Can't specify both apiKey and authenticator.");
        if (typeof o.authenticator != "function")
          throw new Error("The authenticator must be a function receiving a request as the first parameter.");
        e.authenticator = o.authenticator;
      }
      o.additionalHeaders && (e.headers = o.additionalHeaders), o.streaming && (e.streaming = !0);
    }
  }
  return e;
}
s(Vt, "getOptionsFromArgs");
function ns(t) {
  let e = this, r = Object.prototype.hasOwnProperty.call(t, "constructor") ? t.constructor : function(...o) {
    e.apply(this, o);
  };
  return Object.assign(r, e), r.prototype = Object.create(e.prototype), Object.assign(r.prototype, t), r;
}
s(ns, "protoExtend");
function Qt(t) {
  if (typeof t != "object")
    throw new Error("Argument must be an object");
  return Object.keys(t).reduce((e, r) => (t[r] != null && (e[r] = t[r]), e), {});
}
s(Qt, "removeNullish");
function is(t) {
  return t && typeof t == "object" ? Object.keys(t).reduce((e, r) => (e[ad(r)] = t[r], e), {}) : t;
}
s(is, "normalizeHeaders");
function ad(t) {
  return t.split("-").map((e) => e.charAt(0).toUpperCase() + e.substr(1).toLowerCase()).join("-");
}
s(ad, "normalizeHeader");
function tt(t, e) {
  return e ? t.then((r) => {
    setTimeout(() => {
      e(null, r);
    }, 0);
  }, (r) => {
    setTimeout(() => {
      e(r, null);
    }, 0);
  }) : t;
}
s(tt, "callbackifyPromiseWithTimeout");
function ss(t) {
  return t === "OAuth" ? "oauth" : t[0].toLowerCase() + t.substring(1);
}
s(ss, "pascalToCamelCase");
function rt(t) {
  return typeof process.emitWarning != "function" ? console.warn(`Stripe: ${t}`) : process.emitWarning(t, "Stripe");
}
s(rt, "emitWarning");
function ld(t) {
  let e = typeof t;
  return (e === "function" || e === "object") && !!t;
}
s(ld, "isObject");
function as(t) {
  let e = {}, r = /* @__PURE__ */ s((o, i) => {
    Object.entries(o).forEach(([a, l]) => {
      let p = i ? `${i}[${a}]` : a;
      if (ld(l)) {
        if (!(l instanceof Uint8Array) && !Object.prototype.hasOwnProperty.call(l, "data"))
          return r(l, p);
        e[p] = l;
      } else
        e[p] = String(l);
    });
  }, "step");
  return r(t, null), e;
}
s(as, "flattenAndStringify");
function Jt(t, e, r) {
  if (!Number.isInteger(e)) {
    if (r !== void 0)
      return r;
    throw new Error(`${t} must be an integer`);
  }
  return e;
}
s(Jt, "validateInteger");
function ls() {
  return typeof process > "u" ? {} : {
    lang_version: process.version,
    platform: process.platform
  };
}
s(ls, "determineProcessUserAgentProperties");
function Wt(t) {
  let e = /* @__PURE__ */ s((r) => (r.headers.Authorization = "Bearer " + t, Promise.resolve()), "authenticator");
  return e._apiKey = t, e;
}
s(Wt, "createApiKeyAuthenticator");
function ud(t, e) {
  return this[t] instanceof Date ? Math.floor(this[t].getTime() / 1e3).toString() : e;
}
s(ud, "dateTimeReplacer");
function us(t) {
  return JSON.stringify(t, ud);
}
s(us, "jsonStringifyRequestData");
function Oe(t) {
  return t && t.startsWith("/v2") ? "v2" : "v1";
}
s(Oe, "getAPIMode");
function Yt(t) {
  return Array.isArray(t) ? t.join(", ") : String(t);
}
s(Yt, "parseHttpHeaderAsString");
function cs(t) {
  let e = Array.isArray(t) ? t[0] : t;
  return Number(e);
}
s(cs, "parseHttpHeaderAsNumber");
function ps(t) {
  return Object.entries(t).map(([e, r]) => [e, Yt(r)]);
}
s(ps, "parseHeadersForFetch");

// node_modules/stripe/esm/net/HttpClient.js
var N = class t {
  static {
    s(this, "HttpClient");
  }
  /** The client name used for diagnostics. */
  getClientName() {
    throw new Error("getClientName not implemented.");
  }
  makeRequest(e, r, o, i, a, l, p, h) {
    throw new Error("makeRequest not implemented.");
  }
  /** Helper to make a consistent timeout error across implementations. */
  static makeTimeoutError() {
    let e = new TypeError(t.TIMEOUT_ERROR_CODE);
    return e.code = t.TIMEOUT_ERROR_CODE, e;
  }
};
N.CONNECTION_CLOSED_ERROR_CODES = ["ECONNRESET", "EPIPE"];
N.TIMEOUT_ERROR_CODE = "ETIMEDOUT";
var we = class {
  static {
    s(this, "HttpClientResponse");
  }
  constructor(e, r) {
    this._statusCode = e, this._headers = r;
  }
  getStatusCode() {
    return this._statusCode;
  }
  getHeaders() {
    return this._headers;
  }
  getRawResponse() {
    throw new Error("getRawResponse not implemented.");
  }
  toStream(e) {
    throw new Error("toStream not implemented.");
  }
  toJSON() {
    throw new Error("toJSON not implemented.");
  }
};

// node_modules/stripe/esm/net/FetchHttpClient.js
var Xt = class t extends N {
  static {
    s(this, "FetchHttpClient");
  }
  constructor(e) {
    if (super(), !e) {
      if (!globalThis.fetch)
        throw new Error("fetch() function not provided and is not defined in the global scope. You must provide a fetch implementation.");
      e = globalThis.fetch;
    }
    globalThis.AbortController ? this._fetchFn = t.makeFetchWithAbortTimeout(e) : this._fetchFn = t.makeFetchWithRaceTimeout(e);
  }
  static makeFetchWithRaceTimeout(e) {
    return (r, o, i) => {
      let a, l = new Promise((h, m) => {
        a = setTimeout(() => {
          a = null, m(N.makeTimeoutError());
        }, i);
      }), p = e(r, o);
      return Promise.race([p, l]).finally(() => {
        a && clearTimeout(a);
      });
    };
  }
  static makeFetchWithAbortTimeout(e) {
    return async (r, o, i) => {
      let a = new AbortController(), l = setTimeout(() => {
        l = null, a.abort(N.makeTimeoutError());
      }, i);
      try {
        return await e(r, Object.assign(Object.assign({}, o), { signal: a.signal }));
      } catch (p) {
        throw p.name === "AbortError" ? N.makeTimeoutError() : p;
      } finally {
        l && clearTimeout(l);
      }
    };
  }
  /** @override. */
  getClientName() {
    return "fetch";
  }
  async makeRequest(e, r, o, i, a, l, p, h) {
    let m = p === "http", u = new URL(o, `${m ? "http" : "https"}://${e}`);
    u.port = r;
    let d = i == "POST" || i == "PUT" || i == "PATCH", c = l || (d ? "" : void 0), y = await this._fetchFn(u.toString(), {
      method: i,
      headers: ps(a),
      body: c
    }, h);
    return new fo(y);
  }
}, fo = class t extends we {
  static {
    s(this, "FetchHttpClientResponse");
  }
  constructor(e) {
    super(e.status, t._transformHeadersToObject(e.headers)), this._res = e;
  }
  getRawResponse() {
    return this._res;
  }
  toStream(e) {
    return e(), this._res.body;
  }
  toJSON() {
    return this._res.json();
  }
  static _transformHeadersToObject(e) {
    let r = {};
    for (let o of e) {
      if (!Array.isArray(o) || o.length != 2)
        throw new Error("Response objects produced by the fetch function given to FetchHttpClient do not have an iterable headers map. Response#headers should be an iterable object.");
      r[o[0]] = o[1];
    }
    return r;
  }
};

// node_modules/stripe/esm/crypto/CryptoProvider.js
var Re = class {
  static {
    s(this, "CryptoProvider");
  }
  /**
   * Computes a SHA-256 HMAC given a secret and a payload (encoded in UTF-8).
   * The output HMAC should be encoded in hexadecimal.
   *
   * Sample values for implementations:
   * - computeHMACSignature('', 'test_secret') => 'f7f9bd47fb987337b5796fdc1fdb9ba221d0d5396814bfcaf9521f43fd8927fd'
   * - computeHMACSignature('\ud83d\ude00', 'test_secret') => '837da296d05c4fe31f61d5d7ead035099d9585a5bcde87de952012a78f0b0c43
   */
  computeHMACSignature(e, r) {
    throw new Error("computeHMACSignature not implemented.");
  }
  /**
   * Asynchronous version of `computeHMACSignature`. Some implementations may
   * only allow support async signature computation.
   *
   * Computes a SHA-256 HMAC given a secret and a payload (encoded in UTF-8).
   * The output HMAC should be encoded in hexadecimal.
   *
   * Sample values for implementations:
   * - computeHMACSignature('', 'test_secret') => 'f7f9bd47fb987337b5796fdc1fdb9ba221d0d5396814bfcaf9521f43fd8927fd'
   * - computeHMACSignature('\ud83d\ude00', 'test_secret') => '837da296d05c4fe31f61d5d7ead035099d9585a5bcde87de952012a78f0b0c43
   */
  computeHMACSignatureAsync(e, r) {
    throw new Error("computeHMACSignatureAsync not implemented.");
  }
  /**
   * Computes a SHA-256 hash of the data.
   */
  computeSHA256Async(e) {
    throw new Error("computeSHA256 not implemented.");
  }
}, Ae = class extends Error {
  static {
    s(this, "CryptoProviderOnlySupportsAsyncError");
  }
};

// node_modules/stripe/esm/crypto/SubtleCryptoProvider.js
var Zt = class extends Re {
  static {
    s(this, "SubtleCryptoProvider");
  }
  constructor(e) {
    super(), this.subtleCrypto = e || crypto.subtle;
  }
  /** @override */
  computeHMACSignature(e, r) {
    throw new Ae("SubtleCryptoProvider cannot be used in a synchronous context.");
  }
  /** @override */
  async computeHMACSignatureAsync(e, r) {
    let o = new TextEncoder(), i = await this.subtleCrypto.importKey("raw", o.encode(r), {
      name: "HMAC",
      hash: { name: "SHA-256" }
    }, !1, ["sign"]), a = await this.subtleCrypto.sign("hmac", i, o.encode(e)), l = new Uint8Array(a), p = new Array(l.length);
    for (let h = 0; h < l.length; h++)
      p[h] = yo[l[h]];
    return p.join("");
  }
  /** @override */
  async computeSHA256Async(e) {
    return new Uint8Array(await this.subtleCrypto.digest("SHA-256", e));
  }
}, yo = new Array(256);
for (let t = 0; t < yo.length; t++)
  yo[t] = t.toString(16).padStart(2, "0");

// node_modules/stripe/esm/platform/PlatformFunctions.js
var er = class {
  static {
    s(this, "PlatformFunctions");
  }
  constructor() {
    this._fetchFn = null, this._agent = null;
  }
  /**
   * Gets uname with Node's built-in `exec` function, if available.
   */
  getUname() {
    throw new Error("getUname not implemented.");
  }
  /**
   * Generates a v4 UUID. See https://stackoverflow.com/a/2117523
   */
  uuid4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
      let r = Math.random() * 16 | 0;
      return (e === "x" ? r : r & 3 | 8).toString(16);
    });
  }
  /**
   * Compares strings in constant time.
   */
  secureCompare(e, r) {
    if (e.length !== r.length)
      return !1;
    let o = e.length, i = 0;
    for (let a = 0; a < o; ++a)
      i |= e.charCodeAt(a) ^ r.charCodeAt(a);
    return i === 0;
  }
  /**
   * Creates an event emitter.
   */
  createEmitter() {
    throw new Error("createEmitter not implemented.");
  }
  /**
   * Checks if the request data is a stream. If so, read the entire stream
   * to a buffer and return the buffer.
   */
  tryBufferData(e) {
    throw new Error("tryBufferData not implemented.");
  }
  /**
   * Creates an HTTP client which uses the Node `http` and `https` packages
   * to issue requests.
   */
  createNodeHttpClient(e) {
    throw new Error("createNodeHttpClient not implemented.");
  }
  /**
   * Creates an HTTP client for issuing Stripe API requests which uses the Web
   * Fetch API.
   *
   * A fetch function can optionally be passed in as a parameter. If none is
   * passed, will default to the default `fetch` function in the global scope.
   */
  createFetchHttpClient(e) {
    return new Xt(e);
  }
  /**
   * Creates an HTTP client using runtime-specific APIs.
   */
  createDefaultHttpClient() {
    throw new Error("createDefaultHttpClient not implemented.");
  }
  /**
   * Creates a CryptoProvider which uses the Node `crypto` package for its computations.
   */
  createNodeCryptoProvider() {
    throw new Error("createNodeCryptoProvider not implemented.");
  }
  /**
   * Creates a CryptoProvider which uses the SubtleCrypto interface of the Web Crypto API.
   */
  createSubtleCryptoProvider(e) {
    return new Zt(e);
  }
  createDefaultCryptoProvider() {
    throw new Error("createDefaultCryptoProvider not implemented.");
  }
};

// node_modules/stripe/esm/StripeEmitter.js
var vo = class extends Event {
  static {
    s(this, "_StripeEvent");
  }
  constructor(e, r) {
    super(e), this.data = r;
  }
}, tr = class {
  static {
    s(this, "StripeEmitter");
  }
  constructor() {
    this.eventTarget = new EventTarget(), this.listenerMapping = /* @__PURE__ */ new Map();
  }
  on(e, r) {
    let o = /* @__PURE__ */ s((i) => {
      r(i.data);
    }, "listenerWrapper");
    return this.listenerMapping.set(r, o), this.eventTarget.addEventListener(e, o);
  }
  removeListener(e, r) {
    let o = this.listenerMapping.get(r);
    return this.listenerMapping.delete(r), this.eventTarget.removeEventListener(e, o);
  }
  once(e, r) {
    let o = /* @__PURE__ */ s((i) => {
      r(i.data);
    }, "listenerWrapper");
    return this.listenerMapping.set(r, o), this.eventTarget.addEventListener(e, o, {
      once: !0
    });
  }
  emit(e, r) {
    return this.eventTarget.dispatchEvent(new vo(e, r));
  }
};

// node_modules/stripe/esm/platform/WebPlatformFunctions.js
var rr = class extends er {
  static {
    s(this, "WebPlatformFunctions");
  }
  /** @override */
  getUname() {
    return Promise.resolve(null);
  }
  /** @override */
  createEmitter() {
    return new tr();
  }
  /** @override */
  tryBufferData(e) {
    if (e.file.data instanceof ReadableStream)
      throw new Error("Uploading a file as a stream is not supported in non-Node environments. Please open or upvote an issue at github.com/stripe/stripe-node if you use this, detailing your use-case.");
    return Promise.resolve(e);
  }
  /** @override */
  createNodeHttpClient() {
    throw new Error("Stripe: `createNodeHttpClient()` is not available in non-Node environments. Please use `createFetchHttpClient()` instead.");
  }
  /** @override */
  createDefaultHttpClient() {
    return super.createFetchHttpClient();
  }
  /** @override */
  createNodeCryptoProvider() {
    throw new Error("Stripe: `createNodeCryptoProvider()` is not available in non-Node environments. Please use `createSubtleCryptoProvider()` instead.");
  }
  /** @override */
  createDefaultCryptoProvider() {
    return this.createSubtleCryptoProvider();
  }
};

// node_modules/stripe/esm/Error.js
var lr = {};
$o(lr, {
  StripeAPIError: () => Ce,
  StripeAuthenticationError: () => Ie,
  StripeCardError: () => or,
  StripeConnectionError: () => it,
  StripeError: () => C,
  StripeIdempotencyError: () => nr,
  StripeInvalidGrantError: () => ir,
  StripeInvalidRequestError: () => ot,
  StripePermissionError: () => nt,
  StripeRateLimitError: () => Me,
  StripeSignatureVerificationError: () => B,
  StripeUnknownError: () => sr,
  TemporarySessionExpiredError: () => ar,
  generateV1Error: () => st,
  generateV2Error: () => Po
});
var st = /* @__PURE__ */ s((t) => {
  switch (t.type) {
    case "card_error":
      return new or(t);
    case "invalid_request_error":
      return new ot(t);
    case "api_error":
      return new Ce(t);
    case "authentication_error":
      return new Ie(t);
    case "rate_limit_error":
      return new Me(t);
    case "idempotency_error":
      return new nr(t);
    case "invalid_grant":
      return new ir(t);
    default:
      return new sr(t);
  }
}, "generateV1Error"), Po = /* @__PURE__ */ s((t) => {
  switch (t.type) {
    // switchCases: The beginning of the section generated from our OpenAPI spec
    case "temporary_session_expired":
      return new ar(t);
  }
  switch (t.code) {
    case "invalid_fields":
      return new ot(t);
  }
  return st(t);
}, "generateV2Error"), C = class extends Error {
  static {
    s(this, "StripeError");
  }
  constructor(e = {}, r = null) {
    var o;
    super(e.message), this.type = r || this.constructor.name, this.raw = e, this.rawType = e.type, this.code = e.code, this.doc_url = e.doc_url, this.param = e.param, this.detail = e.detail, this.headers = e.headers, this.requestId = e.requestId, this.statusCode = e.statusCode, this.message = (o = e.message) !== null && o !== void 0 ? o : "", this.userMessage = e.user_message, this.charge = e.charge, this.decline_code = e.decline_code, this.payment_intent = e.payment_intent, this.payment_method = e.payment_method, this.payment_method_type = e.payment_method_type, this.setup_intent = e.setup_intent, this.source = e.source;
  }
};
C.generate = st;
var or = class extends C {
  static {
    s(this, "StripeCardError");
  }
  constructor(e = {}) {
    super(e, "StripeCardError");
  }
}, ot = class extends C {
  static {
    s(this, "StripeInvalidRequestError");
  }
  constructor(e = {}) {
    super(e, "StripeInvalidRequestError");
  }
}, Ce = class extends C {
  static {
    s(this, "StripeAPIError");
  }
  constructor(e = {}) {
    super(e, "StripeAPIError");
  }
}, Ie = class extends C {
  static {
    s(this, "StripeAuthenticationError");
  }
  constructor(e = {}) {
    super(e, "StripeAuthenticationError");
  }
}, nt = class extends C {
  static {
    s(this, "StripePermissionError");
  }
  constructor(e = {}) {
    super(e, "StripePermissionError");
  }
}, Me = class extends C {
  static {
    s(this, "StripeRateLimitError");
  }
  constructor(e = {}) {
    super(e, "StripeRateLimitError");
  }
}, it = class extends C {
  static {
    s(this, "StripeConnectionError");
  }
  constructor(e = {}) {
    super(e, "StripeConnectionError");
  }
}, B = class extends C {
  static {
    s(this, "StripeSignatureVerificationError");
  }
  constructor(e, r, o = {}) {
    super(o, "StripeSignatureVerificationError"), this.header = e, this.payload = r;
  }
}, nr = class extends C {
  static {
    s(this, "StripeIdempotencyError");
  }
  constructor(e = {}) {
    super(e, "StripeIdempotencyError");
  }
}, ir = class extends C {
  static {
    s(this, "StripeInvalidGrantError");
  }
  constructor(e = {}) {
    super(e, "StripeInvalidGrantError");
  }
}, sr = class extends C {
  static {
    s(this, "StripeUnknownError");
  }
  constructor(e = {}) {
    super(e, "StripeUnknownError");
  }
}, ar = class extends C {
  static {
    s(this, "TemporarySessionExpiredError");
  }
  constructor(e = {}) {
    super(e, "TemporarySessionExpiredError");
  }
};

// node_modules/stripe/esm/RequestSender.js
var cd = 60, ur = class t {
  static {
    s(this, "RequestSender");
  }
  constructor(e, r) {
    this._stripe = e, this._maxBufferedRequestMetric = r;
  }
  _normalizeStripeContext(e, r) {
    return e ? e.toString() || null : r?.toString() || null;
  }
  _addHeadersDirectlyToObject(e, r) {
    e.requestId = r["request-id"], e.stripeAccount = e.stripeAccount || r["stripe-account"], e.apiVersion = e.apiVersion || r["stripe-version"], e.idempotencyKey = e.idempotencyKey || r["idempotency-key"];
  }
  _makeResponseEvent(e, r, o) {
    let i = Date.now(), a = i - e.request_start_time;
    return Qt({
      api_version: o["stripe-version"],
      account: o["stripe-account"],
      idempotency_key: o["idempotency-key"],
      method: e.method,
      path: e.path,
      status: r,
      request_id: this._getRequestId(o),
      elapsed: a,
      request_start_time: e.request_start_time,
      request_end_time: i
    });
  }
  _getRequestId(e) {
    return e["request-id"];
  }
  /**
   * Used by methods with spec.streaming === true. For these methods, we do not
   * buffer successful responses into memory or do parse them into stripe
   * objects, we delegate that all of that to the user and pass back the raw
   * http.Response object to the callback.
   *
   * (Unsuccessful responses shouldn't make it here, they should
   * still be buffered/parsed and handled by _jsonResponseHandler -- see
   * makeRequest)
   */
  _streamingResponseHandler(e, r, o) {
    return (i) => {
      let a = i.getHeaders(), l = /* @__PURE__ */ s(() => {
        let h = this._makeResponseEvent(e, i.getStatusCode(), a);
        this._stripe._emitter.emit("response", h), this._recordRequestMetrics(this._getRequestId(a), h.elapsed, r);
      }, "streamCompleteCallback"), p = i.toStream(l);
      return this._addHeadersDirectlyToObject(p, a), o(null, p);
    };
  }
  /**
   * Default handler for Stripe responses. Buffers the response into memory,
   * parses the JSON and returns it (i.e. passes it to the callback) if there
   * is no "error" field. Otherwise constructs/passes an appropriate Error.
   */
  _jsonResponseHandler(e, r, o, i) {
    return (a) => {
      let l = a.getHeaders(), p = this._getRequestId(l), h = a.getStatusCode(), m = this._makeResponseEvent(e, h, l);
      this._stripe._emitter.emit("response", m), a.toJSON().then((u) => {
        if (u.error) {
          let d;
          throw typeof u.error == "string" && (u.error = {
            type: u.error,
            message: u.error_description
          }), u.error.headers = l, u.error.statusCode = h, u.error.requestId = p, h === 401 ? d = new Ie(u.error) : h === 403 ? d = new nt(u.error) : h === 429 ? d = new Me(u.error) : r === "v2" ? d = Po(u.error) : d = st(u.error), d;
        }
        return u;
      }, (u) => {
        throw new Ce({
          message: "Invalid JSON received from the Stripe API",
          exception: u,
          requestId: l["request-id"]
        });
      }).then((u) => {
        this._recordRequestMetrics(p, m.elapsed, o);
        let d = a.getRawResponse();
        this._addHeadersDirectlyToObject(d, l), Object.defineProperty(u, "lastResponse", {
          enumerable: !1,
          writable: !1,
          value: d
        }), i(null, u);
      }, (u) => i(u, null));
    };
  }
  static _generateConnectionErrorMessage(e) {
    return `An error occurred with our connection to Stripe.${e > 0 ? ` Request was retried ${e} times.` : ""}`;
  }
  // For more on when and how to retry API requests, see https://stripe.com/docs/error-handling#safely-retrying-requests-with-idempotency
  static _shouldRetry(e, r, o, i) {
    return i && r === 0 && N.CONNECTION_CLOSED_ERROR_CODES.includes(i.code) ? !0 : r >= o ? !1 : e ? e.getHeaders()["stripe-should-retry"] === "false" ? !1 : e.getHeaders()["stripe-should-retry"] === "true" || e.getStatusCode() === 409 || e.getStatusCode() >= 500 : !0;
  }
  _getSleepTimeInMS(e, r = null) {
    let o = this._stripe.getInitialNetworkRetryDelay(), i = this._stripe.getMaxNetworkRetryDelay(), a = Math.min(o * Math.pow(2, e - 1), i);
    return a *= 0.5 * (1 + Math.random()), a = Math.max(o, a), Number.isInteger(r) && r <= cd && (a = Math.max(a, r)), a * 1e3;
  }
  // Max retries can be set on a per request basis. Favor those over the global setting
  _getMaxNetworkRetries(e = {}) {
    return e.maxNetworkRetries !== void 0 && Number.isInteger(e.maxNetworkRetries) ? e.maxNetworkRetries : this._stripe.getMaxNetworkRetries();
  }
  _defaultIdempotencyKey(e, r, o) {
    let i = this._getMaxNetworkRetries(r), a = /* @__PURE__ */ s(() => `stripe-node-retry-${this._stripe._platformFunctions.uuid4()}`, "genKey");
    if (o === "v2") {
      if (e === "POST" || e === "DELETE")
        return a();
    } else if (o === "v1" && e === "POST" && i > 0)
      return a();
    return null;
  }
  _makeHeaders({ contentType: e, contentLength: r, apiVersion: o, clientUserAgent: i, method: a, userSuppliedHeaders: l, userSuppliedSettings: p, stripeAccount: h, stripeContext: m, apiMode: u }) {
    let d = {
      Accept: "application/json",
      "Content-Type": e,
      "User-Agent": this._getUserAgentString(u),
      "X-Stripe-Client-User-Agent": i,
      "X-Stripe-Client-Telemetry": this._getTelemetryHeader(),
      "Stripe-Version": o,
      "Stripe-Account": h,
      "Stripe-Context": m,
      "Idempotency-Key": this._defaultIdempotencyKey(a, p, u)
    }, c = a == "POST" || a == "PUT" || a == "PATCH";
    return (c || r) && (c || rt(`${a} method had non-zero contentLength but no payload is expected for this verb`), d["Content-Length"] = r), Object.assign(
      Qt(d),
      // If the user supplied, say 'idempotency-key', override instead of appending by ensuring caps are the same.
      is(l)
    );
  }
  _getUserAgentString(e) {
    let r = this._stripe.getConstant("PACKAGE_VERSION"), o = this._stripe._appInfo ? this._stripe.getAppInfoAsString() : "";
    return `Stripe/${e} NodeBindings/${r} ${o}`.trim();
  }
  _getTelemetryHeader() {
    if (this._stripe.getTelemetryEnabled() && this._stripe._prevRequestMetrics.length > 0) {
      let e = this._stripe._prevRequestMetrics.shift();
      return JSON.stringify({
        last_request_metrics: e
      });
    }
  }
  _recordRequestMetrics(e, r, o) {
    if (this._stripe.getTelemetryEnabled() && e)
      if (this._stripe._prevRequestMetrics.length > this._maxBufferedRequestMetric)
        rt("Request metrics buffer is full, dropping telemetry message.");
      else {
        let i = {
          request_id: e,
          request_duration_ms: r
        };
        o && o.length > 0 && (i.usage = o), this._stripe._prevRequestMetrics.push(i);
      }
  }
  _rawRequest(e, r, o, i, a) {
    return new Promise((p, h) => {
      let m;
      try {
        let f = e.toUpperCase();
        if (f !== "POST" && o && Object.keys(o).length !== 0)
          throw new Error("rawRequest only supports params on POST requests. Please pass null and add your parameters to path.");
        let g = [].slice.call([o, i]), P = be(g), S = f === "POST" ? Object.assign({}, P) : null, x = Vt(g), v = x.headers, E = x.authenticator;
        m = {
          requestMethod: f,
          requestPath: r,
          bodyData: S,
          queryData: {},
          authenticator: E,
          headers: v,
          host: x.host,
          streaming: !!x.streaming,
          settings: {},
          // We use this for thin event internals, so we should record the more specific `usage`, when available
          usage: a || ["raw_request"]
        };
      } catch (f) {
        h(f);
        return;
      }
      function u(f, g) {
        f ? h(f) : p(g);
      }
      s(u, "requestCallback");
      let { headers: d, settings: c } = m, y = m.authenticator;
      this._request(m.requestMethod, m.host, r, m.bodyData, y, { headers: d, settings: c, streaming: m.streaming }, m.usage, u);
    });
  }
  _getContentLength(e) {
    return typeof e == "string" ? new TextEncoder().encode(e).length : e.length;
  }
  _request(e, r, o, i, a, l, p = [], h, m = null) {
    var u;
    let d;
    a = (u = a ?? this._stripe._authenticator) !== null && u !== void 0 ? u : null;
    let c = Oe(o), y = /* @__PURE__ */ s((P, S, x, v, E) => setTimeout(P, this._getSleepTimeInMS(v, E), S, x, v + 1), "retryRequest"), f = /* @__PURE__ */ s((P, S, x) => {
      let v = l.settings && l.settings.timeout && Number.isInteger(l.settings.timeout) && l.settings.timeout >= 0 ? l.settings.timeout : this._stripe.getApiField("timeout"), E = {
        host: r || this._stripe.getApiField("host"),
        port: this._stripe.getApiField("port"),
        path: o,
        method: e,
        headers: Object.assign({}, S),
        body: d,
        protocol: this._stripe.getApiField("protocol")
      };
      a(E).then(() => {
        let w = this._stripe.getApiField("httpClient").makeRequest(E.host, E.port, E.path, E.method, E.headers, E.body, E.protocol, v), $ = Date.now(), I = Qt({
          api_version: P,
          account: Yt(S["Stripe-Account"]),
          idempotency_key: Yt(S["Idempotency-Key"]),
          method: e,
          path: o,
          request_start_time: $
        }), F = x || 0, q = this._getMaxNetworkRetries(l.settings || {});
        this._stripe._emitter.emit("request", I), w.then((M) => t._shouldRetry(M, F, q) ? y(f, P, S, F, cs(M.getHeaders()["retry-after"])) : l.streaming && M.getStatusCode() < 400 ? this._streamingResponseHandler(I, p, h)(M) : this._jsonResponseHandler(I, c, p, h)(M)).catch((M) => {
          if (t._shouldRetry(null, F, q, M))
            return y(f, P, S, F, null);
          {
            let ve = M.code && M.code === N.TIMEOUT_ERROR_CODE;
            return h(new it({
              message: ve ? `Request aborted due to timeout being reached (${v}ms)` : t._generateConnectionErrorMessage(F),
              detail: M
            }));
          }
        });
      }).catch((w) => {
        throw new C({
          message: "Unable to authenticate the request",
          exception: w
        });
      });
    }, "makeRequest"), g = /* @__PURE__ */ s((P, S) => {
      if (P)
        return h(P);
      d = S, this._stripe.getClientUserAgent((x) => {
        var v, E, w;
        let $ = this._stripe.getApiField("version"), I = this._makeHeaders({
          contentType: c == "v2" ? "application/json" : "application/x-www-form-urlencoded",
          contentLength: this._getContentLength(S),
          apiVersion: $,
          clientUserAgent: x,
          method: e,
          // other callers expect null, but .headers being optional means it's undefined if not supplied. So we normalize to null.
          userSuppliedHeaders: (v = l.headers) !== null && v !== void 0 ? v : null,
          userSuppliedSettings: (E = l.settings) !== null && E !== void 0 ? E : {},
          stripeAccount: (w = l.stripeAccount) !== null && w !== void 0 ? w : this._stripe.getApiField("stripeAccount"),
          stripeContext: this._normalizeStripeContext(l.stripeContext, this._stripe.getApiField("stripeContext")),
          apiMode: c
        });
        f($, I, 0);
      });
    }, "prepareAndMakeRequest");
    if (m)
      m(e, i, l.headers, g);
    else {
      let P;
      c == "v2" ? P = i ? us(i) : "" : P = re(i || {}, c), g(null, P);
    }
  }
};

// node_modules/stripe/esm/autoPagination.js
var cr = class {
  static {
    s(this, "V1Iterator");
  }
  constructor(e, r, o, i) {
    this.index = 0, this.pagePromise = e, this.promiseCache = { currentPromise: null }, this.requestArgs = r, this.spec = o, this.stripeResource = i;
  }
  async iterate(e) {
    if (!(e && e.data && typeof e.data.length == "number"))
      throw Error("Unexpected: Stripe API response does not have a well-formed `data` array.");
    let r = hs(this.requestArgs);
    if (this.index < e.data.length) {
      let o = r ? e.data.length - 1 - this.index : this.index, i = e.data[o];
      return this.index += 1, { value: i, done: !1 };
    } else if (e.has_more) {
      this.index = 0, this.pagePromise = this.getNextPage(e);
      let o = await this.pagePromise;
      return this.iterate(o);
    }
    return { done: !0, value: void 0 };
  }
  /** @abstract */
  getNextPage(e) {
    throw new Error("Unimplemented");
  }
  async _next() {
    return this.iterate(await this.pagePromise);
  }
  next() {
    if (this.promiseCache.currentPromise)
      return this.promiseCache.currentPromise;
    let e = (async () => {
      let r = await this._next();
      return this.promiseCache.currentPromise = null, r;
    })();
    return this.promiseCache.currentPromise = e, e;
  }
}, To = class extends cr {
  static {
    s(this, "V1ListIterator");
  }
  getNextPage(e) {
    let r = hs(this.requestArgs), o = md(e, r);
    return this.stripeResource._makeRequest(this.requestArgs, this.spec, {
      [r ? "ending_before" : "starting_after"]: o
    });
  }
}, So = class extends cr {
  static {
    s(this, "V1SearchIterator");
  }
  getNextPage(e) {
    if (!e.next_page)
      throw Error("Unexpected: Stripe API response does not have a well-formed `next_page` field, but `has_more` was true.");
    return this.stripeResource._makeRequest(this.requestArgs, this.spec, {
      page: e.next_page
    });
  }
}, _o = class {
  static {
    s(this, "V2ListIterator");
  }
  constructor(e, r, o, i) {
    this.currentPageIterator = (async () => (await e).data[Symbol.iterator]())(), this.nextPageUrl = (async () => (await e).next_page_url || null)(), this.requestArgs = r, this.spec = o, this.stripeResource = i;
  }
  async turnPage() {
    let e = await this.nextPageUrl;
    if (!e)
      return null;
    this.spec.fullPath = e;
    let r = await this.stripeResource._makeRequest([], this.spec, {});
    return this.nextPageUrl = Promise.resolve(r.next_page_url), this.currentPageIterator = Promise.resolve(r.data[Symbol.iterator]()), this.currentPageIterator;
  }
  async next() {
    {
      let o = (await this.currentPageIterator).next();
      if (!o.done)
        return { done: !1, value: o.value };
    }
    let e = await this.turnPage();
    if (!e)
      return { done: !0, value: void 0 };
    let r = e.next();
    return r.done ? { done: !0, value: void 0 } : { done: !1, value: r.value };
  }
}, ds = /* @__PURE__ */ s((t, e, r, o) => {
  let i = Oe(r.fullPath || r.path);
  return i !== "v2" && r.methodType === "search" ? go(new So(o, e, r, t)) : i !== "v2" && r.methodType === "list" ? go(new To(o, e, r, t)) : i === "v2" && r.methodType === "list" ? go(new _o(o, e, r, t)) : null;
}, "makeAutoPaginationMethods"), go = /* @__PURE__ */ s((t) => {
  let e = fd((...i) => t.next(...i)), r = yd(e), o = {
    autoPagingEach: e,
    autoPagingToArray: r,
    // Async iterator functions:
    next: /* @__PURE__ */ s(() => t.next(), "next"),
    return: /* @__PURE__ */ s(() => ({}), "return"),
    [pd()]: () => o
  };
  return o;
}, "makeAutoPaginationMethodsFromIterator");
function pd() {
  return typeof Symbol < "u" && Symbol.asyncIterator ? Symbol.asyncIterator : "@@asyncIterator";
}
s(pd, "getAsyncIteratorSymbol");
function dd(t) {
  if (t.length < 2)
    return null;
  let e = t[1];
  if (typeof e != "function")
    throw Error(`The second argument to autoPagingEach, if present, must be a callback function; received ${typeof e}`);
  return e;
}
s(dd, "getDoneCallback");
function hd(t) {
  if (t.length === 0)
    return;
  let e = t[0];
  if (typeof e != "function")
    throw Error(`The first argument to autoPagingEach, if present, must be a callback function; received ${typeof e}`);
  if (e.length === 2)
    return e;
  if (e.length > 2)
    throw Error(`The \`onItem\` callback function passed to autoPagingEach must accept at most two arguments; got ${e}`);
  return /* @__PURE__ */ s(function(o, i) {
    let a = e(o);
    i(a);
  }, "_onItem");
}
s(hd, "getItemCallback");
function md(t, e) {
  let r = e ? 0 : t.data.length - 1, o = t.data[r], i = o && o.id;
  if (!i)
    throw Error("Unexpected: No `id` found on the last item while auto-paging a list.");
  return i;
}
s(md, "getLastId");
function fd(t) {
  return /* @__PURE__ */ s(function() {
    let r = [].slice.call(arguments), o = hd(r), i = dd(r);
    if (r.length > 2)
      throw Error(`autoPagingEach takes up to two arguments; received ${r}`);
    let a = vd(
      t,
      // @ts-ignore we might need a null check
      o
    );
    return tt(a, i);
  }, "autoPagingEach");
}
s(fd, "makeAutoPagingEach");
function yd(t) {
  return /* @__PURE__ */ s(function(r, o) {
    let i = r && r.limit;
    if (!i)
      throw Error("You must pass a `limit` option to autoPagingToArray, e.g., `autoPagingToArray({limit: 1000});`.");
    if (i > 1e4)
      throw Error("You cannot specify a limit of more than 10,000 items to fetch in `autoPagingToArray`; use `autoPagingEach` to iterate through longer lists.");
    let a = new Promise((l, p) => {
      let h = [];
      t((m) => {
        if (h.push(m), h.length >= i)
          return !1;
      }).then(() => {
        l(h);
      }).catch(p);
    });
    return tt(a, o);
  }, "autoPagingToArray");
}
s(yd, "makeAutoPagingToArray");
function vd(t, e) {
  return new Promise((r, o) => {
    function i(a) {
      if (a.done) {
        r();
        return;
      }
      let l = a.value;
      return new Promise((p) => {
        e(l, p);
      }).then((p) => p === !1 ? i({ done: !0, value: void 0 }) : t().then(i));
    }
    s(i, "handleIteration"), t().then(i).catch(o);
  });
}
s(vd, "wrapAsyncIteratorWithCallback");
function hs(t) {
  let e = [].slice.call(t);
  return !!be(e).ending_before;
}
s(hs, "isReverseIteration");

// node_modules/stripe/esm/StripeMethod.js
function ms(t) {
  if (t.path !== void 0 && t.fullPath !== void 0)
    throw new Error(`Method spec specified both a 'path' (${t.path}) and a 'fullPath' (${t.fullPath}).`);
  return function(...e) {
    let r = typeof e[e.length - 1] == "function" && e.pop();
    t.urlParams = os(t.fullPath || this.createResourcePathWithSymbols(t.path || ""));
    let o = tt(this._makeRequest(e, t, {}), r);
    return Object.assign(o, ds(this, e, t, o)), o;
  };
}
s(ms, "stripeMethod");

// node_modules/stripe/esm/StripeResource.js
n.extend = ns;
n.method = ms;
n.MAX_BUFFERED_REQUEST_METRICS = 100;
function n(t, e) {
  if (this._stripe = t, e)
    throw new Error("Support for curried url params was dropped in stripe-node v7.0.0. Instead, pass two ids.");
  this.basePath = Kt(
    // @ts-ignore changing type of basePath
    this.basePath || t.getApiField("basePath")
  ), this.resourcePath = this.path, this.path = Kt(this.path), this.initialize(...arguments);
}
s(n, "StripeResource");
n.prototype = {
  _stripe: null,
  // @ts-ignore the type of path changes in ctor
  path: "",
  resourcePath: "",
  // Methods that don't use the API's default '/v1' path can override it with this setting.
  basePath: null,
  initialize() {
  },
  // Function to override the default data processor. This allows full control
  // over how a StripeResource's request data will get converted into an HTTP
  // body. This is useful for non-standard HTTP requests. The function should
  // take method name, data, and headers as arguments.
  requestDataProcessor: null,
  // Function to add a validation checks before sending the request, errors should
  // be thrown, and they will be passed to the callback/promise.
  validateRequest: null,
  createFullPath(t, e) {
    let r = [this.basePath(e), this.path(e)];
    if (typeof t == "function") {
      let o = t(e);
      o && r.push(o);
    } else
      r.push(t);
    return this._joinUrlParts(r);
  },
  // Creates a relative resource path with symbols left in (unlike
  // createFullPath which takes some data to replace them with). For example it
  // might produce: /invoices/{id}
  createResourcePathWithSymbols(t) {
    return t ? `/${this._joinUrlParts([this.resourcePath, t])}` : `/${this.resourcePath}`;
  },
  _joinUrlParts(t) {
    return t.join("/").replace(/\/{2,}/g, "/");
  },
  _getRequestOpts(t, e, r) {
    var o;
    let i = (e.method || "GET").toUpperCase(), a = e.usage || [], l = e.urlParams || [], p = e.encode || ((I) => I), h = !!e.fullPath, m = Kt(h ? e.fullPath : e.path || ""), u = h ? e.fullPath : this.createResourcePathWithSymbols(e.path), d = [].slice.call(t), c = l.reduce((I, F) => {
      let q = d.shift();
      if (typeof q != "string")
        throw new Error(`Stripe: Argument "${F}" must be a string, but got: ${q} (on API request to \`${i} ${u}\`)`);
      return I[F] = q, I;
    }, {}), y = be(d), f = p(Object.assign({}, y, r)), g = Vt(d), P = g.host || e.host, S = !!e.streaming || !!g.streaming;
    if (d.filter((I) => I != null).length)
      throw new Error(`Stripe: Unknown arguments (${d}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options. (on API request to ${i} \`${u}\`)`);
    let x = h ? m(c) : this.createFullPath(m, c), v = Object.assign(g.headers, e.headers);
    e.validator && e.validator(f, { headers: v });
    let E = e.method === "GET" || e.method === "DELETE";
    return {
      requestMethod: i,
      requestPath: x,
      bodyData: E ? null : f,
      queryData: E ? f : {},
      authenticator: (o = g.authenticator) !== null && o !== void 0 ? o : null,
      headers: v,
      host: P ?? null,
      streaming: S,
      settings: g.settings,
      usage: a
    };
  },
  _makeRequest(t, e, r) {
    return new Promise((o, i) => {
      var a;
      let l;
      try {
        l = this._getRequestOpts(t, e, r);
      } catch (c) {
        i(c);
        return;
      }
      function p(c, y) {
        c ? i(c) : o(e.transformResponseData ? e.transformResponseData(y) : y);
      }
      s(p, "requestCallback");
      let h = Object.keys(l.queryData).length === 0, m = [
        l.requestPath,
        h ? "" : "?",
        re(l.queryData, Oe(l.requestPath))
      ].join(""), { headers: u, settings: d } = l;
      this._stripe._requestSender._request(l.requestMethod, l.host, m, l.bodyData, l.authenticator, {
        headers: u,
        settings: d,
        streaming: l.streaming
      }, l.usage, p, (a = this.requestDataProcessor) === null || a === void 0 ? void 0 : a.bind(this));
    });
  }
};

// node_modules/stripe/esm/StripeContext.js
var at = class t {
  static {
    s(this, "StripeContext");
  }
  /**
   * Creates a new StripeContext with the given segments.
   */
  constructor(e = []) {
    this._segments = [...e];
  }
  /**
   * Gets a copy of the segments of this Context.
   */
  get segments() {
    return [...this._segments];
  }
  /**
   * Creates a new StripeContext with an additional segment appended.
   */
  push(e) {
    if (!e)
      throw new Error("Segment cannot be null or undefined");
    return new t([...this._segments, e]);
  }
  /**
   * Creates a new StripeContext with the last segment removed.
   * If there are no segments, throws an error.
   */
  pop() {
    if (this._segments.length === 0)
      throw new Error("Cannot pop from an empty context");
    return new t(this._segments.slice(0, -1));
  }
  /**
   * Converts this context to its string representation.
   */
  toString() {
    return this._segments.join("/");
  }
  /**
   * Parses a context string into a StripeContext instance.
   */
  static parse(e) {
    return e ? new t(e.split("/")) : new t([]);
  }
};

// node_modules/stripe/esm/Webhooks.js
function fs(t) {
  let e = {
    DEFAULT_TOLERANCE: 300,
    signature: null,
    constructEvent(u, d, c, y, f, g) {
      try {
        if (!this.signature)
          throw new Error("ERR: missing signature helper, unable to verify");
        this.signature.verifyHeader(u, d, c, y || e.DEFAULT_TOLERANCE, f, g);
      } catch (S) {
        throw S instanceof Ae && (S.message += "\nUse `await constructEventAsync(...)` instead of `constructEvent(...)`"), S;
      }
      return u instanceof Uint8Array ? JSON.parse(new TextDecoder("utf8").decode(u)) : JSON.parse(u);
    },
    async constructEventAsync(u, d, c, y, f, g) {
      if (!this.signature)
        throw new Error("ERR: missing signature helper, unable to verify");
      return await this.signature.verifyHeaderAsync(u, d, c, y || e.DEFAULT_TOLERANCE, f, g), u instanceof Uint8Array ? JSON.parse(new TextDecoder("utf8").decode(u)) : JSON.parse(u);
    },
    /**
     * Generates a header to be used for webhook mocking
     *
     * @typedef {object} opts
     * @property {number} timestamp - Timestamp of the header. Defaults to Date.now()
     * @property {string} payload - JSON stringified payload object, containing the 'id' and 'object' parameters
     * @property {string} secret - Stripe webhook secret 'whsec_...'
     * @property {string} scheme - Version of API to hit. Defaults to 'v1'.
     * @property {string} signature - Computed webhook signature
     * @property {CryptoProvider} cryptoProvider - Crypto provider to use for computing the signature if none was provided. Defaults to NodeCryptoProvider.
     */
    generateTestHeaderString: /* @__PURE__ */ s(function(u) {
      let d = m(u), c = d.signature || d.cryptoProvider.computeHMACSignature(d.payloadString, d.secret);
      return d.generateHeaderString(c);
    }, "generateTestHeaderString"),
    generateTestHeaderStringAsync: /* @__PURE__ */ s(async function(u) {
      let d = m(u), c = d.signature || await d.cryptoProvider.computeHMACSignatureAsync(d.payloadString, d.secret);
      return d.generateHeaderString(c);
    }, "generateTestHeaderStringAsync")
  }, r = {
    EXPECTED_SCHEME: "v1",
    verifyHeader(u, d, c, y, f, g) {
      let { decodedHeader: P, decodedPayload: S, details: x, suspectPayloadType: v } = i(u, d, this.EXPECTED_SCHEME), E = /\s/.test(c);
      f = f || h();
      let w = f.computeHMACSignature(o(S, x), c);
      return a(S, P, x, w, y, v, E, g), !0;
    },
    async verifyHeaderAsync(u, d, c, y, f, g) {
      let { decodedHeader: P, decodedPayload: S, details: x, suspectPayloadType: v } = i(u, d, this.EXPECTED_SCHEME), E = /\s/.test(c);
      f = f || h();
      let w = await f.computeHMACSignatureAsync(o(S, x), c);
      return a(S, P, x, w, y, v, E, g);
    }
  };
  function o(u, d) {
    return `${d.timestamp}.${u}`;
  }
  s(o, "makeHMACContent");
  function i(u, d, c) {
    if (!u)
      throw new B(d, u, {
        message: "No webhook payload was provided."
      });
    let y = typeof u != "string" && !(u instanceof Uint8Array), f = new TextDecoder("utf8"), g = u instanceof Uint8Array ? f.decode(u) : u;
    if (Array.isArray(d))
      throw new Error("Unexpected: An array was passed as a header, which should not be possible for the stripe-signature header.");
    if (d == null || d == "")
      throw new B(d, u, {
        message: "No stripe-signature header value was provided."
      });
    let P = d instanceof Uint8Array ? f.decode(d) : d, S = l(P, c);
    if (!S || S.timestamp === -1)
      throw new B(P, g, {
        message: "Unable to extract timestamp and signatures from header"
      });
    if (!S.signatures.length)
      throw new B(P, g, {
        message: "No signatures found with expected scheme"
      });
    return {
      decodedPayload: g,
      decodedHeader: P,
      details: S,
      suspectPayloadType: y
    };
  }
  s(i, "parseEventDetails");
  function a(u, d, c, y, f, g, P, S) {
    let x = !!c.signatures.filter(t.secureCompare.bind(t, y)).length, v = `
Learn more about webhook signing and explore webhook integration examples for various frameworks at https://docs.stripe.com/webhooks/signature`, E = P ? `

Note: The provided signing secret contains whitespace. This often indicates an extra newline or space is in the value` : "";
    if (!x)
      throw g ? new B(d, u, {
        message: `Webhook payload must be provided as a string or a Buffer (https://nodejs.org/api/buffer.html) instance representing the _raw_ request body.Payload was provided as a parsed JavaScript object instead. 
Signature verification is impossible without access to the original signed material. 
` + v + `
` + E
      }) : new B(d, u, {
        message: `No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? 
 If a webhook request is being forwarded by a third-party tool, ensure that the exact request body, including JSON formatting and new line style, is preserved.
` + v + `
` + E
      });
    let w = Math.floor((typeof S == "number" ? S : Date.now()) / 1e3) - c.timestamp;
    if (f > 0 && w > f)
      throw new B(d, u, {
        message: "Timestamp outside the tolerance zone"
      });
    return !0;
  }
  s(a, "validateComputedSignature");
  function l(u, d) {
    return typeof u != "string" ? null : u.split(",").reduce((c, y) => {
      let f = y.split("=");
      return f[0] === "t" && (c.timestamp = parseInt(f[1], 10)), f[0] === d && c.signatures.push(f[1]), c;
    }, {
      timestamp: -1,
      signatures: []
    });
  }
  s(l, "parseHeader");
  let p = null;
  function h() {
    return p || (p = t.createDefaultCryptoProvider()), p;
  }
  s(h, "getCryptoProvider");
  function m(u) {
    if (!u)
      throw new C({
        message: "Options are required"
      });
    let d = Math.floor(u.timestamp) || Math.floor(Date.now() / 1e3), c = u.scheme || r.EXPECTED_SCHEME, y = u.cryptoProvider || h(), f = `${d}.${u.payload}`, g = /* @__PURE__ */ s((P) => `t=${d},${c}=${P}`, "generateHeaderString");
    return Object.assign(Object.assign({}, u), {
      timestamp: d,
      scheme: c,
      cryptoProvider: y,
      payloadString: f,
      generateHeaderString: g
    });
  }
  return s(m, "prepareOptions"), e.signature = r, e;
}
s(fs, "createWebhooks");

// node_modules/stripe/esm/apiVersion.js
var Eo = "2025-12-15.clover";

// node_modules/stripe/esm/resources.js
var He = {};
$o(He, {
  Account: () => qo,
  AccountLinks: () => al,
  AccountSessions: () => ll,
  Accounts: () => qo,
  ApplePayDomains: () => ul,
  ApplicationFees: () => cl,
  Apps: () => zd,
  Balance: () => pl,
  BalanceSettings: () => hl,
  BalanceTransactions: () => fl,
  Billing: () => jd,
  BillingPortal: () => Wd,
  Charges: () => yl,
  Checkout: () => Kd,
  Climate: () => Vd,
  ConfirmationTokens: () => vl,
  CountrySpecs: () => gl,
  Coupons: () => Tl,
  CreditNotes: () => Sl,
  CustomerSessions: () => _l,
  Customers: () => El,
  Disputes: () => xl,
  Entitlements: () => Qd,
  EphemeralKeys: () => Ol,
  Events: () => Rl,
  ExchangeRates: () => Cl,
  FileLinks: () => Il,
  Files: () => Gl,
  FinancialConnections: () => Jd,
  Forwarding: () => Yd,
  Identity: () => Xd,
  InvoiceItems: () => Dl,
  InvoicePayments: () => ql,
  InvoiceRenderingTemplates: () => Nl,
  Invoices: () => Fl,
  Issuing: () => Zd,
  Mandates: () => Ll,
  OAuth: () => $l,
  PaymentAttemptRecords: () => Bl,
  PaymentIntents: () => zl,
  PaymentLinks: () => jl,
  PaymentMethodConfigurations: () => Wl,
  PaymentMethodDomains: () => Kl,
  PaymentMethods: () => Vl,
  PaymentRecords: () => Ql,
  Payouts: () => Jl,
  Plans: () => Yl,
  Prices: () => Xl,
  Products: () => Zl,
  PromotionCodes: () => eu,
  Quotes: () => tu,
  Radar: () => eh,
  Refunds: () => ru,
  Reporting: () => th,
  Reviews: () => ou,
  SetupAttempts: () => nu,
  SetupIntents: () => iu,
  ShippingRates: () => su,
  Sigma: () => rh,
  Sources: () => au,
  SubscriptionItems: () => lu,
  SubscriptionSchedules: () => uu,
  Subscriptions: () => cu,
  Tax: () => oh,
  TaxCodes: () => du,
  TaxIds: () => hu,
  TaxRates: () => mu,
  Terminal: () => nh,
  TestHelpers: () => ih,
  Tokens: () => yu,
  Topups: () => vu,
  Transfers: () => Pu,
  Treasury: () => sh,
  V2: () => ah,
  WebhookEndpoints: () => gu
});

// node_modules/stripe/esm/ResourceNamespace.js
function Pd(t, e) {
  for (let r in e) {
    if (!Object.prototype.hasOwnProperty.call(e, r))
      continue;
    let o = r[0].toLowerCase() + r.substring(1), i = new e[r](t);
    this[o] = i;
  }
}
s(Pd, "ResourceNamespace");
function O(t, e) {
  return function(r) {
    return new Pd(r, e);
  };
}
s(O, "resourceNamespace");

// node_modules/stripe/esm/resources/V2/Core/AccountLinks.js
var gd = n.method, ys = n.extend({
  create: gd({ method: "POST", fullPath: "/v2/core/account_links" })
});

// node_modules/stripe/esm/resources/V2/Core/AccountTokens.js
var vs = n.method, Ps = n.extend({
  create: vs({ method: "POST", fullPath: "/v2/core/account_tokens" }),
  retrieve: vs({
    method: "GET",
    fullPath: "/v2/core/account_tokens/{id}"
  })
});

// node_modules/stripe/esm/resources/FinancialConnections/Accounts.js
var pe = n.method, gs = n.extend({
  retrieve: pe({
    method: "GET",
    fullPath: "/v1/financial_connections/accounts/{account}"
  }),
  list: pe({
    method: "GET",
    fullPath: "/v1/financial_connections/accounts",
    methodType: "list"
  }),
  disconnect: pe({
    method: "POST",
    fullPath: "/v1/financial_connections/accounts/{account}/disconnect"
  }),
  listOwners: pe({
    method: "GET",
    fullPath: "/v1/financial_connections/accounts/{account}/owners",
    methodType: "list"
  }),
  refresh: pe({
    method: "POST",
    fullPath: "/v1/financial_connections/accounts/{account}/refresh"
  }),
  subscribe: pe({
    method: "POST",
    fullPath: "/v1/financial_connections/accounts/{account}/subscribe"
  }),
  unsubscribe: pe({
    method: "POST",
    fullPath: "/v1/financial_connections/accounts/{account}/unsubscribe"
  })
});

// node_modules/stripe/esm/resources/V2/Core/Accounts/Persons.js
var lt = n.method, Ts = n.extend({
  create: lt({
    method: "POST",
    fullPath: "/v2/core/accounts/{account_id}/persons"
  }),
  retrieve: lt({
    method: "GET",
    fullPath: "/v2/core/accounts/{account_id}/persons/{id}"
  }),
  update: lt({
    method: "POST",
    fullPath: "/v2/core/accounts/{account_id}/persons/{id}"
  }),
  list: lt({
    method: "GET",
    fullPath: "/v2/core/accounts/{account_id}/persons",
    methodType: "list"
  }),
  del: lt({
    method: "DELETE",
    fullPath: "/v2/core/accounts/{account_id}/persons/{id}"
  })
});

// node_modules/stripe/esm/resources/V2/Core/Accounts/PersonTokens.js
var Ss = n.method, _s = n.extend({
  create: Ss({
    method: "POST",
    fullPath: "/v2/core/accounts/{account_id}/person_tokens"
  }),
  retrieve: Ss({
    method: "GET",
    fullPath: "/v2/core/accounts/{account_id}/person_tokens/{id}"
  })
});

// node_modules/stripe/esm/resources/V2/Core/Accounts.js
var ut = n.method, Es = n.extend({
  constructor: /* @__PURE__ */ s(function(...t) {
    n.apply(this, t), this.persons = new Ts(...t), this.personTokens = new _s(...t);
  }, "constructor"),
  create: ut({ method: "POST", fullPath: "/v2/core/accounts" }),
  retrieve: ut({ method: "GET", fullPath: "/v2/core/accounts/{id}" }),
  update: ut({ method: "POST", fullPath: "/v2/core/accounts/{id}" }),
  list: ut({
    method: "GET",
    fullPath: "/v2/core/accounts",
    methodType: "list"
  }),
  close: ut({
    method: "POST",
    fullPath: "/v2/core/accounts/{id}/close"
  })
});

// node_modules/stripe/esm/resources/Entitlements/ActiveEntitlements.js
var xs = n.method, bs = n.extend({
  retrieve: xs({
    method: "GET",
    fullPath: "/v1/entitlements/active_entitlements/{id}"
  }),
  list: xs({
    method: "GET",
    fullPath: "/v1/entitlements/active_entitlements",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Billing/Alerts.js
var Ge = n.method, Os = n.extend({
  create: Ge({ method: "POST", fullPath: "/v1/billing/alerts" }),
  retrieve: Ge({ method: "GET", fullPath: "/v1/billing/alerts/{id}" }),
  list: Ge({
    method: "GET",
    fullPath: "/v1/billing/alerts",
    methodType: "list"
  }),
  activate: Ge({
    method: "POST",
    fullPath: "/v1/billing/alerts/{id}/activate"
  }),
  archive: Ge({
    method: "POST",
    fullPath: "/v1/billing/alerts/{id}/archive"
  }),
  deactivate: Ge({
    method: "POST",
    fullPath: "/v1/billing/alerts/{id}/deactivate"
  })
});

// node_modules/stripe/esm/resources/Tax/Associations.js
var Td = n.method, ws = n.extend({
  find: Td({ method: "GET", fullPath: "/v1/tax/associations/find" })
});

// node_modules/stripe/esm/resources/Issuing/Authorizations.js
var ct = n.method, Rs = n.extend({
  retrieve: ct({
    method: "GET",
    fullPath: "/v1/issuing/authorizations/{authorization}"
  }),
  update: ct({
    method: "POST",
    fullPath: "/v1/issuing/authorizations/{authorization}"
  }),
  list: ct({
    method: "GET",
    fullPath: "/v1/issuing/authorizations",
    methodType: "list"
  }),
  approve: ct({
    method: "POST",
    fullPath: "/v1/issuing/authorizations/{authorization}/approve"
  }),
  decline: ct({
    method: "POST",
    fullPath: "/v1/issuing/authorizations/{authorization}/decline"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Issuing/Authorizations.js
var de = n.method, As = n.extend({
  create: de({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations"
  }),
  capture: de({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/capture"
  }),
  expire: de({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/expire"
  }),
  finalizeAmount: de({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/finalize_amount"
  }),
  increment: de({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/increment"
  }),
  respond: de({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/fraud_challenges/respond"
  }),
  reverse: de({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/reverse"
  })
});

// node_modules/stripe/esm/resources/Tax/Calculations.js
var xo = n.method, Cs = n.extend({
  create: xo({ method: "POST", fullPath: "/v1/tax/calculations" }),
  retrieve: xo({
    method: "GET",
    fullPath: "/v1/tax/calculations/{calculation}"
  }),
  listLineItems: xo({
    method: "GET",
    fullPath: "/v1/tax/calculations/{calculation}/line_items",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Issuing/Cardholders.js
var pr = n.method, Is = n.extend({
  create: pr({ method: "POST", fullPath: "/v1/issuing/cardholders" }),
  retrieve: pr({
    method: "GET",
    fullPath: "/v1/issuing/cardholders/{cardholder}"
  }),
  update: pr({
    method: "POST",
    fullPath: "/v1/issuing/cardholders/{cardholder}"
  }),
  list: pr({
    method: "GET",
    fullPath: "/v1/issuing/cardholders",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Issuing/Cards.js
var dr = n.method, Ms = n.extend({
  create: dr({ method: "POST", fullPath: "/v1/issuing/cards" }),
  retrieve: dr({ method: "GET", fullPath: "/v1/issuing/cards/{card}" }),
  update: dr({ method: "POST", fullPath: "/v1/issuing/cards/{card}" }),
  list: dr({
    method: "GET",
    fullPath: "/v1/issuing/cards",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Issuing/Cards.js
var pt = n.method, Gs = n.extend({
  deliverCard: pt({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/deliver"
  }),
  failCard: pt({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/fail"
  }),
  returnCard: pt({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/return"
  }),
  shipCard: pt({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/ship"
  }),
  submitCard: pt({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/submit"
  })
});

// node_modules/stripe/esm/resources/BillingPortal/Configurations.js
var hr = n.method, Ds = n.extend({
  create: hr({
    method: "POST",
    fullPath: "/v1/billing_portal/configurations"
  }),
  retrieve: hr({
    method: "GET",
    fullPath: "/v1/billing_portal/configurations/{configuration}"
  }),
  update: hr({
    method: "POST",
    fullPath: "/v1/billing_portal/configurations/{configuration}"
  }),
  list: hr({
    method: "GET",
    fullPath: "/v1/billing_portal/configurations",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Terminal/Configurations.js
var dt = n.method, ks = n.extend({
  create: dt({
    method: "POST",
    fullPath: "/v1/terminal/configurations"
  }),
  retrieve: dt({
    method: "GET",
    fullPath: "/v1/terminal/configurations/{configuration}"
  }),
  update: dt({
    method: "POST",
    fullPath: "/v1/terminal/configurations/{configuration}"
  }),
  list: dt({
    method: "GET",
    fullPath: "/v1/terminal/configurations",
    methodType: "list"
  }),
  del: dt({
    method: "DELETE",
    fullPath: "/v1/terminal/configurations/{configuration}"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/ConfirmationTokens.js
var Sd = n.method, qs = n.extend({
  create: Sd({
    method: "POST",
    fullPath: "/v1/test_helpers/confirmation_tokens"
  })
});

// node_modules/stripe/esm/resources/Terminal/ConnectionTokens.js
var _d = n.method, Ns = n.extend({
  create: _d({
    method: "POST",
    fullPath: "/v1/terminal/connection_tokens"
  })
});

// node_modules/stripe/esm/resources/Billing/CreditBalanceSummary.js
var Ed = n.method, Fs = n.extend({
  retrieve: Ed({
    method: "GET",
    fullPath: "/v1/billing/credit_balance_summary"
  })
});

// node_modules/stripe/esm/resources/Billing/CreditBalanceTransactions.js
var Ls = n.method, Us = n.extend({
  retrieve: Ls({
    method: "GET",
    fullPath: "/v1/billing/credit_balance_transactions/{id}"
  }),
  list: Ls({
    method: "GET",
    fullPath: "/v1/billing/credit_balance_transactions",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Billing/CreditGrants.js
var De = n.method, $s = n.extend({
  create: De({ method: "POST", fullPath: "/v1/billing/credit_grants" }),
  retrieve: De({
    method: "GET",
    fullPath: "/v1/billing/credit_grants/{id}"
  }),
  update: De({
    method: "POST",
    fullPath: "/v1/billing/credit_grants/{id}"
  }),
  list: De({
    method: "GET",
    fullPath: "/v1/billing/credit_grants",
    methodType: "list"
  }),
  expire: De({
    method: "POST",
    fullPath: "/v1/billing/credit_grants/{id}/expire"
  }),
  voidGrant: De({
    method: "POST",
    fullPath: "/v1/billing/credit_grants/{id}/void"
  })
});

// node_modules/stripe/esm/resources/Treasury/CreditReversals.js
var bo = n.method, Hs = n.extend({
  create: bo({
    method: "POST",
    fullPath: "/v1/treasury/credit_reversals"
  }),
  retrieve: bo({
    method: "GET",
    fullPath: "/v1/treasury/credit_reversals/{credit_reversal}"
  }),
  list: bo({
    method: "GET",
    fullPath: "/v1/treasury/credit_reversals",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Customers.js
var xd = n.method, Bs = n.extend({
  fundCashBalance: xd({
    method: "POST",
    fullPath: "/v1/test_helpers/customers/{customer}/fund_cash_balance"
  })
});

// node_modules/stripe/esm/resources/Treasury/DebitReversals.js
var Oo = n.method, zs = n.extend({
  create: Oo({
    method: "POST",
    fullPath: "/v1/treasury/debit_reversals"
  }),
  retrieve: Oo({
    method: "GET",
    fullPath: "/v1/treasury/debit_reversals/{debit_reversal}"
  }),
  list: Oo({
    method: "GET",
    fullPath: "/v1/treasury/debit_reversals",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Issuing/Disputes.js
var ht = n.method, js = n.extend({
  create: ht({ method: "POST", fullPath: "/v1/issuing/disputes" }),
  retrieve: ht({
    method: "GET",
    fullPath: "/v1/issuing/disputes/{dispute}"
  }),
  update: ht({
    method: "POST",
    fullPath: "/v1/issuing/disputes/{dispute}"
  }),
  list: ht({
    method: "GET",
    fullPath: "/v1/issuing/disputes",
    methodType: "list"
  }),
  submit: ht({
    method: "POST",
    fullPath: "/v1/issuing/disputes/{dispute}/submit"
  })
});

// node_modules/stripe/esm/resources/Radar/EarlyFraudWarnings.js
var Ws = n.method, Ks = n.extend({
  retrieve: Ws({
    method: "GET",
    fullPath: "/v1/radar/early_fraud_warnings/{early_fraud_warning}"
  }),
  list: Ws({
    method: "GET",
    fullPath: "/v1/radar/early_fraud_warnings",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/V2/Core/EventDestinations.js
var oe = n.method, Vs = n.extend({
  create: oe({
    method: "POST",
    fullPath: "/v2/core/event_destinations"
  }),
  retrieve: oe({
    method: "GET",
    fullPath: "/v2/core/event_destinations/{id}"
  }),
  update: oe({
    method: "POST",
    fullPath: "/v2/core/event_destinations/{id}"
  }),
  list: oe({
    method: "GET",
    fullPath: "/v2/core/event_destinations",
    methodType: "list"
  }),
  del: oe({
    method: "DELETE",
    fullPath: "/v2/core/event_destinations/{id}"
  }),
  disable: oe({
    method: "POST",
    fullPath: "/v2/core/event_destinations/{id}/disable"
  }),
  enable: oe({
    method: "POST",
    fullPath: "/v2/core/event_destinations/{id}/enable"
  }),
  ping: oe({
    method: "POST",
    fullPath: "/v2/core/event_destinations/{id}/ping"
  })
});

// node_modules/stripe/esm/resources/V2/Core/Events.js
var wo = n.method, Qs = n.extend({
  retrieve(...t) {
    return wo({
      method: "GET",
      fullPath: "/v2/core/events/{id}",
      transformResponseData: /* @__PURE__ */ s((r) => this.addFetchRelatedObjectIfNeeded(r), "transformResponseData")
    }).apply(this, t);
  },
  list(...t) {
    return wo({
      method: "GET",
      fullPath: "/v2/core/events",
      methodType: "list",
      transformResponseData: /* @__PURE__ */ s((r) => Object.assign(Object.assign({}, r), { data: r.data.map(this.addFetchRelatedObjectIfNeeded.bind(this)) }), "transformResponseData")
    }).apply(this, t);
  },
  /**
   * @private
   *
   * For internal use in stripe-node.
   *
   * @param pulledEvent The retrieved event object
   * @returns The retrieved event object with a fetchRelatedObject method,
   * if pulledEvent.related_object is valid (non-null and has a url)
   */
  addFetchRelatedObjectIfNeeded(t) {
    return !t.related_object || !t.related_object.url ? t : Object.assign(Object.assign({}, t), { fetchRelatedObject: /* @__PURE__ */ s(() => (
      // call stripeMethod with 'this' resource to fetch
      // the related object. 'this' is needed to construct
      // and send the request, but the method spec controls
      // the url endpoint and method, so it doesn't matter
      // that 'this' is an Events resource object here
      wo({
        method: "GET",
        fullPath: t.related_object.url
      }).apply(this, [
        {
          stripeContext: t.context
        }
      ])
    ), "fetchRelatedObject") });
  }
});

// node_modules/stripe/esm/resources/Entitlements/Features.js
var mr = n.method, Js = n.extend({
  create: mr({ method: "POST", fullPath: "/v1/entitlements/features" }),
  retrieve: mr({
    method: "GET",
    fullPath: "/v1/entitlements/features/{id}"
  }),
  update: mr({
    method: "POST",
    fullPath: "/v1/entitlements/features/{id}"
  }),
  list: mr({
    method: "GET",
    fullPath: "/v1/entitlements/features",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Treasury/FinancialAccounts.js
var he = n.method, Ys = n.extend({
  create: he({
    method: "POST",
    fullPath: "/v1/treasury/financial_accounts"
  }),
  retrieve: he({
    method: "GET",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}"
  }),
  update: he({
    method: "POST",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}"
  }),
  list: he({
    method: "GET",
    fullPath: "/v1/treasury/financial_accounts",
    methodType: "list"
  }),
  close: he({
    method: "POST",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}/close"
  }),
  retrieveFeatures: he({
    method: "GET",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}/features"
  }),
  updateFeatures: he({
    method: "POST",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}/features"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Treasury/InboundTransfers.js
var Ro = n.method, Xs = n.extend({
  fail: Ro({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/fail"
  }),
  returnInboundTransfer: Ro({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/return"
  }),
  succeed: Ro({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/succeed"
  })
});

// node_modules/stripe/esm/resources/Treasury/InboundTransfers.js
var fr = n.method, Zs = n.extend({
  create: fr({
    method: "POST",
    fullPath: "/v1/treasury/inbound_transfers"
  }),
  retrieve: fr({
    method: "GET",
    fullPath: "/v1/treasury/inbound_transfers/{id}"
  }),
  list: fr({
    method: "GET",
    fullPath: "/v1/treasury/inbound_transfers",
    methodType: "list"
  }),
  cancel: fr({
    method: "POST",
    fullPath: "/v1/treasury/inbound_transfers/{inbound_transfer}/cancel"
  })
});

// node_modules/stripe/esm/resources/Terminal/Locations.js
var mt = n.method, ea = n.extend({
  create: mt({ method: "POST", fullPath: "/v1/terminal/locations" }),
  retrieve: mt({
    method: "GET",
    fullPath: "/v1/terminal/locations/{location}"
  }),
  update: mt({
    method: "POST",
    fullPath: "/v1/terminal/locations/{location}"
  }),
  list: mt({
    method: "GET",
    fullPath: "/v1/terminal/locations",
    methodType: "list"
  }),
  del: mt({
    method: "DELETE",
    fullPath: "/v1/terminal/locations/{location}"
  })
});

// node_modules/stripe/esm/resources/Billing/MeterEventAdjustments.js
var bd = n.method, ta = n.extend({
  create: bd({
    method: "POST",
    fullPath: "/v1/billing/meter_event_adjustments"
  })
});

// node_modules/stripe/esm/resources/V2/Billing/MeterEventAdjustments.js
var Od = n.method, ra = n.extend({
  create: Od({
    method: "POST",
    fullPath: "/v2/billing/meter_event_adjustments"
  })
});

// node_modules/stripe/esm/resources/V2/Billing/MeterEventSession.js
var wd = n.method, oa = n.extend({
  create: wd({
    method: "POST",
    fullPath: "/v2/billing/meter_event_session"
  })
});

// node_modules/stripe/esm/resources/V2/Billing/MeterEventStream.js
var Rd = n.method, na = n.extend({
  create: Rd({
    method: "POST",
    fullPath: "/v2/billing/meter_event_stream",
    host: "meter-events.stripe.com"
  })
});

// node_modules/stripe/esm/resources/Billing/MeterEvents.js
var Ad = n.method, ia = n.extend({
  create: Ad({ method: "POST", fullPath: "/v1/billing/meter_events" })
});

// node_modules/stripe/esm/resources/V2/Billing/MeterEvents.js
var Cd = n.method, sa = n.extend({
  create: Cd({ method: "POST", fullPath: "/v2/billing/meter_events" })
});

// node_modules/stripe/esm/resources/Billing/Meters.js
var me = n.method, aa = n.extend({
  create: me({ method: "POST", fullPath: "/v1/billing/meters" }),
  retrieve: me({ method: "GET", fullPath: "/v1/billing/meters/{id}" }),
  update: me({ method: "POST", fullPath: "/v1/billing/meters/{id}" }),
  list: me({
    method: "GET",
    fullPath: "/v1/billing/meters",
    methodType: "list"
  }),
  deactivate: me({
    method: "POST",
    fullPath: "/v1/billing/meters/{id}/deactivate"
  }),
  listEventSummaries: me({
    method: "GET",
    fullPath: "/v1/billing/meters/{id}/event_summaries",
    methodType: "list"
  }),
  reactivate: me({
    method: "POST",
    fullPath: "/v1/billing/meters/{id}/reactivate"
  })
});

// node_modules/stripe/esm/resources/Terminal/OnboardingLinks.js
var Id = n.method, la = n.extend({
  create: Id({
    method: "POST",
    fullPath: "/v1/terminal/onboarding_links"
  })
});

// node_modules/stripe/esm/resources/Climate/Orders.js
var ft = n.method, ua = n.extend({
  create: ft({ method: "POST", fullPath: "/v1/climate/orders" }),
  retrieve: ft({
    method: "GET",
    fullPath: "/v1/climate/orders/{order}"
  }),
  update: ft({
    method: "POST",
    fullPath: "/v1/climate/orders/{order}"
  }),
  list: ft({
    method: "GET",
    fullPath: "/v1/climate/orders",
    methodType: "list"
  }),
  cancel: ft({
    method: "POST",
    fullPath: "/v1/climate/orders/{order}/cancel"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Treasury/OutboundPayments.js
var yr = n.method, ca = n.extend({
  update: yr({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}"
  }),
  fail: yr({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/fail"
  }),
  post: yr({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/post"
  }),
  returnOutboundPayment: yr({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/return"
  })
});

// node_modules/stripe/esm/resources/Treasury/OutboundPayments.js
var vr = n.method, pa = n.extend({
  create: vr({
    method: "POST",
    fullPath: "/v1/treasury/outbound_payments"
  }),
  retrieve: vr({
    method: "GET",
    fullPath: "/v1/treasury/outbound_payments/{id}"
  }),
  list: vr({
    method: "GET",
    fullPath: "/v1/treasury/outbound_payments",
    methodType: "list"
  }),
  cancel: vr({
    method: "POST",
    fullPath: "/v1/treasury/outbound_payments/{id}/cancel"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Treasury/OutboundTransfers.js
var Pr = n.method, da = n.extend({
  update: Pr({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}"
  }),
  fail: Pr({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/fail"
  }),
  post: Pr({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/post"
  }),
  returnOutboundTransfer: Pr({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/return"
  })
});

// node_modules/stripe/esm/resources/Treasury/OutboundTransfers.js
var gr = n.method, ha = n.extend({
  create: gr({
    method: "POST",
    fullPath: "/v1/treasury/outbound_transfers"
  }),
  retrieve: gr({
    method: "GET",
    fullPath: "/v1/treasury/outbound_transfers/{outbound_transfer}"
  }),
  list: gr({
    method: "GET",
    fullPath: "/v1/treasury/outbound_transfers",
    methodType: "list"
  }),
  cancel: gr({
    method: "POST",
    fullPath: "/v1/treasury/outbound_transfers/{outbound_transfer}/cancel"
  })
});

// node_modules/stripe/esm/resources/Issuing/PersonalizationDesigns.js
var Tr = n.method, ma = n.extend({
  create: Tr({
    method: "POST",
    fullPath: "/v1/issuing/personalization_designs"
  }),
  retrieve: Tr({
    method: "GET",
    fullPath: "/v1/issuing/personalization_designs/{personalization_design}"
  }),
  update: Tr({
    method: "POST",
    fullPath: "/v1/issuing/personalization_designs/{personalization_design}"
  }),
  list: Tr({
    method: "GET",
    fullPath: "/v1/issuing/personalization_designs",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Issuing/PersonalizationDesigns.js
var Ao = n.method, fa = n.extend({
  activate: Ao({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/activate"
  }),
  deactivate: Ao({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/deactivate"
  }),
  reject: Ao({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/reject"
  })
});

// node_modules/stripe/esm/resources/Issuing/PhysicalBundles.js
var ya = n.method, va = n.extend({
  retrieve: ya({
    method: "GET",
    fullPath: "/v1/issuing/physical_bundles/{physical_bundle}"
  }),
  list: ya({
    method: "GET",
    fullPath: "/v1/issuing/physical_bundles",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Climate/Products.js
var Pa = n.method, ga = n.extend({
  retrieve: Pa({
    method: "GET",
    fullPath: "/v1/climate/products/{product}"
  }),
  list: Pa({
    method: "GET",
    fullPath: "/v1/climate/products",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Terminal/Readers.js
var L = n.method, Ta = n.extend({
  create: L({ method: "POST", fullPath: "/v1/terminal/readers" }),
  retrieve: L({
    method: "GET",
    fullPath: "/v1/terminal/readers/{reader}"
  }),
  update: L({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}"
  }),
  list: L({
    method: "GET",
    fullPath: "/v1/terminal/readers",
    methodType: "list"
  }),
  del: L({
    method: "DELETE",
    fullPath: "/v1/terminal/readers/{reader}"
  }),
  cancelAction: L({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/cancel_action"
  }),
  collectInputs: L({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/collect_inputs"
  }),
  collectPaymentMethod: L({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/collect_payment_method"
  }),
  confirmPaymentIntent: L({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/confirm_payment_intent"
  }),
  processPaymentIntent: L({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/process_payment_intent"
  }),
  processSetupIntent: L({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/process_setup_intent"
  }),
  refundPayment: L({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/refund_payment"
  }),
  setReaderDisplay: L({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/set_reader_display"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Terminal/Readers.js
var Co = n.method, Sa = n.extend({
  presentPaymentMethod: Co({
    method: "POST",
    fullPath: "/v1/test_helpers/terminal/readers/{reader}/present_payment_method"
  }),
  succeedInputCollection: Co({
    method: "POST",
    fullPath: "/v1/test_helpers/terminal/readers/{reader}/succeed_input_collection"
  }),
  timeoutInputCollection: Co({
    method: "POST",
    fullPath: "/v1/test_helpers/terminal/readers/{reader}/timeout_input_collection"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Treasury/ReceivedCredits.js
var Md = n.method, _a = n.extend({
  create: Md({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/received_credits"
  })
});

// node_modules/stripe/esm/resources/Treasury/ReceivedCredits.js
var Ea = n.method, xa = n.extend({
  retrieve: Ea({
    method: "GET",
    fullPath: "/v1/treasury/received_credits/{id}"
  }),
  list: Ea({
    method: "GET",
    fullPath: "/v1/treasury/received_credits",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Treasury/ReceivedDebits.js
var Gd = n.method, ba = n.extend({
  create: Gd({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/received_debits"
  })
});

// node_modules/stripe/esm/resources/Treasury/ReceivedDebits.js
var Oa = n.method, wa = n.extend({
  retrieve: Oa({
    method: "GET",
    fullPath: "/v1/treasury/received_debits/{id}"
  }),
  list: Oa({
    method: "GET",
    fullPath: "/v1/treasury/received_debits",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Refunds.js
var Dd = n.method, Ra = n.extend({
  expire: Dd({
    method: "POST",
    fullPath: "/v1/test_helpers/refunds/{refund}/expire"
  })
});

// node_modules/stripe/esm/resources/Tax/Registrations.js
var Sr = n.method, Aa = n.extend({
  create: Sr({ method: "POST", fullPath: "/v1/tax/registrations" }),
  retrieve: Sr({
    method: "GET",
    fullPath: "/v1/tax/registrations/{id}"
  }),
  update: Sr({
    method: "POST",
    fullPath: "/v1/tax/registrations/{id}"
  }),
  list: Sr({
    method: "GET",
    fullPath: "/v1/tax/registrations",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Reporting/ReportRuns.js
var Io = n.method, Ca = n.extend({
  create: Io({ method: "POST", fullPath: "/v1/reporting/report_runs" }),
  retrieve: Io({
    method: "GET",
    fullPath: "/v1/reporting/report_runs/{report_run}"
  }),
  list: Io({
    method: "GET",
    fullPath: "/v1/reporting/report_runs",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Reporting/ReportTypes.js
var Ia = n.method, Ma = n.extend({
  retrieve: Ia({
    method: "GET",
    fullPath: "/v1/reporting/report_types/{report_type}"
  }),
  list: Ia({
    method: "GET",
    fullPath: "/v1/reporting/report_types",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Forwarding/Requests.js
var Mo = n.method, Ga = n.extend({
  create: Mo({ method: "POST", fullPath: "/v1/forwarding/requests" }),
  retrieve: Mo({
    method: "GET",
    fullPath: "/v1/forwarding/requests/{id}"
  }),
  list: Mo({
    method: "GET",
    fullPath: "/v1/forwarding/requests",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Sigma/ScheduledQueryRuns.js
var Da = n.method, ka = n.extend({
  retrieve: Da({
    method: "GET",
    fullPath: "/v1/sigma/scheduled_query_runs/{scheduled_query_run}"
  }),
  list: Da({
    method: "GET",
    fullPath: "/v1/sigma/scheduled_query_runs",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Apps/Secrets.js
var _r = n.method, qa = n.extend({
  create: _r({ method: "POST", fullPath: "/v1/apps/secrets" }),
  list: _r({
    method: "GET",
    fullPath: "/v1/apps/secrets",
    methodType: "list"
  }),
  deleteWhere: _r({
    method: "POST",
    fullPath: "/v1/apps/secrets/delete"
  }),
  find: _r({ method: "GET", fullPath: "/v1/apps/secrets/find" })
});

// node_modules/stripe/esm/resources/BillingPortal/Sessions.js
var kd = n.method, Na = n.extend({
  create: kd({
    method: "POST",
    fullPath: "/v1/billing_portal/sessions"
  })
});

// node_modules/stripe/esm/resources/Checkout/Sessions.js
var ke = n.method, Fa = n.extend({
  create: ke({ method: "POST", fullPath: "/v1/checkout/sessions" }),
  retrieve: ke({
    method: "GET",
    fullPath: "/v1/checkout/sessions/{session}"
  }),
  update: ke({
    method: "POST",
    fullPath: "/v1/checkout/sessions/{session}"
  }),
  list: ke({
    method: "GET",
    fullPath: "/v1/checkout/sessions",
    methodType: "list"
  }),
  expire: ke({
    method: "POST",
    fullPath: "/v1/checkout/sessions/{session}/expire"
  }),
  listLineItems: ke({
    method: "GET",
    fullPath: "/v1/checkout/sessions/{session}/line_items",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/FinancialConnections/Sessions.js
var La = n.method, Ua = n.extend({
  create: La({
    method: "POST",
    fullPath: "/v1/financial_connections/sessions"
  }),
  retrieve: La({
    method: "GET",
    fullPath: "/v1/financial_connections/sessions/{session}"
  })
});

// node_modules/stripe/esm/resources/Tax/Settings.js
var $a = n.method, Ha = n.extend({
  retrieve: $a({ method: "GET", fullPath: "/v1/tax/settings" }),
  update: $a({ method: "POST", fullPath: "/v1/tax/settings" })
});

// node_modules/stripe/esm/resources/Climate/Suppliers.js
var Ba = n.method, za = n.extend({
  retrieve: Ba({
    method: "GET",
    fullPath: "/v1/climate/suppliers/{supplier}"
  }),
  list: Ba({
    method: "GET",
    fullPath: "/v1/climate/suppliers",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/TestClocks.js
var yt = n.method, ja = n.extend({
  create: yt({
    method: "POST",
    fullPath: "/v1/test_helpers/test_clocks"
  }),
  retrieve: yt({
    method: "GET",
    fullPath: "/v1/test_helpers/test_clocks/{test_clock}"
  }),
  list: yt({
    method: "GET",
    fullPath: "/v1/test_helpers/test_clocks",
    methodType: "list"
  }),
  del: yt({
    method: "DELETE",
    fullPath: "/v1/test_helpers/test_clocks/{test_clock}"
  }),
  advance: yt({
    method: "POST",
    fullPath: "/v1/test_helpers/test_clocks/{test_clock}/advance"
  })
});

// node_modules/stripe/esm/resources/Issuing/Tokens.js
var Go = n.method, Wa = n.extend({
  retrieve: Go({
    method: "GET",
    fullPath: "/v1/issuing/tokens/{token}"
  }),
  update: Go({
    method: "POST",
    fullPath: "/v1/issuing/tokens/{token}"
  }),
  list: Go({
    method: "GET",
    fullPath: "/v1/issuing/tokens",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Treasury/TransactionEntries.js
var Ka = n.method, Va = n.extend({
  retrieve: Ka({
    method: "GET",
    fullPath: "/v1/treasury/transaction_entries/{id}"
  }),
  list: Ka({
    method: "GET",
    fullPath: "/v1/treasury/transaction_entries",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/FinancialConnections/Transactions.js
var Qa = n.method, Ja = n.extend({
  retrieve: Qa({
    method: "GET",
    fullPath: "/v1/financial_connections/transactions/{transaction}"
  }),
  list: Qa({
    method: "GET",
    fullPath: "/v1/financial_connections/transactions",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Issuing/Transactions.js
var Do = n.method, Ya = n.extend({
  retrieve: Do({
    method: "GET",
    fullPath: "/v1/issuing/transactions/{transaction}"
  }),
  update: Do({
    method: "POST",
    fullPath: "/v1/issuing/transactions/{transaction}"
  }),
  list: Do({
    method: "GET",
    fullPath: "/v1/issuing/transactions",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Tax/Transactions.js
var Er = n.method, Xa = n.extend({
  retrieve: Er({
    method: "GET",
    fullPath: "/v1/tax/transactions/{transaction}"
  }),
  createFromCalculation: Er({
    method: "POST",
    fullPath: "/v1/tax/transactions/create_from_calculation"
  }),
  createReversal: Er({
    method: "POST",
    fullPath: "/v1/tax/transactions/create_reversal"
  }),
  listLineItems: Er({
    method: "GET",
    fullPath: "/v1/tax/transactions/{transaction}/line_items",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Issuing/Transactions.js
var ko = n.method, Za = n.extend({
  createForceCapture: ko({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/transactions/create_force_capture"
  }),
  createUnlinkedRefund: ko({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/transactions/create_unlinked_refund"
  }),
  refund: ko({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/transactions/{transaction}/refund"
  })
});

// node_modules/stripe/esm/resources/Treasury/Transactions.js
var el = n.method, tl = n.extend({
  retrieve: el({
    method: "GET",
    fullPath: "/v1/treasury/transactions/{id}"
  }),
  list: el({
    method: "GET",
    fullPath: "/v1/treasury/transactions",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Radar/ValueListItems.js
var xr = n.method, rl = n.extend({
  create: xr({
    method: "POST",
    fullPath: "/v1/radar/value_list_items"
  }),
  retrieve: xr({
    method: "GET",
    fullPath: "/v1/radar/value_list_items/{item}"
  }),
  list: xr({
    method: "GET",
    fullPath: "/v1/radar/value_list_items",
    methodType: "list"
  }),
  del: xr({
    method: "DELETE",
    fullPath: "/v1/radar/value_list_items/{item}"
  })
});

// node_modules/stripe/esm/resources/Radar/ValueLists.js
var vt = n.method, ol = n.extend({
  create: vt({ method: "POST", fullPath: "/v1/radar/value_lists" }),
  retrieve: vt({
    method: "GET",
    fullPath: "/v1/radar/value_lists/{value_list}"
  }),
  update: vt({
    method: "POST",
    fullPath: "/v1/radar/value_lists/{value_list}"
  }),
  list: vt({
    method: "GET",
    fullPath: "/v1/radar/value_lists",
    methodType: "list"
  }),
  del: vt({
    method: "DELETE",
    fullPath: "/v1/radar/value_lists/{value_list}"
  })
});

// node_modules/stripe/esm/resources/Identity/VerificationReports.js
var nl = n.method, il = n.extend({
  retrieve: nl({
    method: "GET",
    fullPath: "/v1/identity/verification_reports/{report}"
  }),
  list: nl({
    method: "GET",
    fullPath: "/v1/identity/verification_reports",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Identity/VerificationSessions.js
var qe = n.method, sl = n.extend({
  create: qe({
    method: "POST",
    fullPath: "/v1/identity/verification_sessions"
  }),
  retrieve: qe({
    method: "GET",
    fullPath: "/v1/identity/verification_sessions/{session}"
  }),
  update: qe({
    method: "POST",
    fullPath: "/v1/identity/verification_sessions/{session}"
  }),
  list: qe({
    method: "GET",
    fullPath: "/v1/identity/verification_sessions",
    methodType: "list"
  }),
  cancel: qe({
    method: "POST",
    fullPath: "/v1/identity/verification_sessions/{session}/cancel"
  }),
  redact: qe({
    method: "POST",
    fullPath: "/v1/identity/verification_sessions/{session}/redact"
  })
});

// node_modules/stripe/esm/resources/Accounts.js
var A = n.method, qo = n.extend({
  create: A({ method: "POST", fullPath: "/v1/accounts" }),
  retrieve(t, ...e) {
    return typeof t == "string" ? A({
      method: "GET",
      fullPath: "/v1/accounts/{id}"
    }).apply(this, [t, ...e]) : (t == null && [].shift.apply([t, ...e]), A({
      method: "GET",
      fullPath: "/v1/account"
    }).apply(this, [t, ...e]));
  },
  update: A({ method: "POST", fullPath: "/v1/accounts/{account}" }),
  list: A({
    method: "GET",
    fullPath: "/v1/accounts",
    methodType: "list"
  }),
  del: A({ method: "DELETE", fullPath: "/v1/accounts/{account}" }),
  createExternalAccount: A({
    method: "POST",
    fullPath: "/v1/accounts/{account}/external_accounts"
  }),
  createLoginLink: A({
    method: "POST",
    fullPath: "/v1/accounts/{account}/login_links"
  }),
  createPerson: A({
    method: "POST",
    fullPath: "/v1/accounts/{account}/persons"
  }),
  deleteExternalAccount: A({
    method: "DELETE",
    fullPath: "/v1/accounts/{account}/external_accounts/{id}"
  }),
  deletePerson: A({
    method: "DELETE",
    fullPath: "/v1/accounts/{account}/persons/{person}"
  }),
  listCapabilities: A({
    method: "GET",
    fullPath: "/v1/accounts/{account}/capabilities",
    methodType: "list"
  }),
  listExternalAccounts: A({
    method: "GET",
    fullPath: "/v1/accounts/{account}/external_accounts",
    methodType: "list"
  }),
  listPersons: A({
    method: "GET",
    fullPath: "/v1/accounts/{account}/persons",
    methodType: "list"
  }),
  reject: A({
    method: "POST",
    fullPath: "/v1/accounts/{account}/reject"
  }),
  retrieveCurrent: A({ method: "GET", fullPath: "/v1/account" }),
  retrieveCapability: A({
    method: "GET",
    fullPath: "/v1/accounts/{account}/capabilities/{capability}"
  }),
  retrieveExternalAccount: A({
    method: "GET",
    fullPath: "/v1/accounts/{account}/external_accounts/{id}"
  }),
  retrievePerson: A({
    method: "GET",
    fullPath: "/v1/accounts/{account}/persons/{person}"
  }),
  updateCapability: A({
    method: "POST",
    fullPath: "/v1/accounts/{account}/capabilities/{capability}"
  }),
  updateExternalAccount: A({
    method: "POST",
    fullPath: "/v1/accounts/{account}/external_accounts/{id}"
  }),
  updatePerson: A({
    method: "POST",
    fullPath: "/v1/accounts/{account}/persons/{person}"
  })
});

// node_modules/stripe/esm/resources/AccountLinks.js
var qd = n.method, al = n.extend({
  create: qd({ method: "POST", fullPath: "/v1/account_links" })
});

// node_modules/stripe/esm/resources/AccountSessions.js
var Nd = n.method, ll = n.extend({
  create: Nd({ method: "POST", fullPath: "/v1/account_sessions" })
});

// node_modules/stripe/esm/resources/ApplePayDomains.js
var br = n.method, ul = n.extend({
  create: br({ method: "POST", fullPath: "/v1/apple_pay/domains" }),
  retrieve: br({
    method: "GET",
    fullPath: "/v1/apple_pay/domains/{domain}"
  }),
  list: br({
    method: "GET",
    fullPath: "/v1/apple_pay/domains",
    methodType: "list"
  }),
  del: br({
    method: "DELETE",
    fullPath: "/v1/apple_pay/domains/{domain}"
  })
});

// node_modules/stripe/esm/resources/ApplicationFees.js
var Ne = n.method, cl = n.extend({
  retrieve: Ne({
    method: "GET",
    fullPath: "/v1/application_fees/{id}"
  }),
  list: Ne({
    method: "GET",
    fullPath: "/v1/application_fees",
    methodType: "list"
  }),
  createRefund: Ne({
    method: "POST",
    fullPath: "/v1/application_fees/{id}/refunds"
  }),
  listRefunds: Ne({
    method: "GET",
    fullPath: "/v1/application_fees/{id}/refunds",
    methodType: "list"
  }),
  retrieveRefund: Ne({
    method: "GET",
    fullPath: "/v1/application_fees/{fee}/refunds/{id}"
  }),
  updateRefund: Ne({
    method: "POST",
    fullPath: "/v1/application_fees/{fee}/refunds/{id}"
  })
});

// node_modules/stripe/esm/resources/Balance.js
var Fd = n.method, pl = n.extend({
  retrieve: Fd({ method: "GET", fullPath: "/v1/balance" })
});

// node_modules/stripe/esm/resources/BalanceSettings.js
var dl = n.method, hl = n.extend({
  retrieve: dl({ method: "GET", fullPath: "/v1/balance_settings" }),
  update: dl({ method: "POST", fullPath: "/v1/balance_settings" })
});

// node_modules/stripe/esm/resources/BalanceTransactions.js
var ml = n.method, fl = n.extend({
  retrieve: ml({
    method: "GET",
    fullPath: "/v1/balance_transactions/{id}"
  }),
  list: ml({
    method: "GET",
    fullPath: "/v1/balance_transactions",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Charges.js
var Fe = n.method, yl = n.extend({
  create: Fe({ method: "POST", fullPath: "/v1/charges" }),
  retrieve: Fe({ method: "GET", fullPath: "/v1/charges/{charge}" }),
  update: Fe({ method: "POST", fullPath: "/v1/charges/{charge}" }),
  list: Fe({
    method: "GET",
    fullPath: "/v1/charges",
    methodType: "list"
  }),
  capture: Fe({
    method: "POST",
    fullPath: "/v1/charges/{charge}/capture"
  }),
  search: Fe({
    method: "GET",
    fullPath: "/v1/charges/search",
    methodType: "search"
  })
});

// node_modules/stripe/esm/resources/ConfirmationTokens.js
var Ld = n.method, vl = n.extend({
  retrieve: Ld({
    method: "GET",
    fullPath: "/v1/confirmation_tokens/{confirmation_token}"
  })
});

// node_modules/stripe/esm/resources/CountrySpecs.js
var Pl = n.method, gl = n.extend({
  retrieve: Pl({
    method: "GET",
    fullPath: "/v1/country_specs/{country}"
  }),
  list: Pl({
    method: "GET",
    fullPath: "/v1/country_specs",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Coupons.js
var Pt = n.method, Tl = n.extend({
  create: Pt({ method: "POST", fullPath: "/v1/coupons" }),
  retrieve: Pt({ method: "GET", fullPath: "/v1/coupons/{coupon}" }),
  update: Pt({ method: "POST", fullPath: "/v1/coupons/{coupon}" }),
  list: Pt({
    method: "GET",
    fullPath: "/v1/coupons",
    methodType: "list"
  }),
  del: Pt({ method: "DELETE", fullPath: "/v1/coupons/{coupon}" })
});

// node_modules/stripe/esm/resources/CreditNotes.js
var ne = n.method, Sl = n.extend({
  create: ne({ method: "POST", fullPath: "/v1/credit_notes" }),
  retrieve: ne({ method: "GET", fullPath: "/v1/credit_notes/{id}" }),
  update: ne({ method: "POST", fullPath: "/v1/credit_notes/{id}" }),
  list: ne({
    method: "GET",
    fullPath: "/v1/credit_notes",
    methodType: "list"
  }),
  listLineItems: ne({
    method: "GET",
    fullPath: "/v1/credit_notes/{credit_note}/lines",
    methodType: "list"
  }),
  listPreviewLineItems: ne({
    method: "GET",
    fullPath: "/v1/credit_notes/preview/lines",
    methodType: "list"
  }),
  preview: ne({ method: "GET", fullPath: "/v1/credit_notes/preview" }),
  voidCreditNote: ne({
    method: "POST",
    fullPath: "/v1/credit_notes/{id}/void"
  })
});

// node_modules/stripe/esm/resources/CustomerSessions.js
var Ud = n.method, _l = n.extend({
  create: Ud({ method: "POST", fullPath: "/v1/customer_sessions" })
});

// node_modules/stripe/esm/resources/Customers.js
var b = n.method, El = n.extend({
  create: b({ method: "POST", fullPath: "/v1/customers" }),
  retrieve: b({ method: "GET", fullPath: "/v1/customers/{customer}" }),
  update: b({ method: "POST", fullPath: "/v1/customers/{customer}" }),
  list: b({
    method: "GET",
    fullPath: "/v1/customers",
    methodType: "list"
  }),
  del: b({ method: "DELETE", fullPath: "/v1/customers/{customer}" }),
  createBalanceTransaction: b({
    method: "POST",
    fullPath: "/v1/customers/{customer}/balance_transactions"
  }),
  createFundingInstructions: b({
    method: "POST",
    fullPath: "/v1/customers/{customer}/funding_instructions"
  }),
  createSource: b({
    method: "POST",
    fullPath: "/v1/customers/{customer}/sources"
  }),
  createTaxId: b({
    method: "POST",
    fullPath: "/v1/customers/{customer}/tax_ids"
  }),
  deleteDiscount: b({
    method: "DELETE",
    fullPath: "/v1/customers/{customer}/discount"
  }),
  deleteSource: b({
    method: "DELETE",
    fullPath: "/v1/customers/{customer}/sources/{id}"
  }),
  deleteTaxId: b({
    method: "DELETE",
    fullPath: "/v1/customers/{customer}/tax_ids/{id}"
  }),
  listBalanceTransactions: b({
    method: "GET",
    fullPath: "/v1/customers/{customer}/balance_transactions",
    methodType: "list"
  }),
  listCashBalanceTransactions: b({
    method: "GET",
    fullPath: "/v1/customers/{customer}/cash_balance_transactions",
    methodType: "list"
  }),
  listPaymentMethods: b({
    method: "GET",
    fullPath: "/v1/customers/{customer}/payment_methods",
    methodType: "list"
  }),
  listSources: b({
    method: "GET",
    fullPath: "/v1/customers/{customer}/sources",
    methodType: "list"
  }),
  listTaxIds: b({
    method: "GET",
    fullPath: "/v1/customers/{customer}/tax_ids",
    methodType: "list"
  }),
  retrieveBalanceTransaction: b({
    method: "GET",
    fullPath: "/v1/customers/{customer}/balance_transactions/{transaction}"
  }),
  retrieveCashBalance: b({
    method: "GET",
    fullPath: "/v1/customers/{customer}/cash_balance"
  }),
  retrieveCashBalanceTransaction: b({
    method: "GET",
    fullPath: "/v1/customers/{customer}/cash_balance_transactions/{transaction}"
  }),
  retrievePaymentMethod: b({
    method: "GET",
    fullPath: "/v1/customers/{customer}/payment_methods/{payment_method}"
  }),
  retrieveSource: b({
    method: "GET",
    fullPath: "/v1/customers/{customer}/sources/{id}"
  }),
  retrieveTaxId: b({
    method: "GET",
    fullPath: "/v1/customers/{customer}/tax_ids/{id}"
  }),
  search: b({
    method: "GET",
    fullPath: "/v1/customers/search",
    methodType: "search"
  }),
  updateBalanceTransaction: b({
    method: "POST",
    fullPath: "/v1/customers/{customer}/balance_transactions/{transaction}"
  }),
  updateCashBalance: b({
    method: "POST",
    fullPath: "/v1/customers/{customer}/cash_balance"
  }),
  updateSource: b({
    method: "POST",
    fullPath: "/v1/customers/{customer}/sources/{id}"
  }),
  verifySource: b({
    method: "POST",
    fullPath: "/v1/customers/{customer}/sources/{id}/verify"
  })
});

// node_modules/stripe/esm/resources/Disputes.js
var Or = n.method, xl = n.extend({
  retrieve: Or({ method: "GET", fullPath: "/v1/disputes/{dispute}" }),
  update: Or({ method: "POST", fullPath: "/v1/disputes/{dispute}" }),
  list: Or({
    method: "GET",
    fullPath: "/v1/disputes",
    methodType: "list"
  }),
  close: Or({
    method: "POST",
    fullPath: "/v1/disputes/{dispute}/close"
  })
});

// node_modules/stripe/esm/resources/EphemeralKeys.js
var bl = n.method, Ol = n.extend({
  create: bl({
    method: "POST",
    fullPath: "/v1/ephemeral_keys",
    validator: /* @__PURE__ */ s((t, e) => {
      if (!e.headers || !e.headers["Stripe-Version"])
        throw new Error("Passing apiVersion in a separate options hash is required to create an ephemeral key. See https://stripe.com/docs/api/versioning?lang=node");
    }, "validator")
  }),
  del: bl({ method: "DELETE", fullPath: "/v1/ephemeral_keys/{key}" })
});

// node_modules/stripe/esm/resources/Events.js
var wl = n.method, Rl = n.extend({
  retrieve: wl({ method: "GET", fullPath: "/v1/events/{id}" }),
  list: wl({
    method: "GET",
    fullPath: "/v1/events",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/ExchangeRates.js
var Al = n.method, Cl = n.extend({
  retrieve: Al({
    method: "GET",
    fullPath: "/v1/exchange_rates/{rate_id}"
  }),
  list: Al({
    method: "GET",
    fullPath: "/v1/exchange_rates",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/FileLinks.js
var wr = n.method, Il = n.extend({
  create: wr({ method: "POST", fullPath: "/v1/file_links" }),
  retrieve: wr({ method: "GET", fullPath: "/v1/file_links/{link}" }),
  update: wr({ method: "POST", fullPath: "/v1/file_links/{link}" }),
  list: wr({
    method: "GET",
    fullPath: "/v1/file_links",
    methodType: "list"
  })
});

// node_modules/stripe/esm/multipart.js
var $d = /* @__PURE__ */ s((t, e, r) => {
  let o = (Math.round(Math.random() * 1e16) + Math.round(Math.random() * 1e16)).toString();
  r["Content-Type"] = `multipart/form-data; boundary=${o}`;
  let i = new TextEncoder(), a = new Uint8Array(0), l = i.encode(`\r
`);
  function p(u) {
    let d = a, c = u instanceof Uint8Array ? u : new Uint8Array(i.encode(u));
    a = new Uint8Array(d.length + c.length + 2), a.set(d), a.set(c, d.length), a.set(l, a.length - 2);
  }
  s(p, "push");
  function h(u) {
    return `"${u.replace(/"|"/g, "%22").replace(/\r\n|\r|\n/g, " ")}"`;
  }
  s(h, "q");
  let m = as(e);
  for (let u in m) {
    if (!Object.prototype.hasOwnProperty.call(m, u))
      continue;
    let d = m[u];
    if (p(`--${o}`), Object.prototype.hasOwnProperty.call(d, "data")) {
      let c = d;
      p(`Content-Disposition: form-data; name=${h(u)}; filename=${h(c.name || "blob")}`), p(`Content-Type: ${c.type || "application/octet-stream"}`), p(""), p(c.data);
    } else
      p(`Content-Disposition: form-data; name=${h(u)}`), p(""), p(d);
  }
  return p(`--${o}--`), a;
}, "multipartDataGenerator");
function Ml(t, e, r, o) {
  if (e = e || {}, t !== "POST")
    return o(null, re(e));
  this._stripe._platformFunctions.tryBufferData(e).then((i) => {
    let a = $d(t, i, r);
    return o(null, a);
  }).catch((i) => o(i, null));
}
s(Ml, "multipartRequestDataProcessor");

// node_modules/stripe/esm/resources/Files.js
var No = n.method, Gl = n.extend({
  create: No({
    method: "POST",
    fullPath: "/v1/files",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    host: "files.stripe.com"
  }),
  retrieve: No({ method: "GET", fullPath: "/v1/files/{file}" }),
  list: No({
    method: "GET",
    fullPath: "/v1/files",
    methodType: "list"
  }),
  requestDataProcessor: Ml
});

// node_modules/stripe/esm/resources/InvoiceItems.js
var gt = n.method, Dl = n.extend({
  create: gt({ method: "POST", fullPath: "/v1/invoiceitems" }),
  retrieve: gt({
    method: "GET",
    fullPath: "/v1/invoiceitems/{invoiceitem}"
  }),
  update: gt({
    method: "POST",
    fullPath: "/v1/invoiceitems/{invoiceitem}"
  }),
  list: gt({
    method: "GET",
    fullPath: "/v1/invoiceitems",
    methodType: "list"
  }),
  del: gt({
    method: "DELETE",
    fullPath: "/v1/invoiceitems/{invoiceitem}"
  })
});

// node_modules/stripe/esm/resources/InvoicePayments.js
var kl = n.method, ql = n.extend({
  retrieve: kl({
    method: "GET",
    fullPath: "/v1/invoice_payments/{invoice_payment}"
  }),
  list: kl({
    method: "GET",
    fullPath: "/v1/invoice_payments",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/InvoiceRenderingTemplates.js
var Rr = n.method, Nl = n.extend({
  retrieve: Rr({
    method: "GET",
    fullPath: "/v1/invoice_rendering_templates/{template}"
  }),
  list: Rr({
    method: "GET",
    fullPath: "/v1/invoice_rendering_templates",
    methodType: "list"
  }),
  archive: Rr({
    method: "POST",
    fullPath: "/v1/invoice_rendering_templates/{template}/archive"
  }),
  unarchive: Rr({
    method: "POST",
    fullPath: "/v1/invoice_rendering_templates/{template}/unarchive"
  })
});

// node_modules/stripe/esm/resources/Invoices.js
var k = n.method, Fl = n.extend({
  create: k({ method: "POST", fullPath: "/v1/invoices" }),
  retrieve: k({ method: "GET", fullPath: "/v1/invoices/{invoice}" }),
  update: k({ method: "POST", fullPath: "/v1/invoices/{invoice}" }),
  list: k({
    method: "GET",
    fullPath: "/v1/invoices",
    methodType: "list"
  }),
  del: k({ method: "DELETE", fullPath: "/v1/invoices/{invoice}" }),
  addLines: k({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/add_lines"
  }),
  attachPayment: k({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/attach_payment"
  }),
  createPreview: k({
    method: "POST",
    fullPath: "/v1/invoices/create_preview"
  }),
  finalizeInvoice: k({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/finalize"
  }),
  listLineItems: k({
    method: "GET",
    fullPath: "/v1/invoices/{invoice}/lines",
    methodType: "list"
  }),
  markUncollectible: k({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/mark_uncollectible"
  }),
  pay: k({ method: "POST", fullPath: "/v1/invoices/{invoice}/pay" }),
  removeLines: k({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/remove_lines"
  }),
  search: k({
    method: "GET",
    fullPath: "/v1/invoices/search",
    methodType: "search"
  }),
  sendInvoice: k({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/send"
  }),
  updateLines: k({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/update_lines"
  }),
  updateLineItem: k({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/lines/{line_item_id}"
  }),
  voidInvoice: k({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/void"
  })
});

// node_modules/stripe/esm/resources/Mandates.js
var Hd = n.method, Ll = n.extend({
  retrieve: Hd({ method: "GET", fullPath: "/v1/mandates/{mandate}" })
});

// node_modules/stripe/esm/resources/OAuth.js
var Ul = n.method, Fo = "connect.stripe.com", $l = n.extend({
  basePath: "/",
  authorizeUrl(t, e) {
    t = t || {}, e = e || {};
    let r = "oauth/authorize";
    return e.express && (r = `express/${r}`), t.response_type || (t.response_type = "code"), t.client_id || (t.client_id = this._stripe.getClientId()), t.scope || (t.scope = "read_write"), `https://${Fo}/${r}?${re(t)}`;
  },
  token: Ul({
    method: "POST",
    path: "oauth/token",
    host: Fo
  }),
  deauthorize(t, ...e) {
    return t.client_id || (t.client_id = this._stripe.getClientId()), Ul({
      method: "POST",
      path: "oauth/deauthorize",
      host: Fo
    }).apply(this, [t, ...e]);
  }
});

// node_modules/stripe/esm/resources/PaymentAttemptRecords.js
var Hl = n.method, Bl = n.extend({
  retrieve: Hl({
    method: "GET",
    fullPath: "/v1/payment_attempt_records/{id}"
  }),
  list: Hl({
    method: "GET",
    fullPath: "/v1/payment_attempt_records",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/PaymentIntents.js
var U = n.method, zl = n.extend({
  create: U({ method: "POST", fullPath: "/v1/payment_intents" }),
  retrieve: U({
    method: "GET",
    fullPath: "/v1/payment_intents/{intent}"
  }),
  update: U({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}"
  }),
  list: U({
    method: "GET",
    fullPath: "/v1/payment_intents",
    methodType: "list"
  }),
  applyCustomerBalance: U({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/apply_customer_balance"
  }),
  cancel: U({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/cancel"
  }),
  capture: U({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/capture"
  }),
  confirm: U({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/confirm"
  }),
  incrementAuthorization: U({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/increment_authorization"
  }),
  listAmountDetailsLineItems: U({
    method: "GET",
    fullPath: "/v1/payment_intents/{intent}/amount_details_line_items",
    methodType: "list"
  }),
  search: U({
    method: "GET",
    fullPath: "/v1/payment_intents/search",
    methodType: "search"
  }),
  verifyMicrodeposits: U({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/verify_microdeposits"
  })
});

// node_modules/stripe/esm/resources/PaymentLinks.js
var Tt = n.method, jl = n.extend({
  create: Tt({ method: "POST", fullPath: "/v1/payment_links" }),
  retrieve: Tt({
    method: "GET",
    fullPath: "/v1/payment_links/{payment_link}"
  }),
  update: Tt({
    method: "POST",
    fullPath: "/v1/payment_links/{payment_link}"
  }),
  list: Tt({
    method: "GET",
    fullPath: "/v1/payment_links",
    methodType: "list"
  }),
  listLineItems: Tt({
    method: "GET",
    fullPath: "/v1/payment_links/{payment_link}/line_items",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/PaymentMethodConfigurations.js
var Ar = n.method, Wl = n.extend({
  create: Ar({
    method: "POST",
    fullPath: "/v1/payment_method_configurations"
  }),
  retrieve: Ar({
    method: "GET",
    fullPath: "/v1/payment_method_configurations/{configuration}"
  }),
  update: Ar({
    method: "POST",
    fullPath: "/v1/payment_method_configurations/{configuration}"
  }),
  list: Ar({
    method: "GET",
    fullPath: "/v1/payment_method_configurations",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/PaymentMethodDomains.js
var St = n.method, Kl = n.extend({
  create: St({
    method: "POST",
    fullPath: "/v1/payment_method_domains"
  }),
  retrieve: St({
    method: "GET",
    fullPath: "/v1/payment_method_domains/{payment_method_domain}"
  }),
  update: St({
    method: "POST",
    fullPath: "/v1/payment_method_domains/{payment_method_domain}"
  }),
  list: St({
    method: "GET",
    fullPath: "/v1/payment_method_domains",
    methodType: "list"
  }),
  validate: St({
    method: "POST",
    fullPath: "/v1/payment_method_domains/{payment_method_domain}/validate"
  })
});

// node_modules/stripe/esm/resources/PaymentMethods.js
var Le = n.method, Vl = n.extend({
  create: Le({ method: "POST", fullPath: "/v1/payment_methods" }),
  retrieve: Le({
    method: "GET",
    fullPath: "/v1/payment_methods/{payment_method}"
  }),
  update: Le({
    method: "POST",
    fullPath: "/v1/payment_methods/{payment_method}"
  }),
  list: Le({
    method: "GET",
    fullPath: "/v1/payment_methods",
    methodType: "list"
  }),
  attach: Le({
    method: "POST",
    fullPath: "/v1/payment_methods/{payment_method}/attach"
  }),
  detach: Le({
    method: "POST",
    fullPath: "/v1/payment_methods/{payment_method}/detach"
  })
});

// node_modules/stripe/esm/resources/PaymentRecords.js
var ie = n.method, Ql = n.extend({
  retrieve: ie({ method: "GET", fullPath: "/v1/payment_records/{id}" }),
  reportPayment: ie({
    method: "POST",
    fullPath: "/v1/payment_records/report_payment"
  }),
  reportPaymentAttempt: ie({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_payment_attempt"
  }),
  reportPaymentAttemptCanceled: ie({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_payment_attempt_canceled"
  }),
  reportPaymentAttemptFailed: ie({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_payment_attempt_failed"
  }),
  reportPaymentAttemptGuaranteed: ie({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_payment_attempt_guaranteed"
  }),
  reportPaymentAttemptInformational: ie({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_payment_attempt_informational"
  }),
  reportRefund: ie({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_refund"
  })
});

// node_modules/stripe/esm/resources/Payouts.js
var Ue = n.method, Jl = n.extend({
  create: Ue({ method: "POST", fullPath: "/v1/payouts" }),
  retrieve: Ue({ method: "GET", fullPath: "/v1/payouts/{payout}" }),
  update: Ue({ method: "POST", fullPath: "/v1/payouts/{payout}" }),
  list: Ue({
    method: "GET",
    fullPath: "/v1/payouts",
    methodType: "list"
  }),
  cancel: Ue({
    method: "POST",
    fullPath: "/v1/payouts/{payout}/cancel"
  }),
  reverse: Ue({
    method: "POST",
    fullPath: "/v1/payouts/{payout}/reverse"
  })
});

// node_modules/stripe/esm/resources/Plans.js
var _t = n.method, Yl = n.extend({
  create: _t({ method: "POST", fullPath: "/v1/plans" }),
  retrieve: _t({ method: "GET", fullPath: "/v1/plans/{plan}" }),
  update: _t({ method: "POST", fullPath: "/v1/plans/{plan}" }),
  list: _t({
    method: "GET",
    fullPath: "/v1/plans",
    methodType: "list"
  }),
  del: _t({ method: "DELETE", fullPath: "/v1/plans/{plan}" })
});

// node_modules/stripe/esm/resources/Prices.js
var Et = n.method, Xl = n.extend({
  create: Et({ method: "POST", fullPath: "/v1/prices" }),
  retrieve: Et({ method: "GET", fullPath: "/v1/prices/{price}" }),
  update: Et({ method: "POST", fullPath: "/v1/prices/{price}" }),
  list: Et({
    method: "GET",
    fullPath: "/v1/prices",
    methodType: "list"
  }),
  search: Et({
    method: "GET",
    fullPath: "/v1/prices/search",
    methodType: "search"
  })
});

// node_modules/stripe/esm/resources/Products.js
var K = n.method, Zl = n.extend({
  create: K({ method: "POST", fullPath: "/v1/products" }),
  retrieve: K({ method: "GET", fullPath: "/v1/products/{id}" }),
  update: K({ method: "POST", fullPath: "/v1/products/{id}" }),
  list: K({
    method: "GET",
    fullPath: "/v1/products",
    methodType: "list"
  }),
  del: K({ method: "DELETE", fullPath: "/v1/products/{id}" }),
  createFeature: K({
    method: "POST",
    fullPath: "/v1/products/{product}/features"
  }),
  deleteFeature: K({
    method: "DELETE",
    fullPath: "/v1/products/{product}/features/{id}"
  }),
  listFeatures: K({
    method: "GET",
    fullPath: "/v1/products/{product}/features",
    methodType: "list"
  }),
  retrieveFeature: K({
    method: "GET",
    fullPath: "/v1/products/{product}/features/{id}"
  }),
  search: K({
    method: "GET",
    fullPath: "/v1/products/search",
    methodType: "search"
  })
});

// node_modules/stripe/esm/resources/PromotionCodes.js
var Cr = n.method, eu = n.extend({
  create: Cr({ method: "POST", fullPath: "/v1/promotion_codes" }),
  retrieve: Cr({
    method: "GET",
    fullPath: "/v1/promotion_codes/{promotion_code}"
  }),
  update: Cr({
    method: "POST",
    fullPath: "/v1/promotion_codes/{promotion_code}"
  }),
  list: Cr({
    method: "GET",
    fullPath: "/v1/promotion_codes",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Quotes.js
var V = n.method, tu = n.extend({
  create: V({ method: "POST", fullPath: "/v1/quotes" }),
  retrieve: V({ method: "GET", fullPath: "/v1/quotes/{quote}" }),
  update: V({ method: "POST", fullPath: "/v1/quotes/{quote}" }),
  list: V({
    method: "GET",
    fullPath: "/v1/quotes",
    methodType: "list"
  }),
  accept: V({ method: "POST", fullPath: "/v1/quotes/{quote}/accept" }),
  cancel: V({ method: "POST", fullPath: "/v1/quotes/{quote}/cancel" }),
  finalizeQuote: V({
    method: "POST",
    fullPath: "/v1/quotes/{quote}/finalize"
  }),
  listComputedUpfrontLineItems: V({
    method: "GET",
    fullPath: "/v1/quotes/{quote}/computed_upfront_line_items",
    methodType: "list"
  }),
  listLineItems: V({
    method: "GET",
    fullPath: "/v1/quotes/{quote}/line_items",
    methodType: "list"
  }),
  pdf: V({
    method: "GET",
    fullPath: "/v1/quotes/{quote}/pdf",
    host: "files.stripe.com",
    streaming: !0
  })
});

// node_modules/stripe/esm/resources/Refunds.js
var xt = n.method, ru = n.extend({
  create: xt({ method: "POST", fullPath: "/v1/refunds" }),
  retrieve: xt({ method: "GET", fullPath: "/v1/refunds/{refund}" }),
  update: xt({ method: "POST", fullPath: "/v1/refunds/{refund}" }),
  list: xt({
    method: "GET",
    fullPath: "/v1/refunds",
    methodType: "list"
  }),
  cancel: xt({
    method: "POST",
    fullPath: "/v1/refunds/{refund}/cancel"
  })
});

// node_modules/stripe/esm/resources/Reviews.js
var Lo = n.method, ou = n.extend({
  retrieve: Lo({ method: "GET", fullPath: "/v1/reviews/{review}" }),
  list: Lo({
    method: "GET",
    fullPath: "/v1/reviews",
    methodType: "list"
  }),
  approve: Lo({
    method: "POST",
    fullPath: "/v1/reviews/{review}/approve"
  })
});

// node_modules/stripe/esm/resources/SetupAttempts.js
var Bd = n.method, nu = n.extend({
  list: Bd({
    method: "GET",
    fullPath: "/v1/setup_attempts",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/SetupIntents.js
var fe = n.method, iu = n.extend({
  create: fe({ method: "POST", fullPath: "/v1/setup_intents" }),
  retrieve: fe({
    method: "GET",
    fullPath: "/v1/setup_intents/{intent}"
  }),
  update: fe({
    method: "POST",
    fullPath: "/v1/setup_intents/{intent}"
  }),
  list: fe({
    method: "GET",
    fullPath: "/v1/setup_intents",
    methodType: "list"
  }),
  cancel: fe({
    method: "POST",
    fullPath: "/v1/setup_intents/{intent}/cancel"
  }),
  confirm: fe({
    method: "POST",
    fullPath: "/v1/setup_intents/{intent}/confirm"
  }),
  verifyMicrodeposits: fe({
    method: "POST",
    fullPath: "/v1/setup_intents/{intent}/verify_microdeposits"
  })
});

// node_modules/stripe/esm/resources/ShippingRates.js
var Ir = n.method, su = n.extend({
  create: Ir({ method: "POST", fullPath: "/v1/shipping_rates" }),
  retrieve: Ir({
    method: "GET",
    fullPath: "/v1/shipping_rates/{shipping_rate_token}"
  }),
  update: Ir({
    method: "POST",
    fullPath: "/v1/shipping_rates/{shipping_rate_token}"
  }),
  list: Ir({
    method: "GET",
    fullPath: "/v1/shipping_rates",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Sources.js
var bt = n.method, au = n.extend({
  create: bt({ method: "POST", fullPath: "/v1/sources" }),
  retrieve: bt({ method: "GET", fullPath: "/v1/sources/{source}" }),
  update: bt({ method: "POST", fullPath: "/v1/sources/{source}" }),
  listSourceTransactions: bt({
    method: "GET",
    fullPath: "/v1/sources/{source}/source_transactions",
    methodType: "list"
  }),
  verify: bt({
    method: "POST",
    fullPath: "/v1/sources/{source}/verify"
  })
});

// node_modules/stripe/esm/resources/SubscriptionItems.js
var Ot = n.method, lu = n.extend({
  create: Ot({ method: "POST", fullPath: "/v1/subscription_items" }),
  retrieve: Ot({
    method: "GET",
    fullPath: "/v1/subscription_items/{item}"
  }),
  update: Ot({
    method: "POST",
    fullPath: "/v1/subscription_items/{item}"
  }),
  list: Ot({
    method: "GET",
    fullPath: "/v1/subscription_items",
    methodType: "list"
  }),
  del: Ot({
    method: "DELETE",
    fullPath: "/v1/subscription_items/{item}"
  })
});

// node_modules/stripe/esm/resources/SubscriptionSchedules.js
var $e = n.method, uu = n.extend({
  create: $e({
    method: "POST",
    fullPath: "/v1/subscription_schedules"
  }),
  retrieve: $e({
    method: "GET",
    fullPath: "/v1/subscription_schedules/{schedule}"
  }),
  update: $e({
    method: "POST",
    fullPath: "/v1/subscription_schedules/{schedule}"
  }),
  list: $e({
    method: "GET",
    fullPath: "/v1/subscription_schedules",
    methodType: "list"
  }),
  cancel: $e({
    method: "POST",
    fullPath: "/v1/subscription_schedules/{schedule}/cancel"
  }),
  release: $e({
    method: "POST",
    fullPath: "/v1/subscription_schedules/{schedule}/release"
  })
});

// node_modules/stripe/esm/resources/Subscriptions.js
var Y = n.method, cu = n.extend({
  create: Y({ method: "POST", fullPath: "/v1/subscriptions" }),
  retrieve: Y({
    method: "GET",
    fullPath: "/v1/subscriptions/{subscription_exposed_id}"
  }),
  update: Y({
    method: "POST",
    fullPath: "/v1/subscriptions/{subscription_exposed_id}"
  }),
  list: Y({
    method: "GET",
    fullPath: "/v1/subscriptions",
    methodType: "list"
  }),
  cancel: Y({
    method: "DELETE",
    fullPath: "/v1/subscriptions/{subscription_exposed_id}"
  }),
  deleteDiscount: Y({
    method: "DELETE",
    fullPath: "/v1/subscriptions/{subscription_exposed_id}/discount"
  }),
  migrate: Y({
    method: "POST",
    fullPath: "/v1/subscriptions/{subscription}/migrate"
  }),
  resume: Y({
    method: "POST",
    fullPath: "/v1/subscriptions/{subscription}/resume"
  }),
  search: Y({
    method: "GET",
    fullPath: "/v1/subscriptions/search",
    methodType: "search"
  })
});

// node_modules/stripe/esm/resources/TaxCodes.js
var pu = n.method, du = n.extend({
  retrieve: pu({ method: "GET", fullPath: "/v1/tax_codes/{id}" }),
  list: pu({
    method: "GET",
    fullPath: "/v1/tax_codes",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/TaxIds.js
var Mr = n.method, hu = n.extend({
  create: Mr({ method: "POST", fullPath: "/v1/tax_ids" }),
  retrieve: Mr({ method: "GET", fullPath: "/v1/tax_ids/{id}" }),
  list: Mr({
    method: "GET",
    fullPath: "/v1/tax_ids",
    methodType: "list"
  }),
  del: Mr({ method: "DELETE", fullPath: "/v1/tax_ids/{id}" })
});

// node_modules/stripe/esm/resources/TaxRates.js
var Gr = n.method, mu = n.extend({
  create: Gr({ method: "POST", fullPath: "/v1/tax_rates" }),
  retrieve: Gr({ method: "GET", fullPath: "/v1/tax_rates/{tax_rate}" }),
  update: Gr({ method: "POST", fullPath: "/v1/tax_rates/{tax_rate}" }),
  list: Gr({
    method: "GET",
    fullPath: "/v1/tax_rates",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Tokens.js
var fu = n.method, yu = n.extend({
  create: fu({ method: "POST", fullPath: "/v1/tokens" }),
  retrieve: fu({ method: "GET", fullPath: "/v1/tokens/{token}" })
});

// node_modules/stripe/esm/resources/Topups.js
var wt = n.method, vu = n.extend({
  create: wt({ method: "POST", fullPath: "/v1/topups" }),
  retrieve: wt({ method: "GET", fullPath: "/v1/topups/{topup}" }),
  update: wt({ method: "POST", fullPath: "/v1/topups/{topup}" }),
  list: wt({
    method: "GET",
    fullPath: "/v1/topups",
    methodType: "list"
  }),
  cancel: wt({ method: "POST", fullPath: "/v1/topups/{topup}/cancel" })
});

// node_modules/stripe/esm/resources/Transfers.js
var se = n.method, Pu = n.extend({
  create: se({ method: "POST", fullPath: "/v1/transfers" }),
  retrieve: se({ method: "GET", fullPath: "/v1/transfers/{transfer}" }),
  update: se({ method: "POST", fullPath: "/v1/transfers/{transfer}" }),
  list: se({
    method: "GET",
    fullPath: "/v1/transfers",
    methodType: "list"
  }),
  createReversal: se({
    method: "POST",
    fullPath: "/v1/transfers/{id}/reversals"
  }),
  listReversals: se({
    method: "GET",
    fullPath: "/v1/transfers/{id}/reversals",
    methodType: "list"
  }),
  retrieveReversal: se({
    method: "GET",
    fullPath: "/v1/transfers/{transfer}/reversals/{id}"
  }),
  updateReversal: se({
    method: "POST",
    fullPath: "/v1/transfers/{transfer}/reversals/{id}"
  })
});

// node_modules/stripe/esm/resources/WebhookEndpoints.js
var Rt = n.method, gu = n.extend({
  create: Rt({ method: "POST", fullPath: "/v1/webhook_endpoints" }),
  retrieve: Rt({
    method: "GET",
    fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
  }),
  update: Rt({
    method: "POST",
    fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
  }),
  list: Rt({
    method: "GET",
    fullPath: "/v1/webhook_endpoints",
    methodType: "list"
  }),
  del: Rt({
    method: "DELETE",
    fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
  })
});

// node_modules/stripe/esm/resources.js
var zd = O("apps", { Secrets: qa }), jd = O("billing", {
  Alerts: Os,
  CreditBalanceSummary: Fs,
  CreditBalanceTransactions: Us,
  CreditGrants: $s,
  MeterEventAdjustments: ta,
  MeterEvents: ia,
  Meters: aa
}), Wd = O("billingPortal", {
  Configurations: Ds,
  Sessions: Na
}), Kd = O("checkout", {
  Sessions: Fa
}), Vd = O("climate", {
  Orders: ua,
  Products: ga,
  Suppliers: za
}), Qd = O("entitlements", {
  ActiveEntitlements: bs,
  Features: Js
}), Jd = O("financialConnections", {
  Accounts: gs,
  Sessions: Ua,
  Transactions: Ja
}), Yd = O("forwarding", {
  Requests: Ga
}), Xd = O("identity", {
  VerificationReports: il,
  VerificationSessions: sl
}), Zd = O("issuing", {
  Authorizations: Rs,
  Cardholders: Is,
  Cards: Ms,
  Disputes: js,
  PersonalizationDesigns: ma,
  PhysicalBundles: va,
  Tokens: Wa,
  Transactions: Ya
}), eh = O("radar", {
  EarlyFraudWarnings: Ks,
  ValueListItems: rl,
  ValueLists: ol
}), th = O("reporting", {
  ReportRuns: Ca,
  ReportTypes: Ma
}), rh = O("sigma", {
  ScheduledQueryRuns: ka
}), oh = O("tax", {
  Associations: ws,
  Calculations: Cs,
  Registrations: Aa,
  Settings: Ha,
  Transactions: Xa
}), nh = O("terminal", {
  Configurations: ks,
  ConnectionTokens: Ns,
  Locations: ea,
  OnboardingLinks: la,
  Readers: Ta
}), ih = O("testHelpers", {
  ConfirmationTokens: qs,
  Customers: Bs,
  Refunds: Ra,
  TestClocks: ja,
  Issuing: O("issuing", {
    Authorizations: As,
    Cards: Gs,
    PersonalizationDesigns: fa,
    Transactions: Za
  }),
  Terminal: O("terminal", {
    Readers: Sa
  }),
  Treasury: O("treasury", {
    InboundTransfers: Xs,
    OutboundPayments: ca,
    OutboundTransfers: da,
    ReceivedCredits: _a,
    ReceivedDebits: ba
  })
}), sh = O("treasury", {
  CreditReversals: Hs,
  DebitReversals: zs,
  FinancialAccounts: Ys,
  InboundTransfers: Zs,
  OutboundPayments: pa,
  OutboundTransfers: ha,
  ReceivedCredits: xa,
  ReceivedDebits: wa,
  TransactionEntries: Va,
  Transactions: tl
}), ah = O("v2", {
  Billing: O("billing", {
    MeterEventAdjustments: ra,
    MeterEventSession: oa,
    MeterEventStream: na,
    MeterEvents: sa
  }),
  Core: O("core", {
    AccountLinks: ys,
    AccountTokens: Ps,
    Accounts: Es,
    EventDestinations: Vs,
    Events: Qs
  })
});

// node_modules/stripe/esm/stripe.core.js
var Tu = "api.stripe.com", Su = "443", _u = "/v1/", Eu = Eo, xu = 8e4, bu = 5, Ou = 0.5, lh = ["name", "version", "url", "partner_id"], wu = [
  "authenticator",
  "apiVersion",
  "typescript",
  "maxNetworkRetries",
  "httpAgent",
  "httpClient",
  "timeout",
  "host",
  "port",
  "protocol",
  "telemetry",
  "appInfo",
  "stripeAccount",
  "stripeContext"
], uh = /* @__PURE__ */ s((t) => new ur(t, n.MAX_BUFFERED_REQUEST_METRICS), "defaultRequestSenderFactory");
function Ru(t, e = uh) {
  r.PACKAGE_VERSION = "20.1.2", r.API_VERSION = Eo, r.USER_AGENT = Object.assign({ bindings_version: r.PACKAGE_VERSION, lang: "node", publisher: "stripe", uname: null, typescript: !1 }, ls()), r.StripeResource = n, r.StripeContext = at, r.resources = He, r.HttpClient = N, r.HttpClientResponse = we, r.CryptoProvider = Re, r.webhooks = fs(t);
  function r(o, i = {}) {
    if (!(this instanceof r))
      return new r(o, i);
    let a = this._getPropsFromConfig(i);
    this._platformFunctions = t, Object.defineProperty(this, "_emitter", {
      value: this._platformFunctions.createEmitter(),
      enumerable: !1,
      configurable: !1,
      writable: !1
    }), this.VERSION = r.PACKAGE_VERSION, this.on = this._emitter.on.bind(this._emitter), this.once = this._emitter.once.bind(this._emitter), this.off = this._emitter.removeListener.bind(this._emitter);
    let l = a.httpAgent || null;
    this._api = {
      host: a.host || Tu,
      port: a.port || Su,
      protocol: a.protocol || "https",
      basePath: _u,
      version: a.apiVersion || Eu,
      timeout: Jt("timeout", a.timeout, xu),
      maxNetworkRetries: Jt("maxNetworkRetries", a.maxNetworkRetries, 2),
      agent: l,
      httpClient: a.httpClient || (l ? this._platformFunctions.createNodeHttpClient(l) : this._platformFunctions.createDefaultHttpClient()),
      dev: !1,
      stripeAccount: a.stripeAccount || null,
      stripeContext: a.stripeContext || null
    };
    let p = a.typescript || !1;
    p !== r.USER_AGENT.typescript && (r.USER_AGENT.typescript = p), a.appInfo && this._setAppInfo(a.appInfo), this._prepResources(), this._setAuthenticator(o, a.authenticator), this.errors = lr, this.webhooks = r.webhooks, this._prevRequestMetrics = [], this._enableTelemetry = a.telemetry !== !1, this._requestSender = e(this), this.StripeResource = r.StripeResource;
  }
  return s(r, "Stripe"), r.errors = lr, r.createNodeHttpClient = t.createNodeHttpClient, r.createFetchHttpClient = t.createFetchHttpClient, r.createNodeCryptoProvider = t.createNodeCryptoProvider, r.createSubtleCryptoProvider = t.createSubtleCryptoProvider, r.prototype = {
    // Properties are set in the constructor above
    _appInfo: void 0,
    on: null,
    off: null,
    once: null,
    VERSION: null,
    StripeResource: null,
    webhooks: null,
    errors: null,
    _api: null,
    _prevRequestMetrics: null,
    _emitter: null,
    _enableTelemetry: null,
    _requestSender: null,
    _platformFunctions: null,
    rawRequest(o, i, a, l) {
      return this._requestSender._rawRequest(o, i, a, l);
    },
    /**
     * @private
     */
    _setAuthenticator(o, i) {
      if (o && i)
        throw new Error("Can't specify both apiKey and authenticator");
      if (!o && !i)
        throw new Error("Neither apiKey nor config.authenticator provided");
      this._authenticator = o ? Wt(o) : i;
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _setAppInfo(o) {
      if (o && typeof o != "object")
        throw new Error("AppInfo must be an object.");
      if (o && !o.name)
        throw new Error("AppInfo.name is required");
      o = o || {}, this._appInfo = lh.reduce((i, a) => (typeof o[a] == "string" && (i = i || {}, i[a] = o[a]), i), {});
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _setApiField(o, i) {
      this._api[o] = i;
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     */
    getApiField(o) {
      return this._api[o];
    },
    setClientId(o) {
      this._clientId = o;
    },
    getClientId() {
      return this._clientId;
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     */
    getConstant: /* @__PURE__ */ s((o) => {
      switch (o) {
        case "DEFAULT_HOST":
          return Tu;
        case "DEFAULT_PORT":
          return Su;
        case "DEFAULT_BASE_PATH":
          return _u;
        case "DEFAULT_API_VERSION":
          return Eu;
        case "DEFAULT_TIMEOUT":
          return xu;
        case "MAX_NETWORK_RETRY_DELAY_SEC":
          return bu;
        case "INITIAL_NETWORK_RETRY_DELAY_SEC":
          return Ou;
      }
      return r[o];
    }, "getConstant"),
    getMaxNetworkRetries() {
      return this.getApiField("maxNetworkRetries");
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _setApiNumberField(o, i, a) {
      let l = Jt(o, i, a);
      this._setApiField(o, l);
    },
    getMaxNetworkRetryDelay() {
      return bu;
    },
    getInitialNetworkRetryDelay() {
      return Ou;
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     *
     * Gets a JSON version of a User-Agent and uses a cached version for a slight
     * speed advantage.
     */
    getClientUserAgent(o) {
      return this.getClientUserAgentSeeded(r.USER_AGENT, o);
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     *
     * Gets a JSON version of a User-Agent by encoding a seeded object and
     * fetching a uname from the system.
     */
    getClientUserAgentSeeded(o, i) {
      this._platformFunctions.getUname().then((a) => {
        var l;
        let p = {};
        for (let m in o)
          Object.prototype.hasOwnProperty.call(o, m) && (p[m] = encodeURIComponent((l = o[m]) !== null && l !== void 0 ? l : "null"));
        p.uname = encodeURIComponent(a || "UNKNOWN");
        let h = this.getApiField("httpClient");
        h && (p.httplib = encodeURIComponent(h.getClientName())), this._appInfo && (p.application = this._appInfo), i(JSON.stringify(p));
      });
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     */
    getAppInfoAsString() {
      if (!this._appInfo)
        return "";
      let o = this._appInfo.name;
      return this._appInfo.version && (o += `/${this._appInfo.version}`), this._appInfo.url && (o += ` (${this._appInfo.url})`), o;
    },
    getTelemetryEnabled() {
      return this._enableTelemetry;
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _prepResources() {
      for (let o in He)
        Object.prototype.hasOwnProperty.call(He, o) && (this[ss(o)] = new He[o](this));
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _getPropsFromConfig(o) {
      if (!o)
        return {};
      let i = typeof o == "string";
      if (!(o === Object(o) && !Array.isArray(o)) && !i)
        throw new Error("Config must either be an object or a string");
      if (i)
        return {
          apiVersion: o
        };
      if (Object.keys(o).filter((p) => !wu.includes(p)).length > 0)
        throw new Error(`Config object may only contain the following: ${wu.join(", ")}`);
      return o;
    },
    parseEventNotification(o, i, a, l, p, h) {
      let m = this.webhooks.constructEvent(o, i, a, l, p, h);
      return m.context && (m.context = at.parse(m.context)), m.fetchEvent = () => this._requestSender._rawRequest("GET", `/v2/core/events/${m.id}`, void 0, {
        stripeContext: m.context
      }, ["fetch_event"]), m.fetchRelatedObject = () => m.related_object ? this._requestSender._rawRequest("GET", m.related_object.url, void 0, {
        stripeContext: m.context
      }, ["fetch_related_object"]) : Promise.resolve(null), m;
    }
  }, r;
}
s(Ru, "createStripe");

// node_modules/stripe/esm/stripe.esm.worker.js
var ch = Ru(new rr()), ye = ch;

// node_modules/@convex-dev/stripe/dist/client/index.js
var ph = 600, Au = class {
  static {
    s(this, "StripeSubscriptions");
  }
  component;
  _apiKey;
  constructor(e, r) {
    this.component = e, this._apiKey = r?.STRIPE_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY;
  }
  get apiKey() {
    if (!this._apiKey)
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    return this._apiKey;
  }
  /**
   * Update subscription quantity (for seat-based pricing).
   * This will update both Stripe and the local database.
   */
  async updateSubscriptionQuantity(e, r) {
    return await e.runAction(this.component.public.updateSubscriptionQuantity, {
      stripeSubscriptionId: r.stripeSubscriptionId,
      quantity: r.quantity,
      apiKey: this.apiKey
    }), null;
  }
  /**
   * Cancel a subscription either immediately or at period end.
   * Updates both Stripe and the local database.
   */
  async cancelSubscription(e, r) {
    let o = new ye(this.apiKey), i = r.cancelAtPeriodEnd ?? !0, a;
    return i ? a = await o.subscriptions.update(r.stripeSubscriptionId, {
      cancel_at_period_end: !0
    }) : a = await o.subscriptions.cancel(r.stripeSubscriptionId), await e.runMutation(this.component.private.handleSubscriptionUpdated, {
      stripeSubscriptionId: a.id,
      status: a.status,
      currentPeriodEnd: a.items.data[0]?.current_period_end || 0,
      cancelAtPeriodEnd: a.cancel_at_period_end ?? !1,
      quantity: a.items.data[0]?.quantity ?? 1,
      metadata: a.metadata || {}
    }), null;
  }
  /**
   * Reactivate a subscription that was set to cancel at period end.
   * Updates both Stripe and the local database.
   */
  async reactivateSubscription(e, r) {
    let i = await new ye(this.apiKey).subscriptions.update(r.stripeSubscriptionId, {
      cancel_at_period_end: !1
    });
    return await e.runMutation(this.component.private.handleSubscriptionUpdated, {
      stripeSubscriptionId: i.id,
      status: i.status,
      currentPeriodEnd: i.items.data[0]?.current_period_end || 0,
      cancelAtPeriodEnd: i.cancel_at_period_end ?? !1,
      quantity: i.items.data[0]?.quantity ?? 1,
      metadata: i.metadata || {}
    }), null;
  }
  // ============================================================================
  // CHECKOUT & PAYMENTS
  // ============================================================================
  /**
   * Create a Stripe Checkout session for one-time payments or subscriptions.
   */
  async createCheckoutSession(e, r) {
    let o = new ye(this.apiKey), i = {
      mode: r.mode,
      line_items: [
        {
          price: r.priceId,
          quantity: r.quantity ?? 1
        }
      ],
      success_url: r.successUrl,
      cancel_url: r.cancelUrl,
      metadata: r.metadata || {}
    };
    r.customerId && (i.customer = r.customerId), r.mode === "subscription" && r.subscriptionMetadata && (i.subscription_data = {
      metadata: r.subscriptionMetadata
    }), r.mode === "payment" && r.paymentIntentMetadata && (i.payment_intent_data = {
      metadata: r.paymentIntentMetadata
    });
    let a = await o.checkout.sessions.create(i);
    return {
      sessionId: a.id,
      url: a.url
    };
  }
  /**
   * Create a new Stripe customer.
   *
   * @param args.idempotencyKey - Optional key to prevent duplicate customer creation.
   *   If two requests come in with the same key, Stripe returns the same customer.
   *   Recommended: pass `userId` to prevent race conditions.
   */
  async createCustomer(e, r) {
    let o = new ye(this.apiKey), i = r.idempotencyKey ? { idempotencyKey: `create_customer_${r.idempotencyKey}` } : void 0, a = await o.customers.create({
      email: r.email,
      name: r.name,
      metadata: r.metadata
    }, i);
    return await e.runMutation(this.component.public.createOrUpdateCustomer, {
      stripeCustomerId: a.id,
      email: r.email,
      name: r.name,
      metadata: r.metadata
    }), {
      customerId: a.id
    };
  }
  /**
   * Get or create a Stripe customer for a user.
   * Checks existing subscriptions/payments first to avoid duplicates.
   */
  async getOrCreateCustomer(e, r) {
    let o = await e.runQuery(this.component.public.listSubscriptionsByUserId, { userId: r.userId });
    if (o.length > 0)
      return { customerId: o[0].stripeCustomerId, isNew: !1 };
    let i = await e.runQuery(this.component.public.listPaymentsByUserId, { userId: r.userId });
    return i.length > 0 && i[0].stripeCustomerId ? { customerId: i[0].stripeCustomerId, isNew: !1 } : { customerId: (await this.createCustomer(e, {
      email: r.email,
      name: r.name,
      metadata: { userId: r.userId },
      idempotencyKey: r.userId
      // Prevents duplicate customers if called concurrently
    })).customerId, isNew: !0 };
  }
  /**
   * Create a Stripe Customer Portal session for managing subscriptions.
   */
  async createCustomerPortalSession(e, r) {
    return {
      url: (await new ye(this.apiKey).billingPortal.sessions.create({
        customer: r.customerId,
        return_url: r.returnUrl
      })).url
    };
  }
};
function bE(t, e, r) {
  let o = r?.webhookPath ?? "/stripe/webhook", i = r?.events ?? {};
  t.route({
    path: o,
    method: "POST",
    handler: Ho(async (a, l) => {
      let p = r?.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;
      if (!p)
        return console.error("\u274C STRIPE_WEBHOOK_SECRET is not set"), new Response("Webhook secret not configured", { status: 500 });
      let h = l.headers.get("stripe-signature");
      if (!h)
        return console.error("\u274C No Stripe signature in headers"), new Response("No signature provided", { status: 400 });
      let m = await l.text(), u = r?.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
      if (!u)
        return console.error("\u274C STRIPE_SECRET_KEY is not set"), new Response("Stripe secret key not configured", {
          status: 500
        });
      let d = new ye(u), c;
      try {
        c = await d.webhooks.constructEventAsync(m, h, p);
      } catch (y) {
        return console.error("\u274C Webhook signature verification failed:", y), new Response(`Webhook signature verification failed: ${y instanceof Error ? y.message : String(y)}`, { status: 400 });
      }
      try {
        await dh(a, e, c, d), r?.onEvent && await r.onEvent(a, c);
        let y = c.type, f = i[y];
        f && await f(a, c);
      } catch (y) {
        return console.error("\u274C Error processing webhook:", y), new Response("Error processing webhook", { status: 500 });
      }
      return new Response(JSON.stringify({ received: !0 }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    })
  });
}
s(bE, "registerRoutes");
async function dh(t, e, r, o) {
  switch (r.type) {
    case "customer.created":
    case "customer.updated": {
      let i = r.data.object, a = r.type === "customer.created" ? e.private.handleCustomerCreated : e.private.handleCustomerUpdated;
      await t.runMutation(a, {
        stripeCustomerId: i.id,
        email: i.email || void 0,
        name: i.name || void 0,
        metadata: i.metadata
      });
      break;
    }
    case "customer.subscription.created": {
      let i = r.data.object;
      await t.runMutation(e.private.handleSubscriptionCreated, {
        stripeSubscriptionId: i.id,
        stripeCustomerId: i.customer,
        status: i.status,
        currentPeriodEnd: i.items.data[0]?.current_period_end || 0,
        cancelAtPeriodEnd: i.cancel_at_period_end ?? !1,
        quantity: i.items.data[0]?.quantity ?? 1,
        priceId: i.items.data[0]?.price.id || "",
        metadata: i.metadata || {}
      });
      break;
    }
    case "customer.subscription.updated": {
      let i = r.data.object;
      await t.runMutation(e.private.handleSubscriptionUpdated, {
        stripeSubscriptionId: i.id,
        status: i.status,
        currentPeriodEnd: i.items.data[0]?.current_period_end || 0,
        cancelAtPeriodEnd: i.cancel_at_period_end ?? !1,
        quantity: i.items.data[0]?.quantity ?? 1,
        metadata: i.metadata || {}
      });
      break;
    }
    case "customer.subscription.deleted": {
      let i = r.data.object;
      await t.runMutation(e.private.handleSubscriptionDeleted, {
        stripeSubscriptionId: i.id
      });
      break;
    }
    case "checkout.session.completed": {
      let i = r.data.object;
      if (await t.runMutation(e.private.handleCheckoutSessionCompleted, {
        stripeCheckoutSessionId: i.id,
        stripeCustomerId: i.customer ? i.customer : void 0,
        mode: i.mode || "payment",
        metadata: i.metadata || void 0
      }), i.mode === "payment" && i.customer && i.payment_intent && await t.runMutation(e.private.updatePaymentCustomer, {
        stripePaymentIntentId: i.payment_intent,
        stripeCustomerId: i.customer
      }), i.mode === "subscription" && i.subscription)
        try {
          let a = await o.subscriptions.retrieve(i.subscription);
          if (a.latest_invoice) {
            let l = await o.invoices.retrieve(a.latest_invoice);
            await t.runMutation(e.private.handleInvoiceCreated, {
              stripeInvoiceId: l.id,
              stripeCustomerId: l.customer,
              stripeSubscriptionId: a.id,
              status: l.status || "paid",
              amountDue: l.amount_due,
              amountPaid: l.amount_paid,
              created: l.created
            });
          }
        } catch (a) {
          console.error("Error fetching invoice for subscription:", a);
        }
      break;
    }
    case "invoice.created":
    case "invoice.finalized": {
      let i = r.data.object;
      await t.runMutation(e.private.handleInvoiceCreated, {
        stripeInvoiceId: i.id,
        stripeCustomerId: i.customer,
        stripeSubscriptionId: i.subscription,
        status: i.status || "open",
        amountDue: i.amount_due,
        amountPaid: i.amount_paid,
        created: i.created
      });
      break;
    }
    case "invoice.paid":
    case "invoice.payment_succeeded": {
      let i = r.data.object;
      await t.runMutation(e.private.handleInvoicePaid, {
        stripeInvoiceId: i.id,
        amountPaid: i.amount_paid
      });
      break;
    }
    case "invoice.payment_failed": {
      let i = r.data.object;
      await t.runMutation(e.private.handleInvoicePaymentFailed, {
        stripeInvoiceId: i.id
      });
      break;
    }
    case "payment_intent.succeeded": {
      let i = r.data.object;
      if (i.invoice)
        try {
          if ((await o.invoices.retrieve(i.invoice)).subscription) {
            console.log("\u23ED\uFE0F Skipping payment_intent.succeeded - subscription payment");
            break;
          }
        } catch (a) {
          console.error("Error checking invoice:", a);
        }
      if (i.customer) {
        let a = await t.runQuery(e.public.listSubscriptions, {
          stripeCustomerId: i.customer
        }), l = Date.now() / 1e3 - ph;
        if (a.find((h) => h._creationTime > l)) {
          console.log("\u23ED\uFE0F Skipping payment_intent.succeeded - recent subscription");
          break;
        }
      }
      await t.runMutation(e.private.handlePaymentIntentSucceeded, {
        stripePaymentIntentId: i.id,
        stripeCustomerId: i.customer ? i.customer : void 0,
        amount: i.amount,
        currency: i.currency,
        status: i.status,
        created: i.created,
        metadata: i.metadata || {}
      });
      break;
    }
    default:
      console.log(`\u2139\uFE0F Unhandled event type: ${r.type}`);
  }
}
s(dh, "processEvent");

export {
  Au as a,
  bE as b
};
//# sourceMappingURL=R4KVEYWB.js.map
