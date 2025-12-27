/**
 * Phoo Agent Index
 *
 * Component Hierarchy:
 * convex/phoo/agent/index.ts (this file)
 *
 * Re-exports all agent functionality for clean imports.
 */

export {
  phooAgent,
  phooFaqAgent,
  phooTools,
  PHOO_INSTRUCTIONS,
  PHOO_FAQ_INSTRUCTIONS,
  PHOO_AGENT_CONFIG,
  // Backward compatibility
  seoAgent,
  SEO_AGENT_CONFIG,
  MART_INSTRUCTIONS,
} from './phoo';
