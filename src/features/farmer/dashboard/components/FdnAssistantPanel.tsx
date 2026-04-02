import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardFdnOverview } from '@/entities/dashboard';
import { AlertTriangle, Bot, CheckCircle2, Leaf, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  formatMetricValue,
  hasNumericValue,
  metricStatusColor,
} from '../lib/metrics';

interface FdnAssistantPanelProps {
  overview: DashboardFdnOverview | null;
  isLoading: boolean;
}

const LEVEL_BADGE_STYLE: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  medium: 'bg-amber-100 text-amber-700 border-amber-300',
  high: 'bg-red-100 text-red-700 border-red-300',
};

function sourceLabel(
  source: string,
  t: (key: string, options?: Record<string, unknown>) => string
): string {
  const normalized = source.toLowerCase();
  if (normalized === 'mineral_fertilizer') {
    return t('dashboard.fdn.source.mineralFertilizer', { defaultValue: 'Mineral fertilizer' });
  }
  if (normalized === 'organic_fertilizer') {
    return t('dashboard.fdn.source.organicFertilizer', { defaultValue: 'Organic fertilizer' });
  }
  if (normalized === 'biological_fixation') {
    return t('dashboard.fdn.source.biologicalFixation', { defaultValue: 'Biological fixation' });
  }
  if (normalized === 'irrigation_water') {
    return t('dashboard.fdn.source.irrigationWater', { defaultValue: 'Irrigation water' });
  }
  if (normalized === 'atmospheric_deposition') {
    return t('dashboard.fdn.source.atmosphericDeposition', { defaultValue: 'Atmospheric deposition' });
  }
  if (normalized === 'seed_import') {
    return t('dashboard.fdn.source.seedImport', { defaultValue: 'Seed import' });
  }
  if (normalized === 'soil_legacy') {
    return t('dashboard.fdn.source.soilLegacy', { defaultValue: 'Soil legacy' });
  }
  if (normalized === 'control_supply') {
    return t('dashboard.fdn.source.controlSupply', { defaultValue: 'Control supply' });
  }
  return source;
}

function methodLabel(
  method: string,
  t: (key: string, options?: Record<string, unknown>) => string
): string {
  const normalized = method.toLowerCase();
  if (normalized === 'measured') {
    return t('dashboard.fdn.metricStatus.measured', { defaultValue: 'Measured' });
  }
  if (normalized === 'estimated' || normalized === 'mixed') {
    return t('dashboard.fdn.metricStatus.estimated', { defaultValue: 'Estimated' });
  }
  if (normalized === 'missing') {
    return t('dashboard.fdn.metricStatus.missing', { defaultValue: 'Missing' });
  }
  return t('dashboard.fdn.metricStatus.unavailable', { defaultValue: 'Unavailable' });
}

