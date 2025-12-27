/**
 * Phoo Agent - Main AI Assistant for Phoo
 *
 * Component Hierarchy:
 * convex/phoo/agent/phoo.ts (this file)
 *
 * Uses @convex-dev/agent for conversational AI with memory.
 * Phoo is the SEO expert assistant with tools for keyword/content generation.
 */

import { Agent, createTool } from '@convex-dev/agent';
import { components, internal } from '../../_generated/api';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { ActionCtx } from '../../_generated/server';

// Phoo's system instructions
export const PHOO_INSTRUCTIONS = `You are Phoo, an AI SEO assistant helping small businesses grow their organic traffic.

## Your Personality
- Friendly and approachable, but professional
- Data-driven with a focus on actionable advice
- Explains SEO concepts in simple terms (no jargon)
- Always considers ROI and business impact
- Celebrates wins and encourages progress

## Your Capabilities
- Analyze keywords and suggest topic clusters
- Generate content briefs with SEO optimization
- Explain the Phoo Rating and how to improve it
- Guide users through GA4/GSC integration benefits
- Recommend next steps based on their current status

## Key Principles
1. **Revenue over vanity metrics** - Traffic is good, conversions are better
2. **Simple beats complex** - One clear action beats ten options
3. **Data-informed, not data-obsessed** - Use data to guide, not paralyze
4. **Progress over perfection** - Done is better than perfect

## Response Style
- Be concise and actionable
- Use lists and headers for clarity
- Celebrate small wins
- Always suggest a clear next step
- If you don't know something, say so honestly

## Phoo Rating Context
The Phoo Rating (0-100) measures how optimized the user's setup is:
- 0-40: Generic (no integrations, using industry baselines)
- 40-70: Growing (some data, limited personalization)
- 70-100: Optimized (full integration, personalized recommendations)

Higher ratings unlock better, more personalized recommendations.
`;

// FAQ mode instructions (pre-signup, strict business logic)
export const PHOO_FAQ_INSTRUCTIONS = `You are Phoo, explaining the Phoo SEO platform to potential customers.

## Your Role
- Answer questions about what Phoo does
- Explain pricing and features clearly
- Show the value proposition
- Guide toward signing up

## Strict Rules
- DO NOT generate any SEO content or keywords
- DO NOT analyze websites or competitors
- DO NOT provide personalized recommendations
- ONLY explain features and answer FAQs
- ALWAYS redirect actionable requests to "Sign up to get started!"

## Topics You Can Discuss
- What is Phoo and how it works
- Pricing tiers ($49 Solo, $149 Growth, Custom Agency)
- How the Phoo Rating works
- What GA4/GSC integration provides
- How content briefs and calendars work
- How long it takes to see results (typically 3-6 months)

## Response Style
- Friendly and helpful
- Brief and clear
- Always end with a call to action toward signup
`;

// Agent configuration
export const PHOO_AGENT_CONFIG = {
  model: 'gpt-4o-mini' as const,
  embeddingModel: 'text-embedding-3-small' as const,
};

// Initialize the Phoo Agent with Convex components
export const phooAgent = new Agent(components.agent, {
  name: 'phoo',
  languageModel: openai.chat(PHOO_AGENT_CONFIG.model),
  textEmbeddingModel: openai.embedding(PHOO_AGENT_CONFIG.embeddingModel),
  instructions: PHOO_INSTRUCTIONS,
});

// FAQ mode agent (limited capabilities)
export const phooFaqAgent = new Agent(components.agent, {
  name: 'phooFaq',
  languageModel: openai.chat(PHOO_AGENT_CONFIG.model),
  instructions: PHOO_FAQ_INSTRUCTIONS,
});

// Tool definitions for Phoo
export const phooTools = {
  // Get user's Phoo Rating
  getPhooRating: createTool({
    description: 'Get the current Phoo Rating for the user, showing how optimized their setup is.',
    args: z.object({
      projectId: z.string().optional().describe('The project ID to check rating for'),
    }),
    handler: async (ctx: ActionCtx, args: { projectId?: string }) => {
      // This will be implemented to calculate rating from project data
      // For now, return a placeholder that explains the rating system
      return {
        rating: 40,
        status: 'Generic',
        factors: {
          ga4Connected: false,
          gscConnected: false,
          keywordsSeeded: true,
          clustersGenerated: false,
          contentCalendar: false,
          freshSync: false,
        },
        nextStep: 'Connect Google Analytics to improve your rating to 60+',
      };
    },
  }),

  // Search the keyword library
  searchKeywords: createTool({
    description: 'Search the Phoo semantic keyword library for relevant keywords.',
    args: z.object({
      query: z.string().describe('The search query for keywords'),
      limit: z.number().optional().default(10).describe('Maximum number of results'),
    }),
    handler: async (ctx: ActionCtx, args: { query: string; limit?: number }) => {
      // This will search the semantic keyword library
      // For now, return a placeholder
      return {
        query: args.query,
        results: [],
        message: 'Keyword library search coming soon. Generate keywords first!',
      };
    },
  }),

  // Get content calendar suggestions
  getContentSuggestions: createTool({
    description: 'Get content calendar suggestions based on keyword clusters.',
    args: z.object({
      projectId: z.string().describe('The project ID to get suggestions for'),
      weeks: z.number().optional().default(4).describe('Number of weeks to plan'),
    }),
    handler: async (ctx: ActionCtx, args: { projectId: string; weeks?: number }) => {
      // This will generate content suggestions from PhooLib
      return {
        projectId: args.projectId,
        suggestions: [],
        message: 'Content suggestions will be based on your keyword clusters.',
      };
    },
  }),
};

// Re-export the old seoAgent for backward compatibility
export const seoAgent = phooAgent;
export const SEO_AGENT_CONFIG = PHOO_AGENT_CONFIG;
export const MART_INSTRUCTIONS = PHOO_INSTRUCTIONS;
