import { Download, Loader2, FileSpreadsheet, FileText, FileDown } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import type { ExportFormat } from "../types";

interface ExportModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isExporting: boolean;
    exportFormat: ExportFormat;
    onExportFormatChange: (format: ExportFormat) => void;
    includeCharts: boolean;
    onIncludeChartsChange: (include: boolean) => void;
    includeNotes: boolean;
    onIncludeNotesChange: (include: boolean) => void;
    onExport: () => void;
}

export function ExportModal({
    isOpen,
    onOpenChange,
    isExporting,
    exportFormat,
    onExportFormatChange,
    includeCharts,
    onIncludeChartsChange,
    includeNotes,
    onIncludeNotesChange,
    onExport,
}: ExportModalProps) {
    const formatOptions = [
        { value: "excel" as ExportFormat, icon: FileSpreadsheet, label: "Excel" },
        { value: "pdf" as ExportFormat, icon: FileText, label: "PDF" },
        { value: "csv" as ExportFormat, icon: FileDown, label: "CSV" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-foreground">
                        <Download className="w-5 h-5 text-primary" />
                        Export Report
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Choose your export format and options
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-3">
                        <Label className="text-foreground">File Type</Label>
                        <div className="grid grid-cols-3 gap-3">
                            {formatOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => onExportFormatChange(option.value)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${exportFormat === option.value
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                            }`}
                                    >
                                        <Icon
                                            className={`w-8 h-8 ${exportFormat === option.value
                                                    ? "text-primary"
                                                    : "text-muted-foreground"
                                                }`}
                                        />
                                        <span className="text-xs text-foreground">
                                            {option.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <Separator className="bg-border" />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="include-charts" className="text-foreground">
                                Include Charts
                            </Label>
                            <Switch
                                id="include-charts"
                                checked={includeCharts}
                                onCheckedChange={onIncludeChartsChange}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="include-notes" className="text-foreground">
                                Include Notes
                            </Label>
                            <Switch
                                id="include-notes"
                                checked={includeNotes}
                                onCheckedChange={onIncludeNotesChange}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl border-border"
                        disabled={isExporting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onExport}
                        className="bg-primary hover:bg-primary/90 text-white rounded-xl"
                        disabled={isExporting}
                    >
                        {isExporting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Generate
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}



