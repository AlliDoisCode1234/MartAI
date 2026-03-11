'use client';

/**
 * Profile Redirect
 *
 * Redirects to unified settings page (Profile tab).
 * Kept for backwards compatibility with bookmarks and links.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Spinner } from '@chakra-ui/react';

export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/settings?tab=profile');
  }, [router]);

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
      <Spinner size="xl" color="brand.orange" />
    </Box>
  );
}
