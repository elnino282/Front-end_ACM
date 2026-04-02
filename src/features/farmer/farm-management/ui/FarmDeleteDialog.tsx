import { AlertCircle, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Button,
} from '@/shared/ui';
import { useDeleteFarm } from '@/entities/farm';

interface FarmDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmId: number;
    farmName: string;
    onDeleteSuccess?: () => void;
}

/**
 * Farm delete confirmation dialog with integrated deletion
 */
export function FarmDeleteDialog({
    open,
    onOpenChange,
    farmId,
    farmName,
    onDeleteSuccess,
}: FarmDeleteDialogProps) {
    const deleteMutation = useDeleteFarm({
        onSuccess: () => {
            toast.success('Farm deleted successfully');
            onOpenChange(false);
            onDeleteSuccess?.();
        },
        onError: (error: Error) => {
            const errorMessage = error.message || 'Failed to delete farm';
            toast.error(errorMessage);
        },
    });

    const handleConfirm = () => {
        deleteMutation.mutate({ id: farmId, name: farmName });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        Delete Farm
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the farm "{farmName}"? 
                        This will deactivate the farm and mark it as deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={deleteMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={deleteMutation.isPending}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        {deleteMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}



