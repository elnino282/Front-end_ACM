import { Farmer, AuditLog } from './types';

export const INITIAL_FARMERS: Farmer[] = [
    {
        id: '1',
        name: 'John Anderson',
        email: 'john.anderson@farm.com',
        phone: '+1 234 567 8901',
        role: 'owner',
        status: 'active',
        lastLogin: '2025-11-11 09:30',
        createdAt: '2024-01-15',
        plotsCount: 12,
    },
    {
        id: '2',
        name: 'Sarah Miller',
        email: 'sarah.miller@farm.com',
        phone: '+1 234 567 8902',
        role: 'manager',
        status: 'active',
        lastLogin: '2025-11-10 14:20',
        createdAt: '2024-03-20',
        plotsCount: 8,
    },
    {
        id: '3',
        name: 'Mike Wilson',
        email: 'mike.wilson@farm.com',
        phone: '+1 234 567 8903',
        role: 'farmer',
        status: 'active',
        lastLogin: '2025-11-11 08:15',
        createdAt: '2024-05-10',
        plotsCount: 5,
    },
    {
        id: '4',
        name: 'Emma Davis',
        email: 'emma.davis@farm.com',
        phone: '+1 234 567 8904',
        role: 'farmer',
        status: 'locked',
        lastLogin: '2025-11-05 16:45',
        createdAt: '2024-06-22',
        plotsCount: 3,
    },
    {
        id: '5',
        name: 'David Chen',
        email: 'david.chen@farm.com',
        phone: '+1 234 567 8905',
        role: 'manager',
        status: 'inactive',
        lastLogin: '2025-10-15 11:00',
        createdAt: '2024-02-08',
        plotsCount: 0,
    },
];

export const AUDIT_LOGS: AuditLog[] = [
    {
        id: '1',
        action: 'Account Created',
        user: 'Admin User',
        timestamp: '2025-11-11 10:30',
        details: 'New farmer account created with role: Farmer',
        type: 'create',
    },
    {
        id: '2',
        action: 'Profile Updated',
        user: 'John Anderson',
        timestamp: '2025-11-10 15:20',
        details: 'Updated email address and phone number',
        type: 'update',
    },
    {
        id: '3',
        action: 'Account Locked',
        user: 'Admin User',
        timestamp: '2025-11-09 09:15',
        details: 'Account locked due to suspicious activity',
        type: 'lock',
    },
    {
        id: '4',
        action: 'Login Successful',
        user: 'System',
        timestamp: '2025-11-08 08:45',
        details: 'User logged in from IP: 192.168.1.100',
        type: 'login',
    },
];

export const ROLE_BADGE_COLORS = {
    owner: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    manager: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    farmer: 'bg-green-100 text-green-700 hover:bg-green-200',
} as const;

export const STATUS_BADGE_COLORS = {
    active: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    locked: 'bg-red-100 text-red-700 hover:bg-red-200',
    inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
} as const;

export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;

export const MOCK_CSV_PREVIEW = [
    {
        name: 'Alice Johnson',
        email: 'alice@farm.com',
        phone: '+1 234 567 9001',
        role: 'farmer' as const,
        status: 'active' as const
    },
    {
        name: 'Bob Smith',
        email: 'bob@farm.com',
        phone: '+1 234 567 9002',
        role: 'manager' as const,
        status: 'active' as const
    },
    {
        name: 'Invalid Entry',
        email: 'invalid-email',
        phone: '',
        role: 'farmer' as const,
        status: 'active' as const
    },
];

export const MOCK_VALIDATION_ERRORS = [
    { row: 3, field: 'email', message: 'Invalid email format' },
    { row: 3, field: 'phone', message: 'Phone number is required' },
];
