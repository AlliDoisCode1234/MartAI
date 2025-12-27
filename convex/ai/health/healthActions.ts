/**
 * Health Check Actions
 *
 * Periodic health checks for AI providers.
 * Updates circuit breaker state and metrics.
 */

import { v } from 'convex/values';
import { internalAction, internalMutation } from '../../_generated/server';
import { internal, api } from '../../_generated/api';
import { getConfiguredProviders, getProvider } from '../providers';

/**
 * Run health checks on all configured providers
 */
export const runHealthChecks = internalAction({
  args: {},
  handler: async (ctx) => {
    const configured = getConfiguredProviders();
    const results: Record<string, { healthy: boolean; latencyMs: number; error?: string }> = {};

    // Get all providers from database
    const dbProviders = await ctx.runQuery(api.ai.health.circuitBreaker.getAllProviderHealth, {});

    for (const provider of configured) {
      const dbProvider = dbProviders.find((p: any) => p.name === provider.name);
      if (!dbProvider) continue;

      try {
        const healthResult = await provider.healthCheck();
        results[provider.name] = healthResult;

        if (healthResult.healthy) {
          // Record success
          await ctx.runMutation(internal.ai.health.circuitBreaker.recordSuccess, {
            providerId: dbProvider._id,
            latencyMs: healthResult.latencyMs,
          });
        } else {
          // Record failure
          await ctx.runMutation(internal.ai.health.circuitBreaker.recordFailure, {
            providerId: dbProvider._id,
            errorMessage: healthResult.error || 'Health check failed',
          });
        }

        // Update last health check timestamp
        await ctx.runMutation(internal.ai.health.healthActions.updateHealthCheckTime, {
          providerId: dbProvider._id,
        });

        console.log(
          `[HealthCheck] ${provider.name}: ${healthResult.healthy ? '✓' : '✗'} (${healthResult.latencyMs}ms)`
        );
      } catch (error: any) {
        results[provider.name] = {
          healthy: false,
          latencyMs: 0,
          error: error.message,
        };

        await ctx.runMutation(internal.ai.health.circuitBreaker.recordFailure, {
          providerId: dbProvider._id,
          errorMessage: error.message,
        });

        console.error(`[HealthCheck] ${provider.name} error:`, error.message);
      }
    }

    console.log(`[HealthCheck] Completed for ${Object.keys(results).length} providers`);
    return results;
  },
});

/**
 * Update provider health check timestamp
 */
export const updateHealthCheckTime = internalMutation({
  args: {
    providerId: v.id('aiProviders'),
  },
  handler: async (ctx, args) => {
    const health = await ctx.db
      .query('aiProviderHealth')
      .withIndex('by_provider', (q) => q.eq('providerId', args.providerId))
      .first();

    if (health) {
      await ctx.db.patch(health._id, {
        lastHealthCheckAt: Date.now(),
      });
    }
  },
});

/**
 * Check and transition open circuits to half-open
 */
export const checkCircuitTimeouts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Find all open circuits
    const healthRecords = await ctx.db.query('aiProviderHealth').collect();

    for (const health of healthRecords) {
      if (
        health.circuitState === 'open' &&
        health.circuitOpenUntil &&
        now > health.circuitOpenUntil
      ) {
        await ctx.db.patch(health._id, {
          circuitState: 'half_open',
          consecutiveSuccesses: 0,
          updatedAt: now,
        });

        const provider = await ctx.db.get(health.providerId);
        console.log(`[CircuitBreaker] ${provider?.name} transitioned to HALF_OPEN`);
      }
    }
  },
});
