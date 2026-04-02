import {
    X,
    Upload,
    Save,
    Edit,
    Plus,
    DollarSign,
    Building2,
    ListTodo,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Expense, ExpenseFormData, ExpenseStatus, TaskOption } from "../types";
import { usePreferences } from "@/shared/contexts";
import { formatMoney } from "@/shared/lib";

interface ExpenseFormModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selectedExpense: Expense | null;
    formData: ExpenseFormData;
    setFormData: (data: ExpenseFormData) => void;
    handleAddExpense: () => void;
    resetForm: () => void;
    showValidationErrors?: boolean;
    seasonOptions: { value: string; label: string; plotId?: number }[];
    taskOptions?: TaskOption[];
    supplierOptions?: { value: string; label: string; id: number }[];
    isLoadingTasks?: boolean;
    onTaskChange?: (taskId: string) => void;
    isSeasonLocked?: boolean;
    lockedSeasonLabel?: string;
}

export function ExpenseFormModal({
    isOpen,
    setIsOpen,
    selectedExpense,
    formData,
    setFormData,
    handleAddExpense,
    resetForm,
    showValidationErrors = false,
    seasonOptions,
    taskOptions = [],
    supplierOptions = [],
    isLoadingTasks = false,
    onTaskChange,
    isSeasonLocked = false,
    lockedSeasonLabel,
}: ExpenseFormModalProps) {
    const { preferences } = usePreferences();
    const amountValue = Number(formData.amount);
    const amountInvalid = !Number.isFinite(amountValue) || amountValue <= 0;
    const dateError = showValidationErrors && !formData.date ? "Date is required." : undefined;
    const categoryError = showValidationErrors && !formData.category ? "Category is required." : undefined;
    const seasonError = showValidationErrors && !formData.linkedSeasonId ? "Season is required." : undefined;
    const amountError = showValidationErrors && (formData.amount === "" || amountInvalid)
        ? "Enter a valid amount greater than 0."
        : undefined;
    const statusError = showValidationErrors && !formData.status ? "Status is required." : undefined;

    const handleClose = () => {
        setIsOpen(false);
        resetForm();
    };

    const handleTaskSelection = (value: string) => {
        if (onTaskChange) {
            onTaskChange(value);
        } else {
            const taskId = parseInt(value, 10);
            setFormData({
                ...formData,
                linkedTask: value,
                linkedTaskId: isNaN(taskId) ? undefined : taskId,
            });
        }
    };

    const handleSeasonSelection = (value: string) => {
        const season = seasonOptions.find((option) => option.value === value);
        const seasonId = parseInt(value, 10);
        setFormData({
            ...formData,
            linkedSeason: season?.label ?? "",
            linkedSeasonId: isNaN(seasonId) ? undefined : seasonId,
            linkedPlotId: season?.plotId,
        });
    };

    const handleVendorSelection = (value: string) => {
        if (value === "none") {
            setFormData({
                ...formData,
                vendor: "",
                vendorId: undefined,
            });
            return;
        }
        const vendorId = parseInt(value, 10);
        const vendor = supplierOptions.find((option) => option.value === value);
        setFormData({
            ...formData,
            vendor: vendor?.label ?? "",
            vendorId: isNaN(vendorId) ? undefined : vendorId,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-foreground text-xl">
                        {selectedExpense ? (
                            <>
                                <Edit className="w-5 h-5 text-secondary" />
                                Edit Expense
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5 text-primary" />
                                Add New Expense
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Fill in the expense details below. Fields marked with * are
                        required.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Date & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-foreground">
                                Date <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData({ ...formData, date: e.target.value })
                                }
                                className={`rounded-xl border-border focus:border-primary ${dateError ? "border-destructive" : ""}`}
                                aria-invalid={!!dateError}
                            />
                            {dateError && (
                                <p className="text-xs text-destructive">{dateError}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-foreground">
                                Category <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, category: value })
                                }
                            >
                                <SelectTrigger className={`rounded-xl border-border ${categoryError ? "border-destructive" : ""}`} aria-invalid={!!categoryError}>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Fertilizer">Fertilizer</SelectItem>
                                    <SelectItem value="Seeds">Seeds</SelectItem>
                                    <SelectItem value="Labor">Labor</SelectItem>
                                    <SelectItem value="Equipment">Equipment</SelectItem>
                                    <SelectItem value="Pesticide">Pesticide</SelectItem>
                                    <SelectItem value="Transportation">Transportation</SelectItem>
                                    <SelectItem value="Utilities">Utilities</SelectItem>
                                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {categoryError && (
                                <p className="text-xs text-destructive">{categoryError}</p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-foreground">
                            Description
                        </Label>
                        <Input
                            id="description"
                            placeholder="e.g., NPK Fertilizer 20-20-20"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            className="rounded-xl border-border focus:border-primary"
                        />
                    </div>

                    {/* Vendor */}
                    <div className="space-y-2">
                        <Label htmlFor="vendor" className="text-foreground">
                            Vendor/Supplier
                        </Label>
                        <Select
                            value={formData.vendorId ? String(formData.vendorId) : "none"}
                            onValueChange={handleVendorSelection}
                        >
                            <SelectTrigger className="rounded-xl border-border">
                                <SelectValue placeholder="Select supplier" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No supplier</SelectItem>
                                {supplierOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Linked Task & Season */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* LINKED TASK */}
                        <div className="space-y-2">
                            <Label htmlFor="linkedTask" className="text-foreground">
                                <div className="flex items-center gap-2">
                                    <ListTodo className="w-4 h-4" />
                                    Linked Task
                                </div>
                            </Label>
                            <Select
                                value={formData.linkedTask || "none"}
                                onValueChange={(value) => {
                                    if (value === "none") {
                                        setFormData({
                                            ...formData,
                                            linkedTask: "",
                                            linkedTaskId: undefined,
                                        });
                                    } else {
                                        handleTaskSelection(value);
                                    }
                                }}
                                disabled={isLoadingTasks || taskOptions.length === 0}
                            >
                                <SelectTrigger className="rounded-xl border-border">
                                    <SelectValue placeholder={
                                        isLoadingTasks
                                            ? "Loading tasks..."
                                            : taskOptions.length === 0
                                                ? "No tasks available"
                                                : "Select task (optional)"
                                    } />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        <span className="text-muted-foreground">No linked task</span>
                                    </SelectItem>
                                    {taskOptions.map((task) => (
                                        <SelectItem key={task.value} value={task.value}>
                                            {task.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {taskOptions.length === 0 && !isLoadingTasks && (
                                <p className="text-xs text-muted-foreground">
                                    No tasks found for this season
                                </p>
                            )}
                        </div>

                        {/* LINKED SEASON */}
                        <div className="space-y-2">
                            <Label htmlFor="linkedSeason" className="text-foreground">
                                Linked Season <span className="text-destructive">*</span>
                            </Label>
                            {isSeasonLocked ? (
                                <div className={`rounded-xl border border-border px-3 py-2 text-sm bg-muted/30 ${seasonError ? "border-destructive" : ""}`}>
                                    {lockedSeasonLabel ?? formData.linkedSeason ?? "Mùa vụ hiện tại"}
                                </div>
                            ) : (
                                <Select
                                    value={formData.linkedSeasonId ? String(formData.linkedSeasonId) : ""}
                                    onValueChange={handleSeasonSelection}
                                >
                                    <SelectTrigger className={`rounded-xl border-border ${seasonError ? "border-destructive" : ""}`} aria-invalid={!!seasonError}>
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
                            )}
                            {seasonError && (
                                <p className="text-xs text-destructive">{seasonError}</p>
                            )}
                        </div>
                    </div>

                    {/* Amount & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount" className="text-foreground">
                                Amount ({preferences.currency}) <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) =>
                                        setFormData({ ...formData, amount: e.target.value })
                                    }
                                    className={`pl-10 rounded-xl border-border focus:border-primary ${amountError ? "border-destructive" : ""}`}
                                    aria-invalid={!!amountError}
                                />
                            </div>
                            {amountError && (
                                <p className="text-xs text-destructive">{amountError}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-foreground">
                                Payment Status <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: ExpenseStatus) =>
                                    setFormData({ ...formData, status: value })
                                }
                            >
                                <SelectTrigger className={`rounded-xl border-border ${statusError ? "border-destructive" : ""}`} aria-invalid={!!statusError}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PAID">Paid</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="UNPAID">Unpaid</SelectItem>
                                </SelectContent>
                            </Select>
                            {statusError && (
                                <p className="text-xs text-destructive">{statusError}</p>
                            )}
                        </div>
                    </div>

                    {/* Upload Attachment */}
                    <div className="space-y-2">
                        <Label className="text-foreground">
                            Attachment (Receipt/Invoice)
                        </Label>
                        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary hover:bg-primary/5 transition-colors">
                            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                            <p className="text-sm text-foreground mb-1">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PDF, JPG, PNG (max 5MB)</p>
                            <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="mt-4"
                                onChange={(event) => {
                                    const file = event.target.files?.[0] ?? null;
                                    setFormData({
                                        ...formData,
                                        attachmentFile: file,
                                    });
                                }}
                            />
                            {formData.attachmentFile && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    Selected: {formData.attachmentFile.name}
                                </p>
                            )}
                            {!formData.attachmentFile && formData.attachmentUrl && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    Existing: {formData.attachmentName ?? "Receipt attached"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-foreground">
                            Additional Notes
                        </Label>
                        <Textarea
                            id="notes"
                            placeholder="Add any additional information..."
                            value={formData.notes}
                            onChange={(e) =>
                                setFormData({ ...formData, notes: e.target.value })
                            }
                            className="rounded-xl border-border focus:border-primary min-h-[100px]"
                        />
                    </div>

                    {/* Amount Preview */}
                    {formData.amount && (
                        <div className="p-4 rounded-xl bg-primary/10 border-2 border-primary/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                    <span className="text-foreground">Total Amount:</span>
                                </div>
                                <span className="text-2xl numeric text-primary">
                                    {formatMoney(Number(formData.amount), preferences.currency, preferences.locale)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="rounded-xl border-border"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddExpense}
                        className="bg-primary hover:bg-primary/90 text-white rounded-xl"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {selectedExpense ? "Update" : "Save"} Expense
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
