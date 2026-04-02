import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { PlotRequest } from "@/entities/plot";
import { useSoilTypes } from "@/entities/soil-type";
import { usePlotStatuses } from "@/entities/plot-status";



interface AddPlotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: PlotRequest) => void;
  isSubmitting?: boolean;
}

/**
 * AddPlotDialog Component
 *
 * Dialog for adding a new plot with form inputs matching backend API structure.
 * 
 * Backend expects:
 * - plotName: string
 * - addressId: number (optional)
 * - area: number (in hectares)
 * - soilTypeId: number
 * - plotStatusId: number
 */
export function AddPlotDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false
}: AddPlotDialogProps) {
  // Fetch soil types from API
  const { data: soilTypes, isLoading: soilTypesLoading } = useSoilTypes();

  // Fetch plot statuses from API
  const { data: plotStatuses, isLoading: plotStatusesLoading } = usePlotStatuses();

  // Form state
  const [plotName, setPlotName] = useState("");
  const [areaValue, setAreaValue] = useState("");
  const [soilTypeId, setSoilTypeId] = useState<string>("");
  const [plotStatusId, setPlotStatusId] = useState<string>("1"); // Default to Active

  const resetForm = () => {
    setPlotName("");
    setAreaValue("");
    setSoilTypeId("");
    setPlotStatusId("1");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    if (!plotName.trim()) {
      return;
    }
    if (!areaValue || parseFloat(areaValue) <= 0) {
      return;
    }
    if (!soilTypeId) {
      return;
    }

    // Build request matching backend structure
    const formData: PlotRequest = {
      plotName: plotName.trim(),
      area: parseFloat(areaValue),
      soilTypeId: parseInt(soilTypeId, 10),
      plotStatusId: parseInt(plotStatusId, 10),
    };

    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Plus className="w-5 h-5 text-primary" />
            Add New Plot
          </DialogTitle>
          <DialogDescription>
            Create a new agricultural plot by entering the details below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Plot Name */}
            <div className="space-y-2">
              <Label htmlFor="plotName">Plot Name *</Label>
              <Input
                id="plotName"
                value={plotName}
                onChange={(e) => setPlotName(e.target.value)}
                placeholder="e.g., North Field"
                required
                className="border-border focus:border-primary"
              />
            </div>

            {/* Area */}
            <div className="space-y-2">
              <Label htmlFor="areaValue">Area (hectares) *</Label>
              <Input
                id="areaValue"
                type="number"
                step="0.01"
                min="0"
                value={areaValue}
                onChange={(e) => setAreaValue(e.target.value)}
                placeholder="e.g., 5.2"
                required
                className="border-border focus:border-primary"
              />
            </div>

            {/* Soil Type */}
            <div className="space-y-2">
              <Label htmlFor="soilType">Soil Type *</Label>
              <Select value={soilTypeId} onValueChange={setSoilTypeId} required disabled={soilTypesLoading}>
                <SelectTrigger className="border-border focus:border-primary">
                  <SelectValue placeholder={soilTypesLoading ? "Loading..." : "Select soil type"} />
                </SelectTrigger>
                <SelectContent>
                  {soilTypes?.map((soil) => (
                    <SelectItem key={soil.id} value={String(soil.id)}>
                      {soil.soilName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Plot Status */}
            <div className="space-y-2">
              <Label htmlFor="plotStatus">Status *</Label>
              <Select value={plotStatusId} onValueChange={setPlotStatusId} required disabled={plotStatusesLoading}>
                <SelectTrigger className="border-border focus:border-primary">
                  <SelectValue placeholder={plotStatusesLoading ? "Loading..." : "Select status"} />
                </SelectTrigger>
                <SelectContent>
                  {plotStatuses?.map((status) => (
                    <SelectItem key={status.id} value={String(status.id)}>
                      {status.statusName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Adding...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Add Plot
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}




