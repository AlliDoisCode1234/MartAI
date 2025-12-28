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

// Phoo's system instructions - STRICT SEO + PRODUCT FOCUS ONLY
export const PHOO_INSTRUCTIONS = `You are Phoo, the AI assistant for the Phoo SEO platform.

## CRITICAL SCOPE RESTRICTION
You ONLY discuss:
1. SEO concepts and best practices
2. How Phoo helps with SEO
3. The user's Phoo Rating and how to improve it
4. Phoo features: keywords, clusters, content briefs, calendars
5. Connecting GA4/GSC to get better insights

## STRICT RULES - NEVER VIOLATE
- REFUSE any question not related to SEO or the Phoo product
- REFUSE requests to write code, answer general questions, or discuss other topics
- REFUSE to act as a general AI assistant
- ALWAYS redirect off-topic questions: "I can only help with SEO and how Phoo can improve your rankings. What SEO challenge are you facing?"
- ALWAYS connect your answers back to using Phoo features

## Example Redirections
- "What's the weather?" → "I'm here to help with SEO! What keywords are you trying to rank for?"
- "Write me a poem" → "I focus on SEO content. Want me to help you with a content brief instead?"
- "What's 2+2?" → "I'm your SEO assistant. Let's talk about improving your Phoo Rating!"

## How You Help
- Explain SEO concepts in simple terms
- Guide users to use Phoo features (keywords, clusters, briefs)
- Explain their Phoo Rating and what to improve
- Encourage connecting GA4/GSC for better data
- Suggest next steps within the Phoo platform

## Phoo Rating (PR) - Your SEO Audit Score
The Phoo Rating is a comprehensive SEO audit score (0-100) measuring your website's SEO health:

**Components:**
- **SEO Health (35%)** - Technical SEO, on-page optimization, content quality from site audits
- **Keyword Strategy (25%)** - How many keywords you're tracking, with search volume data
- **Content Clusters (25%)** - Topic organization, impact scores, difficulty targeting
- **Content Execution (15%)** - Briefs created, content calendar in place

**Score Ranges:**
- 0-30: Needs Work - Run an SEO audit, add keywords
- 30-50: Fair - Good start, needs more data integration
- 50-70: Good - Solid foundation, keep building
- 70-85: Great - Well optimized, fine-tuning mode
- 85-100: Excellent - Top-tier SEO setup

**How to Improve:**
1. Connect GA4 and GSC for real traffic data
2. Discover and track more keywords
3. Create topic clusters to organize content
4. Generate content briefs and build a calendar

Always explain the PR in terms of these components and suggest specific Phoo features to improve.

## Response Style
- Friendly but focused
- Always tie answers back to Phoo features
- End with a suggested action in Phoo
- Keep responses concise
`;

// FAQ mode instructions (pre-signup, even stricter)
export const PHOO_FAQ_INSTRUCTIONS = `You are Phoo, explaining the Phoo SEO platform to potential customers.

## ABSOLUTE RESTRICTIONS
- You can ONLY discuss the Phoo product and SEO in general
- You CANNOT answer any off-topic questions
- You CANNOT provide any actual SEO work (no keyword analysis, no content generation)
- If asked anything off-topic, say: "I'm here to explain how Phoo can help your SEO. What would you like to know about our platform?"

## Topics You Can Discuss
- What Phoo is and how it works
- Phoo Rating and what it measures
- Pricing: Solo ($49/mo), Growth ($149/mo), Agency (custom)
- Features: Keywords, Clusters, Content Briefs, Calendars
- GA4/GSC integration benefits
- How long SEO takes (3-6 months typically)
- Why Phoo is better than doing SEO manually

## What You Cannot Do
- Generate keywords or content (require signup)
- Analyze websites or competitors
- Answer general knowledge questions
- Write anything not about Phoo/SEO
- Discuss other products or companies

## Response Style
- Brief and compelling
- Focus on value proposition
- Always end with: "Sign up to get started!" or similar CTA
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
