// Constants and static data for System Monitoring feature

import {
    Activity,
    Database,
    HardDrive,
    Zap,
    BarChart2,
    Server,
} from 'lucide-react';
import type {
    KPIMetric,
    Alert,
    LogEntry,
    PerformanceDataPoint,
    SlowPageDataPoint,
    ErrorRateDataPoint,
    AlertSeverity,
    AlertStatus,
    LogLevel,
} from './types';

// KPI Metrics with sparkline data
export const KPI_METRICS: KPIMetric[] = [
    {
        title: 'CPU Usage',
        value: '68',
        unit: '%',
        change: 5.2,
        icon: Activity,
        color: '#2563EB',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        sparklineData: [62, 65, 63, 67, 70, 68, 72, 69, 68],
        threshold: 80,
    },
    {
        title: 'Memory',
        value: '74',
        unit: '%',
        change: 3.8,
        icon: Database,
        color: '#10B981',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        sparklineData: [70, 72, 71, 73, 75, 74, 76, 73, 74],
        threshold: 85,
    },
    {
        title: 'Disk Space',
        value: '45',
        unit: '%',
        change: 1.2,
        icon: HardDrive,
        color: '#8B5CF6',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
        sparklineData: [42, 43, 43, 44, 45, 44, 45, 45, 45],
        threshold: 90,
    },
    {
        title: 'API Latency',
        value: '125',
        unit: 'ms',
        change: -8.5,
        icon: Zap,
        color: '#F59E0B',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-600',
        sparklineData: [145, 140, 135, 130, 128, 125, 127, 126, 125],
        threshold: 200,
    },
    {
        title: 'Requests',
        value: '2.4K',
        unit: '/s',
        change: 12.3,
        icon: BarChart2,
        color: '#0891B2',
        bgColor: 'bg-cyan-50',
        textColor: 'text-cyan-600',
        sparklineData: [2000, 2100, 2200, 2300, 2350, 2400, 2380, 2420, 2400],
        threshold: 5000,
    },
    {
        title: 'Uptime',
        value: '99.97',
        unit: '%',
        change: 0.02,
        icon: Server,
        color: '#10B981',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        sparklineData: [99.95, 99.96, 99.96, 99.97, 99.97, 99.97, 99.98, 99.97, 99.97],
        threshold: 99.9,
    },
];

// Initial alerts data
export const INITIAL_ALERTS: Alert[] = [
    {
        id: '1',
        time: '2025-11-11 14:32',
        type: 'Database',
        message: 'Connection pool exhausted on primary database',
        severity: 'critical',
        status: 'new',
    },
    {
        id: '2',
        time: '2025-11-11 14:18',
        type: 'API',
        message: 'High error rate detected on /api/harvest endpoint (12%)',
        severity: 'high',
        status: 'acknowledged',
    },
    {
        id: '3',
        time: '2025-11-11 13:45',
        type: 'Security',
        message: 'Multiple failed login attempts from IP 192.168.1.100',
        severity: 'medium',
        status: 'new',
    },
    {
        id: '4',
        time: '2025-11-11 13:20',
        type: 'Storage',
        message: 'Disk usage approaching threshold (85%)',
        severity: 'medium',
        status: 'acknowledged',
    },
    {
        id: '5',
        time: '2025-11-11 12:50',
        type: 'Performance',
        message: 'Page load time exceeded 3s threshold',
        severity: 'low',
        status: 'resolved',
    },
];

// CPU/Memory performance chart data
export const CPU_MEMORY_DATA: PerformanceDataPoint[] = [
    { time: '10:00', cpu: 62, memory: 70 },
    { time: '11:00', cpu: 65, memory: 72 },
    { time: '12:00', cpu: 63, memory: 71 },
    { time: '13:00', cpu: 67, memory: 73 },
    { time: '14:00', cpu: 70, memory: 75 },
    { time: '15:00', cpu: 68, memory: 74 },
    { time: '16:00', cpu: 72, memory: 76 },
    { time: '17:00', cpu: 69, memory: 73 },
];

