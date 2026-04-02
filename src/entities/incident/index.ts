// Incident Entity - Public API

// Types
export type {
    Incident,
    IncidentListParams,
    IncidentCreateRequest,
    IncidentUpdateRequest,
    IncidentStatusUpdateRequest,
    IncidentSummary,
} from './model/types';

// Schemas
export {
    IncidentSchema,
    IncidentListParamsSchema,
    IncidentCreateRequestSchema,
    IncidentUpdateRequestSchema,
    IncidentStatusUpdateRequestSchema,
    IncidentSummarySchema,
    IncidentTypeEnum,
    IncidentSeverityEnum,
    IncidentStatusEnum,
} from './model/schemas';

// Keys
export { incidentKeys } from './model/keys';

// API Client
export { incidentApi } from './api/client';

// Hooks
export {
    useIncidents,
    useIncidentById,
    useIncidentSummary,
    useIncidentsBySeason,
    useCreateIncident,
    useUpdateIncident,
    useUpdateIncidentStatus,
    useDeleteIncident,
} from './api/hooks';
