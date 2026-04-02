import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Circle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DashboardTaskItem } from '../types';

interface SeasonTaskPanelsProps {
  todayTasks: DashboardTaskItem[];
  upcomingTasks: DashboardTaskItem[];
  isLoading: boolean;
}

function TaskList({
  tasks,
  emptyLabel,
}: {
  tasks: DashboardTaskItem[];
  emptyLabel: string;
}) {
  if (tasks.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-start gap-3">
          {task.done ? (
            <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
          ) : (
            <Circle className="h-4 w-4 mt-0.5 text-muted-foreground" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium leading-snug">{task.title}</p>
            <p className="text-xs text-muted-foreground">
              {task.plotName} - {task.dueDateLabel}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SeasonTaskPanels({
  todayTasks,
  upcomingTasks,
  isLoading,
}: SeasonTaskPanelsProps) {
  const { t } = useTranslation();

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle>
          {t('dashboard.fdn.tasksTitle', {
            defaultValue: 'Today and Upcoming Tasks',
          })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium">
              {t('dashboard.fdn.todayTasksTitle', { defaultValue: "Today's Tasks" })}
            </h3>
            <Badge variant="outline">{todayTasks.length}</Badge>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <TaskList
              tasks={todayTasks}
              emptyLabel={t('dashboard.fdn.noTodayTasks', {
                defaultValue: 'No tasks for today.',
              })}
            />
          )}
        </div>

        <Separator />

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium">
              {t('dashboard.fdn.upcomingTasksTitle', {
                defaultValue: 'Upcoming Tasks',
              })}
            </h3>
            <Badge variant="outline">{upcomingTasks.length}</Badge>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <TaskList
              tasks={upcomingTasks}
              emptyLabel={t('dashboard.fdn.noUpcomingTasks', {
                defaultValue: 'No upcoming tasks.',
              })}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
