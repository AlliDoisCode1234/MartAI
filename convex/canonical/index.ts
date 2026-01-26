/**
 * Canonical Data Layer Exports
 *
 * Component Hierarchy:
 * convex/canonical/index.ts (this file)
 * └── Aggregates: metrics.ts, rating.ts
 *
 * SINGLE SOURCE OF TRUTH for all project data.
 * Use these canonical queries to ensure data consistency across the app.
 *
 * MIGRATION GUIDE:
 * - Replace `api.analytics.martaiRatingQueries.getLatestScore` with `api.canonical.rating.getCanonicalRating`
 * - Replace `useProject().strategyData` with `useQuery(api.canonical.metrics.getCanonicalMetrics)`
 * - Replace `api.phoo.lib.rating.getPhooRating` with `api.canonical.rating.getCanonicalRating`
 */

export { getCanonicalMetrics, type CanonicalMetrics } from './metrics';
export {
  getCanonicalRating,
  type CanonicalRating,
  type RatingBreakdown,
  type RatingStatus,
} from './rating';
