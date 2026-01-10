// Task Entity - Public API
// Handles season field operations/tasks for farmers

// Types
export type {
    TaskStatus,
    TaskListParams,
    Task,
    TaskCreateRequest,
    TaskUpdateRequest,
    TaskStatusUpdateRequest,
    TaskStartRequest,
    TaskDoneRequest,
    SeasonMinimal,
} from './model/types';

// Schemas (for external validation needs)
export {
    TaskStatusEnum,
    TaskListParamsSchema,
    TaskSchema,
    TaskCreateRequestSchema,
    TaskUpdateRequestSchema,
    TaskStatusUpdateRequestSchema,
    TaskStartRequestSchema,
    TaskDoneRequestSchema,
    SeasonMinimalSchema,
} from './model/schemas';

// Keys
export { taskKeys } from './model/keys';

// API Client
export { taskApi } from './api/client';

// Hooks
export {
    useTasksBySeason,
    useTasksWorkspace,
    useTaskById,
    useCreateTask,
    useUpdateTask,
    useUpdateTaskStatus,
    useDeleteTask,
} from './api/hooks';
