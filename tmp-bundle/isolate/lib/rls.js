import {
  a as _,
  b as S,
  e as C
} from "../_deps/HHELKCCM.js";
import {
  a as q
} from "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a as g,
  c as x
} from "../_deps/K33OSGN4.js";
import {
  x as Q
} from "../_deps/4U34M3I6.js";
import {
  a as s
} from "../_deps/RUVYHBJQ.js";

// node_modules/convex-helpers/server/customFunctions.js
function m(a) {
  return {
    args: {},
    input: /* @__PURE__ */ s(async (t, e, i) => ({
      ctx: await a(t, i),
      args: {}
    }), "input")
  };
}
s(m, "customCtx");
var k = {
  args: {},
  input() {
    return { args: {}, ctx: {} };
  }
};
function M(a, t) {
  return z(a, t);
}
s(M, "customQuery");
function A(a, t) {
  return z(a, t);
}
s(A, "customMutation");
function z(a, t) {
  let e = t.input ?? k.input, i = t.args ?? k.args;
  return /* @__PURE__ */ s(function(r) {
    let { args: u, handler: o = r, returns: N, ...I } = r;
    if (u)
      return a({
        args: C(u, i),
        returns: N,
        handler: /* @__PURE__ */ s(async (d, f) => {
          let c = await e(d, _(f, Object.keys(i)), I), l = S(f, Object.keys(i)), h = { ...d, ...c.ctx }, y = { ...l, ...c.args }, j = await o(h, y);
          return c.onSuccess && await c.onSuccess({ ctx: d, args: l, result: j }), j;
        }, "handler")
      });
    if (Object.keys(i).length > 0)
      throw new Error("If you're using a custom function with arguments for the input customization, you must declare the arguments for the function too.");
    return a({
      returns: r.returns,
      handler: /* @__PURE__ */ s(async (d, f) => {
        let c = await e(d, f, I), l = { ...d, ...c.ctx }, h = { ...f, ...c.args }, y = await o(l, h);
        return c.onSuccess && await c.onSuccess({ ctx: d, args: f, result: y }), y;
      }, "handler")
    });
  }, "customBuilder");
}
s(z, "customFnBuilder");

// node_modules/convex-helpers/server/filter.js
Q();
async function R(a, t) {
  let e = await Promise.all(a.map(t));
  return a.filter((i, n) => e[n]);
}
s(R, "asyncFilter");
var w = class a {
  static {
    s(this, "QueryWithFilter");
  }
  // q actually is only guaranteed to implement OrderedQuery<T>,
  // but we forward all QueryInitializer methods to it and if they fail they fail.
  q;
  p;
  iterator;
  constructor(t, e) {
    this.q = t, this.p = e;
  }
  filter(t) {
    return new a(this.q.filter(t), this.p);
  }
  order(t) {
    return new a(this.q.order(t), this.p);
  }
  async paginate(t) {
    let e = await this.q.paginate(t);
    return { ...e, page: await R(e.page, this.p) };
  }
  async collect() {
    let t = await this.q.collect();
    return await R(t, this.p);
  }
  async take(t) {
    let e = [];
    for await (let i of this)
      if (e.push(i), e.length >= t)
        break;
    return e;
  }
  async first() {
    for await (let t of this)
      return t;
    return null;
  }
  async unique() {
    let t = null;
    for await (let e of this)
      if (t === null)
        t = e;
      else
        throw new Error(`unique() query returned more than one result:
  [${t._id}, ${e._id}, ...]`);
    return t;
  }
  [Symbol.asyncIterator]() {
    return this.iterator = this.q[Symbol.asyncIterator](), this;
  }
  async next() {
    for (; ; ) {
      let { value: t, done: e } = await this.iterator.next();
      if (t && await this.p(t))
        return { value: t, done: e };
      if (e)
        return { value: null, done: !0 };
    }
  }
  return() {
    return this.iterator.return();
  }
  // Implement the remainder of QueryInitializer.
  fullTableScan() {
    return new a(this.q.fullTableScan(), this.p);
  }
  withIndex(t, e) {
    return new a(this.q.withIndex(t, e), this.p);
  }
  withSearchIndex(t, e) {
    return new a(this.q.withSearchIndex(t, e), this.p);
  }
};
function P(a, t) {
  return new w(a, t);
}
s(P, "filter");

