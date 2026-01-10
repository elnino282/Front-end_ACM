import { useState, useEffect } from 'react';
import { X, Warehouse, MapPin, ArrowUpDown, RefreshCw, AlertCircle } from 'lucide-react';
import { adminWarehouseApi } from '@/services/api.admin';

// ═══════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════

interface WarehouseItem {
    id: number;
    name: string;
    type: string;
    farmId: number;
    farmName: string;
    provinceName?: string | null;
    wardName?: string | null;
    locationCount: number;
}

interface StockLocation {
    id: number;
    zone: string | null;
    aisle: string | null;
    shelf: string | null;
    bin: string | null;
    warehouseId: number;
}

interface StockMovement {
    id: number;
    movementDate: string;
    movementType: 'IN' | 'OUT' | 'ADJUST';
    quantity: number;
    note: string | null;
    supplyLotId: number;
    supplyItemName: string;
    warehouseId: number;
    warehouseName: string;
    locationId: number | null;
    seasonId: number | null;
}

interface WarehouseDetailModalProps {
    warehouse: WarehouseItem;
    open: boolean;
    onClose: () => void;
}

// ═══════════════════════════════════════════════════════════════
// MOVEMENT TYPE COLORS
// ═══════════════════════════════════════════════════════════════

const MOVEMENT_TYPE_COLORS: Record<string, string> = {
    IN: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    OUT: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    ADJUST: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export function WarehouseDetailModal({ warehouse, open, onClose }: WarehouseDetailModalProps) {
    const [activeTab, setActiveTab] = useState<'info' | 'locations' | 'movements'>('info');
    const [locations, setLocations] = useState<StockLocation[]>([]);
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [locationsLoading, setLocationsLoading] = useState(false);
    const [movementsLoading, setMovementsLoading] = useState(false);
    const [movementsPage, setMovementsPage] = useState(0);
    const [movementsTotalPages, setMovementsTotalPages] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // ═══════════════════════════════════════════════════════════════
    // EFFECTS
    // ═══════════════════════════════════════════════════════════════

    useEffect(() => {
        if (open) {
            setActiveTab('info');
            setMovementsPage(0);
            fetchLocations();
            fetchMovements(0);
        }
    }, [open, warehouse.id]);

    useEffect(() => {
        if (open && activeTab === 'movements') {
            fetchMovements(movementsPage);
        }
    }, [movementsPage]);

    // ═══════════════════════════════════════════════════════════════
    // FETCH FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    const fetchLocations = async () => {
        setLocationsLoading(true);
        setError(null);
        try {
            const response = await adminWarehouseApi.getLocations(warehouse.id);
            if (response?.result) {
                setLocations(response.result);
            }
        } catch (err) {
            console.error('Failed to fetch locations:', err);
            setError('Failed to load locations');
        } finally {
            setLocationsLoading(false);
        }
    };

    const fetchMovements = async (page: number) => {
        setMovementsLoading(true);
        try {
            const response = await adminWarehouseApi.getMovements(warehouse.id, { page, size: 10 });
            if (response?.result) {
                setMovements(response.result.items || []);
                setMovementsTotalPages(response.result.totalPages || 0);
            }
        } catch (err) {
            console.error('Failed to fetch movements:', err);
        } finally {
            setMovementsLoading(false);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDER: INFO TAB
    // ═══════════════════════════════════════════════════════════════

    const renderInfo = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Name</div>
                    <div className="text-sm font-medium">{warehouse.name}</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Type</div>
                    <div className="text-sm font-medium">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                            {warehouse.type || 'General'}
                        </span>
                    </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Farm</div>
                    <div className="text-sm font-medium">{warehouse.farmName || '-'}</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Address</div>
                    <div className="text-sm font-medium">
                        {warehouse.wardName || warehouse.provinceName
                            ? `${warehouse.wardName || ''} ${warehouse.provinceName || ''}`.trim()
                            : '-'}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary">{warehouse.locationCount || 0}</div>
                    <div className="text-sm text-muted-foreground">Stock Locations</div>
                </div>
                <div className="p-4 border border-border rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary">{movements.length}</div>
                    <div className="text-sm text-muted-foreground">Recent Movements</div>
                </div>
            </div>
        </div>
    );

    // ═══════════════════════════════════════════════════════════════
    // RENDER: LOCATIONS TAB
    // ═══════════════════════════════════════════════════════════════

    const renderLocations = () => (
        <div className="space-y-4">
            {locationsLoading ? (
                <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : locations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No stock locations defined</p>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Zone</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Aisle</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Shelf</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Bin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.map((loc) => (
                                <tr key={loc.id} className="border-b border-border hover:bg-muted/30">
                                    <td className="px-4 py-3 text-sm">{loc.zone || '-'}</td>
                                    <td className="px-4 py-3 text-sm">{loc.aisle || '-'}</td>
                                    <td className="px-4 py-3 text-sm">{loc.shelf || '-'}</td>
                                    <td className="px-4 py-3 text-sm">{loc.bin || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    // ═══════════════════════════════════════════════════════════════
    // RENDER: MOVEMENTS TAB
    // ═══════════════════════════════════════════════════════════════

    const renderMovements = () => (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={() => fetchMovements(movementsPage)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded text-sm hover:bg-muted/50"
                >
                    <RefreshCw className={`h-4 w-4 ${movementsLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {movementsLoading ? (
                <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : movements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <ArrowUpDown className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No movements recorded</p>
                </div>
            ) : (
                <>
                    <div className="bg-card border border-border rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Item</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Qty</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movements.map((m) => (
                                    <tr key={m.id} className="border-b border-border hover:bg-muted/30">
                                        <td className="px-4 py-3 text-sm">
                                            {new Date(m.movementDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${MOVEMENT_TYPE_COLORS[m.movementType] || 'bg-gray-100'
                                                }`}>
                                                {m.movementType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{m.supplyItemName || '-'}</td>
                                        <td className="px-4 py-3 text-sm font-medium">
                                            <span className={m.movementType === 'OUT' ? 'text-red-600' : m.movementType === 'IN' ? 'text-green-600' : ''}>
                                                {m.movementType === 'OUT' ? '-' : m.movementType === 'IN' ? '+' : ''}{m.quantity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground truncate max-w-[150px]">
                                            {m.note || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {movementsTotalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setMovementsPage(Math.max(0, movementsPage - 1))}
                                disabled={movementsPage === 0}
                                className="px-3 py-1 border border-border rounded text-sm disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-muted-foreground">
                                Page {movementsPage + 1} of {movementsTotalPages}
                            </span>
                            <button
                                onClick={() => setMovementsPage(movementsPage + 1)}
                                disabled={movementsPage >= movementsTotalPages - 1}
                                className="px-3 py-1 border border-border rounded text-sm disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );

    // ═══════════════════════════════════════════════════════════════
    // MAIN RENDER
    // ═══════════════════════════════════════════════════════════════

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-background border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Warehouse className="h-5 w-5" />
                        {warehouse.name}
                    </h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-border px-6">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${activeTab === 'info'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Info
                    </button>
                    <button
                        onClick={() => setActiveTab('locations')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${activeTab === 'locations'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Locations ({locations.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('movements')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${activeTab === 'movements'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Movements
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-160px)]">
                    {error && (
                        <div className="flex items-start gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {activeTab === 'info' && renderInfo()}
                    {activeTab === 'locations' && renderLocations()}
                    {activeTab === 'movements' && renderMovements()}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end px-6 py-4 border-t border-border bg-muted/30">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted/50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
