import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface RestoreModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirmRestore: () => void;
}

export function RestoreModal({ open, onOpenChange, onConfirmRestore }: RestoreModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        Confirm Restore
                    </DialogTitle>
                    <DialogDescription>
                        This will restore the system to a previous backup point. Current data will be overwritten.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to restore from this backup? This action cannot be undone.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirmRestore}>
                        Confirm Restore
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
