import { useState, useMemo, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Calendar,
  Circle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSeasons } from "@/entities/season";
import {
  useDashboardOverview,
  useTodayTasks,
  usePlotStatus,
  useLowStock,
  useUpcomingTasks,
} from "@/entities/dashboard";
import type { DashboardOverview, TodayTask } from "@/entities/dashboard";
import {
  Task,
  Plot,
  InventoryItem,
  Incident,
  Activity,
  UpcomingTaskDay,
  IncidentSeverity,
  TaskStatus,
} from "../types";
import {
  HEALTH_COLORS,
  SEVERITY_STYLES,
  SEVERITY_ICON_COLORS,
  ACTIVITY_ICON_COLORS,
  STATUS_BADGE_STYLES,
  STATUS_BADGE_LABELS,
} from "../constants";

/**
 * Return type for the useFarmerDashboard hook
 */
export interface UseFarmerDashboardReturn {
  // State
  selectedSeason: string;
  setSelectedSeason: (season: string) => void;
  seasonOptions: { value: string; label: string }[];
  tasksToday: Task[];

  // Data
  plots: Plot[];
  inventory: InventoryItem[];
  incidents: Incident[];
  activities: Activity[];
  upcomingTasks: UpcomingTaskDay[];

  // Dashboard Overview Data (live API)
  overview: DashboardOverview | null;

  // Loading/Error - Separated into critical and non-critical
  isCriticalLoading: boolean; // Blocks entire UI
  isDataLoading: boolean; // Shows partial UI with skeletons
  hasNoSeasons: boolean;
  seasonsError: Error | null;
  plotsError: Error | null;
  tasksError: Error | null;
  incidentsError: Error | null;
  logsError: Error | null;

  // Handlers
  toggleTask: (taskId: string) => void;

  // Utility functions
  getHealthColor: (health: string) => string;
  getSeverityColor: (severity: string) => string;
  getSeverityIcon: (severity: string) => JSX.Element | null;
  getActivityIcon: (type: string) => JSX.Element;
  getStatusBadge: (status: string) => JSX.Element | null;
}

