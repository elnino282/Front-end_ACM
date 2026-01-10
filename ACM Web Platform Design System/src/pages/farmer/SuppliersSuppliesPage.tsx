import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import {
    useSuppliers,
    useSupplyItems,
    useSupplyLots,
    useAllSuppliers,
    useAllSupplyItems,
    useStockIn,
    type Supplier,
    type SupplyItem,
    type SupplyLot,
    type StockInRequest,
} from '@/entities/supplies';
import { useMyWarehouses, useLocations, type Warehouse, type StockLocation } from '@/entities/inventory';
import { Button, Card, CardContent, PageHeader } from '@/shared/ui';
import './SuppliersSuppliesPage.css';

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

type TabType = 'suppliers' | 'items' | 'lots';

export function SuppliersSuppliesPage() {
    const [activeTab, setActiveTab] = useState<TabType>('suppliers');
    const [showStockInModal, setShowStockInModal] = useState(false);

    // ===== Tab-specific state =====
    const [suppliersSearch, setSuppliersSearch] = useState('');
    const [itemsSearch, setItemsSearch] = useState('');
    const [itemsRestrictedFilter, setItemsRestrictedFilter] = useState<boolean | undefined>(undefined);
    const [lotsSearch, setLotsSearch] = useState('');
    const [lotsItemFilter, setLotsItemFilter] = useState<number | undefined>(undefined);
    const [lotsSupplierFilter, setLotsSupplierFilter] = useState<number | undefined>(undefined);
    const [page, setPage] = useState(0);

    // ===== Queries =====
    const { data: suppliersData, isLoading: loadingSuppliers } = useSuppliers({
        q: suppliersSearch || undefined,
        page,
        size: 20,
    });

    const { data: itemsData, isLoading: loadingItems } = useSupplyItems({
        q: itemsSearch || undefined,
        restricted: itemsRestrictedFilter,
        page,
        size: 20,
    });

    const { data: lotsData, isLoading: loadingLots } = useSupplyLots({
        itemId: lotsItemFilter,
        supplierId: lotsSupplierFilter,
        q: lotsSearch || undefined,
        page,
        size: 20,
    });

    // For dropdown filters
    const { data: allSuppliers } = useAllSuppliers();
    const { data: allItems } = useAllSupplyItems();

    const stockInMutation = useStockIn();

    // ===== Handlers =====
    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setPage(0);
    };

    const handleStockInSuccess = () => {
        setShowStockInModal(false);
    };

    const currentData = activeTab === 'suppliers' ? suppliersData
        : activeTab === 'items' ? itemsData
            : lotsData;

    // ===== RENDER =====
    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="supplies-page">
            <Card className="mb-6 border border-border rounded-xl shadow-sm">
                <CardContent className="px-6 py-4">
                    <PageHeader
                        className="mb-0"
                        icon={<Users className="w-8 h-8" />}
                        title="Suppliers & Supplies"
                        subtitle="Manage suppliers and supply items"
                        actions={
                            <Button onClick={() => setShowStockInModal(true)} variant="default">
                                <Plus className="w-4 h-4 mr-2" />
                                Stock IN
                            </Button>
                        }
                    />
                </CardContent>
            </Card>

            {/* ===== FILTERS ===== */}
            <div className="supplies-toolbar">
                <div className="supplies-filters flex flex-wrap items-center justify-start gap-4">
                    {activeTab === 'suppliers' && (
                        <input
                            type="text"
                            placeholder="Search suppliers by name..."
                            value={suppliersSearch}
                            onChange={(e) => { setSuppliersSearch(e.target.value); setPage(0); }}
                            className="search-input"
                        />
                    )}

                    {activeTab === 'items' && (
                        <>
                            <input
                                type="text"
                                placeholder="Search items by name..."
                                value={itemsSearch}
                                onChange={(e) => { setItemsSearch(e.target.value); setPage(0); }}
                                className="search-input"
                            />
                            <label className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={itemsRestrictedFilter === true}
                                    onChange={(e) => {
                                        setItemsRestrictedFilter(e.target.checked ? true : undefined);
                                        setPage(0);
                                    }}
                                />
                                Restricted only
                            </label>
                        </>
                    )}

                    {activeTab === 'lots' && (
                        <>
                            <input
                                type="text"
                                placeholder="Search by batch code..."
                                value={lotsSearch}
                                onChange={(e) => { setLotsSearch(e.target.value); setPage(0); }}
                                className="search-input"
                            />
                            <select
                                value={lotsItemFilter || ''}
                                onChange={(e) => { setLotsItemFilter(e.target.value ? Number(e.target.value) : undefined); setPage(0); }}
                                className="filter-select"
                            >
                                <option value="">All Items</option>
                                {allItems?.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                            <select
                                value={lotsSupplierFilter || ''}
                                onChange={(e) => { setLotsSupplierFilter(e.target.value ? Number(e.target.value) : undefined); setPage(0); }}
                                className="filter-select"
                            >
                                <option value="">All Suppliers</option>
                                {allSuppliers?.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </>
                    )}
                </div>
            </div>

            {/* ===== TABS ===== */}
            <div className="supplies-tabs">
                <button
                    className={`tab ${activeTab === 'suppliers' ? 'active' : ''}`}
                    onClick={() => handleTabChange('suppliers')}
                >
                    Suppliers
                </button>
                <button
                    className={`tab ${activeTab === 'items' ? 'active' : ''}`}
                    onClick={() => handleTabChange('items')}
                >
                    Supply Items
                </button>
                <button
                    className={`tab ${activeTab === 'lots' ? 'active' : ''}`}
                    onClick={() => handleTabChange('lots')}
                >
                    Lots
                </button>
            </div>

            {/* ===== CONTENT ===== */}
            <div className="supplies-content">
                {activeTab === 'suppliers' && (
                    <SuppliersTable
                        data={suppliersData?.items || []}
                        loading={loadingSuppliers}
                    />
                )}
                {activeTab === 'items' && (
                    <SupplyItemsTable
                        data={itemsData?.items || []}
                        loading={loadingItems}
                    />
                )}
                {activeTab === 'lots' && (
                    <SupplyLotsTable
                        data={lotsData?.items || []}
                        loading={loadingLots}
                    />
                )}

                {/* Pagination */}
                {currentData && (
                    <div className="pagination">
                        <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                            Previous
                        </button>
                        <span>Page {page + 1} of {currentData.totalPages || 1}</span>
                        <button
                            disabled={page >= (currentData.totalPages - 1)}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* ===== STOCK IN MODAL ===== */}
            {showStockInModal && (
                <StockInModal
                    onClose={() => setShowStockInModal(false)}
                    onSuccess={handleStockInSuccess}
                    onSubmit={stockInMutation.mutateAsync}
                    isPending={stockInMutation.isPending}
                />
            )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// SUPPLIERS TABLE
// ═══════════════════════════════════════════════════════════════

interface SuppliersTableProps {
    data: Supplier[];
    loading: boolean;
}

function SuppliersTable({ data, loading }: SuppliersTableProps) {
    if (loading) {
        return <div className="loading-state">Loading suppliers...</div>;
    }

    if (data.length === 0) {
        return <div className="empty-state">No suppliers found</div>;
    }

    return (
        <div className="table-container">
            <table className="supplies-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th className="numeric-cell">License No</th>
                        <th className="numeric-cell">Phone</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((supplier) => (
                        <tr key={supplier.id}>
                            <td className="name-cell">{supplier.name}</td>
                            <td className="numeric-cell">{supplier.licenseNo || '-'}</td>
                            <td className="numeric-cell">{supplier.contactPhone || '-'}</td>
                            <td>{supplier.contactEmail || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// SUPPLY ITEMS TABLE
// ═══════════════════════════════════════════════════════════════

interface SupplyItemsTableProps {
    data: SupplyItem[];
    loading: boolean;
}

function SupplyItemsTable({ data, loading }: SupplyItemsTableProps) {
    if (loading) {
        return <div className="loading-state">Loading supply items...</div>;
    }

    if (data.length === 0) {
        return <div className="empty-state">No supply items found</div>;
    }

    return (
        <div className="table-container">
            <table className="supplies-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Active Ingredient</th>
                        <th>Unit</th>
                        <th>Restricted</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td className="name-cell">{item.name}</td>
                            <td>{item.activeIngredient || '-'}</td>
                            <td>{item.unit || '-'}</td>
                            <td>
                                {item.restrictedFlag ? (
                                    <span className="badge badge-restricted">Restricted</span>
                                ) : (
                                    <span className="badge badge-normal">Normal</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// SUPPLY LOTS TABLE
// ═══════════════════════════════════════════════════════════════

interface SupplyLotsTableProps {
    data: SupplyLot[];
    loading: boolean;
}

function SupplyLotsTable({ data, loading }: SupplyLotsTableProps) {
    if (loading) {
        return <div className="loading-state">Loading supply lots...</div>;
    }

    if (data.length === 0) {
        return <div className="empty-state">No supply lots found</div>;
    }

    const formatDate = (dateStr: string | null | undefined): string => {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('vi-VN');
        } catch {
            return dateStr;
        }
    };

    const isExpiringSoon = (dateStr: string | null | undefined): boolean => {
        if (!dateStr) return false;
        try {
            const expiry = new Date(dateStr);
            const today = new Date();
            const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays > 0 && diffDays <= 30;
        } catch {
            return false;
        }
    };

    return (
        <div className="table-container">
            <table className="supplies-table">
                <thead>
                    <tr>
                        <th>Batch Code</th>
                        <th>Item</th>
                        <th>Supplier</th>
                        <th className="numeric-cell">Expiry Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((lot) => (
                        <tr key={lot.id}>
                            <td className="batch-cell">{lot.batchCode || '-'}</td>
                            <td>
                                {lot.supplyItemName || '-'}
                                {lot.restrictedFlag && (
                                    <span className="badge badge-restricted ml-2">R</span>
                                )}
                            </td>
                            <td>{lot.supplierName || '-'}</td>
                            <td className={`numeric-cell${isExpiringSoon(lot.expiryDate) ? ' expiring-soon' : ''}`}>
                                {formatDate(lot.expiryDate)}
                                {isExpiringSoon(lot.expiryDate) && (
                                    <span className="expiry-warning">⚠️ Soon</span>
                                )}
                            </td>
                            <td>
                                <span className={`status-badge ${lot.status?.toLowerCase() || ''}`}>
                                    {lot.status || '-'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// STOCK IN MODAL (Stepper)
// ═══════════════════════════════════════════════════════════════

interface StockInModalProps {
    onClose: () => void;
    onSuccess: () => void;
    onSubmit: (data: StockInRequest) => Promise<unknown>;
    isPending: boolean;
}

function StockInModal({ onClose, onSuccess, onSubmit, isPending }: StockInModalProps) {
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');

    // Step 1: Warehouse & Location
    const [warehouseId, setWarehouseId] = useState<number | null>(null);
    const [locationId, setLocationId] = useState<number | null>(null);

    // Step 2: Supplier & Item
    const [supplierId, setSupplierId] = useState<number | null>(null);
    const [supplyItemId, setSupplyItemId] = useState<number | null>(null);
    const [confirmRestricted, setConfirmRestricted] = useState(false);

    // Step 3: Batch Info
    const [batchCode, setBatchCode] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [quantity, setQuantity] = useState<number>(0);
    const [note, setNote] = useState('');
    const [confirmExpiry, setConfirmExpiry] = useState(false);

    // ===== Queries =====
    const { data: warehouses } = useMyWarehouses();
    const { data: locations } = useLocations(warehouseId ?? undefined);
    const { data: suppliers } = useAllSuppliers();
    const { data: items } = useAllSupplyItems();

    const selectedItem = items?.find(i => i.id === supplyItemId);
    const isRestricted = selectedItem?.restrictedFlag === true;

    const isExpiryPast = expiryDate && new Date(expiryDate) <= new Date();

    // ===== Navigation =====
    const canGoToStep2 = warehouseId !== null;
    const canGoToStep3 = supplierId !== null && supplyItemId !== null && (!isRestricted || confirmRestricted);
    const canSubmit = quantity > 0 && (!isExpiryPast || confirmExpiry);

    const handleNext = () => {
        setError('');
        if (step === 1 && canGoToStep2) {
            setStep(2);
        } else if (step === 2 && canGoToStep3) {
            setStep(3);
        }
    };

    const handleBack = () => {
        setError('');
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        if (!warehouseId || !supplierId || !supplyItemId || quantity <= 0) {
            setError('Please fill all required fields');
            return;
        }

        if (isRestricted && !confirmRestricted) {
            setError('Please confirm handling of restricted supplies');
            return;
        }

        if (isExpiryPast && !confirmExpiry) {
            setError('Please confirm the past expiry date');
            return;
        }

        try {
            await onSubmit({
                warehouseId,
                locationId: locationId || undefined,
                supplierId,
                supplyItemId,
                batchCode: batchCode || undefined,
                expiryDate: expiryDate || undefined,
                quantity,
                confirmRestricted: confirmRestricted || undefined,
                note: note || undefined,
            });
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to record Stock IN');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content stock-in-modal" onClick={e => e.stopPropagation()}>
                <h2>Stock IN</h2>

                {/* Stepper */}
                <div className="stepper">
                    <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Warehouse</span>
                    </div>
                    <div className="step-line" />
                    <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Supplier & Item</span>
                    </div>
                    <div className="step-line" />
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Batch Info</span>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {/* Step 1: Warehouse & Location */}
                {step === 1 && (
                    <div className="step-content">
                        <div className="form-group">
                            <label>Warehouse *</label>
                            <select
                                value={warehouseId || ''}
                                onChange={(e) => {
                                    setWarehouseId(e.target.value ? Number(e.target.value) : null);
                                    setLocationId(null);
                                }}
                            >
                                <option value="">Select warehouse...</option>
                                {warehouses?.map((w: Warehouse) => (
                                    <option key={w.id} value={w.id}>
                                        {w.name} {w.farmName ? `(${w.farmName})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Location (Optional)</label>
                            <select
                                value={locationId || ''}
                                onChange={(e) => setLocationId(e.target.value ? Number(e.target.value) : null)}
                                disabled={!warehouseId}
                            >
                                <option value="">Any location</option>
                                {locations?.map((loc: StockLocation) => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.label || `Location ${loc.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Step 2: Supplier & Item */}
                {step === 2 && (
                    <div className="step-content">
                        <div className="form-group">
                            <label>Supplier *</label>
                            <select
                                value={supplierId || ''}
                                onChange={(e) => setSupplierId(e.target.value ? Number(e.target.value) : null)}
                            >
                                <option value="">Select supplier...</option>
                                {suppliers?.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Supply Item *</label>
                            <select
                                value={supplyItemId || ''}
                                onChange={(e) => {
                                    setSupplyItemId(e.target.value ? Number(e.target.value) : null);
                                    setConfirmRestricted(false);
                                }}
                            >
                                <option value="">Select item...</option>
                                {items?.map((i) => (
                                    <option key={i.id} value={i.id}>
                                        {i.name} {i.unit ? `(${i.unit})` : ''} {i.restrictedFlag ? '⚠️ RESTRICTED' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {isRestricted && (
                            <div className="warning-banner">
                                <strong>⚠️ Restricted Supply</strong>
                                <p>This item requires special handling authorization.</p>
                                <label className="confirm-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={confirmRestricted}
                                        onChange={(e) => setConfirmRestricted(e.target.checked)}
                                    />
                                    I confirm I'm authorized to handle restricted supplies
                                </label>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Batch Info */}
                {step === 3 && (
                    <div className="step-content">
                        <div className="form-group">
                            <label>Batch Code</label>
                            <input
                                type="text"
                                value={batchCode}
                                onChange={(e) => setBatchCode(e.target.value)}
                                placeholder="e.g., NPK-2025-01"
                            />
                        </div>

                        <div className="form-group">
                            <label>Expiry Date</label>
                            <input
                                type="date"
                                value={expiryDate}
                                onChange={(e) => {
                                    setExpiryDate(e.target.value);
                                    setConfirmExpiry(false);
                                }}
                            />
                            {isExpiryPast && (
                                <div className="warning-banner small">
                                    <strong>⚠️ Past expiry date</strong>
                                    <label className="confirm-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={confirmExpiry}
                                            onChange={(e) => setConfirmExpiry(e.target.checked)}
                                        />
                                        I confirm the expiry date is correct
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Quantity * {selectedItem?.unit ? `(${selectedItem.unit})` : ''}</label>
                            <input
                                type="number"
                                min={0}
                                step="0.001"
                                value={quantity || ''}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                placeholder="Enter quantity"
                            />
                        </div>

                        <div className="form-group">
                            <label>Note (Optional)</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Additional notes..."
                            />
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose} disabled={isPending}>
                        Cancel
                    </button>
                    <div className="action-group">
                        {step > 1 && (
                            <button className="btn-secondary" onClick={handleBack} disabled={isPending}>
                                Back
                            </button>
                        )}
                        {step < 3 ? (
                            <button
                                className="btn-primary"
                                onClick={handleNext}
                                disabled={step === 1 ? !canGoToStep2 : !canGoToStep3}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                className="btn-primary"
                                onClick={handleSubmit}
                                disabled={isPending || !canSubmit}
                            >
                                {isPending ? 'Processing...' : 'Confirm Stock IN'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SuppliersSuppliesPage;
