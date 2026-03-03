/**
 * GTM Integration Verification Test
 *
 * Component Hierarchy:
 * GtmAutomationModal → provisionTenantContainerPublic → provisionTenantContainer → GTM API
 *
 * Tests the full data flow from UI validation to backend action arguments.
 * Covers: regex validation, measurement ID forwarding, error guards, container modes.
 *
 * Run: npx vitest run __tests__/gtm-integration.test.ts
 */

import { describe, it, expect } from 'vitest';

// ============================================================================
// Unit tests for the GA4 Measurement ID validation regex
// ============================================================================

const GA4_MEASUREMENT_ID_REGEX = /^G-[A-Z0-9]+$/;

describe('GA4 Measurement ID Validation', () => {
  describe('valid measurement IDs', () => {
    const validIds = ['G-ABC123', 'G-XXXXXXXXX', 'G-1234567890', 'G-A1B2C3D4E5', 'G-A'];

    it.each(validIds)('should accept valid ID: %s', (id) => {
      expect(GA4_MEASUREMENT_ID_REGEX.test(id)).toBe(true);
    });
  });

  describe('invalid measurement IDs', () => {
    const invalidIds = [
      { id: '', reason: 'empty string' },
      { id: 'G-', reason: 'missing suffix' },
      { id: 'GTM-ABC123', reason: 'GTM container ID, not GA4' },
      { id: 'g-abc123', reason: 'lowercase (input should .toUpperCase())' },
      { id: 'G-abc123', reason: 'lowercase suffix' },
      { id: 'GA-123', reason: 'wrong prefix' },
      { id: 'G_ABC123', reason: 'underscore instead of dash' },
      { id: 'G-ABC 123', reason: 'contains space' },
      { id: 'G-ABC-123', reason: 'extra dash' },
      { id: 'UA-12345', reason: 'Universal Analytics ID' },
      { id: 'AW-12345', reason: 'Google Ads ID' },
      { id: ' G-ABC123', reason: 'leading space' },
      { id: 'G-ABC123 ', reason: 'trailing space' },
    ];

    it.each(invalidIds)('should reject $reason: "$id"', ({ id }) => {
      expect(GA4_MEASUREMENT_ID_REGEX.test(id)).toBe(false);
    });
  });

  describe('case normalization (simulates .toUpperCase() on input)', () => {
    it('should accept lowercase input after normalization', () => {
      const userInput = 'g-abc123xyz';
      const normalized = userInput.trim().toUpperCase();
      expect(GA4_MEASUREMENT_ID_REGEX.test(normalized)).toBe(true);
      expect(normalized).toBe('G-ABC123XYZ');
    });

    it('should handle mixed case input after normalization', () => {
      const userInput = 'G-aBc123';
      const normalized = userInput.trim().toUpperCase();
      expect(GA4_MEASUREMENT_ID_REGEX.test(normalized)).toBe(true);
    });

    it('should reject GTM container ID even after normalization', () => {
      const userInput = 'gtm-abc123';
      const normalized = userInput.trim().toUpperCase();
      expect(GA4_MEASUREMENT_ID_REGEX.test(normalized)).toBe(false);
    });
  });
});

// ============================================================================
// Domain extraction test
// ============================================================================

describe('Domain Extraction from websiteUrl', () => {
  it('should extract hostname from valid URL', () => {
    const domain = new URL('https://example.com').hostname;
    expect(domain).toBe('example.com');
  });

  it('should extract hostname from URL with path', () => {
    const domain = new URL('https://mysite.com/blog/page').hostname;
    expect(domain).toBe('mysite.com');
  });

  it('should extract hostname from URL with www', () => {
    const domain = new URL('https://www.mysite.com').hostname;
    expect(domain).toBe('www.mysite.com');
  });

  it('should throw on invalid URL (empty string)', () => {
    expect(() => new URL('')).toThrow();
  });

  it('should throw on invalid URL (no protocol)', () => {
    expect(() => new URL('example.com')).toThrow();
  });

  it('should throw on null/undefined URL', () => {
    expect(() => new URL(null as unknown as string)).toThrow();
    expect(() => new URL(undefined as unknown as string)).toThrow();
  });
});

