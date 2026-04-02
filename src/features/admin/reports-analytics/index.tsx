import {
  adminCropApi,
  adminFarmApi,
  adminPlotApi,
  adminReportsApi,
  adminVarietyApi,
  reportsKeys,
  type ReportFilterParams,
} from "@/services/api.admin";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ErrorBanner } from "./components/ErrorState";
import { ReportsChartTabs } from "./components/ReportsChartTabs";
import {
  ReportsFilterCard,
  type ReportFilters,
} from "./components/ReportsFilterCard";
import { ReportsHeader } from "./components/ReportsHeader";
import { ReportsSummaryCards } from "./components/ReportsSummaryCards";
import {
  downloadBlob,
  getExportFileName,
  isValidDateRange,
  parseFilenameFromDisposition,
} from "./utils";

// Default filter values (UI state - allows 'all')
const DEFAULT_FILTERS: ReportFilters = {
  dateFrom: "",
  dateTo: "",
  farmId: "all",
  plotId: "all",
  cropId: "all",
  varietyId: "all",
};

// Convert UI filters to API params (removes 'all', only sends valid values)
const toApiParams = (ui: ReportFilters): ReportFilterParams => ({
  ...(ui.dateFrom && { dateFrom: ui.dateFrom }),
  ...(ui.dateTo && { dateTo: ui.dateTo }),
  ...(ui.cropId !== "all" && { cropId: parseInt(ui.cropId, 10) }),
  ...(ui.farmId !== "all" && { farmId: parseInt(ui.farmId, 10) }),
  ...(ui.plotId !== "all" && { plotId: parseInt(ui.plotId, 10) }),
  ...(ui.varietyId !== "all" && { varietyId: parseInt(ui.varietyId, 10) }),
});

