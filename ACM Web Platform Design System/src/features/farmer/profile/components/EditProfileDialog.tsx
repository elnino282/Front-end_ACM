import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { AddressSelector, type AddressValue } from '@/shared/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useProfileUpdate } from '@/entities/user';
import { EditProfileFormSchema, type EditProfileFormData, type FarmerProfileData } from '../types';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData: FarmerProfileData;
}

/**
 * EditProfileDialog Component
 * 
 * Modal dialog for editing farmer profile information:
 * - Display name
 * - Email
 * - Phone
 * - Address (Province/Ward selection)
 * - Bio (optional)
 * 
 * Uses react-hook-form with zod validation
 */
export function EditProfileDialog({ open, onOpenChange, profileData }: EditProfileDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const wasOpenRef = useRef(false);

  const formValues = useMemo<EditProfileFormData>(() => ({
    fullName: profileData.displayName || '',
    phone: profileData.phone === 'Not available' ? '' : profileData.phone || '',
    provinceId: profileData.provinceId,
    wardId: profileData.wardId,
  }), [profileData]);
  
  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(EditProfileFormSchema),
    defaultValues: formValues,
  });

  const updateProfile = useProfileUpdate();
  const isSaving = form.formState.isSubmitting || updateProfile.isPending;
  const wardId = useWatch({ control: form.control, name: 'wardId' });

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      form.reset(formValues);
      setSubmitError(null);
    }

    if (!open && wasOpenRef.current) {
      setSubmitError(null);
    }

    wasOpenRef.current = open;
  }, [form, formValues, open]);

  const onSubmit = async (data: EditProfileFormData) => {
    setSubmitError(null);
    try {
      await updateProfile.mutateAsync({
        fullName: data.fullName,
        phone: data.phone || '',
        provinceId: data.provinceId,
        wardId: data.wardId,
      });
      
      toast.success('Profile updated successfully.');
      
      onOpenChange(false);
      form.reset(data);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : error instanceof Error
          ? error.message
          : undefined;
      setSubmitError(message || 'Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[520px] max-h-[85vh] overflow-y-auto space-y-4">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your details and save changes.
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="(+84) 909 123 456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Controller
              name="provinceId"
              control={form.control}
              render={({ field: provinceField, fieldState: provinceFieldState }) => {
                const wardError = form.formState.errors.wardId?.message;
                const combinedError = provinceFieldState.error?.message || wardError;

                return (
                  <AddressSelector
                    value={{
                      provinceId: provinceField.value ?? null,
                      wardId: wardId ?? null,
                    }}
                    onChange={(address: AddressValue) => {
                      const nextProvinceId = address.provinceId ?? undefined;
                      const nextWardId = address.wardId ?? undefined;
                      provinceField.onChange(nextProvinceId);
                      form.setValue('wardId', nextWardId);
                    }}
                    error={combinedError}
                    disabled={isSaving}
                    label="Location"
                    description="Select your province/city and ward."
                  />
                );
              }}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSaving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}



