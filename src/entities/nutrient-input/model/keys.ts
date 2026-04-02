import type { NutrientInputListQuery } from './types';

export const nutrientInputKeys = {
  all: ['nutrient-input'] as const,
  lists: () => [...nutrientInputKeys.all, 'list'] as const,
  listBySeasonBase: (seasonId: number) =>
    [...nutrientInputKeys.lists(), 'season', seasonId] as const,
  listBySeason: (seasonId: number, params?: NutrientInputListQuery) =>
    [...nutrientInputKeys.lists(), 'season', seasonId, params] as const,
};

