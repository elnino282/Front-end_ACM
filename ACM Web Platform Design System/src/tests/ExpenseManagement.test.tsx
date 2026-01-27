import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ExpenseManagement } from "@/features/farmer/expense-management";
import type { ExpenseFormData } from "@/features/farmer/expense-management/types";

const mockUseExpenseManagement = vi.fn();

vi.mock("@/features/farmer/expense-management/hooks/useExpenseManagement", () => ({
    useExpenseManagement: () => mockUseExpenseManagement(),
}));

vi.mock("@/features/farmer/expense-management/components/ExpenseAnalytics", () => ({
    ExpenseAnalytics: () => <div>Analytics</div>,
}));

vi.mock("@/shared/contexts", () => ({
    usePreferences: () => ({
        preferences: { currency: "USD", locale: "en-US" },
    }),
}));

describe("ExpenseManagement", () => {
    beforeEach(() => {
        const formData: ExpenseFormData = {
            date: "",
            category: "",
            description: "",
            linkedTask: "",
            linkedTaskId: undefined,
            linkedSeason: "Spring 2026",
            linkedSeasonId: 1,
            linkedPlotId: 1,
            amount: "",
            status: "PENDING",
            notes: "",
            vendor: "",
            vendorId: undefined,
            attachmentFile: null,
            attachmentName: undefined,
            attachmentUrl: undefined,
        };

        mockUseExpenseManagement.mockReturnValue({
            activeTab: "list",
            setActiveTab: vi.fn(),
            isAddExpenseOpen: false,
            setIsAddExpenseOpen: vi.fn(),
            selectedExpense: null,
            searchQuery: "",
            setSearchQuery: vi.fn(),
            selectedSeason: "1",
            setSelectedSeason: vi.fn(),
            selectedCategory: "all",
            setSelectedCategory: vi.fn(),
            selectedStatus: "all",
            setSelectedStatus: vi.fn(),
            seasonOptions: [{ value: "1", label: "Spring 2026" }],
            taskOptions: [],
            supplierOptions: [],
            isLoadingTasks: false,
            handleTaskChange: vi.fn(),
            expenses: [
                {
                    id: 1,
                    date: "2026-01-05",
                    category: "Fertilizer",
                    description: "NPK Fertilizer",
                    linkedSeason: "Spring 2026",
                    linkedSeasonId: 1,
                    linkedPlotId: 1,
                    amount: 5_000_000,
                    status: "PAID",
                    notes: "",
                },
            ],
            filteredExpenses: [
                {
                    id: 1,
                    date: "2026-01-05",
                    category: "Fertilizer",
                    description: "NPK Fertilizer",
                    linkedSeason: "Spring 2026",
                    linkedSeasonId: 1,
                    linkedPlotId: 1,
                    amount: 5_000_000,
                    status: "PAID",
                    notes: "",
                },
            ],
            totalCount: 1,
            formData,
            setFormData: vi.fn(),
            totalExpenses: 5_000_000,
            budgetUsagePercentage: 20,
            remainingBudget: 20_000_000,
            paidExpenses: 5_000_000,
            unpaidExpenses: 0,
            budgetAmount: 25_000_000,
            pendingExpenses: [],
            handleAddExpense: vi.fn(),
            handleEditExpense: vi.fn(),
            handleDeleteExpense: vi.fn(),
            handleQuickUpdate: vi.fn(),
            handleExportExpenses: vi.fn(),
            resetForm: vi.fn(),
            handleOpenAddExpense: vi.fn(),
            isLoading: false,
            error: null,
            hasSeason: true,
            isDeleting: false,
            showValidationErrors: false,
        });
    });

    it("renders list view and budget tracker with mocked data", () => {
        render(
            <MemoryRouter>
                <ExpenseManagement />
            </MemoryRouter>
        );

        expect(screen.getByText("Expense Management")).toBeInTheDocument();
        expect(screen.getByText("Fertilizer")).toBeInTheDocument();
        expect(screen.getByText("Budget Tracker")).toBeInTheDocument();
        expect(screen.getAllByText("$200.00").length).toBeGreaterThan(0);
    });
});
