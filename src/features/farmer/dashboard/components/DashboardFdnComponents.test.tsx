import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { DashboardFdnOverview, DashboardFieldMapItem } from '@/entities/dashboard';
import { FdnAssistantPanel } from './FdnAssistantPanel';
import { FdnHistoryChart } from './FdnHistoryChart';
import { FdnKpiCards } from './FdnKpiCards';
import { FieldSustainabilityMap } from './FieldSustainabilityMap';
import { NitrogenInputBreakdown } from './NitrogenInputBreakdown';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) => options?.defaultValue ?? key,
  }),
}));

function metric(
  status: 'measured' | 'estimated' | 'missing' | 'unavailable',
  value: number | null,
  unit = '%'
) {
  return {
    value,
    unit,
    status,
    confidence: 0.72,
    calculationMode: 'hybrid_estimated',
    assumptions: [],
    missingInputs: [],
  };
}

function overviewFixture(overrides?: Partial<DashboardFdnOverview>): DashboardFdnOverview {
  return {
    scope: 'field',
    entityId: '22',
    seasonId: 33,
    calculationMode: 'hybrid_estimated',
    confidence: 0.72,
    sustainableScore: {
      value: 64,
      label: 'Fair',
      components: { dependency: 28 },
      weights: { dependency: 0.3 },
    },
    fdn: {
      total: 72,
      mineral: 60,
      organic: 12,
      level: 'high',
      status: 'estimated',
      thresholdSource: 'config_default_v1',
      lowMaxExclusive: 40,
      mediumMaxExclusive: 70,
      mineralHighMin: 60,
      explanation: 'FDN is above configured medium threshold (70%).',
    },
    nue: 43,
    nOutput: 41,
    nSurplus: 36,
    currentSeason: {
      seasonName: 'Mùa 33',
      cropName: 'Lúa',
      dayCount: 55,
      stage: 'ACTIVE',
    },
    yield: {
      estimated: 6.2,
      unit: 't/ha',
    },
    inputsBreakdown: {
      mineralFertilizerN: 60,
      organicFertilizerN: 12,
      biologicalFixationN: 8,
      irrigationWaterN: 6,
      atmosphericDepositionN: 5,
      seedImportN: 0,
      soilLegacyN: 0,
      controlSupplyN: null,
    },
    unit: 'kg N/ha/season',
    dataQuality: [
      {
        source: 'MINERAL_FERTILIZER',
        method: 'measured',
        confidence: 1,
      },
    ],
    dataQualitySummary: {
      overallConfidence: 0.72,
      measuredInputCount: 1,
      estimatedInputCount: 3,
      missingInputCount: 1,
      unavailableInputCount: 0,
      summary: 'Overall confidence 72%; 1 measured, 3 estimated/mixed, 1 missing inputs.',
    },
    missingInputs: ['CONTROL_SUPPLY'],
    notes: ['Sample note'],
    recommendations: ['Backend recommendation'],
    recommendationSource: 'product_rule_config_v1',
    sustainableScoreMetric: metric('estimated', 64),
    fdnTotalMetric: metric('estimated', 72),
    fdnMineralMetric: metric('estimated', 60),
    fdnOrganicMetric: metric('estimated', 12),
    nueMetric: metric('estimated', 43),
    nOutputMetric: metric('estimated', 41, 'kg N/ha/season'),
    nSurplusMetric: metric('estimated', 36, 'kg N/ha/season'),
    estimatedYieldMetric: metric('estimated', 6.2, 't/ha'),
    historicalTrend: [],
    ...overrides,
  };
}

describe('Dashboard FDN components', () => {
  it('FdnKpiCards does not render fake zero for missing yield/surplus metrics', () => {
    const overview = overviewFixture({
      estimatedYieldMetric: metric('missing', 0, 't/ha'),
      nSurplusMetric: metric('missing', 0, 'kg N/ha/season'),
    });

    render(<FdnKpiCards overview={overview} isLoading={false} />);

    expect(screen.getAllByText('Insufficient data').length).toBeGreaterThan(0);
    expect(screen.queryByText('0.00 t/ha')).not.toBeInTheDocument();
  });

  it('FdnAssistantPanel renders backend recommendation list without frontend-injected advice', () => {
    const overview = overviewFixture({
      confidence: 0.3,
      recommendations: ['Collect additional measured input data first.'],
    });

    render(<FdnAssistantPanel overview={overview} isLoading={false} />);

    expect(screen.getByText('Collect additional measured input data first.')).toBeInTheDocument();
    expect(
      screen.queryByText(
        'Data confidence is low, prioritize data verification before strong fertilizer adjustments.'
      )
    ).not.toBeInTheDocument();
  });

  it('NitrogenInputBreakdown shows empty state when inputs are not available', () => {
    const overview = overviewFixture({
      inputsBreakdown: {
        mineralFertilizerN: null,
        organicFertilizerN: null,
        biologicalFixationN: null,
        irrigationWaterN: null,
        atmosphericDepositionN: null,
        seedImportN: null,
        soilLegacyN: null,
        controlSupplyN: null,
      },
      dataQualitySummary: {
        overallConfidence: 0.2,
        measuredInputCount: 0,
        estimatedInputCount: 0,
        missingInputCount: 5,
        unavailableInputCount: 0,
        summary: 'Low confidence',
      },
    });

    render(<NitrogenInputBreakdown overview={overview} isLoading={false} />);

    expect(
      screen.getByText('Not enough input data to build nitrogen breakdown yet.')
    ).toBeInTheDocument();
  });

  it('FdnHistoryChart shows useful empty state when history is empty', () => {
    render(<FdnHistoryChart history={[]} isLoading={false} />);

    expect(screen.getByText('No historical season metrics available.')).toBeInTheDocument();
  });

  it('FieldSustainabilityMap falls back to list mode when map key/geometry is unavailable', async () => {
    const items: DashboardFieldMapItem[] = [
      {
        fieldId: 1,
        fieldName: 'Field A',
        farmId: 7,
        farmName: 'Farm 7',
        geometry: null,
        center: null,
        cropName: 'Rice',
        seasonName: 'Season 33',
        fdnLevel: 'high',
        fdnTotal: null,
        fdnMineral: null,
        fdnOrganic: null,
        nue: null,
        confidence: null,
        calculationMode: 'hybrid_estimated',
        thresholdSource: 'config_default_v1',
        recommendationSource: 'product_rule_config_v1',
        missingInputs: ['MINERAL_FERTILIZER'],
        inputsBreakdown: {
          mineralFertilizerN: null,
          organicFertilizerN: null,
          biologicalFixationN: null,
          irrigationWaterN: null,
          atmosphericDepositionN: null,
          seedImportN: null,
          soilLegacyN: null,
          controlSupplyN: null,
        },
        recommendations: [],
      },
    ];

    render(
      <MemoryRouter>
        <FieldSustainabilityMap items={items} isLoading={false} />
      </MemoryRouter>
    );

    expect(await screen.findByText('Map is currently unavailable')).toBeInTheDocument();
    expect(screen.getByText('Field list fallback')).toBeInTheDocument();
    expect(screen.getByText('Go to Farms & Plots')).toBeInTheDocument();
  });
});
