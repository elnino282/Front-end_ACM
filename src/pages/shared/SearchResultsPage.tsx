import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import { useDebounce } from "@/shared/lib";
import { useGlobalSearch, type SearchEntityType } from "@/entities/search";

type PortalKind = "admin" | "farmer";

const TYPE_LABELS: Record<SearchEntityType, string> = {
  FARM: "Farms",
  PLOT: "Plots",
  SEASON: "Seasons",
  TASK: "Tasks",
  EXPENSE: "Expenses",
  DOCUMENT: "Documents",
  USER: "Users",
};

const TYPE_ORDER: Record<PortalKind, SearchEntityType[]> = {
  admin: ["FARM", "PLOT", "SEASON", "DOCUMENT", "USER"],
  farmer: ["PLOT", "SEASON", "TASK", "EXPENSE", "DOCUMENT"],
};

type SearchResultsPageProps = {
  portal: PortalKind;
};

export function SearchResultsPage({ portal }: SearchResultsPageProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  const debouncedQuery = useDebounce(query, 300);
  const normalizedQuery = debouncedQuery.trim();
  const searchEnabled = normalizedQuery.length >= 2;

  const allowedTypes = TYPE_ORDER[portal];
  const rawType = (searchParams.get("type") ?? "").toUpperCase();
  const activeType = (allowedTypes.includes(rawType as SearchEntityType)
    ? rawType
    : "ALL") as "ALL" | SearchEntityType;

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (normalizedQuery) {
          next.set("q", normalizedQuery);
        } else {
          next.delete("q");
        }
        return next;
      },
      { replace: true },
    );
  }, [normalizedQuery, setSearchParams]);

  const { data, isFetching, isError } = useGlobalSearch(
    { q: normalizedQuery, limit: 20 },
    { enabled: searchEnabled, staleTime: 10_000 },
  );

  const groupedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const grouped = data?.grouped ?? {};
    for (const type of allowedTypes) {
      counts[type] = grouped[type] ?? 0;
    }
    return counts;
  }, [allowedTypes, data?.grouped]);

  const totalCount = useMemo(
    () =>
      allowedTypes.reduce((sum, type) => sum + (groupedCounts[type] ?? 0), 0),
    [allowedTypes, groupedCounts],
  );

  const filteredResults = useMemo(() => {
    const results = data?.results ?? [];
    if (activeType === "ALL") {
      return results;
    }
    return results.filter((item) => item.type === activeType);
  }, [activeType, data?.results]);

  const updateType = (value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === "ALL") {
          next.delete("type");
        } else {
          next.set("type", value);
        }
        return next;
      },
      { replace: true },
    );
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Search Results</h1>
        <p className="text-muted-foreground">
          {normalizedQuery
            ? `Showing results for "${normalizedQuery}"`
            : "Type a keyword to search."}
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search across the platform"
                className="pl-9 h-9"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <Tabs value={activeType} onValueChange={updateType}>
              <TabsList className="h-9">
                <TabsTrigger value="ALL" className="text-xs">
                  All
                  <Badge variant="secondary" className="ml-2 text-[10px]">
                    {totalCount}
                  </Badge>
                </TabsTrigger>
                {allowedTypes.map((type) => (
                  <TabsTrigger key={type} value={type} className="text-xs">
                    {TYPE_LABELS[type]}
                    <Badge variant="secondary" className="ml-2 text-[10px]">
                      {groupedCounts[type] ?? 0}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {!searchEnabled && normalizedQuery.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Type at least 2 characters to search.
            </div>
          )}

          {searchEnabled && isFetching && (
            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          )}

          {searchEnabled && isError && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              Search failed. Please try again.
            </div>
          )}

          {searchEnabled && !isFetching && !isError && (
            <>
              {filteredResults.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No results match your search.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredResults.map((item) => (
                    <div
                      key={`${item.type}-${item.id}-${item.title}`}
                      className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
                    >
                      <div>
                        <div className="text-sm font-medium">{item.title}</div>
                        {item.subtitle && (
                          <div className="text-xs text-muted-foreground">
                            {item.subtitle}
                          </div>
                        )}
                        <div className="mt-1 text-[10px] uppercase text-muted-foreground">
                          {TYPE_LABELS[item.type] ?? item.type}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => item.route && navigate(item.route)}
                      >
                        Open
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
