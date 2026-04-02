export type SearchEntityType =
  | "PLOT"
  | "SEASON"
  | "TASK"
  | "EXPENSE"
  | "DOCUMENT"
  | "FARM"
  | "USER";

export interface SearchResultItem {
  type: SearchEntityType;
  id: number | string | null;
  title: string;
  subtitle?: string | null;
  route?: string | null;
  extra?: Record<string, unknown> | null;
}

export interface SearchResponse {
  q: string;
  limit: number;
  results: SearchResultItem[];
  grouped: Record<string, number>;
}

export interface GlobalSearchParams {
  q: string;
  types?: SearchEntityType[];
  limit?: number;
}
