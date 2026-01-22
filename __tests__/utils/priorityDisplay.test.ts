/**
 * Priority Display Utilities Tests
 *
 * Unit tests for the priority display helper following Kent's Testing Trophy.
 * Tests user-facing outcomes (display labels, colors) not implementation details.
 */

import { describe, it, expect } from 'vitest';
import {
  getPriorityDisplay,
  getPriorityLabel,
  PRIORITY_CONFIG,
  PRIORITY_OPTIONS,
  PRIORITY_FORM_OPTIONS,
  type PriorityCode,
} from '../../lib/utils/priorityDisplay';

describe('getPriorityDisplay', () => {
  it('returns Urgent config for P0', () => {
    const result = getPriorityDisplay('P0');
    expect(result.label).toBe('Urgent');
    expect(result.color).toBe('#EF4444');
  });

  it('returns High config for P1', () => {
    const result = getPriorityDisplay('P1');
    expect(result.label).toBe('High');
    expect(result.color).toBe('#FF9D00');
  });

  it('returns Normal config for P2', () => {
    const result = getPriorityDisplay('P2');
    expect(result.label).toBe('Normal');
    expect(result.color).toBe('#3B82F6');
  });

  it('returns Low config for undefined priority', () => {
    const result = getPriorityDisplay(undefined);
    expect(result.label).toBe('Low');
    expect(result.color).toBe('#6B7280');
  });

  it('returns Low config for unknown priority value', () => {
    // Testing edge case: unknown priority string
    const result = getPriorityDisplay('P99' as PriorityCode);
    expect(result.label).toBe('Low');
  });
});

describe('getPriorityLabel', () => {
  it('returns human-readable label for each priority', () => {
    expect(getPriorityLabel('P0')).toBe('Urgent');
    expect(getPriorityLabel('P1')).toBe('High');
    expect(getPriorityLabel('P2')).toBe('Normal');
    expect(getPriorityLabel(undefined)).toBe('Low');
  });
});

describe('PRIORITY_OPTIONS', () => {
  it('contains all priority levels plus "all" filter option', () => {
    expect(PRIORITY_OPTIONS).toHaveLength(4);
    expect(PRIORITY_OPTIONS[0].value).toBe('all');
    expect(PRIORITY_OPTIONS[1].label).toBe('Urgent');
    expect(PRIORITY_OPTIONS[2].label).toBe('High');
    expect(PRIORITY_OPTIONS[3].label).toBe('Normal');
  });
});

describe('PRIORITY_FORM_OPTIONS', () => {
  it('contains priority levels without "all" option', () => {
    expect(PRIORITY_FORM_OPTIONS).toHaveLength(3);
    const values = PRIORITY_FORM_OPTIONS.map((o: { value: string }) => o.value);
    expect(values).not.toContain('all');
  });
});

describe('PRIORITY_CONFIG', () => {
  it('has consistent color format (hex codes)', () => {
    const configs = Object.values(PRIORITY_CONFIG) as Array<{
      color: string;
      bgColor: string;
      borderColor: string;
    }>;
    configs.forEach((config) => {
      expect(config.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('has background and border colors with alpha channel', () => {
    const configs = Object.values(PRIORITY_CONFIG) as Array<{
      color: string;
      bgColor: string;
      borderColor: string;
    }>;
    configs.forEach((config) => {
      expect(config.bgColor).toMatch(/^rgba\(/);
      expect(config.borderColor).toMatch(/^rgba\(/);
    });
  });
});
