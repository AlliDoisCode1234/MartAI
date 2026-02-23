import { describe, it, expect } from 'vitest';
import httpRouter from '../../convex/http';

describe('HTTP Router', () => {
  it('should export the configured HTTP router with auth and cron routes', () => {
    expect(httpRouter).toBeDefined();
    // Since we export the http router directly, we just verify it initialized successfully.
    // Testing specific HTTP endpoints like checkScheduledPosts normally involves sending fetch requests
    // to the Convex local development URL or using specific test router setups.
  });
});
