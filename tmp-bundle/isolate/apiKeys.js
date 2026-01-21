import {
  a as I,
  c as m
} from "./_deps/K33OSGN4.js";
import {
  c as n,
  e as f
} from "./_deps/4U34M3I6.js";
import {
  a as c
} from "./_deps/RUVYHBJQ.js";

// convex/apiKeys.ts
f();
function A() {
  let e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t = "mart_";
  for (let i = 0; i < 32; i++)
    t += e.charAt(Math.floor(Math.random() * e.length));
  return t;
}
c(A, "generateApiKey");
function g(e) {
  let t = /* @__PURE__ */ c((h, u) => {
    let a = u;
    for (let y = 0; y < h.length; y++)
      a = (a << 5) - a + h.charCodeAt(y) | 0;
    return Math.abs(a);
  }, "hash32"), i = t(e, 5381).toString(16).padStart(8, "0"), s = t(e, 33).toString(16).padStart(8, "0"), o = t(e.split("").reverse().join(""), 5381).toString(16).padStart(8, "0"), r = t(e.split("").reverse().join(""), 33).toString(16).padStart(8, "0"), d = t(e + e, 7919).toString(16).padStart(8, "0"), w = t(e, 65599).toString(16).padStart(8, "0"), l = t(e.slice(0, Math.floor(e.length / 2)), 5381).toString(16).padStart(8, "0"), p = t(e.slice(Math.floor(e.length / 2)), 5381).toString(16).padStart(8, "0");
  return i + s + o + r + d + w + l + p;
}
c(g, "hashKey");
var j = m({
  args: {
    projectId: n.id("projects"),
    name: n.string(),
    description: n.optional(n.string()),
    permissions: n.array(n.union(n.literal("read"), n.literal("write"), n.literal("admin"))),
    expiresInDays: n.optional(n.number())
  },
  handler: /* @__PURE__ */ c(async (e, t) => {
    let i = await e.auth.getUserIdentity();
    if (!i)
      throw new Error("Unauthorized");
    let s = await e.db.query("users").withIndex("email", (a) => a.eq("email", i.email)).first();
    if (!s)
      throw new Error("User not found");
    let o = await e.db.get(t.projectId);
    if (!o || o.userId !== s._id)
      throw new Error("Access denied to project");
    let r = await e.db.query("subscriptions").withIndex("by_user", (a) => a.eq("userId", s._id)).first();
    if (!r || !["enterprise", "team"].includes(r.planTier))
      throw new Error("API keys require Team or Enterprise plan");
    let d = A(), w = g(d), l = d.substring(0, 12), p = Date.now(), h = t.expiresInDays ? p + t.expiresInDays * 24 * 60 * 60 * 1e3 : void 0;
    return { keyId: await e.db.insert("apiKeys", {
      userId: s._id,
      projectId: t.projectId,
      keyHash: w,
      keyPrefix: l,
      name: t.name,
      description: t.description,
      permissions: t.permissions,
      isActive: !0,
      usageCount: 0,
      expiresAt: h,
      createdAt: p
    }), apiKey: d };
  }, "handler")
}), S = I({
  args: {
    projectId: n.id("projects")
  },
  handler: /* @__PURE__ */ c(async (e, t) => {
    let i = await e.auth.getUserIdentity();
    if (!i)
      throw new Error("Unauthorized");
    let s = await e.db.query("users").withIndex("email", (r) => r.eq("email", i.email)).first();
    if (!s)
      throw new Error("User not found");
    return (await e.db.query("apiKeys").withIndex("by_project", (r) => r.eq("projectId", t.projectId)).filter((r) => r.eq(r.field("userId"), s._id)).collect()).map((r) => ({
      _id: r._id,
      _creationTime: r._creationTime,
      userId: r.userId,
      projectId: r.projectId,
      keyPrefix: r.keyPrefix,
      // Safe: just first 12 chars like "mart_xxxx"
      name: r.name,
      description: r.description,
      permissions: r.permissions,
      isActive: r.isActive,
      usageCount: r.usageCount,
      lastUsedAt: r.lastUsedAt,
      expiresAt: r.expiresAt,
      createdAt: r.createdAt,
      revokedAt: r.revokedAt
      // keyHash is INTENTIONALLY EXCLUDED - it's the auth secret
    }));
  }, "handler")
}), U = m({
  args: {
    keyId: n.id("apiKeys")
  },
  handler: /* @__PURE__ */ c(async (e, t) => {
    let i = await e.auth.getUserIdentity();
    if (!i)
      throw new Error("Unauthorized");
    let s = await e.db.query("users").withIndex("email", (r) => r.eq("email", i.email)).first();
    if (!s)
      throw new Error("User not found");
    let o = await e.db.get(t.keyId);
    if (!o || o.userId !== s._id)
      throw new Error("API key not found");
    return await e.db.patch(t.keyId, {
      isActive: !1,
      revokedAt: Date.now()
    }), { success: !0 };
  }, "handler")
}), q = I({
  args: {
    keyHash: n.string()
  },
  handler: /* @__PURE__ */ c(async (e, t) => {
    let i = await e.db.query("apiKeys").withIndex("by_key_hash", (s) => s.eq("keyHash", t.keyHash)).first();
    return !i || !i.isActive || i.expiresAt && i.expiresAt < Date.now() ? null : {
      keyId: i._id,
      userId: i.userId,
      projectId: i.projectId,
      permissions: i.permissions
    };
  }, "handler")
}), v = m({
  args: {
    keyId: n.id("apiKeys")
  },
  handler: /* @__PURE__ */ c(async (e, t) => {
    let i = await e.db.get(t.keyId);
    i && await e.db.patch(t.keyId, {
      lastUsedAt: Date.now(),
      usageCount: i.usageCount + 1
    });
  }, "handler")
}), x = m({
  args: {
    keyId: n.id("apiKeys"),
    endpoint: n.string()
    // e.g., 'keywords_read', 'keywords_write'
  },
  handler: /* @__PURE__ */ c(async (e, t) => {
    let i = await e.db.get(t.keyId);
    if (!i)
      return { allowed: !1, limit: 0, remaining: 0, resetAt: 0, retryAfter: 60 };
    let o = {
      keywords_read: 100,
      keywords_write: 50,
      clusters_read: 100,
      briefs_read: 100,
      analytics_read: 60
    }[t.endpoint] || 100, r = 60 * 1e3, d = Date.now(), w = d - r, l = !i.lastUsedAt || i.lastUsedAt < w, p = l ? 0 : i.usageCount, h = Math.max(0, o - p - 1), u = p < o, a = Math.floor((d + r) / 1e3);
    return u && await e.db.patch(t.keyId, {
      lastUsedAt: d,
      usageCount: l ? 1 : p + 1
    }), {
      allowed: u,
      limit: o,
      remaining: u ? h : 0,
      resetAt: a,
      retryAfter: u ? void 0 : Math.ceil((a * 1e3 - d) / 1e3)
    };
  }, "handler")
});
export {
  x as checkApiRateLimit,
  j as createApiKey,
  S as listApiKeys,
  v as recordApiKeyUsage,
  U as revokeApiKey,
  q as validateApiKey
};
//# sourceMappingURL=apiKeys.js.map
