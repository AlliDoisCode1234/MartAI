import { cronJobs } from 'convex/server';
import { api } from './_generated/api';

const crons = cronJobs();

// Run analytics sync every night at 2 AM UTC
crons.daily(
  'analytics-sync',
  { hourUTC: 2, minuteUTC: 0 },
  api['analytics/scheduler'].syncAllProjects
);

export default crons;
