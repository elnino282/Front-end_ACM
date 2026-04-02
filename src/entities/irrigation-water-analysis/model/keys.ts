import type { IrrigationWaterAnalysisListQuery } from './types';

export const irrigationWaterAnalysisKeys = {
  all: ['irrigation-water-analysis'] as const,
  lists: () => [...irrigationWaterAnalysisKeys.all, 'list'] as const,
  listBySeasonBase: (seasonId: number) =>
    [...irrigationWaterAnalysisKeys.lists(), 'season', seasonId] as const,
  listBySeason: (seasonId: number, params?: IrrigationWaterAnalysisListQuery) =>
    [...irrigationWaterAnalysisKeys.lists(), 'season', seasonId, params] as const,
};
