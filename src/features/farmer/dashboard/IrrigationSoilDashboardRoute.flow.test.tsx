import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import overviewFixture from '@/entities/dashboard/api/__fixtures__/sustainability-overview.success.json';
import { useDashboardFdnOverview } from '@/entities/dashboard';
import {
  SeasonIrrigationWaterAnalysesWorkspace,
  SeasonSoilTestsWorkspace,
} from '@/features/farmer/season-workspace';

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

type IrrigationPayload = {
  plotId: number;
  sampleDate: string;
  nitrateMgPerL?: number;
  ammoniumMgPerL?: number;
  totalNmgPerL?: number;
  irrigationVolumeM3: number;
  sourceType: 'user_entered' | 'lab_measured' | 'external_reference';
  sourceDocument?: string;
  labReference?: string;
  note?: string;
};

type SoilPayload = {
  plotId: number;
  sampleDate: string;
  soilOrganicMatterPct?: number;
  mineralNKgPerHa: number;
  nitrateMgPerKg?: number;
  ammoniumMgPerKg?: number;
  sourceType: 'user_entered' | 'lab_measured' | 'external_reference';
  sourceDocument?: string;
  labReference?: string;
  note?: string;
};

let overviewResponse: any;
let irrigationRecords: any[];
let soilRecords: any[];
let shouldFailIrrigationCreate = false;
let shouldFailSoilCreate = false;
let nextIrrigationId = 1;
let nextSoilId = 1;

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

const applyIrrigationOverviewUpdate = () => {
  const result = overviewResponse.result;
  result.fdn.total = 57;
  result.fdn.mineral = 45;
  result.fdn.organic = 12;
  result.fdn.level = 'medium';
  result.fdn.explanation = 'Dedicated irrigation-water-analysis measured contribution is now included.';
  result.confidence = 0.93;
  result.inputsBreakdown.irrigationWaterN = 18;
  result.recommendations = [
    'Irrigation-water N is measured from dedicated analysis; rebalance mineral split with this source.',
  ];

  result.fdnTotalMetric.value = 57;
  result.fdnTotalMetric.status = 'measured';
  result.fdnTotalMetric.confidence = 0.93;
  result.fdnTotalMetric.missingInputs = [];
  result.missingInputs = [];
  result.dataQualitySummary.overallConfidence = 0.93;
  result.dataQualitySummary.missingInputCount = 0;
  result.dataQualitySummary.summary = 'Overall confidence 93%; dedicated irrigation analysis is now measured.';
};

const applySoilOverviewUpdate = () => {
  const result = overviewResponse.result;
  result.fdn.total = 54;
  result.fdn.mineral = 42;
  result.fdn.organic = 12;
  result.fdn.level = 'medium';
  result.fdn.explanation = 'Dedicated soil-test measured source improved soil legacy completeness.';
  result.confidence = 0.96;
  result.inputsBreakdown.soilLegacyN = 15;
  result.recommendations = [
    'Soil test is measured from dedicated domain; adjust fertilizer with updated soil legacy baseline.',
  ];

  result.fdnTotalMetric.value = 54;
  result.fdnTotalMetric.status = 'measured';
  result.fdnTotalMetric.confidence = 0.96;
  result.fdnTotalMetric.missingInputs = [];
  result.missingInputs = [];
  result.dataQualitySummary.overallConfidence = 0.96;
  result.dataQualitySummary.missingInputCount = 0;
  result.dataQualitySummary.summary = 'Overall confidence 96%; dedicated soil test is now measured.';
};

