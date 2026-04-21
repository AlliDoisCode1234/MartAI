import { convexAuth } from '@convex-dev/auth/server';
import Google from '@auth/core/providers/google';
import Resend from '@auth/core/providers/resend';
import { Password } from '@convex-dev/auth/providers/Password';

// Production: Set RESEND_FROM_EMAIL env var to 'Phoo <noreply@phoo.ai>' after domain verification
// Development: Falls back to resend.dev test domain
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'Phoo <onboarding@resend.dev>';

const providers: any[] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }),
  Password({ verify: Resend({ from: RESEND_FROM }) }),
  // Standalone Resend for magic link login
  Resend({
    id: 'resend',
    from: RESEND_FROM,
  }),
];

// E2E Testing Bypass - Never runs in production. Guarded by explicit env variable check AND environment state.
if (process.env.NODE_ENV !== 'production' && process.env.E2E_INSECURE_TEST_PROVIDER === 'true') {
  providers.push(Password({ id: 'test-password' })); 
}

export const { auth, signIn, signOut, store } = convexAuth({ providers });
