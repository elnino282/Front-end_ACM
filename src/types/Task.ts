export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'OVERDUE' | 'CANCELLED';

export interface Task {
  id: number;
  title: string;
  description?: string;
  seasonId?: number;
  seasonName?: string;
  plannedDate?: string;
  dueDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  status: TaskStatus;
  notes?: string;
  isOverdue?: boolean;
  createdAt?: string;
}

export interface CreateTaskRequest {
  seasonId?: number;
  title: string;
  description?: string;
  plannedDate?: string;
  dueDate?: string;
  notes?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  plannedDate?: string;
  dueDate?: string;
  notes?: string;
}

export interface CompleteTaskRequest {
  actualEndDate: string;
  completionNotes?: string;
}

export interface StartTaskRequest {
  actualStartDate?: string;
}

export interface TaskSearchParams {
  seasonId?: number;
  status?: TaskStatus;
  from?: string;
  to?: string;
  q?: string;
  page?: number;
  size?: number;
}
