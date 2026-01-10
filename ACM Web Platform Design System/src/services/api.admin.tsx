import { z } from 'zod';
import httpClient from '@/shared/api/http';
import { parseApiResponse, parsePageResponse, type PageResponse } from '@/shared/api/types';

// ═══════════════════════════════════════════════════════════════
// ADMIN SCHEMAS
// ═══════════════════════════════════════════════════════════════

// Role Schemas
export const RoleSchema = z.object({
  id: z.number().int().positive().optional(),
  code: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional().nullable(),
});

export type Role = z.infer<typeof RoleSchema>;

// User Schemas
export const AdminUserSchema = z.object({
  id: z.union([z.string(), z.number()]),
  username: z.string(),
  email: z.string().nullable().optional(),
  fullName: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  roles: z.array(z.string()).optional(),
});

export type AdminUser = z.infer<typeof AdminUserSchema>;

export const AdminUserListParamsSchema = z.object({
  keyword: z.string().optional(),
  status: z.string().optional(),
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).default(20),
});

export type AdminUserListParams = z.infer<typeof AdminUserListParamsSchema>;

export const AdminUserCreateRequestSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  roles: z.array(z.string()).optional(),
});

export type AdminUserCreateRequest = z.infer<typeof AdminUserCreateRequestSchema>;

export const AdminUserUpdateRequestSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  roles: z.array(z.string()).optional(),
  status: z.string().optional(),
});

export type AdminUserUpdateRequest = z.infer<typeof AdminUserUpdateRequestSchema>;

export const AdminUserStatusUpdateSchema = z.object({
  status: z.string().min(1, 'Status is required'),
});

export type AdminUserStatusUpdate = z.infer<typeof AdminUserStatusUpdateSchema>;

export const AdminUserRolesUpdateSchema = z.object({
  roles: z.array(z.string()),
});

export type AdminUserRolesUpdate = z.infer<typeof AdminUserRolesUpdateSchema>;

export const RoleCreateRequestSchema = z.object({
  code: z.string().min(1, 'Role code is required'),
  name: z.string().min(1, 'Role name is required'),
  description: z.string().optional(),
});

export type RoleCreateRequest = z.infer<typeof RoleCreateRequestSchema>;

// Document Schemas (Admin CRUD - Updated)
export const AdminDocumentSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional().nullable(),
  documentUrl: z.string(),
  documentType: z.string(),
  status: z.string(),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
  createdBy: z.number().optional().nullable(),
});

export type AdminDocument = z.infer<typeof AdminDocumentSchema>;

export const AdminDocumentListParamsSchema = z.object({
  q: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).default(20),
  sort: z.string().optional(),
});

export type AdminDocumentListParams = z.infer<typeof AdminDocumentListParamsSchema>;

export const AdminDocumentCreateRequestSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  documentUrl: z.string().url('Must be a valid URL'),
  documentType: z.enum(['POLICY', 'GUIDE', 'MANUAL', 'LEGAL', 'OTHER']),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export type AdminDocumentCreateRequest = z.infer<typeof AdminDocumentCreateRequestSchema>;

export const AdminDocumentUpdateRequestSchema = AdminDocumentCreateRequestSchema;

export type AdminDocumentUpdateRequest = z.infer<typeof AdminDocumentUpdateRequestSchema>;

// Legacy Document Schema (compatibility)
export const DocumentSchema = AdminDocumentSchema;
export type Document = AdminDocument;
export const DocumentCreateRequestSchema = AdminDocumentCreateRequestSchema;
export type DocumentCreateRequest = AdminDocumentCreateRequest;

// User Summary Report
export const UserSummarySchema = z.object({
  totalUsers: z.number().int(),
  activeUsers: z.number().int(),
  lockedUsers: z.number().int(),
});

export type UserSummary = z.infer<typeof UserSummarySchema>;

// ═══════════════════════════════════════════════════════════════
// QUERY KEYS
// ═══════════════════════════════════════════════════════════════

export const adminKeys = {
  // All Users (unified)
  users: ['admin', 'users'] as const,
  userList: (params?: AdminUserListParams) => [...adminKeys.users, 'list', params] as const,
  userDetail: (id: number) => [...adminKeys.users, 'detail', id] as const,
  userCanDelete: (id: number) => [...adminKeys.users, 'canDelete', id] as const,
  // Farmers
  farmers: ['admin', 'farmers'] as const,
  farmerList: (params?: AdminUserListParams) => [...adminKeys.farmers, 'list', params] as const,
  farmerDetail: (id: number) => [...adminKeys.farmers, 'detail', id] as const,
  // Buyers
  buyers: ['admin', 'buyers'] as const,
  buyerList: (params?: AdminUserListParams) => [...adminKeys.buyers, 'list', params] as const,
  // Roles
  roles: ['admin', 'roles'] as const,
  roleList: () => [...adminKeys.roles, 'list'] as const,
  // Documents
  documents: ['admin', 'documents'] as const,
  documentList: (params?: AdminDocumentListParams) => [...adminKeys.documents, 'list', params] as const,
  documentDetail: (id: number) => [...adminKeys.documents, 'detail', id] as const,
  // Summary
  summary: ['admin', 'summary'] as const,
};

// ═══════════════════════════════════════════════════════════════
// UNIFIED USER MANAGEMENT API
// ═══════════════════════════════════════════════════════════════

