export type ViewMode = 'board' | 'list' | 'calendar';
export type TaskStatus = 'todo' | 'in-progress' | 'paused' | 'completed';
export type TaskType = 'irrigation' | 'fertilizing' | 'spraying' | 'scouting' | 'harvesting';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  crop: string;
  plot: string;
  assignee: string;
  assigneeInitials: string;
  dueDate: string;
  status: TaskStatus;
  notes: string;
  attachments: number;
  priority: 'high' | 'medium' | 'low';
}

export interface FilterState {
  status: string;
  type: string;
  assignee: string;
  plot: string;
}




