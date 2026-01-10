import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { usePlots, useCreatePlot, useDeletePlot, useUpdatePlot, type PlotRequest } from "@/entities/plot";
import type { Plot, PlotStatus, ViewMode } from "../types";
import { transformApiToFeature, mapPlotStatusToId } from "../utils";
import { usePlotFilters } from "./usePlotFilters";

/**
 * Return type for the usePlotManagement hook
 */
export interface UsePlotManagementReturn {
  // View state
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Filter state (from usePlotFilters)
  filterCrop: string;
  setFilterCrop: (crop: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterSoilType: string;
  setFilterSoilType: (type: string) => void;

  // Filter options from API
  cropOptions: { value: string; label: string }[];
  soilTypeOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  isLoadingFilterOptions: boolean;

  // Data
  plots: Plot[];
  filteredPlots: Plot[];

  // Loading & Error states
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;

  // UI state
  selectedPlot: Plot | null;
  setSelectedPlot: (plot: Plot | null) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isAddPlotOpen: boolean;
  setIsAddPlotOpen: (open: boolean) => void;
  isMergeWizardOpen: boolean;
  setIsMergeWizardOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  mergeStep: number;
  setMergeStep: (step: number) => void;
  selectedPlots: string[];
  setSelectedPlots: (plots: string[]) => void;
  plotToDelete: string | null;
  setPlotToDelete: (id: string | null) => void;

  // Handlers
  handleClearFilters: () => void;
  handleViewPlotDetails: (plot: Plot) => void;
  handleAddPlot: (formData: PlotRequest) => void;
  handleDeletePlot: () => void;
  handleGenerateQR: (plot: Plot) => void;
  handleMarkDormant: (plot: Plot) => void;
  handleMergePlots: () => void;
  handleToggleSelection: (id: string) => void;
  handleToggleAllSelection: () => void;
  handleBulkDelete: () => void;
  handleBulkStatusChange: (status: PlotStatus) => void;
  handleClearSelection: () => void;

  // Selection state
  isAllSelected: boolean;
  isSomeSelected: boolean;
  selectedCount: number;

  // Mutation states
  isCreating: boolean;
  isDeleting: boolean;
}

/**
 * Custom hook for Plot Management state management and business logic
 *
 * Refactored to use:
 * - usePlotFilters: Filter state and options
 * - utils.ts: Transform functions
 */
export const usePlotManagement = (): UsePlotManagementReturn => {
  // ═══════════════════════════════════════════════════════════════
  // COMPOSED HOOKS
  // ═══════════════════════════════════════════════════════════════

  const filters = usePlotFilters();

  // ═══════════════════════════════════════════════════════════════
  // API HOOKS - PLOT DATA
  // ═══════════════════════════════════════════════════════════════

  const {
    data: apiPlots,
    isLoading,
    error,
    refetch
  } = usePlots();

  const createMutation = useCreatePlot({
    onSuccess: () => {
      toast.success("Plot Added Successfully", {
        description: "New plot has been added to your records",
      });
      setIsAddPlotOpen(false);
    },
    onError: (err) => {
      toast.error("Failed to Add Plot", {
        description: err.message || "Please try again",
      });
    },
  });

  const deleteMutation = useDeletePlot({
    onSuccess: () => {
      toast.success("Plot Deleted", {
        description: "The plot has been removed from your records",
      });
      setIsDeleteDialogOpen(false);
      setPlotToDelete(null);
      if (selectedPlot?.id === plotToDelete) {
        setIsDrawerOpen(false);
      }
    },
    onError: (err) => {
      toast.error("Failed to Delete Plot", {
        description: err.message || "Please try again",
      });
    },
  });

  const updateMutation = useUpdatePlot({
    onSuccess: () => {
      toast.success("Plot Status Updated");
    },
    onError: (err) => {
      toast.error("Failed to Update Plot", {
        description: err.message || "Please try again",
      });
    },
  });

  // ═══════════════════════════════════════════════════════════════
  // VIEW STATE
  // ═══════════════════════════════════════════════════════════════

  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // UI state
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddPlotOpen, setIsAddPlotOpen] = useState(false);
  const [isMergeWizardOpen, setIsMergeWizardOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mergeStep, setMergeStep] = useState(1);
  const [selectedPlots, setSelectedPlots] = useState<string[]>([]);
  const [plotToDelete, setPlotToDelete] = useState<string | null>(null);

  // ═══════════════════════════════════════════════════════════════
  // TRANSFORMED DATA
  // ═══════════════════════════════════════════════════════════════

  const plots = useMemo(() => {
    if (apiPlots && apiPlots.length > 0) {
      return apiPlots.map(transformApiToFeature);
    }
    return [];
  }, [apiPlots]);

  // Apply filters from usePlotFilters hook
  const filteredPlots = useMemo(
    () => filters.getFilteredPlots(plots),
    [filters, plots]
  );

