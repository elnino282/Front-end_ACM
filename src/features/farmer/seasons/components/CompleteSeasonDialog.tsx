import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Season } from "../types";

interface CompleteSeasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  season: Season | null;
  onConfirm: (data: {
    endDate: string;
    actualYieldKg?: number;
    forceComplete?: boolean;
  }) => void;
  isSubmitting?: boolean;
}

export function CompleteSeasonDialog({
  open,
  onOpenChange,
  season,
  onConfirm,
  isSubmitting = false,
}: CompleteSeasonDialogProps) {
  const { preferences } = usePreferences();
  const unitLabel = getWeightUnitLabel(preferences.weightUnit);
  const weightStep = preferences.weightUnit === "G" ? "1" : "0.01";
  const [endDate, setEndDate] = useState("");
  const [actualYieldKg, setActualYieldKg] = useState("");
  const [forceComplete, setForceComplete] = useState(false);

  useEffect(() => {
    if (!open) return;
    setEndDate("");
    setActualYieldKg("");
    setForceComplete(false);
  }, [open, season?.id]);

  const actualYieldInput =
    actualYieldKg === "" ? null : parseFloat(actualYieldKg);
  const hasValidYield =
    actualYieldInput === null ||
    (!Number.isNaN(actualYieldInput) && actualYieldInput >= 0);
  const actualYieldValue =
    actualYieldInput === null
      ? null
      : convertWeightToKg(actualYieldInput, preferences.weightUnit);

  const canSubmit = Boolean(endDate) && hasValidYield && !isSubmitting;

  const handleSubmit = () => {
    if (!season || !canSubmit) return;
    onConfirm({
      endDate,
      actualYieldKg: actualYieldValue ?? undefined,
      forceComplete,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="acm-rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Complete Season
          </DialogTitle>
          <DialogDescription>
            Finalize this season by setting the end date and actual yield.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date *</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={season?.startDate}
              className="border-border acm-rounded-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actualYieldKg">Actual Yield ({unitLabel})</Label>
            <Input
              id="actualYieldKg"
              type="number"
              min="0"
              step={weightStep}
              value={actualYieldKg}
              onChange={(e) => setActualYieldKg(e.target.value)}
              placeholder="e.g., 5200"
              className="border-border acm-rounded-sm"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to auto-calculate from harvest records.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              checked={forceComplete}
              onCheckedChange={(checked) => setForceComplete(Boolean(checked))}
              className="mt-1"
            />
            <div className="text-sm text-muted-foreground">
              Force complete even if there are pending or in-progress tasks.
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="acm-rounded-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-primary hover:bg-primary/90 text-white acm-rounded-sm"
          >
            {isSubmitting ? "Completing..." : "Complete Season"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
