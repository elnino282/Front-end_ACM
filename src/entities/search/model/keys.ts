export const searchKeys = {
  all: ["globalSearch"] as const,
  query: (params?: { q?: string; types?: string; limit?: number }) =>
    [...searchKeys.all, params] as const,
};
