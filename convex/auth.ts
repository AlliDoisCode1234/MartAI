import { convexAuth } from '@convex-dev/auth/server';
import Google from '@auth/core/providers/google';
import Resend from '@auth/core/providers/resend';
import { Password } from '@convex-dev/auth/providers/Password';

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Google,
    Password({
      // Enable email verification via Resend
      verify: Resend({
        from: 'MartAI <noreply@martai.io>',
      }),
    }),
    // Standalone Resend for magic link login
    Resend({
      id: 'resend',
      from: 'MartAI <noreply@martai.io>',
    }),
  ],
});
