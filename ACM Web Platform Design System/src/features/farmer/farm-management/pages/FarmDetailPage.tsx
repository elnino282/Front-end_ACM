/**
 * Farm Detail Page
 *
 * Displays comprehensive farm information with tabs for related entities
 */

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useFarmDetail } from '../hooks/useFarmDetail';
import { usePlotsByFarm } from '@/entities/plot';
import { useSeasons, type SeasonStatus } from '@/entities/season';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Button,
    Skeleton,
    Badge,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui';
import { FarmInfoCard } from '../ui/FarmInfoCard';
import { FarmFormDialog } from '../ui/FarmFormDialog';
import { FarmDeleteDialog } from '../ui/FarmDeleteDialog';
import { FarmPlotsTable } from '../ui/FarmPlotsTable';
import { CreatePlotInFarmDialog } from '../ui/CreatePlotInFarmDialog';
import { ArrowLeft, Loader2, AlertCircle, Sprout, Package, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

/**
 * FarmDetailPage Component
 *
 * Main detail view for a single farm with:
 * - Breadcrumb navigation
 * - Farm information card
 * - Tabs for related entities (Plots, Seasons, Stock, Harvests, Incidents)
 * - Edit and delete actions
 */
export function FarmDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const farmId = id ? parseInt(id, 10) : 0;

    // State
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [createPlotDialogOpen, setCreatePlotDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('info');
    const [seasonSearch, setSeasonSearch] = useState('');
    const [seasonStatusFilter, setSeasonStatusFilter] = useState<SeasonStatus | 'all'>('all');
    const [seasonPlotFilter, setSeasonPlotFilter] = useState<'all' | number>('all');

    // Fetch farm data
    const { farm, isLoading, isError, error } = useFarmDetail(farmId);

    // Fetch plots for this farm
    const {
        data: plotsData,
        isLoading: isLoadingPlots,
        refetch: refetchPlots,
    } = usePlotsByFarm(farmId, { page: 0, size: 100 });

    // Fetch seasons for this farm
    const {
        data: seasonsData,
        isLoading: isLoadingSeasons,
        isError: isSeasonsError,
        error: seasonsError,
        refetch: refetchSeasons,
    } = useSeasons(
        { farmId, page: 0, size: 100 },
        { enabled: farmId > 0 }
    );

    // Handlers
    const handleBack = () => {
        navigate('/farmer/farms');
    };

    const handleEdit = () => {
        setEditDialogOpen(true);
    };

    const handleDelete = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        // Delete is handled by the FarmDeleteDialog
        setDeleteDialogOpen(false);
        toast.success('Farm deleted successfully');
        navigate('/farmer/farms');
    };

    const handleCreatePlot = () => {
        if (!farm?.active) {
            toast.error('This farm is inactive. Activate it to create plots.');
            return;
        }
        setActiveTab('plots');
        setCreatePlotDialogOpen(true);
    };

    useEffect(() => {
        const state = location.state as { openCreatePlot?: boolean } | null;
        if (state?.openCreatePlot && farm) {
            setActiveTab('plots');
            if (farm.active) {
                setCreatePlotDialogOpen(true);
            } else {
                toast.error('This farm is inactive. Activate it to create plots.');
            }
            navigate(`/farmer/farms/${farmId}`, { replace: true });
        }
    }, [location.state, farm, farmId, navigate]);

    // Derived data
    const plots = plotsData?.items ?? [];
    const plotNameById = useMemo(
        () => new Map(plots.map((plot) => [plot.id, plot.plotName])),
        [plots]
    );
    const totalPlotArea = plots.reduce((sum, plot) => sum + (plot.area ?? 0), 0);
    const totalPlotAreaLabel = totalPlotArea > 0 ? `${totalPlotArea.toFixed(2)} ha` : '-';
    const seasons = seasonsData?.items ?? [];

    const seasonSummary = useMemo(() => {
        const summary = {
            total: seasons.length,
            active: 0,
            planned: 0,
            completed: 0,
            cancelled: 0,
            archived: 0,
            expectedYieldTotal: 0,
        };

        seasons.forEach((season) => {
            switch (season.status) {
                case 'ACTIVE':
                    summary.active += 1;
                    break;
                case 'COMPLETED':
                    summary.completed += 1;
                    break;
                case 'CANCELLED':
                    summary.cancelled += 1;
                    break;
                case 'ARCHIVED':
                    summary.archived += 1;
                    break;
                case 'PLANNED':
                default:
                    summary.planned += 1;
            }
            if (season.expectedYieldKg != null) {
                summary.expectedYieldTotal += season.expectedYieldKg;
            }
        });

        return summary;
    }, [seasons]);

    const upcomingHarvest = useMemo(() => {
        const now = Date.now();
        const dates = seasons
            .map((season) => season.plannedHarvestDate ?? season.endDate)
            .filter((value): value is string => Boolean(value))
            .map((value) => ({ value, time: Date.parse(value) }))
            .filter((item) => !Number.isNaN(item.time))
            .sort((a, b) => a.time - b.time);

        if (dates.length === 0) {
            return null;
        }

        return (dates.find((item) => item.time >= now) ?? dates[0]).value;
    }, [seasons]);

    const filteredSeasons = useMemo(() => {
        const searchValue = seasonSearch.trim().toLowerCase();

        return seasons.filter((season) => {
            if (seasonStatusFilter !== 'all' && season.status !== seasonStatusFilter) {
                return false;
            }
            if (seasonPlotFilter !== 'all' && season.plotId !== seasonPlotFilter) {
                return false;
            }
            if (!searchValue) {
                return true;
            }

            const plotLabel = season.plotName ?? plotNameById.get(season.plotId) ?? '';
            const cropLabel = season.cropName ?? `Crop #${season.cropId}`;
            const varietyLabel = season.varietyName ?? '';
            const haystack = `${season.seasonName} ${plotLabel} ${cropLabel} ${varietyLabel}`.toLowerCase();

            return haystack.includes(searchValue);
        });
    }, [seasons, seasonSearch, seasonStatusFilter, seasonPlotFilter, plotNameById]);

    const expectedYieldLabel = seasonSummary.expectedYieldTotal > 0
        ? `${seasonSummary.expectedYieldTotal.toFixed(2)} kg`
        : '-';
    const upcomingHarvestLabel = upcomingHarvest ? formatSeasonDate(upcomingHarvest) : '-';

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background pb-20">
                <div className="container mx-auto py-6 px-4 max-w-7xl">
                    {/* Breadcrumb skeleton */}
                    <div className="mb-6">
                        <Skeleton className="h-5 w-64" />
                    </div>

                    {/* Back button skeleton */}
                    <div className="mb-6">
                        <Skeleton className="h-10 w-32" />
                    </div>

                    {/* Card skeleton */}
                    <Skeleton className="h-64 w-full mb-6" />

                    {/* Tabs skeleton */}
                    <Skeleton className="h-10 w-full mb-4" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        );
    }

    // Error state
    if (isError || !farm) {
        return (
            <div className="min-h-screen bg-background pb-20">
                <div className="container mx-auto py-6 px-4 max-w-7xl">
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Farm Not Found
                            </h2>
                            <p className="text-gray-500 mb-6">
                                {error?.message || 'The farm you are looking for does not exist or has been deleted.'}
                            </p>
                            <Button onClick={handleBack}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Farms
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="container mx-auto py-6 px-4 max-w-7xl">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/farmer/farms">
                            My Farms
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{farm.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Back button */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="pl-0"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Farms
                </Button>
            </div>

            {/* Farm Info Card */}
            <div className="mb-8">
                <FarmInfoCard
                    farm={farm}
                    canEdit={true}
                    canDelete={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreatePlot={handleCreatePlot}
                />
            </div>

            {/* Tabs for Related Entities */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6 w-full flex flex-wrap justify-start gap-2 h-auto">
                    <TabsTrigger value="info" className="flex-none px-3">Overview</TabsTrigger>
                    <TabsTrigger value="plots" className="flex-none px-3">
                        Plots
                        {plots.length > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {plots.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="seasons" className="flex-none px-3">
                        Seasons
                        {seasons.length > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {seasons.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="stock" className="flex-none px-3">Stock</TabsTrigger>
                    <TabsTrigger value="incidents" className="flex-none px-3">Incidents</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="info" className="space-y-4">
                    <div className="bg-card rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-4">Farm Overview</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Farm Name</p>
                                <p className="text-base font-medium">{farm.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Owner</p>
                                <p className="text-base font-medium">@{farm.ownerUsername}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Area</p>
                                <p className="text-base font-medium font-mono">
                                    {farm.area != null ? `${farm.area} ha` : 'Not specified'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="text-base font-medium">
                                    {farm.wardName && farm.provinceName
                                        ? `${farm.wardName}, ${farm.provinceName}`
                                        : farm.provinceName || 'Not specified'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <div className="mt-1">
                                    <Badge variant={farm.active ? 'default' : 'secondary'}>
                                        {farm.active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Plots</p>
                                <p className="text-base font-medium font-mono">{plots.length}</p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Plots Tab */}
                <TabsContent value="plots">
                    <div className="space-y-4">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-semibold">Plots in {farm.name}</h3>
                                <p className="text-sm text-gray-500">
                                    Manage the plots within this farm
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                <span className="rounded-full bg-gray-100 px-3 py-1">
                                    Total plots: {plots.length}
                                </span>
                                <span className="rounded-full bg-gray-100 px-3 py-1">
                                    Total area: {totalPlotAreaLabel}
                                </span>
                            </div>
                        </div>

                        {/* Inactive farm warning */}
                        {!farm.active && (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-yellow-800">
                                            This farm is inactive
                                        </h4>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            Activate this farm to create new plots or seasons.
                                            You can still view existing plots.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Plots table */}
                        <FarmPlotsTable
                            plots={plots}
                            isLoading={isLoadingPlots}
                        />
                    </div>
                </TabsContent>

                {/* Seasons Tab */}
                <TabsContent value="seasons">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Sprout className="h-5 w-5 text-emerald-600" />
                                    <h3 className="text-lg font-semibold">Seasons in {farm.name}</h3>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Track planting cycles, progress, and harvest timelines across plots
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => refetchSeasons()}
                                    disabled={isLoadingSeasons}
                                >
                                    Refresh
                                </Button>
                                <Button size="sm" onClick={() => navigate('/farmer/seasons')}>
                                    Manage Seasons
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-lg border border-gray-200 bg-card p-4">
                                <p className="text-xs text-gray-500">Total seasons</p>
                                <p className="text-2xl font-semibold">{seasonSummary.total}</p>
                                <p className="mt-1 text-xs text-gray-500">
                                    {seasonSummary.active} active
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-card p-4">
                                <p className="text-xs text-gray-500">Planned vs completed</p>
                                <p className="text-2xl font-semibold">
                                    {seasonSummary.planned} / {seasonSummary.completed}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    {seasonSummary.cancelled + seasonSummary.archived} archived or cancelled
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-card p-4">
                                <p className="text-xs text-gray-500">Upcoming harvest</p>
                                <p className="text-2xl font-semibold">{upcomingHarvestLabel}</p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Based on planned harvest dates
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-card p-4">
                                <p className="text-xs text-gray-500">Expected yield</p>
                                <p className="text-2xl font-semibold font-mono">{expectedYieldLabel}</p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Sum of expected harvest
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-card p-4">
                            <div className="flex flex-wrap items-center justify-start gap-4">
                                <div className="w-[320px]">
                                    <Input
                                        placeholder="Search by season, crop, or plot..."
                                        value={seasonSearch}
                                        onChange={(event) => setSeasonSearch(event.target.value)}
                                    />
                                </div>
                                <Select
                                    value={seasonStatusFilter}
                                    onValueChange={(value) =>
                                        setSeasonStatusFilter(
                                            value === 'all' ? 'all' : (value as SeasonStatus)
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        <SelectItem value="PLANNED">Planned</SelectItem>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={seasonPlotFilter === 'all' ? 'all' : seasonPlotFilter.toString()}
                                    onValueChange={(value) =>
                                        setSeasonPlotFilter(value === 'all' ? 'all' : parseInt(value, 10))
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="All plots" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All plots</SelectItem>
                                        {plots.map((plot) => (
                                            <SelectItem key={plot.id} value={plot.id.toString()}>
                                                {plot.plotName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                Showing {filteredSeasons.length} of {seasons.length} seasons
                            </div>
                        </div>

                        {!farm.active && (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-yellow-800">
                                            This farm is inactive
                                        </h4>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            Activate this farm to create new seasons.
                                            You can still view existing seasons.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isLoadingSeasons ? (
                            <div className="rounded-lg border border-gray-200 bg-card">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Season</TableHead>
                                            <TableHead>Crop</TableHead>
                                            <TableHead>Plot</TableHead>
                                            <TableHead>Timeline</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Yield (kg)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[1, 2, 3].map((row) => (
                                            <TableRow key={row}>
                                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                                <TableCell className="text-right">
                                                    <Skeleton className="h-4 w-16 ml-auto" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : isSeasonsError ? (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-red-800">
                                            Failed to load seasons
                                        </h4>
                                        <p className="text-sm text-red-700 mt-1">
                                            {seasonsError?.message || 'Please try again in a moment.'}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-3"
                                            onClick={() => refetchSeasons()}
                                        >
                                            Try Again
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : filteredSeasons.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {seasons.length === 0
                                        ? 'No seasons yet'
                                        : 'No seasons match your filters'}
                                </h3>
                                <p>
                                    {seasons.length === 0
                                        ? 'Create a season to start tracking crop cycles for this farm.'
                                        : 'Try adjusting the search or filters to find seasons.'}
                                </p>
                                {seasons.length === 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-4"
                                        onClick={() => navigate('/farmer/seasons')}
                                    >
                                        Create Season
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-gray-200 bg-card">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Season</TableHead>
                                            <TableHead>Crop</TableHead>
                                            <TableHead>Plot</TableHead>
                                            <TableHead>Timeline</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Yield (kg)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredSeasons.map((season) => {
                                            const plotLabel = season.plotName
                                                ?? plotNameById.get(season.plotId)
                                                ?? `Plot #${season.plotId}`;
                                            const cropLabel = season.cropName ?? `Crop #${season.cropId}`;
                                            const varietyLabel = season.varietyName
                                                ?? (season.varietyId ? `Variety #${season.varietyId}` : '');
                                            const harvestDate = season.plannedHarvestDate ?? season.endDate;
                                            const yieldValue = season.actualYieldKg ?? season.expectedYieldKg;

                                            return (
                                                <TableRow key={season.id} className="hover:bg-gray-50">
                                                    <TableCell className="font-medium">
                                                        <div className="text-sm text-gray-900">
                                                            {season.seasonName}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            ID: #{season.id}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm text-gray-900">
                                                            {cropLabel}
                                                        </div>
                                                        {varietyLabel && (
                                                            <div className="text-xs text-gray-500">
                                                                {varietyLabel}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm text-gray-900">
                                                            {plotLabel}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm text-gray-900">
                                                            {formatSeasonDate(season.startDate)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Harvest: {formatSeasonDate(harvestDate)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={getSeasonStatusVariant(season.status)}>
                                                            {getSeasonStatusLabel(season.status)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">
                                                        {yieldValue != null ? yieldValue.toFixed(2) : '-'}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Stock Tab */}
                <TabsContent value="stock">
                    <PlaceholderTab
                        title="Stock Management"
                        description="Manage inventory and stock for this farm. Stock tracking will be available in future versions."
                        icon={<Package className="h-6 w-6 text-gray-400" />}
                    />
                </TabsContent>

                {/* Incidents Tab */}
                <TabsContent value="incidents">
                    <PlaceholderTab
                        title="Incidents Tracking"
                        description="Track and manage incidents affecting this farm. Incidents will be available in future versions."
                        icon={<AlertTriangle className="h-6 w-6 text-gray-400" />}
                    />
                </TabsContent>
            </Tabs>

            {/* Edit Dialog */}
            <FarmFormDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                mode="edit"
                farm={farm}
                farmId={farmId}
            />

            {/* Delete Dialog */}
            <FarmDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                farmId={farmId}
                farmName={farm.name}
                onDeleteSuccess={handleDeleteConfirm}
            />

            {/* Create Plot Dialog */}
            <CreatePlotInFarmDialog
                open={createPlotDialogOpen}
                onOpenChange={setCreatePlotDialogOpen}
                farmId={farmId}
                farmName={farm.name}
                onCreated={() => refetchPlots()}
            />
            </div>
        </div>
    );
}

function getSeasonStatusVariant(
    status?: SeasonStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
        case 'ACTIVE':
            return 'default';
        case 'COMPLETED':
            return 'secondary';
        case 'CANCELLED':
            return 'destructive';
        case 'ARCHIVED':
            return 'secondary';
        case 'PLANNED':
        default:
            return 'outline';
    }
}

function getSeasonStatusLabel(status?: SeasonStatus) {
    switch (status) {
        case 'ACTIVE':
            return 'Active';
        case 'COMPLETED':
            return 'Completed';
        case 'CANCELLED':
            return 'Cancelled';
        case 'ARCHIVED':
            return 'Archived';
        case 'PLANNED':
            return 'Planned';
        default:
            return 'Unknown';
    }
}

function formatSeasonDate(value?: string | null) {
    if (!value) {
        return '-';
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
    return parsed.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });
}

/**
 * PlaceholderTab Component
 *
 * Displays a coming soon message for tabs that are not yet implemented
 */
interface PlaceholderTabProps {
    title: string;
    description: string;
    icon: ReactNode;
}

function PlaceholderTab({ title, description, icon }: PlaceholderTabProps) {
    return (
        <div className="bg-card rounded-lg border border-gray-200 p-10">
            <div className="flex flex-col items-center text-center max-w-md mx-auto">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
                    {icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-gray-500 mb-6">
                    {description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Coming Soon</span>
                </div>
            </div>
        </div>
    );
}



