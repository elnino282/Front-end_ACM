import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateFarm as useCreateFarmEntity, FarmCreateRequestSchema, type FarmCreateRequest, type FarmDetailResponse } from '@/entities/farm';
import { toast } from 'sonner';

/**
 * Feature hook for creating a farm with form validation and toast handling
 */
export function useCreateFarm(onSuccessCallback?: (farm: FarmDetailResponse) => void) {
    const form = useForm<FarmCreateRequest>({
        resolver: zodResolver(FarmCreateRequestSchema),
        defaultValues: {
            name: '',
            provinceId: null,
            wardId: null,
            area: null,
        },
    });

    const mutation = useCreateFarmEntity({
        onSuccess: (data) => {
            console.log('[useCreateFarm] Success! Created farm:', data);
            toast.success('Farm created successfully');
            form.reset({
                name: '',
                provinceId: null,
                wardId: null,
                area: null,
            }, {
                keepErrors: false,
                keepDirty: false,
                keepIsSubmitted: false,
                keepTouched: false,
                keepIsValid: false,
                keepSubmitCount: false,
            });
            // Call the dialog close callback after form reset
            onSuccessCallback?.(data);
        },
        onError: (error: any) => {
            console.error('[useCreateFarm] Error occurred:', error);
            console.error('[useCreateFarm] Error response:', error?.response);
            console.error('[useCreateFarm] Error response data:', error?.response?.data);
            console.error('[useCreateFarm] Error status:', error?.response?.status);

            const errorData = error?.response?.data;
            const errorCode = errorData?.code || errorData?.result?.code;
            let message = 'Failed to create farm';

            // Handle specific error codes from backend
            if (errorCode === 'ERR_FARM_NAME_EXISTS') {
                message = `Farm name "${form.getValues('name')}" already exists. Please use a different name.`;
            } else if (errorCode === 'ERR_KEY_INVALID') {
                message = 'Invalid input. Please check your farm details.';
            } else if (errorCode === 'ERR_UNAUTHORIZED' || error?.response?.status === 401) {
                message = 'Your session has expired. Please sign in again.';
            } else if (errorCode === 'ERR_FORBIDDEN' || error?.response?.status === 403) {
                message = 'You do not have permission to create farms.';
            } else if (errorData?.message) {
                message = errorData.message;
            } else if (error?.message) {
                message = error.message;
            }

            toast.error(message, {
                description: errorCode ? `Error code: ${errorCode}` : undefined,
            });
        },
    });

    const handleSubmit = form.handleSubmit((data) => {
        console.log('[useCreateFarm] Submitting farm data:', data);
        mutation.mutate(data);
    });

    return {
        form,
        handleSubmit,
        isSubmitting: mutation.isPending,
        isSuccess: mutation.isSuccess,
        error: mutation.error,
    };
}



