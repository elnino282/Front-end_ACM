import { useState } from 'react';
import { toast } from 'sonner';
import {
    Farmer,
    FarmerFormData,
    FarmerRole,
    FarmerStatus,
    CSVPreviewRow,
    ValidationError,
} from '../types';
import { INITIAL_FARMERS, MOCK_CSV_PREVIEW, MOCK_VALIDATION_ERRORS } from '../constants';

export function useFarmerManagement() {
    // State Management
    const [farmers, setFarmers] = useState<Farmer[]>(INITIAL_FARMERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFarmers, setSelectedFarmers] = useState<string[]>([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [createEditOpen, setCreateEditOpen] = useState(false);
    const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [importWizardOpen, setImportWizardOpen] = useState(false);
    const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortColumn, setSortColumn] = useState<keyof Farmer>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Import wizard state
    const [importStep, setImportStep] = useState(1);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [csvPreview, setCsvPreview] = useState<CSVPreviewRow[]>([]);
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

    // Filter state
    const [roleFilter, setRoleFilter] = useState<FarmerRole | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<FarmerStatus | 'all'>('all');

    // Form state
    const [formData, setFormData] = useState<FarmerFormData>({
        name: '',
        email: '',
        phone: '',
        role: 'farmer',
        status: 'active',
        tempPassword: '',
        sendEmail: true,
    });

    // Handlers
    const handleSort = (column: keyof Farmer) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const handleSelectAll = (filteredFarmers: Farmer[]) => {
        if (selectedFarmers.length === filteredFarmers.length) {
            setSelectedFarmers([]);
        } else {
            setSelectedFarmers(filteredFarmers.map(f => f.id));
        }
    };

    const handleSelectFarmer = (id: string) => {
        setSelectedFarmers(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    };

    const handleEdit = (farmer: Farmer) => {
        setEditingFarmer(farmer);
        setFormData({
            name: farmer.name,
            email: farmer.email,
            phone: farmer.phone,
            role: farmer.role,
            status: farmer.status,
            tempPassword: '',
            sendEmail: true,
        });
        setCreateEditOpen(true);
    };

    const handleCreate = () => {
        setEditingFarmer(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            role: 'farmer',
            status: 'active',
            tempPassword: '',
            sendEmail: true,
        });
        setCreateEditOpen(true);
    };

    const handleSave = () => {
        if (editingFarmer) {
            // Update existing farmer
            setFarmers(prev => prev.map(f =>
                f.id === editingFarmer.id
                    ? { ...f, ...formData }
                    : f
            ));
            toast.success('Farmer updated successfully', {
                description: `${formData.name}'s account has been updated.`,
            });
        } else {
            // Create new farmer
            const newFarmer: Farmer = {
                id: String(farmers.length + 1),
                ...formData,
                lastLogin: 'Never',
                createdAt: new Date().toISOString().split('T')[0],
                plotsCount: 0,
            };
            setFarmers(prev => [...prev, newFarmer]);
            toast.success('Farmer created successfully', {
                description: `${formData.name}'s account has been created.`,
            });
        }
        setCreateEditOpen(false);
    };

    const handleDelete = (id: string) => {
        const farmer = farmers.find(f => f.id === id);
        setFarmers(prev => prev.filter(f => f.id !== id));
        toast.success('Farmer deleted', {
            description: `${farmer?.name}'s account has been deleted.`,
        });
    };

    const handleLock = (id: string) => {
        const farmer = farmers.find(f => f.id === id);
        setFarmers(prev => prev.map(f =>
            f.id === id ? { ...f, status: f.status === 'locked' ? 'active' : 'locked' as FarmerStatus } : f
        ));
        toast.success(farmer?.status === 'locked' ? 'Account unlocked' : 'Account locked', {
            description: `${farmer?.name}'s account has been ${farmer?.status === 'locked' ? 'unlocked' : 'locked'}.`,
        });
    };

    const handleBulkAction = (action: string) => {
        if (selectedFarmers.length === 0) {
            toast.error('No farmers selected', {
                description: 'Please select at least one farmer to perform bulk action.',
            });
            return;
        }

        switch (action) {
            case 'activate':
                setFarmers(prev => prev.map(f =>
                    selectedFarmers.includes(f.id) ? { ...f, status: 'active' as FarmerStatus } : f
                ));
                toast.success(`${selectedFarmers.length} farmers activated`);
                break;
            case 'lock':
                setFarmers(prev => prev.map(f =>
                    selectedFarmers.includes(f.id) ? { ...f, status: 'locked' as FarmerStatus } : f
                ));
                toast.success(`${selectedFarmers.length} farmers locked`);
                break;
            case 'delete':
                setFarmers(prev => prev.filter(f => !selectedFarmers.includes(f.id)));
                toast.success(`${selectedFarmers.length} farmers deleted`);
                break;
        }
        setSelectedFarmers([]);
    };

    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCsvFile(file);
            // Mock preview data
            setCsvPreview(MOCK_CSV_PREVIEW);
            setValidationErrors(MOCK_VALIDATION_ERRORS);
            setImportStep(2);
        }
    };

    const handleImportConfirm = () => {
        const validEntries = csvPreview.filter((_, index) =>
            !validationErrors.some(err => err.row === index + 1)
        );

        validEntries.forEach((entry, index) => {
            const newFarmer: Farmer = {
                id: String(farmers.length + index + 1),
                name: entry.name,
                email: entry.email,
                phone: entry.phone,
                role: entry.role,
                status: entry.status,
                lastLogin: 'Never',
                createdAt: new Date().toISOString().split('T')[0],
                plotsCount: 0,
            };
            setFarmers(prev => [...prev, newFarmer]);
        });

        toast.success('Import completed', {
            description: `${validEntries.length} farmers imported successfully.`,
        });
        setImportWizardOpen(false);
        setImportStep(1);
        setCsvFile(null);
    };

    const handleResetPassword = (method: 'email' | 'temp') => {
        if (method === 'email') {
            toast.success('Reset link sent', {
                description: 'Password reset link has been sent to farmer\'s email.',
            });
        } else {
            const tempPassword = 'Temp' + Math.random().toString(36).slice(-8);
            navigator.clipboard.writeText(tempPassword);
            toast.success('Temporary password generated', {
                description: `Password "${tempPassword}" copied to clipboard.`,
            });
        }
        setResetPasswordOpen(false);
    };

    const clearFilters = () => {
        setRoleFilter('all');
        setStatusFilter('all');
    };

    // Filter and sort farmers
    const filteredFarmers = farmers.filter(farmer => {
        const matchesSearch =
            farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            farmer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            farmer.phone.includes(searchQuery);

        const matchesRole = roleFilter === 'all' || farmer.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || farmer.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    }).sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        const direction = sortDirection === 'asc' ? 1 : -1;
        if (aValue == null || bValue == null) return 0;
        return aValue > bValue ? direction : -direction;
    });

    const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage);
    const paginatedFarmers = filteredFarmers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Return all state and handlers needed by components
    return {
        // State
        farmers: paginatedFarmers,
        filteredFarmers,
        totalFarmers: farmers.length,
        searchQuery,
        selectedFarmers,
        filterOpen,
        createEditOpen,
        resetPasswordOpen,
        historyOpen,
        importWizardOpen,
        editingFarmer,
        currentPage,
        itemsPerPage,
        sortColumn,
        sortDirection,
        roleFilter,
        statusFilter,
        formData,
        importStep,
        csvFile,
        csvPreview,
        validationErrors,
        totalPages,

        // Setters
        setSearchQuery,
        setFilterOpen,
        setCreateEditOpen,
        setResetPasswordOpen,
        setHistoryOpen,
        setImportWizardOpen,
        setCurrentPage,
        setItemsPerPage,
        setRoleFilter,
        setStatusFilter,
        setFormData,
        setImportStep,

        // Handlers
        handleSort,
        handleSelectAll: () => handleSelectAll(filteredFarmers),
        handleSelectFarmer,
        handleEdit,
        handleCreate,
        handleSave,
        handleDelete,
        handleLock,
        handleBulkAction,
        handleCSVUpload,
        handleImportConfirm,
        handleResetPassword,
        clearFilters,
    };
}
