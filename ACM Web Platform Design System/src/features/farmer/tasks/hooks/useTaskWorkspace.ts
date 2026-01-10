import { useState, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  useTasksWorkspace,
  useCreateTask,
  useUpdateTaskStatus,
  useDeleteTask,
  type Task as ApiTask,
  type TaskStatus as ApiTaskStatus,
} from '@/entities/task';
import { useOptionalSeason } from '@/shared/contexts';
import type { Task, TaskStatus, TaskType, ViewMode, FilterState } from '../types';
import { STATUS_LABELS } from '../constants';

/**
 * Transform API task to feature task format
 */
const today = new Date().toISOString().split('T')[0];

const toDateOnly = (value?: string | null) => (value ? value.split('T')[0] : undefined);

const buildInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'NA';
  const first = parts[0][0] ?? '';
  const second = parts.length > 1 ? parts[1][0] ?? '' : '';
  return `${first}${second}`.toUpperCase();
};

const splitSeasonLabel = (seasonName?: string | null, seasonId?: number | null) => {
  const name = seasonName?.trim();
  if (name) {
    const parts = name.split(' - ');
    if (parts.length >= 2) {
      return { crop: parts[0], plot: parts.slice(1).join(' - ') };
    }
    return { crop: name, plot: seasonId ? `Season #${seasonId}` : 'General' };
  }
  if (seasonId) {
    const label = `Season #${seasonId}`;
    return { crop: label, plot: label };
  }
  return { crop: 'General', plot: 'Unassigned' };
};

const inferTaskType = (title: string, description?: string | null): TaskType => {
  const text = `${title} ${description ?? ''}`.toLowerCase();
  if (text.includes('irrigat') || text.includes('water')) return 'irrigation';
  if (text.includes('fertil') || text.includes('npk')) return 'fertilizing';
  if (text.includes('spray') || text.includes('pest') || text.includes('insect')) return 'spraying';
  if (text.includes('harvest') || text.includes('collect')) return 'harvesting';
  if (text.includes('inspect') || text.includes('scout')) return 'scouting';
  return 'scouting';
};

const transformApiToFeature = (apiTask: ApiTask): Task => {
  const assignee = apiTask.userName?.trim() || 'Assigned';
  const dueDate = apiTask.dueDate ?? apiTask.plannedDate ?? toDateOnly(apiTask.createdAt) ?? today;
  const { crop, plot } = splitSeasonLabel(apiTask.seasonName, apiTask.seasonId);
  const priority = apiTask.status === 'OVERDUE' || (dueDate && dueDate < today && apiTask.status !== 'DONE')
    ? 'high'
    : 'medium';

  return {
    id: String(apiTask.taskId),
    title: apiTask.title,
    type: inferTaskType(apiTask.title, apiTask.description),
    crop,
    plot,
    assignee,
    assigneeInitials: buildInitials(assignee),
    dueDate,
    status: mapApiStatusToFeature(apiTask.status),
    notes: apiTask.notes ?? apiTask.description ?? '',
    attachments: 0,
    priority,
  };
};

const mapApiStatusToFeature = (status?: string): TaskStatus => {
  switch (status) {
    case 'PENDING': return 'todo';
    case 'IN_PROGRESS': return 'in-progress';
    case 'DONE': return 'completed';
    case 'CANCELLED': return 'paused';
    case 'OVERDUE': return 'in-progress';
    default: return 'todo';
  }
};

const mapFeatureStatusToApi = (status: TaskStatus): ApiTaskStatus => {
  switch (status) {
    case 'todo': return 'PENDING';
    case 'in-progress': return 'IN_PROGRESS';
    case 'paused': return 'CANCELLED';
    case 'completed': return 'DONE';
    default: return 'PENDING';
  }
};

