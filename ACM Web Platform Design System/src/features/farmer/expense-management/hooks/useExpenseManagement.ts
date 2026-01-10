import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useOptionalSeason } from "@/shared/contexts";
import {
    useExpensesBySeason,
    useCreateExpense,
    useUpdateExpense,
    useDeleteExpense,
    type Expense as ApiExpense,
} from "@/entities/expense";
import { useTasksBySeason, type Task as ApiTask } from "@/entities/task";
import type { Expense, ExpenseFormData, TaskOption } from "../types";
import { BUDGET_CONFIG } from "../constants";

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
    status: "recorded",
    notes: "",
    vendor: "",
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
    // Use new 'amount' field if available, otherwise calculate from legacy fields
    const amount = expense.amount ?? expense.totalCost ?? ((expense.unitPrice ?? 0) * (expense.quantity ?? 1));
    return {
        id: String(expense.id),
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
        status: "recorded",
        notes: expense.note ?? "",
        vendor: "",
    };
};

export function useExpenseManagement() {
    const seasonContext = useOptionalSeason();
    const seasons = seasonContext?.seasons ?? [];
    const [fallbackSeasonId, setFallbackSeasonId] = useState<number | null>(null);
    const seasonId = seasonContext?.selectedSeasonId ?? fallbackSeasonId;
    const setSeasonId = seasonContext?.setSelectedSeasonId ?? setFallbackSeasonId;

    const selectedSeason = seasonId ? String(seasonId) : "all";

    // Get current season's plot ID for BR176 validation
    const currentSeasonPlotId = useMemo(() => {
        if (!seasonId) return undefined;
        const season = seasons.find((s) => s.id === seasonId);
        return season?.plotId ?? undefined;
    }, [seasonId, seasons]);

    const seasonOptions = useMemo(() => {
        const options = seasons.map((season) => ({
            value: String(season.id),
            label: season.seasonName,
            plotId: season.plotId,
        }));
        return [{ value: "all", label: "All Seasons", plotId: undefined }, ...options];
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

    const resetForm = useCallback(() => {
        setFormData({
            ...INITIAL_FORM_DATA,
            linkedSeason: selectedSeasonName || '',
            linkedSeasonId: seasonId ?? undefined,
            linkedPlotId: currentSeasonPlotId,
        });
        setSelectedExpense(null);
    }, [selectedSeasonName, seasonId, currentSeasonPlotId]);

    const hasSeason = !!seasonId && seasonId > 0;
    
    // Fetch expenses
    const {
        data: expenseData,
        isLoading,
        error,
        refetch,
    } = useExpensesBySeason(seasonId ?? 0, undefined, { enabled: hasSeason });

    // Fetch tasks for the current season (for Linked Task dropdown)
    const {
        data: taskData,
        isLoading: isLoadingTasks,
    } = useTasksBySeason(seasonId ?? 0, { 
        page: 0, 
        size: 100, 
        sortBy: 'title', 
        sortDirection: 'asc' 
    }, { enabled: hasSeason });

    // Map tasks to dropdown options
    const taskOptions: TaskOption[] = useMemo(() => {
        const tasks = taskData?.items ?? [];
        return tasks.map((task: ApiTask) => ({
            value: String(task.taskId),
            label: task.title,
            id: task.taskId,
        }));
    }, [taskData]);

    const createMutation = useCreateExpense(seasonId ?? 0, {
        onSuccess: () => {
            toast.success("Expense Added", {
                description: `${formData.description || formData.category} has been recorded.`,
            });
            setIsAddExpenseOpen(false);
            resetForm();
        },
        onError: (err) => {
            toast.error("Failed to add expense", {
                description: err.message,
            });
        },
    });

    const updateMutation = useUpdateExpense(seasonId ?? 0, {
        onSuccess: () => {
            toast.success("Expense Updated");
            setIsAddExpenseOpen(false);
            resetForm();
        },
        onError: (err) => {
            toast.error("Failed to update expense", {
                description: err.message,
            });
        },
    });

    const deleteMutation = useDeleteExpense(seasonId ?? 0, {
        onSuccess: () => {
            toast.success("Expense Deleted");
        },
        onError: (err) => {
            toast.error("Failed to delete expense", {
                description: err.message,
            });
        },
    });

    const expenses = useMemo(() => {
        const items = expenseData?.items ?? [];
        return items.map((expense) => mapApiExpense(expense, selectedSeasonName));
    }, [expenseData, selectedSeasonName]);

    // Computed Values
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budgetUsagePercentage =
        (totalExpenses / BUDGET_CONFIG.totalBudget) * 100;
    const remainingBudget = BUDGET_CONFIG.totalBudget - totalExpenses;

    const paidExpenses = expenses
        .filter((e) => e.status === "paid")
        .reduce((sum, e) => sum + e.amount, 0);

    const unpaidExpenses = expenses
        .filter((e) => e.status === "unpaid" || e.status === "pending")
        .reduce((sum, e) => sum + e.amount, 0);

    // Filtered Expenses
    const filteredExpenses = expenses.filter((expense) => {
        const matchesSearch =
            searchQuery === "" ||
            expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expense.vendor?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === "all" || expense.category === selectedCategory;

        const matchesStatus =
            selectedStatus === "all" || expense.status === selectedStatus;

        const matchesSeason =
            selectedSeason === "all" ||
            expense.linkedSeason === selectedSeasonName;

        return matchesSearch && matchesSeason && matchesCategory && matchesStatus;
    });

    const handleAddExpense = () => {
        if (!hasSeason) {
            toast.error("Select a season", {
                description: "Choose a season before recording expenses.",
            });
            return;
        }

        if (!formData.date || !formData.category || !formData.amount) {
            toast.error("Missing Required Fields", {
                description: "Please fill in all required fields marked with *",
            });
            return;
        }

        const amount = Number(formData.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
            toast.error("Invalid amount", {
                description: "Enter a valid amount greater than 0.",
            });
            return;
        }

        // Get plot ID for the selected season
        const plotId = formData.linkedPlotId ?? currentSeasonPlotId;
        if (!plotId) {
            toast.error("Missing Plot Information", {
                description: "Season must have an associated plot.",
            });
            return;
        }

        // Parse task ID if selected
        const taskId = formData.linkedTaskId ?? 
            (formData.linkedTask ? parseInt(formData.linkedTask, 10) : undefined);

        // Build BR176-compliant payload
        const payload = {
            amount: amount,
            expenseDate: formData.date,
            category: formData.category,
            plotId: plotId,
            taskId: taskId && !isNaN(taskId) ? taskId : undefined,
            note: formData.notes || undefined,
            // Legacy fields for backward compatibility
            itemName: formData.description.trim() || formData.category,
            unitPrice: amount,
            quantity: 1,
        };

        if (selectedExpense) {
            const expenseId = parseInt(selectedExpense.id, 10);
            if (!isNaN(expenseId)) {
                updateMutation.mutate({ 
                    id: expenseId, 
                    data: {
                        ...payload,
                        seasonId: seasonId!,
                    } 
                });
            }
        } else {
            createMutation.mutate(payload);
        }

        const newTotal = totalExpenses + amount;
        const newPercentage = (newTotal / BUDGET_CONFIG.totalBudget) * 100;
        if (newPercentage >= BUDGET_CONFIG.dangerThreshold) {
            toast.error("Budget Alert!", {
                description: `You've used ${newPercentage.toFixed(1)}% of your budget!`,
            });
        } else if (newPercentage >= BUDGET_CONFIG.warningThreshold) {
            toast.warning("Budget Warning", {
                description: `You've used ${newPercentage.toFixed(1)}% of your budget.`,
            });
        }
    };

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
        });
        setIsAddExpenseOpen(true);
    };

    const handleDeleteExpense = (id: string) => {
        const expenseId = parseInt(id, 10);
        if (!isNaN(expenseId)) {
            deleteMutation.mutate(expenseId);
        }
    };

    const handleOpenAddExpense = () => {
        resetForm();
        setIsAddExpenseOpen(true);
    };

    const handleSeasonChange = (value: string) => {
        if (value === "all") {
            setSeasonId(null);
            return;
        }
        const numericId = parseInt(value, 10);
        if (!isNaN(numericId)) {
            setSeasonId(numericId);
        }
    };

    // Handle task selection in form
    const handleTaskChange = (taskIdStr: string) => {
        const taskId = parseInt(taskIdStr, 10);
        const selectedTask = taskOptions.find(t => t.id === taskId);
        setFormData({
            ...formData,
            linkedTask: taskIdStr,
            linkedTaskId: isNaN(taskId) ? undefined : taskId,
        });
    };

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

        // Expenses Data
        expenses,
        filteredExpenses,

        // Form State
        formData,
        setFormData,

        // Computed Values
        totalExpenses,
        budgetUsagePercentage,
        remainingBudget,
        paidExpenses,
        unpaidExpenses,

        // Handlers
        handleAddExpense,
        handleEditExpense,
        handleDeleteExpense,
        resetForm,
        handleOpenAddExpense,

        // API state
        isLoading,
        error: error ?? null,
        refetch,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}



