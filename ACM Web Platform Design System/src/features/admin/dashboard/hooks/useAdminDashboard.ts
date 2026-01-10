import { useQuery } from '@tanstack/react-query';
import { Users, Boxes, Map, Sprout } from 'lucide-react';
import {
  adminDashboardStatsApi,
  dashboardStatsKeys,
  type DashboardStats,
} from '@/services/api.admin';
import {
  type RiskLevel,
  type TransformedRiskySeason,
  type TransformedInventoryHealth,
} from '../types';

/**
 * Calculate risk level based on riskScore
 * High: >= 5, Medium: 2-4, Low: < 2
 */
const getRiskLevel = (riskScore: number): RiskLevel => {
  if (riskScore >= 5) return 'high';
  if (riskScore >= 2) return 'medium';
  return 'low';
};

/**
 * Transform raw API data to UI-friendly format
 */
const transformDashboardData = (data: DashboardStats) => {
  // Summary KPIs with icons and colors
  const kpiMetrics = [
    {
      key: 'totalUsers',
      title: 'Total Users',
      value: data.summary.totalUsers.toLocaleString(),
      icon: Users,
      color: '#2563EB',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      key: 'totalFarms',
      title: 'Total Farms',
      value: data.summary.totalFarms.toLocaleString(),
      icon: Boxes,
      color: '#0891B2',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600',
    },
    {
      key: 'totalPlots',
      title: 'Total Plots',
      value: data.summary.totalPlots.toLocaleString(),
      icon: Map,
      color: '#64748B',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-600',
    },
    {
      key: 'totalSeasons',
      title: 'Total Seasons',
      value: data.summary.totalSeasons.toLocaleString(),
      icon: Sprout,
      color: '#10B981',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
  ];

  // Charts data
  const charts = {
    userRoles: data.userRoleCounts.map((r) => ({
      name: r.role || 'Unknown',
      value: r.total,
      color: r.role === 'ADMIN' ? '#2563EB' : r.role === 'FARMER' ? '#10B981' : '#F59E0B',
    })),
    userStatus: data.userStatusCounts.map((s) => ({
      name: s.status || 'Unknown',
      value: s.total,
      color: s.status === 'ACTIVE' ? '#10B981' : s.status === 'LOCKED' ? '#EF4444' : '#64748B',
    })),
    seasonStatus: data.seasonStatusCounts.map((s) => ({
      name: s.status || 'Unknown',
      value: s.total,
      color:
        s.status === 'ACTIVE'
          ? '#2563EB'
          : s.status === 'COMPLETED'
            ? '#10B981'
            : s.status === 'CANCELLED'
              ? '#EF4444'
              : '#64748B',
    })),
  };

  // Risky seasons with calculated risk level
  const risks: TransformedRiskySeason[] = data.riskySeasons.map((s) => ({
    ...s,
    riskLevel: getRiskLevel(s.riskScore),
  }));

  // Inventory health with warning flags
  const inventory: TransformedInventoryHealth[] = data.inventoryHealth.map((i) => ({
    ...i,
    hasWarning: i.totalAtRisk > 0,
  }));

  return { kpiMetrics, charts, risks, inventory };
};

/**
 * Custom hook for Admin Dashboard with real-time data
 *
 * Features:
 * - Auto-refetch every 30s for real-time updates
 * - Keeps previous data while fetching to avoid flashing
 * - Transforms API data to UI-friendly format via select
 */
export const useAdminDashboard = () => {
  const query = useQuery({
    queryKey: dashboardStatsKeys.stats(),
    queryFn: adminDashboardStatsApi.getStats,
    refetchInterval: 30_000, // Real-time: poll every 30s
    staleTime: 15_000, // Consider data fresh for 15s
    placeholderData: (previousData) => previousData, // Avoid flashing
    select: transformDashboardData,
  });

  return {
    // Query state
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching, // Background refetch indicator

    // Transformed data (undefined when loading)
    kpiMetrics: query.data?.kpiMetrics ?? [],
    charts: query.data?.charts ?? { userRoles: [], userStatus: [], seasonStatus: [] },
    risks: query.data?.risks ?? [],
    inventory: query.data?.inventory ?? [],

    // Refetch manually if needed
    refetch: query.refetch,
  };
};

export type UseAdminDashboardReturn = ReturnType<typeof useAdminDashboard>;
