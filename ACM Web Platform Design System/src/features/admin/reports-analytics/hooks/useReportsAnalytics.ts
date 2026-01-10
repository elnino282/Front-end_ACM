import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Users, Layers, DollarSign, FileText, AlertCircle } from 'lucide-react';
import type { DateRange, UserActivityFilter, KPIData } from '../types';
import {
    USER_ACTIVITY_DATA,
    SYSTEM_ALERTS,
    SYSTEM_HEALTH,
} from '../constants';
import {
    adminReportsApi,
    adminDashboardStatsApi,
    dashboardStatsKeys,
    reportsKeys,
    type YieldReport,
    type CostReport,
    type RevenueReport,
    type TaskPerformanceReport,
    type InventoryOnHandReport,
    type IncidentStatisticsReport,
} from '@/services/api.admin';

export const useReportsAnalytics = () => {
    // State management
    const [dateRange, setDateRange] = useState<DateRange>('month');
    const [filterOpen, setFilterOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [userActivityFilter, setUserActivityFilter] = useState<UserActivityFilter>({
        farmers: true,
        buyers: true,
        admins: true,
    });

    // Filter state
    const [cropFilter, setCropFilter] = useState('all');
    const [regionFilter, setRegionFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');

    // Year filter - default to current year
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Enable deferred queries after mount for prioritized loading
    const [enableDeferred, setEnableDeferred] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setEnableDeferred(true), 500);
        return () => clearTimeout(timer);
    }, []);

    // ═══════════════════════════════════════════════════════════════
    // REAL API QUERIES - Phase 1 (Critical - load immediately)
    // ═══════════════════════════════════════════════════════════════

    const { data: taskPerformance, isLoading: taskLoading, error: taskError } = useQuery({
        queryKey: reportsKeys.taskPerformance(selectedYear),
        queryFn: () => adminReportsApi.getTaskPerformance(selectedYear),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const { data: incidentStatistics, isLoading: incidentLoading, error: incidentError } = useQuery({
        queryKey: reportsKeys.incidentStatistics(selectedYear),
        queryFn: () => adminReportsApi.getIncidentStatistics(selectedYear),
        staleTime: 1000 * 60 * 5,
    });

    // Dashboard Stats for KPIs (real-time counts)
    const { data: dashboardStats, isLoading: dashboardLoading, error: dashboardError } = useQuery({
        queryKey: dashboardStatsKeys.stats(),
        queryFn: () => adminDashboardStatsApi.getStats(),
        staleTime: 1000 * 60 * 2, // 2 minutes - more frequent refresh for dashboard
    });

    // ═══════════════════════════════════════════════════════════════
    // REAL API QUERIES - Phase 2 (Deferred loading after 500ms)
    // ═══════════════════════════════════════════════════════════════

    const { data: yieldReport, isLoading: yieldLoading, error: yieldError } = useQuery({
        queryKey: reportsKeys.yield(selectedYear, cropFilter !== 'all' ? parseInt(cropFilter) : undefined),
        queryFn: () => adminReportsApi.getYieldReport({
            year: selectedYear,
            cropId: cropFilter !== 'all' ? parseInt(cropFilter) : undefined,
        }),
        enabled: enableDeferred,
        staleTime: 1000 * 60 * 5,
    });

    const { data: costReport, isLoading: costLoading, error: costError } = useQuery({
        queryKey: reportsKeys.cost(selectedYear),
        queryFn: () => adminReportsApi.getCostReport(selectedYear),
        enabled: enableDeferred,
        staleTime: 1000 * 60 * 5,
    });

    const { data: revenueReport, isLoading: revenueLoading, error: revenueError } = useQuery({
        queryKey: reportsKeys.revenue(selectedYear),
        queryFn: () => adminReportsApi.getRevenueReport(selectedYear),
        enabled: enableDeferred,
        staleTime: 1000 * 60 * 5,
    });

    // ═══════════════════════════════════════════════════════════════
    // REAL API QUERIES - Phase 3 (Load on demand)
    // ═══════════════════════════════════════════════════════════════

    const { data: inventoryOnHand, isLoading: inventoryLoading, error: inventoryError } = useQuery({
        queryKey: reportsKeys.inventoryOnHand(),
        queryFn: () => adminReportsApi.getInventoryOnHand(),
        enabled: enableDeferred,
        staleTime: 1000 * 60 * 5,
    });

    // ═══════════════════════════════════════════════════════════════
    // COMPUTED DATA - Transform API data for charts
    // ═══════════════════════════════════════════════════════════════

    // Season status data for pie chart - derive from yield report
    const seasonStatusData = useMemo(() => {
        if (!yieldReport) return [];

        // Count seasons with positive/negative/zero variance
        let positive = 0, negative = 0, onTarget = 0;
        yieldReport.forEach(item => {
            const variance = item.variancePercent ?? 0;
            if (variance > 5) positive++;
            else if (variance < -5) negative++;
            else onTarget++;
        });

        return [
            { name: 'Above Target', value: positive, color: '#10B981' },
            { name: 'On Target', value: onTarget, color: '#6B7280' },
            { name: 'Below Target', value: negative, color: '#EF4444' },
        ].filter(item => item.value > 0);
    }, [yieldReport]);

    // Expenses data for bar chart - from cost report
    const expensesData = useMemo(() => {
        if (!costReport) return [];

        return costReport.map(item => ({
            season: item.seasonName || `Season ${item.seasonId}`,
            expenses: item.totalExpense ?? 0,
            yield: item.totalYieldKg ?? 0,
        }));
    }, [costReport]);

    // Metrics data for the table
    const metricsData = useMemo(() => {
        const metrics = [];

        if (taskPerformance) {
            metrics.push(
                { id: '1', module: 'Task Management', metric: 'Total Tasks', value: String(taskPerformance.totalTasks), change: 0, lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ') },
                { id: '2', module: 'Task Management', metric: 'Completion Rate', value: `${taskPerformance.completionRate ?? 0}%`, change: Number(taskPerformance.completionRate) ?? 0, lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ') },
                { id: '3', module: 'Task Management', metric: 'Overdue Rate', value: `${taskPerformance.overdueRate ?? 0}%`, change: -(Number(taskPerformance.overdueRate) ?? 0), lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ') },
            );
        }

        if (incidentStatistics) {
            metrics.push(
                { id: '4', module: 'Incident Management', metric: 'Total Incidents', value: String(incidentStatistics.totalCount), change: 0, lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ') },
                { id: '5', module: 'Incident Management', metric: 'Open Incidents', value: String(incidentStatistics.openCount), change: 0, lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ') },
                { id: '6', module: 'Incident Management', metric: 'Avg Resolution (days)', value: String(incidentStatistics.averageResolutionDays ?? 'N/A'), change: 0, lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ') },
            );
        }

        if (inventoryOnHand) {
            const totalQuantity = inventoryOnHand.reduce((sum, i) => sum + (Number(i.totalQuantityOnHand) || 0), 0);
            const expiredCount = inventoryOnHand.reduce((sum, i) => sum + i.expiredLots, 0);
            metrics.push(
                { id: '7', module: 'Inventory', metric: 'Total On-Hand Qty', value: totalQuantity.toLocaleString(), change: 0, lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ') },
                { id: '8', module: 'Inventory', metric: 'Expired Lots', value: String(expiredCount), change: -expiredCount, lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ') },
            );
        }

        return metrics;
    }, [taskPerformance, incidentStatistics, inventoryOnHand]);

    // ═══════════════════════════════════════════════════════════════
    // COMPUTED KPI DATA - Transform API data to KPI card format
    // ═══════════════════════════════════════════════════════════════

    const kpiData: KPIData[] = useMemo(() => {
        // Calculate active seasons count from seasonStatusCounts
        const activeSeasons = dashboardStats?.seasonStatusCounts
            ?.filter(s => s.status === 'OPEN' || s.status === 'IN_PROGRESS')
            ?.reduce((sum, s) => sum + s.total, 0) ?? 0;

        // Calculate total expenses from cost report
        const totalExpenses = costReport?.reduce((sum, c) => sum + (Number(c.totalExpense) || 0), 0) ?? 0;
        const expenseFormatted = totalExpenses >= 1000000
            ? `${(totalExpenses / 1000000).toFixed(1)}M`
            : totalExpenses >= 1000
                ? `${Math.round(totalExpenses / 1000)}K`
                : String(totalExpenses);

        // Get document count - placeholder (could be from inventory lots or documents API)
        const documentCount = inventoryOnHand?.reduce((sum, i) => sum + i.totalLots, 0) ?? 0;

        // Error alerts = open incidents
        const errorAlerts = incidentStatistics?.openCount ?? 0;

        return [
            {
                title: 'Active Users',
                value: dashboardStats?.summary?.totalUsers?.toLocaleString() ?? '0',
                change: 12.5,
                trend: 'up' as const,
                icon: Users,
                color: '#2563EB',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-600',
                subtitle: 'DAU/WAU',
                trendData: [65, 72, 68, 75, 82, 78, 85],
            },
            {
                title: 'Active Seasons',
                value: activeSeasons.toLocaleString(),
                change: 8.2,
                trend: 'up' as const,
                icon: Layers,
                color: '#10B981',
                bgColor: 'bg-emerald-50',
                textColor: 'text-emerald-600',
                subtitle: 'Open vs Closed',
                trendData: [120, 125, 135, 142, 148, 152, activeSeasons || 156],
            },
            {
                title: 'Total Expenses',
                value: `$${expenseFormatted}`,
                change: -3.1,
                trend: 'down' as const,
                icon: DollarSign,
                color: '#F59E0B',
                bgColor: 'bg-amber-50',
                textColor: 'text-amber-600',
                subtitle: 'This month',
                trendData: [140, 138, 135, 132, 128, 126, 124],
            },
            {
                title: 'Documents',
                value: documentCount.toLocaleString(),
                change: 18.7,
                trend: 'up' as const,
                icon: FileText,
                color: '#8B5CF6',
                bgColor: 'bg-purple-50',
                textColor: 'text-purple-600',
                subtitle: 'Uploaded',
                trendData: [980, 1020, 1080, 1120, 1180, 1210, documentCount || 1234],
            },
            {
                title: 'Error Alerts',
                value: String(errorAlerts),
                change: errorAlerts > 0 ? 15.3 : -15.3,
                trend: errorAlerts > 0 ? 'up' as const : 'down' as const,
                icon: AlertCircle,
                color: '#EF4444',
                bgColor: 'bg-red-50',
                textColor: 'text-red-600',
                subtitle: 'Last 24h',
                trendData: [35, 32, 30, 28, 26, 25, errorAlerts || 23],
            },
        ];
    }, [dashboardStats, costReport, inventoryOnHand, incidentStatistics]);

    // Loading states
    const isLoading = taskLoading || incidentLoading || dashboardLoading;
    const isDeferredLoading = yieldLoading || costLoading || revenueLoading || inventoryLoading;

    // Error handling
    const hasError = taskError || incidentError || yieldError || costError || revenueError || inventoryError || dashboardError;

    // ═══════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════

    const handleExport = (format: string) => {
        toast.success(`Exporting report as ${format.toUpperCase()}`, {
            description: 'Your report will be downloaded shortly.',
        });
    };

    const handleFilterClear = () => {
        setCropFilter('all');
        setRegionFilter('all');
        setRoleFilter('all');
    };

    const handleFilterApply = () => {
        setFilterOpen(false);
    };

    const handleSettingsSave = () => {
        toast.success('Settings saved', {
            description: 'Report settings have been updated successfully.',
        });
        setSettingsOpen(false);
    };

    // Computed data for user activity (still using mock for now)
    const filteredUserActivityData = USER_ACTIVITY_DATA.map(item => ({
        date: item.date,
        ...(userActivityFilter.farmers && { farmers: item.farmers }),
        ...(userActivityFilter.buyers && { buyers: item.buyers }),
        ...(userActivityFilter.admins && { admins: item.admins }),
    }));

    return {
        // State
        dateRange,
        setDateRange,
        filterOpen,
        setFilterOpen,
        settingsOpen,
        setSettingsOpen,
        userActivityFilter,
        setUserActivityFilter,
        cropFilter,
        setCropFilter,
        regionFilter,
        setRegionFilter,
        roleFilter,
        setRoleFilter,
        selectedYear,
        setSelectedYear,

        // Real API Data
        yieldReport: yieldReport ?? [],
        costReport: costReport ?? [],
        revenueReport: revenueReport ?? [],
        taskPerformance,
        inventoryOnHand: inventoryOnHand ?? [],
        incidentStatistics,

        // Real-time KPI Data
        kpiData,
        userActivityData: USER_ACTIVITY_DATA,
        seasonStatusData,
        expensesData,
        metricsData,
        systemAlerts: SYSTEM_ALERTS,
        systemHealth: SYSTEM_HEALTH,
        filteredUserActivityData,

        // Loading states
        isLoading,
        isDeferredLoading,
        hasError,

        // Handlers
        handleExport,
        handleFilterClear,
        handleFilterApply,
        handleSettingsSave,
    };
};
