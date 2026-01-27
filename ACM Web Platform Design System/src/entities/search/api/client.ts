import httpClient from "@/shared/api/http";
import { parseApiResponse } from "@/shared/api/types";

import { SearchResponseSchema } from "../model/schemas";
import type { GlobalSearchParams, SearchResponse } from "../model/types";

export const searchApi = {
  search: async (params: GlobalSearchParams): Promise<SearchResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.set("q", params.q);
    if (params.types?.length) {
      queryParams.set("types", params.types.join(","));
    }
    if (params.limit) {
      queryParams.set("limit", String(params.limit));
    }

    const response = await httpClient.get(
      `/api/v1/search?${queryParams.toString()}`,
    );
    return parseApiResponse(response.data, SearchResponseSchema);
  },
};
