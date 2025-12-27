/**
 * Circuit Breaker Implementation
 *
 * Prevents cascade failures by tracking provider health
 * and temporarily disabling unhealthy providers.
 *
 * States:
 * - CLOSED: Normal operation, all requests go through
 * - OPEN: Provider is failing, reject immediately
 * - HALF_OPEN: Testing if provider has recovered
 */

import { v } from 'convex/values';
import { mutation, query, internalMutation } from '../../_generated/server';
import { Id } from '../../_generated/dataModel';
import type { CircuitState, CircuitBreakerConfig } from '../providers/types';

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  successThreshold: 2,
  openTimeoutMs: 30_000,
  halfOpenMaxRequests: 3,
};

// ========================================
// QUERIES
// ========================================

/**
 * Get health status for a provider
 */
export const getProviderHealth = query({
  args: {
    providerId: v.id('aiProviders'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('aiProviderHealth')
      .withIndex('by_provider', (q) => q.eq('providerId', args.providerId))
      .first();
  },
});

/**
 * Get health status for all providers
 */
export const getAllProviderHealth = query({
  args: {},
  handler: async (ctx) => {
    const health = await ctx.db.query('aiProviderHealth').collect();
    const providers = await ctx.db.query('aiProviders').collect();

    return providers.map((p) => ({
      ...p,
      health: health.find((h) => h.providerId === p._id) || {
        status: 'unknown' as const,
        circuitState: 'closed' as CircuitState,
        avgLatencyMs: 0,
        errorRate: 0,
      },
    }));
  },
});

/**
 * Check if circuit is open for a provider
 */
export const isCircuitOpen = query({
  args: {
    providerId: v.id('aiProviders'),
  },
  handler: async (ctx, args) => {
    const health = await ctx.db
      .query('aiProviderHealth')
      .withIndex('by_provider', (q) => q.eq('providerId', args.providerId))
      .first();

    if (!health) return false;

    // Check if open timeout has passed
    if (health.circuitState === 'open' && health.circuitOpenUntil) {
      if (Date.now() > health.circuitOpenUntil) {
        return false; // Should transition to half-open
      }
      return true;
    }

    return health.circuitState === 'open';
  },
});

// ========================================
// MUTATIONS
// ========================================

/**
 * Initialize health record for a provider
 */
export const initializeHealth = mutation({
  args: {
    providerId: v.id('aiProviders'),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('aiProviderHealth')
      .withIndex('by_provider', (q) => q.eq('providerId', args.providerId))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert('aiProviderHealth', {
      providerId: args.providerId,
      status: 'healthy',
      avgLatencyMs: 0,
      errorRate: 0,
      successCount: 0,
      errorCount: 0,
      circuitState: 'closed',
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      lastHealthCheckAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

/**
 * Record a successful request
 */
export const recordSuccess = internalMutation({
  args: {
    providerId: v.id('aiProviders'),
    latencyMs: v.number(),
  },
  handler: async (ctx, args) => {
    const health = await ctx.db
      .query('aiProviderHealth')
      .withIndex('by_provider', (q) => q.eq('providerId', args.providerId))
      .first();

    if (!health) {
      console.warn(`[CircuitBreaker] No health record for provider ${args.providerId}`);
      return;
    }

    const newSuccessCount = health.successCount + 1;
    const newConsecutiveSuccesses = health.consecutiveSuccesses + 1;
    const totalRequests = newSuccessCount + health.errorCount;

    // Update rolling average latency
    const newAvgLatency =
      (health.avgLatencyMs * health.successCount + args.latencyMs) / newSuccessCount;

    let newCircuitState = health.circuitState;
    let newStatus = health.status;

    // Handle circuit state transitions
    if (health.circuitState === 'half_open') {
      if (newConsecutiveSuccesses >= DEFAULT_CONFIG.successThreshold) {
        newCircuitState = 'closed';
        console.log(`[CircuitBreaker] Provider ${args.providerId} circuit CLOSED (recovered)`);
      }
    }

    // Update status based on error rate
    const errorRate = health.errorCount / Math.max(totalRequests, 1);
    if (errorRate < 0.05) {
      newStatus = 'healthy';
    } else if (errorRate < 0.2) {
      newStatus = 'degraded';
    }

    await ctx.db.patch(health._id, {
      successCount: newSuccessCount,
      consecutiveSuccesses: newConsecutiveSuccesses,
      consecutiveFailures: 0, // Reset on success
      avgLatencyMs: newAvgLatency,
      errorRate,
      circuitState: newCircuitState,
      status: newStatus,
      lastSuccessAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

/**
 * Record a failed request
 */
export const recordFailure = internalMutation({
  args: {
    providerId: v.id('aiProviders'),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const health = await ctx.db
      .query('aiProviderHealth')
      .withIndex('by_provider', (q) => q.eq('providerId', args.providerId))
      .first();

    if (!health) {
      console.warn(`[CircuitBreaker] No health record for provider ${args.providerId}`);
      return;
    }

    const newErrorCount = health.errorCount + 1;
    const newConsecutiveFailures = health.consecutiveFailures + 1;
    const totalRequests = health.successCount + newErrorCount;
    const errorRate = newErrorCount / Math.max(totalRequests, 1);

    let newCircuitState = health.circuitState;
    let newStatus = health.status;
    let circuitOpenUntil = health.circuitOpenUntil;

    // Check if we should open the circuit
    if (newConsecutiveFailures >= DEFAULT_CONFIG.failureThreshold) {
      newCircuitState = 'open';
      circuitOpenUntil = Date.now() + DEFAULT_CONFIG.openTimeoutMs;
      newStatus = 'circuit_open';
      console.log(
        `[CircuitBreaker] Provider ${args.providerId} circuit OPEN (${newConsecutiveFailures} failures)`
      );
    } else if (errorRate >= 0.5) {
      newStatus = 'unhealthy';
    } else if (errorRate >= 0.2) {
      newStatus = 'degraded';
    }

    // In half-open state, any failure reopens the circuit
    if (health.circuitState === 'half_open') {
      newCircuitState = 'open';
      circuitOpenUntil = Date.now() + DEFAULT_CONFIG.openTimeoutMs;
      newStatus = 'circuit_open';
      console.log(`[CircuitBreaker] Provider ${args.providerId} circuit REOPENED from half-open`);
    }

    await ctx.db.patch(health._id, {
      errorCount: newErrorCount,
      consecutiveFailures: newConsecutiveFailures,
      consecutiveSuccesses: 0, // Reset on failure
      errorRate,
      circuitState: newCircuitState,
      circuitOpenUntil,
      status: newStatus,
      lastErrorAt: Date.now(),
      lastErrorMessage: args.errorMessage.substring(0, 500),
      updatedAt: Date.now(),
    });
  },
});

/**
 * Transition circuit to half-open state
 */
export const transitionToHalfOpen = internalMutation({
  args: {
    providerId: v.id('aiProviders'),
  },
  handler: async (ctx, args) => {
    const health = await ctx.db
      .query('aiProviderHealth')
      .withIndex('by_provider', (q) => q.eq('providerId', args.providerId))
      .first();

    if (!health) return;

    if (health.circuitState === 'open' && health.circuitOpenUntil) {
      if (Date.now() > health.circuitOpenUntil) {
        await ctx.db.patch(health._id, {
          circuitState: 'half_open',
          consecutiveSuccesses: 0,
          updatedAt: Date.now(),
        });
        console.log(`[CircuitBreaker] Provider ${args.providerId} circuit HALF_OPEN`);
      }
    }
  },
});

/**
 * Reset health metrics (for testing or manual intervention)
 */
export const resetHealth = mutation({
  args: {
    providerId: v.id('aiProviders'),
  },
  handler: async (ctx, args) => {
    const health = await ctx.db
      .query('aiProviderHealth')
      .withIndex('by_provider', (q) => q.eq('providerId', args.providerId))
      .first();

    if (!health) return;

    await ctx.db.patch(health._id, {
      status: 'healthy',
      avgLatencyMs: 0,
      errorRate: 0,
      successCount: 0,
      errorCount: 0,
      circuitState: 'closed',
      circuitOpenUntil: undefined,
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      lastErrorMessage: undefined,
      updatedAt: Date.now(),
    });

    console.log(`[CircuitBreaker] Reset health for provider ${args.providerId}`);
  },
});
