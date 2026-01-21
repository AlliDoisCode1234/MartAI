import {
  e as me
} from "../_deps/K33OSGN4.js";
import {
  c as P,
  e as Vp
} from "../_deps/4U34M3I6.js";
import {
  a,
  c as o,
  e as Wp
} from "../_deps/RUVYHBJQ.js";

// node_modules/svix/dist/models/applicationIn.js
var Ye = o((Qe) => {
  "use strict";
  Object.defineProperty(Qe, "__esModule", { value: !0 });
  Qe.ApplicationInSerializer = void 0;
  Qe.ApplicationInSerializer = {
    _fromJsonObject(e) {
      return {
        metadata: e.metadata,
        name: e.name,
        rateLimit: e.rateLimit,
        uid: e.uid
      };
    },
    _toJsonObject(e) {
      return {
        metadata: e.metadata,
        name: e.name,
        rateLimit: e.rateLimit,
        uid: e.uid
      };
    }
  };
});

// node_modules/svix/dist/models/applicationOut.js
var ua = o((Ze) => {
  "use strict";
  Object.defineProperty(Ze, "__esModule", { value: !0 });
  Ze.ApplicationOutSerializer = void 0;
  Ze.ApplicationOutSerializer = {
    _fromJsonObject(e) {
      return {
        createdAt: new Date(e.createdAt),
        id: e.id,
        metadata: e.metadata,
        name: e.name,
        rateLimit: e.rateLimit,
        uid: e.uid,
        updatedAt: new Date(e.updatedAt)
      };
    },
    _toJsonObject(e) {
      return {
        createdAt: e.createdAt,
        id: e.id,
        metadata: e.metadata,
        name: e.name,
        rateLimit: e.rateLimit,
        uid: e.uid,
        updatedAt: e.updatedAt
      };
    }
  };
});

// node_modules/svix/dist/models/applicationPatch.js
var Es = o((Xe) => {
  "use strict";
  Object.defineProperty(Xe, "__esModule", { value: !0 });
  Xe.ApplicationPatchSerializer = void 0;
  Xe.ApplicationPatchSerializer = {
    _fromJsonObject(e) {
      return {
        metadata: e.metadata,
        name: e.name,
        rateLimit: e.rateLimit,
        uid: e.uid
      };
    },
    _toJsonObject(e) {
      return {
        metadata: e.metadata,
        name: e.name,
        rateLimit: e.rateLimit,
        uid: e.uid
      };
    }
  };
});

// node_modules/svix/dist/models/listResponseApplicationOut.js
var Ms = o((et) => {
  "use strict";
  Object.defineProperty(et, "__esModule", { value: !0 });
  et.ListResponseApplicationOutSerializer = void 0;
  var Is = ua();
  et.ListResponseApplicationOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => Is.ApplicationOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => Is.ApplicationOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    }
  };
});

// node_modules/svix/dist/util.js
var ca = o((tt) => {
  "use strict";
  Object.defineProperty(tt, "__esModule", { value: !0 });
  tt.ApiException = void 0;
  var da = class extends Error {
    static {
      a(this, "ApiException");
    }
    constructor(t, r, i) {
      super(`HTTP-Code: ${t}
Headers: ${JSON.stringify(i)}`), this.code = t, this.body = r, this.headers = {}, i.forEach((n, s) => {
        this.headers[s] = n;
      });
    }
  };
  tt.ApiException = da;
});

// node_modules/uuid/dist/commonjs-browser/max.js
var As = o((rt) => {
  "use strict";
  Object.defineProperty(rt, "__esModule", {
    value: !0
  });
  rt.default = void 0;
  var Wv = rt.default = "ffffffff-ffff-ffff-ffff-ffffffffffff";
});

// node_modules/uuid/dist/commonjs-browser/nil.js
var Rs = o((it) => {
  "use strict";
  Object.defineProperty(it, "__esModule", {
    value: !0
  });
  it.default = void 0;
  var Qv = it.default = "00000000-0000-0000-0000-000000000000";
});

// node_modules/uuid/dist/commonjs-browser/regex.js
var Hs = o((nt) => {
  "use strict";
  Object.defineProperty(nt, "__esModule", {
    value: !0
  });
  nt.default = void 0;
  var Zv = nt.default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
});

// node_modules/uuid/dist/commonjs-browser/validate.js
var Le = o((at) => {
  "use strict";
  Object.defineProperty(at, "__esModule", {
    value: !0
  });
  at.default = void 0;
  var Qp = Yp(Hs());
  function Yp(e) {
    return e && e.__esModule ? e : { default: e };
  }
  a(Yp, "_interopRequireDefault");
  function Zp(e) {
    return typeof e == "string" && Qp.default.test(e);
  }
  a(Zp, "validate");
  var eh = at.default = Zp;
});

// node_modules/uuid/dist/commonjs-browser/parse.js
var Ue = o((st) => {
  "use strict";
  Object.defineProperty(st, "__esModule", {
    value: !0
  });
  st.default = void 0;
  var Xp = em(Le());
  function em(e) {
    return e && e.__esModule ? e : { default: e };
  }
  a(em, "_interopRequireDefault");
  function tm(e) {
    if (!(0, Xp.default)(e))
      throw TypeError("Invalid UUID");
    var t, r = new Uint8Array(16);
    return r[0] = (t = parseInt(e.slice(0, 8), 16)) >>> 24, r[1] = t >>> 16 & 255, r[2] = t >>> 8 & 255, r[3] = t & 255, r[4] = (t = parseInt(e.slice(9, 13), 16)) >>> 8, r[5] = t & 255, r[6] = (t = parseInt(e.slice(14, 18), 16)) >>> 8, r[7] = t & 255, r[8] = (t = parseInt(e.slice(19, 23), 16)) >>> 8, r[9] = t & 255, r[10] = (t = parseInt(e.slice(24, 36), 16)) / 1099511627776 & 255, r[11] = t / 4294967296 & 255, r[12] = t >>> 24 & 255, r[13] = t >>> 16 & 255, r[14] = t >>> 8 & 255, r[15] = t & 255, r;
  }
  a(tm, "parse");
  var ih = st.default = tm;
});

// node_modules/uuid/dist/commonjs-browser/stringify.js
var oe = o((Fe) => {
  "use strict";
  Object.defineProperty(Fe, "__esModule", {
    value: !0
  });
  Fe.default = void 0;
  Fe.unsafeStringify = Ds;
  var rm = im(Le());
  function im(e) {
    return e && e.__esModule ? e : { default: e };
  }
  a(im, "_interopRequireDefault");
  var H = [];
  for (ot = 0; ot < 256; ++ot)
    H.push((ot + 256).toString(16).slice(1));
  var ot;
  function Ds(e, t = 0) {
    return (H[e[t + 0]] + H[e[t + 1]] + H[e[t + 2]] + H[e[t + 3]] + "-" + H[e[t + 4]] + H[e[t + 5]] + "-" + H[e[t + 6]] + H[e[t + 7]] + "-" + H[e[t + 8]] + H[e[t + 9]] + "-" + H[e[t + 10]] + H[e[t + 11]] + H[e[t + 12]] + H[e[t + 13]] + H[e[t + 14]] + H[e[t + 15]]).toLowerCase();
  }
  a(Ds, "unsafeStringify");
  function nm(e, t = 0) {
    var r = Ds(e, t);
    if (!(0, rm.default)(r))
      throw TypeError("Stringified UUID is invalid");
    return r;
  }
  a(nm, "stringify");
  var sh = Fe.default = nm;
});

// node_modules/uuid/dist/commonjs-browser/rng.js
var dt = o((la) => {
  "use strict";
  Object.defineProperty(la, "__esModule", {
    value: !0
  });
  la.default = sm;
  var ut, am = new Uint8Array(16);
  function sm() {
    if (!ut && (ut = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !ut))
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    return ut(am);
  }
  a(sm, "rng");
});

// node_modules/uuid/dist/commonjs-browser/v1.js
var _a = o((lt) => {
  "use strict";
  Object.defineProperty(lt, "__esModule", {
    value: !0
  });
  lt.default = void 0;
  var om = dm(dt()), um = oe();
  function dm(e) {
    return e && e.__esModule ? e : { default: e };
  }
  a(dm, "_interopRequireDefault");
  var pa, ct, ma = 0, fa = 0;
  function cm(e, t, r) {
    var i = t && r || 0, n = t || new Array(16);
    e = e || {};
    var s = e.node, u = e.clockseq;
    if (e._v6 || (s || (s = pa), u == null && (u = ct)), s == null || u == null) {
      var m = e.random || (e.rng || om.default)();
      s == null && (s = [m[0], m[1], m[2], m[3], m[4], m[5]], !pa && !e._v6 && (s[0] |= 1, pa = s)), u == null && (u = (m[6] << 8 | m[7]) & 16383, ct === void 0 && !e._v6 && (ct = u));
    }
    var p = e.msecs !== void 0 ? e.msecs : Date.now(), c = e.nsecs !== void 0 ? e.nsecs : fa + 1, g = p - ma + (c - fa) / 1e4;
    if (g < 0 && e.clockseq === void 0 && (u = u + 1 & 16383), (g < 0 || p > ma) && e.nsecs === void 0 && (c = 0), c >= 1e4)
      throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    ma = p, fa = c, ct = u, p += 122192928e5;
    var _ = ((p & 268435455) * 1e4 + c) % 4294967296;
    n[i++] = _ >>> 24 & 255, n[i++] = _ >>> 16 & 255, n[i++] = _ >>> 8 & 255, n[i++] = _ & 255;
    var d = p / 4294967296 * 1e4 & 268435455;
    n[i++] = d >>> 8 & 255, n[i++] = d & 255, n[i++] = d >>> 24 & 15 | 16, n[i++] = d >>> 16 & 255, n[i++] = u >>> 8 | 128, n[i++] = u & 255;
    for (var l = 0; l < 6; ++l)
      n[i + l] = s[l];
    return t || (0, um.unsafeStringify)(n);
  }
  a(cm, "v1");
  var lh = lt.default = cm;
});

// node_modules/uuid/dist/commonjs-browser/v1ToV6.js
var va = o((ga) => {
  "use strict";
  Object.defineProperty(ga, "__esModule", {
    value: !0
  });
  ga.default = fm;
  var lm = mm(Ue()), pm = oe();
  function mm(e) {
    return e && e.__esModule ? e : { default: e };
  }
  a(mm, "_interopRequireDefault");
  function fm(e) {
    var t = typeof e == "string" ? (0, lm.default)(e) : e, r = _m(t);
    return typeof e == "string" ? (0, pm.unsafeStringify)(r) : r;
  }
  a(fm, "v1ToV6");
  function _m(e, t = !1) {
    return Uint8Array.of((e[6] & 15) << 4 | e[7] >> 4 & 15, (e[7] & 15) << 4 | (e[4] & 240) >> 4, (e[4] & 15) << 4 | (e[5] & 240) >> 4, (e[5] & 15) << 4 | (e[0] & 240) >> 4, (e[0] & 15) << 4 | (e[1] & 240) >> 4, (e[1] & 15) << 4 | (e[2] & 240) >> 4, 96 | e[2] & 15, e[3], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15]);
  }
  a(_m, "_v1ToV6");
});

// node_modules/uuid/dist/commonjs-browser/v35.js
var ha = o((fe) => {
  "use strict";
  Object.defineProperty(fe, "__esModule", {
    value: !0
  });
  fe.URL = fe.DNS = void 0;
  fe.default = bm;
  var gm = oe(), vm = hm(Ue());
  function hm(e) {
    return e && e.__esModule ? e : { default: e };
  }
  a(hm, "_interopRequireDefault");
  function Om(e) {
    e = unescape(encodeURIComponent(e));
    for (var t = [], r = 0; r < e.length; ++r)
      t.push(e.charCodeAt(r));
    return t;
  }
  a(Om, "stringToBytes");
  var Sm = fe.DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8", ym = fe.URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
  function bm(e, t, r) {
    function i(n, s, u, m) {
      var p;
      if (typeof n == "string" && (n = Om(n)), typeof s == "string" && (s = (0, vm.default)(s)), ((p = s) === null || p === void 0 ? void 0 : p.length) !== 16)
        throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
      var c = new Uint8Array(16 + n.length);
      if (c.set(s), c.set(n, s.length), c = r(c), c[6] = c[6] & 15 | t, c[8] = c[8] & 63 | 128, u) {
        m = m || 0;
        for (var g = 0; g < 16; ++g)
          u[m + g] = c[g];
        return u;
      }
      return (0, gm.unsafeStringify)(c);
    }
    a(i, "generateUUID");
    try {
      i.name = e;
    } catch {
    }
    return i.DNS = Sm, i.URL = ym, i;
  }
  a(bm, "v35");
});

// node_modules/uuid/dist/commonjs-browser/md5.js
var Us = o((mt) => {
  "use strict";
  Object.defineProperty(mt, "__esModule", {
    value: !0
  });
  mt.default = void 0;
  function Pm(e) {
    if (typeof e == "string") {
      var t = unescape(encodeURIComponent(e));
      e = new Uint8Array(t.length);
      for (var r = 0; r < t.length; ++r)
        e[r] = t.charCodeAt(r);
    }
    return qm(zm(xm(e), e.length * 8));
  }
  a(Pm, "md5");
  function qm(e) {
    for (var t = [], r = e.length * 32, i = "0123456789abcdef", n = 0; n < r; n += 8) {
      var s = e[n >> 5] >>> n % 32 & 255, u = parseInt(i.charAt(s >>> 4 & 15) + i.charAt(s & 15), 16);
      t.push(u);
    }
    return t;
  }
  a(qm, "md5ToHexEncodedArray");
  function Ls(e) {
    return (e + 64 >>> 9 << 4) + 14 + 1;
  }
  a(Ls, "getOutputLength");
  function zm(e, t) {
    e[t >> 5] |= 128 << t % 32, e[Ls(t) - 1] = t;
    for (var r = 1732584193, i = -271733879, n = -1732584194, s = 271733878, u = 0; u < e.length; u += 16) {
      var m = r, p = i, c = n, g = s;
      r = D(r, i, n, s, e[u], 7, -680876936), s = D(s, r, i, n, e[u + 1], 12, -389564586), n = D(n, s, r, i, e[u + 2], 17, 606105819), i = D(i, n, s, r, e[u + 3], 22, -1044525330), r = D(r, i, n, s, e[u + 4], 7, -176418897), s = D(s, r, i, n, e[u + 5], 12, 1200080426), n = D(n, s, r, i, e[u + 6], 17, -1473231341), i = D(i, n, s, r, e[u + 7], 22, -45705983), r = D(r, i, n, s, e[u + 8], 7, 1770035416), s = D(s, r, i, n, e[u + 9], 12, -1958414417), n = D(n, s, r, i, e[u + 10], 17, -42063), i = D(i, n, s, r, e[u + 11], 22, -1990404162), r = D(r, i, n, s, e[u + 12], 7, 1804603682), s = D(s, r, i, n, e[u + 13], 12, -40341101), n = D(n, s, r, i, e[u + 14], 17, -1502002290), i = D(i, n, s, r, e[u + 15], 22, 1236535329), r = L(r, i, n, s, e[u + 1], 5, -165796510), s = L(s, r, i, n, e[u + 6], 9, -1069501632), n = L(n, s, r, i, e[u + 11], 14, 643717713), i = L(i, n, s, r, e[u], 20, -373897302), r = L(r, i, n, s, e[u + 5], 5, -701558691), s = L(s, r, i, n, e[u + 10], 9, 38016083), n = L(n, s, r, i, e[u + 15], 14, -660478335), i = L(i, n, s, r, e[u + 4], 20, -405537848), r = L(r, i, n, s, e[u + 9], 5, 568446438), s = L(s, r, i, n, e[u + 14], 9, -1019803690), n = L(n, s, r, i, e[u + 3], 14, -187363961), i = L(i, n, s, r, e[u + 8], 20, 1163531501), r = L(r, i, n, s, e[u + 13], 5, -1444681467), s = L(s, r, i, n, e[u + 2], 9, -51403784), n = L(n, s, r, i, e[u + 7], 14, 1735328473), i = L(i, n, s, r, e[u + 12], 20, -1926607734), r = U(r, i, n, s, e[u + 5], 4, -378558), s = U(s, r, i, n, e[u + 8], 11, -2022574463), n = U(n, s, r, i, e[u + 11], 16, 1839030562), i = U(i, n, s, r, e[u + 14], 23, -35309556), r = U(r, i, n, s, e[u + 1], 4, -1530992060), s = U(s, r, i, n, e[u + 4], 11, 1272893353), n = U(n, s, r, i, e[u + 7], 16, -155497632), i = U(i, n, s, r, e[u + 10], 23, -1094730640), r = U(r, i, n, s, e[u + 13], 4, 681279174), s = U(s, r, i, n, e[u], 11, -358537222), n = U(n, s, r, i, e[u + 3], 16, -722521979), i = U(i, n, s, r, e[u + 6], 23, 76029189), r = U(r, i, n, s, e[u + 9], 4, -640364487), s = U(s, r, i, n, e[u + 12], 11, -421815835), n = U(n, s, r, i, e[u + 15], 16, 530742520), i = U(i, n, s, r, e[u + 2], 23, -995338651), r = F(r, i, n, s, e[u], 6, -198630844), s = F(s, r, i, n, e[u + 7], 10, 1126891415), n = F(n, s, r, i, e[u + 14], 15, -1416354905), i = F(i, n, s, r, e[u + 5], 21, -57434055), r = F(r, i, n, s, e[u + 12], 6, 1700485571), s = F(s, r, i, n, e[u + 3], 10, -1894986606), n = F(n, s, r, i, e[u + 10], 15, -1051523), i = F(i, n, s, r, e[u + 1], 21, -2054922799), r = F(r, i, n, s, e[u + 8], 6, 1873313359), s = F(s, r, i, n, e[u + 15], 10, -30611744), n = F(n, s, r, i, e[u + 6], 15, -1560198380), i = F(i, n, s, r, e[u + 13], 21, 1309151649), r = F(r, i, n, s, e[u + 4], 6, -145523070), s = F(s, r, i, n, e[u + 11], 10, -1120210379), n = F(n, s, r, i, e[u + 2], 15, 718787259), i = F(i, n, s, r, e[u + 9], 21, -343485551), r = ue(r, m), i = ue(i, p), n = ue(n, c), s = ue(s, g);
    }
    return [r, i, n, s];
  }
  a(zm, "wordsToMd5");
  function xm(e) {
    if (e.length === 0)
      return [];
    for (var t = e.length * 8, r = new Uint32Array(Ls(t)), i = 0; i < t; i += 8)
      r[i >> 5] |= (e[i / 8] & 255) << i % 32;
    return r;
  }
  a(xm, "bytesToWords");
  function ue(e, t) {
    var r = (e & 65535) + (t & 65535), i = (e >> 16) + (t >> 16) + (r >> 16);
    return i << 16 | r & 65535;
  }
  a(ue, "safeAdd");
  function Jm(e, t) {
    return e << t | e >>> 32 - t;
  }
  a(Jm, "bitRotateLeft");
  function pt(e, t, r, i, n, s) {
    return ue(Jm(ue(ue(t, e), ue(i, s)), n), r);
  }
  a(pt, "md5cmn");
  function D(e, t, r, i, n, s, u) {
    return pt(t & r | ~t & i, e, t, n, s, u);
  }
  a(D, "md5ff");
  function L(e, t, r, i, n, s, u) {
    return pt(t & i | r & ~i, e, t, n, s, u);
  }
  a(L, "md5gg");
  function U(e, t, r, i, n, s, u) {
    return pt(t ^ r ^ i, e, t, n, s, u);
  }
  a(U, "md5hh");
  function F(e, t, r, i, n, s, u) {
    return pt(r ^ (t | ~i), e, t, n, s, u);
  }
  a(F, "md5ii");
  var hh = mt.default = Pm;
});

// node_modules/uuid/dist/commonjs-browser/v3.js
var Bs = o((ft) => {
  "use strict";
  Object.defineProperty(ft, "__esModule", {
    value: !0
  });
  ft.default = void 0;
  var km = Fs(ha()), Cm = Fs(Us());
  function Fs(e) {
    return e && e.__esModule ? e : { default: e };
  }
  a(Fs, "_interopRequireDefault");
  var Tm = (0, km.default)("v3", 48, Cm.default), yh = ft.default = Tm;
});

// node_modules/uuid/dist/commonjs-browser/native.js
var Ns = o((_t) => {
  "use strict";
  Object.defineProperty(_t, "__esModule", {
    value: !0
  });
  _t.default = void 0;
  var wm = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), qh = _t.default = {
    randomUUID: wm
  };
});

// node_modules/uuid/dist/commonjs-browser/v4.js
var Gs = o((gt) => {
  "use strict";
  Object.defineProperty(gt, "__esModule", {
    value: !0
  });
  gt.default = void 0;
  var $s = Ks(Ns()), jm = Ks(dt()), Em = oe();
  function Ks(e) {
    return e && e.__esModule ? e : { default: e };
  }
  a(Ks, "_interopRequireDefault");
  function Im(e, t, r) {
    if ($s.default.randomUUID && !t && !e)
      return $s.default.randomUUID();
    e = e || {};
    var i = e.random || (e.rng || jm.default)();
    if (i[6] = i[6] & 15 | 64, i[8] = i[8] & 63 | 128, t) {
      r = r || 0;
      for (var n = 0; n < 16; ++n)
        t[r + n] = i[n];
      return t;
    }
    return (0, Em.unsafeStringify)(i);
  }
  a(Im, "v4");
  var xh = gt.default = Im;
});

// node_modules/uuid/dist/commonjs-browser/sha1.js
var Ws = o((vt) => {
  "use strict";
  Object.defineProperty(vt, "__esModule", {
    value: !0
  });
  vt.default = void 0;
  function Mm(e, t, r, i) {
    switch (e) {
      case 0:
        return t & r ^ ~t & i;
      case 1:
        return t ^ r ^ i;
      case 2:
        return t & r ^ t & i ^ r & i;
      case 3:
        return t ^ r ^ i;
    }
  }
  a(Mm, "f");
  function Oa(e, t) {
    return e << t | e >>> 32 - t;
  }
  a(Oa, "ROTL");
  function Am(e) {
    var t = [1518500249, 1859775393, 2400959708, 3395469782], r = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
    if (typeof e == "string") {
      var i = unescape(encodeURIComponent(e));
      e = [];
      for (var n = 0; n < i.length; ++n)
        e.push(i.charCodeAt(n));
    } else Array.isArray(e) || (e = Array.prototype.slice.call(e));
    e.push(128);
    for (var s = e.length / 4 + 2, u = Math.ceil(s / 16), m = new Array(u), p = 0; p < u; ++p) {
      for (var c = new Uint32Array(16), g = 0; g < 16; ++g)
        c[g] = e[p * 64 + g * 4] << 24 | e[p * 64 + g * 4 + 1] << 16 | e[p * 64 + g * 4 + 2] << 8 | e[p * 64 + g * 4 + 3];
      m[p] = c;
    }
    m[u - 1][14] = (e.length - 1) * 8 / Math.pow(2, 32), m[u - 1][14] = Math.floor(m[u - 1][14]), m[u - 1][15] = (e.length - 1) * 8 & 4294967295;
    for (var _ = 0; _ < u; ++_) {
      for (var d = new Uint32Array(80), l = 0; l < 16; ++l)
        d[l] = m[_][l];
      for (var f = 16; f < 80; ++f)
        d[f] = Oa(d[f - 3] ^ d[f - 8] ^ d[f - 14] ^ d[f - 16], 1);
      for (var z = r[0], O = r[1], S = r[2], v = r[3], j = r[4], J = 0; J < 80; ++J) {
        var x = Math.floor(J / 20), Z = Oa(z, 5) + Mm(x, O, S, v) + j + t[x] + d[J] >>> 0;
        j = v, v = S, S = Oa(O, 30) >>> 0, O = z, z = Z;
      }
      r[0] = r[0] + z >>> 0, r[1] = r[1] + O >>> 0, r[2] = r[2] + S >>> 0, r[3] = r[3] + v >>> 0, r[4] = r[4] + j >>> 0;
    }
    return [r[0] >> 24 & 255, r[0] >> 16 & 255, r[0] >> 8 & 255, r[0] & 255, r[1] >> 24 & 255, r[1] >> 16 & 255, r[1] >> 8 & 255, r[1] & 255, r[2] >> 24 & 255, r[2] >> 16 & 255, r[2] >> 8 & 255, r[2] & 255, r[3] >> 24 & 255, r[3] >> 16 & 255, r[3] >> 8 & 255, r[3] & 255, r[4] >> 24 & 255, r[4] >> 16 & 255, r[4] >> 8 & 255, r[4] & 255];
  }
  a(Am, "sha1");
  var Ch = vt.default = Am;
});

// node_modules/uuid/dist/commonjs-browser/v5.js
var Qs = o((ht) => {
  "use strict";
  Object.defineProperty(ht, "__esModule", {
    value: !0
  });
  ht.default = void 0;
  var Rm = Vs(ha()), Hm = Vs(Ws());
  function Vs(e) {
    return e && e.__esModule ? e : { default: e };
  }
  a(Vs, "_interopRequireDefault");
  var Dm = (0, Rm.default)("v5", 80, Hm.default), jh = ht.default = Dm;
});

// node_modules/uuid/dist/commonjs-browser/v6.js
var eo = o((Sa) => {
  "use strict";
  Object.defineProperty(Sa, "__esModule", {
    value: !0
  });
  Sa.default = Km;
  var Lm = oe(), Um = Xs(_a()), Fm = Xs(va());
  function Xs(e) {
    return e && e.__esModule ? e : { default: e };
  }
  a(Xs, "_interopRequireDefault");
  function Ys(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      t && (i = i.filter(function(n) {
        return Object.getOwnPropertyDescriptor(e, n).enumerable;
      })), r.push.apply(r, i);
    }
    return r;
  }
  a(Ys, "ownKeys");
  function Zs(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t] != null ? arguments[t] : {};
      t % 2 ? Ys(Object(r), !0).forEach(function(i) {
        Bm(e, i, r[i]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ys(Object(r)).forEach(function(i) {
        Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(r, i));
      });
    }
    return e;
  }
  a(Zs, "_objectSpread");
  function Bm(e, t, r) {
    return (t = Nm(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
  }
  a(Bm, "_defineProperty");
  function Nm(e) {
    var t = $m(e, "string");
    return typeof t == "symbol" ? t : t + "";
  }
  a(Nm, "_toPropertyKey");
  function $m(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
      var i = r.call(e, t || "default");
      if (typeof i != "object") return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(e);
  }
  a($m, "_toPrimitive");
  function Km(e = {}, t, r = 0) {
    var i = (0, Um.default)(Zs(Zs({}, e), {}, {
      _v6: !0
    }), new Uint8Array(16));
    if (i = (0, Fm.default)(i), t) {
      for (var n = 0; n < 16; n++)
        t[r + n] = i[n];
      return t;
    }
    return (0, Lm.unsafeStringify)(i);
  }
  a(Km, "v6");
});

// node_modules/uuid/dist/commonjs-browser/v6ToV1.js
var to = o((ya) => {
  "use strict";
  Object.defineProperty(ya, "__esModule", {
    value: !0
  });
  ya.default = Qm;
  var Gm = Vm(Ue()), Wm = oe();
  function Vm(e) {
    return e && e.__esModule ? e : { default: e };
  }
  a(Vm, "_interopRequireDefault");
  function Qm(e) {
    var t = typeof e == "string" ? (0, Gm.default)(e) : e, r = Ym(t);
    return typeof e == "string" ? (0, Wm.unsafeStringify)(r) : r;
  }
  a(Qm, "v6ToV1");
  function Ym(e) {
    return Uint8Array.of((e[3] & 15) << 4 | e[4] >> 4 & 15, (e[4] & 15) << 4 | (e[5] & 240) >> 4, (e[5] & 15) << 4 | e[6] & 15, e[7], (e[1] & 15) << 4 | (e[2] & 240) >> 4, (e[2] & 15) << 4 | (e[3] & 240) >> 4, 16 | (e[0] & 240) >> 4, (e[0] & 15) << 4 | (e[1] & 240) >> 4, e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15]);
  }
  a(Ym, "_v6ToV1");
});

// node_modules/uuid/dist/commonjs-browser/v7.js
var no = o((Ot) => {
  "use strict";
  Object.defineProperty(Ot, "__esModule", {
    value: !0
  });
  Ot.default = void 0;
  var Zm = ef(dt()), Xm = oe();
  function ef(e) {
    return e && e.__esModule ? e : { default: e };
  }
  a(ef, "_interopRequireDefault");
  var ro = null, io = null, ne = 0;
  function tf(e, t, r) {
    e = e || {};
    var i = t && r || 0, n = t || new Uint8Array(16), s = e.random || (e.rng || Zm.default)(), u = e.msecs !== void 0 ? e.msecs : Date.now(), m = e.seq !== void 0 ? e.seq : null, p = io, c = ro;
    return u > ne && e.msecs === void 0 && (ne = u, m !== null && (p = null, c = null)), m !== null && (m > 2147483647 && (m = 2147483647), p = m >>> 19 & 4095, c = m & 524287), (p === null || c === null) && (p = s[6] & 127, p = p << 8 | s[7], c = s[8] & 63, c = c << 8 | s[9], c = c << 5 | s[10] >>> 3), u + 1e4 > ne && m === null ? ++c > 524287 && (c = 0, ++p > 4095 && (p = 0, ne++)) : ne = u, io = p, ro = c, n[i++] = ne / 1099511627776 & 255, n[i++] = ne / 4294967296 & 255, n[i++] = ne / 16777216 & 255, n[i++] = ne / 65536 & 255, n[i++] = ne / 256 & 255, n[i++] = ne & 255, n[i++] = p >>> 4 & 15 | 112, n[i++] = p & 255, n[i++] = c >>> 13 & 63 | 128, n[i++] = c >>> 5 & 255, n[i++] = c << 3 & 255 | s[10] & 7, n[i++] = s[11], n[i++] = s[12], n[i++] = s[13], n[i++] = s[14], n[i++] = s[15], t || (0, Xm.unsafeStringify)(n);
  }
  a(tf, "v7");
  var Dh = Ot.default = tf;
});

// node_modules/uuid/dist/commonjs-browser/version.js
var ao = o((St) => {
  "use strict";
  Object.defineProperty(St, "__esModule", {
    value: !0
  });
  St.default = void 0;
  var rf = nf(Le());
  function nf(e) {
    return e && e.__esModule ? e : { default: e };
  }
  a(nf, "_interopRequireDefault");
  function af(e) {
    if (!(0, rf.default)(e))
      throw TypeError("Invalid UUID");
    return parseInt(e.slice(14, 15), 16);
  }
  a(af, "version");
  var Fh = St.default = af;
});

// node_modules/uuid/dist/commonjs-browser/index.js
var so = o((B) => {
  "use strict";
  Object.defineProperty(B, "__esModule", {
    value: !0
  });
  Object.defineProperty(B, "MAX", {
    enumerable: !0,
    get: /* @__PURE__ */ a(function() {
      return sf.default;
    }, "get")
  });
  Object.defineProperty(B, "NIL", {
    enumerable: !0,
    get: /* @__PURE__ */ a(function() {
      return of.default;
    }, "get")
  });
  Object.defineProperty(B, "parse", {
    enumerable: !0,
    get: /* @__PURE__ */ a(function() {
      return uf.default;
    }, "get")
  });
  Object.defineProperty(B, "stringify", {
    enumerable: !0,
    get: /* @__PURE__ */ a(function() {
      return df.default;
    }, "get")
  });
  Object.defineProperty(B, "v1", {
    enumerable: !0,
    get: /* @__PURE__ */ a(function() {
      return cf.default;
    }, "get")
  });
  Object.defineProperty(B, "v1ToV6", {
    enumerable: !0,
    get: /* @__PURE__ */ a(function() {
      return lf.default;
    }, "get")
  });
  Object.defineProperty(B, "v3", {
    enumerable: !0,
    get: /* @__PURE__ */ a(function() {
      return pf.default;
    }, "get")
  });
  Object.defineProperty(B, "v4", {
    enumerable: !0,
    get: /* @__PURE__ */ a(function() {
      return mf.default;
    }, "get")
  });
  Object.defineProperty(B, "v5", {
    enumerable: !0,
    get: /* @__PURE__ */ a(function() {
      return ff.default;
    }, "get")
  });
  Object.defineProperty(B, "v6", {
    enumerable: !0,
    get: /* @__PURE__ */ a(function() {
      return _f.default;
    }, "get")
  });
  Object.defineProperty(B, "v6ToV1", {
    enumerable: !0,
    get: /* @__PURE__ */ a(function() {
      return gf.default;
    }, "get")
  });
  Object.defineProperty(B, "v7", {
    enumerable: !0,
    get: /* @__PURE__ */ a(function() {
      return vf.default;
    }, "get")
  });
  Object.defineProperty(B, "validate", {
    enumerable: !0,
    get: /* @__PURE__ */ a(function() {
      return hf.default;
    }, "get")
  });
  Object.defineProperty(B, "version", {
    enumerable: !0,
    get: /* @__PURE__ */ a(function() {
      return Of.default;
    }, "get")
  });
  var sf = N(As()), of = N(Rs()), uf = N(Ue()), df = N(oe()), cf = N(_a()), lf = N(va()), pf = N(Bs()), mf = N(Gs()), ff = N(Qs()), _f = N(eo()), gf = N(to()), vf = N(no()), hf = N(Le()), Of = N(ao());
  function N(e) {
    return e && e.__esModule ? e : { default: e };
  }
  a(N, "_interopRequireDefault");
});

