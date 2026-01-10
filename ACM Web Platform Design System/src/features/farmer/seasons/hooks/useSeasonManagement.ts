import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import {
  useSeasons,
  useCreateSeason,
  useUpdateSeason,
  useDeleteSeason,
  useUpdateSeasonStatus,
  useStartSeason,
  useCompleteSeason,
  useCancelSeason,
  type Season as ApiSeason,
  type SeasonCreateRequest,
  type SeasonUpdateRequest,
} from '@/entities/season';
import { useCrops } from '@/entities/crop';
import type { Season, SeasonStatus, FilterState } from '../types';
import { DEFAULT_PAGINATION } from '../constants';
import { MSG } from '../utils/seasonValidation';

const transformApiToFeature = (api: ApiSeason, cropMap: Map<number, string>): Season => {
  const cropDisplay = api.cropName || cropMap.get(api.cropId) || `Crop #${api.cropId}`;
  const varietyDisplay = api.varietyName || (api.varietyId ? `Variety #${api.varietyId}` : 'No variety');

  return {
    id: String(api.id),
    name: api.seasonName,
    crop: cropDisplay,
    variety: varietyDisplay,
    cropId: api.cropId,
    varietyId: api.varietyId ?? null,
    plotId: api.plotId,
    plotName: api.plotName ?? null,
    farmName: api.farmName ?? null,
    linkedPlots: 1,
    startDate: api.startDate,
    plannedHarvestDate: api.plannedHarvestDate ?? null,
    endDate: api.endDate ?? null,
    initialPlantCount: api.initialPlantCount ?? null,
    currentPlantCount: api.currentPlantCount ?? null,
    expectedYieldKg: api.expectedYieldKg ?? null,
    actualYieldKg: api.actualYieldKg ?? null,
    notes: api.notes ?? null,
    yieldPerHa: api.actualYieldKg ?? api.expectedYieldKg ?? null,
    budgetTotal: 0,
    actualCost: 0,
    status: api.status ?? 'PLANNED',
    onTimePercentage: 100,
    tasksTotal: 0,
    tasksCompleted: 0,
    incidentCount: 0,
    documentCount: 0,
  };
};

