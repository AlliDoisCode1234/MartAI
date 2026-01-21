import {
  a as n,
  c,
  e as wr
} from "./V7X2J7BI.js";

// node_modules/convex/dist/esm/values/base64.js
function gr(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var r = t.indexOf("=");
  r === -1 && (r = e);
  var o = r === e ? 0 : 4 - r % 4;
  return [r, o];
}
function br(t, e, r) {
  return (e + r) * 3 / 4 - r;
}
function k(t) {
  var e, r = gr(t), o = r[0], s = r[1], i = new xr(br(t, o, s)), a = 0, d = s > 0 ? o - 4 : o, w;
  for (w = 0; w < d; w += 4)
    e = v[t.charCodeAt(w)] << 18 | v[t.charCodeAt(w + 1)] << 12 | v[t.charCodeAt(w + 2)] << 6 | v[t.charCodeAt(w + 3)], i[a++] = e >> 16 & 255, i[a++] = e >> 8 & 255, i[a++] = e & 255;
  return s === 2 && (e = v[t.charCodeAt(w)] << 2 | v[t.charCodeAt(w + 1)] >> 4, i[a++] = e & 255), s === 1 && (e = v[t.charCodeAt(w)] << 10 | v[t.charCodeAt(w + 1)] << 4 | v[t.charCodeAt(w + 2)] >> 2, i[a++] = e >> 8 & 255, i[a++] = e & 255), i;
}
function vr(t) {
  return S[t >> 18 & 63] + S[t >> 12 & 63] + S[t >> 6 & 63] + S[t & 63];
}
function Ar(t, e, r) {
  for (var o, s = [], i = e; i < r; i += 3)
    o = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(vr(o));
  return s.join("");
}
function G(t) {
  for (var e, r = t.length, o = r % 3, s = [], i = 16383, a = 0, d = r - o; a < d; a += i)
    s.push(
      Ar(
        t,
        a,
        a + i > d ? d : a + i
      )
    );
  return o === 1 ? (e = t[r - 1], s.push(S[e >> 2] + S[e << 4 & 63] + "==")) : o === 2 && (e = (t[r - 2] << 8) + t[r - 1], s.push(
    S[e >> 10] + S[e >> 4 & 63] + S[e << 2 & 63] + "="
  )), s.join("");
}
var S, v, xr, Te, N, ft, _e = c(() => {
  "use strict";
  S = [], v = [], xr = Uint8Array, Te = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (N = 0, ft = Te.length; N < ft; ++N)
    S[N] = Te[N], v[Te.charCodeAt(N)] = N;
  v[45] = 62;
  v[95] = 63;
  n(gr, "getLens");
  n(br, "_byteLength");
  n(k, "toByteArray");
  n(vr, "tripletToBase64");
  n(Ar, "encodeChunk");
  n(G, "fromByteArray");
});

// node_modules/convex/dist/esm/common/index.js
function _(t) {
  if (t === void 0)
    return {};
  if (!Ce(t))
    throw new Error(
      `The arguments to a Convex function must be an object. Received: ${t}`
    );
  return t;
}
function Ce(t) {
  let e = typeof t == "object", r = Object.getPrototypeOf(t), o = r === null || r === Object.prototype || // Objects generated from other contexts (e.g. across Node.js `vm` modules) will not satisfy the previous
  // conditions but are still simple objects.
  r?.constructor?.name === "Object";
  return e && o;
}
var B = c(() => {
  "use strict";
  n(_, "parseArgs");
  n(Ce, "isSimpleObject");
});

// node_modules/convex/dist/esm/values/value.js
function yt(t) {
  return Number.isNaN(t) || !Number.isFinite(t) || Object.is(t, -0);
}
function Sr(t) {
  t < Ne && (t -= j + j);
  let e = t.toString(16);
  e.length % 2 === 1 && (e = "0" + e);
  let r = new Uint8Array(new ArrayBuffer(8)), o = 0;
  for (let s of e.match(/.{2}/g).reverse())
    r.set([parseInt(s, 16)], o++), t >>= Er;
  return G(r);
}
function Or(t) {
  let e = k(t);
  if (e.byteLength !== 8)
    throw new Error(
      `Received ${e.byteLength} bytes, expected 8 for $integer`
    );
  let r = Ne, o = Ne;
  for (let s of e)
    r += BigInt(s) * Ir ** o, o++;
  return r > Fe && (r += j + j), r;
}
function Tr(t) {
  if (t < j || Fe < t)
    throw new Error(
      `BigInt ${t} does not fit into a 64-bit signed integer.`
    );
  let e = new ArrayBuffer(8);
  return new DataView(e).setBigInt64(0, t, !0), G(new Uint8Array(e));
}
function _r(t) {
  let e = k(t);
  if (e.byteLength !== 8)
    throw new Error(
      `Received ${e.byteLength} bytes, expected 8 for $integer`
    );
  return new DataView(e.buffer).getBigInt64(0, !0);
}
function Pe(t) {
  if (t.length > dt)
    throw new Error(
      `Field name ${t} exceeds maximum field name length ${dt}.`
    );
  if (t.startsWith("$"))
    throw new Error(`Field name ${t} starts with a '$', which is reserved.`);
  for (let e = 0; e < t.length; e += 1) {
    let r = t.charCodeAt(e);
    if (r < 32 || r >= 127)
      throw new Error(
        `Field name ${t} has invalid character '${t[e]}': Field names can only contain non-control ASCII characters`
      );
  }
}
function y(t) {
  if (t === null || typeof t == "boolean" || typeof t == "number" || typeof t == "string")
    return t;
  if (Array.isArray(t))
    return t.map((o) => y(o));
  if (typeof t != "object")
    throw new Error(`Unexpected type of ${t}`);
  let e = Object.entries(t);
  if (e.length === 1) {
    let o = e[0][0];
    if (o === "$bytes") {
      if (typeof t.$bytes != "string")
        throw new Error(`Malformed $bytes field on ${t}`);
      return k(t.$bytes).buffer;
    }
    if (o === "$integer") {
      if (typeof t.$integer != "string")
        throw new Error(`Malformed $integer field on ${t}`);
      return $r(t.$integer);
    }
    if (o === "$float") {
      if (typeof t.$float != "string")
        throw new Error(`Malformed $float field on ${t}`);
      let s = k(t.$float);
      if (s.byteLength !== 8)
        throw new Error(
          `Received ${s.byteLength} bytes, expected 8 for $float`
        );
      let a = new DataView(s.buffer).getFloat64(0, mt);
      if (!yt(a))
        throw new Error(`Float ${a} should be encoded as a number`);
      return a;
    }
    if (o === "$set")
      throw new Error(
        "Received a Set which is no longer supported as a Convex type."
      );
    if (o === "$map")
      throw new Error(
        "Received a Map which is no longer supported as a Convex type."
      );
  }
  let r = {};
  for (let [o, s] of Object.entries(t))
    Pe(o), r[o] = y(s);
  return r;
}
function P(t) {
  let e = JSON.stringify(t, (r, o) => o === void 0 ? "undefined" : typeof o == "bigint" ? `${o.toString()}n` : o);
  if (e.length > ht) {
    let r = "[...truncated]", o = ht - r.length, s = e.codePointAt(o - 1);
    return s !== void 0 && s > 65535 && (o -= 1), e.substring(0, o) + r;
  }
  return e;
}
function Q(t, e, r, o) {
  if (t === void 0) {
    let a = r && ` (present at path ${r} in original object ${P(
      e
    )})`;
    throw new Error(
      `undefined is not a valid Convex value${a}. To learn about Convex's supported types, see https://docs.convex.dev/using/types.`
    );
  }
  if (t === null)
    return t;
  if (typeof t == "bigint") {
    if (t < j || Fe < t)
      throw new Error(
        `BigInt ${t} does not fit into a 64-bit signed integer.`
      );
    return { $integer: Cr(t) };
  }
  if (typeof t == "number")
    if (yt(t)) {
      let a = new ArrayBuffer(8);
      return new DataView(a).setFloat64(0, t, mt), { $float: G(new Uint8Array(a)) };
    } else
      return t;
  if (typeof t == "boolean" || typeof t == "string")
    return t;
  if (t instanceof ArrayBuffer)
    return { $bytes: G(new Uint8Array(t)) };
  if (Array.isArray(t))
    return t.map(
      (a, d) => Q(a, e, r + `[${d}]`, !1)
    );
  if (t instanceof Set)
    throw new Error(
      $e(r, "Set", [...t], e)
    );
  if (t instanceof Map)
    throw new Error(
      $e(r, "Map", [...t], e)
    );
  if (!Ce(t)) {
    let a = t?.constructor?.name, d = a ? `${a} ` : "";
    throw new Error(
      $e(r, d, t, e)
    );
  }
  let s = {}, i = Object.entries(t);
  i.sort(([a, d], [w, L]) => a === w ? 0 : a < w ? -1 : 1);
  for (let [a, d] of i)
    d !== void 0 ? (Pe(a), s[a] = Q(d, e, r + `.${a}`, !1)) : o && (Pe(a), s[a] = wt(
      d,
      e,
      r + `.${a}`
    ));
  return s;
}
function $e(t, e, r, o) {
  return t ? `${e}${P(
    r
  )} is not a supported Convex type (present at path ${t} in original object ${P(
    o
  )}). To learn about Convex's supported types, see https://docs.convex.dev/using/types.` : `${e}${P(
    r
  )} is not a supported Convex type.`;
}
function wt(t, e, r) {
  if (t === void 0)
    return { $undefined: null };
  if (e === void 0)
    throw new Error(
      `Programming error. Current value is ${P(
        t
      )} but original value is undefined`
    );
  return Q(t, e, r, !1);
}
function h(t) {
  return Q(t, t, "", !1);
}
function A(t) {
  return wt(t, t, "");
}
function xt(t) {
  return Q(t, t, "", !0);
}
var mt, j, Fe, Ne, Er, Ir, Cr, $r, dt, ht, O = c(() => {
  "use strict";
  _e();
  B();
  mt = !0, j = BigInt("-9223372036854775808"), Fe = BigInt("9223372036854775807"), Ne = BigInt("0"), Er = BigInt("8"), Ir = BigInt("256");
  n(yt, "isSpecial");
  n(Sr, "slowBigIntToBase64");
  n(Or, "slowBase64ToBigInt");
  n(Tr, "modernBigIntToBase64");
  n(_r, "modernBase64ToBigInt");
  Cr = DataView.prototype.setBigInt64 ? Tr : Sr, $r = DataView.prototype.getBigInt64 ? _r : Or, dt = 1024;
  n(Pe, "validateObjectField");
  n(y, "jsonToConvex");
  ht = 16384;
  n(P, "stringifyValueForError");
  n(Q, "convexToJsonInternal");
  n($e, "errorMessageForUnsupportedType");
  n(wt, "convexOrUndefinedToJsonInternal");
  n(h, "convexToJson");
  n(A, "convexOrUndefinedToJson");
  n(xt, "patchValueToJson");
});

