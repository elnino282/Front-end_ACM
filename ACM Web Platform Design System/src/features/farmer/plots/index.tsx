import { GitMerge, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton, QueryError } from "@/shared/ui";
import { toast } from "sonner";
import { usePlotManagement } from "./hooks/usePlotManagement";
import { PlotToolbar } from "./components/PlotToolbar";
import { PlotListView } from "./components/PlotListView";
import { PlotMapView } from "./components/PlotMapView";
import { PlotDetailDrawer } from "./components/PlotDetailDrawer";
import { AddPlotDialog } from "./components/AddPlotDialog";
import { MergePlotsWizard } from "./components/MergePlotsWizard";
import { DeletePlotDialog } from "./components/DeletePlotDialog";

/**
 * PlotManagement Component
 *
 * Main container for plot management feature.
 * Orchestrates all sub-components and manages the overall layout.
 *
 * Refactored following Clean Code principles:
 * - Single Responsibility: Each component handles one aspect
 * - Separation of Concerns: Logic in hook, UI in components
 * - Colocation: Related code grouped in feature folder
 */
export function PlotManagement() {
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    filterCrop,
    setFilterCrop,
    filterStatus,
    setFilterStatus,
    filterSoilType,
    setFilterSoilType,
    cropOptions,
    soilTypeOptions,
    statusOptions,
    isLoadingFilterOptions,
    plots,
    filteredPlots,
    isLoading,
    error,
    refetch,
    selectedPlot,
    setSelectedPlot,
    isDrawerOpen,
    setIsDrawerOpen,
    isAddPlotOpen,
    setIsAddPlotOpen,
    isMergeWizardOpen,
    setIsMergeWizardOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    mergeStep,
    setMergeStep,
    selectedPlots,
    setSelectedPlots,
    plotToDelete,
    setPlotToDelete,
    handleClearFilters,
    handleViewPlotDetails,
    handleAddPlot,
    handleDeletePlot,
    handleGenerateQR,
    handleMarkDormant,
    handleMergePlots,
    handleToggleSelection,
    handleToggleAllSelection,
    handleBulkDelete,
    handleBulkStatusChange,
    handleClearSelection,
    isAllSelected,
    isSomeSelected,
    selectedCount,
    isCreating,
    isDeleting,
  } = usePlotManagement();

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-[1600px] mx-auto p-8 space-y-6">
        {/* Unified Toolbar */}
        <PlotToolbar
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAddPlot={() => setIsAddPlotOpen(true)}
          onMergePlots={() => setIsMergeWizardOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterCrop={filterCrop}
          setFilterCrop={setFilterCrop}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterSoilType={filterSoilType}
          setFilterSoilType={setFilterSoilType}
          cropOptions={cropOptions}
          soilTypeOptions={soilTypeOptions}
          statusOptions={statusOptions}
          isLoadingFilterOptions={isLoadingFilterOptions}
          filteredCount={filteredPlots.length}
          totalCount={plots.length}
          selectedCount={selectedCount}
          onClearFilters={handleClearFilters}
          showMergeButton={filteredPlots.length > 1}
        />

        {/* Main Content */}
        {error ? (
          <QueryError error={error} onRetry={refetch} className="my-6" />
        ) : isLoading ? (
          <LoadingSkeleton />
        ) : viewMode === "list" ? (
          <PlotListView
            plots={filteredPlots}
            selectedPlots={selectedPlots}
            onToggleSelection={handleToggleSelection}
            onToggleAllSelection={handleToggleAllSelection}
            onViewDetails={handleViewPlotDetails}
            onDelete={(id) => {
              setPlotToDelete(id);
              setIsDeleteDialogOpen(true);
            }}
            onBulkDelete={handleBulkDelete}
            onBulkStatusChange={handleBulkStatusChange}
            onClearSelection={handleClearSelection}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <PlotMapView
            plots={filteredPlots}
            onViewDetails={handleViewPlotDetails}
            onGenerateQR={handleGenerateQR}
          />
        )}
      </div>

      {/* AI Assistant Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg bg-secondary hover:bg-secondary/90 text-white"
          onClick={() =>
            toast.info("AI Assistant", {
              description: "Ask me anything about your plots",
            })
          }
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      </div>

      {/* Plot Detail Drawer */}
      <PlotDetailDrawer
        plot={selectedPlot}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={() => setIsAddPlotOpen(true)}
        onMerge={() => setIsMergeWizardOpen(true)}
        onMarkDormant={handleMarkDormant}
        onGenerateQR={handleGenerateQR}
        onDelete={(id) => {
          setPlotToDelete(id);
          setIsDeleteDialogOpen(true);
        }}
      />

      {/* Add Plot Dialog */}
      <AddPlotDialog
        isOpen={isAddPlotOpen}
        onClose={() => setIsAddPlotOpen(false)}
        onSubmit={handleAddPlot}
        isSubmitting={isCreating}
      />

      {/* Merge Plots Wizard */}
      <MergePlotsWizard
        isOpen={isMergeWizardOpen}
        onClose={() => setIsMergeWizardOpen(false)}
        plots={plots}
        selectedPlots={selectedPlots}
        setSelectedPlots={setSelectedPlots}
        mergeStep={mergeStep}
        setMergeStep={setMergeStep}
        onConfirm={handleMergePlots}
      />

      {/* Delete Plot Dialog */}
      <DeletePlotDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeletePlot}
      />
    </div>
  );
}




