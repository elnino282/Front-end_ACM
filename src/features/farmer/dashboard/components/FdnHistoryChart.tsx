import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardHistoryPoint } from '@/entities/dashboard';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';
import { hasNumericValue } from '../lib/metrics';

interface FdnHistoryChartProps {
  history: DashboardHistoryPoint[];
  isLoading: boolean;
}

export function FdnHistoryChart({ history, isLoading }: FdnHistoryChartProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>
            {t('dashboard.fdn.historyTitle', { defaultValue: 'Historical Trends' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = history
    .filter((point) =>
      hasNumericValue(point.fdnTotal) || hasNumericValue(point.nue) || hasNumericValue(point.yield)
    )
    .map((point) => ({
      label: point.seasonName,
      fdn: hasNumericValue(point.fdnTotal) ? point.fdnTotal : null,
      nue: hasNumericValue(point.nue) ? point.nue : null,
      yield: hasNumericValue(point.yield) ? point.yield : null,
    }));

  if (!chartData.length) {
    return (
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>
            {t('dashboard.fdn.historyTitle', { defaultValue: 'Historical Trends' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-dashed border-border p-4 space-y-2">
            <p className="text-sm font-medium">
              {t('dashboard.fdn.noHistory', {
                defaultValue: 'No historical season metrics available.',
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.fdn.noHistoryHint', {
                defaultValue:
                  'Complete additional seasons and keep nutrient + harvest records to unlock trend analysis.',
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>
          {t('dashboard.fdn.historyTitle', { defaultValue: 'Historical Trends' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="fdn"
                name={t('dashboard.fdn.fdnTotal', { defaultValue: 'FDN total' })}
                stroke="#f59e0b"
                strokeWidth={2}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="nue"
                name={t('dashboard.fdn.nueTitle', { defaultValue: 'NUE' })}
                stroke="#16a34a"
                strokeWidth={2}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="yield"
                name={t('dashboard.fdn.estimatedYieldTitle', { defaultValue: 'Yield' })}
                stroke="#2563eb"
                strokeWidth={2}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