// node_modules/convex/dist/esm/values/validators.js
function D(t, e) {
  let r = e !== void 0 ? ` for field "${e}"` : "";
  throw new Error(
    `A validator is undefined${r} in ${t}. This is often caused by circular imports. See ${Fr} for details.`
  );
}
var Nr, Pr, m, Fr, b, re, H, W, ne, oe, se, ie, ae, ue, ce, le, fe, pe, gt = c(() => {
  "use strict";
  O();
  Nr = Object.defineProperty, Pr = /* @__PURE__ */ n((t, e, r) => e in t ? Nr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), m = /* @__PURE__ */ n((t, e, r) => Pr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), Fr = "https://docs.convex.dev/error#undefined-validator";
  n(D, "throwUndefinedValidatorError");
  b = class {
    static {
      n(this, "BaseValidator");
    }
    constructor({ isOptional: e }) {
      m(this, "type"), m(this, "fieldPaths"), m(this, "isOptional"), m(this, "isConvexValidator"), this.isOptional = e, this.isConvexValidator = !0;
    }
  }, re = class t extends b {
    static {
      n(this, "VId");
    }
    /**
     * Usually you'd use `v.id(tableName)` instead.
     */
    constructor({
      isOptional: e,
      tableName: r
    }) {
      if (super({ isOptional: e }), m(this, "tableName"), m(this, "kind", "id"), typeof r != "string")
        throw new Error("v.id(tableName) requires a string");
      this.tableName = r;
    }
    /** @internal */
    get json() {
      return { type: "id", tableName: this.tableName };
    }
    /** @internal */
    asOptional() {
      return new t({
        isOptional: "optional",
        tableName: this.tableName
      });
    }
  }, H = class t extends b {
    static {
      n(this, "VFloat64");
    }
    constructor() {
      super(...arguments), m(this, "kind", "float64");
    }
    /** @internal */
    get json() {
      return { type: "number" };
    }
    /** @internal */
    asOptional() {
      return new t({
        isOptional: "optional"
      });
    }
  }, W = class t extends b {
    static {
      n(this, "VInt64");
    }
    constructor() {
      super(...arguments), m(this, "kind", "int64");
    }
    /** @internal */
    get json() {
      return { type: "bigint" };
    }
    /** @internal */
    asOptional() {
      return new t({ isOptional: "optional" });
    }
  }, ne = class t extends b {
    static {
      n(this, "VBoolean");
    }
    constructor() {
      super(...arguments), m(this, "kind", "boolean");
    }
    /** @internal */
    get json() {
      return { type: this.kind };
    }
    /** @internal */
    asOptional() {
      return new t({
        isOptional: "optional"
      });
    }
  }, oe = class t extends b {
    static {
      n(this, "VBytes");
    }
    constructor() {
      super(...arguments), m(this, "kind", "bytes");
    }
    /** @internal */
    get json() {
      return { type: this.kind };
    }
    /** @internal */
    asOptional() {
      return new t({ isOptional: "optional" });
    }
  }, se = class t extends b {
    static {
      n(this, "VString");
    }
    constructor() {
      super(...arguments), m(this, "kind", "string");
    }
    /** @internal */
    get json() {
      return { type: this.kind };
    }
    /** @internal */
    asOptional() {
      return new t({
        isOptional: "optional"
      });
    }
  }, ie = class t extends b {
    static {
      n(this, "VNull");
    }
    constructor() {
      super(...arguments), m(this, "kind", "null");
    }
    /** @internal */
    get json() {
      return { type: this.kind };
    }
    /** @internal */
    asOptional() {
      return new t({ isOptional: "optional" });
    }
  }, ae = class t extends b {
    static {
      n(this, "VAny");
    }
    constructor() {
      super(...arguments), m(this, "kind", "any");
    }
    /** @internal */
    get json() {
      return {
        type: this.kind
      };
    }
    /** @internal */
    asOptional() {
      return new t({
        isOptional: "optional"
      });
    }
  }, ue = class t extends b {
    static {
      n(this, "VObject");
    }
    /**
     * Usually you'd use `v.object({ ... })` instead.
     */
    constructor({
      isOptional: e,
      fields: r
    }) {
      super({ isOptional: e }), m(this, "fields"), m(this, "kind", "object"), globalThis.Object.entries(r).forEach(([o, s]) => {
        if (s === void 0 && D("v.object()", o), !s.isConvexValidator)
          throw new Error("v.object() entries must be validators");
      }), this.fields = r;
    }
    /** @internal */
    get json() {
      return {
        type: this.kind,
        value: globalThis.Object.fromEntries(
          globalThis.Object.entries(this.fields).map(([e, r]) => [
            e,
            {
              fieldType: r.json,
              optional: r.isOptional === "optional"
            }
          ])
        )
      };
    }
    /** @internal */
    asOptional() {
      return new t({
        isOptional: "optional",
        fields: this.fields
      });
    }
    /**
     * Create a new VObject with the specified fields omitted.
     * @param fields The field names to omit from this VObject.
     */
    omit(...e) {
      let r = { ...this.fields };
      for (let o of e)
        delete r[o];
      return new t({
        isOptional: this.isOptional,
        fields: r
      });
    }
    /**
     * Create a new VObject with only the specified fields.
     * @param fields The field names to pick from this VObject.
     */
    pick(...e) {
      let r = {};
      for (let o of e)
        r[o] = this.fields[o];
      return new t({
        isOptional: this.isOptional,
        fields: r
      });
    }
    /**
     * Create a new VObject with all fields marked as optional.
     */
    partial() {
      let e = {};
      for (let [r, o] of globalThis.Object.entries(this.fields))
        e[r] = o.asOptional();
      return new t({
        isOptional: this.isOptional,
        fields: e
      });
    }
    /**
     * Create a new VObject with additional fields merged in.
     * @param fields An object with additional validators to merge into this VObject.
     */
    extend(e) {
      return new t({
        isOptional: this.isOptional,
        fields: { ...this.fields, ...e }
      });
    }
  }, ce = class t extends b {
    static {
      n(this, "VLiteral");
    }
    /**
     * Usually you'd use `v.literal(value)` instead.
     */
    constructor({ isOptional: e, value: r }) {
      if (super({ isOptional: e }), m(this, "value"), m(this, "kind", "literal"), typeof r != "string" && typeof r != "boolean" && typeof r != "number" && typeof r != "bigint")
        throw new Error("v.literal(value) must be a string, number, or boolean");
      this.value = r;
    }
    /** @internal */
    get json() {
      return {
        type: this.kind,
        value: h(this.value)
      };
    }
    /** @internal */
    asOptional() {
      return new t({
        isOptional: "optional",
        value: this.value
      });
    }
  }, le = class t extends b {
    static {
      n(this, "VArray");
    }
    /**
     * Usually you'd use `v.array(element)` instead.
     */
    constructor({
      isOptional: e,
      element: r
    }) {
      super({ isOptional: e }), m(this, "element"), m(this, "kind", "array"), r === void 0 && D("v.array()"), this.element = r;
    }
    /** @internal */
    get json() {
      return {
        type: this.kind,
        value: this.element.json
      };
    }
    /** @internal */
    asOptional() {
      return new t({
        isOptional: "optional",
        element: this.element
      });
    }
  }, fe = class t extends b {
    static {
      n(this, "VRecord");
    }
    /**
     * Usually you'd use `v.record(key, value)` instead.
     */
    constructor({
      isOptional: e,
      key: r,
      value: o
    }) {
      if (super({ isOptional: e }), m(this, "key"), m(this, "value"), m(this, "kind", "record"), r === void 0 && D("v.record()", "key"), o === void 0 && D("v.record()", "value"), r.isOptional === "optional")
        throw new Error("Record validator cannot have optional keys");
      if (o.isOptional === "optional")
        throw new Error("Record validator cannot have optional values");
      if (!r.isConvexValidator || !o.isConvexValidator)
        throw new Error("Key and value of v.record() but be validators");
      this.key = r, this.value = o;
    }
    /** @internal */
    get json() {
      return {
        type: this.kind,
        // This cast is needed because TypeScript thinks the key type is too wide
        keys: this.key.json,
        values: {
          fieldType: this.value.json,
          optional: !1
        }
      };
    }
    /** @internal */
    asOptional() {
      return new t({
        isOptional: "optional",
        key: this.key,
        value: this.value
      });
    }
  }, pe = class t extends b {
    static {
      n(this, "VUnion");
    }
    /**
     * Usually you'd use `v.union(...members)` instead.
     */
    constructor({ isOptional: e, members: r }) {
      super({ isOptional: e }), m(this, "members"), m(this, "kind", "union"), r.forEach((o, s) => {
        if (o === void 0 && D("v.union()", `member at index ${s}`), !o.isConvexValidator)
          throw new Error("All members of v.union() must be validators");
      }), this.members = r;
    }
    /** @internal */
    get json() {
      return {
        type: this.kind,
        value: this.members.map((e) => e.json)
      };
    }
    /** @internal */
    asOptional() {
      return new t({
        isOptional: "optional",
        members: this.members
      });
    }
  };
});

