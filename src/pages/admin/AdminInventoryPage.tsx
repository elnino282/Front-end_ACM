import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminInventoryApi } from "@/services/api.admin";
import { usePreferences } from "@/shared/contexts";
import { useDebounce } from "@/shared/lib";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const WINDOW_OPTIONS = [7, 14, 30, 60, 90];
const SORT_OPTIONS = [
  { value: "EXPIRY_ASC", label: "Expiry (Soonest)" },
  { value: "EXPIRY_DESC", label: "Expiry (Latest)" },
  { value: "ONHAND_DESC", label: "On-hand (High to Low)" },
];
const STATUS_OPTIONS = [
  { value: "RISK", label: "Risk" },
  { value: "EXPIRED", label: "Expired" },
  { value: "EXPIRING", label: "Expiring" },
  { value: "LOW_STOCK", label: "Low Stock" },
  { value: "UNKNOWN_EXPIRY", label: "Unknown Expiry" },
  { value: "ALL", label: "All Lots" },
];

const parseNumber = (value: string | null) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const formatDate = (value: string | null | undefined, locale: string) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString(locale);
  } catch {
    return value;
  }
};

export function AdminInventoryPage() {
  const { preferences } = usePreferences();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");

  const farmId = parseNumber(searchParams.get("farmId"));
  const status = (searchParams.get("status") || "RISK").toUpperCase();
  const windowDays = parseNumber(searchParams.get("windowDays")) ?? 30;
  const sort = (searchParams.get("sort") || "EXPIRY_ASC").toUpperCase();
  const lowStockThreshold =
    parseNumber(searchParams.get("lowStockThreshold")) ?? 5;
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    setPage(0);
  }, [farmId, status, windowDays, sort, lowStockThreshold, debouncedSearch]);

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (debouncedSearch) {
        next.set("q", debouncedSearch);
      } else {
        next.delete("q");
      }
      return next;
    });
  }, [debouncedSearch, setSearchParams]);

  const optionsQuery = useQuery({
    queryKey: ["adminInventory", "options"],
    queryFn: () => adminInventoryApi.getOptions(),
  });

  const lotsQuery = useQuery({
    queryKey: [
      "adminInventory",
      "lots",
      farmId,
      status,
      windowDays,
      sort,
      debouncedSearch,
      lowStockThreshold,
      page,
    ],
    queryFn: () =>
      adminInventoryApi.listRiskLots({
        farmId: farmId ?? undefined,
        status,
        windowDays,
        q: debouncedSearch || undefined,
        sort,
        lowStockThreshold,
        page,
        limit: 20,
      }),
  });

  const detailQuery = useQuery({
    queryKey: ["adminInventory", "lotDetail", selectedLotId],
    queryFn: () => adminInventoryApi.getLotDetail(selectedLotId as number),
    enabled: selectedLotId != null,
  });

  const movementsQuery = useQuery({
    queryKey: ["adminInventory", "lotMovements", selectedLotId],
    queryFn: () => adminInventoryApi.getLotMovements(selectedLotId as number),
    enabled: selectedLotId != null,
  });

  const formatNumber = useMemo(
    () => (value: number) =>
      new Intl.NumberFormat(preferences.locale).format(value),
    [preferences.locale],
  );

  const updateParams = (
    updates: Record<string, string | number | undefined>,
  ) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    });
  };

  const showWindowDays = status === "EXPIRING" || status === "RISK";
  const showLowStockThreshold = status === "LOW_STOCK" || status === "RISK";

  const handleViewDetail = (lotId: number) => {
    setSelectedLotId(lotId);
    setDetailOpen(true);
  };

  const renderStatusBadge = (value: string) => {
    switch (value) {
      case "EXPIRED":
        return <Badge variant="destructive">Expired</Badge>;
      case "EXPIRING":
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-300">
            Expiring
          </Badge>
        );
      case "LOW_STOCK":
        return (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-300"
          >
            Low Stock
          </Badge>
        );
      case "UNKNOWN_EXPIRY":
        return <Badge variant="secondary">Unknown Expiry</Badge>;
      case "HEALTHY":
        return <Badge variant="secondary">Healthy</Badge>;
      default:
        return <Badge variant="outline">{value}</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-[1500px] mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">
          <b>Inventory Risks</b>
        </h1>
        <p className="text-muted-foreground">
          Monitor expiring, expired, and low stock lots.
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={farmId?.toString() ?? "all"}
              onValueChange={(value) =>
                updateParams({ farmId: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger className="h-9 w-[220px]">
                <SelectValue placeholder="All farms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All farms</SelectItem>
                {(optionsQuery.data?.farms ?? []).map((farm) => (
                  <SelectItem key={farm.id} value={String(farm.id)}>
                    {farm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={status}
              onValueChange={(value) => updateParams({ status: value })}
            >
              <SelectTrigger className="h-9 w-[170px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {showWindowDays && (
              <Select
                value={String(windowDays)}
                onValueChange={(value) => updateParams({ windowDays: value })}
              >
                <SelectTrigger className="h-9 w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WINDOW_OPTIONS.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option} days
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {showLowStockThreshold && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  value={lowStockThreshold}
                  onChange={(event) =>
                    updateParams({
                      lowStockThreshold: event.target.value || undefined,
                    })
                  }
                  className="h-9 w-[120px]"
                />
                <span className="text-xs text-muted-foreground">
                  Low stock threshold
                </span>
              </div>
            )}

            <Select
              value={sort}
              onValueChange={(value) => updateParams({ sort: value })}
            >
              <SelectTrigger className="h-9 w-[190px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative w-[260px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search item or lot code"
                className="pl-9 h-9"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>
          </div>

          {lotsQuery.isLoading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}

          {lotsQuery.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Failed to load inventory lots</AlertTitle>
              <AlertDescription className="mt-2 flex items-center justify-between gap-3">
                <span>{lotsQuery.error?.message || "Please try again."}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => lotsQuery.refetch()}
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {!lotsQuery.isLoading && !lotsQuery.isError && (
            <>
              {lotsQuery.data?.items?.length ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item / Lot</TableHead>
                        <TableHead>Farm</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead className="text-right">On hand</TableHead>
                        <TableHead>Days to expiry</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lotsQuery.data.items.map((lot) => (
                        <TableRow key={lot.lotId}>
                          <TableCell>
                            <div className="font-medium">{lot.itemName}</div>
                            <div className="text-xs text-muted-foreground">
                              {lot.lotCode || "No lot code"}
                            </div>
                          </TableCell>
                          <TableCell>{lot.farmName || "-"}</TableCell>
                          <TableCell>
                            {formatDate(lot.expiryDate, preferences.locale)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatNumber(Number(lot.onHand))} {lot.unit || ""}
                          </TableCell>
                          <TableCell>{lot.daysToExpiry ?? "-"}</TableCell>
                          <TableCell>{renderStatusBadge(lot.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetail(lot.lotId)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 0}
                      onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= (lotsQuery.data?.totalPages ?? 1) - 1}
                      onClick={() => setPage((prev) => prev + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </>
              ) : (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No inventory lots match the current filters.
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {detailOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm cursor-pointer"
          onClick={() => setDetailOpen(false)}
        >
          <div
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-card border-l border-border shadow-lg overflow-auto cursor-default"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Lot details</h2>
                  <p className="text-sm text-muted-foreground">
                    {detailQuery.data?.itemName || "Inventory lot"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDetailOpen(false)}
                >
                  X
                </Button>
              </div>

              {detailQuery.isLoading && <Skeleton className="h-32 w-full" />}
              {detailQuery.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Failed to load lot details</AlertTitle>
                  <AlertDescription>
                    {detailQuery.error?.message}
                  </AlertDescription>
                </Alert>
              )}

              {detailQuery.data && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Lot code</p>
                      <p className="text-sm font-medium">
                        {detailQuery.data.lotCode || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Supplier</p>
                      <p className="text-sm font-medium">
                        {detailQuery.data.supplierName || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Expiry</p>
                      <p className="text-sm font-medium">
                        {formatDate(
                          detailQuery.data.expiryDate,
                          preferences.locale,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">On hand</p>
                      <p className="text-sm font-medium">
                        {formatNumber(
                          Number(detailQuery.data.onHandTotal || 0),
                        )}{" "}
                        {detailQuery.data.unit || ""}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">Balances</p>
                    {detailQuery.data.balances.length ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Warehouse</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">
                              Quantity
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {detailQuery.data.balances.map((balance, index) => (
                            <TableRow
                              key={`${balance.warehouseId}-${balance.locationId}-${index}`}
                            >
                              <TableCell>
                                {balance.warehouseName || "-"}
                              </TableCell>
                              <TableCell>
                                {balance.locationLabel || "-"}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {formatNumber(Number(balance.quantity))}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No balances available.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold mb-2">Movements</p>
                {movementsQuery.isLoading && (
                  <Skeleton className="h-28 w-full" />
                )}
                {movementsQuery.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Failed to load movements</AlertTitle>
                  </Alert>
                )}
                {movementsQuery.data &&
                  (movementsQuery.data.length ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead>Reference</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {movementsQuery.data.map((movement) => (
                          <TableRow key={movement.movementId}>
                            <TableCell>
                              {formatDate(
                                movement.movementDate,
                                preferences.locale,
                              )}
                            </TableCell>
                            <TableCell>
                              {movement.movementType || "-"}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatNumber(Number(movement.quantity))}
                            </TableCell>
                            <TableCell>
                              {movement.reference || movement.note || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No movements recorded.
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
