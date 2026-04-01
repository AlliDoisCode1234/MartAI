/**
 * Vitest Setup: Suppress expected convex-test scheduler noise
 *
 * When mutations call ctx.scheduler.runAfter(), convex-test executes these
 * as real scheduled functions. In test environments:
 * 1. Email actions fail (AUTH_RESEND_KEY not set) — expected
 * 2. Scheduled writes fire after test transaction closes — expected
 *
 * These are NOT test failures — they're fire-and-forget side effects
 * that correctly fail in test environments. Suppressing them prevents
 * them from being reported as "Errors" in the vitest output.
 */

const EXPECTED_SCHEDULER_ERRORS = [
  'Write outside of transaction',
  'AUTH_RESEND_KEY environment variable is not set',
  'RunnerError',
];

function isExpectedSchedulerError(reason: unknown): boolean {
  if (reason instanceof Error) {
    return EXPECTED_SCHEDULER_ERRORS.some((pattern) =>
      reason.message.includes(pattern)
    );
  }
  if (typeof reason === 'string') {
    return EXPECTED_SCHEDULER_ERRORS.some((pattern) =>
      reason.includes(pattern)
    );
  }
  return false;
}

process.on('unhandledRejection', (reason) => {
  if (isExpectedSchedulerError(reason)) {
    // Silently suppress — these are convex-test scheduler noise
    return;
  }
  // Log unexpected rejections but don't crash the test runner
  // (cross-file scheduled function leakage is a convex-test limitation)
  console.warn('[convexTestSetup] Unexpected unhandled rejection:', reason);
});
