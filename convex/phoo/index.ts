/**
 * Phoo Intelligence Layer
 *
 * Component Hierarchy:
 * convex/phoo/index.ts (this file)
 *
 * Main entry point for all Phoo functionality.
 *
 * Layers:
 * - PhooLib: Semantic knowledge library (lib/)
 * - PhooBrain: AI processing (brain/)
 * - PhooAgent: Chat interface (agent/)
 * - PhooSync: Integrations (sync/) - coming soon
 * - PhooMCP: Model Context Protocol (mcp/) - coming soon
 */

// PhooAgent - Chat interface
export * from './agent';

// PhooLib - Semantic knowledge library
export * from './lib';

// PhooBrain - AI processing (re-exports from convex/ai/)
// Note: Use specific imports from './brain/providers', './brain/router', './brain/health'
// to avoid circular dependencies
