import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { usePreferences } from "@/shared/contexts";
import { convertToDisplayCurrency, formatMoney } from "@/shared/lib";
import { FileText, Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { Expense, ExpenseStatus } from "../types";

interface ExpenseDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense | null;
  onQuickUpdate: (
    expense: Expense,
    updates: { status?: ExpenseStatus; notes?: string },
  ) => void;
}

export function ExpenseDetailDrawer({
  open,
  onOpenChange,
  expense,
  onQuickUpdate,
}: ExpenseDetailDrawerProps) {
  const { preferences } = usePreferences();
  const [status, setStatus] = useState<ExpenseStatus>("PENDING");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!expense) return;
    setStatus(expense.status);
    setNotes(expense.notes ?? "");
  }, [expense]);

  if (!expense) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Expense Details
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-foreground">{expense.date}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="text-foreground">{expense.category}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="text-foreground">
                {formatMoney(
                  convertToDisplayCurrency(
                    expense.amount,
                    preferences.currency,
                  ),
                  preferences.currency,
                  preferences.locale,
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Select
                value={status}
                onValueChange={(value: ExpenseStatus) => setStatus(value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="UNPAID">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Description</p>
            <p className="text-foreground">{expense.description}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Linked To</p>
            <div className="space-y-1">
              {expense.linkedSeason && (
                <div className="flex items-center gap-2 text-foreground">
                  <LinkIcon className="w-3 h-3" />
                  {expense.linkedSeason}
                </div>
              )}
              {expense.linkedTask && (
                <div className="flex items-center gap-2 text-foreground">
                  <LinkIcon className="w-3 h-3" />
                  {expense.linkedTask}
                </div>
              )}
            </div>
          </div>

          {expense.vendor && (
            <div>
              <p className="text-xs text-muted-foreground">Vendor</p>
              <p className="text-foreground">{expense.vendor}</p>
            </div>
          )}

          {expense.attachmentUrl && (
            <div>
              <p className="text-xs text-muted-foreground">Attachment</p>
              <Button
                variant="link"
                className="px-0 text-primary"
                onClick={() => window.open(expense.attachmentUrl, "_blank")}
              >
                {expense.attachmentName ?? "View receipt"}
              </Button>
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground">Notes</p>
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button
            className="w-full"
            onClick={() => onQuickUpdate(expense, { status, notes })}
          >
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
