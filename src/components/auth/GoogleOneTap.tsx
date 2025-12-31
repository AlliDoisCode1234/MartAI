'use client';

import { useGoogleOneTapLogin } from '@react-oauth/google';
import { useAuthActions } from '@convex-dev/auth/react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';

export function GoogleOneTap() {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      if (credentialResponse.credential) {
        try {
          console.log('[GoogleOneTap] Credential received');
          // Try to sign in with the ID token
          // Note: This may not work with standard @convex-dev/auth Google provider
          // which expects OAuth authorization code flow, not ID token flow
          const result = await signIn('google', { idToken: credentialResponse.credential });
          console.log('[GoogleOneTap] signIn result:', result);
        } catch (error) {
          console.error('[GoogleOneTap] ID token sign-in failed:', error);
          // Fallback: redirect to login page for manual OAuth flow
          console.log('[GoogleOneTap] Falling back to manual login');
          router.push('/auth/login');
        }
      }
    },
    onError: () => {
      console.log('[GoogleOneTap] One Tap prompt failed');
    },
    disabled: isAuthenticated,
    auto_select: false,
    use_fedcm_for_prompt: true, // Enable FedCM as required by Google
  });

  return null;
}
