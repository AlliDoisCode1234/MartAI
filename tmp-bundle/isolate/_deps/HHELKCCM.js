import {
  b as m,
  c as i,
  e as x
} from "./4U34M3I6.js";
import {
  a as c
} from "./RUVYHBJQ.js";

// node_modules/convex-helpers/index.js
function j(t, e) {
  return Object.fromEntries(Object.entries(t).filter(([n]) => e.includes(n)));
}
c(j, "pick");
function g(t, e) {
  return Object.fromEntries(Object.entries(t).filter(([n]) => !e.includes(n)));
}
c(g, "omit");
var _ = Symbol();
function k(t, e) {
  if (!t)
    throw new Error(e);
}
c(k, "assert");

// node_modules/convex-helpers/validators.js
x();
var P = /* @__PURE__ */ c((...t) => i.union(...t.map(i.literal)), "literals");
var V = i.string(), S = i.float64(), T = i.float64(), q = i.boolean(), C = i.int64(), I = i.int64(), U = i.any(), A = i.null(), { id: N, object: R, array: B, bytes: z, literal: M, optional: G, union: H } = i, J = i.bytes();
function w(t, e) {
  let n = m(t);
  if (Object.keys(e).length === 0)
    return n;
  switch (n.kind) {
    case "object":
      return i.object(h(n.fields, e));
    case "union":
      return i.union(...n.members.map((r) => w(r, e)));
    default:
      throw new Error("Cannot add arguments to a validator that is not an object or union.");
  }
}
c(w, "addFieldsToValidator");
function h(t, e) {
  let n = { ...t };
  for (let [r, o] of Object.entries(e)) {
    let a = n[r];
    if (a) {
      if (a.kind !== o.kind)
        throw new Error(`Cannot intersect validators with different kinds: ${a.kind} and ${o.kind}`);
      a.isOptional !== o.isOptional && a.isOptional === "optional" && (n[r] = o);
    } else
      n[r] = o;
  }
  return n;
}
c(h, "intersectValidators");
var K = i.optional(i.any());
var d = class extends Error {
  static {
    c(this, "ValidationError");
  }
  expected;
  got;
  path;
  constructor(e, n, r) {
    let o = `Validator error${r ? ` for ${r}` : ""}: Expected \`${e}\`, got \`${n}\``;
    super(o), this.expected = e, this.got = n, this.path = r, this.name = "ValidationError";
  }
};
function l(t, e, n) {
  let r = !0, o = t.kind, a;
  if (e === void 0)
    t.isOptional !== "optional" && (r = !1);
  else
    switch (t.kind) {
      case "null": {
        e !== null && (r = !1);
        break;
      }
      case "float64": {
        typeof e != "number" && (o = "number", r = !1);
        break;
      }
      case "int64": {
        typeof e != "bigint" && (o = "bigint", r = !1);
        break;
      }
      case "boolean": {
        typeof e != "boolean" && (r = !1);
        break;
      }
      case "string": {
        typeof e != "string" && (r = !1);
        break;
      }
      case "bytes": {
        e instanceof ArrayBuffer || (r = !1);
        break;
      }
      case "any":
        break;
      case "literal": {
        e !== t.value && (r = !1, o = t.value, ["string", "number", "boolean", "bigint"].includes(typeof e) && (a = `"${e}"`));
        break;
      }
      case "id": {
        typeof e != "string" ? r = !1 : n?.db && (o = `Id<${t.tableName}>`, n.db.normalizeId(t.tableName, e) || (r = !1));
        break;
      }
      case "array": {
        if (!Array.isArray(e)) {
          r = !1;
          break;
        }
        for (let [s, u] of e.entries()) {
          let f = `${n?._pathPrefix ?? ""}[${s}]`;
          if (r = l(t.element, u, {
            ...n,
            _pathPrefix: f
          }), !r) {
            o = t.element.kind;
            break;
          }
        }
        break;
      }
      case "object": {
        if (typeof e != "object" || e === null) {
          r = !1;
          break;
        }
        let s = Object.getPrototypeOf(e);
        if (!(s === null || s === Object.prototype || // Objects generated from other contexts (e.g. across Node.js `vm` modules) will not satisfy the previous
        // conditions but are still simple objects.
        s?.constructor?.name === "Object")) {
          o = (s?.constructor?.name ?? typeof s) || "object", r = !1;
          break;
        }
        for (let [f, y] of Object.entries(t.fields))
          if (r = l(y, e[f], {
            ...n,
            _pathPrefix: b(n, f)
          }), !r)
            break;
        if (!n?.allowUnknownFields) {
          for (let f of Object.keys(e))
            if (t.fields[f] === void 0) {
              if (n?.throw)
                throw new d("nothing", typeof e[f], b(n, f));
              r = !1;
              break;
            }
        }
        break;
      }
      case "union": {
        r = !1;
        let s;
        for (let u of t.members)
          try {
            if (l(u, e, n)) {
              r = !0;
              break;
            }
          } catch (f) {
            s = f;
          }
        if (!r && s)
          throw s;
        break;
      }
      case "record": {
        if (typeof e != "object" || e === null) {
          r = !1;
          break;
        }
        for (let [s, u] of Object.entries(e)) {
          if (r = l(t.key, s, {
            ...n,
            _pathPrefix: b(n, s)
          }), !r) {
            o = t.key.kind;
            break;
          }
          if (r = l(t.value, u, {
            ...n,
            _pathPrefix: b(n, s)
          }), !r) {
            o = t.value.kind;
            break;
          }
        }
        break;
      }
    }
  if (!r && n?.throw)
    throw new d(o, a ?? (e === null ? "null" : typeof e), n?._pathPrefix);
  return r;
}
c(l, "validate");
function L(t, e) {
  return l(t, e, { allowUnknownFields: !0, throw: !0 }), p(t, e);
}
c(L, "parse");
function p(t, e) {
  if (t.isOptional === "optional" && e === void 0)
    return e;
  switch (k(e !== void 0), t.kind) {
    case "object": {
      let n = {};
      for (let [r, o] of Object.entries(e))
        t.fields[r] !== void 0 && o !== void 0 && (n[r] = p(t.fields[r], o));
      return n;
    }
    case "record": {
      let n = {};
      for (let [r, o] of Object.entries(e))
        n[r] = p(t.value, o);
      return n;
    }
    case "array":
      return e.map((n) => p(t.element, n));
    case "union": {
      for (let n of t.members)
        if (l(n, e, { allowUnknownFields: !1 }))
          return p(n, e);
      for (let n of t.members)
        if (l(n, e, { allowUnknownFields: !0 }))
          return p(n, e);
      throw new Error("No matching member in union");
    }
    default:
      return e;
  }
}
c(p, "stripUnknownFields");
function b(t, e) {
  return t?._pathPrefix ? `${t._pathPrefix}.${e}` : e;
}
c(b, "appendPath");

export {
  j as a,
  g as b,
  k as c,
  P as d,
  w as e,
  K as f,
  d as g,
  l as h,
  L as i
};
//# sourceMappingURL=HHELKCCM.js.map
