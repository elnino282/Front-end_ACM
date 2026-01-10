// Log download configuration dialog

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { DownloadConfig, DateRange } from '../types';

interface DownloadLogsDialogProps {
    downloadLogsOpen: boolean;
    setDownloadLogsOpen: (open: boolean) => void;
    downloadConfig: DownloadConfig;
    setDownloadConfig: (config: DownloadConfig) => void;
    handleDownloadLogs: () => void;
}

export function DownloadLogsDialog({
    downloadLogsOpen,
    setDownloadLogsOpen,
    downloadConfig,
    setDownloadConfig,
    handleDownloadLogs,
}: DownloadLogsDialogProps) {
    return (
        <Dialog open={downloadLogsOpen} onOpenChange={setDownloadLogsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Download Logs
                    </DialogTitle>
                    <DialogDescription>
                        Configure and download system logs
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-3">
                        <Label>Log Types</Label>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="error-logs"
                                    checked={downloadConfig.types.error}
                                    onCheckedChange={(checked: boolean | "indeterminate") =>
                                        setDownloadConfig({
                                            ...downloadConfig,
                                            types: { ...downloadConfig.types, error: checked as boolean },
                                        })
                                    }
                                />
                                <Label htmlFor="error-logs" className="cursor-pointer">
                                    Error Logs
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="system-logs"
                                    checked={downloadConfig.types.system}
                                    onCheckedChange={(checked: boolean | "indeterminate") =>
                                        setDownloadConfig({
                                            ...downloadConfig,
                                            types: { ...downloadConfig.types, system: checked as boolean },
                                        })
                                    }
                                />
                                <Label htmlFor="system-logs" className="cursor-pointer">
                                    System Logs
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="auth-logs"
                                    checked={downloadConfig.types.auth}
                                    onCheckedChange={(checked: boolean | "indeterminate") =>
                                        setDownloadConfig({
                                            ...downloadConfig,
                                            types: { ...downloadConfig.types, auth: checked as boolean },
                                        })
                                    }
                                />
                                <Label htmlFor="auth-logs" className="cursor-pointer">
                                    Authentication Logs
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="ai-logs"
                                    checked={downloadConfig.types.ai}
                                    onCheckedChange={(checked: boolean | "indeterminate") =>
                                        setDownloadConfig({
                                            ...downloadConfig,
                                            types: { ...downloadConfig.types, ai: checked as boolean },
                                        })
                                    }
                                />
                                <Label htmlFor="ai-logs" className="cursor-pointer">
                                    AI Assistant Logs
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Date Range</Label>
                        <Select
                            value={downloadConfig.dateRange}
                            onValueChange={(v: string) =>
                                setDownloadConfig({ ...downloadConfig, dateRange: v as DateRange })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="24h">Last 24 hours</SelectItem>
                                <SelectItem value="7d">Last 7 days</SelectItem>
                                <SelectItem value="30d">Last 30 days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Size Cap</Label>
                        <Select
                            value={downloadConfig.sizeCap}
                            onValueChange={(v: string) => setDownloadConfig({ ...downloadConfig, sizeCap: v })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="50MB">50 MB</SelectItem>
                                <SelectItem value="100MB">100 MB</SelectItem>
                                <SelectItem value="500MB">500 MB</SelectItem>
                                <SelectItem value="unlimited">Unlimited</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setDownloadLogsOpen(false)}>
                        Cancel
                    </Button>
                    <Button className="bg-[#2563EB] hover:bg-[#1E40AF]" onClick={handleDownloadLogs}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
