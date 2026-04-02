import { Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
    onSaveAll: () => void;
    onResetToDefault: () => void;
}

export function PageHeader({ onSaveAll, onResetToDefault }: PageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="mb-1">System Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Configure platform settings, security, and integrations
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="outline" onClick={onResetToDefault}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Default
                </Button>
                <Button className="bg-[#2563EB] hover:bg-[#1E40AF]" onClick={onSaveAll}>
                    <Save className="w-4 h-4 mr-2" />
                    Save All
                </Button>
            </div>
        </div>
    );
}
