import { Save, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { SecuritySettings as SecuritySettingsType, Device } from '../types';

interface SecuritySettingsProps {
    settings: SecuritySettingsType;
    devices: Device[];
    onSettingUpdate: (key: keyof SecuritySettingsType, value: boolean) => void;
    onSignOutDevice: (deviceId: string) => void;
    onSignOutAll: () => void;
    getDeviceIcon: (type: Device['type']) => React.ComponentType<{ className?: string }>;
}

export function SecuritySettingsSection({
    settings,
    devices,
    onSettingUpdate,
    onSignOutDevice,
    onSignOutAll,
    getDeviceIcon,
}: SecuritySettingsProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage authentication and access policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                        <div className="flex-1">
                            <Label htmlFor="enable2FA" className="cursor-pointer">
                                Enable Two-Factor Authentication
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">Require 2FA for all admin users</p>
                        </div>
                        <Switch
                            id="enable2FA"
                            checked={settings.enable2FA}
                            onCheckedChange={(checked: boolean) => onSettingUpdate('enable2FA', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                        <div className="flex-1">
                            <Label htmlFor="sessionTimeout" className="cursor-pointer">
                                Automatic Session Timeout
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">Sign out inactive users after 30 minutes</p>
                        </div>
                        <Switch
                            id="sessionTimeout"
                            checked={settings.sessionTimeout}
                            onCheckedChange={(checked: boolean) => onSettingUpdate('sessionTimeout', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                        <div className="flex-1">
                            <Label htmlFor="passwordPolicy" className="cursor-pointer">
                                Strict Password Policy
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                Require 12+ chars, uppercase, numbers, and symbols
                            </p>
                        </div>
                        <Switch
                            id="passwordPolicy"
                            checked={settings.passwordPolicy}
                            onCheckedChange={(checked: boolean) => onSettingUpdate('passwordPolicy', checked)}
                        />
                    </div>

                    <Separator />

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4>Active Devices</h4>
                            <Button variant="outline" size="sm" onClick={onSignOutAll}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out All Devices
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {devices.map((device) => {
                                const DeviceIcon = getDeviceIcon(device.type);
                                return (
                                    <div key={device.id} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                            <DeviceIcon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-sm font-medium">{device.browser}</p>
                                                {device.current && (
                                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                                                        Current
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-1">{device.location}</p>
                                            <p className="text-xs text-muted-foreground">{device.lastActive}</p>
                                        </div>
                                        {!device.current && (
                                            <Button variant="ghost" size="sm" onClick={() => onSignOutDevice(device.id)}>
                                                <LogOut className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button className="bg-[#2563EB] hover:bg-[#1E40AF]">
                            <Save className="w-4 h-4 mr-2" />
                            Save Security Settings
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
