import {
  a as u,
  e as m
} from "./_deps/GTU362KY.js";
import {
  a as d
} from "./_deps/OFY2WAT7.js";
import "./_deps/ZRD5YQUR.js";
import {
  a as c,
  c as o
} from "./_deps/K33OSGN4.js";
import {
  c as t,
  e as l
} from "./_deps/4U34M3I6.js";
import {
  a as r
} from "./_deps/RUVYHBJQ.js";

// convex/apiAccessRequests.ts
l();
m();
var A = o({
  args: {
    email: t.string(),
    companyName: t.string(),
    contactName: t.optional(t.string()),
    useCase: t.string(),
    useCaseDetails: t.optional(t.string()),
    expectedMonthlyVolume: t.string()
  },
  handler: /* @__PURE__ */ r(async (s, e) => {
    let n = Date.now(), a = await s.db.query("apiAccessRequests").withIndex("by_email", (p) => p.eq("email", e.email)).first();
    if (a)
      return await s.db.patch(a._id, {
        companyName: e.companyName,
        contactName: e.contactName,
        useCase: e.useCase,
        useCaseDetails: e.useCaseDetails,
        expectedMonthlyVolume: e.expectedMonthlyVolume,
        updatedAt: n
      }), s.scheduler.runAfter(0, u.integrations.hubspot.syncApiAccessRequest, {
        requestId: a._id
      }), { requestId: a._id, isNew: !1 };
    let i = await s.db.insert("apiAccessRequests", {
      email: e.email,
      companyName: e.companyName,
      contactName: e.contactName,
      useCase: e.useCase,
      useCaseDetails: e.useCaseDetails,
      expectedMonthlyVolume: e.expectedMonthlyVolume,
      status: "pending",
      createdAt: n,
      updatedAt: n
    });
    return s.scheduler.runAfter(0, u.integrations.hubspot.syncApiAccessRequest, {
      requestId: i
    }), { requestId: i, isNew: !0 };
  }, "handler")
}), I = c({
  args: {
    status: t.optional(
      t.union(
        t.literal("pending"),
        t.literal("approved"),
        t.literal("rejected"),
        t.literal("contacted")
      )
    ),
    limit: t.optional(t.number())
  },
  handler: /* @__PURE__ */ r(async (s, e) => e.status ? await s.db.query("apiAccessRequests").withIndex("by_status", (i) => i.eq("status", e.status)).order("desc").take(e.limit ?? 50) : await s.db.query("apiAccessRequests").order("desc").take(e.limit ?? 50), "handler")
}), b = c({
  args: { requestId: t.id("apiAccessRequests") },
  handler: /* @__PURE__ */ r(async (s, e) => await s.db.get(e.requestId), "handler")
}), N = o({
  args: {
    requestId: t.id("apiAccessRequests"),
    adminNotes: t.optional(t.string())
  },
  handler: /* @__PURE__ */ r(async (s, e) => {
    let n = await d.getUserId(s);
    if (!n) throw new Error("Unauthorized");
    let a = await s.db.get(e.requestId);
    if (!a) throw new Error("Request not found");
    if (a.status === "approved")
      return { success: !1, reason: "already_approved" };
    let i = Date.now();
    return await s.db.patch(e.requestId, {
      status: "approved",
      adminNotes: e.adminNotes,
      reviewedBy: n,
      reviewedAt: i,
      updatedAt: i
    }), s.scheduler.runAfter(0, u.integrations.hubspot.syncApiAccessRequest, {
      requestId: e.requestId
    }), { success: !0 };
  }, "handler")
}), f = o({
  args: {
    requestId: t.id("apiAccessRequests"),
    adminNotes: t.optional(t.string())
  },
  handler: /* @__PURE__ */ r(async (s, e) => {
    let n = await d.getUserId(s);
    if (!n) throw new Error("Unauthorized");
    let a = Date.now();
    return await s.db.patch(e.requestId, {
      status: "rejected",
      adminNotes: e.adminNotes,
      reviewedBy: n,
      reviewedAt: a,
      updatedAt: a
    }), s.scheduler.runAfter(0, u.integrations.hubspot.syncApiAccessRequest, {
      requestId: e.requestId
    }), { success: !0 };
  }, "handler")
}), R = o({
  args: {
    requestId: t.id("apiAccessRequests"),
    adminNotes: t.optional(t.string())
  },
  handler: /* @__PURE__ */ r(async (s, e) => {
    let n = await d.getUserId(s);
    if (!n) throw new Error("Unauthorized");
    let a = Date.now();
    return await s.db.patch(e.requestId, {
      status: "contacted",
      adminNotes: e.adminNotes,
      reviewedBy: n,
      reviewedAt: a,
      updatedAt: a
    }), { success: !0 };
  }, "handler")
}), C = o({
  args: {
    requestId: t.id("apiAccessRequests"),
    hubspotContactId: t.string()
  },
  handler: /* @__PURE__ */ r(async (s, e) => (await s.db.patch(e.requestId, {
    hubspotContactId: e.hubspotContactId,
    hubspotSyncedAt: Date.now()
  }), { success: !0 }), "handler")
});
export {
  N as approveRequest,
  b as getRequest,
  I as listRequests,
  R as markContacted,
  f as rejectRequest,
  A as submitRequest,
  C as updateHubspotSync
};
//# sourceMappingURL=apiAccessRequests.js.map
