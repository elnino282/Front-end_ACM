import { useMemo } from 'react';
import {
  useDashboardFdnOverview,
  useDashboardFieldMap,
  useTodayTasks,
  useUpcomingTasks,
} from '@/entities/dashboard';
import type { DashboardFdnOverview, DashboardFieldMapItem } from '@/entities/dashboard';
import { useSeason } from '@/shared/contexts';
import type { DashboardTaskItem } from '../types';

function toTaskItem(task: {
  taskId: number;
  title: string;
  plotName?: string | null;
  dueDate?: string | null;
  status: string;
}): DashboardTaskItem {
  const fallback = 'N/A';
  const due = task.dueDate ? new Date(`${task.dueDate}T00:00:00`) : null;
  const dueLabel = due && !Number.isNaN(due.getTime())
    ? due.toLocaleDateString()
    : fallback;
  return {
    id: String(task.taskId),
    title: task.title,
    plotName: task.plotName ?? fallback,
    status: task.status,
    dueDateLabel: dueLabel,
    done: task.status === 'DONE',
  };
}

function toSourceLabel(source: string): string {
  const normalized = source.toLowerCase();
  if (normalized === 'mineral_fertilizer') return 'ghi nhận phân bón vô cơ';
  if (normalized === 'organic_fertilizer') return 'ghi nhận phân bón hữu cơ';
  if (normalized === 'biological_fixation') return 'cập nhật cố định đạm sinh học';
  if (normalized === 'irrigation_water') return 'đo đạm trong nước tưới';
  if (normalized === 'atmospheric_deposition') return 'xác minh lắng đọng khí quyển';
  if (normalized === 'seed_import') return 'cập nhật nguồn đạm từ hạt giống';
  if (normalized === 'soil_legacy') return 'đánh giá tồn dư đạm trong đất';
  if (normalized === 'control_supply') return 'nhập dữ liệu kiểm soát đạm';
  return source;
}

function toDataCompletionTaskItem(source: string): DashboardTaskItem {
  return {
    id: `data-${source}`,
    title: `Bổ sung dữ liệu: ${toSourceLabel(source)}`,
    plotName: 'Dashboard',
    status: 'DATA_REQUIRED',
    dueDateLabel: 'Cần cập nhật',
    done: false,
  };
}

export interface UseFarmerDashboardReturn {
  selectedSeason: string;
  setSelectedSeason: (season: string) => void;
  seasonOptions: { value: string; label: string }[];
  overview: DashboardFdnOverview | null;
  fieldMapItems: DashboardFieldMapItem[];
  todayTasks: DashboardTaskItem[];
  upcomingTasks: DashboardTaskItem[];
  isCriticalLoading: boolean;
  isDataLoading: boolean;
  hasNoSeasons: boolean;
  seasonsError: Error | null;
  overviewError: Error | null;
  mapError: Error | null;
  todayTasksError: Error | null;
  upcomingTasksError: Error | null;
}

export const useFarmerDashboard = (): UseFarmerDashboardReturn => {
  const {
    selectedSeasonId,
    setSelectedSeasonId,
    seasons: seasonsData,
    isLoading: seasonsLoading,
    error: seasonsError,
  } = useSeason();

  const seasonOptions = useMemo(() => {
    return (
      seasonsData?.map((season) => ({
        value: String(season.id),
        label: season.seasonName,
      })) ?? []
    );
  }, [seasonsData]);

  const selectedSeasonValue =
    selectedSeasonId !== null ? String(selectedSeasonId) : '';
  const hasInitialized = !seasonsLoading;
  const hasSeason = selectedSeasonId !== null && selectedSeasonId > 0;

  const setSelectedSeason = (season: string) => {
    const parsedId = Number.parseInt(season, 10);
    setSelectedSeasonId(Number.isNaN(parsedId) ? null : parsedId);
  };

  const {
    data: overviewData,
    isLoading: overviewLoading,
    error: overviewError,
  } = useDashboardFdnOverview(
    {
      scope: 'field',
      seasonId: hasSeason ? selectedSeasonId! : undefined,
    },
    { enabled: hasInitialized }
  );

  const {
    data: mapData,
    isLoading: mapLoading,
    error: mapError,
  } = useDashboardFieldMap(
    {},
    { enabled: hasInitialized }
  );

  const {
    data: todayTasksData,
    isLoading: todayTasksLoading,
    error: todayTasksError,
  } = useTodayTasks(
    { seasonId: hasSeason ? selectedSeasonId! : undefined },
    { enabled: hasInitialized }
  );

  const {
    data: upcomingTasksData,
    isLoading: upcomingTasksLoading,
    error: upcomingTasksError,
  } = useUpcomingTasks(
    { days: 7, seasonId: hasSeason ? selectedSeasonId! : undefined },
    { enabled: hasInitialized }
  );

  const todayTasks = useMemo(
    () => (todayTasksData?.content ?? []).map(toTaskItem),
    [todayTasksData]
  );

  const upcomingTasks = useMemo(
    () =>
      [...(upcomingTasksData ?? [])]
        .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''))
        .map(toTaskItem),
    [upcomingTasksData]
  );

  const dataCompletionTasks = useMemo(
    () =>
      (overviewData?.missingInputs ?? [])
        .slice(0, 3)
        .map(toDataCompletionTaskItem),
    [overviewData?.missingInputs]
  );

  const mergedUpcomingTasks = useMemo(
    () => [...upcomingTasks, ...dataCompletionTasks],
    [upcomingTasks, dataCompletionTasks]
  );

  const isCriticalLoading = !hasInitialized || seasonsLoading;
  const isDataLoading =
    overviewLoading || mapLoading || todayTasksLoading || upcomingTasksLoading;
  const hasNoSeasons =
    hasInitialized && !seasonsLoading && seasonOptions.length === 0;

  return {
    selectedSeason: selectedSeasonValue,
    setSelectedSeason,
    seasonOptions,
    overview: overviewData ?? null,
    fieldMapItems: mapData?.items ?? [],
    todayTasks,
    upcomingTasks: mergedUpcomingTasks,
    isCriticalLoading,
    isDataLoading,
    hasNoSeasons,
    seasonsError: seasonsError ?? null,
    overviewError: overviewError ?? null,
    mapError: mapError ?? null,
    todayTasksError: todayTasksError ?? null,
    upcomingTasksError: upcomingTasksError ?? null,
  };
};
