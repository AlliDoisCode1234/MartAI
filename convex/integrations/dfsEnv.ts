/**
 * DataForSEO Environment Credential Resolution
 *
 * Component Hierarchy:
 * Convex → Integrations → DFS Env (this file)
 *
 * SINGLE SOURCE OF TRUTH for DataForSEO credential resolution.
 * All Convex-side DFS modules MUST import from here.
 *
 * Canonical env var: DATAFORSEO_USERNAME
 * Deprecated env var: DATAFORSEO_LOGIN (accepted during migration only)
 *
 * Next.js-side code (lib/demoData.ts) uses DATAFORSEO_USERNAME directly
 * since developers control .env.local — no migration fallback needed.
 */

export type DfsCredentials = {
  login: string;
  password: string;
} | null;

let hasWarnedDeprecation = false;

/**
 * Resolve DataForSEO API credentials from environment variables.
 *
 * Precedence: DATAFORSEO_USERNAME > DATAFORSEO_LOGIN (deprecated)
 * Returns null if no valid credential pair is available.
 */
export function getDfsCredentials(): DfsCredentials {
  const canonical = process.env.DATAFORSEO_USERNAME;
  const deprecated = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  // Strict precedence: canonical wins, deprecated accepted only if canonical absent
  const login = canonical ?? deprecated;

  if (!canonical && deprecated && !hasWarnedDeprecation) {
    hasWarnedDeprecation = true;
    console.warn(
      '[DataForSEO] DEPRECATED: DATAFORSEO_LOGIN will be removed. ' +
      'Set DATAFORSEO_USERNAME in Convex Dashboard → Settings → Environment Variables.'
    );
  }

  if (!login || !password) {
    return null;
  }

  return { login, password };
}

/**
 * Check if DataForSEO credentials are available (for diagnostic/test use).
 * Does NOT log deprecation warnings.
 */
export function hasDfsCredentials(): boolean {
  const login = process.env.DATAFORSEO_USERNAME ?? process.env.DATAFORSEO_LOGIN;
  return !!login && !!process.env.DATAFORSEO_PASSWORD;
}