export const ReportsAnalytics: React.FC = () => {
  // Filter state: draft (UI) and applied (sent to API)
  const [draftFilters, setDraftFilters] =
    useState<ReportFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<ReportFilters>(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState<
    "yield" | "cost" | "revenue" | "profit"
  >("yield");
  const [costGranularity, setCostGranularity] = useState<
    "DAY" | "WEEK" | "MONTH"
  >("MONTH");
  const [isExporting, setIsExporting] = useState(false);

  const apiParams = useMemo(
    () => toApiParams(appliedFilters),
    [appliedFilters],
  );
  const analyticsParams = useMemo(
    () => ({ ...apiParams, analytics: true }),
    [apiParams],
  );
  const costParams = useMemo(
    () => ({ ...apiParams, analytics: true, granularity: costGranularity }),
    [apiParams, costGranularity],
  );

  const hasPendingChanges = useMemo(
    () => JSON.stringify(draftFilters) !== JSON.stringify(appliedFilters),
    [draftFilters, appliedFilters],
  );

  // DROPDOWN DATA QUERIES
  const { data: farmsData } = useQuery({
    queryKey: ["adminFarms"],
    queryFn: () => adminFarmApi.list(),
    staleTime: 1000 * 60 * 10,
  });

  const parsedFarmId =
    draftFilters.farmId !== "all" ? parseInt(draftFilters.farmId, 10) : NaN;
  const selectedFarmId = Number.isFinite(parsedFarmId)
    ? parsedFarmId
    : undefined;

  const { data: plotsData } = useQuery({
    queryKey: ["adminPlots", selectedFarmId],
    queryFn: () =>
      adminPlotApi.list({
        size: 1000,
        farmId: selectedFarmId,
      }),
    enabled: selectedFarmId !== undefined,
    staleTime: 1000 * 60 * 10,
  });

  const { data: cropsData } = useQuery({
    queryKey: ["adminCrops"],
    queryFn: () => adminCropApi.list(),
    staleTime: 1000 * 60 * 10,
  });

  const parsedCropId =
    draftFilters.cropId !== "all" ? parseInt(draftFilters.cropId, 10) : NaN;
  const selectedCropId = Number.isFinite(parsedCropId)
    ? parsedCropId
    : undefined;

  const { data: varietiesData } = useQuery({
    queryKey: ["adminVarieties", selectedCropId],
    queryFn: () => adminVarietyApi.list(selectedCropId),
    enabled: selectedCropId !== undefined,
    staleTime: 1000 * 60 * 10,
  });

  const farmOptions = useMemo(() => {
    const items = farmsData?.result?.items ?? [];
    return items.map((f: { id: number; name: string }) => ({
      value: f.id.toString(),
      label: f.name,
    }));
  }, [farmsData]);

  const plotOptions = useMemo(() => {
    const items = plotsData?.result?.items ?? [];
    return items.map((p: { id: number; plotName: string }) => ({
      value: p.id.toString(),
      label: p.plotName,
    }));
  }, [plotsData]);

  const cropOptions = useMemo(() => {
    const items = cropsData?.result ?? [];
    const content = Array.isArray(items) ? items : (items?.items ?? []);
    return content.map((c: { id: number; cropName: string }) => ({
      value: c.id.toString(),
      label: c.cropName,
    }));
  }, [cropsData]);

  const varietyOptions = useMemo(() => {
    const items = varietiesData?.result ?? [];
    const content = Array.isArray(items) ? items : (items?.items ?? []);
    return content.map((v: { id: number; name: string }) => ({
      value: v.id.toString(),
      label: v.name,
    }));
  }, [varietiesData]);

  // REPORT DATA QUERIES
  const summaryQuery = useQuery({
    queryKey: reportsKeys.summary(apiParams),
    queryFn: () => adminReportsApi.getSummary(apiParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const yieldQuery = useQuery({
    queryKey: reportsKeys.yield(analyticsParams),
    queryFn: () => adminReportsApi.getYieldAnalytics(apiParams),
    enabled: activeTab === "yield",
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const costQuery = useQuery({
    queryKey: reportsKeys.cost(costParams),
    queryFn: () =>
      adminReportsApi.getCostAnalytics({
        ...apiParams,
        granularity: costGranularity,
      }),
    enabled: activeTab === "cost",
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const revenueQuery = useQuery({
    queryKey: reportsKeys.revenue(analyticsParams),
    queryFn: () => adminReportsApi.getRevenueAnalytics(apiParams),
    enabled: activeTab === "revenue",
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const profitQuery = useQuery({
    queryKey: reportsKeys.profit(analyticsParams),
    queryFn: () => adminReportsApi.getProfitAnalytics(apiParams),
    enabled: activeTab === "profit",
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const activeQuery =
    activeTab === "yield"
      ? yieldQuery
      : activeTab === "cost"
        ? costQuery
        : activeTab === "revenue"
          ? revenueQuery
          : profitQuery;

  const summaryStats = summaryQuery.data ?? null;

  const yieldRows = yieldQuery.data?.tableRows ?? [];
  const yieldTotals = yieldQuery.data?.totals ?? null;

  const costRows = costQuery.data?.tableRows ?? [];
  const costTotals = costQuery.data?.totals ?? null;
  const costVendorRows = costQuery.data?.vendorRows ?? [];
  const costTimeSeries = costQuery.data?.timeSeries ?? [];

  const revenueRows = revenueQuery.data?.tableRows ?? [];
  const revenueTotals = revenueQuery.data?.totals ?? null;

  const profitRows = profitQuery.data?.tableRows ?? [];
  const profitTotals = profitQuery.data?.totals ?? null;

  const summaryLoading = summaryQuery.isLoading && !summaryQuery.data;
  const activeTabLoading = activeQuery.isLoading && !activeQuery.data;
  const isRefreshing = summaryQuery.isFetching || activeQuery.isFetching;
  const hasError = summaryQuery.isError || activeQuery.isError;

  const drilldownAvailable = true;

  const handleDrilldown = (target: "yield" | "cost" | "revenue" | "profit") => {
    setActiveTab(target);
  };

  const handleRowClick = (
    tab: "yield" | "cost" | "revenue" | "profit",
    row: unknown,
  ) => {
    if (!drilldownAvailable) {
      return;
    }
    const rowData = row as {
      farmId?: number | null;
      plotId?: number | null;
      cropId?: number | null;
      varietyId?: number | null;
      category?: string | null;
      vendorId?: number | null;
    };
    const nextFilters: ReportFilters = { ...appliedFilters };
    if (rowData.farmId != null) {
      nextFilters.farmId = String(rowData.farmId);
      nextFilters.plotId = "all";
    }
    if (rowData.plotId != null) {
      nextFilters.plotId = String(rowData.plotId);
    }
    if (rowData.cropId != null) {
      nextFilters.cropId = String(rowData.cropId);
      nextFilters.varietyId = "all";
    }
    if (rowData.varietyId != null) {
      nextFilters.varietyId = String(rowData.varietyId);
    }

    setDraftFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setActiveTab(tab);
    toast.info("Drilldown filters applied");
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([summaryQuery.refetch(), activeQuery.refetch()]);
      toast.success("Data refreshed successfully");
    } catch {
      toast.error("Failed to refresh data");
    }
  };

  const handleExport = async () => {
    const tab = activeTab.toUpperCase();
    const exportParams =
      activeTab === "cost"
        ? { ...apiParams, granularity: costGranularity }
        : apiParams;

    try {
      setIsExporting(true);
      const response = await adminReportsApi.exportReport(tab, exportParams);
      const fallbackFileName = getExportFileName({
        tab: activeTab,
        dateFrom: appliedFilters.dateFrom,
        dateTo: appliedFilters.dateTo,
        farmId:
          appliedFilters.farmId !== "all" ? appliedFilters.farmId : undefined,
        plotId:
          appliedFilters.plotId !== "all" ? appliedFilters.plotId : undefined,
      });
      const disposition = response?.headers?.["content-disposition"];
      const filename =
        parseFilenameFromDisposition(disposition) ?? fallbackFileName;
      downloadBlob(response.data, filename);

      const recordCount =
        activeTab === "yield"
          ? yieldRows.length
          : activeTab === "cost"
            ? costRows.length + costVendorRows.length + costTimeSeries.length
            : activeTab === "revenue"
              ? revenueRows.length
              : profitRows.length;

      toast.success(`Exported ${recordCount} records`);
    } catch {
      toast.error("Failed to export report");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveView = () => {
    // No-op: saved views are not implemented in this repo yet.
  };

  const handleFiltersChange = (nextFilters: ReportFilters) => {
    let updated = nextFilters;
    if (nextFilters.farmId !== draftFilters.farmId) {
      updated = { ...updated, plotId: "all" };
    }
    if (nextFilters.cropId !== draftFilters.cropId) {
      updated = { ...updated, varietyId: "all" };
    }
    setDraftFilters(updated);
  };

  const handleApplyFilters = () => {
    if (
      draftFilters.dateFrom &&
      draftFilters.dateTo &&
      !isValidDateRange(draftFilters.dateFrom, draftFilters.dateTo)
    ) {
      toast.error(
        "Invalid date range: Start date must be before or equal to end date",
      );
      return;
    }
    setAppliedFilters(draftFilters);
    toast.success("Filters applied");
  };

  const handleResetFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setCostGranularity("MONTH");
    toast.info("Filters reset");
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-full">
      <ReportsHeader
        onRefresh={handleRefresh}
        onExport={handleExport}
        onSaveView={handleSaveView}
        isLoading={isRefreshing}
        isExporting={isExporting}
      />

      <ReportsFilterCard
        filters={draftFilters}
        onFiltersChange={handleFiltersChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        farms={farmOptions}
        plots={plotOptions}
        crops={cropOptions}
        varieties={varietyOptions}
        isPlotDisabled={draftFilters.farmId === "all"}
        isVarietyDisabled={draftFilters.cropId === "all"}
        hasPendingChanges={hasPendingChanges}
      />

      {hasError && (
        <ErrorBanner
          message="Failed to load report data. Please try again."
          onRetry={handleRefresh}
          isRetrying={isRefreshing}
        />
      )}

      <ReportsSummaryCards
        stats={summaryStats}
        warnings={summaryQuery.data?.warnings ?? []}
        isLoading={summaryLoading}
        onDrilldown={handleDrilldown}
        drilldownAvailable={drilldownAvailable}
      />

      <ReportsChartTabs
        yieldRows={yieldRows}
        yieldTotals={yieldTotals}
        costRows={costRows}
        costTotals={costTotals}
        costVendorRows={costVendorRows}
        costTimeSeries={costTimeSeries}
        revenueRows={revenueRows}
        revenueTotals={revenueTotals}
        profitRows={profitRows}
        profitTotals={profitTotals}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReset={handleResetFilters}
        isLoading={activeTabLoading}
        costGranularity={costGranularity}
        onCostGranularityChange={setCostGranularity}
        drilldownAvailable={drilldownAvailable}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

