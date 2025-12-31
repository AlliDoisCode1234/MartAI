'use client';

/**
 * Layout Component
 *
 * Component Hierarchy:
 * App → Layout (this file)
 *   ├── Navigation
 *   ├── SkipLink (Accessibility)
 *   ├── MainContent
 *   ├── PhooFab (bottom-left chat FAB)
 *   └── PhooChatDrawer (guest marketing)
 */

import { type FC, type ReactNode } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { Navigation } from '../Navigation';
import { PhooFab, PhooChatDrawer } from '@/src/components/phoo';
import { SkipLink, MainContent } from '@/src/lib/accessibility';

type Props = {
  children: ReactNode;
};

export const Layout: FC<Props> = ({ children }) => {
  const pathname = usePathname();

  // PhooFab drawer state for guest users
  const { isOpen: isDrawerOpen, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure();

  // Pages where we hide PhooFab (onboarding, auth, admin)
  // Note: / (marketing) now shows Phoo for guest engagement
  const hidePhooPages = ['/onboarding', '/auth', '/admin', '/apply', '/thank-you'];
  const showPhoo = !hidePhooPages.some((p) => pathname === p || pathname?.startsWith(p + '/'));

  return (
    <Box minH="100vh" w="100%" bg="brand.light">
      <SkipLink />
      <Navigation />
      <MainContent>{children}</MainContent>

      {/* PhooFab - floating chat button (bottom-left) */}
      {showPhoo && <PhooFab onOpenDrawer={onOpenDrawer} />}

      {/* PhooChatDrawer - for guest users only */}
      <PhooChatDrawer isOpen={isDrawerOpen} onClose={onCloseDrawer} />
    </Box>
  );
};
