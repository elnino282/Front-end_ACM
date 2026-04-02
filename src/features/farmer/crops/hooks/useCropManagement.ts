import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { Sprout, Leaf, Flower, Wheat } from 'lucide-react';
import { useCrops, useCreateCrop, useUpdateCrop, useDeleteCrop, type Crop as ApiCrop, type CropRequest } from '@/entities/crop';
import { useSeasonsByCrop } from '@/entities/season';
import type { ViewMode, Crop } from '../types';

/**
 * Transform API crop to feature crop format
 * The entities/crop represents crop definitions (types),
 * while features/farmer/crops represents crop instances planted in plots
 */
const transformApiToFeature = (apiCrop: ApiCrop): Crop => ({
    id: String(apiCrop.id),
    cropType: apiCrop.cropName,
    variety: apiCrop.description ?? '',
    plot: '',
    season: '',
    sowingDate: '',
    expectedHarvest: '',
    currentStage: '',
    daysAfterSowing: 0,
    notes: apiCrop.description ?? undefined,
});

export function useCropManagement() {
    // ═══════════════════════════════════════════════════════════════
    // API HOOKS
    // ═══════════════════════════════════════════════════════════════

    const {
        data: apiCrops,
        isLoading,
        error,
        refetch,
    } = useCrops();

    const createMutation = useCreateCrop({
        onSuccess: () => {
            toast.success('Crop record created', {
                description: 'New crop has been added to your records.',
            });
            setCreateModalOpen(false);
        },
        onError: (err) => {
            toast.error('Failed to create crop', {
                description: err.message || 'Please try again',
            });
        },
    });

    const updateMutation = useUpdateCrop({
        onSuccess: () => {
            toast.success('Crop record updated');
            setEditingCrop(null);
            setCreateModalOpen(false);
        },
        onError: (err) => {
            toast.error('Failed to update crop', {
                description: err.message || 'Please try again',
            });
        },
    });

    const deleteMutation = useDeleteCrop({
        onSuccess: () => {
            toast.success('Crop record deleted');
            setDeleteConfirmOpen(false);
            setSelectedCrop(null);
        },
        onError: (err) => {
            toast.error('Failed to delete crop', {
                description: err.message || 'Please try again',
            });
        },
    });

    // ═══════════════════════════════════════════════════════════════
    // VIEW STATE
    // ═══════════════════════════════════════════════════════════════

    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);

    // Modal state
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
    const [seedUsageModalOpen, setSeedUsageModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    // Filter state
    const [plotFilter, setPlotFilter] = useState('all');
    const [seasonFilter, setSeasonFilter] = useState('all');
    const [cropTypeFilter, setCropTypeFilter] = useState('all');
    const [varietyFilter, setVarietyFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // ═══════════════════════════════════════════════════════════════
    // SEASON VALIDATION FOR DELETE
    // ═══════════════════════════════════════════════════════════════

    // Query seasons using the selected crop (for delete validation)
    const selectedCropId = selectedCrop ? parseInt(selectedCrop.id, 10) : 0;
    const {
        data: seasonsData,
        isLoading: isLoadingSeasons,
    } = useSeasonsByCrop(selectedCropId, {
        enabled: deleteConfirmOpen && selectedCropId > 0,
    });

    const seasonsUsingCrop = seasonsData?.items ?? [];
    const canDeleteCrop = seasonsUsingCrop.length === 0;


    // ═══════════════════════════════════════════════════════════════
    // TRANSFORMED DATA
    // ═══════════════════════════════════════════════════════════════

    // Transform API data to feature format
    const allCrops = useMemo(() => {
        if (apiCrops && apiCrops.length > 0) {
            return apiCrops.map(transformApiToFeature);
        }
        // Return empty array when no API data
        return [];
    }, [apiCrops]);

    const getStageIcon = (stage: string) => {
        switch (stage) {
            case 'Sowing':
                return Sprout;
            case 'Vegetative':
                return Leaf;
            case 'Reproductive':
                return Flower;
            case 'Harvest':
                return Wheat;
            default:
                return Sprout;
        }
    };

    const getStageColor = (stage: string): string => {
        switch (stage) {
            case 'Sowing':
                return 'bg-purple-100 text-purple-700';
            case 'Vegetative':
                return 'bg-emerald-100 text-emerald-700';
            case 'Reproductive':
                return 'bg-amber-100 text-amber-700';
            case 'Harvest':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityBadge = (priority: string): string => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700';
            case 'medium':
                return 'bg-amber-100 text-amber-700';
            case 'low':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };


    const handleCreateCrop = useCallback((formData: CropRequest) => {
        if (!formData.cropName) {
            toast.error('Crop name is required');
            return;
        }
        createMutation.mutate(formData);
    }, [createMutation]);

    const handleUpdateCrop = useCallback((formData: CropRequest) => {
        if (!editingCrop) return;

        const cropId = parseInt(editingCrop.id, 10);
        if (!isNaN(cropId)) {
            updateMutation.mutate({
                id: cropId,
                data: formData,
            });
        }
    }, [editingCrop, updateMutation]);

    const handleDeleteCrop = useCallback(() => {
        if (!selectedCrop) return;

        const cropId = parseInt(selectedCrop.id, 10);
        if (!isNaN(cropId)) {
            deleteMutation.mutate(cropId);
        }
    }, [selectedCrop, deleteMutation]);

    const handleEditCrop = useCallback((crop: Crop) => {
        setEditingCrop(crop);
        setCreateModalOpen(true);
    }, []);

    const handleCancelForm = useCallback(() => {
        setCreateModalOpen(false);
        setEditingCrop(null);
    }, []);

    // ═══════════════════════════════════════════════════════════════
    // FILTERED DATA
    // ═══════════════════════════════════════════════════════════════

    const filteredCrops = useMemo(() => {
        return allCrops.filter((crop) => {
            const matchesPlot = plotFilter === 'all' || crop.plot === plotFilter;
            const matchesSeason = seasonFilter === 'all' || crop.season === seasonFilter;
            const matchesCropType = cropTypeFilter === 'all' || crop.cropType === cropTypeFilter;
            const matchesVariety = varietyFilter === 'all' || crop.variety === varietyFilter;
            const matchesSearch =
                searchQuery === '' ||
                crop.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                crop.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
                crop.plot.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesPlot && matchesSeason && matchesCropType && matchesVariety && matchesSearch;
        });
    }, [allCrops, plotFilter, seasonFilter, cropTypeFilter, varietyFilter, searchQuery]);

    // Return only what's needed by the UI
    return {
        // View state
        viewMode,
        setViewMode,
        selectedCrop,
        setSelectedCrop,

        // Data
        crops: filteredCrops,
        allCrops,

        // Loading & Error states
        isLoading,
        error: error ?? null,
        refetch,

        // Modal state
        createModalOpen,
        setCreateModalOpen,
        deleteConfirmOpen,
        setDeleteConfirmOpen,
        seedUsageModalOpen,
        setSeedUsageModalOpen,
        editingCrop,

        // Filters
        filters: {
            plotFilter,
            seasonFilter,
            cropTypeFilter,
            varietyFilter,
            searchQuery,
        },
        setFilters: {
            setPlotFilter,
            setSeasonFilter,
            setCropTypeFilter,
            setVarietyFilter,
            setSearchQuery,
        },

        // Handlers
        handleCreateCrop,
        handleUpdateCrop,
        handleDeleteCrop,
        handleEditCrop,
        handleCancelForm,

        // Utilities
        getStageIcon,
        getStageColor,
        getPriorityBadge,

        // Mutation states
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,

        // Delete validation
        isLoadingSeasonVerification: isLoadingSeasons,
        canDeleteCrop,
        seasonsUsingCrop,
    };
}



