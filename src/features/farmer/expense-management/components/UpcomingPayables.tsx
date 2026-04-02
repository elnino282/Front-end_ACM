import { AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/shared/contexts";
import { convertToDisplayCurrency, formatMoney } from "@/shared/lib";
import type { Expense } from "../types";

interface UpcomingPayablesProps {
    pendingExpenses: Expense[];
}

export function UpcomingPayables({ pendingExpenses }: UpcomingPayablesProps) {
    const { preferences } = usePreferences();
    const items = pendingExpenses.slice(0, 5);

    return (
        <Card className="border-border rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    Pending Expenses
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                    <span className="numeric">{pendingExpenses.length}</span> expenses awaiting payment
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {items.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                        No pending expenses.
                    </div>
                ) : (
                    items.map((expense) => (
                        <div
                            key={expense.id}
                            className="p-3 rounded-xl border-l-4 border-amber-400 bg-amber-50/50"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <p className="text-sm text-foreground">{expense.description}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {expense.category}
                                    </p>
                                </div>
                                <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                                    pending
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <CalendarIcon className="w-3 h-3" />
                                    {new Date(expense.date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </div>
                                <p className="numeric text-foreground">
                                    {formatMoney(
                                        convertToDisplayCurrency(expense.amount, preferences.currency),
                                        preferences.currency,
                                        preferences.locale
                                    )}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
