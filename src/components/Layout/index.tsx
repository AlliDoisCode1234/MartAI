'use client';

/**
 * Layout Component
 *
 * Component Hierarchy:
 * App → Layout (this file)
 *   ├── Navigation
 *   ├── SkipLink (Accessibility)
 *   ├── MainContent
 *   ├── MartGuide
 *   ├── NextStepCTA
 *   └── GoogleOneTap
 *
 * Reference: docs/project/USER_FLOW_LDD.md
 */

import { type FC, type ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { Navigation } from '../Navigation';
import { GoogleOneTap } from '../auth/GoogleOneTap';
import { MartGuide, useFirstVisit } from '../mart';
import { NextStepCTA } from '../Navigation/NextStepCTA';
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
  const { phase, hasCompletedFirstProject, phaseInfo } = useUserPhase({
    projectId: projectId as Id<'projects'> | null,
  });

  // Track first visits for Mart guide
  const isFirstVisit = useFirstVisit(pathname || '/');

  // Pages where we hide Mart (marketing page, onboarding, auth, admin)
  const hideMartPages = ['/', '/onboarding', '/auth', '/admin', '/apply', '/thank-you'];
  const showMart = !hideMartPages.some((p) => pathname === p || pathname?.startsWith(p + '/'));

  return (
    <Box minH="100vh" w="100%" bg="brand.light">
      <SkipLink />
      <Navigation />
      <GoogleOneTap />
      <MainContent>{children}</MainContent>

      {/* Mart Guide - shows on first visit to each page */}
      {showMart && (
        <MartGuide currentPath={pathname || '/'} phase={phase} isFirstVisit={isFirstVisit} />
      )}

      {/* Next Step CTA - guides users through phases */}
      {showMart && (
        <NextStepCTA phase={phase} hasCompletedFirstProject={hasCompletedFirstProject} />
      )}
    </Box>
  );
};
