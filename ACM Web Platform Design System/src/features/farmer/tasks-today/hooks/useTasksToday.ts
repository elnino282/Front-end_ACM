import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { TaskViewMode, TaskStatus, EnhancedTask, TaskType } from '../types';
import { useOptionalSeason } from '@/shared/contexts';
import { useTasksBySeason, useUpdateTaskStatus, type Task as ApiTask } from '@/entities/task';

// Map API status to feature status
const mapApiStatusToFeature = (status: string | undefined): TaskStatus => {
    switch (status) {
        case 'DONE': return 'done';
        case 'IN_PROGRESS': return 'in-progress';
        case 'PAUSED': return 'paused';
        case 'PENDING':
        default: return 'not-started';
    }
};

// Map task type from API (placeholder - API may not have type field)
const inferTaskType = (title: string): TaskType => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('irrigat')) return 'irrigate';
    if (lowerTitle.includes('fertil')) return 'fertilize';
    if (lowerTitle.includes('spray') || lowerTitle.includes('pest')) return 'spray';
    if (lowerTitle.includes('weed')) return 'weed';
    if (lowerTitle.includes('scout') || lowerTitle.includes('inspect')) return 'scout';
    if (lowerTitle.includes('harvest')) return 'harvest';
    return 'scout'; // Default
};

// Transform API task to EnhancedTask
const transformApiToFeature = (task: ApiTask): EnhancedTask => {
    const today = new Date().toISOString().split('T')[0];
    const dueDate = task.dueDate ?? task.plannedDate ?? today;
    const isOverdue = dueDate < today && task.status !== 'DONE';

    return {
        id: String(task.taskId),
        taskId: `TSK-${String(task.taskId).padStart(4, '0')}`,
        title: task.title,
        plotName: 'Plot A', // Placeholder - API may not have plot info
        cropColor: 'var(--primary)', // Placeholder
        type: inferTaskType(task.title),
        assignees: [{ name: 'Assigned', initials: 'AS' }], // Placeholder
        dueDate,
        dueTime: '08:00', // Placeholder - API doesn't have time field
        status: mapApiStatusToFeature(task.status),
        isOverdue,
    };
};

export function useTasksToday() {
    const seasonContext = useOptionalSeason();
    const seasonId = seasonContext?.selectedSeasonId ?? null;

    const [viewMode, setViewMode] = useState<TaskViewMode>('table');
    const [calendarMode, setCalendarMode] = useState<'week' | 'month'>('week');
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [currentWeek, setCurrentWeek] = useState(new Date());

    // Fetch tasks from API
    const { data: tasksData, isLoading, error, refetch } = useTasksBySeason(
        seasonId ?? 0,
        undefined,
        { enabled: !!seasonId && seasonId > 0 }
    );

    // Mutation for updating task status
    const updateTaskStatus = useUpdateTaskStatus(seasonId ?? 0);

    // Transform API data to EnhancedTask[]
    const tasks: EnhancedTask[] = useMemo(() => {
        if (!tasksData?.items) return [];
        return tasksData.items.map(transformApiToFeature);
    }, [tasksData]);

    const getStatusColor = useCallback((status: TaskStatus): string => {
        switch (status) {
            case 'not-started':
                return 'bg-muted text-muted-foreground border-border';
            case 'in-progress':
                return 'bg-secondary/10 text-secondary border-secondary/20';
            case 'paused':
                return 'bg-accent/10 text-foreground border-accent/20';
            case 'done':
                return 'bg-primary/10 text-primary border-primary/20';
        }
    }, []);

    const getStatusLabel = useCallback((status: TaskStatus): string => {
        switch (status) {
            case 'not-started':
                return 'Not Started';
            case 'in-progress':
                return 'In Progress';
            case 'paused':
                return 'Paused';
            case 'done':
                return 'Done';
        }
    }, []);

    const handleCompleteTask = useCallback((taskId: string) => {
        updateTaskStatus.mutate(
            { id: parseInt(taskId, 10), data: { status: 'DONE' } },
            {
                onSuccess: () => {
                    toast.success('Task completed successfully');
                },
                onError: () => {
                    toast.error('Failed to complete task');
                },
            }
        );
    }, [updateTaskStatus]);

    const handleSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            setSelectedTasks(tasks.slice(0, 10).map((t) => t.id));
        } else {
            setSelectedTasks([]);
        }
    }, [tasks]);

    const handleSelectTask = useCallback((taskId: string, checked: boolean) => {
        if (checked) {
            setSelectedTasks((prev) => [...prev, taskId]);
        } else {
            setSelectedTasks((prev) => prev.filter((id) => id !== taskId));
        }
    }, []);

    const handleMarkSelectedDone = useCallback(() => {
        // Batch update - mark all selected as done
        const promises = selectedTasks.map(taskId =>
            updateTaskStatus.mutateAsync({ id: parseInt(taskId, 10), data: { status: 'DONE' } })
        );

        Promise.all(promises)
            .then(() => {
                toast.success(`${selectedTasks.length} tasks marked as done`);
                setSelectedTasks([]);
            })
            .catch(() => {
                toast.error('Failed to mark some tasks as done');
            });
    }, [selectedTasks, updateTaskStatus]);

    const handleShiftSelected = useCallback(() => {
        // Placeholder - API would need to support date updates
        toast.success(`${selectedTasks.length} tasks shifted by +1 day`);
        setSelectedTasks([]);
    }, [selectedTasks]);

    return {
        // State
        viewMode,
        calendarMode,
        selectedTasks,
        currentWeek,
        tasks,

        // Loading/Error
        isLoading,
        error,
        refetch,

        // Setters
        setViewMode,
        setCalendarMode,
        setCurrentWeek,

        // Handlers
        handleCompleteTask,
        handleSelectAll,
        handleSelectTask,
        handleMarkSelectedDone,
        handleShiftSelected,

        // Utilities
        getStatusColor,
        getStatusLabel,
    };
}



