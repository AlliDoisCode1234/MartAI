/**
 * Credential Encryption Module
 *
 * AES-256-GCM encryption for sensitive credentials (OAuth tokens, API keys, etc.)
 * Uses Web Crypto API which is available in Convex runtime.
 *
 * Security Design:
 * - AES-256-GCM (authenticated encryption)
 * - Fresh IV for every encryption
 * - Key from environment variable (CREDENTIAL_ENCRYPTION_KEY)
 * - IV stored alongside ciphertext (not secret, just unique)
 *
 * Usage:
 *   const encrypted = await encryptCredential("secret-token");
 *   const decrypted = await decryptCredential(encrypted);
 */

// Environment variable for encryption key (32 bytes = 256 bits, hex encoded = 64 chars)
const ENCRYPTION_KEY_ENV = 'CREDENTIAL_ENCRYPTION_KEY';

/**
 * Derive AES-256 key from hex-encoded environment variable
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  const keyHex = process.env[ENCRYPTION_KEY_ENV];

  if (!keyHex || keyHex.length !== 64) {
    throw new Error(
      `${ENCRYPTION_KEY_ENV} must be a 64-character hex string (256 bits). ` +
        `Generate with: openssl rand -hex 32`
    );
  }

  // Convert hex to Uint8Array
  const keyBytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    keyBytes[i] = parseInt(keyHex.substr(i * 2, 2), 16);
  }

  return crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt',
  ]);
}

/**
 * Encrypt a credential string using AES-256-GCM
 *
 * @param plaintext - The sensitive credential to encrypt
 * @returns Base64 encoded string: IV (12 bytes) + ciphertext + auth tag
 */
export async function encryptCredential(plaintext: string): Promise<string> {
  if (!plaintext) {
    return '';
  }

  const key = await getEncryptionKey();

  // Generate fresh IV (12 bytes for GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encode plaintext to bytes
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  // Encrypt
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

  // Combine IV + ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  // Return as base64
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt a credential string that was encrypted with encryptCredential
 *
 * @param encrypted - Base64 encoded IV + ciphertext from encryptCredential
 * @returns Original plaintext credential
 */
export async function decryptCredential(encrypted: string): Promise<string> {
  if (!encrypted) {
    return '';
  }

  const key = await getEncryptionKey();

  // Decode base64
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));

  // Extract IV (first 12 bytes) and ciphertext (rest)
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  // Decrypt
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);

  // Decode to string
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

/**
 * Check if a string appears to be encrypted (base64 with minimum length)
 * Useful for migration detection
 */
export function isEncrypted(value: string): boolean {
  if (!value || value.length < 28) {
    // Minimum: 12 byte IV + 1 byte data + 16 byte tag = 29 bytes base64 ≈ 39 chars
    return false;
  }

  // Check if valid base64
  try {
    atob(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a new encryption key (for initial setup)
 * Run: npx convex run lib/encryption:generateKey
 */
export function generateKeyCommand(): string {
  return 'openssl rand -hex 32';
}
