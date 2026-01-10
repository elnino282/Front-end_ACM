import {
    Wheat,
    Package,
    Award,
    Droplets,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface HarvestKPICardsProps {
    totalHarvested: number;
    lotsCount: number;
    avgGrade: string;
    avgMoisture: string;
    yieldVsPlan: string;
}

export function HarvestKPICards({
    totalHarvested,
    lotsCount,
    avgGrade,
    avgMoisture,
    yieldVsPlan,
}: HarvestKPICardsProps) {
    const isOnTarget = parseFloat(yieldVsPlan) >= 100;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Total Harvested */}
            <Card className="border-border rounded-2xl shadow-sm">
                <CardContent className="px-6 py-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Total Harvested</p>
                            <p className="text-2xl numeric text-foreground">
                                {totalHarvested.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">kg</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Wheat className="w-5 h-5 text-primary" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Lots Count */}
            <Card className="border-border rounded-2xl shadow-sm">
                <CardContent className="px-6 py-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Lots Count</p>
                            <p className="text-2xl numeric text-foreground">{lotsCount}</p>
                            <p className="text-xs text-muted-foreground mt-1">batches</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-secondary" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Avg Grade */}
            <Card className="border-border rounded-2xl shadow-sm">
                <CardContent className="px-6 py-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Avg Grade</p>
                            <p className="text-2xl text-foreground">{avgGrade}</p>
                            <p className="text-xs text-muted-foreground mt-1">quality</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Award className="w-5 h-5 text-accent" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Avg Moisture */}
            <Card className="border-border rounded-2xl shadow-sm">
                <CardContent className="px-6 py-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Avg Moisture</p>
                            <p className="text-2xl numeric text-foreground">{avgMoisture}</p>
                            <p className="text-xs text-muted-foreground mt-1">%</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                            <Droplets className="w-5 h-5 text-secondary" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Yield vs Plan */}
            <Card className="border-border rounded-2xl shadow-sm">
                <CardContent className="px-6 py-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Yield vs Plan</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl numeric text-foreground">{yieldVsPlan}</p>
                                <p className="text-xs text-muted-foreground">%</p>
                            </div>
                            {isOnTarget ? (
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="w-3 h-3 text-primary" />
                                    <p className="text-xs text-primary">On target</p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingDown className="w-3 h-3 text-destructive" />
                                    <p className="text-xs text-destructive">Below plan</p>
                                </div>
                            )}
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}



