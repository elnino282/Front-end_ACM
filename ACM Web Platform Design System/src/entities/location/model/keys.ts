// Location Entity Query Keys
export const locationKeys = {
    all: ['locations'] as const,
    provinces: () => [...locationKeys.all, 'provinces'] as const,
    wards: (provinceId: number) => [...locationKeys.all, 'wards', provinceId] as const,
};
