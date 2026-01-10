/**
 * Vietnam Provinces API Client
 * 
 * Integration with Vietnam Provinces online API for hierarchical address selection
 * API Docs: https://provinces.open-api.vn/
 */

import axios from 'axios';

const VIETNAM_API_BASE_URL = 'https://provinces.open-api.vn/api';

// Types matching the API schema
export interface Province {
    code: number;
    name: string;
    division_type: string;
    codename: string;
    phone_code: number;
    districts?: District[];
}

export interface District {
    code: number;
    name: string;
    division_type: string;
    codename: string;
    province_code: number;
    wards?: Ward[];
}

export interface Ward {
    code: number;
    name: string;
    division_type: string;
    codename: string;
    district_code: number;
}

export interface SearchResult {
    code: number;
    name: string;
    matches?: Record<string, [number, number]>;
}

// Create axios instance for Vietnam API
const vietnamApi = axios.create({
    baseURL: VIETNAM_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Fetch all provinces
 */
export const fetchProvinces = async (): Promise<Province[]> => {
    const response = await vietnamApi.get<Province[]>('/p/');
    return response.data;
};

/**
 * Fetch a single province by code with optional depth
 * @param code Province code
 * @param depth 1=province only, 2=include districts, 3=include wards
 */
export const fetchProvinceByCode = async (
    code: number,
    depth: 1 | 2 | 3 = 1
): Promise<Province> => {
    const response = await vietnamApi.get<Province>(`/p/${code}`, {
        params: { depth },
    });
    return response.data;
};

/**
 * Search provinces by keyword
 * @param query Search keyword
 */
export const searchProvinces = async (query: string): Promise<SearchResult[]> => {
    const response = await vietnamApi.get<SearchResult[]>('/p/search/', {
        params: { q: query },
    });
    return response.data;
};

/**
 * Fetch all districts
 */
export const fetchDistricts = async (): Promise<District[]> => {
    const response = await vietnamApi.get<District[]>('/d/');
    return response.data;
};

/**
 * Fetch districts by province code
 * @param provinceCode Province code to filter
 */
export const fetchDistrictsByProvince = async (
    provinceCode: number
): Promise<SearchResult[]> => {
    const response = await vietnamApi.get<SearchResult[]>('/d/search/', {
        params: { p: provinceCode, q: '' },
    });
    return response.data;
};

/**
 * Fetch a single district by code with optional depth
 * @param code District code
 * @param depth 1=district only, 2=include wards
 */
export const fetchDistrictByCode = async (
    code: number,
    depth: 1 | 2 = 1
): Promise<District> => {
    const response = await vietnamApi.get<District>(`/d/${code}`, {
        params: { depth },
    });
    return response.data;
};

/**
 * Search districts by keyword, optionally filtered by province
 * @param query Search keyword
 * @param provinceCode Optional province code to filter
 */
export const searchDistricts = async (
    query: string,
    provinceCode?: number
): Promise<SearchResult[]> => {
    const response = await vietnamApi.get<SearchResult[]>('/d/search/', {
        params: { q: query, p: provinceCode },
    });
    return response.data;
};

/**
 * Fetch all wards
 */
export const fetchWards = async (): Promise<Ward[]> => {
    const response = await vietnamApi.get<Ward[]>('/w/');
    return response.data;
};

/**
 * Fetch wards by district code
 * @param districtCode District code to filter
 */
export const fetchWardsByDistrict = async (
    districtCode: number
): Promise<SearchResult[]> => {
    const response = await vietnamApi.get<SearchResult[]>('/w/search/', {
        params: { d: districtCode, q: '' },
    });
    return response.data;
};

/**
 * Fetch a single ward by code
 * @param code Ward code
 */
export const fetchWardByCode = async (code: number): Promise<Ward> => {
    const response = await vietnamApi.get<Ward>(`/w/${code}`);
    return response.data;
};

/**
 * Search wards by keyword, optionally filtered by district or province
 * @param query Search keyword
 * @param districtCode Optional district code to filter
 * @param provinceCode Optional province code to filter (ignored if district is provided)
 */
export const searchWards = async (
    query: string,
    districtCode?: number,
    provinceCode?: number
): Promise<SearchResult[]> => {
    const response = await vietnamApi.get<SearchResult[]>('/w/search/', {
        params: { q: query, d: districtCode, p: provinceCode },
    });
    return response.data;
};

/**
 * Get full address hierarchy from ward code
 * Returns province, district, and ward information
 */
export const getFullAddress = async (
    wardCode: number
): Promise<{ province: Province; district: District; ward: Ward }> => {
    // First fetch the ward to get district code
    const ward = await fetchWardByCode(wardCode);
    
    // Fetch district with depth 1 (no wards needed)
    const district = await fetchDistrictByCode(ward.district_code, 1);
    
    // Fetch province with depth 1 (no districts needed)
    const province = await fetchProvinceByCode(district.province_code, 1);
    
    return { province, district, ward };
};

/**
 * Format address as breadcrumb string
 */
export const formatAddressBreadcrumb = (
    province: Province,
    district: District,
    ward: Ward
): string => {
    return `${province.name} > ${district.name} > ${ward.name}`;
};

/**
 * Format address as comma-separated string
 */
export const formatAddressComma = (
    province: Province,
    district: District,
    ward: Ward
): string => {
    return `${ward.name}, ${district.name}, ${province.name}`;
};




