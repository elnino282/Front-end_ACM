import { describe, expect, it } from 'vitest';
import {
  DashboardFdnOverviewSchema,
  DashboardFieldMapResponseSchema,
  DashboardFieldRecommendationSchema,
} from './schemas';

function baseMetric(status: 'measured' | 'estimated' | 'missing' | 'unavailable', value: number | null) {
  return {
    value,
    unit: '%',
    status,
    confidence: 0.72,
    calculationMode: 'hybrid_estimated',
    assumptions: ['rule-based input interpolation'],
    missingInputs: [],
  };
}

function overviewPayload() {
  return {
    scope: 'field',
    entityId: '22',
    seasonId: 33,
    calculationMode: 'hybrid_estimated',
    confidence: 0.72,
    sustainableScore: {
      value: 64,
      label: 'Fair',
      components: { dependency: 28 },
      weights: { dependency: 0.3 },
    },
    fdn: {
      total: 72,
      mineral: 60,
      organic: 12,
      level: 'high',
      status: 'estimated',
      thresholdSource: 'config_default_v1',
      lowMaxExclusive: 40,
      mediumMaxExclusive: 70,
      mineralHighMin: 60,
      explanation: 'FDN is above configured medium threshold (70%).',
    },
    nue: 43,
    nOutput: 41,
    nSurplus: 36,
    currentSeason: {
      seasonName: 'Mùa 33',
      cropName: 'Lúa',
      dayCount: 55,
      stage: 'ACTIVE',
    },
    yield: {
      estimated: 6.2,
      unit: 't/ha',
    },
    inputsBreakdown: {
      mineralFertilizerN: 60,
      organicFertilizerN: 12,
      biologicalFixationN: 8,
      irrigationWaterN: 6,
      atmosphericDepositionN: 5,
      seedImportN: 0,
      soilLegacyN: 0,
      controlSupplyN: null,
    },
    unit: 'kg N/ha/season',
    dataQuality: [
      {
        source: 'MINERAL_FERTILIZER',
        method: 'measured',
        confidence: 1,
      },
    ],
    dataQualitySummary: {
      overallConfidence: 0.72,
      measuredInputCount: 1,
      estimatedInputCount: 3,
      missingInputCount: 1,
      unavailableInputCount: 0,
      summary: 'Overall confidence 72%; 1 measured, 3 estimated/mixed, 1 missing inputs.',
    },
    missingInputs: ['CONTROL_SUPPLY'],
    notes: ['Sample note'],
    recommendations: ['Measure irrigation-water nitrogen before reducing mineral nitrogen.'],
    recommendationSource: 'product_rule_config_v1',
    sustainableScoreMetric: baseMetric('estimated', 64),
    fdnTotalMetric: baseMetric('estimated', 72),
    fdnMineralMetric: baseMetric('measured', 0),
    fdnOrganicMetric: baseMetric('estimated', 12),
    nueMetric: baseMetric('estimated', 43),
    nOutputMetric: { ...baseMetric('missing', null), unit: 'kg N/ha/season' },
    nSurplusMetric: { ...baseMetric('missing', null), unit: 'kg N/ha/season' },
    estimatedYieldMetric: { ...baseMetric('missing', null), unit: 't/ha' },
    historicalTrend: [],
  };
}

describe('DashboardFdnOverviewSchema', () => {
  it('keeps true zero as 0 for measured metric', () => {
    const parsed = DashboardFdnOverviewSchema.parse(overviewPayload());
    expect(parsed.fdnMineralMetric.status).toBe('measured');
    expect(parsed.fdnMineralMetric.value).toBe(0);
  });

  it('keeps missing/unavailable values as null instead of coercing to 0', () => {
    const parsed = DashboardFdnOverviewSchema.parse(overviewPayload());
    expect(parsed.nOutputMetric.status).toBe('missing');
    expect(parsed.nOutputMetric.value).toBeNull();
    expect(parsed.nSurplusMetric.value).toBeNull();
    expect(parsed.estimatedYieldMetric.value).toBeNull();
  });

  it('requires semantic metric wrappers and fails when wrapper is omitted', () => {
    const payload = overviewPayload();
    // @ts-expect-error test invalid payload on purpose
    delete payload.nSurplusMetric;
    const result = DashboardFdnOverviewSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('requires map metadata fields to avoid frontend semantic guessing', () => {
    const result = DashboardFieldMapResponseSchema.safeParse({
      items: [
        {
          fieldId: 22,
          fieldName: 'Field A',
          farmId: 7,
          farmName: 'Farm 7',
          geometry: null,
          center: null,
          cropName: 'Lua',
          seasonName: 'Mua 33',
          fdnLevel: 'high',
          fdnTotal: null,
          fdnMineral: null,
          fdnOrganic: null,
          nue: null,
          confidence: 0.55,
          calculationMode: 'hybrid_estimated',
          thresholdSource: 'config_default_v1',
          recommendationSource: 'product_rule_config_v1',
          missingInputs: ['MINERAL_FERTILIZER'],
          inputsBreakdown: {
            mineralFertilizerN: null,
            organicFertilizerN: null,
            biologicalFixationN: null,
            irrigationWaterN: null,
            atmosphericDepositionN: null,
            seedImportN: null,
            soilLegacyN: null,
            controlSupplyN: null,
          },
          recommendations: [],
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('fails map payload when threshold/recommendation source metadata is missing', () => {
    const invalid = {
      items: [
        {
          fieldId: 22,
          fieldName: 'Field A',
          farmId: 7,
          farmName: 'Farm 7',
          geometry: null,
          center: null,
          cropName: 'Lua',
          seasonName: 'Mua 33',
          fdnLevel: 'high',
          fdnTotal: null,
          fdnMineral: null,
          fdnOrganic: null,
          nue: null,
          confidence: 0.55,
          calculationMode: 'hybrid_estimated',
          missingInputs: [],
          inputsBreakdown: {
            mineralFertilizerN: null,
            organicFertilizerN: null,
            biologicalFixationN: null,
            irrigationWaterN: null,
            atmosphericDepositionN: null,
            seedImportN: null,
            soilLegacyN: null,
            controlSupplyN: null,
          },
          recommendations: [],
        },
      ],
    };
    const result = DashboardFieldMapResponseSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('fails recommendation payload when source metadata is missing', () => {
    const payload = {
      fieldId: 22,
      seasonId: 33,
      fdnTotal: 72,
      fdnMineral: 60,
      nue: 43,
      confidence: 0.72,
      recommendations: ['Measure irrigation-water nitrogen before changing mineral inputs.'],
    };
    const result = DashboardFieldRecommendationSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
