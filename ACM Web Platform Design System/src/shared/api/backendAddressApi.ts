/**
 * Backend Address API Client
 * 
 * Integration with internal backend API for Province and Ward address selection
 * API Base: /api/v1/address
 * 
 * This replaces the external provinces.open-api.vn API with our backend data
 */

import { z } from 'zod';
import httpClient from './http';
import { parseApiResponse } from './types';

// ═══════════════════════════════════════════════════════════════
// TYPES MATCHING BACKEND DTOs
// ═══════════════════════════════════════════════════════════════

/**
 * Province Response - matches ProvinceResponse.java
 */
export const ProvinceResponseSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    slug: z.string(),
    type: z.string(), // 'thanh-pho' (city) | 'tinh' (province)
    nameWithType: z.string(),
});

export type ProvinceResponse = z.infer<typeof ProvinceResponseSchema>;

/**
 * Ward Response - matches WardResponse.java
 */
export const WardResponseSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    slug: z.string(),
    type: z.string(), // 'xa' (commune) | 'phuong' (ward) | 'dac-khu' (special zone)
    nameWithType: z.string(),
    provinceId: z.number().int(),
});

export type WardResponse = z.infer<typeof WardResponseSchema>;

/**
 * Address Statistics Response
 */
export const AddressStatsSchema = z.object({
    provinceCount: z.number(),
    wardCount: z.number(),
});

export type AddressStats = z.infer<typeof AddressStatsSchema>;

// ═══════════════════════════════════════════════════════════════
// API FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Fetch all provinces with optional filters
 * @param keyword Optional search keyword for province name
 * @param type Optional type filter: 'thanh-pho' (city) or 'tinh' (province)
 * @returns Array of provinces
 */
export const fetchProvinces = async (
    keyword?: string,
    type?: string
): Promise<ProvinceResponse[]> => {
    const params: Record<string, string> = {};
    if (keyword) params.keyword = keyword;
    if (type) params.type = type;

    const response = await httpClient.get('/api/v1/address/provinces', { params });
    return parseApiResponse(response.data, z.array(ProvinceResponseSchema));
};

/**
 * Fetch a single province by ID
 * @param id Province ID
 * @returns Province details
 * @throws AppException with ERR_PROVINCE_NOT_FOUND if not found
 */
export const fetchProvinceById = async (id: number): Promise<ProvinceResponse> => {
    const response = await httpClient.get(`/api/v1/address/provinces/${id}`);
    return parseApiResponse(response.data, ProvinceResponseSchema);
};

/**
 * Fetch all wards for a specific province
 * @param provinceId Province ID to filter wards
 * @param keyword Optional search keyword for ward name
 * @returns Array of wards in the province
 * @throws AppException with ERR_PROVINCE_NOT_FOUND if province doesn't exist
 */
export const fetchWardsByProvince = async (
    provinceId: number,
    keyword?: string
): Promise<WardResponse[]> => {
    const params: Record<string, string> = {};
    if (keyword) params.keyword = keyword;

    const response = await httpClient.get(
        `/api/v1/address/provinces/${provinceId}/wards`,
        { params }
    );
    return parseApiResponse(response.data, z.array(WardResponseSchema));
};

/**
 * Fetch a single ward by ID
 * @param id Ward ID
 * @returns Ward details including provinceId
 * @throws AppException with ERR_WARD_NOT_FOUND if not found
 */
export const fetchWardById = async (id: number): Promise<WardResponse> => {
    const response = await httpClient.get(`/api/v1/address/wards/${id}`);
    return parseApiResponse(response.data, WardResponseSchema);
};

/**
 * Get address statistics (province and ward counts)
 * Useful for debugging purposes
 * @returns Address statistics
 */
export const fetchAddressStats = async (): Promise<AddressStats> => {
    const response = await httpClient.get('/api/v1/address/stats');
    return parseApiResponse(response.data, AddressStatsSchema);
};

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Format address as breadcrumb string
 * @param province Province data
 * @param ward Ward data
 * @returns Formatted string: "Province Name > Ward Name"
 */
export const formatAddressBreadcrumb = (
    province: ProvinceResponse,
    ward: WardResponse
): string => {
    return `${province.name} > ${ward.name}`;
};

/**
 * Format address as comma-separated string
 * @param province Province data
 * @param ward Ward data
 * @returns Formatted string: "Ward Name, Province Name"
 */
export const formatAddressComma = (
    province: ProvinceResponse,
    ward: WardResponse
): string => {
    return `${ward.name}, ${province.name}`;
};

/**
 * Get full address details from ward ID
 * Fetches ward first, then its province
 * @param wardId Ward ID
 * @returns Province and Ward data
 */
export const getFullAddress = async (
    wardId: number
): Promise<{ province: ProvinceResponse; ward: WardResponse }> => {
    // Fetch ward to get provinceId
    const ward = await fetchWardById(wardId);
    
    // Fetch province
    const province = await fetchProvinceById(ward.provinceId);
    
    return { province, ward };
};

