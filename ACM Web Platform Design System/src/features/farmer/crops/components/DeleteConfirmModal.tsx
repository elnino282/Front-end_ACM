import { AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Crop } from '../types';
import type { Season } from '@/entities/season';

interface DeleteConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    crop: Crop | null;
    onConfirm: () => void;
    isDeleting?: boolean;
    isLoadingVerification?: boolean;
    canDelete?: boolean;
    seasonsUsingCrop?: Season[];
}

export function DeleteConfirmModal({
    open,
    onOpenChange,
    crop,
    onConfirm,
    isDeleting = false,
    isLoadingVerification = false,
    canDelete = true,
    seasonsUsingCrop = [],
}: DeleteConfirmModalProps) {
    // State 1: Loading verification
    if (isLoadingVerification) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                            Checking Crop Usage
                        </DialogTitle>
                        <DialogDescription>
                            Verifying if this crop is being used in any seasons...
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-8 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // State 2: Cannot delete (crop is in use)
    if (!canDelete && seasonsUsingCrop.length > 0) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-600" />
                            Cannot Delete Crop
                        </DialogTitle>
                    </DialogHeader>
                    {crop && (
                        <div className="py-4 space-y-4">
                            <div className="p-3 bg-gray-50 rounded-md">
                                <p className="text-sm font-medium">
                                    Crop: {crop.cropType}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Seasons using this crop:</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                    {seasonsUsingCrop.map((season) => (
                                        <li key={season.id}>
                                            {season.seasonName}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                                <p className="text-sm text-amber-800">
                                    <strong>Note:</strong> To delete this crop, you must first remove it from all seasons or delete those seasons.
                                </p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    // State 3: Can delete (normal confirmation)
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        Confirm Delete
                    </DialogTitle>
                    <DialogDescription>Are you sure you want to delete this crop record? This action cannot be undone.</DialogDescription>
                </DialogHeader>
                {crop && (
                    <div className="py-4">
                        <p className="text-sm">
                            <strong>Crop:</strong> {crop.cropType}
                        </p>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Deleting...
                            </>
                        ) : (
                            'Delete Crop'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}




