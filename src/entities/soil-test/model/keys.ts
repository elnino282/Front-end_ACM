import type { SoilTestListQuery } from './types';

export const soilTestKeys = {
  all: ['soil-test'] as const,
  lists: () => [...soilTestKeys.all, 'list'] as const,
  listBySeasonBase: (seasonId: number) => [...soilTestKeys.lists(), 'season', seasonId] as const,
  listBySeason: (seasonId: number, params?: SoilTestListQuery) =>
    [...soilTestKeys.lists(), 'season', seasonId, params] as const,
};