export const adminUsersApi = {
  /** GET /api/v1/admin/users - Search all users */
  list: async (params?: AdminUserListParams): Promise<PageResponse<AdminUser>> => {
    const validatedParams = params ? AdminUserListParamsSchema.parse(params) : undefined;
    const response = await httpClient.get('/api/v1/admin/users', { params: validatedParams });
    return parsePageResponse(response.data, AdminUserSchema);
  },

  /** GET /api/v1/admin/users/{id} - Get user detail */
  getById: async (id: number): Promise<AdminUser> => {
    const response = await httpClient.get(`/api/v1/admin/users/${id}`);
    return parseApiResponse(response.data, AdminUserSchema);
  },

  /** POST /api/v1/admin/users - Create user account */
  create: async (data: AdminUserCreateRequest): Promise<AdminUser> => {
    const validatedPayload = AdminUserCreateRequestSchema.parse(data);
    const response = await httpClient.post('/api/v1/admin/users', validatedPayload);
    return parseApiResponse(response.data, AdminUserSchema);
  },

  /** PUT /api/v1/admin/users/{id} - Update user */
  update: async (id: number, data: AdminUserUpdateRequest): Promise<AdminUser> => {
    const validatedPayload = AdminUserUpdateRequestSchema.parse(data);
    const response = await httpClient.put(`/api/v1/admin/users/${id}`, validatedPayload);
    return parseApiResponse(response.data, AdminUserSchema);
  },

  /** PATCH /api/v1/admin/users/{id}/status - Update user status */
  updateStatus: async (id: number, data: AdminUserStatusUpdate): Promise<AdminUser> => {
    const validatedPayload = AdminUserStatusUpdateSchema.parse(data);
    const response = await httpClient.patch(`/api/v1/admin/users/${id}/status`, validatedPayload);
    return parseApiResponse(response.data, AdminUserSchema);
  },

  /** PATCH /api/v1/admin/users/{id}/password - Reset user password */
  resetPassword: async (id: number, password: string): Promise<AdminUser> => {
    const response = await httpClient.patch(`/api/v1/admin/users/${id}/password`, { password });
    return parseApiResponse(response.data, AdminUserSchema);
  },

  /** GET /api/v1/admin/users/{id}/can-delete - Check if user can be deleted */
  canDelete: async (id: number): Promise<boolean> => {
    const response = await httpClient.get(`/api/v1/admin/users/${id}/can-delete`);
    return parseApiResponse(response.data, z.boolean());
  },

  /** DELETE /api/v1/admin/users/{id} - Delete user */
  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/admin/users/${id}`);
  },
};

// ═══════════════════════════════════════════════════════════════
// FARMER MANAGEMENT API
// ═══════════════════════════════════════════════════════════════

export const adminFarmerApi = {
  /** GET /api/v1/admin/users/farmers - Search farmers */
  list: async (params?: AdminUserListParams): Promise<PageResponse<AdminUser>> => {
    const validatedParams = params ? AdminUserListParamsSchema.parse(params) : undefined;
    const response = await httpClient.get('/api/v1/admin/users/farmers', { params: validatedParams });
    return parsePageResponse(response.data, AdminUserSchema);
  },

  /** GET /api/v1/admin/users/farmers/{id} - Get farmer detail */
  getById: async (id: number): Promise<AdminUser> => {
    const response = await httpClient.get(`/api/v1/admin/users/farmers/${id}`);
    return parseApiResponse(response.data, AdminUserSchema);
  },

  /** POST /api/v1/admin/users/farmers - Create farmer account */
  create: async (data: AdminUserCreateRequest): Promise<AdminUser> => {
    const validatedPayload = AdminUserCreateRequestSchema.parse(data);
    const response = await httpClient.post('/api/v1/admin/users/farmers', validatedPayload);
    return parseApiResponse(response.data, AdminUserSchema);
  },

  /** PATCH /api/v1/admin/users/farmers/{id}/status - Update farmer status */
  updateStatus: async (id: number, data: AdminUserStatusUpdate): Promise<AdminUser> => {
    const validatedPayload = AdminUserStatusUpdateSchema.parse(data);
    const response = await httpClient.patch(`/api/v1/admin/users/farmers/${id}/status`, validatedPayload);
    return parseApiResponse(response.data, AdminUserSchema);
  },

  /** PUT /api/v1/admin/users/farmers/{id}/roles - Update farmer roles */
  updateRoles: async (id: number, data: AdminUserRolesUpdate): Promise<AdminUser> => {
    const validatedPayload = AdminUserRolesUpdateSchema.parse(data);
    const response = await httpClient.put(`/api/v1/admin/users/farmers/${id}/roles`, validatedPayload);
    return parseApiResponse(response.data, AdminUserSchema);
  },

  /** DELETE /api/v1/admin/users/farmers/{id} - Delete farmer */
  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/admin/users/farmers/${id}`);
  },
};

// ═══════════════════════════════════════════════════════════════
// BUYER MANAGEMENT API
// ═══════════════════════════════════════════════════════════════

export const adminBuyerApi = {
  /** GET /api/v1/admin/users/buyers - Search buyers */
  list: async (params?: AdminUserListParams): Promise<PageResponse<AdminUser>> => {
    const validatedParams = params ? AdminUserListParamsSchema.parse(params) : undefined;
    const response = await httpClient.get('/api/v1/admin/users/buyers', { params: validatedParams });
    return parsePageResponse(response.data, AdminUserSchema);
  },
};

// ═══════════════════════════════════════════════════════════════
// ROLE MANAGEMENT API
// ═══════════════════════════════════════════════════════════════

export const adminRoleApi = {
  /** GET /api/v1/admin/roles - List all roles */
  list: async (): Promise<Role[]> => {
    const response = await httpClient.get('/api/v1/admin/roles');
    return parseApiResponse(response.data, z.array(RoleSchema));
  },

  /** POST /api/v1/admin/roles - Create role */
  create: async (data: RoleCreateRequest): Promise<Role> => {
    const validatedPayload = RoleCreateRequestSchema.parse(data);
    const response = await httpClient.post('/api/v1/admin/roles', validatedPayload);
    return parseApiResponse(response.data, RoleSchema);
  },

  /** DELETE /api/v1/admin/roles/{roleCode} - Delete role */
  delete: async (roleCode: string): Promise<void> => {
    await httpClient.delete(`/api/v1/admin/roles/${roleCode}`);
  },
};

// ═══════════════════════════════════════════════════════════════
// DOCUMENT MANAGEMENT API (Admin CRUD - Updated)
// ═══════════════════════════════════════════════════════════════

