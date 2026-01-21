import {
  a as n,
  b as i,
  e as c
} from "./_deps/GTU362KY.js";
import {
  r as t,
  x as s
} from "./_deps/4U34M3I6.js";
import "./_deps/RUVYHBJQ.js";

// convex/crons.ts
s();
c();
var e = t();
e.daily(
  "analytics-sync",
  { hourUTC: 2, minuteUTC: 0 },
  n["analytics/scheduler"].syncAllProjects
);
e.daily(
  "password-reset-token-cleanup",
  { hourUTC: 3, minuteUTC: 0 },
  i.auth.passwordReset.cleanupExpiredTokens
);
e.interval(
  "ai-provider-health-check",
  { minutes: 5 },
  i.ai.health.healthActions.runHealthChecks
);
e.interval(
  "ai-circuit-timeout-check",
  { minutes: 1 },
  i.ai.health.healthActions.checkCircuitTimeouts
);
e.daily(
  "subscription-grace-period-check",
  { hourUTC: 4, minuteUTC: 0 },
  i.subscriptions.subscriptionLifecycle.checkGracePeriodExpiration
);
e.hourly(
  "impersonation-session-cleanup",
  { minuteUTC: 15 },
  // Run at 15 minutes past each hour
  i.admin.impersonation.cleanupExpiredSessions
);
var o = e;
export {
  o as default
};
//# sourceMappingURL=crons.js.map
