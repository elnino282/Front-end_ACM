import {
  useAdjustProductWarehouseLot,
  useProductWarehouseLots,
  useProductWarehouseOverview,
  useProductWarehouseTraceability,
  useProductWarehouseTransactions,
  useStockOutProductWarehouseLot,
  type ProductWarehouseLot,
} from "@/entities/product-warehouse";
import {
  useCreateWarehouse,
  useDeleteWarehouse,
  useLocations,
  useMyWarehouses,
  useUpdateWarehouse,
  type Warehouse as WarehouseEntity,
} from "@/entities/inventory";
import { useFarms } from "@/entities/farm";
import { usePlotsByFarm } from "@/entities/plot";
import { useSeasons } from "@/entities/season";
import { useI18n } from "@/hooks/useI18n";
import { useDebounce } from "@/shared/lib";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  PageHeader,
} from "@/shared/ui";
import { Boxes, History, MapPin, PackageCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import "./ProductWarehousePage.css";

type ProductWarehouseTab = "on-hand" | "transactions" | "traceability";
type WarehouseDialogMode = "create" | "edit";

const STATUS_OPTIONS = ["IN_STOCK", "HOLD", "DEPLETED", "ARCHIVED"] as const;

export function ProductWarehousePage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<ProductWarehouseTab>("on-hand");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<
    number | undefined
  >();
  const [selectedLocationId, setSelectedLocationId] = useState<
    number | undefined
  >();
  const [selectedFarmId, setSelectedFarmId] = useState<number | undefined>();
  const [selectedPlotId, setSelectedPlotId] = useState<number | undefined>();
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [harvestedFrom, setHarvestedFrom] = useState("");
  const [harvestedTo, setHarvestedTo] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [lotPage, setLotPage] = useState(0);
  const [transactionPage, setTransactionPage] = useState(0);
  const [selectedTraceLotId, setSelectedTraceLotId] = useState<
    number | undefined
  >();
  const [adjustingLot, setAdjustingLot] = useState<ProductWarehouseLot | null>(
    null,
  );
  const [stockingOutLot, setStockingOutLot] =
    useState<ProductWarehouseLot | null>(null);
  const [adjustQuantityInput, setAdjustQuantityInput] = useState("");
  const [adjustNoteInput, setAdjustNoteInput] = useState("");
  const [stockOutQuantityInput, setStockOutQuantityInput] = useState("");
  const [stockOutNoteInput, setStockOutNoteInput] = useState("");
  const [warehouseDialogMode, setWarehouseDialogMode] =
    useState<WarehouseDialogMode | null>(null);
  const [warehouseNameInput, setWarehouseNameInput] = useState("");
  const [warehouseFarmIdInput, setWarehouseFarmIdInput] = useState<
    number | undefined
  >(undefined);
  const [warehouseFormError, setWarehouseFormError] = useState("");
  const [showDeleteWarehouseDialog, setShowDeleteWarehouseDialog] =
    useState(false);

  const debouncedSearch = useDebounce(searchInput, 300);

  const { data: warehouses, isLoading: loadingWarehouses } =
    useMyWarehouses("OUTPUT");
  const { data: farmsData } = useFarms({ active: true, page: 0, size: 200 });
  const outputWarehouses = useMemo(
    () => warehouses ?? [],
    [warehouses],
  );
  const selectedWarehouse = useMemo(
    () =>
      outputWarehouses.find((warehouse) => warehouse.id === selectedWarehouseId) ??
      null,
    [outputWarehouses, selectedWarehouseId],
  );
  const { data: locations } = useLocations(selectedWarehouseId);
  const { data: overviewData } = useProductWarehouseOverview();
  const { data: plotsData } = usePlotsByFarm(
    selectedFarmId ?? 0,
    { page: 0, size: 100 },
    { enabled: !!selectedFarmId },
  );
  const { data: seasonsData } = useSeasons({
    farmId: selectedFarmId,
    plotId: selectedPlotId,
    page: 0,
    size: 100,
  });

  const {
    data: lotsData,
    isLoading: loadingLots,
    isError: lotsError,
  } = useProductWarehouseLots({
    warehouseId: selectedWarehouseId,
    locationId: selectedLocationId,
    seasonId: selectedSeasonId,
    farmId: selectedFarmId,
    plotId: selectedPlotId,
    harvestedFrom: harvestedFrom || undefined,
    harvestedTo: harvestedTo || undefined,
    status: statusFilter || undefined,
    q: debouncedSearch || undefined,
    page: lotPage,
    size: 20,
  });

  const {
    data: transactionsData,
    isLoading: loadingTransactions,
    isError: transactionsError,
  } = useProductWarehouseTransactions({
    from: harvestedFrom || undefined,
    to: harvestedTo || undefined,
    page: transactionPage,
    size: 20,
  });

  const {
    data: traceabilityData,
    isLoading: loadingTraceability,
    isError: traceabilityError,
  } = useProductWarehouseTraceability(selectedTraceLotId);

  const adjustMutation = useAdjustProductWarehouseLot();
  const stockOutMutation = useStockOutProductWarehouseLot();
  const createWarehouseMutation = useCreateWarehouse();
  const updateWarehouseMutation = useUpdateWarehouse();
  const deleteWarehouseMutation = useDeleteWarehouse();

  const farmOptions = useMemo(() => farmsData?.content ?? [], [farmsData?.content]);

  const handleFilterChange = () => {
    setLotPage(0);
    setTransactionPage(0);
  };

  const handleOpenTraceability = (lotId: number) => {
    setSelectedTraceLotId(lotId);
    setActiveTab("traceability");
  };

  const openCreateWarehouseDialog = () => {
    setWarehouseDialogMode("create");
    setWarehouseNameInput("");
    setWarehouseFarmIdInput(selectedWarehouse?.farmId ?? farmOptions[0]?.id);
    setWarehouseFormError("");
  };

  const openEditWarehouseDialog = () => {
    if (!selectedWarehouse) return;
    setWarehouseDialogMode("edit");
    setWarehouseNameInput(selectedWarehouse.name ?? "");
    setWarehouseFarmIdInput(selectedWarehouse.farmId ?? undefined);
    setWarehouseFormError("");
  };

  const closeWarehouseDialog = () => {
    if (createWarehouseMutation.isPending || updateWarehouseMutation.isPending) {
      return;
    }
    setWarehouseDialogMode(null);
    setWarehouseNameInput("");
    setWarehouseFarmIdInput(undefined);
    setWarehouseFormError("");
  };

  const submitWarehouseDialog = async () => {
    const trimmedName = warehouseNameInput.trim();
    if (!trimmedName) {
      setWarehouseFormError("Tên kho là bắt buộc.");
      return;
    }

    const farmId =
      warehouseDialogMode === "create"
        ? warehouseFarmIdInput
        : selectedWarehouse?.farmId;
    if (!farmId) {
      setWarehouseFormError("Vui lòng chọn nông trại.");
      return;
    }

    setWarehouseFormError("");
    try {
      if (warehouseDialogMode === "create") {
        await createWarehouseMutation.mutateAsync({
          name: trimmedName,
          farmId,
          type: "OUTPUT",
        });
        toast.success("Đã tạo kho sản phẩm.");
      } else if (warehouseDialogMode === "edit" && selectedWarehouse) {
        await updateWarehouseMutation.mutateAsync({
          id: selectedWarehouse.id,
          data: {
            name: trimmedName,
            farmId,
          },
        });
        toast.success("Đã cập nhật kho sản phẩm.");
      }
      closeWarehouseDialog();
    } catch (error) {
      setWarehouseFormError(
        error instanceof Error
          ? error.message
          : "Không thể lưu thông tin kho. Vui lòng thử lại.",
      );
    }
  };

  const confirmDeleteWarehouse = async () => {
    if (!selectedWarehouseId) return;
    try {
      await deleteWarehouseMutation.mutateAsync(selectedWarehouseId);
      toast.success("Đã xóa kho sản phẩm.");
      setShowDeleteWarehouseDialog(false);
      setSelectedWarehouseId(undefined);
      setSelectedLocationId(undefined);
      setSelectedTraceLotId(undefined);
      setLotPage(0);
      setTransactionPage(0);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể xóa kho. Vui lòng kiểm tra ràng buộc dữ liệu.",
      );
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  };

  const formatDateTime = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  const formatNumber = (value?: number | null) => {
    if (value === null || value === undefined) return "-";
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }).format(
      value,
    );
  };

  const submitAdjust = async () => {
    if (!adjustingLot) return;
    const quantityDelta = Number(adjustQuantityInput);
    if (!Number.isFinite(quantityDelta) || quantityDelta === 0) {
      toast.error(t("productWarehouse.validation.adjustNotZero"));
      return;
    }
    if (!adjustNoteInput.trim()) {
      toast.error(t("productWarehouse.validation.adjustNoteRequired"));
      return;
    }

    try {
      await adjustMutation.mutateAsync({
        lotId: adjustingLot.id,
        data: {
          quantityDelta,
          note: adjustNoteInput.trim(),
        },
      });
      toast.success(t("productWarehouse.toast.adjustSuccess"));
      setAdjustingLot(null);
      setAdjustQuantityInput("");
      setAdjustNoteInput("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("productWarehouse.toast.error"),
      );
    }
  };

  const submitStockOut = async () => {
    if (!stockingOutLot) return;
    const quantity = Number(stockOutQuantityInput);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      toast.error(t("productWarehouse.validation.stockOutPositive"));
      return;
    }

    try {
      await stockOutMutation.mutateAsync({
        lotId: stockingOutLot.id,
        data: {
          quantity,
          note: stockOutNoteInput.trim() || undefined,
        },
      });
      toast.success(t("productWarehouse.toast.stockOutSuccess"));
      setStockingOutLot(null);
      setStockOutQuantityInput("");
      setStockOutNoteInput("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("productWarehouse.toast.error"),
      );
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="product-warehouse-page">
        <Card className="mb-6 border border-border rounded-xl shadow-sm">
          <CardContent className="px-6 py-4">
            <PageHeader
              className="mb-0"
              icon={<PackageCheck className="w-8 h-8" />}
              title={t("productWarehouse.title")}
              subtitle={t("productWarehouse.subtitle")}
            />
          </CardContent>
        </Card>

        <div className="product-warehouse-summary-grid">
          <Card>
            <CardContent className="summary-card">
              <Boxes className="summary-icon" />
              <div>
                <p className="summary-label">
                  {t("productWarehouse.summary.totalLots")}
                </p>
                <p className="summary-value">{overviewData?.totalLots ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="summary-card">
              <PackageCheck className="summary-icon" />
              <div>
                <p className="summary-label">
                  {t("productWarehouse.summary.inStockLots")}
                </p>
                <p className="summary-value">{overviewData?.inStockLots ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="summary-card">
              <History className="summary-icon" />
              <div>
                <p className="summary-label">
                  {t("productWarehouse.summary.totalOnHand")}
                </p>
                <p className="summary-value">
                  {formatNumber(overviewData?.totalOnHandQuantity)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 border border-border rounded-xl shadow-sm">
          <CardContent className="px-6 py-4">
            <div className="product-warehouse-filters">
              <div className="control-group">
                <label htmlFor="pw-warehouse-filter">
                  {t("productWarehouse.filters.warehouse")}
                </label>
                <select
                  id="pw-warehouse-filter"
                  value={selectedWarehouseId ?? ""}
                  disabled={loadingWarehouses}
                  onChange={(event) => {
                    setSelectedWarehouseId(
                      event.target.value ? Number(event.target.value) : undefined,
                    );
                    setSelectedLocationId(undefined);
                    handleFilterChange();
                  }}
                >
                  <option value="">
                    {t("productWarehouse.filters.allWarehouses")}
                  </option>
                  {outputWarehouses.map((warehouse: WarehouseEntity) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="product-warehouse-toolbar">
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={openCreateWarehouseDialog}
                >
                  Thêm kho sản phẩm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={openEditWarehouseDialog}
                  disabled={!selectedWarehouse}
                >
                  Sửa kho
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  type="button"
                  onClick={() => setShowDeleteWarehouseDialog(true)}
                  disabled={!selectedWarehouse}
                >
                  Xóa kho
                </Button>
              </div>

              <div className="control-group">
                <label htmlFor="pw-location-filter">
                  {t("productWarehouse.filters.location")}
                </label>
                <select
                  id="pw-location-filter"
                  value={selectedLocationId ?? ""}
                  onChange={(event) => {
                    setSelectedLocationId(
                      event.target.value ? Number(event.target.value) : undefined,
                    );
                    handleFilterChange();
                  }}
                >
                  <option value="">
                    {t("productWarehouse.filters.allLocations")}
                  </option>
                  {(locations ?? []).map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.label || `Location ${location.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label htmlFor="pw-farm-filter">
                  {t("productWarehouse.filters.farm")}
                </label>
                <select
                  id="pw-farm-filter"
                  value={selectedFarmId ?? ""}
                  onChange={(event) => {
                    setSelectedFarmId(
                      event.target.value ? Number(event.target.value) : undefined,
                    );
                    setSelectedPlotId(undefined);
                    handleFilterChange();
                  }}
                >
                  <option value="">{t("productWarehouse.filters.allFarms")}</option>
                  {farmOptions.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label htmlFor="pw-plot-filter">
                  {t("productWarehouse.filters.plot")}
                </label>
                <select
                  id="pw-plot-filter"
                  value={selectedPlotId ?? ""}
                  onChange={(event) => {
                    setSelectedPlotId(
                      event.target.value ? Number(event.target.value) : undefined,
                    );
                    handleFilterChange();
                  }}
                >
                  <option value="">{t("productWarehouse.filters.allPlots")}</option>
                  {(plotsData?.items ?? []).map((plot) => (
                    <option key={plot.id} value={plot.id}>
                      {plot.plotName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label htmlFor="pw-season-filter">
                  {t("productWarehouse.filters.season")}
                </label>
                <select
                  id="pw-season-filter"
                  value={selectedSeasonId ?? ""}
                  onChange={(event) => {
                    setSelectedSeasonId(
                      event.target.value ? Number(event.target.value) : undefined,
                    );
                    handleFilterChange();
                  }}
                >
                  <option value="">
                    {t("productWarehouse.filters.allSeasons")}
                  </option>
                  {(seasonsData?.items ?? []).map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.seasonName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label htmlFor="pw-status-filter">
                  {t("productWarehouse.filters.status")}
                </label>
                <select
                  id="pw-status-filter"
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    handleFilterChange();
                  }}
                >
                  <option value="">
                    {t("productWarehouse.filters.allStatuses")}
                  </option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label htmlFor="pw-from">
                  {t("productWarehouse.filters.harvestDateFrom")}
                </label>
                <input
                  id="pw-from"
                  type="date"
                  value={harvestedFrom}
                  onChange={(event) => {
                    setHarvestedFrom(event.target.value);
                    handleFilterChange();
                  }}
                />
              </div>

              <div className="control-group">
                <label htmlFor="pw-to">
                  {t("productWarehouse.filters.harvestDateTo")}
                </label>
                <input
                  id="pw-to"
                  type="date"
                  value={harvestedTo}
                  onChange={(event) => {
                    setHarvestedTo(event.target.value);
                    handleFilterChange();
                  }}
                />
              </div>

              <div className="control-group control-group--search">
                <label htmlFor="pw-search">
                  {t("productWarehouse.filters.search")}
                </label>
                <input
                  id="pw-search"
                  type="text"
                  value={searchInput}
                  placeholder={t("productWarehouse.filters.searchPlaceholder")}
                  onChange={(event) => {
                    setSearchInput(event.target.value);
                    handleFilterChange();
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="product-warehouse-tabs">
          <button
            className={`tab ${activeTab === "on-hand" ? "active" : ""}`}
            onClick={() => setActiveTab("on-hand")}
          >
            {t("productWarehouse.tabs.onHand")}
          </button>
          <button
            className={`tab ${activeTab === "transactions" ? "active" : ""}`}
            onClick={() => setActiveTab("transactions")}
          >
            {t("productWarehouse.tabs.transactions")}
          </button>
          <button
            className={`tab ${activeTab === "traceability" ? "active" : ""}`}
            onClick={() => setActiveTab("traceability")}
          >
            {t("productWarehouse.tabs.traceability")}
          </button>
        </div>

        <div className="product-warehouse-content">
          {activeTab === "on-hand" && (
            <>
              {loadingLots && (
                <div className="loading-state">
                  {t("productWarehouse.loadingLots")}
                </div>
              )}
              {!loadingLots && lotsError && (
                <div className="error-state">
                  {t("productWarehouse.errorLots")}
                </div>
              )}
              {!loadingLots && !lotsError && (lotsData?.items?.length ?? 0) === 0 && (
                <div className="empty-state">{t("productWarehouse.emptyLots")}</div>
              )}
              {!loadingLots && !lotsError && (lotsData?.items?.length ?? 0) > 0 && (
                <div className="table-container">
                  <table className="product-warehouse-table">
                    <thead>
                      <tr>
                        <th>{t("productWarehouse.table.lotCode")}</th>
                        <th>{t("productWarehouse.table.productName")}</th>
                        <th>{t("productWarehouse.table.variant")}</th>
                        <th>{t("productWarehouse.table.unit")}</th>
                        <th>{t("productWarehouse.table.harvestedAt")}</th>
                        <th>{t("productWarehouse.table.receivedAt")}</th>
                        <th>{t("productWarehouse.table.farmPlot")}</th>
                        <th>{t("productWarehouse.table.season")}</th>
                        <th>{t("productWarehouse.table.location")}</th>
                        <th>{t("productWarehouse.table.quality")}</th>
                        <th>{t("productWarehouse.table.onHand")}</th>
                        <th>{t("productWarehouse.table.status")}</th>
                        <th>{t("productWarehouse.table.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(lotsData?.items ?? []).map((lot) => (
                        <tr key={lot.id}>
                          <td>{lot.lotCode}</td>
                          <td>{lot.productName}</td>
                          <td>{lot.productVariant || "-"}</td>
                          <td>{lot.unit || "-"}</td>
                          <td>{formatDate(lot.harvestedAt)}</td>
                          <td>{formatDateTime(lot.receivedAt)}</td>
                          <td>{`${lot.farmName || "-"} / ${lot.plotName || "-"}`}</td>
                          <td>{lot.seasonName || "-"}</td>
                          <td>{lot.locationLabel || "-"}</td>
                          <td>{lot.grade || lot.qualityStatus || "-"}</td>
                          <td>
                            {formatNumber(lot.onHandQuantity)} {lot.unit}
                          </td>
                          <td>
                            <Badge variant={lot.status === "IN_STOCK" ? "default" : "outline"}>
                              {lot.status || "-"}
                            </Badge>
                          </td>
                          <td className="actions">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenTraceability(lot.id)}
                            >
                              {t("productWarehouse.actions.viewTraceability")}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setAdjustingLot(lot);
                                setAdjustQuantityInput("");
                                setAdjustNoteInput("");
                              }}
                            >
                              {t("productWarehouse.actions.adjust")}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setStockingOutLot(lot);
                                setStockOutQuantityInput("");
                                setStockOutNoteInput("");
                              }}
                            >
                              {t("productWarehouse.actions.stockOut")}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {lotsData && lotsData.totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={lotPage === 0}
                    onClick={() => setLotPage((page) => page - 1)}
                  >
                    {t("common.previous")}
                  </button>
                  <span>
                    {t("pagination.page")} {lotPage + 1} / {lotsData.totalPages}
                  </span>
                  <button
                    disabled={lotPage >= lotsData.totalPages - 1}
                    onClick={() => setLotPage((page) => page + 1)}
                  >
                    {t("common.next")}
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "transactions" && (
            <>
              {loadingTransactions && (
                <div className="loading-state">
                  {t("productWarehouse.loadingTransactions")}
                </div>
              )}
              {!loadingTransactions && transactionsError && (
                <div className="error-state">
                  {t("productWarehouse.errorTransactions")}
                </div>
              )}
              {!loadingTransactions &&
                !transactionsError &&
                (transactionsData?.items?.length ?? 0) === 0 && (
                  <div className="empty-state">
                    {t("productWarehouse.emptyTransactions")}
                  </div>
                )}
              {!loadingTransactions &&
                !transactionsError &&
                (transactionsData?.items?.length ?? 0) > 0 && (
                  <div className="table-container">
                    <table className="product-warehouse-table">
                      <thead>
                        <tr>
                          <th>{t("productWarehouse.transactionsTable.createdAt")}</th>
                          <th>{t("productWarehouse.transactionsTable.type")}</th>
                          <th>{t("productWarehouse.transactionsTable.lotCode")}</th>
                          <th>{t("productWarehouse.transactionsTable.quantity")}</th>
                          <th>
                            {t("productWarehouse.transactionsTable.resultingOnHand")}
                          </th>
                          <th>{t("productWarehouse.transactionsTable.reference")}</th>
                          <th>{t("productWarehouse.transactionsTable.createdBy")}</th>
                          <th>{t("productWarehouse.transactionsTable.note")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(transactionsData?.items ?? []).map((tx) => (
                          <tr key={tx.id}>
                            <td>{formatDateTime(tx.createdAt)}</td>
                            <td>{tx.transactionType || "-"}</td>
                            <td>{tx.lotCode || "-"}</td>
                            <td>
                              {formatNumber(tx.quantity)} {tx.unit || ""}
                            </td>
                            <td>
                              {formatNumber(tx.resultingOnHand)} {tx.unit || ""}
                            </td>
                            <td>
                              {tx.referenceType
                                ? `${tx.referenceType} #${tx.referenceId || "-"}`
                                : "-"}
                            </td>
                            <td>{tx.createdByName || "-"}</td>
                            <td>{tx.note || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              {transactionsData && transactionsData.totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={transactionPage === 0}
                    onClick={() => setTransactionPage((page) => page - 1)}
                  >
                    {t("common.previous")}
                  </button>
                  <span>
                    {t("pagination.page")} {transactionPage + 1} /{" "}
                    {transactionsData.totalPages}
                  </span>
                  <button
                    disabled={transactionPage >= transactionsData.totalPages - 1}
                    onClick={() => setTransactionPage((page) => page + 1)}
                  >
                    {t("common.next")}
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "traceability" && (
            <>
              {!selectedTraceLotId && (
                <div className="empty-state">
                  {t("productWarehouse.emptyTraceability")}
                </div>
              )}
              {selectedTraceLotId && loadingTraceability && (
                <div className="loading-state">
                  {t("productWarehouse.loadingTraceability")}
                </div>
              )}
              {selectedTraceLotId && !loadingTraceability && traceabilityError && (
                <div className="error-state">
                  {t("productWarehouse.errorTraceability")}
                </div>
              )}
              {selectedTraceLotId && traceabilityData && (
                <div className="traceability-panel">
                  <div className="traceability-header">
                    <h3>
                      {traceabilityData.productName} - {traceabilityData.lotCode}
                    </h3>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="traceability-grid">
                    <p>
                      <strong>{t("productWarehouse.traceability.season")}:</strong>{" "}
                      {traceabilityData.seasonName || "-"}
                    </p>
                    <p>
                      <strong>{t("productWarehouse.traceability.farmPlot")}:</strong>{" "}
                      {`${traceabilityData.farmName || "-"} / ${traceabilityData.plotName || "-"}`}
                    </p>
                    <p>
                      <strong>{t("productWarehouse.traceability.harvestedAt")}:</strong>{" "}
                      {formatDate(traceabilityData.harvestedAt)}
                    </p>
                    <p>
                      <strong>{t("productWarehouse.traceability.recordedBy")}:</strong>{" "}
                      {traceabilityData.recordedByName || "-"}
                    </p>
                    <p>
                      <strong>
                        {t("productWarehouse.traceability.initialQuantity")}:
                      </strong>{" "}
                      {formatNumber(traceabilityData.initialQuantity)}{" "}
                      {traceabilityData.unit}
                    </p>
                    <p>
                      <strong>
                        {t("productWarehouse.traceability.onHandQuantity")}:
                      </strong>{" "}
                      {formatNumber(traceabilityData.onHandQuantity)}{" "}
                      {traceabilityData.unit}
                    </p>
                    <p>
                      <strong>{t("productWarehouse.traceability.harvestRef")}:</strong>{" "}
                      {traceabilityData.harvestId || "-"}
                    </p>
                  </div>

                  <h4 className="traceability-subtitle">
                    {t("productWarehouse.traceability.transactions")}
                  </h4>
                  {traceabilityData.transactions.length === 0 ? (
                    <div className="empty-state small">
                      {t("productWarehouse.emptyTransactions")}
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="product-warehouse-table">
                        <thead>
                          <tr>
                            <th>{t("productWarehouse.transactionsTable.createdAt")}</th>
                            <th>{t("productWarehouse.transactionsTable.type")}</th>
                            <th>{t("productWarehouse.transactionsTable.quantity")}</th>
                            <th>
                              {t("productWarehouse.transactionsTable.resultingOnHand")}
                            </th>
                            <th>{t("productWarehouse.transactionsTable.note")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {traceabilityData.transactions.map((tx) => (
                            <tr key={tx.id}>
                              <td>{formatDateTime(tx.createdAt)}</td>
                              <td>{tx.transactionType || "-"}</td>
                              <td>
                                {formatNumber(tx.quantity)} {tx.unit || ""}
                              </td>
                              <td>
                                {formatNumber(tx.resultingOnHand)} {tx.unit || ""}
                              </td>
                              <td>{tx.note || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog
        open={warehouseDialogMode !== null}
        onOpenChange={(open) => !open && closeWarehouseDialog()}
      >
        <DialogContent className="w-[92vw] max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {warehouseDialogMode === "create"
                ? "Thêm kho sản phẩm"
                : "Sửa kho sản phẩm"}
            </DialogTitle>
          </DialogHeader>
          <div className="dialog-content-grid">
            <p className="dialog-hint">
              Kho sản phẩm dùng để lưu nông sản/thành phẩm sau thu hoạch.
            </p>
            {warehouseFormError && (
              <div className="warehouse-form-error">{warehouseFormError}</div>
            )}

            <label htmlFor="warehouse-name">Tên kho</label>
            <input
              id="warehouse-name"
              type="text"
              value={warehouseNameInput}
              maxLength={150}
              onChange={(event) => setWarehouseNameInput(event.target.value)}
              placeholder="Nhập tên kho sản phẩm"
            />

            <label htmlFor="warehouse-farm">Nông trại</label>
            <select
              id="warehouse-farm"
              value={warehouseFarmIdInput ?? ""}
              onChange={(event) =>
                setWarehouseFarmIdInput(
                  event.target.value ? Number(event.target.value) : undefined,
                )
              }
              disabled={warehouseDialogMode === "edit"}
            >
              <option value="">Chọn nông trại</option>
              {farmOptions.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={closeWarehouseDialog}
              disabled={
                createWarehouseMutation.isPending || updateWarehouseMutation.isPending
              }
            >
              Hủy
            </Button>
            <Button
              onClick={submitWarehouseDialog}
              disabled={
                createWarehouseMutation.isPending || updateWarehouseMutation.isPending
              }
            >
              {createWarehouseMutation.isPending || updateWarehouseMutation.isPending
                ? "Đang xử lý..."
                : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDeleteWarehouseDialog && !!selectedWarehouse}
        onOpenChange={(open) => !open && setShowDeleteWarehouseDialog(false)}
      >
        <DialogContent className="w-[92vw] max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Xóa kho sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="dialog-content-grid">
            <p className="dialog-hint">
              Bạn có chắc chắn muốn xóa kho{" "}
              <strong>{selectedWarehouse?.name}</strong>?
            </p>
            <p className="dialog-hint">
              Kho chỉ được xóa khi chưa có vị trí, giao dịch hoặc lô sản phẩm
              liên quan.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteWarehouseDialog(false)}
              disabled={deleteWarehouseMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteWarehouse}
              disabled={deleteWarehouseMutation.isPending}
            >
              {deleteWarehouseMutation.isPending ? "Đang xử lý..." : "Xóa kho"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!adjustingLot} onOpenChange={(open) => !open && setAdjustingLot(null)}>
        <DialogContent className="w-[92vw] max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{t("productWarehouse.dialog.adjustTitle")}</DialogTitle>
          </DialogHeader>
          <div className="dialog-content-grid">
            <p className="dialog-hint">
              {adjustingLot?.lotCode} - {adjustingLot?.productName}
            </p>
            <label htmlFor="adjust-qty">
              {t("productWarehouse.dialog.adjustQuantity")}
            </label>
            <input
              id="adjust-qty"
              type="number"
              value={adjustQuantityInput}
              onChange={(event) => setAdjustQuantityInput(event.target.value)}
              placeholder={t("productWarehouse.dialog.adjustQuantityPlaceholder")}
            />
            <label htmlFor="adjust-note">
              {t("productWarehouse.dialog.adjustNote")}
            </label>
            <textarea
              id="adjust-note"
              value={adjustNoteInput}
              onChange={(event) => setAdjustNoteInput(event.target.value)}
              placeholder={t("productWarehouse.dialog.adjustNotePlaceholder")}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAdjustingLot(null)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={submitAdjust} disabled={adjustMutation.isPending}>
              {adjustMutation.isPending
                ? t("common.processing")
                : t("productWarehouse.dialog.adjustConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!stockingOutLot} onOpenChange={(open) => !open && setStockingOutLot(null)}>
        <DialogContent className="w-[92vw] max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{t("productWarehouse.dialog.stockOutTitle")}</DialogTitle>
          </DialogHeader>
          <div className="dialog-content-grid">
            <p className="dialog-hint">
              {stockingOutLot?.lotCode} - {stockingOutLot?.productName}
            </p>
            <label htmlFor="stockout-qty">
              {t("productWarehouse.dialog.stockOutQuantity")}
            </label>
            <input
              id="stockout-qty"
              type="number"
              min={0}
              value={stockOutQuantityInput}
              onChange={(event) => setStockOutQuantityInput(event.target.value)}
              placeholder={t("productWarehouse.dialog.stockOutQuantityPlaceholder")}
            />
            <label htmlFor="stockout-note">
              {t("productWarehouse.dialog.stockOutNote")}
            </label>
            <textarea
              id="stockout-note"
              value={stockOutNoteInput}
              onChange={(event) => setStockOutNoteInput(event.target.value)}
              placeholder={t("productWarehouse.dialog.stockOutNotePlaceholder")}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setStockingOutLot(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={submitStockOut}
              disabled={stockOutMutation.isPending}
            >
              {stockOutMutation.isPending
                ? t("common.processing")
                : t("productWarehouse.dialog.stockOutConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductWarehousePage;
