import { beforeEach, describe, expect, it, vi } from 'vitest';
import fieldHistoryFixture from './__fixtures__/field-history.success.json';
import fieldMapFixture from './__fixtures__/field-map.success.json';
import fieldRecommendationsFixture from './__fixtures__/field-recommendations.success.json';
import overviewFixture from './__fixtures__/sustainability-overview.success.json';
import { dashboardFdnApi } from './fdn-client';

const httpMocks = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock('@/shared/api/http', () => ({
  default: {
    get: httpMocks.get,
  },
}));

describe('dashboardFdnApi contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('parses sustainability overview contract and keeps semantic null values', async () => {
    httpMocks.get.mockResolvedValueOnce({ data: overviewFixture });

    const result = await dashboardFdnApi.getOverview({ seasonId: 33 });

    expect(httpMocks.get).toHaveBeenCalledWith('/api/v1/dashboard/sustainability/overview', {
      params: {
        scope: 'field',
        seasonId: 33,
        fieldId: undefined,
        farmId: undefined,
      },
    });
    expect(result.fdn.status).toBe('estimated');
    expect(result.inputsBreakdown.controlSupplyN).toBeNull();
    expect(result.fdnMineralMetric.status).toBe('measured');
  });

  it('parses field metrics contract from drill-down endpoint', async () => {
    httpMocks.get.mockResolvedValueOnce({ data: overviewFixture });

    const result = await dashboardFdnApi.getFieldMetrics(22, 33);

    expect(httpMocks.get).toHaveBeenCalledWith('/api/v1/fields/22/sustainability-metrics', {
      params: { seasonId: 33 },
    });
    expect(result.entityId).toBe('22');
    expect(result.nOutputMetric.value).toBe(41);
  });

  it('parses field history contract with stable keys', async () => {
    httpMocks.get.mockResolvedValueOnce({ data: fieldHistoryFixture });

    const result = await dashboardFdnApi.getFieldHistory(22);

    expect(httpMocks.get).toHaveBeenCalledWith('/api/v1/fields/22/fdn-history');
    expect(result).toHaveLength(2);
    expect(result[0].nOutput).toBe(37);
  });

  it('parses field recommendations contract with source metadata', async () => {
    httpMocks.get.mockResolvedValueOnce({ data: fieldRecommendationsFixture });

    const result = await dashboardFdnApi.getFieldRecommendations(22, 33);

    expect(httpMocks.get).toHaveBeenCalledWith('/api/v1/fields/22/recommendations', {
      params: { seasonId: 33 },
    });
    expect(result.fdnLevel).toBe('high');
    expect(result.thresholdSource).toBe('config_default_v1');
    expect(result.recommendationSource).toBe('product_rule_config_v1');
  });

  it('parses field map contract with metadata and missing geometry fallback data', async () => {
    httpMocks.get.mockResolvedValueOnce({ data: fieldMapFixture });

    const result = await dashboardFdnApi.getFieldMap({ seasonId: 33, alertLevel: 'all' });

    expect(httpMocks.get).toHaveBeenCalledWith('/api/v1/fields/map', {
      params: {
        seasonId: 33,
        farmId: undefined,
        crop: undefined,
        alertLevel: 'all',
      },
    });
    expect(result.items[0].geometry).toBeNull();
    expect(result.items[0].calculationMode).toBe('hybrid_estimated');
    expect(result.items[0].missingInputs[0]).toBe('MINERAL_FERTILIZER');
  });
});
