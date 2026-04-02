import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/hooks/useI18n';
import { KeyRound, Lock, Shield } from 'lucide-react';
import { useState } from 'react';
import { ChangePasswordDialog } from './ChangePasswordDialog';

export function ChangePasswordSection() {
  const { t } = useI18n();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-2 text-base font-normal text-foreground">
          <Shield className="w-5 h-5" />
          {t('profile.security.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/30 border border-border rounded-2xl p-4 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Lock className="w-5 h-5 text-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-base text-foreground">{t('profile.security.passwordSet')}</p>
              <p className="text-sm text-muted-foreground">
                {t('profile.security.passwordRecommendation')}
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
            {t('profile.security.changePassword')}
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
