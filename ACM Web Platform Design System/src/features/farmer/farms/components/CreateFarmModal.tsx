import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';
import { AddressSelector } from '@/shared/ui/address-selector';
import { CreateFarmRequest } from '../types';

interface CreateFarmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateFarmRequest) => Promise<void>;
}

export function CreateFarmModal({ open, onOpenChange, onSubmit }: CreateFarmModalProps) {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<CreateFarmRequest>({
        defaultValues: {
            farmName: '',
            active: true,
            area: 0
        }
    });

    // We track address separately because AddressSelector uses a complex object
    const [addressError, setAddressError] = useState<string>('');

    const handleFormSubmit = async (data: CreateFarmRequest) => {
        setAddressError('');
        if (!data.provinceId || !data.wardId) {
            setAddressError('Please select a valid location');
            return;
        }
        
        try {
            await onSubmit(data);
            reset();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Farm</DialogTitle>
                    <DialogDescription>
                        Register a new farm location to start managing plots and seasons.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="farmName">Farm Name <span className="text-red-500">*</span></Label>
                        <Input 
                            id="farmName" 
                            {...register('farmName', { required: 'Farm name is required' })} 
                        />
                        {errors.farmName && <p className="text-sm text-red-500">{errors.farmName.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="area">Total Area (ha) <span className="text-red-500">*</span></Label>
                        <Input 
                            id="area" 
                            type="number" 
                            step="0.01" 
                            {...register('area', { 
                                required: 'Area is required',
                                min: { value: 0.01, message: 'Area must be greater than 0' },
                                valueAsNumber: true
                            })} 
                        />
                        {errors.area && <p className="text-sm text-red-500">{errors.area.message}</p>}
                    </div>

                    <div className="space-y-2">
                         <AddressSelector
                            required
                            label="Location"
                            error={addressError}
                            onChange={(val) => {
                                setValue('provinceId', val.provinceId || 0);
                                setValue('wardId', val.wardId || 0);
                                setAddressError('');
                            }}
                         />
                    </div>

                    <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                        <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                        <Switch 
                            id="active" 
                            checked={watch('active')} 
                            onCheckedChange={(checked) => setValue('active', checked)} 
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Farm'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}



