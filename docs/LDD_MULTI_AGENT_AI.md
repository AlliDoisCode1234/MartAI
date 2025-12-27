# Multi-Agent AI Intelligence Layer - LDD

## Executive Summary

Design a resilient, multi-provider AI infrastructure that automatically fails over between providers (OpenAI, Anthropic, Google, etc.) when issues occur. The system uses health monitoring, circuit breakers, and intelligent routing to ensure 99.9% AI availability.

---

## Current State Analysis

### Existing Infrastructure

| Component           | Location                              | Current Behavior                                                       |
| ------------------- | ------------------------------------- | ---------------------------------------------------------------------- |
| IntelligenceService | `convex/lib/services/intelligence.ts` | OpenAI-only with model fallback (gpt-4o → gpt-4o-mini → gpt-3.5-turbo) |
| SEO Agent           | `convex/ai/seoAgent.ts`               | Uses `@convex-dev/agent` with hardcoded OpenAI                         |
| Embeddings          | `convex/seo/library.ts`               | OpenAI text-embedding-3-small                                          |
| Draft Generation    | `convex/content/draftActions.ts`      | Direct OpenAI calls                                                    |
| Insights            | `convex/analytics/insights.ts`        | Direct OpenAI calls                                                    |

### Limitations

- **Single Point of Failure**: OpenAI outage = complete AI failure
- **No Health Monitoring**: No awareness of provider status
- **No Cross-Provider Fallback**: Can't switch to Claude if OpenAI fails
- **Hardcoded Models**: Model selection scattered across codebase

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CALLING CODE                              │
│  (briefActions, draftActions, insights, seoAgent, etc.)         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI ROUTER                                   │
│  • Task classification                                          │
│  • Provider selection (strategy-based)                          │
│  • Request normalization                                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   OpenAI     │    │  Anthropic   │    │   Google     │
│   Adapter    │    │   Adapter    │    │   Adapter    │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Circuit    │    │   Circuit    │    │   Circuit    │
│   Breaker    │    │   Breaker    │    │   Breaker    │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       └───────────┬───────┴──────────┬────────┘
                   ▼                  ▼
           ┌──────────────┐   ┌──────────────┐
           │    Health    │   │   Metrics    │
           │   Monitor    │   │  Collector   │
           └──────────────┘   └──────────────┘
```

---

## Schema Design

### New Tables

```typescript
// convex/schema.ts additions

// ========================================
// MULTI-AGENT AI INFRASTRUCTURE
// ========================================

