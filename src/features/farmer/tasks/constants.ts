import { Droplets, Sprout, ShowerHead, Eye, Package } from 'lucide-react';
import type { Task, TaskStatus } from './types';

export const TASK_TYPES = {
  irrigation: { label: 'Tưới', icon: Droplets, color: 'var(--secondary)' },
  fertilizing: { label: 'Bón phân', icon: Sprout, color: 'var(--primary)' },
  spraying: { label: 'Phun thuốc', icon: ShowerHead, color: 'var(--accent)' },
  scouting: { label: 'Thăm đồng', icon: Eye, color: 'var(--muted-foreground)' },
  harvesting: { label: 'Thu hoạch', icon: Package, color: 'var(--destructive)' },
} as const;

export const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: 'bg-secondary/10 text-secondary border-secondary/20',
  'in-progress': 'bg-accent/10 text-accent border-accent/20',
  overdue: 'bg-destructive/10 text-destructive border-destructive/20',
  completed: 'bg-primary/10 text-primary border-primary/20',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Sắp làm',
  'in-progress': 'Đang làm',
  overdue: 'Trễ hạn',
  completed: 'Hoàn thành',
};

export const STATUS_COLOR_VALUES: Record<TaskStatus, string> = {
  todo: 'var(--secondary)',
  'in-progress': 'var(--accent)',
  overdue: 'var(--destructive)',
  completed: 'var(--primary)',
};

export const KANBAN_COLUMNS = [
  { status: 'todo' as TaskStatus, title: 'Sắp làm', color: 'var(--secondary)' },
  { status: 'in-progress' as TaskStatus, title: 'Đang làm', color: 'var(--accent)' },
  { status: 'overdue' as TaskStatus, title: 'Trễ hạn', color: 'var(--destructive)' },
  { status: 'completed' as TaskStatus, title: 'Hoàn thành', color: 'var(--primary)' },
];

// Note: MOCK_TASKS removed - now using entity API hooks