// node_modules/convex/dist/esm/values/validator.js
function Re(t) {
  return !!t.isConvexValidator;
}
function de(t) {
  return Re(t) ? t : u.object(t);
}
var u, z = c(() => {
  "use strict";
  gt();
  n(Re, "isValidator");
  n(de, "asObjectValidator");
  u = {
    /**
     * Validates that the value corresponds to an ID of a document in given table.
     * @param tableName The name of the table.
     */
    id: /* @__PURE__ */ n((t) => new re({
      isOptional: "required",
      tableName: t
    }), "id"),
    /**
     * Validates that the value is of type Null.
     */
    null: /* @__PURE__ */ n(() => new ie({ isOptional: "required" }), "null"),
    /**
     * Validates that the value is of Convex type Float64 (Number in JS).
     *
     * Alias for `v.float64()`
     */
    number: /* @__PURE__ */ n(() => new H({ isOptional: "required" }), "number"),
    /**
     * Validates that the value is of Convex type Float64 (Number in JS).
     */
    float64: /* @__PURE__ */ n(() => new H({ isOptional: "required" }), "float64"),
    /**
     * @deprecated Use `v.int64()` instead
     */
    bigint: /* @__PURE__ */ n(() => new W({ isOptional: "required" }), "bigint"),
    /**
     * Validates that the value is of Convex type Int64 (BigInt in JS).
     */
    int64: /* @__PURE__ */ n(() => new W({ isOptional: "required" }), "int64"),
    /**
     * Validates that the value is of type Boolean.
     */
    boolean: /* @__PURE__ */ n(() => new ne({ isOptional: "required" }), "boolean"),
    /**
     * Validates that the value is of type String.
     */
    string: /* @__PURE__ */ n(() => new se({ isOptional: "required" }), "string"),
    /**
     * Validates that the value is of Convex type Bytes (constructed in JS via `ArrayBuffer`).
     */
    bytes: /* @__PURE__ */ n(() => new oe({ isOptional: "required" }), "bytes"),
    /**
     * Validates that the value is equal to the given literal value.
     * @param literal The literal value to compare against.
     */
    literal: /* @__PURE__ */ n((t) => new ce({ isOptional: "required", value: t }), "literal"),
    /**
     * Validates that the value is an Array of the given element type.
     * @param element The validator for the elements of the array.
     */
    array: /* @__PURE__ */ n((t) => new le({ isOptional: "required", element: t }), "array"),
    /**
     * Validates that the value is an Object with the given properties.
     * @param fields An object specifying the validator for each property.
     */
    object: /* @__PURE__ */ n((t) => new ue({ isOptional: "required", fields: t }), "object"),
    /**
     * Validates that the value is a Record with keys and values that match the given types.
     * @param keys The validator for the keys of the record. This cannot contain string literals.
     * @param values The validator for the values of the record.
     */
    record: /* @__PURE__ */ n((t, e) => new fe({
      isOptional: "required",
      key: t,
      value: e
    }), "record"),
    /**
     * Validates that the value matches one of the given validators.
     * @param members The validators to match against.
     */
    union: /* @__PURE__ */ n((...t) => new pe({
      isOptional: "required",
      members: t
    }), "union"),
    /**
     * Does not validate the value.
     */
    any: /* @__PURE__ */ n(() => new ae({ isOptional: "required" }), "any"),
    /**
     * Allows not specifying a value for a property in an Object.
     * @param value The property value validator to make optional.
     *
     * ```typescript
     * const objectWithOptionalFields = v.object({
     *   requiredField: v.string(),
     *   optionalField: v.optional(v.string()),
     * });
     * ```
     */
    optional: /* @__PURE__ */ n((t) => t.asOptional(), "optional"),
    /**
     * Allows specifying a value or null.
     */
    nullable: /* @__PURE__ */ n((t) => u.union(t, u.null()), "nullable")
  };
});

// node_modules/convex/dist/esm/values/errors.js
var Rr, qr, qe, bt, vt, Br, he, Be = c(() => {
  "use strict";
  O();
  Rr = Object.defineProperty, qr = /* @__PURE__ */ n((t, e, r) => e in t ? Rr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), qe = /* @__PURE__ */ n((t, e, r) => qr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), Br = Symbol.for("ConvexError"), he = class extends (vt = Error, bt = Br, vt) {
    static {
      n(this, "ConvexError");
    }
    constructor(e) {
      super(typeof e == "string" ? e : P(e)), qe(this, "name", "ConvexError"), qe(this, "data"), qe(this, bt, !0), this.data = e;
    }
  };
});

// node_modules/convex/dist/esm/values/compare_utf8.js
var At, qn, Bn, Et = c(() => {
  "use strict";
  At = /* @__PURE__ */ n(() => Array.from({ length: 4 }, () => 0), "arr"), qn = At(), Bn = At();
});

// node_modules/convex/dist/esm/values/compare.js
var It = c(() => {
  "use strict";
  Et();
});

// node_modules/convex/dist/esm/values/index.js
var C = c(() => {
  "use strict";
  O();
  z();
  _e();
  Be();
  It();
});

// node_modules/convex/dist/esm/server/database.js
var St = c(() => {
  "use strict";
});

// node_modules/convex/dist/esm/index.js
var x, $ = c(() => {
  "use strict";
  x = "1.31.3";
});

// node_modules/convex/dist/esm/server/impl/syscall.js
function X(t, e) {
  if (typeof Convex > "u" || Convex.syscall === void 0)
    throw new Error(
      "The Convex database and auth objects are being used outside of a Convex backend. Did you mean to use `useQuery` or `useMutation` to call a Convex function?"
    );
  let r = Convex.syscall(t, JSON.stringify(e));
  return JSON.parse(r);
}
async function f(t, e) {
  if (typeof Convex > "u" || Convex.asyncSyscall === void 0)
    throw new Error(
      "The Convex database and auth objects are being used outside of a Convex backend. Did you mean to use `useQuery` or `useMutation` to call a Convex function?"
    );
  let r;
  try {
    r = await Convex.asyncSyscall(t, JSON.stringify(e));
  } catch (o) {
    if (o.data !== void 0) {
      let s = new he(o.message);
      throw s.data = y(o.data), s;
    }
    throw new Error(o.message);
  }
  return JSON.parse(r);
}
function me(t, e) {
  if (typeof Convex > "u" || Convex.jsSyscall === void 0)
    throw new Error(
      "The Convex database and auth objects are being used outside of a Convex backend. Did you mean to use `useQuery` or `useMutation` to call a Convex function?"
    );
  return Convex.jsSyscall(t, e);
}
var E = c(() => {
  "use strict";
  Be();
  O();
  n(X, "performSyscall");
  n(f, "performAsyncSyscall");
  n(me, "performJsSyscall");
});