export const adminDocumentApi = {
  /** GET /api/v1/admin/documents - List documents with pagination and filters (Admin only) */
  list: async (params?: AdminDocumentListParams): Promise<PageResponse<AdminDocument>> => {
    const validatedParams = params ? AdminDocumentListParamsSchema.parse(params) : undefined;
    const response = await httpClient.get('/api/v1/admin/documents', { params: validatedParams });
    return parsePageResponse(response.data, AdminDocumentSchema);
  },

  /** GET /api/v1/admin/documents/{id} - Get document by ID (Admin only) */
  getById: async (id: number): Promise<AdminDocument> => {
    const response = await httpClient.get(`/api/v1/admin/documents/${id}`);
    return parseApiResponse(response.data, AdminDocumentSchema);
  },

  /** POST /api/v1/admin/documents - Create document (Admin only) */
  create: async (data: AdminDocumentCreateRequest): Promise<AdminDocument> => {
    const validatedPayload = AdminDocumentCreateRequestSchema.parse(data);
    const response = await httpClient.post('/api/v1/admin/documents', validatedPayload);
    return parseApiResponse(response.data, AdminDocumentSchema);
  },

  /** PUT /api/v1/admin/documents/{id} - Update document (Admin only) */
  update: async (id: number, data: AdminDocumentUpdateRequest): Promise<AdminDocument> => {
    const validatedPayload = AdminDocumentUpdateRequestSchema.parse(data);
    const response = await httpClient.put(`/api/v1/admin/documents/${id}`, validatedPayload);
    return parseApiResponse(response.data, AdminDocumentSchema);
  },

  /** DELETE /api/v1/admin/documents/{id} - Soft delete document (Admin only) */
  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/admin/documents/${id}`);
  },

  /** DELETE /api/v1/admin/documents/{id}/permanent - Hard delete document (Admin only) */
  hardDelete: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/admin/documents/${id}/permanent`);
  },
};

// ═══════════════════════════════════════════════════════════════
// USER SUMMARY REPORT API
// ═══════════════════════════════════════════════════════════════

export const adminSummaryApi = {
  /** GET /api/v1/admin/reports/users/summary - Get user summary report */
  getSummary: async (): Promise<UserSummary> => {
    const response = await httpClient.get('/api/v1/admin/reports/users/summary');
    return parseApiResponse(response.data, UserSummarySchema);
  },
};

// ═══════════════════════════════════════════════════════════════
// ADMIN DASHBOARD API (Real-time Stats)
// ═══════════════════════════════════════════════════════════════

// Business-validated schemas matching backend DashboardStatsDTO
export const DashboardStatsSummarySchema = z.object({
  totalUsers: z.number().int().nonnegative().default(0),
  totalFarms: z.number().int().nonnegative().default(0),
  totalPlots: z.number().int().nonnegative().optional().default(0),
  totalSeasons: z.number().int().nonnegative().default(0),
});

export const UserRoleCountSchema = z.object({
  role: z.string(),
  total: z.number().int().nonnegative(),
});

export const UserStatusCountSchema = z.object({
  status: z.string().nullable(),
  total: z.number().int().nonnegative(),
});

export const SeasonStatusCountSchema = z.object({
  status: z.string().nullable(),
  total: z.number().int().nonnegative(),
});

export const RiskySeasonSchema = z.object({
  seasonId: z.number().int().positive(),
  seasonName: z.string(),
  farmName: z.string().nullable(),
  plotName: z.string().nullable(),
  status: z.string().nullable(),
  incidentCount: z.number().int().nonnegative(),
  overdueTaskCount: z.number().int().nonnegative(),
  riskScore: z.number().int().nonnegative(),
});

export const InventoryHealthSchema = z.object({
  farmId: z.number().int().positive(),
  farmName: z.string(),
  expiredCount: z.number().int().nonnegative(),
  expiringSoonCount: z.number().int().nonnegative(),
  totalAtRisk: z.number().int().nonnegative(),
});

export const DashboardStatsSchema = z.object({
  summary: DashboardStatsSummarySchema.optional().default({ totalUsers: 0, totalFarms: 0, totalPlots: 0, totalSeasons: 0 }),
  userRoleCounts: z.array(UserRoleCountSchema).optional().default([]),
  userStatusCounts: z.array(UserStatusCountSchema).optional().default([]),
  seasonStatusCounts: z.array(SeasonStatusCountSchema).optional().default([]),
  riskySeasons: z.array(RiskySeasonSchema).optional().default([]),
  inventoryHealth: z.array(InventoryHealthSchema).optional().default([]),
});

export type DashboardStatsSummary = z.infer<typeof DashboardStatsSummarySchema>;
export type UserRoleCount = z.infer<typeof UserRoleCountSchema>;
export type UserStatusCount = z.infer<typeof UserStatusCountSchema>;
export type SeasonStatusCount = z.infer<typeof SeasonStatusCountSchema>;
export type RiskySeason = z.infer<typeof RiskySeasonSchema>;
export type InventoryHealth = z.infer<typeof InventoryHealthSchema>;
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;

// Query keys for TanStack Query
export const dashboardStatsKeys = {
  all: ['admin', 'dashboard-stats'] as const,
  stats: () => [...dashboardStatsKeys.all] as const,
};

export const adminDashboardStatsApi = {
  /** GET /api/v1/admin/dashboard-stats - Get real-time dashboard statistics */
  getStats: async (): Promise<DashboardStats> => {
    const response = await httpClient.get('/api/v1/admin/dashboard-stats');
    return parseApiResponse(response.data, DashboardStatsSchema);
  },
};

// Legacy API (kept for compatibility)
export const AdminDashboardSummarySchema = z.object({
  summary: z.object({
    totalUsers: z.number(),
    totalFarms: z.number(),
    activeSeasonsCount: z.number(),
    openIncidentsCount: z.number(),
    expensesThisMonth: z.number(),
    harvestThisMonth: z.number(),
  }),
  latestItems: z.object({
    latestIncidents: z.array(z.any()),
    latestSeasons: z.array(z.any()),
    latestMovements: z.array(z.any()),
  }),
});

export type AdminDashboardSummary = z.infer<typeof AdminDashboardSummarySchema>;

