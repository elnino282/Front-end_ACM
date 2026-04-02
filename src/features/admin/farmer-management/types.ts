export type FarmerRole = 'owner' | 'manager' | 'farmer';
export type FarmerStatus = 'active' | 'locked' | 'inactive';
export type AuditLogType = 'create' | 'update' | 'delete' | 'login' | 'lock';

export interface Farmer {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: FarmerRole;
    status: FarmerStatus;
    lastLogin: string;
    createdAt: string;
    avatar?: string;
    plotsCount?: number;
}

export interface AuditLog {
    id: string;
    action: string;
    user: string;
    timestamp: string;
    details: string;
    type: AuditLogType;
}

export interface FarmerFormData {
    name: string;
    email: string;
    phone: string;
    role: FarmerRole;
    status: FarmerStatus;
    tempPassword: string;
    sendEmail: boolean;
}

export interface ValidationError {
    row: number;
    field: string;
    message: string;
}

export interface CSVPreviewRow {
    name: string;
    email: string;
    phone: string;
    role: FarmerRole;
    status: FarmerStatus;
}
