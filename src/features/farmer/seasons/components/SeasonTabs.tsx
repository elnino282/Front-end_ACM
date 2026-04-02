import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Season, Activity } from '../types';

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
            <TabsTrigger value="plots">Linked Plots</TabsTrigger>
            <TabsTrigger value="tasks">Tasks Summary</TabsTrigger>
            <TabsTrigger value="budget">Budget & Expenses</TabsTrigger>
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Task Completion</span>
                <span className="numeric text-sm text-foreground">
                  {season.tasksCompleted} / {season.tasksTotal}
                </span>
              </div>
              <Progress
                value={(season.tasksCompleted / season.tasksTotal) * 100}
              />
            </div>
          </TabsContent>

          <TabsContent value="budget" className="mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Budget Total</Label>
                  <div className="mt-1 text-foreground numeric">
                    ${season.budgetTotal.toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Actual Cost</Label>
                  <div className="mt-1 text-foreground numeric">
                    ${season.actualCost.toLocaleString()}
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Budget Usage</Label>
                <Progress
                  value={(season.actualCost / season.budgetTotal) * 100}
                />
              </div>
            </div>
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