// node_modules/svix/dist/request.js
var k = o((X) => {
  "use strict";
  var Be = X && X.__awaiter || function(e, t, r, i) {
    function n(s) {
      return s instanceof r ? s : new r(function(u) {
        u(s);
      });
    }
    return a(n, "adopt"), new (r || (r = Promise))(function(s, u) {
      function m(g) {
        try {
          c(i.next(g));
        } catch (_) {
          u(_);
        }
      }
      a(m, "fulfilled");
      function p(g) {
        try {
          c(i.throw(g));
        } catch (_) {
          u(_);
        }
      }
      a(p, "rejected");
      function c(g) {
        g.done ? s(g.value) : n(g.value).then(m, p);
      }
      a(c, "step"), c((i = i.apply(e, t || [])).next());
    });
  };
  Object.defineProperty(X, "__esModule", { value: !0 });
  X.SvixRequest = X.HttpMethod = X.LIB_VERSION = void 0;
  var ba = ca(), Sf = so();
  X.LIB_VERSION = "1.84.1";
  var yf = `svix-libs/${X.LIB_VERSION}/javascript`, bf;
  (function(e) {
    e.GET = "GET", e.HEAD = "HEAD", e.POST = "POST", e.PUT = "PUT", e.DELETE = "DELETE", e.CONNECT = "CONNECT", e.OPTIONS = "OPTIONS", e.TRACE = "TRACE", e.PATCH = "PATCH";
  })(bf = X.HttpMethod || (X.HttpMethod = {}));
  var Pa = class {
    static {
      a(this, "SvixRequest");
    }
    constructor(t, r) {
      this.method = t, this.path = r, this.queryParams = {}, this.headerParams = {};
    }
    setPathParam(t, r) {
      let i = this.path.replace(`{${t}}`, encodeURIComponent(r));
      if (this.path === i)
        throw new Error(`path parameter ${t} not found`);
      this.path = i;
    }
    setQueryParams(t) {
      for (let [r, i] of Object.entries(t))
        this.setQueryParam(r, i);
    }
    setQueryParam(t, r) {
      if (r != null)
        if (typeof r == "string")
          this.queryParams[t] = r;
        else if (typeof r == "boolean" || typeof r == "number")
          this.queryParams[t] = r.toString();
        else if (r instanceof Date)
          this.queryParams[t] = r.toISOString();
        else if (Array.isArray(r))
          r.length > 0 && (this.queryParams[t] = r.join(","));
        else {
          let i = r;
          throw new Error(`query parameter ${t} has unsupported type`);
        }
    }
    setHeaderParam(t, r) {
      r !== void 0 && (this.headerParams[t] = r);
    }
    setBody(t) {
      this.body = JSON.stringify(t);
    }
    send(t, r) {
      return Be(this, void 0, void 0, function* () {
        let i = yield this.sendInner(t);
        if (i.status === 204)
          return null;
        let n = yield i.text();
        return r(JSON.parse(n));
      });
    }
    sendNoResponseBody(t) {
      return Be(this, void 0, void 0, function* () {
        yield this.sendInner(t);
      });
    }
    sendInner(t) {
      var r, i;
      return Be(this, void 0, void 0, function* () {
        let n = new URL(t.baseUrl + this.path);
        for (let [p, c] of Object.entries(this.queryParams))
          n.searchParams.set(p, c);
        this.headerParams["idempotency-key"] === void 0 && this.method.toUpperCase() === "POST" && (this.headerParams["idempotency-key"] = `auto_${(0, Sf.v4)()}`);
        let s = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        this.body != null && (this.headerParams["content-type"] = "application/json");
        let u = "credentials" in Request.prototype, m = yield oo(n, {
          method: this.method.toString(),
          body: this.body,
          headers: Object.assign({ accept: "application/json, */*;q=0.8", authorization: `Bearer ${t.token}`, "user-agent": yf, "svix-req-id": s.toString() }, this.headerParams),
          credentials: u ? "same-origin" : void 0,
          signal: t.timeout !== void 0 ? AbortSignal.timeout(t.timeout) : void 0
        }, t.retryScheduleInMs, (r = t.retryScheduleInMs) === null || r === void 0 ? void 0 : r[0], ((i = t.retryScheduleInMs) === null || i === void 0 ? void 0 : i.length) || t.numRetries, t.fetch);
        return Pf(m);
      });
    }
  };
  X.SvixRequest = Pa;
  function Pf(e) {
    return Be(this, void 0, void 0, function* () {
      if (e.status < 300)
        return e;
      let t = yield e.text();
      throw e.status === 422 ? new ba.ApiException(e.status, JSON.parse(t), e.headers) : e.status >= 400 && e.status <= 499 ? new ba.ApiException(e.status, JSON.parse(t), e.headers) : new ba.ApiException(e.status, t, e.headers);
    });
  }
  a(Pf, "filterResponseForErrors");
  function oo(e, t, r, i = 50, n = 2, s = fetch, u = 1) {
    return Be(this, void 0, void 0, function* () {
      let m = /* @__PURE__ */ a((p) => new Promise((c) => setTimeout(c, p)), "sleep");
      try {
        let p = yield s(e, t);
        if (n <= 0 || p.status < 500)
          return p;
      } catch (p) {
        if (n <= 0)
          throw p;
      }
      return yield m(i), t.headers["svix-retry-count"] = u.toString(), i = r?.[u] || i * 2, yield oo(e, t, r, i, --n, s, ++u);
    });
  }
  a(oo, "sendWithRetry");
});

// node_modules/svix/dist/api/application.js
var uo = o((yt) => {
  "use strict";
  Object.defineProperty(yt, "__esModule", { value: !0 });
  yt.Application = void 0;
  var qa = Ye(), Ne = ua(), qf = Es(), zf = Ms(), $ = k(), za = class {
    static {
      a(this, "Application");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    list(t) {
      let r = new $.SvixRequest($.HttpMethod.GET, "/api/v1/app");
      return r.setQueryParams({
        exclude_apps_with_no_endpoints: t?.excludeAppsWithNoEndpoints,
        exclude_apps_with_disabled_endpoints: t?.excludeAppsWithDisabledEndpoints,
        limit: t?.limit,
        iterator: t?.iterator,
        order: t?.order
      }), r.send(this.requestCtx, zf.ListResponseApplicationOutSerializer._fromJsonObject);
    }
    create(t, r) {
      let i = new $.SvixRequest($.HttpMethod.POST, "/api/v1/app");
      return i.setHeaderParam("idempotency-key", r?.idempotencyKey), i.setBody(qa.ApplicationInSerializer._toJsonObject(t)), i.send(this.requestCtx, Ne.ApplicationOutSerializer._fromJsonObject);
    }
    getOrCreate(t, r) {
      let i = new $.SvixRequest($.HttpMethod.POST, "/api/v1/app");
      return i.setQueryParam("get_if_exists", !0), i.setHeaderParam("idempotency-key", r?.idempotencyKey), i.setBody(qa.ApplicationInSerializer._toJsonObject(t)), i.send(this.requestCtx, Ne.ApplicationOutSerializer._fromJsonObject);
    }
    get(t) {
      let r = new $.SvixRequest($.HttpMethod.GET, "/api/v1/app/{app_id}");
      return r.setPathParam("app_id", t), r.send(this.requestCtx, Ne.ApplicationOutSerializer._fromJsonObject);
    }
    update(t, r) {
      let i = new $.SvixRequest($.HttpMethod.PUT, "/api/v1/app/{app_id}");
      return i.setPathParam("app_id", t), i.setBody(qa.ApplicationInSerializer._toJsonObject(r)), i.send(this.requestCtx, Ne.ApplicationOutSerializer._fromJsonObject);
    }
    delete(t) {
      let r = new $.SvixRequest($.HttpMethod.DELETE, "/api/v1/app/{app_id}");
      return r.setPathParam("app_id", t), r.sendNoResponseBody(this.requestCtx);
    }
    patch(t, r) {
      let i = new $.SvixRequest($.HttpMethod.PATCH, "/api/v1/app/{app_id}");
      return i.setPathParam("app_id", t), i.setBody(qf.ApplicationPatchSerializer._toJsonObject(r)), i.send(this.requestCtx, Ne.ApplicationOutSerializer._fromJsonObject);
    }
  };
  yt.Application = za;
});

// node_modules/svix/dist/models/apiTokenOut.js
var co = o((bt) => {
  "use strict";
  Object.defineProperty(bt, "__esModule", { value: !0 });
  bt.ApiTokenOutSerializer = void 0;
  bt.ApiTokenOutSerializer = {
    _fromJsonObject(e) {
      return {
        createdAt: new Date(e.createdAt),
        expiresAt: e.expiresAt ? new Date(e.expiresAt) : null,
        id: e.id,
        name: e.name,
        scopes: e.scopes,
        token: e.token
      };
    },
    _toJsonObject(e) {
      return {
        createdAt: e.createdAt,
        expiresAt: e.expiresAt,
        id: e.id,
        name: e.name,
        scopes: e.scopes,
        token: e.token
      };
    }
  };
});

// node_modules/svix/dist/models/appPortalCapability.js
var xa = o((_e) => {
  "use strict";
  Object.defineProperty(_e, "__esModule", { value: !0 });
  _e.AppPortalCapabilitySerializer = _e.AppPortalCapability = void 0;
  var xf;
  (function(e) {
    e.ViewBase = "ViewBase", e.ViewEndpointSecret = "ViewEndpointSecret", e.ManageEndpointSecret = "ManageEndpointSecret", e.ManageTransformations = "ManageTransformations", e.CreateAttempts = "CreateAttempts", e.ManageEndpoint = "ManageEndpoint";
  })(xf = _e.AppPortalCapability || (_e.AppPortalCapability = {}));
  _e.AppPortalCapabilitySerializer = {
    _fromJsonObject(e) {
      return e;
    },
    _toJsonObject(e) {
      return e;
    }
  };
});

// node_modules/svix/dist/models/appPortalAccessIn.js
var mo = o((Pt) => {
  "use strict";
  Object.defineProperty(Pt, "__esModule", { value: !0 });
  Pt.AppPortalAccessInSerializer = void 0;
  var lo = xa(), po = Ye();
  Pt.AppPortalAccessInSerializer = {
    _fromJsonObject(e) {
      var t;
      return {
        application: e.application ? po.ApplicationInSerializer._fromJsonObject(e.application) : void 0,
        capabilities: (t = e.capabilities) === null || t === void 0 ? void 0 : t.map((r) => lo.AppPortalCapabilitySerializer._fromJsonObject(r)),
        expiry: e.expiry,
        featureFlags: e.featureFlags,
        readOnly: e.readOnly,
        sessionId: e.sessionId
      };
    },
    _toJsonObject(e) {
      var t;
      return {
        application: e.application ? po.ApplicationInSerializer._toJsonObject(e.application) : void 0,
        capabilities: (t = e.capabilities) === null || t === void 0 ? void 0 : t.map((r) => lo.AppPortalCapabilitySerializer._toJsonObject(r)),
        expiry: e.expiry,
        featureFlags: e.featureFlags,
        readOnly: e.readOnly,
        sessionId: e.sessionId
      };
    }
  };
});

// node_modules/svix/dist/models/appPortalAccessOut.js
var fo = o((qt) => {
  "use strict";
  Object.defineProperty(qt, "__esModule", { value: !0 });
  qt.AppPortalAccessOutSerializer = void 0;
  qt.AppPortalAccessOutSerializer = {
    _fromJsonObject(e) {
      return {
        token: e.token,
        url: e.url
      };
    },
    _toJsonObject(e) {
      return {
        token: e.token,
        url: e.url
      };
    }
  };
});

// node_modules/svix/dist/models/applicationTokenExpireIn.js
var _o = o((zt) => {
  "use strict";
  Object.defineProperty(zt, "__esModule", { value: !0 });
  zt.ApplicationTokenExpireInSerializer = void 0;
  zt.ApplicationTokenExpireInSerializer = {
    _fromJsonObject(e) {
      return {
        expiry: e.expiry,
        sessionIds: e.sessionIds
      };
    },
    _toJsonObject(e) {
      return {
        expiry: e.expiry,
        sessionIds: e.sessionIds
      };
    }
  };
});

// node_modules/svix/dist/models/rotatePollerTokenIn.js
var go = o((xt) => {
  "use strict";
  Object.defineProperty(xt, "__esModule", { value: !0 });
  xt.RotatePollerTokenInSerializer = void 0;
  xt.RotatePollerTokenInSerializer = {
    _fromJsonObject(e) {
      return {
        expiry: e.expiry,
        oldTokenExpiry: e.oldTokenExpiry
      };
    },
    _toJsonObject(e) {
      return {
        expiry: e.expiry,
        oldTokenExpiry: e.oldTokenExpiry
      };
    }
  };
});

// node_modules/svix/dist/models/streamPortalAccessIn.js
var vo = o((Jt) => {
  "use strict";
  Object.defineProperty(Jt, "__esModule", { value: !0 });
  Jt.StreamPortalAccessInSerializer = void 0;
  Jt.StreamPortalAccessInSerializer = {
    _fromJsonObject(e) {
      return {
        expiry: e.expiry,
        featureFlags: e.featureFlags,
        sessionId: e.sessionId
      };
    },
    _toJsonObject(e) {
      return {
        expiry: e.expiry,
        featureFlags: e.featureFlags,
        sessionId: e.sessionId
      };
    }
  };
});

// node_modules/svix/dist/models/dashboardAccessOut.js
var Ja = o((kt) => {
  "use strict";
  Object.defineProperty(kt, "__esModule", { value: !0 });
  kt.DashboardAccessOutSerializer = void 0;
  kt.DashboardAccessOutSerializer = {
    _fromJsonObject(e) {
      return {
        token: e.token,
        url: e.url
      };
    },
    _toJsonObject(e) {
      return {
        token: e.token,
        url: e.url
      };
    }
  };
});

// node_modules/svix/dist/api/authentication.js
var So = o((Ct) => {
  "use strict";
  Object.defineProperty(Ct, "__esModule", { value: !0 });
  Ct.Authentication = void 0;
  var ho = co(), Jf = mo(), Oo = fo(), kf = _o(), Cf = go(), Tf = vo(), wf = Ja(), K = k(), ka = class {
    static {
      a(this, "Authentication");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    appPortalAccess(t, r, i) {
      let n = new K.SvixRequest(K.HttpMethod.POST, "/api/v1/auth/app-portal-access/{app_id}");
      return n.setPathParam("app_id", t), n.setHeaderParam("idempotency-key", i?.idempotencyKey), n.setBody(Jf.AppPortalAccessInSerializer._toJsonObject(r)), n.send(this.requestCtx, Oo.AppPortalAccessOutSerializer._fromJsonObject);
    }
    expireAll(t, r, i) {
      let n = new K.SvixRequest(K.HttpMethod.POST, "/api/v1/auth/app/{app_id}/expire-all");
      return n.setPathParam("app_id", t), n.setHeaderParam("idempotency-key", i?.idempotencyKey), n.setBody(kf.ApplicationTokenExpireInSerializer._toJsonObject(r)), n.sendNoResponseBody(this.requestCtx);
    }
    dashboardAccess(t, r) {
      let i = new K.SvixRequest(K.HttpMethod.POST, "/api/v1/auth/dashboard-access/{app_id}");
      return i.setPathParam("app_id", t), i.setHeaderParam("idempotency-key", r?.idempotencyKey), i.send(this.requestCtx, wf.DashboardAccessOutSerializer._fromJsonObject);
    }
    logout(t) {
      let r = new K.SvixRequest(K.HttpMethod.POST, "/api/v1/auth/logout");
      return r.setHeaderParam("idempotency-key", t?.idempotencyKey), r.sendNoResponseBody(this.requestCtx);
    }
    streamPortalAccess(t, r, i) {
      let n = new K.SvixRequest(K.HttpMethod.POST, "/api/v1/auth/stream-portal-access/{stream_id}");
      return n.setPathParam("stream_id", t), n.setHeaderParam("idempotency-key", i?.idempotencyKey), n.setBody(Tf.StreamPortalAccessInSerializer._toJsonObject(r)), n.send(this.requestCtx, Oo.AppPortalAccessOutSerializer._fromJsonObject);
    }
    getStreamPollerToken(t, r) {
      let i = new K.SvixRequest(K.HttpMethod.GET, "/api/v1/auth/stream/{stream_id}/sink/{sink_id}/poller/token");
      return i.setPathParam("stream_id", t), i.setPathParam("sink_id", r), i.send(this.requestCtx, ho.ApiTokenOutSerializer._fromJsonObject);
    }
    rotateStreamPollerToken(t, r, i, n) {
      let s = new K.SvixRequest(K.HttpMethod.POST, "/api/v1/auth/stream/{stream_id}/sink/{sink_id}/poller/token/rotate");
      return s.setPathParam("stream_id", t), s.setPathParam("sink_id", r), s.setHeaderParam("idempotency-key", n?.idempotencyKey), s.setBody(Cf.RotatePollerTokenInSerializer._toJsonObject(i)), s.send(this.requestCtx, ho.ApiTokenOutSerializer._fromJsonObject);
    }
  };
  Ct.Authentication = ka;
});

// node_modules/svix/dist/models/backgroundTaskStatus.js
var de = o((ge) => {
  "use strict";
  Object.defineProperty(ge, "__esModule", { value: !0 });
  ge.BackgroundTaskStatusSerializer = ge.BackgroundTaskStatus = void 0;
  var jf;
  (function(e) {
    e.Running = "running", e.Finished = "finished", e.Failed = "failed";
  })(jf = ge.BackgroundTaskStatus || (ge.BackgroundTaskStatus = {}));
  ge.BackgroundTaskStatusSerializer = {
    _fromJsonObject(e) {
      return e;
    },
    _toJsonObject(e) {
      return e;
    }
  };
});

// node_modules/svix/dist/models/backgroundTaskType.js
var ce = o((ve) => {
  "use strict";
  Object.defineProperty(ve, "__esModule", { value: !0 });
  ve.BackgroundTaskTypeSerializer = ve.BackgroundTaskType = void 0;
  var Ef;
  (function(e) {
    e.EndpointReplay = "endpoint.replay", e.EndpointRecover = "endpoint.recover", e.ApplicationStats = "application.stats", e.MessageBroadcast = "message.broadcast", e.SdkGenerate = "sdk.generate", e.EventTypeAggregate = "event-type.aggregate", e.ApplicationPurgeContent = "application.purge_content", e.EndpointBulkReplay = "endpoint.bulk_replay";
  })(Ef = ve.BackgroundTaskType || (ve.BackgroundTaskType = {}));
  ve.BackgroundTaskTypeSerializer = {
    _fromJsonObject(e) {
      return e;
    },
    _toJsonObject(e) {
      return e;
    }
  };
});

// node_modules/svix/dist/models/backgroundTaskOut.js
var Ca = o((Tt) => {
  "use strict";
  Object.defineProperty(Tt, "__esModule", { value: !0 });
  Tt.BackgroundTaskOutSerializer = void 0;
  var yo = de(), bo = ce();
  Tt.BackgroundTaskOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data,
        id: e.id,
        status: yo.BackgroundTaskStatusSerializer._fromJsonObject(e.status),
        task: bo.BackgroundTaskTypeSerializer._fromJsonObject(e.task)
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data,
        id: e.id,
        status: yo.BackgroundTaskStatusSerializer._toJsonObject(e.status),
        task: bo.BackgroundTaskTypeSerializer._toJsonObject(e.task)
      };
    }
  };
});

// node_modules/svix/dist/models/listResponseBackgroundTaskOut.js
var qo = o((wt) => {
  "use strict";
  Object.defineProperty(wt, "__esModule", { value: !0 });
  wt.ListResponseBackgroundTaskOutSerializer = void 0;
  var Po = Ca();
  wt.ListResponseBackgroundTaskOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => Po.BackgroundTaskOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => Po.BackgroundTaskOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    }
  };
});

// node_modules/svix/dist/api/backgroundTask.js
var zo = o((Et) => {
  "use strict";
  Object.defineProperty(Et, "__esModule", { value: !0 });
  Et.BackgroundTask = void 0;
  var If = Ca(), Mf = qo(), jt = k(), Ta = class {
    static {
      a(this, "BackgroundTask");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    list(t) {
      let r = new jt.SvixRequest(jt.HttpMethod.GET, "/api/v1/background-task");
      return r.setQueryParams({
        status: t?.status,
        task: t?.task,
        limit: t?.limit,
        iterator: t?.iterator,
        order: t?.order
      }), r.send(this.requestCtx, Mf.ListResponseBackgroundTaskOutSerializer._fromJsonObject);
    }
    listByEndpoint(t) {
      return this.list(t);
    }
    get(t) {
      let r = new jt.SvixRequest(jt.HttpMethod.GET, "/api/v1/background-task/{task_id}");
      return r.setPathParam("task_id", t), r.send(this.requestCtx, If.BackgroundTaskOutSerializer._fromJsonObject);
    }
  };
  Et.BackgroundTask = Ta;
});

// node_modules/svix/dist/models/connectorKind.js
var ke = o((he) => {
  "use strict";
  Object.defineProperty(he, "__esModule", { value: !0 });
  he.ConnectorKindSerializer = he.ConnectorKind = void 0;
  var Af;
  (function(e) {
    e.Custom = "Custom", e.AgenticCommerceProtocol = "AgenticCommerceProtocol", e.CloseCrm = "CloseCRM", e.CustomerIo = "CustomerIO", e.Discord = "Discord", e.Hubspot = "Hubspot", e.Inngest = "Inngest", e.Loops = "Loops", e.Otel = "Otel", e.Resend = "Resend", e.Salesforce = "Salesforce", e.Segment = "Segment", e.Sendgrid = "Sendgrid", e.Slack = "Slack", e.Teams = "Teams", e.TriggerDev = "TriggerDev", e.Windmill = "Windmill", e.Zapier = "Zapier";
  })(Af = he.ConnectorKind || (he.ConnectorKind = {}));
  he.ConnectorKindSerializer = {
    _fromJsonObject(e) {
      return e;
    },
    _toJsonObject(e) {
      return e;
    }
  };
});

// node_modules/svix/dist/models/connectorProduct.js
var It = o((Oe) => {
  "use strict";
  Object.defineProperty(Oe, "__esModule", { value: !0 });
  Oe.ConnectorProductSerializer = Oe.ConnectorProduct = void 0;
  var Rf;
  (function(e) {
    e.Dispatch = "Dispatch", e.Stream = "Stream";
  })(Rf = Oe.ConnectorProduct || (Oe.ConnectorProduct = {}));
  Oe.ConnectorProductSerializer = {
    _fromJsonObject(e) {
      return e;
    },
    _toJsonObject(e) {
      return e;
    }
  };
});

// node_modules/svix/dist/models/connectorIn.js
var wa = o((Mt) => {
  "use strict";
  Object.defineProperty(Mt, "__esModule", { value: !0 });
  Mt.ConnectorInSerializer = void 0;
  var xo = ke(), Jo = It();
  Mt.ConnectorInSerializer = {
    _fromJsonObject(e) {
      return {
        allowedEventTypes: e.allowedEventTypes,
        description: e.description,
        featureFlags: e.featureFlags,
        instructions: e.instructions,
        kind: e.kind ? xo.ConnectorKindSerializer._fromJsonObject(e.kind) : void 0,
        logo: e.logo,
        name: e.name,
        productType: e.productType ? Jo.ConnectorProductSerializer._fromJsonObject(e.productType) : void 0,
        transformation: e.transformation,
        uid: e.uid
      };
    },
    _toJsonObject(e) {
      return {
        allowedEventTypes: e.allowedEventTypes,
        description: e.description,
        featureFlags: e.featureFlags,
        instructions: e.instructions,
        kind: e.kind ? xo.ConnectorKindSerializer._toJsonObject(e.kind) : void 0,
        logo: e.logo,
        name: e.name,
        productType: e.productType ? Jo.ConnectorProductSerializer._toJsonObject(e.productType) : void 0,
        transformation: e.transformation,
        uid: e.uid
      };
    }
  };
});

// node_modules/svix/dist/models/connectorOut.js
var Rt = o((At) => {
  "use strict";
  Object.defineProperty(At, "__esModule", { value: !0 });
  At.ConnectorOutSerializer = void 0;
  var ko = ke(), Co = It();
  At.ConnectorOutSerializer = {
    _fromJsonObject(e) {
      return {
        allowedEventTypes: e.allowedEventTypes,
        createdAt: new Date(e.createdAt),
        description: e.description,
        featureFlags: e.featureFlags,
        id: e.id,
        instructions: e.instructions,
        kind: ko.ConnectorKindSerializer._fromJsonObject(e.kind),
        logo: e.logo,
        name: e.name,
        orgId: e.orgId,
        productType: Co.ConnectorProductSerializer._fromJsonObject(e.productType),
        transformation: e.transformation,
        transformationUpdatedAt: new Date(e.transformationUpdatedAt),
        uid: e.uid,
        updatedAt: new Date(e.updatedAt)
      };
    },
    _toJsonObject(e) {
      return {
        allowedEventTypes: e.allowedEventTypes,
        createdAt: e.createdAt,
        description: e.description,
        featureFlags: e.featureFlags,
        id: e.id,
        instructions: e.instructions,
        kind: ko.ConnectorKindSerializer._toJsonObject(e.kind),
        logo: e.logo,
        name: e.name,
        orgId: e.orgId,
        productType: Co.ConnectorProductSerializer._toJsonObject(e.productType),
        transformation: e.transformation,
        transformationUpdatedAt: e.transformationUpdatedAt,
        uid: e.uid,
        updatedAt: e.updatedAt
      };
    }
  };
});

// node_modules/svix/dist/models/connectorPatch.js
var wo = o((Ht) => {
  "use strict";
  Object.defineProperty(Ht, "__esModule", { value: !0 });
  Ht.ConnectorPatchSerializer = void 0;
  var To = ke();
  Ht.ConnectorPatchSerializer = {
    _fromJsonObject(e) {
      return {
        allowedEventTypes: e.allowedEventTypes,
        description: e.description,
        featureFlags: e.featureFlags,
        instructions: e.instructions,
        kind: e.kind ? To.ConnectorKindSerializer._fromJsonObject(e.kind) : void 0,
        logo: e.logo,
        name: e.name,
        transformation: e.transformation
      };
    },
    _toJsonObject(e) {
      return {
        allowedEventTypes: e.allowedEventTypes,
        description: e.description,
        featureFlags: e.featureFlags,
        instructions: e.instructions,
        kind: e.kind ? To.ConnectorKindSerializer._toJsonObject(e.kind) : void 0,
        logo: e.logo,
        name: e.name,
        transformation: e.transformation
      };
    }
  };
});

// node_modules/svix/dist/models/connectorUpdate.js
var Eo = o((Dt) => {
  "use strict";
  Object.defineProperty(Dt, "__esModule", { value: !0 });
  Dt.ConnectorUpdateSerializer = void 0;
  var jo = ke();
  Dt.ConnectorUpdateSerializer = {
    _fromJsonObject(e) {
      return {
        allowedEventTypes: e.allowedEventTypes,
        description: e.description,
        featureFlags: e.featureFlags,
        instructions: e.instructions,
        kind: e.kind ? jo.ConnectorKindSerializer._fromJsonObject(e.kind) : void 0,
        logo: e.logo,
        name: e.name,
        transformation: e.transformation
      };
    },
    _toJsonObject(e) {
      return {
        allowedEventTypes: e.allowedEventTypes,
        description: e.description,
        featureFlags: e.featureFlags,
        instructions: e.instructions,
        kind: e.kind ? jo.ConnectorKindSerializer._toJsonObject(e.kind) : void 0,
        logo: e.logo,
        name: e.name,
        transformation: e.transformation
      };
    }
  };
});

// node_modules/svix/dist/models/listResponseConnectorOut.js
var Mo = o((Lt) => {
  "use strict";
  Object.defineProperty(Lt, "__esModule", { value: !0 });
  Lt.ListResponseConnectorOutSerializer = void 0;
  var Io = Rt();
  Lt.ListResponseConnectorOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => Io.ConnectorOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => Io.ConnectorOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    }
  };
});

// node_modules/svix/dist/api/connector.js
var Ao = o((Ft) => {
  "use strict";
  Object.defineProperty(Ft, "__esModule", { value: !0 });
  Ft.Connector = void 0;
  var Hf = wa(), Ut = Rt(), Df = wo(), Lf = Eo(), Uf = Mo(), ee = k(), ja = class {
    static {
      a(this, "Connector");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    list(t) {
      let r = new ee.SvixRequest(ee.HttpMethod.GET, "/api/v1/connector");
      return r.setQueryParams({
        limit: t?.limit,
        iterator: t?.iterator,
        order: t?.order,
        product_type: t?.productType
      }), r.send(this.requestCtx, Uf.ListResponseConnectorOutSerializer._fromJsonObject);
    }
    create(t, r) {
      let i = new ee.SvixRequest(ee.HttpMethod.POST, "/api/v1/connector");
      return i.setHeaderParam("idempotency-key", r?.idempotencyKey), i.setBody(Hf.ConnectorInSerializer._toJsonObject(t)), i.send(this.requestCtx, Ut.ConnectorOutSerializer._fromJsonObject);
    }
    get(t) {
      let r = new ee.SvixRequest(ee.HttpMethod.GET, "/api/v1/connector/{connector_id}");
      return r.setPathParam("connector_id", t), r.send(this.requestCtx, Ut.ConnectorOutSerializer._fromJsonObject);
    }
    update(t, r) {
      let i = new ee.SvixRequest(ee.HttpMethod.PUT, "/api/v1/connector/{connector_id}");
      return i.setPathParam("connector_id", t), i.setBody(Lf.ConnectorUpdateSerializer._toJsonObject(r)), i.send(this.requestCtx, Ut.ConnectorOutSerializer._fromJsonObject);
    }
    delete(t) {
      let r = new ee.SvixRequest(ee.HttpMethod.DELETE, "/api/v1/connector/{connector_id}");
      return r.setPathParam("connector_id", t), r.sendNoResponseBody(this.requestCtx);
    }
    patch(t, r) {
      let i = new ee.SvixRequest(ee.HttpMethod.PATCH, "/api/v1/connector/{connector_id}");
      return i.setPathParam("connector_id", t), i.setBody(Df.ConnectorPatchSerializer._toJsonObject(r)), i.send(this.requestCtx, Ut.ConnectorOutSerializer._fromJsonObject);
    }
  };
  Ft.Connector = ja;
});

// node_modules/svix/dist/models/endpointHeadersIn.js
var Ro = o((Bt) => {
  "use strict";
  Object.defineProperty(Bt, "__esModule", { value: !0 });
  Bt.EndpointHeadersInSerializer = void 0;
  Bt.EndpointHeadersInSerializer = {
    _fromJsonObject(e) {
      return {
        headers: e.headers
      };
    },
    _toJsonObject(e) {
      return {
        headers: e.headers
      };
    }
  };
});

// node_modules/svix/dist/models/endpointHeadersOut.js
var Ea = o((Nt) => {
  "use strict";
  Object.defineProperty(Nt, "__esModule", { value: !0 });
  Nt.EndpointHeadersOutSerializer = void 0;
  Nt.EndpointHeadersOutSerializer = {
    _fromJsonObject(e) {
      return {
        headers: e.headers,
        sensitive: e.sensitive
      };
    },
    _toJsonObject(e) {
      return {
        headers: e.headers,
        sensitive: e.sensitive
      };
    }
  };
});

// node_modules/svix/dist/models/endpointHeadersPatchIn.js
var Ho = o(($t) => {
  "use strict";
  Object.defineProperty($t, "__esModule", { value: !0 });
  $t.EndpointHeadersPatchInSerializer = void 0;
  $t.EndpointHeadersPatchInSerializer = {
    _fromJsonObject(e) {
      return {
        deleteHeaders: e.deleteHeaders,
        headers: e.headers
      };
    },
    _toJsonObject(e) {
      return {
        deleteHeaders: e.deleteHeaders,
        headers: e.headers
      };
    }
  };
});

// node_modules/svix/dist/models/endpointIn.js
var Do = o((Kt) => {
  "use strict";
  Object.defineProperty(Kt, "__esModule", { value: !0 });
  Kt.EndpointInSerializer = void 0;
  Kt.EndpointInSerializer = {
    _fromJsonObject(e) {
      return {
        channels: e.channels,
        description: e.description,
        disabled: e.disabled,
        filterTypes: e.filterTypes,
        headers: e.headers,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        secret: e.secret,
        uid: e.uid,
        url: e.url,
        version: e.version
      };
    },
    _toJsonObject(e) {
      return {
        channels: e.channels,
        description: e.description,
        disabled: e.disabled,
        filterTypes: e.filterTypes,
        headers: e.headers,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        secret: e.secret,
        uid: e.uid,
        url: e.url,
        version: e.version
      };
    }
  };
});

// node_modules/svix/dist/models/endpointOut.js
var Ia = o((Gt) => {
  "use strict";
  Object.defineProperty(Gt, "__esModule", { value: !0 });
  Gt.EndpointOutSerializer = void 0;
  Gt.EndpointOutSerializer = {
    _fromJsonObject(e) {
      return {
        channels: e.channels,
        createdAt: new Date(e.createdAt),
        description: e.description,
        disabled: e.disabled,
        filterTypes: e.filterTypes,
        id: e.id,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        uid: e.uid,
        updatedAt: new Date(e.updatedAt),
        url: e.url,
        version: e.version
      };
    },
    _toJsonObject(e) {
      return {
        channels: e.channels,
        createdAt: e.createdAt,
        description: e.description,
        disabled: e.disabled,
        filterTypes: e.filterTypes,
        id: e.id,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        uid: e.uid,
        updatedAt: e.updatedAt,
        url: e.url,
        version: e.version
      };
    }
  };
});

// node_modules/svix/dist/models/endpointPatch.js
var Lo = o((Wt) => {
  "use strict";
  Object.defineProperty(Wt, "__esModule", { value: !0 });
  Wt.EndpointPatchSerializer = void 0;
  Wt.EndpointPatchSerializer = {
    _fromJsonObject(e) {
      return {
        channels: e.channels,
        description: e.description,
        disabled: e.disabled,
        filterTypes: e.filterTypes,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        secret: e.secret,
        uid: e.uid,
        url: e.url,
        version: e.version
      };
    },
    _toJsonObject(e) {
      return {
        channels: e.channels,
        description: e.description,
        disabled: e.disabled,
        filterTypes: e.filterTypes,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        secret: e.secret,
        uid: e.uid,
        url: e.url,
        version: e.version
      };
    }
  };
});

// node_modules/svix/dist/models/endpointSecretOut.js
var Uo = o((Vt) => {
  "use strict";
  Object.defineProperty(Vt, "__esModule", { value: !0 });
  Vt.EndpointSecretOutSerializer = void 0;
  Vt.EndpointSecretOutSerializer = {
    _fromJsonObject(e) {
      return {
        key: e.key
      };
    },
    _toJsonObject(e) {
      return {
        key: e.key
      };
    }
  };
});

// node_modules/svix/dist/models/endpointSecretRotateIn.js
var Ma = o((Qt) => {
  "use strict";
  Object.defineProperty(Qt, "__esModule", { value: !0 });
  Qt.EndpointSecretRotateInSerializer = void 0;
  Qt.EndpointSecretRotateInSerializer = {
    _fromJsonObject(e) {
      return {
        key: e.key
      };
    },
    _toJsonObject(e) {
      return {
        key: e.key
      };
    }
  };
});

// node_modules/svix/dist/models/endpointStats.js
var Fo = o((Yt) => {
  "use strict";
  Object.defineProperty(Yt, "__esModule", { value: !0 });
  Yt.EndpointStatsSerializer = void 0;
  Yt.EndpointStatsSerializer = {
    _fromJsonObject(e) {
      return {
        fail: e.fail,
        pending: e.pending,
        sending: e.sending,
        success: e.success
      };
    },
    _toJsonObject(e) {
      return {
        fail: e.fail,
        pending: e.pending,
        sending: e.sending,
        success: e.success
      };
    }
  };
});

// node_modules/svix/dist/models/endpointTransformationIn.js
var Bo = o((Zt) => {
  "use strict";
  Object.defineProperty(Zt, "__esModule", { value: !0 });
  Zt.EndpointTransformationInSerializer = void 0;
  Zt.EndpointTransformationInSerializer = {
    _fromJsonObject(e) {
      return {
        code: e.code,
        enabled: e.enabled
      };
    },
    _toJsonObject(e) {
      return {
        code: e.code,
        enabled: e.enabled
      };
    }
  };
});

// node_modules/svix/dist/models/endpointTransformationOut.js
var No = o((Xt) => {
  "use strict";
  Object.defineProperty(Xt, "__esModule", { value: !0 });
  Xt.EndpointTransformationOutSerializer = void 0;
  Xt.EndpointTransformationOutSerializer = {
    _fromJsonObject(e) {
      return {
        code: e.code,
        enabled: e.enabled,
        updatedAt: e.updatedAt ? new Date(e.updatedAt) : null
      };
    },
    _toJsonObject(e) {
      return {
        code: e.code,
        enabled: e.enabled,
        updatedAt: e.updatedAt
      };
    }
  };
});

// node_modules/svix/dist/models/endpointTransformationPatch.js
var $o = o((er) => {
  "use strict";
  Object.defineProperty(er, "__esModule", { value: !0 });
  er.EndpointTransformationPatchSerializer = void 0;
  er.EndpointTransformationPatchSerializer = {
    _fromJsonObject(e) {
      return {
        code: e.code,
        enabled: e.enabled
      };
    },
    _toJsonObject(e) {
      return {
        code: e.code,
        enabled: e.enabled
      };
    }
  };
});

// node_modules/svix/dist/models/endpointUpdate.js
var Ko = o((tr) => {
  "use strict";
  Object.defineProperty(tr, "__esModule", { value: !0 });
  tr.EndpointUpdateSerializer = void 0;
  tr.EndpointUpdateSerializer = {
    _fromJsonObject(e) {
      return {
        channels: e.channels,
        description: e.description,
        disabled: e.disabled,
        filterTypes: e.filterTypes,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        uid: e.uid,
        url: e.url,
        version: e.version
      };
    },
    _toJsonObject(e) {
      return {
        channels: e.channels,
        description: e.description,
        disabled: e.disabled,
        filterTypes: e.filterTypes,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        uid: e.uid,
        url: e.url,
        version: e.version
      };
    }
  };
});

// node_modules/svix/dist/models/eventExampleIn.js
var Go = o((rr) => {
  "use strict";
  Object.defineProperty(rr, "__esModule", { value: !0 });
  rr.EventExampleInSerializer = void 0;
  rr.EventExampleInSerializer = {
    _fromJsonObject(e) {
      return {
        eventType: e.eventType,
        exampleIndex: e.exampleIndex
      };
    },
    _toJsonObject(e) {
      return {
        eventType: e.eventType,
        exampleIndex: e.exampleIndex
      };
    }
  };
});

// node_modules/svix/dist/models/listResponseEndpointOut.js
var Vo = o((ir) => {
  "use strict";
  Object.defineProperty(ir, "__esModule", { value: !0 });
  ir.ListResponseEndpointOutSerializer = void 0;
  var Wo = Ia();
  ir.ListResponseEndpointOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => Wo.EndpointOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => Wo.EndpointOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    }
  };
});

