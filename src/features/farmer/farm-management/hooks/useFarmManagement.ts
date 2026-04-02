import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useFarmsList } from './useFarmsList';
import { useDeleteFarm } from './useDeleteFarm';
import { useUpdateFarm as useUpdateFarmEntity } from '@/entities/farm';
import type { Farm } from '@/entities/farm';

type SortColumn = "name" | "area" | "status" | null;
type SortDirection = "asc" | "desc";

/**
 * Return type for the useFarmManagement hook
 */
export interface UseFarmManagementReturn {
    // Search and filter state
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    activeFilter: boolean | null;
    setActiveFilter: (value: boolean | null) => void;

    // Data
    farms: Farm[];
    filteredFarms: Farm[];

    // Pagination
    pagination: {
        page: number;
        size: number;
        totalElements: number;
        totalPages: number;
    };

    // Loading & Error states
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;

    // Sort state
    sortColumn: SortColumn;
    sortDirection: SortDirection;
    handleSort: (column: SortColumn) => void;

    // Selection state
    selectedFarms: number[];
    setSelectedFarms: (farms: number[]) => void;
    handleToggleSelection: (id: number) => void;
    handleToggleAllSelection: () => void;
    handleClearSelection: () => void;
    isAllSelected: boolean;
    isSomeSelected: boolean;
    selectedCount: number;

    // Dialog states
    showCreateDialog: boolean;
    setShowCreateDialog: (open: boolean) => void;
    editingFarmId: number | null;
    setEditingFarmId: (id: number | null) => void;

    // Delete state (from useDeleteFarm)
    isConfirmOpen: boolean;
    farmToDelete: { id: number; name: string } | null;
    handleDeleteRequest: (farmId: number, farmName: string) => void;
    handleDeleteConfirm: () => void;
    handleDeleteCancel: () => void;
    isDeleting: boolean;

    // Handlers
    handleClearFilters: () => void;
    handleViewFarm: (farmId: number) => void;
    handleEditFarm: (farmId: number) => void;
    handleBulkDelete: () => void;
    handleBulkStatusChange: (status: boolean) => void;

    // Computed
    hasActiveFilters: boolean;
}

/**
 * Custom hook for Farm Management state management and business logic
 * 
 * Orchestrates:
 * - useFarmsList: Search, filters, and pagination
 * - useDeleteFarm: Delete confirmation and mutation
 * - useUpdateFarm: Status updates
 */
