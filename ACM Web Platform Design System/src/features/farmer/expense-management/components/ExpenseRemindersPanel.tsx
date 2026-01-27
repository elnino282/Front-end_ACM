import { useState } from "react";
import { Bell, Calendar } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/shared/contexts";
import { convertToDisplayCurrency, formatMoney } from "@/shared/lib";
import type { Expense } from "../types";

interface ExpenseRemindersPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pendingExpenses: Expense[];
}

export function ExpenseRemindersPanel({
    open,
    onOpenChange,
    pendingExpenses,
}: ExpenseRemindersPanelProps) {
    const { preferences } = usePreferences();
    const [remindDates, setRemindDates] = useState<Record<number, string>>({});

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-primary" />
                        Reminders
                    </SheetTitle>
                    <SheetDescription>
                        Pending expenses that need follow-up.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                    {pendingExpenses.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                            No pending expenses right now.
                        </div>
                    ) : (
                        pendingExpenses.map((expense) => (
                            <div key={expense.id} className="rounded-lg border border-border p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{expense.description}</p>
                                        <p className="text-xs text-muted-foreground">{expense.category}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-foreground">
                                        {formatMoney(
                                            convertToDisplayCurrency(expense.amount, preferences.currency),
                                            preferences.currency,
                                            preferences.locale
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="date"
                                        value={remindDates[expense.id] ?? ""}
                                        onChange={(event) =>
                                            setRemindDates((prev) => ({
                                                ...prev,
                                                [expense.id]: event.target.value,
                                            }))
                                        }
                                        className="h-8 text-xs"
                                    />
                                </div>
                            </div>
                        ))
                    )}

                    <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
