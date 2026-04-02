export type FdnAlertLevel = 'low' | 'medium' | 'high';
export type DashboardMetricStatus = 'measured' | 'estimated' | 'missing' | 'unavailable';

export interface DashboardSustainabilityScore {
  value: number | null;
  label: string;
  components: Record<string, number | null>;
  weights: Record<string, number | null>;
}

export interface DashboardFdnMetrics {
  total: number | null;
  mineral: number | null;
  organic: number | null;
  level: FdnAlertLevel;
  status: DashboardMetricStatus;
  thresholdSource: string;
  lowMaxExclusive: number | null;
  mediumMaxExclusive: number | null;
  mineralHighMin: number | null;
  explanation: string;
}

export interface DashboardCurrentSeason {
  seasonName: string | null;
  cropName: string | null;
  dayCount: number | null;
  stage: string | null;
}

export interface DashboardYieldSummary {
  estimated: number | null;
  unit: string;
}

export interface DashboardInputsBreakdown {
  mineralFertilizerN: number | null;
  organicFertilizerN: number | null;
  biologicalFixationN: number | null;
  irrigationWaterN: number | null;
  atmosphericDepositionN: number | null;
  seedImportN: number | null;
  soilLegacyN: number | null;
  controlSupplyN: number | null;
}

export interface DashboardDataQuality {
  source: string;
  method: string;
  confidence: number | null;
}

export interface DashboardDataQualitySummary {
  overallConfidence: number | null;
  measuredInputCount: number;
  estimatedInputCount: number;
  missingInputCount: number;
  unavailableInputCount: number;
  summary: string;
}

export interface DashboardMetricValue {
  value: number | null;
  unit: string;
  status: DashboardMetricStatus;
  confidence: number | null;
  calculationMode: string;
  assumptions: string[];
  missingInputs: string[];
}

export interface DashboardHistoryPoint {
  seasonId: number;
  seasonName: string;
  startDate: string;
  fdnTotal: number | null;
  fdnMineral: number | null;
  fdnOrganic: number | null;
  nue: number | null;
  nOutput: number | null;
  yield: number | null;
}

export interface DashboardFdnOverview {
  scope: 'field' | 'farm' | string;
  entityId: string | null;
  seasonId: number | null;
  calculationMode: 'exact_control' | 'explicit_budget' | 'hybrid_estimated' | string;
  confidence: number | null;
  sustainableScore: DashboardSustainabilityScore;
  fdn: DashboardFdnMetrics;
  nue: number | null;
  nOutput: number | null;
  nSurplus: number | null;
  currentSeason: DashboardCurrentSeason | null;
  yield: DashboardYieldSummary;
  inputsBreakdown: DashboardInputsBreakdown;
  unit: string;
  dataQuality: DashboardDataQuality[];
  dataQualitySummary: DashboardDataQualitySummary | null;
  missingInputs: string[];
  notes: string[];
  recommendations: string[];
  recommendationSource: string;
  sustainableScoreMetric: DashboardMetricValue;
  fdnTotalMetric: DashboardMetricValue;
  fdnMineralMetric: DashboardMetricValue;
  fdnOrganicMetric: DashboardMetricValue;
  nueMetric: DashboardMetricValue;
  nOutputMetric: DashboardMetricValue;
  nSurplusMetric: DashboardMetricValue;
  estimatedYieldMetric: DashboardMetricValue;
  historicalTrend: DashboardHistoryPoint[];
}

export interface DashboardAssistantRecommendations {
  fdn: {
    total: number | null;
    mineral: number | null;
    level: FdnAlertLevel;
  };
  confidence: number | null;
  recommendations: string[];
}

export interface DashboardFdnOverviewParams {
  scope?: 'field' | 'farm';
  seasonId?: number;
  fieldId?: number;
  farmId?: number;
}

export interface DashboardAssistantParams {
  seasonId?: number;
  fieldId?: number;
}

export interface DashboardGeoJsonGeometry {
  type: string;
  coordinates?: unknown;
}

export interface DashboardFieldMapItem {
  fieldId: number;
  fieldName: string;
  farmId: number | null;
  farmName: string | null;
  geometry: DashboardGeoJsonGeometry | null;
  center: { lat: number; lng: number } | null;
  cropName: string;
  seasonName: string;
  fdnLevel: FdnAlertLevel;
  fdnTotal: number | null;
  fdnMineral: number | null;
  fdnOrganic: number | null;
  nue: number | null;
  confidence: number | null;
  calculationMode: string;
  thresholdSource: string;
  recommendationSource: string;
  missingInputs: string[];
  inputsBreakdown: DashboardInputsBreakdown;
  recommendations: string[];
}

export interface DashboardFieldMapResponse {
  items: DashboardFieldMapItem[];
}

export interface DashboardFieldMapParams {
  seasonId?: number;
  farmId?: number;
  crop?: string;
  alertLevel?: FdnAlertLevel | 'all';
}

export interface DashboardFieldRecommendationResponse {
  fieldId: number;
  seasonId: number | null;
  fdnTotal: number | null;
  fdnMineral: number | null;
  nue: number | null;
  confidence: number | null;
  fdnLevel: FdnAlertLevel;
  thresholdSource: string;
  recommendationSource: string;
  calculationMode: string;
  missingInputs: string[];
  recommendations: string[];
}

export type DashboardFieldMetricsResponse = DashboardFdnOverview;
export type DashboardFieldHistoryResponse = DashboardHistoryPoint[];

export const FDN_LEVEL_COLORS: Record<FdnAlertLevel, string> = {
  low: '#16a34a',
  medium: '#f59e0b',
  high: '#dc2626',
};
