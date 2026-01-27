import {
  useLocations,
  useMovements,
  useMyWarehouses,
  useOnHandList,
  useRecordStockMovement,
  type MovementsParams,
  type OnHandParams,
  type OnHandRow,
  type StockMovement,
  type Warehouse as WarehouseEntity,
} from "@/entities/inventory";
import type { WeightUnit } from "@/entities/preferences";
import { useI18n } from "@/hooks/useI18n";
import { usePreferences } from "@/shared/contexts";
import {
  convertWeight,
  convertWeightToKg,
  getWeightUnitLabel,
  normalizeWeightUnit,
} from "@/shared/lib";
import { Card, CardContent, PageHeader } from "@/shared/ui";
import { Warehouse as WarehouseIcon } from "lucide-react";
import { useState } from "react";
import "./InventoryPage.css";

// ═══════════════════════════════════════════════════════════════
// INVENTORY PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

type TabType = "on-hand" | "movements";

const formatNumber = (
  value: number,
  locale: string,
  maximumFractionDigits?: number,
) => new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);

const getDisplayQuantity = (
  quantity: number,
  unit: string | null | undefined,
  displayUnit: WeightUnit,
  locale: string,
) => {
  const normalizedUnit = normalizeWeightUnit(unit);
  if (!normalizedUnit) {
    return {
      formatted: formatNumber(quantity, locale),
      displayValue: quantity,
      unitLabel: unit ?? "",
      normalizedUnit: null,
    };
  }

  const valueKg = convertWeightToKg(quantity, normalizedUnit);
  const displayValue = convertWeight(valueKg, displayUnit);
  const formatted = formatNumber(
    displayValue,
    locale,
    displayUnit === "G" ? 0 : 2,
  );

  return {
    formatted,
    displayValue,
    unitLabel: getWeightUnitLabel(displayUnit),
    normalizedUnit,
  };
};

const toRowUnitQuantity = (
  quantity: number,
  rowUnit: WeightUnit,
  displayUnit: WeightUnit,
) => convertWeight(convertWeightToKg(quantity, displayUnit), rowUnit);

