import { Key, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ResetPasswordModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onResetPassword: (method: 'email' | 'temp') => void;
}

export function ResetPasswordModal({
    open,
    onOpenChange,
    onResetPassword,
}: ResetPasswordModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Reset Password
                    </DialogTitle>
                    <DialogDescription>
                        Choose how to reset the farmer's password
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4"
                        onClick={() => onResetPassword('email')}
                    >
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="text-left">
                                <div className="font-medium text-sm">Send Reset Link via Email</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Farmer will receive an email with instructions to reset their password
                                </div>
                            </div>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4"
                        onClick={() => onResetPassword('temp')}
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
