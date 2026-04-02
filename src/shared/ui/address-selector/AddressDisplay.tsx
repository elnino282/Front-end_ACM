/**
 * AddressDisplay Component
 * 
 * Displays Vietnamese address with loading state
 */

import { useAddressDisplay } from './useAddressDisplay';
import { Skeleton } from '../skeleton';
import { MapPin } from 'lucide-react';

export interface AddressDisplayProps {
    /**
     * Ward code to display address for
     */
    wardCode?: number | null;
    
    /**
     * Fallback text when no address available
     */
    fallback?: string;
    
    /**
     * Display variant
     */
    variant?: 'full' | 'compact' | 'id-only';
    
    /**
     * Whether to show the map pin icon
     */
    showIcon?: boolean;
    
    /**
     * Additional CSS classes
     */
    className?: string;
}

/**
 * AddressDisplay Component
 * 
 * Automatically fetches and displays Vietnamese address from ward code
 * 
 * @example
 * ```tsx
 * // Full address display
 * <AddressDisplay wardCode={farm.addressId} />
 * 
 * // Compact display
 * <AddressDisplay wardCode={farm.addressId} variant="compact" />
 * 
 * // ID only fallback
 * <AddressDisplay wardCode={farm.addressId} variant="id-only" />
 * ```
 */
export function AddressDisplay({
    wardCode,
    fallback = '—',
    variant = 'full',
    showIcon = false,
    className = '',
}: AddressDisplayProps) {
    const { formattedAddress, isLoading, isError } = useAddressDisplay({
        wardCode,
        enabled: variant !== 'id-only',
    });
    
    // Loading state
    if (isLoading && variant !== 'id-only') {
        return <Skeleton className={`h-4 w-32 ${className}`} />;
    }
    
    // Error or no data - show fallback
    if ((isError || !formattedAddress) && wardCode) {
        if (variant === 'id-only') {
            return (
                <span className={className}>
                    {showIcon && <MapPin className="inline-block w-3 h-3 mr-1 -mt-0.5" />}
                    #{wardCode}
                </span>
            );
        }
        
        // For full/compact, show ID as fallback
        return (
            <span className={`text-gray-500 ${className}`}>
                {showIcon && <MapPin className="inline-block w-3 h-3 mr-1 -mt-0.5" />}
                Address ID: #{wardCode}
            </span>
        );
    }
    
    // No ward code provided
    if (!wardCode) {
        return <span className={`text-gray-400 ${className}`}>{fallback}</span>;
    }
    
    // Display formatted address
    // Note: Backend only has 2 levels (Ward, Province), so compact shows province only
    const displayText = variant === 'compact' && formattedAddress
        ? formattedAddress.split(',').slice(-1).join(',').trim() // Show only last part (Province)
        : formattedAddress;
    
    return (
        <span className={className}>
            {showIcon && <MapPin className="inline-block w-3 h-3 mr-1 -mt-0.5" />}
            {displayText}
        </span>
    );
}