export const adminDashboardApi = {
  /** GET /api/v1/admin/dashboard/summary - Get admin dashboard summary (legacy) */
  getSummary: async (): Promise<AdminDashboardSummary> => {
    const response = await httpClient.get('/api/v1/admin/dashboard/summary');
    return parseApiResponse(response.data, AdminDashboardSummarySchema);
  },
};

// ═══════════════════════════════════════════════════════════════
// ADMIN FARMS API
// ═══════════════════════════════════════════════════════════════

export const AdminFarmSchema = z.object({
  id: z.number(),
  name: z.string(),
  area: z.number().nullable(),
  active: z.boolean(),
  ownerUsername: z.string().nullable(),
  provinceName: z.string().nullable(),
  wardName: z.string().nullable(),
});

export type AdminFarm = z.infer<typeof AdminFarmSchema>;

export const AdminFarmDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  provinceId: z.number().nullable(),
  wardId: z.number().nullable(),
  provinceName: z.string().nullable(),
  wardName: z.string().nullable(),
  area: z.number().nullable(),
  active: z.boolean(),
  ownerId: z.number().nullable(),
  ownerUsername: z.string().nullable(),
  ownerFullName: z.string().nullable(),
});

export type AdminFarmDetail = z.infer<typeof AdminFarmDetailSchema>;

// Request schemas for admin farm operations
export const AdminFarmUpdateRequestSchema = z.object({
  name: z.string().min(1, 'Farm name is required'),
  provinceId: z.number({ required_error: 'Province is required' }),
  wardId: z.number({ required_error: 'Ward is required' }),
  area: z.number().positive('Area must be positive'),
  ownerId: z.number({ required_error: 'Owner is required' }),
  active: z.boolean(),
});

export type AdminFarmUpdateRequest = z.infer<typeof AdminFarmUpdateRequestSchema>;

export const AdminPlotCreateRequestSchema = z.object({
  plotName: z.string().min(1, 'Plot name is required'),
  area: z.number().positive().optional(),
  soilType: z.string().optional(),
  provinceId: z.number().optional(),
  wardId: z.number().optional(),
});

export type AdminPlotCreateRequest = z.infer<typeof AdminPlotCreateRequestSchema>;

