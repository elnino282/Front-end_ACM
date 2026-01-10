import { useState } from 'react';
import { toast } from 'sonner';
import {
    Plus, Edit, Trash2, FileCheck, Lock, AlertCircle,
} from 'lucide-react';
import type {
    Buyer,
    BuyerRole,
    KYCStatus,
    AccountStatus,
    BuyerFormData,
    BuyerStats,
    AuditLog,
} from '../types';
import {
    INITIAL_BUYERS,
    ROLE_BADGE_COLORS,
    KYC_BADGE_COLORS,
    STATUS_BADGE_COLORS,
    DEFAULT_ITEMS_PER_PAGE,
} from '../constants';

export function useBuyerManagement() {
    // State Management
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBuyers, setSelectedBuyers] = useState<string[]>([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
    const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
    const [importWizardOpen, setImportWizardOpen] = useState(false);
    const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
    const [detailTab, setDetailTab] = useState('general');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
    const [sortColumn, setSortColumn] = useState<keyof Buyer>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Import wizard state
    const [importStep, setImportStep] = useState(1);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    // CSV Preview types for type-safe imports
    const [csvPreview, setCsvPreview] = useState<Partial<Buyer>[]>([]);
    const [validationErrors, setValidationErrors] = useState<{ row: number; error: string }[]>([]);

    // Filter state
    const [roleFilter, setRoleFilter] = useState<BuyerRole | 'all'>('all');
    const [kycFilter, setKycFilter] = useState<KYCStatus | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<AccountStatus | 'all'>('all');

    // Form state
    const [formData, setFormData] = useState<BuyerFormData>({
        companyName: '',
        taxId: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        role: 'buyer',
        accountStatus: 'active',
        paymentTerms: '',
    });

    // Buyer data
    const [buyers, setBuyers] = useState<Buyer[]>(INITIAL_BUYERS);

    // Filter and sort buyers
    const filteredBuyers = buyers.filter((buyer) => {
        const matchesSearch =
            buyer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            buyer.taxId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            buyer.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            buyer.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === 'all' || buyer.role === roleFilter;
        const matchesKYC = kycFilter === 'all' || buyer.kycStatus === kycFilter;
        const matchesStatus = statusFilter === 'all' || buyer.accountStatus === statusFilter;

        return matchesSearch && matchesRole && matchesKYC && matchesStatus;
    }).sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        const direction = sortDirection === 'asc' ? 1 : -1;

        // Safe comparison with type guards
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        // Use localeCompare for strings, numeric comparison for others
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.localeCompare(bValue) * direction;
        }

        return (aValue > bValue ? 1 : -1) * direction;
    });

    // Pagination
    const totalPages = Math.ceil(filteredBuyers.length / itemsPerPage);
    const paginatedBuyers = filteredBuyers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Calculate stats
    const stats: BuyerStats = {
        total: buyers.length,
        active: buyers.filter((b) => b.accountStatus === 'active').length,
        pendingKYC: buyers.filter((b) => b.kycStatus === 'pending').length,
        locked: buyers.filter((b) => b.accountStatus === 'suspended' || b.accountStatus === 'closed').length,
    };

    // Handlers
    const handleSort = (column: keyof Buyer) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const handleSelectAll = () => {
        if (selectedBuyers.length === filteredBuyers.length) {
            setSelectedBuyers([]);
        } else {
            setSelectedBuyers(filteredBuyers.map((b) => b.id));
        }
    };

    const handleSelectBuyer = (id: string) => {
        setSelectedBuyers((prev) =>
            prev.includes(id) ? prev.filter((bid) => bid !== id) : [...prev, id]
        );
    };

    const handleViewEdit = (buyer: Buyer) => {
        setSelectedBuyer(buyer);
        setFormData({
            companyName: buyer.companyName,
            taxId: buyer.taxId,
            contactName: buyer.contactName,
            email: buyer.email,
            phone: buyer.phone,
            address: buyer.address || '',
            role: buyer.role,
            accountStatus: buyer.accountStatus,
            paymentTerms: buyer.paymentTerms || '',
        });
        setDetailTab('general');
        setDetailDrawerOpen(true);
    };

    const handleAddBuyer = () => {
        setSelectedBuyer(null);
        setFormData({
            companyName: '',
            taxId: '',
            contactName: '',
            email: '',
            phone: '',
            address: '',
            role: 'buyer',
            accountStatus: 'active',
            paymentTerms: '',
        });
        setDetailDrawerOpen(true);
    };

    const handleSave = () => {
        if (selectedBuyer) {
            // Update existing buyer
            setBuyers((prev) =>
                prev.map((b) => (b.id === selectedBuyer.id ? { ...b, ...formData } : b))
            );
            toast.success('Buyer updated successfully', {
                description: `${formData.companyName}'s account has been updated.`,
            });
        } else {
            // Create new buyer
            const newBuyer: Buyer = {
                id: String(buyers.length + 1),
                ...formData,
                kycStatus: 'pending',
                createdAt: new Date().toISOString().split('T')[0],
            };
            setBuyers((prev) => [...prev, newBuyer]);
            toast.success('Buyer created successfully', {
                description: `${formData.companyName}'s account has been created.`,
            });
        }
        setDetailDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        const buyer = buyers.find((b) => b.id === id);
        setBuyers((prev) => prev.filter((b) => b.id !== id));
        toast.success('Buyer deleted', {
            description: `${buyer?.companyName}'s account has been deleted.`,
        });
    };

    const handleToggleSuspend = (id: string) => {
        const buyer = buyers.find((b) => b.id === id);
        setBuyers((prev) =>
            prev.map((b) =>
                b.id === id
                    ? {
                        ...b,
                        accountStatus: b.accountStatus === 'suspended' ? 'active' : ('suspended' as AccountStatus),
                    }
                    : b
            )
        );
        toast.success(buyer?.accountStatus === 'suspended' ? 'Account activated' : 'Account suspended', {
            description: `${buyer?.companyName}'s account has been ${buyer?.accountStatus === 'suspended' ? 'activated' : 'suspended'
                }.`,
        });
    };

    const handleKYCAction = (action: 'verify' | 'reject') => {
        if (selectedBuyer) {
            setBuyers((prev) =>
                prev.map((b) =>
                    b.id === selectedBuyer.id
                        ? { ...b, kycStatus: action === 'verify' ? 'verified' : ('rejected' as KYCStatus) }
                        : b
                )
            );
            toast.success(action === 'verify' ? 'KYC Verified' : 'KYC Rejected', {
                description: `${selectedBuyer.companyName}'s KYC status has been updated.`,
            });
            setSelectedBuyer((prev) =>
                prev ? { ...prev, kycStatus: action === 'verify' ? 'verified' : 'rejected' } : null
            );
        }
    };

    const handleBulkAction = (action: string) => {
        if (selectedBuyers.length === 0) {
            toast.error('No buyers selected', {
                description: 'Please select at least one buyer to perform bulk action.',
            });
            return;
        }

        switch (action) {
            case 'activate':
                setBuyers((prev) =>
                    prev.map((b) =>
                        selectedBuyers.includes(b.id) ? { ...b, accountStatus: 'active' as AccountStatus } : b
                    )
                );
                toast.success(`${selectedBuyers.length} buyers activated`);
                break;
            case 'suspend':
                setBuyers((prev) =>
                    prev.map((b) =>
                        selectedBuyers.includes(b.id) ? { ...b, accountStatus: 'suspended' as AccountStatus } : b
                    )
                );
                toast.success(`${selectedBuyers.length} buyers suspended`);
                break;
            case 'delete':
                setBuyers((prev) => prev.filter((b) => !selectedBuyers.includes(b.id)));
                toast.success(`${selectedBuyers.length} buyers deleted`);
                break;
        }
        setSelectedBuyers([]);
    };

    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCsvFile(file);
            // Mock CSV preview data
            setCsvPreview([
                {
                    companyName: 'ABC Corp',
                    taxId: 'VAT-111222333',
                    contactName: 'John Doe',
                    email: 'john@abc.com',
                    phone: '+1 555 1234',
                    role: 'buyer',
                },
                {
                    companyName: 'XYZ Inc',
                    taxId: 'VAT-444555666',
                    contactName: 'Jane Smith',
                    email: 'jane@xyz.com',
                    phone: '+1 555 5678',
                    role: 'enterprise',
                },
            ]);
            setValidationErrors([]);
            setImportStep(2);
        }
    };

    const handleImportConfirm = () => {
        const validEntries = csvPreview.filter(
            (_, index) => !validationErrors.some((err) => err.row === index + 1)
        );

        validEntries.forEach((entry, index) => {
            const newBuyer: Buyer = {
                id: String(buyers.length + index + 1),
                companyName: entry.companyName ?? '',
                taxId: entry.taxId ?? '',
                contactName: entry.contactName ?? '',
                email: entry.email ?? '',
                phone: entry.phone ?? '',
                role: entry.role ?? 'buyer',
                kycStatus: 'pending',
                accountStatus: 'active',
                createdAt: new Date().toISOString().split('T')[0],
            };
            setBuyers((prev) => [...prev, newBuyer]);
        });

        toast.success('Import completed', {
            description: `${validEntries.length} buyers imported successfully.`,
        });
        setImportWizardOpen(false);
        setImportStep(1);
        setCsvFile(null);
    };

    const handleResetPassword = () => {
        setResetPasswordOpen(true);
    };

    // Helper functions for badge colors
    const getRoleBadge = (role: BuyerRole) => ROLE_BADGE_COLORS[role];
    const getKYCBadge = (status: KYCStatus) => KYC_BADGE_COLORS[status];
    const getStatusBadge = (status: AccountStatus) => STATUS_BADGE_COLORS[status];

    const getAuditIcon = (type: AuditLog['type']) => {
        switch (type) {
            case 'create':
                return <Plus className="w-4 h-4 text-green-600" />;
            case 'update':
                return <Edit className="w-4 h-4 text-blue-600" />;
            case 'delete':
                return <Trash2 className="w-4 h-4 text-red-600" />;
            case 'kyc':
                return <FileCheck className="w-4 h-4 text-purple-600" />;
            case 'lock':
                return <Lock className="w-4 h-4 text-orange-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-600" />;
        }
    };

    // Return all necessary values and functions
    return {
        // State
        searchQuery,
        setSearchQuery,
        selectedBuyers,
        filterOpen,
        setFilterOpen,
        detailDrawerOpen,
        setDetailDrawerOpen,
        resetPasswordOpen,
        setResetPasswordOpen,
        importWizardOpen,
        setImportWizardOpen,
        selectedBuyer,
        detailTab,
        setDetailTab,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        sortColumn,
        sortDirection,
        importStep,
        setImportStep,
        csvFile,
        csvPreview,
        validationErrors,
        roleFilter,
        setRoleFilter,
        kycFilter,
        setKycFilter,
        statusFilter,
        setStatusFilter,
        formData,
        setFormData,

        // Data
        buyers,
        filteredBuyers,
        paginatedBuyers,
        totalPages,
        stats,

        // Handlers
        handleSort,
        handleSelectAll,
        handleSelectBuyer,
        handleViewEdit,
        handleAddBuyer,
        handleSave,
        handleDelete,
        handleToggleSuspend,
        handleKYCAction,
        handleBulkAction,
        handleCSVUpload,
        handleImportConfirm,
        handleResetPassword,

        // Helper functions
        getRoleBadge,
        getKYCBadge,
        getStatusBadge,
        getAuditIcon,
    };
}

