import { Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { SystemPreferences } from '../types';

interface SystemPreferencesProps {
    systemPrefs: SystemPreferences;
    onUpdate: (key: keyof SystemPreferences, value: string) => void;
    onSave: () => void;
    onApplyToAll: () => void;
}

export function SystemPreferencesSection({
    systemPrefs,
    onUpdate,
    onSave,
    onApplyToAll,
}: SystemPreferencesProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>System Preferences</CardTitle>
                <CardDescription>Configure global system settings and defaults</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={systemPrefs.language} onValueChange={(v: string) => onUpdate('language', v)}>
                            <SelectTrigger id="language">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="vi">Tiếng Việt</SelectItem>
                                <SelectItem value="zh">中文</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="timezone">Time Zone</Label>
                        <Select value={systemPrefs.timeZone} onValueChange={(v: string) => onUpdate('timeZone', v)}>
                            <SelectTrigger id="timezone">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="UTC+7">UTC+7 (Vietnam)</SelectItem>
                                <SelectItem value="UTC+8">UTC+8 (Singapore)</SelectItem>
                                <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="unitSystem">Unit System</Label>
                        <Select value={systemPrefs.unitSystem} onValueChange={(v: string) => onUpdate('unitSystem', v)}>
                            <SelectTrigger id="unitSystem">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="metric">Metric (kg, m)</SelectItem>
                                <SelectItem value="imperial">Imperial (lb, ft)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select value={systemPrefs.dateFormat} onValueChange={(v: string) => onUpdate('dateFormat', v)}>
                            <SelectTrigger id="dateFormat">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                                <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                                <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={systemPrefs.currency} onValueChange={(v: string) => onUpdate('currency', v)}>
                            <SelectTrigger id="currency">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="VND">VND (₫)</SelectItem>
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="EUR">EUR (€)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={systemPrefs.theme} onValueChange={(v: string) => onUpdate('theme', v)}>
                            <SelectTrigger id="theme">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="auto">Auto</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                    <Button className="bg-[#2563EB] hover:bg-[#1E40AF]" onClick={onSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                    <Button variant="outline" onClick={onApplyToAll}>
                        Apply to All Users
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
