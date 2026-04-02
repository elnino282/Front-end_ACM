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

const PercentSchema = z.preprocess((value) => {
  if (value === null || value === undefined || value === '') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : value;
  }
  return value;
}, z.number().min(0).max(100));

export const SoilTestSourceTypeSchema = z.enum([
  'user_entered',
  'lab_measured',
  'system_estimated',
  'external_reference',
  'default_reference',
]);

export const CreateSoilTestRequestSchema = z.object({
  plotId: z.number().int().positive(),
  sampleDate: DateSchema,
  soilOrganicMatterPct: PercentSchema.optional(),
  mineralNKgPerHa: NonNegativeNumericSchema,
  nitrateMgPerKg: NonNegativeNumericSchema.optional(),
  ammoniumMgPerKg: NonNegativeNumericSchema.optional(),
  sourceType: SoilTestSourceTypeSchema,
  sourceDocument: z.string().trim().max(255).optional(),
  labReference: z.string().trim().max(255).optional(),
  note: z.string().trim().max(4000).optional(),
});

export const SoilTestResponseSchema = z.object({
  id: z.number().int().positive(),
  seasonId: z.number().int().positive(),
  plotId: z.number().int().positive(),
  plotName: z.string().nullable().optional(),
  sampleDate: DateSchema,
  soilOrganicMatterPct: NumericSchema.nullable().optional(),
  mineralNKgPerHa: NumericSchema,
  nitrateMgPerKg: NumericSchema.nullable().optional(),
  ammoniumMgPerKg: NumericSchema.nullable().optional(),
  mineralNUnit: z.string().nullable().optional(),
  concentrationUnit: z.string().nullable().optional(),
  estimatedNContributionKg: NumericSchema.nullable().optional(),
  contributionUnit: z.string().nullable().optional(),
  measured: z.boolean().nullable().optional(),
  status: z.enum(['measured', 'estimated']),
  sourceType: SoilTestSourceTypeSchema.nullable().optional(),
  sourceDocument: z.string().nullable().optional(),
  labReference: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  legacyDerived: z.boolean().nullable().optional(),
  migratedFromLegacyEventId: z.number().int().nullable().optional(),
  createdByUserId: z.number().int().nullable().optional(),
  createdAt: z.string().nullable().optional(),
});

export const SoilTestListQuerySchema = z.object({
  plotId: z.number().int().positive().optional(),
});

export type SoilTestSourceType = z.infer<typeof SoilTestSourceTypeSchema>;
export type CreateSoilTestRequest = z.infer<typeof CreateSoilTestRequestSchema>;
export type SoilTestResponse = z.infer<typeof SoilTestResponseSchema>;
export type SoilTestListQuery = z.infer<typeof SoilTestListQuerySchema>;
