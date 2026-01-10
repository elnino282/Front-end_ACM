// Type definitions for System Monitoring feature

export type DateRange = 'today' | '24h' | '7d' | '30d';
export type LogLevel = 'all' | 'info' | 'error' | 'warning' | 'security';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'new' | 'acknowledged' | 'resolved';
export type IncidentStatus = 'open' | 'in-progress' | 'resolved';

export interface KPIMetric {
    title: string;
    value: string;
    unit: string;
    change: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    textColor: string;
    sparklineData: number[];
    threshold: number;
}

export interface Alert {
    id: string;
    time: string;
    type: string;
    message: string;
    severity: AlertSeverity;
    status: AlertStatus;
}

export interface LogEntry {
    id: string;
    time: string;
    service: string;
    level: LogLevel;
    user: string;
    message: string;
}

export interface DownloadConfig {
    types: {
        error: boolean;
        system: boolean;
        auth: boolean;
        ai: boolean;
    };
    dateRange: DateRange;
    sizeCap: string;
}

export interface IncidentForm {
    title: string;
    description: string;
    severity: AlertSeverity;
    assignedTo: string;
    status: IncidentStatus;
}

export interface PerformanceDataPoint {
    time: string;
    cpu: number;
    memory: number;
}

export interface SlowPageDataPoint {
    page: string;
    latency: number;
    p95: number;
}

export interface ErrorRateDataPoint {
    service: string;
    value: number;
    color: string;
}
