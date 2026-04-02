import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Calendar, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WeatherWidget } from '@/features/farmer/weather-widget';
import { FdnAssistantPanel } from './components/FdnAssistantPanel';
import { FdnHistoryChart } from './components/FdnHistoryChart';
import { FdnKpiCards } from './components/FdnKpiCards';
import { FieldSustainabilityMap } from './components/FieldSustainabilityMap';
import { NitrogenInputBreakdown } from './components/NitrogenInputBreakdown';
import { SeasonTaskPanels } from './components/SeasonTaskPanels';
import { useFarmerDashboard } from './hooks/useFarmerDashboard';

export function FarmerDashboard() {
  const { t } = useTranslation();
  const {
    selectedSeason,
    setSelectedSeason,
    seasonOptions,
    overview,
    fieldMapItems,
    todayTasks,
    upcomingTasks,
    isCriticalLoading,
    isDataLoading,
    hasNoSeasons,
    seasonsError,
    overviewError,
    mapError,
    todayTasksError,
    upcomingTasksError,
  } = useFarmerDashboard();

  if (isCriticalLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          <p className="text-muted-foreground">
            {t('dashboard.loading', { defaultValue: 'Loading dashboard...' })}
          </p>
        </div>
      </div>
    );
  }

  if (seasonsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {t('dashboard.error.title', {
              defaultValue: 'Failed to Load Dashboard',
            })}
          </AlertTitle>
          <AlertDescription>
            {t('dashboard.error.description', {
              defaultValue:
                'Unable to load seasons data. Please check your connection and try again.',
            })}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (hasNoSeasons) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-[1600px] mx-auto p-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <Calendar className="w-20 h-20 text-primary opacity-40" />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                {t('dashboard.empty.title', {
                  defaultValue: 'No Seasons Available',
                })}
              </h2>
              <p className="text-muted-foreground max-w-md">
                {t('dashboard.empty.description', {
                  defaultValue:
                    'Start by creating a new season to track your crops.',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const partialErrors = [
    overviewError,
    mapError,
    todayTasksError,
    upcomingTasksError,
  ].filter((error): error is Error => Boolean(error));

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {partialErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {t('dashboard.dataLoadError', {
                defaultValue: 'Some data failed to load',
              })}
            </AlertTitle>
            <AlertDescription>
              {partialErrors.map((error, index) => (
                <div key={`${error.message}-${index}`}>- {error.message}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger className="w-72 border-border rounded-lg">
                    <SelectValue
                      placeholder={t('dashboard.fdn.selectSeason', {
                        defaultValue: 'Select season',
                      })}
                    />
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
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {t('dashboard.fdn.weatherSummary', {
                    defaultValue: 'Weather summary',
                  })}
                </span>
                <WeatherWidget variant="compact" />
              </div>
            </div>
          </CardContent>
        </Card>

        <FdnKpiCards overview={overview} isLoading={isDataLoading} />

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
          <NitrogenInputBreakdown overview={overview} isLoading={isDataLoading} />
          <FdnAssistantPanel overview={overview} isLoading={isDataLoading} />
        </div>

        <FieldSustainabilityMap items={fieldMapItems} isLoading={isDataLoading} />

        <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
          <FdnHistoryChart history={overview?.historicalTrend ?? []} isLoading={isDataLoading} />
          <SeasonTaskPanels
            todayTasks={todayTasks}
            upcomingTasks={upcomingTasks}
            isLoading={isDataLoading}
          />
        </div>
      </div>
    </div>
  );
}
