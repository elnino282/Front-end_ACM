import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useHarvestManagement } from "./hooks/useHarvestManagement";
import { HarvestHeader } from "./components/HarvestHeader";
import { HarvestKPICards } from "./components/HarvestKPICards";
import { HarvestTable } from "./components/HarvestTable";
import { HarvestCharts } from "./components/HarvestCharts";
import { QuickActionsPanel } from "./components/QuickActionsPanel";
import { AddBatchDialog } from "./components/AddBatchDialog";
import { HarvestDetailsDrawer } from "./components/HarvestDetailsDrawer";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSeasons } from "@/entities/season";

interface HarvestModuleProps {
  seasonId: string | number;
}

export function HarvestModule({ seasonId }: HarvestModuleProps) {
  const explicitSeasonId = Number(seasonId);

  // Fetch real seasons from API
  const { data: seasonsData } = useSeasons();
  const seasonOptions = useMemo(() => {
    const options = [{ value: "all", label: "All Seasons" }];
    if (seasonsData?.items) {
      seasonsData.items.forEach((season) => {
        options.push({
          value: String(season.id),
          label: season.seasonName,
        });
      });
    }
    return options;
  }, [seasonsData]);

  const {
    // State
    selectedSeason,
    setSelectedSeason,
    isAddBatchOpen,
    setIsAddBatchOpen,
    selectedBatch,
    isDetailsDrawerOpen,
    setIsDetailsDrawerOpen,
    batches,
    formData,
    setFormData,

    // Computed values
    filteredBatches,
    totalHarvested,
    lotsCount,
    avgGrade,
    avgMoisture,
    yieldVsPlan,
    dailyTrend,
    gradeDistribution,
    summaryStats,

    // Utilities
    getStatusBadge,
    getGradeBadge,

    // Handlers
    handleAddBatch,
    handleDeleteBatch,
    resetForm,
    handleViewDetails,
    handleQuickAction,
    handleExport,
    handlePrint,
  } = useHarvestManagement(explicitSeasonId); // Assume hook accepts default/explicit seasonId or we scope locally

  const [searchQuery, setSearchQuery] = useState("");
  const filteredBySearch = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    // Explicitly scope by seasonId here
    let scopedBatches = filteredBatches;
    if (Number.isFinite(explicitSeasonId)) {
      scopedBatches = scopedBatches.filter(b => b.season === String(explicitSeasonId));
    }

    if (!normalizedQuery) return scopedBatches;

    return scopedBatches.filter((batch) => {
      const haystack = [
        batch.batchId,
        batch.crop,
        batch.plot,
        batch.season,
        batch.grade,
        batch.status,
        batch.linkedSale ?? "",
        batch.notes ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [filteredBatches, searchQuery, explicitSeasonId]);

  const handleDrawerAction = (action: string, batch: typeof selectedBatch) => {
    if (!batch) return;

    if (action === "qr") {
      toast.success("Generating QR Code", {
        description: `QR for ${batch.batchId}`,
      });
    } else if (action === "handover") {
      toast.success("Printing Handover Note", {
        description: `For batch ${batch.batchId}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <HarvestHeader
        onAddBatch={() => {
          resetForm();
          setIsAddBatchOpen(true);
        }}
        isEmbedded={true}
      />

      <Card className="mb-6 border border-border rounded-xl shadow-sm">
        <CardContent className="px-6 py-4">
          <div className="flex flex-wrap items-center justify-start gap-4">
            <div className="relative w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search batches..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10 rounded-xl border-border focus:border-primary"
              />
            </div>
            {/* Omit season selector if forced to one season, or keep disabled */}
            {!Number.isFinite(explicitSeasonId) && (
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger className="rounded-xl border-border w-[180px]">
                  <SelectValue placeholder="All Seasons" />
                </SelectTrigger>
                <SelectContent>
                  {seasonOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      <HarvestKPICards
        totalHarvested={totalHarvested}
        lotsCount={lotsCount}
        avgGrade={avgGrade}
        avgMoisture={avgMoisture}
        yieldVsPlan={yieldVsPlan}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <HarvestTable
            batches={filteredBySearch}
            totalBatches={filteredBySearch.length}
            onViewDetails={handleViewDetails}
            onDeleteBatch={handleDeleteBatch}
            onExport={handleExport}
            onPrint={handlePrint}
            getStatusBadge={getStatusBadge}
            getGradeBadge={getGradeBadge}
          />

          <HarvestCharts
            dailyTrend={dailyTrend}
            gradeDistribution={gradeDistribution}
          />
        </div>

        <QuickActionsPanel
          onQuickAction={handleQuickAction}
          summaryStats={summaryStats}
        />
      </div>

      <AddBatchDialog
        open={isAddBatchOpen}
        onOpenChange={setIsAddBatchOpen}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleAddBatch}
        onCancel={() => {
          setIsAddBatchOpen(false);
          resetForm();
        }}
        defaultSeasonId={explicitSeasonId}
      />

      <HarvestDetailsDrawer
        batch={selectedBatch}
        open={isDetailsDrawerOpen}
        onOpenChange={setIsDetailsDrawerOpen}
        onAction={handleDrawerAction}
        getStatusBadge={getStatusBadge}
        getGradeBadge={getGradeBadge}
      />
    </div>
  );
}
