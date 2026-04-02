import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import overviewFixture from '@/entities/dashboard/api/__fixtures__/sustainability-overview.success.json';
import { useDashboardFdnOverview } from '@/entities/dashboard';
import { dashboardKeys } from '@/entities/dashboard/model/keys';
import { SeasonNutrientInputsWorkspace } from '@/features/farmer/season-workspace/SeasonNutrientInputsWorkspace';

const httpMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}));

vi.mock('@/shared/api/http', () => ({
  default: {
    get: httpMocks.get,
    post: httpMocks.post,
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: toastMocks.success,
    error: toastMocks.error,
  },
}));

type InputSource =
  | 'MINERAL_FERTILIZER'
  | 'ORGANIC_FERTILIZER';

type NutrientInputPayload = {
  plotId: number;
  inputSource: InputSource;
  value: number;
  unit: 'kg_n' | 'kg_n_per_ha';
  recordedAt: string;
  sourceType: 'user_entered' | 'lab_measured' | 'external_reference';
  sourceDocument?: string;
  note?: string;
};

let overviewResponse: any;
let nutrientRecords: any[];
let shouldFailCreate = false;
let nextId = 1;

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const ensurePointerCapturePolyfill = () => {
  if (!HTMLElement.prototype.hasPointerCapture) {
    Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
      value: () => false,
      configurable: true,
    });
  }
  if (!HTMLElement.prototype.setPointerCapture) {
    Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
      value: () => undefined,
      configurable: true,
    });
  }
  if (!HTMLElement.prototype.releasePointerCapture) {
    Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
      value: () => undefined,
      configurable: true,
    });
  }
  if (!Element.prototype.scrollIntoView) {
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      value: () => undefined,
      configurable: true,
    });
  }
};

const createSeasonDetailResponse = () => ({
  status: 200,
  code: 'SUCCESS',
  message: 'OK',
  result: {
    id: 33,
    farmId: 1,
    farmName: 'Farm A',
    plotId: 22,
    plotName: 'Plot A',
    cropId: 11,
    cropName: 'Lua',
    varietyId: null,
    varietyName: null,
    seasonName: 'Mua 33',
    startDate: '2026-02-01',
    plannedHarvestDate: '2026-05-30',
    endDate: null,
    status: 'ACTIVE',
    initialPlantCount: 1000,
    currentPlantCount: 980,
    expectedYieldKg: 6200,
    actualYieldKg: null,
    budgetAmount: 1000000,
    notes: null,
    createdAt: '2026-02-01T10:00:00',
    updatedAt: '2026-03-01T10:00:00',
  },
});

const updateOverviewAfterCreate = (source: InputSource) => {
  const result = overviewResponse.result;
  switch (source) {
    case 'MINERAL_FERTILIZER':
      result.fdn.total = 66;
      result.fdn.mineral = 54;
      result.fdn.organic = 12;
      result.fdn.level = 'medium';
      result.fdn.explanation = 'FDN dropped but still above low threshold because mineral share remains high.';
      result.confidence = 0.86;
      result.inputsBreakdown.mineralFertilizerN = 54;
      result.inputsBreakdown.organicFertilizerN = 12;
      result.recommendations = [
        'Reduce mineral nitrogen by 15% on the next split application.',
        'Add more organic N to improve FDN and NUE balance.',
      ];
      break;
    case 'ORGANIC_FERTILIZER':
      result.fdn.total = 49;
      result.fdn.mineral = 31;
      result.fdn.organic = 18;
      result.fdn.level = 'medium';
      result.fdn.explanation = 'Organic share improved and lowered fertilizer dependency ratio.';
      result.confidence = 0.91;
      result.inputsBreakdown.mineralFertilizerN = 31;
      result.inputsBreakdown.organicFertilizerN = 18;
      result.recommendations = [
        'Organic share improved. Keep current split and monitor NUE weekly.',
      ];
      break;
    default:
      break;
  }

  result.fdn.status = 'measured';
  result.missingInputs = [];
  result.dataQualitySummary.overallConfidence = result.confidence;
  result.dataQualitySummary.measuredInputCount = 3;
  result.dataQualitySummary.estimatedInputCount = 2;
  result.dataQualitySummary.missingInputCount = 0;
  result.dataQualitySummary.summary = `Overall confidence ${Math.round(
    result.confidence * 100
  )}%; measured inputs increased after nutrient ingestion.`;
  result.fdnTotalMetric.value = result.fdn.total;
  result.fdnTotalMetric.status = 'measured';
  result.fdnTotalMetric.confidence = result.confidence;
  result.fdnTotalMetric.missingInputs = [];
  result.fdnMineralMetric.value = result.fdn.mineral;
  result.fdnMineralMetric.status = 'measured';
  result.fdnMineralMetric.confidence = result.confidence;
  result.fdnMineralMetric.missingInputs = [];
  result.fdnOrganicMetric.value = result.fdn.organic;
  result.fdnOrganicMetric.status = 'measured';
  result.fdnOrganicMetric.confidence = result.confidence;
  result.fdnOrganicMetric.missingInputs = [];
  result.recommendationSource = 'product_rule_config_v1';
};

