import { useSeasonManagement } from './hooks/useSeasonManagement';
import { SeasonListView } from './components/SeasonListView';
import { SeasonDetailView } from './components/SeasonDetailView';
import { DeleteSeasonDialog } from './components/DeleteSeasonDialog';
import { StartSeasonDialog } from './components/StartSeasonDialog';
import { CompleteSeasonDialog } from './components/CompleteSeasonDialog';
import { CancelSeasonDialog } from './components/CancelSeasonDialog';
import { NewSeasonDialog } from './components/NewSeasonDialog';
import { EditSeasonDialog } from './components/EditSeasonDialog';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SeasonManagement() {
  const {
    // View state
    viewMode,
    selectedSeason,
    activeTab,
    setActiveTab,

    // Search & filters
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,

    // Selection
    selectedSeasons,
    handleSelectAll,
    handleSelectSeason,

    // Pagination
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    paginatedSeasons,
    filteredSeasons,

    // Dialogs
    deleteDialogOpen,
    setDeleteDialogOpen,
    newSeasonOpen,
    setNewSeasonOpen,
    editSeasonOpen,
    setEditSeasonOpen,
    actionSeason,
    startSeasonOpen,
    setStartSeasonOpen,
    completeSeasonOpen,
    setCompleteSeasonOpen,
    cancelSeasonOpen,
    setCancelSeasonOpen,

    // Handlers
    handleViewDetails,
    handleBackToList,
    handleDeleteSeason,
    handleEditSeason,
    confirmDelete,
    handleStartSeason,
    handleCompleteSeason,
    handleCancelSeason,
    handleArchiveSeason,
    confirmStartSeason,
    confirmCompleteSeason,
    confirmCancelSeason,
    confirmEditSeason,
    handleDuplicate,
    handleExportCSV,
    handleCreateSeason,

    // Helper functions
    getStatusColor,
    getStatusLabel,
    formatDateRange,
    calculateProgress,

    // Data
    uniqueCrops,
    uniqueYears,

    // API State
    isLoading,
    error,
    refetch,
    isDeleting,
    isCreating,
    isUpdating,
    isStarting,
    isCompleting,
    isCancelling,
  } = useSeasonManagement();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          <p className="text-foreground/70">Loading seasons...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <h2 className="text-xl font-semibold text-foreground">Failed to Load Seasons</h2>
          <p className="text-foreground/70">{error.message}</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {viewMode === 'list' ? (
        <SeasonListView
          paginatedSeasons={paginatedSeasons}
          filteredSeasons={filteredSeasons}
          selectedSeasons={selectedSeasons}
          uniqueCrops={uniqueCrops}
          uniqueYears={uniqueYears}
          filters={filters}
          setFilters={setFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={totalPages}
          handleSelectAll={handleSelectAll}
          handleSelectSeason={handleSelectSeason}
          handleViewDetails={handleViewDetails}
          handleDeleteSeason={handleDeleteSeason}
          handleDuplicate={handleDuplicate}
          handleExportCSV={handleExportCSV}
          onNewSeason={() => setNewSeasonOpen(true)}
          onStartSeason={handleStartSeason}
          onCompleteSeason={handleCompleteSeason}
          onCancelSeason={handleCancelSeason}
          onArchiveSeason={handleArchiveSeason}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
          formatDateRange={formatDateRange}
          calculateProgress={calculateProgress}
        />
      ) : (
        selectedSeason && (
          <SeasonDetailView
            season={selectedSeason}
            activities={[]} // Activities would come from field-log entity in future
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onBack={handleBackToList}
            onEditSeason={handleEditSeason}
            onStartSeason={handleStartSeason}
            onCompleteSeason={handleCompleteSeason}
            onCancelSeason={handleCancelSeason}
            onArchiveSeason={handleArchiveSeason}
            handleExportCSV={handleExportCSV}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
            formatDateRange={formatDateRange}
          />
        )
      )}

      <DeleteSeasonDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      <StartSeasonDialog
        open={startSeasonOpen}
        onOpenChange={setStartSeasonOpen}
        season={actionSeason}
        onConfirm={confirmStartSeason}
        isSubmitting={isStarting}
      />

      <CompleteSeasonDialog
        open={completeSeasonOpen}
        onOpenChange={setCompleteSeasonOpen}
        season={actionSeason}
        onConfirm={confirmCompleteSeason}
        isSubmitting={isCompleting}
      />

      <CancelSeasonDialog
        open={cancelSeasonOpen}
        onOpenChange={setCancelSeasonOpen}
        season={actionSeason}
        onConfirm={confirmCancelSeason}
        isSubmitting={isCancelling}
      />

      <NewSeasonDialog
        open={newSeasonOpen}
        onOpenChange={setNewSeasonOpen}
        onSubmit={handleCreateSeason}
        isSubmitting={isCreating}
      />

      <EditSeasonDialog
        open={editSeasonOpen}
        onOpenChange={setEditSeasonOpen}
        season={actionSeason}
        onSubmit={confirmEditSeason}
        isSubmitting={isUpdating}
      />
    </div>
  );
}



