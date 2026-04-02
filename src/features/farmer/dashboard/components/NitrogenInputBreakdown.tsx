import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardFdnOverview } from '@/entities/dashboard';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';
import { hasNumericValue } from '../lib/metrics';

interface NitrogenInputBreakdownProps {
  overview: DashboardFdnOverview | null;
  isLoading: boolean;
}

export function NitrogenInputBreakdown({ overview, isLoading }: NitrogenInputBreakdownProps) {
  const { t } = useTranslation();

  if (isLoading || !overview) {
    return (
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>
            {t('dashboard.fdn.inputBreakdownTitle', {
              defaultValue: 'Nitrogen Input Breakdown',
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const breakdown = overview.inputsBreakdown;
  const data = [
    {
      name: t('dashboard.fdn.breakdown.mineral', { defaultValue: 'Mineral fertilizer' }),
      value: breakdown.mineralFertilizerN,
    },
    {
      name: t('dashboard.fdn.breakdown.organic', { defaultValue: 'Organic fertilizer' }),
      value: breakdown.organicFertilizerN,
    },
    {
      name: t('dashboard.fdn.breakdown.irrigation', { defaultValue: 'Irrigation water' }),
      value: breakdown.irrigationWaterN,
    },
    {
      name: t('dashboard.fdn.breakdown.fixation', { defaultValue: 'Biological fixation' }),
      value: breakdown.biologicalFixationN,
    },
    {
      name: t('dashboard.fdn.breakdown.deposition', { defaultValue: 'Atmospheric deposition' }),
      value: breakdown.atmosphericDepositionN,
    },
    {
      name: t('dashboard.fdn.breakdown.seed', { defaultValue: 'Seed import' }),
      value: breakdown.seedImportN,
    },
    {
      name: t('dashboard.fdn.breakdown.soilLegacy', { defaultValue: 'Soil legacy' }),
      value: breakdown.soilLegacyN,
    },
    {
      name: t('dashboard.fdn.breakdown.controlSupply', { defaultValue: 'Control supply' }),
      value: breakdown.controlSupplyN,
    },
  ];

  const hasAnyNumericValue = data.some((item) => hasNumericValue(item.value));
  const numericTotal = data.reduce((acc, item) => acc + (hasNumericValue(item.value) ? item.value : 0), 0);
  const shouldShowEmpty =
    !hasAnyNumericValue ||
    (numericTotal === 0 && (overview.dataQualitySummary?.measuredInputCount ?? 0) === 0);

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>
          {t('dashboard.fdn.inputBreakdownTitle', {
            defaultValue: 'Nitrogen Input Breakdown',
          })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {shouldShowEmpty ? (
          <div className="h-72 flex flex-col justify-center gap-3 rounded-md border border-dashed border-border p-4">
            <p className="text-sm font-medium">
              {t('dashboard.fdn.breakdown.emptyTitle', {
                defaultValue: 'Not enough input data to build nitrogen breakdown yet.',
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.fdn.breakdown.emptyHint', {
                defaultValue:
                  'Record fertilizer, irrigation-water and biological input data to unlock this panel.',
              })}
            </p>
            {overview.missingInputs.length > 0 && (
              <p className="text-xs text-amber-700">
                {t('dashboard.fdn.missingInputs', { defaultValue: 'Missing inputs' })}:{' '}
                {overview.missingInputs.join(', ')}
              </p>
            )}
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data
                  .filter((item) => hasNumericValue(item.value))
                  .map((item) => ({ ...item, value: item.value ?? 0 }))}
              >
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-18} textAnchor="end" height={70} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [
                    `${value.toFixed(2)} ${overview.unit}`,
                    t('dashboard.fdn.breakdown.nInput', { defaultValue: 'N input' }),
                  ]}
                />
                <Bar dataKey="value" fill="#84cc16" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
