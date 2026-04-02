import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFarmerDashboard } from './useFarmerDashboard';

const dashboardMocks = vi.hoisted(() => ({
  useDashboardFdnOverview: vi.fn(),
  useDashboardFieldMap: vi.fn(),
  useTodayTasks: vi.fn(),
  useUpcomingTasks: vi.fn(),
}));

const seasonMocks = vi.hoisted(() => ({
  useSeason: vi.fn(),
}));

vi.mock('@/entities/dashboard', () => ({
  useDashboardFdnOverview: dashboardMocks.useDashboardFdnOverview,
  useDashboardFieldMap: dashboardMocks.useDashboardFieldMap,
  useTodayTasks: dashboardMocks.useTodayTasks,
  useUpcomingTasks: dashboardMocks.useUpcomingTasks,
}));

vi.mock('@/shared/contexts', () => ({
  useSeason: seasonMocks.useSeason,
}));

describe('useFarmerDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps tasks and appends data-completion tasks from missingInputs (max 3)', () => {
    seasonMocks.useSeason.mockReturnValue({
      selectedSeasonId: 33,
      setSelectedSeasonId: vi.fn(),
      seasons: [{ id: 33, seasonName: 'Mùa 33' }],
      isLoading: false,
      error: null,
    });

    dashboardMocks.useDashboardFdnOverview.mockReturnValue({
      data: {
        missingInputs: ['MINERAL_FERTILIZER', 'IRRIGATION_WATER', 'SOIL_LEGACY', 'CONTROL_SUPPLY'],
      } as any,
      isLoading: false,
      error: null,
    });

    dashboardMocks.useDashboardFieldMap.mockReturnValue({
      data: { items: [{ fieldId: 22, fieldName: 'Field A' }] },
      isLoading: false,
      error: null,
    });

    dashboardMocks.useTodayTasks.mockReturnValue({
      data: {
        content: [
          {
            taskId: 1,
            title: 'Irrigate field',
            plotName: 'Field A',
            dueDate: '2026-03-17',
            status: 'DONE',
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    dashboardMocks.useUpcomingTasks.mockReturnValue({
      data: [
        {
          taskId: 2,
          title: 'Soil test',
          plotName: 'Field B',
          dueDate: '2026-03-20',
          status: 'PENDING',
        },
      ],
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useFarmerDashboard());

    expect(result.current.selectedSeason).toBe('33');
    expect(result.current.todayTasks[0].done).toBe(true);
    expect(result.current.fieldMapItems).toHaveLength(1);
    expect(result.current.upcomingTasks).toHaveLength(4);
    expect(result.current.upcomingTasks[0].title).toBe('Soil test');
    expect(result.current.upcomingTasks[1].title).toContain('Bổ sung dữ liệu');
    expect(result.current.upcomingTasks[3].title).toContain('Bổ sung dữ liệu');
  });

  it('returns hasNoSeasons=true when season list is empty after initialization', () => {
    seasonMocks.useSeason.mockReturnValue({
      selectedSeasonId: null,
      setSelectedSeasonId: vi.fn(),
      seasons: [],
      isLoading: false,
      error: null,
    });

    dashboardMocks.useDashboardFdnOverview.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    dashboardMocks.useDashboardFieldMap.mockReturnValue({
      data: { items: [] },
      isLoading: false,
      error: null,
    });
    dashboardMocks.useTodayTasks.mockReturnValue({
      data: { content: [] },
      isLoading: false,
      error: null,
    });
    dashboardMocks.useUpcomingTasks.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useFarmerDashboard());

    expect(result.current.hasNoSeasons).toBe(true);
    expect(result.current.isCriticalLoading).toBe(false);
    expect(result.current.seasonOptions).toEqual([]);
  });
});
