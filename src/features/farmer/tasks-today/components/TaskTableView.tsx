import { useState } from 'react';
import {
    CheckCircle2,
    Play,
    Pause,
    CalendarClock,
    MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { EnhancedTask, TaskStatus } from '../types';
import { TASK_TYPES } from '../constants';

interface TaskTableViewProps {
    tasks: EnhancedTask[];
    selectedTasks: string[];
    onSelectAll: (checked: boolean) => void;
    onSelectTask: (taskId: string, checked: boolean) => void;
    onComplete: (taskId: string) => void;
    onMarkSelectedDone: () => void;
    onShiftSelected: () => void;
    getStatusColor: (status: TaskStatus) => string;
    getStatusLabel: (status: TaskStatus) => string;
}

export function TaskTableView({
    tasks,
    selectedTasks,
    onSelectAll,
    onSelectTask,
    onComplete,
    onMarkSelectedDone,
    onShiftSelected,
    getStatusColor,
    getStatusLabel,
}: TaskTableViewProps) {
    const [rescheduleTaskId, setRescheduleTaskId] = useState<string | null>(null);

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted border-b border-border">
                        <tr>
                            <th className="px-4 py-3 text-left w-12">
                                <Checkbox
                                    checked={tasks.length > 0 && tasks.every((t) => selectedTasks.includes(t.id))}
                                    onCheckedChange={onSelectAll}
                                />
                            </th>
                            <th className="px-4 py-3 text-left text-sm text-foreground">Task</th>
                            <th className="px-4 py-3 text-left text-sm text-foreground">Plot</th>
                            <th className="px-4 py-3 text-left text-sm text-foreground">Type</th>
                            <th className="px-4 py-3 text-left text-sm text-foreground">Assignee</th>
                            <th className="px-4 py-3 text-left text-sm text-foreground">Due</th>
                            <th className="px-4 py-3 text-left text-sm text-foreground">Status</th>
                            <th className="px-4 py-3 text-left text-sm text-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => {
                            const TaskTypeIcon = TASK_TYPES[task.type].icon;
                            const typeColor = TASK_TYPES[task.type].color;

                            return (
                                <tr
                                    key={task.id}
                                    className="border-b border-border hover:bg-muted/50 transition-all hover:shadow-sm"
                                >
                                    <td className="px-4 py-3">
                                        <Checkbox
                                            checked={selectedTasks.includes(task.id)}
                                            onCheckedChange={(checked: boolean) => onSelectTask(task.id, checked as boolean)}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="numeric text-xs text-muted-foreground">{task.taskId}</span>
                                            <span className="text-sm text-foreground truncate max-w-[200px]">
                                                {task.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            className="acm-rounded-sm"
                                            style={{
                                                backgroundColor: `color-mix(in oklab, ${task.cropColor} 15%, transparent)`,
                                                color: task.cropColor,
                                                borderColor: `color-mix(in oklab, ${task.cropColor} 30%, transparent)`,
                                            }}
                                        >
                                            {task.plotName}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <TaskTypeIcon className="w-4 h-4" style={{ color: typeColor }} />
                                            <span className="text-sm text-muted-foreground">
                                                {TASK_TYPES[task.type].label}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {task.assignees.map((assignee, idx) => (
                                                <TooltipProvider key={idx}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                                                    {assignee.initials}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{assignee.name}</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ))}
                                            <span className="text-sm text-muted-foreground">{task.assignees[0].name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-2 h-2 rounded-full ${task.isOverdue
                                                    ? 'bg-destructive'
                                                    : task.dueDate === '2025-11-09'
                                                        ? 'bg-accent'
                                                        : 'bg-primary'
                                                    }`}
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(task.dueDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                            <span className="numeric text-xs text-muted-foreground">{task.dueTime}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className={`${getStatusColor(task.status)} acm-rounded-sm`}>
                                            {getStatusLabel(task.status)}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            {task.status === 'not-started' && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                                <Play className="w-3 h-3" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Start</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                            {task.status === 'in-progress' && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                                <Pause className="w-3 h-3" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Pause</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                            {task.status !== 'done' && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-primary"
                                                                onClick={() => onComplete(task.id)}
                                                            >
                                                                <CheckCircle2 className="w-3 h-3" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Complete</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                            <Popover
                                                open={rescheduleTaskId === task.id}
                                                onOpenChange={(open: boolean) => !open && setRescheduleTaskId(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => setRescheduleTaskId(task.id)}
                                                    >
                                                        <CalendarClock className="w-3 h-3" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 acm-rounded-lg" align="end">
                                                    <Calendar mode="single" />
                                                    <div className="p-3 border-t">
                                                        <p className="text-xs text-muted-foreground mb-2">Time window hints:</p>
                                                        <div className="flex gap-2">
                                                            <Badge className="text-xs bg-primary/10 text-primary">
                                                                Morning
                                                            </Badge>
                                                            <Badge className="text-xs bg-secondary/10 text-secondary">
                                                                Afternoon
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                <MoreVertical className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Table Footer */}
            <div className="px-4 py-3 border-t border-border bg-muted flex items-center justify-between rounded-b-xl">
                <p className="text-sm text-muted-foreground">
                    Showing up to 10 tasks · Auto-filtered by Season
                </p>
                <div className="flex items-center gap-2">
                    {selectedTasks.length > 0 && (
                        <>
                            <Button
                                size="sm"
                                onClick={onMarkSelectedDone}
                                className="bg-primary hover:bg-primary/90 text-white acm-rounded-sm h-8 text-sm"
                            >
                                Mark Selected Done
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onShiftSelected}
                                className="acm-rounded-sm h-8 text-sm border-border"
                            >
                                Shift Selected by +1 day
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}