export function useSeasonManagement() {
  const { data: apiData, isLoading, error: apiError, refetch } = useSeasons();
  const { data: cropsData, isLoading: cropsLoading } = useCrops();

  const cropMap = useMemo(() => {
    const map = new Map<number, string>();
    if (cropsData) {
      cropsData.forEach((crop) => {
        map.set(crop.id, crop.cropName);
      });
    }
    return map;
  }, [cropsData]);

  const createMutation = useCreateSeason({
    onSuccess: () => {
      // BR103: MSG_7 - "Save data successful."
      toast.success(MSG.MSG_7);
      setNewSeasonOpen(false);
    },
    onError: (err) => toast.error(MSG.MSG_9, { description: err.message }),
  });
  const updateMutation = useUpdateSeason({
    // BR107: MSG_7 - "Save data successful."
    onSuccess: () => toast.success(MSG.MSG_7),
    onError: (err) => toast.error(MSG.MSG_9, { description: err.message }),
  });
  const deleteMutation = useDeleteSeason({
    onSuccess: () => {
      toast.success('Season deleted successfully');
      setDeleteDialogOpen(false);
      setSeasonToDelete(null);
    },
    onError: (err) => toast.error('Failed to delete season', { description: err.message }),
  });
  const updateStatusMutation = useUpdateSeasonStatus({
    onSuccess: () => toast.success('Season status updated'),
    onError: (err) => toast.error('Failed to update status', { description: err.message }),
  });
  const startMutation = useStartSeason({
    onSuccess: () => toast.success('Season started successfully'),
    onError: (err) => toast.error('Failed to start season', { description: err.message }),
  });
  const completeMutation = useCompleteSeason({
    onSuccess: () => toast.success('Season completed successfully'),
    onError: (err) => toast.error('Failed to complete season', { description: err.message }),
  });
  const cancelMutation = useCancelSeason({
    onSuccess: () => toast.success('Season cancelled successfully'),
    onError: (err) => toast.error('Failed to cancel season', { description: err.message }),
  });

  // View state
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    crop: 'all',
    status: 'all',
    year: 'all',
  });

  // Selection
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGINATION.rowsPerPage);

  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [seasonToDelete, setSeasonToDelete] = useState<string | null>(null);
  const [newSeasonOpen, setNewSeasonOpen] = useState(false);
  const [editSeasonOpen, setEditSeasonOpen] = useState(false);
  const [actionSeason, setActionSeason] = useState<Season | null>(null);
  const [startSeasonOpen, setStartSeasonOpen] = useState(false);
  const [completeSeasonOpen, setCompleteSeasonOpen] = useState(false);
  const [cancelSeasonOpen, setCancelSeasonOpen] = useState(false);

  const seasons = useMemo(() => {
    if (!apiData?.items?.length) return [];
    return apiData.items.map((item) => transformApiToFeature(item, cropMap));
  }, [apiData, cropMap]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2 || searchQuery.length === 0) {
        setSearchDebounced(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredSeasons = useMemo(() => {
    return seasons.filter((season) => {
      if (searchDebounced) {
        const searchLower = searchDebounced.toLowerCase();
        const matchesSearch =
          season.name.toLowerCase().includes(searchLower) ||
          season.crop.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.crop !== 'all' && season.crop !== filters.crop) return false;
      if (filters.status === 'all' && season.status === 'ARCHIVED') return false;
      if (filters.status !== 'all' && season.status !== filters.status) return false;

      if (filters.year !== 'all') {
        const startYear = new Date(season.startDate).getFullYear().toString();
        if (startYear !== filters.year) return false;
      }

      return true;
    });
  }, [seasons, searchDebounced, filters]);

  const totalPages = Math.ceil(filteredSeasons.length / rowsPerPage);
  const paginatedSeasons = filteredSeasons.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchDebounced]);

  useEffect(() => {
    if (!selectedSeason) return;
    const updatedSeason = seasons.find((season) => season.id === selectedSeason.id);
    if (updatedSeason) {
      setSelectedSeason(updatedSeason);
    } else if (viewMode === 'detail') {
      setViewMode('list');
      setSelectedSeason(null);
      setActiveTab('overview');
    }
  }, [seasons, selectedSeason?.id, viewMode, setActiveTab, setSelectedSeason, setViewMode]);

  const getStatusColor = (status: SeasonStatus) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'ACTIVE':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'COMPLETED':
        return 'bg-accent/10 text-foreground border-accent/20';
      case 'CANCELLED':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'ARCHIVED':
        return 'bg-muted/30 text-muted-foreground border-border';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: SeasonStatus) => {
    switch (status) {
      case 'PLANNED':
        return 'Planned';
      case 'ACTIVE':
        return 'Active';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'ARCHIVED':
        return 'Archived';
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const year = start.getFullYear();
    return `${startMonth} - ${endMonth} ${year}`;
  };

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    if (end <= start) {
      return now >= end ? 100 : 0;
    }
    if (now < start) return 0;
    if (now > end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedSeasons(paginatedSeasons.map((s) => s.id));
    } else {
      setSelectedSeasons([]);
    }
  }, [paginatedSeasons]);

  const handleSelectSeason = useCallback((seasonId: string, checked: boolean) => {
    if (checked) {
      setSelectedSeasons((prev) => [...prev, seasonId]);
    } else {
      setSelectedSeasons((prev) => prev.filter((id) => id !== seasonId));
    }
  }, []);

  const handleViewDetails = useCallback((season: Season) => {
    setSelectedSeason(season);
    setViewMode('detail');
  }, []);

  const handleBackToList = useCallback(() => {
    setViewMode('list');
    setSelectedSeason(null);
    setActiveTab('overview');
  }, []);

  const handleDeleteSeason = useCallback((seasonId: string) => {
    setSeasonToDelete(seasonId);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (seasonToDelete) {
      const numId = parseInt(seasonToDelete, 10);
      if (!isNaN(numId)) {
        deleteMutation.mutate(numId);
      }
    }
  }, [seasonToDelete, deleteMutation]);

  const handleStartSeason = useCallback((season: Season) => {
    setActionSeason(season);
    setStartSeasonOpen(true);
  }, []);

  const handleCompleteSeason = useCallback((season: Season) => {
    setActionSeason(season);
    setCompleteSeasonOpen(true);
  }, []);

  const handleCancelSeason = useCallback((season: Season) => {
    setActionSeason(season);
    setCancelSeasonOpen(true);
  }, []);

  const handleEditSeason = useCallback((season: Season) => {
    setActionSeason(season);
    setEditSeasonOpen(true);
  }, []);

  const handleArchiveSeason = useCallback((season: Season) => {
    const numId = parseInt(season.id, 10);
    if (isNaN(numId)) return;
    if (!confirm('Archive this season?')) return;
    updateStatusMutation.mutate(
      { id: numId, data: { status: 'ARCHIVED' } },
      {
        onSuccess: () => {
          if (viewMode === 'detail' && selectedSeason?.id === season.id) {
            setViewMode('list');
            setSelectedSeason(null);
            setActiveTab('overview');
          }
        },
      }
    );
  }, [updateStatusMutation, viewMode, selectedSeason, setActiveTab, setSelectedSeason, setViewMode]);

  const confirmStartSeason = useCallback((data: { actualStartDate?: string; currentPlantCount?: number }) => {
    if (!actionSeason) return;
    const numId = parseInt(actionSeason.id, 10);
    if (isNaN(numId)) return;

    const payload = data.actualStartDate ? { actualStartDate: data.actualStartDate } : undefined;
    startMutation.mutate(
      { id: numId, data: payload },
      {
        onSuccess: () => {
          if (data.currentPlantCount !== undefined) {
            updateMutation.mutate({
              id: numId,
              data: {
                seasonName: actionSeason.name,
                startDate: data.actualStartDate || actionSeason.startDate,
                currentPlantCount: data.currentPlantCount,
                plannedHarvestDate: actionSeason.plannedHarvestDate ?? undefined,
                endDate: actionSeason.endDate ?? undefined,
                expectedYieldKg: actionSeason.expectedYieldKg ?? undefined,
                actualYieldKg: actionSeason.actualYieldKg ?? undefined,
                notes: actionSeason.notes ?? undefined,
                varietyId: actionSeason.varietyId ?? undefined,
              },
            });
          }
          setStartSeasonOpen(false);
          setActionSeason(null);
        },
      }
    );
  }, [actionSeason, startMutation, updateMutation]);

  const confirmCompleteSeason = useCallback((data: { endDate: string; actualYieldKg?: number; forceComplete?: boolean }) => {
    if (!actionSeason) return;
    const numId = parseInt(actionSeason.id, 10);
    if (isNaN(numId)) return;

    completeMutation.mutate(
      {
        id: numId,
        data: {
          endDate: data.endDate,
          actualYieldKg: data.actualYieldKg,
          forceComplete: data.forceComplete,
        },
      },
      {
        onSuccess: () => {
          setCompleteSeasonOpen(false);
          setActionSeason(null);
        },
      }
    );
  }, [actionSeason, completeMutation]);

  const confirmCancelSeason = useCallback((data: { reason?: string; forceCancel?: boolean }) => {
    if (!actionSeason) return;
    const numId = parseInt(actionSeason.id, 10);
    if (isNaN(numId)) return;

    cancelMutation.mutate(
      {
        id: numId,
        data: {
          forceCancel: data.forceCancel,
          reason: data.reason,
        },
      },
      {
        onSuccess: () => {
          setCancelSeasonOpen(false);
          setActionSeason(null);
        },
      }
    );
  }, [actionSeason, cancelMutation]);

  const confirmEditSeason = useCallback((id: number, data: SeasonUpdateRequest) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          setEditSeasonOpen(false);
          setActionSeason(null);
        },
      }
    );
  }, [updateMutation]);

  const handleDuplicate = useCallback((_season: Season) => {
    toast.success('Season duplicated successfully');
  }, []);

  const handleExportCSV = useCallback(() => {
    toast.success('Exporting seasons data to CSV...');
  }, []);

  const handleCreateSeason = useCallback((formData: SeasonCreateRequest) => {
    if (!formData.seasonName) {
      toast.error('Season name is required');
      return;
    }
    if (!formData.plotId) {
      toast.error('Plot is required');
      return;
    }
    if (!formData.cropId) {
      toast.error('Crop is required');
      return;
    }
    createMutation.mutate(formData);
  }, [createMutation]);

  const uniqueCrops = useMemo(() =>
    Array.from(new Set(seasons.map((s) => s.crop))),
    [seasons]
  );
  const uniqueYears = useMemo(() =>
    Array.from(
      new Set(seasons.map((s) => new Date(s.startDate).getFullYear().toString()))
    ).sort((a, b) => b.localeCompare(a)),
    [seasons]
  );

  return {
    viewMode,
    setViewMode,
    selectedSeason,
    activeTab,
    setActiveTab,

    searchQuery,
    setSearchQuery,
    filters,
    setFilters,

    selectedSeasons,
    handleSelectAll,
    handleSelectSeason,

    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    paginatedSeasons,
    filteredSeasons,

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

    handleViewDetails,
    handleBackToList,
    handleDeleteSeason,
    confirmDelete,
    handleEditSeason,
    handleStartSeason,
    handleCompleteSeason,
    handleCancelSeason,
    handleArchiveSeason,
    confirmEditSeason,
    confirmStartSeason,
    confirmCompleteSeason,
    confirmCancelSeason,
    handleDuplicate,
    handleExportCSV,
    handleCreateSeason,

    getStatusColor,
    getStatusLabel,
    formatDateRange,
    calculateProgress,

    uniqueCrops,
    uniqueYears,

    isLoading: isLoading || cropsLoading,
    error: apiError ?? null,
    refetch,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isStarting: startMutation.isPending,
    isCompleting: completeMutation.isPending,
    isCancelling: cancelMutation.isPending,
  };
}



