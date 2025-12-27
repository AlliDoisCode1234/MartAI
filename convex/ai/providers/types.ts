/**
 * Multi-Agent AI Provider Types
 *
 * Type definitions for the provider abstraction layer.
 * Enables switching between OpenAI, Anthropic, Google, etc.
 */

// ========================================
// REQUEST/RESPONSE TYPES
// ========================================

export interface AITextRequest {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  stopSequences?: string[];
}

export interface AITextResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: 'stop' | 'length' | 'content_filter' | 'error';
  latencyMs: number;
  model: string;
  provider: string;
}

export interface AIStructuredRequest<T> {
  prompt: string;
  systemPrompt?: string;
  schema: T;
  maxTokens?: number;
  temperature?: number;
}

export interface HealthCheckResult {
  healthy: boolean;
  latencyMs: number;
  error?: string;
}

// ========================================
// PROVIDER INTERFACE
// ========================================

export interface AIProvider {
  /** Provider identifier (e.g., 'openai', 'anthropic') */
  name: string;

  /** Check if provider is configured (API key exists) */
  isConfigured(): boolean;

  /** Generate text completion */
  generateText(request: AITextRequest, modelId?: string): Promise<AITextResponse>;

  /** Generate embeddings for texts */
  generateEmbeddings(texts: string[]): Promise<number[][]>;

  /** Health check ping */
  healthCheck(): Promise<HealthCheckResult>;

  /** Get available models for this provider */
  getModels(): ProviderModel[];
}

export interface ProviderModel {
  modelId: string;
  displayName: string;
  capabilities: ModelCapability[];
  contextWindow: number;
  costPer1kInputTokens: number;
  costPer1kOutputTokens: number;
  priority: number; // Lower = preferred
}

export type ModelCapability =
  | 'chat'
  | 'embeddings'
  | 'vision'
  | 'function_calling'
  | 'structured_output';

// ========================================
// ROUTING TYPES
// ========================================

export type RoutingStrategy = 'balanced' | 'fastest' | 'cheapest' | 'best_quality';

export type TaskType = 'chat' | 'embeddings' | 'structured' | 'vision' | 'brief' | 'draft';

export interface RoutingRequest {
  taskType: TaskType;
  preferredProvider?: string;
  strategy?: RoutingStrategy;
  requiredCapabilities?: ModelCapability[];
  maxLatencyMs?: number;
  maxCostPerRequest?: number;
  userId?: string;
}

export interface RoutedProvider {
  provider: AIProvider;
  model: ProviderModel;
  score: number;
  reason: string;
}

// ========================================
// CIRCUIT BREAKER TYPES
// ========================================

export type CircuitState = 'closed' | 'open' | 'half_open';

export interface CircuitBreakerConfig {
  /** Failures before opening (default: 5) */
  failureThreshold: number;
  /** Successes in half-open to close (default: 2) */
  successThreshold: number;
  /** Time until half-open in ms (default: 30000) */
  openTimeoutMs: number;
  /** Requests allowed in half-open (default: 3) */
  halfOpenMaxRequests: number;
}

export const DEFAULT_CIRCUIT_BREAKER_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  successThreshold: 2,
  openTimeoutMs: 30_000,
  halfOpenMaxRequests: 3,
};

// ========================================
// HEALTH STATUS TYPES
// ========================================

export type ProviderStatus = 'healthy' | 'degraded' | 'unhealthy' | 'circuit_open';

export interface ProviderHealthMetrics {
  status: ProviderStatus;
  avgLatencyMs: number;
  p95LatencyMs: number;
  errorRate: number;
  successCount: number;
  errorCount: number;
  circuitState: CircuitState;
  lastSuccessAt?: number;
  lastErrorAt?: number;
  lastErrorMessage?: string;
}
