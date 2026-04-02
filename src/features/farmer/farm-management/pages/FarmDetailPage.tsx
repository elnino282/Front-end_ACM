/**
 * Farm Detail Page
 *
 * Displays comprehensive farm information with tabs for related entities
 */

import { useIncidents } from "@/entities/incident";
import { useMyWarehouses, useOnHandList, type OnHandRow, type Warehouse } from "@/entities/inventory";
import { usePlotsByFarm } from "@/entities/plot";
import { useSeasons, type SeasonStatus } from "@/entities/season";
import { usePreferences } from "@/shared/contexts";
import { convertWeight, formatWeight, getWeightUnitLabel } from "@/shared/lib";
import {
    BackButton,
    Badge,
    Button,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/ui";
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Loader2,
    Package,
    RefreshCw,
    Sprout
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFarmDetail } from "../hooks/useFarmDetail";
import { CreatePlotInFarmDialog } from "../ui/CreatePlotInFarmDialog";
import { FarmDeleteDialog } from "../ui/FarmDeleteDialog";
import { FarmFormDialog } from "../ui/FarmFormDialog";
import { FarmInfoCard } from "../ui/FarmInfoCard";
import { FarmPlotsTable } from "../ui/FarmPlotsTable";

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
  const { preferences } = usePreferences();
  const unitLabel = getWeightUnitLabel(preferences.weightUnit);
  const formatYieldValue = (valueKg?: number | null) => {
    if (valueKg == null) return "-";
    const converted = convertWeight(valueKg, preferences.weightUnit);
    const maximumFractionDigits = preferences.weightUnit === "G" ? 0 : 2;
    return new Intl.NumberFormat(preferences.locale, {
      maximumFractionDigits,
    }).format(converted);
  };

  // State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createPlotDialogOpen, setCreatePlotDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [seasonSearch, setSeasonSearch] = useState("");
  const [seasonStatusFilter, setSeasonStatusFilter] = useState<
    SeasonStatus | "all"
  >("all");
  const [seasonPlotFilter, setSeasonPlotFilter] = useState<"all" | number>(
    "all",
  );

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
  } = useSeasons({ farmId, page: 0, size: 100 }, { enabled: farmId > 0 });

  // Fetch warehouses for this farm (for Stock tab)
  const {
    data: warehousesData,
    isLoading: isLoadingWarehouses,
    refetch: refetchWarehouses,
  } = useMyWarehouses();

  // Filter warehouses for this farm
  const farmWarehouses = useMemo(() => {
    return (warehousesData ?? []).filter((w) => w.farmId === farmId);
  }, [warehousesData, farmId]);

  // Stock tab state
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);

  // Set default warehouse when data loads
  useEffect(() => {
    if (farmWarehouses.length > 0 && selectedWarehouseId === null) {
      setSelectedWarehouseId(farmWarehouses[0].id);
    }
  }, [farmWarehouses, selectedWarehouseId]);

  // Fetch on-hand inventory for selected warehouse
  const {
    data: onHandData,
    isLoading: isLoadingOnHand,
    isError: isOnHandError,
    refetch: refetchOnHand,
  } = useOnHandList(
    selectedWarehouseId ? { warehouseId: selectedWarehouseId, page: 0, size: 100 } : undefined
  );

  // Handlers
  const handleBack = () => {
    navigate("/farmer/farms");
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
    toast.success("Farm deleted successfully");
    navigate("/farmer/farms");
  };

  const handleCreatePlot = () => {
    if (!farm?.active) {
      toast.error("This farm is inactive. Activate it to create plots.");
      return;
    }
    setActiveTab("plots");
    setCreatePlotDialogOpen(true);
  };

  useEffect(() => {
    const state = location.state as { openCreatePlot?: boolean } | null;
    if (state?.openCreatePlot && farm) {
      setActiveTab("plots");
      if (farm.active) {
        setCreatePlotDialogOpen(true);
      } else {
        toast.error("This farm is inactive. Activate it to create plots.");
      }
      navigate(`/farmer/farms/${farmId}`, { replace: true });
    }
  }, [location.state, farm, farmId, navigate]);

  // Derived data
  const plots = plotsData?.items ?? [];
  const plotNameById = useMemo(
    () => new Map(plots.map((plot) => [plot.id, plot.plotName])),
    [plots],
  );
  const totalPlotArea = plots.reduce((sum, plot) => sum + (plot.area ?? 0), 0);
  const totalPlotAreaLabel =
    totalPlotArea > 0 ? `${totalPlotArea.toFixed(2)} ha` : "-";
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
        case "ACTIVE":
          summary.active += 1;
          break;
        case "COMPLETED":
          summary.completed += 1;
          break;
        case "CANCELLED":
          summary.cancelled += 1;
          break;
        case "ARCHIVED":
          summary.archived += 1;
          break;
        case "PLANNED":
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
      if (
        seasonStatusFilter !== "all" &&
        season.status !== seasonStatusFilter
      ) {
        return false;
      }
      if (seasonPlotFilter !== "all" && season.plotId !== seasonPlotFilter) {
        return false;
      }
      if (!searchValue) {
        return true;
      }

      const plotLabel =
        season.plotName ?? plotNameById.get(season.plotId) ?? "";
      const cropLabel = season.cropName ?? `Crop #${season.cropId}`;
      const varietyLabel = season.varietyName ?? "";
      const haystack =
        `${season.seasonName} ${plotLabel} ${cropLabel} ${varietyLabel}`.toLowerCase();

      return haystack.includes(searchValue);
    });
  }, [
    seasons,
    seasonSearch,
    seasonStatusFilter,
    seasonPlotFilter,
    plotNameById,
  ]);

  const expectedYieldLabel =
    seasonSummary.expectedYieldTotal > 0
      ? formatWeight(
          seasonSummary.expectedYieldTotal,
          preferences.weightUnit,
          preferences.locale,
        )
      : "-";
  const upcomingHarvestLabel = upcomingHarvest
    ? formatSeasonDate(upcomingHarvest)
    : "-";

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
                {error?.message ||
                  "The farm you are looking for does not exist or has been deleted."}
              </p>
              <BackButton to="/farmer/farms" label="Quay về Trang trại" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        {/* Navigation Header Card */}
        <div className="mb-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm">
              <a 
                href="/farmer/farms" 
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                My Farms
              </a>
              <span className="text-muted-foreground/50">/</span>
              <span className="text-foreground font-semibold">{farm.name}</span>
            </nav>
            
            {/* Back button */}
            <BackButton to="/farmer/farms" label="Quay về Trang trại" />
          </div>
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
            <TabsTrigger value="info" className="flex-none px-3">
              Overview
            </TabsTrigger>
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
            <TabsTrigger value="stock" className="flex-none px-3">
              Stock
            </TabsTrigger>
            <TabsTrigger value="incidents" className="flex-none px-3">
              Incidents
            </TabsTrigger>
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
                    {farm.area != null ? `${farm.area} ha` : "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-base font-medium">
                    {farm.wardName && farm.provinceName
                      ? `${farm.wardName}, ${farm.provinceName}`
                      : farm.provinceName || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    <Badge variant={farm.active ? "default" : "secondary"}>
                      {farm.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Plots</p>
                  <p className="text-base font-medium font-mono">
                    {plots.length}
                  </p>
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
                  <h3 className="text-lg font-semibold">
                    Plots in {farm.name}
                  </h3>
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
                        Activate this farm to create new plots or seasons. You
                        can still view existing plots.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Plots table */}
              <FarmPlotsTable plots={plots} isLoading={isLoadingPlots} />
            </div>
          </TabsContent>

          {/* Seasons Tab */}
          <TabsContent value="seasons">
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold">
                      Seasons in {farm.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Track planting cycles, progress, and harvest timelines
                    across plots
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
                  <Button size="sm" onClick={() => navigate("/farmer/seasons")}>
                    Manage Seasons
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-gray-200 bg-card p-4">
                  <p className="text-xs text-gray-500">Total seasons</p>
                  <p className="text-2xl font-semibold">
                    {seasonSummary.total}
                  </p>
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
                    {seasonSummary.cancelled + seasonSummary.archived} archived
                    or cancelled
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-card p-4">
                  <p className="text-xs text-gray-500">Upcoming harvest</p>
                  <p className="text-2xl font-semibold">
                    {upcomingHarvestLabel}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Based on planned harvest dates
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-card p-4">
                  <p className="text-xs text-gray-500">Expected yield</p>
                  <p className="text-2xl font-semibold font-mono">
                    {expectedYieldLabel}
                  </p>
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
                        value === "all" ? "all" : (value as SeasonStatus),
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
                    value={
                      seasonPlotFilter === "all"
                        ? "all"
                        : seasonPlotFilter.toString()
                    }
                    onValueChange={(value) =>
                      setSeasonPlotFilter(
                        value === "all" ? "all" : parseInt(value, 10),
                      )
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
                        Activate this farm to create new seasons. You can still
                        view existing seasons.
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
                        <TableHead className="text-right">
                          Yield ({unitLabel})
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3].map((row) => (
                        <TableRow key={row}>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-28" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-20" />
                          </TableCell>
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
                        {seasonsError?.message ||
                          "Please try again in a moment."}
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
                      ? "No seasons yet"
                      : "No seasons match your filters"}
                  </h3>
                  <p>
                    {seasons.length === 0
                      ? "Create a season to start tracking crop cycles for this farm."
                      : "Try adjusting the search or filters to find seasons."}
                  </p>
                  {seasons.length === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => navigate("/farmer/seasons")}
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
                        <TableHead className="text-right">
                          Yield ({unitLabel})
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSeasons.map((season) => {
                        const plotLabel =
                          season.plotName ??
                          plotNameById.get(season.plotId) ??
                          `Plot #${season.plotId}`;
                        const cropLabel =
                          season.cropName ?? `Crop #${season.cropId}`;
                        const varietyLabel =
                          season.varietyName ??
                          (season.varietyId
                            ? `Variety #${season.varietyId}`
                            : "");
                        const harvestDate =
                          season.plannedHarvestDate ?? season.endDate;
                        const yieldValue =
                          season.actualYieldKg ?? season.expectedYieldKg;

                        return (
                          <TableRow
                            key={season.id}
                            className="hover:bg-gray-50"
                          >
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
                              <Badge
                                variant={getSeasonStatusVariant(season.status)}
                              >
                                {getSeasonStatusLabel(season.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatYieldValue(yieldValue)}
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
            <FarmStockTab
              farmId={farmId}
              farmWarehouses={farmWarehouses}
              selectedWarehouseId={selectedWarehouseId}
              onWarehouseChange={setSelectedWarehouseId}
              onHandItems={onHandData?.items ?? []}
              isLoadingWarehouses={isLoadingWarehouses}
              isLoadingOnHand={isLoadingOnHand}
              isOnHandError={isOnHandError}
              onRefresh={() => {
                refetchWarehouses();
                refetchOnHand();
              }}
            />
          </TabsContent>

          {/* Incidents Tab */}
          <TabsContent value="incidents">
            <FarmIncidentsTab
              farmId={farmId}
              seasons={seasons}
              plotNameById={plotNameById}
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
  status?: SeasonStatus,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "COMPLETED":
      return "secondary";
    case "CANCELLED":
      return "destructive";
    case "ARCHIVED":
      return "secondary";
    case "PLANNED":
    default:
      return "outline";
  }
}

function getSeasonStatusLabel(status?: SeasonStatus) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    case "ARCHIVED":
      return "Archived";
    case "PLANNED":
      return "Planned";
    default:
      return "Unknown";
  }
}

function formatSeasonDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
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
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{description}</p>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Coming Soon</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FARM STOCK TAB COMPONENT
// ═══════════════════════════════════════════════════════════════

interface FarmStockTabProps {
  farmId: number;
  farmWarehouses: Warehouse[];
  selectedWarehouseId: number | null;
  onWarehouseChange: (warehouseId: number | null) => void;
  onHandItems: OnHandRow[];
  isLoadingWarehouses: boolean;
  isLoadingOnHand: boolean;
  isOnHandError: boolean;
  onRefresh: () => void;
}

function FarmStockTab({
  farmId,
  farmWarehouses,
  selectedWarehouseId,
  onWarehouseChange,
  onHandItems,
  isLoadingWarehouses,
  isLoadingOnHand,
  isOnHandError,
  onRefresh,
}: FarmStockTabProps) {
  const navigate = useNavigate();

  // Stock summary
  const stockSummary = useMemo(() => {
    const summary = {
      totalItems: onHandItems.length,
      totalQuantity: 0,
      lowStock: 0,
      expiringSoon: 0,
    };

    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    onHandItems.forEach((item) => {
      summary.totalQuantity += item.onHandQuantity;
      
      // Consider low stock if quantity < 10
      if (item.onHandQuantity < 10) {
        summary.lowStock += 1;
      }
      
      // Check expiring soon (within 30 days)
      if (item.expiryDate) {
        const expiryTime = Date.parse(item.expiryDate);
        if (!Number.isNaN(expiryTime) && expiryTime - now <= thirtyDays && expiryTime > now) {
          summary.expiringSoon += 1;
        }
      }
    });

    return summary;
  }, [onHandItems]);

  // No warehouses for this farm
  if (!isLoadingWarehouses && farmWarehouses.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold">Stock Management</h3>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-dashed p-10 text-center">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Warehouse Found</h3>
            <p className="text-gray-500 mb-6">
              This farm doesn't have any warehouses yet. Create a warehouse in the Inventory page to start tracking stock.
            </p>
            <Button onClick={() => navigate("/farmer/inventory")}>
              Go to Inventory
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold">Stock Management</h3>
          </div>
          <p className="text-sm text-gray-500">
            Track inventory and supplies across farm warehouses
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoadingOnHand}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingOnHand ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => navigate("/farmer/inventory")}>
            Manage Inventory
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-card p-4">
          <p className="text-xs text-gray-500">Warehouses</p>
          <p className="text-2xl font-semibold">{farmWarehouses.length}</p>
          <p className="mt-1 text-xs text-gray-500">linked to this farm</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-card p-4">
          <p className="text-xs text-gray-500">Stock Items</p>
          <p className="text-2xl font-semibold">{stockSummary.totalItems}</p>
          <p className="mt-1 text-xs text-gray-500">unique supply lots</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-card p-4">
          <p className="text-xs text-gray-500">Low Stock</p>
          <p className="text-2xl font-semibold text-amber-600">{stockSummary.lowStock}</p>
          <p className="mt-1 text-xs text-gray-500">items below threshold</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-card p-4">
          <p className="text-xs text-gray-500">Expiring Soon</p>
          <p className="text-2xl font-semibold text-red-600">{stockSummary.expiringSoon}</p>
          <p className="mt-1 text-xs text-gray-500">within 30 days</p>
        </div>
      </div>

      {/* Warehouse Selector */}
      <div className="rounded-lg border border-gray-200 bg-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <Select
            value={selectedWarehouseId?.toString() ?? ""}
            onValueChange={(value) => onWarehouseChange(value ? parseInt(value, 10) : null)}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a warehouse" />
            </SelectTrigger>
            <SelectContent>
              {farmWarehouses.map((warehouse) => (
                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-gray-500">
            Showing {onHandItems.length} items in selected warehouse
          </div>
        </div>
      </div>

      {/* Stock Table */}
      {isLoadingWarehouses || isLoadingOnHand ? (
        <div className="rounded-lg border border-gray-200 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Batch Code</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((row) => (
                <TableRow key={row}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : isOnHandError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Failed to load stock data</h4>
              <p className="text-sm text-red-700 mt-1">Please try again in a moment.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={onRefresh}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      ) : onHandItems.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No stock items</h3>
          <p>This warehouse is currently empty. Add supplies to start tracking inventory.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/farmer/inventory")}>
            Add Stock
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Batch Code</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {onHandItems.map((item, index) => {
                const isLowStock = item.onHandQuantity < 10;
                const isExpiringSoon = item.expiryDate && (() => {
                  const now = Date.now();
                  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
                  const expiryTime = Date.parse(item.expiryDate);
                  return !Number.isNaN(expiryTime) && expiryTime - now <= thirtyDays && expiryTime > now;
                })();
                const isExpired = item.expiryDate && (() => {
                  const expiryTime = Date.parse(item.expiryDate);
                  return !Number.isNaN(expiryTime) && expiryTime < Date.now();
                })();

                return (
                  <TableRow key={`${item.supplyLotId}-${index}`} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {item.supplyItemName ?? `Lot #${item.supplyLotId}`}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {item.batchCode ?? "-"}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {item.locationLabel ?? "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span className={isLowStock ? "text-amber-600 font-semibold" : ""}>
                        {item.onHandQuantity}
                      </span>
                      {item.unit && <span className="text-gray-500 ml-1">{item.unit}</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        item.lotStatus === "GOOD" ? "default" :
                        item.lotStatus === "DAMAGED" ? "destructive" :
                        item.lotStatus === "EXPIRED" ? "destructive" : "secondary"
                      }>
                        {item.lotStatus ?? "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.expiryDate ? (
                        <span className={
                          isExpired ? "text-red-600 font-medium" :
                          isExpiringSoon ? "text-amber-600" : "text-gray-600"
                        }>
                          {formatSeasonDate(item.expiryDate)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FARM INCIDENTS TAB COMPONENT
// ═══════════════════════════════════════════════════════════════

interface FarmIncidentsTabProps {
  farmId: number;
  seasons: Array<{ id: number; seasonName: string; plotId?: number }>;
  plotNameById: Map<number | string, string>;
}

function FarmIncidentsTab({ farmId, seasons, plotNameById }: FarmIncidentsTabProps) {
  const navigate = useNavigate();
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);

  // Set default season when data loads
  useEffect(() => {
    if (seasons.length > 0 && selectedSeasonId === null) {
      setSelectedSeasonId(seasons[0].id);
    }
  }, [seasons, selectedSeasonId]);

  // Fetch incidents for selected season
  const {
    data: incidentsData,
    isLoading: isLoadingIncidents,
    isError: isIncidentsError,
    refetch: refetchIncidents,
  } = useIncidents(
    { seasonId: selectedSeasonId ?? 0, page: 0, size: 100 },
    { enabled: (selectedSeasonId ?? 0) > 0 }
  );

  const incidents = incidentsData?.items ?? [];

  // Incidents summary
  const incidentsSummary = useMemo(() => {
    const summary = {
      total: incidents.length,
      open: 0,
      inProgress: 0,
      resolved: 0,
      cancelled: 0,
      highSeverity: 0,
    };

    incidents.forEach((incident) => {
      switch (incident.status?.toUpperCase()) {
        case "OPEN":
          summary.open += 1;
          break;
        case "IN_PROGRESS":
          summary.inProgress += 1;
          break;
        case "RESOLVED":
          summary.resolved += 1;
          break;
        case "CANCELLED":
          summary.cancelled += 1;
          break;
      }
      if (incident.severity?.toUpperCase() === "HIGH") {
        summary.highSeverity += 1;
      }
    });

    return summary;
  }, [incidents]);

  // No seasons for this farm
  if (seasons.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-semibold">Incidents Tracking</h3>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-dashed p-10 text-center">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
              <AlertTriangle className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Seasons Found</h3>
            <p className="text-gray-500 mb-6">
              Incidents are tracked per season. Create a season for this farm to start tracking incidents.
            </p>
            <Button onClick={() => navigate("/farmer/seasons")}>
              Create Season
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-semibold">Incidents Tracking</h3>
          </div>
          <p className="text-sm text-gray-500">
            Track and manage incidents across seasons in this farm
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchIncidents()}
            disabled={isLoadingIncidents}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingIncidents ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => navigate("/farmer/incidents")}>
            Manage Incidents
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border border-gray-200 bg-card p-4">
          <p className="text-xs text-gray-500">Total Incidents</p>
          <p className="text-2xl font-semibold">{incidentsSummary.total}</p>
          <p className="mt-1 text-xs text-gray-500">in selected season</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-card p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-xs text-gray-500">Open</p>
          </div>
          <p className="text-2xl font-semibold text-red-600">{incidentsSummary.open}</p>
          <p className="mt-1 text-xs text-gray-500">need attention</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-card p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <p className="text-xs text-gray-500">In Progress</p>
          </div>
          <p className="text-2xl font-semibold text-blue-600">{incidentsSummary.inProgress}</p>
          <p className="mt-1 text-xs text-gray-500">being handled</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-card p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <p className="text-xs text-gray-500">Resolved</p>
          </div>
          <p className="text-2xl font-semibold text-green-600">{incidentsSummary.resolved}</p>
          <p className="mt-1 text-xs text-gray-500">completed</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-card p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <p className="text-xs text-gray-500">High Severity</p>
          </div>
          <p className="text-2xl font-semibold text-amber-600">{incidentsSummary.highSeverity}</p>
          <p className="mt-1 text-xs text-gray-500">critical issues</p>
        </div>
      </div>

      {/* Season Selector */}
      <div className="rounded-lg border border-gray-200 bg-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <Select
            value={selectedSeasonId?.toString() ?? ""}
            onValueChange={(value) => setSelectedSeasonId(value ? parseInt(value, 10) : null)}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season.id} value={season.id.toString()}>
                  {season.seasonName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-gray-500">
            Showing {incidents.length} incidents in selected season
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      {isLoadingIncidents ? (
        <div className="rounded-lg border border-gray-200 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead>Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((row) => (
                <TableRow key={row}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : isIncidentsError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Failed to load incidents</h4>
              <p className="text-sm text-red-700 mt-1">Please try again in a moment.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => refetchIncidents()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      ) : incidents.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
          <div className="flex flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No incidents reported</h3>
            <p>This season has no recorded incidents. Great job!</p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead>Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.incidentId} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {formatIncidentType(incident.incidentType)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-gray-600">
                    {incident.description ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityVariant(incident.severity)}>
                      {incident.severity ?? "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getIncidentStatusVariant(incident.status)}>
                      {formatIncidentStatus(incident.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatSeasonDate(incident.createdAt)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {incident.deadline ? formatSeasonDate(incident.deadline) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// Helper functions for incidents
function formatIncidentType(type: string): string {
  const typeMap: Record<string, string> = {
    PEST_OUTBREAK: "Pest Outbreak",
    DISEASE: "Disease",
    EQUIPMENT_FAILURE: "Equipment Failure",
    WEATHER_DAMAGE: "Weather Damage",
    SAFETY: "Safety",
    OTHER: "Other",
  };
  return typeMap[type] ?? type;
}

function formatIncidentStatus(status?: string | null): string {
  if (!status) return "Unknown";
  const statusMap: Record<string, string> = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    CANCELLED: "Cancelled",
  };
  return statusMap[status.toUpperCase()] ?? status;
}

function getSeverityVariant(severity?: string | null): "default" | "secondary" | "destructive" | "outline" {
  switch (severity?.toUpperCase()) {
    case "HIGH":
      return "destructive";
    case "MEDIUM":
      return "default";
    case "LOW":
      return "secondary";
    default:
      return "outline";
  }
}

function getIncidentStatusVariant(status?: string | null): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toUpperCase()) {
    case "OPEN":
      return "destructive";
    case "IN_PROGRESS":
      return "default";
    case "RESOLVED":
      return "secondary";
    case "CANCELLED":
      return "outline";
    default:
      return "outline";
  }
}
