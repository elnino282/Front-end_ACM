import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface AddRoleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateRole: () => void;
}

export function AddRoleModal({ open, onOpenChange, onCreateRole }: AddRoleModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Role</DialogTitle>
                    <DialogDescription>Create a new user role with custom permissions</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="roleName">Role Name</Label>
                        <Input id="roleName" placeholder="e.g., Auditor, Manager" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="roleDescription">Description</Label>
                        <Input id="roleDescription" placeholder="Brief description of this role" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button className="bg-[#2563EB] hover:bg-[#1E40AF]" onClick={onCreateRole}>
                        Create Role
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
