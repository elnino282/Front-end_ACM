import { describe, expect, it } from 'vitest';
import { formatMetricValue } from './metrics';

describe('formatMetricValue', () => {
  it('returns null for missing/unavailable metrics', () => {
    expect(
      formatMetricValue({
        value: 0,
        unit: '%',
        status: 'missing',
        confidence: 0.2,
        calculationMode: 'hybrid_estimated',
        assumptions: [],
        missingInputs: ['HARVEST_OUTPUT'],
      })
    ).toBeNull();
  });

  it('keeps true zero for measured metrics', () => {
    expect(
      formatMetricValue({
        value: 0,
        unit: '%',
        status: 'measured',
        confidence: 1,
        calculationMode: 'explicit_budget',
        assumptions: [],
        missingInputs: [],
      }, 1)
    ).toBe('0.0');
  });
});