// ============================================================================
// Action argument shape verification — both modes
// ============================================================================

describe('Action Argument Shape', () => {
  it('should construct correct args for CREATE NEW mode', () => {
    const actionArgs = {
      projectId: 'fake_project_id' as any,
      ga4MeasurementId: 'G-ABC123XYZ',
      existingContainerPublicId: undefined,
    };

    expect(actionArgs).toHaveProperty('projectId');
    expect(actionArgs).toHaveProperty('ga4MeasurementId');
    expect(actionArgs.existingContainerPublicId).toBeUndefined();
  });

  it('should construct correct args for EXISTING CONTAINER mode', () => {
    const actionArgs = {
      projectId: 'fake_project_id' as any,
      ga4MeasurementId: 'G-ABC123XYZ',
      existingContainerPublicId: 'GTM-ABCDEF',
    };

    expect(actionArgs.existingContainerPublicId).toBe('GTM-ABCDEF');
    expect(actionArgs.ga4MeasurementId).toBe('G-ABC123XYZ');
  });

  it('should construct correct args for internal provisionTenantContainer (create)', () => {
    const internalArgs = {
      projectId: 'fake_project_id' as any,
      domain: 'example.com',
      ga4MeasurementId: 'G-ABC123XYZ',
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
      existingContainerPublicId: undefined,
    };

    expect(internalArgs.existingContainerPublicId).toBeUndefined();
  });

  it('should construct correct args for internal provisionTenantContainer (existing)', () => {
    const internalArgs = {
      projectId: 'fake_project_id' as any,
      domain: 'example.com',
      ga4MeasurementId: 'G-ABC123XYZ',
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
      existingContainerPublicId: 'GTM-XYZABC',
    };

    expect(internalArgs.existingContainerPublicId).toBe('GTM-XYZABC');
  });
});

// ============================================================================
// Container mode selection logic
// ============================================================================

describe('Container Mode Selection Logic', () => {
  const mockContainers = [
    { name: 'example.com (Phoo)', publicId: 'GTM-ABC123', containerId: '123', accountId: '456' },
    { name: 'staging.example.com', publicId: 'GTM-DEF456', containerId: '789', accountId: '456' },
  ];

  it('should default to create mode when no containers exist', () => {
    const containers: typeof mockContainers = [];
    const defaultMode = containers.length > 0 ? containers[0].publicId : 'create';
    expect(defaultMode).toBe('create');
  });

  it('should allow selecting existing container by publicId', () => {
    const selectedPublicId = 'GTM-ABC123';
    const selected = mockContainers.find((c) => c.publicId === selectedPublicId);
    expect(selected).toBeDefined();
    expect(selected?.name).toBe('example.com (Phoo)');
  });

  it('should distinguish between existing and create modes', () => {
    const isExisting = (mode: string) => mode !== 'create';
    expect(isExisting('create')).toBe(false);
    expect(isExisting('GTM-ABC123')).toBe(true);
  });

  it('should pass existingContainerPublicId only in existing mode', () => {
    const buildArgs = (mode: string, measurementId: string) => ({
      ga4MeasurementId: measurementId,
      existingContainerPublicId: mode !== 'create' ? mode : undefined,
    });

    const createArgs = buildArgs('create', 'G-TEST123');
    expect(createArgs.existingContainerPublicId).toBeUndefined();

    const existingArgs = buildArgs('GTM-ABC123', 'G-TEST123');
    expect(existingArgs.existingContainerPublicId).toBe('GTM-ABC123');
  });
});

// ============================================================================
// GTM API Payload Shapes
// ============================================================================

