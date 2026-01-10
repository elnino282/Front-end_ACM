import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KeyRound, Lock, Shield } from 'lucide-react';
import { ChangePasswordDialog } from './ChangePasswordDialog';

export function ChangePasswordSection() {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-2 text-base font-normal text-foreground">
          <Shield className="w-5 h-5" />
          Security & Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/30 border border-border rounded-2xl p-4 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Lock className="w-5 h-5 text-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-base text-foreground">Password Set</p>
              <p className="text-sm text-muted-foreground">
                Recommended to update password every 3-6 months.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPasswordDialogOpen(true)}
            className="border-border bg-muted text-foreground hover:bg-muted/50"
          >
            <KeyRound className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        </div>
      </CardContent>
      <ChangePasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
      />
    </Card>
  );
}
