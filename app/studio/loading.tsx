/**
 * Studio Loading State
 *
 * Component Hierarchy:
 * App -> Studio Layout -> Loading (this file)
 *
 * Route-level loading state for the Content Studio.
 * Uses the existing DashboardSkeleton component for visual consistency.
 */

import { DashboardSkeleton } from '@/src/components/dashboard';

export default function StudioLoading() {
  return <DashboardSkeleton />;
}
