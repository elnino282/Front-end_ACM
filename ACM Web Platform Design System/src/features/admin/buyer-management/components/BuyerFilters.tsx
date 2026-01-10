import { Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { BuyerRole, KYCStatus, AccountStatus } from '../types';

interface BuyerFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    filterOpen: boolean;
    onFilterOpenChange: (open: boolean) => void;
    roleFilter: BuyerRole | 'all';
    onRoleFilterChange: (value: BuyerRole | 'all') => void;
    kycFilter: KYCStatus | 'all';
    onKycFilterChange: (value: KYCStatus | 'all') => void;
    statusFilter: AccountStatus | 'all';
    onStatusFilterChange: (value: AccountStatus | 'all') => void;
}

export function BuyerFilters({
    searchQuery,
    onSearchChange,
    filterOpen,
    onFilterOpenChange,
    roleFilter,
    onRoleFilterChange,
    kycFilter,
    onKycFilterChange,
    statusFilter,
    onStatusFilterChange,
}: BuyerFiltersProps) {
    const activeFilterCount =
        (roleFilter !== 'all' ? 1 : 0) +
        (kycFilter !== 'all' ? 1 : 0) +
        (statusFilter !== 'all' ? 1 : 0);

    const clearAllFilters = () => {
        onRoleFilterChange('all');
        onKycFilterChange('all');
        onStatusFilterChange('all');
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by company name, contact, or tax ID..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Sheet open={filterOpen} onOpenChange={onFilterOpenChange}>
                        <Button
                            variant="outline"
                            onClick={() => onFilterOpenChange(true)}
                            className="w-full md:w-auto"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                            {activeFilterCount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {activeFilterCount}
                                </Badge>
                            )}
                        </Button>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Filter Buyers</SheetTitle>
                                <SheetDescription>Apply filters to refine your buyer list</SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 space-y-6">
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Select value={roleFilter} onValueChange={(v) => onRoleFilterChange(v as any)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Roles</SelectItem>
                                            <SelectItem value="buyer">Buyer</SelectItem>
                                            <SelectItem value="enterprise">Enterprise</SelectItem>
                                            <SelectItem value="distributor">Distributor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>KYC Status</Label>
                                    <Select value={kycFilter} onValueChange={(v) => onKycFilterChange(v as any)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All KYC Statuses</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="verified">Verified</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Account Status</Label>
                                    <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as any)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="suspended">Suspended</SelectItem>
                                            <SelectItem value="closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Separator />
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1" onClick={clearAllFilters}>
                                        Clear All
                                    </Button>
                                    <Button
                                        className="flex-1 bg-[#2563EB] hover:bg-[#1E40AF]"
                                        onClick={() => onFilterOpenChange(false)}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </CardContent>
        </Card>
    );
}
