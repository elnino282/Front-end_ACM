import { Plus, Download, Bell, DollarSign, FileText, BarChart3 } from "lucide-react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/shared/ui";
import { useExpenseManagement } from "./hooks/useExpenseManagement";
import { ExpenseFilters } from "./components/ExpenseFilters";
import { ExpenseTable } from "./components/ExpenseTable";
import { ExpenseAnalytics } from "./components/ExpenseAnalytics";
import { BudgetTracker } from "./components/BudgetTracker";
import { UpcomingPayables } from "./components/UpcomingPayables";
import { AIOptimizationTips } from "./components/AIOptimizationTips";
import { ExpenseFormModal } from "./components/ExpenseFormModal";

export function ExpenseManagement() {
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
        isLoadingTasks,
        handleTaskChange,
        expenses,
        filteredExpenses,
        formData,
        setFormData,
        totalExpenses,
        budgetUsagePercentage,
        remainingBudget,
        paidExpenses,
        unpaidExpenses,
        handleAddExpense,
        handleEditExpense,
        handleDeleteExpense,
        resetForm,
        handleOpenAddExpense,
        isLoading,
        error,
    } = useExpenseManagement();

    return (
        <PageContainer>
            <Card className="mb-6 border border-border rounded-xl shadow-sm">
                <CardContent className="px-6 py-4">
                    <PageHeader
                        className="mb-0"
                        icon={<DollarSign className="w-8 h-8" />}
                        title="Expense Management"
                        subtitle="Track and manage all farm expenses"
                        actions={
                            <>
                                <Button
                                    variant="outline"
                                >
                                    <Bell className="w-4 h-4 mr-2" />
                                    Reminders
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        toast.success("Exporting Data", {
                                            description: "Your expense report will download shortly.",
                                        });
                                    }}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                                <Button
                                    onClick={handleOpenAddExpense}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Expense
                                </Button>
                            </>
                        }
                    />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                {/* Main Content Area */}
                <div className="space-y-6">
                    {/* Filters */}
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
                            />
                        </CardContent>
                    </Card>

                        {/* Tabbed Content */}
                        <Card className="border-border rounded-2xl shadow-sm">
                            <CardContent className="px-6 py-4">
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted p-1 rounded-xl">
                                        <TabsTrigger
                                            value="list"
                                            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                                        >
                                            <FileText className="w-4 h-4 mr-2" />
                                            List View
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="analytics"
                                            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                                        >
                                            <BarChart3 className="w-4 h-4 mr-2" />
                                            Analytics View
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* List View */}
                                    <TabsContent value="list" className="space-y-4">
                                        {error && (
                                            <div className="rounded-xl border border-border bg-card p-4 text-sm text-destructive">
                                                Failed to load expenses: {error.message}
                                            </div>
                                        )}
                                        {!error && selectedSeason === "all" && !isLoading && (
                                            <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
                                                Select a season to view expenses.
                                            </div>
                                        )}
                                        {isLoading ? (
                                            <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
                                                Loading expenses...
                                            </div>
                                        ) : (
                                        <ExpenseTable
                                            filteredExpenses={filteredExpenses}
                                            totalExpenses={expenses.length}
                                            handleEditExpense={handleEditExpense}
                                            handleDeleteExpense={handleDeleteExpense}
                                        />
                                        )}
                                    </TabsContent>

                                    {/* Analytics View */}
                                    <TabsContent value="analytics" className="space-y-6">
                                        <ExpenseAnalytics />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        <BudgetTracker
                            totalExpenses={totalExpenses}
                            budgetUsagePercentage={budgetUsagePercentage}
                            remainingBudget={remainingBudget}
                            paidExpenses={paidExpenses}
                            unpaidExpenses={unpaidExpenses}
                        />
                        <UpcomingPayables />
                        <AIOptimizationTips />
                    </div>
                </div>

                {/* Add/Edit Expense Modal */}
                <ExpenseFormModal
                    isOpen={isAddExpenseOpen}
                    setIsOpen={setIsAddExpenseOpen}
                    selectedExpense={selectedExpense}
                    formData={formData}
                    setFormData={setFormData}
                    handleAddExpense={handleAddExpense}
                    resetForm={resetForm}
                    seasonOptions={seasonOptions}
                    taskOptions={taskOptions}
                    isLoadingTasks={isLoadingTasks}
                    onTaskChange={handleTaskChange}
                />
            </PageContainer>
    );
}



