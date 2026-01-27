import { z } from "zod";

export const SearchEntityTypeSchema = z.enum([
  "PLOT",
  "SEASON",
  "TASK",
  "EXPENSE",
  "DOCUMENT",
  "FARM",
  "USER",
]);

export const SearchResultItemSchema = z.object({
  type: SearchEntityTypeSchema,
  id: z.union([z.string(), z.number()]).nullable().optional(),
  title: z.string(),
  subtitle: z.string().nullable().optional(),
  route: z.string().nullable().optional(),
  extra: z.record(z.any()).nullable().optional(),
});

export const SearchResponseSchema = z.object({
  q: z.string(),
  limit: z.number().int(),
  results: z.array(SearchResultItemSchema),
  grouped: z.record(z.number().int()),
});
