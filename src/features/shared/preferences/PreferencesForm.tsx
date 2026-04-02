import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { CurrencyCode, WeightUnit } from '@/entities/preferences';
import { useUpdatePreferences } from '@/entities/preferences';
import { useI18n } from '@/hooks/useI18n';
import { changeLanguage, type SupportedLocale } from '@/i18n';
import { usePreferences } from '@/shared/contexts';
import { DollarSign, Globe, Scale } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const CURRENCY_OPTIONS = [
    { value: 'VND', labelKey: 'currency.VND', symbol: 'VND' },
    { value: 'USD', labelKey: 'currency.USD', symbol: 'USD' },
];

const WEIGHT_OPTIONS = [
    { value: 'KG', labelKey: 'weight.KG' },
    { value: 'G', labelKey: 'weight.G' },
    { value: 'TON', labelKey: 'weight.TON' },
];

const LOCALE_OPTIONS = [
    { value: 'vi-VN', labelKey: 'preferences.unitSettings.localeVietnamese' },
    { value: 'en-US', labelKey: 'preferences.unitSettings.localeEnglish' },
];

export function PreferencesForm() {
    const { t } = useI18n();
    const { preferences, isLoading } = usePreferences();
    const updatePreferences = useUpdatePreferences();

    const [currency, setCurrency] = useState(preferences.currency);
    const [weightUnit, setWeightUnit] = useState(preferences.weightUnit);
    const [locale, setLocale] = useState(preferences.locale);

    useEffect(() => {
        setCurrency(preferences.currency);
        setWeightUnit(preferences.weightUnit);
        setLocale(preferences.locale);
    }, [preferences.currency, preferences.weightUnit, preferences.locale]);

    const isDirty = useMemo(() => {
        return currency !== preferences.currency
            || weightUnit !== preferences.weightUnit
            || locale !== preferences.locale;
    }, [currency, weightUnit, locale, preferences]);

    const handleSave = async () => {
        updatePreferences.mutate(
            { currency, weightUnit, locale },
            {
                onSuccess: async () => {
                    // Sync i18n with the new locale
                    await changeLanguage(locale as SupportedLocale);
                    
                    toast.success(t('toast.preferencesUpdated'), {
                        description: t('toast.preferencesUpdatedDesc'),
                    });
                },
                onError: (error) => {
                    toast.error(t('toast.preferencesError'), {
                        description: error.message,
                    });
                },
            }
        );
    };

    return (
        <Card className="border-border shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                    <Scale className="w-5 h-5" />
                    {t('preferences.unitSettings.title')}
                </CardTitle>
                <CardDescription>
                    {t('preferences.unitSettings.description')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            {t('preferences.unitSettings.currencyUnit')}
                        </Label>
                        <Select
                            value={currency}
                            onValueChange={(value) => setCurrency(value as CurrencyCode)}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('preferences.unitSettings.selectCurrency')} />
                            </SelectTrigger>
                            <SelectContent>
                                {CURRENCY_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        <span className="flex items-center gap-2">
                                            <span className="font-mono">{option.symbol}</span>
                                            {t(option.labelKey)}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {t('preferences.unitSettings.currencyDescription')}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Scale className="w-4 h-4 text-primary" />
                            {t('preferences.unitSettings.weightUnit')}
                        </Label>
                        <Select
                            value={weightUnit}
                            onValueChange={(value) => setWeightUnit(value as WeightUnit)}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('preferences.unitSettings.selectWeight')} />
                            </SelectTrigger>
                            <SelectContent>
                                {WEIGHT_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {t(option.labelKey)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {t('preferences.unitSettings.weightDescription')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary" />
                            {t('preferences.unitSettings.locale')}
                        </Label>
                        <Select
                            value={locale}
                            onValueChange={setLocale}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('preferences.unitSettings.selectLocale')} />
                            </SelectTrigger>
                            <SelectContent>
                                {LOCALE_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {t(option.labelKey)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {t('preferences.unitSettings.localeDescription')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={!isDirty || updatePreferences.isPending}
                    >
                        {updatePreferences.isPending ? t('preferences.saving') : t('preferences.save')}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
