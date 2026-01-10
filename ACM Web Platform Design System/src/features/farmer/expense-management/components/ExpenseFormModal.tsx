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

interface ExpenseFormModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selectedExpense: Expense | null;
    formData: ExpenseFormData;
    setFormData: (data: ExpenseFormData) => void;
    handleAddExpense: () => void;
    resetForm: () => void;
    seasonOptions: { value: string; label: string }[];
    taskOptions?: TaskOption[];
    isLoadingTasks?: boolean;
    onTaskChange?: (taskId: string) => void;
}

export function ExpenseFormModal({
    isOpen,
    setIsOpen,
    selectedExpense,
    formData,
    setFormData,
    handleAddExpense,
    resetForm,
    seasonOptions,
    taskOptions = [],
    isLoadingTasks = false,
    onTaskChange,
}: ExpenseFormModalProps) {
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
                                className="rounded-xl border-border focus:border-primary"
                            />
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
                                <SelectTrigger className="rounded-xl border-border">
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
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="vendor"
                                placeholder="e.g., AgroSupply Co."
                                value={formData.vendor}
                                onChange={(e) =>
                                    setFormData({ ...formData, vendor: e.target.value })
                                }
                                className="pl-10 rounded-xl border-border focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Linked Task & Season */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* LINKED TASK - Now a Dropdown */}
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

                        {/* LINKED SEASON - Dropdown */}
                        <div className="space-y-2">
                            <Label htmlFor="linkedSeason" className="text-foreground">
                                Linked Season
                            </Label>
                            <Select
                                value={formData.linkedSeason}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, linkedSeason: value })
                                }
                            >
                                <SelectTrigger className="rounded-xl border-border">
                                    <SelectValue placeholder="Select season" />
                                </SelectTrigger>
                            <SelectContent>
                                {seasonOptions
                                    .filter((option) => option.value !== "all")
                                    .map((option) => (
                                        <SelectItem key={option.value} value={option.label}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                    {/* Amount & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount" className="text-foreground">
                                Amount ($) <span className="text-destructive">*</span>
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
                                    className="pl-10 rounded-xl border-border focus:border-primary"
                                />
                            </div>
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
                                <SelectTrigger className="rounded-xl border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="unpaid">Unpaid</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="recorded">Recorded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Upload Attachment */}
                    <div className="space-y-2">
                        <Label className="text-foreground">
                            Attachment (Receipt/Invoice)
                        </Label>
                        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                            <p className="text-sm text-foreground mb-1">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PDF, JPG, PNG (max 5MB)</p>
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
                                    ${parseFloat(formData.amount).toFixed(2)}
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



