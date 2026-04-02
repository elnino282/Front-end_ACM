import { CheckCircle, Ban, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface BulkActionToolbarProps {
    selectedCount: number;
    onSelectAll: () => void;
    isAllSelected: boolean;
    onActivate: () => void;
    onSuspend: () => void;
    onDelete: () => void;
}

export function BulkActionToolbar({
    selectedCount,
    onSelectAll,
    isAllSelected,
    onActivate,
    onSuspend,
    onDelete,
}: BulkActionToolbarProps) {
    if (selectedCount === 0) return null;

    return (
        <Card className="border-[#2563EB] bg-blue-50/50">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} />
                        <span className="text-sm">
                            {selectedCount} buyer{selectedCount > 1 ? 's' : ''} selected
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={onActivate}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Activate
                        </Button>
                        <Button variant="outline" size="sm" onClick={onSuspend}>
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onDelete}
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
