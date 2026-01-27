import {
  useGlobalSearch,
  type SearchEntityType,
  type SearchResultItem,
} from "@/entities/search";
import { useDebounce } from "@/shared/lib";
import { Badge, Input, ScrollArea } from "@/shared/ui";
import { Loader2, Search } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import type { SearchBarProps } from "../model/types";

type PortalKind = "admin" | "farmer";

const DEFAULT_LIMIT = 5;

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

const QUICK_LINKS: Record<
  PortalKind,
  Array<{ label: string; route: string }>
> = {
  admin: [
    { label: "Inventory Risks", route: "/admin/inventory?status=RISK" },
    { label: "Incidents", route: "/admin/incidents" },
    { label: "Alerts Center", route: "/admin/alerts" },
    { label: "Farms & Plots", route: "/admin/farms-plots" },
    { label: "Documents", route: "/admin/documents" },
  ],
  farmer: [
    { label: "Tasks Workspace", route: "/farmer/tasks" },
    { label: "Expenses", route: "/farmer/expenses" },
    { label: "Documents", route: "/farmer/documents" },
    { label: "Inventory", route: "/farmer/inventory" },
  ],
};

type NavItem = {
  route: string;
  title: string;
  subtitle?: string | null;
  type?: SearchEntityType;
};

export function GlobalSearchBar({
  portal,
  placeholder = "Search plots, seasons, tasks, docs...",
}: SearchBarProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);
  const normalizedQuery = debouncedQuery.trim();
  const canSearch = normalizedQuery.length >= 2;

  const { data, isFetching, isError } = useGlobalSearch(
    { q: normalizedQuery, limit: DEFAULT_LIMIT },
    { enabled: canSearch, staleTime: 10_000 },
  );

  const resultGroups = useMemo(() => {
    const groups: Record<string, SearchResultItem[]> = {};
    for (const item of data?.results ?? []) {
      const type = item.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      if (groups[type].length < DEFAULT_LIMIT) {
        groups[type].push(item);
      }
    }
    return groups;
  }, [data?.results]);

  const orderedGroups = useMemo(() => {
    const order = TYPE_ORDER[portal];
    const known = new Set(order);
    const extras = Object.keys(resultGroups).filter(
      (type) => !known.has(type as SearchEntityType),
    );
    return [...order, ...(extras as SearchEntityType[])];
  }, [portal, resultGroups]);

  const flatResults = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [];
    for (const type of orderedGroups) {
      const groupItems = resultGroups[type] ?? [];
      for (const item of groupItems) {
        items.push({
          route: item.route || "",
          title: item.title,
          subtitle: item.subtitle,
          type,
        });
      }
    }
    return items;
  }, [orderedGroups, resultGroups]);

  const quickLinks = QUICK_LINKS[portal];
  const quickLinkItems = useMemo<NavItem[]>(
    () =>
      quickLinks.map((link) => ({
        route: link.route,
        title: link.label,
      })),
    [quickLinks],
  );

  const navigationItems = canSearch
    ? flatResults
    : normalizedQuery.length === 0
      ? quickLinkItems
      : [];

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [normalizedQuery, open, flatResults.length]);

  const navigateTo = (route: string) => {
    if (!route) return;
    navigate(route);
    setOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        navigationItems.length === 0
          ? -1
          : Math.min(prev + 1, navigationItems.length - 1),
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        navigationItems.length === 0 ? -1 : Math.max(prev - 1, 0),
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (highlightedIndex >= 0 && navigationItems[highlightedIndex]) {
        navigateTo(navigationItems[highlightedIndex].route);
        return;
      }
      if (canSearch) {
        navigate(`/${portal}/search?q=${encodeURIComponent(normalizedQuery)}`);
        setOpen(false);
      }
    }
  };

  const renderEmptyState = () => {
    if (normalizedQuery.length === 1) {
      return (
        <div className="px-3 py-2 text-xs text-muted-foreground">
          Type at least 2 characters to search.
        </div>
      );
    }

    if (canSearch && !isFetching && flatResults.length === 0) {
      return (
        <div className="px-3 py-2 text-xs text-muted-foreground">
          No results found.
        </div>
      );
    }

    if (normalizedQuery.length === 0) {
      return (
        <div className="space-y-2">
          <div className="px-3 pt-2 text-xs font-medium text-muted-foreground">
            Quick links
          </div>
          {quickLinkItems.map((link, index) => (
            <button
              key={link.route}
              type="button"
              className={`w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${
                highlightedIndex === index
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => navigateTo(link.route)}
              role="option"
              aria-selected={highlightedIndex === index}
              id={`search-option-${index}`}
            >
              {link.title}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div ref={containerRef} className="relative hidden md:block w-64 lg:w-96">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={open}
        aria-controls="global-search-listbox"
        aria-activedescendant={
          highlightedIndex >= 0
            ? `search-option-${highlightedIndex}`
            : undefined
        }
        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15"
      />

      {open && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl border border-border bg-card shadow-lg z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border text-xs text-muted-foreground">
            <span>Global search</span>
            {isFetching && (
              <span className="inline-flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading
              </span>
            )}
          </div>

          <ScrollArea className="max-h-[320px]">
            <div className="py-1" role="listbox" id="global-search-listbox">
              {isError && (
                <div className="px-3 py-2 text-xs text-destructive">
                  Search failed. Please try again.
                </div>
              )}

              {canSearch && flatResults.length > 0 && (
                <div className="space-y-2">
                  {orderedGroups.map((type) => {
                    const items = resultGroups[type] ?? [];
                    if (!items.length) return null;

                    const groupStartIndex = flatResults.findIndex(
                      (item) => item.type === type,
                    );

                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between px-3 pt-2 text-xs font-medium text-muted-foreground">
                          <span>{TYPE_LABELS[type] ?? type}</span>
                          <Badge variant="secondary" className="text-[10px]">
                            {items.length}
                          </Badge>
                        </div>
                        <div className="mt-1">
                          {items.map((item, index) => {
                            const flatIndex = groupStartIndex + index;
                            const isActive = flatIndex === highlightedIndex;
                            return (
                              <button
                                key={`${type}-${item.id}-${index}`}
                                type="button"
                                className={`w-full px-3 py-2 text-left transition-colors ${
                                  isActive
                                    ? "bg-muted text-foreground"
                                    : "text-foreground hover:bg-muted/70"
                                }`}
                                onMouseEnter={() =>
                                  setHighlightedIndex(flatIndex)
                                }
                                onClick={() => navigateTo(item.route || "")}
                                role="option"
                                aria-selected={isActive}
                                id={`search-option-${flatIndex}`}
                              >
                                <div className="text-sm font-medium">
                                  {item.title}
                                </div>
                                {item.subtitle && (
                                  <div className="text-xs text-muted-foreground">
                                    {item.subtitle}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!isError && renderEmptyState()}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

export const SearchBar = GlobalSearchBar;