export const useFarmerDashboard = (): UseFarmerDashboardReturn => {
  // 1. Fetch Seasons (Critical - blocks UI)
  const { data: seasonsData, isLoading: seasonsLoading, error: seasonsError } = useSeasons();

  const seasonOptions = useMemo(() => {
    return seasonsData?.items?.map(s => ({
      value: String(s.id),
      label: s.seasonName
    })) ?? [];
  }, [seasonsData]);

  // Default to first season if available
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Only run initialization once when seasons are loaded
    if (!hasInitialized && !seasonsLoading) {
      if (seasonOptions.length > 0) {
        setSelectedSeason(seasonOptions[0].value);
      }
      setHasInitialized(true);
    }
  }, [seasonOptions, seasonsLoading, hasInitialized]);

  const seasonId = parseInt(selectedSeason, 10);
  const hasSeason = !isNaN(seasonId) && seasonId > 0;

  // 2. Fetch Dashboard Data from Live APIs
  const { 
    data: overviewData, 
    isLoading: overviewLoading, 
    error: overviewError 
  } = useDashboardOverview(hasSeason ? seasonId : undefined, { enabled: hasInitialized });

  const { 
    data: todayTasksData, 
    isLoading: todayTasksLoading, 
    error: todayTasksError 
  } = useTodayTasks({ seasonId: hasSeason ? seasonId : undefined }, { enabled: hasInitialized });

  const { 
    data: plotStatusData, 
    isLoading: plotsLoading, 
    error: plotsError 
  } = usePlotStatus(hasSeason ? seasonId : undefined, { enabled: hasInitialized });

  const { 
    data: lowStockData, 
    isLoading: lowStockLoading, 
    error: lowStockError 
  } = useLowStock({ limit: 5 }, { enabled: hasInitialized });

  const { 
    data: upcomingTasksData, 
    isLoading: upcomingLoading 
  } = useUpcomingTasks({ days: 7, seasonId: hasSeason ? seasonId : undefined }, { enabled: hasInitialized });

  // 3. Transform Data

  // Tasks Today (from live API)
  const tasksToday = useMemo(() => {
    const items: TodayTask[] = todayTasksData?.content ?? [];
    return items.map(t => ({
      id: String(t.taskId),
      title: t.title,
      plot: t.plotName ?? "N/A",
      type: t.type ?? "task",
      assignee: t.assigneeName ?? "Unassigned",
      due: t.dueDate ?? "Today",
      status: (t.status === 'DONE' ? 'completed' : t.status === 'IN_PROGRESS' ? 'in-progress' : 'not-started') as TaskStatus,
      checked: t.status === 'DONE'
    }));
  }, [todayTasksData]);

  // Upcoming Tasks (from live API) - converted to UpcomingTaskDay format
  const upcomingTasks = useMemo((): UpcomingTaskDay[] => {
    if (!upcomingTasksData || upcomingTasksData.length === 0) return [];
    
    // Group tasks by due date and count
    const grouped = new Map<string, { count: number; overdue: number }>();
    const today = new Date().toISOString().split('T')[0];
    
    upcomingTasksData.forEach(task => {
      const day = task.dueDate ?? 'Unknown';
      if (!grouped.has(day)) {
        grouped.set(day, { count: 0, overdue: 0 });
      }
      const entry = grouped.get(day)!;
      entry.count++;
      // Check if overdue (before today and not completed)
      if (task.dueDate && task.dueDate < today && task.status !== 'DONE') {
        entry.overdue++;
      }
    });

    return Array.from(grouped.entries()).map(([day, { count, overdue }]) => ({
      day,
      count,
      overdue
    }));
  }, [upcomingTasksData]);

  // Plots (from live API)
  const plots = useMemo(() => {
    return plotStatusData?.map(p => ({
      id: String(p.plotId),
      name: p.plotName,
      crop: p.cropName ?? "N/A",
      stage: p.stage ?? "N/A",
      health: (p.health?.toLowerCase() ?? "healthy") as "healthy" | "warning" | "critical",
      area: p.areaHa ?? 0
    } as Plot)) ?? [];
  }, [plotStatusData]);

  // Inventory (from low stock API)
  const inventory = useMemo((): InventoryItem[] => {
    return lowStockData?.map(item => ({
      id: String(item.supplyLotId),
      name: item.itemName,
      current: item.onHand,
      minimum: 5, // Default threshold
      unit: item.unit ?? "unit"
    })) ?? [];
  }, [lowStockData]);

  // Incidents (from overview alerts) - simplified
  const incidents = useMemo((): Incident[] => {
    const openCount = overviewData?.alerts?.openIncidents ?? 0;
    if (openCount === 0) return [];
    
    // Return placeholder for alert count display
    return [{
      id: "alert",
      title: `${openCount} Open Incident${openCount > 1 ? 's' : ''}`,
      severity: "medium" as IncidentSeverity,
      plot: "View Details",
      time: "Now"
    }];
  }, [overviewData]);

  // Activities (empty for now - could be extended)
  const activities: Activity[] = [];

  // Handlers
  const toggleTask = (taskId: string) => {
    console.log("Toggle task", taskId);
  };

  // Helpers
  const getHealthColor = (health: string): string => {
    return HEALTH_COLORS[health as keyof typeof HEALTH_COLORS] ?? HEALTH_COLORS.default;
  };

  const getSeverityColor = (severity: string): string => {
    return SEVERITY_STYLES[severity as keyof typeof SEVERITY_STYLES] ?? SEVERITY_STYLES.default;
  };

  const getSeverityIcon = (severity: string): JSX.Element | null => {
    const colorClass = SEVERITY_ICON_COLORS[severity as keyof typeof SEVERITY_ICON_COLORS];
    if (!colorClass) return null;

    switch (severity) {
      case "high": return <XCircle className={`w-4 h-4 ${colorClass}`} />;
      case "medium": return <AlertTriangle className={`w-4 h-4 ${colorClass}`} />;
      case "low": return <AlertCircle className={`w-4 h-4 ${colorClass}`} />;
      default: return null;
    }
  };

  const getActivityIcon = (type: string): JSX.Element => {
    const colorClass = ACTIVITY_ICON_COLORS[type as keyof typeof ACTIVITY_ICON_COLORS] ?? ACTIVITY_ICON_COLORS.default;
    switch (type) {
      case "task": return <CheckCircle2 className={`w-4 h-4 ${colorClass}`} />;
      case "expense": return <DollarSign className={`w-4 h-4 ${colorClass}`} />;
      case "incident": return <AlertTriangle className={`w-4 h-4 ${colorClass}`} />;
      case "season": return <Calendar className={`w-4 h-4 ${colorClass}`} />;
      default: return <Circle className={`w-4 h-4 ${colorClass}`} />;
    }
  };

  const getStatusBadge = (status: string): JSX.Element | null => {
    const styleClass = STATUS_BADGE_STYLES[status as keyof typeof STATUS_BADGE_STYLES];
    const label = STATUS_BADGE_LABELS[status as keyof typeof STATUS_BADGE_LABELS];
    if (!styleClass || !label) return null;
    return <Badge className={styleClass}>{label}</Badge>;
  };

  // Separate loading states: Critical vs Non-critical
  // Critical loading: Blocks entire UI until seasons are loaded
  const isCriticalLoading = !hasInitialized || seasonsLoading;
  
  // Non-critical loading: Allow partial UI rendering
  const isDataLoading = overviewLoading || todayTasksLoading || plotsLoading || lowStockLoading || upcomingLoading;
  
  // Check if we have no seasons after initialization
  const hasNoSeasons = hasInitialized && !seasonsLoading && seasonOptions.length === 0;

  // Debug logging
  useEffect(() => {
    console.log('[Dashboard] State Update:', {
      hasInitialized,
      seasonsLoading,
      seasonOptionsCount: seasonOptions.length,
      selectedSeason,
      hasSeason,
      isCriticalLoading,
      isDataLoading,
      hasNoSeasons,
      overview: overviewData ? 'loaded' : 'null',
    });
  }, [hasInitialized, seasonsLoading, seasonOptions.length, selectedSeason, hasSeason, 
      isCriticalLoading, isDataLoading, hasNoSeasons, overviewData]);

  return {
    selectedSeason,
    setSelectedSeason,
    seasonOptions,
    tasksToday,
    plots,
    inventory,
    incidents,
    activities,
    upcomingTasks,
    overview: overviewData ?? null,
    isCriticalLoading,
    isDataLoading,
    hasNoSeasons,
    seasonsError: seasonsError ?? null,
    plotsError: plotsError ?? null,
    tasksError: todayTasksError ?? null,
    incidentsError: overviewError ?? null,
    logsError: null,
    toggleTask,
    getHealthColor,
    getSeverityColor,
    getSeverityIcon,
    getActivityIcon,
    getStatusBadge,
  };
};




