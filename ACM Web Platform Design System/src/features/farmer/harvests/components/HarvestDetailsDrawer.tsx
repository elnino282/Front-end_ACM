import {
    Wheat,
    QrCode,
    Printer,
    Image as ImageIcon,
    ClipboardCheck,
    Link as LinkIcon,
    FileText,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { HarvestBatch, HarvestGrade, HarvestStatus } from "../types";

interface HarvestDetailsDrawerProps {
    batch: HarvestBatch | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAction: (action: string, batch: HarvestBatch) => void;
    getStatusBadge: (status: HarvestStatus) => JSX.Element | null;
    getGradeBadge: (grade: HarvestGrade) => JSX.Element;
}

export function HarvestDetailsDrawer({
    batch,
    open,
    onOpenChange,
    onAction,
    getStatusBadge,
    getGradeBadge,
}: HarvestDetailsDrawerProps) {
    if (!batch) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-[500px] sm:max-w-[500px] overflow-y-auto"
            >
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-foreground">
                        <Wheat className="w-5 h-5 text-primary" />
                        Batch Details
                    </SheetTitle>
                    <SheetDescription className="text-sm text-muted-foreground">
                        {batch.batchId}
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Photo Placeholder */}
                    <div className="w-full h-48 rounded-xl bg-muted/30 border-2 border-dashed border-border flex items-center justify-center">
                        <div className="text-center">
                            <ImageIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">No photo uploaded</p>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <Card className="border-border rounded-xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-foreground">
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Date</span>
                                <span className="text-sm text-foreground">
                                    {new Date(batch.date).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Quantity</span>
                                <span className="numeric text-foreground">
                                    {batch.quantity.toLocaleString()} kg
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Grade</span>
                                {getGradeBadge(batch.grade)}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Moisture</span>
                                <span className="numeric text-foreground">
                                    {batch.moisture.toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                {getStatusBadge(batch.status)}
                            </div>
                        </CardContent>
                    </Card>

                    {/* QC Metrics */}
                    {batch.qcMetrics && (
                        <Card className="border-border rounded-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm text-foreground flex items-center gap-2">
                                    <ClipboardCheck className="w-4 h-4 text-primary" />
                                    Quality Control
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Purity</span>
                                    <span className="numeric text-primary">
                                        {batch.qcMetrics.purity.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Foreign Matter</span>
                                    <span className="numeric text-foreground">
                                        {batch.qcMetrics.foreignMatter.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Broken Grains</span>
                                    <span className="numeric text-foreground">
                                        {batch.qcMetrics.brokenGrains.toFixed(1)}%
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Linked Sale */}
                    {batch.linkedSale && (
                        <Card className="border-border rounded-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm text-foreground flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4 text-secondary" />
                                    Linked Sale
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Sale Reference</span>
                                    <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                                        {batch.linkedSale}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Notes */}
                    {batch.notes && (
                        <Card className="border-border rounded-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm text-foreground flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{batch.notes}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Actions */}
                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full justify-start rounded-xl border-border"
                            onClick={() => onAction("qr", batch)}
                        >
                            <QrCode className="w-4 h-4 mr-2" />
                            Generate QR Code
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start rounded-xl border-border"
                            onClick={() => onAction("handover", batch)}
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            Print Handover Note
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}



