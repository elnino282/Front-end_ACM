import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCreateIrrigationWaterAnalysis } from './hooks';

const httpMocks = vi.hoisted(() => ({
  post: vi.fn(),
}));

vi.mock('@/shared/api/http', () => ({
  default: {
    post: httpMocks.post,
  },
}));

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

describe('irrigation-water-analysis mutation flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('invalidates dedicated list and dashboard query groups after create success', async () => {
    httpMocks.post.mockResolvedValueOnce({
      data: {
        status: 200,
        code: 'SUCCESS',
        message: 'OK',
        result: {
          id: 1,
          seasonId: 33,
          plotId: 22,
          sampleDate: '2026-03-18',
          nitrateMgPerL: 4.2,
          ammoniumMgPerL: 1.8,
          totalNmgPerL: null,
          effectiveNmgPerL: 6,
          concentrationUnit: 'mg_n_per_l',
          irrigationVolumeM3: 500,
          volumeUnit: 'm3',
          estimatedNContributionKg: 3,
          contributionUnit: 'kg_n',
          measured: true,
          status: 'measured',
          sourceType: 'lab_measured',
          sourceDocument: null,
          labReference: null,
          note: null,
          createdByUserId: 7,
          createdAt: '2026-03-18T09:00:00',
        },
      },
    });

    const queryClient = createQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCreateIrrigationWaterAnalysis(33), { wrapper });

    await result.current.mutateAsync({
      plotId: 22,
      sampleDate: '2026-03-18',
      nitrateMgPerL: 4.2,
      ammoniumMgPerL: 1.8,
      irrigationVolumeM3: 500,
      sourceType: 'lab_measured',
    });

    expect(httpMocks.post).toHaveBeenCalledWith('/api/v1/seasons/33/irrigation-water-analyses', {
      plotId: 22,
      sampleDate: '2026-03-18',
      nitrateMgPerL: 4.2,
      ammoniumMgPerL: 1.8,
      irrigationVolumeM3: 500,
      sourceType: 'lab_measured',
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['irrigation-water-analysis', 'list', 'season', 33],
      exact: false,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['dashboard', 'sustainability-overview'],
      exact: false,
    });
  });
});
