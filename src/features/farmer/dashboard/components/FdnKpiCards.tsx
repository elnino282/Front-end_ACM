import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardFdnOverview, DashboardMetricStatus } from '@/entities/dashboard';
import { FlaskConical, Leaf, LineChart, Sprout, WavesLadder, Wheat } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  formatMetricValue,
  hasNumericValue,
  isMetricUnavailable,
  metricStatusColor,
} from '../lib/metrics';

interface FdnKpiCardsProps {
  overview: DashboardFdnOverview | null;
  isLoading: boolean;
}

function KpiSkeletonCard() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-3 w-full" />
      </CardContent>
    </Card>
  );
}

function statusLabel(status: DashboardMetricStatus, t: (key: string, options?: Record<string, unknown>) => string) {
  if (status === 'measured') {
    return t('dashboard.fdn.metricStatus.measured', { defaultValue: 'Measured' });
  }
  if (status === 'estimated') {
    return t('dashboard.fdn.metricStatus.estimated', { defaultValue: 'Estimated' });
  }
  if (status === 'missing') {
    return t('dashboard.fdn.metricStatus.missing', { defaultValue: 'Missing' });
  }
  return t('dashboard.fdn.metricStatus.unavailable', { defaultValue: 'Unavailable' });
}

function missingLabel(status: DashboardMetricStatus, t: (key: string, options?: Record<string, unknown>) => string) {
  if (status === 'missing') {
    return t('dashboard.fdn.metricMissing', { defaultValue: 'Insufficient data' });
  }
  return t('dashboard.fdn.metricUnavailable', { defaultValue: 'Unavailable' });
}

