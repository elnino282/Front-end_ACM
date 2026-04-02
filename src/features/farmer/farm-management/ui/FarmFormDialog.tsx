import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Button,
    Input,
    Label,
    AddressSelector,
    type AddressValue,
} from '@/shared/ui';
import { useCreateFarm } from '../hooks/useCreateFarm';
import { useUpdateFarm } from '../hooks/useUpdateFarm';
import type { FarmDetailResponse } from '@/entities/farm';
import { Controller, useWatch } from 'react-hook-form';

interface FarmFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'edit';
    farm?: FarmDetailResponse;
    farmId?: number;
    onCreated?: (farm: FarmDetailResponse) => void;
}

/**
 * Farm form dialog for create and edit operations
 */
export function FarmFormDialog({
    open,
    onOpenChange,
    mode,
    farm,
    farmId,
    onCreated,
}: FarmFormDialogProps) {
    const isCreate = mode === 'create';

    // Pass dialog close callback to create hook for immediate close after success
    const createHook = useCreateFarm((createdFarm) => {
        onCreated?.(createdFarm);
        onOpenChange(false);
    });
    const updateHook = useUpdateFarm(farmId ?? 0, farm);

    // Render separate forms to avoid type conflicts
    if (isCreate) {
        const { form, handleSubmit, isSubmitting } = createHook;

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create Farm</DialogTitle>
                        <DialogDescription>
                            Enter the details for your new farm.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Farm Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                {...form.register('name')}
                                placeholder="Enter farm name"
                                maxLength={255}
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        <Controller
                            name="provinceId"
                            control={form.control}
                            render={({ field: provinceField, fieldState: provinceFieldState }) => {
                                const wardId = useWatch({ control: form.control, name: 'wardId' });
                                const wardError = form.formState.errors.wardId?.message;
                                const combinedError = provinceFieldState.error?.message || wardError;

                                return (
                                    <AddressSelector
                                        value={{
                                            provinceId: provinceField.value,
                                            wardId: wardId ?? null,
                                        }}
                                        onChange={(address: AddressValue) => {
                                            provinceField.onChange(address.provinceId);
                                            form.setValue('wardId', address.wardId);
                                        }}
                                        error={combinedError}
                                        disabled={isSubmitting}
                                        label="Farm Address"
                                        description="Select the location of your farm"
                                        required
                                    />
                                );
                            }}
                        />

                        <div className="space-y-2">
                            <Label htmlFor="area">Area (hectares)</Label>
                            <Input
                                id="area"
                                type="number"
                                step="0.01"
                                {...form.register('area', {
                                    setValueAs: (v: string) => (v === '' || v === null ? null : Number(v)),
                                })}
                                placeholder="Enter area in hectares"
                            />
                            {form.formState.errors.area && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.area.message}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

    // Edit mode
    const { form, handleSubmit, isSubmitting } = updateHook;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Farm</DialogTitle>
                    <DialogDescription>
                        Update the farm information.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Farm Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            {...form.register('name')}
                            placeholder="Enter farm name"
                            maxLength={255}
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.name.message}
                            </p>
                        )}
                    </div>

                    <Controller
                        name="provinceId"
                        control={form.control}
                        render={({ field: provinceField, fieldState: provinceFieldState }) => {
                            const wardId = useWatch({ control: form.control, name: 'wardId' });
                            const wardError = form.formState.errors.wardId?.message;
                            const combinedError = provinceFieldState.error?.message || wardError;

                            return (
                                <AddressSelector
                                    value={{
                                        provinceId: provinceField.value,
                                        wardId: wardId ?? null,
                                    }}
                                    onChange={(address: AddressValue) => {
                                        provinceField.onChange(address.provinceId);
                                        form.setValue('wardId', address.wardId);
                                    }}
                                    error={combinedError}
                                    disabled={isSubmitting}
                                    label="Farm Address"
                                    description="Update the location of your farm"
                                />
                            );
                        }}
                    />

                    <div className="space-y-2">
                        <Label htmlFor="area">Area (hectares)</Label>
                        <Input
                            id="area"
                            type="number"
                            step="0.01"
                            {...form.register('area', {
                                setValueAs: (v: string) => (v === '' || v === null ? null : Number(v)),
                            })}
                            placeholder="Enter area in hectares"
                        />
                        {form.formState.errors.area && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.area.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}



