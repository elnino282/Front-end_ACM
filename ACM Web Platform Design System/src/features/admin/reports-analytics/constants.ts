import {
    Users, Layers, DollarSign, FileText, AlertCircle
} from 'lucide-react';
import type {
    KPIData, UserActivityData, SeasonStatusData, ExpensesData,
    MetricData, SystemAlert, SystemHealthMetric, AlertColors, HealthColors
} from './types';

// Mock data for KPIs
export const KPI_DATA: KPIData[] = [
    {
        title: 'Active Users',
        value: '2,847',
        change: 12.5,
        trend: 'up',
        icon: Users,
        color: '#2563EB',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        subtitle: 'DAU/WAU',
        trendData: [65, 72, 68, 75, 82, 78, 85],
    },
    {
        title: 'Active Seasons',
        value: '156',
        change: 8.2,
        trend: 'up',
        icon: Layers,
        color: '#10B981',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        subtitle: 'Open vs Closed',
        trendData: [120, 125, 135, 142, 148, 152, 156],
    },
    {
        title: 'Total Expenses',
        value: '$124K',
        change: -3.1,
        trend: 'down',
        icon: DollarSign,
        color: '#F59E0B',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-600',
        subtitle: 'This month',
        trendData: [140, 138, 135, 132, 128, 126, 124],
    },
    {
        title: 'Documents',
        value: '1,234',
        change: 18.7,
        trend: 'up',
        icon: FileText,
        color: '#8B5CF6',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
        subtitle: 'Uploaded',
        trendData: [980, 1020, 1080, 1120, 1180, 1210, 1234],
    },
    {
        title: 'Error Alerts',
        value: '23',
        change: -15.3,
        trend: 'down',
        icon: AlertCircle,
        color: '#EF4444',
        bgColor: 'bg-red-50',
        textColor: 'text-red-600',
        subtitle: 'Last 24h',
        trendData: [35, 32, 30, 28, 26, 25, 23],
    },
];

// User activity data
export const USER_ACTIVITY_DATA: UserActivityData[] = [
    { date: 'Jan', farmers: 450, buyers: 280, admins: 35 },
    { date: 'Feb', farmers: 520, buyers: 320, admins: 38 },
    { date: 'Mar', farmers: 580, buyers: 350, admins: 42 },
    { date: 'Apr', farmers: 640, buyers: 380, admins: 45 },
    { date: 'May', farmers: 720, buyers: 420, admins: 48 },
    { date: 'Jun', farmers: 800, buyers: 450, admins: 52 },
];

// Season status data
export const SEASON_STATUS_DATA: SeasonStatusData[] = [
    { name: 'Open', value: 156, color: '#10B981' },
    { name: 'Closed', value: 89, color: '#6B7280' },
    { name: 'Archived', value: 45, color: '#D1D5DB' },
];

// Expenses per season data
export const EXPENSES_DATA: ExpensesData[] = [
    { season: 'Spring 2024', expenses: 45000, yield: 2800 },
    { season: 'Summer 2024', expenses: 52000, yield: 3200 },
    { season: 'Fall 2024', expenses: 38000, yield: 2400 },
    { season: 'Winter 2025', expenses: 28000, yield: 1800 },
    { season: 'Spring 2025', expenses: 48000, yield: 3000 },
    { season: 'Summer 2025', expenses: 55000, yield: 3400 },
];

// Detailed metrics data
export const METRICS_DATA: MetricData[] = [
    {
        id: '1',
        module: 'Plot Management',
        metric: 'Total Plots Created',
        value: '342',
        change: 12.5,
        lastUpdated: '2025-11-11 10:30',
    },
    {
        id: '2',
        module: 'Season Management',
        metric: 'Active Seasons',
        value: '156',
        change: 8.2,
        lastUpdated: '2025-11-11 09:15',
    },
    {
        id: '3',
        module: 'Task Workspace',
        metric: 'Completed Tasks',
        value: '2,847',
        change: 15.3,
        lastUpdated: '2025-11-11 11:45',
    },
    {
        id: '4',
        module: 'Expense Management',
        metric: 'Total Expenses',
        value: '$124,532',
        change: -3.1,
        lastUpdated: '2025-11-11 08:20',
    },
    {
        id: '5',
        module: 'Harvest Management',
        metric: 'Total Yield (tons)',
        value: '3,456',
        change: 18.7,
        lastUpdated: '2025-11-11 12:00',
    },
    {
        id: '6',
        module: 'Sale Management',
        metric: 'Total Revenue',
        value: '$285,420',
        change: 22.4,
        lastUpdated: '2025-11-11 10:15',
    },
    {
        id: '7',
        module: 'Document Management',
        metric: 'Published Documents',
        value: '234',
        change: 10.8,
        lastUpdated: '2025-11-10 16:30',
    },
    {
        id: '8',
        module: 'User Management',
        metric: 'Active Users',
        value: '2,104',
        change: 6.5,
        lastUpdated: '2025-11-11 09:00',
    },
];

// System alerts
export const SYSTEM_ALERTS: SystemAlert[] = [
    {
        id: '1',
        type: 'error',
        message: 'Database connection timeout on farmer-db-01',
        timestamp: '2025-11-11 11:45',
        severity: 'high',
    },
    {
        id: '2',
        type: 'warning',
        message: 'High memory usage on app-server-02 (85%)',
        timestamp: '2025-11-11 10:30',
        severity: 'medium',
    },
    {
        id: '3',
        type: 'info',
        message: 'Scheduled maintenance completed successfully',
        timestamp: '2025-11-11 08:00',
        severity: 'low',
    },
    {
        id: '4',
        type: 'warning',
        message: 'Slow query detected: harvest_data aggregation (3.2s)',
        timestamp: '2025-11-11 09:15',
        severity: 'medium',
    },
];

// System health metrics
export const SYSTEM_HEALTH: SystemHealthMetric[] = [
    { metric: 'API Uptime', value: 99.97, unit: '%', status: 'excellent' },
    { metric: 'Avg Response Time', value: 125, unit: 'ms', status: 'good' },
    { metric: 'Error Rate', value: 0.03, unit: '%', status: 'excellent' },
    { metric: 'Database Load', value: 68, unit: '%', status: 'good' },
];

// Alert badge colors
export const ALERT_COLORS: AlertColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-blue-100 text-blue-700',
};

// Health status colors
export const HEALTH_COLORS: HealthColors = {
    excellent: 'text-emerald-600',
    good: 'text-blue-600',
    warning: 'text-amber-600',
};
