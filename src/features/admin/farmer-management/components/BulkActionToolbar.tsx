import { CheckCircle, Lock, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';


interface BulkActionToolbarProps {
    selectedCount: number;
    totalCount: number;
    onSelectAll: () => void;
    onBulkAction: (action: string) => void;
}

export function BulkActionToolbar({
    selectedCount,
    totalCount,
    onSelectAll,
    onBulkAction,
}: BulkActionToolbarProps) {
    if (selectedCount === 0) return null;

    return (
        <Card className="border-[#2563EB] bg-blue-50/50">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={selectedCount === totalCount}
                            onCheckedChange={onSelectAll}
                        />
                        <span className="text-sm">
                            {selectedCount} farmer{selectedCount > 1 ? 's' : ''} selected
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onBulkAction('activate')}
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Activate
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onBulkAction('lock')}
                        >
                            <Lock className="w-4 h-4 mr-2" />
                            Lock
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onBulkAction('delete')}
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
