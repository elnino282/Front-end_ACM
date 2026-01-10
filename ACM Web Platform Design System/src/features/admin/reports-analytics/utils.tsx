import { AlertCircle, Activity } from 'lucide-react';
import { SystemAlert } from './types';

// ═══════════════════════════════════════════════════════════════
// ALERT UTILITIES
// ═══════════════════════════════════════════════════════════════

export const getAlertIcon = (type: SystemAlert['type']) => {
    switch (type) {
        case 'error':
            return <AlertCircle className="w-4 h-4 text-red-600" />;
        case 'warning':
            return <AlertCircle className="w-4 h-4 text-amber-600" />;
        case 'info':
            return <Activity className="w-4 h-4 text-blue-600" />;
    }
};

export const getAlertBadge = (severity: SystemAlert['severity']) => {
    const colors = {
        high: 'bg-red-100 text-red-700',
        medium: 'bg-amber-100 text-amber-700',
        low: 'bg-blue-100 text-blue-700',
    };
    return colors[severity];
};

export const getHealthStatus = (status: string) => {
    const colors = {
        excellent: 'text-emerald-600',
        good: 'text-blue-600',
        warning: 'text-amber-600',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
};

// ═══════════════════════════════════════════════════════════════
// DATE UTILITIES (Timezone-safe)
// ═══════════════════════════════════════════════════════════════

/**
 * Format date for API requests (YYYY-MM-DD format, timezone-agnostic)
 * Ensures consistent date format regardless of user's timezone
 */
export const formatDateForAPI = (date: string): string => {
    if (!date) return '';
    // Strip time/timezone if present, return only YYYY-MM-DD
    return date.split('T')[0];
};

/**
 * Format date for display in Vietnamese locale
 * Uses Asia/Ho_Chi_Minh timezone for consistency
 */
export const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    try {
        return new Intl.DateTimeFormat('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date(dateString));
    } catch {
        return dateString;
    }
};

/**
 * Validate date range (fromDate should be before or equal to toDate)
 */
export const isValidDateRange = (fromDate: string, toDate: string): boolean => {
    if (!fromDate || !toDate) return true; // Empty dates are valid
    return new Date(fromDate) <= new Date(toDate);
};

// ═══════════════════════════════════════════════════════════════
// NUMBER FORMATTING UTILITIES
// ═══════════════════════════════════════════════════════════════

/**
 * Format number with Vietnamese locale (e.g., 1,234,567)
 */
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('vi-VN').format(num);
};

/**
 * Format currency in VND
 */
export const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(num) + ' ₫';
};

// ═══════════════════════════════════════════════════════════════
// EXPORT UTILITIES
// ═══════════════════════════════════════════════════════════════

interface ExportConfig {
    reportType: 'yield' | 'cost' | 'revenue' | 'profit';
    farmName?: string;
    dateRange?: { from: string; to: string };
}

/**
 * Generate smart export filename with context
 * Example: Yield_Report_FarmA_2026-01-03.csv
 */
export const getExportFileName = (config: ExportConfig): string => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const reportName = config.reportType.charAt(0).toUpperCase() + config.reportType.slice(1);
    const farmPart = config.farmName || 'AllFarms';

    return `${reportName}_Report_${farmPart}_${timestamp}.csv`;
};

/**
 * Generate CSV content from data array
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateCSV = <T extends Record<string, any>>(
    data: T[],
    headers: { key: keyof T; label: string }[]
): string => {
    const headerRow = headers.map(h => h.label).join(',');
    const dataRows = data.map(row =>
        headers.map(h => {
            const value = row[h.key];
            // Escape commas and quotes in values
            const stringValue = String(value ?? '');
            if (stringValue.includes(',') || stringValue.includes('"')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        }).join(',')
    );

    return [headerRow, ...dataRows].join('\n');
};

/**
 * Trigger file download in browser
 */
export const downloadFile = (content: string, filename: string, mimeType = 'text/csv;charset=utf-8;'): void => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

