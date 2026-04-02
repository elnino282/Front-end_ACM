import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useOptionalSeason } from "@/shared/contexts";
import {
    expenseApi,
    expenseKeys,
    useAllFarmerExpenses,
    useBudgetTracker,
    useCreateExpense,
    useUpdateExpense,
    useDeleteExpense,
    type Expense as ApiExpense,
} from "@/entities/expense";
import { useTasksBySeason, type Task as ApiTask } from "@/entities/task";
import { useAllSuppliers } from "@/entities/supplies";
import type { Expense, ExpenseFormData, TaskOption } from "../types";

const INITIAL_FORM_DATA: ExpenseFormData = {
    date: "",
    category: "",
    description: "",
    linkedTask: "",
    linkedTaskId: undefined,
    linkedSeason: "",
    linkedSeasonId: undefined,
    linkedPlotId: undefined,
    amount: "",
    status: "PENDING",
    notes: "",
    vendor: "",
    vendorId: undefined,
    attachmentFile: null,
    attachmentName: undefined,
    attachmentUrl: undefined,
};

const CATEGORY_KEYWORDS: Array<{ keywords: string[]; category: string }> = [
    { keywords: ["fertilizer", "npk", "urea", "compost"], category: "Fertilizer" },
    { keywords: ["seed", "seedling", "seedlings"], category: "Seeds" },
    { keywords: ["labor", "wage", "salary"], category: "Labor" },
    { keywords: ["tractor", "equipment", "tool", "machinery"], category: "Equipment" },
    { keywords: ["pesticide", "spray", "herbicide", "fungicide"], category: "Pesticide" },
    { keywords: ["transport", "delivery", "shipping", "logistics"], category: "Transportation" },
    { keywords: ["utility", "electric", "water", "fuel"], category: "Utilities" },
    { keywords: ["repair", "maintenance", "service"], category: "Maintenance" },
];

const inferCategory = (itemName: string | null | undefined): string => {
    if (!itemName) return "Other";
    const value = itemName.toLowerCase();
    for (const entry of CATEGORY_KEYWORDS) {
        if (entry.keywords.some((keyword) => value.includes(keyword))) {
            return entry.category;
        }
    }
    return "Other";
};

const mapApiExpense = (expense: ApiExpense, fallbackSeasonName: string): Expense => {
    const amount = expense.amount ?? expense.totalCost ?? ((expense.unitPrice ?? 0) * (expense.quantity ?? 1));
    const status = expense.paymentStatus ?? "PENDING";
    return {
        id: expense.id,
        date: expense.expenseDate,
        category: expense.category ?? inferCategory(expense.itemName),
        description: expense.itemName ?? expense.category ?? "Expense",
        linkedTask: expense.taskTitle ?? "",
        linkedTaskId: expense.taskId ?? undefined,
        linkedSeason: expense.seasonName ?? fallbackSeasonName,
        linkedSeasonId: expense.seasonId ?? undefined,
        linkedPlotId: expense.plotId ?? undefined,
        linkedPlotName: expense.plotName ?? undefined,
        amount: amount ?? 0,
        status: status as Expense["status"],
        notes: expense.note ?? "",
        vendor: expense.vendorName ?? "",
        vendorId: expense.vendorId ?? undefined,
        attachmentUrl: expense.attachmentUrl ?? undefined,
        attachmentName: expense.attachmentName ?? undefined,
    };
};

