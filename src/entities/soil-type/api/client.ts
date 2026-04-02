import { SoilTypeArrayResponseSchema } from '../model/schemas';
import type { SoilTypeArrayResponse } from '../model/types';

// ═══════════════════════════════════════════════════════════════
// SOIL TYPE API CLIENT
// Pure Axios calls with Zod validation (no React dependencies)
// ═══════════════════════════════════════════════════════════════

export const soilTypeApi = {
    /**
     * List all soil types
     */
    listAll: async (): Promise<SoilTypeArrayResponse> => {
        const data: SoilTypeArrayResponse = [
            { id: 1, soilName: 'Loam', description: 'Balanced sand, silt, and clay' },
            { id: 2, soilName: 'Sandy', description: 'Fast drainage with low nutrient retention' },
            { id: 3, soilName: 'Clay', description: 'High nutrient retention, slow drainage' },
            { id: 4, soilName: 'Silt', description: 'Fine particles, retains moisture well' },
            { id: 5, soilName: 'Peaty', description: 'High organic matter, acidic' },
            { id: 6, soilName: 'Chalky', description: 'Alkaline soil with visible stones' },
        ];
        return SoilTypeArrayResponseSchema.parse(data);
    },
};