// node_modules/convex/dist/esm/server/functionName.js
var Y, je = c(() => {
  "use strict";
  Y = Symbol.for("functionName");
});

// node_modules/convex/dist/esm/server/components/paths.js
function jr(t) {
  return t[Me] ?? null;
}
function Mr(t) {
  return t.startsWith("function://");
}
function I(t) {
  let e;
  if (typeof t == "string")
    Mr(t) ? e = { functionHandle: t } : e = { name: t };
  else if (t[Y])
    e = { name: t[Y] };
  else {
    let r = jr(t);
    if (!r)
      throw new Error(`${t} is not a functionReference`);
    e = { reference: r };
  }
  return e;
}
var Me, F = c(() => {
  "use strict";
  je();
  Me = Symbol.for("toReferencePath");
  n(jr, "extractReferencePath");
  n(Mr, "isFunctionHandle");
  n(I, "getFunctionAddress");
});

// node_modules/convex/dist/esm/server/impl/actions_impl.js
function Ue(t, e, r) {
  return {
    ...I(e),
    args: h(_(r)),
    version: x,
    requestId: t
  };
}
function Je(t) {
  return {
    runQuery: /* @__PURE__ */ n(async (e, r) => {
      let o = await f(
        "1.0/actions/query",
        Ue(t, e, r)
      );
      return y(o);
    }, "runQuery"),
    runMutation: /* @__PURE__ */ n(async (e, r) => {
      let o = await f(
        "1.0/actions/mutation",
        Ue(t, e, r)
      );
      return y(o);
    }, "runMutation"),
    runAction: /* @__PURE__ */ n(async (e, r) => {
      let o = await f(
        "1.0/actions/action",
        Ue(t, e, r)
      );
      return y(o);
    }, "runAction")
  };
}
var Ot = c(() => {
  "use strict";
  C();
  $();
  E();
  B();
  F();
  n(Ue, "syscallArgs");
  n(Je, "setupActionCalls");
});