const setupHttpMocks = () => {
  httpMocks.get.mockImplementation(async (url: string, config?: { params?: Record<string, unknown> }) => {
    if (url === '/api/v1/seasons/33') {
      return { data: createSeasonDetailResponse() };
    }

    if (url === '/api/v1/seasons/33/nutrient-inputs') {
      const source = config?.params?.source as InputSource | undefined;
      const filtered = source
        ? nutrientRecords.filter((item) => item.inputSource === source)
        : nutrientRecords;
      return {
        data: {
          status: 200,
          code: 'SUCCESS',
          message: 'OK',
          result: filtered,
        },
      };
    }

    if (url === '/api/v1/dashboard/sustainability/overview') {
      return { data: overviewResponse };
    }

    throw new Error(`Unhandled GET ${url}`);
  });

  httpMocks.post.mockImplementation(async (url: string, payload: NutrientInputPayload) => {
    await Promise.resolve();

    if (url !== '/api/v1/seasons/33/nutrient-inputs') {
      throw new Error(`Unhandled POST ${url}`);
    }

    if (shouldFailCreate) {
      throw new Error('Backend error');
    }

    const created = {
      id: nextId++,
      seasonId: 33,
      plotId: payload.plotId,
      plotName: 'Plot A',
      inputSource: payload.inputSource,
      value: payload.value,
      unit: payload.unit,
      normalizedNKg: payload.value,
      recordedAt: payload.recordedAt,
      measured: true,
      status: 'measured',
      sourceType: payload.sourceType,
      sourceDocument: payload.sourceDocument ?? null,
      note: payload.note ?? null,
      createdByUserId: 7,
      createdAt: '2026-03-17T09:00:00',
    };

    nutrientRecords = [created, ...nutrientRecords];
    updateOverviewAfterCreate(payload.inputSource);

    return {
      data: {
        status: 200,
        code: 'SUCCESS',
        message: 'OK',
        result: created,
      },
    };
  });
};

function DashboardProbeRoute() {
  const overviewQuery = useDashboardFdnOverview({ scope: 'field', seasonId: 33 });

  if (overviewQuery.isLoading) {
    return <div data-testid="dashboard-loading">loading</div>;
  }

  if (overviewQuery.error || !overviewQuery.data) {
    return <div data-testid="dashboard-error">error</div>;
  }

  const overview = overviewQuery.data;

  return (
    <div data-testid="dashboard-probe">
      <div data-testid="fdn-total">{String(overview.fdnTotalMetric.value ?? 'null')}</div>
      <div data-testid="fdn-organic">{String(overview.fdnOrganicMetric.value ?? 'null')}</div>
      <div data-testid="breakdown-mineral">
        {String(overview.inputsBreakdown.mineralFertilizerN ?? 'null')}
      </div>
      <div data-testid="breakdown-organic">
        {String(overview.inputsBreakdown.organicFertilizerN ?? 'null')}
      </div>
      <div data-testid="confidence">{String(overview.confidence)}</div>
      <div data-testid="alert-level">{overview.fdn.level}</div>
      <div data-testid="recommendations">{overview.recommendations.join(' | ')}</div>
    </div>
  );
}

