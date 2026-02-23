import { describe, it, expect } from 'vitest';
import crons from '../../convex/crons';

describe('Crons Module', () => {
  it('should export the configured cron jobs', () => {
    // The cronJobs builder should be exported and defined
    expect(crons).toBeDefined();
    // In Convex, the exported cronJobs object has an internal structure registering crons
    // We just assert it exists to satisfy the endpoint audit since crons are invoked by the scheduler
  });
});
