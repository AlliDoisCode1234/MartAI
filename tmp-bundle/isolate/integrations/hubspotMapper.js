import {
  a as o
} from "../_deps/RUVYHBJQ.js";

// convex/integrations/hubspotMapper.ts
var i = {
  // Acquisition & Source Tracking
  phoo_lead_source: {
    label: "Phoo Lead Source",
    description: "How the contact was acquired (waitlist_beta, organic, etc.)",
    type: "enumeration",
    options: ["waitlist_beta", "organic", "referral", "partner", "paid", "migration"]
  },
  phoo_acquisition_date: {
    label: "Phoo Acquisition Date",
    description: "When contact first entered the system",
    type: "date"
  },
  phoo_waitlist_signup: {
    label: "Phoo Waitlist Signup",
    description: "Whether contact signed up via phoo.ai beta waitlist",
    type: "booleancheckbox"
  },
  // Product Usage & Status
  phoo_onboarding_status: {
    label: "Phoo Onboarding Status",
    description: "Current onboarding state",
    type: "enumeration",
    options: ["not_started", "in_progress", "completed"]
  },
  phoo_plan: {
    label: "Phoo Plan",
    description: "Current subscription tier",
    type: "enumeration",
    options: ["free", "solo", "starter", "growth", "pro", "enterprise"]
  },
  phoo_subscription_status: {
    label: "Phoo Subscription Status",
    description: "Payment/billing status aligned with Stripe lifecycle",
    type: "enumeration",
    // Matches SubscriptionStatus type in subscriptionLifecycle.ts
    options: [
      "active",
      "trialing",
      "grace_period",
      "maintenance_mode",
      "past_due",
      "cancelled",
      "expired"
    ]
  },
  phoo_account_status: {
    label: "Phoo Account Status",
    description: "Account activity status",
    type: "enumeration",
    options: ["active", "inactive", "churned", "suspended"]
  },
  // Engagement Metrics
  phoo_project_count: {
    label: "Phoo Project Count",
    description: "Number of projects created",
    type: "number"
  },
  phoo_pr_score: {
    label: "Phoo Rating Score",
    description: "Overall health score (0-100) measuring SEO readiness",
    type: "number"
  },
  phoo_pr_tier: {
    label: "Phoo Rating Tier",
    description: "Health tier classification",
    type: "enumeration",
    options: ["needs_work", "building", "growing", "thriving"]
  },
  phoo_needs_attention: {
    label: "Needs Attention",
    description: "Account may need outreach or support",
    type: "booleancheckbox"
  },
  phoo_last_activity: {
    label: "Phoo Last Activity",
    description: "Timestamp of last product activity",
    type: "datetime"
  },
  // Integration Status
  phoo_ga4_connected: {
    label: "Phoo GA4 Connected",
    description: "Google Analytics 4 integration status",
    type: "booleancheckbox"
  },
  phoo_gsc_connected: {
    label: "Phoo GSC Connected",
    description: "Google Search Console integration status",
    type: "booleancheckbox"
  },
  phoo_website: {
    label: "Phoo Website",
    description: "Primary website URL in Phoo",
    type: "string"
  },
  // Lifecycle & Conversion
  phoo_signup_abandoned: {
    label: "Phoo Signup Abandoned",
    description: "Whether signup was abandoned",
    type: "booleancheckbox"
  },
  phoo_abandoned_at_step: {
    label: "Phoo Abandoned At Step",
    description: "Which step signup was abandoned at",
    type: "enumeration",
    options: ["signup", "plan", "payment", "onboarding"]
  },
  // API/Enterprise
  phoo_api_access_requested: {
    label: "Phoo API Access Requested",
    description: "Whether enterprise API access was requested",
    type: "booleancheckbox"
  }
};
function a(t) {
  let e = {};
  if (t.name) {
    let n = t.name.split(" ");
    e.firstname = n[0] || "", e.lastname = n.slice(1).join(" ") || "";
  }
  return t.acquisitionSource && (e.phoo_lead_source = t.acquisitionSource), t.acquisitionDate && (e.phoo_acquisition_date = t.acquisitionDate), t.membershipTier && (e.phoo_plan = t.membershipTier), t.onboardingStatus && (e.phoo_onboarding_status = t.onboardingStatus), t.accountStatus && (e.phoo_account_status = t.accountStatus), t.lastActiveAt && (e.phoo_last_activity = t.lastActiveAt), t.onboardingSteps?.ga4Connected !== void 0 && (e.phoo_ga4_connected = t.onboardingSteps.ga4Connected), t.onboardingSteps?.gscConnected !== void 0 && (e.phoo_gsc_connected = t.onboardingSteps.gscConnected), e;
}
o(a, "mapUserToHubSpot");
function s(t) {
  let e = {
    lifecyclestage: "lead",
    hs_lead_status: "NEW",
    // HubSpot has this as boolean checkbox (true/false)
    phoo_waitlist_signup: !0,
    // Use custom source or default to waitlist_beta
    phoo_lead_source: t.source || "waitlist_beta",
    phoo_onboarding_status: "not_started",
    phoo_account_status: "inactive"
  };
  return t.utmSource && (e.hs_analytics_source = t.utmSource), t.utmMedium && (e.hs_analytics_medium = t.utmMedium), t.utmCampaign && (e.hs_analytics_campaign = t.utmCampaign), e;
}
o(s, "mapWaitlistToHubSpot");
function r(t) {
  let e = {
    phoo_pr_score: t.prScore,
    phoo_needs_attention: t.needsAttention ?? !1
  };
  return t.prTier && (e.phoo_pr_tier = t.prTier), t.lastActiveAt && (e.phoo_last_activity = t.lastActiveAt), e;
}
o(r, "mapPRScoreToHubSpot");
export {
  i as HUBSPOT_CUSTOM_PROPERTIES,
  r as mapPRScoreToHubSpot,
  a as mapUserToHubSpot,
  s as mapWaitlistToHubSpot
};
//# sourceMappingURL=hubspotMapper.js.map
