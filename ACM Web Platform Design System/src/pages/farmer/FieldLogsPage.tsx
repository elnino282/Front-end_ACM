import { useState, useMemo } from 'react';
import { FileText, Plus, Loader2, Search, Calendar, Trash2, Pencil, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

import { 
    useFieldLogsBySeason, 
    useUserSeasons, 
    useCreateFieldLog, 
    useUpdateFieldLog, 
    useDeleteFieldLog 
} from '@/entities/field-log/api/hooks';
import { LOG_TYPES } from '@/entities/field-log/model/schemas';
import type { FieldLog, FieldLogCreateRequest } from '@/entities/field-log/model/types';

import {
    Button,
    Input,
    Badge,
    Card,
    CardContent,
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Label,
    Textarea,
    PageContainer,
    PageHeader,
} from '@/shared/ui';

const selectTriggerClass =
    'rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-emerald-300 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/50 data-[placeholder]:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-slate-100';

// ═══════════════════════════════════════════════════════════════
// FIELD LOGS PAGE
// ═══════════════════════════════════════════════════════════════

export function FieldLogsPage() {
    
    // State
    const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<FieldLog | null>(null);
    const [deleteLogId, setDeleteLogId] = useState<number | null>(null);
    
    // Form state
    const [formData, setFormData] = useState<{
        logDate: string;
        logType: string;
        notes: string;
    }>({
        logDate: new Date().toISOString().split('T')[0],
        logType: '',
        notes: '',
    });
    
    // Queries
    const { data: seasons, isLoading: seasonsLoading } = useUserSeasons();
    const { data: logsData, isLoading: logsLoading, isError } = useFieldLogsBySeason(
        selectedSeasonId ?? 0,
        {
            q: searchQuery.length >= 2 ? searchQuery : undefined,
            type: typeFilter !== 'all' ? typeFilter : undefined,
            page: 0,
            size: 100,
        },
        { enabled: !!selectedSeasonId }
    );
    
    // Mutations
    const createMutation = useCreateFieldLog(selectedSeasonId ?? 0, {
        onSuccess: () => {
            toast.success('Field log created successfully');
            closeModal();
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            const message = error?.response?.data?.message || 'Failed to create field log';
            toast.error(message);
        },
    });
    
    const updateMutation = useUpdateFieldLog(selectedSeasonId ?? 0, {
        onSuccess: () => {
            toast.success('Field log updated successfully');
            closeModal();
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            const message = error?.response?.data?.message || 'Failed to update field log';
            toast.error(message);
        },
    });
    
    const deleteMutation = useDeleteFieldLog(selectedSeasonId ?? 0, {
        onSuccess: () => {
            toast.success('Field log deleted successfully');
            setDeleteLogId(null);
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            const message = error?.response?.data?.message || 'Failed to delete field log';
            toast.error(message);
        },
    });
    
    // Computed values
    const selectedSeason = useMemo(() => 
        seasons?.find(s => s.seasonId === selectedSeasonId),
        [seasons, selectedSeasonId]
    );
    
    const logs = logsData?.items ?? [];
    
    const summaryStats = useMemo(() => {
        if (!logs.length) return { total: 0, latestDate: null, commonType: null };
        
        const typeCounts: Record<string, number> = {};
        let latestDate = logs[0]?.logDate;
        
        logs.forEach(log => {
            typeCounts[log.logType] = (typeCounts[log.logType] || 0) + 1;
            if (log.logDate > latestDate) latestDate = log.logDate;
        });
        
        const commonType = Object.entries(typeCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0];
        
        return { total: logs.length, latestDate, commonType };
    }, [logs]);
    
    // Handlers
    const openCreateModal = () => {
        setEditingLog(null);
        setFormData({
            logDate: new Date().toISOString().split('T')[0],
            logType: '',
            notes: '',
        });
        setIsModalOpen(true);
    };
    
    const openEditModal = (log: FieldLog) => {
        setEditingLog(log);
        setFormData({
            logDate: log.logDate,
            logType: log.logType,
            notes: log.notes ?? '',
        });
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLog(null);
        setFormData({ logDate: '', logType: '', notes: '' });
    };
    
    const handleSubmit = () => {
        if (!formData.logDate || !formData.logType) {
            toast.error('Please fill in required fields');
            return;
        }
        
        // Validate date within season range
        if (selectedSeason) {
            const logDate = new Date(formData.logDate);
            const startDate = selectedSeason.startDate ? new Date(selectedSeason.startDate) : null;
            const endDate = selectedSeason.endDate 
                ? new Date(selectedSeason.endDate) 
                : selectedSeason.plannedHarvestDate 
                    ? new Date(selectedSeason.plannedHarvestDate) 
                    : null;
            
            if (startDate && logDate < startDate) {
                toast.error(`Log date must be on or after season start date (${selectedSeason.startDate})`);
                return;
            }
            if (endDate && logDate > endDate) {
                toast.error(`Log date must be on or before season end date (${selectedSeason.endDate ?? selectedSeason.plannedHarvestDate})`);
                return;
            }
        }
        
        const payload: FieldLogCreateRequest = {
            logDate: formData.logDate,
            logType: formData.logType,
            notes: formData.notes || undefined,
        };
        
        if (editingLog) {
            updateMutation.mutate({ id: editingLog.id, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };
    
    const handleDelete = () => {
        if (deleteLogId) {
            deleteMutation.mutate(deleteLogId);
        }
    };
    
    const getLogTypeConfig = (type: string) => {
        return LOG_TYPES.find(t => t.value === type) ?? { label: type, color: 'bg-gray-100 text-gray-800' };
    };
    
    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('vi-VN');
    };
    
    const formatDateTime = (dateStr: string | null | undefined) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString('vi-VN');
    };

    return (
        <PageContainer>
            <Card className="mb-6 border border-border rounded-xl shadow-sm">
                <CardContent className="px-6 py-4">
                    <PageHeader
                        className="mb-0"
                        icon={<FileText className="w-8 h-8" />}
                        title="Field Logs"
                        subtitle="Track daily field activities and observations"
                        actions={
                            <Button 
                                onClick={openCreateModal}
                                disabled={!selectedSeasonId}
                                variant="accent"
                                className="text-white hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg, #2F9E44 0%, #1a7a30 100%)' }}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Log
                            </Button>
                        }
                    />
                </CardContent>
            </Card>

            {/* Filters */}
            <Card className="mb-6 border border-border rounded-xl shadow-sm">
                <CardContent className="px-6 py-4">
                    {seasonsLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading seasons...
                        </div>
                    ) : seasons?.length === 0 ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertCircle className="w-4 h-4" />
                            No seasons found. Create a season first.
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-center justify-start gap-4">
                            <div className="relative w-[320px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search in notes (min 2 characters)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 rounded-xl border-border focus:border-primary"
                                    disabled={!selectedSeasonId}
                                />
                            </div>

                            <Select
                                value={selectedSeasonId?.toString() ?? ''}
                                onValueChange={(value) => setSelectedSeasonId(Number(value))}
                            >
                            <SelectTrigger className="rounded-xl border-border w-[180px]">
                                <SelectValue placeholder="Select a season..." />
                            </SelectTrigger>
                                <SelectContent>
                                    {seasons?.map((season) => (
                                        <SelectItem key={season.seasonId} value={season.seasonId.toString()}>
                                            {season.seasonName}
                                            {season.startDate && (
                                                <span className="ml-2 text-muted-foreground text-sm">
                                                    ({formatDate(season.startDate)})
                                                </span>
                                            )}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="rounded-xl border-border w-[180px]" disabled={!selectedSeasonId}>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {LOG_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Content when season is selected */}
            {selectedSeasonId && (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="px-6 py-4">
                                <div className="text-2xl font-bold text-primary">{summaryStats.total}</div>
                                <div className="text-sm text-muted-foreground">Total Logs</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="px-6 py-4">
                                <div className="text-2xl font-bold">
                                    {summaryStats.latestDate ? formatDate(summaryStats.latestDate) : '-'}
                                </div>
                                <div className="text-sm text-muted-foreground">Latest Log Date</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="px-6 py-4">
                                <div className="text-2xl font-bold">
                                    {summaryStats.commonType 
                                        ? getLogTypeConfig(summaryStats.commonType).label 
                                        : '-'}
                                </div>
                                <div className="text-sm text-muted-foreground">Most Common Type</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Logs Table */}
                    <Card>
                        <CardContent className="px-6 py-4">
                            {logsLoading ? (
                                <div className="flex items-center justify-center h-48">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                    <span className="ml-2 text-muted-foreground">Loading logs...</span>
                                </div>
                            ) : isError ? (
                                <div className="flex items-center justify-center h-48 text-destructive">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    Failed to load logs. Please try again.
                                </div>
                            ) : logs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                    <FileText className="w-12 h-12 mb-2 opacity-50" />
                                    <p>No field logs found for this season.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Log Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead className="max-w-xs">Notes</TableHead>
                                            <TableHead>Created At</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.map((log) => {
                                            const typeConfig = getLogTypeConfig(log.logType);
                                            return (
                                                <TableRow key={log.id}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                                            {formatDate(log.logDate)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={typeConfig.color}>
                                                            {typeConfig.label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="max-w-xs truncate">
                                                        {log.notes || '-'}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {formatDateTime(log.createdAt)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openEditModal(log)}
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() => setDeleteLogId(log.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingLog ? 'Edit Field Log' : 'Create Field Log'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingLog 
                                ? 'Update the field log details below.'
                                : 'Record a new field activity or observation.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="logDate">
                                Log Date <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="logDate"
                                type="date"
                                value={formData.logDate}
                                onChange={(e) => setFormData({ ...formData, logDate: e.target.value })}
                            />
                            {selectedSeason && (
                                <p className="text-xs text-muted-foreground">
                                    Season range: {formatDate(selectedSeason.startDate)} - {formatDate(selectedSeason.endDate ?? selectedSeason.plannedHarvestDate)}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="logType">
                                Log Type <span className="text-destructive">*</span>
                            </Label>
                            <Select 
                                value={formData.logType} 
                                onValueChange={(value) => setFormData({ ...formData, logType: value })}
                            >
                                <SelectTrigger className={selectTriggerClass}>
                                    <SelectValue placeholder="Select log type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {LOG_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                placeholder="Add any observations or details..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={4}
                            />
                        </div>
                        
                        {/* Inventory integration hint for FERTILIZE/SPRAY */}
                        {(formData.logType === 'FERTILIZE' || formData.logType === 'SPRAY') && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-900">
                                    💡 <strong>Tip:</strong> After saving, you can create a matching 
                                    Stock OUT entry in Inventory to track material usage.
                                </p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmit}
                            disabled={createMutation.isPending || updateMutation.isPending}
                            variant="accent"
                        >
                            {(createMutation.isPending || updateMutation.isPending) && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            {editingLog ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteLogId !== null} onOpenChange={() => setDeleteLogId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Field Log</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this field log? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </PageContainer>
    );
}
