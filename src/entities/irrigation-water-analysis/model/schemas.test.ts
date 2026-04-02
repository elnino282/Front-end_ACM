import { describe, expect, it } from 'vitest';
import {
  CreateIrrigationWaterAnalysisRequestSchema,
  IrrigationWaterAnalysisResponseSchema,
} from './schemas';

describe('irrigation-water-analysis schemas', () => {
  it('parses valid create request payload', () => {
    const parsed = CreateIrrigationWaterAnalysisRequestSchema.parse({
      plotId: 22,
      sampleDate: '2026-03-18',
      nitrateMgPerL: 4.2,
      ammoniumMgPerL: 1.8,
      irrigationVolumeM3: 500,
      sourceType: 'lab_measured',
    });

    expect(parsed.plotId).toBe(22);
    expect(parsed.nitrateMgPerL).toBe(4.2);
  });

  it('fails create request when concentration fields are all missing', () => {
    const result = CreateIrrigationWaterAnalysisRequestSchema.safeParse({
      plotId: 22,
      sampleDate: '2026-03-18',
      irrigationVolumeM3: 500,
      sourceType: 'lab_measured',
    });

    expect(result.success).toBe(false);
  });

  it('keeps null contribution as null instead of coercing to zero', () => {
    const parsed = IrrigationWaterAnalysisResponseSchema.parse({
      id: 1,
      seasonId: 33,
      plotId: 22,
      sampleDate: '2026-03-18',
      nitrateMgPerL: null,
      ammoniumMgPerL: null,
      totalNmgPerL: null,
      effectiveNmgPerL: null,
      concentrationUnit: 'mg_n_per_l',
      irrigationVolumeM3: 500,
      volumeUnit: 'm3',
      estimatedNContributionKg: null,
      contributionUnit: 'kg_n',
      measured: true,
      status: 'measured',
      sourceType: 'lab_measured',
      sourceDocument: null,
      labReference: null,
      note: null,
      createdByUserId: 7,
      createdAt: '2026-03-18T09:00:00',
    });

    expect(parsed.estimatedNContributionKg).toBeNull();
  });
});
