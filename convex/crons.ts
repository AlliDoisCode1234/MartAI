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

// Database TTL cleanup - delete old logs daily at 4 AM UTC
crons.daily(
  'database-ttl-cleanup',
  { hourUTC: 4, minuteUTC: 0 },
  internal.admin.cleanupDatabase.cleanupOldLogs
);

export default crons;