// node_modules/convex-helpers/server/rowLevelSecurity.js
function D(a, t, e, i) {
  return new p(a, t, e, i);
}
s(D, "wrapDatabaseReader");
function L(a, t, e, i) {
  return new b(a, t, e, i);
}
s(L, "wrapDatabaseWriter");
var p = class {
  static {
    s(this, "WrapReader");
  }
  ctx;
  db;
  system;
  rules;
  config;
  constructor(t, e, i, n) {
    this.ctx = t, this.db = e, this.system = e.system, this.rules = i, this.config = n ?? { defaultPolicy: "allow" };
  }
  normalizeId(t, e) {
    return this.db.normalizeId(t, e);
  }
  tableName(t) {
    for (let e of Object.keys(this.rules))
      if (this.db.normalizeId(e, t))
        return e;
    return null;
  }
  async predicate(t, e) {
    return this.rules[t]?.read ? await this.rules[t].read(this.ctx, e) : (this.config.defaultPolicy ?? "allow") === "allow";
  }
  async get(t, e) {
    let [i, n] = e !== void 0 ? [t, e] : [this.tableName(t), t], r = await this.db.get(n);
    return r ? i && !await this.predicate(i, r) ? null : r : null;
  }
  query(t) {
    return P(this.db.query(t), (e) => this.predicate(t, e));
  }
}, b = class {
  static {
    s(this, "WrapWriter");
  }
  ctx;
  db;
  system;
  reader;
  rules;
  config;
  async modifyPredicate(t, e) {
    return this.rules[t]?.modify ? await this.rules[t].modify(this.ctx, e) : (this.config.defaultPolicy ?? "allow") === "allow";
  }
  constructor(t, e, i, n) {
    this.ctx = t, this.db = e, this.system = e.system, this.reader = new p(t, e, i, n), this.rules = i, this.config = n ?? { defaultPolicy: "allow" };
  }
  normalizeId(t, e) {
    return this.db.normalizeId(t, e);
  }
  async insert(t, e) {
    let i = this.rules[t];
    if (i?.insert) {
      if (!await i.insert(this.ctx, e))
        throw new Error("insert access not allowed");
    } else if ((this.config.defaultPolicy ?? "allow") === "deny")
      throw new Error("insert access not allowed");
    return await this.db.insert(t, e);
  }
  tableName(t) {
    for (let e of Object.keys(this.rules))
      if (this.db.normalizeId(e, t))
        return e;
    return null;
  }
  async checkAuth(t, e) {
    let i = t ? await this.get(t, e) : await this.get(e);
    if (i === null)
      throw new Error("no read access or doc does not exist");
    let n = t ?? this.tableName(e);
    if (n !== null && !await this.modifyPredicate(n, i))
      throw new Error("write access not allowed");
  }
  async patch(t, e, i) {
    let [n, r, u] = i !== void 0 ? [t, e, i] : [null, t, e];
    return await this.checkAuth(n, r), n ? this.db.patch(n, r, u) : this.db.patch(r, u);
  }
  async replace(t, e, i) {
    let [n, r, u] = i !== void 0 ? [t, e, i] : [null, t, e];
    return await this.checkAuth(n, r), n ? this.db.replace(n, r, u) : this.db.replace(r, u);
  }
  async delete(t, e) {
    let [i, n] = e !== void 0 ? [t, e] : [null, t];
    return await this.checkAuth(i, n), i ? this.db.delete(i, n) : this.db.delete(n);
  }
  get(t, e) {
    return this.reader.get(t, e);
  }
  query(t) {
    return this.reader.query(t);
  }
};