export function useTaskWorkspace() {
  const seasonContext = useOptionalSeason();
  const seasonId = seasonContext?.selectedSeasonId ?? 0;

  // API Hooks - workspace list for current user
  const { data: apiTasksData, isLoading: apiLoading, error: apiError, refetch } = useTasksWorkspace();
  const createMutation = useCreateTask(seasonId, {
    onSuccess: () => { toast.success('Task created'); setCreateTaskOpen(false); },
    onError: (err) => toast.error('Failed to create task', { description: err.message }),
  });
  const updateStatusMutation = useUpdateTaskStatus(seasonId, {
    onSuccess: () => toast.success('Task status updated'),
    onError: (err) => toast.error('Failed to update', { description: err.message }),
  });
  const deleteMutation = useDeleteTask(seasonId, {
    onSuccess: () => toast.success('Task deleted'),
    onError: (err) => toast.error('Failed to delete', { description: err.message }),
  });

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [calendarMode, setCalendarMode] = useState<'month' | 'week'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [filters, setFilters] = useState<FilterState>({ status: 'all', type: 'all', assignee: 'all', plot: 'all' });
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);

  // Transformed data - no mock fallback
  const tasks = useMemo(() => {
    return apiTasksData?.items?.map(transformApiToFeature) ?? [];
  }, [apiTasksData]);

  const isLoading = apiLoading;
  const error = apiError;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2 || searchQuery.length === 0) setSearchDebounced(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    if (searchDebounced) {
      const s = searchDebounced.toLowerCase();
      if (!task.title.toLowerCase().includes(s) && !task.plot.toLowerCase().includes(s) && !task.crop.toLowerCase().includes(s)) return false;
    }
    if (filters.status !== 'all' && task.status !== filters.status) return false;
    if (filters.type !== 'all' && task.type !== filters.type) return false;
    if (filters.assignee !== 'all' && task.assignee !== filters.assignee) return false;
    if (filters.plot !== 'all' && task.plot !== filters.plot) return false;
    return true;
  }), [tasks, searchDebounced, filters]);

  const handleTaskMove = useCallback((taskId: string, newStatus: TaskStatus) => {
    const id = parseInt(taskId, 10);
    if (!isNaN(id)) {
      updateStatusMutation.mutate({ id, data: { status: mapFeatureStatusToApi(newStatus) } });
    } else {
      toast.success(`Task moved to ${STATUS_LABELS[newStatus]}`);
    }
  }, [updateStatusMutation]);

  const handleBulkComplete = useCallback(() => {
    selectedTasks.forEach(taskId => {
      const id = parseInt(taskId, 10);
      if (!isNaN(id)) updateStatusMutation.mutate({ id, data: { status: 'DONE' } });
    });
    toast.success(`${selectedTasks.length} tasks completed`);
    setSelectedTasks([]);
  }, [selectedTasks, updateStatusMutation]);

  const handleDeleteTask = useCallback((taskId: string) => {
    const id = parseInt(taskId, 10);
    if (!isNaN(id)) deleteMutation.mutate(id);
    else toast.success('Task deleted');
  }, [deleteMutation]);

  const handleSelectAll = useCallback((checked: boolean) => setSelectedTasks(checked ? filteredTasks.map(t => t.id) : []), [filteredTasks]);
  const handleSelectTask = useCallback((taskId: string, checked: boolean) => setSelectedTasks(prev => checked ? [...prev, taskId] : prev.filter(id => id !== taskId)), []);
  const handleReassign = useCallback(() => { toast.success(`${selectedTasks.length} tasks reassigned`); setReassignOpen(false); setSelectedTasks([]); }, [selectedTasks]);
  const handleCreateTask = useCallback((data: { title: string; plannedDate: string; dueDate: string; description?: string }) => {
    if (!seasonId) {
      toast.error('Select a season', { description: 'Pick a season to create tasks.' });
      return;
    }
    if (!data.title) {
      toast.error('Task title is required');
      return;
    }
    if (!data.dueDate) {
      toast.error('Due date is required');
      return;
    }
    const plannedDate = data.plannedDate || data.dueDate;
    createMutation.mutate({
      title: data.title,
      plannedDate,
      dueDate: data.dueDate,
      description: data.description,
    });
  }, [seasonId, createMutation]);

  const uniqueAssignees = useMemo(() => [...new Set(tasks.map(t => t.assignee))], [tasks]);
  const uniquePlots = useMemo(() => [...new Set(tasks.map(t => t.plot))], [tasks]);
  const activeFilterCount = useMemo(() => [filters.status, filters.type, filters.assignee, filters.plot].filter(f => f !== 'all').length, [filters]);

  return {
    seasonId, hasSeasonContext: !!seasonContext,
    viewMode, setViewMode, calendarMode, setCalendarMode, currentDate, setCurrentDate,
    searchQuery, setSearchQuery, filters, setFilters, activeFilterCount,
    selectedTasks, setSelectedTasks,
    filterDrawerOpen, setFilterDrawerOpen, createTaskOpen, setCreateTaskOpen, reassignOpen, setReassignOpen,
    tasks, filteredTasks, uniqueAssignees, uniquePlots,
    isLoading, error: error ?? null, refetch,
    handleTaskMove, handleBulkComplete, handleDeleteTask, handleSelectAll, handleSelectTask, handleReassign, handleCreateTask,
    isCreating: createMutation.isPending, isUpdating: updateStatusMutation.isPending, isDeleting: deleteMutation.isPending,
  };
}



