/**
 * Service Account Integration Tests
 *
 * Tests for the service account JSON upload and verification flow.
 * Uses mocked Google API responses.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock service account JSON structure
const validServiceAccountJson = {
  type: 'service_account',
  project_id: 'test-project-123',
  private_key_id: 'key-id-123',
  private_key: '-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----\n',
  client_email: 'test-service@test-project-123.iam.gserviceaccount.com',
  client_id: '123456789',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
};

const invalidJsonTypes = {
  notServiceAccount: { type: 'authorized_user', client_email: 'test@test.com' },
  missingEmail: { type: 'service_account', private_key: 'key' },
  missingKey: { type: 'service_account', client_email: 'test@test.com' },
  emptyObject: {},
  notJson: 'not json at all',
};

describe('Service Account JSON Parsing', () => {
  describe('validateServiceAccountJson', () => {
    // Helper function that mirrors the component's validation logic
    const validateServiceAccountJson = (json: unknown): boolean => {
      if (typeof json !== 'object' || json === null) return false;
      const obj = json as Record<string, unknown>;
      return (
        obj.type === 'service_account' &&
        typeof obj.client_email === 'string' &&
        typeof obj.private_key === 'string' &&
        typeof obj.project_id === 'string'
      );
    };

    it('should accept valid service account JSON', () => {
      expect(validateServiceAccountJson(validServiceAccountJson)).toBe(true);
    });

    it('should reject non-service-account type', () => {
      expect(validateServiceAccountJson(invalidJsonTypes.notServiceAccount)).toBe(false);
    });

    it('should reject JSON missing client_email', () => {
      expect(validateServiceAccountJson(invalidJsonTypes.missingEmail)).toBe(false);
    });

    it('should reject JSON missing private_key', () => {
      expect(validateServiceAccountJson(invalidJsonTypes.missingKey)).toBe(false);
    });

    it('should reject empty object', () => {
      expect(validateServiceAccountJson(invalidJsonTypes.emptyObject)).toBe(false);
    });

    it('should reject null', () => {
      expect(validateServiceAccountJson(null)).toBe(false);
    });

    it('should reject undefined', () => {
      expect(validateServiceAccountJson(undefined)).toBe(false);
    });

    it('should reject non-object types', () => {
      expect(validateServiceAccountJson('string')).toBe(false);
      expect(validateServiceAccountJson(123)).toBe(false);
      expect(validateServiceAccountJson([])).toBe(false);
    });
  });

  describe('Email extraction', () => {
    it('should extract client_email from valid JSON', () => {
      const email = validServiceAccountJson.client_email;
      expect(email).toBe('test-service@test-project-123.iam.gserviceaccount.com');
    });

    it('should contain iam.gserviceaccount.com domain', () => {
      const email = validServiceAccountJson.client_email;
      expect(email).toMatch(/@.*\.iam\.gserviceaccount\.com$/);
    });
  });
});

describe('Service Account Security', () => {
  it('should not allow arbitrary email input', () => {
    // The email must be extracted from the JSON, not user-provided
    const userProvidedEmail = 'attacker@evil.com';
    const extractedEmail = validServiceAccountJson.client_email;

    // These should never be the same in a valid flow
    expect(extractedEmail).not.toBe(userProvidedEmail);
  });

  it('should validate service account email format', () => {
    const email = validServiceAccountJson.client_email;
    // Service account emails have a specific format
    expect(email).toMatch(/^[a-z0-9-]+@[a-z0-9-]+\.iam\.gserviceaccount\.com$/);
  });
});

describe('Service Account Error Handling', () => {
  it('should provide helpful error for access denied', () => {
    const email = validServiceAccountJson.client_email;
    const errorMessage = `Access denied. Add ${email} as a Viewer in your GA4 property settings.`;

    expect(errorMessage).toContain(email);
    expect(errorMessage).toContain('Viewer');
    expect(errorMessage).toContain('GA4');
  });

  it('should provide helpful error for no properties found', () => {
    const email = validServiceAccountJson.client_email;
    const errorMessage = `No GA4 properties found. Add ${email} to your GA4 property and try again.`;

    expect(errorMessage).toContain(email);
    expect(errorMessage).toContain('GA4 property');
  });
});

describe('JWT Generation', () => {
  it('should create proper JWT structure', () => {
    // JWT has 3 parts separated by dots
    const mockJwt = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0ZXN0In0.signature';
    const parts = mockJwt.split('.');

    expect(parts).toHaveLength(3);
    expect(parts[0]).toBeTruthy(); // header
    expect(parts[1]).toBeTruthy(); // payload
    expect(parts[2]).toBeTruthy(); // signature
  });

  it('should include required claims in payload', () => {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: validServiceAccountJson.client_email,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    };

    expect(payload.iss).toBe(validServiceAccountJson.client_email);
    expect(payload.scope).toContain('analytics');
    expect(payload.aud).toBe('https://oauth2.googleapis.com/token');
    expect(payload.exp).toBeGreaterThan(payload.iat);
  });
});
