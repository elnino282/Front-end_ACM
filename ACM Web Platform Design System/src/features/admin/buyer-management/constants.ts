import { Buyer, KYCDocument, AuditLog } from './types';

// Mock Buyer Data
export const INITIAL_BUYERS: Buyer[] = [
    {
        id: '1',
        companyName: 'Fresh Harvest Co.',
        taxId: 'VAT-123456789',
        contactName: 'Alice Johnson',
        email: 'alice@freshharvest.com',
        phone: '+1 234 567 8901',
        role: 'enterprise',
        kycStatus: 'verified',
        accountStatus: 'active',
        createdAt: '2024-01-15',
        paymentTerms: 'Net 30',
        address: '123 Market St, San Francisco, CA',
    },
    {
        id: '2',
        companyName: 'Green Valley Distributors',
        taxId: 'VAT-987654321',
        contactName: 'Bob Smith',
        email: 'bob@greenvalley.com',
        phone: '+1 234 567 8902',
        role: 'distributor',
        kycStatus: 'verified',
        accountStatus: 'active',
        createdAt: '2024-02-20',
        paymentTerms: 'Net 45',
        address: '456 Valley Rd, Portland, OR',
    },
    {
        id: '3',
        companyName: 'Organic Foods Inc.',
        taxId: 'VAT-456789123',
        contactName: 'Carol Davis',
        email: 'carol@organicfoods.com',
        phone: '+1 234 567 8903',
        role: 'buyer',
        kycStatus: 'pending',
        accountStatus: 'active',
        createdAt: '2024-11-05',
        paymentTerms: 'Net 15',
        address: '789 Organic Ave, Seattle, WA',
    },
    {
        id: '4',
        companyName: 'Farm to Table LLC',
        taxId: 'VAT-321654987',
        contactName: 'David Wilson',
        email: 'david@farmtotable.com',
        phone: '+1 234 567 8904',
        role: 'buyer',
        kycStatus: 'rejected',
        accountStatus: 'suspended',
        createdAt: '2024-10-12',
        paymentTerms: 'Cash on delivery',
        address: '321 Farm Ln, Austin, TX',
    },
    {
        id: '5',
        companyName: 'Wholesale Produce Group',
        taxId: 'VAT-789123456',
        contactName: 'Emma Brown',
        email: 'emma@wholesaleproduce.com',
        phone: '+1 234 567 8905',
        role: 'distributor',
        kycStatus: 'verified',
        accountStatus: 'closed',
        createdAt: '2024-03-08',
        paymentTerms: 'Net 60',
        address: '555 Wholesale Blvd, Chicago, IL',
    },
];

// Mock KYC Documents
export const KYC_DOCUMENTS: KYCDocument[] = [
    {
        id: '1',
        type: 'Business Registration',
        filename: 'business_registration.pdf',
        uploadedAt: '2024-11-01',
        status: 'approved',
    },
    {
        id: '2',
        type: 'Tax Certificate',
        filename: 'tax_certificate.pdf',
        uploadedAt: '2024-11-01',
        status: 'approved',
    },
    {
        id: '3',
        type: 'Bank Statement',
        filename: 'bank_statement.pdf',
        uploadedAt: '2024-11-02',
        status: 'pending',
    },
];

// Mock Audit Logs
export const AUDIT_LOGS: AuditLog[] = [
    {
        id: '1',
        action: 'Account Created',
        user: 'Admin User',
        timestamp: '2025-11-11 10:30',
        details: 'New buyer account created with role: Enterprise',
        type: 'create',
    },
    {
        id: '2',
        action: 'KYC Documents Uploaded',
        user: 'Alice Johnson',
        timestamp: '2025-11-10 15:20',
        details: 'Uploaded 2 KYC documents for verification',
        type: 'kyc',
    },
    {
        id: '3',
        action: 'KYC Verified',
        user: 'Admin User',
        timestamp: '2025-11-09 09:15',
        details: 'KYC verification completed successfully',
        type: 'kyc',
    },
    {
        id: '4',
        action: 'Profile Updated',
        user: 'Alice Johnson',
        timestamp: '2025-11-08 08:45',
        details: 'Updated payment terms and contact information',
        type: 'update',
    },
];

// Badge Color Configurations
export const ROLE_BADGE_COLORS = {
    buyer: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    enterprise: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    distributor: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
};

export const KYC_BADGE_COLORS = {
    pending: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    verified: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    rejected: 'bg-red-100 text-red-700 hover:bg-red-200',
};

export const STATUS_BADGE_COLORS = {
    active: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    suspended: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    closed: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
};

// Pagination Defaults
export const DEFAULT_ITEMS_PER_PAGE = 10;
export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

// CSV Import Configuration
export const CSV_FORMAT_INFO = {
    columns: ['companyName', 'taxId', 'contactName', 'email', 'phone', 'role'],
    validRoles: ['buyer', 'enterprise', 'distributor'],
};
