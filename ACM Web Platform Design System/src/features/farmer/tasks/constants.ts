import { Droplets, Sprout, ShowerHead, Eye, Package } from 'lucide-react';
import type { Task, TaskStatus } from './types';

export const TASK_TYPES = {
  irrigation: { label: 'Irrigation', icon: Droplets, color: 'var(--secondary)' },
  fertilizing: { label: 'Fertilizing', icon: Sprout, color: 'var(--primary)' },
  spraying: { label: 'Spraying', icon: ShowerHead, color: 'var(--accent)' },
  scouting: { label: 'Scouting', icon: Eye, color: 'var(--muted-foreground)' },
  harvesting: { label: 'Harvesting', icon: Package, color: 'var(--destructive)' },
} as const;

export const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: 'bg-secondary/10 text-secondary border-secondary/20',
  'in-progress': 'bg-accent/10 text-accent border-accent/20',
  paused: 'bg-muted/50 text-muted-foreground border-border',
  completed: 'bg-primary/10 text-primary border-primary/20',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  paused: 'Paused',
  completed: 'Completed',
};

export const STATUS_COLOR_VALUES: Record<TaskStatus, string> = {
  todo: 'var(--secondary)',
  'in-progress': 'var(--accent)',
  paused: 'var(--muted-foreground)',
  completed: 'var(--primary)',
};

export const KANBAN_COLUMNS = [
  { status: 'todo' as TaskStatus, title: 'To Do', color: 'var(--secondary)' },
  { status: 'in-progress' as TaskStatus, title: 'In Progress', color: 'var(--accent)' },
  { status: 'paused' as TaskStatus, title: 'Paused (Weather Hold)', color: 'var(--muted-foreground)' },
  { status: 'completed' as TaskStatus, title: 'Completed', color: 'var(--primary)' },
];

// Note: MOCK_TASKS removed - now using entity API hooks



