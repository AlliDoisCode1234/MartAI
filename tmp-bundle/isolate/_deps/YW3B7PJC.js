import {
  a as s,
  c as of,
  d as Xt,
  e as af
} from "./RUVYHBJQ.js";

// node_modules/@vercel/oidc/dist/get-context.js
var Nv = of((o4, Pv) => {
  "use strict";
  var jm = Object.defineProperty, Jk = Object.getOwnPropertyDescriptor, Bk = Object.getOwnPropertyNames, Gk = Object.prototype.hasOwnProperty, Wk = /* @__PURE__ */ s((e, t) => {
    for (var n in t)
      jm(e, n, { get: t[n], enumerable: !0 });
  }, "__export"), Kk = /* @__PURE__ */ s((e, t, n, o) => {
    if (t && typeof t == "object" || typeof t == "function")
      for (let r of Bk(t))
        !Gk.call(e, r) && r !== n && jm(e, r, { get: /* @__PURE__ */ s(() => t[r], "get"), enumerable: !(o = Jk(t, r)) || o.enumerable });
    return e;
  }, "__copyProps"), Hk = /* @__PURE__ */ s((e) => Kk(jm({}, "__esModule", { value: !0 }), e), "__toCommonJS"), Ov = {};
  Wk(Ov, {
    SYMBOL_FOR_REQ_CONTEXT: /* @__PURE__ */ s(() => jv, "SYMBOL_FOR_REQ_CONTEXT"),
    getContext: /* @__PURE__ */ s(() => Xk, "getContext")
  });
  Pv.exports = Hk(Ov);
  var jv = Symbol.for("@vercel/request-context");
  function Xk() {
    return globalThis[jv]?.get?.() ?? {};
  }
  s(Xk, "getContext");
});

// node_modules/@vercel/oidc/dist/index-browser.js
var Nm = of((a4, Rv) => {
  "use strict";
  var Pm = Object.defineProperty, Yk = Object.getOwnPropertyDescriptor, Qk = Object.getOwnPropertyNames, eI = Object.prototype.hasOwnProperty, tI = /* @__PURE__ */ s((e, t) => {
    for (var n in t)
      Pm(e, n, { get: t[n], enumerable: !0 });
  }, "__export"), rI = /* @__PURE__ */ s((e, t, n, o) => {
    if (t && typeof t == "object" || typeof t == "function")
      for (let r of Qk(t))
        !eI.call(e, r) && r !== n && Pm(e, r, { get: /* @__PURE__ */ s(() => t[r], "get"), enumerable: !(o = Yk(t, r)) || o.enumerable });
    return e;
  }, "__copyProps"), nI = /* @__PURE__ */ s((e) => rI(Pm({}, "__esModule", { value: !0 }), e), "__toCommonJS"), Av = {};
  tI(Av, {
    getContext: /* @__PURE__ */ s(() => oI.getContext, "getContext"),
    getVercelOidcToken: /* @__PURE__ */ s(() => iI, "getVercelOidcToken"),
    getVercelOidcTokenSync: /* @__PURE__ */ s(() => aI, "getVercelOidcTokenSync")
  });
  Rv.exports = nI(Av);
  var oI = Nv();
  async function iI() {
    return "";
  }
  s(iI, "getVercelOidcToken");
  function aI() {
    return "";
  }
  s(aI, "getVercelOidcTokenSync");
});

// node_modules/zod/v4/classic/external.js
var l = {};
Xt(l, {
  $brand: () => ci,
  $input: () => Rc,
  $output: () => Ac,
  NEVER: () => ks,
  TimePrecision: () => Mc,
  ZodAny: () => Tp,
  ZodArray: () => jp,
  ZodBase64: () => Na,
  ZodBase64URL: () => Aa,
  ZodBigInt: () => kn,
  ZodBigIntFormat: () => Da,
  ZodBoolean: () => wn,
  ZodCIDRv4: () => ja,
  ZodCIDRv6: () => Pa,
  ZodCUID: () => ka,
  ZodCUID2: () => Ia,
  ZodCatch: () => Qp,
  ZodCodec: () => Ja,
  ZodCustom: () => Uo,
  ZodCustomStringFormat: () => xn,
  ZodDate: () => No,
  ZodDefault: () => Gp,
  ZodDiscriminatedUnion: () => Np,
  ZodE164: () => Ra,
  ZodEmail: () => xa,
  ZodEmoji: () => $a,
  ZodEnum: () => _n,
  ZodError: () => U$,
  ZodExactOptional: () => qp,
  ZodFile: () => Fp,
  ZodFirstPartyTypeKind: () => dm,
  ZodFunction: () => lm,
  ZodGUID: () => zo,
  ZodIPv4: () => Ea,
  ZodIPv6: () => Oa,
  ZodISODate: () => ga,
  ZodISODateTime: () => fa,
  ZodISODuration: () => va,
  ZodISOTime: () => ha,
  ZodIntersection: () => Ap,
  ZodIssueCode: () => Z$,
  ZodJWT: () => Ca,
  ZodKSUID: () => za,
  ZodLazy: () => im,
  ZodLiteral: () => Lp,
  ZodMAC: () => bp,
  ZodMap: () => Mp,
  ZodNaN: () => tm,
  ZodNanoID: () => wa,
  ZodNever: () => Ep,
  ZodNonOptional: () => Va,
  ZodNull: () => Ip,
  ZodNullable: () => Bp,
  ZodNumber: () => $n,
  ZodNumberFormat: () => Dr,
  ZodObject: () => Ro,
  ZodOptional: () => Fa,
  ZodPipe: () => qa,
  ZodPrefault: () => Kp,
  ZodPromise: () => sm,
  ZodReadonly: () => rm,
  ZodRealError: () => ct,
  ZodRecord: () => Do,
  ZodSet: () => Zp,
  ZodString: () => bn,
  ZodStringFormat: () => ze,
  ZodSuccess: () => Yp,
  ZodSymbol: () => wp,
  ZodTemplateLiteral: () => om,
  ZodTransform: () => Vp,
  ZodTuple: () => Cp,
  ZodType: () => ne,
  ZodULID: () => Sa,
  ZodURL: () => Po,
  ZodUUID: () => Ft,
  ZodUndefined: () => kp,
  ZodUnion: () => Co,
  ZodUnknown: () => zp,
  ZodVoid: () => Op,
  ZodXID: () => Ta,
  ZodXor: () => Pp,
  _ZodString: () => ba,
  _default: () => Wp,
  _function: () => Gg,
  any: () => Ig,
  array: () => Ao,
  base64: () => lg,
  base64url: () => ug,
  bigint: () => bg,
  boolean: () => $p,
  catch: () => em,
  check: () => Wg,
  cidrv4: () => ag,
  cidrv6: () => sg,
  clone: () => Ye,
  codec: () => qg,
  coerce: () => pm,
  config: () => Re,
  core: () => er,
  cuid: () => Yf,
  cuid2: () => Qf,
  custom: () => Kg,
  date: () => Tg,
  decode: () => mp,
  decodeAsync: () => gp,
  describe: () => Hg,
  discriminatedUnion: () => Ng,
  e164: () => cg,
  email: () => Ff,
  emoji: () => Hf,
  encode: () => pp,
  encodeAsync: () => fp,
  endsWith: () => ln,
  enum: () => Za,
  exactOptional: () => Jp,
  file: () => Zg,
  flattenError: () => co,
  float32: () => hg,
  float64: () => vg,
  formatError: () => po,
  fromJSONSchema: () => nh,
  function: () => Gg,
  getErrorMap: () => F$,
  globalRegistry: () => Be,
  gt: () => Zt,
  gte: () => Qe,
  guid: () => Vf,
  hash: () => gg,
  hex: () => fg,
  hostname: () => mg,
  httpUrl: () => Kf,
  includes: () => an,
  instanceof: () => Yg,
  int: () => _a,
  int32: () => yg,
  int64: () => xg,
  intersection: () => Rp,
  ipv4: () => ng,
  ipv6: () => ig,
  iso: () => yn,
  json: () => eh,
  jwt: () => dg,
  keyof: () => zg,
  ksuid: () => rg,
  lazy: () => am,
  length: () => Rr,
  literal: () => Mg,
  locales: () => wo,
  looseObject: () => jg,
  looseRecord: () => Rg,
  lowercase: () => nn,
  lt: () => Mt,
  lte: () => vt,
  mac: () => og,
  map: () => Cg,
  maxLength: () => Ar,
  maxSize: () => vr,
  meta: () => Xg,
  mime: () => un,
  minLength: () => Qt,
  minSize: () => Lt,
  multipleOf: () => hr,
  nan: () => Vg,
  nanoid: () => Xf,
  nativeEnum: () => Ug,
  negative: () => ia,
  never: () => Ua,
  nonnegative: () => sa,
  nonoptional: () => Xp,
  nonpositive: () => aa,
  normalize: () => cn,
  null: () => Sp,
  nullable: () => Oo,
  nullish: () => Lg,
  number: () => xp,
  object: () => Eg,
  optional: () => Eo,
  overwrite: () => jt,
  parse: () => up,
  parseAsync: () => cp,
  partialRecord: () => Ag,
  pipe: () => jo,
  positive: () => oa,
  prefault: () => Hp,
  preprocess: () => th,
  prettifyError: () => Cs,
  promise: () => Bg,
  property: () => la,
  readonly: () => nm,
  record: () => Up,
  refine: () => um,
  regex: () => rn,
  regexes: () => kt,
  registry: () => Di,
  safeDecode: () => vp,
  safeDecodeAsync: () => _p,
  safeEncode: () => hp,
  safeEncodeAsync: () => yp,
  safeParse: () => dp,
  safeParseAsync: () => To,
  set: () => Dg,
  setErrorMap: () => L$,
  size: () => Nr,
  slugify: () => fn,
  startsWith: () => sn,
  strictObject: () => Og,
  string: () => ya,
  stringFormat: () => pg,
  stringbool: () => Qg,
  success: () => Fg,
  superRefine: () => cm,
  symbol: () => wg,
  templateLiteral: () => Jg,
  toJSONSchema: () => vn,
  toLowerCase: () => pn,
  toUpperCase: () => mn,
  transform: () => La,
  treeifyError: () => Rs,
  trim: () => dn,
  tuple: () => Dp,
  uint32: () => _g,
  uint64: () => $g,
  ulid: () => eg,
  undefined: () => kg,
  union: () => Ma,
  unknown: () => Cr,
  uppercase: () => on,
  url: () => Wf,
  util: () => j,
  uuid: () => qf,
  uuidv4: () => Jf,
  uuidv6: () => Bf,
  uuidv7: () => Gf,
  void: () => Sg,
  xid: () => tg,
  xor: () => Pg
});

// node_modules/zod/v4/core/index.js
var er = {};
Xt(er, {
  $ZodAny: () => cu,
  $ZodArray: () => gu,
  $ZodAsyncError: () => Ot,
  $ZodBase64: () => eu,
  $ZodBase64URL: () => tu,
  $ZodBigInt: () => Ni,
  $ZodBigIntFormat: () => au,
  $ZodBoolean: () => ho,
  $ZodCIDRv4: () => Xl,
  $ZodCIDRv6: () => Yl,
  $ZodCUID: () => Ml,
  $ZodCUID2: () => Zl,
  $ZodCatch: () => Nu,
  $ZodCheck: () => Oe,
  $ZodCheckBigIntFormat: () => gl,
  $ZodCheckEndsWith: () => Tl,
  $ZodCheckGreaterThan: () => Si,
  $ZodCheckIncludes: () => Il,
  $ZodCheckLengthEquals: () => xl,
  $ZodCheckLessThan: () => Ii,
  $ZodCheckLowerCase: () => wl,
  $ZodCheckMaxLength: () => _l,
  $ZodCheckMaxSize: () => hl,
  $ZodCheckMimeType: () => El,
  $ZodCheckMinLength: () => bl,
  $ZodCheckMinSize: () => vl,
  $ZodCheckMultipleOf: () => ml,
  $ZodCheckNumberFormat: () => fl,
  $ZodCheckOverwrite: () => Ol,
  $ZodCheckProperty: () => zl,
  $ZodCheckRegex: () => $l,
  $ZodCheckSizeEquals: () => yl,
  $ZodCheckStartsWith: () => Sl,
  $ZodCheckStringFormat: () => en,
  $ZodCheckUpperCase: () => kl,
  $ZodCodec: () => yo,
  $ZodCustom: () => Lu,
  $ZodCustomStringFormat: () => ou,
  $ZodDate: () => fu,
  $ZodDefault: () => Eu,
  $ZodDiscriminatedUnion: () => yu,
  $ZodE164: () => ru,
  $ZodEmail: () => Rl,
  $ZodEmoji: () => Dl,
  $ZodEncodeError: () => dr,
  $ZodEnum: () => wu,
  $ZodError: () => uo,
  $ZodExactOptional: () => Tu,
  $ZodFile: () => Iu,
  $ZodFunction: () => Uu,
  $ZodGUID: () => Nl,
  $ZodIPv4: () => Wl,
  $ZodIPv6: () => Kl,
  $ZodISODate: () => Jl,
  $ZodISODateTime: () => ql,
  $ZodISODuration: () => Gl,
  $ZodISOTime: () => Bl,
  $ZodIntersection: () => _u,
  $ZodJWT: () => nu,
  $ZodKSUID: () => Vl,
  $ZodLazy: () => Zu,
  $ZodLiteral: () => ku,
  $ZodMAC: () => Hl,
  $ZodMap: () => xu,
  $ZodNaN: () => Au,
  $ZodNanoID: () => Ul,
  $ZodNever: () => pu,
  $ZodNonOptional: () => ju,
  $ZodNull: () => uu,
  $ZodNullable: () => zu,
  $ZodNumber: () => Pi,
  $ZodNumberFormat: () => iu,
  $ZodObject: () => Nf,
  $ZodObjectJIT: () => hu,
  $ZodOptional: () => Ri,
  $ZodPipe: () => Ru,
  $ZodPrefault: () => Ou,
  $ZodPromise: () => Mu,
  $ZodReadonly: () => Cu,
  $ZodRealError: () => ut,
  $ZodRecord: () => bu,
  $ZodRegistry: () => Ci,
  $ZodSet: () => $u,
  $ZodString: () => Pr,
  $ZodStringFormat: () => Te,
  $ZodSuccess: () => Pu,
  $ZodSymbol: () => su,
  $ZodTemplateLiteral: () => Du,
  $ZodTransform: () => Su,
  $ZodTuple: () => Ai,
  $ZodType: () => ee,
  $ZodULID: () => Ll,
  $ZodURL: () => Cl,
  $ZodUUID: () => Al,
  $ZodUndefined: () => lu,
  $ZodUnion: () => vo,
  $ZodUnknown: () => du,
  $ZodVoid: () => mu,
  $ZodXID: () => Fl,
  $ZodXor: () => vu,
  $brand: () => ci,
  $constructor: () => y,
  $input: () => Rc,
  $output: () => Ac,
  Doc: () => go,
  JSONSchema: () => Zf,
  JSONSchemaGenerator: () => pa,
  NEVER: () => ks,
  TimePrecision: () => Mc,
  _any: () => ad,
  _array: () => md,
  _base64: () => ea,
  _base64url: () => ta,
  _bigint: () => Qc,
  _boolean: () => Xc,
  _catch: () => O$,
  _check: () => Mf,
  _cidrv4: () => Yi,
  _cidrv6: () => Qi,
  _coercedBigint: () => ed,
  _coercedBoolean: () => Yc,
  _coercedDate: () => dd,
  _coercedNumber: () => Jc,
  _coercedString: () => Dc,
  _cuid: () => Ji,
  _cuid2: () => Bi,
  _custom: () => gd,
  _date: () => cd,
  _decode: () => hi,
  _decodeAsync: () => yi,
  _default: () => T$,
  _discriminatedUnion: () => g$,
  _e164: () => ra,
  _email: () => Ui,
  _emoji: () => Vi,
  _encode: () => gi,
  _encodeAsync: () => vi,
  _endsWith: () => ln,
  _enum: () => x$,
  _file: () => fd,
  _float32: () => Gc,
  _float64: () => Wc,
  _gt: () => Zt,
  _gte: () => Qe,
  _guid: () => ko,
  _includes: () => an,
  _int: () => Bc,
  _int32: () => Kc,
  _int64: () => td,
  _intersection: () => h$,
  _ipv4: () => Hi,
  _ipv6: () => Xi,
  _isoDate: () => Lc,
  _isoDateTime: () => Zc,
  _isoDuration: () => Vc,
  _isoTime: () => Fc,
  _jwt: () => na,
  _ksuid: () => Ki,
  _lazy: () => A$,
  _length: () => Rr,
  _literal: () => w$,
  _lowercase: () => nn,
  _lt: () => Mt,
  _lte: () => vt,
  _mac: () => Uc,
  _map: () => _$,
  _max: () => vt,
  _maxLength: () => Ar,
  _maxSize: () => vr,
  _mime: () => un,
  _min: () => Qe,
  _minLength: () => Qt,
  _minSize: () => Lt,
  _multipleOf: () => hr,
  _nan: () => pd,
  _nanoid: () => qi,
  _nativeEnum: () => $$,
  _negative: () => ia,
  _never: () => ld,
  _nonnegative: () => sa,
  _nonoptional: () => z$,
  _nonpositive: () => aa,
  _normalize: () => cn,
  _null: () => id,
  _nullable: () => S$,
  _number: () => qc,
  _optional: () => I$,
  _overwrite: () => jt,
  _parse: () => Hr,
  _parseAsync: () => Xr,
  _pipe: () => j$,
  _positive: () => oa,
  _promise: () => R$,
  _property: () => la,
  _readonly: () => P$,
  _record: () => y$,
  _refine: () => hd,
  _regex: () => rn,
  _safeDecode: () => bi,
  _safeDecodeAsync: () => $i,
  _safeEncode: () => _i,
  _safeEncodeAsync: () => xi,
  _safeParse: () => Yr,
  _safeParseAsync: () => Qr,
  _set: () => b$,
  _size: () => Nr,
  _slugify: () => fn,
  _startsWith: () => sn,
  _string: () => Cc,
  _stringFormat: () => gn,
  _stringbool: () => bd,
  _success: () => E$,
  _superRefine: () => vd,
  _symbol: () => nd,
  _templateLiteral: () => N$,
  _toLowerCase: () => pn,
  _toUpperCase: () => mn,
  _transform: () => k$,
  _trim: () => dn,
  _tuple: () => v$,
  _uint32: () => Hc,
  _uint64: () => rd,
  _ulid: () => Gi,
  _undefined: () => od,
  _union: () => m$,
  _unknown: () => sd,
  _uppercase: () => on,
  _url: () => Io,
  _uuid: () => Mi,
  _uuidv4: () => Zi,
  _uuidv6: () => Li,
  _uuidv7: () => Fi,
  _void: () => ud,
  _xid: () => Wi,
  _xor: () => f$,
  clone: () => Ye,
  config: () => Re,
  createStandardJSONSchemaMethod: () => hn,
  createToJSONSchemaMethod: () => xd,
  decode: () => Ub,
  decodeAsync: () => Zb,
  describe: () => yd,
  encode: () => Db,
  encodeAsync: () => Mb,
  extractDefs: () => _r,
  finalize: () => br,
  flattenError: () => co,
  formatError: () => po,
  globalConfig: () => ro,
  globalRegistry: () => Be,
  initializeContext: () => yr,
  isValidBase64: () => Ql,
  isValidBase64URL: () => Ef,
  isValidJWT: () => Of,
  locales: () => wo,
  meta: () => _d,
  parse: () => mi,
  parseAsync: () => fi,
  prettifyError: () => Cs,
  process: () => Ie,
  regexes: () => kt,
  registry: () => Di,
  safeDecode: () => Fb,
  safeDecodeAsync: () => qb,
  safeEncode: () => Lb,
  safeEncodeAsync: () => Vb,
  safeParse: () => Ds,
  safeParseAsync: () => Us,
  toDotPath: () => df,
  toJSONSchema: () => vn,
  treeifyError: () => Rs,
  util: () => j,
  version: () => jl
});

// node_modules/zod/v4/core/core.js
var ks = Object.freeze({
  status: "aborted"
});
// @__NO_SIDE_EFFECTS__
function y(e, t, n) {
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
    for (let f = 0; f < p.length; f++) {
      let h = p[f];
      h in u || (u[h] = d[h].bind(u));
    }
  }
  s(o, "init");
  let r = n?.Parent ?? Object;
  class i extends r {
    static {
      s(this, "Definition");
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
  return s(a, "_"), Object.defineProperty(a, "init", { value: o }), Object.defineProperty(a, Symbol.hasInstance, {
    value: /* @__PURE__ */ s((u) => n?.Parent && u instanceof n.Parent ? !0 : u?._zod?.traits?.has(e), "value")
  }), Object.defineProperty(a, "name", { value: e }), a;
}
s(y, "$constructor");
var ci = Symbol("zod_brand"), Ot = class extends Error {
  static {
    s(this, "$ZodAsyncError");
  }
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}, dr = class extends Error {
  static {
    s(this, "$ZodEncodeError");
  }
  constructor(t) {
    super(`Encountered unidirectional transform during encode: ${t}`), this.name = "ZodEncodeError";
  }
}, ro = {};
function Re(e) {
  return e && Object.assign(ro, e), ro;
}
s(Re, "config");

// node_modules/zod/v4/core/util.js
var j = {};
Xt(j, {
  BIGINT_FORMAT_RANGES: () => As,
  Class: () => Ss,
  NUMBER_FORMAT_RANGES: () => Ns,
  aborted: () => gr,
  allowsEval: () => Es,
  assert: () => gb,
  assertEqual: () => db,
  assertIs: () => mb,
  assertNever: () => fb,
  assertNotEqual: () => pb,
  assignProp: () => mr,
  base64ToUint8Array: () => lf,
  base64urlToUint8Array: () => Pb,
  cached: () => Wr,
  captureStackTrace: () => pi,
  cleanEnum: () => jb,
  cleanRegex: () => io,
  clone: () => Ye,
  cloneDef: () => vb,
  createTransparentProxy: () => wb,
  defineLazy: () => se,
  esc: () => di,
  escapeRegex: () => wt,
  extend: () => Sb,
  finalizeIssue: () => lt,
  floatSafeRemainder: () => Ts,
  getElementAtPath: () => yb,
  getEnumValues: () => oo,
  getLengthableOrigin: () => lo,
  getParsedType: () => $b,
  getSizableOrigin: () => so,
  hexToUint8Array: () => Ab,
  isObject: () => Or,
  isPlainObject: () => fr,
  issue: () => Kr,
  joinValues: () => k,
  jsonStringifyReplacer: () => Gr,
  merge: () => zb,
  mergeDefs: () => Yt,
  normalizeParams: () => N,
  nullish: () => pr,
  numKeys: () => xb,
  objectClone: () => hb,
  omit: () => Ib,
  optionalKeys: () => Ps,
  parsedType: () => O,
  partial: () => Eb,
  pick: () => kb,
  prefixIssues: () => ht,
  primitiveTypes: () => js,
  promiseAllObject: () => _b,
  propertyKeyTypes: () => ao,
  randomString: () => bb,
  required: () => Ob,
  safeExtend: () => Tb,
  shallowClone: () => Os,
  slugify: () => zs,
  stringifyPrimitive: () => z,
  uint8ArrayToBase64: () => uf,
  uint8ArrayToBase64url: () => Nb,
  uint8ArrayToHex: () => Rb,
  unwrapMessage: () => no
});
function db(e) {
  return e;
}
s(db, "assertEqual");
function pb(e) {
  return e;
}
s(pb, "assertNotEqual");
function mb(e) {
}
s(mb, "assertIs");
function fb(e) {
  throw new Error("Unexpected value in exhaustive check");
}
s(fb, "assertNever");
function gb(e) {
}
s(gb, "assert");
function oo(e) {
  let t = Object.values(e).filter((o) => typeof o == "number");
  return Object.entries(e).filter(([o, r]) => t.indexOf(+o) === -1).map(([o, r]) => r);
}
s(oo, "getEnumValues");
function k(e, t = "|") {
  return e.map((n) => z(n)).join(t);
}
s(k, "joinValues");
function Gr(e, t) {
  return typeof t == "bigint" ? t.toString() : t;
}
s(Gr, "jsonStringifyReplacer");
function Wr(e) {
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
s(Wr, "cached");
function pr(e) {
  return e == null;
}
s(pr, "nullish");
function io(e) {
  let t = e.startsWith("^") ? 1 : 0, n = e.endsWith("$") ? e.length - 1 : e.length;
  return e.slice(t, n);
}
s(io, "cleanRegex");
function Ts(e, t) {
  let n = (e.toString().split(".")[1] || "").length, o = t.toString(), r = (o.split(".")[1] || "").length;
  if (r === 0 && /\d?e-\d?/.test(o)) {
    let c = o.match(/\d?e-(\d?)/);
    c?.[1] && (r = Number.parseInt(c[1]));
  }
  let i = n > r ? n : r, a = Number.parseInt(e.toFixed(i).replace(".", "")), u = Number.parseInt(t.toFixed(i).replace(".", ""));
  return a % u / 10 ** i;
}
s(Ts, "floatSafeRemainder");
var sf = Symbol("evaluating");
function se(e, t, n) {
  let o;
  Object.defineProperty(e, t, {
    get() {
      if (o !== sf)
        return o === void 0 && (o = sf, o = n()), o;
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
s(se, "defineLazy");
function hb(e) {
  return Object.create(Object.getPrototypeOf(e), Object.getOwnPropertyDescriptors(e));
}
s(hb, "objectClone");
function mr(e, t, n) {
  Object.defineProperty(e, t, {
    value: n,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
s(mr, "assignProp");
function Yt(...e) {
  let t = {};
  for (let n of e) {
    let o = Object.getOwnPropertyDescriptors(n);
    Object.assign(t, o);
  }
  return Object.defineProperties({}, t);
}
s(Yt, "mergeDefs");
function vb(e) {
  return Yt(e._zod.def);
}
s(vb, "cloneDef");
function yb(e, t) {
  return t ? t.reduce((n, o) => n?.[o], e) : e;
}
s(yb, "getElementAtPath");
function _b(e) {
  let t = Object.keys(e), n = t.map((o) => e[o]);
  return Promise.all(n).then((o) => {
    let r = {};
    for (let i = 0; i < t.length; i++)
      r[t[i]] = o[i];
    return r;
  });
}
s(_b, "promiseAllObject");
function bb(e = 10) {
  let t = "abcdefghijklmnopqrstuvwxyz", n = "";
  for (let o = 0; o < e; o++)
    n += t[Math.floor(Math.random() * t.length)];
  return n;
}
s(bb, "randomString");
function di(e) {
  return JSON.stringify(e);
}
s(di, "esc");
function zs(e) {
  return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
s(zs, "slugify");
var pi = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {
};
function Or(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
s(Or, "isObject");
var Es = Wr(() => {
  if (typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare"))
    return !1;
  try {
    let e = Function;
    return new e(""), !0;
  } catch {
    return !1;
  }
});
function fr(e) {
  if (Or(e) === !1)
    return !1;
  let t = e.constructor;
  if (t === void 0 || typeof t != "function")
    return !0;
  let n = t.prototype;
  return !(Or(n) === !1 || Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") === !1);
}
s(fr, "isPlainObject");
function Os(e) {
  return fr(e) ? { ...e } : Array.isArray(e) ? [...e] : e;
}
s(Os, "shallowClone");
function xb(e) {
  let t = 0;
  for (let n in e)
    Object.prototype.hasOwnProperty.call(e, n) && t++;
  return t;
}
s(xb, "numKeys");
var $b = /* @__PURE__ */ s((e) => {
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
}, "getParsedType"), ao = /* @__PURE__ */ new Set(["string", "number", "symbol"]), js = /* @__PURE__ */ new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"]);
function wt(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
s(wt, "escapeRegex");
function Ye(e, t, n) {
  let o = new e._zod.constr(t ?? e._zod.def);
  return (!t || n?.parent) && (o._zod.parent = e), o;
}
s(Ye, "clone");
function N(e) {
  let t = e;
  if (!t)
    return {};
  if (typeof t == "string")
    return { error: /* @__PURE__ */ s(() => t, "error") };
  if (t?.message !== void 0) {
    if (t?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    t.error = t.message;
  }
  return delete t.message, typeof t.error == "string" ? { ...t, error: /* @__PURE__ */ s(() => t.error, "error") } : t;
}
s(N, "normalizeParams");
function wb(e) {
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
s(wb, "createTransparentProxy");
function z(e) {
  return typeof e == "bigint" ? e.toString() + "n" : typeof e == "string" ? `"${e}"` : `${e}`;
}
s(z, "stringifyPrimitive");
function Ps(e) {
  return Object.keys(e).filter((t) => e[t]._zod.optin === "optional" && e[t]._zod.optout === "optional");
}
s(Ps, "optionalKeys");
var Ns = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}, As = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function kb(e, t) {
  let n = e._zod.def, o = n.checks;
  if (o && o.length > 0)
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  let i = Yt(e._zod.def, {
    get shape() {
      let a = {};
      for (let u in t) {
        if (!(u in n.shape))
          throw new Error(`Unrecognized key: "${u}"`);
        t[u] && (a[u] = n.shape[u]);
      }
      return mr(this, "shape", a), a;
    },
    checks: []
  });
  return Ye(e, i);
}
s(kb, "pick");
function Ib(e, t) {
  let n = e._zod.def, o = n.checks;
  if (o && o.length > 0)
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  let i = Yt(e._zod.def, {
    get shape() {
      let a = { ...e._zod.def.shape };
      for (let u in t) {
        if (!(u in n.shape))
          throw new Error(`Unrecognized key: "${u}"`);
        t[u] && delete a[u];
      }
      return mr(this, "shape", a), a;
    },
    checks: []
  });
  return Ye(e, i);
}
s(Ib, "omit");
function Sb(e, t) {
  if (!fr(t))
    throw new Error("Invalid input to extend: expected a plain object");
  let n = e._zod.def.checks;
  if (n && n.length > 0) {
    let i = e._zod.def.shape;
    for (let a in t)
      if (Object.getOwnPropertyDescriptor(i, a) !== void 0)
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  let r = Yt(e._zod.def, {
    get shape() {
      let i = { ...e._zod.def.shape, ...t };
      return mr(this, "shape", i), i;
    }
  });
  return Ye(e, r);
}
s(Sb, "extend");
function Tb(e, t) {
  if (!fr(t))
    throw new Error("Invalid input to safeExtend: expected a plain object");
  let n = Yt(e._zod.def, {
    get shape() {
      let o = { ...e._zod.def.shape, ...t };
      return mr(this, "shape", o), o;
    }
  });
  return Ye(e, n);
}
s(Tb, "safeExtend");
function zb(e, t) {
  let n = Yt(e._zod.def, {
    get shape() {
      let o = { ...e._zod.def.shape, ...t._zod.def.shape };
      return mr(this, "shape", o), o;
    },
    get catchall() {
      return t._zod.def.catchall;
    },
    checks: []
    // delete existing checks
  });
  return Ye(e, n);
}
s(zb, "merge");
function Eb(e, t, n) {
  let r = t._zod.def.checks;
  if (r && r.length > 0)
    throw new Error(".partial() cannot be used on object schemas containing refinements");
  let a = Yt(t._zod.def, {
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
      return mr(this, "shape", c), c;
    },
    checks: []
  });
  return Ye(t, a);
}
s(Eb, "partial");
function Ob(e, t, n) {
  let o = Yt(t._zod.def, {
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
      return mr(this, "shape", i), i;
    }
  });
  return Ye(t, o);
}
s(Ob, "required");
function gr(e, t = 0) {
  if (e.aborted === !0)
    return !0;
  for (let n = t; n < e.issues.length; n++)
    if (e.issues[n]?.continue !== !0)
      return !0;
  return !1;
}
s(gr, "aborted");
function ht(e, t) {
  return t.map((n) => {
    var o;
    return (o = n).path ?? (o.path = []), n.path.unshift(e), n;
  });
}
s(ht, "prefixIssues");
function no(e) {
  return typeof e == "string" ? e : e?.message;
}
s(no, "unwrapMessage");
function lt(e, t, n) {
  let o = { ...e, path: e.path ?? [] };
  if (!e.message) {
    let r = no(e.inst?._zod.def?.error?.(e)) ?? no(t?.error?.(e)) ?? no(n.customError?.(e)) ?? no(n.localeError?.(e)) ?? "Invalid input";
    o.message = r;
  }
  return delete o.inst, delete o.continue, t?.reportInput || delete o.input, o;
}
s(lt, "finalizeIssue");
function so(e) {
  return e instanceof Set ? "set" : e instanceof Map ? "map" : e instanceof File ? "file" : "unknown";
}
s(so, "getSizableOrigin");
function lo(e) {
  return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
s(lo, "getLengthableOrigin");
function O(e) {
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
s(O, "parsedType");
function Kr(...e) {
  let [t, n, o] = e;
  return typeof t == "string" ? {
    message: t,
    code: "custom",
    input: n,
    inst: o
  } : { ...t };
}
s(Kr, "issue");
function jb(e) {
  return Object.entries(e).filter(([t, n]) => Number.isNaN(Number.parseInt(t, 10))).map((t) => t[1]);
}
s(jb, "cleanEnum");
function lf(e) {
  let t = atob(e), n = new Uint8Array(t.length);
  for (let o = 0; o < t.length; o++)
    n[o] = t.charCodeAt(o);
  return n;
}
s(lf, "base64ToUint8Array");
function uf(e) {
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += String.fromCharCode(e[n]);
  return btoa(t);
}
s(uf, "uint8ArrayToBase64");
function Pb(e) {
  let t = e.replace(/-/g, "+").replace(/_/g, "/"), n = "=".repeat((4 - t.length % 4) % 4);
  return lf(t + n);
}
s(Pb, "base64urlToUint8Array");
function Nb(e) {
  return uf(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
s(Nb, "uint8ArrayToBase64url");
function Ab(e) {
  let t = e.replace(/^0x/, "");
  if (t.length % 2 !== 0)
    throw new Error("Invalid hex string length");
  let n = new Uint8Array(t.length / 2);
  for (let o = 0; o < t.length; o += 2)
    n[o / 2] = Number.parseInt(t.slice(o, o + 2), 16);
  return n;
}
s(Ab, "hexToUint8Array");
function Rb(e) {
  return Array.from(e).map((t) => t.toString(16).padStart(2, "0")).join("");
}
s(Rb, "uint8ArrayToHex");
var Ss = class {
  static {
    s(this, "Class");
  }
  constructor(...t) {
  }
};

// node_modules/zod/v4/core/errors.js
var cf = /* @__PURE__ */ s((e, t) => {
  e.name = "$ZodError", Object.defineProperty(e, "_zod", {
    value: e._zod,
    enumerable: !1
  }), Object.defineProperty(e, "issues", {
    value: t,
    enumerable: !1
  }), e.message = JSON.stringify(t, Gr, 2), Object.defineProperty(e, "toString", {
    value: /* @__PURE__ */ s(() => e.message, "value"),
    enumerable: !1
  });
}, "initializer"), uo = y("$ZodError", cf), ut = y("$ZodError", cf, { Parent: Error });
function co(e, t = (n) => n.message) {
  let n = {}, o = [];
  for (let r of e.issues)
    r.path.length > 0 ? (n[r.path[0]] = n[r.path[0]] || [], n[r.path[0]].push(t(r))) : o.push(t(r));
  return { formErrors: o, fieldErrors: n };
}
s(co, "flattenError");
function po(e, t = (n) => n.message) {
  let n = { _errors: [] }, o = /* @__PURE__ */ s((r) => {
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
s(po, "formatError");
function Rs(e, t = (n) => n.message) {
  let n = { errors: [] }, o = /* @__PURE__ */ s((r, i = []) => {
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
        let p = n, f = 0;
        for (; f < d.length; ) {
          let h = d[f], m = f === d.length - 1;
          typeof h == "string" ? (p.properties ?? (p.properties = {}), (a = p.properties)[h] ?? (a[h] = { errors: [] }), p = p.properties[h]) : (p.items ?? (p.items = []), (u = p.items)[h] ?? (u[h] = { errors: [] }), p = p.items[h]), m && p.errors.push(t(c)), f++;
        }
      }
  }, "processError");
  return o(e), n;
}
s(Rs, "treeifyError");
function df(e) {
  let t = [], n = e.map((o) => typeof o == "object" ? o.key : o);
  for (let o of n)
    typeof o == "number" ? t.push(`[${o}]`) : typeof o == "symbol" ? t.push(`[${JSON.stringify(String(o))}]`) : /[^\w$]/.test(o) ? t.push(`[${JSON.stringify(o)}]`) : (t.length && t.push("."), t.push(o));
  return t.join("");
}
s(df, "toDotPath");
function Cs(e) {
  let t = [], n = [...e.issues].sort((o, r) => (o.path ?? []).length - (r.path ?? []).length);
  for (let o of n)
    t.push(`\u2716 ${o.message}`), o.path?.length && t.push(`  \u2192 at ${df(o.path)}`);
  return t.join(`
`);
}
s(Cs, "prettifyError");

// node_modules/zod/v4/core/parse.js
var Hr = /* @__PURE__ */ s((e) => (t, n, o, r) => {
  let i = o ? Object.assign(o, { async: !1 }) : { async: !1 }, a = t._zod.run({ value: n, issues: [] }, i);
  if (a instanceof Promise)
    throw new Ot();
  if (a.issues.length) {
    let u = new (r?.Err ?? e)(a.issues.map((c) => lt(c, i, Re())));
    throw pi(u, r?.callee), u;
  }
  return a.value;
}, "_parse"), mi = /* @__PURE__ */ Hr(ut), Xr = /* @__PURE__ */ s((e) => async (t, n, o, r) => {
  let i = o ? Object.assign(o, { async: !0 }) : { async: !0 }, a = t._zod.run({ value: n, issues: [] }, i);
  if (a instanceof Promise && (a = await a), a.issues.length) {
    let u = new (r?.Err ?? e)(a.issues.map((c) => lt(c, i, Re())));
    throw pi(u, r?.callee), u;
  }
  return a.value;
}, "_parseAsync"), fi = /* @__PURE__ */ Xr(ut), Yr = /* @__PURE__ */ s((e) => (t, n, o) => {
  let r = o ? { ...o, async: !1 } : { async: !1 }, i = t._zod.run({ value: n, issues: [] }, r);
  if (i instanceof Promise)
    throw new Ot();
  return i.issues.length ? {
    success: !1,
    error: new (e ?? uo)(i.issues.map((a) => lt(a, r, Re())))
  } : { success: !0, data: i.value };
}, "_safeParse"), Ds = /* @__PURE__ */ Yr(ut), Qr = /* @__PURE__ */ s((e) => async (t, n, o) => {
  let r = o ? Object.assign(o, { async: !0 }) : { async: !0 }, i = t._zod.run({ value: n, issues: [] }, r);
  return i instanceof Promise && (i = await i), i.issues.length ? {
    success: !1,
    error: new e(i.issues.map((a) => lt(a, r, Re())))
  } : { success: !0, data: i.value };
}, "_safeParseAsync"), Us = /* @__PURE__ */ Qr(ut), gi = /* @__PURE__ */ s((e) => (t, n, o) => {
  let r = o ? Object.assign(o, { direction: "backward" }) : { direction: "backward" };
  return Hr(e)(t, n, r);
}, "_encode"), Db = /* @__PURE__ */ gi(ut), hi = /* @__PURE__ */ s((e) => (t, n, o) => Hr(e)(t, n, o), "_decode"), Ub = /* @__PURE__ */ hi(ut), vi = /* @__PURE__ */ s((e) => async (t, n, o) => {
  let r = o ? Object.assign(o, { direction: "backward" }) : { direction: "backward" };
  return Xr(e)(t, n, r);
}, "_encodeAsync"), Mb = /* @__PURE__ */ vi(ut), yi = /* @__PURE__ */ s((e) => async (t, n, o) => Xr(e)(t, n, o), "_decodeAsync"), Zb = /* @__PURE__ */ yi(ut), _i = /* @__PURE__ */ s((e) => (t, n, o) => {
  let r = o ? Object.assign(o, { direction: "backward" }) : { direction: "backward" };
  return Yr(e)(t, n, r);
}, "_safeEncode"), Lb = /* @__PURE__ */ _i(ut), bi = /* @__PURE__ */ s((e) => (t, n, o) => Yr(e)(t, n, o), "_safeDecode"), Fb = /* @__PURE__ */ bi(ut), xi = /* @__PURE__ */ s((e) => async (t, n, o) => {
  let r = o ? Object.assign(o, { direction: "backward" }) : { direction: "backward" };
  return Qr(e)(t, n, r);
}, "_safeEncodeAsync"), Vb = /* @__PURE__ */ xi(ut), $i = /* @__PURE__ */ s((e) => async (t, n, o) => Qr(e)(t, n, o), "_safeDecodeAsync"), qb = /* @__PURE__ */ $i(ut);

// node_modules/zod/v4/core/regexes.js
var kt = {};
Xt(kt, {
  base64: () => el,
  base64url: () => wi,
  bigint: () => al,
  boolean: () => ll,
  browserEmail: () => Yb,
  cidrv4: () => Ys,
  cidrv6: () => Qs,
  cuid: () => Ms,
  cuid2: () => Zs,
  date: () => rl,
  datetime: () => ol,
  domain: () => tx,
  duration: () => Js,
  e164: () => tl,
  email: () => Gs,
  emoji: () => Ws,
  extendedDuration: () => Jb,
  guid: () => Bs,
  hex: () => rx,
  hostname: () => ex,
  html5Email: () => Kb,
  idnEmail: () => Xb,
  integer: () => sl,
  ipv4: () => Ks,
  ipv6: () => Hs,
  ksuid: () => Vs,
  lowercase: () => dl,
  mac: () => Xs,
  md5_base64: () => ox,
  md5_base64url: () => ix,
  md5_hex: () => nx,
  nanoid: () => qs,
  null: () => ul,
  number: () => ki,
  rfc5322Email: () => Hb,
  sha1_base64: () => sx,
  sha1_base64url: () => lx,
  sha1_hex: () => ax,
  sha256_base64: () => cx,
  sha256_base64url: () => dx,
  sha256_hex: () => ux,
  sha384_base64: () => mx,
  sha384_base64url: () => fx,
  sha384_hex: () => px,
  sha512_base64: () => hx,
  sha512_base64url: () => vx,
  sha512_hex: () => gx,
  string: () => il,
  time: () => nl,
  ulid: () => Ls,
  undefined: () => cl,
  unicodeEmail: () => pf,
  uppercase: () => pl,
  uuid: () => jr,
  uuid4: () => Bb,
  uuid6: () => Gb,
  uuid7: () => Wb,
  xid: () => Fs
});
var Ms = /^[cC][^\s-]{8,}$/, Zs = /^[0-9a-z]+$/, Ls = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, Fs = /^[0-9a-vA-V]{20}$/, Vs = /^[A-Za-z0-9]{27}$/, qs = /^[a-zA-Z0-9_-]{21}$/, Js = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, Jb = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Bs = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, jr = /* @__PURE__ */ s((e) => e ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, "uuid"), Bb = /* @__PURE__ */ jr(4), Gb = /* @__PURE__ */ jr(6), Wb = /* @__PURE__ */ jr(7), Gs = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, Kb = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, Hb = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, pf = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u, Xb = pf, Yb = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, Qb = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function Ws() {
  return new RegExp(Qb, "u");
}
s(Ws, "emoji");
var Ks = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Hs = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, Xs = /* @__PURE__ */ s((e) => {
  let t = wt(e ?? ":");
  return new RegExp(`^(?:[0-9A-F]{2}${t}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${t}){5}[0-9a-f]{2}$`);
}, "mac"), Ys = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, Qs = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, el = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, wi = /^[A-Za-z0-9_-]*$/, ex = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/, tx = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, tl = /^\+[1-9]\d{6,14}$/, mf = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", rl = /* @__PURE__ */ new RegExp(`^${mf}$`);
function ff(e) {
  let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
s(ff, "timeSource");
function nl(e) {
  return new RegExp(`^${ff(e)}$`);
}
s(nl, "time");
function ol(e) {
  let t = ff({ precision: e.precision }), n = ["Z"];
  e.local && n.push(""), e.offset && n.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  let o = `${t}(?:${n.join("|")})`;
  return new RegExp(`^${mf}T(?:${o})$`);
}
s(ol, "datetime");
var il = /* @__PURE__ */ s((e) => {
  let t = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ""}}` : "[\\s\\S]*";
  return new RegExp(`^${t}$`);
}, "string"), al = /^-?\d+n?$/, sl = /^-?\d+$/, ki = /^-?\d+(?:\.\d+)?$/, ll = /^(?:true|false)$/i, ul = /^null$/i;
var cl = /^undefined$/i;
var dl = /^[^A-Z]*$/, pl = /^[^a-z]*$/, rx = /^[0-9a-fA-F]*$/;
function mo(e, t) {
  return new RegExp(`^[A-Za-z0-9+/]{${e}}${t}$`);
}
s(mo, "fixedBase64");
function fo(e) {
  return new RegExp(`^[A-Za-z0-9_-]{${e}}$`);
}
s(fo, "fixedBase64url");
var nx = /^[0-9a-fA-F]{32}$/, ox = /* @__PURE__ */ mo(22, "=="), ix = /* @__PURE__ */ fo(22), ax = /^[0-9a-fA-F]{40}$/, sx = /* @__PURE__ */ mo(27, "="), lx = /* @__PURE__ */ fo(27), ux = /^[0-9a-fA-F]{64}$/, cx = /* @__PURE__ */ mo(43, "="), dx = /* @__PURE__ */ fo(43), px = /^[0-9a-fA-F]{96}$/, mx = /* @__PURE__ */ mo(64, ""), fx = /* @__PURE__ */ fo(64), gx = /^[0-9a-fA-F]{128}$/, hx = /* @__PURE__ */ mo(86, "=="), vx = /* @__PURE__ */ fo(86);

// node_modules/zod/v4/core/checks.js
var Oe = /* @__PURE__ */ y("$ZodCheck", (e, t) => {
  var n;
  e._zod ?? (e._zod = {}), e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), hf = {
  number: "number",
  bigint: "bigint",
  object: "date"
}, Ii = /* @__PURE__ */ y("$ZodCheckLessThan", (e, t) => {
  Oe.init(e, t);
  let n = hf[typeof t.value];
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
}), Si = /* @__PURE__ */ y("$ZodCheckGreaterThan", (e, t) => {
  Oe.init(e, t);
  let n = hf[typeof t.value];
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
}), ml = /* @__PURE__ */ y("$ZodCheckMultipleOf", (e, t) => {
  Oe.init(e, t), e._zod.onattach.push((n) => {
    var o;
    (o = n._zod.bag).multipleOf ?? (o.multipleOf = t.value);
  }), e._zod.check = (n) => {
    if (typeof n.value != typeof t.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    (typeof n.value == "bigint" ? n.value % t.value === BigInt(0) : Ts(n.value, t.value) === 0) || n.issues.push({
      origin: typeof n.value,
      code: "not_multiple_of",
      divisor: t.value,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), fl = /* @__PURE__ */ y("$ZodCheckNumberFormat", (e, t) => {
  Oe.init(e, t), t.format = t.format || "float64";
  let n = t.format?.includes("int"), o = n ? "int" : "number", [r, i] = Ns[t.format];
  e._zod.onattach.push((a) => {
    let u = a._zod.bag;
    u.format = t.format, u.minimum = r, u.maximum = i, n && (u.pattern = sl);
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
}), gl = /* @__PURE__ */ y("$ZodCheckBigIntFormat", (e, t) => {
  Oe.init(e, t);
  let [n, o] = As[t.format];
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
}), hl = /* @__PURE__ */ y("$ZodCheckMaxSize", (e, t) => {
  var n;
  Oe.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    let r = o.value;
    return !pr(r) && r.size !== void 0;
  }), e._zod.onattach.push((o) => {
    let r = o._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    t.maximum < r && (o._zod.bag.maximum = t.maximum);
  }), e._zod.check = (o) => {
    let r = o.value;
    r.size <= t.maximum || o.issues.push({
      origin: so(r),
      code: "too_big",
      maximum: t.maximum,
      inclusive: !0,
      input: r,
      inst: e,
      continue: !t.abort
    });
  };
}), vl = /* @__PURE__ */ y("$ZodCheckMinSize", (e, t) => {
  var n;
  Oe.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    let r = o.value;
    return !pr(r) && r.size !== void 0;
  }), e._zod.onattach.push((o) => {
    let r = o._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    t.minimum > r && (o._zod.bag.minimum = t.minimum);
  }), e._zod.check = (o) => {
    let r = o.value;
    r.size >= t.minimum || o.issues.push({
      origin: so(r),
      code: "too_small",
      minimum: t.minimum,
      inclusive: !0,
      input: r,
      inst: e,
      continue: !t.abort
    });
  };
}), yl = /* @__PURE__ */ y("$ZodCheckSizeEquals", (e, t) => {
  var n;
  Oe.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    let r = o.value;
    return !pr(r) && r.size !== void 0;
  }), e._zod.onattach.push((o) => {
    let r = o._zod.bag;
    r.minimum = t.size, r.maximum = t.size, r.size = t.size;
  }), e._zod.check = (o) => {
    let r = o.value, i = r.size;
    if (i === t.size)
      return;
    let a = i > t.size;
    o.issues.push({
      origin: so(r),
      ...a ? { code: "too_big", maximum: t.size } : { code: "too_small", minimum: t.size },
      inclusive: !0,
      exact: !0,
      input: o.value,
      inst: e,
      continue: !t.abort
    });
  };
}), _l = /* @__PURE__ */ y("$ZodCheckMaxLength", (e, t) => {
  var n;
  Oe.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    let r = o.value;
    return !pr(r) && r.length !== void 0;
  }), e._zod.onattach.push((o) => {
    let r = o._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    t.maximum < r && (o._zod.bag.maximum = t.maximum);
  }), e._zod.check = (o) => {
    let r = o.value;
    if (r.length <= t.maximum)
      return;
    let a = lo(r);
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
}), bl = /* @__PURE__ */ y("$ZodCheckMinLength", (e, t) => {
  var n;
  Oe.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    let r = o.value;
    return !pr(r) && r.length !== void 0;
  }), e._zod.onattach.push((o) => {
    let r = o._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    t.minimum > r && (o._zod.bag.minimum = t.minimum);
  }), e._zod.check = (o) => {
    let r = o.value;
    if (r.length >= t.minimum)
      return;
    let a = lo(r);
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
}), xl = /* @__PURE__ */ y("$ZodCheckLengthEquals", (e, t) => {
  var n;
  Oe.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    let r = o.value;
    return !pr(r) && r.length !== void 0;
  }), e._zod.onattach.push((o) => {
    let r = o._zod.bag;
    r.minimum = t.length, r.maximum = t.length, r.length = t.length;
  }), e._zod.check = (o) => {
    let r = o.value, i = r.length;
    if (i === t.length)
      return;
    let a = lo(r), u = i > t.length;
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
}), en = /* @__PURE__ */ y("$ZodCheckStringFormat", (e, t) => {
  var n, o;
  Oe.init(e, t), e._zod.onattach.push((r) => {
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
}), $l = /* @__PURE__ */ y("$ZodCheckRegex", (e, t) => {
  en.init(e, t), e._zod.check = (n) => {
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
}), wl = /* @__PURE__ */ y("$ZodCheckLowerCase", (e, t) => {
  t.pattern ?? (t.pattern = dl), en.init(e, t);
}), kl = /* @__PURE__ */ y("$ZodCheckUpperCase", (e, t) => {
  t.pattern ?? (t.pattern = pl), en.init(e, t);
}), Il = /* @__PURE__ */ y("$ZodCheckIncludes", (e, t) => {
  Oe.init(e, t);
  let n = wt(t.includes), o = new RegExp(typeof t.position == "number" ? `^.{${t.position}}${n}` : n);
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
}), Sl = /* @__PURE__ */ y("$ZodCheckStartsWith", (e, t) => {
  Oe.init(e, t);
  let n = new RegExp(`^${wt(t.prefix)}.*`);
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
}), Tl = /* @__PURE__ */ y("$ZodCheckEndsWith", (e, t) => {
  Oe.init(e, t);
  let n = new RegExp(`.*${wt(t.suffix)}$`);
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
function gf(e, t, n) {
  e.issues.length && t.issues.push(...ht(n, e.issues));
}
s(gf, "handleCheckPropertyResult");
var zl = /* @__PURE__ */ y("$ZodCheckProperty", (e, t) => {
  Oe.init(e, t), e._zod.check = (n) => {
    let o = t.schema._zod.run({
      value: n.value[t.property],
      issues: []
    }, {});
    if (o instanceof Promise)
      return o.then((r) => gf(r, n, t.property));
    gf(o, n, t.property);
  };
}), El = /* @__PURE__ */ y("$ZodCheckMimeType", (e, t) => {
  Oe.init(e, t);
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
}), Ol = /* @__PURE__ */ y("$ZodCheckOverwrite", (e, t) => {
  Oe.init(e, t), e._zod.check = (n) => {
    n.value = t.tx(n.value);
  };
});

// node_modules/zod/v4/core/doc.js
var go = class {
  static {
    s(this, "Doc");
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
var jl = {
  major: 4,
  minor: 3,
  patch: 5
};

// node_modules/zod/v4/core/schemas.js
var ee = /* @__PURE__ */ y("$ZodType", (e, t) => {
  var n;
  e ?? (e = {}), e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = jl;
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
    let r = /* @__PURE__ */ s((a, u, c) => {
      let d = gr(a), p;
      for (let f of u) {
        if (f._zod.def.when) {
          if (!f._zod.def.when(a))
            continue;
        } else if (d)
          continue;
        let h = a.issues.length, m = f._zod.check(a);
        if (m instanceof Promise && c?.async === !1)
          throw new Ot();
        if (p || m instanceof Promise)
          p = (p ?? Promise.resolve()).then(async () => {
            await m, a.issues.length !== h && (d || (d = gr(a, h)));
          });
        else {
          if (a.issues.length === h)
            continue;
          d || (d = gr(a, h));
        }
      }
      return p ? p.then(() => a) : a;
    }, "runChecks"), i = /* @__PURE__ */ s((a, u, c) => {
      if (gr(a))
        return a.aborted = !0, a;
      let d = r(u, o, c);
      if (d instanceof Promise) {
        if (c.async === !1)
          throw new Ot();
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
          throw new Ot();
        return c.then((d) => r(d, o, u));
      }
      return r(c, o, u);
    };
  }
  se(e, "~standard", () => ({
    validate: /* @__PURE__ */ s((r) => {
      try {
        let i = Ds(e, r);
        return i.success ? { value: i.data } : { issues: i.error?.issues };
      } catch {
        return Us(e, r).then((a) => a.success ? { value: a.data } : { issues: a.error?.issues });
      }
    }, "validate"),
    vendor: "zod",
    version: 1
  }));
}), Pr = /* @__PURE__ */ y("$ZodString", (e, t) => {
  ee.init(e, t), e._zod.pattern = [...e?._zod.bag?.patterns ?? []].pop() ?? il(e._zod.bag), e._zod.parse = (n, o) => {
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
}), Te = /* @__PURE__ */ y("$ZodStringFormat", (e, t) => {
  en.init(e, t), Pr.init(e, t);
}), Nl = /* @__PURE__ */ y("$ZodGUID", (e, t) => {
  t.pattern ?? (t.pattern = Bs), Te.init(e, t);
}), Al = /* @__PURE__ */ y("$ZodUUID", (e, t) => {
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
    t.pattern ?? (t.pattern = jr(o));
  } else
    t.pattern ?? (t.pattern = jr());
  Te.init(e, t);
}), Rl = /* @__PURE__ */ y("$ZodEmail", (e, t) => {
  t.pattern ?? (t.pattern = Gs), Te.init(e, t);
}), Cl = /* @__PURE__ */ y("$ZodURL", (e, t) => {
  Te.init(e, t), e._zod.check = (n) => {
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
}), Dl = /* @__PURE__ */ y("$ZodEmoji", (e, t) => {
  t.pattern ?? (t.pattern = Ws()), Te.init(e, t);
}), Ul = /* @__PURE__ */ y("$ZodNanoID", (e, t) => {
  t.pattern ?? (t.pattern = qs), Te.init(e, t);
}), Ml = /* @__PURE__ */ y("$ZodCUID", (e, t) => {
  t.pattern ?? (t.pattern = Ms), Te.init(e, t);
}), Zl = /* @__PURE__ */ y("$ZodCUID2", (e, t) => {
  t.pattern ?? (t.pattern = Zs), Te.init(e, t);
}), Ll = /* @__PURE__ */ y("$ZodULID", (e, t) => {
  t.pattern ?? (t.pattern = Ls), Te.init(e, t);
}), Fl = /* @__PURE__ */ y("$ZodXID", (e, t) => {
  t.pattern ?? (t.pattern = Fs), Te.init(e, t);
}), Vl = /* @__PURE__ */ y("$ZodKSUID", (e, t) => {
  t.pattern ?? (t.pattern = Vs), Te.init(e, t);
}), ql = /* @__PURE__ */ y("$ZodISODateTime", (e, t) => {
  t.pattern ?? (t.pattern = ol(t)), Te.init(e, t);
}), Jl = /* @__PURE__ */ y("$ZodISODate", (e, t) => {
  t.pattern ?? (t.pattern = rl), Te.init(e, t);
}), Bl = /* @__PURE__ */ y("$ZodISOTime", (e, t) => {
  t.pattern ?? (t.pattern = nl(t)), Te.init(e, t);
}), Gl = /* @__PURE__ */ y("$ZodISODuration", (e, t) => {
  t.pattern ?? (t.pattern = Js), Te.init(e, t);
}), Wl = /* @__PURE__ */ y("$ZodIPv4", (e, t) => {
  t.pattern ?? (t.pattern = Ks), Te.init(e, t), e._zod.bag.format = "ipv4";
}), Kl = /* @__PURE__ */ y("$ZodIPv6", (e, t) => {
  t.pattern ?? (t.pattern = Hs), Te.init(e, t), e._zod.bag.format = "ipv6", e._zod.check = (n) => {
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
}), Hl = /* @__PURE__ */ y("$ZodMAC", (e, t) => {
  t.pattern ?? (t.pattern = Xs(t.delimiter)), Te.init(e, t), e._zod.bag.format = "mac";
}), Xl = /* @__PURE__ */ y("$ZodCIDRv4", (e, t) => {
  t.pattern ?? (t.pattern = Ys), Te.init(e, t);
}), Yl = /* @__PURE__ */ y("$ZodCIDRv6", (e, t) => {
  t.pattern ?? (t.pattern = Qs), Te.init(e, t), e._zod.check = (n) => {
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
function Ql(e) {
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
s(Ql, "isValidBase64");
var eu = /* @__PURE__ */ y("$ZodBase64", (e, t) => {
  t.pattern ?? (t.pattern = el), Te.init(e, t), e._zod.bag.contentEncoding = "base64", e._zod.check = (n) => {
    Ql(n.value) || n.issues.push({
      code: "invalid_format",
      format: "base64",
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
});
function Ef(e) {
  if (!wi.test(e))
    return !1;
  let t = e.replace(/[-_]/g, (o) => o === "-" ? "+" : "/"), n = t.padEnd(Math.ceil(t.length / 4) * 4, "=");
  return Ql(n);
}
s(Ef, "isValidBase64URL");
var tu = /* @__PURE__ */ y("$ZodBase64URL", (e, t) => {
  t.pattern ?? (t.pattern = wi), Te.init(e, t), e._zod.bag.contentEncoding = "base64url", e._zod.check = (n) => {
    Ef(n.value) || n.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), ru = /* @__PURE__ */ y("$ZodE164", (e, t) => {
  t.pattern ?? (t.pattern = tl), Te.init(e, t);
});
function Of(e, t = null) {
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
s(Of, "isValidJWT");
var nu = /* @__PURE__ */ y("$ZodJWT", (e, t) => {
  Te.init(e, t), e._zod.check = (n) => {
    Of(n.value, t.alg) || n.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), ou = /* @__PURE__ */ y("$ZodCustomStringFormat", (e, t) => {
  Te.init(e, t), e._zod.check = (n) => {
    t.fn(n.value) || n.issues.push({
      code: "invalid_format",
      format: t.format,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Pi = /* @__PURE__ */ y("$ZodNumber", (e, t) => {
  ee.init(e, t), e._zod.pattern = e._zod.bag.pattern ?? ki, e._zod.parse = (n, o) => {
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
}), iu = /* @__PURE__ */ y("$ZodNumberFormat", (e, t) => {
  fl.init(e, t), Pi.init(e, t);
}), ho = /* @__PURE__ */ y("$ZodBoolean", (e, t) => {
  ee.init(e, t), e._zod.pattern = ll, e._zod.parse = (n, o) => {
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
}), Ni = /* @__PURE__ */ y("$ZodBigInt", (e, t) => {
  ee.init(e, t), e._zod.pattern = al, e._zod.parse = (n, o) => {
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
}), au = /* @__PURE__ */ y("$ZodBigIntFormat", (e, t) => {
  gl.init(e, t), Ni.init(e, t);
}), su = /* @__PURE__ */ y("$ZodSymbol", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    let r = n.value;
    return typeof r == "symbol" || n.issues.push({
      expected: "symbol",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), lu = /* @__PURE__ */ y("$ZodUndefined", (e, t) => {
  ee.init(e, t), e._zod.pattern = cl, e._zod.values = /* @__PURE__ */ new Set([void 0]), e._zod.optin = "optional", e._zod.optout = "optional", e._zod.parse = (n, o) => {
    let r = n.value;
    return typeof r > "u" || n.issues.push({
      expected: "undefined",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), uu = /* @__PURE__ */ y("$ZodNull", (e, t) => {
  ee.init(e, t), e._zod.pattern = ul, e._zod.values = /* @__PURE__ */ new Set([null]), e._zod.parse = (n, o) => {
    let r = n.value;
    return r === null || n.issues.push({
      expected: "null",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), cu = /* @__PURE__ */ y("$ZodAny", (e, t) => {
  ee.init(e, t), e._zod.parse = (n) => n;
}), du = /* @__PURE__ */ y("$ZodUnknown", (e, t) => {
  ee.init(e, t), e._zod.parse = (n) => n;
}), pu = /* @__PURE__ */ y("$ZodNever", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => (n.issues.push({
    expected: "never",
    code: "invalid_type",
    input: n.value,
    inst: e
  }), n);
}), mu = /* @__PURE__ */ y("$ZodVoid", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    let r = n.value;
    return typeof r > "u" || n.issues.push({
      expected: "void",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), fu = /* @__PURE__ */ y("$ZodDate", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
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
function yf(e, t, n) {
  e.issues.length && t.issues.push(...ht(n, e.issues)), t.value[n] = e.value;
}
s(yf, "handleArrayResult");
var gu = /* @__PURE__ */ y("$ZodArray", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
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
      c instanceof Promise ? i.push(c.then((d) => yf(d, n, a))) : yf(c, n, a);
    }
    return i.length ? Promise.all(i).then(() => n) : n;
  };
});
function ji(e, t, n, o, r) {
  if (e.issues.length) {
    if (r && !(n in o))
      return;
    t.issues.push(...ht(n, e.issues));
  }
  e.value === void 0 ? n in o && (t.value[n] = void 0) : t.value[n] = e.value;
}
s(ji, "handlePropertyResult");
function jf(e) {
  let t = Object.keys(e.shape);
  for (let o of t)
    if (!e.shape?.[o]?._zod?.traits?.has("$ZodType"))
      throw new Error(`Invalid element at key "${o}": expected a Zod schema`);
  let n = Ps(e.shape);
  return {
    ...e,
    keys: t,
    keySet: new Set(t),
    numKeys: t.length,
    optionalKeys: new Set(n)
  };
}
s(jf, "normalizeDef");
function Pf(e, t, n, o, r, i) {
  let a = [], u = r.keySet, c = r.catchall._zod, d = c.def.type, p = c.optout === "optional";
  for (let f in t) {
    if (u.has(f))
      continue;
    if (d === "never") {
      a.push(f);
      continue;
    }
    let h = c.run({ value: t[f], issues: [] }, o);
    h instanceof Promise ? e.push(h.then((m) => ji(m, n, f, t, p))) : ji(h, n, f, t, p);
  }
  return a.length && n.issues.push({
    code: "unrecognized_keys",
    keys: a,
    input: t,
    inst: i
  }), e.length ? Promise.all(e).then(() => n) : n;
}
s(Pf, "handleCatchall");
var Nf = /* @__PURE__ */ y("$ZodObject", (e, t) => {
  if (ee.init(e, t), !Object.getOwnPropertyDescriptor(t, "shape")?.get) {
    let u = t.shape;
    Object.defineProperty(t, "shape", {
      get: /* @__PURE__ */ s(() => {
        let c = { ...u };
        return Object.defineProperty(t, "shape", {
          value: c
        }), c;
      }, "get")
    });
  }
  let o = Wr(() => jf(t));
  se(e._zod, "propValues", () => {
    let u = t.shape, c = {};
    for (let d in u) {
      let p = u[d]._zod;
      if (p.values) {
        c[d] ?? (c[d] = /* @__PURE__ */ new Set());
        for (let f of p.values)
          c[d].add(f);
      }
    }
    return c;
  });
  let r = Or, i = t.catchall, a;
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
    let p = [], f = a.shape;
    for (let h of a.keys) {
      let m = f[h], v = m._zod.optout === "optional", b = m._zod.run({ value: d[h], issues: [] }, c);
      b instanceof Promise ? p.push(b.then(($) => ji($, u, h, d, v))) : ji(b, u, h, d, v);
    }
    return i ? Pf(p, d, u, c, o.value, e) : p.length ? Promise.all(p).then(() => u) : u;
  };
}), hu = /* @__PURE__ */ y("$ZodObjectJIT", (e, t) => {
  Nf.init(e, t);
  let n = e._zod.parse, o = Wr(() => jf(t)), r = /* @__PURE__ */ s((h) => {
    let m = new go(["shape", "payload", "ctx"]), v = o.value, b = /* @__PURE__ */ s((_) => {
      let x = di(_);
      return `shape[${x}]._zod.run({ value: input[${x}], issues: [] }, ctx)`;
    }, "parseStr");
    m.write("const input = payload.value;");
    let $ = /* @__PURE__ */ Object.create(null), w = 0;
    for (let _ of v.keys)
      $[_] = `key_${w++}`;
    m.write("const newResult = {};");
    for (let _ of v.keys) {
      let x = $[_], C = di(_), S = h[_]?._zod?.optout === "optional";
      m.write(`const ${x} = ${b(_)};`), S ? m.write(`
        if (${x}.issues.length) {
          if (${C} in input) {
            payload.issues = payload.issues.concat(${x}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${C}, ...iss.path] : [${C}]
            })));
          }
        }
        
        if (${x}.value === undefined) {
          if (${C} in input) {
            newResult[${C}] = undefined;
          }
        } else {
          newResult[${C}] = ${x}.value;
        }
        
      `) : m.write(`
        if (${x}.issues.length) {
          payload.issues = payload.issues.concat(${x}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${C}, ...iss.path] : [${C}]
          })));
        }
        
        if (${x}.value === undefined) {
          if (${C} in input) {
            newResult[${C}] = undefined;
          }
        } else {
          newResult[${C}] = ${x}.value;
        }
        
      `);
    }
    m.write("payload.value = newResult;"), m.write("return payload;");
    let I = m.compile();
    return (_, x) => I(h, _, x);
  }, "generateFastpass"), i, a = Or, u = !ro.jitless, d = u && Es.value, p = t.catchall, f;
  e._zod.parse = (h, m) => {
    f ?? (f = o.value);
    let v = h.value;
    return a(v) ? u && d && m?.async === !1 && m.jitless !== !0 ? (i || (i = r(t.shape)), h = i(h, m), p ? Pf([], v, h, m, f, e) : h) : n(h, m) : (h.issues.push({
      expected: "object",
      code: "invalid_type",
      input: v,
      inst: e
    }), h);
  };
});
function _f(e, t, n, o) {
  for (let i of e)
    if (i.issues.length === 0)
      return t.value = i.value, t;
  let r = e.filter((i) => !gr(i));
  return r.length === 1 ? (t.value = r[0].value, r[0]) : (t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: n,
    errors: e.map((i) => i.issues.map((a) => lt(a, o, Re())))
  }), t);
}
s(_f, "handleUnionResults");
var vo = /* @__PURE__ */ y("$ZodUnion", (e, t) => {
  ee.init(e, t), se(e._zod, "optin", () => t.options.some((r) => r._zod.optin === "optional") ? "optional" : void 0), se(e._zod, "optout", () => t.options.some((r) => r._zod.optout === "optional") ? "optional" : void 0), se(e._zod, "values", () => {
    if (t.options.every((r) => r._zod.values))
      return new Set(t.options.flatMap((r) => Array.from(r._zod.values)));
  }), se(e._zod, "pattern", () => {
    if (t.options.every((r) => r._zod.pattern)) {
      let r = t.options.map((i) => i._zod.pattern);
      return new RegExp(`^(${r.map((i) => io(i.source)).join("|")})$`);
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
    return a ? Promise.all(u).then((c) => _f(c, r, e, i)) : _f(u, r, e, i);
  };
});
function bf(e, t, n, o) {
  let r = e.filter((i) => i.issues.length === 0);
  return r.length === 1 ? (t.value = r[0].value, t) : (r.length === 0 ? t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: n,
    errors: e.map((i) => i.issues.map((a) => lt(a, o, Re())))
  }) : t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: n,
    errors: [],
    inclusive: !1
  }), t);
}
s(bf, "handleExclusiveUnionResults");
var vu = /* @__PURE__ */ y("$ZodXor", (e, t) => {
  vo.init(e, t), t.inclusive = !1;
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
    return a ? Promise.all(u).then((c) => bf(c, r, e, i)) : bf(u, r, e, i);
  };
}), yu = /* @__PURE__ */ y("$ZodDiscriminatedUnion", (e, t) => {
  t.inclusive = !1, vo.init(e, t);
  let n = e._zod.parse;
  se(e._zod, "propValues", () => {
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
  let o = Wr(() => {
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
    if (!Or(a))
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
}), _u = /* @__PURE__ */ y("$ZodIntersection", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    let r = n.value, i = t.left._zod.run({ value: r, issues: [] }, o), a = t.right._zod.run({ value: r, issues: [] }, o);
    return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([c, d]) => xf(n, c, d)) : xf(n, i, a);
  };
});
function Pl(e, t) {
  if (e === t)
    return { valid: !0, data: e };
  if (e instanceof Date && t instanceof Date && +e == +t)
    return { valid: !0, data: e };
  if (fr(e) && fr(t)) {
    let n = Object.keys(t), o = Object.keys(e).filter((i) => n.indexOf(i) !== -1), r = { ...e, ...t };
    for (let i of o) {
      let a = Pl(e[i], t[i]);
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
      let r = e[o], i = t[o], a = Pl(r, i);
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
s(Pl, "mergeValues");
function xf(e, t, n) {
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
  if (i.length && r && e.issues.push({ ...r, keys: i }), gr(e))
    return e;
  let a = Pl(t.value, n.value);
  if (!a.valid)
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(a.mergeErrorPath)}`);
  return e.value = a.data, e;
}
s(xf, "handleIntersectionResults");
var Ai = /* @__PURE__ */ y("$ZodTuple", (e, t) => {
  ee.init(e, t);
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
      let p = i.length > n.length, f = i.length < c - 1;
      if (p || f)
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
      let f = p._zod.run({
        value: i[d],
        issues: []
      }, r);
      f instanceof Promise ? a.push(f.then((h) => Ti(h, o, d))) : Ti(f, o, d);
    }
    if (t.rest) {
      let p = i.slice(n.length);
      for (let f of p) {
        d++;
        let h = t.rest._zod.run({
          value: f,
          issues: []
        }, r);
        h instanceof Promise ? a.push(h.then((m) => Ti(m, o, d))) : Ti(h, o, d);
      }
    }
    return a.length ? Promise.all(a).then(() => o) : o;
  };
});
function Ti(e, t, n) {
  e.issues.length && t.issues.push(...ht(n, e.issues)), t.value[n] = e.value;
}
s(Ti, "handleTupleResult");
var bu = /* @__PURE__ */ y("$ZodRecord", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    let r = n.value;
    if (!fr(r))
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
          p instanceof Promise ? i.push(p.then((f) => {
            f.issues.length && n.issues.push(...ht(d, f.issues)), n.value[d] = f.value;
          })) : (p.issues.length && n.issues.push(...ht(d, p.issues)), n.value[d] = p.value);
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
        if (typeof u == "string" && ki.test(u) && c.issues.length && c.issues.some((f) => f.code === "invalid_type" && f.expected === "number")) {
          let f = t.keyType._zod.run({ value: Number(u), issues: [] }, o);
          if (f instanceof Promise)
            throw new Error("Async schemas not supported in object keys currently");
          f.issues.length === 0 && (c = f);
        }
        if (c.issues.length) {
          t.mode === "loose" ? n.value[u] = r[u] : n.issues.push({
            code: "invalid_key",
            origin: "record",
            issues: c.issues.map((f) => lt(f, o, Re())),
            input: u,
            path: [u],
            inst: e
          });
          continue;
        }
        let p = t.valueType._zod.run({ value: r[u], issues: [] }, o);
        p instanceof Promise ? i.push(p.then((f) => {
          f.issues.length && n.issues.push(...ht(u, f.issues)), n.value[c.value] = f.value;
        })) : (p.issues.length && n.issues.push(...ht(u, p.issues)), n.value[c.value] = p.value);
      }
    }
    return i.length ? Promise.all(i).then(() => n) : n;
  };
}), xu = /* @__PURE__ */ y("$ZodMap", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
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
      c instanceof Promise || d instanceof Promise ? i.push(Promise.all([c, d]).then(([p, f]) => {
        $f(p, f, n, a, r, e, o);
      })) : $f(c, d, n, a, r, e, o);
    }
    return i.length ? Promise.all(i).then(() => n) : n;
  };
});
function $f(e, t, n, o, r, i, a) {
  e.issues.length && (ao.has(typeof o) ? n.issues.push(...ht(o, e.issues)) : n.issues.push({
    code: "invalid_key",
    origin: "map",
    input: r,
    inst: i,
    issues: e.issues.map((u) => lt(u, a, Re()))
  })), t.issues.length && (ao.has(typeof o) ? n.issues.push(...ht(o, t.issues)) : n.issues.push({
    origin: "map",
    code: "invalid_element",
    input: r,
    inst: i,
    key: o,
    issues: t.issues.map((u) => lt(u, a, Re()))
  })), n.value.set(e.value, t.value);
}
s($f, "handleMapResult");
var $u = /* @__PURE__ */ y("$ZodSet", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
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
      u instanceof Promise ? i.push(u.then((c) => wf(c, n))) : wf(u, n);
    }
    return i.length ? Promise.all(i).then(() => n) : n;
  };
});
function wf(e, t) {
  e.issues.length && t.issues.push(...e.issues), t.value.add(e.value);
}
s(wf, "handleSetResult");
var wu = /* @__PURE__ */ y("$ZodEnum", (e, t) => {
  ee.init(e, t);
  let n = oo(t.entries), o = new Set(n);
  e._zod.values = o, e._zod.pattern = new RegExp(`^(${n.filter((r) => ao.has(typeof r)).map((r) => typeof r == "string" ? wt(r) : r.toString()).join("|")})$`), e._zod.parse = (r, i) => {
    let a = r.value;
    return o.has(a) || r.issues.push({
      code: "invalid_value",
      values: n,
      input: a,
      inst: e
    }), r;
  };
}), ku = /* @__PURE__ */ y("$ZodLiteral", (e, t) => {
  if (ee.init(e, t), t.values.length === 0)
    throw new Error("Cannot create literal schema with no valid values");
  let n = new Set(t.values);
  e._zod.values = n, e._zod.pattern = new RegExp(`^(${t.values.map((o) => typeof o == "string" ? wt(o) : o ? wt(o.toString()) : String(o)).join("|")})$`), e._zod.parse = (o, r) => {
    let i = o.value;
    return n.has(i) || o.issues.push({
      code: "invalid_value",
      values: t.values,
      input: i,
      inst: e
    }), o;
  };
}), Iu = /* @__PURE__ */ y("$ZodFile", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    let r = n.value;
    return r instanceof File || n.issues.push({
      expected: "file",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), Su = /* @__PURE__ */ y("$ZodTransform", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      throw new dr(e.constructor.name);
    let r = t.transform(n.value, n);
    if (o.async)
      return (r instanceof Promise ? r : Promise.resolve(r)).then((a) => (n.value = a, n));
    if (r instanceof Promise)
      throw new Ot();
    return n.value = r, n;
  };
});
function kf(e, t) {
  return e.issues.length && t === void 0 ? { issues: [], value: void 0 } : e;
}
s(kf, "handleOptionalResult");
var Ri = /* @__PURE__ */ y("$ZodOptional", (e, t) => {
  ee.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", se(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, void 0]) : void 0), se(e._zod, "pattern", () => {
    let n = t.innerType._zod.pattern;
    return n ? new RegExp(`^(${io(n.source)})?$`) : void 0;
  }), e._zod.parse = (n, o) => {
    if (t.innerType._zod.optin === "optional") {
      let r = t.innerType._zod.run(n, o);
      return r instanceof Promise ? r.then((i) => kf(i, n.value)) : kf(r, n.value);
    }
    return n.value === void 0 ? n : t.innerType._zod.run(n, o);
  };
}), Tu = /* @__PURE__ */ y("$ZodExactOptional", (e, t) => {
  Ri.init(e, t), se(e._zod, "values", () => t.innerType._zod.values), se(e._zod, "pattern", () => t.innerType._zod.pattern), e._zod.parse = (n, o) => t.innerType._zod.run(n, o);
}), zu = /* @__PURE__ */ y("$ZodNullable", (e, t) => {
  ee.init(e, t), se(e._zod, "optin", () => t.innerType._zod.optin), se(e._zod, "optout", () => t.innerType._zod.optout), se(e._zod, "pattern", () => {
    let n = t.innerType._zod.pattern;
    return n ? new RegExp(`^(${io(n.source)}|null)$`) : void 0;
  }), se(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (n, o) => n.value === null ? n : t.innerType._zod.run(n, o);
}), Eu = /* @__PURE__ */ y("$ZodDefault", (e, t) => {
  ee.init(e, t), e._zod.optin = "optional", se(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      return t.innerType._zod.run(n, o);
    if (n.value === void 0)
      return n.value = t.defaultValue, n;
    let r = t.innerType._zod.run(n, o);
    return r instanceof Promise ? r.then((i) => If(i, t)) : If(r, t);
  };
});
function If(e, t) {
  return e.value === void 0 && (e.value = t.defaultValue), e;
}
s(If, "handleDefaultResult");
var Ou = /* @__PURE__ */ y("$ZodPrefault", (e, t) => {
  ee.init(e, t), e._zod.optin = "optional", se(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, o) => (o.direction === "backward" || n.value === void 0 && (n.value = t.defaultValue), t.innerType._zod.run(n, o));
}), ju = /* @__PURE__ */ y("$ZodNonOptional", (e, t) => {
  ee.init(e, t), se(e._zod, "values", () => {
    let n = t.innerType._zod.values;
    return n ? new Set([...n].filter((o) => o !== void 0)) : void 0;
  }), e._zod.parse = (n, o) => {
    let r = t.innerType._zod.run(n, o);
    return r instanceof Promise ? r.then((i) => Sf(i, e)) : Sf(r, e);
  };
});
function Sf(e, t) {
  return !e.issues.length && e.value === void 0 && e.issues.push({
    code: "invalid_type",
    expected: "nonoptional",
    input: e.value,
    inst: t
  }), e;
}
s(Sf, "handleNonOptionalResult");
var Pu = /* @__PURE__ */ y("$ZodSuccess", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      throw new dr("ZodSuccess");
    let r = t.innerType._zod.run(n, o);
    return r instanceof Promise ? r.then((i) => (n.value = i.issues.length === 0, n)) : (n.value = r.issues.length === 0, n);
  };
}), Nu = /* @__PURE__ */ y("$ZodCatch", (e, t) => {
  ee.init(e, t), se(e._zod, "optin", () => t.innerType._zod.optin), se(e._zod, "optout", () => t.innerType._zod.optout), se(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      return t.innerType._zod.run(n, o);
    let r = t.innerType._zod.run(n, o);
    return r instanceof Promise ? r.then((i) => (n.value = i.value, i.issues.length && (n.value = t.catchValue({
      ...n,
      error: {
        issues: i.issues.map((a) => lt(a, o, Re()))
      },
      input: n.value
    }), n.issues = []), n)) : (n.value = r.value, r.issues.length && (n.value = t.catchValue({
      ...n,
      error: {
        issues: r.issues.map((i) => lt(i, o, Re()))
      },
      input: n.value
    }), n.issues = []), n);
  };
}), Au = /* @__PURE__ */ y("$ZodNaN", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => ((typeof n.value != "number" || !Number.isNaN(n.value)) && n.issues.push({
    input: n.value,
    inst: e,
    expected: "nan",
    code: "invalid_type"
  }), n);
}), Ru = /* @__PURE__ */ y("$ZodPipe", (e, t) => {
  ee.init(e, t), se(e._zod, "values", () => t.in._zod.values), se(e._zod, "optin", () => t.in._zod.optin), se(e._zod, "optout", () => t.out._zod.optout), se(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (n, o) => {
    if (o.direction === "backward") {
      let i = t.out._zod.run(n, o);
      return i instanceof Promise ? i.then((a) => zi(a, t.in, o)) : zi(i, t.in, o);
    }
    let r = t.in._zod.run(n, o);
    return r instanceof Promise ? r.then((i) => zi(i, t.out, o)) : zi(r, t.out, o);
  };
});
function zi(e, t, n) {
  return e.issues.length ? (e.aborted = !0, e) : t._zod.run({ value: e.value, issues: e.issues }, n);
}
s(zi, "handlePipeResult");
var yo = /* @__PURE__ */ y("$ZodCodec", (e, t) => {
  ee.init(e, t), se(e._zod, "values", () => t.in._zod.values), se(e._zod, "optin", () => t.in._zod.optin), se(e._zod, "optout", () => t.out._zod.optout), se(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (n, o) => {
    if ((o.direction || "forward") === "forward") {
      let i = t.in._zod.run(n, o);
      return i instanceof Promise ? i.then((a) => Ei(a, t, o)) : Ei(i, t, o);
    } else {
      let i = t.out._zod.run(n, o);
      return i instanceof Promise ? i.then((a) => Ei(a, t, o)) : Ei(i, t, o);
    }
  };
});
function Ei(e, t, n) {
  if (e.issues.length)
    return e.aborted = !0, e;
  if ((n.direction || "forward") === "forward") {
    let r = t.transform(e.value, e);
    return r instanceof Promise ? r.then((i) => Oi(e, i, t.out, n)) : Oi(e, r, t.out, n);
  } else {
    let r = t.reverseTransform(e.value, e);
    return r instanceof Promise ? r.then((i) => Oi(e, i, t.in, n)) : Oi(e, r, t.in, n);
  }
}
s(Ei, "handleCodecAResult");
function Oi(e, t, n, o) {
  return e.issues.length ? (e.aborted = !0, e) : n._zod.run({ value: t, issues: e.issues }, o);
}
s(Oi, "handleCodecTxResult");
var Cu = /* @__PURE__ */ y("$ZodReadonly", (e, t) => {
  ee.init(e, t), se(e._zod, "propValues", () => t.innerType._zod.propValues), se(e._zod, "values", () => t.innerType._zod.values), se(e._zod, "optin", () => t.innerType?._zod?.optin), se(e._zod, "optout", () => t.innerType?._zod?.optout), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      return t.innerType._zod.run(n, o);
    let r = t.innerType._zod.run(n, o);
    return r instanceof Promise ? r.then(Tf) : Tf(r);
  };
});
function Tf(e) {
  return e.value = Object.freeze(e.value), e;
}
s(Tf, "handleReadonlyResult");
var Du = /* @__PURE__ */ y("$ZodTemplateLiteral", (e, t) => {
  ee.init(e, t);
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
    } else if (o === null || js.has(typeof o))
      n.push(wt(`${o}`));
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
}), Uu = /* @__PURE__ */ y("$ZodFunction", (e, t) => (ee.init(e, t), e._def = t, e._zod.def = t, e.implement = (n) => {
  if (typeof n != "function")
    throw new Error("implement() must be called with a function");
  return function(...o) {
    let r = e._def.input ? mi(e._def.input, o) : o, i = Reflect.apply(n, this, r);
    return e._def.output ? mi(e._def.output, i) : i;
  };
}, e.implementAsync = (n) => {
  if (typeof n != "function")
    throw new Error("implementAsync() must be called with a function");
  return async function(...o) {
    let r = e._def.input ? await fi(e._def.input, o) : o, i = await Reflect.apply(n, this, r);
    return e._def.output ? await fi(e._def.output, i) : i;
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
    input: new Ai({
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
}, e)), Mu = /* @__PURE__ */ y("$ZodPromise", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => Promise.resolve(n.value).then((r) => t.innerType._zod.run({ value: r, issues: [] }, o));
}), Zu = /* @__PURE__ */ y("$ZodLazy", (e, t) => {
  ee.init(e, t), se(e._zod, "innerType", () => t.getter()), se(e._zod, "pattern", () => e._zod.innerType?._zod?.pattern), se(e._zod, "propValues", () => e._zod.innerType?._zod?.propValues), se(e._zod, "optin", () => e._zod.innerType?._zod?.optin ?? void 0), se(e._zod, "optout", () => e._zod.innerType?._zod?.optout ?? void 0), e._zod.parse = (n, o) => e._zod.innerType._zod.run(n, o);
}), Lu = /* @__PURE__ */ y("$ZodCustom", (e, t) => {
  Oe.init(e, t), ee.init(e, t), e._zod.parse = (n, o) => n, e._zod.check = (n) => {
    let o = n.value, r = t.fn(o);
    if (r instanceof Promise)
      return r.then((i) => zf(i, n, o, e));
    zf(r, n, o, e);
  };
});
function zf(e, t, n, o) {
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
    o._zod.def.params && (r.params = o._zod.def.params), t.issues.push(Kr(r));
  }
}
s(zf, "handleRefineResult");

// node_modules/zod/v4/locales/index.js
var wo = {};
Xt(wo, {
  ar: () => Fu,
  az: () => Vu,
  be: () => qu,
  bg: () => Ju,
  ca: () => Bu,
  cs: () => Gu,
  da: () => Wu,
  de: () => Ku,
  en: () => _o,
  eo: () => Hu,
  es: () => Xu,
  fa: () => Yu,
  fi: () => Qu,
  fr: () => ec,
  frCA: () => tc,
  he: () => rc,
  hu: () => nc,
  hy: () => oc,
  id: () => ic,
  is: () => ac,
  it: () => sc,
  ja: () => lc,
  ka: () => uc,
  kh: () => cc,
  km: () => bo,
  ko: () => dc,
  lt: () => pc,
  mk: () => mc,
  ms: () => fc,
  nl: () => gc,
  no: () => hc,
  ota: () => vc,
  pl: () => _c,
  ps: () => yc,
  pt: () => bc,
  ru: () => xc,
  sl: () => $c,
  sv: () => wc,
  ta: () => kc,
  th: () => Ic,
  tr: () => Sc,
  ua: () => Tc,
  uk: () => $o,
  ur: () => zc,
  uz: () => Ec,
  vi: () => Oc,
  yo: () => Nc,
  zhCN: () => jc,
  zhTW: () => Pc
});

// node_modules/zod/v4/locales/ar.js
var _x = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "\u062D\u0631\u0641", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
    file: { unit: "\u0628\u0627\u064A\u062A", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
    array: { unit: "\u0639\u0646\u0635\u0631", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
    set: { unit: "\u0639\u0646\u0635\u0631", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 instanceof ${r.expected}\u060C \u0648\u0644\u0643\u0646 \u062A\u0645 \u0625\u062F\u062E\u0627\u0644 ${u}` : `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 ${i}\u060C \u0648\u0644\u0643\u0646 \u062A\u0645 \u0625\u062F\u062E\u0627\u0644 ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 ${z(r.values[0])}` : `\u0627\u062E\u062A\u064A\u0627\u0631 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062A\u0648\u0642\u0639 \u0627\u0646\u062A\u0642\u0627\u0621 \u0623\u062D\u062F \u0647\u0630\u0647 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A: ${k(r.values, "|")}`;
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
        return `\u0645\u0639\u0631\u0641${r.keys.length > 1 ? "\u0627\u062A" : ""} \u063A\u0631\u064A\u0628${r.keys.length > 1 ? "\u0629" : ""}: ${k(r.keys, "\u060C ")}`;
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
function Fu() {
  return {
    localeError: _x()
  };
}
s(Fu, "default");

// node_modules/zod/v4/locales/az.js
var bx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "simvol", verb: "olmal\u0131d\u0131r" },
    file: { unit: "bayt", verb: "olmal\u0131d\u0131r" },
    array: { unit: "element", verb: "olmal\u0131d\u0131r" },
    set: { unit: "element", verb: "olmal\u0131d\u0131r" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n instanceof ${r.expected}, daxil olan ${u}` : `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n ${i}, daxil olan ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n ${z(r.values[0])}` : `Yanl\u0131\u015F se\xE7im: a\u015Fa\u011F\u0131dak\u0131lardan biri olmal\u0131d\u0131r: ${k(r.values, "|")}`;
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
        return `Tan\u0131nmayan a\xE7ar${r.keys.length > 1 ? "lar" : ""}: ${k(r.keys, ", ")}`;
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
function Vu() {
  return {
    localeError: bx()
  };
}
s(Vu, "default");

// node_modules/zod/v4/locales/be.js
function Af(e, t, n, o) {
  let r = Math.abs(e), i = r % 10, a = r % 100;
  return a >= 11 && a <= 19 ? o : i === 1 ? t : i >= 2 && i <= 4 ? n : o;
}
s(Af, "getBelarusianPlural");
var xx = /* @__PURE__ */ s(() => {
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
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u045E\u0441\u044F instanceof ${r.expected}, \u0430\u0442\u0440\u044B\u043C\u0430\u043D\u0430 ${u}` : `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u045E\u0441\u044F ${i}, \u0430\u0442\u0440\u044B\u043C\u0430\u043D\u0430 ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F ${z(r.values[0])}` : `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0432\u0430\u0440\u044B\u044F\u043D\u0442: \u0447\u0430\u043A\u0430\u045E\u0441\u044F \u0430\u0434\u0437\u0456\u043D \u0437 ${k(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        if (a) {
          let u = Number(r.maximum), c = Af(u, a.unit.one, a.unit.few, a.unit.many);
          return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u0432\u044F\u043B\u0456\u043A\u0456: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${r.origin ?? "\u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435"} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 ${a.verb} ${i}${r.maximum.toString()} ${c}`;
        }
        return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u0432\u044F\u043B\u0456\u043A\u0456: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${r.origin ?? "\u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435"} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 \u0431\u044B\u0446\u044C ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        if (a) {
          let u = Number(r.minimum), c = Af(u, a.unit.one, a.unit.few, a.unit.many);
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
        return `\u041D\u0435\u0440\u0430\u0441\u043F\u0430\u0437\u043D\u0430\u043D\u044B ${r.keys.length > 1 ? "\u043A\u043B\u044E\u0447\u044B" : "\u043A\u043B\u044E\u0447"}: ${k(r.keys, ", ")}`;
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
function qu() {
  return {
    localeError: xx()
  };
}
s(qu, "default");

// node_modules/zod/v4/locales/bg.js
var $x = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "\u0441\u0438\u043C\u0432\u043E\u043B\u0430", verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430" },
    file: { unit: "\u0431\u0430\u0439\u0442\u0430", verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430" },
    array: { unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430", verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430" },
    set: { unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430", verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D instanceof ${r.expected}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D ${u}` : `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D ${i}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D ${z(r.values[0])}` : `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430 \u043E\u043F\u0446\u0438\u044F: \u043E\u0447\u0430\u043A\u0432\u0430\u043D\u043E \u0435\u0434\u043D\u043E \u043E\u0442 ${k(r.values, "|")}`;
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
        return `\u041D\u0435\u0440\u0430\u0437\u043F\u043E\u0437\u043D\u0430\u0442${r.keys.length > 1 ? "\u0438" : ""} \u043A\u043B\u044E\u0447${r.keys.length > 1 ? "\u043E\u0432\u0435" : ""}: ${k(r.keys, ", ")}`;
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
function Ju() {
  return {
    localeError: $x()
  };
}
s(Ju, "default");

// node_modules/zod/v4/locales/ca.js
var wx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "car\xE0cters", verb: "contenir" },
    file: { unit: "bytes", verb: "contenir" },
    array: { unit: "elements", verb: "contenir" },
    set: { unit: "elements", verb: "contenir" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Tipus inv\xE0lid: s'esperava instanceof ${r.expected}, s'ha rebut ${u}` : `Tipus inv\xE0lid: s'esperava ${i}, s'ha rebut ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Valor inv\xE0lid: s'esperava ${z(r.values[0])}` : `Opci\xF3 inv\xE0lida: s'esperava una de ${k(r.values, " o ")}`;
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
        return `Clau${r.keys.length > 1 ? "s" : ""} no reconeguda${r.keys.length > 1 ? "s" : ""}: ${k(r.keys, ", ")}`;
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
function Bu() {
  return {
    localeError: wx()
  };
}
s(Bu, "default");

// node_modules/zod/v4/locales/cs.js
var kx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "znak\u016F", verb: "m\xEDt" },
    file: { unit: "bajt\u016F", verb: "m\xEDt" },
    array: { unit: "prvk\u016F", verb: "m\xEDt" },
    set: { unit: "prvk\u016F", verb: "m\xEDt" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no instanceof ${r.expected}, obdr\u017Eeno ${u}` : `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no ${i}, obdr\u017Eeno ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no ${z(r.values[0])}` : `Neplatn\xE1 mo\u017Enost: o\u010Dek\xE1v\xE1na jedna z hodnot ${k(r.values, "|")}`;
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
        return `Nezn\xE1m\xE9 kl\xED\u010De: ${k(r.keys, ", ")}`;
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
function Gu() {
  return {
    localeError: kx()
  };
}
s(Gu, "default");

// node_modules/zod/v4/locales/da.js
var Ix = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "tegn", verb: "havde" },
    file: { unit: "bytes", verb: "havde" },
    array: { unit: "elementer", verb: "indeholdt" },
    set: { unit: "elementer", verb: "indeholdt" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ugyldigt input: forventede instanceof ${r.expected}, fik ${u}` : `Ugyldigt input: forventede ${i}, fik ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ugyldig v\xE6rdi: forventede ${z(r.values[0])}` : `Ugyldigt valg: forventede en af f\xF8lgende ${k(r.values, "|")}`;
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
        return `${r.keys.length > 1 ? "Ukendte n\xF8gler" : "Ukendt n\xF8gle"}: ${k(r.keys, ", ")}`;
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
function Wu() {
  return {
    localeError: Ix()
  };
}
s(Wu, "default");

// node_modules/zod/v4/locales/de.js
var Sx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "Zeichen", verb: "zu haben" },
    file: { unit: "Bytes", verb: "zu haben" },
    array: { unit: "Elemente", verb: "zu haben" },
    set: { unit: "Elemente", verb: "zu haben" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ung\xFCltige Eingabe: erwartet instanceof ${r.expected}, erhalten ${u}` : `Ung\xFCltige Eingabe: erwartet ${i}, erhalten ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ung\xFCltige Eingabe: erwartet ${z(r.values[0])}` : `Ung\xFCltige Option: erwartet eine von ${k(r.values, "|")}`;
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
        return `${r.keys.length > 1 ? "Unbekannte Schl\xFCssel" : "Unbekannter Schl\xFCssel"}: ${k(r.keys, ", ")}`;
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
function Ku() {
  return {
    localeError: Sx()
  };
}
s(Ku, "default");

// node_modules/zod/v4/locales/en.js
var Tx = /* @__PURE__ */ s(() => {
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
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return `Invalid input: expected ${i}, received ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Invalid input: expected ${z(r.values[0])}` : `Invalid option: expected one of ${k(r.values, "|")}`;
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
        return `Unrecognized key${r.keys.length > 1 ? "s" : ""}: ${k(r.keys, ", ")}`;
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
function _o() {
  return {
    localeError: Tx()
  };
}
s(_o, "default");

// node_modules/zod/v4/locales/eo.js
var zx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "karaktrojn", verb: "havi" },
    file: { unit: "bajtojn", verb: "havi" },
    array: { unit: "elementojn", verb: "havi" },
    set: { unit: "elementojn", verb: "havi" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Nevalida enigo: atendi\u011Dis instanceof ${r.expected}, ricevi\u011Dis ${u}` : `Nevalida enigo: atendi\u011Dis ${i}, ricevi\u011Dis ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Nevalida enigo: atendi\u011Dis ${z(r.values[0])}` : `Nevalida opcio: atendi\u011Dis unu el ${k(r.values, "|")}`;
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
        return `Nekonata${r.keys.length > 1 ? "j" : ""} \u015Dlosilo${r.keys.length > 1 ? "j" : ""}: ${k(r.keys, ", ")}`;
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
function Hu() {
  return {
    localeError: zx()
  };
}
s(Hu, "default");

// node_modules/zod/v4/locales/es.js
var Ex = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "caracteres", verb: "tener" },
    file: { unit: "bytes", verb: "tener" },
    array: { unit: "elementos", verb: "tener" },
    set: { unit: "elementos", verb: "tener" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Entrada inv\xE1lida: se esperaba instanceof ${r.expected}, recibido ${u}` : `Entrada inv\xE1lida: se esperaba ${i}, recibido ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Entrada inv\xE1lida: se esperaba ${z(r.values[0])}` : `Opci\xF3n inv\xE1lida: se esperaba una de ${k(r.values, "|")}`;
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
        return `Llave${r.keys.length > 1 ? "s" : ""} desconocida${r.keys.length > 1 ? "s" : ""}: ${k(r.keys, ", ")}`;
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
function Xu() {
  return {
    localeError: Ex()
  };
}
s(Xu, "default");

// node_modules/zod/v4/locales/fa.js
var Ox = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "\u06A9\u0627\u0631\u0627\u06A9\u062A\u0631", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" },
    file: { unit: "\u0628\u0627\u06CC\u062A", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" },
    array: { unit: "\u0622\u06CC\u062A\u0645", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" },
    set: { unit: "\u0622\u06CC\u062A\u0645", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A instanceof ${r.expected} \u0645\u06CC\u200C\u0628\u0648\u062F\u060C ${u} \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F` : `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A ${i} \u0645\u06CC\u200C\u0628\u0648\u062F\u060C ${u} \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A ${z(r.values[0])} \u0645\u06CC\u200C\u0628\u0648\u062F` : `\u06AF\u0632\u06CC\u0646\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A \u06CC\u06A9\u06CC \u0627\u0632 ${k(r.values, "|")} \u0645\u06CC\u200C\u0628\u0648\u062F`;
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
        return `\u06A9\u0644\u06CC\u062F${r.keys.length > 1 ? "\u0647\u0627\u06CC" : ""} \u0646\u0627\u0634\u0646\u0627\u0633: ${k(r.keys, ", ")}`;
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
function Yu() {
  return {
    localeError: Ox()
  };
}
s(Yu, "default");

// node_modules/zod/v4/locales/fi.js
var jx = /* @__PURE__ */ s(() => {
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
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Virheellinen tyyppi: odotettiin instanceof ${r.expected}, oli ${u}` : `Virheellinen tyyppi: odotettiin ${i}, oli ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Virheellinen sy\xF6te: t\xE4ytyy olla ${z(r.values[0])}` : `Virheellinen valinta: t\xE4ytyy olla yksi seuraavista: ${k(r.values, "|")}`;
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
        return `${r.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${k(r.keys, ", ")}`;
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
function Qu() {
  return {
    localeError: jx()
  };
}
s(Qu, "default");

// node_modules/zod/v4/locales/fr.js
var Px = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "caract\xE8res", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "\xE9l\xE9ments", verb: "avoir" },
    set: { unit: "\xE9l\xE9ments", verb: "avoir" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Entr\xE9e invalide : instanceof ${r.expected} attendu, ${u} re\xE7u` : `Entr\xE9e invalide : ${i} attendu, ${u} re\xE7u`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Entr\xE9e invalide : ${z(r.values[0])} attendu` : `Option invalide : une valeur parmi ${k(r.values, "|")} attendue`;
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
        return `Cl\xE9${r.keys.length > 1 ? "s" : ""} non reconnue${r.keys.length > 1 ? "s" : ""} : ${k(r.keys, ", ")}`;
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
function ec() {
  return {
    localeError: Px()
  };
}
s(ec, "default");

// node_modules/zod/v4/locales/fr-CA.js
var Nx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "caract\xE8res", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "\xE9l\xE9ments", verb: "avoir" },
    set: { unit: "\xE9l\xE9ments", verb: "avoir" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Entr\xE9e invalide : attendu instanceof ${r.expected}, re\xE7u ${u}` : `Entr\xE9e invalide : attendu ${i}, re\xE7u ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Entr\xE9e invalide : attendu ${z(r.values[0])}` : `Option invalide : attendu l'une des valeurs suivantes ${k(r.values, "|")}`;
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
        return `Cl\xE9${r.keys.length > 1 ? "s" : ""} non reconnue${r.keys.length > 1 ? "s" : ""} : ${k(r.keys, ", ")}`;
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
function tc() {
  return {
    localeError: Nx()
  };
}
s(tc, "default");

// node_modules/zod/v4/locales/he.js
var Ax = /* @__PURE__ */ s(() => {
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
  }, n = /* @__PURE__ */ s((d) => d ? e[d] : void 0, "typeEntry"), o = /* @__PURE__ */ s((d) => {
    let p = n(d);
    return p ? p.label : d ?? e.unknown.label;
  }, "typeLabel"), r = /* @__PURE__ */ s((d) => `\u05D4${o(d)}`, "withDefinite"), i = /* @__PURE__ */ s((d) => (n(d)?.gender ?? "m") === "f" ? "\u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05D9\u05D5\u05EA" : "\u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA", "verbFor"), a = /* @__PURE__ */ s((d) => d ? t[d] ?? null : null, "getSizing"), u = {
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
        let p = d.expected, f = c[p ?? ""] ?? o(p), h = O(d.input), m = c[h] ?? e[h]?.label ?? h;
        return /^[A-Z]/.test(d.expected) ? `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA instanceof ${d.expected}, \u05D4\u05EA\u05E7\u05D1\u05DC ${m}` : `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${f}, \u05D4\u05EA\u05E7\u05D1\u05DC ${m}`;
      }
      case "invalid_value": {
        if (d.values.length === 1)
          return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05E2\u05E8\u05DA \u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05D5\u05EA ${z(d.values[0])}`;
        let p = d.values.map((m) => z(m));
        if (d.values.length === 2)
          return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05D4\u05DF ${p[0]} \u05D0\u05D5 ${p[1]}`;
        let f = p[p.length - 1];
        return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05D4\u05DF ${p.slice(0, -1).join(", ")} \u05D0\u05D5 ${f}`;
      }
      case "too_big": {
        let p = a(d.origin), f = r(d.origin ?? "value");
        if (d.origin === "string")
          return `${p?.longLabel ?? "\u05D0\u05E8\u05D5\u05DA"} \u05DE\u05D3\u05D9: ${f} \u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05DB\u05D9\u05DC ${d.maximum.toString()} ${p?.unit ?? ""} ${d.inclusive ? "\u05D0\u05D5 \u05E4\u05D7\u05D5\u05EA" : "\u05DC\u05DB\u05DC \u05D4\u05D9\u05D5\u05EA\u05E8"}`.trim();
        if (d.origin === "number") {
          let v = d.inclusive ? `\u05E7\u05D8\u05DF \u05D0\u05D5 \u05E9\u05D5\u05D5\u05D4 \u05DC-${d.maximum}` : `\u05E7\u05D8\u05DF \u05DE-${d.maximum}`;
          return `\u05D2\u05D3\u05D5\u05DC \u05DE\u05D3\u05D9: ${f} \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${v}`;
        }
        if (d.origin === "array" || d.origin === "set") {
          let v = d.origin === "set" ? "\u05E6\u05E8\u05D9\u05DB\u05D4" : "\u05E6\u05E8\u05D9\u05DA", b = d.inclusive ? `${d.maximum} ${p?.unit ?? ""} \u05D0\u05D5 \u05E4\u05D7\u05D5\u05EA` : `\u05E4\u05D7\u05D5\u05EA \u05DE-${d.maximum} ${p?.unit ?? ""}`;
          return `\u05D2\u05D3\u05D5\u05DC \u05DE\u05D3\u05D9: ${f} ${v} \u05DC\u05D4\u05DB\u05D9\u05DC ${b}`.trim();
        }
        let h = d.inclusive ? "<=" : "<", m = i(d.origin ?? "value");
        return p?.unit ? `${p.longLabel} \u05DE\u05D3\u05D9: ${f} ${m} ${h}${d.maximum.toString()} ${p.unit}` : `${p?.longLabel ?? "\u05D2\u05D3\u05D5\u05DC"} \u05DE\u05D3\u05D9: ${f} ${m} ${h}${d.maximum.toString()}`;
      }
      case "too_small": {
        let p = a(d.origin), f = r(d.origin ?? "value");
        if (d.origin === "string")
          return `${p?.shortLabel ?? "\u05E7\u05E6\u05E8"} \u05DE\u05D3\u05D9: ${f} \u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05DB\u05D9\u05DC ${d.minimum.toString()} ${p?.unit ?? ""} ${d.inclusive ? "\u05D0\u05D5 \u05D9\u05D5\u05EA\u05E8" : "\u05DC\u05E4\u05D7\u05D5\u05EA"}`.trim();
        if (d.origin === "number") {
          let v = d.inclusive ? `\u05D2\u05D3\u05D5\u05DC \u05D0\u05D5 \u05E9\u05D5\u05D5\u05D4 \u05DC-${d.minimum}` : `\u05D2\u05D3\u05D5\u05DC \u05DE-${d.minimum}`;
          return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${f} \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${v}`;
        }
        if (d.origin === "array" || d.origin === "set") {
          let v = d.origin === "set" ? "\u05E6\u05E8\u05D9\u05DB\u05D4" : "\u05E6\u05E8\u05D9\u05DA";
          if (d.minimum === 1 && d.inclusive) {
            let $ = (d.origin === "set", "\u05DC\u05E4\u05D7\u05D5\u05EA \u05E4\u05E8\u05D9\u05D8 \u05D0\u05D7\u05D3");
            return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${f} ${v} \u05DC\u05D4\u05DB\u05D9\u05DC ${$}`;
          }
          let b = d.inclusive ? `${d.minimum} ${p?.unit ?? ""} \u05D0\u05D5 \u05D9\u05D5\u05EA\u05E8` : `\u05D9\u05D5\u05EA\u05E8 \u05DE-${d.minimum} ${p?.unit ?? ""}`;
          return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${f} ${v} \u05DC\u05D4\u05DB\u05D9\u05DC ${b}`.trim();
        }
        let h = d.inclusive ? ">=" : ">", m = i(d.origin ?? "value");
        return p?.unit ? `${p.shortLabel} \u05DE\u05D3\u05D9: ${f} ${m} ${h}${d.minimum.toString()} ${p.unit}` : `${p?.shortLabel ?? "\u05E7\u05D8\u05DF"} \u05DE\u05D3\u05D9: ${f} ${m} ${h}${d.minimum.toString()}`;
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
        let f = u[p.format], h = f?.label ?? p.format, v = (f?.gender ?? "m") === "f" ? "\u05EA\u05E7\u05D9\u05E0\u05D4" : "\u05EA\u05E7\u05D9\u05DF";
        return `${h} \u05DC\u05D0 ${v}`;
      }
      case "not_multiple_of":
        return `\u05DE\u05E1\u05E4\u05E8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05D5\u05EA \u05DE\u05DB\u05E4\u05DC\u05D4 \u05E9\u05DC ${d.divisor}`;
      case "unrecognized_keys":
        return `\u05DE\u05E4\u05EA\u05D7${d.keys.length > 1 ? "\u05D5\u05EA" : ""} \u05DC\u05D0 \u05DE\u05D6\u05D5\u05D4${d.keys.length > 1 ? "\u05D9\u05DD" : "\u05D4"}: ${k(d.keys, ", ")}`;
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
function rc() {
  return {
    localeError: Ax()
  };
}
s(rc, "default");

// node_modules/zod/v4/locales/hu.js
var Rx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "karakter", verb: "legyen" },
    file: { unit: "byte", verb: "legyen" },
    array: { unit: "elem", verb: "legyen" },
    set: { unit: "elem", verb: "legyen" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k instanceof ${r.expected}, a kapott \xE9rt\xE9k ${u}` : `\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k ${i}, a kapott \xE9rt\xE9k ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k ${z(r.values[0])}` : `\xC9rv\xE9nytelen opci\xF3: valamelyik \xE9rt\xE9k v\xE1rt ${k(r.values, "|")}`;
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
        return `Ismeretlen kulcs${r.keys.length > 1 ? "s" : ""}: ${k(r.keys, ", ")}`;
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
function nc() {
  return {
    localeError: Rx()
  };
}
s(nc, "default");

// node_modules/zod/v4/locales/hy.js
function Rf(e, t, n) {
  return Math.abs(e) === 1 ? t : n;
}
s(Rf, "getArmenianPlural");
function tn(e) {
  if (!e)
    return "";
  let t = ["\u0561", "\u0565", "\u0568", "\u056B", "\u0578", "\u0578\u0582", "\u0585"], n = e[e.length - 1];
  return e + (t.includes(n) ? "\u0576" : "\u0568");
}
s(tn, "withDefiniteArticle");
var Cx = /* @__PURE__ */ s(() => {
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
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 instanceof ${r.expected}, \u057D\u057F\u0561\u0581\u057E\u0565\u056C \u0567 ${u}` : `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 ${i}, \u057D\u057F\u0561\u0581\u057E\u0565\u056C \u0567 ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 ${z(r.values[1])}` : `\u054D\u056D\u0561\u056C \u057F\u0561\u0580\u0562\u0565\u0580\u0561\u056F\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 \u0570\u0565\u057F\u0587\u0575\u0561\u056C\u0576\u0565\u0580\u056B\u0581 \u0574\u0565\u056F\u0568\u055D ${k(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        if (a) {
          let u = Number(r.maximum), c = Rf(u, a.unit.one, a.unit.many);
          return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0574\u0565\u056E \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${tn(r.origin ?? "\u0561\u0580\u056A\u0565\u0584")} \u056F\u0578\u0582\u0576\u0565\u0576\u0561 ${i}${r.maximum.toString()} ${c}`;
        }
        return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0574\u0565\u056E \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${tn(r.origin ?? "\u0561\u0580\u056A\u0565\u0584")} \u056C\u056B\u0576\u056B ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        if (a) {
          let u = Number(r.minimum), c = Rf(u, a.unit.one, a.unit.many);
          return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0583\u0578\u0584\u0580 \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${tn(r.origin)} \u056F\u0578\u0582\u0576\u0565\u0576\u0561 ${i}${r.minimum.toString()} ${c}`;
        }
        return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0583\u0578\u0584\u0580 \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${tn(r.origin)} \u056C\u056B\u0576\u056B ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u057D\u056F\u057D\u057E\u056B "${i.prefix}"-\u0578\u057E` : i.format === "ends_with" ? `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0561\u057E\u0561\u0580\u057F\u057E\u056B "${i.suffix}"-\u0578\u057E` : i.format === "includes" ? `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u057A\u0561\u0580\u0578\u0582\u0576\u0561\u056F\u056B "${i.includes}"` : i.format === "regex" ? `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0570\u0561\u0574\u0561\u057A\u0561\u057F\u0561\u057D\u056D\u0561\u0576\u056B ${i.pattern} \u0571\u0587\u0561\u0579\u0561\u0583\u056B\u0576` : `\u054D\u056D\u0561\u056C ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u054D\u056D\u0561\u056C \u0569\u056B\u057E\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0562\u0561\u0566\u0574\u0561\u057A\u0561\u057F\u056B\u056F \u056C\u056B\u0576\u056B ${r.divisor}-\u056B`;
      case "unrecognized_keys":
        return `\u0549\u0573\u0561\u0576\u0561\u0579\u057E\u0561\u056E \u0562\u0561\u0576\u0561\u056C\u056B${r.keys.length > 1 ? "\u0576\u0565\u0580" : ""}. ${k(r.keys, ", ")}`;
      case "invalid_key":
        return `\u054D\u056D\u0561\u056C \u0562\u0561\u0576\u0561\u056C\u056B ${tn(r.origin)}-\u0578\u0582\u0574`;
      case "invalid_union":
        return "\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574";
      case "invalid_element":
        return `\u054D\u056D\u0561\u056C \u0561\u0580\u056A\u0565\u0584 ${tn(r.origin)}-\u0578\u0582\u0574`;
      default:
        return "\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574";
    }
  };
}, "error");
function oc() {
  return {
    localeError: Cx()
  };
}
s(oc, "default");

// node_modules/zod/v4/locales/id.js
var Dx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "karakter", verb: "memiliki" },
    file: { unit: "byte", verb: "memiliki" },
    array: { unit: "item", verb: "memiliki" },
    set: { unit: "item", verb: "memiliki" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Input tidak valid: diharapkan instanceof ${r.expected}, diterima ${u}` : `Input tidak valid: diharapkan ${i}, diterima ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Input tidak valid: diharapkan ${z(r.values[0])}` : `Pilihan tidak valid: diharapkan salah satu dari ${k(r.values, "|")}`;
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
        return `Kunci tidak dikenali ${r.keys.length > 1 ? "s" : ""}: ${k(r.keys, ", ")}`;
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
function ic() {
  return {
    localeError: Dx()
  };
}
s(ic, "default");

// node_modules/zod/v4/locales/is.js
var Ux = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "stafi", verb: "a\xF0 hafa" },
    file: { unit: "b\xE6ti", verb: "a\xF0 hafa" },
    array: { unit: "hluti", verb: "a\xF0 hafa" },
    set: { unit: "hluti", verb: "a\xF0 hafa" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Rangt gildi: \xDE\xFA sl\xF3st inn ${u} \xFEar sem \xE1 a\xF0 vera instanceof ${r.expected}` : `Rangt gildi: \xDE\xFA sl\xF3st inn ${u} \xFEar sem \xE1 a\xF0 vera ${i}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Rangt gildi: gert r\xE1\xF0 fyrir ${z(r.values[0])}` : `\xD3gilt val: m\xE1 vera eitt af eftirfarandi ${k(r.values, "|")}`;
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
        return `\xD3\xFEekkt ${r.keys.length > 1 ? "ir lyklar" : "ur lykill"}: ${k(r.keys, ", ")}`;
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
function ac() {
  return {
    localeError: Ux()
  };
}
s(ac, "default");

// node_modules/zod/v4/locales/it.js
var Mx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "caratteri", verb: "avere" },
    file: { unit: "byte", verb: "avere" },
    array: { unit: "elementi", verb: "avere" },
    set: { unit: "elementi", verb: "avere" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Input non valido: atteso instanceof ${r.expected}, ricevuto ${u}` : `Input non valido: atteso ${i}, ricevuto ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Input non valido: atteso ${z(r.values[0])}` : `Opzione non valida: atteso uno tra ${k(r.values, "|")}`;
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
        return `Chiav${r.keys.length > 1 ? "i" : "e"} non riconosciut${r.keys.length > 1 ? "e" : "a"}: ${k(r.keys, ", ")}`;
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
function sc() {
  return {
    localeError: Mx()
  };
}
s(sc, "default");

// node_modules/zod/v4/locales/ja.js
var Zx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "\u6587\u5B57", verb: "\u3067\u3042\u308B" },
    file: { unit: "\u30D0\u30A4\u30C8", verb: "\u3067\u3042\u308B" },
    array: { unit: "\u8981\u7D20", verb: "\u3067\u3042\u308B" },
    set: { unit: "\u8981\u7D20", verb: "\u3067\u3042\u308B" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u7121\u52B9\u306A\u5165\u529B: instanceof ${r.expected}\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F\u304C\u3001${u}\u304C\u5165\u529B\u3055\u308C\u307E\u3057\u305F` : `\u7121\u52B9\u306A\u5165\u529B: ${i}\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F\u304C\u3001${u}\u304C\u5165\u529B\u3055\u308C\u307E\u3057\u305F`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u7121\u52B9\u306A\u5165\u529B: ${z(r.values[0])}\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F` : `\u7121\u52B9\u306A\u9078\u629E: ${k(r.values, "\u3001")}\u306E\u3044\u305A\u308C\u304B\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
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
        return `\u8A8D\u8B58\u3055\u308C\u3066\u3044\u306A\u3044\u30AD\u30FC${r.keys.length > 1 ? "\u7FA4" : ""}: ${k(r.keys, "\u3001")}`;
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
function lc() {
  return {
    localeError: Zx()
  };
}
s(lc, "default");

// node_modules/zod/v4/locales/ka.js
var Lx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "\u10E1\u10D8\u10DB\u10D1\u10DD\u10DA\u10DD", verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1" },
    file: { unit: "\u10D1\u10D0\u10D8\u10E2\u10D8", verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1" },
    array: { unit: "\u10D4\u10DA\u10D4\u10DB\u10D4\u10DC\u10E2\u10D8", verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1" },
    set: { unit: "\u10D4\u10DA\u10D4\u10DB\u10D4\u10DC\u10E2\u10D8", verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 instanceof ${r.expected}, \u10DB\u10D8\u10E6\u10D4\u10D1\u10E3\u10DA\u10D8 ${u}` : `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${i}, \u10DB\u10D8\u10E6\u10D4\u10D1\u10E3\u10DA\u10D8 ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${z(r.values[0])}` : `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D0\u10E0\u10D8\u10D0\u10DC\u10E2\u10D8: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8\u10D0 \u10D4\u10E0\u10D7-\u10D4\u10E0\u10D7\u10D8 ${k(r.values, "|")}-\u10D3\u10D0\u10DC`;
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
        return `\u10E3\u10EA\u10DC\u10DD\u10D1\u10D8 \u10D2\u10D0\u10E1\u10D0\u10E6\u10D4\u10D1${r.keys.length > 1 ? "\u10D4\u10D1\u10D8" : "\u10D8"}: ${k(r.keys, ", ")}`;
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
function uc() {
  return {
    localeError: Lx()
  };
}
s(uc, "default");

// node_modules/zod/v4/locales/km.js
var Fx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "\u178F\u17BD\u17A2\u1780\u17D2\u179F\u179A", verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793" },
    file: { unit: "\u1794\u17C3", verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793" },
    array: { unit: "\u1792\u17B6\u178F\u17BB", verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793" },
    set: { unit: "\u1792\u17B6\u178F\u17BB", verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A instanceof ${r.expected} \u1794\u17C9\u17BB\u1793\u17D2\u178F\u17C2\u1791\u1791\u17BD\u179B\u1794\u17B6\u1793 ${u}` : `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${i} \u1794\u17C9\u17BB\u1793\u17D2\u178F\u17C2\u1791\u1791\u17BD\u179B\u1794\u17B6\u1793 ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${z(r.values[0])}` : `\u1787\u1798\u17D2\u179A\u17BE\u179F\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1787\u17B6\u1798\u17BD\u1799\u1780\u17D2\u1793\u17BB\u1784\u1785\u17C6\u178E\u17C4\u1798 ${k(r.values, "|")}`;
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
        return `\u179A\u1780\u1783\u17BE\u1789\u179F\u17C4\u1798\u17B7\u1793\u179F\u17D2\u1782\u17B6\u179B\u17CB\u17D6 ${k(r.keys, ", ")}`;
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
function bo() {
  return {
    localeError: Fx()
  };
}
s(bo, "default");

// node_modules/zod/v4/locales/kh.js
function cc() {
  return bo();
}
s(cc, "default");

// node_modules/zod/v4/locales/ko.js
var Vx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "\uBB38\uC790", verb: "to have" },
    file: { unit: "\uBC14\uC774\uD2B8", verb: "to have" },
    array: { unit: "\uAC1C", verb: "to have" },
    set: { unit: "\uAC1C", verb: "to have" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\uC798\uBABB\uB41C \uC785\uB825: \uC608\uC0C1 \uD0C0\uC785\uC740 instanceof ${r.expected}, \uBC1B\uC740 \uD0C0\uC785\uC740 ${u}\uC785\uB2C8\uB2E4` : `\uC798\uBABB\uB41C \uC785\uB825: \uC608\uC0C1 \uD0C0\uC785\uC740 ${i}, \uBC1B\uC740 \uD0C0\uC785\uC740 ${u}\uC785\uB2C8\uB2E4`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\uC798\uBABB\uB41C \uC785\uB825: \uAC12\uC740 ${z(r.values[0])} \uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4` : `\uC798\uBABB\uB41C \uC635\uC158: ${k(r.values, "\uB610\uB294 ")} \uC911 \uD558\uB098\uC5EC\uC57C \uD569\uB2C8\uB2E4`;
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
        return `\uC778\uC2DD\uD560 \uC218 \uC5C6\uB294 \uD0A4: ${k(r.keys, ", ")}`;
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
function dc() {
  return {
    localeError: Vx()
  };
}
s(dc, "default");

// node_modules/zod/v4/locales/lt.js
var xo = /* @__PURE__ */ s((e) => e.charAt(0).toUpperCase() + e.slice(1), "capitalizeFirstCharacter");
function Cf(e) {
  let t = Math.abs(e), n = t % 10, o = t % 100;
  return o >= 11 && o <= 19 || n === 0 ? "many" : n === 1 ? "one" : "few";
}
s(Cf, "getUnitTypeFromNumber");
var qx = /* @__PURE__ */ s(() => {
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
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Gautas tipas ${u}, o tik\u0117tasi - instanceof ${r.expected}` : `Gautas tipas ${u}, o tik\u0117tasi - ${i}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Privalo b\u016Bti ${z(r.values[0])}` : `Privalo b\u016Bti vienas i\u0161 ${k(r.values, "|")} pasirinkim\u0173`;
      case "too_big": {
        let i = o[r.origin] ?? r.origin, a = t(r.origin, Cf(Number(r.maximum)), r.inclusive ?? !1, "smaller");
        if (a?.verb)
          return `${xo(i ?? r.origin ?? "reik\u0161m\u0117")} ${a.verb} ${r.maximum.toString()} ${a.unit ?? "element\u0173"}`;
        let u = r.inclusive ? "ne didesnis kaip" : "ma\u017Eesnis kaip";
        return `${xo(i ?? r.origin ?? "reik\u0161m\u0117")} turi b\u016Bti ${u} ${r.maximum.toString()} ${a?.unit}`;
      }
      case "too_small": {
        let i = o[r.origin] ?? r.origin, a = t(r.origin, Cf(Number(r.minimum)), r.inclusive ?? !1, "bigger");
        if (a?.verb)
          return `${xo(i ?? r.origin ?? "reik\u0161m\u0117")} ${a.verb} ${r.minimum.toString()} ${a.unit ?? "element\u0173"}`;
        let u = r.inclusive ? "ne ma\u017Eesnis kaip" : "didesnis kaip";
        return `${xo(i ?? r.origin ?? "reik\u0161m\u0117")} turi b\u016Bti ${u} ${r.minimum.toString()} ${a?.unit}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with" ? `Eilut\u0117 privalo prasid\u0117ti "${i.prefix}"` : i.format === "ends_with" ? `Eilut\u0117 privalo pasibaigti "${i.suffix}"` : i.format === "includes" ? `Eilut\u0117 privalo \u012Ftraukti "${i.includes}"` : i.format === "regex" ? `Eilut\u0117 privalo atitikti ${i.pattern}` : `Neteisingas ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Skai\u010Dius privalo b\u016Bti ${r.divisor} kartotinis.`;
      case "unrecognized_keys":
        return `Neatpa\u017Eint${r.keys.length > 1 ? "i" : "as"} rakt${r.keys.length > 1 ? "ai" : "as"}: ${k(r.keys, ", ")}`;
      case "invalid_key":
        return "Rastas klaidingas raktas";
      case "invalid_union":
        return "Klaidinga \u012Fvestis";
      case "invalid_element": {
        let i = o[r.origin] ?? r.origin;
        return `${xo(i ?? r.origin ?? "reik\u0161m\u0117")} turi klaiding\u0105 \u012Fvest\u012F`;
      }
      default:
        return "Klaidinga \u012Fvestis";
    }
  };
}, "error");
function pc() {
  return {
    localeError: qx()
  };
}
s(pc, "default");

// node_modules/zod/v4/locales/mk.js
var Jx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "\u0437\u043D\u0430\u0446\u0438", verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442" },
    file: { unit: "\u0431\u0430\u0458\u0442\u0438", verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442" },
    array: { unit: "\u0441\u0442\u0430\u0432\u043A\u0438", verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442" },
    set: { unit: "\u0441\u0442\u0430\u0432\u043A\u0438", verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 instanceof ${r.expected}, \u043F\u0440\u0438\u043C\u0435\u043D\u043E ${u}` : `\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${i}, \u043F\u0440\u0438\u043C\u0435\u043D\u043E ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Invalid input: expected ${z(r.values[0])}` : `\u0413\u0440\u0435\u0448\u0430\u043D\u0430 \u043E\u043F\u0446\u0438\u0458\u0430: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 \u0435\u0434\u043D\u0430 ${k(r.values, "|")}`;
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
        return `${r.keys.length > 1 ? "\u041D\u0435\u043F\u0440\u0435\u043F\u043E\u0437\u043D\u0430\u0435\u043D\u0438 \u043A\u043B\u0443\u0447\u0435\u0432\u0438" : "\u041D\u0435\u043F\u0440\u0435\u043F\u043E\u0437\u043D\u0430\u0435\u043D \u043A\u043B\u0443\u0447"}: ${k(r.keys, ", ")}`;
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
function mc() {
  return {
    localeError: Jx()
  };
}
s(mc, "default");

// node_modules/zod/v4/locales/ms.js
var Bx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "aksara", verb: "mempunyai" },
    file: { unit: "bait", verb: "mempunyai" },
    array: { unit: "elemen", verb: "mempunyai" },
    set: { unit: "elemen", verb: "mempunyai" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Input tidak sah: dijangka instanceof ${r.expected}, diterima ${u}` : `Input tidak sah: dijangka ${i}, diterima ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Input tidak sah: dijangka ${z(r.values[0])}` : `Pilihan tidak sah: dijangka salah satu daripada ${k(r.values, "|")}`;
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
        return `Kunci tidak dikenali: ${k(r.keys, ", ")}`;
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
function fc() {
  return {
    localeError: Bx()
  };
}
s(fc, "default");

// node_modules/zod/v4/locales/nl.js
var Gx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "tekens", verb: "heeft" },
    file: { unit: "bytes", verb: "heeft" },
    array: { unit: "elementen", verb: "heeft" },
    set: { unit: "elementen", verb: "heeft" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ongeldige invoer: verwacht instanceof ${r.expected}, ontving ${u}` : `Ongeldige invoer: verwacht ${i}, ontving ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ongeldige invoer: verwacht ${z(r.values[0])}` : `Ongeldige optie: verwacht \xE9\xE9n van ${k(r.values, "|")}`;
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
        return `Onbekende key${r.keys.length > 1 ? "s" : ""}: ${k(r.keys, ", ")}`;
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
function gc() {
  return {
    localeError: Gx()
  };
}
s(gc, "default");

// node_modules/zod/v4/locales/no.js
var Wx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "tegn", verb: "\xE5 ha" },
    file: { unit: "bytes", verb: "\xE5 ha" },
    array: { unit: "elementer", verb: "\xE5 inneholde" },
    set: { unit: "elementer", verb: "\xE5 inneholde" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ugyldig input: forventet instanceof ${r.expected}, fikk ${u}` : `Ugyldig input: forventet ${i}, fikk ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ugyldig verdi: forventet ${z(r.values[0])}` : `Ugyldig valg: forventet en av ${k(r.values, "|")}`;
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
        return `${r.keys.length > 1 ? "Ukjente n\xF8kler" : "Ukjent n\xF8kkel"}: ${k(r.keys, ", ")}`;
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
function hc() {
  return {
    localeError: Wx()
  };
}
s(hc, "default");

// node_modules/zod/v4/locales/ota.js
var Kx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "harf", verb: "olmal\u0131d\u0131r" },
    file: { unit: "bayt", verb: "olmal\u0131d\u0131r" },
    array: { unit: "unsur", verb: "olmal\u0131d\u0131r" },
    set: { unit: "unsur", verb: "olmal\u0131d\u0131r" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `F\xE2sit giren: umulan instanceof ${r.expected}, al\u0131nan ${u}` : `F\xE2sit giren: umulan ${i}, al\u0131nan ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `F\xE2sit giren: umulan ${z(r.values[0])}` : `F\xE2sit tercih: m\xFBteberler ${k(r.values, "|")}`;
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
        return `Tan\u0131nmayan anahtar ${r.keys.length > 1 ? "s" : ""}: ${k(r.keys, ", ")}`;
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
function vc() {
  return {
    localeError: Kx()
  };
}
s(vc, "default");

// node_modules/zod/v4/locales/ps.js
var Hx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" },
    file: { unit: "\u0628\u0627\u06CC\u067C\u0633", verb: "\u0648\u0644\u0631\u064A" },
    array: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" },
    set: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F instanceof ${r.expected} \u0648\u0627\u06CC, \u0645\u06AB\u0631 ${u} \u062A\u0631\u0644\u0627\u0633\u0647 \u0634\u0648` : `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F ${i} \u0648\u0627\u06CC, \u0645\u06AB\u0631 ${u} \u062A\u0631\u0644\u0627\u0633\u0647 \u0634\u0648`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F ${z(r.values[0])} \u0648\u0627\u06CC` : `\u0646\u0627\u0633\u0645 \u0627\u0646\u062A\u062E\u0627\u0628: \u0628\u0627\u06CC\u062F \u06CC\u0648 \u0644\u0647 ${k(r.values, "|")} \u0685\u062E\u0647 \u0648\u0627\u06CC`;
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
        return `\u0646\u0627\u0633\u0645 ${r.keys.length > 1 ? "\u06A9\u0644\u06CC\u0689\u0648\u0646\u0647" : "\u06A9\u0644\u06CC\u0689"}: ${k(r.keys, ", ")}`;
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
function yc() {
  return {
    localeError: Hx()
  };
}
s(yc, "default");

// node_modules/zod/v4/locales/pl.js
var Xx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "znak\xF3w", verb: "mie\u0107" },
    file: { unit: "bajt\xF3w", verb: "mie\u0107" },
    array: { unit: "element\xF3w", verb: "mie\u0107" },
    set: { unit: "element\xF3w", verb: "mie\u0107" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano instanceof ${r.expected}, otrzymano ${u}` : `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano ${i}, otrzymano ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano ${z(r.values[0])}` : `Nieprawid\u0142owa opcja: oczekiwano jednej z warto\u015Bci ${k(r.values, "|")}`;
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
        return `Nierozpoznane klucze${r.keys.length > 1 ? "s" : ""}: ${k(r.keys, ", ")}`;
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
function _c() {
  return {
    localeError: Xx()
  };
}
s(_c, "default");

// node_modules/zod/v4/locales/pt.js
var Yx = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "caracteres", verb: "ter" },
    file: { unit: "bytes", verb: "ter" },
    array: { unit: "itens", verb: "ter" },
    set: { unit: "itens", verb: "ter" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Tipo inv\xE1lido: esperado instanceof ${r.expected}, recebido ${u}` : `Tipo inv\xE1lido: esperado ${i}, recebido ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Entrada inv\xE1lida: esperado ${z(r.values[0])}` : `Op\xE7\xE3o inv\xE1lida: esperada uma das ${k(r.values, "|")}`;
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
        return `Chave${r.keys.length > 1 ? "s" : ""} desconhecida${r.keys.length > 1 ? "s" : ""}: ${k(r.keys, ", ")}`;
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
function bc() {
  return {
    localeError: Yx()
  };
}
s(bc, "default");

// node_modules/zod/v4/locales/ru.js
function Df(e, t, n, o) {
  let r = Math.abs(e), i = r % 10, a = r % 100;
  return a >= 11 && a <= 19 ? o : i === 1 ? t : i >= 2 && i <= 4 ? n : o;
}
s(Df, "getRussianPlural");
var Qx = /* @__PURE__ */ s(() => {
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
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C instanceof ${r.expected}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${u}` : `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C ${i}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C ${z(r.values[0])}` : `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0434\u043D\u043E \u0438\u0437 ${k(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<", a = t(r.origin);
        if (a) {
          let u = Number(r.maximum), c = Df(u, a.unit.one, a.unit.few, a.unit.many);
          return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${r.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435"} \u0431\u0443\u0434\u0435\u0442 \u0438\u043C\u0435\u0442\u044C ${i}${r.maximum.toString()} ${c}`;
        }
        return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${r.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435"} \u0431\u0443\u0434\u0435\u0442 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">", a = t(r.origin);
        if (a) {
          let u = Number(r.minimum), c = Df(u, a.unit.one, a.unit.few, a.unit.many);
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
        return `\u041D\u0435\u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u043D\u043D${r.keys.length > 1 ? "\u044B\u0435" : "\u044B\u0439"} \u043A\u043B\u044E\u0447${r.keys.length > 1 ? "\u0438" : ""}: ${k(r.keys, ", ")}`;
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
function xc() {
  return {
    localeError: Qx()
  };
}
s(xc, "default");

// node_modules/zod/v4/locales/sl.js
var e$ = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "znakov", verb: "imeti" },
    file: { unit: "bajtov", verb: "imeti" },
    array: { unit: "elementov", verb: "imeti" },
    set: { unit: "elementov", verb: "imeti" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Neveljaven vnos: pri\u010Dakovano instanceof ${r.expected}, prejeto ${u}` : `Neveljaven vnos: pri\u010Dakovano ${i}, prejeto ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Neveljaven vnos: pri\u010Dakovano ${z(r.values[0])}` : `Neveljavna mo\u017Enost: pri\u010Dakovano eno izmed ${k(r.values, "|")}`;
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
        return `Neprepoznan${r.keys.length > 1 ? "i klju\u010Di" : " klju\u010D"}: ${k(r.keys, ", ")}`;
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
function $c() {
  return {
    localeError: e$()
  };
}
s($c, "default");

// node_modules/zod/v4/locales/sv.js
var t$ = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "tecken", verb: "att ha" },
    file: { unit: "bytes", verb: "att ha" },
    array: { unit: "objekt", verb: "att inneh\xE5lla" },
    set: { unit: "objekt", verb: "att inneh\xE5lla" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ogiltig inmatning: f\xF6rv\xE4ntat instanceof ${r.expected}, fick ${u}` : `Ogiltig inmatning: f\xF6rv\xE4ntat ${i}, fick ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ogiltig inmatning: f\xF6rv\xE4ntat ${z(r.values[0])}` : `Ogiltigt val: f\xF6rv\xE4ntade en av ${k(r.values, "|")}`;
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
        return `${r.keys.length > 1 ? "Ok\xE4nda nycklar" : "Ok\xE4nd nyckel"}: ${k(r.keys, ", ")}`;
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
function wc() {
  return {
    localeError: t$()
  };
}
s(wc, "default");

// node_modules/zod/v4/locales/ta.js
var r$ = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "\u0B8E\u0BB4\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BB3\u0BCD", verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD" },
    file: { unit: "\u0BAA\u0BC8\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD", verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD" },
    array: { unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD", verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD" },
    set: { unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD", verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 instanceof ${r.expected}, \u0BAA\u0BC6\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${u}` : `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${i}, \u0BAA\u0BC6\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${z(r.values[0])}` : `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BB5\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BAE\u0BCD: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${k(r.values, "|")} \u0B87\u0BB2\u0BCD \u0B92\u0BA9\u0BCD\u0BB1\u0BC1`;
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
        return `\u0B85\u0B9F\u0BC8\u0BAF\u0BBE\u0BB3\u0BAE\u0BCD \u0BA4\u0BC6\u0BB0\u0BBF\u0BAF\u0BBE\u0BA4 \u0BB5\u0BBF\u0B9A\u0BC8${r.keys.length > 1 ? "\u0B95\u0BB3\u0BCD" : ""}: ${k(r.keys, ", ")}`;
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
function kc() {
  return {
    localeError: r$()
  };
}
s(kc, "default");

// node_modules/zod/v4/locales/th.js
var n$ = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23", verb: "\u0E04\u0E27\u0E23\u0E21\u0E35" },
    file: { unit: "\u0E44\u0E1A\u0E15\u0E4C", verb: "\u0E04\u0E27\u0E23\u0E21\u0E35" },
    array: { unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23", verb: "\u0E04\u0E27\u0E23\u0E21\u0E35" },
    set: { unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23", verb: "\u0E04\u0E27\u0E23\u0E21\u0E35" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 instanceof ${r.expected} \u0E41\u0E15\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A ${u}` : `\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 ${i} \u0E41\u0E15\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u0E04\u0E48\u0E32\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 ${z(r.values[0])}` : `\u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E43\u0E19 ${k(r.values, "|")}`;
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
        return `\u0E1E\u0E1A\u0E04\u0E35\u0E22\u0E4C\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E23\u0E39\u0E49\u0E08\u0E31\u0E01: ${k(r.keys, ", ")}`;
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
function Ic() {
  return {
    localeError: n$()
  };
}
s(Ic, "default");

// node_modules/zod/v4/locales/tr.js
var o$ = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "karakter", verb: "olmal\u0131" },
    file: { unit: "bayt", verb: "olmal\u0131" },
    array: { unit: "\xF6\u011Fe", verb: "olmal\u0131" },
    set: { unit: "\xF6\u011Fe", verb: "olmal\u0131" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ge\xE7ersiz de\u011Fer: beklenen instanceof ${r.expected}, al\u0131nan ${u}` : `Ge\xE7ersiz de\u011Fer: beklenen ${i}, al\u0131nan ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ge\xE7ersiz de\u011Fer: beklenen ${z(r.values[0])}` : `Ge\xE7ersiz se\xE7enek: a\u015Fa\u011F\u0131dakilerden biri olmal\u0131: ${k(r.values, "|")}`;
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
        return `Tan\u0131nmayan anahtar${r.keys.length > 1 ? "lar" : ""}: ${k(r.keys, ", ")}`;
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
function Sc() {
  return {
    localeError: o$()
  };
}
s(Sc, "default");

// node_modules/zod/v4/locales/uk.js
var i$ = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "\u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432", verb: "\u043C\u0430\u0442\u0438\u043C\u0435" },
    file: { unit: "\u0431\u0430\u0439\u0442\u0456\u0432", verb: "\u043C\u0430\u0442\u0438\u043C\u0435" },
    array: { unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432", verb: "\u043C\u0430\u0442\u0438\u043C\u0435" },
    set: { unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432", verb: "\u043C\u0430\u0442\u0438\u043C\u0435" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F instanceof ${r.expected}, \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043E ${u}` : `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F ${i}, \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043E ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F ${z(r.values[0])}` : `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0430 \u043E\u043F\u0446\u0456\u044F: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F \u043E\u0434\u043D\u0435 \u0437 ${k(r.values, "|")}`;
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
        return `\u041D\u0435\u0440\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u043D\u0438\u0439 \u043A\u043B\u044E\u0447${r.keys.length > 1 ? "\u0456" : ""}: ${k(r.keys, ", ")}`;
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
function $o() {
  return {
    localeError: i$()
  };
}
s($o, "default");

// node_modules/zod/v4/locales/ua.js
function Tc() {
  return $o();
}
s(Tc, "default");

// node_modules/zod/v4/locales/ur.js
var a$ = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "\u062D\u0631\u0648\u0641", verb: "\u06C1\u0648\u0646\u0627" },
    file: { unit: "\u0628\u0627\u0626\u0679\u0633", verb: "\u06C1\u0648\u0646\u0627" },
    array: { unit: "\u0622\u0626\u0679\u0645\u0632", verb: "\u06C1\u0648\u0646\u0627" },
    set: { unit: "\u0622\u0626\u0679\u0645\u0632", verb: "\u06C1\u0648\u0646\u0627" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: instanceof ${r.expected} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627\u060C ${u} \u0645\u0648\u0635\u0648\u0644 \u06C1\u0648\u0627` : `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: ${i} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627\u060C ${u} \u0645\u0648\u0635\u0648\u0644 \u06C1\u0648\u0627`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: ${z(r.values[0])} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627` : `\u063A\u0644\u0637 \u0622\u067E\u0634\u0646: ${k(r.values, "|")} \u0645\u06CC\u06BA \u0633\u06D2 \u0627\u06CC\u06A9 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
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
        return `\u063A\u06CC\u0631 \u062A\u0633\u0644\u06CC\u0645 \u0634\u062F\u06C1 \u06A9\u06CC${r.keys.length > 1 ? "\u0632" : ""}: ${k(r.keys, "\u060C ")}`;
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
function zc() {
  return {
    localeError: a$()
  };
}
s(zc, "default");

// node_modules/zod/v4/locales/uz.js
var s$ = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "belgi", verb: "bo\u2018lishi kerak" },
    file: { unit: "bayt", verb: "bo\u2018lishi kerak" },
    array: { unit: "element", verb: "bo\u2018lishi kerak" },
    set: { unit: "element", verb: "bo\u2018lishi kerak" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Noto\u2018g\u2018ri kirish: kutilgan instanceof ${r.expected}, qabul qilingan ${u}` : `Noto\u2018g\u2018ri kirish: kutilgan ${i}, qabul qilingan ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Noto\u2018g\u2018ri kirish: kutilgan ${z(r.values[0])}` : `Noto\u2018g\u2018ri variant: quyidagilardan biri kutilgan ${k(r.values, "|")}`;
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
        return `Noma\u2019lum kalit${r.keys.length > 1 ? "lar" : ""}: ${k(r.keys, ", ")}`;
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
function Ec() {
  return {
    localeError: s$()
  };
}
s(Ec, "default");

// node_modules/zod/v4/locales/vi.js
var l$ = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "k\xFD t\u1EF1", verb: "c\xF3" },
    file: { unit: "byte", verb: "c\xF3" },
    array: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" },
    set: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i instanceof ${r.expected}, nh\u1EADn \u0111\u01B0\u1EE3c ${u}` : `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i ${i}, nh\u1EADn \u0111\u01B0\u1EE3c ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i ${z(r.values[0])}` : `T\xF9y ch\u1ECDn kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i m\u1ED9t trong c\xE1c gi\xE1 tr\u1ECB ${k(r.values, "|")}`;
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
        return `Kh\xF3a kh\xF4ng \u0111\u01B0\u1EE3c nh\u1EADn d\u1EA1ng: ${k(r.keys, ", ")}`;
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
function Oc() {
  return {
    localeError: l$()
  };
}
s(Oc, "default");

// node_modules/zod/v4/locales/zh-CN.js
var u$ = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "\u5B57\u7B26", verb: "\u5305\u542B" },
    file: { unit: "\u5B57\u8282", verb: "\u5305\u542B" },
    array: { unit: "\u9879", verb: "\u5305\u542B" },
    set: { unit: "\u9879", verb: "\u5305\u542B" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B instanceof ${r.expected}\uFF0C\u5B9E\u9645\u63A5\u6536 ${u}` : `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B ${i}\uFF0C\u5B9E\u9645\u63A5\u6536 ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B ${z(r.values[0])}` : `\u65E0\u6548\u9009\u9879\uFF1A\u671F\u671B\u4EE5\u4E0B\u4E4B\u4E00 ${k(r.values, "|")}`;
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
        return `\u51FA\u73B0\u672A\u77E5\u7684\u952E(key): ${k(r.keys, ", ")}`;
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
function jc() {
  return {
    localeError: u$()
  };
}
s(jc, "default");

// node_modules/zod/v4/locales/zh-TW.js
var c$ = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "\u5B57\u5143", verb: "\u64C1\u6709" },
    file: { unit: "\u4F4D\u5143\u7D44", verb: "\u64C1\u6709" },
    array: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" },
    set: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA instanceof ${r.expected}\uFF0C\u4F46\u6536\u5230 ${u}` : `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA ${i}\uFF0C\u4F46\u6536\u5230 ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA ${z(r.values[0])}` : `\u7121\u6548\u7684\u9078\u9805\uFF1A\u9810\u671F\u70BA\u4EE5\u4E0B\u5176\u4E2D\u4E4B\u4E00 ${k(r.values, "|")}`;
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
        return `\u7121\u6CD5\u8B58\u5225\u7684\u9375\u503C${r.keys.length > 1 ? "\u5011" : ""}\uFF1A${k(r.keys, "\u3001")}`;
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
function Pc() {
  return {
    localeError: c$()
  };
}
s(Pc, "default");

// node_modules/zod/v4/locales/yo.js
var d$ = /* @__PURE__ */ s(() => {
  let e = {
    string: { unit: "\xE0mi", verb: "n\xED" },
    file: { unit: "bytes", verb: "n\xED" },
    array: { unit: "nkan", verb: "n\xED" },
    set: { unit: "nkan", verb: "n\xED" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  s(t, "getSizing");
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
        let i = o[r.expected] ?? r.expected, a = O(r.input), u = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi instanceof ${r.expected}, \xE0m\u1ECD\u0300 a r\xED ${u}` : `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi ${i}, \xE0m\u1ECD\u0300 a r\xED ${u}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi ${z(r.values[0])}` : `\xC0\u1E63\xE0y\xE0n a\u1E63\xEC\u1E63e: yan \u1ECD\u0300kan l\xE1ra ${k(r.values, "|")}`;
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
        return `B\u1ECDt\xECn\xEC \xE0\xECm\u1ECD\u0300: ${k(r.keys, ", ")}`;
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
function Nc() {
  return {
    localeError: d$()
  };
}
s(Nc, "default");

// node_modules/zod/v4/core/registries.js
var Uf, Ac = Symbol("ZodOutput"), Rc = Symbol("ZodInput"), Ci = class {
  static {
    s(this, "$ZodRegistry");
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
function Di() {
  return new Ci();
}
s(Di, "registry");
(Uf = globalThis).__zod_globalRegistry ?? (Uf.__zod_globalRegistry = Di());
var Be = globalThis.__zod_globalRegistry;

// node_modules/zod/v4/core/api.js
// @__NO_SIDE_EFFECTS__
function Cc(e, t) {
  return new e({
    type: "string",
    ...N(t)
  });
}
s(Cc, "_string");
// @__NO_SIDE_EFFECTS__
function Dc(e, t) {
  return new e({
    type: "string",
    coerce: !0,
    ...N(t)
  });
}
s(Dc, "_coercedString");
// @__NO_SIDE_EFFECTS__
function Ui(e, t) {
  return new e({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(Ui, "_email");
// @__NO_SIDE_EFFECTS__
function ko(e, t) {
  return new e({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(ko, "_guid");
// @__NO_SIDE_EFFECTS__
function Mi(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(Mi, "_uuid");
// @__NO_SIDE_EFFECTS__
function Zi(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...N(t)
  });
}
s(Zi, "_uuidv4");
// @__NO_SIDE_EFFECTS__
function Li(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...N(t)
  });
}
s(Li, "_uuidv6");
// @__NO_SIDE_EFFECTS__
function Fi(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...N(t)
  });
}
s(Fi, "_uuidv7");
// @__NO_SIDE_EFFECTS__
function Io(e, t) {
  return new e({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(Io, "_url");
// @__NO_SIDE_EFFECTS__
function Vi(e, t) {
  return new e({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(Vi, "_emoji");
// @__NO_SIDE_EFFECTS__
function qi(e, t) {
  return new e({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(qi, "_nanoid");
// @__NO_SIDE_EFFECTS__
function Ji(e, t) {
  return new e({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(Ji, "_cuid");
// @__NO_SIDE_EFFECTS__
function Bi(e, t) {
  return new e({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(Bi, "_cuid2");
// @__NO_SIDE_EFFECTS__
function Gi(e, t) {
  return new e({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(Gi, "_ulid");
// @__NO_SIDE_EFFECTS__
function Wi(e, t) {
  return new e({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(Wi, "_xid");
// @__NO_SIDE_EFFECTS__
function Ki(e, t) {
  return new e({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(Ki, "_ksuid");
// @__NO_SIDE_EFFECTS__
function Hi(e, t) {
  return new e({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(Hi, "_ipv4");
// @__NO_SIDE_EFFECTS__
function Xi(e, t) {
  return new e({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(Xi, "_ipv6");
// @__NO_SIDE_EFFECTS__
function Uc(e, t) {
  return new e({
    type: "string",
    format: "mac",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(Uc, "_mac");
// @__NO_SIDE_EFFECTS__
function Yi(e, t) {
  return new e({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(Yi, "_cidrv4");
// @__NO_SIDE_EFFECTS__
function Qi(e, t) {
  return new e({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(Qi, "_cidrv6");
// @__NO_SIDE_EFFECTS__
function ea(e, t) {
  return new e({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(ea, "_base64");
// @__NO_SIDE_EFFECTS__
function ta(e, t) {
  return new e({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(ta, "_base64url");
// @__NO_SIDE_EFFECTS__
function ra(e, t) {
  return new e({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(ra, "_e164");
// @__NO_SIDE_EFFECTS__
function na(e, t) {
  return new e({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
s(na, "_jwt");
var Mc = {
  Any: null,
  Minute: -1,
  Second: 0,
  Millisecond: 3,
  Microsecond: 6
};
// @__NO_SIDE_EFFECTS__
function Zc(e, t) {
  return new e({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...N(t)
  });
}
s(Zc, "_isoDateTime");
// @__NO_SIDE_EFFECTS__
function Lc(e, t) {
  return new e({
    type: "string",
    format: "date",
    check: "string_format",
    ...N(t)
  });
}
s(Lc, "_isoDate");
// @__NO_SIDE_EFFECTS__
function Fc(e, t) {
  return new e({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...N(t)
  });
}
s(Fc, "_isoTime");
// @__NO_SIDE_EFFECTS__
function Vc(e, t) {
  return new e({
    type: "string",
    format: "duration",
    check: "string_format",
    ...N(t)
  });
}
s(Vc, "_isoDuration");
// @__NO_SIDE_EFFECTS__
function qc(e, t) {
  return new e({
    type: "number",
    checks: [],
    ...N(t)
  });
}
s(qc, "_number");
// @__NO_SIDE_EFFECTS__
function Jc(e, t) {
  return new e({
    type: "number",
    coerce: !0,
    checks: [],
    ...N(t)
  });
}
s(Jc, "_coercedNumber");
// @__NO_SIDE_EFFECTS__
function Bc(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...N(t)
  });
}
s(Bc, "_int");
// @__NO_SIDE_EFFECTS__
function Gc(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "float32",
    ...N(t)
  });
}
s(Gc, "_float32");
// @__NO_SIDE_EFFECTS__
function Wc(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "float64",
    ...N(t)
  });
}
s(Wc, "_float64");
// @__NO_SIDE_EFFECTS__
function Kc(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "int32",
    ...N(t)
  });
}
s(Kc, "_int32");
// @__NO_SIDE_EFFECTS__
function Hc(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "uint32",
    ...N(t)
  });
}
s(Hc, "_uint32");
// @__NO_SIDE_EFFECTS__
function Xc(e, t) {
  return new e({
    type: "boolean",
    ...N(t)
  });
}
s(Xc, "_boolean");
// @__NO_SIDE_EFFECTS__
function Yc(e, t) {
  return new e({
    type: "boolean",
    coerce: !0,
    ...N(t)
  });
}
s(Yc, "_coercedBoolean");
// @__NO_SIDE_EFFECTS__
function Qc(e, t) {
  return new e({
    type: "bigint",
    ...N(t)
  });
}
s(Qc, "_bigint");
// @__NO_SIDE_EFFECTS__
function ed(e, t) {
  return new e({
    type: "bigint",
    coerce: !0,
    ...N(t)
  });
}
s(ed, "_coercedBigint");
// @__NO_SIDE_EFFECTS__
function td(e, t) {
  return new e({
    type: "bigint",
    check: "bigint_format",
    abort: !1,
    format: "int64",
    ...N(t)
  });
}
s(td, "_int64");
// @__NO_SIDE_EFFECTS__
function rd(e, t) {
  return new e({
    type: "bigint",
    check: "bigint_format",
    abort: !1,
    format: "uint64",
    ...N(t)
  });
}
s(rd, "_uint64");
// @__NO_SIDE_EFFECTS__
function nd(e, t) {
  return new e({
    type: "symbol",
    ...N(t)
  });
}
s(nd, "_symbol");
// @__NO_SIDE_EFFECTS__
function od(e, t) {
  return new e({
    type: "undefined",
    ...N(t)
  });
}
s(od, "_undefined");
// @__NO_SIDE_EFFECTS__
function id(e, t) {
  return new e({
    type: "null",
    ...N(t)
  });
}
s(id, "_null");
// @__NO_SIDE_EFFECTS__
function ad(e) {
  return new e({
    type: "any"
  });
}
s(ad, "_any");
// @__NO_SIDE_EFFECTS__
function sd(e) {
  return new e({
    type: "unknown"
  });
}
s(sd, "_unknown");
// @__NO_SIDE_EFFECTS__
function ld(e, t) {
  return new e({
    type: "never",
    ...N(t)
  });
}
s(ld, "_never");
// @__NO_SIDE_EFFECTS__
function ud(e, t) {
  return new e({
    type: "void",
    ...N(t)
  });
}
s(ud, "_void");
// @__NO_SIDE_EFFECTS__
function cd(e, t) {
  return new e({
    type: "date",
    ...N(t)
  });
}
s(cd, "_date");
// @__NO_SIDE_EFFECTS__
function dd(e, t) {
  return new e({
    type: "date",
    coerce: !0,
    ...N(t)
  });
}
s(dd, "_coercedDate");
// @__NO_SIDE_EFFECTS__
function pd(e, t) {
  return new e({
    type: "nan",
    ...N(t)
  });
}
s(pd, "_nan");
// @__NO_SIDE_EFFECTS__
function Mt(e, t) {
  return new Ii({
    check: "less_than",
    ...N(t),
    value: e,
    inclusive: !1
  });
}
s(Mt, "_lt");
// @__NO_SIDE_EFFECTS__
function vt(e, t) {
  return new Ii({
    check: "less_than",
    ...N(t),
    value: e,
    inclusive: !0
  });
}
s(vt, "_lte");
// @__NO_SIDE_EFFECTS__
function Zt(e, t) {
  return new Si({
    check: "greater_than",
    ...N(t),
    value: e,
    inclusive: !1
  });
}
s(Zt, "_gt");
// @__NO_SIDE_EFFECTS__
function Qe(e, t) {
  return new Si({
    check: "greater_than",
    ...N(t),
    value: e,
    inclusive: !0
  });
}
s(Qe, "_gte");
// @__NO_SIDE_EFFECTS__
function oa(e) {
  return /* @__PURE__ */ Zt(0, e);
}
s(oa, "_positive");
// @__NO_SIDE_EFFECTS__
function ia(e) {
  return /* @__PURE__ */ Mt(0, e);
}
s(ia, "_negative");
// @__NO_SIDE_EFFECTS__
function aa(e) {
  return /* @__PURE__ */ vt(0, e);
}
s(aa, "_nonpositive");
// @__NO_SIDE_EFFECTS__
function sa(e) {
  return /* @__PURE__ */ Qe(0, e);
}
s(sa, "_nonnegative");
// @__NO_SIDE_EFFECTS__
function hr(e, t) {
  return new ml({
    check: "multiple_of",
    ...N(t),
    value: e
  });
}
s(hr, "_multipleOf");
// @__NO_SIDE_EFFECTS__
function vr(e, t) {
  return new hl({
    check: "max_size",
    ...N(t),
    maximum: e
  });
}
s(vr, "_maxSize");
// @__NO_SIDE_EFFECTS__
function Lt(e, t) {
  return new vl({
    check: "min_size",
    ...N(t),
    minimum: e
  });
}
s(Lt, "_minSize");
// @__NO_SIDE_EFFECTS__
function Nr(e, t) {
  return new yl({
    check: "size_equals",
    ...N(t),
    size: e
  });
}
s(Nr, "_size");
// @__NO_SIDE_EFFECTS__
function Ar(e, t) {
  return new _l({
    check: "max_length",
    ...N(t),
    maximum: e
  });
}
s(Ar, "_maxLength");
// @__NO_SIDE_EFFECTS__
function Qt(e, t) {
  return new bl({
    check: "min_length",
    ...N(t),
    minimum: e
  });
}
s(Qt, "_minLength");
// @__NO_SIDE_EFFECTS__
function Rr(e, t) {
  return new xl({
    check: "length_equals",
    ...N(t),
    length: e
  });
}
s(Rr, "_length");
// @__NO_SIDE_EFFECTS__
function rn(e, t) {
  return new $l({
    check: "string_format",
    format: "regex",
    ...N(t),
    pattern: e
  });
}
s(rn, "_regex");
// @__NO_SIDE_EFFECTS__
function nn(e) {
  return new wl({
    check: "string_format",
    format: "lowercase",
    ...N(e)
  });
}
s(nn, "_lowercase");
// @__NO_SIDE_EFFECTS__
function on(e) {
  return new kl({
    check: "string_format",
    format: "uppercase",
    ...N(e)
  });
}
s(on, "_uppercase");
// @__NO_SIDE_EFFECTS__
function an(e, t) {
  return new Il({
    check: "string_format",
    format: "includes",
    ...N(t),
    includes: e
  });
}
s(an, "_includes");
// @__NO_SIDE_EFFECTS__
function sn(e, t) {
  return new Sl({
    check: "string_format",
    format: "starts_with",
    ...N(t),
    prefix: e
  });
}
s(sn, "_startsWith");
// @__NO_SIDE_EFFECTS__
function ln(e, t) {
  return new Tl({
    check: "string_format",
    format: "ends_with",
    ...N(t),
    suffix: e
  });
}
s(ln, "_endsWith");
// @__NO_SIDE_EFFECTS__
function la(e, t, n) {
  return new zl({
    check: "property",
    property: e,
    schema: t,
    ...N(n)
  });
}
s(la, "_property");
// @__NO_SIDE_EFFECTS__
function un(e, t) {
  return new El({
    check: "mime_type",
    mime: e,
    ...N(t)
  });
}
s(un, "_mime");
// @__NO_SIDE_EFFECTS__
function jt(e) {
  return new Ol({
    check: "overwrite",
    tx: e
  });
}
s(jt, "_overwrite");
// @__NO_SIDE_EFFECTS__
function cn(e) {
  return /* @__PURE__ */ jt((t) => t.normalize(e));
}
s(cn, "_normalize");
// @__NO_SIDE_EFFECTS__
function dn() {
  return /* @__PURE__ */ jt((e) => e.trim());
}
s(dn, "_trim");
// @__NO_SIDE_EFFECTS__
function pn() {
  return /* @__PURE__ */ jt((e) => e.toLowerCase());
}
s(pn, "_toLowerCase");
// @__NO_SIDE_EFFECTS__
function mn() {
  return /* @__PURE__ */ jt((e) => e.toUpperCase());
}
s(mn, "_toUpperCase");
// @__NO_SIDE_EFFECTS__
function fn() {
  return /* @__PURE__ */ jt((e) => zs(e));
}
s(fn, "_slugify");
// @__NO_SIDE_EFFECTS__
function md(e, t, n) {
  return new e({
    type: "array",
    element: t,
    // get element() {
    //   return element;
    // },
    ...N(n)
  });
}
s(md, "_array");
// @__NO_SIDE_EFFECTS__
function m$(e, t, n) {
  return new e({
    type: "union",
    options: t,
    ...N(n)
  });
}
s(m$, "_union");
function f$(e, t, n) {
  return new e({
    type: "union",
    options: t,
    inclusive: !1,
    ...N(n)
  });
}
s(f$, "_xor");
// @__NO_SIDE_EFFECTS__
function g$(e, t, n, o) {
  return new e({
    type: "union",
    options: n,
    discriminator: t,
    ...N(o)
  });
}
s(g$, "_discriminatedUnion");
// @__NO_SIDE_EFFECTS__
function h$(e, t, n) {
  return new e({
    type: "intersection",
    left: t,
    right: n
  });
}
s(h$, "_intersection");
// @__NO_SIDE_EFFECTS__
function v$(e, t, n, o) {
  let r = n instanceof ee, i = r ? o : n, a = r ? n : null;
  return new e({
    type: "tuple",
    items: t,
    rest: a,
    ...N(i)
  });
}
s(v$, "_tuple");
// @__NO_SIDE_EFFECTS__
function y$(e, t, n, o) {
  return new e({
    type: "record",
    keyType: t,
    valueType: n,
    ...N(o)
  });
}
s(y$, "_record");
// @__NO_SIDE_EFFECTS__
function _$(e, t, n, o) {
  return new e({
    type: "map",
    keyType: t,
    valueType: n,
    ...N(o)
  });
}
s(_$, "_map");
// @__NO_SIDE_EFFECTS__
function b$(e, t, n) {
  return new e({
    type: "set",
    valueType: t,
    ...N(n)
  });
}
s(b$, "_set");
// @__NO_SIDE_EFFECTS__
function x$(e, t, n) {
  let o = Array.isArray(t) ? Object.fromEntries(t.map((r) => [r, r])) : t;
  return new e({
    type: "enum",
    entries: o,
    ...N(n)
  });
}
s(x$, "_enum");
// @__NO_SIDE_EFFECTS__
function $$(e, t, n) {
  return new e({
    type: "enum",
    entries: t,
    ...N(n)
  });
}
s($$, "_nativeEnum");
// @__NO_SIDE_EFFECTS__
function w$(e, t, n) {
  return new e({
    type: "literal",
    values: Array.isArray(t) ? t : [t],
    ...N(n)
  });
}
s(w$, "_literal");
// @__NO_SIDE_EFFECTS__
function fd(e, t) {
  return new e({
    type: "file",
    ...N(t)
  });
}
s(fd, "_file");
// @__NO_SIDE_EFFECTS__
function k$(e, t) {
  return new e({
    type: "transform",
    transform: t
  });
}
s(k$, "_transform");
// @__NO_SIDE_EFFECTS__
function I$(e, t) {
  return new e({
    type: "optional",
    innerType: t
  });
}
s(I$, "_optional");
// @__NO_SIDE_EFFECTS__
function S$(e, t) {
  return new e({
    type: "nullable",
    innerType: t
  });
}
s(S$, "_nullable");
// @__NO_SIDE_EFFECTS__
function T$(e, t, n) {
  return new e({
    type: "default",
    innerType: t,
    get defaultValue() {
      return typeof n == "function" ? n() : Os(n);
    }
  });
}
s(T$, "_default");
// @__NO_SIDE_EFFECTS__
function z$(e, t, n) {
  return new e({
    type: "nonoptional",
    innerType: t,
    ...N(n)
  });
}
s(z$, "_nonoptional");
// @__NO_SIDE_EFFECTS__
function E$(e, t) {
  return new e({
    type: "success",
    innerType: t
  });
}
s(E$, "_success");
// @__NO_SIDE_EFFECTS__
function O$(e, t, n) {
  return new e({
    type: "catch",
    innerType: t,
    catchValue: typeof n == "function" ? n : () => n
  });
}
s(O$, "_catch");
// @__NO_SIDE_EFFECTS__
function j$(e, t, n) {
  return new e({
    type: "pipe",
    in: t,
    out: n
  });
}
s(j$, "_pipe");
// @__NO_SIDE_EFFECTS__
function P$(e, t) {
  return new e({
    type: "readonly",
    innerType: t
  });
}
s(P$, "_readonly");
// @__NO_SIDE_EFFECTS__
function N$(e, t, n) {
  return new e({
    type: "template_literal",
    parts: t,
    ...N(n)
  });
}
s(N$, "_templateLiteral");
// @__NO_SIDE_EFFECTS__
function A$(e, t) {
  return new e({
    type: "lazy",
    getter: t
  });
}
s(A$, "_lazy");
// @__NO_SIDE_EFFECTS__
function R$(e, t) {
  return new e({
    type: "promise",
    innerType: t
  });
}
s(R$, "_promise");
// @__NO_SIDE_EFFECTS__
function gd(e, t, n) {
  let o = N(n);
  return o.abort ?? (o.abort = !0), new e({
    type: "custom",
    check: "custom",
    fn: t,
    ...o
  });
}
s(gd, "_custom");
// @__NO_SIDE_EFFECTS__
function hd(e, t, n) {
  return new e({
    type: "custom",
    check: "custom",
    fn: t,
    ...N(n)
  });
}
s(hd, "_refine");
// @__NO_SIDE_EFFECTS__
function vd(e) {
  let t = /* @__PURE__ */ Mf((n) => (n.addIssue = (o) => {
    if (typeof o == "string")
      n.issues.push(Kr(o, n.value, t._zod.def));
    else {
      let r = o;
      r.fatal && (r.continue = !1), r.code ?? (r.code = "custom"), r.input ?? (r.input = n.value), r.inst ?? (r.inst = t), r.continue ?? (r.continue = !t._zod.def.abort), n.issues.push(Kr(r));
    }
  }, e(n.value, n)));
  return t;
}
s(vd, "_superRefine");
// @__NO_SIDE_EFFECTS__
function Mf(e, t) {
  let n = new Oe({
    check: "custom",
    ...N(t)
  });
  return n._zod.check = e, n;
}
s(Mf, "_check");
// @__NO_SIDE_EFFECTS__
function yd(e) {
  let t = new Oe({ check: "describe" });
  return t._zod.onattach = [
    (n) => {
      let o = Be.get(n) ?? {};
      Be.add(n, { ...o, description: e });
    }
  ], t._zod.check = () => {
  }, t;
}
s(yd, "describe");
// @__NO_SIDE_EFFECTS__
function _d(e) {
  let t = new Oe({ check: "meta" });
  return t._zod.onattach = [
    (n) => {
      let o = Be.get(n) ?? {};
      Be.add(n, { ...o, ...e });
    }
  ], t._zod.check = () => {
  }, t;
}
s(_d, "meta");
// @__NO_SIDE_EFFECTS__
function bd(e, t) {
  let n = N(t), o = n.truthy ?? ["true", "1", "yes", "on", "y", "enabled"], r = n.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
  n.case !== "sensitive" && (o = o.map((m) => typeof m == "string" ? m.toLowerCase() : m), r = r.map((m) => typeof m == "string" ? m.toLowerCase() : m));
  let i = new Set(o), a = new Set(r), u = e.Codec ?? yo, c = e.Boolean ?? ho, d = e.String ?? Pr, p = new d({ type: "string", error: n.error }), f = new c({ type: "boolean", error: n.error }), h = new u({
    type: "pipe",
    in: p,
    out: f,
    transform: /* @__PURE__ */ s(((m, v) => {
      let b = m;
      return n.case !== "sensitive" && (b = b.toLowerCase()), i.has(b) ? !0 : a.has(b) ? !1 : (v.issues.push({
        code: "invalid_value",
        expected: "stringbool",
        values: [...i, ...a],
        input: v.value,
        inst: h,
        continue: !1
      }), {});
    }), "transform"),
    reverseTransform: /* @__PURE__ */ s(((m, v) => m === !0 ? o[0] || "true" : r[0] || "false"), "reverseTransform"),
    error: n.error
  });
  return h;
}
s(bd, "_stringbool");
// @__NO_SIDE_EFFECTS__
function gn(e, t, n, o = {}) {
  let r = N(o), i = {
    ...N(o),
    check: "string_format",
    type: "string",
    format: t,
    fn: typeof n == "function" ? n : (u) => n.test(u),
    ...r
  };
  return n instanceof RegExp && (i.pattern = n), new e(i);
}
s(gn, "_stringFormat");

// node_modules/zod/v4/core/to-json-schema.js
function yr(e) {
  let t = e?.target ?? "draft-2020-12";
  return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
    processors: e.processors ?? {},
    metadataRegistry: e?.metadata ?? Be,
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
s(yr, "initializeContext");
function Ie(e, t, n = { path: [], schemaPath: [] }) {
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
      let h = a.schema, m = t.processors[r.type];
      if (!m)
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${r.type}`);
      m(e, t, h, p);
    }
    let f = e._zod.parent;
    f && (a.ref || (a.ref = f), Ie(f, t, p), t.seen.get(f).isParent = !0);
  }
  let c = t.metadataRegistry.get(e);
  return c && Object.assign(a.schema, c), t.io === "input" && et(e) && (delete a.schema.examples, delete a.schema.default), t.io === "input" && a.schema._prefault && ((o = a.schema).default ?? (o.default = a.schema._prefault)), delete a.schema._prefault, t.seen.get(e).schema;
}
s(Ie, "process");
function _r(e, t) {
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
  let r = /* @__PURE__ */ s((a) => {
    let u = e.target === "draft-2020-12" ? "$defs" : "definitions";
    if (e.external) {
      let f = e.external.registry.get(a[0])?.id, h = e.external.uri ?? ((v) => v);
      if (f)
        return { ref: h(f) };
      let m = a[1].defId ?? a[1].schema.id ?? `schema${e.counter++}`;
      return a[1].defId = m, { defId: m, ref: `${h("__shared")}#/${u}/${m}` };
    }
    if (a[1] === n)
      return { ref: "#" };
    let d = `#/${u}/`, p = a[1].schema.id ?? `__schema${e.counter++}`;
    return { defId: p, ref: d + p };
  }, "makeURI"), i = /* @__PURE__ */ s((a) => {
    if (a[1].schema.$ref)
      return;
    let u = a[1], { ref: c, defId: d } = r(a);
    u.def = { ...u.schema }, d && (u.defId = d);
    let p = u.schema;
    for (let f in p)
      delete p[f];
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
s(_r, "extractDefs");
function br(e, t) {
  let n = e.seen.get(t);
  if (!n)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  let o = /* @__PURE__ */ s((a) => {
    let u = e.seen.get(a);
    if (u.ref === null)
      return;
    let c = u.def ?? u.schema, d = { ...c }, p = u.ref;
    if (u.ref = null, p) {
      o(p);
      let h = e.seen.get(p), m = h.schema;
      if (m.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (c.allOf = c.allOf ?? [], c.allOf.push(m)) : Object.assign(c, m), Object.assign(c, d), a._zod.parent === p)
        for (let b in c)
          b === "$ref" || b === "allOf" || b in d || delete c[b];
      if (m.$ref)
        for (let b in c)
          b === "$ref" || b === "allOf" || b in h.def && JSON.stringify(c[b]) === JSON.stringify(h.def[b]) && delete c[b];
    }
    let f = a._zod.parent;
    if (f && f !== p) {
      o(f);
      let h = e.seen.get(f);
      if (h?.schema.$ref && (c.$ref = h.schema.$ref, h.def))
        for (let m in c)
          m === "$ref" || m === "allOf" || m in h.def && JSON.stringify(c[m]) === JSON.stringify(h.def[m]) && delete c[m];
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
          input: hn(t, "input", e.processors),
          output: hn(t, "output", e.processors)
        }
      },
      enumerable: !1,
      writable: !1
    }), a;
  } catch {
    throw new Error("Error converting schema to JSON.");
  }
}
s(br, "finalize");
function et(e, t) {
  let n = t ?? { seen: /* @__PURE__ */ new Set() };
  if (n.seen.has(e))
    return !1;
  n.seen.add(e);
  let o = e._zod.def;
  if (o.type === "transform")
    return !0;
  if (o.type === "array")
    return et(o.element, n);
  if (o.type === "set")
    return et(o.valueType, n);
  if (o.type === "lazy")
    return et(o.getter(), n);
  if (o.type === "promise" || o.type === "optional" || o.type === "nonoptional" || o.type === "nullable" || o.type === "readonly" || o.type === "default" || o.type === "prefault")
    return et(o.innerType, n);
  if (o.type === "intersection")
    return et(o.left, n) || et(o.right, n);
  if (o.type === "record" || o.type === "map")
    return et(o.keyType, n) || et(o.valueType, n);
  if (o.type === "pipe")
    return et(o.in, n) || et(o.out, n);
  if (o.type === "object") {
    for (let r in o.shape)
      if (et(o.shape[r], n))
        return !0;
    return !1;
  }
  if (o.type === "union") {
    for (let r of o.options)
      if (et(r, n))
        return !0;
    return !1;
  }
  if (o.type === "tuple") {
    for (let r of o.items)
      if (et(r, n))
        return !0;
    return !!(o.rest && et(o.rest, n));
  }
  return !1;
}
s(et, "isTransforming");
var xd = /* @__PURE__ */ s((e, t = {}) => (n) => {
  let o = yr({ ...n, processors: t });
  return Ie(e, o), _r(o, e), br(o, e);
}, "createToJSONSchemaMethod"), hn = /* @__PURE__ */ s((e, t, n = {}) => (o) => {
  let { libraryOptions: r, target: i } = o ?? {}, a = yr({ ...r ?? {}, target: i, io: t, processors: n });
  return Ie(e, a), _r(a, e), br(a, e);
}, "createStandardJSONSchemaMethod");

// node_modules/zod/v4/core/json-schema-processors.js
var C$ = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
  // do not set
}, $d = /* @__PURE__ */ s((e, t, n, o) => {
  let r = n;
  r.type = "string";
  let { minimum: i, maximum: a, format: u, patterns: c, contentEncoding: d } = e._zod.bag;
  if (typeof i == "number" && (r.minLength = i), typeof a == "number" && (r.maxLength = a), u && (r.format = C$[u] ?? u, r.format === "" && delete r.format, u === "time" && delete r.format), d && (r.contentEncoding = d), c && c.size > 0) {
    let p = [...c];
    p.length === 1 ? r.pattern = p[0].source : p.length > 1 && (r.allOf = [
      ...p.map((f) => ({
        ...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
        pattern: f.source
      }))
    ]);
  }
}, "stringProcessor"), wd = /* @__PURE__ */ s((e, t, n, o) => {
  let r = n, { minimum: i, maximum: a, format: u, multipleOf: c, exclusiveMaximum: d, exclusiveMinimum: p } = e._zod.bag;
  typeof u == "string" && u.includes("int") ? r.type = "integer" : r.type = "number", typeof p == "number" && (t.target === "draft-04" || t.target === "openapi-3.0" ? (r.minimum = p, r.exclusiveMinimum = !0) : r.exclusiveMinimum = p), typeof i == "number" && (r.minimum = i, typeof p == "number" && t.target !== "draft-04" && (p >= i ? delete r.minimum : delete r.exclusiveMinimum)), typeof d == "number" && (t.target === "draft-04" || t.target === "openapi-3.0" ? (r.maximum = d, r.exclusiveMaximum = !0) : r.exclusiveMaximum = d), typeof a == "number" && (r.maximum = a, typeof d == "number" && t.target !== "draft-04" && (d <= a ? delete r.maximum : delete r.exclusiveMaximum)), typeof c == "number" && (r.multipleOf = c);
}, "numberProcessor"), kd = /* @__PURE__ */ s((e, t, n, o) => {
  n.type = "boolean";
}, "booleanProcessor"), Id = /* @__PURE__ */ s((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("BigInt cannot be represented in JSON Schema");
}, "bigintProcessor"), Sd = /* @__PURE__ */ s((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Symbols cannot be represented in JSON Schema");
}, "symbolProcessor"), Td = /* @__PURE__ */ s((e, t, n, o) => {
  t.target === "openapi-3.0" ? (n.type = "string", n.nullable = !0, n.enum = [null]) : n.type = "null";
}, "nullProcessor"), zd = /* @__PURE__ */ s((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Undefined cannot be represented in JSON Schema");
}, "undefinedProcessor"), Ed = /* @__PURE__ */ s((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Void cannot be represented in JSON Schema");
}, "voidProcessor"), Od = /* @__PURE__ */ s((e, t, n, o) => {
  n.not = {};
}, "neverProcessor"), jd = /* @__PURE__ */ s((e, t, n, o) => {
}, "anyProcessor"), Pd = /* @__PURE__ */ s((e, t, n, o) => {
}, "unknownProcessor"), Nd = /* @__PURE__ */ s((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Date cannot be represented in JSON Schema");
}, "dateProcessor"), Ad = /* @__PURE__ */ s((e, t, n, o) => {
  let r = e._zod.def, i = oo(r.entries);
  i.every((a) => typeof a == "number") && (n.type = "number"), i.every((a) => typeof a == "string") && (n.type = "string"), n.enum = i;
}, "enumProcessor"), Rd = /* @__PURE__ */ s((e, t, n, o) => {
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
}, "literalProcessor"), Cd = /* @__PURE__ */ s((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("NaN cannot be represented in JSON Schema");
}, "nanProcessor"), Dd = /* @__PURE__ */ s((e, t, n, o) => {
  let r = n, i = e._zod.pattern;
  if (!i)
    throw new Error("Pattern not found in template literal");
  r.type = "string", r.pattern = i.source;
}, "templateLiteralProcessor"), Ud = /* @__PURE__ */ s((e, t, n, o) => {
  let r = n, i = {
    type: "string",
    format: "binary",
    contentEncoding: "binary"
  }, { minimum: a, maximum: u, mime: c } = e._zod.bag;
  a !== void 0 && (i.minLength = a), u !== void 0 && (i.maxLength = u), c ? c.length === 1 ? (i.contentMediaType = c[0], Object.assign(r, i)) : (Object.assign(r, i), r.anyOf = c.map((d) => ({ contentMediaType: d }))) : Object.assign(r, i);
}, "fileProcessor"), Md = /* @__PURE__ */ s((e, t, n, o) => {
  n.type = "boolean";
}, "successProcessor"), Zd = /* @__PURE__ */ s((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Custom types cannot be represented in JSON Schema");
}, "customProcessor"), Ld = /* @__PURE__ */ s((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Function types cannot be represented in JSON Schema");
}, "functionProcessor"), Fd = /* @__PURE__ */ s((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Transforms cannot be represented in JSON Schema");
}, "transformProcessor"), Vd = /* @__PURE__ */ s((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Map cannot be represented in JSON Schema");
}, "mapProcessor"), qd = /* @__PURE__ */ s((e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Set cannot be represented in JSON Schema");
}, "setProcessor"), Jd = /* @__PURE__ */ s((e, t, n, o) => {
  let r = n, i = e._zod.def, { minimum: a, maximum: u } = e._zod.bag;
  typeof a == "number" && (r.minItems = a), typeof u == "number" && (r.maxItems = u), r.type = "array", r.items = Ie(i.element, t, { ...o, path: [...o.path, "items"] });
}, "arrayProcessor"), Bd = /* @__PURE__ */ s((e, t, n, o) => {
  let r = n, i = e._zod.def;
  r.type = "object", r.properties = {};
  let a = i.shape;
  for (let d in a)
    r.properties[d] = Ie(a[d], t, {
      ...o,
      path: [...o.path, "properties", d]
    });
  let u = new Set(Object.keys(a)), c = new Set([...u].filter((d) => {
    let p = i.shape[d]._zod;
    return t.io === "input" ? p.optin === void 0 : p.optout === void 0;
  }));
  c.size > 0 && (r.required = Array.from(c)), i.catchall?._zod.def.type === "never" ? r.additionalProperties = !1 : i.catchall ? i.catchall && (r.additionalProperties = Ie(i.catchall, t, {
    ...o,
    path: [...o.path, "additionalProperties"]
  })) : t.io === "output" && (r.additionalProperties = !1);
}, "objectProcessor"), ca = /* @__PURE__ */ s((e, t, n, o) => {
  let r = e._zod.def, i = r.inclusive === !1, a = r.options.map((u, c) => Ie(u, t, {
    ...o,
    path: [...o.path, i ? "oneOf" : "anyOf", c]
  }));
  i ? n.oneOf = a : n.anyOf = a;
}, "unionProcessor"), Gd = /* @__PURE__ */ s((e, t, n, o) => {
  let r = e._zod.def, i = Ie(r.left, t, {
    ...o,
    path: [...o.path, "allOf", 0]
  }), a = Ie(r.right, t, {
    ...o,
    path: [...o.path, "allOf", 1]
  }), u = /* @__PURE__ */ s((d) => "allOf" in d && Object.keys(d).length === 1, "isSimpleIntersection"), c = [
    ...u(i) ? i.allOf : [i],
    ...u(a) ? a.allOf : [a]
  ];
  n.allOf = c;
}, "intersectionProcessor"), Wd = /* @__PURE__ */ s((e, t, n, o) => {
  let r = n, i = e._zod.def;
  r.type = "array";
  let a = t.target === "draft-2020-12" ? "prefixItems" : "items", u = t.target === "draft-2020-12" || t.target === "openapi-3.0" ? "items" : "additionalItems", c = i.items.map((h, m) => Ie(h, t, {
    ...o,
    path: [...o.path, a, m]
  })), d = i.rest ? Ie(i.rest, t, {
    ...o,
    path: [...o.path, u, ...t.target === "openapi-3.0" ? [i.items.length] : []]
  }) : null;
  t.target === "draft-2020-12" ? (r.prefixItems = c, d && (r.items = d)) : t.target === "openapi-3.0" ? (r.items = {
    anyOf: c
  }, d && r.items.anyOf.push(d), r.minItems = c.length, d || (r.maxItems = c.length)) : (r.items = c, d && (r.additionalItems = d));
  let { minimum: p, maximum: f } = e._zod.bag;
  typeof p == "number" && (r.minItems = p), typeof f == "number" && (r.maxItems = f);
}, "tupleProcessor"), Kd = /* @__PURE__ */ s((e, t, n, o) => {
  let r = n, i = e._zod.def;
  r.type = "object";
  let a = i.keyType, c = a._zod.bag?.patterns;
  if (i.mode === "loose" && c && c.size > 0) {
    let p = Ie(i.valueType, t, {
      ...o,
      path: [...o.path, "patternProperties", "*"]
    });
    r.patternProperties = {};
    for (let f of c)
      r.patternProperties[f.source] = p;
  } else
    (t.target === "draft-07" || t.target === "draft-2020-12") && (r.propertyNames = Ie(i.keyType, t, {
      ...o,
      path: [...o.path, "propertyNames"]
    })), r.additionalProperties = Ie(i.valueType, t, {
      ...o,
      path: [...o.path, "additionalProperties"]
    });
  let d = a._zod.values;
  if (d) {
    let p = [...d].filter((f) => typeof f == "string" || typeof f == "number");
    p.length > 0 && (r.required = p);
  }
}, "recordProcessor"), Hd = /* @__PURE__ */ s((e, t, n, o) => {
  let r = e._zod.def, i = Ie(r.innerType, t, o), a = t.seen.get(e);
  t.target === "openapi-3.0" ? (a.ref = r.innerType, n.nullable = !0) : n.anyOf = [i, { type: "null" }];
}, "nullableProcessor"), Xd = /* @__PURE__ */ s((e, t, n, o) => {
  let r = e._zod.def;
  Ie(r.innerType, t, o);
  let i = t.seen.get(e);
  i.ref = r.innerType;
}, "nonoptionalProcessor"), Yd = /* @__PURE__ */ s((e, t, n, o) => {
  let r = e._zod.def;
  Ie(r.innerType, t, o);
  let i = t.seen.get(e);
  i.ref = r.innerType, n.default = JSON.parse(JSON.stringify(r.defaultValue));
}, "defaultProcessor"), Qd = /* @__PURE__ */ s((e, t, n, o) => {
  let r = e._zod.def;
  Ie(r.innerType, t, o);
  let i = t.seen.get(e);
  i.ref = r.innerType, t.io === "input" && (n._prefault = JSON.parse(JSON.stringify(r.defaultValue)));
}, "prefaultProcessor"), ep = /* @__PURE__ */ s((e, t, n, o) => {
  let r = e._zod.def;
  Ie(r.innerType, t, o);
  let i = t.seen.get(e);
  i.ref = r.innerType;
  let a;
  try {
    a = r.catchValue(void 0);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  n.default = a;
}, "catchProcessor"), tp = /* @__PURE__ */ s((e, t, n, o) => {
  let r = e._zod.def, i = t.io === "input" ? r.in._zod.def.type === "transform" ? r.out : r.in : r.out;
  Ie(i, t, o);
  let a = t.seen.get(e);
  a.ref = i;
}, "pipeProcessor"), rp = /* @__PURE__ */ s((e, t, n, o) => {
  let r = e._zod.def;
  Ie(r.innerType, t, o);
  let i = t.seen.get(e);
  i.ref = r.innerType, n.readOnly = !0;
}, "readonlyProcessor"), np = /* @__PURE__ */ s((e, t, n, o) => {
  let r = e._zod.def;
  Ie(r.innerType, t, o);
  let i = t.seen.get(e);
  i.ref = r.innerType;
}, "promiseProcessor"), da = /* @__PURE__ */ s((e, t, n, o) => {
  let r = e._zod.def;
  Ie(r.innerType, t, o);
  let i = t.seen.get(e);
  i.ref = r.innerType;
}, "optionalProcessor"), op = /* @__PURE__ */ s((e, t, n, o) => {
  let r = e._zod.innerType;
  Ie(r, t, o);
  let i = t.seen.get(e);
  i.ref = r;
}, "lazyProcessor"), ua = {
  string: $d,
  number: wd,
  boolean: kd,
  bigint: Id,
  symbol: Sd,
  null: Td,
  undefined: zd,
  void: Ed,
  never: Od,
  any: jd,
  unknown: Pd,
  date: Nd,
  enum: Ad,
  literal: Rd,
  nan: Cd,
  template_literal: Dd,
  file: Ud,
  success: Md,
  custom: Zd,
  function: Ld,
  transform: Fd,
  map: Vd,
  set: qd,
  array: Jd,
  object: Bd,
  union: ca,
  intersection: Gd,
  tuple: Wd,
  record: Kd,
  nullable: Hd,
  nonoptional: Xd,
  default: Yd,
  prefault: Qd,
  catch: ep,
  pipe: tp,
  readonly: rp,
  promise: np,
  optional: da,
  lazy: op
};
function vn(e, t) {
  if ("_idmap" in e) {
    let o = e, r = yr({ ...t, processors: ua }), i = {};
    for (let c of o._idmap.entries()) {
      let [d, p] = c;
      Ie(p, r);
    }
    let a = {}, u = {
      registry: o,
      uri: t?.uri,
      defs: i
    };
    r.external = u;
    for (let c of o._idmap.entries()) {
      let [d, p] = c;
      _r(r, p), a[d] = br(r, p);
    }
    if (Object.keys(i).length > 0) {
      let c = r.target === "draft-2020-12" ? "$defs" : "definitions";
      a.__shared = {
        [c]: i
      };
    }
    return { schemas: a };
  }
  let n = yr({ ...t, processors: ua });
  return Ie(e, n), _r(n, e), br(n, e);
}
s(vn, "toJSONSchema");

// node_modules/zod/v4/core/json-schema-generator.js
var pa = class {
  static {
    s(this, "JSONSchemaGenerator");
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
    n === "draft-4" && (n = "draft-04"), n === "draft-7" && (n = "draft-07"), this.ctx = yr({
      processors: ua,
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
    return Ie(t, this.ctx, n);
  }
  /**
   * Emit the final JSON Schema after processing.
   * Must call process() first.
   */
  emit(t, n) {
    n && (n.cycles && (this.ctx.cycles = n.cycles), n.reused && (this.ctx.reused = n.reused), n.external && (this.ctx.external = n.external)), _r(this.ctx, t);
    let o = br(this.ctx, t), { "~standard": r, ...i } = o;
    return i;
  }
};

// node_modules/zod/v4/core/json-schema.js
var Zf = {};

// node_modules/zod/v4/classic/schemas.js
var So = {};
Xt(So, {
  ZodAny: () => Tp,
  ZodArray: () => jp,
  ZodBase64: () => Na,
  ZodBase64URL: () => Aa,
  ZodBigInt: () => kn,
  ZodBigIntFormat: () => Da,
  ZodBoolean: () => wn,
  ZodCIDRv4: () => ja,
  ZodCIDRv6: () => Pa,
  ZodCUID: () => ka,
  ZodCUID2: () => Ia,
  ZodCatch: () => Qp,
  ZodCodec: () => Ja,
  ZodCustom: () => Uo,
  ZodCustomStringFormat: () => xn,
  ZodDate: () => No,
  ZodDefault: () => Gp,
  ZodDiscriminatedUnion: () => Np,
  ZodE164: () => Ra,
  ZodEmail: () => xa,
  ZodEmoji: () => $a,
  ZodEnum: () => _n,
  ZodExactOptional: () => qp,
  ZodFile: () => Fp,
  ZodFunction: () => lm,
  ZodGUID: () => zo,
  ZodIPv4: () => Ea,
  ZodIPv6: () => Oa,
  ZodIntersection: () => Ap,
  ZodJWT: () => Ca,
  ZodKSUID: () => za,
  ZodLazy: () => im,
  ZodLiteral: () => Lp,
  ZodMAC: () => bp,
  ZodMap: () => Mp,
  ZodNaN: () => tm,
  ZodNanoID: () => wa,
  ZodNever: () => Ep,
  ZodNonOptional: () => Va,
  ZodNull: () => Ip,
  ZodNullable: () => Bp,
  ZodNumber: () => $n,
  ZodNumberFormat: () => Dr,
  ZodObject: () => Ro,
  ZodOptional: () => Fa,
  ZodPipe: () => qa,
  ZodPrefault: () => Kp,
  ZodPromise: () => sm,
  ZodReadonly: () => rm,
  ZodRecord: () => Do,
  ZodSet: () => Zp,
  ZodString: () => bn,
  ZodStringFormat: () => ze,
  ZodSuccess: () => Yp,
  ZodSymbol: () => wp,
  ZodTemplateLiteral: () => om,
  ZodTransform: () => Vp,
  ZodTuple: () => Cp,
  ZodType: () => ne,
  ZodULID: () => Sa,
  ZodURL: () => Po,
  ZodUUID: () => Ft,
  ZodUndefined: () => kp,
  ZodUnion: () => Co,
  ZodUnknown: () => zp,
  ZodVoid: () => Op,
  ZodXID: () => Ta,
  ZodXor: () => Pp,
  _ZodString: () => ba,
  _default: () => Wp,
  _function: () => Gg,
  any: () => Ig,
  array: () => Ao,
  base64: () => lg,
  base64url: () => ug,
  bigint: () => bg,
  boolean: () => $p,
  catch: () => em,
  check: () => Wg,
  cidrv4: () => ag,
  cidrv6: () => sg,
  codec: () => qg,
  cuid: () => Yf,
  cuid2: () => Qf,
  custom: () => Kg,
  date: () => Tg,
  describe: () => Hg,
  discriminatedUnion: () => Ng,
  e164: () => cg,
  email: () => Ff,
  emoji: () => Hf,
  enum: () => Za,
  exactOptional: () => Jp,
  file: () => Zg,
  float32: () => hg,
  float64: () => vg,
  function: () => Gg,
  guid: () => Vf,
  hash: () => gg,
  hex: () => fg,
  hostname: () => mg,
  httpUrl: () => Kf,
  instanceof: () => Yg,
  int: () => _a,
  int32: () => yg,
  int64: () => xg,
  intersection: () => Rp,
  ipv4: () => ng,
  ipv6: () => ig,
  json: () => eh,
  jwt: () => dg,
  keyof: () => zg,
  ksuid: () => rg,
  lazy: () => am,
  literal: () => Mg,
  looseObject: () => jg,
  looseRecord: () => Rg,
  mac: () => og,
  map: () => Cg,
  meta: () => Xg,
  nan: () => Vg,
  nanoid: () => Xf,
  nativeEnum: () => Ug,
  never: () => Ua,
  nonoptional: () => Xp,
  null: () => Sp,
  nullable: () => Oo,
  nullish: () => Lg,
  number: () => xp,
  object: () => Eg,
  optional: () => Eo,
  partialRecord: () => Ag,
  pipe: () => jo,
  prefault: () => Hp,
  preprocess: () => th,
  promise: () => Bg,
  readonly: () => nm,
  record: () => Up,
  refine: () => um,
  set: () => Dg,
  strictObject: () => Og,
  string: () => ya,
  stringFormat: () => pg,
  stringbool: () => Qg,
  success: () => Fg,
  superRefine: () => cm,
  symbol: () => wg,
  templateLiteral: () => Jg,
  transform: () => La,
  tuple: () => Dp,
  uint32: () => _g,
  uint64: () => $g,
  ulid: () => eg,
  undefined: () => kg,
  union: () => Ma,
  unknown: () => Cr,
  url: () => Wf,
  uuid: () => qf,
  uuidv4: () => Jf,
  uuidv6: () => Bf,
  uuidv7: () => Gf,
  void: () => Sg,
  xid: () => tg,
  xor: () => Pg
});

// node_modules/zod/v4/classic/checks.js
var ma = {};
Xt(ma, {
  endsWith: () => ln,
  gt: () => Zt,
  gte: () => Qe,
  includes: () => an,
  length: () => Rr,
  lowercase: () => nn,
  lt: () => Mt,
  lte: () => vt,
  maxLength: () => Ar,
  maxSize: () => vr,
  mime: () => un,
  minLength: () => Qt,
  minSize: () => Lt,
  multipleOf: () => hr,
  negative: () => ia,
  nonnegative: () => sa,
  nonpositive: () => aa,
  normalize: () => cn,
  overwrite: () => jt,
  positive: () => oa,
  property: () => la,
  regex: () => rn,
  size: () => Nr,
  slugify: () => fn,
  startsWith: () => sn,
  toLowerCase: () => pn,
  toUpperCase: () => mn,
  trim: () => dn,
  uppercase: () => on
});

// node_modules/zod/v4/classic/iso.js
var yn = {};
Xt(yn, {
  ZodISODate: () => ga,
  ZodISODateTime: () => fa,
  ZodISODuration: () => va,
  ZodISOTime: () => ha,
  date: () => ap,
  datetime: () => ip,
  duration: () => lp,
  time: () => sp
});
var fa = /* @__PURE__ */ y("ZodISODateTime", (e, t) => {
  ql.init(e, t), ze.init(e, t);
});
function ip(e) {
  return Zc(fa, e);
}
s(ip, "datetime");
var ga = /* @__PURE__ */ y("ZodISODate", (e, t) => {
  Jl.init(e, t), ze.init(e, t);
});
function ap(e) {
  return Lc(ga, e);
}
s(ap, "date");
var ha = /* @__PURE__ */ y("ZodISOTime", (e, t) => {
  Bl.init(e, t), ze.init(e, t);
});
function sp(e) {
  return Fc(ha, e);
}
s(sp, "time");
var va = /* @__PURE__ */ y("ZodISODuration", (e, t) => {
  Gl.init(e, t), ze.init(e, t);
});
function lp(e) {
  return Vc(va, e);
}
s(lp, "duration");

// node_modules/zod/v4/classic/errors.js
var Lf = /* @__PURE__ */ s((e, t) => {
  uo.init(e, t), e.name = "ZodError", Object.defineProperties(e, {
    format: {
      value: /* @__PURE__ */ s((n) => po(e, n), "value")
      // enumerable: false,
    },
    flatten: {
      value: /* @__PURE__ */ s((n) => co(e, n), "value")
      // enumerable: false,
    },
    addIssue: {
      value: /* @__PURE__ */ s((n) => {
        e.issues.push(n), e.message = JSON.stringify(e.issues, Gr, 2);
      }, "value")
      // enumerable: false,
    },
    addIssues: {
      value: /* @__PURE__ */ s((n) => {
        e.issues.push(...n), e.message = JSON.stringify(e.issues, Gr, 2);
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
}, "initializer"), U$ = y("ZodError", Lf), ct = y("ZodError", Lf, {
  Parent: Error
});

// node_modules/zod/v4/classic/parse.js
var up = /* @__PURE__ */ Hr(ct), cp = /* @__PURE__ */ Xr(ct), dp = /* @__PURE__ */ Yr(ct), To = /* @__PURE__ */ Qr(ct), pp = /* @__PURE__ */ gi(ct), mp = /* @__PURE__ */ hi(ct), fp = /* @__PURE__ */ vi(ct), gp = /* @__PURE__ */ yi(ct), hp = /* @__PURE__ */ _i(ct), vp = /* @__PURE__ */ bi(ct), yp = /* @__PURE__ */ xi(ct), _p = /* @__PURE__ */ $i(ct);

// node_modules/zod/v4/classic/schemas.js
var ne = /* @__PURE__ */ y("ZodType", (e, t) => (ee.init(e, t), Object.assign(e["~standard"], {
  jsonSchema: {
    input: hn(e, "input"),
    output: hn(e, "output")
  }
}), e.toJSONSchema = xd(e, {}), e.def = t, e.type = t.type, Object.defineProperty(e, "_def", { value: t }), e.check = (...n) => e.clone(j.mergeDefs(t, {
  checks: [
    ...t.checks ?? [],
    ...n.map((o) => typeof o == "function" ? { _zod: { check: o, def: { check: "custom" }, onattach: [] } } : o)
  ]
}), {
  parent: !0
}), e.with = e.check, e.clone = (n, o) => Ye(e, n, o), e.brand = () => e, e.register = ((n, o) => (n.add(e, o), e)), e.parse = (n, o) => up(e, n, o, { callee: e.parse }), e.safeParse = (n, o) => dp(e, n, o), e.parseAsync = async (n, o) => cp(e, n, o, { callee: e.parseAsync }), e.safeParseAsync = async (n, o) => To(e, n, o), e.spa = e.safeParseAsync, e.encode = (n, o) => pp(e, n, o), e.decode = (n, o) => mp(e, n, o), e.encodeAsync = async (n, o) => fp(e, n, o), e.decodeAsync = async (n, o) => gp(e, n, o), e.safeEncode = (n, o) => hp(e, n, o), e.safeDecode = (n, o) => vp(e, n, o), e.safeEncodeAsync = async (n, o) => yp(e, n, o), e.safeDecodeAsync = async (n, o) => _p(e, n, o), e.refine = (n, o) => e.check(um(n, o)), e.superRefine = (n) => e.check(cm(n)), e.overwrite = (n) => e.check(jt(n)), e.optional = () => Eo(e), e.exactOptional = () => Jp(e), e.nullable = () => Oo(e), e.nullish = () => Eo(Oo(e)), e.nonoptional = (n) => Xp(e, n), e.array = () => Ao(e), e.or = (n) => Ma([e, n]), e.and = (n) => Rp(e, n), e.transform = (n) => jo(e, La(n)), e.default = (n) => Wp(e, n), e.prefault = (n) => Hp(e, n), e.catch = (n) => em(e, n), e.pipe = (n) => jo(e, n), e.readonly = () => nm(e), e.describe = (n) => {
  let o = e.clone();
  return Be.add(o, { description: n }), o;
}, Object.defineProperty(e, "description", {
  get() {
    return Be.get(e)?.description;
  },
  configurable: !0
}), e.meta = (...n) => {
  if (n.length === 0)
    return Be.get(e);
  let o = e.clone();
  return Be.add(o, n[0]), o;
}, e.isOptional = () => e.safeParse(void 0).success, e.isNullable = () => e.safeParse(null).success, e.apply = (n) => n(e), e)), ba = /* @__PURE__ */ y("_ZodString", (e, t) => {
  Pr.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (o, r, i) => $d(e, o, r, i);
  let n = e._zod.bag;
  e.format = n.format ?? null, e.minLength = n.minimum ?? null, e.maxLength = n.maximum ?? null, e.regex = (...o) => e.check(rn(...o)), e.includes = (...o) => e.check(an(...o)), e.startsWith = (...o) => e.check(sn(...o)), e.endsWith = (...o) => e.check(ln(...o)), e.min = (...o) => e.check(Qt(...o)), e.max = (...o) => e.check(Ar(...o)), e.length = (...o) => e.check(Rr(...o)), e.nonempty = (...o) => e.check(Qt(1, ...o)), e.lowercase = (o) => e.check(nn(o)), e.uppercase = (o) => e.check(on(o)), e.trim = () => e.check(dn()), e.normalize = (...o) => e.check(cn(...o)), e.toLowerCase = () => e.check(pn()), e.toUpperCase = () => e.check(mn()), e.slugify = () => e.check(fn());
}), bn = /* @__PURE__ */ y("ZodString", (e, t) => {
  Pr.init(e, t), ba.init(e, t), e.email = (n) => e.check(Ui(xa, n)), e.url = (n) => e.check(Io(Po, n)), e.jwt = (n) => e.check(na(Ca, n)), e.emoji = (n) => e.check(Vi($a, n)), e.guid = (n) => e.check(ko(zo, n)), e.uuid = (n) => e.check(Mi(Ft, n)), e.uuidv4 = (n) => e.check(Zi(Ft, n)), e.uuidv6 = (n) => e.check(Li(Ft, n)), e.uuidv7 = (n) => e.check(Fi(Ft, n)), e.nanoid = (n) => e.check(qi(wa, n)), e.guid = (n) => e.check(ko(zo, n)), e.cuid = (n) => e.check(Ji(ka, n)), e.cuid2 = (n) => e.check(Bi(Ia, n)), e.ulid = (n) => e.check(Gi(Sa, n)), e.base64 = (n) => e.check(ea(Na, n)), e.base64url = (n) => e.check(ta(Aa, n)), e.xid = (n) => e.check(Wi(Ta, n)), e.ksuid = (n) => e.check(Ki(za, n)), e.ipv4 = (n) => e.check(Hi(Ea, n)), e.ipv6 = (n) => e.check(Xi(Oa, n)), e.cidrv4 = (n) => e.check(Yi(ja, n)), e.cidrv6 = (n) => e.check(Qi(Pa, n)), e.e164 = (n) => e.check(ra(Ra, n)), e.datetime = (n) => e.check(ip(n)), e.date = (n) => e.check(ap(n)), e.time = (n) => e.check(sp(n)), e.duration = (n) => e.check(lp(n));
});
function ya(e) {
  return Cc(bn, e);
}
s(ya, "string");
var ze = /* @__PURE__ */ y("ZodStringFormat", (e, t) => {
  Te.init(e, t), ba.init(e, t);
}), xa = /* @__PURE__ */ y("ZodEmail", (e, t) => {
  Rl.init(e, t), ze.init(e, t);
});
function Ff(e) {
  return Ui(xa, e);
}
s(Ff, "email");
var zo = /* @__PURE__ */ y("ZodGUID", (e, t) => {
  Nl.init(e, t), ze.init(e, t);
});
function Vf(e) {
  return ko(zo, e);
}
s(Vf, "guid");
var Ft = /* @__PURE__ */ y("ZodUUID", (e, t) => {
  Al.init(e, t), ze.init(e, t);
});
function qf(e) {
  return Mi(Ft, e);
}
s(qf, "uuid");
function Jf(e) {
  return Zi(Ft, e);
}
s(Jf, "uuidv4");
function Bf(e) {
  return Li(Ft, e);
}
s(Bf, "uuidv6");
function Gf(e) {
  return Fi(Ft, e);
}
s(Gf, "uuidv7");
var Po = /* @__PURE__ */ y("ZodURL", (e, t) => {
  Cl.init(e, t), ze.init(e, t);
});
function Wf(e) {
  return Io(Po, e);
}
s(Wf, "url");
function Kf(e) {
  return Io(Po, {
    protocol: /^https?$/,
    hostname: kt.domain,
    ...j.normalizeParams(e)
  });
}
s(Kf, "httpUrl");
var $a = /* @__PURE__ */ y("ZodEmoji", (e, t) => {
  Dl.init(e, t), ze.init(e, t);
});
function Hf(e) {
  return Vi($a, e);
}
s(Hf, "emoji");
var wa = /* @__PURE__ */ y("ZodNanoID", (e, t) => {
  Ul.init(e, t), ze.init(e, t);
});
function Xf(e) {
  return qi(wa, e);
}
s(Xf, "nanoid");
var ka = /* @__PURE__ */ y("ZodCUID", (e, t) => {
  Ml.init(e, t), ze.init(e, t);
});
function Yf(e) {
  return Ji(ka, e);
}
s(Yf, "cuid");
var Ia = /* @__PURE__ */ y("ZodCUID2", (e, t) => {
  Zl.init(e, t), ze.init(e, t);
});
function Qf(e) {
  return Bi(Ia, e);
}
s(Qf, "cuid2");
var Sa = /* @__PURE__ */ y("ZodULID", (e, t) => {
  Ll.init(e, t), ze.init(e, t);
});
function eg(e) {
  return Gi(Sa, e);
}
s(eg, "ulid");
var Ta = /* @__PURE__ */ y("ZodXID", (e, t) => {
  Fl.init(e, t), ze.init(e, t);
});
function tg(e) {
  return Wi(Ta, e);
}
s(tg, "xid");
var za = /* @__PURE__ */ y("ZodKSUID", (e, t) => {
  Vl.init(e, t), ze.init(e, t);
});
function rg(e) {
  return Ki(za, e);
}
s(rg, "ksuid");
var Ea = /* @__PURE__ */ y("ZodIPv4", (e, t) => {
  Wl.init(e, t), ze.init(e, t);
});
function ng(e) {
  return Hi(Ea, e);
}
s(ng, "ipv4");
var bp = /* @__PURE__ */ y("ZodMAC", (e, t) => {
  Hl.init(e, t), ze.init(e, t);
});
function og(e) {
  return Uc(bp, e);
}
s(og, "mac");
var Oa = /* @__PURE__ */ y("ZodIPv6", (e, t) => {
  Kl.init(e, t), ze.init(e, t);
});
function ig(e) {
  return Xi(Oa, e);
}
s(ig, "ipv6");
var ja = /* @__PURE__ */ y("ZodCIDRv4", (e, t) => {
  Xl.init(e, t), ze.init(e, t);
});
function ag(e) {
  return Yi(ja, e);
}
s(ag, "cidrv4");
var Pa = /* @__PURE__ */ y("ZodCIDRv6", (e, t) => {
  Yl.init(e, t), ze.init(e, t);
});
function sg(e) {
  return Qi(Pa, e);
}
s(sg, "cidrv6");
var Na = /* @__PURE__ */ y("ZodBase64", (e, t) => {
  eu.init(e, t), ze.init(e, t);
});
function lg(e) {
  return ea(Na, e);
}
s(lg, "base64");
var Aa = /* @__PURE__ */ y("ZodBase64URL", (e, t) => {
  tu.init(e, t), ze.init(e, t);
});
function ug(e) {
  return ta(Aa, e);
}
s(ug, "base64url");
var Ra = /* @__PURE__ */ y("ZodE164", (e, t) => {
  ru.init(e, t), ze.init(e, t);
});
function cg(e) {
  return ra(Ra, e);
}
s(cg, "e164");
var Ca = /* @__PURE__ */ y("ZodJWT", (e, t) => {
  nu.init(e, t), ze.init(e, t);
});
function dg(e) {
  return na(Ca, e);
}
s(dg, "jwt");
var xn = /* @__PURE__ */ y("ZodCustomStringFormat", (e, t) => {
  ou.init(e, t), ze.init(e, t);
});
function pg(e, t, n = {}) {
  return gn(xn, e, t, n);
}
s(pg, "stringFormat");
function mg(e) {
  return gn(xn, "hostname", kt.hostname, e);
}
s(mg, "hostname");
function fg(e) {
  return gn(xn, "hex", kt.hex, e);
}
s(fg, "hex");
function gg(e, t) {
  let n = t?.enc ?? "hex", o = `${e}_${n}`, r = kt[o];
  if (!r)
    throw new Error(`Unrecognized hash format: ${o}`);
  return gn(xn, o, r, t);
}
s(gg, "hash");
var $n = /* @__PURE__ */ y("ZodNumber", (e, t) => {
  Pi.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (o, r, i) => wd(e, o, r, i), e.gt = (o, r) => e.check(Zt(o, r)), e.gte = (o, r) => e.check(Qe(o, r)), e.min = (o, r) => e.check(Qe(o, r)), e.lt = (o, r) => e.check(Mt(o, r)), e.lte = (o, r) => e.check(vt(o, r)), e.max = (o, r) => e.check(vt(o, r)), e.int = (o) => e.check(_a(o)), e.safe = (o) => e.check(_a(o)), e.positive = (o) => e.check(Zt(0, o)), e.nonnegative = (o) => e.check(Qe(0, o)), e.negative = (o) => e.check(Mt(0, o)), e.nonpositive = (o) => e.check(vt(0, o)), e.multipleOf = (o, r) => e.check(hr(o, r)), e.step = (o, r) => e.check(hr(o, r)), e.finite = () => e;
  let n = e._zod.bag;
  e.minValue = Math.max(n.minimum ?? Number.NEGATIVE_INFINITY, n.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null, e.maxValue = Math.min(n.maximum ?? Number.POSITIVE_INFINITY, n.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null, e.isInt = (n.format ?? "").includes("int") || Number.isSafeInteger(n.multipleOf ?? 0.5), e.isFinite = !0, e.format = n.format ?? null;
});
function xp(e) {
  return qc($n, e);
}
s(xp, "number");
var Dr = /* @__PURE__ */ y("ZodNumberFormat", (e, t) => {
  iu.init(e, t), $n.init(e, t);
});
function _a(e) {
  return Bc(Dr, e);
}
s(_a, "int");
function hg(e) {
  return Gc(Dr, e);
}
s(hg, "float32");
function vg(e) {
  return Wc(Dr, e);
}
s(vg, "float64");
function yg(e) {
  return Kc(Dr, e);
}
s(yg, "int32");
function _g(e) {
  return Hc(Dr, e);
}
s(_g, "uint32");
var wn = /* @__PURE__ */ y("ZodBoolean", (e, t) => {
  ho.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => kd(e, n, o, r);
});
function $p(e) {
  return Xc(wn, e);
}
s($p, "boolean");
var kn = /* @__PURE__ */ y("ZodBigInt", (e, t) => {
  Ni.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (o, r, i) => Id(e, o, r, i), e.gte = (o, r) => e.check(Qe(o, r)), e.min = (o, r) => e.check(Qe(o, r)), e.gt = (o, r) => e.check(Zt(o, r)), e.gte = (o, r) => e.check(Qe(o, r)), e.min = (o, r) => e.check(Qe(o, r)), e.lt = (o, r) => e.check(Mt(o, r)), e.lte = (o, r) => e.check(vt(o, r)), e.max = (o, r) => e.check(vt(o, r)), e.positive = (o) => e.check(Zt(BigInt(0), o)), e.negative = (o) => e.check(Mt(BigInt(0), o)), e.nonpositive = (o) => e.check(vt(BigInt(0), o)), e.nonnegative = (o) => e.check(Qe(BigInt(0), o)), e.multipleOf = (o, r) => e.check(hr(o, r));
  let n = e._zod.bag;
  e.minValue = n.minimum ?? null, e.maxValue = n.maximum ?? null, e.format = n.format ?? null;
});
function bg(e) {
  return Qc(kn, e);
}
s(bg, "bigint");
var Da = /* @__PURE__ */ y("ZodBigIntFormat", (e, t) => {
  au.init(e, t), kn.init(e, t);
});
function xg(e) {
  return td(Da, e);
}
s(xg, "int64");
function $g(e) {
  return rd(Da, e);
}
s($g, "uint64");
var wp = /* @__PURE__ */ y("ZodSymbol", (e, t) => {
  su.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Sd(e, n, o, r);
});
function wg(e) {
  return nd(wp, e);
}
s(wg, "symbol");
var kp = /* @__PURE__ */ y("ZodUndefined", (e, t) => {
  lu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => zd(e, n, o, r);
});
function kg(e) {
  return od(kp, e);
}
s(kg, "_undefined");
var Ip = /* @__PURE__ */ y("ZodNull", (e, t) => {
  uu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Td(e, n, o, r);
});
function Sp(e) {
  return id(Ip, e);
}
s(Sp, "_null");
var Tp = /* @__PURE__ */ y("ZodAny", (e, t) => {
  cu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => jd(e, n, o, r);
});
function Ig() {
  return ad(Tp);
}
s(Ig, "any");
var zp = /* @__PURE__ */ y("ZodUnknown", (e, t) => {
  du.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Pd(e, n, o, r);
});
function Cr() {
  return sd(zp);
}
s(Cr, "unknown");
var Ep = /* @__PURE__ */ y("ZodNever", (e, t) => {
  pu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Od(e, n, o, r);
});
function Ua(e) {
  return ld(Ep, e);
}
s(Ua, "never");
var Op = /* @__PURE__ */ y("ZodVoid", (e, t) => {
  mu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Ed(e, n, o, r);
});
function Sg(e) {
  return ud(Op, e);
}
s(Sg, "_void");
var No = /* @__PURE__ */ y("ZodDate", (e, t) => {
  fu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (o, r, i) => Nd(e, o, r, i), e.min = (o, r) => e.check(Qe(o, r)), e.max = (o, r) => e.check(vt(o, r));
  let n = e._zod.bag;
  e.minDate = n.minimum ? new Date(n.minimum) : null, e.maxDate = n.maximum ? new Date(n.maximum) : null;
});
function Tg(e) {
  return cd(No, e);
}
s(Tg, "date");
var jp = /* @__PURE__ */ y("ZodArray", (e, t) => {
  gu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Jd(e, n, o, r), e.element = t.element, e.min = (n, o) => e.check(Qt(n, o)), e.nonempty = (n) => e.check(Qt(1, n)), e.max = (n, o) => e.check(Ar(n, o)), e.length = (n, o) => e.check(Rr(n, o)), e.unwrap = () => e.element;
});
function Ao(e, t) {
  return md(jp, e, t);
}
s(Ao, "array");
function zg(e) {
  let t = e._zod.def.shape;
  return Za(Object.keys(t));
}
s(zg, "keyof");
var Ro = /* @__PURE__ */ y("ZodObject", (e, t) => {
  hu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Bd(e, n, o, r), j.defineLazy(e, "shape", () => t.shape), e.keyof = () => Za(Object.keys(e._zod.def.shape)), e.catchall = (n) => e.clone({ ...e._zod.def, catchall: n }), e.passthrough = () => e.clone({ ...e._zod.def, catchall: Cr() }), e.loose = () => e.clone({ ...e._zod.def, catchall: Cr() }), e.strict = () => e.clone({ ...e._zod.def, catchall: Ua() }), e.strip = () => e.clone({ ...e._zod.def, catchall: void 0 }), e.extend = (n) => j.extend(e, n), e.safeExtend = (n) => j.safeExtend(e, n), e.merge = (n) => j.merge(e, n), e.pick = (n) => j.pick(e, n), e.omit = (n) => j.omit(e, n), e.partial = (...n) => j.partial(Fa, e, n[0]), e.required = (...n) => j.required(Va, e, n[0]);
});
function Eg(e, t) {
  let n = {
    type: "object",
    shape: e ?? {},
    ...j.normalizeParams(t)
  };
  return new Ro(n);
}
s(Eg, "object");
function Og(e, t) {
  return new Ro({
    type: "object",
    shape: e,
    catchall: Ua(),
    ...j.normalizeParams(t)
  });
}
s(Og, "strictObject");
function jg(e, t) {
  return new Ro({
    type: "object",
    shape: e,
    catchall: Cr(),
    ...j.normalizeParams(t)
  });
}
s(jg, "looseObject");
var Co = /* @__PURE__ */ y("ZodUnion", (e, t) => {
  vo.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => ca(e, n, o, r), e.options = t.options;
});
function Ma(e, t) {
  return new Co({
    type: "union",
    options: e,
    ...j.normalizeParams(t)
  });
}
s(Ma, "union");
var Pp = /* @__PURE__ */ y("ZodXor", (e, t) => {
  Co.init(e, t), vu.init(e, t), e._zod.processJSONSchema = (n, o, r) => ca(e, n, o, r), e.options = t.options;
});
function Pg(e, t) {
  return new Pp({
    type: "union",
    options: e,
    inclusive: !1,
    ...j.normalizeParams(t)
  });
}
s(Pg, "xor");
var Np = /* @__PURE__ */ y("ZodDiscriminatedUnion", (e, t) => {
  Co.init(e, t), yu.init(e, t);
});
function Ng(e, t, n) {
  return new Np({
    type: "union",
    options: t,
    discriminator: e,
    ...j.normalizeParams(n)
  });
}
s(Ng, "discriminatedUnion");
var Ap = /* @__PURE__ */ y("ZodIntersection", (e, t) => {
  _u.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Gd(e, n, o, r);
});
function Rp(e, t) {
  return new Ap({
    type: "intersection",
    left: e,
    right: t
  });
}
s(Rp, "intersection");
var Cp = /* @__PURE__ */ y("ZodTuple", (e, t) => {
  Ai.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Wd(e, n, o, r), e.rest = (n) => e.clone({
    ...e._zod.def,
    rest: n
  });
});
function Dp(e, t, n) {
  let o = t instanceof ee, r = o ? n : t, i = o ? t : null;
  return new Cp({
    type: "tuple",
    items: e,
    rest: i,
    ...j.normalizeParams(r)
  });
}
s(Dp, "tuple");
var Do = /* @__PURE__ */ y("ZodRecord", (e, t) => {
  bu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Kd(e, n, o, r), e.keyType = t.keyType, e.valueType = t.valueType;
});
function Up(e, t, n) {
  return new Do({
    type: "record",
    keyType: e,
    valueType: t,
    ...j.normalizeParams(n)
  });
}
s(Up, "record");
function Ag(e, t, n) {
  let o = Ye(e);
  return o._zod.values = void 0, new Do({
    type: "record",
    keyType: o,
    valueType: t,
    ...j.normalizeParams(n)
  });
}
s(Ag, "partialRecord");
function Rg(e, t, n) {
  return new Do({
    type: "record",
    keyType: e,
    valueType: t,
    mode: "loose",
    ...j.normalizeParams(n)
  });
}
s(Rg, "looseRecord");
var Mp = /* @__PURE__ */ y("ZodMap", (e, t) => {
  xu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Vd(e, n, o, r), e.keyType = t.keyType, e.valueType = t.valueType, e.min = (...n) => e.check(Lt(...n)), e.nonempty = (n) => e.check(Lt(1, n)), e.max = (...n) => e.check(vr(...n)), e.size = (...n) => e.check(Nr(...n));
});
function Cg(e, t, n) {
  return new Mp({
    type: "map",
    keyType: e,
    valueType: t,
    ...j.normalizeParams(n)
  });
}
s(Cg, "map");
var Zp = /* @__PURE__ */ y("ZodSet", (e, t) => {
  $u.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => qd(e, n, o, r), e.min = (...n) => e.check(Lt(...n)), e.nonempty = (n) => e.check(Lt(1, n)), e.max = (...n) => e.check(vr(...n)), e.size = (...n) => e.check(Nr(...n));
});
function Dg(e, t) {
  return new Zp({
    type: "set",
    valueType: e,
    ...j.normalizeParams(t)
  });
}
s(Dg, "set");
var _n = /* @__PURE__ */ y("ZodEnum", (e, t) => {
  wu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (o, r, i) => Ad(e, o, r, i), e.enum = t.entries, e.options = Object.values(t.entries);
  let n = new Set(Object.keys(t.entries));
  e.extract = (o, r) => {
    let i = {};
    for (let a of o)
      if (n.has(a))
        i[a] = t.entries[a];
      else
        throw new Error(`Key ${a} not found in enum`);
    return new _n({
      ...t,
      checks: [],
      ...j.normalizeParams(r),
      entries: i
    });
  }, e.exclude = (o, r) => {
    let i = { ...t.entries };
    for (let a of o)
      if (n.has(a))
        delete i[a];
      else
        throw new Error(`Key ${a} not found in enum`);
    return new _n({
      ...t,
      checks: [],
      ...j.normalizeParams(r),
      entries: i
    });
  };
});
function Za(e, t) {
  let n = Array.isArray(e) ? Object.fromEntries(e.map((o) => [o, o])) : e;
  return new _n({
    type: "enum",
    entries: n,
    ...j.normalizeParams(t)
  });
}
s(Za, "_enum");
function Ug(e, t) {
  return new _n({
    type: "enum",
    entries: e,
    ...j.normalizeParams(t)
  });
}
s(Ug, "nativeEnum");
var Lp = /* @__PURE__ */ y("ZodLiteral", (e, t) => {
  ku.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Rd(e, n, o, r), e.values = new Set(t.values), Object.defineProperty(e, "value", {
    get() {
      if (t.values.length > 1)
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      return t.values[0];
    }
  });
});
function Mg(e, t) {
  return new Lp({
    type: "literal",
    values: Array.isArray(e) ? e : [e],
    ...j.normalizeParams(t)
  });
}
s(Mg, "literal");
var Fp = /* @__PURE__ */ y("ZodFile", (e, t) => {
  Iu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Ud(e, n, o, r), e.min = (n, o) => e.check(Lt(n, o)), e.max = (n, o) => e.check(vr(n, o)), e.mime = (n, o) => e.check(un(Array.isArray(n) ? n : [n], o));
});
function Zg(e) {
  return fd(Fp, e);
}
s(Zg, "file");
var Vp = /* @__PURE__ */ y("ZodTransform", (e, t) => {
  Su.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Fd(e, n, o, r), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      throw new dr(e.constructor.name);
    n.addIssue = (i) => {
      if (typeof i == "string")
        n.issues.push(j.issue(i, n.value, t));
      else {
        let a = i;
        a.fatal && (a.continue = !1), a.code ?? (a.code = "custom"), a.input ?? (a.input = n.value), a.inst ?? (a.inst = e), n.issues.push(j.issue(a));
      }
    };
    let r = t.transform(n.value, n);
    return r instanceof Promise ? r.then((i) => (n.value = i, n)) : (n.value = r, n);
  };
});
function La(e) {
  return new Vp({
    type: "transform",
    transform: e
  });
}
s(La, "transform");
var Fa = /* @__PURE__ */ y("ZodOptional", (e, t) => {
  Ri.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => da(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function Eo(e) {
  return new Fa({
    type: "optional",
    innerType: e
  });
}
s(Eo, "optional");
var qp = /* @__PURE__ */ y("ZodExactOptional", (e, t) => {
  Tu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => da(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function Jp(e) {
  return new qp({
    type: "optional",
    innerType: e
  });
}
s(Jp, "exactOptional");
var Bp = /* @__PURE__ */ y("ZodNullable", (e, t) => {
  zu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Hd(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function Oo(e) {
  return new Bp({
    type: "nullable",
    innerType: e
  });
}
s(Oo, "nullable");
function Lg(e) {
  return Eo(Oo(e));
}
s(Lg, "nullish");
var Gp = /* @__PURE__ */ y("ZodDefault", (e, t) => {
  Eu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Yd(e, n, o, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function Wp(e, t) {
  return new Gp({
    type: "default",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : j.shallowClone(t);
    }
  });
}
s(Wp, "_default");
var Kp = /* @__PURE__ */ y("ZodPrefault", (e, t) => {
  Ou.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Qd(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function Hp(e, t) {
  return new Kp({
    type: "prefault",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : j.shallowClone(t);
    }
  });
}
s(Hp, "prefault");
var Va = /* @__PURE__ */ y("ZodNonOptional", (e, t) => {
  ju.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Xd(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function Xp(e, t) {
  return new Va({
    type: "nonoptional",
    innerType: e,
    ...j.normalizeParams(t)
  });
}
s(Xp, "nonoptional");
var Yp = /* @__PURE__ */ y("ZodSuccess", (e, t) => {
  Pu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Md(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function Fg(e) {
  return new Yp({
    type: "success",
    innerType: e
  });
}
s(Fg, "success");
var Qp = /* @__PURE__ */ y("ZodCatch", (e, t) => {
  Nu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => ep(e, n, o, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function em(e, t) {
  return new Qp({
    type: "catch",
    innerType: e,
    catchValue: typeof t == "function" ? t : () => t
  });
}
s(em, "_catch");
var tm = /* @__PURE__ */ y("ZodNaN", (e, t) => {
  Au.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Cd(e, n, o, r);
});
function Vg(e) {
  return pd(tm, e);
}
s(Vg, "nan");
var qa = /* @__PURE__ */ y("ZodPipe", (e, t) => {
  Ru.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => tp(e, n, o, r), e.in = t.in, e.out = t.out;
});
function jo(e, t) {
  return new qa({
    type: "pipe",
    in: e,
    out: t
    // ...util.normalizeParams(params),
  });
}
s(jo, "pipe");
var Ja = /* @__PURE__ */ y("ZodCodec", (e, t) => {
  qa.init(e, t), yo.init(e, t);
});
function qg(e, t, n) {
  return new Ja({
    type: "pipe",
    in: e,
    out: t,
    transform: n.decode,
    reverseTransform: n.encode
  });
}
s(qg, "codec");
var rm = /* @__PURE__ */ y("ZodReadonly", (e, t) => {
  Cu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => rp(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function nm(e) {
  return new rm({
    type: "readonly",
    innerType: e
  });
}
s(nm, "readonly");
var om = /* @__PURE__ */ y("ZodTemplateLiteral", (e, t) => {
  Du.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Dd(e, n, o, r);
});
function Jg(e, t) {
  return new om({
    type: "template_literal",
    parts: e,
    ...j.normalizeParams(t)
  });
}
s(Jg, "templateLiteral");
var im = /* @__PURE__ */ y("ZodLazy", (e, t) => {
  Zu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => op(e, n, o, r), e.unwrap = () => e._zod.def.getter();
});
function am(e) {
  return new im({
    type: "lazy",
    getter: e
  });
}
s(am, "lazy");
var sm = /* @__PURE__ */ y("ZodPromise", (e, t) => {
  Mu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => np(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function Bg(e) {
  return new sm({
    type: "promise",
    innerType: e
  });
}
s(Bg, "promise");
var lm = /* @__PURE__ */ y("ZodFunction", (e, t) => {
  Uu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Ld(e, n, o, r);
});
function Gg(e) {
  return new lm({
    type: "function",
    input: Array.isArray(e?.input) ? Dp(e?.input) : e?.input ?? Ao(Cr()),
    output: e?.output ?? Cr()
  });
}
s(Gg, "_function");
var Uo = /* @__PURE__ */ y("ZodCustom", (e, t) => {
  Lu.init(e, t), ne.init(e, t), e._zod.processJSONSchema = (n, o, r) => Zd(e, n, o, r);
});
function Wg(e) {
  let t = new Oe({
    check: "custom"
    // ...util.normalizeParams(params),
  });
  return t._zod.check = e, t;
}
s(Wg, "check");
function Kg(e, t) {
  return gd(Uo, e ?? (() => !0), t);
}
s(Kg, "custom");
function um(e, t = {}) {
  return hd(Uo, e, t);
}
s(um, "refine");
function cm(e) {
  return vd(e);
}
s(cm, "superRefine");
var Hg = yd, Xg = _d;
function Yg(e, t = {}) {
  let n = new Uo({
    type: "custom",
    check: "custom",
    fn: /* @__PURE__ */ s((o) => o instanceof e, "fn"),
    abort: !0,
    ...j.normalizeParams(t)
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
s(Yg, "_instanceof");
var Qg = /* @__PURE__ */ s((...e) => bd({
  Codec: Ja,
  Boolean: wn,
  String: bn
}, ...e), "stringbool");
function eh(e) {
  let t = am(() => Ma([ya(e), xp(), $p(), Sp(), Ao(t), Up(ya(), t)]));
  return t;
}
s(eh, "json");
function th(e, t) {
  return jo(La(e), t);
}
s(th, "preprocess");

// node_modules/zod/v4/classic/compat.js
var Z$ = {
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
function L$(e) {
  Re({
    customError: e
  });
}
s(L$, "setErrorMap");
function F$() {
  return Re().customError;
}
s(F$, "getErrorMap");
var dm;
dm || (dm = {});

// node_modules/zod/v4/classic/from-json-schema.js
var A = {
  ...So,
  ...ma,
  iso: yn
}, V$ = /* @__PURE__ */ new Set([
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
function q$(e, t) {
  let n = e.$schema;
  return n === "https://json-schema.org/draft/2020-12/schema" ? "draft-2020-12" : n === "http://json-schema.org/draft-07/schema#" ? "draft-7" : n === "http://json-schema.org/draft-04/schema#" ? "draft-4" : t ?? "draft-2020-12";
}
s(q$, "detectVersion");
function J$(e, t) {
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
s(J$, "resolveRef");
function rh(e, t) {
  if (e.not !== void 0) {
    if (typeof e.not == "object" && Object.keys(e.not).length === 0)
      return A.never();
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
      return A.lazy(() => {
        if (!t.refs.has(r))
          throw new Error(`Circular reference not resolved: ${r}`);
        return t.refs.get(r);
      });
    t.processing.add(r);
    let i = J$(r, t), a = We(i, t);
    return t.refs.set(r, a), t.processing.delete(r), a;
  }
  if (e.enum !== void 0) {
    let r = e.enum;
    if (t.version === "openapi-3.0" && e.nullable === !0 && r.length === 1 && r[0] === null)
      return A.null();
    if (r.length === 0)
      return A.never();
    if (r.length === 1)
      return A.literal(r[0]);
    if (r.every((a) => typeof a == "string"))
      return A.enum(r);
    let i = r.map((a) => A.literal(a));
    return i.length < 2 ? i[0] : A.union([i[0], i[1], ...i.slice(2)]);
  }
  if (e.const !== void 0)
    return A.literal(e.const);
  let n = e.type;
  if (Array.isArray(n)) {
    let r = n.map((i) => {
      let a = { ...e, type: i };
      return rh(a, t);
    });
    return r.length === 0 ? A.never() : r.length === 1 ? r[0] : A.union(r);
  }
  if (!n)
    return A.any();
  let o;
  switch (n) {
    case "string": {
      let r = A.string();
      if (e.format) {
        let i = e.format;
        i === "email" ? r = r.check(A.email()) : i === "uri" || i === "uri-reference" ? r = r.check(A.url()) : i === "uuid" || i === "guid" ? r = r.check(A.uuid()) : i === "date-time" ? r = r.check(A.iso.datetime()) : i === "date" ? r = r.check(A.iso.date()) : i === "time" ? r = r.check(A.iso.time()) : i === "duration" ? r = r.check(A.iso.duration()) : i === "ipv4" ? r = r.check(A.ipv4()) : i === "ipv6" ? r = r.check(A.ipv6()) : i === "mac" ? r = r.check(A.mac()) : i === "cidr" ? r = r.check(A.cidrv4()) : i === "cidr-v6" ? r = r.check(A.cidrv6()) : i === "base64" ? r = r.check(A.base64()) : i === "base64url" ? r = r.check(A.base64url()) : i === "e164" ? r = r.check(A.e164()) : i === "jwt" ? r = r.check(A.jwt()) : i === "emoji" ? r = r.check(A.emoji()) : i === "nanoid" ? r = r.check(A.nanoid()) : i === "cuid" ? r = r.check(A.cuid()) : i === "cuid2" ? r = r.check(A.cuid2()) : i === "ulid" ? r = r.check(A.ulid()) : i === "xid" ? r = r.check(A.xid()) : i === "ksuid" && (r = r.check(A.ksuid()));
      }
      typeof e.minLength == "number" && (r = r.min(e.minLength)), typeof e.maxLength == "number" && (r = r.max(e.maxLength)), e.pattern && (r = r.regex(new RegExp(e.pattern))), o = r;
      break;
    }
    case "number":
    case "integer": {
      let r = n === "integer" ? A.number().int() : A.number();
      typeof e.minimum == "number" && (r = r.min(e.minimum)), typeof e.maximum == "number" && (r = r.max(e.maximum)), typeof e.exclusiveMinimum == "number" ? r = r.gt(e.exclusiveMinimum) : e.exclusiveMinimum === !0 && typeof e.minimum == "number" && (r = r.gt(e.minimum)), typeof e.exclusiveMaximum == "number" ? r = r.lt(e.exclusiveMaximum) : e.exclusiveMaximum === !0 && typeof e.maximum == "number" && (r = r.lt(e.maximum)), typeof e.multipleOf == "number" && (r = r.multipleOf(e.multipleOf)), o = r;
      break;
    }
    case "boolean": {
      o = A.boolean();
      break;
    }
    case "null": {
      o = A.null();
      break;
    }
    case "object": {
      let r = {}, i = e.properties || {}, a = new Set(e.required || []);
      for (let [c, d] of Object.entries(i)) {
        let p = We(d, t);
        r[c] = a.has(c) ? p : p.optional();
      }
      if (e.propertyNames) {
        let c = We(e.propertyNames, t), d = e.additionalProperties && typeof e.additionalProperties == "object" ? We(e.additionalProperties, t) : A.any();
        if (Object.keys(r).length === 0) {
          o = A.record(c, d);
          break;
        }
        let p = A.object(r).passthrough(), f = A.looseRecord(c, d);
        o = A.intersection(p, f);
        break;
      }
      if (e.patternProperties) {
        let c = e.patternProperties, d = Object.keys(c), p = [];
        for (let h of d) {
          let m = We(c[h], t), v = A.string().regex(new RegExp(h));
          p.push(A.looseRecord(v, m));
        }
        let f = [];
        if (Object.keys(r).length > 0 && f.push(A.object(r).passthrough()), f.push(...p), f.length === 0)
          o = A.object({}).passthrough();
        else if (f.length === 1)
          o = f[0];
        else {
          let h = A.intersection(f[0], f[1]);
          for (let m = 2; m < f.length; m++)
            h = A.intersection(h, f[m]);
          o = h;
        }
        break;
      }
      let u = A.object(r);
      e.additionalProperties === !1 ? o = u.strict() : typeof e.additionalProperties == "object" ? o = u.catchall(We(e.additionalProperties, t)) : o = u.passthrough();
      break;
    }
    case "array": {
      let r = e.prefixItems, i = e.items;
      if (r && Array.isArray(r)) {
        let a = r.map((c) => We(c, t)), u = i && typeof i == "object" && !Array.isArray(i) ? We(i, t) : void 0;
        u ? o = A.tuple(a).rest(u) : o = A.tuple(a), typeof e.minItems == "number" && (o = o.check(A.minLength(e.minItems))), typeof e.maxItems == "number" && (o = o.check(A.maxLength(e.maxItems)));
      } else if (Array.isArray(i)) {
        let a = i.map((c) => We(c, t)), u = e.additionalItems && typeof e.additionalItems == "object" ? We(e.additionalItems, t) : void 0;
        u ? o = A.tuple(a).rest(u) : o = A.tuple(a), typeof e.minItems == "number" && (o = o.check(A.minLength(e.minItems))), typeof e.maxItems == "number" && (o = o.check(A.maxLength(e.maxItems)));
      } else if (i !== void 0) {
        let a = We(i, t), u = A.array(a);
        typeof e.minItems == "number" && (u = u.min(e.minItems)), typeof e.maxItems == "number" && (u = u.max(e.maxItems)), o = u;
      } else
        o = A.array(A.any());
      break;
    }
    default:
      throw new Error(`Unsupported type: ${n}`);
  }
  return e.description && (o = o.describe(e.description)), e.default !== void 0 && (o = o.default(e.default)), o;
}
s(rh, "convertBaseSchema");
function We(e, t) {
  if (typeof e == "boolean")
    return e ? A.any() : A.never();
  let n = rh(e, t), o = e.type || e.enum !== void 0 || e.const !== void 0;
  if (e.anyOf && Array.isArray(e.anyOf)) {
    let u = e.anyOf.map((d) => We(d, t)), c = A.union(u);
    n = o ? A.intersection(n, c) : c;
  }
  if (e.oneOf && Array.isArray(e.oneOf)) {
    let u = e.oneOf.map((d) => We(d, t)), c = A.xor(u);
    n = o ? A.intersection(n, c) : c;
  }
  if (e.allOf && Array.isArray(e.allOf))
    if (e.allOf.length === 0)
      n = o ? n : A.any();
    else {
      let u = o ? n : We(e.allOf[0], t), c = o ? 0 : 1;
      for (let d = c; d < e.allOf.length; d++)
        u = A.intersection(u, We(e.allOf[d], t));
      n = u;
    }
  e.nullable === !0 && t.version === "openapi-3.0" && (n = A.nullable(n)), e.readOnly === !0 && (n = A.readonly(n));
  let r = {}, i = ["$id", "id", "$comment", "$anchor", "$vocabulary", "$dynamicRef", "$dynamicAnchor"];
  for (let u of i)
    u in e && (r[u] = e[u]);
  let a = ["contentEncoding", "contentMediaType", "contentSchema"];
  for (let u of a)
    u in e && (r[u] = e[u]);
  for (let u of Object.keys(e))
    V$.has(u) || (r[u] = e[u]);
  return Object.keys(r).length > 0 && t.registry.add(n, r), n;
}
s(We, "convertSchema");
function nh(e, t) {
  if (typeof e == "boolean")
    return e ? A.any() : A.never();
  let n = q$(e, t?.defaultTarget), o = e.$defs || e.definitions || {}, r = {
    version: n,
    defs: o,
    refs: /* @__PURE__ */ new Map(),
    processing: /* @__PURE__ */ new Set(),
    rootSchema: e,
    registry: t?.registry ?? Be
  };
  return We(e, r);
}
s(nh, "fromJSONSchema");

// node_modules/zod/v4/classic/coerce.js
var pm = {};
Xt(pm, {
  bigint: () => K$,
  boolean: () => W$,
  date: () => H$,
  number: () => G$,
  string: () => B$
});
function B$(e) {
  return Dc(bn, e);
}
s(B$, "string");
function G$(e) {
  return Jc($n, e);
}
s(G$, "number");
function W$(e) {
  return Yc(wn, e);
}
s(W$, "boolean");
function K$(e) {
  return ed(kn, e);
}
s(K$, "bigint");
function H$(e) {
  return dd(No, e);
}
s(H$, "date");

// node_modules/zod/v4/classic/external.js
Re(_o());

// node_modules/@ai-sdk/provider/dist/index.mjs
var Ph = "vercel.ai.error", X$ = Symbol.for(Ph), oh, ih, V = class Nh extends (ih = Error, oh = X$, ih) {
  static {
    s(this, "_AISDKError");
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
    super(n), this[oh] = !0, this.name = t, this.cause = o;
  }
  /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */
  static isInstance(t) {
    return Nh.hasMarker(t, Ph);
  }
  static hasMarker(t, n) {
    let o = Symbol.for(n);
    return t != null && typeof t == "object" && o in t && typeof t[o] == "boolean" && t[o] === !0;
  }
}, Ah = "AI_APICallError", Rh = `vercel.ai.error.${Ah}`, Y$ = Symbol.for(Rh), ah, sh, Pe = class extends (sh = V, ah = Y$, sh) {
  static {
    s(this, "APICallError");
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
    super({ name: Ah, message: e, cause: a }), this[ah] = !0, this.url = t, this.requestBodyValues = n, this.statusCode = o, this.responseHeaders = r, this.responseBody = i, this.isRetryable = u, this.data = c;
  }
  static isInstance(e) {
    return V.hasMarker(e, Rh);
  }
}, Ch = "AI_EmptyResponseBodyError", Dh = `vercel.ai.error.${Ch}`, Q$ = Symbol.for(Dh), lh, uh, Uh = class extends (uh = V, lh = Q$, uh) {
  static {
    s(this, "EmptyResponseBodyError");
  }
  // used in isInstance
  constructor({ message: e = "Empty response body" } = {}) {
    super({ name: Ch, message: e }), this[lh] = !0;
  }
  static isInstance(e) {
    return V.hasMarker(e, Dh);
  }
};
function Vt(e) {
  return e == null ? "unknown error" : typeof e == "string" ? e : e instanceof Error ? e.message : JSON.stringify(e);
}
s(Vt, "getErrorMessage");
var Mh = "AI_InvalidArgumentError", Zh = `vercel.ai.error.${Mh}`, ew = Symbol.for(Zh), ch, dh, In = class extends (dh = V, ch = ew, dh) {
  static {
    s(this, "InvalidArgumentError");
  }
  constructor({
    message: e,
    cause: t,
    argument: n
  }) {
    super({ name: Mh, message: e, cause: t }), this[ch] = !0, this.argument = n;
  }
  static isInstance(e) {
    return V.hasMarker(e, Zh);
  }
}, Lh = "AI_InvalidPromptError", Fh = `vercel.ai.error.${Lh}`, tw = Symbol.for(Fh), ph, mh, tr = class extends (mh = V, ph = tw, mh) {
  static {
    s(this, "InvalidPromptError");
  }
  constructor({
    prompt: e,
    message: t,
    cause: n
  }) {
    super({ name: Lh, message: `Invalid prompt: ${t}`, cause: n }), this[ph] = !0, this.prompt = e;
  }
  static isInstance(e) {
    return V.hasMarker(e, Fh);
  }
}, Vh = "AI_InvalidResponseDataError", qh = `vercel.ai.error.${Vh}`, rw = Symbol.for(qh), fh, gh, Ga = class extends (gh = V, fh = rw, gh) {
  static {
    s(this, "InvalidResponseDataError");
  }
  constructor({
    data: e,
    message: t = `Invalid response data: ${JSON.stringify(e)}.`
  }) {
    super({ name: Vh, message: t }), this[fh] = !0, this.data = e;
  }
  static isInstance(e) {
    return V.hasMarker(e, qh);
  }
}, Jh = "AI_JSONParseError", Bh = `vercel.ai.error.${Jh}`, nw = Symbol.for(Bh), hh, vh, Ur = class extends (vh = V, hh = nw, vh) {
  static {
    s(this, "JSONParseError");
  }
  constructor({ text: e, cause: t }) {
    super({
      name: Jh,
      message: `JSON parsing failed: Text: ${e}.
Error message: ${Vt(t)}`,
      cause: t
    }), this[hh] = !0, this.text = e;
  }
  static isInstance(e) {
    return V.hasMarker(e, Bh);
  }
}, Gh = "AI_LoadAPIKeyError", Wh = `vercel.ai.error.${Gh}`, ow = Symbol.for(Wh), yh, _h, Mo = class extends (_h = V, yh = ow, _h) {
  static {
    s(this, "LoadAPIKeyError");
  }
  // used in isInstance
  constructor({ message: e }) {
    super({ name: Gh, message: e }), this[yh] = !0;
  }
  static isInstance(e) {
    return V.hasMarker(e, Wh);
  }
}, Kh = "AI_LoadSettingError", Hh = `vercel.ai.error.${Kh}`, iw = Symbol.for(Hh), bh, xh, Qj = class extends (xh = V, bh = iw, xh) {
  static {
    s(this, "LoadSettingError");
  }
  // used in isInstance
  constructor({ message: e }) {
    super({ name: Kh, message: e }), this[bh] = !0;
  }
  static isInstance(e) {
    return V.hasMarker(e, Hh);
  }
}, Xh = "AI_NoContentGeneratedError", Yh = `vercel.ai.error.${Xh}`, aw = Symbol.for(Yh), $h, wh, eP = class extends (wh = V, $h = aw, wh) {
  static {
    s(this, "NoContentGeneratedError");
  }
  // used in isInstance
  constructor({
    message: e = "No content generated."
  } = {}) {
    super({ name: Xh, message: e }), this[$h] = !0;
  }
  static isInstance(e) {
    return V.hasMarker(e, Yh);
  }
}, Qh = "AI_NoSuchModelError", ev = `vercel.ai.error.${Qh}`, sw = Symbol.for(ev), kh, Ih, tP = class extends (Ih = V, kh = sw, Ih) {
  static {
    s(this, "NoSuchModelError");
  }
  constructor({
    errorName: e = Qh,
    modelId: t,
    modelType: n,
    message: o = `No such ${n}: ${t}`
  }) {
    super({ name: e, message: o }), this[kh] = !0, this.modelId = t, this.modelType = n;
  }
  static isInstance(e) {
    return V.hasMarker(e, ev);
  }
}, tv = "AI_TooManyEmbeddingValuesForCallError", rv = `vercel.ai.error.${tv}`, lw = Symbol.for(rv), Sh, Th, nv = class extends (Th = V, Sh = lw, Th) {
  static {
    s(this, "TooManyEmbeddingValuesForCallError");
  }
  constructor(e) {
    super({
      name: tv,
      message: `Too many values for a single embedding call. The ${e.provider} model "${e.modelId}" can only embed up to ${e.maxEmbeddingsPerCall} values per call, but ${e.values.length} values were provided.`
    }), this[Sh] = !0, this.provider = e.provider, this.modelId = e.modelId, this.maxEmbeddingsPerCall = e.maxEmbeddingsPerCall, this.values = e.values;
  }
  static isInstance(e) {
    return V.hasMarker(e, rv);
  }
}, ov = "AI_TypeValidationError", iv = `vercel.ai.error.${ov}`, uw = Symbol.for(iv), zh, Eh, Ge = class mm extends (Eh = V, zh = uw, Eh) {
  static {
    s(this, "_TypeValidationError");
  }
  constructor({ value: t, cause: n }) {
    super({
      name: ov,
      message: `Type validation failed: Value: ${JSON.stringify(t)}.
Error message: ${Vt(n)}`,
      cause: n
    }), this[zh] = !0, this.value = t;
  }
  static isInstance(t) {
    return V.hasMarker(t, iv);
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
    return mm.isInstance(n) && n.value === t ? n : new mm({ value: t, cause: n });
  }
}, av = "AI_UnsupportedFunctionalityError", sv = `vercel.ai.error.${av}`, cw = Symbol.for(sv), Oh, jh, Ve = class extends (jh = V, Oh = cw, jh) {
  static {
    s(this, "UnsupportedFunctionalityError");
  }
  constructor({
    functionality: e,
    message: t = `'${e}' functionality not supported.`
  }) {
    super({ name: av, message: t }), this[Oh] = !0, this.functionality = e;
  }
  static isInstance(e) {
    return V.hasMarker(e, sv);
  }
};
function Ba(e) {
  return e === null || typeof e == "string" || typeof e == "number" || typeof e == "boolean" ? !0 : Array.isArray(e) ? e.every(Ba) : typeof e == "object" ? Object.entries(e).every(
    ([t, n]) => typeof t == "string" && Ba(n)
  ) : !1;
}
s(Ba, "isJSONValue");
function fm(e) {
  return Array.isArray(e) && e.every(Ba);
}
s(fm, "isJSONArray");
function Zo(e) {
  return e != null && typeof e == "object" && Object.entries(e).every(
    ([t, n]) => typeof t == "string" && Ba(n)
  );
}
s(Zo, "isJSONObject");

// node_modules/eventsource-parser/dist/index.js
var Wa = class extends Error {
  static {
    s(this, "ParseError");
  }
  constructor(t, n) {
    super(t), this.name = "ParseError", this.type = n.type, this.field = n.field, this.value = n.value, this.line = n.line;
  }
};
function gm(e) {
}
s(gm, "noop");
function lv(e) {
  if (typeof e == "function")
    throw new TypeError(
      "`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?"
    );
  let { onEvent: t = gm, onError: n = gm, onRetry: o = gm, onComment: r } = e, i = "", a = !0, u, c = "", d = "";
  function p(b) {
    let $ = a ? b.replace(/^\xEF\xBB\xBF/, "") : b, [w, I] = dw(`${i}${$}`);
    for (let _ of w)
      f(_);
    i = I, a = !1;
  }
  s(p, "feed");
  function f(b) {
    if (b === "") {
      m();
      return;
    }
    if (b.startsWith(":")) {
      r && r(b.slice(b.startsWith(": ") ? 2 : 1));
      return;
    }
    let $ = b.indexOf(":");
    if ($ !== -1) {
      let w = b.slice(0, $), I = b[$ + 1] === " " ? 2 : 1, _ = b.slice($ + I);
      h(w, _, b);
      return;
    }
    h(b, "", b);
  }
  s(f, "parseLine");
  function h(b, $, w) {
    switch (b) {
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
          new Wa(`Invalid \`retry\` value: "${$}"`, {
            type: "invalid-retry",
            value: $,
            line: w
          })
        );
        break;
      default:
        n(
          new Wa(
            `Unknown field "${b.length > 20 ? `${b.slice(0, 20)}\u2026` : b}"`,
            { type: "unknown-field", field: b, value: $, line: w }
          )
        );
        break;
    }
  }
  s(h, "processField");
  function m() {
    c.length > 0 && t({
      id: u,
      event: d || void 0,
      // If the data buffer's last character is a U+000A LINE FEED (LF) character,
      // then remove the last character from the data buffer.
      data: c.endsWith(`
`) ? c.slice(0, -1) : c
    }), u = void 0, c = "", d = "";
  }
  s(m, "dispatchEvent");
  function v(b = {}) {
    i && b.consume && f(i), a = !0, u = void 0, c = "", d = "", i = "";
  }
  return s(v, "reset"), { feed: p, reset: v };
}
s(lv, "createParser");
function dw(e) {
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
s(dw, "splitLines");

// node_modules/eventsource-parser/dist/stream.js
var Ka = class extends TransformStream {
  static {
    s(this, "EventSourceParserStream");
  }
  constructor({ onError: t, onRetry: n, onComment: o } = {}) {
    let r;
    super({
      start(i) {
        r = lv({
          onEvent: /* @__PURE__ */ s((a) => {
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
var me;
(function(e) {
  e.assertEqual = (r) => {
  };
  function t(r) {
  }
  s(t, "assertIs"), e.assertIs = t;
  function n(r) {
    throw new Error();
  }
  s(n, "assertNever"), e.assertNever = n, e.arrayToEnum = (r) => {
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
  s(o, "joinValues"), e.joinValues = o, e.jsonStringifyReplacer = (r, i) => typeof i == "bigint" ? i.toString() : i;
})(me || (me = {}));
var uv;
(function(e) {
  e.mergeShapes = (t, n) => ({
    ...t,
    ...n
    // second overwrites first
  });
})(uv || (uv = {}));
var D = me.arrayToEnum([
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
]), rr = /* @__PURE__ */ s((e) => {
  switch (typeof e) {
    case "undefined":
      return D.undefined;
    case "string":
      return D.string;
    case "number":
      return Number.isNaN(e) ? D.nan : D.number;
    case "boolean":
      return D.boolean;
    case "function":
      return D.function;
    case "bigint":
      return D.bigint;
    case "symbol":
      return D.symbol;
    case "object":
      return Array.isArray(e) ? D.array : e === null ? D.null : e.then && typeof e.then == "function" && e.catch && typeof e.catch == "function" ? D.promise : typeof Map < "u" && e instanceof Map ? D.map : typeof Set < "u" && e instanceof Set ? D.set : typeof Date < "u" && e instanceof Date ? D.date : D.object;
    default:
      return D.unknown;
  }
}, "getParsedType");

// node_modules/zod/v3/ZodError.js
var E = me.arrayToEnum([
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
var yt = class e extends Error {
  static {
    s(this, "ZodError");
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
    }, o = { _errors: [] }, r = /* @__PURE__ */ s((i) => {
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
    return JSON.stringify(this.issues, me.jsonStringifyReplacer, 2);
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
yt.create = (e) => new yt(e);

// node_modules/zod/v3/locales/en.js
var mw = /* @__PURE__ */ s((e, t) => {
  let n;
  switch (e.code) {
    case E.invalid_type:
      e.received === D.undefined ? n = "Required" : n = `Expected ${e.expected}, received ${e.received}`;
      break;
    case E.invalid_literal:
      n = `Invalid literal value, expected ${JSON.stringify(e.expected, me.jsonStringifyReplacer)}`;
      break;
    case E.unrecognized_keys:
      n = `Unrecognized key(s) in object: ${me.joinValues(e.keys, ", ")}`;
      break;
    case E.invalid_union:
      n = "Invalid input";
      break;
    case E.invalid_union_discriminator:
      n = `Invalid discriminator value. Expected ${me.joinValues(e.options)}`;
      break;
    case E.invalid_enum_value:
      n = `Invalid enum value. Expected ${me.joinValues(e.options)}, received '${e.received}'`;
      break;
    case E.invalid_arguments:
      n = "Invalid function arguments";
      break;
    case E.invalid_return_type:
      n = "Invalid function return type";
      break;
    case E.invalid_date:
      n = "Invalid date";
      break;
    case E.invalid_string:
      typeof e.validation == "object" ? "includes" in e.validation ? (n = `Invalid input: must include "${e.validation.includes}"`, typeof e.validation.position == "number" && (n = `${n} at one or more positions greater than or equal to ${e.validation.position}`)) : "startsWith" in e.validation ? n = `Invalid input: must start with "${e.validation.startsWith}"` : "endsWith" in e.validation ? n = `Invalid input: must end with "${e.validation.endsWith}"` : me.assertNever(e.validation) : e.validation !== "regex" ? n = `Invalid ${e.validation}` : n = "Invalid";
      break;
    case E.too_small:
      e.type === "array" ? n = `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "more than"} ${e.minimum} element(s)` : e.type === "string" ? n = `String must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "over"} ${e.minimum} character(s)` : e.type === "number" ? n = `Number must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${e.minimum}` : e.type === "bigint" ? n = `Number must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${e.minimum}` : e.type === "date" ? n = `Date must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(e.minimum))}` : n = "Invalid input";
      break;
    case E.too_big:
      e.type === "array" ? n = `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "less than"} ${e.maximum} element(s)` : e.type === "string" ? n = `String must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "under"} ${e.maximum} character(s)` : e.type === "number" ? n = `Number must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` : e.type === "bigint" ? n = `BigInt must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` : e.type === "date" ? n = `Date must be ${e.exact ? "exactly" : e.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(e.maximum))}` : n = "Invalid input";
      break;
    case E.custom:
      n = "Invalid input";
      break;
    case E.invalid_intersection_types:
      n = "Intersection results could not be merged";
      break;
    case E.not_multiple_of:
      n = `Number must be a multiple of ${e.multipleOf}`;
      break;
    case E.not_finite:
      n = "Number must be finite";
      break;
    default:
      n = t.defaultError, me.assertNever(e);
  }
  return { message: n };
}, "errorMap"), xr = mw;

// node_modules/zod/v3/errors.js
var fw = xr;
function Lo() {
  return fw;
}
s(Lo, "getErrorMap");

// node_modules/zod/v3/helpers/parseUtil.js
var Ha = /* @__PURE__ */ s((e) => {
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
function R(e, t) {
  let n = Lo(), o = Ha({
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
      n === xr ? void 0 : xr
      // then global default map
    ].filter((r) => !!r)
  });
  e.common.issues.push(o);
}
s(R, "addIssueToContext");
var Ke = class e {
  static {
    s(this, "ParseStatus");
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
        return H;
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
        return H;
      i.status === "dirty" && t.dirty(), a.status === "dirty" && t.dirty(), i.value !== "__proto__" && (typeof a.value < "u" || r.alwaysSet) && (o[i.value] = a.value);
    }
    return { status: t.value, value: o };
  }
}, H = Object.freeze({
  status: "aborted"
}), Sn = /* @__PURE__ */ s((e) => ({ status: "dirty", value: e }), "DIRTY"), tt = /* @__PURE__ */ s((e) => ({ status: "valid", value: e }), "OK"), hm = /* @__PURE__ */ s((e) => e.status === "aborted", "isAborted"), vm = /* @__PURE__ */ s((e) => e.status === "dirty", "isDirty"), Mr = /* @__PURE__ */ s((e) => e.status === "valid", "isValid"), Fo = /* @__PURE__ */ s((e) => typeof Promise < "u" && e instanceof Promise, "isAsync");

// node_modules/zod/v3/helpers/errorUtil.js
var q;
(function(e) {
  e.errToObj = (t) => typeof t == "string" ? { message: t } : t || {}, e.toString = (t) => typeof t == "string" ? t : t?.message;
})(q || (q = {}));

// node_modules/zod/v3/types.js
var It = class {
  static {
    s(this, "ParseInputLazyPath");
  }
  constructor(t, n, o, r) {
    this._cachedPath = [], this.parent = t, this.data = n, this._path = o, this._key = r;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}, cv = /* @__PURE__ */ s((e, t) => {
  if (Mr(t))
    return { success: !0, data: t.value };
  if (!e.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      let n = new yt(e.common.issues);
      return this._error = n, this._error;
    }
  };
}, "handleResult");
function oe(e) {
  if (!e)
    return {};
  let { errorMap: t, invalid_type_error: n, required_error: o, description: r } = e;
  if (t && (n || o))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return t ? { errorMap: t, description: r } : { errorMap: /* @__PURE__ */ s((a, u) => {
    let { message: c } = e;
    return a.code === "invalid_enum_value" ? { message: c ?? u.defaultError } : typeof u.data > "u" ? { message: c ?? o ?? u.defaultError } : a.code !== "invalid_type" ? { message: u.defaultError } : { message: c ?? n ?? u.defaultError };
  }, "customMap"), description: r };
}
s(oe, "processCreateParams");
var le = class {
  static {
    s(this, "ZodType");
  }
  get description() {
    return this._def.description;
  }
  _getType(t) {
    return rr(t.data);
  }
  _getOrReturnCtx(t, n) {
    return n || {
      common: t.parent.common,
      data: t.data,
      parsedType: rr(t.data),
      schemaErrorMap: this._def.errorMap,
      path: t.path,
      parent: t.parent
    };
  }
  _processInputParams(t) {
    return {
      status: new Ke(),
      ctx: {
        common: t.parent.common,
        data: t.data,
        parsedType: rr(t.data),
        schemaErrorMap: this._def.errorMap,
        path: t.path,
        parent: t.parent
      }
    };
  }
  _parseSync(t) {
    let n = this._parse(t);
    if (Fo(n))
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
      parsedType: rr(t)
    }, r = this._parseSync({ data: t, path: o.path, parent: o });
    return cv(o, r);
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
      parsedType: rr(t)
    };
    if (!this["~standard"].async)
      try {
        let o = this._parseSync({ data: t, path: [], parent: n });
        return Mr(o) ? {
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
    return this._parseAsync({ data: t, path: [], parent: n }).then((o) => Mr(o) ? {
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
      parsedType: rr(t)
    }, r = this._parse({ data: t, path: o.path, parent: o }), i = await (Fo(r) ? r : Promise.resolve(r));
    return cv(o, i);
  }
  refine(t, n) {
    let o = /* @__PURE__ */ s((r) => typeof n == "string" || typeof n > "u" ? { message: n } : typeof n == "function" ? n(r) : n, "getIssueProperties");
    return this._refinement((r, i) => {
      let a = t(r), u = /* @__PURE__ */ s(() => i.addIssue({
        code: E.custom,
        ...o(r)
      }), "setError");
      return typeof Promise < "u" && a instanceof Promise ? a.then((c) => c ? !0 : (u(), !1)) : a ? !0 : (u(), !1);
    });
  }
  refinement(t, n) {
    return this._refinement((o, r) => t(o) ? !0 : (r.addIssue(typeof n == "function" ? n(o, r) : n), !1));
  }
  _refinement(t) {
    return new Nt({
      schema: this,
      typeName: P.ZodEffects,
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
      validate: /* @__PURE__ */ s((n) => this["~validate"](n), "validate")
    };
  }
  optional() {
    return Pt.create(this, this._def);
  }
  nullable() {
    return ir.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return wr.create(this);
  }
  promise() {
    return Zr.create(this, this._def);
  }
  or(t) {
    return jn.create([this, t], this._def);
  }
  and(t) {
    return Pn.create(this, t, this._def);
  }
  transform(t) {
    return new Nt({
      ...oe(this._def),
      schema: this,
      typeName: P.ZodEffects,
      effect: { type: "transform", transform: t }
    });
  }
  default(t) {
    let n = typeof t == "function" ? t : () => t;
    return new Dn({
      ...oe(this._def),
      innerType: this,
      defaultValue: n,
      typeName: P.ZodDefault
    });
  }
  brand() {
    return new Xa({
      typeName: P.ZodBranded,
      type: this,
      ...oe(this._def)
    });
  }
  catch(t) {
    let n = typeof t == "function" ? t : () => t;
    return new Un({
      ...oe(this._def),
      innerType: this,
      catchValue: n,
      typeName: P.ZodCatch
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
    return Ya.create(this, t);
  }
  readonly() {
    return Mn.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}, gw = /^c[^\s-]{8,}$/i, hw = /^[0-9a-z]+$/, vw = /^[0-9A-HJKMNP-TV-Z]{26}$/i, yw = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, _w = /^[a-z0-9_-]{21}$/i, bw = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, xw = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, $w = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, ww = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", ym, kw = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Iw = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Sw = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Tw = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, zw = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Ew = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, dv = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Ow = new RegExp(`^${dv}$`);
function pv(e) {
  let t = "[0-5]\\d";
  e.precision ? t = `${t}\\.\\d{${e.precision}}` : e.precision == null && (t = `${t}(\\.\\d+)?`);
  let n = e.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${t})${n}`;
}
s(pv, "timeRegexSource");
function jw(e) {
  return new RegExp(`^${pv(e)}$`);
}
s(jw, "timeRegex");
function Pw(e) {
  let t = `${dv}T${pv(e)}`, n = [];
  return n.push(e.local ? "Z?" : "Z"), e.offset && n.push("([+-]\\d{2}:?\\d{2})"), t = `${t}(${n.join("|")})`, new RegExp(`^${t}$`);
}
s(Pw, "datetimeRegex");
function Nw(e, t) {
  return !!((t === "v4" || !t) && kw.test(e) || (t === "v6" || !t) && Sw.test(e));
}
s(Nw, "isValidIP");
function Aw(e, t) {
  if (!bw.test(e))
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
s(Aw, "isValidJWT");
function Rw(e, t) {
  return !!((t === "v4" || !t) && Iw.test(e) || (t === "v6" || !t) && Tw.test(e));
}
s(Rw, "isValidCidr");
var zn = class e extends le {
  static {
    s(this, "ZodString");
  }
  _parse(t) {
    if (this._def.coerce && (t.data = String(t.data)), this._getType(t) !== D.string) {
      let i = this._getOrReturnCtx(t);
      return R(i, {
        code: E.invalid_type,
        expected: D.string,
        received: i.parsedType
      }), H;
    }
    let o = new Ke(), r;
    for (let i of this._def.checks)
      if (i.kind === "min")
        t.data.length < i.value && (r = this._getOrReturnCtx(t, r), R(r, {
          code: E.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), o.dirty());
      else if (i.kind === "max")
        t.data.length > i.value && (r = this._getOrReturnCtx(t, r), R(r, {
          code: E.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), o.dirty());
      else if (i.kind === "length") {
        let a = t.data.length > i.value, u = t.data.length < i.value;
        (a || u) && (r = this._getOrReturnCtx(t, r), a ? R(r, {
          code: E.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }) : u && R(r, {
          code: E.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }), o.dirty());
      } else if (i.kind === "email")
        $w.test(t.data) || (r = this._getOrReturnCtx(t, r), R(r, {
          validation: "email",
          code: E.invalid_string,
          message: i.message
        }), o.dirty());
      else if (i.kind === "emoji")
        ym || (ym = new RegExp(ww, "u")), ym.test(t.data) || (r = this._getOrReturnCtx(t, r), R(r, {
          validation: "emoji",
          code: E.invalid_string,
          message: i.message
        }), o.dirty());
      else if (i.kind === "uuid")
        yw.test(t.data) || (r = this._getOrReturnCtx(t, r), R(r, {
          validation: "uuid",
          code: E.invalid_string,
          message: i.message
        }), o.dirty());
      else if (i.kind === "nanoid")
        _w.test(t.data) || (r = this._getOrReturnCtx(t, r), R(r, {
          validation: "nanoid",
          code: E.invalid_string,
          message: i.message
        }), o.dirty());
      else if (i.kind === "cuid")
        gw.test(t.data) || (r = this._getOrReturnCtx(t, r), R(r, {
          validation: "cuid",
          code: E.invalid_string,
          message: i.message
        }), o.dirty());
      else if (i.kind === "cuid2")
        hw.test(t.data) || (r = this._getOrReturnCtx(t, r), R(r, {
          validation: "cuid2",
          code: E.invalid_string,
          message: i.message
        }), o.dirty());
      else if (i.kind === "ulid")
        vw.test(t.data) || (r = this._getOrReturnCtx(t, r), R(r, {
          validation: "ulid",
          code: E.invalid_string,
          message: i.message
        }), o.dirty());
      else if (i.kind === "url")
        try {
          new URL(t.data);
        } catch {
          r = this._getOrReturnCtx(t, r), R(r, {
            validation: "url",
            code: E.invalid_string,
            message: i.message
          }), o.dirty();
        }
      else i.kind === "regex" ? (i.regex.lastIndex = 0, i.regex.test(t.data) || (r = this._getOrReturnCtx(t, r), R(r, {
        validation: "regex",
        code: E.invalid_string,
        message: i.message
      }), o.dirty())) : i.kind === "trim" ? t.data = t.data.trim() : i.kind === "includes" ? t.data.includes(i.value, i.position) || (r = this._getOrReturnCtx(t, r), R(r, {
        code: E.invalid_string,
        validation: { includes: i.value, position: i.position },
        message: i.message
      }), o.dirty()) : i.kind === "toLowerCase" ? t.data = t.data.toLowerCase() : i.kind === "toUpperCase" ? t.data = t.data.toUpperCase() : i.kind === "startsWith" ? t.data.startsWith(i.value) || (r = this._getOrReturnCtx(t, r), R(r, {
        code: E.invalid_string,
        validation: { startsWith: i.value },
        message: i.message
      }), o.dirty()) : i.kind === "endsWith" ? t.data.endsWith(i.value) || (r = this._getOrReturnCtx(t, r), R(r, {
        code: E.invalid_string,
        validation: { endsWith: i.value },
        message: i.message
      }), o.dirty()) : i.kind === "datetime" ? Pw(i).test(t.data) || (r = this._getOrReturnCtx(t, r), R(r, {
        code: E.invalid_string,
        validation: "datetime",
        message: i.message
      }), o.dirty()) : i.kind === "date" ? Ow.test(t.data) || (r = this._getOrReturnCtx(t, r), R(r, {
        code: E.invalid_string,
        validation: "date",
        message: i.message
      }), o.dirty()) : i.kind === "time" ? jw(i).test(t.data) || (r = this._getOrReturnCtx(t, r), R(r, {
        code: E.invalid_string,
        validation: "time",
        message: i.message
      }), o.dirty()) : i.kind === "duration" ? xw.test(t.data) || (r = this._getOrReturnCtx(t, r), R(r, {
        validation: "duration",
        code: E.invalid_string,
        message: i.message
      }), o.dirty()) : i.kind === "ip" ? Nw(t.data, i.version) || (r = this._getOrReturnCtx(t, r), R(r, {
        validation: "ip",
        code: E.invalid_string,
        message: i.message
      }), o.dirty()) : i.kind === "jwt" ? Aw(t.data, i.alg) || (r = this._getOrReturnCtx(t, r), R(r, {
        validation: "jwt",
        code: E.invalid_string,
        message: i.message
      }), o.dirty()) : i.kind === "cidr" ? Rw(t.data, i.version) || (r = this._getOrReturnCtx(t, r), R(r, {
        validation: "cidr",
        code: E.invalid_string,
        message: i.message
      }), o.dirty()) : i.kind === "base64" ? zw.test(t.data) || (r = this._getOrReturnCtx(t, r), R(r, {
        validation: "base64",
        code: E.invalid_string,
        message: i.message
      }), o.dirty()) : i.kind === "base64url" ? Ew.test(t.data) || (r = this._getOrReturnCtx(t, r), R(r, {
        validation: "base64url",
        code: E.invalid_string,
        message: i.message
      }), o.dirty()) : me.assertNever(i);
    return { status: o.value, value: t.data };
  }
  _regex(t, n, o) {
    return this.refinement((r) => t.test(r), {
      validation: n,
      code: E.invalid_string,
      ...q.errToObj(o)
    });
  }
  _addCheck(t) {
    return new e({
      ...this._def,
      checks: [...this._def.checks, t]
    });
  }
  email(t) {
    return this._addCheck({ kind: "email", ...q.errToObj(t) });
  }
  url(t) {
    return this._addCheck({ kind: "url", ...q.errToObj(t) });
  }
  emoji(t) {
    return this._addCheck({ kind: "emoji", ...q.errToObj(t) });
  }
  uuid(t) {
    return this._addCheck({ kind: "uuid", ...q.errToObj(t) });
  }
  nanoid(t) {
    return this._addCheck({ kind: "nanoid", ...q.errToObj(t) });
  }
  cuid(t) {
    return this._addCheck({ kind: "cuid", ...q.errToObj(t) });
  }
  cuid2(t) {
    return this._addCheck({ kind: "cuid2", ...q.errToObj(t) });
  }
  ulid(t) {
    return this._addCheck({ kind: "ulid", ...q.errToObj(t) });
  }
  base64(t) {
    return this._addCheck({ kind: "base64", ...q.errToObj(t) });
  }
  base64url(t) {
    return this._addCheck({
      kind: "base64url",
      ...q.errToObj(t)
    });
  }
  jwt(t) {
    return this._addCheck({ kind: "jwt", ...q.errToObj(t) });
  }
  ip(t) {
    return this._addCheck({ kind: "ip", ...q.errToObj(t) });
  }
  cidr(t) {
    return this._addCheck({ kind: "cidr", ...q.errToObj(t) });
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
      ...q.errToObj(t?.message)
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
      ...q.errToObj(t?.message)
    });
  }
  duration(t) {
    return this._addCheck({ kind: "duration", ...q.errToObj(t) });
  }
  regex(t, n) {
    return this._addCheck({
      kind: "regex",
      regex: t,
      ...q.errToObj(n)
    });
  }
  includes(t, n) {
    return this._addCheck({
      kind: "includes",
      value: t,
      position: n?.position,
      ...q.errToObj(n?.message)
    });
  }
  startsWith(t, n) {
    return this._addCheck({
      kind: "startsWith",
      value: t,
      ...q.errToObj(n)
    });
  }
  endsWith(t, n) {
    return this._addCheck({
      kind: "endsWith",
      value: t,
      ...q.errToObj(n)
    });
  }
  min(t, n) {
    return this._addCheck({
      kind: "min",
      value: t,
      ...q.errToObj(n)
    });
  }
  max(t, n) {
    return this._addCheck({
      kind: "max",
      value: t,
      ...q.errToObj(n)
    });
  }
  length(t, n) {
    return this._addCheck({
      kind: "length",
      value: t,
      ...q.errToObj(n)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(t) {
    return this.min(1, q.errToObj(t));
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
zn.create = (e) => new zn({
  checks: [],
  typeName: P.ZodString,
  coerce: e?.coerce ?? !1,
  ...oe(e)
});
function Cw(e, t) {
  let n = (e.toString().split(".")[1] || "").length, o = (t.toString().split(".")[1] || "").length, r = n > o ? n : o, i = Number.parseInt(e.toFixed(r).replace(".", "")), a = Number.parseInt(t.toFixed(r).replace(".", ""));
  return i % a / 10 ** r;
}
s(Cw, "floatSafeRemainder");
var Vo = class e extends le {
  static {
    s(this, "ZodNumber");
  }
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(t) {
    if (this._def.coerce && (t.data = Number(t.data)), this._getType(t) !== D.number) {
      let i = this._getOrReturnCtx(t);
      return R(i, {
        code: E.invalid_type,
        expected: D.number,
        received: i.parsedType
      }), H;
    }
    let o, r = new Ke();
    for (let i of this._def.checks)
      i.kind === "int" ? me.isInteger(t.data) || (o = this._getOrReturnCtx(t, o), R(o, {
        code: E.invalid_type,
        expected: "integer",
        received: "float",
        message: i.message
      }), r.dirty()) : i.kind === "min" ? (i.inclusive ? t.data < i.value : t.data <= i.value) && (o = this._getOrReturnCtx(t, o), R(o, {
        code: E.too_small,
        minimum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), r.dirty()) : i.kind === "max" ? (i.inclusive ? t.data > i.value : t.data >= i.value) && (o = this._getOrReturnCtx(t, o), R(o, {
        code: E.too_big,
        maximum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), r.dirty()) : i.kind === "multipleOf" ? Cw(t.data, i.value) !== 0 && (o = this._getOrReturnCtx(t, o), R(o, {
        code: E.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), r.dirty()) : i.kind === "finite" ? Number.isFinite(t.data) || (o = this._getOrReturnCtx(t, o), R(o, {
        code: E.not_finite,
        message: i.message
      }), r.dirty()) : me.assertNever(i);
    return { status: r.value, value: t.data };
  }
  gte(t, n) {
    return this.setLimit("min", t, !0, q.toString(n));
  }
  gt(t, n) {
    return this.setLimit("min", t, !1, q.toString(n));
  }
  lte(t, n) {
    return this.setLimit("max", t, !0, q.toString(n));
  }
  lt(t, n) {
    return this.setLimit("max", t, !1, q.toString(n));
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
          message: q.toString(r)
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
      message: q.toString(t)
    });
  }
  positive(t) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: q.toString(t)
    });
  }
  negative(t) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: q.toString(t)
    });
  }
  nonpositive(t) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: q.toString(t)
    });
  }
  nonnegative(t) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: q.toString(t)
    });
  }
  multipleOf(t, n) {
    return this._addCheck({
      kind: "multipleOf",
      value: t,
      message: q.toString(n)
    });
  }
  finite(t) {
    return this._addCheck({
      kind: "finite",
      message: q.toString(t)
    });
  }
  safe(t) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: q.toString(t)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: q.toString(t)
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
    return !!this._def.checks.find((t) => t.kind === "int" || t.kind === "multipleOf" && me.isInteger(t.value));
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
Vo.create = (e) => new Vo({
  checks: [],
  typeName: P.ZodNumber,
  coerce: e?.coerce || !1,
  ...oe(e)
});
var qo = class e extends le {
  static {
    s(this, "ZodBigInt");
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
    if (this._getType(t) !== D.bigint)
      return this._getInvalidInput(t);
    let o, r = new Ke();
    for (let i of this._def.checks)
      i.kind === "min" ? (i.inclusive ? t.data < i.value : t.data <= i.value) && (o = this._getOrReturnCtx(t, o), R(o, {
        code: E.too_small,
        type: "bigint",
        minimum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), r.dirty()) : i.kind === "max" ? (i.inclusive ? t.data > i.value : t.data >= i.value) && (o = this._getOrReturnCtx(t, o), R(o, {
        code: E.too_big,
        type: "bigint",
        maximum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), r.dirty()) : i.kind === "multipleOf" ? t.data % i.value !== BigInt(0) && (o = this._getOrReturnCtx(t, o), R(o, {
        code: E.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), r.dirty()) : me.assertNever(i);
    return { status: r.value, value: t.data };
  }
  _getInvalidInput(t) {
    let n = this._getOrReturnCtx(t);
    return R(n, {
      code: E.invalid_type,
      expected: D.bigint,
      received: n.parsedType
    }), H;
  }
  gte(t, n) {
    return this.setLimit("min", t, !0, q.toString(n));
  }
  gt(t, n) {
    return this.setLimit("min", t, !1, q.toString(n));
  }
  lte(t, n) {
    return this.setLimit("max", t, !0, q.toString(n));
  }
  lt(t, n) {
    return this.setLimit("max", t, !1, q.toString(n));
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
          message: q.toString(r)
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
      message: q.toString(t)
    });
  }
  negative(t) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: q.toString(t)
    });
  }
  nonpositive(t) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: q.toString(t)
    });
  }
  nonnegative(t) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: q.toString(t)
    });
  }
  multipleOf(t, n) {
    return this._addCheck({
      kind: "multipleOf",
      value: t,
      message: q.toString(n)
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
qo.create = (e) => new qo({
  checks: [],
  typeName: P.ZodBigInt,
  coerce: e?.coerce ?? !1,
  ...oe(e)
});
var Jo = class extends le {
  static {
    s(this, "ZodBoolean");
  }
  _parse(t) {
    if (this._def.coerce && (t.data = !!t.data), this._getType(t) !== D.boolean) {
      let o = this._getOrReturnCtx(t);
      return R(o, {
        code: E.invalid_type,
        expected: D.boolean,
        received: o.parsedType
      }), H;
    }
    return tt(t.data);
  }
};
Jo.create = (e) => new Jo({
  typeName: P.ZodBoolean,
  coerce: e?.coerce || !1,
  ...oe(e)
});
var Bo = class e extends le {
  static {
    s(this, "ZodDate");
  }
  _parse(t) {
    if (this._def.coerce && (t.data = new Date(t.data)), this._getType(t) !== D.date) {
      let i = this._getOrReturnCtx(t);
      return R(i, {
        code: E.invalid_type,
        expected: D.date,
        received: i.parsedType
      }), H;
    }
    if (Number.isNaN(t.data.getTime())) {
      let i = this._getOrReturnCtx(t);
      return R(i, {
        code: E.invalid_date
      }), H;
    }
    let o = new Ke(), r;
    for (let i of this._def.checks)
      i.kind === "min" ? t.data.getTime() < i.value && (r = this._getOrReturnCtx(t, r), R(r, {
        code: E.too_small,
        message: i.message,
        inclusive: !0,
        exact: !1,
        minimum: i.value,
        type: "date"
      }), o.dirty()) : i.kind === "max" ? t.data.getTime() > i.value && (r = this._getOrReturnCtx(t, r), R(r, {
        code: E.too_big,
        message: i.message,
        inclusive: !0,
        exact: !1,
        maximum: i.value,
        type: "date"
      }), o.dirty()) : me.assertNever(i);
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
      message: q.toString(n)
    });
  }
  max(t, n) {
    return this._addCheck({
      kind: "max",
      value: t.getTime(),
      message: q.toString(n)
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
Bo.create = (e) => new Bo({
  checks: [],
  coerce: e?.coerce || !1,
  typeName: P.ZodDate,
  ...oe(e)
});
var Go = class extends le {
  static {
    s(this, "ZodSymbol");
  }
  _parse(t) {
    if (this._getType(t) !== D.symbol) {
      let o = this._getOrReturnCtx(t);
      return R(o, {
        code: E.invalid_type,
        expected: D.symbol,
        received: o.parsedType
      }), H;
    }
    return tt(t.data);
  }
};
Go.create = (e) => new Go({
  typeName: P.ZodSymbol,
  ...oe(e)
});
var En = class extends le {
  static {
    s(this, "ZodUndefined");
  }
  _parse(t) {
    if (this._getType(t) !== D.undefined) {
      let o = this._getOrReturnCtx(t);
      return R(o, {
        code: E.invalid_type,
        expected: D.undefined,
        received: o.parsedType
      }), H;
    }
    return tt(t.data);
  }
};
En.create = (e) => new En({
  typeName: P.ZodUndefined,
  ...oe(e)
});
var On = class extends le {
  static {
    s(this, "ZodNull");
  }
  _parse(t) {
    if (this._getType(t) !== D.null) {
      let o = this._getOrReturnCtx(t);
      return R(o, {
        code: E.invalid_type,
        expected: D.null,
        received: o.parsedType
      }), H;
    }
    return tt(t.data);
  }
};
On.create = (e) => new On({
  typeName: P.ZodNull,
  ...oe(e)
});
var Wo = class extends le {
  static {
    s(this, "ZodAny");
  }
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(t) {
    return tt(t.data);
  }
};
Wo.create = (e) => new Wo({
  typeName: P.ZodAny,
  ...oe(e)
});
var $r = class extends le {
  static {
    s(this, "ZodUnknown");
  }
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(t) {
    return tt(t.data);
  }
};
$r.create = (e) => new $r({
  typeName: P.ZodUnknown,
  ...oe(e)
});
var qt = class extends le {
  static {
    s(this, "ZodNever");
  }
  _parse(t) {
    let n = this._getOrReturnCtx(t);
    return R(n, {
      code: E.invalid_type,
      expected: D.never,
      received: n.parsedType
    }), H;
  }
};
qt.create = (e) => new qt({
  typeName: P.ZodNever,
  ...oe(e)
});
var Ko = class extends le {
  static {
    s(this, "ZodVoid");
  }
  _parse(t) {
    if (this._getType(t) !== D.undefined) {
      let o = this._getOrReturnCtx(t);
      return R(o, {
        code: E.invalid_type,
        expected: D.void,
        received: o.parsedType
      }), H;
    }
    return tt(t.data);
  }
};
Ko.create = (e) => new Ko({
  typeName: P.ZodVoid,
  ...oe(e)
});
var wr = class e extends le {
  static {
    s(this, "ZodArray");
  }
  _parse(t) {
    let { ctx: n, status: o } = this._processInputParams(t), r = this._def;
    if (n.parsedType !== D.array)
      return R(n, {
        code: E.invalid_type,
        expected: D.array,
        received: n.parsedType
      }), H;
    if (r.exactLength !== null) {
      let a = n.data.length > r.exactLength.value, u = n.data.length < r.exactLength.value;
      (a || u) && (R(n, {
        code: a ? E.too_big : E.too_small,
        minimum: u ? r.exactLength.value : void 0,
        maximum: a ? r.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: r.exactLength.message
      }), o.dirty());
    }
    if (r.minLength !== null && n.data.length < r.minLength.value && (R(n, {
      code: E.too_small,
      minimum: r.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.minLength.message
    }), o.dirty()), r.maxLength !== null && n.data.length > r.maxLength.value && (R(n, {
      code: E.too_big,
      maximum: r.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.maxLength.message
    }), o.dirty()), n.common.async)
      return Promise.all([...n.data].map((a, u) => r.type._parseAsync(new It(n, a, n.path, u)))).then((a) => Ke.mergeArray(o, a));
    let i = [...n.data].map((a, u) => r.type._parseSync(new It(n, a, n.path, u)));
    return Ke.mergeArray(o, i);
  }
  get element() {
    return this._def.type;
  }
  min(t, n) {
    return new e({
      ...this._def,
      minLength: { value: t, message: q.toString(n) }
    });
  }
  max(t, n) {
    return new e({
      ...this._def,
      maxLength: { value: t, message: q.toString(n) }
    });
  }
  length(t, n) {
    return new e({
      ...this._def,
      exactLength: { value: t, message: q.toString(n) }
    });
  }
  nonempty(t) {
    return this.min(1, t);
  }
};
wr.create = (e, t) => new wr({
  type: e,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: P.ZodArray,
  ...oe(t)
});
function Tn(e) {
  if (e instanceof _t) {
    let t = {};
    for (let n in e.shape) {
      let o = e.shape[n];
      t[n] = Pt.create(Tn(o));
    }
    return new _t({
      ...e._def,
      shape: /* @__PURE__ */ s(() => t, "shape")
    });
  } else return e instanceof wr ? new wr({
    ...e._def,
    type: Tn(e.element)
  }) : e instanceof Pt ? Pt.create(Tn(e.unwrap())) : e instanceof ir ? ir.create(Tn(e.unwrap())) : e instanceof or ? or.create(e.items.map((t) => Tn(t))) : e;
}
s(Tn, "deepPartialify");
var _t = class e extends le {
  static {
    s(this, "ZodObject");
  }
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    let t = this._def.shape(), n = me.objectKeys(t);
    return this._cached = { shape: t, keys: n }, this._cached;
  }
  _parse(t) {
    if (this._getType(t) !== D.object) {
      let d = this._getOrReturnCtx(t);
      return R(d, {
        code: E.invalid_type,
        expected: D.object,
        received: d.parsedType
      }), H;
    }
    let { status: o, ctx: r } = this._processInputParams(t), { shape: i, keys: a } = this._getCached(), u = [];
    if (!(this._def.catchall instanceof qt && this._def.unknownKeys === "strip"))
      for (let d in r.data)
        a.includes(d) || u.push(d);
    let c = [];
    for (let d of a) {
      let p = i[d], f = r.data[d];
      c.push({
        key: { status: "valid", value: d },
        value: p._parse(new It(r, f, r.path, d)),
        alwaysSet: d in r.data
      });
    }
    if (this._def.catchall instanceof qt) {
      let d = this._def.unknownKeys;
      if (d === "passthrough")
        for (let p of u)
          c.push({
            key: { status: "valid", value: p },
            value: { status: "valid", value: r.data[p] }
          });
      else if (d === "strict")
        u.length > 0 && (R(r, {
          code: E.unrecognized_keys,
          keys: u
        }), o.dirty());
      else if (d !== "strip")
        throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      let d = this._def.catchall;
      for (let p of u) {
        let f = r.data[p];
        c.push({
          key: { status: "valid", value: p },
          value: d._parse(
            new It(r, f, r.path, p)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: p in r.data
        });
      }
    }
    return r.common.async ? Promise.resolve().then(async () => {
      let d = [];
      for (let p of c) {
        let f = await p.key, h = await p.value;
        d.push({
          key: f,
          value: h,
          alwaysSet: p.alwaysSet
        });
      }
      return d;
    }).then((d) => Ke.mergeObjectSync(o, d)) : Ke.mergeObjectSync(o, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(t) {
    return q.errToObj, new e({
      ...this._def,
      unknownKeys: "strict",
      ...t !== void 0 ? {
        errorMap: /* @__PURE__ */ s((n, o) => {
          let r = this._def.errorMap?.(n, o).message ?? o.defaultError;
          return n.code === "unrecognized_keys" ? {
            message: q.errToObj(t).message ?? r
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
      shape: /* @__PURE__ */ s(() => ({
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
      shape: /* @__PURE__ */ s(() => ({
        ...this._def.shape(),
        ...t._def.shape()
      }), "shape"),
      typeName: P.ZodObject
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
    for (let o of me.objectKeys(t))
      t[o] && this.shape[o] && (n[o] = this.shape[o]);
    return new e({
      ...this._def,
      shape: /* @__PURE__ */ s(() => n, "shape")
    });
  }
  omit(t) {
    let n = {};
    for (let o of me.objectKeys(this.shape))
      t[o] || (n[o] = this.shape[o]);
    return new e({
      ...this._def,
      shape: /* @__PURE__ */ s(() => n, "shape")
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return Tn(this);
  }
  partial(t) {
    let n = {};
    for (let o of me.objectKeys(this.shape)) {
      let r = this.shape[o];
      t && !t[o] ? n[o] = r : n[o] = r.optional();
    }
    return new e({
      ...this._def,
      shape: /* @__PURE__ */ s(() => n, "shape")
    });
  }
  required(t) {
    let n = {};
    for (let o of me.objectKeys(this.shape))
      if (t && !t[o])
        n[o] = this.shape[o];
      else {
        let i = this.shape[o];
        for (; i instanceof Pt; )
          i = i._def.innerType;
        n[o] = i;
      }
    return new e({
      ...this._def,
      shape: /* @__PURE__ */ s(() => n, "shape")
    });
  }
  keyof() {
    return mv(me.objectKeys(this.shape));
  }
};
_t.create = (e, t) => new _t({
  shape: /* @__PURE__ */ s(() => e, "shape"),
  unknownKeys: "strip",
  catchall: qt.create(),
  typeName: P.ZodObject,
  ...oe(t)
});
_t.strictCreate = (e, t) => new _t({
  shape: /* @__PURE__ */ s(() => e, "shape"),
  unknownKeys: "strict",
  catchall: qt.create(),
  typeName: P.ZodObject,
  ...oe(t)
});
_t.lazycreate = (e, t) => new _t({
  shape: e,
  unknownKeys: "strip",
  catchall: qt.create(),
  typeName: P.ZodObject,
  ...oe(t)
});
var jn = class extends le {
  static {
    s(this, "ZodUnion");
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
      let a = i.map((u) => new yt(u.ctx.common.issues));
      return R(n, {
        code: E.invalid_union,
        unionErrors: a
      }), H;
    }
    if (s(r, "handleResults"), n.common.async)
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
      let u = a.map((c) => new yt(c));
      return R(n, {
        code: E.invalid_union,
        unionErrors: u
      }), H;
    }
  }
  get options() {
    return this._def.options;
  }
};
jn.create = (e, t) => new jn({
  options: e,
  typeName: P.ZodUnion,
  ...oe(t)
});
var nr = /* @__PURE__ */ s((e) => e instanceof Nn ? nr(e.schema) : e instanceof Nt ? nr(e.innerType()) : e instanceof An ? [e.value] : e instanceof Rn ? e.options : e instanceof Cn ? me.objectValues(e.enum) : e instanceof Dn ? nr(e._def.innerType) : e instanceof En ? [void 0] : e instanceof On ? [null] : e instanceof Pt ? [void 0, ...nr(e.unwrap())] : e instanceof ir ? [null, ...nr(e.unwrap())] : e instanceof Xa || e instanceof Mn ? nr(e.unwrap()) : e instanceof Un ? nr(e._def.innerType) : [], "getDiscriminator"), _m = class e extends le {
  static {
    s(this, "ZodDiscriminatedUnion");
  }
  _parse(t) {
    let { ctx: n } = this._processInputParams(t);
    if (n.parsedType !== D.object)
      return R(n, {
        code: E.invalid_type,
        expected: D.object,
        received: n.parsedType
      }), H;
    let o = this.discriminator, r = n.data[o], i = this.optionsMap.get(r);
    return i ? n.common.async ? i._parseAsync({
      data: n.data,
      path: n.path,
      parent: n
    }) : i._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }) : (R(n, {
      code: E.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [o]
    }), H);
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
      let a = nr(i.shape[t]);
      if (!a.length)
        throw new Error(`A discriminator value for key \`${t}\` could not be extracted from all schema options`);
      for (let u of a) {
        if (r.has(u))
          throw new Error(`Discriminator property ${String(t)} has duplicate value ${String(u)}`);
        r.set(u, i);
      }
    }
    return new e({
      typeName: P.ZodDiscriminatedUnion,
      discriminator: t,
      options: n,
      optionsMap: r,
      ...oe(o)
    });
  }
};
function bm(e, t) {
  let n = rr(e), o = rr(t);
  if (e === t)
    return { valid: !0, data: e };
  if (n === D.object && o === D.object) {
    let r = me.objectKeys(t), i = me.objectKeys(e).filter((u) => r.indexOf(u) !== -1), a = { ...e, ...t };
    for (let u of i) {
      let c = bm(e[u], t[u]);
      if (!c.valid)
        return { valid: !1 };
      a[u] = c.data;
    }
    return { valid: !0, data: a };
  } else if (n === D.array && o === D.array) {
    if (e.length !== t.length)
      return { valid: !1 };
    let r = [];
    for (let i = 0; i < e.length; i++) {
      let a = e[i], u = t[i], c = bm(a, u);
      if (!c.valid)
        return { valid: !1 };
      r.push(c.data);
    }
    return { valid: !0, data: r };
  } else return n === D.date && o === D.date && +e == +t ? { valid: !0, data: e } : { valid: !1 };
}
s(bm, "mergeValues");
var Pn = class extends le {
  static {
    s(this, "ZodIntersection");
  }
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t), r = /* @__PURE__ */ s((i, a) => {
      if (hm(i) || hm(a))
        return H;
      let u = bm(i.value, a.value);
      return u.valid ? ((vm(i) || vm(a)) && n.dirty(), { status: n.value, value: u.data }) : (R(o, {
        code: E.invalid_intersection_types
      }), H);
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
Pn.create = (e, t, n) => new Pn({
  left: e,
  right: t,
  typeName: P.ZodIntersection,
  ...oe(n)
});
var or = class e extends le {
  static {
    s(this, "ZodTuple");
  }
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t);
    if (o.parsedType !== D.array)
      return R(o, {
        code: E.invalid_type,
        expected: D.array,
        received: o.parsedType
      }), H;
    if (o.data.length < this._def.items.length)
      return R(o, {
        code: E.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), H;
    !this._def.rest && o.data.length > this._def.items.length && (R(o, {
      code: E.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), n.dirty());
    let i = [...o.data].map((a, u) => {
      let c = this._def.items[u] || this._def.rest;
      return c ? c._parse(new It(o, a, o.path, u)) : null;
    }).filter((a) => !!a);
    return o.common.async ? Promise.all(i).then((a) => Ke.mergeArray(n, a)) : Ke.mergeArray(n, i);
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
or.create = (e, t) => {
  if (!Array.isArray(e))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new or({
    items: e,
    typeName: P.ZodTuple,
    rest: null,
    ...oe(t)
  });
};
var xm = class e extends le {
  static {
    s(this, "ZodRecord");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t);
    if (o.parsedType !== D.object)
      return R(o, {
        code: E.invalid_type,
        expected: D.object,
        received: o.parsedType
      }), H;
    let r = [], i = this._def.keyType, a = this._def.valueType;
    for (let u in o.data)
      r.push({
        key: i._parse(new It(o, u, o.path, u)),
        value: a._parse(new It(o, o.data[u], o.path, u)),
        alwaysSet: u in o.data
      });
    return o.common.async ? Ke.mergeObjectAsync(n, r) : Ke.mergeObjectSync(n, r);
  }
  get element() {
    return this._def.valueType;
  }
  static create(t, n, o) {
    return n instanceof le ? new e({
      keyType: t,
      valueType: n,
      typeName: P.ZodRecord,
      ...oe(o)
    }) : new e({
      keyType: zn.create(),
      valueType: t,
      typeName: P.ZodRecord,
      ...oe(n)
    });
  }
}, Ho = class extends le {
  static {
    s(this, "ZodMap");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t);
    if (o.parsedType !== D.map)
      return R(o, {
        code: E.invalid_type,
        expected: D.map,
        received: o.parsedType
      }), H;
    let r = this._def.keyType, i = this._def.valueType, a = [...o.data.entries()].map(([u, c], d) => ({
      key: r._parse(new It(o, u, o.path, [d, "key"])),
      value: i._parse(new It(o, c, o.path, [d, "value"]))
    }));
    if (o.common.async) {
      let u = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (let c of a) {
          let d = await c.key, p = await c.value;
          if (d.status === "aborted" || p.status === "aborted")
            return H;
          (d.status === "dirty" || p.status === "dirty") && n.dirty(), u.set(d.value, p.value);
        }
        return { status: n.value, value: u };
      });
    } else {
      let u = /* @__PURE__ */ new Map();
      for (let c of a) {
        let d = c.key, p = c.value;
        if (d.status === "aborted" || p.status === "aborted")
          return H;
        (d.status === "dirty" || p.status === "dirty") && n.dirty(), u.set(d.value, p.value);
      }
      return { status: n.value, value: u };
    }
  }
};
Ho.create = (e, t, n) => new Ho({
  valueType: t,
  keyType: e,
  typeName: P.ZodMap,
  ...oe(n)
});
var Xo = class e extends le {
  static {
    s(this, "ZodSet");
  }
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t);
    if (o.parsedType !== D.set)
      return R(o, {
        code: E.invalid_type,
        expected: D.set,
        received: o.parsedType
      }), H;
    let r = this._def;
    r.minSize !== null && o.data.size < r.minSize.value && (R(o, {
      code: E.too_small,
      minimum: r.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.minSize.message
    }), n.dirty()), r.maxSize !== null && o.data.size > r.maxSize.value && (R(o, {
      code: E.too_big,
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
          return H;
        p.status === "dirty" && n.dirty(), d.add(p.value);
      }
      return { status: n.value, value: d };
    }
    s(a, "finalizeSet");
    let u = [...o.data.values()].map((c, d) => i._parse(new It(o, c, o.path, d)));
    return o.common.async ? Promise.all(u).then((c) => a(c)) : a(u);
  }
  min(t, n) {
    return new e({
      ...this._def,
      minSize: { value: t, message: q.toString(n) }
    });
  }
  max(t, n) {
    return new e({
      ...this._def,
      maxSize: { value: t, message: q.toString(n) }
    });
  }
  size(t, n) {
    return this.min(t, n).max(t, n);
  }
  nonempty(t) {
    return this.min(1, t);
  }
};
Xo.create = (e, t) => new Xo({
  valueType: e,
  minSize: null,
  maxSize: null,
  typeName: P.ZodSet,
  ...oe(t)
});
var $m = class e extends le {
  static {
    s(this, "ZodFunction");
  }
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(t) {
    let { ctx: n } = this._processInputParams(t);
    if (n.parsedType !== D.function)
      return R(n, {
        code: E.invalid_type,
        expected: D.function,
        received: n.parsedType
      }), H;
    function o(u, c) {
      return Ha({
        data: u,
        path: n.path,
        errorMaps: [n.common.contextualErrorMap, n.schemaErrorMap, Lo(), xr].filter((d) => !!d),
        issueData: {
          code: E.invalid_arguments,
          argumentsError: c
        }
      });
    }
    s(o, "makeArgsIssue");
    function r(u, c) {
      return Ha({
        data: u,
        path: n.path,
        errorMaps: [n.common.contextualErrorMap, n.schemaErrorMap, Lo(), xr].filter((d) => !!d),
        issueData: {
          code: E.invalid_return_type,
          returnTypeError: c
        }
      });
    }
    s(r, "makeReturnsIssue");
    let i = { errorMap: n.common.contextualErrorMap }, a = n.data;
    if (this._def.returns instanceof Zr) {
      let u = this;
      return tt(async function(...c) {
        let d = new yt([]), p = await u._def.args.parseAsync(c, i).catch((m) => {
          throw d.addIssue(o(c, m)), d;
        }), f = await Reflect.apply(a, this, p);
        return await u._def.returns._def.type.parseAsync(f, i).catch((m) => {
          throw d.addIssue(r(f, m)), d;
        });
      });
    } else {
      let u = this;
      return tt(function(...c) {
        let d = u._def.args.safeParse(c, i);
        if (!d.success)
          throw new yt([o(c, d.error)]);
        let p = Reflect.apply(a, this, d.data), f = u._def.returns.safeParse(p, i);
        if (!f.success)
          throw new yt([r(p, f.error)]);
        return f.data;
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
      args: or.create(t).rest($r.create())
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
      args: t || or.create([]).rest($r.create()),
      returns: n || $r.create(),
      typeName: P.ZodFunction,
      ...oe(o)
    });
  }
}, Nn = class extends le {
  static {
    s(this, "ZodLazy");
  }
  get schema() {
    return this._def.getter();
  }
  _parse(t) {
    let { ctx: n } = this._processInputParams(t);
    return this._def.getter()._parse({ data: n.data, path: n.path, parent: n });
  }
};
Nn.create = (e, t) => new Nn({
  getter: e,
  typeName: P.ZodLazy,
  ...oe(t)
});
var An = class extends le {
  static {
    s(this, "ZodLiteral");
  }
  _parse(t) {
    if (t.data !== this._def.value) {
      let n = this._getOrReturnCtx(t);
      return R(n, {
        received: n.data,
        code: E.invalid_literal,
        expected: this._def.value
      }), H;
    }
    return { status: "valid", value: t.data };
  }
  get value() {
    return this._def.value;
  }
};
An.create = (e, t) => new An({
  value: e,
  typeName: P.ZodLiteral,
  ...oe(t)
});
function mv(e, t) {
  return new Rn({
    values: e,
    typeName: P.ZodEnum,
    ...oe(t)
  });
}
s(mv, "createZodEnum");
var Rn = class e extends le {
  static {
    s(this, "ZodEnum");
  }
  _parse(t) {
    if (typeof t.data != "string") {
      let n = this._getOrReturnCtx(t), o = this._def.values;
      return R(n, {
        expected: me.joinValues(o),
        received: n.parsedType,
        code: E.invalid_type
      }), H;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(t.data)) {
      let n = this._getOrReturnCtx(t), o = this._def.values;
      return R(n, {
        received: n.data,
        code: E.invalid_enum_value,
        options: o
      }), H;
    }
    return tt(t.data);
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
Rn.create = mv;
var Cn = class extends le {
  static {
    s(this, "ZodNativeEnum");
  }
  _parse(t) {
    let n = me.getValidEnumValues(this._def.values), o = this._getOrReturnCtx(t);
    if (o.parsedType !== D.string && o.parsedType !== D.number) {
      let r = me.objectValues(n);
      return R(o, {
        expected: me.joinValues(r),
        received: o.parsedType,
        code: E.invalid_type
      }), H;
    }
    if (this._cache || (this._cache = new Set(me.getValidEnumValues(this._def.values))), !this._cache.has(t.data)) {
      let r = me.objectValues(n);
      return R(o, {
        received: o.data,
        code: E.invalid_enum_value,
        options: r
      }), H;
    }
    return tt(t.data);
  }
  get enum() {
    return this._def.values;
  }
};
Cn.create = (e, t) => new Cn({
  values: e,
  typeName: P.ZodNativeEnum,
  ...oe(t)
});
var Zr = class extends le {
  static {
    s(this, "ZodPromise");
  }
  unwrap() {
    return this._def.type;
  }
  _parse(t) {
    let { ctx: n } = this._processInputParams(t);
    if (n.parsedType !== D.promise && n.common.async === !1)
      return R(n, {
        code: E.invalid_type,
        expected: D.promise,
        received: n.parsedType
      }), H;
    let o = n.parsedType === D.promise ? n.data : Promise.resolve(n.data);
    return tt(o.then((r) => this._def.type.parseAsync(r, {
      path: n.path,
      errorMap: n.common.contextualErrorMap
    })));
  }
};
Zr.create = (e, t) => new Zr({
  type: e,
  typeName: P.ZodPromise,
  ...oe(t)
});
var Nt = class extends le {
  static {
    s(this, "ZodEffects");
  }
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === P.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t), r = this._def.effect || null, i = {
      addIssue: /* @__PURE__ */ s((a) => {
        R(o, a), a.fatal ? n.abort() : n.dirty();
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
            return H;
          let c = await this._def.schema._parseAsync({
            data: u,
            path: o.path,
            parent: o
          });
          return c.status === "aborted" ? H : c.status === "dirty" ? Sn(c.value) : n.value === "dirty" ? Sn(c.value) : c;
        });
      {
        if (n.value === "aborted")
          return H;
        let u = this._def.schema._parseSync({
          data: a,
          path: o.path,
          parent: o
        });
        return u.status === "aborted" ? H : u.status === "dirty" ? Sn(u.value) : n.value === "dirty" ? Sn(u.value) : u;
      }
    }
    if (r.type === "refinement") {
      let a = /* @__PURE__ */ s((u) => {
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
        return u.status === "aborted" ? H : (u.status === "dirty" && n.dirty(), a(u.value), { status: n.value, value: u.value });
      } else
        return this._def.schema._parseAsync({ data: o.data, path: o.path, parent: o }).then((u) => u.status === "aborted" ? H : (u.status === "dirty" && n.dirty(), a(u.value).then(() => ({ status: n.value, value: u.value }))));
    }
    if (r.type === "transform")
      if (o.common.async === !1) {
        let a = this._def.schema._parseSync({
          data: o.data,
          path: o.path,
          parent: o
        });
        if (!Mr(a))
          return H;
        let u = r.transform(a.value, i);
        if (u instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: n.value, value: u };
      } else
        return this._def.schema._parseAsync({ data: o.data, path: o.path, parent: o }).then((a) => Mr(a) ? Promise.resolve(r.transform(a.value, i)).then((u) => ({
          status: n.value,
          value: u
        })) : H);
    me.assertNever(r);
  }
};
Nt.create = (e, t, n) => new Nt({
  schema: e,
  typeName: P.ZodEffects,
  effect: t,
  ...oe(n)
});
Nt.createWithPreprocess = (e, t, n) => new Nt({
  schema: t,
  effect: { type: "preprocess", transform: e },
  typeName: P.ZodEffects,
  ...oe(n)
});
var Pt = class extends le {
  static {
    s(this, "ZodOptional");
  }
  _parse(t) {
    return this._getType(t) === D.undefined ? tt(void 0) : this._def.innerType._parse(t);
  }
  unwrap() {
    return this._def.innerType;
  }
};
Pt.create = (e, t) => new Pt({
  innerType: e,
  typeName: P.ZodOptional,
  ...oe(t)
});
var ir = class extends le {
  static {
    s(this, "ZodNullable");
  }
  _parse(t) {
    return this._getType(t) === D.null ? tt(null) : this._def.innerType._parse(t);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ir.create = (e, t) => new ir({
  innerType: e,
  typeName: P.ZodNullable,
  ...oe(t)
});
var Dn = class extends le {
  static {
    s(this, "ZodDefault");
  }
  _parse(t) {
    let { ctx: n } = this._processInputParams(t), o = n.data;
    return n.parsedType === D.undefined && (o = this._def.defaultValue()), this._def.innerType._parse({
      data: o,
      path: n.path,
      parent: n
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
Dn.create = (e, t) => new Dn({
  innerType: e,
  typeName: P.ZodDefault,
  defaultValue: typeof t.default == "function" ? t.default : () => t.default,
  ...oe(t)
});
var Un = class extends le {
  static {
    s(this, "ZodCatch");
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
    return Fo(r) ? r.then((i) => ({
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new yt(o.common.issues);
        },
        input: o.data
      })
    })) : {
      status: "valid",
      value: r.status === "valid" ? r.value : this._def.catchValue({
        get error() {
          return new yt(o.common.issues);
        },
        input: o.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
};
Un.create = (e, t) => new Un({
  innerType: e,
  typeName: P.ZodCatch,
  catchValue: typeof t.catch == "function" ? t.catch : () => t.catch,
  ...oe(t)
});
var Yo = class extends le {
  static {
    s(this, "ZodNaN");
  }
  _parse(t) {
    if (this._getType(t) !== D.nan) {
      let o = this._getOrReturnCtx(t);
      return R(o, {
        code: E.invalid_type,
        expected: D.nan,
        received: o.parsedType
      }), H;
    }
    return { status: "valid", value: t.data };
  }
};
Yo.create = (e) => new Yo({
  typeName: P.ZodNaN,
  ...oe(e)
});
var WP = Symbol("zod_brand"), Xa = class extends le {
  static {
    s(this, "ZodBranded");
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
}, Ya = class e extends le {
  static {
    s(this, "ZodPipeline");
  }
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t);
    if (o.common.async)
      return (/* @__PURE__ */ s(async () => {
        let i = await this._def.in._parseAsync({
          data: o.data,
          path: o.path,
          parent: o
        });
        return i.status === "aborted" ? H : i.status === "dirty" ? (n.dirty(), Sn(i.value)) : this._def.out._parseAsync({
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
      return r.status === "aborted" ? H : r.status === "dirty" ? (n.dirty(), {
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
      typeName: P.ZodPipeline
    });
  }
}, Mn = class extends le {
  static {
    s(this, "ZodReadonly");
  }
  _parse(t) {
    let n = this._def.innerType._parse(t), o = /* @__PURE__ */ s((r) => (Mr(r) && (r.value = Object.freeze(r.value)), r), "freeze");
    return Fo(n) ? n.then((r) => o(r)) : o(n);
  }
  unwrap() {
    return this._def.innerType;
  }
};
Mn.create = (e, t) => new Mn({
  innerType: e,
  typeName: P.ZodReadonly,
  ...oe(t)
});
var KP = {
  object: _t.lazycreate
}, P;
(function(e) {
  e.ZodString = "ZodString", e.ZodNumber = "ZodNumber", e.ZodNaN = "ZodNaN", e.ZodBigInt = "ZodBigInt", e.ZodBoolean = "ZodBoolean", e.ZodDate = "ZodDate", e.ZodSymbol = "ZodSymbol", e.ZodUndefined = "ZodUndefined", e.ZodNull = "ZodNull", e.ZodAny = "ZodAny", e.ZodUnknown = "ZodUnknown", e.ZodNever = "ZodNever", e.ZodVoid = "ZodVoid", e.ZodArray = "ZodArray", e.ZodObject = "ZodObject", e.ZodUnion = "ZodUnion", e.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", e.ZodIntersection = "ZodIntersection", e.ZodTuple = "ZodTuple", e.ZodRecord = "ZodRecord", e.ZodMap = "ZodMap", e.ZodSet = "ZodSet", e.ZodFunction = "ZodFunction", e.ZodLazy = "ZodLazy", e.ZodLiteral = "ZodLiteral", e.ZodEnum = "ZodEnum", e.ZodEffects = "ZodEffects", e.ZodNativeEnum = "ZodNativeEnum", e.ZodOptional = "ZodOptional", e.ZodNullable = "ZodNullable", e.ZodDefault = "ZodDefault", e.ZodCatch = "ZodCatch", e.ZodPromise = "ZodPromise", e.ZodBranded = "ZodBranded", e.ZodPipeline = "ZodPipeline", e.ZodReadonly = "ZodReadonly";
})(P || (P = {}));
var HP = zn.create, XP = Vo.create, YP = Yo.create, QP = qo.create, eN = Jo.create, tN = Bo.create, rN = Go.create, nN = En.create, oN = On.create, iN = Wo.create, aN = $r.create, sN = qt.create, lN = Ko.create, uN = wr.create, cN = _t.create, dN = _t.strictCreate, pN = jn.create, mN = _m.create, fN = Pn.create, gN = or.create, hN = xm.create, vN = Ho.create, yN = Xo.create, _N = $m.create, bN = Nn.create, xN = An.create, $N = Rn.create, wN = Cn.create, kN = Zr.create, IN = Nt.create, SN = Pt.create, TN = ir.create, zN = Nt.createWithPreprocess, EN = Ya.create;

// node_modules/@ai-sdk/provider-utils/dist/index.mjs
function Ne(...e) {
  return e.reduce(
    (t, n) => ({
      ...t,
      ...n ?? {}
    }),
    {}
  );
}
s(Ne, "combineHeaders");
async function ts(e, t) {
  if (e == null)
    return Promise.resolve();
  let n = t?.abortSignal;
  return new Promise((o, r) => {
    if (n?.aborted) {
      r(fv());
      return;
    }
    let i = setTimeout(() => {
      a(), o();
    }, e), a = /* @__PURE__ */ s(() => {
      clearTimeout(i), n?.removeEventListener("abort", u);
    }, "cleanup"), u = /* @__PURE__ */ s(() => {
      a(), r(fv());
    }, "onAbort");
    n?.addEventListener("abort", u);
  });
}
s(ts, "delay");
function fv() {
  return new DOMException("Delay was aborted", "AbortError");
}
s(fv, "createAbortError");
var xt = class {
  static {
    s(this, "DelayedPromise");
  }
  constructor() {
    this.status = { type: "pending" }, this._resolve = void 0, this._reject = void 0;
  }
  get promise() {
    return this._promise ? this._promise : (this._promise = new Promise((e, t) => {
      this.status.type === "resolved" ? e(this.status.value) : this.status.type === "rejected" && t(this.status.error), this._resolve = e, this._reject = t;
    }), this._promise);
  }
  resolve(e) {
    var t;
    this.status = { type: "resolved", value: e }, this._promise && ((t = this._resolve) == null || t.call(this, e));
  }
  reject(e) {
    var t;
    this.status = { type: "rejected", error: e }, this._promise && ((t = this._reject) == null || t.call(this, e));
  }
  isResolved() {
    return this.status.type === "resolved";
  }
  isRejected() {
    return this.status.type === "rejected";
  }
  isPending() {
    return this.status.type === "pending";
  }
};
function Zn(e) {
  return Object.fromEntries([...e.headers]);
}
s(Zn, "extractResponseHeaders");
var sr = /* @__PURE__ */ s(({
  prefix: e,
  size: t = 16,
  alphabet: n = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  separator: o = "-"
} = {}) => {
  let r = /* @__PURE__ */ s(() => {
    let i = n.length, a = new Array(t);
    for (let u = 0; u < t; u++)
      a[u] = n[Math.random() * i | 0];
    return a.join("");
  }, "generator");
  if (e == null)
    return r;
  if (n.includes(o))
    throw new In({
      argument: "separator",
      message: `The separator "${o}" must not be part of the alphabet "${n}".`
    });
  return () => `${e}${o}${r()}`;
}, "createIdGenerator"), nt = sr();
function Ln(e) {
  return e == null ? "unknown error" : typeof e == "string" ? e : e instanceof Error ? e.message : JSON.stringify(e);
}
s(Ln, "getErrorMessage");
function ar(e) {
  return (e instanceof Error || e instanceof DOMException) && (e.name === "AbortError" || e.name === "ResponseAborted" || // Next.js
  e.name === "TimeoutError");
}
s(ar, "isAbortError");
var Uw = ["fetch failed", "failed to fetch"];
function yv({
  error: e,
  url: t,
  requestBodyValues: n
}) {
  if (ar(e))
    return e;
  if (e instanceof TypeError && Uw.includes(e.message.toLowerCase())) {
    let o = e.cause;
    if (o != null)
      return new Pe({
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
s(yv, "handleFetchError");
function rs(e = globalThis) {
  var t, n, o;
  return e.window ? "runtime/browser" : (t = e.navigator) != null && t.userAgent ? `runtime/${e.navigator.userAgent.toLowerCase()}` : (o = (n = e.process) == null ? void 0 : n.versions) != null && o.node ? `runtime/node.js/${e.process.version.substring(0)}` : e.EdgeRuntime ? "runtime/vercel-edge" : "runtime/unknown";
}
s(rs, "getRuntimeEnvironmentUserAgent");
function Mw(e) {
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
s(Mw, "normalizeHeaders");
function He(e, ...t) {
  let n = new Headers(Mw(e)), o = n.get("user-agent") || "";
  return n.set(
    "user-agent",
    [o, ...t].filter(Boolean).join(" ")
  ), Object.fromEntries(n.entries());
}
s(He, "withUserAgentSuffix");
var _v = "3.0.20", Zw = /* @__PURE__ */ s(() => globalThis.fetch, "getOriginalFetch"), Tm = /* @__PURE__ */ s(async ({
  url: e,
  headers: t = {},
  successfulResponseHandler: n,
  failedResponseHandler: o,
  abortSignal: r,
  fetch: i = Zw()
}) => {
  try {
    let a = await i(e, {
      method: "GET",
      headers: He(
        t,
        `ai-sdk/provider-utils/${_v}`,
        rs()
      ),
      signal: r
    }), u = Zn(a);
    if (!a.ok) {
      let c;
      try {
        c = await o({
          response: a,
          url: e,
          requestBodyValues: {}
        });
      } catch (d) {
        throw ar(d) || Pe.isInstance(d) ? d : new Pe({
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
      throw c instanceof Error && (ar(c) || Pe.isInstance(c)) ? c : new Pe({
        message: "Failed to process successful response",
        cause: c,
        statusCode: a.status,
        url: e,
        responseHeaders: u,
        requestBodyValues: {}
      });
    }
  } catch (a) {
    throw yv({ error: a, url: e, requestBodyValues: {} });
  }
}, "getFromApi");
function bv({
  mediaType: e,
  url: t,
  supportedUrls: n
}) {
  return t = t.toLowerCase(), e = e.toLowerCase(), Object.entries(n).map(([o, r]) => {
    let i = o.toLowerCase();
    return i === "*" || i === "*/*" ? { mediaTypePrefix: "", regexes: r } : { mediaTypePrefix: i.replace(/\*/, ""), regexes: r };
  }).filter(({ mediaTypePrefix: o }) => e.startsWith(o)).flatMap(({ regexes: o }) => o).some((o) => o.test(t));
}
s(bv, "isUrlSupported");
function xv({
  apiKey: e,
  environmentVariableName: t,
  apiKeyParameterName: n = "apiKey",
  description: o
}) {
  if (typeof e == "string")
    return e;
  if (e != null)
    throw new Mo({
      message: `${o} API key must be a string.`
    });
  if (typeof process > "u")
    throw new Mo({
      message: `${o} API key is missing. Pass it using the '${n}' parameter. Environment variables is not supported in this environment.`
    });
  if (e = process.env[t], e == null)
    throw new Mo({
      message: `${o} API key is missing. Pass it using the '${n}' parameter or the ${t} environment variable.`
    });
  if (typeof e != "string")
    throw new Mo({
      message: `${o} API key must be a string. The value of the ${t} environment variable is not a string.`
    });
  return e;
}
s(xv, "loadApiKey");
function Lr({
  settingValue: e,
  environmentVariableName: t
}) {
  if (typeof e == "string")
    return e;
  if (!(e != null || typeof process > "u") && (e = process.env[t], !(e == null || typeof e != "string")))
    return e;
}
s(Lr, "loadOptionalSetting");
function $v(e) {
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
s($v, "mediaTypeToExtension");
var Lw = /"__proto__"\s*:/, Fw = /"constructor"\s*:/;
function gv(e) {
  let t = JSON.parse(e);
  return t === null || typeof t != "object" || Lw.test(e) === !1 && Fw.test(e) === !1 ? t : Vw(t);
}
s(gv, "_parse");
function Vw(e) {
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
s(Vw, "filter");
function zm(e) {
  let { stackTraceLimit: t } = Error;
  try {
    Error.stackTraceLimit = 0;
  } catch {
    return gv(e);
  }
  try {
    return gv(e);
  } finally {
    Error.stackTraceLimit = t;
  }
}
s(zm, "secureJsonParse");
var es = Symbol.for("vercel.ai.validator");
function qw(e) {
  return { [es]: !0, validate: e };
}
s(qw, "validator");
function Jw(e) {
  return typeof e == "object" && e !== null && es in e && e[es] === !0 && "validate" in e;
}
s(Jw, "isValidator");
function ie(e) {
  let t;
  return () => (t == null && (t = e()), t);
}
s(ie, "lazyValidator");
function Bw(e) {
  return Jw(e) ? e : typeof e == "function" ? e() : Gw(e);
}
s(Bw, "asValidator");
function Gw(e) {
  return qw(async (t) => {
    let n = await e["~standard"].validate(t);
    return n.issues == null ? { success: !0, value: n.value } : {
      success: !1,
      error: new Ge({
        value: t,
        cause: n.issues
      })
    };
  });
}
s(Gw, "standardSchemaValidator");
async function dt({
  value: e,
  schema: t
}) {
  let n = await qe({ value: e, schema: t });
  if (!n.success)
    throw Ge.wrap({ value: e, cause: n.error });
  return n.value;
}
s(dt, "validateTypes");
async function qe({
  value: e,
  schema: t
}) {
  let n = Bw(t);
  try {
    if (n.validate == null)
      return { success: !0, value: e, rawValue: e };
    let o = await n.validate(e);
    return o.success ? { success: !0, value: o.value, rawValue: e } : {
      success: !1,
      error: Ge.wrap({ value: e, cause: o.error }),
      rawValue: e
    };
  } catch (o) {
    return {
      success: !1,
      error: Ge.wrap({ value: e, cause: o }),
      rawValue: e
    };
  }
}
s(qe, "safeValidateTypes");
async function Ww({
  text: e,
  schema: t
}) {
  try {
    let n = zm(e);
    return t == null ? n : dt({ value: n, schema: t });
  } catch (n) {
    throw Ur.isInstance(n) || Ge.isInstance(n) ? n : new Ur({ text: e, cause: n });
  }
}
s(Ww, "parseJSON");
async function St({
  text: e,
  schema: t
}) {
  try {
    let n = zm(e);
    return t == null ? { success: !0, value: n, rawValue: n } : await qe({ value: n, schema: t });
  } catch (n) {
    return {
      success: !1,
      error: Ur.isInstance(n) ? n : new Ur({ text: e, cause: n }),
      rawValue: void 0
    };
  }
}
s(St, "safeParseJSON");
function Em(e) {
  try {
    return zm(e), !0;
  } catch {
    return !1;
  }
}
s(Em, "isParsableJson");
function Kw({
  stream: e,
  schema: t
}) {
  return e.pipeThrough(new TextDecoderStream()).pipeThrough(new Ka()).pipeThrough(
    new TransformStream({
      async transform({ data: n }, o) {
        n !== "[DONE]" && o.enqueue(await St({ text: n, schema: t }));
      }
    })
  );
}
s(Kw, "parseJsonEventStream");
async function ot({
  provider: e,
  providerOptions: t,
  schema: n
}) {
  if (t?.[e] == null)
    return;
  let o = await qe({
    value: t[e],
    schema: n
  });
  if (!o.success)
    throw new In({
      argument: "providerOptions",
      message: `invalid ${e} provider options`,
      cause: o.error
    });
  return o.value;
}
s(ot, "parseProviderOptions");
var Hw = /* @__PURE__ */ s(() => globalThis.fetch, "getOriginalFetch2"), Ce = /* @__PURE__ */ s(async ({
  url: e,
  headers: t,
  body: n,
  failedResponseHandler: o,
  successfulResponseHandler: r,
  abortSignal: i,
  fetch: a
}) => kv({
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
}), "postJsonToApi"), wv = /* @__PURE__ */ s(async ({
  url: e,
  headers: t,
  formData: n,
  failedResponseHandler: o,
  successfulResponseHandler: r,
  abortSignal: i,
  fetch: a
}) => kv({
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
}), "postFormDataToApi"), kv = /* @__PURE__ */ s(async ({
  url: e,
  headers: t = {},
  body: n,
  successfulResponseHandler: o,
  failedResponseHandler: r,
  abortSignal: i,
  fetch: a = Hw()
}) => {
  try {
    let u = await a(e, {
      method: "POST",
      headers: He(
        t,
        `ai-sdk/provider-utils/${_v}`,
        rs()
      ),
      body: n.content,
      signal: i
    }), c = Zn(u);
    if (!u.ok) {
      let d;
      try {
        d = await r({
          response: u,
          url: e,
          requestBodyValues: n.values
        });
      } catch (p) {
        throw ar(p) || Pe.isInstance(p) ? p : new Pe({
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
      throw d instanceof Error && (ar(d) || Pe.isInstance(d)) ? d : new Pe({
        message: "Failed to process successful response",
        cause: d,
        statusCode: u.status,
        url: e,
        responseHeaders: c,
        requestBodyValues: n.values
      });
    }
  } catch (u) {
    throw yv({ error: u, url: e, requestBodyValues: n.values });
  }
}, "postToApi");
function Tt({
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
s(Tt, "createProviderDefinedToolFactoryWithOutputSchema");
async function pt(e) {
  return typeof e == "function" && (e = e()), Promise.resolve(e);
}
s(pt, "resolve");
var zt = /* @__PURE__ */ s(({
  errorSchema: e,
  errorToMessage: t,
  isRetryable: n
}) => async ({ response: o, url: r, requestBodyValues: i }) => {
  let a = await o.text(), u = Zn(o);
  if (a.trim() === "")
    return {
      responseHeaders: u,
      value: new Pe({
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
    let c = await Ww({
      text: a,
      schema: e
    });
    return {
      responseHeaders: u,
      value: new Pe({
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
      value: new Pe({
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
}, "createJsonErrorResponseHandler"), kr = /* @__PURE__ */ s((e) => async ({ response: t }) => {
  let n = Zn(t);
  if (t.body == null)
    throw new Uh({});
  return {
    responseHeaders: n,
    value: Kw({
      stream: t.body,
      schema: e
    })
  };
}, "createEventSourceResponseHandler");
var Me = /* @__PURE__ */ s((e) => async ({ response: t, url: n, requestBodyValues: o }) => {
  let r = await t.text(), i = await St({
    text: r,
    schema: e
  }), a = Zn(t);
  if (!i.success)
    throw new Pe({
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
}, "createJsonResponseHandler"), Iv = /* @__PURE__ */ s(() => async ({ response: e, url: t, requestBodyValues: n }) => {
  let o = Zn(e);
  if (!e.body)
    throw new Pe({
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
    throw new Pe({
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
function Qa(e) {
  if (e.type === "object") {
    e.additionalProperties = !1;
    let t = e.properties;
    if (t != null)
      for (let n in t)
        t[n] = Qa(
          t[n]
        );
  }
  return e.type === "array" && e.items != null && (Array.isArray(e.items) ? e.items = e.items.map(
    (t) => Qa(t)
  ) : e.items = Qa(
    e.items
  )), e;
}
s(Qa, "addAdditionalPropertiesToJsonSchema");
var Xw = /* @__PURE__ */ s((e, t) => {
  let n = 0;
  for (; n < e.length && n < t.length && e[n] === t[n]; n++)
    ;
  return [(e.length - n).toString(), ...t.slice(n)].join("/");
}, "getRelativePath"), Yw = Symbol(
  "Let zodToJsonSchema decide on which parser to use"
), hv = {
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
}, Qw = /* @__PURE__ */ s((e) => typeof e == "string" ? {
  ...hv,
  name: e
} : {
  ...hv,
  ...e
}, "getDefaultOptions");
function bt() {
  return {};
}
s(bt, "parseAnyDef");
function ek(e, t) {
  var n, o, r;
  let i = {
    type: "array"
  };
  return (n = e.type) != null && n._def && ((r = (o = e.type) == null ? void 0 : o._def) == null ? void 0 : r.typeName) !== P.ZodAny && (i.items = Se(e.type._def, {
    ...t,
    currentPath: [...t.currentPath, "items"]
  })), e.minLength && (i.minItems = e.minLength.value), e.maxLength && (i.maxItems = e.maxLength.value), e.exactLength && (i.minItems = e.exactLength.value, i.maxItems = e.exactLength.value), i;
}
s(ek, "parseArrayDef");
function tk(e) {
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
s(tk, "parseBigintDef");
function rk() {
  return { type: "boolean" };
}
s(rk, "parseBooleanDef");
function Sv(e, t) {
  return Se(e.type._def, t);
}
s(Sv, "parseBrandedDef");
var nk = /* @__PURE__ */ s((e, t) => Se(e.innerType._def, t), "parseCatchDef");
function Tv(e, t, n) {
  let o = n ?? t.dateStrategy;
  if (Array.isArray(o))
    return {
      anyOf: o.map((r, i) => Tv(e, t, r))
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
      return ok(e);
  }
}
s(Tv, "parseDateDef");
var ok = /* @__PURE__ */ s((e) => {
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
function ik(e, t) {
  return {
    ...Se(e.innerType._def, t),
    default: e.defaultValue()
  };
}
s(ik, "parseDefaultDef");
function ak(e, t) {
  return t.effectStrategy === "input" ? Se(e.schema._def, t) : bt();
}
s(ak, "parseEffectsDef");
function sk(e) {
  return {
    type: "string",
    enum: Array.from(e.values)
  };
}
s(sk, "parseEnumDef");
var lk = /* @__PURE__ */ s((e) => "type" in e && e.type === "string" ? !1 : "allOf" in e, "isJsonSchema7AllOfType");
function uk(e, t) {
  let n = [
    Se(e.left._def, {
      ...t,
      currentPath: [...t.currentPath, "allOf", "0"]
    }),
    Se(e.right._def, {
      ...t,
      currentPath: [...t.currentPath, "allOf", "1"]
    })
  ].filter((r) => !!r), o = [];
  return n.forEach((r) => {
    if (lk(r))
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
s(uk, "parseIntersectionDef");
function ck(e) {
  let t = typeof e.value;
  return t !== "bigint" && t !== "number" && t !== "boolean" && t !== "string" ? {
    type: Array.isArray(e.value) ? "array" : "object"
  } : {
    type: t === "bigint" ? "integer" : t,
    const: e.value
  };
}
s(ck, "parseLiteralDef");
var wm = void 0, At = {
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
  emoji: /* @__PURE__ */ s(() => (wm === void 0 && (wm = RegExp(
    "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",
    "u"
  )), wm), "emoji"),
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
function zv(e, t) {
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
              Rt(n, "email", o.message, t);
              break;
            case "format:idn-email":
              Rt(n, "idn-email", o.message, t);
              break;
            case "pattern:zod":
              rt(n, At.email, o.message, t);
              break;
          }
          break;
        case "url":
          Rt(n, "uri", o.message, t);
          break;
        case "uuid":
          Rt(n, "uuid", o.message, t);
          break;
        case "regex":
          rt(n, o.regex, o.message, t);
          break;
        case "cuid":
          rt(n, At.cuid, o.message, t);
          break;
        case "cuid2":
          rt(n, At.cuid2, o.message, t);
          break;
        case "startsWith":
          rt(
            n,
            RegExp(`^${km(o.value, t)}`),
            o.message,
            t
          );
          break;
        case "endsWith":
          rt(
            n,
            RegExp(`${km(o.value, t)}$`),
            o.message,
            t
          );
          break;
        case "datetime":
          Rt(n, "date-time", o.message, t);
          break;
        case "date":
          Rt(n, "date", o.message, t);
          break;
        case "time":
          Rt(n, "time", o.message, t);
          break;
        case "duration":
          Rt(n, "duration", o.message, t);
          break;
        case "length":
          n.minLength = typeof n.minLength == "number" ? Math.max(n.minLength, o.value) : o.value, n.maxLength = typeof n.maxLength == "number" ? Math.min(n.maxLength, o.value) : o.value;
          break;
        case "includes": {
          rt(
            n,
            RegExp(km(o.value, t)),
            o.message,
            t
          );
          break;
        }
        case "ip": {
          o.version !== "v6" && Rt(n, "ipv4", o.message, t), o.version !== "v4" && Rt(n, "ipv6", o.message, t);
          break;
        }
        case "base64url":
          rt(n, At.base64url, o.message, t);
          break;
        case "jwt":
          rt(n, At.jwt, o.message, t);
          break;
        case "cidr": {
          o.version !== "v6" && rt(n, At.ipv4Cidr, o.message, t), o.version !== "v4" && rt(n, At.ipv6Cidr, o.message, t);
          break;
        }
        case "emoji":
          rt(n, At.emoji(), o.message, t);
          break;
        case "ulid": {
          rt(n, At.ulid, o.message, t);
          break;
        }
        case "base64": {
          switch (t.base64Strategy) {
            case "format:binary": {
              Rt(n, "binary", o.message, t);
              break;
            }
            case "contentEncoding:base64": {
              n.contentEncoding = "base64";
              break;
            }
            case "pattern:zod": {
              rt(n, At.base64, o.message, t);
              break;
            }
          }
          break;
        }
        case "nanoid":
          rt(n, At.nanoid, o.message, t);
        case "toLowerCase":
        case "toUpperCase":
        case "trim":
          break;
        default:
      }
  return n;
}
s(zv, "parseStringDef");
function km(e, t) {
  return t.patternStrategy === "escape" ? pk(e) : e;
}
s(km, "escapeLiteralCheckValue");
var dk = new Set(
  "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789"
);
function pk(e) {
  let t = "";
  for (let n = 0; n < e.length; n++)
    dk.has(e[n]) || (t += "\\"), t += e[n];
  return t;
}
s(pk, "escapeNonAlphaNumeric");
function Rt(e, t, n, o) {
  var r;
  e.format || (r = e.anyOf) != null && r.some((i) => i.format) ? (e.anyOf || (e.anyOf = []), e.format && (e.anyOf.push({
    format: e.format
  }), delete e.format), e.anyOf.push({
    format: t,
    ...n && o.errorMessages && { errorMessage: { format: n } }
  })) : e.format = t;
}
s(Rt, "addFormat");
function rt(e, t, n, o) {
  var r;
  e.pattern || (r = e.allOf) != null && r.some((i) => i.pattern) ? (e.allOf || (e.allOf = []), e.pattern && (e.allOf.push({
    pattern: e.pattern
  }), delete e.pattern), e.allOf.push({
    pattern: vv(t, o),
    ...n && o.errorMessages && { errorMessage: { pattern: n } }
  })) : e.pattern = vv(t, o);
}
s(rt, "addPattern");
function vv(e, t) {
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
s(vv, "stringifyRegExpWithFlags");
function Ev(e, t) {
  var n, o, r, i, a, u;
  let c = {
    type: "object",
    additionalProperties: (n = Se(e.valueType._def, {
      ...t,
      currentPath: [...t.currentPath, "additionalProperties"]
    })) != null ? n : t.allowedAdditionalProperties
  };
  if (((o = e.keyType) == null ? void 0 : o._def.typeName) === P.ZodString && ((r = e.keyType._def.checks) != null && r.length)) {
    let { type: d, ...p } = zv(e.keyType._def, t);
    return {
      ...c,
      propertyNames: p
    };
  } else {
    if (((i = e.keyType) == null ? void 0 : i._def.typeName) === P.ZodEnum)
      return {
        ...c,
        propertyNames: {
          enum: e.keyType._def.values
        }
      };
    if (((a = e.keyType) == null ? void 0 : a._def.typeName) === P.ZodBranded && e.keyType._def.type._def.typeName === P.ZodString && ((u = e.keyType._def.type._def.checks) != null && u.length)) {
      let { type: d, ...p } = Sv(
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
s(Ev, "parseRecordDef");
function mk(e, t) {
  if (t.mapStrategy === "record")
    return Ev(e, t);
  let n = Se(e.keyType._def, {
    ...t,
    currentPath: [...t.currentPath, "items", "items", "0"]
  }) || bt(), o = Se(e.valueType._def, {
    ...t,
    currentPath: [...t.currentPath, "items", "items", "1"]
  }) || bt();
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
s(mk, "parseMapDef");
function fk(e) {
  let t = e.values, o = Object.keys(e.values).filter((i) => typeof t[t[i]] != "number").map((i) => t[i]), r = Array.from(
    new Set(o.map((i) => typeof i))
  );
  return {
    type: r.length === 1 ? r[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: o
  };
}
s(fk, "parseNativeEnumDef");
function gk() {
  return { not: bt() };
}
s(gk, "parseNeverDef");
function hk() {
  return {
    type: "null"
  };
}
s(hk, "parseNullDef");
var Im = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null"
};
function vk(e, t) {
  let n = e.options instanceof Map ? Array.from(e.options.values()) : e.options;
  if (n.every(
    (o) => o._def.typeName in Im && (!o._def.checks || !o._def.checks.length)
  )) {
    let o = n.reduce((r, i) => {
      let a = Im[i._def.typeName];
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
  return yk(e, t);
}
s(vk, "parseUnionDef");
var yk = /* @__PURE__ */ s((e, t) => {
  let n = (e.options instanceof Map ? Array.from(e.options.values()) : e.options).map(
    (o, r) => Se(o._def, {
      ...t,
      currentPath: [...t.currentPath, "anyOf", `${r}`]
    })
  ).filter(
    (o) => !!o && (!t.strictUnions || typeof o == "object" && Object.keys(o).length > 0)
  );
  return n.length ? { anyOf: n } : void 0;
}, "asAnyOf");
function _k(e, t) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(
    e.innerType._def.typeName
  ) && (!e.innerType._def.checks || !e.innerType._def.checks.length))
    return {
      type: [
        Im[e.innerType._def.typeName],
        "null"
      ]
    };
  let n = Se(e.innerType._def, {
    ...t,
    currentPath: [...t.currentPath, "anyOf", "0"]
  });
  return n && { anyOf: [n, { type: "null" }] };
}
s(_k, "parseNullableDef");
function bk(e) {
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
s(bk, "parseNumberDef");
function xk(e, t) {
  let n = {
    type: "object",
    properties: {}
  }, o = [], r = e.shape();
  for (let a in r) {
    let u = r[a];
    if (u === void 0 || u._def === void 0)
      continue;
    let c = wk(u), d = Se(u._def, {
      ...t,
      currentPath: [...t.currentPath, "properties", a],
      propertyPath: [...t.currentPath, "properties", a]
    });
    d !== void 0 && (n.properties[a] = d, c || o.push(a));
  }
  o.length && (n.required = o);
  let i = $k(e, t);
  return i !== void 0 && (n.additionalProperties = i), n;
}
s(xk, "parseObjectDef");
function $k(e, t) {
  if (e.catchall._def.typeName !== "ZodNever")
    return Se(e.catchall._def, {
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
s($k, "decideAdditionalProperties");
function wk(e) {
  try {
    return e.isOptional();
  } catch {
    return !0;
  }
}
s(wk, "safeIsOptional");
var kk = /* @__PURE__ */ s((e, t) => {
  var n;
  if (t.currentPath.toString() === ((n = t.propertyPath) == null ? void 0 : n.toString()))
    return Se(e.innerType._def, t);
  let o = Se(e.innerType._def, {
    ...t,
    currentPath: [...t.currentPath, "anyOf", "1"]
  });
  return o ? { anyOf: [{ not: bt() }, o] } : bt();
}, "parseOptionalDef"), Ik = /* @__PURE__ */ s((e, t) => {
  if (t.pipeStrategy === "input")
    return Se(e.in._def, t);
  if (t.pipeStrategy === "output")
    return Se(e.out._def, t);
  let n = Se(e.in._def, {
    ...t,
    currentPath: [...t.currentPath, "allOf", "0"]
  }), o = Se(e.out._def, {
    ...t,
    currentPath: [...t.currentPath, "allOf", n ? "1" : "0"]
  });
  return {
    allOf: [n, o].filter((r) => r !== void 0)
  };
}, "parsePipelineDef");
function Sk(e, t) {
  return Se(e.type._def, t);
}
s(Sk, "parsePromiseDef");
function Tk(e, t) {
  let o = {
    type: "array",
    uniqueItems: !0,
    items: Se(e.valueType._def, {
      ...t,
      currentPath: [...t.currentPath, "items"]
    })
  };
  return e.minSize && (o.minItems = e.minSize.value), e.maxSize && (o.maxItems = e.maxSize.value), o;
}
s(Tk, "parseSetDef");
function zk(e, t) {
  return e.rest ? {
    type: "array",
    minItems: e.items.length,
    items: e.items.map(
      (n, o) => Se(n._def, {
        ...t,
        currentPath: [...t.currentPath, "items", `${o}`]
      })
    ).reduce(
      (n, o) => o === void 0 ? n : [...n, o],
      []
    ),
    additionalItems: Se(e.rest._def, {
      ...t,
      currentPath: [...t.currentPath, "additionalItems"]
    })
  } : {
    type: "array",
    minItems: e.items.length,
    maxItems: e.items.length,
    items: e.items.map(
      (n, o) => Se(n._def, {
        ...t,
        currentPath: [...t.currentPath, "items", `${o}`]
      })
    ).reduce(
      (n, o) => o === void 0 ? n : [...n, o],
      []
    )
  };
}
s(zk, "parseTupleDef");
function Ek() {
  return {
    not: bt()
  };
}
s(Ek, "parseUndefinedDef");
function Ok() {
  return bt();
}
s(Ok, "parseUnknownDef");
var jk = /* @__PURE__ */ s((e, t) => Se(e.innerType._def, t), "parseReadonlyDef"), Pk = /* @__PURE__ */ s((e, t, n) => {
  switch (t) {
    case P.ZodString:
      return zv(e, n);
    case P.ZodNumber:
      return bk(e);
    case P.ZodObject:
      return xk(e, n);
    case P.ZodBigInt:
      return tk(e);
    case P.ZodBoolean:
      return rk();
    case P.ZodDate:
      return Tv(e, n);
    case P.ZodUndefined:
      return Ek();
    case P.ZodNull:
      return hk();
    case P.ZodArray:
      return ek(e, n);
    case P.ZodUnion:
    case P.ZodDiscriminatedUnion:
      return vk(e, n);
    case P.ZodIntersection:
      return uk(e, n);
    case P.ZodTuple:
      return zk(e, n);
    case P.ZodRecord:
      return Ev(e, n);
    case P.ZodLiteral:
      return ck(e);
    case P.ZodEnum:
      return sk(e);
    case P.ZodNativeEnum:
      return fk(e);
    case P.ZodNullable:
      return _k(e, n);
    case P.ZodOptional:
      return kk(e, n);
    case P.ZodMap:
      return mk(e, n);
    case P.ZodSet:
      return Tk(e, n);
    case P.ZodLazy:
      return () => e.getter()._def;
    case P.ZodPromise:
      return Sk(e, n);
    case P.ZodNaN:
    case P.ZodNever:
      return gk();
    case P.ZodEffects:
      return ak(e, n);
    case P.ZodAny:
      return bt();
    case P.ZodUnknown:
      return Ok();
    case P.ZodDefault:
      return ik(e, n);
    case P.ZodBranded:
      return Sv(e, n);
    case P.ZodReadonly:
      return jk(e, n);
    case P.ZodCatch:
      return nk(e, n);
    case P.ZodPipeline:
      return Ik(e, n);
    case P.ZodFunction:
    case P.ZodVoid:
    case P.ZodSymbol:
      return;
    default:
      return /* @__PURE__ */ ((o) => {
      })(t);
  }
}, "selectParser");
function Se(e, t, n = !1) {
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
    if (c !== Yw)
      return c;
  }
  if (r && !n) {
    let c = Nk(r, t);
    if (c !== void 0)
      return c;
  }
  let i = { def: e, path: t.currentPath, jsonSchema: void 0 };
  t.seen.set(e, i);
  let a = Pk(e, e.typeName, t), u = typeof a == "function" ? Se(a(), t) : a;
  if (u && Ak(e, t, u), t.postProcess) {
    let c = t.postProcess(u, e, t);
    return i.jsonSchema = u, c;
  }
  return i.jsonSchema = u, u;
}
s(Se, "parseDef");
var Nk = /* @__PURE__ */ s((e, t) => {
  switch (t.$refStrategy) {
    case "root":
      return { $ref: e.path.join("/") };
    case "relative":
      return { $ref: Xw(t.currentPath, e.path) };
    case "none":
    case "seen":
      return e.path.length < t.currentPath.length && e.path.every((n, o) => t.currentPath[o] === n) ? (console.warn(
        `Recursive reference detected at ${t.currentPath.join(
          "/"
        )}! Defaulting to any`
      ), bt()) : t.$refStrategy === "seen" ? bt() : void 0;
  }
}, "get$ref"), Ak = /* @__PURE__ */ s((e, t, n) => (e.description && (n.description = e.description), n), "addMeta"), Rk = /* @__PURE__ */ s((e) => {
  let t = Qw(e), n = t.name !== void 0 ? [...t.basePath, t.definitionPath, t.name] : t.basePath;
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
}, "getRefs"), Ck = /* @__PURE__ */ s((e, t) => {
  var n;
  let o = Rk(t), r = typeof t == "object" && t.definitions ? Object.entries(t.definitions).reduce(
    (d, [p, f]) => {
      var h;
      return {
        ...d,
        [p]: (h = Se(
          f._def,
          {
            ...o,
            currentPath: [...o.basePath, o.definitionPath, p]
          },
          !0
        )) != null ? h : bt()
      };
    },
    {}
  ) : void 0, i = typeof t == "string" ? t : t?.nameStrategy === "title" ? void 0 : t?.name, a = (n = Se(
    e._def,
    i === void 0 ? o : {
      ...o,
      currentPath: [...o.basePath, o.definitionPath, i]
    },
    !1
  )) != null ? n : bt(), u = typeof t == "object" && t.name !== void 0 && t.nameStrategy === "title" ? t.name : void 0;
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
}, "zodToJsonSchema"), Dk = Ck;
function Uk(e, t) {
  var n;
  let o = (n = t?.useReferences) != null ? n : !1;
  return Om(
    // defer json schema creation to avoid unnecessary computation when only validation is needed
    () => Dk(e, {
      $refStrategy: o ? "root" : "none"
    }),
    {
      validate: /* @__PURE__ */ s(async (r) => {
        let i = await e.safeParseAsync(r);
        return i.success ? { success: !0, value: i.data } : { success: !1, error: i.error };
      }, "validate")
    }
  );
}
s(Uk, "zod3Schema");
function Mk(e, t) {
  var n;
  let o = (n = t?.useReferences) != null ? n : !1;
  return Om(
    // defer json schema creation to avoid unnecessary computation when only validation is needed
    () => Qa(
      vn(e, {
        target: "draft-7",
        io: "input",
        reused: o ? "ref" : "inline"
      })
    ),
    {
      validate: /* @__PURE__ */ s(async (r) => {
        let i = await To(e, r);
        return i.success ? { success: !0, value: i.data } : { success: !1, error: i.error };
      }, "validate")
    }
  );
}
s(Mk, "zod4Schema");
function Zk(e) {
  return "_zod" in e;
}
s(Zk, "isZod4Schema");
function Z(e, t) {
  return Zk(e) ? Mk(e, t) : Uk(e, t);
}
s(Z, "zodSchema");
var Sm = Symbol.for("vercel.ai.schema");
function De(e) {
  let t;
  return () => (t == null && (t = e()), t);
}
s(De, "lazySchema");
function Om(e, {
  validate: t
} = {}) {
  return {
    [Sm]: !0,
    _type: void 0,
    // should never be used directly
    [es]: !0,
    get jsonSchema() {
      return typeof e == "function" && (e = e()), e;
    },
    validate: t
  };
}
s(Om, "jsonSchema");
function Lk(e) {
  return typeof e == "object" && e !== null && Sm in e && e[Sm] === !0 && "jsonSchema" in e && "validate" in e;
}
s(Lk, "isSchema");
function Jt(e) {
  return e == null ? Om({
    properties: {},
    additionalProperties: !1
  }) : Lk(e) ? e : typeof e == "function" ? e() : Z(e);
}
s(Jt, "asSchema");
var { btoa: Fk, atob: Vk } = globalThis;
function Ir(e) {
  let t = e.replace(/-/g, "+").replace(/_/g, "/"), n = Vk(t);
  return Uint8Array.from(n, (o) => o.codePointAt(0));
}
s(Ir, "convertBase64ToUint8Array");
function Fn(e) {
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += String.fromCodePoint(e[n]);
  return Fk(t);
}
s(Fn, "convertUint8ArrayToBase64");
function Sr(e) {
  return e instanceof Uint8Array ? Fn(e) : e;
}
s(Sr, "convertToBase64");
function ns(e) {
  return e?.replace(/\/$/, "");
}
s(ns, "withoutTrailingSlash");
function qk(e) {
  return e != null && typeof e[Symbol.asyncIterator] == "function";
}
s(qk, "isAsyncIterable");
async function* os({
  execute: e,
  input: t,
  options: n
}) {
  let o = e(t, n);
  if (qk(o)) {
    let r;
    for await (let i of o)
      r = i, yield { type: "preliminary", output: i };
    yield { type: "final", output: r };
  } else
    yield { type: "final", output: await o };
}
s(os, "executeTool");

// node_modules/@ai-sdk/gateway/dist/index.mjs
var fy = af(Nm(), 1), gy = af(Nm(), 1);
var sI = "vercel.ai.gateway.error", Am = Symbol.for(sI), Cv, Dv, $t = class iy extends (Dv = Error, Cv = Am, Dv) {
  static {
    s(this, "_GatewayError");
  }
  constructor({
    message: t,
    statusCode: n = 500,
    cause: o
  }) {
    super(t), this[Cv] = !0, this.statusCode = n, this.cause = o;
  }
  /**
   * Checks if the given error is a Gateway Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is a Gateway Error, false otherwise.
   */
  static isInstance(t) {
    return iy.hasMarker(t);
  }
  static hasMarker(t) {
    return typeof t == "object" && t !== null && Am in t && t[Am] === !0;
  }
}, ay = "GatewayAuthenticationError", lI = `vercel.ai.gateway.error.${ay}`, Uv = Symbol.for(lI), Mv, Zv, is = class sy extends (Zv = $t, Mv = Uv, Zv) {
  static {
    s(this, "_GatewayAuthenticationError");
  }
  constructor({
    message: t = "Authentication failed",
    statusCode: n = 401,
    cause: o
  } = {}) {
    super({ message: t, statusCode: n, cause: o }), this[Mv] = !0, this.name = ay, this.type = "authentication_error";
  }
  static isInstance(t) {
    return $t.hasMarker(t) && Uv in t;
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
Run 'npx vercel link' to link your project, then 'vc env pull' to fetch the token.`, new sy({
      message: a,
      statusCode: r,
      cause: i
    });
  }
}, ly = "GatewayInvalidRequestError", uI = `vercel.ai.gateway.error.${ly}`, Lv = Symbol.for(uI), Fv, Vv, cI = class extends (Vv = $t, Fv = Lv, Vv) {
  static {
    s(this, "GatewayInvalidRequestError");
  }
  constructor({
    message: e = "Invalid request",
    statusCode: t = 400,
    cause: n
  } = {}) {
    super({ message: e, statusCode: t, cause: n }), this[Fv] = !0, this.name = ly, this.type = "invalid_request_error";
  }
  static isInstance(e) {
    return $t.hasMarker(e) && Lv in e;
  }
}, uy = "GatewayRateLimitError", dI = `vercel.ai.gateway.error.${uy}`, qv = Symbol.for(dI), Jv, Bv, pI = class extends (Bv = $t, Jv = qv, Bv) {
  static {
    s(this, "GatewayRateLimitError");
  }
  constructor({
    message: e = "Rate limit exceeded",
    statusCode: t = 429,
    cause: n
  } = {}) {
    super({ message: e, statusCode: t, cause: n }), this[Jv] = !0, this.name = uy, this.type = "rate_limit_exceeded";
  }
  static isInstance(e) {
    return $t.hasMarker(e) && qv in e;
  }
}, cy = "GatewayModelNotFoundError", mI = `vercel.ai.gateway.error.${cy}`, Gv = Symbol.for(mI), fI = ie(
  () => Z(
    l.object({
      modelId: l.string()
    })
  )
), Wv, Kv, gI = class extends (Kv = $t, Wv = Gv, Kv) {
  static {
    s(this, "GatewayModelNotFoundError");
  }
  constructor({
    message: e = "Model not found",
    statusCode: t = 404,
    modelId: n,
    cause: o
  } = {}) {
    super({ message: e, statusCode: t, cause: o }), this[Wv] = !0, this.name = cy, this.type = "model_not_found", this.modelId = n;
  }
  static isInstance(e) {
    return $t.hasMarker(e) && Gv in e;
  }
}, dy = "GatewayInternalServerError", hI = `vercel.ai.gateway.error.${dy}`, Hv = Symbol.for(hI), Xv, Yv, Qv = class extends (Yv = $t, Xv = Hv, Yv) {
  static {
    s(this, "GatewayInternalServerError");
  }
  constructor({
    message: e = "Internal server error",
    statusCode: t = 500,
    cause: n
  } = {}) {
    super({ message: e, statusCode: t, cause: n }), this[Xv] = !0, this.name = dy, this.type = "internal_server_error";
  }
  static isInstance(e) {
    return $t.hasMarker(e) && Hv in e;
  }
}, py = "GatewayResponseError", vI = `vercel.ai.gateway.error.${py}`, ey = Symbol.for(vI), ty, ry, yI = class extends (ry = $t, ty = ey, ry) {
  static {
    s(this, "GatewayResponseError");
  }
  constructor({
    message: e = "Invalid response from Gateway",
    statusCode: t = 502,
    response: n,
    validationError: o,
    cause: r
  } = {}) {
    super({ message: e, statusCode: t, cause: r }), this[ty] = !0, this.name = py, this.type = "response_error", this.response = n, this.validationError = o;
  }
  static isInstance(e) {
    return $t.hasMarker(e) && ey in e;
  }
};
async function ny({
  response: e,
  statusCode: t,
  defaultMessage: n = "Gateway request failed",
  cause: o,
  authMethod: r
}) {
  let i = await qe({
    value: e,
    schema: _I
  });
  if (!i.success)
    return new yI({
      message: `Invalid error response format: ${n}`,
      statusCode: t,
      response: e,
      validationError: i.error,
      cause: o
    });
  let a = i.value, u = a.error.type, c = a.error.message;
  switch (u) {
    case "authentication_error":
      return is.createContextualError({
        apiKeyProvided: r === "api-key",
        oidcTokenProvided: r === "oidc",
        statusCode: t,
        cause: o
      });
    case "invalid_request_error":
      return new cI({ message: c, statusCode: t, cause: o });
    case "rate_limit_exceeded":
      return new pI({ message: c, statusCode: t, cause: o });
    case "model_not_found": {
      let d = await qe({
        value: a.error.param,
        schema: fI
      });
      return new gI({
        message: c,
        statusCode: t,
        modelId: d.success ? d.value.modelId : void 0,
        cause: o
      });
    }
    case "internal_server_error":
      return new Qv({ message: c, statusCode: t, cause: o });
    default:
      return new Qv({ message: c, statusCode: t, cause: o });
  }
}
s(ny, "createGatewayErrorFromResponse");
var _I = ie(
  () => Z(
    l.object({
      error: l.object({
        message: l.string(),
        type: l.string().nullish(),
        param: l.unknown().nullish(),
        code: l.union([l.string(), l.number()]).nullish()
      })
    })
  )
);
function Tr(e, t) {
  var n;
  return $t.isInstance(e) ? e : Pe.isInstance(e) ? ny({
    response: bI(e),
    statusCode: (n = e.statusCode) != null ? n : 500,
    defaultMessage: "Gateway request failed",
    cause: e,
    authMethod: t
  }) : ny({
    response: {},
    statusCode: 500,
    defaultMessage: e instanceof Error ? `Gateway request failed: ${e.message}` : "Unknown Gateway error",
    cause: e,
    authMethod: t
  });
}
s(Tr, "asGatewayError");
function bI(e) {
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
s(bI, "extractApiCallResponse");
var my = "ai-gateway-auth-method";
async function Vn(e) {
  let t = await qe({
    value: e[my],
    schema: xI
  });
  return t.success ? t.value : void 0;
}
s(Vn, "parseAuthMethod");
var xI = ie(
  () => Z(l.union([l.literal("api-key"), l.literal("oidc")]))
), oy = class {
  static {
    s(this, "GatewayFetchMetadata");
  }
  constructor(e) {
    this.config = e;
  }
  async getAvailableModels() {
    try {
      let { value: e } = await Tm({
        url: `${this.config.baseURL}/config`,
        headers: await pt(this.config.headers()),
        successfulResponseHandler: Me(
          $I
        ),
        failedResponseHandler: zt({
          errorSchema: l.any(),
          errorToMessage: /* @__PURE__ */ s((t) => t, "errorToMessage")
        }),
        fetch: this.config.fetch
      });
      return e;
    } catch (e) {
      throw await Tr(e);
    }
  }
  async getCredits() {
    try {
      let e = new URL(this.config.baseURL), { value: t } = await Tm({
        url: `${e.origin}/v1/credits`,
        headers: await pt(this.config.headers()),
        successfulResponseHandler: Me(
          wI
        ),
        failedResponseHandler: zt({
          errorSchema: l.any(),
          errorToMessage: /* @__PURE__ */ s((n) => n, "errorToMessage")
        }),
        fetch: this.config.fetch
      });
      return t;
    } catch (e) {
      throw await Tr(e);
    }
  }
}, $I = ie(
  () => Z(
    l.object({
      models: l.array(
        l.object({
          id: l.string(),
          name: l.string(),
          description: l.string().nullish(),
          pricing: l.object({
            input: l.string(),
            output: l.string(),
            input_cache_read: l.string().nullish(),
            input_cache_write: l.string().nullish()
          }).transform(
            ({ input: e, output: t, input_cache_read: n, input_cache_write: o }) => ({
              input: e,
              output: t,
              ...n ? { cachedInputTokens: n } : {},
              ...o ? { cacheCreationInputTokens: o } : {}
            })
          ).nullish(),
          specification: l.object({
            specificationVersion: l.literal("v2"),
            provider: l.string(),
            modelId: l.string()
          }),
          modelType: l.enum(["language", "embedding", "image"]).nullish()
        })
      )
    })
  )
), wI = ie(
  () => Z(
    l.object({
      balance: l.string(),
      total_used: l.string()
    }).transform(({ balance: e, total_used: t }) => ({
      balance: e,
      totalUsed: t
    }))
  )
), kI = class {
  static {
    s(this, "GatewayLanguageModel");
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
    let { args: t, warnings: n } = await this.getArgs(e), { abortSignal: o } = e, r = await pt(this.config.headers());
    try {
      let {
        responseHeaders: i,
        value: a,
        rawValue: u
      } = await Ce({
        url: this.getUrl(),
        headers: Ne(
          r,
          e.headers,
          this.getModelConfigHeaders(this.modelId, !1),
          await pt(this.config.o11yHeaders)
        ),
        body: t,
        successfulResponseHandler: Me(l.any()),
        failedResponseHandler: zt({
          errorSchema: l.any(),
          errorToMessage: /* @__PURE__ */ s((c) => c, "errorToMessage")
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
      throw await Tr(i, await Vn(r));
    }
  }
  async doStream(e) {
    let { args: t, warnings: n } = await this.getArgs(e), { abortSignal: o } = e, r = await pt(this.config.headers());
    try {
      let { value: i, responseHeaders: a } = await Ce({
        url: this.getUrl(),
        headers: Ne(
          r,
          e.headers,
          this.getModelConfigHeaders(this.modelId, !0),
          await pt(this.config.o11yHeaders)
        ),
        body: t,
        successfulResponseHandler: kr(l.any()),
        failedResponseHandler: zt({
          errorSchema: l.any(),
          errorToMessage: /* @__PURE__ */ s((u) => u, "errorToMessage")
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
      throw await Tr(i, await Vn(r));
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
}, II = class {
  static {
    s(this, "GatewayEmbeddingModel");
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
    let i = await pt(this.config.headers());
    try {
      let {
        responseHeaders: a,
        value: u,
        rawValue: c
      } = await Ce({
        url: this.getUrl(),
        headers: Ne(
          i,
          t ?? {},
          this.getModelConfigHeaders(),
          await pt(this.config.o11yHeaders)
        ),
        body: {
          input: e.length === 1 ? e[0] : e,
          ...o ? { providerOptions: o } : {}
        },
        successfulResponseHandler: Me(
          SI
        ),
        failedResponseHandler: zt({
          errorSchema: l.any(),
          errorToMessage: /* @__PURE__ */ s((d) => d, "errorToMessage")
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
      throw await Tr(a, await Vn(i));
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
}, SI = ie(
  () => Z(
    l.object({
      embeddings: l.array(l.array(l.number())),
      usage: l.object({ tokens: l.number() }).nullish(),
      providerMetadata: l.record(l.string(), l.record(l.string(), l.unknown())).optional()
    })
  )
), TI = class {
  static {
    s(this, "GatewayImageModel");
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
    let d = await pt(this.config.headers());
    try {
      let {
        responseHeaders: p,
        value: f,
        rawValue: h
      } = await Ce({
        url: this.getUrl(),
        headers: Ne(
          d,
          a ?? {},
          this.getModelConfigHeaders(),
          await pt(this.config.o11yHeaders)
        ),
        body: {
          prompt: e,
          n: t,
          ...n && { size: n },
          ...o && { aspectRatio: o },
          ...r && { seed: r },
          ...i && { providerOptions: i }
        },
        successfulResponseHandler: Me(
          EI
        ),
        failedResponseHandler: zt({
          errorSchema: l.any(),
          errorToMessage: /* @__PURE__ */ s((m) => m, "errorToMessage")
        }),
        ...u && { abortSignal: u },
        fetch: this.config.fetch
      });
      return {
        images: f.images,
        // Always base64 strings from server
        warnings: (c = f.warnings) != null ? c : [],
        providerMetadata: f.providerMetadata,
        response: {
          timestamp: /* @__PURE__ */ new Date(),
          modelId: this.modelId,
          headers: p
        }
      };
    } catch (p) {
      throw Tr(p, await Vn(d));
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
}, zI = l.object({
  images: l.array(l.unknown()).optional()
}).catchall(l.unknown()), EI = l.object({
  images: l.array(l.string()),
  // Always base64 strings over the wire
  warnings: l.array(
    l.object({
      type: l.literal("other"),
      message: l.string()
    })
  ).optional(),
  providerMetadata: l.record(l.string(), zI).optional()
});
async function OI() {
  var e;
  return (e = (0, fy.getContext)().headers) == null ? void 0 : e["x-vercel-id"];
}
s(OI, "getVercelRequestId");
var jI = "2.0.24", PI = "0.0.1";
function NI(e = {}) {
  var t, n;
  let o = null, r = null, i = (t = e.metadataCacheRefreshMillis) != null ? t : 1e3 * 60 * 5, a = 0, u = (n = ns(e.baseURL)) != null ? n : "https://ai-gateway.vercel.sh/v1/ai", c = /* @__PURE__ */ s(async () => {
    let v = await AI(e);
    if (v)
      return He(
        {
          Authorization: `Bearer ${v.token}`,
          "ai-gateway-protocol-version": PI,
          [my]: v.authMethod,
          ...e.headers
        },
        `ai-sdk/gateway/${jI}`
      );
    throw is.createContextualError({
      apiKeyProvided: !1,
      oidcTokenProvided: !1,
      statusCode: 401
    });
  }, "getHeaders"), d = /* @__PURE__ */ s(() => {
    let v = Lr({
      settingValue: void 0,
      environmentVariableName: "VERCEL_DEPLOYMENT_ID"
    }), b = Lr({
      settingValue: void 0,
      environmentVariableName: "VERCEL_ENV"
    }), $ = Lr({
      settingValue: void 0,
      environmentVariableName: "VERCEL_REGION"
    });
    return async () => {
      let w = await OI();
      return {
        ...v && { "ai-o11y-deployment-id": v },
        ...b && { "ai-o11y-environment": b },
        ...$ && { "ai-o11y-region": $ },
        ...w && { "ai-o11y-request-id": w }
      };
    };
  }, "createO11yHeaders"), p = /* @__PURE__ */ s((v) => new kI(v, {
    provider: "gateway",
    baseURL: u,
    headers: c,
    fetch: e.fetch,
    o11yHeaders: d()
  }), "createLanguageModel"), f = /* @__PURE__ */ s(async () => {
    var v, b, $;
    let w = ($ = (b = (v = e._internal) == null ? void 0 : v.currentDate) == null ? void 0 : b.call(v).getTime()) != null ? $ : Date.now();
    return (!o || w - a > i) && (a = w, o = new oy({
      baseURL: u,
      headers: c,
      fetch: e.fetch
    }).getAvailableModels().then((I) => (r = I, I)).catch(async (I) => {
      throw await Tr(
        I,
        await Vn(await c())
      );
    })), r ? Promise.resolve(r) : o;
  }, "getAvailableModels"), h = /* @__PURE__ */ s(async () => new oy({
    baseURL: u,
    headers: c,
    fetch: e.fetch
  }).getCredits().catch(async (v) => {
    throw await Tr(
      v,
      await Vn(await c())
    );
  }), "getCredits"), m = /* @__PURE__ */ s(function(v) {
    if (new.target)
      throw new Error(
        "The Gateway Provider model function cannot be called with the new keyword."
      );
    return p(v);
  }, "provider");
  return m.getAvailableModels = f, m.getCredits = h, m.imageModel = (v) => new TI(v, {
    provider: "gateway",
    baseURL: u,
    headers: c,
    fetch: e.fetch,
    o11yHeaders: d()
  }), m.languageModel = p, m.textEmbeddingModel = (v) => new II(v, {
    provider: "gateway",
    baseURL: u,
    headers: c,
    fetch: e.fetch,
    o11yHeaders: d()
  }), m;
}
s(NI, "createGatewayProvider");
var hy = NI();
async function AI(e) {
  let t = Lr({
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
      token: await (0, gy.getVercelOidcToken)(),
      authMethod: "oidc"
    };
  } catch {
    return null;
  }
}
s(AI, "getGatewayAuthToken");

// node_modules/@opentelemetry/api/build/esm/platform/browser/globalThis.js
var vy = typeof globalThis == "object" ? globalThis : typeof self == "object" ? self : typeof window == "object" ? window : typeof global == "object" ? global : {};

// node_modules/@opentelemetry/api/build/esm/version.js
var lr = "1.9.0";

// node_modules/@opentelemetry/api/build/esm/internal/semver.js
var yy = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
function RI(e) {
  var t = /* @__PURE__ */ new Set([e]), n = /* @__PURE__ */ new Set(), o = e.match(yy);
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
    return /* @__PURE__ */ s(function(c) {
      return c === e;
    }, "isExactmatch");
  function i(u) {
    return n.add(u), !1;
  }
  s(i, "_reject");
  function a(u) {
    return t.add(u), !0;
  }
  return s(a, "_accept"), /* @__PURE__ */ s(function(c) {
    if (t.has(c))
      return !0;
    if (n.has(c))
      return !1;
    var d = c.match(yy);
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
s(RI, "_makeCompatibilityCheck");
var _y = RI(lr);

// node_modules/@opentelemetry/api/build/esm/internal/global-utils.js
var CI = lr.split(".")[0], Qo = Symbol.for("opentelemetry.js.api." + CI), ei = vy;
function qn(e, t, n, o) {
  var r;
  o === void 0 && (o = !1);
  var i = ei[Qo] = (r = ei[Qo]) !== null && r !== void 0 ? r : {
    version: lr
  };
  if (!o && i[e]) {
    var a = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + e);
    return n.error(a.stack || a.message), !1;
  }
  if (i.version !== lr) {
    var a = new Error("@opentelemetry/api: Registration of version v" + i.version + " for " + e + " does not match previously registered API v" + lr);
    return n.error(a.stack || a.message), !1;
  }
  return i[e] = t, n.debug("@opentelemetry/api: Registered a global for " + e + " v" + lr + "."), !0;
}
s(qn, "registerGlobal");
function ur(e) {
  var t, n, o = (t = ei[Qo]) === null || t === void 0 ? void 0 : t.version;
  if (!(!o || !_y(o)))
    return (n = ei[Qo]) === null || n === void 0 ? void 0 : n[e];
}
s(ur, "getGlobal");
function Jn(e, t) {
  t.debug("@opentelemetry/api: Unregistering a global for " + e + " v" + lr + ".");
  var n = ei[Qo];
  n && delete n[e];
}
s(Jn, "unregisterGlobal");

// node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js
var DI = function(e, t) {
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
}, UI = function(e, t, n) {
  if (n || arguments.length === 2) for (var o = 0, r = t.length, i; o < r; o++)
    (i || !(o in t)) && (i || (i = Array.prototype.slice.call(t, 0, o)), i[o] = t[o]);
  return e.concat(i || Array.prototype.slice.call(t));
}, by = (
  /** @class */
  (function() {
    function e(t) {
      this._namespace = t.namespace || "DiagComponentLogger";
    }
    return s(e, "DiagComponentLogger"), e.prototype.debug = function() {
      for (var t = [], n = 0; n < arguments.length; n++)
        t[n] = arguments[n];
      return ti("debug", this._namespace, t);
    }, e.prototype.error = function() {
      for (var t = [], n = 0; n < arguments.length; n++)
        t[n] = arguments[n];
      return ti("error", this._namespace, t);
    }, e.prototype.info = function() {
      for (var t = [], n = 0; n < arguments.length; n++)
        t[n] = arguments[n];
      return ti("info", this._namespace, t);
    }, e.prototype.warn = function() {
      for (var t = [], n = 0; n < arguments.length; n++)
        t[n] = arguments[n];
      return ti("warn", this._namespace, t);
    }, e.prototype.verbose = function() {
      for (var t = [], n = 0; n < arguments.length; n++)
        t[n] = arguments[n];
      return ti("verbose", this._namespace, t);
    }, e;
  })()
);
function ti(e, t, n) {
  var o = ur("diag");
  if (o)
    return n.unshift(t), o[e].apply(o, UI([], DI(n), !1));
}
s(ti, "logProxy");

// node_modules/@opentelemetry/api/build/esm/diag/types.js
var it;
(function(e) {
  e[e.NONE = 0] = "NONE", e[e.ERROR = 30] = "ERROR", e[e.WARN = 50] = "WARN", e[e.INFO = 60] = "INFO", e[e.DEBUG = 70] = "DEBUG", e[e.VERBOSE = 80] = "VERBOSE", e[e.ALL = 9999] = "ALL";
})(it || (it = {}));

// node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js
function xy(e, t) {
  e < it.NONE ? e = it.NONE : e > it.ALL && (e = it.ALL), t = t || {};
  function n(o, r) {
    var i = t[o];
    return typeof i == "function" && e >= r ? i.bind(t) : function() {
    };
  }
  return s(n, "_filterFunc"), {
    error: n("error", it.ERROR),
    warn: n("warn", it.WARN),
    info: n("info", it.INFO),
    debug: n("debug", it.DEBUG),
    verbose: n("verbose", it.VERBOSE)
  };
}
s(xy, "createLogLevelDiagLogger");

// node_modules/@opentelemetry/api/build/esm/api/diag.js
var MI = function(e, t) {
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
}, ZI = function(e, t, n) {
  if (n || arguments.length === 2) for (var o = 0, r = t.length, i; o < r; o++)
    (i || !(o in t)) && (i || (i = Array.prototype.slice.call(t, 0, o)), i[o] = t[o]);
  return e.concat(i || Array.prototype.slice.call(t));
}, LI = "diag", Bn = (
  /** @class */
  (function() {
    function e() {
      function t(r) {
        return function() {
          for (var i = [], a = 0; a < arguments.length; a++)
            i[a] = arguments[a];
          var u = ur("diag");
          if (u)
            return u[r].apply(u, ZI([], MI(i), !1));
        };
      }
      s(t, "_logProxy");
      var n = this, o = /* @__PURE__ */ s(function(r, i) {
        var a, u, c;
        if (i === void 0 && (i = { logLevel: it.INFO }), r === n) {
          var d = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
          return n.error((a = d.stack) !== null && a !== void 0 ? a : d.message), !1;
        }
        typeof i == "number" && (i = {
          logLevel: i
        });
        var p = ur("diag"), f = xy((u = i.logLevel) !== null && u !== void 0 ? u : it.INFO, r);
        if (p && !i.suppressOverrideMessage) {
          var h = (c = new Error().stack) !== null && c !== void 0 ? c : "<failed to generate stacktrace>";
          p.warn("Current logger will be overwritten from " + h), f.warn("Current logger will overwrite one already registered from " + h);
        }
        return qn("diag", f, n, !0);
      }, "setLogger");
      n.setLogger = o, n.disable = function() {
        Jn(LI, n);
      }, n.createComponentLogger = function(r) {
        return new by(r);
      }, n.verbose = t("verbose"), n.debug = t("debug"), n.info = t("info"), n.warn = t("warn"), n.error = t("error");
    }
    return s(e, "DiagAPI"), e.instance = function() {
      return this._instance || (this._instance = new e()), this._instance;
    }, e;
  })()
);

// node_modules/@opentelemetry/api/build/esm/context/context.js
function $y(e) {
  return Symbol.for(e);
}
s($y, "createContextKey");
var FI = (
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
    return s(e, "BaseContext"), e;
  })()
), wy = new FI();

// node_modules/@opentelemetry/api/build/esm/context/NoopContextManager.js
var VI = function(e, t) {
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
}, qI = function(e, t, n) {
  if (n || arguments.length === 2) for (var o = 0, r = t.length, i; o < r; o++)
    (i || !(o in t)) && (i || (i = Array.prototype.slice.call(t, 0, o)), i[o] = t[o]);
  return e.concat(i || Array.prototype.slice.call(t));
}, ky = (
  /** @class */
  (function() {
    function e() {
    }
    return s(e, "NoopContextManager"), e.prototype.active = function() {
      return wy;
    }, e.prototype.with = function(t, n, o) {
      for (var r = [], i = 3; i < arguments.length; i++)
        r[i - 3] = arguments[i];
      return n.call.apply(n, qI([o], VI(r), !1));
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
var JI = function(e, t) {
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
}, BI = function(e, t, n) {
  if (n || arguments.length === 2) for (var o = 0, r = t.length, i; o < r; o++)
    (i || !(o in t)) && (i || (i = Array.prototype.slice.call(t, 0, o)), i[o] = t[o]);
  return e.concat(i || Array.prototype.slice.call(t));
}, Rm = "context", GI = new ky(), as = (
  /** @class */
  (function() {
    function e() {
    }
    return s(e, "ContextAPI"), e.getInstance = function() {
      return this._instance || (this._instance = new e()), this._instance;
    }, e.prototype.setGlobalContextManager = function(t) {
      return qn(Rm, t, Bn.instance());
    }, e.prototype.active = function() {
      return this._getContextManager().active();
    }, e.prototype.with = function(t, n, o) {
      for (var r, i = [], a = 3; a < arguments.length; a++)
        i[a - 3] = arguments[a];
      return (r = this._getContextManager()).with.apply(r, BI([t, n, o], JI(i), !1));
    }, e.prototype.bind = function(t, n) {
      return this._getContextManager().bind(t, n);
    }, e.prototype._getContextManager = function() {
      return ur(Rm) || GI;
    }, e.prototype.disable = function() {
      this._getContextManager().disable(), Jn(Rm, Bn.instance());
    }, e;
  })()
);

// node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js
var ss;
(function(e) {
  e[e.NONE = 0] = "NONE", e[e.SAMPLED = 1] = "SAMPLED";
})(ss || (ss = {}));

// node_modules/@opentelemetry/api/build/esm/trace/invalid-span-constants.js
var Cm = "0000000000000000", Dm = "00000000000000000000000000000000", Iy = {
  traceId: Dm,
  spanId: Cm,
  traceFlags: ss.NONE
};

// node_modules/@opentelemetry/api/build/esm/trace/NonRecordingSpan.js
var zr = (
  /** @class */
  (function() {
    function e(t) {
      t === void 0 && (t = Iy), this._spanContext = t;
    }
    return s(e, "NonRecordingSpan"), e.prototype.spanContext = function() {
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
var Um = $y("OpenTelemetry Context Key SPAN");
function ls(e) {
  return e.getValue(Um) || void 0;
}
s(ls, "getSpan");
function Sy() {
  return ls(as.getInstance().active());
}
s(Sy, "getActiveSpan");
function ri(e, t) {
  return e.setValue(Um, t);
}
s(ri, "setSpan");
function Ty(e) {
  return e.deleteValue(Um);
}
s(Ty, "deleteSpan");
function zy(e, t) {
  return ri(e, new zr(t));
}
s(zy, "setSpanContext");
function us(e) {
  var t;
  return (t = ls(e)) === null || t === void 0 ? void 0 : t.spanContext();
}
s(us, "getSpanContext");

// node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js
var WI = /^([0-9a-f]{32})$/i, KI = /^[0-9a-f]{16}$/i;
function HI(e) {
  return WI.test(e) && e !== Dm;
}
s(HI, "isValidTraceId");
function XI(e) {
  return KI.test(e) && e !== Cm;
}
s(XI, "isValidSpanId");
function cs(e) {
  return HI(e.traceId) && XI(e.spanId);
}
s(cs, "isSpanContextValid");
function Ey(e) {
  return new zr(e);
}
s(Ey, "wrapSpanContext");

// node_modules/@opentelemetry/api/build/esm/trace/NoopTracer.js
var Mm = as.getInstance(), ds = (
  /** @class */
  (function() {
    function e() {
    }
    return s(e, "NoopTracer"), e.prototype.startSpan = function(t, n, o) {
      o === void 0 && (o = Mm.active());
      var r = !!n?.root;
      if (r)
        return new zr();
      var i = o && us(o);
      return YI(i) && cs(i) ? new zr(i) : new zr();
    }, e.prototype.startActiveSpan = function(t, n, o, r) {
      var i, a, u;
      if (!(arguments.length < 2)) {
        arguments.length === 2 ? u = n : arguments.length === 3 ? (i = n, u = o) : (i = n, a = o, u = r);
        var c = a ?? Mm.active(), d = this.startSpan(t, i, c), p = ri(c, d);
        return Mm.with(p, u, void 0, d);
      }
    }, e;
  })()
);
function YI(e) {
  return typeof e == "object" && typeof e.spanId == "string" && typeof e.traceId == "string" && typeof e.traceFlags == "number";
}
s(YI, "isSpanContext");

// node_modules/@opentelemetry/api/build/esm/trace/ProxyTracer.js
var QI = new ds(), Oy = (
  /** @class */
  (function() {
    function e(t, n, o, r) {
      this._provider = t, this.name = n, this.version = o, this.options = r;
    }
    return s(e, "ProxyTracer"), e.prototype.startSpan = function(t, n, o) {
      return this._getTracer().startSpan(t, n, o);
    }, e.prototype.startActiveSpan = function(t, n, o, r) {
      var i = this._getTracer();
      return Reflect.apply(i.startActiveSpan, i, arguments);
    }, e.prototype._getTracer = function() {
      if (this._delegate)
        return this._delegate;
      var t = this._provider.getDelegateTracer(this.name, this.version, this.options);
      return t ? (this._delegate = t, this._delegate) : QI;
    }, e;
  })()
);

// node_modules/@opentelemetry/api/build/esm/trace/NoopTracerProvider.js
var jy = (
  /** @class */
  (function() {
    function e() {
    }
    return s(e, "NoopTracerProvider"), e.prototype.getTracer = function(t, n, o) {
      return new ds();
    }, e;
  })()
);

// node_modules/@opentelemetry/api/build/esm/trace/ProxyTracerProvider.js
var eS = new jy(), Zm = (
  /** @class */
  (function() {
    function e() {
    }
    return s(e, "ProxyTracerProvider"), e.prototype.getTracer = function(t, n, o) {
      var r;
      return (r = this.getDelegateTracer(t, n, o)) !== null && r !== void 0 ? r : new Oy(this, t, n, o);
    }, e.prototype.getDelegate = function() {
      var t;
      return (t = this._delegate) !== null && t !== void 0 ? t : eS;
    }, e.prototype.setDelegate = function(t) {
      this._delegate = t;
    }, e.prototype.getDelegateTracer = function(t, n, o) {
      var r;
      return (r = this._delegate) === null || r === void 0 ? void 0 : r.getTracer(t, n, o);
    }, e;
  })()
);

// node_modules/@opentelemetry/api/build/esm/trace/status.js
var Gn;
(function(e) {
  e[e.UNSET = 0] = "UNSET", e[e.OK = 1] = "OK", e[e.ERROR = 2] = "ERROR";
})(Gn || (Gn = {}));

// node_modules/@opentelemetry/api/build/esm/api/trace.js
var Lm = "trace", Py = (
  /** @class */
  (function() {
    function e() {
      this._proxyTracerProvider = new Zm(), this.wrapSpanContext = Ey, this.isSpanContextValid = cs, this.deleteSpan = Ty, this.getSpan = ls, this.getActiveSpan = Sy, this.getSpanContext = us, this.setSpan = ri, this.setSpanContext = zy;
    }
    return s(e, "TraceAPI"), e.getInstance = function() {
      return this._instance || (this._instance = new e()), this._instance;
    }, e.prototype.setGlobalTracerProvider = function(t) {
      var n = qn(Lm, this._proxyTracerProvider, Bn.instance());
      return n && this._proxyTracerProvider.setDelegate(t), n;
    }, e.prototype.getTracerProvider = function() {
      return ur(Lm) || this._proxyTracerProvider;
    }, e.prototype.getTracer = function(t, n) {
      return this.getTracerProvider().getTracer(t, n);
    }, e.prototype.disable = function() {
      Jn(Lm, Bn.instance()), this._proxyTracerProvider = new Zm();
    }, e;
  })()
);

// node_modules/@opentelemetry/api/build/esm/trace-api.js
var Fm = Py.getInstance();

// node_modules/ai/dist/index.mjs
var tS = Object.defineProperty, rS = /* @__PURE__ */ s((e, t) => {
  for (var n in t)
    tS(e, n, { get: t[n], enumerable: !0 });
}, "__export"), Vy = "AI_NoOutputSpecifiedError", qy = `vercel.ai.error.${Vy}`, nS = Symbol.for(qy), Jy, By = class extends V {
  static {
    s(this, "NoOutputSpecifiedError");
  }
  // used in isInstance
  constructor({ message: e = "No output specified." } = {}) {
    super({ name: Vy, message: e }), this[Jy] = !0;
  }
  static isInstance(e) {
    return V.hasMarker(e, qy);
  }
};
Jy = nS;
function oS(e) {
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
s(oS, "formatWarning");
var iS = "AI SDK Warning System: To turn off warning logging, set the AI_SDK_LOG_WARNINGS global to false.", Ny = !1, fs = /* @__PURE__ */ s((e) => {
  if (e.length === 0)
    return;
  let t = globalThis.AI_SDK_LOG_WARNINGS;
  if (t !== !1) {
    if (typeof t == "function") {
      t(e);
      return;
    }
    Ny || (Ny = !0, console.info(iS));
    for (let n of e)
      console.warn(oS(n));
  }
}, "logWarnings"), Gy = "AI_InvalidArgumentError", Wy = `vercel.ai.error.${Gy}`, aS = Symbol.for(Wy), Ky, Ae = class extends V {
  static {
    s(this, "InvalidArgumentError");
  }
  constructor({
    parameter: e,
    value: t,
    message: n
  }) {
    super({
      name: Gy,
      message: `Invalid argument for parameter ${e}: ${n}`
    }), this[Ky] = !0, this.parameter = e, this.value = t;
  }
  static isInstance(e) {
    return V.hasMarker(e, Wy);
  }
};
Ky = aS;
var sS = "AI_InvalidStreamPartError", lS = `vercel.ai.error.${sS}`, uS = Symbol.for(lS), cS;
cS = uS;
var Hy = "AI_InvalidToolInputError", Xy = `vercel.ai.error.${Hy}`, dS = Symbol.for(Xy), Yy, Qy = class extends V {
  static {
    s(this, "InvalidToolInputError");
  }
  constructor({
    toolInput: e,
    toolName: t,
    cause: n,
    message: o = `Invalid input for tool ${t}: ${Vt(n)}`
  }) {
    super({ name: Hy, message: o, cause: n }), this[Yy] = !0, this.toolInput = e, this.toolName = t;
  }
  static isInstance(e) {
    return V.hasMarker(e, Xy);
  }
};
Yy = dS;
var pS = "AI_NoImageGeneratedError", mS = `vercel.ai.error.${pS}`, fS = Symbol.for(mS), gS;
gS = fS;
var e_ = "AI_NoObjectGeneratedError", t_ = `vercel.ai.error.${e_}`, hS = Symbol.for(t_), r_, Fr = class extends V {
  static {
    s(this, "NoObjectGeneratedError");
  }
  constructor({
    message: e = "No object generated.",
    cause: t,
    text: n,
    response: o,
    usage: r,
    finishReason: i
  }) {
    super({ name: e_, message: e, cause: t }), this[r_] = !0, this.text = n, this.response = o, this.usage = r, this.finishReason = i;
  }
  static isInstance(e) {
    return V.hasMarker(e, t_);
  }
};
r_ = hS;
var n_ = "AI_NoOutputGeneratedError", o_ = `vercel.ai.error.${n_}`, vS = Symbol.for(o_), i_, yS = class extends V {
  static {
    s(this, "NoOutputGeneratedError");
  }
  // used in isInstance
  constructor({
    message: e = "No output generated.",
    cause: t
  } = {}) {
    super({ name: n_, message: e, cause: t }), this[i_] = !0;
  }
  static isInstance(e) {
    return V.hasMarker(e, o_);
  }
};
i_ = vS;
var a_ = "AI_NoSuchToolError", s_ = `vercel.ai.error.${a_}`, _S = Symbol.for(s_), l_, Bm = class extends V {
  static {
    s(this, "NoSuchToolError");
  }
  constructor({
    toolName: e,
    availableTools: t = void 0,
    message: n = `Model tried to call unavailable tool '${e}'. ${t === void 0 ? "No tools are available." : `Available tools: ${t.join(", ")}.`}`
  }) {
    super({ name: a_, message: n }), this[l_] = !0, this.toolName = e, this.availableTools = t;
  }
  static isInstance(e) {
    return V.hasMarker(e, s_);
  }
};
l_ = _S;
var u_ = "AI_ToolCallRepairError", c_ = `vercel.ai.error.${u_}`, bS = Symbol.for(c_), d_, xS = class extends V {
  static {
    s(this, "ToolCallRepairError");
  }
  constructor({
    cause: e,
    originalError: t,
    message: n = `Error repairing tool call: ${Vt(e)}`
  }) {
    super({ name: u_, message: n, cause: e }), this[d_] = !0, this.originalError = t;
  }
  static isInstance(e) {
    return V.hasMarker(e, c_);
  }
};
d_ = bS;
var p_ = class extends V {
  static {
    s(this, "UnsupportedModelVersionError");
  }
  constructor(e) {
    super({
      name: "AI_UnsupportedModelVersionError",
      message: `Unsupported model version ${e.version} for provider "${e.provider}" and model "${e.modelId}". AI SDK 5 only supports models that implement specification version "v2".`
    }), this.version = e.version, this.provider = e.provider, this.modelId = e.modelId;
  }
}, $S = "AI_InvalidDataContentError", wS = `vercel.ai.error.${$S}`, kS = Symbol.for(wS), IS;
IS = kS;
var m_ = "AI_InvalidMessageRoleError", f_ = `vercel.ai.error.${m_}`, SS = Symbol.for(f_), g_, TS = class extends V {
  static {
    s(this, "InvalidMessageRoleError");
  }
  constructor({
    role: e,
    message: t = `Invalid message role: '${e}'. Must be one of: "system", "user", "assistant", "tool".`
  }) {
    super({ name: m_, message: t }), this[g_] = !0, this.role = e;
  }
  static isInstance(e) {
    return V.hasMarker(e, f_);
  }
};
g_ = SS;
var zS = "AI_MessageConversionError", ES = `vercel.ai.error.${zS}`, OS = Symbol.for(ES), jS;
jS = OS;
var h_ = "AI_DownloadError", v_ = `vercel.ai.error.${h_}`, PS = Symbol.for(v_), y_, Vm = class extends V {
  static {
    s(this, "DownloadError");
  }
  constructor({
    url: e,
    statusCode: t,
    statusText: n,
    cause: o,
    message: r = o == null ? `Failed to download ${e}: ${t} ${n}` : `Failed to download ${e}: ${o}`
  }) {
    super({ name: h_, message: r, cause: o }), this[y_] = !0, this.url = e, this.statusCode = t, this.statusText = n;
  }
  static isInstance(e) {
    return V.hasMarker(e, v_);
  }
};
y_ = PS;
var __ = "AI_RetryError", b_ = `vercel.ai.error.${__}`, NS = Symbol.for(b_), x_, Ay = class extends V {
  static {
    s(this, "RetryError");
  }
  constructor({
    message: e,
    reason: t,
    errors: n
  }) {
    super({ name: __, message: e }), this[x_] = !0, this.reason = t, this.errors = n, this.lastError = n[n.length - 1];
  }
  static isInstance(e) {
    return V.hasMarker(e, b_);
  }
};
x_ = NS;
function Wn(e) {
  if (typeof e != "string") {
    if (e.specificationVersion !== "v2")
      throw new p_({
        version: e.specificationVersion,
        provider: e.provider,
        modelId: e.modelId
      });
    return e;
  }
  return w_().languageModel(e);
}
s(Wn, "resolveLanguageModel");
function $_(e) {
  if (typeof e != "string") {
    if (e.specificationVersion !== "v2")
      throw new p_({
        version: e.specificationVersion,
        provider: e.provider,
        modelId: e.modelId
      });
    return e;
  }
  return w_().textEmbeddingModel(
    e
  );
}
s($_, "resolveEmbeddingModel");
function w_() {
  var e;
  return (e = globalThis.AI_SDK_DEFAULT_PROVIDER) != null ? e : hy;
}
s(w_, "getGlobalProvider");
var AS = [
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
var RS = /* @__PURE__ */ s((e) => {
  let t = typeof e == "string" ? Ir(e) : e, n = (t[6] & 127) << 21 | (t[7] & 127) << 14 | (t[8] & 127) << 7 | t[9] & 127;
  return t.slice(n + 10);
}, "stripID3");
function CS(e) {
  return typeof e == "string" && e.startsWith("SUQz") || typeof e != "string" && e.length > 10 && e[0] === 73 && // 'I'
  e[1] === 68 && // 'D'
  e[2] === 51 ? RS(e) : e;
}
s(CS, "stripID3TagsIfPresent");
function DS({
  data: e,
  signatures: t
}) {
  let n = CS(e), o = typeof n == "string" ? Ir(
    n.substring(0, Math.min(n.length, 24))
  ) : n;
  for (let r of t)
    if (o.length >= r.bytesPrefix.length && r.bytesPrefix.every(
      (i, a) => i === null || o[a] === i
    ))
      return r.mediaType;
}
s(DS, "detectMediaType");
var ii = "5.0.118", US = /* @__PURE__ */ s(async ({ url: e }) => {
  var t;
  let n = e.toString();
  try {
    let o = await fetch(n, {
      headers: He(
        {},
        `ai-sdk/${ii}`,
        rs()
      )
    });
    if (!o.ok)
      throw new Vm({
        url: n,
        statusCode: o.status,
        statusText: o.statusText
      });
    return {
      data: new Uint8Array(await o.arrayBuffer()),
      mediaType: (t = o.headers.get("content-type")) != null ? t : void 0
    };
  } catch (o) {
    throw Vm.isInstance(o) ? o : new Vm({ url: n, cause: o });
  }
}, "download"), MS = /* @__PURE__ */ s((e = US) => (t) => Promise.all(
  t.map(
    async (n) => n.isUrlSupportedByModel ? null : e(n)
  )
), "createDefaultDownloadFunction");
function ZS(e) {
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
s(ZS, "splitDataUrl");
var k_ = l.union([
  l.string(),
  l.instanceof(Uint8Array),
  l.instanceof(ArrayBuffer),
  l.custom(
    // Buffer might not be available in some environments such as CloudFlare:
    (e) => {
      var t, n;
      return (n = (t = globalThis.Buffer) == null ? void 0 : t.isBuffer(e)) != null ? n : !1;
    },
    { message: "Must be a Buffer" }
  )
]);
function I_(e) {
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
    let { mediaType: t, base64Content: n } = ZS(
      e.toString()
    );
    if (t == null || n == null)
      throw new V({
        name: "InvalidDataContentError",
        message: `Invalid data URL format in content ${e.toString()}`
      });
    return { data: n, mediaType: t };
  }
  return { data: e, mediaType: void 0 };
}
s(I_, "convertToLanguageModelV2DataContent");
function LS(e) {
  return typeof e == "string" ? e : e instanceof ArrayBuffer ? Fn(new Uint8Array(e)) : Fn(e);
}
s(LS, "convertDataContentToBase64String");
async function gs({
  prompt: e,
  supportedUrls: t,
  download: n = MS()
}) {
  let o = await VS(
    e.messages,
    n,
    t
  );
  return [
    ...e.system != null ? [{ role: "system", content: e.system }] : [],
    ...e.messages.map(
      (r) => FS({ message: r, downloadedAssets: o })
    )
  ];
}
s(gs, "convertToLanguageModelPrompt");
function FS({
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
        content: e.content.map((o) => qS(o, t)).filter((o) => o.type !== "text" || o.text !== ""),
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
              let { data: i, mediaType: a } = I_(
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
      throw new TS({ role: o });
    }
  }
}
s(FS, "convertToLanguageModelMessage");
async function VS(e, t, n) {
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
    isUrlSupportedByModel: i.mediaType != null && bv({
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
s(VS, "downloadAssets");
function qS(e, t) {
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
  let { data: i, mediaType: a } = I_(o), u = a ?? e.mediaType, c = i;
  if (c instanceof URL) {
    let d = t[c.toString()];
    d && (c = d.data, u ?? (u = d.mediaType));
  }
  switch (r) {
    case "image":
      return (c instanceof Uint8Array || typeof c == "string") && (u = (n = DS({ data: c, signatures: AS })) != null ? n : u), {
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
s(qS, "convertPartToLanguageModelPart");
function Vr({
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
      throw new Ae({
        parameter: "maxOutputTokens",
        value: e,
        message: "maxOutputTokens must be an integer"
      });
    if (e < 1)
      throw new Ae({
        parameter: "maxOutputTokens",
        value: e,
        message: "maxOutputTokens must be >= 1"
      });
  }
  if (t != null && typeof t != "number")
    throw new Ae({
      parameter: "temperature",
      value: t,
      message: "temperature must be a number"
    });
  if (n != null && typeof n != "number")
    throw new Ae({
      parameter: "topP",
      value: n,
      message: "topP must be a number"
    });
  if (o != null && typeof o != "number")
    throw new Ae({
      parameter: "topK",
      value: o,
      message: "topK must be a number"
    });
  if (r != null && typeof r != "number")
    throw new Ae({
      parameter: "presencePenalty",
      value: r,
      message: "presencePenalty must be a number"
    });
  if (i != null && typeof i != "number")
    throw new Ae({
      parameter: "frequencyPenalty",
      value: i,
      message: "frequencyPenalty must be a number"
    });
  if (a != null && !Number.isInteger(a))
    throw new Ae({
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
s(Vr, "prepareCallSettings");
function JS(e) {
  return e != null && Object.keys(e).length > 0;
}
s(JS, "isNonEmptyObject");
function S_({
  tools: e,
  toolChoice: t,
  activeTools: n
}) {
  return JS(e) ? {
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
            inputSchema: Jt(i.inputSchema).jsonSchema,
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
s(S_, "prepareToolsAndToolChoice");
var oi = l.lazy(
  () => l.union([
    l.null(),
    l.string(),
    l.number(),
    l.boolean(),
    l.record(l.string(), oi),
    l.array(oi)
  ])
), he = l.record(
  l.string(),
  l.record(l.string(), oi)
), T_ = l.object({
  type: l.literal("text"),
  text: l.string(),
  providerOptions: he.optional()
}), BS = l.object({
  type: l.literal("image"),
  image: l.union([k_, l.instanceof(URL)]),
  mediaType: l.string().optional(),
  providerOptions: he.optional()
}), z_ = l.object({
  type: l.literal("file"),
  data: l.union([k_, l.instanceof(URL)]),
  filename: l.string().optional(),
  mediaType: l.string(),
  providerOptions: he.optional()
}), GS = l.object({
  type: l.literal("reasoning"),
  text: l.string(),
  providerOptions: he.optional()
}), WS = l.object({
  type: l.literal("tool-call"),
  toolCallId: l.string(),
  toolName: l.string(),
  input: l.unknown(),
  providerOptions: he.optional(),
  providerExecuted: l.boolean().optional()
}), KS = l.discriminatedUnion("type", [
  l.object({
    type: l.literal("text"),
    value: l.string()
  }),
  l.object({
    type: l.literal("json"),
    value: oi
  }),
  l.object({
    type: l.literal("error-text"),
    value: l.string()
  }),
  l.object({
    type: l.literal("error-json"),
    value: oi
  }),
  l.object({
    type: l.literal("content"),
    value: l.array(
      l.union([
        l.object({
          type: l.literal("text"),
          text: l.string()
        }),
        l.object({
          type: l.literal("media"),
          data: l.string(),
          mediaType: l.string()
        })
      ])
    )
  })
]), E_ = l.object({
  type: l.literal("tool-result"),
  toolCallId: l.string(),
  toolName: l.string(),
  output: KS,
  providerOptions: he.optional()
}), HS = l.object(
  {
    role: l.literal("system"),
    content: l.string(),
    providerOptions: he.optional()
  }
);
var XS = l.object({
  role: l.literal("user"),
  content: l.union([
    l.string(),
    l.array(l.union([T_, BS, z_]))
  ]),
  providerOptions: he.optional()
});
var YS = l.object({
  role: l.literal("assistant"),
  content: l.union([
    l.string(),
    l.array(
      l.union([
        T_,
        z_,
        GS,
        WS,
        E_
      ])
    )
  ]),
  providerOptions: he.optional()
});
var QS = l.object({
  role: l.literal("tool"),
  content: l.array(E_),
  providerOptions: he.optional()
});
var e0 = l.union([
  HS,
  XS,
  YS,
  QS
]);
async function hs(e) {
  if (e.prompt == null && e.messages == null)
    throw new tr({
      prompt: e,
      message: "prompt or messages must be defined"
    });
  if (e.prompt != null && e.messages != null)
    throw new tr({
      prompt: e,
      message: "prompt and messages cannot be defined at the same time"
    });
  if (e.system != null && typeof e.system != "string")
    throw new tr({
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
    throw new tr({
      prompt: e,
      message: "prompt or messages must be defined"
    });
  if (t.length === 0)
    throw new tr({
      prompt: e,
      message: "messages must not be empty"
    });
  let n = await qe({
    value: t,
    schema: l.array(e0)
  });
  if (!n.success)
    throw new tr({
      prompt: e,
      message: "The messages must be a ModelMessage[]. If you have passed a UIMessage[], you can use convertToModelMessages to convert them.",
      cause: n.error
    });
  return {
    messages: t,
    system: e.system
  };
}
s(hs, "standardizePrompt");
function vs(e) {
  if (!is.isInstance(e))
    return e;
  let t = (process == null ? void 0 : "production") === "production", n = "https://v5.ai-sdk.dev/unauthenticated-ai-gateway";
  return t ? new V({
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
s(vs, "wrapGatewayError");
function at({
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
s(at, "assembleOperationName");
function Kn({
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
s(Kn, "getBaseTelemetryAttributes");
var t0 = {
  startSpan() {
    return ps;
  },
  startActiveSpan(e, t, n, o) {
    if (typeof t == "function")
      return t(ps);
    if (typeof n == "function")
      return n(ps);
    if (typeof o == "function")
      return o(ps);
  }
}, ps = {
  spanContext() {
    return r0;
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
}, r0 = {
  traceId: "",
  spanId: "",
  traceFlags: 0
};
function Hn({
  isEnabled: e = !1,
  tracer: t
} = {}) {
  return e ? t || Fm.getTracer("ai") : t0;
}
s(Hn, "getTracer");
function st({
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
        Hm(i, a);
      } finally {
        i.end();
      }
      throw a;
    }
  });
}
s(st, "recordSpan");
function Hm(e, t) {
  t instanceof Error ? (e.recordException({
    name: t.name,
    message: t.message,
    stack: t.stack
  }), e.setStatus({
    code: Gn.ERROR,
    message: t.message
  })) : e.setStatus({ code: Gn.ERROR });
}
s(Hm, "recordErrorOnSpan");
function ke({
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
s(ke, "selectTelemetryAttributes");
function ys(e) {
  return JSON.stringify(
    e.map((t) => ({
      ...t,
      content: typeof t.content == "string" ? t.content : t.content.map(
        (n) => n.type === "file" ? {
          ...n,
          data: n.data instanceof Uint8Array ? LS(n.data) : n.data
        } : n
      )
    }))
  );
}
s(ys, "stringifyForTelemetry");
function O_(e, t) {
  return {
    inputTokens: ni(e.inputTokens, t.inputTokens),
    outputTokens: ni(e.outputTokens, t.outputTokens),
    totalTokens: ni(e.totalTokens, t.totalTokens),
    reasoningTokens: ni(
      e.reasoningTokens,
      t.reasoningTokens
    ),
    cachedInputTokens: ni(
      e.cachedInputTokens,
      t.cachedInputTokens
    )
  };
}
s(O_, "addLanguageModelUsage");
function ni(e, t) {
  return e == null && t == null ? void 0 : (e ?? 0) + (t ?? 0);
}
s(ni, "addTokenCounts");
function Gm(e) {
  return e === void 0 ? [] : Array.isArray(e) ? e : [e];
}
s(Gm, "asArray");
function n0({
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
s(n0, "getRetryDelayInMs");
var o0 = /* @__PURE__ */ s(({
  maxRetries: e = 2,
  initialDelayInMs: t = 2e3,
  backoffFactor: n = 2,
  abortSignal: o
} = {}) => async (r) => j_(r, {
  maxRetries: e,
  delayInMs: t,
  backoffFactor: n,
  abortSignal: o
}), "retryWithExponentialBackoffRespectingRetryHeaders");
async function j_(e, {
  maxRetries: t,
  delayInMs: n,
  backoffFactor: o,
  abortSignal: r
}, i = []) {
  try {
    return await e();
  } catch (a) {
    if (ar(a) || t === 0)
      throw a;
    let u = Ln(a), c = [...i, a], d = c.length;
    if (d > t)
      throw new Ay({
        message: `Failed after ${d} attempts. Last error: ${u}`,
        reason: "maxRetriesExceeded",
        errors: c
      });
    if (a instanceof Error && Pe.isInstance(a) && a.isRetryable === !0 && d <= t)
      return await ts(
        n0({
          error: a,
          exponentialBackoffDelay: n
        }),
        { abortSignal: r }
      ), j_(
        e,
        {
          maxRetries: t,
          delayInMs: o * n,
          backoffFactor: o,
          abortSignal: r
        },
        c
      );
    throw d === 1 ? a : new Ay({
      message: `Failed after ${d} attempts with non-retryable error: '${u}'`,
      reason: "errorNotRetryable",
      errors: c
    });
  }
}
s(j_, "_retryWithExponentialBackoff");
function Xn({
  maxRetries: e,
  abortSignal: t
}) {
  if (e != null) {
    if (!Number.isInteger(e))
      throw new Ae({
        parameter: "maxRetries",
        value: e,
        message: "maxRetries must be an integer"
      });
    if (e < 0)
      throw new Ae({
        parameter: "maxRetries",
        value: e,
        message: "maxRetries must be >= 0"
      });
  }
  let n = e ?? 2;
  return {
    maxRetries: n,
    retry: o0({
      maxRetries: n,
      abortSignal: t
    })
  };
}
s(Xn, "prepareRetries");
function Wm(e) {
  let t = e.filter(
    (n) => n.type === "text"
  );
  if (t.length !== 0)
    return t.map((n) => n.text).join("");
}
s(Wm, "extractTextContent");
var P_ = class {
  static {
    s(this, "DefaultGeneratedFile");
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
    return this.base64Data == null && (this.base64Data = Fn(this.uint8ArrayData)), this.base64Data;
  }
  // lazy conversion with caching to avoid unnecessary conversion overhead:
  get uint8Array() {
    return this.uint8ArrayData == null && (this.uint8ArrayData = Ir(this.base64Data)), this.uint8ArrayData;
  }
}, i0 = class extends P_ {
  static {
    s(this, "DefaultGeneratedFileWithType");
  }
  constructor(e) {
    super(e), this.type = "file";
  }
};
async function N_({
  toolCall: e,
  tools: t,
  repairToolCall: n,
  system: o,
  messages: r
}) {
  try {
    if (t == null)
      throw new Bm({ toolName: e.toolName });
    try {
      return await Ry({ toolCall: e, tools: t });
    } catch (i) {
      if (n == null || !(Bm.isInstance(i) || Qy.isInstance(i)))
        throw i;
      let a = null;
      try {
        a = await n({
          toolCall: e,
          tools: t,
          inputSchema: /* @__PURE__ */ s(({ toolName: u }) => {
            let { inputSchema: c } = t[u];
            return Jt(c).jsonSchema;
          }, "inputSchema"),
          system: o,
          messages: r,
          error: i
        });
      } catch (u) {
        throw new xS({
          cause: u,
          originalError: i
        });
      }
      if (a == null)
        throw i;
      return await Ry({ toolCall: a, tools: t });
    }
  } catch (i) {
    let a = await St({ text: e.input }), u = a.success ? a.value : e.input;
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
s(N_, "parseToolCall");
async function Ry({
  toolCall: e,
  tools: t
}) {
  let n = e.toolName, o = t[n];
  if (o == null)
    throw new Bm({
      toolName: e.toolName,
      availableTools: Object.keys(t)
    });
  let r = Jt(o.inputSchema), i = e.input.trim() === "" ? await qe({ value: {}, schema: r }) : await St({ text: e.input, schema: r });
  if (i.success === !1)
    throw new Qy({
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
s(Ry, "doParseToolCall");
var A_ = class {
  static {
    s(this, "DefaultStepResult");
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
function R_(e) {
  return ({ steps: t }) => t.length === e;
}
s(R_, "stepCountIs");
async function C_({
  stopConditions: e,
  steps: t
}) {
  return (await Promise.all(e.map((n) => n({ steps: t })))).some((n) => n);
}
s(C_, "isStopConditionMet");
function qm({
  output: e,
  tool: t,
  errorMode: n
}) {
  return n === "text" ? { type: "error-text", value: Vt(e) } : n === "json" ? { type: "error-json", value: Cy(e) } : t?.toModelOutput ? t.toModelOutput(e) : typeof e == "string" ? { type: "text", value: e } : { type: "json", value: Cy(e) };
}
s(qm, "createToolModelOutput");
function Cy(e) {
  return e === void 0 ? null : e;
}
s(Cy, "toJSONValue");
function Km({
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
          output: qm({
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
          output: qm({
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
    output: qm({
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
s(Km, "toResponseMessages");
var a0 = sr({
  prefix: "aitxt",
  size: 24
});
async function LR({
  model: e,
  tools: t,
  toolChoice: n,
  system: o,
  prompt: r,
  messages: i,
  maxRetries: a,
  abortSignal: u,
  headers: c,
  stopWhen: d = R_(1),
  experimental_output: p,
  experimental_telemetry: f,
  providerOptions: h,
  experimental_activeTools: m,
  activeTools: v = m,
  experimental_prepareStep: b,
  prepareStep: $ = b,
  experimental_repairToolCall: w,
  experimental_download: I,
  experimental_context: _,
  _internal: {
    generateId: x = a0,
    currentDate: C = /* @__PURE__ */ s(() => /* @__PURE__ */ new Date(), "currentDate")
  } = {},
  onStepFinish: M,
  ...S
}) {
  let T = Wn(e), G = Gm(d), { maxRetries: J, retry: ue } = Xn({
    maxRetries: a,
    abortSignal: u
  }), fe = Vr(S), Q = He(
    c ?? {},
    `ai/${ii}`
  ), te = Kn({
    model: T,
    telemetry: f,
    headers: Q,
    settings: { ...fe, maxRetries: J }
  }), _e = await hs({
    system: o,
    prompt: r,
    messages: i
  }), be = Hn(f);
  try {
    return await st({
      name: "ai.generateText",
      attributes: ke({
        telemetry: f,
        attributes: {
          ...at({
            operationId: "ai.generateText",
            telemetry: f
          }),
          ...te,
          // model:
          "ai.model.provider": T.provider,
          "ai.model.id": T.modelId,
          // specific settings that only make sense on the outer level:
          "ai.prompt": {
            input: /* @__PURE__ */ s(() => JSON.stringify({ system: o, prompt: r, messages: i }), "input")
          }
        }
      }),
      tracer: be,
      fn: /* @__PURE__ */ s(async (re) => {
        var je, xe, ye, ce, ae, ge, ve;
        let Y = Vr(S), g, L = [], B = [], Le = [], $e = [];
        do {
          let Ee = [
            ..._e.messages,
            ...Le
          ], de = await $?.({
            model: T,
            steps: $e,
            stepNumber: $e.length,
            messages: Ee
          }), X = Wn(
            (je = de?.model) != null ? je : T
          ), W = await gs({
            prompt: {
              system: (xe = de?.system) != null ? xe : _e.system,
              messages: (ye = de?.messages) != null ? ye : Ee
            },
            supportedUrls: await X.supportedUrls,
            download: I
          }), { toolChoice: F, tools: Ze } = S_({
            tools: t,
            toolChoice: (ce = de?.toolChoice) != null ? ce : n,
            activeTools: (ae = de?.activeTools) != null ? ae : v
          });
          g = await ue(
            () => {
              var we;
              return st({
                name: "ai.generateText.doGenerate",
                attributes: ke({
                  telemetry: f,
                  attributes: {
                    ...at({
                      operationId: "ai.generateText.doGenerate",
                      telemetry: f
                    }),
                    ...te,
                    // model:
                    "ai.model.provider": X.provider,
                    "ai.model.id": X.modelId,
                    // prompt:
                    "ai.prompt.messages": {
                      input: /* @__PURE__ */ s(() => ys(W), "input")
                    },
                    "ai.prompt.tools": {
                      // convert the language model level tools:
                      input: /* @__PURE__ */ s(() => Ze?.map((Dt) => JSON.stringify(Dt)), "input")
                    },
                    "ai.prompt.toolChoice": {
                      input: /* @__PURE__ */ s(() => F != null ? JSON.stringify(F) : void 0, "input")
                    },
                    // standardized gen-ai llm span attributes:
                    "gen_ai.system": X.provider,
                    "gen_ai.request.model": X.modelId,
                    "gen_ai.request.frequency_penalty": S.frequencyPenalty,
                    "gen_ai.request.max_tokens": S.maxOutputTokens,
                    "gen_ai.request.presence_penalty": S.presencePenalty,
                    "gen_ai.request.stop_sequences": S.stopSequences,
                    "gen_ai.request.temperature": (we = S.temperature) != null ? we : void 0,
                    "gen_ai.request.top_k": S.topK,
                    "gen_ai.request.top_p": S.topP
                  }
                }),
                tracer: be,
                fn: /* @__PURE__ */ s(async (Dt) => {
                  var Yn, cr, gt, Gt, Qn, qr, Jr, si;
                  let Fe = await X.doGenerate({
                    ...Y,
                    tools: Ze,
                    toolChoice: F,
                    responseFormat: p?.responseFormat,
                    prompt: W,
                    providerOptions: h,
                    abortSignal: u,
                    headers: Q
                  }), Wt = {
                    id: (cr = (Yn = Fe.response) == null ? void 0 : Yn.id) != null ? cr : x(),
                    timestamp: (Gt = (gt = Fe.response) == null ? void 0 : gt.timestamp) != null ? Gt : C(),
                    modelId: (qr = (Qn = Fe.response) == null ? void 0 : Qn.modelId) != null ? qr : X.modelId,
                    headers: (Jr = Fe.response) == null ? void 0 : Jr.headers,
                    body: (si = Fe.response) == null ? void 0 : si.body
                  };
                  return Dt.setAttributes(
                    ke({
                      telemetry: f,
                      attributes: {
                        "ai.response.finishReason": Fe.finishReason,
                        "ai.response.text": {
                          output: /* @__PURE__ */ s(() => Wm(Fe.content), "output")
                        },
                        "ai.response.toolCalls": {
                          output: /* @__PURE__ */ s(() => {
                            let Kt = Dy(Fe.content);
                            return Kt == null ? void 0 : JSON.stringify(Kt);
                          }, "output")
                        },
                        "ai.response.id": Wt.id,
                        "ai.response.model": Wt.modelId,
                        "ai.response.timestamp": Wt.timestamp.toISOString(),
                        "ai.response.providerMetadata": JSON.stringify(
                          Fe.providerMetadata
                        ),
                        // TODO rename telemetry attributes to inputTokens and outputTokens
                        "ai.usage.promptTokens": Fe.usage.inputTokens,
                        "ai.usage.completionTokens": Fe.usage.outputTokens,
                        // standardized gen-ai llm span attributes:
                        "gen_ai.response.finish_reasons": [Fe.finishReason],
                        "gen_ai.response.id": Wt.id,
                        "gen_ai.response.model": Wt.modelId,
                        "gen_ai.usage.input_tokens": Fe.usage.inputTokens,
                        "gen_ai.usage.output_tokens": Fe.usage.outputTokens
                      }
                    })
                  ), { ...Fe, response: Wt };
                }, "fn")
              });
            }
          );
          let ft = await Promise.all(
            g.content.filter(
              (we) => we.type === "tool-call"
            ).map(
              (we) => N_({
                toolCall: we,
                tools: t,
                repairToolCall: w,
                system: o,
                messages: Ee
              })
            )
          );
          for (let we of ft) {
            if (we.invalid)
              continue;
            let Dt = t[we.toolName];
            Dt?.onInputAvailable != null && await Dt.onInputAvailable({
              input: we.input,
              toolCallId: we.toolCallId,
              messages: Ee,
              abortSignal: u,
              experimental_context: _
            });
          }
          let U = ft.filter(
            (we) => we.invalid && we.dynamic
          );
          B = [];
          for (let we of U)
            B.push({
              type: "tool-error",
              toolCallId: we.toolCallId,
              toolName: we.toolName,
              input: we.input,
              error: Ln(we.error),
              dynamic: !0
            });
          L = ft.filter(
            (we) => !we.providerExecuted
          ), t != null && B.push(
            ...await s0({
              toolCalls: L.filter(
                (we) => !we.invalid
              ),
              tools: t,
              tracer: be,
              telemetry: f,
              messages: Ee,
              abortSignal: u,
              experimental_context: _
            })
          );
          let pe = u0({
            content: g.content,
            toolCalls: ft,
            toolOutputs: B
          });
          Le.push(
            ...Km({
              content: pe,
              tools: t
            })
          );
          let Ct = new A_({
            content: pe,
            finishReason: g.finishReason,
            usage: g.usage,
            warnings: g.warnings,
            providerMetadata: g.providerMetadata,
            request: (ge = g.request) != null ? ge : {},
            response: {
              ...g.response,
              // deep clone msgs to avoid mutating past messages in multi-step:
              messages: structuredClone(Le)
            }
          });
          fs((ve = g.warnings) != null ? ve : []), $e.push(Ct), await M?.(Ct);
        } while (
          // there are tool calls:
          L.length > 0 && // all current tool calls have outputs (incl. execution errors):
          B.length === L.length && // continue until a stop condition is met:
          !await C_({ stopConditions: G, steps: $e })
        );
        re.setAttributes(
          ke({
            telemetry: f,
            attributes: {
              "ai.response.finishReason": g.finishReason,
              "ai.response.text": {
                output: /* @__PURE__ */ s(() => Wm(g.content), "output")
              },
              "ai.response.toolCalls": {
                output: /* @__PURE__ */ s(() => {
                  let Ee = Dy(g.content);
                  return Ee == null ? void 0 : JSON.stringify(Ee);
                }, "output")
              },
              "ai.response.providerMetadata": JSON.stringify(
                g.providerMetadata
              ),
              // TODO rename telemetry attributes to inputTokens and outputTokens
              "ai.usage.promptTokens": g.usage.inputTokens,
              "ai.usage.completionTokens": g.usage.outputTokens
            }
          })
        );
        let Ue = $e[$e.length - 1], mt;
        return Ue.finishReason === "stop" && (mt = await p?.parseOutput(
          { text: Ue.text },
          {
            response: Ue.response,
            usage: Ue.usage,
            finishReason: Ue.finishReason
          }
        )), new l0({
          steps: $e,
          resolvedOutput: mt
        });
      }, "fn")
    });
  } catch (re) {
    throw vs(re);
  }
}
s(LR, "generateText");
async function s0({
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
      let f = t[d];
      if (f?.execute != null)
        return st({
          name: "ai.toolCall",
          attributes: ke({
            telemetry: o,
            attributes: {
              ...at({
                operationId: "ai.toolCall",
                telemetry: o
              }),
              "ai.toolCall.name": d,
              "ai.toolCall.id": c,
              "ai.toolCall.args": {
                output: /* @__PURE__ */ s(() => JSON.stringify(p), "output")
              }
            }
          }),
          tracer: n,
          fn: /* @__PURE__ */ s(async (h) => {
            try {
              let m = os({
                execute: f.execute.bind(f),
                input: p,
                options: {
                  toolCallId: c,
                  messages: r,
                  abortSignal: i,
                  experimental_context: a
                }
              }), v;
              for await (let b of m)
                b.type === "final" && (v = b.output);
              try {
                h.setAttributes(
                  ke({
                    telemetry: o,
                    attributes: {
                      "ai.toolCall.result": {
                        output: /* @__PURE__ */ s(() => JSON.stringify(v), "output")
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
                output: v,
                dynamic: f.type === "dynamic"
              };
            } catch (m) {
              return Hm(h, m), {
                type: "tool-error",
                toolCallId: c,
                toolName: d,
                input: p,
                error: m,
                dynamic: f.type === "dynamic"
              };
            }
          }, "fn")
        });
    })
  )).filter(
    (c) => c != null
  );
}
s(s0, "executeTools");
var l0 = class {
  static {
    s(this, "DefaultGenerateTextResult");
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
      (e, t) => O_(e, t.usage),
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
      throw new By();
    return this.resolvedOutput;
  }
};
function Dy(e) {
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
s(Dy, "asToolCalls");
function u0({
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
            file: new P_(o)
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
s(u0, "asContent");
function ai(e, t) {
  let n = new Headers(e ?? {});
  for (let [o, r] of Object.entries(t))
    n.has(o) || n.set(o, r);
  return n;
}
s(ai, "prepareHeaders");
function D_({
  status: e,
  statusText: t,
  headers: n,
  textStream: o
}) {
  return new Response(o.pipeThrough(new TextEncoderStream()), {
    status: e ?? 200,
    statusText: t,
    headers: ai(n, {
      "content-type": "text/plain; charset=utf-8"
    })
  });
}
s(D_, "createTextStreamResponse");
function U_({
  response: e,
  status: t,
  statusText: n,
  headers: o,
  stream: r
}) {
  let i = t ?? 200;
  n !== void 0 ? e.writeHead(i, n, o) : e.writeHead(i, o);
  let a = r.getReader();
  (/* @__PURE__ */ s(async () => {
    try {
      for (; ; ) {
        let { done: c, value: d } = await a.read();
        if (c)
          break;
        e.write(d) || await new Promise((f) => {
          e.once("drain", f);
        });
      }
    } catch (c) {
      throw c;
    } finally {
      e.end();
    }
  }, "read"))();
}
s(U_, "writeToServerResponse");
function M_({
  response: e,
  status: t,
  statusText: n,
  headers: o,
  textStream: r
}) {
  U_({
    response: e,
    status: t,
    statusText: n,
    headers: Object.fromEntries(
      ai(o, {
        "content-type": "text/plain; charset=utf-8"
      }).entries()
    ),
    stream: r.pipeThrough(new TextEncoderStream())
  });
}
s(M_, "pipeTextStreamToResponse");
var Z_ = class extends TransformStream {
  static {
    s(this, "JsonToSseTransformStream");
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
}, L_ = {
  "content-type": "text/event-stream",
  "cache-control": "no-cache",
  connection: "keep-alive",
  "x-vercel-ai-ui-message-stream": "v1",
  "x-accel-buffering": "no"
  // disable nginx buffering
};
function c0({
  status: e,
  statusText: t,
  headers: n,
  stream: o,
  consumeSseStream: r
}) {
  let i = o.pipeThrough(new Z_());
  if (r) {
    let [a, u] = i.tee();
    i = a, r({ stream: u });
  }
  return new Response(i.pipeThrough(new TextEncoderStream()), {
    status: e,
    statusText: t,
    headers: ai(n, L_)
  });
}
s(c0, "createUIMessageStreamResponse");
function d0({
  originalMessages: e,
  responseMessageId: t
}) {
  if (e == null)
    return;
  let n = e[e.length - 1];
  return n?.role === "assistant" ? n.id : typeof t == "function" ? t() : t;
}
s(d0, "getResponseUIMessageId");
var GR = ie(
  () => Z(
    l.union([
      l.strictObject({
        type: l.literal("text-start"),
        id: l.string(),
        providerMetadata: he.optional()
      }),
      l.strictObject({
        type: l.literal("text-delta"),
        id: l.string(),
        delta: l.string(),
        providerMetadata: he.optional()
      }),
      l.strictObject({
        type: l.literal("text-end"),
        id: l.string(),
        providerMetadata: he.optional()
      }),
      l.strictObject({
        type: l.literal("error"),
        errorText: l.string()
      }),
      l.strictObject({
        type: l.literal("tool-input-start"),
        toolCallId: l.string(),
        toolName: l.string(),
        providerExecuted: l.boolean().optional(),
        dynamic: l.boolean().optional()
      }),
      l.strictObject({
        type: l.literal("tool-input-delta"),
        toolCallId: l.string(),
        inputTextDelta: l.string()
      }),
      l.strictObject({
        type: l.literal("tool-input-available"),
        toolCallId: l.string(),
        toolName: l.string(),
        input: l.unknown(),
        providerExecuted: l.boolean().optional(),
        providerMetadata: he.optional(),
        dynamic: l.boolean().optional()
      }),
      l.strictObject({
        type: l.literal("tool-input-error"),
        toolCallId: l.string(),
        toolName: l.string(),
        input: l.unknown(),
        providerExecuted: l.boolean().optional(),
        providerMetadata: he.optional(),
        dynamic: l.boolean().optional(),
        errorText: l.string()
      }),
      l.strictObject({
        type: l.literal("tool-output-available"),
        toolCallId: l.string(),
        output: l.unknown(),
        providerExecuted: l.boolean().optional(),
        dynamic: l.boolean().optional(),
        preliminary: l.boolean().optional()
      }),
      l.strictObject({
        type: l.literal("tool-output-error"),
        toolCallId: l.string(),
        errorText: l.string(),
        providerExecuted: l.boolean().optional(),
        dynamic: l.boolean().optional()
      }),
      l.strictObject({
        type: l.literal("reasoning-start"),
        id: l.string(),
        providerMetadata: he.optional()
      }),
      l.strictObject({
        type: l.literal("reasoning-delta"),
        id: l.string(),
        delta: l.string(),
        providerMetadata: he.optional()
      }),
      l.strictObject({
        type: l.literal("reasoning-end"),
        id: l.string(),
        providerMetadata: he.optional()
      }),
      l.strictObject({
        type: l.literal("source-url"),
        sourceId: l.string(),
        url: l.string(),
        title: l.string().optional(),
        providerMetadata: he.optional()
      }),
      l.strictObject({
        type: l.literal("source-document"),
        sourceId: l.string(),
        mediaType: l.string(),
        title: l.string(),
        filename: l.string().optional(),
        providerMetadata: he.optional()
      }),
      l.strictObject({
        type: l.literal("file"),
        url: l.string(),
        mediaType: l.string(),
        providerMetadata: he.optional()
      }),
      l.strictObject({
        type: l.custom(
          (e) => typeof e == "string" && e.startsWith("data-"),
          { message: 'Type must start with "data-"' }
        ),
        id: l.string().optional(),
        data: l.unknown(),
        transient: l.boolean().optional()
      }),
      l.strictObject({
        type: l.literal("start-step")
      }),
      l.strictObject({
        type: l.literal("finish-step")
      }),
      l.strictObject({
        type: l.literal("start"),
        messageId: l.string().optional(),
        messageMetadata: l.unknown().optional()
      }),
      l.strictObject({
        type: l.literal("finish"),
        finishReason: l.enum([
          "stop",
          "length",
          "content-filter",
          "tool-calls",
          "error",
          "other",
          "unknown"
        ]).optional(),
        messageMetadata: l.unknown().optional()
      }),
      l.strictObject({
        type: l.literal("abort")
      }),
      l.strictObject({
        type: l.literal("message-metadata"),
        messageMetadata: l.unknown()
      })
    ])
  )
);
function p0(e) {
  return e.type.startsWith("data-");
}
s(p0, "isDataUIMessageChunk");
function F_(e, t) {
  if (e === void 0 && t === void 0)
    return;
  if (e === void 0)
    return t;
  if (t === void 0)
    return e;
  let n = { ...e };
  for (let o in t)
    if (Object.prototype.hasOwnProperty.call(t, o)) {
      let r = t[o];
      if (r === void 0)
        continue;
      let i = o in e ? e[o] : void 0, a = r !== null && typeof r == "object" && !Array.isArray(r) && !(r instanceof Date) && !(r instanceof RegExp), u = i != null && typeof i == "object" && !Array.isArray(i) && !(i instanceof Date) && !(i instanceof RegExp);
      a && u ? n[o] = F_(
        i,
        r
      ) : n[o] = r;
    }
  return n;
}
s(F_, "mergeObjects");
function m0(e) {
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
  s(r, "processValueStart");
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
  s(i, "processAfterObjectValue");
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
  s(a, "processAfterArrayValue");
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
        let f = e.substring(o, c + 1);
        !"false".startsWith(f) && !"true".startsWith(f) && !"null".startsWith(f) ? (t.pop(), t[t.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" ? i(d, c) : t[t.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && a(d, c)) : n = c;
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
s(m0, "fixJson");
async function Xm(e) {
  if (e === void 0)
    return { value: void 0, state: "undefined-input" };
  let t = await St({ text: e });
  return t.success ? { value: t.value, state: "successful-parse" } : (t = await St({ text: m0(e) }), t.success ? { value: t.value, state: "repaired-parse" } : { value: void 0, state: "failed-parse" });
}
s(Xm, "parsePartialJson");
function Jm(e) {
  return e.type.startsWith("tool-");
}
s(Jm, "isToolUIPart");
function Uy(e) {
  return e.type.split("-").slice(1).join("-");
}
s(Uy, "getToolName");
function f0({
  lastMessage: e,
  messageId: t
}) {
  return {
    message: e?.role === "assistant" ? e : {
      id: t,
      metadata: void 0,
      role: "assistant",
      parts: []
    },
    activeTextParts: {},
    activeReasoningParts: {},
    partialToolCalls: {}
  };
}
s(f0, "createStreamingUIMessageState");
function g0({
  stream: e,
  messageMetadataSchema: t,
  dataPartSchemas: n,
  runUpdateMessageJob: o,
  onError: r,
  onToolCall: i,
  onData: a
}) {
  return e.pipeThrough(
    new TransformStream({
      async transform(u, c) {
        await o(async ({ state: d, write: p }) => {
          var f, h, m, v;
          function b(x) {
            let M = d.message.parts.filter(Jm).find(
              (S) => S.toolCallId === x
            );
            if (M == null)
              throw new Error(
                "tool-output-error must be preceded by a tool-input-available"
              );
            return M;
          }
          s(b, "getToolInvocation");
          function $(x) {
            let M = d.message.parts.filter(
              (S) => S.type === "dynamic-tool"
            ).find(
              (S) => S.toolCallId === x
            );
            if (M == null)
              throw new Error(
                "tool-output-error must be preceded by a tool-input-available"
              );
            return M;
          }
          s($, "getDynamicToolInvocation");
          function w(x) {
            var C;
            let M = d.message.parts.find(
              (G) => Jm(G) && G.toolCallId === x.toolCallId
            ), S = x, T = M;
            M != null ? (M.state = x.state, T.input = S.input, T.output = S.output, T.errorText = S.errorText, T.rawInput = S.rawInput, T.preliminary = S.preliminary, T.providerExecuted = (C = S.providerExecuted) != null ? C : M.providerExecuted, S.providerMetadata != null && M.state === "input-available" && (M.callProviderMetadata = S.providerMetadata)) : d.message.parts.push({
              type: `tool-${x.toolName}`,
              toolCallId: x.toolCallId,
              state: x.state,
              input: S.input,
              output: S.output,
              rawInput: S.rawInput,
              errorText: S.errorText,
              providerExecuted: S.providerExecuted,
              preliminary: S.preliminary,
              ...S.providerMetadata != null ? { callProviderMetadata: S.providerMetadata } : {}
            });
          }
          s(w, "updateToolPart");
          function I(x) {
            var C, M;
            let S = d.message.parts.find(
              (J) => J.type === "dynamic-tool" && J.toolCallId === x.toolCallId
            ), T = x, G = S;
            S != null ? (S.state = x.state, G.toolName = x.toolName, G.input = T.input, G.output = T.output, G.errorText = T.errorText, G.rawInput = (C = T.rawInput) != null ? C : G.rawInput, G.preliminary = T.preliminary, G.providerExecuted = (M = T.providerExecuted) != null ? M : S.providerExecuted, T.providerMetadata != null && S.state === "input-available" && (S.callProviderMetadata = T.providerMetadata)) : d.message.parts.push({
              type: "dynamic-tool",
              toolName: x.toolName,
              toolCallId: x.toolCallId,
              state: x.state,
              input: T.input,
              output: T.output,
              errorText: T.errorText,
              preliminary: T.preliminary,
              providerExecuted: T.providerExecuted,
              ...T.providerMetadata != null ? { callProviderMetadata: T.providerMetadata } : {}
            });
          }
          s(I, "updateDynamicToolPart");
          async function _(x) {
            if (x != null) {
              let C = d.message.metadata != null ? F_(d.message.metadata, x) : x;
              t != null && await dt({
                value: C,
                schema: t
              }), d.message.metadata = C;
            }
          }
          switch (s(_, "updateMessageMetadata"), u.type) {
            case "text-start": {
              let x = {
                type: "text",
                text: "",
                providerMetadata: u.providerMetadata,
                state: "streaming"
              };
              d.activeTextParts[u.id] = x, d.message.parts.push(x), p();
              break;
            }
            case "text-delta": {
              let x = d.activeTextParts[u.id];
              x.text += u.delta, x.providerMetadata = (f = u.providerMetadata) != null ? f : x.providerMetadata, p();
              break;
            }
            case "text-end": {
              let x = d.activeTextParts[u.id];
              x.state = "done", x.providerMetadata = (h = u.providerMetadata) != null ? h : x.providerMetadata, delete d.activeTextParts[u.id], p();
              break;
            }
            case "reasoning-start": {
              let x = {
                type: "reasoning",
                text: "",
                providerMetadata: u.providerMetadata,
                state: "streaming"
              };
              d.activeReasoningParts[u.id] = x, d.message.parts.push(x), p();
              break;
            }
            case "reasoning-delta": {
              let x = d.activeReasoningParts[u.id];
              x.text += u.delta, x.providerMetadata = (m = u.providerMetadata) != null ? m : x.providerMetadata, p();
              break;
            }
            case "reasoning-end": {
              let x = d.activeReasoningParts[u.id];
              x.providerMetadata = (v = u.providerMetadata) != null ? v : x.providerMetadata, x.state = "done", delete d.activeReasoningParts[u.id], p();
              break;
            }
            case "file": {
              d.message.parts.push({
                type: "file",
                mediaType: u.mediaType,
                url: u.url
              }), p();
              break;
            }
            case "source-url": {
              d.message.parts.push({
                type: "source-url",
                sourceId: u.sourceId,
                url: u.url,
                title: u.title,
                providerMetadata: u.providerMetadata
              }), p();
              break;
            }
            case "source-document": {
              d.message.parts.push({
                type: "source-document",
                sourceId: u.sourceId,
                mediaType: u.mediaType,
                title: u.title,
                filename: u.filename,
                providerMetadata: u.providerMetadata
              }), p();
              break;
            }
            case "tool-input-start": {
              let x = d.message.parts.filter(Jm);
              d.partialToolCalls[u.toolCallId] = {
                text: "",
                toolName: u.toolName,
                index: x.length,
                dynamic: u.dynamic
              }, u.dynamic ? I({
                toolCallId: u.toolCallId,
                toolName: u.toolName,
                state: "input-streaming",
                input: void 0,
                providerExecuted: u.providerExecuted
              }) : w({
                toolCallId: u.toolCallId,
                toolName: u.toolName,
                state: "input-streaming",
                input: void 0,
                providerExecuted: u.providerExecuted
              }), p();
              break;
            }
            case "tool-input-delta": {
              let x = d.partialToolCalls[u.toolCallId];
              x.text += u.inputTextDelta;
              let { value: C } = await Xm(
                x.text
              );
              x.dynamic ? I({
                toolCallId: u.toolCallId,
                toolName: x.toolName,
                state: "input-streaming",
                input: C
              }) : w({
                toolCallId: u.toolCallId,
                toolName: x.toolName,
                state: "input-streaming",
                input: C
              }), p();
              break;
            }
            case "tool-input-available": {
              u.dynamic ? I({
                toolCallId: u.toolCallId,
                toolName: u.toolName,
                state: "input-available",
                input: u.input,
                providerExecuted: u.providerExecuted,
                providerMetadata: u.providerMetadata
              }) : w({
                toolCallId: u.toolCallId,
                toolName: u.toolName,
                state: "input-available",
                input: u.input,
                providerExecuted: u.providerExecuted,
                providerMetadata: u.providerMetadata
              }), p(), i && !u.providerExecuted && await i({
                toolCall: u
              });
              break;
            }
            case "tool-input-error": {
              u.dynamic ? I({
                toolCallId: u.toolCallId,
                toolName: u.toolName,
                state: "output-error",
                input: u.input,
                errorText: u.errorText,
                providerExecuted: u.providerExecuted,
                providerMetadata: u.providerMetadata
              }) : w({
                toolCallId: u.toolCallId,
                toolName: u.toolName,
                state: "output-error",
                input: void 0,
                rawInput: u.input,
                errorText: u.errorText,
                providerExecuted: u.providerExecuted,
                providerMetadata: u.providerMetadata
              }), p();
              break;
            }
            case "tool-output-available": {
              if (u.dynamic) {
                let x = $(
                  u.toolCallId
                );
                I({
                  toolCallId: u.toolCallId,
                  toolName: x.toolName,
                  state: "output-available",
                  input: x.input,
                  output: u.output,
                  preliminary: u.preliminary
                });
              } else {
                let x = b(u.toolCallId);
                w({
                  toolCallId: u.toolCallId,
                  toolName: Uy(x),
                  state: "output-available",
                  input: x.input,
                  output: u.output,
                  providerExecuted: u.providerExecuted,
                  preliminary: u.preliminary
                });
              }
              p();
              break;
            }
            case "tool-output-error": {
              if (u.dynamic) {
                let x = $(
                  u.toolCallId
                );
                I({
                  toolCallId: u.toolCallId,
                  toolName: x.toolName,
                  state: "output-error",
                  input: x.input,
                  errorText: u.errorText,
                  providerExecuted: u.providerExecuted
                });
              } else {
                let x = b(u.toolCallId);
                w({
                  toolCallId: u.toolCallId,
                  toolName: Uy(x),
                  state: "output-error",
                  input: x.input,
                  rawInput: x.rawInput,
                  errorText: u.errorText,
                  providerExecuted: u.providerExecuted
                });
              }
              p();
              break;
            }
            case "start-step": {
              d.message.parts.push({ type: "step-start" });
              break;
            }
            case "finish-step": {
              d.activeTextParts = {}, d.activeReasoningParts = {};
              break;
            }
            case "start": {
              u.messageId != null && (d.message.id = u.messageId), await _(u.messageMetadata), (u.messageId != null || u.messageMetadata != null) && p();
              break;
            }
            case "finish": {
              u.finishReason != null && (d.finishReason = u.finishReason), await _(u.messageMetadata), u.messageMetadata != null && p();
              break;
            }
            case "message-metadata": {
              await _(u.messageMetadata), u.messageMetadata != null && p();
              break;
            }
            case "error": {
              r?.(new Error(u.errorText));
              break;
            }
            default:
              if (p0(u)) {
                n?.[u.type] != null && await dt({
                  value: u.data,
                  schema: n[u.type]
                });
                let x = u;
                if (x.transient) {
                  a?.(x);
                  break;
                }
                let C = x.id != null ? d.message.parts.find(
                  (M) => x.type === M.type && x.id === M.id
                ) : void 0;
                C != null ? C.data = x.data : d.message.parts.push(x), a?.(x), p();
              }
          }
          c.enqueue(u);
        });
      }
    })
  );
}
s(g0, "processUIMessageStream");
function h0({
  messageId: e,
  originalMessages: t = [],
  onFinish: n,
  onError: o,
  stream: r
}) {
  let i = t?.[t.length - 1];
  i?.role !== "assistant" ? i = void 0 : e = i.id;
  let a = !1, u = r.pipeThrough(
    new TransformStream({
      transform(h, m) {
        if (h.type === "start") {
          let v = h;
          v.messageId == null && e != null && (v.messageId = e);
        }
        h.type === "abort" && (a = !0), m.enqueue(h);
      }
    })
  );
  if (n == null)
    return u;
  let c = f0({
    lastMessage: i ? structuredClone(i) : void 0,
    messageId: e ?? ""
    // will be overridden by the stream
  }), d = /* @__PURE__ */ s(async (h) => {
    await h({ state: c, write: /* @__PURE__ */ s(() => {
    }, "write") });
  }, "runUpdateMessageJob"), p = !1, f = /* @__PURE__ */ s(async () => {
    if (p || !n)
      return;
    p = !0;
    let h = c.message.id === i?.id;
    await n({
      isAborted: a,
      isContinuation: h,
      responseMessage: c.message,
      messages: [
        ...h ? t.slice(0, -1) : t,
        c.message
      ],
      finishReason: c.finishReason
    });
  }, "callOnFinish");
  return g0({
    stream: u,
    runUpdateMessageJob: d,
    onError: o
  }).pipeThrough(
    new TransformStream({
      transform(h, m) {
        m.enqueue(h);
      },
      // @ts-expect-error cancel is still new and missing from types https://developer.mozilla.org/en-US/docs/Web/API/TransformStream#browser_compatibility
      async cancel() {
        await f();
      },
      async flush() {
        await f();
      }
    })
  );
}
s(h0, "handleUIMessageStreamFinish");
function v0({
  response: e,
  status: t,
  statusText: n,
  headers: o,
  stream: r,
  consumeSseStream: i
}) {
  let a = r.pipeThrough(new Z_());
  if (i) {
    let [u, c] = a.tee();
    a = u, i({ stream: c });
  }
  U_({
    response: e,
    status: t,
    statusText: n,
    headers: Object.fromEntries(
      ai(o, L_).entries()
    ),
    stream: a.pipeThrough(new TextEncoderStream())
  });
}
s(v0, "pipeUIMessageStreamToResponse");
function Er(e) {
  let t = e.pipeThrough(new TransformStream());
  return t[Symbol.asyncIterator] = function() {
    let n = this.getReader(), o = !1;
    async function r(i) {
      var a;
      o = !0;
      try {
        i && await ((a = n.cancel) == null ? void 0 : a.call(n));
      } finally {
        try {
          n.releaseLock();
        } catch {
        }
      }
    }
    return s(r, "cleanup"), {
      /**
       * Reads the next chunk from the stream.
       * @returns A promise resolving to the next IteratorResult.
       */
      async next() {
        if (o)
          return { done: !0, value: void 0 };
        let { done: i, value: a } = await n.read();
        return i ? (await r(!0), { done: !0, value: void 0 }) : { done: !1, value: a };
      },
      /**
       * Called on early exit (e.g., break from for-await).
       * Ensures the stream is cancelled and resources are released.
       * @returns A promise resolving to a completed IteratorResult.
       */
      async return() {
        return await r(!0), { done: !0, value: void 0 };
      },
      /**
       * Called on early exit with error.
       * Ensures the stream is cancelled and resources are released, then rethrows the error.
       * @param err The error to throw.
       * @returns A promise that rejects with the provided error.
       */
      async throw(i) {
        throw await r(!0), i;
      }
    };
  }, t;
}
s(Er, "createAsyncIterableStream");
async function y0({
  stream: e,
  onError: t
}) {
  let n = e.getReader();
  try {
    for (; ; ) {
      let { done: o } = await n.read();
      if (o)
        break;
    }
  } catch (o) {
    t?.(o);
  } finally {
    n.releaseLock();
  }
}
s(y0, "consumeStream");
function My() {
  let e, t;
  return {
    promise: new Promise((o, r) => {
      e = o, t = r;
    }),
    resolve: e,
    reject: t
  };
}
s(My, "createResolvablePromise");
function V_() {
  let e = [], t = null, n = !1, o = My(), r = /* @__PURE__ */ s(() => {
    n = !0, o.resolve(), e.forEach((a) => a.cancel()), e = [], t?.close();
  }, "terminate"), i = /* @__PURE__ */ s(async () => {
    if (n && e.length === 0) {
      t?.close();
      return;
    }
    if (e.length === 0)
      return o = My(), await o.promise, i();
    try {
      let { value: a, done: u } = await e[0].read();
      u ? (e.shift(), e.length > 0 ? await i() : n && t?.close()) : t?.enqueue(a);
    } catch (a) {
      t?.error(a), e.shift(), r();
    }
  }, "processPull");
  return {
    stream: new ReadableStream({
      start(a) {
        t = a;
      },
      pull: i,
      async cancel() {
        for (let a of e)
          await a.cancel();
        e = [], n = !0;
      }
    }),
    addStream: /* @__PURE__ */ s((a) => {
      if (n)
        throw new Error("Cannot add inner stream: outer stream is closed");
      e.push(a.getReader()), o.resolve();
    }, "addStream"),
    /**
     * Gracefully close the outer stream. This will let the inner streams
     * finish processing and then close the outer stream.
     */
    close: /* @__PURE__ */ s(() => {
      n = !0, o.resolve(), e.length === 0 && t?.close();
    }, "close"),
    /**
     * Immediately close the outer stream. This will cancel all inner streams
     * and close the outer stream.
     */
    terminate: r
  };
}
s(V_, "createStitchableStream");
function q_() {
  var e, t;
  return (t = (e = globalThis?.performance) == null ? void 0 : e.now()) != null ? t : Date.now();
}
s(q_, "now");
function _0({
  tools: e,
  generatorStream: t,
  tracer: n,
  telemetry: o,
  system: r,
  messages: i,
  abortSignal: a,
  repairToolCall: u,
  experimental_context: c
}) {
  let d = null, p = new ReadableStream({
    start(w) {
      d = w;
    }
  }), f = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Map(), m = !1, v;
  function b() {
    m && f.size === 0 && (v != null && d.enqueue(v), d.close());
  }
  s(b, "attemptClose");
  let $ = new TransformStream({
    async transform(w, I) {
      let _ = w.type;
      switch (_) {
        case "stream-start":
        case "text-start":
        case "text-delta":
        case "text-end":
        case "reasoning-start":
        case "reasoning-delta":
        case "reasoning-end":
        case "tool-input-start":
        case "tool-input-delta":
        case "tool-input-end":
        case "source":
        case "response-metadata":
        case "error":
        case "raw": {
          I.enqueue(w);
          break;
        }
        case "file": {
          I.enqueue({
            type: "file",
            file: new i0({
              data: w.data,
              mediaType: w.mediaType
            })
          });
          break;
        }
        case "finish": {
          v = {
            type: "finish",
            finishReason: w.finishReason,
            usage: w.usage,
            providerMetadata: w.providerMetadata
          };
          break;
        }
        case "tool-call": {
          try {
            let x = await N_({
              toolCall: w,
              tools: e,
              repairToolCall: u,
              system: r,
              messages: i
            });
            if (I.enqueue(x), x.invalid) {
              d.enqueue({
                type: "tool-error",
                toolCallId: x.toolCallId,
                toolName: x.toolName,
                input: x.input,
                error: Ln(x.error),
                dynamic: !0
              });
              break;
            }
            let C = e[x.toolName];
            if (h.set(x.toolCallId, x.input), C.onInputAvailable != null && await C.onInputAvailable({
              input: x.input,
              toolCallId: x.toolCallId,
              messages: i,
              abortSignal: a,
              experimental_context: c
            }), C.execute != null && x.providerExecuted !== !0) {
              let M = nt();
              f.add(M), st({
                name: "ai.toolCall",
                attributes: ke({
                  telemetry: o,
                  attributes: {
                    ...at({
                      operationId: "ai.toolCall",
                      telemetry: o
                    }),
                    "ai.toolCall.name": x.toolName,
                    "ai.toolCall.id": x.toolCallId,
                    "ai.toolCall.args": {
                      output: /* @__PURE__ */ s(() => JSON.stringify(x.input), "output")
                    }
                  }
                }),
                tracer: n,
                fn: /* @__PURE__ */ s(async (S) => {
                  let T;
                  try {
                    let G = os({
                      execute: C.execute.bind(C),
                      input: x.input,
                      options: {
                        toolCallId: x.toolCallId,
                        messages: i,
                        abortSignal: a,
                        experimental_context: c
                      }
                    });
                    for await (let J of G)
                      d.enqueue({
                        ...x,
                        type: "tool-result",
                        output: J.output,
                        ...J.type === "preliminary" && {
                          preliminary: !0
                        }
                      }), J.type === "final" && (T = J.output);
                  } catch (G) {
                    Hm(S, G), d.enqueue({
                      ...x,
                      type: "tool-error",
                      error: G
                    }), f.delete(M), b();
                    return;
                  }
                  f.delete(M), b();
                  try {
                    S.setAttributes(
                      ke({
                        telemetry: o,
                        attributes: {
                          "ai.toolCall.result": {
                            output: /* @__PURE__ */ s(() => JSON.stringify(T), "output")
                          }
                        }
                      })
                    );
                  } catch {
                  }
                }, "fn")
              });
            }
          } catch (x) {
            d.enqueue({ type: "error", error: x });
          }
          break;
        }
        case "tool-result": {
          let x = w.toolName;
          w.isError ? d.enqueue({
            type: "tool-error",
            toolCallId: w.toolCallId,
            toolName: x,
            input: h.get(w.toolCallId),
            providerExecuted: w.providerExecuted,
            error: w.result
          }) : I.enqueue({
            type: "tool-result",
            toolCallId: w.toolCallId,
            toolName: x,
            input: h.get(w.toolCallId),
            output: w.result,
            providerExecuted: w.providerExecuted
          });
          break;
        }
        default: {
          let x = _;
          throw new Error(`Unhandled chunk type: ${x}`);
        }
      }
    },
    flush() {
      m = !0, b();
    }
  });
  return new ReadableStream({
    async start(w) {
      return Promise.all([
        t.pipeThrough($).pipeTo(
          new WritableStream({
            write(I) {
              w.enqueue(I);
            },
            close() {
            }
          })
        ),
        p.pipeTo(
          new WritableStream({
            write(I) {
              w.enqueue(I);
            },
            close() {
              w.close();
            }
          })
        )
      ]);
    }
  });
}
s(_0, "runToolsTransformation");
var b0 = sr({
  prefix: "aitxt",
  size: 24
});
function HR({
  model: e,
  tools: t,
  toolChoice: n,
  system: o,
  prompt: r,
  messages: i,
  maxRetries: a,
  abortSignal: u,
  headers: c,
  stopWhen: d = R_(1),
  experimental_output: p,
  experimental_telemetry: f,
  prepareStep: h,
  providerOptions: m,
  experimental_activeTools: v,
  activeTools: b = v,
  experimental_repairToolCall: $,
  experimental_transform: w,
  experimental_download: I,
  includeRawChunks: _ = !1,
  onChunk: x,
  onError: C = /* @__PURE__ */ s(({ error: te }) => {
    console.error(te);
  }, "onError"),
  onFinish: M,
  onAbort: S,
  onStepFinish: T,
  experimental_context: G,
  _internal: {
    now: J = q_,
    generateId: ue = b0,
    currentDate: fe = /* @__PURE__ */ s(() => /* @__PURE__ */ new Date(), "currentDate")
  } = {},
  ...Q
}) {
  return new $0({
    model: Wn(e),
    telemetry: f,
    headers: c,
    settings: Q,
    maxRetries: a,
    abortSignal: u,
    system: o,
    prompt: r,
    messages: i,
    tools: t,
    toolChoice: n,
    transforms: Gm(w),
    activeTools: b,
    repairToolCall: $,
    stopConditions: Gm(d),
    output: p,
    providerOptions: m,
    prepareStep: h,
    includeRawChunks: _,
    onChunk: x,
    onError: C,
    onFinish: M,
    onAbort: S,
    onStepFinish: T,
    now: J,
    currentDate: fe,
    generateId: ue,
    experimental_context: G,
    download: I
  });
}
s(HR, "streamText");
function x0(e) {
  if (!e)
    return new TransformStream({
      transform(a, u) {
        u.enqueue({ part: a, partialOutput: void 0 });
      }
    });
  let t, n = "", o = "", r = "";
  function i({
    controller: a,
    partialOutput: u = void 0
  }) {
    a.enqueue({
      part: {
        type: "text-delta",
        id: t,
        text: o
      },
      partialOutput: u
    }), o = "";
  }
  return s(i, "publishTextChunk"), new TransformStream({
    async transform(a, u) {
      if (a.type === "finish-step" && o.length > 0 && i({ controller: u }), a.type !== "text-delta" && a.type !== "text-start" && a.type !== "text-end") {
        u.enqueue({ part: a, partialOutput: void 0 });
        return;
      }
      if (t == null)
        t = a.id;
      else if (a.id !== t) {
        u.enqueue({ part: a, partialOutput: void 0 });
        return;
      }
      if (a.type === "text-start") {
        u.enqueue({ part: a, partialOutput: void 0 });
        return;
      }
      if (a.type === "text-end") {
        o.length > 0 && i({ controller: u }), u.enqueue({ part: a, partialOutput: void 0 });
        return;
      }
      n += a.text, o += a.text;
      let c = await e.parsePartial({ text: n });
      if (c != null) {
        let d = JSON.stringify(c.partial);
        d !== r && (i({ controller: u, partialOutput: c.partial }), r = d);
      }
    }
  });
}
s(x0, "createOutputTransformStream");
var $0 = class {
  static {
    s(this, "DefaultStreamTextResult");
  }
  constructor({
    model: e,
    telemetry: t,
    headers: n,
    settings: o,
    maxRetries: r,
    abortSignal: i,
    system: a,
    prompt: u,
    messages: c,
    tools: d,
    toolChoice: p,
    transforms: f,
    activeTools: h,
    repairToolCall: m,
    stopConditions: v,
    output: b,
    providerOptions: $,
    prepareStep: w,
    includeRawChunks: I,
    now: _,
    currentDate: x,
    generateId: C,
    onChunk: M,
    onError: S,
    onFinish: T,
    onAbort: G,
    onStepFinish: J,
    experimental_context: ue,
    download: fe
  }) {
    this._totalUsage = new xt(), this._finishReason = new xt(), this._steps = new xt(), this.output = b, this.includeRawChunks = I, this.tools = d;
    let Q, te = [], _e = [], be, re, je = {}, xe = [], ye = [], ce, ae = {}, ge = {}, ve = new TransformStream({
      async transform(de, X) {
        var W, F, Ze, ft;
        X.enqueue(de);
        let { part: U } = de;
        if ((U.type === "text-delta" || U.type === "reasoning-delta" || U.type === "source" || U.type === "tool-call" || U.type === "tool-result" || U.type === "tool-input-start" || U.type === "tool-input-delta" || U.type === "raw") && await M?.({ chunk: U }), U.type === "error" && await S({ error: vs(U.error) }), U.type === "text-start" && (ae[U.id] = {
          type: "text",
          text: "",
          providerMetadata: U.providerMetadata
        }, te.push(ae[U.id])), U.type === "text-delta") {
          let pe = ae[U.id];
          if (pe == null) {
            X.enqueue({
              part: {
                type: "error",
                error: `text part ${U.id} not found`
              },
              partialOutput: void 0
            });
            return;
          }
          pe.text += U.text, pe.providerMetadata = (W = U.providerMetadata) != null ? W : pe.providerMetadata;
        }
        if (U.type === "text-end") {
          let pe = ae[U.id];
          if (pe == null) {
            X.enqueue({
              part: {
                type: "error",
                error: `text part ${U.id} not found`
              },
              partialOutput: void 0
            });
            return;
          }
          pe.providerMetadata = (F = U.providerMetadata) != null ? F : pe.providerMetadata, delete ae[U.id];
        }
        if (U.type === "reasoning-start" && (ge[U.id] = {
          type: "reasoning",
          text: "",
          providerMetadata: U.providerMetadata
        }, te.push(ge[U.id])), U.type === "reasoning-delta") {
          let pe = ge[U.id];
          if (pe == null) {
            X.enqueue({
              part: {
                type: "error",
                error: `reasoning part ${U.id} not found`
              },
              partialOutput: void 0
            });
            return;
          }
          pe.text += U.text, pe.providerMetadata = (Ze = U.providerMetadata) != null ? Ze : pe.providerMetadata;
        }
        if (U.type === "reasoning-end") {
          let pe = ge[U.id];
          if (pe == null) {
            X.enqueue({
              part: {
                type: "error",
                error: `reasoning part ${U.id} not found`
              },
              partialOutput: void 0
            });
            return;
          }
          pe.providerMetadata = (ft = U.providerMetadata) != null ? ft : pe.providerMetadata, delete ge[U.id];
        }
        if (U.type === "file" && te.push({ type: "file", file: U.file }), U.type === "source" && te.push(U), U.type === "tool-call" && te.push(U), U.type === "tool-result" && !U.preliminary && te.push(U), U.type === "tool-error" && te.push(U), U.type === "start-step" && (je = U.request, xe = U.warnings), U.type === "finish-step") {
          let pe = Km({
            content: te,
            tools: d
          }), Ct = new A_({
            content: te,
            finishReason: U.finishReason,
            usage: U.usage,
            warnings: xe,
            request: je,
            response: {
              ...U.response,
              messages: [..._e, ...pe]
            },
            providerMetadata: U.providerMetadata
          });
          await J?.(Ct), fs(xe), ye.push(Ct), te = [], ge = {}, ae = {}, _e.push(...pe), Q.resolve();
        }
        U.type === "finish" && (re = U.totalUsage, be = U.finishReason);
      },
      async flush(de) {
        try {
          if (ye.length === 0) {
            let Ze = new yS({
              message: "No output generated. Check the stream for errors."
            });
            Ee._finishReason.reject(Ze), Ee._totalUsage.reject(Ze), Ee._steps.reject(Ze);
            return;
          }
          let X = be ?? "unknown", W = re ?? {
            inputTokens: void 0,
            outputTokens: void 0,
            totalTokens: void 0
          };
          Ee._finishReason.resolve(X), Ee._totalUsage.resolve(W), Ee._steps.resolve(ye);
          let F = ye[ye.length - 1];
          await T?.({
            finishReason: X,
            totalUsage: W,
            usage: F.usage,
            content: F.content,
            text: F.text,
            reasoningText: F.reasoningText,
            reasoning: F.reasoning,
            files: F.files,
            sources: F.sources,
            toolCalls: F.toolCalls,
            staticToolCalls: F.staticToolCalls,
            dynamicToolCalls: F.dynamicToolCalls,
            toolResults: F.toolResults,
            staticToolResults: F.staticToolResults,
            dynamicToolResults: F.dynamicToolResults,
            request: F.request,
            response: F.response,
            warnings: F.warnings,
            providerMetadata: F.providerMetadata,
            steps: ye
          }), ce.setAttributes(
            ke({
              telemetry: t,
              attributes: {
                "ai.response.finishReason": X,
                "ai.response.text": { output: /* @__PURE__ */ s(() => F.text, "output") },
                "ai.response.toolCalls": {
                  output: /* @__PURE__ */ s(() => {
                    var Ze;
                    return (Ze = F.toolCalls) != null && Ze.length ? JSON.stringify(F.toolCalls) : void 0;
                  }, "output")
                },
                "ai.response.providerMetadata": JSON.stringify(
                  F.providerMetadata
                ),
                "ai.usage.inputTokens": W.inputTokens,
                "ai.usage.outputTokens": W.outputTokens,
                "ai.usage.totalTokens": W.totalTokens,
                "ai.usage.reasoningTokens": W.reasoningTokens,
                "ai.usage.cachedInputTokens": W.cachedInputTokens
              }
            })
          );
        } catch (X) {
          de.error(X);
        } finally {
          ce.end();
        }
      }
    }), Y = V_();
    this.addStream = Y.addStream, this.closeStream = Y.close;
    let g = Y.stream.getReader(), L = new ReadableStream({
      async start(de) {
        de.enqueue({ type: "start" });
      },
      async pull(de) {
        function X() {
          G?.({ steps: ye }), de.enqueue({ type: "abort" }), de.close();
        }
        s(X, "abort");
        try {
          let { done: W, value: F } = await g.read();
          if (W) {
            de.close();
            return;
          }
          if (i?.aborted) {
            X();
            return;
          }
          de.enqueue(F);
        } catch (W) {
          ar(W) && i?.aborted ? X() : de.error(W);
        }
      },
      cancel(de) {
        return Y.stream.cancel(de);
      }
    });
    for (let de of f)
      L = L.pipeThrough(
        de({
          tools: d,
          stopStream() {
            Y.terminate();
          }
        })
      );
    this.baseStream = L.pipeThrough(x0(b)).pipeThrough(ve);
    let { maxRetries: B, retry: Le } = Xn({
      maxRetries: r,
      abortSignal: i
    }), $e = Hn(t), Ue = Vr(o), mt = Kn({
      model: e,
      telemetry: t,
      headers: n,
      settings: { ...Ue, maxRetries: B }
    }), Ee = this;
    st({
      name: "ai.streamText",
      attributes: ke({
        telemetry: t,
        attributes: {
          ...at({ operationId: "ai.streamText", telemetry: t }),
          ...mt,
          // specific settings that only make sense on the outer level:
          "ai.prompt": {
            input: /* @__PURE__ */ s(() => JSON.stringify({ system: a, prompt: u, messages: c }), "input")
          }
        }
      }),
      tracer: $e,
      endWhenDone: !1,
      fn: /* @__PURE__ */ s(async (de) => {
        ce = de;
        async function X({
          currentStep: W,
          responseMessages: F,
          usage: Ze
        }) {
          var ft, U, pe, Ct, we;
          let Dt = Ee.includeRawChunks;
          Q = new xt();
          let Yn = await hs({
            system: a,
            prompt: u,
            messages: c
          }), cr = [
            ...Yn.messages,
            ...F
          ], gt = await w?.({
            model: e,
            steps: ye,
            stepNumber: ye.length,
            messages: cr
          }), Gt = Wn(
            (ft = gt?.model) != null ? ft : e
          ), Qn = await gs({
            prompt: {
              system: (U = gt?.system) != null ? U : Yn.system,
              messages: (pe = gt?.messages) != null ? pe : cr
            },
            supportedUrls: await Gt.supportedUrls,
            download: fe
          }), { toolChoice: qr, tools: Jr } = S_({
            tools: d,
            toolChoice: (Ct = gt?.toolChoice) != null ? Ct : p,
            activeTools: (we = gt?.activeTools) != null ? we : h
          }), {
            result: { stream: si, response: Fe, request: Wt },
            doStreamSpan: Kt,
            startTimestampMs: ef
          } = await Le(
            () => st({
              name: "ai.streamText.doStream",
              attributes: ke({
                telemetry: t,
                attributes: {
                  ...at({
                    operationId: "ai.streamText.doStream",
                    telemetry: t
                  }),
                  ...mt,
                  // model:
                  "ai.model.provider": Gt.provider,
                  "ai.model.id": Gt.modelId,
                  // prompt:
                  "ai.prompt.messages": {
                    input: /* @__PURE__ */ s(() => ys(Qn), "input")
                  },
                  "ai.prompt.tools": {
                    // convert the language model level tools:
                    input: /* @__PURE__ */ s(() => Jr?.map((K) => JSON.stringify(K)), "input")
                  },
                  "ai.prompt.toolChoice": {
                    input: /* @__PURE__ */ s(() => qr != null ? JSON.stringify(qr) : void 0, "input")
                  },
                  // standardized gen-ai llm span attributes:
                  "gen_ai.system": Gt.provider,
                  "gen_ai.request.model": Gt.modelId,
                  "gen_ai.request.frequency_penalty": Ue.frequencyPenalty,
                  "gen_ai.request.max_tokens": Ue.maxOutputTokens,
                  "gen_ai.request.presence_penalty": Ue.presencePenalty,
                  "gen_ai.request.stop_sequences": Ue.stopSequences,
                  "gen_ai.request.temperature": Ue.temperature,
                  "gen_ai.request.top_k": Ue.topK,
                  "gen_ai.request.top_p": Ue.topP
                }
              }),
              tracer: $e,
              endWhenDone: !1,
              fn: /* @__PURE__ */ s(async (K) => ({
                startTimestampMs: _(),
                // get before the call
                doStreamSpan: K,
                result: await Gt.doStream({
                  ...Ue,
                  tools: Jr,
                  toolChoice: qr,
                  responseFormat: b?.responseFormat,
                  prompt: Qn,
                  providerOptions: $,
                  abortSignal: i,
                  headers: n,
                  includeRawChunks: Dt
                })
              }), "fn")
            })
          ), ub = _0({
            tools: d,
            generatorStream: si,
            tracer: $e,
            telemetry: t,
            system: a,
            messages: cr,
            repairToolCall: m,
            abortSignal: i,
            experimental_context: ue
          }), cb = Wt ?? {}, li = [], _s = [], bs, xs = {}, Br = "unknown", Et = {
            inputTokens: void 0,
            outputTokens: void 0,
            totalTokens: void 0
          }, $s, tf = !0, Ut = {
            id: C(),
            timestamp: x(),
            modelId: e.modelId
          }, rf = "";
          Ee.addStream(
            ub.pipeThrough(
              new TransformStream({
                async transform(K, Je) {
                  var eo, to, ui, Ht;
                  if (K.type === "stream-start") {
                    bs = K.warnings;
                    return;
                  }
                  if (tf) {
                    let Xe = _() - ef;
                    tf = !1, Kt.addEvent("ai.stream.firstChunk", {
                      "ai.response.msToFirstChunk": Xe
                    }), Kt.setAttributes({
                      "ai.response.msToFirstChunk": Xe
                    }), Je.enqueue({
                      type: "start-step",
                      request: cb,
                      warnings: bs ?? []
                    });
                  }
                  let nf = K.type;
                  switch (nf) {
                    case "text-start":
                    case "text-end": {
                      Je.enqueue(K);
                      break;
                    }
                    case "text-delta": {
                      K.delta.length > 0 && (Je.enqueue({
                        type: "text-delta",
                        id: K.id,
                        text: K.delta,
                        providerMetadata: K.providerMetadata
                      }), rf += K.delta);
                      break;
                    }
                    case "reasoning-start":
                    case "reasoning-end": {
                      Je.enqueue(K);
                      break;
                    }
                    case "reasoning-delta": {
                      Je.enqueue({
                        type: "reasoning-delta",
                        id: K.id,
                        text: K.delta,
                        providerMetadata: K.providerMetadata
                      });
                      break;
                    }
                    case "tool-call": {
                      Je.enqueue(K), li.push(K);
                      break;
                    }
                    case "tool-result": {
                      Je.enqueue(K), K.preliminary || _s.push(K);
                      break;
                    }
                    case "tool-error": {
                      Je.enqueue(K), _s.push(K);
                      break;
                    }
                    case "response-metadata": {
                      Ut = {
                        id: (eo = K.id) != null ? eo : Ut.id,
                        timestamp: (to = K.timestamp) != null ? to : Ut.timestamp,
                        modelId: (ui = K.modelId) != null ? ui : Ut.modelId
                      };
                      break;
                    }
                    case "finish": {
                      Et = K.usage, Br = K.finishReason, $s = K.providerMetadata;
                      let Xe = _() - ef;
                      Kt.addEvent("ai.stream.finish"), Kt.setAttributes({
                        "ai.response.msToFinish": Xe,
                        "ai.response.avgOutputTokensPerSecond": 1e3 * ((Ht = Et.outputTokens) != null ? Ht : 0) / Xe
                      });
                      break;
                    }
                    case "file": {
                      Je.enqueue(K);
                      break;
                    }
                    case "source": {
                      Je.enqueue(K);
                      break;
                    }
                    case "tool-input-start": {
                      xs[K.id] = K.toolName;
                      let Xe = d?.[K.toolName];
                      Xe?.onInputStart != null && await Xe.onInputStart({
                        toolCallId: K.id,
                        messages: cr,
                        abortSignal: i,
                        experimental_context: ue
                      }), Je.enqueue({
                        ...K,
                        dynamic: Xe?.type === "dynamic"
                      });
                      break;
                    }
                    case "tool-input-end": {
                      delete xs[K.id], Je.enqueue(K);
                      break;
                    }
                    case "tool-input-delta": {
                      let Xe = xs[K.id], ws = d?.[Xe];
                      ws?.onInputDelta != null && await ws.onInputDelta({
                        inputTextDelta: K.delta,
                        toolCallId: K.id,
                        messages: cr,
                        abortSignal: i,
                        experimental_context: ue
                      }), Je.enqueue(K);
                      break;
                    }
                    case "error": {
                      Je.enqueue(K), Br = "error";
                      break;
                    }
                    case "raw": {
                      Dt && Je.enqueue(K);
                      break;
                    }
                    default: {
                      let Xe = nf;
                      throw new Error(`Unknown chunk type: ${Xe}`);
                    }
                  }
                },
                // invoke onFinish callback and resolve toolResults promise when the stream is about to close:
                async flush(K) {
                  let Je = li.length > 0 ? JSON.stringify(li) : void 0;
                  try {
                    Kt.setAttributes(
                      ke({
                        telemetry: t,
                        attributes: {
                          "ai.response.finishReason": Br,
                          "ai.response.text": {
                            output: /* @__PURE__ */ s(() => rf, "output")
                          },
                          "ai.response.toolCalls": {
                            output: /* @__PURE__ */ s(() => Je, "output")
                          },
                          "ai.response.id": Ut.id,
                          "ai.response.model": Ut.modelId,
                          "ai.response.timestamp": Ut.timestamp.toISOString(),
                          "ai.response.providerMetadata": JSON.stringify($s),
                          "ai.usage.inputTokens": Et.inputTokens,
                          "ai.usage.outputTokens": Et.outputTokens,
                          "ai.usage.totalTokens": Et.totalTokens,
                          "ai.usage.reasoningTokens": Et.reasoningTokens,
                          "ai.usage.cachedInputTokens": Et.cachedInputTokens,
                          // standardized gen-ai llm span attributes:
                          "gen_ai.response.finish_reasons": [Br],
                          "gen_ai.response.id": Ut.id,
                          "gen_ai.response.model": Ut.modelId,
                          "gen_ai.usage.input_tokens": Et.inputTokens,
                          "gen_ai.usage.output_tokens": Et.outputTokens
                        }
                      })
                    );
                  } catch {
                  } finally {
                    Kt.end();
                  }
                  K.enqueue({
                    type: "finish-step",
                    finishReason: Br,
                    usage: Et,
                    providerMetadata: $s,
                    response: {
                      ...Ut,
                      headers: Fe?.headers
                    }
                  });
                  let eo = O_(Ze, Et);
                  await Q.promise;
                  let to = li.filter(
                    (Ht) => Ht.providerExecuted !== !0
                  ), ui = _s.filter(
                    (Ht) => Ht.providerExecuted !== !0
                  );
                  if (to.length > 0 && // all current tool calls have outputs (incl. execution errors):
                  ui.length === to.length && // continue until a stop condition is met:
                  !await C_({
                    stopConditions: v,
                    steps: ye
                  })) {
                    F.push(
                      ...Km({
                        content: (
                          // use transformed content to create the messages for the next step:
                          ye[ye.length - 1].content
                        ),
                        tools: d
                      })
                    );
                    try {
                      await X({
                        currentStep: W + 1,
                        responseMessages: F,
                        usage: eo
                      });
                    } catch (Ht) {
                      K.enqueue({
                        type: "error",
                        error: Ht
                      }), Ee.closeStream();
                    }
                  } else
                    K.enqueue({
                      type: "finish",
                      finishReason: Br,
                      totalUsage: eo
                    }), Ee.closeStream();
                }
              })
            )
          );
        }
        s(X, "streamStep"), await X({
          currentStep: 0,
          responseMessages: [],
          usage: {
            inputTokens: void 0,
            outputTokens: void 0,
            totalTokens: void 0
          }
        });
      }, "fn")
    }).catch((de) => {
      Ee.addStream(
        new ReadableStream({
          start(X) {
            X.enqueue({ type: "error", error: de }), X.close();
          }
        })
      ), Ee.closeStream();
    });
  }
  get steps() {
    return this.consumeStream(), this._steps.promise;
  }
  get finalStep() {
    return this.steps.then((e) => e[e.length - 1]);
  }
  get content() {
    return this.finalStep.then((e) => e.content);
  }
  get warnings() {
    return this.finalStep.then((e) => e.warnings);
  }
  get providerMetadata() {
    return this.finalStep.then((e) => e.providerMetadata);
  }
  get text() {
    return this.finalStep.then((e) => e.text);
  }
  get reasoningText() {
    return this.finalStep.then((e) => e.reasoningText);
  }
  get reasoning() {
    return this.finalStep.then((e) => e.reasoning);
  }
  get sources() {
    return this.finalStep.then((e) => e.sources);
  }
  get files() {
    return this.finalStep.then((e) => e.files);
  }
  get toolCalls() {
    return this.finalStep.then((e) => e.toolCalls);
  }
  get staticToolCalls() {
    return this.finalStep.then((e) => e.staticToolCalls);
  }
  get dynamicToolCalls() {
    return this.finalStep.then((e) => e.dynamicToolCalls);
  }
  get toolResults() {
    return this.finalStep.then((e) => e.toolResults);
  }
  get staticToolResults() {
    return this.finalStep.then((e) => e.staticToolResults);
  }
  get dynamicToolResults() {
    return this.finalStep.then((e) => e.dynamicToolResults);
  }
  get usage() {
    return this.finalStep.then((e) => e.usage);
  }
  get request() {
    return this.finalStep.then((e) => e.request);
  }
  get response() {
    return this.finalStep.then((e) => e.response);
  }
  get totalUsage() {
    return this.consumeStream(), this._totalUsage.promise;
  }
  get finishReason() {
    return this.consumeStream(), this._finishReason.promise;
  }
  /**
  Split out a new stream from the original stream.
  The original stream is replaced to allow for further splitting,
  since we do not know how many times the stream will be split.
  
  Note: this leads to buffering the stream content on the server.
  However, the LLM results are expected to be small enough to not cause issues.
     */
  teeStream() {
    let [e, t] = this.baseStream.tee();
    return this.baseStream = t, e;
  }
  get textStream() {
    return Er(
      this.teeStream().pipeThrough(
        new TransformStream({
          transform({ part: e }, t) {
            e.type === "text-delta" && t.enqueue(e.text);
          }
        })
      )
    );
  }
  get fullStream() {
    return Er(
      this.teeStream().pipeThrough(
        new TransformStream({
          transform({ part: e }, t) {
            t.enqueue(e);
          }
        })
      )
    );
  }
  async consumeStream(e) {
    var t;
    try {
      await y0({
        stream: this.fullStream,
        onError: e?.onError
      });
    } catch (n) {
      (t = e?.onError) == null || t.call(e, n);
    }
  }
  get experimental_partialOutputStream() {
    if (this.output == null)
      throw new By();
    return Er(
      this.teeStream().pipeThrough(
        new TransformStream({
          transform({ partialOutput: e }, t) {
            e != null && t.enqueue(e);
          }
        })
      )
    );
  }
  toUIMessageStream({
    originalMessages: e,
    generateMessageId: t,
    onFinish: n,
    messageMetadata: o,
    sendReasoning: r = !0,
    sendSources: i = !1,
    sendStart: a = !0,
    sendFinish: u = !0,
    onError: c = Vt
  } = {}) {
    let d = t != null ? d0({
      originalMessages: e,
      responseMessageId: t
    }) : void 0, p = {}, f = /* @__PURE__ */ s((m) => {
      var v, b;
      let $ = p[m];
      return ((b = (v = this.tools) == null ? void 0 : v[$]) == null ? void 0 : b.type) === "dynamic" ? !0 : void 0;
    }, "isDynamic"), h = this.fullStream.pipeThrough(
      new TransformStream({
        transform: /* @__PURE__ */ s(async (m, v) => {
          let b = o?.({ part: m }), $ = m.type;
          switch ($) {
            case "text-start": {
              v.enqueue({
                type: "text-start",
                id: m.id,
                ...m.providerMetadata != null ? { providerMetadata: m.providerMetadata } : {}
              });
              break;
            }
            case "text-delta": {
              v.enqueue({
                type: "text-delta",
                id: m.id,
                delta: m.text,
                ...m.providerMetadata != null ? { providerMetadata: m.providerMetadata } : {}
              });
              break;
            }
            case "text-end": {
              v.enqueue({
                type: "text-end",
                id: m.id,
                ...m.providerMetadata != null ? { providerMetadata: m.providerMetadata } : {}
              });
              break;
            }
            case "reasoning-start": {
              v.enqueue({
                type: "reasoning-start",
                id: m.id,
                ...m.providerMetadata != null ? { providerMetadata: m.providerMetadata } : {}
              });
              break;
            }
            case "reasoning-delta": {
              r && v.enqueue({
                type: "reasoning-delta",
                id: m.id,
                delta: m.text,
                ...m.providerMetadata != null ? { providerMetadata: m.providerMetadata } : {}
              });
              break;
            }
            case "reasoning-end": {
              v.enqueue({
                type: "reasoning-end",
                id: m.id,
                ...m.providerMetadata != null ? { providerMetadata: m.providerMetadata } : {}
              });
              break;
            }
            case "file": {
              v.enqueue({
                type: "file",
                mediaType: m.file.mediaType,
                url: `data:${m.file.mediaType};base64,${m.file.base64}`
              });
              break;
            }
            case "source": {
              i && m.sourceType === "url" && v.enqueue({
                type: "source-url",
                sourceId: m.id,
                url: m.url,
                title: m.title,
                ...m.providerMetadata != null ? { providerMetadata: m.providerMetadata } : {}
              }), i && m.sourceType === "document" && v.enqueue({
                type: "source-document",
                sourceId: m.id,
                mediaType: m.mediaType,
                title: m.title,
                filename: m.filename,
                ...m.providerMetadata != null ? { providerMetadata: m.providerMetadata } : {}
              });
              break;
            }
            case "tool-input-start": {
              p[m.id] = m.toolName;
              let w = f(m.id);
              v.enqueue({
                type: "tool-input-start",
                toolCallId: m.id,
                toolName: m.toolName,
                ...m.providerExecuted != null ? { providerExecuted: m.providerExecuted } : {},
                ...w != null ? { dynamic: w } : {}
              });
              break;
            }
            case "tool-input-delta": {
              v.enqueue({
                type: "tool-input-delta",
                toolCallId: m.id,
                inputTextDelta: m.delta
              });
              break;
            }
            case "tool-call": {
              p[m.toolCallId] = m.toolName;
              let w = f(m.toolCallId);
              m.invalid ? v.enqueue({
                type: "tool-input-error",
                toolCallId: m.toolCallId,
                toolName: m.toolName,
                input: m.input,
                ...m.providerExecuted != null ? { providerExecuted: m.providerExecuted } : {},
                ...m.providerMetadata != null ? { providerMetadata: m.providerMetadata } : {},
                ...w != null ? { dynamic: w } : {},
                errorText: c(m.error)
              }) : v.enqueue({
                type: "tool-input-available",
                toolCallId: m.toolCallId,
                toolName: m.toolName,
                input: m.input,
                ...m.providerExecuted != null ? { providerExecuted: m.providerExecuted } : {},
                ...m.providerMetadata != null ? { providerMetadata: m.providerMetadata } : {},
                ...w != null ? { dynamic: w } : {}
              });
              break;
            }
            case "tool-result": {
              let w = f(m.toolCallId);
              v.enqueue({
                type: "tool-output-available",
                toolCallId: m.toolCallId,
                output: m.output,
                ...m.providerExecuted != null ? { providerExecuted: m.providerExecuted } : {},
                ...m.preliminary != null ? { preliminary: m.preliminary } : {},
                ...w != null ? { dynamic: w } : {}
              });
              break;
            }
            case "tool-error": {
              let w = f(m.toolCallId);
              v.enqueue({
                type: "tool-output-error",
                toolCallId: m.toolCallId,
                errorText: c(m.error),
                ...m.providerExecuted != null ? { providerExecuted: m.providerExecuted } : {},
                ...w != null ? { dynamic: w } : {}
              });
              break;
            }
            case "error": {
              v.enqueue({
                type: "error",
                errorText: c(m.error)
              });
              break;
            }
            case "start-step": {
              v.enqueue({ type: "start-step" });
              break;
            }
            case "finish-step": {
              v.enqueue({ type: "finish-step" });
              break;
            }
            case "start": {
              a && v.enqueue({
                type: "start",
                ...b != null ? { messageMetadata: b } : {},
                ...d != null ? { messageId: d } : {}
              });
              break;
            }
            case "finish": {
              u && v.enqueue({
                type: "finish",
                finishReason: m.finishReason,
                ...b != null ? { messageMetadata: b } : {}
              });
              break;
            }
            case "abort": {
              v.enqueue(m);
              break;
            }
            case "tool-input-end":
              break;
            case "raw":
              break;
            default: {
              let w = $;
              throw new Error(`Unknown chunk type: ${w}`);
            }
          }
          b != null && $ !== "start" && $ !== "finish" && v.enqueue({
            type: "message-metadata",
            messageMetadata: b
          });
        }, "transform")
      })
    );
    return Er(
      h0({
        stream: h,
        messageId: d ?? t?.(),
        originalMessages: e,
        onFinish: n,
        onError: c
      })
    );
  }
  pipeUIMessageStreamToResponse(e, {
    originalMessages: t,
    generateMessageId: n,
    onFinish: o,
    messageMetadata: r,
    sendReasoning: i,
    sendSources: a,
    sendFinish: u,
    sendStart: c,
    onError: d,
    ...p
  } = {}) {
    v0({
      response: e,
      stream: this.toUIMessageStream({
        originalMessages: t,
        generateMessageId: n,
        onFinish: o,
        messageMetadata: r,
        sendReasoning: i,
        sendSources: a,
        sendFinish: u,
        sendStart: c,
        onError: d
      }),
      ...p
    });
  }
  pipeTextStreamToResponse(e, t) {
    M_({
      response: e,
      textStream: this.textStream,
      ...t
    });
  }
  toUIMessageStreamResponse({
    originalMessages: e,
    generateMessageId: t,
    onFinish: n,
    messageMetadata: o,
    sendReasoning: r,
    sendSources: i,
    sendFinish: a,
    sendStart: u,
    onError: c,
    ...d
  } = {}) {
    return c0({
      stream: this.toUIMessageStream({
        originalMessages: e,
        generateMessageId: t,
        onFinish: n,
        messageMetadata: o,
        sendReasoning: r,
        sendSources: i,
        sendFinish: a,
        sendStart: u,
        onError: c
      }),
      ...d
    });
  }
  toTextStreamResponse(e) {
    return D_({
      textStream: this.textStream,
      ...e
    });
  }
};
async function YR({
  model: e,
  value: t,
  providerOptions: n,
  maxRetries: o,
  abortSignal: r,
  headers: i,
  experimental_telemetry: a
}) {
  let u = $_(e), { maxRetries: c, retry: d } = Xn({
    maxRetries: o,
    abortSignal: r
  }), p = He(
    i ?? {},
    `ai/${ii}`
  ), f = Kn({
    model: u,
    telemetry: a,
    headers: p,
    settings: { maxRetries: c }
  }), h = Hn(a);
  return st({
    name: "ai.embed",
    attributes: ke({
      telemetry: a,
      attributes: {
        ...at({ operationId: "ai.embed", telemetry: a }),
        ...f,
        "ai.value": { input: /* @__PURE__ */ s(() => JSON.stringify(t), "input") }
      }
    }),
    tracer: h,
    fn: /* @__PURE__ */ s(async (m) => {
      let { embedding: v, usage: b, response: $, providerMetadata: w } = await d(
        () => (
          // nested spans to align with the embedMany telemetry data:
          st({
            name: "ai.embed.doEmbed",
            attributes: ke({
              telemetry: a,
              attributes: {
                ...at({
                  operationId: "ai.embed.doEmbed",
                  telemetry: a
                }),
                ...f,
                // specific settings that only make sense on the outer level:
                "ai.values": { input: /* @__PURE__ */ s(() => [JSON.stringify(t)], "input") }
              }
            }),
            tracer: h,
            fn: /* @__PURE__ */ s(async (I) => {
              var _;
              let x = await u.doEmbed({
                values: [t],
                abortSignal: r,
                headers: p,
                providerOptions: n
              }), C = x.embeddings[0], M = (_ = x.usage) != null ? _ : { tokens: NaN };
              return I.setAttributes(
                ke({
                  telemetry: a,
                  attributes: {
                    "ai.embeddings": {
                      output: /* @__PURE__ */ s(() => x.embeddings.map(
                        (S) => JSON.stringify(S)
                      ), "output")
                    },
                    "ai.usage.tokens": M.tokens
                  }
                })
              ), {
                embedding: C,
                usage: M,
                providerMetadata: x.providerMetadata,
                response: x.response
              };
            }, "fn")
          })
        )
      );
      return m.setAttributes(
        ke({
          telemetry: a,
          attributes: {
            "ai.embedding": { output: /* @__PURE__ */ s(() => JSON.stringify(v), "output") },
            "ai.usage.tokens": b.tokens
          }
        })
      ), new w0({
        value: t,
        embedding: v,
        usage: b,
        providerMetadata: w,
        response: $
      });
    }, "fn")
  });
}
s(YR, "embed");
var w0 = class {
  static {
    s(this, "DefaultEmbedResult");
  }
  constructor(e) {
    this.value = e.value, this.embedding = e.embedding, this.usage = e.usage, this.providerMetadata = e.providerMetadata, this.response = e.response;
  }
};
function Zy(e, t) {
  if (t <= 0)
    throw new Error("chunkSize must be greater than 0");
  let n = [];
  for (let o = 0; o < e.length; o += t)
    n.push(e.slice(o, o + t));
  return n;
}
s(Zy, "splitArray");
async function eC({
  model: e,
  values: t,
  maxParallelCalls: n = 1 / 0,
  maxRetries: o,
  abortSignal: r,
  headers: i,
  providerOptions: a,
  experimental_telemetry: u
}) {
  let c = $_(e), { maxRetries: d, retry: p } = Xn({
    maxRetries: o,
    abortSignal: r
  }), f = He(
    i ?? {},
    `ai/${ii}`
  ), h = Kn({
    model: c,
    telemetry: u,
    headers: f,
    settings: { maxRetries: d }
  }), m = Hn(u);
  return st({
    name: "ai.embedMany",
    attributes: ke({
      telemetry: u,
      attributes: {
        ...at({ operationId: "ai.embedMany", telemetry: u }),
        ...h,
        // specific settings that only make sense on the outer level:
        "ai.values": {
          input: /* @__PURE__ */ s(() => t.map((v) => JSON.stringify(v)), "input")
        }
      }
    }),
    tracer: m,
    fn: /* @__PURE__ */ s(async (v) => {
      var b;
      let [$, w] = await Promise.all([
        c.maxEmbeddingsPerCall,
        c.supportsParallelCalls
      ]);
      if ($ == null || $ === 1 / 0) {
        let { embeddings: T, usage: G, response: J, providerMetadata: ue } = await p(
          () => st({
            name: "ai.embedMany.doEmbed",
            attributes: ke({
              telemetry: u,
              attributes: {
                ...at({
                  operationId: "ai.embedMany.doEmbed",
                  telemetry: u
                }),
                ...h,
                // specific settings that only make sense on the outer level:
                "ai.values": {
                  input: /* @__PURE__ */ s(() => t.map((fe) => JSON.stringify(fe)), "input")
                }
              }
            }),
            tracer: m,
            fn: /* @__PURE__ */ s(async (fe) => {
              var Q;
              let te = await c.doEmbed({
                values: t,
                abortSignal: r,
                headers: f,
                providerOptions: a
              }), _e = te.embeddings, be = (Q = te.usage) != null ? Q : { tokens: NaN };
              return fe.setAttributes(
                ke({
                  telemetry: u,
                  attributes: {
                    "ai.embeddings": {
                      output: /* @__PURE__ */ s(() => _e.map(
                        (re) => JSON.stringify(re)
                      ), "output")
                    },
                    "ai.usage.tokens": be.tokens
                  }
                })
              ), {
                embeddings: _e,
                usage: be,
                providerMetadata: te.providerMetadata,
                response: te.response
              };
            }, "fn")
          })
        );
        return v.setAttributes(
          ke({
            telemetry: u,
            attributes: {
              "ai.embeddings": {
                output: /* @__PURE__ */ s(() => T.map((fe) => JSON.stringify(fe)), "output")
              },
              "ai.usage.tokens": G.tokens
            }
          })
        ), new Ly({
          values: t,
          embeddings: T,
          usage: G,
          providerMetadata: ue,
          responses: [J]
        });
      }
      let I = Zy(t, $), _ = [], x = [], C = 0, M, S = Zy(
        I,
        w ? n : 1
      );
      for (let T of S) {
        let G = await Promise.all(
          T.map((J) => p(() => st({
            name: "ai.embedMany.doEmbed",
            attributes: ke({
              telemetry: u,
              attributes: {
                ...at({
                  operationId: "ai.embedMany.doEmbed",
                  telemetry: u
                }),
                ...h,
                // specific settings that only make sense on the outer level:
                "ai.values": {
                  input: /* @__PURE__ */ s(() => J.map((ue) => JSON.stringify(ue)), "input")
                }
              }
            }),
            tracer: m,
            fn: /* @__PURE__ */ s(async (ue) => {
              var fe;
              let Q = await c.doEmbed({
                values: J,
                abortSignal: r,
                headers: f,
                providerOptions: a
              }), te = Q.embeddings, _e = (fe = Q.usage) != null ? fe : { tokens: NaN };
              return ue.setAttributes(
                ke({
                  telemetry: u,
                  attributes: {
                    "ai.embeddings": {
                      output: /* @__PURE__ */ s(() => te.map(
                        (be) => JSON.stringify(be)
                      ), "output")
                    },
                    "ai.usage.tokens": _e.tokens
                  }
                })
              ), {
                embeddings: te,
                usage: _e,
                providerMetadata: Q.providerMetadata,
                response: Q.response
              };
            }, "fn")
          })))
        );
        for (let J of G)
          if (_.push(...J.embeddings), x.push(J.response), C += J.usage.tokens, J.providerMetadata)
            if (!M)
              M = { ...J.providerMetadata };
            else
              for (let [ue, fe] of Object.entries(
                J.providerMetadata
              ))
                M[ue] = {
                  ...(b = M[ue]) != null ? b : {},
                  ...fe
                };
      }
      return v.setAttributes(
        ke({
          telemetry: u,
          attributes: {
            "ai.embeddings": {
              output: /* @__PURE__ */ s(() => _.map((T) => JSON.stringify(T)), "output")
            },
            "ai.usage.tokens": C
          }
        })
      ), new Ly({
        values: t,
        embeddings: _,
        usage: { tokens: C },
        providerMetadata: M,
        responses: x
      });
    }, "fn")
  });
}
s(eC, "embedMany");
var Ly = class {
  static {
    s(this, "DefaultEmbedManyResult");
  }
  constructor(e) {
    this.values = e.values, this.embeddings = e.embeddings, this.usage = e.usage, this.providerMetadata = e.providerMetadata, this.responses = e.responses;
  }
};
function k0(e) {
  let t = e.filter(
    (n) => n.type === "reasoning"
  );
  return t.length === 0 ? void 0 : t.map((n) => n.text).join(`
`);
}
s(k0, "extractReasoningContent");
var I0 = {
  type: "no-schema",
  jsonSchema: void 0,
  async validatePartialResult({ value: e, textDelta: t }) {
    return { success: !0, value: { partial: e, textDelta: t } };
  },
  async validateFinalResult(e, t) {
    return e === void 0 ? {
      success: !1,
      error: new Fr({
        message: "No object generated: response did not match schema.",
        text: t.text,
        response: t.response,
        usage: t.usage,
        finishReason: t.finishReason
      })
    } : { success: !0, value: e };
  },
  createElementStream() {
    throw new Ve({
      functionality: "element streams in no-schema mode"
    });
  }
}, S0 = /* @__PURE__ */ s((e) => ({
  type: "object",
  jsonSchema: e.jsonSchema,
  async validatePartialResult({ value: t, textDelta: n }) {
    return {
      success: !0,
      value: {
        // Note: currently no validation of partial results:
        partial: t,
        textDelta: n
      }
    };
  },
  async validateFinalResult(t) {
    return qe({ value: t, schema: e });
  },
  createElementStream() {
    throw new Ve({
      functionality: "element streams in object mode"
    });
  }
}), "objectOutputStrategy"), T0 = /* @__PURE__ */ s((e) => {
  let { $schema: t, ...n } = e.jsonSchema;
  return {
    type: "array",
    // wrap in object that contains array of elements, since most LLMs will not
    // be able to generate an array directly:
    // possible future optimization: use arrays directly when model supports grammar-guided generation
    jsonSchema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {
        elements: { type: "array", items: n }
      },
      required: ["elements"],
      additionalProperties: !1
    },
    async validatePartialResult({
      value: o,
      latestObject: r,
      isFirstDelta: i,
      isFinalDelta: a
    }) {
      var u;
      if (!Zo(o) || !fm(o.elements))
        return {
          success: !1,
          error: new Ge({
            value: o,
            cause: "value must be an object that contains an array of elements"
          })
        };
      let c = o.elements, d = [];
      for (let h = 0; h < c.length; h++) {
        let m = c[h], v = await qe({ value: m, schema: e });
        if (!(h === c.length - 1 && !a)) {
          if (!v.success)
            return v;
          d.push(v.value);
        }
      }
      let p = (u = r?.length) != null ? u : 0, f = "";
      return i && (f += "["), p > 0 && (f += ","), f += d.slice(p).map((h) => JSON.stringify(h)).join(","), a && (f += "]"), {
        success: !0,
        value: {
          partial: d,
          textDelta: f
        }
      };
    },
    async validateFinalResult(o) {
      if (!Zo(o) || !fm(o.elements))
        return {
          success: !1,
          error: new Ge({
            value: o,
            cause: "value must be an object that contains an array of elements"
          })
        };
      let r = o.elements;
      for (let i of r) {
        let a = await qe({ value: i, schema: e });
        if (!a.success)
          return a;
      }
      return { success: !0, value: r };
    },
    createElementStream(o) {
      let r = 0;
      return Er(
        o.pipeThrough(
          new TransformStream({
            transform(i, a) {
              switch (i.type) {
                case "object": {
                  let u = i.object;
                  for (; r < u.length; r++)
                    a.enqueue(u[r]);
                  break;
                }
                case "text-delta":
                case "finish":
                case "error":
                  break;
                default: {
                  let u = i;
                  throw new Error(
                    `Unsupported chunk type: ${u}`
                  );
                }
              }
            }
          })
        )
      );
    }
  };
}, "arrayOutputStrategy"), z0 = /* @__PURE__ */ s((e) => ({
  type: "enum",
  // wrap in object that contains result, since most LLMs will not
  // be able to generate an enum value directly:
  // possible future optimization: use enums directly when model supports top-level enums
  jsonSchema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
      result: { type: "string", enum: e }
    },
    required: ["result"],
    additionalProperties: !1
  },
  async validateFinalResult(t) {
    if (!Zo(t) || typeof t.result != "string")
      return {
        success: !1,
        error: new Ge({
          value: t,
          cause: 'value must be an object that contains a string in the "result" property.'
        })
      };
    let n = t.result;
    return e.includes(n) ? { success: !0, value: n } : {
      success: !1,
      error: new Ge({
        value: t,
        cause: "value must be a string in the enum"
      })
    };
  },
  async validatePartialResult({ value: t, textDelta: n }) {
    if (!Zo(t) || typeof t.result != "string")
      return {
        success: !1,
        error: new Ge({
          value: t,
          cause: 'value must be an object that contains a string in the "result" property.'
        })
      };
    let o = t.result, r = e.filter(
      (i) => i.startsWith(o)
    );
    return t.result.length === 0 || r.length === 0 ? {
      success: !1,
      error: new Ge({
        value: t,
        cause: "value must be a string in the enum"
      })
    } : {
      success: !0,
      value: {
        partial: r.length > 1 ? o : r[0],
        textDelta: n
      }
    };
  },
  createElementStream() {
    throw new Ve({
      functionality: "element streams in enum mode"
    });
  }
}), "enumOutputStrategy");
function J_({
  output: e,
  schema: t,
  enumValues: n
}) {
  switch (e) {
    case "object":
      return S0(Jt(t));
    case "array":
      return T0(Jt(t));
    case "enum":
      return z0(n);
    case "no-schema":
      return I0;
    default: {
      let o = e;
      throw new Error(`Unsupported output: ${o}`);
    }
  }
}
s(J_, "getOutputStrategy");
async function Fy(e, t, n) {
  let o = await St({ text: e });
  if (!o.success)
    throw new Fr({
      message: "No object generated: could not parse the response.",
      cause: o.error,
      text: e,
      response: n.response,
      usage: n.usage,
      finishReason: n.finishReason
    });
  let r = await t.validateFinalResult(
    o.value,
    {
      text: e,
      response: n.response,
      usage: n.usage
    }
  );
  if (!r.success)
    throw new Fr({
      message: "No object generated: response did not match schema.",
      cause: r.error,
      text: e,
      response: n.response,
      usage: n.usage,
      finishReason: n.finishReason
    });
  return r.value;
}
s(Fy, "parseAndValidateObjectResult");
async function B_(e, t, n, o) {
  try {
    return await Fy(e, t, o);
  } catch (r) {
    if (n != null && Fr.isInstance(r) && (Ur.isInstance(r.cause) || Ge.isInstance(r.cause))) {
      let i = await n({
        text: e,
        error: r.cause
      });
      if (i === null)
        throw r;
      return await Fy(
        i,
        t,
        o
      );
    }
    throw r;
  }
}
s(B_, "parseAndValidateObjectResultWithRepair");
function G_({
  output: e,
  schema: t,
  schemaName: n,
  schemaDescription: o,
  enumValues: r
}) {
  if (e != null && e !== "object" && e !== "array" && e !== "enum" && e !== "no-schema")
    throw new Ae({
      parameter: "output",
      value: e,
      message: "Invalid output type."
    });
  if (e === "no-schema") {
    if (t != null)
      throw new Ae({
        parameter: "schema",
        value: t,
        message: "Schema is not supported for no-schema output."
      });
    if (o != null)
      throw new Ae({
        parameter: "schemaDescription",
        value: o,
        message: "Schema description is not supported for no-schema output."
      });
    if (n != null)
      throw new Ae({
        parameter: "schemaName",
        value: n,
        message: "Schema name is not supported for no-schema output."
      });
    if (r != null)
      throw new Ae({
        parameter: "enumValues",
        value: r,
        message: "Enum values are not supported for no-schema output."
      });
  }
  if (e === "object") {
    if (t == null)
      throw new Ae({
        parameter: "schema",
        value: t,
        message: "Schema is required for object output."
      });
    if (r != null)
      throw new Ae({
        parameter: "enumValues",
        value: r,
        message: "Enum values are not supported for object output."
      });
  }
  if (e === "array") {
    if (t == null)
      throw new Ae({
        parameter: "schema",
        value: t,
        message: "Element schema is required for array output."
      });
    if (r != null)
      throw new Ae({
        parameter: "enumValues",
        value: r,
        message: "Enum values are not supported for array output."
      });
  }
  if (e === "enum") {
    if (t != null)
      throw new Ae({
        parameter: "schema",
        value: t,
        message: "Schema is not supported for enum output."
      });
    if (o != null)
      throw new Ae({
        parameter: "schemaDescription",
        value: o,
        message: "Schema description is not supported for enum output."
      });
    if (n != null)
      throw new Ae({
        parameter: "schemaName",
        value: n,
        message: "Schema name is not supported for enum output."
      });
    if (r == null)
      throw new Ae({
        parameter: "enumValues",
        value: r,
        message: "Enum values are required for enum output."
      });
    for (let i of r)
      if (typeof i != "string")
        throw new Ae({
          parameter: "enumValues",
          value: i,
          message: "Enum values must be strings."
        });
  }
}
s(G_, "validateObjectGenerationInput");
var E0 = sr({ prefix: "aiobj", size: 24 });
async function aC(e) {
  let {
    model: t,
    output: n = "object",
    system: o,
    prompt: r,
    messages: i,
    maxRetries: a,
    abortSignal: u,
    headers: c,
    experimental_repairText: d,
    experimental_telemetry: p,
    experimental_download: f,
    providerOptions: h,
    _internal: {
      generateId: m = E0,
      currentDate: v = /* @__PURE__ */ s(() => /* @__PURE__ */ new Date(), "currentDate")
    } = {},
    ...b
  } = e, $ = Wn(t), w = "enum" in e ? e.enum : void 0, {
    schema: I,
    schemaDescription: _,
    schemaName: x
  } = "schema" in e ? e : {};
  G_({
    output: n,
    schema: I,
    schemaName: x,
    schemaDescription: _,
    enumValues: w
  });
  let { maxRetries: C, retry: M } = Xn({
    maxRetries: a,
    abortSignal: u
  }), S = J_({
    output: n,
    schema: I,
    enumValues: w
  }), T = Vr(b), G = He(
    c ?? {},
    `ai/${ii}`
  ), J = Kn({
    model: $,
    telemetry: p,
    headers: G,
    settings: { ...T, maxRetries: C }
  }), ue = Hn(p);
  try {
    return await st({
      name: "ai.generateObject",
      attributes: ke({
        telemetry: p,
        attributes: {
          ...at({
            operationId: "ai.generateObject",
            telemetry: p
          }),
          ...J,
          // specific settings that only make sense on the outer level:
          "ai.prompt": {
            input: /* @__PURE__ */ s(() => JSON.stringify({ system: o, prompt: r, messages: i }), "input")
          },
          "ai.schema": S.jsonSchema != null ? { input: /* @__PURE__ */ s(() => JSON.stringify(S.jsonSchema), "input") } : void 0,
          "ai.schema.name": x,
          "ai.schema.description": _,
          "ai.settings.output": S.type
        }
      }),
      tracer: ue,
      fn: /* @__PURE__ */ s(async (fe) => {
        var Q;
        let te, _e, be, re, je, xe, ye, ce, ae = await hs({
          system: o,
          prompt: r,
          messages: i
        }), ge = await gs({
          prompt: ae,
          supportedUrls: await $.supportedUrls,
          download: f
        }), ve = await M(
          () => st({
            name: "ai.generateObject.doGenerate",
            attributes: ke({
              telemetry: p,
              attributes: {
                ...at({
                  operationId: "ai.generateObject.doGenerate",
                  telemetry: p
                }),
                ...J,
                "ai.prompt.messages": {
                  input: /* @__PURE__ */ s(() => ys(ge), "input")
                },
                // standardized gen-ai llm span attributes:
                "gen_ai.system": $.provider,
                "gen_ai.request.model": $.modelId,
                "gen_ai.request.frequency_penalty": T.frequencyPenalty,
                "gen_ai.request.max_tokens": T.maxOutputTokens,
                "gen_ai.request.presence_penalty": T.presencePenalty,
                "gen_ai.request.temperature": T.temperature,
                "gen_ai.request.top_k": T.topK,
                "gen_ai.request.top_p": T.topP
              }
            }),
            tracer: ue,
            fn: /* @__PURE__ */ s(async (g) => {
              var L, B, Le, $e, Ue, mt, Ee, de;
              let X = await $.doGenerate({
                responseFormat: {
                  type: "json",
                  schema: S.jsonSchema,
                  name: x,
                  description: _
                },
                ...Vr(b),
                prompt: ge,
                providerOptions: h,
                abortSignal: u,
                headers: G
              }), W = {
                id: (B = (L = X.response) == null ? void 0 : L.id) != null ? B : m(),
                timestamp: ($e = (Le = X.response) == null ? void 0 : Le.timestamp) != null ? $e : v(),
                modelId: (mt = (Ue = X.response) == null ? void 0 : Ue.modelId) != null ? mt : $.modelId,
                headers: (Ee = X.response) == null ? void 0 : Ee.headers,
                body: (de = X.response) == null ? void 0 : de.body
              }, F = Wm(X.content), Ze = k0(X.content);
              if (F === void 0)
                throw new Fr({
                  message: "No object generated: the model did not return a response.",
                  response: W,
                  usage: X.usage,
                  finishReason: X.finishReason
                });
              return g.setAttributes(
                ke({
                  telemetry: p,
                  attributes: {
                    "ai.response.finishReason": X.finishReason,
                    "ai.response.object": { output: /* @__PURE__ */ s(() => F, "output") },
                    "ai.response.id": W.id,
                    "ai.response.model": W.modelId,
                    "ai.response.timestamp": W.timestamp.toISOString(),
                    "ai.response.providerMetadata": JSON.stringify(
                      X.providerMetadata
                    ),
                    // TODO rename telemetry attributes to inputTokens and outputTokens
                    "ai.usage.promptTokens": X.usage.inputTokens,
                    "ai.usage.completionTokens": X.usage.outputTokens,
                    // standardized gen-ai llm span attributes:
                    "gen_ai.response.finish_reasons": [X.finishReason],
                    "gen_ai.response.id": W.id,
                    "gen_ai.response.model": W.modelId,
                    "gen_ai.usage.input_tokens": X.usage.inputTokens,
                    "gen_ai.usage.output_tokens": X.usage.outputTokens
                  }
                })
              ), {
                ...X,
                objectText: F,
                reasoning: Ze,
                responseData: W
              };
            }, "fn")
          })
        );
        te = ve.objectText, _e = ve.finishReason, be = ve.usage, re = ve.warnings, ye = ve.providerMetadata, xe = (Q = ve.request) != null ? Q : {}, je = ve.responseData, ce = ve.reasoning, fs(re);
        let Y = await B_(
          te,
          S,
          d,
          {
            response: je,
            usage: be,
            finishReason: _e
          }
        );
        return fe.setAttributes(
          ke({
            telemetry: p,
            attributes: {
              "ai.response.finishReason": _e,
              "ai.response.object": {
                output: /* @__PURE__ */ s(() => JSON.stringify(Y), "output")
              },
              "ai.response.providerMetadata": JSON.stringify(
                ye
              ),
              // TODO rename telemetry attributes to inputTokens and outputTokens
              "ai.usage.promptTokens": be.inputTokens,
              "ai.usage.completionTokens": be.outputTokens
            }
          })
        ), new O0({
          object: Y,
          reasoning: ce,
          finishReason: _e,
          usage: be,
          warnings: re,
          request: xe,
          response: je,
          providerMetadata: ye
        });
      }, "fn")
    });
  } catch (fe) {
    throw vs(fe);
  }
}
s(aC, "generateObject");
var O0 = class {
  static {
    s(this, "DefaultGenerateObjectResult");
  }
  constructor(e) {
    this.object = e.object, this.finishReason = e.finishReason, this.usage = e.usage, this.warnings = e.warnings, this.providerMetadata = e.providerMetadata, this.response = e.response, this.request = e.request, this.reasoning = e.reasoning;
  }
  toJsonResponse(e) {
    var t;
    return new Response(JSON.stringify(this.object), {
      status: (t = e?.status) != null ? t : 200,
      headers: ai(e?.headers, {
        "content-type": "application/json; charset=utf-8"
      })
    });
  }
};
function ms(e, t) {
  if (e === t)
    return !0;
  if (e == null || t == null)
    return !1;
  if (typeof e != "object" && typeof t != "object")
    return e === t;
  if (e.constructor !== t.constructor)
    return !1;
  if (e instanceof Date && t instanceof Date)
    return e.getTime() === t.getTime();
  if (Array.isArray(e)) {
    if (e.length !== t.length)
      return !1;
    for (let r = 0; r < e.length; r++)
      if (!ms(e[r], t[r]))
        return !1;
    return !0;
  }
  let n = Object.keys(e), o = Object.keys(t);
  if (n.length !== o.length)
    return !1;
  for (let r of n)
    if (!o.includes(r) || !ms(e[r], t[r]))
      return !1;
  return !0;
}
s(ms, "isDeepEqualData");
var j0 = sr({ prefix: "aiobj", size: 24 });
function lC(e) {
  let {
    model: t,
    output: n = "object",
    system: o,
    prompt: r,
    messages: i,
    maxRetries: a,
    abortSignal: u,
    headers: c,
    experimental_repairText: d,
    experimental_telemetry: p,
    experimental_download: f,
    providerOptions: h,
    onError: m = /* @__PURE__ */ s(({ error: T }) => {
      console.error(T);
    }, "onError"),
    onFinish: v,
    _internal: {
      generateId: b = j0,
      currentDate: $ = /* @__PURE__ */ s(() => /* @__PURE__ */ new Date(), "currentDate"),
      now: w = q_
    } = {},
    ...I
  } = e, _ = "enum" in e && e.enum ? e.enum : void 0, {
    schema: x,
    schemaDescription: C,
    schemaName: M
  } = "schema" in e ? e : {};
  G_({
    output: n,
    schema: x,
    schemaName: M,
    schemaDescription: C,
    enumValues: _
  });
  let S = J_({
    output: n,
    schema: x,
    enumValues: _
  });
  return new P0({
    model: t,
    telemetry: p,
    headers: c,
    settings: I,
    maxRetries: a,
    abortSignal: u,
    outputStrategy: S,
    system: o,
    prompt: r,
    messages: i,
    schemaName: M,
    schemaDescription: C,
    providerOptions: h,
    repairText: d,
    onError: m,
    onFinish: v,
    download: f,
    generateId: b,
    currentDate: $,
    now: w
  });
}
s(lC, "streamObject");
var P0 = class {
  static {
    s(this, "DefaultStreamObjectResult");
  }
  constructor({
    model: e,
    headers: t,
    telemetry: n,
    settings: o,
    maxRetries: r,
    abortSignal: i,
    outputStrategy: a,
    system: u,
    prompt: c,
    messages: d,
    schemaName: p,
    schemaDescription: f,
    providerOptions: h,
    repairText: m,
    onError: v,
    onFinish: b,
    download: $,
    generateId: w,
    currentDate: I,
    now: _
  }) {
    this._object = new xt(), this._usage = new xt(), this._providerMetadata = new xt(), this._warnings = new xt(), this._request = new xt(), this._response = new xt(), this._finishReason = new xt();
    let x = Wn(e), { maxRetries: C, retry: M } = Xn({
      maxRetries: r,
      abortSignal: i
    }), S = Vr(o), T = Kn({
      model: x,
      telemetry: n,
      headers: t,
      settings: { ...S, maxRetries: C }
    }), G = Hn(n), J = this, ue = V_(), fe = new TransformStream({
      transform(Q, te) {
        te.enqueue(Q), Q.type === "error" && v({ error: vs(Q.error) });
      }
    });
    this.baseStream = ue.stream.pipeThrough(fe), st({
      name: "ai.streamObject",
      attributes: ke({
        telemetry: n,
        attributes: {
          ...at({
            operationId: "ai.streamObject",
            telemetry: n
          }),
          ...T,
          // specific settings that only make sense on the outer level:
          "ai.prompt": {
            input: /* @__PURE__ */ s(() => JSON.stringify({ system: u, prompt: c, messages: d }), "input")
          },
          "ai.schema": a.jsonSchema != null ? { input: /* @__PURE__ */ s(() => JSON.stringify(a.jsonSchema), "input") } : void 0,
          "ai.schema.name": p,
          "ai.schema.description": f,
          "ai.settings.output": a.type
        }
      }),
      tracer: G,
      endWhenDone: !1,
      fn: /* @__PURE__ */ s(async (Q) => {
        let te = await hs({
          system: u,
          prompt: c,
          messages: d
        }), _e = {
          responseFormat: {
            type: "json",
            schema: a.jsonSchema,
            name: p,
            description: f
          },
          ...Vr(o),
          prompt: await gs({
            prompt: te,
            supportedUrls: await x.supportedUrls,
            download: $
          }),
          providerOptions: h,
          abortSignal: i,
          headers: t,
          includeRawChunks: !1
        }, be = {
          transform: /* @__PURE__ */ s((W, F) => {
            switch (W.type) {
              case "text-delta":
                F.enqueue(W.delta);
                break;
              case "response-metadata":
              case "finish":
              case "error":
              case "stream-start":
                F.enqueue(W);
                break;
            }
          }, "transform")
        }, {
          result: { stream: re, response: je, request: xe },
          doStreamSpan: ye,
          startTimestampMs: ce
        } = await M(
          () => st({
            name: "ai.streamObject.doStream",
            attributes: ke({
              telemetry: n,
              attributes: {
                ...at({
                  operationId: "ai.streamObject.doStream",
                  telemetry: n
                }),
                ...T,
                "ai.prompt.messages": {
                  input: /* @__PURE__ */ s(() => ys(_e.prompt), "input")
                },
                // standardized gen-ai llm span attributes:
                "gen_ai.system": x.provider,
                "gen_ai.request.model": x.modelId,
                "gen_ai.request.frequency_penalty": S.frequencyPenalty,
                "gen_ai.request.max_tokens": S.maxOutputTokens,
                "gen_ai.request.presence_penalty": S.presencePenalty,
                "gen_ai.request.temperature": S.temperature,
                "gen_ai.request.top_k": S.topK,
                "gen_ai.request.top_p": S.topP
              }
            }),
            tracer: G,
            endWhenDone: !1,
            fn: /* @__PURE__ */ s(async (W) => ({
              startTimestampMs: _(),
              doStreamSpan: W,
              result: await x.doStream(_e)
            }), "fn")
          })
        );
        J._request.resolve(xe ?? {});
        let ae, ge = {
          inputTokens: void 0,
          outputTokens: void 0,
          totalTokens: void 0
        }, ve, Y, g, L, B = "", Le = "", $e = {
          id: w(),
          timestamp: I(),
          modelId: x.modelId
        }, Ue, mt, Ee = !0, de = !0, X = re.pipeThrough(new TransformStream(be)).pipeThrough(
          new TransformStream({
            async transform(W, F) {
              var Ze, ft, U;
              if (typeof W == "object" && W.type === "stream-start") {
                ae = W.warnings;
                return;
              }
              if (Ee) {
                let pe = _() - ce;
                Ee = !1, ye.addEvent("ai.stream.firstChunk", {
                  "ai.stream.msToFirstChunk": pe
                }), ye.setAttributes({
                  "ai.stream.msToFirstChunk": pe
                });
              }
              if (typeof W == "string") {
                B += W, Le += W;
                let { value: pe, state: Ct } = await Xm(B);
                if (pe !== void 0 && !ms(Ue, pe)) {
                  let we = await a.validatePartialResult({
                    value: pe,
                    textDelta: Le,
                    latestObject: mt,
                    isFirstDelta: de,
                    isFinalDelta: Ct === "successful-parse"
                  });
                  we.success && !ms(
                    mt,
                    we.value.partial
                  ) && (Ue = pe, mt = we.value.partial, F.enqueue({
                    type: "object",
                    object: mt
                  }), F.enqueue({
                    type: "text-delta",
                    textDelta: we.value.textDelta
                  }), Le = "", de = !1);
                }
                return;
              }
              switch (W.type) {
                case "response-metadata": {
                  $e = {
                    id: (Ze = W.id) != null ? Ze : $e.id,
                    timestamp: (ft = W.timestamp) != null ? ft : $e.timestamp,
                    modelId: (U = W.modelId) != null ? U : $e.modelId
                  };
                  break;
                }
                case "finish": {
                  Le !== "" && F.enqueue({ type: "text-delta", textDelta: Le }), ve = W.finishReason, ge = W.usage, Y = W.providerMetadata, F.enqueue({
                    ...W,
                    usage: ge,
                    response: $e
                  }), fs(ae ?? []), J._usage.resolve(ge), J._providerMetadata.resolve(Y), J._warnings.resolve(ae), J._response.resolve({
                    ...$e,
                    headers: je?.headers
                  }), J._finishReason.resolve(ve ?? "unknown");
                  try {
                    g = await B_(
                      B,
                      a,
                      m,
                      {
                        response: $e,
                        usage: ge,
                        finishReason: ve
                      }
                    ), J._object.resolve(g);
                  } catch (pe) {
                    L = pe, J._object.reject(pe);
                  }
                  break;
                }
                default: {
                  F.enqueue(W);
                  break;
                }
              }
            },
            // invoke onFinish callback and resolve toolResults promise when the stream is about to close:
            async flush(W) {
              try {
                let F = ge ?? {
                  promptTokens: NaN,
                  completionTokens: NaN,
                  totalTokens: NaN
                };
                ye.setAttributes(
                  ke({
                    telemetry: n,
                    attributes: {
                      "ai.response.finishReason": ve,
                      "ai.response.object": {
                        output: /* @__PURE__ */ s(() => JSON.stringify(g), "output")
                      },
                      "ai.response.id": $e.id,
                      "ai.response.model": $e.modelId,
                      "ai.response.timestamp": $e.timestamp.toISOString(),
                      "ai.response.providerMetadata": JSON.stringify(Y),
                      "ai.usage.inputTokens": F.inputTokens,
                      "ai.usage.outputTokens": F.outputTokens,
                      "ai.usage.totalTokens": F.totalTokens,
                      "ai.usage.reasoningTokens": F.reasoningTokens,
                      "ai.usage.cachedInputTokens": F.cachedInputTokens,
                      // standardized gen-ai llm span attributes:
                      "gen_ai.response.finish_reasons": [ve],
                      "gen_ai.response.id": $e.id,
                      "gen_ai.response.model": $e.modelId,
                      "gen_ai.usage.input_tokens": F.inputTokens,
                      "gen_ai.usage.output_tokens": F.outputTokens
                    }
                  })
                ), ye.end(), Q.setAttributes(
                  ke({
                    telemetry: n,
                    attributes: {
                      "ai.usage.inputTokens": F.inputTokens,
                      "ai.usage.outputTokens": F.outputTokens,
                      "ai.usage.totalTokens": F.totalTokens,
                      "ai.usage.reasoningTokens": F.reasoningTokens,
                      "ai.usage.cachedInputTokens": F.cachedInputTokens,
                      "ai.response.object": {
                        output: /* @__PURE__ */ s(() => JSON.stringify(g), "output")
                      },
                      "ai.response.providerMetadata": JSON.stringify(Y)
                    }
                  })
                ), await b?.({
                  usage: F,
                  object: g,
                  error: L,
                  response: {
                    ...$e,
                    headers: je?.headers
                  },
                  warnings: ae,
                  providerMetadata: Y
                });
              } catch (F) {
                W.enqueue({ type: "error", error: F });
              } finally {
                Q.end();
              }
            }
          })
        );
        ue.addStream(X);
      }, "fn")
    }).catch((Q) => {
      ue.addStream(
        new ReadableStream({
          start(te) {
            te.enqueue({ type: "error", error: Q }), te.close();
          }
        })
      );
    }).finally(() => {
      ue.close();
    }), this.outputStrategy = a;
  }
  get object() {
    return this._object.promise;
  }
  get usage() {
    return this._usage.promise;
  }
  get providerMetadata() {
    return this._providerMetadata.promise;
  }
  get warnings() {
    return this._warnings.promise;
  }
  get request() {
    return this._request.promise;
  }
  get response() {
    return this._response.promise;
  }
  get finishReason() {
    return this._finishReason.promise;
  }
  get partialObjectStream() {
    return Er(
      this.baseStream.pipeThrough(
        new TransformStream({
          transform(e, t) {
            switch (e.type) {
              case "object":
                t.enqueue(e.object);
                break;
              case "text-delta":
              case "finish":
              case "error":
                break;
              default: {
                let n = e;
                throw new Error(`Unsupported chunk type: ${n}`);
              }
            }
          }
        })
      )
    );
  }
  get elementStream() {
    return this.outputStrategy.createElementStream(this.baseStream);
  }
  get textStream() {
    return Er(
      this.baseStream.pipeThrough(
        new TransformStream({
          transform(e, t) {
            switch (e.type) {
              case "text-delta":
                t.enqueue(e.textDelta);
                break;
              case "object":
              case "finish":
              case "error":
                break;
              default: {
                let n = e;
                throw new Error(`Unsupported chunk type: ${n}`);
              }
            }
          }
        })
      )
    );
  }
  get fullStream() {
    return Er(this.baseStream);
  }
  pipeTextStreamToResponse(e, t) {
    M_({
      response: e,
      textStream: this.textStream,
      ...t
    });
  }
  toTextStreamResponse(e) {
    return D_({
      textStream: this.textStream,
      ...e
    });
  }
};
var N0 = {};
rS(N0, {
  object: /* @__PURE__ */ s(() => R0, "object"),
  text: /* @__PURE__ */ s(() => A0, "text")
});
var A0 = /* @__PURE__ */ s(() => ({
  type: "text",
  responseFormat: { type: "text" },
  async parsePartial({ text: e }) {
    return { partial: e };
  },
  async parseOutput({ text: e }) {
    return e;
  }
}), "text"), R0 = /* @__PURE__ */ s(({
  schema: e
}) => {
  let t = Jt(e);
  return {
    type: "object",
    responseFormat: {
      type: "json",
      schema: t.jsonSchema
    },
    async parsePartial({ text: n }) {
      let o = await Xm(n);
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
      let r = await St({ text: n });
      if (!r.success)
        throw new Fr({
          message: "No object generated: could not parse the response.",
          cause: r.error,
          text: n,
          response: o.response,
          usage: o.usage,
          finishReason: o.finishReason
        });
      let i = await qe({
        value: r.value,
        schema: t
      });
      if (!i.success)
        throw new Fr({
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
var C0 = {
  word: /\S+\s+/m,
  line: /\n+/m
};
function pC({
  delayInMs: e = 10,
  chunking: t = "word",
  _internal: { delay: n = ts } = {}
} = {}) {
  let o;
  if (typeof t == "function")
    o = /* @__PURE__ */ s((r) => {
      let i = t(r);
      if (i == null)
        return null;
      if (!i.length)
        throw new Error("Chunking function must return a non-empty string.");
      if (!r.startsWith(i))
        throw new Error(
          `Chunking function must return a match that is a prefix of the buffer. Received: "${i}" expected to start with "${r}"`
        );
      return i;
    }, "detectChunk");
  else {
    let r = typeof t == "string" ? C0[t] : t;
    if (r == null)
      throw new In({
        argument: "chunking",
        message: `Chunking must be "word" or "line" or a RegExp. Received: ${t}`
      });
    o = /* @__PURE__ */ s((i) => {
      let a = r.exec(i);
      return a ? i.slice(0, a.index) + a?.[0] : null;
    }, "detectChunk");
  }
  return () => {
    let r = "", i = "";
    return new TransformStream({
      async transform(a, u) {
        if (a.type !== "text-delta") {
          r.length > 0 && (u.enqueue({ type: "text-delta", text: r, id: i }), r = ""), u.enqueue(a);
          return;
        }
        a.id !== i && r.length > 0 && (u.enqueue({ type: "text-delta", text: r, id: i }), r = ""), r += a.text, i = a.id;
        let c;
        for (; (c = o(r)) != null; )
          u.enqueue({ type: "text-delta", text: c, id: i }), r = r.slice(c.length), await n(e);
      }
    });
  };
}
s(pC, "smoothStream");
var D0 = "AI_NoSuchProviderError", U0 = `vercel.ai.error.${D0}`, M0 = Symbol.for(U0), Z0;
Z0 = M0;
var gC = ie(
  () => Z(
    l.array(
      l.object({
        id: l.string(),
        role: l.enum(["system", "user", "assistant"]),
        metadata: l.unknown().optional(),
        parts: l.array(
          l.union([
            l.object({
              type: l.literal("text"),
              text: l.string(),
              state: l.enum(["streaming", "done"]).optional(),
              providerMetadata: he.optional()
            }),
            l.object({
              type: l.literal("reasoning"),
              text: l.string(),
              state: l.enum(["streaming", "done"]).optional(),
              providerMetadata: he.optional()
            }),
            l.object({
              type: l.literal("source-url"),
              sourceId: l.string(),
              url: l.string(),
              title: l.string().optional(),
              providerMetadata: he.optional()
            }),
            l.object({
              type: l.literal("source-document"),
              sourceId: l.string(),
              mediaType: l.string(),
              title: l.string(),
              filename: l.string().optional(),
              providerMetadata: he.optional()
            }),
            l.object({
              type: l.literal("file"),
              mediaType: l.string(),
              filename: l.string().optional(),
              url: l.string(),
              providerMetadata: he.optional()
            }),
            l.object({
              type: l.literal("step-start")
            }),
            l.object({
              type: l.string().startsWith("data-"),
              id: l.string().optional(),
              data: l.unknown()
            }),
            l.object({
              type: l.literal("dynamic-tool"),
              toolName: l.string(),
              toolCallId: l.string(),
              state: l.literal("input-streaming"),
              input: l.unknown().optional(),
              providerExecuted: l.boolean().optional(),
              output: l.never().optional(),
              errorText: l.never().optional()
            }),
            l.object({
              type: l.literal("dynamic-tool"),
              toolName: l.string(),
              toolCallId: l.string(),
              state: l.literal("input-available"),
              input: l.unknown(),
              providerExecuted: l.boolean().optional(),
              output: l.never().optional(),
              errorText: l.never().optional(),
              callProviderMetadata: he.optional()
            }),
            l.object({
              type: l.literal("dynamic-tool"),
              toolName: l.string(),
              toolCallId: l.string(),
              state: l.literal("output-available"),
              input: l.unknown(),
              providerExecuted: l.boolean().optional(),
              output: l.unknown(),
              errorText: l.never().optional(),
              callProviderMetadata: he.optional(),
              preliminary: l.boolean().optional()
            }),
            l.object({
              type: l.literal("dynamic-tool"),
              toolName: l.string(),
              toolCallId: l.string(),
              state: l.literal("output-error"),
              input: l.unknown(),
              providerExecuted: l.boolean().optional(),
              output: l.never().optional(),
              errorText: l.string(),
              callProviderMetadata: he.optional()
            }),
            l.object({
              type: l.string().startsWith("tool-"),
              toolCallId: l.string(),
              state: l.literal("input-streaming"),
              providerExecuted: l.boolean().optional(),
              input: l.unknown().optional(),
              output: l.never().optional(),
              errorText: l.never().optional(),
              approval: l.never().optional()
            }),
            l.object({
              type: l.string().startsWith("tool-"),
              toolCallId: l.string(),
              state: l.literal("input-available"),
              providerExecuted: l.boolean().optional(),
              input: l.unknown(),
              output: l.never().optional(),
              errorText: l.never().optional(),
              callProviderMetadata: he.optional(),
              approval: l.never().optional()
            }),
            l.object({
              type: l.string().startsWith("tool-"),
              toolCallId: l.string(),
              state: l.literal("approval-requested"),
              input: l.unknown(),
              providerExecuted: l.boolean().optional(),
              output: l.never().optional(),
              errorText: l.never().optional(),
              callProviderMetadata: he.optional(),
              approval: l.object({
                id: l.string(),
                approved: l.never().optional(),
                reason: l.never().optional()
              })
            }),
            l.object({
              type: l.string().startsWith("tool-"),
              toolCallId: l.string(),
              state: l.literal("approval-responded"),
              input: l.unknown(),
              providerExecuted: l.boolean().optional(),
              output: l.never().optional(),
              errorText: l.never().optional(),
              callProviderMetadata: he.optional(),
              approval: l.object({
                id: l.string(),
                approved: l.boolean(),
                reason: l.string().optional()
              })
            }),
            l.object({
              type: l.string().startsWith("tool-"),
              toolCallId: l.string(),
              state: l.literal("output-available"),
              providerExecuted: l.boolean().optional(),
              input: l.unknown(),
              output: l.unknown(),
              errorText: l.never().optional(),
              callProviderMetadata: he.optional(),
              preliminary: l.boolean().optional(),
              approval: l.object({
                id: l.string(),
                approved: l.literal(!0),
                reason: l.string().optional()
              }).optional()
            }),
            l.object({
              type: l.string().startsWith("tool-"),
              toolCallId: l.string(),
              state: l.literal("output-error"),
              providerExecuted: l.boolean().optional(),
              input: l.unknown(),
              output: l.never().optional(),
              errorText: l.string(),
              callProviderMetadata: he.optional(),
              approval: l.object({
                id: l.string(),
                approved: l.literal(!0),
                reason: l.string().optional()
              }).optional()
            }),
            l.object({
              type: l.string().startsWith("tool-"),
              toolCallId: l.string(),
              state: l.literal("output-denied"),
              providerExecuted: l.boolean().optional(),
              input: l.unknown(),
              output: l.never().optional(),
              errorText: l.never().optional(),
              callProviderMetadata: he.optional(),
              approval: l.object({
                id: l.string(),
                approved: l.literal(!1),
                reason: l.string().optional()
              })
            })
          ])
        ).nonempty("Message must contain at least one part")
      })
    ).nonempty("Messages array must not be empty")
  )
);

// node_modules/@ai-sdk/openai/dist/index.mjs
var Qm = l.object({
  error: l.object({
    message: l.string(),
    // The additional information below is handled loosely to support
    // OpenAI-compatible providers that have slightly different error
    // responses:
    type: l.string().nullish(),
    param: l.any().nullish(),
    code: l.union([l.string(), l.number()]).nullish()
  })
}), Bt = zt({
  errorSchema: Qm,
  errorToMessage: /* @__PURE__ */ s((e) => e.error.message, "errorToMessage")
});
function nb(e) {
  let t = e.startsWith("o3") || e.startsWith("o4-mini") || e.startsWith("gpt-5") && !e.startsWith("gpt-5-chat"), n = e.startsWith("gpt-4") || e.startsWith("gpt-5-mini") || e.startsWith("gpt-5") && !e.startsWith("gpt-5-nano") && !e.startsWith("gpt-5-chat") || e.startsWith("o3") || e.startsWith("o4-mini"), o = !(e.startsWith("gpt-3") || e.startsWith("gpt-4") || e.startsWith("chatgpt-4o") || e.startsWith("gpt-5-chat")), r = e.startsWith("gpt-5.1") || e.startsWith("gpt-5.2");
  return {
    supportsFlexProcessing: t,
    supportsPriorityProcessing: n,
    isReasoningModel: o,
    systemMessageMode: o ? "developer" : "system",
    supportsNonReasoningParameters: r
  };
}
s(nb, "getOpenAILanguageModelCapabilities");
function L0({
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
                  let f = a.mediaType === "image/*" ? "image/jpeg" : a.mediaType;
                  return {
                    type: "image_url",
                    image_url: {
                      url: a.data instanceof URL ? a.data.toString() : `data:${f};base64,${Sr(a.data)}`,
                      // OpenAI specific extension: image detail
                      detail: (d = (c = a.providerOptions) == null ? void 0 : c.openai) == null ? void 0 : d.imageDetail
                    }
                  };
                } else if (a.mediaType.startsWith("audio/")) {
                  if (a.data instanceof URL)
                    throw new Ve({
                      functionality: "audio file parts with URLs"
                    });
                  switch (a.mediaType) {
                    case "audio/wav":
                      return {
                        type: "input_audio",
                        input_audio: {
                          data: Sr(a.data),
                          format: "wav"
                        }
                      };
                    case "audio/mp3":
                    case "audio/mpeg":
                      return {
                        type: "input_audio",
                        input_audio: {
                          data: Sr(a.data),
                          format: "mp3"
                        }
                      };
                    default:
                      throw new Ve({
                        functionality: `audio content parts with media type ${a.mediaType}`
                      });
                  }
                } else if (a.mediaType === "application/pdf") {
                  if (a.data instanceof URL)
                    throw new Ve({
                      functionality: "PDF file parts with URLs"
                    });
                  return {
                    type: "file",
                    file: typeof a.data == "string" && a.data.startsWith("file-") ? { file_id: a.data } : {
                      filename: (p = a.filename) != null ? p : `part-${u}.pdf`,
                      file_data: `data:application/pdf;base64,${Sr(a.data)}`
                    }
                  };
                } else
                  throw new Ve({
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
s(L0, "convertToOpenAIChatMessages");
function Ym({
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
s(Ym, "getResponseMetadata");
function W_(e) {
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
s(W_, "mapOpenAIFinishReason");
var F0 = ie(
  () => Z(
    l.object({
      id: l.string().nullish(),
      created: l.number().nullish(),
      model: l.string().nullish(),
      choices: l.array(
        l.object({
          message: l.object({
            role: l.literal("assistant").nullish(),
            content: l.string().nullish(),
            tool_calls: l.array(
              l.object({
                id: l.string().nullish(),
                type: l.literal("function"),
                function: l.object({
                  name: l.string(),
                  arguments: l.string()
                })
              })
            ).nullish(),
            annotations: l.array(
              l.object({
                type: l.literal("url_citation"),
                url_citation: l.object({
                  start_index: l.number(),
                  end_index: l.number(),
                  url: l.string(),
                  title: l.string()
                })
              })
            ).nullish()
          }),
          index: l.number(),
          logprobs: l.object({
            content: l.array(
              l.object({
                token: l.string(),
                logprob: l.number(),
                top_logprobs: l.array(
                  l.object({
                    token: l.string(),
                    logprob: l.number()
                  })
                )
              })
            ).nullish()
          }).nullish(),
          finish_reason: l.string().nullish()
        })
      ),
      usage: l.object({
        prompt_tokens: l.number().nullish(),
        completion_tokens: l.number().nullish(),
        total_tokens: l.number().nullish(),
        prompt_tokens_details: l.object({
          cached_tokens: l.number().nullish()
        }).nullish(),
        completion_tokens_details: l.object({
          reasoning_tokens: l.number().nullish(),
          accepted_prediction_tokens: l.number().nullish(),
          rejected_prediction_tokens: l.number().nullish()
        }).nullish()
      }).nullish()
    })
  )
), V0 = ie(
  () => Z(
    l.union([
      l.object({
        id: l.string().nullish(),
        created: l.number().nullish(),
        model: l.string().nullish(),
        choices: l.array(
          l.object({
            delta: l.object({
              role: l.enum(["assistant"]).nullish(),
              content: l.string().nullish(),
              tool_calls: l.array(
                l.object({
                  index: l.number(),
                  id: l.string().nullish(),
                  type: l.literal("function").nullish(),
                  function: l.object({
                    name: l.string().nullish(),
                    arguments: l.string().nullish()
                  })
                })
              ).nullish(),
              annotations: l.array(
                l.object({
                  type: l.literal("url_citation"),
                  url_citation: l.object({
                    start_index: l.number(),
                    end_index: l.number(),
                    url: l.string(),
                    title: l.string()
                  })
                })
              ).nullish()
            }).nullish(),
            logprobs: l.object({
              content: l.array(
                l.object({
                  token: l.string(),
                  logprob: l.number(),
                  top_logprobs: l.array(
                    l.object({
                      token: l.string(),
                      logprob: l.number()
                    })
                  )
                })
              ).nullish()
            }).nullish(),
            finish_reason: l.string().nullish(),
            index: l.number()
          })
        ),
        usage: l.object({
          prompt_tokens: l.number().nullish(),
          completion_tokens: l.number().nullish(),
          total_tokens: l.number().nullish(),
          prompt_tokens_details: l.object({
            cached_tokens: l.number().nullish()
          }).nullish(),
          completion_tokens_details: l.object({
            reasoning_tokens: l.number().nullish(),
            accepted_prediction_tokens: l.number().nullish(),
            rejected_prediction_tokens: l.number().nullish()
          }).nullish()
        }).nullish()
      }),
      Qm
    ])
  )
), q0 = ie(
  () => Z(
    l.object({
      /**
       * Modify the likelihood of specified tokens appearing in the completion.
       *
       * Accepts a JSON object that maps tokens (specified by their token ID in
       * the GPT tokenizer) to an associated bias value from -100 to 100.
       */
      logitBias: l.record(l.coerce.number(), l.number()).optional(),
      /**
       * Return the log probabilities of the tokens.
       *
       * Setting to true will return the log probabilities of the tokens that
       * were generated.
       *
       * Setting to a number will return the log probabilities of the top n
       * tokens that were generated.
       */
      logprobs: l.union([l.boolean(), l.number()]).optional(),
      /**
       * Whether to enable parallel function calling during tool use. Default to true.
       */
      parallelToolCalls: l.boolean().optional(),
      /**
       * A unique identifier representing your end-user, which can help OpenAI to
       * monitor and detect abuse.
       */
      user: l.string().optional(),
      /**
       * Reasoning effort for reasoning models. Defaults to `medium`.
       */
      reasoningEffort: l.enum(["none", "minimal", "low", "medium", "high", "xhigh"]).optional(),
      /**
       * Maximum number of completion tokens to generate. Useful for reasoning models.
       */
      maxCompletionTokens: l.number().optional(),
      /**
       * Whether to enable persistence in responses API.
       */
      store: l.boolean().optional(),
      /**
       * Metadata to associate with the request.
       */
      metadata: l.record(l.string().max(64), l.string().max(512)).optional(),
      /**
       * Parameters for prediction mode.
       */
      prediction: l.record(l.string(), l.any()).optional(),
      /**
       * Whether to use structured outputs.
       *
       * @default true
       */
      structuredOutputs: l.boolean().optional(),
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
      serviceTier: l.enum(["auto", "flex", "priority", "default"]).optional(),
      /**
       * Whether to use strict JSON schema validation.
       *
       * @default false
       */
      strictJsonSchema: l.boolean().optional(),
      /**
       * Controls the verbosity of the model's responses.
       * Lower values will result in more concise responses, while higher values will result in more verbose responses.
       */
      textVerbosity: l.enum(["low", "medium", "high"]).optional(),
      /**
       * A cache key for prompt caching. Allows manual control over prompt caching behavior.
       * Useful for improving cache hit rates and working around automatic caching issues.
       */
      promptCacheKey: l.string().optional(),
      /**
       * The retention policy for the prompt cache.
       * - 'in_memory': Default. Standard prompt caching behavior.
       * - '24h': Extended prompt caching that keeps cached prefixes active for up to 24 hours.
       *          Currently only available for 5.1 series models.
       *
       * @default 'in_memory'
       */
      promptCacheRetention: l.enum(["in_memory", "24h"]).optional(),
      /**
       * A stable identifier used to help detect users of your application
       * that may be violating OpenAI's usage policies. The IDs should be a
       * string that uniquely identifies each user. We recommend hashing their
       * username or email address, in order to avoid sending us any identifying
       * information.
       */
      safetyIdentifier: l.string().optional()
    })
  )
);
function J0({
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
      throw new Ve({
        functionality: `tool choice type: ${u}`
      });
    }
  }
}
s(J0, "prepareChatTools");
var B0 = class {
  static {
    s(this, "OpenAIChatLanguageModel");
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
    toolChoice: f,
    providerOptions: h
  }) {
    var m, v, b, $;
    let w = [], I = (m = await ot({
      provider: "openai",
      providerOptions: h,
      schema: q0
    })) != null ? m : {}, _ = (v = I.structuredOutputs) != null ? v : !0, x = nb(this.modelId);
    r != null && w.push({
      type: "unsupported-setting",
      setting: "topK"
    }), c?.type === "json" && c.schema != null && !_ && w.push({
      type: "unsupported-setting",
      setting: "responseFormat",
      details: "JSON response format schema is only supported with structuredOutputs"
    });
    let { messages: C, warnings: M } = L0(
      {
        prompt: e,
        systemMessageMode: x.systemMessageMode
      }
    );
    w.push(...M);
    let S = (b = I.strictJsonSchema) != null ? b : !1, T = {
      // model id:
      model: this.modelId,
      // model specific settings:
      logit_bias: I.logitBias,
      logprobs: I.logprobs === !0 || typeof I.logprobs == "number" ? !0 : void 0,
      top_logprobs: typeof I.logprobs == "number" ? I.logprobs : typeof I.logprobs == "boolean" && I.logprobs ? 0 : void 0,
      user: I.user,
      parallel_tool_calls: I.parallelToolCalls,
      // standardized settings:
      max_tokens: t,
      temperature: n,
      top_p: o,
      frequency_penalty: i,
      presence_penalty: a,
      response_format: c?.type === "json" ? _ && c.schema != null ? {
        type: "json_schema",
        json_schema: {
          schema: c.schema,
          strict: S,
          name: ($ = c.name) != null ? $ : "response",
          description: c.description
        }
      } : { type: "json_object" } : void 0,
      stop: u,
      seed: d,
      verbosity: I.textVerbosity,
      // openai specific settings:
      // TODO AI SDK 6: remove, we auto-map maxOutputTokens now
      max_completion_tokens: I.maxCompletionTokens,
      store: I.store,
      metadata: I.metadata,
      prediction: I.prediction,
      reasoning_effort: I.reasoningEffort,
      service_tier: I.serviceTier,
      prompt_cache_key: I.promptCacheKey,
      prompt_cache_retention: I.promptCacheRetention,
      safety_identifier: I.safetyIdentifier,
      // messages:
      messages: C
    };
    x.isReasoningModel ? ((I.reasoningEffort !== "none" || !x.supportsNonReasoningParameters) && (T.temperature != null && (T.temperature = void 0, w.push({
      type: "unsupported-setting",
      setting: "temperature",
      details: "temperature is not supported for reasoning models"
    })), T.top_p != null && (T.top_p = void 0, w.push({
      type: "unsupported-setting",
      setting: "topP",
      details: "topP is not supported for reasoning models"
    })), T.logprobs != null && (T.logprobs = void 0, w.push({
      type: "other",
      message: "logprobs is not supported for reasoning models"
    }))), T.frequency_penalty != null && (T.frequency_penalty = void 0, w.push({
      type: "unsupported-setting",
      setting: "frequencyPenalty",
      details: "frequencyPenalty is not supported for reasoning models"
    })), T.presence_penalty != null && (T.presence_penalty = void 0, w.push({
      type: "unsupported-setting",
      setting: "presencePenalty",
      details: "presencePenalty is not supported for reasoning models"
    })), T.logit_bias != null && (T.logit_bias = void 0, w.push({
      type: "other",
      message: "logitBias is not supported for reasoning models"
    })), T.top_logprobs != null && (T.top_logprobs = void 0, w.push({
      type: "other",
      message: "topLogprobs is not supported for reasoning models"
    })), T.max_tokens != null && (T.max_completion_tokens == null && (T.max_completion_tokens = T.max_tokens), T.max_tokens = void 0)) : (this.modelId.startsWith("gpt-4o-search-preview") || this.modelId.startsWith("gpt-4o-mini-search-preview")) && T.temperature != null && (T.temperature = void 0, w.push({
      type: "unsupported-setting",
      setting: "temperature",
      details: "temperature is not supported for the search preview models and has been removed."
    })), I.serviceTier === "flex" && !x.supportsFlexProcessing && (w.push({
      type: "unsupported-setting",
      setting: "serviceTier",
      details: "flex processing is only available for o3, o4-mini, and gpt-5 models"
    }), T.service_tier = void 0), I.serviceTier === "priority" && !x.supportsPriorityProcessing && (w.push({
      type: "unsupported-setting",
      setting: "serviceTier",
      details: "priority processing is only available for supported models (gpt-4, gpt-5, gpt-5-mini, o3, o4-mini) and requires Enterprise access. gpt-5-nano is not supported"
    }), T.service_tier = void 0);
    let {
      tools: G,
      toolChoice: J,
      toolWarnings: ue
    } = J0({
      tools: p,
      toolChoice: f,
      structuredOutputs: _,
      strictJsonSchema: S
    });
    return {
      args: {
        ...T,
        tools: G,
        tool_choice: J
      },
      warnings: [...w, ...ue]
    };
  }
  async doGenerate(e) {
    var t, n, o, r, i, a, u, c, d, p, f, h, m, v;
    let { args: b, warnings: $ } = await this.getArgs(e), {
      responseHeaders: w,
      value: I,
      rawValue: _
    } = await Ce({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: Ne(this.config.headers(), e.headers),
      body: b,
      failedResponseHandler: Bt,
      successfulResponseHandler: Me(
        F0
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    }), x = I.choices[0], C = [], M = x.message.content;
    M != null && M.length > 0 && C.push({ type: "text", text: M });
    for (let J of (t = x.message.tool_calls) != null ? t : [])
      C.push({
        type: "tool-call",
        toolCallId: (n = J.id) != null ? n : nt(),
        toolName: J.function.name,
        input: J.function.arguments
      });
    for (let J of (o = x.message.annotations) != null ? o : [])
      C.push({
        type: "source",
        sourceType: "url",
        id: nt(),
        url: J.url_citation.url,
        title: J.url_citation.title
      });
    let S = (r = I.usage) == null ? void 0 : r.completion_tokens_details, T = (i = I.usage) == null ? void 0 : i.prompt_tokens_details, G = { openai: {} };
    return S?.accepted_prediction_tokens != null && (G.openai.acceptedPredictionTokens = S?.accepted_prediction_tokens), S?.rejected_prediction_tokens != null && (G.openai.rejectedPredictionTokens = S?.rejected_prediction_tokens), ((a = x.logprobs) == null ? void 0 : a.content) != null && (G.openai.logprobs = x.logprobs.content), {
      content: C,
      finishReason: W_(x.finish_reason),
      usage: {
        inputTokens: (c = (u = I.usage) == null ? void 0 : u.prompt_tokens) != null ? c : void 0,
        outputTokens: (p = (d = I.usage) == null ? void 0 : d.completion_tokens) != null ? p : void 0,
        totalTokens: (h = (f = I.usage) == null ? void 0 : f.total_tokens) != null ? h : void 0,
        reasoningTokens: (m = S?.reasoning_tokens) != null ? m : void 0,
        cachedInputTokens: (v = T?.cached_tokens) != null ? v : void 0
      },
      request: { body: b },
      response: {
        ...Ym(I),
        headers: w,
        body: _
      },
      warnings: $,
      providerMetadata: G
    };
  }
  async doStream(e) {
    let { args: t, warnings: n } = await this.getArgs(e), o = {
      ...t,
      stream: !0,
      stream_options: {
        include_usage: !0
      }
    }, { responseHeaders: r, value: i } = await Ce({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: Ne(this.config.headers(), e.headers),
      body: o,
      failedResponseHandler: Bt,
      successfulResponseHandler: kr(
        V0
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    }), a = [], u = "unknown", c = {
      inputTokens: void 0,
      outputTokens: void 0,
      totalTokens: void 0
    }, d = !1, p = !1, f = { openai: {} };
    return {
      stream: i.pipeThrough(
        new TransformStream({
          start(h) {
            h.enqueue({ type: "stream-start", warnings: n });
          },
          transform(h, m) {
            var v, b, $, w, I, _, x, C, M, S, T, G, J, ue, fe, Q, te, _e, be, re, je, xe, ye, ce;
            if (e.includeRawChunks && m.enqueue({ type: "raw", rawValue: h.rawValue }), !h.success) {
              u = "error", m.enqueue({ type: "error", error: h.error });
              return;
            }
            let ae = h.value;
            if ("error" in ae) {
              u = "error", m.enqueue({ type: "error", error: ae.error });
              return;
            }
            if (!d) {
              let Y = Ym(ae);
              Object.values(Y).some(Boolean) && (d = !0, m.enqueue({
                type: "response-metadata",
                ...Ym(ae)
              }));
            }
            ae.usage != null && (c.inputTokens = (v = ae.usage.prompt_tokens) != null ? v : void 0, c.outputTokens = (b = ae.usage.completion_tokens) != null ? b : void 0, c.totalTokens = ($ = ae.usage.total_tokens) != null ? $ : void 0, c.reasoningTokens = (I = (w = ae.usage.completion_tokens_details) == null ? void 0 : w.reasoning_tokens) != null ? I : void 0, c.cachedInputTokens = (x = (_ = ae.usage.prompt_tokens_details) == null ? void 0 : _.cached_tokens) != null ? x : void 0, ((C = ae.usage.completion_tokens_details) == null ? void 0 : C.accepted_prediction_tokens) != null && (f.openai.acceptedPredictionTokens = (M = ae.usage.completion_tokens_details) == null ? void 0 : M.accepted_prediction_tokens), ((S = ae.usage.completion_tokens_details) == null ? void 0 : S.rejected_prediction_tokens) != null && (f.openai.rejectedPredictionTokens = (T = ae.usage.completion_tokens_details) == null ? void 0 : T.rejected_prediction_tokens));
            let ge = ae.choices[0];
            if (ge?.finish_reason != null && (u = W_(ge.finish_reason)), ((G = ge?.logprobs) == null ? void 0 : G.content) != null && (f.openai.logprobs = ge.logprobs.content), ge?.delta == null)
              return;
            let ve = ge.delta;
            if (ve.content != null && (p || (m.enqueue({ type: "text-start", id: "0" }), p = !0), m.enqueue({
              type: "text-delta",
              id: "0",
              delta: ve.content
            })), ve.tool_calls != null)
              for (let Y of ve.tool_calls) {
                let g = Y.index;
                if (a[g] == null) {
                  if (Y.type !== "function")
                    throw new Ga({
                      data: Y,
                      message: "Expected 'function' type."
                    });
                  if (Y.id == null)
                    throw new Ga({
                      data: Y,
                      message: "Expected 'id' to be a string."
                    });
                  if (((J = Y.function) == null ? void 0 : J.name) == null)
                    throw new Ga({
                      data: Y,
                      message: "Expected 'function.name' to be a string."
                    });
                  m.enqueue({
                    type: "tool-input-start",
                    id: Y.id,
                    toolName: Y.function.name
                  }), a[g] = {
                    id: Y.id,
                    type: "function",
                    function: {
                      name: Y.function.name,
                      arguments: (ue = Y.function.arguments) != null ? ue : ""
                    },
                    hasFinished: !1
                  };
                  let B = a[g];
                  ((fe = B.function) == null ? void 0 : fe.name) != null && ((Q = B.function) == null ? void 0 : Q.arguments) != null && (B.function.arguments.length > 0 && m.enqueue({
                    type: "tool-input-delta",
                    id: B.id,
                    delta: B.function.arguments
                  }), Em(B.function.arguments) && (m.enqueue({
                    type: "tool-input-end",
                    id: B.id
                  }), m.enqueue({
                    type: "tool-call",
                    toolCallId: (te = B.id) != null ? te : nt(),
                    toolName: B.function.name,
                    input: B.function.arguments
                  }), B.hasFinished = !0));
                  continue;
                }
                let L = a[g];
                L.hasFinished || (((_e = Y.function) == null ? void 0 : _e.arguments) != null && (L.function.arguments += (re = (be = Y.function) == null ? void 0 : be.arguments) != null ? re : ""), m.enqueue({
                  type: "tool-input-delta",
                  id: L.id,
                  delta: (je = Y.function.arguments) != null ? je : ""
                }), ((xe = L.function) == null ? void 0 : xe.name) != null && ((ye = L.function) == null ? void 0 : ye.arguments) != null && Em(L.function.arguments) && (m.enqueue({
                  type: "tool-input-end",
                  id: L.id
                }), m.enqueue({
                  type: "tool-call",
                  toolCallId: (ce = L.id) != null ? ce : nt(),
                  toolName: L.function.name,
                  input: L.function.arguments
                }), L.hasFinished = !0));
              }
            if (ve.annotations != null)
              for (let Y of ve.annotations)
                m.enqueue({
                  type: "source",
                  sourceType: "url",
                  id: nt(),
                  url: Y.url_citation.url,
                  title: Y.url_citation.title
                });
          },
          flush(h) {
            p && h.enqueue({ type: "text-end", id: "0" }), h.enqueue({
              type: "finish",
              finishReason: u,
              usage: c,
              ...f != null ? { providerMetadata: f } : {}
            });
          }
        })
      ),
      request: { body: o },
      response: { headers: r }
    };
  }
};
function G0({
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
        throw new tr({
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
              throw new Ve({
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
        throw new Ve({
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
s(G0, "convertToOpenAICompletionPrompt");
function K_({
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
s(K_, "getResponseMetadata2");
function H_(e) {
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
s(H_, "mapOpenAIFinishReason2");
var W0 = ie(
  () => Z(
    l.object({
      id: l.string().nullish(),
      created: l.number().nullish(),
      model: l.string().nullish(),
      choices: l.array(
        l.object({
          text: l.string(),
          finish_reason: l.string(),
          logprobs: l.object({
            tokens: l.array(l.string()),
            token_logprobs: l.array(l.number()),
            top_logprobs: l.array(l.record(l.string(), l.number())).nullish()
          }).nullish()
        })
      ),
      usage: l.object({
        prompt_tokens: l.number(),
        completion_tokens: l.number(),
        total_tokens: l.number()
      }).nullish()
    })
  )
), K0 = ie(
  () => Z(
    l.union([
      l.object({
        id: l.string().nullish(),
        created: l.number().nullish(),
        model: l.string().nullish(),
        choices: l.array(
          l.object({
            text: l.string(),
            finish_reason: l.string().nullish(),
            index: l.number(),
            logprobs: l.object({
              tokens: l.array(l.string()),
              token_logprobs: l.array(l.number()),
              top_logprobs: l.array(l.record(l.string(), l.number())).nullish()
            }).nullish()
          })
        ),
        usage: l.object({
          prompt_tokens: l.number(),
          completion_tokens: l.number(),
          total_tokens: l.number()
        }).nullish()
      }),
      Qm
    ])
  )
), X_ = ie(
  () => Z(
    l.object({
      /**
      Echo back the prompt in addition to the completion.
         */
      echo: l.boolean().optional(),
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
      logitBias: l.record(l.string(), l.number()).optional(),
      /**
      The suffix that comes after a completion of inserted text.
       */
      suffix: l.string().optional(),
      /**
      A unique identifier representing your end-user, which can help OpenAI to
      monitor and detect abuse. Learn more.
       */
      user: l.string().optional(),
      /**
      Return the log probabilities of the tokens. Including logprobs will increase
      the response size and can slow down response times. However, it can
      be useful to better understand how the model is behaving.
      Setting to true will return the log probabilities of the tokens that
      were generated.
      Setting to a number will return the log probabilities of the top n
      tokens that were generated.
         */
      logprobs: l.union([l.boolean(), l.number()]).optional()
    })
  )
), H0 = class {
  static {
    s(this, "OpenAICompletionLanguageModel");
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
    seed: f,
    providerOptions: h
  }) {
    let m = [], v = {
      ...await ot({
        provider: "openai",
        providerOptions: h,
        schema: X_
      }),
      ...await ot({
        provider: this.providerOptionsName,
        providerOptions: h,
        schema: X_
      })
    };
    r != null && m.push({ type: "unsupported-setting", setting: "topK" }), d?.length && m.push({ type: "unsupported-setting", setting: "tools" }), p != null && m.push({ type: "unsupported-setting", setting: "toolChoice" }), c != null && c.type !== "text" && m.push({
      type: "unsupported-setting",
      setting: "responseFormat",
      details: "JSON response format is not supported."
    });
    let { prompt: b, stopSequences: $ } = G0({ prompt: e }), w = [...$ ?? [], ...u ?? []];
    return {
      args: {
        // model id:
        model: this.modelId,
        // model specific settings:
        echo: v.echo,
        logit_bias: v.logitBias,
        logprobs: v?.logprobs === !0 ? 0 : v?.logprobs === !1 ? void 0 : v?.logprobs,
        suffix: v.suffix,
        user: v.user,
        // standardized settings:
        max_tokens: t,
        temperature: n,
        top_p: o,
        frequency_penalty: i,
        presence_penalty: a,
        seed: f,
        // prompt:
        prompt: b,
        // stop sequences:
        stop: w.length > 0 ? w : void 0
      },
      warnings: m
    };
  }
  async doGenerate(e) {
    var t, n, o;
    let { args: r, warnings: i } = await this.getArgs(e), {
      responseHeaders: a,
      value: u,
      rawValue: c
    } = await Ce({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: Ne(this.config.headers(), e.headers),
      body: r,
      failedResponseHandler: Bt,
      successfulResponseHandler: Me(
        W0
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
      finishReason: H_(d.finish_reason),
      request: { body: r },
      response: {
        ...K_(u),
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
    }, { responseHeaders: r, value: i } = await Ce({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: Ne(this.config.headers(), e.headers),
      body: o,
      failedResponseHandler: Bt,
      successfulResponseHandler: kr(
        K0
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
          transform(p, f) {
            if (e.includeRawChunks && f.enqueue({ type: "raw", rawValue: p.rawValue }), !p.success) {
              a = "error", f.enqueue({ type: "error", error: p.error });
              return;
            }
            let h = p.value;
            if ("error" in h) {
              a = "error", f.enqueue({ type: "error", error: h.error });
              return;
            }
            d && (d = !1, f.enqueue({
              type: "response-metadata",
              ...K_(h)
            }), f.enqueue({ type: "text-start", id: "0" })), h.usage != null && (c.inputTokens = h.usage.prompt_tokens, c.outputTokens = h.usage.completion_tokens, c.totalTokens = h.usage.total_tokens);
            let m = h.choices[0];
            m?.finish_reason != null && (a = H_(m.finish_reason)), m?.logprobs != null && (u.openai.logprobs = m.logprobs), m?.text != null && m.text.length > 0 && f.enqueue({
              type: "text-delta",
              id: "0",
              delta: m.text
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
}, X0 = ie(
  () => Z(
    l.object({
      /**
      The number of dimensions the resulting output embeddings should have.
      Only supported in text-embedding-3 and later models.
         */
      dimensions: l.number().optional(),
      /**
      A unique identifier representing your end-user, which can help OpenAI to
      monitor and detect abuse. Learn more.
      */
      user: l.string().optional()
    })
  )
), Y0 = ie(
  () => Z(
    l.object({
      data: l.array(l.object({ embedding: l.array(l.number()) })),
      usage: l.object({ prompt_tokens: l.number() }).nullish()
    })
  )
), Q0 = class {
  static {
    s(this, "OpenAIEmbeddingModel");
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
      throw new nv({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values: e
      });
    let i = (r = await ot({
      provider: "openai",
      providerOptions: o,
      schema: X0
    })) != null ? r : {}, {
      responseHeaders: a,
      value: u,
      rawValue: c
    } = await Ce({
      url: this.config.url({
        path: "/embeddings",
        modelId: this.modelId
      }),
      headers: Ne(this.config.headers(), t),
      body: {
        model: this.modelId,
        input: e,
        encoding_format: "float",
        dimensions: i.dimensions,
        user: i.user
      },
      failedResponseHandler: Bt,
      successfulResponseHandler: Me(
        Y0
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
}, eT = ie(
  () => Z(
    l.object({
      created: l.number().nullish(),
      data: l.array(
        l.object({
          b64_json: l.string(),
          revised_prompt: l.string().nullish()
        })
      ),
      background: l.string().nullish(),
      output_format: l.string().nullish(),
      size: l.string().nullish(),
      quality: l.string().nullish(),
      usage: l.object({
        input_tokens: l.number().nullish(),
        output_tokens: l.number().nullish(),
        total_tokens: l.number().nullish(),
        input_tokens_details: l.object({
          image_tokens: l.number().nullish(),
          text_tokens: l.number().nullish()
        }).nullish()
      }).nullish()
    })
  )
), tT = {
  "dall-e-3": 1,
  "dall-e-2": 10,
  "gpt-image-1": 10,
  "gpt-image-1-mini": 10,
  "gpt-image-1.5": 10
}, rT = /* @__PURE__ */ new Set([
  "gpt-image-1",
  "gpt-image-1-mini",
  "gpt-image-1.5"
]), nT = class {
  static {
    s(this, "OpenAIImageModel");
  }
  constructor(e, t) {
    this.modelId = e, this.config = t, this.specificationVersion = "v2";
  }
  get maxImagesPerCall() {
    var e;
    return (e = tT[this.modelId]) != null ? e : 1;
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
    var c, d, p, f;
    let h = [];
    o != null && h.push({
      type: "unsupported-setting",
      setting: "aspectRatio",
      details: "This model does not support aspect ratio. Use `size` instead."
    }), r != null && h.push({ type: "unsupported-setting", setting: "seed" });
    let m = (p = (d = (c = this.config._internal) == null ? void 0 : c.currentDate) == null ? void 0 : d.call(c)) != null ? p : /* @__PURE__ */ new Date(), { value: v, responseHeaders: b } = await Ce({
      url: this.config.url({
        path: "/images/generations",
        modelId: this.modelId
      }),
      headers: Ne(this.config.headers(), a),
      body: {
        model: this.modelId,
        prompt: e,
        n: t,
        size: n,
        ...(f = i.openai) != null ? f : {},
        ...rT.has(this.modelId) ? {} : { response_format: "b64_json" }
      },
      failedResponseHandler: Bt,
      successfulResponseHandler: Me(
        eT
      ),
      abortSignal: u,
      fetch: this.config.fetch
    });
    return {
      images: v.data.map(($) => $.b64_json),
      warnings: h,
      response: {
        timestamp: m,
        modelId: this.modelId,
        headers: b
      },
      providerMetadata: {
        openai: {
          images: v.data.map(($) => ({
            ...$.revised_prompt ? { revisedPrompt: $.revised_prompt } : {},
            ...v.created != null ? { created: v.created } : {},
            ...v.size != null ? { size: v.size } : {},
            ...v.quality != null ? { quality: v.quality } : {},
            ...v.background != null ? { background: v.background } : {},
            ...v.output_format != null ? { outputFormat: v.output_format } : {}
          }))
        }
      }
    };
  }
}, oT = De(
  () => Z(
    l.object({
      code: l.string().nullish(),
      containerId: l.string()
    })
  )
), iT = De(
  () => Z(
    l.object({
      outputs: l.array(
        l.discriminatedUnion("type", [
          l.object({ type: l.literal("logs"), logs: l.string() }),
          l.object({ type: l.literal("image"), url: l.string() })
        ])
      ).nullish()
    })
  )
), aT = De(
  () => Z(
    l.object({
      container: l.union([
        l.string(),
        l.object({
          fileIds: l.array(l.string()).optional()
        })
      ]).optional()
    })
  )
), sT = Tt({
  id: "openai.code_interpreter",
  name: "code_interpreter",
  inputSchema: oT,
  outputSchema: iT
}), lT = /* @__PURE__ */ s((e = {}) => sT(e), "codeInterpreter"), ob = l.object({
  key: l.string(),
  type: l.enum(["eq", "ne", "gt", "gte", "lt", "lte", "in", "nin"]),
  value: l.union([l.string(), l.number(), l.boolean(), l.array(l.string())])
}), ib = l.object({
  type: l.enum(["and", "or"]),
  filters: l.array(
    l.union([ob, l.lazy(() => ib)])
  )
}), uT = De(
  () => Z(
    l.object({
      vectorStoreIds: l.array(l.string()),
      maxNumResults: l.number().optional(),
      ranking: l.object({
        ranker: l.string().optional(),
        scoreThreshold: l.number().optional()
      }).optional(),
      filters: l.union([ob, ib]).optional()
    })
  )
), cT = De(
  () => Z(
    l.object({
      queries: l.array(l.string()),
      results: l.array(
        l.object({
          attributes: l.record(l.string(), l.unknown()),
          fileId: l.string(),
          filename: l.string(),
          score: l.number(),
          text: l.string()
        })
      ).nullable()
    })
  )
), dT = Tt({
  id: "openai.file_search",
  name: "file_search",
  inputSchema: l.object({}),
  outputSchema: cT
}), pT = De(
  () => Z(
    l.object({
      background: l.enum(["auto", "opaque", "transparent"]).optional(),
      inputFidelity: l.enum(["low", "high"]).optional(),
      inputImageMask: l.object({
        fileId: l.string().optional(),
        imageUrl: l.string().optional()
      }).optional(),
      model: l.string().optional(),
      moderation: l.enum(["auto"]).optional(),
      outputCompression: l.number().int().min(0).max(100).optional(),
      outputFormat: l.enum(["png", "jpeg", "webp"]).optional(),
      partialImages: l.number().int().min(0).max(3).optional(),
      quality: l.enum(["auto", "low", "medium", "high"]).optional(),
      size: l.enum(["1024x1024", "1024x1536", "1536x1024", "auto"]).optional()
    }).strict()
  )
), mT = De(() => Z(l.object({}))), fT = De(
  () => Z(l.object({ result: l.string() }))
), gT = Tt({
  id: "openai.image_generation",
  name: "image_generation",
  inputSchema: mT,
  outputSchema: fT
}), hT = /* @__PURE__ */ s((e = {}) => gT(e), "imageGeneration"), ab = De(
  () => Z(
    l.object({
      action: l.object({
        type: l.literal("exec"),
        command: l.array(l.string()),
        timeoutMs: l.number().optional(),
        user: l.string().optional(),
        workingDirectory: l.string().optional(),
        env: l.record(l.string(), l.string()).optional()
      })
    })
  )
), sb = De(
  () => Z(l.object({ output: l.string() }))
), vT = Tt({
  id: "openai.local_shell",
  name: "local_shell",
  inputSchema: ab,
  outputSchema: sb
}), yT = De(
  () => Z(
    l.object({
      externalWebAccess: l.boolean().optional(),
      filters: l.object({ allowedDomains: l.array(l.string()).optional() }).optional(),
      searchContextSize: l.enum(["low", "medium", "high"]).optional(),
      userLocation: l.object({
        type: l.literal("approximate"),
        country: l.string().optional(),
        city: l.string().optional(),
        region: l.string().optional(),
        timezone: l.string().optional()
      }).optional()
    })
  )
), _T = De(() => Z(l.object({}))), bT = De(
  () => Z(
    l.object({
      action: l.discriminatedUnion("type", [
        l.object({
          type: l.literal("search"),
          query: l.string().optional()
        }),
        l.object({
          type: l.literal("openPage"),
          url: l.string().nullish()
        }),
        l.object({
          type: l.literal("findInPage"),
          url: l.string().nullish(),
          pattern: l.string().nullish()
        })
      ]),
      sources: l.array(
        l.discriminatedUnion("type", [
          l.object({ type: l.literal("url"), url: l.string() }),
          l.object({ type: l.literal("api"), name: l.string() })
        ])
      ).optional()
    })
  )
), xT = Tt({
  id: "openai.web_search",
  name: "web_search",
  inputSchema: _T,
  outputSchema: bT
}), $T = /* @__PURE__ */ s((e = {}) => xT(e), "webSearch"), wT = De(
  () => Z(
    l.object({
      searchContextSize: l.enum(["low", "medium", "high"]).optional(),
      userLocation: l.object({
        type: l.literal("approximate"),
        country: l.string().optional(),
        city: l.string().optional(),
        region: l.string().optional(),
        timezone: l.string().optional()
      }).optional()
    })
  )
), kT = De(
  () => Z(l.object({}))
), IT = De(
  () => Z(
    l.object({
      action: l.discriminatedUnion("type", [
        l.object({
          type: l.literal("search"),
          query: l.string().optional()
        }),
        l.object({
          type: l.literal("openPage"),
          url: l.string().nullish()
        }),
        l.object({
          type: l.literal("findInPage"),
          url: l.string().nullish(),
          pattern: l.string().nullish()
        })
      ])
    })
  )
), ST = Tt({
  id: "openai.web_search_preview",
  name: "web_search_preview",
  inputSchema: kT,
  outputSchema: IT
}), TT = {
  /**
   * The Code Interpreter tool allows models to write and run Python code in a
   * sandboxed environment to solve complex problems in domains like data analysis,
   * coding, and math.
   *
   * @param container - The container to use for the code interpreter.
   *
   * Must have name `code_interpreter`.
   */
  codeInterpreter: lT,
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
  fileSearch: dT,
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
  imageGeneration: hT,
  /**
   * Local shell is a tool that allows agents to run shell commands locally
   * on a machine you or the user provides.
   *
   * Supported models: `gpt-5-codex` and `codex-mini-latest`
   *
   * Must have name `local_shell`.
   */
  localShell: vT,
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
  webSearchPreview: ST,
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
  webSearch: $T
};
function Y_(e, t) {
  return t ? t.some((n) => e.startsWith(n)) : !1;
}
s(Y_, "isFileId");
async function zT({
  prompt: e,
  systemMessageMode: t,
  fileIdPrefixes: n,
  store: o,
  hasLocalShellTool: r = !1
}) {
  var i, a, u, c;
  let d = [], p = [];
  for (let { role: f, content: h } of e)
    switch (f) {
      case "system": {
        switch (t) {
          case "system": {
            d.push({ role: "system", content: h });
            break;
          }
          case "developer": {
            d.push({ role: "developer", content: h });
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
            let m = t;
            throw new Error(
              `Unsupported system message mode: ${m}`
            );
          }
        }
        break;
      }
      case "user": {
        d.push({
          role: "user",
          content: h.map((m, v) => {
            var b, $, w;
            switch (m.type) {
              case "text":
                return { type: "input_text", text: m.text };
              case "file":
                if (m.mediaType.startsWith("image/")) {
                  let I = m.mediaType === "image/*" ? "image/jpeg" : m.mediaType;
                  return {
                    type: "input_image",
                    ...m.data instanceof URL ? { image_url: m.data.toString() } : typeof m.data == "string" && Y_(m.data, n) ? { file_id: m.data } : {
                      image_url: `data:${I};base64,${Sr(m.data)}`
                    },
                    detail: ($ = (b = m.providerOptions) == null ? void 0 : b.openai) == null ? void 0 : $.imageDetail
                  };
                } else {
                  if (m.mediaType === "application/pdf")
                    return m.data instanceof URL ? {
                      type: "input_file",
                      file_url: m.data.toString()
                    } : {
                      type: "input_file",
                      ...typeof m.data == "string" && Y_(m.data, n) ? { file_id: m.data } : {
                        filename: (w = m.filename) != null ? w : `part-${v}.pdf`,
                        file_data: `data:application/pdf;base64,${Sr(m.data)}`
                      }
                    };
                  throw new Ve({
                    functionality: `file part media type ${m.mediaType}`
                  });
                }
            }
          })
        });
        break;
      }
      case "assistant": {
        let m = {}, v = {};
        for (let b of h)
          switch (b.type) {
            case "text": {
              let $ = (a = (i = b.providerOptions) == null ? void 0 : i.openai) == null ? void 0 : a.itemId;
              if (o && $ != null) {
                d.push({ type: "item_reference", id: $ });
                break;
              }
              d.push({
                role: "assistant",
                content: [{ type: "output_text", text: b.text }],
                id: $
              });
              break;
            }
            case "tool-call": {
              if (v[b.toolCallId] = b, b.providerExecuted)
                break;
              let $ = (c = (u = b.providerOptions) == null ? void 0 : u.openai) == null ? void 0 : c.itemId;
              if (o && $ != null) {
                d.push({ type: "item_reference", id: $ });
                break;
              }
              if (r && b.toolName === "local_shell") {
                let w = await dt({
                  value: b.input,
                  schema: ab
                });
                d.push({
                  type: "local_shell_call",
                  call_id: b.toolCallId,
                  id: $,
                  action: {
                    type: "exec",
                    command: w.action.command,
                    timeout_ms: w.action.timeoutMs,
                    user: w.action.user,
                    working_directory: w.action.workingDirectory,
                    env: w.action.env
                  }
                });
                break;
              }
              d.push({
                type: "function_call",
                call_id: b.toolCallId,
                name: b.toolName,
                arguments: JSON.stringify(b.input),
                id: $
              });
              break;
            }
            // assistant tool result parts are from provider-executed tools:
            case "tool-result": {
              o ? d.push({ type: "item_reference", id: b.toolCallId }) : p.push({
                type: "other",
                message: `Results for OpenAI tool ${b.toolName} are not sent to the API when store is false`
              });
              break;
            }
            case "reasoning": {
              let $ = await ot({
                provider: "openai",
                providerOptions: b.providerOptions,
                schema: ET
              }), w = $?.itemId;
              if (w != null) {
                let I = m[w];
                if (o)
                  I === void 0 && (d.push({ type: "item_reference", id: w }), m[w] = {
                    type: "reasoning",
                    id: w,
                    summary: []
                  });
                else {
                  let _ = [];
                  b.text.length > 0 ? _.push({
                    type: "summary_text",
                    text: b.text
                  }) : I !== void 0 && p.push({
                    type: "other",
                    message: `Cannot append empty reasoning part to existing reasoning sequence. Skipping reasoning part: ${JSON.stringify(b)}.`
                  }), I === void 0 ? (m[w] = {
                    type: "reasoning",
                    id: w,
                    encrypted_content: $?.reasoningEncryptedContent,
                    summary: _
                  }, d.push(m[w])) : (I.summary.push(..._), $?.reasoningEncryptedContent != null && (I.encrypted_content = $.reasoningEncryptedContent));
                }
              } else
                p.push({
                  type: "other",
                  message: `Non-OpenAI reasoning parts are not supported. Skipping reasoning part: ${JSON.stringify(b)}.`
                });
              break;
            }
          }
        break;
      }
      case "tool": {
        for (let m of h) {
          let v = m.output;
          if (r && m.toolName === "local_shell" && v.type === "json") {
            let $ = await dt({
              value: v.value,
              schema: sb
            });
            d.push({
              type: "local_shell_call_output",
              call_id: m.toolCallId,
              output: $.output
            });
            break;
          }
          let b;
          switch (v.type) {
            case "text":
            case "error-text":
              b = v.value;
              break;
            case "json":
            case "error-json":
              b = JSON.stringify(v.value);
              break;
            case "content":
              b = v.value.map(($) => {
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
            call_id: m.toolCallId,
            output: b
          });
        }
        break;
      }
      default: {
        let m = f;
        throw new Error(`Unsupported role: ${m}`);
      }
    }
  return { input: d, warnings: p };
}
s(zT, "convertToOpenAIResponsesInput");
var ET = l.object({
  itemId: l.string().nullish(),
  reasoningEncryptedContent: l.string().nullish()
});
function Q_({
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
s(Q_, "mapOpenAIResponseFinishReason");
var OT = ie(
  () => Z(
    l.union([
      l.object({
        type: l.literal("response.output_text.delta"),
        item_id: l.string(),
        delta: l.string(),
        logprobs: l.array(
          l.object({
            token: l.string(),
            logprob: l.number(),
            top_logprobs: l.array(
              l.object({
                token: l.string(),
                logprob: l.number()
              })
            )
          })
        ).nullish()
      }),
      l.object({
        type: l.enum(["response.completed", "response.incomplete"]),
        response: l.object({
          incomplete_details: l.object({ reason: l.string() }).nullish(),
          usage: l.object({
            input_tokens: l.number(),
            input_tokens_details: l.object({ cached_tokens: l.number().nullish() }).nullish(),
            output_tokens: l.number(),
            output_tokens_details: l.object({ reasoning_tokens: l.number().nullish() }).nullish()
          }),
          service_tier: l.string().nullish()
        })
      }),
      l.object({
        type: l.literal("response.created"),
        response: l.object({
          id: l.string(),
          created_at: l.number(),
          model: l.string(),
          service_tier: l.string().nullish()
        })
      }),
      l.object({
        type: l.literal("response.output_item.added"),
        output_index: l.number(),
        item: l.discriminatedUnion("type", [
          l.object({
            type: l.literal("message"),
            id: l.string()
          }),
          l.object({
            type: l.literal("reasoning"),
            id: l.string(),
            encrypted_content: l.string().nullish()
          }),
          l.object({
            type: l.literal("function_call"),
            id: l.string(),
            call_id: l.string(),
            name: l.string(),
            arguments: l.string()
          }),
          l.object({
            type: l.literal("web_search_call"),
            id: l.string(),
            status: l.string()
          }),
          l.object({
            type: l.literal("computer_call"),
            id: l.string(),
            status: l.string()
          }),
          l.object({
            type: l.literal("file_search_call"),
            id: l.string()
          }),
          l.object({
            type: l.literal("image_generation_call"),
            id: l.string()
          }),
          l.object({
            type: l.literal("code_interpreter_call"),
            id: l.string(),
            container_id: l.string(),
            code: l.string().nullable(),
            outputs: l.array(
              l.discriminatedUnion("type", [
                l.object({ type: l.literal("logs"), logs: l.string() }),
                l.object({ type: l.literal("image"), url: l.string() })
              ])
            ).nullable(),
            status: l.string()
          })
        ])
      }),
      l.object({
        type: l.literal("response.output_item.done"),
        output_index: l.number(),
        item: l.discriminatedUnion("type", [
          l.object({
            type: l.literal("message"),
            id: l.string()
          }),
          l.object({
            type: l.literal("reasoning"),
            id: l.string(),
            encrypted_content: l.string().nullish()
          }),
          l.object({
            type: l.literal("function_call"),
            id: l.string(),
            call_id: l.string(),
            name: l.string(),
            arguments: l.string(),
            status: l.literal("completed")
          }),
          l.object({
            type: l.literal("code_interpreter_call"),
            id: l.string(),
            code: l.string().nullable(),
            container_id: l.string(),
            outputs: l.array(
              l.discriminatedUnion("type", [
                l.object({ type: l.literal("logs"), logs: l.string() }),
                l.object({ type: l.literal("image"), url: l.string() })
              ])
            ).nullable()
          }),
          l.object({
            type: l.literal("image_generation_call"),
            id: l.string(),
            result: l.string()
          }),
          l.object({
            type: l.literal("web_search_call"),
            id: l.string(),
            status: l.string(),
            action: l.discriminatedUnion("type", [
              l.object({
                type: l.literal("search"),
                query: l.string().nullish(),
                sources: l.array(
                  l.discriminatedUnion("type", [
                    l.object({ type: l.literal("url"), url: l.string() }),
                    l.object({ type: l.literal("api"), name: l.string() })
                  ])
                ).nullish()
              }),
              l.object({
                type: l.literal("open_page"),
                url: l.string().nullish()
              }),
              l.object({
                type: l.literal("find_in_page"),
                url: l.string().nullish(),
                pattern: l.string().nullish()
              })
            ])
          }),
          l.object({
            type: l.literal("file_search_call"),
            id: l.string(),
            queries: l.array(l.string()),
            results: l.array(
              l.object({
                attributes: l.record(l.string(), l.unknown()),
                file_id: l.string(),
                filename: l.string(),
                score: l.number(),
                text: l.string()
              })
            ).nullish()
          }),
          l.object({
            type: l.literal("local_shell_call"),
            id: l.string(),
            call_id: l.string(),
            action: l.object({
              type: l.literal("exec"),
              command: l.array(l.string()),
              timeout_ms: l.number().optional(),
              user: l.string().optional(),
              working_directory: l.string().optional(),
              env: l.record(l.string(), l.string()).optional()
            })
          }),
          l.object({
            type: l.literal("computer_call"),
            id: l.string(),
            status: l.literal("completed")
          })
        ])
      }),
      l.object({
        type: l.literal("response.function_call_arguments.delta"),
        item_id: l.string(),
        output_index: l.number(),
        delta: l.string()
      }),
      l.object({
        type: l.literal("response.image_generation_call.partial_image"),
        item_id: l.string(),
        output_index: l.number(),
        partial_image_b64: l.string()
      }),
      l.object({
        type: l.literal("response.code_interpreter_call_code.delta"),
        item_id: l.string(),
        output_index: l.number(),
        delta: l.string()
      }),
      l.object({
        type: l.literal("response.code_interpreter_call_code.done"),
        item_id: l.string(),
        output_index: l.number(),
        code: l.string()
      }),
      l.object({
        type: l.literal("response.output_text.annotation.added"),
        annotation: l.discriminatedUnion("type", [
          l.object({
            type: l.literal("url_citation"),
            start_index: l.number(),
            end_index: l.number(),
            url: l.string(),
            title: l.string()
          }),
          l.object({
            type: l.literal("file_citation"),
            file_id: l.string(),
            filename: l.string().nullish(),
            index: l.number().nullish(),
            start_index: l.number().nullish(),
            end_index: l.number().nullish(),
            quote: l.string().nullish()
          })
        ])
      }),
      l.object({
        type: l.literal("response.reasoning_summary_part.added"),
        item_id: l.string(),
        summary_index: l.number()
      }),
      l.object({
        type: l.literal("response.reasoning_summary_text.delta"),
        item_id: l.string(),
        summary_index: l.number(),
        delta: l.string()
      }),
      l.object({
        type: l.literal("response.reasoning_summary_part.done"),
        item_id: l.string(),
        summary_index: l.number()
      }),
      l.object({
        type: l.literal("error"),
        sequence_number: l.number(),
        error: l.object({
          type: l.string(),
          code: l.string(),
          message: l.string(),
          param: l.string().nullish()
        })
      }),
      l.object({ type: l.string() }).loose().transform((e) => ({
        type: "unknown_chunk",
        message: e.type
      }))
      // fallback for unknown chunks
    ])
  )
), jT = ie(
  () => Z(
    l.object({
      id: l.string().optional(),
      created_at: l.number().optional(),
      error: l.object({
        message: l.string(),
        type: l.string(),
        param: l.string().nullish(),
        code: l.string()
      }).nullish(),
      model: l.string().optional(),
      output: l.array(
        l.discriminatedUnion("type", [
          l.object({
            type: l.literal("message"),
            role: l.literal("assistant"),
            id: l.string(),
            content: l.array(
              l.object({
                type: l.literal("output_text"),
                text: l.string(),
                logprobs: l.array(
                  l.object({
                    token: l.string(),
                    logprob: l.number(),
                    top_logprobs: l.array(
                      l.object({
                        token: l.string(),
                        logprob: l.number()
                      })
                    )
                  })
                ).nullish(),
                annotations: l.array(
                  l.discriminatedUnion("type", [
                    l.object({
                      type: l.literal("url_citation"),
                      start_index: l.number(),
                      end_index: l.number(),
                      url: l.string(),
                      title: l.string()
                    }),
                    l.object({
                      type: l.literal("file_citation"),
                      file_id: l.string(),
                      filename: l.string().nullish(),
                      index: l.number().nullish(),
                      start_index: l.number().nullish(),
                      end_index: l.number().nullish(),
                      quote: l.string().nullish()
                    }),
                    l.object({
                      type: l.literal("container_file_citation"),
                      container_id: l.string(),
                      file_id: l.string(),
                      filename: l.string().nullish(),
                      start_index: l.number().nullish(),
                      end_index: l.number().nullish(),
                      index: l.number().nullish()
                    }),
                    l.object({
                      type: l.literal("file_path"),
                      file_id: l.string(),
                      index: l.number().nullish()
                    })
                  ])
                )
              })
            )
          }),
          l.object({
            type: l.literal("web_search_call"),
            id: l.string(),
            status: l.string(),
            action: l.discriminatedUnion("type", [
              l.object({
                type: l.literal("search"),
                query: l.string().nullish(),
                sources: l.array(
                  l.discriminatedUnion("type", [
                    l.object({ type: l.literal("url"), url: l.string() }),
                    l.object({ type: l.literal("api"), name: l.string() })
                  ])
                ).nullish()
              }),
              l.object({
                type: l.literal("open_page"),
                url: l.string().nullish()
              }),
              l.object({
                type: l.literal("find_in_page"),
                url: l.string().nullish(),
                pattern: l.string().nullish()
              })
            ])
          }),
          l.object({
            type: l.literal("file_search_call"),
            id: l.string(),
            queries: l.array(l.string()),
            results: l.array(
              l.object({
                attributes: l.record(
                  l.string(),
                  l.union([l.string(), l.number(), l.boolean()])
                ),
                file_id: l.string(),
                filename: l.string(),
                score: l.number(),
                text: l.string()
              })
            ).nullish()
          }),
          l.object({
            type: l.literal("code_interpreter_call"),
            id: l.string(),
            code: l.string().nullable(),
            container_id: l.string(),
            outputs: l.array(
              l.discriminatedUnion("type", [
                l.object({ type: l.literal("logs"), logs: l.string() }),
                l.object({ type: l.literal("image"), url: l.string() })
              ])
            ).nullable()
          }),
          l.object({
            type: l.literal("image_generation_call"),
            id: l.string(),
            result: l.string()
          }),
          l.object({
            type: l.literal("local_shell_call"),
            id: l.string(),
            call_id: l.string(),
            action: l.object({
              type: l.literal("exec"),
              command: l.array(l.string()),
              timeout_ms: l.number().optional(),
              user: l.string().optional(),
              working_directory: l.string().optional(),
              env: l.record(l.string(), l.string()).optional()
            })
          }),
          l.object({
            type: l.literal("function_call"),
            call_id: l.string(),
            name: l.string(),
            arguments: l.string(),
            id: l.string()
          }),
          l.object({
            type: l.literal("computer_call"),
            id: l.string(),
            status: l.string().optional()
          }),
          l.object({
            type: l.literal("reasoning"),
            id: l.string(),
            encrypted_content: l.string().nullish(),
            summary: l.array(
              l.object({
                type: l.literal("summary_text"),
                text: l.string()
              })
            )
          })
        ])
      ).optional(),
      service_tier: l.string().nullish(),
      incomplete_details: l.object({ reason: l.string() }).nullish(),
      usage: l.object({
        input_tokens: l.number(),
        input_tokens_details: l.object({ cached_tokens: l.number().nullish() }).nullish(),
        output_tokens: l.number(),
        output_tokens_details: l.object({ reasoning_tokens: l.number().nullish() }).nullish()
      }).optional()
    })
  )
), lb = 20, PT = [
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
], N1 = [
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
  ...PT
], NT = ie(
  () => Z(
    l.object({
      conversation: l.string().nullish(),
      include: l.array(
        l.enum([
          "reasoning.encrypted_content",
          // handled internally by default, only needed for unknown reasoning models
          "file_search_call.results",
          "message.output_text.logprobs"
        ])
      ).nullish(),
      instructions: l.string().nullish(),
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
      logprobs: l.union([l.boolean(), l.number().min(1).max(lb)]).optional(),
      /**
       * The maximum number of total calls to built-in tools that can be processed in a response.
       * This maximum number applies across all built-in tool calls, not per individual tool.
       * Any further attempts to call a tool by the model will be ignored.
       */
      maxToolCalls: l.number().nullish(),
      metadata: l.any().nullish(),
      parallelToolCalls: l.boolean().nullish(),
      previousResponseId: l.string().nullish(),
      promptCacheKey: l.string().nullish(),
      /**
       * The retention policy for the prompt cache.
       * - 'in_memory': Default. Standard prompt caching behavior.
       * - '24h': Extended prompt caching that keeps cached prefixes active for up to 24 hours.
       *          Currently only available for 5.1 series models.
       *
       * @default 'in_memory'
       */
      promptCacheRetention: l.enum(["in_memory", "24h"]).nullish(),
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
      reasoningEffort: l.string().nullish(),
      reasoningSummary: l.string().nullish(),
      safetyIdentifier: l.string().nullish(),
      serviceTier: l.enum(["auto", "flex", "priority", "default"]).nullish(),
      store: l.boolean().nullish(),
      strictJsonSchema: l.boolean().nullish(),
      textVerbosity: l.enum(["low", "medium", "high"]).nullish(),
      truncation: l.enum(["auto", "disabled"]).nullish(),
      user: l.string().nullish()
    })
  )
);
async function AT({
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
            let u = await dt({
              value: a.args,
              schema: uT
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
            let u = await dt({
              value: a.args,
              schema: wT
            });
            r.push({
              type: "web_search_preview",
              search_context_size: u.searchContextSize,
              user_location: u.userLocation
            });
            break;
          }
          case "openai.web_search": {
            let u = await dt({
              value: a.args,
              schema: yT
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
            let u = await dt({
              value: a.args,
              schema: aT
            });
            r.push({
              type: "code_interpreter",
              container: u.container == null ? { type: "auto", file_ids: void 0 } : typeof u.container == "string" ? u.container : { type: "auto", file_ids: u.container.fileIds }
            });
            break;
          }
          case "openai.image_generation": {
            let u = await dt({
              value: a.args,
              schema: pT
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
      throw new Ve({
        functionality: `tool choice type: ${a}`
      });
    }
  }
}
s(AT, "prepareResponsesTools");
var RT = class {
  static {
    s(this, "OpenAIResponsesLanguageModel");
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
    toolChoice: f,
    responseFormat: h
  }) {
    var m, v, b, $;
    let w = [], I = nb(this.modelId);
    r != null && w.push({ type: "unsupported-setting", setting: "topK" }), u != null && w.push({ type: "unsupported-setting", setting: "seed" }), i != null && w.push({
      type: "unsupported-setting",
      setting: "presencePenalty"
    }), a != null && w.push({
      type: "unsupported-setting",
      setting: "frequencyPenalty"
    }), n != null && w.push({ type: "unsupported-setting", setting: "stopSequences" });
    let _ = await ot({
      provider: "openai",
      providerOptions: d,
      schema: NT
    });
    _?.conversation && _?.previousResponseId && w.push({
      type: "unsupported-setting",
      setting: "conversation",
      details: "conversation and previousResponseId cannot be used together"
    });
    let { input: x, warnings: C } = await zT({
      prompt: c,
      systemMessageMode: I.systemMessageMode,
      fileIdPrefixes: this.config.fileIdPrefixes,
      store: (m = _?.store) != null ? m : !0,
      hasLocalShellTool: G("openai.local_shell")
    });
    w.push(...C);
    let M = (v = _?.strictJsonSchema) != null ? v : !1, S = _?.include;
    function T(re) {
      S == null ? S = [re] : S.includes(re) || (S = [...S, re]);
    }
    s(T, "addInclude");
    function G(re) {
      return p?.find(
        (je) => je.type === "provider-defined" && je.id === re
      ) != null;
    }
    s(G, "hasOpenAITool");
    let J = typeof _?.logprobs == "number" ? _?.logprobs : _?.logprobs === !0 ? lb : void 0;
    J && T("message.output_text.logprobs");
    let ue = (b = p?.find(
      (re) => re.type === "provider-defined" && (re.id === "openai.web_search" || re.id === "openai.web_search_preview")
    )) == null ? void 0 : b.name;
    ue && T("web_search_call.action.sources"), G("openai.code_interpreter") && T("code_interpreter_call.outputs");
    let fe = _?.store;
    fe === !1 && I.isReasoningModel && T("reasoning.encrypted_content");
    let Q = {
      model: this.modelId,
      input: x,
      temperature: t,
      top_p: o,
      max_output_tokens: e,
      ...(h?.type === "json" || _?.textVerbosity) && {
        text: {
          ...h?.type === "json" && {
            format: h.schema != null ? {
              type: "json_schema",
              strict: M,
              name: ($ = h.name) != null ? $ : "response",
              description: h.description,
              schema: h.schema
            } : { type: "json_object" }
          },
          ..._?.textVerbosity && {
            verbosity: _.textVerbosity
          }
        }
      },
      // provider options:
      conversation: _?.conversation,
      max_tool_calls: _?.maxToolCalls,
      metadata: _?.metadata,
      parallel_tool_calls: _?.parallelToolCalls,
      previous_response_id: _?.previousResponseId,
      store: fe,
      user: _?.user,
      instructions: _?.instructions,
      service_tier: _?.serviceTier,
      include: S,
      prompt_cache_key: _?.promptCacheKey,
      prompt_cache_retention: _?.promptCacheRetention,
      safety_identifier: _?.safetyIdentifier,
      top_logprobs: J,
      truncation: _?.truncation,
      // model-specific settings:
      ...I.isReasoningModel && (_?.reasoningEffort != null || _?.reasoningSummary != null) && {
        reasoning: {
          ..._?.reasoningEffort != null && {
            effort: _.reasoningEffort
          },
          ..._?.reasoningSummary != null && {
            summary: _.reasoningSummary
          }
        }
      }
    };
    I.isReasoningModel ? _?.reasoningEffort === "none" && I.supportsNonReasoningParameters || (Q.temperature != null && (Q.temperature = void 0, w.push({
      type: "unsupported-setting",
      setting: "temperature",
      details: "temperature is not supported for reasoning models"
    })), Q.top_p != null && (Q.top_p = void 0, w.push({
      type: "unsupported-setting",
      setting: "topP",
      details: "topP is not supported for reasoning models"
    }))) : (_?.reasoningEffort != null && w.push({
      type: "unsupported-setting",
      setting: "reasoningEffort",
      details: "reasoningEffort is not supported for non-reasoning models"
    }), _?.reasoningSummary != null && w.push({
      type: "unsupported-setting",
      setting: "reasoningSummary",
      details: "reasoningSummary is not supported for non-reasoning models"
    })), _?.serviceTier === "flex" && !I.supportsFlexProcessing && (w.push({
      type: "unsupported-setting",
      setting: "serviceTier",
      details: "flex processing is only available for o3, o4-mini, and gpt-5 models"
    }), delete Q.service_tier), _?.serviceTier === "priority" && !I.supportsPriorityProcessing && (w.push({
      type: "unsupported-setting",
      setting: "serviceTier",
      details: "priority processing is only available for supported models (gpt-4, gpt-5, gpt-5-mini, o3, o4-mini) and requires Enterprise access. gpt-5-nano is not supported"
    }), delete Q.service_tier);
    let {
      tools: te,
      toolChoice: _e,
      toolWarnings: be
    } = await AT({
      tools: p,
      toolChoice: f,
      strictJsonSchema: M
    });
    return {
      webSearchToolName: ue,
      args: {
        ...Q,
        tools: te,
        tool_choice: _e
      },
      warnings: [...w, ...be],
      store: fe
    };
  }
  async doGenerate(e) {
    var t, n, o, r, i, a, u, c, d, p, f, h, m, v, b, $, w, I, _, x, C, M, S, T, G, J, ue, fe;
    let {
      args: Q,
      warnings: te,
      webSearchToolName: _e
    } = await this.getArgs(e), be = this.config.url({
      path: "/responses",
      modelId: this.modelId
    }), re = this.config.provider.replace(".responses", ""), {
      responseHeaders: je,
      value: xe,
      rawValue: ye
    } = await Ce({
      url: be,
      headers: Ne(this.config.headers(), e.headers),
      body: Q,
      failedResponseHandler: Bt,
      successfulResponseHandler: Me(
        jT
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    });
    if (xe.error)
      throw new Pe({
        message: xe.error.message,
        url: be,
        requestBodyValues: Q,
        statusCode: 400,
        responseHeaders: je,
        responseBody: ye,
        isRetryable: !1
      });
    let ce = [], ae = [], ge = !1;
    for (let g of xe.output)
      switch (g.type) {
        case "reasoning": {
          g.summary.length === 0 && g.summary.push({ type: "summary_text", text: "" });
          for (let L of g.summary)
            ce.push({
              type: "reasoning",
              text: L.text,
              providerMetadata: {
                [re]: {
                  itemId: g.id,
                  reasoningEncryptedContent: (t = g.encrypted_content) != null ? t : null
                }
              }
            });
          break;
        }
        case "image_generation_call": {
          ce.push({
            type: "tool-call",
            toolCallId: g.id,
            toolName: "image_generation",
            input: "{}",
            providerExecuted: !0
          }), ce.push({
            type: "tool-result",
            toolCallId: g.id,
            toolName: "image_generation",
            result: {
              result: g.result
            },
            providerExecuted: !0
          });
          break;
        }
        case "local_shell_call": {
          ce.push({
            type: "tool-call",
            toolCallId: g.call_id,
            toolName: "local_shell",
            input: JSON.stringify({
              action: g.action
            }),
            providerMetadata: {
              [re]: {
                itemId: g.id
              }
            }
          });
          break;
        }
        case "message": {
          for (let L of g.content) {
            (o = (n = e.providerOptions) == null ? void 0 : n.openai) != null && o.logprobs && L.logprobs && ae.push(L.logprobs), ce.push({
              type: "text",
              text: L.text,
              providerMetadata: {
                [re]: {
                  itemId: g.id
                }
              }
            });
            for (let B of L.annotations)
              B.type === "url_citation" ? ce.push({
                type: "source",
                sourceType: "url",
                id: (a = (i = (r = this.config).generateId) == null ? void 0 : i.call(r)) != null ? a : nt(),
                url: B.url,
                title: B.title
              }) : B.type === "file_citation" ? ce.push({
                type: "source",
                sourceType: "document",
                id: (d = (c = (u = this.config).generateId) == null ? void 0 : c.call(u)) != null ? d : nt(),
                mediaType: "text/plain",
                title: (f = (p = B.quote) != null ? p : B.filename) != null ? f : "Document",
                filename: (h = B.filename) != null ? h : B.file_id,
                ...B.file_id ? {
                  providerMetadata: {
                    [re]: {
                      fileId: B.file_id
                    }
                  }
                } : {}
              }) : B.type === "container_file_citation" ? ce.push({
                type: "source",
                sourceType: "document",
                id: (b = (v = (m = this.config).generateId) == null ? void 0 : v.call(m)) != null ? b : nt(),
                mediaType: "text/plain",
                title: (w = ($ = B.filename) != null ? $ : B.file_id) != null ? w : "Document",
                filename: (I = B.filename) != null ? I : B.file_id,
                providerMetadata: {
                  [re]: {
                    fileId: B.file_id,
                    containerId: B.container_id,
                    ...B.index != null ? { index: B.index } : {}
                  }
                }
              }) : B.type === "file_path" && ce.push({
                type: "source",
                sourceType: "document",
                id: (C = (x = (_ = this.config).generateId) == null ? void 0 : x.call(_)) != null ? C : nt(),
                mediaType: "application/octet-stream",
                title: B.file_id,
                filename: B.file_id,
                providerMetadata: {
                  [re]: {
                    fileId: B.file_id,
                    ...B.index != null ? { index: B.index } : {}
                  }
                }
              });
          }
          break;
        }
        case "function_call": {
          ge = !0, ce.push({
            type: "tool-call",
            toolCallId: g.call_id,
            toolName: g.name,
            input: g.arguments,
            providerMetadata: {
              [re]: {
                itemId: g.id
              }
            }
          });
          break;
        }
        case "web_search_call": {
          ce.push({
            type: "tool-call",
            toolCallId: g.id,
            toolName: _e ?? "web_search",
            input: JSON.stringify({}),
            providerExecuted: !0
          }), ce.push({
            type: "tool-result",
            toolCallId: g.id,
            toolName: _e ?? "web_search",
            result: tb(g.action),
            providerExecuted: !0
          });
          break;
        }
        case "computer_call": {
          ce.push({
            type: "tool-call",
            toolCallId: g.id,
            toolName: "computer_use",
            input: "",
            providerExecuted: !0
          }), ce.push({
            type: "tool-result",
            toolCallId: g.id,
            toolName: "computer_use",
            result: {
              type: "computer_use_tool_result",
              status: g.status || "completed"
            },
            providerExecuted: !0
          });
          break;
        }
        case "file_search_call": {
          ce.push({
            type: "tool-call",
            toolCallId: g.id,
            toolName: "file_search",
            input: "{}",
            providerExecuted: !0
          }), ce.push({
            type: "tool-result",
            toolCallId: g.id,
            toolName: "file_search",
            result: {
              queries: g.queries,
              results: (S = (M = g.results) == null ? void 0 : M.map((L) => ({
                attributes: L.attributes,
                fileId: L.file_id,
                filename: L.filename,
                score: L.score,
                text: L.text
              }))) != null ? S : null
            },
            providerExecuted: !0
          });
          break;
        }
        case "code_interpreter_call": {
          ce.push({
            type: "tool-call",
            toolCallId: g.id,
            toolName: "code_interpreter",
            input: JSON.stringify({
              code: g.code,
              containerId: g.container_id
            }),
            providerExecuted: !0
          }), ce.push({
            type: "tool-result",
            toolCallId: g.id,
            toolName: "code_interpreter",
            result: {
              outputs: g.outputs
            },
            providerExecuted: !0
          });
          break;
        }
      }
    let ve = {
      [re]: {
        ...xe.id != null ? { responseId: xe.id } : {}
      }
    };
    ae.length > 0 && (ve[re].logprobs = ae), typeof xe.service_tier == "string" && (ve[re].serviceTier = xe.service_tier);
    let Y = xe.usage;
    return {
      content: ce,
      finishReason: Q_({
        finishReason: (T = xe.incomplete_details) == null ? void 0 : T.reason,
        hasFunctionCall: ge
      }),
      usage: {
        inputTokens: Y.input_tokens,
        outputTokens: Y.output_tokens,
        totalTokens: Y.input_tokens + Y.output_tokens,
        reasoningTokens: (J = (G = Y.output_tokens_details) == null ? void 0 : G.reasoning_tokens) != null ? J : void 0,
        cachedInputTokens: (fe = (ue = Y.input_tokens_details) == null ? void 0 : ue.cached_tokens) != null ? fe : void 0
      },
      request: { body: Q },
      response: {
        id: xe.id,
        timestamp: new Date(xe.created_at * 1e3),
        modelId: xe.model,
        headers: je,
        body: ye
      },
      providerMetadata: ve,
      warnings: te
    };
  }
  async doStream(e) {
    let {
      args: t,
      warnings: n,
      webSearchToolName: o,
      store: r
    } = await this.getArgs(e), { responseHeaders: i, value: a } = await Ce({
      url: this.config.url({
        path: "/responses",
        modelId: this.modelId
      }),
      headers: Ne(this.config.headers(), e.headers),
      body: {
        ...t,
        stream: !0
      },
      failedResponseHandler: Bt,
      successfulResponseHandler: kr(
        OT
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    }), u = this, c = this.config.provider.replace(".responses", ""), d = "unknown", p = {
      inputTokens: void 0,
      outputTokens: void 0,
      totalTokens: void 0
    }, f = [], h = null, m = {}, v = [], b = !1, $ = {}, w;
    return {
      stream: a.pipeThrough(
        new TransformStream({
          start(I) {
            I.enqueue({ type: "stream-start", warnings: n });
          },
          transform(I, _) {
            var x, C, M, S, T, G, J, ue, fe, Q, te, _e, be, re, je, xe, ye, ce, ae, ge, ve, Y;
            if (e.includeRawChunks && _.enqueue({ type: "raw", rawValue: I.rawValue }), !I.success) {
              d = "error", _.enqueue({ type: "error", error: I.error });
              return;
            }
            let g = I.value;
            if (eb(g))
              g.item.type === "function_call" ? (m[g.output_index] = {
                toolName: g.item.name,
                toolCallId: g.item.call_id
              }, _.enqueue({
                type: "tool-input-start",
                id: g.item.call_id,
                toolName: g.item.name
              })) : g.item.type === "web_search_call" ? (m[g.output_index] = {
                toolName: o ?? "web_search",
                toolCallId: g.item.id
              }, _.enqueue({
                type: "tool-input-start",
                id: g.item.id,
                toolName: o ?? "web_search",
                providerExecuted: !0
              }), _.enqueue({
                type: "tool-input-end",
                id: g.item.id
              }), _.enqueue({
                type: "tool-call",
                toolCallId: g.item.id,
                toolName: o ?? "web_search",
                input: JSON.stringify({}),
                providerExecuted: !0
              })) : g.item.type === "computer_call" ? (m[g.output_index] = {
                toolName: "computer_use",
                toolCallId: g.item.id
              }, _.enqueue({
                type: "tool-input-start",
                id: g.item.id,
                toolName: "computer_use",
                providerExecuted: !0
              })) : g.item.type === "code_interpreter_call" ? (m[g.output_index] = {
                toolName: "code_interpreter",
                toolCallId: g.item.id,
                codeInterpreter: {
                  containerId: g.item.container_id
                }
              }, _.enqueue({
                type: "tool-input-start",
                id: g.item.id,
                toolName: "code_interpreter",
                providerExecuted: !0
              }), _.enqueue({
                type: "tool-input-delta",
                id: g.item.id,
                delta: `{"containerId":"${g.item.container_id}","code":"`
              })) : g.item.type === "file_search_call" ? _.enqueue({
                type: "tool-call",
                toolCallId: g.item.id,
                toolName: "file_search",
                input: "{}",
                providerExecuted: !0
              }) : g.item.type === "image_generation_call" ? _.enqueue({
                type: "tool-call",
                toolCallId: g.item.id,
                toolName: "image_generation",
                input: "{}",
                providerExecuted: !0
              }) : g.item.type === "message" ? (v.splice(0, v.length), _.enqueue({
                type: "text-start",
                id: g.item.id,
                providerMetadata: {
                  [c]: {
                    itemId: g.item.id
                  }
                }
              })) : eb(g) && g.item.type === "reasoning" && ($[g.item.id] = {
                encryptedContent: g.item.encrypted_content,
                summaryParts: { 0: "active" }
              }, _.enqueue({
                type: "reasoning-start",
                id: `${g.item.id}:0`,
                providerMetadata: {
                  [c]: {
                    itemId: g.item.id,
                    reasoningEncryptedContent: (x = g.item.encrypted_content) != null ? x : null
                  }
                }
              }));
            else if (DT(g)) {
              if (g.item.type === "message")
                _.enqueue({
                  type: "text-end",
                  id: g.item.id,
                  providerMetadata: {
                    [c]: {
                      itemId: g.item.id,
                      ...v.length > 0 && {
                        annotations: v
                      }
                    }
                  }
                });
              else if (g.item.type === "function_call")
                m[g.output_index] = void 0, b = !0, _.enqueue({
                  type: "tool-input-end",
                  id: g.item.call_id
                }), _.enqueue({
                  type: "tool-call",
                  toolCallId: g.item.call_id,
                  toolName: g.item.name,
                  input: g.item.arguments,
                  providerMetadata: {
                    [c]: {
                      itemId: g.item.id
                    }
                  }
                });
              else if (g.item.type === "web_search_call")
                m[g.output_index] = void 0, _.enqueue({
                  type: "tool-result",
                  toolCallId: g.item.id,
                  toolName: o ?? "web_search",
                  result: tb(g.item.action),
                  providerExecuted: !0
                });
              else if (g.item.type === "computer_call")
                m[g.output_index] = void 0, _.enqueue({
                  type: "tool-input-end",
                  id: g.item.id
                }), _.enqueue({
                  type: "tool-call",
                  toolCallId: g.item.id,
                  toolName: "computer_use",
                  input: "",
                  providerExecuted: !0
                }), _.enqueue({
                  type: "tool-result",
                  toolCallId: g.item.id,
                  toolName: "computer_use",
                  result: {
                    type: "computer_use_tool_result",
                    status: g.item.status || "completed"
                  },
                  providerExecuted: !0
                });
              else if (g.item.type === "file_search_call")
                m[g.output_index] = void 0, _.enqueue({
                  type: "tool-result",
                  toolCallId: g.item.id,
                  toolName: "file_search",
                  result: {
                    queries: g.item.queries,
                    results: (M = (C = g.item.results) == null ? void 0 : C.map((L) => ({
                      attributes: L.attributes,
                      fileId: L.file_id,
                      filename: L.filename,
                      score: L.score,
                      text: L.text
                    }))) != null ? M : null
                  },
                  providerExecuted: !0
                });
              else if (g.item.type === "code_interpreter_call")
                m[g.output_index] = void 0, _.enqueue({
                  type: "tool-result",
                  toolCallId: g.item.id,
                  toolName: "code_interpreter",
                  result: {
                    outputs: g.item.outputs
                  },
                  providerExecuted: !0
                });
              else if (g.item.type === "image_generation_call")
                _.enqueue({
                  type: "tool-result",
                  toolCallId: g.item.id,
                  toolName: "image_generation",
                  result: {
                    result: g.item.result
                  },
                  providerExecuted: !0
                });
              else if (g.item.type === "local_shell_call")
                m[g.output_index] = void 0, _.enqueue({
                  type: "tool-call",
                  toolCallId: g.item.call_id,
                  toolName: "local_shell",
                  input: JSON.stringify({
                    action: {
                      type: "exec",
                      command: g.item.action.command,
                      timeoutMs: g.item.action.timeout_ms,
                      user: g.item.action.user,
                      workingDirectory: g.item.action.working_directory,
                      env: g.item.action.env
                    }
                  }),
                  providerMetadata: {
                    [c]: { itemId: g.item.id }
                  }
                });
              else if (g.item.type === "reasoning") {
                let L = $[g.item.id], B = Object.entries(
                  L.summaryParts
                ).filter(
                  ([Le, $e]) => $e === "active" || $e === "can-conclude"
                ).map(([Le]) => Le);
                for (let Le of B)
                  _.enqueue({
                    type: "reasoning-end",
                    id: `${g.item.id}:${Le}`,
                    providerMetadata: {
                      [c]: {
                        itemId: g.item.id,
                        reasoningEncryptedContent: (S = g.item.encrypted_content) != null ? S : null
                      }
                    }
                  });
                delete $[g.item.id];
              }
            } else if (ZT(g)) {
              let L = m[g.output_index];
              L != null && _.enqueue({
                type: "tool-input-delta",
                id: L.toolCallId,
                delta: g.delta
              });
            } else if (LT(g)) {
              let L = m[g.output_index];
              L != null && _.enqueue({
                type: "tool-input-delta",
                id: L.toolCallId,
                // The delta is code, which is embedding in a JSON string.
                // To escape it, we use JSON.stringify and slice to remove the outer quotes.
                delta: JSON.stringify(g.delta).slice(1, -1)
              });
            } else if (FT(g)) {
              let L = m[g.output_index];
              L != null && (_.enqueue({
                type: "tool-input-delta",
                id: L.toolCallId,
                delta: '"}'
              }), _.enqueue({
                type: "tool-input-end",
                id: L.toolCallId
              }), _.enqueue({
                type: "tool-call",
                toolCallId: L.toolCallId,
                toolName: "code_interpreter",
                input: JSON.stringify({
                  code: g.code,
                  containerId: L.codeInterpreter.containerId
                }),
                providerExecuted: !0
              }));
            } else if (MT(g))
              h = g.response.id, _.enqueue({
                type: "response-metadata",
                id: g.response.id,
                timestamp: new Date(g.response.created_at * 1e3),
                modelId: g.response.model
              });
            else if (CT(g))
              _.enqueue({
                type: "text-delta",
                id: g.item_id,
                delta: g.delta
              }), (G = (T = e.providerOptions) == null ? void 0 : T.openai) != null && G.logprobs && g.logprobs && f.push(g.logprobs);
            else if (g.type === "response.reasoning_summary_part.added") {
              if (g.summary_index > 0) {
                let L = $[g.item_id];
                L.summaryParts[g.summary_index] = "active";
                for (let B of Object.keys(
                  L.summaryParts
                ))
                  L.summaryParts[B] === "can-conclude" && (_.enqueue({
                    type: "reasoning-end",
                    id: `${g.item_id}:${B}`,
                    providerMetadata: {
                      [c]: { itemId: g.item_id }
                    }
                  }), L.summaryParts[B] = "concluded");
                _.enqueue({
                  type: "reasoning-start",
                  id: `${g.item_id}:${g.summary_index}`,
                  providerMetadata: {
                    [c]: {
                      itemId: g.item_id,
                      reasoningEncryptedContent: (ue = (J = $[g.item_id]) == null ? void 0 : J.encryptedContent) != null ? ue : null
                    }
                  }
                });
              }
            } else g.type === "response.reasoning_summary_text.delta" ? _.enqueue({
              type: "reasoning-delta",
              id: `${g.item_id}:${g.summary_index}`,
              delta: g.delta,
              providerMetadata: {
                [c]: {
                  itemId: g.item_id
                }
              }
            }) : g.type === "response.reasoning_summary_part.done" ? r ? (_.enqueue({
              type: "reasoning-end",
              id: `${g.item_id}:${g.summary_index}`,
              providerMetadata: {
                [c]: { itemId: g.item_id }
              }
            }), $[g.item_id].summaryParts[g.summary_index] = "concluded") : $[g.item_id].summaryParts[g.summary_index] = "can-conclude" : UT(g) ? (d = Q_({
              finishReason: (fe = g.response.incomplete_details) == null ? void 0 : fe.reason,
              hasFunctionCall: b
            }), p.inputTokens = g.response.usage.input_tokens, p.outputTokens = g.response.usage.output_tokens, p.totalTokens = g.response.usage.input_tokens + g.response.usage.output_tokens, p.reasoningTokens = (te = (Q = g.response.usage.output_tokens_details) == null ? void 0 : Q.reasoning_tokens) != null ? te : void 0, p.cachedInputTokens = (be = (_e = g.response.usage.input_tokens_details) == null ? void 0 : _e.cached_tokens) != null ? be : void 0, typeof g.response.service_tier == "string" && (w = g.response.service_tier)) : VT(g) ? (v.push(g.annotation), g.annotation.type === "url_citation" ? _.enqueue({
              type: "source",
              sourceType: "url",
              id: (xe = (je = (re = u.config).generateId) == null ? void 0 : je.call(re)) != null ? xe : nt(),
              url: g.annotation.url,
              title: g.annotation.title
            }) : g.annotation.type === "file_citation" && _.enqueue({
              type: "source",
              sourceType: "document",
              id: (ae = (ce = (ye = u.config).generateId) == null ? void 0 : ce.call(ye)) != null ? ae : nt(),
              mediaType: "text/plain",
              title: (ve = (ge = g.annotation.quote) != null ? ge : g.annotation.filename) != null ? ve : "Document",
              filename: (Y = g.annotation.filename) != null ? Y : g.annotation.file_id,
              ...g.annotation.file_id ? {
                providerMetadata: {
                  [c]: {
                    fileId: g.annotation.file_id
                  }
                }
              } : {}
            })) : qT(g) && _.enqueue({ type: "error", error: g });
          },
          flush(I) {
            let _ = {
              [c]: {
                responseId: h
              }
            };
            f.length > 0 && (_[c].logprobs = f), w !== void 0 && (_[c].serviceTier = w), I.enqueue({
              type: "finish",
              finishReason: d,
              usage: p,
              providerMetadata: _
            });
          }
        })
      ),
      request: { body: t },
      response: { headers: i }
    };
  }
};
function CT(e) {
  return e.type === "response.output_text.delta";
}
s(CT, "isTextDeltaChunk");
function DT(e) {
  return e.type === "response.output_item.done";
}
s(DT, "isResponseOutputItemDoneChunk");
function UT(e) {
  return e.type === "response.completed" || e.type === "response.incomplete";
}
s(UT, "isResponseFinishedChunk");
function MT(e) {
  return e.type === "response.created";
}
s(MT, "isResponseCreatedChunk");
function ZT(e) {
  return e.type === "response.function_call_arguments.delta";
}
s(ZT, "isResponseFunctionCallArgumentsDeltaChunk");
function LT(e) {
  return e.type === "response.code_interpreter_call_code.delta";
}
s(LT, "isResponseCodeInterpreterCallCodeDeltaChunk");
function FT(e) {
  return e.type === "response.code_interpreter_call_code.done";
}
s(FT, "isResponseCodeInterpreterCallCodeDoneChunk");
function eb(e) {
  return e.type === "response.output_item.added";
}
s(eb, "isResponseOutputItemAddedChunk");
function VT(e) {
  return e.type === "response.output_text.annotation.added";
}
s(VT, "isResponseAnnotationAddedChunk");
function qT(e) {
  return e.type === "error";
}
s(qT, "isErrorChunk");
function tb(e) {
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
s(tb, "mapWebSearchOutput");
var JT = ie(
  () => Z(
    l.object({
      instructions: l.string().nullish(),
      speed: l.number().min(0.25).max(4).default(1).nullish()
    })
  )
), BT = class {
  static {
    s(this, "OpenAISpeechModel");
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
    let u = [], c = await ot({
      provider: "openai",
      providerOptions: a,
      schema: JT
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
      for (let f in p) {
        let h = p[f];
        h !== void 0 && (d[f] = h);
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
    } = await Ce({
      url: this.config.url({
        path: "/audio/speech",
        modelId: this.modelId
      }),
      headers: Ne(this.config.headers(), e.headers),
      body: i,
      failedResponseHandler: Bt,
      successfulResponseHandler: Iv(),
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
}, GT = ie(
  () => Z(
    l.object({
      text: l.string(),
      language: l.string().nullish(),
      duration: l.number().nullish(),
      words: l.array(
        l.object({
          word: l.string(),
          start: l.number(),
          end: l.number()
        })
      ).nullish(),
      segments: l.array(
        l.object({
          id: l.number(),
          seek: l.number(),
          start: l.number(),
          end: l.number(),
          text: l.string(),
          tokens: l.array(l.number()),
          temperature: l.number(),
          avg_logprob: l.number(),
          compression_ratio: l.number(),
          no_speech_prob: l.number()
        })
      ).nullish()
    })
  )
), WT = ie(
  () => Z(
    l.object({
      /**
       * Additional information to include in the transcription response.
       */
      include: l.array(l.string()).optional(),
      /**
       * The language of the input audio in ISO-639-1 format.
       */
      language: l.string().optional(),
      /**
       * An optional text to guide the model's style or continue a previous audio segment.
       */
      prompt: l.string().optional(),
      /**
       * The sampling temperature, between 0 and 1.
       * @default 0
       */
      temperature: l.number().min(0).max(1).default(0).optional(),
      /**
       * The timestamp granularities to populate for this transcription.
       * @default ['segment']
       */
      timestampGranularities: l.array(l.enum(["word", "segment"])).default(["segment"]).optional()
    })
  )
), rb = {
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
}, KT = class {
  static {
    s(this, "OpenAITranscriptionModel");
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
    let o = [], r = await ot({
      provider: "openai",
      providerOptions: n,
      schema: WT
    }), i = new FormData(), a = e instanceof Uint8Array ? new Blob([e]) : new Blob([Ir(e)]);
    i.append("model", this.modelId);
    let u = $v(t);
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
            for (let f of p)
              i.append(`${d}[]`, String(f));
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
    let d = (o = (n = (t = this.config._internal) == null ? void 0 : t.currentDate) == null ? void 0 : n.call(t)) != null ? o : /* @__PURE__ */ new Date(), { formData: p, warnings: f } = await this.getArgs(e), {
      value: h,
      responseHeaders: m,
      rawValue: v
    } = await wv({
      url: this.config.url({
        path: "/audio/transcriptions",
        modelId: this.modelId
      }),
      headers: Ne(this.config.headers(), e.headers),
      formData: p,
      failedResponseHandler: Bt,
      successfulResponseHandler: Me(
        GT
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    }), b = h.language != null && h.language in rb ? rb[h.language] : void 0;
    return {
      text: h.text,
      segments: (u = (a = (r = h.segments) == null ? void 0 : r.map(($) => ({
        text: $.text,
        startSecond: $.start,
        endSecond: $.end
      }))) != null ? a : (i = h.words) == null ? void 0 : i.map(($) => ({
        text: $.word,
        startSecond: $.start,
        endSecond: $.end
      }))) != null ? u : [],
      language: b,
      durationInSeconds: (c = h.duration) != null ? c : void 0,
      warnings: f,
      response: {
        timestamp: d,
        modelId: this.modelId,
        headers: m,
        body: v
      }
    };
  }
}, HT = "2.0.89";
function XT(e = {}) {
  var t, n;
  let o = (t = ns(
    Lr({
      settingValue: e.baseURL,
      environmentVariableName: "OPENAI_BASE_URL"
    })
  )) != null ? t : "https://api.openai.com/v1", r = (n = e.name) != null ? n : "openai", i = /* @__PURE__ */ s(() => He(
    {
      Authorization: `Bearer ${xv({
        apiKey: e.apiKey,
        environmentVariableName: "OPENAI_API_KEY",
        description: "OpenAI"
      })}`,
      "OpenAI-Organization": e.organization,
      "OpenAI-Project": e.project,
      ...e.headers
    },
    `ai-sdk/openai/${HT}`
  ), "getHeaders"), a = /* @__PURE__ */ s((b) => new B0(b, {
    provider: `${r}.chat`,
    url: /* @__PURE__ */ s(({ path: $ }) => `${o}${$}`, "url"),
    headers: i,
    fetch: e.fetch
  }), "createChatModel"), u = /* @__PURE__ */ s((b) => new H0(b, {
    provider: `${r}.completion`,
    url: /* @__PURE__ */ s(({ path: $ }) => `${o}${$}`, "url"),
    headers: i,
    fetch: e.fetch
  }), "createCompletionModel"), c = /* @__PURE__ */ s((b) => new Q0(b, {
    provider: `${r}.embedding`,
    url: /* @__PURE__ */ s(({ path: $ }) => `${o}${$}`, "url"),
    headers: i,
    fetch: e.fetch
  }), "createEmbeddingModel"), d = /* @__PURE__ */ s((b) => new nT(b, {
    provider: `${r}.image`,
    url: /* @__PURE__ */ s(({ path: $ }) => `${o}${$}`, "url"),
    headers: i,
    fetch: e.fetch
  }), "createImageModel"), p = /* @__PURE__ */ s((b) => new KT(b, {
    provider: `${r}.transcription`,
    url: /* @__PURE__ */ s(({ path: $ }) => `${o}${$}`, "url"),
    headers: i,
    fetch: e.fetch
  }), "createTranscriptionModel"), f = /* @__PURE__ */ s((b) => new BT(b, {
    provider: `${r}.speech`,
    url: /* @__PURE__ */ s(({ path: $ }) => `${o}${$}`, "url"),
    headers: i,
    fetch: e.fetch
  }), "createSpeechModel"), h = /* @__PURE__ */ s((b) => {
    if (new.target)
      throw new Error(
        "The OpenAI model function cannot be called with the new keyword."
      );
    return m(b);
  }, "createLanguageModel"), m = /* @__PURE__ */ s((b) => new RT(b, {
    provider: `${r}.responses`,
    url: /* @__PURE__ */ s(({ path: $ }) => `${o}${$}`, "url"),
    headers: i,
    fetch: e.fetch,
    fileIdPrefixes: ["file-"]
  }), "createResponsesModel"), v = /* @__PURE__ */ s(function(b) {
    return h(b);
  }, "provider");
  return v.languageModel = h, v.chat = a, v.completion = u, v.responses = m, v.embedding = c, v.textEmbedding = c, v.textEmbeddingModel = c, v.image = d, v.imageModel = d, v.transcription = p, v.transcriptionModel = p, v.speech = f, v.speechModel = f, v.tools = TT, v;
}
s(XT, "createOpenAI");
var q1 = XT();

export {
  l as a,
  R_ as b,
  LR as c,
  HR as d,
  YR as e,
  eC as f,
  aC as g,
  lC as h,
  pC as i,
  q1 as j
};
//# sourceMappingURL=YW3B7PJC.js.map
