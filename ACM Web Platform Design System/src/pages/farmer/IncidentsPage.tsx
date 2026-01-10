import { useState } from 'react';
import {
    AlertTriangle,
    Plus,
    Search,
    RefreshCw,
    AlertCircle,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronDown,
    Edit,
    Trash2,
} from 'lucide-react';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Label,
    Textarea,
    Badge,
    PageContainer,
    PageHeader,
} from '@/shared/ui';
import { toast } from 'sonner';

import { useMySeasons } from '@/entities/season/api/hooks';
import {
    useIncidents,
    useCreateIncident,
    useUpdateIncident,
    useUpdateIncidentStatus,
    useDeleteIncident,
    useIncidentSummary,
} from '@/entities/incident';
import type {
    Incident,
    IncidentCreateRequest,
    IncidentUpdateRequest,
    IncidentStatusUpdateRequest,
} from '@/entities/incident';

const normalizeDateInputValue = (value?: string | null) => {
    if (!value) return '';
    const [datePart] = value.split('T');
    return datePart;
};

const getTodayInputValue = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const isPastDate = (value?: string | null) => {
    if (!value) return false;
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return false;
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate < today;
};

const selectTriggerClass =
    "rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-emerald-300 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/50 data-[placeholder]:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-slate-100";

const selectTriggerCompactClass =
    "h-8 rounded-lg border-2 border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-emerald-300 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/40 data-[placeholder]:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-slate-100";

const filterSelectBaseClass = "border-border acm-rounded-sm h-9 text-sm";

// ═══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

