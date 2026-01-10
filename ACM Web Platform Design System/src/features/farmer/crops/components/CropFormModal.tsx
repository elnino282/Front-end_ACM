import { useState } from 'react';
import { Sprout, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CropRequest } from '@/entities/crop';

interface CropFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEditing: boolean;
    initialData?: {
        cropName: string;
        description: string;
    };
    onSubmit: (data: CropRequest) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

/**
 * CropFormModal Component
 *
 * Dialog for creating/editing a crop definition matching backend API structure.
 * 
 * Backend expects:
 * - cropName: string (required)
 * - description: string (optional)
 * 
 * Note: This modal is for managing crop DEFINITIONS (e.g., "Rice", "Corn", "Wheat"),
 * not for recording crop plantings on plots/seasons. For planting records,
 * use the Season creation flow which links crops to plots.
 */
export function CropFormModal({
    open,
    onOpenChange,
    isEditing,
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: CropFormModalProps) {
    // Form state
    const [cropName, setCropName] = useState(initialData?.cropName ?? '');
    const [description, setDescription] = useState(initialData?.description ?? '');

    const isFormValid = cropName.trim().length > 0;

    const resetForm = () => {
        setCropName(initialData?.cropName ?? '');
        setDescription(initialData?.description ?? '');
    };

    const handleClose = () => {
        resetForm();
        onCancel();
    };

    const handleSubmit = () => {
        if (!isFormValid) return;

        const formData: CropRequest = {
            cropName: cropName.trim(),
            description: description.trim() || undefined,
        };

        onSubmit(formData);
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                handleClose();
            }
            onOpenChange(isOpen);
        }}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-foreground">
                        <Sprout className="w-5 h-5 text-primary" />
                        {isEditing ? 'Edit Crop' : 'Add New Crop'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update the crop definition details'
                            : 'Create a new crop type that can be planted in your farm'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Crop Name */}
                    <div className="space-y-2">
                        <Label htmlFor="cropName">Crop Name *</Label>
                        <Input
                            id="cropName"
                            value={cropName}
                            onChange={(e) => setCropName(e.target.value)}
                            placeholder="e.g., Rice, Corn, Wheat, Tomato"
                            required
                            className="border-border focus:border-primary"
                        />
                        <p className="text-xs text-muted-foreground">
                            Enter the name of the crop type you want to add
                        </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Additional information about this crop type..."
                            rows={3}
                            className="border-border focus:border-primary"
                        />
                        <p className="text-xs text-muted-foreground">
                            Optional details about growing conditions, varieties, or notes
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-primary hover:bg-primary/90 text-white"
                        onClick={handleSubmit}
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                {isEditing ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                {isEditing ? 'Update Crop' : 'Create Crop'}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}




