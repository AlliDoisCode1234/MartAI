import {
  a as n,
  b as l
} from "./RUVYHBJQ.js";

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
function W(t) {
  var e, r = gr(t), o = r[0], s = r[1], i = new xr(br(t, o, s)), a = 0, c = s > 0 ? o - 4 : o, h;
  for (h = 0; h < c; h += 4)
    e = A[t.charCodeAt(h)] << 18 | A[t.charCodeAt(h + 1)] << 12 | A[t.charCodeAt(h + 2)] << 6 | A[t.charCodeAt(h + 3)], i[a++] = e >> 16 & 255, i[a++] = e >> 8 & 255, i[a++] = e & 255;
  return s === 2 && (e = A[t.charCodeAt(h)] << 2 | A[t.charCodeAt(h + 1)] >> 4, i[a++] = e & 255), s === 1 && (e = A[t.charCodeAt(h)] << 10 | A[t.charCodeAt(h + 1)] << 4 | A[t.charCodeAt(h + 2)] >> 2, i[a++] = e >> 8 & 255, i[a++] = e & 255), i;
}
function vr(t) {
  return S[t >> 18 & 63] + S[t >> 12 & 63] + S[t >> 6 & 63] + S[t & 63];
}
function Ar(t, e, r) {
  for (var o, s = [], i = e; i < r; i += 3)
    o = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(vr(o));
  return s.join("");
}
function z(t) {
  for (var e, r = t.length, o = r % 3, s = [], i = 16383, a = 0, c = r - o; a < c; a += i)
    s.push(
      Ar(
        t,
        a,
        a + i > c ? c : a + i
      )
    );
  return o === 1 ? (e = t[r - 1], s.push(S[e >> 2] + S[e << 4 & 63] + "==")) : o === 2 && (e = (t[r - 2] << 8) + t[r - 1], s.push(
    S[e >> 10] + S[e >> 4 & 63] + S[e << 2 & 63] + "="
  )), s.join("");
}
var S, A, xr, Ne, P, mt, Pe = l(() => {
  "use strict";
  S = [], A = [], xr = Uint8Array, Ne = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (P = 0, mt = Ne.length; P < mt; ++P)
    S[P] = Ne[P], A[Ne.charCodeAt(P)] = P;
  A[45] = 62;
  A[95] = 63;
  n(gr, "getLens");
  n(br, "_byteLength");
  n(W, "toByteArray");
  n(vr, "tripletToBase64");
  n(Ar, "encodeChunk");
  n(z, "fromByteArray");
});

// node_modules/convex/dist/esm/common/index.js
function _(t) {
  if (t === void 0)
    return {};
  if (!Fe(t))
    throw new Error(
      `The arguments to a Convex function must be an object. Received: ${t}`
    );
  return t;
}
function Fe(t) {
  let e = typeof t == "object", r = Object.getPrototypeOf(t), o = r === null || r === Object.prototype || // Objects generated from other contexts (e.g. across Node.js `vm` modules) will not satisfy the previous
  // conditions but are still simple objects.
  r?.constructor?.name === "Object";
  return e && o;
}
var L = l(() => {
  "use strict";
  n(_, "parseArgs");
  n(Fe, "isSimpleObject");
});