// convex/lib/rls.ts
async function v(a) {
  let t = await q.getUserId(a);
  if (!t) return { userId: null, user: null, isAdmin: !1, isSuperAdmin: !1 };
  let e = await a.db.get(t), i = e?.role === "admin" || e?.role === "super_admin", n = e?.role === "super_admin";
  return { userId: t, user: e, isAdmin: i, isSuperAdmin: n };
}
s(v, "getUserContext");
async function E(a) {
  let { userId: t, isAdmin: e, isSuperAdmin: i } = await v(a);
  return {
    // Users: can only read/modify self, admins can read all
    users: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : r._id === t, "read"),
      modify: /* @__PURE__ */ s(async (n, r) => i ? !0 : r._id === t, "modify")
    },
    // Projects: owner or admin
    projects: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? r.userId === t : !1, "read"),
      modify: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? r.userId === t : !1, "modify")
    },
    // Keywords: project-scoped
    keywords: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "read"),
      modify: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "modify")
    },
    // Keyword clusters: project-scoped
    keywordClusters: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "read"),
      modify: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "modify")
    },
    // Competitors: project-scoped
    competitors: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "read"),
      modify: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "modify")
    },
    // API Keys: user-scoped
    apiKeys: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : r.userId === t, "read"),
      modify: /* @__PURE__ */ s(async (n, r) => i ? !0 : r.userId === t, "modify")
    },
    // Subscriptions: user-scoped
    subscriptions: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : r.userId === t, "read"),
      modify: /* @__PURE__ */ s(async (n, r) => i ? !0 : r.userId === t, "modify")
    },
    // Quarterly plans: project-scoped
    quarterlyPlans: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "read"),
      modify: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "modify")
    },
    // Prospects: admin only (sales data)
    prospects: {
      read: /* @__PURE__ */ s(async () => e, "read"),
      modify: /* @__PURE__ */ s(async () => e, "modify")
    },
    // Prospect details: admin only
    prospectDetails: {
      read: /* @__PURE__ */ s(async () => e, "read"),
      modify: /* @__PURE__ */ s(async () => e, "modify")
    },
    // Content calendars: project-scoped (projectId is optional)
    contentCalendars: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : !t || !r.projectId ? !1 : (await n.db.get(r.projectId))?.userId === t, "read"),
      modify: /* @__PURE__ */ s(async (n, r) => e ? !0 : !t || !r.projectId ? !1 : (await n.db.get(r.projectId))?.userId === t, "modify")
    },
    // Content templates: readable by all authenticated, modifiable by super_admin only
    contentTemplates: {
      read: /* @__PURE__ */ s(async () => !!t, "read"),
      // Any authenticated user can read templates
      modify: /* @__PURE__ */ s(async () => i, "modify")
      // Only super_admin can modify
    },
    // Organizations: member-scoped
    organizations: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? !!await n.db.query("teamMembers").withIndex("by_user_org", (o) => o.eq("userId", t).eq("organizationId", r._id)).first() : !1, "read"),
      modify: /* @__PURE__ */ s(async (n, r) => {
        if (i) return !0;
        if (!t) return !1;
        let u = await n.db.query("teamMembers").withIndex("by_user_org", (o) => o.eq("userId", t).eq("organizationId", r._id)).first();
        return u?.role === "owner" || u?.role === "admin";
      }, "modify")
    },
    // Team members: org-scoped
    teamMembers: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? !!await n.db.query("teamMembers").withIndex(
        "by_user_org",
        (o) => o.eq("userId", t).eq("organizationId", r.organizationId)
      ).first() : !1, "read"),
      modify: /* @__PURE__ */ s(async (n, r) => {
        if (i) return !0;
        if (!t) return !1;
        if (r.userId === t) return !0;
        let u = await n.db.query("teamMembers").withIndex(
          "by_user_org",
          (o) => o.eq("userId", t).eq("organizationId", r.organizationId)
        ).first();
        return u?.role === "owner" || u?.role === "admin";
      }, "modify")
    },
    // Analytics events: admin only
    analyticsEvents: {
      read: /* @__PURE__ */ s(async () => e, "read"),
      modify: /* @__PURE__ */ s(async () => e, "modify")
    },
    // AI generations (cost tracking): super_admin for read, admin for write
    aiGenerations: {
      read: /* @__PURE__ */ s(async () => i, "read"),
      // Only super_admin can see AI costs
      modify: /* @__PURE__ */ s(async () => e, "modify")
      // Admins can log generations
    },
    // API access requests: user-scoped read, admin modify
    apiAccessRequests: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : r.userId === t, "read"),
      modify: /* @__PURE__ */ s(async () => e, "modify")
      // Only admins can approve/reject
    },
    // Insights: project-scoped
    insights: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "read"),
      modify: /* @__PURE__ */ s(async () => e, "modify")
      // System-generated
    },
    // Scheduled posts: project-scoped
    scheduledPosts: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "read"),
      modify: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "modify")
    },
    // Platform connections: project-scoped
    platformConnections: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "read"),
      modify: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "modify")
    },
    // GA4 connections: project-scoped
    ga4Connections: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "read"),
      modify: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "modify")
    },
    // GSC connections: project-scoped
    gscConnections: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "read"),
      modify: /* @__PURE__ */ s(async (n, r) => e ? !0 : t ? (await n.db.get(r.projectId))?.userId === t : !1, "modify")
    },
    // OAuth tokens: super_admin only (sensitive)
    oauthTokens: {
      read: /* @__PURE__ */ s(async () => i, "read"),
      modify: /* @__PURE__ */ s(async () => i, "modify")
    },
    // Usage limits: user-scoped read, admin modify
    usageLimits: {
      read: /* @__PURE__ */ s(async (n, r) => e ? !0 : r.userId === t, "read"),
      modify: /* @__PURE__ */ s(async () => e, "modify")
    },
    // Personas: global table with isDefault flag - readable by all authenticated, modifiable by admin
    personas: {
      read: /* @__PURE__ */ s(async () => !!t, "read"),
      // Any authenticated user can read personas
      modify: /* @__PURE__ */ s(async () => e, "modify")
      // Only admins can modify personas
    }
  };
}
s(E, "rlsRules");
var nt = M(
  g,
  m(async (a) => ({
    db: D(a, a.db, await E(a))
  }))
), st = A(
  x,
  m(async (a) => ({
    db: L(a, a.db, await E(a))
  }))
);
export {
  v as getUserContext,
  st as mutationWithRLS,
  nt as queryWithRLS
};
//# sourceMappingURL=rls.js.map
