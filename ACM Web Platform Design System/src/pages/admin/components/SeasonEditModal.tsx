import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, X, AlertCircle, AlertTriangle } from 'lucide-react';
import { adminSeasonApi, type AdminSeasonUpdateRequest } from '@/services/api.admin';

interface Season {
    id: number;
    seasonName: string;
    status: string;
    endDate: string | null;
    actualYieldKg: number | null;
    notes: string | null;
}

interface SeasonEditModalProps {
    season: Season;
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const SEASON_STATUSES = ['PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'ARCHIVED'];

export function SeasonEditModal({ season, open, onClose, onSuccess }: SeasonEditModalProps) {
    const queryClient = useQueryClient();

    // Form state
    const [status, setStatus] = useState(season.status);
    const [endDate, setEndDate] = useState(season.endDate || '');
    const [actualYieldKg, setActualYieldKg] = useState(season.actualYieldKg?.toString() || '');
    const [notes, setNotes] = useState(season.notes || '');
    const [error, setError] = useState<string | null>(null);

    // Check if transitioning to COMPLETED
    const isCompletingNow = status === 'COMPLETED' && season.status !== 'COMPLETED';

    // Fetch pending task count when COMPLETED is selected
    const { data: pendingTaskCount, isLoading: pendingTasksLoading } = useQuery({
        queryKey: ['admin', 'seasons', season.id, 'pending-task-count'],
        queryFn: () => adminSeasonApi.getPendingTaskCount(season.id),
        enabled: open && isCompletingNow,
    });

    // Reset form when season changes
    useEffect(() => {
        if (season) {
            setStatus(season.status);
            setEndDate(season.endDate || '');
            setActualYieldKg(season.actualYieldKg?.toString() || '');
            setNotes(season.notes || '');
            setError(null);
        }
    }, [season]);

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (data: AdminSeasonUpdateRequest) => adminSeasonApi.update(season.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'seasons'] });
            onSuccess?.();
            onClose();
        },
        onError: (err: any) => {
            const code = err.response?.data?.code;
            const message = err.response?.data?.message || err.message || 'Failed to update season';

            if (code === 'ERR_SEASON_COMPLETION_REQUIRES_YIELD_AND_DATE') {
                setError('To complete a season, actual yield and end date are required.');
            } else {
                setError(message);
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Frontend validation for COMPLETED status
        if (isCompletingNow) {
            if (!endDate) {
                setError('End date is required when completing a season');
                return;
            }
            if (!actualYieldKg || parseFloat(actualYieldKg) <= 0) {
                setError('Actual yield (greater than 0) is required when completing a season');
                return;
            }
        }

        const payload: AdminSeasonUpdateRequest = {
            status,
            notes: notes || undefined,
        };

        // Only include these fields when relevant
        if (endDate) {
            payload.endDate = endDate;
        }
        if (actualYieldKg) {
            payload.actualYieldKg = parseFloat(actualYieldKg);
        }

        updateMutation.mutate(payload);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-background border border-border rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-semibold">Edit Season</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Error Alert */}
                        {error && (
                            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
                                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {/* Season Info */}
                        <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="text-sm font-medium">{season.seasonName}</div>
                            <div className="text-xs text-muted-foreground">Current status: {season.status}</div>
                        </div>

                        {/* Status Dropdown */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                            >
                                {SEASON_STATUSES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Warning when COMPLETED is selected */}
                        {isCompletingNow && (
                            <div className="flex items-start gap-2 p-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg text-amber-800 dark:text-amber-300">
                                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <strong>⚠️ Warning:</strong>{' '}
                                    {pendingTasksLoading ? (
                                        'Checking pending tasks...'
                                    ) : (
                                        `${pendingTaskCount ?? 0} pending task(s) for this season will be marked as CANCELLED.`
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Conditional fields for COMPLETED status */}
                        {isCompletingNow && (
                            <>
                                {/* End Date - Required when completing */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">End Date *</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                                        required
                                    />
                                </div>

                                {/* Actual Yield - Required when completing */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Actual Yield (kg) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={actualYieldKg}
                                        onChange={(e) => setActualYieldKg(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                                        placeholder="Enter actual yield in kg"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {/* Notes */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm resize-none"
                                placeholder="Optional notes..."
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/30">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={updateMutation.isPending}
                        className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={updateMutation.isPending}
                        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2"
                    >
                        {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