function LocationTracker() {
  const location = useLocation();
  return <div data-testid="route-location">{location.pathname}</div>;
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

function renderFlowApp(queryClient: QueryClient) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/farmer/seasons/33/workspace/nutrient-inputs']}>
        <LocationTracker />
        <Routes>
          <Route
            path="/farmer/seasons/:seasonId/workspace/nutrient-inputs"
            element={<SeasonNutrientInputsWorkspace />}
          />
          <Route path="/farmer/dashboard" element={<DashboardProbeRoute />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

async function chooseInputSource(optionPattern: RegExp) {
  const selectTriggers = screen.getAllByRole('combobox');
  const inputSourceTrigger = selectTriggers[0];
  fireEvent.mouseDown(inputSourceTrigger);
  if (inputSourceTrigger.getAttribute('aria-expanded') !== 'true') {
    fireEvent.click(inputSourceTrigger);
  }

  await waitFor(() => {
    expect(inputSourceTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  const option = await screen.findByRole('option', { name: optionPattern });
  fireEvent.click(option);

  await waitFor(() => {
    expect(inputSourceTrigger).toHaveTextContent(optionPattern);
  });
}

function getOverviewCallCount() {
  return httpMocks.get.mock.calls.filter(
    (args: unknown[]) => args[0] === '/api/v1/dashboard/sustainability/overview'
  ).length;
}

describe('route-level nutrient input -> dashboard flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ensurePointerCapturePolyfill();
    overviewResponse = clone(overviewFixture);
    nutrientRecords = [];
    shouldFailCreate = false;
    nextId = 1;
    setupHttpMocks();
  });

  it('happy path mineral: submit succeeds, navigates to dashboard, and renders refreshed metrics', async () => {
    const queryClient = createQueryClient();
    queryClient.setQueryData(
      dashboardKeys.sustainabilityOverview({ scope: 'field', seasonId: 33 }),
      clone(overviewFixture.result)
    );

    renderFlowApp(queryClient);

    await waitFor(() => {
      expect(screen.getByTestId('submit-nutrient-input-dashboard')).not.toBeDisabled();
    });

    fireEvent.change(screen.getByTestId('nutrient-value-input'), { target: { value: '28.5' } });
    fireEvent.change(screen.getByTestId('nutrient-recorded-at-input'), {
      target: { value: '2026-03-17' },
    });
    fireEvent.click(screen.getByTestId('submit-nutrient-input-dashboard'));

    await waitFor(() => {
      expect(httpMocks.post).toHaveBeenCalledTimes(1);
    });
    expect(httpMocks.post.mock.calls[0]?.[1]).toMatchObject({ inputSource: 'MINERAL_FERTILIZER' });

    await waitFor(() => {
      expect(screen.getByTestId('route-location')).toHaveTextContent('/farmer/dashboard');
    });

    await waitFor(() => {
      expect(screen.getByTestId('fdn-total')).toHaveTextContent('66');
    });

    expect(screen.getByTestId('breakdown-mineral')).toHaveTextContent('54');
    expect(screen.getByTestId('confidence')).toHaveTextContent('0.86');
    expect(screen.getByTestId('alert-level')).toHaveTextContent('medium');
    expect(screen.getByTestId('recommendations')).toHaveTextContent('Reduce mineral nitrogen by 15%');
    expect(toastMocks.success).toHaveBeenCalledTimes(1);
    expect(getOverviewCallCount()).toBeGreaterThan(0);
  });

  it('happy path organic: submit succeeds and dashboard reflects organic-focused update', async () => {
    const queryClient = createQueryClient();
    renderFlowApp(queryClient);

    await waitFor(() => {
      expect(screen.getByTestId('submit-nutrient-input-dashboard')).not.toBeDisabled();
    });

    await chooseInputSource(/manure/i);
    fireEvent.change(screen.getByTestId('nutrient-value-input'), { target: { value: '18' } });
    fireEvent.change(screen.getByTestId('nutrient-recorded-at-input'), {
      target: { value: '2026-03-18' },
    });
    fireEvent.click(screen.getByTestId('submit-nutrient-input-dashboard'));

    await waitFor(() => {
      expect(httpMocks.post).toHaveBeenCalledTimes(1);
    });
    expect(httpMocks.post.mock.calls[0]?.[1]).toMatchObject({ inputSource: 'ORGANIC_FERTILIZER' });

    await waitFor(() => {
      expect(screen.getByTestId('route-location')).toHaveTextContent('/farmer/dashboard');
    });

    await waitFor(() => {
      expect(screen.getByTestId('fdn-organic')).toHaveTextContent('18');
    });

    expect(screen.getByTestId('fdn-total')).toHaveTextContent('49');
    expect(screen.getByTestId('breakdown-organic')).toHaveTextContent('18');
    expect(screen.getByTestId('recommendations')).toHaveTextContent('Organic share improved');
  });

  it('validation fail: does not submit request and does not navigate/refetch dashboard', async () => {
    const queryClient = createQueryClient();
    renderFlowApp(queryClient);

    await waitFor(() => {
      expect(screen.getByTestId('submit-nutrient-input-dashboard')).not.toBeDisabled();
    });

    fireEvent.change(screen.getByTestId('nutrient-value-input'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('nutrient-recorded-at-input'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('submit-nutrient-input-dashboard'));

    await waitFor(() => {
      expect(httpMocks.post).not.toHaveBeenCalled();
    });

    expect(screen.getByTestId('route-location')).toHaveTextContent(
      '/farmer/seasons/33/workspace/nutrient-inputs'
    );
    expect(toastMocks.success).not.toHaveBeenCalled();
    expect(getOverviewCallCount()).toBe(0);
  });

  it('backend error: shows error feedback and keeps user on ingestion route', async () => {
    shouldFailCreate = true;
    const queryClient = createQueryClient();
    renderFlowApp(queryClient);

    await waitFor(() => {
      expect(screen.getByTestId('submit-nutrient-input-dashboard')).not.toBeDisabled();
    });

    fireEvent.change(screen.getByTestId('nutrient-value-input'), { target: { value: '21' } });
    fireEvent.change(screen.getByTestId('nutrient-recorded-at-input'), {
      target: { value: '2026-03-19' },
    });
    fireEvent.click(screen.getByTestId('submit-nutrient-input-dashboard'));

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId('route-location')).toHaveTextContent(
      '/farmer/seasons/33/workspace/nutrient-inputs'
    );
    expect(toastMocks.success).not.toHaveBeenCalled();
    expect(getOverviewCallCount()).toBe(0);
  });
});