const setupHttpMocks = () => {
  httpMocks.get.mockImplementation(async (url: string) => {
    if (url === '/api/v1/seasons/33') {
      return { data: createSeasonDetailResponse() };
    }

    if (url === '/api/v1/seasons/33/irrigation-water-analyses') {
      return {
        data: {
          status: 200,
          code: 'SUCCESS',
          message: 'OK',
          result: irrigationRecords,
        },
      };
    }

    if (url === '/api/v1/seasons/33/soil-tests') {
      return {
        data: {
          status: 200,
          code: 'SUCCESS',
          message: 'OK',
          result: soilRecords,
        },
      };
    }

    if (url === '/api/v1/dashboard/sustainability/overview') {
      return { data: overviewResponse };
    }

    throw new Error(`Unhandled GET ${url}`);
  });

  httpMocks.post.mockImplementation(async (url: string, payload: IrrigationPayload | SoilPayload) => {
    await Promise.resolve();

    if (url === '/api/v1/seasons/33/irrigation-water-analyses') {
      if (shouldFailIrrigationCreate) {
        throw new Error('Irrigation backend error');
      }

      const created = {
        id: nextIrrigationId++,
        seasonId: 33,
        plotId: payload.plotId,
        plotName: 'Plot A',
        sampleDate: payload.sampleDate,
        nitrateMgPerL: (payload as IrrigationPayload).nitrateMgPerL ?? null,
        ammoniumMgPerL: (payload as IrrigationPayload).ammoniumMgPerL ?? null,
        totalNmgPerL: (payload as IrrigationPayload).totalNmgPerL ?? null,
        effectiveNmgPerL: 6,
        concentrationUnit: 'mg_n_per_l',
        irrigationVolumeM3: (payload as IrrigationPayload).irrigationVolumeM3,
        volumeUnit: 'm3',
        estimatedNContributionKg: 3,
        contributionUnit: 'kg_n',
        measured: true,
        status: 'measured',
        sourceType: payload.sourceType,
        sourceDocument: payload.sourceDocument ?? null,
        labReference: payload.labReference ?? null,
        note: payload.note ?? null,
        createdByUserId: 7,
        createdAt: '2026-03-18T09:00:00',
      };

      irrigationRecords = [created, ...irrigationRecords];
      applyIrrigationOverviewUpdate();

      return {
        data: {
          status: 200,
          code: 'SUCCESS',
          message: 'OK',
          result: created,
        },
      };
    }

    if (url === '/api/v1/seasons/33/soil-tests') {
      if (shouldFailSoilCreate) {
        throw new Error('Soil backend error');
      }

      const created = {
        id: nextSoilId++,
        seasonId: 33,
        plotId: payload.plotId,
        plotName: 'Plot A',
        sampleDate: payload.sampleDate,
        soilOrganicMatterPct: (payload as SoilPayload).soilOrganicMatterPct ?? null,
        mineralNKgPerHa: (payload as SoilPayload).mineralNKgPerHa,
        nitrateMgPerKg: (payload as SoilPayload).nitrateMgPerKg ?? null,
        ammoniumMgPerKg: (payload as SoilPayload).ammoniumMgPerKg ?? null,
        mineralNUnit: 'kg_n_per_ha',
        concentrationUnit: 'mg_per_kg',
        estimatedNContributionKg: 15,
        contributionUnit: 'kg_n',
        measured: true,
        status: 'measured',
        sourceType: payload.sourceType,
        sourceDocument: payload.sourceDocument ?? null,
        labReference: payload.labReference ?? null,
        note: payload.note ?? null,
        createdByUserId: 7,
        createdAt: '2026-03-18T09:10:00',
      };

      soilRecords = [created, ...soilRecords];
      applySoilOverviewUpdate();

      return {
        data: {
          status: 200,
          code: 'SUCCESS',
          message: 'OK',
          result: created,
        },
      };
    }

    throw new Error(`Unhandled POST ${url}`);
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
      <div data-testid="breakdown-irrigation">{String(overview.inputsBreakdown.irrigationWaterN ?? 'null')}</div>
      <div data-testid="breakdown-soil">{String(overview.inputsBreakdown.soilLegacyN ?? 'null')}</div>
      <div data-testid="confidence">{String(overview.confidence)}</div>
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

function renderFlowApp(initialPath: string, queryClient: QueryClient) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <LocationTracker />
        <Routes>
          <Route
            path="/farmer/seasons/:seasonId/workspace/irrigation-water-analyses"
            element={<SeasonIrrigationWaterAnalysesWorkspace />}
          />
          <Route
            path="/farmer/seasons/:seasonId/workspace/soil-tests"
            element={<SeasonSoilTestsWorkspace />}
          />
          <Route path="/farmer/dashboard" element={<DashboardProbeRoute />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

function getOverviewCallCount() {
  return httpMocks.get.mock.calls.filter(
    (args: unknown[]) => args[0] === '/api/v1/dashboard/sustainability/overview'
  ).length;
}

describe('route-level irrigation/soil dedicated domain flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ensurePointerCapturePolyfill();
    overviewResponse = clone(overviewFixture);
    irrigationRecords = [];
    soilRecords = [];
    shouldFailIrrigationCreate = false;
    shouldFailSoilCreate = false;
    nextIrrigationId = 1;
    nextSoilId = 1;
    setupHttpMocks();
  });

  it('happy path irrigation analysis: submit succeeds, navigates to dashboard, and renders refreshed irrigation contribution', async () => {
    const queryClient = createQueryClient();
    renderFlowApp('/farmer/seasons/33/workspace/irrigation-water-analyses', queryClient);

    await waitFor(() => {
      expect(screen.getByTestId('submit-irrigation-analysis-dashboard')).not.toBeDisabled();
    });

    fireEvent.change(screen.getByTestId('irrigation-total-n-input'), { target: { value: '6' } });
    fireEvent.change(screen.getByTestId('irrigation-volume-input'), { target: { value: '500' } });
    fireEvent.change(screen.getByTestId('irrigation-sample-date-input'), {
      target: { value: '2026-03-18' },
    });
    fireEvent.click(screen.getByTestId('submit-irrigation-analysis-dashboard'));

    await waitFor(() => {
      expect(httpMocks.post).toHaveBeenCalledTimes(1);
    });
    expect(httpMocks.post.mock.calls[0]?.[0]).toBe('/api/v1/seasons/33/irrigation-water-analyses');

    await waitFor(() => {
      expect(screen.getByTestId('route-location')).toHaveTextContent('/farmer/dashboard');
      expect(screen.getByTestId('fdn-total')).toHaveTextContent('57');
    });

    expect(screen.getByTestId('breakdown-irrigation')).toHaveTextContent('18');
    expect(screen.getByTestId('confidence')).toHaveTextContent('0.93');
    expect(screen.getByTestId('recommendations')).toHaveTextContent('dedicated analysis');
    expect(toastMocks.success).toHaveBeenCalledTimes(1);
    expect(getOverviewCallCount()).toBeGreaterThan(0);
  });

  it('happy path soil test: submit succeeds, navigates to dashboard, and renders refreshed soil legacy contribution', async () => {
    const queryClient = createQueryClient();
    renderFlowApp('/farmer/seasons/33/workspace/soil-tests', queryClient);

    await waitFor(() => {
      expect(screen.getByTestId('submit-soil-test-dashboard')).not.toBeDisabled();
    });

    fireEvent.change(screen.getByTestId('soil-mineral-n-input'), { target: { value: '15' } });
    fireEvent.change(screen.getByTestId('soil-sample-date-input'), {
      target: { value: '2026-03-18' },
    });
    fireEvent.click(screen.getByTestId('submit-soil-test-dashboard'));

    await waitFor(() => {
      expect(httpMocks.post).toHaveBeenCalledTimes(1);
    });
    expect(httpMocks.post.mock.calls[0]?.[0]).toBe('/api/v1/seasons/33/soil-tests');

    await waitFor(() => {
      expect(screen.getByTestId('route-location')).toHaveTextContent('/farmer/dashboard');
      expect(screen.getByTestId('fdn-total')).toHaveTextContent('54');
    });

    expect(screen.getByTestId('breakdown-soil')).toHaveTextContent('15');
    expect(screen.getByTestId('confidence')).toHaveTextContent('0.96');
    expect(screen.getByTestId('recommendations')).toHaveTextContent('dedicated domain');
    expect(toastMocks.success).toHaveBeenCalledTimes(1);
    expect(getOverviewCallCount()).toBeGreaterThan(0);
  });

  it('backend error irrigation: shows error and stays on irrigation workspace route', async () => {
    shouldFailIrrigationCreate = true;

    const queryClient = createQueryClient();
    renderFlowApp('/farmer/seasons/33/workspace/irrigation-water-analyses', queryClient);

    await waitFor(() => {
      expect(screen.getByTestId('submit-irrigation-analysis-dashboard')).not.toBeDisabled();
    });

    fireEvent.change(screen.getByTestId('irrigation-total-n-input'), { target: { value: '6' } });
    fireEvent.change(screen.getByTestId('irrigation-volume-input'), { target: { value: '500' } });
    fireEvent.change(screen.getByTestId('irrigation-sample-date-input'), {
      target: { value: '2026-03-18' },
    });
    fireEvent.click(screen.getByTestId('submit-irrigation-analysis-dashboard'));

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId('route-location')).toHaveTextContent(
      '/farmer/seasons/33/workspace/irrigation-water-analyses'
    );
    expect(toastMocks.success).not.toHaveBeenCalled();
    expect(getOverviewCallCount()).toBe(0);
  });
});
