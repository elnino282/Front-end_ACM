import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// INCIDENT ENUMS
// ═══════════════════════════════════════════════════════════════

export const IncidentTypeEnum = z.enum([
    'PEST_OUTBREAK',
    'DISEASE',
    'EQUIPMENT_FAILURE',
    'WEATHER_DAMAGE',
    'SAFETY',
    'OTHER',
]);

export const IncidentSeverityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const IncidentStatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED']);

// ═══════════════════════════════════════════════════════════════
// INCIDENT RESPONSE
// ═══════════════════════════════════════════════════════════════

export const IncidentSchema = z.object({
    incidentId: z.number().int().positive(),
    seasonId: z.number().int().positive(),
    seasonName: z.string().optional().nullable(),
    reportedById: z.number().optional().nullable(),
    reportedByUsername: z.string().optional().nullable(),
    incidentType: z.string(),
    severity: z.string().nullable(),
    description: z.string().nullable(),
    status: z.string().optional().nullable(),
    deadline: z.string().optional().nullable(),
    resolvedAt: z.string().optional().nullable(),
    createdAt: z.string().optional().nullable(),
});

export type Incident = z.infer<typeof IncidentSchema>;

// ═══════════════════════════════════════════════════════════════
// INCIDENT LIST PARAMS
// ═══════════════════════════════════════════════════════════════

export const IncidentListParamsSchema = z.object({
    seasonId: z.number().int().positive(),
    status: z.string().optional(),
    severity: z.string().optional(),
    type: z.string().optional(),
    q: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    page: z.number().int().default(0),
    size: z.number().int().default(20),
    sort: z.string().optional(),
});

export type IncidentListParams = z.infer<typeof IncidentListParamsSchema>;

// ═══════════════════════════════════════════════════════════════
// INCIDENT CREATE REQUEST
// ═══════════════════════════════════════════════════════════════

export const IncidentCreateRequestSchema = z.object({
    seasonId: z.number().int().positive(),
    incidentType: z.string().min(1, 'Incident type is required'),
    severity: z.string().min(1, 'Severity is required'),
    description: z.string().min(1, 'Description is required'),
    deadline: z.string().optional(),
});

export type IncidentCreateRequest = z.infer<typeof IncidentCreateRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// INCIDENT UPDATE REQUEST
// ═══════════════════════════════════════════════════════════════

export const IncidentUpdateRequestSchema = z.object({
    incidentType: z.string().optional(),
    severity: z.string().optional(),
    description: z.string().optional(),
    deadline: z.string().optional().nullable(),
});

export type IncidentUpdateRequest = z.infer<typeof IncidentUpdateRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// INCIDENT STATUS UPDATE REQUEST
// ═══════════════════════════════════════════════════════════════

export const IncidentStatusUpdateRequestSchema = z.object({
    status: z.string().min(1, 'Status is required'),
    resolutionNote: z.string().optional(),
});

export type IncidentStatusUpdateRequest = z.infer<typeof IncidentStatusUpdateRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// INCIDENT SUMMARY
// ═══════════════════════════════════════════════════════════════

export const IncidentSummarySchema = z.object({
    openCount: z.number().int(),
    inProgressCount: z.number().int(),
    resolvedCount: z.number().int(),
    cancelledCount: z.number().int(),
});

export type IncidentSummary = z.infer<typeof IncidentSummarySchema>;
