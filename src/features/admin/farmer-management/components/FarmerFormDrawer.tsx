import { User } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Farmer, FarmerFormData, FarmerRole, FarmerStatus } from '../types';

interface FarmerFormDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingFarmer: Farmer | null;
    formData: FarmerFormData;
    onFormDataChange: (data: FarmerFormData) => void;
    onSave: () => void;
}

export function FarmerFormDrawer({
    open,
    onOpenChange,
    editingFarmer,
    formData,
    onFormDataChange,
    onSave,
}: FarmerFormDrawerProps) {
    const updateField = (field: keyof FarmerFormData, value: string | boolean) => {
        onFormDataChange({ ...formData, [field]: value });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {editingFarmer ? 'Edit Farmer' : 'Add New Farmer'}
                    </SheetTitle>
                    <SheetDescription>
                        {editingFarmer ? 'Update farmer account information' : 'Create a new farmer account'}
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                            id="name"
                            placeholder="Enter full name"
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="farmer@example.com"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 234 567 8900"
                            value={formData.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role *</Label>
                            <Select value={formData.role} onValueChange={(v: string) => updateField('role', v as FarmerRole)}>
                                <SelectTrigger id="role">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="farmer">Farmer</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="owner">Owner</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Select value={formData.status} onValueChange={(v: string) => updateField('status', v as FarmerStatus)}>
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="locked">Locked</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {!editingFarmer && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <Label htmlFor="tempPassword">Temporary Password</Label>
                                <Input
                                    id="tempPassword"
                                    type="password"
                                    placeholder="Leave empty to auto-generate"
                                    value={formData.tempPassword}
                                    onChange={(e) => updateField('tempPassword', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    If left empty, a secure password will be generated automatically
                                </p>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                                <div className="flex-1">
                                    <Label htmlFor="sendEmail" className="cursor-pointer">
                                        Send welcome email
                                    </Label>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Email with login credentials will be sent to the farmer
                                    </p>
                                </div>
                                <Switch
                                    id="sendEmail"
                                    checked={formData.sendEmail}
                                    onCheckedChange={(checked: boolean) => updateField('sendEmail', checked)}
                                />
                            </div>
                        </>
                    )}

                    <Separator />

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-[#2563EB] hover:bg-[#1E40AF]"
                            onClick={onSave}
                        >
                            {editingFarmer ? 'Update Farmer' : 'Create Farmer'}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
