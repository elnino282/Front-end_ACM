/**
 * Custom hook for displaying Vietnamese address information
 * 
 * Fetches full address details from ward ID and formats for display
 * Uses backend API instead of external API
 */

import { useQuery } from '@tanstack/react-query';
import { getFullAddress, formatAddressComma } from '@/shared/api/backendAddressApi';

interface UseAddressDisplayOptions {
    /**
     * Ward ID to fetch address for
     */
    wardCode?: number | null;
    
    /**
     * Whether to fetch the address
     */
    enabled?: boolean;
}

interface UseAddressDisplayReturn {
    /**
     * Formatted address string (e.g., "Ward, Province")
     */
    formattedAddress: string | null;
    
    /**
     * Province name
     */
    provinceName: string | null;
    
    /**
     * Ward name
     */
    wardName: string | null;
    
    /**
     * Whether the address is being loaded
     */
    isLoading: boolean;
    
    /**
     * Whether there was an error fetching the address
     */
    isError: boolean;
    
    /**
     * Error object if fetch failed
     */
    error: Error | null;
}

/**
 * Hook to fetch and display Vietnamese address from ward ID using backend API
 * 
 * Note: Backend uses 2-level hierarchy (Province > Ward), no District level
 * 
 * @example
 * ```tsx
 * const { formattedAddress, isLoading } = useAddressDisplay({ 
 *   wardCode: farm.addressId 
 * });
 * 
 * return (
 *   <div>
 *     {isLoading ? 'Loading...' : formattedAddress || 'No address'}
 *   </div>
 * );
 * ```
 */
export function useAddressDisplay({
    wardCode,
    enabled = true,
}: UseAddressDisplayOptions): UseAddressDisplayReturn {
    const {
        data: addressData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['backend-address', 'display', wardCode],
        queryFn: () => getFullAddress(wardCode!),
        enabled: enabled && wardCode !== null && wardCode !== undefined,
        staleTime: 1000 * 60 * 60, // Cache for 1 hour
        gcTime: 1000 * 60 * 60 * 2, // Keep in cache for 2 hours
        retry: 1, // Only retry once for address lookups
    });
    
    // Format address if data is available
    const formattedAddress = addressData
        ? formatAddressComma(addressData.province, addressData.ward)
        : null;
    
    const provinceName = addressData?.province.name || null;
    const wardName = addressData?.ward.name || null;
    
    return {
        formattedAddress,
        provinceName,
        wardName,
        isLoading,
        isError,
        error: error as Error | null,
    };
}


