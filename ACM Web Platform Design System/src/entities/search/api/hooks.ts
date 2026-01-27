import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { searchApi } from "./client";
import { searchKeys } from "../model/keys";
import type { GlobalSearchParams, SearchResponse } from "../model/types";

type UseGlobalSearchOptions = Omit<
  UseQueryOptions<SearchResponse, Error>,
  "queryKey" | "queryFn"
>;

const buildKeyParams = (params?: GlobalSearchParams) => {
  if (!params) return undefined;
  return {
    q: params.q,
    types: params.types?.join(","),
    limit: params.limit ?? 5,
  };
};

export function useGlobalSearch(
  params: GlobalSearchParams,
  options?: UseGlobalSearchOptions,
) {
  return useQuery({
    queryKey: searchKeys.query(buildKeyParams(params)),
    queryFn: () => searchApi.search(params),
    ...options,
  });
}
