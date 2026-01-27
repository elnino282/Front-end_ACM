import { z } from 'zod';

export const CurrencyCodeSchema = z.enum(['VND', 'USD']);
export const WeightUnitSchema = z.enum(['KG', 'G', 'TON']);

export const PreferencesSchema = z.object({
    currency: CurrencyCodeSchema,
    weightUnit: WeightUnitSchema,
    locale: z.string(),
});

export const PreferencesUpdateRequestSchema = z.object({
    currency: CurrencyCodeSchema.optional(),
    weightUnit: WeightUnitSchema.optional(),
    locale: z.string().optional(),
});

export type CurrencyCode = z.infer<typeof CurrencyCodeSchema>;
export type WeightUnit = z.infer<typeof WeightUnitSchema>;
export type Preferences = z.infer<typeof PreferencesSchema>;
export type PreferencesUpdateRequest = z.infer<typeof PreferencesUpdateRequestSchema>;
