import { ClipboardList, Columns3, List, CalendarDays, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ViewMode } from '../types';

interface TaskHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateTask: () => void;
}

export function TaskHeader({ viewMode, onViewModeChange, onCreateTask }: TaskHeaderProps) {
  return (
    <Card className="border border-border rounded-xl shadow-sm">
      <CardContent className="px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 leading-tight">
              <ClipboardList className="w-6 h-6 text-emerald-600" />
              Tasks
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage and track all your farm tasks
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* View Switch */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === 'board' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onViewModeChange('board')}
                      className={`acm-rounded-sm ${
                        viewMode === 'board'
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <Columns3 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Board View</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onViewModeChange('list')}
                      className={`acm-rounded-sm ${
                        viewMode === 'list'
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>List View</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onViewModeChange('calendar')}
                      className={`acm-rounded-sm ${
                        viewMode === 'calendar'
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <CalendarDays className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Calendar View</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Create Task Button */}
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground acm-rounded-sm acm-button-shadow"
              onClick={onCreateTask}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