export function useExpenseManagement() {
    const queryClient = useQueryClient();
    const seasonContext = useOptionalSeason();
    const seasons = seasonContext?.seasons ?? [];
    const seasonId = seasonContext?.selectedSeasonId ?? null;
    const setSeasonId = seasonContext?.setSelectedSeasonId ?? (() => {});

    const selectedSeason = seasonId ? String(seasonId) : "";

    const currentSeasonPlotId = useMemo(() => {
        if (!seasonId) return undefined;
        const season = seasons.find((s) => s.id === seasonId);
        return season?.plotId ?? undefined;
    }, [seasonId, seasons]);

    const seasonOptions = useMemo(() => {
        return seasons.map((season) => ({
            value: String(season.id),
            label: season.seasonName,
            plotId: season.plotId,
        }));
    }, [seasons]);

    const selectedSeasonName = useMemo(() => {
        if (!seasonId) return "";
        return seasons.find((season) => season.id === seasonId)?.seasonName ?? "";
    }, [seasonId, seasons]);

    // Tab State
    const [activeTab, setActiveTab] = useState("list");

    // Modal State
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");

    // Form State
    const [formData, setFormData] = useState<ExpenseFormData>(INITIAL_FORM_DATA);
    const [showValidationErrors, setShowValidationErrors] = useState(false);

    const resetForm = useCallback(() => {
        setFormData({
            ...INITIAL_FORM_DATA,
            linkedSeason: selectedSeasonName || "",
            linkedSeasonId: seasonId ?? undefined,
            linkedPlotId: currentSeasonPlotId,
        });
        setSelectedExpense(null);
        setShowValidationErrors(false);
    }, [selectedSeasonName, seasonId, currentSeasonPlotId]);

    const hasSeason = !!seasonId && seasonId > 0;

    const listParams = useMemo(() => ({
        seasonId: seasonId ?? undefined,
        q: searchQuery.trim() || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        paymentStatus: selectedStatus !== "all" ? (selectedStatus as Expense["status"]) : undefined,
        page: 0,
        size: 200,
    }), [seasonId, searchQuery, selectedCategory, selectedStatus]);

    const {
        data: expenseData,
        isLoading,
        error,
        refetch,
    } = useAllFarmerExpenses(listParams, { enabled: hasSeason });

    const {
        data: tracker,
        isLoading: isLoadingTracker,
        refetch: refetchTracker,
    } = useBudgetTracker(seasonId ?? 0, { enabled: hasSeason });

    const {
        data: taskData,
        isLoading: isLoadingTasks,
    } = useTasksBySeason(seasonId ?? 0, {
        page: 0,
        size: 100,
        sortBy: "title",
        sortDirection: "asc",
    }, { enabled: hasSeason });

    const { data: supplierData } = useAllSuppliers();

    const taskOptions: TaskOption[] = useMemo(() => {
        const tasks = taskData?.items ?? [];
        return tasks.map((task: ApiTask) => ({
            value: String(task.taskId),
            label: task.title,
            id: task.taskId,
        }));
    }, [taskData]);

    const supplierOptions = useMemo(() => {
        const items = supplierData ?? [];
        return items.map((supplier) => ({
            value: String(supplier.id),
            label: supplier.name,
            id: supplier.id,
        }));
    }, [supplierData]);

    const createMutation = useCreateExpense(seasonId ?? 0);
    const updateMutation = useUpdateExpense(seasonId ?? 0);
    const deleteMutation = useDeleteExpense(seasonId ?? 0);

    const expenses = useMemo(() => {
        const items = expenseData?.items ?? [];
        return items.map((expense) => mapApiExpense(expense, selectedSeasonName));
    }, [expenseData, selectedSeasonName]);

    const totalCount = expenseData?.totalElements ?? expenses.length;

    const totalExpenses = tracker?.total ?? 0;
    const budgetUsagePercentage = tracker?.usagePercent ?? null;
    const remainingBudget = tracker?.remaining ?? null;
    const paidExpenses = tracker?.paid ?? 0;
    const unpaidExpenses = tracker?.unpaid ?? 0;
    const budgetAmount = tracker?.budgetAmount ?? null;

    const pendingExpenses = useMemo(() =>
        expenses.filter((expense) => expense.status === "PENDING" || expense.status === "UNPAID"),
    [expenses]);

    const filteredExpenses = expenses;

    const handleAddExpense = useCallback(async () => {
        if (!hasSeason) {
            toast.error("Select a season", {
                description: "Choose a season before recording expenses.",
            });
            return;
        }

        if (!formData.date || !formData.category || !formData.amount) {
            setShowValidationErrors(true);
            toast.error("Missing Required Fields", {
                description: "Please fill in all required fields marked with *",
            });
            return;
        }

        const amount = Number(formData.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
            setShowValidationErrors(true);
            toast.error("Invalid amount", {
                description: "Enter a valid amount greater than 0.",
            });
            return;
        }

        // Validation: Date cannot be in the future
        const expenseDate = new Date(formData.date);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        if (expenseDate > today) {
            setShowValidationErrors(true);
            toast.error("Invalid date", {
                description: "Expense date cannot be in the future.",
            });
            return;
        }

        const selectedSeasonId = formData.linkedSeasonId ?? seasonId;
        if (!selectedSeasonId) {
            setShowValidationErrors(true);
            toast.error("Season required", {
                description: "Select a season for this expense.",
            });
            return;
        }

        const plotId = formData.linkedPlotId ?? currentSeasonPlotId;
        if (!plotId) {
            setShowValidationErrors(true);
            toast.error("Missing Plot Information", {
                description: "Season must have an associated plot.",
            });
            return;
        }

        const taskId = formData.linkedTaskId ??
            (formData.linkedTask ? parseInt(formData.linkedTask, 10) : undefined);

        const payload = {
            amount: amount,
            expenseDate: formData.date,
            category: formData.category,
            paymentStatus: formData.status,
            plotId: plotId,
            taskId: taskId && !isNaN(taskId) ? taskId : undefined,
            vendorId: formData.vendorId,
            note: formData.notes || undefined,
            itemName: formData.description.trim() || formData.category,
            unitPrice: amount,
            quantity: 1,
        };

        try {
            const savedExpense = selectedExpense
                ? await updateMutation.mutateAsync({
                    id: selectedExpense.id,
                    data: {
                        ...payload,
                        seasonId: selectedSeasonId,
                    },
                })
                : await createMutation.mutateAsync(payload);

            if (formData.attachmentFile) {
                await expenseApi.uploadAttachment(savedExpense.id, formData.attachmentFile);
                queryClient.invalidateQueries({ queryKey: expenseKeys.detail(savedExpense.id) });
                queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
            }

            toast.success(selectedExpense ? "Expense Updated" : "Expense Added", {
                description: `${formData.description || formData.category} has been recorded.`,
            });

            // Budget warning: Check if spending exceeds 80% after this expense
            if (!selectedExpense && budgetAmount && budgetAmount > 0) {
                const newTotal = totalExpenses + amount;
                const newUsagePercent = (newTotal / budgetAmount) * 100;
                
                if (newUsagePercent >= 100) {
                    toast.warning("Budget Exceeded!", {
                        description: `You have exceeded your season budget. Current spending: ${newUsagePercent.toFixed(1)}% of budget.`,
                        duration: 6000,
                    });
                } else if (newUsagePercent >= 80) {
                    toast.warning("Budget Warning", {
                        description: `You have used ${newUsagePercent.toFixed(1)}% of your season budget. Consider reviewing your expenses.`,
                        duration: 5000,
                    });
                }
            }

            setIsAddExpenseOpen(false);
            setShowValidationErrors(false);
            resetForm();
            refetch();
            refetchTracker();
        } catch (err: any) {
            toast.error(selectedExpense ? "Failed to update expense" : "Failed to add expense", {
                description: err?.message ?? "Please try again.",
            });
        }
    }, [
        hasSeason,
        formData,
        seasonId,
        currentSeasonPlotId,
        selectedExpense,
        updateMutation,
        createMutation,
        queryClient,
        refetch,
        refetchTracker,
        resetForm,
        budgetAmount,
        totalExpenses,
    ]);

    const handleEditExpense = (expense: Expense) => {
        setSelectedExpense(expense);
        setFormData({
            date: expense.date,
            category: expense.category,
            description: expense.description,
            linkedTask: expense.linkedTaskId ? String(expense.linkedTaskId) : "",
            linkedTaskId: expense.linkedTaskId,
            linkedSeason: expense.linkedSeason || "",
            linkedSeasonId: expense.linkedSeasonId,
            linkedPlotId: expense.linkedPlotId,
            amount: String(expense.amount),
            status: expense.status,
            notes: expense.notes || "",
            vendor: expense.vendor || "",
            vendorId: expense.vendorId,
            attachmentFile: null,
            attachmentName: expense.attachmentName,
            attachmentUrl: expense.attachmentUrl,
        });
        setShowValidationErrors(false);
        setIsAddExpenseOpen(true);
    };

    const handleDeleteExpense = (id: number) => {
        deleteMutation.mutate(id, {
            onSuccess: () => toast.success("Expense Deleted"),
            onError: (err) =>
                toast.error("Failed to delete expense", { description: err.message }),
        });
    };

    const handleOpenAddExpense = () => {
        resetForm();
        setShowValidationErrors(false);
        setIsAddExpenseOpen(true);
    };

    const handleSeasonChange = (value: string) => {
        const numericId = parseInt(value, 10);
        if (!isNaN(numericId)) {
            setSeasonId(numericId);
        }
    };

    const handleTaskChange = (taskIdStr: string) => {
        const taskId = parseInt(taskIdStr, 10);
        setFormData({
            ...formData,
            linkedTask: taskIdStr,
            linkedTaskId: isNaN(taskId) ? undefined : taskId,
        });
    };

    const handleExportExpenses = useCallback(async () => {
        if (!hasSeason) {
            toast.error("Select a season", {
                description: "Choose a season before exporting expenses.",
            });
            return;
        }

        try {
            const { page, size, ...filters } = listParams;
            const blob = await expenseApi.exportCsv(filters);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            const date = new Date().toISOString().split("T")[0];
            const seasonLabel = selectedSeasonName ? selectedSeasonName.replace(/\s+/g, "-") : "season";
            link.href = url;
            link.download = `expenses-${seasonLabel}-${date}.csv`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            toast.error("Export failed", {
                description: err?.message ?? "Please try again.",
            });
        }
    }, [hasSeason, listParams, selectedSeasonName]);

    const handleQuickUpdate = useCallback(async (expense: Expense, updates: { status?: Expense["status"]; notes?: string }) => {
        if (!expense.linkedSeasonId || !expense.linkedPlotId) {
            toast.error("Cannot update expense", {
                description: "Missing season or plot information.",
            });
            return;
        }

        try {
            await updateMutation.mutateAsync({
                id: expense.id,
                data: {
                    amount: expense.amount,
                    expenseDate: expense.date,
                    category: expense.category,
                    seasonId: expense.linkedSeasonId,
                    plotId: expense.linkedPlotId,
                    paymentStatus: updates.status ?? expense.status,
                    taskId: expense.linkedTaskId,
                    vendorId: expense.vendorId,
                    note: updates.notes ?? expense.notes,
                    itemName: expense.description,
                    unitPrice: expense.amount,
                    quantity: 1,
                },
            });
            refetch();
            refetchTracker();
        } catch (err: any) {
            toast.error("Failed to update expense", {
                description: err?.message ?? "Please try again.",
            });
        }
    }, [refetch, refetchTracker, updateMutation]);

    return {
        // Tab State
        activeTab,
        setActiveTab,

        // Modal State
        isAddExpenseOpen,
        setIsAddExpenseOpen,
        selectedExpense,

        // Filter States
        searchQuery,
        setSearchQuery,
        selectedSeason,
        setSelectedSeason: handleSeasonChange,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        seasonOptions,

        // Task options for dropdown
        taskOptions,
        isLoadingTasks,
        handleTaskChange,

        // Supplier options for dropdown
        supplierOptions,

        // Expenses Data
        expenses,
        filteredExpenses,
        totalCount,

        // Form State
        formData,
        setFormData,
        showValidationErrors,

        // Computed Values
        totalExpenses,
        budgetUsagePercentage,
        remainingBudget,
        paidExpenses,
        unpaidExpenses,
        budgetAmount,
        pendingExpenses,

        // Handlers
        handleAddExpense,
        handleEditExpense,
        handleDeleteExpense,
        resetForm,
        handleOpenAddExpense,
        handleExportExpenses,
        handleQuickUpdate,

        // API state
        isLoading,
        isLoadingTracker,
        error: error ?? null,
        refetch,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        hasSeason,
    };
}
