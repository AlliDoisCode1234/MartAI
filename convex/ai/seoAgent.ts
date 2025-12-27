/**
 * SEO Agent - DEPRECATED
 *
 * This file re-exports from convex/phoo/agent for backward compatibility.
 * Use `import { phooAgent } from '../phoo/agent'` for new code.
 *
 * @deprecated Use convex/phoo/agent instead
 */

export {
  // New exports
  phooAgent,
  phooFaqAgent,
  phooTools,
  PHOO_INSTRUCTIONS,
  PHOO_FAQ_INSTRUCTIONS,
  PHOO_AGENT_CONFIG,
  // Backward compatibility aliases
  seoAgent,
  SEO_AGENT_CONFIG,
  MART_INSTRUCTIONS,
} from '../phoo/agent';
