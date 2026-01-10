import { useState } from 'react';
import { useDeleteFarm as useDeleteFarmEntity } from '@/entities/farm';
import { toast } from 'sonner';

/**
 * Feature hook for deleting a farm with conflict detection
 * Handles backend errors when farm has plots or seasons
 */
export function useDeleteFarm() {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [farmToDelete, setFarmToDelete] = useState<{ id: number; name: string } | null>(null);

    const mutation = useDeleteFarmEntity({
        onSuccess: (data, variables) => {
            // Use variables.name instead of farmToDelete state to avoid race conditions
            toast.success(`Farm "${variables.name}" deleted successfully`);
            setIsConfirmOpen(false);
            setFarmToDelete(null);
        },
        onError: (error: any) => {
            const statusCode = error?.response?.status;
            const message = error?.response?.data?.message || error?.message;

            // Check for conflict errors (400/409) indicating plots/seasons exist
            if (statusCode === 400 || statusCode === 409) {
                toast.error(
                    message || 'Cannot delete farm because it still has plots or seasons. Please remove them first.'
                );
            } else {
                toast.error(message || 'Failed to delete farm');
            }
        },
    });

    const handleDeleteRequest = (farmId: number, farmName: string) => {
        setFarmToDelete({ id: farmId, name: farmName });
        setIsConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        console.log('[useDeleteFarm Feature] handleDeleteConfirm called');
        console.log('[useDeleteFarm Feature] farmToDelete:', farmToDelete);
        if (farmToDelete) {
            // Pass the entire farm object { id, name } to mutation
            mutation.mutate(farmToDelete);
        }
    };

    const handleDeleteCancel = () => {
        setIsConfirmOpen(false);
        setFarmToDelete(null);
    };

    return {
        isConfirmOpen,
        farmToDelete,
        handleDeleteRequest,
        handleDeleteConfirm,
        handleDeleteCancel,
        isDeleting: mutation.isPending,
    };
}



