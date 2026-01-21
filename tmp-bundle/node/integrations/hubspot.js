"use node";
import {
  a as i,
  c as S,
  j as d,
  k as w,
  l as u,
  p as I
} from "../_deps/node/KFFAPE6U.js";
import {
  a as l
} from "../_deps/node/V7X2J7BI.js";

// convex/integrations/hubspot.ts
S();
I();
var P = "https://api.hubapi.com";
function f() {
  return !!process.env.HUBSPOT_API_KEY;
}
l(f, "isHubSpotEnabled");
async function b(o, r, e) {
  let s = process.env.HUBSPOT_API_KEY;
  if (!s)
    throw console.log("[HubSpot] Skipping API call - HUBSPOT_API_KEY not set"), new Error("HUBSPOT_API_KEY not configured");
  let t = await fetch(`${P}${o}`, {
    method: r,
    headers: {
      Authorization: `Bearer ${s}`,
      "Content-Type": "application/json"
    },
    body: e ? JSON.stringify(e) : void 0
  });
  if (!t.ok) {
    let n = await t.text();
    throw console.error(`[HubSpot] API error: ${t.status}`, n), new Error(`HubSpot API error: ${t.status} - ${n}`);
  }
  return t.json();
}
l(b, "hubspotRequest");
async function _(o, r) {
  try {
    let s = await b("/crm/v3/objects/contacts/search", "POST", {
      filterGroups: [
        {
          filters: [{ propertyName: "email", operator: "EQ", value: o }]
        }
      ]
    });
    if (s.results?.length > 0) {
      let t = s.results[0].id;
      return await b(`/crm/v3/objects/contacts/${t}`, "PATCH", { properties: r }), console.log(`[HubSpot] Updated contact: ${o} (ID: ${t})`), { id: t, isNew: !1 };
    }
  } catch {
  }
  let e = await b("/crm/v3/objects/contacts", "POST", {
    properties: { email: o, ...r }
  });
  return console.log(`[HubSpot] Created contact: ${o} (ID: ${e.id})`), { id: e.id, isNew: !0 };
}
l(_, "upsertContact");
var R = d({
  args: { userId: i.id("users") },
  handler: /* @__PURE__ */ l(async (o, r) => {
    if (!f())
      return console.log("[HubSpot] Skipping user sync - no API key configured"), { success: !1, reason: "no_api_key" };
    let e = await o.runQuery(u.users.getById, { userId: r.userId });
    if (!e || !e.email)
      return console.log(`[HubSpot] User ${r.userId} has no email, skipping`), { success: !1, reason: "no_email" };
    let s = await o.runQuery(u.projects.projects.getProjectsByUser, {
      userId: r.userId
    }), t = null, n = null, a = null;
    if (s.length > 0) {
      a = s[0].websiteUrl;
      try {
        let c = await o.runQuery(u.analytics.martaiRatingQueries.getLatestScore, {
          projectId: s[0]._id
        });
        c && (t = c.overall, t !== null && (t >= 80 ? n = "thriving" : t >= 65 ? n = "growing" : t >= 50 ? n = "building" : n = "needs_work"));
      } catch {
      }
    }
    let m = (e.name || "").split(" "), g = m[0] || "", h = m.slice(1).join(" ") || "", p = {
      firstname: g,
      lastname: h,
      // Custom MartAI properties
      martai_plan: e.membershipTier || "free",
      martai_onboarding_status: e.onboardingStatus || "not_started",
      martai_project_count: s.length,
      martai_signup_abandoned: !1
    };
    if (e.onboardingSteps) {
      let c = e.onboardingSteps;
      c.signupCompleted !== void 0 && (p.martai_signup_completed = c.signupCompleted), c.planSelected && (p.martai_selected_plan = c.planSelected), c.paymentCompleted !== void 0 && (p.martai_payment_completed = c.paymentCompleted), c.projectCreated !== void 0 && (p.martai_project_created = c.projectCreated), c.ga4Connected !== void 0 && (p.martai_ga4_connected = c.ga4Connected), c.gscConnected !== void 0 && (p.martai_gsc_connected = c.gscConnected);
    }
    t !== null && (p.martai_mr_score = t), n && (p.martai_mr_tier = n), a && (p.martai_website = a), e.lastActiveAt && (p.martai_last_activity = e.lastActiveAt);
    let y = await _(e.email, p);
    return {
      success: !0,
      hubspotId: y.id,
      isNew: y.isNew
    };
  }, "handler")
}), C = d({
  args: { prospectId: i.id("prospects") },
  handler: /* @__PURE__ */ l(async (o, r) => {
    if (!f())
      return console.log("[HubSpot] Skipping prospect sync - no API key configured"), { success: !1, reason: "no_api_key" };
    let e = await o.runQuery(u.prospects.prospects.getProspect, {
      prospectId: r.prospectId
    });
    if (!e?.prospect?.email)
      return console.log(`[HubSpot] Prospect ${r.prospectId} has no email, skipping`), { success: !1, reason: "no_email" };
    let s = e.prospect, t = {
      firstname: s.firstName || "",
      lastname: s.lastName || "",
      phone: s.phone || "",
      company: s.companyName || "",
      martai_lead_source: s.source || "website",
      martai_prospect_status: s.status || "draft"
    };
    s.monthlyRevenue && (t.martai_monthly_revenue = s.monthlyRevenue), s.timeline && (t.martai_timeline = s.timeline), s.marketingFrustration && (t.martai_marketing_frustration = s.marketingFrustration);
    let n = await _(s.email, t);
    return {
      success: !0,
      hubspotId: n.id,
      isNew: n.isNew
    };
  }, "handler")
}), T = d({
  args: {
    email: i.string(),
    abandonedAtStep: i.string(),
    // 'signup' | 'plan' | 'payment' | 'onboarding'
    firstName: i.optional(i.string())
  },
  handler: /* @__PURE__ */ l(async (o, r) => {
    let e = {
      martai_signup_abandoned: !0,
      martai_abandoned_at_step: r.abandonedAtStep
    };
    r.firstName && (e.firstname = r.firstName);
    let s = await _(r.email, e);
    return {
      success: !0,
      hubspotId: s.id,
      isNew: s.isNew
    };
  }, "handler")
}), v = d({
  args: { requestId: i.id("apiAccessRequests") },
  handler: /* @__PURE__ */ l(async (o, r) => {
    if (!f())
      return console.log("[HubSpot] Skipping API access request sync - no API key configured"), { success: !1, reason: "no_api_key" };
    let e = await o.runQuery(u.apiAccessRequests.getRequest, {
      requestId: r.requestId
    });
    if (!e?.email)
      return console.log(`[HubSpot] API access request ${r.requestId} has no email, skipping`), { success: !1, reason: "no_email" };
    let s = {
      bi_integration: "BI Integration",
      automation: "Automation",
      custom_reports: "Custom Reports",
      other: "Other"
    }, t = {
      under_100: "Under 100 calls/mo",
      "100_1000": "100-1,000 calls/mo",
      "1000_10000": "1,000-10,000 calls/mo",
      over_10000: "Over 10,000 calls/mo"
    }, n = {
      company: e.companyName,
      martai_api_access_requested: !0,
      martai_api_use_case: s[e.useCase] || e.useCase,
      martai_api_volume: t[e.expectedMonthlyVolume] || e.expectedMonthlyVolume,
      martai_api_request_status: e.status,
      martai_lead_source: "api_access_form"
    };
    if (e.contactName) {
      let m = e.contactName.split(" ");
      n.firstname = m[0] || "", n.lastname = m.slice(1).join(" ") || "";
    }
    e.useCaseDetails && (n.martai_api_use_case_details = e.useCaseDetails);
    let a = await _(e.email, n);
    return await o.runMutation(u.apiAccessRequests.updateHubspotSync, {
      requestId: r.requestId,
      hubspotContactId: a.id
    }), {
      success: !0,
      hubspotId: a.id,
      isNew: a.isNew
    };
  }, "handler")
}), j = w({
  args: { userId: i.id("users") },
  handler: /* @__PURE__ */ l(async (o, r) => {
    if (!f())
      return console.log("[HubSpot] Skipping MR score update - no API key configured"), { success: !1, reason: "no_api_key" };
    let e = await o.runQuery(u.users.getById, { userId: r.userId });
    if (!e?.email)
      return { success: !1, reason: "no_email" };
    let s = await o.runQuery(u.projects.projects.getProjectsByUser, {
      userId: r.userId
    });
    if (s.length === 0)
      return { success: !1, reason: "no_projects" };
    let t = null, n = null;
    try {
      let g = await o.runQuery(u.analytics.martaiRatingQueries.getLatestScore, {
        projectId: s[0]._id
      });
      g && (t = g.overall, t !== null && (t >= 80 ? n = "thriving" : t >= 65 ? n = "growing" : t >= 50 ? n = "building" : n = "needs_work"));
    } catch {
      return { success: !1, reason: "no_mr_score" };
    }
    if (t === null)
      return { success: !1, reason: "no_mr_score" };
    let a = t < 50 || n === "needs_work", m = {
      martai_mr_score: t,
      martai_churn_risk: a
    };
    return n && (m.martai_mr_tier = n), e.lastActiveAt && (m.martai_last_activity = e.lastActiveAt), await _(e.email, m), { success: !0, mrScore: t, mrTier: n, churnRisk: a };
  }, "handler")
}), q = d({
  args: {},
  handler: /* @__PURE__ */ l(async (o) => {
    let r = await o.runQuery(u.users.listAll, {}), e = 0, s = 0, t = 0;
    for (let n of r) {
      try {
        (await o.runAction(u.integrations.hubspot.syncUserToHubspot, {
          userId: n._id
        })).success ? e++ : s++;
      } catch (a) {
        console.error(`[HubSpot] Failed to sync user ${n._id}:`, a), t++;
      }
      await new Promise((a) => setTimeout(a, 100));
    }
    return { synced: e, skipped: s, errors: t, total: r.length };
  }, "handler")
}), $ = d({
  args: {},
  handler: /* @__PURE__ */ l(async (o) => {
    let r = await o.runQuery(u.prospects.prospects.listProspects, {}), e = 0, s = 0, t = 0;
    for (let n of r) {
      try {
        (await o.runAction(u.integrations.hubspot.syncProspectToHubspot, {
          prospectId: n.prospect._id
        })).success ? e++ : s++;
      } catch (a) {
        console.error(`[HubSpot] Failed to sync prospect ${n.prospect._id}:`, a), t++;
      }
      await new Promise((a) => setTimeout(a, 100));
    }
    return { synced: e, skipped: s, errors: t, total: r.length };
  }, "handler")
}), U = d({
  args: {
    email: i.string(),
    source: i.optional(i.string()),
    utmSource: i.optional(i.string()),
    utmMedium: i.optional(i.string()),
    utmCampaign: i.optional(i.string())
  },
  handler: /* @__PURE__ */ l(async (o, r) => {
    if (!f())
      return console.log("[HubSpot] Skipping waitlist sync - no API key configured"), { success: !1, reason: "no_api_key" };
    let { mapWaitlistToHubSpot: e } = await import("../_deps/node/C5I6QE7N.js"), s = e({
      email: r.email,
      source: r.source,
      utmSource: r.utmSource,
      utmMedium: r.utmMedium,
      utmCampaign: r.utmCampaign
    });
    try {
      let t = await _(r.email, s);
      return console.log(`[HubSpot] Synced waitlist signup: ${r.email}`), {
        success: !0,
        hubspotId: t.id,
        isNew: t.isNew
      };
    } catch (t) {
      return console.error("[HubSpot] Failed to sync waitlist:", t), { success: !1, reason: "api_error" };
    }
  }, "handler")
});
export {
  $ as bulkSyncProspects,
  q as bulkSyncUsers,
  T as markAbandonedSignup,
  v as syncApiAccessRequest,
  C as syncProspectToHubspot,
  R as syncUserToHubspot,
  U as syncWaitlistToHubspot,
  j as updateMRScore
};
//# sourceMappingURL=hubspot.js.map
