import type { DashboardMetricStatus, DashboardMetricValue } from '@/entities/dashboard';

export function hasNumericValue(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function formatMetricNumber(
  value: number | null | undefined,
  decimals = 2
): string | null {
  if (!hasNumericValue(value)) {
    return null;
  }
  return value.toFixed(decimals);
}

export function metricStatusColor(status: DashboardMetricStatus): string {
  if (status === 'measured') return 'bg-emerald-100 text-emerald-700 border-emerald-300';
  if (status === 'estimated') return 'bg-amber-100 text-amber-700 border-amber-300';
  if (status === 'missing') return 'bg-slate-100 text-slate-700 border-slate-300';
  return 'bg-zinc-100 text-zinc-700 border-zinc-300';
}

export function isMetricUnavailable(status: DashboardMetricStatus): boolean {
  return status === 'missing' || status === 'unavailable';
}

export function formatMetricValue(
  metric: DashboardMetricValue,
  decimals = 2
): string | null {
  if (isMetricUnavailable(metric.status)) {
    return null;
  }
  return formatMetricNumber(metric.value, decimals);
}
