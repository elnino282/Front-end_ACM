import { LucideIcon } from 'lucide-react';

export type TaskViewMode = 'table' | 'calendar' | 'split';

export type TaskType = 'irrigate' | 'fertilize' | 'spray' | 'weed' | 'scout' | 'harvest';

export type TaskStatus = 'not-started' | 'in-progress' | 'paused' | 'done';

export interface Assignee {
    name: string;
    initials: string;
}

export interface EnhancedTask {
    id: string;
    taskId: string; // e.g., "TSK-0234"
    title: string;
    plotName: string;
    cropColor: string;
    type: TaskType;
    assignees: Assignee[];
    dueDate: string;
    dueTime: string;
    status: TaskStatus;
    isOverdue: boolean;
}

export interface TaskTypeConfig {
    label: string;
    icon: LucideIcon;
    color: string;
}



