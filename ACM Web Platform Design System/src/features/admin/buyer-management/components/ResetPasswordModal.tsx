import { Key, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ResetPasswordModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ResetPasswordModal({ open, onOpenChange }: ResetPasswordModalProps) {
    const handleSendEmailLink = () => {
        toast.success('Reset link sent', {
            description: "Password reset link has been sent to buyer's email.",
        });
        onOpenChange(false);
    };

    const handleGenerateTempPassword = () => {
        const tempPassword = 'Temp' + Math.random().toString(36).slice(-8);
        navigator.clipboard.writeText(tempPassword);
        toast.success('Temporary password generated', {
            description: `Password "${tempPassword}" copied to clipboard.`,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Reset Password
                    </DialogTitle>
                    <DialogDescription>Choose how to reset the buyer's password</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4"
                        onClick={handleSendEmailLink}
                    >
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="text-left">
                                <div className="font-medium text-sm">Send Reset Link via Email</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Buyer will receive an email with instructions to reset their password
                                </div>
                            </div>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4"
                        onClick={handleGenerateTempPassword}
                    >
                        <div className="flex items-start gap-3">
                            <Key className="w-5 h-5 text-cyan-600 mt-0.5" />
                            <div className="text-left">
                                <div className="font-medium text-sm">Generate Temporary Password</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Create a temporary password and copy it to clipboard
                                </div>
                            </div>
                        </div>
                    </Button>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
