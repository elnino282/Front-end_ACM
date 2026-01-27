import { BarChart3, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAdminDashboard } from './hooks/useAdminDashboard';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import { RiskySeasonsTable } from './components/RiskySeasonsTable';
import { InventoryHealthCards } from './components/InventoryHealthCards';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/shared/lib';
import { useI18n } from '@/hooks/useI18n';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

/**
 * AdminDashboard Component
 *
 * Real-time dashboard for administrators with comprehensive platform monitoring.
 * Features:
 * - Auto-refresh every 30s for real-time data
 * - Skeleton loading instead of spinner
 * - Risky seasons with drill-down navigation
 * - Inventory health with expiry warnings
 */
export function AdminDashboard() {
  const { t } = useI18n();
  const {
    isLoading,
    isError,
    error,
    isFetching,
    kpiMetrics,
    charts,
    risks,
    refetch,
  } = useAdminDashboard();

  // Show skeleton while loading
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Show error state with retry option
  if (isError) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('admin.dashboard.error.title')}</AlertTitle>
          <AlertDescription className="mt-2">
            {error?.message || t('admin.dashboard.error.description')}
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common.retry')}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold mb-1"><b>{t('admin.dashboard.title')}</b></h1>
            {isFetching && (
              <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
            )}
          </div>
          <p className="text-muted-foreground">
            {t('admin.dashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={cn('h-4 w-4 mr-2', isFetching && 'animate-spin')} />
            {t('common.refresh')}
          </Button>
          <Button className="bg-[#2563EB] hover:bg-[#1E40AF]">
            <BarChart3 className="w-4 h-4 mr-2" />
            {t('admin.dashboard.exportReport')}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((kpi) => (
          <Card key={kpi.key} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                </div>
                <div className={cn('p-3 rounded-lg', kpi.bgColor)}>
                  <kpi.icon className={cn('h-6 w-6', kpi.textColor)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row - User Distribution & Season Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Roles Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">User Distribution by Role</CardTitle>
            <CardDescription>Breakdown of users by their assigned roles</CardDescription>
          </CardHeader>
          <CardContent>
            {charts.userRoles.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No user data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={charts.userRoles}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts.userRoles.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Season Status Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Season Status Distribution</CardTitle>
            <CardDescription>Current status of all seasons</CardDescription>
          </CardHeader>
          <CardContent>
            {charts.seasonStatus.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No season data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={charts.seasonStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts.seasonStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Risky Seasons & Inventory Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskySeasonsTable seasons={risks} />
        <InventoryHealthCards />
      </div>
    </div>
  );
}