export const adminFarmApi = {
  /** GET /api/v1/admin/farms - List all farms */
  list: async (params?: { keyword?: string; active?: boolean; page?: number; size?: number }) => {
    const response = await httpClient.get('/api/v1/admin/farms', { params });
    return response.data;
  },

  /** GET /api/v1/admin/farms/{id} - Get farm detail */
  getById: async (id: number): Promise<AdminFarmDetail> => {
    const response = await httpClient.get(`/api/v1/admin/farms/${id}`);
    return parseApiResponse(response.data, AdminFarmDetailSchema);
  },

  /** PUT /api/v1/admin/farms/{id} - Update farm (cascades owner to plots) */
  update: async (id: number, data: AdminFarmUpdateRequest): Promise<AdminFarmDetail> => {
    const validatedPayload = AdminFarmUpdateRequestSchema.parse(data);
    const response = await httpClient.put(`/api/v1/admin/farms/${id}`, validatedPayload);
    return parseApiResponse(response.data, AdminFarmDetailSchema);
  },

  /** POST /api/v1/admin/farms/{id}/plots - Add plot to farm */
  addPlot: async (farmId: number, data: AdminPlotCreateRequest) => {
    const validatedPayload = AdminPlotCreateRequestSchema.parse(data);
    const response = await httpClient.post(`/api/v1/admin/farms/${farmId}/plots`, validatedPayload);
    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════
// ADMIN SEASONS API
// ═══════════════════════════════════════════════════════════════

// Season Update Request Schema
export const AdminSeasonUpdateRequestSchema = z.object({
  status: z.string().optional(),
  endDate: z.string().optional(),
  actualYieldKg: z.number().positive().optional(),
  notes: z.string().optional(),
});

export type AdminSeasonUpdateRequest = z.infer<typeof AdminSeasonUpdateRequestSchema>;

export const adminSeasonApi = {
  /** GET /api/v1/admin/seasons - List all seasons with filtering */
  list: async (params?: {
    farmId?: number;
    status?: string;
    cropId?: number;
    plotId?: number;
    page?: number;
    size?: number
  }) => {
    const response = await httpClient.get('/api/v1/admin/seasons', { params });
    return response.data;
  },

  /** GET /api/v1/admin/seasons/{id} - Get season detail */
  getById: async (id: number) => {
    const response = await httpClient.get(`/api/v1/admin/seasons/${id}`);
    return response.data;
  },

  /** GET /api/v1/admin/seasons/{id}/pending-task-count - Get count of non-DONE tasks */
  getPendingTaskCount: async (id: number): Promise<number> => {
    const response = await httpClient.get(`/api/v1/admin/seasons/${id}/pending-task-count`);
    return response.data?.data ?? 0;
  },

  /** PUT /api/v1/admin/seasons/{id} - Update season (admin intervention) */
  update: async (id: number, data: AdminSeasonUpdateRequest) => {
    const validatedPayload = AdminSeasonUpdateRequestSchema.parse(data);
    const response = await httpClient.put(`/api/v1/admin/seasons/${id}`, validatedPayload);
    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════
// ADMIN INCIDENTS API
// ═══════════════════════════════════════════════════════════════

export const adminIncidentApi = {
  /** GET /api/v1/admin/incidents - List all incidents */
  list: async (params?: { status?: string; severity?: string; type?: string; page?: number; size?: number }) => {
    const response = await httpClient.get('/api/v1/admin/incidents', { params });
    return response.data;
  },

  /** GET /api/v1/admin/incidents/{id} - Get incident detail */
  getById: async (id: number) => {
    const response = await httpClient.get(`/api/v1/admin/incidents/${id}`);
    return response.data;
  },

  /** PATCH /api/v1/admin/incidents/{id}/triage - Triage incident (OPEN -> IN_PROGRESS) */
  triage: async (id: number, data: { severity: string; deadline?: string; assigneeId?: number }) => {
    const response = await httpClient.patch(`/api/v1/admin/incidents/${id}/triage`, data);
    return response.data;
  },

  /** PATCH /api/v1/admin/incidents/{id}/resolve - Resolve incident (IN_PROGRESS -> RESOLVED) */
  resolve: async (id: number, data: { resolutionNote: string }) => {
    const response = await httpClient.patch(`/api/v1/admin/incidents/${id}/resolve`, data);
    return response.data;
  },

  /** PATCH /api/v1/admin/incidents/{id}/cancel - Cancel incident (OPEN/IN_PROGRESS -> CANCELLED) */
  cancel: async (id: number, data: { cancellationReason: string }) => {
    const response = await httpClient.patch(`/api/v1/admin/incidents/${id}/cancel`, data);
    return response.data;
  },

  /** PATCH /api/v1/admin/incidents/{id}/status - Update incident status (Legacy) */
  updateStatus: async (id: number, status: string) => {
    const response = await httpClient.patch(`/api/v1/admin/incidents/${id}/status`, { status });
    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════
// ADMIN REPORTS API - SCHEMAS
// ═══════════════════════════════════════════════════════════════

// Runtime-safe numeric: coerce BigDecimal/string to number, NaN → 0
const NumericSchema = z.preprocess(
  (val) => {
    if (val === null || val === undefined) return 0;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return Number.isFinite(num) ? num : 0;
  },
  z.number()
);

// Nullable ratio: for percentages like profitMargin, costPerKg, variancePercent. NaN → null
const NullableRatioSchema = z.preprocess(
  (val) => {
    if (val === null || val === undefined) return null;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return Number.isFinite(num) ? num : null;
  },
  z.number().nullable()
);

// Report filter params for API calls
export interface ReportFilterParams {
  year?: number;
  fromDate?: string;  // YYYY-MM-DD format
  toDate?: string;    // YYYY-MM-DD format
  cropId?: number;
  farmId?: number;
  plotId?: number;
}

// Legacy schemas (backward compatibility)
export const MonthlyTotalSchema = z.object({
  year: z.number(),
  month: z.number(),
  total: NumericSchema,
});

export const SeasonHarvestSchema = z.object({
  seasonId: z.number(),
  seasonName: z.string().nullable(),
  cropName: z.string().nullable(),
  totalQuantity: NumericSchema,
});

export const IncidentsSummarySchema = z.object({
  bySeverity: z.record(z.string(), z.number()),
  byStatus: z.record(z.string(), z.number()),
  totalCount: z.number(),
});

export const MovementSummarySchema = z.object({
  year: z.number(),
  month: z.number(),
  movementType: z.string().nullable(),
  totalQuantity: NumericSchema,
});

// NEW Analytics Schemas
export const YieldReportSchema = z.object({
  seasonId: z.number(),
  seasonName: z.string().nullable(),
  cropName: z.string().nullable(),
  plotName: z.string().nullable(),
  farmName: z.string().nullable(),
  expectedYieldKg: NumericSchema,
  actualYieldKg: NumericSchema,
  variancePercent: NullableRatioSchema,
});

export const CostReportSchema = z.object({
  seasonId: z.number(),
  seasonName: z.string().nullable(),
  cropName: z.string().nullable(),
  totalExpense: NumericSchema,
  totalYieldKg: NumericSchema,
  costPerKg: NullableRatioSchema,
});

export const RevenueReportSchema = z.object({
  seasonId: z.number(),
  seasonName: z.string().nullable(),
  cropName: z.string().nullable(),
  totalQuantity: NumericSchema,
  totalRevenue: NumericSchema,
  avgPricePerUnit: NullableRatioSchema,
});

export const ProfitReportSchema = z.object({
  seasonId: z.number(),
  seasonName: z.string().nullable(),
  cropName: z.string().nullable(),
  farmName: z.string().nullable(),
  totalRevenue: NumericSchema,
  totalExpense: NumericSchema,
  grossProfit: NumericSchema,
  profitMargin: NullableRatioSchema,
  returnOnCost: NullableRatioSchema,
});

export const TaskPerformanceReportSchema = z.object({
  totalTasks: z.number(),
  completedTasks: z.number(),
  overdueTasks: z.number(),
  pendingTasks: z.number(),
  inProgressTasks: z.number(),
  cancelledTasks: z.number(),
  completionRate: NumericSchema,
  overdueRate: NumericSchema,
});

export const InventoryOnHandReportSchema = z.object({
  warehouseId: z.number(),
  warehouseName: z.string(),
  farmName: z.string().nullable(),
  totalLots: z.number(),
  totalQuantityOnHand: NumericSchema,
  expiredLots: z.number(),
  expiringSoonLots: z.number(),
});

export const IncidentStatisticsReportSchema = z.object({
  byIncidentType: z.record(z.string(), z.number()),
  bySeverity: z.record(z.string(), z.number()),
  byStatus: z.record(z.string(), z.number()),
  totalCount: z.number(),
  openCount: z.number(),
  resolvedCount: z.number(),
  averageResolutionDays: NumericSchema,
});

// Export types
export type MonthlyTotal = z.infer<typeof MonthlyTotalSchema>;
export type SeasonHarvest = z.infer<typeof SeasonHarvestSchema>;
export type IncidentsSummary = z.infer<typeof IncidentsSummarySchema>;
export type MovementSummary = z.infer<typeof MovementSummarySchema>;
export type YieldReport = z.infer<typeof YieldReportSchema>;
export type CostReport = z.infer<typeof CostReportSchema>;
export type RevenueReport = z.infer<typeof RevenueReportSchema>;
export type ProfitReport = z.infer<typeof ProfitReportSchema>;
export type TaskPerformanceReport = z.infer<typeof TaskPerformanceReportSchema>;
export type InventoryOnHandReport = z.infer<typeof InventoryOnHandReportSchema>;
export type IncidentStatisticsReport = z.infer<typeof IncidentStatisticsReportSchema>;

// Helper: normalize params for stable query keys (remove undefined, fixed order)
const normalizeReportParams = (p?: ReportFilterParams) => ({
  ...(p?.year !== undefined && { year: p.year }),
  ...(p?.fromDate !== undefined && { fromDate: p.fromDate }),
  ...(p?.toDate !== undefined && { toDate: p.toDate }),
  ...(p?.cropId !== undefined && { cropId: p.cropId }),
  ...(p?.farmId !== undefined && { farmId: p.farmId }),
  ...(p?.plotId !== undefined && { plotId: p.plotId }),
});

// Query keys for reports
export const reportsKeys = {
  all: ['adminReports'] as const,
  yield: (p?: ReportFilterParams) => [...reportsKeys.all, 'yield', normalizeReportParams(p)] as const,
  cost: (p?: ReportFilterParams) => [...reportsKeys.all, 'cost', normalizeReportParams(p)] as const,
  revenue: (p?: ReportFilterParams) => [...reportsKeys.all, 'revenue', normalizeReportParams(p)] as const,
  profit: (p?: ReportFilterParams) => [...reportsKeys.all, 'profit', normalizeReportParams(p)] as const,
  taskPerformance: (year?: number) => [...reportsKeys.all, 'taskPerformance', year] as const,
  inventoryOnHand: () => [...reportsKeys.all, 'inventoryOnHand'] as const,
  incidentStatistics: (year?: number) => [...reportsKeys.all, 'incidentStatistics', year] as const,
};

// ═══════════════════════════════════════════════════════════════
// ADMIN REPORTS API - METHODS
// ═══════════════════════════════════════════════════════════════

export const adminReportsApi = {
  // Legacy endpoints
  /** GET /api/v1/admin/reports/expenses-by-month */
  getExpensesByMonth: async (year?: number): Promise<MonthlyTotal[]> => {
    const response = await httpClient.get('/api/v1/admin/reports/expenses-by-month', { params: { year } });
    return parseApiResponse(response.data, z.array(MonthlyTotalSchema));
  },

  /** GET /api/v1/admin/reports/harvest-by-season */
  getHarvestBySeason: async (): Promise<SeasonHarvest[]> => {
    const response = await httpClient.get('/api/v1/admin/reports/harvest-by-season');
    return parseApiResponse(response.data, z.array(SeasonHarvestSchema));
  },

  /** GET /api/v1/admin/reports/incidents-summary */
  getIncidentsSummary: async (): Promise<IncidentsSummary> => {
    const response = await httpClient.get('/api/v1/admin/reports/incidents-summary');
    return parseApiResponse(response.data, IncidentsSummarySchema);
  },

  /** GET /api/v1/admin/reports/inventory-movements */
  getInventoryMovements: async (year?: number): Promise<MovementSummary[]> => {
    const response = await httpClient.get('/api/v1/admin/reports/inventory-movements', { params: { year } });
    return parseApiResponse(response.data, z.array(MovementSummarySchema));
  },

  // NEW Analytics endpoints (all accept ReportFilterParams)
  /** GET /api/v1/admin/reports/yield - Yield report: expected vs actual */
  getYieldReport: async (params?: ReportFilterParams): Promise<YieldReport[]> => {
    const response = await httpClient.get('/api/v1/admin/reports/yield', { params });
    return parseApiResponse(response.data, z.array(YieldReportSchema));
  },

  /** GET /api/v1/admin/reports/cost - Cost report: expense per season with cost/kg */
  getCostReport: async (params?: ReportFilterParams): Promise<CostReport[]> => {
    const response = await httpClient.get('/api/v1/admin/reports/cost', { params });
    return parseApiResponse(response.data, z.array(CostReportSchema));
  },

  /** GET /api/v1/admin/reports/revenue - Revenue report: harvest quantity * price */
  getRevenueReport: async (params?: ReportFilterParams): Promise<RevenueReport[]> => {
    const response = await httpClient.get('/api/v1/admin/reports/revenue', { params });
    return parseApiResponse(response.data, z.array(RevenueReportSchema));
  },

  /** GET /api/v1/admin/reports/profit - Profit report: revenue vs expense with margins */
  getProfitReport: async (params?: ReportFilterParams): Promise<ProfitReport[]> => {
    const response = await httpClient.get('/api/v1/admin/reports/profit', { params });
    return parseApiResponse(response.data, z.array(ProfitReportSchema));
  },

  /** GET /api/v1/admin/reports/task-performance - Task completion and overdue rates */
  getTaskPerformance: async (year?: number): Promise<TaskPerformanceReport> => {
    const response = await httpClient.get('/api/v1/admin/reports/task-performance', { params: { year } });
    return parseApiResponse(response.data, TaskPerformanceReportSchema);
  },

  /** GET /api/v1/admin/reports/inventory-onhand - Current stock by warehouse */
  getInventoryOnHand: async (): Promise<InventoryOnHandReport[]> => {
    const response = await httpClient.get('/api/v1/admin/reports/inventory-onhand');
    return parseApiResponse(response.data, z.array(InventoryOnHandReportSchema));
  },

  /** GET /api/v1/admin/reports/incident-statistics - Incident breakdown with resolution metrics */
  getIncidentStatistics: async (year?: number): Promise<IncidentStatisticsReport> => {
    const response = await httpClient.get('/api/v1/admin/reports/incident-statistics', { params: { year } });
    return parseApiResponse(response.data, IncidentStatisticsReportSchema);
  },
};

// ═══════════════════════════════════════════════════════════════
// ADMIN CROPS API
// ═══════════════════════════════════════════════════════════════

export const adminCropApi = {
  /** GET /api/v1/admin/crops - List all crops */
  list: async () => {
    const response = await httpClient.get('/api/v1/admin/crops');
    return response.data;
  },

  /** POST /api/v1/admin/crops - Create crop */
  create: async (data: { cropName: string; description?: string }) => {
    const response = await httpClient.post('/api/v1/admin/crops', data);
    return response.data;
  },

  /** PUT /api/v1/admin/crops/{id} - Update crop */
  update: async (id: number, data: { cropName: string; description?: string }) => {
    const response = await httpClient.put(`/api/v1/admin/crops/${id}`, data);
    return response.data;
  },

  /** DELETE /api/v1/admin/crops/{id} - Delete crop */
  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/admin/crops/${id}`);
  },
};

// ═══════════════════════════════════════════════════════════════
// ADMIN VARIETIES API
// ═══════════════════════════════════════════════════════════════

export const adminVarietyApi = {
  /** GET /api/v1/admin/varieties - List all varieties */
  list: async (cropId?: number) => {
    const response = await httpClient.get('/api/v1/admin/varieties', { params: { cropId } });
    return response.data;
  },

  /** POST /api/v1/admin/varieties - Create variety */
  create: async (data: { name: string; cropId: number; description?: string }) => {
    const response = await httpClient.post('/api/v1/admin/varieties', data);
    return response.data;
  },

  /** PUT /api/v1/admin/varieties/{id} - Update variety */
  update: async (id: number, data: { name: string; cropId: number; description?: string }) => {
    const response = await httpClient.put(`/api/v1/admin/varieties/${id}`, data);
    return response.data;
  },

  /** DELETE /api/v1/admin/varieties/{id} - Delete variety */
  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/admin/varieties/${id}`);
  },
};

// ═══════════════════════════════════════════════════════════════
// ADMIN WAREHOUSES API
// ═══════════════════════════════════════════════════════════════

export const adminWarehouseApi = {
  /** GET /api/v1/admin/warehouses - List all warehouses */
  list: async (params?: { keyword?: string; page?: number; size?: number }) => {
    const response = await httpClient.get('/api/v1/admin/warehouses', { params });
    return response.data;
  },

  /** GET /api/v1/admin/warehouses/{id} - Get warehouse detail */
  getById: async (id: number) => {
    const response = await httpClient.get(`/api/v1/admin/warehouses/${id}`);
    return response.data;
  },

  /** GET /api/v1/admin/warehouses/{id}/locations - Get warehouse locations */
  getLocations: async (id: number) => {
    const response = await httpClient.get(`/api/v1/admin/warehouses/${id}/locations`);
    return response.data;
  },

  /** GET /api/v1/admin/warehouses/{id}/movements - Get warehouse movements */
  getMovements: async (id: number, params?: { page?: number; size?: number }) => {
    const response = await httpClient.get(`/api/v1/admin/warehouses/${id}/movements`, { params });
    return response.data;
  },

  /** GET /api/v1/admin/warehouses/movements - List all movements */
  listAllMovements: async (params?: { page?: number; size?: number }) => {
    const response = await httpClient.get('/api/v1/admin/warehouses/movements', { params });
    return response.data;
  },

  /** POST /api/v1/admin/warehouses/movements - Record stock movement (IN/OUT/ADJUST) */
  recordMovement: async (data: {
    supplyLotId: number;
    warehouseId: number;
    locationId?: number;
    movementType: 'IN' | 'OUT' | 'ADJUST';
    quantity: number; // Can be negative for ADJUST
    seasonId?: number;
    note?: string;
  }) => {
    const response = await httpClient.post('/api/v1/admin/warehouses/movements', data);
    return response.data;
  },

  /** GET /api/v1/admin/warehouses/lots/{lotId}/on-hand - Get current stock for a lot */
  getOnHandQuantity: async (lotId: number, warehouseId: number, locationId?: number): Promise<number> => {
    const response = await httpClient.get(`/api/v1/admin/warehouses/lots/${lotId}/on-hand`, {
      params: { warehouseId, locationId }
    });
    return response.data?.result ?? 0;
  },
};

// ═══════════════════════════════════════════════════════════════
// ADMIN SUPPLIERS/SUPPLIES API
// ═══════════════════════════════════════════════════════════════

// Supplier Request Types
export interface SupplierCreateRequest {
  name: string;
  licenseNo?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface SupplierUpdateRequest {
  name: string;
  licenseNo?: string;
  contactEmail?: string;
  contactPhone?: string;
}

// Supply Item Request Types
export interface SupplyItemCreateRequest {
  name: string;
  category?: string;
  activeIngredient?: string;
  unit?: string;
  restrictedFlag?: boolean;
  description?: string;
}

export interface SupplyItemUpdateRequest {
  name: string;
  category?: string;
  activeIngredient?: string;
  unit?: string;
  restrictedFlag?: boolean;
  description?: string;
}

// Supply Lot Request Types
export interface SupplyLotCreateRequest {
  supplyItemId: number;
  supplierId?: number;
  batchCode?: string;
  expiryDate?: string;
  status?: string;
}

export interface SupplyLotUpdateRequest {
  supplyItemId: number;
  supplierId?: number;
  batchCode?: string;
  expiryDate?: string;
  status?: string;
}

export const adminSupplierApi = {
  // ═══════════════ SUPPLIERS ═══════════════

  /** GET /api/v1/admin/suppliers - List all suppliers */
  list: async (params?: { keyword?: string; page?: number; size?: number }) => {
    const response = await httpClient.get('/api/v1/admin/suppliers', { params });
    return response.data;
  },

  /** GET /api/v1/admin/suppliers/{id} - Get supplier detail */
  getById: async (id: number) => {
    const response = await httpClient.get(`/api/v1/admin/suppliers/${id}`);
    return response.data;
  },

  /** POST /api/v1/admin/suppliers - Create supplier */
  create: async (data: SupplierCreateRequest) => {
    const response = await httpClient.post('/api/v1/admin/suppliers', data);
    return response.data;
  },

  /** PUT /api/v1/admin/suppliers/{id} - Update supplier */
  update: async (id: number, data: SupplierUpdateRequest) => {
    const response = await httpClient.put(`/api/v1/admin/suppliers/${id}`, data);
    return response.data;
  },

  /** DELETE /api/v1/admin/suppliers/{id} - Delete supplier */
  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/admin/suppliers/${id}`);
  },

  // ═══════════════ SUPPLY ITEMS ═══════════════

  /** GET /api/v1/admin/suppliers/items - List all supply items */
  listItems: async (params?: { keyword?: string; category?: string; restricted?: boolean; page?: number; size?: number }) => {
    const response = await httpClient.get('/api/v1/admin/suppliers/items', { params });
    return response.data;
  },

  /** GET /api/v1/admin/suppliers/items/{id} - Get supply item detail */
  getItem: async (id: number) => {
    const response = await httpClient.get(`/api/v1/admin/suppliers/items/${id}`);
    return response.data;
  },

  /** POST /api/v1/admin/suppliers/items - Create supply item */
  createItem: async (data: SupplyItemCreateRequest) => {
    const response = await httpClient.post('/api/v1/admin/suppliers/items', data);
    return response.data;
  },

  /** PUT /api/v1/admin/suppliers/items/{id} - Update supply item */
  updateItem: async (id: number, data: SupplyItemUpdateRequest) => {
    const response = await httpClient.put(`/api/v1/admin/suppliers/items/${id}`, data);
    return response.data;
  },

  /** DELETE /api/v1/admin/suppliers/items/{id} - Delete supply item */
  deleteItem: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/admin/suppliers/items/${id}`);
  },

  // ═══════════════ SUPPLY LOTS ═══════════════

  /** GET /api/v1/admin/suppliers/lots - List all supply lots */
  listLots: async (params?: { supplierId?: number; itemId?: number; status?: string; page?: number; size?: number }) => {
    const response = await httpClient.get('/api/v1/admin/suppliers/lots', { params });
    return response.data;
  },

  /** GET /api/v1/admin/suppliers/lots/{id} - Get supply lot detail */
  getLot: async (id: number) => {
    const response = await httpClient.get(`/api/v1/admin/suppliers/lots/${id}`);
    return response.data;
  },

  /** POST /api/v1/admin/suppliers/lots - Create supply lot */
  createLot: async (data: SupplyLotCreateRequest) => {
    const response = await httpClient.post('/api/v1/admin/suppliers/lots', data);
    return response.data;
  },

  /** PUT /api/v1/admin/suppliers/lots/{id} - Update supply lot */
  updateLot: async (id: number, data: SupplyLotUpdateRequest) => {
    const response = await httpClient.put(`/api/v1/admin/suppliers/lots/${id}`, data);
    return response.data;
  },

  /** DELETE /api/v1/admin/suppliers/lots/{id} - Delete supply lot */
  deleteLot: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/admin/suppliers/lots/${id}`);
  },

  /** GET /api/v1/admin/suppliers/lots/{id}/movements - Get lot movements */
  getLotMovements: async (id: number, params?: { page?: number; size?: number }) => {
    const response = await httpClient.get(`/api/v1/admin/suppliers/lots/${id}/movements`, { params });
    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════
// ADMIN TASKS API
// ═══════════════════════════════════════════════════════════════

// Task Update Request Schema
export const AdminTaskUpdateRequestSchema = z.object({
  status: z.string().optional(),
  userId: z.number().optional(),
  notes: z.string().optional(),
});

export type AdminTaskUpdateRequest = z.infer<typeof AdminTaskUpdateRequestSchema>;

export const adminTaskApi = {
  /** GET /api/v1/admin/tasks - List all tasks with filtering */
  list: async (params?: {
    farmId?: number;
    cropId?: number;
    seasonId?: number;
    status?: string;
    page?: number;
    size?: number
  }) => {
    const response = await httpClient.get('/api/v1/admin/tasks', { params });
    return response.data;
  },

  /** GET /api/v1/admin/tasks/{id} - Get task detail */
  getById: async (id: number) => {
    const response = await httpClient.get(`/api/v1/admin/tasks/${id}`);
    return response.data;
  },

  /** PUT /api/v1/admin/tasks/{id} - Update task (admin intervention) */
  update: async (id: number, data: AdminTaskUpdateRequest) => {
    const validatedPayload = AdminTaskUpdateRequestSchema.parse(data);
    const response = await httpClient.put(`/api/v1/admin/tasks/${id}`, validatedPayload);
    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════
// ADMIN PLOTS API
// ═══════════════════════════════════════════════════════════════

export const adminPlotApi = {
  /** GET /api/v1/admin/plots - List all plots */
  list: async (params?: { farmId?: number; keyword?: string; page?: number; size?: number }) => {
    const response = await httpClient.get('/api/v1/admin/plots', { params });
    return response.data;
  },

  /** GET /api/v1/admin/plots/{id} - Get plot detail */
  getById: async (id: number) => {
    const response = await httpClient.get(`/api/v1/admin/plots/${id}`);
    return response.data;
  },

  /** GET /api/v1/admin/plots/{id}/seasons - Get plot seasons */
  getSeasons: async (id: number) => {
    const response = await httpClient.get(`/api/v1/admin/plots/${id}/seasons`);
    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════
// ADMIN USERS LEGACY API (Farmer-specific endpoints)
// ═══════════════════════════════════════════════════════════════

export const adminUsersLegacyApi = {
  /** GET /api/v1/admin/users/farmers - List all farmers */
  listFarmers: async (params?: { keyword?: string; status?: string; page?: number; size?: number }) => {
    const validatedParams = params ? AdminUserListParamsSchema.partial().parse(params) : undefined;
    const response = await httpClient.get('/api/v1/admin/users/farmers', { params: validatedParams });
    return response.data;
  },

  /** GET /api/v1/admin/users/farmers/{id} - Get farmer detail */
  getFarmer: async (id: number) => {
    const response = await httpClient.get(`/api/v1/admin/users/farmers/${id}`);
    return response.data;
  },

  /** PATCH /api/v1/admin/users/farmers/{id}/status - Update farmer status */
  updateFarmerStatus: async (id: number, status: string) => {
    const response = await httpClient.patch(`/api/v1/admin/users/farmers/${id}/status`, { status });
    return response.data;
  },

  /** PUT /api/v1/admin/users/farmers/{id}/roles - Update farmer roles */
  updateFarmerRoles: async (id: number, roles: string[]) => {
    const response = await httpClient.put(`/api/v1/admin/users/farmers/${id}/roles`, { roles });
    return response.data;
  },
};

