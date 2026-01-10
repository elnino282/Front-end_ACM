import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ReportsHeader } from './components/ReportsHeader';
import { ReportsFilterCard, type ReportFilters } from './components/ReportsFilterCard';
import { ReportsSummaryCards, type SummaryStats } from './components/ReportsSummaryCards';
import {
    ReportsChartTabs,
    type YieldDataItem,
    type CostDataItem,
    type RevenueDataItem,
    type ProfitDataItem,
} from './components/ReportsChartTabs';
import { ErrorBanner } from './components/ErrorState';
import {
    adminReportsApi,
    adminFarmApi,
    adminPlotApi,
    adminCropApi,
    reportsKeys,
    type ReportFilterParams,
} from '@/services/api.admin';
import {
    isValidDateRange,
    getExportFileName,
    generateCSV,
    downloadFile,
} from './utils';

// Default filter values (UI state - allows 'all')
const DEFAULT_FILTERS: ReportFilters = {
    fromDate: '',
    toDate: '',
    farmId: 'all',
    plotId: 'all',
    seasonId: 'all',
    cropId: 'all',
    groupBy: 'season',
    farmerId: 'all',
};

// Convert UI filters to API params (removes 'all', only sends valid values)
const toApiParams = (ui: ReportFilters): ReportFilterParams => ({
    ...(ui.fromDate && { fromDate: ui.fromDate }),
    ...(ui.toDate && { toDate: ui.toDate }),
    ...(ui.cropId !== 'all' && { cropId: parseInt(ui.cropId) }),
    ...(ui.farmId !== 'all' && { farmId: parseInt(ui.farmId) }),
    ...(ui.plotId !== 'all' && { plotId: parseInt(ui.plotId) }),
});

