// Type definitions for Buyer Management feature

export type BuyerRole = 'buyer' | 'enterprise' | 'distributor';
export type KYCStatus = 'pending' | 'verified' | 'rejected';
export type AccountStatus = 'active' | 'suspended' | 'closed';

export interface Buyer {
    id: string;
    companyName: string;
    taxId: string;
    contactName: string;
    email: string;
    phone: string;
    role: BuyerRole;
    kycStatus: KYCStatus;
    accountStatus: AccountStatus;
    createdAt: string;
    avatar?: string;
    address?: string;
    paymentTerms?: string;
}

export interface KYCDocument {
    id: string;
    type: string;
    filename: string;
    uploadedAt: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface AuditLog {
    id: string;
    action: string;
    user: string;
    timestamp: string;
    details: string;
    type: 'create' | 'update' | 'delete' | 'kyc' | 'lock';
}

export interface BuyerFormData {
    companyName: string;
    taxId: string;
    contactName: string;
    email: string;
    phone: string;
    address: string;
    role: BuyerRole;
    accountStatus: AccountStatus;
    paymentTerms: string;
}

export interface BuyerStats {
    total: number;
    active: number;
    pendingKYC: number;
    locked: number;
}
