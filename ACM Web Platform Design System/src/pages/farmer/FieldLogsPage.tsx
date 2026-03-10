import { useI18n } from '@/hooks/useI18n';
import type { AxiosError } from 'axios';
import { AlertCircle, Calendar, FileText, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
    useCreateFieldLog,
    useDeleteFieldLog,
    useFieldLogsBySeason,
    useUpdateFieldLog,
    useUserSeasons
} from '@/entities/field-log/api/hooks';
import { LOG_TYPES } from '@/entities/field-log/model/schemas';
import type { FieldLog, FieldLogCreateRequest } from '@/entities/field-log/model/types';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Badge,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    PageContainer,
    PageHeader,
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
    Textarea,
} from '@/shared/ui';

const selectTriggerClass =
    'rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-emerald-300 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/50 data-[placeholder]:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-slate-100';

// ═══════════════════════════════════════════════════════════════
// FIELD LOGS PAGE
// ═══════════════════════════════════════════════════════════════

interface FieldLogModuleProps {
    seasonId: string | number;
}

export function FieldLogModule({ seasonId }: FieldLogModuleProps) {
    const { t } = useI18n();

    // Explicit season override
    const explicitSeasonId = Number(seasonId);

    // State
    const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(explicitSeasonId);
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
        explicitSeasonId || selectedSeasonId || 0,
        {
            q: searchQuery.length >= 2 ? searchQuery : undefined,
            type: typeFilter !== 'all' ? typeFilter : undefined,
            page: 0,
            size: 100,
        },
        { enabled: !!(explicitSeasonId || selectedSeasonId) }
    );

    // Mutations
    const createMutation = useCreateFieldLog(selectedSeasonId ?? 0, {
        onSuccess: () => {
            toast.success(t('fieldLogs.toast.createSuccess'));
            closeModal();
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || t('fieldLogs.toast.createError');
            toast.error(message);
        },
    });

    const updateMutation = useUpdateFieldLog(selectedSeasonId ?? 0, {
        onSuccess: () => {
            toast.success(t('fieldLogs.toast.updateSuccess'));
            closeModal();
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || t('fieldLogs.toast.updateError');
            toast.error(message);
        },
    });

    const deleteMutation = useDeleteFieldLog(selectedSeasonId ?? 0, {
        onSuccess: () => {
            toast.success(t('fieldLogs.toast.deleteSuccess'));
            setDeleteLogId(null);
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || t('fieldLogs.toast.deleteError');
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
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card border border-border rounded-xl p-4 shadow-sm mb-6">
                <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        {t('fieldLogs.title')}
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={openCreateModal}
                        disabled={!explicitSeasonId && !selectedSeasonId}
                        variant="accent"
                        className="text-white hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #2F9E44 0%, #1a7a30 100%)' }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('fieldLogs.createButton')}
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="mb-6 border border-border rounded-xl shadow-sm">
                <CardContent className="px-6 py-4">
                    {seasonsLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t('fieldLogs.loadingSeasons')}
                        </div>
                    ) : seasons?.length === 0 ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertCircle className="w-4 h-4" />
                            {t('fieldLogs.noSeasons')}
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-center justify-start gap-4">
                            <div className="relative w-[320px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder={t('fieldLogs.searchPlaceholder')}
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
                                    <SelectValue placeholder={t('fieldLogs.selectSeason')} />
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
                                    <SelectValue placeholder={t('fieldLogs.allTypes')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('fieldLogs.allTypes')}</SelectItem>
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
                                <div className="text-sm text-muted-foreground">{t('fieldLogs.summary.totalLogs')}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="px-6 py-4">
                                <div className="text-2xl font-bold">
                                    {summaryStats.latestDate ? formatDate(summaryStats.latestDate) : '-'}
                                </div>
                                <div className="text-sm text-muted-foreground">{t('fieldLogs.summary.latestDate')}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="px-6 py-4">
                                <div className="text-2xl font-bold">
                                    {summaryStats.commonType
                                        ? getLogTypeConfig(summaryStats.commonType).label
                                        : '-'}
                                </div>
                                <div className="text-sm text-muted-foreground">{t('fieldLogs.summary.commonType')}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Logs Table */}
                    <Card>
                        <CardContent className="px-6 py-4">
                            {logsLoading ? (
                                <div className="flex items-center justify-center h-48">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                    <span className="ml-2 text-muted-foreground">{t('fieldLogs.loading')}</span>
                                </div>
                            ) : isError ? (
                                <div className="flex items-center justify-center h-48 text-destructive">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    {t('fieldLogs.error')}
                                </div>
                            ) : logs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                    <FileText className="w-12 h-12 mb-2 opacity-50" />
                                    <p>{t('fieldLogs.empty')}</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('fieldLogs.table.logDate')}</TableHead>
                                            <TableHead>{t('fieldLogs.table.type')}</TableHead>
                                            <TableHead className="max-w-xs">{t('fieldLogs.table.notes')}</TableHead>
                                            <TableHead>{t('fieldLogs.table.createdAt')}</TableHead>
                                            <TableHead className="text-right">{t('fieldLogs.table.actions')}</TableHead>
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
                            {editingLog ? t('fieldLogs.dialog.editTitle') : t('fieldLogs.dialog.createTitle')}
                        </DialogTitle>
                        <DialogDescription>
                            {editingLog
                                ? t('fieldLogs.dialog.editDescription')
                                : t('fieldLogs.dialog.createDescription')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="logDate">
                                {t('fieldLogs.form.logDate')} <span className="text-destructive">*</span>
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
                                {t('fieldLogs.form.logType')} <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.logType}
                                onValueChange={(value) => setFormData({ ...formData, logType: value })}
                            >
                                <SelectTrigger className={selectTriggerClass}>
                                    <SelectValue placeholder={t('fieldLogs.form.selectType')} />
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
                            <Label htmlFor="notes">{t('fieldLogs.form.notes')}</Label>
                            <Textarea
                                id="notes"
                                placeholder={t('fieldLogs.form.notesPlaceholder')}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={4}
                            />
                        </div>

                        {/* Inventory integration hint for FERTILIZE/SPRAY */}
                        {(formData.logType === 'FERTILIZE' || formData.logType === 'SPRAY') && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-900">
                                    💡 <strong>{t('fieldLogs.form.tip')}</strong> {t('fieldLogs.form.inventoryHint')}
                                </p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={closeModal}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={createMutation.isPending || updateMutation.isPending}
                            variant="accent"
                        >
                            {(createMutation.isPending || updateMutation.isPending) && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            {editingLog ? t('common.update') : t('common.create')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteLogId !== null} onOpenChange={() => setDeleteLogId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('fieldLogs.dialog.deleteTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('fieldLogs.dialog.deleteDescription')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : null}
                            {t('common.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
