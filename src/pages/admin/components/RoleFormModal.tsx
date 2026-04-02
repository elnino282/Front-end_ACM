import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/hooks/useI18n";
import {
  adminRoleApi,
  type Role,
  type RoleCreateRequest,
  type RoleUpdateRequest,
} from "@/services/api.admin";
import { Edit, FileText, Loader2, Plus, Save, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface RoleFormData {
  code: string;
  name: string;
  description: string;
}

const initialFormData: RoleFormData = {
  code: "",
  name: "",
  description: "",
};

interface RoleFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null; // null for create, object for edit
  onSuccess: () => void;
}

export function RoleFormModal({
  isOpen,
  onOpenChange,
  role,
  onSuccess,
}: RoleFormModalProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<RoleFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RoleFormData, string>>
  >({});

  const isEditMode = !!role;

  // Populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (role) {
        // Edit mode: populate form with role data
        setFormData({
          code: role.code || "",
          name: role.name || "",
          description: role.description || "",
        });
      } else {
        // Create mode: reset form
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, role]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RoleFormData, string>> = {};

    if (!isEditMode && (!formData.code || formData.code.trim().length === 0)) {
      newErrors.code = "Role code is required";
    }

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = "Role name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && role) {
        // Update existing role
        const updateData: RoleUpdateRequest = {
          name: formData.name,
          description: formData.description || undefined,
        };
        await adminRoleApi.update(Number(role.id), updateData);
        toast.success("Role updated successfully");
      } else {
        // Create new role
        const createData: RoleCreateRequest = {
          code: formData.code.toUpperCase().replace(/\s+/g, "_"),
          name: formData.name,
          description: formData.description || undefined,
        };
        await adminRoleApi.create(createData);
        toast.success("Role created successfully");
      }
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      console.error("Failed to save role:", err);
      const errorCode = err?.response?.data?.code;
      if (errorCode === "ROLE_CODE_EXISTS") {
        setErrors({ code: "Role code already exists" });
      } else {
        toast.error(
          isEditMode ? "Failed to update role" : "Failed to create role",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {isEditMode ? (
              <>
                <Edit className="w-5 h-5 text-primary" />
                Edit Role
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-green-600" />
                Add New Role
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEditMode
              ? "Update role information below. Code cannot be changed."
              : "Fill in the details to create a new role."}{" "}
            Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Code (only for create mode) */}
          <div className="space-y-2">
            <Label htmlFor="code">
              Code <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="code"
                placeholder={isEditMode ? "" : "e.g., ADMIN, FARMER, MANAGER"}
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                className={`pl-10 uppercase ${errors.code ? "border-destructive" : ""}`}
                disabled={isEditMode}
              />
            </div>
            {errors.code && (
              <p className="text-xs text-destructive">{errors.code}</p>
            )}
            {isEditMode && (
              <p className="text-xs text-muted-foreground">
                Code cannot be changed after creation
              </p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter role display name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter role description (optional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            <X className="w-4 h-4 mr-2" />
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isEditMode ? "Update" : "Create"} Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
