import {
  a as e_
} from "./BMIQ74CQ.js";
import {
  a as l,
  d as Sa,
  e as xt,
  f as fm
} from "./V7X2J7BI.js";

// node_modules/@vercel/oidc/dist/get-context.js
var Ap = Sa((eN, Vh) => {
  "use strict";
  var Np = Object.defineProperty, Rw = Object.getOwnPropertyDescriptor, Cw = Object.getOwnPropertyNames, Dw = Object.prototype.hasOwnProperty, Uw = /* @__PURE__ */ l((e, t) => {
    for (var n in t)
      Np(e, n, { get: t[n], enumerable: !0 });
  }, "__export"), Mw = /* @__PURE__ */ l((e, t, n, o) => {
    if (t && typeof t == "object" || typeof t == "function")
      for (let r of Cw(t))
        !Dw.call(e, r) && r !== n && Np(e, r, { get: /* @__PURE__ */ l(() => t[r], "get"), enumerable: !(o = Rw(t, r)) || o.enumerable });
    return e;
  }, "__copyProps"), Zw = /* @__PURE__ */ l((e) => Mw(Np({}, "__esModule", { value: !0 }), e), "__toCommonJS"), Lh = {};
  Uw(Lh, {
    SYMBOL_FOR_REQ_CONTEXT: /* @__PURE__ */ l(() => Fh, "SYMBOL_FOR_REQ_CONTEXT"),
    getContext: /* @__PURE__ */ l(() => Lw, "getContext")
  });
  Vh.exports = Zw(Lh);
  var Fh = Symbol.for("@vercel/request-context");
  function Lw() {
    return globalThis[Fh]?.get?.() ?? {};
  }
  l(Lw, "getContext");
});

// node_modules/@vercel/oidc/dist/get-vercel-oidc-token.js
var Bh = Sa((rN, Jh) => {
  "use strict";
  var Cp = Object.defineProperty, Fw = Object.getOwnPropertyDescriptor, Vw = Object.getOwnPropertyNames, qw = Object.prototype.hasOwnProperty, Jw = /* @__PURE__ */ l((e, t) => {
    for (var n in t)
      Cp(e, n, { get: t[n], enumerable: !0 });
  }, "__export"), Bw = /* @__PURE__ */ l((e, t, n, o) => {
    if (t && typeof t == "object" || typeof t == "function")
      for (let r of Vw(t))
        !qw.call(e, r) && r !== n && Cp(e, r, { get: /* @__PURE__ */ l(() => t[r], "get"), enumerable: !(o = Fw(t, r)) || o.enumerable });
    return e;
  }, "__copyProps"), Gw = /* @__PURE__ */ l((e) => Bw(Cp({}, "__esModule", { value: !0 }), e), "__toCommonJS"), qh = {};
  Jw(qh, {
    getVercelOidcToken: /* @__PURE__ */ l(() => Hw, "getVercelOidcToken"),
    getVercelOidcTokenSync: /* @__PURE__ */ l(() => Rp, "getVercelOidcTokenSync")
  });
  Jh.exports = Gw(qh);
  var Ww = Ap(), Kw = e_();
  async function Hw() {
    let e = "", t;
    try {
      e = Rp();
    } catch (n) {
      t = n;
    }
    try {
      let [{ getTokenPayload: n, isExpired: o }, { refreshToken: r }] = await Promise.all([
        await import("./WFBHB7VX.js"),
        await import("./CRUSTTWG.js")
      ]);
      (!e || o(n(e))) && (await r(), e = Rp());
    } catch (n) {
      throw t?.message && n instanceof Error && (n.message = `${t.message}
${n.message}`), new Kw.VercelOidcTokenError("Failed to refresh OIDC token", n);
    }
    return e;
  }
  l(Hw, "getVercelOidcToken");
  function Rp() {
    let e = (0, Ww.getContext)().headers?.["x-vercel-oidc-token"] ?? process.env.VERCEL_OIDC_TOKEN;
    if (!e)
      throw new Error(
        "The 'x-vercel-oidc-token' header is missing from the request. Do you have the OIDC option enabled in the Vercel project settings?"
      );
    return e;
  }
  l(Rp, "getVercelOidcTokenSync");
});

// node_modules/@vercel/oidc/dist/index.js
var Up = Sa((oN, Kh) => {
  "use strict";
  var Dp = Object.defineProperty, Xw = Object.getOwnPropertyDescriptor, Yw = Object.getOwnPropertyNames, Qw = Object.prototype.hasOwnProperty, ek = /* @__PURE__ */ l((e, t) => {
    for (var n in t)
      Dp(e, n, { get: t[n], enumerable: !0 });
  }, "__export"), tk = /* @__PURE__ */ l((e, t, n, o) => {
    if (t && typeof t == "object" || typeof t == "function")
      for (let r of Yw(t))
        !Qw.call(e, r) && r !== n && Dp(e, r, { get: /* @__PURE__ */ l(() => t[r], "get"), enumerable: !(o = Xw(t, r)) || o.enumerable });
    return e;
  }, "__copyProps"), rk = /* @__PURE__ */ l((e) => tk(Dp({}, "__esModule", { value: !0 }), e), "__toCommonJS"), Wh = {};
  ek(Wh, {
    getContext: /* @__PURE__ */ l(() => nk.getContext, "getContext"),
    getVercelOidcToken: /* @__PURE__ */ l(() => Gh.getVercelOidcToken, "getVercelOidcToken"),
    getVercelOidcTokenSync: /* @__PURE__ */ l(() => Gh.getVercelOidcTokenSync, "getVercelOidcTokenSync")
  });
  Kh.exports = rk(Wh);
  var Gh = Bh(), nk = Ap();
});

// node_modules/zod/v4/classic/external.js
var s = {};
xt(s, {
  $brand: () => $o,
  $input: () => Uu,
  $output: () => Du,
  NEVER: () => Ta,
  TimePrecision: () => Fu,
  ZodAny: () => Od,
  ZodArray: () => Ad,
  ZodBase64: () => Ji,
  ZodBase64URL: () => Bi,
  ZodBigInt: () => Gr,
  ZodBigIntFormat: () => Ki,
  ZodBoolean: () => Br,
  ZodCIDRv4: () => Vi,
  ZodCIDRv6: () => qi,
  ZodCUID: () => Ci,
  ZodCUID2: () => Di,
  ZodCatch: () => rp,
  ZodCodec: () => na,
  ZodCustom: () => Qn,
  ZodCustomStringFormat: () => qr,
  ZodDate: () => Wn,
  ZodDefault: () => Hd,
  ZodDiscriminatedUnion: () => Cd,
  ZodE164: () => Gi,
  ZodEmail: () => Ni,
  ZodEmoji: () => Ai,
  ZodEnum: () => Fr,
  ZodError: () => zx,
  ZodExactOptional: () => Gd,
  ZodFile: () => Jd,
  ZodFirstPartyTypeKind: () => fp,
  ZodFunction: () => dp,
  ZodGUID: () => Vn,
  ZodIPv4: () => Li,
  ZodIPv6: () => Fi,
  ZodISODate: () => Ti,
  ZodISODateTime: () => Si,
  ZodISODuration: () => Ei,
  ZodISOTime: () => zi,
  ZodIntersection: () => Dd,
  ZodIssueCode: () => Ox,
  ZodJWT: () => Wi,
  ZodKSUID: () => Zi,
  ZodLazy: () => lp,
  ZodLiteral: () => qd,
  ZodMAC: () => wd,
  ZodMap: () => Fd,
  ZodNaN: () => op,
  ZodNanoID: () => Ri,
  ZodNever: () => Pd,
  ZodNonOptional: () => ta,
  ZodNull: () => zd,
  ZodNullable: () => Kd,
  ZodNumber: () => Jr,
  ZodNumberFormat: () => dr,
  ZodObject: () => Hn,
  ZodOptional: () => ea,
  ZodPipe: () => ra,
  ZodPrefault: () => Yd,
  ZodPromise: () => cp,
  ZodReadonly: () => ip,
  ZodRealError: () => Me,
  ZodRecord: () => Yn,
  ZodSet: () => Vd,
  ZodString: () => Vr,
  ZodStringFormat: () => oe,
  ZodSuccess: () => tp,
  ZodSymbol: () => Sd,
  ZodTemplateLiteral: () => sp,
  ZodTransform: () => Bd,
  ZodTuple: () => Md,
  ZodType: () => F,
  ZodULID: () => Ui,
  ZodURL: () => Gn,
  ZodUUID: () => ht,
  ZodUndefined: () => Td,
  ZodUnion: () => Xn,
  ZodUnknown: () => jd,
  ZodVoid: () => Nd,
  ZodXID: () => Mi,
  ZodXor: () => Rd,
  _ZodString: () => Pi,
  _default: () => Xd,
  _function: () => rg,
  any: () => Af,
  array: () => Kn,
  base64: () => vf,
  base64url: () => yf,
  bigint: () => Ef,
  boolean: () => Id,
  catch: () => np,
  check: () => ng,
  cidrv4: () => gf,
  cidrv6: () => hf,
  clone: () => Te,
  codec: () => Qf,
  coerce: () => gp,
  config: () => de,
  core: () => kt,
  cuid: () => sf,
  cuid2: () => lf,
  custom: () => og,
  date: () => Cf,
  decode: () => hd,
  decodeAsync: () => yd,
  describe: () => ig,
  discriminatedUnion: () => Ff,
  e164: () => _f,
  email: () => Hm,
  emoji: () => of,
  encode: () => gd,
  encodeAsync: () => vd,
  endsWith: () => jr,
  enum: () => Yi,
  exactOptional: () => Wd,
  file: () => Kf,
  flattenError: () => Sn,
  float32: () => If,
  float64: () => Sf,
  formatError: () => Tn,
  fromJSONSchema: () => pg,
  function: () => rg,
  getErrorMap: () => Px,
  globalRegistry: () => be,
  gt: () => ft,
  gte: () => ze,
  guid: () => Xm,
  hash: () => kf,
  hex: () => wf,
  hostname: () => $f,
  httpUrl: () => nf,
  includes: () => Er,
  instanceof: () => sg,
  int: () => ji,
  int32: () => Tf,
  int64: () => Of,
  intersection: () => Ud,
  ipv4: () => pf,
  ipv6: () => ff,
  iso: () => Lr,
  json: () => ug,
  jwt: () => bf,
  keyof: () => Df,
  ksuid: () => df,
  lazy: () => up,
  length: () => ur,
  literal: () => Wf,
  locales: () => Un,
  looseObject: () => Zf,
  looseRecord: () => qf,
  lowercase: () => Tr,
  lt: () => mt,
  lte: () => qe,
  mac: () => mf,
  map: () => Jf,
  maxLength: () => lr,
  maxSize: () => Lt,
  meta: () => ag,
  mime: () => Pr,
  minLength: () => wt,
  minSize: () => gt,
  multipleOf: () => Zt,
  nan: () => Yf,
  nanoid: () => af,
  nativeEnum: () => Gf,
  negative: () => vi,
  never: () => Hi,
  nonnegative: () => _i,
  nonoptional: () => ep,
  nonpositive: () => yi,
  normalize: () => Nr,
  null: () => Ed,
  nullable: () => Jn,
  nullish: () => Hf,
  number: () => kd,
  object: () => Uf,
  optional: () => qn,
  overwrite: () => ot,
  parse: () => pd,
  parseAsync: () => md,
  partialRecord: () => Vf,
  pipe: () => Bn,
  positive: () => hi,
  prefault: () => Qd,
  preprocess: () => cg,
  prettifyError: () => Ma,
  promise: () => tg,
  property: () => bi,
  readonly: () => ap,
  record: () => Ld,
  refine: () => pp,
  regex: () => Sr,
  regexes: () => Ye,
  registry: () => Ko,
  safeDecode: () => bd,
  safeDecodeAsync: () => $d,
  safeEncode: () => _d,
  safeEncodeAsync: () => xd,
  safeParse: () => fd,
  safeParseAsync: () => Fn,
  set: () => Bf,
  setErrorMap: () => jx,
  size: () => sr,
  slugify: () => Dr,
  startsWith: () => Or,
  strictObject: () => Mf,
  string: () => Oi,
  stringFormat: () => xf,
  stringbool: () => lg,
  success: () => Xf,
  superRefine: () => mp,
  symbol: () => Pf,
  templateLiteral: () => eg,
  toJSONSchema: () => Zr,
  toLowerCase: () => Rr,
  toUpperCase: () => Cr,
  transform: () => Qi,
  treeifyError: () => Ua,
  trim: () => Ar,
  tuple: () => Zd,
  uint32: () => zf,
  uint64: () => jf,
  ulid: () => uf,
  undefined: () => Nf,
  union: () => Xi,
  unknown: () => cr,
  uppercase: () => zr,
  url: () => rf,
  util: () => S,
  uuid: () => Ym,
  uuidv4: () => Qm,
  uuidv6: () => ef,
  uuidv7: () => tf,
  void: () => Rf,
  xid: () => cf,
  xor: () => Lf
});

// node_modules/zod/v4/core/index.js
var kt = {};
xt(kt, {
  $ZodAny: () => ml,
  $ZodArray: () => yl,
  $ZodAsyncError: () => nt,
  $ZodBase64: () => nl,
  $ZodBase64URL: () => ol,
  $ZodBigInt: () => Jo,
  $ZodBigIntFormat: () => ul,
  $ZodBoolean: () => jn,
  $ZodCIDRv4: () => el,
  $ZodCIDRv6: () => tl,
  $ZodCUID: () => Fs,
  $ZodCUID2: () => Vs,
  $ZodCatch: () => Cl,
  $ZodCheck: () => ie,
  $ZodCheckBigIntFormat: () => ys,
  $ZodCheckEndsWith: () => Os,
  $ZodCheckGreaterThan: () => Uo,
  $ZodCheckIncludes: () => zs,
  $ZodCheckLengthEquals: () => ks,
  $ZodCheckLessThan: () => Do,
  $ZodCheckLowerCase: () => Ss,
  $ZodCheckMaxLength: () => $s,
  $ZodCheckMaxSize: () => _s,
  $ZodCheckMimeType: () => Ps,
  $ZodCheckMinLength: () => ws,
  $ZodCheckMinSize: () => bs,
  $ZodCheckMultipleOf: () => hs,
  $ZodCheckNumberFormat: () => vs,
  $ZodCheckOverwrite: () => Ns,
  $ZodCheckProperty: () => js,
  $ZodCheckRegex: () => Is,
  $ZodCheckSizeEquals: () => xs,
  $ZodCheckStartsWith: () => Es,
  $ZodCheckStringFormat: () => kr,
  $ZodCheckUpperCase: () => Ts,
  $ZodCodec: () => Nn,
  $ZodCustom: () => ql,
  $ZodCustomStringFormat: () => sl,
  $ZodDate: () => vl,
  $ZodDefault: () => Pl,
  $ZodDiscriminatedUnion: () => xl,
  $ZodE164: () => il,
  $ZodEmail: () => Us,
  $ZodEmoji: () => Zs,
  $ZodEncodeError: () => Rt,
  $ZodEnum: () => Sl,
  $ZodError: () => In,
  $ZodExactOptional: () => Ol,
  $ZodFile: () => zl,
  $ZodFunction: () => Ll,
  $ZodGUID: () => Cs,
  $ZodIPv4: () => Xs,
  $ZodIPv6: () => Ys,
  $ZodISODate: () => Ws,
  $ZodISODateTime: () => Gs,
  $ZodISODuration: () => Hs,
  $ZodISOTime: () => Ks,
  $ZodIntersection: () => $l,
  $ZodJWT: () => al,
  $ZodKSUID: () => Bs,
  $ZodLazy: () => Vl,
  $ZodLiteral: () => Tl,
  $ZodMAC: () => Qs,
  $ZodMap: () => kl,
  $ZodNaN: () => Dl,
  $ZodNanoID: () => Ls,
  $ZodNever: () => gl,
  $ZodNonOptional: () => Al,
  $ZodNull: () => pl,
  $ZodNullable: () => jl,
  $ZodNumber: () => qo,
  $ZodNumberFormat: () => ll,
  $ZodObject: () => Lm,
  $ZodObjectJIT: () => _l,
  $ZodOptional: () => Go,
  $ZodPipe: () => Ul,
  $ZodPrefault: () => Nl,
  $ZodPromise: () => Fl,
  $ZodReadonly: () => Ml,
  $ZodRealError: () => Ue,
  $ZodRecord: () => wl,
  $ZodRegistry: () => Wo,
  $ZodSet: () => Il,
  $ZodString: () => ar,
  $ZodStringFormat: () => ne,
  $ZodSuccess: () => Rl,
  $ZodSymbol: () => cl,
  $ZodTemplateLiteral: () => Zl,
  $ZodTransform: () => El,
  $ZodTuple: () => Bo,
  $ZodType: () => L,
  $ZodULID: () => qs,
  $ZodURL: () => Ms,
  $ZodUUID: () => Ds,
  $ZodUndefined: () => dl,
  $ZodUnion: () => Pn,
  $ZodUnknown: () => fl,
  $ZodVoid: () => hl,
  $ZodXID: () => Js,
  $ZodXor: () => bl,
  $brand: () => $o,
  $constructor: () => h,
  $input: () => Uu,
  $output: () => Du,
  Doc: () => On,
  JSONSchema: () => Wm,
  JSONSchemaGenerator: () => ki,
  NEVER: () => Ta,
  TimePrecision: () => Fu,
  _any: () => uc,
  _array: () => hc,
  _base64: () => pi,
  _base64url: () => mi,
  _bigint: () => rc,
  _boolean: () => ec,
  _catch: () => bx,
  _check: () => Gm,
  _cidrv4: () => ci,
  _cidrv6: () => di,
  _coercedBigint: () => nc,
  _coercedBoolean: () => tc,
  _coercedDate: () => fc,
  _coercedNumber: () => Wu,
  _coercedString: () => Zu,
  _cuid: () => ni,
  _cuid2: () => oi,
  _custom: () => yc,
  _date: () => mc,
  _decode: () => zo,
  _decodeAsync: () => Oo,
  _default: () => vx,
  _discriminatedUnion: () => ix,
  _e164: () => fi,
  _email: () => Ho,
  _emoji: () => ti,
  _encode: () => To,
  _encodeAsync: () => Eo,
  _endsWith: () => jr,
  _enum: () => dx,
  _file: () => vc,
  _float32: () => Hu,
  _float64: () => Xu,
  _gt: () => ft,
  _gte: () => ze,
  _guid: () => Mn,
  _includes: () => Er,
  _int: () => Ku,
  _int32: () => Yu,
  _int64: () => oc,
  _intersection: () => ax,
  _ipv4: () => li,
  _ipv6: () => ui,
  _isoDate: () => qu,
  _isoDateTime: () => Vu,
  _isoDuration: () => Bu,
  _isoTime: () => Ju,
  _jwt: () => gi,
  _ksuid: () => si,
  _lazy: () => kx,
  _length: () => ur,
  _literal: () => mx,
  _lowercase: () => Tr,
  _lt: () => mt,
  _lte: () => qe,
  _mac: () => Lu,
  _map: () => ux,
  _max: () => qe,
  _maxLength: () => lr,
  _maxSize: () => Lt,
  _mime: () => Pr,
  _min: () => ze,
  _minLength: () => wt,
  _minSize: () => gt,
  _multipleOf: () => Zt,
  _nan: () => gc,
  _nanoid: () => ri,
  _nativeEnum: () => px,
  _negative: () => vi,
  _never: () => dc,
  _nonnegative: () => _i,
  _nonoptional: () => yx,
  _nonpositive: () => yi,
  _normalize: () => Nr,
  _null: () => lc,
  _nullable: () => hx,
  _number: () => Gu,
  _optional: () => gx,
  _overwrite: () => ot,
  _parse: () => br,
  _parseAsync: () => xr,
  _pipe: () => xx,
  _positive: () => hi,
  _promise: () => Ix,
  _property: () => bi,
  _readonly: () => $x,
  _record: () => lx,
  _refine: () => _c,
  _regex: () => Sr,
  _safeDecode: () => Po,
  _safeDecodeAsync: () => Ao,
  _safeEncode: () => jo,
  _safeEncodeAsync: () => No,
  _safeParse: () => $r,
  _safeParseAsync: () => wr,
  _set: () => cx,
  _size: () => sr,
  _slugify: () => Dr,
  _startsWith: () => Or,
  _string: () => Mu,
  _stringFormat: () => Ur,
  _stringbool: () => wc,
  _success: () => _x,
  _superRefine: () => bc,
  _symbol: () => ac,
  _templateLiteral: () => wx,
  _toLowerCase: () => Rr,
  _toUpperCase: () => Cr,
  _transform: () => fx,
  _trim: () => Ar,
  _tuple: () => sx,
  _uint32: () => Qu,
  _uint64: () => ic,
  _ulid: () => ii,
  _undefined: () => sc,
  _union: () => nx,
  _unknown: () => cc,
  _uppercase: () => zr,
  _url: () => Zn,
  _uuid: () => Xo,
  _uuidv4: () => Yo,
  _uuidv6: () => Qo,
  _uuidv7: () => ei,
  _void: () => pc,
  _xid: () => ai,
  _xor: () => ox,
  clone: () => Te,
  config: () => de,
  createStandardJSONSchemaMethod: () => Mr,
  createToJSONSchemaMethod: () => kc,
  decode: () => z_,
  decodeAsync: () => O_,
  describe: () => xc,
  encode: () => T_,
  encodeAsync: () => E_,
  extractDefs: () => Vt,
  finalize: () => qt,
  flattenError: () => Sn,
  formatError: () => Tn,
  globalConfig: () => yn,
  globalRegistry: () => be,
  initializeContext: () => Ft,
  isValidBase64: () => rl,
  isValidBase64URL: () => Dm,
  isValidJWT: () => Um,
  locales: () => Un,
  meta: () => $c,
  parse: () => Io,
  parseAsync: () => So,
  prettifyError: () => Ma,
  process: () => ee,
  regexes: () => Ye,
  registry: () => Ko,
  safeDecode: () => P_,
  safeDecodeAsync: () => A_,
  safeEncode: () => j_,
  safeEncodeAsync: () => N_,
  safeParse: () => Za,
  safeParseAsync: () => La,
  toDotPath: () => _m,
  toJSONSchema: () => Zr,
  treeifyError: () => Ua,
  util: () => S,
  version: () => As
});

// node_modules/zod/v4/core/core.js
var Ta = Object.freeze({
  status: "aborted"
});
// @__NO_SIDE_EFFECTS__
function h(e, t, n) {
  function o(u, c) {
    if (u._zod || Object.defineProperty(u, "_zod", {
      value: {
        def: c,
        constr: a,
        traits: /* @__PURE__ */ new Set()
      },
      enumerable: !1
    }), u._zod.traits.has(e))
      return;
    u._zod.traits.add(e), t(u, c);
    let d = a.prototype, p = Object.keys(d);
    for (let m = 0; m < p.length; m++) {
      let v = p[m];
      v in u || (u[v] = d[v].bind(u));
    }
  }
  l(o, "init");
  let r = n?.Parent ?? Object;
  class i extends r {
    static {
      l(this, "Definition");
    }
  }
  Object.defineProperty(i, "name", { value: e });
  function a(u) {
    var c;
    let d = n?.Parent ? new i() : this;
    o(d, u), (c = d._zod).deferred ?? (c.deferred = []);
    for (let p of d._zod.deferred)
      p();
    return d;
  }
  return l(a, "_"), Object.defineProperty(a, "init", { value: o }), Object.defineProperty(a, Symbol.hasInstance, {
    value: /* @__PURE__ */ l((u) => n?.Parent && u instanceof n.Parent ? !0 : u?._zod?.traits?.has(e), "value")
  }), Object.defineProperty(a, "name", { value: e }), a;
}
l(h, "$constructor");
var $o = Symbol("zod_brand"), nt = class extends Error {
  static {
    l(this, "$ZodAsyncError");
  }
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}, Rt = class extends Error {
  static {
    l(this, "$ZodEncodeError");
  }
  constructor(t) {
    super(`Encountered unidirectional transform during encode: ${t}`), this.name = "ZodEncodeError";
  }
}, yn = {};
function de(e) {
  return e && Object.assign(yn, e), yn;
}
l(de, "config");

// node_modules/zod/v4/core/util.js
var S = {};
xt(S, {
  BIGINT_FORMAT_RANGES: () => Da,
  Class: () => Ea,
  NUMBER_FORMAT_RANGES: () => Ca,
  aborted: () => Mt,
  allowsEval: () => Pa,
  assert: () => i_,
  assertEqual: () => t_,
  assertIs: () => n_,
  assertNever: () => o_,
  assertNotEqual: () => r_,
  assignProp: () => Dt,
  base64ToUint8Array: () => hm,
  base64urlToUint8Array: () => $_,
  cached: () => yr,
  captureStackTrace: () => ko,
  cleanEnum: () => x_,
  cleanRegex: () => xn,
  clone: () => Te,
  cloneDef: () => s_,
  createTransparentProxy: () => m_,
  defineLazy: () => G,
  esc: () => wo,
  escapeRegex: () => Xe,
  extend: () => h_,
  finalizeIssue: () => De,
  floatSafeRemainder: () => Oa,
  getElementAtPath: () => l_,
  getEnumValues: () => bn,
  getLengthableOrigin: () => kn,
  getParsedType: () => p_,
  getSizableOrigin: () => wn,
  hexToUint8Array: () => k_,
  isObject: () => or,
  isPlainObject: () => Ut,
  issue: () => _r,
  joinValues: () => _,
  jsonStringifyReplacer: () => vr,
  merge: () => y_,
  mergeDefs: () => $t,
  normalizeParams: () => z,
  nullish: () => Ct,
  numKeys: () => d_,
  objectClone: () => a_,
  omit: () => g_,
  optionalKeys: () => Ra,
  parsedType: () => I,
  partial: () => __,
  pick: () => f_,
  prefixIssues: () => Ve,
  primitiveTypes: () => Aa,
  promiseAllObject: () => u_,
  propertyKeyTypes: () => $n,
  randomString: () => c_,
  required: () => b_,
  safeExtend: () => v_,
  shallowClone: () => Na,
  slugify: () => ja,
  stringifyPrimitive: () => w,
  uint8ArrayToBase64: () => vm,
  uint8ArrayToBase64url: () => w_,
  uint8ArrayToHex: () => I_,
  unwrapMessage: () => _n
});
function t_(e) {
  return e;
}
l(t_, "assertEqual");
function r_(e) {
  return e;
}
l(r_, "assertNotEqual");
function n_(e) {
}
l(n_, "assertIs");
function o_(e) {
  throw new Error("Unexpected value in exhaustive check");
}
l(o_, "assertNever");
function i_(e) {
}
l(i_, "assert");
function bn(e) {
  let t = Object.values(e).filter((o) => typeof o == "number");
  return Object.entries(e).filter(([o, r]) => t.indexOf(+o) === -1).map(([o, r]) => r);
}
l(bn, "getEnumValues");
function _(e, t = "|") {
  return e.map((n) => w(n)).join(t);
}
l(_, "joinValues");
function vr(e, t) {
  return typeof t == "bigint" ? t.toString() : t;
}
l(vr, "jsonStringifyReplacer");
function yr(e) {
  return {
    get value() {
      {
        let n = e();
        return Object.defineProperty(this, "value", { value: n }), n;
      }
      throw new Error("cached value already set");
    }
  };
}
l(yr, "cached");
function Ct(e) {
  return e == null;
}
l(Ct, "nullish");
function xn(e) {
  let t = e.startsWith("^") ? 1 : 0, n = e.endsWith("$") ? e.length - 1 : e.length;
  return e.slice(t, n);
}
l(xn, "cleanRegex");
function Oa(e, t) {
  let n = (e.toString().split(".")[1] || "").length, o = t.toString(), r = (o.split(".")[1] || "").length;
  if (r === 0 && /\d?e-\d?/.test(o)) {
    let c = o.match(/\d?e-(\d?)/);
    c?.[1] && (r = Number.parseInt(c[1]));
  }
  let i = n > r ? n : r, a = Number.parseInt(e.toFixed(i).replace(".", "")), u = Number.parseInt(t.toFixed(i).replace(".", ""));
  return a % u / 10 ** i;
}
l(Oa, "floatSafeRemainder");
var gm = Symbol("evaluating");
function G(e, t, n) {
  let o;
  Object.defineProperty(e, t, {
    get() {
      if (o !== gm)
        return o === void 0 && (o = gm, o = n()), o;
    },
    set(r) {
      Object.defineProperty(e, t, {
        value: r
        // configurable: true,
      });
    },
    configurable: !0
  });
}
l(G, "defineLazy");
function a_(e) {
  return Object.create(Object.getPrototypeOf(e), Object.getOwnPropertyDescriptors(e));
}
l(a_, "objectClone");
function Dt(e, t, n) {
  Object.defineProperty(e, t, {
    value: n,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
l(Dt, "assignProp");
function $t(...e) {
  let t = {};
  for (let n of e) {
    let o = Object.getOwnPropertyDescriptors(n);
    Object.assign(t, o);
  }
  return Object.defineProperties({}, t);
}
l($t, "mergeDefs");
function s_(e) {
  return $t(e._zod.def);
}
l(s_, "cloneDef");
function l_(e, t) {
  return t ? t.reduce((n, o) => n?.[o], e) : e;
}
l(l_, "getElementAtPath");
function u_(e) {
  let t = Object.keys(e), n = t.map((o) => e[o]);
  return Promise.all(n).then((o) => {
    let r = {};
    for (let i = 0; i < t.length; i++)
      r[t[i]] = o[i];
    return r;
  });
}
l(u_, "promiseAllObject");
function c_(e = 10) {
  let t = "abcdefghijklmnopqrstuvwxyz", n = "";
  for (let o = 0; o < e; o++)
    n += t[Math.floor(Math.random() * t.length)];
  return n;
}
l(c_, "randomString");
function wo(e) {
  return JSON.stringify(e);
}
l(wo, "esc");
function ja(e) {
  return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
l(ja, "slugify");
var ko = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {
};
function or(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
l(or, "isObject");
var Pa = yr(() => {
  if (typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare"))
    return !1;
  try {
    let e = Function;
    return new e(""), !0;
  } catch {
    return !1;
  }
});
function Ut(e) {
  if (or(e) === !1)
    return !1;
  let t = e.constructor;
  if (t === void 0 || typeof t != "function")
    return !0;
  let n = t.prototype;
  return !(or(n) === !1 || Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") === !1);
}
l(Ut, "isPlainObject");
function Na(e) {
  return Ut(e) ? { ...e } : Array.isArray(e) ? [...e] : e;
}
l(Na, "shallowClone");
function d_(e) {
  let t = 0;
  for (let n in e)
    Object.prototype.hasOwnProperty.call(e, n) && t++;
  return t;
}
l(d_, "numKeys");
var p_ = /* @__PURE__ */ l((e) => {
  let t = typeof e;
  switch (t) {
    case "undefined":
      return "undefined";
    case "string":
      return "string";
    case "number":
      return Number.isNaN(e) ? "nan" : "number";
    case "boolean":
      return "boolean";
    case "function":
      return "function";
    case "bigint":
      return "bigint";
    case "symbol":
      return "symbol";
    case "object":
      return Array.isArray(e) ? "array" : e === null ? "null" : e.then && typeof e.then == "function" && e.catch && typeof e.catch == "function" ? "promise" : typeof Map < "u" && e instanceof Map ? "map" : typeof Set < "u" && e instanceof Set ? "set" : typeof Date < "u" && e instanceof Date ? "date" : typeof File < "u" && e instanceof File ? "file" : "object";
    default:
      throw new Error(`Unknown data type: ${t}`);
  }
}, "getParsedType"), $n = /* @__PURE__ */ new Set(["string", "number", "symbol"]), Aa = /* @__PURE__ */ new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"]);
function Xe(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
l(Xe, "escapeRegex");
function Te(e, t, n) {
  let o = new e._zod.constr(t ?? e._zod.def);
  return (!t || n?.parent) && (o._zod.parent = e), o;
}
l(Te, "clone");
function z(e) {
  let t = e;
  if (!t)
    return {};
  if (typeof t == "string")
    return { error: /* @__PURE__ */ l(() => t, "error") };
  if (t?.message !== void 0) {
    if (t?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    t.error = t.message;
  }
  return delete t.message, typeof t.error == "string" ? { ...t, error: /* @__PURE__ */ l(() => t.error, "error") } : t;
}
l(z, "normalizeParams");
function m_(e) {
  let t;
  return new Proxy({}, {
    get(n, o, r) {
      return t ?? (t = e()), Reflect.get(t, o, r);
    },
    set(n, o, r, i) {
      return t ?? (t = e()), Reflect.set(t, o, r, i);
    },
    has(n, o) {
      return t ?? (t = e()), Reflect.has(t, o);
    },
    deleteProperty(n, o) {
      return t ?? (t = e()), Reflect.deleteProperty(t, o);
    },
    ownKeys(n) {
      return t ?? (t = e()), Reflect.ownKeys(t);
    },
    getOwnPropertyDescriptor(n, o) {
      return t ?? (t = e()), Reflect.getOwnPropertyDescriptor(t, o);
    },
    defineProperty(n, o, r) {
      return t ?? (t = e()), Reflect.defineProperty(t, o, r);
    }
  });
}
l(m_, "createTransparentProxy");
function w(e) {
  return typeof e == "bigint" ? e.toString() + "n" : typeof e == "string" ? `"${e}"` : `${e}`;
}
l(w, "stringifyPrimitive");
function Ra(e) {
  return Object.keys(e).filter((t) => e[t]._zod.optin === "optional" && e[t]._zod.optout === "optional");
}
l(Ra, "optionalKeys");
var Ca = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}, Da = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function f_(e, t) {
  let n = e._zod.def, o = n.checks;
  if (o && o.length > 0)
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  let i = $t(e._zod.def, {
    get shape() {
      let a = {};
      for (let u in t) {
        if (!(u in n.shape))
          throw new Error(`Unrecognized key: "${u}"`);
        t[u] && (a[u] = n.shape[u]);
      }
      return Dt(this, "shape", a), a;
    },
    checks: []
  });
  return Te(e, i);
}
l(f_, "pick");
function g_(e, t) {
  let n = e._zod.def, o = n.checks;
  if (o && o.length > 0)
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  let i = $t(e._zod.def, {
    get shape() {
      let a = { ...e._zod.def.shape };
      for (let u in t) {
        if (!(u in n.shape))
          throw new Error(`Unrecognized key: "${u}"`);
        t[u] && delete a[u];
      }
      return Dt(this, "shape", a), a;
    },
    checks: []
  });
  return Te(e, i);
}
l(g_, "omit");
function h_(e, t) {
  if (!Ut(t))
    throw new Error("Invalid input to extend: expected a plain object");
  let n = e._zod.def.checks;
  if (n && n.length > 0) {
    let i = e._zod.def.shape;
    for (let a in t)
      if (Object.getOwnPropertyDescriptor(i, a) !== void 0)
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  let r = $t(e._zod.def, {
    get shape() {
      let i = { ...e._zod.def.shape, ...t };
      return Dt(this, "shape", i), i;
    }
  });
  return Te(e, r);
}
l(h_, "extend");
function v_(e, t) {
  if (!Ut(t))
    throw new Error("Invalid input to safeExtend: expected a plain object");
  let n = $t(e._zod.def, {
    get shape() {
      let o = { ...e._zod.def.shape, ...t };
      return Dt(this, "shape", o), o;
    }
  });
  return Te(e, n);
}
l(v_, "safeExtend");
function y_(e, t) {
  let n = $t(e._zod.def, {
    get shape() {
      let o = { ...e._zod.def.shape, ...t._zod.def.shape };
      return Dt(this, "shape", o), o;
    },
    get catchall() {
      return t._zod.def.catchall;
    },
    checks: []
    // delete existing checks
  });
  return Te(e, n);
}
l(y_, "merge");
function __(e, t, n) {
  let r = t._zod.def.checks;
  if (r && r.length > 0)
    throw new Error(".partial() cannot be used on object schemas containing refinements");
  let a = $t(t._zod.def, {
    get shape() {
      let u = t._zod.def.shape, c = { ...u };
      if (n)
        for (let d in n) {
          if (!(d in u))
            throw new Error(`Unrecognized key: "${d}"`);
          n[d] && (c[d] = e ? new e({
            type: "optional",
            innerType: u[d]
          }) : u[d]);
        }
      else
        for (let d in u)
          c[d] = e ? new e({
            type: "optional",
            innerType: u[d]
          }) : u[d];
      return Dt(this, "shape", c), c;
    },
    checks: []
  });
  return Te(t, a);
}
l(__, "partial");
function b_(e, t, n) {
  let o = $t(t._zod.def, {
    get shape() {
      let r = t._zod.def.shape, i = { ...r };
      if (n)
        for (let a in n) {
          if (!(a in i))
            throw new Error(`Unrecognized key: "${a}"`);
          n[a] && (i[a] = new e({
            type: "nonoptional",
            innerType: r[a]
          }));
        }
      else
        for (let a in r)
          i[a] = new e({
            type: "nonoptional",
            innerType: r[a]
          });
      return Dt(this, "shape", i), i;
    }
  });
  return Te(t, o);
}
l(b_, "required");
function Mt(e, t = 0) {
  if (e.aborted === !0)
    return !0;
  for (let n = t; n < e.issues.length; n++)
    if (e.issues[n]?.continue !== !0)
      return !0;
  return !1;
}
l(Mt, "aborted");
function Ve(e, t) {
  return t.map((n) => {
    var o;
    return (o = n).path ?? (o.path = []), n.path.unshift(e), n;
  });
}
l(Ve, "prefixIssues");
function _n(e) {
  return typeof e == "string" ? e : e?.message;
}
l(_n, "unwrapMessage");
function De(e, t, n) {
  let o = { ...e, path: e.path ?? [] };
  if (!e.message) {
    let r = _n(e.inst?._zod.def?.error?.(e)) ?? _n(t?.error?.(e)) ?? _n(n.customError?.(e)) ?? _n(n.localeError?.(e)) ?? "Invalid input";
    o.message = r;
  }
  return delete o.inst, delete o.continue, t?.reportInput || delete o.input, o;
}
l(De, "finalizeIssue");
function wn(e) {
  return e instanceof Set ? "set" : e instanceof Map ? "map" : e instanceof File ? "file" : "unknown";
}
l(wn, "getSizableOrigin");
function kn(e) {
  return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
l(kn, "getLengthableOrigin");
function I(e) {
  let t = typeof e;
  switch (t) {
    case "number":
      return Number.isNaN(e) ? "nan" : "number";
    case "object": {
      if (e === null)
        return "null";
      if (Array.isArray(e))
        return "array";
      let n = e;
      if (n && Object.getPrototypeOf(n) !== Object.prototype && "constructor" in n && n.constructor)
        return n.constructor.name;
    }
  }
  return t;
}
l(I, "parsedType");
function _r(...e) {
  let [t, n, o] = e;
  return typeof t == "string" ? {
    message: t,
    code: "custom",
    input: n,
    inst: o
  } : { ...t };
}
l(_r, "issue");
function x_(e) {
  return Object.entries(e).filter(([t, n]) => Number.isNaN(Number.parseInt(t, 10))).map((t) => t[1]);
}
l(x_, "cleanEnum");
function hm(e) {
  let t = atob(e), n = new Uint8Array(t.length);
  for (let o = 0; o < t.length; o++)
    n[o] = t.charCodeAt(o);
  return n;
}
l(hm, "base64ToUint8Array");
function vm(e) {
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += String.fromCharCode(e[n]);
  return btoa(t);
}
l(vm, "uint8ArrayToBase64");
function $_(e) {
  let t = e.replace(/-/g, "+").replace(/_/g, "/"), n = "=".repeat((4 - t.length % 4) % 4);
  return hm(t + n);
}
l($_, "base64urlToUint8Array");
function w_(e) {
  return vm(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
l(w_, "uint8ArrayToBase64url");
function k_(e) {
  let t = e.replace(/^0x/, "");
  if (t.length % 2 !== 0)
    throw new Error("Invalid hex string length");
  let n = new Uint8Array(t.length / 2);
  for (let o = 0; o < t.length; o += 2)
    n[o / 2] = Number.parseInt(t.slice(o, o + 2), 16);
  return n;
}
l(k_, "hexToUint8Array");
function I_(e) {
  return Array.from(e).map((t) => t.toString(16).padStart(2, "0")).join("");
}
l(I_, "uint8ArrayToHex");
var Ea = class {
  static {
    l(this, "Class");
  }
  constructor(...t) {
  }
};

// node_modules/zod/v4/core/errors.js
var ym = /* @__PURE__ */ l((e, t) => {
  e.name = "$ZodError", Object.defineProperty(e, "_zod", {
    value: e._zod,
    enumerable: !1
  }), Object.defineProperty(e, "issues", {
    value: t,
    enumerable: !1
  }), e.message = JSON.stringify(t, vr, 2), Object.defineProperty(e, "toString", {
    value: /* @__PURE__ */ l(() => e.message, "value"),
    enumerable: !1
  });
}, "initializer"), In = h("$ZodError", ym), Ue = h("$ZodError", ym, { Parent: Error });
function Sn(e, t = (n) => n.message) {
  let n = {}, o = [];
  for (let r of e.issues)
    r.path.length > 0 ? (n[r.path[0]] = n[r.path[0]] || [], n[r.path[0]].push(t(r))) : o.push(t(r));
  return { formErrors: o, fieldErrors: n };
}
l(Sn, "flattenError");
function Tn(e, t = (n) => n.message) {
  let n = { _errors: [] }, o = /* @__PURE__ */ l((r) => {
    for (let i of r.issues)
      if (i.code === "invalid_union" && i.errors.length)
        i.errors.map((a) => o({ issues: a }));
      else if (i.code === "invalid_key")
        o({ issues: i.issues });
      else if (i.code === "invalid_element")
        o({ issues: i.issues });
      else if (i.path.length === 0)
        n._errors.push(t(i));
      else {
        let a = n, u = 0;
        for (; u < i.path.length; ) {
          let c = i.path[u];
          u === i.path.length - 1 ? (a[c] = a[c] || { _errors: [] }, a[c]._errors.push(t(i))) : a[c] = a[c] || { _errors: [] }, a = a[c], u++;
        }
      }
  }, "processError");
  return o(e), n;
}
l(Tn, "formatError");
function Ua(e, t = (n) => n.message) {
  let n = { errors: [] }, o = /* @__PURE__ */ l((r, i = []) => {
    var a, u;
    for (let c of r.issues)
      if (c.code === "invalid_union" && c.errors.length)
        c.errors.map((d) => o({ issues: d }, c.path));
      else if (c.code === "invalid_key")
        o({ issues: c.issues }, c.path);
      else if (c.code === "invalid_element")
        o({ issues: c.issues }, c.path);
      else {
        let d = [...i, ...c.path];
        if (d.length === 0) {
          n.errors.push(t(c));
          continue;
        }
        let p = n, m = 0;
        for (; m < d.length; ) {
          let v = d[m], g = m === d.length - 1;
          typeof v == "string" ? (p.properties ?? (p.properties = {}), (a = p.properties)[v] ?? (a[v] = { errors: [] }), p = p.properties[v]) : (p.items ?? (p.items = []), (u = p.items)[v] ?? (u[v] = { errors: [] }), p = p.items[v]), g && p.errors.push(t(c)), m++;
        }
      }
  }, "processError");
  return o(e), n;
}
l(Ua, "treeifyError");
function _m(e) {
  let t = [], n = e.map((o) => typeof o == "object" ? o.key : o);
  for (let o of n)
    typeof o == "number" ? t.push(`[${o}]`) : typeof o == "symbol" ? t.push(`[${JSON.stringify(String(o))}]`) : /[^\w$]/.test(o) ? t.push(`[${JSON.stringify(o)}]`) : (t.length && t.push("."), t.push(o));
  return t.join("");
}
l(_m, "toDotPath");
function Ma(e) {
  let t = [], n = [...e.issues].sort((o, r) => (o.path ?? []).length - (r.path ?? []).length);
  for (let o of n)
    t.push(`\u2716 ${o.message}`), o.path?.length && t.push(`  \u2192 at ${_m(o.path)}`);
  return t.join(`
`);
}
l(Ma, "prettifyError");

// node_modules/zod/v4/core/parse.js
var br = /* @__PURE__ */ l((e) => (t, n, o, r) => {
  let i = o ? Object.assign(o, { async: !1 }) : { async: !1 }, a = t._zod.run({ value: n, issues: [] }, i);
  if (a instanceof Promise)
    throw new nt();
  if (a.issues.length) {
    let u = new (r?.Err ?? e)(a.issues.map((c) => De(c, i, de())));
    throw ko(u, r?.callee), u;
  }
  return a.value;
}, "_parse"), Io = /* @__PURE__ */ br(Ue), xr = /* @__PURE__ */ l((e) => async (t, n, o, r) => {
  let i = o ? Object.assign(o, { async: !0 }) : { async: !0 }, a = t._zod.run({ value: n, issues: [] }, i);
  if (a instanceof Promise && (a = await a), a.issues.length) {
    let u = new (r?.Err ?? e)(a.issues.map((c) => De(c, i, de())));
    throw ko(u, r?.callee), u;
  }
  return a.value;
}, "_parseAsync"), So = /* @__PURE__ */ xr(Ue), $r = /* @__PURE__ */ l((e) => (t, n, o) => {
  let r = o ? { ...o, async: !1 } : { async: !1 }, i = t._zod.run({ value: n, issues: [] }, r);
  if (i instanceof Promise)
    throw new nt();
  return i.issues.length ? {
    success: !1,
    error: new (e ?? In)(i.issues.map((a) => De(a, r, de())))
  } : { success: !0, data: i.value };
}, "_safeParse"), Za = /* @__PURE__ */ $r(Ue), wr = /* @__PURE__ */ l((e) => async (t, n, o) => {
  let r = o ? Object.assign(o, { async: !0 }) : { async: !0 }, i = t._zod.run({ value: n, issues: [] }, r);
  return i instanceof Promise && (i = await i), i.issues.length ? {
    success: !1,
    error: new e(i.issues.map((a) => De(a, r, de())))
  } : { success: !0, data: i.value };
}, "_safeParseAsync"), La = /* @__PURE__ */ wr(Ue), To = /* @__PURE__ */ l((e) => (t, n, o) => {
  let r = o ? Object.assign(o, { direction: "backward" }) : { direction: "backward" };
  return br(e)(t, n, r);
}, "_encode"), T_ = /* @__PURE__ */ To(Ue), zo = /* @__PURE__ */ l((e) => (t, n, o) => br(e)(t, n, o), "_decode"), z_ = /* @__PURE__ */ zo(Ue), Eo = /* @__PURE__ */ l((e) => async (t, n, o) => {
  let r = o ? Object.assign(o, { direction: "backward" }) : { direction: "backward" };
  return xr(e)(t, n, r);
}, "_encodeAsync"), E_ = /* @__PURE__ */ Eo(Ue), Oo = /* @__PURE__ */ l((e) => async (t, n, o) => xr(e)(t, n, o), "_decodeAsync"), O_ = /* @__PURE__ */ Oo(Ue), jo = /* @__PURE__ */ l((e) => (t, n, o) => {
  let r = o ? Object.assign(o, { direction: "backward" }) : { direction: "backward" };
  return $r(e)(t, n, r);
}, "_safeEncode"), j_ = /* @__PURE__ */ jo(Ue), Po = /* @__PURE__ */ l((e) => (t, n, o) => $r(e)(t, n, o), "_safeDecode"), P_ = /* @__PURE__ */ Po(Ue), No = /* @__PURE__ */ l((e) => async (t, n, o) => {
  let r = o ? Object.assign(o, { direction: "backward" }) : { direction: "backward" };
  return wr(e)(t, n, r);
}, "_safeEncodeAsync"), N_ = /* @__PURE__ */ No(Ue), Ao = /* @__PURE__ */ l((e) => async (t, n, o) => wr(e)(t, n, o), "_safeDecodeAsync"), A_ = /* @__PURE__ */ Ao(Ue);

// node_modules/zod/v4/core/regexes.js
var Ye = {};
xt(Ye, {
  base64: () => ns,
  base64url: () => Ro,
  bigint: () => us,
  boolean: () => ds,
  browserEmail: () => F_,
  cidrv4: () => ts,
  cidrv6: () => rs,
  cuid: () => Fa,
  cuid2: () => Va,
  date: () => is,
  datetime: () => ss,
  domain: () => J_,
  duration: () => Wa,
  e164: () => os,
  email: () => Ha,
  emoji: () => Xa,
  extendedDuration: () => R_,
  guid: () => Ka,
  hex: () => B_,
  hostname: () => q_,
  html5Email: () => M_,
  idnEmail: () => L_,
  integer: () => cs,
  ipv4: () => Ya,
  ipv6: () => Qa,
  ksuid: () => Ba,
  lowercase: () => fs,
  mac: () => es,
  md5_base64: () => W_,
  md5_base64url: () => K_,
  md5_hex: () => G_,
  nanoid: () => Ga,
  null: () => ps,
  number: () => Co,
  rfc5322Email: () => Z_,
  sha1_base64: () => X_,
  sha1_base64url: () => Y_,
  sha1_hex: () => H_,
  sha256_base64: () => eb,
  sha256_base64url: () => tb,
  sha256_hex: () => Q_,
  sha384_base64: () => nb,
  sha384_base64url: () => ob,
  sha384_hex: () => rb,
  sha512_base64: () => ab,
  sha512_base64url: () => sb,
  sha512_hex: () => ib,
  string: () => ls,
  time: () => as,
  ulid: () => qa,
  undefined: () => ms,
  unicodeEmail: () => bm,
  uppercase: () => gs,
  uuid: () => ir,
  uuid4: () => C_,
  uuid6: () => D_,
  uuid7: () => U_,
  xid: () => Ja
});
var Fa = /^[cC][^\s-]{8,}$/, Va = /^[0-9a-z]+$/, qa = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, Ja = /^[0-9a-vA-V]{20}$/, Ba = /^[A-Za-z0-9]{27}$/, Ga = /^[a-zA-Z0-9_-]{21}$/, Wa = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, R_ = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Ka = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, ir = /* @__PURE__ */ l((e) => e ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, "uuid"), C_ = /* @__PURE__ */ ir(4), D_ = /* @__PURE__ */ ir(6), U_ = /* @__PURE__ */ ir(7), Ha = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, M_ = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, Z_ = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, bm = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u, L_ = bm, F_ = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, V_ = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function Xa() {
  return new RegExp(V_, "u");
}
l(Xa, "emoji");
var Ya = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Qa = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, es = /* @__PURE__ */ l((e) => {
  let t = Xe(e ?? ":");
  return new RegExp(`^(?:[0-9A-F]{2}${t}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${t}){5}[0-9a-f]{2}$`);
}, "mac"), ts = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, rs = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, ns = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, Ro = /^[A-Za-z0-9_-]*$/, q_ = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/, J_ = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, os = /^\+[1-9]\d{6,14}$/, xm = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", is = /* @__PURE__ */ new RegExp(`^${xm}$`);
function $m(e) {
  let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
l($m, "timeSource");
function as(e) {
  return new RegExp(`^${$m(e)}$`);
}
l(as, "time");
function ss(e) {
  let t = $m({ precision: e.precision }), n = ["Z"];
  e.local && n.push(""), e.offset && n.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  let o = `${t}(?:${n.join("|")})`;
  return new RegExp(`^${xm}T(?:${o})$`);
}
l(ss, "datetime");
var ls = /* @__PURE__ */ l((e) => {
  let t = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ""}}` : "[\\s\\S]*";
  return new RegExp(`^${t}$`);
}, "string"), us = /^-?\d+n?$/, cs = /^-?\d+$/, Co = /^-?\d+(?:\.\d+)?$/, ds = /^(?:true|false)$/i, ps = /^null$/i;
var ms = /^undefined$/i;
var fs = /^[^A-Z]*$/, gs = /^[^a-z]*$/, B_ = /^[0-9a-fA-F]*$/;
function zn(e, t) {
  return new RegExp(`^[A-Za-z0-9+/]{${e}}${t}$`);
}
l(zn, "fixedBase64");
function En(e) {
  return new RegExp(`^[A-Za-z0-9_-]{${e}}$`);
}
l(En, "fixedBase64url");
var G_ = /^[0-9a-fA-F]{32}$/, W_ = /* @__PURE__ */ zn(22, "=="), K_ = /* @__PURE__ */ En(22), H_ = /^[0-9a-fA-F]{40}$/, X_ = /* @__PURE__ */ zn(27, "="), Y_ = /* @__PURE__ */ En(27), Q_ = /^[0-9a-fA-F]{64}$/, eb = /* @__PURE__ */ zn(43, "="), tb = /* @__PURE__ */ En(43), rb = /^[0-9a-fA-F]{96}$/, nb = /* @__PURE__ */ zn(64, ""), ob = /* @__PURE__ */ En(64), ib = /^[0-9a-fA-F]{128}$/, ab = /* @__PURE__ */ zn(86, "=="), sb = /* @__PURE__ */ En(86);

// node_modules/zod/v4/core/checks.js
var ie = /* @__PURE__ */ h("$ZodCheck", (e, t) => {
  var n;
  e._zod ?? (e._zod = {}), e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), km = {
  number: "number",
  bigint: "bigint",
  object: "date"
}, Do = /* @__PURE__ */ h("$ZodCheckLessThan", (e, t) => {
  ie.init(e, t);
  let n = km[typeof t.value];
  e._zod.onattach.push((o) => {
    let r = o._zod.bag, i = (t.inclusive ? r.maximum : r.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    t.value < i && (t.inclusive ? r.maximum = t.value : r.exclusiveMaximum = t.value);
  }), e._zod.check = (o) => {
    (t.inclusive ? o.value <= t.value : o.value < t.value) || o.issues.push({
      origin: n,
      code: "too_big",
      maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
      input: o.value,
      inclusive: t.inclusive,
      inst: e,
      continue: !t.abort
    });
  };
}), Uo = /* @__PURE__ */ h("$ZodCheckGreaterThan", (e, t) => {
  ie.init(e, t);
  let n = km[typeof t.value];
  e._zod.onattach.push((o) => {
    let r = o._zod.bag, i = (t.inclusive ? r.minimum : r.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    t.value > i && (t.inclusive ? r.minimum = t.value : r.exclusiveMinimum = t.value);
  }), e._zod.check = (o) => {
    (t.inclusive ? o.value >= t.value : o.value > t.value) || o.issues.push({
      origin: n,
      code: "too_small",
      minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
      input: o.value,
      inclusive: t.inclusive,
      inst: e,
      continue: !t.abort
    });
  };
}), hs = /* @__PURE__ */ h("$ZodCheckMultipleOf", (e, t) => {
  ie.init(e, t), e._zod.onattach.push((n) => {
    var o;
    (o = n._zod.bag).multipleOf ?? (o.multipleOf = t.value);
  }), e._zod.check = (n) => {
    if (typeof n.value != typeof t.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    (typeof n.value == "bigint" ? n.value % t.value === BigInt(0) : Oa(n.value, t.value) === 0) || n.issues.push({
      origin: typeof n.value,
      code: "not_multiple_of",
      divisor: t.value,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), vs = /* @__PURE__ */ h("$ZodCheckNumberFormat", (e, t) => {
  ie.init(e, t), t.format = t.format || "float64";
  let n = t.format?.includes("int"), o = n ? "int" : "number", [r, i] = Ca[t.format];
  e._zod.onattach.push((a) => {
    let u = a._zod.bag;
    u.format = t.format, u.minimum = r, u.maximum = i, n && (u.pattern = cs);
  }), e._zod.check = (a) => {
    let u = a.value;
    if (n) {
      if (!Number.isInteger(u)) {
        a.issues.push({
          expected: o,
          format: t.format,
          code: "invalid_type",
          continue: !1,
          input: u,
          inst: e
        });
        return;
      }
      if (!Number.isSafeInteger(u)) {
        u > 0 ? a.issues.push({
          input: u,
          code: "too_big",
          maximum: Number.MAX_SAFE_INTEGER,
          note: "Integers must be within the safe integer range.",
          inst: e,
          origin: o,
          inclusive: !0,
          continue: !t.abort
        }) : a.issues.push({
          input: u,
          code: "too_small",
          minimum: Number.MIN_SAFE_INTEGER,
          note: "Integers must be within the safe integer range.",
          inst: e,
          origin: o,
          inclusive: !0,
          continue: !t.abort
        });
        return;
      }
    }
    u < r && a.issues.push({
      origin: "number",
      input: u,
      code: "too_small",
      minimum: r,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    }), u > i && a.issues.push({
      origin: "number",
      input: u,
      code: "too_big",
      maximum: i,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    });
  };
}), ys = /* @__PURE__ */ h("$ZodCheckBigIntFormat", (e, t) => {
  ie.init(e, t);
  let [n, o] = Da[t.format];
  e._zod.onattach.push((r) => {
    let i = r._zod.bag;
    i.format = t.format, i.minimum = n, i.maximum = o;
  }), e._zod.check = (r) => {
    let i = r.value;
    i < n && r.issues.push({
      origin: "bigint",
      input: i,
      code: "too_small",
      minimum: n,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    }), i > o && r.issues.push({
      origin: "bigint",
      input: i,
      code: "too_big",
      maximum: o,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    });
  };
}), _s = /* @__PURE__ */ h("$ZodCheckMaxSize", (e, t) => {
  var n;
  ie.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    let r = o.value;
    return !Ct(r) && r.size !== void 0;
  }), e._zod.onattach.push((o) => {
    let r = o._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    t.maximum < r && (o._zod.bag.maximum = t.maximum);
  }), e._zod.check = (o) => {
    let r = o.value;
    r.size <= t.maximum || o.issues.push({
      origin: wn(r),
      code: "too_big",
      maximum: t.maximum,
      inclusive: !0,
      input: r,
      inst: e,
      continue: !t.abort
    });
  };
}), bs = /* @__PURE__ */ h("$ZodCheckMinSize", (e, t) => {
  var n;
  ie.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    let r = o.value;
    return !Ct(r) && r.size !== void 0;
  }), e._zod.onattach.push((o) => {
    let r = o._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    t.minimum > r && (o._zod.bag.minimum = t.minimum);
  }), e._zod.check = (o) => {
    let r = o.value;
    r.size >= t.minimum || o.issues.push({
      origin: wn(r),
      code: "too_small",
      minimum: t.minimum,
      inclusive: !0,
      input: r,
      inst: e,
      continue: !t.abort
    });
  };
}), xs = /* @__PURE__ */ h("$ZodCheckSizeEquals", (e, t) => {
  var n;
  ie.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    let r = o.value;
    return !Ct(r) && r.size !== void 0;
  }), e._zod.onattach.push((o) => {
    let r = o._zod.bag;
    r.minimum = t.size, r.maximum = t.size, r.size = t.size;
  }), e._zod.check = (o) => {
    let r = o.value, i = r.size;
    if (i === t.size)
      return;
    let a = i > t.size;
    o.issues.push({
      origin: wn(r),
      ...a ? { code: "too_big", maximum: t.size } : { code: "too_small", minimum: t.size },
      inclusive: !0,
      exact: !0,
      input: o.value,
      inst: e,
      continue: !t.abort
    });
  };
}), $s = /* @__PURE__ */ h("$ZodCheckMaxLength", (e, t) => {
  var n;
  ie.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    let r = o.value;
    return !Ct(r) && r.length !== void 0;
  }), e._zod.onattach.push((o) => {
    let r = o._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    t.maximum < r && (o._zod.bag.maximum = t.maximum);
  }), e._zod.check = (o) => {
    let r = o.value;
    if (r.length <= t.maximum)
      return;
    let a = kn(r);
    o.issues.push({
      origin: a,
      code: "too_big",
      maximum: t.maximum,
      inclusive: !0,
      input: r,
      inst: e,
      continue: !t.abort
    });
  };
}), ws = /* @__PURE__ */ h("$ZodCheckMinLength", (e, t) => {
  var n;
  ie.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    let r = o.value;
    return !Ct(r) && r.length !== void 0;
  }), e._zod.onattach.push((o) => {
    let r = o._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    t.minimum > r && (o._zod.bag.minimum = t.minimum);
  }), e._zod.check = (o) => {
    let r = o.value;
    if (r.length >= t.minimum)
      return;
    let a = kn(r);
    o.issues.push({
      origin: a,
      code: "too_small",
      minimum: t.minimum,
      inclusive: !0,
      input: r,
      inst: e,
      continue: !t.abort
    });
  };
}), ks = /* @__PURE__ */ h("$ZodCheckLengthEquals", (e, t) => {
  var n;
  ie.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    let r = o.value;
    return !Ct(r) && r.length !== void 0;
  }), e._zod.onattach.push((o) => {
    let r = o._zod.bag;
    r.minimum = t.length, r.maximum = t.length, r.length = t.length;
  }), e._zod.check = (o) => {
    let r = o.value, i = r.length;
    if (i === t.length)
      return;
    let a = kn(r), u = i > t.length;
    o.issues.push({
      origin: a,
      ...u ? { code: "too_big", maximum: t.length } : { code: "too_small", minimum: t.length },
      inclusive: !0,
      exact: !0,
      input: o.value,
      inst: e,
      continue: !t.abort
    });
  };
}), kr = /* @__PURE__ */ h("$ZodCheckStringFormat", (e, t) => {
  var n, o;
  ie.init(e, t), e._zod.onattach.push((r) => {
    let i = r._zod.bag;
    i.format = t.format, t.pattern && (i.patterns ?? (i.patterns = /* @__PURE__ */ new Set()), i.patterns.add(t.pattern));
  }), t.pattern ? (n = e._zod).check ?? (n.check = (r) => {
    t.pattern.lastIndex = 0, !t.pattern.test(r.value) && r.issues.push({
      origin: "string",
      code: "invalid_format",
      format: t.format,
      input: r.value,
      ...t.pattern ? { pattern: t.pattern.toString() } : {},
      inst: e,
      continue: !t.abort
    });
  }) : (o = e._zod).check ?? (o.check = () => {
  });
}), Is = /* @__PURE__ */ h("$ZodCheckRegex", (e, t) => {
  kr.init(e, t), e._zod.check = (n) => {
    t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: n.value,
      pattern: t.pattern.toString(),
      inst: e,
      continue: !t.abort
    });
  };
}), Ss = /* @__PURE__ */ h("$ZodCheckLowerCase", (e, t) => {
  t.pattern ?? (t.pattern = fs), kr.init(e, t);
}), Ts = /* @__PURE__ */ h("$ZodCheckUpperCase", (e, t) => {
  t.pattern ?? (t.pattern = gs), kr.init(e, t);
}), zs = /* @__PURE__ */ h("$ZodCheckIncludes", (e, t) => {
  ie.init(e, t);
  let n = Xe(t.includes), o = new RegExp(typeof t.position == "number" ? `^.{${t.position}}${n}` : n);
  t.pattern = o, e._zod.onattach.push((r) => {
    let i = r._zod.bag;
    i.patterns ?? (i.patterns = /* @__PURE__ */ new Set()), i.patterns.add(o);
  }), e._zod.check = (r) => {
    r.value.includes(t.includes, t.position) || r.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: t.includes,
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Es = /* @__PURE__ */ h("$ZodCheckStartsWith", (e, t) => {
  ie.init(e, t);
  let n = new RegExp(`^${Xe(t.prefix)}.*`);
  t.pattern ?? (t.pattern = n), e._zod.onattach.push((o) => {
    let r = o._zod.bag;
    r.patterns ?? (r.patterns = /* @__PURE__ */ new Set()), r.patterns.add(n);
  }), e._zod.check = (o) => {
    o.value.startsWith(t.prefix) || o.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: t.prefix,
      input: o.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Os = /* @__PURE__ */ h("$ZodCheckEndsWith", (e, t) => {
  ie.init(e, t);
  let n = new RegExp(`.*${Xe(t.suffix)}$`);
  t.pattern ?? (t.pattern = n), e._zod.onattach.push((o) => {
    let r = o._zod.bag;
    r.patterns ?? (r.patterns = /* @__PURE__ */ new Set()), r.patterns.add(n);
  }), e._zod.check = (o) => {
    o.value.endsWith(t.suffix) || o.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: t.suffix,
      input: o.value,
      inst: e,
      continue: !t.abort
    });
  };
});
function wm(e, t, n) {
  e.issues.length && t.issues.push(...Ve(n, e.issues));
}
l(wm, "handleCheckPropertyResult");
var js = /* @__PURE__ */ h("$ZodCheckProperty", (e, t) => {
  ie.init(e, t), e._zod.check = (n) => {
    let o = t.schema._zod.run({
      value: n.value[t.property],
      issues: []
    }, {});
    if (o instanceof Promise)
      return o.then((r) => wm(r, n, t.property));
    wm(o, n, t.property);
  };
}), Ps = /* @__PURE__ */ h("$ZodCheckMimeType", (e, t) => {
  ie.init(e, t);
  let n = new Set(t.mime);
  e._zod.onattach.push((o) => {
    o._zod.bag.mime = t.mime;
  }), e._zod.check = (o) => {
    n.has(o.value.type) || o.issues.push({
      code: "invalid_value",
      values: t.mime,
      input: o.value.type,
      inst: e,
      continue: !t.abort
    });
  };
}), Ns = /* @__PURE__ */ h("$ZodCheckOverwrite", (e, t) => {
  ie.init(e, t), e._zod.check = (n) => {
    n.value = t.tx(n.value);
  };
});

// node_modules/zod/v4/core/doc.js
var On = class {
  static {
    l(this, "Doc");
  }
  constructor(t = []) {
    this.content = [], this.indent = 0, this && (this.args = t);
  }
  indented(t) {
    this.indent += 1, t(this), this.indent -= 1;
  }
  write(t) {
    if (typeof t == "function") {
      t(this, { execution: "sync" }), t(this, { execution: "async" });
      return;
    }
    let o = t.split(`
`).filter((a) => a), r = Math.min(...o.map((a) => a.length - a.trimStart().length)), i = o.map((a) => a.slice(r)).map((a) => " ".repeat(this.indent * 2) + a);
    for (let a of i)
      this.content.push(a);
  }
  compile() {
    let t = Function, n = this?.args, r = [...(this?.content ?? [""]).map((i) => `  ${i}`)];
    return new t(...n, r.join(`
`));
  }
};

// node_modules/zod/v4/core/versions.js
var As = {
  major: 4,
  minor: 3,
  patch: 5
};

// node_modules/zod/v4/core/schemas.js
var L = /* @__PURE__ */ h("$ZodType", (e, t) => {
  var n;
  e ?? (e = {}), e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = As;
  let o = [...e._zod.def.checks ?? []];
  e._zod.traits.has("$ZodCheck") && o.unshift(e);
  for (let r of o)
    for (let i of r._zod.onattach)
      i(e);
  if (o.length === 0)
    (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
      e._zod.run = e._zod.parse;
    });
  else {
    let r = /* @__PURE__ */ l((a, u, c) => {
      let d = Mt(a), p;
      for (let m of u) {
        if (m._zod.def.when) {
          if (!m._zod.def.when(a))
            continue;
        } else if (d)
          continue;
        let v = a.issues.length, g = m._zod.check(a);
        if (g instanceof Promise && c?.async === !1)
          throw new nt();
        if (p || g instanceof Promise)
          p = (p ?? Promise.resolve()).then(async () => {
            await g, a.issues.length !== v && (d || (d = Mt(a, v)));
          });
        else {
          if (a.issues.length === v)
            continue;
          d || (d = Mt(a, v));
        }
      }
      return p ? p.then(() => a) : a;
    }, "runChecks"), i = /* @__PURE__ */ l((a, u, c) => {
      if (Mt(a))
        return a.aborted = !0, a;
      let d = r(u, o, c);
      if (d instanceof Promise) {
        if (c.async === !1)
          throw new nt();
        return d.then((p) => e._zod.parse(p, c));
      }
      return e._zod.parse(d, c);
    }, "handleCanaryResult");
    e._zod.run = (a, u) => {
      if (u.skipChecks)
        return e._zod.parse(a, u);
      if (u.direction === "backward") {
        let d = e._zod.parse({ value: a.value, issues: [] }, { ...u, skipChecks: !0 });
        return d instanceof Promise ? d.then((p) => i(p, a, u)) : i(d, a, u);
      }
      let c = e._zod.parse(a, u);
      if (c instanceof Promise) {
        if (u.async === !1)
          throw new nt();
        return c.then((d) => r(d, o, u));
      }
      return r(c, o, u);
    };
  }
  G(e, "~standard", () => ({
    validate: /* @__PURE__ */ l((r) => {
      try {
        let i = Za(e, r);
        return i.success ? { value: i.data } : { issues: i.error?.issues };
      } catch {
        return La(e, r).then((a) => a.success ? { value: a.data } : { issues: a.error?.issues });
      }
    }, "validate"),
    vendor: "zod",
    version: 1
  }));
}), ar = /* @__PURE__ */ h("$ZodString", (e, t) => {
  L.init(e, t), e._zod.pattern = [...e?._zod.bag?.patterns ?? []].pop() ?? ls(e._zod.bag), e._zod.parse = (n, o) => {
    if (t.coerce)
      try {
        n.value = String(n.value);
      } catch {
      }
    return typeof n.value == "string" || n.issues.push({
      expected: "string",
      code: "invalid_type",
      input: n.value,
      inst: e
    }), n;
  };
}), ne = /* @__PURE__ */ h("$ZodStringFormat", (e, t) => {
  kr.init(e, t), ar.init(e, t);
}), Cs = /* @__PURE__ */ h("$ZodGUID", (e, t) => {
  t.pattern ?? (t.pattern = Ka), ne.init(e, t);
}), Ds = /* @__PURE__ */ h("$ZodUUID", (e, t) => {
  if (t.version) {
    let o = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    }[t.version];
    if (o === void 0)
      throw new Error(`Invalid UUID version: "${t.version}"`);
    t.pattern ?? (t.pattern = ir(o));
  } else
    t.pattern ?? (t.pattern = ir());
  ne.init(e, t);
}), Us = /* @__PURE__ */ h("$ZodEmail", (e, t) => {
  t.pattern ?? (t.pattern = Ha), ne.init(e, t);
}), Ms = /* @__PURE__ */ h("$ZodURL", (e, t) => {
  ne.init(e, t), e._zod.check = (n) => {
    try {
      let o = n.value.trim(), r = new URL(o);
      t.hostname && (t.hostname.lastIndex = 0, t.hostname.test(r.hostname) || n.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid hostname",
        pattern: t.hostname.source,
        input: n.value,
        inst: e,
        continue: !t.abort
      })), t.protocol && (t.protocol.lastIndex = 0, t.protocol.test(r.protocol.endsWith(":") ? r.protocol.slice(0, -1) : r.protocol) || n.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid protocol",
        pattern: t.protocol.source,
        input: n.value,
        inst: e,
        continue: !t.abort
      })), t.normalize ? n.value = r.href : n.value = o;
      return;
    } catch {
      n.issues.push({
        code: "invalid_format",
        format: "url",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
}), Zs = /* @__PURE__ */ h("$ZodEmoji", (e, t) => {
  t.pattern ?? (t.pattern = Xa()), ne.init(e, t);
}), Ls = /* @__PURE__ */ h("$ZodNanoID", (e, t) => {
  t.pattern ?? (t.pattern = Ga), ne.init(e, t);
}), Fs = /* @__PURE__ */ h("$ZodCUID", (e, t) => {
  t.pattern ?? (t.pattern = Fa), ne.init(e, t);
}), Vs = /* @__PURE__ */ h("$ZodCUID2", (e, t) => {
  t.pattern ?? (t.pattern = Va), ne.init(e, t);
}), qs = /* @__PURE__ */ h("$ZodULID", (e, t) => {
  t.pattern ?? (t.pattern = qa), ne.init(e, t);
}), Js = /* @__PURE__ */ h("$ZodXID", (e, t) => {
  t.pattern ?? (t.pattern = Ja), ne.init(e, t);
}), Bs = /* @__PURE__ */ h("$ZodKSUID", (e, t) => {
  t.pattern ?? (t.pattern = Ba), ne.init(e, t);
}), Gs = /* @__PURE__ */ h("$ZodISODateTime", (e, t) => {
  t.pattern ?? (t.pattern = ss(t)), ne.init(e, t);
}), Ws = /* @__PURE__ */ h("$ZodISODate", (e, t) => {
  t.pattern ?? (t.pattern = is), ne.init(e, t);
}), Ks = /* @__PURE__ */ h("$ZodISOTime", (e, t) => {
  t.pattern ?? (t.pattern = as(t)), ne.init(e, t);
}), Hs = /* @__PURE__ */ h("$ZodISODuration", (e, t) => {
  t.pattern ?? (t.pattern = Wa), ne.init(e, t);
}), Xs = /* @__PURE__ */ h("$ZodIPv4", (e, t) => {
  t.pattern ?? (t.pattern = Ya), ne.init(e, t), e._zod.bag.format = "ipv4";
}), Ys = /* @__PURE__ */ h("$ZodIPv6", (e, t) => {
  t.pattern ?? (t.pattern = Qa), ne.init(e, t), e._zod.bag.format = "ipv6", e._zod.check = (n) => {
    try {
      new URL(`http://[${n.value}]`);
    } catch {
      n.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
}), Qs = /* @__PURE__ */ h("$ZodMAC", (e, t) => {
  t.pattern ?? (t.pattern = es(t.delimiter)), ne.init(e, t), e._zod.bag.format = "mac";
}), el = /* @__PURE__ */ h("$ZodCIDRv4", (e, t) => {
  t.pattern ?? (t.pattern = ts), ne.init(e, t);
}), tl = /* @__PURE__ */ h("$ZodCIDRv6", (e, t) => {
  t.pattern ?? (t.pattern = rs), ne.init(e, t), e._zod.check = (n) => {
    let o = n.value.split("/");
    try {
      if (o.length !== 2)
        throw new Error();
      let [r, i] = o;
      if (!i)
        throw new Error();
      let a = Number(i);
      if (`${a}` !== i)
        throw new Error();
      if (a < 0 || a > 128)
        throw new Error();
      new URL(`http://[${r}]`);
    } catch {
      n.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
});
function rl(e) {
  if (e === "")
    return !0;
  if (e.length % 4 !== 0)
    return !1;
  try {
    return atob(e), !0;
  } catch {
    return !1;
  }
}
l(rl, "isValidBase64");
var nl = /* @__PURE__ */ h("$ZodBase64", (e, t) => {
  t.pattern ?? (t.pattern = ns), ne.init(e, t), e._zod.bag.contentEncoding = "base64", e._zod.check = (n) => {
    rl(n.value) || n.issues.push({
      code: "invalid_format",
      format: "base64",
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
});
function Dm(e) {
  if (!Ro.test(e))
    return !1;
  let t = e.replace(/[-_]/g, (o) => o === "-" ? "+" : "/"), n = t.padEnd(Math.ceil(t.length / 4) * 4, "=");
  return rl(n);
}
l(Dm, "isValidBase64URL");
var ol = /* @__PURE__ */ h("$ZodBase64URL", (e, t) => {
  t.pattern ?? (t.pattern = Ro), ne.init(e, t), e._zod.bag.contentEncoding = "base64url", e._zod.check = (n) => {
    Dm(n.value) || n.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), il = /* @__PURE__ */ h("$ZodE164", (e, t) => {
  t.pattern ?? (t.pattern = os), ne.init(e, t);
});
function Um(e, t = null) {
  try {
    let n = e.split(".");
    if (n.length !== 3)
      return !1;
    let [o] = n;
    if (!o)
      return !1;
    let r = JSON.parse(atob(o));
    return !("typ" in r && r?.typ !== "JWT" || !r.alg || t && (!("alg" in r) || r.alg !== t));
  } catch {
    return !1;
  }
}
l(Um, "isValidJWT");
var al = /* @__PURE__ */ h("$ZodJWT", (e, t) => {
  ne.init(e, t), e._zod.check = (n) => {
    Um(n.value, t.alg) || n.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), sl = /* @__PURE__ */ h("$ZodCustomStringFormat", (e, t) => {
  ne.init(e, t), e._zod.check = (n) => {
    t.fn(n.value) || n.issues.push({
      code: "invalid_format",
      format: t.format,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), qo = /* @__PURE__ */ h("$ZodNumber", (e, t) => {
  L.init(e, t), e._zod.pattern = e._zod.bag.pattern ?? Co, e._zod.parse = (n, o) => {
    if (t.coerce)
      try {
        n.value = Number(n.value);
      } catch {
      }
    let r = n.value;
    if (typeof r == "number" && !Number.isNaN(r) && Number.isFinite(r))
      return n;
    let i = typeof r == "number" ? Number.isNaN(r) ? "NaN" : Number.isFinite(r) ? void 0 : "Infinity" : void 0;
    return n.issues.push({
      expected: "number",
      code: "invalid_type",
      input: r,
      inst: e,
      ...i ? { received: i } : {}
    }), n;
  };
}), ll = /* @__PURE__ */ h("$ZodNumberFormat", (e, t) => {
  vs.init(e, t), qo.init(e, t);
}), jn = /* @__PURE__ */ h("$ZodBoolean", (e, t) => {
  L.init(e, t), e._zod.pattern = ds, e._zod.parse = (n, o) => {
    if (t.coerce)
      try {
        n.value = !!n.value;
      } catch {
      }
    let r = n.value;
    return typeof r == "boolean" || n.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), Jo = /* @__PURE__ */ h("$ZodBigInt", (e, t) => {
  L.init(e, t), e._zod.pattern = us, e._zod.parse = (n, o) => {
    if (t.coerce)
      try {
        n.value = BigInt(n.value);
      } catch {
      }
    return typeof n.value == "bigint" || n.issues.push({
      expected: "bigint",
      code: "invalid_type",
      input: n.value,
      inst: e
    }), n;
  };
}), ul = /* @__PURE__ */ h("$ZodBigIntFormat", (e, t) => {
  ys.init(e, t), Jo.init(e, t);
}), cl = /* @__PURE__ */ h("$ZodSymbol", (e, t) => {
  L.init(e, t), e._zod.parse = (n, o) => {
    let r = n.value;
    return typeof r == "symbol" || n.issues.push({
      expected: "symbol",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), dl = /* @__PURE__ */ h("$ZodUndefined", (e, t) => {
  L.init(e, t), e._zod.pattern = ms, e._zod.values = /* @__PURE__ */ new Set([void 0]), e._zod.optin = "optional", e._zod.optout = "optional", e._zod.parse = (n, o) => {
    let r = n.value;
    return typeof r > "u" || n.issues.push({
      expected: "undefined",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), pl = /* @__PURE__ */ h("$ZodNull", (e, t) => {
  L.init(e, t), e._zod.pattern = ps, e._zod.values = /* @__PURE__ */ new Set([null]), e._zod.parse = (n, o) => {
    let r = n.value;
    return r === null || n.issues.push({
      expected: "null",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), ml = /* @__PURE__ */ h("$ZodAny", (e, t) => {
  L.init(e, t), e._zod.parse = (n) => n;
}), fl = /* @__PURE__ */ h("$ZodUnknown", (e, t) => {
  L.init(e, t), e._zod.parse = (n) => n;
}), gl = /* @__PURE__ */ h("$ZodNever", (e, t) => {
  L.init(e, t), e._zod.parse = (n, o) => (n.issues.push({
    expected: "never",
    code: "invalid_type",
    input: n.value,
    inst: e
  }), n);
}), hl = /* @__PURE__ */ h("$ZodVoid", (e, t) => {
  L.init(e, t), e._zod.parse = (n, o) => {
    let r = n.value;
    return typeof r > "u" || n.issues.push({
      expected: "void",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), vl = /* @__PURE__ */ h("$ZodDate", (e, t) => {
  L.init(e, t), e._zod.parse = (n, o) => {
    if (t.coerce)
      try {
        n.value = new Date(n.value);
      } catch {
      }
    let r = n.value, i = r instanceof Date;
    return i && !Number.isNaN(r.getTime()) || n.issues.push({
      expected: "date",
      code: "invalid_type",
      input: r,
      ...i ? { received: "Invalid Date" } : {},
      inst: e
    }), n;
  };
});
function Sm(e, t, n) {
  e.issues.length && t.issues.push(...Ve(n, e.issues)), t.value[n] = e.value;
}
l(Sm, "handleArrayResult");
var yl = /* @__PURE__ */ h("$ZodArray", (e, t) => {
  L.init(e, t), e._zod.parse = (n, o) => {
    let r = n.value;
    if (!Array.isArray(r))
      return n.issues.push({
        expected: "array",
        code: "invalid_type",
        input: r,
        inst: e
      }), n;
    n.value = Array(r.length);
    let i = [];
    for (let a = 0; a < r.length; a++) {
      let u = r[a], c = t.element._zod.run({
        value: u,
        issues: []
      }, o);
      c instanceof Promise ? i.push(c.then((d) => Sm(d, n, a))) : Sm(c, n, a);
    }
    return i.length ? Promise.all(i).then(() => n) : n;
  };
});
function Vo(e, t, n, o, r) {
  if (e.issues.length) {
    if (r && !(n in o))
      return;
    t.issues.push(...Ve(n, e.issues));
  }
  e.value === void 0 ? n in o && (t.value[n] = void 0) : t.value[n] = e.value;
}
l(Vo, "handlePropertyResult");
function Mm(e) {
  let t = Object.keys(e.shape);
  for (let o of t)
    if (!e.shape?.[o]?._zod?.traits?.has("$ZodType"))
      throw new Error(`Invalid element at key "${o}": expected a Zod schema`);
  let n = Ra(e.shape);
  return {
    ...e,
    keys: t,
    keySet: new Set(t),
    numKeys: t.length,
    optionalKeys: new Set(n)
  };
}
l(Mm, "normalizeDef");
function Zm(e, t, n, o, r, i) {
  let a = [], u = r.keySet, c = r.catchall._zod, d = c.def.type, p = c.optout === "optional";
  for (let m in t) {
    if (u.has(m))
      continue;
    if (d === "never") {
      a.push(m);
      continue;
    }
    let v = c.run({ value: t[m], issues: [] }, o);
    v instanceof Promise ? e.push(v.then((g) => Vo(g, n, m, t, p))) : Vo(v, n, m, t, p);
  }
  return a.length && n.issues.push({
    code: "unrecognized_keys",
    keys: a,
    input: t,
    inst: i
  }), e.length ? Promise.all(e).then(() => n) : n;
}
l(Zm, "handleCatchall");
var Lm = /* @__PURE__ */ h("$ZodObject", (e, t) => {
  if (L.init(e, t), !Object.getOwnPropertyDescriptor(t, "shape")?.get) {
    let u = t.shape;
    Object.defineProperty(t, "shape", {
      get: /* @__PURE__ */ l(() => {
        let c = { ...u };
        return Object.defineProperty(t, "shape", {
          value: c
        }), c;
      }, "get")
    });
  }
  let o = yr(() => Mm(t));
  G(e._zod, "propValues", () => {
    let u = t.shape, c = {};
    for (let d in u) {
      let p = u[d]._zod;
      if (p.values) {
        c[d] ?? (c[d] = /* @__PURE__ */ new Set());
        for (let m of p.values)
          c[d].add(m);
      }
    }
    return c;
  });
  let r = or, i = t.catchall, a;
  e._zod.parse = (u, c) => {
    a ?? (a = o.value);
    let d = u.value;
    if (!r(d))
      return u.issues.push({
        expected: "object",
        code: "invalid_type",
        input: d,
        inst: e
      }), u;
    u.value = {};
    let p = [], m = a.shape;
    for (let v of a.keys) {
      let g = m[v], b = g._zod.optout === "optional", x = g._zod.run({ value: d[v], issues: [] }, c);
      x instanceof Promise ? p.push(x.then(($) => Vo($, u, v, d, b))) : Vo(x, u, v, d, b);
    }
    return i ? Zm(p, d, u, c, o.value, e) : p.length ? Promise.all(p).then(() => u) : u;
  };
}), _l = /* @__PURE__ */ h("$ZodObjectJIT", (e, t) => {
  Lm.init(e, t);
  let n = e._zod.parse, o = yr(() => Mm(t)), r = /* @__PURE__ */ l((v) => {
    let g = new On(["shape", "payload", "ctx"]), b = o.value, x = /* @__PURE__ */ l((y) => {
      let B = wo(y);
      return `shape[${B}]._zod.run({ value: input[${B}], issues: [] }, ctx)`;
    }, "parseStr");
    g.write("const input = payload.value;");
    let $ = /* @__PURE__ */ Object.create(null), E = 0;
    for (let y of b.keys)
      $[y] = `key_${E++}`;
    g.write("const newResult = {};");
    for (let y of b.keys) {
      let B = $[y], Y = wo(y), J = v[y]?._zod?.optout === "optional";
      g.write(`const ${B} = ${x(y)};`), J ? g.write(`
        if (${B}.issues.length) {
          if (${Y} in input) {
            payload.issues = payload.issues.concat(${B}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${Y}, ...iss.path] : [${Y}]
            })));
          }
        }
        
        if (${B}.value === undefined) {
          if (${Y} in input) {
            newResult[${Y}] = undefined;
          }
        } else {
          newResult[${Y}] = ${B}.value;
        }
        
      `) : g.write(`
        if (${B}.issues.length) {
          payload.issues = payload.issues.concat(${B}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${Y}, ...iss.path] : [${Y}]
          })));
        }
        
        if (${B}.value === undefined) {
          if (${Y} in input) {
            newResult[${Y}] = undefined;
          }
        } else {
          newResult[${Y}] = ${B}.value;
        }
        
      `);
    }
    g.write("payload.value = newResult;"), g.write("return payload;");
    let O = g.compile();
    return (y, B) => O(v, y, B);
  }, "generateFastpass"), i, a = or, u = !yn.jitless, d = u && Pa.value, p = t.catchall, m;
  e._zod.parse = (v, g) => {
    m ?? (m = o.value);
    let b = v.value;
    return a(b) ? u && d && g?.async === !1 && g.jitless !== !0 ? (i || (i = r(t.shape)), v = i(v, g), p ? Zm([], b, v, g, m, e) : v) : n(v, g) : (v.issues.push({
      expected: "object",
      code: "invalid_type",
      input: b,
      inst: e
    }), v);
  };
});
function Tm(e, t, n, o) {
  for (let i of e)
    if (i.issues.length === 0)
      return t.value = i.value, t;
  let r = e.filter((i) => !Mt(i));
  return r.length === 1 ? (t.value = r[0].value, r[0]) : (t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: n,
    errors: e.map((i) => i.issues.map((a) => De(a, o, de())))
  }), t);
}
l(Tm, "handleUnionResults");
var Pn = /* @__PURE__ */ h("$ZodUnion", (e, t) => {
  L.init(e, t), G(e._zod, "optin", () => t.options.some((r) => r._zod.optin === "optional") ? "optional" : void 0), G(e._zod, "optout", () => t.options.some((r) => r._zod.optout === "optional") ? "optional" : void 0), G(e._zod, "values", () => {
    if (t.options.every((r) => r._zod.values))
      return new Set(t.options.flatMap((r) => Array.from(r._zod.values)));
  }), G(e._zod, "pattern", () => {
    if (t.options.every((r) => r._zod.pattern)) {
      let r = t.options.map((i) => i._zod.pattern);
      return new RegExp(`^(${r.map((i) => xn(i.source)).join("|")})$`);
    }
  });
  let n = t.options.length === 1, o = t.options[0]._zod.run;
  e._zod.parse = (r, i) => {
    if (n)
      return o(r, i);
    let a = !1, u = [];
    for (let c of t.options) {
      let d = c._zod.run({
        value: r.value,
        issues: []
      }, i);
      if (d instanceof Promise)
        u.push(d), a = !0;
      else {
        if (d.issues.length === 0)
          return d;
        u.push(d);
      }
    }
    return a ? Promise.all(u).then((c) => Tm(c, r, e, i)) : Tm(u, r, e, i);
  };
});
function zm(e, t, n, o) {
  let r = e.filter((i) => i.issues.length === 0);
  return r.length === 1 ? (t.value = r[0].value, t) : (r.length === 0 ? t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: n,
    errors: e.map((i) => i.issues.map((a) => De(a, o, de())))
  }) : t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: n,
    errors: [],
    inclusive: !1
  }), t);
}
l(zm, "handleExclusiveUnionResults");
var bl = /* @__PURE__ */ h("$ZodXor", (e, t) => {
  Pn.init(e, t), t.inclusive = !1;
  let n = t.options.length === 1, o = t.options[0]._zod.run;
  e._zod.parse = (r, i) => {
    if (n)
      return o(r, i);
    let a = !1, u = [];
    for (let c of t.options) {
      let d = c._zod.run({
        value: r.value,
        issues: []
      }, i);
      d instanceof Promise ? (u.push(d), a = !0) : u.push(d);
    }
    return a ? Promise.all(u).then((c) => zm(c, r, e, i)) : zm(u, r, e, i);
  };
}), xl = /* @__PURE__ */ h("$ZodDiscriminatedUnion", (e, t) => {
  t.inclusive = !1, Pn.init(e, t);
  let n = e._zod.parse;
  G(e._zod, "propValues", () => {
    let r = {};
    for (let i of t.options) {
      let a = i._zod.propValues;
      if (!a || Object.keys(a).length === 0)
        throw new Error(`Invalid discriminated union option at index "${t.options.indexOf(i)}"`);
      for (let [u, c] of Object.entries(a)) {
        r[u] || (r[u] = /* @__PURE__ */ new Set());
        for (let d of c)
          r[u].add(d);
      }
    }
    return r;
  });
  let o = yr(() => {
    let r = t.options, i = /* @__PURE__ */ new Map();
    for (let a of r) {
      let u = a._zod.propValues?.[t.discriminator];
      if (!u || u.size === 0)
        throw new Error(`Invalid discriminated union option at index "${t.options.indexOf(a)}"`);
      for (let c of u) {
        if (i.has(c))
          throw new Error(`Duplicate discriminator value "${String(c)}"`);
        i.set(c, a);
      }
    }
    return i;
  });
  e._zod.parse = (r, i) => {
    let a = r.value;
    if (!or(a))
      return r.issues.push({
        code: "invalid_type",
        expected: "object",
        input: a,
        inst: e
      }), r;
    let u = o.value.get(a?.[t.discriminator]);
    return u ? u._zod.run(r, i) : t.unionFallback ? n(r, i) : (r.issues.push({
      code: "invalid_union",
      errors: [],
      note: "No matching discriminator",
      discriminator: t.discriminator,
      input: a,
      path: [t.discriminator],
      inst: e
    }), r);
  };
}), $l = /* @__PURE__ */ h("$ZodIntersection", (e, t) => {
  L.init(e, t), e._zod.parse = (n, o) => {
    let r = n.value, i = t.left._zod.run({ value: r, issues: [] }, o), a = t.right._zod.run({ value: r, issues: [] }, o);
    return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([c, d]) => Em(n, c, d)) : Em(n, i, a);
  };
});
function Rs(e, t) {
  if (e === t)
    return { valid: !0, data: e };
  if (e instanceof Date && t instanceof Date && +e == +t)
    return { valid: !0, data: e };
  if (Ut(e) && Ut(t)) {
    let n = Object.keys(t), o = Object.keys(e).filter((i) => n.indexOf(i) !== -1), r = { ...e, ...t };
    for (let i of o) {
      let a = Rs(e[i], t[i]);
      if (!a.valid)
        return {
          valid: !1,
          mergeErrorPath: [i, ...a.mergeErrorPath]
        };
      r[i] = a.data;
    }
    return { valid: !0, data: r };
  }
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length)
      return { valid: !1, mergeErrorPath: [] };
    let n = [];
    for (let o = 0; o < e.length; o++) {
      let r = e[o], i = t[o], a = Rs(r, i);
      if (!a.valid)
        return {
          valid: !1,
          mergeErrorPath: [o, ...a.mergeErrorPath]
        };
      n.push(a.data);
    }
    return { valid: !0, data: n };
  }
  return { valid: !1, mergeErrorPath: [] };
}
l(Rs, "mergeValues");
function Em(e, t, n) {
  let o = /* @__PURE__ */ new Map(), r;
  for (let u of t.issues)
    if (u.code === "unrecognized_keys") {
      r ?? (r = u);
      for (let c of u.keys)
        o.has(c) || o.set(c, {}), o.get(c).l = !0;
    } else
      e.issues.push(u);
  for (let u of n.issues)
    if (u.code === "unrecognized_keys")
      for (let c of u.keys)
        o.has(c) || o.set(c, {}), o.get(c).r = !0;
    else
      e.issues.push(u);
  let i = [...o].filter(([, u]) => u.l && u.r).map(([u]) => u);
  if (i.length && r && e.issues.push({ ...r, keys: i }), Mt(e))
    return e;
  let a = Rs(t.value, n.value);
  if (!a.valid)
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(a.mergeErrorPath)}`);
  return e.value = a.data, e;
}
l(Em, "handleIntersectionResults");
var Bo = /* @__PURE__ */ h("$ZodTuple", (e, t) => {
  L.init(e, t);
  let n = t.items;
  e._zod.parse = (o, r) => {
    let i = o.value;
    if (!Array.isArray(i))
      return o.issues.push({
        input: i,
        inst: e,
        expected: "tuple",
        code: "invalid_type"
      }), o;
    o.value = [];
    let a = [], u = [...n].reverse().findIndex((p) => p._zod.optin !== "optional"), c = u === -1 ? 0 : n.length - u;
    if (!t.rest) {
      let p = i.length > n.length, m = i.length < c - 1;
      if (p || m)
        return o.issues.push({
          ...p ? { code: "too_big", maximum: n.length, inclusive: !0 } : { code: "too_small", minimum: n.length },
          input: i,
          inst: e,
          origin: "array"
        }), o;
    }
    let d = -1;
    for (let p of n) {
      if (d++, d >= i.length && d >= c)
        continue;
      let m = p._zod.run({
        value: i[d],
        issues: []
      }, r);
      m instanceof Promise ? a.push(m.then((v) => Mo(v, o, d))) : Mo(m, o, d);
    }
    if (t.rest) {
      let p = i.slice(n.length);
      for (let m of p) {
        d++;
        let v = t.rest._zod.run({
          value: m,
          issues: []
        }, r);
        v instanceof Promise ? a.push(v.then((g) => Mo(g, o, d))) : Mo(v, o, d);
      }
    }
    return a.length ? Promise.all(a).then(() => o) : o;
  };
});
function Mo(e, t, n) {
  e.issues.length && t.issues.push(...Ve(n, e.issues)), t.value[n] = e.value;
}
l(Mo, "handleTupleResult");
var wl = /* @__PURE__ */ h("$ZodRecord", (e, t) => {
  L.init(e, t), e._zod.parse = (n, o) => {
    let r = n.value;
    if (!Ut(r))
      return n.issues.push({
        expected: "record",
        code: "invalid_type",
        input: r,
        inst: e
      }), n;
    let i = [], a = t.keyType._zod.values;
    if (a) {
      n.value = {};
      let u = /* @__PURE__ */ new Set();
      for (let d of a)
        if (typeof d == "string" || typeof d == "number" || typeof d == "symbol") {
          u.add(typeof d == "number" ? d.toString() : d);
          let p = t.valueType._zod.run({ value: r[d], issues: [] }, o);
          p instanceof Promise ? i.push(p.then((m) => {
            m.issues.length && n.issues.push(...Ve(d, m.issues)), n.value[d] = m.value;
          })) : (p.issues.length && n.issues.push(...Ve(d, p.issues)), n.value[d] = p.value);
        }
      let c;
      for (let d in r)
        u.has(d) || (c = c ?? [], c.push(d));
      c && c.length > 0 && n.issues.push({
        code: "unrecognized_keys",
        input: r,
        inst: e,
        keys: c
      });
    } else {
      n.value = {};
      for (let u of Reflect.ownKeys(r)) {
        if (u === "__proto__")
          continue;
        let c = t.keyType._zod.run({ value: u, issues: [] }, o);
        if (c instanceof Promise)
          throw new Error("Async schemas not supported in object keys currently");
        if (typeof u == "string" && Co.test(u) && c.issues.length && c.issues.some((m) => m.code === "invalid_type" && m.expected === "number")) {
          let m = t.keyType._zod.run({ value: Number(u), issues: [] }, o);
          if (m instanceof Promise)
            throw new Error("Async schemas not supported in object keys currently");
          m.issues.length === 0 && (c = m);
        }
        if (c.issues.length) {
          t.mode === "loose" ? n.value[u] = r[u] : n.issues.push({
            code: "invalid_key",
            origin: "record",
            issues: c.issues.map((m) => De(m, o, de())),
            input: u,
            path: [u],
            inst: e
          });
          continue;
        }
        let p = t.valueType._zod.run({ value: r[u], issues: [] }, o);
        p instanceof Promise ? i.push(p.then((m) => {
          m.issues.length && n.issues.push(...Ve(u, m.issues)), n.value[c.value] = m.value;
        })) : (p.issues.length && n.issues.push(...Ve(u, p.issues)), n.value[c.value] = p.value);
      }
    }
    return i.length ? Promise.all(i).then(() => n) : n;
  };
}), kl = /* @__PURE__ */ h("$ZodMap", (e, t) => {
  L.init(e, t), e._zod.parse = (n, o) => {
    let r = n.value;
    if (!(r instanceof Map))
      return n.issues.push({
        expected: "map",
        code: "invalid_type",
        input: r,
        inst: e
      }), n;
    let i = [];
    n.value = /* @__PURE__ */ new Map();
    for (let [a, u] of r) {
      let c = t.keyType._zod.run({ value: a, issues: [] }, o), d = t.valueType._zod.run({ value: u, issues: [] }, o);
      c instanceof Promise || d instanceof Promise ? i.push(Promise.all([c, d]).then(([p, m]) => {
        Om(p, m, n, a, r, e, o);
      })) : Om(c, d, n, a, r, e, o);
    }
    return i.length ? Promise.all(i).then(() => n) : n;
  };
});
function Om(e, t, n, o, r, i, a) {
  e.issues.length && ($n.has(typeof o) ? n.issues.push(...Ve(o, e.issues)) : n.issues.push({
    code: "invalid_key",
    origin: "map",
    input: r,
    inst: i,
    issues: e.issues.map((u) => De(u, a, de()))
  })), t.issues.length && ($n.has(typeof o) ? n.issues.push(...Ve(o, t.issues)) : n.issues.push({
    origin: "map",
    code: "invalid_element",
    input: r,
    inst: i,
    key: o,
    issues: t.issues.map((u) => De(u, a, de()))
  })), n.value.set(e.value, t.value);
}
l(Om, "handleMapResult");
var Il = /* @__PURE__ */ h("$ZodSet", (e, t) => {
  L.init(e, t), e._zod.parse = (n, o) => {
    let r = n.value;
    if (!(r instanceof Set))
      return n.issues.push({
        input: r,
        inst: e,
        expected: "set",
        code: "invalid_type"
      }), n;
    let i = [];
    n.value = /* @__PURE__ */ new Set();
    for (let a of r) {
      let u = t.valueType._zod.run({ value: a, issues: [] }, o);
      u instanceof Promise ? i.push(u.then((c) => jm(c, n))) : jm(u, n);
    }
    return i.length ? Promise.all(i).then(() => n) : n;
  };
});
function jm(e, t) {
  e.issues.length && t.issues.push(...e.issues), t.value.add(e.value);
}
l(jm, "handleSetResult");
var Sl = /* @__PURE__ */ h("$ZodEnum", (e, t) => {
  L.init(e, t);
  let n = bn(t.entries), o = new Set(n);
  e._zod.values = o, e._zod.pattern = new RegExp(`^(${n.filter((r) => $n.has(typeof r)).map((r) => typeof r == "string" ? Xe(r) : r.toString()).join("|")})$`), e._zod.parse = (r, i) => {
    let a = r.value;
    return o.has(a) || r.issues.push({
      code: "invalid_value",
      values: n,
      input: a,
      inst: e
    }), r;
  };
}), Tl = /* @__PURE__ */ h("$ZodLiteral", (e, t) => {
  if (L.init(e, t), t.values.length === 0)
    throw new Error("Cannot create literal schema with no valid values");
  let n = new Set(t.values);
  e._zod.values = n, e._zod.pattern = new RegExp(`^(${t.values.map((o) => typeof o == "string" ? Xe(o) : o ? Xe(o.toString()) : String(o)).join("|")})$`), e._zod.parse = (o, r) => {
    let i = o.value;
    return n.has(i) || o.issues.push({
      code: "invalid_value",
      values: t.values,
      input: i,
      inst: e
    }), o;
  };
}), zl = /* @__PURE__ */ h("$ZodFile", (e, t) => {
  L.init(e, t), e._zod.parse = (n, o) => {
    let r = n.value;
    return r instanceof File || n.issues.push({
      expected: "file",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), El = /* @__PURE__ */ h("$ZodTransform", (e, t) => {
  L.init(e, t), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      throw new Rt(e.constructor.name);
    let r = t.transform(n.value, n);
    if (o.async)
      return (r instanceof Promise ? r : Promise.resolve(r)).then((a) => (n.value = a, n));
    if (r instanceof Promise)
      throw new nt();
    return n.value = r, n;
  };
});
function Pm(e, t) {
  return e.issues.length && t === void 0 ? { issues: [], value: void 0 } : e;
}
l(Pm, "handleOptionalResult");
var Go = /* @__PURE__ */ h("$ZodOptional", (e, t) => {
  L.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", G(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, void 0]) : void 0), G(e._zod, "pattern", () => {
    let n = t.innerType._zod.pattern;
    return n ? new RegExp(`^(${xn(n.source)})?$`) : void 0;
  }), e._zod.parse = (n, o) => {
    if (t.innerType._zod.optin === "optional") {
      let r = t.innerType._zod.run(n, o);
      return r instanceof Promise ? r.then((i) => Pm(i, n.value)) : Pm(r, n.value);
    }
    return n.value === void 0 ? n : t.innerType._zod.run(n, o);
  };
}), Ol = /* @__PURE__ */ h("$ZodExactOptional", (e, t) => {
  Go.init(e, t), G(e._zod, "values", () => t.innerType._zod.values), G(e._zod, "pattern", () => t.innerType._zod.pattern), e._zod.parse = (n, o) => t.innerType._zod.run(n, o);
}), jl = /* @__PURE__ */ h("$ZodNullable", (e, t) => {
  L.init(e, t), G(e._zod, "optin", () => t.innerType._zod.optin), G(e._zod, "optout", () => t.innerType._zod.optout), G(e._zod, "pattern", () => {
    let n = t.innerType._zod.pattern;
    return n ? new RegExp(`^(${xn(n.source)}|null)$`) : void 0;
  }), G(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (n, o) => n.value === null ? n : t.innerType._zod.run(n, o);
}), Pl = /* @__PURE__ */ h("$ZodDefault", (e, t) => {
  L.init(e, t), e._zod.optin = "optional", G(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      return t.innerType._zod.run(n, o);
    if (n.value === void 0)
      return n.value = t.defaultValue, n;
    let r = t.innerType._zod.run(n, o);
    return r instanceof Promise ? r.then((i) => Nm(i, t)) : Nm(r, t);
  };
});
function Nm(e, t) {
  return e.value === void 0 && (e.value = t.defaultValue), e;
}
l(Nm, "handleDefaultResult");
var Nl = /* @__PURE__ */ h("$ZodPrefault", (e, t) => {
  L.init(e, t), e._zod.optin = "optional", G(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, o) => (o.direction === "backward" || n.value === void 0 && (n.value = t.defaultValue), t.innerType._zod.run(n, o));
}), Al = /* @__PURE__ */ h("$ZodNonOptional", (e, t) => {
  L.init(e, t), G(e._zod, "values", () => {
    let n = t.innerType._zod.values;
    return n ? new Set([...n].filter((o) => o !== void 0)) : void 0;
  }), e._zod.parse = (n, o) => {
    let r = t.innerType._zod.run(n, o);
    return r instanceof Promise ? r.then((i) => Am(i, e)) : Am(r, e);
  };
});
function Am(e, t) {
  return !e.issues.length && e.value === void 0 && e.issues.push({
    code: "invalid_type",
    expected: "nonoptional",
    input: e.value,
    inst: t
  }), e;
}
l(Am, "handleNonOptionalResult");
var Rl = /* @__PURE__ */ h("$ZodSuccess", (e, t) => {
  L.init(e, t), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      throw new Rt("ZodSuccess");
    let r = t.innerType._zod.run(n, o);
    return r instanceof Promise ? r.then((i) => (n.value = i.issues.length === 0, n)) : (n.value = r.issues.length === 0, n);
  };
}), Cl = /* @__PURE__ */ h("$ZodCatch", (e, t) => {
  L.init(e, t), G(e._zod, "optin", () => t.innerType._zod.optin), G(e._zod, "optout", () => t.innerType._zod.optout), G(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      return t.innerType._zod.run(n, o);
    let r = t.innerType._zod.run(n, o);
    return r instanceof Promise ? r.then((i) => (n.value = i.value, i.issues.length && (n.value = t.catchValue({
      ...n,
      error: {
        issues: i.issues.map((a) => De(a, o, de()))
      },
      input: n.value
    }), n.issues = []), n)) : (n.value = r.value, r.issues.length && (n.value = t.catchValue({
      ...n,
      error: {
        issues: r.issues.map((i) => De(i, o, de()))
      },
      input: n.value
    }), n.issues = []), n);
  };
}), Dl = /* @__PURE__ */ h("$ZodNaN", (e, t) => {
  L.init(e, t), e._zod.parse = (n, o) => ((typeof n.value != "number" || !Number.isNaN(n.value)) && n.issues.push({
    input: n.value,
    inst: e,
    expected: "nan",
    code: "invalid_type"
  }), n);
}), Ul = /* @__PURE__ */ h("$ZodPipe", (e, t) => {
  L.init(e, t), G(e._zod, "values", () => t.in._zod.values), G(e._zod, "optin", () => t.in._zod.optin), G(e._zod, "optout", () => t.out._zod.optout), G(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (n, o) => {
    if (o.direction === "backward") {
      let i = t.out._zod.run(n, o);
      return i instanceof Promise ? i.then((a) => Zo(a, t.in, o)) : Zo(i, t.in, o);
    }
    let r = t.in._zod.run(n, o);
    return r instanceof Promise ? r.then((i) => Zo(i, t.out, o)) : Zo(r, t.out, o);
  };
});
function Zo(e, t, n) {
  return e.issues.length ? (e.aborted = !0, e) : t._zod.run({ value: e.value, issues: e.issues }, n);
}
l(Zo, "handlePipeResult");
var Nn = /* @__PURE__ */ h("$ZodCodec", (e, t) => {
  L.init(e, t), G(e._zod, "values", () => t.in._zod.values), G(e._zod, "optin", () => t.in._zod.optin), G(e._zod, "optout", () => t.out._zod.optout), G(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (n, o) => {
    if ((o.direction || "forward") === "forward") {
      let i = t.in._zod.run(n, o);
      return i instanceof Promise ? i.then((a) => Lo(a, t, o)) : Lo(i, t, o);
    } else {
      let i = t.out._zod.run(n, o);
      return i instanceof Promise ? i.then((a) => Lo(a, t, o)) : Lo(i, t, o);
    }
  };
});
function Lo(e, t, n) {
  if (e.issues.length)
    return e.aborted = !0, e;
  if ((n.direction || "forward") === "forward") {
    let r = t.transform(e.value, e);
    return r instanceof Promise ? r.then((i) => Fo(e, i, t.out, n)) : Fo(e, r, t.out, n);
  } else {
    let r = t.reverseTransform(e.value, e);
    return r instanceof Promise ? r.then((i) => Fo(e, i, t.in, n)) : Fo(e, r, t.in, n);
  }
}
l(Lo, "handleCodecAResult");
function Fo(e, t, n, o) {
  return e.issues.length ? (e.aborted = !0, e) : n._zod.run({ value: t, issues: e.issues }, o);
}
l(Fo, "handleCodecTxResult");
var Ml = /* @__PURE__ */ h("$ZodReadonly", (e, t) => {
  L.init(e, t), G(e._zod, "propValues", () => t.innerType._zod.propValues), G(e._zod, "values", () => t.innerType._zod.values), G(e._zod, "optin", () => t.innerType?._zod?.optin), G(e._zod, "optout", () => t.innerType?._zod?.optout), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      return t.innerType._zod.run(n, o);
    let r = t.innerType._zod.run(n, o);
    return r instanceof Promise ? r.then(Rm) : Rm(r);
  };
});
function Rm(e) {
  return e.value = Object.freeze(e.value), e;
}
l(Rm, "handleReadonlyResult");
var Zl = /* @__PURE__ */ h("$ZodTemplateLiteral", (e, t) => {
  L.init(e, t);
  let n = [];
  for (let o of t.parts)
    if (typeof o == "object" && o !== null) {
      if (!o._zod.pattern)
        throw new Error(`Invalid template literal part, no pattern found: ${[...o._zod.traits].shift()}`);
      let r = o._zod.pattern instanceof RegExp ? o._zod.pattern.source : o._zod.pattern;
      if (!r)
        throw new Error(`Invalid template literal part: ${o._zod.traits}`);
      let i = r.startsWith("^") ? 1 : 0, a = r.endsWith("$") ? r.length - 1 : r.length;
      n.push(r.slice(i, a));
    } else if (o === null || Aa.has(typeof o))
      n.push(Xe(`${o}`));
    else
      throw new Error(`Invalid template literal part: ${o}`);
  e._zod.pattern = new RegExp(`^${n.join("")}$`), e._zod.parse = (o, r) => typeof o.value != "string" ? (o.issues.push({
    input: o.value,
    inst: e,
    expected: "string",
    code: "invalid_type"
  }), o) : (e._zod.pattern.lastIndex = 0, e._zod.pattern.test(o.value) || o.issues.push({
    input: o.value,
    inst: e,
    code: "invalid_format",
    format: t.format ?? "template_literal",
    pattern: e._zod.pattern.source
  }), o);
}), Ll = /* @__PURE__ */ h("$ZodFunction", (e, t) => (L.init(e, t), e._def = t, e._zod.def = t, e.implement = (n) => {
  if (typeof n != "function")
    throw new Error("implement() must be called with a function");
  return function(...o) {
    let r = e._def.input ? Io(e._def.input, o) : o, i = Reflect.apply(n, this, r);
    return e._def.output ? Io(e._def.output, i) : i;
  };
}, e.implementAsync = (n) => {
  if (typeof n != "function")
    throw new Error("implementAsync() must be called with a function");
  return async function(...o) {
    let r = e._def.input ? await So(e._def.input, o) : o, i = await Reflect.apply(n, this, r);
    return e._def.output ? await So(e._def.output, i) : i;
  };
}, e._zod.parse = (n, o) => typeof n.value != "function" ? (n.issues.push({
  code: "invalid_type",
  expected: "function",
  input: n.value,
  inst: e
}), n) : (e._def.output && e._def.output._zod.def.type === "promise" ? n.value = e.implementAsync(n.value) : n.value = e.implement(n.value), n), e.input = (...n) => {
  let o = e.constructor;
  return Array.isArray(n[0]) ? new o({
    type: "function",
    input: new Bo({
      type: "tuple",
      items: n[0],
      rest: n[1]
    }),
    output: e._def.output
  }) : new o({
    type: "function",
    input: n[0],
    output: e._def.output
  });
}, e.output = (n) => {
  let o = e.constructor;
  return new o({
    type: "function",
    input: e._def.input,
    output: n
  });
}, e)), Fl = /* @__PURE__ */ h("$ZodPromise", (e, t) => {
  L.init(e, t), e._zod.parse = (n, o) => Promise.resolve(n.value).then((r) => t.innerType._zod.run({ value: r, issues: [] }, o));
}), Vl = /* @__PURE__ */ h("$ZodLazy", (e, t) => {
  L.init(e, t), G(e._zod, "innerType", () => t.getter()), G(e._zod, "pattern", () => e._zod.innerType?._zod?.pattern), G(e._zod, "propValues", () => e._zod.innerType?._zod?.propValues), G(e._zod, "optin", () => e._zod.innerType?._zod?.optin ?? void 0), G(e._zod, "optout", () => e._zod.innerType?._zod?.optout ?? void 0), e._zod.parse = (n, o) => e._zod.innerType._zod.run(n, o);
}), ql = /* @__PURE__ */ h("$ZodCustom", (e, t) => {
  ie.init(e, t), L.init(e, t), e._zod.parse = (n, o) => n, e._zod.check = (n) => {
    let o = n.value, r = t.fn(o);
    if (r instanceof Promise)
      return r.then((i) => Cm(i, n, o, e));
    Cm(r, n, o, e);
  };
});
function Cm(e, t, n, o) {
  if (!e) {
    let r = {
      code: "custom",
      input: n,
      inst: o,
      // incorporates params.error into issue reporting
      path: [...o._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !o._zod.def.abort
      // params: inst._zod.def.params,
    };
    o._zod.def.params && (r.params = o._zod.def.params), t.issues.push(_r(r));
  }
}
l(Cm, "handleRefineResult");

// node_modules/zod/v4/locales/index.js
var Un = {};
xt(Un, {
  ar: () => Jl,
  az: () => Bl,
  be: () => Gl,
  bg: () => Wl,
  ca: () => Kl,
  cs: () => Hl,
  da: () => Xl,
  de: () => Yl,
  en: () => An,
  eo: () => Ql,
  es: () => eu,
  fa: () => tu,
  fi: () => ru,
  fr: () => nu,
  frCA: () => ou,
  he: () => iu,
  hu: () => au,
  hy: () => su,
  id: () => lu,
  is: () => uu,
  it: () => cu,
  ja: () => du,
  ka: () => pu,
  kh: () => mu,
  km: () => Rn,
  ko: () => fu,
  lt: () => gu,
  mk: () => hu,
  ms: () => vu,
  nl: () => yu,
  no: () => _u,
  ota: () => bu,
  pl: () => $u,
  ps: () => xu,
  pt: () => wu,
  ru: () => ku,
  sl: () => Iu,
  sv: () => Su,
  ta: () => Tu,
  th: () => zu,
  tr: () => Eu,
  ua: () => Ou,
  uk: () => Dn,
  ur: () => ju,
  uz: () => Pu,
  vi: () => Nu,
  yo: () => Cu,
  zhCN: () => Au,
  zhTW: () => Ru
});

// node_modules/zod/v4/locales/ar.js
var ub = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "\u062D\u0631\u0641", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
    file: { unit: "\u0628\u0627\u064A\u062A", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
    array: { unit: "\u0639\u0646\u0635\u0631", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
    set: { unit: "\u0639\u0646\u0635\u0631", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u0645\u062F\u062E\u0644",
    email: "\u0628\u0631\u064A\u062F \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A",
    url: "\u0631\u0627\u0628\u0637",
    emoji: "\u0625\u064A\u0645\u0648\u062C\u064A",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "\u062A\u0627\u0631\u064A\u062E \u0648\u0648\u0642\u062A \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
    date: "\u062A\u0627\u0631\u064A\u062E \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
    time: "\u0648\u0642\u062A \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
    duration: "\u0645\u062F\u0629 \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
    ipv4: "\u0639\u0646\u0648\u0627\u0646 IPv4",
    ipv6: "\u0639\u0646\u0648\u0627\u0646 IPv6",
    cidrv4: "\u0645\u062F\u0649 \u0639\u0646\u0627\u0648\u064A\u0646 \u0628\u0635\u064A\u063A\u0629 IPv4",
    cidrv6: "\u0645\u062F\u0649 \u0639\u0646\u0627\u0648\u064A\u0646 \u0628\u0635\u064A\u063A\u0629 IPv6",
    base64: "\u0646\u064E\u0635 \u0628\u062A\u0631\u0645\u064A\u0632 base64-encoded",
    base64url: "\u0646\u064E\u0635 \u0628\u062A\u0631\u0645\u064A\u0632 base64url-encoded",
    json_string: "\u0646\u064E\u0635 \u0639\u0644\u0649 \u0647\u064A\u0626\u0629 JSON",
    e164: "\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0628\u0645\u0639\u064A\u0627\u0631 E.164",
    jwt: "JWT",
    template_literal: "\u0645\u062F\u062E\u0644"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 instanceof ${r.expected}\u060C \u0648\u0644\u0643\u0646 \u062A\u0645 \u0625\u062F\u062E\u0627\u0644 ${u}` : `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 ${i}\u060C \u0648\u0644\u0643\u0646 \u062A\u0645 \u0625\u062F\u062E\u0627\u0644 ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 ${w(r.values[0])}` : `\u0627\u062E\u062A\u064A\u0627\u0631 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062A\u0648\u0642\u0639 \u0627\u0646\u062A\u0642\u0627\u0621 \u0623\u062D\u062F \u0647\u0630\u0647 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A: ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? ` \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0623\u0646 \u062A\u0643\u0648\u0646 ${r.origin ?? "\u0627\u0644\u0642\u064A\u0645\u0629"} ${i} ${r.maximum.toString()} ${a.unit ?? "\u0639\u0646\u0635\u0631"}` : `\u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0623\u0646 \u062A\u0643\u0648\u0646 ${r.origin ?? "\u0627\u0644\u0642\u064A\u0645\u0629"} ${i} ${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `\u0623\u0635\u063A\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0644\u0640 ${r.origin} \u0623\u0646 \u064A\u0643\u0648\u0646 ${i} ${r.minimum.toString()} ${a.unit}` : `\u0623\u0635\u063A\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0644\u0640 ${r.origin} \u0623\u0646 \u064A\u0643\u0648\u0646 ${i} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0628\u062F\u0623 \u0628\u0640 "${r.prefix}"` : i.format === "ends_with" ? `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0646\u062A\u0647\u064A \u0628\u0640 "${i.suffix}"` : i.format === "includes" ? `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u062A\u0636\u0645\u0651\u064E\u0646 "${i.includes}"` : i.format === "regex" ? `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0637\u0627\u0628\u0642 \u0627\u0644\u0646\u0645\u0637 ${i.pattern}` : `${n[i.format] ?? r.format} \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644`;
      }
      case "not_multiple_of":
        return `\u0631\u0642\u0645 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0645\u0646 \u0645\u0636\u0627\u0639\u0641\u0627\u062A ${r.divisor}`;
      case "unrecognized_keys":
        return `\u0645\u0639\u0631\u0641${r.keys.length > 1 ? "\u0627\u062A" : ""} \u063A\u0631\u064A\u0628${r.keys.length > 1 ? "\u0629" : ""}: ${_(r.keys, "\u060C ")}`;
      case "invalid_key":
        return `\u0645\u0639\u0631\u0641 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644 \u0641\u064A ${r.origin}`;
      case "invalid_union":
        return "\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644";
      case "invalid_element":
        return `\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644 \u0641\u064A ${r.origin}`;
      default:
        return "\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644";
    }
  };
}, "error");
function Jl() {
  return {
    localeError: ub()
  };
}
l(Jl, "default");

// node_modules/zod/v4/locales/az.js
var cb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "simvol", verb: "olmal\u0131d\u0131r" },
    file: { unit: "bayt", verb: "olmal\u0131d\u0131r" },
    array: { unit: "element", verb: "olmal\u0131d\u0131r" },
    set: { unit: "element", verb: "olmal\u0131d\u0131r" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n instanceof ${r.expected}, daxil olan ${u}` : `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n ${i}, daxil olan ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n ${w(r.values[0])}` : `Yanl\u0131\u015F se\xE7im: a\u015Fa\u011F\u0131dak\u0131lardan biri olmal\u0131d\u0131r: ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `\xC7ox b\xF6y\xFCk: g\xF6zl\u0259nil\u0259n ${r.origin ?? "d\u0259y\u0259r"} ${i}${r.maximum.toString()} ${a.unit ?? "element"}` : `\xC7ox b\xF6y\xFCk: g\xF6zl\u0259nil\u0259n ${r.origin ?? "d\u0259y\u0259r"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `\xC7ox ki\xE7ik: g\xF6zl\u0259nil\u0259n ${r.origin} ${i}${r.minimum.toString()} ${a.unit}` : `\xC7ox ki\xE7ik: g\xF6zl\u0259nil\u0259n ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Yanl\u0131\u015F m\u0259tn: "${i.prefix}" il\u0259 ba\u015Flamal\u0131d\u0131r` : i.format === "ends_with" ? `Yanl\u0131\u015F m\u0259tn: "${i.suffix}" il\u0259 bitm\u0259lidir` : i.format === "includes" ? `Yanl\u0131\u015F m\u0259tn: "${i.includes}" daxil olmal\u0131d\u0131r` : i.format === "regex" ? `Yanl\u0131\u015F m\u0259tn: ${i.pattern} \u015Fablonuna uy\u011Fun olmal\u0131d\u0131r` : `Yanl\u0131\u015F ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Yanl\u0131\u015F \u0259d\u0259d: ${r.divisor} il\u0259 b\xF6l\xFCn\u0259 bil\u0259n olmal\u0131d\u0131r`;
      case "unrecognized_keys":
        return `Tan\u0131nmayan a\xE7ar${r.keys.length > 1 ? "lar" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} daxilind\u0259 yanl\u0131\u015F a\xE7ar`;
      case "invalid_union":
        return "Yanl\u0131\u015F d\u0259y\u0259r";
      case "invalid_element":
        return `${r.origin} daxilind\u0259 yanl\u0131\u015F d\u0259y\u0259r`;
      default:
        return "Yanl\u0131\u015F d\u0259y\u0259r";
    }
  };
}, "error");
function Bl() {
  return {
    localeError: cb()
  };
}
l(Bl, "default");

// node_modules/zod/v4/locales/be.js
function Fm(e, t, n, o) {
  let r = Math.abs(e), i = r % 10, a = r % 100;
  return a >= 11 && a <= 19 ? o : i === 1 ? t : i >= 2 && i <= 4 ? n : o;
}
l(Fm, "getBelarusianPlural");
var db = /* @__PURE__ */ l(() => {
  let e = {
    string: {
      unit: {
        one: "\u0441\u0456\u043C\u0432\u0430\u043B",
        few: "\u0441\u0456\u043C\u0432\u0430\u043B\u044B",
        many: "\u0441\u0456\u043C\u0432\u0430\u043B\u0430\u045E"
      },
      verb: "\u043C\u0435\u0446\u044C"
    },
    array: {
      unit: {
        one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
        few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
        many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u045E"
      },
      verb: "\u043C\u0435\u0446\u044C"
    },
    set: {
      unit: {
        one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
        few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
        many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u045E"
      },
      verb: "\u043C\u0435\u0446\u044C"
    },
    file: {
      unit: {
        one: "\u0431\u0430\u0439\u0442",
        few: "\u0431\u0430\u0439\u0442\u044B",
        many: "\u0431\u0430\u0439\u0442\u0430\u045E"
      },
      verb: "\u043C\u0435\u0446\u044C"
    }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u0443\u0432\u043E\u0434",
    email: "email \u0430\u0434\u0440\u0430\u0441",
    url: "URL",
    emoji: "\u044D\u043C\u043E\u0434\u0437\u0456",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO \u0434\u0430\u0442\u0430 \u0456 \u0447\u0430\u0441",
    date: "ISO \u0434\u0430\u0442\u0430",
    time: "ISO \u0447\u0430\u0441",
    duration: "ISO \u043F\u0440\u0430\u0446\u044F\u0433\u043B\u0430\u0441\u0446\u044C",
    ipv4: "IPv4 \u0430\u0434\u0440\u0430\u0441",
    ipv6: "IPv6 \u0430\u0434\u0440\u0430\u0441",
    cidrv4: "IPv4 \u0434\u044B\u044F\u043F\u0430\u0437\u043E\u043D",
    cidrv6: "IPv6 \u0434\u044B\u044F\u043F\u0430\u0437\u043E\u043D",
    base64: "\u0440\u0430\u0434\u043E\u043A \u0443 \u0444\u0430\u0440\u043C\u0430\u0446\u0435 base64",
    base64url: "\u0440\u0430\u0434\u043E\u043A \u0443 \u0444\u0430\u0440\u043C\u0430\u0446\u0435 base64url",
    json_string: "JSON \u0440\u0430\u0434\u043E\u043A",
    e164: "\u043D\u0443\u043C\u0430\u0440 E.164",
    jwt: "JWT",
    template_literal: "\u0443\u0432\u043E\u0434"
  }, o = {
    nan: "NaN",
    number: "\u043B\u0456\u043A",
    array: "\u043C\u0430\u0441\u0456\u045E"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u045E\u0441\u044F instanceof ${r.expected}, \u0430\u0442\u0440\u044B\u043C\u0430\u043D\u0430 ${u}` : `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u045E\u0441\u044F ${i}, \u0430\u0442\u0440\u044B\u043C\u0430\u043D\u0430 ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F ${w(r.values[0])}` : `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0432\u0430\u0440\u044B\u044F\u043D\u0442: \u0447\u0430\u043A\u0430\u045E\u0441\u044F \u0430\u0434\u0437\u0456\u043D \u0437 ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        if (a) {
          let u = Number(r.maximum), c = Fm(u, a.unit.one, a.unit.few, a.unit.many);
          return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u0432\u044F\u043B\u0456\u043A\u0456: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${r.origin ?? "\u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435"} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 ${a.verb} ${i}${r.maximum.toString()} ${c}`;
        }
        return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u0432\u044F\u043B\u0456\u043A\u0456: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${r.origin ?? "\u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435"} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 \u0431\u044B\u0446\u044C ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        if (a) {
          let u = Number(r.minimum), c = Fm(u, a.unit.one, a.unit.few, a.unit.many);
          return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u043C\u0430\u043B\u044B: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${r.origin} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 ${a.verb} ${i}${r.minimum.toString()} ${c}`;
        }
        return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u043C\u0430\u043B\u044B: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${r.origin} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 \u0431\u044B\u0446\u044C ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u043F\u0430\u0447\u044B\u043D\u0430\u0446\u0446\u0430 \u0437 "${i.prefix}"` : i.format === "ends_with" ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0437\u0430\u043A\u0430\u043D\u0447\u0432\u0430\u0446\u0446\u0430 \u043D\u0430 "${i.suffix}"` : i.format === "includes" ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0437\u043C\u044F\u0448\u0447\u0430\u0446\u044C "${i.includes}"` : i.format === "regex" ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0430\u0434\u043F\u0430\u0432\u044F\u0434\u0430\u0446\u044C \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ${i.pattern}` : `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u043B\u0456\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0431\u044B\u0446\u044C \u043A\u0440\u0430\u0442\u043D\u044B\u043C ${r.divisor}`;
      case "unrecognized_keys":
        return `\u041D\u0435\u0440\u0430\u0441\u043F\u0430\u0437\u043D\u0430\u043D\u044B ${r.keys.length > 1 ? "\u043A\u043B\u044E\u0447\u044B" : "\u043A\u043B\u044E\u0447"}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u043A\u043B\u044E\u0447 \u0443 ${r.origin}`;
      case "invalid_union":
        return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434";
      case "invalid_element":
        return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u0430\u0435 \u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435 \u045E ${r.origin}`;
      default:
        return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434";
    }
  };
}, "error");
function Gl() {
  return {
    localeError: db()
  };
}
l(Gl, "default");

// node_modules/zod/v4/locales/bg.js
var pb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "\u0441\u0438\u043C\u0432\u043E\u043B\u0430", verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430" },
    file: { unit: "\u0431\u0430\u0439\u0442\u0430", verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430" },
    array: { unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430", verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430" },
    set: { unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430", verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u0432\u0445\u043E\u0434",
    email: "\u0438\u043C\u0435\u0439\u043B \u0430\u0434\u0440\u0435\u0441",
    url: "URL",
    emoji: "\u0435\u043C\u043E\u0434\u0436\u0438",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO \u0432\u0440\u0435\u043C\u0435",
    date: "ISO \u0434\u0430\u0442\u0430",
    time: "ISO \u0432\u0440\u0435\u043C\u0435",
    duration: "ISO \u043F\u0440\u043E\u0434\u044A\u043B\u0436\u0438\u0442\u0435\u043B\u043D\u043E\u0441\u0442",
    ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441",
    ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441",
    cidrv4: "IPv4 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
    cidrv6: "IPv6 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
    base64: "base64-\u043A\u043E\u0434\u0438\u0440\u0430\u043D \u043D\u0438\u0437",
    base64url: "base64url-\u043A\u043E\u0434\u0438\u0440\u0430\u043D \u043D\u0438\u0437",
    json_string: "JSON \u043D\u0438\u0437",
    e164: "E.164 \u043D\u043E\u043C\u0435\u0440",
    jwt: "JWT",
    template_literal: "\u0432\u0445\u043E\u0434"
  }, o = {
    nan: "NaN",
    number: "\u0447\u0438\u0441\u043B\u043E",
    array: "\u043C\u0430\u0441\u0438\u0432"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D instanceof ${r.expected}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D ${u}` : `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D ${i}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D ${w(r.values[0])}` : `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430 \u043E\u043F\u0446\u0438\u044F: \u043E\u0447\u0430\u043A\u0432\u0430\u043D\u043E \u0435\u0434\u043D\u043E \u043E\u0442 ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `\u0422\u0432\u044A\u0440\u0434\u0435 \u0433\u043E\u043B\u044F\u043C\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${r.origin ?? "\u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442"} \u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430 ${i}${r.maximum.toString()} ${a.unit ?? "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430"}` : `\u0422\u0432\u044A\u0440\u0434\u0435 \u0433\u043E\u043B\u044F\u043C\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${r.origin ?? "\u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442"} \u0434\u0430 \u0431\u044A\u0434\u0435 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `\u0422\u0432\u044A\u0440\u0434\u0435 \u043C\u0430\u043B\u043A\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${r.origin} \u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430 ${i}${r.minimum.toString()} ${a.unit}` : `\u0422\u0432\u044A\u0440\u0434\u0435 \u043C\u0430\u043B\u043A\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${r.origin} \u0434\u0430 \u0431\u044A\u0434\u0435 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        if (i.format === "starts_with")
          return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0437\u0430\u043F\u043E\u0447\u0432\u0430 \u0441 "${i.prefix}"`;
        if (i.format === "ends_with")
          return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0437\u0430\u0432\u044A\u0440\u0448\u0432\u0430 \u0441 "${i.suffix}"`;
        if (i.format === "includes")
          return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0432\u043A\u043B\u044E\u0447\u0432\u0430 "${i.includes}"`;
        if (i.format === "regex")
          return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0441\u044A\u0432\u043F\u0430\u0434\u0430 \u0441 ${i.pattern}`;
        let a = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D";
        return i.format === "emoji" && (a = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E"), i.format === "datetime" && (a = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E"), i.format === "date" && (a = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430"), i.format === "time" && (a = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E"), i.format === "duration" && (a = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430"), `${a} ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E \u0447\u0438\u0441\u043B\u043E: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0431\u044A\u0434\u0435 \u043A\u0440\u0430\u0442\u043D\u043E \u043D\u0430 ${r.divisor}`;
      case "unrecognized_keys":
        return `\u041D\u0435\u0440\u0430\u0437\u043F\u043E\u0437\u043D\u0430\u0442${r.keys.length > 1 ? "\u0438" : ""} \u043A\u043B\u044E\u0447${r.keys.length > 1 ? "\u043E\u0432\u0435" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043A\u043B\u044E\u0447 \u0432 ${r.origin}`;
      case "invalid_union":
        return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434";
      case "invalid_element":
        return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430 \u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442 \u0432 ${r.origin}`;
      default:
        return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434";
    }
  };
}, "error");
function Wl() {
  return {
    localeError: pb()
  };
}
l(Wl, "default");

// node_modules/zod/v4/locales/ca.js
var mb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "car\xE0cters", verb: "contenir" },
    file: { unit: "bytes", verb: "contenir" },
    array: { unit: "elements", verb: "contenir" },
    set: { unit: "elements", verb: "contenir" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "entrada",
    email: "adre\xE7a electr\xF2nica",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data i hora ISO",
    date: "data ISO",
    time: "hora ISO",
    duration: "durada ISO",
    ipv4: "adre\xE7a IPv4",
    ipv6: "adre\xE7a IPv6",
    cidrv4: "rang IPv4",
    cidrv6: "rang IPv6",
    base64: "cadena codificada en base64",
    base64url: "cadena codificada en base64url",
    json_string: "cadena JSON",
    e164: "n\xFAmero E.164",
    jwt: "JWT",
    template_literal: "entrada"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Tipus inv\xE0lid: s'esperava instanceof ${r.expected}, s'ha rebut ${u}` : `Tipus inv\xE0lid: s'esperava ${i}, s'ha rebut ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Valor inv\xE0lid: s'esperava ${w(r.values[0])}` : `Opci\xF3 inv\xE0lida: s'esperava una de ${_(r.values, " o ")}`;
      case "too_big": {
        let i = r.inclusive ? "com a m\xE0xim" : "menys de", a = t(r.origin);
        return a ? `Massa gran: s'esperava que ${r.origin ?? "el valor"} contingu\xE9s ${i} ${r.maximum.toString()} ${a.unit ?? "elements"}` : `Massa gran: s'esperava que ${r.origin ?? "el valor"} fos ${i} ${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? "com a m\xEDnim" : "m\xE9s de", a = t(r.origin);
        return a ? `Massa petit: s'esperava que ${r.origin} contingu\xE9s ${i} ${r.minimum.toString()} ${a.unit}` : `Massa petit: s'esperava que ${r.origin} fos ${i} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Format inv\xE0lid: ha de comen\xE7ar amb "${i.prefix}"` : i.format === "ends_with" ? `Format inv\xE0lid: ha d'acabar amb "${i.suffix}"` : i.format === "includes" ? `Format inv\xE0lid: ha d'incloure "${i.includes}"` : i.format === "regex" ? `Format inv\xE0lid: ha de coincidir amb el patr\xF3 ${i.pattern}` : `Format inv\xE0lid per a ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `N\xFAmero inv\xE0lid: ha de ser m\xFAltiple de ${r.divisor}`;
      case "unrecognized_keys":
        return `Clau${r.keys.length > 1 ? "s" : ""} no reconeguda${r.keys.length > 1 ? "s" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Clau inv\xE0lida a ${r.origin}`;
      case "invalid_union":
        return "Entrada inv\xE0lida";
      // Could also be "Tipus d'unió invàlid" but "Entrada invàlida" is more general
      case "invalid_element":
        return `Element inv\xE0lid a ${r.origin}`;
      default:
        return "Entrada inv\xE0lida";
    }
  };
}, "error");
function Kl() {
  return {
    localeError: mb()
  };
}
l(Kl, "default");

// node_modules/zod/v4/locales/cs.js
var fb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "znak\u016F", verb: "m\xEDt" },
    file: { unit: "bajt\u016F", verb: "m\xEDt" },
    array: { unit: "prvk\u016F", verb: "m\xEDt" },
    set: { unit: "prvk\u016F", verb: "m\xEDt" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "regul\xE1rn\xED v\xFDraz",
    email: "e-mailov\xE1 adresa",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "datum a \u010Das ve form\xE1tu ISO",
    date: "datum ve form\xE1tu ISO",
    time: "\u010Das ve form\xE1tu ISO",
    duration: "doba trv\xE1n\xED ISO",
    ipv4: "IPv4 adresa",
    ipv6: "IPv6 adresa",
    cidrv4: "rozsah IPv4",
    cidrv6: "rozsah IPv6",
    base64: "\u0159et\u011Bzec zak\xF3dovan\xFD ve form\xE1tu base64",
    base64url: "\u0159et\u011Bzec zak\xF3dovan\xFD ve form\xE1tu base64url",
    json_string: "\u0159et\u011Bzec ve form\xE1tu JSON",
    e164: "\u010D\xEDslo E.164",
    jwt: "JWT",
    template_literal: "vstup"
  }, o = {
    nan: "NaN",
    number: "\u010D\xEDslo",
    string: "\u0159et\u011Bzec",
    function: "funkce",
    array: "pole"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no instanceof ${r.expected}, obdr\u017Eeno ${u}` : `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no ${i}, obdr\u017Eeno ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no ${w(r.values[0])}` : `Neplatn\xE1 mo\u017Enost: o\u010Dek\xE1v\xE1na jedna z hodnot ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Hodnota je p\u0159\xEDli\u0161 velk\xE1: ${r.origin ?? "hodnota"} mus\xED m\xEDt ${i}${r.maximum.toString()} ${a.unit ?? "prvk\u016F"}` : `Hodnota je p\u0159\xEDli\u0161 velk\xE1: ${r.origin ?? "hodnota"} mus\xED b\xFDt ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Hodnota je p\u0159\xEDli\u0161 mal\xE1: ${r.origin ?? "hodnota"} mus\xED m\xEDt ${i}${r.minimum.toString()} ${a.unit ?? "prvk\u016F"}` : `Hodnota je p\u0159\xEDli\u0161 mal\xE1: ${r.origin ?? "hodnota"} mus\xED b\xFDt ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Neplatn\xFD \u0159et\u011Bzec: mus\xED za\u010D\xEDnat na "${i.prefix}"` : i.format === "ends_with" ? `Neplatn\xFD \u0159et\u011Bzec: mus\xED kon\u010Dit na "${i.suffix}"` : i.format === "includes" ? `Neplatn\xFD \u0159et\u011Bzec: mus\xED obsahovat "${i.includes}"` : i.format === "regex" ? `Neplatn\xFD \u0159et\u011Bzec: mus\xED odpov\xEDdat vzoru ${i.pattern}` : `Neplatn\xFD form\xE1t ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Neplatn\xE9 \u010D\xEDslo: mus\xED b\xFDt n\xE1sobkem ${r.divisor}`;
      case "unrecognized_keys":
        return `Nezn\xE1m\xE9 kl\xED\u010De: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Neplatn\xFD kl\xED\u010D v ${r.origin}`;
      case "invalid_union":
        return "Neplatn\xFD vstup";
      case "invalid_element":
        return `Neplatn\xE1 hodnota v ${r.origin}`;
      default:
        return "Neplatn\xFD vstup";
    }
  };
}, "error");
function Hl() {
  return {
    localeError: fb()
  };
}
l(Hl, "default");

// node_modules/zod/v4/locales/da.js
var gb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "tegn", verb: "havde" },
    file: { unit: "bytes", verb: "havde" },
    array: { unit: "elementer", verb: "indeholdt" },
    set: { unit: "elementer", verb: "indeholdt" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "input",
    email: "e-mailadresse",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dato- og klokkesl\xE6t",
    date: "ISO-dato",
    time: "ISO-klokkesl\xE6t",
    duration: "ISO-varighed",
    ipv4: "IPv4-omr\xE5de",
    ipv6: "IPv6-omr\xE5de",
    cidrv4: "IPv4-spektrum",
    cidrv6: "IPv6-spektrum",
    base64: "base64-kodet streng",
    base64url: "base64url-kodet streng",
    json_string: "JSON-streng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "input"
  }, o = {
    nan: "NaN",
    string: "streng",
    number: "tal",
    boolean: "boolean",
    array: "liste",
    object: "objekt",
    set: "s\xE6t",
    file: "fil"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ugyldigt input: forventede instanceof ${r.expected}, fik ${u}` : `Ugyldigt input: forventede ${i}, fik ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ugyldig v\xE6rdi: forventede ${w(r.values[0])}` : `Ugyldigt valg: forventede en af f\xF8lgende ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin), u = o[r.origin] ?? r.origin;
        return a ? `For stor: forventede ${u ?? "value"} ${a.verb} ${i} ${r.maximum.toString()} ${a.unit ?? "elementer"}` : `For stor: forventede ${u ?? "value"} havde ${i} ${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin), u = o[r.origin] ?? r.origin;
        return a ? `For lille: forventede ${u} ${a.verb} ${i} ${r.minimum.toString()} ${a.unit}` : `For lille: forventede ${u} havde ${i} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Ugyldig streng: skal starte med "${i.prefix}"` : i.format === "ends_with" ? `Ugyldig streng: skal ende med "${i.suffix}"` : i.format === "includes" ? `Ugyldig streng: skal indeholde "${i.includes}"` : i.format === "regex" ? `Ugyldig streng: skal matche m\xF8nsteret ${i.pattern}` : `Ugyldig ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ugyldigt tal: skal v\xE6re deleligt med ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Ukendte n\xF8gler" : "Ukendt n\xF8gle"}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig n\xF8gle i ${r.origin}`;
      case "invalid_union":
        return "Ugyldigt input: matcher ingen af de tilladte typer";
      case "invalid_element":
        return `Ugyldig v\xE6rdi i ${r.origin}`;
      default:
        return "Ugyldigt input";
    }
  };
}, "error");
function Xl() {
  return {
    localeError: gb()
  };
}
l(Xl, "default");

// node_modules/zod/v4/locales/de.js
var hb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "Zeichen", verb: "zu haben" },
    file: { unit: "Bytes", verb: "zu haben" },
    array: { unit: "Elemente", verb: "zu haben" },
    set: { unit: "Elemente", verb: "zu haben" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "Eingabe",
    email: "E-Mail-Adresse",
    url: "URL",
    emoji: "Emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-Datum und -Uhrzeit",
    date: "ISO-Datum",
    time: "ISO-Uhrzeit",
    duration: "ISO-Dauer",
    ipv4: "IPv4-Adresse",
    ipv6: "IPv6-Adresse",
    cidrv4: "IPv4-Bereich",
    cidrv6: "IPv6-Bereich",
    base64: "Base64-codierter String",
    base64url: "Base64-URL-codierter String",
    json_string: "JSON-String",
    e164: "E.164-Nummer",
    jwt: "JWT",
    template_literal: "Eingabe"
  }, o = {
    nan: "NaN",
    number: "Zahl",
    array: "Array"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ung\xFCltige Eingabe: erwartet instanceof ${r.expected}, erhalten ${u}` : `Ung\xFCltige Eingabe: erwartet ${i}, erhalten ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ung\xFCltige Eingabe: erwartet ${w(r.values[0])}` : `Ung\xFCltige Option: erwartet eine von ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Zu gro\xDF: erwartet, dass ${r.origin ?? "Wert"} ${i}${r.maximum.toString()} ${a.unit ?? "Elemente"} hat` : `Zu gro\xDF: erwartet, dass ${r.origin ?? "Wert"} ${i}${r.maximum.toString()} ist`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Zu klein: erwartet, dass ${r.origin} ${i}${r.minimum.toString()} ${a.unit} hat` : `Zu klein: erwartet, dass ${r.origin} ${i}${r.minimum.toString()} ist`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Ung\xFCltiger String: muss mit "${i.prefix}" beginnen` : i.format === "ends_with" ? `Ung\xFCltiger String: muss mit "${i.suffix}" enden` : i.format === "includes" ? `Ung\xFCltiger String: muss "${i.includes}" enthalten` : i.format === "regex" ? `Ung\xFCltiger String: muss dem Muster ${i.pattern} entsprechen` : `Ung\xFCltig: ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ung\xFCltige Zahl: muss ein Vielfaches von ${r.divisor} sein`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Unbekannte Schl\xFCssel" : "Unbekannter Schl\xFCssel"}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Ung\xFCltiger Schl\xFCssel in ${r.origin}`;
      case "invalid_union":
        return "Ung\xFCltige Eingabe";
      case "invalid_element":
        return `Ung\xFCltiger Wert in ${r.origin}`;
      default:
        return "Ung\xFCltige Eingabe";
    }
  };
}, "error");
function Yl() {
  return {
    localeError: hb()
  };
}
l(Yl, "default");

// node_modules/zod/v4/locales/en.js
var vb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  }, o = {
    // Compatibility: "nan" -> "NaN" for display
    nan: "NaN"
    // All other type names omitted - they fall back to raw values via ?? operator
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return `Invalid input: expected ${i}, received ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Invalid input: expected ${w(r.values[0])}` : `Invalid option: expected one of ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Too big: expected ${r.origin ?? "value"} to have ${i}${r.maximum.toString()} ${a.unit ?? "elements"}` : `Too big: expected ${r.origin ?? "value"} to be ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Too small: expected ${r.origin} to have ${i}${r.minimum.toString()} ${a.unit}` : `Too small: expected ${r.origin} to be ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Invalid string: must start with "${i.prefix}"` : i.format === "ends_with" ? `Invalid string: must end with "${i.suffix}"` : i.format === "includes" ? `Invalid string: must include "${i.includes}"` : i.format === "regex" ? `Invalid string: must match pattern ${i.pattern}` : `Invalid ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${r.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${r.keys.length > 1 ? "s" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${r.origin}`;
      case "invalid_union":
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${r.origin}`;
      default:
        return "Invalid input";
    }
  };
}, "error");
function An() {
  return {
    localeError: vb()
  };
}
l(An, "default");

// node_modules/zod/v4/locales/eo.js
var yb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "karaktrojn", verb: "havi" },
    file: { unit: "bajtojn", verb: "havi" },
    array: { unit: "elementojn", verb: "havi" },
    set: { unit: "elementojn", verb: "havi" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "enigo",
    email: "retadreso",
    url: "URL",
    emoji: "emo\u011Dio",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-datotempo",
    date: "ISO-dato",
    time: "ISO-tempo",
    duration: "ISO-da\u016Dro",
    ipv4: "IPv4-adreso",
    ipv6: "IPv6-adreso",
    cidrv4: "IPv4-rango",
    cidrv6: "IPv6-rango",
    base64: "64-ume kodita karaktraro",
    base64url: "URL-64-ume kodita karaktraro",
    json_string: "JSON-karaktraro",
    e164: "E.164-nombro",
    jwt: "JWT",
    template_literal: "enigo"
  }, o = {
    nan: "NaN",
    number: "nombro",
    array: "tabelo",
    null: "senvalora"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Nevalida enigo: atendi\u011Dis instanceof ${r.expected}, ricevi\u011Dis ${u}` : `Nevalida enigo: atendi\u011Dis ${i}, ricevi\u011Dis ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Nevalida enigo: atendi\u011Dis ${w(r.values[0])}` : `Nevalida opcio: atendi\u011Dis unu el ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Tro granda: atendi\u011Dis ke ${r.origin ?? "valoro"} havu ${i}${r.maximum.toString()} ${a.unit ?? "elementojn"}` : `Tro granda: atendi\u011Dis ke ${r.origin ?? "valoro"} havu ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Tro malgranda: atendi\u011Dis ke ${r.origin} havu ${i}${r.minimum.toString()} ${a.unit}` : `Tro malgranda: atendi\u011Dis ke ${r.origin} estu ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Nevalida karaktraro: devas komenci\u011Di per "${i.prefix}"` : i.format === "ends_with" ? `Nevalida karaktraro: devas fini\u011Di per "${i.suffix}"` : i.format === "includes" ? `Nevalida karaktraro: devas inkluzivi "${i.includes}"` : i.format === "regex" ? `Nevalida karaktraro: devas kongrui kun la modelo ${i.pattern}` : `Nevalida ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Nevalida nombro: devas esti oblo de ${r.divisor}`;
      case "unrecognized_keys":
        return `Nekonata${r.keys.length > 1 ? "j" : ""} \u015Dlosilo${r.keys.length > 1 ? "j" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Nevalida \u015Dlosilo en ${r.origin}`;
      case "invalid_union":
        return "Nevalida enigo";
      case "invalid_element":
        return `Nevalida valoro en ${r.origin}`;
      default:
        return "Nevalida enigo";
    }
  };
}, "error");
function Ql() {
  return {
    localeError: yb()
  };
}
l(Ql, "default");

// node_modules/zod/v4/locales/es.js
var _b = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "caracteres", verb: "tener" },
    file: { unit: "bytes", verb: "tener" },
    array: { unit: "elementos", verb: "tener" },
    set: { unit: "elementos", verb: "tener" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "entrada",
    email: "direcci\xF3n de correo electr\xF3nico",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "fecha y hora ISO",
    date: "fecha ISO",
    time: "hora ISO",
    duration: "duraci\xF3n ISO",
    ipv4: "direcci\xF3n IPv4",
    ipv6: "direcci\xF3n IPv6",
    cidrv4: "rango IPv4",
    cidrv6: "rango IPv6",
    base64: "cadena codificada en base64",
    base64url: "URL codificada en base64",
    json_string: "cadena JSON",
    e164: "n\xFAmero E.164",
    jwt: "JWT",
    template_literal: "entrada"
  }, o = {
    nan: "NaN",
    string: "texto",
    number: "n\xFAmero",
    boolean: "booleano",
    array: "arreglo",
    object: "objeto",
    set: "conjunto",
    file: "archivo",
    date: "fecha",
    bigint: "n\xFAmero grande",
    symbol: "s\xEDmbolo",
    undefined: "indefinido",
    null: "nulo",
    function: "funci\xF3n",
    map: "mapa",
    record: "registro",
    tuple: "tupla",
    enum: "enumeraci\xF3n",
    union: "uni\xF3n",
    literal: "literal",
    promise: "promesa",
    void: "vac\xEDo",
    never: "nunca",
    unknown: "desconocido",
    any: "cualquiera"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Entrada inv\xE1lida: se esperaba instanceof ${r.expected}, recibido ${u}` : `Entrada inv\xE1lida: se esperaba ${i}, recibido ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Entrada inv\xE1lida: se esperaba ${w(r.values[0])}` : `Opci\xF3n inv\xE1lida: se esperaba una de ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin), u = o[r.origin] ?? r.origin;
        return a ? `Demasiado grande: se esperaba que ${u ?? "valor"} tuviera ${i}${r.maximum.toString()} ${a.unit ?? "elementos"}` : `Demasiado grande: se esperaba que ${u ?? "valor"} fuera ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin), u = o[r.origin] ?? r.origin;
        return a ? `Demasiado peque\xF1o: se esperaba que ${u} tuviera ${i}${r.minimum.toString()} ${a.unit}` : `Demasiado peque\xF1o: se esperaba que ${u} fuera ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Cadena inv\xE1lida: debe comenzar con "${i.prefix}"` : i.format === "ends_with" ? `Cadena inv\xE1lida: debe terminar en "${i.suffix}"` : i.format === "includes" ? `Cadena inv\xE1lida: debe incluir "${i.includes}"` : i.format === "regex" ? `Cadena inv\xE1lida: debe coincidir con el patr\xF3n ${i.pattern}` : `Inv\xE1lido ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `N\xFAmero inv\xE1lido: debe ser m\xFAltiplo de ${r.divisor}`;
      case "unrecognized_keys":
        return `Llave${r.keys.length > 1 ? "s" : ""} desconocida${r.keys.length > 1 ? "s" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Llave inv\xE1lida en ${o[r.origin] ?? r.origin}`;
      case "invalid_union":
        return "Entrada inv\xE1lida";
      case "invalid_element":
        return `Valor inv\xE1lido en ${o[r.origin] ?? r.origin}`;
      default:
        return "Entrada inv\xE1lida";
    }
  };
}, "error");
function eu() {
  return {
    localeError: _b()
  };
}
l(eu, "default");

// node_modules/zod/v4/locales/fa.js
var bb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "\u06A9\u0627\u0631\u0627\u06A9\u062A\u0631", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" },
    file: { unit: "\u0628\u0627\u06CC\u062A", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" },
    array: { unit: "\u0622\u06CC\u062A\u0645", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" },
    set: { unit: "\u0622\u06CC\u062A\u0645", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u0648\u0631\u0648\u062F\u06CC",
    email: "\u0622\u062F\u0631\u0633 \u0627\u06CC\u0645\u06CC\u0644",
    url: "URL",
    emoji: "\u0627\u06CC\u0645\u0648\u062C\u06CC",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "\u062A\u0627\u0631\u06CC\u062E \u0648 \u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
    date: "\u062A\u0627\u0631\u06CC\u062E \u0627\u06CC\u0632\u0648",
    time: "\u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
    duration: "\u0645\u062F\u062A \u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
    ipv4: "IPv4 \u0622\u062F\u0631\u0633",
    ipv6: "IPv6 \u0622\u062F\u0631\u0633",
    cidrv4: "IPv4 \u062F\u0627\u0645\u0646\u0647",
    cidrv6: "IPv6 \u062F\u0627\u0645\u0646\u0647",
    base64: "base64-encoded \u0631\u0634\u062A\u0647",
    base64url: "base64url-encoded \u0631\u0634\u062A\u0647",
    json_string: "JSON \u0631\u0634\u062A\u0647",
    e164: "E.164 \u0639\u062F\u062F",
    jwt: "JWT",
    template_literal: "\u0648\u0631\u0648\u062F\u06CC"
  }, o = {
    nan: "NaN",
    number: "\u0639\u062F\u062F",
    array: "\u0622\u0631\u0627\u06CC\u0647"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A instanceof ${r.expected} \u0645\u06CC\u200C\u0628\u0648\u062F\u060C ${u} \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F` : `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A ${i} \u0645\u06CC\u200C\u0628\u0648\u062F\u060C ${u} \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A ${w(r.values[0])} \u0645\u06CC\u200C\u0628\u0648\u062F` : `\u06AF\u0632\u06CC\u0646\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A \u06CC\u06A9\u06CC \u0627\u0632 ${_(r.values, "|")} \u0645\u06CC\u200C\u0628\u0648\u062F`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `\u062E\u06CC\u0644\u06CC \u0628\u0632\u0631\u06AF: ${r.origin ?? "\u0645\u0642\u062F\u0627\u0631"} \u0628\u0627\u06CC\u062F ${i}${r.maximum.toString()} ${a.unit ?? "\u0639\u0646\u0635\u0631"} \u0628\u0627\u0634\u062F` : `\u062E\u06CC\u0644\u06CC \u0628\u0632\u0631\u06AF: ${r.origin ?? "\u0645\u0642\u062F\u0627\u0631"} \u0628\u0627\u06CC\u062F ${i}${r.maximum.toString()} \u0628\u0627\u0634\u062F`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `\u062E\u06CC\u0644\u06CC \u06A9\u0648\u0686\u06A9: ${r.origin} \u0628\u0627\u06CC\u062F ${i}${r.minimum.toString()} ${a.unit} \u0628\u0627\u0634\u062F` : `\u062E\u06CC\u0644\u06CC \u06A9\u0648\u0686\u06A9: ${r.origin} \u0628\u0627\u06CC\u062F ${i}${r.minimum.toString()} \u0628\u0627\u0634\u062F`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 "${i.prefix}" \u0634\u0631\u0648\u0639 \u0634\u0648\u062F` : i.format === "ends_with" ? `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 "${i.suffix}" \u062A\u0645\u0627\u0645 \u0634\u0648\u062F` : i.format === "includes" ? `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0634\u0627\u0645\u0644 "${i.includes}" \u0628\u0627\u0634\u062F` : i.format === "regex" ? `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 \u0627\u0644\u06AF\u0648\u06CC ${i.pattern} \u0645\u0637\u0627\u0628\u0642\u062A \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F` : `${n[i.format] ?? r.format} \u0646\u0627\u0645\u0639\u062A\u0628\u0631`;
      }
      case "not_multiple_of":
        return `\u0639\u062F\u062F \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0645\u0636\u0631\u0628 ${r.divisor} \u0628\u0627\u0634\u062F`;
      case "unrecognized_keys":
        return `\u06A9\u0644\u06CC\u062F${r.keys.length > 1 ? "\u0647\u0627\u06CC" : ""} \u0646\u0627\u0634\u0646\u0627\u0633: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `\u06A9\u0644\u06CC\u062F \u0646\u0627\u0634\u0646\u0627\u0633 \u062F\u0631 ${r.origin}`;
      case "invalid_union":
        return "\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631";
      case "invalid_element":
        return `\u0645\u0642\u062F\u0627\u0631 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u062F\u0631 ${r.origin}`;
      default:
        return "\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631";
    }
  };
}, "error");
function tu() {
  return {
    localeError: bb()
  };
}
l(tu, "default");

// node_modules/zod/v4/locales/fi.js
var xb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "merkki\xE4", subject: "merkkijonon" },
    file: { unit: "tavua", subject: "tiedoston" },
    array: { unit: "alkiota", subject: "listan" },
    set: { unit: "alkiota", subject: "joukon" },
    number: { unit: "", subject: "luvun" },
    bigint: { unit: "", subject: "suuren kokonaisluvun" },
    int: { unit: "", subject: "kokonaisluvun" },
    date: { unit: "", subject: "p\xE4iv\xE4m\xE4\xE4r\xE4n" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "s\xE4\xE4nn\xF6llinen lauseke",
    email: "s\xE4hk\xF6postiosoite",
    url: "URL-osoite",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-aikaleima",
    date: "ISO-p\xE4iv\xE4m\xE4\xE4r\xE4",
    time: "ISO-aika",
    duration: "ISO-kesto",
    ipv4: "IPv4-osoite",
    ipv6: "IPv6-osoite",
    cidrv4: "IPv4-alue",
    cidrv6: "IPv6-alue",
    base64: "base64-koodattu merkkijono",
    base64url: "base64url-koodattu merkkijono",
    json_string: "JSON-merkkijono",
    e164: "E.164-luku",
    jwt: "JWT",
    template_literal: "templaattimerkkijono"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Virheellinen tyyppi: odotettiin instanceof ${r.expected}, oli ${u}` : `Virheellinen tyyppi: odotettiin ${i}, oli ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Virheellinen sy\xF6te: t\xE4ytyy olla ${w(r.values[0])}` : `Virheellinen valinta: t\xE4ytyy olla yksi seuraavista: ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Liian suuri: ${a.subject} t\xE4ytyy olla ${i}${r.maximum.toString()} ${a.unit}`.trim() : `Liian suuri: arvon t\xE4ytyy olla ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Liian pieni: ${a.subject} t\xE4ytyy olla ${i}${r.minimum.toString()} ${a.unit}`.trim() : `Liian pieni: arvon t\xE4ytyy olla ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Virheellinen sy\xF6te: t\xE4ytyy alkaa "${i.prefix}"` : i.format === "ends_with" ? `Virheellinen sy\xF6te: t\xE4ytyy loppua "${i.suffix}"` : i.format === "includes" ? `Virheellinen sy\xF6te: t\xE4ytyy sis\xE4lt\xE4\xE4 "${i.includes}"` : i.format === "regex" ? `Virheellinen sy\xF6te: t\xE4ytyy vastata s\xE4\xE4nn\xF6llist\xE4 lauseketta ${i.pattern}` : `Virheellinen ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Virheellinen luku: t\xE4ytyy olla luvun ${r.divisor} monikerta`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return "Virheellinen avain tietueessa";
      case "invalid_union":
        return "Virheellinen unioni";
      case "invalid_element":
        return "Virheellinen arvo joukossa";
      default:
        return "Virheellinen sy\xF6te";
    }
  };
}, "error");
function ru() {
  return {
    localeError: xb()
  };
}
l(ru, "default");

// node_modules/zod/v4/locales/fr.js
var $b = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "caract\xE8res", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "\xE9l\xE9ments", verb: "avoir" },
    set: { unit: "\xE9l\xE9ments", verb: "avoir" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "entr\xE9e",
    email: "adresse e-mail",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "date et heure ISO",
    date: "date ISO",
    time: "heure ISO",
    duration: "dur\xE9e ISO",
    ipv4: "adresse IPv4",
    ipv6: "adresse IPv6",
    cidrv4: "plage IPv4",
    cidrv6: "plage IPv6",
    base64: "cha\xEEne encod\xE9e en base64",
    base64url: "cha\xEEne encod\xE9e en base64url",
    json_string: "cha\xEEne JSON",
    e164: "num\xE9ro E.164",
    jwt: "JWT",
    template_literal: "entr\xE9e"
  }, o = {
    nan: "NaN",
    number: "nombre",
    array: "tableau"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Entr\xE9e invalide : instanceof ${r.expected} attendu, ${u} re\xE7u` : `Entr\xE9e invalide : ${i} attendu, ${u} re\xE7u`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Entr\xE9e invalide : ${w(r.values[0])} attendu` : `Option invalide : une valeur parmi ${_(r.values, "|")} attendue`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Trop grand : ${r.origin ?? "valeur"} doit ${a.verb} ${i}${r.maximum.toString()} ${a.unit ?? "\xE9l\xE9ment(s)"}` : `Trop grand : ${r.origin ?? "valeur"} doit \xEAtre ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Trop petit : ${r.origin} doit ${a.verb} ${i}${r.minimum.toString()} ${a.unit}` : `Trop petit : ${r.origin} doit \xEAtre ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Cha\xEEne invalide : doit commencer par "${i.prefix}"` : i.format === "ends_with" ? `Cha\xEEne invalide : doit se terminer par "${i.suffix}"` : i.format === "includes" ? `Cha\xEEne invalide : doit inclure "${i.includes}"` : i.format === "regex" ? `Cha\xEEne invalide : doit correspondre au mod\xE8le ${i.pattern}` : `${n[i.format] ?? r.format} invalide`;
      }
      case "not_multiple_of":
        return `Nombre invalide : doit \xEAtre un multiple de ${r.divisor}`;
      case "unrecognized_keys":
        return `Cl\xE9${r.keys.length > 1 ? "s" : ""} non reconnue${r.keys.length > 1 ? "s" : ""} : ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Cl\xE9 invalide dans ${r.origin}`;
      case "invalid_union":
        return "Entr\xE9e invalide";
      case "invalid_element":
        return `Valeur invalide dans ${r.origin}`;
      default:
        return "Entr\xE9e invalide";
    }
  };
}, "error");
function nu() {
  return {
    localeError: $b()
  };
}
l(nu, "default");

// node_modules/zod/v4/locales/fr-CA.js
var wb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "caract\xE8res", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "\xE9l\xE9ments", verb: "avoir" },
    set: { unit: "\xE9l\xE9ments", verb: "avoir" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "entr\xE9e",
    email: "adresse courriel",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "date-heure ISO",
    date: "date ISO",
    time: "heure ISO",
    duration: "dur\xE9e ISO",
    ipv4: "adresse IPv4",
    ipv6: "adresse IPv6",
    cidrv4: "plage IPv4",
    cidrv6: "plage IPv6",
    base64: "cha\xEEne encod\xE9e en base64",
    base64url: "cha\xEEne encod\xE9e en base64url",
    json_string: "cha\xEEne JSON",
    e164: "num\xE9ro E.164",
    jwt: "JWT",
    template_literal: "entr\xE9e"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Entr\xE9e invalide : attendu instanceof ${r.expected}, re\xE7u ${u}` : `Entr\xE9e invalide : attendu ${i}, re\xE7u ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Entr\xE9e invalide : attendu ${w(r.values[0])}` : `Option invalide : attendu l'une des valeurs suivantes ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "\u2264" : "<", a = t(r.origin);
        return a ? `Trop grand : attendu que ${r.origin ?? "la valeur"} ait ${i}${r.maximum.toString()} ${a.unit}` : `Trop grand : attendu que ${r.origin ?? "la valeur"} soit ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? "\u2265" : ">", a = t(r.origin);
        return a ? `Trop petit : attendu que ${r.origin} ait ${i}${r.minimum.toString()} ${a.unit}` : `Trop petit : attendu que ${r.origin} soit ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Cha\xEEne invalide : doit commencer par "${i.prefix}"` : i.format === "ends_with" ? `Cha\xEEne invalide : doit se terminer par "${i.suffix}"` : i.format === "includes" ? `Cha\xEEne invalide : doit inclure "${i.includes}"` : i.format === "regex" ? `Cha\xEEne invalide : doit correspondre au motif ${i.pattern}` : `${n[i.format] ?? r.format} invalide`;
      }
      case "not_multiple_of":
        return `Nombre invalide : doit \xEAtre un multiple de ${r.divisor}`;
      case "unrecognized_keys":
        return `Cl\xE9${r.keys.length > 1 ? "s" : ""} non reconnue${r.keys.length > 1 ? "s" : ""} : ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Cl\xE9 invalide dans ${r.origin}`;
      case "invalid_union":
        return "Entr\xE9e invalide";
      case "invalid_element":
        return `Valeur invalide dans ${r.origin}`;
      default:
        return "Entr\xE9e invalide";
    }
  };
}, "error");
function ou() {
  return {
    localeError: wb()
  };
}
l(ou, "default");

// node_modules/zod/v4/locales/he.js
var kb = /* @__PURE__ */ l(() => {
  let e = {
    string: { label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA", gender: "f" },
    number: { label: "\u05DE\u05E1\u05E4\u05E8", gender: "m" },
    boolean: { label: "\u05E2\u05E8\u05DA \u05D1\u05D5\u05DC\u05D9\u05D0\u05E0\u05D9", gender: "m" },
    bigint: { label: "BigInt", gender: "m" },
    date: { label: "\u05EA\u05D0\u05E8\u05D9\u05DA", gender: "m" },
    array: { label: "\u05DE\u05E2\u05E8\u05DA", gender: "m" },
    object: { label: "\u05D0\u05D5\u05D1\u05D9\u05D9\u05E7\u05D8", gender: "m" },
    null: { label: "\u05E2\u05E8\u05DA \u05E8\u05D9\u05E7 (null)", gender: "m" },
    undefined: { label: "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05DE\u05D5\u05D2\u05D3\u05E8 (undefined)", gender: "m" },
    symbol: { label: "\u05E1\u05D9\u05DE\u05D1\u05D5\u05DC (Symbol)", gender: "m" },
    function: { label: "\u05E4\u05D5\u05E0\u05E7\u05E6\u05D9\u05D4", gender: "f" },
    map: { label: "\u05DE\u05E4\u05D4 (Map)", gender: "f" },
    set: { label: "\u05E7\u05D1\u05D5\u05E6\u05D4 (Set)", gender: "f" },
    file: { label: "\u05E7\u05D5\u05D1\u05E5", gender: "m" },
    promise: { label: "Promise", gender: "m" },
    NaN: { label: "NaN", gender: "m" },
    unknown: { label: "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05D9\u05D3\u05D5\u05E2", gender: "m" },
    value: { label: "\u05E2\u05E8\u05DA", gender: "m" }
  }, t = {
    string: { unit: "\u05EA\u05D5\u05D5\u05D9\u05DD", shortLabel: "\u05E7\u05E6\u05E8", longLabel: "\u05D0\u05E8\u05D5\u05DA" },
    file: { unit: "\u05D1\u05D9\u05D9\u05D8\u05D9\u05DD", shortLabel: "\u05E7\u05D8\u05DF", longLabel: "\u05D2\u05D3\u05D5\u05DC" },
    array: { unit: "\u05E4\u05E8\u05D9\u05D8\u05D9\u05DD", shortLabel: "\u05E7\u05D8\u05DF", longLabel: "\u05D2\u05D3\u05D5\u05DC" },
    set: { unit: "\u05E4\u05E8\u05D9\u05D8\u05D9\u05DD", shortLabel: "\u05E7\u05D8\u05DF", longLabel: "\u05D2\u05D3\u05D5\u05DC" },
    number: { unit: "", shortLabel: "\u05E7\u05D8\u05DF", longLabel: "\u05D2\u05D3\u05D5\u05DC" }
    // no unit
  }, n = /* @__PURE__ */ l((d) => d ? e[d] : void 0, "typeEntry"), o = /* @__PURE__ */ l((d) => {
    let p = n(d);
    return p ? p.label : d ?? e.unknown.label;
  }, "typeLabel"), r = /* @__PURE__ */ l((d) => `\u05D4${o(d)}`, "withDefinite"), i = /* @__PURE__ */ l((d) => (n(d)?.gender ?? "m") === "f" ? "\u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05D9\u05D5\u05EA" : "\u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA", "verbFor"), a = /* @__PURE__ */ l((d) => d ? t[d] ?? null : null, "getSizing"), u = {
    regex: { label: "\u05E7\u05DC\u05D8", gender: "m" },
    email: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA \u05D0\u05D9\u05DE\u05D9\u05D9\u05DC", gender: "f" },
    url: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA \u05E8\u05E9\u05EA", gender: "f" },
    emoji: { label: "\u05D0\u05D9\u05DE\u05D5\u05D2'\u05D9", gender: "m" },
    uuid: { label: "UUID", gender: "m" },
    nanoid: { label: "nanoid", gender: "m" },
    guid: { label: "GUID", gender: "m" },
    cuid: { label: "cuid", gender: "m" },
    cuid2: { label: "cuid2", gender: "m" },
    ulid: { label: "ULID", gender: "m" },
    xid: { label: "XID", gender: "m" },
    ksuid: { label: "KSUID", gender: "m" },
    datetime: { label: "\u05EA\u05D0\u05E8\u05D9\u05DA \u05D5\u05D6\u05DE\u05DF ISO", gender: "m" },
    date: { label: "\u05EA\u05D0\u05E8\u05D9\u05DA ISO", gender: "m" },
    time: { label: "\u05D6\u05DE\u05DF ISO", gender: "m" },
    duration: { label: "\u05DE\u05E9\u05DA \u05D6\u05DE\u05DF ISO", gender: "m" },
    ipv4: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA IPv4", gender: "f" },
    ipv6: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA IPv6", gender: "f" },
    cidrv4: { label: "\u05D8\u05D5\u05D5\u05D7 IPv4", gender: "m" },
    cidrv6: { label: "\u05D8\u05D5\u05D5\u05D7 IPv6", gender: "m" },
    base64: { label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D1\u05D1\u05E1\u05D9\u05E1 64", gender: "f" },
    base64url: { label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D1\u05D1\u05E1\u05D9\u05E1 64 \u05DC\u05DB\u05EA\u05D5\u05D1\u05D5\u05EA \u05E8\u05E9\u05EA", gender: "f" },
    json_string: { label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA JSON", gender: "f" },
    e164: { label: "\u05DE\u05E1\u05E4\u05E8 E.164", gender: "m" },
    jwt: { label: "JWT", gender: "m" },
    ends_with: { label: "\u05E7\u05DC\u05D8", gender: "m" },
    includes: { label: "\u05E7\u05DC\u05D8", gender: "m" },
    lowercase: { label: "\u05E7\u05DC\u05D8", gender: "m" },
    starts_with: { label: "\u05E7\u05DC\u05D8", gender: "m" },
    uppercase: { label: "\u05E7\u05DC\u05D8", gender: "m" }
  }, c = {
    nan: "NaN"
  };
  return (d) => {
    switch (d.code) {
      case "invalid_type": {
        let p = d.expected, m = c[p ?? ""] ?? o(p), v = I(d.input), g = c[v] ?? e[v]?.label ?? v;
        return /^[A-Z]/.test(d.expected) ? `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA instanceof ${d.expected}, \u05D4\u05EA\u05E7\u05D1\u05DC ${g}` : `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${m}, \u05D4\u05EA\u05E7\u05D1\u05DC ${g}`;
      }
      case "invalid_value": {
        if (d.values.length === 1)
          return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05E2\u05E8\u05DA \u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05D5\u05EA ${w(d.values[0])}`;
        let p = d.values.map((g) => w(g));
        if (d.values.length === 2)
          return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05D4\u05DF ${p[0]} \u05D0\u05D5 ${p[1]}`;
        let m = p[p.length - 1];
        return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05D4\u05DF ${p.slice(0, -1).join(", ")} \u05D0\u05D5 ${m}`;
      }
      case "too_big": {
        let p = a(d.origin), m = r(d.origin ?? "value");
        if (d.origin === "string")
          return `${p?.longLabel ?? "\u05D0\u05E8\u05D5\u05DA"} \u05DE\u05D3\u05D9: ${m} \u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05DB\u05D9\u05DC ${d.maximum.toString()} ${p?.unit ?? ""} ${d.inclusive ? "\u05D0\u05D5 \u05E4\u05D7\u05D5\u05EA" : "\u05DC\u05DB\u05DC \u05D4\u05D9\u05D5\u05EA\u05E8"}`.trim();
        if (d.origin === "number") {
          let b = d.inclusive ? `\u05E7\u05D8\u05DF \u05D0\u05D5 \u05E9\u05D5\u05D5\u05D4 \u05DC-${d.maximum}` : `\u05E7\u05D8\u05DF \u05DE-${d.maximum}`;
          return `\u05D2\u05D3\u05D5\u05DC \u05DE\u05D3\u05D9: ${m} \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${b}`;
        }
        if (d.origin === "array" || d.origin === "set") {
          let b = d.origin === "set" ? "\u05E6\u05E8\u05D9\u05DB\u05D4" : "\u05E6\u05E8\u05D9\u05DA", x = d.inclusive ? `${d.maximum} ${p?.unit ?? ""} \u05D0\u05D5 \u05E4\u05D7\u05D5\u05EA` : `\u05E4\u05D7\u05D5\u05EA \u05DE-${d.maximum} ${p?.unit ?? ""}`;
          return `\u05D2\u05D3\u05D5\u05DC \u05DE\u05D3\u05D9: ${m} ${b} \u05DC\u05D4\u05DB\u05D9\u05DC ${x}`.trim();
        }
        let v = d.inclusive ? "<=" : "<", g = i(d.origin ?? "value");
        return p?.unit ? `${p.longLabel} \u05DE\u05D3\u05D9: ${m} ${g} ${v}${d.maximum.toString()} ${p.unit}` : `${p?.longLabel ?? "\u05D2\u05D3\u05D5\u05DC"} \u05DE\u05D3\u05D9: ${m} ${g} ${v}${d.maximum.toString()}`;
      }
      case "too_small": {
        let p = a(d.origin), m = r(d.origin ?? "value");
        if (d.origin === "string")
          return `${p?.shortLabel ?? "\u05E7\u05E6\u05E8"} \u05DE\u05D3\u05D9: ${m} \u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05DB\u05D9\u05DC ${d.minimum.toString()} ${p?.unit ?? ""} ${d.inclusive ? "\u05D0\u05D5 \u05D9\u05D5\u05EA\u05E8" : "\u05DC\u05E4\u05D7\u05D5\u05EA"}`.trim();
        if (d.origin === "number") {
          let b = d.inclusive ? `\u05D2\u05D3\u05D5\u05DC \u05D0\u05D5 \u05E9\u05D5\u05D5\u05D4 \u05DC-${d.minimum}` : `\u05D2\u05D3\u05D5\u05DC \u05DE-${d.minimum}`;
          return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${m} \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${b}`;
        }
        if (d.origin === "array" || d.origin === "set") {
          let b = d.origin === "set" ? "\u05E6\u05E8\u05D9\u05DB\u05D4" : "\u05E6\u05E8\u05D9\u05DA";
          if (d.minimum === 1 && d.inclusive) {
            let $ = (d.origin === "set", "\u05DC\u05E4\u05D7\u05D5\u05EA \u05E4\u05E8\u05D9\u05D8 \u05D0\u05D7\u05D3");
            return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${m} ${b} \u05DC\u05D4\u05DB\u05D9\u05DC ${$}`;
          }
          let x = d.inclusive ? `${d.minimum} ${p?.unit ?? ""} \u05D0\u05D5 \u05D9\u05D5\u05EA\u05E8` : `\u05D9\u05D5\u05EA\u05E8 \u05DE-${d.minimum} ${p?.unit ?? ""}`;
          return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${m} ${b} \u05DC\u05D4\u05DB\u05D9\u05DC ${x}`.trim();
        }
        let v = d.inclusive ? ">=" : ">", g = i(d.origin ?? "value");
        return p?.unit ? `${p.shortLabel} \u05DE\u05D3\u05D9: ${m} ${g} ${v}${d.minimum.toString()} ${p.unit}` : `${p?.shortLabel ?? "\u05E7\u05D8\u05DF"} \u05DE\u05D3\u05D9: ${m} ${g} ${v}${d.minimum.toString()}`;
      }
      case "invalid_format": {
        let p = d;
        if (p.format === "starts_with")
          return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC \u05D1 "${p.prefix}"`;
        if (p.format === "ends_with")
          return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05E1\u05EA\u05D9\u05D9\u05DD \u05D1 "${p.suffix}"`;
        if (p.format === "includes")
          return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05DB\u05DC\u05D5\u05DC "${p.includes}"`;
        if (p.format === "regex")
          return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05EA\u05D0\u05D9\u05DD \u05DC\u05EA\u05D1\u05E0\u05D9\u05EA ${p.pattern}`;
        let m = u[p.format], v = m?.label ?? p.format, b = (m?.gender ?? "m") === "f" ? "\u05EA\u05E7\u05D9\u05E0\u05D4" : "\u05EA\u05E7\u05D9\u05DF";
        return `${v} \u05DC\u05D0 ${b}`;
      }
      case "not_multiple_of":
        return `\u05DE\u05E1\u05E4\u05E8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05D5\u05EA \u05DE\u05DB\u05E4\u05DC\u05D4 \u05E9\u05DC ${d.divisor}`;
      case "unrecognized_keys":
        return `\u05DE\u05E4\u05EA\u05D7${d.keys.length > 1 ? "\u05D5\u05EA" : ""} \u05DC\u05D0 \u05DE\u05D6\u05D5\u05D4${d.keys.length > 1 ? "\u05D9\u05DD" : "\u05D4"}: ${_(d.keys, ", ")}`;
      case "invalid_key":
        return "\u05E9\u05D3\u05D4 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF \u05D1\u05D0\u05D5\u05D1\u05D9\u05D9\u05E7\u05D8";
      case "invalid_union":
        return "\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF";
      case "invalid_element":
        return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF \u05D1${r(d.origin ?? "array")}`;
      default:
        return "\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF";
    }
  };
}, "error");
function iu() {
  return {
    localeError: kb()
  };
}
l(iu, "default");

// node_modules/zod/v4/locales/hu.js
var Ib = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "karakter", verb: "legyen" },
    file: { unit: "byte", verb: "legyen" },
    array: { unit: "elem", verb: "legyen" },
    set: { unit: "elem", verb: "legyen" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "bemenet",
    email: "email c\xEDm",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO id\u0151b\xE9lyeg",
    date: "ISO d\xE1tum",
    time: "ISO id\u0151",
    duration: "ISO id\u0151intervallum",
    ipv4: "IPv4 c\xEDm",
    ipv6: "IPv6 c\xEDm",
    cidrv4: "IPv4 tartom\xE1ny",
    cidrv6: "IPv6 tartom\xE1ny",
    base64: "base64-k\xF3dolt string",
    base64url: "base64url-k\xF3dolt string",
    json_string: "JSON string",
    e164: "E.164 sz\xE1m",
    jwt: "JWT",
    template_literal: "bemenet"
  }, o = {
    nan: "NaN",
    number: "sz\xE1m",
    array: "t\xF6mb"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k instanceof ${r.expected}, a kapott \xE9rt\xE9k ${u}` : `\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k ${i}, a kapott \xE9rt\xE9k ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k ${w(r.values[0])}` : `\xC9rv\xE9nytelen opci\xF3: valamelyik \xE9rt\xE9k v\xE1rt ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `T\xFAl nagy: ${r.origin ?? "\xE9rt\xE9k"} m\xE9rete t\xFAl nagy ${i}${r.maximum.toString()} ${a.unit ?? "elem"}` : `T\xFAl nagy: a bemeneti \xE9rt\xE9k ${r.origin ?? "\xE9rt\xE9k"} t\xFAl nagy: ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `T\xFAl kicsi: a bemeneti \xE9rt\xE9k ${r.origin} m\xE9rete t\xFAl kicsi ${i}${r.minimum.toString()} ${a.unit}` : `T\xFAl kicsi: a bemeneti \xE9rt\xE9k ${r.origin} t\xFAl kicsi ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\xC9rv\xE9nytelen string: "${i.prefix}" \xE9rt\xE9kkel kell kezd\u0151dnie` : i.format === "ends_with" ? `\xC9rv\xE9nytelen string: "${i.suffix}" \xE9rt\xE9kkel kell v\xE9gz\u0151dnie` : i.format === "includes" ? `\xC9rv\xE9nytelen string: "${i.includes}" \xE9rt\xE9ket kell tartalmaznia` : i.format === "regex" ? `\xC9rv\xE9nytelen string: ${i.pattern} mint\xE1nak kell megfelelnie` : `\xC9rv\xE9nytelen ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\xC9rv\xE9nytelen sz\xE1m: ${r.divisor} t\xF6bbsz\xF6r\xF6s\xE9nek kell lennie`;
      case "unrecognized_keys":
        return `Ismeretlen kulcs${r.keys.length > 1 ? "s" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `\xC9rv\xE9nytelen kulcs ${r.origin}`;
      case "invalid_union":
        return "\xC9rv\xE9nytelen bemenet";
      case "invalid_element":
        return `\xC9rv\xE9nytelen \xE9rt\xE9k: ${r.origin}`;
      default:
        return "\xC9rv\xE9nytelen bemenet";
    }
  };
}, "error");
function au() {
  return {
    localeError: Ib()
  };
}
l(au, "default");

// node_modules/zod/v4/locales/hy.js
function Vm(e, t, n) {
  return Math.abs(e) === 1 ? t : n;
}
l(Vm, "getArmenianPlural");
function Ir(e) {
  if (!e)
    return "";
  let t = ["\u0561", "\u0565", "\u0568", "\u056B", "\u0578", "\u0578\u0582", "\u0585"], n = e[e.length - 1];
  return e + (t.includes(n) ? "\u0576" : "\u0568");
}
l(Ir, "withDefiniteArticle");
var Sb = /* @__PURE__ */ l(() => {
  let e = {
    string: {
      unit: {
        one: "\u0576\u0577\u0561\u0576",
        many: "\u0576\u0577\u0561\u0576\u0576\u0565\u0580"
      },
      verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C"
    },
    file: {
      unit: {
        one: "\u0562\u0561\u0575\u0569",
        many: "\u0562\u0561\u0575\u0569\u0565\u0580"
      },
      verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C"
    },
    array: {
      unit: {
        one: "\u057F\u0561\u0580\u0580",
        many: "\u057F\u0561\u0580\u0580\u0565\u0580"
      },
      verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C"
    },
    set: {
      unit: {
        one: "\u057F\u0561\u0580\u0580",
        many: "\u057F\u0561\u0580\u0580\u0565\u0580"
      },
      verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C"
    }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u0574\u0578\u0582\u057F\u0584",
    email: "\u0567\u056C. \u0570\u0561\u057D\u0581\u0565",
    url: "URL",
    emoji: "\u0567\u0574\u0578\u057B\u056B",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO \u0561\u0574\u057D\u0561\u0569\u056B\u057E \u0587 \u056A\u0561\u0574",
    date: "ISO \u0561\u0574\u057D\u0561\u0569\u056B\u057E",
    time: "ISO \u056A\u0561\u0574",
    duration: "ISO \u057F\u0587\u0578\u0572\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
    ipv4: "IPv4 \u0570\u0561\u057D\u0581\u0565",
    ipv6: "IPv6 \u0570\u0561\u057D\u0581\u0565",
    cidrv4: "IPv4 \u0574\u056B\u057B\u0561\u056F\u0561\u0575\u0584",
    cidrv6: "IPv6 \u0574\u056B\u057B\u0561\u056F\u0561\u0575\u0584",
    base64: "base64 \u0571\u0587\u0561\u0579\u0561\u0583\u0578\u057E \u057F\u0578\u0572",
    base64url: "base64url \u0571\u0587\u0561\u0579\u0561\u0583\u0578\u057E \u057F\u0578\u0572",
    json_string: "JSON \u057F\u0578\u0572",
    e164: "E.164 \u0570\u0561\u0574\u0561\u0580",
    jwt: "JWT",
    template_literal: "\u0574\u0578\u0582\u057F\u0584"
  }, o = {
    nan: "NaN",
    number: "\u0569\u056B\u057E",
    array: "\u0566\u0561\u0576\u0563\u057E\u0561\u056E"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 instanceof ${r.expected}, \u057D\u057F\u0561\u0581\u057E\u0565\u056C \u0567 ${u}` : `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 ${i}, \u057D\u057F\u0561\u0581\u057E\u0565\u056C \u0567 ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 ${w(r.values[1])}` : `\u054D\u056D\u0561\u056C \u057F\u0561\u0580\u0562\u0565\u0580\u0561\u056F\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 \u0570\u0565\u057F\u0587\u0575\u0561\u056C\u0576\u0565\u0580\u056B\u0581 \u0574\u0565\u056F\u0568\u055D ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        if (a) {
          let u = Number(r.maximum), c = Vm(u, a.unit.one, a.unit.many);
          return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0574\u0565\u056E \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${Ir(r.origin ?? "\u0561\u0580\u056A\u0565\u0584")} \u056F\u0578\u0582\u0576\u0565\u0576\u0561 ${i}${r.maximum.toString()} ${c}`;
        }
        return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0574\u0565\u056E \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${Ir(r.origin ?? "\u0561\u0580\u056A\u0565\u0584")} \u056C\u056B\u0576\u056B ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        if (a) {
          let u = Number(r.minimum), c = Vm(u, a.unit.one, a.unit.many);
          return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0583\u0578\u0584\u0580 \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${Ir(r.origin)} \u056F\u0578\u0582\u0576\u0565\u0576\u0561 ${i}${r.minimum.toString()} ${c}`;
        }
        return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0583\u0578\u0584\u0580 \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${Ir(r.origin)} \u056C\u056B\u0576\u056B ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u057D\u056F\u057D\u057E\u056B "${i.prefix}"-\u0578\u057E` : i.format === "ends_with" ? `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0561\u057E\u0561\u0580\u057F\u057E\u056B "${i.suffix}"-\u0578\u057E` : i.format === "includes" ? `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u057A\u0561\u0580\u0578\u0582\u0576\u0561\u056F\u056B "${i.includes}"` : i.format === "regex" ? `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0570\u0561\u0574\u0561\u057A\u0561\u057F\u0561\u057D\u056D\u0561\u0576\u056B ${i.pattern} \u0571\u0587\u0561\u0579\u0561\u0583\u056B\u0576` : `\u054D\u056D\u0561\u056C ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u054D\u056D\u0561\u056C \u0569\u056B\u057E\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0562\u0561\u0566\u0574\u0561\u057A\u0561\u057F\u056B\u056F \u056C\u056B\u0576\u056B ${r.divisor}-\u056B`;
      case "unrecognized_keys":
        return `\u0549\u0573\u0561\u0576\u0561\u0579\u057E\u0561\u056E \u0562\u0561\u0576\u0561\u056C\u056B${r.keys.length > 1 ? "\u0576\u0565\u0580" : ""}. ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `\u054D\u056D\u0561\u056C \u0562\u0561\u0576\u0561\u056C\u056B ${Ir(r.origin)}-\u0578\u0582\u0574`;
      case "invalid_union":
        return "\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574";
      case "invalid_element":
        return `\u054D\u056D\u0561\u056C \u0561\u0580\u056A\u0565\u0584 ${Ir(r.origin)}-\u0578\u0582\u0574`;
      default:
        return "\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574";
    }
  };
}, "error");
function su() {
  return {
    localeError: Sb()
  };
}
l(su, "default");

// node_modules/zod/v4/locales/id.js
var Tb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "karakter", verb: "memiliki" },
    file: { unit: "byte", verb: "memiliki" },
    array: { unit: "item", verb: "memiliki" },
    set: { unit: "item", verb: "memiliki" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "input",
    email: "alamat email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "tanggal dan waktu format ISO",
    date: "tanggal format ISO",
    time: "jam format ISO",
    duration: "durasi format ISO",
    ipv4: "alamat IPv4",
    ipv6: "alamat IPv6",
    cidrv4: "rentang alamat IPv4",
    cidrv6: "rentang alamat IPv6",
    base64: "string dengan enkode base64",
    base64url: "string dengan enkode base64url",
    json_string: "string JSON",
    e164: "angka E.164",
    jwt: "JWT",
    template_literal: "input"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Input tidak valid: diharapkan instanceof ${r.expected}, diterima ${u}` : `Input tidak valid: diharapkan ${i}, diterima ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Input tidak valid: diharapkan ${w(r.values[0])}` : `Pilihan tidak valid: diharapkan salah satu dari ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Terlalu besar: diharapkan ${r.origin ?? "value"} memiliki ${i}${r.maximum.toString()} ${a.unit ?? "elemen"}` : `Terlalu besar: diharapkan ${r.origin ?? "value"} menjadi ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Terlalu kecil: diharapkan ${r.origin} memiliki ${i}${r.minimum.toString()} ${a.unit}` : `Terlalu kecil: diharapkan ${r.origin} menjadi ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `String tidak valid: harus dimulai dengan "${i.prefix}"` : i.format === "ends_with" ? `String tidak valid: harus berakhir dengan "${i.suffix}"` : i.format === "includes" ? `String tidak valid: harus menyertakan "${i.includes}"` : i.format === "regex" ? `String tidak valid: harus sesuai pola ${i.pattern}` : `${n[i.format] ?? r.format} tidak valid`;
      }
      case "not_multiple_of":
        return `Angka tidak valid: harus kelipatan dari ${r.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali ${r.keys.length > 1 ? "s" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Kunci tidak valid di ${r.origin}`;
      case "invalid_union":
        return "Input tidak valid";
      case "invalid_element":
        return `Nilai tidak valid di ${r.origin}`;
      default:
        return "Input tidak valid";
    }
  };
}, "error");
function lu() {
  return {
    localeError: Tb()
  };
}
l(lu, "default");

// node_modules/zod/v4/locales/is.js
var zb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "stafi", verb: "a\xF0 hafa" },
    file: { unit: "b\xE6ti", verb: "a\xF0 hafa" },
    array: { unit: "hluti", verb: "a\xF0 hafa" },
    set: { unit: "hluti", verb: "a\xF0 hafa" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "gildi",
    email: "netfang",
    url: "vefsl\xF3\xF0",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dagsetning og t\xEDmi",
    date: "ISO dagsetning",
    time: "ISO t\xEDmi",
    duration: "ISO t\xEDmalengd",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded strengur",
    base64url: "base64url-encoded strengur",
    json_string: "JSON strengur",
    e164: "E.164 t\xF6lugildi",
    jwt: "JWT",
    template_literal: "gildi"
  }, o = {
    nan: "NaN",
    number: "n\xFAmer",
    array: "fylki"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Rangt gildi: \xDE\xFA sl\xF3st inn ${u} \xFEar sem \xE1 a\xF0 vera instanceof ${r.expected}` : `Rangt gildi: \xDE\xFA sl\xF3st inn ${u} \xFEar sem \xE1 a\xF0 vera ${i}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Rangt gildi: gert r\xE1\xF0 fyrir ${w(r.values[0])}` : `\xD3gilt val: m\xE1 vera eitt af eftirfarandi ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Of st\xF3rt: gert er r\xE1\xF0 fyrir a\xF0 ${r.origin ?? "gildi"} hafi ${i}${r.maximum.toString()} ${a.unit ?? "hluti"}` : `Of st\xF3rt: gert er r\xE1\xF0 fyrir a\xF0 ${r.origin ?? "gildi"} s\xE9 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Of l\xEDti\xF0: gert er r\xE1\xF0 fyrir a\xF0 ${r.origin} hafi ${i}${r.minimum.toString()} ${a.unit}` : `Of l\xEDti\xF0: gert er r\xE1\xF0 fyrir a\xF0 ${r.origin} s\xE9 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\xD3gildur strengur: ver\xF0ur a\xF0 byrja \xE1 "${i.prefix}"` : i.format === "ends_with" ? `\xD3gildur strengur: ver\xF0ur a\xF0 enda \xE1 "${i.suffix}"` : i.format === "includes" ? `\xD3gildur strengur: ver\xF0ur a\xF0 innihalda "${i.includes}"` : i.format === "regex" ? `\xD3gildur strengur: ver\xF0ur a\xF0 fylgja mynstri ${i.pattern}` : `Rangt ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `R\xF6ng tala: ver\xF0ur a\xF0 vera margfeldi af ${r.divisor}`;
      case "unrecognized_keys":
        return `\xD3\xFEekkt ${r.keys.length > 1 ? "ir lyklar" : "ur lykill"}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Rangur lykill \xED ${r.origin}`;
      case "invalid_union":
        return "Rangt gildi";
      case "invalid_element":
        return `Rangt gildi \xED ${r.origin}`;
      default:
        return "Rangt gildi";
    }
  };
}, "error");
function uu() {
  return {
    localeError: zb()
  };
}
l(uu, "default");

// node_modules/zod/v4/locales/it.js
var Eb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "caratteri", verb: "avere" },
    file: { unit: "byte", verb: "avere" },
    array: { unit: "elementi", verb: "avere" },
    set: { unit: "elementi", verb: "avere" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "input",
    email: "indirizzo email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data e ora ISO",
    date: "data ISO",
    time: "ora ISO",
    duration: "durata ISO",
    ipv4: "indirizzo IPv4",
    ipv6: "indirizzo IPv6",
    cidrv4: "intervallo IPv4",
    cidrv6: "intervallo IPv6",
    base64: "stringa codificata in base64",
    base64url: "URL codificata in base64",
    json_string: "stringa JSON",
    e164: "numero E.164",
    jwt: "JWT",
    template_literal: "input"
  }, o = {
    nan: "NaN",
    number: "numero",
    array: "vettore"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Input non valido: atteso instanceof ${r.expected}, ricevuto ${u}` : `Input non valido: atteso ${i}, ricevuto ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Input non valido: atteso ${w(r.values[0])}` : `Opzione non valida: atteso uno tra ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Troppo grande: ${r.origin ?? "valore"} deve avere ${i}${r.maximum.toString()} ${a.unit ?? "elementi"}` : `Troppo grande: ${r.origin ?? "valore"} deve essere ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Troppo piccolo: ${r.origin} deve avere ${i}${r.minimum.toString()} ${a.unit}` : `Troppo piccolo: ${r.origin} deve essere ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Stringa non valida: deve iniziare con "${i.prefix}"` : i.format === "ends_with" ? `Stringa non valida: deve terminare con "${i.suffix}"` : i.format === "includes" ? `Stringa non valida: deve includere "${i.includes}"` : i.format === "regex" ? `Stringa non valida: deve corrispondere al pattern ${i.pattern}` : `Invalid ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Numero non valido: deve essere un multiplo di ${r.divisor}`;
      case "unrecognized_keys":
        return `Chiav${r.keys.length > 1 ? "i" : "e"} non riconosciut${r.keys.length > 1 ? "e" : "a"}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Chiave non valida in ${r.origin}`;
      case "invalid_union":
        return "Input non valido";
      case "invalid_element":
        return `Valore non valido in ${r.origin}`;
      default:
        return "Input non valido";
    }
  };
}, "error");
function cu() {
  return {
    localeError: Eb()
  };
}
l(cu, "default");

// node_modules/zod/v4/locales/ja.js
var Ob = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "\u6587\u5B57", verb: "\u3067\u3042\u308B" },
    file: { unit: "\u30D0\u30A4\u30C8", verb: "\u3067\u3042\u308B" },
    array: { unit: "\u8981\u7D20", verb: "\u3067\u3042\u308B" },
    set: { unit: "\u8981\u7D20", verb: "\u3067\u3042\u308B" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u5165\u529B\u5024",
    email: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
    url: "URL",
    emoji: "\u7D75\u6587\u5B57",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO\u65E5\u6642",
    date: "ISO\u65E5\u4ED8",
    time: "ISO\u6642\u523B",
    duration: "ISO\u671F\u9593",
    ipv4: "IPv4\u30A2\u30C9\u30EC\u30B9",
    ipv6: "IPv6\u30A2\u30C9\u30EC\u30B9",
    cidrv4: "IPv4\u7BC4\u56F2",
    cidrv6: "IPv6\u7BC4\u56F2",
    base64: "base64\u30A8\u30F3\u30B3\u30FC\u30C9\u6587\u5B57\u5217",
    base64url: "base64url\u30A8\u30F3\u30B3\u30FC\u30C9\u6587\u5B57\u5217",
    json_string: "JSON\u6587\u5B57\u5217",
    e164: "E.164\u756A\u53F7",
    jwt: "JWT",
    template_literal: "\u5165\u529B\u5024"
  }, o = {
    nan: "NaN",
    number: "\u6570\u5024",
    array: "\u914D\u5217"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u7121\u52B9\u306A\u5165\u529B: instanceof ${r.expected}\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F\u304C\u3001${u}\u304C\u5165\u529B\u3055\u308C\u307E\u3057\u305F` : `\u7121\u52B9\u306A\u5165\u529B: ${i}\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F\u304C\u3001${u}\u304C\u5165\u529B\u3055\u308C\u307E\u3057\u305F`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u7121\u52B9\u306A\u5165\u529B: ${w(r.values[0])}\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F` : `\u7121\u52B9\u306A\u9078\u629E: ${_(r.values, "\u3001")}\u306E\u3044\u305A\u308C\u304B\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
      case "too_big": {
        let i = r.inclusive ? "\u4EE5\u4E0B\u3067\u3042\u308B" : "\u3088\u308A\u5C0F\u3055\u3044", a = t(r.origin);
        return a ? `\u5927\u304D\u3059\u304E\u308B\u5024: ${r.origin ?? "\u5024"}\u306F${r.maximum.toString()}${a.unit ?? "\u8981\u7D20"}${i}\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059` : `\u5927\u304D\u3059\u304E\u308B\u5024: ${r.origin ?? "\u5024"}\u306F${r.maximum.toString()}${i}\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
      }
      case "too_small": {
        let i = r.inclusive ? "\u4EE5\u4E0A\u3067\u3042\u308B" : "\u3088\u308A\u5927\u304D\u3044", a = t(r.origin);
        return a ? `\u5C0F\u3055\u3059\u304E\u308B\u5024: ${r.origin}\u306F${r.minimum.toString()}${a.unit}${i}\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059` : `\u5C0F\u3055\u3059\u304E\u308B\u5024: ${r.origin}\u306F${r.minimum.toString()}${i}\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u7121\u52B9\u306A\u6587\u5B57\u5217: "${i.prefix}"\u3067\u59CB\u307E\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059` : i.format === "ends_with" ? `\u7121\u52B9\u306A\u6587\u5B57\u5217: "${i.suffix}"\u3067\u7D42\u308F\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059` : i.format === "includes" ? `\u7121\u52B9\u306A\u6587\u5B57\u5217: "${i.includes}"\u3092\u542B\u3080\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059` : i.format === "regex" ? `\u7121\u52B9\u306A\u6587\u5B57\u5217: \u30D1\u30BF\u30FC\u30F3${i.pattern}\u306B\u4E00\u81F4\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059` : `\u7121\u52B9\u306A${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u7121\u52B9\u306A\u6570\u5024: ${r.divisor}\u306E\u500D\u6570\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
      case "unrecognized_keys":
        return `\u8A8D\u8B58\u3055\u308C\u3066\u3044\u306A\u3044\u30AD\u30FC${r.keys.length > 1 ? "\u7FA4" : ""}: ${_(r.keys, "\u3001")}`;
      case "invalid_key":
        return `${r.origin}\u5185\u306E\u7121\u52B9\u306A\u30AD\u30FC`;
      case "invalid_union":
        return "\u7121\u52B9\u306A\u5165\u529B";
      case "invalid_element":
        return `${r.origin}\u5185\u306E\u7121\u52B9\u306A\u5024`;
      default:
        return "\u7121\u52B9\u306A\u5165\u529B";
    }
  };
}, "error");
function du() {
  return {
    localeError: Ob()
  };
}
l(du, "default");

// node_modules/zod/v4/locales/ka.js
var jb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "\u10E1\u10D8\u10DB\u10D1\u10DD\u10DA\u10DD", verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1" },
    file: { unit: "\u10D1\u10D0\u10D8\u10E2\u10D8", verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1" },
    array: { unit: "\u10D4\u10DA\u10D4\u10DB\u10D4\u10DC\u10E2\u10D8", verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1" },
    set: { unit: "\u10D4\u10DA\u10D4\u10DB\u10D4\u10DC\u10E2\u10D8", verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0",
    email: "\u10D4\u10DA-\u10E4\u10DD\u10E1\u10E2\u10D8\u10E1 \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
    url: "URL",
    emoji: "\u10D4\u10DB\u10DD\u10EF\u10D8",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "\u10D7\u10D0\u10E0\u10D8\u10E6\u10D8-\u10D3\u10E0\u10DD",
    date: "\u10D7\u10D0\u10E0\u10D8\u10E6\u10D8",
    time: "\u10D3\u10E0\u10DD",
    duration: "\u10EE\u10D0\u10DC\u10D2\u10E0\u10EB\u10DA\u10D8\u10D5\u10DD\u10D1\u10D0",
    ipv4: "IPv4 \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
    ipv6: "IPv6 \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
    cidrv4: "IPv4 \u10D3\u10D8\u10D0\u10DE\u10D0\u10D6\u10DD\u10DC\u10D8",
    cidrv6: "IPv6 \u10D3\u10D8\u10D0\u10DE\u10D0\u10D6\u10DD\u10DC\u10D8",
    base64: "base64-\u10D9\u10DD\u10D3\u10D8\u10E0\u10D4\u10D1\u10E3\u10DA\u10D8 \u10E1\u10E2\u10E0\u10D8\u10DC\u10D2\u10D8",
    base64url: "base64url-\u10D9\u10DD\u10D3\u10D8\u10E0\u10D4\u10D1\u10E3\u10DA\u10D8 \u10E1\u10E2\u10E0\u10D8\u10DC\u10D2\u10D8",
    json_string: "JSON \u10E1\u10E2\u10E0\u10D8\u10DC\u10D2\u10D8",
    e164: "E.164 \u10DC\u10DD\u10DB\u10D4\u10E0\u10D8",
    jwt: "JWT",
    template_literal: "\u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0"
  }, o = {
    nan: "NaN",
    number: "\u10E0\u10D8\u10EA\u10EE\u10D5\u10D8",
    string: "\u10E1\u10E2\u10E0\u10D8\u10DC\u10D2\u10D8",
    boolean: "\u10D1\u10E3\u10DA\u10D4\u10D0\u10DC\u10D8",
    function: "\u10E4\u10E3\u10DC\u10E5\u10EA\u10D8\u10D0",
    array: "\u10DB\u10D0\u10E1\u10D8\u10D5\u10D8"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 instanceof ${r.expected}, \u10DB\u10D8\u10E6\u10D4\u10D1\u10E3\u10DA\u10D8 ${u}` : `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${i}, \u10DB\u10D8\u10E6\u10D4\u10D1\u10E3\u10DA\u10D8 ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${w(r.values[0])}` : `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D0\u10E0\u10D8\u10D0\u10DC\u10E2\u10D8: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8\u10D0 \u10D4\u10E0\u10D7-\u10D4\u10E0\u10D7\u10D8 ${_(r.values, "|")}-\u10D3\u10D0\u10DC`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10D3\u10D8\u10D3\u10D8: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${r.origin ?? "\u10DB\u10DC\u10D8\u10E8\u10D5\u10DC\u10D4\u10DA\u10DD\u10D1\u10D0"} ${a.verb} ${i}${r.maximum.toString()} ${a.unit}` : `\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10D3\u10D8\u10D3\u10D8: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${r.origin ?? "\u10DB\u10DC\u10D8\u10E8\u10D5\u10DC\u10D4\u10DA\u10DD\u10D1\u10D0"} \u10D8\u10E7\u10DD\u10E1 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10DE\u10D0\u10E2\u10D0\u10E0\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${r.origin} ${a.verb} ${i}${r.minimum.toString()} ${a.unit}` : `\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10DE\u10D0\u10E2\u10D0\u10E0\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${r.origin} \u10D8\u10E7\u10DD\u10E1 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E1\u10E2\u10E0\u10D8\u10DC\u10D2\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10D8\u10EC\u10E7\u10D4\u10D1\u10DD\u10D3\u10D4\u10E1 "${i.prefix}"-\u10D8\u10D7` : i.format === "ends_with" ? `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E1\u10E2\u10E0\u10D8\u10DC\u10D2\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10DB\u10D7\u10D0\u10D5\u10E0\u10D3\u10D4\u10D1\u10DD\u10D3\u10D4\u10E1 "${i.suffix}"-\u10D8\u10D7` : i.format === "includes" ? `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E1\u10E2\u10E0\u10D8\u10DC\u10D2\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1 "${i.includes}"-\u10E1` : i.format === "regex" ? `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E1\u10E2\u10E0\u10D8\u10DC\u10D2\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D4\u10E1\u10D0\u10D1\u10D0\u10DB\u10D4\u10D1\u10DD\u10D3\u10D4\u10E1 \u10E8\u10D0\u10D1\u10DA\u10DD\u10DC\u10E1 ${i.pattern}` : `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E0\u10D8\u10EA\u10EE\u10D5\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10D8\u10E7\u10DD\u10E1 ${r.divisor}-\u10D8\u10E1 \u10EF\u10D4\u10E0\u10D0\u10D3\u10D8`;
      case "unrecognized_keys":
        return `\u10E3\u10EA\u10DC\u10DD\u10D1\u10D8 \u10D2\u10D0\u10E1\u10D0\u10E6\u10D4\u10D1${r.keys.length > 1 ? "\u10D4\u10D1\u10D8" : "\u10D8"}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D2\u10D0\u10E1\u10D0\u10E6\u10D4\u10D1\u10D8 ${r.origin}-\u10E8\u10D8`;
      case "invalid_union":
        return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0";
      case "invalid_element":
        return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10DB\u10DC\u10D8\u10E8\u10D5\u10DC\u10D4\u10DA\u10DD\u10D1\u10D0 ${r.origin}-\u10E8\u10D8`;
      default:
        return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0";
    }
  };
}, "error");
function pu() {
  return {
    localeError: jb()
  };
}
l(pu, "default");

// node_modules/zod/v4/locales/km.js
var Pb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "\u178F\u17BD\u17A2\u1780\u17D2\u179F\u179A", verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793" },
    file: { unit: "\u1794\u17C3", verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793" },
    array: { unit: "\u1792\u17B6\u178F\u17BB", verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793" },
    set: { unit: "\u1792\u17B6\u178F\u17BB", verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B",
    email: "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793\u17A2\u17CA\u17B8\u1798\u17C2\u179B",
    url: "URL",
    emoji: "\u179F\u1789\u17D2\u1789\u17B6\u17A2\u17B6\u179A\u1798\u17D2\u1798\u178E\u17CD",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "\u1780\u17B6\u179B\u1794\u179A\u17B7\u1785\u17D2\u1786\u17C1\u1791 \u1793\u17B7\u1784\u1798\u17C9\u17C4\u1784 ISO",
    date: "\u1780\u17B6\u179B\u1794\u179A\u17B7\u1785\u17D2\u1786\u17C1\u1791 ISO",
    time: "\u1798\u17C9\u17C4\u1784 ISO",
    duration: "\u179A\u1799\u17C8\u1796\u17C1\u179B ISO",
    ipv4: "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv4",
    ipv6: "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv6",
    cidrv4: "\u178A\u17C2\u1793\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv4",
    cidrv6: "\u178A\u17C2\u1793\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv6",
    base64: "\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u17A2\u17CA\u17B7\u1780\u17BC\u178A base64",
    base64url: "\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u17A2\u17CA\u17B7\u1780\u17BC\u178A base64url",
    json_string: "\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A JSON",
    e164: "\u179B\u17C1\u1781 E.164",
    jwt: "JWT",
    template_literal: "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B"
  }, o = {
    nan: "NaN",
    number: "\u179B\u17C1\u1781",
    array: "\u17A2\u17B6\u179A\u17C1 (Array)",
    null: "\u1782\u17D2\u1798\u17B6\u1793\u178F\u1798\u17D2\u179B\u17C3 (null)"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A instanceof ${r.expected} \u1794\u17C9\u17BB\u1793\u17D2\u178F\u17C2\u1791\u1791\u17BD\u179B\u1794\u17B6\u1793 ${u}` : `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${i} \u1794\u17C9\u17BB\u1793\u17D2\u178F\u17C2\u1791\u1791\u17BD\u179B\u1794\u17B6\u1793 ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${w(r.values[0])}` : `\u1787\u1798\u17D2\u179A\u17BE\u179F\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1787\u17B6\u1798\u17BD\u1799\u1780\u17D2\u1793\u17BB\u1784\u1785\u17C6\u178E\u17C4\u1798 ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `\u1792\u17C6\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${r.origin ?? "\u178F\u1798\u17D2\u179B\u17C3"} ${i} ${r.maximum.toString()} ${a.unit ?? "\u1792\u17B6\u178F\u17BB"}` : `\u1792\u17C6\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${r.origin ?? "\u178F\u1798\u17D2\u179B\u17C3"} ${i} ${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `\u178F\u17BC\u1785\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${r.origin} ${i} ${r.minimum.toString()} ${a.unit}` : `\u178F\u17BC\u1785\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${r.origin} ${i} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1785\u17B6\u1794\u17CB\u1795\u17D2\u178F\u17BE\u1798\u178A\u17C4\u1799 "${i.prefix}"` : i.format === "ends_with" ? `\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1794\u1789\u17D2\u1785\u1794\u17CB\u178A\u17C4\u1799 "${i.suffix}"` : i.format === "includes" ? `\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1798\u17B6\u1793 "${i.includes}"` : i.format === "regex" ? `\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u178F\u17C2\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784\u1793\u17B9\u1784\u1791\u1798\u17D2\u179A\u1784\u17CB\u178A\u17C2\u179B\u1794\u17B6\u1793\u1780\u17C6\u178E\u178F\u17CB ${i.pattern}` : `\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u179B\u17C1\u1781\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u178F\u17C2\u1787\u17B6\u1796\u17A0\u17BB\u1782\u17BB\u178E\u1793\u17C3 ${r.divisor}`;
      case "unrecognized_keys":
        return `\u179A\u1780\u1783\u17BE\u1789\u179F\u17C4\u1798\u17B7\u1793\u179F\u17D2\u1782\u17B6\u179B\u17CB\u17D6 ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `\u179F\u17C4\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u1793\u17C5\u1780\u17D2\u1793\u17BB\u1784 ${r.origin}`;
      case "invalid_union":
        return "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C";
      case "invalid_element":
        return `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u1793\u17C5\u1780\u17D2\u1793\u17BB\u1784 ${r.origin}`;
      default:
        return "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C";
    }
  };
}, "error");
function Rn() {
  return {
    localeError: Pb()
  };
}
l(Rn, "default");

// node_modules/zod/v4/locales/kh.js
function mu() {
  return Rn();
}
l(mu, "default");

// node_modules/zod/v4/locales/ko.js
var Nb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "\uBB38\uC790", verb: "to have" },
    file: { unit: "\uBC14\uC774\uD2B8", verb: "to have" },
    array: { unit: "\uAC1C", verb: "to have" },
    set: { unit: "\uAC1C", verb: "to have" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\uC785\uB825",
    email: "\uC774\uBA54\uC77C \uC8FC\uC18C",
    url: "URL",
    emoji: "\uC774\uBAA8\uC9C0",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO \uB0A0\uC9DC\uC2DC\uAC04",
    date: "ISO \uB0A0\uC9DC",
    time: "ISO \uC2DC\uAC04",
    duration: "ISO \uAE30\uAC04",
    ipv4: "IPv4 \uC8FC\uC18C",
    ipv6: "IPv6 \uC8FC\uC18C",
    cidrv4: "IPv4 \uBC94\uC704",
    cidrv6: "IPv6 \uBC94\uC704",
    base64: "base64 \uC778\uCF54\uB529 \uBB38\uC790\uC5F4",
    base64url: "base64url \uC778\uCF54\uB529 \uBB38\uC790\uC5F4",
    json_string: "JSON \uBB38\uC790\uC5F4",
    e164: "E.164 \uBC88\uD638",
    jwt: "JWT",
    template_literal: "\uC785\uB825"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\uC798\uBABB\uB41C \uC785\uB825: \uC608\uC0C1 \uD0C0\uC785\uC740 instanceof ${r.expected}, \uBC1B\uC740 \uD0C0\uC785\uC740 ${u}\uC785\uB2C8\uB2E4` : `\uC798\uBABB\uB41C \uC785\uB825: \uC608\uC0C1 \uD0C0\uC785\uC740 ${i}, \uBC1B\uC740 \uD0C0\uC785\uC740 ${u}\uC785\uB2C8\uB2E4`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\uC798\uBABB\uB41C \uC785\uB825: \uAC12\uC740 ${w(r.values[0])} \uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4` : `\uC798\uBABB\uB41C \uC635\uC158: ${_(r.values, "\uB610\uB294 ")} \uC911 \uD558\uB098\uC5EC\uC57C \uD569\uB2C8\uB2E4`;
      case "too_big": {
        let i = r.inclusive ? "\uC774\uD558" : "\uBBF8\uB9CC", a = i === "\uBBF8\uB9CC" ? "\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4" : "\uC5EC\uC57C \uD569\uB2C8\uB2E4", u = t(r.origin), c = u?.unit ?? "\uC694\uC18C";
        return u ? `${r.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4: ${r.maximum.toString()}${c} ${i}${a}` : `${r.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4: ${r.maximum.toString()} ${i}${a}`;
      }
      case "too_small": {
        let i = r.inclusive ? "\uC774\uC0C1" : "\uCD08\uACFC", a = i === "\uC774\uC0C1" ? "\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4" : "\uC5EC\uC57C \uD569\uB2C8\uB2E4", u = t(r.origin), c = u?.unit ?? "\uC694\uC18C";
        return u ? `${r.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uC791\uC2B5\uB2C8\uB2E4: ${r.minimum.toString()}${c} ${i}${a}` : `${r.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uC791\uC2B5\uB2C8\uB2E4: ${r.minimum.toString()} ${i}${a}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "${i.prefix}"(\uC73C)\uB85C \uC2DC\uC791\uD574\uC57C \uD569\uB2C8\uB2E4` : i.format === "ends_with" ? `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "${i.suffix}"(\uC73C)\uB85C \uB05D\uB098\uC57C \uD569\uB2C8\uB2E4` : i.format === "includes" ? `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "${i.includes}"\uC744(\uB97C) \uD3EC\uD568\uD574\uC57C \uD569\uB2C8\uB2E4` : i.format === "regex" ? `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: \uC815\uADDC\uC2DD ${i.pattern} \uD328\uD134\uACFC \uC77C\uCE58\uD574\uC57C \uD569\uB2C8\uB2E4` : `\uC798\uBABB\uB41C ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\uC798\uBABB\uB41C \uC22B\uC790: ${r.divisor}\uC758 \uBC30\uC218\uC5EC\uC57C \uD569\uB2C8\uB2E4`;
      case "unrecognized_keys":
        return `\uC778\uC2DD\uD560 \uC218 \uC5C6\uB294 \uD0A4: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `\uC798\uBABB\uB41C \uD0A4: ${r.origin}`;
      case "invalid_union":
        return "\uC798\uBABB\uB41C \uC785\uB825";
      case "invalid_element":
        return `\uC798\uBABB\uB41C \uAC12: ${r.origin}`;
      default:
        return "\uC798\uBABB\uB41C \uC785\uB825";
    }
  };
}, "error");
function fu() {
  return {
    localeError: Nb()
  };
}
l(fu, "default");

// node_modules/zod/v4/locales/lt.js
var Cn = /* @__PURE__ */ l((e) => e.charAt(0).toUpperCase() + e.slice(1), "capitalizeFirstCharacter");
function qm(e) {
  let t = Math.abs(e), n = t % 10, o = t % 100;
  return o >= 11 && o <= 19 || n === 0 ? "many" : n === 1 ? "one" : "few";
}
l(qm, "getUnitTypeFromNumber");
var Ab = /* @__PURE__ */ l(() => {
  let e = {
    string: {
      unit: {
        one: "simbolis",
        few: "simboliai",
        many: "simboli\u0173"
      },
      verb: {
        smaller: {
          inclusive: "turi b\u016Bti ne ilgesn\u0117 kaip",
          notInclusive: "turi b\u016Bti trumpesn\u0117 kaip"
        },
        bigger: {
          inclusive: "turi b\u016Bti ne trumpesn\u0117 kaip",
          notInclusive: "turi b\u016Bti ilgesn\u0117 kaip"
        }
      }
    },
    file: {
      unit: {
        one: "baitas",
        few: "baitai",
        many: "bait\u0173"
      },
      verb: {
        smaller: {
          inclusive: "turi b\u016Bti ne didesnis kaip",
          notInclusive: "turi b\u016Bti ma\u017Eesnis kaip"
        },
        bigger: {
          inclusive: "turi b\u016Bti ne ma\u017Eesnis kaip",
          notInclusive: "turi b\u016Bti didesnis kaip"
        }
      }
    },
    array: {
      unit: {
        one: "element\u0105",
        few: "elementus",
        many: "element\u0173"
      },
      verb: {
        smaller: {
          inclusive: "turi tur\u0117ti ne daugiau kaip",
          notInclusive: "turi tur\u0117ti ma\u017Eiau kaip"
        },
        bigger: {
          inclusive: "turi tur\u0117ti ne ma\u017Eiau kaip",
          notInclusive: "turi tur\u0117ti daugiau kaip"
        }
      }
    },
    set: {
      unit: {
        one: "element\u0105",
        few: "elementus",
        many: "element\u0173"
      },
      verb: {
        smaller: {
          inclusive: "turi tur\u0117ti ne daugiau kaip",
          notInclusive: "turi tur\u0117ti ma\u017Eiau kaip"
        },
        bigger: {
          inclusive: "turi tur\u0117ti ne ma\u017Eiau kaip",
          notInclusive: "turi tur\u0117ti daugiau kaip"
        }
      }
    }
  };
  function t(r, i, a, u) {
    let c = e[r] ?? null;
    return c === null ? c : {
      unit: c.unit[i],
      verb: c.verb[u][a ? "inclusive" : "notInclusive"]
    };
  }
  l(t, "getSizing");
  let n = {
    regex: "\u012Fvestis",
    email: "el. pa\u0161to adresas",
    url: "URL",
    emoji: "jaustukas",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO data ir laikas",
    date: "ISO data",
    time: "ISO laikas",
    duration: "ISO trukm\u0117",
    ipv4: "IPv4 adresas",
    ipv6: "IPv6 adresas",
    cidrv4: "IPv4 tinklo prefiksas (CIDR)",
    cidrv6: "IPv6 tinklo prefiksas (CIDR)",
    base64: "base64 u\u017Ekoduota eilut\u0117",
    base64url: "base64url u\u017Ekoduota eilut\u0117",
    json_string: "JSON eilut\u0117",
    e164: "E.164 numeris",
    jwt: "JWT",
    template_literal: "\u012Fvestis"
  }, o = {
    nan: "NaN",
    number: "skai\u010Dius",
    bigint: "sveikasis skai\u010Dius",
    string: "eilut\u0117",
    boolean: "login\u0117 reik\u0161m\u0117",
    undefined: "neapibr\u0117\u017Eta reik\u0161m\u0117",
    function: "funkcija",
    symbol: "simbolis",
    array: "masyvas",
    object: "objektas",
    null: "nulin\u0117 reik\u0161m\u0117"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Gautas tipas ${u}, o tik\u0117tasi - instanceof ${r.expected}` : `Gautas tipas ${u}, o tik\u0117tasi - ${i}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Privalo b\u016Bti ${w(r.values[0])}` : `Privalo b\u016Bti vienas i\u0161 ${_(r.values, "|")} pasirinkim\u0173`;
      case "too_big": {
        let i = o[r.origin] ?? r.origin, a = t(r.origin, qm(Number(r.maximum)), r.inclusive ?? !1, "smaller");
        if (a?.verb)
          return `${Cn(i ?? r.origin ?? "reik\u0161m\u0117")} ${a.verb} ${r.maximum.toString()} ${a.unit ?? "element\u0173"}`;
        let u = r.inclusive ? "ne didesnis kaip" : "ma\u017Eesnis kaip";
        return `${Cn(i ?? r.origin ?? "reik\u0161m\u0117")} turi b\u016Bti ${u} ${r.maximum.toString()} ${a?.unit}`;
      }
      case "too_small": {
        let i = o[r.origin] ?? r.origin, a = t(r.origin, qm(Number(r.minimum)), r.inclusive ?? !1, "bigger");
        if (a?.verb)
          return `${Cn(i ?? r.origin ?? "reik\u0161m\u0117")} ${a.verb} ${r.minimum.toString()} ${a.unit ?? "element\u0173"}`;
        let u = r.inclusive ? "ne ma\u017Eesnis kaip" : "didesnis kaip";
        return `${Cn(i ?? r.origin ?? "reik\u0161m\u0117")} turi b\u016Bti ${u} ${r.minimum.toString()} ${a?.unit}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Eilut\u0117 privalo prasid\u0117ti "${i.prefix}"` : i.format === "ends_with" ? `Eilut\u0117 privalo pasibaigti "${i.suffix}"` : i.format === "includes" ? `Eilut\u0117 privalo \u012Ftraukti "${i.includes}"` : i.format === "regex" ? `Eilut\u0117 privalo atitikti ${i.pattern}` : `Neteisingas ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Skai\u010Dius privalo b\u016Bti ${r.divisor} kartotinis.`;
      case "unrecognized_keys":
        return `Neatpa\u017Eint${r.keys.length > 1 ? "i" : "as"} rakt${r.keys.length > 1 ? "ai" : "as"}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return "Rastas klaidingas raktas";
      case "invalid_union":
        return "Klaidinga \u012Fvestis";
      case "invalid_element": {
        let i = o[r.origin] ?? r.origin;
        return `${Cn(i ?? r.origin ?? "reik\u0161m\u0117")} turi klaiding\u0105 \u012Fvest\u012F`;
      }
      default:
        return "Klaidinga \u012Fvestis";
    }
  };
}, "error");
function gu() {
  return {
    localeError: Ab()
  };
}
l(gu, "default");

// node_modules/zod/v4/locales/mk.js
var Rb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "\u0437\u043D\u0430\u0446\u0438", verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442" },
    file: { unit: "\u0431\u0430\u0458\u0442\u0438", verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442" },
    array: { unit: "\u0441\u0442\u0430\u0432\u043A\u0438", verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442" },
    set: { unit: "\u0441\u0442\u0430\u0432\u043A\u0438", verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u0432\u043D\u0435\u0441",
    email: "\u0430\u0434\u0440\u0435\u0441\u0430 \u043D\u0430 \u0435-\u043F\u043E\u0448\u0442\u0430",
    url: "URL",
    emoji: "\u0435\u043C\u043E\u045F\u0438",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO \u0434\u0430\u0442\u0443\u043C \u0438 \u0432\u0440\u0435\u043C\u0435",
    date: "ISO \u0434\u0430\u0442\u0443\u043C",
    time: "ISO \u0432\u0440\u0435\u043C\u0435",
    duration: "ISO \u0432\u0440\u0435\u043C\u0435\u0442\u0440\u0430\u0435\u045A\u0435",
    ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441\u0430",
    ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441\u0430",
    cidrv4: "IPv4 \u043E\u043F\u0441\u0435\u0433",
    cidrv6: "IPv6 \u043E\u043F\u0441\u0435\u0433",
    base64: "base64-\u0435\u043D\u043A\u043E\u0434\u0438\u0440\u0430\u043D\u0430 \u043D\u0438\u0437\u0430",
    base64url: "base64url-\u0435\u043D\u043A\u043E\u0434\u0438\u0440\u0430\u043D\u0430 \u043D\u0438\u0437\u0430",
    json_string: "JSON \u043D\u0438\u0437\u0430",
    e164: "E.164 \u0431\u0440\u043E\u0458",
    jwt: "JWT",
    template_literal: "\u0432\u043D\u0435\u0441"
  }, o = {
    nan: "NaN",
    number: "\u0431\u0440\u043E\u0458",
    array: "\u043D\u0438\u0437\u0430"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 instanceof ${r.expected}, \u043F\u0440\u0438\u043C\u0435\u043D\u043E ${u}` : `\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${i}, \u043F\u0440\u0438\u043C\u0435\u043D\u043E ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Invalid input: expected ${w(r.values[0])}` : `\u0413\u0440\u0435\u0448\u0430\u043D\u0430 \u043E\u043F\u0446\u0438\u0458\u0430: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 \u0435\u0434\u043D\u0430 ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u0433\u043E\u043B\u0435\u043C: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${r.origin ?? "\u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442\u0430"} \u0434\u0430 \u0438\u043C\u0430 ${i}${r.maximum.toString()} ${a.unit ?? "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0438"}` : `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u0433\u043E\u043B\u0435\u043C: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${r.origin ?? "\u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442\u0430"} \u0434\u0430 \u0431\u0438\u0434\u0435 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u043C\u0430\u043B: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${r.origin} \u0434\u0430 \u0438\u043C\u0430 ${i}${r.minimum.toString()} ${a.unit}` : `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u043C\u0430\u043B: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${r.origin} \u0434\u0430 \u0431\u0438\u0434\u0435 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0437\u0430\u043F\u043E\u0447\u043D\u0443\u0432\u0430 \u0441\u043E "${i.prefix}"` : i.format === "ends_with" ? `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0437\u0430\u0432\u0440\u0448\u0443\u0432\u0430 \u0441\u043E "${i.suffix}"` : i.format === "includes" ? `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0432\u043A\u043B\u0443\u0447\u0443\u0432\u0430 "${i.includes}"` : i.format === "regex" ? `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u043E\u0434\u0433\u043E\u0430\u0440\u0430 \u043D\u0430 \u043F\u0430\u0442\u0435\u0440\u043D\u043E\u0442 ${i.pattern}` : `Invalid ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u0413\u0440\u0435\u0448\u0435\u043D \u0431\u0440\u043E\u0458: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0431\u0438\u0434\u0435 \u0434\u0435\u043B\u0438\u0432 \u0441\u043E ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "\u041D\u0435\u043F\u0440\u0435\u043F\u043E\u0437\u043D\u0430\u0435\u043D\u0438 \u043A\u043B\u0443\u0447\u0435\u0432\u0438" : "\u041D\u0435\u043F\u0440\u0435\u043F\u043E\u0437\u043D\u0430\u0435\u043D \u043A\u043B\u0443\u0447"}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `\u0413\u0440\u0435\u0448\u0435\u043D \u043A\u043B\u0443\u0447 \u0432\u043E ${r.origin}`;
      case "invalid_union":
        return "\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441";
      case "invalid_element":
        return `\u0413\u0440\u0435\u0448\u043D\u0430 \u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442 \u0432\u043E ${r.origin}`;
      default:
        return "\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441";
    }
  };
}, "error");
function hu() {
  return {
    localeError: Rb()
  };
}
l(hu, "default");

// node_modules/zod/v4/locales/ms.js
var Cb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "aksara", verb: "mempunyai" },
    file: { unit: "bait", verb: "mempunyai" },
    array: { unit: "elemen", verb: "mempunyai" },
    set: { unit: "elemen", verb: "mempunyai" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "input",
    email: "alamat e-mel",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "tarikh masa ISO",
    date: "tarikh ISO",
    time: "masa ISO",
    duration: "tempoh ISO",
    ipv4: "alamat IPv4",
    ipv6: "alamat IPv6",
    cidrv4: "julat IPv4",
    cidrv6: "julat IPv6",
    base64: "string dikodkan base64",
    base64url: "string dikodkan base64url",
    json_string: "string JSON",
    e164: "nombor E.164",
    jwt: "JWT",
    template_literal: "input"
  }, o = {
    nan: "NaN",
    number: "nombor"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Input tidak sah: dijangka instanceof ${r.expected}, diterima ${u}` : `Input tidak sah: dijangka ${i}, diterima ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Input tidak sah: dijangka ${w(r.values[0])}` : `Pilihan tidak sah: dijangka salah satu daripada ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Terlalu besar: dijangka ${r.origin ?? "nilai"} ${a.verb} ${i}${r.maximum.toString()} ${a.unit ?? "elemen"}` : `Terlalu besar: dijangka ${r.origin ?? "nilai"} adalah ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Terlalu kecil: dijangka ${r.origin} ${a.verb} ${i}${r.minimum.toString()} ${a.unit}` : `Terlalu kecil: dijangka ${r.origin} adalah ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `String tidak sah: mesti bermula dengan "${i.prefix}"` : i.format === "ends_with" ? `String tidak sah: mesti berakhir dengan "${i.suffix}"` : i.format === "includes" ? `String tidak sah: mesti mengandungi "${i.includes}"` : i.format === "regex" ? `String tidak sah: mesti sepadan dengan corak ${i.pattern}` : `${n[i.format] ?? r.format} tidak sah`;
      }
      case "not_multiple_of":
        return `Nombor tidak sah: perlu gandaan ${r.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Kunci tidak sah dalam ${r.origin}`;
      case "invalid_union":
        return "Input tidak sah";
      case "invalid_element":
        return `Nilai tidak sah dalam ${r.origin}`;
      default:
        return "Input tidak sah";
    }
  };
}, "error");
function vu() {
  return {
    localeError: Cb()
  };
}
l(vu, "default");

// node_modules/zod/v4/locales/nl.js
var Db = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "tekens", verb: "heeft" },
    file: { unit: "bytes", verb: "heeft" },
    array: { unit: "elementen", verb: "heeft" },
    set: { unit: "elementen", verb: "heeft" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "invoer",
    email: "emailadres",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum en tijd",
    date: "ISO datum",
    time: "ISO tijd",
    duration: "ISO duur",
    ipv4: "IPv4-adres",
    ipv6: "IPv6-adres",
    cidrv4: "IPv4-bereik",
    cidrv6: "IPv6-bereik",
    base64: "base64-gecodeerde tekst",
    base64url: "base64 URL-gecodeerde tekst",
    json_string: "JSON string",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "invoer"
  }, o = {
    nan: "NaN",
    number: "getal"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ongeldige invoer: verwacht instanceof ${r.expected}, ontving ${u}` : `Ongeldige invoer: verwacht ${i}, ontving ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ongeldige invoer: verwacht ${w(r.values[0])}` : `Ongeldige optie: verwacht \xE9\xE9n van ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin), u = r.origin === "date" ? "laat" : r.origin === "string" ? "lang" : "groot";
        return a ? `Te ${u}: verwacht dat ${r.origin ?? "waarde"} ${i}${r.maximum.toString()} ${a.unit ?? "elementen"} ${a.verb}` : `Te ${u}: verwacht dat ${r.origin ?? "waarde"} ${i}${r.maximum.toString()} is`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin), u = r.origin === "date" ? "vroeg" : r.origin === "string" ? "kort" : "klein";
        return a ? `Te ${u}: verwacht dat ${r.origin} ${i}${r.minimum.toString()} ${a.unit} ${a.verb}` : `Te ${u}: verwacht dat ${r.origin} ${i}${r.minimum.toString()} is`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Ongeldige tekst: moet met "${i.prefix}" beginnen` : i.format === "ends_with" ? `Ongeldige tekst: moet op "${i.suffix}" eindigen` : i.format === "includes" ? `Ongeldige tekst: moet "${i.includes}" bevatten` : i.format === "regex" ? `Ongeldige tekst: moet overeenkomen met patroon ${i.pattern}` : `Ongeldig: ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ongeldig getal: moet een veelvoud van ${r.divisor} zijn`;
      case "unrecognized_keys":
        return `Onbekende key${r.keys.length > 1 ? "s" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Ongeldige key in ${r.origin}`;
      case "invalid_union":
        return "Ongeldige invoer";
      case "invalid_element":
        return `Ongeldige waarde in ${r.origin}`;
      default:
        return "Ongeldige invoer";
    }
  };
}, "error");
function yu() {
  return {
    localeError: Db()
  };
}
l(yu, "default");

// node_modules/zod/v4/locales/no.js
var Ub = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "tegn", verb: "\xE5 ha" },
    file: { unit: "bytes", verb: "\xE5 ha" },
    array: { unit: "elementer", verb: "\xE5 inneholde" },
    set: { unit: "elementer", verb: "\xE5 inneholde" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "input",
    email: "e-postadresse",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dato- og klokkeslett",
    date: "ISO-dato",
    time: "ISO-klokkeslett",
    duration: "ISO-varighet",
    ipv4: "IPv4-omr\xE5de",
    ipv6: "IPv6-omr\xE5de",
    cidrv4: "IPv4-spekter",
    cidrv6: "IPv6-spekter",
    base64: "base64-enkodet streng",
    base64url: "base64url-enkodet streng",
    json_string: "JSON-streng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "input"
  }, o = {
    nan: "NaN",
    number: "tall",
    array: "liste"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ugyldig input: forventet instanceof ${r.expected}, fikk ${u}` : `Ugyldig input: forventet ${i}, fikk ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ugyldig verdi: forventet ${w(r.values[0])}` : `Ugyldig valg: forventet en av ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `For stor(t): forventet ${r.origin ?? "value"} til \xE5 ha ${i}${r.maximum.toString()} ${a.unit ?? "elementer"}` : `For stor(t): forventet ${r.origin ?? "value"} til \xE5 ha ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `For lite(n): forventet ${r.origin} til \xE5 ha ${i}${r.minimum.toString()} ${a.unit}` : `For lite(n): forventet ${r.origin} til \xE5 ha ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Ugyldig streng: m\xE5 starte med "${i.prefix}"` : i.format === "ends_with" ? `Ugyldig streng: m\xE5 ende med "${i.suffix}"` : i.format === "includes" ? `Ugyldig streng: m\xE5 inneholde "${i.includes}"` : i.format === "regex" ? `Ugyldig streng: m\xE5 matche m\xF8nsteret ${i.pattern}` : `Ugyldig ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ugyldig tall: m\xE5 v\xE6re et multiplum av ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Ukjente n\xF8kler" : "Ukjent n\xF8kkel"}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig n\xF8kkel i ${r.origin}`;
      case "invalid_union":
        return "Ugyldig input";
      case "invalid_element":
        return `Ugyldig verdi i ${r.origin}`;
      default:
        return "Ugyldig input";
    }
  };
}, "error");
function _u() {
  return {
    localeError: Ub()
  };
}
l(_u, "default");

// node_modules/zod/v4/locales/ota.js
var Mb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "harf", verb: "olmal\u0131d\u0131r" },
    file: { unit: "bayt", verb: "olmal\u0131d\u0131r" },
    array: { unit: "unsur", verb: "olmal\u0131d\u0131r" },
    set: { unit: "unsur", verb: "olmal\u0131d\u0131r" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "giren",
    email: "epostag\xE2h",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO heng\xE2m\u0131",
    date: "ISO tarihi",
    time: "ISO zaman\u0131",
    duration: "ISO m\xFCddeti",
    ipv4: "IPv4 ni\u015F\xE2n\u0131",
    ipv6: "IPv6 ni\u015F\xE2n\u0131",
    cidrv4: "IPv4 menzili",
    cidrv6: "IPv6 menzili",
    base64: "base64-\u015Fifreli metin",
    base64url: "base64url-\u015Fifreli metin",
    json_string: "JSON metin",
    e164: "E.164 say\u0131s\u0131",
    jwt: "JWT",
    template_literal: "giren"
  }, o = {
    nan: "NaN",
    number: "numara",
    array: "saf",
    null: "gayb"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `F\xE2sit giren: umulan instanceof ${r.expected}, al\u0131nan ${u}` : `F\xE2sit giren: umulan ${i}, al\u0131nan ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `F\xE2sit giren: umulan ${w(r.values[0])}` : `F\xE2sit tercih: m\xFBteberler ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Fazla b\xFCy\xFCk: ${r.origin ?? "value"}, ${i}${r.maximum.toString()} ${a.unit ?? "elements"} sahip olmal\u0131yd\u0131.` : `Fazla b\xFCy\xFCk: ${r.origin ?? "value"}, ${i}${r.maximum.toString()} olmal\u0131yd\u0131.`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Fazla k\xFC\xE7\xFCk: ${r.origin}, ${i}${r.minimum.toString()} ${a.unit} sahip olmal\u0131yd\u0131.` : `Fazla k\xFC\xE7\xFCk: ${r.origin}, ${i}${r.minimum.toString()} olmal\u0131yd\u0131.`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `F\xE2sit metin: "${i.prefix}" ile ba\u015Flamal\u0131.` : i.format === "ends_with" ? `F\xE2sit metin: "${i.suffix}" ile bitmeli.` : i.format === "includes" ? `F\xE2sit metin: "${i.includes}" ihtiv\xE2 etmeli.` : i.format === "regex" ? `F\xE2sit metin: ${i.pattern} nak\u015F\u0131na uymal\u0131.` : `F\xE2sit ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `F\xE2sit say\u0131: ${r.divisor} kat\u0131 olmal\u0131yd\u0131.`;
      case "unrecognized_keys":
        return `Tan\u0131nmayan anahtar ${r.keys.length > 1 ? "s" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} i\xE7in tan\u0131nmayan anahtar var.`;
      case "invalid_union":
        return "Giren tan\u0131namad\u0131.";
      case "invalid_element":
        return `${r.origin} i\xE7in tan\u0131nmayan k\u0131ymet var.`;
      default:
        return "K\u0131ymet tan\u0131namad\u0131.";
    }
  };
}, "error");
function bu() {
  return {
    localeError: Mb()
  };
}
l(bu, "default");

// node_modules/zod/v4/locales/ps.js
var Zb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" },
    file: { unit: "\u0628\u0627\u06CC\u067C\u0633", verb: "\u0648\u0644\u0631\u064A" },
    array: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" },
    set: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u0648\u0631\u0648\u062F\u064A",
    email: "\u0628\u0631\u06CC\u069A\u0646\u0627\u0644\u06CC\u06A9",
    url: "\u06CC\u0648 \u0622\u0631 \u0627\u0644",
    emoji: "\u0627\u06CC\u0645\u0648\u062C\u064A",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "\u0646\u06CC\u067C\u0647 \u0627\u0648 \u0648\u062E\u062A",
    date: "\u0646\u06D0\u067C\u0647",
    time: "\u0648\u062E\u062A",
    duration: "\u0645\u0648\u062F\u0647",
    ipv4: "\u062F IPv4 \u067E\u062A\u0647",
    ipv6: "\u062F IPv6 \u067E\u062A\u0647",
    cidrv4: "\u062F IPv4 \u0633\u0627\u062D\u0647",
    cidrv6: "\u062F IPv6 \u0633\u0627\u062D\u0647",
    base64: "base64-encoded \u0645\u062A\u0646",
    base64url: "base64url-encoded \u0645\u062A\u0646",
    json_string: "JSON \u0645\u062A\u0646",
    e164: "\u062F E.164 \u0634\u0645\u06D0\u0631\u0647",
    jwt: "JWT",
    template_literal: "\u0648\u0631\u0648\u062F\u064A"
  }, o = {
    nan: "NaN",
    number: "\u0639\u062F\u062F",
    array: "\u0627\u0631\u06D0"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F instanceof ${r.expected} \u0648\u0627\u06CC, \u0645\u06AB\u0631 ${u} \u062A\u0631\u0644\u0627\u0633\u0647 \u0634\u0648` : `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F ${i} \u0648\u0627\u06CC, \u0645\u06AB\u0631 ${u} \u062A\u0631\u0644\u0627\u0633\u0647 \u0634\u0648`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F ${w(r.values[0])} \u0648\u0627\u06CC` : `\u0646\u0627\u0633\u0645 \u0627\u0646\u062A\u062E\u0627\u0628: \u0628\u0627\u06CC\u062F \u06CC\u0648 \u0644\u0647 ${_(r.values, "|")} \u0685\u062E\u0647 \u0648\u0627\u06CC`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `\u0689\u06CC\u0631 \u0644\u0648\u06CC: ${r.origin ?? "\u0627\u0631\u0632\u069A\u062A"} \u0628\u0627\u06CC\u062F ${i}${r.maximum.toString()} ${a.unit ?? "\u0639\u0646\u0635\u0631\u0648\u0646\u0647"} \u0648\u0644\u0631\u064A` : `\u0689\u06CC\u0631 \u0644\u0648\u06CC: ${r.origin ?? "\u0627\u0631\u0632\u069A\u062A"} \u0628\u0627\u06CC\u062F ${i}${r.maximum.toString()} \u0648\u064A`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `\u0689\u06CC\u0631 \u06A9\u0648\u0686\u0646\u06CC: ${r.origin} \u0628\u0627\u06CC\u062F ${i}${r.minimum.toString()} ${a.unit} \u0648\u0644\u0631\u064A` : `\u0689\u06CC\u0631 \u06A9\u0648\u0686\u0646\u06CC: ${r.origin} \u0628\u0627\u06CC\u062F ${i}${r.minimum.toString()} \u0648\u064A`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F "${i.prefix}" \u0633\u0631\u0647 \u067E\u06CC\u0644 \u0634\u064A` : i.format === "ends_with" ? `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F "${i.suffix}" \u0633\u0631\u0647 \u067E\u0627\u06CC \u062A\u0647 \u0648\u0631\u0633\u064A\u0696\u064A` : i.format === "includes" ? `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F "${i.includes}" \u0648\u0644\u0631\u064A` : i.format === "regex" ? `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F ${i.pattern} \u0633\u0631\u0647 \u0645\u0637\u0627\u0628\u0642\u062A \u0648\u0644\u0631\u064A` : `${n[i.format] ?? r.format} \u0646\u0627\u0633\u0645 \u062F\u06CC`;
      }
      case "not_multiple_of":
        return `\u0646\u0627\u0633\u0645 \u0639\u062F\u062F: \u0628\u0627\u06CC\u062F \u062F ${r.divisor} \u0645\u0636\u0631\u0628 \u0648\u064A`;
      case "unrecognized_keys":
        return `\u0646\u0627\u0633\u0645 ${r.keys.length > 1 ? "\u06A9\u0644\u06CC\u0689\u0648\u0646\u0647" : "\u06A9\u0644\u06CC\u0689"}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `\u0646\u0627\u0633\u0645 \u06A9\u0644\u06CC\u0689 \u067E\u0647 ${r.origin} \u06A9\u06D0`;
      case "invalid_union":
        return "\u0646\u0627\u0633\u0645\u0647 \u0648\u0631\u0648\u062F\u064A";
      case "invalid_element":
        return `\u0646\u0627\u0633\u0645 \u0639\u0646\u0635\u0631 \u067E\u0647 ${r.origin} \u06A9\u06D0`;
      default:
        return "\u0646\u0627\u0633\u0645\u0647 \u0648\u0631\u0648\u062F\u064A";
    }
  };
}, "error");
function xu() {
  return {
    localeError: Zb()
  };
}
l(xu, "default");

// node_modules/zod/v4/locales/pl.js
var Lb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "znak\xF3w", verb: "mie\u0107" },
    file: { unit: "bajt\xF3w", verb: "mie\u0107" },
    array: { unit: "element\xF3w", verb: "mie\u0107" },
    set: { unit: "element\xF3w", verb: "mie\u0107" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "wyra\u017Cenie",
    email: "adres email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data i godzina w formacie ISO",
    date: "data w formacie ISO",
    time: "godzina w formacie ISO",
    duration: "czas trwania ISO",
    ipv4: "adres IPv4",
    ipv6: "adres IPv6",
    cidrv4: "zakres IPv4",
    cidrv6: "zakres IPv6",
    base64: "ci\u0105g znak\xF3w zakodowany w formacie base64",
    base64url: "ci\u0105g znak\xF3w zakodowany w formacie base64url",
    json_string: "ci\u0105g znak\xF3w w formacie JSON",
    e164: "liczba E.164",
    jwt: "JWT",
    template_literal: "wej\u015Bcie"
  }, o = {
    nan: "NaN",
    number: "liczba",
    array: "tablica"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano instanceof ${r.expected}, otrzymano ${u}` : `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano ${i}, otrzymano ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano ${w(r.values[0])}` : `Nieprawid\u0142owa opcja: oczekiwano jednej z warto\u015Bci ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Za du\u017Ca warto\u015B\u0107: oczekiwano, \u017Ce ${r.origin ?? "warto\u015B\u0107"} b\u0119dzie mie\u0107 ${i}${r.maximum.toString()} ${a.unit ?? "element\xF3w"}` : `Zbyt du\u017C(y/a/e): oczekiwano, \u017Ce ${r.origin ?? "warto\u015B\u0107"} b\u0119dzie wynosi\u0107 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Za ma\u0142a warto\u015B\u0107: oczekiwano, \u017Ce ${r.origin ?? "warto\u015B\u0107"} b\u0119dzie mie\u0107 ${i}${r.minimum.toString()} ${a.unit ?? "element\xF3w"}` : `Zbyt ma\u0142(y/a/e): oczekiwano, \u017Ce ${r.origin ?? "warto\u015B\u0107"} b\u0119dzie wynosi\u0107 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi zaczyna\u0107 si\u0119 od "${i.prefix}"` : i.format === "ends_with" ? `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi ko\u0144czy\u0107 si\u0119 na "${i.suffix}"` : i.format === "includes" ? `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi zawiera\u0107 "${i.includes}"` : i.format === "regex" ? `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi odpowiada\u0107 wzorcowi ${i.pattern}` : `Nieprawid\u0142ow(y/a/e) ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Nieprawid\u0142owa liczba: musi by\u0107 wielokrotno\u015Bci\u0105 ${r.divisor}`;
      case "unrecognized_keys":
        return `Nierozpoznane klucze${r.keys.length > 1 ? "s" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Nieprawid\u0142owy klucz w ${r.origin}`;
      case "invalid_union":
        return "Nieprawid\u0142owe dane wej\u015Bciowe";
      case "invalid_element":
        return `Nieprawid\u0142owa warto\u015B\u0107 w ${r.origin}`;
      default:
        return "Nieprawid\u0142owe dane wej\u015Bciowe";
    }
  };
}, "error");
function $u() {
  return {
    localeError: Lb()
  };
}
l($u, "default");

// node_modules/zod/v4/locales/pt.js
var Fb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "caracteres", verb: "ter" },
    file: { unit: "bytes", verb: "ter" },
    array: { unit: "itens", verb: "ter" },
    set: { unit: "itens", verb: "ter" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "padr\xE3o",
    email: "endere\xE7o de e-mail",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data e hora ISO",
    date: "data ISO",
    time: "hora ISO",
    duration: "dura\xE7\xE3o ISO",
    ipv4: "endere\xE7o IPv4",
    ipv6: "endere\xE7o IPv6",
    cidrv4: "faixa de IPv4",
    cidrv6: "faixa de IPv6",
    base64: "texto codificado em base64",
    base64url: "URL codificada em base64",
    json_string: "texto JSON",
    e164: "n\xFAmero E.164",
    jwt: "JWT",
    template_literal: "entrada"
  }, o = {
    nan: "NaN",
    number: "n\xFAmero",
    null: "nulo"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Tipo inv\xE1lido: esperado instanceof ${r.expected}, recebido ${u}` : `Tipo inv\xE1lido: esperado ${i}, recebido ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Entrada inv\xE1lida: esperado ${w(r.values[0])}` : `Op\xE7\xE3o inv\xE1lida: esperada uma das ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Muito grande: esperado que ${r.origin ?? "valor"} tivesse ${i}${r.maximum.toString()} ${a.unit ?? "elementos"}` : `Muito grande: esperado que ${r.origin ?? "valor"} fosse ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Muito pequeno: esperado que ${r.origin} tivesse ${i}${r.minimum.toString()} ${a.unit}` : `Muito pequeno: esperado que ${r.origin} fosse ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Texto inv\xE1lido: deve come\xE7ar com "${i.prefix}"` : i.format === "ends_with" ? `Texto inv\xE1lido: deve terminar com "${i.suffix}"` : i.format === "includes" ? `Texto inv\xE1lido: deve incluir "${i.includes}"` : i.format === "regex" ? `Texto inv\xE1lido: deve corresponder ao padr\xE3o ${i.pattern}` : `${n[i.format] ?? r.format} inv\xE1lido`;
      }
      case "not_multiple_of":
        return `N\xFAmero inv\xE1lido: deve ser m\xFAltiplo de ${r.divisor}`;
      case "unrecognized_keys":
        return `Chave${r.keys.length > 1 ? "s" : ""} desconhecida${r.keys.length > 1 ? "s" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Chave inv\xE1lida em ${r.origin}`;
      case "invalid_union":
        return "Entrada inv\xE1lida";
      case "invalid_element":
        return `Valor inv\xE1lido em ${r.origin}`;
      default:
        return "Campo inv\xE1lido";
    }
  };
}, "error");
function wu() {
  return {
    localeError: Fb()
  };
}
l(wu, "default");

// node_modules/zod/v4/locales/ru.js
function Jm(e, t, n, o) {
  let r = Math.abs(e), i = r % 10, a = r % 100;
  return a >= 11 && a <= 19 ? o : i === 1 ? t : i >= 2 && i <= 4 ? n : o;
}
l(Jm, "getRussianPlural");
var Vb = /* @__PURE__ */ l(() => {
  let e = {
    string: {
      unit: {
        one: "\u0441\u0438\u043C\u0432\u043E\u043B",
        few: "\u0441\u0438\u043C\u0432\u043E\u043B\u0430",
        many: "\u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432"
      },
      verb: "\u0438\u043C\u0435\u0442\u044C"
    },
    file: {
      unit: {
        one: "\u0431\u0430\u0439\u0442",
        few: "\u0431\u0430\u0439\u0442\u0430",
        many: "\u0431\u0430\u0439\u0442"
      },
      verb: "\u0438\u043C\u0435\u0442\u044C"
    },
    array: {
      unit: {
        one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
        few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
        many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432"
      },
      verb: "\u0438\u043C\u0435\u0442\u044C"
    },
    set: {
      unit: {
        one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
        few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
        many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432"
      },
      verb: "\u0438\u043C\u0435\u0442\u044C"
    }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u0432\u0432\u043E\u0434",
    email: "email \u0430\u0434\u0440\u0435\u0441",
    url: "URL",
    emoji: "\u044D\u043C\u043E\u0434\u0437\u0438",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO \u0434\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043C\u044F",
    date: "ISO \u0434\u0430\u0442\u0430",
    time: "ISO \u0432\u0440\u0435\u043C\u044F",
    duration: "ISO \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",
    ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441",
    ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441",
    cidrv4: "IPv4 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
    cidrv6: "IPv6 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
    base64: "\u0441\u0442\u0440\u043E\u043A\u0430 \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 base64",
    base64url: "\u0441\u0442\u0440\u043E\u043A\u0430 \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 base64url",
    json_string: "JSON \u0441\u0442\u0440\u043E\u043A\u0430",
    e164: "\u043D\u043E\u043C\u0435\u0440 E.164",
    jwt: "JWT",
    template_literal: "\u0432\u0432\u043E\u0434"
  }, o = {
    nan: "NaN",
    number: "\u0447\u0438\u0441\u043B\u043E",
    array: "\u043C\u0430\u0441\u0441\u0438\u0432"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C instanceof ${r.expected}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${u}` : `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C ${i}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C ${w(r.values[0])}` : `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0434\u043D\u043E \u0438\u0437 ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        if (a) {
          let u = Number(r.maximum), c = Jm(u, a.unit.one, a.unit.few, a.unit.many);
          return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${r.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435"} \u0431\u0443\u0434\u0435\u0442 \u0438\u043C\u0435\u0442\u044C ${i}${r.maximum.toString()} ${c}`;
        }
        return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${r.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435"} \u0431\u0443\u0434\u0435\u0442 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        if (a) {
          let u = Number(r.minimum), c = Jm(u, a.unit.one, a.unit.few, a.unit.many);
          return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${r.origin} \u0431\u0443\u0434\u0435\u0442 \u0438\u043C\u0435\u0442\u044C ${i}${r.minimum.toString()} ${c}`;
        }
        return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${r.origin} \u0431\u0443\u0434\u0435\u0442 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u043D\u0430\u0447\u0438\u043D\u0430\u0442\u044C\u0441\u044F \u0441 "${i.prefix}"` : i.format === "ends_with" ? `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0437\u0430\u043A\u0430\u043D\u0447\u0438\u0432\u0430\u0442\u044C\u0441\u044F \u043D\u0430 "${i.suffix}"` : i.format === "includes" ? `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C "${i.includes}"` : i.format === "regex" ? `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ${i.pattern}` : `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E: \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u043A\u0440\u0430\u0442\u043D\u044B\u043C ${r.divisor}`;
      case "unrecognized_keys":
        return `\u041D\u0435\u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u043D\u043D${r.keys.length > 1 ? "\u044B\u0435" : "\u044B\u0439"} \u043A\u043B\u044E\u0447${r.keys.length > 1 ? "\u0438" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043B\u044E\u0447 \u0432 ${r.origin}`;
      case "invalid_union":
        return "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0432\u0445\u043E\u0434\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435";
      case "invalid_element":
        return `\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0432 ${r.origin}`;
      default:
        return "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0432\u0445\u043E\u0434\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435";
    }
  };
}, "error");
function ku() {
  return {
    localeError: Vb()
  };
}
l(ku, "default");

// node_modules/zod/v4/locales/sl.js
var qb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "znakov", verb: "imeti" },
    file: { unit: "bajtov", verb: "imeti" },
    array: { unit: "elementov", verb: "imeti" },
    set: { unit: "elementov", verb: "imeti" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "vnos",
    email: "e-po\u0161tni naslov",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum in \u010Das",
    date: "ISO datum",
    time: "ISO \u010Das",
    duration: "ISO trajanje",
    ipv4: "IPv4 naslov",
    ipv6: "IPv6 naslov",
    cidrv4: "obseg IPv4",
    cidrv6: "obseg IPv6",
    base64: "base64 kodiran niz",
    base64url: "base64url kodiran niz",
    json_string: "JSON niz",
    e164: "E.164 \u0161tevilka",
    jwt: "JWT",
    template_literal: "vnos"
  }, o = {
    nan: "NaN",
    number: "\u0161tevilo",
    array: "tabela"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Neveljaven vnos: pri\u010Dakovano instanceof ${r.expected}, prejeto ${u}` : `Neveljaven vnos: pri\u010Dakovano ${i}, prejeto ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Neveljaven vnos: pri\u010Dakovano ${w(r.values[0])}` : `Neveljavna mo\u017Enost: pri\u010Dakovano eno izmed ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Preveliko: pri\u010Dakovano, da bo ${r.origin ?? "vrednost"} imelo ${i}${r.maximum.toString()} ${a.unit ?? "elementov"}` : `Preveliko: pri\u010Dakovano, da bo ${r.origin ?? "vrednost"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Premajhno: pri\u010Dakovano, da bo ${r.origin} imelo ${i}${r.minimum.toString()} ${a.unit}` : `Premajhno: pri\u010Dakovano, da bo ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Neveljaven niz: mora se za\u010Deti z "${i.prefix}"` : i.format === "ends_with" ? `Neveljaven niz: mora se kon\u010Dati z "${i.suffix}"` : i.format === "includes" ? `Neveljaven niz: mora vsebovati "${i.includes}"` : i.format === "regex" ? `Neveljaven niz: mora ustrezati vzorcu ${i.pattern}` : `Neveljaven ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Neveljavno \u0161tevilo: mora biti ve\u010Dkratnik ${r.divisor}`;
      case "unrecognized_keys":
        return `Neprepoznan${r.keys.length > 1 ? "i klju\u010Di" : " klju\u010D"}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Neveljaven klju\u010D v ${r.origin}`;
      case "invalid_union":
        return "Neveljaven vnos";
      case "invalid_element":
        return `Neveljavna vrednost v ${r.origin}`;
      default:
        return "Neveljaven vnos";
    }
  };
}, "error");
function Iu() {
  return {
    localeError: qb()
  };
}
l(Iu, "default");

// node_modules/zod/v4/locales/sv.js
var Jb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "tecken", verb: "att ha" },
    file: { unit: "bytes", verb: "att ha" },
    array: { unit: "objekt", verb: "att inneh\xE5lla" },
    set: { unit: "objekt", verb: "att inneh\xE5lla" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "regulj\xE4rt uttryck",
    email: "e-postadress",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-datum och tid",
    date: "ISO-datum",
    time: "ISO-tid",
    duration: "ISO-varaktighet",
    ipv4: "IPv4-intervall",
    ipv6: "IPv6-intervall",
    cidrv4: "IPv4-spektrum",
    cidrv6: "IPv6-spektrum",
    base64: "base64-kodad str\xE4ng",
    base64url: "base64url-kodad str\xE4ng",
    json_string: "JSON-str\xE4ng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "mall-literal"
  }, o = {
    nan: "NaN",
    number: "antal",
    array: "lista"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ogiltig inmatning: f\xF6rv\xE4ntat instanceof ${r.expected}, fick ${u}` : `Ogiltig inmatning: f\xF6rv\xE4ntat ${i}, fick ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ogiltig inmatning: f\xF6rv\xE4ntat ${w(r.values[0])}` : `Ogiltigt val: f\xF6rv\xE4ntade en av ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `F\xF6r stor(t): f\xF6rv\xE4ntade ${r.origin ?? "v\xE4rdet"} att ha ${i}${r.maximum.toString()} ${a.unit ?? "element"}` : `F\xF6r stor(t): f\xF6rv\xE4ntat ${r.origin ?? "v\xE4rdet"} att ha ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `F\xF6r lite(t): f\xF6rv\xE4ntade ${r.origin ?? "v\xE4rdet"} att ha ${i}${r.minimum.toString()} ${a.unit}` : `F\xF6r lite(t): f\xF6rv\xE4ntade ${r.origin ?? "v\xE4rdet"} att ha ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Ogiltig str\xE4ng: m\xE5ste b\xF6rja med "${i.prefix}"` : i.format === "ends_with" ? `Ogiltig str\xE4ng: m\xE5ste sluta med "${i.suffix}"` : i.format === "includes" ? `Ogiltig str\xE4ng: m\xE5ste inneh\xE5lla "${i.includes}"` : i.format === "regex" ? `Ogiltig str\xE4ng: m\xE5ste matcha m\xF6nstret "${i.pattern}"` : `Ogiltig(t) ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ogiltigt tal: m\xE5ste vara en multipel av ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Ok\xE4nda nycklar" : "Ok\xE4nd nyckel"}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Ogiltig nyckel i ${r.origin ?? "v\xE4rdet"}`;
      case "invalid_union":
        return "Ogiltig input";
      case "invalid_element":
        return `Ogiltigt v\xE4rde i ${r.origin ?? "v\xE4rdet"}`;
      default:
        return "Ogiltig input";
    }
  };
}, "error");
function Su() {
  return {
    localeError: Jb()
  };
}
l(Su, "default");

// node_modules/zod/v4/locales/ta.js
var Bb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "\u0B8E\u0BB4\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BB3\u0BCD", verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD" },
    file: { unit: "\u0BAA\u0BC8\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD", verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD" },
    array: { unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD", verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD" },
    set: { unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD", verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1",
    email: "\u0BAE\u0BBF\u0BA9\u0BCD\u0BA9\u0B9E\u0BCD\u0B9A\u0BB2\u0BCD \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO \u0BA4\u0BC7\u0BA4\u0BBF \u0BA8\u0BC7\u0BB0\u0BAE\u0BCD",
    date: "ISO \u0BA4\u0BC7\u0BA4\u0BBF",
    time: "ISO \u0BA8\u0BC7\u0BB0\u0BAE\u0BCD",
    duration: "ISO \u0B95\u0BBE\u0BB2 \u0B85\u0BB3\u0BB5\u0BC1",
    ipv4: "IPv4 \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
    ipv6: "IPv6 \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
    cidrv4: "IPv4 \u0BB5\u0BB0\u0BAE\u0BCD\u0BAA\u0BC1",
    cidrv6: "IPv6 \u0BB5\u0BB0\u0BAE\u0BCD\u0BAA\u0BC1",
    base64: "base64-encoded \u0B9A\u0BB0\u0BAE\u0BCD",
    base64url: "base64url-encoded \u0B9A\u0BB0\u0BAE\u0BCD",
    json_string: "JSON \u0B9A\u0BB0\u0BAE\u0BCD",
    e164: "E.164 \u0B8E\u0BA3\u0BCD",
    jwt: "JWT",
    template_literal: "input"
  }, o = {
    nan: "NaN",
    number: "\u0B8E\u0BA3\u0BCD",
    array: "\u0B85\u0BA3\u0BBF",
    null: "\u0BB5\u0BC6\u0BB1\u0BC1\u0BAE\u0BC8"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 instanceof ${r.expected}, \u0BAA\u0BC6\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${u}` : `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${i}, \u0BAA\u0BC6\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${w(r.values[0])}` : `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BB5\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BAE\u0BCD: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${_(r.values, "|")} \u0B87\u0BB2\u0BCD \u0B92\u0BA9\u0BCD\u0BB1\u0BC1`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `\u0BAE\u0BBF\u0B95 \u0BAA\u0BC6\u0BB0\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${r.origin ?? "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1"} ${i}${r.maximum.toString()} ${a.unit ?? "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD"} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD` : `\u0BAE\u0BBF\u0B95 \u0BAA\u0BC6\u0BB0\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${r.origin ?? "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1"} ${i}${r.maximum.toString()} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `\u0BAE\u0BBF\u0B95\u0B9A\u0BCD \u0B9A\u0BBF\u0BB1\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${r.origin} ${i}${r.minimum.toString()} ${a.unit} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD` : `\u0BAE\u0BBF\u0B95\u0B9A\u0BCD \u0B9A\u0BBF\u0BB1\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${r.origin} ${i}${r.minimum.toString()} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "${i.prefix}" \u0B87\u0BB2\u0BCD \u0BA4\u0BCA\u0B9F\u0B99\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD` : i.format === "ends_with" ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "${i.suffix}" \u0B87\u0BB2\u0BCD \u0BAE\u0BC1\u0B9F\u0BBF\u0BB5\u0B9F\u0BC8\u0BAF \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD` : i.format === "includes" ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "${i.includes}" \u0B90 \u0B89\u0BB3\u0BCD\u0BB3\u0B9F\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD` : i.format === "regex" ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: ${i.pattern} \u0BAE\u0BC1\u0BB1\u0BC8\u0BAA\u0BBE\u0B9F\u0BCD\u0B9F\u0BC1\u0B9F\u0BA9\u0BCD \u0BAA\u0BCA\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD` : `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B8E\u0BA3\u0BCD: ${r.divisor} \u0B87\u0BA9\u0BCD \u0BAA\u0BB2\u0BAE\u0BBE\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
      case "unrecognized_keys":
        return `\u0B85\u0B9F\u0BC8\u0BAF\u0BBE\u0BB3\u0BAE\u0BCD \u0BA4\u0BC6\u0BB0\u0BBF\u0BAF\u0BBE\u0BA4 \u0BB5\u0BBF\u0B9A\u0BC8${r.keys.length > 1 ? "\u0B95\u0BB3\u0BCD" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} \u0B87\u0BB2\u0BCD \u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BB5\u0BBF\u0B9A\u0BC8`;
      case "invalid_union":
        return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1";
      case "invalid_element":
        return `${r.origin} \u0B87\u0BB2\u0BCD \u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1`;
      default:
        return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1";
    }
  };
}, "error");
function Tu() {
  return {
    localeError: Bb()
  };
}
l(Tu, "default");

// node_modules/zod/v4/locales/th.js
var Gb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23", verb: "\u0E04\u0E27\u0E23\u0E21\u0E35" },
    file: { unit: "\u0E44\u0E1A\u0E15\u0E4C", verb: "\u0E04\u0E27\u0E23\u0E21\u0E35" },
    array: { unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23", verb: "\u0E04\u0E27\u0E23\u0E21\u0E35" },
    set: { unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23", verb: "\u0E04\u0E27\u0E23\u0E21\u0E35" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E1B\u0E49\u0E2D\u0E19",
    email: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48\u0E2D\u0E35\u0E40\u0E21\u0E25",
    url: "URL",
    emoji: "\u0E2D\u0E34\u0E42\u0E21\u0E08\u0E34",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
    date: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E41\u0E1A\u0E1A ISO",
    time: "\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
    duration: "\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
    ipv4: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48 IPv4",
    ipv6: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48 IPv6",
    cidrv4: "\u0E0A\u0E48\u0E27\u0E07 IP \u0E41\u0E1A\u0E1A IPv4",
    cidrv6: "\u0E0A\u0E48\u0E27\u0E07 IP \u0E41\u0E1A\u0E1A IPv6",
    base64: "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A Base64",
    base64url: "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A Base64 \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A URL",
    json_string: "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A JSON",
    e164: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28 (E.164)",
    jwt: "\u0E42\u0E17\u0E40\u0E04\u0E19 JWT",
    template_literal: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E1B\u0E49\u0E2D\u0E19"
  }, o = {
    nan: "NaN",
    number: "\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02",
    array: "\u0E2D\u0E32\u0E23\u0E4C\u0E40\u0E23\u0E22\u0E4C (Array)",
    null: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E04\u0E48\u0E32 (null)"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 instanceof ${r.expected} \u0E41\u0E15\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A ${u}` : `\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 ${i} \u0E41\u0E15\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u0E04\u0E48\u0E32\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 ${w(r.values[0])}` : `\u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E43\u0E19 ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19" : "\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32", a = t(r.origin);
        return a ? `\u0E40\u0E01\u0E34\u0E19\u0E01\u0E33\u0E2B\u0E19\u0E14: ${r.origin ?? "\u0E04\u0E48\u0E32"} \u0E04\u0E27\u0E23\u0E21\u0E35${i} ${r.maximum.toString()} ${a.unit ?? "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"}` : `\u0E40\u0E01\u0E34\u0E19\u0E01\u0E33\u0E2B\u0E19\u0E14: ${r.origin ?? "\u0E04\u0E48\u0E32"} \u0E04\u0E27\u0E23\u0E21\u0E35${i} ${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? "\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22" : "\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32", a = t(r.origin);
        return a ? `\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E01\u0E33\u0E2B\u0E19\u0E14: ${r.origin} \u0E04\u0E27\u0E23\u0E21\u0E35${i} ${r.minimum.toString()} ${a.unit}` : `\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E01\u0E33\u0E2B\u0E19\u0E14: ${r.origin} \u0E04\u0E27\u0E23\u0E21\u0E35${i} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E02\u0E36\u0E49\u0E19\u0E15\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22 "${i.prefix}"` : i.format === "ends_with" ? `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E25\u0E07\u0E17\u0E49\u0E32\u0E22\u0E14\u0E49\u0E27\u0E22 "${i.suffix}"` : i.format === "includes" ? `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 "${i.includes}" \u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21` : i.format === "regex" ? `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E15\u0E49\u0E2D\u0E07\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14 ${i.pattern}` : `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E17\u0E35\u0E48\u0E2B\u0E32\u0E23\u0E14\u0E49\u0E27\u0E22 ${r.divisor} \u0E44\u0E14\u0E49\u0E25\u0E07\u0E15\u0E31\u0E27`;
      case "unrecognized_keys":
        return `\u0E1E\u0E1A\u0E04\u0E35\u0E22\u0E4C\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E23\u0E39\u0E49\u0E08\u0E31\u0E01: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `\u0E04\u0E35\u0E22\u0E4C\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E19 ${r.origin}`;
      case "invalid_union":
        return "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E22\u0E39\u0E40\u0E19\u0E35\u0E22\u0E19\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E44\u0E27\u0E49";
      case "invalid_element":
        return `\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E19 ${r.origin}`;
      default:
        return "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07";
    }
  };
}, "error");
function zu() {
  return {
    localeError: Gb()
  };
}
l(zu, "default");

// node_modules/zod/v4/locales/tr.js
var Wb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "karakter", verb: "olmal\u0131" },
    file: { unit: "bayt", verb: "olmal\u0131" },
    array: { unit: "\xF6\u011Fe", verb: "olmal\u0131" },
    set: { unit: "\xF6\u011Fe", verb: "olmal\u0131" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "girdi",
    email: "e-posta adresi",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO tarih ve saat",
    date: "ISO tarih",
    time: "ISO saat",
    duration: "ISO s\xFCre",
    ipv4: "IPv4 adresi",
    ipv6: "IPv6 adresi",
    cidrv4: "IPv4 aral\u0131\u011F\u0131",
    cidrv6: "IPv6 aral\u0131\u011F\u0131",
    base64: "base64 ile \u015Fifrelenmi\u015F metin",
    base64url: "base64url ile \u015Fifrelenmi\u015F metin",
    json_string: "JSON dizesi",
    e164: "E.164 say\u0131s\u0131",
    jwt: "JWT",
    template_literal: "\u015Eablon dizesi"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ge\xE7ersiz de\u011Fer: beklenen instanceof ${r.expected}, al\u0131nan ${u}` : `Ge\xE7ersiz de\u011Fer: beklenen ${i}, al\u0131nan ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ge\xE7ersiz de\u011Fer: beklenen ${w(r.values[0])}` : `Ge\xE7ersiz se\xE7enek: a\u015Fa\u011F\u0131dakilerden biri olmal\u0131: ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `\xC7ok b\xFCy\xFCk: beklenen ${r.origin ?? "de\u011Fer"} ${i}${r.maximum.toString()} ${a.unit ?? "\xF6\u011Fe"}` : `\xC7ok b\xFCy\xFCk: beklenen ${r.origin ?? "de\u011Fer"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `\xC7ok k\xFC\xE7\xFCk: beklenen ${r.origin} ${i}${r.minimum.toString()} ${a.unit}` : `\xC7ok k\xFC\xE7\xFCk: beklenen ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Ge\xE7ersiz metin: "${i.prefix}" ile ba\u015Flamal\u0131` : i.format === "ends_with" ? `Ge\xE7ersiz metin: "${i.suffix}" ile bitmeli` : i.format === "includes" ? `Ge\xE7ersiz metin: "${i.includes}" i\xE7ermeli` : i.format === "regex" ? `Ge\xE7ersiz metin: ${i.pattern} desenine uymal\u0131` : `Ge\xE7ersiz ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ge\xE7ersiz say\u0131: ${r.divisor} ile tam b\xF6l\xFCnebilmeli`;
      case "unrecognized_keys":
        return `Tan\u0131nmayan anahtar${r.keys.length > 1 ? "lar" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} i\xE7inde ge\xE7ersiz anahtar`;
      case "invalid_union":
        return "Ge\xE7ersiz de\u011Fer";
      case "invalid_element":
        return `${r.origin} i\xE7inde ge\xE7ersiz de\u011Fer`;
      default:
        return "Ge\xE7ersiz de\u011Fer";
    }
  };
}, "error");
function Eu() {
  return {
    localeError: Wb()
  };
}
l(Eu, "default");

// node_modules/zod/v4/locales/uk.js
var Kb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "\u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432", verb: "\u043C\u0430\u0442\u0438\u043C\u0435" },
    file: { unit: "\u0431\u0430\u0439\u0442\u0456\u0432", verb: "\u043C\u0430\u0442\u0438\u043C\u0435" },
    array: { unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432", verb: "\u043C\u0430\u0442\u0438\u043C\u0435" },
    set: { unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432", verb: "\u043C\u0430\u0442\u0438\u043C\u0435" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456",
    email: "\u0430\u0434\u0440\u0435\u0441\u0430 \u0435\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u043E\u0457 \u043F\u043E\u0448\u0442\u0438",
    url: "URL",
    emoji: "\u0435\u043C\u043E\u0434\u0437\u0456",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "\u0434\u0430\u0442\u0430 \u0442\u0430 \u0447\u0430\u0441 ISO",
    date: "\u0434\u0430\u0442\u0430 ISO",
    time: "\u0447\u0430\u0441 ISO",
    duration: "\u0442\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C ISO",
    ipv4: "\u0430\u0434\u0440\u0435\u0441\u0430 IPv4",
    ipv6: "\u0430\u0434\u0440\u0435\u0441\u0430 IPv6",
    cidrv4: "\u0434\u0456\u0430\u043F\u0430\u0437\u043E\u043D IPv4",
    cidrv6: "\u0434\u0456\u0430\u043F\u0430\u0437\u043E\u043D IPv6",
    base64: "\u0440\u044F\u0434\u043E\u043A \u0443 \u043A\u043E\u0434\u0443\u0432\u0430\u043D\u043D\u0456 base64",
    base64url: "\u0440\u044F\u0434\u043E\u043A \u0443 \u043A\u043E\u0434\u0443\u0432\u0430\u043D\u043D\u0456 base64url",
    json_string: "\u0440\u044F\u0434\u043E\u043A JSON",
    e164: "\u043D\u043E\u043C\u0435\u0440 E.164",
    jwt: "JWT",
    template_literal: "\u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456"
  }, o = {
    nan: "NaN",
    number: "\u0447\u0438\u0441\u043B\u043E",
    array: "\u043C\u0430\u0441\u0438\u0432"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F instanceof ${r.expected}, \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043E ${u}` : `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F ${i}, \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043E ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F ${w(r.values[0])}` : `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0430 \u043E\u043F\u0446\u0456\u044F: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F \u043E\u0434\u043D\u0435 \u0437 ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u0432\u0435\u043B\u0438\u043A\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${r.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F"} ${a.verb} ${i}${r.maximum.toString()} ${a.unit ?? "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432"}` : `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u0432\u0435\u043B\u0438\u043A\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${r.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F"} \u0431\u0443\u0434\u0435 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u043C\u0430\u043B\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${r.origin} ${a.verb} ${i}${r.minimum.toString()} ${a.unit}` : `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u043C\u0430\u043B\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${r.origin} \u0431\u0443\u0434\u0435 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u043F\u043E\u0447\u0438\u043D\u0430\u0442\u0438\u0441\u044F \u0437 "${i.prefix}"` : i.format === "ends_with" ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u0437\u0430\u043A\u0456\u043D\u0447\u0443\u0432\u0430\u0442\u0438\u0441\u044F \u043D\u0430 "${i.suffix}"` : i.format === "includes" ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u043C\u0456\u0441\u0442\u0438\u0442\u0438 "${i.includes}"` : i.format === "regex" ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0442\u0438 \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ${i.pattern}` : `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0435 \u0447\u0438\u0441\u043B\u043E: \u043F\u043E\u0432\u0438\u043D\u043D\u043E \u0431\u0443\u0442\u0438 \u043A\u0440\u0430\u0442\u043D\u0438\u043C ${r.divisor}`;
      case "unrecognized_keys":
        return `\u041D\u0435\u0440\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u043D\u0438\u0439 \u043A\u043B\u044E\u0447${r.keys.length > 1 ? "\u0456" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u043A\u043B\u044E\u0447 \u0443 ${r.origin}`;
      case "invalid_union":
        return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456";
      case "invalid_element":
        return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0443 ${r.origin}`;
      default:
        return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456";
    }
  };
}, "error");
function Dn() {
  return {
    localeError: Kb()
  };
}
l(Dn, "default");

// node_modules/zod/v4/locales/ua.js
function Ou() {
  return Dn();
}
l(Ou, "default");

// node_modules/zod/v4/locales/ur.js
var Hb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "\u062D\u0631\u0648\u0641", verb: "\u06C1\u0648\u0646\u0627" },
    file: { unit: "\u0628\u0627\u0626\u0679\u0633", verb: "\u06C1\u0648\u0646\u0627" },
    array: { unit: "\u0622\u0626\u0679\u0645\u0632", verb: "\u06C1\u0648\u0646\u0627" },
    set: { unit: "\u0622\u0626\u0679\u0645\u0632", verb: "\u06C1\u0648\u0646\u0627" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u0627\u0646 \u067E\u0679",
    email: "\u0627\u06CC \u0645\u06CC\u0644 \u0627\u06CC\u0688\u0631\u06CC\u0633",
    url: "\u06CC\u0648 \u0622\u0631 \u0627\u06CC\u0644",
    emoji: "\u0627\u06CC\u0645\u0648\u062C\u06CC",
    uuid: "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
    uuidv4: "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC \u0648\u06CC 4",
    uuidv6: "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC \u0648\u06CC 6",
    nanoid: "\u0646\u06CC\u0646\u0648 \u0622\u0626\u06CC \u0688\u06CC",
    guid: "\u062C\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
    cuid: "\u0633\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
    cuid2: "\u0633\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC 2",
    ulid: "\u06CC\u0648 \u0627\u06CC\u0644 \u0622\u0626\u06CC \u0688\u06CC",
    xid: "\u0627\u06CC\u06A9\u0633 \u0622\u0626\u06CC \u0688\u06CC",
    ksuid: "\u06A9\u06D2 \u0627\u06CC\u0633 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
    datetime: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0688\u06CC\u0679 \u0679\u0627\u0626\u0645",
    date: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u062A\u0627\u0631\u06CC\u062E",
    time: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0648\u0642\u062A",
    duration: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0645\u062F\u062A",
    ipv4: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 4 \u0627\u06CC\u0688\u0631\u06CC\u0633",
    ipv6: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 6 \u0627\u06CC\u0688\u0631\u06CC\u0633",
    cidrv4: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 4 \u0631\u06CC\u0646\u062C",
    cidrv6: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 6 \u0631\u06CC\u0646\u062C",
    base64: "\u0628\u06CC\u0633 64 \u0627\u0646 \u06A9\u0648\u0688\u0688 \u0633\u0679\u0631\u0646\u06AF",
    base64url: "\u0628\u06CC\u0633 64 \u06CC\u0648 \u0622\u0631 \u0627\u06CC\u0644 \u0627\u0646 \u06A9\u0648\u0688\u0688 \u0633\u0679\u0631\u0646\u06AF",
    json_string: "\u062C\u06D2 \u0627\u06CC\u0633 \u0627\u0648 \u0627\u06CC\u0646 \u0633\u0679\u0631\u0646\u06AF",
    e164: "\u0627\u06CC 164 \u0646\u0645\u0628\u0631",
    jwt: "\u062C\u06D2 \u0688\u0628\u0644\u06CC\u0648 \u0679\u06CC",
    template_literal: "\u0627\u0646 \u067E\u0679"
  }, o = {
    nan: "NaN",
    number: "\u0646\u0645\u0628\u0631",
    array: "\u0622\u0631\u06D2",
    null: "\u0646\u0644"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: instanceof ${r.expected} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627\u060C ${u} \u0645\u0648\u0635\u0648\u0644 \u06C1\u0648\u0627` : `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: ${i} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627\u060C ${u} \u0645\u0648\u0635\u0648\u0644 \u06C1\u0648\u0627`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: ${w(r.values[0])} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627` : `\u063A\u0644\u0637 \u0622\u067E\u0634\u0646: ${_(r.values, "|")} \u0645\u06CC\u06BA \u0633\u06D2 \u0627\u06CC\u06A9 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `\u0628\u06C1\u062A \u0628\u0691\u0627: ${r.origin ?? "\u0648\u06CC\u0644\u06CC\u0648"} \u06A9\u06D2 ${i}${r.maximum.toString()} ${a.unit ?? "\u0639\u0646\u0627\u0635\u0631"} \u06C1\u0648\u0646\u06D2 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u06D2` : `\u0628\u06C1\u062A \u0628\u0691\u0627: ${r.origin ?? "\u0648\u06CC\u0644\u06CC\u0648"} \u06A9\u0627 ${i}${r.maximum.toString()} \u06C1\u0648\u0646\u0627 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `\u0628\u06C1\u062A \u0686\u06BE\u0648\u0679\u0627: ${r.origin} \u06A9\u06D2 ${i}${r.minimum.toString()} ${a.unit} \u06C1\u0648\u0646\u06D2 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u06D2` : `\u0628\u06C1\u062A \u0686\u06BE\u0648\u0679\u0627: ${r.origin} \u06A9\u0627 ${i}${r.minimum.toString()} \u06C1\u0648\u0646\u0627 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "${i.prefix}" \u0633\u06D2 \u0634\u0631\u0648\u0639 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2` : i.format === "ends_with" ? `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "${i.suffix}" \u067E\u0631 \u062E\u062A\u0645 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2` : i.format === "includes" ? `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "${i.includes}" \u0634\u0627\u0645\u0644 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2` : i.format === "regex" ? `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: \u067E\u06CC\u0679\u0631\u0646 ${i.pattern} \u0633\u06D2 \u0645\u06CC\u0686 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2` : `\u063A\u0644\u0637 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u063A\u0644\u0637 \u0646\u0645\u0628\u0631: ${r.divisor} \u06A9\u0627 \u0645\u0636\u0627\u0639\u0641 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`;
      case "unrecognized_keys":
        return `\u063A\u06CC\u0631 \u062A\u0633\u0644\u06CC\u0645 \u0634\u062F\u06C1 \u06A9\u06CC${r.keys.length > 1 ? "\u0632" : ""}: ${_(r.keys, "\u060C ")}`;
      case "invalid_key":
        return `${r.origin} \u0645\u06CC\u06BA \u063A\u0644\u0637 \u06A9\u06CC`;
      case "invalid_union":
        return "\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679";
      case "invalid_element":
        return `${r.origin} \u0645\u06CC\u06BA \u063A\u0644\u0637 \u0648\u06CC\u0644\u06CC\u0648`;
      default:
        return "\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679";
    }
  };
}, "error");
function ju() {
  return {
    localeError: Hb()
  };
}
l(ju, "default");

// node_modules/zod/v4/locales/uz.js
var Xb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "belgi", verb: "bo\u2018lishi kerak" },
    file: { unit: "bayt", verb: "bo\u2018lishi kerak" },
    array: { unit: "element", verb: "bo\u2018lishi kerak" },
    set: { unit: "element", verb: "bo\u2018lishi kerak" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "kirish",
    email: "elektron pochta manzili",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO sana va vaqti",
    date: "ISO sana",
    time: "ISO vaqt",
    duration: "ISO davomiylik",
    ipv4: "IPv4 manzil",
    ipv6: "IPv6 manzil",
    mac: "MAC manzil",
    cidrv4: "IPv4 diapazon",
    cidrv6: "IPv6 diapazon",
    base64: "base64 kodlangan satr",
    base64url: "base64url kodlangan satr",
    json_string: "JSON satr",
    e164: "E.164 raqam",
    jwt: "JWT",
    template_literal: "kirish"
  }, o = {
    nan: "NaN",
    number: "raqam",
    array: "massiv"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Noto\u2018g\u2018ri kirish: kutilgan instanceof ${r.expected}, qabul qilingan ${u}` : `Noto\u2018g\u2018ri kirish: kutilgan ${i}, qabul qilingan ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Noto\u2018g\u2018ri kirish: kutilgan ${w(r.values[0])}` : `Noto\u2018g\u2018ri variant: quyidagilardan biri kutilgan ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Juda katta: kutilgan ${r.origin ?? "qiymat"} ${i}${r.maximum.toString()} ${a.unit} ${a.verb}` : `Juda katta: kutilgan ${r.origin ?? "qiymat"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Juda kichik: kutilgan ${r.origin} ${i}${r.minimum.toString()} ${a.unit} ${a.verb}` : `Juda kichik: kutilgan ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Noto\u2018g\u2018ri satr: "${i.prefix}" bilan boshlanishi kerak` : i.format === "ends_with" ? `Noto\u2018g\u2018ri satr: "${i.suffix}" bilan tugashi kerak` : i.format === "includes" ? `Noto\u2018g\u2018ri satr: "${i.includes}" ni o\u2018z ichiga olishi kerak` : i.format === "regex" ? `Noto\u2018g\u2018ri satr: ${i.pattern} shabloniga mos kelishi kerak` : `Noto\u2018g\u2018ri ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Noto\u2018g\u2018ri raqam: ${r.divisor} ning karralisi bo\u2018lishi kerak`;
      case "unrecognized_keys":
        return `Noma\u2019lum kalit${r.keys.length > 1 ? "lar" : ""}: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} dagi kalit noto\u2018g\u2018ri`;
      case "invalid_union":
        return "Noto\u2018g\u2018ri kirish";
      case "invalid_element":
        return `${r.origin} da noto\u2018g\u2018ri qiymat`;
      default:
        return "Noto\u2018g\u2018ri kirish";
    }
  };
}, "error");
function Pu() {
  return {
    localeError: Xb()
  };
}
l(Pu, "default");

// node_modules/zod/v4/locales/vi.js
var Yb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "k\xFD t\u1EF1", verb: "c\xF3" },
    file: { unit: "byte", verb: "c\xF3" },
    array: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" },
    set: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u0111\u1EA7u v\xE0o",
    email: "\u0111\u1ECBa ch\u1EC9 email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ng\xE0y gi\u1EDD ISO",
    date: "ng\xE0y ISO",
    time: "gi\u1EDD ISO",
    duration: "kho\u1EA3ng th\u1EDDi gian ISO",
    ipv4: "\u0111\u1ECBa ch\u1EC9 IPv4",
    ipv6: "\u0111\u1ECBa ch\u1EC9 IPv6",
    cidrv4: "d\u1EA3i IPv4",
    cidrv6: "d\u1EA3i IPv6",
    base64: "chu\u1ED7i m\xE3 h\xF3a base64",
    base64url: "chu\u1ED7i m\xE3 h\xF3a base64url",
    json_string: "chu\u1ED7i JSON",
    e164: "s\u1ED1 E.164",
    jwt: "JWT",
    template_literal: "\u0111\u1EA7u v\xE0o"
  }, o = {
    nan: "NaN",
    number: "s\u1ED1",
    array: "m\u1EA3ng"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i instanceof ${r.expected}, nh\u1EADn \u0111\u01B0\u1EE3c ${u}` : `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i ${i}, nh\u1EADn \u0111\u01B0\u1EE3c ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i ${w(r.values[0])}` : `T\xF9y ch\u1ECDn kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i m\u1ED9t trong c\xE1c gi\xE1 tr\u1ECB ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Qu\xE1 l\u1EDBn: mong \u0111\u1EE3i ${r.origin ?? "gi\xE1 tr\u1ECB"} ${a.verb} ${i}${r.maximum.toString()} ${a.unit ?? "ph\u1EA7n t\u1EED"}` : `Qu\xE1 l\u1EDBn: mong \u0111\u1EE3i ${r.origin ?? "gi\xE1 tr\u1ECB"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Qu\xE1 nh\u1ECF: mong \u0111\u1EE3i ${r.origin} ${a.verb} ${i}${r.minimum.toString()} ${a.unit}` : `Qu\xE1 nh\u1ECF: mong \u0111\u1EE3i ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i b\u1EAFt \u0111\u1EA7u b\u1EB1ng "${i.prefix}"` : i.format === "ends_with" ? `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i k\u1EBFt th\xFAc b\u1EB1ng "${i.suffix}"` : i.format === "includes" ? `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i bao g\u1ED3m "${i.includes}"` : i.format === "regex" ? `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i kh\u1EDBp v\u1EDBi m\u1EABu ${i.pattern}` : `${n[i.format] ?? r.format} kh\xF4ng h\u1EE3p l\u1EC7`;
      }
      case "not_multiple_of":
        return `S\u1ED1 kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i l\xE0 b\u1ED9i s\u1ED1 c\u1EE7a ${r.divisor}`;
      case "unrecognized_keys":
        return `Kh\xF3a kh\xF4ng \u0111\u01B0\u1EE3c nh\u1EADn d\u1EA1ng: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `Kh\xF3a kh\xF4ng h\u1EE3p l\u1EC7 trong ${r.origin}`;
      case "invalid_union":
        return "\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7";
      case "invalid_element":
        return `Gi\xE1 tr\u1ECB kh\xF4ng h\u1EE3p l\u1EC7 trong ${r.origin}`;
      default:
        return "\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7";
    }
  };
}, "error");
function Nu() {
  return {
    localeError: Yb()
  };
}
l(Nu, "default");

// node_modules/zod/v4/locales/zh-CN.js
var Qb = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "\u5B57\u7B26", verb: "\u5305\u542B" },
    file: { unit: "\u5B57\u8282", verb: "\u5305\u542B" },
    array: { unit: "\u9879", verb: "\u5305\u542B" },
    set: { unit: "\u9879", verb: "\u5305\u542B" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u8F93\u5165",
    email: "\u7535\u5B50\u90AE\u4EF6",
    url: "URL",
    emoji: "\u8868\u60C5\u7B26\u53F7",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO\u65E5\u671F\u65F6\u95F4",
    date: "ISO\u65E5\u671F",
    time: "ISO\u65F6\u95F4",
    duration: "ISO\u65F6\u957F",
    ipv4: "IPv4\u5730\u5740",
    ipv6: "IPv6\u5730\u5740",
    cidrv4: "IPv4\u7F51\u6BB5",
    cidrv6: "IPv6\u7F51\u6BB5",
    base64: "base64\u7F16\u7801\u5B57\u7B26\u4E32",
    base64url: "base64url\u7F16\u7801\u5B57\u7B26\u4E32",
    json_string: "JSON\u5B57\u7B26\u4E32",
    e164: "E.164\u53F7\u7801",
    jwt: "JWT",
    template_literal: "\u8F93\u5165"
  }, o = {
    nan: "NaN",
    number: "\u6570\u5B57",
    array: "\u6570\u7EC4",
    null: "\u7A7A\u503C(null)"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B instanceof ${r.expected}\uFF0C\u5B9E\u9645\u63A5\u6536 ${u}` : `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B ${i}\uFF0C\u5B9E\u9645\u63A5\u6536 ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B ${w(r.values[0])}` : `\u65E0\u6548\u9009\u9879\uFF1A\u671F\u671B\u4EE5\u4E0B\u4E4B\u4E00 ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `\u6570\u503C\u8FC7\u5927\uFF1A\u671F\u671B ${r.origin ?? "\u503C"} ${i}${r.maximum.toString()} ${a.unit ?? "\u4E2A\u5143\u7D20"}` : `\u6570\u503C\u8FC7\u5927\uFF1A\u671F\u671B ${r.origin ?? "\u503C"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `\u6570\u503C\u8FC7\u5C0F\uFF1A\u671F\u671B ${r.origin} ${i}${r.minimum.toString()} ${a.unit}` : `\u6570\u503C\u8FC7\u5C0F\uFF1A\u671F\u671B ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u4EE5 "${i.prefix}" \u5F00\u5934` : i.format === "ends_with" ? `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u4EE5 "${i.suffix}" \u7ED3\u5C3E` : i.format === "includes" ? `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u5305\u542B "${i.includes}"` : i.format === "regex" ? `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u6EE1\u8DB3\u6B63\u5219\u8868\u8FBE\u5F0F ${i.pattern}` : `\u65E0\u6548${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u65E0\u6548\u6570\u5B57\uFF1A\u5FC5\u987B\u662F ${r.divisor} \u7684\u500D\u6570`;
      case "unrecognized_keys":
        return `\u51FA\u73B0\u672A\u77E5\u7684\u952E(key): ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} \u4E2D\u7684\u952E(key)\u65E0\u6548`;
      case "invalid_union":
        return "\u65E0\u6548\u8F93\u5165";
      case "invalid_element":
        return `${r.origin} \u4E2D\u5305\u542B\u65E0\u6548\u503C(value)`;
      default:
        return "\u65E0\u6548\u8F93\u5165";
    }
  };
}, "error");
function Au() {
  return {
    localeError: Qb()
  };
}
l(Au, "default");

// node_modules/zod/v4/locales/zh-TW.js
var ex = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "\u5B57\u5143", verb: "\u64C1\u6709" },
    file: { unit: "\u4F4D\u5143\u7D44", verb: "\u64C1\u6709" },
    array: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" },
    set: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u8F38\u5165",
    email: "\u90F5\u4EF6\u5730\u5740",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO \u65E5\u671F\u6642\u9593",
    date: "ISO \u65E5\u671F",
    time: "ISO \u6642\u9593",
    duration: "ISO \u671F\u9593",
    ipv4: "IPv4 \u4F4D\u5740",
    ipv6: "IPv6 \u4F4D\u5740",
    cidrv4: "IPv4 \u7BC4\u570D",
    cidrv6: "IPv6 \u7BC4\u570D",
    base64: "base64 \u7DE8\u78BC\u5B57\u4E32",
    base64url: "base64url \u7DE8\u78BC\u5B57\u4E32",
    json_string: "JSON \u5B57\u4E32",
    e164: "E.164 \u6578\u503C",
    jwt: "JWT",
    template_literal: "\u8F38\u5165"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA instanceof ${r.expected}\uFF0C\u4F46\u6536\u5230 ${u}` : `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA ${i}\uFF0C\u4F46\u6536\u5230 ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA ${w(r.values[0])}` : `\u7121\u6548\u7684\u9078\u9805\uFF1A\u9810\u671F\u70BA\u4EE5\u4E0B\u5176\u4E2D\u4E4B\u4E00 ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `\u6578\u503C\u904E\u5927\uFF1A\u9810\u671F ${r.origin ?? "\u503C"} \u61C9\u70BA ${i}${r.maximum.toString()} ${a.unit ?? "\u500B\u5143\u7D20"}` : `\u6578\u503C\u904E\u5927\uFF1A\u9810\u671F ${r.origin ?? "\u503C"} \u61C9\u70BA ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `\u6578\u503C\u904E\u5C0F\uFF1A\u9810\u671F ${r.origin} \u61C9\u70BA ${i}${r.minimum.toString()} ${a.unit}` : `\u6578\u503C\u904E\u5C0F\uFF1A\u9810\u671F ${r.origin} \u61C9\u70BA ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u4EE5 "${i.prefix}" \u958B\u982D` : i.format === "ends_with" ? `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u4EE5 "${i.suffix}" \u7D50\u5C3E` : i.format === "includes" ? `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u5305\u542B "${i.includes}"` : i.format === "regex" ? `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u7B26\u5408\u683C\u5F0F ${i.pattern}` : `\u7121\u6548\u7684 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u7121\u6548\u7684\u6578\u5B57\uFF1A\u5FC5\u9808\u70BA ${r.divisor} \u7684\u500D\u6578`;
      case "unrecognized_keys":
        return `\u7121\u6CD5\u8B58\u5225\u7684\u9375\u503C${r.keys.length > 1 ? "\u5011" : ""}\uFF1A${_(r.keys, "\u3001")}`;
      case "invalid_key":
        return `${r.origin} \u4E2D\u6709\u7121\u6548\u7684\u9375\u503C`;
      case "invalid_union":
        return "\u7121\u6548\u7684\u8F38\u5165\u503C";
      case "invalid_element":
        return `${r.origin} \u4E2D\u6709\u7121\u6548\u7684\u503C`;
      default:
        return "\u7121\u6548\u7684\u8F38\u5165\u503C";
    }
  };
}, "error");
function Ru() {
  return {
    localeError: ex()
  };
}
l(Ru, "default");

// node_modules/zod/v4/locales/yo.js
var tx = /* @__PURE__ */ l(() => {
  let e = {
    string: { unit: "\xE0mi", verb: "n\xED" },
    file: { unit: "bytes", verb: "n\xED" },
    array: { unit: "nkan", verb: "n\xED" },
    set: { unit: "nkan", verb: "n\xED" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  l(t, "getSizing");
  let n = {
    regex: "\u1EB9\u0300r\u1ECD \xECb\xE1w\u1ECDl\xE9",
    email: "\xE0d\xEDr\u1EB9\u0301s\xEC \xECm\u1EB9\u0301l\xEC",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "\xE0k\xF3k\xF2 ISO",
    date: "\u1ECDj\u1ECD\u0301 ISO",
    time: "\xE0k\xF3k\xF2 ISO",
    duration: "\xE0k\xF3k\xF2 t\xF3 p\xE9 ISO",
    ipv4: "\xE0d\xEDr\u1EB9\u0301s\xEC IPv4",
    ipv6: "\xE0d\xEDr\u1EB9\u0301s\xEC IPv6",
    cidrv4: "\xE0gb\xE8gb\xE8 IPv4",
    cidrv6: "\xE0gb\xE8gb\xE8 IPv6",
    base64: "\u1ECD\u0300r\u1ECD\u0300 t\xED a k\u1ECD\u0301 n\xED base64",
    base64url: "\u1ECD\u0300r\u1ECD\u0300 base64url",
    json_string: "\u1ECD\u0300r\u1ECD\u0300 JSON",
    e164: "n\u1ECD\u0301mb\xE0 E.164",
    jwt: "JWT",
    template_literal: "\u1EB9\u0300r\u1ECD \xECb\xE1w\u1ECDl\xE9"
  }, o = {
    nan: "NaN",
    number: "n\u1ECD\u0301mb\xE0",
    array: "akop\u1ECD"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected, a = I(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi instanceof ${r.expected}, \xE0m\u1ECD\u0300 a r\xED ${u}` : `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi ${i}, \xE0m\u1ECD\u0300 a r\xED ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi ${w(r.values[0])}` : `\xC0\u1E63\xE0y\xE0n a\u1E63\xEC\u1E63e: yan \u1ECD\u0300kan l\xE1ra ${_(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `T\xF3 p\u1ECD\u0300 j\xF9: a n\xED l\xE1ti j\u1EB9\u0301 p\xE9 ${r.origin ?? "iye"} ${a.verb} ${i}${r.maximum} ${a.unit}` : `T\xF3 p\u1ECD\u0300 j\xF9: a n\xED l\xE1ti j\u1EB9\u0301 ${i}${r.maximum}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `K\xE9r\xE9 ju: a n\xED l\xE1ti j\u1EB9\u0301 p\xE9 ${r.origin} ${a.verb} ${i}${r.minimum} ${a.unit}` : `K\xE9r\xE9 ju: a n\xED l\xE1ti j\u1EB9\u0301 ${i}${r.minimum}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 b\u1EB9\u0300r\u1EB9\u0300 p\u1EB9\u0300l\xFA "${i.prefix}"` : i.format === "ends_with" ? `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 par\xED p\u1EB9\u0300l\xFA "${i.suffix}"` : i.format === "includes" ? `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 n\xED "${i.includes}"` : i.format === "regex" ? `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 b\xE1 \xE0p\u1EB9\u1EB9r\u1EB9 mu ${i.pattern}` : `A\u1E63\xEC\u1E63e: ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `N\u1ECD\u0301mb\xE0 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 j\u1EB9\u0301 \xE8y\xE0 p\xEDp\xEDn ti ${r.divisor}`;
      case "unrecognized_keys":
        return `B\u1ECDt\xECn\xEC \xE0\xECm\u1ECD\u0300: ${_(r.keys, ", ")}`;
      case "invalid_key":
        return `B\u1ECDt\xECn\xEC a\u1E63\xEC\u1E63e n\xEDn\xFA ${r.origin}`;
      case "invalid_union":
        return "\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e";
      case "invalid_element":
        return `Iye a\u1E63\xEC\u1E63e n\xEDn\xFA ${r.origin}`;
      default:
        return "\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e";
    }
  };
}, "error");
function Cu() {
  return {
    localeError: tx()
  };
}
l(Cu, "default");

// node_modules/zod/v4/core/registries.js
var Bm, Du = Symbol("ZodOutput"), Uu = Symbol("ZodInput"), Wo = class {
  static {
    l(this, "$ZodRegistry");
  }
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
  }
  add(t, ...n) {
    let o = n[0];
    return this._map.set(t, o), o && typeof o == "object" && "id" in o && this._idmap.set(o.id, t), this;
  }
  clear() {
    return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
  }
  remove(t) {
    let n = this._map.get(t);
    return n && typeof n == "object" && "id" in n && this._idmap.delete(n.id), this._map.delete(t), this;
  }
  get(t) {
    let n = t._zod.parent;
    if (n) {
      let o = { ...this.get(n) ?? {} };
      delete o.id;
      let r = { ...o, ...this._map.get(t) };
      return Object.keys(r).length ? r : void 0;
    }
    return this._map.get(t);
  }
  has(t) {
    return this._map.has(t);
  }
};
function Ko() {
  return new Wo();
}
l(Ko, "registry");
(Bm = globalThis).__zod_globalRegistry ?? (Bm.__zod_globalRegistry = Ko());
var be = globalThis.__zod_globalRegistry;

// node_modules/zod/v4/core/api.js
// @__NO_SIDE_EFFECTS__
function Mu(e, t) {
  return new e({
    type: "string",
    ...z(t)
  });
}
l(Mu, "_string");
// @__NO_SIDE_EFFECTS__
function Zu(e, t) {
  return new e({
    type: "string",
    coerce: !0,
    ...z(t)
  });
}
l(Zu, "_coercedString");
// @__NO_SIDE_EFFECTS__
function Ho(e, t) {
  return new e({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(Ho, "_email");
// @__NO_SIDE_EFFECTS__
function Mn(e, t) {
  return new e({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(Mn, "_guid");
// @__NO_SIDE_EFFECTS__
function Xo(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(Xo, "_uuid");
// @__NO_SIDE_EFFECTS__
function Yo(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...z(t)
  });
}
l(Yo, "_uuidv4");
// @__NO_SIDE_EFFECTS__
function Qo(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...z(t)
  });
}
l(Qo, "_uuidv6");
// @__NO_SIDE_EFFECTS__
function ei(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...z(t)
  });
}
l(ei, "_uuidv7");
// @__NO_SIDE_EFFECTS__
function Zn(e, t) {
  return new e({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(Zn, "_url");
// @__NO_SIDE_EFFECTS__
function ti(e, t) {
  return new e({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(ti, "_emoji");
// @__NO_SIDE_EFFECTS__
function ri(e, t) {
  return new e({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(ri, "_nanoid");
// @__NO_SIDE_EFFECTS__
function ni(e, t) {
  return new e({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(ni, "_cuid");
// @__NO_SIDE_EFFECTS__
function oi(e, t) {
  return new e({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(oi, "_cuid2");
// @__NO_SIDE_EFFECTS__
function ii(e, t) {
  return new e({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(ii, "_ulid");
// @__NO_SIDE_EFFECTS__
function ai(e, t) {
  return new e({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(ai, "_xid");
// @__NO_SIDE_EFFECTS__
function si(e, t) {
  return new e({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(si, "_ksuid");
// @__NO_SIDE_EFFECTS__
function li(e, t) {
  return new e({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(li, "_ipv4");
// @__NO_SIDE_EFFECTS__
function ui(e, t) {
  return new e({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(ui, "_ipv6");
// @__NO_SIDE_EFFECTS__
function Lu(e, t) {
  return new e({
    type: "string",
    format: "mac",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(Lu, "_mac");
// @__NO_SIDE_EFFECTS__
function ci(e, t) {
  return new e({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(ci, "_cidrv4");
// @__NO_SIDE_EFFECTS__
function di(e, t) {
  return new e({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(di, "_cidrv6");
// @__NO_SIDE_EFFECTS__
function pi(e, t) {
  return new e({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(pi, "_base64");
// @__NO_SIDE_EFFECTS__
function mi(e, t) {
  return new e({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(mi, "_base64url");
// @__NO_SIDE_EFFECTS__
function fi(e, t) {
  return new e({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(fi, "_e164");
// @__NO_SIDE_EFFECTS__
function gi(e, t) {
  return new e({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...z(t)
  });
}
l(gi, "_jwt");
var Fu = {
  Any: null,
  Minute: -1,
  Second: 0,
  Millisecond: 3,
  Microsecond: 6
};
// @__NO_SIDE_EFFECTS__
function Vu(e, t) {
  return new e({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...z(t)
  });
}
l(Vu, "_isoDateTime");
// @__NO_SIDE_EFFECTS__
function qu(e, t) {
  return new e({
    type: "string",
    format: "date",
    check: "string_format",
    ...z(t)
  });
}
l(qu, "_isoDate");
// @__NO_SIDE_EFFECTS__
function Ju(e, t) {
  return new e({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...z(t)
  });
}
l(Ju, "_isoTime");
// @__NO_SIDE_EFFECTS__
function Bu(e, t) {
  return new e({
    type: "string",
    format: "duration",
    check: "string_format",
    ...z(t)
  });
}
l(Bu, "_isoDuration");
// @__NO_SIDE_EFFECTS__
function Gu(e, t) {
  return new e({
    type: "number",
    checks: [],
    ...z(t)
  });
}
l(Gu, "_number");
// @__NO_SIDE_EFFECTS__
function Wu(e, t) {
  return new e({
    type: "number",
    coerce: !0,
    checks: [],
    ...z(t)
  });
}
l(Wu, "_coercedNumber");
// @__NO_SIDE_EFFECTS__
function Ku(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...z(t)
  });
}
l(Ku, "_int");
// @__NO_SIDE_EFFECTS__
function Hu(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "float32",
    ...z(t)
  });
}
l(Hu, "_float32");
// @__NO_SIDE_EFFECTS__
function Xu(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "float64",
    ...z(t)
  });
}
l(Xu, "_float64");
// @__NO_SIDE_EFFECTS__
function Yu(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "int32",
    ...z(t)
  });
}
l(Yu, "_int32");
// @__NO_SIDE_EFFECTS__
function Qu(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "uint32",
    ...z(t)
  });
}
l(Qu, "_uint32");
// @__NO_SIDE_EFFECTS__
function ec(e, t) {
  return new e({
    type: "boolean",
    ...z(t)
  });
}
l(ec, "_boolean");
// @__NO_SIDE_EFFECTS__
function tc(e, t) {
  return new e({
    type: "boolean",
    coerce: !0,
    ...z(t)
  });
}
l(tc, "_coercedBoolean");
// @__NO_SIDE_EFFECTS__
function rc(e, t) {
  return new e({
    type: "bigint",
    ...z(t)
  });
}
l(rc, "_bigint");
// @__NO_SIDE_EFFECTS__
function nc(e, t) {
  return new e({
    type: "bigint",
    coerce: !0,
    ...z(t)
  });
}
l(nc, "_coercedBigint");
// @__NO_SIDE_EFFECTS__
function oc(e, t) {
  return new e({
    type: "bigint",
    check: "bigint_format",
    abort: !1,
    format: "int64",
    ...z(t)
  });
}
l(oc, "_int64");
// @__NO_SIDE_EFFECTS__
function ic(e, t) {
  return new e({
    type: "bigint",
    check: "bigint_format",
    abort: !1,
    format: "uint64",
    ...z(t)
  });
}
l(ic, "_uint64");
// @__NO_SIDE_EFFECTS__
function ac(e, t) {
  return new e({
    type: "symbol",
    ...z(t)
  });
}
l(ac, "_symbol");
// @__NO_SIDE_EFFECTS__
function sc(e, t) {
  return new e({
    type: "undefined",
    ...z(t)
  });
}
l(sc, "_undefined");
// @__NO_SIDE_EFFECTS__
function lc(e, t) {
  return new e({
    type: "null",
    ...z(t)
  });
}
l(lc, "_null");
// @__NO_SIDE_EFFECTS__
function uc(e) {
  return new e({
    type: "any"
  });
}
l(uc, "_any");
// @__NO_SIDE_EFFECTS__
function cc(e) {
  return new e({
    type: "unknown"
  });
}
l(cc, "_unknown");
// @__NO_SIDE_EFFECTS__
function dc(e, t) {
  return new e({
    type: "never",
    ...z(t)
  });
}
l(dc, "_never");
// @__NO_SIDE_EFFECTS__
function pc(e, t) {
  return new e({
    type: "void",
    ...z(t)
  });
}
l(pc, "_void");
// @__NO_SIDE_EFFECTS__
function mc(e, t) {
  return new e({
    type: "date",
    ...z(t)
  });
}
l(mc, "_date");
// @__NO_SIDE_EFFECTS__
function fc(e, t) {
  return new e({
    type: "date",
    coerce: !0,
    ...z(t)
  });
}
l(fc, "_coercedDate");
// @__NO_SIDE_EFFECTS__
function gc(e, t) {
  return new e({
    type: "nan",
    ...z(t)
  });
}
l(gc, "_nan");
// @__NO_SIDE_EFFECTS__
function mt(e, t) {
  return new Do({
    check: "less_than",
    ...z(t),
    value: e,
    inclusive: !1
  });
}
l(mt, "_lt");
// @__NO_SIDE_EFFECTS__
function qe(e, t) {
  return new Do({
    check: "less_than",
    ...z(t),
    value: e,
    inclusive: !0
  });
}
l(qe, "_lte");
// @__NO_SIDE_EFFECTS__
function ft(e, t) {
  return new Uo({
    check: "greater_than",
    ...z(t),
    value: e,
    inclusive: !1
  });
}
l(ft, "_gt");
// @__NO_SIDE_EFFECTS__
function ze(e, t) {
  return new Uo({
    check: "greater_than",
    ...z(t),
    value: e,
    inclusive: !0
  });
}
l(ze, "_gte");
// @__NO_SIDE_EFFECTS__
function hi(e) {
  return /* @__PURE__ */ ft(0, e);
}
l(hi, "_positive");
// @__NO_SIDE_EFFECTS__
function vi(e) {
  return /* @__PURE__ */ mt(0, e);
}
l(vi, "_negative");
// @__NO_SIDE_EFFECTS__
function yi(e) {
  return /* @__PURE__ */ qe(0, e);
}
l(yi, "_nonpositive");
// @__NO_SIDE_EFFECTS__
function _i(e) {
  return /* @__PURE__ */ ze(0, e);
}
l(_i, "_nonnegative");
// @__NO_SIDE_EFFECTS__
function Zt(e, t) {
  return new hs({
    check: "multiple_of",
    ...z(t),
    value: e
  });
}
l(Zt, "_multipleOf");
// @__NO_SIDE_EFFECTS__
function Lt(e, t) {
  return new _s({
    check: "max_size",
    ...z(t),
    maximum: e
  });
}
l(Lt, "_maxSize");
// @__NO_SIDE_EFFECTS__
function gt(e, t) {
  return new bs({
    check: "min_size",
    ...z(t),
    minimum: e
  });
}
l(gt, "_minSize");
// @__NO_SIDE_EFFECTS__
function sr(e, t) {
  return new xs({
    check: "size_equals",
    ...z(t),
    size: e
  });
}
l(sr, "_size");
// @__NO_SIDE_EFFECTS__
function lr(e, t) {
  return new $s({
    check: "max_length",
    ...z(t),
    maximum: e
  });
}
l(lr, "_maxLength");
// @__NO_SIDE_EFFECTS__
function wt(e, t) {
  return new ws({
    check: "min_length",
    ...z(t),
    minimum: e
  });
}
l(wt, "_minLength");
// @__NO_SIDE_EFFECTS__
function ur(e, t) {
  return new ks({
    check: "length_equals",
    ...z(t),
    length: e
  });
}
l(ur, "_length");
// @__NO_SIDE_EFFECTS__
function Sr(e, t) {
  return new Is({
    check: "string_format",
    format: "regex",
    ...z(t),
    pattern: e
  });
}
l(Sr, "_regex");
// @__NO_SIDE_EFFECTS__
function Tr(e) {
  return new Ss({
    check: "string_format",
    format: "lowercase",
    ...z(e)
  });
}
l(Tr, "_lowercase");
// @__NO_SIDE_EFFECTS__
function zr(e) {
  return new Ts({
    check: "string_format",
    format: "uppercase",
    ...z(e)
  });
}
l(zr, "_uppercase");
// @__NO_SIDE_EFFECTS__
function Er(e, t) {
  return new zs({
    check: "string_format",
    format: "includes",
    ...z(t),
    includes: e
  });
}
l(Er, "_includes");
// @__NO_SIDE_EFFECTS__
function Or(e, t) {
  return new Es({
    check: "string_format",
    format: "starts_with",
    ...z(t),
    prefix: e
  });
}
l(Or, "_startsWith");
// @__NO_SIDE_EFFECTS__
function jr(e, t) {
  return new Os({
    check: "string_format",
    format: "ends_with",
    ...z(t),
    suffix: e
  });
}
l(jr, "_endsWith");
// @__NO_SIDE_EFFECTS__
function bi(e, t, n) {
  return new js({
    check: "property",
    property: e,
    schema: t,
    ...z(n)
  });
}
l(bi, "_property");
// @__NO_SIDE_EFFECTS__
function Pr(e, t) {
  return new Ps({
    check: "mime_type",
    mime: e,
    ...z(t)
  });
}
l(Pr, "_mime");
// @__NO_SIDE_EFFECTS__
function ot(e) {
  return new Ns({
    check: "overwrite",
    tx: e
  });
}
l(ot, "_overwrite");
// @__NO_SIDE_EFFECTS__
function Nr(e) {
  return /* @__PURE__ */ ot((t) => t.normalize(e));
}
l(Nr, "_normalize");
// @__NO_SIDE_EFFECTS__
function Ar() {
  return /* @__PURE__ */ ot((e) => e.trim());
}
l(Ar, "_trim");
// @__NO_SIDE_EFFECTS__
function Rr() {
  return /* @__PURE__ */ ot((e) => e.toLowerCase());
}
l(Rr, "_toLowerCase");
// @__NO_SIDE_EFFECTS__
function Cr() {
  return /* @__PURE__ */ ot((e) => e.toUpperCase());
}
l(Cr, "_toUpperCase");
// @__NO_SIDE_EFFECTS__
function Dr() {
  return /* @__PURE__ */ ot((e) => ja(e));
}
l(Dr, "_slugify");
// @__NO_SIDE_EFFECTS__
function hc(e, t, n) {
  return new e({
    type: "array",
    element: t,
    // get element() {
    //   return element;
    // },
    ...z(n)
  });
}
l(hc, "_array");
// @__NO_SIDE_EFFECTS__
function nx(e, t, n) {
  return new e({
    type: "union",
    options: t,
    ...z(n)
  });
}
l(nx, "_union");
function ox(e, t, n) {
  return new e({
    type: "union",
    options: t,
    inclusive: !1,
    ...z(n)
  });
}
l(ox, "_xor");
// @__NO_SIDE_EFFECTS__
function ix(e, t, n, o) {
  return new e({
    type: "union",
    options: n,
    discriminator: t,
    ...z(o)
  });
}
l(ix, "_discriminatedUnion");
// @__NO_SIDE_EFFECTS__
function ax(e, t, n) {
  return new e({
    type: "intersection",
    left: t,
    right: n
  });
}
l(ax, "_intersection");
// @__NO_SIDE_EFFECTS__
function sx(e, t, n, o) {
  let r = n instanceof L, i = r ? o : n, a = r ? n : null;
  return new e({
    type: "tuple",
    items: t,
    rest: a,
    ...z(i)
  });
}
l(sx, "_tuple");
// @__NO_SIDE_EFFECTS__
function lx(e, t, n, o) {
  return new e({
    type: "record",
    keyType: t,
    valueType: n,
    ...z(o)
  });
}
l(lx, "_record");
// @__NO_SIDE_EFFECTS__
function ux(e, t, n, o) {
  return new e({
    type: "map",
    keyType: t,
    valueType: n,
    ...z(o)
  });
}
l(ux, "_map");
// @__NO_SIDE_EFFECTS__
function cx(e, t, n) {
  return new e({
    type: "set",
    valueType: t,
    ...z(n)
  });
}
l(cx, "_set");
// @__NO_SIDE_EFFECTS__
function dx(e, t, n) {
  let o = Array.isArray(t) ? Object.fromEntries(t.map((r) => [r, r])) : t;
  return new e({
    type: "enum",
    entries: o,
    ...z(n)
  });
}
l(dx, "_enum");
// @__NO_SIDE_EFFECTS__
function px(e, t, n) {
  return new e({
    type: "enum",
    entries: t,
    ...z(n)
  });
}
l(px, "_nativeEnum");
// @__NO_SIDE_EFFECTS__
function mx(e, t, n) {
  return new e({
    type: "literal",
    values: Array.isArray(t) ? t : [t],
    ...z(n)
  });
}
l(mx, "_literal");
// @__NO_SIDE_EFFECTS__
function vc(e, t) {
  return new e({
    type: "file",
    ...z(t)
  });
}
l(vc, "_file");
// @__NO_SIDE_EFFECTS__
function fx(e, t) {
  return new e({
    type: "transform",
    transform: t
  });
}
l(fx, "_transform");
// @__NO_SIDE_EFFECTS__
function gx(e, t) {
  return new e({
    type: "optional",
    innerType: t
  });
}
l(gx, "_optional");
// @__NO_SIDE_EFFECTS__
function hx(e, t) {
  return new e({
    type: "nullable",
    innerType: t
  });
}
l(hx, "_nullable");
// @__NO_SIDE_EFFECTS__
function vx(e, t, n) {
  return new e({
    type: "default",
    innerType: t,
    get defaultValue() {
      return typeof n == "function" ? n() : Na(n);
    }
  });
}
l(vx, "_default");
// @__NO_SIDE_EFFECTS__
function yx(e, t, n) {
  return new e({
    type: "nonoptional",
    innerType: t,
    ...z(n)
  });
}
l(yx, "_nonoptional");
// @__NO_SIDE_EFFECTS__
function _x(e, t) {
  return new e({
    type: "success",
    innerType: t
  });
}
l(_x, "_success");
// @__NO_SIDE_EFFECTS__
function bx(e, t, n) {
  return new e({
    type: "catch",
    innerType: t,
    catchValue: typeof n == "function" ? n : () => n
  });
}
l(bx, "_catch");
// @__NO_SIDE_EFFECTS__
function xx(e, t, n) {
  return new e({
    type: "pipe",
    in: t,
    out: n
  });
}
l(xx, "_pipe");
// @__NO_SIDE_EFFECTS__
function $x(e, t) {
  return new e({
    type: "readonly",
    innerType: t
  });
}
l($x, "_readonly");
// @__NO_SIDE_EFFECTS__
function wx(e, t, n) {
  return new e({
    type: "template_literal",
    parts: t,
    ...z(n)
  });
}
l(wx, "_templateLiteral");
// @__NO_SIDE_EFFECTS__
function kx(e, t) {
  return new e({
    type: "lazy",
    getter: t
  });
}
l(kx, "_lazy");
// @__NO_SIDE_EFFECTS__
function Ix(e, t) {
  return new e({
    type: "promise",
    innerType: t
  });
}
l(Ix, "_promise");
// @__NO_SIDE_EFFECTS__
function yc(e, t, n) {
  let o = z(n);
  return o.abort ?? (o.abort = !0), new e({
    type: "custom",
    check: "custom",
    fn: t,
    ...o
  });
}
l(yc, "_custom");
// @__NO_SIDE_EFFECTS__
function _c(e, t, n) {
  return new e({
    type: "custom",
    check: "custom",
    fn: t,
    ...z(n)
  });
}
l(_c, "_refine");
// @__NO_SIDE_EFFECTS__
function bc(e) {
  let t = /* @__PURE__ */ Gm((n) => (n.addIssue = (o) => {
    if (typeof o == "string")
      n.issues.push(_r(o, n.value, t._zod.def));
    else {
      let r = o;
      r.fatal && (r.continue = !1), r.code ?? (r.code = "custom"), r.input ?? (r.input = n.value), r.inst ?? (r.inst = t), r.continue ?? (r.continue = !t._zod.def.abort), n.issues.push(_r(r));
    }
  }, e(n.value, n)));
  return t;
}
l(bc, "_superRefine");
// @__NO_SIDE_EFFECTS__
function Gm(e, t) {
  let n = new ie({
    check: "custom",
    ...z(t)
  });
  return n._zod.check = e, n;
}
l(Gm, "_check");
// @__NO_SIDE_EFFECTS__
function xc(e) {
  let t = new ie({ check: "describe" });
  return t._zod.onattach = [
    (n) => {
      let o = be.get(n) ?? {};
      be.add(n, { ...o, description: e });
    }
  ], t._zod.check = () => {
  }, t;
}
l(xc, "describe");
// @__NO_SIDE_EFFECTS__
function $c(e) {
  let t = new ie({ check: "meta" });
  return t._zod.onattach = [
    (n) => {
      let o = be.get(n) ?? {};
      be.add(n, { ...o, ...e });
    }
  ], t._zod.check = () => {
  }, t;
}
l($c, "meta");
// @__NO_SIDE_EFFECTS__
function wc(e, t) {
  let n = z(t), o = n.truthy ?? ["true", "1", "yes", "on", "y", "enabled"], r = n.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
  n.case !== "sensitive" && (o = o.map((g) => typeof g == "string" ? g.toLowerCase() : g), r = r.map((g) => typeof g == "string" ? g.toLowerCase() : g));
  let i = new Set(o), a = new Set(r), u = e.Codec ?? Nn, c = e.Boolean ?? jn, d = e.String ?? ar, p = new d({ type: "string", error: n.error }), m = new c({ type: "boolean", error: n.error }), v = new u({
    type: "pipe",
    in: p,
    out: m,
    transform: /* @__PURE__ */ l(((g, b) => {
      let x = g;
      return n.case !== "sensitive" && (x = x.toLowerCase()), i.has(x) ? !0 : a.has(x) ? !1 : (b.issues.push({
        code: "invalid_value",
        expected: "stringbool",
        values: [...i, ...a],
        input: b.value,
        inst: v,
        continue: !1
      }), {});
    }), "transform"),
    reverseTransform: /* @__PURE__ */ l(((g, b) => g === !0 ? o[0] || "true" : r[0] || "false"), "reverseTransform"),
    error: n.error
  });
  return v;
}
l(wc, "_stringbool");
// @__NO_SIDE_EFFECTS__
function Ur(e, t, n, o = {}) {
  let r = z(o), i = {
    ...z(o),
    check: "string_format",
    type: "string",
    format: t,
    fn: typeof n == "function" ? n : (u) => n.test(u),
    ...r
  };
  return n instanceof RegExp && (i.pattern = n), new e(i);
}
l(Ur, "_stringFormat");

// node_modules/zod/v4/core/to-json-schema.js
function Ft(e) {
  let t = e?.target ?? "draft-2020-12";
  return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
    processors: e.processors ?? {},
    metadataRegistry: e?.metadata ?? be,
    target: t,
    unrepresentable: e?.unrepresentable ?? "throw",
    override: e?.override ?? (() => {
    }),
    io: e?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    cycles: e?.cycles ?? "ref",
    reused: e?.reused ?? "inline",
    external: e?.external ?? void 0
  };
}
l(Ft, "initializeContext");
function ee(e, t, n = { path: [], schemaPath: [] }) {
  var o;
  let r = e._zod.def, i = t.seen.get(e);
  if (i)
    return i.count++, n.schemaPath.includes(e) && (i.cycle = n.path), i.schema;
  let a = { schema: {}, count: 1, cycle: void 0, path: n.path };
  t.seen.set(e, a);
  let u = e._zod.toJSONSchema?.();
  if (u)
    a.schema = u;
  else {
    let p = {
      ...n,
      schemaPath: [...n.schemaPath, e],
      path: n.path
    };
    if (e._zod.processJSONSchema)
      e._zod.processJSONSchema(t, a.schema, p);
    else {
      let v = a.schema, g = t.processors[r.type];
      if (!g)
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${r.type}`);
      g(e, t, v, p);
    }
    let m = e._zod.parent;
    m && (a.ref || (a.ref = m), ee(m, t, p), t.seen.get(m).isParent = !0);
  }
  let c = t.metadataRegistry.get(e);
  return c && Object.assign(a.schema, c), t.io === "input" && Ee(e) && (delete a.schema.examples, delete a.schema.default), t.io === "input" && a.schema._prefault && ((o = a.schema).default ?? (o.default = a.schema._prefault)), delete a.schema._prefault, t.seen.get(e).schema;
}
l(ee, "process");
function Vt(e, t) {
  let n = e.seen.get(t);
  if (!n)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  let o = /* @__PURE__ */ new Map();
  for (let a of e.seen.entries()) {
    let u = e.metadataRegistry.get(a[0])?.id;
    if (u) {
      let c = o.get(u);
      if (c && c !== a[0])
        throw new Error(`Duplicate schema id "${u}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      o.set(u, a[0]);
    }
  }
  let r = /* @__PURE__ */ l((a) => {
    let u = e.target === "draft-2020-12" ? "$defs" : "definitions";
    if (e.external) {
      let m = e.external.registry.get(a[0])?.id, v = e.external.uri ?? ((b) => b);
      if (m)
        return { ref: v(m) };
      let g = a[1].defId ?? a[1].schema.id ?? `schema${e.counter++}`;
      return a[1].defId = g, { defId: g, ref: `${v("__shared")}#/${u}/${g}` };
    }
    if (a[1] === n)
      return { ref: "#" };
    let d = `#/${u}/`, p = a[1].schema.id ?? `__schema${e.counter++}`;
    return { defId: p, ref: d + p };
  }, "makeURI"), i = /* @__PURE__ */ l((a) => {
    if (a[1].schema.$ref)
      return;
    let u = a[1], { ref: c, defId: d } = r(a);
    u.def = { ...u.schema }, d && (u.defId = d);
    let p = u.schema;
    for (let m in p)
      delete p[m];
    p.$ref = c;
  }, "extractToDef");
  if (e.cycles === "throw")
    for (let a of e.seen.entries()) {
      let u = a[1];
      if (u.cycle)
        throw new Error(`Cycle detected: #/${u.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
    }
  for (let a of e.seen.entries()) {
    let u = a[1];
    if (t === a[0]) {
      i(a);
      continue;
    }
    if (e.external) {
      let d = e.external.registry.get(a[0])?.id;
      if (t !== a[0] && d) {
        i(a);
        continue;
      }
    }
    if (e.metadataRegistry.get(a[0])?.id) {
      i(a);
      continue;
    }
    if (u.cycle) {
      i(a);
      continue;
    }
    if (u.count > 1 && e.reused === "ref") {
      i(a);
      continue;
    }
  }
}
l(Vt, "extractDefs");
function qt(e, t) {
  let n = e.seen.get(t);
  if (!n)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  let o = /* @__PURE__ */ l((a) => {
    let u = e.seen.get(a);
    if (u.ref === null)
      return;
    let c = u.def ?? u.schema, d = { ...c }, p = u.ref;
    if (u.ref = null, p) {
      o(p);
      let v = e.seen.get(p), g = v.schema;
      if (g.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (c.allOf = c.allOf ?? [], c.allOf.push(g)) : Object.assign(c, g), Object.assign(c, d), a._zod.parent === p)
        for (let x in c)
          x === "$ref" || x === "allOf" || x in d || delete c[x];
      if (g.$ref)
        for (let x in c)
          x === "$ref" || x === "allOf" || x in v.def && JSON.stringify(c[x]) === JSON.stringify(v.def[x]) && delete c[x];
    }
    let m = a._zod.parent;
    if (m && m !== p) {
      o(m);
      let v = e.seen.get(m);
      if (v?.schema.$ref && (c.$ref = v.schema.$ref, v.def))
        for (let g in c)
          g === "$ref" || g === "allOf" || g in v.def && JSON.stringify(c[g]) === JSON.stringify(v.def[g]) && delete c[g];
    }
    e.override({
      zodSchema: a,
      jsonSchema: c,
      path: u.path ?? []
    });
  }, "flattenRef");
  for (let a of [...e.seen.entries()].reverse())
    o(a[0]);
  let r = {};
  if (e.target === "draft-2020-12" ? r.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? r.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? r.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
    let a = e.external.registry.get(t)?.id;
    if (!a)
      throw new Error("Schema is missing an `id` property");
    r.$id = e.external.uri(a);
  }
  Object.assign(r, n.def ?? n.schema);
  let i = e.external?.defs ?? {};
  for (let a of e.seen.entries()) {
    let u = a[1];
    u.def && u.defId && (i[u.defId] = u.def);
  }
  e.external || Object.keys(i).length > 0 && (e.target === "draft-2020-12" ? r.$defs = i : r.definitions = i);
  try {
    let a = JSON.parse(JSON.stringify(r));
    return Object.defineProperty(a, "~standard", {
      value: {
        ...t["~standard"],
        jsonSchema: {
          input: Mr(t, "input", e.processors),
          output: Mr(t, "output", e.processors)
        }
      },
      enumerable: !1,
      writable: !1
    }), a;
  } catch {
    throw new Error("Error converting schema to JSON.");
  }
}
l(qt, "finalize");
function Ee(e, t) {
  let n = t ?? { seen: /* @__PURE__ */ new Set() };
  if (n.seen.has(e))
    return !1;
  n.seen.add(e);
  let o = e._zod.def;
  if (o.type === "transform")
    return !0;
  if (o.type === "array")
    return Ee(o.element, n);
  if (o.type === "set")
    return Ee(o.valueType, n);
  if (o.type === "lazy")
    return Ee(o.getter(), n);
  if (o.type === "promise" || o.type === "optional" || o.type === "nonoptional" || o.type === "nullable" || o.type === "readonly" || o.type === "default" || o.type === "prefault")
    return Ee(o.innerType, n);
  if (o.type === "intersection")
    return Ee(o.left, n) || Ee(o.right, n);
  if (o.type === "record" || o.type === "map")
    return Ee(o.keyType, n) || Ee(o.valueType, n);
  if (o.type === "pipe")
    return Ee(o.in, n) || Ee(o.out, n);
  if (o.type === "object") {
    for (let r in o.shape)
      if (Ee(o.shape[r], n))
        return !0;
    return !1;
  }
  if (o.type === "union") {
    for (let r of o.options)
      if (Ee(r, n))
        return !0;
    return !1;
  }
  if (o.type === "tuple") {
    for (let r of o.items)
      if (Ee(r, n))
        return !0;
    return !!(o.rest && Ee(o.rest, n));
  }
  return !1;
}
l(Ee, "isTransforming");
var kc = /* @__PURE__ */ l((e, t = {}) => (n) => {
  let o = Ft({ ...n, processors: t });
  return ee(e, o), Vt(o, e), qt(o, e);
}, "createToJSONSchemaMethod"), Mr = /* @__PURE__ */ l((e, t, n = {}) => (o) => {
  let { libraryOptions: r, target: i } = o ?? {}, a = Ft({ ...r ?? {}, target: i, io: t, processors: n });
  return ee(e, a), Vt(a, e), qt(a, e);
}, "createStandardJSONSchemaMethod");

// node_modules/zod/v4/core/json-schema-processors.js
var Sx = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
  // do not set
}, Ic = /* @__PURE__ */ l((e, t, n, o) => {
  let r = n;
  r.type = "string";
  let { minimum: i, maximum: a, format: u, patterns: c, contentEncoding: d } = e._zod.bag;
  if (typeof i == "number" && (r.minLength = i), typeof a == "number" && (r.maxLength = a), u && (r.format = Sx[u] ?? u, r.format === "" && delete r.format, u === "time" && delete r.format), d && (r.contentEncoding = d), c && c.size > 0) {
    let p = [...c];
    p.length === 1 ? r.pattern = p[0].source : p.length > 1 && (r.allOf = [
      ...p.map((m) => ({
        ...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
        pattern: m.source
      }))
    ]);
  }
}, "stringProcessor"), Sc = /* @__PURE__ */ l((e, t, n, o) => {
  let r = n, { minimum: i, maximum: a, format: u, multipleOf: c, exclusiveMaximum: d, exclusiveMinimum: p } = e._zod.bag;
  typeof u == "string" && u.includes("int") ? r.type = "integer" : r.type = "number", typeof p == "number" && (t.target === "draft-04" || t.target === "openapi-3.0" ? (r.minimum = p, r.exclusiveMinimum = !0) : r.exclusiveMinimum = p), typeof i == "number" && (r.minimum = i, typeof p == "number" && t.target !== "draft-04" && (p >= i ? delete r.minimum : delete r.exclusiveMinimum)), typeof d == "number" && (t.target === "draft-04" || t.target === "openapi-3.0" ? (r.maximum = d, r.exclusiveMaximum = !0) : r.exclusiveMaximum = d), typeof a == "number" && (r.maximum = a, typeof d == "number" && t.target !== "draft-04" && (d <= a ? delete r.maximum : delete r.exclusiveMaximum)), typeof c == "number" && (r.multipleOf = c);
}, "numberProcessor"), Tc = /* @__PURE__ */ l((e, t, n, o) => {
  n.type = "boolean";
}, "booleanProcessor"), zc = /* @__PURE__ */ l((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("BigInt cannot be represented in JSON Schema");
}, "bigintProcessor"), Ec = /* @__PURE__ */ l((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Symbols cannot be represented in JSON Schema");
}, "symbolProcessor"), Oc = /* @__PURE__ */ l((e, t, n, o) => {
  t.target === "openapi-3.0" ? (n.type = "string", n.nullable = !0, n.enum = [null]) : n.type = "null";
}, "nullProcessor"), jc = /* @__PURE__ */ l((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Undefined cannot be represented in JSON Schema");
}, "undefinedProcessor"), Pc = /* @__PURE__ */ l((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Void cannot be represented in JSON Schema");
}, "voidProcessor"), Nc = /* @__PURE__ */ l((e, t, n, o) => {
  n.not = {};
}, "neverProcessor"), Ac = /* @__PURE__ */ l((e, t, n, o) => {
}, "anyProcessor"), Rc = /* @__PURE__ */ l((e, t, n, o) => {
}, "unknownProcessor"), Cc = /* @__PURE__ */ l((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Date cannot be represented in JSON Schema");
}, "dateProcessor"), Dc = /* @__PURE__ */ l((e, t, n, o) => {
  let r = e._zod.def, i = bn(r.entries);
  i.every((a) => typeof a == "number") && (n.type = "number"), i.every((a) => typeof a == "string") && (n.type = "string"), n.enum = i;
}, "enumProcessor"), Uc = /* @__PURE__ */ l((e, t, n, o) => {
  let r = e._zod.def, i = [];
  for (let a of r.values)
    if (a === void 0) {
      if (t.unrepresentable === "throw")
        throw new Error("Literal `undefined` cannot be represented in JSON Schema");
    } else if (typeof a == "bigint") {
      if (t.unrepresentable === "throw")
        throw new Error("BigInt literals cannot be represented in JSON Schema");
      i.push(Number(a));
    } else
      i.push(a);
  if (i.length !== 0)
    if (i.length === 1) {
      let a = i[0];
      n.type = a === null ? "null" : typeof a, t.target === "draft-04" || t.target === "openapi-3.0" ? n.enum = [a] : n.const = a;
    } else
      i.every((a) => typeof a == "number") && (n.type = "number"), i.every((a) => typeof a == "string") && (n.type = "string"), i.every((a) => typeof a == "boolean") && (n.type = "boolean"), i.every((a) => a === null) && (n.type = "null"), n.enum = i;
}, "literalProcessor"), Mc = /* @__PURE__ */ l((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("NaN cannot be represented in JSON Schema");
}, "nanProcessor"), Zc = /* @__PURE__ */ l((e, t, n, o) => {
  let r = n, i = e._zod.pattern;
  if (!i)
    throw new Error("Pattern not found in template literal");
  r.type = "string", r.pattern = i.source;
}, "templateLiteralProcessor"), Lc = /* @__PURE__ */ l((e, t, n, o) => {
  let r = n, i = {
    type: "string",
    format: "binary",
    contentEncoding: "binary"
  }, { minimum: a, maximum: u, mime: c } = e._zod.bag;
  a !== void 0 && (i.minLength = a), u !== void 0 && (i.maxLength = u), c ? c.length === 1 ? (i.contentMediaType = c[0], Object.assign(r, i)) : (Object.assign(r, i), r.anyOf = c.map((d) => ({ contentMediaType: d }))) : Object.assign(r, i);
}, "fileProcessor"), Fc = /* @__PURE__ */ l((e, t, n, o) => {
  n.type = "boolean";
}, "successProcessor"), Vc = /* @__PURE__ */ l((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Custom types cannot be represented in JSON Schema");
}, "customProcessor"), qc = /* @__PURE__ */ l((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Function types cannot be represented in JSON Schema");
}, "functionProcessor"), Jc = /* @__PURE__ */ l((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Transforms cannot be represented in JSON Schema");
}, "transformProcessor"), Bc = /* @__PURE__ */ l((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Map cannot be represented in JSON Schema");
}, "mapProcessor"), Gc = /* @__PURE__ */ l((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Set cannot be represented in JSON Schema");
}, "setProcessor"), Wc = /* @__PURE__ */ l((e, t, n, o) => {
  let r = n, i = e._zod.def, { minimum: a, maximum: u } = e._zod.bag;
  typeof a == "number" && (r.minItems = a), typeof u == "number" && (r.maxItems = u), r.type = "array", r.items = ee(i.element, t, { ...o, path: [...o.path, "items"] });
}, "arrayProcessor"), Kc = /* @__PURE__ */ l((e, t, n, o) => {
  let r = n, i = e._zod.def;
  r.type = "object", r.properties = {};
  let a = i.shape;
  for (let d in a)
    r.properties[d] = ee(a[d], t, {
      ...o,
      path: [...o.path, "properties", d]
    });
  let u = new Set(Object.keys(a)), c = new Set([...u].filter((d) => {
    let p = i.shape[d]._zod;
    return t.io === "input" ? p.optin === void 0 : p.optout === void 0;
  }));
  c.size > 0 && (r.required = Array.from(c)), i.catchall?._zod.def.type === "never" ? r.additionalProperties = !1 : i.catchall ? i.catchall && (r.additionalProperties = ee(i.catchall, t, {
    ...o,
    path: [...o.path, "additionalProperties"]
  })) : t.io === "output" && (r.additionalProperties = !1);
}, "objectProcessor"), $i = /* @__PURE__ */ l((e, t, n, o) => {
  let r = e._zod.def, i = r.inclusive === !1, a = r.options.map((u, c) => ee(u, t, {
    ...o,
    path: [...o.path, i ? "oneOf" : "anyOf", c]
  }));
  i ? n.oneOf = a : n.anyOf = a;
}, "unionProcessor"), Hc = /* @__PURE__ */ l((e, t, n, o) => {
  let r = e._zod.def, i = ee(r.left, t, {
    ...o,
    path: [...o.path, "allOf", 0]
  }), a = ee(r.right, t, {
    ...o,
    path: [...o.path, "allOf", 1]
  }), u = /* @__PURE__ */ l((d) => "allOf" in d && Object.keys(d).length === 1, "isSimpleIntersection"), c = [
    ...u(i) ? i.allOf : [i],
    ...u(a) ? a.allOf : [a]
  ];
  n.allOf = c;
}, "intersectionProcessor"), Xc = /* @__PURE__ */ l((e, t, n, o) => {
  let r = n, i = e._zod.def;
  r.type = "array";
  let a = t.target === "draft-2020-12" ? "prefixItems" : "items", u = t.target === "draft-2020-12" || t.target === "openapi-3.0" ? "items" : "additionalItems", c = i.items.map((v, g) => ee(v, t, {
    ...o,
    path: [...o.path, a, g]
  })), d = i.rest ? ee(i.rest, t, {
    ...o,
    path: [...o.path, u, ...t.target === "openapi-3.0" ? [i.items.length] : []]
  }) : null;
  t.target === "draft-2020-12" ? (r.prefixItems = c, d && (r.items = d)) : t.target === "openapi-3.0" ? (r.items = {
    anyOf: c
  }, d && r.items.anyOf.push(d), r.minItems = c.length, d || (r.maxItems = c.length)) : (r.items = c, d && (r.additionalItems = d));
  let { minimum: p, maximum: m } = e._zod.bag;
  typeof p == "number" && (r.minItems = p), typeof m == "number" && (r.maxItems = m);
}, "tupleProcessor"), Yc = /* @__PURE__ */ l((e, t, n, o) => {
  let r = n, i = e._zod.def;
  r.type = "object";
  let a = i.keyType, c = a._zod.bag?.patterns;
  if (i.mode === "loose" && c && c.size > 0) {
    let p = ee(i.valueType, t, {
      ...o,
      path: [...o.path, "patternProperties", "*"]
    });
    r.patternProperties = {};
    for (let m of c)
      r.patternProperties[m.source] = p;
  } else
    (t.target === "draft-07" || t.target === "draft-2020-12") && (r.propertyNames = ee(i.keyType, t, {
      ...o,
      path: [...o.path, "propertyNames"]
    })), r.additionalProperties = ee(i.valueType, t, {
      ...o,
      path: [...o.path, "additionalProperties"]
    });
  let d = a._zod.values;
  if (d) {
    let p = [...d].filter((m) => typeof m == "string" || typeof m == "number");
    p.length > 0 && (r.required = p);
  }
}, "recordProcessor"), Qc = /* @__PURE__ */ l((e, t, n, o) => {
  let r = e._zod.def, i = ee(r.innerType, t, o), a = t.seen.get(e);
  t.target === "openapi-3.0" ? (a.ref = r.innerType, n.nullable = !0) : n.anyOf = [i, { type: "null" }];
}, "nullableProcessor"), ed = /* @__PURE__ */ l((e, t, n, o) => {
  let r = e._zod.def;
  ee(r.innerType, t, o);
  let i = t.seen.get(e);
  i.ref = r.innerType;
}, "nonoptionalProcessor"), td = /* @__PURE__ */ l((e, t, n, o) => {
  let r = e._zod.def;
  ee(r.innerType, t, o);
  let i = t.seen.get(e);
  i.ref = r.innerType, n.default = JSON.parse(JSON.stringify(r.defaultValue));
}, "defaultProcessor"), rd = /* @__PURE__ */ l((e, t, n, o) => {
  let r = e._zod.def;
  ee(r.innerType, t, o);
  let i = t.seen.get(e);
  i.ref = r.innerType, t.io === "input" && (n._prefault = JSON.parse(JSON.stringify(r.defaultValue)));
}, "prefaultProcessor"), nd = /* @__PURE__ */ l((e, t, n, o) => {
  let r = e._zod.def;
  ee(r.innerType, t, o);
  let i = t.seen.get(e);
  i.ref = r.innerType;
  let a;
  try {
    a = r.catchValue(void 0);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  n.default = a;
}, "catchProcessor"), od = /* @__PURE__ */ l((e, t, n, o) => {
  let r = e._zod.def, i = t.io === "input" ? r.in._zod.def.type === "transform" ? r.out : r.in : r.out;
  ee(i, t, o);
  let a = t.seen.get(e);
  a.ref = i;
}, "pipeProcessor"), id = /* @__PURE__ */ l((e, t, n, o) => {
  let r = e._zod.def;
  ee(r.innerType, t, o);
  let i = t.seen.get(e);
  i.ref = r.innerType, n.readOnly = !0;
}, "readonlyProcessor"), ad = /* @__PURE__ */ l((e, t, n, o) => {
  let r = e._zod.def;
  ee(r.innerType, t, o);
  let i = t.seen.get(e);
  i.ref = r.innerType;
}, "promiseProcessor"), wi = /* @__PURE__ */ l((e, t, n, o) => {
  let r = e._zod.def;
  ee(r.innerType, t, o);
  let i = t.seen.get(e);
  i.ref = r.innerType;
}, "optionalProcessor"), sd = /* @__PURE__ */ l((e, t, n, o) => {
  let r = e._zod.innerType;
  ee(r, t, o);
  let i = t.seen.get(e);
  i.ref = r;
}, "lazyProcessor"), xi = {
  string: Ic,
  number: Sc,
  boolean: Tc,
  bigint: zc,
  symbol: Ec,
  null: Oc,
  undefined: jc,
  void: Pc,
  never: Nc,
  any: Ac,
  unknown: Rc,
  date: Cc,
  enum: Dc,
  literal: Uc,
  nan: Mc,
  template_literal: Zc,
  file: Lc,
  success: Fc,
  custom: Vc,
  function: qc,
  transform: Jc,
  map: Bc,
  set: Gc,
  array: Wc,
  object: Kc,
  union: $i,
  intersection: Hc,
  tuple: Xc,
  record: Yc,
  nullable: Qc,
  nonoptional: ed,
  default: td,
  prefault: rd,
  catch: nd,
  pipe: od,
  readonly: id,
  promise: ad,
  optional: wi,
  lazy: sd
};
function Zr(e, t) {
  if ("_idmap" in e) {
    let o = e, r = Ft({ ...t, processors: xi }), i = {};
    for (let c of o._idmap.entries()) {
      let [d, p] = c;
      ee(p, r);
    }
    let a = {}, u = {
      registry: o,
      uri: t?.uri,
      defs: i
    };
    r.external = u;
    for (let c of o._idmap.entries()) {
      let [d, p] = c;
      Vt(r, p), a[d] = qt(r, p);
    }
    if (Object.keys(i).length > 0) {
      let c = r.target === "draft-2020-12" ? "$defs" : "definitions";
      a.__shared = {
        [c]: i
      };
    }
    return { schemas: a };
  }
  let n = Ft({ ...t, processors: xi });
  return ee(e, n), Vt(n, e), qt(n, e);
}
l(Zr, "toJSONSchema");

// node_modules/zod/v4/core/json-schema-generator.js
var ki = class {
  static {
    l(this, "JSONSchemaGenerator");
  }
  /** @deprecated Access via ctx instead */
  get metadataRegistry() {
    return this.ctx.metadataRegistry;
  }
  /** @deprecated Access via ctx instead */
  get target() {
    return this.ctx.target;
  }
  /** @deprecated Access via ctx instead */
  get unrepresentable() {
    return this.ctx.unrepresentable;
  }
  /** @deprecated Access via ctx instead */
  get override() {
    return this.ctx.override;
  }
  /** @deprecated Access via ctx instead */
  get io() {
    return this.ctx.io;
  }
  /** @deprecated Access via ctx instead */
  get counter() {
    return this.ctx.counter;
  }
  set counter(t) {
    this.ctx.counter = t;
  }
  /** @deprecated Access via ctx instead */
  get seen() {
    return this.ctx.seen;
  }
  constructor(t) {
    let n = t?.target ?? "draft-2020-12";
    n === "draft-4" && (n = "draft-04"), n === "draft-7" && (n = "draft-07"), this.ctx = Ft({
      processors: xi,
      target: n,
      ...t?.metadata && { metadata: t.metadata },
      ...t?.unrepresentable && { unrepresentable: t.unrepresentable },
      ...t?.override && { override: t.override },
      ...t?.io && { io: t.io }
    });
  }
  /**
   * Process a schema to prepare it for JSON Schema generation.
   * This must be called before emit().
   */
  process(t, n = { path: [], schemaPath: [] }) {
    return ee(t, this.ctx, n);
  }
  /**
   * Emit the final JSON Schema after processing.
   * Must call process() first.
   */
  emit(t, n) {
    n && (n.cycles && (this.ctx.cycles = n.cycles), n.reused && (this.ctx.reused = n.reused), n.external && (this.ctx.external = n.external)), Vt(this.ctx, t);
    let o = qt(this.ctx, t), { "~standard": r, ...i } = o;
    return i;
  }
};

// node_modules/zod/v4/core/json-schema.js
var Wm = {};

// node_modules/zod/v4/classic/schemas.js
var Ln = {};
xt(Ln, {
  ZodAny: () => Od,
  ZodArray: () => Ad,
  ZodBase64: () => Ji,
  ZodBase64URL: () => Bi,
  ZodBigInt: () => Gr,
  ZodBigIntFormat: () => Ki,
  ZodBoolean: () => Br,
  ZodCIDRv4: () => Vi,
  ZodCIDRv6: () => qi,
  ZodCUID: () => Ci,
  ZodCUID2: () => Di,
  ZodCatch: () => rp,
  ZodCodec: () => na,
  ZodCustom: () => Qn,
  ZodCustomStringFormat: () => qr,
  ZodDate: () => Wn,
  ZodDefault: () => Hd,
  ZodDiscriminatedUnion: () => Cd,
  ZodE164: () => Gi,
  ZodEmail: () => Ni,
  ZodEmoji: () => Ai,
  ZodEnum: () => Fr,
  ZodExactOptional: () => Gd,
  ZodFile: () => Jd,
  ZodFunction: () => dp,
  ZodGUID: () => Vn,
  ZodIPv4: () => Li,
  ZodIPv6: () => Fi,
  ZodIntersection: () => Dd,
  ZodJWT: () => Wi,
  ZodKSUID: () => Zi,
  ZodLazy: () => lp,
  ZodLiteral: () => qd,
  ZodMAC: () => wd,
  ZodMap: () => Fd,
  ZodNaN: () => op,
  ZodNanoID: () => Ri,
  ZodNever: () => Pd,
  ZodNonOptional: () => ta,
  ZodNull: () => zd,
  ZodNullable: () => Kd,
  ZodNumber: () => Jr,
  ZodNumberFormat: () => dr,
  ZodObject: () => Hn,
  ZodOptional: () => ea,
  ZodPipe: () => ra,
  ZodPrefault: () => Yd,
  ZodPromise: () => cp,
  ZodReadonly: () => ip,
  ZodRecord: () => Yn,
  ZodSet: () => Vd,
  ZodString: () => Vr,
  ZodStringFormat: () => oe,
  ZodSuccess: () => tp,
  ZodSymbol: () => Sd,
  ZodTemplateLiteral: () => sp,
  ZodTransform: () => Bd,
  ZodTuple: () => Md,
  ZodType: () => F,
  ZodULID: () => Ui,
  ZodURL: () => Gn,
  ZodUUID: () => ht,
  ZodUndefined: () => Td,
  ZodUnion: () => Xn,
  ZodUnknown: () => jd,
  ZodVoid: () => Nd,
  ZodXID: () => Mi,
  ZodXor: () => Rd,
  _ZodString: () => Pi,
  _default: () => Xd,
  _function: () => rg,
  any: () => Af,
  array: () => Kn,
  base64: () => vf,
  base64url: () => yf,
  bigint: () => Ef,
  boolean: () => Id,
  catch: () => np,
  check: () => ng,
  cidrv4: () => gf,
  cidrv6: () => hf,
  codec: () => Qf,
  cuid: () => sf,
  cuid2: () => lf,
  custom: () => og,
  date: () => Cf,
  describe: () => ig,
  discriminatedUnion: () => Ff,
  e164: () => _f,
  email: () => Hm,
  emoji: () => of,
  enum: () => Yi,
  exactOptional: () => Wd,
  file: () => Kf,
  float32: () => If,
  float64: () => Sf,
  function: () => rg,
  guid: () => Xm,
  hash: () => kf,
  hex: () => wf,
  hostname: () => $f,
  httpUrl: () => nf,
  instanceof: () => sg,
  int: () => ji,
  int32: () => Tf,
  int64: () => Of,
  intersection: () => Ud,
  ipv4: () => pf,
  ipv6: () => ff,
  json: () => ug,
  jwt: () => bf,
  keyof: () => Df,
  ksuid: () => df,
  lazy: () => up,
  literal: () => Wf,
  looseObject: () => Zf,
  looseRecord: () => qf,
  mac: () => mf,
  map: () => Jf,
  meta: () => ag,
  nan: () => Yf,
  nanoid: () => af,
  nativeEnum: () => Gf,
  never: () => Hi,
  nonoptional: () => ep,
  null: () => Ed,
  nullable: () => Jn,
  nullish: () => Hf,
  number: () => kd,
  object: () => Uf,
  optional: () => qn,
  partialRecord: () => Vf,
  pipe: () => Bn,
  prefault: () => Qd,
  preprocess: () => cg,
  promise: () => tg,
  readonly: () => ap,
  record: () => Ld,
  refine: () => pp,
  set: () => Bf,
  strictObject: () => Mf,
  string: () => Oi,
  stringFormat: () => xf,
  stringbool: () => lg,
  success: () => Xf,
  superRefine: () => mp,
  symbol: () => Pf,
  templateLiteral: () => eg,
  transform: () => Qi,
  tuple: () => Zd,
  uint32: () => zf,
  uint64: () => jf,
  ulid: () => uf,
  undefined: () => Nf,
  union: () => Xi,
  unknown: () => cr,
  url: () => rf,
  uuid: () => Ym,
  uuidv4: () => Qm,
  uuidv6: () => ef,
  uuidv7: () => tf,
  void: () => Rf,
  xid: () => cf,
  xor: () => Lf
});

// node_modules/zod/v4/classic/checks.js
var Ii = {};
xt(Ii, {
  endsWith: () => jr,
  gt: () => ft,
  gte: () => ze,
  includes: () => Er,
  length: () => ur,
  lowercase: () => Tr,
  lt: () => mt,
  lte: () => qe,
  maxLength: () => lr,
  maxSize: () => Lt,
  mime: () => Pr,
  minLength: () => wt,
  minSize: () => gt,
  multipleOf: () => Zt,
  negative: () => vi,
  nonnegative: () => _i,
  nonpositive: () => yi,
  normalize: () => Nr,
  overwrite: () => ot,
  positive: () => hi,
  property: () => bi,
  regex: () => Sr,
  size: () => sr,
  slugify: () => Dr,
  startsWith: () => Or,
  toLowerCase: () => Rr,
  toUpperCase: () => Cr,
  trim: () => Ar,
  uppercase: () => zr
});

// node_modules/zod/v4/classic/iso.js
var Lr = {};
xt(Lr, {
  ZodISODate: () => Ti,
  ZodISODateTime: () => Si,
  ZodISODuration: () => Ei,
  ZodISOTime: () => zi,
  date: () => ud,
  datetime: () => ld,
  duration: () => dd,
  time: () => cd
});
var Si = /* @__PURE__ */ h("ZodISODateTime", (e, t) => {
  Gs.init(e, t), oe.init(e, t);
});
function ld(e) {
  return Vu(Si, e);
}
l(ld, "datetime");
var Ti = /* @__PURE__ */ h("ZodISODate", (e, t) => {
  Ws.init(e, t), oe.init(e, t);
});
function ud(e) {
  return qu(Ti, e);
}
l(ud, "date");
var zi = /* @__PURE__ */ h("ZodISOTime", (e, t) => {
  Ks.init(e, t), oe.init(e, t);
});
function cd(e) {
  return Ju(zi, e);
}
l(cd, "time");
var Ei = /* @__PURE__ */ h("ZodISODuration", (e, t) => {
  Hs.init(e, t), oe.init(e, t);
});
function dd(e) {
  return Bu(Ei, e);
}
l(dd, "duration");

// node_modules/zod/v4/classic/errors.js
var Km = /* @__PURE__ */ l((e, t) => {
  In.init(e, t), e.name = "ZodError", Object.defineProperties(e, {
    format: {
      value: /* @__PURE__ */ l((n) => Tn(e, n), "value")
      // enumerable: false,
    },
    flatten: {
      value: /* @__PURE__ */ l((n) => Sn(e, n), "value")
      // enumerable: false,
    },
    addIssue: {
      value: /* @__PURE__ */ l((n) => {
        e.issues.push(n), e.message = JSON.stringify(e.issues, vr, 2);
      }, "value")
      // enumerable: false,
    },
    addIssues: {
      value: /* @__PURE__ */ l((n) => {
        e.issues.push(...n), e.message = JSON.stringify(e.issues, vr, 2);
      }, "value")
      // enumerable: false,
    },
    isEmpty: {
      get() {
        return e.issues.length === 0;
      }
      // enumerable: false,
    }
  });
}, "initializer"), zx = h("ZodError", Km), Me = h("ZodError", Km, {
  Parent: Error
});

// node_modules/zod/v4/classic/parse.js
var pd = /* @__PURE__ */ br(Me), md = /* @__PURE__ */ xr(Me), fd = /* @__PURE__ */ $r(Me), Fn = /* @__PURE__ */ wr(Me), gd = /* @__PURE__ */ To(Me), hd = /* @__PURE__ */ zo(Me), vd = /* @__PURE__ */ Eo(Me), yd = /* @__PURE__ */ Oo(Me), _d = /* @__PURE__ */ jo(Me), bd = /* @__PURE__ */ Po(Me), xd = /* @__PURE__ */ No(Me), $d = /* @__PURE__ */ Ao(Me);

// node_modules/zod/v4/classic/schemas.js
var F = /* @__PURE__ */ h("ZodType", (e, t) => (L.init(e, t), Object.assign(e["~standard"], {
  jsonSchema: {
    input: Mr(e, "input"),
    output: Mr(e, "output")
  }
}), e.toJSONSchema = kc(e, {}), e.def = t, e.type = t.type, Object.defineProperty(e, "_def", { value: t }), e.check = (...n) => e.clone(S.mergeDefs(t, {
  checks: [
    ...t.checks ?? [],
    ...n.map((o) => typeof o == "function" ? { _zod: { check: o, def: { check: "custom" }, onattach: [] } } : o)
  ]
}), {
  parent: !0
}), e.with = e.check, e.clone = (n, o) => Te(e, n, o), e.brand = () => e, e.register = ((n, o) => (n.add(e, o), e)), e.parse = (n, o) => pd(e, n, o, { callee: e.parse }), e.safeParse = (n, o) => fd(e, n, o), e.parseAsync = async (n, o) => md(e, n, o, { callee: e.parseAsync }), e.safeParseAsync = async (n, o) => Fn(e, n, o), e.spa = e.safeParseAsync, e.encode = (n, o) => gd(e, n, o), e.decode = (n, o) => hd(e, n, o), e.encodeAsync = async (n, o) => vd(e, n, o), e.decodeAsync = async (n, o) => yd(e, n, o), e.safeEncode = (n, o) => _d(e, n, o), e.safeDecode = (n, o) => bd(e, n, o), e.safeEncodeAsync = async (n, o) => xd(e, n, o), e.safeDecodeAsync = async (n, o) => $d(e, n, o), e.refine = (n, o) => e.check(pp(n, o)), e.superRefine = (n) => e.check(mp(n)), e.overwrite = (n) => e.check(ot(n)), e.optional = () => qn(e), e.exactOptional = () => Wd(e), e.nullable = () => Jn(e), e.nullish = () => qn(Jn(e)), e.nonoptional = (n) => ep(e, n), e.array = () => Kn(e), e.or = (n) => Xi([e, n]), e.and = (n) => Ud(e, n), e.transform = (n) => Bn(e, Qi(n)), e.default = (n) => Xd(e, n), e.prefault = (n) => Qd(e, n), e.catch = (n) => np(e, n), e.pipe = (n) => Bn(e, n), e.readonly = () => ap(e), e.describe = (n) => {
  let o = e.clone();
  return be.add(o, { description: n }), o;
}, Object.defineProperty(e, "description", {
  get() {
    return be.get(e)?.description;
  },
  configurable: !0
}), e.meta = (...n) => {
  if (n.length === 0)
    return be.get(e);
  let o = e.clone();
  return be.add(o, n[0]), o;
}, e.isOptional = () => e.safeParse(void 0).success, e.isNullable = () => e.safeParse(null).success, e.apply = (n) => n(e), e)), Pi = /* @__PURE__ */ h("_ZodString", (e, t) => {
  ar.init(e, t), F.init(e, t), e._zod.processJSONSchema = (o, r, i) => Ic(e, o, r, i);
  let n = e._zod.bag;
  e.format = n.format ?? null, e.minLength = n.minimum ?? null, e.maxLength = n.maximum ?? null, e.regex = (...o) => e.check(Sr(...o)), e.includes = (...o) => e.check(Er(...o)), e.startsWith = (...o) => e.check(Or(...o)), e.endsWith = (...o) => e.check(jr(...o)), e.min = (...o) => e.check(wt(...o)), e.max = (...o) => e.check(lr(...o)), e.length = (...o) => e.check(ur(...o)), e.nonempty = (...o) => e.check(wt(1, ...o)), e.lowercase = (o) => e.check(Tr(o)), e.uppercase = (o) => e.check(zr(o)), e.trim = () => e.check(Ar()), e.normalize = (...o) => e.check(Nr(...o)), e.toLowerCase = () => e.check(Rr()), e.toUpperCase = () => e.check(Cr()), e.slugify = () => e.check(Dr());
}), Vr = /* @__PURE__ */ h("ZodString", (e, t) => {
  ar.init(e, t), Pi.init(e, t), e.email = (n) => e.check(Ho(Ni, n)), e.url = (n) => e.check(Zn(Gn, n)), e.jwt = (n) => e.check(gi(Wi, n)), e.emoji = (n) => e.check(ti(Ai, n)), e.guid = (n) => e.check(Mn(Vn, n)), e.uuid = (n) => e.check(Xo(ht, n)), e.uuidv4 = (n) => e.check(Yo(ht, n)), e.uuidv6 = (n) => e.check(Qo(ht, n)), e.uuidv7 = (n) => e.check(ei(ht, n)), e.nanoid = (n) => e.check(ri(Ri, n)), e.guid = (n) => e.check(Mn(Vn, n)), e.cuid = (n) => e.check(ni(Ci, n)), e.cuid2 = (n) => e.check(oi(Di, n)), e.ulid = (n) => e.check(ii(Ui, n)), e.base64 = (n) => e.check(pi(Ji, n)), e.base64url = (n) => e.check(mi(Bi, n)), e.xid = (n) => e.check(ai(Mi, n)), e.ksuid = (n) => e.check(si(Zi, n)), e.ipv4 = (n) => e.check(li(Li, n)), e.ipv6 = (n) => e.check(ui(Fi, n)), e.cidrv4 = (n) => e.check(ci(Vi, n)), e.cidrv6 = (n) => e.check(di(qi, n)), e.e164 = (n) => e.check(fi(Gi, n)), e.datetime = (n) => e.check(ld(n)), e.date = (n) => e.check(ud(n)), e.time = (n) => e.check(cd(n)), e.duration = (n) => e.check(dd(n));
});
function Oi(e) {
  return Mu(Vr, e);
}
l(Oi, "string");
var oe = /* @__PURE__ */ h("ZodStringFormat", (e, t) => {
  ne.init(e, t), Pi.init(e, t);
}), Ni = /* @__PURE__ */ h("ZodEmail", (e, t) => {
  Us.init(e, t), oe.init(e, t);
});
function Hm(e) {
  return Ho(Ni, e);
}
l(Hm, "email");
var Vn = /* @__PURE__ */ h("ZodGUID", (e, t) => {
  Cs.init(e, t), oe.init(e, t);
});
function Xm(e) {
  return Mn(Vn, e);
}
l(Xm, "guid");
var ht = /* @__PURE__ */ h("ZodUUID", (e, t) => {
  Ds.init(e, t), oe.init(e, t);
});
function Ym(e) {
  return Xo(ht, e);
}
l(Ym, "uuid");
function Qm(e) {
  return Yo(ht, e);
}
l(Qm, "uuidv4");
function ef(e) {
  return Qo(ht, e);
}
l(ef, "uuidv6");
function tf(e) {
  return ei(ht, e);
}
l(tf, "uuidv7");
var Gn = /* @__PURE__ */ h("ZodURL", (e, t) => {
  Ms.init(e, t), oe.init(e, t);
});
function rf(e) {
  return Zn(Gn, e);
}
l(rf, "url");
function nf(e) {
  return Zn(Gn, {
    protocol: /^https?$/,
    hostname: Ye.domain,
    ...S.normalizeParams(e)
  });
}
l(nf, "httpUrl");
var Ai = /* @__PURE__ */ h("ZodEmoji", (e, t) => {
  Zs.init(e, t), oe.init(e, t);
});
function of(e) {
  return ti(Ai, e);
}
l(of, "emoji");
var Ri = /* @__PURE__ */ h("ZodNanoID", (e, t) => {
  Ls.init(e, t), oe.init(e, t);
});
function af(e) {
  return ri(Ri, e);
}
l(af, "nanoid");
var Ci = /* @__PURE__ */ h("ZodCUID", (e, t) => {
  Fs.init(e, t), oe.init(e, t);
});
function sf(e) {
  return ni(Ci, e);
}
l(sf, "cuid");
var Di = /* @__PURE__ */ h("ZodCUID2", (e, t) => {
  Vs.init(e, t), oe.init(e, t);
});
function lf(e) {
  return oi(Di, e);
}
l(lf, "cuid2");
var Ui = /* @__PURE__ */ h("ZodULID", (e, t) => {
  qs.init(e, t), oe.init(e, t);
});
function uf(e) {
  return ii(Ui, e);
}
l(uf, "ulid");
var Mi = /* @__PURE__ */ h("ZodXID", (e, t) => {
  Js.init(e, t), oe.init(e, t);
});
function cf(e) {
  return ai(Mi, e);
}
l(cf, "xid");
var Zi = /* @__PURE__ */ h("ZodKSUID", (e, t) => {
  Bs.init(e, t), oe.init(e, t);
});
function df(e) {
  return si(Zi, e);
}
l(df, "ksuid");
var Li = /* @__PURE__ */ h("ZodIPv4", (e, t) => {
  Xs.init(e, t), oe.init(e, t);
});
function pf(e) {
  return li(Li, e);
}
l(pf, "ipv4");
var wd = /* @__PURE__ */ h("ZodMAC", (e, t) => {
  Qs.init(e, t), oe.init(e, t);
});
function mf(e) {
  return Lu(wd, e);
}
l(mf, "mac");
var Fi = /* @__PURE__ */ h("ZodIPv6", (e, t) => {
  Ys.init(e, t), oe.init(e, t);
});
function ff(e) {
  return ui(Fi, e);
}
l(ff, "ipv6");
var Vi = /* @__PURE__ */ h("ZodCIDRv4", (e, t) => {
  el.init(e, t), oe.init(e, t);
});
function gf(e) {
  return ci(Vi, e);
}
l(gf, "cidrv4");
var qi = /* @__PURE__ */ h("ZodCIDRv6", (e, t) => {
  tl.init(e, t), oe.init(e, t);
});
function hf(e) {
  return di(qi, e);
}
l(hf, "cidrv6");
var Ji = /* @__PURE__ */ h("ZodBase64", (e, t) => {
  nl.init(e, t), oe.init(e, t);
});
function vf(e) {
  return pi(Ji, e);
}
l(vf, "base64");
var Bi = /* @__PURE__ */ h("ZodBase64URL", (e, t) => {
  ol.init(e, t), oe.init(e, t);
});
function yf(e) {
  return mi(Bi, e);
}
l(yf, "base64url");
var Gi = /* @__PURE__ */ h("ZodE164", (e, t) => {
  il.init(e, t), oe.init(e, t);
});
function _f(e) {
  return fi(Gi, e);
}
l(_f, "e164");
var Wi = /* @__PURE__ */ h("ZodJWT", (e, t) => {
  al.init(e, t), oe.init(e, t);
});
function bf(e) {
  return gi(Wi, e);
}
l(bf, "jwt");
var qr = /* @__PURE__ */ h("ZodCustomStringFormat", (e, t) => {
  sl.init(e, t), oe.init(e, t);
});
function xf(e, t, n = {}) {
  return Ur(qr, e, t, n);
}
l(xf, "stringFormat");
function $f(e) {
  return Ur(qr, "hostname", Ye.hostname, e);
}
l($f, "hostname");
function wf(e) {
  return Ur(qr, "hex", Ye.hex, e);
}
l(wf, "hex");
function kf(e, t) {
  let n = t?.enc ?? "hex", o = `${e}_${n}`, r = Ye[o];
  if (!r)
    throw new Error(`Unrecognized hash format: ${o}`);
  return Ur(qr, o, r, t);
}
l(kf, "hash");
var Jr = /* @__PURE__ */ h("ZodNumber", (e, t) => {
  qo.init(e, t), F.init(e, t), e._zod.processJSONSchema = (o, r, i) => Sc(e, o, r, i), e.gt = (o, r) => e.check(ft(o, r)), e.gte = (o, r) => e.check(ze(o, r)), e.min = (o, r) => e.check(ze(o, r)), e.lt = (o, r) => e.check(mt(o, r)), e.lte = (o, r) => e.check(qe(o, r)), e.max = (o, r) => e.check(qe(o, r)), e.int = (o) => e.check(ji(o)), e.safe = (o) => e.check(ji(o)), e.positive = (o) => e.check(ft(0, o)), e.nonnegative = (o) => e.check(ze(0, o)), e.negative = (o) => e.check(mt(0, o)), e.nonpositive = (o) => e.check(qe(0, o)), e.multipleOf = (o, r) => e.check(Zt(o, r)), e.step = (o, r) => e.check(Zt(o, r)), e.finite = () => e;
  let n = e._zod.bag;
  e.minValue = Math.max(n.minimum ?? Number.NEGATIVE_INFINITY, n.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null, e.maxValue = Math.min(n.maximum ?? Number.POSITIVE_INFINITY, n.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null, e.isInt = (n.format ?? "").includes("int") || Number.isSafeInteger(n.multipleOf ?? 0.5), e.isFinite = !0, e.format = n.format ?? null;
});
function kd(e) {
  return Gu(Jr, e);
}
l(kd, "number");
var dr = /* @__PURE__ */ h("ZodNumberFormat", (e, t) => {
  ll.init(e, t), Jr.init(e, t);
});
function ji(e) {
  return Ku(dr, e);
}
l(ji, "int");
function If(e) {
  return Hu(dr, e);
}
l(If, "float32");
function Sf(e) {
  return Xu(dr, e);
}
l(Sf, "float64");
function Tf(e) {
  return Yu(dr, e);
}
l(Tf, "int32");
function zf(e) {
  return Qu(dr, e);
}
l(zf, "uint32");
var Br = /* @__PURE__ */ h("ZodBoolean", (e, t) => {
  jn.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Tc(e, n, o, r);
});
function Id(e) {
  return ec(Br, e);
}
l(Id, "boolean");
var Gr = /* @__PURE__ */ h("ZodBigInt", (e, t) => {
  Jo.init(e, t), F.init(e, t), e._zod.processJSONSchema = (o, r, i) => zc(e, o, r, i), e.gte = (o, r) => e.check(ze(o, r)), e.min = (o, r) => e.check(ze(o, r)), e.gt = (o, r) => e.check(ft(o, r)), e.gte = (o, r) => e.check(ze(o, r)), e.min = (o, r) => e.check(ze(o, r)), e.lt = (o, r) => e.check(mt(o, r)), e.lte = (o, r) => e.check(qe(o, r)), e.max = (o, r) => e.check(qe(o, r)), e.positive = (o) => e.check(ft(BigInt(0), o)), e.negative = (o) => e.check(mt(BigInt(0), o)), e.nonpositive = (o) => e.check(qe(BigInt(0), o)), e.nonnegative = (o) => e.check(ze(BigInt(0), o)), e.multipleOf = (o, r) => e.check(Zt(o, r));
  let n = e._zod.bag;
  e.minValue = n.minimum ?? null, e.maxValue = n.maximum ?? null, e.format = n.format ?? null;
});
function Ef(e) {
  return rc(Gr, e);
}
l(Ef, "bigint");
var Ki = /* @__PURE__ */ h("ZodBigIntFormat", (e, t) => {
  ul.init(e, t), Gr.init(e, t);
});
function Of(e) {
  return oc(Ki, e);
}
l(Of, "int64");
function jf(e) {
  return ic(Ki, e);
}
l(jf, "uint64");
var Sd = /* @__PURE__ */ h("ZodSymbol", (e, t) => {
  cl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Ec(e, n, o, r);
});
function Pf(e) {
  return ac(Sd, e);
}
l(Pf, "symbol");
var Td = /* @__PURE__ */ h("ZodUndefined", (e, t) => {
  dl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => jc(e, n, o, r);
});
function Nf(e) {
  return sc(Td, e);
}
l(Nf, "_undefined");
var zd = /* @__PURE__ */ h("ZodNull", (e, t) => {
  pl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Oc(e, n, o, r);
});
function Ed(e) {
  return lc(zd, e);
}
l(Ed, "_null");
var Od = /* @__PURE__ */ h("ZodAny", (e, t) => {
  ml.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Ac(e, n, o, r);
});
function Af() {
  return uc(Od);
}
l(Af, "any");
var jd = /* @__PURE__ */ h("ZodUnknown", (e, t) => {
  fl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Rc(e, n, o, r);
});
function cr() {
  return cc(jd);
}
l(cr, "unknown");
var Pd = /* @__PURE__ */ h("ZodNever", (e, t) => {
  gl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Nc(e, n, o, r);
});
function Hi(e) {
  return dc(Pd, e);
}
l(Hi, "never");
var Nd = /* @__PURE__ */ h("ZodVoid", (e, t) => {
  hl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Pc(e, n, o, r);
});
function Rf(e) {
  return pc(Nd, e);
}
l(Rf, "_void");
var Wn = /* @__PURE__ */ h("ZodDate", (e, t) => {
  vl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (o, r, i) => Cc(e, o, r, i), e.min = (o, r) => e.check(ze(o, r)), e.max = (o, r) => e.check(qe(o, r));
  let n = e._zod.bag;
  e.minDate = n.minimum ? new Date(n.minimum) : null, e.maxDate = n.maximum ? new Date(n.maximum) : null;
});
function Cf(e) {
  return mc(Wn, e);
}
l(Cf, "date");
var Ad = /* @__PURE__ */ h("ZodArray", (e, t) => {
  yl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Wc(e, n, o, r), e.element = t.element, e.min = (n, o) => e.check(wt(n, o)), e.nonempty = (n) => e.check(wt(1, n)), e.max = (n, o) => e.check(lr(n, o)), e.length = (n, o) => e.check(ur(n, o)), e.unwrap = () => e.element;
});
function Kn(e, t) {
  return hc(Ad, e, t);
}
l(Kn, "array");
function Df(e) {
  let t = e._zod.def.shape;
  return Yi(Object.keys(t));
}
l(Df, "keyof");
var Hn = /* @__PURE__ */ h("ZodObject", (e, t) => {
  _l.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Kc(e, n, o, r), S.defineLazy(e, "shape", () => t.shape), e.keyof = () => Yi(Object.keys(e._zod.def.shape)), e.catchall = (n) => e.clone({ ...e._zod.def, catchall: n }), e.passthrough = () => e.clone({ ...e._zod.def, catchall: cr() }), e.loose = () => e.clone({ ...e._zod.def, catchall: cr() }), e.strict = () => e.clone({ ...e._zod.def, catchall: Hi() }), e.strip = () => e.clone({ ...e._zod.def, catchall: void 0 }), e.extend = (n) => S.extend(e, n), e.safeExtend = (n) => S.safeExtend(e, n), e.merge = (n) => S.merge(e, n), e.pick = (n) => S.pick(e, n), e.omit = (n) => S.omit(e, n), e.partial = (...n) => S.partial(ea, e, n[0]), e.required = (...n) => S.required(ta, e, n[0]);
});
function Uf(e, t) {
  let n = {
    type: "object",
    shape: e ?? {},
    ...S.normalizeParams(t)
  };
  return new Hn(n);
}
l(Uf, "object");
function Mf(e, t) {
  return new Hn({
    type: "object",
    shape: e,
    catchall: Hi(),
    ...S.normalizeParams(t)
  });
}
l(Mf, "strictObject");
function Zf(e, t) {
  return new Hn({
    type: "object",
    shape: e,
    catchall: cr(),
    ...S.normalizeParams(t)
  });
}
l(Zf, "looseObject");
var Xn = /* @__PURE__ */ h("ZodUnion", (e, t) => {
  Pn.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => $i(e, n, o, r), e.options = t.options;
});
function Xi(e, t) {
  return new Xn({
    type: "union",
    options: e,
    ...S.normalizeParams(t)
  });
}
l(Xi, "union");
var Rd = /* @__PURE__ */ h("ZodXor", (e, t) => {
  Xn.init(e, t), bl.init(e, t), e._zod.processJSONSchema = (n, o, r) => $i(e, n, o, r), e.options = t.options;
});
function Lf(e, t) {
  return new Rd({
    type: "union",
    options: e,
    inclusive: !1,
    ...S.normalizeParams(t)
  });
}
l(Lf, "xor");
var Cd = /* @__PURE__ */ h("ZodDiscriminatedUnion", (e, t) => {
  Xn.init(e, t), xl.init(e, t);
});
function Ff(e, t, n) {
  return new Cd({
    type: "union",
    options: t,
    discriminator: e,
    ...S.normalizeParams(n)
  });
}
l(Ff, "discriminatedUnion");
var Dd = /* @__PURE__ */ h("ZodIntersection", (e, t) => {
  $l.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Hc(e, n, o, r);
});
function Ud(e, t) {
  return new Dd({
    type: "intersection",
    left: e,
    right: t
  });
}
l(Ud, "intersection");
var Md = /* @__PURE__ */ h("ZodTuple", (e, t) => {
  Bo.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Xc(e, n, o, r), e.rest = (n) => e.clone({
    ...e._zod.def,
    rest: n
  });
});
function Zd(e, t, n) {
  let o = t instanceof L, r = o ? n : t, i = o ? t : null;
  return new Md({
    type: "tuple",
    items: e,
    rest: i,
    ...S.normalizeParams(r)
  });
}
l(Zd, "tuple");
var Yn = /* @__PURE__ */ h("ZodRecord", (e, t) => {
  wl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Yc(e, n, o, r), e.keyType = t.keyType, e.valueType = t.valueType;
});
function Ld(e, t, n) {
  return new Yn({
    type: "record",
    keyType: e,
    valueType: t,
    ...S.normalizeParams(n)
  });
}
l(Ld, "record");
function Vf(e, t, n) {
  let o = Te(e);
  return o._zod.values = void 0, new Yn({
    type: "record",
    keyType: o,
    valueType: t,
    ...S.normalizeParams(n)
  });
}
l(Vf, "partialRecord");
function qf(e, t, n) {
  return new Yn({
    type: "record",
    keyType: e,
    valueType: t,
    mode: "loose",
    ...S.normalizeParams(n)
  });
}
l(qf, "looseRecord");
var Fd = /* @__PURE__ */ h("ZodMap", (e, t) => {
  kl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Bc(e, n, o, r), e.keyType = t.keyType, e.valueType = t.valueType, e.min = (...n) => e.check(gt(...n)), e.nonempty = (n) => e.check(gt(1, n)), e.max = (...n) => e.check(Lt(...n)), e.size = (...n) => e.check(sr(...n));
});
function Jf(e, t, n) {
  return new Fd({
    type: "map",
    keyType: e,
    valueType: t,
    ...S.normalizeParams(n)
  });
}
l(Jf, "map");
var Vd = /* @__PURE__ */ h("ZodSet", (e, t) => {
  Il.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Gc(e, n, o, r), e.min = (...n) => e.check(gt(...n)), e.nonempty = (n) => e.check(gt(1, n)), e.max = (...n) => e.check(Lt(...n)), e.size = (...n) => e.check(sr(...n));
});
function Bf(e, t) {
  return new Vd({
    type: "set",
    valueType: e,
    ...S.normalizeParams(t)
  });
}
l(Bf, "set");
var Fr = /* @__PURE__ */ h("ZodEnum", (e, t) => {
  Sl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (o, r, i) => Dc(e, o, r, i), e.enum = t.entries, e.options = Object.values(t.entries);
  let n = new Set(Object.keys(t.entries));
  e.extract = (o, r) => {
    let i = {};
    for (let a of o)
      if (n.has(a))
        i[a] = t.entries[a];
      else
        throw new Error(`Key ${a} not found in enum`);
    return new Fr({
      ...t,
      checks: [],
      ...S.normalizeParams(r),
      entries: i
    });
  }, e.exclude = (o, r) => {
    let i = { ...t.entries };
    for (let a of o)
      if (n.has(a))
        delete i[a];
      else
        throw new Error(`Key ${a} not found in enum`);
    return new Fr({
      ...t,
      checks: [],
      ...S.normalizeParams(r),
      entries: i
    });
  };
});
function Yi(e, t) {
  let n = Array.isArray(e) ? Object.fromEntries(e.map((o) => [o, o])) : e;
  return new Fr({
    type: "enum",
    entries: n,
    ...S.normalizeParams(t)
  });
}
l(Yi, "_enum");
function Gf(e, t) {
  return new Fr({
    type: "enum",
    entries: e,
    ...S.normalizeParams(t)
  });
}
l(Gf, "nativeEnum");
var qd = /* @__PURE__ */ h("ZodLiteral", (e, t) => {
  Tl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Uc(e, n, o, r), e.values = new Set(t.values), Object.defineProperty(e, "value", {
    get() {
      if (t.values.length > 1)
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      return t.values[0];
    }
  });
});
function Wf(e, t) {
  return new qd({
    type: "literal",
    values: Array.isArray(e) ? e : [e],
    ...S.normalizeParams(t)
  });
}
l(Wf, "literal");
var Jd = /* @__PURE__ */ h("ZodFile", (e, t) => {
  zl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Lc(e, n, o, r), e.min = (n, o) => e.check(gt(n, o)), e.max = (n, o) => e.check(Lt(n, o)), e.mime = (n, o) => e.check(Pr(Array.isArray(n) ? n : [n], o));
});
function Kf(e) {
  return vc(Jd, e);
}
l(Kf, "file");
var Bd = /* @__PURE__ */ h("ZodTransform", (e, t) => {
  El.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Jc(e, n, o, r), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      throw new Rt(e.constructor.name);
    n.addIssue = (i) => {
      if (typeof i == "string")
        n.issues.push(S.issue(i, n.value, t));
      else {
        let a = i;
        a.fatal && (a.continue = !1), a.code ?? (a.code = "custom"), a.input ?? (a.input = n.value), a.inst ?? (a.inst = e), n.issues.push(S.issue(a));
      }
    };
    let r = t.transform(n.value, n);
    return r instanceof Promise ? r.then((i) => (n.value = i, n)) : (n.value = r, n);
  };
});
function Qi(e) {
  return new Bd({
    type: "transform",
    transform: e
  });
}
l(Qi, "transform");
var ea = /* @__PURE__ */ h("ZodOptional", (e, t) => {
  Go.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => wi(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function qn(e) {
  return new ea({
    type: "optional",
    innerType: e
  });
}
l(qn, "optional");
var Gd = /* @__PURE__ */ h("ZodExactOptional", (e, t) => {
  Ol.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => wi(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function Wd(e) {
  return new Gd({
    type: "optional",
    innerType: e
  });
}
l(Wd, "exactOptional");
var Kd = /* @__PURE__ */ h("ZodNullable", (e, t) => {
  jl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Qc(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function Jn(e) {
  return new Kd({
    type: "nullable",
    innerType: e
  });
}
l(Jn, "nullable");
function Hf(e) {
  return qn(Jn(e));
}
l(Hf, "nullish");
var Hd = /* @__PURE__ */ h("ZodDefault", (e, t) => {
  Pl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => td(e, n, o, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function Xd(e, t) {
  return new Hd({
    type: "default",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : S.shallowClone(t);
    }
  });
}
l(Xd, "_default");
var Yd = /* @__PURE__ */ h("ZodPrefault", (e, t) => {
  Nl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => rd(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function Qd(e, t) {
  return new Yd({
    type: "prefault",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : S.shallowClone(t);
    }
  });
}
l(Qd, "prefault");
var ta = /* @__PURE__ */ h("ZodNonOptional", (e, t) => {
  Al.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => ed(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function ep(e, t) {
  return new ta({
    type: "nonoptional",
    innerType: e,
    ...S.normalizeParams(t)
  });
}
l(ep, "nonoptional");
var tp = /* @__PURE__ */ h("ZodSuccess", (e, t) => {
  Rl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Fc(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function Xf(e) {
  return new tp({
    type: "success",
    innerType: e
  });
}
l(Xf, "success");
var rp = /* @__PURE__ */ h("ZodCatch", (e, t) => {
  Cl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => nd(e, n, o, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function np(e, t) {
  return new rp({
    type: "catch",
    innerType: e,
    catchValue: typeof t == "function" ? t : () => t
  });
}
l(np, "_catch");
var op = /* @__PURE__ */ h("ZodNaN", (e, t) => {
  Dl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Mc(e, n, o, r);
});
function Yf(e) {
  return gc(op, e);
}
l(Yf, "nan");
var ra = /* @__PURE__ */ h("ZodPipe", (e, t) => {
  Ul.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => od(e, n, o, r), e.in = t.in, e.out = t.out;
});
function Bn(e, t) {
  return new ra({
    type: "pipe",
    in: e,
    out: t
    // ...util.normalizeParams(params),
  });
}
l(Bn, "pipe");
var na = /* @__PURE__ */ h("ZodCodec", (e, t) => {
  ra.init(e, t), Nn.init(e, t);
});
function Qf(e, t, n) {
  return new na({
    type: "pipe",
    in: e,
    out: t,
    transform: n.decode,
    reverseTransform: n.encode
  });
}
l(Qf, "codec");
var ip = /* @__PURE__ */ h("ZodReadonly", (e, t) => {
  Ml.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => id(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function ap(e) {
  return new ip({
    type: "readonly",
    innerType: e
  });
}
l(ap, "readonly");
var sp = /* @__PURE__ */ h("ZodTemplateLiteral", (e, t) => {
  Zl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Zc(e, n, o, r);
});
function eg(e, t) {
  return new sp({
    type: "template_literal",
    parts: e,
    ...S.normalizeParams(t)
  });
}
l(eg, "templateLiteral");
var lp = /* @__PURE__ */ h("ZodLazy", (e, t) => {
  Vl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => sd(e, n, o, r), e.unwrap = () => e._zod.def.getter();
});
function up(e) {
  return new lp({
    type: "lazy",
    getter: e
  });
}
l(up, "lazy");
var cp = /* @__PURE__ */ h("ZodPromise", (e, t) => {
  Fl.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => ad(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function tg(e) {
  return new cp({
    type: "promise",
    innerType: e
  });
}
l(tg, "promise");
var dp = /* @__PURE__ */ h("ZodFunction", (e, t) => {
  Ll.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => qc(e, n, o, r);
});
function rg(e) {
  return new dp({
    type: "function",
    input: Array.isArray(e?.input) ? Zd(e?.input) : e?.input ?? Kn(cr()),
    output: e?.output ?? cr()
  });
}
l(rg, "_function");
var Qn = /* @__PURE__ */ h("ZodCustom", (e, t) => {
  ql.init(e, t), F.init(e, t), e._zod.processJSONSchema = (n, o, r) => Vc(e, n, o, r);
});
function ng(e) {
  let t = new ie({
    check: "custom"
    // ...util.normalizeParams(params),
  });
  return t._zod.check = e, t;
}
l(ng, "check");
function og(e, t) {
  return yc(Qn, e ?? (() => !0), t);
}
l(og, "custom");
function pp(e, t = {}) {
  return _c(Qn, e, t);
}
l(pp, "refine");
function mp(e) {
  return bc(e);
}
l(mp, "superRefine");
var ig = xc, ag = $c;
function sg(e, t = {}) {
  let n = new Qn({
    type: "custom",
    check: "custom",
    fn: /* @__PURE__ */ l((o) => o instanceof e, "fn"),
    abort: !0,
    ...S.normalizeParams(t)
  });
  return n._zod.bag.Class = e, n._zod.check = (o) => {
    o.value instanceof e || o.issues.push({
      code: "invalid_type",
      expected: e.name,
      input: o.value,
      inst: n,
      path: [...n._zod.def.path ?? []]
    });
  }, n;
}
l(sg, "_instanceof");
var lg = /* @__PURE__ */ l((...e) => wc({
  Codec: na,
  Boolean: Br,
  String: Vr
}, ...e), "stringbool");
function ug(e) {
  let t = up(() => Xi([Oi(e), kd(), Id(), Ed(), Kn(t), Ld(Oi(), t)]));
  return t;
}
l(ug, "json");
function cg(e, t) {
  return Bn(Qi(e), t);
}
l(cg, "preprocess");

// node_modules/zod/v4/classic/compat.js
var Ox = {
  invalid_type: "invalid_type",
  too_big: "too_big",
  too_small: "too_small",
  invalid_format: "invalid_format",
  not_multiple_of: "not_multiple_of",
  unrecognized_keys: "unrecognized_keys",
  invalid_union: "invalid_union",
  invalid_key: "invalid_key",
  invalid_element: "invalid_element",
  invalid_value: "invalid_value",
  custom: "custom"
};
function jx(e) {
  de({
    customError: e
  });
}
l(jx, "setErrorMap");
function Px() {
  return de().customError;
}
l(Px, "getErrorMap");
var fp;
fp || (fp = {});

// node_modules/zod/v4/classic/from-json-schema.js
var j = {
  ...Ln,
  ...Ii,
  iso: Lr
}, Nx = /* @__PURE__ */ new Set([
  // Schema identification
  "$schema",
  "$ref",
  "$defs",
  "definitions",
  // Core schema keywords
  "$id",
  "id",
  "$comment",
  "$anchor",
  "$vocabulary",
  "$dynamicRef",
  "$dynamicAnchor",
  // Type
  "type",
  "enum",
  "const",
  // Composition
  "anyOf",
  "oneOf",
  "allOf",
  "not",
  // Object
  "properties",
  "required",
  "additionalProperties",
  "patternProperties",
  "propertyNames",
  "minProperties",
  "maxProperties",
  // Array
  "items",
  "prefixItems",
  "additionalItems",
  "minItems",
  "maxItems",
  "uniqueItems",
  "contains",
  "minContains",
  "maxContains",
  // String
  "minLength",
  "maxLength",
  "pattern",
  "format",
  // Number
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "multipleOf",
  // Already handled metadata
  "description",
  "default",
  // Content
  "contentEncoding",
  "contentMediaType",
  "contentSchema",
  // Unsupported (error-throwing)
  "unevaluatedItems",
  "unevaluatedProperties",
  "if",
  "then",
  "else",
  "dependentSchemas",
  "dependentRequired",
  // OpenAPI
  "nullable",
  "readOnly"
]);
function Ax(e, t) {
  let n = e.$schema;
  return n === "https://json-schema.org/draft/2020-12/schema" ? "draft-2020-12" : n === "http://json-schema.org/draft-07/schema#" ? "draft-7" : n === "http://json-schema.org/draft-04/schema#" ? "draft-4" : t ?? "draft-2020-12";
}
l(Ax, "detectVersion");
function Rx(e, t) {
  if (!e.startsWith("#"))
    throw new Error("External $ref is not supported, only local refs (#/...) are allowed");
  let n = e.slice(1).split("/").filter(Boolean);
  if (n.length === 0)
    return t.rootSchema;
  let o = t.version === "draft-2020-12" ? "$defs" : "definitions";
  if (n[0] === o) {
    let r = n[1];
    if (!r || !t.defs[r])
      throw new Error(`Reference not found: ${e}`);
    return t.defs[r];
  }
  throw new Error(`Reference not found: ${e}`);
}
l(Rx, "resolveRef");
function dg(e, t) {
  if (e.not !== void 0) {
    if (typeof e.not == "object" && Object.keys(e.not).length === 0)
      return j.never();
    throw new Error("not is not supported in Zod (except { not: {} } for never)");
  }
  if (e.unevaluatedItems !== void 0)
    throw new Error("unevaluatedItems is not supported");
  if (e.unevaluatedProperties !== void 0)
    throw new Error("unevaluatedProperties is not supported");
  if (e.if !== void 0 || e.then !== void 0 || e.else !== void 0)
    throw new Error("Conditional schemas (if/then/else) are not supported");
  if (e.dependentSchemas !== void 0 || e.dependentRequired !== void 0)
    throw new Error("dependentSchemas and dependentRequired are not supported");
  if (e.$ref) {
    let r = e.$ref;
    if (t.refs.has(r))
      return t.refs.get(r);
    if (t.processing.has(r))
      return j.lazy(() => {
        if (!t.refs.has(r))
          throw new Error(`Circular reference not resolved: ${r}`);
        return t.refs.get(r);
      });
    t.processing.add(r);
    let i = Rx(r, t), a = $e(i, t);
    return t.refs.set(r, a), t.processing.delete(r), a;
  }
  if (e.enum !== void 0) {
    let r = e.enum;
    if (t.version === "openapi-3.0" && e.nullable === !0 && r.length === 1 && r[0] === null)
      return j.null();
    if (r.length === 0)
      return j.never();
    if (r.length === 1)
      return j.literal(r[0]);
    if (r.every((a) => typeof a == "string"))
      return j.enum(r);
    let i = r.map((a) => j.literal(a));
    return i.length < 2 ? i[0] : j.union([i[0], i[1], ...i.slice(2)]);
  }
  if (e.const !== void 0)
    return j.literal(e.const);
  let n = e.type;
  if (Array.isArray(n)) {
    let r = n.map((i) => {
      let a = { ...e, type: i };
      return dg(a, t);
    });
    return r.length === 0 ? j.never() : r.length === 1 ? r[0] : j.union(r);
  }
  if (!n)
    return j.any();
  let o;
  switch (n) {
    case "string": {
      let r = j.string();
      if (e.format) {
        let i = e.format;
        i === "email" ? r = r.check(j.email()) : i === "uri" || i === "uri-reference" ? r = r.check(j.url()) : i === "uuid" || i === "guid" ? r = r.check(j.uuid()) : i === "date-time" ? r = r.check(j.iso.datetime()) : i === "date" ? r = r.check(j.iso.date()) : i === "time" ? r = r.check(j.iso.time()) : i === "duration" ? r = r.check(j.iso.duration()) : i === "ipv4" ? r = r.check(j.ipv4()) : i === "ipv6" ? r = r.check(j.ipv6()) : i === "mac" ? r = r.check(j.mac()) : i === "cidr" ? r = r.check(j.cidrv4()) : i === "cidr-v6" ? r = r.check(j.cidrv6()) : i === "base64" ? r = r.check(j.base64()) : i === "base64url" ? r = r.check(j.base64url()) : i === "e164" ? r = r.check(j.e164()) : i === "jwt" ? r = r.check(j.jwt()) : i === "emoji" ? r = r.check(j.emoji()) : i === "nanoid" ? r = r.check(j.nanoid()) : i === "cuid" ? r = r.check(j.cuid()) : i === "cuid2" ? r = r.check(j.cuid2()) : i === "ulid" ? r = r.check(j.ulid()) : i === "xid" ? r = r.check(j.xid()) : i === "ksuid" && (r = r.check(j.ksuid()));
      }
      typeof e.minLength == "number" && (r = r.min(e.minLength)), typeof e.maxLength == "number" && (r = r.max(e.maxLength)), e.pattern && (r = r.regex(new RegExp(e.pattern))), o = r;
      break;
    }
    case "number":
    case "integer": {
      let r = n === "integer" ? j.number().int() : j.number();
      typeof e.minimum == "number" && (r = r.min(e.minimum)), typeof e.maximum == "number" && (r = r.max(e.maximum)), typeof e.exclusiveMinimum == "number" ? r = r.gt(e.exclusiveMinimum) : e.exclusiveMinimum === !0 && typeof e.minimum == "number" && (r = r.gt(e.minimum)), typeof e.exclusiveMaximum == "number" ? r = r.lt(e.exclusiveMaximum) : e.exclusiveMaximum === !0 && typeof e.maximum == "number" && (r = r.lt(e.maximum)), typeof e.multipleOf == "number" && (r = r.multipleOf(e.multipleOf)), o = r;
      break;
    }
    case "boolean": {
      o = j.boolean();
      break;
    }
    case "null": {
      o = j.null();
      break;
    }
    case "object": {
      let r = {}, i = e.properties || {}, a = new Set(e.required || []);
      for (let [c, d] of Object.entries(i)) {
        let p = $e(d, t);
        r[c] = a.has(c) ? p : p.optional();
      }
      if (e.propertyNames) {
        let c = $e(e.propertyNames, t), d = e.additionalProperties && typeof e.additionalProperties == "object" ? $e(e.additionalProperties, t) : j.any();
        if (Object.keys(r).length === 0) {
          o = j.record(c, d);
          break;
        }
        let p = j.object(r).passthrough(), m = j.looseRecord(c, d);
        o = j.intersection(p, m);
        break;
      }
      if (e.patternProperties) {
        let c = e.patternProperties, d = Object.keys(c), p = [];
        for (let v of d) {
          let g = $e(c[v], t), b = j.string().regex(new RegExp(v));
          p.push(j.looseRecord(b, g));
        }
        let m = [];
        if (Object.keys(r).length > 0 && m.push(j.object(r).passthrough()), m.push(...p), m.length === 0)
          o = j.object({}).passthrough();
        else if (m.length === 1)
          o = m[0];
        else {
          let v = j.intersection(m[0], m[1]);
          for (let g = 2; g < m.length; g++)
            v = j.intersection(v, m[g]);
          o = v;
        }
        break;
      }
      let u = j.object(r);
      e.additionalProperties === !1 ? o = u.strict() : typeof e.additionalProperties == "object" ? o = u.catchall($e(e.additionalProperties, t)) : o = u.passthrough();
      break;
    }
    case "array": {
      let r = e.prefixItems, i = e.items;
      if (r && Array.isArray(r)) {
        let a = r.map((c) => $e(c, t)), u = i && typeof i == "object" && !Array.isArray(i) ? $e(i, t) : void 0;
        u ? o = j.tuple(a).rest(u) : o = j.tuple(a), typeof e.minItems == "number" && (o = o.check(j.minLength(e.minItems))), typeof e.maxItems == "number" && (o = o.check(j.maxLength(e.maxItems)));
      } else if (Array.isArray(i)) {
        let a = i.map((c) => $e(c, t)), u = e.additionalItems && typeof e.additionalItems == "object" ? $e(e.additionalItems, t) : void 0;
        u ? o = j.tuple(a).rest(u) : o = j.tuple(a), typeof e.minItems == "number" && (o = o.check(j.minLength(e.minItems))), typeof e.maxItems == "number" && (o = o.check(j.maxLength(e.maxItems)));
      } else if (i !== void 0) {
        let a = $e(i, t), u = j.array(a);
        typeof e.minItems == "number" && (u = u.min(e.minItems)), typeof e.maxItems == "number" && (u = u.max(e.maxItems)), o = u;
      } else
        o = j.array(j.any());
      break;
    }
    default:
      throw new Error(`Unsupported type: ${n}`);
  }
  return e.description && (o = o.describe(e.description)), e.default !== void 0 && (o = o.default(e.default)), o;
}
l(dg, "convertBaseSchema");
function $e(e, t) {
  if (typeof e == "boolean")
    return e ? j.any() : j.never();
  let n = dg(e, t), o = e.type || e.enum !== void 0 || e.const !== void 0;
  if (e.anyOf && Array.isArray(e.anyOf)) {
    let u = e.anyOf.map((d) => $e(d, t)), c = j.union(u);
    n = o ? j.intersection(n, c) : c;
  }
  if (e.oneOf && Array.isArray(e.oneOf)) {
    let u = e.oneOf.map((d) => $e(d, t)), c = j.xor(u);
    n = o ? j.intersection(n, c) : c;
  }
  if (e.allOf && Array.isArray(e.allOf))
    if (e.allOf.length === 0)
      n = o ? n : j.any();
    else {
      let u = o ? n : $e(e.allOf[0], t), c = o ? 0 : 1;
      for (let d = c; d < e.allOf.length; d++)
        u = j.intersection(u, $e(e.allOf[d], t));
      n = u;
    }
  e.nullable === !0 && t.version === "openapi-3.0" && (n = j.nullable(n)), e.readOnly === !0 && (n = j.readonly(n));
  let r = {}, i = ["$id", "id", "$comment", "$anchor", "$vocabulary", "$dynamicRef", "$dynamicAnchor"];
  for (let u of i)
    u in e && (r[u] = e[u]);
  let a = ["contentEncoding", "contentMediaType", "contentSchema"];
  for (let u of a)
    u in e && (r[u] = e[u]);
  for (let u of Object.keys(e))
    Nx.has(u) || (r[u] = e[u]);
  return Object.keys(r).length > 0 && t.registry.add(n, r), n;
}
l($e, "convertSchema");
function pg(e, t) {
  if (typeof e == "boolean")
    return e ? j.any() : j.never();
  let n = Ax(e, t?.defaultTarget), o = e.$defs || e.definitions || {}, r = {
    version: n,
    defs: o,
    refs: /* @__PURE__ */ new Map(),
    processing: /* @__PURE__ */ new Set(),
    rootSchema: e,
    registry: t?.registry ?? be
  };
  return $e(e, r);
}
l(pg, "fromJSONSchema");

// node_modules/zod/v4/classic/coerce.js
var gp = {};
xt(gp, {
  bigint: () => Mx,
  boolean: () => Ux,
  date: () => Zx,
  number: () => Dx,
  string: () => Cx
});
function Cx(e) {
  return Zu(Vr, e);
}
l(Cx, "string");
function Dx(e) {
  return Wu(Jr, e);
}
l(Dx, "number");
function Ux(e) {
  return tc(Br, e);
}
l(Ux, "boolean");
function Mx(e) {
  return nc(Gr, e);
}
l(Mx, "bigint");
function Zx(e) {
  return fc(Wn, e);
}
l(Zx, "date");

// node_modules/zod/v4/classic/external.js
de(An());

// node_modules/@ai-sdk/provider/dist/index.mjs
var Lg = "vercel.ai.error", Lx = Symbol.for(Lg), mg, fg, C = class Fg extends (fg = Error, mg = Lx, fg) {
  static {
    l(this, "_AISDKError");
  }
  /**
   * Creates an AI SDK Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */
  constructor({
    name: t,
    message: n,
    cause: o
  }) {
    super(n), this[mg] = !0, this.name = t, this.cause = o;
  }
  /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */
  static isInstance(t) {
    return Fg.hasMarker(t, Lg);
  }
  static hasMarker(t, n) {
    let o = Symbol.for(n);
    return t != null && typeof t == "object" && o in t && typeof t[o] == "boolean" && t[o] === !0;
  }
}, Vg = "AI_APICallError", qg = `vercel.ai.error.${Vg}`, Fx = Symbol.for(qg), gg, hg, se = class extends (hg = C, gg = Fx, hg) {
  static {
    l(this, "APICallError");
  }
  constructor({
    message: e,
    url: t,
    requestBodyValues: n,
    statusCode: o,
    responseHeaders: r,
    responseBody: i,
    cause: a,
    isRetryable: u = o != null && (o === 408 || // request timeout
    o === 409 || // conflict
    o === 429 || // too many requests
    o >= 500),
    // server error
    data: c
  }) {
    super({ name: Vg, message: e, cause: a }), this[gg] = !0, this.url = t, this.requestBodyValues = n, this.statusCode = o, this.responseHeaders = r, this.responseBody = i, this.isRetryable = u, this.data = c;
  }
  static isInstance(e) {
    return C.hasMarker(e, qg);
  }
}, Jg = "AI_EmptyResponseBodyError", Bg = `vercel.ai.error.${Jg}`, Vx = Symbol.for(Bg), vg, yg, Gg = class extends (yg = C, vg = Vx, yg) {
  static {
    l(this, "EmptyResponseBodyError");
  }
  // used in isInstance
  constructor({ message: e = "Empty response body" } = {}) {
    super({ name: Jg, message: e }), this[vg] = !0;
  }
  static isInstance(e) {
    return C.hasMarker(e, Bg);
  }
};
function Jt(e) {
  return e == null ? "unknown error" : typeof e == "string" ? e : e instanceof Error ? e.message : JSON.stringify(e);
}
l(Jt, "getErrorMessage");
var Wg = "AI_InvalidArgumentError", Kg = `vercel.ai.error.${Wg}`, qx = Symbol.for(Kg), _g, bg, oa = class extends (bg = C, _g = qx, bg) {
  static {
    l(this, "InvalidArgumentError");
  }
  constructor({
    message: e,
    cause: t,
    argument: n
  }) {
    super({ name: Wg, message: e, cause: t }), this[_g] = !0, this.argument = n;
  }
  static isInstance(e) {
    return C.hasMarker(e, Kg);
  }
}, Hg = "AI_InvalidPromptError", Xg = `vercel.ai.error.${Hg}`, Jx = Symbol.for(Xg), xg, $g, It = class extends ($g = C, xg = Jx, $g) {
  static {
    l(this, "InvalidPromptError");
  }
  constructor({
    prompt: e,
    message: t,
    cause: n
  }) {
    super({ name: Hg, message: `Invalid prompt: ${t}`, cause: n }), this[xg] = !0, this.prompt = e;
  }
  static isInstance(e) {
    return C.hasMarker(e, Xg);
  }
}, Yg = "AI_InvalidResponseDataError", Qg = `vercel.ai.error.${Yg}`, Bx = Symbol.for(Qg), wg, kg, ia = class extends (kg = C, wg = Bx, kg) {
  static {
    l(this, "InvalidResponseDataError");
  }
  constructor({
    data: e,
    message: t = `Invalid response data: ${JSON.stringify(e)}.`
  }) {
    super({ name: Yg, message: t }), this[wg] = !0, this.data = e;
  }
  static isInstance(e) {
    return C.hasMarker(e, Qg);
  }
}, eh = "AI_JSONParseError", th = `vercel.ai.error.${eh}`, Gx = Symbol.for(th), Ig, Sg, eo = class extends (Sg = C, Ig = Gx, Sg) {
  static {
    l(this, "JSONParseError");
  }
  constructor({ text: e, cause: t }) {
    super({
      name: eh,
      message: `JSON parsing failed: Text: ${e}.
Error message: ${Jt(t)}`,
      cause: t
    }), this[Ig] = !0, this.text = e;
  }
  static isInstance(e) {
    return C.hasMarker(e, th);
  }
}, rh = "AI_LoadAPIKeyError", nh = `vercel.ai.error.${rh}`, Wx = Symbol.for(nh), Tg, zg, to = class extends (zg = C, Tg = Wx, zg) {
  static {
    l(this, "LoadAPIKeyError");
  }
  // used in isInstance
  constructor({ message: e }) {
    super({ name: rh, message: e }), this[Tg] = !0;
  }
  static isInstance(e) {
    return C.hasMarker(e, nh);
  }
}, oh = "AI_LoadSettingError", ih = `vercel.ai.error.${oh}`, Kx = Symbol.for(ih), Eg, Og, HO = class extends (Og = C, Eg = Kx, Og) {
  static {
    l(this, "LoadSettingError");
  }
  // used in isInstance
  constructor({ message: e }) {
    super({ name: oh, message: e }), this[Eg] = !0;
  }
  static isInstance(e) {
    return C.hasMarker(e, ih);
  }
}, ah = "AI_NoContentGeneratedError", sh = `vercel.ai.error.${ah}`, Hx = Symbol.for(sh), jg, Pg, XO = class extends (Pg = C, jg = Hx, Pg) {
  static {
    l(this, "NoContentGeneratedError");
  }
  // used in isInstance
  constructor({
    message: e = "No content generated."
  } = {}) {
    super({ name: ah, message: e }), this[jg] = !0;
  }
  static isInstance(e) {
    return C.hasMarker(e, sh);
  }
}, lh = "AI_NoSuchModelError", uh = `vercel.ai.error.${lh}`, Xx = Symbol.for(uh), Ng, Ag, YO = class extends (Ag = C, Ng = Xx, Ag) {
  static {
    l(this, "NoSuchModelError");
  }
  constructor({
    errorName: e = lh,
    modelId: t,
    modelType: n,
    message: o = `No such ${n}: ${t}`
  }) {
    super({ name: e, message: o }), this[Ng] = !0, this.modelId = t, this.modelType = n;
  }
  static isInstance(e) {
    return C.hasMarker(e, uh);
  }
}, ch = "AI_TooManyEmbeddingValuesForCallError", dh = `vercel.ai.error.${ch}`, Yx = Symbol.for(dh), Rg, Cg, ph = class extends (Cg = C, Rg = Yx, Cg) {
  static {
    l(this, "TooManyEmbeddingValuesForCallError");
  }
  constructor(e) {
    super({
      name: ch,
      message: `Too many values for a single embedding call. The ${e.provider} model "${e.modelId}" can only embed up to ${e.maxEmbeddingsPerCall} values per call, but ${e.values.length} values were provided.`
    }), this[Rg] = !0, this.provider = e.provider, this.modelId = e.modelId, this.maxEmbeddingsPerCall = e.maxEmbeddingsPerCall, this.values = e.values;
  }
  static isInstance(e) {
    return C.hasMarker(e, dh);
  }
}, mh = "AI_TypeValidationError", fh = `vercel.ai.error.${mh}`, Qx = Symbol.for(fh), Dg, Ug, Bt = class hp extends (Ug = C, Dg = Qx, Ug) {
  static {
    l(this, "_TypeValidationError");
  }
  constructor({ value: t, cause: n }) {
    super({
      name: mh,
      message: `Type validation failed: Value: ${JSON.stringify(t)}.
Error message: ${Jt(n)}`,
      cause: n
    }), this[Dg] = !0, this.value = t;
  }
  static isInstance(t) {
    return C.hasMarker(t, fh);
  }
  /**
   * Wraps an error into a TypeValidationError.
   * If the cause is already a TypeValidationError with the same value, it returns the cause.
   * Otherwise, it creates a new TypeValidationError.
   *
   * @param {Object} params - The parameters for wrapping the error.
   * @param {unknown} params.value - The value that failed validation.
   * @param {unknown} params.cause - The original error or cause of the validation failure.
   * @returns {TypeValidationError} A TypeValidationError instance.
   */
  static wrap({
    value: t,
    cause: n
  }) {
    return hp.isInstance(n) && n.value === t ? n : new hp({ value: t, cause: n });
  }
}, gh = "AI_UnsupportedFunctionalityError", hh = `vercel.ai.error.${gh}`, e$ = Symbol.for(hh), Mg, Zg, Ze = class extends (Zg = C, Mg = e$, Zg) {
  static {
    l(this, "UnsupportedFunctionalityError");
  }
  constructor({
    functionality: e,
    message: t = `'${e}' functionality not supported.`
  }) {
    super({ name: gh, message: t }), this[Mg] = !0, this.functionality = e;
  }
  static isInstance(e) {
    return C.hasMarker(e, hh);
  }
};

// node_modules/eventsource-parser/dist/index.js
var aa = class extends Error {
  static {
    l(this, "ParseError");
  }
  constructor(t, n) {
    super(t), this.name = "ParseError", this.type = n.type, this.field = n.field, this.value = n.value, this.line = n.line;
  }
};
function vp(e) {
}
l(vp, "noop");
function vh(e) {
  if (typeof e == "function")
    throw new TypeError(
      "`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?"
    );
  let { onEvent: t = vp, onError: n = vp, onRetry: o = vp, onComment: r } = e, i = "", a = !0, u, c = "", d = "";
  function p(x) {
    let $ = a ? x.replace(/^\xEF\xBB\xBF/, "") : x, [E, O] = t$(`${i}${$}`);
    for (let y of E)
      m(y);
    i = O, a = !1;
  }
  l(p, "feed");
  function m(x) {
    if (x === "") {
      g();
      return;
    }
    if (x.startsWith(":")) {
      r && r(x.slice(x.startsWith(": ") ? 2 : 1));
      return;
    }
    let $ = x.indexOf(":");
    if ($ !== -1) {
      let E = x.slice(0, $), O = x[$ + 1] === " " ? 2 : 1, y = x.slice($ + O);
      v(E, y, x);
      return;
    }
    v(x, "", x);
  }
  l(m, "parseLine");
  function v(x, $, E) {
    switch (x) {
      case "event":
        d = $;
        break;
      case "data":
        c = `${c}${$}
`;
        break;
      case "id":
        u = $.includes("\0") ? void 0 : $;
        break;
      case "retry":
        /^\d+$/.test($) ? o(parseInt($, 10)) : n(
          new aa(`Invalid \`retry\` value: "${$}"`, {
            type: "invalid-retry",
            value: $,
            line: E
          })
        );
        break;
      default:
        n(
          new aa(
            `Unknown field "${x.length > 20 ? `${x.slice(0, 20)}\u2026` : x}"`,
            { type: "unknown-field", field: x, value: $, line: E }
          )
        );
        break;
    }
  }
  l(v, "processField");
  function g() {
    c.length > 0 && t({
      id: u,
      event: d || void 0,
      // If the data buffer's last character is a U+000A LINE FEED (LF) character,
      // then remove the last character from the data buffer.
      data: c.endsWith(`
`) ? c.slice(0, -1) : c
    }), u = void 0, c = "", d = "";
  }
  l(g, "dispatchEvent");
  function b(x = {}) {
    i && x.consume && m(i), a = !0, u = void 0, c = "", d = "", i = "";
  }
  return l(b, "reset"), { feed: p, reset: b };
}
l(vh, "createParser");
function t$(e) {
  let t = [], n = "", o = 0;
  for (; o < e.length; ) {
    let r = e.indexOf("\r", o), i = e.indexOf(`
`, o), a = -1;
    if (r !== -1 && i !== -1 ? a = Math.min(r, i) : r !== -1 ? r === e.length - 1 ? a = -1 : a = r : i !== -1 && (a = i), a === -1) {
      n = e.slice(o);
      break;
    } else {
      let u = e.slice(o, a);
      t.push(u), o = a + 1, e[o - 1] === "\r" && e[o] === `
` && o++;
    }
  }
  return [t, n];
}
l(t$, "splitLines");

// node_modules/eventsource-parser/dist/stream.js
var sa = class extends TransformStream {
  static {
    l(this, "EventSourceParserStream");
  }
  constructor({ onError: t, onRetry: n, onComment: o } = {}) {
    let r;
    super({
      start(i) {
        r = vh({
          onEvent: /* @__PURE__ */ l((a) => {
            i.enqueue(a);
          }, "onEvent"),
          onError(a) {
            t === "terminate" ? i.error(a) : typeof t == "function" && t(a);
          },
          onRetry: n,
          onComment: o
        });
      },
      transform(i) {
        r.feed(i);
      }
    });
  }
};

// node_modules/zod/v3/helpers/util.js
var K;
(function(e) {
  e.assertEqual = (r) => {
  };
  function t(r) {
  }
  l(t, "assertIs"), e.assertIs = t;
  function n(r) {
    throw new Error();
  }
  l(n, "assertNever"), e.assertNever = n, e.arrayToEnum = (r) => {
    let i = {};
    for (let a of r)
      i[a] = a;
    return i;
  }, e.getValidEnumValues = (r) => {
    let i = e.objectKeys(r).filter((u) => typeof r[r[u]] != "number"), a = {};
    for (let u of i)
      a[u] = r[u];
    return e.objectValues(a);
  }, e.objectValues = (r) => e.objectKeys(r).map(function(i) {
    return r[i];
  }), e.objectKeys = typeof Object.keys == "function" ? (r) => Object.keys(r) : (r) => {
    let i = [];
    for (let a in r)
      Object.prototype.hasOwnProperty.call(r, a) && i.push(a);
    return i;
  }, e.find = (r, i) => {
    for (let a of r)
      if (i(a))
        return a;
  }, e.isInteger = typeof Number.isInteger == "function" ? (r) => Number.isInteger(r) : (r) => typeof r == "number" && Number.isFinite(r) && Math.floor(r) === r;
  function o(r, i = " | ") {
    return r.map((a) => typeof a == "string" ? `'${a}'` : a).join(i);
  }
  l(o, "joinValues"), e.joinValues = o, e.jsonStringifyReplacer = (r, i) => typeof i == "bigint" ? i.toString() : i;
})(K || (K = {}));
var yh;
(function(e) {
  e.mergeShapes = (t, n) => ({
    ...t,
    ...n
    // second overwrites first
  });
})(yh || (yh = {}));
var N = K.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), St = /* @__PURE__ */ l((e) => {
  switch (typeof e) {
    case "undefined":
      return N.undefined;
    case "string":
      return N.string;
    case "number":
      return Number.isNaN(e) ? N.nan : N.number;
    case "boolean":
      return N.boolean;
    case "function":
      return N.function;
    case "bigint":
      return N.bigint;
    case "symbol":
      return N.symbol;
    case "object":
      return Array.isArray(e) ? N.array : e === null ? N.null : e.then && typeof e.then == "function" && e.catch && typeof e.catch == "function" ? N.promise : typeof Map < "u" && e instanceof Map ? N.map : typeof Set < "u" && e instanceof Set ? N.set : typeof Date < "u" && e instanceof Date ? N.date : N.object;
    default:
      return N.unknown;
  }
}, "getParsedType");

// node_modules/zod/v3/ZodError.js
var k = K.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var Je = class e extends Error {
  static {
    l(this, "ZodError");
  }
  get errors() {
    return this.issues;
  }
  constructor(t) {
    super(), this.issues = [], this.addIssue = (o) => {
      this.issues = [...this.issues, o];
    }, this.addIssues = (o = []) => {
      this.issues = [...this.issues, ...o];
    };
    let n = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, n) : this.__proto__ = n, this.name = "ZodError", this.issues = t;
  }
  format(t) {
    let n = t || function(i) {
      return i.message;
    }, o = { _errors: [] }, r = /* @__PURE__ */ l((i) => {
      for (let a of i.issues)
        if (a.code === "invalid_union")
          a.unionErrors.map(r);
        else if (a.code === "invalid_return_type")
          r(a.returnTypeError);
        else if (a.code === "invalid_arguments")
          r(a.argumentsError);
        else if (a.path.length === 0)
          o._errors.push(n(a));
        else {
          let u = o, c = 0;
          for (; c < a.path.length; ) {
            let d = a.path[c];
            c === a.path.length - 1 ? (u[d] = u[d] || { _errors: [] }, u[d]._errors.push(n(a))) : u[d] = u[d] || { _errors: [] }, u = u[d], c++;
          }
        }
    }, "processError");
    return r(this), o;
  }
  static assert(t) {
    if (!(t instanceof e))
      throw new Error(`Not a ZodError: ${t}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, K.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(t = (n) => n.message) {
    let n = /* @__PURE__ */ Object.create(null), o = [];
    for (let r of this.issues)
      if (r.path.length > 0) {
        let i = r.path[0];
        n[i] = n[i] || [], n[i].push(t(r));
      } else
        o.push(t(r));
    return { formErrors: o, fieldErrors: n };
  }
  get formErrors() {
    return this.flatten();
  }
};
Je.create = (e) => new Je(e);

// node_modules/zod/v3/locales/en.js
var n$ = /* @__PURE__ */ l((e, t) => {
  let n;
  switch (e.code) {
    case k.invalid_type:
      e.received === N.undefined ? n = "Required" : n = `Expected ${e.expected}, received ${e.received}`;
      break;
    case k.invalid_literal:
      n = `Invalid literal value, expected ${JSON.stringify(e.expected, K.jsonStringifyReplacer)}`;
      break;
    case k.unrecognized_keys:
      n = `Unrecognized key(s) in object: ${K.joinValues(e.keys, ", ")}`;
      break;
    case k.invalid_union:
      n = "Invalid input";
      break;
    case k.invalid_union_discriminator:
      n = `Invalid discriminator value. Expected ${K.joinValues(e.options)}`;
      break;
    case k.invalid_enum_value:
      n = `Invalid enum value. Expected ${K.joinValues(e.options)}, received '${e.received}'`;
      break;
    case k.invalid_arguments:
      n = "Invalid function arguments";
      break;
    case k.invalid_return_type:
      n = "Invalid function return type";
      break;
    case k.invalid_date:
      n = "Invalid date";
      break;
    case k.invalid_string:
      typeof e.validation == "object" ? "includes" in e.validation ? (n = `Invalid input: must include "${e.validation.includes}"`, typeof e.validation.position == "number" && (n = `${n} at one or more positions greater than or equal to ${e.validation.position}`)) : "startsWith" in e.validation ? n = `Invalid input: must start with "${e.validation.startsWith}"` : "endsWith" in e.validation ? n = `Invalid input: must end with "${e.validation.endsWith}"` : K.assertNever(e.validation) : e.validation !== "regex" ? n = `Invalid ${e.validation}` : n = "Invalid";
      break;
    case k.too_small:
      e.type === "array" ? n = `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "more than"} ${e.minimum} element(s)` : e.type === "string" ? n = `String must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "over"} ${e.minimum} character(s)` : e.type === "number" ? n = `Number must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${e.minimum}` : e.type === "bigint" ? n = `Number must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${e.minimum}` : e.type === "date" ? n = `Date must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(e.minimum))}` : n = "Invalid input";
      break;
    case k.too_big:
      e.type === "array" ? n = `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "less than"} ${e.maximum} element(s)` : e.type === "string" ? n = `String must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "under"} ${e.maximum} character(s)` : e.type === "number" ? n = `Number must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` : e.type === "bigint" ? n = `BigInt must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` : e.type === "date" ? n = `Date must be ${e.exact ? "exactly" : e.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(e.maximum))}` : n = "Invalid input";
      break;
    case k.custom:
      n = "Invalid input";
      break;
    case k.invalid_intersection_types:
      n = "Intersection results could not be merged";
      break;
    case k.not_multiple_of:
      n = `Number must be a multiple of ${e.multipleOf}`;
      break;
    case k.not_finite:
      n = "Number must be finite";
      break;
    default:
      n = t.defaultError, K.assertNever(e);
  }
  return { message: n };
}, "errorMap"), Gt = n$;

// node_modules/zod/v3/errors.js
var o$ = Gt;
function ro() {
  return o$;
}
l(ro, "getErrorMap");

// node_modules/zod/v3/helpers/parseUtil.js
var la = /* @__PURE__ */ l((e) => {
  let { data: t, path: n, errorMaps: o, issueData: r } = e, i = [...n, ...r.path || []], a = {
    ...r,
    path: i
  };
  if (r.message !== void 0)
    return {
      ...r,
      path: i,
      message: r.message
    };
  let u = "", c = o.filter((d) => !!d).slice().reverse();
  for (let d of c)
    u = d(a, { data: t, defaultError: u }).message;
  return {
    ...r,
    path: i,
    message: u
  };
}, "makeIssue");
function P(e, t) {
  let n = ro(), o = la({
    issueData: t,
    data: e.data,
    path: e.path,
    errorMaps: [
      e.common.contextualErrorMap,
      // contextual error map is first priority
      e.schemaErrorMap,
      // then schema-bound map if available
      n,
      // then global override map
      n === Gt ? void 0 : Gt
      // then global default map
    ].filter((r) => !!r)
  });
  e.common.issues.push(o);
}
l(P, "addIssueToContext");
var we = class e {
  static {
    l(this, "ParseStatus");
  }
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(t, n) {
    let o = [];
    for (let r of n) {
      if (r.status === "aborted")
        return M;
      r.status === "dirty" && t.dirty(), o.push(r.value);
    }
    return { status: t.value, value: o };
  }
  static async mergeObjectAsync(t, n) {
    let o = [];
    for (let r of n) {
      let i = await r.key, a = await r.value;
      o.push({
        key: i,
        value: a
      });
    }
    return e.mergeObjectSync(t, o);
  }
  static mergeObjectSync(t, n) {
    let o = {};
    for (let r of n) {
      let { key: i, value: a } = r;
      if (i.status === "aborted" || a.status === "aborted")
        return M;
      i.status === "dirty" && t.dirty(), a.status === "dirty" && t.dirty(), i.value !== "__proto__" && (typeof a.value < "u" || r.alwaysSet) && (o[i.value] = a.value);
    }
    return { status: t.value, value: o };
  }
}, M = Object.freeze({
  status: "aborted"
}), Wr = /* @__PURE__ */ l((e) => ({ status: "dirty", value: e }), "DIRTY"), Oe = /* @__PURE__ */ l((e) => ({ status: "valid", value: e }), "OK"), yp = /* @__PURE__ */ l((e) => e.status === "aborted", "isAborted"), _p = /* @__PURE__ */ l((e) => e.status === "dirty", "isDirty"), pr = /* @__PURE__ */ l((e) => e.status === "valid", "isValid"), no = /* @__PURE__ */ l((e) => typeof Promise < "u" && e instanceof Promise, "isAsync");

// node_modules/zod/v3/helpers/errorUtil.js
var R;
(function(e) {
  e.errToObj = (t) => typeof t == "string" ? { message: t } : t || {}, e.toString = (t) => typeof t == "string" ? t : t?.message;
})(R || (R = {}));

// node_modules/zod/v3/types.js
var Qe = class {
  static {
    l(this, "ParseInputLazyPath");
  }
  constructor(t, n, o, r) {
    this._cachedPath = [], this.parent = t, this.data = n, this._path = o, this._key = r;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}, _h = /* @__PURE__ */ l((e, t) => {
  if (pr(t))
    return { success: !0, data: t.value };
  if (!e.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      let n = new Je(e.common.issues);
      return this._error = n, this._error;
    }
  };
}, "handleResult");
function V(e) {
  if (!e)
    return {};
  let { errorMap: t, invalid_type_error: n, required_error: o, description: r } = e;
  if (t && (n || o))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return t ? { errorMap: t, description: r } : { errorMap: /* @__PURE__ */ l((a, u) => {
    let { message: c } = e;
    return a.code === "invalid_enum_value" ? { message: c ?? u.defaultError } : typeof u.data > "u" ? { message: c ?? o ?? u.defaultError } : a.code !== "invalid_type" ? { message: u.defaultError } : { message: c ?? n ?? u.defaultError };
  }, "customMap"), description: r };
}
l(V, "processCreateParams");
var W = class {
  static {
    l(this, "ZodType");
  }
  get description() {
    return this._def.description;
  }
  _getType(t) {
    return St(t.data);
  }
  _getOrReturnCtx(t, n) {
    return n || {
      common: t.parent.common,
      data: t.data,
      parsedType: St(t.data),
      schemaErrorMap: this._def.errorMap,
      path: t.path,
      parent: t.parent
    };
  }
  _processInputParams(t) {
    return {
      status: new we(),
      ctx: {
        common: t.parent.common,
        data: t.data,
        parsedType: St(t.data),
        schemaErrorMap: this._def.errorMap,
        path: t.path,
        parent: t.parent
      }
    };
  }
  _parseSync(t) {
    let n = this._parse(t);
    if (no(n))
      throw new Error("Synchronous parse encountered promise.");
    return n;
  }
  _parseAsync(t) {
    let n = this._parse(t);
    return Promise.resolve(n);
  }
  parse(t, n) {
    let o = this.safeParse(t, n);
    if (o.success)
      return o.data;
    throw o.error;
  }
  safeParse(t, n) {
    let o = {
      common: {
        issues: [],
        async: n?.async ?? !1,
        contextualErrorMap: n?.errorMap
      },
      path: n?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: t,
      parsedType: St(t)
    }, r = this._parseSync({ data: t, path: o.path, parent: o });
    return _h(o, r);
  }
  "~validate"(t) {
    let n = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: t,
      parsedType: St(t)
    };
    if (!this["~standard"].async)
      try {
        let o = this._parseSync({ data: t, path: [], parent: n });
        return pr(o) ? {
          value: o.value
        } : {
          issues: n.common.issues
        };
      } catch (o) {
        o?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = !0), n.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: t, path: [], parent: n }).then((o) => pr(o) ? {
      value: o.value
    } : {
      issues: n.common.issues
    });
  }
  async parseAsync(t, n) {
    let o = await this.safeParseAsync(t, n);
    if (o.success)
      return o.data;
    throw o.error;
  }
  async safeParseAsync(t, n) {
    let o = {
      common: {
        issues: [],
        contextualErrorMap: n?.errorMap,
        async: !0
      },
      path: n?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: t,
      parsedType: St(t)
    }, r = this._parse({ data: t, path: o.path, parent: o }), i = await (no(r) ? r : Promise.resolve(r));
    return _h(o, i);
  }
  refine(t, n) {
    let o = /* @__PURE__ */ l((r) => typeof n == "string" || typeof n > "u" ? { message: n } : typeof n == "function" ? n(r) : n, "getIssueProperties");
    return this._refinement((r, i) => {
      let a = t(r), u = /* @__PURE__ */ l(() => i.addIssue({
        code: k.custom,
        ...o(r)
      }), "setError");
      return typeof Promise < "u" && a instanceof Promise ? a.then((c) => c ? !0 : (u(), !1)) : a ? !0 : (u(), !1);
    });
  }
  refinement(t, n) {
    return this._refinement((o, r) => t(o) ? !0 : (r.addIssue(typeof n == "function" ? n(o, r) : n), !1));
  }
  _refinement(t) {
    return new at({
      schema: this,
      typeName: T.ZodEffects,
      effect: { type: "refinement", refinement: t }
    });
  }
  superRefine(t) {
    return this._refinement(t);
  }
  constructor(t) {
    this.spa = this.safeParseAsync, this._def = t, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: /* @__PURE__ */ l((n) => this["~validate"](n), "validate")
    };
  }
  optional() {
    return it.create(this, this._def);
  }
  nullable() {
    return Et.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return Kt.create(this);
  }
  promise() {
    return mr.create(this, this._def);
  }
  or(t) {
    return Qr.create([this, t], this._def);
  }
  and(t) {
    return en.create(this, t, this._def);
  }
  transform(t) {
    return new at({
      ...V(this._def),
      schema: this,
      typeName: T.ZodEffects,
      effect: { type: "transform", transform: t }
    });
  }
  default(t) {
    let n = typeof t == "function" ? t : () => t;
    return new an({
      ...V(this._def),
      innerType: this,
      defaultValue: n,
      typeName: T.ZodDefault
    });
  }
  brand() {
    return new ua({
      typeName: T.ZodBranded,
      type: this,
      ...V(this._def)
    });
  }
  catch(t) {
    let n = typeof t == "function" ? t : () => t;
    return new sn({
      ...V(this._def),
      innerType: this,
      catchValue: n,
      typeName: T.ZodCatch
    });
  }
  describe(t) {
    let n = this.constructor;
    return new n({
      ...this._def,
      description: t
    });
  }
  pipe(t) {
    return ca.create(this, t);
  }
  readonly() {
    return ln.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}, i$ = /^c[^\s-]{8,}$/i, a$ = /^[0-9a-z]+$/, s$ = /^[0-9A-HJKMNP-TV-Z]{26}$/i, l$ = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, u$ = /^[a-z0-9_-]{21}$/i, c$ = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, d$ = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, p$ = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, m$ = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", bp, f$ = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, g$ = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, h$ = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, v$ = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, y$ = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, _$ = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, bh = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", b$ = new RegExp(`^${bh}$`);
function xh(e) {
  let t = "[0-5]\\d";
  e.precision ? t = `${t}\\.\\d{${e.precision}}` : e.precision == null && (t = `${t}(\\.\\d+)?`);
  let n = e.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${t})${n}`;
}
l(xh, "timeRegexSource");
function x$(e) {
  return new RegExp(`^${xh(e)}$`);
}
l(x$, "timeRegex");
function $$(e) {
  let t = `${bh}T${xh(e)}`, n = [];
  return n.push(e.local ? "Z?" : "Z"), e.offset && n.push("([+-]\\d{2}:?\\d{2})"), t = `${t}(${n.join("|")})`, new RegExp(`^${t}$`);
}
l($$, "datetimeRegex");
function w$(e, t) {
  return !!((t === "v4" || !t) && f$.test(e) || (t === "v6" || !t) && h$.test(e));
}
l(w$, "isValidIP");
function k$(e, t) {
  if (!c$.test(e))
    return !1;
  try {
    let [n] = e.split(".");
    if (!n)
      return !1;
    let o = n.replace(/-/g, "+").replace(/_/g, "/").padEnd(n.length + (4 - n.length % 4) % 4, "="), r = JSON.parse(atob(o));
    return !(typeof r != "object" || r === null || "typ" in r && r?.typ !== "JWT" || !r.alg || t && r.alg !== t);
  } catch {
    return !1;
  }
}
l(k$, "isValidJWT");
function I$(e, t) {
  return !!((t === "v4" || !t) && g$.test(e) || (t === "v6" || !t) && v$.test(e));
}
l(I$, "isValidCidr");
var Hr = class e extends W {
  static {
    l(this, "ZodString");
  }
  _parse(t) {
    if (this._def.coerce && (t.data = String(t.data)), this._getType(t) !== N.string) {
      let i = this._getOrReturnCtx(t);
      return P(i, {
        code: k.invalid_type,
        expected: N.string,
        received: i.parsedType
      }), M;
    }
    let o = new we(), r;
    for (let i of this._def.checks)
      if (i.kind === "min")
        t.data.length < i.value && (r = this._getOrReturnCtx(t, r), P(r, {
          code: k.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), o.dirty());
      else if (i.kind === "max")
        t.data.length > i.value && (r = this._getOrReturnCtx(t, r), P(r, {
          code: k.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), o.dirty());
      else if (i.kind === "length") {
        let a = t.data.length > i.value, u = t.data.length < i.value;
        (a || u) && (r = this._getOrReturnCtx(t, r), a ? P(r, {
          code: k.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }) : u && P(r, {
          code: k.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }), o.dirty());
      } else if (i.kind === "email")
        p$.test(t.data) || (r = this._getOrReturnCtx(t, r), P(r, {
          validation: "email",
          code: k.invalid_string,
          message: i.message
        }), o.dirty());
      else if (i.kind === "emoji")
        bp || (bp = new RegExp(m$, "u")), bp.test(t.data) || (r = this._getOrReturnCtx(t, r), P(r, {
          validation: "emoji",
          code: k.invalid_string,
          message: i.message
        }), o.dirty());
      else if (i.kind === "uuid")
        l$.test(t.data) || (r = this._getOrReturnCtx(t, r), P(r, {
          validation: "uuid",
          code: k.invalid_string,
          message: i.message
        }), o.dirty());
      else if (i.kind === "nanoid")
        u$.test(t.data) || (r = this._getOrReturnCtx(t, r), P(r, {
          validation: "nanoid",
          code: k.invalid_string,
          message: i.message
        }), o.dirty());
      else if (i.kind === "cuid")
        i$.test(t.data) || (r = this._getOrReturnCtx(t, r), P(r, {
          validation: "cuid",
          code: k.invalid_string,
          message: i.message
        }), o.dirty());
      else if (i.kind === "cuid2")
        a$.test(t.data) || (r = this._getOrReturnCtx(t, r), P(r, {
          validation: "cuid2",
          code: k.invalid_string,
          message: i.message
        }), o.dirty());
      else if (i.kind === "ulid")
        s$.test(t.data) || (r = this._getOrReturnCtx(t, r), P(r, {
          validation: "ulid",
          code: k.invalid_string,
          message: i.message
        }), o.dirty());
      else if (i.kind === "url")
        try {
          new URL(t.data);
        } catch {
          r = this._getOrReturnCtx(t, r), P(r, {
            validation: "url",
            code: k.invalid_string,
            message: i.message
          }), o.dirty();
        }
      else i.kind === "regex" ? (i.regex.lastIndex = 0, i.regex.test(t.data) || (r = this._getOrReturnCtx(t, r), P(r, {
        validation: "regex",
        code: k.invalid_string,
        message: i.message
      }), o.dirty())) : i.kind === "trim" ? t.data = t.data.trim() : i.kind === "includes" ? t.data.includes(i.value, i.position) || (r = this._getOrReturnCtx(t, r), P(r, {
        code: k.invalid_string,
        validation: { includes: i.value, position: i.position },
        message: i.message
      }), o.dirty()) : i.kind === "toLowerCase" ? t.data = t.data.toLowerCase() : i.kind === "toUpperCase" ? t.data = t.data.toUpperCase() : i.kind === "startsWith" ? t.data.startsWith(i.value) || (r = this._getOrReturnCtx(t, r), P(r, {
        code: k.invalid_string,
        validation: { startsWith: i.value },
        message: i.message
      }), o.dirty()) : i.kind === "endsWith" ? t.data.endsWith(i.value) || (r = this._getOrReturnCtx(t, r), P(r, {
        code: k.invalid_string,
        validation: { endsWith: i.value },
        message: i.message
      }), o.dirty()) : i.kind === "datetime" ? $$(i).test(t.data) || (r = this._getOrReturnCtx(t, r), P(r, {
        code: k.invalid_string,
        validation: "datetime",
        message: i.message
      }), o.dirty()) : i.kind === "date" ? b$.test(t.data) || (r = this._getOrReturnCtx(t, r), P(r, {
        code: k.invalid_string,
        validation: "date",
        message: i.message
      }), o.dirty()) : i.kind === "time" ? x$(i).test(t.data) || (r = this._getOrReturnCtx(t, r), P(r, {
        code: k.invalid_string,
        validation: "time",
        message: i.message
      }), o.dirty()) : i.kind === "duration" ? d$.test(t.data) || (r = this._getOrReturnCtx(t, r), P(r, {
        validation: "duration",
        code: k.invalid_string,
        message: i.message
      }), o.dirty()) : i.kind === "ip" ? w$(t.data, i.version) || (r = this._getOrReturnCtx(t, r), P(r, {
        validation: "ip",
        code: k.invalid_string,
        message: i.message
      }), o.dirty()) : i.kind === "jwt" ? k$(t.data, i.alg) || (r = this._getOrReturnCtx(t, r), P(r, {
        validation: "jwt",
        code: k.invalid_string,
        message: i.message
      }), o.dirty()) : i.kind === "cidr" ? I$(t.data, i.version) || (r = this._getOrReturnCtx(t, r), P(r, {
        validation: "cidr",
        code: k.invalid_string,
        message: i.message
      }), o.dirty()) : i.kind === "base64" ? y$.test(t.data) || (r = this._getOrReturnCtx(t, r), P(r, {
        validation: "base64",
        code: k.invalid_string,
        message: i.message
      }), o.dirty()) : i.kind === "base64url" ? _$.test(t.data) || (r = this._getOrReturnCtx(t, r), P(r, {
        validation: "base64url",
        code: k.invalid_string,
        message: i.message
      }), o.dirty()) : K.assertNever(i);
    return { status: o.value, value: t.data };
  }
  _regex(t, n, o) {
    return this.refinement((r) => t.test(r), {
      validation: n,
      code: k.invalid_string,
      ...R.errToObj(o)
    });
  }
  _addCheck(t) {
    return new e({
      ...this._def,
      checks: [...this._def.checks, t]
    });
  }
  email(t) {
    return this._addCheck({ kind: "email", ...R.errToObj(t) });
  }
  url(t) {
    return this._addCheck({ kind: "url", ...R.errToObj(t) });
  }
  emoji(t) {
    return this._addCheck({ kind: "emoji", ...R.errToObj(t) });
  }
  uuid(t) {
    return this._addCheck({ kind: "uuid", ...R.errToObj(t) });
  }
  nanoid(t) {
    return this._addCheck({ kind: "nanoid", ...R.errToObj(t) });
  }
  cuid(t) {
    return this._addCheck({ kind: "cuid", ...R.errToObj(t) });
  }
  cuid2(t) {
    return this._addCheck({ kind: "cuid2", ...R.errToObj(t) });
  }
  ulid(t) {
    return this._addCheck({ kind: "ulid", ...R.errToObj(t) });
  }
  base64(t) {
    return this._addCheck({ kind: "base64", ...R.errToObj(t) });
  }
  base64url(t) {
    return this._addCheck({
      kind: "base64url",
      ...R.errToObj(t)
    });
  }
  jwt(t) {
    return this._addCheck({ kind: "jwt", ...R.errToObj(t) });
  }
  ip(t) {
    return this._addCheck({ kind: "ip", ...R.errToObj(t) });
  }
  cidr(t) {
    return this._addCheck({ kind: "cidr", ...R.errToObj(t) });
  }
  datetime(t) {
    return typeof t == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: t
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof t?.precision > "u" ? null : t?.precision,
      offset: t?.offset ?? !1,
      local: t?.local ?? !1,
      ...R.errToObj(t?.message)
    });
  }
  date(t) {
    return this._addCheck({ kind: "date", message: t });
  }
  time(t) {
    return typeof t == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: t
    }) : this._addCheck({
      kind: "time",
      precision: typeof t?.precision > "u" ? null : t?.precision,
      ...R.errToObj(t?.message)
    });
  }
  duration(t) {
    return this._addCheck({ kind: "duration", ...R.errToObj(t) });
  }
  regex(t, n) {
    return this._addCheck({
      kind: "regex",
      regex: t,
      ...R.errToObj(n)
    });
  }
  includes(t, n) {
    return this._addCheck({
      kind: "includes",
      value: t,
      position: n?.position,
      ...R.errToObj(n?.message)
    });
  }
  startsWith(t, n) {
    return this._addCheck({
      kind: "startsWith",
      value: t,
      ...R.errToObj(n)
    });
  }
  endsWith(t, n) {
    return this._addCheck({
      kind: "endsWith",
      value: t,
      ...R.errToObj(n)
    });
  }
  min(t, n) {
    return this._addCheck({
      kind: "min",
      value: t,
      ...R.errToObj(n)
    });
  }
  max(t, n) {
    return this._addCheck({
      kind: "max",
      value: t,
      ...R.errToObj(n)
    });
  }
  length(t, n) {
    return this._addCheck({
      kind: "length",
      value: t,
      ...R.errToObj(n)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(t) {
    return this.min(1, R.errToObj(t));
  }
  trim() {
    return new e({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new e({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new e({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((t) => t.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((t) => t.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((t) => t.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((t) => t.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((t) => t.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((t) => t.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((t) => t.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((t) => t.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((t) => t.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((t) => t.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((t) => t.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((t) => t.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((t) => t.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((t) => t.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((t) => t.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((t) => t.kind === "base64url");
  }
  get minLength() {
    let t = null;
    for (let n of this._def.checks)
      n.kind === "min" && (t === null || n.value > t) && (t = n.value);
    return t;
  }
  get maxLength() {
    let t = null;
    for (let n of this._def.checks)
      n.kind === "max" && (t === null || n.value < t) && (t = n.value);
    return t;
  }
};
Hr.create = (e) => new Hr({
  checks: [],
  typeName: T.ZodString,
  coerce: e?.coerce ?? !1,
  ...V(e)
});
function S$(e, t) {
  let n = (e.toString().split(".")[1] || "").length, o = (t.toString().split(".")[1] || "").length, r = n > o ? n : o, i = Number.parseInt(e.toFixed(r).replace(".", "")), a = Number.parseInt(t.toFixed(r).replace(".", ""));
  return i % a / 10 ** r;
}
l(S$, "floatSafeRemainder");
var oo = class e extends W {
  static {
    l(this, "ZodNumber");
  }
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(t) {
    if (this._def.coerce && (t.data = Number(t.data)), this._getType(t) !== N.number) {
      let i = this._getOrReturnCtx(t);
      return P(i, {
        code: k.invalid_type,
        expected: N.number,
        received: i.parsedType
      }), M;
    }
    let o, r = new we();
    for (let i of this._def.checks)
      i.kind === "int" ? K.isInteger(t.data) || (o = this._getOrReturnCtx(t, o), P(o, {
        code: k.invalid_type,
        expected: "integer",
        received: "float",
        message: i.message
      }), r.dirty()) : i.kind === "min" ? (i.inclusive ? t.data < i.value : t.data <= i.value) && (o = this._getOrReturnCtx(t, o), P(o, {
        code: k.too_small,
        minimum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), r.dirty()) : i.kind === "max" ? (i.inclusive ? t.data > i.value : t.data >= i.value) && (o = this._getOrReturnCtx(t, o), P(o, {
        code: k.too_big,
        maximum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), r.dirty()) : i.kind === "multipleOf" ? S$(t.data, i.value) !== 0 && (o = this._getOrReturnCtx(t, o), P(o, {
        code: k.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), r.dirty()) : i.kind === "finite" ? Number.isFinite(t.data) || (o = this._getOrReturnCtx(t, o), P(o, {
        code: k.not_finite,
        message: i.message
      }), r.dirty()) : K.assertNever(i);
    return { status: r.value, value: t.data };
  }
  gte(t, n) {
    return this.setLimit("min", t, !0, R.toString(n));
  }
  gt(t, n) {
    return this.setLimit("min", t, !1, R.toString(n));
  }
  lte(t, n) {
    return this.setLimit("max", t, !0, R.toString(n));
  }
  lt(t, n) {
    return this.setLimit("max", t, !1, R.toString(n));
  }
  setLimit(t, n, o, r) {
    return new e({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: t,
          value: n,
          inclusive: o,
          message: R.toString(r)
        }
      ]
    });
  }
  _addCheck(t) {
    return new e({
      ...this._def,
      checks: [...this._def.checks, t]
    });
  }
  int(t) {
    return this._addCheck({
      kind: "int",
      message: R.toString(t)
    });
  }
  positive(t) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: R.toString(t)
    });
  }
  negative(t) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: R.toString(t)
    });
  }
  nonpositive(t) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: R.toString(t)
    });
  }
  nonnegative(t) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: R.toString(t)
    });
  }
  multipleOf(t, n) {
    return this._addCheck({
      kind: "multipleOf",
      value: t,
      message: R.toString(n)
    });
  }
  finite(t) {
    return this._addCheck({
      kind: "finite",
      message: R.toString(t)
    });
  }
  safe(t) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: R.toString(t)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: R.toString(t)
    });
  }
  get minValue() {
    let t = null;
    for (let n of this._def.checks)
      n.kind === "min" && (t === null || n.value > t) && (t = n.value);
    return t;
  }
  get maxValue() {
    let t = null;
    for (let n of this._def.checks)
      n.kind === "max" && (t === null || n.value < t) && (t = n.value);
    return t;
  }
  get isInt() {
    return !!this._def.checks.find((t) => t.kind === "int" || t.kind === "multipleOf" && K.isInteger(t.value));
  }
  get isFinite() {
    let t = null, n = null;
    for (let o of this._def.checks) {
      if (o.kind === "finite" || o.kind === "int" || o.kind === "multipleOf")
        return !0;
      o.kind === "min" ? (n === null || o.value > n) && (n = o.value) : o.kind === "max" && (t === null || o.value < t) && (t = o.value);
    }
    return Number.isFinite(n) && Number.isFinite(t);
  }
};
oo.create = (e) => new oo({
  checks: [],
  typeName: T.ZodNumber,
  coerce: e?.coerce || !1,
  ...V(e)
});
var io = class e extends W {
  static {
    l(this, "ZodBigInt");
  }
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(t) {
    if (this._def.coerce)
      try {
        t.data = BigInt(t.data);
      } catch {
        return this._getInvalidInput(t);
      }
    if (this._getType(t) !== N.bigint)
      return this._getInvalidInput(t);
    let o, r = new we();
    for (let i of this._def.checks)
      i.kind === "min" ? (i.inclusive ? t.data < i.value : t.data <= i.value) && (o = this._getOrReturnCtx(t, o), P(o, {
        code: k.too_small,
        type: "bigint",
        minimum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), r.dirty()) : i.kind === "max" ? (i.inclusive ? t.data > i.value : t.data >= i.value) && (o = this._getOrReturnCtx(t, o), P(o, {
        code: k.too_big,
        type: "bigint",
        maximum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), r.dirty()) : i.kind === "multipleOf" ? t.data % i.value !== BigInt(0) && (o = this._getOrReturnCtx(t, o), P(o, {
        code: k.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), r.dirty()) : K.assertNever(i);
    return { status: r.value, value: t.data };
  }
  _getInvalidInput(t) {
    let n = this._getOrReturnCtx(t);
    return P(n, {
      code: k.invalid_type,
      expected: N.bigint,
      received: n.parsedType
    }), M;
  }
  gte(t, n) {
    return this.setLimit("min", t, !0, R.toString(n));
  }
  gt(t, n) {
    return this.setLimit("min", t, !1, R.toString(n));
  }
  lte(t, n) {
    return this.setLimit("max", t, !0, R.toString(n));
  }
  lt(t, n) {
    return this.setLimit("max", t, !1, R.toString(n));
  }
  setLimit(t, n, o, r) {
    return new e({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: t,
          value: n,
          inclusive: o,
          message: R.toString(r)
        }
      ]
    });
  }
  _addCheck(t) {
    return new e({
      ...this._def,
      checks: [...this._def.checks, t]
    });
  }
  positive(t) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: R.toString(t)
    });
  }
  negative(t) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: R.toString(t)
    });
  }
  nonpositive(t) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: R.toString(t)
    });
  }
  nonnegative(t) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: R.toString(t)
    });
  }
  multipleOf(t, n) {
    return this._addCheck({
      kind: "multipleOf",
      value: t,
      message: R.toString(n)
    });
  }
  get minValue() {
    let t = null;
    for (let n of this._def.checks)
      n.kind === "min" && (t === null || n.value > t) && (t = n.value);
    return t;
  }
  get maxValue() {
    let t = null;
    for (let n of this._def.checks)
      n.kind === "max" && (t === null || n.value < t) && (t = n.value);
    return t;
  }
};
io.create = (e) => new io({
  checks: [],
  typeName: T.ZodBigInt,
  coerce: e?.coerce ?? !1,
  ...V(e)
});
var ao = class extends W {
  static {
    l(this, "ZodBoolean");
  }
  _parse(t) {
    if (this._def.coerce && (t.data = !!t.data), this._getType(t) !== N.boolean) {
      let o = this._getOrReturnCtx(t);
      return P(o, {
        code: k.invalid_type,
        expected: N.boolean,
        received: o.parsedType
      }), M;
    }
    return Oe(t.data);
  }
};
ao.create = (e) => new ao({
  typeName: T.ZodBoolean,
  coerce: e?.coerce || !1,
  ...V(e)
});
var so = class e extends W {
  static {
    l(this, "ZodDate");
  }
  _parse(t) {
    if (this._def.coerce && (t.data = new Date(t.data)), this._getType(t) !== N.date) {
      let i = this._getOrReturnCtx(t);
      return P(i, {
        code: k.invalid_type,
        expected: N.date,
        received: i.parsedType
      }), M;
    }
    if (Number.isNaN(t.data.getTime())) {
      let i = this._getOrReturnCtx(t);
      return P(i, {
        code: k.invalid_date
      }), M;
    }
    let o = new we(), r;
    for (let i of this._def.checks)
      i.kind === "min" ? t.data.getTime() < i.value && (r = this._getOrReturnCtx(t, r), P(r, {
        code: k.too_small,
        message: i.message,
        inclusive: !0,
        exact: !1,
        minimum: i.value,
        type: "date"
      }), o.dirty()) : i.kind === "max" ? t.data.getTime() > i.value && (r = this._getOrReturnCtx(t, r), P(r, {
        code: k.too_big,
        message: i.message,
        inclusive: !0,
        exact: !1,
        maximum: i.value,
        type: "date"
      }), o.dirty()) : K.assertNever(i);
    return {
      status: o.value,
      value: new Date(t.data.getTime())
    };
  }
  _addCheck(t) {
    return new e({
      ...this._def,
      checks: [...this._def.checks, t]
    });
  }
  min(t, n) {
    return this._addCheck({
      kind: "min",
      value: t.getTime(),
      message: R.toString(n)
    });
  }
  max(t, n) {
    return this._addCheck({
      kind: "max",
      value: t.getTime(),
      message: R.toString(n)
    });
  }
  get minDate() {
    let t = null;
    for (let n of this._def.checks)
      n.kind === "min" && (t === null || n.value > t) && (t = n.value);
    return t != null ? new Date(t) : null;
  }
  get maxDate() {
    let t = null;
    for (let n of this._def.checks)
      n.kind === "max" && (t === null || n.value < t) && (t = n.value);
    return t != null ? new Date(t) : null;
  }
};
so.create = (e) => new so({
  checks: [],
  coerce: e?.coerce || !1,
  typeName: T.ZodDate,
  ...V(e)
});
var lo = class extends W {
  static {
    l(this, "ZodSymbol");
  }
  _parse(t) {
    if (this._getType(t) !== N.symbol) {
      let o = this._getOrReturnCtx(t);
      return P(o, {
        code: k.invalid_type,
        expected: N.symbol,
        received: o.parsedType
      }), M;
    }
    return Oe(t.data);
  }
};
lo.create = (e) => new lo({
  typeName: T.ZodSymbol,
  ...V(e)
});
var Xr = class extends W {
  static {
    l(this, "ZodUndefined");
  }
  _parse(t) {
    if (this._getType(t) !== N.undefined) {
      let o = this._getOrReturnCtx(t);
      return P(o, {
        code: k.invalid_type,
        expected: N.undefined,
        received: o.parsedType
      }), M;
    }
    return Oe(t.data);
  }
};
Xr.create = (e) => new Xr({
  typeName: T.ZodUndefined,
  ...V(e)
});
var Yr = class extends W {
  static {
    l(this, "ZodNull");
  }
  _parse(t) {
    if (this._getType(t) !== N.null) {
      let o = this._getOrReturnCtx(t);
      return P(o, {
        code: k.invalid_type,
        expected: N.null,
        received: o.parsedType
      }), M;
    }
    return Oe(t.data);
  }
};
Yr.create = (e) => new Yr({
  typeName: T.ZodNull,
  ...V(e)
});
var uo = class extends W {
  static {
    l(this, "ZodAny");
  }
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(t) {
    return Oe(t.data);
  }
};
uo.create = (e) => new uo({
  typeName: T.ZodAny,
  ...V(e)
});
var Wt = class extends W {
  static {
    l(this, "ZodUnknown");
  }
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(t) {
    return Oe(t.data);
  }
};
Wt.create = (e) => new Wt({
  typeName: T.ZodUnknown,
  ...V(e)
});
var vt = class extends W {
  static {
    l(this, "ZodNever");
  }
  _parse(t) {
    let n = this._getOrReturnCtx(t);
    return P(n, {
      code: k.invalid_type,
      expected: N.never,
      received: n.parsedType
    }), M;
  }
};
vt.create = (e) => new vt({
  typeName: T.ZodNever,
  ...V(e)
});
var co = class extends W {
  static {
    l(this, "ZodVoid");
  }
  _parse(t) {
    if (this._getType(t) !== N.undefined) {
      let o = this._getOrReturnCtx(t);
      return P(o, {
        code: k.invalid_type,
        expected: N.void,
        received: o.parsedType
      }), M;
    }
    return Oe(t.data);
  }
};
co.create = (e) => new co({
  typeName: T.ZodVoid,
  ...V(e)
});
var Kt = class e extends W {
  static {
    l(this, "ZodArray");
  }
  _parse(t) {
    let { ctx: n, status: o } = this._processInputParams(t), r = this._def;
    if (n.parsedType !== N.array)
      return P(n, {
        code: k.invalid_type,
        expected: N.array,
        received: n.parsedType
      }), M;
    if (r.exactLength !== null) {
      let a = n.data.length > r.exactLength.value, u = n.data.length < r.exactLength.value;
      (a || u) && (P(n, {
        code: a ? k.too_big : k.too_small,
        minimum: u ? r.exactLength.value : void 0,
        maximum: a ? r.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: r.exactLength.message
      }), o.dirty());
    }
    if (r.minLength !== null && n.data.length < r.minLength.value && (P(n, {
      code: k.too_small,
      minimum: r.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.minLength.message
    }), o.dirty()), r.maxLength !== null && n.data.length > r.maxLength.value && (P(n, {
      code: k.too_big,
      maximum: r.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.maxLength.message
    }), o.dirty()), n.common.async)
      return Promise.all([...n.data].map((a, u) => r.type._parseAsync(new Qe(n, a, n.path, u)))).then((a) => we.mergeArray(o, a));
    let i = [...n.data].map((a, u) => r.type._parseSync(new Qe(n, a, n.path, u)));
    return we.mergeArray(o, i);
  }
  get element() {
    return this._def.type;
  }
  min(t, n) {
    return new e({
      ...this._def,
      minLength: { value: t, message: R.toString(n) }
    });
  }
  max(t, n) {
    return new e({
      ...this._def,
      maxLength: { value: t, message: R.toString(n) }
    });
  }
  length(t, n) {
    return new e({
      ...this._def,
      exactLength: { value: t, message: R.toString(n) }
    });
  }
  nonempty(t) {
    return this.min(1, t);
  }
};
Kt.create = (e, t) => new Kt({
  type: e,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: T.ZodArray,
  ...V(t)
});
function Kr(e) {
  if (e instanceof Be) {
    let t = {};
    for (let n in e.shape) {
      let o = e.shape[n];
      t[n] = it.create(Kr(o));
    }
    return new Be({
      ...e._def,
      shape: /* @__PURE__ */ l(() => t, "shape")
    });
  } else return e instanceof Kt ? new Kt({
    ...e._def,
    type: Kr(e.element)
  }) : e instanceof it ? it.create(Kr(e.unwrap())) : e instanceof Et ? Et.create(Kr(e.unwrap())) : e instanceof zt ? zt.create(e.items.map((t) => Kr(t))) : e;
}
l(Kr, "deepPartialify");
var Be = class e extends W {
  static {
    l(this, "ZodObject");
  }
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    let t = this._def.shape(), n = K.objectKeys(t);
    return this._cached = { shape: t, keys: n }, this._cached;
  }
  _parse(t) {
    if (this._getType(t) !== N.object) {
      let d = this._getOrReturnCtx(t);
      return P(d, {
        code: k.invalid_type,
        expected: N.object,
        received: d.parsedType
      }), M;
    }
    let { status: o, ctx: r } = this._processInputParams(t), { shape: i, keys: a } = this._getCached(), u = [];
    if (!(this._def.catchall instanceof vt && this._def.unknownKeys === "strip"))
      for (let d in r.data)
        a.includes(d) || u.push(d);
    let c = [];
    for (let d of a) {
      let p = i[d], m = r.data[d];
      c.push({
        key: { status: "valid", value: d },
        value: p._parse(new Qe(r, m, r.path, d)),
        alwaysSet: d in r.data
      });
    }
    if (this._def.catchall instanceof vt) {
      let d = this._def.unknownKeys;
      if (d === "passthrough")
        for (let p of u)
          c.push({
            key: { status: "valid", value: p },
            value: { status: "valid", value: r.data[p] }
          });
      else if (d === "strict")
        u.length > 0 && (P(r, {
          code: k.unrecognized_keys,
          keys: u
        }), o.dirty());
      else if (d !== "strip")
        throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      let d = this._def.catchall;
      for (let p of u) {
        let m = r.data[p];
        c.push({
          key: { status: "valid", value: p },
          value: d._parse(
            new Qe(r, m, r.path, p)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: p in r.data
        });
      }
    }
    return r.common.async ? Promise.resolve().then(async () => {
      let d = [];
      for (let p of c) {
        let m = await p.key, v = await p.value;
        d.push({
          key: m,
          value: v,
          alwaysSet: p.alwaysSet
        });
      }
      return d;
    }).then((d) => we.mergeObjectSync(o, d)) : we.mergeObjectSync(o, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(t) {
    return R.errToObj, new e({
      ...this._def,
      unknownKeys: "strict",
      ...t !== void 0 ? {
        errorMap: /* @__PURE__ */ l((n, o) => {
          let r = this._def.errorMap?.(n, o).message ?? o.defaultError;
          return n.code === "unrecognized_keys" ? {
            message: R.errToObj(t).message ?? r
          } : {
            message: r
          };
        }, "errorMap")
      } : {}
    });
  }
  strip() {
    return new e({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new e({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(t) {
    return new e({
      ...this._def,
      shape: /* @__PURE__ */ l(() => ({
        ...this._def.shape(),
        ...t
      }), "shape")
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(t) {
    return new e({
      unknownKeys: t._def.unknownKeys,
      catchall: t._def.catchall,
      shape: /* @__PURE__ */ l(() => ({
        ...this._def.shape(),
        ...t._def.shape()
      }), "shape"),
      typeName: T.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(t, n) {
    return this.augment({ [t]: n });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(t) {
    return new e({
      ...this._def,
      catchall: t
    });
  }
  pick(t) {
    let n = {};
    for (let o of K.objectKeys(t))
      t[o] && this.shape[o] && (n[o] = this.shape[o]);
    return new e({
      ...this._def,
      shape: /* @__PURE__ */ l(() => n, "shape")
    });
  }
  omit(t) {
    let n = {};
    for (let o of K.objectKeys(this.shape))
      t[o] || (n[o] = this.shape[o]);
    return new e({
      ...this._def,
      shape: /* @__PURE__ */ l(() => n, "shape")
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return Kr(this);
  }
  partial(t) {
    let n = {};
    for (let o of K.objectKeys(this.shape)) {
      let r = this.shape[o];
      t && !t[o] ? n[o] = r : n[o] = r.optional();
    }
    return new e({
      ...this._def,
      shape: /* @__PURE__ */ l(() => n, "shape")
    });
  }
  required(t) {
    let n = {};
    for (let o of K.objectKeys(this.shape))
      if (t && !t[o])
        n[o] = this.shape[o];
      else {
        let i = this.shape[o];
        for (; i instanceof it; )
          i = i._def.innerType;
        n[o] = i;
      }
    return new e({
      ...this._def,
      shape: /* @__PURE__ */ l(() => n, "shape")
    });
  }
  keyof() {
    return $h(K.objectKeys(this.shape));
  }
};
Be.create = (e, t) => new Be({
  shape: /* @__PURE__ */ l(() => e, "shape"),
  unknownKeys: "strip",
  catchall: vt.create(),
  typeName: T.ZodObject,
  ...V(t)
});
Be.strictCreate = (e, t) => new Be({
  shape: /* @__PURE__ */ l(() => e, "shape"),
  unknownKeys: "strict",
  catchall: vt.create(),
  typeName: T.ZodObject,
  ...V(t)
});
Be.lazycreate = (e, t) => new Be({
  shape: e,
  unknownKeys: "strip",
  catchall: vt.create(),
  typeName: T.ZodObject,
  ...V(t)
});
var Qr = class extends W {
  static {
    l(this, "ZodUnion");
  }
  _parse(t) {
    let { ctx: n } = this._processInputParams(t), o = this._def.options;
    function r(i) {
      for (let u of i)
        if (u.result.status === "valid")
          return u.result;
      for (let u of i)
        if (u.result.status === "dirty")
          return n.common.issues.push(...u.ctx.common.issues), u.result;
      let a = i.map((u) => new Je(u.ctx.common.issues));
      return P(n, {
        code: k.invalid_union,
        unionErrors: a
      }), M;
    }
    if (l(r, "handleResults"), n.common.async)
      return Promise.all(o.map(async (i) => {
        let a = {
          ...n,
          common: {
            ...n.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await i._parseAsync({
            data: n.data,
            path: n.path,
            parent: a
          }),
          ctx: a
        };
      })).then(r);
    {
      let i, a = [];
      for (let c of o) {
        let d = {
          ...n,
          common: {
            ...n.common,
            issues: []
          },
          parent: null
        }, p = c._parseSync({
          data: n.data,
          path: n.path,
          parent: d
        });
        if (p.status === "valid")
          return p;
        p.status === "dirty" && !i && (i = { result: p, ctx: d }), d.common.issues.length && a.push(d.common.issues);
      }
      if (i)
        return n.common.issues.push(...i.ctx.common.issues), i.result;
      let u = a.map((c) => new Je(c));
      return P(n, {
        code: k.invalid_union,
        unionErrors: u
      }), M;
    }
  }
  get options() {
    return this._def.options;
  }
};
Qr.create = (e, t) => new Qr({
  options: e,
  typeName: T.ZodUnion,
  ...V(t)
});
var Tt = /* @__PURE__ */ l((e) => e instanceof tn ? Tt(e.schema) : e instanceof at ? Tt(e.innerType()) : e instanceof rn ? [e.value] : e instanceof nn ? e.options : e instanceof on ? K.objectValues(e.enum) : e instanceof an ? Tt(e._def.innerType) : e instanceof Xr ? [void 0] : e instanceof Yr ? [null] : e instanceof it ? [void 0, ...Tt(e.unwrap())] : e instanceof Et ? [null, ...Tt(e.unwrap())] : e instanceof ua || e instanceof ln ? Tt(e.unwrap()) : e instanceof sn ? Tt(e._def.innerType) : [], "getDiscriminator"), xp = class e extends W {
  static {
    l(this, "ZodDiscriminatedUnion");
  }
  _parse(t) {
    let { ctx: n } = this._processInputParams(t);
    if (n.parsedType !== N.object)
      return P(n, {
        code: k.invalid_type,
        expected: N.object,
        received: n.parsedType
      }), M;
    let o = this.discriminator, r = n.data[o], i = this.optionsMap.get(r);
    return i ? n.common.async ? i._parseAsync({
      data: n.data,
      path: n.path,
      parent: n
    }) : i._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }) : (P(n, {
      code: k.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [o]
    }), M);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(t, n, o) {
    let r = /* @__PURE__ */ new Map();
    for (let i of n) {
      let a = Tt(i.shape[t]);
      if (!a.length)
        throw new Error(`A discriminator value for key \`${t}\` could not be extracted from all schema options`);
      for (let u of a) {
        if (r.has(u))
          throw new Error(`Discriminator property ${String(t)} has duplicate value ${String(u)}`);
        r.set(u, i);
      }
    }
    return new e({
      typeName: T.ZodDiscriminatedUnion,
      discriminator: t,
      options: n,
      optionsMap: r,
      ...V(o)
    });
  }
};
function $p(e, t) {
  let n = St(e), o = St(t);
  if (e === t)
    return { valid: !0, data: e };
  if (n === N.object && o === N.object) {
    let r = K.objectKeys(t), i = K.objectKeys(e).filter((u) => r.indexOf(u) !== -1), a = { ...e, ...t };
    for (let u of i) {
      let c = $p(e[u], t[u]);
      if (!c.valid)
        return { valid: !1 };
      a[u] = c.data;
    }
    return { valid: !0, data: a };
  } else if (n === N.array && o === N.array) {
    if (e.length !== t.length)
      return { valid: !1 };
    let r = [];
    for (let i = 0; i < e.length; i++) {
      let a = e[i], u = t[i], c = $p(a, u);
      if (!c.valid)
        return { valid: !1 };
      r.push(c.data);
    }
    return { valid: !0, data: r };
  } else return n === N.date && o === N.date && +e == +t ? { valid: !0, data: e } : { valid: !1 };
}
l($p, "mergeValues");
var en = class extends W {
  static {
    l(this, "ZodIntersection");
  }
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t), r = /* @__PURE__ */ l((i, a) => {
      if (yp(i) || yp(a))
        return M;
      let u = $p(i.value, a.value);
      return u.valid ? ((_p(i) || _p(a)) && n.dirty(), { status: n.value, value: u.data }) : (P(o, {
        code: k.invalid_intersection_types
      }), M);
    }, "handleParsed");
    return o.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: o.data,
        path: o.path,
        parent: o
      }),
      this._def.right._parseAsync({
        data: o.data,
        path: o.path,
        parent: o
      })
    ]).then(([i, a]) => r(i, a)) : r(this._def.left._parseSync({
      data: o.data,
      path: o.path,
      parent: o
    }), this._def.right._parseSync({
      data: o.data,
      path: o.path,
      parent: o
    }));
  }
};
en.create = (e, t, n) => new en({
  left: e,
  right: t,
  typeName: T.ZodIntersection,
  ...V(n)
});
var zt = class e extends W {
  static {
    l(this, "ZodTuple");
  }
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t);
    if (o.parsedType !== N.array)
      return P(o, {
        code: k.invalid_type,
        expected: N.array,
        received: o.parsedType
      }), M;
    if (o.data.length < this._def.items.length)
      return P(o, {
        code: k.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), M;
    !this._def.rest && o.data.length > this._def.items.length && (P(o, {
      code: k.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), n.dirty());
    let i = [...o.data].map((a, u) => {
      let c = this._def.items[u] || this._def.rest;
      return c ? c._parse(new Qe(o, a, o.path, u)) : null;
    }).filter((a) => !!a);
    return o.common.async ? Promise.all(i).then((a) => we.mergeArray(n, a)) : we.mergeArray(n, i);
  }
  get items() {
    return this._def.items;
  }
  rest(t) {
    return new e({
      ...this._def,
      rest: t
    });
  }
};
zt.create = (e, t) => {
  if (!Array.isArray(e))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new zt({
    items: e,
    typeName: T.ZodTuple,
    rest: null,
    ...V(t)
  });
};
var wp = class e extends W {
  static {
    l(this, "ZodRecord");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t);
    if (o.parsedType !== N.object)
      return P(o, {
        code: k.invalid_type,
        expected: N.object,
        received: o.parsedType
      }), M;
    let r = [], i = this._def.keyType, a = this._def.valueType;
    for (let u in o.data)
      r.push({
        key: i._parse(new Qe(o, u, o.path, u)),
        value: a._parse(new Qe(o, o.data[u], o.path, u)),
        alwaysSet: u in o.data
      });
    return o.common.async ? we.mergeObjectAsync(n, r) : we.mergeObjectSync(n, r);
  }
  get element() {
    return this._def.valueType;
  }
  static create(t, n, o) {
    return n instanceof W ? new e({
      keyType: t,
      valueType: n,
      typeName: T.ZodRecord,
      ...V(o)
    }) : new e({
      keyType: Hr.create(),
      valueType: t,
      typeName: T.ZodRecord,
      ...V(n)
    });
  }
}, po = class extends W {
  static {
    l(this, "ZodMap");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t);
    if (o.parsedType !== N.map)
      return P(o, {
        code: k.invalid_type,
        expected: N.map,
        received: o.parsedType
      }), M;
    let r = this._def.keyType, i = this._def.valueType, a = [...o.data.entries()].map(([u, c], d) => ({
      key: r._parse(new Qe(o, u, o.path, [d, "key"])),
      value: i._parse(new Qe(o, c, o.path, [d, "value"]))
    }));
    if (o.common.async) {
      let u = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (let c of a) {
          let d = await c.key, p = await c.value;
          if (d.status === "aborted" || p.status === "aborted")
            return M;
          (d.status === "dirty" || p.status === "dirty") && n.dirty(), u.set(d.value, p.value);
        }
        return { status: n.value, value: u };
      });
    } else {
      let u = /* @__PURE__ */ new Map();
      for (let c of a) {
        let d = c.key, p = c.value;
        if (d.status === "aborted" || p.status === "aborted")
          return M;
        (d.status === "dirty" || p.status === "dirty") && n.dirty(), u.set(d.value, p.value);
      }
      return { status: n.value, value: u };
    }
  }
};
po.create = (e, t, n) => new po({
  valueType: t,
  keyType: e,
  typeName: T.ZodMap,
  ...V(n)
});
var mo = class e extends W {
  static {
    l(this, "ZodSet");
  }
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t);
    if (o.parsedType !== N.set)
      return P(o, {
        code: k.invalid_type,
        expected: N.set,
        received: o.parsedType
      }), M;
    let r = this._def;
    r.minSize !== null && o.data.size < r.minSize.value && (P(o, {
      code: k.too_small,
      minimum: r.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.minSize.message
    }), n.dirty()), r.maxSize !== null && o.data.size > r.maxSize.value && (P(o, {
      code: k.too_big,
      maximum: r.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.maxSize.message
    }), n.dirty());
    let i = this._def.valueType;
    function a(c) {
      let d = /* @__PURE__ */ new Set();
      for (let p of c) {
        if (p.status === "aborted")
          return M;
        p.status === "dirty" && n.dirty(), d.add(p.value);
      }
      return { status: n.value, value: d };
    }
    l(a, "finalizeSet");
    let u = [...o.data.values()].map((c, d) => i._parse(new Qe(o, c, o.path, d)));
    return o.common.async ? Promise.all(u).then((c) => a(c)) : a(u);
  }
  min(t, n) {
    return new e({
      ...this._def,
      minSize: { value: t, message: R.toString(n) }
    });
  }
  max(t, n) {
    return new e({
      ...this._def,
      maxSize: { value: t, message: R.toString(n) }
    });
  }
  size(t, n) {
    return this.min(t, n).max(t, n);
  }
  nonempty(t) {
    return this.min(1, t);
  }
};
mo.create = (e, t) => new mo({
  valueType: e,
  minSize: null,
  maxSize: null,
  typeName: T.ZodSet,
  ...V(t)
});
var kp = class e extends W {
  static {
    l(this, "ZodFunction");
  }
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(t) {
    let { ctx: n } = this._processInputParams(t);
    if (n.parsedType !== N.function)
      return P(n, {
        code: k.invalid_type,
        expected: N.function,
        received: n.parsedType
      }), M;
    function o(u, c) {
      return la({
        data: u,
        path: n.path,
        errorMaps: [n.common.contextualErrorMap, n.schemaErrorMap, ro(), Gt].filter((d) => !!d),
        issueData: {
          code: k.invalid_arguments,
          argumentsError: c
        }
      });
    }
    l(o, "makeArgsIssue");
    function r(u, c) {
      return la({
        data: u,
        path: n.path,
        errorMaps: [n.common.contextualErrorMap, n.schemaErrorMap, ro(), Gt].filter((d) => !!d),
        issueData: {
          code: k.invalid_return_type,
          returnTypeError: c
        }
      });
    }
    l(r, "makeReturnsIssue");
    let i = { errorMap: n.common.contextualErrorMap }, a = n.data;
    if (this._def.returns instanceof mr) {
      let u = this;
      return Oe(async function(...c) {
        let d = new Je([]), p = await u._def.args.parseAsync(c, i).catch((g) => {
          throw d.addIssue(o(c, g)), d;
        }), m = await Reflect.apply(a, this, p);
        return await u._def.returns._def.type.parseAsync(m, i).catch((g) => {
          throw d.addIssue(r(m, g)), d;
        });
      });
    } else {
      let u = this;
      return Oe(function(...c) {
        let d = u._def.args.safeParse(c, i);
        if (!d.success)
          throw new Je([o(c, d.error)]);
        let p = Reflect.apply(a, this, d.data), m = u._def.returns.safeParse(p, i);
        if (!m.success)
          throw new Je([r(p, m.error)]);
        return m.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...t) {
    return new e({
      ...this._def,
      args: zt.create(t).rest(Wt.create())
    });
  }
  returns(t) {
    return new e({
      ...this._def,
      returns: t
    });
  }
  implement(t) {
    return this.parse(t);
  }
  strictImplement(t) {
    return this.parse(t);
  }
  static create(t, n, o) {
    return new e({
      args: t || zt.create([]).rest(Wt.create()),
      returns: n || Wt.create(),
      typeName: T.ZodFunction,
      ...V(o)
    });
  }
}, tn = class extends W {
  static {
    l(this, "ZodLazy");
  }
  get schema() {
    return this._def.getter();
  }
  _parse(t) {
    let { ctx: n } = this._processInputParams(t);
    return this._def.getter()._parse({ data: n.data, path: n.path, parent: n });
  }
};
tn.create = (e, t) => new tn({
  getter: e,
  typeName: T.ZodLazy,
  ...V(t)
});
var rn = class extends W {
  static {
    l(this, "ZodLiteral");
  }
  _parse(t) {
    if (t.data !== this._def.value) {
      let n = this._getOrReturnCtx(t);
      return P(n, {
        received: n.data,
        code: k.invalid_literal,
        expected: this._def.value
      }), M;
    }
    return { status: "valid", value: t.data };
  }
  get value() {
    return this._def.value;
  }
};
rn.create = (e, t) => new rn({
  value: e,
  typeName: T.ZodLiteral,
  ...V(t)
});
function $h(e, t) {
  return new nn({
    values: e,
    typeName: T.ZodEnum,
    ...V(t)
  });
}
l($h, "createZodEnum");
var nn = class e extends W {
  static {
    l(this, "ZodEnum");
  }
  _parse(t) {
    if (typeof t.data != "string") {
      let n = this._getOrReturnCtx(t), o = this._def.values;
      return P(n, {
        expected: K.joinValues(o),
        received: n.parsedType,
        code: k.invalid_type
      }), M;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(t.data)) {
      let n = this._getOrReturnCtx(t), o = this._def.values;
      return P(n, {
        received: n.data,
        code: k.invalid_enum_value,
        options: o
      }), M;
    }
    return Oe(t.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    let t = {};
    for (let n of this._def.values)
      t[n] = n;
    return t;
  }
  get Values() {
    let t = {};
    for (let n of this._def.values)
      t[n] = n;
    return t;
  }
  get Enum() {
    let t = {};
    for (let n of this._def.values)
      t[n] = n;
    return t;
  }
  extract(t, n = this._def) {
    return e.create(t, {
      ...this._def,
      ...n
    });
  }
  exclude(t, n = this._def) {
    return e.create(this.options.filter((o) => !t.includes(o)), {
      ...this._def,
      ...n
    });
  }
};
nn.create = $h;
var on = class extends W {
  static {
    l(this, "ZodNativeEnum");
  }
  _parse(t) {
    let n = K.getValidEnumValues(this._def.values), o = this._getOrReturnCtx(t);
    if (o.parsedType !== N.string && o.parsedType !== N.number) {
      let r = K.objectValues(n);
      return P(o, {
        expected: K.joinValues(r),
        received: o.parsedType,
        code: k.invalid_type
      }), M;
    }
    if (this._cache || (this._cache = new Set(K.getValidEnumValues(this._def.values))), !this._cache.has(t.data)) {
      let r = K.objectValues(n);
      return P(o, {
        received: o.data,
        code: k.invalid_enum_value,
        options: r
      }), M;
    }
    return Oe(t.data);
  }
  get enum() {
    return this._def.values;
  }
};
on.create = (e, t) => new on({
  values: e,
  typeName: T.ZodNativeEnum,
  ...V(t)
});
var mr = class extends W {
  static {
    l(this, "ZodPromise");
  }
  unwrap() {
    return this._def.type;
  }
  _parse(t) {
    let { ctx: n } = this._processInputParams(t);
    if (n.parsedType !== N.promise && n.common.async === !1)
      return P(n, {
        code: k.invalid_type,
        expected: N.promise,
        received: n.parsedType
      }), M;
    let o = n.parsedType === N.promise ? n.data : Promise.resolve(n.data);
    return Oe(o.then((r) => this._def.type.parseAsync(r, {
      path: n.path,
      errorMap: n.common.contextualErrorMap
    })));
  }
};
mr.create = (e, t) => new mr({
  type: e,
  typeName: T.ZodPromise,
  ...V(t)
});
var at = class extends W {
  static {
    l(this, "ZodEffects");
  }
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === T.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t), r = this._def.effect || null, i = {
      addIssue: /* @__PURE__ */ l((a) => {
        P(o, a), a.fatal ? n.abort() : n.dirty();
      }, "addIssue"),
      get path() {
        return o.path;
      }
    };
    if (i.addIssue = i.addIssue.bind(i), r.type === "preprocess") {
      let a = r.transform(o.data, i);
      if (o.common.async)
        return Promise.resolve(a).then(async (u) => {
          if (n.value === "aborted")
            return M;
          let c = await this._def.schema._parseAsync({
            data: u,
            path: o.path,
            parent: o
          });
          return c.status === "aborted" ? M : c.status === "dirty" ? Wr(c.value) : n.value === "dirty" ? Wr(c.value) : c;
        });
      {
        if (n.value === "aborted")
          return M;
        let u = this._def.schema._parseSync({
          data: a,
          path: o.path,
          parent: o
        });
        return u.status === "aborted" ? M : u.status === "dirty" ? Wr(u.value) : n.value === "dirty" ? Wr(u.value) : u;
      }
    }
    if (r.type === "refinement") {
      let a = /* @__PURE__ */ l((u) => {
        let c = r.refinement(u, i);
        if (o.common.async)
          return Promise.resolve(c);
        if (c instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return u;
      }, "executeRefinement");
      if (o.common.async === !1) {
        let u = this._def.schema._parseSync({
          data: o.data,
          path: o.path,
          parent: o
        });
        return u.status === "aborted" ? M : (u.status === "dirty" && n.dirty(), a(u.value), { status: n.value, value: u.value });
      } else
        return this._def.schema._parseAsync({ data: o.data, path: o.path, parent: o }).then((u) => u.status === "aborted" ? M : (u.status === "dirty" && n.dirty(), a(u.value).then(() => ({ status: n.value, value: u.value }))));
    }
    if (r.type === "transform")
      if (o.common.async === !1) {
        let a = this._def.schema._parseSync({
          data: o.data,
          path: o.path,
          parent: o
        });
        if (!pr(a))
          return M;
        let u = r.transform(a.value, i);
        if (u instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: n.value, value: u };
      } else
        return this._def.schema._parseAsync({ data: o.data, path: o.path, parent: o }).then((a) => pr(a) ? Promise.resolve(r.transform(a.value, i)).then((u) => ({
          status: n.value,
          value: u
        })) : M);
    K.assertNever(r);
  }
};
at.create = (e, t, n) => new at({
  schema: e,
  typeName: T.ZodEffects,
  effect: t,
  ...V(n)
});
at.createWithPreprocess = (e, t, n) => new at({
  schema: t,
  effect: { type: "preprocess", transform: e },
  typeName: T.ZodEffects,
  ...V(n)
});
var it = class extends W {
  static {
    l(this, "ZodOptional");
  }
  _parse(t) {
    return this._getType(t) === N.undefined ? Oe(void 0) : this._def.innerType._parse(t);
  }
  unwrap() {
    return this._def.innerType;
  }
};
it.create = (e, t) => new it({
  innerType: e,
  typeName: T.ZodOptional,
  ...V(t)
});
var Et = class extends W {
  static {
    l(this, "ZodNullable");
  }
  _parse(t) {
    return this._getType(t) === N.null ? Oe(null) : this._def.innerType._parse(t);
  }
  unwrap() {
    return this._def.innerType;
  }
};
Et.create = (e, t) => new Et({
  innerType: e,
  typeName: T.ZodNullable,
  ...V(t)
});
var an = class extends W {
  static {
    l(this, "ZodDefault");
  }
  _parse(t) {
    let { ctx: n } = this._processInputParams(t), o = n.data;
    return n.parsedType === N.undefined && (o = this._def.defaultValue()), this._def.innerType._parse({
      data: o,
      path: n.path,
      parent: n
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
an.create = (e, t) => new an({
  innerType: e,
  typeName: T.ZodDefault,
  defaultValue: typeof t.default == "function" ? t.default : () => t.default,
  ...V(t)
});
var sn = class extends W {
  static {
    l(this, "ZodCatch");
  }
  _parse(t) {
    let { ctx: n } = this._processInputParams(t), o = {
      ...n,
      common: {
        ...n.common,
        issues: []
      }
    }, r = this._def.innerType._parse({
      data: o.data,
      path: o.path,
      parent: {
        ...o
      }
    });
    return no(r) ? r.then((i) => ({
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new Je(o.common.issues);
        },
        input: o.data
      })
    })) : {
      status: "valid",
      value: r.status === "valid" ? r.value : this._def.catchValue({
        get error() {
          return new Je(o.common.issues);
        },
        input: o.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
};
sn.create = (e, t) => new sn({
  innerType: e,
  typeName: T.ZodCatch,
  catchValue: typeof t.catch == "function" ? t.catch : () => t.catch,
  ...V(t)
});
var fo = class extends W {
  static {
    l(this, "ZodNaN");
  }
  _parse(t) {
    if (this._getType(t) !== N.nan) {
      let o = this._getOrReturnCtx(t);
      return P(o, {
        code: k.invalid_type,
        expected: N.nan,
        received: o.parsedType
      }), M;
    }
    return { status: "valid", value: t.data };
  }
};
fo.create = (e) => new fo({
  typeName: T.ZodNaN,
  ...V(e)
});
var Jj = Symbol("zod_brand"), ua = class extends W {
  static {
    l(this, "ZodBranded");
  }
  _parse(t) {
    let { ctx: n } = this._processInputParams(t), o = n.data;
    return this._def.type._parse({
      data: o,
      path: n.path,
      parent: n
    });
  }
  unwrap() {
    return this._def.type;
  }
}, ca = class e extends W {
  static {
    l(this, "ZodPipeline");
  }
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t);
    if (o.common.async)
      return (/* @__PURE__ */ l(async () => {
        let i = await this._def.in._parseAsync({
          data: o.data,
          path: o.path,
          parent: o
        });
        return i.status === "aborted" ? M : i.status === "dirty" ? (n.dirty(), Wr(i.value)) : this._def.out._parseAsync({
          data: i.value,
          path: o.path,
          parent: o
        });
      }, "handleAsync"))();
    {
      let r = this._def.in._parseSync({
        data: o.data,
        path: o.path,
        parent: o
      });
      return r.status === "aborted" ? M : r.status === "dirty" ? (n.dirty(), {
        status: "dirty",
        value: r.value
      }) : this._def.out._parseSync({
        data: r.value,
        path: o.path,
        parent: o
      });
    }
  }
  static create(t, n) {
    return new e({
      in: t,
      out: n,
      typeName: T.ZodPipeline
    });
  }
}, ln = class extends W {
  static {
    l(this, "ZodReadonly");
  }
  _parse(t) {
    let n = this._def.innerType._parse(t), o = /* @__PURE__ */ l((r) => (pr(r) && (r.value = Object.freeze(r.value)), r), "freeze");
    return no(n) ? n.then((r) => o(r)) : o(n);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ln.create = (e, t) => new ln({
  innerType: e,
  typeName: T.ZodReadonly,
  ...V(t)
});
var Bj = {
  object: Be.lazycreate
}, T;
(function(e) {
  e.ZodString = "ZodString", e.ZodNumber = "ZodNumber", e.ZodNaN = "ZodNaN", e.ZodBigInt = "ZodBigInt", e.ZodBoolean = "ZodBoolean", e.ZodDate = "ZodDate", e.ZodSymbol = "ZodSymbol", e.ZodUndefined = "ZodUndefined", e.ZodNull = "ZodNull", e.ZodAny = "ZodAny", e.ZodUnknown = "ZodUnknown", e.ZodNever = "ZodNever", e.ZodVoid = "ZodVoid", e.ZodArray = "ZodArray", e.ZodObject = "ZodObject", e.ZodUnion = "ZodUnion", e.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", e.ZodIntersection = "ZodIntersection", e.ZodTuple = "ZodTuple", e.ZodRecord = "ZodRecord", e.ZodMap = "ZodMap", e.ZodSet = "ZodSet", e.ZodFunction = "ZodFunction", e.ZodLazy = "ZodLazy", e.ZodLiteral = "ZodLiteral", e.ZodEnum = "ZodEnum", e.ZodEffects = "ZodEffects", e.ZodNativeEnum = "ZodNativeEnum", e.ZodOptional = "ZodOptional", e.ZodNullable = "ZodNullable", e.ZodDefault = "ZodDefault", e.ZodCatch = "ZodCatch", e.ZodPromise = "ZodPromise", e.ZodBranded = "ZodBranded", e.ZodPipeline = "ZodPipeline", e.ZodReadonly = "ZodReadonly";
})(T || (T = {}));
var Gj = Hr.create, Wj = oo.create, Kj = fo.create, Hj = io.create, Xj = ao.create, Yj = so.create, Qj = lo.create, eP = Xr.create, tP = Yr.create, rP = uo.create, nP = Wt.create, oP = vt.create, iP = co.create, aP = Kt.create, sP = Be.create, lP = Be.strictCreate, uP = Qr.create, cP = xp.create, dP = en.create, pP = zt.create, mP = wp.create, fP = po.create, gP = mo.create, hP = kp.create, vP = tn.create, yP = rn.create, _P = nn.create, bP = on.create, xP = mr.create, $P = at.create, wP = it.create, kP = Et.create, IP = at.createWithPreprocess, SP = ca.create;

// node_modules/@ai-sdk/provider-utils/dist/index.mjs
function le(...e) {
  return e.reduce(
    (t, n) => ({
      ...t,
      ...n ?? {}
    }),
    {}
  );
}
l(le, "combineHeaders");
async function Th(e, t) {
  if (e == null)
    return Promise.resolve();
  let n = t?.abortSignal;
  return new Promise((o, r) => {
    if (n?.aborted) {
      r(wh());
      return;
    }
    let i = setTimeout(() => {
      a(), o();
    }, e), a = /* @__PURE__ */ l(() => {
      clearTimeout(i), n?.removeEventListener("abort", u);
    }, "cleanup"), u = /* @__PURE__ */ l(() => {
      a(), r(wh());
    }, "onAbort");
    n?.addEventListener("abort", u);
  });
}
l(Th, "delay");
function wh() {
  return new DOMException("Delay was aborted", "AbortError");
}
l(wh, "createAbortError");
function un(e) {
  return Object.fromEntries([...e.headers]);
}
l(un, "extractResponseHeaders");
var Ot = /* @__PURE__ */ l(({
  prefix: e,
  size: t = 16,
  alphabet: n = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  separator: o = "-"
} = {}) => {
  let r = /* @__PURE__ */ l(() => {
    let i = n.length, a = new Array(t);
    for (let u = 0; u < t; u++)
      a[u] = n[Math.random() * i | 0];
    return a.join("");
  }, "generator");
  if (e == null)
    return r;
  if (n.includes(o))
    throw new oa({
      argument: "separator",
      message: `The separator "${o}" must not be part of the alphabet "${n}".`
    });
  return () => `${e}${o}${r()}`;
}, "createIdGenerator"), We = Ot();
function ma(e) {
  return e == null ? "unknown error" : typeof e == "string" ? e : e instanceof Error ? e.message : JSON.stringify(e);
}
l(ma, "getErrorMessage");
function Ht(e) {
  return (e instanceof Error || e instanceof DOMException) && (e.name === "AbortError" || e.name === "ResponseAborted" || // Next.js
  e.name === "TimeoutError");
}
l(Ht, "isAbortError");
var z$ = ["fetch failed", "failed to fetch"];
function zh({
  error: e,
  url: t,
  requestBodyValues: n
}) {
  if (Ht(e))
    return e;
  if (e instanceof TypeError && z$.includes(e.message.toLowerCase())) {
    let o = e.cause;
    if (o != null)
      return new se({
        message: `Cannot connect to API: ${o.message}`,
        cause: o,
        url: t,
        requestBodyValues: n,
        isRetryable: !0
        // retry when network error
      });
  }
  return e;
}
l(zh, "handleFetchError");
function fa(e = globalThis) {
  var t, n, o;
  return e.window ? "runtime/browser" : (t = e.navigator) != null && t.userAgent ? `runtime/${e.navigator.userAgent.toLowerCase()}` : (o = (n = e.process) == null ? void 0 : n.versions) != null && o.node ? `runtime/node.js/${e.process.version.substring(0)}` : e.EdgeRuntime ? "runtime/vercel-edge" : "runtime/unknown";
}
l(fa, "getRuntimeEnvironmentUserAgent");
function E$(e) {
  if (e == null)
    return {};
  let t = {};
  if (e instanceof Headers)
    e.forEach((n, o) => {
      t[o.toLowerCase()] = n;
    });
  else {
    Array.isArray(e) || (e = Object.entries(e));
    for (let [n, o] of e)
      o != null && (t[n.toLowerCase()] = o);
  }
  return t;
}
l(E$, "normalizeHeaders");
function ut(e, ...t) {
  let n = new Headers(E$(e)), o = n.get("user-agent") || "";
  return n.set(
    "user-agent",
    [o, ...t].filter(Boolean).join(" ")
  ), Object.fromEntries(n.entries());
}
l(ut, "withUserAgentSuffix");
var Eh = "3.0.20", O$ = /* @__PURE__ */ l(() => globalThis.fetch, "getOriginalFetch"), Ep = /* @__PURE__ */ l(async ({
  url: e,
  headers: t = {},
  successfulResponseHandler: n,
  failedResponseHandler: o,
  abortSignal: r,
  fetch: i = O$()
}) => {
  try {
    let a = await i(e, {
      method: "GET",
      headers: ut(
        t,
        `ai-sdk/provider-utils/${Eh}`,
        fa()
      ),
      signal: r
    }), u = un(a);
    if (!a.ok) {
      let c;
      try {
        c = await o({
          response: a,
          url: e,
          requestBodyValues: {}
        });
      } catch (d) {
        throw Ht(d) || se.isInstance(d) ? d : new se({
          message: "Failed to process error response",
          cause: d,
          statusCode: a.status,
          url: e,
          responseHeaders: u,
          requestBodyValues: {}
        });
      }
      throw c.value;
    }
    try {
      return await n({
        response: a,
        url: e,
        requestBodyValues: {}
      });
    } catch (c) {
      throw c instanceof Error && (Ht(c) || se.isInstance(c)) ? c : new se({
        message: "Failed to process successful response",
        cause: c,
        statusCode: a.status,
        url: e,
        responseHeaders: u,
        requestBodyValues: {}
      });
    }
  } catch (a) {
    throw zh({ error: a, url: e, requestBodyValues: {} });
  }
}, "getFromApi");
function Oh({
  mediaType: e,
  url: t,
  supportedUrls: n
}) {
  return t = t.toLowerCase(), e = e.toLowerCase(), Object.entries(n).map(([o, r]) => {
    let i = o.toLowerCase();
    return i === "*" || i === "*/*" ? { mediaTypePrefix: "", regexes: r } : { mediaTypePrefix: i.replace(/\*/, ""), regexes: r };
  }).filter(({ mediaTypePrefix: o }) => e.startsWith(o)).flatMap(({ regexes: o }) => o).some((o) => o.test(t));
}
l(Oh, "isUrlSupported");
function jh({
  apiKey: e,
  environmentVariableName: t,
  apiKeyParameterName: n = "apiKey",
  description: o
}) {
  if (typeof e == "string")
    return e;
  if (e != null)
    throw new to({
      message: `${o} API key must be a string.`
    });
  if (typeof process > "u")
    throw new to({
      message: `${o} API key is missing. Pass it using the '${n}' parameter. Environment variables is not supported in this environment.`
    });
  if (e = process.env[t], e == null)
    throw new to({
      message: `${o} API key is missing. Pass it using the '${n}' parameter or the ${t} environment variable.`
    });
  if (typeof e != "string")
    throw new to({
      message: `${o} API key must be a string. The value of the ${t} environment variable is not a string.`
    });
  return e;
}
l(jh, "loadApiKey");
function fr({
  settingValue: e,
  environmentVariableName: t
}) {
  if (typeof e == "string")
    return e;
  if (!(e != null || typeof process > "u") && (e = process.env[t], !(e == null || typeof e != "string")))
    return e;
}
l(fr, "loadOptionalSetting");
function Ph(e) {
  var t;
  let [n, o = ""] = e.toLowerCase().split("/");
  return (t = {
    mpeg: "mp3",
    "x-wav": "wav",
    opus: "ogg",
    mp4: "m4a",
    "x-m4a": "m4a"
  }[o]) != null ? t : o;
}
l(Ph, "mediaTypeToExtension");
var j$ = /"__proto__"\s*:/, P$ = /"constructor"\s*:/;
function kh(e) {
  let t = JSON.parse(e);
  return t === null || typeof t != "object" || j$.test(e) === !1 && P$.test(e) === !1 ? t : N$(t);
}
l(kh, "_parse");
function N$(e) {
  let t = [e];
  for (; t.length; ) {
    let n = t;
    t = [];
    for (let o of n) {
      if (Object.prototype.hasOwnProperty.call(o, "__proto__"))
        throw new SyntaxError("Object contains forbidden prototype property");
      if (Object.prototype.hasOwnProperty.call(o, "constructor") && Object.prototype.hasOwnProperty.call(o.constructor, "prototype"))
        throw new SyntaxError("Object contains forbidden prototype property");
      for (let r in o) {
        let i = o[r];
        i && typeof i == "object" && t.push(i);
      }
    }
  }
  return e;
}
l(N$, "filter");
function Op(e) {
  let { stackTraceLimit: t } = Error;
  try {
    Error.stackTraceLimit = 0;
  } catch {
    return kh(e);
  }
  try {
    return kh(e);
  } finally {
    Error.stackTraceLimit = t;
  }
}
l(Op, "secureJsonParse");
var pa = Symbol.for("vercel.ai.validator");
function A$(e) {
  return { [pa]: !0, validate: e };
}
l(A$, "validator");
function R$(e) {
  return typeof e == "object" && e !== null && pa in e && e[pa] === !0 && "validate" in e;
}
l(R$, "isValidator");
function q(e) {
  let t;
  return () => (t == null && (t = e()), t);
}
l(q, "lazyValidator");
function C$(e) {
  return R$(e) ? e : typeof e == "function" ? e() : D$(e);
}
l(C$, "asValidator");
function D$(e) {
  return A$(async (t) => {
    let n = await e["~standard"].validate(t);
    return n.issues == null ? { success: !0, value: n.value } : {
      success: !1,
      error: new Bt({
        value: t,
        cause: n.issues
      })
    };
  });
}
l(D$, "standardSchemaValidator");
async function ct({
  value: e,
  schema: t
}) {
  let n = await Le({ value: e, schema: t });
  if (!n.success)
    throw Bt.wrap({ value: e, cause: n.error });
  return n.value;
}
l(ct, "validateTypes");
async function Le({
  value: e,
  schema: t
}) {
  let n = C$(t);
  try {
    if (n.validate == null)
      return { success: !0, value: e, rawValue: e };
    let o = await n.validate(e);
    return o.success ? { success: !0, value: o.value, rawValue: e } : {
      success: !1,
      error: Bt.wrap({ value: e, cause: o.error }),
      rawValue: e
    };
  } catch (o) {
    return {
      success: !1,
      error: Bt.wrap({ value: e, cause: o }),
      rawValue: e
    };
  }
}
l(Le, "safeValidateTypes");
async function U$({
  text: e,
  schema: t
}) {
  try {
    let n = Op(e);
    return t == null ? n : ct({ value: n, schema: t });
  } catch (n) {
    throw eo.isInstance(n) || Bt.isInstance(n) ? n : new eo({ text: e, cause: n });
  }
}
l(U$, "parseJSON");
async function yt({
  text: e,
  schema: t
}) {
  try {
    let n = Op(e);
    return t == null ? { success: !0, value: n, rawValue: n } : await Le({ value: n, schema: t });
  } catch (n) {
    return {
      success: !1,
      error: eo.isInstance(n) ? n : new eo({ text: e, cause: n }),
      rawValue: void 0
    };
  }
}
l(yt, "safeParseJSON");
function jp(e) {
  try {
    return Op(e), !0;
  } catch {
    return !1;
  }
}
l(jp, "isParsableJson");
function M$({
  stream: e,
  schema: t
}) {
  return e.pipeThrough(new TextDecoderStream()).pipeThrough(new sa()).pipeThrough(
    new TransformStream({
      async transform({ data: n }, o) {
        n !== "[DONE]" && o.enqueue(await yt({ text: n, schema: t }));
      }
    })
  );
}
l(M$, "parseJsonEventStream");
async function Pe({
  provider: e,
  providerOptions: t,
  schema: n
}) {
  if (t?.[e] == null)
    return;
  let o = await Le({
    value: t[e],
    schema: n
  });
  if (!o.success)
    throw new oa({
      argument: "providerOptions",
      message: `invalid ${e} provider options`,
      cause: o.error
    });
  return o.value;
}
l(Pe, "parseProviderOptions");
var Z$ = /* @__PURE__ */ l(() => globalThis.fetch, "getOriginalFetch2"), pe = /* @__PURE__ */ l(async ({
  url: e,
  headers: t,
  body: n,
  failedResponseHandler: o,
  successfulResponseHandler: r,
  abortSignal: i,
  fetch: a
}) => Ah({
  url: e,
  headers: {
    "Content-Type": "application/json",
    ...t
  },
  body: {
    content: JSON.stringify(n),
    values: n
  },
  failedResponseHandler: o,
  successfulResponseHandler: r,
  abortSignal: i,
  fetch: a
}), "postJsonToApi"), Nh = /* @__PURE__ */ l(async ({
  url: e,
  headers: t,
  formData: n,
  failedResponseHandler: o,
  successfulResponseHandler: r,
  abortSignal: i,
  fetch: a
}) => Ah({
  url: e,
  headers: t,
  body: {
    content: n,
    values: Object.fromEntries(n.entries())
  },
  failedResponseHandler: o,
  successfulResponseHandler: r,
  abortSignal: i,
  fetch: a
}), "postFormDataToApi"), Ah = /* @__PURE__ */ l(async ({
  url: e,
  headers: t = {},
  body: n,
  successfulResponseHandler: o,
  failedResponseHandler: r,
  abortSignal: i,
  fetch: a = Z$()
}) => {
  try {
    let u = await a(e, {
      method: "POST",
      headers: ut(
        t,
        `ai-sdk/provider-utils/${Eh}`,
        fa()
      ),
      body: n.content,
      signal: i
    }), c = un(u);
    if (!u.ok) {
      let d;
      try {
        d = await r({
          response: u,
          url: e,
          requestBodyValues: n.values
        });
      } catch (p) {
        throw Ht(p) || se.isInstance(p) ? p : new se({
          message: "Failed to process error response",
          cause: p,
          statusCode: u.status,
          url: e,
          responseHeaders: c,
          requestBodyValues: n.values
        });
      }
      throw d.value;
    }
    try {
      return await o({
        response: u,
        url: e,
        requestBodyValues: n.values
      });
    } catch (d) {
      throw d instanceof Error && (Ht(d) || se.isInstance(d)) ? d : new se({
        message: "Failed to process successful response",
        cause: d,
        statusCode: u.status,
        url: e,
        responseHeaders: c,
        requestBodyValues: n.values
      });
    }
  } catch (u) {
    throw zh({ error: u, url: e, requestBodyValues: n.values });
  }
}, "postToApi");
function et({
  id: e,
  name: t,
  inputSchema: n,
  outputSchema: o
}) {
  return ({
    execute: r,
    toModelOutput: i,
    onInputStart: a,
    onInputDelta: u,
    onInputAvailable: c,
    ...d
  }) => ({
    type: "provider-defined",
    id: e,
    name: t,
    args: d,
    inputSchema: n,
    outputSchema: o,
    execute: r,
    toModelOutput: i,
    onInputStart: a,
    onInputDelta: u,
    onInputAvailable: c
  });
}
l(et, "createProviderDefinedToolFactoryWithOutputSchema");
async function Fe(e) {
  return typeof e == "function" && (e = e()), Promise.resolve(e);
}
l(Fe, "resolve");
var tt = /* @__PURE__ */ l(({
  errorSchema: e,
  errorToMessage: t,
  isRetryable: n
}) => async ({ response: o, url: r, requestBodyValues: i }) => {
  let a = await o.text(), u = un(o);
  if (a.trim() === "")
    return {
      responseHeaders: u,
      value: new se({
        message: o.statusText,
        url: r,
        requestBodyValues: i,
        statusCode: o.status,
        responseHeaders: u,
        responseBody: a,
        isRetryable: n?.(o)
      })
    };
  try {
    let c = await U$({
      text: a,
      schema: e
    });
    return {
      responseHeaders: u,
      value: new se({
        message: t(c),
        url: r,
        requestBodyValues: i,
        statusCode: o.status,
        responseHeaders: u,
        responseBody: a,
        data: c,
        isRetryable: n?.(o, c)
      })
    };
  } catch {
    return {
      responseHeaders: u,
      value: new se({
        message: o.statusText,
        url: r,
        requestBodyValues: i,
        statusCode: o.status,
        responseHeaders: u,
        responseBody: a,
        isRetryable: n?.(o)
      })
    };
  }
}, "createJsonErrorResponseHandler"), Xt = /* @__PURE__ */ l((e) => async ({ response: t }) => {
  let n = un(t);
  if (t.body == null)
    throw new Gg({});
  return {
    responseHeaders: n,
    value: M$({
      stream: t.body,
      schema: e
    })
  };
}, "createEventSourceResponseHandler");
var he = /* @__PURE__ */ l((e) => async ({ response: t, url: n, requestBodyValues: o }) => {
  let r = await t.text(), i = await yt({
    text: r,
    schema: e
  }), a = un(t);
  if (!i.success)
    throw new se({
      message: "Invalid JSON response",
      cause: i.error,
      statusCode: t.status,
      responseHeaders: a,
      responseBody: r,
      url: n,
      requestBodyValues: o
    });
  return {
    responseHeaders: a,
    value: i.value,
    rawValue: i.rawValue
  };
}, "createJsonResponseHandler"), Rh = /* @__PURE__ */ l(() => async ({ response: e, url: t, requestBodyValues: n }) => {
  let o = un(e);
  if (!e.body)
    throw new se({
      message: "Response body is empty",
      url: t,
      requestBodyValues: n,
      statusCode: e.status,
      responseHeaders: o,
      responseBody: void 0
    });
  try {
    let r = await e.arrayBuffer();
    return {
      responseHeaders: o,
      value: new Uint8Array(r)
    };
  } catch (r) {
    throw new se({
      message: "Failed to read response as array buffer",
      url: t,
      requestBodyValues: n,
      statusCode: e.status,
      responseHeaders: o,
      responseBody: void 0,
      cause: r
    });
  }
}, "createBinaryResponseHandler");
function da(e) {
  if (e.type === "object") {
    e.additionalProperties = !1;
    let t = e.properties;
    if (t != null)
      for (let n in t)
        t[n] = da(
          t[n]
        );
  }
  return e.type === "array" && e.items != null && (Array.isArray(e.items) ? e.items = e.items.map(
    (t) => da(t)
  ) : e.items = da(
    e.items
  )), e;
}
l(da, "addAdditionalPropertiesToJsonSchema");
var L$ = /* @__PURE__ */ l((e, t) => {
  let n = 0;
  for (; n < e.length && n < t.length && e[n] === t[n]; n++)
    ;
  return [(e.length - n).toString(), ...t.slice(n)].join("/");
}, "getRelativePath"), F$ = Symbol(
  "Let zodToJsonSchema decide on which parser to use"
), Ih = {
  name: void 0,
  $refStrategy: "root",
  basePath: ["#"],
  effectStrategy: "input",
  pipeStrategy: "all",
  dateStrategy: "format:date-time",
  mapStrategy: "entries",
  removeAdditionalStrategy: "passthrough",
  allowedAdditionalProperties: !0,
  rejectedAdditionalProperties: !1,
  definitionPath: "definitions",
  strictUnions: !1,
  definitions: {},
  errorMessages: !1,
  patternStrategy: "escape",
  applyRegexFlags: !1,
  emailStrategy: "format:email",
  base64Strategy: "contentEncoding:base64",
  nameStrategy: "ref"
}, V$ = /* @__PURE__ */ l((e) => typeof e == "string" ? {
  ...Ih,
  name: e
} : {
  ...Ih,
  ...e
}, "getDefaultOptions");
function Ge() {
  return {};
}
l(Ge, "parseAnyDef");
function q$(e, t) {
  var n, o, r;
  let i = {
    type: "array"
  };
  return (n = e.type) != null && n._def && ((r = (o = e.type) == null ? void 0 : o._def) == null ? void 0 : r.typeName) !== T.ZodAny && (i.items = te(e.type._def, {
    ...t,
    currentPath: [...t.currentPath, "items"]
  })), e.minLength && (i.minItems = e.minLength.value), e.maxLength && (i.maxItems = e.maxLength.value), e.exactLength && (i.minItems = e.exactLength.value, i.maxItems = e.exactLength.value), i;
}
l(q$, "parseArrayDef");
function J$(e) {
  let t = {
    type: "integer",
    format: "int64"
  };
  if (!e.checks) return t;
  for (let n of e.checks)
    switch (n.kind) {
      case "min":
        n.inclusive ? t.minimum = n.value : t.exclusiveMinimum = n.value;
        break;
      case "max":
        n.inclusive ? t.maximum = n.value : t.exclusiveMaximum = n.value;
        break;
      case "multipleOf":
        t.multipleOf = n.value;
        break;
    }
  return t;
}
l(J$, "parseBigintDef");
function B$() {
  return { type: "boolean" };
}
l(B$, "parseBooleanDef");
function Ch(e, t) {
  return te(e.type._def, t);
}
l(Ch, "parseBrandedDef");
var G$ = /* @__PURE__ */ l((e, t) => te(e.innerType._def, t), "parseCatchDef");
function Dh(e, t, n) {
  let o = n ?? t.dateStrategy;
  if (Array.isArray(o))
    return {
      anyOf: o.map((r, i) => Dh(e, t, r))
    };
  switch (o) {
    case "string":
    case "format:date-time":
      return {
        type: "string",
        format: "date-time"
      };
    case "format:date":
      return {
        type: "string",
        format: "date"
      };
    case "integer":
      return W$(e);
  }
}
l(Dh, "parseDateDef");
var W$ = /* @__PURE__ */ l((e) => {
  let t = {
    type: "integer",
    format: "unix-time"
  };
  for (let n of e.checks)
    switch (n.kind) {
      case "min":
        t.minimum = n.value;
        break;
      case "max":
        t.maximum = n.value;
        break;
    }
  return t;
}, "integerDateParser");
function K$(e, t) {
  return {
    ...te(e.innerType._def, t),
    default: e.defaultValue()
  };
}
l(K$, "parseDefaultDef");
function H$(e, t) {
  return t.effectStrategy === "input" ? te(e.schema._def, t) : Ge();
}
l(H$, "parseEffectsDef");
function X$(e) {
  return {
    type: "string",
    enum: Array.from(e.values)
  };
}
l(X$, "parseEnumDef");
var Y$ = /* @__PURE__ */ l((e) => "type" in e && e.type === "string" ? !1 : "allOf" in e, "isJsonSchema7AllOfType");
function Q$(e, t) {
  let n = [
    te(e.left._def, {
      ...t,
      currentPath: [...t.currentPath, "allOf", "0"]
    }),
    te(e.right._def, {
      ...t,
      currentPath: [...t.currentPath, "allOf", "1"]
    })
  ].filter((r) => !!r), o = [];
  return n.forEach((r) => {
    if (Y$(r))
      o.push(...r.allOf);
    else {
      let i = r;
      if ("additionalProperties" in r && r.additionalProperties === !1) {
        let { additionalProperties: a, ...u } = r;
        i = u;
      }
      o.push(i);
    }
  }), o.length ? { allOf: o } : void 0;
}
l(Q$, "parseIntersectionDef");
function ew(e) {
  let t = typeof e.value;
  return t !== "bigint" && t !== "number" && t !== "boolean" && t !== "string" ? {
    type: Array.isArray(e.value) ? "array" : "object"
  } : {
    type: t === "bigint" ? "integer" : t,
    const: e.value
  };
}
l(ew, "parseLiteralDef");
var Ip = void 0, st = {
  /**
   * `c` was changed to `[cC]` to replicate /i flag
   */
  cuid: /^[cC][^\s-]{8,}$/,
  cuid2: /^[0-9a-z]+$/,
  ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
  /**
   * `a-z` was added to replicate /i flag
   */
  email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
  /**
   * Constructed a valid Unicode RegExp
   *
   * Lazily instantiate since this type of regex isn't supported
   * in all envs (e.g. React Native).
   *
   * See:
   * https://github.com/colinhacks/zod/issues/2433
   * Fix in Zod:
   * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
   */
  emoji: /* @__PURE__ */ l(() => (Ip === void 0 && (Ip = RegExp(
    "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",
    "u"
  )), Ip), "emoji"),
  /**
   * Unused
   */
  uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  /**
   * Unused
   */
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  /**
   * Unused
   */
  ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
  ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  nanoid: /^[a-zA-Z0-9_-]{21}$/,
  jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function Uh(e, t) {
  let n = {
    type: "string"
  };
  if (e.checks)
    for (let o of e.checks)
      switch (o.kind) {
        case "min":
          n.minLength = typeof n.minLength == "number" ? Math.max(n.minLength, o.value) : o.value;
          break;
        case "max":
          n.maxLength = typeof n.maxLength == "number" ? Math.min(n.maxLength, o.value) : o.value;
          break;
        case "email":
          switch (t.emailStrategy) {
            case "format:email":
              lt(n, "email", o.message, t);
              break;
            case "format:idn-email":
              lt(n, "idn-email", o.message, t);
              break;
            case "pattern:zod":
              je(n, st.email, o.message, t);
              break;
          }
          break;
        case "url":
          lt(n, "uri", o.message, t);
          break;
        case "uuid":
          lt(n, "uuid", o.message, t);
          break;
        case "regex":
          je(n, o.regex, o.message, t);
          break;
        case "cuid":
          je(n, st.cuid, o.message, t);
          break;
        case "cuid2":
          je(n, st.cuid2, o.message, t);
          break;
        case "startsWith":
          je(
            n,
            RegExp(`^${Sp(o.value, t)}`),
            o.message,
            t
          );
          break;
        case "endsWith":
          je(
            n,
            RegExp(`${Sp(o.value, t)}$`),
            o.message,
            t
          );
          break;
        case "datetime":
          lt(n, "date-time", o.message, t);
          break;
        case "date":
          lt(n, "date", o.message, t);
          break;
        case "time":
          lt(n, "time", o.message, t);
          break;
        case "duration":
          lt(n, "duration", o.message, t);
          break;
        case "length":
          n.minLength = typeof n.minLength == "number" ? Math.max(n.minLength, o.value) : o.value, n.maxLength = typeof n.maxLength == "number" ? Math.min(n.maxLength, o.value) : o.value;
          break;
        case "includes": {
          je(
            n,
            RegExp(Sp(o.value, t)),
            o.message,
            t
          );
          break;
        }
        case "ip": {
          o.version !== "v6" && lt(n, "ipv4", o.message, t), o.version !== "v4" && lt(n, "ipv6", o.message, t);
          break;
        }
        case "base64url":
          je(n, st.base64url, o.message, t);
          break;
        case "jwt":
          je(n, st.jwt, o.message, t);
          break;
        case "cidr": {
          o.version !== "v6" && je(n, st.ipv4Cidr, o.message, t), o.version !== "v4" && je(n, st.ipv6Cidr, o.message, t);
          break;
        }
        case "emoji":
          je(n, st.emoji(), o.message, t);
          break;
        case "ulid": {
          je(n, st.ulid, o.message, t);
          break;
        }
        case "base64": {
          switch (t.base64Strategy) {
            case "format:binary": {
              lt(n, "binary", o.message, t);
              break;
            }
            case "contentEncoding:base64": {
              n.contentEncoding = "base64";
              break;
            }
            case "pattern:zod": {
              je(n, st.base64, o.message, t);
              break;
            }
          }
          break;
        }
        case "nanoid":
          je(n, st.nanoid, o.message, t);
        case "toLowerCase":
        case "toUpperCase":
        case "trim":
          break;
        default:
      }
  return n;
}
l(Uh, "parseStringDef");
function Sp(e, t) {
  return t.patternStrategy === "escape" ? rw(e) : e;
}
l(Sp, "escapeLiteralCheckValue");
var tw = new Set(
  "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789"
);
function rw(e) {
  let t = "";
  for (let n = 0; n < e.length; n++)
    tw.has(e[n]) || (t += "\\"), t += e[n];
  return t;
}
l(rw, "escapeNonAlphaNumeric");
function lt(e, t, n, o) {
  var r;
  e.format || (r = e.anyOf) != null && r.some((i) => i.format) ? (e.anyOf || (e.anyOf = []), e.format && (e.anyOf.push({
    format: e.format
  }), delete e.format), e.anyOf.push({
    format: t,
    ...n && o.errorMessages && { errorMessage: { format: n } }
  })) : e.format = t;
}
l(lt, "addFormat");
function je(e, t, n, o) {
  var r;
  e.pattern || (r = e.allOf) != null && r.some((i) => i.pattern) ? (e.allOf || (e.allOf = []), e.pattern && (e.allOf.push({
    pattern: e.pattern
  }), delete e.pattern), e.allOf.push({
    pattern: Sh(t, o),
    ...n && o.errorMessages && { errorMessage: { pattern: n } }
  })) : e.pattern = Sh(t, o);
}
l(je, "addPattern");
function Sh(e, t) {
  var n;
  if (!t.applyRegexFlags || !e.flags)
    return e.source;
  let o = {
    i: e.flags.includes("i"),
    // Case-insensitive
    m: e.flags.includes("m"),
    // `^` and `$` matches adjacent to newline characters
    s: e.flags.includes("s")
    // `.` matches newlines
  }, r = o.i ? e.source.toLowerCase() : e.source, i = "", a = !1, u = !1, c = !1;
  for (let d = 0; d < r.length; d++) {
    if (a) {
      i += r[d], a = !1;
      continue;
    }
    if (o.i) {
      if (u) {
        if (r[d].match(/[a-z]/)) {
          c ? (i += r[d], i += `${r[d - 2]}-${r[d]}`.toUpperCase(), c = !1) : r[d + 1] === "-" && ((n = r[d + 2]) != null && n.match(/[a-z]/)) ? (i += r[d], c = !0) : i += `${r[d]}${r[d].toUpperCase()}`;
          continue;
        }
      } else if (r[d].match(/[a-z]/)) {
        i += `[${r[d]}${r[d].toUpperCase()}]`;
        continue;
      }
    }
    if (o.m) {
      if (r[d] === "^") {
        i += `(^|(?<=[\r
]))`;
        continue;
      } else if (r[d] === "$") {
        i += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (o.s && r[d] === ".") {
      i += u ? `${r[d]}\r
` : `[${r[d]}\r
]`;
      continue;
    }
    i += r[d], r[d] === "\\" ? a = !0 : u && r[d] === "]" ? u = !1 : !u && r[d] === "[" && (u = !0);
  }
  try {
    new RegExp(i);
  } catch {
    return console.warn(
      `Could not convert regex pattern at ${t.currentPath.join(
        "/"
      )} to a flag-independent form! Falling back to the flag-ignorant source`
    ), e.source;
  }
  return i;
}
l(Sh, "stringifyRegExpWithFlags");
function Mh(e, t) {
  var n, o, r, i, a, u;
  let c = {
    type: "object",
    additionalProperties: (n = te(e.valueType._def, {
      ...t,
      currentPath: [...t.currentPath, "additionalProperties"]
    })) != null ? n : t.allowedAdditionalProperties
  };
  if (((o = e.keyType) == null ? void 0 : o._def.typeName) === T.ZodString && ((r = e.keyType._def.checks) != null && r.length)) {
    let { type: d, ...p } = Uh(e.keyType._def, t);
    return {
      ...c,
      propertyNames: p
    };
  } else {
    if (((i = e.keyType) == null ? void 0 : i._def.typeName) === T.ZodEnum)
      return {
        ...c,
        propertyNames: {
          enum: e.keyType._def.values
        }
      };
    if (((a = e.keyType) == null ? void 0 : a._def.typeName) === T.ZodBranded && e.keyType._def.type._def.typeName === T.ZodString && ((u = e.keyType._def.type._def.checks) != null && u.length)) {
      let { type: d, ...p } = Ch(
        e.keyType._def,
        t
      );
      return {
        ...c,
        propertyNames: p
      };
    }
  }
  return c;
}
l(Mh, "parseRecordDef");
function nw(e, t) {
  if (t.mapStrategy === "record")
    return Mh(e, t);
  let n = te(e.keyType._def, {
    ...t,
    currentPath: [...t.currentPath, "items", "items", "0"]
  }) || Ge(), o = te(e.valueType._def, {
    ...t,
    currentPath: [...t.currentPath, "items", "items", "1"]
  }) || Ge();
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [n, o],
      minItems: 2,
      maxItems: 2
    }
  };
}
l(nw, "parseMapDef");
function ow(e) {
  let t = e.values, o = Object.keys(e.values).filter((i) => typeof t[t[i]] != "number").map((i) => t[i]), r = Array.from(
    new Set(o.map((i) => typeof i))
  );
  return {
    type: r.length === 1 ? r[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: o
  };
}
l(ow, "parseNativeEnumDef");
function iw() {
  return { not: Ge() };
}
l(iw, "parseNeverDef");
function aw() {
  return {
    type: "null"
  };
}
l(aw, "parseNullDef");
var Tp = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null"
};
function sw(e, t) {
  let n = e.options instanceof Map ? Array.from(e.options.values()) : e.options;
  if (n.every(
    (o) => o._def.typeName in Tp && (!o._def.checks || !o._def.checks.length)
  )) {
    let o = n.reduce((r, i) => {
      let a = Tp[i._def.typeName];
      return a && !r.includes(a) ? [...r, a] : r;
    }, []);
    return {
      type: o.length > 1 ? o : o[0]
    };
  } else if (n.every((o) => o._def.typeName === "ZodLiteral" && !o.description)) {
    let o = n.reduce(
      (r, i) => {
        let a = typeof i._def.value;
        switch (a) {
          case "string":
          case "number":
          case "boolean":
            return [...r, a];
          case "bigint":
            return [...r, "integer"];
          case "object":
            if (i._def.value === null) return [...r, "null"];
          case "symbol":
          case "undefined":
          case "function":
          default:
            return r;
        }
      },
      []
    );
    if (o.length === n.length) {
      let r = o.filter((i, a, u) => u.indexOf(i) === a);
      return {
        type: r.length > 1 ? r : r[0],
        enum: n.reduce(
          (i, a) => i.includes(a._def.value) ? i : [...i, a._def.value],
          []
        )
      };
    }
  } else if (n.every((o) => o._def.typeName === "ZodEnum"))
    return {
      type: "string",
      enum: n.reduce(
        (o, r) => [
          ...o,
          ...r._def.values.filter((i) => !o.includes(i))
        ],
        []
      )
    };
  return lw(e, t);
}
l(sw, "parseUnionDef");
var lw = /* @__PURE__ */ l((e, t) => {
  let n = (e.options instanceof Map ? Array.from(e.options.values()) : e.options).map(
    (o, r) => te(o._def, {
      ...t,
      currentPath: [...t.currentPath, "anyOf", `${r}`]
    })
  ).filter(
    (o) => !!o && (!t.strictUnions || typeof o == "object" && Object.keys(o).length > 0)
  );
  return n.length ? { anyOf: n } : void 0;
}, "asAnyOf");
function uw(e, t) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(
    e.innerType._def.typeName
  ) && (!e.innerType._def.checks || !e.innerType._def.checks.length))
    return {
      type: [
        Tp[e.innerType._def.typeName],
        "null"
      ]
    };
  let n = te(e.innerType._def, {
    ...t,
    currentPath: [...t.currentPath, "anyOf", "0"]
  });
  return n && { anyOf: [n, { type: "null" }] };
}
l(uw, "parseNullableDef");
function cw(e) {
  let t = {
    type: "number"
  };
  if (!e.checks) return t;
  for (let n of e.checks)
    switch (n.kind) {
      case "int":
        t.type = "integer";
        break;
      case "min":
        n.inclusive ? t.minimum = n.value : t.exclusiveMinimum = n.value;
        break;
      case "max":
        n.inclusive ? t.maximum = n.value : t.exclusiveMaximum = n.value;
        break;
      case "multipleOf":
        t.multipleOf = n.value;
        break;
    }
  return t;
}
l(cw, "parseNumberDef");
function dw(e, t) {
  let n = {
    type: "object",
    properties: {}
  }, o = [], r = e.shape();
  for (let a in r) {
    let u = r[a];
    if (u === void 0 || u._def === void 0)
      continue;
    let c = mw(u), d = te(u._def, {
      ...t,
      currentPath: [...t.currentPath, "properties", a],
      propertyPath: [...t.currentPath, "properties", a]
    });
    d !== void 0 && (n.properties[a] = d, c || o.push(a));
  }
  o.length && (n.required = o);
  let i = pw(e, t);
  return i !== void 0 && (n.additionalProperties = i), n;
}
l(dw, "parseObjectDef");
function pw(e, t) {
  if (e.catchall._def.typeName !== "ZodNever")
    return te(e.catchall._def, {
      ...t,
      currentPath: [...t.currentPath, "additionalProperties"]
    });
  switch (e.unknownKeys) {
    case "passthrough":
      return t.allowedAdditionalProperties;
    case "strict":
      return t.rejectedAdditionalProperties;
    case "strip":
      return t.removeAdditionalStrategy === "strict" ? t.allowedAdditionalProperties : t.rejectedAdditionalProperties;
  }
}
l(pw, "decideAdditionalProperties");
function mw(e) {
  try {
    return e.isOptional();
  } catch {
    return !0;
  }
}
l(mw, "safeIsOptional");
var fw = /* @__PURE__ */ l((e, t) => {
  var n;
  if (t.currentPath.toString() === ((n = t.propertyPath) == null ? void 0 : n.toString()))
    return te(e.innerType._def, t);
  let o = te(e.innerType._def, {
    ...t,
    currentPath: [...t.currentPath, "anyOf", "1"]
  });
  return o ? { anyOf: [{ not: Ge() }, o] } : Ge();
}, "parseOptionalDef"), gw = /* @__PURE__ */ l((e, t) => {
  if (t.pipeStrategy === "input")
    return te(e.in._def, t);
  if (t.pipeStrategy === "output")
    return te(e.out._def, t);
  let n = te(e.in._def, {
    ...t,
    currentPath: [...t.currentPath, "allOf", "0"]
  }), o = te(e.out._def, {
    ...t,
    currentPath: [...t.currentPath, "allOf", n ? "1" : "0"]
  });
  return {
    allOf: [n, o].filter((r) => r !== void 0)
  };
}, "parsePipelineDef");
function hw(e, t) {
  return te(e.type._def, t);
}
l(hw, "parsePromiseDef");
function vw(e, t) {
  let o = {
    type: "array",
    uniqueItems: !0,
    items: te(e.valueType._def, {
      ...t,
      currentPath: [...t.currentPath, "items"]
    })
  };
  return e.minSize && (o.minItems = e.minSize.value), e.maxSize && (o.maxItems = e.maxSize.value), o;
}
l(vw, "parseSetDef");
function yw(e, t) {
  return e.rest ? {
    type: "array",
    minItems: e.items.length,
    items: e.items.map(
      (n, o) => te(n._def, {
        ...t,
        currentPath: [...t.currentPath, "items", `${o}`]
      })
    ).reduce(
      (n, o) => o === void 0 ? n : [...n, o],
      []
    ),
    additionalItems: te(e.rest._def, {
      ...t,
      currentPath: [...t.currentPath, "additionalItems"]
    })
  } : {
    type: "array",
    minItems: e.items.length,
    maxItems: e.items.length,
    items: e.items.map(
      (n, o) => te(n._def, {
        ...t,
        currentPath: [...t.currentPath, "items", `${o}`]
      })
    ).reduce(
      (n, o) => o === void 0 ? n : [...n, o],
      []
    )
  };
}
l(yw, "parseTupleDef");
function _w() {
  return {
    not: Ge()
  };
}
l(_w, "parseUndefinedDef");
function bw() {
  return Ge();
}
l(bw, "parseUnknownDef");
var xw = /* @__PURE__ */ l((e, t) => te(e.innerType._def, t), "parseReadonlyDef"), $w = /* @__PURE__ */ l((e, t, n) => {
  switch (t) {
    case T.ZodString:
      return Uh(e, n);
    case T.ZodNumber:
      return cw(e);
    case T.ZodObject:
      return dw(e, n);
    case T.ZodBigInt:
      return J$(e);
    case T.ZodBoolean:
      return B$();
    case T.ZodDate:
      return Dh(e, n);
    case T.ZodUndefined:
      return _w();
    case T.ZodNull:
      return aw();
    case T.ZodArray:
      return q$(e, n);
    case T.ZodUnion:
    case T.ZodDiscriminatedUnion:
      return sw(e, n);
    case T.ZodIntersection:
      return Q$(e, n);
    case T.ZodTuple:
      return yw(e, n);
    case T.ZodRecord:
      return Mh(e, n);
    case T.ZodLiteral:
      return ew(e);
    case T.ZodEnum:
      return X$(e);
    case T.ZodNativeEnum:
      return ow(e);
    case T.ZodNullable:
      return uw(e, n);
    case T.ZodOptional:
      return fw(e, n);
    case T.ZodMap:
      return nw(e, n);
    case T.ZodSet:
      return vw(e, n);
    case T.ZodLazy:
      return () => e.getter()._def;
    case T.ZodPromise:
      return hw(e, n);
    case T.ZodNaN:
    case T.ZodNever:
      return iw();
    case T.ZodEffects:
      return H$(e, n);
    case T.ZodAny:
      return Ge();
    case T.ZodUnknown:
      return bw();
    case T.ZodDefault:
      return K$(e, n);
    case T.ZodBranded:
      return Ch(e, n);
    case T.ZodReadonly:
      return xw(e, n);
    case T.ZodCatch:
      return G$(e, n);
    case T.ZodPipeline:
      return gw(e, n);
    case T.ZodFunction:
    case T.ZodVoid:
    case T.ZodSymbol:
      return;
    default:
      return /* @__PURE__ */ ((o) => {
      })(t);
  }
}, "selectParser");
function te(e, t, n = !1) {
  var o;
  let r = t.seen.get(e);
  if (t.override) {
    let c = (o = t.override) == null ? void 0 : o.call(
      t,
      e,
      t,
      r,
      n
    );
    if (c !== F$)
      return c;
  }
  if (r && !n) {
    let c = ww(r, t);
    if (c !== void 0)
      return c;
  }
  let i = { def: e, path: t.currentPath, jsonSchema: void 0 };
  t.seen.set(e, i);
  let a = $w(e, e.typeName, t), u = typeof a == "function" ? te(a(), t) : a;
  if (u && kw(e, t, u), t.postProcess) {
    let c = t.postProcess(u, e, t);
    return i.jsonSchema = u, c;
  }
  return i.jsonSchema = u, u;
}
l(te, "parseDef");
var ww = /* @__PURE__ */ l((e, t) => {
  switch (t.$refStrategy) {
    case "root":
      return { $ref: e.path.join("/") };
    case "relative":
      return { $ref: L$(t.currentPath, e.path) };
    case "none":
    case "seen":
      return e.path.length < t.currentPath.length && e.path.every((n, o) => t.currentPath[o] === n) ? (console.warn(
        `Recursive reference detected at ${t.currentPath.join(
          "/"
        )}! Defaulting to any`
      ), Ge()) : t.$refStrategy === "seen" ? Ge() : void 0;
  }
}, "get$ref"), kw = /* @__PURE__ */ l((e, t, n) => (e.description && (n.description = e.description), n), "addMeta"), Iw = /* @__PURE__ */ l((e) => {
  let t = V$(e), n = t.name !== void 0 ? [...t.basePath, t.definitionPath, t.name] : t.basePath;
  return {
    ...t,
    currentPath: n,
    propertyPath: void 0,
    seen: new Map(
      Object.entries(t.definitions).map(([o, r]) => [
        r._def,
        {
          def: r._def,
          path: [...t.basePath, t.definitionPath, o],
          // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
          jsonSchema: void 0
        }
      ])
    )
  };
}, "getRefs"), Sw = /* @__PURE__ */ l((e, t) => {
  var n;
  let o = Iw(t), r = typeof t == "object" && t.definitions ? Object.entries(t.definitions).reduce(
    (d, [p, m]) => {
      var v;
      return {
        ...d,
        [p]: (v = te(
          m._def,
          {
            ...o,
            currentPath: [...o.basePath, o.definitionPath, p]
          },
          !0
        )) != null ? v : Ge()
      };
    },
    {}
  ) : void 0, i = typeof t == "string" ? t : t?.nameStrategy === "title" ? void 0 : t?.name, a = (n = te(
    e._def,
    i === void 0 ? o : {
      ...o,
      currentPath: [...o.basePath, o.definitionPath, i]
    },
    !1
  )) != null ? n : Ge(), u = typeof t == "object" && t.name !== void 0 && t.nameStrategy === "title" ? t.name : void 0;
  u !== void 0 && (a.title = u);
  let c = i === void 0 ? r ? {
    ...a,
    [o.definitionPath]: r
  } : a : {
    $ref: [
      ...o.$refStrategy === "relative" ? [] : o.basePath,
      o.definitionPath,
      i
    ].join("/"),
    [o.definitionPath]: {
      ...r,
      [i]: a
    }
  };
  return c.$schema = "http://json-schema.org/draft-07/schema#", c;
}, "zodToJsonSchema"), Tw = Sw;
function zw(e, t) {
  var n;
  let o = (n = t?.useReferences) != null ? n : !1;
  return Pp(
    // defer json schema creation to avoid unnecessary computation when only validation is needed
    () => Tw(e, {
      $refStrategy: o ? "root" : "none"
    }),
    {
      validate: /* @__PURE__ */ l(async (r) => {
        let i = await e.safeParseAsync(r);
        return i.success ? { success: !0, value: i.data } : { success: !1, error: i.error };
      }, "validate")
    }
  );
}
l(zw, "zod3Schema");
function Ew(e, t) {
  var n;
  let o = (n = t?.useReferences) != null ? n : !1;
  return Pp(
    // defer json schema creation to avoid unnecessary computation when only validation is needed
    () => da(
      Zr(e, {
        target: "draft-7",
        io: "input",
        reused: o ? "ref" : "inline"
      })
    ),
    {
      validate: /* @__PURE__ */ l(async (r) => {
        let i = await Fn(e, r);
        return i.success ? { success: !0, value: i.data } : { success: !1, error: i.error };
      }, "validate")
    }
  );
}
l(Ew, "zod4Schema");
function Ow(e) {
  return "_zod" in e;
}
l(Ow, "isZod4Schema");
function A(e, t) {
  return Ow(e) ? Ew(e, t) : zw(e, t);
}
l(A, "zodSchema");
var zp = Symbol.for("vercel.ai.schema");
function me(e) {
  let t;
  return () => (t == null && (t = e()), t);
}
l(me, "lazySchema");
function Pp(e, {
  validate: t
} = {}) {
  return {
    [zp]: !0,
    _type: void 0,
    // should never be used directly
    [pa]: !0,
    get jsonSchema() {
      return typeof e == "function" && (e = e()), e;
    },
    validate: t
  };
}
l(Pp, "jsonSchema");
function jw(e) {
  return typeof e == "object" && e !== null && zp in e && e[zp] === !0 && "jsonSchema" in e && "validate" in e;
}
l(jw, "isSchema");
function gr(e) {
  return e == null ? Pp({
    properties: {},
    additionalProperties: !1
  }) : jw(e) ? e : typeof e == "function" ? e() : A(e);
}
l(gr, "asSchema");
var { btoa: Pw, atob: Nw } = globalThis;
function Yt(e) {
  let t = e.replace(/-/g, "+").replace(/_/g, "/"), n = Nw(t);
  return Uint8Array.from(n, (o) => o.codePointAt(0));
}
l(Yt, "convertBase64ToUint8Array");
function cn(e) {
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += String.fromCodePoint(e[n]);
  return Pw(t);
}
l(cn, "convertUint8ArrayToBase64");
function Qt(e) {
  return e instanceof Uint8Array ? cn(e) : e;
}
l(Qt, "convertToBase64");
function ga(e) {
  return e?.replace(/\/$/, "");
}
l(ga, "withoutTrailingSlash");
function Aw(e) {
  return e != null && typeof e[Symbol.asyncIterator] == "function";
}
l(Aw, "isAsyncIterable");
async function* Zh({
  execute: e,
  input: t,
  options: n
}) {
  let o = e(t, n);
  if (Aw(o)) {
    let r;
    for await (let i of o)
      r = i, yield { type: "preliminary", output: i };
    yield { type: "final", output: r };
  } else
    yield { type: "final", output: await o };
}
l(Zh, "executeTool");

// node_modules/@ai-sdk/gateway/dist/index.mjs
var zv = fm(Up(), 1), Ev = fm(Up(), 1);
var ok = "vercel.ai.gateway.error", Mp = Symbol.for(ok), Hh, Xh, Ke = class _v extends (Xh = Error, Hh = Mp, Xh) {
  static {
    l(this, "_GatewayError");
  }
  constructor({
    message: t,
    statusCode: n = 500,
    cause: o
  }) {
    super(t), this[Hh] = !0, this.statusCode = n, this.cause = o;
  }
  /**
   * Checks if the given error is a Gateway Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is a Gateway Error, false otherwise.
   */
  static isInstance(t) {
    return _v.hasMarker(t);
  }
  static hasMarker(t) {
    return typeof t == "object" && t !== null && Mp in t && t[Mp] === !0;
  }
}, bv = "GatewayAuthenticationError", ik = `vercel.ai.gateway.error.${bv}`, Yh = Symbol.for(ik), Qh, ev, ha = class xv extends (ev = Ke, Qh = Yh, ev) {
  static {
    l(this, "_GatewayAuthenticationError");
  }
  constructor({
    message: t = "Authentication failed",
    statusCode: n = 401,
    cause: o
  } = {}) {
    super({ message: t, statusCode: n, cause: o }), this[Qh] = !0, this.name = bv, this.type = "authentication_error";
  }
  static isInstance(t) {
    return Ke.hasMarker(t) && Yh in t;
  }
  /**
   * Creates a contextual error message when authentication fails
   */
  static createContextualError({
    apiKeyProvided: t,
    oidcTokenProvided: n,
    message: o = "Authentication failed",
    statusCode: r = 401,
    cause: i
  }) {
    let a;
    return t ? a = `AI Gateway authentication failed: Invalid API key.

Create a new API key: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys

Provide via 'apiKey' option or 'AI_GATEWAY_API_KEY' environment variable.` : n ? a = `AI Gateway authentication failed: Invalid OIDC token.

Run 'npx vercel link' to link your project, then 'vc env pull' to fetch the token.

Alternatively, use an API key: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys` : a = `AI Gateway authentication failed: No authentication provided.

Option 1 - API key:
Create an API key: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys
Provide via 'apiKey' option or 'AI_GATEWAY_API_KEY' environment variable.

Option 2 - OIDC token:
Run 'npx vercel link' to link your project, then 'vc env pull' to fetch the token.`, new xv({
      message: a,
      statusCode: r,
      cause: i
    });
  }
}, $v = "GatewayInvalidRequestError", ak = `vercel.ai.gateway.error.${$v}`, tv = Symbol.for(ak), rv, nv, sk = class extends (nv = Ke, rv = tv, nv) {
  static {
    l(this, "GatewayInvalidRequestError");
  }
  constructor({
    message: e = "Invalid request",
    statusCode: t = 400,
    cause: n
  } = {}) {
    super({ message: e, statusCode: t, cause: n }), this[rv] = !0, this.name = $v, this.type = "invalid_request_error";
  }
  static isInstance(e) {
    return Ke.hasMarker(e) && tv in e;
  }
}, wv = "GatewayRateLimitError", lk = `vercel.ai.gateway.error.${wv}`, ov = Symbol.for(lk), iv, av, uk = class extends (av = Ke, iv = ov, av) {
  static {
    l(this, "GatewayRateLimitError");
  }
  constructor({
    message: e = "Rate limit exceeded",
    statusCode: t = 429,
    cause: n
  } = {}) {
    super({ message: e, statusCode: t, cause: n }), this[iv] = !0, this.name = wv, this.type = "rate_limit_exceeded";
  }
  static isInstance(e) {
    return Ke.hasMarker(e) && ov in e;
  }
}, kv = "GatewayModelNotFoundError", ck = `vercel.ai.gateway.error.${kv}`, sv = Symbol.for(ck), dk = q(
  () => A(
    s.object({
      modelId: s.string()
    })
  )
), lv, uv, pk = class extends (uv = Ke, lv = sv, uv) {
  static {
    l(this, "GatewayModelNotFoundError");
  }
  constructor({
    message: e = "Model not found",
    statusCode: t = 404,
    modelId: n,
    cause: o
  } = {}) {
    super({ message: e, statusCode: t, cause: o }), this[lv] = !0, this.name = kv, this.type = "model_not_found", this.modelId = n;
  }
  static isInstance(e) {
    return Ke.hasMarker(e) && sv in e;
  }
}, Iv = "GatewayInternalServerError", mk = `vercel.ai.gateway.error.${Iv}`, cv = Symbol.for(mk), dv, pv, mv = class extends (pv = Ke, dv = cv, pv) {
  static {
    l(this, "GatewayInternalServerError");
  }
  constructor({
    message: e = "Internal server error",
    statusCode: t = 500,
    cause: n
  } = {}) {
    super({ message: e, statusCode: t, cause: n }), this[dv] = !0, this.name = Iv, this.type = "internal_server_error";
  }
  static isInstance(e) {
    return Ke.hasMarker(e) && cv in e;
  }
}, Sv = "GatewayResponseError", fk = `vercel.ai.gateway.error.${Sv}`, fv = Symbol.for(fk), gv, hv, gk = class extends (hv = Ke, gv = fv, hv) {
  static {
    l(this, "GatewayResponseError");
  }
  constructor({
    message: e = "Invalid response from Gateway",
    statusCode: t = 502,
    response: n,
    validationError: o,
    cause: r
  } = {}) {
    super({ message: e, statusCode: t, cause: r }), this[gv] = !0, this.name = Sv, this.type = "response_error", this.response = n, this.validationError = o;
  }
  static isInstance(e) {
    return Ke.hasMarker(e) && fv in e;
  }
};
async function vv({
  response: e,
  statusCode: t,
  defaultMessage: n = "Gateway request failed",
  cause: o,
  authMethod: r
}) {
  let i = await Le({
    value: e,
    schema: hk
  });
  if (!i.success)
    return new gk({
      message: `Invalid error response format: ${n}`,
      statusCode: t,
      response: e,
      validationError: i.error,
      cause: o
    });
  let a = i.value, u = a.error.type, c = a.error.message;
  switch (u) {
    case "authentication_error":
      return ha.createContextualError({
        apiKeyProvided: r === "api-key",
        oidcTokenProvided: r === "oidc",
        statusCode: t,
        cause: o
      });
    case "invalid_request_error":
      return new sk({ message: c, statusCode: t, cause: o });
    case "rate_limit_exceeded":
      return new uk({ message: c, statusCode: t, cause: o });
    case "model_not_found": {
      let d = await Le({
        value: a.error.param,
        schema: dk
      });
      return new pk({
        message: c,
        statusCode: t,
        modelId: d.success ? d.value.modelId : void 0,
        cause: o
      });
    }
    case "internal_server_error":
      return new mv({ message: c, statusCode: t, cause: o });
    default:
      return new mv({ message: c, statusCode: t, cause: o });
  }
}
l(vv, "createGatewayErrorFromResponse");
var hk = q(
  () => A(
    s.object({
      error: s.object({
        message: s.string(),
        type: s.string().nullish(),
        param: s.unknown().nullish(),
        code: s.union([s.string(), s.number()]).nullish()
      })
    })
  )
);
function er(e, t) {
  var n;
  return Ke.isInstance(e) ? e : se.isInstance(e) ? vv({
    response: vk(e),
    statusCode: (n = e.statusCode) != null ? n : 500,
    defaultMessage: "Gateway request failed",
    cause: e,
    authMethod: t
  }) : vv({
    response: {},
    statusCode: 500,
    defaultMessage: e instanceof Error ? `Gateway request failed: ${e.message}` : "Unknown Gateway error",
    cause: e,
    authMethod: t
  });
}
l(er, "asGatewayError");
function vk(e) {
  if (e.data !== void 0)
    return e.data;
  if (e.responseBody != null)
    try {
      return JSON.parse(e.responseBody);
    } catch {
      return e.responseBody;
    }
  return {};
}
l(vk, "extractApiCallResponse");
var Tv = "ai-gateway-auth-method";
async function dn(e) {
  let t = await Le({
    value: e[Tv],
    schema: yk
  });
  return t.success ? t.value : void 0;
}
l(dn, "parseAuthMethod");
var yk = q(
  () => A(s.union([s.literal("api-key"), s.literal("oidc")]))
), yv = class {
  static {
    l(this, "GatewayFetchMetadata");
  }
  constructor(e) {
    this.config = e;
  }
  async getAvailableModels() {
    try {
      let { value: e } = await Ep({
        url: `${this.config.baseURL}/config`,
        headers: await Fe(this.config.headers()),
        successfulResponseHandler: he(
          _k
        ),
        failedResponseHandler: tt({
          errorSchema: s.any(),
          errorToMessage: /* @__PURE__ */ l((t) => t, "errorToMessage")
        }),
        fetch: this.config.fetch
      });
      return e;
    } catch (e) {
      throw await er(e);
    }
  }
  async getCredits() {
    try {
      let e = new URL(this.config.baseURL), { value: t } = await Ep({
        url: `${e.origin}/v1/credits`,
        headers: await Fe(this.config.headers()),
        successfulResponseHandler: he(
          bk
        ),
        failedResponseHandler: tt({
          errorSchema: s.any(),
          errorToMessage: /* @__PURE__ */ l((n) => n, "errorToMessage")
        }),
        fetch: this.config.fetch
      });
      return t;
    } catch (e) {
      throw await er(e);
    }
  }
}, _k = q(
  () => A(
    s.object({
      models: s.array(
        s.object({
          id: s.string(),
          name: s.string(),
          description: s.string().nullish(),
          pricing: s.object({
            input: s.string(),
            output: s.string(),
            input_cache_read: s.string().nullish(),
            input_cache_write: s.string().nullish()
          }).transform(
            ({ input: e, output: t, input_cache_read: n, input_cache_write: o }) => ({
              input: e,
              output: t,
              ...n ? { cachedInputTokens: n } : {},
              ...o ? { cacheCreationInputTokens: o } : {}
            })
          ).nullish(),
          specification: s.object({
            specificationVersion: s.literal("v2"),
            provider: s.string(),
            modelId: s.string()
          }),
          modelType: s.enum(["language", "embedding", "image"]).nullish()
        })
      )
    })
  )
), bk = q(
  () => A(
    s.object({
      balance: s.string(),
      total_used: s.string()
    }).transform(({ balance: e, total_used: t }) => ({
      balance: e,
      totalUsed: t
    }))
  )
), xk = class {
  static {
    l(this, "GatewayLanguageModel");
  }
  constructor(e, t) {
    this.modelId = e, this.config = t, this.specificationVersion = "v2", this.supportedUrls = { "*/*": [/.*/] };
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs(e) {
    let { abortSignal: t, ...n } = e;
    return {
      args: this.maybeEncodeFileParts(n),
      warnings: []
    };
  }
  async doGenerate(e) {
    let { args: t, warnings: n } = await this.getArgs(e), { abortSignal: o } = e, r = await Fe(this.config.headers());
    try {
      let {
        responseHeaders: i,
        value: a,
        rawValue: u
      } = await pe({
        url: this.getUrl(),
        headers: le(
          r,
          e.headers,
          this.getModelConfigHeaders(this.modelId, !1),
          await Fe(this.config.o11yHeaders)
        ),
        body: t,
        successfulResponseHandler: he(s.any()),
        failedResponseHandler: tt({
          errorSchema: s.any(),
          errorToMessage: /* @__PURE__ */ l((c) => c, "errorToMessage")
        }),
        ...o && { abortSignal: o },
        fetch: this.config.fetch
      });
      return {
        ...a,
        request: { body: t },
        response: { headers: i, body: u },
        warnings: n
      };
    } catch (i) {
      throw await er(i, await dn(r));
    }
  }
  async doStream(e) {
    let { args: t, warnings: n } = await this.getArgs(e), { abortSignal: o } = e, r = await Fe(this.config.headers());
    try {
      let { value: i, responseHeaders: a } = await pe({
        url: this.getUrl(),
        headers: le(
          r,
          e.headers,
          this.getModelConfigHeaders(this.modelId, !0),
          await Fe(this.config.o11yHeaders)
        ),
        body: t,
        successfulResponseHandler: Xt(s.any()),
        failedResponseHandler: tt({
          errorSchema: s.any(),
          errorToMessage: /* @__PURE__ */ l((u) => u, "errorToMessage")
        }),
        ...o && { abortSignal: o },
        fetch: this.config.fetch
      });
      return {
        stream: i.pipeThrough(
          new TransformStream({
            start(u) {
              n.length > 0 && u.enqueue({ type: "stream-start", warnings: n });
            },
            transform(u, c) {
              if (u.success) {
                let d = u.value;
                if (d.type === "raw" && !e.includeRawChunks)
                  return;
                d.type === "response-metadata" && d.timestamp && typeof d.timestamp == "string" && (d.timestamp = new Date(d.timestamp)), c.enqueue(d);
              } else
                c.error(
                  u.error
                );
            }
          })
        ),
        request: { body: t },
        response: { headers: a }
      };
    } catch (i) {
      throw await er(i, await dn(r));
    }
  }
  isFilePart(e) {
    return e && typeof e == "object" && "type" in e && e.type === "file";
  }
  /**
   * Encodes file parts in the prompt to base64. Mutates the passed options
   * instance directly to avoid copying the file data.
   * @param options - The options to encode.
   * @returns The options with the file parts encoded.
   */
  maybeEncodeFileParts(e) {
    for (let t of e.prompt)
      for (let n of t.content)
        if (this.isFilePart(n)) {
          let o = n;
          if (o.data instanceof Uint8Array) {
            let r = Uint8Array.from(o.data), i = Buffer.from(r).toString("base64");
            o.data = new URL(
              `data:${o.mediaType || "application/octet-stream"};base64,${i}`
            );
          }
        }
    return e;
  }
  getUrl() {
    return `${this.config.baseURL}/language-model`;
  }
  getModelConfigHeaders(e, t) {
    return {
      "ai-language-model-specification-version": "2",
      "ai-language-model-id": e,
      "ai-language-model-streaming": String(t)
    };
  }
}, $k = class {
  static {
    l(this, "GatewayEmbeddingModel");
  }
  constructor(e, t) {
    this.modelId = e, this.config = t, this.specificationVersion = "v2", this.maxEmbeddingsPerCall = 2048, this.supportsParallelCalls = !0;
  }
  get provider() {
    return this.config.provider;
  }
  async doEmbed({
    values: e,
    headers: t,
    abortSignal: n,
    providerOptions: o
  }) {
    var r;
    let i = await Fe(this.config.headers());
    try {
      let {
        responseHeaders: a,
        value: u,
        rawValue: c
      } = await pe({
        url: this.getUrl(),
        headers: le(
          i,
          t ?? {},
          this.getModelConfigHeaders(),
          await Fe(this.config.o11yHeaders)
        ),
        body: {
          input: e.length === 1 ? e[0] : e,
          ...o ? { providerOptions: o } : {}
        },
        successfulResponseHandler: he(
          wk
        ),
        failedResponseHandler: tt({
          errorSchema: s.any(),
          errorToMessage: /* @__PURE__ */ l((d) => d, "errorToMessage")
        }),
        ...n && { abortSignal: n },
        fetch: this.config.fetch
      });
      return {
        embeddings: u.embeddings,
        usage: (r = u.usage) != null ? r : void 0,
        providerMetadata: u.providerMetadata,
        response: { headers: a, body: c }
      };
    } catch (a) {
      throw await er(a, await dn(i));
    }
  }
  getUrl() {
    return `${this.config.baseURL}/embedding-model`;
  }
  getModelConfigHeaders() {
    return {
      "ai-embedding-model-specification-version": "2",
      "ai-model-id": this.modelId
    };
  }
}, wk = q(
  () => A(
    s.object({
      embeddings: s.array(s.array(s.number())),
      usage: s.object({ tokens: s.number() }).nullish(),
      providerMetadata: s.record(s.string(), s.record(s.string(), s.unknown())).optional()
    })
  )
), kk = class {
  static {
    l(this, "GatewayImageModel");
  }
  constructor(e, t) {
    this.modelId = e, this.config = t, this.specificationVersion = "v2", this.maxImagesPerCall = Number.MAX_SAFE_INTEGER;
  }
  get provider() {
    return this.config.provider;
  }
  async doGenerate({
    prompt: e,
    n: t,
    size: n,
    aspectRatio: o,
    seed: r,
    providerOptions: i,
    headers: a,
    abortSignal: u
  }) {
    var c;
    let d = await Fe(this.config.headers());
    try {
      let {
        responseHeaders: p,
        value: m,
        rawValue: v
      } = await pe({
        url: this.getUrl(),
        headers: le(
          d,
          a ?? {},
          this.getModelConfigHeaders(),
          await Fe(this.config.o11yHeaders)
        ),
        body: {
          prompt: e,
          n: t,
          ...n && { size: n },
          ...o && { aspectRatio: o },
          ...r && { seed: r },
          ...i && { providerOptions: i }
        },
        successfulResponseHandler: he(
          Sk
        ),
        failedResponseHandler: tt({
          errorSchema: s.any(),
          errorToMessage: /* @__PURE__ */ l((g) => g, "errorToMessage")
        }),
        ...u && { abortSignal: u },
        fetch: this.config.fetch
      });
      return {
        images: m.images,
        // Always base64 strings from server
        warnings: (c = m.warnings) != null ? c : [],
        providerMetadata: m.providerMetadata,
        response: {
          timestamp: /* @__PURE__ */ new Date(),
          modelId: this.modelId,
          headers: p
        }
      };
    } catch (p) {
      throw er(p, await dn(d));
    }
  }
  getUrl() {
    return `${this.config.baseURL}/image-model`;
  }
  getModelConfigHeaders() {
    return {
      "ai-image-model-specification-version": "2",
      "ai-model-id": this.modelId
    };
  }
}, Ik = s.object({
  images: s.array(s.unknown()).optional()
}).catchall(s.unknown()), Sk = s.object({
  images: s.array(s.string()),
  // Always base64 strings over the wire
  warnings: s.array(
    s.object({
      type: s.literal("other"),
      message: s.string()
    })
  ).optional(),
  providerMetadata: s.record(s.string(), Ik).optional()
});
async function Tk() {
  var e;
  return (e = (0, zv.getContext)().headers) == null ? void 0 : e["x-vercel-id"];
}
l(Tk, "getVercelRequestId");
var zk = "2.0.24", Ek = "0.0.1";
function Ok(e = {}) {
  var t, n;
  let o = null, r = null, i = (t = e.metadataCacheRefreshMillis) != null ? t : 1e3 * 60 * 5, a = 0, u = (n = ga(e.baseURL)) != null ? n : "https://ai-gateway.vercel.sh/v1/ai", c = /* @__PURE__ */ l(async () => {
    let b = await jk(e);
    if (b)
      return ut(
        {
          Authorization: `Bearer ${b.token}`,
          "ai-gateway-protocol-version": Ek,
          [Tv]: b.authMethod,
          ...e.headers
        },
        `ai-sdk/gateway/${zk}`
      );
    throw ha.createContextualError({
      apiKeyProvided: !1,
      oidcTokenProvided: !1,
      statusCode: 401
    });
  }, "getHeaders"), d = /* @__PURE__ */ l(() => {
    let b = fr({
      settingValue: void 0,
      environmentVariableName: "VERCEL_DEPLOYMENT_ID"
    }), x = fr({
      settingValue: void 0,
      environmentVariableName: "VERCEL_ENV"
    }), $ = fr({
      settingValue: void 0,
      environmentVariableName: "VERCEL_REGION"
    });
    return async () => {
      let E = await Tk();
      return {
        ...b && { "ai-o11y-deployment-id": b },
        ...x && { "ai-o11y-environment": x },
        ...$ && { "ai-o11y-region": $ },
        ...E && { "ai-o11y-request-id": E }
      };
    };
  }, "createO11yHeaders"), p = /* @__PURE__ */ l((b) => new xk(b, {
    provider: "gateway",
    baseURL: u,
    headers: c,
    fetch: e.fetch,
    o11yHeaders: d()
  }), "createLanguageModel"), m = /* @__PURE__ */ l(async () => {
    var b, x, $;
    let E = ($ = (x = (b = e._internal) == null ? void 0 : b.currentDate) == null ? void 0 : x.call(b).getTime()) != null ? $ : Date.now();
    return (!o || E - a > i) && (a = E, o = new yv({
      baseURL: u,
      headers: c,
      fetch: e.fetch
    }).getAvailableModels().then((O) => (r = O, O)).catch(async (O) => {
      throw await er(
        O,
        await dn(await c())
      );
    })), r ? Promise.resolve(r) : o;
  }, "getAvailableModels"), v = /* @__PURE__ */ l(async () => new yv({
    baseURL: u,
    headers: c,
    fetch: e.fetch
  }).getCredits().catch(async (b) => {
    throw await er(
      b,
      await dn(await c())
    );
  }), "getCredits"), g = /* @__PURE__ */ l(function(b) {
    if (new.target)
      throw new Error(
        "The Gateway Provider model function cannot be called with the new keyword."
      );
    return p(b);
  }, "provider");
  return g.getAvailableModels = m, g.getCredits = v, g.imageModel = (b) => new kk(b, {
    provider: "gateway",
    baseURL: u,
    headers: c,
    fetch: e.fetch,
    o11yHeaders: d()
  }), g.languageModel = p, g.textEmbeddingModel = (b) => new $k(b, {
    provider: "gateway",
    baseURL: u,
    headers: c,
    fetch: e.fetch,
    o11yHeaders: d()
  }), g;
}
l(Ok, "createGatewayProvider");
var Ov = Ok();
async function jk(e) {
  let t = fr({
    settingValue: e.apiKey,
    environmentVariableName: "AI_GATEWAY_API_KEY"
  });
  if (t)
    return {
      token: t,
      authMethod: "api-key"
    };
  try {
    return {
      token: await (0, Ev.getVercelOidcToken)(),
      authMethod: "oidc"
    };
  } catch {
    return null;
  }
}
l(jk, "getGatewayAuthToken");

// node_modules/@opentelemetry/api/build/esm/platform/node/globalThis.js
var jv = typeof globalThis == "object" ? globalThis : global;

// node_modules/@opentelemetry/api/build/esm/version.js
var jt = "1.9.0";

// node_modules/@opentelemetry/api/build/esm/internal/semver.js
var Pv = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
function Pk(e) {
  var t = /* @__PURE__ */ new Set([e]), n = /* @__PURE__ */ new Set(), o = e.match(Pv);
  if (!o)
    return function() {
      return !1;
    };
  var r = {
    major: +o[1],
    minor: +o[2],
    patch: +o[3],
    prerelease: o[4]
  };
  if (r.prerelease != null)
    return /* @__PURE__ */ l(function(c) {
      return c === e;
    }, "isExactmatch");
  function i(u) {
    return n.add(u), !1;
  }
  l(i, "_reject");
  function a(u) {
    return t.add(u), !0;
  }
  return l(a, "_accept"), /* @__PURE__ */ l(function(c) {
    if (t.has(c))
      return !0;
    if (n.has(c))
      return !1;
    var d = c.match(Pv);
    if (!d)
      return i(c);
    var p = {
      major: +d[1],
      minor: +d[2],
      patch: +d[3],
      prerelease: d[4]
    };
    return p.prerelease != null || r.major !== p.major ? i(c) : r.major === 0 ? r.minor === p.minor && r.patch <= p.patch ? a(c) : i(c) : r.minor <= p.minor ? a(c) : i(c);
  }, "isCompatible");
}
l(Pk, "_makeCompatibilityCheck");
var Nv = Pk(jt);

// node_modules/@opentelemetry/api/build/esm/internal/global-utils.js
var Nk = jt.split(".")[0], go = Symbol.for("opentelemetry.js.api." + Nk), ho = jv;
function pn(e, t, n, o) {
  var r;
  o === void 0 && (o = !1);
  var i = ho[go] = (r = ho[go]) !== null && r !== void 0 ? r : {
    version: jt
  };
  if (!o && i[e]) {
    var a = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + e);
    return n.error(a.stack || a.message), !1;
  }
  if (i.version !== jt) {
    var a = new Error("@opentelemetry/api: Registration of version v" + i.version + " for " + e + " does not match previously registered API v" + jt);
    return n.error(a.stack || a.message), !1;
  }
  return i[e] = t, n.debug("@opentelemetry/api: Registered a global for " + e + " v" + jt + "."), !0;
}
l(pn, "registerGlobal");
function Pt(e) {
  var t, n, o = (t = ho[go]) === null || t === void 0 ? void 0 : t.version;
  if (!(!o || !Nv(o)))
    return (n = ho[go]) === null || n === void 0 ? void 0 : n[e];
}
l(Pt, "getGlobal");
function mn(e, t) {
  t.debug("@opentelemetry/api: Unregistering a global for " + e + " v" + jt + ".");
  var n = ho[go];
  n && delete n[e];
}
l(mn, "unregisterGlobal");

// node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js
var Ak = function(e, t) {
  var n = typeof Symbol == "function" && e[Symbol.iterator];
  if (!n) return e;
  var o = n.call(e), r, i = [], a;
  try {
    for (; (t === void 0 || t-- > 0) && !(r = o.next()).done; ) i.push(r.value);
  } catch (u) {
    a = { error: u };
  } finally {
    try {
      r && !r.done && (n = o.return) && n.call(o);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, Rk = function(e, t, n) {
  if (n || arguments.length === 2) for (var o = 0, r = t.length, i; o < r; o++)
    (i || !(o in t)) && (i || (i = Array.prototype.slice.call(t, 0, o)), i[o] = t[o]);
  return e.concat(i || Array.prototype.slice.call(t));
}, Av = (
  /** @class */
  (function() {
    function e(t) {
      this._namespace = t.namespace || "DiagComponentLogger";
    }
    return l(e, "DiagComponentLogger"), e.prototype.debug = function() {
      for (var t = [], n = 0; n < arguments.length; n++)
        t[n] = arguments[n];
      return vo("debug", this._namespace, t);
    }, e.prototype.error = function() {
      for (var t = [], n = 0; n < arguments.length; n++)
        t[n] = arguments[n];
      return vo("error", this._namespace, t);
    }, e.prototype.info = function() {
      for (var t = [], n = 0; n < arguments.length; n++)
        t[n] = arguments[n];
      return vo("info", this._namespace, t);
    }, e.prototype.warn = function() {
      for (var t = [], n = 0; n < arguments.length; n++)
        t[n] = arguments[n];
      return vo("warn", this._namespace, t);
    }, e.prototype.verbose = function() {
      for (var t = [], n = 0; n < arguments.length; n++)
        t[n] = arguments[n];
      return vo("verbose", this._namespace, t);
    }, e;
  })()
);
function vo(e, t, n) {
  var o = Pt("diag");
  if (o)
    return n.unshift(t), o[e].apply(o, Rk([], Ak(n), !1));
}
l(vo, "logProxy");

// node_modules/@opentelemetry/api/build/esm/diag/types.js
var Ne;
(function(e) {
  e[e.NONE = 0] = "NONE", e[e.ERROR = 30] = "ERROR", e[e.WARN = 50] = "WARN", e[e.INFO = 60] = "INFO", e[e.DEBUG = 70] = "DEBUG", e[e.VERBOSE = 80] = "VERBOSE", e[e.ALL = 9999] = "ALL";
})(Ne || (Ne = {}));

// node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js
function Rv(e, t) {
  e < Ne.NONE ? e = Ne.NONE : e > Ne.ALL && (e = Ne.ALL), t = t || {};
  function n(o, r) {
    var i = t[o];
    return typeof i == "function" && e >= r ? i.bind(t) : function() {
    };
  }
  return l(n, "_filterFunc"), {
    error: n("error", Ne.ERROR),
    warn: n("warn", Ne.WARN),
    info: n("info", Ne.INFO),
    debug: n("debug", Ne.DEBUG),
    verbose: n("verbose", Ne.VERBOSE)
  };
}
l(Rv, "createLogLevelDiagLogger");

// node_modules/@opentelemetry/api/build/esm/api/diag.js
var Ck = function(e, t) {
  var n = typeof Symbol == "function" && e[Symbol.iterator];
  if (!n) return e;
  var o = n.call(e), r, i = [], a;
  try {
    for (; (t === void 0 || t-- > 0) && !(r = o.next()).done; ) i.push(r.value);
  } catch (u) {
    a = { error: u };
  } finally {
    try {
      r && !r.done && (n = o.return) && n.call(o);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, Dk = function(e, t, n) {
  if (n || arguments.length === 2) for (var o = 0, r = t.length, i; o < r; o++)
    (i || !(o in t)) && (i || (i = Array.prototype.slice.call(t, 0, o)), i[o] = t[o]);
  return e.concat(i || Array.prototype.slice.call(t));
}, Uk = "diag", fn = (
  /** @class */
  (function() {
    function e() {
      function t(r) {
        return function() {
          for (var i = [], a = 0; a < arguments.length; a++)
            i[a] = arguments[a];
          var u = Pt("diag");
          if (u)
            return u[r].apply(u, Dk([], Ck(i), !1));
        };
      }
      l(t, "_logProxy");
      var n = this, o = /* @__PURE__ */ l(function(r, i) {
        var a, u, c;
        if (i === void 0 && (i = { logLevel: Ne.INFO }), r === n) {
          var d = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
          return n.error((a = d.stack) !== null && a !== void 0 ? a : d.message), !1;
        }
        typeof i == "number" && (i = {
          logLevel: i
        });
        var p = Pt("diag"), m = Rv((u = i.logLevel) !== null && u !== void 0 ? u : Ne.INFO, r);
        if (p && !i.suppressOverrideMessage) {
          var v = (c = new Error().stack) !== null && c !== void 0 ? c : "<failed to generate stacktrace>";
          p.warn("Current logger will be overwritten from " + v), m.warn("Current logger will overwrite one already registered from " + v);
        }
        return pn("diag", m, n, !0);
      }, "setLogger");
      n.setLogger = o, n.disable = function() {
        mn(Uk, n);
      }, n.createComponentLogger = function(r) {
        return new Av(r);
      }, n.verbose = t("verbose"), n.debug = t("debug"), n.info = t("info"), n.warn = t("warn"), n.error = t("error");
    }
    return l(e, "DiagAPI"), e.instance = function() {
      return this._instance || (this._instance = new e()), this._instance;
    }, e;
  })()
);

// node_modules/@opentelemetry/api/build/esm/context/context.js
function Cv(e) {
  return Symbol.for(e);
}
l(Cv, "createContextKey");
var Mk = (
  /** @class */
  (function() {
    function e(t) {
      var n = this;
      n._currentContext = t ? new Map(t) : /* @__PURE__ */ new Map(), n.getValue = function(o) {
        return n._currentContext.get(o);
      }, n.setValue = function(o, r) {
        var i = new e(n._currentContext);
        return i._currentContext.set(o, r), i;
      }, n.deleteValue = function(o) {
        var r = new e(n._currentContext);
        return r._currentContext.delete(o), r;
      };
    }
    return l(e, "BaseContext"), e;
  })()
), Dv = new Mk();

// node_modules/@opentelemetry/api/build/esm/context/NoopContextManager.js
var Zk = function(e, t) {
  var n = typeof Symbol == "function" && e[Symbol.iterator];
  if (!n) return e;
  var o = n.call(e), r, i = [], a;
  try {
    for (; (t === void 0 || t-- > 0) && !(r = o.next()).done; ) i.push(r.value);
  } catch (u) {
    a = { error: u };
  } finally {
    try {
      r && !r.done && (n = o.return) && n.call(o);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, Lk = function(e, t, n) {
  if (n || arguments.length === 2) for (var o = 0, r = t.length, i; o < r; o++)
    (i || !(o in t)) && (i || (i = Array.prototype.slice.call(t, 0, o)), i[o] = t[o]);
  return e.concat(i || Array.prototype.slice.call(t));
}, Uv = (
  /** @class */
  (function() {
    function e() {
    }
    return l(e, "NoopContextManager"), e.prototype.active = function() {
      return Dv;
    }, e.prototype.with = function(t, n, o) {
      for (var r = [], i = 3; i < arguments.length; i++)
        r[i - 3] = arguments[i];
      return n.call.apply(n, Lk([o], Zk(r), !1));
    }, e.prototype.bind = function(t, n) {
      return n;
    }, e.prototype.enable = function() {
      return this;
    }, e.prototype.disable = function() {
      return this;
    }, e;
  })()
);

// node_modules/@opentelemetry/api/build/esm/api/context.js
var Fk = function(e, t) {
  var n = typeof Symbol == "function" && e[Symbol.iterator];
  if (!n) return e;
  var o = n.call(e), r, i = [], a;
  try {
    for (; (t === void 0 || t-- > 0) && !(r = o.next()).done; ) i.push(r.value);
  } catch (u) {
    a = { error: u };
  } finally {
    try {
      r && !r.done && (n = o.return) && n.call(o);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, Vk = function(e, t, n) {
  if (n || arguments.length === 2) for (var o = 0, r = t.length, i; o < r; o++)
    (i || !(o in t)) && (i || (i = Array.prototype.slice.call(t, 0, o)), i[o] = t[o]);
  return e.concat(i || Array.prototype.slice.call(t));
}, Zp = "context", qk = new Uv(), va = (
  /** @class */
  (function() {
    function e() {
    }
    return l(e, "ContextAPI"), e.getInstance = function() {
      return this._instance || (this._instance = new e()), this._instance;
    }, e.prototype.setGlobalContextManager = function(t) {
      return pn(Zp, t, fn.instance());
    }, e.prototype.active = function() {
      return this._getContextManager().active();
    }, e.prototype.with = function(t, n, o) {
      for (var r, i = [], a = 3; a < arguments.length; a++)
        i[a - 3] = arguments[a];
      return (r = this._getContextManager()).with.apply(r, Vk([t, n, o], Fk(i), !1));
    }, e.prototype.bind = function(t, n) {
      return this._getContextManager().bind(t, n);
    }, e.prototype._getContextManager = function() {
      return Pt(Zp) || qk;
    }, e.prototype.disable = function() {
      this._getContextManager().disable(), mn(Zp, fn.instance());
    }, e;
  })()
);

// node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js
var ya;
(function(e) {
  e[e.NONE = 0] = "NONE", e[e.SAMPLED = 1] = "SAMPLED";
})(ya || (ya = {}));

// node_modules/@opentelemetry/api/build/esm/trace/invalid-span-constants.js
var Lp = "0000000000000000", Fp = "00000000000000000000000000000000", Mv = {
  traceId: Fp,
  spanId: Lp,
  traceFlags: ya.NONE
};

// node_modules/@opentelemetry/api/build/esm/trace/NonRecordingSpan.js
var tr = (
  /** @class */
  (function() {
    function e(t) {
      t === void 0 && (t = Mv), this._spanContext = t;
    }
    return l(e, "NonRecordingSpan"), e.prototype.spanContext = function() {
      return this._spanContext;
    }, e.prototype.setAttribute = function(t, n) {
      return this;
    }, e.prototype.setAttributes = function(t) {
      return this;
    }, e.prototype.addEvent = function(t, n) {
      return this;
    }, e.prototype.addLink = function(t) {
      return this;
    }, e.prototype.addLinks = function(t) {
      return this;
    }, e.prototype.setStatus = function(t) {
      return this;
    }, e.prototype.updateName = function(t) {
      return this;
    }, e.prototype.end = function(t) {
    }, e.prototype.isRecording = function() {
      return !1;
    }, e.prototype.recordException = function(t, n) {
    }, e;
  })()
);

// node_modules/@opentelemetry/api/build/esm/trace/context-utils.js
var Vp = Cv("OpenTelemetry Context Key SPAN");
function _a(e) {
  return e.getValue(Vp) || void 0;
}
l(_a, "getSpan");
function Zv() {
  return _a(va.getInstance().active());
}
l(Zv, "getActiveSpan");
function yo(e, t) {
  return e.setValue(Vp, t);
}
l(yo, "setSpan");
function Lv(e) {
  return e.deleteValue(Vp);
}
l(Lv, "deleteSpan");
function Fv(e, t) {
  return yo(e, new tr(t));
}
l(Fv, "setSpanContext");
function ba(e) {
  var t;
  return (t = _a(e)) === null || t === void 0 ? void 0 : t.spanContext();
}
l(ba, "getSpanContext");

// node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js
var Jk = /^([0-9a-f]{32})$/i, Bk = /^[0-9a-f]{16}$/i;
function Gk(e) {
  return Jk.test(e) && e !== Fp;
}
l(Gk, "isValidTraceId");
function Wk(e) {
  return Bk.test(e) && e !== Lp;
}
l(Wk, "isValidSpanId");
function xa(e) {
  return Gk(e.traceId) && Wk(e.spanId);
}
l(xa, "isSpanContextValid");
function Vv(e) {
  return new tr(e);
}
l(Vv, "wrapSpanContext");

// node_modules/@opentelemetry/api/build/esm/trace/NoopTracer.js
var qp = va.getInstance(), $a = (
  /** @class */
  (function() {
    function e() {
    }
    return l(e, "NoopTracer"), e.prototype.startSpan = function(t, n, o) {
      o === void 0 && (o = qp.active());
      var r = !!n?.root;
      if (r)
        return new tr();
      var i = o && ba(o);
      return Kk(i) && xa(i) ? new tr(i) : new tr();
    }, e.prototype.startActiveSpan = function(t, n, o, r) {
      var i, a, u;
      if (!(arguments.length < 2)) {
        arguments.length === 2 ? u = n : arguments.length === 3 ? (i = n, u = o) : (i = n, a = o, u = r);
        var c = a ?? qp.active(), d = this.startSpan(t, i, c), p = yo(c, d);
        return qp.with(p, u, void 0, d);
      }
    }, e;
  })()
);
function Kk(e) {
  return typeof e == "object" && typeof e.spanId == "string" && typeof e.traceId == "string" && typeof e.traceFlags == "number";
}
l(Kk, "isSpanContext");

// node_modules/@opentelemetry/api/build/esm/trace/ProxyTracer.js
var Hk = new $a(), qv = (
  /** @class */
  (function() {
    function e(t, n, o, r) {
      this._provider = t, this.name = n, this.version = o, this.options = r;
    }
    return l(e, "ProxyTracer"), e.prototype.startSpan = function(t, n, o) {
      return this._getTracer().startSpan(t, n, o);
    }, e.prototype.startActiveSpan = function(t, n, o, r) {
      var i = this._getTracer();
      return Reflect.apply(i.startActiveSpan, i, arguments);
    }, e.prototype._getTracer = function() {
      if (this._delegate)
        return this._delegate;
      var t = this._provider.getDelegateTracer(this.name, this.version, this.options);
      return t ? (this._delegate = t, this._delegate) : Hk;
    }, e;
  })()
);

// node_modules/@opentelemetry/api/build/esm/trace/NoopTracerProvider.js
var Jv = (
  /** @class */
  (function() {
    function e() {
    }
    return l(e, "NoopTracerProvider"), e.prototype.getTracer = function(t, n, o) {
      return new $a();
    }, e;
  })()
);

// node_modules/@opentelemetry/api/build/esm/trace/ProxyTracerProvider.js
var Xk = new Jv(), Jp = (
  /** @class */
  (function() {
    function e() {
    }
    return l(e, "ProxyTracerProvider"), e.prototype.getTracer = function(t, n, o) {
      var r;
      return (r = this.getDelegateTracer(t, n, o)) !== null && r !== void 0 ? r : new qv(this, t, n, o);
    }, e.prototype.getDelegate = function() {
      var t;
      return (t = this._delegate) !== null && t !== void 0 ? t : Xk;
    }, e.prototype.setDelegate = function(t) {
      this._delegate = t;
    }, e.prototype.getDelegateTracer = function(t, n, o) {
      var r;
      return (r = this._delegate) === null || r === void 0 ? void 0 : r.getTracer(t, n, o);
    }, e;
  })()
);

// node_modules/@opentelemetry/api/build/esm/trace/status.js
var gn;
(function(e) {
  e[e.UNSET = 0] = "UNSET", e[e.OK = 1] = "OK", e[e.ERROR = 2] = "ERROR";
})(gn || (gn = {}));

// node_modules/@opentelemetry/api/build/esm/api/trace.js
var Bp = "trace", Bv = (
  /** @class */
  (function() {
    function e() {
      this._proxyTracerProvider = new Jp(), this.wrapSpanContext = Vv, this.isSpanContextValid = xa, this.deleteSpan = Lv, this.getSpan = _a, this.getActiveSpan = Zv, this.getSpanContext = ba, this.setSpan = yo, this.setSpanContext = Fv;
    }
    return l(e, "TraceAPI"), e.getInstance = function() {
      return this._instance || (this._instance = new e()), this._instance;
    }, e.prototype.setGlobalTracerProvider = function(t) {
      var n = pn(Bp, this._proxyTracerProvider, fn.instance());
      return n && this._proxyTracerProvider.setDelegate(t), n;
    }, e.prototype.getTracerProvider = function() {
      return Pt(Bp) || this._proxyTracerProvider;
    }, e.prototype.getTracer = function(t, n) {
      return this.getTracerProvider().getTracer(t, n);
    }, e.prototype.disable = function() {
      mn(Bp, fn.instance()), this._proxyTracerProvider = new Jp();
    }, e;
  })()
);

// node_modules/@opentelemetry/api/build/esm/trace-api.js
var Gp = Bv.getInstance();

// node_modules/ai/dist/index.mjs
var Qk = Object.defineProperty, eI = /* @__PURE__ */ l((e, t) => {
  for (var n in t)
    Qk(e, n, { get: t[n], enumerable: !0 });
}, "__export"), ry = "AI_NoOutputSpecifiedError", ny = `vercel.ai.error.${ry}`, tI = Symbol.for(ny), oy, rI = class extends C {
  static {
    l(this, "NoOutputSpecifiedError");
  }
  // used in isInstance
  constructor({ message: e = "No output specified." } = {}) {
    super({ name: ry, message: e }), this[oy] = !0;
  }
  static isInstance(e) {
    return C.hasMarker(e, ny);
  }
};
oy = tI;
function nI(e) {
  let t = "AI SDK Warning:";
  switch (e.type) {
    case "unsupported-setting": {
      let n = `${t} The "${e.setting}" setting is not supported by this model`;
      return e.details && (n += ` - ${e.details}`), n;
    }
    case "unsupported-tool": {
      let n = "name" in e.tool ? e.tool.name : "unknown tool", o = `${t} The tool "${n}" is not supported by this model`;
      return e.details && (o += ` - ${e.details}`), o;
    }
    case "other":
      return `${t} ${e.message}`;
    default:
      return `${t} ${JSON.stringify(e, null, 2)}`;
  }
}
l(nI, "formatWarning");
var oI = "AI SDK Warning System: To turn off warning logging, set the AI_SDK_LOG_WARNINGS global to false.", Gv = !1, iI = /* @__PURE__ */ l((e) => {
  if (e.length === 0)
    return;
  let t = globalThis.AI_SDK_LOG_WARNINGS;
  if (t !== !1) {
    if (typeof t == "function") {
      t(e);
      return;
    }
    Gv || (Gv = !0, console.info(oI));
    for (let n of e)
      console.warn(nI(n));
  }
}, "logWarnings"), iy = "AI_InvalidArgumentError", ay = `vercel.ai.error.${iy}`, aI = Symbol.for(ay), sy, _t = class extends C {
  static {
    l(this, "InvalidArgumentError");
  }
  constructor({
    parameter: e,
    value: t,
    message: n
  }) {
    super({
      name: iy,
      message: `Invalid argument for parameter ${e}: ${n}`
    }), this[sy] = !0, this.parameter = e, this.value = t;
  }
  static isInstance(e) {
    return C.hasMarker(e, ay);
  }
};
sy = aI;
var sI = "AI_InvalidStreamPartError", lI = `vercel.ai.error.${sI}`, uI = Symbol.for(lI), cI;
cI = uI;
var ly = "AI_InvalidToolInputError", uy = `vercel.ai.error.${ly}`, dI = Symbol.for(uy), cy, dy = class extends C {
  static {
    l(this, "InvalidToolInputError");
  }
  constructor({
    toolInput: e,
    toolName: t,
    cause: n,
    message: o = `Invalid input for tool ${t}: ${Jt(n)}`
  }) {
    super({ name: ly, message: o, cause: n }), this[cy] = !0, this.toolInput = e, this.toolName = t;
  }
  static isInstance(e) {
    return C.hasMarker(e, uy);
  }
};
cy = dI;
var pI = "AI_NoImageGeneratedError", mI = `vercel.ai.error.${pI}`, fI = Symbol.for(mI), gI;
gI = fI;
var py = "AI_NoObjectGeneratedError", my = `vercel.ai.error.${py}`, hI = Symbol.for(my), fy, Wv = class extends C {
  static {
    l(this, "NoObjectGeneratedError");
  }
  constructor({
    message: e = "No object generated.",
    cause: t,
    text: n,
    response: o,
    usage: r,
    finishReason: i
  }) {
    super({ name: py, message: e, cause: t }), this[fy] = !0, this.text = n, this.response = o, this.usage = r, this.finishReason = i;
  }
  static isInstance(e) {
    return C.hasMarker(e, my);
  }
};
fy = hI;
var vI = "AI_NoOutputGeneratedError", yI = `vercel.ai.error.${vI}`, _I = Symbol.for(yI), bI;
bI = _I;
var gy = "AI_NoSuchToolError", hy = `vercel.ai.error.${gy}`, xI = Symbol.for(hy), vy, Hp = class extends C {
  static {
    l(this, "NoSuchToolError");
  }
  constructor({
    toolName: e,
    availableTools: t = void 0,
    message: n = `Model tried to call unavailable tool '${e}'. ${t === void 0 ? "No tools are available." : `Available tools: ${t.join(", ")}.`}`
  }) {
    super({ name: gy, message: n }), this[vy] = !0, this.toolName = e, this.availableTools = t;
  }
  static isInstance(e) {
    return C.hasMarker(e, hy);
  }
};
vy = xI;
var yy = "AI_ToolCallRepairError", _y = `vercel.ai.error.${yy}`, $I = Symbol.for(_y), by, wI = class extends C {
  static {
    l(this, "ToolCallRepairError");
  }
  constructor({
    cause: e,
    originalError: t,
    message: n = `Error repairing tool call: ${Jt(e)}`
  }) {
    super({ name: yy, message: n, cause: e }), this[by] = !0, this.originalError = t;
  }
  static isInstance(e) {
    return C.hasMarker(e, _y);
  }
};
by = $I;
var kI = class extends C {
  static {
    l(this, "UnsupportedModelVersionError");
  }
  constructor(e) {
    super({
      name: "AI_UnsupportedModelVersionError",
      message: `Unsupported model version ${e.version} for provider "${e.provider}" and model "${e.modelId}". AI SDK 5 only supports models that implement specification version "v2".`
    }), this.version = e.version, this.provider = e.provider, this.modelId = e.modelId;
  }
}, II = "AI_InvalidDataContentError", SI = `vercel.ai.error.${II}`, TI = Symbol.for(SI), zI;
zI = TI;
var xy = "AI_InvalidMessageRoleError", $y = `vercel.ai.error.${xy}`, EI = Symbol.for($y), wy, OI = class extends C {
  static {
    l(this, "InvalidMessageRoleError");
  }
  constructor({
    role: e,
    message: t = `Invalid message role: '${e}'. Must be one of: "system", "user", "assistant", "tool".`
  }) {
    super({ name: xy, message: t }), this[wy] = !0, this.role = e;
  }
  static isInstance(e) {
    return C.hasMarker(e, $y);
  }
};
wy = EI;
var jI = "AI_MessageConversionError", PI = `vercel.ai.error.${jI}`, NI = Symbol.for(PI), AI;
AI = NI;
var ky = "AI_DownloadError", Iy = `vercel.ai.error.${ky}`, RI = Symbol.for(Iy), Sy, Wp = class extends C {
  static {
    l(this, "DownloadError");
  }
  constructor({
    url: e,
    statusCode: t,
    statusText: n,
    cause: o,
    message: r = o == null ? `Failed to download ${e}: ${t} ${n}` : `Failed to download ${e}: ${o}`
  }) {
    super({ name: ky, message: r, cause: o }), this[Sy] = !0, this.url = e, this.statusCode = t, this.statusText = n;
  }
  static isInstance(e) {
    return C.hasMarker(e, Iy);
  }
};
Sy = RI;
var Ty = "AI_RetryError", zy = `vercel.ai.error.${Ty}`, CI = Symbol.for(zy), Ey, Kv = class extends C {
  static {
    l(this, "RetryError");
  }
  constructor({
    message: e,
    reason: t,
    errors: n
  }) {
    super({ name: Ty, message: e }), this[Ey] = !0, this.reason = t, this.errors = n, this.lastError = n[n.length - 1];
  }
  static isInstance(e) {
    return C.hasMarker(e, zy);
  }
};
Ey = CI;
function Hv(e) {
  if (typeof e != "string") {
    if (e.specificationVersion !== "v2")
      throw new kI({
        version: e.specificationVersion,
        provider: e.provider,
        modelId: e.modelId
      });
    return e;
  }
  return DI().languageModel(e);
}
l(Hv, "resolveLanguageModel");
function DI() {
  var e;
  return (e = globalThis.AI_SDK_DEFAULT_PROVIDER) != null ? e : Ov;
}
l(DI, "getGlobalProvider");
var UI = [
  {
    mediaType: "image/gif",
    bytesPrefix: [71, 73, 70]
    // GIF
  },
  {
    mediaType: "image/png",
    bytesPrefix: [137, 80, 78, 71]
    // PNG
  },
  {
    mediaType: "image/jpeg",
    bytesPrefix: [255, 216]
    // JPEG
  },
  {
    mediaType: "image/webp",
    bytesPrefix: [
      82,
      73,
      70,
      70,
      // "RIFF"
      null,
      null,
      null,
      null,
      // file size (variable)
      87,
      69,
      66,
      80
      // "WEBP"
    ]
  },
  {
    mediaType: "image/bmp",
    bytesPrefix: [66, 77]
  },
  {
    mediaType: "image/tiff",
    bytesPrefix: [73, 73, 42, 0]
  },
  {
    mediaType: "image/tiff",
    bytesPrefix: [77, 77, 0, 42]
  },
  {
    mediaType: "image/avif",
    bytesPrefix: [
      0,
      0,
      0,
      32,
      102,
      116,
      121,
      112,
      97,
      118,
      105,
      102
    ]
  },
  {
    mediaType: "image/heic",
    bytesPrefix: [
      0,
      0,
      0,
      32,
      102,
      116,
      121,
      112,
      104,
      101,
      105,
      99
    ]
  }
];
var MI = /* @__PURE__ */ l((e) => {
  let t = typeof e == "string" ? Yt(e) : e, n = (t[6] & 127) << 21 | (t[7] & 127) << 14 | (t[8] & 127) << 7 | t[9] & 127;
  return t.slice(n + 10);
}, "stripID3");
function ZI(e) {
  return typeof e == "string" && e.startsWith("SUQz") || typeof e != "string" && e.length > 10 && e[0] === 73 && // 'I'
  e[1] === 68 && // 'D'
  e[2] === 51 ? MI(e) : e;
}
l(ZI, "stripID3TagsIfPresent");
function LI({
  data: e,
  signatures: t
}) {
  let n = ZI(e), o = typeof n == "string" ? Yt(
    n.substring(0, Math.min(n.length, 24))
  ) : n;
  for (let r of t)
    if (o.length >= r.bytesPrefix.length && r.bytesPrefix.every(
      (i, a) => i === null || o[a] === i
    ))
      return r.mediaType;
}
l(LI, "detectMediaType");
var Oy = "5.0.118", FI = /* @__PURE__ */ l(async ({ url: e }) => {
  var t;
  let n = e.toString();
  try {
    let o = await fetch(n, {
      headers: ut(
        {},
        `ai-sdk/${Oy}`,
        fa()
      )
    });
    if (!o.ok)
      throw new Wp({
        url: n,
        statusCode: o.status,
        statusText: o.statusText
      });
    return {
      data: new Uint8Array(await o.arrayBuffer()),
      mediaType: (t = o.headers.get("content-type")) != null ? t : void 0
    };
  } catch (o) {
    throw Wp.isInstance(o) ? o : new Wp({ url: n, cause: o });
  }
}, "download"), VI = /* @__PURE__ */ l((e = FI) => (t) => Promise.all(
  t.map(
    async (n) => n.isUrlSupportedByModel ? null : e(n)
  )
), "createDefaultDownloadFunction");
function qI(e) {
  try {
    let [t, n] = e.split(",");
    return {
      mediaType: t.split(";")[0].split(":")[1],
      base64Content: n
    };
  } catch {
    return {
      mediaType: void 0,
      base64Content: void 0
    };
  }
}
l(qI, "splitDataUrl");
var jy = s.union([
  s.string(),
  s.instanceof(Uint8Array),
  s.instanceof(ArrayBuffer),
  s.custom(
    // Buffer might not be available in some environments such as CloudFlare:
    (e) => {
      var t, n;
      return (n = (t = globalThis.Buffer) == null ? void 0 : t.isBuffer(e)) != null ? n : !1;
    },
    { message: "Must be a Buffer" }
  )
]);
function Py(e) {
  if (e instanceof Uint8Array)
    return { data: e, mediaType: void 0 };
  if (e instanceof ArrayBuffer)
    return { data: new Uint8Array(e), mediaType: void 0 };
  if (typeof e == "string")
    try {
      e = new URL(e);
    } catch {
    }
  if (e instanceof URL && e.protocol === "data:") {
    let { mediaType: t, base64Content: n } = qI(
      e.toString()
    );
    if (t == null || n == null)
      throw new C({
        name: "InvalidDataContentError",
        message: `Invalid data URL format in content ${e.toString()}`
      });
    return { data: n, mediaType: t };
  }
  return { data: e, mediaType: void 0 };
}
l(Py, "convertToLanguageModelV2DataContent");
function JI(e) {
  return typeof e == "string" ? e : e instanceof ArrayBuffer ? cn(new Uint8Array(e)) : cn(e);
}
l(JI, "convertDataContentToBase64String");
async function BI({
  prompt: e,
  supportedUrls: t,
  download: n = VI()
}) {
  let o = await WI(
    e.messages,
    n,
    t
  );
  return [
    ...e.system != null ? [{ role: "system", content: e.system }] : [],
    ...e.messages.map(
      (r) => GI({ message: r, downloadedAssets: o })
    )
  ];
}
l(BI, "convertToLanguageModelPrompt");
function GI({
  message: e,
  downloadedAssets: t
}) {
  let n = e.role;
  switch (n) {
    case "system":
      return {
        role: "system",
        content: e.content,
        providerOptions: e.providerOptions
      };
    case "user":
      return typeof e.content == "string" ? {
        role: "user",
        content: [{ type: "text", text: e.content }],
        providerOptions: e.providerOptions
      } : {
        role: "user",
        content: e.content.map((o) => KI(o, t)).filter((o) => o.type !== "text" || o.text !== ""),
        providerOptions: e.providerOptions
      };
    case "assistant":
      return typeof e.content == "string" ? {
        role: "assistant",
        content: [{ type: "text", text: e.content }],
        providerOptions: e.providerOptions
      } : {
        role: "assistant",
        content: e.content.filter(
          // remove empty text parts (no text, and no provider options):
          (o) => o.type !== "text" || o.text !== "" || o.providerOptions != null
        ).map((o) => {
          let r = o.providerOptions;
          switch (o.type) {
            case "file": {
              let { data: i, mediaType: a } = Py(
                o.data
              );
              return {
                type: "file",
                data: i,
                filename: o.filename,
                mediaType: a ?? o.mediaType,
                providerOptions: r
              };
            }
            case "reasoning":
              return {
                type: "reasoning",
                text: o.text,
                providerOptions: r
              };
            case "text":
              return {
                type: "text",
                text: o.text,
                providerOptions: r
              };
            case "tool-call":
              return {
                type: "tool-call",
                toolCallId: o.toolCallId,
                toolName: o.toolName,
                input: o.input,
                providerExecuted: o.providerExecuted,
                providerOptions: r
              };
            case "tool-result":
              return {
                type: "tool-result",
                toolCallId: o.toolCallId,
                toolName: o.toolName,
                output: o.output,
                providerOptions: r
              };
          }
        }),
        providerOptions: e.providerOptions
      };
    case "tool":
      return {
        role: "tool",
        content: e.content.map((o) => ({
          type: "tool-result",
          toolCallId: o.toolCallId,
          toolName: o.toolName,
          output: o.output,
          providerOptions: o.providerOptions
        })),
        providerOptions: e.providerOptions
      };
    default: {
      let o = n;
      throw new OI({ role: o });
    }
  }
}
l(GI, "convertToLanguageModelMessage");
async function WI(e, t, n) {
  let o = e.filter((i) => i.role === "user").map((i) => i.content).filter(
    (i) => Array.isArray(i)
  ).flat().filter(
    (i) => i.type === "image" || i.type === "file"
  ).map((i) => {
    var a;
    let u = (a = i.mediaType) != null ? a : i.type === "image" ? "image/*" : void 0, c = i.type === "image" ? i.image : i.data;
    if (typeof c == "string")
      try {
        c = new URL(c);
      } catch {
      }
    return { mediaType: u, data: c };
  }).filter(
    (i) => i.data instanceof URL
  ).map((i) => ({
    url: i.data,
    isUrlSupportedByModel: i.mediaType != null && Oh({
      url: i.data.toString(),
      mediaType: i.mediaType,
      supportedUrls: n
    })
  })), r = await t(o);
  return Object.fromEntries(
    r.map(
      (i, a) => i == null ? null : [
        o[a].url.toString(),
        { data: i.data, mediaType: i.mediaType }
      ]
    ).filter((i) => i != null)
  );
}
l(WI, "downloadAssets");
function KI(e, t) {
  var n;
  if (e.type === "text")
    return {
      type: "text",
      text: e.text,
      providerOptions: e.providerOptions
    };
  let o, r = e.type;
  switch (r) {
    case "image":
      o = e.image;
      break;
    case "file":
      o = e.data;
      break;
    default:
      throw new Error(`Unsupported part type: ${r}`);
  }
  let { data: i, mediaType: a } = Py(o), u = a ?? e.mediaType, c = i;
  if (c instanceof URL) {
    let d = t[c.toString()];
    d && (c = d.data, u ?? (u = d.mediaType));
  }
  switch (r) {
    case "image":
      return (c instanceof Uint8Array || typeof c == "string") && (u = (n = LI({ data: c, signatures: UI })) != null ? n : u), {
        type: "file",
        mediaType: u ?? "image/*",
        // any image
        filename: void 0,
        data: c,
        providerOptions: e.providerOptions
      };
    case "file": {
      if (u == null)
        throw new Error("Media type is missing for file part");
      return {
        type: "file",
        mediaType: u,
        filename: e.filename,
        data: c,
        providerOptions: e.providerOptions
      };
    }
  }
}
l(KI, "convertPartToLanguageModelPart");
function Xv({
  maxOutputTokens: e,
  temperature: t,
  topP: n,
  topK: o,
  presencePenalty: r,
  frequencyPenalty: i,
  seed: a,
  stopSequences: u
}) {
  if (e != null) {
    if (!Number.isInteger(e))
      throw new _t({
        parameter: "maxOutputTokens",
        value: e,
        message: "maxOutputTokens must be an integer"
      });
    if (e < 1)
      throw new _t({
        parameter: "maxOutputTokens",
        value: e,
        message: "maxOutputTokens must be >= 1"
      });
  }
  if (t != null && typeof t != "number")
    throw new _t({
      parameter: "temperature",
      value: t,
      message: "temperature must be a number"
    });
  if (n != null && typeof n != "number")
    throw new _t({
      parameter: "topP",
      value: n,
      message: "topP must be a number"
    });
  if (o != null && typeof o != "number")
    throw new _t({
      parameter: "topK",
      value: o,
      message: "topK must be a number"
    });
  if (r != null && typeof r != "number")
    throw new _t({
      parameter: "presencePenalty",
      value: r,
      message: "presencePenalty must be a number"
    });
  if (i != null && typeof i != "number")
    throw new _t({
      parameter: "frequencyPenalty",
      value: i,
      message: "frequencyPenalty must be a number"
    });
  if (a != null && !Number.isInteger(a))
    throw new _t({
      parameter: "seed",
      value: a,
      message: "seed must be an integer"
    });
  return {
    maxOutputTokens: e,
    temperature: t,
    topP: n,
    topK: o,
    presencePenalty: r,
    frequencyPenalty: i,
    stopSequences: u,
    seed: a
  };
}
l(Xv, "prepareCallSettings");
function HI(e) {
  return e != null && Object.keys(e).length > 0;
}
l(HI, "isNonEmptyObject");
function XI({
  tools: e,
  toolChoice: t,
  activeTools: n
}) {
  return HI(e) ? {
    tools: (n != null ? Object.entries(e).filter(
      ([r]) => n.includes(r)
    ) : Object.entries(e)).map(([r, i]) => {
      let a = i.type;
      switch (a) {
        case void 0:
        case "dynamic":
        case "function":
          return {
            type: "function",
            name: r,
            description: i.description,
            inputSchema: gr(i.inputSchema).jsonSchema,
            providerOptions: i.providerOptions
          };
        case "provider-defined":
          return {
            type: "provider-defined",
            name: r,
            id: i.id,
            args: i.args
          };
        default: {
          let u = a;
          throw new Error(`Unsupported tool type: ${u}`);
        }
      }
    }),
    toolChoice: t == null ? { type: "auto" } : typeof t == "string" ? { type: t } : { type: "tool", toolName: t.toolName }
  } : {
    tools: void 0,
    toolChoice: void 0
  };
}
l(XI, "prepareToolsAndToolChoice");
var bo = s.lazy(
  () => s.union([
    s.null(),
    s.string(),
    s.number(),
    s.boolean(),
    s.record(s.string(), bo),
    s.array(bo)
  ])
), H = s.record(
  s.string(),
  s.record(s.string(), bo)
), Ny = s.object({
  type: s.literal("text"),
  text: s.string(),
  providerOptions: H.optional()
}), YI = s.object({
  type: s.literal("image"),
  image: s.union([jy, s.instanceof(URL)]),
  mediaType: s.string().optional(),
  providerOptions: H.optional()
}), Ay = s.object({
  type: s.literal("file"),
  data: s.union([jy, s.instanceof(URL)]),
  filename: s.string().optional(),
  mediaType: s.string(),
  providerOptions: H.optional()
}), QI = s.object({
  type: s.literal("reasoning"),
  text: s.string(),
  providerOptions: H.optional()
}), eS = s.object({
  type: s.literal("tool-call"),
  toolCallId: s.string(),
  toolName: s.string(),
  input: s.unknown(),
  providerOptions: H.optional(),
  providerExecuted: s.boolean().optional()
}), tS = s.discriminatedUnion("type", [
  s.object({
    type: s.literal("text"),
    value: s.string()
  }),
  s.object({
    type: s.literal("json"),
    value: bo
  }),
  s.object({
    type: s.literal("error-text"),
    value: s.string()
  }),
  s.object({
    type: s.literal("error-json"),
    value: bo
  }),
  s.object({
    type: s.literal("content"),
    value: s.array(
      s.union([
        s.object({
          type: s.literal("text"),
          text: s.string()
        }),
        s.object({
          type: s.literal("media"),
          data: s.string(),
          mediaType: s.string()
        })
      ])
    )
  })
]), Ry = s.object({
  type: s.literal("tool-result"),
  toolCallId: s.string(),
  toolName: s.string(),
  output: tS,
  providerOptions: H.optional()
}), rS = s.object(
  {
    role: s.literal("system"),
    content: s.string(),
    providerOptions: H.optional()
  }
);
var nS = s.object({
  role: s.literal("user"),
  content: s.union([
    s.string(),
    s.array(s.union([Ny, YI, Ay]))
  ]),
  providerOptions: H.optional()
});
var oS = s.object({
  role: s.literal("assistant"),
  content: s.union([
    s.string(),
    s.array(
      s.union([
        Ny,
        Ay,
        QI,
        eS,
        Ry
      ])
    )
  ]),
  providerOptions: H.optional()
});
var iS = s.object({
  role: s.literal("tool"),
  content: s.array(Ry),
  providerOptions: H.optional()
});
var aS = s.union([
  rS,
  nS,
  oS,
  iS
]);
async function sS(e) {
  if (e.prompt == null && e.messages == null)
    throw new It({
      prompt: e,
      message: "prompt or messages must be defined"
    });
  if (e.prompt != null && e.messages != null)
    throw new It({
      prompt: e,
      message: "prompt and messages cannot be defined at the same time"
    });
  if (e.system != null && typeof e.system != "string")
    throw new It({
      prompt: e,
      message: "system must be a string"
    });
  let t;
  if (e.prompt != null && typeof e.prompt == "string")
    t = [{ role: "user", content: e.prompt }];
  else if (e.prompt != null && Array.isArray(e.prompt))
    t = e.prompt;
  else if (e.messages != null)
    t = e.messages;
  else
    throw new It({
      prompt: e,
      message: "prompt or messages must be defined"
    });
  if (t.length === 0)
    throw new It({
      prompt: e,
      message: "messages must not be empty"
    });
  let n = await Le({
    value: t,
    schema: s.array(aS)
  });
  if (!n.success)
    throw new It({
      prompt: e,
      message: "The messages must be a ModelMessage[]. If you have passed a UIMessage[], you can use convertToModelMessages to convert them.",
      cause: n.error
    });
  return {
    messages: t,
    system: e.system
  };
}
l(sS, "standardizePrompt");
function lS(e) {
  if (!ha.isInstance(e))
    return e;
  let t = (process == null ? void 0 : "production") === "production", n = "https://v5.ai-sdk.dev/unauthenticated-ai-gateway";
  return t ? new C({
    name: "GatewayError",
    message: `Unauthenticated. Configure AI_GATEWAY_API_KEY or use a provider module. Learn more: ${n}`
  }) : Object.assign(
    new Error(`\x1B[1m\x1B[31mUnauthenticated request to AI Gateway.\x1B[0m

To authenticate, set the \x1B[33mAI_GATEWAY_API_KEY\x1B[0m environment variable with your API key.

Alternatively, you can use a provider module instead of the AI Gateway.

Learn more: \x1B[34m${n}\x1B[0m

`),
    { name: "GatewayAuthenticationError" }
  );
}
l(lS, "wrapGatewayError");
function Xp({
  operationId: e,
  telemetry: t
}) {
  return {
    // standardized operation and resource name:
    "operation.name": `${e}${t?.functionId != null ? ` ${t.functionId}` : ""}`,
    "resource.name": t?.functionId,
    // detailed, AI SDK specific data:
    "ai.operationId": e,
    "ai.telemetry.functionId": t?.functionId
  };
}
l(Xp, "assembleOperationName");
function uS({
  model: e,
  settings: t,
  telemetry: n,
  headers: o
}) {
  var r;
  return {
    "ai.model.provider": e.provider,
    "ai.model.id": e.modelId,
    // settings:
    ...Object.entries(t).reduce((i, [a, u]) => (i[`ai.settings.${a}`] = u, i), {}),
    // add metadata as attributes:
    ...Object.entries((r = n?.metadata) != null ? r : {}).reduce(
      (i, [a, u]) => (i[`ai.telemetry.metadata.${a}`] = u, i),
      {}
    ),
    // request headers
    ...Object.entries(o ?? {}).reduce((i, [a, u]) => (u !== void 0 && (i[`ai.request.headers.${a}`] = u), i), {})
  };
}
l(uS, "getBaseTelemetryAttributes");
var cS = {
  startSpan() {
    return wa;
  },
  startActiveSpan(e, t, n, o) {
    if (typeof t == "function")
      return t(wa);
    if (typeof n == "function")
      return n(wa);
    if (typeof o == "function")
      return o(wa);
  }
}, wa = {
  spanContext() {
    return dS;
  },
  setAttribute() {
    return this;
  },
  setAttributes() {
    return this;
  },
  addEvent() {
    return this;
  },
  addLink() {
    return this;
  },
  addLinks() {
    return this;
  },
  setStatus() {
    return this;
  },
  updateName() {
    return this;
  },
  end() {
    return this;
  },
  isRecording() {
    return !1;
  },
  recordException() {
    return this;
  }
}, dS = {
  traceId: "",
  spanId: "",
  traceFlags: 0
};
function pS({
  isEnabled: e = !1,
  tracer: t
} = {}) {
  return e ? t || Gp.getTracer("ai") : cS;
}
l(pS, "getTracer");
function Yp({
  name: e,
  tracer: t,
  attributes: n,
  fn: o,
  endWhenDone: r = !0
}) {
  return t.startActiveSpan(e, { attributes: n }, async (i) => {
    try {
      let a = await o(i);
      return r && i.end(), a;
    } catch (a) {
      try {
        Cy(i, a);
      } finally {
        i.end();
      }
      throw a;
    }
  });
}
l(Yp, "recordSpan");
function Cy(e, t) {
  t instanceof Error ? (e.recordException({
    name: t.name,
    message: t.message,
    stack: t.stack
  }), e.setStatus({
    code: gn.ERROR,
    message: t.message
  })) : e.setStatus({ code: gn.ERROR });
}
l(Cy, "recordErrorOnSpan");
function hn({
  telemetry: e,
  attributes: t
}) {
  return e?.isEnabled !== !0 ? {} : Object.entries(t).reduce((n, [o, r]) => {
    if (r == null)
      return n;
    if (typeof r == "object" && "input" in r && typeof r.input == "function") {
      if (e?.recordInputs === !1)
        return n;
      let i = r.input();
      return i == null ? n : { ...n, [o]: i };
    }
    if (typeof r == "object" && "output" in r && typeof r.output == "function") {
      if (e?.recordOutputs === !1)
        return n;
      let i = r.output();
      return i == null ? n : { ...n, [o]: i };
    }
    return { ...n, [o]: r };
  }, {});
}
l(hn, "selectTelemetryAttributes");
function mS(e) {
  return JSON.stringify(
    e.map((t) => ({
      ...t,
      content: typeof t.content == "string" ? t.content : t.content.map(
        (n) => n.type === "file" ? {
          ...n,
          data: n.data instanceof Uint8Array ? JI(n.data) : n.data
        } : n
      )
    }))
  );
}
l(mS, "stringifyForTelemetry");
function fS(e, t) {
  return {
    inputTokens: _o(e.inputTokens, t.inputTokens),
    outputTokens: _o(e.outputTokens, t.outputTokens),
    totalTokens: _o(e.totalTokens, t.totalTokens),
    reasoningTokens: _o(
      e.reasoningTokens,
      t.reasoningTokens
    ),
    cachedInputTokens: _o(
      e.cachedInputTokens,
      t.cachedInputTokens
    )
  };
}
l(fS, "addLanguageModelUsage");
function _o(e, t) {
  return e == null && t == null ? void 0 : (e ?? 0) + (t ?? 0);
}
l(_o, "addTokenCounts");
function gS(e) {
  return e === void 0 ? [] : Array.isArray(e) ? e : [e];
}
l(gS, "asArray");
function hS({
  error: e,
  exponentialBackoffDelay: t
}) {
  let n = e.responseHeaders;
  if (!n)
    return t;
  let o, r = n["retry-after-ms"];
  if (r) {
    let a = parseFloat(r);
    Number.isNaN(a) || (o = a);
  }
  let i = n["retry-after"];
  if (i && o === void 0) {
    let a = parseFloat(i);
    Number.isNaN(a) ? o = Date.parse(i) - Date.now() : o = a * 1e3;
  }
  return o != null && !Number.isNaN(o) && 0 <= o && (o < 60 * 1e3 || o < t) ? o : t;
}
l(hS, "getRetryDelayInMs");
var vS = /* @__PURE__ */ l(({
  maxRetries: e = 2,
  initialDelayInMs: t = 2e3,
  backoffFactor: n = 2,
  abortSignal: o
} = {}) => async (r) => Dy(r, {
  maxRetries: e,
  delayInMs: t,
  backoffFactor: n,
  abortSignal: o
}), "retryWithExponentialBackoffRespectingRetryHeaders");
async function Dy(e, {
  maxRetries: t,
  delayInMs: n,
  backoffFactor: o,
  abortSignal: r
}, i = []) {
  try {
    return await e();
  } catch (a) {
    if (Ht(a) || t === 0)
      throw a;
    let u = ma(a), c = [...i, a], d = c.length;
    if (d > t)
      throw new Kv({
        message: `Failed after ${d} attempts. Last error: ${u}`,
        reason: "maxRetriesExceeded",
        errors: c
      });
    if (a instanceof Error && se.isInstance(a) && a.isRetryable === !0 && d <= t)
      return await Th(
        hS({
          error: a,
          exponentialBackoffDelay: n
        }),
        { abortSignal: r }
      ), Dy(
        e,
        {
          maxRetries: t,
          delayInMs: o * n,
          backoffFactor: o,
          abortSignal: r
        },
        c
      );
    throw d === 1 ? a : new Kv({
      message: `Failed after ${d} attempts with non-retryable error: '${u}'`,
      reason: "errorNotRetryable",
      errors: c
    });
  }
}
l(Dy, "_retryWithExponentialBackoff");
function yS({
  maxRetries: e,
  abortSignal: t
}) {
  if (e != null) {
    if (!Number.isInteger(e))
      throw new _t({
        parameter: "maxRetries",
        value: e,
        message: "maxRetries must be an integer"
      });
    if (e < 0)
      throw new _t({
        parameter: "maxRetries",
        value: e,
        message: "maxRetries must be >= 0"
      });
  }
  let n = e ?? 2;
  return {
    maxRetries: n,
    retry: vS({
      maxRetries: n,
      abortSignal: t
    })
  };
}
l(yS, "prepareRetries");
function Yv(e) {
  let t = e.filter(
    (n) => n.type === "text"
  );
  if (t.length !== 0)
    return t.map((n) => n.text).join("");
}
l(Yv, "extractTextContent");
var _S = class {
  static {
    l(this, "DefaultGeneratedFile");
  }
  constructor({
    data: e,
    mediaType: t
  }) {
    let n = e instanceof Uint8Array;
    this.base64Data = n ? void 0 : e, this.uint8ArrayData = n ? e : void 0, this.mediaType = t;
  }
  // lazy conversion with caching to avoid unnecessary conversion overhead:
  get base64() {
    return this.base64Data == null && (this.base64Data = cn(this.uint8ArrayData)), this.base64Data;
  }
  // lazy conversion with caching to avoid unnecessary conversion overhead:
  get uint8Array() {
    return this.uint8ArrayData == null && (this.uint8ArrayData = Yt(this.base64Data)), this.uint8ArrayData;
  }
};
async function bS({
  toolCall: e,
  tools: t,
  repairToolCall: n,
  system: o,
  messages: r
}) {
  try {
    if (t == null)
      throw new Hp({ toolName: e.toolName });
    try {
      return await Qv({ toolCall: e, tools: t });
    } catch (i) {
      if (n == null || !(Hp.isInstance(i) || dy.isInstance(i)))
        throw i;
      let a = null;
      try {
        a = await n({
          toolCall: e,
          tools: t,
          inputSchema: /* @__PURE__ */ l(({ toolName: u }) => {
            let { inputSchema: c } = t[u];
            return gr(c).jsonSchema;
          }, "inputSchema"),
          system: o,
          messages: r,
          error: i
        });
      } catch (u) {
        throw new wI({
          cause: u,
          originalError: i
        });
      }
      if (a == null)
        throw i;
      return await Qv({ toolCall: a, tools: t });
    }
  } catch (i) {
    let a = await yt({ text: e.input }), u = a.success ? a.value : e.input;
    return {
      type: "tool-call",
      toolCallId: e.toolCallId,
      toolName: e.toolName,
      input: u,
      dynamic: !0,
      invalid: !0,
      error: i,
      providerMetadata: e.providerMetadata
    };
  }
}
l(bS, "parseToolCall");
async function Qv({
  toolCall: e,
  tools: t
}) {
  let n = e.toolName, o = t[n];
  if (o == null)
    throw new Hp({
      toolName: e.toolName,
      availableTools: Object.keys(t)
    });
  let r = gr(o.inputSchema), i = e.input.trim() === "" ? await Le({ value: {}, schema: r }) : await yt({ text: e.input, schema: r });
  if (i.success === !1)
    throw new dy({
      toolName: n,
      toolInput: e.input,
      cause: i.error
    });
  return o.type === "dynamic" ? {
    type: "tool-call",
    toolCallId: e.toolCallId,
    toolName: e.toolName,
    input: i.value,
    providerExecuted: e.providerExecuted,
    providerMetadata: e.providerMetadata,
    dynamic: !0
  } : {
    type: "tool-call",
    toolCallId: e.toolCallId,
    toolName: n,
    input: i.value,
    providerExecuted: e.providerExecuted,
    providerMetadata: e.providerMetadata
  };
}
l(Qv, "doParseToolCall");
var xS = class {
  static {
    l(this, "DefaultStepResult");
  }
  constructor({
    content: e,
    finishReason: t,
    usage: n,
    warnings: o,
    request: r,
    response: i,
    providerMetadata: a
  }) {
    this.content = e, this.finishReason = t, this.usage = n, this.warnings = o, this.request = r, this.response = i, this.providerMetadata = a;
  }
  get text() {
    return this.content.filter((e) => e.type === "text").map((e) => e.text).join("");
  }
  get reasoning() {
    return this.content.filter((e) => e.type === "reasoning");
  }
  get reasoningText() {
    return this.reasoning.length === 0 ? void 0 : this.reasoning.map((e) => e.text).join("");
  }
  get files() {
    return this.content.filter((e) => e.type === "file").map((e) => e.file);
  }
  get sources() {
    return this.content.filter((e) => e.type === "source");
  }
  get toolCalls() {
    return this.content.filter((e) => e.type === "tool-call");
  }
  get staticToolCalls() {
    return this.toolCalls.filter(
      (e) => e.dynamic !== !0
    );
  }
  get dynamicToolCalls() {
    return this.toolCalls.filter(
      (e) => e.dynamic === !0
    );
  }
  get toolResults() {
    return this.content.filter((e) => e.type === "tool-result");
  }
  get staticToolResults() {
    return this.toolResults.filter(
      (e) => e.dynamic !== !0
    );
  }
  get dynamicToolResults() {
    return this.toolResults.filter(
      (e) => e.dynamic === !0
    );
  }
};
function $S(e) {
  return ({ steps: t }) => t.length === e;
}
l($S, "stepCountIs");
async function wS({
  stopConditions: e,
  steps: t
}) {
  return (await Promise.all(e.map((n) => n({ steps: t })))).some((n) => n);
}
l(wS, "isStopConditionMet");
function Kp({
  output: e,
  tool: t,
  errorMode: n
}) {
  return n === "text" ? { type: "error-text", value: Jt(e) } : n === "json" ? { type: "error-json", value: ey(e) } : t?.toModelOutput ? t.toModelOutput(e) : typeof e == "string" ? { type: "text", value: e } : { type: "json", value: ey(e) };
}
l(Kp, "createToolModelOutput");
function ey(e) {
  return e === void 0 ? null : e;
}
l(ey, "toJSONValue");
function kS({
  content: e,
  tools: t
}) {
  let n = [], o = e.filter((i) => i.type !== "source").filter(
    (i) => (i.type !== "tool-result" || i.providerExecuted) && (i.type !== "tool-error" || i.providerExecuted)
  ).filter((i) => i.type !== "text" || i.text.length > 0).map((i) => {
    switch (i.type) {
      case "text":
        return {
          type: "text",
          text: i.text,
          providerOptions: i.providerMetadata
        };
      case "reasoning":
        return {
          type: "reasoning",
          text: i.text,
          providerOptions: i.providerMetadata
        };
      case "file":
        return {
          type: "file",
          data: i.file.base64,
          mediaType: i.file.mediaType,
          providerOptions: i.providerMetadata
        };
      case "tool-call":
        return {
          type: "tool-call",
          toolCallId: i.toolCallId,
          toolName: i.toolName,
          input: i.input,
          providerExecuted: i.providerExecuted,
          providerOptions: i.providerMetadata
        };
      case "tool-result":
        return {
          type: "tool-result",
          toolCallId: i.toolCallId,
          toolName: i.toolName,
          output: Kp({
            tool: t?.[i.toolName],
            output: i.output,
            errorMode: "none"
          }),
          providerExecuted: !0,
          providerOptions: i.providerMetadata
        };
      case "tool-error":
        return {
          type: "tool-result",
          toolCallId: i.toolCallId,
          toolName: i.toolName,
          output: Kp({
            tool: t?.[i.toolName],
            output: i.error,
            errorMode: "json"
          }),
          providerOptions: i.providerMetadata
        };
    }
  });
  o.length > 0 && n.push({
    role: "assistant",
    content: o
  });
  let r = e.filter((i) => i.type === "tool-result" || i.type === "tool-error").filter((i) => !i.providerExecuted).map((i) => ({
    type: "tool-result",
    toolCallId: i.toolCallId,
    toolName: i.toolName,
    output: Kp({
      tool: t?.[i.toolName],
      output: i.type === "tool-result" ? i.output : i.error,
      errorMode: i.type === "tool-error" ? "text" : "none"
    }),
    ...i.providerMetadata != null ? { providerOptions: i.providerMetadata } : {}
  }));
  return r.length > 0 && n.push({
    role: "tool",
    content: r
  }), n;
}
l(kS, "toResponseMessages");
var IS = Ot({
  prefix: "aitxt",
  size: 24
});
async function UA({
  model: e,
  tools: t,
  toolChoice: n,
  system: o,
  prompt: r,
  messages: i,
  maxRetries: a,
  abortSignal: u,
  headers: c,
  stopWhen: d = $S(1),
  experimental_output: p,
  experimental_telemetry: m,
  providerOptions: v,
  experimental_activeTools: g,
  activeTools: b = g,
  experimental_prepareStep: x,
  prepareStep: $ = x,
  experimental_repairToolCall: E,
  experimental_download: O,
  experimental_context: y,
  _internal: {
    generateId: B = IS,
    currentDate: Y = /* @__PURE__ */ l(() => /* @__PURE__ */ new Date(), "currentDate")
  } = {},
  onStepFinish: fe,
  ...J
}) {
  let Z = Hv(e), ve = gS(d), { maxRetries: ce, retry: ke } = yS({
    maxRetries: a,
    abortSignal: u
  }), Ae = Xv(J), ye = ut(
    c ?? {},
    `ai/${Oy}`
  ), He = uS({
    model: Z,
    telemetry: m,
    headers: ye,
    settings: { ...Ae, maxRetries: ce }
  }), Ie = await sS({
    system: o,
    prompt: r,
    messages: i
  }), Re = pS(m);
  try {
    return await Yp({
      name: "ai.generateText",
      attributes: hn({
        telemetry: m,
        attributes: {
          ...Xp({
            operationId: "ai.generateText",
            telemetry: m
          }),
          ...He,
          // model:
          "ai.model.provider": Z.provider,
          "ai.model.id": Z.modelId,
          // specific settings that only make sense on the outer level:
          "ai.prompt": {
            input: /* @__PURE__ */ l(() => JSON.stringify({ system: o, prompt: r, messages: i }), "input")
          }
        }
      }),
      tracer: Re,
      fn: /* @__PURE__ */ l(async (Q) => {
        var Ce, ge, rt, re, ae, _e, xe;
        let X = Xv(J), f, D = [], U = [], Nt = [], dt = [];
        do {
          let At = [
            ...Ie.messages,
            ...Nt
          ], pt = await $?.({
            model: Z,
            steps: dt,
            stepNumber: dt.length,
            messages: At
          }), rr = Hv(
            (Ce = pt?.model) != null ? Ce : Z
          ), rm = await BI({
            prompt: {
              system: (ge = pt?.system) != null ? ge : Ie.system,
              messages: (rt = pt?.messages) != null ? rt : At
            },
            supportedUrls: await rr.supportedUrls,
            download: O
          }), { toolChoice: ka, tools: Ia } = XI({
            tools: t,
            toolChoice: (re = pt?.toolChoice) != null ? re : n,
            activeTools: (ae = pt?.activeTools) != null ? ae : b
          });
          f = await ke(
            () => {
              var ue;
              return Yp({
                name: "ai.generateText.doGenerate",
                attributes: hn({
                  telemetry: m,
                  attributes: {
                    ...Xp({
                      operationId: "ai.generateText.doGenerate",
                      telemetry: m
                    }),
                    ...He,
                    // model:
                    "ai.model.provider": rr.provider,
                    "ai.model.id": rr.modelId,
                    // prompt:
                    "ai.prompt.messages": {
                      input: /* @__PURE__ */ l(() => mS(rm), "input")
                    },
                    "ai.prompt.tools": {
                      // convert the language model level tools:
                      input: /* @__PURE__ */ l(() => Ia?.map((nr) => JSON.stringify(nr)), "input")
                    },
                    "ai.prompt.toolChoice": {
                      input: /* @__PURE__ */ l(() => ka != null ? JSON.stringify(ka) : void 0, "input")
                    },
                    // standardized gen-ai llm span attributes:
                    "gen_ai.system": rr.provider,
                    "gen_ai.request.model": rr.modelId,
                    "gen_ai.request.frequency_penalty": J.frequencyPenalty,
                    "gen_ai.request.max_tokens": J.maxOutputTokens,
                    "gen_ai.request.presence_penalty": J.presencePenalty,
                    "gen_ai.request.stop_sequences": J.stopSequences,
                    "gen_ai.request.temperature": (ue = J.temperature) != null ? ue : void 0,
                    "gen_ai.request.top_k": J.topK,
                    "gen_ai.request.top_p": J.topP
                  }
                }),
                tracer: Re,
                fn: /* @__PURE__ */ l(async (nr) => {
                  var im, am, sm, lm, um, cm, dm, pm;
                  let Se = await rr.doGenerate({
                    ...X,
                    tools: Ia,
                    toolChoice: ka,
                    responseFormat: p?.responseFormat,
                    prompt: rm,
                    providerOptions: v,
                    abortSignal: u,
                    headers: ye
                  }), hr = {
                    id: (am = (im = Se.response) == null ? void 0 : im.id) != null ? am : B(),
                    timestamp: (lm = (sm = Se.response) == null ? void 0 : sm.timestamp) != null ? lm : Y(),
                    modelId: (cm = (um = Se.response) == null ? void 0 : um.modelId) != null ? cm : rr.modelId,
                    headers: (dm = Se.response) == null ? void 0 : dm.headers,
                    body: (pm = Se.response) == null ? void 0 : pm.body
                  };
                  return nr.setAttributes(
                    hn({
                      telemetry: m,
                      attributes: {
                        "ai.response.finishReason": Se.finishReason,
                        "ai.response.text": {
                          output: /* @__PURE__ */ l(() => Yv(Se.content), "output")
                        },
                        "ai.response.toolCalls": {
                          output: /* @__PURE__ */ l(() => {
                            let mm = ty(Se.content);
                            return mm == null ? void 0 : JSON.stringify(mm);
                          }, "output")
                        },
                        "ai.response.id": hr.id,
                        "ai.response.model": hr.modelId,
                        "ai.response.timestamp": hr.timestamp.toISOString(),
                        "ai.response.providerMetadata": JSON.stringify(
                          Se.providerMetadata
                        ),
                        // TODO rename telemetry attributes to inputTokens and outputTokens
                        "ai.usage.promptTokens": Se.usage.inputTokens,
                        "ai.usage.completionTokens": Se.usage.outputTokens,
                        // standardized gen-ai llm span attributes:
                        "gen_ai.response.finish_reasons": [Se.finishReason],
                        "gen_ai.response.id": hr.id,
                        "gen_ai.response.model": hr.modelId,
                        "gen_ai.usage.input_tokens": Se.usage.inputTokens,
                        "gen_ai.usage.output_tokens": Se.usage.outputTokens
                      }
                    })
                  ), { ...Se, response: hr };
                }, "fn")
              });
            }
          );
          let xo = await Promise.all(
            f.content.filter(
              (ue) => ue.type === "tool-call"
            ).map(
              (ue) => bS({
                toolCall: ue,
                tools: t,
                repairToolCall: E,
                system: o,
                messages: At
              })
            )
          );
          for (let ue of xo) {
            if (ue.invalid)
              continue;
            let nr = t[ue.toolName];
            nr?.onInputAvailable != null && await nr.onInputAvailable({
              input: ue.input,
              toolCallId: ue.toolCallId,
              messages: At,
              abortSignal: u,
              experimental_context: y
            });
          }
          let Qy = xo.filter(
            (ue) => ue.invalid && ue.dynamic
          );
          U = [];
          for (let ue of Qy)
            U.push({
              type: "tool-error",
              toolCallId: ue.toolCallId,
              toolName: ue.toolName,
              input: ue.input,
              error: ma(ue.error),
              dynamic: !0
            });
          D = xo.filter(
            (ue) => !ue.providerExecuted
          ), t != null && U.push(
            ...await SS({
              toolCalls: D.filter(
                (ue) => !ue.invalid
              ),
              tools: t,
              tracer: Re,
              telemetry: m,
              messages: At,
              abortSignal: u,
              experimental_context: y
            })
          );
          let nm = zS({
            content: f.content,
            toolCalls: xo,
            toolOutputs: U
          });
          Nt.push(
            ...kS({
              content: nm,
              tools: t
            })
          );
          let om = new xS({
            content: nm,
            finishReason: f.finishReason,
            usage: f.usage,
            warnings: f.warnings,
            providerMetadata: f.providerMetadata,
            request: (_e = f.request) != null ? _e : {},
            response: {
              ...f.response,
              // deep clone msgs to avoid mutating past messages in multi-step:
              messages: structuredClone(Nt)
            }
          });
          iI((xe = f.warnings) != null ? xe : []), dt.push(om), await fe?.(om);
        } while (
          // there are tool calls:
          D.length > 0 && // all current tool calls have outputs (incl. execution errors):
          U.length === D.length && // continue until a stop condition is met:
          !await wS({ stopConditions: ve, steps: dt })
        );
        Q.setAttributes(
          hn({
            telemetry: m,
            attributes: {
              "ai.response.finishReason": f.finishReason,
              "ai.response.text": {
                output: /* @__PURE__ */ l(() => Yv(f.content), "output")
              },
              "ai.response.toolCalls": {
                output: /* @__PURE__ */ l(() => {
                  let At = ty(f.content);
                  return At == null ? void 0 : JSON.stringify(At);
                }, "output")
              },
              "ai.response.providerMetadata": JSON.stringify(
                f.providerMetadata
              ),
              // TODO rename telemetry attributes to inputTokens and outputTokens
              "ai.usage.promptTokens": f.usage.inputTokens,
              "ai.usage.completionTokens": f.usage.outputTokens
            }
          })
        );
        let vn = dt[dt.length - 1], tm;
        return vn.finishReason === "stop" && (tm = await p?.parseOutput(
          { text: vn.text },
          {
            response: vn.response,
            usage: vn.usage,
            finishReason: vn.finishReason
          }
        )), new TS({
          steps: dt,
          resolvedOutput: tm
        });
      }, "fn")
    });
  } catch (Q) {
    throw lS(Q);
  }
}
l(UA, "generateText");
async function SS({
  toolCalls: e,
  tools: t,
  tracer: n,
  telemetry: o,
  messages: r,
  abortSignal: i,
  experimental_context: a
}) {
  return (await Promise.all(
    e.map(async ({ toolCallId: c, toolName: d, input: p }) => {
      let m = t[d];
      if (m?.execute != null)
        return Yp({
          name: "ai.toolCall",
          attributes: hn({
            telemetry: o,
            attributes: {
              ...Xp({
                operationId: "ai.toolCall",
                telemetry: o
              }),
              "ai.toolCall.name": d,
              "ai.toolCall.id": c,
              "ai.toolCall.args": {
                output: /* @__PURE__ */ l(() => JSON.stringify(p), "output")
              }
            }
          }),
          tracer: n,
          fn: /* @__PURE__ */ l(async (v) => {
            try {
              let g = Zh({
                execute: m.execute.bind(m),
                input: p,
                options: {
                  toolCallId: c,
                  messages: r,
                  abortSignal: i,
                  experimental_context: a
                }
              }), b;
              for await (let x of g)
                x.type === "final" && (b = x.output);
              try {
                v.setAttributes(
                  hn({
                    telemetry: o,
                    attributes: {
                      "ai.toolCall.result": {
                        output: /* @__PURE__ */ l(() => JSON.stringify(b), "output")
                      }
                    }
                  })
                );
              } catch {
              }
              return {
                type: "tool-result",
                toolCallId: c,
                toolName: d,
                input: p,
                output: b,
                dynamic: m.type === "dynamic"
              };
            } catch (g) {
              return Cy(v, g), {
                type: "tool-error",
                toolCallId: c,
                toolName: d,
                input: p,
                error: g,
                dynamic: m.type === "dynamic"
              };
            }
          }, "fn")
        });
    })
  )).filter(
    (c) => c != null
  );
}
l(SS, "executeTools");
var TS = class {
  static {
    l(this, "DefaultGenerateTextResult");
  }
  constructor(e) {
    this.steps = e.steps, this.resolvedOutput = e.resolvedOutput;
  }
  get finalStep() {
    return this.steps[this.steps.length - 1];
  }
  get content() {
    return this.finalStep.content;
  }
  get text() {
    return this.finalStep.text;
  }
  get files() {
    return this.finalStep.files;
  }
  get reasoningText() {
    return this.finalStep.reasoningText;
  }
  get reasoning() {
    return this.finalStep.reasoning;
  }
  get toolCalls() {
    return this.finalStep.toolCalls;
  }
  get staticToolCalls() {
    return this.finalStep.staticToolCalls;
  }
  get dynamicToolCalls() {
    return this.finalStep.dynamicToolCalls;
  }
  get toolResults() {
    return this.finalStep.toolResults;
  }
  get staticToolResults() {
    return this.finalStep.staticToolResults;
  }
  get dynamicToolResults() {
    return this.finalStep.dynamicToolResults;
  }
  get sources() {
    return this.finalStep.sources;
  }
  get finishReason() {
    return this.finalStep.finishReason;
  }
  get warnings() {
    return this.finalStep.warnings;
  }
  get providerMetadata() {
    return this.finalStep.providerMetadata;
  }
  get response() {
    return this.finalStep.response;
  }
  get request() {
    return this.finalStep.request;
  }
  get usage() {
    return this.finalStep.usage;
  }
  get totalUsage() {
    return this.steps.reduce(
      (e, t) => fS(e, t.usage),
      {
        inputTokens: void 0,
        outputTokens: void 0,
        totalTokens: void 0,
        reasoningTokens: void 0,
        cachedInputTokens: void 0
      }
    );
  }
  get experimental_output() {
    if (this.resolvedOutput == null)
      throw new rI();
    return this.resolvedOutput;
  }
};
function ty(e) {
  let t = e.filter(
    (n) => n.type === "tool-call"
  );
  if (t.length !== 0)
    return t.map((n) => ({
      toolCallId: n.toolCallId,
      toolName: n.toolName,
      input: n.input
    }));
}
l(ty, "asToolCalls");
function zS({
  content: e,
  toolCalls: t,
  toolOutputs: n
}) {
  return [
    ...e.map((o) => {
      switch (o.type) {
        case "text":
        case "reasoning":
        case "source":
          return o;
        case "file":
          return {
            type: "file",
            file: new _S(o)
          };
        case "tool-call":
          return t.find(
            (r) => r.toolCallId === o.toolCallId
          );
        case "tool-result": {
          let r = t.find(
            (i) => i.toolCallId === o.toolCallId
          );
          if (r == null)
            throw new Error(`Tool call ${o.toolCallId} not found.`);
          return o.isError ? {
            type: "tool-error",
            toolCallId: o.toolCallId,
            toolName: o.toolName,
            input: r.input,
            error: o.result,
            providerExecuted: !0,
            dynamic: r.dynamic
          } : {
            type: "tool-result",
            toolCallId: o.toolCallId,
            toolName: o.toolName,
            input: r.input,
            output: o.result,
            providerExecuted: !0,
            dynamic: r.dynamic
          };
        }
      }
    }),
    ...n
  ];
}
l(zS, "asContent");
var ZA = class extends TransformStream {
  static {
    l(this, "JsonToSseTransformStream");
  }
  constructor() {
    super({
      transform(e, t) {
        t.enqueue(`data: ${JSON.stringify(e)}

`);
      },
      flush(e) {
        e.enqueue(`data: [DONE]

`);
      }
    });
  }
};
var VA = q(
  () => A(
    s.union([
      s.strictObject({
        type: s.literal("text-start"),
        id: s.string(),
        providerMetadata: H.optional()
      }),
      s.strictObject({
        type: s.literal("text-delta"),
        id: s.string(),
        delta: s.string(),
        providerMetadata: H.optional()
      }),
      s.strictObject({
        type: s.literal("text-end"),
        id: s.string(),
        providerMetadata: H.optional()
      }),
      s.strictObject({
        type: s.literal("error"),
        errorText: s.string()
      }),
      s.strictObject({
        type: s.literal("tool-input-start"),
        toolCallId: s.string(),
        toolName: s.string(),
        providerExecuted: s.boolean().optional(),
        dynamic: s.boolean().optional()
      }),
      s.strictObject({
        type: s.literal("tool-input-delta"),
        toolCallId: s.string(),
        inputTextDelta: s.string()
      }),
      s.strictObject({
        type: s.literal("tool-input-available"),
        toolCallId: s.string(),
        toolName: s.string(),
        input: s.unknown(),
        providerExecuted: s.boolean().optional(),
        providerMetadata: H.optional(),
        dynamic: s.boolean().optional()
      }),
      s.strictObject({
        type: s.literal("tool-input-error"),
        toolCallId: s.string(),
        toolName: s.string(),
        input: s.unknown(),
        providerExecuted: s.boolean().optional(),
        providerMetadata: H.optional(),
        dynamic: s.boolean().optional(),
        errorText: s.string()
      }),
      s.strictObject({
        type: s.literal("tool-output-available"),
        toolCallId: s.string(),
        output: s.unknown(),
        providerExecuted: s.boolean().optional(),
        dynamic: s.boolean().optional(),
        preliminary: s.boolean().optional()
      }),
      s.strictObject({
        type: s.literal("tool-output-error"),
        toolCallId: s.string(),
        errorText: s.string(),
        providerExecuted: s.boolean().optional(),
        dynamic: s.boolean().optional()
      }),
      s.strictObject({
        type: s.literal("reasoning-start"),
        id: s.string(),
        providerMetadata: H.optional()
      }),
      s.strictObject({
        type: s.literal("reasoning-delta"),
        id: s.string(),
        delta: s.string(),
        providerMetadata: H.optional()
      }),
      s.strictObject({
        type: s.literal("reasoning-end"),
        id: s.string(),
        providerMetadata: H.optional()
      }),
      s.strictObject({
        type: s.literal("source-url"),
        sourceId: s.string(),
        url: s.string(),
        title: s.string().optional(),
        providerMetadata: H.optional()
      }),
      s.strictObject({
        type: s.literal("source-document"),
        sourceId: s.string(),
        mediaType: s.string(),
        title: s.string(),
        filename: s.string().optional(),
        providerMetadata: H.optional()
      }),
      s.strictObject({
        type: s.literal("file"),
        url: s.string(),
        mediaType: s.string(),
        providerMetadata: H.optional()
      }),
      s.strictObject({
        type: s.custom(
          (e) => typeof e == "string" && e.startsWith("data-"),
          { message: 'Type must start with "data-"' }
        ),
        id: s.string().optional(),
        data: s.unknown(),
        transient: s.boolean().optional()
      }),
      s.strictObject({
        type: s.literal("start-step")
      }),
      s.strictObject({
        type: s.literal("finish-step")
      }),
      s.strictObject({
        type: s.literal("start"),
        messageId: s.string().optional(),
        messageMetadata: s.unknown().optional()
      }),
      s.strictObject({
        type: s.literal("finish"),
        finishReason: s.enum([
          "stop",
          "length",
          "content-filter",
          "tool-calls",
          "error",
          "other",
          "unknown"
        ]).optional(),
        messageMetadata: s.unknown().optional()
      }),
      s.strictObject({
        type: s.literal("abort")
      }),
      s.strictObject({
        type: s.literal("message-metadata"),
        messageMetadata: s.unknown()
      })
    ])
  )
);
function ES(e) {
  let t = ["ROOT"], n = -1, o = null;
  function r(c, d, p) {
    switch (c) {
      case '"': {
        n = d, t.pop(), t.push(p), t.push("INSIDE_STRING");
        break;
      }
      case "f":
      case "t":
      case "n": {
        n = d, o = d, t.pop(), t.push(p), t.push("INSIDE_LITERAL");
        break;
      }
      case "-": {
        t.pop(), t.push(p), t.push("INSIDE_NUMBER");
        break;
      }
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9": {
        n = d, t.pop(), t.push(p), t.push("INSIDE_NUMBER");
        break;
      }
      case "{": {
        n = d, t.pop(), t.push(p), t.push("INSIDE_OBJECT_START");
        break;
      }
      case "[": {
        n = d, t.pop(), t.push(p), t.push("INSIDE_ARRAY_START");
        break;
      }
    }
  }
  l(r, "processValueStart");
  function i(c, d) {
    switch (c) {
      case ",": {
        t.pop(), t.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      }
      case "}": {
        n = d, t.pop();
        break;
      }
    }
  }
  l(i, "processAfterObjectValue");
  function a(c, d) {
    switch (c) {
      case ",": {
        t.pop(), t.push("INSIDE_ARRAY_AFTER_COMMA");
        break;
      }
      case "]": {
        n = d, t.pop();
        break;
      }
    }
  }
  l(a, "processAfterArrayValue");
  for (let c = 0; c < e.length; c++) {
    let d = e[c];
    switch (t[t.length - 1]) {
      case "ROOT":
        r(d, c, "FINISH");
        break;
      case "INSIDE_OBJECT_START": {
        switch (d) {
          case '"': {
            t.pop(), t.push("INSIDE_OBJECT_KEY");
            break;
          }
          case "}": {
            n = c, t.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_COMMA": {
        switch (d) {
          case '"': {
            t.pop(), t.push("INSIDE_OBJECT_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_KEY": {
        switch (d) {
          case '"': {
            t.pop(), t.push("INSIDE_OBJECT_AFTER_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_KEY": {
        switch (d) {
          case ":": {
            t.pop(), t.push("INSIDE_OBJECT_BEFORE_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_BEFORE_VALUE": {
        r(d, c, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      }
      case "INSIDE_OBJECT_AFTER_VALUE": {
        i(d, c);
        break;
      }
      case "INSIDE_STRING": {
        switch (d) {
          case '"': {
            t.pop(), n = c;
            break;
          }
          case "\\": {
            t.push("INSIDE_STRING_ESCAPE");
            break;
          }
          default:
            n = c;
        }
        break;
      }
      case "INSIDE_ARRAY_START": {
        switch (d) {
          case "]": {
            n = c, t.pop();
            break;
          }
          default: {
            n = c, r(d, c, "INSIDE_ARRAY_AFTER_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_VALUE": {
        switch (d) {
          case ",": {
            t.pop(), t.push("INSIDE_ARRAY_AFTER_COMMA");
            break;
          }
          case "]": {
            n = c, t.pop();
            break;
          }
          default: {
            n = c;
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_COMMA": {
        r(d, c, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      }
      case "INSIDE_STRING_ESCAPE": {
        t.pop(), n = c;
        break;
      }
      case "INSIDE_NUMBER": {
        switch (d) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9": {
            n = c;
            break;
          }
          case "e":
          case "E":
          case "-":
          case ".":
            break;
          case ",": {
            t.pop(), t[t.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && a(d, c), t[t.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && i(d, c);
            break;
          }
          case "}": {
            t.pop(), t[t.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && i(d, c);
            break;
          }
          case "]": {
            t.pop(), t[t.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && a(d, c);
            break;
          }
          default: {
            t.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_LITERAL": {
        let m = e.substring(o, c + 1);
        !"false".startsWith(m) && !"true".startsWith(m) && !"null".startsWith(m) ? (t.pop(), t[t.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" ? i(d, c) : t[t.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && a(d, c)) : n = c;
        break;
      }
    }
  }
  let u = e.slice(0, n + 1);
  for (let c = t.length - 1; c >= 0; c--)
    switch (t[c]) {
      case "INSIDE_STRING": {
        u += '"';
        break;
      }
      case "INSIDE_OBJECT_KEY":
      case "INSIDE_OBJECT_AFTER_KEY":
      case "INSIDE_OBJECT_AFTER_COMMA":
      case "INSIDE_OBJECT_START":
      case "INSIDE_OBJECT_BEFORE_VALUE":
      case "INSIDE_OBJECT_AFTER_VALUE": {
        u += "}";
        break;
      }
      case "INSIDE_ARRAY_START":
      case "INSIDE_ARRAY_AFTER_COMMA":
      case "INSIDE_ARRAY_AFTER_VALUE": {
        u += "]";
        break;
      }
      case "INSIDE_LITERAL": {
        let p = e.substring(o, e.length);
        "true".startsWith(p) ? u += "true".slice(p.length) : "false".startsWith(p) ? u += "false".slice(p.length) : "null".startsWith(p) && (u += "null".slice(p.length));
      }
    }
  return u;
}
l(ES, "fixJson");
async function OS(e) {
  if (e === void 0)
    return { value: void 0, state: "undefined-input" };
  let t = await yt({ text: e });
  return t.success ? { value: t.value, state: "successful-parse" } : (t = await yt({ text: ES(e) }), t.success ? { value: t.value, state: "repaired-parse" } : { value: void 0, state: "failed-parse" });
}
l(OS, "parsePartialJson");
var JA = Ot({
  prefix: "aitxt",
  size: 24
});
var GA = Ot({ prefix: "aiobj", size: 24 });
var KA = Ot({ prefix: "aiobj", size: 24 });
var jS = {};
eI(jS, {
  object: /* @__PURE__ */ l(() => NS, "object"),
  text: /* @__PURE__ */ l(() => PS, "text")
});
var PS = /* @__PURE__ */ l(() => ({
  type: "text",
  responseFormat: { type: "text" },
  async parsePartial({ text: e }) {
    return { partial: e };
  },
  async parseOutput({ text: e }) {
    return e;
  }
}), "text"), NS = /* @__PURE__ */ l(({
  schema: e
}) => {
  let t = gr(e);
  return {
    type: "object",
    responseFormat: {
      type: "json",
      schema: t.jsonSchema
    },
    async parsePartial({ text: n }) {
      let o = await OS(n);
      switch (o.state) {
        case "failed-parse":
        case "undefined-input":
          return;
        case "repaired-parse":
        case "successful-parse":
          return {
            // Note: currently no validation of partial results:
            partial: o.value
          };
        default: {
          let r = o.state;
          throw new Error(`Unsupported parse state: ${r}`);
        }
      }
    },
    async parseOutput({ text: n }, o) {
      let r = await yt({ text: n });
      if (!r.success)
        throw new Wv({
          message: "No object generated: could not parse the response.",
          cause: r.error,
          text: n,
          response: o.response,
          usage: o.usage,
          finishReason: o.finishReason
        });
      let i = await Le({
        value: r.value,
        schema: t
      });
      if (!i.success)
        throw new Wv({
          message: "No object generated: response did not match schema.",
          cause: i.error,
          text: n,
          response: o.response,
          usage: o.usage,
          finishReason: o.finishReason
        });
      return i.value;
    }
  };
}, "object");
var AS = "AI_NoSuchProviderError", RS = `vercel.ai.error.${AS}`, CS = Symbol.for(RS), DS;
DS = CS;
var QA = q(
  () => A(
    s.array(
      s.object({
        id: s.string(),
        role: s.enum(["system", "user", "assistant"]),
        metadata: s.unknown().optional(),
        parts: s.array(
          s.union([
            s.object({
              type: s.literal("text"),
              text: s.string(),
              state: s.enum(["streaming", "done"]).optional(),
              providerMetadata: H.optional()
            }),
            s.object({
              type: s.literal("reasoning"),
              text: s.string(),
              state: s.enum(["streaming", "done"]).optional(),
              providerMetadata: H.optional()
            }),
            s.object({
              type: s.literal("source-url"),
              sourceId: s.string(),
              url: s.string(),
              title: s.string().optional(),
              providerMetadata: H.optional()
            }),
            s.object({
              type: s.literal("source-document"),
              sourceId: s.string(),
              mediaType: s.string(),
              title: s.string(),
              filename: s.string().optional(),
              providerMetadata: H.optional()
            }),
            s.object({
              type: s.literal("file"),
              mediaType: s.string(),
              filename: s.string().optional(),
              url: s.string(),
              providerMetadata: H.optional()
            }),
            s.object({
              type: s.literal("step-start")
            }),
            s.object({
              type: s.string().startsWith("data-"),
              id: s.string().optional(),
              data: s.unknown()
            }),
            s.object({
              type: s.literal("dynamic-tool"),
              toolName: s.string(),
              toolCallId: s.string(),
              state: s.literal("input-streaming"),
              input: s.unknown().optional(),
              providerExecuted: s.boolean().optional(),
              output: s.never().optional(),
              errorText: s.never().optional()
            }),
            s.object({
              type: s.literal("dynamic-tool"),
              toolName: s.string(),
              toolCallId: s.string(),
              state: s.literal("input-available"),
              input: s.unknown(),
              providerExecuted: s.boolean().optional(),
              output: s.never().optional(),
              errorText: s.never().optional(),
              callProviderMetadata: H.optional()
            }),
            s.object({
              type: s.literal("dynamic-tool"),
              toolName: s.string(),
              toolCallId: s.string(),
              state: s.literal("output-available"),
              input: s.unknown(),
              providerExecuted: s.boolean().optional(),
              output: s.unknown(),
              errorText: s.never().optional(),
              callProviderMetadata: H.optional(),
              preliminary: s.boolean().optional()
            }),
            s.object({
              type: s.literal("dynamic-tool"),
              toolName: s.string(),
              toolCallId: s.string(),
              state: s.literal("output-error"),
              input: s.unknown(),
              providerExecuted: s.boolean().optional(),
              output: s.never().optional(),
              errorText: s.string(),
              callProviderMetadata: H.optional()
            }),
            s.object({
              type: s.string().startsWith("tool-"),
              toolCallId: s.string(),
              state: s.literal("input-streaming"),
              providerExecuted: s.boolean().optional(),
              input: s.unknown().optional(),
              output: s.never().optional(),
              errorText: s.never().optional(),
              approval: s.never().optional()
            }),
            s.object({
              type: s.string().startsWith("tool-"),
              toolCallId: s.string(),
              state: s.literal("input-available"),
              providerExecuted: s.boolean().optional(),
              input: s.unknown(),
              output: s.never().optional(),
              errorText: s.never().optional(),
              callProviderMetadata: H.optional(),
              approval: s.never().optional()
            }),
            s.object({
              type: s.string().startsWith("tool-"),
              toolCallId: s.string(),
              state: s.literal("approval-requested"),
              input: s.unknown(),
              providerExecuted: s.boolean().optional(),
              output: s.never().optional(),
              errorText: s.never().optional(),
              callProviderMetadata: H.optional(),
              approval: s.object({
                id: s.string(),
                approved: s.never().optional(),
                reason: s.never().optional()
              })
            }),
            s.object({
              type: s.string().startsWith("tool-"),
              toolCallId: s.string(),
              state: s.literal("approval-responded"),
              input: s.unknown(),
              providerExecuted: s.boolean().optional(),
              output: s.never().optional(),
              errorText: s.never().optional(),
              callProviderMetadata: H.optional(),
              approval: s.object({
                id: s.string(),
                approved: s.boolean(),
                reason: s.string().optional()
              })
            }),
            s.object({
              type: s.string().startsWith("tool-"),
              toolCallId: s.string(),
              state: s.literal("output-available"),
              providerExecuted: s.boolean().optional(),
              input: s.unknown(),
              output: s.unknown(),
              errorText: s.never().optional(),
              callProviderMetadata: H.optional(),
              preliminary: s.boolean().optional(),
              approval: s.object({
                id: s.string(),
                approved: s.literal(!0),
                reason: s.string().optional()
              }).optional()
            }),
            s.object({
              type: s.string().startsWith("tool-"),
              toolCallId: s.string(),
              state: s.literal("output-error"),
              providerExecuted: s.boolean().optional(),
              input: s.unknown(),
              output: s.never().optional(),
              errorText: s.string(),
              callProviderMetadata: H.optional(),
              approval: s.object({
                id: s.string(),
                approved: s.literal(!0),
                reason: s.string().optional()
              }).optional()
            }),
            s.object({
              type: s.string().startsWith("tool-"),
              toolCallId: s.string(),
              state: s.literal("output-denied"),
              providerExecuted: s.boolean().optional(),
              input: s.unknown(),
              output: s.never().optional(),
              errorText: s.never().optional(),
              callProviderMetadata: H.optional(),
              approval: s.object({
                id: s.string(),
                approved: s.literal(!1),
                reason: s.string().optional()
              })
            })
          ])
        ).nonempty("Message must contain at least one part")
      })
    ).nonempty("Messages array must not be empty")
  )
);

// node_modules/@ai-sdk/openai/dist/index.mjs
var em = s.object({
  error: s.object({
    message: s.string(),
    // The additional information below is handled loosely to support
    // OpenAI-compatible providers that have slightly different error
    // responses:
    type: s.string().nullish(),
    param: s.any().nullish(),
    code: s.union([s.string(), s.number()]).nullish()
  })
}), bt = tt({
  errorSchema: em,
  errorToMessage: /* @__PURE__ */ l((e) => e.error.message, "errorToMessage")
});
function Gy(e) {
  let t = e.startsWith("o3") || e.startsWith("o4-mini") || e.startsWith("gpt-5") && !e.startsWith("gpt-5-chat"), n = e.startsWith("gpt-4") || e.startsWith("gpt-5-mini") || e.startsWith("gpt-5") && !e.startsWith("gpt-5-nano") && !e.startsWith("gpt-5-chat") || e.startsWith("o3") || e.startsWith("o4-mini"), o = !(e.startsWith("gpt-3") || e.startsWith("gpt-4") || e.startsWith("chatgpt-4o") || e.startsWith("gpt-5-chat")), r = e.startsWith("gpt-5.1") || e.startsWith("gpt-5.2");
  return {
    supportsFlexProcessing: t,
    supportsPriorityProcessing: n,
    isReasoningModel: o,
    systemMessageMode: o ? "developer" : "system",
    supportsNonReasoningParameters: r
  };
}
l(Gy, "getOpenAILanguageModelCapabilities");
function US({
  prompt: e,
  systemMessageMode: t = "system"
}) {
  let n = [], o = [];
  for (let { role: r, content: i } of e)
    switch (r) {
      case "system": {
        switch (t) {
          case "system": {
            n.push({ role: "system", content: i });
            break;
          }
          case "developer": {
            n.push({ role: "developer", content: i });
            break;
          }
          case "remove": {
            o.push({
              type: "other",
              message: "system messages are removed for this model"
            });
            break;
          }
          default: {
            let a = t;
            throw new Error(
              `Unsupported system message mode: ${a}`
            );
          }
        }
        break;
      }
      case "user": {
        if (i.length === 1 && i[0].type === "text") {
          n.push({ role: "user", content: i[0].text });
          break;
        }
        n.push({
          role: "user",
          content: i.map((a, u) => {
            var c, d, p;
            switch (a.type) {
              case "text":
                return { type: "text", text: a.text };
              case "file":
                if (a.mediaType.startsWith("image/")) {
                  let m = a.mediaType === "image/*" ? "image/jpeg" : a.mediaType;
                  return {
                    type: "image_url",
                    image_url: {
                      url: a.data instanceof URL ? a.data.toString() : `data:${m};base64,${Qt(a.data)}`,
                      // OpenAI specific extension: image detail
                      detail: (d = (c = a.providerOptions) == null ? void 0 : c.openai) == null ? void 0 : d.imageDetail
                    }
                  };
                } else if (a.mediaType.startsWith("audio/")) {
                  if (a.data instanceof URL)
                    throw new Ze({
                      functionality: "audio file parts with URLs"
                    });
                  switch (a.mediaType) {
                    case "audio/wav":
                      return {
                        type: "input_audio",
                        input_audio: {
                          data: Qt(a.data),
                          format: "wav"
                        }
                      };
                    case "audio/mp3":
                    case "audio/mpeg":
                      return {
                        type: "input_audio",
                        input_audio: {
                          data: Qt(a.data),
                          format: "mp3"
                        }
                      };
                    default:
                      throw new Ze({
                        functionality: `audio content parts with media type ${a.mediaType}`
                      });
                  }
                } else if (a.mediaType === "application/pdf") {
                  if (a.data instanceof URL)
                    throw new Ze({
                      functionality: "PDF file parts with URLs"
                    });
                  return {
                    type: "file",
                    file: typeof a.data == "string" && a.data.startsWith("file-") ? { file_id: a.data } : {
                      filename: (p = a.filename) != null ? p : `part-${u}.pdf`,
                      file_data: `data:application/pdf;base64,${Qt(a.data)}`
                    }
                  };
                } else
                  throw new Ze({
                    functionality: `file part media type ${a.mediaType}`
                  });
            }
          })
        });
        break;
      }
      case "assistant": {
        let a = "", u = [];
        for (let c of i)
          switch (c.type) {
            case "text": {
              a += c.text;
              break;
            }
            case "tool-call": {
              u.push({
                id: c.toolCallId,
                type: "function",
                function: {
                  name: c.toolName,
                  arguments: JSON.stringify(c.input)
                }
              });
              break;
            }
          }
        n.push({
          role: "assistant",
          content: a,
          tool_calls: u.length > 0 ? u : void 0
        });
        break;
      }
      case "tool": {
        for (let a of i) {
          let u = a.output, c;
          switch (u.type) {
            case "text":
            case "error-text":
              c = u.value;
              break;
            case "content":
            case "json":
            case "error-json":
              c = JSON.stringify(u.value);
              break;
          }
          n.push({
            role: "tool",
            tool_call_id: a.toolCallId,
            content: c
          });
        }
        break;
      }
      default: {
        let a = r;
        throw new Error(`Unsupported role: ${a}`);
      }
    }
  return { messages: n, warnings: o };
}
l(US, "convertToOpenAIChatMessages");
function Qp({
  id: e,
  model: t,
  created: n
}) {
  return {
    id: e ?? void 0,
    modelId: t ?? void 0,
    timestamp: n ? new Date(n * 1e3) : void 0
  };
}
l(Qp, "getResponseMetadata");
function Uy(e) {
  switch (e) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
l(Uy, "mapOpenAIFinishReason");
var MS = q(
  () => A(
    s.object({
      id: s.string().nullish(),
      created: s.number().nullish(),
      model: s.string().nullish(),
      choices: s.array(
        s.object({
          message: s.object({
            role: s.literal("assistant").nullish(),
            content: s.string().nullish(),
            tool_calls: s.array(
              s.object({
                id: s.string().nullish(),
                type: s.literal("function"),
                function: s.object({
                  name: s.string(),
                  arguments: s.string()
                })
              })
            ).nullish(),
            annotations: s.array(
              s.object({
                type: s.literal("url_citation"),
                url_citation: s.object({
                  start_index: s.number(),
                  end_index: s.number(),
                  url: s.string(),
                  title: s.string()
                })
              })
            ).nullish()
          }),
          index: s.number(),
          logprobs: s.object({
            content: s.array(
              s.object({
                token: s.string(),
                logprob: s.number(),
                top_logprobs: s.array(
                  s.object({
                    token: s.string(),
                    logprob: s.number()
                  })
                )
              })
            ).nullish()
          }).nullish(),
          finish_reason: s.string().nullish()
        })
      ),
      usage: s.object({
        prompt_tokens: s.number().nullish(),
        completion_tokens: s.number().nullish(),
        total_tokens: s.number().nullish(),
        prompt_tokens_details: s.object({
          cached_tokens: s.number().nullish()
        }).nullish(),
        completion_tokens_details: s.object({
          reasoning_tokens: s.number().nullish(),
          accepted_prediction_tokens: s.number().nullish(),
          rejected_prediction_tokens: s.number().nullish()
        }).nullish()
      }).nullish()
    })
  )
), ZS = q(
  () => A(
    s.union([
      s.object({
        id: s.string().nullish(),
        created: s.number().nullish(),
        model: s.string().nullish(),
        choices: s.array(
          s.object({
            delta: s.object({
              role: s.enum(["assistant"]).nullish(),
              content: s.string().nullish(),
              tool_calls: s.array(
                s.object({
                  index: s.number(),
                  id: s.string().nullish(),
                  type: s.literal("function").nullish(),
                  function: s.object({
                    name: s.string().nullish(),
                    arguments: s.string().nullish()
                  })
                })
              ).nullish(),
              annotations: s.array(
                s.object({
                  type: s.literal("url_citation"),
                  url_citation: s.object({
                    start_index: s.number(),
                    end_index: s.number(),
                    url: s.string(),
                    title: s.string()
                  })
                })
              ).nullish()
            }).nullish(),
            logprobs: s.object({
              content: s.array(
                s.object({
                  token: s.string(),
                  logprob: s.number(),
                  top_logprobs: s.array(
                    s.object({
                      token: s.string(),
                      logprob: s.number()
                    })
                  )
                })
              ).nullish()
            }).nullish(),
            finish_reason: s.string().nullish(),
            index: s.number()
          })
        ),
        usage: s.object({
          prompt_tokens: s.number().nullish(),
          completion_tokens: s.number().nullish(),
          total_tokens: s.number().nullish(),
          prompt_tokens_details: s.object({
            cached_tokens: s.number().nullish()
          }).nullish(),
          completion_tokens_details: s.object({
            reasoning_tokens: s.number().nullish(),
            accepted_prediction_tokens: s.number().nullish(),
            rejected_prediction_tokens: s.number().nullish()
          }).nullish()
        }).nullish()
      }),
      em
    ])
  )
), LS = q(
  () => A(
    s.object({
      /**
       * Modify the likelihood of specified tokens appearing in the completion.
       *
       * Accepts a JSON object that maps tokens (specified by their token ID in
       * the GPT tokenizer) to an associated bias value from -100 to 100.
       */
      logitBias: s.record(s.coerce.number(), s.number()).optional(),
      /**
       * Return the log probabilities of the tokens.
       *
       * Setting to true will return the log probabilities of the tokens that
       * were generated.
       *
       * Setting to a number will return the log probabilities of the top n
       * tokens that were generated.
       */
      logprobs: s.union([s.boolean(), s.number()]).optional(),
      /**
       * Whether to enable parallel function calling during tool use. Default to true.
       */
      parallelToolCalls: s.boolean().optional(),
      /**
       * A unique identifier representing your end-user, which can help OpenAI to
       * monitor and detect abuse.
       */
      user: s.string().optional(),
      /**
       * Reasoning effort for reasoning models. Defaults to `medium`.
       */
      reasoningEffort: s.enum(["none", "minimal", "low", "medium", "high", "xhigh"]).optional(),
      /**
       * Maximum number of completion tokens to generate. Useful for reasoning models.
       */
      maxCompletionTokens: s.number().optional(),
      /**
       * Whether to enable persistence in responses API.
       */
      store: s.boolean().optional(),
      /**
       * Metadata to associate with the request.
       */
      metadata: s.record(s.string().max(64), s.string().max(512)).optional(),
      /**
       * Parameters for prediction mode.
       */
      prediction: s.record(s.string(), s.any()).optional(),
      /**
       * Whether to use structured outputs.
       *
       * @default true
       */
      structuredOutputs: s.boolean().optional(),
      /**
       * Service tier for the request.
       * - 'auto': Default service tier. The request will be processed with the service tier configured in the
       *           Project settings. Unless otherwise configured, the Project will use 'default'.
       * - 'flex': 50% cheaper processing at the cost of increased latency. Only available for o3 and o4-mini models.
       * - 'priority': Higher-speed processing with predictably low latency at premium cost. Available for Enterprise customers.
       * - 'default': The request will be processed with the standard pricing and performance for the selected model.
       *
       * @default 'auto'
       */
      serviceTier: s.enum(["auto", "flex", "priority", "default"]).optional(),
      /**
       * Whether to use strict JSON schema validation.
       *
       * @default false
       */
      strictJsonSchema: s.boolean().optional(),
      /**
       * Controls the verbosity of the model's responses.
       * Lower values will result in more concise responses, while higher values will result in more verbose responses.
       */
      textVerbosity: s.enum(["low", "medium", "high"]).optional(),
      /**
       * A cache key for prompt caching. Allows manual control over prompt caching behavior.
       * Useful for improving cache hit rates and working around automatic caching issues.
       */
      promptCacheKey: s.string().optional(),
      /**
       * The retention policy for the prompt cache.
       * - 'in_memory': Default. Standard prompt caching behavior.
       * - '24h': Extended prompt caching that keeps cached prefixes active for up to 24 hours.
       *          Currently only available for 5.1 series models.
       *
       * @default 'in_memory'
       */
      promptCacheRetention: s.enum(["in_memory", "24h"]).optional(),
      /**
       * A stable identifier used to help detect users of your application
       * that may be violating OpenAI's usage policies. The IDs should be a
       * string that uniquely identifies each user. We recommend hashing their
       * username or email address, in order to avoid sending us any identifying
       * information.
       */
      safetyIdentifier: s.string().optional()
    })
  )
);
function FS({
  tools: e,
  toolChoice: t,
  structuredOutputs: n,
  strictJsonSchema: o
}) {
  e = e?.length ? e : void 0;
  let r = [];
  if (e == null)
    return { tools: void 0, toolChoice: void 0, toolWarnings: r };
  let i = [];
  for (let u of e)
    switch (u.type) {
      case "function":
        i.push({
          type: "function",
          function: {
            name: u.name,
            description: u.description,
            parameters: u.inputSchema,
            strict: n ? o : void 0
          }
        });
        break;
      default:
        r.push({ type: "unsupported-tool", tool: u });
        break;
    }
  if (t == null)
    return { tools: i, toolChoice: void 0, toolWarnings: r };
  let a = t.type;
  switch (a) {
    case "auto":
    case "none":
    case "required":
      return { tools: i, toolChoice: a, toolWarnings: r };
    case "tool":
      return {
        tools: i,
        toolChoice: {
          type: "function",
          function: {
            name: t.toolName
          }
        },
        toolWarnings: r
      };
    default: {
      let u = a;
      throw new Ze({
        functionality: `tool choice type: ${u}`
      });
    }
  }
}
l(FS, "prepareChatTools");
var VS = class {
  static {
    l(this, "OpenAIChatLanguageModel");
  }
  constructor(e, t) {
    this.specificationVersion = "v2", this.supportedUrls = {
      "image/*": [/^https?:\/\/.*$/]
    }, this.modelId = e, this.config = t;
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    prompt: e,
    maxOutputTokens: t,
    temperature: n,
    topP: o,
    topK: r,
    frequencyPenalty: i,
    presencePenalty: a,
    stopSequences: u,
    responseFormat: c,
    seed: d,
    tools: p,
    toolChoice: m,
    providerOptions: v
  }) {
    var g, b, x, $;
    let E = [], O = (g = await Pe({
      provider: "openai",
      providerOptions: v,
      schema: LS
    })) != null ? g : {}, y = (b = O.structuredOutputs) != null ? b : !0, B = Gy(this.modelId);
    r != null && E.push({
      type: "unsupported-setting",
      setting: "topK"
    }), c?.type === "json" && c.schema != null && !y && E.push({
      type: "unsupported-setting",
      setting: "responseFormat",
      details: "JSON response format schema is only supported with structuredOutputs"
    });
    let { messages: Y, warnings: fe } = US(
      {
        prompt: e,
        systemMessageMode: B.systemMessageMode
      }
    );
    E.push(...fe);
    let J = (x = O.strictJsonSchema) != null ? x : !1, Z = {
      // model id:
      model: this.modelId,
      // model specific settings:
      logit_bias: O.logitBias,
      logprobs: O.logprobs === !0 || typeof O.logprobs == "number" ? !0 : void 0,
      top_logprobs: typeof O.logprobs == "number" ? O.logprobs : typeof O.logprobs == "boolean" && O.logprobs ? 0 : void 0,
      user: O.user,
      parallel_tool_calls: O.parallelToolCalls,
      // standardized settings:
      max_tokens: t,
      temperature: n,
      top_p: o,
      frequency_penalty: i,
      presence_penalty: a,
      response_format: c?.type === "json" ? y && c.schema != null ? {
        type: "json_schema",
        json_schema: {
          schema: c.schema,
          strict: J,
          name: ($ = c.name) != null ? $ : "response",
          description: c.description
        }
      } : { type: "json_object" } : void 0,
      stop: u,
      seed: d,
      verbosity: O.textVerbosity,
      // openai specific settings:
      // TODO AI SDK 6: remove, we auto-map maxOutputTokens now
      max_completion_tokens: O.maxCompletionTokens,
      store: O.store,
      metadata: O.metadata,
      prediction: O.prediction,
      reasoning_effort: O.reasoningEffort,
      service_tier: O.serviceTier,
      prompt_cache_key: O.promptCacheKey,
      prompt_cache_retention: O.promptCacheRetention,
      safety_identifier: O.safetyIdentifier,
      // messages:
      messages: Y
    };
    B.isReasoningModel ? ((O.reasoningEffort !== "none" || !B.supportsNonReasoningParameters) && (Z.temperature != null && (Z.temperature = void 0, E.push({
      type: "unsupported-setting",
      setting: "temperature",
      details: "temperature is not supported for reasoning models"
    })), Z.top_p != null && (Z.top_p = void 0, E.push({
      type: "unsupported-setting",
      setting: "topP",
      details: "topP is not supported for reasoning models"
    })), Z.logprobs != null && (Z.logprobs = void 0, E.push({
      type: "other",
      message: "logprobs is not supported for reasoning models"
    }))), Z.frequency_penalty != null && (Z.frequency_penalty = void 0, E.push({
      type: "unsupported-setting",
      setting: "frequencyPenalty",
      details: "frequencyPenalty is not supported for reasoning models"
    })), Z.presence_penalty != null && (Z.presence_penalty = void 0, E.push({
      type: "unsupported-setting",
      setting: "presencePenalty",
      details: "presencePenalty is not supported for reasoning models"
    })), Z.logit_bias != null && (Z.logit_bias = void 0, E.push({
      type: "other",
      message: "logitBias is not supported for reasoning models"
    })), Z.top_logprobs != null && (Z.top_logprobs = void 0, E.push({
      type: "other",
      message: "topLogprobs is not supported for reasoning models"
    })), Z.max_tokens != null && (Z.max_completion_tokens == null && (Z.max_completion_tokens = Z.max_tokens), Z.max_tokens = void 0)) : (this.modelId.startsWith("gpt-4o-search-preview") || this.modelId.startsWith("gpt-4o-mini-search-preview")) && Z.temperature != null && (Z.temperature = void 0, E.push({
      type: "unsupported-setting",
      setting: "temperature",
      details: "temperature is not supported for the search preview models and has been removed."
    })), O.serviceTier === "flex" && !B.supportsFlexProcessing && (E.push({
      type: "unsupported-setting",
      setting: "serviceTier",
      details: "flex processing is only available for o3, o4-mini, and gpt-5 models"
    }), Z.service_tier = void 0), O.serviceTier === "priority" && !B.supportsPriorityProcessing && (E.push({
      type: "unsupported-setting",
      setting: "serviceTier",
      details: "priority processing is only available for supported models (gpt-4, gpt-5, gpt-5-mini, o3, o4-mini) and requires Enterprise access. gpt-5-nano is not supported"
    }), Z.service_tier = void 0);
    let {
      tools: ve,
      toolChoice: ce,
      toolWarnings: ke
    } = FS({
      tools: p,
      toolChoice: m,
      structuredOutputs: y,
      strictJsonSchema: J
    });
    return {
      args: {
        ...Z,
        tools: ve,
        tool_choice: ce
      },
      warnings: [...E, ...ke]
    };
  }
  async doGenerate(e) {
    var t, n, o, r, i, a, u, c, d, p, m, v, g, b;
    let { args: x, warnings: $ } = await this.getArgs(e), {
      responseHeaders: E,
      value: O,
      rawValue: y
    } = await pe({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: le(this.config.headers(), e.headers),
      body: x,
      failedResponseHandler: bt,
      successfulResponseHandler: he(
        MS
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    }), B = O.choices[0], Y = [], fe = B.message.content;
    fe != null && fe.length > 0 && Y.push({ type: "text", text: fe });
    for (let ce of (t = B.message.tool_calls) != null ? t : [])
      Y.push({
        type: "tool-call",
        toolCallId: (n = ce.id) != null ? n : We(),
        toolName: ce.function.name,
        input: ce.function.arguments
      });
    for (let ce of (o = B.message.annotations) != null ? o : [])
      Y.push({
        type: "source",
        sourceType: "url",
        id: We(),
        url: ce.url_citation.url,
        title: ce.url_citation.title
      });
    let J = (r = O.usage) == null ? void 0 : r.completion_tokens_details, Z = (i = O.usage) == null ? void 0 : i.prompt_tokens_details, ve = { openai: {} };
    return J?.accepted_prediction_tokens != null && (ve.openai.acceptedPredictionTokens = J?.accepted_prediction_tokens), J?.rejected_prediction_tokens != null && (ve.openai.rejectedPredictionTokens = J?.rejected_prediction_tokens), ((a = B.logprobs) == null ? void 0 : a.content) != null && (ve.openai.logprobs = B.logprobs.content), {
      content: Y,
      finishReason: Uy(B.finish_reason),
      usage: {
        inputTokens: (c = (u = O.usage) == null ? void 0 : u.prompt_tokens) != null ? c : void 0,
        outputTokens: (p = (d = O.usage) == null ? void 0 : d.completion_tokens) != null ? p : void 0,
        totalTokens: (v = (m = O.usage) == null ? void 0 : m.total_tokens) != null ? v : void 0,
        reasoningTokens: (g = J?.reasoning_tokens) != null ? g : void 0,
        cachedInputTokens: (b = Z?.cached_tokens) != null ? b : void 0
      },
      request: { body: x },
      response: {
        ...Qp(O),
        headers: E,
        body: y
      },
      warnings: $,
      providerMetadata: ve
    };
  }
  async doStream(e) {
    let { args: t, warnings: n } = await this.getArgs(e), o = {
      ...t,
      stream: !0,
      stream_options: {
        include_usage: !0
      }
    }, { responseHeaders: r, value: i } = await pe({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: le(this.config.headers(), e.headers),
      body: o,
      failedResponseHandler: bt,
      successfulResponseHandler: Xt(
        ZS
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    }), a = [], u = "unknown", c = {
      inputTokens: void 0,
      outputTokens: void 0,
      totalTokens: void 0
    }, d = !1, p = !1, m = { openai: {} };
    return {
      stream: i.pipeThrough(
        new TransformStream({
          start(v) {
            v.enqueue({ type: "stream-start", warnings: n });
          },
          transform(v, g) {
            var b, x, $, E, O, y, B, Y, fe, J, Z, ve, ce, ke, Ae, ye, He, Ie, Re, Q, Ce, ge, rt, re;
            if (e.includeRawChunks && g.enqueue({ type: "raw", rawValue: v.rawValue }), !v.success) {
              u = "error", g.enqueue({ type: "error", error: v.error });
              return;
            }
            let ae = v.value;
            if ("error" in ae) {
              u = "error", g.enqueue({ type: "error", error: ae.error });
              return;
            }
            if (!d) {
              let X = Qp(ae);
              Object.values(X).some(Boolean) && (d = !0, g.enqueue({
                type: "response-metadata",
                ...Qp(ae)
              }));
            }
            ae.usage != null && (c.inputTokens = (b = ae.usage.prompt_tokens) != null ? b : void 0, c.outputTokens = (x = ae.usage.completion_tokens) != null ? x : void 0, c.totalTokens = ($ = ae.usage.total_tokens) != null ? $ : void 0, c.reasoningTokens = (O = (E = ae.usage.completion_tokens_details) == null ? void 0 : E.reasoning_tokens) != null ? O : void 0, c.cachedInputTokens = (B = (y = ae.usage.prompt_tokens_details) == null ? void 0 : y.cached_tokens) != null ? B : void 0, ((Y = ae.usage.completion_tokens_details) == null ? void 0 : Y.accepted_prediction_tokens) != null && (m.openai.acceptedPredictionTokens = (fe = ae.usage.completion_tokens_details) == null ? void 0 : fe.accepted_prediction_tokens), ((J = ae.usage.completion_tokens_details) == null ? void 0 : J.rejected_prediction_tokens) != null && (m.openai.rejectedPredictionTokens = (Z = ae.usage.completion_tokens_details) == null ? void 0 : Z.rejected_prediction_tokens));
            let _e = ae.choices[0];
            if (_e?.finish_reason != null && (u = Uy(_e.finish_reason)), ((ve = _e?.logprobs) == null ? void 0 : ve.content) != null && (m.openai.logprobs = _e.logprobs.content), _e?.delta == null)
              return;
            let xe = _e.delta;
            if (xe.content != null && (p || (g.enqueue({ type: "text-start", id: "0" }), p = !0), g.enqueue({
              type: "text-delta",
              id: "0",
              delta: xe.content
            })), xe.tool_calls != null)
              for (let X of xe.tool_calls) {
                let f = X.index;
                if (a[f] == null) {
                  if (X.type !== "function")
                    throw new ia({
                      data: X,
                      message: "Expected 'function' type."
                    });
                  if (X.id == null)
                    throw new ia({
                      data: X,
                      message: "Expected 'id' to be a string."
                    });
                  if (((ce = X.function) == null ? void 0 : ce.name) == null)
                    throw new ia({
                      data: X,
                      message: "Expected 'function.name' to be a string."
                    });
                  g.enqueue({
                    type: "tool-input-start",
                    id: X.id,
                    toolName: X.function.name
                  }), a[f] = {
                    id: X.id,
                    type: "function",
                    function: {
                      name: X.function.name,
                      arguments: (ke = X.function.arguments) != null ? ke : ""
                    },
                    hasFinished: !1
                  };
                  let U = a[f];
                  ((Ae = U.function) == null ? void 0 : Ae.name) != null && ((ye = U.function) == null ? void 0 : ye.arguments) != null && (U.function.arguments.length > 0 && g.enqueue({
                    type: "tool-input-delta",
                    id: U.id,
                    delta: U.function.arguments
                  }), jp(U.function.arguments) && (g.enqueue({
                    type: "tool-input-end",
                    id: U.id
                  }), g.enqueue({
                    type: "tool-call",
                    toolCallId: (He = U.id) != null ? He : We(),
                    toolName: U.function.name,
                    input: U.function.arguments
                  }), U.hasFinished = !0));
                  continue;
                }
                let D = a[f];
                D.hasFinished || (((Ie = X.function) == null ? void 0 : Ie.arguments) != null && (D.function.arguments += (Q = (Re = X.function) == null ? void 0 : Re.arguments) != null ? Q : ""), g.enqueue({
                  type: "tool-input-delta",
                  id: D.id,
                  delta: (Ce = X.function.arguments) != null ? Ce : ""
                }), ((ge = D.function) == null ? void 0 : ge.name) != null && ((rt = D.function) == null ? void 0 : rt.arguments) != null && jp(D.function.arguments) && (g.enqueue({
                  type: "tool-input-end",
                  id: D.id
                }), g.enqueue({
                  type: "tool-call",
                  toolCallId: (re = D.id) != null ? re : We(),
                  toolName: D.function.name,
                  input: D.function.arguments
                }), D.hasFinished = !0));
              }
            if (xe.annotations != null)
              for (let X of xe.annotations)
                g.enqueue({
                  type: "source",
                  sourceType: "url",
                  id: We(),
                  url: X.url_citation.url,
                  title: X.url_citation.title
                });
          },
          flush(v) {
            p && v.enqueue({ type: "text-end", id: "0" }), v.enqueue({
              type: "finish",
              finishReason: u,
              usage: c,
              ...m != null ? { providerMetadata: m } : {}
            });
          }
        })
      ),
      request: { body: o },
      response: { headers: r }
    };
  }
};
function qS({
  prompt: e,
  user: t = "user",
  assistant: n = "assistant"
}) {
  let o = "";
  e[0].role === "system" && (o += `${e[0].content}

`, e = e.slice(1));
  for (let { role: r, content: i } of e)
    switch (r) {
      case "system":
        throw new It({
          message: "Unexpected system message in prompt: ${content}",
          prompt: e
        });
      case "user": {
        let a = i.map((u) => {
          switch (u.type) {
            case "text":
              return u.text;
          }
        }).filter(Boolean).join("");
        o += `${t}:
${a}

`;
        break;
      }
      case "assistant": {
        let a = i.map((u) => {
          switch (u.type) {
            case "text":
              return u.text;
            case "tool-call":
              throw new Ze({
                functionality: "tool-call messages"
              });
          }
        }).join("");
        o += `${n}:
${a}

`;
        break;
      }
      case "tool":
        throw new Ze({
          functionality: "tool messages"
        });
      default: {
        let a = r;
        throw new Error(`Unsupported role: ${a}`);
      }
    }
  return o += `${n}:
`, {
    prompt: o,
    stopSequences: [`
${t}:`]
  };
}
l(qS, "convertToOpenAICompletionPrompt");
function My({
  id: e,
  model: t,
  created: n
}) {
  return {
    id: e ?? void 0,
    modelId: t ?? void 0,
    timestamp: n != null ? new Date(n * 1e3) : void 0
  };
}
l(My, "getResponseMetadata2");
function Zy(e) {
  switch (e) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
l(Zy, "mapOpenAIFinishReason2");
var JS = q(
  () => A(
    s.object({
      id: s.string().nullish(),
      created: s.number().nullish(),
      model: s.string().nullish(),
      choices: s.array(
        s.object({
          text: s.string(),
          finish_reason: s.string(),
          logprobs: s.object({
            tokens: s.array(s.string()),
            token_logprobs: s.array(s.number()),
            top_logprobs: s.array(s.record(s.string(), s.number())).nullish()
          }).nullish()
        })
      ),
      usage: s.object({
        prompt_tokens: s.number(),
        completion_tokens: s.number(),
        total_tokens: s.number()
      }).nullish()
    })
  )
), BS = q(
  () => A(
    s.union([
      s.object({
        id: s.string().nullish(),
        created: s.number().nullish(),
        model: s.string().nullish(),
        choices: s.array(
          s.object({
            text: s.string(),
            finish_reason: s.string().nullish(),
            index: s.number(),
            logprobs: s.object({
              tokens: s.array(s.string()),
              token_logprobs: s.array(s.number()),
              top_logprobs: s.array(s.record(s.string(), s.number())).nullish()
            }).nullish()
          })
        ),
        usage: s.object({
          prompt_tokens: s.number(),
          completion_tokens: s.number(),
          total_tokens: s.number()
        }).nullish()
      }),
      em
    ])
  )
), Ly = q(
  () => A(
    s.object({
      /**
      Echo back the prompt in addition to the completion.
         */
      echo: s.boolean().optional(),
      /**
      Modify the likelihood of specified tokens appearing in the completion.
      
      Accepts a JSON object that maps tokens (specified by their token ID in
      the GPT tokenizer) to an associated bias value from -100 to 100. You
      can use this tokenizer tool to convert text to token IDs. Mathematically,
      the bias is added to the logits generated by the model prior to sampling.
      The exact effect will vary per model, but values between -1 and 1 should
      decrease or increase likelihood of selection; values like -100 or 100
      should result in a ban or exclusive selection of the relevant token.
      
      As an example, you can pass {"50256": -100} to prevent the <|endoftext|>
      token from being generated.
       */
      logitBias: s.record(s.string(), s.number()).optional(),
      /**
      The suffix that comes after a completion of inserted text.
       */
      suffix: s.string().optional(),
      /**
      A unique identifier representing your end-user, which can help OpenAI to
      monitor and detect abuse. Learn more.
       */
      user: s.string().optional(),
      /**
      Return the log probabilities of the tokens. Including logprobs will increase
      the response size and can slow down response times. However, it can
      be useful to better understand how the model is behaving.
      Setting to true will return the log probabilities of the tokens that
      were generated.
      Setting to a number will return the log probabilities of the top n
      tokens that were generated.
         */
      logprobs: s.union([s.boolean(), s.number()]).optional()
    })
  )
), GS = class {
  static {
    l(this, "OpenAICompletionLanguageModel");
  }
  constructor(e, t) {
    this.specificationVersion = "v2", this.supportedUrls = {
      // No URLs are supported for completion models.
    }, this.modelId = e, this.config = t;
  }
  get providerOptionsName() {
    return this.config.provider.split(".")[0].trim();
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    prompt: e,
    maxOutputTokens: t,
    temperature: n,
    topP: o,
    topK: r,
    frequencyPenalty: i,
    presencePenalty: a,
    stopSequences: u,
    responseFormat: c,
    tools: d,
    toolChoice: p,
    seed: m,
    providerOptions: v
  }) {
    let g = [], b = {
      ...await Pe({
        provider: "openai",
        providerOptions: v,
        schema: Ly
      }),
      ...await Pe({
        provider: this.providerOptionsName,
        providerOptions: v,
        schema: Ly
      })
    };
    r != null && g.push({ type: "unsupported-setting", setting: "topK" }), d?.length && g.push({ type: "unsupported-setting", setting: "tools" }), p != null && g.push({ type: "unsupported-setting", setting: "toolChoice" }), c != null && c.type !== "text" && g.push({
      type: "unsupported-setting",
      setting: "responseFormat",
      details: "JSON response format is not supported."
    });
    let { prompt: x, stopSequences: $ } = qS({ prompt: e }), E = [...$ ?? [], ...u ?? []];
    return {
      args: {
        // model id:
        model: this.modelId,
        // model specific settings:
        echo: b.echo,
        logit_bias: b.logitBias,
        logprobs: b?.logprobs === !0 ? 0 : b?.logprobs === !1 ? void 0 : b?.logprobs,
        suffix: b.suffix,
        user: b.user,
        // standardized settings:
        max_tokens: t,
        temperature: n,
        top_p: o,
        frequency_penalty: i,
        presence_penalty: a,
        seed: m,
        // prompt:
        prompt: x,
        // stop sequences:
        stop: E.length > 0 ? E : void 0
      },
      warnings: g
    };
  }
  async doGenerate(e) {
    var t, n, o;
    let { args: r, warnings: i } = await this.getArgs(e), {
      responseHeaders: a,
      value: u,
      rawValue: c
    } = await pe({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: le(this.config.headers(), e.headers),
      body: r,
      failedResponseHandler: bt,
      successfulResponseHandler: he(
        JS
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    }), d = u.choices[0], p = { openai: {} };
    return d.logprobs != null && (p.openai.logprobs = d.logprobs), {
      content: [{ type: "text", text: d.text }],
      usage: {
        inputTokens: (t = u.usage) == null ? void 0 : t.prompt_tokens,
        outputTokens: (n = u.usage) == null ? void 0 : n.completion_tokens,
        totalTokens: (o = u.usage) == null ? void 0 : o.total_tokens
      },
      finishReason: Zy(d.finish_reason),
      request: { body: r },
      response: {
        ...My(u),
        headers: a,
        body: c
      },
      providerMetadata: p,
      warnings: i
    };
  }
  async doStream(e) {
    let { args: t, warnings: n } = await this.getArgs(e), o = {
      ...t,
      stream: !0,
      stream_options: {
        include_usage: !0
      }
    }, { responseHeaders: r, value: i } = await pe({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: le(this.config.headers(), e.headers),
      body: o,
      failedResponseHandler: bt,
      successfulResponseHandler: Xt(
        BS
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    }), a = "unknown", u = { openai: {} }, c = {
      inputTokens: void 0,
      outputTokens: void 0,
      totalTokens: void 0
    }, d = !0;
    return {
      stream: i.pipeThrough(
        new TransformStream({
          start(p) {
            p.enqueue({ type: "stream-start", warnings: n });
          },
          transform(p, m) {
            if (e.includeRawChunks && m.enqueue({ type: "raw", rawValue: p.rawValue }), !p.success) {
              a = "error", m.enqueue({ type: "error", error: p.error });
              return;
            }
            let v = p.value;
            if ("error" in v) {
              a = "error", m.enqueue({ type: "error", error: v.error });
              return;
            }
            d && (d = !1, m.enqueue({
              type: "response-metadata",
              ...My(v)
            }), m.enqueue({ type: "text-start", id: "0" })), v.usage != null && (c.inputTokens = v.usage.prompt_tokens, c.outputTokens = v.usage.completion_tokens, c.totalTokens = v.usage.total_tokens);
            let g = v.choices[0];
            g?.finish_reason != null && (a = Zy(g.finish_reason)), g?.logprobs != null && (u.openai.logprobs = g.logprobs), g?.text != null && g.text.length > 0 && m.enqueue({
              type: "text-delta",
              id: "0",
              delta: g.text
            });
          },
          flush(p) {
            d || p.enqueue({ type: "text-end", id: "0" }), p.enqueue({
              type: "finish",
              finishReason: a,
              providerMetadata: u,
              usage: c
            });
          }
        })
      ),
      request: { body: o },
      response: { headers: r }
    };
  }
}, WS = q(
  () => A(
    s.object({
      /**
      The number of dimensions the resulting output embeddings should have.
      Only supported in text-embedding-3 and later models.
         */
      dimensions: s.number().optional(),
      /**
      A unique identifier representing your end-user, which can help OpenAI to
      monitor and detect abuse. Learn more.
      */
      user: s.string().optional()
    })
  )
), KS = q(
  () => A(
    s.object({
      data: s.array(s.object({ embedding: s.array(s.number()) })),
      usage: s.object({ prompt_tokens: s.number() }).nullish()
    })
  )
), HS = class {
  static {
    l(this, "OpenAIEmbeddingModel");
  }
  constructor(e, t) {
    this.specificationVersion = "v2", this.maxEmbeddingsPerCall = 2048, this.supportsParallelCalls = !0, this.modelId = e, this.config = t;
  }
  get provider() {
    return this.config.provider;
  }
  async doEmbed({
    values: e,
    headers: t,
    abortSignal: n,
    providerOptions: o
  }) {
    var r;
    if (e.length > this.maxEmbeddingsPerCall)
      throw new ph({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values: e
      });
    let i = (r = await Pe({
      provider: "openai",
      providerOptions: o,
      schema: WS
    })) != null ? r : {}, {
      responseHeaders: a,
      value: u,
      rawValue: c
    } = await pe({
      url: this.config.url({
        path: "/embeddings",
        modelId: this.modelId
      }),
      headers: le(this.config.headers(), t),
      body: {
        model: this.modelId,
        input: e,
        encoding_format: "float",
        dimensions: i.dimensions,
        user: i.user
      },
      failedResponseHandler: bt,
      successfulResponseHandler: he(
        KS
      ),
      abortSignal: n,
      fetch: this.config.fetch
    });
    return {
      embeddings: u.data.map((d) => d.embedding),
      usage: u.usage ? { tokens: u.usage.prompt_tokens } : void 0,
      response: { headers: a, body: c }
    };
  }
}, XS = q(
  () => A(
    s.object({
      created: s.number().nullish(),
      data: s.array(
        s.object({
          b64_json: s.string(),
          revised_prompt: s.string().nullish()
        })
      ),
      background: s.string().nullish(),
      output_format: s.string().nullish(),
      size: s.string().nullish(),
      quality: s.string().nullish(),
      usage: s.object({
        input_tokens: s.number().nullish(),
        output_tokens: s.number().nullish(),
        total_tokens: s.number().nullish(),
        input_tokens_details: s.object({
          image_tokens: s.number().nullish(),
          text_tokens: s.number().nullish()
        }).nullish()
      }).nullish()
    })
  )
), YS = {
  "dall-e-3": 1,
  "dall-e-2": 10,
  "gpt-image-1": 10,
  "gpt-image-1-mini": 10,
  "gpt-image-1.5": 10
}, QS = /* @__PURE__ */ new Set([
  "gpt-image-1",
  "gpt-image-1-mini",
  "gpt-image-1.5"
]), e0 = class {
  static {
    l(this, "OpenAIImageModel");
  }
  constructor(e, t) {
    this.modelId = e, this.config = t, this.specificationVersion = "v2";
  }
  get maxImagesPerCall() {
    var e;
    return (e = YS[this.modelId]) != null ? e : 1;
  }
  get provider() {
    return this.config.provider;
  }
  async doGenerate({
    prompt: e,
    n: t,
    size: n,
    aspectRatio: o,
    seed: r,
    providerOptions: i,
    headers: a,
    abortSignal: u
  }) {
    var c, d, p, m;
    let v = [];
    o != null && v.push({
      type: "unsupported-setting",
      setting: "aspectRatio",
      details: "This model does not support aspect ratio. Use `size` instead."
    }), r != null && v.push({ type: "unsupported-setting", setting: "seed" });
    let g = (p = (d = (c = this.config._internal) == null ? void 0 : c.currentDate) == null ? void 0 : d.call(c)) != null ? p : /* @__PURE__ */ new Date(), { value: b, responseHeaders: x } = await pe({
      url: this.config.url({
        path: "/images/generations",
        modelId: this.modelId
      }),
      headers: le(this.config.headers(), a),
      body: {
        model: this.modelId,
        prompt: e,
        n: t,
        size: n,
        ...(m = i.openai) != null ? m : {},
        ...QS.has(this.modelId) ? {} : { response_format: "b64_json" }
      },
      failedResponseHandler: bt,
      successfulResponseHandler: he(
        XS
      ),
      abortSignal: u,
      fetch: this.config.fetch
    });
    return {
      images: b.data.map(($) => $.b64_json),
      warnings: v,
      response: {
        timestamp: g,
        modelId: this.modelId,
        headers: x
      },
      providerMetadata: {
        openai: {
          images: b.data.map(($) => ({
            ...$.revised_prompt ? { revisedPrompt: $.revised_prompt } : {},
            ...b.created != null ? { created: b.created } : {},
            ...b.size != null ? { size: b.size } : {},
            ...b.quality != null ? { quality: b.quality } : {},
            ...b.background != null ? { background: b.background } : {},
            ...b.output_format != null ? { outputFormat: b.output_format } : {}
          }))
        }
      }
    };
  }
}, t0 = me(
  () => A(
    s.object({
      code: s.string().nullish(),
      containerId: s.string()
    })
  )
), r0 = me(
  () => A(
    s.object({
      outputs: s.array(
        s.discriminatedUnion("type", [
          s.object({ type: s.literal("logs"), logs: s.string() }),
          s.object({ type: s.literal("image"), url: s.string() })
        ])
      ).nullish()
    })
  )
), n0 = me(
  () => A(
    s.object({
      container: s.union([
        s.string(),
        s.object({
          fileIds: s.array(s.string()).optional()
        })
      ]).optional()
    })
  )
), o0 = et({
  id: "openai.code_interpreter",
  name: "code_interpreter",
  inputSchema: t0,
  outputSchema: r0
}), i0 = /* @__PURE__ */ l((e = {}) => o0(e), "codeInterpreter"), Wy = s.object({
  key: s.string(),
  type: s.enum(["eq", "ne", "gt", "gte", "lt", "lte", "in", "nin"]),
  value: s.union([s.string(), s.number(), s.boolean(), s.array(s.string())])
}), Ky = s.object({
  type: s.enum(["and", "or"]),
  filters: s.array(
    s.union([Wy, s.lazy(() => Ky)])
  )
}), a0 = me(
  () => A(
    s.object({
      vectorStoreIds: s.array(s.string()),
      maxNumResults: s.number().optional(),
      ranking: s.object({
        ranker: s.string().optional(),
        scoreThreshold: s.number().optional()
      }).optional(),
      filters: s.union([Wy, Ky]).optional()
    })
  )
), s0 = me(
  () => A(
    s.object({
      queries: s.array(s.string()),
      results: s.array(
        s.object({
          attributes: s.record(s.string(), s.unknown()),
          fileId: s.string(),
          filename: s.string(),
          score: s.number(),
          text: s.string()
        })
      ).nullable()
    })
  )
), l0 = et({
  id: "openai.file_search",
  name: "file_search",
  inputSchema: s.object({}),
  outputSchema: s0
}), u0 = me(
  () => A(
    s.object({
      background: s.enum(["auto", "opaque", "transparent"]).optional(),
      inputFidelity: s.enum(["low", "high"]).optional(),
      inputImageMask: s.object({
        fileId: s.string().optional(),
        imageUrl: s.string().optional()
      }).optional(),
      model: s.string().optional(),
      moderation: s.enum(["auto"]).optional(),
      outputCompression: s.number().int().min(0).max(100).optional(),
      outputFormat: s.enum(["png", "jpeg", "webp"]).optional(),
      partialImages: s.number().int().min(0).max(3).optional(),
      quality: s.enum(["auto", "low", "medium", "high"]).optional(),
      size: s.enum(["1024x1024", "1024x1536", "1536x1024", "auto"]).optional()
    }).strict()
  )
), c0 = me(() => A(s.object({}))), d0 = me(
  () => A(s.object({ result: s.string() }))
), p0 = et({
  id: "openai.image_generation",
  name: "image_generation",
  inputSchema: c0,
  outputSchema: d0
}), m0 = /* @__PURE__ */ l((e = {}) => p0(e), "imageGeneration"), Hy = me(
  () => A(
    s.object({
      action: s.object({
        type: s.literal("exec"),
        command: s.array(s.string()),
        timeoutMs: s.number().optional(),
        user: s.string().optional(),
        workingDirectory: s.string().optional(),
        env: s.record(s.string(), s.string()).optional()
      })
    })
  )
), Xy = me(
  () => A(s.object({ output: s.string() }))
), f0 = et({
  id: "openai.local_shell",
  name: "local_shell",
  inputSchema: Hy,
  outputSchema: Xy
}), g0 = me(
  () => A(
    s.object({
      externalWebAccess: s.boolean().optional(),
      filters: s.object({ allowedDomains: s.array(s.string()).optional() }).optional(),
      searchContextSize: s.enum(["low", "medium", "high"]).optional(),
      userLocation: s.object({
        type: s.literal("approximate"),
        country: s.string().optional(),
        city: s.string().optional(),
        region: s.string().optional(),
        timezone: s.string().optional()
      }).optional()
    })
  )
), h0 = me(() => A(s.object({}))), v0 = me(
  () => A(
    s.object({
      action: s.discriminatedUnion("type", [
        s.object({
          type: s.literal("search"),
          query: s.string().optional()
        }),
        s.object({
          type: s.literal("openPage"),
          url: s.string().nullish()
        }),
        s.object({
          type: s.literal("findInPage"),
          url: s.string().nullish(),
          pattern: s.string().nullish()
        })
      ]),
      sources: s.array(
        s.discriminatedUnion("type", [
          s.object({ type: s.literal("url"), url: s.string() }),
          s.object({ type: s.literal("api"), name: s.string() })
        ])
      ).optional()
    })
  )
), y0 = et({
  id: "openai.web_search",
  name: "web_search",
  inputSchema: h0,
  outputSchema: v0
}), _0 = /* @__PURE__ */ l((e = {}) => y0(e), "webSearch"), b0 = me(
  () => A(
    s.object({
      searchContextSize: s.enum(["low", "medium", "high"]).optional(),
      userLocation: s.object({
        type: s.literal("approximate"),
        country: s.string().optional(),
        city: s.string().optional(),
        region: s.string().optional(),
        timezone: s.string().optional()
      }).optional()
    })
  )
), x0 = me(
  () => A(s.object({}))
), $0 = me(
  () => A(
    s.object({
      action: s.discriminatedUnion("type", [
        s.object({
          type: s.literal("search"),
          query: s.string().optional()
        }),
        s.object({
          type: s.literal("openPage"),
          url: s.string().nullish()
        }),
        s.object({
          type: s.literal("findInPage"),
          url: s.string().nullish(),
          pattern: s.string().nullish()
        })
      ])
    })
  )
), w0 = et({
  id: "openai.web_search_preview",
  name: "web_search_preview",
  inputSchema: x0,
  outputSchema: $0
}), k0 = {
  /**
   * The Code Interpreter tool allows models to write and run Python code in a
   * sandboxed environment to solve complex problems in domains like data analysis,
   * coding, and math.
   *
   * @param container - The container to use for the code interpreter.
   *
   * Must have name `code_interpreter`.
   */
  codeInterpreter: i0,
  /**
   * File search is a tool available in the Responses API. It enables models to
   * retrieve information in a knowledge base of previously uploaded files through
   * semantic and keyword search.
   *
   * Must have name `file_search`.
   *
   * @param vectorStoreIds - The vector store IDs to use for the file search.
   * @param maxNumResults - The maximum number of results to return.
   * @param ranking - The ranking options to use for the file search.
   * @param filters - The filters to use for the file search.
   */
  fileSearch: l0,
  /**
   * The image generation tool allows you to generate images using a text prompt,
   * and optionally image inputs. It leverages the GPT Image model,
   * and automatically optimizes text inputs for improved performance.
   *
   * Must have name `image_generation`.
   *
   * @param size - Image dimensions (e.g., 1024x1024, 1024x1536)
   * @param quality - Rendering quality (e.g. low, medium, high)
   * @param format - File output format
   * @param compression - Compression level (0-100%) for JPEG and WebP formats
   * @param background - Transparent or opaque
   */
  imageGeneration: m0,
  /**
   * Local shell is a tool that allows agents to run shell commands locally
   * on a machine you or the user provides.
   *
   * Supported models: `gpt-5-codex` and `codex-mini-latest`
   *
   * Must have name `local_shell`.
   */
  localShell: f0,
  /**
   * Web search allows models to access up-to-date information from the internet
   * and provide answers with sourced citations.
   *
   * Must have name `web_search_preview`.
   *
   * @param searchContextSize - The search context size to use for the web search.
   * @param userLocation - The user location to use for the web search.
   *
   * @deprecated Use `webSearch` instead.
   */
  webSearchPreview: w0,
  /**
   * Web search allows models to access up-to-date information from the internet
   * and provide answers with sourced citations.
   *
   * Must have name `web_search`.
   *
   * @param filters - The filters to use for the web search.
   * @param searchContextSize - The search context size to use for the web search.
   * @param userLocation - The user location to use for the web search.
   */
  webSearch: _0
};
function Fy(e, t) {
  return t ? t.some((n) => e.startsWith(n)) : !1;
}
l(Fy, "isFileId");
async function I0({
  prompt: e,
  systemMessageMode: t,
  fileIdPrefixes: n,
  store: o,
  hasLocalShellTool: r = !1
}) {
  var i, a, u, c;
  let d = [], p = [];
  for (let { role: m, content: v } of e)
    switch (m) {
      case "system": {
        switch (t) {
          case "system": {
            d.push({ role: "system", content: v });
            break;
          }
          case "developer": {
            d.push({ role: "developer", content: v });
            break;
          }
          case "remove": {
            p.push({
              type: "other",
              message: "system messages are removed for this model"
            });
            break;
          }
          default: {
            let g = t;
            throw new Error(
              `Unsupported system message mode: ${g}`
            );
          }
        }
        break;
      }
      case "user": {
        d.push({
          role: "user",
          content: v.map((g, b) => {
            var x, $, E;
            switch (g.type) {
              case "text":
                return { type: "input_text", text: g.text };
              case "file":
                if (g.mediaType.startsWith("image/")) {
                  let O = g.mediaType === "image/*" ? "image/jpeg" : g.mediaType;
                  return {
                    type: "input_image",
                    ...g.data instanceof URL ? { image_url: g.data.toString() } : typeof g.data == "string" && Fy(g.data, n) ? { file_id: g.data } : {
                      image_url: `data:${O};base64,${Qt(g.data)}`
                    },
                    detail: ($ = (x = g.providerOptions) == null ? void 0 : x.openai) == null ? void 0 : $.imageDetail
                  };
                } else {
                  if (g.mediaType === "application/pdf")
                    return g.data instanceof URL ? {
                      type: "input_file",
                      file_url: g.data.toString()
                    } : {
                      type: "input_file",
                      ...typeof g.data == "string" && Fy(g.data, n) ? { file_id: g.data } : {
                        filename: (E = g.filename) != null ? E : `part-${b}.pdf`,
                        file_data: `data:application/pdf;base64,${Qt(g.data)}`
                      }
                    };
                  throw new Ze({
                    functionality: `file part media type ${g.mediaType}`
                  });
                }
            }
          })
        });
        break;
      }
      case "assistant": {
        let g = {}, b = {};
        for (let x of v)
          switch (x.type) {
            case "text": {
              let $ = (a = (i = x.providerOptions) == null ? void 0 : i.openai) == null ? void 0 : a.itemId;
              if (o && $ != null) {
                d.push({ type: "item_reference", id: $ });
                break;
              }
              d.push({
                role: "assistant",
                content: [{ type: "output_text", text: x.text }],
                id: $
              });
              break;
            }
            case "tool-call": {
              if (b[x.toolCallId] = x, x.providerExecuted)
                break;
              let $ = (c = (u = x.providerOptions) == null ? void 0 : u.openai) == null ? void 0 : c.itemId;
              if (o && $ != null) {
                d.push({ type: "item_reference", id: $ });
                break;
              }
              if (r && x.toolName === "local_shell") {
                let E = await ct({
                  value: x.input,
                  schema: Hy
                });
                d.push({
                  type: "local_shell_call",
                  call_id: x.toolCallId,
                  id: $,
                  action: {
                    type: "exec",
                    command: E.action.command,
                    timeout_ms: E.action.timeoutMs,
                    user: E.action.user,
                    working_directory: E.action.workingDirectory,
                    env: E.action.env
                  }
                });
                break;
              }
              d.push({
                type: "function_call",
                call_id: x.toolCallId,
                name: x.toolName,
                arguments: JSON.stringify(x.input),
                id: $
              });
              break;
            }
            // assistant tool result parts are from provider-executed tools:
            case "tool-result": {
              o ? d.push({ type: "item_reference", id: x.toolCallId }) : p.push({
                type: "other",
                message: `Results for OpenAI tool ${x.toolName} are not sent to the API when store is false`
              });
              break;
            }
            case "reasoning": {
              let $ = await Pe({
                provider: "openai",
                providerOptions: x.providerOptions,
                schema: S0
              }), E = $?.itemId;
              if (E != null) {
                let O = g[E];
                if (o)
                  O === void 0 && (d.push({ type: "item_reference", id: E }), g[E] = {
                    type: "reasoning",
                    id: E,
                    summary: []
                  });
                else {
                  let y = [];
                  x.text.length > 0 ? y.push({
                    type: "summary_text",
                    text: x.text
                  }) : O !== void 0 && p.push({
                    type: "other",
                    message: `Cannot append empty reasoning part to existing reasoning sequence. Skipping reasoning part: ${JSON.stringify(x)}.`
                  }), O === void 0 ? (g[E] = {
                    type: "reasoning",
                    id: E,
                    encrypted_content: $?.reasoningEncryptedContent,
                    summary: y
                  }, d.push(g[E])) : (O.summary.push(...y), $?.reasoningEncryptedContent != null && (O.encrypted_content = $.reasoningEncryptedContent));
                }
              } else
                p.push({
                  type: "other",
                  message: `Non-OpenAI reasoning parts are not supported. Skipping reasoning part: ${JSON.stringify(x)}.`
                });
              break;
            }
          }
        break;
      }
      case "tool": {
        for (let g of v) {
          let b = g.output;
          if (r && g.toolName === "local_shell" && b.type === "json") {
            let $ = await ct({
              value: b.value,
              schema: Xy
            });
            d.push({
              type: "local_shell_call_output",
              call_id: g.toolCallId,
              output: $.output
            });
            break;
          }
          let x;
          switch (b.type) {
            case "text":
            case "error-text":
              x = b.value;
              break;
            case "json":
            case "error-json":
              x = JSON.stringify(b.value);
              break;
            case "content":
              x = b.value.map(($) => {
                switch ($.type) {
                  case "text":
                    return { type: "input_text", text: $.text };
                  case "media":
                    return $.mediaType.startsWith("image/") ? {
                      type: "input_image",
                      image_url: `data:${$.mediaType};base64,${$.data}`
                    } : {
                      type: "input_file",
                      filename: "data",
                      file_data: `data:${$.mediaType};base64,${$.data}`
                    };
                }
              });
              break;
          }
          d.push({
            type: "function_call_output",
            call_id: g.toolCallId,
            output: x
          });
        }
        break;
      }
      default: {
        let g = m;
        throw new Error(`Unsupported role: ${g}`);
      }
    }
  return { input: d, warnings: p };
}
l(I0, "convertToOpenAIResponsesInput");
var S0 = s.object({
  itemId: s.string().nullish(),
  reasoningEncryptedContent: s.string().nullish()
});
function Vy({
  finishReason: e,
  hasFunctionCall: t
}) {
  switch (e) {
    case void 0:
    case null:
      return t ? "tool-calls" : "stop";
    case "max_output_tokens":
      return "length";
    case "content_filter":
      return "content-filter";
    default:
      return t ? "tool-calls" : "unknown";
  }
}
l(Vy, "mapOpenAIResponseFinishReason");
var T0 = q(
  () => A(
    s.union([
      s.object({
        type: s.literal("response.output_text.delta"),
        item_id: s.string(),
        delta: s.string(),
        logprobs: s.array(
          s.object({
            token: s.string(),
            logprob: s.number(),
            top_logprobs: s.array(
              s.object({
                token: s.string(),
                logprob: s.number()
              })
            )
          })
        ).nullish()
      }),
      s.object({
        type: s.enum(["response.completed", "response.incomplete"]),
        response: s.object({
          incomplete_details: s.object({ reason: s.string() }).nullish(),
          usage: s.object({
            input_tokens: s.number(),
            input_tokens_details: s.object({ cached_tokens: s.number().nullish() }).nullish(),
            output_tokens: s.number(),
            output_tokens_details: s.object({ reasoning_tokens: s.number().nullish() }).nullish()
          }),
          service_tier: s.string().nullish()
        })
      }),
      s.object({
        type: s.literal("response.created"),
        response: s.object({
          id: s.string(),
          created_at: s.number(),
          model: s.string(),
          service_tier: s.string().nullish()
        })
      }),
      s.object({
        type: s.literal("response.output_item.added"),
        output_index: s.number(),
        item: s.discriminatedUnion("type", [
          s.object({
            type: s.literal("message"),
            id: s.string()
          }),
          s.object({
            type: s.literal("reasoning"),
            id: s.string(),
            encrypted_content: s.string().nullish()
          }),
          s.object({
            type: s.literal("function_call"),
            id: s.string(),
            call_id: s.string(),
            name: s.string(),
            arguments: s.string()
          }),
          s.object({
            type: s.literal("web_search_call"),
            id: s.string(),
            status: s.string()
          }),
          s.object({
            type: s.literal("computer_call"),
            id: s.string(),
            status: s.string()
          }),
          s.object({
            type: s.literal("file_search_call"),
            id: s.string()
          }),
          s.object({
            type: s.literal("image_generation_call"),
            id: s.string()
          }),
          s.object({
            type: s.literal("code_interpreter_call"),
            id: s.string(),
            container_id: s.string(),
            code: s.string().nullable(),
            outputs: s.array(
              s.discriminatedUnion("type", [
                s.object({ type: s.literal("logs"), logs: s.string() }),
                s.object({ type: s.literal("image"), url: s.string() })
              ])
            ).nullable(),
            status: s.string()
          })
        ])
      }),
      s.object({
        type: s.literal("response.output_item.done"),
        output_index: s.number(),
        item: s.discriminatedUnion("type", [
          s.object({
            type: s.literal("message"),
            id: s.string()
          }),
          s.object({
            type: s.literal("reasoning"),
            id: s.string(),
            encrypted_content: s.string().nullish()
          }),
          s.object({
            type: s.literal("function_call"),
            id: s.string(),
            call_id: s.string(),
            name: s.string(),
            arguments: s.string(),
            status: s.literal("completed")
          }),
          s.object({
            type: s.literal("code_interpreter_call"),
            id: s.string(),
            code: s.string().nullable(),
            container_id: s.string(),
            outputs: s.array(
              s.discriminatedUnion("type", [
                s.object({ type: s.literal("logs"), logs: s.string() }),
                s.object({ type: s.literal("image"), url: s.string() })
              ])
            ).nullable()
          }),
          s.object({
            type: s.literal("image_generation_call"),
            id: s.string(),
            result: s.string()
          }),
          s.object({
            type: s.literal("web_search_call"),
            id: s.string(),
            status: s.string(),
            action: s.discriminatedUnion("type", [
              s.object({
                type: s.literal("search"),
                query: s.string().nullish(),
                sources: s.array(
                  s.discriminatedUnion("type", [
                    s.object({ type: s.literal("url"), url: s.string() }),
                    s.object({ type: s.literal("api"), name: s.string() })
                  ])
                ).nullish()
              }),
              s.object({
                type: s.literal("open_page"),
                url: s.string().nullish()
              }),
              s.object({
                type: s.literal("find_in_page"),
                url: s.string().nullish(),
                pattern: s.string().nullish()
              })
            ])
          }),
          s.object({
            type: s.literal("file_search_call"),
            id: s.string(),
            queries: s.array(s.string()),
            results: s.array(
              s.object({
                attributes: s.record(s.string(), s.unknown()),
                file_id: s.string(),
                filename: s.string(),
                score: s.number(),
                text: s.string()
              })
            ).nullish()
          }),
          s.object({
            type: s.literal("local_shell_call"),
            id: s.string(),
            call_id: s.string(),
            action: s.object({
              type: s.literal("exec"),
              command: s.array(s.string()),
              timeout_ms: s.number().optional(),
              user: s.string().optional(),
              working_directory: s.string().optional(),
              env: s.record(s.string(), s.string()).optional()
            })
          }),
          s.object({
            type: s.literal("computer_call"),
            id: s.string(),
            status: s.literal("completed")
          })
        ])
      }),
      s.object({
        type: s.literal("response.function_call_arguments.delta"),
        item_id: s.string(),
        output_index: s.number(),
        delta: s.string()
      }),
      s.object({
        type: s.literal("response.image_generation_call.partial_image"),
        item_id: s.string(),
        output_index: s.number(),
        partial_image_b64: s.string()
      }),
      s.object({
        type: s.literal("response.code_interpreter_call_code.delta"),
        item_id: s.string(),
        output_index: s.number(),
        delta: s.string()
      }),
      s.object({
        type: s.literal("response.code_interpreter_call_code.done"),
        item_id: s.string(),
        output_index: s.number(),
        code: s.string()
      }),
      s.object({
        type: s.literal("response.output_text.annotation.added"),
        annotation: s.discriminatedUnion("type", [
          s.object({
            type: s.literal("url_citation"),
            start_index: s.number(),
            end_index: s.number(),
            url: s.string(),
            title: s.string()
          }),
          s.object({
            type: s.literal("file_citation"),
            file_id: s.string(),
            filename: s.string().nullish(),
            index: s.number().nullish(),
            start_index: s.number().nullish(),
            end_index: s.number().nullish(),
            quote: s.string().nullish()
          })
        ])
      }),
      s.object({
        type: s.literal("response.reasoning_summary_part.added"),
        item_id: s.string(),
        summary_index: s.number()
      }),
      s.object({
        type: s.literal("response.reasoning_summary_text.delta"),
        item_id: s.string(),
        summary_index: s.number(),
        delta: s.string()
      }),
      s.object({
        type: s.literal("response.reasoning_summary_part.done"),
        item_id: s.string(),
        summary_index: s.number()
      }),
      s.object({
        type: s.literal("error"),
        sequence_number: s.number(),
        error: s.object({
          type: s.string(),
          code: s.string(),
          message: s.string(),
          param: s.string().nullish()
        })
      }),
      s.object({ type: s.string() }).loose().transform((e) => ({
        type: "unknown_chunk",
        message: e.type
      }))
      // fallback for unknown chunks
    ])
  )
), z0 = q(
  () => A(
    s.object({
      id: s.string().optional(),
      created_at: s.number().optional(),
      error: s.object({
        message: s.string(),
        type: s.string(),
        param: s.string().nullish(),
        code: s.string()
      }).nullish(),
      model: s.string().optional(),
      output: s.array(
        s.discriminatedUnion("type", [
          s.object({
            type: s.literal("message"),
            role: s.literal("assistant"),
            id: s.string(),
            content: s.array(
              s.object({
                type: s.literal("output_text"),
                text: s.string(),
                logprobs: s.array(
                  s.object({
                    token: s.string(),
                    logprob: s.number(),
                    top_logprobs: s.array(
                      s.object({
                        token: s.string(),
                        logprob: s.number()
                      })
                    )
                  })
                ).nullish(),
                annotations: s.array(
                  s.discriminatedUnion("type", [
                    s.object({
                      type: s.literal("url_citation"),
                      start_index: s.number(),
                      end_index: s.number(),
                      url: s.string(),
                      title: s.string()
                    }),
                    s.object({
                      type: s.literal("file_citation"),
                      file_id: s.string(),
                      filename: s.string().nullish(),
                      index: s.number().nullish(),
                      start_index: s.number().nullish(),
                      end_index: s.number().nullish(),
                      quote: s.string().nullish()
                    }),
                    s.object({
                      type: s.literal("container_file_citation"),
                      container_id: s.string(),
                      file_id: s.string(),
                      filename: s.string().nullish(),
                      start_index: s.number().nullish(),
                      end_index: s.number().nullish(),
                      index: s.number().nullish()
                    }),
                    s.object({
                      type: s.literal("file_path"),
                      file_id: s.string(),
                      index: s.number().nullish()
                    })
                  ])
                )
              })
            )
          }),
          s.object({
            type: s.literal("web_search_call"),
            id: s.string(),
            status: s.string(),
            action: s.discriminatedUnion("type", [
              s.object({
                type: s.literal("search"),
                query: s.string().nullish(),
                sources: s.array(
                  s.discriminatedUnion("type", [
                    s.object({ type: s.literal("url"), url: s.string() }),
                    s.object({ type: s.literal("api"), name: s.string() })
                  ])
                ).nullish()
              }),
              s.object({
                type: s.literal("open_page"),
                url: s.string().nullish()
              }),
              s.object({
                type: s.literal("find_in_page"),
                url: s.string().nullish(),
                pattern: s.string().nullish()
              })
            ])
          }),
          s.object({
            type: s.literal("file_search_call"),
            id: s.string(),
            queries: s.array(s.string()),
            results: s.array(
              s.object({
                attributes: s.record(
                  s.string(),
                  s.union([s.string(), s.number(), s.boolean()])
                ),
                file_id: s.string(),
                filename: s.string(),
                score: s.number(),
                text: s.string()
              })
            ).nullish()
          }),
          s.object({
            type: s.literal("code_interpreter_call"),
            id: s.string(),
            code: s.string().nullable(),
            container_id: s.string(),
            outputs: s.array(
              s.discriminatedUnion("type", [
                s.object({ type: s.literal("logs"), logs: s.string() }),
                s.object({ type: s.literal("image"), url: s.string() })
              ])
            ).nullable()
          }),
          s.object({
            type: s.literal("image_generation_call"),
            id: s.string(),
            result: s.string()
          }),
          s.object({
            type: s.literal("local_shell_call"),
            id: s.string(),
            call_id: s.string(),
            action: s.object({
              type: s.literal("exec"),
              command: s.array(s.string()),
              timeout_ms: s.number().optional(),
              user: s.string().optional(),
              working_directory: s.string().optional(),
              env: s.record(s.string(), s.string()).optional()
            })
          }),
          s.object({
            type: s.literal("function_call"),
            call_id: s.string(),
            name: s.string(),
            arguments: s.string(),
            id: s.string()
          }),
          s.object({
            type: s.literal("computer_call"),
            id: s.string(),
            status: s.string().optional()
          }),
          s.object({
            type: s.literal("reasoning"),
            id: s.string(),
            encrypted_content: s.string().nullish(),
            summary: s.array(
              s.object({
                type: s.literal("summary_text"),
                text: s.string()
              })
            )
          })
        ])
      ).optional(),
      service_tier: s.string().nullish(),
      incomplete_details: s.object({ reason: s.string() }).nullish(),
      usage: s.object({
        input_tokens: s.number(),
        input_tokens_details: s.object({ cached_tokens: s.number().nullish() }).nullish(),
        output_tokens: s.number(),
        output_tokens_details: s.object({ reasoning_tokens: s.number().nullish() }).nullish()
      }).optional()
    })
  )
), Yy = 20, E0 = [
  "o1",
  "o1-2024-12-17",
  "o3",
  "o3-2025-04-16",
  "o3-deep-research",
  "o3-deep-research-2025-06-26",
  "o3-mini",
  "o3-mini-2025-01-31",
  "o4-mini",
  "o4-mini-2025-04-16",
  "o4-mini-deep-research",
  "o4-mini-deep-research-2025-06-26",
  "codex-mini-latest",
  "computer-use-preview",
  "gpt-5",
  "gpt-5-2025-08-07",
  "gpt-5-codex",
  "gpt-5-mini",
  "gpt-5-mini-2025-08-07",
  "gpt-5-nano",
  "gpt-5-nano-2025-08-07",
  "gpt-5-pro",
  "gpt-5-pro-2025-10-06",
  "gpt-5.1",
  "gpt-5.1-chat-latest",
  "gpt-5.1-codex-mini",
  "gpt-5.1-codex",
  "gpt-5.1-codex-max",
  "gpt-5.2",
  "gpt-5.2-chat-latest",
  "gpt-5.2-pro"
], cC = [
  "gpt-4.1",
  "gpt-4.1-2025-04-14",
  "gpt-4.1-mini",
  "gpt-4.1-mini-2025-04-14",
  "gpt-4.1-nano",
  "gpt-4.1-nano-2025-04-14",
  "gpt-4o",
  "gpt-4o-2024-05-13",
  "gpt-4o-2024-08-06",
  "gpt-4o-2024-11-20",
  "gpt-4o-audio-preview",
  "gpt-4o-audio-preview-2024-10-01",
  "gpt-4o-audio-preview-2024-12-17",
  "gpt-4o-search-preview",
  "gpt-4o-search-preview-2025-03-11",
  "gpt-4o-mini-search-preview",
  "gpt-4o-mini-search-preview-2025-03-11",
  "gpt-4o-mini",
  "gpt-4o-mini-2024-07-18",
  "gpt-4-turbo",
  "gpt-4-turbo-2024-04-09",
  "gpt-4-turbo-preview",
  "gpt-4-0125-preview",
  "gpt-4-1106-preview",
  "gpt-4",
  "gpt-4-0613",
  "gpt-4.5-preview",
  "gpt-4.5-preview-2025-02-27",
  "gpt-3.5-turbo-0125",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-1106",
  "chatgpt-4o-latest",
  "gpt-5-chat-latest",
  ...E0
], O0 = q(
  () => A(
    s.object({
      conversation: s.string().nullish(),
      include: s.array(
        s.enum([
          "reasoning.encrypted_content",
          // handled internally by default, only needed for unknown reasoning models
          "file_search_call.results",
          "message.output_text.logprobs"
        ])
      ).nullish(),
      instructions: s.string().nullish(),
      /**
       * Return the log probabilities of the tokens.
       *
       * Setting to true will return the log probabilities of the tokens that
       * were generated.
       *
       * Setting to a number will return the log probabilities of the top n
       * tokens that were generated.
       *
       * @see https://platform.openai.com/docs/api-reference/responses/create
       * @see https://cookbook.openai.com/examples/using_logprobs
       */
      logprobs: s.union([s.boolean(), s.number().min(1).max(Yy)]).optional(),
      /**
       * The maximum number of total calls to built-in tools that can be processed in a response.
       * This maximum number applies across all built-in tool calls, not per individual tool.
       * Any further attempts to call a tool by the model will be ignored.
       */
      maxToolCalls: s.number().nullish(),
      metadata: s.any().nullish(),
      parallelToolCalls: s.boolean().nullish(),
      previousResponseId: s.string().nullish(),
      promptCacheKey: s.string().nullish(),
      /**
       * The retention policy for the prompt cache.
       * - 'in_memory': Default. Standard prompt caching behavior.
       * - '24h': Extended prompt caching that keeps cached prefixes active for up to 24 hours.
       *          Currently only available for 5.1 series models.
       *
       * @default 'in_memory'
       */
      promptCacheRetention: s.enum(["in_memory", "24h"]).nullish(),
      /**
       * Reasoning effort for reasoning models. Defaults to `medium`. If you use
       * `providerOptions` to set the `reasoningEffort` option, this model setting will be ignored.
       * Valid values: 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh'
       *
       * The 'none' type for `reasoningEffort` is only available for OpenAI's GPT-5.1
       * models. Also, the 'xhigh' type for `reasoningEffort` is only available for
       * OpenAI's GPT-5.1-Codex-Max model. Setting `reasoningEffort` to 'none' or 'xhigh' with unsupported models will result in
       * an error.
       */
      reasoningEffort: s.string().nullish(),
      reasoningSummary: s.string().nullish(),
      safetyIdentifier: s.string().nullish(),
      serviceTier: s.enum(["auto", "flex", "priority", "default"]).nullish(),
      store: s.boolean().nullish(),
      strictJsonSchema: s.boolean().nullish(),
      textVerbosity: s.enum(["low", "medium", "high"]).nullish(),
      truncation: s.enum(["auto", "disabled"]).nullish(),
      user: s.string().nullish()
    })
  )
);
async function j0({
  tools: e,
  toolChoice: t,
  strictJsonSchema: n
}) {
  e = e?.length ? e : void 0;
  let o = [];
  if (e == null)
    return { tools: void 0, toolChoice: void 0, toolWarnings: o };
  let r = [];
  for (let a of e)
    switch (a.type) {
      case "function":
        r.push({
          type: "function",
          name: a.name,
          description: a.description,
          parameters: a.inputSchema,
          strict: n
        });
        break;
      case "provider-defined": {
        switch (a.id) {
          case "openai.file_search": {
            let u = await ct({
              value: a.args,
              schema: a0
            });
            r.push({
              type: "file_search",
              vector_store_ids: u.vectorStoreIds,
              max_num_results: u.maxNumResults,
              ranking_options: u.ranking ? {
                ranker: u.ranking.ranker,
                score_threshold: u.ranking.scoreThreshold
              } : void 0,
              filters: u.filters
            });
            break;
          }
          case "openai.local_shell": {
            r.push({
              type: "local_shell"
            });
            break;
          }
          case "openai.web_search_preview": {
            let u = await ct({
              value: a.args,
              schema: b0
            });
            r.push({
              type: "web_search_preview",
              search_context_size: u.searchContextSize,
              user_location: u.userLocation
            });
            break;
          }
          case "openai.web_search": {
            let u = await ct({
              value: a.args,
              schema: g0
            });
            r.push({
              type: "web_search",
              filters: u.filters != null ? { allowed_domains: u.filters.allowedDomains } : void 0,
              external_web_access: u.externalWebAccess,
              search_context_size: u.searchContextSize,
              user_location: u.userLocation
            });
            break;
          }
          case "openai.code_interpreter": {
            let u = await ct({
              value: a.args,
              schema: n0
            });
            r.push({
              type: "code_interpreter",
              container: u.container == null ? { type: "auto", file_ids: void 0 } : typeof u.container == "string" ? u.container : { type: "auto", file_ids: u.container.fileIds }
            });
            break;
          }
          case "openai.image_generation": {
            let u = await ct({
              value: a.args,
              schema: u0
            });
            r.push({
              type: "image_generation",
              background: u.background,
              input_fidelity: u.inputFidelity,
              input_image_mask: u.inputImageMask ? {
                file_id: u.inputImageMask.fileId,
                image_url: u.inputImageMask.imageUrl
              } : void 0,
              model: u.model,
              size: u.size,
              quality: u.quality,
              moderation: u.moderation,
              output_format: u.outputFormat,
              output_compression: u.outputCompression
            });
            break;
          }
        }
        break;
      }
      default:
        o.push({ type: "unsupported-tool", tool: a });
        break;
    }
  if (t == null)
    return { tools: r, toolChoice: void 0, toolWarnings: o };
  let i = t.type;
  switch (i) {
    case "auto":
    case "none":
    case "required":
      return { tools: r, toolChoice: i, toolWarnings: o };
    case "tool":
      return {
        tools: r,
        toolChoice: t.toolName === "code_interpreter" || t.toolName === "file_search" || t.toolName === "image_generation" || t.toolName === "web_search_preview" || t.toolName === "web_search" ? { type: t.toolName } : { type: "function", name: t.toolName },
        toolWarnings: o
      };
    default: {
      let a = i;
      throw new Ze({
        functionality: `tool choice type: ${a}`
      });
    }
  }
}
l(j0, "prepareResponsesTools");
var P0 = class {
  static {
    l(this, "OpenAIResponsesLanguageModel");
  }
  constructor(e, t) {
    this.specificationVersion = "v2", this.supportedUrls = {
      "image/*": [/^https?:\/\/.*$/],
      "application/pdf": [/^https?:\/\/.*$/]
    }, this.modelId = e, this.config = t;
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    maxOutputTokens: e,
    temperature: t,
    stopSequences: n,
    topP: o,
    topK: r,
    presencePenalty: i,
    frequencyPenalty: a,
    seed: u,
    prompt: c,
    providerOptions: d,
    tools: p,
    toolChoice: m,
    responseFormat: v
  }) {
    var g, b, x, $;
    let E = [], O = Gy(this.modelId);
    r != null && E.push({ type: "unsupported-setting", setting: "topK" }), u != null && E.push({ type: "unsupported-setting", setting: "seed" }), i != null && E.push({
      type: "unsupported-setting",
      setting: "presencePenalty"
    }), a != null && E.push({
      type: "unsupported-setting",
      setting: "frequencyPenalty"
    }), n != null && E.push({ type: "unsupported-setting", setting: "stopSequences" });
    let y = await Pe({
      provider: "openai",
      providerOptions: d,
      schema: O0
    });
    y?.conversation && y?.previousResponseId && E.push({
      type: "unsupported-setting",
      setting: "conversation",
      details: "conversation and previousResponseId cannot be used together"
    });
    let { input: B, warnings: Y } = await I0({
      prompt: c,
      systemMessageMode: O.systemMessageMode,
      fileIdPrefixes: this.config.fileIdPrefixes,
      store: (g = y?.store) != null ? g : !0,
      hasLocalShellTool: ve("openai.local_shell")
    });
    E.push(...Y);
    let fe = (b = y?.strictJsonSchema) != null ? b : !1, J = y?.include;
    function Z(Q) {
      J == null ? J = [Q] : J.includes(Q) || (J = [...J, Q]);
    }
    l(Z, "addInclude");
    function ve(Q) {
      return p?.find(
        (Ce) => Ce.type === "provider-defined" && Ce.id === Q
      ) != null;
    }
    l(ve, "hasOpenAITool");
    let ce = typeof y?.logprobs == "number" ? y?.logprobs : y?.logprobs === !0 ? Yy : void 0;
    ce && Z("message.output_text.logprobs");
    let ke = (x = p?.find(
      (Q) => Q.type === "provider-defined" && (Q.id === "openai.web_search" || Q.id === "openai.web_search_preview")
    )) == null ? void 0 : x.name;
    ke && Z("web_search_call.action.sources"), ve("openai.code_interpreter") && Z("code_interpreter_call.outputs");
    let Ae = y?.store;
    Ae === !1 && O.isReasoningModel && Z("reasoning.encrypted_content");
    let ye = {
      model: this.modelId,
      input: B,
      temperature: t,
      top_p: o,
      max_output_tokens: e,
      ...(v?.type === "json" || y?.textVerbosity) && {
        text: {
          ...v?.type === "json" && {
            format: v.schema != null ? {
              type: "json_schema",
              strict: fe,
              name: ($ = v.name) != null ? $ : "response",
              description: v.description,
              schema: v.schema
            } : { type: "json_object" }
          },
          ...y?.textVerbosity && {
            verbosity: y.textVerbosity
          }
        }
      },
      // provider options:
      conversation: y?.conversation,
      max_tool_calls: y?.maxToolCalls,
      metadata: y?.metadata,
      parallel_tool_calls: y?.parallelToolCalls,
      previous_response_id: y?.previousResponseId,
      store: Ae,
      user: y?.user,
      instructions: y?.instructions,
      service_tier: y?.serviceTier,
      include: J,
      prompt_cache_key: y?.promptCacheKey,
      prompt_cache_retention: y?.promptCacheRetention,
      safety_identifier: y?.safetyIdentifier,
      top_logprobs: ce,
      truncation: y?.truncation,
      // model-specific settings:
      ...O.isReasoningModel && (y?.reasoningEffort != null || y?.reasoningSummary != null) && {
        reasoning: {
          ...y?.reasoningEffort != null && {
            effort: y.reasoningEffort
          },
          ...y?.reasoningSummary != null && {
            summary: y.reasoningSummary
          }
        }
      }
    };
    O.isReasoningModel ? y?.reasoningEffort === "none" && O.supportsNonReasoningParameters || (ye.temperature != null && (ye.temperature = void 0, E.push({
      type: "unsupported-setting",
      setting: "temperature",
      details: "temperature is not supported for reasoning models"
    })), ye.top_p != null && (ye.top_p = void 0, E.push({
      type: "unsupported-setting",
      setting: "topP",
      details: "topP is not supported for reasoning models"
    }))) : (y?.reasoningEffort != null && E.push({
      type: "unsupported-setting",
      setting: "reasoningEffort",
      details: "reasoningEffort is not supported for non-reasoning models"
    }), y?.reasoningSummary != null && E.push({
      type: "unsupported-setting",
      setting: "reasoningSummary",
      details: "reasoningSummary is not supported for non-reasoning models"
    })), y?.serviceTier === "flex" && !O.supportsFlexProcessing && (E.push({
      type: "unsupported-setting",
      setting: "serviceTier",
      details: "flex processing is only available for o3, o4-mini, and gpt-5 models"
    }), delete ye.service_tier), y?.serviceTier === "priority" && !O.supportsPriorityProcessing && (E.push({
      type: "unsupported-setting",
      setting: "serviceTier",
      details: "priority processing is only available for supported models (gpt-4, gpt-5, gpt-5-mini, o3, o4-mini) and requires Enterprise access. gpt-5-nano is not supported"
    }), delete ye.service_tier);
    let {
      tools: He,
      toolChoice: Ie,
      toolWarnings: Re
    } = await j0({
      tools: p,
      toolChoice: m,
      strictJsonSchema: fe
    });
    return {
      webSearchToolName: ke,
      args: {
        ...ye,
        tools: He,
        tool_choice: Ie
      },
      warnings: [...E, ...Re],
      store: Ae
    };
  }
  async doGenerate(e) {
    var t, n, o, r, i, a, u, c, d, p, m, v, g, b, x, $, E, O, y, B, Y, fe, J, Z, ve, ce, ke, Ae;
    let {
      args: ye,
      warnings: He,
      webSearchToolName: Ie
    } = await this.getArgs(e), Re = this.config.url({
      path: "/responses",
      modelId: this.modelId
    }), Q = this.config.provider.replace(".responses", ""), {
      responseHeaders: Ce,
      value: ge,
      rawValue: rt
    } = await pe({
      url: Re,
      headers: le(this.config.headers(), e.headers),
      body: ye,
      failedResponseHandler: bt,
      successfulResponseHandler: he(
        z0
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    });
    if (ge.error)
      throw new se({
        message: ge.error.message,
        url: Re,
        requestBodyValues: ye,
        statusCode: 400,
        responseHeaders: Ce,
        responseBody: rt,
        isRetryable: !1
      });
    let re = [], ae = [], _e = !1;
    for (let f of ge.output)
      switch (f.type) {
        case "reasoning": {
          f.summary.length === 0 && f.summary.push({ type: "summary_text", text: "" });
          for (let D of f.summary)
            re.push({
              type: "reasoning",
              text: D.text,
              providerMetadata: {
                [Q]: {
                  itemId: f.id,
                  reasoningEncryptedContent: (t = f.encrypted_content) != null ? t : null
                }
              }
            });
          break;
        }
        case "image_generation_call": {
          re.push({
            type: "tool-call",
            toolCallId: f.id,
            toolName: "image_generation",
            input: "{}",
            providerExecuted: !0
          }), re.push({
            type: "tool-result",
            toolCallId: f.id,
            toolName: "image_generation",
            result: {
              result: f.result
            },
            providerExecuted: !0
          });
          break;
        }
        case "local_shell_call": {
          re.push({
            type: "tool-call",
            toolCallId: f.call_id,
            toolName: "local_shell",
            input: JSON.stringify({
              action: f.action
            }),
            providerMetadata: {
              [Q]: {
                itemId: f.id
              }
            }
          });
          break;
        }
        case "message": {
          for (let D of f.content) {
            (o = (n = e.providerOptions) == null ? void 0 : n.openai) != null && o.logprobs && D.logprobs && ae.push(D.logprobs), re.push({
              type: "text",
              text: D.text,
              providerMetadata: {
                [Q]: {
                  itemId: f.id
                }
              }
            });
            for (let U of D.annotations)
              U.type === "url_citation" ? re.push({
                type: "source",
                sourceType: "url",
                id: (a = (i = (r = this.config).generateId) == null ? void 0 : i.call(r)) != null ? a : We(),
                url: U.url,
                title: U.title
              }) : U.type === "file_citation" ? re.push({
                type: "source",
                sourceType: "document",
                id: (d = (c = (u = this.config).generateId) == null ? void 0 : c.call(u)) != null ? d : We(),
                mediaType: "text/plain",
                title: (m = (p = U.quote) != null ? p : U.filename) != null ? m : "Document",
                filename: (v = U.filename) != null ? v : U.file_id,
                ...U.file_id ? {
                  providerMetadata: {
                    [Q]: {
                      fileId: U.file_id
                    }
                  }
                } : {}
              }) : U.type === "container_file_citation" ? re.push({
                type: "source",
                sourceType: "document",
                id: (x = (b = (g = this.config).generateId) == null ? void 0 : b.call(g)) != null ? x : We(),
                mediaType: "text/plain",
                title: (E = ($ = U.filename) != null ? $ : U.file_id) != null ? E : "Document",
                filename: (O = U.filename) != null ? O : U.file_id,
                providerMetadata: {
                  [Q]: {
                    fileId: U.file_id,
                    containerId: U.container_id,
                    ...U.index != null ? { index: U.index } : {}
                  }
                }
              }) : U.type === "file_path" && re.push({
                type: "source",
                sourceType: "document",
                id: (Y = (B = (y = this.config).generateId) == null ? void 0 : B.call(y)) != null ? Y : We(),
                mediaType: "application/octet-stream",
                title: U.file_id,
                filename: U.file_id,
                providerMetadata: {
                  [Q]: {
                    fileId: U.file_id,
                    ...U.index != null ? { index: U.index } : {}
                  }
                }
              });
          }
          break;
        }
        case "function_call": {
          _e = !0, re.push({
            type: "tool-call",
            toolCallId: f.call_id,
            toolName: f.name,
            input: f.arguments,
            providerMetadata: {
              [Q]: {
                itemId: f.id
              }
            }
          });
          break;
        }
        case "web_search_call": {
          re.push({
            type: "tool-call",
            toolCallId: f.id,
            toolName: Ie ?? "web_search",
            input: JSON.stringify({}),
            providerExecuted: !0
          }), re.push({
            type: "tool-result",
            toolCallId: f.id,
            toolName: Ie ?? "web_search",
            result: Jy(f.action),
            providerExecuted: !0
          });
          break;
        }
        case "computer_call": {
          re.push({
            type: "tool-call",
            toolCallId: f.id,
            toolName: "computer_use",
            input: "",
            providerExecuted: !0
          }), re.push({
            type: "tool-result",
            toolCallId: f.id,
            toolName: "computer_use",
            result: {
              type: "computer_use_tool_result",
              status: f.status || "completed"
            },
            providerExecuted: !0
          });
          break;
        }
        case "file_search_call": {
          re.push({
            type: "tool-call",
            toolCallId: f.id,
            toolName: "file_search",
            input: "{}",
            providerExecuted: !0
          }), re.push({
            type: "tool-result",
            toolCallId: f.id,
            toolName: "file_search",
            result: {
              queries: f.queries,
              results: (J = (fe = f.results) == null ? void 0 : fe.map((D) => ({
                attributes: D.attributes,
                fileId: D.file_id,
                filename: D.filename,
                score: D.score,
                text: D.text
              }))) != null ? J : null
            },
            providerExecuted: !0
          });
          break;
        }
        case "code_interpreter_call": {
          re.push({
            type: "tool-call",
            toolCallId: f.id,
            toolName: "code_interpreter",
            input: JSON.stringify({
              code: f.code,
              containerId: f.container_id
            }),
            providerExecuted: !0
          }), re.push({
            type: "tool-result",
            toolCallId: f.id,
            toolName: "code_interpreter",
            result: {
              outputs: f.outputs
            },
            providerExecuted: !0
          });
          break;
        }
      }
    let xe = {
      [Q]: {
        ...ge.id != null ? { responseId: ge.id } : {}
      }
    };
    ae.length > 0 && (xe[Q].logprobs = ae), typeof ge.service_tier == "string" && (xe[Q].serviceTier = ge.service_tier);
    let X = ge.usage;
    return {
      content: re,
      finishReason: Vy({
        finishReason: (Z = ge.incomplete_details) == null ? void 0 : Z.reason,
        hasFunctionCall: _e
      }),
      usage: {
        inputTokens: X.input_tokens,
        outputTokens: X.output_tokens,
        totalTokens: X.input_tokens + X.output_tokens,
        reasoningTokens: (ce = (ve = X.output_tokens_details) == null ? void 0 : ve.reasoning_tokens) != null ? ce : void 0,
        cachedInputTokens: (Ae = (ke = X.input_tokens_details) == null ? void 0 : ke.cached_tokens) != null ? Ae : void 0
      },
      request: { body: ye },
      response: {
        id: ge.id,
        timestamp: new Date(ge.created_at * 1e3),
        modelId: ge.model,
        headers: Ce,
        body: rt
      },
      providerMetadata: xe,
      warnings: He
    };
  }
  async doStream(e) {
    let {
      args: t,
      warnings: n,
      webSearchToolName: o,
      store: r
    } = await this.getArgs(e), { responseHeaders: i, value: a } = await pe({
      url: this.config.url({
        path: "/responses",
        modelId: this.modelId
      }),
      headers: le(this.config.headers(), e.headers),
      body: {
        ...t,
        stream: !0
      },
      failedResponseHandler: bt,
      successfulResponseHandler: Xt(
        T0
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    }), u = this, c = this.config.provider.replace(".responses", ""), d = "unknown", p = {
      inputTokens: void 0,
      outputTokens: void 0,
      totalTokens: void 0
    }, m = [], v = null, g = {}, b = [], x = !1, $ = {}, E;
    return {
      stream: a.pipeThrough(
        new TransformStream({
          start(O) {
            O.enqueue({ type: "stream-start", warnings: n });
          },
          transform(O, y) {
            var B, Y, fe, J, Z, ve, ce, ke, Ae, ye, He, Ie, Re, Q, Ce, ge, rt, re, ae, _e, xe, X;
            if (e.includeRawChunks && y.enqueue({ type: "raw", rawValue: O.rawValue }), !O.success) {
              d = "error", y.enqueue({ type: "error", error: O.error });
              return;
            }
            let f = O.value;
            if (qy(f))
              f.item.type === "function_call" ? (g[f.output_index] = {
                toolName: f.item.name,
                toolCallId: f.item.call_id
              }, y.enqueue({
                type: "tool-input-start",
                id: f.item.call_id,
                toolName: f.item.name
              })) : f.item.type === "web_search_call" ? (g[f.output_index] = {
                toolName: o ?? "web_search",
                toolCallId: f.item.id
              }, y.enqueue({
                type: "tool-input-start",
                id: f.item.id,
                toolName: o ?? "web_search",
                providerExecuted: !0
              }), y.enqueue({
                type: "tool-input-end",
                id: f.item.id
              }), y.enqueue({
                type: "tool-call",
                toolCallId: f.item.id,
                toolName: o ?? "web_search",
                input: JSON.stringify({}),
                providerExecuted: !0
              })) : f.item.type === "computer_call" ? (g[f.output_index] = {
                toolName: "computer_use",
                toolCallId: f.item.id
              }, y.enqueue({
                type: "tool-input-start",
                id: f.item.id,
                toolName: "computer_use",
                providerExecuted: !0
              })) : f.item.type === "code_interpreter_call" ? (g[f.output_index] = {
                toolName: "code_interpreter",
                toolCallId: f.item.id,
                codeInterpreter: {
                  containerId: f.item.container_id
                }
              }, y.enqueue({
                type: "tool-input-start",
                id: f.item.id,
                toolName: "code_interpreter",
                providerExecuted: !0
              }), y.enqueue({
                type: "tool-input-delta",
                id: f.item.id,
                delta: `{"containerId":"${f.item.container_id}","code":"`
              })) : f.item.type === "file_search_call" ? y.enqueue({
                type: "tool-call",
                toolCallId: f.item.id,
                toolName: "file_search",
                input: "{}",
                providerExecuted: !0
              }) : f.item.type === "image_generation_call" ? y.enqueue({
                type: "tool-call",
                toolCallId: f.item.id,
                toolName: "image_generation",
                input: "{}",
                providerExecuted: !0
              }) : f.item.type === "message" ? (b.splice(0, b.length), y.enqueue({
                type: "text-start",
                id: f.item.id,
                providerMetadata: {
                  [c]: {
                    itemId: f.item.id
                  }
                }
              })) : qy(f) && f.item.type === "reasoning" && ($[f.item.id] = {
                encryptedContent: f.item.encrypted_content,
                summaryParts: { 0: "active" }
              }, y.enqueue({
                type: "reasoning-start",
                id: `${f.item.id}:0`,
                providerMetadata: {
                  [c]: {
                    itemId: f.item.id,
                    reasoningEncryptedContent: (B = f.item.encrypted_content) != null ? B : null
                  }
                }
              }));
            else if (A0(f)) {
              if (f.item.type === "message")
                y.enqueue({
                  type: "text-end",
                  id: f.item.id,
                  providerMetadata: {
                    [c]: {
                      itemId: f.item.id,
                      ...b.length > 0 && {
                        annotations: b
                      }
                    }
                  }
                });
              else if (f.item.type === "function_call")
                g[f.output_index] = void 0, x = !0, y.enqueue({
                  type: "tool-input-end",
                  id: f.item.call_id
                }), y.enqueue({
                  type: "tool-call",
                  toolCallId: f.item.call_id,
                  toolName: f.item.name,
                  input: f.item.arguments,
                  providerMetadata: {
                    [c]: {
                      itemId: f.item.id
                    }
                  }
                });
              else if (f.item.type === "web_search_call")
                g[f.output_index] = void 0, y.enqueue({
                  type: "tool-result",
                  toolCallId: f.item.id,
                  toolName: o ?? "web_search",
                  result: Jy(f.item.action),
                  providerExecuted: !0
                });
              else if (f.item.type === "computer_call")
                g[f.output_index] = void 0, y.enqueue({
                  type: "tool-input-end",
                  id: f.item.id
                }), y.enqueue({
                  type: "tool-call",
                  toolCallId: f.item.id,
                  toolName: "computer_use",
                  input: "",
                  providerExecuted: !0
                }), y.enqueue({
                  type: "tool-result",
                  toolCallId: f.item.id,
                  toolName: "computer_use",
                  result: {
                    type: "computer_use_tool_result",
                    status: f.item.status || "completed"
                  },
                  providerExecuted: !0
                });
              else if (f.item.type === "file_search_call")
                g[f.output_index] = void 0, y.enqueue({
                  type: "tool-result",
                  toolCallId: f.item.id,
                  toolName: "file_search",
                  result: {
                    queries: f.item.queries,
                    results: (fe = (Y = f.item.results) == null ? void 0 : Y.map((D) => ({
                      attributes: D.attributes,
                      fileId: D.file_id,
                      filename: D.filename,
                      score: D.score,
                      text: D.text
                    }))) != null ? fe : null
                  },
                  providerExecuted: !0
                });
              else if (f.item.type === "code_interpreter_call")
                g[f.output_index] = void 0, y.enqueue({
                  type: "tool-result",
                  toolCallId: f.item.id,
                  toolName: "code_interpreter",
                  result: {
                    outputs: f.item.outputs
                  },
                  providerExecuted: !0
                });
              else if (f.item.type === "image_generation_call")
                y.enqueue({
                  type: "tool-result",
                  toolCallId: f.item.id,
                  toolName: "image_generation",
                  result: {
                    result: f.item.result
                  },
                  providerExecuted: !0
                });
              else if (f.item.type === "local_shell_call")
                g[f.output_index] = void 0, y.enqueue({
                  type: "tool-call",
                  toolCallId: f.item.call_id,
                  toolName: "local_shell",
                  input: JSON.stringify({
                    action: {
                      type: "exec",
                      command: f.item.action.command,
                      timeoutMs: f.item.action.timeout_ms,
                      user: f.item.action.user,
                      workingDirectory: f.item.action.working_directory,
                      env: f.item.action.env
                    }
                  }),
                  providerMetadata: {
                    [c]: { itemId: f.item.id }
                  }
                });
              else if (f.item.type === "reasoning") {
                let D = $[f.item.id], U = Object.entries(
                  D.summaryParts
                ).filter(
                  ([Nt, dt]) => dt === "active" || dt === "can-conclude"
                ).map(([Nt]) => Nt);
                for (let Nt of U)
                  y.enqueue({
                    type: "reasoning-end",
                    id: `${f.item.id}:${Nt}`,
                    providerMetadata: {
                      [c]: {
                        itemId: f.item.id,
                        reasoningEncryptedContent: (J = f.item.encrypted_content) != null ? J : null
                      }
                    }
                  });
                delete $[f.item.id];
              }
            } else if (D0(f)) {
              let D = g[f.output_index];
              D != null && y.enqueue({
                type: "tool-input-delta",
                id: D.toolCallId,
                delta: f.delta
              });
            } else if (U0(f)) {
              let D = g[f.output_index];
              D != null && y.enqueue({
                type: "tool-input-delta",
                id: D.toolCallId,
                // The delta is code, which is embedding in a JSON string.
                // To escape it, we use JSON.stringify and slice to remove the outer quotes.
                delta: JSON.stringify(f.delta).slice(1, -1)
              });
            } else if (M0(f)) {
              let D = g[f.output_index];
              D != null && (y.enqueue({
                type: "tool-input-delta",
                id: D.toolCallId,
                delta: '"}'
              }), y.enqueue({
                type: "tool-input-end",
                id: D.toolCallId
              }), y.enqueue({
                type: "tool-call",
                toolCallId: D.toolCallId,
                toolName: "code_interpreter",
                input: JSON.stringify({
                  code: f.code,
                  containerId: D.codeInterpreter.containerId
                }),
                providerExecuted: !0
              }));
            } else if (C0(f))
              v = f.response.id, y.enqueue({
                type: "response-metadata",
                id: f.response.id,
                timestamp: new Date(f.response.created_at * 1e3),
                modelId: f.response.model
              });
            else if (N0(f))
              y.enqueue({
                type: "text-delta",
                id: f.item_id,
                delta: f.delta
              }), (ve = (Z = e.providerOptions) == null ? void 0 : Z.openai) != null && ve.logprobs && f.logprobs && m.push(f.logprobs);
            else if (f.type === "response.reasoning_summary_part.added") {
              if (f.summary_index > 0) {
                let D = $[f.item_id];
                D.summaryParts[f.summary_index] = "active";
                for (let U of Object.keys(
                  D.summaryParts
                ))
                  D.summaryParts[U] === "can-conclude" && (y.enqueue({
                    type: "reasoning-end",
                    id: `${f.item_id}:${U}`,
                    providerMetadata: {
                      [c]: { itemId: f.item_id }
                    }
                  }), D.summaryParts[U] = "concluded");
                y.enqueue({
                  type: "reasoning-start",
                  id: `${f.item_id}:${f.summary_index}`,
                  providerMetadata: {
                    [c]: {
                      itemId: f.item_id,
                      reasoningEncryptedContent: (ke = (ce = $[f.item_id]) == null ? void 0 : ce.encryptedContent) != null ? ke : null
                    }
                  }
                });
              }
            } else f.type === "response.reasoning_summary_text.delta" ? y.enqueue({
              type: "reasoning-delta",
              id: `${f.item_id}:${f.summary_index}`,
              delta: f.delta,
              providerMetadata: {
                [c]: {
                  itemId: f.item_id
                }
              }
            }) : f.type === "response.reasoning_summary_part.done" ? r ? (y.enqueue({
              type: "reasoning-end",
              id: `${f.item_id}:${f.summary_index}`,
              providerMetadata: {
                [c]: { itemId: f.item_id }
              }
            }), $[f.item_id].summaryParts[f.summary_index] = "concluded") : $[f.item_id].summaryParts[f.summary_index] = "can-conclude" : R0(f) ? (d = Vy({
              finishReason: (Ae = f.response.incomplete_details) == null ? void 0 : Ae.reason,
              hasFunctionCall: x
            }), p.inputTokens = f.response.usage.input_tokens, p.outputTokens = f.response.usage.output_tokens, p.totalTokens = f.response.usage.input_tokens + f.response.usage.output_tokens, p.reasoningTokens = (He = (ye = f.response.usage.output_tokens_details) == null ? void 0 : ye.reasoning_tokens) != null ? He : void 0, p.cachedInputTokens = (Re = (Ie = f.response.usage.input_tokens_details) == null ? void 0 : Ie.cached_tokens) != null ? Re : void 0, typeof f.response.service_tier == "string" && (E = f.response.service_tier)) : Z0(f) ? (b.push(f.annotation), f.annotation.type === "url_citation" ? y.enqueue({
              type: "source",
              sourceType: "url",
              id: (ge = (Ce = (Q = u.config).generateId) == null ? void 0 : Ce.call(Q)) != null ? ge : We(),
              url: f.annotation.url,
              title: f.annotation.title
            }) : f.annotation.type === "file_citation" && y.enqueue({
              type: "source",
              sourceType: "document",
              id: (ae = (re = (rt = u.config).generateId) == null ? void 0 : re.call(rt)) != null ? ae : We(),
              mediaType: "text/plain",
              title: (xe = (_e = f.annotation.quote) != null ? _e : f.annotation.filename) != null ? xe : "Document",
              filename: (X = f.annotation.filename) != null ? X : f.annotation.file_id,
              ...f.annotation.file_id ? {
                providerMetadata: {
                  [c]: {
                    fileId: f.annotation.file_id
                  }
                }
              } : {}
            })) : L0(f) && y.enqueue({ type: "error", error: f });
          },
          flush(O) {
            let y = {
              [c]: {
                responseId: v
              }
            };
            m.length > 0 && (y[c].logprobs = m), E !== void 0 && (y[c].serviceTier = E), O.enqueue({
              type: "finish",
              finishReason: d,
              usage: p,
              providerMetadata: y
            });
          }
        })
      ),
      request: { body: t },
      response: { headers: i }
    };
  }
};
function N0(e) {
  return e.type === "response.output_text.delta";
}
l(N0, "isTextDeltaChunk");
function A0(e) {
  return e.type === "response.output_item.done";
}
l(A0, "isResponseOutputItemDoneChunk");
function R0(e) {
  return e.type === "response.completed" || e.type === "response.incomplete";
}
l(R0, "isResponseFinishedChunk");
function C0(e) {
  return e.type === "response.created";
}
l(C0, "isResponseCreatedChunk");
function D0(e) {
  return e.type === "response.function_call_arguments.delta";
}
l(D0, "isResponseFunctionCallArgumentsDeltaChunk");
function U0(e) {
  return e.type === "response.code_interpreter_call_code.delta";
}
l(U0, "isResponseCodeInterpreterCallCodeDeltaChunk");
function M0(e) {
  return e.type === "response.code_interpreter_call_code.done";
}
l(M0, "isResponseCodeInterpreterCallCodeDoneChunk");
function qy(e) {
  return e.type === "response.output_item.added";
}
l(qy, "isResponseOutputItemAddedChunk");
function Z0(e) {
  return e.type === "response.output_text.annotation.added";
}
l(Z0, "isResponseAnnotationAddedChunk");
function L0(e) {
  return e.type === "error";
}
l(L0, "isErrorChunk");
function Jy(e) {
  var t;
  switch (e.type) {
    case "search":
      return {
        action: { type: "search", query: (t = e.query) != null ? t : void 0 },
        // include sources when provided by the Responses API (behind include flag)
        ...e.sources != null && { sources: e.sources }
      };
    case "open_page":
      return { action: { type: "openPage", url: e.url } };
    case "find_in_page":
      return {
        action: {
          type: "findInPage",
          url: e.url,
          pattern: e.pattern
        }
      };
  }
}
l(Jy, "mapWebSearchOutput");
var F0 = q(
  () => A(
    s.object({
      instructions: s.string().nullish(),
      speed: s.number().min(0.25).max(4).default(1).nullish()
    })
  )
), V0 = class {
  static {
    l(this, "OpenAISpeechModel");
  }
  constructor(e, t) {
    this.modelId = e, this.config = t, this.specificationVersion = "v2";
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    text: e,
    voice: t = "alloy",
    outputFormat: n = "mp3",
    speed: o,
    instructions: r,
    language: i,
    providerOptions: a
  }) {
    let u = [], c = await Pe({
      provider: "openai",
      providerOptions: a,
      schema: F0
    }), d = {
      model: this.modelId,
      input: e,
      voice: t,
      response_format: "mp3",
      speed: o,
      instructions: r
    };
    if (n && (["mp3", "opus", "aac", "flac", "wav", "pcm"].includes(n) ? d.response_format = n : u.push({
      type: "unsupported-setting",
      setting: "outputFormat",
      details: `Unsupported output format: ${n}. Using mp3 instead.`
    })), c) {
      let p = {};
      for (let m in p) {
        let v = p[m];
        v !== void 0 && (d[m] = v);
      }
    }
    return i && u.push({
      type: "unsupported-setting",
      setting: "language",
      details: `OpenAI speech models do not support language selection. Language parameter "${i}" was ignored.`
    }), {
      requestBody: d,
      warnings: u
    };
  }
  async doGenerate(e) {
    var t, n, o;
    let r = (o = (n = (t = this.config._internal) == null ? void 0 : t.currentDate) == null ? void 0 : n.call(t)) != null ? o : /* @__PURE__ */ new Date(), { requestBody: i, warnings: a } = await this.getArgs(e), {
      value: u,
      responseHeaders: c,
      rawValue: d
    } = await pe({
      url: this.config.url({
        path: "/audio/speech",
        modelId: this.modelId
      }),
      headers: le(this.config.headers(), e.headers),
      body: i,
      failedResponseHandler: bt,
      successfulResponseHandler: Rh(),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    });
    return {
      audio: u,
      warnings: a,
      request: {
        body: JSON.stringify(i)
      },
      response: {
        timestamp: r,
        modelId: this.modelId,
        headers: c,
        body: d
      }
    };
  }
}, q0 = q(
  () => A(
    s.object({
      text: s.string(),
      language: s.string().nullish(),
      duration: s.number().nullish(),
      words: s.array(
        s.object({
          word: s.string(),
          start: s.number(),
          end: s.number()
        })
      ).nullish(),
      segments: s.array(
        s.object({
          id: s.number(),
          seek: s.number(),
          start: s.number(),
          end: s.number(),
          text: s.string(),
          tokens: s.array(s.number()),
          temperature: s.number(),
          avg_logprob: s.number(),
          compression_ratio: s.number(),
          no_speech_prob: s.number()
        })
      ).nullish()
    })
  )
), J0 = q(
  () => A(
    s.object({
      /**
       * Additional information to include in the transcription response.
       */
      include: s.array(s.string()).optional(),
      /**
       * The language of the input audio in ISO-639-1 format.
       */
      language: s.string().optional(),
      /**
       * An optional text to guide the model's style or continue a previous audio segment.
       */
      prompt: s.string().optional(),
      /**
       * The sampling temperature, between 0 and 1.
       * @default 0
       */
      temperature: s.number().min(0).max(1).default(0).optional(),
      /**
       * The timestamp granularities to populate for this transcription.
       * @default ['segment']
       */
      timestampGranularities: s.array(s.enum(["word", "segment"])).default(["segment"]).optional()
    })
  )
), By = {
  afrikaans: "af",
  arabic: "ar",
  armenian: "hy",
  azerbaijani: "az",
  belarusian: "be",
  bosnian: "bs",
  bulgarian: "bg",
  catalan: "ca",
  chinese: "zh",
  croatian: "hr",
  czech: "cs",
  danish: "da",
  dutch: "nl",
  english: "en",
  estonian: "et",
  finnish: "fi",
  french: "fr",
  galician: "gl",
  german: "de",
  greek: "el",
  hebrew: "he",
  hindi: "hi",
  hungarian: "hu",
  icelandic: "is",
  indonesian: "id",
  italian: "it",
  japanese: "ja",
  kannada: "kn",
  kazakh: "kk",
  korean: "ko",
  latvian: "lv",
  lithuanian: "lt",
  macedonian: "mk",
  malay: "ms",
  marathi: "mr",
  maori: "mi",
  nepali: "ne",
  norwegian: "no",
  persian: "fa",
  polish: "pl",
  portuguese: "pt",
  romanian: "ro",
  russian: "ru",
  serbian: "sr",
  slovak: "sk",
  slovenian: "sl",
  spanish: "es",
  swahili: "sw",
  swedish: "sv",
  tagalog: "tl",
  tamil: "ta",
  thai: "th",
  turkish: "tr",
  ukrainian: "uk",
  urdu: "ur",
  vietnamese: "vi",
  welsh: "cy"
}, B0 = class {
  static {
    l(this, "OpenAITranscriptionModel");
  }
  constructor(e, t) {
    this.modelId = e, this.config = t, this.specificationVersion = "v2";
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    audio: e,
    mediaType: t,
    providerOptions: n
  }) {
    let o = [], r = await Pe({
      provider: "openai",
      providerOptions: n,
      schema: J0
    }), i = new FormData(), a = e instanceof Uint8Array ? new Blob([e]) : new Blob([Yt(e)]);
    i.append("model", this.modelId);
    let u = Ph(t);
    if (i.append(
      "file",
      new File([a], "audio", { type: t }),
      `audio.${u}`
    ), r) {
      let c = {
        include: r.include,
        language: r.language,
        prompt: r.prompt,
        // https://platform.openai.com/docs/api-reference/audio/createTranscription#audio_createtranscription-response_format
        // prefer verbose_json to get segments for models that support it
        response_format: [
          "gpt-4o-transcribe",
          "gpt-4o-mini-transcribe"
        ].includes(this.modelId) ? "json" : "verbose_json",
        temperature: r.temperature,
        timestamp_granularities: r.timestampGranularities
      };
      for (let [d, p] of Object.entries(c))
        if (p != null)
          if (Array.isArray(p))
            for (let m of p)
              i.append(`${d}[]`, String(m));
          else
            i.append(d, String(p));
    }
    return {
      formData: i,
      warnings: o
    };
  }
  async doGenerate(e) {
    var t, n, o, r, i, a, u, c;
    let d = (o = (n = (t = this.config._internal) == null ? void 0 : t.currentDate) == null ? void 0 : n.call(t)) != null ? o : /* @__PURE__ */ new Date(), { formData: p, warnings: m } = await this.getArgs(e), {
      value: v,
      responseHeaders: g,
      rawValue: b
    } = await Nh({
      url: this.config.url({
        path: "/audio/transcriptions",
        modelId: this.modelId
      }),
      headers: le(this.config.headers(), e.headers),
      formData: p,
      failedResponseHandler: bt,
      successfulResponseHandler: he(
        q0
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    }), x = v.language != null && v.language in By ? By[v.language] : void 0;
    return {
      text: v.text,
      segments: (u = (a = (r = v.segments) == null ? void 0 : r.map(($) => ({
        text: $.text,
        startSecond: $.start,
        endSecond: $.end
      }))) != null ? a : (i = v.words) == null ? void 0 : i.map(($) => ({
        text: $.word,
        startSecond: $.start,
        endSecond: $.end
      }))) != null ? u : [],
      language: x,
      durationInSeconds: (c = v.duration) != null ? c : void 0,
      warnings: m,
      response: {
        timestamp: d,
        modelId: this.modelId,
        headers: g,
        body: b
      }
    };
  }
}, G0 = "2.0.89";
function W0(e = {}) {
  var t, n;
  let o = (t = ga(
    fr({
      settingValue: e.baseURL,
      environmentVariableName: "OPENAI_BASE_URL"
    })
  )) != null ? t : "https://api.openai.com/v1", r = (n = e.name) != null ? n : "openai", i = /* @__PURE__ */ l(() => ut(
    {
      Authorization: `Bearer ${jh({
        apiKey: e.apiKey,
        environmentVariableName: "OPENAI_API_KEY",
        description: "OpenAI"
      })}`,
      "OpenAI-Organization": e.organization,
      "OpenAI-Project": e.project,
      ...e.headers
    },
    `ai-sdk/openai/${G0}`
  ), "getHeaders"), a = /* @__PURE__ */ l((x) => new VS(x, {
    provider: `${r}.chat`,
    url: /* @__PURE__ */ l(({ path: $ }) => `${o}${$}`, "url"),
    headers: i,
    fetch: e.fetch
  }), "createChatModel"), u = /* @__PURE__ */ l((x) => new GS(x, {
    provider: `${r}.completion`,
    url: /* @__PURE__ */ l(({ path: $ }) => `${o}${$}`, "url"),
    headers: i,
    fetch: e.fetch
  }), "createCompletionModel"), c = /* @__PURE__ */ l((x) => new HS(x, {
    provider: `${r}.embedding`,
    url: /* @__PURE__ */ l(({ path: $ }) => `${o}${$}`, "url"),
    headers: i,
    fetch: e.fetch
  }), "createEmbeddingModel"), d = /* @__PURE__ */ l((x) => new e0(x, {
    provider: `${r}.image`,
    url: /* @__PURE__ */ l(({ path: $ }) => `${o}${$}`, "url"),
    headers: i,
    fetch: e.fetch
  }), "createImageModel"), p = /* @__PURE__ */ l((x) => new B0(x, {
    provider: `${r}.transcription`,
    url: /* @__PURE__ */ l(({ path: $ }) => `${o}${$}`, "url"),
    headers: i,
    fetch: e.fetch
  }), "createTranscriptionModel"), m = /* @__PURE__ */ l((x) => new V0(x, {
    provider: `${r}.speech`,
    url: /* @__PURE__ */ l(({ path: $ }) => `${o}${$}`, "url"),
    headers: i,
    fetch: e.fetch
  }), "createSpeechModel"), v = /* @__PURE__ */ l((x) => {
    if (new.target)
      throw new Error(
        "The OpenAI model function cannot be called with the new keyword."
      );
    return g(x);
  }, "createLanguageModel"), g = /* @__PURE__ */ l((x) => new P0(x, {
    provider: `${r}.responses`,
    url: /* @__PURE__ */ l(({ path: $ }) => `${o}${$}`, "url"),
    headers: i,
    fetch: e.fetch,
    fileIdPrefixes: ["file-"]
  }), "createResponsesModel"), b = /* @__PURE__ */ l(function(x) {
    return v(x);
  }, "provider");
  return b.languageModel = v, b.chat = a, b.completion = u, b.responses = g, b.embedding = c, b.textEmbedding = c, b.textEmbeddingModel = c, b.image = d, b.imageModel = d, b.transcription = p, b.transcriptionModel = p, b.speech = m, b.speechModel = m, b.tools = k0, b;
}
l(W0, "createOpenAI");
var xC = W0();

export {
  s as a,
  UA as b,
  xC as c
};
//# sourceMappingURL=57OLBLOV.js.map