// Slowest pages/endpoints data
export const SLOWEST_PAGES_DATA: SlowPageDataPoint[] = [
    { page: '/api/harvest/batch', latency: 3200, p95: 4100 },
    { page: '/api/reports/yield', latency: 2800, p95: 3500 },
    { page: '/api/documents/search', latency: 2400, p95: 3000 },
    { page: '/dashboard/analytics', latency: 2100, p95: 2800 },
    { page: '/api/plots/query', latency: 1900, p95: 2400 },
    { page: '/api/seasons/aggregate', latency: 1600, p95: 2100 },
    { page: '/api/tasks/calendar', latency: 1400, p95: 1800 },
    { page: '/api/users/search', latency: 1200, p95: 1600 },
];

// Error rate distribution by service
export const ERROR_RATE_DATA: ErrorRateDataPoint[] = [
    { service: 'API Gateway', value: 23, color: '#EF4444' },
    { service: 'Database', value: 12, color: '#F59E0B' },
    { service: 'Auth Service', value: 8, color: '#8B5CF6' },
    { service: 'File Storage', value: 5, color: '#0891B2' },
    { service: 'Other', value: 3, color: '#6B7280' },
];

// Log entries
export const LOG_ENTRIES: LogEntry[] = [
    {
        id: '1',
        time: '2025-11-11 14:32:15',
        service: 'database',
        level: 'error',
        user: 'system',
        message: 'Connection timeout: Failed to connect to primary database after 3 retries',
    },
    {
        id: '2',
        time: '2025-11-11 14:28:42',
        service: 'api-gateway',
        level: 'warning',
        user: 'john.doe@farm.com',
        message: 'Rate limit approaching threshold (90/100 requests)',
    },
    {
        id: '3',
        time: '2025-11-11 14:25:18',
        service: 'auth-service',
        level: 'security',
        user: 'unknown',
        message: 'Failed login attempt from IP 192.168.1.100 (attempt 5/5)',
    },
    {
        id: '4',
        time: '2025-11-11 14:20:33',
        service: 'harvest-api',
        level: 'error',
        user: 'sarah.miller@farm.com',
        message: 'Failed to process batch upload: Invalid data format in row 142',
    },
    {
        id: '5',
        time: '2025-11-11 14:15:07',
        service: 'file-storage',
        level: 'info',
        user: 'system',
        message: 'Successfully uploaded document: farming_guide_2025.pdf (2.4 MB)',
    },
    {
        id: '6',
        time: '2025-11-11 14:10:52',
        service: 'notification',
        level: 'info',
        user: 'system',
        message: 'Email notification sent to 234 users: Weekly summary report',
    },
    {
        id: '7',
        time: '2025-11-11 14:05:28',
        service: 'api-gateway',
        level: 'warning',
        user: 'alice@example.com',
        message: 'Slow query detected: /api/reports/yield took 2.8s to complete',
    },
    {
        id: '8',
        time: '2025-11-11 14:00:15',
        service: 'database',
        level: 'info',
        user: 'system',
        message: 'Database backup completed successfully (size: 4.2 GB)',
    },
];

// Badge color mappings
export const SEVERITY_BADGE_COLORS: Record<AlertSeverity, string> = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-green-100 text-green-700 border-green-200',
};

export const STATUS_BADGE_COLORS: Record<AlertStatus, string> = {
    new: 'bg-blue-100 text-blue-700',
    acknowledged: 'bg-amber-100 text-amber-700',
    resolved: 'bg-emerald-100 text-emerald-700',
};

export const LOG_LEVEL_BADGE_COLORS: Record<LogLevel, string> = {
    info: 'bg-blue-100 text-blue-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    security: 'bg-purple-100 text-purple-700',
    all: 'bg-gray-100 text-gray-700',
};