export function IncidentsPage() {
    // State
    const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [severityFilter, setSeverityFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const todayInputValue = getTodayInputValue();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

    // Form state
    const [formState, setFormState] = useState<Partial<IncidentCreateRequest>>({});
    const [resolutionNote, setResolutionNote] = useState('');

    // Queries
    const { data: mySeasons, isLoading: isSeasonsLoading } = useMySeasons();

    const { data: incidentsData, isLoading: isIncidentsLoading, refetch } = useIncidents(
        {
            seasonId: selectedSeasonId ?? 0,
            status: statusFilter === 'all' ? undefined : statusFilter,
            severity: severityFilter === 'all' ? undefined : severityFilter,
            q: searchQuery.length >= 2 ? searchQuery : undefined,
            page: currentPage,
            size: 20,
        },
        { enabled: selectedSeasonId !== null && selectedSeasonId > 0 }
    );

    const { data: summary } = useIncidentSummary(selectedSeasonId ?? 0, {
        enabled: selectedSeasonId !== null && selectedSeasonId > 0,
    });

    // Mutations
    const createMutation = useCreateIncident({
        onSuccess: () => {
            toast.success('Incident created successfully');
            setIsCreateDialogOpen(false);
            resetForm();
        },
        onError: (error) => {
            toast.error('Failed to create incident: ' + error.message);
        },
    });

    const updateMutation = useUpdateIncident({
        onSuccess: () => {
            toast.success('Incident updated successfully');
            setIsEditDialogOpen(false);
            resetForm();
        },
        onError: (error) => {
            toast.error('Failed to update incident: ' + error.message);
        },
    });

    const updateStatusMutation = useUpdateIncidentStatus({
        onSuccess: () => {
            toast.success('Incident resolved successfully');
            setIsResolveDialogOpen(false);
            setResolutionNote('');
        },
        onError: (error) => {
            toast.error('Failed to resolve incident: ' + error.message);
        },
    });

    const deleteMutation = useDeleteIncident({
        onSuccess: () => {
            toast.success('Incident deleted successfully');
            setIsDeleteDialogOpen(false);
            setSelectedIncident(null);
        },
        onError: (error) => {
            toast.error('Failed to delete incident: ' + error.message);
        },
    });

    // Helpers
    const resetForm = () => {
        setFormState({});
        setSelectedIncident(null);
    };

    const handleOpenCreate = () => {
        if (!selectedSeasonId) {
            toast.error('Please select a season first');
            return;
        }
        setFormState({ seasonId: selectedSeasonId });
        setIsCreateDialogOpen(true);
    };

    const handleOpenEdit = (incident: Incident) => {
        setSelectedIncident(incident);
        setFormState({
            seasonId: incident.seasonId,
            incidentType: incident.incidentType,
            severity: incident.severity ?? '',
            description: incident.description ?? '',
            deadline: normalizeDateInputValue(incident.deadline) || undefined,
        });
        setIsEditDialogOpen(true);
    };

    const handleOpenResolve = (incident: Incident) => {
        setSelectedIncident(incident);
        setResolutionNote('');
        setIsResolveDialogOpen(true);
    };

    const handleOpenDelete = (incident: Incident) => {
        setSelectedIncident(incident);
        setIsDeleteDialogOpen(true);
    };

    const handleCreate = () => {
        const description = formState.description?.trim();
        const deadline = normalizeDateInputValue(formState.deadline);
        if (!formState.seasonId || !formState.incidentType || !formState.severity || !description) {
            toast.error('Please fill in all required fields');
            return;
        }
        if (deadline && isPastDate(deadline)) {
            toast.error('Deadline cannot be in the past');
            return;
        }
        const payload: IncidentCreateRequest = {
            seasonId: formState.seasonId,
            incidentType: formState.incidentType,
            severity: formState.severity,
            description,
            ...(deadline ? { deadline } : {}),
        };
        createMutation.mutate(payload);
    };

    const handleUpdate = () => {
        if (!selectedIncident) return;
        const description = formState.description?.trim();
        const deadline = normalizeDateInputValue(formState.deadline);
        if (!formState.incidentType || !formState.severity || !description) {
            toast.error('Please fill in all required fields');
            return;
        }
        if (deadline && isPastDate(deadline)) {
            toast.error('Deadline cannot be in the past');
            return;
        }
        const updateData: IncidentUpdateRequest = {
            incidentType: formState.incidentType,
            severity: formState.severity,
            description,
            ...(deadline ? { deadline } : {}),
        };
        updateMutation.mutate({
            id: selectedIncident.incidentId,
            data: updateData,
            seasonId: selectedIncident.seasonId,
        });
    };

    const handleResolve = () => {
        if (!selectedIncident || !resolutionNote.trim()) {
            toast.error('Resolution note is required');
            return;
        }
        const statusData: IncidentStatusUpdateRequest = {
            status: 'RESOLVED',
            resolutionNote: resolutionNote.trim(),
        };
        updateStatusMutation.mutate({
            id: selectedIncident.incidentId,
            data: statusData,
            seasonId: selectedIncident.seasonId,
        });
    };

    const handleChangeStatus = (incident: Incident, newStatus: string) => {
        if (newStatus === 'RESOLVED') {
            handleOpenResolve(incident);
            return;
        }
        updateStatusMutation.mutate({
            id: incident.incidentId,
            data: { status: newStatus },
            seasonId: incident.seasonId,
        });
    };

    const handleDelete = () => {
        if (!selectedIncident) return;
        deleteMutation.mutate({
            id: selectedIncident.incidentId,
            seasonId: selectedIncident.seasonId,
        });
    };

    // Badge renderers
    const getSeverityBadge = (severity: string | null | undefined) => {
        switch (severity?.toUpperCase()) {
            case 'HIGH':
                return <Badge variant="destructive">High</Badge>;
            case 'MEDIUM':
                return <Badge variant="warning">Medium</Badge>;
            case 'LOW':
                return <Badge variant="secondary">Low</Badge>;
            default:
                return <Badge variant="outline">-</Badge>;
        }
    };

    const getStatusBadge = (status: string | null | undefined) => {
        switch (status?.toUpperCase()) {
            case 'OPEN':
                return <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" />Open</Badge>;
            case 'IN_PROGRESS':
                return <Badge variant="info" className="gap-1"><Clock className="w-3 h-3" />In Progress</Badge>;
            case 'RESOLVED':
                return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" />Resolved</Badge>;
            case 'CANCELLED':
                return <Badge variant="secondary" className="gap-1"><XCircle className="w-3 h-3" />Cancelled</Badge>;
            default:
                return <Badge variant="outline">-</Badge>;
        }
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('vi-VN');
        } catch {
            return dateString;
        }
    };

    const incidentTypes = [
        { value: 'PEST_OUTBREAK', label: 'Pest Outbreak' },
        { value: 'DISEASE', label: 'Disease' },
        { value: 'EQUIPMENT_FAILURE', label: 'Equipment Failure' },
        { value: 'WEATHER_DAMAGE', label: 'Weather Damage' },
        { value: 'SAFETY', label: 'Safety Issue' },
        { value: 'OTHER', label: 'Other' },
    ];

    const severities = [
        { value: 'LOW', label: 'Low' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'HIGH', label: 'High' },
    ];

    const statuses = [
        { value: 'OPEN', label: 'Open' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'RESOLVED', label: 'Resolved' },
        { value: 'CANCELLED', label: 'Cancelled' },
    ];

    return (
        <PageContainer>
            <Card className="mb-6 border border-border rounded-xl shadow-sm">
                <CardContent className="px-6 py-4">
                    <PageHeader
                        className="mb-0"
                        icon={<AlertTriangle className="w-8 h-8" />}
                        title="Incidents"
                        subtitle="Manage farm incidents and track resolution"
                        actions={
                            <Button onClick={handleOpenCreate} disabled={!selectedSeasonId}>
                                <Plus className="w-4 h-4 mr-2" />
                                Report Incident
                            </Button>
                        }
                    />
                </CardContent>
            </Card>

            {/* Filters */}
            <Card className="mb-6 border border-border rounded-xl shadow-sm">
                <CardContent className="px-6 py-4">
                    {isSeasonsLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Loading seasons...
                        </div>
                    ) : !mySeasons?.length ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertCircle className="w-4 h-4" />
                            No seasons found. Create a season first.
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-center justify-start gap-4">
                            <Select
                                value={selectedSeasonId?.toString() ?? ''}
                                onValueChange={(val) => {
                                    setSelectedSeasonId(Number(val));
                                    setCurrentPage(0);
                                }}
                                disabled={isSeasonsLoading}
                            >
                                <SelectTrigger className={`${filterSelectBaseClass} w-[180px]`}>
                                    <SelectValue placeholder="Select a season..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {mySeasons?.map((season) => (
                                        <SelectItem key={season.seasonId} value={season.seasonId.toString()}>
                                            {season.seasonName} {season.status && `(${season.status})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="relative w-[320px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-10 border-border acm-rounded-sm h-9 text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    disabled={!selectedSeasonId}
                                />
                            </div>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className={`${filterSelectBaseClass} w-[180px]`} disabled={!selectedSeasonId}>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {statuses.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={severityFilter} onValueChange={setSeverityFilter}>
                            <SelectTrigger className={`${filterSelectBaseClass} w-[180px]`} disabled={!selectedSeasonId}>
                                <SelectValue placeholder="Severity" />
                            </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Severities</SelectItem>
                                    {severities.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => refetch()}
                                disabled={!selectedSeasonId}
                                className="acm-rounded-sm border-border h-9 w-9"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Summary Cards */}
            {selectedSeasonId && summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-red-500">
                        <CardContent className="px-6 py-4 flex items-center gap-3">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                            <div>
                                <p className="text-2xl font-bold">{summary.openCount}</p>
                                <p className="text-sm text-muted-foreground">Open</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="px-6 py-4 flex items-center gap-3">
                            <Clock className="w-8 h-8 text-blue-500" />
                            <div>
                                <p className="text-2xl font-bold">{summary.inProgressCount}</p>
                                <p className="text-sm text-muted-foreground">In Progress</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-500">
                        <CardContent className="px-6 py-4 flex items-center gap-3">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                            <div>
                                <p className="text-2xl font-bold">{summary.resolvedCount}</p>
                                <p className="text-sm text-muted-foreground">Resolved</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-gray-400">
                        <CardContent className="px-6 py-4 flex items-center gap-3">
                            <XCircle className="w-8 h-8 text-gray-400" />
                            <div>
                                <p className="text-2xl font-bold">{summary.cancelledCount}</p>
                                <p className="text-sm text-muted-foreground">Cancelled</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Incidents Table */}
            {selectedSeasonId && (
                <Card>
                    <CardHeader>
                        <CardTitle>Incident List</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 py-4">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Severity</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Deadline</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isIncidentsLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8">
                                                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                                                Loading incidents...
                                            </TableCell>
                                        </TableRow>
                                    ) : !incidentsData?.items?.length ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                No incidents found for this season.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        incidentsData.items.map((incident) => (
                                            <TableRow key={incident.incidentId}>
                                                <TableCell className="font-medium">
                                                    {incidentTypes.find((t) => t.value === incident.incidentType)?.label ?? incident.incidentType}
                                                </TableCell>
                                                <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                                                <TableCell>{getStatusBadge(incident.status)}</TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {incident.description?.substring(0, 50)}
                                                    {(incident.description?.length ?? 0) > 50 ? '...' : ''}
                                                </TableCell>
                                                <TableCell>{formatDate(incident.deadline)}</TableCell>
                                                <TableCell>{formatDate(incident.createdAt)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        {/* Status dropdown */}
                                                        {incident.status !== 'RESOLVED' && incident.status !== 'CANCELLED' && (
                                                            <Select
                                                                value={incident.status ?? ''}
                                                                onValueChange={(val) => handleChangeStatus(incident, val)}
                                                            >
                                                                <SelectTrigger className={`${selectTriggerCompactClass} w-28`}>
                                                                    <ChevronDown className="w-3 h-3" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {statuses
                                                                        .filter((s) => s.value !== incident.status)
                                                                        .map((s) => (
                                                                            <SelectItem key={s.value} value={s.value}>
                                                                                {s.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenEdit(incident)}
                                                            disabled={incident.status === 'RESOLVED' || incident.status === 'CANCELLED'}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenDelete(incident)}
                                                            disabled={incident.status === 'RESOLVED'}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {/* Pagination */}
                        {incidentsData && incidentsData.totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-muted-foreground">
                                    Page {currentPage + 1} of {incidentsData.totalPages} ({incidentsData.totalElements} total)
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === 0}
                                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage >= incidentsData.totalPages - 1}
                                        onClick={() => setCurrentPage((p) => p + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* No season selected message */}
            {!selectedSeasonId && (
                <Card>
                    <CardContent className="px-6 py-4 text-center">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium">No Season Selected</p>
                        <p className="text-muted-foreground">Please select a season above to view incidents.</p>
                    </CardContent>
                </Card>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
                if (!open) {
                    setIsCreateDialogOpen(false);
                    setIsEditDialogOpen(false);
                    resetForm();
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditDialogOpen ? 'Edit Incident' : 'Report New Incident'}</DialogTitle>
                        <DialogDescription>
                            {isEditDialogOpen ? 'Update incident details' : 'Fill in the details to report a new incident'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Incident Type *</Label>
                            <Select
                                value={formState.incidentType ?? ''}
                                onValueChange={(val) => setFormState((s) => ({ ...s, incidentType: val }))}
                            >
                                <SelectTrigger className={selectTriggerClass}>
                                    <SelectValue placeholder="Select type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {incidentTypes.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Severity *</Label>
                            <Select
                                value={formState.severity ?? ''}
                                onValueChange={(val) => setFormState((s) => ({ ...s, severity: val }))}
                            >
                                <SelectTrigger className={selectTriggerClass}>
                                    <SelectValue placeholder="Select severity..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {severities.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Description *</Label>
                            <Textarea
                                placeholder="Describe the incident..."
                                value={formState.description ?? ''}
                                onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))}
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Deadline (Optional)</Label>
                            <Input
                                type="date"
                                value={formState.deadline ?? ''}
                                min={todayInputValue}
                                onChange={(e) => setFormState((s) => ({ ...s, deadline: e.target.value || undefined }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setIsCreateDialogOpen(false);
                            setIsEditDialogOpen(false);
                            resetForm();
                        }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={isEditDialogOpen ? handleUpdate : handleCreate}
                            disabled={createMutation.isPending || updateMutation.isPending}
                        >
                            {(createMutation.isPending || updateMutation.isPending) && (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            {isEditDialogOpen ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Resolve Dialog */}
            <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Resolve Incident</DialogTitle>
                        <DialogDescription>
                            Provide a resolution note to close this incident
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Resolution Note *</Label>
                            <Textarea
                                placeholder="Describe how the incident was resolved..."
                                value={resolutionNote}
                                onChange={(e) => setResolutionNote(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleResolve}
                            disabled={updateStatusMutation.isPending || !resolutionNote.trim()}
                            variant="success"
                        >
                            {updateStatusMutation.isPending && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                            Resolve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Incident</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this incident? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageContainer>
    );
}
