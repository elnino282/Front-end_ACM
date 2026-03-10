import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Season, Activity } from '../types';
import { TaskModule } from '@/features/farmer/tasks';
import { ExpenseModule } from '@/features/farmer/expense-management';
import { FieldLogModule } from '@/pages/farmer/FieldLogsPage';
import { HarvestModule } from '@/features/farmer/harvests';

interface SeasonTabsProps {
  season: Season;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activities: Activity[];
}

export function SeasonTabs({ season, activeTab, setActiveTab, activities }: SeasonTabsProps) {
  const effectiveEndDate = season.endDate || season.plannedHarvestDate || season.startDate;
  const endDateLabel = effectiveEndDate
    ? new Date(effectiveEndDate).toLocaleDateString()
    : '-';

  return (
    <Card className="border-border acm-rounded-lg acm-card-shadow">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardHeader className="border-b border-border">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="field-logs">Field Logs</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="harvest">Harvest</TabsTrigger>
            <TabsTrigger value="plots">Linked Plots</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="p-6">
          <TabsContent value="overview" className="mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Crop</Label>
                  <div className="mt-1 text-foreground">{season.crop}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Variety</Label>
                  <div className="mt-1 text-foreground">{season.variety}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Start Date</Label>
                  <div className="mt-1 text-foreground">
                    {new Date(season.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">End Date</Label>
                  <div className="mt-1 text-foreground">
                    {endDateLabel}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Total Tasks</Label>
                  <div className="mt-1 text-foreground numeric">
                    {season.tasksCompleted} / {season.tasksTotal}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Incidents</Label>
                  <div className="mt-1 text-foreground numeric">{season.incidentCount}</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="plots" className="mt-0">
            <div className="text-sm text-muted-foreground">
              {season.linkedPlots} plots are linked to this season
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            <TaskModule seasonId={season.id} />
          </TabsContent>

          <TabsContent value="field-logs" className="mt-0">
            <FieldLogModule seasonId={season.id} />
          </TabsContent>

          <TabsContent value="expenses" className="mt-0">
            <ExpenseModule seasonId={season.id} />
          </TabsContent>

          <TabsContent value="harvest" className="mt-0">
            <HarvestModule seasonId={season.id} />
          </TabsContent>

          <TabsContent value="incidents" className="mt-0">
            <div className="text-sm text-muted-foreground">
              {season.incidentCount} incidents reported
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <div className="text-sm text-muted-foreground">
              {season.documentCount} documents attached
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}



