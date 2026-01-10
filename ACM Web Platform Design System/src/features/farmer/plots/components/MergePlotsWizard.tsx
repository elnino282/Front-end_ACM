import { GitMerge, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { PlotStatusChip } from "./PlotStatusChip";
import { Plot, PlotStatus } from "../types";

interface MergePlotsWizardProps {
  isOpen: boolean;
  onClose: () => void;
  plots: Plot[];
  selectedPlots: string[];
  setSelectedPlots: (plots: string[]) => void;
  mergeStep: number;
  setMergeStep: (step: number) => void;
  onConfirm: () => void;
}

/**
 * MergePlotsWizard Component
 *
 * Multi-step wizard for merging multiple plots into one.
 */
export function MergePlotsWizard({
  isOpen,
  onClose,
  plots,
  selectedPlots,
  setSelectedPlots,
  mergeStep,
  setMergeStep,
  onConfirm,
}: MergePlotsWizardProps) {
  const handleClose = () => {
    onClose();
    setMergeStep(1);
    setSelectedPlots([]);
  };

  const handleNext = () => {
    if (selectedPlots.length < 2) {
      toast.error("Select at least 2 plots");
      return;
    }
    setMergeStep(2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <GitMerge className="w-5 h-5 text-primary" />
            Merge Plots Wizard
          </DialogTitle>
          <DialogDescription>
            Step {mergeStep} of 2:{" "}
            {mergeStep === 1 ? "Select plots to merge" : "Preview and confirm"}
          </DialogDescription>
        </DialogHeader>

        {mergeStep === 1 ? (
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Select at least 2 plots to merge into a single plot
            </p>
            <ScrollArea className="h-[300px] border border-border rounded-lg p-4">
              <div className="space-y-2">
                {plots.map((plot) => (
                  <div
                    key={plot.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => {
                      setSelectedPlots(
                        selectedPlots.includes(plot.id)
                          ? selectedPlots.filter((id) => id !== plot.id)
                          : [...selectedPlots, plot.id]
                      );
                    }}
                  >
                    <Checkbox
                      checked={selectedPlots.includes(plot.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPlots([...selectedPlots, plot.id]);
                        } else {
                          setSelectedPlots(
                            selectedPlots.filter((id) => id !== plot.id)
                          );
                        }
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{plot.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {plot.area.toFixed(1)} ha • {plot.soilType}
                      </p>
                    </div>
                    <PlotStatusChip status={plot.status} />
                  </div>
                ))}
              </div>
            </ScrollArea>
            <p className="text-xs text-muted-foreground mt-3">
              {selectedPlots.length} plot(s) selected
            </p>
          </div>
        ) : (
          <div className="py-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Merge Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Plots to Merge</Label>
                  <div className="mt-2 space-y-1">
                    {plots
                      .filter((p) => selectedPlots.includes(p.id))
                      .map((plot) => (
                        <p key={plot.id} className="text-sm text-foreground">
                          • {plot.name} ({plot.area.toFixed(1)} ha)
                        </p>
                      ))}
                  </div>
                </div>
                <Separator className="bg-border" />
                <div>
                  <Label className="text-sm text-muted-foreground">New Plot Name</Label>
                  <Input
                    placeholder="Enter merged plot name"
                    className="mt-2 border-border focus:border-primary"
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Total Area</Label>
                  <p className="text-xl text-foreground mt-1">
                    {plots
                      .filter((p) => selectedPlots.includes(p.id))
                      .reduce((sum, p) => sum + p.area, 0)
                      .toFixed(1)}{" "}
                    hectares
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {mergeStep === 1 ? (
            <Button
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setMergeStep(1)}>
                Back
              </Button>
              <Button
                onClick={onConfirm}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm Merge
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}




