import { Save, TestTube2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { NotificationSetting } from '../types';

interface NotificationSettingsProps {
    settings: NotificationSetting[];
    onSettingUpdate: (id: string, field: keyof NotificationSetting, value: boolean) => void;
    onTestNotification: (topic: string) => void;
}

export function NotificationSettingsSection({
    settings,
    onSettingUpdate,
    onTestNotification,
}: NotificationSettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure notification channels and preferences</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Topic</TableHead>
                                <TableHead className="text-center">Email</TableHead>
                                <TableHead className="text-center">In-App</TableHead>
                                <TableHead className="text-center">SMS</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {settings.map((setting) => (
                                <TableRow key={setting.id}>
                                    <TableCell className="font-medium">{setting.topic}</TableCell>
                                    <TableCell className="text-center">
                                        <Switch
                                            checked={setting.email}
                                            onCheckedChange={(checked: boolean) => onSettingUpdate(setting.id, 'email', checked)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Switch
                                            checked={setting.inApp}
                                            onCheckedChange={(checked: boolean) => onSettingUpdate(setting.id, 'inApp', checked)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Switch
                                            checked={setting.sms}
                                            onCheckedChange={(checked: boolean) => onSettingUpdate(setting.id, 'sms', checked)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="outline" size="sm" onClick={() => onTestNotification(setting.topic)}>
                                            <TestTube2 className="w-4 h-4 mr-2" />
                                            Test
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex gap-2 mt-6">
                    <Button className="bg-[#2563EB] hover:bg-[#1E40AF]">
                        <Save className="w-4 h-4 mr-2" />
                        Save Notification Settings
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
