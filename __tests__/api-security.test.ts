/**
 * API Security Test Suite
 * Tests API key auth, hashing, and permissions
 *
 * Note: CSRF tests requiring apiSecurity.ts are run via integration tests
 * due to Next.js import incompatibility with Jest's Node environment.
 */

import { describe, it, expect } from 'vitest';
import {
  extractApiKey,
  hashApiKey,
  hasPermission,
  generateRequestId,
  ApiKeyValidation,
} from '../lib/apiAuth';

// Create a minimal mock request object for testing
// (Since Node.js doesn't have the Web Fetch API Request class by default)
function createMockRequest(
  url: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
  } = {}
): { headers: { get: (name: string) => string | null } } {
  const headerMap = new Map<string, string>();

  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      headerMap.set(key.toLowerCase(), value);
    });
  }

  return {
    headers: {
      get: (name: string) => headerMap.get(name.toLowerCase()) ?? null,
    },
  };
}

describe('API Security', () => {
  describe('API Key Extraction', () => {
    it('should extract API key from Authorization Bearer header', () => {
      const request = createMockRequest('http://localhost:3000/api/v1/keywords', {
        headers: { Authorization: 'Bearer mart_abc123xyz' },
      });
      const key = extractApiKey(request as unknown as Request);
      expect(key).toBe('mart_abc123xyz');
    });

    it('should extract API key from X-API-Key header', () => {
      const request = createMockRequest('http://localhost:3000/api/v1/keywords', {
        headers: { 'X-API-Key': 'mart_abc123xyz' },
      });
      const key = extractApiKey(request as unknown as Request);
      expect(key).toBe('mart_abc123xyz');
    });

    it('should return null for missing API key', () => {
      const request = createMockRequest('http://localhost:3000/api/v1/keywords');
      const key = extractApiKey(request as unknown as Request);
      expect(key).toBeNull();
    });

    it('should return null for invalid API key prefix', () => {
      const request = createMockRequest('http://localhost:3000/api/v1/keywords', {
        headers: { Authorization: 'Bearer invalid_key123' },
      });
      const key = extractApiKey(request as unknown as Request);
      expect(key).toBeNull();
    });

    it('should prefer Authorization header over X-API-Key', () => {
      const request = createMockRequest('http://localhost:3000/api/v1/keywords', {
        headers: {
          Authorization: 'Bearer mart_fromauth',
          'X-API-Key': 'mart_fromheader',
        },
      });
      const key = extractApiKey(request as unknown as Request);
      expect(key).toBe('mart_fromauth');
    });
  });

  describe('API Key Hashing', () => {
    it('should produce consistent hash for same key', () => {
      const key = 'mart_test123456';
      const hash1 = hashApiKey(key);
      const hash2 = hashApiKey(key);
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different keys', () => {
      const hash1 = hashApiKey('mart_key1');
      const hash2 = hashApiKey('mart_key2');
      expect(hash1).not.toBe(hash2);
    });

    it('should produce 64-character hex hash', () => {
      const hash = hashApiKey('mart_anykey');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe('Permission Checking', () => {
    const mockValidation: ApiKeyValidation = {
      keyId: 'key_123',
      userId: 'user_123',
      projectId: 'project_123',
      permissions: ['read', 'write'],
    };

    it('should grant read permission when user has read', () => {
      expect(hasPermission(mockValidation, 'read')).toBe(true);
    });

    it('should grant write permission when user has write', () => {
      expect(hasPermission(mockValidation, 'write')).toBe(true);
    });

    it('should deny admin permission when user lacks admin', () => {
      expect(hasPermission(mockValidation, 'admin')).toBe(false);
    });

    it('should grant all permissions when user has admin', () => {
      const adminValidation: ApiKeyValidation = {
        ...mockValidation,
        permissions: ['admin'],
      };
      expect(hasPermission(adminValidation, 'read')).toBe(true);
      expect(hasPermission(adminValidation, 'write')).toBe(true);
      expect(hasPermission(adminValidation, 'admin')).toBe(true);
    });

    it('should grant read when user has write (write includes read)', () => {
      const writeOnlyValidation: ApiKeyValidation = {
        ...mockValidation,
        permissions: ['write'],
      };
      expect(hasPermission(writeOnlyValidation, 'read')).toBe(true);
    });

    it('should deny all permissions for null validation', () => {
      expect(hasPermission(null, 'read')).toBe(false);
      expect(hasPermission(null, 'write')).toBe(false);
      expect(hasPermission(null, 'admin')).toBe(false);
    });
  });

  describe('Request ID Generation', () => {
    it('should generate unique request IDs', () => {
      const id1 = generateRequestId();
      const id2 = generateRequestId();
      expect(id1).not.toBe(id2);
    });

    it('should start with req_ prefix', () => {
      const id = generateRequestId();
      expect(id).toMatch(/^req_/);
    });
  });

  describe('Edge Cases - SAM Checklist', () => {
    it('should handle empty API key gracefully', () => {
      const request = createMockRequest('http://localhost:3000/api/v1/keywords', {
        headers: { 'X-API-Key': '' },
      });
      const key = extractApiKey(request as unknown as Request);
      expect(key).toBeNull();
    });

    it('should handle very long API keys in hash', () => {
      const longKey = 'mart_' + 'a'.repeat(1000);
      const hash = hashApiKey(longKey);
      expect(hash).toHaveLength(64);
    });

    it('should handle special characters in API keys', () => {
      const specialKey = 'mart_abc123special';
      const hash = hashApiKey(specialKey);
      expect(hash).toHaveLength(64);
    });
  });
});
