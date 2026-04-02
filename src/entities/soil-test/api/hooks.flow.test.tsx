import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCreateSoilTest } from './hooks';

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

describe('soil-test mutation flow', () => {
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
          soilOrganicMatterPct: 2.1,
          mineralNKgPerHa: 14.5,
          nitrateMgPerKg: null,
          ammoniumMgPerKg: null,
          mineralNUnit: 'kg_n_per_ha',
          concentrationUnit: 'mg_per_kg',
          estimatedNContributionKg: 29,
          contributionUnit: 'kg_n',
          measured: true,
          status: 'measured',
          sourceType: 'lab_measured',
          sourceDocument: null,
          labReference: null,
          note: null,
          createdByUserId: 7,
          createdAt: '2026-03-18T09:10:00',
        },
      },
    });

    const queryClient = createQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCreateSoilTest(33), { wrapper });

    await result.current.mutateAsync({
      plotId: 22,
      sampleDate: '2026-03-18',
      mineralNKgPerHa: 14.5,
      sourceType: 'lab_measured',
    });

    expect(httpMocks.post).toHaveBeenCalledWith('/api/v1/seasons/33/soil-tests', {
      plotId: 22,
      sampleDate: '2026-03-18',
      mineralNKgPerHa: 14.5,
      sourceType: 'lab_measured',
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['soil-test', 'list', 'season', 33],
      exact: false,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['dashboard', 'sustainability-overview'],
      exact: false,
    });
  });
});
