import { z } from 'zod';
import { DateSchema } from '@/shared/api/types';

const NumericSchema = z.preprocess((value) => {
  if (value === null || value === undefined || value === '') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : value;
  }
  return value;
}, z.number());

const NonNegativeNumericSchema = z.preprocess((value) => {
  if (value === null || value === undefined || value === '') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : value;
  }
  return value;
}, z.number().min(0));

export const IrrigationSourceTypeSchema = z.enum([
  'user_entered',
  'lab_measured',
  'system_estimated',
  'external_reference',
  'default_reference',
]);

export const CreateIrrigationWaterAnalysisRequestSchema = z
  .object({
    plotId: z.number().int().positive(),
    sampleDate: DateSchema,
    nitrateMgPerL: NonNegativeNumericSchema.optional(),
    ammoniumMgPerL: NonNegativeNumericSchema.optional(),
    totalNmgPerL: NonNegativeNumericSchema.optional(),
    irrigationVolumeM3: NonNegativeNumericSchema,
    sourceType: IrrigationSourceTypeSchema,
    sourceDocument: z.string().trim().max(255).optional(),
    labReference: z.string().trim().max(255).optional(),
    note: z.string().trim().max(4000).optional(),
  })
  .superRefine((value, ctx) => {
    if (
      value.totalNmgPerL === undefined &&
      value.nitrateMgPerL === undefined &&
      value.ammoniumMgPerL === undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one concentration field is required',
        path: ['totalNmgPerL'],
      });
    }
  });

export const IrrigationWaterAnalysisResponseSchema = z.object({
  id: z.number().int().positive(),
  seasonId: z.number().int().positive(),
  plotId: z.number().int().positive(),
  plotName: z.string().nullable().optional(),
  sampleDate: DateSchema,
  nitrateMgPerL: NumericSchema.nullable().optional(),
  ammoniumMgPerL: NumericSchema.nullable().optional(),
  totalNmgPerL: NumericSchema.nullable().optional(),
  effectiveNmgPerL: NumericSchema.nullable().optional(),
  concentrationUnit: z.string().nullable().optional(),
  irrigationVolumeM3: NumericSchema,
  volumeUnit: z.string().nullable().optional(),
  estimatedNContributionKg: NumericSchema.nullable().optional(),
  contributionUnit: z.string().nullable().optional(),
  measured: z.boolean().nullable().optional(),
  status: z.enum(['measured', 'estimated']),
  sourceType: IrrigationSourceTypeSchema.nullable().optional(),
  sourceDocument: z.string().nullable().optional(),
  labReference: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  legacyDerived: z.boolean().nullable().optional(),
  migratedFromLegacyEventId: z.number().int().nullable().optional(),
  createdByUserId: z.number().int().nullable().optional(),
  createdAt: z.string().nullable().optional(),
});

export const IrrigationWaterAnalysisListQuerySchema = z.object({
  plotId: z.number().int().positive().optional(),
});

export type IrrigationSourceType = z.infer<typeof IrrigationSourceTypeSchema>;
export type CreateIrrigationWaterAnalysisRequest = z.infer<
  typeof CreateIrrigationWaterAnalysisRequestSchema
>;
export type IrrigationWaterAnalysisResponse = z.infer<
  typeof IrrigationWaterAnalysisResponseSchema
>;
export type IrrigationWaterAnalysisListQuery = z.infer<
  typeof IrrigationWaterAnalysisListQuerySchema
>;
