import {
    useQuery,
    type UseQueryOptions,
} from '@tanstack/react-query';
import { locationKeys } from '../model/keys';
import { locationApi } from './client';
import type {
    ProvinceArrayResponse,
    WardArrayResponse,
} from '../model/types';

// ═══════════════════════════════════════════════════════════════
// LOCATION REACT QUERY HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Hook to fetch all provinces for dropdown selection
 */
export const useProvinces = (
    options?: Omit<UseQueryOptions<ProvinceArrayResponse, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: locationKeys.provinces(),
    queryFn: locationApi.getProvinces,
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes - provinces rarely change
    ...options,
});

/**
 * Hook to fetch wards by province ID for dropdown selection
 */
export const useWardsByProvince = (
    provinceId: number,
    options?: Omit<UseQueryOptions<WardArrayResponse, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: locationKeys.wards(provinceId),
    queryFn: () => locationApi.getWards(provinceId),
    enabled: provinceId > 0, // Only fetch when provinceId is valid
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes - wards rarely change
    ...options,
});
