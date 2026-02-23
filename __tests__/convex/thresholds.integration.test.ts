import { describe, it, expect } from 'vitest';
import { THRESHOLDS } from '../../convex/config/thresholds';

describe('Thresholds Config', () => {
  it('should define required threshold structures', () => {
    expect(THRESHOLDS).toBeDefined();
    expect(THRESHOLDS.mr.tiers).toBeDefined();
    expect(THRESHOLDS.content.defaultVelocity).toBe(2);
  });
});
