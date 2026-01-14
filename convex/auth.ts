import { convexAuth } from '@convex-dev/auth/server';
import Google from '@auth/core/providers/google';
import Resend from '@auth/core/providers/resend';
import { Password } from '@convex-dev/auth/providers/Password';

// Production: Set RESEND_FROM_EMAIL env var to 'Phoo <noreply@phoo.ai>' after domain verification
// Development: Falls back to resend.dev test domain
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'Phoo <onboarding@resend.dev>';

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    // TODO: Re-enable email verification for production after domain is verified
    // Password({ verify: Resend({ from: RESEND_FROM }) }),
    Password, // No email verification for dev
    // Standalone Resend for magic link login
    Resend({
      id: 'resend',
      from: RESEND_FROM,
    }),
  ],
});
