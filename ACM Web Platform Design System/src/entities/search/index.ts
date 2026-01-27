// Global Search Entity - Public API

export type {
  SearchEntityType,
  SearchResultItem,
  SearchResponse,
  GlobalSearchParams,
} from "./model/types";

export {
  SearchEntityTypeSchema,
  SearchResultItemSchema,
  SearchResponseSchema,
} from "./model/schemas";

export { searchKeys } from "./model/keys";
export { searchApi } from "./api/client";
export { useGlobalSearch } from "./api/hooks";
