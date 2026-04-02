export type DateRange = 'week' | 'month' | 'quarter' | 'custom';

export interface MetricData {
    id: string;
    module: string;
    metric: string;
    value: string;
    change: number;
    lastUpdated: string;
}

export interface SystemAlert {
    id: string;
    type: 'error' | 'warning' | 'info';
    message: string;
    timestamp: string;
    severity: 'high' | 'medium' | 'low';
}

export interface KPIData {
    title: string;
    value: string;
    change: number;
    trend: 'up' | 'down';
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    textColor: string;
    subtitle: string;
    trendData: number[];
}

export interface UserActivityData {
    date: string;
    farmers: number;
    buyers: number;
    admins: number;
}

export interface SeasonStatusData {
    name: string;
    value: number;
    color: string;
}

export interface ExpensesData {
    season: string;
    expenses: number;
    yield: number;
}

export interface SystemHealthMetric {
    metric: string;
    value: number;
    unit: string;
    status: string;
}

export interface UserActivityFilter {
    farmers: boolean;
    buyers: boolean;
    admins: boolean;
}

export interface AlertColors {
    high: string;
    medium: string;
    low: string;
}

export interface HealthColors {
    excellent: string;
    good: string;
    warning: string;
}
