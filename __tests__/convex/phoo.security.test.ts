import { convexTest } from 'convex-test';
import { expect, test, describe } from 'vitest';
import { api } from '../../convex/_generated/api';
import schema from '../../convex/schema';

// Component registration for test environment
import { register as registerRateLimiter } from '@convex-dev/rate-limiter/test';
import { register as registerAgent } from '@convex-dev/agent/test';
import { register as registerActionCache } from '@convex-dev/action-cache/test';

describe('Phoo Security Integration & Remediation Tests', () => {
  test('Token Exhaustion Prevention (Rate Limits)', async () => {
    // Setup generic convex test environment without auth
    const t = convexTest(schema);
    
    // Wire up the backend components since convexTest isolates them by default
    registerRateLimiter(t);
    registerAgent(t);
    // ActionCache is commonly used by Agent internally
    try {
      registerActionCache(t);
    } catch(e) {}
    
    // We expect the 21st call to throw RATE_LIMITED because the capacity is 20 per minute.
    let rateLimited = false;

    try {
      for (let i = 0; i < 22; i++) {
        try {
          await t.action(api.phoo.agent.chat.createThread, {});
        } catch (e: any) {
          if (e.message.includes('RATE_LIMITED')) {
            throw e; // Bubble up when the rate limiter trips
          }
          // We ignore other AI SDK failures (like missing OpenAI keys in the test runner)
          // because the rate limit check happens BEFORE the OpenAI call!
        }
      }
    } catch (e: any) {
      if (e.message.includes('RATE_LIMITED')) {
        rateLimited = true;
      }
    }
    
    // The test passes if the rate limiting correctly trapped the loop
    expect(rateLimited).toBe(true);
  });
});
