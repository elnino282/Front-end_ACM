import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { CreatePlotRequest } from '../types';

interface CreatePlotModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreatePlotRequest) => Promise<void>;
}

export function CreatePlotModal({ open, onOpenChange, onSubmit }: CreatePlotModalProps) {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CreatePlotRequest>({
        defaultValues: {
            status: 'IDLE',
            area: 0
        }
    });

    const handleFormSubmit = async (data: CreatePlotRequest) => {
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Plot</DialogTitle>
                    <DialogDescription>
                        Divide your farm into plots for better management.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="plotName">Plot Name <span className="text-red-500">*</span></Label>
                        <Input 
                            id="plotName" 
                            {...register('plotName', { required: 'Plot name is required' })} 
                        />
                        {errors.plotName && <p className="text-sm text-red-500">{errors.plotName.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="area">Area (ha) <span className="text-red-500">*</span></Label>
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
                        <Label htmlFor="soilType">Soil Type</Label>
                        <Input 
                            id="soilType" 
                            {...register('soilType')} 
                            placeholder="e.g., Red Basalt, Sandy Loam"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Initial Status</Label>
                        <Select onValueChange={(val: 'IDLE' | 'IN_USE') => setValue('status', val)} defaultValue="IDLE">
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="IDLE">Idle (Ready)</SelectItem>
                                <SelectItem value="IN_USE">In Use</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Plot'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}



