/**
 * Custom hook for Vietnamese address selection using Backend API
 * 
 * Manages cascading selection of Province > Ward (2-level hierarchy)
 * with loading states and backend API integration
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    fetchProvinces,
    fetchWardsByProvince,
    fetchWardById,
    type ProvinceResponse,
    type WardResponse,
} from '@/shared/api/backendAddressApi';

interface UseVietnameseAddressOptions {
    /**
     * Initial ward ID to populate the selector
     */
    initialWardCode?: number | null;
    /**
     * Callback when ward selection changes (deprecated - use onAddressChange)
     */
    onWardChange?: (wardId: number | null) => void;
    /**
     * Callback when address selection changes (provides both provinceId and wardId)
     */
    onAddressChange?: (provinceId: number | null, wardId: number | null) => void;
}

interface UseVietnameseAddressReturn {
    // Data
    provinces: ProvinceResponse[];
    wards: WardResponse[];
    
    // Selected values
    selectedProvince: number | null;
    selectedWard: number | null;
    
    // Loading states
    isLoadingProvinces: boolean;
    isLoadingWards: boolean;
    isLoadingInitial: boolean;
    
    // Error states
    provincesError: Error | null;
    wardsError: Error | null;
    
    // Selection handlers
    handleProvinceChange: (provinceId: number | null) => void;
    handleWardChange: (wardId: number | null) => void;
    
    // Utility methods
    clearSelection: () => void;
    getAddressBreadcrumb: () => string | null;
}

/**
 * Hook for managing Vietnamese address selection with backend API
 * 
 * Features:
 * - 2-level cascading selection: Province > Ward
 * - Automatic province/ward pre-selection from initial ward ID
 * - Loading states for each level
 * - Error handling
 * - Address breadcrumb formatting
 * 
 * @param options - Hook configuration options
 * @returns Address selection state and handlers
 */
export function useVietnameseAddress({
    initialWardCode,
    onWardChange,
    onAddressChange,
}: UseVietnameseAddressOptions = {}): UseVietnameseAddressReturn {
    // Selected values
    const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
    const [selectedWard, setSelectedWard] = useState<number | null>(null);
    
    // Fetch all provinces (always loaded)
    const {
        data: provinces = [],
        isLoading: isLoadingProvinces,
        error: provincesError,
    } = useQuery({
        queryKey: ['backend-address', 'provinces'],
        queryFn: () => fetchProvinces(),
        staleTime: 1000 * 60 * 60, // Cache for 1 hour
        gcTime: 1000 * 60 * 60 * 2, // Keep in cache for 2 hours
    });
    
    // Fetch wards when province is selected
    const {
        data: wards = [],
        isLoading: isLoadingWards,
        error: wardsError,
    } = useQuery({
        queryKey: ['backend-address', 'wards', selectedProvince],
        queryFn: () => fetchWardsByProvince(selectedProvince!),
        enabled: selectedProvince !== null,
        staleTime: 1000 * 60 * 30, // Cache for 30 minutes
        gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    });
    
    // Fetch initial ward if wardId provided (for edit mode)
    const {
        data: initialWard,
        isLoading: isLoadingInitial,
    } = useQuery({
        queryKey: ['backend-address', 'ward', initialWardCode],
        queryFn: () => fetchWardById(initialWardCode!),
        enabled: initialWardCode !== null && initialWardCode !== undefined,
        staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    });
    
    // Populate initial values when initial ward is loaded
    useEffect(() => {
        if (initialWard && initialWardCode) {
            setSelectedProvince(initialWard.provinceId);
            setSelectedWard(initialWard.id);
        }
    }, [initialWard, initialWardCode]);
    
    // Province change handler
    const handleProvinceChange = useCallback((provinceId: number | null) => {
        setSelectedProvince(provinceId);
        setSelectedWard(null); // Reset ward when province changes
        
        if (!provinceId) {
            onWardChange?.(null);
            onAddressChange?.(null, null);
        } else {
            onAddressChange?.(provinceId, null);
        }
    }, [onWardChange, onAddressChange]);
    
    // Ward change handler
    const handleWardChange = useCallback((wardId: number | null) => {
        setSelectedWard(wardId);
        onWardChange?.(wardId);
        onAddressChange?.(selectedProvince, wardId);
    }, [onWardChange, onAddressChange, selectedProvince]);
    
    // Clear all selections
    const clearSelection = useCallback(() => {
        setSelectedProvince(null);
        setSelectedWard(null);
        onWardChange?.(null);
        onAddressChange?.(null, null);
    }, [onWardChange, onAddressChange]);
    
    // Get address breadcrumb string
    const getAddressBreadcrumb = useCallback((): string | null => {
        if (!selectedProvince || !selectedWard) {
            return null;
        }
        
        const province = provinces.find(p => p.id === selectedProvince);
        const ward = wards.find(w => w.id === selectedWard);
        
        if (!province || !ward) {
            return null;
        }
        
        return `${province.name} > ${ward.name}`;
    }, [selectedProvince, selectedWard, provinces, wards]);
    
    return {
        // Data
        provinces,
        wards,
        
        // Selected values
        selectedProvince,
        selectedWard,
        
        // Loading states
        isLoadingProvinces,
        isLoadingWards,
        isLoadingInitial,
        
        // Error states
        provincesError: provincesError as Error | null,
        wardsError: wardsError as Error | null,
        
        // Selection handlers
        handleProvinceChange,
        handleWardChange,
        
        // Utility methods
        clearSelection,
        getAddressBreadcrumb,
    };
}