aiProviders: defineTable({
  name: v.string(),                    // 'openai', 'anthropic', 'google'
  displayName: v.string(),             // 'OpenAI', 'Anthropic Claude', 'Google Gemini'
  apiKeyEnvVar: v.string(),            // 'OPENAI_API_KEY'
  baseUrl: v.optional(v.string()),     // For custom endpoints
  isEnabled: v.boolean(),
  priority: v.number(),                // Lower = preferred (1-100)
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_name', ['name'])
  .index('by_enabled', ['isEnabled'])
  .index('by_priority', ['priority']),

aiModels: defineTable({
  providerId: v.id('aiProviders'),
  modelId: v.string(),                 // 'gpt-4o', 'claude-3-sonnet-20240229'
  displayName: v.string(),             // 'GPT-4o', 'Claude 3 Sonnet'
  capabilities: v.array(v.string()),   // ['chat', 'embeddings', 'vision', 'function_calling']
  contextWindow: v.number(),           // 128000
  costPer1kInputTokens: v.number(),    // In cents (e.g., 0.5 = $0.005)
  costPer1kOutputTokens: v.number(),
  defaultForTasks: v.optional(v.array(v.string())), // ['brief_generation', 'draft_writing']
  isEnabled: v.boolean(),
  priority: v.number(),                // Within this provider
  createdAt: v.number(),
})
  .index('by_provider', ['providerId'])
  .index('by_model', ['modelId'])
  .index('by_capability', ['capabilities']),

aiProviderHealth: defineTable({
  providerId: v.id('aiProviders'),
  status: v.union(
    v.literal('healthy'),
    v.literal('degraded'),
    v.literal('unhealthy'),
    v.literal('circuit_open')
  ),
  // Rolling metrics (15-minute window)
  avgLatencyMs: v.number(),
  p95LatencyMs: v.number(),
  errorRate: v.number(),               // 0.0 to 1.0
  successCount: v.number(),
  errorCount: v.number(),
  // Circuit breaker state
  circuitState: v.union(
    v.literal('closed'),
    v.literal('open'),
    v.literal('half_open')
  ),
  circuitOpenUntil: v.optional(v.number()),
  consecutiveFailures: v.number(),
  consecutiveSuccesses: v.number(),
  // Last events
  lastSuccessAt: v.optional(v.number()),
  lastErrorAt: v.optional(v.number()),
  lastErrorMessage: v.optional(v.string()),
  lastHealthCheckAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_provider', ['providerId'])
  .index('by_status', ['status']),

aiRoutingLogs: defineTable({
  traceId: v.string(),
  taskType: v.string(),                // 'brief_generation', 'embeddings', 'chat'
  requestedProvider: v.optional(v.string()),
  selectedProvider: v.string(),
  selectedModel: v.string(),
  strategy: v.string(),                // 'balanced', 'fastest', 'cheapest'
  fallbackUsed: v.boolean(),
  fallbackChain: v.optional(v.array(v.string())), // Providers tried before success
  latencyMs: v.number(),
  tokensIn: v.optional(v.number()),
  tokensOut: v.optional(v.number()),
  cost: v.optional(v.number()),
  status: v.union(v.literal('success'), v.literal('error')),
  errorMessage: v.optional(v.string()),
  userId: v.optional(v.id('users')),
  createdAt: v.number(),
})
  .index('by_trace', ['traceId'])
  .index('by_provider', ['selectedProvider'])
  .index('by_status', ['status'])
  .index('by_date', ['createdAt']),
```

---

## Circuit Breaker Pattern

### State Machine

```
     ┌─────────────────────────────────────────────┐
     │                                             │
     ▼                                             │
┌─────────┐  5 failures   ┌─────────┐  30s timeout │
│ CLOSED  │ ──────────────▶│  OPEN   │──────────────┤
└────┬────┘               └────┬────┘              │
     │                         │                   │
     │ success                 │ timeout           │
     │                         ▼                   │
     │                   ┌───────────┐  2 success  │
     └───────────────────│ HALF_OPEN │─────────────┘
                         └───────────┘
                              │
                              │ failure
                              ▼
                         ┌─────────┐
                         │  OPEN   │
                         └─────────┘
```

### Configuration

```typescript
const CIRCUIT_BREAKER_CONFIG = {
  failureThreshold: 5, // Failures before opening
  successThreshold: 2, // Successes in half-open to close
  openTimeoutMs: 30_000, // Time until half-open
  halfOpenMaxRequests: 3, // Requests allowed in half-open
};
```

---

## Provider Adapters

### Interface

```typescript
interface AIProvider {
  name: string;
  isConfigured(): boolean;
  generateText(request: AITextRequest): Promise<AITextResponse>;
  generateEmbeddings(texts: string[]): Promise<number[][]>;
  healthCheck(): Promise<HealthCheckResult>;
}

interface AITextRequest {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

interface AITextResponse {
  content: string;
  usage: { promptTokens: number; completionTokens: number };
  latencyMs: number;
  model: string;
  provider: string;
}
```

### Supported Providers

| Provider  | Models                             | Capabilities             |
| --------- | ---------------------------------- | ------------------------ |
| OpenAI    | gpt-4o, gpt-4o-mini, gpt-3.5-turbo | Chat, Embeddings, Vision |
| Anthropic | claude-3-sonnet, claude-3-haiku    | Chat, Vision             |
| Google    | gemini-1.5-pro, gemini-1.5-flash   | Chat, Embeddings, Vision |
| Groq      | llama-3.3-70b                      | Chat (fast inference)    |

---

## Routing Strategies

| Strategy       | When to Use              | Scoring                   |
| -------------- | ------------------------ | ------------------------- |
| `balanced`     | Default - best overall   | Health + Cost + Latency   |
| `fastest`      | Time-critical operations | Latency priority          |
| `cheapest`     | Bulk operations          | Cost priority             |
| `best_quality` | User-facing content      | Quality/priority priority |

### Scoring Algorithm

```typescript
function calculateScore(provider, model, strategy): number {
  // Health score (0-40 points)
  let healthScore = 40 - health.errorRate * 40;

  // Strategy-specific (0-40 points)
  let strategyScore = 0;
  switch (strategy) {
    case 'fastest':
      strategyScore = 40 - latencyMs / 100;
      break;
    case 'cheapest':
      strategyScore = 40 - costPer1kTokens * 10;
      break;
    case 'best_quality':
      strategyScore = 40 - model.priority * 4;
      break;
    case 'balanced':
    default:
      strategyScore = 15 - latencyMs / 200 + (15 - costPer1kTokens * 5) + (10 - model.priority);
  }

  return healthScore + strategyScore;
}
```

---

## Implementation Phases

### Phase 1: Foundation (4-6 hours)

- [ ] Add schema tables
- [ ] Create provider adapters (OpenAI, Anthropic, Google)
- [ ] Seed default providers

### Phase 2: Circuit Breaker (2-3 hours)

- [ ] Implement circuit breaker logic
- [ ] Add health check cron (every 5 min)
- [ ] Create metrics collection

### Phase 3: Router (3-4 hours)

- [ ] Implement routing logic
- [ ] Add scoring algorithms
- [ ] Create fallback chain

### Phase 4: Migration (4-6 hours)

- [ ] Refactor IntelligenceService
- [ ] Update all calling code
- [ ] Add admin UI for provider management

### Phase 5: Testing (2-3 hours)

- [ ] Unit tests for circuit breaker
- [ ] Integration tests for failover
- [ ] Load testing

**Total Estimate: 15-22 hours**

---

## Environment Variables

```bash
# Required (at least one)
OPENAI_API_KEY=sk-...

# Recommended for redundancy
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=AIza...

# Optional
GROQ_API_KEY=gsk_...
```

---

## New Files

| File                                 | Purpose           |
| ------------------------------------ | ----------------- |
| `convex/ai/providers/types.ts`       | Type definitions  |
| `convex/ai/providers/openai.ts`      | OpenAI adapter    |
| `convex/ai/providers/anthropic.ts`   | Anthropic adapter |
| `convex/ai/providers/google.ts`      | Google adapter    |
| `convex/ai/providers/registry.ts`    | Provider registry |
| `convex/ai/health/circuitBreaker.ts` | Circuit breaker   |
| `convex/ai/health/healthCheck.ts`    | Health cron       |
| `convex/ai/router/router.ts`         | Routing logic     |

---

## Verification Checklist

- [ ] Provider A fails → B takes over within 100ms
- [ ] Circuit opens after 5 consecutive failures
- [ ] Circuit half-opens after 30 seconds
- [ ] Cost tracking works for all providers
- [ ] Admin can manually toggle providers
- [ ] Fallback is transparent to calling code

---

## Risks & Mitigations

| Risk                  | Impact   | Mitigation                |
| --------------------- | -------- | ------------------------- |
| API key exposure      | Critical | Use Convex secrets        |
| Cascading failures    | High     | Circuit breakers          |
| Cost explosion        | Medium   | Per-provider spend limits |
| Model incompatibility | Medium   | Prompt normalization      |
