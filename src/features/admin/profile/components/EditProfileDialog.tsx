import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useProfileUpdate } from "@/entities/user";
import {
  AddressSelector,
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  type AddressValue,
} from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  EditProfileFormSchema,
  type AdminProfileData,
  type EditProfileFormData,
} from "../types";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData: AdminProfileData;
}

/**
 * EditProfileDialog Component
 *
 * Modal dialog for editing admin profile information:
 * - Display name
 * - Phone
 * - Address (Province/Ward selection)
 *
 * Uses react-hook-form with zod validation
 */
export function EditProfileDialog({
  open,
  onOpenChange,
  profileData,
}: EditProfileDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const wasOpenRef = useRef(false);

  const formValues = useMemo<EditProfileFormData>(
    () => ({
      fullName: profileData.displayName || "",
      phone:
        profileData.phone === "Not available" ? "" : profileData.phone || "",
      provinceId: profileData.provinceId,
      wardId: profileData.wardId,
    }),
    [profileData],
  );

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(EditProfileFormSchema),
    defaultValues: formValues,
  });

  const updateProfile = useProfileUpdate();
  const isSaving = form.formState.isSubmitting || updateProfile.isPending;
  const wardId = useWatch({ control: form.control, name: "wardId" });

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
        phone: data.phone || "",
        provinceId: data.provinceId,
        wardId: data.wardId,
      });

      // Close the edit dialog and show success dialog
      onOpenChange(false);
      setShowSuccessDialog(true);
      form.reset(data);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : error instanceof Error
          ? error.message
          : undefined;
      setSubmitError(message || "Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
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
                render={({
                  field: provinceField,
                  fieldState: provinceFieldState,
                }) => {
                  const wardError = form.formState.errors.wardId?.message;
                  const combinedError =
                    provinceFieldState.error?.message || wardError;

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
                        form.setValue("wardId", nextWardId);
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

      {/* Success Dialog - shown after profile update */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <AlertDialogTitle>Profile Updated Successfully!</AlertDialogTitle>
              <AlertDialogDescription>
                Your profile information has been updated. Click OK to refresh
                and see the changes.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-center sm:justify-center">
            <AlertDialogAction
              onClick={() => {
                setShowSuccessDialog(false);
                window.location.reload();
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
