/**
 * AI Provider Error Parser
 *
 * Parses raw error messages into structured, user-friendly format.
 * Used by the AI Providers admin dashboard.
 */

export interface ParsedError {
  code: string;
  category: 'config' | 'auth' | 'rate_limit' | 'network' | 'service' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  friendlyMessage: string;
  suggestedAction: string;
  rawError: string;
}

interface ErrorPattern {
  code: string;
  category: ParsedError['category'];
  severity: ParsedError['severity'];
  patterns: (string | RegExp)[];
  friendlyMessage: string;
  suggestedAction: string;
}

const ERROR_PATTERNS: ErrorPattern[] = [
  {
    code: 'AI-001',
    category: 'config',
    severity: 'critical',
    patterns: ['API key not configured', 'api key is missing', 'GOOGLE_GENERATIVE_AI_API_KEY'],
    friendlyMessage: 'API key is not configured',
    suggestedAction: 'Add the API key to your Convex environment variables',
  },
  {
    code: 'AI-002',
    category: 'auth',
    severity: 'critical',
    patterns: ['401', 'Unauthorized', 'invalid_api_key', 'Invalid API Key', 'authentication'],
    friendlyMessage: 'API key is invalid or expired',
    suggestedAction: 'Regenerate your API key from the provider dashboard',
  },
  {
    code: 'AI-003',
    category: 'rate_limit',
    severity: 'high',
    patterns: ['429', 'rate limit', 'Rate limit', 'too many requests', 'quota exceeded'],
    friendlyMessage: 'Rate limit exceeded',
    suggestedAction: 'Wait a few minutes before retrying, or upgrade your plan',
  },
  {
    code: 'AI-004',
    category: 'network',
    severity: 'medium',
    patterns: [
      'ECONNREFUSED',
      'ETIMEDOUT',
      'fetch failed',
      'network error',
      'Error fetching',
      'getaddrinfo',
      'Could not resolve',
      "Couldn't resolve",
    ],
    friendlyMessage: 'Network connection failed',
    suggestedAction: 'Check your internet connection and firewall settings',
  },
  {
    code: 'AI-005',
    category: 'service',
    severity: 'high',
    patterns: ['500', '502', '503', 'Service Unavailable', 'Internal Server Error', 'Bad Gateway'],
    friendlyMessage: 'Provider service is temporarily unavailable',
    suggestedAction: 'The circuit breaker will automatically retry when the service recovers',
  },
  {
    code: 'AI-006',
    category: 'config',
    severity: 'medium',
    patterns: ['model not found', 'invalid model', 'does not exist'],
    friendlyMessage: 'Invalid model configuration',
    suggestedAction: 'Check that the model ID is correct and available in your plan',
  },
];

/**
 * Parse a raw error message into a structured format
 */
export function parseProviderError(rawError: string | undefined): ParsedError {
  if (!rawError) {
    return {
      code: 'AI-000',
      category: 'unknown',
      severity: 'low',
      friendlyMessage: 'No error recorded',
      suggestedAction: 'System is operating normally',
      rawError: '',
    };
  }

  const lowerError = rawError.toLowerCase();

  for (const pattern of ERROR_PATTERNS) {
    const matched = pattern.patterns.some((p) => {
      if (typeof p === 'string') {
        return lowerError.includes(p.toLowerCase());
      }
      return p.test(rawError);
    });

    if (matched) {
      return {
        code: pattern.code,
        category: pattern.category,
        severity: pattern.severity,
        friendlyMessage: pattern.friendlyMessage,
        suggestedAction: pattern.suggestedAction,
        rawError,
      };
    }
  }

  // Fallback for unknown errors
  return {
    code: 'AI-999',
    category: 'unknown',
    severity: 'low',
    friendlyMessage: 'Unknown error occurred',
    suggestedAction: 'Check the raw error details below for more information',
    rawError,
  };
}

/**
 * Get display color for severity
 */
export function getSeverityColor(severity: ParsedError['severity']): string {
  switch (severity) {
    case 'critical':
      return 'red';
    case 'high':
      return 'orange';
    case 'medium':
      return 'yellow';
    case 'low':
      return 'gray';
    default:
      return 'gray';
  }
}

/**
 * Get display color for category
 */
export function getCategoryColor(category: ParsedError['category']): string {
  switch (category) {
    case 'config':
      return 'purple';
    case 'auth':
      return 'red';
    case 'rate_limit':
      return 'orange';
    case 'network':
      return 'blue';
    case 'service':
      return 'yellow';
    case 'unknown':
      return 'gray';
    default:
      return 'gray';
  }
}
