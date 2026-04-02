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

export const NutrientInputSourceSchema = z.enum([
  'MINERAL_FERTILIZER',
  'ORGANIC_FERTILIZER',
  'BIOLOGICAL_FIXATION',
  'IRRIGATION_WATER',
  'ATMOSPHERIC_DEPOSITION',
  'SEED_IMPORT',
  'SOIL_LEGACY',
  'CONTROL_SUPPLY',
]);

export const NutrientInputAuthoringSourceSchema = z.enum([
  'MINERAL_FERTILIZER',
  'ORGANIC_FERTILIZER',
]);

export const NutrientInputSourceTypeSchema = z.enum([
  'user_entered',
  'lab_measured',
  'system_estimated',
  'external_reference',
  'default_reference',
]);

export const NutrientInputUnitSchema = z.enum(['kg_n', 'kg_n_per_ha']);

export const CreateNutrientInputRequestSchema = z.object({
  plotId: z.number().int().positive(),
  inputSource: NutrientInputAuthoringSourceSchema,
  value: z.preprocess((value) => {
    if (value === null || value === undefined || value === '') {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : value;
    }
    return value;
  }, z.number().min(0)),
  unit: NutrientInputUnitSchema,
  recordedAt: DateSchema,
  sourceType: NutrientInputSourceTypeSchema,
  sourceDocument: z.string().trim().max(255).optional(),
  note: z.string().trim().max(4000).optional(),
});

export const NutrientInputResponseSchema = z.object({
  id: z.number().int().positive(),
  seasonId: z.number().int().positive(),
  plotId: z.number().int().positive(),
  plotName: z.string().nullable().optional(),
  inputSource: NutrientInputSourceSchema,
  value: NumericSchema,
  unit: z.string(),
  normalizedNKg: NumericSchema,
  recordedAt: DateSchema,
  measured: z.boolean().nullable().optional(),
  status: z.enum(['measured', 'estimated']),
  sourceType: NutrientInputSourceTypeSchema.nullable().optional(),
  sourceDocument: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  legacyDerived: z.boolean().nullable().optional(),
  migratedFromLegacyEventId: z.number().int().nullable().optional(),
  createdByUserId: z.number().int().nullable().optional(),
  createdAt: z.string().nullable().optional(),
});

export const NutrientInputListQuerySchema = z.object({
  plotId: z.number().int().positive().optional(),
  source: NutrientInputSourceSchema.optional(),
});

export type NutrientInputSource = z.infer<typeof NutrientInputSourceSchema>;
export type NutrientInputAuthoringSource = z.infer<typeof NutrientInputAuthoringSourceSchema>;
export type NutrientInputSourceType = z.infer<typeof NutrientInputSourceTypeSchema>;
export type NutrientInputUnit = z.infer<typeof NutrientInputUnitSchema>;
export type CreateNutrientInputRequest = z.infer<typeof CreateNutrientInputRequestSchema>;
export type NutrientInputResponse = z.infer<typeof NutrientInputResponseSchema>;
export type NutrientInputListQuery = z.infer<typeof NutrientInputListQuerySchema>;
