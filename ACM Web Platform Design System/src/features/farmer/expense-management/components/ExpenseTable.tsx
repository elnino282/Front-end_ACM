import {
    CheckCircle2,
    AlertCircle,
    Clock,
    Paperclip,
    Eye,
    Edit,
    Trash2,
    MoreVertical,
    Tag,
    Link as LinkIcon,
    Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Expense } from "../types";
import { CATEGORY_COLORS } from "../constants";
import { usePreferences } from "@/shared/contexts";
import { formatMoney, convertToDisplayCurrency } from "@/shared/lib";

interface ExpenseTableProps {
    filteredExpenses: Expense[];
    totalExpenses: number;
    handleEditExpense: (expense: Expense) => void;
    handleDeleteExpense: (expense: Expense) => void;
    handleViewExpense: (expense: Expense) => void;
    onAddExpense?: () => void;
}

export function ExpenseTable({
    filteredExpenses,
    totalExpenses,
    handleEditExpense,
    handleDeleteExpense,
    handleViewExpense,
    onAddExpense,
}: ExpenseTableProps) {
    const { preferences } = usePreferences();
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PAID":
                return (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Paid
                    </Badge>
                );
            case "UNPAID":
                return (
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Unpaid
                    </Badge>
                );
            case "PENDING":
                return (
                    <Badge className="bg-accent/10 text-foreground border-accent/20">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </Badge>
                );
            default:
                return null;
        }
    };

    const getCategoryColor = (category: string) => {
        return CATEGORY_COLORS[category] || "var(--muted-foreground)";
    };

    const totalAmount = filteredExpenses.reduce(
        (sum, exp) => sum + exp.amount,
        0
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="numeric">{filteredExpenses.length}</span>{" "}
                        of <span className="numeric">{totalExpenses}</span> expenses
                    </p>
                </div>
                <Badge className="bg-muted text-foreground border-border">
                    <span className="numeric">
                        Total: {formatMoney(convertToDisplayCurrency(totalAmount, preferences.currency), preferences.currency, preferences.locale)}
                    </span>
                </Badge>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted hover:bg-muted">
                            <TableHead className="text-foreground">Date</TableHead>
                            <TableHead className="text-foreground">Category</TableHead>
                            <TableHead className="text-foreground">Description</TableHead>
                            <TableHead className="text-foreground">Linked To</TableHead>
                            <TableHead className="text-foreground text-right">Amount</TableHead>
                            <TableHead className="text-foreground">Status</TableHead>
                            <TableHead className="text-foreground text-center">Receipt</TableHead>
                            <TableHead className="text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredExpenses.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="text-center py-12 text-muted-foreground"
                                >
                                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                                    <p>No expenses found</p>
                                    <p className="text-sm mt-1">Try adjusting your filters</p>
                                    {onAddExpense && (
                                        <div className="mt-4">
                                            <Button variant="outline" onClick={onAddExpense}>
                                                Add Expense
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredExpenses.map((expense) => (
                                <TableRow key={expense.id} className="hover:bg-muted/50">
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(expense.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            style={{
                                                borderColor: `color-mix(in oklab, ${getCategoryColor(expense.category)} 20%, transparent)`,
                                                backgroundColor: `color-mix(in oklab, ${getCategoryColor(expense.category)} 10%, transparent)`,
                                                color: getCategoryColor(expense.category),
                                            }}
                                        >
                                            <Tag className="w-3 h-3 mr-1" />
                                            {expense.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-foreground">
                                                {expense.description}
                                            </span>
                                            {expense.vendor && (
                                                <span className="text-xs text-muted-foreground">
                                                    {expense.vendor}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {expense.linkedSeason && (
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <LinkIcon className="w-3 h-3" />
                                                    {expense.linkedSeason}
                                                </span>
                                            )}
                                            {expense.linkedTask && (
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    {expense.linkedTask}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right numeric text-foreground">
                                        {formatMoney(convertToDisplayCurrency(expense.amount, preferences.currency), preferences.currency, preferences.locale)}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(expense.status)}</TableCell>
                                    <TableCell className="text-center">
                                        {expense.attachmentUrl ? (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 hover:bg-primary/10"
                                                            onClick={() => window.open(expense.attachmentUrl, "_blank")}
                                                        >
                                                            <Paperclip className="w-4 h-4 text-primary" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="text-xs">{expense.attachmentName ?? "Receipt"}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-muted"
                                                >
                                                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem
                                                    onClick={() => handleEditExpense(expense)}
                                                >
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleViewExpense(expense)}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    disabled={!expense.attachmentUrl}
                                                    onClick={() => {
                                                        if (expense.attachmentUrl) {
                                                            window.open(expense.attachmentUrl, "_blank");
                                                        }
                                                    }}
                                                >
                                                    <Receipt className="w-4 h-4 mr-2" />
                                                    Download Receipt
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteExpense(expense)}
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
