import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCrops } from "@/entities/crop";
import { useFarms } from "@/entities/farm";
import { usePlotsByFarm } from "@/entities/plot";
import type { SeasonCreateRequest } from "@/entities/season";
import { useVarietiesByCrop } from "@/entities/variety";
import { usePreferences } from "@/shared/contexts";
import { convertWeightToKg, getWeightUnitLabel } from "@/shared/lib";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui";
import { Calendar, Check } from "lucide-react";
import { useEffect, useState } from "react";

interface NewSeasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SeasonCreateRequest) => void;
  isSubmitting?: boolean;
}

/**
 * NewSeasonDialog Component
 *
 * Dialog for creating a new growing season matching backend API structure.
 *
 * Backend expects (POST /api/v1/seasons):
 * - plotId: number (required) - ID of the plot where the season will be planted
 * - cropId: number (required) - ID of the crop type
 * - varietyId: number (optional) - ID of the specific variety
 * - seasonName: string (required) - Name of the season
 * - startDate: string (required) - Start date in YYYY-MM-DD format
 * - plannedHarvestDate: string (optional) - Planned harvest date
 * - endDate: string (optional) - End date
 * - initialPlantCount: number (required) - Number of plants at start
 * - expectedYieldKg: number (optional) - Expected yield in canonical kg
 * - notes: string (optional) - Additional notes
 */
