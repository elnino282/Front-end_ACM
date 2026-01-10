// Filter drawer for advanced log filtering

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { LogLevel } from '../types';

interface FilterSheetProps {
    filterOpen: boolean;
    setFilterOpen: (open: boolean) => void;
    serviceFilter: string;
    setServiceFilter: (service: string) => void;
    logLevelFilter: LogLevel;
    setLogLevelFilter: (level: LogLevel) => void;
    userFilter: string;
    setUserFilter: (user: string) => void;
    clearFilters: () => void;
}

export function FilterSheet({
    filterOpen,
    setFilterOpen,
    serviceFilter,
    setServiceFilter,
    logLevelFilter,
    setLogLevelFilter,
    userFilter,
    setUserFilter,
    clearFilters,
}: FilterSheetProps) {
    return (
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Filter Logs</SheetTitle>
                    <SheetDescription>
                        Apply filters to refine log results
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                        <Label>Service</Label>
                        <Select value={serviceFilter} onValueChange={setServiceFilter}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Services</SelectItem>
                                <SelectItem value="database">Database</SelectItem>
                                <SelectItem value="api-gateway">API Gateway</SelectItem>
                                <SelectItem value="auth-service">Auth Service</SelectItem>
                                <SelectItem value="file-storage">File Storage</SelectItem>
                                <SelectItem value="notification">Notification</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Log Level</Label>
                        <Select value={logLevelFilter} onValueChange={(v: string) => setLogLevelFilter(v as LogLevel)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="info">Info</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                                <SelectItem value="error">Error</SelectItem>
                                <SelectItem value="security">Security</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>User</Label>
                        <Select value={userFilter} onValueChange={setUserFilter}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                                <SelectItem value="john.doe@farm.com">john.doe@farm.com</SelectItem>
                                <SelectItem value="sarah.miller@farm.com">sarah.miller@farm.com</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Separator />
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={clearFilters}
                        >
                            Clear All
                        </Button>
                        <Button
                            className="flex-1 bg-[#2563EB] hover:bg-[#1E40AF]"
                            onClick={() => setFilterOpen(false)}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
