import { useState, useEffect } from 'react';
import { X, Save, Edit, Plus, User, Mail, Phone, Shield, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { adminUsersApi, adminRoleApi, type AdminUser, type Role } from '@/services/api.admin';

export interface UserFormData {
    username: string;
    password: string;
    email: string;
    fullName: string;
    phone: string;
    roles: string[];
    status: string;
}

const initialFormData: UserFormData = {
    username: '',
    password: '',
    email: '',
    fullName: '',
    phone: '',
    roles: ['FARMER'],
    status: 'ACTIVE',
};

interface UserFormModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    user: AdminUser | null; // null for create, object for edit
    onSuccess: () => void;
}

export function UserFormModal({
    isOpen,
    onOpenChange,
    user,
    onSuccess,
}: UserFormModalProps) {
    const [formData, setFormData] = useState<UserFormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

    const isEditMode = !!user;

    // Fetch roles when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchRoles();
            if (user) {
                // Edit mode: populate form with user data
                setFormData({
                    username: user.username || '',
                    password: '', // Never populate password
                    email: user.email || '',
                    fullName: user.fullName || '',
                    phone: user.phone || '',
                    roles: user.roles || ['FARMER'],
                    status: user.status || 'ACTIVE',
                });
            } else {
                // Create mode: reset form
                setFormData(initialFormData);
            }
            setErrors({});
        }
    }, [isOpen, user]);

    const fetchRoles = async () => {
        setLoadingRoles(true);
        try {
            const rolesList = await adminRoleApi.list();
            setRoles(rolesList || []);
        } catch (err) {
            console.error('Failed to load roles:', err);
        } finally {
            setLoadingRoles(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof UserFormData, string>> = {};

        if (!formData.username || formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!isEditMode && (!formData.password || formData.password.length < 8)) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (formData.roles.length === 0) {
            newErrors.roles = 'At least one role is required';
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
            if (isEditMode && user) {
                // Update existing user
                await adminUsersApi.update(Number(user.id), {
                    username: formData.username,
                    email: formData.email || undefined,
                    fullName: formData.fullName || undefined,
                    phone: formData.phone || undefined,
                    roles: formData.roles,
                    status: formData.status,
                });
                toast.success('User updated successfully');
            } else {
                // Create new user
                await adminUsersApi.create({
                    username: formData.username,
                    password: formData.password,
                    email: formData.email || undefined,
                    fullName: formData.fullName || undefined,
                    phone: formData.phone || undefined,
                    roles: formData.roles,
                });
                toast.success('User created successfully');
            }
            onSuccess();
            onOpenChange(false);
        } catch (err: any) {
            console.error('Failed to save user:', err);
            const errorCode = err?.response?.data?.code;
            if (errorCode === 'ERR_USERNAME_ALREADY_EXISTS') {
                setErrors({ username: 'Username is already taken' });
            } else if (errorCode === 'ERR_EMAIL_ALREADY_EXISTS') {
                setErrors({ email: 'Email is already in use' });
            } else {
                toast.error(isEditMode ? 'Failed to update user' : 'Failed to create user');
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

    const handleRoleToggle = (roleCode: string) => {
        setFormData(prev => {
            const hasRole = prev.roles.includes(roleCode);
            const newRoles = hasRole
                ? prev.roles.filter(r => r !== roleCode)
                : [...prev.roles, roleCode];
            return { ...prev, roles: newRoles };
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        {isEditMode ? (
                            <>
                                <Edit className="w-5 h-5 text-primary" />
                                Edit User
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5 text-green-600" />
                                Add New User
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {isEditMode
                            ? 'Update user information below.'
                            : 'Fill in the details to create a new user account.'}
                        {' '}Fields marked with * are required.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Username */}
                    <div className="space-y-2">
                        <Label htmlFor="username">
                            Username <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="username"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className={`pl-10 ${errors.username ? 'border-destructive' : ''}`}
                            />
                        </div>
                        {errors.username && (
                            <p className="text-xs text-destructive">{errors.username}</p>
                        )}
                    </div>

                    {/* Password (only for create mode) */}
                    {!isEditMode && (
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password (min 8 characters)"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className={errors.password ? 'border-destructive' : ''}
                            />
                            {errors.password && (
                                <p className="text-xs text-destructive">{errors.password}</p>
                            )}
                        </div>
                    )}

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-destructive">{errors.email}</p>
                        )}
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            placeholder="Enter full name"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="phone"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Roles */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Roles <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30">
                            {loadingRoles ? (
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading roles...
                                </div>
                            ) : roles.length === 0 ? (
                                <span className="text-muted-foreground text-sm">No roles available</span>
                            ) : (
                                roles.map((role) => {
                                    const isSelected = formData.roles.includes(role.code || '');
                                    return (
                                        <button
                                            key={role.id || role.code}
                                            type="button"
                                            onClick={() => handleRoleToggle(role.code || '')}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isSelected
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-background border border-border hover:bg-muted'
                                                }`}
                                        >
                                            {role.name || role.code}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                        {errors.roles && (
                            <p className="text-xs text-destructive">{errors.roles}</p>
                        )}
                    </div>

                    {/* Status (only for edit mode) */}
                    {isEditMode && (
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            Active
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="INACTIVE">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-500" />
                                            Inactive
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="LOCKED">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500" />
                                            Locked
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
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
                        {isEditMode ? 'Update' : 'Create'} User
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