export const ReportsAnalytics: React.FC = () => {
    // Filter state: draft (UI) and applied (sent to API)
    const [filters, setFilters] = useState<ReportFilters>(DEFAULT_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState<ReportFilters>(DEFAULT_FILTERS);
    const [activeTab, setActiveTab] = useState<'yield' | 'cost' | 'revenue' | 'profit'>('yield');

    // Build API params from applied filters (only applied, not draft)
    const apiParams = useMemo(() => toApiParams(appliedFilters), [appliedFilters]);

    // ═══════════════════════════════════════════════════════════════
    // DROPDOWN DATA QUERIES
    // ═══════════════════════════════════════════════════════════════

    const { data: farmsData, isLoading: farmsLoading, error: farmsError } = useQuery({
        queryKey: ['adminFarms'],
        queryFn: () => adminFarmApi.list(),
        staleTime: 1000 * 60 * 10,
    });

    // Fetch plots based on selected farm - only fetch when a farm is selected
    const parsedFarmId = filters.farmId !== 'all' ? parseInt(filters.farmId, 10) : NaN;
    const selectedFarmId = !isNaN(parsedFarmId) ? parsedFarmId : undefined;
    const shouldFetchPlots = selectedFarmId !== undefined;

    const { data: plotsData, isLoading: plotsLoading, error: plotsError } = useQuery({
        queryKey: ['adminPlots', selectedFarmId],
        queryFn: () => adminPlotApi.list({
            size: 1000,
            farmId: selectedFarmId,
        }),
        enabled: shouldFetchPlots,
        staleTime: 1000 * 60 * 10,
    });


    const { data: cropsData, isLoading: cropsLoading, error: cropsError } = useQuery({
        queryKey: ['adminCrops'],
        queryFn: () => adminCropApi.list(),
        staleTime: 1000 * 60 * 10,
    });

    // Transform dropdown data
    // API returns: { status, code, message, result: { items: [...], page, size, totalElements, totalPages } } for paginated
    // API returns: { status, code, message, result: [...] } for non-paginated (crops)
    const farmOptions = useMemo(() => {
        // Farms API: paginated response -> result.items
        const items = farmsData?.result?.items ?? [];
        return items.map((f: { id: number; name: string }) => ({
            value: f.id.toString(),
            label: f.name
        }));
    }, [farmsData]);

    const plotOptions = useMemo(() => {
        // Plots API: paginated response -> result.items
        // Server filters by farmId when a farm is selected
        const items = plotsData?.result?.items ?? [];
        return items.map((p: { id: number; plotName: string }) => ({
            value: p.id.toString(),
            label: p.plotName
        }));
    }, [plotsData]);

    const cropOptions = useMemo(() => {
        // Crops API: non-paginated response -> result is array directly
        const items = cropsData?.result ?? [];
        // Handle case where result might be an object with 'items' property (if paginated)
        const content = Array.isArray(items) ? items : (items?.items ?? []);
        return content.map((c: { id: number; cropName: string }) => ({
            value: c.id.toString(),
            label: c.cropName
        }));
    }, [cropsData]);

    // ═══════════════════════════════════════════════════════════════
    // REPORT DATA QUERIES
    // ═══════════════════════════════════════════════════════════════

    const {
        data: yieldReport,
        isLoading: yieldLoading,
        isFetching: yieldFetching,
        isError: yieldError,
        refetch: refetchYield
    } = useQuery({
        queryKey: reportsKeys.yield(apiParams),
        queryFn: () => adminReportsApi.getYieldReport(apiParams),
        placeholderData: keepPreviousData, // 🔥 Smooth UX: keeps old data visible while fetching
        staleTime: 1000 * 60 * 5,
    });

    const {
        data: costReport,
        isLoading: costLoading,
        isFetching: costFetching,
        isError: costError,
        refetch: refetchCost
    } = useQuery({
        queryKey: reportsKeys.cost(apiParams),
        queryFn: () => adminReportsApi.getCostReport(apiParams),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });

    const {
        data: revenueReport,
        isLoading: revenueLoading,
        isFetching: revenueFetching,
        isError: revenueError,
        refetch: refetchRevenue
    } = useQuery({
        queryKey: reportsKeys.revenue(apiParams),
        queryFn: () => adminReportsApi.getRevenueReport(apiParams),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });

    const {
        data: profitReport,
        isLoading: profitLoading,
        isFetching: profitFetching,
        isError: profitError,
        refetch: refetchProfit
    } = useQuery({
        queryKey: reportsKeys.profit(apiParams),
        queryFn: () => adminReportsApi.getProfitReport(apiParams),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });

    const isLoading = yieldLoading || costLoading || revenueLoading || profitLoading;
    const isFetching = yieldFetching || costFetching || revenueFetching || profitFetching;
    const hasError = yieldError || costError || revenueError || profitError;

    // ═══════════════════════════════════════════════════════════════
    // COMPUTED DATA
    // ═══════════════════════════════════════════════════════════════

    // Summary statistics (calculated from totals, not avg of avgs)
    const summaryStats: SummaryStats = useMemo(() => {
        const totalYield = yieldReport?.reduce((s, i) => s + (i.actualYieldKg ?? 0), 0) ?? 0;
        const totalCost = costReport?.reduce((s, i) => s + (i.totalExpense ?? 0), 0) ?? 0;
        const totalRevenue = revenueReport?.reduce((s, i) => s + (i.totalRevenue ?? 0), 0) ?? 0;

        // Cost/kg from totals (not avg of per-season costPerKg)
        const costPerKg = totalYield > 0 ? totalCost / totalYield : null;

        // Profit calculations
        const grossProfit = totalRevenue - totalCost;
        const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : null;

        return {
            totalYield: Math.round(totalYield),
            totalCost: Math.round(totalCost),
            costPerKg: costPerKg != null ? Math.round(costPerKg * 1000) / 1000 : null,
            totalRevenue: Math.round(totalRevenue),
            grossProfit: Math.round(grossProfit),
            profitMargin: profitMargin != null ? Math.round(profitMargin * 10) / 10 : null,
        };
    }, [yieldReport, costReport, revenueReport]);

    // Yield chart data
    const yieldData: YieldDataItem[] = useMemo(() => {
        if (!yieldReport) return [];

        return yieldReport.map(item => ({
            group: item.seasonName || `Season ${item.seasonId}`,
            expected: item.expectedYieldKg ?? 0,
            actual: item.actualYieldKg ?? 0,
            varianceKg: (item.actualYieldKg ?? 0) - (item.expectedYieldKg ?? 0),
            variancePercent: item.variancePercent ?? 0,
        }));
    }, [yieldReport]);

    // Cost chart data
    const costData: CostDataItem[] = useMemo(() => {
        if (!costReport) return [];

        return costReport.map(item => ({
            group: item.seasonName || `Season ${item.seasonId}`,
            totalCost: item.totalExpense ?? 0,
            costPerKg: item.costPerKg ?? 0,
        }));
    }, [costReport]);

    // Revenue chart data
    const revenueData: RevenueDataItem[] = useMemo(() => {
        if (!revenueReport) return [];

        return revenueReport.map(item => {
            const revenue = item.totalRevenue ?? 0;
            const matchingCost = costReport?.find(c => c.seasonId === item.seasonId);
            const cost = matchingCost ? (matchingCost.totalExpense ?? 0) : 0;
            const profit = revenue - cost;
            const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

            return {
                group: item.seasonName || `Season ${item.seasonId}`,
                revenue,
                profit,
                profitMargin,
            };
        });
    }, [revenueReport, costReport]);

    // Profit chart data (from profit endpoint)
    const profitData: ProfitDataItem[] = useMemo(() => {
        if (!profitReport) return [];

        return profitReport.map(item => ({
            group: item.seasonName || `Season ${item.seasonId}`,
            revenue: item.totalRevenue ?? 0,
            expense: item.totalExpense ?? 0,
            grossProfit: item.grossProfit ?? 0,
            profitMargin: item.profitMargin,
        }));
    }, [profitReport]);

    // ═══════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════

    const handleRefresh = async () => {
        try {
            await Promise.all([
                refetchYield(),
                refetchCost(),
                refetchRevenue(),
                refetchProfit(),
            ]);
            toast.success('Data refreshed successfully');
        } catch {
            toast.error('Failed to refresh data');
        }
    };

    // Dynamic export based on active tab with smart file naming
    const handleExport = () => {
        // Get data and headers based on active tab
        let csvContent: string;
        const farmName = filters.farmId !== 'all'
            ? farmOptions.find((f: { value: string; label: string }) => f.value === filters.farmId)?.label
            : undefined;

        switch (activeTab) {
            case 'yield':
                csvContent = generateCSV(yieldData, [
                    { key: 'group', label: 'Season' },
                    { key: 'expected', label: 'Expected (kg)' },
                    { key: 'actual', label: 'Actual (kg)' },
                    { key: 'varianceKg', label: 'Variance (kg)' },
                    { key: 'variancePercent', label: 'Variance (%)' },
                ]);
                break;
            case 'cost':
                csvContent = generateCSV(costData, [
                    { key: 'group', label: 'Season' },
                    { key: 'totalCost', label: 'Total Cost (VND)' },
                    { key: 'costPerKg', label: 'Cost per kg (VND)' },
                ]);
                break;
            case 'revenue':
                csvContent = generateCSV(revenueData, [
                    { key: 'group', label: 'Season' },
                    { key: 'revenue', label: 'Revenue (VND)' },
                    { key: 'profit', label: 'Profit (VND)' },
                    { key: 'profitMargin', label: 'Profit Margin (%)' },
                ]);
                break;
            case 'profit':
                csvContent = generateCSV(profitData, [
                    { key: 'group', label: 'Season' },
                    { key: 'revenue', label: 'Revenue (VND)' },
                    { key: 'expense', label: 'Expense (VND)' },
                    { key: 'grossProfit', label: 'Gross Profit (VND)' },
                    { key: 'profitMargin', label: 'Profit Margin (%)' },
                ]);
                break;
            default:
                csvContent = '';
        }

        const fileName = getExportFileName({ reportType: activeTab, farmName });
        downloadFile(csvContent, fileName);

        const recordCount = activeTab === 'yield' ? yieldData.length
            : activeTab === 'cost' ? costData.length
                : activeTab === 'revenue' ? revenueData.length
                    : profitData.length;

        toast.success(`Exported ${recordCount} records to ${fileName}`);
    };

    const handleSaveView = () => {
        // Save current filter state to localStorage or API
        localStorage.setItem('reports_filters', JSON.stringify(appliedFilters));
        toast.success('View saved successfully');
    };

    const handleFiltersChange = (newFilters: ReportFilters) => {
        // Reset plotId when farmId changes
        if (newFilters.farmId !== filters.farmId) {
            setFilters({ ...newFilters, plotId: 'all' });
        } else {
            setFilters(newFilters);
        }
    };

    const handleApplyFilters = () => {
        // Date range validation
        if (filters.fromDate && filters.toDate && !isValidDateRange(filters.fromDate, filters.toDate)) {
            toast.error('Invalid date range: Start date must be before or equal to end date');
            return;
        }

        setAppliedFilters(filters);
        toast.success('Filters applied');
    };

    const handleResetFilters = () => {
        setFilters(DEFAULT_FILTERS);
        setAppliedFilters(DEFAULT_FILTERS);
        toast.info('Filters reset');
    };

    const handleOpenMore = () => {
        // Open advanced filter drawer/modal
        toast.info('More filters coming soon');
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════

    return (
        <div className="p-6 space-y-6 bg-[#fafafa] min-h-full">
            {/* Header - Sticky style matching Figma */}
            <ReportsHeader
                onRefresh={handleRefresh}
                onExport={handleExport}
                onSaveView={handleSaveView}
                isLoading={isLoading}
            />

            {/* Filter Card - Inline horizontal layout */}
            <ReportsFilterCard
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                onOpenMore={handleOpenMore}
                farms={farmOptions}
                plots={plotOptions}
                crops={cropOptions}
                isPlotDisabled={filters.farmId === 'all'}
            />

            {/* Error Banner - Show when any query fails */}
            {hasError && (
                <ErrorBanner
                    message="Failed to load some report data. Please try again."
                    onRetry={handleRefresh}
                    isRetrying={isFetching}
                />
            )}

            {/* Summary Cards - 5 column grid */}
            <ReportsSummaryCards
                stats={summaryStats}
                isLoading={isLoading}
            />

            {/* Chart Tabs - With collapsible table */}
            <ReportsChartTabs
                yieldData={yieldData}
                costData={costData}
                revenueData={revenueData}
                profitData={profitData}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onReset={handleResetFilters}
                isLoading={isLoading}
            />
        </div>
    );
};
