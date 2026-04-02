import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/hooks/useI18n";
import { ConfirmDialog, PageContainer, PageHeader } from "@/shared/ui";
import { BarChart3, Bell, DollarSign, Download, FileText, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AIOptimizationTips } from "./components/AIOptimizationTips";
import { BudgetTracker } from "./components/BudgetTracker";
import { ExpenseAnalytics } from "./components/ExpenseAnalytics";
import { ExpenseDetailDrawer } from "./components/ExpenseDetailDrawer";
import { ExpenseFilters } from "./components/ExpenseFilters";
import { ExpenseFormModal } from "./components/ExpenseFormModal";
import { ExpenseRemindersPanel } from "./components/ExpenseRemindersPanel";
import { ExpenseTable } from "./components/ExpenseTable";
import { UpcomingPayables } from "./components/UpcomingPayables";
import { useExpenseManagement } from "./hooks/useExpenseManagement";
import type { Expense } from "./types";

export function ExpenseManagement() {
    const { seasonId: workspaceSeasonIdParam } = useParams();
    const workspaceSeasonId = Number(workspaceSeasonIdParam);
    const isWorkspaceScoped = Number.isFinite(workspaceSeasonId) && workspaceSeasonId > 0;

    const [searchParams, setSearchParams] = useSearchParams();
    const {
        activeTab,
        setActiveTab,
        isAddExpenseOpen,
        setIsAddExpenseOpen,
        selectedExpense,
        searchQuery,
        setSearchQuery,
        selectedSeason,
        setSelectedSeason,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        seasonOptions,
        taskOptions,
        supplierOptions,
        isLoadingTasks,
        handleTaskChange,
        expenses,
        filteredExpenses,
        totalCount,
        formData,
        setFormData,
        totalExpenses,
        budgetUsagePercentage,
        remainingBudget,
        paidExpenses,
        unpaidExpenses,
        budgetAmount,
        pendingExpenses,
        handleAddExpense,
        handleEditExpense,
        handleDeleteExpense,
        handleQuickUpdate,
        handleExportExpenses,
        resetForm,
        handleOpenAddExpense,
        isLoading,
        error,
        hasSeason,
        isDeleting,
        showValidationErrors,
    } = useExpenseManagement();

    const { t } = useI18n();
    const [isRemindersOpen, setIsRemindersOpen] = useState(false);
    const [detailExpense, setDetailExpense] = useState<Expense | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const qParam = searchParams.get("q") ?? "";
    const seasonIdParam = Number(searchParams.get("seasonId"));
    const expenseIdParam = Number(searchParams.get("expenseId"));
    const parsedSeasonId = Number.isFinite(seasonIdParam) ? seasonIdParam : null;
    const parsedExpenseId = Number.isFinite(expenseIdParam) ? expenseIdParam : null;

    const handleDetailOpenChange = (open: boolean) => {
        if (!open && searchParams.get("expenseId")) {
            const next = new URLSearchParams(searchParams);
            next.delete("expenseId");
            setSearchParams(next, { replace: true });
        }
        if (!open) {
            setDetailExpense(null);
        }
    };

    useEffect(() => {
        if (qParam !== searchQuery) {
            setSearchQuery(qParam);
        }
    }, [qParam, searchQuery, setSearchQuery]);

    useEffect(() => {
        if (!isWorkspaceScoped) return;
        const workspaceSeason = String(workspaceSeasonId);
        if (selectedSeason === workspaceSeason) return;
        setSelectedSeason(workspaceSeason);
    }, [isWorkspaceScoped, workspaceSeasonId, selectedSeason, setSelectedSeason]);

    useEffect(() => {
        if (isWorkspaceScoped) return;
        if (!parsedSeasonId) return;
        if (selectedSeason === String(parsedSeasonId)) return;
        setSelectedSeason(String(parsedSeasonId));
    }, [isWorkspaceScoped, parsedSeasonId, selectedSeason, setSelectedSeason]);

    useEffect(() => {
        if (!parsedExpenseId) return;
        if (detailExpense?.id === parsedExpenseId) return;
        const match = expenses.find((expense) => expense.id === parsedExpenseId);
        if (match) {
            setDetailExpense(match);
        }
    }, [parsedExpenseId, detailExpense?.id, expenses]);

    const scopedSeasonLabel = isWorkspaceScoped
        ? seasonOptions.find((option) => option.value === String(workspaceSeasonId))?.label
        : undefined;

    return (
        <PageContainer>
            <Card className="mb-6 border border-border rounded-xl shadow-sm">
                <CardContent className="px-6 py-4">
                    <PageHeader
                        className="mb-0"
                        icon={<DollarSign className="w-8 h-8" />}
                        title={t('expenses.pageTitle')}
                        subtitle={t('expenses.subtitle')}
                        actions={
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsRemindersOpen(true)}
                                >
                                    <Bell className="w-4 h-4 mr-2" />
                                    {t('expenses.reminders')}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleExportExpenses}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    {t('expenses.export')}
                                </Button>
                                <Button
                                    onClick={handleOpenAddExpense}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    {t('expenses.createButton')}
                                </Button>
                            </>
                        }
                    />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                <div className="space-y-6">
                    <Card>
                        <CardContent className="px-6 py-4">
                            <ExpenseFilters
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                selectedSeason={selectedSeason}
                                setSelectedSeason={setSelectedSeason}
                                seasonOptions={seasonOptions}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                selectedStatus={selectedStatus}
                                setSelectedStatus={setSelectedStatus}
                                isSeasonLocked={isWorkspaceScoped}
                                lockedSeasonLabel={scopedSeasonLabel}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-border rounded-2xl shadow-sm">
                        <CardContent className="px-6 py-4">
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted p-1 rounded-xl">
                                    <TabsTrigger
                                        value="list"
                                        className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        {t('expenses.tabs.list')}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="analytics"
                                        className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                                    >
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        {t('expenses.tabs.analytics')}
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="list" className="space-y-4">
                                    {error && (
                                        <div className="rounded-xl border border-border bg-card p-4 text-sm text-destructive">
                                            Failed to load expenses: {error.message}
                                        </div>
                                    )}
                                    {!hasSeason && !isLoading && (
                                        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground space-y-3">
                                            <div>Select a season to view expenses.</div>
                                            <Button variant="outline" asChild>
                                                <Link to="/farmer/seasons">Create/Select Season</Link>
                                            </Button>
                                        </div>
                                    )}
                                    {isLoading ? (
                                        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
                                            Loading expenses...
                                        </div>
                                    ) : (
                                        <ExpenseTable
                                            filteredExpenses={filteredExpenses}
                                            totalExpenses={totalCount}
                                            handleEditExpense={handleEditExpense}
                                            handleDeleteExpense={(expense) => {
                                                setDeleteTarget(expense);
                                                setDeleteDialogOpen(true);
                                            }}
                                            handleViewExpense={(expense) => setDetailExpense(expense)}
                                            onAddExpense={handleOpenAddExpense}
                                        />
                                    )}
                                </TabsContent>

                                <TabsContent value="analytics" className="space-y-6">
                                    <ExpenseAnalytics />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <BudgetTracker
                        totalExpenses={totalExpenses}
                        budgetUsagePercentage={budgetUsagePercentage}
                        remainingBudget={remainingBudget}
                        paidExpenses={paidExpenses}
                        unpaidExpenses={unpaidExpenses}
                        budgetAmount={budgetAmount}
                    />
                    <UpcomingPayables pendingExpenses={pendingExpenses} />
                    <AIOptimizationTips />
                </div>
            </div>

            <ExpenseFormModal
                isOpen={isAddExpenseOpen}
                setIsOpen={setIsAddExpenseOpen}
                selectedExpense={selectedExpense}
                formData={formData}
                setFormData={setFormData}
                handleAddExpense={handleAddExpense}
                resetForm={resetForm}
                showValidationErrors={showValidationErrors}
                seasonOptions={seasonOptions}
                taskOptions={taskOptions}
                supplierOptions={supplierOptions}
                isLoadingTasks={isLoadingTasks}
                onTaskChange={handleTaskChange}
                isSeasonLocked={isWorkspaceScoped}
                lockedSeasonLabel={scopedSeasonLabel}
            />

            <ExpenseDetailDrawer
                open={!!detailExpense}
                onOpenChange={handleDetailOpenChange}
                expense={detailExpense}
                onQuickUpdate={handleQuickUpdate}
            />

            <ExpenseRemindersPanel
                open={isRemindersOpen}
                onOpenChange={setIsRemindersOpen}
                pendingExpenses={pendingExpenses}
            />

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open);
                    if (!open) {
                        setDeleteTarget(null);
                    }
                }}
                title="Delete Expense"
                description={
                    deleteTarget
                        ? `Delete "${deleteTarget.description}"? This action cannot be undone.`
                        : "Delete this expense? This action cannot be undone."
                }
                confirmText="Delete Expense"
                variant="destructive"
                onConfirm={() => {
                    if (deleteTarget) {
                        handleDeleteExpense(deleteTarget.id);
                    }
                    setDeleteDialogOpen(false);
                    setDeleteTarget(null);
                }}
                isLoading={isDeleting}
            />
        </PageContainer>
    );
}
