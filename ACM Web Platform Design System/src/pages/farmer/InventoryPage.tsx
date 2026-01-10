import { useState } from 'react';
import { Warehouse } from 'lucide-react';
import {
    useMyWarehouses,
    useOnHandList,
    useMovements,
    useRecordStockMovement,
    useLocations,
    type Warehouse,
    type OnHandRow,
    type StockMovement,
    type OnHandParams,
    type MovementsParams,
} from '@/entities/inventory';
import { Card, CardContent, PageHeader } from '@/shared/ui';
import './InventoryPage.css';

// ═══════════════════════════════════════════════════════════════
// INVENTORY PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

type TabType = 'on-hand' | 'movements';

export function InventoryPage() {
    const [activeTab, setActiveTab] = useState<TabType>('on-hand');
    const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | undefined>(undefined);
    const [selectedLocationId, setSelectedLocationId] = useState<number | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [movementTypeFilter, setMovementTypeFilter] = useState<string>('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [page, setPage] = useState(0);
    
    // Stock Out Modal State
    const [showStockOutModal, setShowStockOutModal] = useState(false);
    const [stockOutRow, setStockOutRow] = useState<OnHandRow | null>(null);
    
    // Adjust Modal State
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [adjustRow, setAdjustRow] = useState<OnHandRow | null>(null);

    // ===== QUERIES =====
    const { data: warehouses, isLoading: loadingWarehouses } = useMyWarehouses();
    const { data: locations } = useLocations(selectedWarehouseId);
    
    const onHandParams: OnHandParams | undefined = selectedWarehouseId ? {
        warehouseId: selectedWarehouseId,
        locationId: selectedLocationId,
        q: searchQuery || undefined,
        page,
        size: 20,
    } : undefined;
    
    const movementsParams: MovementsParams | undefined = selectedWarehouseId ? {
        warehouseId: selectedWarehouseId,
        type: movementTypeFilter || undefined,
        from: dateFrom || undefined,
        to: dateTo || undefined,
        page,
        size: 20,
    } : undefined;

    const { data: onHandData, isLoading: loadingOnHand } = useOnHandList(onHandParams);
    const { data: movementsData, isLoading: loadingMovements } = useMovements(movementsParams);
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
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('vi-VN');
        } catch {
            return dateStr;
        }
    };

    const formatDateTime = (dateStr: string | null | undefined): string => {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            return date.toLocaleString('vi-VN');
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
                        icon={<Warehouse className="w-8 h-8" />}
                        title="Inventory"
                        subtitle="Manage your stock movements and on-hand quantities"
                    />
                </CardContent>
            </Card>

            {/* ===== CONTROLS ===== */}
            <Card className="mb-6 border border-border rounded-xl shadow-sm">
                <CardContent className="px-6 py-4">
                    <div className="inventory-controls flex flex-wrap items-center justify-start gap-4">
                        <div className="control-group">
                            <label htmlFor="warehouse-select">Warehouse</label>
                            <select
                                id="warehouse-select"
                                value={selectedWarehouseId || ''}
                                onChange={(e) => handleWarehouseChange(Number(e.target.value))}
                                disabled={loadingWarehouses}
                            >
                                {loadingWarehouses && <option>Loading...</option>}
                                {!loadingWarehouses && (!warehouses || warehouses.length === 0) && (
                                    <option value="">No warehouses found</option>
                                )}
                                {warehouses?.map((w: Warehouse) => (
                                    <option key={w.id} value={w.id}>
                                        {w.name} {w.farmName ? `(${w.farmName})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="control-group">
                            <label htmlFor="location-select">Location (Optional)</label>
                            <select
                                id="location-select"
                                value={selectedLocationId || ''}
                                onChange={(e) => setSelectedLocationId(e.target.value ? Number(e.target.value) : undefined)}
                            >
                                <option value="">All Locations</option>
                                {locations?.map((loc) => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.label || `Location ${loc.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {activeTab === 'on-hand' && (
                            <div className="control-group control-group--search">
                                <label htmlFor="search-input">Search</label>
                                <input
                                    id="search-input"
                                    type="text"
                                    placeholder="Search by lot code or item name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        )}

                        {activeTab === 'movements' && (
                            <>
                                <div className="control-group">
                                    <label htmlFor="type-filter">Movement Type</label>
                                    <select
                                        id="type-filter"
                                        value={movementTypeFilter}
                                        onChange={(e) => setMovementTypeFilter(e.target.value)}
                                    >
                                        <option value="">All Types</option>
                                        <option value="IN">IN</option>
                                        <option value="OUT">OUT</option>
                                        <option value="ADJUST">ADJUST</option>
                                    </select>
                                </div>
                                <div className="control-group">
                                    <label htmlFor="date-from">From</label>
                                    <input
                                        id="date-from"
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                    />
                                </div>
                                <div className="control-group">
                                    <label htmlFor="date-to">To</label>
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
                    className={`tab ${activeTab === 'on-hand' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('on-hand'); setPage(0); }}
                >
                    On-hand Stock
                </button>
                <button
                    className={`tab ${activeTab === 'movements' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('movements'); setPage(0); }}
                >
                    Movement History
                </button>
            </div>

            {/* ===== CONTENT ===== */}
            <div className="inventory-content">
                {!selectedWarehouseId && (
                    <div className="empty-state">
                        <p>Please select a warehouse to view inventory</p>
                    </div>
                )}

                {selectedWarehouseId && activeTab === 'on-hand' && (
                    <OnHandTable
                        data={onHandData?.items || []}
                        loading={loadingOnHand}
                        onStockOut={handleStockOut}
                        onAdjust={handleAdjust}
                        formatDate={formatDate}
                    />
                )}

                {selectedWarehouseId && activeTab === 'movements' && (
                    <MovementsTable
                        data={movementsData?.items || []}
                        loading={loadingMovements}
                        formatDateTime={formatDateTime}
                    />
                )}

                {/* Pagination */}
                {selectedWarehouseId && (
                    <div className="pagination">
                        <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                            Previous
                        </button>
                        <span>Page {page + 1}</span>
                        <button
                            disabled={
                                activeTab === 'on-hand'
                                    ? (!onHandData || page >= (onHandData.totalPages - 1))
                                    : (!movementsData || page >= (movementsData.totalPages - 1))
                            }
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* ===== MODALS ===== */}
            {showStockOutModal && stockOutRow && (
                <StockOutModal
                    row={stockOutRow}
                    onClose={() => { setShowStockOutModal(false); setStockOutRow(null); }}
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
                    onClose={() => { setShowAdjustModal(false); setAdjustRow(null); }}
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

function OnHandTable({ data, loading, onStockOut, onAdjust, formatDate }: OnHandTableProps) {
    if (loading) {
        return <div className="loading-state">Loading on-hand inventory...</div>;
    }

    if (data.length === 0) {
        return <div className="empty-state">No on-hand stock found for this warehouse</div>;
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
                    {data.map((row) => (
                        <tr key={`${row.supplyLotId}-${row.locationId || 'any'}`}>
                            <td>{row.batchCode || '-'}</td>
                            <td>{row.supplyItemName || '-'}</td>
                            <td>{row.unit || '-'}</td>
                            <td>{formatDate(row.expiryDate)}</td>
                            <td>{row.locationLabel || '-'}</td>
                            <td className="quantity">{row.onHandQuantity.toLocaleString()}</td>
                            <td>
                                <span className={`status-badge ${row.lotStatus?.toLowerCase() || ''}`}>
                                    {row.lotStatus || '-'}
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
                    ))}
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

function MovementsTable({ data, loading, formatDateTime }: MovementsTableProps) {
    if (loading) {
        return <div className="loading-state">Loading movement history...</div>;
    }

    if (data.length === 0) {
        return <div className="empty-state">No movements found for this warehouse</div>;
    }

    const getMovementClass = (type: string) => {
        switch (type) {
            case 'IN': return 'movement-in';
            case 'OUT': return 'movement-out';
            case 'ADJUST': return 'movement-adjust';
            default: return '';
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
                    {data.map((mv) => (
                        <tr key={mv.id}>
                            <td>{formatDateTime(mv.movementDate)}</td>
                            <td>
                                <span className={`type-badge ${getMovementClass(mv.movementType)}`}>
                                    {mv.movementType}
                                </span>
                            </td>
                            <td className={`quantity ${getMovementClass(mv.movementType)}`}>
                                {mv.movementType === 'OUT' ? '-' : ''}{mv.quantity.toLocaleString()} {mv.unit || ''}
                            </td>
                            <td>{mv.batchCode || '-'}</td>
                            <td>{mv.supplyItemName || '-'}</td>
                            <td>{mv.locationLabel || '-'}</td>
                            <td>{mv.seasonName || '-'}</td>
                            <td>{mv.taskTitle || '-'}</td>
                            <td className="note">{mv.note || '-'}</td>
                        </tr>
                    ))}
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
    onSubmit: (data: import('@/entities/inventory').StockMovementRequest) => Promise<void>;
    isPending: boolean;
}

function StockOutModal({ row, onClose, onSubmit, isPending }: StockOutModalProps) {
    const [quantity, setQuantity] = useState<number>(0);
    const [seasonId, setSeasonId] = useState<number | null>(null);
    const [note, setNote] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!seasonId) {
            setError('Season is required for Stock OUT');
            return;
        }
        if (quantity <= 0) {
            setError('Quantity must be greater than 0');
            return;
        }
        if (quantity > row.onHandQuantity) {
            setError('Quantity exceeds available on-hand stock');
            return;
        }
        setError('');

        try {
            await onSubmit({
                movementType: 'OUT',
                supplyLotId: row.supplyLotId,
                warehouseId: row.warehouseId,
                locationId: row.locationId,
                quantity,
                seasonId,
                note: note || undefined,
            });
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to record movement');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Stock OUT</h2>
                <p className="modal-subtitle">
                    {row.supplyItemName} ({row.batchCode})
                </p>
                <p className="on-hand-info">
                    Current on-hand: <strong>{row.onHandQuantity} {row.unit}</strong>
                </p>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label>Season (Required)</label>
                    <input
                        type="number"
                        placeholder="Enter season ID"
                        value={seasonId || ''}
                        onChange={e => setSeasonId(e.target.value ? Number(e.target.value) : null)}
                    />
                </div>

                <div className="form-group">
                    <label>Quantity</label>
                    <input
                        type="number"
                        min={0}
                        max={row.onHandQuantity}
                        value={quantity}
                        onChange={e => setQuantity(Number(e.target.value))}
                    />
                </div>

                <div className="form-group">
                    <label>Note (Optional)</label>
                    <textarea
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="Add a note..."
                    />
                </div>

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose} disabled={isPending}>
                        Cancel
                    </button>
                    <button className="btn-submit" onClick={handleSubmit} disabled={isPending}>
                        {isPending ? 'Processing...' : 'Confirm Stock OUT'}
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
    onSubmit: (data: import('@/entities/inventory').StockMovementRequest) => Promise<void>;
    isPending: boolean;
}

function AdjustModal({ row, onClose, onSubmit, isPending }: AdjustModalProps) {
    const [adjustQuantity, setAdjustQuantity] = useState<number>(0);
    const [note, setNote] = useState('');
    const [error, setError] = useState('');

    const newOnHand = row.onHandQuantity + adjustQuantity;

    const handleSubmit = async () => {
        if (!note.trim()) {
            setError('Note is required for ADJUST movements');
            return;
        }
        if (adjustQuantity === 0) {
            setError('Adjustment quantity cannot be zero');
            return;
        }
        if (newOnHand < 0) {
            setError('Adjustment would result in negative on-hand');
            return;
        }
        setError('');

        try {
            await onSubmit({
                movementType: 'ADJUST',
                supplyLotId: row.supplyLotId,
                warehouseId: row.warehouseId,
                locationId: row.locationId,
                quantity: adjustQuantity,
                note,
            });
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to record adjustment');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Adjust Stock</h2>
                <p className="modal-subtitle">
                    {row.supplyItemName} ({row.batchCode})
                </p>
                <p className="on-hand-info">
                    Current on-hand: <strong>{row.onHandQuantity} {row.unit}</strong>
                </p>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label>Adjustment (+/-)</label>
                    <input
                        type="number"
                        value={adjustQuantity}
                        onChange={e => setAdjustQuantity(Number(e.target.value))}
                        placeholder="Enter positive or negative value"
                    />
                    <p className="preview">
                        New on-hand: <strong className={newOnHand < 0 ? 'negative' : ''}>
                            {newOnHand} {row.unit}
                        </strong>
                    </p>
                </div>

                <div className="form-group">
                    <label>Note (Required)</label>
                    <textarea
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="Reason for adjustment..."
                        required
                    />
                </div>

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose} disabled={isPending}>
                        Cancel
                    </button>
                    <button className="btn-submit" onClick={handleSubmit} disabled={isPending || !note.trim()}>
                        {isPending ? 'Processing...' : 'Confirm Adjustment'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InventoryPage;
