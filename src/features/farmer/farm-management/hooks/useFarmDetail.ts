import { useMemo } from 'react';
import { useFarmById, type FarmDetailResponse } from '@/entities/farm';
import { useAuth } from '@/features/auth';

/**
 * Feature hook for farm detail with permission checks
 */
export function useFarmDetail(farmId: number) {
    const { user } = useAuth();

    const {
        data: farm,
        isLoading,
        isError,
        error,
        refetch,
    } = useFarmById(farmId);

    // Permission checks
    const permissions = useMemo(() => {
        if (!farm || !user) {
            return {
                canEdit: false,
                canDelete: false,
            };
        }

        // Check if user is owner of the farm - compare by username
        const isOwner = user.username ? farm.ownerUsername === user.username : false;

        return {
            canEdit: isOwner,
            canDelete: isOwner,
        };
    }, [farm, user]);

    return {
        farm,
        isLoading,
        isError,
        error,
        refetch,
        ...permissions,
    };
}



