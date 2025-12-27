/**
 * Provider Registry
 *
 * Centralized access to all AI providers.
 * Handles provider discovery and configuration status.
 */

import type { AIProvider } from './types';
import { openaiProvider } from './openai';
import { anthropicProvider } from './anthropic';
import { googleProvider } from './google';

// All available providers
const ALL_PROVIDERS: AIProvider[] = [openaiProvider, anthropicProvider, googleProvider];

/**
 * Get all registered providers
 */
export function getAllProviders(): AIProvider[] {
  return ALL_PROVIDERS;
}

/**
 * Get only configured providers (have API keys)
 */
export function getConfiguredProviders(): AIProvider[] {
  return ALL_PROVIDERS.filter((p) => p.isConfigured());
}

/**
 * Get a provider by name
 */
export function getProvider(name: string): AIProvider | undefined {
  return ALL_PROVIDERS.find((p) => p.name === name);
}

/**
 * Check provider configuration status
 */
export function getProviderStatus(): Record<string, { configured: boolean; models: number }> {
  const status: Record<string, { configured: boolean; models: number }> = {};

  for (const provider of ALL_PROVIDERS) {
    status[provider.name] = {
      configured: provider.isConfigured(),
      models: provider.getModels().length,
    };
  }

  return status;
}

// Re-export providers and types
export { openaiProvider, anthropicProvider, googleProvider };
export * from './types';
