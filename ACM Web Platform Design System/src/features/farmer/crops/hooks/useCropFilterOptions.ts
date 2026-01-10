import { useMemo } from 'react';
import type { Crop } from '../types';

export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterOptions {
    plotOptions: FilterOption[];
    seasonOptions: FilterOption[];
    cropTypeOptions: FilterOption[];
    varietyOptions: FilterOption[];
}

/**
 * Custom hook to extract unique filter options from crops data
 * Returns dynamic filter options based on actual crop data
 */
export function useCropFilterOptions(crops: Crop[]): FilterOptions {
    return useMemo(() => {
        // Extract unique plots
        const uniquePlots = new Set<string>();
        const uniqueSeasons = new Set<string>();
        const uniqueCropTypes = new Set<string>();
        const uniqueVarieties = new Set<string>();

        crops.forEach((crop) => {
            if (crop.plot && crop.plot.trim()) {
                uniquePlots.add(crop.plot);
            }
            if (crop.season && crop.season.trim()) {
                uniqueSeasons.add(crop.season);
            }
            if (crop.cropType && crop.cropType.trim()) {
                uniqueCropTypes.add(crop.cropType);
            }
            if (crop.variety && crop.variety.trim()) {
                uniqueVarieties.add(crop.variety);
            }
        });

        // Convert sets to sorted arrays and format as options
        const plotOptions: FilterOption[] = [
            { value: 'all', label: 'All Plots' },
            ...Array.from(uniquePlots)
                .sort()
                .map((plot) => ({ value: plot, label: plot })),
        ];

        const seasonOptions: FilterOption[] = [
            { value: 'all', label: 'All Seasons' },
            ...Array.from(uniqueSeasons)
                .sort()
                .map((season) => ({ value: season, label: season })),
        ];

        const cropTypeOptions: FilterOption[] = [
            { value: 'all', label: 'All Crop Types' },
            ...Array.from(uniqueCropTypes)
                .sort()
                .map((type) => ({ value: type, label: type })),
        ];

        const varietyOptions: FilterOption[] = [
            { value: 'all', label: 'All Varieties' },
            ...Array.from(uniqueVarieties)
                .sort()
                .map((variety) => ({ value: variety, label: variety })),
        ];

        return {
            plotOptions,
            seasonOptions,
            cropTypeOptions,
            varietyOptions,
        };
    }, [crops]);
}




