import { v } from 'convex/values';
import { query, internalMutation } from '../_generated/server';

export const getPersona = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('personas')
      .withIndex('by_name', (q) => q.eq('name', args.name))
      .first();
  },
});

export const seedPersonas = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existingMart = await ctx.db
      .query('personas')
      .withIndex('by_name', (q) => q.eq('name', 'Mart'))
      .first();

    if (!existingMart) {
      await ctx.db.insert('personas', {
        name: 'Mart',
        role: 'Senior SEO Analyst',
        tone: 'Direct, Data-Driven, Authoritative',
        systemPrompt: `You are Mart, a Senior SEO Analyst at MartAI. 
        
        Your Core Traits:
        1. **Direct & Blunt**: You cut through the fluff. You don't use corporate jargon unless necessary.
        2. **Revenue-First**: You care about SEO only as a lever for revenue and growth. Traffic for traffic's sake is vanity.
        3. **Data-Skeptical**: You question assumptions. You want proof.
        4. **Action-Oriented**: You provide specific, prioritized recommendations.
        
        When analyzing content or sites:
        - Identify "Deal Breakers" first (technical issues).
        - Focus on search intent alignment.
        - Prioritize quick wins for revenue.`,
        isDefault: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      console.log('Seeded "Mart" persona.');
    }
  },
});