// node_modules/svix/dist/models/messageOut.js
var $e = o((nr) => {
  "use strict";
  Object.defineProperty(nr, "__esModule", { value: !0 });
  nr.MessageOutSerializer = void 0;
  nr.MessageOutSerializer = {
    _fromJsonObject(e) {
      return {
        channels: e.channels,
        deliverAt: e.deliverAt ? new Date(e.deliverAt) : null,
        eventId: e.eventId,
        eventType: e.eventType,
        id: e.id,
        payload: e.payload,
        tags: e.tags,
        timestamp: new Date(e.timestamp)
      };
    },
    _toJsonObject(e) {
      return {
        channels: e.channels,
        deliverAt: e.deliverAt,
        eventId: e.eventId,
        eventType: e.eventType,
        id: e.id,
        payload: e.payload,
        tags: e.tags,
        timestamp: e.timestamp
      };
    }
  };
});

// node_modules/svix/dist/models/recoverIn.js
var Qo = o((ar) => {
  "use strict";
  Object.defineProperty(ar, "__esModule", { value: !0 });
  ar.RecoverInSerializer = void 0;
  ar.RecoverInSerializer = {
    _fromJsonObject(e) {
      return {
        since: new Date(e.since),
        until: e.until ? new Date(e.until) : null
      };
    },
    _toJsonObject(e) {
      return {
        since: e.since,
        until: e.until
      };
    }
  };
});

// node_modules/svix/dist/models/recoverOut.js
var Xo = o((sr) => {
  "use strict";
  Object.defineProperty(sr, "__esModule", { value: !0 });
  sr.RecoverOutSerializer = void 0;
  var Yo = de(), Zo = ce();
  sr.RecoverOutSerializer = {
    _fromJsonObject(e) {
      return {
        id: e.id,
        status: Yo.BackgroundTaskStatusSerializer._fromJsonObject(e.status),
        task: Zo.BackgroundTaskTypeSerializer._fromJsonObject(e.task)
      };
    },
    _toJsonObject(e) {
      return {
        id: e.id,
        status: Yo.BackgroundTaskStatusSerializer._toJsonObject(e.status),
        task: Zo.BackgroundTaskTypeSerializer._toJsonObject(e.task)
      };
    }
  };
});

// node_modules/svix/dist/models/replayIn.js
var eu = o((or) => {
  "use strict";
  Object.defineProperty(or, "__esModule", { value: !0 });
  or.ReplayInSerializer = void 0;
  or.ReplayInSerializer = {
    _fromJsonObject(e) {
      return {
        since: new Date(e.since),
        until: e.until ? new Date(e.until) : null
      };
    },
    _toJsonObject(e) {
      return {
        since: e.since,
        until: e.until
      };
    }
  };
});

// node_modules/svix/dist/models/replayOut.js
var iu = o((ur) => {
  "use strict";
  Object.defineProperty(ur, "__esModule", { value: !0 });
  ur.ReplayOutSerializer = void 0;
  var tu = de(), ru = ce();
  ur.ReplayOutSerializer = {
    _fromJsonObject(e) {
      return {
        id: e.id,
        status: tu.BackgroundTaskStatusSerializer._fromJsonObject(e.status),
        task: ru.BackgroundTaskTypeSerializer._fromJsonObject(e.task)
      };
    },
    _toJsonObject(e) {
      return {
        id: e.id,
        status: tu.BackgroundTaskStatusSerializer._toJsonObject(e.status),
        task: ru.BackgroundTaskTypeSerializer._toJsonObject(e.task)
      };
    }
  };
});