export function useFarmManagement(): UseFarmManagementReturn {
    const navigate = useNavigate();

    // ═══════════════════════════════════════════════════════════════
    // COMPOSED HOOKS
    // ═══════════════════════════════════════════════════════════════

    const {
        farms,
        pagination,
        filters,
        setKeyword,
        setActiveFilter,
        setPage,
        isLoading,
        isError,
        error,
        refetch,
    } = useFarmsList();

    const {
        isConfirmOpen,
        farmToDelete,
        handleDeleteRequest,
        handleDeleteConfirm,
        handleDeleteCancel,
        isDeleting,
    } = useDeleteFarm();

    const updateMutation = useUpdateFarmEntity({
        onSuccess: () => {
            toast.success("Farm status updated successfully");
        },
        onError: (err: any) => {
            toast.error("Failed to update farm status", {
                description: err?.message || "Please try again",
            });
        },
    });

    // ═══════════════════════════════════════════════════════════════
    // LOCAL STATE
    // ═══════════════════════════════════════════════════════════════

    const [sortColumn, setSortColumn] = useState<SortColumn>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [selectedFarms, setSelectedFarms] = useState<number[]>([]);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingFarmId, setEditingFarmId] = useState<number | null>(null);

    // ═══════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════

    const hasActiveFilters = filters.keyword || filters.activeFilter !== null;

    // Filtered farms (already filtered by useFarmsList)
    const filteredFarms = useMemo(() => farms, [farms]);

    // Selection state
    const isAllSelected = filteredFarms.length > 0 && selectedFarms.length === filteredFarms.length;
    const isSomeSelected = selectedFarms.length > 0 && selectedFarms.length < filteredFarms.length;
    const selectedCount = selectedFarms.length;

    // ═══════════════════════════════════════════════════════════════
    // HANDLERS - FILTERS
    // ═══════════════════════════════════════════════════════════════

    const handleClearFilters = useCallback(() => {
        setKeyword('');
        setActiveFilter(null);
        toast.info("Filters cleared");
    }, [setKeyword, setActiveFilter]);

    // ═══════════════════════════════════════════════════════════════
    // HANDLERS - NAVIGATION
    // ═══════════════════════════════════════════════════════════════

    const handleViewFarm = useCallback((farmId: number) => {
        navigate(`/farmer/farms/${farmId}`);
    }, [navigate]);

    const handleEditFarm = useCallback((farmId: number) => {
        setEditingFarmId(farmId);
    }, []);

    // ═══════════════════════════════════════════════════════════════
    // HANDLERS - SORTING
    // ═══════════════════════════════════════════════════════════════

    const handleSort = useCallback((column: SortColumn) => {
        if (sortColumn === column) {
            // Toggle direction if same column
            setSortDirection(prev => prev === "asc" ? "desc" : "asc");
        } else {
            // New column, default to ascending
            setSortColumn(column);
            setSortDirection("asc");
        }
    }, [sortColumn]);

    // ═══════════════════════════════════════════════════════════════
    // HANDLERS - SELECTION
    // ═══════════════════════════════════════════════════════════════

    const handleToggleSelection = useCallback((id: number) => {
        setSelectedFarms(prev =>
            prev.includes(id)
                ? prev.filter(farmId => farmId !== id)
                : [...prev, id]
        );
    }, []);

    const handleToggleAllSelection = useCallback(() => {
        if (selectedFarms.length === filteredFarms.length) {
            // Deselect all
            setSelectedFarms([]);
        } else {
            // Select all filtered farms
            setSelectedFarms(filteredFarms.map(f => f.id));
        }
    }, [selectedFarms, filteredFarms]);

    const handleClearSelection = useCallback(() => {
        setSelectedFarms([]);
    }, []);

    // ═══════════════════════════════════════════════════════════════
    // HANDLERS - BULK OPERATIONS
    // ═══════════════════════════════════════════════════════════════

    const handleBulkDelete = useCallback(() => {
        if (selectedFarms.length === 0) {
            toast.error("No farms selected");
            return;
        }

        // Delete first selected farm (show confirmation)
        const firstFarm = farms.find(f => selectedFarms.includes(f.id));
        if (firstFarm) {
            if (selectedFarms.length === 1) {
                handleDeleteRequest(firstFarm.id, firstFarm.name);
            } else {
                // For multiple, show count
                handleDeleteRequest(firstFarm.id, `${selectedFarms.length} farms`);
            }
        }
    }, [selectedFarms, farms, handleDeleteRequest]);

    const handleBulkStatusChange = useCallback((status: boolean) => {
        if (selectedFarms.length === 0) {
            toast.error("No farms selected");
            return;
        }

        // Update each selected farm
        const updatePromises = selectedFarms.map(farmId => {
            const farm = farms.find(f => f.id === farmId);
            if (farm) {
                return updateMutation.mutateAsync({
                    id: farmId,
                    data: { active: status }
                });
            }
            return Promise.resolve();
        });

        Promise.all(updatePromises)
            .then(() => {
                toast.success(`${selectedFarms.length} farm(s) updated to ${status ? 'Active' : 'Inactive'}`);
                setSelectedFarms([]);
            })
            .catch((err) => {
                toast.error("Some farms failed to update", {
                    description: err?.message || "Please try again",
                });
            });
    }, [selectedFarms, farms, updateMutation]);

    // ═══════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════

    return {
        // Search and filter state
        searchQuery: filters.keyword,
        setSearchQuery: setKeyword,
        activeFilter: filters.activeFilter,
        setActiveFilter,

        // Data
        farms,
        filteredFarms,

        // Pagination
        pagination,

        // Loading & Error states
        isLoading,
        isError,
        error: error || null,
        refetch,

        // Sort state
        sortColumn,
        sortDirection,
        handleSort,

        // Selection state
        selectedFarms,
        setSelectedFarms,
        handleToggleSelection,
        handleToggleAllSelection,
        handleClearSelection,
        isAllSelected,
        isSomeSelected,
        selectedCount,

        // Dialog states
        showCreateDialog,
        setShowCreateDialog,
        editingFarmId,
        setEditingFarmId,

        // Delete state
        isConfirmOpen,
        farmToDelete,
        handleDeleteRequest,
        handleDeleteConfirm,
        handleDeleteCancel,
        isDeleting,

        // Handlers
        handleClearFilters,
        handleViewFarm,
        handleEditFarm,
        handleBulkDelete,
        handleBulkStatusChange,

        // Computed
        hasActiveFilters,
    };
}



