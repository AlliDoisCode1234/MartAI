/**
 * Encrypted Credentials Helper
 *
 * High-level helper for storing/retrieving encrypted OAuth tokens
 * and platform credentials.
 *
 * Usage:
 *   // Storing credentials
 *   const encrypted = await encryptCredentials({
 *     accessToken: 'token123',
 *     refreshToken: 'refresh456',
 *   });
 *   await ctx.db.patch(connectionId, { credentials: encrypted });
 *
 *   // Retrieving credentials
 *   const decrypted = await decryptCredentials(connection.credentials);
 *   console.log(decrypted.accessToken);
 */

import { encryptCredential, decryptCredential, isEncrypted } from './encryption';

/**
 * OAuth-style credentials structure
 */
export interface OAuthCredentials {
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: number;
}

/**
 * Platform connection credentials (WordPress, Shopify, etc.)
 */
export interface PlatformCredentials {
  username?: string;
  applicationPassword?: string;
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Encrypted credentials storage format
 */
export interface EncryptedCredentials {
  _encrypted: true;
  accessToken?: string; // Encrypted
  refreshToken?: string; // Encrypted
  applicationPassword?: string; // Encrypted
  apiKey?: string; // Encrypted
  username?: string; // Not encrypted (not sensitive)
  tokenExpiry?: number; // Not encrypted (not sensitive)
}

/**
 * Encrypt OAuth credentials for secure storage
 */
export async function encryptOAuthCredentials(
  creds: OAuthCredentials
): Promise<EncryptedCredentials> {
  return {
    _encrypted: true,
    accessToken: creds.accessToken ? await encryptCredential(creds.accessToken) : undefined,
    refreshToken: creds.refreshToken ? await encryptCredential(creds.refreshToken) : undefined,
    tokenExpiry: creds.tokenExpiry,
  };
}

/**
 * Decrypt OAuth credentials from storage
 */
export async function decryptOAuthCredentials(
  encrypted: EncryptedCredentials | OAuthCredentials
): Promise<OAuthCredentials> {
  // Check if already decrypted (migration period)
  if (!('_encrypted' in encrypted) || !encrypted._encrypted) {
    return encrypted as OAuthCredentials;
  }

  return {
    accessToken: encrypted.accessToken ? await decryptCredential(encrypted.accessToken) : undefined,
    refreshToken: encrypted.refreshToken
      ? await decryptCredential(encrypted.refreshToken)
      : undefined,
    tokenExpiry: encrypted.tokenExpiry,
  };
}

/**
 * Encrypt platform credentials for secure storage
 */
export async function encryptPlatformCredentials(
  creds: PlatformCredentials
): Promise<EncryptedCredentials> {
  return {
    _encrypted: true,
    username: creds.username, // Not encrypted (for display)
    applicationPassword: creds.applicationPassword
      ? await encryptCredential(creds.applicationPassword)
      : undefined,
    apiKey: creds.apiKey ? await encryptCredential(creds.apiKey) : undefined,
    accessToken: creds.accessToken ? await encryptCredential(creds.accessToken) : undefined,
    refreshToken: creds.refreshToken ? await encryptCredential(creds.refreshToken) : undefined,
  };
}

/**
 * Decrypt platform credentials from storage
 */
export async function decryptPlatformCredentials(
  encrypted: EncryptedCredentials | PlatformCredentials
): Promise<PlatformCredentials> {
  // Check if already decrypted (migration period)
  if (!('_encrypted' in encrypted) || !encrypted._encrypted) {
    return encrypted as PlatformCredentials;
  }

  return {
    username: encrypted.username,
    applicationPassword: encrypted.applicationPassword
      ? await decryptCredential(encrypted.applicationPassword)
      : undefined,
    apiKey: encrypted.apiKey ? await decryptCredential(encrypted.apiKey) : undefined,
    accessToken: encrypted.accessToken ? await decryptCredential(encrypted.accessToken) : undefined,
    refreshToken: encrypted.refreshToken
      ? await decryptCredential(encrypted.refreshToken)
      : undefined,
  };
}

/**
 * Check if credentials need migration (are still unencrypted)
 */
export function needsEncryptionMigration(
  creds: EncryptedCredentials | OAuthCredentials | PlatformCredentials
): boolean {
  // If no _encrypted flag, needs migration
  if (!('_encrypted' in creds) || !creds._encrypted) {
    // Check if there's actually sensitive data to encrypt
    const c = creds as PlatformCredentials & OAuthCredentials;
    return !!(c.accessToken || c.refreshToken || c.apiKey || c.applicationPassword);
  }
  return false;
}

/**
 * Migrate unencrypted credentials to encrypted format
 */
export async function migrateCredentials(
  creds: OAuthCredentials | PlatformCredentials
): Promise<EncryptedCredentials> {
  // Detect type based on fields
  if ('applicationPassword' in creds || 'apiKey' in creds) {
    return encryptPlatformCredentials(creds as PlatformCredentials);
  }
  return encryptOAuthCredentials(creds as OAuthCredentials);
}

// Re-export for convenience
export { isEncrypted };
