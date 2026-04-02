import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  ExportFormat,
  FilterState,
  PesticideStatus,
  ReportSection,
  YieldByCrop,
  YieldByPlot,
  YieldBySeason,
  YieldViewMode,
} from "../types";
import { DEFAULT_FILTERS } from "../constants";
import { farmerReportsApi } from "@/services/api.farmer";
import { useSeason } from "@/shared/contexts";
import { taskApi } from "@/entities/task";

interface UseReportsOptions {
  seasonId?: number;
  initialSeasonValue?: string;
}

export function useReports(options: UseReportsOptions = {}) {
  const { seasonId: explicitSeasonId, initialSeasonValue } = options;
  const { selectedSeasonId } = useSeason();
  const resolvedSeasonId = explicitSeasonId ?? selectedSeasonId ?? null;

  const [activeSection, setActiveSection] = useState<ReportSection>("yield");
  const [selectedSeason, setSelectedSeason] = useState(
    initialSeasonValue ?? (resolvedSeasonId ? String(resolvedSeasonId) : "all")
  );
  const [yieldViewMode, setYieldViewMode] = useState<YieldViewMode>("season");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("excel");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  useEffect(() => {
    if (!initialSeasonValue) return;
    if (selectedSeason === initialSeasonValue) return;
    setSelectedSeason(initialSeasonValue);
  }, [initialSeasonValue, selectedSeason]);

  const queryEnabled = resolvedSeasonId !== null;

  const {
    data: yieldReport,
    isLoading: yieldLoading,
    error: yieldError,
  } = useQuery({
    queryKey: ["farmerReports", "yield", resolvedSeasonId],
    queryFn: () => farmerReportsApi.getYieldReport(resolvedSeasonId as number),
    enabled: queryEnabled,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: costReport,
    isLoading: costLoading,
    error: costError,
  } = useQuery({
    queryKey: ["farmerReports", "cost", resolvedSeasonId],
    queryFn: () => farmerReportsApi.getCostReport(resolvedSeasonId as number),
    enabled: queryEnabled,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: revenueReport,
    isLoading: revenueLoading,
    error: revenueError,
  } = useQuery({
    queryKey: ["farmerReports", "revenue", resolvedSeasonId],
    queryFn: () => farmerReportsApi.getRevenueReport(resolvedSeasonId as number),
    enabled: queryEnabled,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: profitReport,
    isLoading: profitLoading,
    error: profitError,
  } = useQuery({
    queryKey: ["farmerReports", "profit", resolvedSeasonId],
    queryFn: () => farmerReportsApi.getProfitReport(resolvedSeasonId as number),
    enabled: queryEnabled,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: seasonTaskPage,
    isLoading: tasksLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["farmerReports", "tasks", resolvedSeasonId],
    queryFn: () =>
      taskApi.listBySeason(resolvedSeasonId as number, {
        page: 0,
        size: 500,
        sortBy: "dueDate",
        sortDirection: "asc",
      }),
    enabled: queryEnabled,
    staleTime: 1000 * 60 * 5,
  });

  const yieldBySeason: YieldBySeason[] = useMemo(() => {
    if (!yieldReport) return [];
    return yieldReport.map((item) => ({
      season: item.seasonName || `Season ${item.seasonId}`,
      yield: Number(item.actualYieldKg) || 0,
      avgYield: Number(item.expectedYieldKg) || 0,
    }));
  }, [yieldReport]);

  const yieldByCrop: YieldByCrop[] = useMemo(() => {
    if (!yieldReport) return [];
    const cropMap = new Map<string, { expected: number; actual: number }>();
    yieldReport.forEach((item) => {
      const crop = item.cropName || "Unknown";
      const existing = cropMap.get(crop) || { expected: 0, actual: 0 };
      cropMap.set(crop, {
        expected: existing.expected + (Number(item.expectedYieldKg) || 0),
        actual: existing.actual + (Number(item.actualYieldKg) || 0),
      });
    });
    return Array.from(cropMap.entries()).map(([crop, data]) => ({
      crop,
      yield: data.actual,
      target: data.expected,
    }));
  }, [yieldReport]);

  const yieldByPlot: YieldByPlot[] = useMemo(() => {
    if (!yieldReport) return [];
    const plotMap = new Map<string, { actual: number }>();
    yieldReport.forEach((item) => {
      const plot = item.plotName || "Unknown";
      const existing = plotMap.get(plot) || { actual: 0 };
      plotMap.set(plot, {
        actual: existing.actual + (Number(item.actualYieldKg) || 0),
      });
    });
    return Array.from(plotMap.entries()).map(([plot, data]) => ({
      plot,
      yield: data.actual,
      area: 0,
    }));
  }, [yieldReport]);

  const kpiData = useMemo(() => {
    const hasYieldReport = (yieldReport?.length ?? 0) > 0;
    const hasCostReport = (costReport?.length ?? 0) > 0;
    const hasRevenueReport = (revenueReport?.length ?? 0) > 0;
    const hasProfitReport = (profitReport?.length ?? 0) > 0;

    const totalYieldKg = hasYieldReport
      ? yieldReport!.reduce((sum, item) => sum + (Number(item.actualYieldKg) || 0), 0)
      : undefined;

    const totalCost = hasCostReport
      ? costReport!.reduce((sum, item) => sum + (Number(item.totalExpense) || 0), 0)
      : undefined;

    const totalRevenue = hasRevenueReport
      ? revenueReport!.reduce((sum, item) => sum + (Number(item.totalRevenue) || 0), 0)
      : undefined;

    const netProfit = hasProfitReport
      ? profitReport!.reduce((sum, item) => sum + (Number(item.grossProfit) || 0), 0)
      : totalRevenue !== undefined && totalCost !== undefined
        ? totalRevenue - totalCost
        : undefined;

    const completedTasks = (seasonTaskPage?.items ?? []).filter((task) => task.status === "DONE");
    const onTimeCompletedTasks = completedTasks.filter((task) => {
      if (!task.actualEndDate) return false;
      if (!task.dueDate) return true;
      return task.actualEndDate <= task.dueDate;
    });

    const onTimeTasksPercent =
      completedTasks.length > 0
        ? Math.round((onTimeCompletedTasks.length / completedTasks.length) * 100)
        : undefined;

    return {
      totalYieldKg,
      totalCost,
      netProfit,
      onTimeTasksPercent,
    };
  }, [costReport, profitReport, revenueReport, seasonTaskPage?.items, yieldReport]);

  const isLoading = yieldLoading || costLoading || revenueLoading || profitLoading || tasksLoading;
  const hasError = Boolean(yieldError || costError || revenueError || profitError || tasksError);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setIsExportModalOpen(false);
      toast.success("Report Exported Successfully", {
        description: `Your ${exportFormat.toUpperCase()} report has been generated.`,
      });
    }, 2000);
  };

  const handleApplyFilters = () => {
    setIsFilterDrawerOpen(false);
    toast.success("Filters Applied", {
      description: "Report data has been updated based on your filters.",
    });
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    toast.info("Filters Cleared", {
      description: "All filters have been reset to default values.",
    });
  };

  const getYieldChartData = () => {
    switch (yieldViewMode) {
      case "season":
        return yieldBySeason;
      case "crop":
        return yieldByCrop;
      case "plot":
        return yieldByPlot;
      default:
        return yieldBySeason;
    }
  };

  const getPesticideStatusBadge = (status: PesticideStatus) => {
    const statusConfig = {
      safe: {
        className: "bg-primary/10 text-primary border-primary/20",
        label: "Safe",
      },
      approaching: {
        className: "bg-accent/10 text-accent border-accent/20",
        label: "Approaching",
      },
      violated: {
        className: "bg-destructive/10 text-destructive border-destructive/20",
        label: "Violated",
      },
    };

    return statusConfig[status];
  };

  return {
    activeSection,
    selectedSeason,
    yieldViewMode,
    isFilterDrawerOpen,
    isExportModalOpen,
    isExporting,
    exportFormat,
    includeCharts,
    includeNotes,
    filters,
    yieldReport: yieldReport ?? [],
    costReport: costReport ?? [],
    revenueReport: revenueReport ?? [],
    profitReport: profitReport ?? [],
    kpiData,
    isLoading,
    hasError,
    setActiveSection,
    setSelectedSeason,
    setYieldViewMode,
    setIsFilterDrawerOpen,
    setIsExportModalOpen,
    setExportFormat,
    setIncludeCharts,
    setIncludeNotes,
    setFilters,
    handleExport,
    handleApplyFilters,
    handleClearFilters,
    getYieldChartData,
    getPesticideStatusBadge,
  };
}
