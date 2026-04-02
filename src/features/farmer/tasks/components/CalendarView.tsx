import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Task } from '../types';
import { STATUS_COLOR_VALUES } from '../constants';

interface CalendarViewProps {
  tasks: Task[];
  mode: 'month' | 'week';
  currentDate: Date;
  onModeChange: (mode: 'month' | 'week') => void;
  onDateChange: (date: Date) => void;
}

export function CalendarView({ tasks, mode, currentDate, onModeChange, onDateChange }: CalendarViewProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  return (
    <Card className="border-border acm-rounded-lg acm-card-shadow">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth} className="h-8 w-8 acm-rounded-sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h3 className="text-lg min-w-[200px] text-center">{monthName}</h3>
              <Button variant="outline" size="icon" onClick={goToNextMonth} className="h-8 w-8 acm-rounded-sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
            <Button
              variant={mode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onModeChange('month')}
              className={`text-xs acm-rounded-sm ${
                mode === 'month' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
              }`}
            >
              Month
            </Button>
            <Button
              variant={mode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onModeChange('week')}
              className={`text-xs acm-rounded-sm ${
                mode === 'week' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
              }`}
            >
              Week
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm text-muted-foreground py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dayTasks = getTasksForDate(day);
            const isToday =
              day.getDate() === new Date().getDate() &&
              day.getMonth() === new Date().getMonth() &&
              day.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={index}
                className={`aspect-square border rounded-lg p-2 hover:bg-muted/50 transition-colors ${
                  isToday ? 'border-primary border-2' : 'border-border'
                }`}
              >
                <div className={`text-sm mb-1 ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <TooltipProvider key={task.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="text-xs px-1 py-0.5 rounded truncate cursor-pointer"
                            style={{
                              backgroundColor: `color-mix(in oklab, ${STATUS_COLOR_VALUES[task.status]} 12%, transparent)`,
                              borderLeft: `3px solid ${STATUS_COLOR_VALUES[task.status]}`,
                            }}
                          >
                            {task.title}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <div>{task.title}</div>
                            <div className="text-muted-foreground">{task.plot} • {task.assignee}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-muted-foreground px-1">+{dayTasks.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-secondary"></div>
            <span className="text-muted-foreground">To Do</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-accent"></div>
            <span className="text-muted-foreground">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-border"></div>
            <span className="text-muted-foreground">Paused</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary"></div>
            <span className="text-muted-foreground">Completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



