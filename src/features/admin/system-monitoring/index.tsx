// System Monitoring - Main Container Component

import { useSystemMonitoring } from './hooks/useSystemMonitoring';
import { KPI_METRICS, CPU_MEMORY_DATA, ERROR_RATE_DATA, SLOWEST_PAGES_DATA } from './constants';
import { PageHeader } from './components/PageHeader';
import { KPIMetricCard } from './components/KPIMetricCard';
import { PerformanceCharts } from './components/PerformanceCharts';
import { AlertsPanel } from './components/AlertsPanel';
import { LogsTable } from './components/LogsTable';
import { FilterSheet } from './components/FilterSheet';
import { DownloadLogsDialog } from './components/DownloadLogsDialog';
import { IncidentTicketDialog } from './components/IncidentTicketDialog';
import { LogDetailDialog } from './components/LogDetailDialog';

export function SystemMonitoring() {
    const {
        // State
        dateRange,
        setDateRange,
        filterOpen,
        setFilterOpen,
        downloadLogsOpen,
        setDownloadLogsOpen,
        incidentModalOpen,
        setIncidentModalOpen,
        logDetailOpen,
        setLogDetailOpen,
        selectedLog,
        setSelectedLog,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        serviceFilter,
        setServiceFilter,
        logLevelFilter,
        setLogLevelFilter,
        userFilter,
        setUserFilter,
        searchQuery,
        setSearchQuery,
        downloadConfig,
        setDownloadConfig,
        incidentForm,
        setIncidentForm,
        alerts,
        // Handlers
        handleAlertAction,
        handleDownloadLogs,
        handleCreateIncident,
        handleCopyLog,
        clearFilters,
        // Utilities
        getSeverityBadge,
        getStatusBadge,
        getLogLevelBadge,
        // Computed values
        filteredLogs,
        paginatedLogs,
        totalPages,
    } = useSystemMonitoring();

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            {/* Page Header */}
            <PageHeader
                dateRange={dateRange}
                setDateRange={setDateRange}
                setFilterOpen={setFilterOpen}
                setDownloadLogsOpen={setDownloadLogsOpen}
                setIncidentModalOpen={setIncidentModalOpen}
            />

            {/* KPI Overview Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {KPI_METRICS.map((metric, index) => (
                    <KPIMetricCard key={index} metric={metric} index={index} />
                ))}
            </div>

            {/* Performance Charts */}
            <PerformanceCharts
                cpuMemoryData={CPU_MEMORY_DATA}
                errorRateData={ERROR_RATE_DATA}
                slowestPagesData={SLOWEST_PAGES_DATA}
            />

            {/* Alerts Panel & Log Search */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <AlertsPanel
                    alerts={alerts}
                    handleAlertAction={handleAlertAction}
                    getSeverityBadge={getSeverityBadge}
                    getStatusBadge={getStatusBadge}
                />
                <LogsTable
                    paginatedLogs={paginatedLogs}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    logLevelFilter={logLevelFilter}
                    setLogLevelFilter={setLogLevelFilter}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    filteredLogs={filteredLogs}
                    itemsPerPage={itemsPerPage}
                    setSelectedLog={setSelectedLog}
                    setLogDetailOpen={setLogDetailOpen}
                    handleCopyLog={handleCopyLog}
                    getLogLevelBadge={getLogLevelBadge}
                />
            </div>

            {/* Modals & Dialogs */}
            <FilterSheet
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
                serviceFilter={serviceFilter}
                setServiceFilter={setServiceFilter}
                logLevelFilter={logLevelFilter}
                setLogLevelFilter={setLogLevelFilter}
                userFilter={userFilter}
                setUserFilter={setUserFilter}
                clearFilters={clearFilters}
            />
            <DownloadLogsDialog
                downloadLogsOpen={downloadLogsOpen}
                setDownloadLogsOpen={setDownloadLogsOpen}
                downloadConfig={downloadConfig}
                setDownloadConfig={setDownloadConfig}
                handleDownloadLogs={handleDownloadLogs}
            />
            <IncidentTicketDialog
                incidentModalOpen={incidentModalOpen}
                setIncidentModalOpen={setIncidentModalOpen}
                incidentForm={incidentForm}
                setIncidentForm={setIncidentForm}
                handleCreateIncident={handleCreateIncident}
            />
            <LogDetailDialog
                logDetailOpen={logDetailOpen}
                setLogDetailOpen={setLogDetailOpen}
                selectedLog={selectedLog}
                handleCopyLog={handleCopyLog}
                getLogLevelBadge={getLogLevelBadge}
            />
        </div>
    );
}
