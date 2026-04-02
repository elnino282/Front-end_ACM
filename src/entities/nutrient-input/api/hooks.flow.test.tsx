import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import overviewFixture from '@/entities/dashboard/api/__fixtures__/sustainability-overview.success.json';
import { useDashboardFdnOverview } from '@/entities/dashboard';
import { useCreateNutrientInput } from './hooks';

const httpMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock('@/shared/api/http', () => ({
  default: {
    get: httpMocks.get,
    post: httpMocks.post,
  },
}));

const createResponse = {
  status: 200,
  code: 'SUCCESS',
  message: 'OK',
  result: {
    id: 1,
    seasonId: 33,
    plotId: 22,
    plotName: 'Plot A',
    inputSource: 'MINERAL_FERTILIZER',
    value: 28.5,
    unit: 'kg_n',
    normalizedNKg: 28.5,
    recordedAt: '2026-03-17',
    measured: true,
    status: 'measured',
    sourceType: 'lab_measured',
    sourceDocument: null,
    note: null,
    createdByUserId: 7,
    createdAt: '2026-03-17T08:30:00',
  },
};

const createPayload = {
  plotId: 22,
  inputSource: 'MINERAL_FERTILIZER' as const,
  value: 28.5,
  unit: 'kg_n' as const,
  recordedAt: '2026-03-17',
  sourceType: 'lab_measured' as const,
  sourceDocument: undefined,
  note: undefined,
};

function buildOverview(total: number) {
  const cloned = JSON.parse(JSON.stringify(overviewFixture));
  cloned.result.fdn.total = total;
  cloned.result.fdnTotalMetric.value = total;
  return cloned;
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

describe('nutrient-input flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('invalidates targeted dashboard query groups after create success', async () => {
    httpMocks.post.mockResolvedValueOnce({ data: createResponse });

    const queryClient = createQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCreateNutrientInput(33), { wrapper });

    await result.current.mutateAsync(createPayload);

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['nutrient-input', 'list', 'season', 33],
      exact: false,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['dashboard', 'sustainability-overview'],
      exact: false,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['dashboard', 'field-map'],
      exact: false,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['dashboard', 'field-metrics'],
      exact: false,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['dashboard', 'field-history'],
      exact: false,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['dashboard', 'field-recommendations'],
      exact: false,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['dashboard', 'assistant-recommendations'],
      exact: false,
    });
  });

  it('refetches sustainability overview after submit and reflects backend-updated FDN', async () => {
    const overviewBefore = buildOverview(72);
    const overviewAfter = buildOverview(55);

    httpMocks.get
      .mockResolvedValueOnce({ data: overviewBefore })
      .mockResolvedValueOnce({ data: overviewAfter });
    httpMocks.post.mockResolvedValueOnce({ data: createResponse });

    const queryClient = createQueryClient();

    function FlowHarness() {
      const overview = useDashboardFdnOverview({ scope: 'field', seasonId: 33 });
      const mutation = useCreateNutrientInput(33);

      return (
        <div>
          <div data-testid="fdn-total">{overview.data?.fdn.total ?? 'loading'}</div>
          <button onClick={() => mutation.mutate(createPayload)}>submit</button>
        </div>
      );
    }

    render(
      <QueryClientProvider client={queryClient}>
        <FlowHarness />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('fdn-total')).toHaveTextContent('72');
    });

    fireEvent.click(screen.getByText('submit'));

    await waitFor(() => {
      expect(screen.getByTestId('fdn-total')).toHaveTextContent('55');
    });

    expect(httpMocks.post).toHaveBeenCalledWith('/api/v1/seasons/33/nutrient-inputs', createPayload);
    expect(
      httpMocks.get.mock.calls.filter((call) => call[0] === '/api/v1/dashboard/sustainability/overview')
        .length
    ).toBeGreaterThanOrEqual(2);
  });
});
