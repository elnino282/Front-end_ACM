import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, X, AlertCircle, AlertTriangle } from 'lucide-react';
import { adminTaskApi, type AdminTaskUpdateRequest } from '@/services/api.admin';

interface Task {
    id: number;
    title: string;
    userName: string | null;
    userId: number | null;
    seasonName: string | null;
    seasonId: number | null;
    farmId: number | null;
    farmName: string | null;
    status: string;
    notes: string | null;
}

interface TaskEditModalProps {
    task: Task;
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const TASK_STATUSES = ['PENDING', 'IN_PROGRESS', 'DONE', 'OVERDUE', 'CANCELLED'];

export function TaskEditModal({ task, open, onClose, onSuccess }: TaskEditModalProps) {
    const queryClient = useQueryClient();

    // Form state
    const [status, setStatus] = useState(task.status);
    const [notes, setNotes] = useState(task.notes || '');
    const [error, setError] = useState<string | null>(null);

    // Track original values to detect changes
    const [originalStatus] = useState(task.status);

    // Check if status is being changed
    const isStatusChanged = status !== originalStatus;

    // Reset form when task changes
    useEffect(() => {
        if (task) {
            setStatus(task.status);
            setNotes(task.notes || '');
            setError(null);
        }
    }, [task]);

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (data: AdminTaskUpdateRequest) => adminTaskApi.update(task.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'tasks'] });
            onSuccess?.();
            onClose();
        },
        onError: (err: any) => {
            const code = err.response?.data?.code;
            const message = err.response?.data?.message || err.message || 'Failed to update task';

            if (code === 'ERR_INVALID_TASK_ASSIGNEE') {
                setError('The specified user cannot be assigned to this task. User must be the farm owner.');
            } else {
                setError(message);
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const payload: AdminTaskUpdateRequest = {
            status,
            notes: notes || undefined,
        };

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
                    <h2 className="text-lg font-semibold">Edit Task</h2>
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

                        {/* Task Info */}
                        <div className="p-3 bg-muted/30 rounded-lg space-y-1">
                            <div className="text-sm font-medium">{task.title}</div>
                            <div className="text-xs text-muted-foreground">
                                Season: {task.seasonName || 'N/A'} • Farm: {task.farmName || 'N/A'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Current assignee: {task.userName || 'N/A'} • Status: {task.status}
                            </div>
                        </div>

                        {/* Status Dropdown */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                            >
                                {TASK_STATUSES.map((s) => (
                                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>

                        {/* Warning when status is changed */}
                        {isStatusChanged && (
                            <div className="flex items-start gap-2 p-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg text-amber-800 dark:text-amber-300">
                                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <strong>⚠️ Status Change:</strong> You are changing the task status from{' '}
                                    <span className="font-medium">{originalStatus}</span> to{' '}
                                    <span className="font-medium">{status}</span>.
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm resize-none"
                                placeholder="Add notes about this intervention..."
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
