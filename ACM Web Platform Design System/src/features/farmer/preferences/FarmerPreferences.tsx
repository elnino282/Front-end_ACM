import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChangePasswordSection } from '@/features/farmer/account/components/ChangePasswordSection';
import { Settings, DollarSign, Scale } from 'lucide-react';

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// SCHEMAS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•



// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CONSTANTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const CURRENCY_OPTIONS = [
  { value: 'VND', label: 'VND - Vietnamese Dong', symbol: '₫' },
  { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
  { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
];

const WEIGHT_OPTIONS = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'lb', label: 'Pound (lb)' },
  { value: 'tan', label: 'Tấn (metric ton)' },
];

const STORAGE_KEYS = {
  currency: 'acm_currency_unit',
  weight: 'acm_weight_unit',
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// COMPONENT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

/**
 * FarmerPreferences Component
 * 
 * Settings page for farmer portal including:
 * - Change password
 * - Currency unit selection
 * - Weight unit selection
 */
export function FarmerPreferences() {
  const [currencyUnit, setCurrencyUnit] = useState('VND');
  const [weightUnit, setWeightUnit] = useState('kg');

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem(STORAGE_KEYS.currency);
    const savedWeight = localStorage.getItem(STORAGE_KEYS.weight);
    if (savedCurrency) setCurrencyUnit(savedCurrency);
    if (savedWeight) setWeightUnit(savedWeight);
  }, []);

  const handleCurrencyChange = (value: string) => {
    setCurrencyUnit(value);
    localStorage.setItem(STORAGE_KEYS.currency, value);
    toast.success('Currency unit updated', {
      description: `Currency set to ${CURRENCY_OPTIONS.find(c => c.value === value)?.label}`,
    });
  };

  const handleWeightChange = (value: string) => {
    setWeightUnit(value);
    localStorage.setItem(STORAGE_KEYS.weight, value);
    toast.success('Weight unit updated', {
      description: `Weight unit set to ${WEIGHT_OPTIONS.find(w => w.value === value)?.label}`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="space-y-6 p-6 max-w-[900px] mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Preferences</h1>
        </div>

      <ChangePasswordSection />

      <Separator />

      {/* Unit Settings Card */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
            <Scale className="w-5 h-5" />
            Unit Settings
          </CardTitle>
          <CardDescription>
            Configure the units used throughout the system for displaying values.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Currency Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Currency Unit
              </Label>
              <Select value={currencyUnit} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span className="font-mono">{option.symbol}</span>
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Currency used for expenses, revenues, and financial reports.
              </p>
            </div>

            {/* Weight Unit */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-primary" />
                Weight Unit
              </Label>
              <Select value={weightUnit} onValueChange={handleWeightChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select weight unit" />
                </SelectTrigger>
                <SelectContent>
                  {WEIGHT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Weight unit used for harvests, yields, and inventory.
              </p>
            </div>
          </div>

          {/* Current Settings Display */}
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-sm font-medium text-foreground mb-2">Current Settings</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                Currency: <strong className="text-foreground">{currencyUnit}</strong>
              </span>
              <span>VND</span>
              <span>
                Weight: <strong className="text-foreground">{weightUnit}</strong>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

