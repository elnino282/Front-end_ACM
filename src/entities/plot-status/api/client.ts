import { PlotStatusArrayResponseSchema } from '../model/schemas';
import type { PlotStatusArrayResponse } from '../model/types';

// ═══════════════════════════════════════════════════════════════
// PLOT STATUS API CLIENT
// Pure Axios calls with Zod validation (no React dependencies)
// ═══════════════════════════════════════════════════════════════

export const plotStatusApi = {
    /**
     * List all plot statuses
     */
    listAll: async (): Promise<PlotStatusArrayResponse> => {
        const data: PlotStatusArrayResponse = [
            { id: 1, statusName: 'AVAILABLE', description: 'Ready for planning' },
            { id: 2, statusName: 'PLANNED', description: 'Season planned' },
            { id: 3, statusName: 'ACTIVE', description: 'Currently planted' },
            { id: 4, statusName: 'RESTING', description: 'Fallow/resting period' },
            { id: 5, statusName: 'INACTIVE', description: 'Not in use' },
        ];
        return PlotStatusArrayResponseSchema.parse(data);
    },
};