// node_modules/svix/dist/api/endpoint.js
var nu = o((cr) => {
  "use strict";
  Object.defineProperty(cr, "__esModule", { value: !0 });
  cr.Endpoint = void 0;
  var Ff = Ro(), Bf = Ea(), Nf = Ho(), $f = Do(), dr = Ia(), Kf = Lo(), Gf = Uo(), Wf = Ma(), Vf = Fo(), Qf = Bo(), Yf = No(), Zf = $o(), Xf = Ko(), e_ = Go(), t_ = Vo(), r_ = $e(), i_ = Qo(), n_ = Xo(), a_ = eu(), s_ = iu(), h = k(), Aa = class {
    static {
      a(this, "Endpoint");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    list(t, r) {
      let i = new h.SvixRequest(h.HttpMethod.GET, "/api/v1/app/{app_id}/endpoint");
      return i.setPathParam("app_id", t), i.setQueryParams({
        limit: r?.limit,
        iterator: r?.iterator,
        order: r?.order
      }), i.send(this.requestCtx, t_.ListResponseEndpointOutSerializer._fromJsonObject);
    }
    create(t, r, i) {
      let n = new h.SvixRequest(h.HttpMethod.POST, "/api/v1/app/{app_id}/endpoint");
      return n.setPathParam("app_id", t), n.setHeaderParam("idempotency-key", i?.idempotencyKey), n.setBody($f.EndpointInSerializer._toJsonObject(r)), n.send(this.requestCtx, dr.EndpointOutSerializer._fromJsonObject);
    }
    get(t, r) {
      let i = new h.SvixRequest(h.HttpMethod.GET, "/api/v1/app/{app_id}/endpoint/{endpoint_id}");
      return i.setPathParam("app_id", t), i.setPathParam("endpoint_id", r), i.send(this.requestCtx, dr.EndpointOutSerializer._fromJsonObject);
    }
    update(t, r, i) {
      let n = new h.SvixRequest(h.HttpMethod.PUT, "/api/v1/app/{app_id}/endpoint/{endpoint_id}");
      return n.setPathParam("app_id", t), n.setPathParam("endpoint_id", r), n.setBody(Xf.EndpointUpdateSerializer._toJsonObject(i)), n.send(this.requestCtx, dr.EndpointOutSerializer._fromJsonObject);
    }
    delete(t, r) {
      let i = new h.SvixRequest(h.HttpMethod.DELETE, "/api/v1/app/{app_id}/endpoint/{endpoint_id}");
      return i.setPathParam("app_id", t), i.setPathParam("endpoint_id", r), i.sendNoResponseBody(this.requestCtx);
    }
    patch(t, r, i) {
      let n = new h.SvixRequest(h.HttpMethod.PATCH, "/api/v1/app/{app_id}/endpoint/{endpoint_id}");
      return n.setPathParam("app_id", t), n.setPathParam("endpoint_id", r), n.setBody(Kf.EndpointPatchSerializer._toJsonObject(i)), n.send(this.requestCtx, dr.EndpointOutSerializer._fromJsonObject);
    }
    getHeaders(t, r) {
      let i = new h.SvixRequest(h.HttpMethod.GET, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/headers");
      return i.setPathParam("app_id", t), i.setPathParam("endpoint_id", r), i.send(this.requestCtx, Bf.EndpointHeadersOutSerializer._fromJsonObject);
    }
    updateHeaders(t, r, i) {
      let n = new h.SvixRequest(h.HttpMethod.PUT, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/headers");
      return n.setPathParam("app_id", t), n.setPathParam("endpoint_id", r), n.setBody(Ff.EndpointHeadersInSerializer._toJsonObject(i)), n.sendNoResponseBody(this.requestCtx);
    }
    headersUpdate(t, r, i) {
      return this.updateHeaders(t, r, i);
    }
    patchHeaders(t, r, i) {
      let n = new h.SvixRequest(h.HttpMethod.PATCH, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/headers");
      return n.setPathParam("app_id", t), n.setPathParam("endpoint_id", r), n.setBody(Nf.EndpointHeadersPatchInSerializer._toJsonObject(i)), n.sendNoResponseBody(this.requestCtx);
    }
    headersPatch(t, r, i) {
      return this.patchHeaders(t, r, i);
    }
    recover(t, r, i, n) {
      let s = new h.SvixRequest(h.HttpMethod.POST, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/recover");
      return s.setPathParam("app_id", t), s.setPathParam("endpoint_id", r), s.setHeaderParam("idempotency-key", n?.idempotencyKey), s.setBody(i_.RecoverInSerializer._toJsonObject(i)), s.send(this.requestCtx, n_.RecoverOutSerializer._fromJsonObject);
    }
    replayMissing(t, r, i, n) {
      let s = new h.SvixRequest(h.HttpMethod.POST, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/replay-missing");
      return s.setPathParam("app_id", t), s.setPathParam("endpoint_id", r), s.setHeaderParam("idempotency-key", n?.idempotencyKey), s.setBody(a_.ReplayInSerializer._toJsonObject(i)), s.send(this.requestCtx, s_.ReplayOutSerializer._fromJsonObject);
    }
    getSecret(t, r) {
      let i = new h.SvixRequest(h.HttpMethod.GET, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/secret");
      return i.setPathParam("app_id", t), i.setPathParam("endpoint_id", r), i.send(this.requestCtx, Gf.EndpointSecretOutSerializer._fromJsonObject);
    }
    rotateSecret(t, r, i, n) {
      let s = new h.SvixRequest(h.HttpMethod.POST, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/secret/rotate");
      return s.setPathParam("app_id", t), s.setPathParam("endpoint_id", r), s.setHeaderParam("idempotency-key", n?.idempotencyKey), s.setBody(Wf.EndpointSecretRotateInSerializer._toJsonObject(i)), s.sendNoResponseBody(this.requestCtx);
    }
    sendExample(t, r, i, n) {
      let s = new h.SvixRequest(h.HttpMethod.POST, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/send-example");
      return s.setPathParam("app_id", t), s.setPathParam("endpoint_id", r), s.setHeaderParam("idempotency-key", n?.idempotencyKey), s.setBody(e_.EventExampleInSerializer._toJsonObject(i)), s.send(this.requestCtx, r_.MessageOutSerializer._fromJsonObject);
    }
    getStats(t, r, i) {
      let n = new h.SvixRequest(h.HttpMethod.GET, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/stats");
      return n.setPathParam("app_id", t), n.setPathParam("endpoint_id", r), n.setQueryParams({
        since: i?.since,
        until: i?.until
      }), n.send(this.requestCtx, Vf.EndpointStatsSerializer._fromJsonObject);
    }
    transformationGet(t, r) {
      let i = new h.SvixRequest(h.HttpMethod.GET, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/transformation");
      return i.setPathParam("app_id", t), i.setPathParam("endpoint_id", r), i.send(this.requestCtx, Yf.EndpointTransformationOutSerializer._fromJsonObject);
    }
    patchTransformation(t, r, i) {
      let n = new h.SvixRequest(h.HttpMethod.PATCH, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/transformation");
      return n.setPathParam("app_id", t), n.setPathParam("endpoint_id", r), n.setBody(Zf.EndpointTransformationPatchSerializer._toJsonObject(i)), n.sendNoResponseBody(this.requestCtx);
    }
    transformationPartialUpdate(t, r, i) {
      let n = new h.SvixRequest(h.HttpMethod.PATCH, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/transformation");
      return n.setPathParam("app_id", t), n.setPathParam("endpoint_id", r), n.setBody(Qf.EndpointTransformationInSerializer._toJsonObject(i)), n.sendNoResponseBody(this.requestCtx);
    }
  };
  cr.Endpoint = Aa;
});

// node_modules/svix/dist/models/eventTypeIn.js
var Ra = o((lr) => {
  "use strict";
  Object.defineProperty(lr, "__esModule", { value: !0 });
  lr.EventTypeInSerializer = void 0;
  lr.EventTypeInSerializer = {
    _fromJsonObject(e) {
      return {
        archived: e.archived,
        deprecated: e.deprecated,
        description: e.description,
        featureFlag: e.featureFlag,
        featureFlags: e.featureFlags,
        groupName: e.groupName,
        name: e.name,
        schemas: e.schemas
      };
    },
    _toJsonObject(e) {
      return {
        archived: e.archived,
        deprecated: e.deprecated,
        description: e.description,
        featureFlag: e.featureFlag,
        featureFlags: e.featureFlags,
        groupName: e.groupName,
        name: e.name,
        schemas: e.schemas
      };
    }
  };
});

// node_modules/svix/dist/models/environmentIn.js
var ou = o((pr) => {
  "use strict";
  Object.defineProperty(pr, "__esModule", { value: !0 });
  pr.EnvironmentInSerializer = void 0;
  var au = wa(), su = Ra();
  pr.EnvironmentInSerializer = {
    _fromJsonObject(e) {
      var t, r;
      return {
        connectors: (t = e.connectors) === null || t === void 0 ? void 0 : t.map((i) => au.ConnectorInSerializer._fromJsonObject(i)),
        eventTypes: (r = e.eventTypes) === null || r === void 0 ? void 0 : r.map((i) => su.EventTypeInSerializer._fromJsonObject(i)),
        settings: e.settings
      };
    },
    _toJsonObject(e) {
      var t, r;
      return {
        connectors: (t = e.connectors) === null || t === void 0 ? void 0 : t.map((i) => au.ConnectorInSerializer._toJsonObject(i)),
        eventTypes: (r = e.eventTypes) === null || r === void 0 ? void 0 : r.map((i) => su.EventTypeInSerializer._toJsonObject(i)),
        settings: e.settings
      };
    }
  };
});

// node_modules/svix/dist/models/eventTypeOut.js
var fr = o((mr) => {
  "use strict";
  Object.defineProperty(mr, "__esModule", { value: !0 });
  mr.EventTypeOutSerializer = void 0;
  mr.EventTypeOutSerializer = {
    _fromJsonObject(e) {
      return {
        archived: e.archived,
        createdAt: new Date(e.createdAt),
        deprecated: e.deprecated,
        description: e.description,
        featureFlag: e.featureFlag,
        featureFlags: e.featureFlags,
        groupName: e.groupName,
        name: e.name,
        schemas: e.schemas,
        updatedAt: new Date(e.updatedAt)
      };
    },
    _toJsonObject(e) {
      return {
        archived: e.archived,
        createdAt: e.createdAt,
        deprecated: e.deprecated,
        description: e.description,
        featureFlag: e.featureFlag,
        featureFlags: e.featureFlags,
        groupName: e.groupName,
        name: e.name,
        schemas: e.schemas,
        updatedAt: e.updatedAt
      };
    }
  };
});

// node_modules/svix/dist/models/environmentOut.js
var cu = o((_r) => {
  "use strict";
  Object.defineProperty(_r, "__esModule", { value: !0 });
  _r.EnvironmentOutSerializer = void 0;
  var uu = Rt(), du = fr();
  _r.EnvironmentOutSerializer = {
    _fromJsonObject(e) {
      return {
        connectors: e.connectors.map((t) => uu.ConnectorOutSerializer._fromJsonObject(t)),
        createdAt: new Date(e.createdAt),
        eventTypes: e.eventTypes.map((t) => du.EventTypeOutSerializer._fromJsonObject(t)),
        settings: e.settings,
        version: e.version
      };
    },
    _toJsonObject(e) {
      return {
        connectors: e.connectors.map((t) => uu.ConnectorOutSerializer._toJsonObject(t)),
        createdAt: e.createdAt,
        eventTypes: e.eventTypes.map((t) => du.EventTypeOutSerializer._toJsonObject(t)),
        settings: e.settings,
        version: e.version
      };
    }
  };
});

// node_modules/svix/dist/api/environment.js
var lu = o((vr) => {
  "use strict";
  Object.defineProperty(vr, "__esModule", { value: !0 });
  vr.Environment = void 0;
  var o_ = ou(), u_ = cu(), gr = k(), Ha = class {
    static {
      a(this, "Environment");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    export(t) {
      let r = new gr.SvixRequest(gr.HttpMethod.POST, "/api/v1/environment/export");
      return r.setHeaderParam("idempotency-key", t?.idempotencyKey), r.send(this.requestCtx, u_.EnvironmentOutSerializer._fromJsonObject);
    }
    import(t, r) {
      let i = new gr.SvixRequest(gr.HttpMethod.POST, "/api/v1/environment/import");
      return i.setHeaderParam("idempotency-key", r?.idempotencyKey), i.setBody(o_.EnvironmentInSerializer._toJsonObject(t)), i.sendNoResponseBody(this.requestCtx);
    }
  };
  vr.Environment = Ha;
});

// node_modules/svix/dist/models/eventTypeImportOpenApiIn.js
var pu = o((hr) => {
  "use strict";
  Object.defineProperty(hr, "__esModule", { value: !0 });
  hr.EventTypeImportOpenApiInSerializer = void 0;
  hr.EventTypeImportOpenApiInSerializer = {
    _fromJsonObject(e) {
      return {
        dryRun: e.dryRun,
        replaceAll: e.replaceAll,
        spec: e.spec,
        specRaw: e.specRaw
      };
    },
    _toJsonObject(e) {
      return {
        dryRun: e.dryRun,
        replaceAll: e.replaceAll,
        spec: e.spec,
        specRaw: e.specRaw
      };
    }
  };
});

// node_modules/svix/dist/models/eventTypeFromOpenApi.js
var mu = o((Or) => {
  "use strict";
  Object.defineProperty(Or, "__esModule", { value: !0 });
  Or.EventTypeFromOpenApiSerializer = void 0;
  Or.EventTypeFromOpenApiSerializer = {
    _fromJsonObject(e) {
      return {
        deprecated: e.deprecated,
        description: e.description,
        featureFlag: e.featureFlag,
        featureFlags: e.featureFlags,
        groupName: e.groupName,
        name: e.name,
        schemas: e.schemas
      };
    },
    _toJsonObject(e) {
      return {
        deprecated: e.deprecated,
        description: e.description,
        featureFlag: e.featureFlag,
        featureFlags: e.featureFlags,
        groupName: e.groupName,
        name: e.name,
        schemas: e.schemas
      };
    }
  };
});

// node_modules/svix/dist/models/eventTypeImportOpenApiOutData.js
var _u = o((Sr) => {
  "use strict";
  Object.defineProperty(Sr, "__esModule", { value: !0 });
  Sr.EventTypeImportOpenApiOutDataSerializer = void 0;
  var fu = mu();
  Sr.EventTypeImportOpenApiOutDataSerializer = {
    _fromJsonObject(e) {
      var t;
      return {
        modified: e.modified,
        toModify: (t = e.to_modify) === null || t === void 0 ? void 0 : t.map((r) => fu.EventTypeFromOpenApiSerializer._fromJsonObject(r))
      };
    },
    _toJsonObject(e) {
      var t;
      return {
        modified: e.modified,
        to_modify: (t = e.toModify) === null || t === void 0 ? void 0 : t.map((r) => fu.EventTypeFromOpenApiSerializer._toJsonObject(r))
      };
    }
  };
});

// node_modules/svix/dist/models/eventTypeImportOpenApiOut.js
var vu = o((yr) => {
  "use strict";
  Object.defineProperty(yr, "__esModule", { value: !0 });
  yr.EventTypeImportOpenApiOutSerializer = void 0;
  var gu = _u();
  yr.EventTypeImportOpenApiOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: gu.EventTypeImportOpenApiOutDataSerializer._fromJsonObject(e.data)
      };
    },
    _toJsonObject(e) {
      return {
        data: gu.EventTypeImportOpenApiOutDataSerializer._toJsonObject(e.data)
      };
    }
  };
});

// node_modules/svix/dist/models/eventTypePatch.js
var hu = o((br) => {
  "use strict";
  Object.defineProperty(br, "__esModule", { value: !0 });
  br.EventTypePatchSerializer = void 0;
  br.EventTypePatchSerializer = {
    _fromJsonObject(e) {
      return {
        archived: e.archived,
        deprecated: e.deprecated,
        description: e.description,
        featureFlag: e.featureFlag,
        featureFlags: e.featureFlags,
        groupName: e.groupName,
        schemas: e.schemas
      };
    },
    _toJsonObject(e) {
      return {
        archived: e.archived,
        deprecated: e.deprecated,
        description: e.description,
        featureFlag: e.featureFlag,
        featureFlags: e.featureFlags,
        groupName: e.groupName,
        schemas: e.schemas
      };
    }
  };
});

// node_modules/svix/dist/models/eventTypeUpdate.js
var Ou = o((Pr) => {
  "use strict";
  Object.defineProperty(Pr, "__esModule", { value: !0 });
  Pr.EventTypeUpdateSerializer = void 0;
  Pr.EventTypeUpdateSerializer = {
    _fromJsonObject(e) {
      return {
        archived: e.archived,
        deprecated: e.deprecated,
        description: e.description,
        featureFlag: e.featureFlag,
        featureFlags: e.featureFlags,
        groupName: e.groupName,
        schemas: e.schemas
      };
    },
    _toJsonObject(e) {
      return {
        archived: e.archived,
        deprecated: e.deprecated,
        description: e.description,
        featureFlag: e.featureFlag,
        featureFlags: e.featureFlags,
        groupName: e.groupName,
        schemas: e.schemas
      };
    }
  };
});

// node_modules/svix/dist/models/listResponseEventTypeOut.js
var yu = o((qr) => {
  "use strict";
  Object.defineProperty(qr, "__esModule", { value: !0 });
  qr.ListResponseEventTypeOutSerializer = void 0;
  var Su = fr();
  qr.ListResponseEventTypeOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => Su.EventTypeOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => Su.EventTypeOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    }
  };
});

// node_modules/svix/dist/api/eventType.js
var bu = o((xr) => {
  "use strict";
  Object.defineProperty(xr, "__esModule", { value: !0 });
  xr.EventType = void 0;
  var d_ = pu(), c_ = vu(), l_ = Ra(), zr = fr(), p_ = hu(), m_ = Ou(), f_ = yu(), G = k(), Da = class {
    static {
      a(this, "EventType");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    list(t) {
      let r = new G.SvixRequest(G.HttpMethod.GET, "/api/v1/event-type");
      return r.setQueryParams({
        limit: t?.limit,
        iterator: t?.iterator,
        order: t?.order,
        include_archived: t?.includeArchived,
        with_content: t?.withContent
      }), r.send(this.requestCtx, f_.ListResponseEventTypeOutSerializer._fromJsonObject);
    }
    create(t, r) {
      let i = new G.SvixRequest(G.HttpMethod.POST, "/api/v1/event-type");
      return i.setHeaderParam("idempotency-key", r?.idempotencyKey), i.setBody(l_.EventTypeInSerializer._toJsonObject(t)), i.send(this.requestCtx, zr.EventTypeOutSerializer._fromJsonObject);
    }
    importOpenapi(t, r) {
      let i = new G.SvixRequest(G.HttpMethod.POST, "/api/v1/event-type/import/openapi");
      return i.setHeaderParam("idempotency-key", r?.idempotencyKey), i.setBody(d_.EventTypeImportOpenApiInSerializer._toJsonObject(t)), i.send(this.requestCtx, c_.EventTypeImportOpenApiOutSerializer._fromJsonObject);
    }
    get(t) {
      let r = new G.SvixRequest(G.HttpMethod.GET, "/api/v1/event-type/{event_type_name}");
      return r.setPathParam("event_type_name", t), r.send(this.requestCtx, zr.EventTypeOutSerializer._fromJsonObject);
    }
    update(t, r) {
      let i = new G.SvixRequest(G.HttpMethod.PUT, "/api/v1/event-type/{event_type_name}");
      return i.setPathParam("event_type_name", t), i.setBody(m_.EventTypeUpdateSerializer._toJsonObject(r)), i.send(this.requestCtx, zr.EventTypeOutSerializer._fromJsonObject);
    }
    delete(t, r) {
      let i = new G.SvixRequest(G.HttpMethod.DELETE, "/api/v1/event-type/{event_type_name}");
      return i.setPathParam("event_type_name", t), i.setQueryParams({
        expunge: r?.expunge
      }), i.sendNoResponseBody(this.requestCtx);
    }
    patch(t, r) {
      let i = new G.SvixRequest(G.HttpMethod.PATCH, "/api/v1/event-type/{event_type_name}");
      return i.setPathParam("event_type_name", t), i.setBody(p_.EventTypePatchSerializer._toJsonObject(r)), i.send(this.requestCtx, zr.EventTypeOutSerializer._fromJsonObject);
    }
  };
  xr.EventType = Da;
});

// node_modules/svix/dist/api/health.js
var qu = o((Jr) => {
  "use strict";
  Object.defineProperty(Jr, "__esModule", { value: !0 });
  Jr.Health = void 0;
  var Pu = k(), La = class {
    static {
      a(this, "Health");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    get() {
      return new Pu.SvixRequest(Pu.HttpMethod.GET, "/api/v1/health").sendNoResponseBody(this.requestCtx);
    }
  };
  Jr.Health = La;
});

// node_modules/svix/dist/models/ingestSourceConsumerPortalAccessIn.js
var zu = o((kr) => {
  "use strict";
  Object.defineProperty(kr, "__esModule", { value: !0 });
  kr.IngestSourceConsumerPortalAccessInSerializer = void 0;
  kr.IngestSourceConsumerPortalAccessInSerializer = {
    _fromJsonObject(e) {
      return {
        expiry: e.expiry,
        readOnly: e.readOnly
      };
    },
    _toJsonObject(e) {
      return {
        expiry: e.expiry,
        readOnly: e.readOnly
      };
    }
  };
});

// node_modules/svix/dist/models/ingestEndpointHeadersIn.js
var xu = o((Cr) => {
  "use strict";
  Object.defineProperty(Cr, "__esModule", { value: !0 });
  Cr.IngestEndpointHeadersInSerializer = void 0;
  Cr.IngestEndpointHeadersInSerializer = {
    _fromJsonObject(e) {
      return {
        headers: e.headers
      };
    },
    _toJsonObject(e) {
      return {
        headers: e.headers
      };
    }
  };
});

// node_modules/svix/dist/models/ingestEndpointHeadersOut.js
var Ju = o((Tr) => {
  "use strict";
  Object.defineProperty(Tr, "__esModule", { value: !0 });
  Tr.IngestEndpointHeadersOutSerializer = void 0;
  Tr.IngestEndpointHeadersOutSerializer = {
    _fromJsonObject(e) {
      return {
        headers: e.headers,
        sensitive: e.sensitive
      };
    },
    _toJsonObject(e) {
      return {
        headers: e.headers,
        sensitive: e.sensitive
      };
    }
  };
});

// node_modules/svix/dist/models/ingestEndpointIn.js
var ku = o((wr) => {
  "use strict";
  Object.defineProperty(wr, "__esModule", { value: !0 });
  wr.IngestEndpointInSerializer = void 0;
  wr.IngestEndpointInSerializer = {
    _fromJsonObject(e) {
      return {
        description: e.description,
        disabled: e.disabled,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        secret: e.secret,
        uid: e.uid,
        url: e.url
      };
    },
    _toJsonObject(e) {
      return {
        description: e.description,
        disabled: e.disabled,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        secret: e.secret,
        uid: e.uid,
        url: e.url
      };
    }
  };
});

// node_modules/svix/dist/models/ingestEndpointOut.js
var Ua = o((jr) => {
  "use strict";
  Object.defineProperty(jr, "__esModule", { value: !0 });
  jr.IngestEndpointOutSerializer = void 0;
  jr.IngestEndpointOutSerializer = {
    _fromJsonObject(e) {
      return {
        createdAt: new Date(e.createdAt),
        description: e.description,
        disabled: e.disabled,
        id: e.id,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        uid: e.uid,
        updatedAt: new Date(e.updatedAt),
        url: e.url
      };
    },
    _toJsonObject(e) {
      return {
        createdAt: e.createdAt,
        description: e.description,
        disabled: e.disabled,
        id: e.id,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        uid: e.uid,
        updatedAt: e.updatedAt,
        url: e.url
      };
    }
  };
});

// node_modules/svix/dist/models/ingestEndpointSecretIn.js
var Cu = o((Er) => {
  "use strict";
  Object.defineProperty(Er, "__esModule", { value: !0 });
  Er.IngestEndpointSecretInSerializer = void 0;
  Er.IngestEndpointSecretInSerializer = {
    _fromJsonObject(e) {
      return {
        key: e.key
      };
    },
    _toJsonObject(e) {
      return {
        key: e.key
      };
    }
  };
});

// node_modules/svix/dist/models/ingestEndpointSecretOut.js
var Tu = o((Ir) => {
  "use strict";
  Object.defineProperty(Ir, "__esModule", { value: !0 });
  Ir.IngestEndpointSecretOutSerializer = void 0;
  Ir.IngestEndpointSecretOutSerializer = {
    _fromJsonObject(e) {
      return {
        key: e.key
      };
    },
    _toJsonObject(e) {
      return {
        key: e.key
      };
    }
  };
});

// node_modules/svix/dist/models/ingestEndpointTransformationOut.js
var wu = o((Mr) => {
  "use strict";
  Object.defineProperty(Mr, "__esModule", { value: !0 });
  Mr.IngestEndpointTransformationOutSerializer = void 0;
  Mr.IngestEndpointTransformationOutSerializer = {
    _fromJsonObject(e) {
      return {
        code: e.code,
        enabled: e.enabled
      };
    },
    _toJsonObject(e) {
      return {
        code: e.code,
        enabled: e.enabled
      };
    }
  };
});

// node_modules/svix/dist/models/ingestEndpointTransformationPatch.js
var ju = o((Ar) => {
  "use strict";
  Object.defineProperty(Ar, "__esModule", { value: !0 });
  Ar.IngestEndpointTransformationPatchSerializer = void 0;
  Ar.IngestEndpointTransformationPatchSerializer = {
    _fromJsonObject(e) {
      return {
        code: e.code,
        enabled: e.enabled
      };
    },
    _toJsonObject(e) {
      return {
        code: e.code,
        enabled: e.enabled
      };
    }
  };
});

// node_modules/svix/dist/models/ingestEndpointUpdate.js
var Eu = o((Rr) => {
  "use strict";
  Object.defineProperty(Rr, "__esModule", { value: !0 });
  Rr.IngestEndpointUpdateSerializer = void 0;
  Rr.IngestEndpointUpdateSerializer = {
    _fromJsonObject(e) {
      return {
        description: e.description,
        disabled: e.disabled,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        uid: e.uid,
        url: e.url
      };
    },
    _toJsonObject(e) {
      return {
        description: e.description,
        disabled: e.disabled,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        uid: e.uid,
        url: e.url
      };
    }
  };
});

// node_modules/svix/dist/models/listResponseIngestEndpointOut.js
var Mu = o((Hr) => {
  "use strict";
  Object.defineProperty(Hr, "__esModule", { value: !0 });
  Hr.ListResponseIngestEndpointOutSerializer = void 0;
  var Iu = Ua();
  Hr.ListResponseIngestEndpointOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => Iu.IngestEndpointOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => Iu.IngestEndpointOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    }
  };
});

// node_modules/svix/dist/api/ingestEndpoint.js
var Au = o((Dr) => {
  "use strict";
  Object.defineProperty(Dr, "__esModule", { value: !0 });
  Dr.IngestEndpoint = void 0;
  var __ = xu(), g_ = Ju(), v_ = ku(), Fa = Ua(), h_ = Cu(), O_ = Tu(), S_ = wu(), y_ = ju(), b_ = Eu(), P_ = Mu(), C = k(), Ba = class {
    static {
      a(this, "IngestEndpoint");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    list(t, r) {
      let i = new C.SvixRequest(C.HttpMethod.GET, "/ingest/api/v1/source/{source_id}/endpoint");
      return i.setPathParam("source_id", t), i.setQueryParams({
        limit: r?.limit,
        iterator: r?.iterator,
        order: r?.order
      }), i.send(this.requestCtx, P_.ListResponseIngestEndpointOutSerializer._fromJsonObject);
    }
    create(t, r, i) {
      let n = new C.SvixRequest(C.HttpMethod.POST, "/ingest/api/v1/source/{source_id}/endpoint");
      return n.setPathParam("source_id", t), n.setHeaderParam("idempotency-key", i?.idempotencyKey), n.setBody(v_.IngestEndpointInSerializer._toJsonObject(r)), n.send(this.requestCtx, Fa.IngestEndpointOutSerializer._fromJsonObject);
    }
    get(t, r) {
      let i = new C.SvixRequest(C.HttpMethod.GET, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}");
      return i.setPathParam("source_id", t), i.setPathParam("endpoint_id", r), i.send(this.requestCtx, Fa.IngestEndpointOutSerializer._fromJsonObject);
    }
    update(t, r, i) {
      let n = new C.SvixRequest(C.HttpMethod.PUT, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}");
      return n.setPathParam("source_id", t), n.setPathParam("endpoint_id", r), n.setBody(b_.IngestEndpointUpdateSerializer._toJsonObject(i)), n.send(this.requestCtx, Fa.IngestEndpointOutSerializer._fromJsonObject);
    }
    delete(t, r) {
      let i = new C.SvixRequest(C.HttpMethod.DELETE, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}");
      return i.setPathParam("source_id", t), i.setPathParam("endpoint_id", r), i.sendNoResponseBody(this.requestCtx);
    }
    getHeaders(t, r) {
      let i = new C.SvixRequest(C.HttpMethod.GET, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}/headers");
      return i.setPathParam("source_id", t), i.setPathParam("endpoint_id", r), i.send(this.requestCtx, g_.IngestEndpointHeadersOutSerializer._fromJsonObject);
    }
    updateHeaders(t, r, i) {
      let n = new C.SvixRequest(C.HttpMethod.PUT, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}/headers");
      return n.setPathParam("source_id", t), n.setPathParam("endpoint_id", r), n.setBody(__.IngestEndpointHeadersInSerializer._toJsonObject(i)), n.sendNoResponseBody(this.requestCtx);
    }
    getSecret(t, r) {
      let i = new C.SvixRequest(C.HttpMethod.GET, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}/secret");
      return i.setPathParam("source_id", t), i.setPathParam("endpoint_id", r), i.send(this.requestCtx, O_.IngestEndpointSecretOutSerializer._fromJsonObject);
    }
    rotateSecret(t, r, i, n) {
      let s = new C.SvixRequest(C.HttpMethod.POST, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}/secret/rotate");
      return s.setPathParam("source_id", t), s.setPathParam("endpoint_id", r), s.setHeaderParam("idempotency-key", n?.idempotencyKey), s.setBody(h_.IngestEndpointSecretInSerializer._toJsonObject(i)), s.sendNoResponseBody(this.requestCtx);
    }
    getTransformation(t, r) {
      let i = new C.SvixRequest(C.HttpMethod.GET, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}/transformation");
      return i.setPathParam("source_id", t), i.setPathParam("endpoint_id", r), i.send(this.requestCtx, S_.IngestEndpointTransformationOutSerializer._fromJsonObject);
    }
    setTransformation(t, r, i) {
      let n = new C.SvixRequest(C.HttpMethod.PATCH, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}/transformation");
      return n.setPathParam("source_id", t), n.setPathParam("endpoint_id", r), n.setBody(y_.IngestEndpointTransformationPatchSerializer._toJsonObject(i)), n.sendNoResponseBody(this.requestCtx);
    }
  };
  Dr.IngestEndpoint = Ba;
});

// node_modules/svix/dist/models/adobeSignConfig.js
var Ru = o((Lr) => {
  "use strict";
  Object.defineProperty(Lr, "__esModule", { value: !0 });
  Lr.AdobeSignConfigSerializer = void 0;
  Lr.AdobeSignConfigSerializer = {
    _fromJsonObject(e) {
      return {
        clientId: e.clientId
      };
    },
    _toJsonObject(e) {
      return {
        clientId: e.clientId
      };
    }
  };
});

// node_modules/svix/dist/models/airwallexConfig.js
var Hu = o((Ur) => {
  "use strict";
  Object.defineProperty(Ur, "__esModule", { value: !0 });
  Ur.AirwallexConfigSerializer = void 0;
  Ur.AirwallexConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/checkbookConfig.js
var Du = o((Fr) => {
  "use strict";
  Object.defineProperty(Fr, "__esModule", { value: !0 });
  Fr.CheckbookConfigSerializer = void 0;
  Fr.CheckbookConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/cronConfig.js
var Na = o((Br) => {
  "use strict";
  Object.defineProperty(Br, "__esModule", { value: !0 });
  Br.CronConfigSerializer = void 0;
  Br.CronConfigSerializer = {
    _fromJsonObject(e) {
      return {
        contentType: e.contentType,
        payload: e.payload,
        schedule: e.schedule
      };
    },
    _toJsonObject(e) {
      return {
        contentType: e.contentType,
        payload: e.payload,
        schedule: e.schedule
      };
    }
  };
});

// node_modules/svix/dist/models/docusignConfig.js
var Lu = o((Nr) => {
  "use strict";
  Object.defineProperty(Nr, "__esModule", { value: !0 });
  Nr.DocusignConfigSerializer = void 0;
  Nr.DocusignConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/easypostConfig.js
var Uu = o(($r) => {
  "use strict";
  Object.defineProperty($r, "__esModule", { value: !0 });
  $r.EasypostConfigSerializer = void 0;
  $r.EasypostConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/githubConfig.js
var Fu = o((Kr) => {
  "use strict";
  Object.defineProperty(Kr, "__esModule", { value: !0 });
  Kr.GithubConfigSerializer = void 0;
  Kr.GithubConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/hubspotConfig.js
var Bu = o((Gr) => {
  "use strict";
  Object.defineProperty(Gr, "__esModule", { value: !0 });
  Gr.HubspotConfigSerializer = void 0;
  Gr.HubspotConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/orumIoConfig.js
var Nu = o((Wr) => {
  "use strict";
  Object.defineProperty(Wr, "__esModule", { value: !0 });
  Wr.OrumIoConfigSerializer = void 0;
  Wr.OrumIoConfigSerializer = {
    _fromJsonObject(e) {
      return {
        publicKey: e.publicKey
      };
    },
    _toJsonObject(e) {
      return {
        publicKey: e.publicKey
      };
    }
  };
});

// node_modules/svix/dist/models/pandaDocConfig.js
var $u = o((Vr) => {
  "use strict";
  Object.defineProperty(Vr, "__esModule", { value: !0 });
  Vr.PandaDocConfigSerializer = void 0;
  Vr.PandaDocConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/portIoConfig.js
var Ku = o((Qr) => {
  "use strict";
  Object.defineProperty(Qr, "__esModule", { value: !0 });
  Qr.PortIoConfigSerializer = void 0;
  Qr.PortIoConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/rutterConfig.js
var Gu = o((Yr) => {
  "use strict";
  Object.defineProperty(Yr, "__esModule", { value: !0 });
  Yr.RutterConfigSerializer = void 0;
  Yr.RutterConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/segmentConfig.js
var Wu = o((Zr) => {
  "use strict";
  Object.defineProperty(Zr, "__esModule", { value: !0 });
  Zr.SegmentConfigSerializer = void 0;
  Zr.SegmentConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/shopifyConfig.js
var Vu = o((Xr) => {
  "use strict";
  Object.defineProperty(Xr, "__esModule", { value: !0 });
  Xr.ShopifyConfigSerializer = void 0;
  Xr.ShopifyConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/slackConfig.js
var Qu = o((ei) => {
  "use strict";
  Object.defineProperty(ei, "__esModule", { value: !0 });
  ei.SlackConfigSerializer = void 0;
  ei.SlackConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/stripeConfig.js
var Yu = o((ti) => {
  "use strict";
  Object.defineProperty(ti, "__esModule", { value: !0 });
  ti.StripeConfigSerializer = void 0;
  ti.StripeConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/svixConfig.js
var Zu = o((ri) => {
  "use strict";
  Object.defineProperty(ri, "__esModule", { value: !0 });
  ri.SvixConfigSerializer = void 0;
  ri.SvixConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/telnyxConfig.js
var Xu = o((ii) => {
  "use strict";
  Object.defineProperty(ii, "__esModule", { value: !0 });
  ii.TelnyxConfigSerializer = void 0;
  ii.TelnyxConfigSerializer = {
    _fromJsonObject(e) {
      return {
        publicKey: e.publicKey
      };
    },
    _toJsonObject(e) {
      return {
        publicKey: e.publicKey
      };
    }
  };
});

// node_modules/svix/dist/models/vapiConfig.js
var ed = o((ni) => {
  "use strict";
  Object.defineProperty(ni, "__esModule", { value: !0 });
  ni.VapiConfigSerializer = void 0;
  ni.VapiConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/veriffConfig.js
var td = o((ai) => {
  "use strict";
  Object.defineProperty(ai, "__esModule", { value: !0 });
  ai.VeriffConfigSerializer = void 0;
  ai.VeriffConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/zoomConfig.js
var rd = o((si) => {
  "use strict";
  Object.defineProperty(si, "__esModule", { value: !0 });
  si.ZoomConfigSerializer = void 0;
  si.ZoomConfigSerializer = {
    _fromJsonObject(e) {
      return {
        secret: e.secret
      };
    },
    _toJsonObject(e) {
      return {
        secret: e.secret
      };
    }
  };
});

// node_modules/svix/dist/models/ingestSourceIn.js
var Pd = o((oi) => {
  "use strict";
  Object.defineProperty(oi, "__esModule", { value: !0 });
  oi.IngestSourceInSerializer = void 0;
  var id = Ru(), nd = Hu(), ad = Du(), sd = Na(), od = Lu(), ud = Uu(), dd = Fu(), cd = Bu(), ld = Nu(), pd = $u(), md = Ku(), fd = Gu(), _d = Wu(), gd = Vu(), vd = Qu(), hd = Yu(), y = Zu(), Od = Xu(), Sd = ed(), yd = td(), bd = rd();
  oi.IngestSourceInSerializer = {
    _fromJsonObject(e) {
      let t = e.type;
      function r(i) {
        switch (i) {
          case "generic-webhook":
            return {};
          case "cron":
            return sd.CronConfigSerializer._fromJsonObject(e.config);
          case "adobe-sign":
            return id.AdobeSignConfigSerializer._fromJsonObject(e.config);
          case "beehiiv":
            return y.SvixConfigSerializer._fromJsonObject(e.config);
          case "brex":
            return y.SvixConfigSerializer._fromJsonObject(e.config);
          case "checkbook":
            return ad.CheckbookConfigSerializer._fromJsonObject(e.config);
          case "clerk":
            return y.SvixConfigSerializer._fromJsonObject(e.config);
          case "docusign":
            return od.DocusignConfigSerializer._fromJsonObject(e.config);
          case "easypost":
            return ud.EasypostConfigSerializer._fromJsonObject(e.config);
          case "github":
            return dd.GithubConfigSerializer._fromJsonObject(e.config);
          case "guesty":
            return y.SvixConfigSerializer._fromJsonObject(e.config);
          case "hubspot":
            return cd.HubspotConfigSerializer._fromJsonObject(e.config);
          case "incident-io":
            return y.SvixConfigSerializer._fromJsonObject(e.config);
          case "lithic":
            return y.SvixConfigSerializer._fromJsonObject(e.config);
          case "nash":
            return y.SvixConfigSerializer._fromJsonObject(e.config);
          case "orum-io":
            return ld.OrumIoConfigSerializer._fromJsonObject(e.config);
          case "panda-doc":
            return pd.PandaDocConfigSerializer._fromJsonObject(e.config);
          case "port-io":
            return md.PortIoConfigSerializer._fromJsonObject(e.config);
          case "pleo":
            return y.SvixConfigSerializer._fromJsonObject(e.config);
          case "replicate":
            return y.SvixConfigSerializer._fromJsonObject(e.config);
          case "resend":
            return y.SvixConfigSerializer._fromJsonObject(e.config);
          case "rutter":
            return fd.RutterConfigSerializer._fromJsonObject(e.config);
          case "safebase":
            return y.SvixConfigSerializer._fromJsonObject(e.config);
          case "sardine":
            return y.SvixConfigSerializer._fromJsonObject(e.config);
          case "segment":
            return _d.SegmentConfigSerializer._fromJsonObject(e.config);
          case "shopify":
            return gd.ShopifyConfigSerializer._fromJsonObject(e.config);
          case "slack":
            return vd.SlackConfigSerializer._fromJsonObject(e.config);
          case "stripe":
            return hd.StripeConfigSerializer._fromJsonObject(e.config);
          case "stych":
            return y.SvixConfigSerializer._fromJsonObject(e.config);
          case "svix":
            return y.SvixConfigSerializer._fromJsonObject(e.config);
          case "zoom":
            return bd.ZoomConfigSerializer._fromJsonObject(e.config);
          case "telnyx":
            return Od.TelnyxConfigSerializer._fromJsonObject(e.config);
          case "vapi":
            return Sd.VapiConfigSerializer._fromJsonObject(e.config);
          case "open-ai":
            return y.SvixConfigSerializer._fromJsonObject(e.config);
          case "render":
            return y.SvixConfigSerializer._fromJsonObject(e.config);
          case "veriff":
            return yd.VeriffConfigSerializer._fromJsonObject(e.config);
          case "airwallex":
            return nd.AirwallexConfigSerializer._fromJsonObject(e.config);
          default:
            throw new Error(`Unexpected type: ${i}`);
        }
      }
      return a(r, "getConfig"), {
        type: t,
        config: r(t),
        metadata: e.metadata,
        name: e.name,
        uid: e.uid
      };
    },
    _toJsonObject(e) {
      let t;
      switch (e.type) {
        case "generic-webhook":
          t = {};
          break;
        case "cron":
          t = sd.CronConfigSerializer._toJsonObject(e.config);
          break;
        case "adobe-sign":
          t = id.AdobeSignConfigSerializer._toJsonObject(e.config);
          break;
        case "beehiiv":
          t = y.SvixConfigSerializer._toJsonObject(e.config);
          break;
        case "brex":
          t = y.SvixConfigSerializer._toJsonObject(e.config);
          break;
        case "checkbook":
          t = ad.CheckbookConfigSerializer._toJsonObject(e.config);
          break;
        case "clerk":
          t = y.SvixConfigSerializer._toJsonObject(e.config);
          break;
        case "docusign":
          t = od.DocusignConfigSerializer._toJsonObject(e.config);
          break;
        case "easypost":
          t = ud.EasypostConfigSerializer._toJsonObject(e.config);
          break;
        case "github":
          t = dd.GithubConfigSerializer._toJsonObject(e.config);
          break;
        case "guesty":
          t = y.SvixConfigSerializer._toJsonObject(e.config);
          break;
        case "hubspot":
          t = cd.HubspotConfigSerializer._toJsonObject(e.config);
          break;
        case "incident-io":
          t = y.SvixConfigSerializer._toJsonObject(e.config);
          break;
        case "lithic":
          t = y.SvixConfigSerializer._toJsonObject(e.config);
          break;
        case "nash":
          t = y.SvixConfigSerializer._toJsonObject(e.config);
          break;
        case "orum-io":
          t = ld.OrumIoConfigSerializer._toJsonObject(e.config);
          break;
        case "panda-doc":
          t = pd.PandaDocConfigSerializer._toJsonObject(e.config);
          break;
        case "port-io":
          t = md.PortIoConfigSerializer._toJsonObject(e.config);
          break;
        case "pleo":
          t = y.SvixConfigSerializer._toJsonObject(e.config);
          break;
        case "replicate":
          t = y.SvixConfigSerializer._toJsonObject(e.config);
          break;
        case "resend":
          t = y.SvixConfigSerializer._toJsonObject(e.config);
          break;
        case "rutter":
          t = fd.RutterConfigSerializer._toJsonObject(e.config);
          break;
        case "safebase":
          t = y.SvixConfigSerializer._toJsonObject(e.config);
          break;
        case "sardine":
          t = y.SvixConfigSerializer._toJsonObject(e.config);
          break;
        case "segment":
          t = _d.SegmentConfigSerializer._toJsonObject(e.config);
          break;
        case "shopify":
          t = gd.ShopifyConfigSerializer._toJsonObject(e.config);
          break;
        case "slack":
          t = vd.SlackConfigSerializer._toJsonObject(e.config);
          break;
        case "stripe":
          t = hd.StripeConfigSerializer._toJsonObject(e.config);
          break;
        case "stych":
          t = y.SvixConfigSerializer._toJsonObject(e.config);
          break;
        case "svix":
          t = y.SvixConfigSerializer._toJsonObject(e.config);
          break;
        case "zoom":
          t = bd.ZoomConfigSerializer._toJsonObject(e.config);
          break;
        case "telnyx":
          t = Od.TelnyxConfigSerializer._toJsonObject(e.config);
          break;
        case "vapi":
          t = Sd.VapiConfigSerializer._toJsonObject(e.config);
          break;
        case "open-ai":
          t = y.SvixConfigSerializer._toJsonObject(e.config);
          break;
        case "render":
          t = y.SvixConfigSerializer._toJsonObject(e.config);
          break;
        case "veriff":
          t = yd.VeriffConfigSerializer._toJsonObject(e.config);
          break;
        case "airwallex":
          t = nd.AirwallexConfigSerializer._toJsonObject(e.config);
          break;
      }
      return {
        type: e.type,
        config: t,
        metadata: e.metadata,
        name: e.name,
        uid: e.uid
      };
    }
  };
});

// node_modules/svix/dist/models/adobeSignConfigOut.js
var qd = o((ui) => {
  "use strict";
  Object.defineProperty(ui, "__esModule", { value: !0 });
  ui.AdobeSignConfigOutSerializer = void 0;
  ui.AdobeSignConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/airwallexConfigOut.js
var zd = o((di) => {
  "use strict";
  Object.defineProperty(di, "__esModule", { value: !0 });
  di.AirwallexConfigOutSerializer = void 0;
  di.AirwallexConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/checkbookConfigOut.js
var xd = o((ci) => {
  "use strict";
  Object.defineProperty(ci, "__esModule", { value: !0 });
  ci.CheckbookConfigOutSerializer = void 0;
  ci.CheckbookConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/docusignConfigOut.js
var Jd = o((li) => {
  "use strict";
  Object.defineProperty(li, "__esModule", { value: !0 });
  li.DocusignConfigOutSerializer = void 0;
  li.DocusignConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/easypostConfigOut.js
var kd = o((pi) => {
  "use strict";
  Object.defineProperty(pi, "__esModule", { value: !0 });
  pi.EasypostConfigOutSerializer = void 0;
  pi.EasypostConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/githubConfigOut.js
var Cd = o((mi) => {
  "use strict";
  Object.defineProperty(mi, "__esModule", { value: !0 });
  mi.GithubConfigOutSerializer = void 0;
  mi.GithubConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/hubspotConfigOut.js
var Td = o((fi) => {
  "use strict";
  Object.defineProperty(fi, "__esModule", { value: !0 });
  fi.HubspotConfigOutSerializer = void 0;
  fi.HubspotConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/orumIoConfigOut.js
var wd = o((_i) => {
  "use strict";
  Object.defineProperty(_i, "__esModule", { value: !0 });
  _i.OrumIoConfigOutSerializer = void 0;
  _i.OrumIoConfigOutSerializer = {
    _fromJsonObject(e) {
      return {
        publicKey: e.publicKey
      };
    },
    _toJsonObject(e) {
      return {
        publicKey: e.publicKey
      };
    }
  };
});

// node_modules/svix/dist/models/pandaDocConfigOut.js
var jd = o((gi) => {
  "use strict";
  Object.defineProperty(gi, "__esModule", { value: !0 });
  gi.PandaDocConfigOutSerializer = void 0;
  gi.PandaDocConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/portIoConfigOut.js
var Ed = o((vi) => {
  "use strict";
  Object.defineProperty(vi, "__esModule", { value: !0 });
  vi.PortIoConfigOutSerializer = void 0;
  vi.PortIoConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/rutterConfigOut.js
var Id = o((hi) => {
  "use strict";
  Object.defineProperty(hi, "__esModule", { value: !0 });
  hi.RutterConfigOutSerializer = void 0;
  hi.RutterConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/segmentConfigOut.js
var Md = o((Oi) => {
  "use strict";
  Object.defineProperty(Oi, "__esModule", { value: !0 });
  Oi.SegmentConfigOutSerializer = void 0;
  Oi.SegmentConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/shopifyConfigOut.js
var Ad = o((Si) => {
  "use strict";
  Object.defineProperty(Si, "__esModule", { value: !0 });
  Si.ShopifyConfigOutSerializer = void 0;
  Si.ShopifyConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/slackConfigOut.js
var Rd = o((yi) => {
  "use strict";
  Object.defineProperty(yi, "__esModule", { value: !0 });
  yi.SlackConfigOutSerializer = void 0;
  yi.SlackConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/stripeConfigOut.js
var Hd = o((bi) => {
  "use strict";
  Object.defineProperty(bi, "__esModule", { value: !0 });
  bi.StripeConfigOutSerializer = void 0;
  bi.StripeConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/svixConfigOut.js
var Dd = o((Pi) => {
  "use strict";
  Object.defineProperty(Pi, "__esModule", { value: !0 });
  Pi.SvixConfigOutSerializer = void 0;
  Pi.SvixConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/telnyxConfigOut.js
var Ld = o((qi) => {
  "use strict";
  Object.defineProperty(qi, "__esModule", { value: !0 });
  qi.TelnyxConfigOutSerializer = void 0;
  qi.TelnyxConfigOutSerializer = {
    _fromJsonObject(e) {
      return {
        publicKey: e.publicKey
      };
    },
    _toJsonObject(e) {
      return {
        publicKey: e.publicKey
      };
    }
  };
});

// node_modules/svix/dist/models/vapiConfigOut.js
var Ud = o((zi) => {
  "use strict";
  Object.defineProperty(zi, "__esModule", { value: !0 });
  zi.VapiConfigOutSerializer = void 0;
  zi.VapiConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/veriffConfigOut.js
var Fd = o((xi) => {
  "use strict";
  Object.defineProperty(xi, "__esModule", { value: !0 });
  xi.VeriffConfigOutSerializer = void 0;
  xi.VeriffConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/zoomConfigOut.js
var Bd = o((Ji) => {
  "use strict";
  Object.defineProperty(Ji, "__esModule", { value: !0 });
  Ji.ZoomConfigOutSerializer = void 0;
  Ji.ZoomConfigOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/ingestSourceOut.js
var $a = o((ki) => {
  "use strict";
  Object.defineProperty(ki, "__esModule", { value: !0 });
  ki.IngestSourceOutSerializer = void 0;
  var Nd = qd(), $d = zd(), Kd = xd(), Gd = Na(), Wd = Jd(), Vd = kd(), Qd = Cd(), Yd = Td(), Zd = wd(), Xd = jd(), ec = Ed(), tc = Id(), rc = Md(), ic = Ad(), nc = Rd(), ac = Hd(), b = Dd(), sc = Ld(), oc = Ud(), uc = Fd(), dc = Bd();
  ki.IngestSourceOutSerializer = {
    _fromJsonObject(e) {
      let t = e.type;
      function r(i) {
        switch (i) {
          case "generic-webhook":
            return {};
          case "cron":
            return Gd.CronConfigSerializer._fromJsonObject(e.config);
          case "adobe-sign":
            return Nd.AdobeSignConfigOutSerializer._fromJsonObject(e.config);
          case "beehiiv":
            return b.SvixConfigOutSerializer._fromJsonObject(e.config);
          case "brex":
            return b.SvixConfigOutSerializer._fromJsonObject(e.config);
          case "checkbook":
            return Kd.CheckbookConfigOutSerializer._fromJsonObject(e.config);
          case "clerk":
            return b.SvixConfigOutSerializer._fromJsonObject(e.config);
          case "docusign":
            return Wd.DocusignConfigOutSerializer._fromJsonObject(e.config);
          case "easypost":
            return Vd.EasypostConfigOutSerializer._fromJsonObject(e.config);
          case "github":
            return Qd.GithubConfigOutSerializer._fromJsonObject(e.config);
          case "guesty":
            return b.SvixConfigOutSerializer._fromJsonObject(e.config);
          case "hubspot":
            return Yd.HubspotConfigOutSerializer._fromJsonObject(e.config);
          case "incident-io":
            return b.SvixConfigOutSerializer._fromJsonObject(e.config);
          case "lithic":
            return b.SvixConfigOutSerializer._fromJsonObject(e.config);
          case "nash":
            return b.SvixConfigOutSerializer._fromJsonObject(e.config);
          case "orum-io":
            return Zd.OrumIoConfigOutSerializer._fromJsonObject(e.config);
          case "panda-doc":
            return Xd.PandaDocConfigOutSerializer._fromJsonObject(e.config);
          case "port-io":
            return ec.PortIoConfigOutSerializer._fromJsonObject(e.config);
          case "pleo":
            return b.SvixConfigOutSerializer._fromJsonObject(e.config);
          case "replicate":
            return b.SvixConfigOutSerializer._fromJsonObject(e.config);
          case "resend":
            return b.SvixConfigOutSerializer._fromJsonObject(e.config);
          case "rutter":
            return tc.RutterConfigOutSerializer._fromJsonObject(e.config);
          case "safebase":
            return b.SvixConfigOutSerializer._fromJsonObject(e.config);
          case "sardine":
            return b.SvixConfigOutSerializer._fromJsonObject(e.config);
          case "segment":
            return rc.SegmentConfigOutSerializer._fromJsonObject(e.config);
          case "shopify":
            return ic.ShopifyConfigOutSerializer._fromJsonObject(e.config);
          case "slack":
            return nc.SlackConfigOutSerializer._fromJsonObject(e.config);
          case "stripe":
            return ac.StripeConfigOutSerializer._fromJsonObject(e.config);
          case "stych":
            return b.SvixConfigOutSerializer._fromJsonObject(e.config);
          case "svix":
            return b.SvixConfigOutSerializer._fromJsonObject(e.config);
          case "zoom":
            return dc.ZoomConfigOutSerializer._fromJsonObject(e.config);
          case "telnyx":
            return sc.TelnyxConfigOutSerializer._fromJsonObject(e.config);
          case "vapi":
            return oc.VapiConfigOutSerializer._fromJsonObject(e.config);
          case "open-ai":
            return b.SvixConfigOutSerializer._fromJsonObject(e.config);
          case "render":
            return b.SvixConfigOutSerializer._fromJsonObject(e.config);
          case "veriff":
            return uc.VeriffConfigOutSerializer._fromJsonObject(e.config);
          case "airwallex":
            return $d.AirwallexConfigOutSerializer._fromJsonObject(e.config);
          default:
            throw new Error(`Unexpected type: ${i}`);
        }
      }
      return a(r, "getConfig"), {
        type: t,
        config: r(t),
        createdAt: new Date(e.createdAt),
        id: e.id,
        ingestUrl: e.ingestUrl,
        metadata: e.metadata,
        name: e.name,
        uid: e.uid,
        updatedAt: new Date(e.updatedAt)
      };
    },
    _toJsonObject(e) {
      let t;
      switch (e.type) {
        case "generic-webhook":
          t = {};
          break;
        case "cron":
          t = Gd.CronConfigSerializer._toJsonObject(e.config);
          break;
        case "adobe-sign":
          t = Nd.AdobeSignConfigOutSerializer._toJsonObject(e.config);
          break;
        case "beehiiv":
          t = b.SvixConfigOutSerializer._toJsonObject(e.config);
          break;
        case "brex":
          t = b.SvixConfigOutSerializer._toJsonObject(e.config);
          break;
        case "checkbook":
          t = Kd.CheckbookConfigOutSerializer._toJsonObject(e.config);
          break;
        case "clerk":
          t = b.SvixConfigOutSerializer._toJsonObject(e.config);
          break;
        case "docusign":
          t = Wd.DocusignConfigOutSerializer._toJsonObject(e.config);
          break;
        case "easypost":
          t = Vd.EasypostConfigOutSerializer._toJsonObject(e.config);
          break;
        case "github":
          t = Qd.GithubConfigOutSerializer._toJsonObject(e.config);
          break;
        case "guesty":
          t = b.SvixConfigOutSerializer._toJsonObject(e.config);
          break;
        case "hubspot":
          t = Yd.HubspotConfigOutSerializer._toJsonObject(e.config);
          break;
        case "incident-io":
          t = b.SvixConfigOutSerializer._toJsonObject(e.config);
          break;
        case "lithic":
          t = b.SvixConfigOutSerializer._toJsonObject(e.config);
          break;
        case "nash":
          t = b.SvixConfigOutSerializer._toJsonObject(e.config);
          break;
        case "orum-io":
          t = Zd.OrumIoConfigOutSerializer._toJsonObject(e.config);
          break;
        case "panda-doc":
          t = Xd.PandaDocConfigOutSerializer._toJsonObject(e.config);
          break;
        case "port-io":
          t = ec.PortIoConfigOutSerializer._toJsonObject(e.config);
          break;
        case "pleo":
          t = b.SvixConfigOutSerializer._toJsonObject(e.config);
          break;
        case "replicate":
          t = b.SvixConfigOutSerializer._toJsonObject(e.config);
          break;
        case "resend":
          t = b.SvixConfigOutSerializer._toJsonObject(e.config);
          break;
        case "rutter":
          t = tc.RutterConfigOutSerializer._toJsonObject(e.config);
          break;
        case "safebase":
          t = b.SvixConfigOutSerializer._toJsonObject(e.config);
          break;
        case "sardine":
          t = b.SvixConfigOutSerializer._toJsonObject(e.config);
          break;
        case "segment":
          t = rc.SegmentConfigOutSerializer._toJsonObject(e.config);
          break;
        case "shopify":
          t = ic.ShopifyConfigOutSerializer._toJsonObject(e.config);
          break;
        case "slack":
          t = nc.SlackConfigOutSerializer._toJsonObject(e.config);
          break;
        case "stripe":
          t = ac.StripeConfigOutSerializer._toJsonObject(e.config);
          break;
        case "stych":
          t = b.SvixConfigOutSerializer._toJsonObject(e.config);
          break;
        case "svix":
          t = b.SvixConfigOutSerializer._toJsonObject(e.config);
          break;
        case "zoom":
          t = dc.ZoomConfigOutSerializer._toJsonObject(e.config);
          break;
        case "telnyx":
          t = sc.TelnyxConfigOutSerializer._toJsonObject(e.config);
          break;
        case "vapi":
          t = oc.VapiConfigOutSerializer._toJsonObject(e.config);
          break;
        case "open-ai":
          t = b.SvixConfigOutSerializer._toJsonObject(e.config);
          break;
        case "render":
          t = b.SvixConfigOutSerializer._toJsonObject(e.config);
          break;
        case "veriff":
          t = uc.VeriffConfigOutSerializer._toJsonObject(e.config);
          break;
        case "airwallex":
          t = $d.AirwallexConfigOutSerializer._toJsonObject(e.config);
          break;
      }
      return {
        type: e.type,
        config: t,
        createdAt: e.createdAt,
        id: e.id,
        ingestUrl: e.ingestUrl,
        metadata: e.metadata,
        name: e.name,
        uid: e.uid,
        updatedAt: e.updatedAt
      };
    }
  };
});

// node_modules/svix/dist/models/listResponseIngestSourceOut.js
var lc = o((Ci) => {
  "use strict";
  Object.defineProperty(Ci, "__esModule", { value: !0 });
  Ci.ListResponseIngestSourceOutSerializer = void 0;
  var cc = $a();
  Ci.ListResponseIngestSourceOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => cc.IngestSourceOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => cc.IngestSourceOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    }
  };
});

// node_modules/svix/dist/models/rotateTokenOut.js
var pc = o((Ti) => {
  "use strict";
  Object.defineProperty(Ti, "__esModule", { value: !0 });
  Ti.RotateTokenOutSerializer = void 0;
  Ti.RotateTokenOutSerializer = {
    _fromJsonObject(e) {
      return {
        ingestUrl: e.ingestUrl
      };
    },
    _toJsonObject(e) {
      return {
        ingestUrl: e.ingestUrl
      };
    }
  };
});

// node_modules/svix/dist/api/ingestSource.js
var fc = o((wi) => {
  "use strict";
  Object.defineProperty(wi, "__esModule", { value: !0 });
  wi.IngestSource = void 0;
  var mc = Pd(), Ka = $a(), q_ = lc(), z_ = pc(), te = k(), Ga = class {
    static {
      a(this, "IngestSource");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    list(t) {
      let r = new te.SvixRequest(te.HttpMethod.GET, "/ingest/api/v1/source");
      return r.setQueryParams({
        limit: t?.limit,
        iterator: t?.iterator,
        order: t?.order
      }), r.send(this.requestCtx, q_.ListResponseIngestSourceOutSerializer._fromJsonObject);
    }
    create(t, r) {
      let i = new te.SvixRequest(te.HttpMethod.POST, "/ingest/api/v1/source");
      return i.setHeaderParam("idempotency-key", r?.idempotencyKey), i.setBody(mc.IngestSourceInSerializer._toJsonObject(t)), i.send(this.requestCtx, Ka.IngestSourceOutSerializer._fromJsonObject);
    }
    get(t) {
      let r = new te.SvixRequest(te.HttpMethod.GET, "/ingest/api/v1/source/{source_id}");
      return r.setPathParam("source_id", t), r.send(this.requestCtx, Ka.IngestSourceOutSerializer._fromJsonObject);
    }
    update(t, r) {
      let i = new te.SvixRequest(te.HttpMethod.PUT, "/ingest/api/v1/source/{source_id}");
      return i.setPathParam("source_id", t), i.setBody(mc.IngestSourceInSerializer._toJsonObject(r)), i.send(this.requestCtx, Ka.IngestSourceOutSerializer._fromJsonObject);
    }
    delete(t) {
      let r = new te.SvixRequest(te.HttpMethod.DELETE, "/ingest/api/v1/source/{source_id}");
      return r.setPathParam("source_id", t), r.sendNoResponseBody(this.requestCtx);
    }
    rotateToken(t, r) {
      let i = new te.SvixRequest(te.HttpMethod.POST, "/ingest/api/v1/source/{source_id}/token/rotate");
      return i.setPathParam("source_id", t), i.setHeaderParam("idempotency-key", r?.idempotencyKey), i.send(this.requestCtx, z_.RotateTokenOutSerializer._fromJsonObject);
    }
  };
  wi.IngestSource = Ga;
});

// node_modules/svix/dist/api/ingest.js
var gc = o((ji) => {
  "use strict";
  Object.defineProperty(ji, "__esModule", { value: !0 });
  ji.Ingest = void 0;
  var x_ = Ja(), J_ = zu(), k_ = Au(), C_ = fc(), _c = k(), Wa = class {
    static {
      a(this, "Ingest");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    get endpoint() {
      return new k_.IngestEndpoint(this.requestCtx);
    }
    get source() {
      return new C_.IngestSource(this.requestCtx);
    }
    dashboard(t, r, i) {
      let n = new _c.SvixRequest(_c.HttpMethod.POST, "/ingest/api/v1/source/{source_id}/dashboard");
      return n.setPathParam("source_id", t), n.setHeaderParam("idempotency-key", i?.idempotencyKey), n.setBody(J_.IngestSourceConsumerPortalAccessInSerializer._toJsonObject(r)), n.send(this.requestCtx, x_.DashboardAccessOutSerializer._fromJsonObject);
    }
  };
  ji.Ingest = Wa;
});

// node_modules/svix/dist/models/integrationIn.js
var vc = o((Ei) => {
  "use strict";
  Object.defineProperty(Ei, "__esModule", { value: !0 });
  Ei.IntegrationInSerializer = void 0;
  Ei.IntegrationInSerializer = {
    _fromJsonObject(e) {
      return {
        featureFlags: e.featureFlags,
        name: e.name
      };
    },
    _toJsonObject(e) {
      return {
        featureFlags: e.featureFlags,
        name: e.name
      };
    }
  };
});

// node_modules/svix/dist/models/integrationKeyOut.js
var hc = o((Ii) => {
  "use strict";
  Object.defineProperty(Ii, "__esModule", { value: !0 });
  Ii.IntegrationKeyOutSerializer = void 0;
  Ii.IntegrationKeyOutSerializer = {
    _fromJsonObject(e) {
      return {
        key: e.key
      };
    },
    _toJsonObject(e) {
      return {
        key: e.key
      };
    }
  };
});

// node_modules/svix/dist/models/integrationOut.js
var Va = o((Mi) => {
  "use strict";
  Object.defineProperty(Mi, "__esModule", { value: !0 });
  Mi.IntegrationOutSerializer = void 0;
  Mi.IntegrationOutSerializer = {
    _fromJsonObject(e) {
      return {
        createdAt: new Date(e.createdAt),
        featureFlags: e.featureFlags,
        id: e.id,
        name: e.name,
        updatedAt: new Date(e.updatedAt)
      };
    },
    _toJsonObject(e) {
      return {
        createdAt: e.createdAt,
        featureFlags: e.featureFlags,
        id: e.id,
        name: e.name,
        updatedAt: e.updatedAt
      };
    }
  };
});

// node_modules/svix/dist/models/integrationUpdate.js
var Oc = o((Ai) => {
  "use strict";
  Object.defineProperty(Ai, "__esModule", { value: !0 });
  Ai.IntegrationUpdateSerializer = void 0;
  Ai.IntegrationUpdateSerializer = {
    _fromJsonObject(e) {
      return {
        featureFlags: e.featureFlags,
        name: e.name
      };
    },
    _toJsonObject(e) {
      return {
        featureFlags: e.featureFlags,
        name: e.name
      };
    }
  };
});

// node_modules/svix/dist/models/listResponseIntegrationOut.js
var yc = o((Ri) => {
  "use strict";
  Object.defineProperty(Ri, "__esModule", { value: !0 });
  Ri.ListResponseIntegrationOutSerializer = void 0;
  var Sc = Va();
  Ri.ListResponseIntegrationOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => Sc.IntegrationOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => Sc.IntegrationOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    }
  };
});

// node_modules/svix/dist/api/integration.js
var Pc = o((Hi) => {
  "use strict";
  Object.defineProperty(Hi, "__esModule", { value: !0 });
  Hi.Integration = void 0;
  var T_ = vc(), bc = hc(), Qa = Va(), w_ = Oc(), j_ = yc(), W = k(), Ya = class {
    static {
      a(this, "Integration");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    list(t, r) {
      let i = new W.SvixRequest(W.HttpMethod.GET, "/api/v1/app/{app_id}/integration");
      return i.setPathParam("app_id", t), i.setQueryParams({
        limit: r?.limit,
        iterator: r?.iterator,
        order: r?.order
      }), i.send(this.requestCtx, j_.ListResponseIntegrationOutSerializer._fromJsonObject);
    }
    create(t, r, i) {
      let n = new W.SvixRequest(W.HttpMethod.POST, "/api/v1/app/{app_id}/integration");
      return n.setPathParam("app_id", t), n.setHeaderParam("idempotency-key", i?.idempotencyKey), n.setBody(T_.IntegrationInSerializer._toJsonObject(r)), n.send(this.requestCtx, Qa.IntegrationOutSerializer._fromJsonObject);
    }
    get(t, r) {
      let i = new W.SvixRequest(W.HttpMethod.GET, "/api/v1/app/{app_id}/integration/{integ_id}");
      return i.setPathParam("app_id", t), i.setPathParam("integ_id", r), i.send(this.requestCtx, Qa.IntegrationOutSerializer._fromJsonObject);
    }
    update(t, r, i) {
      let n = new W.SvixRequest(W.HttpMethod.PUT, "/api/v1/app/{app_id}/integration/{integ_id}");
      return n.setPathParam("app_id", t), n.setPathParam("integ_id", r), n.setBody(w_.IntegrationUpdateSerializer._toJsonObject(i)), n.send(this.requestCtx, Qa.IntegrationOutSerializer._fromJsonObject);
    }
    delete(t, r) {
      let i = new W.SvixRequest(W.HttpMethod.DELETE, "/api/v1/app/{app_id}/integration/{integ_id}");
      return i.setPathParam("app_id", t), i.setPathParam("integ_id", r), i.sendNoResponseBody(this.requestCtx);
    }
    getKey(t, r) {
      let i = new W.SvixRequest(W.HttpMethod.GET, "/api/v1/app/{app_id}/integration/{integ_id}/key");
      return i.setPathParam("app_id", t), i.setPathParam("integ_id", r), i.send(this.requestCtx, bc.IntegrationKeyOutSerializer._fromJsonObject);
    }
    rotateKey(t, r, i) {
      let n = new W.SvixRequest(W.HttpMethod.POST, "/api/v1/app/{app_id}/integration/{integ_id}/key/rotate");
      return n.setPathParam("app_id", t), n.setPathParam("integ_id", r), n.setHeaderParam("idempotency-key", i?.idempotencyKey), n.send(this.requestCtx, bc.IntegrationKeyOutSerializer._fromJsonObject);
    }
  };
  Hi.Integration = Ya;
});

// node_modules/svix/dist/models/expungeAllContentsOut.js
var xc = o((Di) => {
  "use strict";
  Object.defineProperty(Di, "__esModule", { value: !0 });
  Di.ExpungeAllContentsOutSerializer = void 0;
  var qc = de(), zc = ce();
  Di.ExpungeAllContentsOutSerializer = {
    _fromJsonObject(e) {
      return {
        id: e.id,
        status: qc.BackgroundTaskStatusSerializer._fromJsonObject(e.status),
        task: zc.BackgroundTaskTypeSerializer._fromJsonObject(e.task)
      };
    },
    _toJsonObject(e) {
      return {
        id: e.id,
        status: qc.BackgroundTaskStatusSerializer._toJsonObject(e.status),
        task: zc.BackgroundTaskTypeSerializer._toJsonObject(e.task)
      };
    }
  };
});

// node_modules/svix/dist/models/listResponseMessageOut.js
var kc = o((Li) => {
  "use strict";
  Object.defineProperty(Li, "__esModule", { value: !0 });
  Li.ListResponseMessageOutSerializer = void 0;
  var Jc = $e();
  Li.ListResponseMessageOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => Jc.MessageOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => Jc.MessageOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    }
  };
});

// node_modules/svix/dist/models/pollingEndpointConsumerSeekIn.js
var Cc = o((Ui) => {
  "use strict";
  Object.defineProperty(Ui, "__esModule", { value: !0 });
  Ui.PollingEndpointConsumerSeekInSerializer = void 0;
  Ui.PollingEndpointConsumerSeekInSerializer = {
    _fromJsonObject(e) {
      return {
        after: new Date(e.after)
      };
    },
    _toJsonObject(e) {
      return {
        after: e.after
      };
    }
  };
});

// node_modules/svix/dist/models/pollingEndpointConsumerSeekOut.js
var Tc = o((Fi) => {
  "use strict";
  Object.defineProperty(Fi, "__esModule", { value: !0 });
  Fi.PollingEndpointConsumerSeekOutSerializer = void 0;
  Fi.PollingEndpointConsumerSeekOutSerializer = {
    _fromJsonObject(e) {
      return {
        iterator: e.iterator
      };
    },
    _toJsonObject(e) {
      return {
        iterator: e.iterator
      };
    }
  };
});

// node_modules/svix/dist/models/pollingEndpointMessageOut.js
var wc = o((Bi) => {
  "use strict";
  Object.defineProperty(Bi, "__esModule", { value: !0 });
  Bi.PollingEndpointMessageOutSerializer = void 0;
  Bi.PollingEndpointMessageOutSerializer = {
    _fromJsonObject(e) {
      return {
        channels: e.channels,
        deliverAt: e.deliverAt ? new Date(e.deliverAt) : null,
        eventId: e.eventId,
        eventType: e.eventType,
        headers: e.headers,
        id: e.id,
        payload: e.payload,
        tags: e.tags,
        timestamp: new Date(e.timestamp)
      };
    },
    _toJsonObject(e) {
      return {
        channels: e.channels,
        deliverAt: e.deliverAt,
        eventId: e.eventId,
        eventType: e.eventType,
        headers: e.headers,
        id: e.id,
        payload: e.payload,
        tags: e.tags,
        timestamp: e.timestamp
      };
    }
  };
});

// node_modules/svix/dist/models/pollingEndpointOut.js
var Ec = o((Ni) => {
  "use strict";
  Object.defineProperty(Ni, "__esModule", { value: !0 });
  Ni.PollingEndpointOutSerializer = void 0;
  var jc = wc();
  Ni.PollingEndpointOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => jc.PollingEndpointMessageOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => jc.PollingEndpointMessageOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator
      };
    }
  };
});

// node_modules/svix/dist/api/messagePoller.js
var Mc = o(($i) => {
  "use strict";
  Object.defineProperty($i, "__esModule", { value: !0 });
  $i.MessagePoller = void 0;
  var E_ = Cc(), I_ = Tc(), Ic = Ec(), Ce = k(), Za = class {
    static {
      a(this, "MessagePoller");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    poll(t, r, i) {
      let n = new Ce.SvixRequest(Ce.HttpMethod.GET, "/api/v1/app/{app_id}/poller/{sink_id}");
      return n.setPathParam("app_id", t), n.setPathParam("sink_id", r), n.setQueryParams({
        limit: i?.limit,
        iterator: i?.iterator,
        event_type: i?.eventType,
        channel: i?.channel,
        after: i?.after
      }), n.send(this.requestCtx, Ic.PollingEndpointOutSerializer._fromJsonObject);
    }
    consumerPoll(t, r, i, n) {
      let s = new Ce.SvixRequest(Ce.HttpMethod.GET, "/api/v1/app/{app_id}/poller/{sink_id}/consumer/{consumer_id}");
      return s.setPathParam("app_id", t), s.setPathParam("sink_id", r), s.setPathParam("consumer_id", i), s.setQueryParams({
        limit: n?.limit,
        iterator: n?.iterator
      }), s.send(this.requestCtx, Ic.PollingEndpointOutSerializer._fromJsonObject);
    }
    consumerSeek(t, r, i, n, s) {
      let u = new Ce.SvixRequest(Ce.HttpMethod.POST, "/api/v1/app/{app_id}/poller/{sink_id}/consumer/{consumer_id}/seek");
      return u.setPathParam("app_id", t), u.setPathParam("sink_id", r), u.setPathParam("consumer_id", i), u.setHeaderParam("idempotency-key", s?.idempotencyKey), u.setBody(E_.PollingEndpointConsumerSeekInSerializer._toJsonObject(n)), u.send(this.requestCtx, I_.PollingEndpointConsumerSeekOutSerializer._fromJsonObject);
    }
  };
  $i.MessagePoller = Za;
});

// node_modules/svix/dist/models/messageIn.js
var Rc = o((Ki) => {
  "use strict";
  Object.defineProperty(Ki, "__esModule", { value: !0 });
  Ki.MessageInSerializer = void 0;
  var Ac = Ye();
  Ki.MessageInSerializer = {
    _fromJsonObject(e) {
      return {
        application: e.application ? Ac.ApplicationInSerializer._fromJsonObject(e.application) : void 0,
        channels: e.channels,
        deliverAt: e.deliverAt ? new Date(e.deliverAt) : null,
        eventId: e.eventId,
        eventType: e.eventType,
        payload: e.payload,
        payloadRetentionHours: e.payloadRetentionHours,
        payloadRetentionPeriod: e.payloadRetentionPeriod,
        tags: e.tags,
        transformationsParams: e.transformationsParams
      };
    },
    _toJsonObject(e) {
      return {
        application: e.application ? Ac.ApplicationInSerializer._toJsonObject(e.application) : void 0,
        channels: e.channels,
        deliverAt: e.deliverAt,
        eventId: e.eventId,
        eventType: e.eventType,
        payload: e.payload,
        payloadRetentionHours: e.payloadRetentionHours,
        payloadRetentionPeriod: e.payloadRetentionPeriod,
        tags: e.tags,
        transformationsParams: e.transformationsParams
      };
    }
  };
});

// node_modules/svix/dist/api/message.js
var es = o((Te) => {
  "use strict";
  Object.defineProperty(Te, "__esModule", { value: !0 });
  Te.messageInRaw = Te.Message = void 0;
  var M_ = xc(), A_ = kc(), Hc = $e(), R_ = Mc(), ae = k(), H_ = Rc(), Xa = class {
    static {
      a(this, "Message");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    get poller() {
      return new R_.MessagePoller(this.requestCtx);
    }
    list(t, r) {
      let i = new ae.SvixRequest(ae.HttpMethod.GET, "/api/v1/app/{app_id}/msg");
      return i.setPathParam("app_id", t), i.setQueryParams({
        limit: r?.limit,
        iterator: r?.iterator,
        channel: r?.channel,
        before: r?.before,
        after: r?.after,
        with_content: r?.withContent,
        tag: r?.tag,
        event_types: r?.eventTypes
      }), i.send(this.requestCtx, A_.ListResponseMessageOutSerializer._fromJsonObject);
    }
    create(t, r, i) {
      let n = new ae.SvixRequest(ae.HttpMethod.POST, "/api/v1/app/{app_id}/msg");
      return n.setPathParam("app_id", t), n.setQueryParams({
        with_content: i?.withContent
      }), n.setHeaderParam("idempotency-key", i?.idempotencyKey), n.setBody(H_.MessageInSerializer._toJsonObject(r)), n.send(this.requestCtx, Hc.MessageOutSerializer._fromJsonObject);
    }
    expungeAllContents(t, r) {
      let i = new ae.SvixRequest(ae.HttpMethod.POST, "/api/v1/app/{app_id}/msg/expunge-all-contents");
      return i.setPathParam("app_id", t), i.setHeaderParam("idempotency-key", r?.idempotencyKey), i.send(this.requestCtx, M_.ExpungeAllContentsOutSerializer._fromJsonObject);
    }
    get(t, r, i) {
      let n = new ae.SvixRequest(ae.HttpMethod.GET, "/api/v1/app/{app_id}/msg/{msg_id}");
      return n.setPathParam("app_id", t), n.setPathParam("msg_id", r), n.setQueryParams({
        with_content: i?.withContent
      }), n.send(this.requestCtx, Hc.MessageOutSerializer._fromJsonObject);
    }
    expungeContent(t, r) {
      let i = new ae.SvixRequest(ae.HttpMethod.DELETE, "/api/v1/app/{app_id}/msg/{msg_id}/content");
      return i.setPathParam("app_id", t), i.setPathParam("msg_id", r), i.sendNoResponseBody(this.requestCtx);
    }
  };
  Te.Message = Xa;
  function D_(e, t, r) {
    return {
      eventType: e,
      payload: {},
      transformationsParams: {
        rawPayload: t,
        headers: r ? { "content-type": r } : void 0
      }
    };
  }
  a(D_, "messageInRaw");
  Te.messageInRaw = D_;
});

// node_modules/svix/dist/models/emptyResponse.js
var ts = o((Gi) => {
  "use strict";
  Object.defineProperty(Gi, "__esModule", { value: !0 });
  Gi.EmptyResponseSerializer = void 0;
  Gi.EmptyResponseSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/messageStatus.js
var Ke = o((Se) => {
  "use strict";
  Object.defineProperty(Se, "__esModule", { value: !0 });
  Se.MessageStatusSerializer = Se.MessageStatus = void 0;
  var L_;
  (function(e) {
    e[e.Success = 0] = "Success", e[e.Pending = 1] = "Pending", e[e.Fail = 2] = "Fail", e[e.Sending = 3] = "Sending";
  })(L_ = Se.MessageStatus || (Se.MessageStatus = {}));
  Se.MessageStatusSerializer = {
    _fromJsonObject(e) {
      return e;
    },
    _toJsonObject(e) {
      return e;
    }
  };
});

// node_modules/svix/dist/models/messageStatusText.js
var Ge = o((ye) => {
  "use strict";
  Object.defineProperty(ye, "__esModule", { value: !0 });
  ye.MessageStatusTextSerializer = ye.MessageStatusText = void 0;
  var U_;
  (function(e) {
    e.Success = "success", e.Pending = "pending", e.Fail = "fail", e.Sending = "sending";
  })(U_ = ye.MessageStatusText || (ye.MessageStatusText = {}));
  ye.MessageStatusTextSerializer = {
    _fromJsonObject(e) {
      return e;
    },
    _toJsonObject(e) {
      return e;
    }
  };
});

// node_modules/svix/dist/models/endpointMessageOut.js
var Uc = o((Wi) => {
  "use strict";
  Object.defineProperty(Wi, "__esModule", { value: !0 });
  Wi.EndpointMessageOutSerializer = void 0;
  var Dc = Ke(), Lc = Ge();
  Wi.EndpointMessageOutSerializer = {
    _fromJsonObject(e) {
      return {
        channels: e.channels,
        deliverAt: e.deliverAt ? new Date(e.deliverAt) : null,
        eventId: e.eventId,
        eventType: e.eventType,
        id: e.id,
        nextAttempt: e.nextAttempt ? new Date(e.nextAttempt) : null,
        payload: e.payload,
        status: Dc.MessageStatusSerializer._fromJsonObject(e.status),
        statusText: Lc.MessageStatusTextSerializer._fromJsonObject(e.statusText),
        tags: e.tags,
        timestamp: new Date(e.timestamp)
      };
    },
    _toJsonObject(e) {
      return {
        channels: e.channels,
        deliverAt: e.deliverAt,
        eventId: e.eventId,
        eventType: e.eventType,
        id: e.id,
        nextAttempt: e.nextAttempt,
        payload: e.payload,
        status: Dc.MessageStatusSerializer._toJsonObject(e.status),
        statusText: Lc.MessageStatusTextSerializer._toJsonObject(e.statusText),
        tags: e.tags,
        timestamp: e.timestamp
      };
    }
  };
});

// node_modules/svix/dist/models/listResponseEndpointMessageOut.js
var Bc = o((Vi) => {
  "use strict";
  Object.defineProperty(Vi, "__esModule", { value: !0 });
  Vi.ListResponseEndpointMessageOutSerializer = void 0;
  var Fc = Uc();
  Vi.ListResponseEndpointMessageOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => Fc.EndpointMessageOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => Fc.EndpointMessageOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    }
  };
});

// node_modules/svix/dist/models/messageAttemptTriggerType.js
var rs = o((be) => {
  "use strict";
  Object.defineProperty(be, "__esModule", { value: !0 });
  be.MessageAttemptTriggerTypeSerializer = be.MessageAttemptTriggerType = void 0;
  var F_;
  (function(e) {
    e[e.Scheduled = 0] = "Scheduled", e[e.Manual = 1] = "Manual";
  })(F_ = be.MessageAttemptTriggerType || (be.MessageAttemptTriggerType = {}));
  be.MessageAttemptTriggerTypeSerializer = {
    _fromJsonObject(e) {
      return e;
    },
    _toJsonObject(e) {
      return e;
    }
  };
});

// node_modules/svix/dist/models/messageAttemptOut.js
var is = o((Qi) => {
  "use strict";
  Object.defineProperty(Qi, "__esModule", { value: !0 });
  Qi.MessageAttemptOutSerializer = void 0;
  var Nc = rs(), $c = $e(), Kc = Ke(), Gc = Ge();
  Qi.MessageAttemptOutSerializer = {
    _fromJsonObject(e) {
      return {
        endpointId: e.endpointId,
        id: e.id,
        msg: e.msg ? $c.MessageOutSerializer._fromJsonObject(e.msg) : void 0,
        msgId: e.msgId,
        response: e.response,
        responseDurationMs: e.responseDurationMs,
        responseStatusCode: e.responseStatusCode,
        status: Kc.MessageStatusSerializer._fromJsonObject(e.status),
        statusText: Gc.MessageStatusTextSerializer._fromJsonObject(e.statusText),
        timestamp: new Date(e.timestamp),
        triggerType: Nc.MessageAttemptTriggerTypeSerializer._fromJsonObject(e.triggerType),
        url: e.url
      };
    },
    _toJsonObject(e) {
      return {
        endpointId: e.endpointId,
        id: e.id,
        msg: e.msg ? $c.MessageOutSerializer._toJsonObject(e.msg) : void 0,
        msgId: e.msgId,
        response: e.response,
        responseDurationMs: e.responseDurationMs,
        responseStatusCode: e.responseStatusCode,
        status: Kc.MessageStatusSerializer._toJsonObject(e.status),
        statusText: Gc.MessageStatusTextSerializer._toJsonObject(e.statusText),
        timestamp: e.timestamp,
        triggerType: Nc.MessageAttemptTriggerTypeSerializer._toJsonObject(e.triggerType),
        url: e.url
      };
    }
  };
});

// node_modules/svix/dist/models/listResponseMessageAttemptOut.js
var Vc = o((Yi) => {
  "use strict";
  Object.defineProperty(Yi, "__esModule", { value: !0 });
  Yi.ListResponseMessageAttemptOutSerializer = void 0;
  var Wc = is();
  Yi.ListResponseMessageAttemptOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => Wc.MessageAttemptOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => Wc.MessageAttemptOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    }
  };
});

// node_modules/svix/dist/models/messageEndpointOut.js
var Zc = o((Zi) => {
  "use strict";
  Object.defineProperty(Zi, "__esModule", { value: !0 });
  Zi.MessageEndpointOutSerializer = void 0;
  var Qc = Ke(), Yc = Ge();
  Zi.MessageEndpointOutSerializer = {
    _fromJsonObject(e) {
      return {
        channels: e.channels,
        createdAt: new Date(e.createdAt),
        description: e.description,
        disabled: e.disabled,
        filterTypes: e.filterTypes,
        id: e.id,
        nextAttempt: e.nextAttempt ? new Date(e.nextAttempt) : null,
        rateLimit: e.rateLimit,
        status: Qc.MessageStatusSerializer._fromJsonObject(e.status),
        statusText: Yc.MessageStatusTextSerializer._fromJsonObject(e.statusText),
        uid: e.uid,
        updatedAt: new Date(e.updatedAt),
        url: e.url,
        version: e.version
      };
    },
    _toJsonObject(e) {
      return {
        channels: e.channels,
        createdAt: e.createdAt,
        description: e.description,
        disabled: e.disabled,
        filterTypes: e.filterTypes,
        id: e.id,
        nextAttempt: e.nextAttempt,
        rateLimit: e.rateLimit,
        status: Qc.MessageStatusSerializer._toJsonObject(e.status),
        statusText: Yc.MessageStatusTextSerializer._toJsonObject(e.statusText),
        uid: e.uid,
        updatedAt: e.updatedAt,
        url: e.url,
        version: e.version
      };
    }
  };
});

// node_modules/svix/dist/models/listResponseMessageEndpointOut.js
var el = o((Xi) => {
  "use strict";
  Object.defineProperty(Xi, "__esModule", { value: !0 });
  Xi.ListResponseMessageEndpointOutSerializer = void 0;
  var Xc = Zc();
  Xi.ListResponseMessageEndpointOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => Xc.MessageEndpointOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => Xc.MessageEndpointOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    }
  };
});

// node_modules/svix/dist/api/messageAttempt.js
var rl = o((en) => {
  "use strict";
  Object.defineProperty(en, "__esModule", { value: !0 });
  en.MessageAttempt = void 0;
  var B_ = ts(), N_ = Bc(), tl = Vc(), $_ = el(), K_ = is(), V = k(), ns = class {
    static {
      a(this, "MessageAttempt");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    listByEndpoint(t, r, i) {
      let n = new V.SvixRequest(V.HttpMethod.GET, "/api/v1/app/{app_id}/attempt/endpoint/{endpoint_id}");
      return n.setPathParam("app_id", t), n.setPathParam("endpoint_id", r), n.setQueryParams({
        limit: i?.limit,
        iterator: i?.iterator,
        status: i?.status,
        status_code_class: i?.statusCodeClass,
        channel: i?.channel,
        tag: i?.tag,
        before: i?.before,
        after: i?.after,
        with_content: i?.withContent,
        with_msg: i?.withMsg,
        event_types: i?.eventTypes
      }), n.send(this.requestCtx, tl.ListResponseMessageAttemptOutSerializer._fromJsonObject);
    }
    listByMsg(t, r, i) {
      let n = new V.SvixRequest(V.HttpMethod.GET, "/api/v1/app/{app_id}/attempt/msg/{msg_id}");
      return n.setPathParam("app_id", t), n.setPathParam("msg_id", r), n.setQueryParams({
        limit: i?.limit,
        iterator: i?.iterator,
        status: i?.status,
        status_code_class: i?.statusCodeClass,
        channel: i?.channel,
        tag: i?.tag,
        endpoint_id: i?.endpointId,
        before: i?.before,
        after: i?.after,
        with_content: i?.withContent,
        event_types: i?.eventTypes
      }), n.send(this.requestCtx, tl.ListResponseMessageAttemptOutSerializer._fromJsonObject);
    }
    listAttemptedMessages(t, r, i) {
      let n = new V.SvixRequest(V.HttpMethod.GET, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/msg");
      return n.setPathParam("app_id", t), n.setPathParam("endpoint_id", r), n.setQueryParams({
        limit: i?.limit,
        iterator: i?.iterator,
        channel: i?.channel,
        tag: i?.tag,
        status: i?.status,
        before: i?.before,
        after: i?.after,
        with_content: i?.withContent,
        event_types: i?.eventTypes
      }), n.send(this.requestCtx, N_.ListResponseEndpointMessageOutSerializer._fromJsonObject);
    }
    get(t, r, i) {
      let n = new V.SvixRequest(V.HttpMethod.GET, "/api/v1/app/{app_id}/msg/{msg_id}/attempt/{attempt_id}");
      return n.setPathParam("app_id", t), n.setPathParam("msg_id", r), n.setPathParam("attempt_id", i), n.send(this.requestCtx, K_.MessageAttemptOutSerializer._fromJsonObject);
    }
    expungeContent(t, r, i) {
      let n = new V.SvixRequest(V.HttpMethod.DELETE, "/api/v1/app/{app_id}/msg/{msg_id}/attempt/{attempt_id}/content");
      return n.setPathParam("app_id", t), n.setPathParam("msg_id", r), n.setPathParam("attempt_id", i), n.sendNoResponseBody(this.requestCtx);
    }
    listAttemptedDestinations(t, r, i) {
      let n = new V.SvixRequest(V.HttpMethod.GET, "/api/v1/app/{app_id}/msg/{msg_id}/endpoint");
      return n.setPathParam("app_id", t), n.setPathParam("msg_id", r), n.setQueryParams({
        limit: i?.limit,
        iterator: i?.iterator
      }), n.send(this.requestCtx, $_.ListResponseMessageEndpointOutSerializer._fromJsonObject);
    }
    resend(t, r, i, n) {
      let s = new V.SvixRequest(V.HttpMethod.POST, "/api/v1/app/{app_id}/msg/{msg_id}/endpoint/{endpoint_id}/resend");
      return s.setPathParam("app_id", t), s.setPathParam("msg_id", r), s.setPathParam("endpoint_id", i), s.setHeaderParam("idempotency-key", n?.idempotencyKey), s.send(this.requestCtx, B_.EmptyResponseSerializer._fromJsonObject);
    }
  };
  en.MessageAttempt = ns;
});

// node_modules/svix/dist/models/operationalWebhookEndpointOut.js
var as = o((tn) => {
  "use strict";
  Object.defineProperty(tn, "__esModule", { value: !0 });
  tn.OperationalWebhookEndpointOutSerializer = void 0;
  tn.OperationalWebhookEndpointOutSerializer = {
    _fromJsonObject(e) {
      return {
        createdAt: new Date(e.createdAt),
        description: e.description,
        disabled: e.disabled,
        filterTypes: e.filterTypes,
        id: e.id,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        uid: e.uid,
        updatedAt: new Date(e.updatedAt),
        url: e.url
      };
    },
    _toJsonObject(e) {
      return {
        createdAt: e.createdAt,
        description: e.description,
        disabled: e.disabled,
        filterTypes: e.filterTypes,
        id: e.id,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        uid: e.uid,
        updatedAt: e.updatedAt,
        url: e.url
      };
    }
  };
});

// node_modules/svix/dist/models/listResponseOperationalWebhookEndpointOut.js
var nl = o((rn) => {
  "use strict";
  Object.defineProperty(rn, "__esModule", { value: !0 });
  rn.ListResponseOperationalWebhookEndpointOutSerializer = void 0;
  var il = as();
  rn.ListResponseOperationalWebhookEndpointOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => il.OperationalWebhookEndpointOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => il.OperationalWebhookEndpointOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    }
  };
});

// node_modules/svix/dist/models/operationalWebhookEndpointHeadersIn.js
var al = o((nn) => {
  "use strict";
  Object.defineProperty(nn, "__esModule", { value: !0 });
  nn.OperationalWebhookEndpointHeadersInSerializer = void 0;
  nn.OperationalWebhookEndpointHeadersInSerializer = {
    _fromJsonObject(e) {
      return {
        headers: e.headers
      };
    },
    _toJsonObject(e) {
      return {
        headers: e.headers
      };
    }
  };
});

// node_modules/svix/dist/models/operationalWebhookEndpointHeadersOut.js
var sl = o((an) => {
  "use strict";
  Object.defineProperty(an, "__esModule", { value: !0 });
  an.OperationalWebhookEndpointHeadersOutSerializer = void 0;
  an.OperationalWebhookEndpointHeadersOutSerializer = {
    _fromJsonObject(e) {
      return {
        headers: e.headers,
        sensitive: e.sensitive
      };
    },
    _toJsonObject(e) {
      return {
        headers: e.headers,
        sensitive: e.sensitive
      };
    }
  };
});

// node_modules/svix/dist/models/operationalWebhookEndpointIn.js
var ol = o((sn) => {
  "use strict";
  Object.defineProperty(sn, "__esModule", { value: !0 });
  sn.OperationalWebhookEndpointInSerializer = void 0;
  sn.OperationalWebhookEndpointInSerializer = {
    _fromJsonObject(e) {
      return {
        description: e.description,
        disabled: e.disabled,
        filterTypes: e.filterTypes,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        secret: e.secret,
        uid: e.uid,
        url: e.url
      };
    },
    _toJsonObject(e) {
      return {
        description: e.description,
        disabled: e.disabled,
        filterTypes: e.filterTypes,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        secret: e.secret,
        uid: e.uid,
        url: e.url
      };
    }
  };
});

// node_modules/svix/dist/models/operationalWebhookEndpointSecretIn.js
var ul = o((on) => {
  "use strict";
  Object.defineProperty(on, "__esModule", { value: !0 });
  on.OperationalWebhookEndpointSecretInSerializer = void 0;
  on.OperationalWebhookEndpointSecretInSerializer = {
    _fromJsonObject(e) {
      return {
        key: e.key
      };
    },
    _toJsonObject(e) {
      return {
        key: e.key
      };
    }
  };
});

// node_modules/svix/dist/models/operationalWebhookEndpointSecretOut.js
var dl = o((un) => {
  "use strict";
  Object.defineProperty(un, "__esModule", { value: !0 });
  un.OperationalWebhookEndpointSecretOutSerializer = void 0;
  un.OperationalWebhookEndpointSecretOutSerializer = {
    _fromJsonObject(e) {
      return {
        key: e.key
      };
    },
    _toJsonObject(e) {
      return {
        key: e.key
      };
    }
  };
});

// node_modules/svix/dist/models/operationalWebhookEndpointUpdate.js
var cl = o((dn) => {
  "use strict";
  Object.defineProperty(dn, "__esModule", { value: !0 });
  dn.OperationalWebhookEndpointUpdateSerializer = void 0;
  dn.OperationalWebhookEndpointUpdateSerializer = {
    _fromJsonObject(e) {
      return {
        description: e.description,
        disabled: e.disabled,
        filterTypes: e.filterTypes,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        uid: e.uid,
        url: e.url
      };
    },
    _toJsonObject(e) {
      return {
        description: e.description,
        disabled: e.disabled,
        filterTypes: e.filterTypes,
        metadata: e.metadata,
        rateLimit: e.rateLimit,
        uid: e.uid,
        url: e.url
      };
    }
  };
});

// node_modules/svix/dist/api/operationalWebhookEndpoint.js
var us = o((cn) => {
  "use strict";
  Object.defineProperty(cn, "__esModule", { value: !0 });
  cn.OperationalWebhookEndpoint = void 0;
  var G_ = nl(), W_ = al(), V_ = sl(), Q_ = ol(), ss = as(), Y_ = ul(), Z_ = dl(), X_ = cl(), M = k(), os = class {
    static {
      a(this, "OperationalWebhookEndpoint");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    list(t) {
      let r = new M.SvixRequest(M.HttpMethod.GET, "/api/v1/operational-webhook/endpoint");
      return r.setQueryParams({
        limit: t?.limit,
        iterator: t?.iterator,
        order: t?.order
      }), r.send(this.requestCtx, G_.ListResponseOperationalWebhookEndpointOutSerializer._fromJsonObject);
    }
    create(t, r) {
      let i = new M.SvixRequest(M.HttpMethod.POST, "/api/v1/operational-webhook/endpoint");
      return i.setHeaderParam("idempotency-key", r?.idempotencyKey), i.setBody(Q_.OperationalWebhookEndpointInSerializer._toJsonObject(t)), i.send(this.requestCtx, ss.OperationalWebhookEndpointOutSerializer._fromJsonObject);
    }
    get(t) {
      let r = new M.SvixRequest(M.HttpMethod.GET, "/api/v1/operational-webhook/endpoint/{endpoint_id}");
      return r.setPathParam("endpoint_id", t), r.send(this.requestCtx, ss.OperationalWebhookEndpointOutSerializer._fromJsonObject);
    }
    update(t, r) {
      let i = new M.SvixRequest(M.HttpMethod.PUT, "/api/v1/operational-webhook/endpoint/{endpoint_id}");
      return i.setPathParam("endpoint_id", t), i.setBody(X_.OperationalWebhookEndpointUpdateSerializer._toJsonObject(r)), i.send(this.requestCtx, ss.OperationalWebhookEndpointOutSerializer._fromJsonObject);
    }
    delete(t) {
      let r = new M.SvixRequest(M.HttpMethod.DELETE, "/api/v1/operational-webhook/endpoint/{endpoint_id}");
      return r.setPathParam("endpoint_id", t), r.sendNoResponseBody(this.requestCtx);
    }
    getHeaders(t) {
      let r = new M.SvixRequest(M.HttpMethod.GET, "/api/v1/operational-webhook/endpoint/{endpoint_id}/headers");
      return r.setPathParam("endpoint_id", t), r.send(this.requestCtx, V_.OperationalWebhookEndpointHeadersOutSerializer._fromJsonObject);
    }
    updateHeaders(t, r) {
      let i = new M.SvixRequest(M.HttpMethod.PUT, "/api/v1/operational-webhook/endpoint/{endpoint_id}/headers");
      return i.setPathParam("endpoint_id", t), i.setBody(W_.OperationalWebhookEndpointHeadersInSerializer._toJsonObject(r)), i.sendNoResponseBody(this.requestCtx);
    }
    getSecret(t) {
      let r = new M.SvixRequest(M.HttpMethod.GET, "/api/v1/operational-webhook/endpoint/{endpoint_id}/secret");
      return r.setPathParam("endpoint_id", t), r.send(this.requestCtx, Z_.OperationalWebhookEndpointSecretOutSerializer._fromJsonObject);
    }
    rotateSecret(t, r, i) {
      let n = new M.SvixRequest(M.HttpMethod.POST, "/api/v1/operational-webhook/endpoint/{endpoint_id}/secret/rotate");
      return n.setPathParam("endpoint_id", t), n.setHeaderParam("idempotency-key", i?.idempotencyKey), n.setBody(Y_.OperationalWebhookEndpointSecretInSerializer._toJsonObject(r)), n.sendNoResponseBody(this.requestCtx);
    }
  };
  cn.OperationalWebhookEndpoint = os;
});

// node_modules/svix/dist/api/operationalWebhook.js
var ll = o((ln) => {
  "use strict";
  Object.defineProperty(ln, "__esModule", { value: !0 });
  ln.OperationalWebhook = void 0;
  var eg = us(), ds = class {
    static {
      a(this, "OperationalWebhook");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    get endpoint() {
      return new eg.OperationalWebhookEndpoint(this.requestCtx);
    }
  };
  ln.OperationalWebhook = ds;
});

// node_modules/svix/dist/models/aggregateEventTypesOut.js
var fl = o((pn) => {
  "use strict";
  Object.defineProperty(pn, "__esModule", { value: !0 });
  pn.AggregateEventTypesOutSerializer = void 0;
  var pl = de(), ml = ce();
  pn.AggregateEventTypesOutSerializer = {
    _fromJsonObject(e) {
      return {
        id: e.id,
        status: pl.BackgroundTaskStatusSerializer._fromJsonObject(e.status),
        task: ml.BackgroundTaskTypeSerializer._fromJsonObject(e.task)
      };
    },
    _toJsonObject(e) {
      return {
        id: e.id,
        status: pl.BackgroundTaskStatusSerializer._toJsonObject(e.status),
        task: ml.BackgroundTaskTypeSerializer._toJsonObject(e.task)
      };
    }
  };
});

// node_modules/svix/dist/models/appUsageStatsIn.js
var _l = o((mn) => {
  "use strict";
  Object.defineProperty(mn, "__esModule", { value: !0 });
  mn.AppUsageStatsInSerializer = void 0;
  mn.AppUsageStatsInSerializer = {
    _fromJsonObject(e) {
      return {
        appIds: e.appIds,
        since: new Date(e.since),
        until: new Date(e.until)
      };
    },
    _toJsonObject(e) {
      return {
        appIds: e.appIds,
        since: e.since,
        until: e.until
      };
    }
  };
});

// node_modules/svix/dist/models/appUsageStatsOut.js
var hl = o((fn) => {
  "use strict";
  Object.defineProperty(fn, "__esModule", { value: !0 });
  fn.AppUsageStatsOutSerializer = void 0;
  var gl = de(), vl = ce();
  fn.AppUsageStatsOutSerializer = {
    _fromJsonObject(e) {
      return {
        id: e.id,
        status: gl.BackgroundTaskStatusSerializer._fromJsonObject(e.status),
        task: vl.BackgroundTaskTypeSerializer._fromJsonObject(e.task),
        unresolvedAppIds: e.unresolvedAppIds
      };
    },
    _toJsonObject(e) {
      return {
        id: e.id,
        status: gl.BackgroundTaskStatusSerializer._toJsonObject(e.status),
        task: vl.BackgroundTaskTypeSerializer._toJsonObject(e.task),
        unresolvedAppIds: e.unresolvedAppIds
      };
    }
  };
});

// node_modules/svix/dist/api/statistics.js
var Ol = o((gn) => {
  "use strict";
  Object.defineProperty(gn, "__esModule", { value: !0 });
  gn.Statistics = void 0;
  var tg = fl(), rg = _l(), ig = hl(), _n = k(), cs = class {
    static {
      a(this, "Statistics");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    aggregateAppStats(t, r) {
      let i = new _n.SvixRequest(_n.HttpMethod.POST, "/api/v1/stats/usage/app");
      return i.setHeaderParam("idempotency-key", r?.idempotencyKey), i.setBody(rg.AppUsageStatsInSerializer._toJsonObject(t)), i.send(this.requestCtx, ig.AppUsageStatsOutSerializer._fromJsonObject);
    }
    aggregateEventTypes() {
      return new _n.SvixRequest(_n.HttpMethod.PUT, "/api/v1/stats/usage/event-types").send(this.requestCtx, tg.AggregateEventTypesOutSerializer._fromJsonObject);
    }
  };
  gn.Statistics = cs;
});

// node_modules/svix/dist/models/httpSinkHeadersPatchIn.js
var Sl = o((vn) => {
  "use strict";
  Object.defineProperty(vn, "__esModule", { value: !0 });
  vn.HttpSinkHeadersPatchInSerializer = void 0;
  vn.HttpSinkHeadersPatchInSerializer = {
    _fromJsonObject(e) {
      return {
        headers: e.headers
      };
    },
    _toJsonObject(e) {
      return {
        headers: e.headers
      };
    }
  };
});

// node_modules/svix/dist/models/sinkTransformationOut.js
var yl = o((hn) => {
  "use strict";
  Object.defineProperty(hn, "__esModule", { value: !0 });
  hn.SinkTransformationOutSerializer = void 0;
  hn.SinkTransformationOutSerializer = {
    _fromJsonObject(e) {
      return {
        code: e.code,
        enabled: e.enabled
      };
    },
    _toJsonObject(e) {
      return {
        code: e.code,
        enabled: e.enabled
      };
    }
  };
});

// node_modules/svix/dist/models/streamEventTypeOut.js
var ls = o((On) => {
  "use strict";
  Object.defineProperty(On, "__esModule", { value: !0 });
  On.StreamEventTypeOutSerializer = void 0;
  On.StreamEventTypeOutSerializer = {
    _fromJsonObject(e) {
      return {
        archived: e.archived,
        createdAt: new Date(e.createdAt),
        deprecated: e.deprecated,
        description: e.description,
        featureFlags: e.featureFlags,
        name: e.name,
        updatedAt: new Date(e.updatedAt)
      };
    },
    _toJsonObject(e) {
      return {
        archived: e.archived,
        createdAt: e.createdAt,
        deprecated: e.deprecated,
        description: e.description,
        featureFlags: e.featureFlags,
        name: e.name,
        updatedAt: e.updatedAt
      };
    }
  };
});

// node_modules/svix/dist/models/listResponseStreamEventTypeOut.js
var Pl = o((Sn) => {
  "use strict";
  Object.defineProperty(Sn, "__esModule", { value: !0 });
  Sn.ListResponseStreamEventTypeOutSerializer = void 0;
  var bl = ls();
  Sn.ListResponseStreamEventTypeOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => bl.StreamEventTypeOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => bl.StreamEventTypeOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    }
  };
});

// node_modules/svix/dist/models/streamEventTypeIn.js
var ql = o((yn) => {
  "use strict";
  Object.defineProperty(yn, "__esModule", { value: !0 });
  yn.StreamEventTypeInSerializer = void 0;
  yn.StreamEventTypeInSerializer = {
    _fromJsonObject(e) {
      return {
        archived: e.archived,
        deprecated: e.deprecated,
        description: e.description,
        featureFlags: e.featureFlags,
        name: e.name
      };
    },
    _toJsonObject(e) {
      return {
        archived: e.archived,
        deprecated: e.deprecated,
        description: e.description,
        featureFlags: e.featureFlags,
        name: e.name
      };
    }
  };
});

// node_modules/svix/dist/models/streamEventTypePatch.js
var zl = o((bn) => {
  "use strict";
  Object.defineProperty(bn, "__esModule", { value: !0 });
  bn.StreamEventTypePatchSerializer = void 0;
  bn.StreamEventTypePatchSerializer = {
    _fromJsonObject(e) {
      return {
        archived: e.archived,
        deprecated: e.deprecated,
        description: e.description,
        featureFlags: e.featureFlags,
        name: e.name
      };
    },
    _toJsonObject(e) {
      return {
        archived: e.archived,
        deprecated: e.deprecated,
        description: e.description,
        featureFlags: e.featureFlags,
        name: e.name
      };
    }
  };
});

// node_modules/svix/dist/api/streamingEventType.js
var Jl = o((qn) => {
  "use strict";
  Object.defineProperty(qn, "__esModule", { value: !0 });
  qn.StreamingEventType = void 0;
  var ng = Pl(), xl = ql(), Pn = ls(), ag = zl(), re = k(), ps = class {
    static {
      a(this, "StreamingEventType");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    list(t) {
      let r = new re.SvixRequest(re.HttpMethod.GET, "/api/v1/stream/event-type");
      return r.setQueryParams({
        limit: t?.limit,
        iterator: t?.iterator,
        order: t?.order,
        include_archived: t?.includeArchived
      }), r.send(this.requestCtx, ng.ListResponseStreamEventTypeOutSerializer._fromJsonObject);
    }
    create(t, r) {
      let i = new re.SvixRequest(re.HttpMethod.POST, "/api/v1/stream/event-type");
      return i.setHeaderParam("idempotency-key", r?.idempotencyKey), i.setBody(xl.StreamEventTypeInSerializer._toJsonObject(t)), i.send(this.requestCtx, Pn.StreamEventTypeOutSerializer._fromJsonObject);
    }
    get(t) {
      let r = new re.SvixRequest(re.HttpMethod.GET, "/api/v1/stream/event-type/{name}");
      return r.setPathParam("name", t), r.send(this.requestCtx, Pn.StreamEventTypeOutSerializer._fromJsonObject);
    }
    update(t, r) {
      let i = new re.SvixRequest(re.HttpMethod.PUT, "/api/v1/stream/event-type/{name}");
      return i.setPathParam("name", t), i.setBody(xl.StreamEventTypeInSerializer._toJsonObject(r)), i.send(this.requestCtx, Pn.StreamEventTypeOutSerializer._fromJsonObject);
    }
    delete(t, r) {
      let i = new re.SvixRequest(re.HttpMethod.DELETE, "/api/v1/stream/event-type/{name}");
      return i.setPathParam("name", t), i.setQueryParams({
        expunge: r?.expunge
      }), i.sendNoResponseBody(this.requestCtx);
    }
    patch(t, r) {
      let i = new re.SvixRequest(re.HttpMethod.PATCH, "/api/v1/stream/event-type/{name}");
      return i.setPathParam("name", t), i.setBody(ag.StreamEventTypePatchSerializer._toJsonObject(r)), i.send(this.requestCtx, Pn.StreamEventTypeOutSerializer._fromJsonObject);
    }
  };
  qn.StreamingEventType = ps;
});

// node_modules/svix/dist/models/eventIn.js
var kl = o((zn) => {
  "use strict";
  Object.defineProperty(zn, "__esModule", { value: !0 });
  zn.EventInSerializer = void 0;
  zn.EventInSerializer = {
    _fromJsonObject(e) {
      return {
        eventType: e.eventType,
        payload: e.payload
      };
    },
    _toJsonObject(e) {
      return {
        eventType: e.eventType,
        payload: e.payload
      };
    }
  };
});

// node_modules/svix/dist/models/streamIn.js
var ms = o((xn) => {
  "use strict";
  Object.defineProperty(xn, "__esModule", { value: !0 });
  xn.StreamInSerializer = void 0;
  xn.StreamInSerializer = {
    _fromJsonObject(e) {
      return {
        metadata: e.metadata,
        name: e.name,
        uid: e.uid
      };
    },
    _toJsonObject(e) {
      return {
        metadata: e.metadata,
        name: e.name,
        uid: e.uid
      };
    }
  };
});

// node_modules/svix/dist/models/createStreamEventsIn.js
var wl = o((Jn) => {
  "use strict";
  Object.defineProperty(Jn, "__esModule", { value: !0 });
  Jn.CreateStreamEventsInSerializer = void 0;
  var Cl = kl(), Tl = ms();
  Jn.CreateStreamEventsInSerializer = {
    _fromJsonObject(e) {
      return {
        events: e.events.map((t) => Cl.EventInSerializer._fromJsonObject(t)),
        stream: e.stream ? Tl.StreamInSerializer._fromJsonObject(e.stream) : void 0
      };
    },
    _toJsonObject(e) {
      return {
        events: e.events.map((t) => Cl.EventInSerializer._toJsonObject(t)),
        stream: e.stream ? Tl.StreamInSerializer._toJsonObject(e.stream) : void 0
      };
    }
  };
});

// node_modules/svix/dist/models/createStreamEventsOut.js
var jl = o((kn) => {
  "use strict";
  Object.defineProperty(kn, "__esModule", { value: !0 });
  kn.CreateStreamEventsOutSerializer = void 0;
  kn.CreateStreamEventsOutSerializer = {
    _fromJsonObject(e) {
      return {};
    },
    _toJsonObject(e) {
      return {};
    }
  };
});

// node_modules/svix/dist/models/eventOut.js
var El = o((Cn) => {
  "use strict";
  Object.defineProperty(Cn, "__esModule", { value: !0 });
  Cn.EventOutSerializer = void 0;
  Cn.EventOutSerializer = {
    _fromJsonObject(e) {
      return {
        eventType: e.eventType,
        payload: e.payload,
        timestamp: new Date(e.timestamp)
      };
    },
    _toJsonObject(e) {
      return {
        eventType: e.eventType,
        payload: e.payload,
        timestamp: e.timestamp
      };
    }
  };
});

// node_modules/svix/dist/models/eventStreamOut.js
var Ml = o((Tn) => {
  "use strict";
  Object.defineProperty(Tn, "__esModule", { value: !0 });
  Tn.EventStreamOutSerializer = void 0;
  var Il = El();
  Tn.EventStreamOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => Il.EventOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => Il.EventOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator
      };
    }
  };
});

// node_modules/svix/dist/api/streamingEvents.js
var Al = o((jn) => {
  "use strict";
  Object.defineProperty(jn, "__esModule", { value: !0 });
  jn.StreamingEvents = void 0;
  var sg = wl(), og = jl(), ug = Ml(), wn = k(), fs = class {
    static {
      a(this, "StreamingEvents");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    create(t, r, i) {
      let n = new wn.SvixRequest(wn.HttpMethod.POST, "/api/v1/stream/{stream_id}/events");
      return n.setPathParam("stream_id", t), n.setHeaderParam("idempotency-key", i?.idempotencyKey), n.setBody(sg.CreateStreamEventsInSerializer._toJsonObject(r)), n.send(this.requestCtx, og.CreateStreamEventsOutSerializer._fromJsonObject);
    }
    get(t, r, i) {
      let n = new wn.SvixRequest(wn.HttpMethod.GET, "/api/v1/stream/{stream_id}/sink/{sink_id}/events");
      return n.setPathParam("stream_id", t), n.setPathParam("sink_id", r), n.setQueryParams({
        limit: i?.limit,
        iterator: i?.iterator,
        after: i?.after
      }), n.send(this.requestCtx, ug.EventStreamOutSerializer._fromJsonObject);
    }
  };
  jn.StreamingEvents = fs;
});

// node_modules/svix/dist/models/azureBlobStorageConfig.js
var _s = o((En) => {
  "use strict";
  Object.defineProperty(En, "__esModule", { value: !0 });
  En.AzureBlobStorageConfigSerializer = void 0;
  En.AzureBlobStorageConfigSerializer = {
    _fromJsonObject(e) {
      return {
        accessKey: e.accessKey,
        account: e.account,
        container: e.container
      };
    },
    _toJsonObject(e) {
      return {
        accessKey: e.accessKey,
        account: e.account,
        container: e.container
      };
    }
  };
});

// node_modules/svix/dist/models/googleCloudStorageConfig.js
var gs = o((In) => {
  "use strict";
  Object.defineProperty(In, "__esModule", { value: !0 });
  In.GoogleCloudStorageConfigSerializer = void 0;
  In.GoogleCloudStorageConfigSerializer = {
    _fromJsonObject(e) {
      return {
        bucket: e.bucket,
        credentials: e.credentials
      };
    },
    _toJsonObject(e) {
      return {
        bucket: e.bucket,
        credentials: e.credentials
      };
    }
  };
});

// node_modules/svix/dist/models/s3Config.js
var vs = o((Mn) => {
  "use strict";
  Object.defineProperty(Mn, "__esModule", { value: !0 });
  Mn.S3ConfigSerializer = void 0;
  Mn.S3ConfigSerializer = {
    _fromJsonObject(e) {
      return {
        accessKeyId: e.accessKeyId,
        bucket: e.bucket,
        region: e.region,
        secretAccessKey: e.secretAccessKey
      };
    },
    _toJsonObject(e) {
      return {
        accessKeyId: e.accessKeyId,
        bucket: e.bucket,
        region: e.region,
        secretAccessKey: e.secretAccessKey
      };
    }
  };
});

// node_modules/svix/dist/models/sinkHttpConfig.js
var hs = o((An) => {
  "use strict";
  Object.defineProperty(An, "__esModule", { value: !0 });
  An.SinkHttpConfigSerializer = void 0;
  An.SinkHttpConfigSerializer = {
    _fromJsonObject(e) {
      return {
        headers: e.headers,
        key: e.key,
        url: e.url
      };
    },
    _toJsonObject(e) {
      return {
        headers: e.headers,
        key: e.key,
        url: e.url
      };
    }
  };
});

// node_modules/svix/dist/models/sinkOtelV1Config.js
var Os = o((Rn) => {
  "use strict";
  Object.defineProperty(Rn, "__esModule", { value: !0 });
  Rn.SinkOtelV1ConfigSerializer = void 0;
  Rn.SinkOtelV1ConfigSerializer = {
    _fromJsonObject(e) {
      return {
        headers: e.headers,
        url: e.url
      };
    },
    _toJsonObject(e) {
      return {
        headers: e.headers,
        url: e.url
      };
    }
  };
});

// node_modules/svix/dist/models/sinkStatus.js
var Ss = o((Pe) => {
  "use strict";
  Object.defineProperty(Pe, "__esModule", { value: !0 });
  Pe.SinkStatusSerializer = Pe.SinkStatus = void 0;
  var dg;
  (function(e) {
    e.Enabled = "enabled", e.Paused = "paused", e.Disabled = "disabled", e.Retrying = "retrying";
  })(dg = Pe.SinkStatus || (Pe.SinkStatus = {}));
  Pe.SinkStatusSerializer = {
    _fromJsonObject(e) {
      return e;
    },
    _toJsonObject(e) {
      return e;
    }
  };
});

// node_modules/svix/dist/models/streamSinkOut.js
var ys = o((Hn) => {
  "use strict";
  Object.defineProperty(Hn, "__esModule", { value: !0 });
  Hn.StreamSinkOutSerializer = void 0;
  var Rl = _s(), Hl = gs(), Dl = vs(), Ll = hs(), Ul = Os(), Fl = Ss();
  Hn.StreamSinkOutSerializer = {
    _fromJsonObject(e) {
      let t = e.type;
      function r(i) {
        switch (i) {
          case "poller":
            return {};
          case "azureBlobStorage":
            return Rl.AzureBlobStorageConfigSerializer._fromJsonObject(e.config);
          case "otelTracing":
            return Ul.SinkOtelV1ConfigSerializer._fromJsonObject(e.config);
          case "http":
            return Ll.SinkHttpConfigSerializer._fromJsonObject(e.config);
          case "amazonS3":
            return Dl.S3ConfigSerializer._fromJsonObject(e.config);
          case "googleCloudStorage":
            return Hl.GoogleCloudStorageConfigSerializer._fromJsonObject(e.config);
          default:
            throw new Error(`Unexpected type: ${i}`);
        }
      }
      return a(r, "getConfig"), {
        type: t,
        config: r(t),
        batchSize: e.batchSize,
        createdAt: new Date(e.createdAt),
        currentIterator: e.currentIterator,
        eventTypes: e.eventTypes,
        failureReason: e.failureReason,
        id: e.id,
        maxWaitSecs: e.maxWaitSecs,
        metadata: e.metadata,
        nextRetryAt: e.nextRetryAt ? new Date(e.nextRetryAt) : null,
        status: Fl.SinkStatusSerializer._fromJsonObject(e.status),
        uid: e.uid,
        updatedAt: new Date(e.updatedAt)
      };
    },
    _toJsonObject(e) {
      let t;
      switch (e.type) {
        case "poller":
          t = {};
          break;
        case "azureBlobStorage":
          t = Rl.AzureBlobStorageConfigSerializer._toJsonObject(e.config);
          break;
        case "otelTracing":
          t = Ul.SinkOtelV1ConfigSerializer._toJsonObject(e.config);
          break;
        case "http":
          t = Ll.SinkHttpConfigSerializer._toJsonObject(e.config);
          break;
        case "amazonS3":
          t = Dl.S3ConfigSerializer._toJsonObject(e.config);
          break;
        case "googleCloudStorage":
          t = Hl.GoogleCloudStorageConfigSerializer._toJsonObject(e.config);
          break;
      }
      return {
        type: e.type,
        config: t,
        batchSize: e.batchSize,
        createdAt: e.createdAt,
        currentIterator: e.currentIterator,
        eventTypes: e.eventTypes,
        failureReason: e.failureReason,
        id: e.id,
        maxWaitSecs: e.maxWaitSecs,
        metadata: e.metadata,
        nextRetryAt: e.nextRetryAt,
        status: Fl.SinkStatusSerializer._toJsonObject(e.status),
        uid: e.uid,
        updatedAt: e.updatedAt
      };
    }
  };
});

// node_modules/svix/dist/models/listResponseStreamSinkOut.js
var Nl = o((Dn) => {
  "use strict";
  Object.defineProperty(Dn, "__esModule", { value: !0 });
  Dn.ListResponseStreamSinkOutSerializer = void 0;
  var Bl = ys();
  Dn.ListResponseStreamSinkOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => Bl.StreamSinkOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => Bl.StreamSinkOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    }
  };
});

// node_modules/svix/dist/models/sinkSecretOut.js
var $l = o((Ln) => {
  "use strict";
  Object.defineProperty(Ln, "__esModule", { value: !0 });
  Ln.SinkSecretOutSerializer = void 0;
  Ln.SinkSecretOutSerializer = {
    _fromJsonObject(e) {
      return {
        key: e.key
      };
    },
    _toJsonObject(e) {
      return {
        key: e.key
      };
    }
  };
});

// node_modules/svix/dist/models/sinkTransformIn.js
var Kl = o((Un) => {
  "use strict";
  Object.defineProperty(Un, "__esModule", { value: !0 });
  Un.SinkTransformInSerializer = void 0;
  Un.SinkTransformInSerializer = {
    _fromJsonObject(e) {
      return {
        code: e.code
      };
    },
    _toJsonObject(e) {
      return {
        code: e.code
      };
    }
  };
});

// node_modules/svix/dist/models/sinkStatusIn.js
var Fn = o((qe) => {
  "use strict";
  Object.defineProperty(qe, "__esModule", { value: !0 });
  qe.SinkStatusInSerializer = qe.SinkStatusIn = void 0;
  var cg;
  (function(e) {
    e.Enabled = "enabled", e.Disabled = "disabled";
  })(cg = qe.SinkStatusIn || (qe.SinkStatusIn = {}));
  qe.SinkStatusInSerializer = {
    _fromJsonObject(e) {
      return e;
    },
    _toJsonObject(e) {
      return e;
    }
  };
});

// node_modules/svix/dist/models/streamSinkIn.js
var Xl = o((Bn) => {
  "use strict";
  Object.defineProperty(Bn, "__esModule", { value: !0 });
  Bn.StreamSinkInSerializer = void 0;
  var Gl = _s(), Wl = gs(), Vl = vs(), Ql = hs(), Yl = Os(), Zl = Fn();
  Bn.StreamSinkInSerializer = {
    _fromJsonObject(e) {
      let t = e.type;
      function r(i) {
        switch (i) {
          case "poller":
            return {};
          case "azureBlobStorage":
            return Gl.AzureBlobStorageConfigSerializer._fromJsonObject(e.config);
          case "otelTracing":
            return Yl.SinkOtelV1ConfigSerializer._fromJsonObject(e.config);
          case "http":
            return Ql.SinkHttpConfigSerializer._fromJsonObject(e.config);
          case "amazonS3":
            return Vl.S3ConfigSerializer._fromJsonObject(e.config);
          case "googleCloudStorage":
            return Wl.GoogleCloudStorageConfigSerializer._fromJsonObject(e.config);
          default:
            throw new Error(`Unexpected type: ${i}`);
        }
      }
      return a(r, "getConfig"), {
        type: t,
        config: r(t),
        batchSize: e.batchSize,
        eventTypes: e.eventTypes,
        maxWaitSecs: e.maxWaitSecs,
        metadata: e.metadata,
        status: e.status ? Zl.SinkStatusInSerializer._fromJsonObject(e.status) : void 0,
        uid: e.uid
      };
    },
    _toJsonObject(e) {
      let t;
      switch (e.type) {
        case "poller":
          t = {};
          break;
        case "azureBlobStorage":
          t = Gl.AzureBlobStorageConfigSerializer._toJsonObject(e.config);
          break;
        case "otelTracing":
          t = Yl.SinkOtelV1ConfigSerializer._toJsonObject(e.config);
          break;
        case "http":
          t = Ql.SinkHttpConfigSerializer._toJsonObject(e.config);
          break;
        case "amazonS3":
          t = Vl.S3ConfigSerializer._toJsonObject(e.config);
          break;
        case "googleCloudStorage":
          t = Wl.GoogleCloudStorageConfigSerializer._toJsonObject(e.config);
          break;
      }
      return {
        type: e.type,
        config: t,
        batchSize: e.batchSize,
        eventTypes: e.eventTypes,
        maxWaitSecs: e.maxWaitSecs,
        metadata: e.metadata,
        status: e.status ? Zl.SinkStatusInSerializer._toJsonObject(e.status) : void 0,
        uid: e.uid
      };
    }
  };
});

// node_modules/svix/dist/models/amazonS3PatchConfig.js
var ep = o((Nn) => {
  "use strict";
  Object.defineProperty(Nn, "__esModule", { value: !0 });
  Nn.AmazonS3PatchConfigSerializer = void 0;
  Nn.AmazonS3PatchConfigSerializer = {
    _fromJsonObject(e) {
      return {
        accessKeyId: e.accessKeyId,
        bucket: e.bucket,
        region: e.region,
        secretAccessKey: e.secretAccessKey
      };
    },
    _toJsonObject(e) {
      return {
        accessKeyId: e.accessKeyId,
        bucket: e.bucket,
        region: e.region,
        secretAccessKey: e.secretAccessKey
      };
    }
  };
});

// node_modules/svix/dist/models/azureBlobStoragePatchConfig.js
var tp = o(($n) => {
  "use strict";
  Object.defineProperty($n, "__esModule", { value: !0 });
  $n.AzureBlobStoragePatchConfigSerializer = void 0;
  $n.AzureBlobStoragePatchConfigSerializer = {
    _fromJsonObject(e) {
      return {
        accessKey: e.accessKey,
        account: e.account,
        container: e.container
      };
    },
    _toJsonObject(e) {
      return {
        accessKey: e.accessKey,
        account: e.account,
        container: e.container
      };
    }
  };
});

// node_modules/svix/dist/models/googleCloudStoragePatchConfig.js
var rp = o((Kn) => {
  "use strict";
  Object.defineProperty(Kn, "__esModule", { value: !0 });
  Kn.GoogleCloudStoragePatchConfigSerializer = void 0;
  Kn.GoogleCloudStoragePatchConfigSerializer = {
    _fromJsonObject(e) {
      return {
        bucket: e.bucket,
        credentials: e.credentials
      };
    },
    _toJsonObject(e) {
      return {
        bucket: e.bucket,
        credentials: e.credentials
      };
    }
  };
});

// node_modules/svix/dist/models/httpPatchConfig.js
var ip = o((Gn) => {
  "use strict";
  Object.defineProperty(Gn, "__esModule", { value: !0 });
  Gn.HttpPatchConfigSerializer = void 0;
  Gn.HttpPatchConfigSerializer = {
    _fromJsonObject(e) {
      return {
        url: e.url
      };
    },
    _toJsonObject(e) {
      return {
        url: e.url
      };
    }
  };
});

// node_modules/svix/dist/models/otelTracingPatchConfig.js
var np = o((Wn) => {
  "use strict";
  Object.defineProperty(Wn, "__esModule", { value: !0 });
  Wn.OtelTracingPatchConfigSerializer = void 0;
  Wn.OtelTracingPatchConfigSerializer = {
    _fromJsonObject(e) {
      return {
        url: e.url
      };
    },
    _toJsonObject(e) {
      return {
        url: e.url
      };
    }
  };
});

// node_modules/svix/dist/models/streamSinkPatch.js
var lp = o((Vn) => {
  "use strict";
  Object.defineProperty(Vn, "__esModule", { value: !0 });
  Vn.StreamSinkPatchSerializer = void 0;
  var ap = ep(), sp = tp(), op = rp(), up = ip(), dp = np(), cp = Fn();
  Vn.StreamSinkPatchSerializer = {
    _fromJsonObject(e) {
      let t = e.type;
      function r(i) {
        switch (i) {
          case "poller":
            return {};
          case "azureBlobStorage":
            return sp.AzureBlobStoragePatchConfigSerializer._fromJsonObject(e.config);
          case "otelTracing":
            return dp.OtelTracingPatchConfigSerializer._fromJsonObject(e.config);
          case "http":
            return up.HttpPatchConfigSerializer._fromJsonObject(e.config);
          case "amazonS3":
            return ap.AmazonS3PatchConfigSerializer._fromJsonObject(e.config);
          case "googleCloudStorage":
            return op.GoogleCloudStoragePatchConfigSerializer._fromJsonObject(e.config);
          default:
            throw new Error(`Unexpected type: ${i}`);
        }
      }
      return a(r, "getConfig"), {
        type: t,
        config: r(t),
        batchSize: e.batchSize,
        eventTypes: e.eventTypes,
        maxWaitSecs: e.maxWaitSecs,
        metadata: e.metadata,
        status: e.status ? cp.SinkStatusInSerializer._fromJsonObject(e.status) : void 0,
        uid: e.uid
      };
    },
    _toJsonObject(e) {
      let t;
      switch (e.type) {
        case "poller":
          t = {};
          break;
        case "azureBlobStorage":
          t = sp.AzureBlobStoragePatchConfigSerializer._toJsonObject(e.config);
          break;
        case "otelTracing":
          t = dp.OtelTracingPatchConfigSerializer._toJsonObject(e.config);
          break;
        case "http":
          t = up.HttpPatchConfigSerializer._toJsonObject(e.config);
          break;
        case "amazonS3":
          t = ap.AmazonS3PatchConfigSerializer._toJsonObject(e.config);
          break;
        case "googleCloudStorage":
          t = op.GoogleCloudStoragePatchConfigSerializer._toJsonObject(e.config);
          break;
      }
      return {
        type: e.type,
        config: t,
        batchSize: e.batchSize,
        eventTypes: e.eventTypes,
        maxWaitSecs: e.maxWaitSecs,
        metadata: e.metadata,
        status: e.status ? cp.SinkStatusInSerializer._toJsonObject(e.status) : void 0,
        uid: e.uid
      };
    }
  };
});

// node_modules/svix/dist/api/streamingSink.js
var fp = o((Yn) => {
  "use strict";
  Object.defineProperty(Yn, "__esModule", { value: !0 });
  Yn.StreamingSink = void 0;
  var pp = ts(), lg = Ma(), pg = Nl(), mg = $l(), fg = Kl(), mp = Xl(), Qn = ys(), _g = lp(), A = k(), bs = class {
    static {
      a(this, "StreamingSink");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    list(t, r) {
      let i = new A.SvixRequest(A.HttpMethod.GET, "/api/v1/stream/{stream_id}/sink");
      return i.setPathParam("stream_id", t), i.setQueryParams({
        limit: r?.limit,
        iterator: r?.iterator,
        order: r?.order
      }), i.send(this.requestCtx, pg.ListResponseStreamSinkOutSerializer._fromJsonObject);
    }
    create(t, r, i) {
      let n = new A.SvixRequest(A.HttpMethod.POST, "/api/v1/stream/{stream_id}/sink");
      return n.setPathParam("stream_id", t), n.setHeaderParam("idempotency-key", i?.idempotencyKey), n.setBody(mp.StreamSinkInSerializer._toJsonObject(r)), n.send(this.requestCtx, Qn.StreamSinkOutSerializer._fromJsonObject);
    }
    get(t, r) {
      let i = new A.SvixRequest(A.HttpMethod.GET, "/api/v1/stream/{stream_id}/sink/{sink_id}");
      return i.setPathParam("stream_id", t), i.setPathParam("sink_id", r), i.send(this.requestCtx, Qn.StreamSinkOutSerializer._fromJsonObject);
    }
    update(t, r, i) {
      let n = new A.SvixRequest(A.HttpMethod.PUT, "/api/v1/stream/{stream_id}/sink/{sink_id}");
      return n.setPathParam("stream_id", t), n.setPathParam("sink_id", r), n.setBody(mp.StreamSinkInSerializer._toJsonObject(i)), n.send(this.requestCtx, Qn.StreamSinkOutSerializer._fromJsonObject);
    }
    delete(t, r) {
      let i = new A.SvixRequest(A.HttpMethod.DELETE, "/api/v1/stream/{stream_id}/sink/{sink_id}");
      return i.setPathParam("stream_id", t), i.setPathParam("sink_id", r), i.sendNoResponseBody(this.requestCtx);
    }
    patch(t, r, i) {
      let n = new A.SvixRequest(A.HttpMethod.PATCH, "/api/v1/stream/{stream_id}/sink/{sink_id}");
      return n.setPathParam("stream_id", t), n.setPathParam("sink_id", r), n.setBody(_g.StreamSinkPatchSerializer._toJsonObject(i)), n.send(this.requestCtx, Qn.StreamSinkOutSerializer._fromJsonObject);
    }
    getSecret(t, r) {
      let i = new A.SvixRequest(A.HttpMethod.GET, "/api/v1/stream/{stream_id}/sink/{sink_id}/secret");
      return i.setPathParam("stream_id", t), i.setPathParam("sink_id", r), i.send(this.requestCtx, mg.SinkSecretOutSerializer._fromJsonObject);
    }
    rotateSecret(t, r, i, n) {
      let s = new A.SvixRequest(A.HttpMethod.POST, "/api/v1/stream/{stream_id}/sink/{sink_id}/secret/rotate");
      return s.setPathParam("stream_id", t), s.setPathParam("sink_id", r), s.setHeaderParam("idempotency-key", n?.idempotencyKey), s.setBody(lg.EndpointSecretRotateInSerializer._toJsonObject(i)), s.send(this.requestCtx, pp.EmptyResponseSerializer._fromJsonObject);
    }
    transformationPartialUpdate(t, r, i) {
      let n = new A.SvixRequest(A.HttpMethod.PATCH, "/api/v1/stream/{stream_id}/sink/{sink_id}/transformation");
      return n.setPathParam("stream_id", t), n.setPathParam("sink_id", r), n.setBody(fg.SinkTransformInSerializer._toJsonObject(i)), n.send(this.requestCtx, pp.EmptyResponseSerializer._fromJsonObject);
    }
  };
  Yn.StreamingSink = bs;
});

// node_modules/svix/dist/models/streamOut.js
var Ps = o((Zn) => {
  "use strict";
  Object.defineProperty(Zn, "__esModule", { value: !0 });
  Zn.StreamOutSerializer = void 0;
  Zn.StreamOutSerializer = {
    _fromJsonObject(e) {
      return {
        createdAt: new Date(e.createdAt),
        id: e.id,
        metadata: e.metadata,
        name: e.name,
        uid: e.uid,
        updatedAt: new Date(e.updatedAt)
      };
    },
    _toJsonObject(e) {
      return {
        createdAt: e.createdAt,
        id: e.id,
        metadata: e.metadata,
        name: e.name,
        uid: e.uid,
        updatedAt: e.updatedAt
      };
    }
  };
});

// node_modules/svix/dist/models/listResponseStreamOut.js
var gp = o((Xn) => {
  "use strict";
  Object.defineProperty(Xn, "__esModule", { value: !0 });
  Xn.ListResponseStreamOutSerializer = void 0;
  var _p = Ps();
  Xn.ListResponseStreamOutSerializer = {
    _fromJsonObject(e) {
      return {
        data: e.data.map((t) => _p.StreamOutSerializer._fromJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    },
    _toJsonObject(e) {
      return {
        data: e.data.map((t) => _p.StreamOutSerializer._toJsonObject(t)),
        done: e.done,
        iterator: e.iterator,
        prevIterator: e.prevIterator
      };
    }
  };
});

// node_modules/svix/dist/models/streamPatch.js
var vp = o((ea) => {
  "use strict";
  Object.defineProperty(ea, "__esModule", { value: !0 });
  ea.StreamPatchSerializer = void 0;
  ea.StreamPatchSerializer = {
    _fromJsonObject(e) {
      return {
        description: e.description,
        metadata: e.metadata,
        uid: e.uid
      };
    },
    _toJsonObject(e) {
      return {
        description: e.description,
        metadata: e.metadata,
        uid: e.uid
      };
    }
  };
});

// node_modules/svix/dist/api/streamingStream.js
var Op = o((ra) => {
  "use strict";
  Object.defineProperty(ra, "__esModule", { value: !0 });
  ra.StreamingStream = void 0;
  var gg = gp(), hp = ms(), ta = Ps(), vg = vp(), ie = k(), qs = class {
    static {
      a(this, "StreamingStream");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    list(t) {
      let r = new ie.SvixRequest(ie.HttpMethod.GET, "/api/v1/stream");
      return r.setQueryParams({
        limit: t?.limit,
        iterator: t?.iterator,
        order: t?.order
      }), r.send(this.requestCtx, gg.ListResponseStreamOutSerializer._fromJsonObject);
    }
    create(t, r) {
      let i = new ie.SvixRequest(ie.HttpMethod.POST, "/api/v1/stream");
      return i.setHeaderParam("idempotency-key", r?.idempotencyKey), i.setBody(hp.StreamInSerializer._toJsonObject(t)), i.send(this.requestCtx, ta.StreamOutSerializer._fromJsonObject);
    }
    get(t) {
      let r = new ie.SvixRequest(ie.HttpMethod.GET, "/api/v1/stream/{stream_id}");
      return r.setPathParam("stream_id", t), r.send(this.requestCtx, ta.StreamOutSerializer._fromJsonObject);
    }
    update(t, r) {
      let i = new ie.SvixRequest(ie.HttpMethod.PUT, "/api/v1/stream/{stream_id}");
      return i.setPathParam("stream_id", t), i.setBody(hp.StreamInSerializer._toJsonObject(r)), i.send(this.requestCtx, ta.StreamOutSerializer._fromJsonObject);
    }
    delete(t) {
      let r = new ie.SvixRequest(ie.HttpMethod.DELETE, "/api/v1/stream/{stream_id}");
      return r.setPathParam("stream_id", t), r.sendNoResponseBody(this.requestCtx);
    }
    patch(t, r) {
      let i = new ie.SvixRequest(ie.HttpMethod.PATCH, "/api/v1/stream/{stream_id}");
      return i.setPathParam("stream_id", t), i.setBody(vg.StreamPatchSerializer._toJsonObject(r)), i.send(this.requestCtx, ta.StreamOutSerializer._fromJsonObject);
    }
  };
  ra.StreamingStream = qs;
});

// node_modules/svix/dist/api/streaming.js
var yp = o((ia) => {
  "use strict";
  Object.defineProperty(ia, "__esModule", { value: !0 });
  ia.Streaming = void 0;
  var Sp = Ea(), hg = Sl(), Og = yl(), Sg = Jl(), yg = Al(), bg = fp(), Pg = Op(), we = k(), zs = class {
    static {
      a(this, "Streaming");
    }
    constructor(t) {
      this.requestCtx = t;
    }
    get event_type() {
      return new Sg.StreamingEventType(this.requestCtx);
    }
    get events() {
      return new yg.StreamingEvents(this.requestCtx);
    }
    get sink() {
      return new bg.StreamingSink(this.requestCtx);
    }
    get stream() {
      return new Pg.StreamingStream(this.requestCtx);
    }
    sinkHeadersGet(t, r) {
      let i = new we.SvixRequest(we.HttpMethod.GET, "/api/v1/stream/{stream_id}/sink/{sink_id}/headers");
      return i.setPathParam("stream_id", t), i.setPathParam("sink_id", r), i.send(this.requestCtx, Sp.EndpointHeadersOutSerializer._fromJsonObject);
    }
    sinkHeadersPatch(t, r, i) {
      let n = new we.SvixRequest(we.HttpMethod.PATCH, "/api/v1/stream/{stream_id}/sink/{sink_id}/headers");
      return n.setPathParam("stream_id", t), n.setPathParam("sink_id", r), n.setBody(hg.HttpSinkHeadersPatchInSerializer._toJsonObject(i)), n.send(this.requestCtx, Sp.EndpointHeadersOutSerializer._fromJsonObject);
    }
    sinkTransformationGet(t, r) {
      let i = new we.SvixRequest(we.HttpMethod.GET, "/api/v1/stream/{stream_id}/sink/{sink_id}/transformation");
      return i.setPathParam("stream_id", t), i.setPathParam("sink_id", r), i.send(this.requestCtx, Og.SinkTransformationOutSerializer._fromJsonObject);
    }
  };
  ia.Streaming = zs;
});

// node_modules/svix/dist/HttpErrors.js
var bp = o((le) => {
  "use strict";
  Object.defineProperty(le, "__esModule", { value: !0 });
  le.HTTPValidationError = le.ValidationError = le.HttpErrorOut = void 0;
  var je = class e {
    static {
      a(this, "HttpErrorOut");
    }
    static getAttributeTypeMap() {
      return e.attributeTypeMap;
    }
  };
  le.HttpErrorOut = je;
  je.discriminator = void 0;
  je.mapping = void 0;
  je.attributeTypeMap = [
    {
      name: "code",
      baseName: "code",
      type: "string",
      format: ""
    },
    {
      name: "detail",
      baseName: "detail",
      type: "string",
      format: ""
    }
  ];
  var Ee = class e {
    static {
      a(this, "ValidationError");
    }
    static getAttributeTypeMap() {
      return e.attributeTypeMap;
    }
  };
  le.ValidationError = Ee;
  Ee.discriminator = void 0;
  Ee.mapping = void 0;
  Ee.attributeTypeMap = [
    {
      name: "loc",
      baseName: "loc",
      type: "Array<string>",
      format: ""
    },
    {
      name: "msg",
      baseName: "msg",
      type: "string",
      format: ""
    },
    {
      name: "type",
      baseName: "type",
      type: "string",
      format: ""
    }
  ];
  var Ie = class e {
    static {
      a(this, "HTTPValidationError");
    }
    static getAttributeTypeMap() {
      return e.attributeTypeMap;
    }
  };
  le.HTTPValidationError = Ie;
  Ie.discriminator = void 0;
  Ie.mapping = void 0;
  Ie.attributeTypeMap = [
    {
      name: "detail",
      baseName: "detail",
      type: "Array<ValidationError>",
      format: ""
    }
  ];
});

// node_modules/standardwebhooks/dist/timing_safe_equal.js
var qp = o((na) => {
  "use strict";
  Object.defineProperty(na, "__esModule", { value: !0 });
  na.timingSafeEqual = void 0;
  function Pp(e, t = "") {
    if (!e)
      throw new Error(t);
  }
  a(Pp, "assert");
  function qg(e, t) {
    if (e.byteLength !== t.byteLength)
      return !1;
    e instanceof DataView || (e = new DataView(ArrayBuffer.isView(e) ? e.buffer : e)), t instanceof DataView || (t = new DataView(ArrayBuffer.isView(t) ? t.buffer : t)), Pp(e instanceof DataView), Pp(t instanceof DataView);
    let r = e.byteLength, i = 0, n = -1;
    for (; ++n < r; )
      i |= e.getUint8(n) ^ t.getUint8(n);
    return i === 0;
  }
  a(qg, "timingSafeEqual");
  na.timingSafeEqual = qg;
});

// node_modules/@stablelib/base64/lib/base64.js
var Jp = o((Y) => {
  "use strict";
  var zg = Y && Y.__extends || /* @__PURE__ */ (function() {
    var e = /* @__PURE__ */ a(function(t, r) {
      return e = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(i, n) {
        i.__proto__ = n;
      } || function(i, n) {
        for (var s in n) n.hasOwnProperty(s) && (i[s] = n[s]);
      }, e(t, r);
    }, "extendStatics");
    return function(t, r) {
      e(t, r);
      function i() {
        this.constructor = t;
      }
      a(i, "__"), t.prototype = r === null ? Object.create(r) : (i.prototype = r.prototype, new i());
    };
  })();
  Object.defineProperty(Y, "__esModule", { value: !0 });
  var T = 256, xs = (
    /** @class */
    (function() {
      function e(t) {
        t === void 0 && (t = "="), this._paddingCharacter = t;
      }
      return a(e, "Coder"), e.prototype.encodedLength = function(t) {
        return this._paddingCharacter ? (t + 2) / 3 * 4 | 0 : (t * 8 + 5) / 6 | 0;
      }, e.prototype.encode = function(t) {
        for (var r = "", i = 0; i < t.length - 2; i += 3) {
          var n = t[i] << 16 | t[i + 1] << 8 | t[i + 2];
          r += this._encodeByte(n >>> 18 & 63), r += this._encodeByte(n >>> 12 & 63), r += this._encodeByte(n >>> 6 & 63), r += this._encodeByte(n >>> 0 & 63);
        }
        var s = t.length - i;
        if (s > 0) {
          var n = t[i] << 16 | (s === 2 ? t[i + 1] << 8 : 0);
          r += this._encodeByte(n >>> 18 & 63), r += this._encodeByte(n >>> 12 & 63), s === 2 ? r += this._encodeByte(n >>> 6 & 63) : r += this._paddingCharacter || "", r += this._paddingCharacter || "";
        }
        return r;
      }, e.prototype.maxDecodedLength = function(t) {
        return this._paddingCharacter ? t / 4 * 3 | 0 : (t * 6 + 7) / 8 | 0;
      }, e.prototype.decodedLength = function(t) {
        return this.maxDecodedLength(t.length - this._getPaddingLength(t));
      }, e.prototype.decode = function(t) {
        if (t.length === 0)
          return new Uint8Array(0);
        for (var r = this._getPaddingLength(t), i = t.length - r, n = new Uint8Array(this.maxDecodedLength(i)), s = 0, u = 0, m = 0, p = 0, c = 0, g = 0, _ = 0; u < i - 4; u += 4)
          p = this._decodeChar(t.charCodeAt(u + 0)), c = this._decodeChar(t.charCodeAt(u + 1)), g = this._decodeChar(t.charCodeAt(u + 2)), _ = this._decodeChar(t.charCodeAt(u + 3)), n[s++] = p << 2 | c >>> 4, n[s++] = c << 4 | g >>> 2, n[s++] = g << 6 | _, m |= p & T, m |= c & T, m |= g & T, m |= _ & T;
        if (u < i - 1 && (p = this._decodeChar(t.charCodeAt(u)), c = this._decodeChar(t.charCodeAt(u + 1)), n[s++] = p << 2 | c >>> 4, m |= p & T, m |= c & T), u < i - 2 && (g = this._decodeChar(t.charCodeAt(u + 2)), n[s++] = c << 4 | g >>> 2, m |= g & T), u < i - 3 && (_ = this._decodeChar(t.charCodeAt(u + 3)), n[s++] = g << 6 | _, m |= _ & T), m !== 0)
          throw new Error("Base64Coder: incorrect characters for decoding");
        return n;
      }, e.prototype._encodeByte = function(t) {
        var r = t;
        return r += 65, r += 25 - t >>> 8 & 6, r += 51 - t >>> 8 & -75, r += 61 - t >>> 8 & -15, r += 62 - t >>> 8 & 3, String.fromCharCode(r);
      }, e.prototype._decodeChar = function(t) {
        var r = T;
        return r += (42 - t & t - 44) >>> 8 & -T + t - 43 + 62, r += (46 - t & t - 48) >>> 8 & -T + t - 47 + 63, r += (47 - t & t - 58) >>> 8 & -T + t - 48 + 52, r += (64 - t & t - 91) >>> 8 & -T + t - 65 + 0, r += (96 - t & t - 123) >>> 8 & -T + t - 97 + 26, r;
      }, e.prototype._getPaddingLength = function(t) {
        var r = 0;
        if (this._paddingCharacter) {
          for (var i = t.length - 1; i >= 0 && t[i] === this._paddingCharacter; i--)
            r++;
          if (t.length < 4 || r > 2)
            throw new Error("Base64Coder: incorrect padding");
        }
        return r;
      }, e;
    })()
  );
  Y.Coder = xs;
  var We = new xs();
  function xg(e) {
    return We.encode(e);
  }
  a(xg, "encode");
  Y.encode = xg;
  function Jg(e) {
    return We.decode(e);
  }
  a(Jg, "decode");
  Y.decode = Jg;
  var zp = (
    /** @class */
    (function(e) {
      zg(t, e);
      function t() {
        return e !== null && e.apply(this, arguments) || this;
      }
      return a(t, "URLSafeCoder"), t.prototype._encodeByte = function(r) {
        var i = r;
        return i += 65, i += 25 - r >>> 8 & 6, i += 51 - r >>> 8 & -75, i += 61 - r >>> 8 & -13, i += 62 - r >>> 8 & 49, String.fromCharCode(i);
      }, t.prototype._decodeChar = function(r) {
        var i = T;
        return i += (44 - r & r - 46) >>> 8 & -T + r - 45 + 62, i += (94 - r & r - 96) >>> 8 & -T + r - 95 + 63, i += (47 - r & r - 58) >>> 8 & -T + r - 48 + 52, i += (64 - r & r - 91) >>> 8 & -T + r - 65 + 0, i += (96 - r & r - 123) >>> 8 & -T + r - 97 + 26, i;
      }, t;
    })(xs)
  );
  Y.URLSafeCoder = zp;
  var xp = new zp();
  function kg(e) {
    return xp.encode(e);
  }
  a(kg, "encodeURLSafe");
  Y.encodeURLSafe = kg;
  function Cg(e) {
    return xp.decode(e);
  }
  a(Cg, "decodeURLSafe");
  Y.decodeURLSafe = Cg;
  Y.encodedLength = function(e) {
    return We.encodedLength(e);
  };
  Y.maxDecodedLength = function(e) {
    return We.maxDecodedLength(e);
  };
  Y.decodedLength = function(e) {
    return We.decodedLength(e);
  };
});

// node_modules/fast-sha256/sha256.js
var Cp = o((kp, aa) => {
  (function(e, t) {
    var r = {};
    t(r);
    var i = r.default;
    for (var n in r)
      i[n] = r[n];
    typeof aa == "object" && typeof aa.exports == "object" ? aa.exports = i : typeof define == "function" && define.amd ? define(function() {
      return i;
    }) : e.sha256 = i;
  })(kp, function(e) {
    "use strict";
    e.__esModule = !0, e.digestLength = 32, e.blockSize = 64;
    var t = new Uint32Array([
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
    function r(_, d, l, f, z) {
      for (var O, S, v, j, J, x, Z, E, R, I, He, De, Ve; z >= 64; ) {
        for (O = d[0], S = d[1], v = d[2], j = d[3], J = d[4], x = d[5], Z = d[6], E = d[7], I = 0; I < 16; I++)
          He = f + I * 4, _[I] = (l[He] & 255) << 24 | (l[He + 1] & 255) << 16 | (l[He + 2] & 255) << 8 | l[He + 3] & 255;
        for (I = 16; I < 64; I++)
          R = _[I - 2], De = (R >>> 17 | R << 15) ^ (R >>> 19 | R << 13) ^ R >>> 10, R = _[I - 15], Ve = (R >>> 7 | R << 25) ^ (R >>> 18 | R << 14) ^ R >>> 3, _[I] = (De + _[I - 7] | 0) + (Ve + _[I - 16] | 0);
        for (I = 0; I < 64; I++)
          De = (((J >>> 6 | J << 26) ^ (J >>> 11 | J << 21) ^ (J >>> 25 | J << 7)) + (J & x ^ ~J & Z) | 0) + (E + (t[I] + _[I] | 0) | 0) | 0, Ve = ((O >>> 2 | O << 30) ^ (O >>> 13 | O << 19) ^ (O >>> 22 | O << 10)) + (O & S ^ O & v ^ S & v) | 0, E = Z, Z = x, x = J, J = j + De | 0, j = v, v = S, S = O, O = De + Ve | 0;
        d[0] += O, d[1] += S, d[2] += v, d[3] += j, d[4] += J, d[5] += x, d[6] += Z, d[7] += E, f += 64, z -= 64;
      }
      return f;
    }
    a(r, "hashBlocks");
    var i = (
      /** @class */
      (function() {
        function _() {
          this.digestLength = e.digestLength, this.blockSize = e.blockSize, this.state = new Int32Array(8), this.temp = new Int32Array(64), this.buffer = new Uint8Array(128), this.bufferLength = 0, this.bytesHashed = 0, this.finished = !1, this.reset();
        }
        return a(_, "Hash"), _.prototype.reset = function() {
          return this.state[0] = 1779033703, this.state[1] = 3144134277, this.state[2] = 1013904242, this.state[3] = 2773480762, this.state[4] = 1359893119, this.state[5] = 2600822924, this.state[6] = 528734635, this.state[7] = 1541459225, this.bufferLength = 0, this.bytesHashed = 0, this.finished = !1, this;
        }, _.prototype.clean = function() {
          for (var d = 0; d < this.buffer.length; d++)
            this.buffer[d] = 0;
          for (var d = 0; d < this.temp.length; d++)
            this.temp[d] = 0;
          this.reset();
        }, _.prototype.update = function(d, l) {
          if (l === void 0 && (l = d.length), this.finished)
            throw new Error("SHA256: can't update because hash was finished.");
          var f = 0;
          if (this.bytesHashed += l, this.bufferLength > 0) {
            for (; this.bufferLength < 64 && l > 0; )
              this.buffer[this.bufferLength++] = d[f++], l--;
            this.bufferLength === 64 && (r(this.temp, this.state, this.buffer, 0, 64), this.bufferLength = 0);
          }
          for (l >= 64 && (f = r(this.temp, this.state, d, f, l), l %= 64); l > 0; )
            this.buffer[this.bufferLength++] = d[f++], l--;
          return this;
        }, _.prototype.finish = function(d) {
          if (!this.finished) {
            var l = this.bytesHashed, f = this.bufferLength, z = l / 536870912 | 0, O = l << 3, S = l % 64 < 56 ? 64 : 128;
            this.buffer[f] = 128;
            for (var v = f + 1; v < S - 8; v++)
              this.buffer[v] = 0;
            this.buffer[S - 8] = z >>> 24 & 255, this.buffer[S - 7] = z >>> 16 & 255, this.buffer[S - 6] = z >>> 8 & 255, this.buffer[S - 5] = z >>> 0 & 255, this.buffer[S - 4] = O >>> 24 & 255, this.buffer[S - 3] = O >>> 16 & 255, this.buffer[S - 2] = O >>> 8 & 255, this.buffer[S - 1] = O >>> 0 & 255, r(this.temp, this.state, this.buffer, 0, S), this.finished = !0;
          }
          for (var v = 0; v < 8; v++)
            d[v * 4 + 0] = this.state[v] >>> 24 & 255, d[v * 4 + 1] = this.state[v] >>> 16 & 255, d[v * 4 + 2] = this.state[v] >>> 8 & 255, d[v * 4 + 3] = this.state[v] >>> 0 & 255;
          return this;
        }, _.prototype.digest = function() {
          var d = new Uint8Array(this.digestLength);
          return this.finish(d), d;
        }, _.prototype._saveState = function(d) {
          for (var l = 0; l < this.state.length; l++)
            d[l] = this.state[l];
        }, _.prototype._restoreState = function(d, l) {
          for (var f = 0; f < this.state.length; f++)
            this.state[f] = d[f];
          this.bytesHashed = l, this.finished = !1, this.bufferLength = 0;
        }, _;
      })()
    );
    e.Hash = i;
    var n = (
      /** @class */
      (function() {
        function _(d) {
          this.inner = new i(), this.outer = new i(), this.blockSize = this.inner.blockSize, this.digestLength = this.inner.digestLength;
          var l = new Uint8Array(this.blockSize);
          if (d.length > this.blockSize)
            new i().update(d).finish(l).clean();
          else
            for (var f = 0; f < d.length; f++)
              l[f] = d[f];
          for (var f = 0; f < l.length; f++)
            l[f] ^= 54;
          this.inner.update(l);
          for (var f = 0; f < l.length; f++)
            l[f] ^= 106;
          this.outer.update(l), this.istate = new Uint32Array(8), this.ostate = new Uint32Array(8), this.inner._saveState(this.istate), this.outer._saveState(this.ostate);
          for (var f = 0; f < l.length; f++)
            l[f] = 0;
        }
        return a(_, "HMAC"), _.prototype.reset = function() {
          return this.inner._restoreState(this.istate, this.inner.blockSize), this.outer._restoreState(this.ostate, this.outer.blockSize), this;
        }, _.prototype.clean = function() {
          for (var d = 0; d < this.istate.length; d++)
            this.ostate[d] = this.istate[d] = 0;
          this.inner.clean(), this.outer.clean();
        }, _.prototype.update = function(d) {
          return this.inner.update(d), this;
        }, _.prototype.finish = function(d) {
          return this.outer.finished ? this.outer.finish(d) : (this.inner.finish(d), this.outer.update(d, this.digestLength).finish(d)), this;
        }, _.prototype.digest = function() {
          var d = new Uint8Array(this.digestLength);
          return this.finish(d), d;
        }, _;
      })()
    );
    e.HMAC = n;
    function s(_) {
      var d = new i().update(_), l = d.digest();
      return d.clean(), l;
    }
    a(s, "hash"), e.hash = s, e.default = s;
    function u(_, d) {
      var l = new n(_).update(d), f = l.digest();
      return l.clean(), f;
    }
    a(u, "hmac"), e.hmac = u;
    function m(_, d, l, f) {
      var z = f[0];
      if (z === 0)
        throw new Error("hkdf: cannot expand more");
      d.reset(), z > 1 && d.update(_), l && d.update(l), d.update(f), d.finish(_), f[0]++;
    }
    a(m, "fillBuffer");
    var p = new Uint8Array(e.digestLength);
    function c(_, d, l, f) {
      d === void 0 && (d = p), f === void 0 && (f = 32);
      for (var z = new Uint8Array([1]), O = u(d, _), S = new n(O), v = new Uint8Array(S.digestLength), j = v.length, J = new Uint8Array(f), x = 0; x < f; x++)
        j === v.length && (m(v, S, l, z), j = 0), J[x] = v[j++];
      return S.clean(), v.fill(0), z.fill(0), J;
    }
    a(c, "hkdf"), e.hkdf = c;
    function g(_, d, l, f) {
      for (var z = new n(_), O = z.digestLength, S = new Uint8Array(4), v = new Uint8Array(O), j = new Uint8Array(O), J = new Uint8Array(f), x = 0; x * O < f; x++) {
        var Z = x + 1;
        S[0] = Z >>> 24 & 255, S[1] = Z >>> 16 & 255, S[2] = Z >>> 8 & 255, S[3] = Z >>> 0 & 255, z.reset(), z.update(d), z.update(S), z.finish(j);
        for (var E = 0; E < O; E++)
          v[E] = j[E];
        for (var E = 2; E <= l; E++) {
          z.reset(), z.update(j).finish(j);
          for (var R = 0; R < O; R++)
            v[R] ^= j[R];
        }
        for (var E = 0; E < O && x * O + E < f; E++)
          J[x * O + E] = v[E];
      }
      for (var x = 0; x < O; x++)
        v[x] = j[x] = 0;
      for (var x = 0; x < 4; x++)
        S[x] = 0;
      return z.clean(), J;
    }
    a(g, "pbkdf2"), e.pbkdf2 = g;
  });
});

// node_modules/standardwebhooks/dist/index.js
var ks = o((Me) => {
  "use strict";
  Object.defineProperty(Me, "__esModule", { value: !0 });
  Me.Webhook = Me.WebhookVerificationError = void 0;
  var Tg = qp(), Tp = Jp(), wg = Cp(), wp = 300, Js = class e extends Error {
    static {
      a(this, "ExtendableError");
    }
    constructor(t) {
      super(t), Object.setPrototypeOf(this, e.prototype), this.name = "ExtendableError", this.stack = new Error(t).stack;
    }
  }, pe = class e extends Js {
    static {
      a(this, "WebhookVerificationError");
    }
    constructor(t) {
      super(t), Object.setPrototypeOf(this, e.prototype), this.name = "WebhookVerificationError";
    }
  };
  Me.WebhookVerificationError = pe;
  var sa = class e {
    static {
      a(this, "Webhook");
    }
    constructor(t, r) {
      if (!t)
        throw new Error("Secret can't be empty.");
      if (r?.format === "raw")
        t instanceof Uint8Array ? this.key = t : this.key = Uint8Array.from(t, (i) => i.charCodeAt(0));
      else {
        if (typeof t != "string")
          throw new Error("Expected secret to be of type string");
        t.startsWith(e.prefix) && (t = t.substring(e.prefix.length)), this.key = Tp.decode(t);
      }
    }
    verify(t, r) {
      let i = {};
      for (let d of Object.keys(r))
        i[d.toLowerCase()] = r[d];
      let n = i["webhook-id"], s = i["webhook-signature"], u = i["webhook-timestamp"];
      if (!s || !n || !u)
        throw new pe("Missing required headers");
      let m = this.verifyTimestamp(u), c = this.sign(n, m, t).split(",")[1], g = s.split(" "), _ = new globalThis.TextEncoder();
      for (let d of g) {
        let [l, f] = d.split(",");
        if (l === "v1" && (0, Tg.timingSafeEqual)(_.encode(f), _.encode(c)))
          return JSON.parse(t.toString());
      }
      throw new pe("No matching signature found");
    }
    sign(t, r, i) {
      if (typeof i != "string")
        if (i.constructor.name === "Buffer")
          i = i.toString();
        else
          throw new Error("Expected payload to be of type string or Buffer.");
      let n = new TextEncoder(), s = Math.floor(r.getTime() / 1e3), u = n.encode(`${t}.${s}.${i}`);
      return `v1,${Tp.encode(wg.hmac(this.key, u))}`;
    }
    verifyTimestamp(t) {
      let r = Math.floor(Date.now() / 1e3), i = parseInt(t, 10);
      if (isNaN(i))
        throw new pe("Invalid Signature Headers");
      if (r - i > wp)
        throw new pe("Message timestamp too old");
      if (i > r + wp)
        throw new pe("Message timestamp too new");
      return new Date(i * 1e3);
    }
  };
  Me.Webhook = sa;
  sa.prefix = "whsec_";
});

// node_modules/svix/dist/webhook.js
var jp = o((Ae) => {
  "use strict";
  Object.defineProperty(Ae, "__esModule", { value: !0 });
  Ae.Webhook = Ae.WebhookVerificationError = void 0;
  var jg = ks(), Eg = ks();
  Object.defineProperty(Ae, "WebhookVerificationError", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return Eg.WebhookVerificationError;
  }, "get") });
  var Cs = class {
    static {
      a(this, "Webhook");
    }
    constructor(t, r) {
      this.inner = new jg.Webhook(t, r);
    }
    verify(t, r) {
      var i, n, s, u, m, p;
      let c = {};
      for (let g of Object.keys(r))
        c[g.toLowerCase()] = r[g];
      return c["webhook-id"] = (n = (i = c["svix-id"]) !== null && i !== void 0 ? i : c["webhook-id"]) !== null && n !== void 0 ? n : "", c["webhook-signature"] = (u = (s = c["svix-signature"]) !== null && s !== void 0 ? s : c["webhook-signature"]) !== null && u !== void 0 ? u : "", c["webhook-timestamp"] = (p = (m = c["svix-timestamp"]) !== null && m !== void 0 ? m : c["webhook-timestamp"]) !== null && p !== void 0 ? p : "", this.inner.verify(t, c);
    }
    sign(t, r, i) {
      return this.inner.sign(t, r, i);
    }
  };
  Ae.Webhook = Cs;
});

// node_modules/svix/dist/models/endpointDisabledTrigger.js
var Ep = o((ze) => {
  "use strict";
  Object.defineProperty(ze, "__esModule", { value: !0 });
  ze.EndpointDisabledTriggerSerializer = ze.EndpointDisabledTrigger = void 0;
  var Ig;
  (function(e) {
    e.Manual = "manual", e.Automatic = "automatic";
  })(Ig = ze.EndpointDisabledTrigger || (ze.EndpointDisabledTrigger = {}));
  ze.EndpointDisabledTriggerSerializer = {
    _fromJsonObject(e) {
      return e;
    },
    _toJsonObject(e) {
      return e;
    }
  };
});

// node_modules/svix/dist/models/ordering.js
var Ip = o((xe) => {
  "use strict";
  Object.defineProperty(xe, "__esModule", { value: !0 });
  xe.OrderingSerializer = xe.Ordering = void 0;
  var Mg;
  (function(e) {
    e.Ascending = "ascending", e.Descending = "descending";
  })(Mg = xe.Ordering || (xe.Ordering = {}));
  xe.OrderingSerializer = {
    _fromJsonObject(e) {
      return e;
    },
    _toJsonObject(e) {
      return e;
    }
  };
});

// node_modules/svix/dist/models/statusCodeClass.js
var Mp = o((Je) => {
  "use strict";
  Object.defineProperty(Je, "__esModule", { value: !0 });
  Je.StatusCodeClassSerializer = Je.StatusCodeClass = void 0;
  var Ag;
  (function(e) {
    e[e.CodeNone = 0] = "CodeNone", e[e.Code1xx = 100] = "Code1xx", e[e.Code2xx = 200] = "Code2xx", e[e.Code3xx = 300] = "Code3xx", e[e.Code4xx = 400] = "Code4xx", e[e.Code5xx = 500] = "Code5xx";
  })(Ag = Je.StatusCodeClass || (Je.StatusCodeClass = {}));
  Je.StatusCodeClassSerializer = {
    _fromJsonObject(e) {
      return e;
    },
    _toJsonObject(e) {
      return e;
    }
  };
});

// node_modules/svix/dist/models/index.js
var Ap = o((q) => {
  "use strict";
  Object.defineProperty(q, "__esModule", { value: !0 });
  q.StatusCodeClass = q.SinkStatusIn = q.SinkStatus = q.Ordering = q.MessageStatusText = q.MessageStatus = q.MessageAttemptTriggerType = q.EndpointDisabledTrigger = q.ConnectorProduct = q.ConnectorKind = q.BackgroundTaskType = q.BackgroundTaskStatus = q.AppPortalCapability = void 0;
  var Rg = xa();
  Object.defineProperty(q, "AppPortalCapability", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return Rg.AppPortalCapability;
  }, "get") });
  var Hg = de();
  Object.defineProperty(q, "BackgroundTaskStatus", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return Hg.BackgroundTaskStatus;
  }, "get") });
  var Dg = ce();
  Object.defineProperty(q, "BackgroundTaskType", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return Dg.BackgroundTaskType;
  }, "get") });
  var Lg = ke();
  Object.defineProperty(q, "ConnectorKind", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return Lg.ConnectorKind;
  }, "get") });
  var Ug = It();
  Object.defineProperty(q, "ConnectorProduct", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return Ug.ConnectorProduct;
  }, "get") });
  var Fg = Ep();
  Object.defineProperty(q, "EndpointDisabledTrigger", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return Fg.EndpointDisabledTrigger;
  }, "get") });
  var Bg = rs();
  Object.defineProperty(q, "MessageAttemptTriggerType", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return Bg.MessageAttemptTriggerType;
  }, "get") });
  var Ng = Ke();
  Object.defineProperty(q, "MessageStatus", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return Ng.MessageStatus;
  }, "get") });
  var $g = Ge();
  Object.defineProperty(q, "MessageStatusText", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return $g.MessageStatusText;
  }, "get") });
  var Kg = Ip();
  Object.defineProperty(q, "Ordering", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return Kg.Ordering;
  }, "get") });
  var Gg = Ss();
  Object.defineProperty(q, "SinkStatus", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return Gg.SinkStatus;
  }, "get") });
  var Wg = Fn();
  Object.defineProperty(q, "SinkStatusIn", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return Wg.SinkStatusIn;
  }, "get") });
  var Vg = Mp();
  Object.defineProperty(q, "StatusCodeClass", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return Vg.StatusCodeClass;
  }, "get") });
});

// node_modules/svix/dist/index.js
var Hp = o((w) => {
  "use strict";
  var Qg = w && w.__createBinding || (Object.create ? (function(e, t, r, i) {
    i === void 0 && (i = r);
    var n = Object.getOwnPropertyDescriptor(t, r);
    (!n || ("get" in n ? !t.__esModule : n.writable || n.configurable)) && (n = { enumerable: !0, get: /* @__PURE__ */ a(function() {
      return t[r];
    }, "get") }), Object.defineProperty(e, i, n);
  }) : (function(e, t, r, i) {
    i === void 0 && (i = r), e[i] = t[r];
  })), Rp = w && w.__exportStar || function(e, t) {
    for (var r in e) r !== "default" && !Object.prototype.hasOwnProperty.call(t, r) && Qg(t, e, r);
  };
  Object.defineProperty(w, "__esModule", { value: !0 });
  w.Svix = w.messageInRaw = w.ValidationError = w.HttpErrorOut = w.HTTPValidationError = w.ApiException = void 0;
  var Yg = uo(), Zg = So(), Xg = zo(), ev = Ao(), tv = nu(), rv = lu(), iv = bu(), nv = qu(), av = gc(), sv = Pc(), ov = es(), uv = rl(), dv = ll(), cv = Ol(), lv = yp(), pv = us(), mv = ca();
  Object.defineProperty(w, "ApiException", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return mv.ApiException;
  }, "get") });
  var ws = bp();
  Object.defineProperty(w, "HTTPValidationError", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return ws.HTTPValidationError;
  }, "get") });
  Object.defineProperty(w, "HttpErrorOut", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return ws.HttpErrorOut;
  }, "get") });
  Object.defineProperty(w, "ValidationError", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return ws.ValidationError;
  }, "get") });
  Rp(jp(), w);
  Rp(Ap(), w);
  var fv = es();
  Object.defineProperty(w, "messageInRaw", { enumerable: !0, get: /* @__PURE__ */ a(function() {
    return fv.messageInRaw;
  }, "get") });
  var _v = [
    { region: "us", url: "https://api.us.svix.com" },
    { region: "eu", url: "https://api.eu.svix.com" },
    { region: "in", url: "https://api.in.svix.com" },
    { region: "ca", url: "https://api.ca.svix.com" },
    { region: "au", url: "https://api.au.svix.com" }
  ], Ts = class {
    static {
      a(this, "Svix");
    }
    constructor(t, r = {}) {
      var i, n, s;
      let u = (i = _v.find((p) => p.region === t.split(".")[1])) === null || i === void 0 ? void 0 : i.url, m = (s = (n = r.serverUrl) !== null && n !== void 0 ? n : u) !== null && s !== void 0 ? s : "https://api.svix.com";
      if (r.retryScheduleInMs) {
        this.requestCtx = {
          baseUrl: m,
          token: t,
          timeout: r.requestTimeout,
          retryScheduleInMs: r.retryScheduleInMs,
          fetch: r.fetch
        };
        return;
      }
      if (r.numRetries) {
        this.requestCtx = {
          baseUrl: m,
          token: t,
          timeout: r.requestTimeout,
          numRetries: r.numRetries,
          fetch: r.fetch
        };
        return;
      }
      this.requestCtx = {
        baseUrl: m,
        token: t,
        timeout: r.requestTimeout,
        fetch: r.fetch
      };
    }
    get application() {
      return new Yg.Application(this.requestCtx);
    }
    get authentication() {
      return new Zg.Authentication(this.requestCtx);
    }
    get backgroundTask() {
      return new Xg.BackgroundTask(this.requestCtx);
    }
    get connector() {
      return new ev.Connector(this.requestCtx);
    }
    get endpoint() {
      return new tv.Endpoint(this.requestCtx);
    }
    get environment() {
      return new rv.Environment(this.requestCtx);
    }
    get eventType() {
      return new iv.EventType(this.requestCtx);
    }
    get health() {
      return new nv.Health(this.requestCtx);
    }
    get ingest() {
      return new av.Ingest(this.requestCtx);
    }
    get integration() {
      return new sv.Integration(this.requestCtx);
    }
    get message() {
      return new ov.Message(this.requestCtx);
    }
    get messageAttempt() {
      return new uv.MessageAttempt(this.requestCtx);
    }
    get operationalWebhook() {
      return new dv.OperationalWebhook(this.requestCtx);
    }
    get statistics() {
      return new cv.Statistics(this.requestCtx);
    }
    get streaming() {
      return new lv.Streaming(this.requestCtx);
    }
    get operationalWebhookEndpoint() {
      return new pv.OperationalWebhookEndpoint(this.requestCtx);
    }
  };
  w.Svix = Ts;
});

// convex/email/emailActions.ts
Vp();

// node_modules/resend/dist/index.mjs
var $p = Wp(Hp(), 1);
var gv = "6.7.0";
function Q(e) {
  let t = new URLSearchParams();
  return e.limit !== void 0 && t.set("limit", e.limit.toString()), "after" in e && e.after !== void 0 && t.set("after", e.after), "before" in e && e.before !== void 0 && t.set("before", e.before), t.toString();
}
a(Q, "buildPaginationQuery");
var vv = class {
  static {
    a(this, "ApiKeys");
  }
  constructor(e) {
    this.resend = e;
  }
  async create(e, t = {}) {
    return await this.resend.post("/api-keys", e, t);
  }
  async list(e = {}) {
    let t = Q(e), r = t ? `/api-keys?${t}` : "/api-keys";
    return await this.resend.get(r);
  }
  async remove(e) {
    return await this.resend.delete(`/api-keys/${e}`);
  }
};
function hv(e) {
  return e?.map((t) => ({
    content: t.content,
    filename: t.filename,
    path: t.path,
    content_type: t.contentType,
    content_id: t.contentId
  }));
}
a(hv, "parseAttachments");
function Kp(e) {
  return {
    attachments: hv(e.attachments),
    bcc: e.bcc,
    cc: e.cc,
    from: e.from,
    headers: e.headers,
    html: e.html,
    reply_to: e.replyTo,
    scheduled_at: e.scheduledAt,
    subject: e.subject,
    tags: e.tags,
    text: e.text,
    to: e.to,
    template: e.template ? {
      id: e.template.id,
      variables: e.template.variables
    } : void 0,
    topic_id: e.topicId
  };
}
a(Kp, "parseEmailToApiOptions");
async function oa(e) {
  let t;
  try {
    ({ render: t } = await import("@react-email/render"));
  } catch {
    throw new Error("Failed to render React component. Make sure to install `@react-email/render` or `@react-email/components`.");
  }
  return t(e);
}
a(oa, "render");
var Ov = class {
  static {
    a(this, "Batch");
  }
  constructor(e) {
    this.resend = e;
  }
  async send(e, t) {
    return this.create(e, t);
  }
  async create(e, t) {
    let r = [];
    for (let i of e)
      i.react && (i.html = await oa(i.react), i.react = void 0), r.push(Kp(i));
    return await this.resend.post("/emails/batch", r, {
      ...t,
      headers: {
        "x-batch-validation": t?.batchValidation ?? "strict",
        ...t?.headers
      }
    });
  }
}, Sv = class {
  static {
    a(this, "Broadcasts");
  }
  constructor(e) {
    this.resend = e;
  }
  async create(e, t = {}) {
    return e.react && (e.html = await oa(e.react)), await this.resend.post("/broadcasts", {
      name: e.name,
      segment_id: e.segmentId,
      audience_id: e.audienceId,
      preview_text: e.previewText,
      from: e.from,
      html: e.html,
      reply_to: e.replyTo,
      subject: e.subject,
      text: e.text,
      topic_id: e.topicId
    }, t);
  }
  async send(e, t) {
    return await this.resend.post(`/broadcasts/${e}/send`, { scheduled_at: t?.scheduledAt });
  }
  async list(e = {}) {
    let t = Q(e), r = t ? `/broadcasts?${t}` : "/broadcasts";
    return await this.resend.get(r);
  }
  async get(e) {
    return await this.resend.get(`/broadcasts/${e}`);
  }
  async remove(e) {
    return await this.resend.delete(`/broadcasts/${e}`);
  }
  async update(e, t) {
    return t.react && (t.html = await oa(t.react)), await this.resend.patch(`/broadcasts/${e}`, {
      name: t.name,
      segment_id: t.segmentId,
      audience_id: t.audienceId,
      from: t.from,
      html: t.html,
      text: t.text,
      subject: t.subject,
      reply_to: t.replyTo,
      preview_text: t.previewText,
      topic_id: t.topicId
    });
  }
};
function Dp(e) {
  return {
    id: e.id,
    key: e.key,
    createdAt: e.created_at,
    type: e.type,
    fallbackValue: e.fallback_value
  };
}
a(Dp, "parseContactPropertyFromApi");
function Lp(e) {
  return "key" in e ? {
    key: e.key,
    type: e.type,
    fallback_value: e.fallbackValue
  } : { fallback_value: e.fallbackValue };
}
a(Lp, "parseContactPropertyToApiOptions");
var yv = class {
  static {
    a(this, "ContactProperties");
  }
  constructor(e) {
    this.resend = e;
  }
  async create(e) {
    let t = Lp(e);
    return await this.resend.post("/contact-properties", t);
  }
  async list(e = {}) {
    let t = Q(e), r = t ? `/contact-properties?${t}` : "/contact-properties", i = await this.resend.get(r);
    return i.data ? {
      data: {
        ...i.data,
        data: i.data.data.map((n) => Dp(n))
      },
      headers: i.headers,
      error: null
    } : i;
  }
  async get(e) {
    if (!e) return {
      data: null,
      headers: null,
      error: {
        message: "Missing `id` field.",
        statusCode: null,
        name: "missing_required_field"
      }
    };
    let t = await this.resend.get(`/contact-properties/${e}`);
    return t.data ? {
      data: {
        object: "contact_property",
        ...Dp(t.data)
      },
      headers: t.headers,
      error: null
    } : t;
  }
  async update(e) {
    if (!e.id) return {
      data: null,
      headers: null,
      error: {
        message: "Missing `id` field.",
        statusCode: null,
        name: "missing_required_field"
      }
    };
    let t = Lp(e);
    return await this.resend.patch(`/contact-properties/${e.id}`, t);
  }
  async remove(e) {
    return e ? await this.resend.delete(`/contact-properties/${e}`) : {
      data: null,
      headers: null,
      error: {
        message: "Missing `id` field.",
        statusCode: null,
        name: "missing_required_field"
      }
    };
  }
}, bv = class {
  static {
    a(this, "ContactSegments");
  }
  constructor(e) {
    this.resend = e;
  }
  async list(e) {
    if (!e.contactId && !e.email) return {
      data: null,
      headers: null,
      error: {
        message: "Missing `id` or `email` field.",
        statusCode: null,
        name: "missing_required_field"
      }
    };
    let t = e.email ? e.email : e.contactId, r = Q(e), i = r ? `/contacts/${t}/segments?${r}` : `/contacts/${t}/segments`;
    return await this.resend.get(i);
  }
  async add(e) {
    if (!e.contactId && !e.email) return {
      data: null,
      headers: null,
      error: {
        message: "Missing `id` or `email` field.",
        statusCode: null,
        name: "missing_required_field"
      }
    };
    let t = e.email ? e.email : e.contactId;
    return this.resend.post(`/contacts/${t}/segments/${e.segmentId}`);
  }
  async remove(e) {
    if (!e.contactId && !e.email) return {
      data: null,
      headers: null,
      error: {
        message: "Missing `id` or `email` field.",
        statusCode: null,
        name: "missing_required_field"
      }
    };
    let t = e.email ? e.email : e.contactId;
    return this.resend.delete(`/contacts/${t}/segments/${e.segmentId}`);
  }
}, Pv = class {
  static {
    a(this, "ContactTopics");
  }
  constructor(e) {
    this.resend = e;
  }
  async update(e) {
    if (!e.id && !e.email) return {
      data: null,
      headers: null,
      error: {
        message: "Missing `id` or `email` field.",
        statusCode: null,
        name: "missing_required_field"
      }
    };
    let t = e.email ? e.email : e.id;
    return this.resend.patch(`/contacts/${t}/topics`, e.topics);
  }
  async list(e) {
    if (!e.id && !e.email) return {
      data: null,
      headers: null,
      error: {
        message: "Missing `id` or `email` field.",
        statusCode: null,
        name: "missing_required_field"
      }
    };
    let t = e.email ? e.email : e.id, r = Q(e), i = r ? `/contacts/${t}/topics?${r}` : `/contacts/${t}/topics`;
    return this.resend.get(i);
  }
}, qv = class {
  static {
    a(this, "Contacts");
  }
  constructor(e) {
    this.resend = e, this.topics = new Pv(this.resend), this.segments = new bv(this.resend);
  }
  async create(e, t = {}) {
    return e.audienceId ? await this.resend.post(`/audiences/${e.audienceId}/contacts`, {
      unsubscribed: e.unsubscribed,
      email: e.email,
      first_name: e.firstName,
      last_name: e.lastName,
      properties: e.properties
    }, t) : await this.resend.post("/contacts", {
      unsubscribed: e.unsubscribed,
      email: e.email,
      first_name: e.firstName,
      last_name: e.lastName,
      properties: e.properties
    }, t);
  }
  async list(e = {}) {
    let t = e.segmentId ?? e.audienceId;
    if (!t) {
      let n = Q(e), s = n ? `/contacts?${n}` : "/contacts";
      return await this.resend.get(s);
    }
    let r = Q(e), i = r ? `/segments/${t}/contacts?${r}` : `/segments/${t}/contacts`;
    return await this.resend.get(i);
  }
  async get(e) {
    return typeof e == "string" ? this.resend.get(`/contacts/${e}`) : !e.id && !e.email ? {
      data: null,
      headers: null,
      error: {
        message: "Missing `id` or `email` field.",
        statusCode: null,
        name: "missing_required_field"
      }
    } : e.audienceId ? this.resend.get(`/audiences/${e.audienceId}/contacts/${e?.email ? e?.email : e?.id}`) : this.resend.get(`/contacts/${e?.email ? e?.email : e?.id}`);
  }
  async update(e) {
    return !e.id && !e.email ? {
      data: null,
      headers: null,
      error: {
        message: "Missing `id` or `email` field.",
        statusCode: null,
        name: "missing_required_field"
      }
    } : e.audienceId ? await this.resend.patch(`/audiences/${e.audienceId}/contacts/${e?.email ? e?.email : e?.id}`, {
      unsubscribed: e.unsubscribed,
      first_name: e.firstName,
      last_name: e.lastName,
      properties: e.properties
    }) : await this.resend.patch(`/contacts/${e?.email ? e?.email : e?.id}`, {
      unsubscribed: e.unsubscribed,
      first_name: e.firstName,
      last_name: e.lastName,
      properties: e.properties
    });
  }
  async remove(e) {
    return typeof e == "string" ? this.resend.delete(`/contacts/${e}`) : !e.id && !e.email ? {
      data: null,
      headers: null,
      error: {
        message: "Missing `id` or `email` field.",
        statusCode: null,
        name: "missing_required_field"
      }
    } : e.audienceId ? this.resend.delete(`/audiences/${e.audienceId}/contacts/${e?.email ? e?.email : e?.id}`) : this.resend.delete(`/contacts/${e?.email ? e?.email : e?.id}`);
  }
};
function zv(e) {
  return {
    name: e.name,
    region: e.region,
    custom_return_path: e.customReturnPath,
    capabilities: e.capabilities,
    open_tracking: e.openTracking,
    click_tracking: e.clickTracking,
    tls: e.tls
  };
}
a(zv, "parseDomainToApiOptions");
var xv = class {
  static {
    a(this, "Domains");
  }
  constructor(e) {
    this.resend = e;
  }
  async create(e, t = {}) {
    return await this.resend.post("/domains", zv(e), t);
  }
  async list(e = {}) {
    let t = Q(e), r = t ? `/domains?${t}` : "/domains";
    return await this.resend.get(r);
  }
  async get(e) {
    return await this.resend.get(`/domains/${e}`);
  }
  async update(e) {
    return await this.resend.patch(`/domains/${e.id}`, {
      click_tracking: e.clickTracking,
      open_tracking: e.openTracking,
      tls: e.tls,
      capabilities: e.capabilities
    });
  }
  async remove(e) {
    return await this.resend.delete(`/domains/${e}`);
  }
  async verify(e) {
    return await this.resend.post(`/domains/${e}/verify`);
  }
}, Jv = class {
  static {
    a(this, "Attachments$1");
  }
  constructor(e) {
    this.resend = e;
  }
  async get(e) {
    let { emailId: t, id: r } = e;
    return await this.resend.get(`/emails/${t}/attachments/${r}`);
  }
  async list(e) {
    let { emailId: t } = e, r = Q(e), i = r ? `/emails/${t}/attachments?${r}` : `/emails/${t}/attachments`;
    return await this.resend.get(i);
  }
}, kv = class {
  static {
    a(this, "Attachments");
  }
  constructor(e) {
    this.resend = e;
  }
  async get(e) {
    let { emailId: t, id: r } = e;
    return await this.resend.get(`/emails/receiving/${t}/attachments/${r}`);
  }
  async list(e) {
    let { emailId: t } = e, r = Q(e), i = r ? `/emails/receiving/${t}/attachments?${r}` : `/emails/receiving/${t}/attachments`;
    return await this.resend.get(i);
  }
}, Cv = class {
  static {
    a(this, "Receiving");
  }
  constructor(e) {
    this.resend = e, this.attachments = new kv(e);
  }
  async get(e) {
    return await this.resend.get(`/emails/receiving/${e}`);
  }
  async list(e = {}) {
    let t = Q(e), r = t ? `/emails/receiving?${t}` : "/emails/receiving";
    return await this.resend.get(r);
  }
}, Tv = class {
  static {
    a(this, "Emails");
  }
  constructor(e) {
    this.resend = e, this.attachments = new Jv(e), this.receiving = new Cv(e);
  }
  async send(e, t = {}) {
    return this.create(e, t);
  }
  async create(e, t = {}) {
    return e.react && (e.html = await oa(e.react)), await this.resend.post("/emails", Kp(e), t);
  }
  async get(e) {
    return await this.resend.get(`/emails/${e}`);
  }
  async list(e = {}) {
    let t = Q(e), r = t ? `/emails?${t}` : "/emails";
    return await this.resend.get(r);
  }
  async update(e) {
    return await this.resend.patch(`/emails/${e.id}`, { scheduled_at: e.scheduledAt });
  }
  async cancel(e) {
    return await this.resend.post(`/emails/${e}/cancel`);
  }
}, wv = class {
  static {
    a(this, "Segments");
  }
  constructor(e) {
    this.resend = e;
  }
  async create(e, t = {}) {
    return await this.resend.post("/segments", e, t);
  }
  async list(e = {}) {
    let t = Q(e), r = t ? `/segments?${t}` : "/segments";
    return await this.resend.get(r);
  }
  async get(e) {
    return await this.resend.get(`/segments/${e}`);
  }
  async remove(e) {
    return await this.resend.delete(`/segments/${e}`);
  }
};
function jv(e = {}) {
  let t = new URLSearchParams();
  return e.before && t.set("before", e.before), e.after && t.set("after", e.after), e.limit && t.set("limit", e.limit.toString()), t.size > 0 ? `?${t.toString()}` : "";
}
a(jv, "getPaginationQueryProperties");
function Ev(e) {
  return e?.map((t) => ({
    key: t.key,
    type: t.type,
    fallback_value: t.fallbackValue
  }));
}
a(Ev, "parseVariables");
function Up(e) {
  return {
    name: "name" in e ? e.name : void 0,
    subject: e.subject,
    html: e.html,
    text: e.text,
    alias: e.alias,
    from: e.from,
    reply_to: e.replyTo,
    variables: Ev(e.variables)
  };
}
a(Up, "parseTemplateToApiOptions");
var Fp = class {
  static {
    a(this, "ChainableTemplateResult");
  }
  constructor(e, t) {
    this.promise = e, this.publishFn = t;
  }
  then(e, t) {
    return this.promise.then(e, t);
  }
  async publish() {
    let { data: e, error: t } = await this.promise;
    return t ? {
      data: null,
      headers: null,
      error: t
    } : this.publishFn(e.id);
  }
}, Iv = class {
  static {
    a(this, "Templates");
  }
  constructor(e) {
    this.resend = e;
  }
  create(e) {
    return new Fp(this.performCreate(e), this.publish.bind(this));
  }
  async performCreate(e) {
    if (e.react) {
      if (!this.renderAsync) try {
        let { renderAsync: t } = await import("@react-email/render");
        this.renderAsync = t;
      } catch {
        throw new Error("Failed to render React component. Make sure to install `@react-email/render`");
      }
      e.html = await this.renderAsync(e.react);
    }
    return this.resend.post("/templates", Up(e));
  }
  async remove(e) {
    return await this.resend.delete(`/templates/${e}`);
  }
  async get(e) {
    return await this.resend.get(`/templates/${e}`);
  }
  async list(e = {}) {
    return this.resend.get(`/templates${jv(e)}`);
  }
  duplicate(e) {
    return new Fp(this.resend.post(`/templates/${e}/duplicate`), this.publish.bind(this));
  }
  async publish(e) {
    return await this.resend.post(`/templates/${e}/publish`);
  }
  async update(e, t) {
    return await this.resend.patch(`/templates/${e}`, Up(t));
  }
}, Mv = class {
  static {
    a(this, "Topics");
  }
  constructor(e) {
    this.resend = e;
  }
  async create(e) {
    let { defaultSubscription: t, ...r } = e;
    return await this.resend.post("/topics", {
      ...r,
      default_subscription: t
    });
  }
  async list() {
    return await this.resend.get("/topics");
  }
  async get(e) {
    return e ? await this.resend.get(`/topics/${e}`) : {
      data: null,
      headers: null,
      error: {
        message: "Missing `id` field.",
        statusCode: null,
        name: "missing_required_field"
      }
    };
  }
  async update(e) {
    return e.id ? await this.resend.patch(`/topics/${e.id}`, e) : {
      data: null,
      headers: null,
      error: {
        message: "Missing `id` field.",
        statusCode: null,
        name: "missing_required_field"
      }
    };
  }
  async remove(e) {
    return e ? await this.resend.delete(`/topics/${e}`) : {
      data: null,
      headers: null,
      error: {
        message: "Missing `id` field.",
        statusCode: null,
        name: "missing_required_field"
      }
    };
  }
}, Av = class {
  static {
    a(this, "Webhooks");
  }
  constructor(e) {
    this.resend = e;
  }
  async create(e, t = {}) {
    return await this.resend.post("/webhooks", e, t);
  }
  async get(e) {
    return await this.resend.get(`/webhooks/${e}`);
  }
  async list(e = {}) {
    let t = Q(e), r = t ? `/webhooks?${t}` : "/webhooks";
    return await this.resend.get(r);
  }
  async update(e, t) {
    return await this.resend.patch(`/webhooks/${e}`, t);
  }
  async remove(e) {
    return await this.resend.delete(`/webhooks/${e}`);
  }
  verify(e) {
    return new $p.Webhook(e.webhookSecret).verify(e.payload, {
      "svix-id": e.headers.id,
      "svix-timestamp": e.headers.timestamp,
      "svix-signature": e.headers.signature
    });
  }
}, Bp = "https://api.resend.com", Np = `resend-node:${gv}`, Rv = typeof process < "u" && process.env && process.env.RESEND_BASE_URL || Bp, Hv = typeof process < "u" && process.env && process.env.RESEND_USER_AGENT || Np, Gp = class {
  static {
    a(this, "Resend");
  }
  constructor(e) {
    if (this.key = e, this.apiKeys = new vv(this), this.segments = new wv(this), this.audiences = this.segments, this.batch = new Ov(this), this.broadcasts = new Sv(this), this.contacts = new qv(this), this.contactProperties = new yv(this), this.domains = new xv(this), this.emails = new Tv(this), this.webhooks = new Av(this), this.templates = new Iv(this), this.topics = new Mv(this), !e && (typeof process < "u" && process.env && (this.key = process.env.RESEND_API_KEY), !this.key))
      throw new Error('Missing API key. Pass it to the constructor `new Resend("re_123")`');
    this.headers = new Headers({
      Authorization: `Bearer ${this.key}`,
      "User-Agent": Hv,
      "Content-Type": "application/json"
    });
  }
  async fetchRequest(e, t = {}) {
    try {
      let r = await fetch(`${Rv}${e}`, t);
      if (!r.ok) try {
        let i = await r.text();
        return {
          data: null,
          error: JSON.parse(i),
          headers: Object.fromEntries(r.headers.entries())
        };
      } catch (i) {
        if (i instanceof SyntaxError) return {
          data: null,
          error: {
            name: "application_error",
            statusCode: r.status,
            message: "Internal server error. We are unable to process your request right now, please try again later."
          },
          headers: Object.fromEntries(r.headers.entries())
        };
        let n = {
          message: r.statusText,
          statusCode: r.status,
          name: "application_error"
        };
        return i instanceof Error ? {
          data: null,
          error: {
            ...n,
            message: i.message
          },
          headers: Object.fromEntries(r.headers.entries())
        } : {
          data: null,
          error: n,
          headers: Object.fromEntries(r.headers.entries())
        };
      }
      return {
        data: await r.json(),
        error: null,
        headers: Object.fromEntries(r.headers.entries())
      };
    } catch {
      return {
        data: null,
        error: {
          name: "application_error",
          statusCode: null,
          message: "Unable to fetch data. The request could not be resolved."
        },
        headers: null
      };
    }
  }
  async post(e, t, r = {}) {
    let i = new Headers(this.headers);
    if (r.headers) for (let [s, u] of new Headers(r.headers).entries()) i.set(s, u);
    r.idempotencyKey && i.set("Idempotency-Key", r.idempotencyKey);
    let n = {
      method: "POST",
      body: JSON.stringify(t),
      ...r,
      headers: i
    };
    return this.fetchRequest(e, n);
  }
  async get(e, t = {}) {
    let r = new Headers(this.headers);
    if (t.headers) for (let [n, s] of new Headers(t.headers).entries()) r.set(n, s);
    let i = {
      method: "GET",
      ...t,
      headers: r
    };
    return this.fetchRequest(e, i);
  }
  async put(e, t, r = {}) {
    let i = new Headers(this.headers);
    if (r.headers) for (let [s, u] of new Headers(r.headers).entries()) i.set(s, u);
    let n = {
      method: "PUT",
      body: JSON.stringify(t),
      ...r,
      headers: i
    };
    return this.fetchRequest(e, n);
  }
  async patch(e, t, r = {}) {
    let i = new Headers(this.headers);
    if (r.headers) for (let [s, u] of new Headers(r.headers).entries()) i.set(s, u);
    let n = {
      method: "PATCH",
      body: JSON.stringify(t),
      ...r,
      headers: i
    };
    return this.fetchRequest(e, n);
  }
  async delete(e, t) {
    let r = {
      method: "DELETE",
      body: JSON.stringify(t),
      headers: this.headers
    };
    return this.fetchRequest(e, r);
  }
};

// convex/email/emailActions.ts
var js = null;
function Dv() {
  if (!js) {
    let e = process.env.AUTH_RESEND_KEY;
    if (!e)
      throw new Error("AUTH_RESEND_KEY environment variable is not set");
    js = new Gp(e);
  }
  return js;
}
a(Dv, "getResendClient");
var Lv = "Phoo <hello@phoo.ai>", se = process.env.SITE_URL || "http://localhost:3000", Uv = {
  welcome: {
    getSubject: /* @__PURE__ */ a(() => "Welcome to Phoo - Get Started with AI-Powered SEO", "getSubject"),
    getHtml: /* @__PURE__ */ a((e) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">Welcome to Phoo!</h1>
        <p>Hey${e.name ? ` ${e.name}` : ""}! I'm Phoo, your AI SEO assistant.</p>
        <p>I'm excited to help you rank higher and drive more traffic. Let's get started!</p>
        <a href="${se}/onboarding" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Start Your First Project
        </a>
        <p style="color: #666; margin-top: 24px; font-size: 14px;">
          Questions? Reply to this email - I'd love to help!
        </p>
      </div>
    `, "getHtml")
  },
  phase_unlock: {
    getSubject: /* @__PURE__ */ a(() => "\u{1F389} New features unlocked!", "getSubject"),
    getHtml: /* @__PURE__ */ a((e) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">You just leveled up!</h1>
        <p>Great progress! You've unlocked new features in Phoo.</p>
        <p><strong>New Phase:</strong> ${e.phaseName || "Discovery"}</p>
        <a href="${se}/dashboard" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Explore New Features
        </a>
      </div>
    `, "getHtml")
  },
  first_keywords: {
    getSubject: /* @__PURE__ */ a(() => "Your first keywords are in! \u{1F4CA}", "getSubject"),
    getHtml: /* @__PURE__ */ a((e) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">Keywords Ready!</h1>
        <p>I've analyzed your keywords and found ${e.count || "some"} great opportunities.</p>
        <p>Let's turn them into topic clusters!</p>
        <a href="${se}/strategy" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          View Keywords
        </a>
      </div>
    `, "getHtml")
  },
  first_publish: {
    getSubject: /* @__PURE__ */ a(() => "\u{1F3C6} Congrats! Your first article is live!", "getSubject"),
    getHtml: /* @__PURE__ */ a((e) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">Amazing work!</h1>
        <p>Your first article is published. Now let's keep the momentum going!</p>
        <p><strong>Title:</strong> ${e.title || "Your article"}</p>
        <a href="${se}/content" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Write Another
        </a>
      </div>
    `, "getHtml")
  },
  inactive_7_days: {
    getSubject: /* @__PURE__ */ a(() => "Miss you! Your keywords are waiting \u{1F44B}", "getSubject"),
    getHtml: /* @__PURE__ */ a((e) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">It's been a week!</h1>
        <p>Your keyword opportunities are still here. Ready to continue?</p>
        <a href="${se}/dashboard" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Jump Back In
        </a>
        <p style="color: #666; margin-top: 24px; font-size: 14px;">
          Don't want these emails? <a href="${se}/settings">Manage preferences</a>
        </p>
      </div>
    `, "getHtml")
  },
  weekly_digest: {
    getSubject: /* @__PURE__ */ a(() => "Your weekly SEO digest \u{1F4CA}", "getSubject"),
    getHtml: /* @__PURE__ */ a((e) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">Weekly Digest</h1>
        <p>Here's what happened this week with your SEO:</p>
        <ul>
          <li>Keywords: ${e.keywordCount || 0}</li>
          <li>Clusters: ${e.clusterCount || 0}</li>
          <li>Content: ${e.contentCount || 0} pieces</li>
        </ul>
        <a href="${se}/analytics" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          View Full Report
        </a>
      </div>
    `, "getHtml")
  },
  password_reset: {
    getSubject: /* @__PURE__ */ a(() => "Reset Your Phoo Password", "getSubject"),
    getHtml: /* @__PURE__ */ a((e) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">Password Reset Requested</h1>
        <p>Hi${e.name ? ` ${e.name}` : ""},</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <a href="${se}/auth/reset-password?token=${e.token}" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Reset Password
        </a>
        <p style="color: #666; margin-top: 24px; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 16px;">
          \u2014 The Phoo Team
        </p>
      </div>
    `, "getHtml")
  },
  team_invite_accepted: {
    getSubject: /* @__PURE__ */ a((e) => `${e.memberName || "Someone"} joined your team`, "getSubject"),
    getHtml: /* @__PURE__ */ a((e) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">New Team Member!</h1>
        <p>Great news! <strong>${e.memberName || "A new member"}</strong> (${e.memberEmail || "email"}) has accepted your invitation to join <strong>${e.orgName || "your team"}</strong>.</p>
        <p>They've been assigned the <strong>${e.role || "team member"}</strong> role.</p>
        <a href="${se}/settings/team" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          View Your Team
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          \u2014 The Phoo Team
        </p>
      </div>
    `, "getHtml")
  },
  team_invite: {
    getSubject: /* @__PURE__ */ a((e) => `You're invited to join ${e.orgName || "a team"} on Phoo`, "getSubject"),
    getHtml: /* @__PURE__ */ a((e) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px;">
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <img src="https://phoo.ai/images/phoo-logo-orange.png" alt="Phoo" style="height: 40px; margin-bottom: 24px;" />
          
          <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">You're invited!</h1>
          
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.5;">
            <strong>${e.inviterName || "Someone"}</strong> has invited you to join <strong>${e.orgName || "their team"}</strong> on Phoo, the AI-powered SEO platform.
          </p>
          
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.5;">
            You've been assigned the <strong style="color: #F99F2A;">${e.role || "team member"}</strong> role.
          </p>
          
          <a href="${se}/invite/${e.token}" style="display: inline-block; background: linear-gradient(135deg, #F99F2A 0%, #e53e3e 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 24px 0; font-weight: 600; font-size: 16px;">
            Accept Invitation
          </a>
          
          <p style="color: #888; font-size: 14px; margin-top: 24px;">
            This invitation expires in 7 days. If you didn't expect this invitation, you can safely ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          
          <p style="color: #999; font-size: 12px;">
            Questions? Contact us at <a href="mailto:phoosupport@helps2.com" style="color: #F99F2A;">phoosupport@helps2.com</a>
          </p>
          <p style="color: #999; font-size: 12px;">
            \u2014 The Phoo Team
          </p>
        </div>
      </div>
    `, "getHtml")
  }
};
async function Re(e) {
  let t = Uv[e.template];
  if (!t)
    throw new Error(`Unknown email template: ${e.template}`);
  try {
    let { data: r, error: i } = await Dv().emails.send({
      from: Lv,
      to: e.to,
      subject: t.getSubject(e.data || {}),
      html: t.getHtml(e.data || {})
    });
    if (i)
      throw console.error("[Email] Error:", i), new Error(i.message);
    return { success: !0, id: r?.id };
  } catch (r) {
    throw console.error("[Email] Failed to send:", r), r;
  }
}
a(Re, "sendEmailInternal");
var Bb = me({
  args: {
    to: P.string(),
    template: P.string(),
    data: P.optional(P.any())
  },
  handler: /* @__PURE__ */ a(async (e, t) => await Re(t), "handler")
}), Nb = me({
  args: {
    email: P.string(),
    name: P.optional(P.string())
  },
  handler: /* @__PURE__ */ a(async (e, t) => await Re({
    to: t.email,
    template: "welcome",
    data: { name: t.name }
  }), "handler")
}), $b = me({
  args: {
    email: P.string(),
    phaseName: P.string()
  },
  handler: /* @__PURE__ */ a(async (e, t) => await Re({
    to: t.email,
    template: "phase_unlock",
    data: { phaseName: t.phaseName }
  }), "handler")
}), Kb = me({
  args: {
    email: P.string(),
    name: P.optional(P.string()),
    token: P.string()
  },
  handler: /* @__PURE__ */ a(async (e, t) => await Re({
    to: t.email,
    template: "password_reset",
    data: { name: t.name, token: t.token }
  }), "handler")
}), Gb = me({
  args: {
    inviterEmail: P.string(),
    memberName: P.optional(P.string()),
    memberEmail: P.string(),
    orgName: P.optional(P.string()),
    role: P.string()
  },
  handler: /* @__PURE__ */ a(async (e, t) => await Re({
    to: t.inviterEmail,
    template: "team_invite_accepted",
    data: {
      memberName: t.memberName,
      memberEmail: t.memberEmail,
      orgName: t.orgName,
      role: t.role
    }
  }), "handler")
}), Wb = me({
  args: {
    email: P.string(),
    inviterName: P.optional(P.string()),
    orgName: P.optional(P.string()),
    role: P.string(),
    token: P.string()
  },
  handler: /* @__PURE__ */ a(async (e, t) => await Re({
    to: t.email,
    template: "team_invite",
    data: {
      inviterName: t.inviterName,
      orgName: t.orgName,
      role: t.role,
      token: t.token
    }
  }), "handler")
});
export {
  Bb as sendEmail,
  Gb as sendInviteAcceptedEmail,
  Kb as sendPasswordResetEmail,
  $b as sendPhaseUnlockEmail,
  Wb as sendTeamInviteEmail,
  Nb as sendWelcomeEmail
};
//# sourceMappingURL=emailActions.js.map