export function NewSeasonDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: NewSeasonDialogProps) {
  const { preferences } = usePreferences();
  const unitLabel = getWeightUnitLabel(preferences.weightUnit);
  const weightStep = preferences.weightUnit === "G" ? "1" : "0.01";

  // Form state
  const [farmId, setFarmId] = useState<string>("");
  const [plotId, setPlotId] = useState<string>("");
  const [cropId, setCropId] = useState<string>("");
  const [varietyId, setVarietyId] = useState<string>("");
  const [seasonName, setSeasonName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [plannedHarvestDate, setPlannedHarvestDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [initialPlantCount, setInitialPlantCount] = useState("");
  const [expectedYieldKg, setExpectedYieldKg] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [notes, setNotes] = useState("");

  const parseWeightInput = (value: string) => {
    if (value === "") return undefined;
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed)) return undefined;
    return convertWeightToKg(parsed, preferences.weightUnit);
  };

  const parseBudgetInput = (value: string) => {
    if (value === "") return undefined;
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed)) return undefined;
    return parsed;
  };

  // Fetch farms for selection
  const { data: farmsData } = useFarms({ page: 0, size: 100 });
  const farms = farmsData?.content ?? [];

  // Fetch plots based on selected farm
  const selectedFarmId = farmId ? parseInt(farmId, 10) : 0;
  const { data: plotsData } = usePlotsByFarm(selectedFarmId, {
    page: 0,
    size: 100,
  });
  const plots = plotsData?.items ?? [];

  // Fetch crops for dropdown
  const { data: crops = [] } = useCrops();

  // Fetch varieties based on selected crop
  const selectedCropId = cropId ? parseInt(cropId, 10) : 0;
  const { data: varieties = [] } = useVarietiesByCrop(selectedCropId);

  // Reset plot when farm changes
  useEffect(() => {
    setPlotId("");
  }, [farmId]);

  // Reset variety when crop changes
  useEffect(() => {
    setVarietyId("");
  }, [cropId]);

  const initialPlantValue =
    initialPlantCount === "" ? null : parseInt(initialPlantCount, 10);
  const hasValidPlantCount =
    initialPlantValue !== null &&
    !Number.isNaN(initialPlantValue) &&
    initialPlantValue >= 1;
  const hasValidHarvestDate =
    !plannedHarvestDate || plannedHarvestDate >= startDate;

  const isFormValid =
    farmId &&
    plotId &&
    cropId &&
    seasonName.trim() &&
    startDate &&
    hasValidPlantCount &&
    hasValidHarvestDate;

  const resetForm = () => {
    setFarmId("");
    setPlotId("");
    setCropId("");
    setVarietyId("");
    setSeasonName("");
    setStartDate("");
    setPlannedHarvestDate("");
    setEndDate("");
    setInitialPlantCount("");
    setExpectedYieldKg("");
    setBudgetAmount("");
    setNotes("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    const formData: SeasonCreateRequest = {
      plotId: parseInt(plotId, 10),
      cropId: parseInt(cropId, 10),
      varietyId: varietyId ? parseInt(varietyId, 10) : undefined,
      seasonName: seasonName.trim(),
      startDate: startDate,
      plannedHarvestDate: plannedHarvestDate || undefined,
      endDate: endDate || undefined,
      initialPlantCount: parseInt(initialPlantCount, 10),
      expectedYieldKg: parseWeightInput(expectedYieldKg),
      budgetAmount: parseBudgetInput(budgetAmount),
      notes: notes.trim() || undefined,
    };

    onSubmit(formData);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
        else onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="w-5 h-5 text-primary" />
            Create New Season
          </DialogTitle>
          <DialogDescription>
            Set up a new growing season with crop details and timeline
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Season Name - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="seasonName">Season Name *</Label>
            <Input
              id="seasonName"
              value={seasonName}
              onChange={(e) => setSeasonName(e.target.value)}
              placeholder="e.g., Spring 2025 - Corn"
              required
              className="border-border focus:border-primary"
            />
          </div>

          {/* Farm and Plot Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="farmId">Farm *</Label>
              <Select value={farmId} onValueChange={setFarmId}>
                <SelectTrigger className="border-border focus:border-primary">
                  <SelectValue placeholder="Select farm" />
                </SelectTrigger>
                <SelectContent>
                  {farms.map((farm) => (
                    <SelectItem key={farm.id} value={String(farm.id)}>
                      {farm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plotId">Plot *</Label>
              <Select
                value={plotId}
                onValueChange={setPlotId}
                disabled={!farmId || plots.length === 0}
              >
                <SelectTrigger className="border-border focus:border-primary">
                  <SelectValue
                    placeholder={
                      !farmId
                        ? "Select farm first"
                        : plots.length === 0
                          ? "No plots available"
                          : "Select plot"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {plots.map((plot) => (
                    <SelectItem key={plot.id} value={String(plot.id)}>
                      {plot.plotName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Crop and Variety Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cropId">Crop *</Label>
              <Select value={cropId} onValueChange={setCropId}>
                <SelectTrigger className="border-border focus:border-primary">
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  {crops.map((crop) => (
                    <SelectItem key={crop.id} value={String(crop.id)}>
                      {crop.cropName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="varietyId">Variety (Optional)</Label>
              <Select
                value={varietyId}
                onValueChange={setVarietyId}
                disabled={!cropId || varieties.length === 0}
              >
                <SelectTrigger className="border-border focus:border-primary">
                  <SelectValue
                    placeholder={
                      !cropId
                        ? "Select a crop first"
                        : varieties.length === 0
                          ? "No varieties available"
                          : "Select variety"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {varieties.map((variety) => (
                    <SelectItem key={variety.id} value={String(variety.id)}>
                      {variety.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates Section */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plannedHarvestDate">Planned Harvest</Label>
              <Input
                id="plannedHarvestDate"
                type="date"
                value={plannedHarvestDate}
                onChange={(e) => setPlannedHarvestDate(e.target.value)}
                min={startDate}
                className="border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="border-border focus:border-primary"
              />
            </div>
          </div>

          {/* Plant Count and Yield */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialPlantCount">Initial Plant Count *</Label>
              <Input
                id="initialPlantCount"
                type="number"
                min="1"
                value={initialPlantCount}
                onChange={(e) => setInitialPlantCount(e.target.value)}
                placeholder="e.g., 1000"
                required
                className="border-border focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">
                Number of plants at the start of the season (at least 1)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedYieldKg">
                Expected Yield ({unitLabel})
              </Label>
              <Input
                id="expectedYieldKg"
                type="number"
                min="0"
                step={weightStep}
                value={expectedYieldKg}
                onChange={(e) => setExpectedYieldKg(e.target.value)}
                placeholder="e.g., 5000"
                className="border-border focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">
                Optional estimated harvest amount
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetAmount">
              Season Budget ({preferences.currency})
            </Label>
            <Input
              id="budgetAmount"
              type="number"
              min="0"
              step="0.01"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              placeholder="e.g., 20000"
              className="border-border focus:border-primary"
            />
            <p className="text-xs text-muted-foreground">
              Optional budget for tracking expenses
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional information about this growing season..."
              rows={3}
              className="border-border focus:border-primary"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-white"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Create Season
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