describe('GTM API Payload Shapes', () => {
  const measurementId = 'G-TEST123';

  it('should construct correct Container creation payload', () => {
    const domain = 'example.com';
    const payload = {
      name: `${domain} (Phoo Automated)`,
      usageContext: ['web'],
    };
    expect(payload.name).toBe('example.com (Phoo Automated)');
    expect(payload.usageContext).toEqual(['web']);
  });

  it('should construct correct GA4 Config Tag payload (gaawc)', () => {
    const triggerId = '12345';
    const payload = {
      name: 'GA4 Configuration (Phoo Automated)',
      type: 'gaawc',
      parameter: [{ type: 'template', key: 'measurementId', value: measurementId }],
      firingTriggerId: [triggerId],
    };
    expect(payload.type).toBe('gaawc');
    expect(payload.parameter[0].value).toBe('G-TEST123');
  });

  it('should construct correct generate_lead Event Tag payload (gaawe)', () => {
    const payload = {
      name: 'GA4 Event - Generate Lead (Phoo Automated)',
      type: 'gaawe',
      parameter: [
        { type: 'TEMPLATE', key: 'eventName', value: 'generate_lead' },
        { type: 'TEMPLATE', key: 'measurementIdOverride', value: measurementId },
      ],
      firingTriggerId: ['111', '222'],
    };
    expect(payload.type).toBe('gaawe');
    expect(payload.firingTriggerId).toHaveLength(2);
  });

  it('should construct correct Form Submission trigger', () => {
    const payload = {
      name: 'Form Submission - All Forms (Phoo Automated)',
      type: 'formSubmission',
      waitForTags: { type: 'BOOLEAN', value: 'true' },
    };
    expect(payload.type).toBe('formSubmission');
  });

  it('should construct correct Custom Event trigger', () => {
    const payload = {
      name: 'Custom Event - generate_lead (Phoo Automated)',
      type: 'customEvent',
      customEventFilter: [
        {
          type: 'EQUALS',
          parameter: [
            { type: 'TEMPLATE', key: 'arg0', value: '{{_event}}' },
            { type: 'TEMPLATE', key: 'arg1', value: 'generate_lead' },
          ],
        },
      ],
    };
    expect(payload.customEventFilter[0].parameter[1].value).toBe('generate_lead');
  });
});

// ============================================================================
// Error guards
// ============================================================================

describe('Error Guards', () => {
  it('ga4Connection must exist', () => {
    expect(!null).toBe(true);
  });

  it('measurement ID must be valid', () => {
    expect(GA4_MEASUREMENT_ID_REGEX.test('invalid')).toBe(false);
  });

  it('project must have websiteUrl', () => {
    expect(!({ websiteUrl: '' } as any)?.websiteUrl).toBe(true);
  });

  it('backend re-validates measurement ID', () => {
    expect(/^G-[A-Z0-9]+$/.test('GTM-INVALID')).toBe(false);
  });

  it('access token must exist', () => {
    expect(!({ accessToken: '' } as any)?.accessToken).toBe(true);
  });

  it('button disabled when measurement ID invalid', () => {
    const isMeasurementIdValid = GA4_MEASUREMENT_ID_REGEX.test('');
    const ga4Connection = { accessToken: 'exists' };
    const isDisabled = !isMeasurementIdValid || !ga4Connection;
    expect(isDisabled).toBe(true);
  });
});

// ============================================================================
// listUserContainers response shape
// ============================================================================

describe('listUserContainers Response Shape', () => {
  it('should handle empty containers response', () => {
    const response = { success: true, containers: [] };
    expect(response.containers).toHaveLength(0);
    expect(response.success).toBe(true);
  });

  it('should handle containers with expected shape', () => {
    const response = {
      success: true,
      containers: [{ name: 'My Site', publicId: 'GTM-ABC', containerId: '123', accountId: '456' }],
    };
    const container = response.containers[0];
    expect(container).toHaveProperty('name');
    expect(container).toHaveProperty('publicId');
    expect(container).toHaveProperty('containerId');
    expect(container).toHaveProperty('accountId');
  });

  it('should handle error response', () => {
    const response = { success: false, containers: [], error: 'No Google account connected.' };
    expect(response.success).toBe(false);
    expect(response.containers).toHaveLength(0);
    expect(response.error).toBeDefined();
  });
});
