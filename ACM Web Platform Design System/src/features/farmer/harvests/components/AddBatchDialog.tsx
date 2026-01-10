import { Plus, X, Save, ClipboardCheck } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
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
import { Separator } from "@/components/ui/separator";
import type { HarvestFormData, HarvestGrade, HarvestStatus } from "../types";
import { GRADE_OPTIONS, STATUS_OPTIONS } from "../constants";
import { useSeasons } from "@/entities/season";
import { usePlots } from "@/entities/plot";
import { useCrops } from "@/entities/crop";

interface AddBatchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formData: HarvestFormData;
    onFormChange: (data: HarvestFormData) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

export function AddBatchDialog({
    open,
    onOpenChange,
    formData,
    onFormChange,
    onSubmit,
    onCancel,
}: AddBatchDialogProps) {
    // Fetch seasons, plots, crops from API
    const { data: seasonsData } = useSeasons();
    const { data: plotsData } = usePlots();
    const { data: cropsData } = useCrops();

    // Transform API data to dropdown options
    // Seasons returns PageResponse<Season> with .items array
    const seasonOptions: { value: string; label: string }[] = seasonsData?.items?.map((season) => ({
        value: String(season.id),
        label: season.seasonName,
    })) ?? [];

    // Plots returns array directly (PlotArrayResponse)
    const plotOptions: { value: string; label: string }[] = plotsData?.map((plot) => ({
        value: String(plot.id),
        label: plot.plotName,
    })) ?? [];

    // Crops returns array directly (Crop[])
    const cropOptions: { value: string; label: string }[] = cropsData?.map((crop) => ({
        value: String(crop.id),
        label: crop.cropName,
    })) ?? [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-foreground text-xl">
                        <Plus className="w-5 h-5 text-primary" />
                        Add Harvest Batch
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Record a new harvest batch with quality control metrics
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="batchId" className="text-foreground">
                                Batch ID <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="batchId"
                                placeholder="HRV-2025-XXX"
                                value={formData.batchId}
                                onChange={(e) =>
                                    onFormChange({ ...formData, batchId: e.target.value })
                                }
                                className="rounded-xl border-border focus:border-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-foreground">
                                Harvest Date <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    onFormChange({ ...formData, date: e.target.value })
                                }
                                className="rounded-xl border-border focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity" className="text-foreground">
                                Quantity (kg) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="quantity"
                                type="number"
                                placeholder="0"
                                value={formData.quantity}
                                onChange={(e) =>
                                    onFormChange({ ...formData, quantity: e.target.value })
                                }
                                className="rounded-xl border-border focus:border-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="grade" className="text-foreground">
                                Grade <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.grade}
                                onValueChange={(value: HarvestGrade) =>
                                    onFormChange({ ...formData, grade: value })
                                }
                            >
                                <SelectTrigger className="rounded-xl border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {GRADE_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="moisture" className="text-foreground">
                                Moisture % <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="moisture"
                                type="number"
                                step="0.1"
                                placeholder="0.0"
                                value={formData.moisture}
                                onChange={(e) =>
                                    onFormChange({ ...formData, moisture: e.target.value })
                                }
                                className="rounded-xl border-border focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="season" className="text-foreground">
                                Season
                            </Label>
                            <Select
                                value={formData.season}
                                onValueChange={(value: string) =>
                                    onFormChange({ ...formData, season: value })
                                }
                            >
                                <SelectTrigger className="rounded-xl border-border">
                                    <SelectValue placeholder="Select season" />
                                </SelectTrigger>
                                <SelectContent>
                                    {seasonOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="plot" className="text-foreground">
                                Plot
                            </Label>
                            <Select
                                value={formData.plot}
                                onValueChange={(value: string) =>
                                    onFormChange({ ...formData, plot: value })
                                }
                            >
                                <SelectTrigger className="rounded-xl border-border">
                                    <SelectValue placeholder="Select plot" />
                                </SelectTrigger>
                                <SelectContent>
                                    {plotOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="crop" className="text-foreground">
                                Crop
                            </Label>
                            <Select
                                value={formData.crop}
                                onValueChange={(value: string) =>
                                    onFormChange({ ...formData, crop: value })
                                }
                            >
                                <SelectTrigger className="rounded-xl border-border">
                                    <SelectValue placeholder="Select crop" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cropOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-foreground">
                            Status
                        </Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: HarvestStatus) =>
                                onFormChange({ ...formData, status: value })
                            }
                        >
                            <SelectTrigger className="rounded-xl border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator className="bg-border" />

                    {/* QC Metrics */}
                    <div>
                        <h4 className="text-sm text-foreground mb-4 flex items-center gap-2">
                            <ClipboardCheck className="w-4 h-4 text-primary" />
                            Quality Control Metrics (Optional)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="purity" className="text-foreground">
                                    Purity %
                                </Label>
                                <Input
                                    id="purity"
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    value={formData.purity}
                                    onChange={(e) =>
                                        onFormChange({ ...formData, purity: e.target.value })
                                    }
                                    className="rounded-xl border-border focus:border-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="foreignMatter" className="text-foreground">
                                    Foreign Matter %
                                </Label>
                                <Input
                                    id="foreignMatter"
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    value={formData.foreignMatter}
                                    onChange={(e) =>
                                        onFormChange({ ...formData, foreignMatter: e.target.value })
                                    }
                                    className="rounded-xl border-border focus:border-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="brokenGrains" className="text-foreground">
                                    Broken Grains %
                                </Label>
                                <Input
                                    id="brokenGrains"
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    value={formData.brokenGrains}
                                    onChange={(e) =>
                                        onFormChange({ ...formData, brokenGrains: e.target.value })
                                    }
                                    className="rounded-xl border-border focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-foreground">
                            Notes
                        </Label>
                        <Textarea
                            id="notes"
                            placeholder="Add any additional notes about this harvest batch..."
                            value={formData.notes}
                            onChange={(e) =>
                                onFormChange({ ...formData, notes: e.target.value })
                            }
                            className="rounded-xl border-border focus:border-primary min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="rounded-xl border-border"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        className="bg-primary hover:bg-primary/90 text-white rounded-xl"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Batch
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}



