import { Settings } from 'lucide-react';
import { PreferencesForm } from '@/features/shared/preferences';
import { useI18n } from '@/hooks/useI18n';

export function AdminPreferences() {
  const { t } = useI18n();
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="space-y-6 p-6 max-w-[900px] mx-auto">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">{t('preferences.title')}</h1>
        </div>

        <PreferencesForm />
      </div>
    </div>
  );
}
