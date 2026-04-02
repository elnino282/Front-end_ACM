import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBuyerManagement } from './hooks/useBuyerManagement';
import { BuyerStatCards } from './components/BuyerStatCards';
import { BuyerFilters } from './components/BuyerFilters';
import { BulkActionToolbar } from './components/BulkActionToolbar';
import { BuyerTable } from './components/BuyerTable';
import { BuyerPagination } from './components/BuyerPagination';
import { BuyerDetailDrawer } from './components/BuyerDetailDrawer';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { ImportCSVWizard } from './components/ImportCSVWizard';

export default function BuyerManagement() {
    const {
        // State
        searchQuery,
        setSearchQuery,
        selectedBuyers,
        filterOpen,
        setFilterOpen,
        detailDrawerOpen,
        setDetailDrawerOpen,
        resetPasswordOpen,
        setResetPasswordOpen,
        importWizardOpen,
        setImportWizardOpen,
        selectedBuyer,
        detailTab,
        setDetailTab,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        sortColumn,
        sortDirection,
        importStep,
        setImportStep,
        csvPreview,
        roleFilter,
        setRoleFilter,
        kycFilter,
        setKycFilter,
        statusFilter,
        setStatusFilter,
        formData,
        setFormData,
        // Data
        filteredBuyers,
        paginatedBuyers,
        totalPages,
        stats,
        // Handlers
        handleSort,
        handleSelectAll,
        handleSelectBuyer,
        handleViewEdit,
        handleAddBuyer,
        handleSave,
        handleDelete,
        handleToggleSuspend,
        handleKYCAction,
        handleBulkAction,
        handleCSVUpload,
        handleImportConfirm,
        handleResetPassword,
        // Helper functions
        getRoleBadge,
        getKYCBadge,
        getStatusBadge,
        getAuditIcon,
    } = useBuyerManagement();

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="mb-1">Buyer Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage buyer accounts, KYC verification, and permissions
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setImportWizardOpen(true)}>
                        <Upload className="w-4 h-4 mr-2" />
                        Import CSV
                    </Button>
                    <Button className="bg-[#2563EB] hover:bg-[#1E40AF]" onClick={handleAddBuyer}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Buyer
                    </Button>
                </div>
            </div>

            {/* Summary Stats */}
            <BuyerStatCards stats={stats} />

            {/* Search and Filter */}
            <BuyerFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filterOpen={filterOpen}
                onFilterOpenChange={setFilterOpen}
                roleFilter={roleFilter}
                onRoleFilterChange={setRoleFilter}
                kycFilter={kycFilter}
                onKycFilterChange={setKycFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
            />

            {/* Bulk Action Toolbar */}
            <BulkActionToolbar
                selectedCount={selectedBuyers.length}
                onSelectAll={handleSelectAll}
                isAllSelected={selectedBuyers.length === filteredBuyers.length}
                onActivate={() => handleBulkAction('activate')}
                onSuspend={() => handleBulkAction('suspend')}
                onDelete={() => handleBulkAction('delete')}
            />

            {/* Buyer Table with Pagination */}
            <div className="space-y-0">
                <BuyerTable
                    buyers={paginatedBuyers}
                    selectedBuyers={selectedBuyers}
                    allSelected={selectedBuyers.length === filteredBuyers.length}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSelectAll={handleSelectAll}
                    onSelectBuyer={handleSelectBuyer}
                    onSort={handleSort}
                    onViewEdit={handleViewEdit}
                    onToggleSuspend={handleToggleSuspend}
                    onResetPassword={handleResetPassword}
                    onDelete={handleDelete}
                    getRoleBadge={getRoleBadge}
                    getKYCBadge={getKYCBadge}
                    getStatusBadge={getStatusBadge}
                />
                <BuyerPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalResults={filteredBuyers.length}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>

            {/* Modals and Drawers */}
            <BuyerDetailDrawer
                open={detailDrawerOpen}
                onOpenChange={setDetailDrawerOpen}
                buyer={selectedBuyer}
                formData={formData}
                onFormDataChange={setFormData}
                activeTab={detailTab}
                onTabChange={setDetailTab}
                onSave={handleSave}
                onKYCVerify={() => handleKYCAction('verify')}
                onKYCReject={() => handleKYCAction('reject')}
                getKYCBadge={getKYCBadge}
                getAuditIcon={getAuditIcon}
            />

            <ResetPasswordModal open={resetPasswordOpen} onOpenChange={setResetPasswordOpen} />

            <ImportCSVWizard
                open={importWizardOpen}
                onOpenChange={setImportWizardOpen}
                step={importStep}
                onStepChange={setImportStep}
                csvPreview={csvPreview}
                onFileUpload={handleCSVUpload}
                onConfirm={handleImportConfirm}
                getRoleBadge={getRoleBadge}
            />
        </div>
    );
}
