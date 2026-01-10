import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, X, AlertCircle, Search, CheckCircle } from 'lucide-react';
import { useVietnameseAddress } from '@/shared/ui/address-selector';
import {
    adminFarmApi,
    adminUsersApi,
    type AdminFarmDetail,
    type AdminFarmUpdateRequest,
} from '@/services/api.admin';

interface EditFarmModalProps {
    farmId: number;
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface FormData {
    name: string;
    area: string;
    ownerId: number | null;
    active: boolean;
}

export function EditFarmModal({ farmId, open, onClose, onSuccess }: EditFarmModalProps) {
    const queryClient = useQueryClient();

    // Form state
    const [formData, setFormData] = useState<FormData>({
        name: '',
        area: '',
        ownerId: null,
        active: true,
    });
    const [error, setError] = useState<string | null>(null);
    const [ownerSearch, setOwnerSearch] = useState('');
    const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);

    // Fetch farm detail
    const { data: farm, isLoading: farmLoading } = useQuery({
        queryKey: ['admin', 'farms', farmId],
        queryFn: () => adminFarmApi.getById(farmId),
        enabled: open && farmId > 0,
    });

    // CRITICAL: Province/Ward cascade with ward reset on province change
    const {
        provinces,
        wards,
        selectedProvince,
        selectedWard,
        isLoadingProvinces,
        isLoadingWards,
        handleProvinceChange, // This automatically resets ward to null!
        handleWardChange,
    } = useVietnameseAddress({
        initialWardCode: farm?.wardId,
    });

    // Fetch FARMER users for owner selection
    const { data: farmersData, isLoading: farmersLoading } = useQuery({
        queryKey: ['admin', 'farmers', ownerSearch],
        queryFn: () => adminUsersApi.list({
            keyword: ownerSearch || undefined,
            page: 0,
            size: 50
        }),
        enabled: open,
    });

    // Filter only FARMER role users
    const farmers = farmersData?.items?.filter(u =>
        u.roles?.includes('FARMER')
    ) ?? [];

    // Selected owner display
    const selectedOwner = farmers.find(f => Number(f.id) === formData.ownerId);

    // Initialize form when farm data loads
    useEffect(() => {
        if (farm) {
            setFormData({
                name: farm.name || '',
                area: farm.area?.toString() || '',
                ownerId: farm.ownerId ?? null,
                active: farm.active ?? true,
            });
            setError(null);
        }
    }, [farm]);

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (data: AdminFarmUpdateRequest) => adminFarmApi.update(farmId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'farms'] });
            onSuccess?.();
            onClose();
        },
        onError: (err: any) => {
            // Handle specific error codes
            const message = err.response?.data?.message || err.message || 'Failed to update farm';
            if (message.includes('FARMER role') || err.response?.data?.code === 'ERR_INVALID_FARM_OWNER_ROLE') {
                setError('Selected owner must have FARMER role');
            } else if (message.includes('Ward does not belong') || err.response?.data?.code === 'ERR_WARD_NOT_IN_PROVINCE') {
                setError('Ward does not belong to selected province');
            } else {
                setError(message);
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.name.trim()) {
            setError('Farm name is required');
            return;
        }
        if (!selectedProvince) {
            setError('Province is required');
            return;
        }
        if (!selectedWard) {
            setError('Ward is required');
            return;
        }
        if (!formData.area || parseFloat(formData.area) <= 0) {
            setError('Area must be greater than 0');
            return;
        }
        if (!formData.ownerId) {
            setError('Owner is required');
            return;
        }

        updateMutation.mutate({
            name: formData.name.trim(),
            provinceId: selectedProvince,
            wardId: selectedWard,
            area: parseFloat(formData.area),
            ownerId: formData.ownerId,
            active: formData.active,
        });
    };

    const handleSelectOwner = (userId: number) => {
        setFormData(prev => ({ ...prev, ownerId: userId }));
        setShowOwnerDropdown(false);
        setOwnerSearch('');
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-background border border-border rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-semibold">Edit Farm</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {farmLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Error Alert */}
                            {error && (
                                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
                                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Farm Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                                    placeholder="Enter farm name"
                                />
                            </div>

                            {/* Province - REQUIRED */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Province *</label>
                                <select
                                    value={selectedProvince ?? ''}
                                    onChange={(e) => {
                                        const val = e.target.value ? Number(e.target.value) : null;
                                        // CRITICAL: This resets ward to null automatically
                                        handleProvinceChange(val);
                                    }}
                                    disabled={isLoadingProvinces}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                                >
                                    <option value="">Select province...</option>
                                    {provinces.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Ward - REQUIRED, disabled until province selected */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Ward *</label>
                                <select
                                    value={selectedWard ?? ''}
                                    onChange={(e) => handleWardChange(e.target.value ? Number(e.target.value) : null)}
                                    disabled={!selectedProvince || isLoadingWards}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm disabled:opacity-50"
                                >
                                    <option value="">
                                        {isLoadingWards ? 'Loading...' : !selectedProvince ? 'Select province first' : 'Select ward...'}
                                    </option>
                                    {wards.map((w) => (
                                        <option key={w.id} value={w.id}>{w.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Area */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Area (ha) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.area}
                                    onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                                    placeholder="Enter area in hectares"
                                />
                            </div>

                            {/* Owner Selector - FARMER only */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Owner (FARMER only) *</label>
                                <div className="relative">
                                    <div
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm cursor-pointer flex items-center justify-between"
                                        onClick={() => setShowOwnerDropdown(!showOwnerDropdown)}
                                    >
                                        {selectedOwner ? (
                                            <span className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                {selectedOwner.fullName || selectedOwner.username}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">Select owner...</span>
                                        )}
                                    </div>

                                    {showOwnerDropdown && (
                                        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg">
                                            {/* Search input */}
                                            <div className="p-2 border-b border-border">
                                                <div className="relative">
                                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <input
                                                        type="text"
                                                        value={ownerSearch}
                                                        onChange={(e) => setOwnerSearch(e.target.value)}
                                                        placeholder="Search farmers..."
                                                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-border rounded"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>

                                            {/* Farmers list */}
                                            <div className="max-h-48 overflow-y-auto">
                                                {farmersLoading ? (
                                                    <div className="p-3 text-center text-sm text-muted-foreground">
                                                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                                    </div>
                                                ) : farmers.length === 0 ? (
                                                    <div className="p-3 text-center text-sm text-muted-foreground">
                                                        No farmers found
                                                    </div>
                                                ) : (
                                                    farmers.map((farmer) => (
                                                        <button
                                                            key={farmer.id}
                                                            type="button"
                                                            onClick={() => handleSelectOwner(Number(farmer.id))}
                                                            className={`w-full px-3 py-2 text-left text-sm hover:bg-muted/50 flex items-center justify-between ${Number(farmer.id) === formData.ownerId ? 'bg-primary/10' : ''
                                                                }`}
                                                        >
                                                            <div>
                                                                <div className="font-medium">{farmer.fullName || farmer.username}</div>
                                                                <div className="text-xs text-muted-foreground">@{farmer.username}</div>
                                                            </div>
                                                            {Number(farmer.id) === formData.ownerId && (
                                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                            )}
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={formData.active}
                                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                    className="h-4 w-4 rounded border-border"
                                />
                                <label htmlFor="active" className="text-sm">Active</label>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/30">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={updateMutation.isPending}
                        className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={updateMutation.isPending || farmLoading}
                        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2"
                    >
                        {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
