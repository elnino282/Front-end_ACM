import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useExpenseManagement } from "@/features/farmer/expense-management/hooks/useExpenseManagement";
import type { ReactNode } from "react";

const mockCreate = vi.fn().mockResolvedValue({ id: 10 });
const mockRefetch = vi.fn();
const mockRefetchTracker = vi.fn();

vi.mock("sonner", () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

vi.mock("@/shared/contexts", () => ({
    useOptionalSeason: () => ({
        seasons: [{ id: 1, seasonName: "Spring 2026", plotId: 1 }],
        selectedSeasonId: 1,
        setSelectedSeasonId: vi.fn(),
    }),
}));

vi.mock("@/entities/expense", () => ({
    expenseApi: {
        uploadAttachment: vi.fn(),
    },
    expenseKeys: {
        detail: (id: number) => ["expense", id],
        lists: () => ["expenses"],
    },
    useAllFarmerExpenses: () => ({
        data: { items: [], totalElements: 0 },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
    }),
    useBudgetTracker: () => ({
        data: { total: 0, paid: 0, unpaid: 0, budgetAmount: 1000, usagePercent: 0, remaining: 1000 },
        isLoading: false,
        refetch: mockRefetchTracker,
    }),
    useCreateExpense: () => ({
        mutateAsync: mockCreate,
        isPending: false,
    }),
    useUpdateExpense: () => ({
        mutateAsync: vi.fn(),
        isPending: false,
    }),
    useDeleteExpense: () => ({
        mutate: vi.fn(),
        isPending: false,
    }),
}));

vi.mock("@/entities/task", () => ({
    useTasksBySeason: () => ({
        data: { items: [] },
        isLoading: false,
    }),
}));

vi.mock("@/entities/supplies", () => ({
    useAllSuppliers: () => ({
        data: [],
    }),
}));

describe("useExpenseManagement", () => {
    it("creates expense and refreshes list/tracker", async () => {
        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        const wrapper = ({ children }: { children: ReactNode }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );

        const { result } = renderHook(() => useExpenseManagement(), { wrapper });

        act(() => {
            result.current.setFormData({
                ...result.current.formData,
                date: "2026-01-05",
                category: "Fertilizer",
                amount: "100",
                status: "PENDING",
                linkedSeasonId: 1,
                linkedPlotId: 1,
            });
        });

        await act(async () => {
            await result.current.handleAddExpense();
        });

        expect(mockCreate).toHaveBeenCalled();
        expect(mockRefetch).toHaveBeenCalled();
        expect(mockRefetchTracker).toHaveBeenCalled();
    });
});
