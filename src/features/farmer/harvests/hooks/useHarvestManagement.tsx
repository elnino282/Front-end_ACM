import { useState, useMemo, useCallback } from "react";
import { Package, CheckCircle2, Clock, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  useAllFarmerHarvests,
  useCreateHarvest,
  useDeleteHarvest,
  type Harvest as ApiHarvest,
} from "@/entities/harvest";
import { useOptionalSeason, useWeightUnit } from "@/shared/contexts";
import { convertWeightToKg, formatWeight } from "@/shared/lib";
import type {
  HarvestBatch,
  HarvestFormData,
  HarvestGrade,
  HarvestStatus,
  ChartDataPoint,
  SummaryStats,
} from "../types";
import {
  GRADE_DISTRIBUTION_COLORS,
  GRADE_POINTS_MAP,
  PLANNED_YIELD,
} from "../constants";

const INITIAL_FORM_DATA: HarvestFormData = {
  batchId: "",
  date: "",
  quantity: "",
  grade: "A",
  moisture: "",
  season: "",
  plot: "",
  crop: "",
  status: "stored",
  notes: "",
  purity: "",
  foreignMatter: "",
  brokenGrains: "",
};

const transformApiToFeature = (h: ApiHarvest): HarvestBatch => ({
  id: String(h.id),
  batchId: `BATCH-${h.id}`,
  date: h.harvestDate,
  createdAt: h.createdAt ?? undefined,
  quantity: h.quantity,
  grade: (h.grade as HarvestBatch["grade"]) ?? "A",
  moisture: 12.0,
  status: "stored",
  season: String(h.seasonId),
  plot: "Plot A",
  crop: "Crop",
  notes: h.note ?? undefined,
});

