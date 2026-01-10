import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BUDGET_CONFIG } from "../constants";

interface BudgetTrackerProps {
    totalExpenses: number;
    budgetUsagePercentage: number;
    remainingBudget: number;
    paidExpenses: number;
    unpaidExpenses: number;
}

export function BudgetTracker({
    totalExpenses,
    budgetUsagePercentage,
    remainingBudget,
    paidExpenses,
    unpaidExpenses,
}: BudgetTrackerProps) {
    return (
        <Card className="border-border rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Budget Tracker
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Budget</span>
                        <span className="numeric text-foreground">
                            ${BUDGET_CONFIG.totalBudget.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Spent</span>
                        <span className="numeric text-foreground">
                            ${totalExpenses.toLocaleString()}
                        </span>
                    </div>
                    <Progress
                        value={budgetUsagePercentage}
                        className={`h-3 ${budgetUsagePercentage >= BUDGET_CONFIG.dangerThreshold
                                ? "[&>div]:bg-destructive"
                                : budgetUsagePercentage >= BUDGET_CONFIG.warningThreshold
                                    ? "[&>div]:bg-accent"
                                    : "[&>div]:bg-primary"
                            }`}
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            <span className="numeric">{budgetUsagePercentage.toFixed(1)}%</span> used
                        </span>
                        <Badge
                            className={`numeric text-xs ${budgetUsagePercentage >= BUDGET_CONFIG.dangerThreshold
                                    ? "bg-destructive/10 text-destructive border-destructive/20"
                                    : budgetUsagePercentage >= BUDGET_CONFIG.warningThreshold
                                        ? "bg-accent/10 text-foreground border-accent/20"
                                        : "bg-primary/10 text-primary border-primary/20"
                                }`}
                        >
                            ${remainingBudget.toLocaleString()} left
                        </Badge>
                    </div>
                </div>

                <Separator className="bg-border" />

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Paid</p>
                        <p className="numeric text-primary">
                            ${paidExpenses.toLocaleString()}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Unpaid</p>
                        <p className="numeric text-destructive">
                            ${unpaidExpenses.toLocaleString()}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}



