/**
 * CreatePlotInFarmDialog Component
 * 
 * Modal dialog for creating a new plot within a specific farm.
 * Includes form validation and status enum enforcement.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useCreatePlotInFarm } from '@/entities/plot';

// Form validation schema
const CreatePlotFormSchema = z.object({
    plotName: z.string().min(1, 'Plot name is required'),
    area: z.number().positive('Area must be greater than 0'),
    soilType: z.string().optional(),
    status: z.enum(['IN_USE', 'IDLE', 'AVAILABLE', 'FALLOW', 'MAINTENANCE'], {
        required_error: 'Status is required',
    }),
});

type CreatePlotFormData = z.infer<typeof CreatePlotFormSchema>;

interface CreatePlotInFarmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmId: number;
    farmName: string;
    onCreated?: () => void;
}

const SOIL_TYPES = [
    { value: 'LOAM', label: 'Loam' },
    { value: 'CLAY', label: 'Clay' },
    { value: 'SANDY', label: 'Sandy' },
    { value: 'SILT', label: 'Silt' },
    { value: 'PEAT', label: 'Peat' },
    { value: 'CHALK', label: 'Chalk' },
];

const PLOT_STATUSES = [
    { value: 'IN_USE', label: 'In Use' },
    { value: 'IDLE', label: 'Idle' },
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'FALLOW', label: 'Fallow / Resting' },
    { value: 'MAINTENANCE', label: 'Under Maintenance' },
];

export function CreatePlotInFarmDialog({
    open,
    onOpenChange,
    farmId,
    farmName,
    onCreated,
}: CreatePlotInFarmDialogProps) {
    const form = useForm<CreatePlotFormData>({
        resolver: zodResolver(CreatePlotFormSchema),
        defaultValues: {
            plotName: '',
            area: undefined,
            soilType: '',
            status: 'IN_USE',
        },
    });

    const createPlotMutation = useCreatePlotInFarm({
        onSuccess: () => {
            toast.success('Plot created successfully');
            form.reset();
            onOpenChange(false);
            onCreated?.();
        },
        onError: (error: any) => {
            const errorCode = error?.response?.data?.code;
            let message = 'Failed to create plot';

            if (errorCode === 'ERR_FARM_INACTIVE') {
                message = 'This farm is inactive. Activate it to create plots.';
            } else if (errorCode === 'ERR_PLOT_NAME_EXISTS') {
                message = 'A plot with this name already exists.';
            } else if (error?.message) {
                message = error.message;
            }

            toast.error(message);
        },
    });

    const handleSubmit = form.handleSubmit((data) => {
        createPlotMutation.mutate({
            farmId,
            data: {
                plotName: data.plotName,
                area: data.area,
                soilType: data.soilType || undefined,
                status: data.status,
            },
        });
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Plot</DialogTitle>
                    <DialogDescription>
                        Add a new plot to <strong>{farmName}</strong>
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Plot Name */}
                        <FormField
                            control={form.control}
                            name="plotName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plot Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., North Field A1"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Area */}
                        <FormField
                            control={form.control}
                            name="area"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Area (hectares) *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            placeholder="e.g., 2.5"
                                            {...field}
                                            onChange={(e) => {
                                                const value = parseFloat(e.target.value);
                                                field.onChange(isNaN(value) ? undefined : value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Soil Type */}
                        <FormField
                            control={form.control}
                            name="soilType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Soil Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select soil type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {SOIL_TYPES.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status *</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {PLOT_STATUSES.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={createPlotMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createPlotMutation.isPending}
                            >
                                {createPlotMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create Plot
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}



