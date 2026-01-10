// Plot Entity - Public API
// Handles plot management for farmers

// Types
export type {
    PlotListParams,
    Plot,
    PlotResponse,
    PlotArrayResponse,
    PlotRequest,
} from './model/types';

// Schemas (for external validation needs)
export {
    PlotListParamsSchema,
    PlotSchema,
    PlotResponseSchema,
    PlotArrayResponseSchema,
    PlotRequestSchema,
} from './model/schemas';

// Keys
export { plotKeys } from './model/keys';

// API Client
export { plotApi } from './api/client';

// Hooks
export {
    usePlots,
    usePlotsByFarm,
    usePlotById,
    useCreatePlot,
    useCreatePlotInFarm,
    useUpdatePlot,
    useDeletePlot,
} from './api/hooks';