export function FdnAssistantPanel({ overview, isLoading }: FdnAssistantPanelProps) {
  const { t } = useTranslation();

  if (isLoading || !overview) {
    return (
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {t('dashboard.fdn.alertAndAssistantTitle', {
              defaultValue: 'Alert and Assistant',
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Separator />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  const fdnMetric = overview.fdnTotalMetric;
  const confidencePercent = hasNumericValue(overview.confidence)
    ? Math.round((overview.confidence ?? 0) * 100)
    : null;
  const fdnValue = formatMetricValue(fdnMetric, 2);

  const quality = overview.dataQualitySummary;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          {t('dashboard.fdn.alertAndAssistantTitle', {
            defaultValue: 'Alert and Assistant',
          })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">
              {t('dashboard.fdn.alertTitle', { defaultValue: 'FDN Alert Summary' })}
            </p>
            <div className="flex gap-2">
              <Badge className={LEVEL_BADGE_STYLE[overview.fdn.level]}>{overview.fdn.level}</Badge>
              <Badge className={metricStatusColor(fdnMetric.status)}>
                {methodLabel(fdnMetric.status, t)}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('dashboard.fdn.fdnTotal', { defaultValue: 'FDN Total' })}:{' '}
            <span className="font-semibold text-foreground">
              {fdnValue ? `${fdnValue}%` : t('dashboard.fdn.metricMissing', { defaultValue: 'Insufficient data' })}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">{overview.fdn.explanation}</p>
          <p className="text-xs text-muted-foreground">
            {t('dashboard.fdn.thresholdSource', { defaultValue: 'Threshold source' })}:{' '}
            <span className="font-medium">{overview.fdn.thresholdSource}</span> |{' '}
            {t('dashboard.fdn.thresholdValues', {
              defaultValue: 'Thresholds',
            })}:{' '}
            <span className="font-medium">
              {overview.fdn.lowMaxExclusive !== null && overview.fdn.mediumMaxExclusive !== null
                ? `<${overview.fdn.lowMaxExclusive}% / <${overview.fdn.mediumMaxExclusive}%`
                : t('dashboard.fdn.metricUnavailable', { defaultValue: 'Unavailable' })}
            </span>{' '}
            |{' '}
            {t('dashboard.fdn.calculationMode', { defaultValue: 'Calculation mode' })}:{' '}
            <span className="font-medium">{overview.calculationMode}</span>
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="font-medium">
            {t('dashboard.fdn.whyAlert', { defaultValue: 'Why this alert' })}
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>
              - {overview.fdn.explanation}
            </li>
            <li>
              - {t('dashboard.fdn.confidence', { defaultValue: 'Confidence' })}:{' '}
              {confidencePercent !== null
                ? `${confidencePercent}%`
                : t('dashboard.fdn.metricMissing', { defaultValue: 'Insufficient data' })}
            </li>
            {overview.missingInputs.length > 0 && (
              <li>
                - {t('dashboard.fdn.missingInputs', { defaultValue: 'Missing inputs' })}:{' '}
                {overview.missingInputs.length}
              </li>
            )}
          </ul>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            <p className="font-medium">
              {t('dashboard.fdn.assistantTitle', {
                defaultValue: 'Recommended Next Actions',
              })}
            </p>
          </div>
          {overview.recommendations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('dashboard.fdn.noRecommendation', {
                defaultValue: 'No recommendation available.',
              })}
            </p>
          ) : (
            <ul className="space-y-2">
              {overview.recommendations.slice(0, 6).map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Leaf className="h-4 w-4 mt-0.5 text-primary" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-muted-foreground">
            {t('dashboard.fdn.recommendationSource', { defaultValue: 'Recommendation source' })}:{' '}
            <span className="font-medium">{overview.recommendationSource}</span>
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="font-medium">
            {t('dashboard.fdn.dataQuality', { defaultValue: 'Data Quality' })}
          </p>
          {quality ? (
            <p className="text-sm text-muted-foreground">{quality.summary}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t('dashboard.fdn.noDataQuality', { defaultValue: 'No data quality details.' })}
            </p>
          )}

          {overview.dataQuality.length > 0 && (
            <details className="rounded-md border border-border p-3">
              <summary className="cursor-pointer text-xs text-muted-foreground">
                {t('dashboard.fdn.dataQualityDetails', { defaultValue: 'View data quality details' })}
              </summary>
              <div className="mt-2 space-y-1">
                {overview.dataQuality.map((row) => (
                  <div key={`${row.source}-${row.method}`} className="text-sm flex justify-between gap-2">
                    <span className="text-muted-foreground">{sourceLabel(row.source, t)}</span>
                    <span className="font-medium">
                      {methodLabel(row.method, t)}
                      {hasNumericValue(row.confidence) ? ` (${Math.round((row.confidence ?? 0) * 100)}%)` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>

        {overview.notes.length > 0 && (
          <>
            <Separator />
            <div className="space-y-1">
              {overview.notes.slice(0, 3).map((note, idx) => (
                <p key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 mt-0.5 text-muted-foreground" />
                  <span>{note}</span>
                </p>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
