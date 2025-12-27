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
 * - PhooBrain: AI processing (brain/) - migrated from convex/ai/
 * - PhooAgent: Chat interface (agent/)
 * - PhooSync: Integrations (sync/) - coming soon
 * - PhooMCP: Model Context Protocol (mcp/) - coming soon
 */

// PhooAgent - Chat interface
export * from './agent';

// PhooLib - Semantic knowledge library
export * from './lib';