export function InventoryPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<TabType>("on-hand");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<
    number | undefined
  >(undefined);
  const [selectedLocationId, setSelectedLocationId] = useState<
    number | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [movementTypeFilter, setMovementTypeFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(0);

  // Stock Out Modal State
  const [showStockOutModal, setShowStockOutModal] = useState(false);
  const [stockOutRow, setStockOutRow] = useState<OnHandRow | null>(null);

  // Adjust Modal State
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustRow, setAdjustRow] = useState<OnHandRow | null>(null);

  const { preferences } = usePreferences();

  // ===== QUERIES =====
  const { data: warehouses, isLoading: loadingWarehouses } = useMyWarehouses();
  const { data: locations } = useLocations(selectedWarehouseId);

  const onHandParams: OnHandParams | undefined = selectedWarehouseId
    ? {
        warehouseId: selectedWarehouseId,
        locationId: selectedLocationId,
        q: searchQuery || undefined,
        page,
        size: 20,
      }
    : undefined;

  const movementsParams: MovementsParams | undefined = selectedWarehouseId
    ? {
        warehouseId: selectedWarehouseId,
        type: movementTypeFilter || undefined,
        from: dateFrom || undefined,
        to: dateTo || undefined,
        page,
        size: 20,
      }
    : undefined;

  const { data: onHandData, isLoading: loadingOnHand } =
    useOnHandList(onHandParams);
  const { data: movementsData, isLoading: loadingMovements } =
    useMovements(movementsParams);
  const recordMovementMutation = useRecordStockMovement();

  // Auto-select first warehouse when warehouses load
  if (warehouses && warehouses.length > 0 && !selectedWarehouseId) {
    setSelectedWarehouseId(warehouses[0].id);
  }

  // ===== HANDLERS =====
  const handleWarehouseChange = (warehouseId: number) => {
    setSelectedWarehouseId(warehouseId);
    setSelectedLocationId(undefined);
    setPage(0);
  };

  const handleStockOut = (row: OnHandRow) => {
    setStockOutRow(row);
    setShowStockOutModal(true);
  };

  const handleAdjust = (row: OnHandRow) => {
    setAdjustRow(row);
    setShowAdjustModal(true);
  };

  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(preferences.locale);
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleString(preferences.locale);
    } catch {
      return dateStr;
    }
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="inventory-page">
        <Card className="mb-6 border border-border rounded-xl shadow-sm">
          <CardContent className="px-6 py-4">
            <PageHeader
              className="mb-0"
              icon={<WarehouseIcon className="w-8 h-8" />}
              title={t("inventory.title")}
              subtitle={t("inventory.subtitle")}
            />
          </CardContent>
        </Card>

        {/* ===== CONTROLS ===== */}
        <Card className="mb-6 border border-border rounded-xl shadow-sm">
          <CardContent className="px-6 py-4">
            <div className="inventory-controls flex flex-wrap items-center justify-start gap-4">
              <div className="control-group">
                <label htmlFor="warehouse-select">
                  {t("inventory.warehouse")}
                </label>
                <select
                  id="warehouse-select"
                  value={selectedWarehouseId || ""}
                  onChange={(e) =>
                    handleWarehouseChange(Number(e.target.value))
                  }
                  disabled={loadingWarehouses}
                >
                  {loadingWarehouses && (
                    <option>{t("inventory.loading")}</option>
                  )}
                  {!loadingWarehouses &&
                    (!warehouses || warehouses.length === 0) && (
                      <option value="">{t("inventory.noWarehouses")}</option>
                    )}
                  {warehouses?.map((w: WarehouseEntity) => (
                    <option key={w.id} value={w.id}>
                      {w.name} {w.farmName ? `(${w.farmName})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label htmlFor="location-select">
                  {t("inventory.location")}
                </label>
                <select
                  id="location-select"
                  value={selectedLocationId || ""}
                  onChange={(e) =>
                    setSelectedLocationId(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                >
                  <option value="">{t("inventory.allLocations")}</option>
                  {locations?.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.label || `Location ${loc.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {activeTab === "on-hand" && (
                <div className="control-group control-group--search">
                  <label htmlFor="search-input">{t("common.search")}</label>
                  <input
                    id="search-input"
                    type="text"
                    placeholder={t("inventory.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}

              {activeTab === "movements" && (
                <>
                  <div className="control-group">
                    <label htmlFor="type-filter">
                      {t("inventory.movementType")}
                    </label>
                    <select
                      id="type-filter"
                      value={movementTypeFilter}
                      onChange={(e) => setMovementTypeFilter(e.target.value)}
                    >
                      <option value="">{t("inventory.allTypes")}</option>
                      <option value="IN">{t("inventory.types.in")}</option>
                      <option value="OUT">{t("inventory.types.out")}</option>
                      <option value="ADJUST">
                        {t("inventory.types.adjust")}
                      </option>
                    </select>
                  </div>
                  <div className="control-group">
                    <label htmlFor="date-from">{t("common.from")}</label>
                    <input
                      id="date-from"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div className="control-group">
                    <label htmlFor="date-to">{t("common.to")}</label>
                    <input
                      id="date-to"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ===== TABS ===== */}
        <div className="inventory-tabs">
          <button
            className={`tab ${activeTab === "on-hand" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("on-hand");
              setPage(0);
            }}
          >
            {t("inventory.tabs.onHand")}
          </button>
          <button
            className={`tab ${activeTab === "movements" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("movements");
              setPage(0);
            }}
          >
            {t("inventory.tabs.movements")}
          </button>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="inventory-content">
          {!selectedWarehouseId && (
            <div className="empty-state">
              <p>{t("inventory.selectWarehouse")}</p>
            </div>
          )}

          {selectedWarehouseId && activeTab === "on-hand" && (
            <OnHandTable
              data={onHandData?.items || []}
              loading={loadingOnHand}
              onStockOut={handleStockOut}
              onAdjust={handleAdjust}
              formatDate={formatDate}
            />
          )}

          {selectedWarehouseId && activeTab === "movements" && (
            <MovementsTable
              data={movementsData?.items || []}
              loading={loadingMovements}
              formatDateTime={formatDateTime}
            />
          )}

          {/* Pagination */}
          {selectedWarehouseId && (
            <div className="pagination">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                {t("common.previous")}
              </button>
              <span>
                {t("pagination.page")} {page + 1}
              </span>
              <button
                disabled={
                  activeTab === "on-hand"
                    ? !onHandData || page >= onHandData.totalPages - 1
                    : !movementsData || page >= movementsData.totalPages - 1
                }
                onClick={() => setPage((p) => p + 1)}
              >
                {t("common.next")}
              </button>
            </div>
          )}
        </div>

        {/* ===== MODALS ===== */}
        {showStockOutModal && stockOutRow && (
          <StockOutModal
            row={stockOutRow}
            onClose={() => {
              setShowStockOutModal(false);
              setStockOutRow(null);
            }}
            onSubmit={async (data) => {
              await recordMovementMutation.mutateAsync(data);
              setShowStockOutModal(false);
              setStockOutRow(null);
            }}
            isPending={recordMovementMutation.isPending}
          />
        )}

        {showAdjustModal && adjustRow && (
          <AdjustModal
            row={adjustRow}
            onClose={() => {
              setShowAdjustModal(false);
              setAdjustRow(null);
            }}
            onSubmit={async (data) => {
              await recordMovementMutation.mutateAsync(data);
              setShowAdjustModal(false);
              setAdjustRow(null);
            }}
            isPending={recordMovementMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ON-HAND TABLE COMPONENT
// ═══════════════════════════════════════════════════════════════

interface OnHandTableProps {
  data: OnHandRow[];
  loading: boolean;
  onStockOut: (row: OnHandRow) => void;
  onAdjust: (row: OnHandRow) => void;
  formatDate: (date: string | null | undefined) => string;
}

function OnHandTable({
  data,
  loading,
  onStockOut,
  onAdjust,
  formatDate,
}: OnHandTableProps) {
  const { preferences } = usePreferences();
  const { t } = useI18n();

  if (loading) {
    return <div className="loading-state">{t("inventory.loading")}</div>;
  }

  if (data.length === 0) {
    return <div className="empty-state">{t("inventory.noStock")}</div>;
  }

  return (
    <div className="table-container">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Lot</th>
            <th>Item</th>
            <th>Unit</th>
            <th>Expiry</th>
            <th>Location</th>
            <th>On-hand</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const display = getDisplayQuantity(
              row.onHandQuantity,
              row.unit,
              preferences.weightUnit,
              preferences.locale,
            );

            return (
              <tr key={`${row.supplyLotId}-${row.locationId || "any"}`}>
                <td>{row.batchCode || "-"}</td>
                <td>{row.supplyItemName || "-"}</td>
                <td>{display.unitLabel || "-"}</td>
                <td>{formatDate(row.expiryDate)}</td>
                <td>{row.locationLabel || "-"}</td>
                <td className="quantity">{display.formatted}</td>
                <td>
                  <span
                    className={`status-badge ${row.lotStatus?.toLowerCase() || ""}`}
                  >
                    {row.lotStatus || "-"}
                  </span>
                </td>
                <td className="actions">
                  <button className="btn-out" onClick={() => onStockOut(row)}>
                    Stock OUT
                  </button>
                  <button className="btn-adjust" onClick={() => onAdjust(row)}>
                    Adjust
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOVEMENTS TABLE COMPONENT
// ═══════════════════════════════════════════════════════════════

interface MovementsTableProps {
  data: StockMovement[];
  loading: boolean;
  formatDateTime: (date: string | null | undefined) => string;
}

function MovementsTable({
  data,
  loading,
  formatDateTime,
}: MovementsTableProps) {
  const { preferences } = usePreferences();
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="loading-state">{t("inventory.loadingMovements")}</div>
    );
  }

  if (data.length === 0) {
    return <div className="empty-state">{t("inventory.noMovements")}</div>;
  }

  const getMovementClass = (type: string) => {
    switch (type) {
      case "IN":
        return "movement-in";
      case "OUT":
        return "movement-out";
      case "ADJUST":
        return "movement-adjust";
      default:
        return "";
    }
  };

  return (
    <div className="table-container">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Lot</th>
            <th>Item</th>
            <th>Location</th>
            <th>Season</th>
            <th>Task</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {data.map((mv) => {
            const display = getDisplayQuantity(
              mv.quantity,
              mv.unit,
              preferences.weightUnit,
              preferences.locale,
            );
            const unitSuffix = display.unitLabel ? ` ${display.unitLabel}` : "";

            return (
              <tr key={mv.id}>
                <td>{formatDateTime(mv.movementDate)}</td>
                <td>
                  <span
                    className={`type-badge ${getMovementClass(mv.movementType)}`}
                  >
                    {mv.movementType}
                  </span>
                </td>
                <td className={`quantity ${getMovementClass(mv.movementType)}`}>
                  {mv.movementType === "OUT" ? "-" : ""}
                  {display.formatted}
                  {unitSuffix}
                </td>
                <td>{mv.batchCode || "-"}</td>
                <td>{mv.supplyItemName || "-"}</td>
                <td>{mv.locationLabel || "-"}</td>
                <td>{mv.seasonName || "-"}</td>
                <td>{mv.taskTitle || "-"}</td>
                <td className="note">{mv.note || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STOCK OUT MODAL
// ═══════════════════════════════════════════════════════════════

interface StockOutModalProps {
  row: OnHandRow;
  onClose: () => void;
  onSubmit: (
    data: import("@/entities/inventory").StockMovementRequest,
  ) => Promise<void>;
  isPending: boolean;
}

function StockOutModal({
  row,
  onClose,
  onSubmit,
  isPending,
}: StockOutModalProps) {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const [quantity, setQuantity] = useState<number>(0);
  const [seasonId, setSeasonId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const display = getDisplayQuantity(
    row.onHandQuantity,
    row.unit,
    preferences.weightUnit,
    preferences.locale,
  );
  const maxDisplayQuantity = display.displayValue;
  const unitSuffix = display.unitLabel ? ` ${display.unitLabel}` : "";
  const rowWeightUnit = normalizeWeightUnit(row.unit);

  const handleSubmit = async () => {
    if (!seasonId) {
      setError(t("inventory.validation.seasonRequired"));
      return;
    }
    if (quantity <= 0) {
      setError(t("inventory.validation.quantityPositive"));
      return;
    }
    if (quantity > maxDisplayQuantity) {
      setError(t("inventory.validation.quantityExceeds"));
      return;
    }
    setError("");

    try {
      const quantityToSend = rowWeightUnit
        ? toRowUnitQuantity(quantity, rowWeightUnit, preferences.weightUnit)
        : quantity;
      await onSubmit({
        movementType: "OUT",
        supplyLotId: row.supplyLotId,
        warehouseId: row.warehouseId,
        locationId: row.locationId,
        quantity: quantityToSend,
        seasonId,
        note: note || undefined,
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : t("inventory.validation.movementFailed"),
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{t("inventory.stockOut")}</h2>
        <p className="modal-subtitle">
          {row.supplyItemName} ({row.batchCode})
        </p>
        <p className="on-hand-info">
          {t("inventory.currentOnHand")}:{" "}
          <strong>
            {display.formatted}
            {unitSuffix}
          </strong>
        </p>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>{t("inventory.seasonRequired")}</label>
          <input
            type="number"
            placeholder={t("inventory.enterSeasonId")}
            value={seasonId || ""}
            onChange={(e) =>
              setSeasonId(e.target.value ? Number(e.target.value) : null)
            }
          />
        </div>

        <div className="form-group">
          <label>
            {t("inventory.quantity")}
            {display.unitLabel ? ` (${display.unitLabel})` : ""}
          </label>
          <input
            type="number"
            min={0}
            max={maxDisplayQuantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label>{t("inventory.noteOptional")}</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("inventory.addNote")}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose} disabled={isPending}>
            {t("common.cancel")}
          </button>
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending
              ? t("common.processing")
              : t("inventory.confirmStockOut")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADJUST MODAL
// ═══════════════════════════════════════════════════════════════

interface AdjustModalProps {
  row: OnHandRow;
  onClose: () => void;
  onSubmit: (
    data: import("@/entities/inventory").StockMovementRequest,
  ) => Promise<void>;
  isPending: boolean;
}

function AdjustModal({ row, onClose, onSubmit, isPending }: AdjustModalProps) {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const [adjustQuantity, setAdjustQuantity] = useState<number>(0);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const display = getDisplayQuantity(
    row.onHandQuantity,
    row.unit,
    preferences.weightUnit,
    preferences.locale,
  );
  const baseDisplayQuantity = display.displayValue;
  const unitSuffix = display.unitLabel ? ` ${display.unitLabel}` : "";
  const rowWeightUnit = normalizeWeightUnit(row.unit);

  const newOnHand = baseDisplayQuantity + adjustQuantity;

  const handleSubmit = async () => {
    if (!note.trim()) {
      setError(t("inventory.validation.noteRequired"));
      return;
    }
    if (adjustQuantity === 0) {
      setError(t("inventory.validation.adjustNotZero"));
      return;
    }
    if (newOnHand < 0) {
      setError(t("inventory.validation.negativeOnHand"));
      return;
    }
    setError("");

    try {
      const quantityToSend = rowWeightUnit
        ? toRowUnitQuantity(
            adjustQuantity,
            rowWeightUnit,
            preferences.weightUnit,
          )
        : adjustQuantity;
      await onSubmit({
        movementType: "ADJUST",
        supplyLotId: row.supplyLotId,
        warehouseId: row.warehouseId,
        locationId: row.locationId,
        quantity: quantityToSend,
        note,
      });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : t("inventory.validation.adjustFailed"),
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{t("inventory.adjustStock")}</h2>
        <p className="modal-subtitle">
          {row.supplyItemName} ({row.batchCode})
        </p>
        <p className="on-hand-info">
          {t("inventory.currentOnHand")}:{" "}
          <strong>
            {display.formatted}
            {unitSuffix}
          </strong>
        </p>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>
            {t("inventory.adjustmentAmount")}
            {display.unitLabel ? ` (${display.unitLabel})` : ""}
          </label>
          <input
            type="number"
            value={adjustQuantity}
            onChange={(e) => setAdjustQuantity(Number(e.target.value))}
            placeholder={t("inventory.adjustPlaceholder")}
          />
          <p className="preview">
            {t("inventory.newOnHand")}:{" "}
            <strong className={newOnHand < 0 ? "negative" : ""}>
              {formatNumber(
                newOnHand,
                preferences.locale,
                preferences.weightUnit === "G" ? 0 : 2,
              )}
              {unitSuffix}
            </strong>
          </p>
        </div>

        <div className="form-group">
          <label>{t("inventory.noteRequired")}</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("inventory.adjustReason")}
            required
          />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose} disabled={isPending}>
            {t("common.cancel")}
          </button>
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={isPending || !note.trim()}
          >
            {isPending ? t("common.processing") : t("inventory.confirmAdjust")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InventoryPage;
