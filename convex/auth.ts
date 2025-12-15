import { convexAuth } from '@convex-dev/auth/server';
import Google from '@auth/core/providers/google';
import Resend from '@auth/core/providers/resend';
import { Password } from '@convex-dev/auth/providers/Password';

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Google,
    Password,
    Resend({
      from: 'MartAI <noreply@martai.io>',
    }),
  ],
});
