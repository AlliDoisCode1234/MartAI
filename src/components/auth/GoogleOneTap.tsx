'use client';

import { useGoogleOneTapLogin } from '@react-oauth/google';
import { useAuthActions } from '@convex-dev/auth/react';
import { useAuth } from '@/lib/useAuth';

export function GoogleOneTap() {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useAuth();

  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      if (credentialResponse.credential) {
        try {
          console.log('Google One Tap Success', credentialResponse);
          // Attempt to sign in with the ID token
          // Note: This relies on the backend provider accepting 'idToken' or 'token'
          // If this doesn't work out of the box with @convex-dev/auth + Google provider,
          // we might need a custom verification action.
          // For standard Auth.js, this is often 'id_token'.
          await signIn('google', { id_token: credentialResponse.credential });
        } catch (error) {
          console.error('One Tap Sign In Failed', error);
        }
      }
    },
    onError: () => {
      console.log('Google One Tap Failed');
    },
    disabled: isAuthenticated, // Don't show if already logged in
    auto_select: true, // Attempt auto sign-in
  });

  return null; // This component is headless (renders user prompt via Google script)
}
