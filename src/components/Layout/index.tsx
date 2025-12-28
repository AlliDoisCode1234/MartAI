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
 *   ├── PhooChatDrawer (guest marketing)
 *   ├── NextStepCTA
 *   └── GoogleOneTap
 *
 * Reference: docs/project/USER_FLOW_LDD.md
 */

import { type FC, type ReactNode, useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { Navigation } from '../Navigation';
import { GoogleOneTap } from '../auth/GoogleOneTap';
import { NextStepCTA } from '../Navigation/NextStepCTA';
import { PhooFab, PhooChatDrawer } from '@/src/components/phoo';
import { SkipLink, MainContent } from '@/src/lib/accessibility';
import { useUserPhase } from '@/lib/useUserPhase';
import { useProject } from '@/lib/hooks/useProject';
import type { Id } from '@/convex/_generated/dataModel';

type Props = {
  children: ReactNode;
};

export const Layout: FC<Props> = ({ children }) => {
  const pathname = usePathname();
  const { projectId } = useProject(null, { autoSelect: true });
  const { phase, hasCompletedFirstProject } = useUserPhase({
    projectId: projectId as Id<'projects'> | null,
  });

  // PhooFab drawer state for guest users
  const { isOpen: isDrawerOpen, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure();

  // Pages where we hide PhooFab (marketing page, onboarding, auth, admin)
  const hidePhooPages = ['/', '/onboarding', '/auth', '/admin', '/apply', '/thank-you'];
  const showPhoo = !hidePhooPages.some((p) => pathname === p || pathname?.startsWith(p + '/'));

  return (
    <Box minH="100vh" w="100%" bg="brand.light">
      <SkipLink />
      <Navigation />
      <GoogleOneTap />
      <MainContent>{children}</MainContent>

      {/* PhooFab - floating chat button (bottom-left) */}
      {showPhoo && <PhooFab onOpenDrawer={onOpenDrawer} />}

      {/* PhooChatDrawer - for guest users only */}
      <PhooChatDrawer isOpen={isDrawerOpen} onClose={onCloseDrawer} />

      {/* Next Step CTA - guides users through phases (bottom-right) */}
      {showPhoo && (
        <NextStepCTA phase={phase} hasCompletedFirstProject={hasCompletedFirstProject} />
      )}
    </Box>
  );
};
