import { QrCode, ClipboardCheck, Link as LinkIcon, Truck, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { SummaryStats } from "../types";
import { usePreferences } from "@/shared/contexts";
import { formatWeight } from "@/shared/lib";

interface QuickActionsPanelProps {
    onQuickAction: (action: string) => void;
    summaryStats: SummaryStats;
}

export function QuickActionsPanel({
    onQuickAction,
    summaryStats,
}: QuickActionsPanelProps) {
    const { preferences } = usePreferences();

    return (
        <div className="space-y-4">
            {/* Quick Actions */}
            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base text-foreground">
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button
                        variant="outline"
                        className="w-full justify-start rounded-xl border-border hover:bg-muted"
                        onClick={() => onQuickAction("qr")}
                    >
                        <QrCode className="w-4 h-4 mr-2 text-secondary" />
                        Generate QR Code
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start rounded-xl border-border hover:bg-muted"
                        onClick={() => onQuickAction("qc")}
                    >
                        <ClipboardCheck className="w-4 h-4 mr-2 text-primary" />
                        Record QC Metrics
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start rounded-xl border-border hover:bg-muted"
                        onClick={() => onQuickAction("sale")}
                    >
                        <LinkIcon className="w-4 h-4 mr-2 text-accent" />
                        Link to Sale
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start rounded-xl border-border hover:bg-muted"
                        onClick={() => onQuickAction("handover")}
                    >
                        <Truck className="w-4 h-4 mr-2 text-muted-foreground" />
                        Print Handover Note
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start rounded-xl border-border hover:bg-muted"
                        onClick={() => onQuickAction("weight")}
                    >
                        <Scale className="w-4 h-4 mr-2 text-muted-foreground" />
                        Record Weight
                    </Button>
                </CardContent>
            </Card>

            {/* Summary Stats */}
            <Card className="border-border rounded-2xl shadow-sm bg-muted/30">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base text-foreground">
                        Season Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Stored</span>
                        <span className="numeric text-foreground">
                            {formatWeight(summaryStats.totalStored, preferences.weightUnit, preferences.locale)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Sold</span>
                        <span className="numeric text-primary">
                            {formatWeight(summaryStats.totalSold, preferences.weightUnit, preferences.locale)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Processing</span>
                        <span className="numeric text-accent">
                            {formatWeight(summaryStats.totalProcessing, preferences.weightUnit, preferences.locale)}
                        </span>
                    </div>
                    <Separator className="bg-border my-2" />
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Premium Grade %</span>
                        <span className="numeric text-foreground">
                            {summaryStats.premiumGradePercentage.toFixed(0)}%
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}



