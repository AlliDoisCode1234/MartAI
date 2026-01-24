/**
 * Hashing utilities for invite tokens and other one-way secure data
 *
 * Unlike encryption (which is reversible), hashing is one-way.
 * Use for: invite tokens, password reset tokens, etc.
 *
 * Pattern:
 * - Generate random token
 * - Hash it before storing in DB
 * - Send original token to user via email
 * - When user submits token, hash again and compare
 */

/**
 * Hash a token using SHA-256
 * Returns hex-encoded hash
 */
export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify a token against a stored hash
 */
export async function verifyToken(token: string, storedHash: string): Promise<boolean> {
  const inputHash = await hashToken(token);
  return inputHash === storedHash;
}

/**
 * Generate a cryptographically secure random token
 * Returns hex-encoded token (32 bytes = 64 chars)
 */
export function generateSecureToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate a token and its hash together
 * Returns both the plain token (to send to user) and hash (to store in DB)
 */
export async function generateTokenPair(): Promise<{ token: string; tokenHash: string }> {
  const token = generateSecureToken();
  const tokenHash = await hashToken(token);
  return { token, tokenHash };
}