export function useHarvestManagement() {
  const seasonContext = useOptionalSeason();
  const weightUnit = useWeightUnit();

  // selectedSeason can be "all" or a season ID string
  const [selectedSeason, setSelectedSeason] = useState<string>("all");
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<HarvestBatch | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<HarvestFormData>(INITIAL_FORM_DATA);

  // Determine the seasonId to use for API calls:
  // 1. If a specific season is selected from dropdown (not "all"), use that
  // 2. Otherwise fallback to context's selectedSeasonId
  // 3. Default to undefined (fetch all) if neither available
  const effectiveSeasonId = useMemo((): number | undefined => {
    if (selectedSeason !== "all") {
      const parsed = parseInt(selectedSeason, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return seasonContext?.selectedSeasonId ?? undefined;
  }, [selectedSeason, seasonContext?.selectedSeasonId]);

  // Fetch harvests: use useAllFarmerHarvests which supports optional seasonId filter
  const harvestParams = useMemo(
    () => ({
      page: 0,
      size: 100,
      ...(effectiveSeasonId ? { seasonId: effectiveSeasonId } : {}),
    }),
    [effectiveSeasonId]
  );

  const {
    data: apiData,
    isLoading: apiLoading,
    error: apiError,
    refetch,
  } = useAllFarmerHarvests(harvestParams);

  // For mutations, we need a valid seasonId (use 0 as fallback which will be checked before mutating)
  const mutationSeasonId = effectiveSeasonId ?? 0;

  // Define resetForm before it's used in mutation callbacks
  const resetForm = useCallback(() => setFormData(INITIAL_FORM_DATA), []);

  const createMutation = useCreateHarvest(mutationSeasonId, {
    onSuccess: () => {
      toast.success("Harvest Added");
      setIsAddBatchOpen(false);
      resetForm();
    },
    onError: (err) => toast.error("Failed", { description: err.message }),
  });
  const deleteMutation = useDeleteHarvest(mutationSeasonId, {
    onSuccess: () => toast.success("Batch Deleted"),
    onError: (err) =>
      toast.error("Failed to delete", { description: err.message }),
  });

  // No mock fallback - return empty array when no API data
  const batches = useMemo(() => {
    return apiData?.items?.map(transformApiToFeature) ?? [];
  }, [apiData]);

  const isLoading = apiLoading;
  const error = apiError;

  // When "all" is selected, show all batches; otherwise they're already filtered by API
  const filteredBatches = batches;
  const totalHarvested = useMemo(
    () => filteredBatches.reduce((sum, b) => sum + b.quantity, 0),
    [filteredBatches]
  );
  const lotsCount = filteredBatches.length;
  const avgGrade = useMemo(() => {
    if (batches.length === 0) return "N/A";
    const avg =
      batches.reduce((sum, b) => sum + GRADE_POINTS_MAP[b.grade], 0) /
      batches.length;
    return avg >= 3.5 ? "Premium" : avg >= 2.5 ? "A" : avg >= 1.5 ? "B" : "C";
  }, [batches]);
  const avgMoisture = useMemo(
    () =>
      lotsCount === 0
        ? "0.0"
        : (
            filteredBatches.reduce((s, b) => s + b.moisture, 0) / lotsCount
          ).toFixed(1),
    [filteredBatches, lotsCount]
  );
  const yieldVsPlan = useMemo(
    () => ((totalHarvested / PLANNED_YIELD) * 100).toFixed(1),
    [totalHarvested]
  );
  const dailyTrend: ChartDataPoint[] = useMemo(() => {
    // Group harvest batches by date and sum quantities
    const dateMap: Record<string, number> = {};
    filteredBatches.forEach((b) => {
      if (b.date) {
        // Format date to a display format e.g. "Nov 4"
        const dateObj = new Date(b.date);
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        dateMap[formattedDate] = (dateMap[formattedDate] || 0) + b.quantity;
      }
    });
    // Convert to chart data array sorted by date
    return Object.entries(dateMap)
      .map(([date, quantity]) => ({ date, quantity }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredBatches]);
  const gradeDistribution: ChartDataPoint[] = useMemo(
    () =>
      [
        {
          name: "Premium",
          value: batches.filter((b) => b.grade === "Premium").length,
          color: GRADE_DISTRIBUTION_COLORS["Premium"],
        },
        {
          name: "Grade A",
          value: batches.filter((b) => b.grade === "A").length,
          color: GRADE_DISTRIBUTION_COLORS["Grade A"],
        },
        {
          name: "Grade B",
          value: batches.filter((b) => b.grade === "B").length,
          color: GRADE_DISTRIBUTION_COLORS["Grade B"],
        },
        {
          name: "Grade C",
          value: batches.filter((b) => b.grade === "C").length,
          color: GRADE_DISTRIBUTION_COLORS["Grade C"],
        },
      ].filter((i) => i.value > 0),
    [batches]
  );
  const summaryStats: SummaryStats = useMemo(
    () => ({
      totalStored: batches
        .filter((b) => b.status === "stored")
        .reduce((s, b) => s + b.quantity, 0),
      totalSold: batches
        .filter((b) => b.status === "sold")
        .reduce((s, b) => s + b.quantity, 0),
      totalProcessing: batches
        .filter((b) => b.status === "processing")
        .reduce((s, b) => s + b.quantity, 0),
      premiumGradePercentage:
        batches.length > 0
          ? (batches.filter((b) => b.grade === "Premium").length /
              batches.length) *
            100
          : 0,
    }),
    [batches]
  );

  function getStatusBadge(status: HarvestStatus) {
    const badges: Record<HarvestStatus, JSX.Element> = {
      stored: (
        <Badge className="bg-secondary/10 text-secondary border-secondary/20">
          <Package className="w-3 h-3 mr-1" />
          Stored
        </Badge>
      ),
      sold: (
        <Badge className="bg-primary/10 text-primary border-primary/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Sold
        </Badge>
      ),
      processing: (
        <Badge className="bg-accent/10 text-foreground border-accent/20">
          <Clock className="w-3 h-3 mr-1" />
          Processing
        </Badge>
      ),
    };
    return badges[status] ?? null;
  }
  function getGradeBadge(grade: HarvestGrade) {
    const c: Record<HarvestGrade, string> = {
      Premium: "bg-primary/10 text-primary border-primary/20",
      A: "bg-secondary/10 text-secondary border-secondary/20",
      B: "bg-accent/10 text-foreground border-accent/20",
      C: "bg-muted/30 text-muted-foreground border-border",
    };
    return (
      <Badge className={c[grade]}>
        <Award className="w-3 h-3 mr-1" />
        {grade}
      </Badge>
    );
  }

  const handleAddBatch = useCallback(() => {
    if (
      !formData.batchId ||
      !formData.date ||
      !formData.quantity ||
      !formData.moisture
    ) {
      toast.error("Missing Fields");
      return;
    }
    const quantityDisplay = Number(formData.quantity);
    if (!Number.isFinite(quantityDisplay) || quantityDisplay <= 0) {
      toast.error("Invalid quantity");
      return;
    }
    const quantityKg = convertWeightToKg(quantityDisplay, weightUnit);
    if (mutationSeasonId > 0) {
      createMutation.mutate({
        harvestDate: formData.date,
        quantity: quantityKg,
        unit: 1,
        grade: formData.grade,
        note: formData.notes,
      });
    } else {
      toast.success("Harvest Added", {
        description: `${formData.batchId} - ${formatWeight(
          quantityKg,
          weightUnit
        )}`,
      });
      setIsAddBatchOpen(false);
      resetForm();
    }
  }, [
    formData,
    mutationSeasonId,
    createMutation,
    weightUnit,
    resetForm,
    setIsAddBatchOpen,
  ]);

  const handleDeleteBatch = useCallback(
    (id: string) => {
      const numId = parseInt(id, 10);
      if (!isNaN(numId) && mutationSeasonId > 0) deleteMutation.mutate(numId);
      else toast.success("Batch Deleted");
    },
    [mutationSeasonId, deleteMutation]
  );

  // resetForm is now defined earlier (before createMutation)
  const handleViewDetails = useCallback((batch: HarvestBatch) => {
    setSelectedBatch(batch);
    setIsDetailsDrawerOpen(true);
  }, []);
  const handleQuickAction = useCallback((action: string) => {
    const msgs: Record<string, [string, string]> = {
      qr: ["Generating QR", "Ready shortly"],
      qc: ["Record QC", "Opening..."],
      sale: ["Link Sale", "Opening..."],
      handover: ["Printing", "Preparing..."],
      weight: ["Scale Reading", "Opening..."],
    };
    const m = msgs[action];
    if (m) toast.success(m[0], { description: m[1] });
  }, []);
  const handleExport = useCallback(() => toast.success("Exporting to CSV"), []);
  const handlePrint = useCallback(() => toast.success("Printing Summary"), []);

  return {
    effectiveSeasonId,
    hasSeasonContext: !!seasonContext,
    selectedSeason,
    setSelectedSeason,
    isAddBatchOpen,
    setIsAddBatchOpen,
    selectedBatch,
    setSelectedBatch,
    isDetailsDrawerOpen,
    setIsDetailsDrawerOpen,
    batches,
    formData,
    setFormData,
    isLoading,
    error: error ?? null,
    refetch,
    filteredBatches,
    totalHarvested,
    lotsCount,
    avgGrade,
    avgMoisture,
    yieldVsPlan,
    dailyTrend,
    gradeDistribution,
    summaryStats,
    getStatusBadge,
    getGradeBadge,
    handleAddBatch,
    handleDeleteBatch,
    resetForm,
    handleViewDetails,
    handleQuickAction,
    handleExport,
    handlePrint,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