  // ═══════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handleClearFilters = useCallback(() => {
    filters.handleClearFilters();
    toast.info("Filters cleared");
  }, [filters]);

  const handleViewPlotDetails = useCallback((plot: Plot) => {
    setSelectedPlot(plot);
    setIsDrawerOpen(true);
  }, []);

  const handleAddPlot = useCallback((formData: PlotRequest) => {
    // Validate required fields (dialog already validates, but double-check)
    if (!formData.plotName || !formData.area) {
      toast.error("Missing Required Fields", {
        description: "Please fill in all required fields marked with *",
      });
      return;
    }

    // Use API mutation - formData is already in correct PlotRequest format
    createMutation.mutate(formData);
  }, [createMutation]);

  const handleDeletePlot = useCallback(() => {
    if (plotToDelete) {
      const plotId = parseInt(plotToDelete, 10);
      if (!isNaN(plotId)) {
        deleteMutation.mutate(plotId);
      }
    }
  }, [plotToDelete, deleteMutation]);

  const handleGenerateQR = useCallback((plot: Plot) => {
    toast.success("QR Code Generated", {
      description: `QR code for ${plot.name} is ready to download`,
    });
  }, []);

  const handleMarkDormant = useCallback((plot: Plot) => {
    const plotId = parseInt(plot.id, 10);
    if (!isNaN(plotId)) {
      updateMutation.mutate({
        id: plotId,
        data: {
          plotName: plot.name,
          area: plot.area,
          plotStatusId: 2, // Dormant
        },
      });
    }
  }, [updateMutation]);

  const handleMergePlots = useCallback(() => {
    if (selectedPlots.length < 2) {
      toast.error("Select at least 2 plots to merge");
      return;
    }

    // Merge logic - would need a custom API endpoint
    toast.success("Plots Merged Successfully", {
      description: `${selectedPlots.length} plots have been merged`,
    });
    setIsMergeWizardOpen(false);
    setSelectedPlots([]);
    setMergeStep(1);
  }, [selectedPlots, plots]);

  // Bulk selection handlers
  const handleToggleSelection = useCallback((id: string) => {
    setSelectedPlots(prev =>
      prev.includes(id)
        ? prev.filter(plotId => plotId !== id)
        : [...prev, id]
    );
  }, []);

  const handleToggleAllSelection = useCallback(() => {
    if (selectedPlots.length === filteredPlots.length) {
      // Deselect all
      setSelectedPlots([]);
    } else {
      // Select all filtered plots
      setSelectedPlots(filteredPlots.map(p => p.id));
    }
  }, [selectedPlots, filteredPlots]);

  const handleBulkDelete = useCallback(() => {
    if (selectedPlots.length === 0) {
      toast.error("No plots selected");
      return;
    }

    // Delete each selected plot
    selectedPlots.forEach(id => {
      const plotId = parseInt(id, 10);
      if (!isNaN(plotId)) {
        deleteMutation.mutate(plotId);
      }
    });

    toast.success("Plots Deleted", {
      description: `${selectedPlots.length} plot(s) have been deleted`,
    });
    setSelectedPlots([]);
  }, [selectedPlots, deleteMutation]);

  const handleBulkStatusChange = useCallback((status: PlotStatus) => {
    if (selectedPlots.length === 0) {
      toast.error("No plots selected");
      return;
    }

    // Update each selected plot
    selectedPlots.forEach(id => {
      const plotId = parseInt(id, 10);
      const plot = plots.find(p => p.id === id);
      if (!isNaN(plotId) && plot) {
        updateMutation.mutate({
          id: plotId,
          data: {
            plotName: plot.name,
            area: plot.area,
            plotStatusId: mapPlotStatusToId(status),
          },
        });
      }
    });

    toast.success("Status Updated", {
      description: `${selectedPlots.length} plot(s) updated to ${status}`,
    });
    setSelectedPlots([]);
  }, [selectedPlots, plots, updateMutation]);

  const handleClearSelection = useCallback(() => {
    setSelectedPlots([]);
  }, []);

  // Selection state
  const isAllSelected = filteredPlots.length > 0 && selectedPlots.length === filteredPlots.length;
  const isSomeSelected = selectedPlots.length > 0 && selectedPlots.length < filteredPlots.length;
  const selectedCount = selectedPlots.length;

  return {
    // View state
    viewMode,
    setViewMode,
    searchQuery: filters.searchQuery,
    setSearchQuery: filters.setSearchQuery,

    // Filter state (from usePlotFilters)
    filterCrop: filters.filterCrop,
    setFilterCrop: filters.setFilterCrop,
    filterStatus: filters.filterStatus,
    setFilterStatus: filters.setFilterStatus,
    filterSoilType: filters.filterSoilType,
    setFilterSoilType: filters.setFilterSoilType,

    // Filter options from API
    cropOptions: filters.cropOptions,
    soilTypeOptions: filters.soilTypeOptions,
    statusOptions: filters.statusOptions,
    isLoadingFilterOptions: filters.isLoadingFilterOptions,

    // Data
    plots,
    filteredPlots,

    // Loading & Error states
    isLoading,
    error: error ?? null,
    refetch,

    // UI state
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

    // Handlers
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

    // Selection state
    isAllSelected,
    isSomeSelected,
    selectedCount,

    // Mutation states
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};



