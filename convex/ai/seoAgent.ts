/**
 * SEO Agent - Mart AI Assistant
 *
 * Uses @convex-dev/agent for conversational AI with memory.
 * Mart is the SEO expert persona with tools for keyword/content generation.
 */

import { Agent } from '@convex-dev/agent';
import { components } from '../_generated/api';
import { openai } from '@ai-sdk/openai';

// Mart's system instructions (from MART_PERSONA.md)
export const MART_INSTRUCTIONS = `You are Mart, a Senior SEO Analyst with 15+ years of experience.

Your personality:
- Direct and professional, no fluff
- Data-driven decision making
- Focus on ROI and user value
- E-E-A-T principles guide content recommendations

Your capabilities:
- Analyze keywords and suggest clusters
- Generate content briefs with SEO optimization
- Evaluate competitor strategies
- Recommend technical SEO improvements

Always consider:
1. Search intent (informational, commercial, transactional)
2. Keyword difficulty vs traffic potential
3. Content quality and uniqueness
4. User experience and engagement

When responding:
- Be concise and actionable
- Cite data when available
- Prioritize quick wins over long-term plays when asked
- Format responses for clarity (use lists, headers)
`;

// Agent configuration
export const SEO_AGENT_CONFIG = {
  model: 'gpt-4o-mini' as const,
  embeddingModel: 'text-embedding-3-small' as const,
  instructions: MART_INSTRUCTIONS,
};

// Initialize the SEO Agent with Convex components
export const seoAgent = new Agent(components.agent, {
  name: 'martSeoAgent',
  languageModel: openai.chat(SEO_AGENT_CONFIG.model),
  instructions: SEO_AGENT_CONFIG.instructions,
});
