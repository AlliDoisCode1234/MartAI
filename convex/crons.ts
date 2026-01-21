import { cronJobs } from 'convex/server';
import { api, internal } from './_generated/api';

const crons = cronJobs();

// Run analytics sync every night at 2 AM UTC
crons.daily(
  'analytics-sync',
  { hourUTC: 2, minuteUTC: 0 },
  api['analytics/scheduler'].syncAllProjects
);

// Clean up expired password reset tokens daily at 3 AM UTC
crons.daily(
  'password-reset-token-cleanup',
  { hourUTC: 3, minuteUTC: 0 },
  internal.auth.passwordReset.cleanupExpiredTokens
);

// AI Provider health checks every 5 minutes
crons.interval(
  'ai-provider-health-check',
  { minutes: 5 },
  internal.ai.health.healthActions.runHealthChecks
);

// Check circuit breaker timeouts every minute
crons.interval(
  'ai-circuit-timeout-check',
  { minutes: 1 },
  internal.ai.health.healthActions.checkCircuitTimeouts
);

// Check grace period expiration daily at 4 AM UTC
// Transitions expired grace_period subscriptions to maintenance_mode
crons.daily(
  'subscription-grace-period-check',
  { hourUTC: 4, minuteUTC: 0 },
  internal.subscriptions.subscriptionLifecycle.checkGracePeriodExpiration
);

// Clean up expired impersonation sessions hourly
// Marks active sessions past their expiry as expired
crons.hourly(
  'impersonation-session-cleanup',
  { minuteUTC: 15 }, // Run at 15 minutes past each hour
  internal.admin.impersonation.cleanupExpiredSessions
);

// Fetch Google SEO updates weekly (Sundays at 6 AM UTC)
// Monitors Search Central Blog for algorithm updates and announcements
crons.weekly(
  'google-seo-feed-sync',
  { dayOfWeek: 'sunday', hourUTC: 6, minuteUTC: 0 },
  internal.seo.googleSeoFeed.fetchGoogleSeoFeed
);

export default crons;