// node_modules/convex/dist/esm/server/vector_search.js
var Ur, Jr, Tt, ye, _t = c(() => {
  "use strict";
  Ur = Object.defineProperty, Jr = /* @__PURE__ */ n((t, e, r) => e in t ? Ur(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), Tt = /* @__PURE__ */ n((t, e, r) => Jr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), ye = class {
    static {
      n(this, "FilterExpression");
    }
    /**
     * @internal
     */
    constructor() {
      Tt(this, "_isExpression"), Tt(this, "_value");
    }
  };
});

// node_modules/convex/dist/esm/server/impl/validate.js
function l(t, e, r, o) {
  if (t === void 0)
    throw new TypeError(
      `Must provide arg ${e} \`${o}\` to \`${r}\``
    );
}
function Ct(t, e, r, o) {
  if (!Number.isInteger(t) || t < 0)
    throw new TypeError(
      `Arg ${e} \`${o}\` to \`${r}\` must be a non-negative integer`
    );
}
var R = c(() => {
  "use strict";
  n(l, "validateArg");
  n(Ct, "validateArgIsNonNegativeInteger");
});

// node_modules/convex/dist/esm/server/impl/vector_search_impl.js
function ke(t) {
  return async (e, r, o) => {
    if (l(e, 1, "vectorSearch", "tableName"), l(r, 2, "vectorSearch", "indexName"), l(o, 3, "vectorSearch", "query"), !o.vector || !Array.isArray(o.vector) || o.vector.length === 0)
      throw Error("`vector` must be a non-empty Array in vectorSearch");
    return await new Le(
      t,
      e + "." + r,
      o
    ).collect();
  };
}
function we(t) {
  return t instanceof M ? t.serialize() : { $literal: A(t) };
}
var Vr, Lr, Ve, Le, M, kr, $t = c(() => {
  "use strict";
  E();
  $();
  _t();
  R();
  O();
  Vr = Object.defineProperty, Lr = /* @__PURE__ */ n((t, e, r) => e in t ? Vr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), Ve = /* @__PURE__ */ n((t, e, r) => Lr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField");
  n(ke, "setupActionVectorSearch");
  Le = class {
    static {
      n(this, "VectorQueryImpl");
    }
    constructor(e, r, o) {
      Ve(this, "requestId"), Ve(this, "state"), this.requestId = e;
      let s = o.filter ? we(o.filter(kr)) : null;
      this.state = {
        type: "preparing",
        query: {
          indexName: r,
          limit: o.limit,
          vector: o.vector,
          expressions: s
        }
      };
    }
    async collect() {
      if (this.state.type === "consumed")
        throw new Error("This query is closed and can't emit any more values.");
      let e = this.state.query;
      this.state = { type: "consumed" };
      let { results: r } = await f("1.0/actions/vectorSearch", {
        requestId: this.requestId,
        version: x,
        query: e
      });
      return r;
    }
  }, M = class extends ye {
    static {
      n(this, "ExpressionImpl");
    }
    constructor(e) {
      super(), Ve(this, "inner"), this.inner = e;
    }
    serialize() {
      return this.inner;
    }
  };
  n(we, "serializeExpression");
  kr = {
    //  Comparisons  /////////////////////////////////////////////////////////////
    eq(t, e) {
      if (typeof t != "string")
        throw new Error("The first argument to `q.eq` must be a field name.");
      return new M({
        $eq: [
          we(new M({ $field: t })),
          we(e)
        ]
      });
    },
    //  Logic  ///////////////////////////////////////////////////////////////////
    or(...t) {
      return new M({ $or: t.map(we) });
    }
  };
});

// node_modules/convex/dist/esm/server/impl/authentication_impl.js
function K(t) {
  return {
    getUserIdentity: /* @__PURE__ */ n(async () => await f("1.0/getUserIdentity", {
      requestId: t
    }), "getUserIdentity")
  };
}
var Nt = c(() => {
  "use strict";
  E();
  n(K, "setupAuth");
});

// node_modules/convex/dist/esm/server/filter_builder.js
var Gr, Qr, Pt, xe, Ft = c(() => {
  "use strict";
  Gr = Object.defineProperty, Qr = /* @__PURE__ */ n((t, e, r) => e in t ? Gr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), Pt = /* @__PURE__ */ n((t, e, r) => Qr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), xe = class {
    static {
      n(this, "Expression");
    }
    /**
     * @internal
     */
    constructor() {
      Pt(this, "_isExpression"), Pt(this, "_value");
    }
  };
});

// node_modules/convex/dist/esm/server/impl/filter_builder_impl.js
function p(t) {
  return t instanceof g ? t.serialize() : { $literal: A(t) };
}
var Dr, Hr, Wr, g, Rt, qt = c(() => {
  "use strict";
  O();
  Ft();
  Dr = Object.defineProperty, Hr = /* @__PURE__ */ n((t, e, r) => e in t ? Dr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), Wr = /* @__PURE__ */ n((t, e, r) => Hr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), g = class extends xe {
    static {
      n(this, "ExpressionImpl");
    }
    constructor(e) {
      super(), Wr(this, "inner"), this.inner = e;
    }
    serialize() {
      return this.inner;
    }
  };
  n(p, "serializeExpression");
  Rt = {
    //  Comparisons  /////////////////////////////////////////////////////////////
    eq(t, e) {
      return new g({
        $eq: [p(t), p(e)]
      });
    },
    neq(t, e) {
      return new g({
        $neq: [p(t), p(e)]
      });
    },
    lt(t, e) {
      return new g({
        $lt: [p(t), p(e)]
      });
    },
    lte(t, e) {
      return new g({
        $lte: [p(t), p(e)]
      });
    },
    gt(t, e) {
      return new g({
        $gt: [p(t), p(e)]
      });
    },
    gte(t, e) {
      return new g({
        $gte: [p(t), p(e)]
      });
    },
    //  Arithmetic  //////////////////////////////////////////////////////////////
    add(t, e) {
      return new g({
        $add: [p(t), p(e)]
      });
    },
    sub(t, e) {
      return new g({
        $sub: [p(t), p(e)]
      });
    },
    mul(t, e) {
      return new g({
        $mul: [p(t), p(e)]
      });
    },
    div(t, e) {
      return new g({
        $div: [p(t), p(e)]
      });
    },
    mod(t, e) {
      return new g({
        $mod: [p(t), p(e)]
      });
    },
    neg(t) {
      return new g({ $neg: p(t) });
    },
    //  Logic  ///////////////////////////////////////////////////////////////////
    and(...t) {
      return new g({ $and: t.map(p) });
    },
    or(...t) {
      return new g({ $or: t.map(p) });
    },
    not(t) {
      return new g({ $not: p(t) });
    },
    //  Other  ///////////////////////////////////////////////////////////////////
    field(t) {
      return new g({ $field: t });
    }
  };
});

// node_modules/convex/dist/esm/server/index_range_builder.js
var zr, Xr, Yr, ge, Bt = c(() => {
  "use strict";
  zr = Object.defineProperty, Xr = /* @__PURE__ */ n((t, e, r) => e in t ? zr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), Yr = /* @__PURE__ */ n((t, e, r) => Xr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), ge = class {
    static {
      n(this, "IndexRange");
    }
    /**
     * @internal
     */
    constructor() {
      Yr(this, "_isIndexRange");
    }
  };
});

// node_modules/convex/dist/esm/server/impl/index_range_builder_impl.js
var Kr, Zr, jt, be, Mt = c(() => {
  "use strict";
  O();
  Bt();
  Kr = Object.defineProperty, Zr = /* @__PURE__ */ n((t, e, r) => e in t ? Kr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), jt = /* @__PURE__ */ n((t, e, r) => Zr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), be = class t extends ge {
    static {
      n(this, "IndexRangeBuilderImpl");
    }
    constructor(e) {
      super(), jt(this, "rangeExpressions"), jt(this, "isConsumed"), this.rangeExpressions = e, this.isConsumed = !1;
    }
    static new() {
      return new t([]);
    }
    consume() {
      if (this.isConsumed)
        throw new Error(
          "IndexRangeBuilder has already been used! Chain your method calls like `q => q.eq(...).eq(...)`. See https://docs.convex.dev/using/indexes"
        );
      this.isConsumed = !0;
    }
    eq(e, r) {
      return this.consume(), new t(
        this.rangeExpressions.concat({
          type: "Eq",
          fieldPath: e,
          value: A(r)
        })
      );
    }
    gt(e, r) {
      return this.consume(), new t(
        this.rangeExpressions.concat({
          type: "Gt",
          fieldPath: e,
          value: A(r)
        })
      );
    }
    gte(e, r) {
      return this.consume(), new t(
        this.rangeExpressions.concat({
          type: "Gte",
          fieldPath: e,
          value: A(r)
        })
      );
    }
    lt(e, r) {
      return this.consume(), new t(
        this.rangeExpressions.concat({
          type: "Lt",
          fieldPath: e,
          value: A(r)
        })
      );
    }
    lte(e, r) {
      return this.consume(), new t(
        this.rangeExpressions.concat({
          type: "Lte",
          fieldPath: e,
          value: A(r)
        })
      );
    }
    export() {
      return this.consume(), this.rangeExpressions;
    }
  };
});

// node_modules/convex/dist/esm/server/search_filter_builder.js
var en, tn, rn, ve, Ge = c(() => {
  "use strict";
  en = Object.defineProperty, tn = /* @__PURE__ */ n((t, e, r) => e in t ? en(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), rn = /* @__PURE__ */ n((t, e, r) => tn(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), ve = class {
    static {
      n(this, "SearchFilter");
    }
    /**
     * @internal
     */
    constructor() {
      rn(this, "_isSearchFilter");
    }
  };
});

// node_modules/convex/dist/esm/server/impl/search_filter_builder_impl.js
var nn, on, Ut, Ae, Jt = c(() => {
  "use strict";
  O();
  Ge();
  R();
  nn = Object.defineProperty, on = /* @__PURE__ */ n((t, e, r) => e in t ? nn(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), Ut = /* @__PURE__ */ n((t, e, r) => on(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), Ae = class t extends ve {
    static {
      n(this, "SearchFilterBuilderImpl");
    }
    constructor(e) {
      super(), Ut(this, "filters"), Ut(this, "isConsumed"), this.filters = e, this.isConsumed = !1;
    }
    static new() {
      return new t([]);
    }
    consume() {
      if (this.isConsumed)
        throw new Error(
          "SearchFilterBuilder has already been used! Chain your method calls like `q => q.search(...).eq(...)`."
        );
      this.isConsumed = !0;
    }
    search(e, r) {
      return l(e, 1, "search", "fieldName"), l(r, 2, "search", "query"), this.consume(), new t(
        this.filters.concat({
          type: "Search",
          fieldPath: e,
          value: r
        })
      );
    }
    eq(e, r) {
      return l(e, 1, "eq", "fieldName"), arguments.length !== 2 && l(r, 2, "search", "value"), this.consume(), new t(
        this.filters.concat({
          type: "Eq",
          fieldPath: e,
          value: A(r)
        })
      );
    }
    export() {
      return this.consume(), this.filters;
    }
  };
});

// node_modules/convex/dist/esm/server/impl/query_impl.js
function Lt(t) {
  throw new Error(
    t === "consumed" ? "This query is closed and can't emit any more values." : "This query has been chained with another operator and can't be reused."
  );
}
var sn, an, Qe, Vt, U, q, De = c(() => {
  "use strict";
  C();
  E();
  qt();
  Mt();
  Jt();
  R();
  $();
  sn = Object.defineProperty, an = /* @__PURE__ */ n((t, e, r) => e in t ? sn(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), Qe = /* @__PURE__ */ n((t, e, r) => an(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), Vt = 256, U = class {
    static {
      n(this, "QueryInitializerImpl");
    }
    constructor(e) {
      Qe(this, "tableName"), this.tableName = e;
    }
    withIndex(e, r) {
      l(e, 1, "withIndex", "indexName");
      let o = be.new();
      return r !== void 0 && (o = r(o)), new q({
        source: {
          type: "IndexRange",
          indexName: this.tableName + "." + e,
          range: o.export(),
          order: null
        },
        operators: []
      });
    }
    withSearchIndex(e, r) {
      l(e, 1, "withSearchIndex", "indexName"), l(r, 2, "withSearchIndex", "searchFilter");
      let o = Ae.new();
      return new q({
        source: {
          type: "Search",
          indexName: this.tableName + "." + e,
          filters: r(o).export()
        },
        operators: []
      });
    }
    fullTableScan() {
      return new q({
        source: {
          type: "FullTableScan",
          tableName: this.tableName,
          order: null
        },
        operators: []
      });
    }
    order(e) {
      return this.fullTableScan().order(e);
    }
    // This is internal API and should not be exposed to developers yet.
    async count() {
      let e = await f("1.0/count", {
        table: this.tableName
      });
      return y(e);
    }
    filter(e) {
      return this.fullTableScan().filter(e);
    }
    limit(e) {
      return this.fullTableScan().limit(e);
    }
    collect() {
      return this.fullTableScan().collect();
    }
    take(e) {
      return this.fullTableScan().take(e);
    }
    paginate(e) {
      return this.fullTableScan().paginate(e);
    }
    first() {
      return this.fullTableScan().first();
    }
    unique() {
      return this.fullTableScan().unique();
    }
    [Symbol.asyncIterator]() {
      return this.fullTableScan()[Symbol.asyncIterator]();
    }
  };
  n(Lt, "throwClosedError");
  q = class t {
    static {
      n(this, "QueryImpl");
    }
    constructor(e) {
      Qe(this, "state"), Qe(this, "tableNameForErrorMessages"), this.state = { type: "preparing", query: e }, e.source.type === "FullTableScan" ? this.tableNameForErrorMessages = e.source.tableName : this.tableNameForErrorMessages = e.source.indexName.split(".")[0];
    }
    takeQuery() {
      if (this.state.type !== "preparing")
        throw new Error(
          "A query can only be chained once and can't be chained after iteration begins."
        );
      let e = this.state.query;
      return this.state = { type: "closed" }, e;
    }
    startQuery() {
      if (this.state.type === "executing")
        throw new Error("Iteration can only begin on a query once.");
      (this.state.type === "closed" || this.state.type === "consumed") && Lt(this.state.type);
      let e = this.state.query, { queryId: r } = X("1.0/queryStream", { query: e, version: x });
      return this.state = { type: "executing", queryId: r }, r;
    }
    closeQuery() {
      if (this.state.type === "executing") {
        let e = this.state.queryId;
        X("1.0/queryCleanup", { queryId: e });
      }
      this.state = { type: "consumed" };
    }
    order(e) {
      l(e, 1, "order", "order");
      let r = this.takeQuery();
      if (r.source.type === "Search")
        throw new Error(
          "Search queries must always be in relevance order. Can not set order manually."
        );
      if (r.source.order !== null)
        throw new Error("Queries may only specify order at most once");
      return r.source.order = e, new t(r);
    }
    filter(e) {
      l(e, 1, "filter", "predicate");
      let r = this.takeQuery();
      if (r.operators.length >= Vt)
        throw new Error(
          `Can't construct query with more than ${Vt} operators`
        );
      return r.operators.push({
        filter: p(e(Rt))
      }), new t(r);
    }
    limit(e) {
      l(e, 1, "limit", "n");
      let r = this.takeQuery();
      return r.operators.push({ limit: e }), new t(r);
    }
    [Symbol.asyncIterator]() {
      return this.startQuery(), this;
    }
    async next() {
      (this.state.type === "closed" || this.state.type === "consumed") && Lt(this.state.type);
      let e = this.state.type === "preparing" ? this.startQuery() : this.state.queryId, { value: r, done: o } = await f("1.0/queryStreamNext", {
        queryId: e
      });
      return o && this.closeQuery(), { value: y(r), done: o };
    }
    return() {
      return this.closeQuery(), Promise.resolve({ done: !0, value: void 0 });
    }
    async paginate(e) {
      if (l(e, 1, "paginate", "options"), typeof e?.numItems != "number" || e.numItems < 0)
        throw new Error(
          `\`options.numItems\` must be a positive number. Received \`${e?.numItems}\`.`
        );
      let r = this.takeQuery(), o = e.numItems, s = e.cursor, i = e?.endCursor ?? null, a = e.maximumRowsRead ?? null, { page: d, isDone: w, continueCursor: L, splitCursor: hr, pageStatus: mr } = await f("1.0/queryPage", {
        query: r,
        cursor: s,
        endCursor: i,
        pageSize: o,
        maximumRowsRead: a,
        maximumBytesRead: e.maximumBytesRead,
        version: x
      });
      return {
        page: d.map((yr) => y(yr)),
        isDone: w,
        continueCursor: L,
        splitCursor: hr,
        pageStatus: mr
      };
    }
    async collect() {
      let e = [];
      for await (let r of this)
        e.push(r);
      return e;
    }
    async take(e) {
      return l(e, 1, "take", "n"), Ct(e, 1, "take", "n"), this.limit(e).collect();
    }
    async first() {
      let e = await this.take(1);
      return e.length === 0 ? null : e[0];
    }
    async unique() {
      let e = await this.take(2);
      if (e.length === 0)
        return null;
      if (e.length === 2)
        throw new Error(`unique() query returned more than one result from table ${this.tableNameForErrorMessages}:
 [${e[0]._id}, ${e[1]._id}, ...]`);
      return e[0];
    }
  };
});

// node_modules/convex/dist/esm/server/impl/database_impl.js
async function He(t, e, r) {
  if (l(e, 1, "get", "id"), typeof e != "string")
    throw new Error(
      `Invalid argument \`id\` for \`db.get\`, expected string but got '${typeof e}': ${e}`
    );
  let o = {
    id: h(e),
    isSystem: r,
    version: x,
    table: t
  }, s = await f("1.0/get", o);
  return y(s);
}
function Ke() {
  let t = /* @__PURE__ */ n((s = !1) => ({
    get: /* @__PURE__ */ n(async (i, a) => a !== void 0 ? await He(i, a, s) : await He(void 0, i, s), "get"),
    query: /* @__PURE__ */ n((i) => new Z(i, s).query(), "query"),
    normalizeId: /* @__PURE__ */ n((i, a) => {
      l(i, 1, "normalizeId", "tableName"), l(a, 2, "normalizeId", "id");
      let d = i.startsWith("_");
      if (d !== s)
        throw new Error(
          `${d ? "System" : "User"} tables can only be accessed from db.${s ? "" : "system."}normalizeId().`
        );
      let w = X("1.0/db/normalizeId", {
        table: i,
        idString: a
      });
      return y(w).id;
    }, "normalizeId"),
    // We set the system reader on the next line
    system: null,
    table: /* @__PURE__ */ n((i) => new Z(i, s), "table")
  }), "reader"), { system: e, ...r } = t(!0), o = t();
  return o.system = r, o;
}
async function kt(t, e) {
  if (t.startsWith("_"))
    throw new Error("System tables (prefixed with `_`) are read-only.");
  l(t, 1, "insert", "table"), l(e, 2, "insert", "value");
  let r = await f("1.0/insert", {
    table: t,
    value: h(e)
  });
  return y(r)._id;
}
async function We(t, e, r) {
  l(e, 1, "patch", "id"), l(r, 2, "patch", "value"), await f("1.0/shallowMerge", {
    id: h(e),
    value: xt(r),
    table: t
  });
}
async function ze(t, e, r) {
  l(e, 1, "replace", "id"), l(r, 2, "replace", "value"), await f("1.0/replace", {
    id: h(e),
    value: h(r),
    table: t
  });
}
async function Xe(t, e) {
  l(e, 1, "delete", "id"), await f("1.0/remove", {
    id: h(e),
    table: t
  });
}
function Gt() {
  let t = Ke();
  return {
    get: t.get,
    query: t.query,
    normalizeId: t.normalizeId,
    system: t.system,
    insert: /* @__PURE__ */ n(async (e, r) => await kt(e, r), "insert"),
    patch: /* @__PURE__ */ n(async (e, r, o) => o !== void 0 ? await We(e, r, o) : await We(void 0, e, r), "patch"),
    replace: /* @__PURE__ */ n(async (e, r, o) => o !== void 0 ? await ze(e, r, o) : await ze(void 0, e, r), "replace"),
    delete: /* @__PURE__ */ n(async (e, r) => r !== void 0 ? await Xe(e, r) : await Xe(void 0, e), "delete"),
    table: /* @__PURE__ */ n((e) => new Ye(e, !1), "table")
  };
}
var Z, Ye, Qt = c(() => {
  "use strict";
  C();
  E();
  De();
  R();
  $();
  O();
  n(He, "get");
  n(Ke, "setupReader");
  n(kt, "insert");
  n(We, "patch");
  n(ze, "replace");
  n(Xe, "delete_");
  n(Gt, "setupWriter");
  Z = class {
    static {
      n(this, "TableReader");
    }
    constructor(e, r) {
      this.tableName = e, this.isSystem = r;
    }
    async get(e) {
      return He(this.tableName, e, this.isSystem);
    }
    query() {
      let e = this.tableName.startsWith("_");
      if (e !== this.isSystem)
        throw new Error(
          `${e ? "System" : "User"} tables can only be accessed from db.${this.isSystem ? "" : "system."}query().`
        );
      return new U(this.tableName);
    }
  }, Ye = class extends Z {
    static {
      n(this, "TableWriter");
    }
    async insert(e) {
      return kt(this.tableName, e);
    }
    async patch(e, r) {
      return We(this.tableName, e, r);
    }
    async replace(e, r) {
      return ze(this.tableName, e, r);
    }
    async delete(e) {
      return Xe(this.tableName, e);
    }
  };
});

// node_modules/convex/dist/esm/server/impl/scheduler_impl.js
function Dt() {
  return {
    runAfter: /* @__PURE__ */ n(async (t, e, r) => {
      let o = Ht(t, e, r);
      return await f("1.0/schedule", o);
    }, "runAfter"),
    runAt: /* @__PURE__ */ n(async (t, e, r) => {
      let o = Wt(
        t,
        e,
        r
      );
      return await f("1.0/schedule", o);
    }, "runAt"),
    cancel: /* @__PURE__ */ n(async (t) => {
      l(t, 1, "cancel", "id");
      let e = { id: h(t) };
      await f("1.0/cancel_job", e);
    }, "cancel")
  };
}
function Ze(t) {
  return {
    runAfter: /* @__PURE__ */ n(async (e, r, o) => {
      let s = {
        requestId: t,
        ...Ht(e, r, o)
      };
      return await f("1.0/actions/schedule", s);
    }, "runAfter"),
    runAt: /* @__PURE__ */ n(async (e, r, o) => {
      let s = {
        requestId: t,
        ...Wt(e, r, o)
      };
      return await f("1.0/actions/schedule", s);
    }, "runAt"),
    cancel: /* @__PURE__ */ n(async (e) => {
      l(e, 1, "cancel", "id");
      let r = { id: h(e) };
      return await f("1.0/actions/cancel_job", r);
    }, "cancel")
  };
}
function Ht(t, e, r) {
  if (typeof t != "number")
    throw new Error("`delayMs` must be a number");
  if (!isFinite(t))
    throw new Error("`delayMs` must be a finite number");
  if (t < 0)
    throw new Error("`delayMs` must be non-negative");
  let o = _(r), s = I(e), i = (Date.now() + t) / 1e3;
  return {
    ...s,
    ts: i,
    args: h(o),
    version: x
  };
}
function Wt(t, e, r) {
  let o;
  if (t instanceof Date)
    o = t.valueOf() / 1e3;
  else if (typeof t == "number")
    o = t / 1e3;
  else
    throw new Error("The invoke time must a Date or a timestamp");
  let s = I(e), i = _(r);
  return {
    ...s,
    ts: o,
    args: h(i),
    version: x
  };
}
var zt = c(() => {
  "use strict";
  C();
  $();
  E();
  B();
  R();
  F();
  n(Dt, "setupMutationScheduler");
  n(Ze, "setupActionScheduler");
  n(Ht, "runAfterSyscallArgs");
  n(Wt, "runAtSyscallArgs");
});

// node_modules/convex/dist/esm/server/impl/storage_impl.js
function et(t) {
  return {
    getUrl: /* @__PURE__ */ n(async (e) => (l(e, 1, "getUrl", "storageId"), await f("1.0/storageGetUrl", {
      requestId: t,
      version: x,
      storageId: e
    })), "getUrl"),
    getMetadata: /* @__PURE__ */ n(async (e) => await f("1.0/storageGetMetadata", {
      requestId: t,
      version: x,
      storageId: e
    }), "getMetadata")
  };
}
function tt(t) {
  let e = et(t);
  return {
    generateUploadUrl: /* @__PURE__ */ n(async () => await f("1.0/storageGenerateUploadUrl", {
      requestId: t,
      version: x
    }), "generateUploadUrl"),
    delete: /* @__PURE__ */ n(async (r) => {
      await f("1.0/storageDelete", {
        requestId: t,
        version: x,
        storageId: r
      });
    }, "delete"),
    getUrl: e.getUrl,
    getMetadata: e.getMetadata
  };
}
function rt(t) {
  return {
    ...tt(t),
    store: /* @__PURE__ */ n(async (r, o) => await me("storage/storeBlob", {
      requestId: t,
      version: x,
      blob: r,
      options: o
    }), "store"),
    get: /* @__PURE__ */ n(async (r) => await me("storage/getBlob", {
      requestId: t,
      version: x,
      storageId: r
    }), "get")
  };
}
var Xt = c(() => {
  "use strict";
  $();
  E();
  R();
  n(et, "setupStorageReader");
  n(tt, "setupStorageWriter");
  n(rt, "setupStorageActionWriter");
});

// node_modules/convex/dist/esm/server/impl/registration_impl.js
async function Yt(t, e) {
  let o = y(JSON.parse(e)), s = {
    db: Gt(),
    auth: K(""),
    storage: tt(""),
    scheduler: Dt(),
    runQuery: /* @__PURE__ */ n((a, d) => nt("query", a, d), "runQuery"),
    runMutation: /* @__PURE__ */ n((a, d) => nt("mutation", a, d), "runMutation")
  }, i = await Ee(t, s, o);
  return Kt(i), JSON.stringify(h(i === void 0 ? null : i));
}
function Kt(t) {
  if (t instanceof U || t instanceof q)
    throw new Error(
      "Return value is a Query. Results must be retrieved with `.collect()`, `.take(n), `.unique()`, or `.first()`."
    );
}
async function Ee(t, e, r) {
  let o;
  try {
    o = await Promise.resolve(t(e, ...r));
  } catch (s) {
    throw un(s);
  }
  return o;
}
function J(t, e) {
  return (r, o) => (globalThis.console.warn(
    `Convex functions should not directly call other Convex functions. Consider calling a helper function instead. e.g. \`export const foo = ${t}(...); await foo(ctx);\` is not supported. See https://docs.convex.dev/production/best-practices/#use-helper-functions-to-write-shared-code`
  ), e(r, o));
}
function un(t) {
  if (typeof t == "object" && t !== null && Symbol.for("ConvexError") in t) {
    let e = t;
    return e.data = JSON.stringify(
      h(e.data === void 0 ? null : e.data)
    ), e.ConvexErrorSymbol = Symbol.for("ConvexError"), e;
  } else
    return t;
}
function V() {
  if (typeof window > "u" || window.__convexAllowFunctionsInBrowser)
    return;
  (Object.getOwnPropertyDescriptor(globalThis, "window")?.get?.toString().includes("[native code]") ?? !1) && console.error(
    "Convex functions should not be imported in the browser. This will throw an error in future versions of `convex`. If this is a false negative, please report it to Convex support."
  );
}
function Zt(t, e) {
  if (e === void 0)
    throw new Error(
      `A validator is undefined for field "${t}". This is often caused by circular imports. See https://docs.convex.dev/error#undefined-validator for details.`
    );
  return e;
}
function ee(t) {
  return () => {
    let e = u.any();
    return typeof t == "object" && t.args !== void 0 && (e = de(t.args)), JSON.stringify(e.json, Zt);
  };
}
function te(t) {
  return () => {
    let e;
    return typeof t == "object" && t.returns !== void 0 && (e = de(t.returns)), JSON.stringify(e ? e.json : null, Zt);
  };
}
async function cn(t, e) {
  let o = y(JSON.parse(e)), s = {
    db: Ke(),
    auth: K(""),
    storage: et(""),
    runQuery: /* @__PURE__ */ n((a, d) => nt("query", a, d), "runQuery")
  }, i = await Ee(t, s, o);
  return Kt(i), JSON.stringify(h(i === void 0 ? null : i));
}
async function nr(t, e, r) {
  let o = y(JSON.parse(r)), i = {
    ...Je(e),
    auth: K(e),
    scheduler: Ze(e),
    storage: rt(e),
    vectorSearch: ke(e)
  }, a = await Ee(t, i, o);
  return JSON.stringify(h(a === void 0 ? null : a));
}
async function ln(t, e) {
  let s = {
    ...Je(""),
    auth: K(""),
    storage: rt(""),
    scheduler: Ze(""),
    vectorSearch: ke("")
  };
  return await Ee(t, s, [e]);
}
async function nt(t, e, r) {
  let o = _(r), s = {
    udfType: t,
    args: h(o),
    ...I(e)
  }, i = await f("1.0/runUdf", s);
  return y(i);
}
var er, tr, rr, ot, st, or, sr = c(() => {
  "use strict";
  C();
  Ot();
  $t();
  Nt();
  Qt();
  De();
  zt();
  Xt();
  B();
  E();
  z();
  F();
  n(Yt, "invokeMutation");
  n(Kt, "validateReturnValue");
  n(Ee, "invokeFunction");
  n(J, "dontCallDirectly");
  n(un, "serializeConvexErrorData");
  n(V, "assertNotBrowser");
  n(Zt, "strictReplacer");
  n(ee, "exportArgs");
  n(te, "exportReturns");
  er = /* @__PURE__ */ n(((t) => {
    let e = typeof t == "function" ? t : t.handler, r = J("mutation", e);
    return V(), r.isMutation = !0, r.isPublic = !0, r.invokeMutation = (o) => Yt(e, o), r.exportArgs = ee(t), r.exportReturns = te(t), r._handler = e, r;
  }), "mutationGeneric"), tr = /* @__PURE__ */ n(((t) => {
    let e = typeof t == "function" ? t : t.handler, r = J(
      "internalMutation",
      e
    );
    return V(), r.isMutation = !0, r.isInternal = !0, r.invokeMutation = (o) => Yt(e, o), r.exportArgs = ee(t), r.exportReturns = te(t), r._handler = e, r;
  }), "internalMutationGeneric");
  n(cn, "invokeQuery");
  rr = /* @__PURE__ */ n(((t) => {
    let e = typeof t == "function" ? t : t.handler, r = J("query", e);
    return V(), r.isQuery = !0, r.isPublic = !0, r.invokeQuery = (o) => cn(e, o), r.exportArgs = ee(t), r.exportReturns = te(t), r._handler = e, r;
  }), "queryGeneric");
  n(nr, "invokeAction");
  ot = /* @__PURE__ */ n(((t) => {
    let e = typeof t == "function" ? t : t.handler, r = J("action", e);
    return V(), r.isAction = !0, r.isPublic = !0, r.invokeAction = (o, s) => nr(e, o, s), r.exportArgs = ee(t), r.exportReturns = te(t), r._handler = e, r;
  }), "actionGeneric"), st = /* @__PURE__ */ n(((t) => {
    let e = typeof t == "function" ? t : t.handler, r = J("internalAction", e);
    return V(), r.isAction = !0, r.isInternal = !0, r.invokeAction = (o, s) => nr(e, o, s), r.exportArgs = ee(t), r.exportReturns = te(t), r._handler = e, r;
  }), "internalActionGeneric");
  n(ln, "invokeHttpAction");
  or = /* @__PURE__ */ n((t) => {
    let e = J("httpAction", t);
    return V(), e.isHttp = !0, e.invokeHttpAction = (r) => ln(t, r), e._handler = t, e;
  }, "httpActionGeneric");
  n(nt, "runUdf");
});

// node_modules/convex/dist/esm/server/pagination.js
var Bs, ir = c(() => {
  "use strict";
  z();
  Bs = u.object({
    numItems: u.number(),
    cursor: u.union(u.string(), u.null()),
    endCursor: u.optional(u.union(u.string(), u.null())),
    id: u.optional(u.number()),
    maximumRowsRead: u.optional(u.number()),
    maximumBytesRead: u.optional(u.number())
  });
});

// node_modules/convex/dist/esm/server/storage.js
var ar = c(() => {
  "use strict";
});

// node_modules/convex/dist/esm/server/api.js
function ur(t = []) {
  let e = {
    get(r, o) {
      if (typeof o == "string") {
        let s = [...t, o];
        return ur(s);
      } else if (o === Y) {
        if (t.length < 2) {
          let a = ["api", ...t].join(".");
          throw new Error(
            `API path is expected to be of the form \`api.moduleName.functionName\`. Found: \`${a}\``
          );
        }
        let s = t.slice(0, -1).join("/"), i = t[t.length - 1];
        return i === "default" ? s : s + ":" + i;
      } else return o === Symbol.toStringTag ? "FunctionReference" : void 0;
    }
  };
  return new Proxy({}, e);
}
var Ie, it = c(() => {
  "use strict";
  je();
  F();
  n(ur, "createApi");
  Ie = ur();
});

// node_modules/convex/dist/esm/server/cron.js
var cr = c(() => {
  "use strict";
  it();
  B();
  C();
});

// node_modules/convex/dist/esm/server/router.js
var lr = c(() => {
  "use strict";
  E();
});

// node_modules/convex/dist/esm/server/components/index.js
function fr(t, e) {
  let r = {
    get(o, s) {
      if (typeof s == "string") {
        let i = [...e, s];
        return fr(t, i);
      } else if (s === Me) {
        if (e.length < 1) {
          let i = [t, ...e].join(".");
          throw new Error(
            `API path is expected to be of the form \`${t}.childComponent.functionName\`. Found: \`${i}\``
          );
        }
        return "_reference/childComponent/" + e.join("/");
      } else
        return;
    }
  };
  return new Proxy({}, r);
}
var at, Se = c(() => {
  "use strict";
  C();
  $();
  E();
  F();
  F();
  n(fr, "createChildComponents");
  at = /* @__PURE__ */ n(() => fr("components", []), "componentsGeneric");
});

// node_modules/convex/dist/esm/server/schema.js
function ut(t) {
  return Re(t) ? new Oe(t) : new Oe(u.object(t));
}
function pr(t, e) {
  return new ct(t, e);
}
var pn, dn, T, Oe, ct, ii, dr = c(() => {
  "use strict";
  z();
  pn = Object.defineProperty, dn = /* @__PURE__ */ n((t, e, r) => e in t ? pn(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), T = /* @__PURE__ */ n((t, e, r) => dn(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), Oe = class {
    static {
      n(this, "TableDefinition");
    }
    /**
     * @internal
     */
    constructor(e) {
      T(this, "indexes"), T(this, "stagedDbIndexes"), T(this, "searchIndexes"), T(this, "stagedSearchIndexes"), T(this, "vectorIndexes"), T(this, "stagedVectorIndexes"), T(this, "validator"), this.indexes = [], this.stagedDbIndexes = [], this.searchIndexes = [], this.stagedSearchIndexes = [], this.vectorIndexes = [], this.stagedVectorIndexes = [], this.validator = e;
    }
    /**
     * This API is experimental: it may change or disappear.
     *
     * Returns indexes defined on this table.
     * Intended for the advanced use cases of dynamically deciding which index to use for a query.
     * If you think you need this, please chime in on ths issue in the Convex JS GitHub repo.
     * https://github.com/get-convex/convex-js/issues/49
     */
    " indexes"() {
      return this.indexes;
    }
    index(e, r) {
      return Array.isArray(r) ? this.indexes.push({
        indexDescriptor: e,
        fields: r
      }) : r.staged ? this.stagedDbIndexes.push({
        indexDescriptor: e,
        fields: r.fields
      }) : this.indexes.push({
        indexDescriptor: e,
        fields: r.fields
      }), this;
    }
    searchIndex(e, r) {
      return r.staged ? this.stagedSearchIndexes.push({
        indexDescriptor: e,
        searchField: r.searchField,
        filterFields: r.filterFields || []
      }) : this.searchIndexes.push({
        indexDescriptor: e,
        searchField: r.searchField,
        filterFields: r.filterFields || []
      }), this;
    }
    vectorIndex(e, r) {
      return r.staged ? this.stagedVectorIndexes.push({
        indexDescriptor: e,
        vectorField: r.vectorField,
        dimensions: r.dimensions,
        filterFields: r.filterFields || []
      }) : this.vectorIndexes.push({
        indexDescriptor: e,
        vectorField: r.vectorField,
        dimensions: r.dimensions,
        filterFields: r.filterFields || []
      }), this;
    }
    /**
     * Work around for https://github.com/microsoft/TypeScript/issues/57035
     */
    self() {
      return this;
    }
    /**
     * Export the contents of this definition.
     *
     * This is called internally by the Convex framework.
     * @internal
     */
    export() {
      let e = this.validator.json;
      if (typeof e != "object")
        throw new Error(
          "Invalid validator: please make sure that the parameter of `defineTable` is valid (see https://docs.convex.dev/database/schemas)"
        );
      return {
        indexes: this.indexes,
        stagedDbIndexes: this.stagedDbIndexes,
        searchIndexes: this.searchIndexes,
        stagedSearchIndexes: this.stagedSearchIndexes,
        vectorIndexes: this.vectorIndexes,
        stagedVectorIndexes: this.stagedVectorIndexes,
        documentType: e
      };
    }
  };
  n(ut, "defineTable");
  ct = class {
    static {
      n(this, "SchemaDefinition");
    }
    /**
     * @internal
     */
    constructor(e, r) {
      T(this, "tables"), T(this, "strictTableNameTypes"), T(this, "schemaValidation"), this.tables = e, this.schemaValidation = r?.schemaValidation === void 0 ? !0 : r.schemaValidation;
    }
    /**
     * Export the contents of this definition.
     *
     * This is called internally by the Convex framework.
     * @internal
     */
    export() {
      return JSON.stringify({
        tables: Object.entries(this.tables).map(([e, r]) => {
          let {
            indexes: o,
            stagedDbIndexes: s,
            searchIndexes: i,
            stagedSearchIndexes: a,
            vectorIndexes: d,
            stagedVectorIndexes: w,
            documentType: L
          } = r.export();
          return {
            tableName: e,
            indexes: o,
            stagedDbIndexes: s,
            searchIndexes: i,
            stagedSearchIndexes: a,
            vectorIndexes: d,
            stagedVectorIndexes: w,
            documentType: L
          };
        }),
        schemaValidation: this.schemaValidation
      });
    }
  };
  n(pr, "defineSchema");
  ii = pr({
    _scheduled_functions: ut({
      name: u.string(),
      args: u.array(u.any()),
      scheduledTime: u.float64(),
      completedTime: u.optional(u.float64()),
      state: u.union(
        u.object({ kind: u.literal("pending") }),
        u.object({ kind: u.literal("inProgress") }),
        u.object({ kind: u.literal("success") }),
        u.object({ kind: u.literal("failed"), error: u.string() }),
        u.object({ kind: u.literal("canceled") })
      )
    }),
    _storage: ut({
      sha256: u.string(),
      size: u.float64(),
      contentType: u.optional(u.string())
    })
  });
});

// node_modules/convex/dist/esm/server/index.js
var lt = c(() => {
  "use strict";
  St();
  sr();
  ir();
  Ge();
  ar();
  cr();
  lr();
  it();
  Se();
  Se();
  Se();
  dr();
});

// convex/_generated/api.js
var xn = {};
wr(xn, {
  api: () => mn,
  components: () => wn,
  internal: () => yn
});
var mn, yn, wn, gn = c(() => {
  "use strict";
  lt();
  mn = Ie, yn = Ie, wn = at();
});

// convex/_generated/server.js
lt();
var Fi = ot, Ri = st;

export {
  u as a,
  he as b,
  C as c,
  er as d,
  tr as e,
  rr as f,
  ot as g,
  or as h,
  lt as i,
  Fi as j,
  Ri as k,
  mn as l,
  yn as m,
  wn as n,
  xn as o,
  gn as p
};
//# sourceMappingURL=KFFAPE6U.js.map
