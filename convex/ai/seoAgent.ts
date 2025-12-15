/**
 * SEO Agent - Mart AI Assistant
 *
 * Uses @convex-dev/agent for conversational AI with memory.
 * Mart is the SEO expert persona with tools for keyword/content generation.
 *
 * NOTE: Run `npx convex dev --once` to generate types after adding agent component.
 * Then update this file to use the generated components.agent type.
 */

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

// Agent configuration (used after Convex types are generated)
export const SEO_AGENT_CONFIG = {
  model: 'gpt-4o-mini',
  embeddingModel: 'text-embedding-3-small',
  instructions: MART_INSTRUCTIONS,
};

/**
 * After running `npx convex dev --once`, uncomment and use:
 *
 * import { Agent } from '@convex-dev/agent';
 * import { components } from '../_generated/api';
 * import { openai } from '@ai-sdk/openai';
 *
 * export const seoAgent = new Agent(components.agent, {
 *   chat: openai.chat(SEO_AGENT_CONFIG.model),
 *   textEmbedding: openai.embedding(SEO_AGENT_CONFIG.embeddingModel),
 *   instructions: SEO_AGENT_CONFIG.instructions,
 * });
 */
