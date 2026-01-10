import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface SeedUsageModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SeedUsageModal({ open, onOpenChange }: SeedUsageModalProps) {
    const handleSubmit = () => {
        toast.success('Seed usage recorded');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Seed Usage Record</DialogTitle>
                    <DialogDescription>Log seed purchase or usage for your crops</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="seedUsageDate">Date</Label>
                            <Input id="seedUsageDate" type="date" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="seedTypeUsage">Seed Type</Label>
                            <Input id="seedTypeUsage" placeholder="e.g., Tomato - Beefsteak" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="seedBatch">Batch Number</Label>
                            <Input id="seedBatch" placeholder="e.g., TV-2025-001" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="seedQuantity">Quantity</Label>
                            <Input id="seedQuantity" placeholder="e.g., 500g" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="seedCost">Cost</Label>
                            <Input id="seedCost" placeholder="e.g., $45.00" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="seedNotes">Notes</Label>
                        <Textarea id="seedNotes" placeholder="Additional information..." rows={3} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90" onClick={handleSubmit}>
                        Add Record
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}




