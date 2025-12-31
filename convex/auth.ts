import { convexAuth } from '@convex-dev/auth/server';
import Google from '@auth/core/providers/google';
import Resend from '@auth/core/providers/resend';
import { Password } from '@convex-dev/auth/providers/Password';

// TODO: Change to 'MartAI <noreply@martai.io>' after verifying domain at https://resend.com/domains
const RESEND_FROM = 'Phoo <onboarding@resend.dev>';

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
