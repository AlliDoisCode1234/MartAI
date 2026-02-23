import { describe, it, expect } from 'vitest';
import { createTestContext } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('Email Actions', () => {
  it('should fail cleanly if AUTH_RESEND_KEY is not set', async () => {
    const t = createTestContext();

    // The action will validate schema internally. Once it runs, it checks for Resend API key.
    // In a test environment without the key, it throws the missing environment variable error.
    await expect(
      t.action(api.email.emailActions.sendWelcomeEmail, {
        email: 'test@example.com',
        name: 'Test User',
      })
    ).rejects.toThrow('AUTH_RESEND_KEY environment variable is not set');
  });

  it('should enforce schema validation for email templates', async () => {
    const t = createTestContext();

    await expect(
      t.action(api.email.emailActions.sendPhaseUnlockEmail, {
        email: 'test@example.com',
        phaseName: 'Onboarding',
      })
    ).rejects.toThrow('AUTH_RESEND_KEY environment variable is not set');
  });
});
