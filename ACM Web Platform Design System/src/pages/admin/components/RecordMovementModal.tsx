import { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle, AlertTriangle, Package, ArrowDownToLine, ArrowUpFromLine, RefreshCw } from 'lucide-react';
import { adminWarehouseApi, adminSupplierApi, adminSeasonApi } from '@/services/api.admin';

// ═══════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════

interface WarehouseItem {
    id: number;
    name: string;
    type: string;
    farmId: number;
    farmName: string;
}

interface StockLocation {
    id: number;
    zone: string | null;
    aisle: string | null;
    shelf: string | null;
    bin: string | null;
    warehouseId: number;
}

interface SupplyLot {
    id: number;
    batchCode: string;
    supplyItemName: string;
    supplierName: string;
}

interface Season {
    id: number;
    seasonName: string;
    farmName: string;
    plotName: string;
}

interface RecordMovementModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    warehouses: WarehouseItem[];
}

// ═══════════════════════════════════════════════════════════════
// ERROR MESSAGE MAPPING
// ═══════════════════════════════════════════════════════════════

const ERROR_MESSAGES: Record<string, string> = {
    INSUFFICIENT_STOCK: 'Not enough stock available. The requested quantity exceeds the current on-hand quantity.',
    WAREHOUSE_SEASON_FARM_MISMATCH: 'Warehouse and Season must belong to the same farm.',
    LOCATION_WAREHOUSE_MISMATCH: 'The selected location does not belong to the selected warehouse.',
    SUPPLY_LOT_NOT_FOUND: 'The selected supply lot was not found.',
    WAREHOUSE_NOT_FOUND: 'The selected warehouse was not found.',
    LOCATION_NOT_FOUND: 'The selected location was not found.',
    SEASON_NOT_FOUND: 'The selected season was not found.',
    INVALID_MOVEMENT_TYPE: 'Invalid movement type specified.',
    BAD_REQUEST: 'Invalid request. Please check your inputs.',
};

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export function RecordMovementModal({ open, onClose, onSuccess, warehouses }: RecordMovementModalProps) {
    // Form state
    const [supplyLotId, setSupplyLotId] = useState<number | ''>('');
    const [warehouseId, setWarehouseId] = useState<number | ''>('');
    const [locationId, setLocationId] = useState<number | ''>('');
    const [movementType, setMovementType] = useState<'IN' | 'OUT' | 'ADJUST'>('IN');
    const [quantity, setQuantity] = useState('');
    const [isNegativeAdjust, setIsNegativeAdjust] = useState(false);
    const [seasonId, setSeasonId] = useState<number | ''>('');
    const [note, setNote] = useState('');

    // Data states
    const [supplyLots, setSupplyLots] = useState<SupplyLot[]>([]);
    const [locations, setLocations] = useState<StockLocation[]>([]);
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [onHandQuantity, setOnHandQuantity] = useState<number | null>(null);

    // UI states
    const [loading, setLoading] = useState(false);
    const [lotsLoading, setLotsLoading] = useState(false);
    const [locationsLoading, setLocationsLoading] = useState(false);
    const [seasonsLoading, setSeasonsLoading] = useState(false);
    const [stockLoading, setStockLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ═══════════════════════════════════════════════════════════════
    // EFFECTS
    // ═══════════════════════════════════════════════════════════════

    // Load supply lots on open
    useEffect(() => {
        if (open) {
            fetchSupplyLots();
            fetchSeasons();
            resetForm();
        }
    }, [open]);

    // Load locations when warehouse changes
    useEffect(() => {
        if (warehouseId) {
            fetchLocations(warehouseId as number);
        } else {
            setLocations([]);
            setLocationId('');
        }
    }, [warehouseId]);

    // Check on-hand quantity for OUT/ADJUST
    useEffect(() => {
        if ((movementType === 'OUT' || movementType === 'ADJUST') && supplyLotId && warehouseId) {
            checkOnHandQuantity();
        } else {
            setOnHandQuantity(null);
        }
    }, [supplyLotId, warehouseId, locationId, movementType]);

    // ═══════════════════════════════════════════════════════════════
    // FETCH FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    const fetchSupplyLots = async () => {
        setLotsLoading(true);
        try {
            const response = await adminSupplierApi.listLots({ page: 0, size: 100, status: 'ACTIVE' });
            if (response?.result?.items) {
                setSupplyLots(response.result.items);
            }
        } catch (err) {
            console.error('Failed to fetch supply lots:', err);
        } finally {
            setLotsLoading(false);
        }
    };

    const fetchLocations = async (whId: number) => {
        setLocationsLoading(true);
        try {
            const response = await adminWarehouseApi.getLocations(whId);
            if (response?.result) {
                setLocations(response.result);
            }
        } catch (err) {
            console.error('Failed to fetch locations:', err);
            setLocations([]);
        } finally {
            setLocationsLoading(false);
        }
    };

    const fetchSeasons = async () => {
        setSeasonsLoading(true);
        try {
            const response = await adminSeasonApi.list({ page: 0, size: 100, status: 'ACTIVE' });
            if (response?.result?.items) {
                setSeasons(response.result.items);
            }
        } catch (err) {
            console.error('Failed to fetch seasons:', err);
        } finally {
            setSeasonsLoading(false);
        }
    };

    const checkOnHandQuantity = async () => {
        if (!supplyLotId || !warehouseId) return;

        setStockLoading(true);
        try {
            const qty = await adminWarehouseApi.getOnHandQuantity(
                supplyLotId as number,
                warehouseId as number,
                locationId ? (locationId as number) : undefined
            );
            setOnHandQuantity(qty);
        } catch (err) {
            console.error('Failed to check on-hand quantity:', err);
            setOnHandQuantity(0);
        } finally {
            setStockLoading(false);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // FORM HANDLERS
    // ═══════════════════════════════════════════════════════════════

    const resetForm = () => {
        setSupplyLotId('');
        setWarehouseId('');
        setLocationId('');
        setMovementType('IN');
        setQuantity('');
        setIsNegativeAdjust(false);
        setSeasonId('');
        setNote('');
        setError(null);
        setOnHandQuantity(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!supplyLotId) {
            setError('Please select a supply lot');
            return;
        }
        if (!warehouseId) {
            setError('Please select a warehouse');
            return;
        }
        if (!quantity || parseFloat(quantity) <= 0) {
            setError('Please enter a valid quantity greater than 0');
            return;
        }

        // Calculate final quantity
        let finalQuantity = parseFloat(quantity);
        if (movementType === 'ADJUST' && isNegativeAdjust) {
            finalQuantity = -finalQuantity;
        }

        // Frontend validation for OUT/negative ADJUST
        if (onHandQuantity !== null) {
            if (movementType === 'OUT' && finalQuantity > onHandQuantity) {
                setError(`Not enough stock. Current: ${onHandQuantity}, Requested: ${finalQuantity}`);
                return;
            }
            if (movementType === 'ADJUST' && isNegativeAdjust && Math.abs(finalQuantity) > onHandQuantity) {
                setError(`Not enough stock. Current: ${onHandQuantity}, Adjustment: ${finalQuantity}`);
                return;
            }
        }

        setLoading(true);

        try {
            await adminWarehouseApi.recordMovement({
                supplyLotId: supplyLotId as number,
                warehouseId: warehouseId as number,
                locationId: locationId ? (locationId as number) : undefined,
                movementType,
                quantity: finalQuantity,
                seasonId: seasonId ? (seasonId as number) : undefined,
                note: note || undefined,
            });

            onSuccess?.();
            onClose();
        } catch (err: any) {
            const code = err.response?.data?.code;
            const message = ERROR_MESSAGES[code] || err.response?.data?.message || 'Failed to record movement';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // Filter seasons by selected warehouse farm
    const getFilteredSeasons = () => {
        if (!warehouseId) return seasons;
        const selectedWarehouse = warehouses.find(w => w.id === warehouseId);
        if (!selectedWarehouse) return seasons;
        // Filter seasons whose farm matches warehouse farm
        return seasons.filter((s: any) => {
            // If season has farmId or farmName that matches, filter by it
            // This is a simplified check - in real implementation, season would have farmId
            return true; // Show all seasons but validation happens on backend
        });
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════

    if (!open) return null;

    const selectedLot = supplyLots.find(l => l.id === supplyLotId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-background border border-border rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Record Stock Movement
                    </h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Error Alert */}
                        {error && (
                            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
                                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {/* Supply Lot */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Supply Lot *</label>
                            <select
                                value={supplyLotId}
                                onChange={(e) => setSupplyLotId(e.target.value ? parseInt(e.target.value) : '')}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                                disabled={lotsLoading}
                            >
                                <option value="">Select supply lot...</option>
                                {supplyLots.map((lot) => (
                                    <option key={lot.id} value={lot.id}>
                                        {lot.batchCode} - {lot.supplyItemName} ({lot.supplierName})
                                    </option>
                                ))}
                            </select>
                            {selectedLot && (
                                <p className="text-xs text-muted-foreground">
                                    Item: {selectedLot.supplyItemName} | Supplier: {selectedLot.supplierName}
                                </p>
                            )}
                        </div>

                        {/* Warehouse */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Warehouse *</label>
                            <select
                                value={warehouseId}
                                onChange={(e) => {
                                    setWarehouseId(e.target.value ? parseInt(e.target.value) : '');
                                    setLocationId('');
                                }}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                            >
                                <option value="">Select warehouse...</option>
                                {warehouses.map((wh) => (
                                    <option key={wh.id} value={wh.id}>
                                        {wh.name} ({wh.farmName})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Location (Optional) */}
                        {warehouseId && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Location (Optional)</label>
                                <select
                                    value={locationId}
                                    onChange={(e) => setLocationId(e.target.value ? parseInt(e.target.value) : '')}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                                    disabled={locationsLoading}
                                >
                                    <option value="">No specific location</option>
                                    {locations.map((loc) => (
                                        <option key={loc.id} value={loc.id}>
                                            {[loc.zone, loc.aisle, loc.shelf, loc.bin].filter(Boolean).join(' / ') || `Location #${loc.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Movement Type */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Movement Type *</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setMovementType('IN'); setIsNegativeAdjust(false); }}
                                    className={`flex-1 px-4 py-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 ${movementType === 'IN'
                                        ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'border-border hover:bg-muted/50'
                                        }`}
                                >
                                    <ArrowDownToLine className="h-4 w-4" />
                                    IN
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setMovementType('OUT'); setIsNegativeAdjust(false); }}
                                    className={`flex-1 px-4 py-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 ${movementType === 'OUT'
                                        ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        : 'border-border hover:bg-muted/50'
                                        }`}
                                >
                                    <ArrowUpFromLine className="h-4 w-4" />
                                    OUT
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMovementType('ADJUST')}
                                    className={`flex-1 px-4 py-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 ${movementType === 'ADJUST'
                                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        : 'border-border hover:bg-muted/50'
                                        }`}
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    ADJUST
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {movementType === 'IN' && 'Inbound: Add stock to inventory (e.g., receiving from supplier)'}
                                {movementType === 'OUT' && 'Outbound: Remove stock from inventory (e.g., usage, sale)'}
                                {movementType === 'ADJUST' && 'Audit adjustment: Correct inventory discrepancies (positive or negative)'}
                            </p>
                        </div>

                        {/* Quantity */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Quantity *</label>
                            <div className="flex gap-2">
                                {movementType === 'ADJUST' && (
                                    <button
                                        type="button"
                                        onClick={() => setIsNegativeAdjust(!isNegativeAdjust)}
                                        className={`px-4 py-2 rounded-lg border font-medium ${isNegativeAdjust
                                            ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            : 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            }`}
                                    >
                                        {isNegativeAdjust ? '−' : '+'}
                                    </button>
                                )}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
                                    placeholder="Enter quantity"
                                />
                            </div>
                        </div>

                        {/* Current Stock Display for OUT/ADJUST */}
                        {(movementType === 'OUT' || movementType === 'ADJUST') && supplyLotId && warehouseId && (
                            <div className="flex items-start gap-2 p-3 bg-muted/30 border border-border rounded-lg">
                                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-500" />
                                <div className="text-sm">
                                    <strong>Current On-Hand:</strong>{' '}
                                    {stockLoading ? (
                                        <Loader2 className="inline h-4 w-4 animate-spin" />
                                    ) : (
                                        <span className="text-lg font-bold text-primary">{onHandQuantity ?? 0}</span>
                                    )}
                                    {locationId ? ' (at selected location)' : ' (warehouse total)'}
                                </div>
                            </div>
                        )}

                        {/* Season (Optional) */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Season (Optional)</label>
                            <select
                                value={seasonId}
                                onChange={(e) => setSeasonId(e.target.value ? parseInt(e.target.value) : '')}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                                disabled={seasonsLoading}
                            >
                                <option value="">No season linked</option>
                                {getFilteredSeasons().map((s: any) => (
                                    <option key={s.id} value={s.id}>
                                        {s.seasonName} ({s.farmName || s.plotName || 'Unknown'})
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-foreground">
                                Link this movement to a season for tracking purposes. Season's farm must match warehouse farm.
                            </p>
                        </div>

                        {/* Note */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Note (Optional)</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm resize-none"
                                placeholder="Add notes for audit purposes..."
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/30">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading || !supplyLotId || !warehouseId || !quantity}
                        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loading ? 'Recording...' : 'Record Movement'}
                    </button>
                </div>
            </div>
        </div>
    );
}
