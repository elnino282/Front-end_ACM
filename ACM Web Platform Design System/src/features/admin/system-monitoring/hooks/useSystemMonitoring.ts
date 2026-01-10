// Custom hook for System Monitoring business logic and state management

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import type {
    DateRange,
    LogLevel,
    AlertSeverity,
    Alert,
    LogEntry,
    DownloadConfig,
    IncidentForm,
} from '../types';
import {
    INITIAL_ALERTS,
    LOG_ENTRIES,
    SEVERITY_BADGE_COLORS,
    STATUS_BADGE_COLORS,
    LOG_LEVEL_BADGE_COLORS,
} from '../constants';

export function useSystemMonitoring() {
    // UI state
    const [dateRange, setDateRange] = useState<DateRange>('24h');
    const [filterOpen, setFilterOpen] = useState(false);
    const [downloadLogsOpen, setDownloadLogsOpen] = useState(false);
    const [incidentModalOpen, setIncidentModalOpen] = useState(false);
    const [logDetailOpen, setLogDetailOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter state
    const [serviceFilter, setServiceFilter] = useState('all');
    const [logLevelFilter, setLogLevelFilter] = useState<LogLevel>('all');
    const [userFilter, setUserFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Download logs state
    const [downloadConfig, setDownloadConfig] = useState<DownloadConfig>({
        types: {
            error: true,
            system: true,
            auth: false,
            ai: false,
        },
        dateRange: '7d',
        sizeCap: '100MB',
    });

    // Incident ticket state
    const [incidentForm, setIncidentForm] = useState<IncidentForm>({
        title: '',
        description: '',
        severity: 'medium',
        assignedTo: '',
        status: 'open',
    });

    // Alerts state
    const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);

    // Alert action handler
    const handleAlertAction = (alertId: string, action: 'acknowledge' | 'resolve') => {
        setAlerts((prev) =>
            prev.map((alert) =>
                alert.id === alertId
                    ? { ...alert, status: action === 'acknowledge' ? 'acknowledged' : 'resolved' }
                    : alert
            )
        );
        toast.success(`Alert ${action}d`, {
            description: `Alert has been ${action}d successfully.`,
        });
    };

    // Download logs handler
    const handleDownloadLogs = () => {
        const types = Object.entries(downloadConfig.types)
            .filter(([_, enabled]) => enabled)
            .map(([type]) => type)
            .join(', ');

        toast.success('Download started', {
            description: `Downloading ${types} logs for the selected period.`,
        });
        setDownloadLogsOpen(false);
    };

    // Create incident handler
    const handleCreateIncident = () => {
        toast.success('Incident ticket created', {
            description: `Ticket "${incidentForm.title}" has been created and assigned.`,
        });
        setIncidentModalOpen(false);
        setIncidentForm({
            title: '',
            description: '',
            severity: 'medium',
            assignedTo: '',
            status: 'open',
        });
    };

    // Copy log to clipboard
    const handleCopyLog = (log: LogEntry) => {
        navigator.clipboard.writeText(JSON.stringify(log, null, 2));
        toast.success('Log copied to clipboard');
    };

    // Clear all filters
    const clearFilters = () => {
        setServiceFilter('all');
        setLogLevelFilter('all');
        setUserFilter('all');
    };

    // Badge style getters
    const getSeverityBadge = (severity: AlertSeverity) => {
        return SEVERITY_BADGE_COLORS[severity];
    };

    const getStatusBadge = (status: Alert['status']) => {
        return STATUS_BADGE_COLORS[status];
    };

    const getLogLevelBadge = (level: LogLevel) => {
        return LOG_LEVEL_BADGE_COLORS[level];
    };

    // Filtered logs computation
    const filteredLogs = useMemo(() => {
        return LOG_ENTRIES.filter((log) => {
            const matchesService = serviceFilter === 'all' || log.service === serviceFilter;
            const matchesLevel = logLevelFilter === 'all' || log.level === logLevelFilter;
            const matchesUser = userFilter === 'all' || log.user === userFilter;
            const matchesSearch =
                searchQuery === '' ||
                log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.service.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesService && matchesLevel && matchesUser && matchesSearch;
        });
    }, [serviceFilter, logLevelFilter, userFilter, searchQuery]);

    // Paginated logs computation
    const paginatedLogs = useMemo(() => {
        return filteredLogs.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filteredLogs, currentPage, itemsPerPage]);

    // Total pages computation
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

    return {
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
    };
}