// node_modules/convex/dist/esm/values/value.js
function bt(t) {
  return Number.isNaN(t) || !Number.isFinite(t) || Object.is(t, -0);
}
function Sr(t) {
  t < qe && (t -= k + k);
  let e = t.toString(16);
  e.length % 2 === 1 && (e = "0" + e);
  let r = new Uint8Array(new ArrayBuffer(8)), o = 0;
  for (let s of e.match(/.{2}/g).reverse())
    r.set([parseInt(s, 16)], o++), t >>= Er;
  return z(r);
}
function Or(t) {
  let e = W(t);
  if (e.byteLength !== 8)
    throw new Error(
      `Received ${e.byteLength} bytes, expected 8 for $integer`
    );
  let r = qe, o = qe;
  for (let s of e)
    r += BigInt(s) * Ir ** o, o++;
  return r > je && (r += k + k), r;
}
function Tr(t) {
  if (t < k || je < t)
    throw new Error(
      `BigInt ${t} does not fit into a 64-bit signed integer.`
    );
  let e = new ArrayBuffer(8);
  return new DataView(e).setBigInt64(0, t, !0), z(new Uint8Array(e));
}
function _r(t) {
  let e = W(t);
  if (e.byteLength !== 8)
    throw new Error(
      `Received ${e.byteLength} bytes, expected 8 for $integer`
    );
  return new DataView(e.buffer).getBigInt64(0, !0);
}
function Be(t) {
  if (t.length > wt)
    throw new Error(
      `Field name ${t} exceeds maximum field name length ${wt}.`
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
function w(t) {
  if (t === null || typeof t == "boolean" || typeof t == "number" || typeof t == "string")
    return t;
  if (Array.isArray(t))
    return t.map((o) => w(o));
  if (typeof t != "object")
    throw new Error(`Unexpected type of ${t}`);
  let e = Object.entries(t);
  if (e.length === 1) {
    let o = e[0][0];
    if (o === "$bytes") {
      if (typeof t.$bytes != "string")
        throw new Error(`Malformed $bytes field on ${t}`);
      return W(t.$bytes).buffer;
    }
    if (o === "$integer") {
      if (typeof t.$integer != "string")
        throw new Error(`Malformed $integer field on ${t}`);
      return $r(t.$integer);
    }
    if (o === "$float") {
      if (typeof t.$float != "string")
        throw new Error(`Malformed $float field on ${t}`);
      let s = W(t.$float);
      if (s.byteLength !== 8)
        throw new Error(
          `Received ${s.byteLength} bytes, expected 8 for $float`
        );
      let a = new DataView(s.buffer).getFloat64(0, gt);
      if (!bt(a))
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
    Be(o), r[o] = w(s);
  return r;
}
function F(t) {
  let e = JSON.stringify(t, (r, o) => o === void 0 ? "undefined" : typeof o == "bigint" ? `${o.toString()}n` : o);
  if (e.length > xt) {
    let r = "[...truncated]", o = xt - r.length, s = e.codePointAt(o - 1);
    return s !== void 0 && s > 65535 && (o -= 1), e.substring(0, o) + r;
  }
  return e;
}
function X(t, e, r, o) {
  if (t === void 0) {
    let a = r && ` (present at path ${r} in original object ${F(
      e
    )})`;
    throw new Error(
      `undefined is not a valid Convex value${a}. To learn about Convex's supported types, see https://docs.convex.dev/using/types.`
    );
  }
  if (t === null)
    return t;
  if (typeof t == "bigint") {
    if (t < k || je < t)
      throw new Error(
        `BigInt ${t} does not fit into a 64-bit signed integer.`
      );
    return { $integer: Cr(t) };
  }
  if (typeof t == "number")
    if (bt(t)) {
      let a = new ArrayBuffer(8);
      return new DataView(a).setFloat64(0, t, gt), { $float: z(new Uint8Array(a)) };
    } else
      return t;
  if (typeof t == "boolean" || typeof t == "string")
    return t;
  if (t instanceof ArrayBuffer)
    return { $bytes: z(new Uint8Array(t)) };
  if (Array.isArray(t))
    return t.map(
      (a, c) => X(a, e, r + `[${c}]`, !1)
    );
  if (t instanceof Set)
    throw new Error(
      Re(r, "Set", [...t], e)
    );
  if (t instanceof Map)
    throw new Error(
      Re(r, "Map", [...t], e)
    );
  if (!Fe(t)) {
    let a = t?.constructor?.name, c = a ? `${a} ` : "";
    throw new Error(
      Re(r, c, t, e)
    );
  }
  let s = {}, i = Object.entries(t);
  i.sort(([a, c], [h, C]) => a === h ? 0 : a < h ? -1 : 1);
  for (let [a, c] of i)
    c !== void 0 ? (Be(a), s[a] = X(c, e, r + `.${a}`, !1)) : o && (Be(a), s[a] = vt(
      c,
      e,
      r + `.${a}`
    ));
  return s;
}
function Re(t, e, r, o) {
  return t ? `${e}${F(
    r
  )} is not a supported Convex type (present at path ${t} in original object ${F(
    o
  )}). To learn about Convex's supported types, see https://docs.convex.dev/using/types.` : `${e}${F(
    r
  )} is not a supported Convex type.`;
}
function vt(t, e, r) {
  if (t === void 0)
    return { $undefined: null };
  if (e === void 0)
    throw new Error(
      `Programming error. Current value is ${F(
        t
      )} but original value is undefined`
    );
  return X(t, e, r, !1);
}
function m(t) {
  return X(t, t, "", !1);
}
function E(t) {
  return vt(t, t, "");
}
function At(t) {
  return X(t, t, "", !0);
}
var gt, k, je, qe, Er, Ir, Cr, $r, wt, xt, O = l(() => {
  "use strict";
  Pe();
  L();
  gt = !0, k = BigInt("-9223372036854775808"), je = BigInt("9223372036854775807"), qe = BigInt("0"), Er = BigInt("8"), Ir = BigInt("256");
  n(bt, "isSpecial");
  n(Sr, "slowBigIntToBase64");
  n(Or, "slowBase64ToBigInt");
  n(Tr, "modernBigIntToBase64");
  n(_r, "modernBase64ToBigInt");
  Cr = DataView.prototype.setBigInt64 ? Tr : Sr, $r = DataView.prototype.getBigInt64 ? _r : Or, wt = 1024;
  n(Be, "validateObjectField");
  n(w, "jsonToConvex");
  xt = 16384;
  n(F, "stringifyValueForError");
  n(X, "convexToJsonInternal");
  n(Re, "errorMessageForUnsupportedType");
  n(vt, "convexOrUndefinedToJsonInternal");
  n(m, "convexToJson");
  n(E, "convexOrUndefinedToJson");
  n(At, "patchValueToJson");
});

// node_modules/convex/dist/esm/values/validators.js
function Y(t, e) {
  let r = e !== void 0 ? ` for field "${e}"` : "";
  throw new Error(
    `A validator is undefined${r} in ${t}. This is often caused by circular imports. See ${Fr} for details.`
  );
}
var Nr, Pr, y, Fr, b, oe, K, Z, se, ie, ae, ue, ce, le, fe, pe, de, he, Et = l(() => {
  "use strict";
  O();
  Nr = Object.defineProperty, Pr = /* @__PURE__ */ n((t, e, r) => e in t ? Nr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), y = /* @__PURE__ */ n((t, e, r) => Pr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), Fr = "https://docs.convex.dev/error#undefined-validator";
  n(Y, "throwUndefinedValidatorError");
  b = class {
    static {
      n(this, "BaseValidator");
    }
    constructor({ isOptional: e }) {
      y(this, "type"), y(this, "fieldPaths"), y(this, "isOptional"), y(this, "isConvexValidator"), this.isOptional = e, this.isConvexValidator = !0;
    }
  }, oe = class t extends b {
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
      if (super({ isOptional: e }), y(this, "tableName"), y(this, "kind", "id"), typeof r != "string")
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
  }, K = class t extends b {
    static {
      n(this, "VFloat64");
    }
    constructor() {
      super(...arguments), y(this, "kind", "float64");
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
  }, Z = class t extends b {
    static {
      n(this, "VInt64");
    }
    constructor() {
      super(...arguments), y(this, "kind", "int64");
    }
    /** @internal */
    get json() {
      return { type: "bigint" };
    }
    /** @internal */
    asOptional() {
      return new t({ isOptional: "optional" });
    }
  }, se = class t extends b {
    static {
      n(this, "VBoolean");
    }
    constructor() {
      super(...arguments), y(this, "kind", "boolean");
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
      n(this, "VBytes");
    }
    constructor() {
      super(...arguments), y(this, "kind", "bytes");
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
      n(this, "VString");
    }
    constructor() {
      super(...arguments), y(this, "kind", "string");
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
  }, ue = class t extends b {
    static {
      n(this, "VNull");
    }
    constructor() {
      super(...arguments), y(this, "kind", "null");
    }
    /** @internal */
    get json() {
      return { type: this.kind };
    }
    /** @internal */
    asOptional() {
      return new t({ isOptional: "optional" });
    }
  }, ce = class t extends b {
    static {
      n(this, "VAny");
    }
    constructor() {
      super(...arguments), y(this, "kind", "any");
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
  }, le = class t extends b {
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
      super({ isOptional: e }), y(this, "fields"), y(this, "kind", "object"), globalThis.Object.entries(r).forEach(([o, s]) => {
        if (s === void 0 && Y("v.object()", o), !s.isConvexValidator)
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
  }, fe = class t extends b {
    static {
      n(this, "VLiteral");
    }
    /**
     * Usually you'd use `v.literal(value)` instead.
     */
    constructor({ isOptional: e, value: r }) {
      if (super({ isOptional: e }), y(this, "value"), y(this, "kind", "literal"), typeof r != "string" && typeof r != "boolean" && typeof r != "number" && typeof r != "bigint")
        throw new Error("v.literal(value) must be a string, number, or boolean");
      this.value = r;
    }
    /** @internal */
    get json() {
      return {
        type: this.kind,
        value: m(this.value)
      };
    }
    /** @internal */
    asOptional() {
      return new t({
        isOptional: "optional",
        value: this.value
      });
    }
  }, pe = class t extends b {
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
      super({ isOptional: e }), y(this, "element"), y(this, "kind", "array"), r === void 0 && Y("v.array()"), this.element = r;
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
  }, de = class t extends b {
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
      if (super({ isOptional: e }), y(this, "key"), y(this, "value"), y(this, "kind", "record"), r === void 0 && Y("v.record()", "key"), o === void 0 && Y("v.record()", "value"), r.isOptional === "optional")
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
  }, he = class t extends b {
    static {
      n(this, "VUnion");
    }
    /**
     * Usually you'd use `v.union(...members)` instead.
     */
    constructor({ isOptional: e, members: r }) {
      super({ isOptional: e }), y(this, "members"), y(this, "kind", "union"), r.forEach((o, s) => {
        if (o === void 0 && Y("v.union()", `member at index ${s}`), !o.isConvexValidator)
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
function Me(t) {
  return !!t.isConvexValidator;
}
function me(t) {
  return Me(t) ? t : u.object(t);
}
var u, ee = l(() => {
  "use strict";
  Et();
  n(Me, "isValidator");
  n(me, "asObjectValidator");
  u = {
    /**
     * Validates that the value corresponds to an ID of a document in given table.
     * @param tableName The name of the table.
     */
    id: /* @__PURE__ */ n((t) => new oe({
      isOptional: "required",
      tableName: t
    }), "id"),
    /**
     * Validates that the value is of type Null.
     */
    null: /* @__PURE__ */ n(() => new ue({ isOptional: "required" }), "null"),
    /**
     * Validates that the value is of Convex type Float64 (Number in JS).
     *
     * Alias for `v.float64()`
     */
    number: /* @__PURE__ */ n(() => new K({ isOptional: "required" }), "number"),
    /**
     * Validates that the value is of Convex type Float64 (Number in JS).
     */
    float64: /* @__PURE__ */ n(() => new K({ isOptional: "required" }), "float64"),
    /**
     * @deprecated Use `v.int64()` instead
     */
    bigint: /* @__PURE__ */ n(() => new Z({ isOptional: "required" }), "bigint"),
    /**
     * Validates that the value is of Convex type Int64 (BigInt in JS).
     */
    int64: /* @__PURE__ */ n(() => new Z({ isOptional: "required" }), "int64"),
    /**
     * Validates that the value is of type Boolean.
     */
    boolean: /* @__PURE__ */ n(() => new se({ isOptional: "required" }), "boolean"),
    /**
     * Validates that the value is of type String.
     */
    string: /* @__PURE__ */ n(() => new ae({ isOptional: "required" }), "string"),
    /**
     * Validates that the value is of Convex type Bytes (constructed in JS via `ArrayBuffer`).
     */
    bytes: /* @__PURE__ */ n(() => new ie({ isOptional: "required" }), "bytes"),
    /**
     * Validates that the value is equal to the given literal value.
     * @param literal The literal value to compare against.
     */
    literal: /* @__PURE__ */ n((t) => new fe({ isOptional: "required", value: t }), "literal"),
    /**
     * Validates that the value is an Array of the given element type.
     * @param element The validator for the elements of the array.
     */
    array: /* @__PURE__ */ n((t) => new pe({ isOptional: "required", element: t }), "array"),
    /**
     * Validates that the value is an Object with the given properties.
     * @param fields An object specifying the validator for each property.
     */
    object: /* @__PURE__ */ n((t) => new le({ isOptional: "required", fields: t }), "object"),
    /**
     * Validates that the value is a Record with keys and values that match the given types.
     * @param keys The validator for the keys of the record. This cannot contain string literals.
     * @param values The validator for the values of the record.
     */
    record: /* @__PURE__ */ n((t, e) => new de({
      isOptional: "required",
      key: t,
      value: e
    }), "record"),
    /**
     * Validates that the value matches one of the given validators.
     * @param members The validators to match against.
     */
    union: /* @__PURE__ */ n((...t) => new he({
      isOptional: "required",
      members: t
    }), "union"),
    /**
     * Does not validate the value.
     */
    any: /* @__PURE__ */ n(() => new ce({ isOptional: "required" }), "any"),
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
var Rr, qr, Ue, It, St, Br, ye, Je = l(() => {
  "use strict";
  O();
  Rr = Object.defineProperty, qr = /* @__PURE__ */ n((t, e, r) => e in t ? Rr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), Ue = /* @__PURE__ */ n((t, e, r) => qr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), Br = Symbol.for("ConvexError"), ye = class extends (St = Error, It = Br, St) {
    static {
      n(this, "ConvexError");
    }
    constructor(e) {
      super(typeof e == "string" ? e : F(e)), Ue(this, "name", "ConvexError"), Ue(this, "data"), Ue(this, It, !0), this.data = e;
    }
  };
});

// node_modules/convex/dist/esm/values/compare_utf8.js
var Ot, Xn, Yn, Tt = l(() => {
  "use strict";
  Ot = /* @__PURE__ */ n(() => Array.from({ length: 4 }, () => 0), "arr"), Xn = Ot(), Yn = Ot();
});

// node_modules/convex/dist/esm/values/compare.js
var _t = l(() => {
  "use strict";
  Tt();
});

// node_modules/convex/dist/esm/values/index.js
var $ = l(() => {
  "use strict";
  O();
  ee();
  Pe();
  Je();
  _t();
});

// node_modules/convex/dist/esm/server/pagination.js
var fo, Ct = l(() => {
  "use strict";
  ee();
  fo = u.object({
    numItems: u.number(),
    cursor: u.union(u.string(), u.null()),
    endCursor: u.optional(u.union(u.string(), u.null())),
    id: u.optional(u.number()),
    maximumRowsRead: u.optional(u.number()),
    maximumBytesRead: u.optional(u.number())
  });
});

// node_modules/convex/dist/esm/server/functionName.js
var R, Ve = l(() => {
  "use strict";
  R = Symbol.for("functionName");
});

// node_modules/convex/dist/esm/server/components/paths.js
function jr(t) {
  return t[Le] ?? null;
}
function Mr(t) {
  return t.startsWith("function://");
}
function v(t) {
  let e;
  if (typeof t == "string")
    Mr(t) ? e = { functionHandle: t } : e = { name: t };
  else if (t[R])
    e = { name: t[R] };
  else {
    let r = jr(t);
    if (!r)
      throw new Error(`${t} is not a functionReference`);
    e = { reference: r };
  }
  return e;
}
var Le, q = l(() => {
  "use strict";
  Ve();
  Le = Symbol.for("toReferencePath");
  n(jr, "extractReferencePath");
  n(Mr, "isFunctionHandle");
  n(v, "getFunctionAddress");
});

// node_modules/convex/dist/esm/server/api.js
function ke(t) {
  let e = v(t);
  if (e.name === void 0)
    throw e.functionHandle !== void 0 ? new Error(
      `Expected function reference like "api.file.func" or "internal.file.func", but received function handle ${e.functionHandle}`
    ) : e.reference !== void 0 ? new Error(
      `Expected function reference in the current component like "api.file.func" or "internal.file.func", but received reference ${e.reference}`
    ) : new Error(
      `Expected function reference like "api.file.func" or "internal.file.func", but received ${JSON.stringify(e)}`
    );
  if (typeof t == "string") return t;
  let r = t[R];
  if (!r)
    throw new Error(`${t} is not a functionReference`);
  return r;
}
function Ur(t) {
  return { [R]: t };
}
function $t(t = []) {
  let e = {
    get(r, o) {
      if (typeof o == "string") {
        let s = [...t, o];
        return $t(s);
      } else if (o === R) {
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
var Jr, De = l(() => {
  "use strict";
  Ve();
  q();
  n(ke, "getFunctionName");
  n(Ur, "makeFunctionReference");
  n($t, "createApi");
  Jr = $t();
});

// node_modules/convex/dist/esm/server/cron.js
function Qe(t) {
  if (!Number.isInteger(t) || t <= 0)
    throw new Error("Interval must be an integer greater than 0");
}
function Qr(t) {
  if (!Number.isInteger(t) || t < 1 || t > 31)
    throw new Error("Day of month must be an integer from 1 to 31");
  return t;
}
function Hr(t) {
  if (!kr.includes(t))
    throw new Error('Day of week must be a string like "monday".');
  return t;
}
function He(t) {
  if (!Number.isInteger(t) || t < 0 || t > 23)
    throw new Error("Hour of day must be an integer from 0 to 23");
  return t;
}
function we(t) {
  if (!Number.isInteger(t) || t < 0 || t > 59)
    throw new Error("Minute of hour must be an integer from 0 to 59");
  return t;
}
function Gr(t) {
  if (!t.match(/^[ -~]*$/))
    throw new Error(
      `Invalid cron identifier ${t}: use ASCII letters that are not control characters`
    );
  return t;
}
var Vr, Lr, Nt, kr, Dr, Ge, Pt = l(() => {
  "use strict";
  De();
  L();
  $();
  Vr = Object.defineProperty, Lr = /* @__PURE__ */ n((t, e, r) => e in t ? Vr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), Nt = /* @__PURE__ */ n((t, e, r) => Lr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), kr = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ], Dr = /* @__PURE__ */ n(() => new Ge(), "cronJobs");
  n(Qe, "validateIntervalNumber");
  n(Qr, "validatedDayOfMonth");
  n(Hr, "validatedDayOfWeek");
  n(He, "validatedHourOfDay");
  n(we, "validatedMinuteOfHour");
  n(Gr, "validatedCronIdentifier");
  Ge = class {
    static {
      n(this, "Crons");
    }
    constructor() {
      Nt(this, "crons"), Nt(this, "isCrons"), this.isCrons = !0, this.crons = {};
    }
    /** @internal */
    schedule(e, r, o, s) {
      let i = _(s);
      if (Gr(e), e in this.crons)
        throw new Error(`Cron identifier registered twice: ${e}`);
      this.crons[e] = {
        name: ke(o),
        args: [m(i)],
        schedule: r
      };
    }
    /**
     * Schedule a mutation or action to run at some interval.
     *
     * ```js
     * crons.interval("Clear presence data", {seconds: 30}, api.presence.clear);
     * ```
     *
     * @param identifier - A unique name for this scheduled job.
     * @param schedule - The time between runs for this scheduled job.
     * @param functionReference - A {@link FunctionReference} for the function
     * to schedule.
     * @param args - The arguments to the function.
     */
    interval(e, r, o, ...s) {
      let i = r, a = +("seconds" in i && i.seconds !== void 0), c = +("minutes" in i && i.minutes !== void 0), h = +("hours" in i && i.hours !== void 0);
      if (a + c + h !== 1)
        throw new Error("Must specify one of seconds, minutes, or hours");
      a ? Qe(r.seconds) : c ? Qe(r.minutes) : h && Qe(r.hours), this.schedule(
        e,
        { ...r, type: "interval" },
        o,
        ...s
      );
    }
    /**
     * Schedule a mutation or action to run on an hourly basis.
     *
     * ```js
     * crons.hourly(
     *   "Reset high scores",
     *   {
     *     minuteUTC: 30,
     *   },
     *   api.scores.reset
     * )
     * ```
     *
     * @param cronIdentifier - A unique name for this scheduled job.
     * @param schedule - What time (UTC) each day to run this function.
     * @param functionReference - A {@link FunctionReference} for the function
     * to schedule.
     * @param args - The arguments to the function.
     */
    hourly(e, r, o, ...s) {
      let i = we(r.minuteUTC);
      this.schedule(
        e,
        { minuteUTC: i, type: "hourly" },
        o,
        ...s
      );
    }
    /**
     * Schedule a mutation or action to run on a daily basis.
     *
     * ```js
     * crons.daily(
     *   "Reset high scores",
     *   {
     *     hourUTC: 17, // (9:30am Pacific/10:30am Daylight Savings Pacific)
     *     minuteUTC: 30,
     *   },
     *   api.scores.reset
     * )
     * ```
     *
     * @param cronIdentifier - A unique name for this scheduled job.
     * @param schedule - What time (UTC) each day to run this function.
     * @param functionReference - A {@link FunctionReference} for the function
     * to schedule.
     * @param args - The arguments to the function.
     */
    daily(e, r, o, ...s) {
      let i = He(r.hourUTC), a = we(r.minuteUTC);
      this.schedule(
        e,
        { hourUTC: i, minuteUTC: a, type: "daily" },
        o,
        ...s
      );
    }
    /**
     * Schedule a mutation or action to run on a weekly basis.
     *
     * ```js
     * crons.weekly(
     *   "Weekly re-engagement email",
     *   {
     *     dayOfWeek: "Tuesday",
     *     hourUTC: 17, // (9:30am Pacific/10:30am Daylight Savings Pacific)
     *     minuteUTC: 30,
     *   },
     *   api.emails.send
     * )
     * ```
     *
     * @param cronIdentifier - A unique name for this scheduled job.
     * @param schedule - What day and time (UTC) each week to run this function.
     * @param functionReference - A {@link FunctionReference} for the function
     * to schedule.
     */
    weekly(e, r, o, ...s) {
      let i = Hr(r.dayOfWeek), a = He(r.hourUTC), c = we(r.minuteUTC);
      this.schedule(
        e,
        { dayOfWeek: i, hourUTC: a, minuteUTC: c, type: "weekly" },
        o,
        ...s
      );
    }
    /**
     * Schedule a mutation or action to run on a monthly basis.
     *
     * Note that some months have fewer days than others, so e.g. a function
     * scheduled to run on the 30th will not run in February.
     *
     * ```js
     * crons.monthly(
     *   "Bill customers at ",
     *   {
     *     hourUTC: 17, // (9:30am Pacific/10:30am Daylight Savings Pacific)
     *     minuteUTC: 30,
     *     day: 1,
     *   },
     *   api.billing.billCustomers
     * )
     * ```
     *
     * @param cronIdentifier - A unique name for this scheduled job.
     * @param schedule - What day and time (UTC) each month to run this function.
     * @param functionReference - A {@link FunctionReference} for the function
     * to schedule.
     * @param args - The arguments to the function.
     */
    monthly(e, r, o, ...s) {
      let i = Qr(r.day), a = He(r.hourUTC), c = we(r.minuteUTC);
      this.schedule(
        e,
        { day: i, hourUTC: a, minuteUTC: c, type: "monthly" },
        o,
        ...s
      );
    }
    /**
     * Schedule a mutation or action to run on a recurring basis.
     *
     * Like the unix command `cron`, Sunday is 0, Monday is 1, etc.
     *
     * ```
     *  ┌─ minute (0 - 59)
     *  │ ┌─ hour (0 - 23)
     *  │ │ ┌─ day of the month (1 - 31)
     *  │ │ │ ┌─ month (1 - 12)
     *  │ │ │ │ ┌─ day of the week (0 - 6) (Sunday to Saturday)
     * "* * * * *"
     * ```
     *
     * @param cronIdentifier - A unique name for this scheduled job.
     * @param cron - Cron string like `"15 7 * * *"` (Every day at 7:15 UTC)
     * @param functionReference - A {@link FunctionReference} for the function
     * to schedule.
     * @param args - The arguments to the function.
     */
    cron(e, r, o, ...s) {
      let i = r;
      this.schedule(
        e,
        { cron: i, type: "cron" },
        o,
        ...s
      );
    }
    /** @internal */
    export() {
      return JSON.stringify(this.crons);
    }
  };
});

// node_modules/convex/dist/esm/server/impl/syscall.js
function te(t, e) {
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
      let s = new ye(o.message);
      throw s.data = w(o.data), s;
    }
    throw new Error(o.message);
  }
  return JSON.parse(r);
}
function B(t, e) {
  if (typeof Convex > "u" || Convex.jsSyscall === void 0)
    throw new Error(
      "The Convex database and auth objects are being used outside of a Convex backend. Did you mean to use `useQuery` or `useMutation` to call a Convex function?"
    );
  return Convex.jsSyscall(t, e);
}
var I = l(() => {
  "use strict";
  Je();
  O();
  n(te, "performSyscall");
  n(f, "performAsyncSyscall");
  n(B, "performJsSyscall");
});

// node_modules/convex/dist/esm/server/router.js
function Xr(t) {
  return t === "HEAD" ? "GET" : t;
}
var Wr, zr, j, Ft, Yr, xe, Rt = l(() => {
  "use strict";
  I();
  Wr = Object.defineProperty, zr = /* @__PURE__ */ n((t, e, r) => e in t ? Wr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), j = /* @__PURE__ */ n((t, e, r) => zr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), Ft = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS",
    "PATCH"
  ];
  n(Xr, "normalizeMethod");
  Yr = /* @__PURE__ */ n(() => new xe(), "httpRouter"), xe = class {
    static {
      n(this, "HttpRouter");
    }
    constructor() {
      j(this, "exactRoutes", /* @__PURE__ */ new Map()), j(this, "prefixRoutes", /* @__PURE__ */ new Map()), j(this, "isRouter", !0), j(this, "route", (e) => {
        if (!e.handler) throw new Error("route requires handler");
        if (!e.method) throw new Error("route requires method");
        let { method: r, handler: o } = e;
        if (!Ft.includes(r))
          throw new Error(
            `'${r}' is not an allowed HTTP method (like GET, POST, PUT etc.)`
          );
        if ("path" in e) {
          if ("pathPrefix" in e)
            throw new Error(
              "Invalid httpRouter route: cannot contain both 'path' and 'pathPrefix'"
            );
          if (!e.path.startsWith("/"))
            throw new Error(`path '${e.path}' does not start with a /`);
          if (e.path.startsWith("/.files/") || e.path === "/.files")
            throw new Error(`path '${e.path}' is reserved`);
          let s = this.exactRoutes.has(e.path) ? this.exactRoutes.get(e.path) : /* @__PURE__ */ new Map();
          if (s.has(r))
            throw new Error(
              `Path '${e.path}' for method ${r} already in use`
            );
          s.set(r, o), this.exactRoutes.set(e.path, s);
        } else if ("pathPrefix" in e) {
          if (!e.pathPrefix.startsWith("/"))
            throw new Error(
              `pathPrefix '${e.pathPrefix}' does not start with a /`
            );
          if (!e.pathPrefix.endsWith("/"))
            throw new Error(`pathPrefix ${e.pathPrefix} must end with a /`);
          if (e.pathPrefix.startsWith("/.files/"))
            throw new Error(`pathPrefix '${e.pathPrefix}' is reserved`);
          let s = this.prefixRoutes.get(r) || /* @__PURE__ */ new Map();
          if (s.has(e.pathPrefix))
            throw new Error(
              `${e.method} pathPrefix ${e.pathPrefix} is already defined`
            );
          s.set(e.pathPrefix, o), this.prefixRoutes.set(r, s);
        } else
          throw new Error(
            "Invalid httpRouter route entry: must contain either field 'path' or 'pathPrefix'"
          );
      }), j(this, "getRoutes", () => {
        let r = [...this.exactRoutes.keys()].sort().flatMap(
          (i) => [...this.exactRoutes.get(i).keys()].sort().map(
            (a) => [i, a, this.exactRoutes.get(i).get(a)]
          )
        ), s = [...this.prefixRoutes.keys()].sort().flatMap(
          (i) => [...this.prefixRoutes.get(i).keys()].sort().map(
            (a) => [
              `${a}*`,
              i,
              this.prefixRoutes.get(i).get(a)
            ]
          )
        );
        return [...r, ...s];
      }), j(this, "lookup", (e, r) => {
        r = Xr(r);
        let o = this.exactRoutes.get(e)?.get(r);
        if (o) return [o, r, e];
        let i = [...(this.prefixRoutes.get(r) || /* @__PURE__ */ new Map()).entries()].sort(
          ([a, c], [h, C]) => h.length - a.length
        );
        for (let [a, c] of i)
          if (e.startsWith(a))
            return [c, r, `${a}*`];
        return null;
      }), j(this, "runRequest", async (e, r) => {
        let o = B("requestFromConvexJson", {
          convexJson: JSON.parse(e)
        }), s = r;
        (!s || typeof s != "string") && (s = new URL(o.url).pathname);
        let i = o.method, a = this.lookup(s, i);
        if (!a) {
          let $e = new Response(`No HttpAction routed for ${s}`, {
            status: 404
          });
          return JSON.stringify(
            B("convexJsonFromResponse", { response: $e })
          );
        }
        let [c, h, C] = a, Ce = await c.invokeHttpAction(o);
        return JSON.stringify(
          B("convexJsonFromResponse", { response: Ce })
        );
      });
    }
  };
});

// node_modules/convex/dist/esm/server/database.js
var qt = l(() => {
  "use strict";
});

// node_modules/convex/dist/esm/index.js
var x, N = l(() => {
  "use strict";
  x = "1.31.3";
});

// node_modules/convex/dist/esm/server/impl/actions_impl.js
function We(t, e, r) {
  return {
    ...v(e),
    args: m(_(r)),
    version: x,
    requestId: t
  };
}
function ze(t) {
  return {
    runQuery: /* @__PURE__ */ n(async (e, r) => {
      let o = await f(
        "1.0/actions/query",
        We(t, e, r)
      );
      return w(o);
    }, "runQuery"),
    runMutation: /* @__PURE__ */ n(async (e, r) => {
      let o = await f(
        "1.0/actions/mutation",
        We(t, e, r)
      );
      return w(o);
    }, "runMutation"),
    runAction: /* @__PURE__ */ n(async (e, r) => {
      let o = await f(
        "1.0/actions/action",
        We(t, e, r)
      );
      return w(o);
    }, "runAction")
  };
}
var Bt = l(() => {
  "use strict";
  $();
  N();
  I();
  L();
  q();
  n(We, "syscallArgs");
  n(ze, "setupActionCalls");
});

// node_modules/convex/dist/esm/server/vector_search.js
var Kr, Zr, jt, ge, Mt = l(() => {
  "use strict";
  Kr = Object.defineProperty, Zr = /* @__PURE__ */ n((t, e, r) => e in t ? Kr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), jt = /* @__PURE__ */ n((t, e, r) => Zr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), ge = class {
    static {
      n(this, "FilterExpression");
    }
    /**
     * @internal
     */
    constructor() {
      jt(this, "_isExpression"), jt(this, "_value");
    }
  };
});

// node_modules/convex/dist/esm/server/impl/validate.js
function p(t, e, r, o) {
  if (t === void 0)
    throw new TypeError(
      `Must provide arg ${e} \`${o}\` to \`${r}\``
    );
}
function Ut(t, e, r, o) {
  if (!Number.isInteger(t) || t < 0)
    throw new TypeError(
      `Arg ${e} \`${o}\` to \`${r}\` must be a non-negative integer`
    );
}
var M = l(() => {
  "use strict";
  n(p, "validateArg");
  n(Ut, "validateArgIsNonNegativeInteger");
});

// node_modules/convex/dist/esm/server/impl/vector_search_impl.js
function Ke(t) {
  return async (e, r, o) => {
    if (p(e, 1, "vectorSearch", "tableName"), p(r, 2, "vectorSearch", "indexName"), p(o, 3, "vectorSearch", "query"), !o.vector || !Array.isArray(o.vector) || o.vector.length === 0)
      throw Error("`vector` must be a non-empty Array in vectorSearch");
    return await new Ye(
      t,
      e + "." + r,
      o
    ).collect();
  };
}
function be(t) {
  return t instanceof D ? t.serialize() : { $literal: E(t) };
}
var en, tn, Xe, Ye, D, rn, Jt = l(() => {
  "use strict";
  I();
  N();
  Mt();
  M();
  O();
  en = Object.defineProperty, tn = /* @__PURE__ */ n((t, e, r) => e in t ? en(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), Xe = /* @__PURE__ */ n((t, e, r) => tn(t, typeof e != "symbol" ? e + "" : e, r), "__publicField");
  n(Ke, "setupActionVectorSearch");
  Ye = class {
    static {
      n(this, "VectorQueryImpl");
    }
    constructor(e, r, o) {
      Xe(this, "requestId"), Xe(this, "state"), this.requestId = e;
      let s = o.filter ? be(o.filter(rn)) : null;
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
  }, D = class extends ge {
    static {
      n(this, "ExpressionImpl");
    }
    constructor(e) {
      super(), Xe(this, "inner"), this.inner = e;
    }
    serialize() {
      return this.inner;
    }
  };
  n(be, "serializeExpression");
  rn = {
    //  Comparisons  /////////////////////////////////////////////////////////////
    eq(t, e) {
      if (typeof t != "string")
        throw new Error("The first argument to `q.eq` must be a field name.");
      return new D({
        $eq: [
          be(new D({ $field: t })),
          be(e)
        ]
      });
    },
    //  Logic  ///////////////////////////////////////////////////////////////////
    or(...t) {
      return new D({ $or: t.map(be) });
    }
  };
});

// node_modules/convex/dist/esm/server/impl/authentication_impl.js
function re(t) {
  return {
    getUserIdentity: /* @__PURE__ */ n(async () => await f("1.0/getUserIdentity", {
      requestId: t
    }), "getUserIdentity")
  };
}
var Vt = l(() => {
  "use strict";
  I();
  n(re, "setupAuth");
});

// node_modules/convex/dist/esm/server/filter_builder.js
var nn, on, Lt, ve, kt = l(() => {
  "use strict";
  nn = Object.defineProperty, on = /* @__PURE__ */ n((t, e, r) => e in t ? nn(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), Lt = /* @__PURE__ */ n((t, e, r) => on(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), ve = class {
    static {
      n(this, "Expression");
    }
    /**
     * @internal
     */
    constructor() {
      Lt(this, "_isExpression"), Lt(this, "_value");
    }
  };
});

// node_modules/convex/dist/esm/server/impl/filter_builder_impl.js
function d(t) {
  return t instanceof g ? t.serialize() : { $literal: E(t) };
}
var sn, an, un, g, Dt, Qt = l(() => {
  "use strict";
  O();
  kt();
  sn = Object.defineProperty, an = /* @__PURE__ */ n((t, e, r) => e in t ? sn(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), un = /* @__PURE__ */ n((t, e, r) => an(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), g = class extends ve {
    static {
      n(this, "ExpressionImpl");
    }
    constructor(e) {
      super(), un(this, "inner"), this.inner = e;
    }
    serialize() {
      return this.inner;
    }
  };
  n(d, "serializeExpression");
  Dt = {
    //  Comparisons  /////////////////////////////////////////////////////////////
    eq(t, e) {
      return new g({
        $eq: [d(t), d(e)]
      });
    },
    neq(t, e) {
      return new g({
        $neq: [d(t), d(e)]
      });
    },
    lt(t, e) {
      return new g({
        $lt: [d(t), d(e)]
      });
    },
    lte(t, e) {
      return new g({
        $lte: [d(t), d(e)]
      });
    },
    gt(t, e) {
      return new g({
        $gt: [d(t), d(e)]
      });
    },
    gte(t, e) {
      return new g({
        $gte: [d(t), d(e)]
      });
    },
    //  Arithmetic  //////////////////////////////////////////////////////////////
    add(t, e) {
      return new g({
        $add: [d(t), d(e)]
      });
    },
    sub(t, e) {
      return new g({
        $sub: [d(t), d(e)]
      });
    },
    mul(t, e) {
      return new g({
        $mul: [d(t), d(e)]
      });
    },
    div(t, e) {
      return new g({
        $div: [d(t), d(e)]
      });
    },
    mod(t, e) {
      return new g({
        $mod: [d(t), d(e)]
      });
    },
    neg(t) {
      return new g({ $neg: d(t) });
    },
    //  Logic  ///////////////////////////////////////////////////////////////////
    and(...t) {
      return new g({ $and: t.map(d) });
    },
    or(...t) {
      return new g({ $or: t.map(d) });
    },
    not(t) {
      return new g({ $not: d(t) });
    },
    //  Other  ///////////////////////////////////////////////////////////////////
    field(t) {
      return new g({ $field: t });
    }
  };
});

// node_modules/convex/dist/esm/server/index_range_builder.js
var cn, ln, fn, Ae, Ht = l(() => {
  "use strict";
  cn = Object.defineProperty, ln = /* @__PURE__ */ n((t, e, r) => e in t ? cn(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), fn = /* @__PURE__ */ n((t, e, r) => ln(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), Ae = class {
    static {
      n(this, "IndexRange");
    }
    /**
     * @internal
     */
    constructor() {
      fn(this, "_isIndexRange");
    }
  };
});

// node_modules/convex/dist/esm/server/impl/index_range_builder_impl.js
var pn, dn, Gt, Ee, Wt = l(() => {
  "use strict";
  O();
  Ht();
  pn = Object.defineProperty, dn = /* @__PURE__ */ n((t, e, r) => e in t ? pn(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), Gt = /* @__PURE__ */ n((t, e, r) => dn(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), Ee = class t extends Ae {
    static {
      n(this, "IndexRangeBuilderImpl");
    }
    constructor(e) {
      super(), Gt(this, "rangeExpressions"), Gt(this, "isConsumed"), this.rangeExpressions = e, this.isConsumed = !1;
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
          value: E(r)
        })
      );
    }
    gt(e, r) {
      return this.consume(), new t(
        this.rangeExpressions.concat({
          type: "Gt",
          fieldPath: e,
          value: E(r)
        })
      );
    }
    gte(e, r) {
      return this.consume(), new t(
        this.rangeExpressions.concat({
          type: "Gte",
          fieldPath: e,
          value: E(r)
        })
      );
    }
    lt(e, r) {
      return this.consume(), new t(
        this.rangeExpressions.concat({
          type: "Lt",
          fieldPath: e,
          value: E(r)
        })
      );
    }
    lte(e, r) {
      return this.consume(), new t(
        this.rangeExpressions.concat({
          type: "Lte",
          fieldPath: e,
          value: E(r)
        })
      );
    }
    export() {
      return this.consume(), this.rangeExpressions;
    }
  };
});

// node_modules/convex/dist/esm/server/search_filter_builder.js
var hn, mn, yn, Ie, Ze = l(() => {
  "use strict";
  hn = Object.defineProperty, mn = /* @__PURE__ */ n((t, e, r) => e in t ? hn(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), yn = /* @__PURE__ */ n((t, e, r) => mn(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), Ie = class {
    static {
      n(this, "SearchFilter");
    }
    /**
     * @internal
     */
    constructor() {
      yn(this, "_isSearchFilter");
    }
  };
});

// node_modules/convex/dist/esm/server/impl/search_filter_builder_impl.js
var wn, xn, zt, Se, Xt = l(() => {
  "use strict";
  O();
  Ze();
  M();
  wn = Object.defineProperty, xn = /* @__PURE__ */ n((t, e, r) => e in t ? wn(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), zt = /* @__PURE__ */ n((t, e, r) => xn(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), Se = class t extends Ie {
    static {
      n(this, "SearchFilterBuilderImpl");
    }
    constructor(e) {
      super(), zt(this, "filters"), zt(this, "isConsumed"), this.filters = e, this.isConsumed = !1;
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
      return p(e, 1, "search", "fieldName"), p(r, 2, "search", "query"), this.consume(), new t(
        this.filters.concat({
          type: "Search",
          fieldPath: e,
          value: r
        })
      );
    }
    eq(e, r) {
      return p(e, 1, "eq", "fieldName"), arguments.length !== 2 && p(r, 2, "search", "value"), this.consume(), new t(
        this.filters.concat({
          type: "Eq",
          fieldPath: e,
          value: E(r)
        })
      );
    }
    export() {
      return this.consume(), this.filters;
    }
  };
});

// node_modules/convex/dist/esm/server/impl/query_impl.js
function Kt(t) {
  throw new Error(
    t === "consumed" ? "This query is closed and can't emit any more values." : "This query has been chained with another operator and can't be reused."
  );
}
var gn, bn, et, Yt, Q, U, tt = l(() => {
  "use strict";
  $();
  I();
  Qt();
  Wt();
  Xt();
  M();
  N();
  gn = Object.defineProperty, bn = /* @__PURE__ */ n((t, e, r) => e in t ? gn(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), et = /* @__PURE__ */ n((t, e, r) => bn(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), Yt = 256, Q = class {
    static {
      n(this, "QueryInitializerImpl");
    }
    constructor(e) {
      et(this, "tableName"), this.tableName = e;
    }
    withIndex(e, r) {
      p(e, 1, "withIndex", "indexName");
      let o = Ee.new();
      return r !== void 0 && (o = r(o)), new U({
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
      p(e, 1, "withSearchIndex", "indexName"), p(r, 2, "withSearchIndex", "searchFilter");
      let o = Se.new();
      return new U({
        source: {
          type: "Search",
          indexName: this.tableName + "." + e,
          filters: r(o).export()
        },
        operators: []
      });
    }
    fullTableScan() {
      return new U({
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
      return w(e);
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
  n(Kt, "throwClosedError");
  U = class t {
    static {
      n(this, "QueryImpl");
    }
    constructor(e) {
      et(this, "state"), et(this, "tableNameForErrorMessages"), this.state = { type: "preparing", query: e }, e.source.type === "FullTableScan" ? this.tableNameForErrorMessages = e.source.tableName : this.tableNameForErrorMessages = e.source.indexName.split(".")[0];
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
      (this.state.type === "closed" || this.state.type === "consumed") && Kt(this.state.type);
      let e = this.state.query, { queryId: r } = te("1.0/queryStream", { query: e, version: x });
      return this.state = { type: "executing", queryId: r }, r;
    }
    closeQuery() {
      if (this.state.type === "executing") {
        let e = this.state.queryId;
        te("1.0/queryCleanup", { queryId: e });
      }
      this.state = { type: "consumed" };
    }
    order(e) {
      p(e, 1, "order", "order");
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
      p(e, 1, "filter", "predicate");
      let r = this.takeQuery();
      if (r.operators.length >= Yt)
        throw new Error(
          `Can't construct query with more than ${Yt} operators`
        );
      return r.operators.push({
        filter: d(e(Dt))
      }), new t(r);
    }
    limit(e) {
      p(e, 1, "limit", "n");
      let r = this.takeQuery();
      return r.operators.push({ limit: e }), new t(r);
    }
    [Symbol.asyncIterator]() {
      return this.startQuery(), this;
    }
    async next() {
      (this.state.type === "closed" || this.state.type === "consumed") && Kt(this.state.type);
      let e = this.state.type === "preparing" ? this.startQuery() : this.state.queryId, { value: r, done: o } = await f("1.0/queryStreamNext", {
        queryId: e
      });
      return o && this.closeQuery(), { value: w(r), done: o };
    }
    return() {
      return this.closeQuery(), Promise.resolve({ done: !0, value: void 0 });
    }
    async paginate(e) {
      if (p(e, 1, "paginate", "options"), typeof e?.numItems != "number" || e.numItems < 0)
        throw new Error(
          `\`options.numItems\` must be a positive number. Received \`${e?.numItems}\`.`
        );
      let r = this.takeQuery(), o = e.numItems, s = e.cursor, i = e?.endCursor ?? null, a = e.maximumRowsRead ?? null, { page: c, isDone: h, continueCursor: C, splitCursor: Ce, pageStatus: $e } = await f("1.0/queryPage", {
        query: r,
        cursor: s,
        endCursor: i,
        pageSize: o,
        maximumRowsRead: a,
        maximumBytesRead: e.maximumBytesRead,
        version: x
      });
      return {
        page: c.map((wr) => w(wr)),
        isDone: h,
        continueCursor: C,
        splitCursor: Ce,
        pageStatus: $e
      };
    }
    async collect() {
      let e = [];
      for await (let r of this)
        e.push(r);
      return e;
    }
    async take(e) {
      return p(e, 1, "take", "n"), Ut(e, 1, "take", "n"), this.limit(e).collect();
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
async function rt(t, e, r) {
  if (p(e, 1, "get", "id"), typeof e != "string")
    throw new Error(
      `Invalid argument \`id\` for \`db.get\`, expected string but got '${typeof e}': ${e}`
    );
  let o = {
    id: m(e),
    isSystem: r,
    version: x,
    table: t
  }, s = await f("1.0/get", o);
  return w(s);
}
function at() {
  let t = /* @__PURE__ */ n((s = !1) => ({
    get: /* @__PURE__ */ n(async (i, a) => a !== void 0 ? await rt(i, a, s) : await rt(void 0, i, s), "get"),
    query: /* @__PURE__ */ n((i) => new ne(i, s).query(), "query"),
    normalizeId: /* @__PURE__ */ n((i, a) => {
      p(i, 1, "normalizeId", "tableName"), p(a, 2, "normalizeId", "id");
      let c = i.startsWith("_");
      if (c !== s)
        throw new Error(
          `${c ? "System" : "User"} tables can only be accessed from db.${s ? "" : "system."}normalizeId().`
        );
      let h = te("1.0/db/normalizeId", {
        table: i,
        idString: a
      });
      return w(h).id;
    }, "normalizeId"),
    // We set the system reader on the next line
    system: null,
    table: /* @__PURE__ */ n((i) => new ne(i, s), "table")
  }), "reader"), { system: e, ...r } = t(!0), o = t();
  return o.system = r, o;
}
async function Zt(t, e) {
  if (t.startsWith("_"))
    throw new Error("System tables (prefixed with `_`) are read-only.");
  p(t, 1, "insert", "table"), p(e, 2, "insert", "value");
  let r = await f("1.0/insert", {
    table: t,
    value: m(e)
  });
  return w(r)._id;
}
async function nt(t, e, r) {
  p(e, 1, "patch", "id"), p(r, 2, "patch", "value"), await f("1.0/shallowMerge", {
    id: m(e),
    value: At(r),
    table: t
  });
}
async function ot(t, e, r) {
  p(e, 1, "replace", "id"), p(r, 2, "replace", "value"), await f("1.0/replace", {
    id: m(e),
    value: m(r),
    table: t
  });
}
async function st(t, e) {
  p(e, 1, "delete", "id"), await f("1.0/remove", {
    id: m(e),
    table: t
  });
}
function er() {
  let t = at();
  return {
    get: t.get,
    query: t.query,
    normalizeId: t.normalizeId,
    system: t.system,
    insert: /* @__PURE__ */ n(async (e, r) => await Zt(e, r), "insert"),
    patch: /* @__PURE__ */ n(async (e, r, o) => o !== void 0 ? await nt(e, r, o) : await nt(void 0, e, r), "patch"),
    replace: /* @__PURE__ */ n(async (e, r, o) => o !== void 0 ? await ot(e, r, o) : await ot(void 0, e, r), "replace"),
    delete: /* @__PURE__ */ n(async (e, r) => r !== void 0 ? await st(e, r) : await st(void 0, e), "delete"),
    table: /* @__PURE__ */ n((e) => new it(e, !1), "table")
  };
}
var ne, it, tr = l(() => {
  "use strict";
  $();
  I();
  tt();
  M();
  N();
  O();
  n(rt, "get");
  n(at, "setupReader");
  n(Zt, "insert");
  n(nt, "patch");
  n(ot, "replace");
  n(st, "delete_");
  n(er, "setupWriter");
  ne = class {
    static {
      n(this, "TableReader");
    }
    constructor(e, r) {
      this.tableName = e, this.isSystem = r;
    }
    async get(e) {
      return rt(this.tableName, e, this.isSystem);
    }
    query() {
      let e = this.tableName.startsWith("_");
      if (e !== this.isSystem)
        throw new Error(
          `${e ? "System" : "User"} tables can only be accessed from db.${this.isSystem ? "" : "system."}query().`
        );
      return new Q(this.tableName);
    }
  }, it = class extends ne {
    static {
      n(this, "TableWriter");
    }
    async insert(e) {
      return Zt(this.tableName, e);
    }
    async patch(e, r) {
      return nt(this.tableName, e, r);
    }
    async replace(e, r) {
      return ot(this.tableName, e, r);
    }
    async delete(e) {
      return st(this.tableName, e);
    }
  };
});

// node_modules/convex/dist/esm/server/impl/scheduler_impl.js
function rr() {
  return {
    runAfter: /* @__PURE__ */ n(async (t, e, r) => {
      let o = nr(t, e, r);
      return await f("1.0/schedule", o);
    }, "runAfter"),
    runAt: /* @__PURE__ */ n(async (t, e, r) => {
      let o = or(
        t,
        e,
        r
      );
      return await f("1.0/schedule", o);
    }, "runAt"),
    cancel: /* @__PURE__ */ n(async (t) => {
      p(t, 1, "cancel", "id");
      let e = { id: m(t) };
      await f("1.0/cancel_job", e);
    }, "cancel")
  };
}
function ut(t) {
  return {
    runAfter: /* @__PURE__ */ n(async (e, r, o) => {
      let s = {
        requestId: t,
        ...nr(e, r, o)
      };
      return await f("1.0/actions/schedule", s);
    }, "runAfter"),
    runAt: /* @__PURE__ */ n(async (e, r, o) => {
      let s = {
        requestId: t,
        ...or(e, r, o)
      };
      return await f("1.0/actions/schedule", s);
    }, "runAt"),
    cancel: /* @__PURE__ */ n(async (e) => {
      p(e, 1, "cancel", "id");
      let r = { id: m(e) };
      return await f("1.0/actions/cancel_job", r);
    }, "cancel")
  };
}
function nr(t, e, r) {
  if (typeof t != "number")
    throw new Error("`delayMs` must be a number");
  if (!isFinite(t))
    throw new Error("`delayMs` must be a finite number");
  if (t < 0)
    throw new Error("`delayMs` must be non-negative");
  let o = _(r), s = v(e), i = (Date.now() + t) / 1e3;
  return {
    ...s,
    ts: i,
    args: m(o),
    version: x
  };
}
function or(t, e, r) {
  let o;
  if (t instanceof Date)
    o = t.valueOf() / 1e3;
  else if (typeof t == "number")
    o = t / 1e3;
  else
    throw new Error("The invoke time must a Date or a timestamp");
  let s = v(e), i = _(r);
  return {
    ...s,
    ts: o,
    args: m(i),
    version: x
  };
}
var sr = l(() => {
  "use strict";
  $();
  N();
  I();
  L();
  M();
  q();
  n(rr, "setupMutationScheduler");
  n(ut, "setupActionScheduler");
  n(nr, "runAfterSyscallArgs");
  n(or, "runAtSyscallArgs");
});

// node_modules/convex/dist/esm/server/impl/storage_impl.js
function ct(t) {
  return {
    getUrl: /* @__PURE__ */ n(async (e) => (p(e, 1, "getUrl", "storageId"), await f("1.0/storageGetUrl", {
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
function lt(t) {
  let e = ct(t);
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
function ft(t) {
  return {
    ...lt(t),
    store: /* @__PURE__ */ n(async (r, o) => await B("storage/storeBlob", {
      requestId: t,
      version: x,
      blob: r,
      options: o
    }), "store"),
    get: /* @__PURE__ */ n(async (r) => await B("storage/getBlob", {
      requestId: t,
      version: x,
      storageId: r
    }), "get")
  };
}
var ir = l(() => {
  "use strict";
  N();
  I();
  M();
  n(ct, "setupStorageReader");
  n(lt, "setupStorageWriter");
  n(ft, "setupStorageActionWriter");
});

// node_modules/convex/dist/esm/server/impl/registration_impl.js
async function ar(t, e) {
  let o = w(JSON.parse(e)), s = {
    db: er(),
    auth: re(""),
    storage: lt(""),
    scheduler: rr(),
    runQuery: /* @__PURE__ */ n((a, c) => pt("query", a, c), "runQuery"),
    runMutation: /* @__PURE__ */ n((a, c) => pt("mutation", a, c), "runMutation")
  }, i = await Oe(t, s, o);
  return ur(i), JSON.stringify(m(i === void 0 ? null : i));
}
function ur(t) {
  if (t instanceof Q || t instanceof U)
    throw new Error(
      "Return value is a Query. Results must be retrieved with `.collect()`, `.take(n), `.unique()`, or `.first()`."
    );
}
async function Oe(t, e, r) {
  let o;
  try {
    o = await Promise.resolve(t(e, ...r));
  } catch (s) {
    throw vn(s);
  }
  return o;
}
function J(t, e) {
  return (r, o) => (globalThis.console.warn(
    `Convex functions should not directly call other Convex functions. Consider calling a helper function instead. e.g. \`export const foo = ${t}(...); await foo(ctx);\` is not supported. See https://docs.convex.dev/production/best-practices/#use-helper-functions-to-write-shared-code`
  ), e(r, o));
}
function vn(t) {
  if (typeof t == "object" && t !== null && Symbol.for("ConvexError") in t) {
    let e = t;
    return e.data = JSON.stringify(
      m(e.data === void 0 ? null : e.data)
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
function cr(t, e) {
  if (e === void 0)
    throw new Error(
      `A validator is undefined for field "${t}". This is often caused by circular imports. See https://docs.convex.dev/error#undefined-validator for details.`
    );
  return e;
}
function H(t) {
  return () => {
    let e = u.any();
    return typeof t == "object" && t.args !== void 0 && (e = me(t.args)), JSON.stringify(e.json, cr);
  };
}
function G(t) {
  return () => {
    let e;
    return typeof t == "object" && t.returns !== void 0 && (e = me(t.returns)), JSON.stringify(e ? e.json : null, cr);
  };
}
async function lr(t, e) {
  let o = w(JSON.parse(e)), s = {
    db: at(),
    auth: re(""),
    storage: ct(""),
    runQuery: /* @__PURE__ */ n((a, c) => pt("query", a, c), "runQuery")
  }, i = await Oe(t, s, o);
  return ur(i), JSON.stringify(m(i === void 0 ? null : i));
}
async function fr(t, e, r) {
  let o = w(JSON.parse(r)), i = {
    ...ze(e),
    auth: re(e),
    scheduler: ut(e),
    storage: ft(e),
    vectorSearch: Ke(e)
  }, a = await Oe(t, i, o);
  return JSON.stringify(m(a === void 0 ? null : a));
}
async function _n(t, e) {
  let s = {
    ...ze(""),
    auth: re(""),
    storage: ft(""),
    scheduler: ut(""),
    vectorSearch: Ke("")
  };
  return await Oe(t, s, [e]);
}
async function pt(t, e, r) {
  let o = _(r), s = {
    udfType: t,
    args: m(o),
    ...v(e)
  }, i = await f("1.0/runUdf", s);
  return w(i);
}
var An, En, In, Sn, On, Tn, Cn, pr = l(() => {
  "use strict";
  $();
  Bt();
  Jt();
  Vt();
  tr();
  tt();
  sr();
  ir();
  L();
  I();
  ee();
  q();
  n(ar, "invokeMutation");
  n(ur, "validateReturnValue");
  n(Oe, "invokeFunction");
  n(J, "dontCallDirectly");
  n(vn, "serializeConvexErrorData");
  n(V, "assertNotBrowser");
  n(cr, "strictReplacer");
  n(H, "exportArgs");
  n(G, "exportReturns");
  An = /* @__PURE__ */ n(((t) => {
    let e = typeof t == "function" ? t : t.handler, r = J("mutation", e);
    return V(), r.isMutation = !0, r.isPublic = !0, r.invokeMutation = (o) => ar(e, o), r.exportArgs = H(t), r.exportReturns = G(t), r._handler = e, r;
  }), "mutationGeneric"), En = /* @__PURE__ */ n(((t) => {
    let e = typeof t == "function" ? t : t.handler, r = J(
      "internalMutation",
      e
    );
    return V(), r.isMutation = !0, r.isInternal = !0, r.invokeMutation = (o) => ar(e, o), r.exportArgs = H(t), r.exportReturns = G(t), r._handler = e, r;
  }), "internalMutationGeneric");
  n(lr, "invokeQuery");
  In = /* @__PURE__ */ n(((t) => {
    let e = typeof t == "function" ? t : t.handler, r = J("query", e);
    return V(), r.isQuery = !0, r.isPublic = !0, r.invokeQuery = (o) => lr(e, o), r.exportArgs = H(t), r.exportReturns = G(t), r._handler = e, r;
  }), "queryGeneric"), Sn = /* @__PURE__ */ n(((t) => {
    let e = typeof t == "function" ? t : t.handler, r = J("internalQuery", e);
    return V(), r.isQuery = !0, r.isInternal = !0, r.invokeQuery = (o) => lr(e, o), r.exportArgs = H(t), r.exportReturns = G(t), r._handler = e, r;
  }), "internalQueryGeneric");
  n(fr, "invokeAction");
  On = /* @__PURE__ */ n(((t) => {
    let e = typeof t == "function" ? t : t.handler, r = J("action", e);
    return V(), r.isAction = !0, r.isPublic = !0, r.invokeAction = (o, s) => fr(e, o, s), r.exportArgs = H(t), r.exportReturns = G(t), r._handler = e, r;
  }), "actionGeneric"), Tn = /* @__PURE__ */ n(((t) => {
    let e = typeof t == "function" ? t : t.handler, r = J("internalAction", e);
    return V(), r.isAction = !0, r.isInternal = !0, r.invokeAction = (o, s) => fr(e, o, s), r.exportArgs = H(t), r.exportReturns = G(t), r._handler = e, r;
  }), "internalActionGeneric");
  n(_n, "invokeHttpAction");
  Cn = /* @__PURE__ */ n((t) => {
    let e = J("httpAction", t);
    return V(), e.isHttp = !0, e.invokeHttpAction = (r) => _n(t, r), e._handler = t, e;
  }, "httpActionGeneric");
  n(pt, "runUdf");
});

// node_modules/convex/dist/esm/server/storage.js
var dr = l(() => {
  "use strict";
});

// node_modules/convex/dist/esm/server/components/index.js
async function $n(t) {
  let e = v(t);
  return await f("1.0/createFunctionHandle", {
    ...e,
    version: x
  });
}
function hr(t, e) {
  let r = {
    get(o, s) {
      if (typeof s == "string") {
        let i = [...e, s];
        return hr(t, i);
      } else if (s === Le) {
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
var Nn, Te = l(() => {
  "use strict";
  $();
  N();
  I();
  q();
  q();
  n($n, "createFunctionHandle");
  n(hr, "createChildComponents");
  Nn = /* @__PURE__ */ n(() => hr("components", []), "componentsGeneric");
});

// node_modules/convex/dist/esm/server/schema.js
function dt(t) {
  return Me(t) ? new _e(t) : new _e(u.object(t));
}
function mr(t, e) {
  return new ht(t, e);
}
var Pn, Fn, T, _e, ht, vi, yr = l(() => {
  "use strict";
  ee();
  Pn = Object.defineProperty, Fn = /* @__PURE__ */ n((t, e, r) => e in t ? Pn(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), T = /* @__PURE__ */ n((t, e, r) => Fn(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), _e = class {
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
  n(dt, "defineTable");
  ht = class {
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
            vectorIndexes: c,
            stagedVectorIndexes: h,
            documentType: C
          } = r.export();
          return {
            tableName: e,
            indexes: o,
            stagedDbIndexes: s,
            searchIndexes: i,
            stagedSearchIndexes: a,
            vectorIndexes: c,
            stagedVectorIndexes: h,
            documentType: C
          };
        }),
        schemaValidation: this.schemaValidation
      });
    }
  };
  n(mr, "defineSchema");
  vi = mr({
    _scheduled_functions: dt({
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
    _storage: dt({
      sha256: u.string(),
      size: u.float64(),
      contentType: u.optional(u.string())
    })
  });
});

// node_modules/convex/dist/esm/server/index.js
var Rn = l(() => {
  "use strict";
  qt();
  pr();
  Ct();
  Ze();
  dr();
  Pt();
  Rt();
  De();
  Te();
  Te();
  Te();
  yr();
});

export {
  m as a,
  me as b,
  u as c,
  ye as d,
  $ as e,
  v as f,
  An as g,
  En as h,
  In as i,
  Sn as j,
  On as k,
  Tn as l,
  Cn as m,
  fo as n,
  ke as o,
  Ur as p,
  Jr as q,
  Dr as r,
  Yr as s,
  $n as t,
  Nn as u,
  dt as v,
  mr as w,
  Rn as x
};
//# sourceMappingURL=4U34M3I6.js.map