export function FdnKpiCards({ overview, isLoading }: FdnKpiCardsProps) {
  const { t } = useTranslation();

  if (isLoading || !overview) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <KpiSkeletonCard key={index} />
        ))}
      </div>
    );
  }

  const scoreMetric = overview.sustainableScoreMetric;
  const fdnTotalMetric = overview.fdnTotalMetric;
  const fdnMineralMetric = overview.fdnMineralMetric;
  const fdnOrganicMetric = overview.fdnOrganicMetric;
  const nueMetric = overview.nueMetric;
  const nOutputMetric = overview.nOutputMetric;
  const nSurplusMetric = overview.nSurplusMetric;
  const yieldMetric = overview.estimatedYieldMetric;

  const scoreValue =
    hasNumericValue(scoreMetric.value) && !isMetricUnavailable(scoreMetric.status)
      ? `${Math.round(scoreMetric.value)}%`
      : null;
  const fdnTotalValue = formatMetricValue(fdnTotalMetric, 1);
  const fdnMineralValue = formatMetricValue(fdnMineralMetric, 1);
  const fdnOrganicValue = formatMetricValue(fdnOrganicMetric, 1);
  const nueValue = formatMetricValue(nueMetric, 1);
  const nOutputValue = formatMetricValue(nOutputMetric, 2);
  const yieldValue = formatMetricValue(yieldMetric, 2);
  const nSurplusValue = formatMetricValue(nSurplusMetric, 2);

  const dayCount = hasNumericValue(overview.currentSeason?.dayCount ?? null)
    ? Math.round(overview.currentSeason?.dayCount ?? 0)
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Leaf className="h-4 w-4 text-primary" />
            {t('dashboard.fdn.sustainableScoreTitle', {
              defaultValue: 'Sustainable Farming Score',
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-3xl font-semibold">
            {scoreValue ?? missingLabel(scoreMetric.status, t)}
          </p>
          <div className="flex items-center gap-2">
            <Badge className={metricStatusColor(scoreMetric.status)}>
              {statusLabel(scoreMetric.status, t)}
            </Badge>
            <Badge variant="outline">{overview.sustainableScore.label}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('dashboard.fdn.scoreExplain', {
              defaultValue: 'Composite product score from dependency, efficiency, productivity, risk and confidence.',
            })}
          </p>
        </CardContent>
      </Card>

      <Card className="border-amber-300 bg-amber-50/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-amber-700" />
            {t('dashboard.fdn.fdnTotal', { defaultValue: 'FDN Total' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-3xl font-semibold">
              {fdnTotalValue ? `${fdnTotalValue}%` : missingLabel(fdnTotalMetric.status, t)}
            </p>
            <Badge className={metricStatusColor(fdnTotalMetric.status)}>
              {statusLabel(fdnTotalMetric.status, t)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{overview.fdn.explanation}</p>
          <p className="text-xs text-muted-foreground">
            {t('dashboard.fdn.thresholdSource', { defaultValue: 'Threshold source' })}:{' '}
            <span className="font-medium">{overview.fdn.thresholdSource}</span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <WavesLadder className="h-4 w-4 text-secondary" />
            {t('dashboard.fdn.fdnMineral', { defaultValue: 'FDN Mineral' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-3xl font-semibold">
            {fdnMineralValue ? `${fdnMineralValue}%` : missingLabel(fdnMineralMetric.status, t)}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('dashboard.fdn.fdnOrganic', { defaultValue: 'Organic share' })}:{' '}
            {fdnOrganicValue ? `${fdnOrganicValue}%` : missingLabel(fdnOrganicMetric.status, t)}
          </p>
          <Badge className={metricStatusColor(fdnMineralMetric.status)}>
            {statusLabel(fdnMineralMetric.status, t)}
          </Badge>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <LineChart className="h-4 w-4 text-primary" />
            {t('dashboard.fdn.nueTitle', { defaultValue: 'NUE' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-3xl font-semibold">
            {nueValue ? `${nueValue}%` : missingLabel(nueMetric.status, t)}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('dashboard.fdn.nOutput', { defaultValue: 'N Output' })}:{' '}
            {nOutputValue
              ? `${nOutputValue} ${nOutputMetric.unit}`
              : missingLabel(nOutputMetric.status, t)}
          </p>
          <Badge className={metricStatusColor(nueMetric.status)}>
            {statusLabel(nueMetric.status, t)}
          </Badge>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sprout className="h-4 w-4 text-secondary" />
            {t('dashboard.fdn.currentSeasonTitle', {
              defaultValue: 'Current Crop / Season',
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-lg font-semibold leading-tight">
            {overview.currentSeason?.cropName ?? t('dashboard.fdn.notAvailable', { defaultValue: 'N/A' })}
          </p>
          <p className="text-xs text-muted-foreground">
            {overview.currentSeason?.seasonName ?? t('dashboard.fdn.notAvailable', { defaultValue: 'N/A' })}
          </p>
          <p className="text-sm text-muted-foreground">
            {dayCount !== null
              ? `${dayCount} ${t('dashboard.fdn.daysLabel', { defaultValue: 'days' })}`
              : t('dashboard.fdn.metricMissing', { defaultValue: 'Insufficient data' })}
            {' - '}
            {overview.currentSeason?.stage ?? t('dashboard.fdn.notAvailable', { defaultValue: 'N/A' })}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Wheat className="h-4 w-4 text-primary" />
            {t('dashboard.fdn.estimatedYieldTitle', {
              defaultValue: 'Estimated Yield',
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-2xl font-semibold">
            {yieldValue
              ? `${yieldValue} ${yieldMetric.unit}`
              : missingLabel(yieldMetric.status, t)}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('dashboard.fdn.nSurplus', { defaultValue: 'N Surplus' })}:{' '}
            {nSurplusValue
              ? `${nSurplusValue} ${nSurplusMetric.unit}`
              : missingLabel(nSurplusMetric.status, t)}
          </p>
          <Badge className={metricStatusColor(yieldMetric.status)}>
            {statusLabel(yieldMetric.status, t)}
          </Badge>
          {isMetricUnavailable(yieldMetric.status) && (
            <p className="text-xs text-muted-foreground">
              {t('dashboard.fdn.yieldMissingHint', {
                defaultValue: 'Add harvest records to improve yield and output metrics.',
              })}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
