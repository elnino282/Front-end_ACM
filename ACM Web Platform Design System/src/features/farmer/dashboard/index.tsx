import { Calendar, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WeatherWidget } from "@/features/farmer/weather-widget";
import { useFarmerDashboard } from "./hooks/useFarmerDashboard";
import { PerformanceKPICards } from "./components/PerformanceKPICards";
import { TodaysTasksTable } from "./components/TodaysTasksTable";
import { UpcomingTasksChart } from "./components/UpcomingTasksChart";
import { PlotStatusMap } from "./components/PlotStatusMap";
import { LowStockInventory } from "./components/LowStockInventory";
import { IncidentAlerts } from "./components/IncidentAlerts";
import { RecentActivityTimeline } from "./components/RecentActivityTimeline";

/**
 * FarmerDashboard Component
 *
 * Main dashboard view for farmers with comprehensive farm monitoring.
 * Displays performance KPIs, tasks, plots, inventory, incidents, and activities.
 *
 * Refactored into modular components following Clean Code principles:
 * - Single Responsibility: Each component has one clear purpose
 * - Separation of Concerns: Logic separated into custom hook
 * - Colocation: Related code grouped together
 */
export function FarmerDashboard() {
  const {
    selectedSeason,
    setSelectedSeason,
    seasonOptions,
    tasksToday,
    plots,
    inventory,
    incidents,
    activities,
    upcomingTasks,
    overview,
    isCriticalLoading,
    isDataLoading,
    hasNoSeasons,
    seasonsError,
    plotsError,
    tasksError,
    incidentsError,
    logsError,
    toggleTask,
    getHealthColor,
    getSeverityColor,
    getSeverityIcon,
    getActivityIcon,
    getStatusBadge,
  } = useFarmerDashboard();

  // Only block UI for critical loading (seasons)
  if (isCriticalLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show critical error if seasons failed to load
  if (seasonsError) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to Load Dashboard</AlertTitle>
          <AlertDescription>
            Unable to load seasons data. Please check your connection and try again.
            <br />
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show empty state if no seasons exist
  if (hasNoSeasons) {
    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Top Bar with Weather */}
        <div className="bg-card border-b border-border px-6 py-4 shadow-sm">
          <div className="max-w-[1920px] mx-auto flex items-center justify-center">
            <WeatherWidget variant="compact" />
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-[1920px] mx-auto p-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <Calendar className="w-20 h-20 text-primary opacity-40" />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">No Seasons Available</h2>
              <p className="text-muted-foreground max-w-md">
                You haven't created any seasons yet. Create your first season to start managing your farm activities.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/farmer/seasons'}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Create Your First Season
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Bar with Season Selector and Weather */}
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm">
        <div className="max-w-[1920px] mx-auto flex items-center justify-center">
          <WeatherWidget variant="compact" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto p-6">
        {/* Show error alerts for non-critical failures */}
        {(plotsError || tasksError || incidentsError || logsError) && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Some data failed to load</AlertTitle>
            <AlertDescription>
              {plotsError && <div>• Plots: {plotsError.message}</div>}
              {tasksError && <div>• Tasks: {tasksError.message}</div>}
              {incidentsError && <div>• Incidents: {incidentsError.message}</div>}
              {logsError && <div>• Activity logs: {logsError.message}</div>}
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger className="w-64 border-border rounded-lg">
                  <SelectValue placeholder="Select Season" />
                </SelectTrigger>
                <SelectContent>
                  {seasonOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
          {/* Left Column - 70% */}
          <div className="space-y-6">

            {/* Performance Overview - KPI Cards */}
            <PerformanceKPICards 
              selectedSeason={selectedSeason} 
              overview={overview}
              isLoading={isDataLoading}
            />

            {/* Today's Tasks Table - with loading state */}
            {isDataLoading && tasksToday.length === 0 ? (
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                  <span className="text-sm text-muted-foreground">Loading tasks...</span>
                </div>
              </div>
            ) : (
              <TodaysTasksTable
                tasks={tasksToday}
                toggleTask={toggleTask}
                getStatusBadge={getStatusBadge}
              />
            )}

            {/* Upcoming Tasks Timeline */}
            <UpcomingTasksChart upcomingTasks={upcomingTasks} />
          </div>

          {/* Right Column - 30% */}
          <div className="space-y-6">
            {/* Plot Status Map - with loading/error state */}
            {isDataLoading && plots.length === 0 && !plotsError ? (
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                  <span className="text-sm text-muted-foreground">Loading plots...</span>
                </div>
              </div>
            ) : (
              <PlotStatusMap plots={plots} getHealthColor={getHealthColor} />
            )}

            {/* Low Stock Inventory */}
            <LowStockInventory inventory={inventory} />

            {/* Incident Alerts - with loading state */}
            {isDataLoading && incidents.length === 0 && !incidentsError ? (
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                  <span className="text-sm text-muted-foreground">Loading incidents...</span>
                </div>
              </div>
            ) : (
              <IncidentAlerts
                incidents={incidents}
                getSeverityColor={getSeverityColor}
                getSeverityIcon={getSeverityIcon}
              />
            )}
          </div>
        </div>

        {/* Recent Activity Timeline - with loading state */}
        {isDataLoading && activities.length === 0 && !logsError ? (
          <div className="bg-card rounded-xl p-6 border border-border mt-6">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-secondary" />
              <span className="text-sm text-muted-foreground">Loading activity logs...</span>
            </div>
          </div>
        ) : (
          <RecentActivityTimeline
            activities={activities}
            getActivityIcon={getActivityIcon}
          />
        )}
      </div>
    </div>
  );
}



