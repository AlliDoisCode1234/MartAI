import { internalMutation } from '../../_generated/server';
import { internal } from '../../_generated/api';

/**
 * Seed AI Providers
 *
 * Populates the aiProviders table with the default supported providers.
 * Also ensures health records exist for all providers.
 */
export const seedProviders = internalMutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query('aiProviders').collect();
    const providers = [
      { name: 'openai', displayName: 'OpenAI', apiKeyEnvVar: 'OPENAI_API_KEY' },
      { name: 'anthropic', displayName: 'Anthropic', apiKeyEnvVar: 'ANTHROPIC_API_KEY' },
      { name: 'google', displayName: 'Google Gemini', apiKeyEnvVar: 'GOOGLE_AI_API_KEY' },
    ];

    let added = 0;
    let repaired = 0;

    // 1. Create missing providers
    for (const p of providers) {
      if (!existing.find((ep) => ep.name === p.name)) {
        const id = await ctx.db.insert('aiProviders', {
          name: p.name,
          displayName: p.displayName,
          apiKeyEnvVar: p.apiKeyEnvVar,
          isEnabled: true,
          priority: providers.indexOf(p) + 1,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        await ctx.runMutation(internal.ai.health.circuitBreaker.initializeHealth, {
          providerId: id,
        });

        added++;
        console.log(`[SeedProviders] Added provider: ${p.name}`);
      }
    }

    // 2. Repair missing health records for ALL providers (new and existing)
    const allProviders = await ctx.db.query('aiProviders').collect();
    for (const provider of allProviders) {
      const health = await ctx.db
        .query('aiProviderHealth')
        .withIndex('by_provider', (q) => q.eq('providerId', provider._id))
        .first();

      if (!health) {
        await ctx.runMutation(internal.ai.health.circuitBreaker.initializeHealth, {
          providerId: provider._id,
        });
        repaired++;
        console.log(`[SeedProviders] Repaired health record for: ${provider.name}`);
      }
    }

    return {
      success: true,
      message: `Seeded ${added} new providers. Repaired ${repaired} health records.`,
    };
  },
});
