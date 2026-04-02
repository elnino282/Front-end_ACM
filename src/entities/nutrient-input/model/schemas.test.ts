import { describe, expect, it } from 'vitest';
import {
  CreateNutrientInputRequestSchema,
  NutrientInputResponseSchema,
} from './schemas';

describe('nutrient-input schemas', () => {
  it('rejects deprecated legacy authoring sources in create request', () => {
    expect(() =>
      CreateNutrientInputRequestSchema.parse({
        plotId: 22,
        inputSource: 'IRRIGATION_WATER',
        value: 5,
        unit: 'kg_n',
        recordedAt: '2026-03-18',
        sourceType: 'user_entered',
      })
    ).toThrow();

    expect(() =>
      CreateNutrientInputRequestSchema.parse({
        plotId: 22,
        inputSource: 'SOIL_LEGACY',
        value: 3,
        unit: 'kg_n',
        recordedAt: '2026-03-18',
        sourceType: 'user_entered',
      })
    ).toThrow();
  });

  it('keeps backward compatibility when parsing legacy records from response', () => {
    const parsed = NutrientInputResponseSchema.parse({
      id: 100,
      seasonId: 33,
      plotId: 22,
      plotName: 'Plot A',
      inputSource: 'IRRIGATION_WATER',
      value: 4.5,
      unit: 'kg_n',
      normalizedNKg: 4.5,
      recordedAt: '2026-03-01',
      measured: false,
      status: 'estimated',
      sourceType: 'system_estimated',
      sourceDocument: null,
      note: 'Legacy aggregate record',
      legacyDerived: false,
      migratedFromLegacyEventId: null,
      createdByUserId: 7,
      createdAt: '2026-03-01T08:00:00',
    });

    expect(parsed.inputSource).toBe('IRRIGATION_WATER');
    expect(parsed.status).toBe('estimated');
  });
});
