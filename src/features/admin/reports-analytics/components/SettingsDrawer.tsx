import { Settings, Check } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface SettingsDrawerProps {
    settingsOpen: boolean;
    setSettingsOpen: (open: boolean) => void;
    handleSettingsSave: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
    settingsOpen,
    setSettingsOpen,
    handleSettingsSave,
}) => {
    return (
        <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Report Settings
                    </SheetTitle>
                    <SheetDescription>
                        Configure automated report generation and delivery
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                    <div>
                        <h4 className="mb-4">Weekly Summary Email</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                                <div className="flex-1">
                                    <Label htmlFor="enableEmail" className="cursor-pointer">
                                        Enable Weekly Reports
                                    </Label>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Send automated weekly summary emails
                                    </p>
                                </div>
                                <Switch id="enableEmail" defaultChecked />
                            </div>

                            <div className="space-y-2">
                                <Label>Report Types</Label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="userActivity" defaultChecked className="rounded" />
                                        <Label htmlFor="userActivity" className="text-sm cursor-pointer">
                                            User Activity Report
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="systemHealth" defaultChecked className="rounded" />
                                        <Label htmlFor="systemHealth" className="text-sm cursor-pointer">
                                            System Health Report
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="financials" className="rounded" />
                                        <Label htmlFor="financials" className="text-sm cursor-pointer">
                                            Financial Summary
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="alerts" defaultChecked className="rounded" />
                                        <Label htmlFor="alerts" className="text-sm cursor-pointer">
                                            Critical Alerts Summary
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="recipients">Email Recipients</Label>
                                <Input
                                    id="recipients"
                                    type="email"
                                    placeholder="admin@example.com, team@example.com"
                                    defaultValue="admin@acm-platform.com"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Separate multiple emails with commas
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Send Schedule</Label>
                                <Select defaultValue="monday">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monday">Every Monday at 9:00 AM</SelectItem>
                                        <SelectItem value="friday">Every Friday at 5:00 PM</SelectItem>
                                        <SelectItem value="sunday">Every Sunday at 8:00 AM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setSettingsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-[#2563EB] hover:bg-[#1E40AF]"
                            onClick={handleSettingsSave}
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Save Settings
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
