import {
  d
} from "../_deps/K33OSGN4.js";
import {
  c as e,
  e as u
} from "../_deps/4U34M3I6.js";
import {
  a as n
} from "../_deps/RUVYHBJQ.js";

// convex/admin/clearAllUserData.ts
u();
var h = d({
  args: {
    dryRun: e.optional(e.boolean()),
    confirmPhrase: e.optional(e.string())
  },
  handler: /* @__PURE__ */ n(async (w, o) => {
    if (!o.dryRun && o.confirmPhrase !== "DELETE_ALL_USER_DATA")
      return {
        error: 'Safety check failed. Pass confirmPhrase: "DELETE_ALL_USER_DATA" to proceed.',
        dryRun: !0
      };
    let t = {}, r = o.dryRun ?? !0, a = /* @__PURE__ */ n(async (i) => {
      let s = await w.db.query(i).collect();
      if (t[i] = s.length, !r)
        for (let l of s)
          await w.db.delete(l._id);
    }, "clearTable");
    await a("briefVersions"), await a("contentChecks"), await a("webhookDeliveries"), await a("submittedUrls"), await a("prospectDetails"), await a("gscKeywordSnapshots"), await a("aiRoutingLogs"), await a("aiGenerations"), await a("contentPieces"), await a("contentCalendars"), await a("briefs"), await a("drafts"), await a("scheduledPosts"), await a("keywords"), await a("keywordClusters"), await a("keywordIdeas"), await a("rankings"), await a("serpAnalyses"), await a("seoAudits"), await a("seoStatistics"), await a("insights"), await a("projectScores"), await a("quarterlyPlans"), await a("competitors"), await a("ga4Connections"), await a("gscConnections"), await a("platformConnections"), await a("analyticsData"), await a("competitorAnalytics"), await a("analyticsEvents"), await a("apiKeys"), await a("oauthTokens"), await a("generatedPages"), await a("aiReports"), await a("projects"), await a("prospects"), await a("subscriptions"), await a("usageLimits"), await a("clients"), await a("apiAccessRequests"), await a("passwordResetTokens"), await a("contentTemplates"), await a("personas"), await a("organizationInvitations"), await a("teamMembers"), await a("webhooks"), await a("organizations"), await a("authSessions"), await a("authAccounts"), await a("authRefreshTokens"), await a("authVerificationCodes"), await a("authVerifiers"), await a("authRateLimits"), await a("users");
    let c = Object.values(t).reduce((i, s) => i + s, 0);
    return {
      dryRun: r,
      message: r ? `DRY RUN: Would delete ${c} records across ${Object.keys(t).length} tables` : `DELETED ${c} records across ${Object.keys(t).length} tables`,
      stats: t,
      preserved: ["keywordLibrary", "aiProviders", "aiModels", "aiProviderHealth"]
    };
  }, "handler")
});
export {
  h as clearAllUserData
};
//# sourceMappingURL=clearAllUserData.js.map
