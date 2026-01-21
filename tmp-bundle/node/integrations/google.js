"use node";
import {
  a as o,
  c as f,
  j as p,
  k as d,
  l,
  p as y
} from "../_deps/node/KFFAPE6U.js";
import {
  a as i
} from "../_deps/node/V7X2J7BI.js";

// convex/integrations/google.ts
f();
y();
var T = "https://accounts.google.com/o/oauth2/v2/auth", m = "https://oauth2.googleapis.com/token", k = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/analytics.edit",
  // Required for Admin API (list properties)
  "https://www.googleapis.com/auth/webmasters.readonly",
  "openid",
  "email",
  "profile"
].join(" "), S = p({
  // Accept projectId and returnTo to pass as state
  args: {
    projectId: o.optional(o.id("projects")),
    returnTo: o.optional(o.string())
    // Where to redirect after OAuth
  },
  handler: /* @__PURE__ */ i(async (a, e) => {
    let n = process.env.GOOGLE_CLIENT_ID, r = process.env.GOOGLE_REDIRECT_URI;
    if (!n || !r)
      throw new Error("Missing Google Client ID or Redirect URI in environment variables");
    let t = new URL(T);
    t.searchParams.append("client_id", n), t.searchParams.append("redirect_uri", r), t.searchParams.append("response_type", "code"), t.searchParams.append("scope", k), t.searchParams.append("access_type", "offline"), t.searchParams.append("prompt", "consent");
    let s = {};
    return e.projectId && (s.projectId = e.projectId), e.returnTo && (s.returnTo = e.returnTo), Object.keys(s).length > 0 && t.searchParams.append("state", Buffer.from(JSON.stringify(s)).toString("base64")), t.toString();
  }, "handler")
}), C = p({
  args: {
    code: o.string(),
    projectId: o.optional(o.id("projects"))
  },
  handler: /* @__PURE__ */ i(async (a, e) => {
    let n = process.env.GOOGLE_CLIENT_ID, r = process.env.GOOGLE_CLIENT_SECRET, t = process.env.GOOGLE_REDIRECT_URI;
    if (!n || !r || !t)
      throw new Error("Missing Google Creds");
    let s = await fetch(m, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: e.code,
        client_id: n,
        client_secret: r,
        redirect_uri: t,
        grant_type: "authorization_code"
      })
    });
    if (!s.ok) {
      let g = await s.text();
      throw new Error(`Google Token Exchange Failed: ${g}`);
    }
    let c = await s.json();
    return {
      accessToken: c.access_token,
      refreshToken: c.refresh_token,
      expiresIn: c.expires_in,
      tokenType: c.token_type
    };
  }, "handler")
}), O = p({
  args: { accessToken: o.string() },
  handler: /* @__PURE__ */ i(async (a, e) => {
    let n = await fetch("https://analyticsadmin.googleapis.com/v1beta/accountSummaries", {
      headers: { Authorization: `Bearer ${e.accessToken}` }
    });
    if (!n.ok) {
      let s = await n.text();
      throw new Error(`Failed to list GA4 properties: ${s}`);
    }
    let r = await n.json(), t = [];
    for (let s of r.accountSummaries || [])
      for (let c of s.propertySummaries || [])
        t.push({
          propertyId: c.property.replace("properties/", ""),
          displayName: c.displayName,
          accountName: s.displayName
        });
    return t;
  }, "handler")
}), L = p({
  args: { accessToken: o.string() },
  handler: /* @__PURE__ */ i(async (a, e) => {
    let n = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
      headers: { Authorization: `Bearer ${e.accessToken}` }
    });
    if (!n.ok) {
      let t = await n.text();
      throw new Error(`Failed to list GSC sites: ${t}`);
    }
    return (await n.json()).siteEntry?.map((t) => ({
      siteUrl: t.siteUrl,
      permissionLevel: t.permissionLevel
    })) || [];
  }, "handler")
});
async function u(a) {
  let e = process.env.GOOGLE_CLIENT_ID, n = process.env.GOOGLE_CLIENT_SECRET;
  if (!e || !n) throw new Error("Missing Google Creds");
  let r = await fetch(m, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: e,
      client_secret: n,
      refresh_token: a,
      grant_type: "refresh_token"
    })
  });
  if (!r.ok) throw new Error("Failed to refresh token");
  return await r.json();
}
i(u, "refreshAccessToken");
var x = d({
  args: {
    connectionId: o.id("ga4Connections"),
    projectId: o.id("projects"),
    propertyId: o.string(),
    accessToken: o.string(),
    refreshToken: o.optional(o.string()),
    startDate: o.string(),
    endDate: o.string()
  },
  handler: /* @__PURE__ */ i(async (a, e) => {
    let n = e.accessToken, r = await h(e.propertyId, n, e.startDate, e.endDate);
    if (r.status === 401 && e.refreshToken) {
      let t = await u(e.refreshToken);
      n = t.access_token, await a.runMutation(l.integrations.ga4Connections.updateTokens, {
        connectionId: e.connectionId,
        accessToken: n,
        refreshToken: t.refresh_token
      }), r = await h(e.propertyId, n, e.startDate, e.endDate);
    }
    if (!r.ok) {
      let t = await r.text();
      throw new Error(`GA4 API Error: ${t}`);
    }
    return await r.json();
  }, "handler")
});
async function h(a, e, n, r) {
  let t = `https://analyticsdata.googleapis.com/v1beta/properties/${a}:runReport`;
  return fetch(t, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${e}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      dateRanges: [{ startDate: n, endDate: r }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "userEngagementDuration" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
        { name: "newUsers" }
      ]
    })
  });
}
i(h, "runGA4Report");
var D = d({
  args: {
    connectionId: o.id("gscConnections"),
    siteUrl: o.string(),
    accessToken: o.string(),
    refreshToken: o.optional(o.string()),
    startDate: o.string(),
    endDate: o.string()
  },
  handler: /* @__PURE__ */ i(async (a, e) => {
    let n = e.accessToken, r = await w(e.siteUrl, n, e.startDate, e.endDate);
    if (r.status === 401 && e.refreshToken) {
      let t = await u(e.refreshToken);
      n = t.access_token, await a.runMutation(l.integrations.gscConnections.updateTokens, {
        connectionId: e.connectionId,
        accessToken: n,
        refreshToken: t.refresh_token
      }), r = await w(e.siteUrl, n, e.startDate, e.endDate);
    }
    if (!r.ok) {
      let t = await r.text();
      throw new Error(`GSC API Error: ${t}`);
    }
    return await r.json();
  }, "handler")
});
async function w(a, e, n, r) {
  let s = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(a)}/searchAnalytics/query`;
  return fetch(s, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${e}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      startDate: n,
      endDate: r,
      dimensions: ["query"],
      rowLimit: 100
    })
  });
}
i(w, "runGSCQuery");
export {
  C as exchangeCode,
  x as fetchGA4Metrics,
  D as fetchGSCMetrics,
  S as generateAuthUrl,
  O as listGA4Properties,
  L as listGSCSites
};
//# sourceMappingURL=google.js.map
