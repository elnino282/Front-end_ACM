import { Plus, Package, AlertTriangle, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton, QueryError } from '@/shared/ui';
import { useCropManagement } from './hooks/useCropManagement';
import { useCropFilterOptions } from './hooks/useCropFilterOptions';
import { CropFilters } from './components/CropFilters';
import { CropListView } from './components/CropListView';
import { TimelineView } from './components/TimelineView';
import { TasksView } from './components/TasksView';
import { SeedLogView } from './components/SeedLogView';
import { PHIWarningView } from './components/PHIWarningView';
import { CropSidebar } from './components/CropSidebar';
import { CropFormModal } from './components/CropFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SeedUsageModal } from './components/SeedUsageModal';
import type { Crop } from './types';

export function CropManagement() {
    const {
        viewMode,
        setViewMode,
        selectedCrop,
        setSelectedCrop,
        crops,
        allCrops,
        isLoading,
        error,
        refetch,
        createModalOpen,
        setCreateModalOpen,
        deleteConfirmOpen,
        setDeleteConfirmOpen,
        seedUsageModalOpen,
        setSeedUsageModalOpen,
        editingCrop,
        filters,
        setFilters,
        handleCreateCrop,
        handleUpdateCrop,
        handleDeleteCrop,
        handleEditCrop,
        handleCancelForm,
        getStageIcon,
        getStageColor,
        getPriorityBadge,
        isCreating,
        isUpdating,
        isDeleting,
        isLoadingSeasonVerification,
        canDeleteCrop,
        seasonsUsingCrop,
    } = useCropManagement();

    // Get dynamic filter options from actual crop data
    const filterOptions = useCropFilterOptions(allCrops);

    const handleCropAction = (crop: Crop, action: 'timeline' | 'tasks' | 'edit' | 'delete') => {
        setSelectedCrop(crop);
        if (action === 'timeline') setViewMode('timeline');
        else if (action === 'tasks') setViewMode('tasks');
        else if (action === 'edit') handleEditCrop(crop);
        else if (action === 'delete') setDeleteConfirmOpen(true);
    };

    const hasActiveFilters =
        filters.searchQuery !== '' ||
        filters.plotFilter !== 'all' ||
        filters.seasonFilter !== 'all' ||
        filters.cropTypeFilter !== 'all' ||
        filters.varietyFilter !== 'all';

    // Loading skeleton
    const LoadingSkeleton = () => (
        <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="p-6 max-w-[1800px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Header & Toolbar */}
                    {viewMode === 'list' && (
                        <div className="space-y-4">
                            <Card className="border border-border rounded-xl shadow-sm">
                                <CardContent className="px-6 py-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex-shrink-0">
                                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 leading-tight">
                                                <Leaf className="w-6 h-6 text-emerald-600" />
                                                Crop Management
                                            </h1>
                                            <p className="text-sm text-slate-600 mt-1">
                                                Track crop growth stages, tasks, and harvest schedules
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                                            <Button variant="outline" onClick={() => setViewMode('seedlog')}>
                                                <Package className="w-4 h-4 mr-2" />
                                                Seed Log
                                            </Button>
                                            <Button variant="outline" onClick={() => setViewMode('phiwarning')}>
                                                <AlertTriangle className="w-4 h-4 mr-2" />
                                                PHI Warnings
                                            </Button>
                                            <Button
                                                className="bg-primary hover:bg-primary/90"
                                                onClick={() => setCreateModalOpen(true)}
                                                disabled={isCreating}
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                {isCreating ? 'Adding...' : 'Add Crop'}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <CropFilters
                                searchQuery={filters.searchQuery}
                                plotFilter={filters.plotFilter}
                                seasonFilter={filters.seasonFilter}
                                cropTypeFilter={filters.cropTypeFilter}
                                varietyFilter={filters.varietyFilter}
                                filterOptions={filterOptions}
                                isLoading={isLoading}
                                onSearchChange={setFilters.setSearchQuery}
                                onPlotChange={setFilters.setPlotFilter}
                                onSeasonChange={setFilters.setSeasonFilter}
                                onCropTypeChange={setFilters.setCropTypeFilter}
                                onVarietyChange={setFilters.setVarietyFilter}
                            />
                        </div>
                    )}

                    {/* Content Views with Loading & Error Handling */}
                    {viewMode === 'list' && (
                        error ? (
                            <QueryError error={error} onRetry={refetch} className="my-6" />
                        ) : isLoading ? (
                            <LoadingSkeleton />
                        ) : (
                            <CropListView
                                crops={crops}
                                allCrops={allCrops}
                                onCropAction={handleCropAction}
                                onCreateCrop={() => setCreateModalOpen(true)}
                                getStageIcon={getStageIcon}
                                getStageColor={getStageColor}
                                hasActiveFilters={hasActiveFilters}
                            />
                        )
                    )}
                    {viewMode === 'timeline' && selectedCrop && (
                        <TimelineView crop={selectedCrop} onBack={() => setViewMode('list')} />
                    )}
                    {viewMode === 'tasks' && selectedCrop && (
                        <TasksView
                            crop={selectedCrop}
                            onBack={() => setViewMode('list')}
                            getStageIcon={getStageIcon}
                            getPriorityBadge={getPriorityBadge}
                        />
                    )}
                    {viewMode === 'seedlog' && <SeedLogView onAddSeedUsage={() => setSeedUsageModalOpen(true)} />}
                    {viewMode === 'phiwarning' && <PHIWarningView crops={allCrops} />}
                </div>

                {/* Right Sidebar - Only show on list view */}
                {viewMode === 'list' && crops.length > 0 && (
                    <div className="lg:col-span-1">
                        <CropSidebar getStageColor={getStageColor} />
                    </div>
                )}
            </div>

            {/* Modals */}
            <CropFormModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                isEditing={!!editingCrop}
                initialData={editingCrop ? {
                    cropName: editingCrop.cropType,
                    description: editingCrop.notes ?? '',
                } : undefined}
                onSubmit={editingCrop ? handleUpdateCrop : handleCreateCrop}
                onCancel={handleCancelForm}
                isSubmitting={isCreating || isUpdating}
            />

            <DeleteConfirmModal
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                crop={selectedCrop}
                onConfirm={handleDeleteCrop}
                isDeleting={isDeleting}
                isLoadingVerification={isLoadingSeasonVerification}
                canDelete={canDeleteCrop}
                seasonsUsingCrop={seasonsUsingCrop}
            />

                <SeedUsageModal open={seedUsageModalOpen} onOpenChange={setSeedUsageModalOpen} />
            </div>
        </div>
    );
}




