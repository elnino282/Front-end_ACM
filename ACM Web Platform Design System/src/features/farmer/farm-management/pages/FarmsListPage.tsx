/**
 * Farms List Page
 * 
 * Main orchestration component for farm management
 */

import { useFarmManagement } from '../hooks/useFarmManagement';
import { FarmToolbar } from '../ui/FarmToolbar';
import { FarmFilters } from '../ui/FarmFilters';
import { FarmsListView } from '../ui/FarmsListView';
import { EmptyState } from '../ui/EmptyState';
import { LoadingState } from '../ui/LoadingState';
import { FarmFormDialog } from '../ui/FarmFormDialog';
import { FarmDeleteDialog } from '../ui/FarmDeleteDialog';
import { Button } from '@/shared/ui';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { FarmDetailResponse } from '@/entities/farm';

/**
 * FarmsListPage Component
 * 
 * Complete farm management interface with:
 * - Search and filtering
 * - Sortable table view
 * - Bulk selection and actions
 * - Create, edit, and delete operations
 * - Loading and error states
 */
export function FarmsListPage() {
    const navigate = useNavigate();
    const {
        // Data
        farms,
        filteredFarms,
        
        // Search and filter state
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        
        // Loading & Error states
        isLoading,
        isError,
        error,
        refetch,
        
        // Selection state
        selectedFarms,
        handleToggleSelection,
        handleToggleAllSelection,
        handleClearSelection,
        
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
    } = useFarmManagement();

    const handleCreatedFarm = (farm: FarmDetailResponse) => {
        navigate(`/farmer/farms/${farm.id}`, { state: { openCreatePlot: true } });
    };
    
    // Error state
    if (isError) {
        return (
            <div className="min-h-screen bg-background pb-20">
                <div className="container mx-auto py-6 px-4 max-w-7xl">
                    <div className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Failed to Load Farms
                        </h2>
                        <p className="text-gray-500 mb-6">
                            {error?.message || 'An error occurred while loading your farms.'}
                        </p>
                        <Button onClick={refetch}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background pb-20">
                <div className="container mx-auto py-6 px-4 max-w-7xl">
                    <LoadingState />
                </div>
            </div>
        );
    }
    
    // Empty state (no farms at all)
    if (farms.length === 0 && !hasActiveFilters) {
        return (
            <div className="min-h-screen bg-background pb-20">
                <div className="container mx-auto py-6 px-4 max-w-7xl">
                    <FarmToolbar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        onCreateFarm={() => setShowCreateDialog(true)}
                        filteredCount={0}
                        totalCount={0}
                        selectedCount={0}
                        onClearFilters={handleClearFilters}
                    />
                    <EmptyState onCreateFarm={() => setShowCreateDialog(true)} />
                    
                    {/* Create Dialog */}
                    <FarmFormDialog
                        open={showCreateDialog}
                        onOpenChange={setShowCreateDialog}
                        mode="create"
                        onCreated={handleCreatedFarm}
                    />
                </div>
            </div>
        );
    }
    
    // Get the farm being edited
    const editingFarm = editingFarmId
        ? farms.find(f => f.id === editingFarmId)
        : undefined;
    
    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="container mx-auto py-6 px-4 max-w-7xl">
            {/* Page Header with Create Button */}
            <FarmToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                onCreateFarm={() => setShowCreateDialog(true)}
                filteredCount={filteredFarms.length}
                totalCount={farms.length}
                selectedCount={selectedFarms.length}
                onClearFilters={handleClearFilters}
            />
            
            {/* Spacer */}
            <div className="mb-6"></div>
            
            {/* Farms Table or Empty Filtered State */}
            {filteredFarms.length === 0 && hasActiveFilters ? (
                <div className="bg-card rounded-xl border border-gray-200 shadow-sm p-12">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No farms found
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Try adjusting your search or filters.
                        </p>
                        <Button
                            variant="outline"
                            onClick={handleClearFilters}
                        >
                            Clear filters
                        </Button>
                    </div>
                </div>
            ) : (
                <FarmsListView
                    farms={filteredFarms}
                    selectedFarms={selectedFarms}
                    onToggleSelection={handleToggleSelection}
                    onToggleAllSelection={handleToggleAllSelection}
                    onView={handleViewFarm}
                    onEdit={handleEditFarm}
                    onDelete={handleDeleteRequest}
                    onBulkDelete={handleBulkDelete}
                    onBulkStatusChange={handleBulkStatusChange}
                    onClearSelection={handleClearSelection}
                />
            )}
            
            {/* Create Dialog */}
            <FarmFormDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                mode="create"
                onCreated={handleCreatedFarm}
            />
            
            {/* Edit Dialog */}
            {editingFarmId && editingFarm && (
                <FarmFormDialog
                    open={true}
                    onOpenChange={(open) => !open && setEditingFarmId(null)}
                    mode="edit"
                    farm={editingFarm}
                    farmId={editingFarmId}
                />
            )}
            
            {/* Delete Confirmation Dialog */}
            {farmToDelete && (
                <FarmDeleteDialog
                    open={isConfirmOpen}
                    onOpenChange={(open) => !open && handleDeleteCancel()}
                    farmId={farmToDelete.id}
                    farmName={farmToDelete.name}
                    onDeleteSuccess={handleDeleteConfirm}
                />
            )}
            </div>
        </div>
    );
}



