import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface FilterDrawerProps {
    filterOpen: boolean;
    setFilterOpen: (open: boolean) => void;
    cropFilter: string;
    setCropFilter: (value: string) => void;
    regionFilter: string;
    setRegionFilter: (value: string) => void;
    roleFilter: string;
    setRoleFilter: (value: string) => void;
    handleFilterClear: () => void;
    handleFilterApply: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
    filterOpen,
    setFilterOpen,
    cropFilter,
    setCropFilter,
    regionFilter,
    setRegionFilter,
    roleFilter,
    setRoleFilter,
    handleFilterClear,
    handleFilterApply,
}) => {
    return (
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Filter Reports</SheetTitle>
                    <SheetDescription>
                        Apply filters to customize your analytics view
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                        <Label>Crop Type</Label>
                        <Select value={cropFilter} onValueChange={setCropFilter}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Crops</SelectItem>
                                <SelectItem value="tomato">Tomato</SelectItem>
                                <SelectItem value="rice">Rice</SelectItem>
                                <SelectItem value="wheat">Wheat</SelectItem>
                                <SelectItem value="corn">Corn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Region</Label>
                        <Select value={regionFilter} onValueChange={setRegionFilter}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Regions</SelectItem>
                                <SelectItem value="north">North</SelectItem>
                                <SelectItem value="south">South</SelectItem>
                                <SelectItem value="east">East</SelectItem>
                                <SelectItem value="west">West</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>User Role</Label>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="farmer">Farmer</SelectItem>
                                <SelectItem value="buyer">Buyer</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Separator />
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleFilterClear}
                        >
                            Clear All
                        </Button>
                        <Button
                            className="flex-1 bg-[#2563EB] hover:bg-[#1E40AF]"
                            onClick={handleFilterApply}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
