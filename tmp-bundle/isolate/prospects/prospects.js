import {
  a as y,
  e as q
} from "../_deps/GTU362KY.js";
import {
  a as m,
  c
} from "../_deps/K33OSGN4.js";
import {
  c as t,
  e as P
} from "../_deps/4U34M3I6.js";
import {
  a as p
} from "../_deps/RUVYHBJQ.js";

// convex/prospects/prospects.ts
P();
q();
var I = {
  firstName: t.optional(t.string()),
  lastName: t.optional(t.string()),
  email: t.optional(t.string()),
  phone: t.optional(t.string()),
  companyName: t.optional(t.string()),
  monthlyRevenue: t.optional(t.string()),
  marketingFrustration: t.optional(t.string()),
  investedBefore: t.optional(t.string()),
  timeline: t.optional(t.string()),
  source: t.optional(t.string()),
  userId: t.optional(t.id("users"))
}, g = {
  businessName: t.optional(t.string()),
  topPriority: t.optional(t.string()),
  marketingTried: t.optional(t.string()),
  goals: t.optional(t.string()),
  supportNeeds: t.optional(t.array(t.string())),
  idealOutcome: t.optional(t.string()),
  additionalNotes: t.optional(t.string()),
  hearAbout: t.optional(t.string()),
  sendSms: t.optional(t.string())
}, f = t.object({
  label: t.string(),
  value: t.string()
});
async function h(s, e) {
  let { prospectId: o, urls: n, markCompleted: a, ...r } = e;
  if (!await s.db.get(o))
    throw new Error("Prospect not found");
  let i = Date.now(), b = await s.db.query("prospectDetails").withIndex("by_prospect", (u) => u.eq("prospectId", o)).first();
  if (b) {
    let u = { updatedAt: i };
    for (let [d, w] of Object.entries(r))
      w !== void 0 && (u[d] = w);
    await s.db.patch(b._id, u);
  } else
    await s.db.insert("prospectDetails", {
      prospectId: o,
      ...r,
      createdAt: i,
      updatedAt: i
    });
  if (n !== void 0) {
    let u = await s.db.query("submittedUrls").withIndex("by_prospect", (d) => d.eq("prospectId", o)).collect();
    for (let d of u)
      await s.db.delete(d._id);
    for (let d of n)
      d.value && await s.db.insert("submittedUrls", {
        prospectId: o,
        label: d.label || "Link",
        url: d.value,
        createdAt: i
      });
  }
  return a ? await s.db.patch(o, {
    status: "details_submitted",
    updatedAt: i
  }) : await s.db.patch(o, {
    updatedAt: i
  }), { success: !0 };
}
p(h, "persistProspectDetails");
var _ = c({
  args: {
    ...I,
    status: t.optional(t.string())
  },
  handler: /* @__PURE__ */ p(async (s, e) => {
    let o = Date.now();
    return await s.db.insert("prospects", {
      firstName: e.firstName ?? "",
      lastName: e.lastName ?? "",
      email: e.email ?? "",
      phone: e.phone ?? "",
      companyName: e.companyName ?? "",
      monthlyRevenue: e.monthlyRevenue ?? "",
      marketingFrustration: e.marketingFrustration ?? "",
      investedBefore: e.investedBefore ?? "",
      timeline: e.timeline ?? "",
      source: e.source ?? "",
      status: e.status ?? "draft",
      userId: e.userId,
      createdAt: o,
      updatedAt: o
    });
  }, "handler")
}), D = c({
  args: {
    prospectId: t.id("prospects"),
    ...I,
    status: t.optional(t.string())
  },
  handler: /* @__PURE__ */ p(async (s, e) => {
    let { prospectId: o, ...n } = e;
    if (!await s.db.get(o))
      throw new Error("Prospect not found");
    let r = { updatedAt: Date.now() };
    for (let [l, i] of Object.entries(n))
      i !== void 0 && (r[l] = i);
    return await s.db.patch(o, r), { success: !0 };
  }, "handler")
}), U = c({
  args: {
    prospectId: t.id("prospects"),
    ...g,
    urls: t.optional(t.array(f)),
    markCompleted: t.optional(t.boolean())
  },
  handler: /* @__PURE__ */ p(async (s, e) => h(s, e), "handler")
}), k = c({
  args: {
    prospectId: t.id("prospects"),
    ...g,
    urls: t.optional(t.array(f))
  },
  handler: /* @__PURE__ */ p(async (s, e) => {
    await h(s, { ...e, markCompleted: !0 });
    let o = await s.db.get(e.prospectId), n = await s.db.query("prospectDetails").withIndex("by_prospect", (r) => r.eq("prospectId", e.prospectId)).first(), a = await s.db.query("submittedUrls").withIndex("by_prospect", (r) => r.eq("prospectId", e.prospectId)).collect();
    return {
      success: !0,
      prospect: o,
      detail: n,
      urls: a
    };
  }, "handler")
}), S = m({
  args: { prospectId: t.id("prospects") },
  handler: /* @__PURE__ */ p(async (s, e) => {
    let o = await s.db.get(e.prospectId);
    if (!o) return null;
    let n = await s.db.query("prospectDetails").withIndex("by_prospect", (r) => r.eq("prospectId", e.prospectId)).first(), a = await s.db.query("submittedUrls").withIndex("by_prospect", (r) => r.eq("prospectId", e.prospectId)).collect();
    return {
      prospect: o,
      detail: n,
      urls: a
    };
  }, "handler")
}), x = m({
  args: {
    status: t.optional(t.string()),
    limit: t.optional(t.number())
  },
  handler: /* @__PURE__ */ p(async (s, e) => {
    let o = e.status ? s.db.query("prospects").withIndex("by_status", (a) => a.eq("status", e.status)).order("desc") : s.db.query("prospects").order("desc"), n = await (e.limit ? o.take(e.limit) : o.collect());
    return Promise.all(
      n.map(async (a) => {
        let r = await s.db.query("prospectDetails").withIndex("by_prospect", (i) => i.eq("prospectId", a._id)).first(), l = await s.db.query("submittedUrls").withIndex("by_prospect", (i) => i.eq("prospectId", a._id)).collect();
        return { prospect: a, detail: r, urls: l };
      })
    );
  }, "handler")
}), E = c({
  args: {
    prospectId: t.id("prospects"),
    status: t.string(),
    assignedUserId: t.optional(t.id("users"))
  },
  handler: /* @__PURE__ */ p(async (s, e) => {
    let { prospectId: o, status: n, assignedUserId: a } = e, r = await s.db.get(o);
    if (!r)
      throw new Error("Prospect not found");
    return await s.db.patch(o, {
      status: n,
      userId: a ?? r.userId,
      updatedAt: Date.now()
    }), { success: !0 };
  }, "handler")
}), O = c({
  args: {
    email: t.string(),
    companyName: t.optional(t.string()),
    websiteUrl: t.string(),
    planSelected: t.optional(t.string()),
    source: t.optional(t.string())
  },
  handler: /* @__PURE__ */ p(async (s, e) => {
    let o = Date.now(), n = await s.db.query("prospects").withIndex("by_email", (r) => r.eq("email", e.email)).first();
    if (n)
      return await s.db.patch(n._id, {
        companyName: e.companyName ?? n.companyName,
        websiteUrl: e.websiteUrl,
        planSelected: e.planSelected ?? n.planSelected,
        updatedAt: o
      }), n._id;
    let a = await s.db.insert("prospects", {
      email: e.email,
      companyName: e.companyName ?? "",
      websiteUrl: e.websiteUrl,
      planSelected: e.planSelected,
      source: e.source ?? "onboarding",
      status: "initial_submitted",
      createdAt: o,
      updatedAt: o
    });
    return s.scheduler.runAfter(0, y.integrations.hubspot.syncProspectToHubspot, {
      prospectId: a
    }), a;
  }, "handler")
}), R = c({
  args: {
    prospectId: t.id("prospects"),
    companyName: t.optional(t.string()),
    websiteUrl: t.optional(t.string()),
    planSelected: t.optional(t.string())
  },
  handler: /* @__PURE__ */ p(async (s, e) => {
    let { prospectId: o, ...n } = e;
    if (!await s.db.get(o))
      throw new Error("Prospect not found");
    let r = { updatedAt: Date.now() };
    for (let [l, i] of Object.entries(n))
      i !== void 0 && (r[l] = i);
    return await s.db.patch(o, r), { success: !0 };
  }, "handler")
}), C = c({
  args: {
    prospectId: t.id("prospects"),
    userId: t.id("users")
  },
  handler: /* @__PURE__ */ p(async (s, e) => {
    let o = Date.now();
    if (!await s.db.get(e.prospectId))
      throw new Error("Prospect not found");
    if (!await s.db.get(e.userId))
      throw new Error("User not found");
    return await s.db.patch(e.prospectId, {
      status: "converted",
      convertedAt: o,
      convertedUserId: e.userId,
      userId: e.userId,
      updatedAt: o
    }), await s.db.patch(e.userId, {
      previousProspect: !0,
      prospectConvertedAt: o,
      prospectId: e.prospectId
    }), { success: !0, prospectId: e.prospectId, userId: e.userId };
  }, "handler")
}), F = m({
  args: { email: t.string() },
  handler: /* @__PURE__ */ p(async (s, e) => await s.db.query("prospects").withIndex("by_email", (o) => o.eq("email", e.email)).first(), "handler")
});
export {
  k as completeProspectIntake,
  C as convertProspectToUser,
  O as createOnboardingProspect,
  _ as createProspect,
  S as getProspect,
  F as getProspectByEmail,
  x as listProspects,
  U as saveProspectDetails,
  R as updateOnboardingProspect,
  D as updateProspect,
  E as updateProspectStatus
};
//# sourceMappingURL=prospects.js.map
