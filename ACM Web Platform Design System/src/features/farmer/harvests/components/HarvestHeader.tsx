import { Plus, Wheat } from "lucide-react";
import { PageHeader } from "@/shared/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HarvestHeaderProps {
    onAddBatch: () => void;
}

export function HarvestHeader({
    onAddBatch,
}: HarvestHeaderProps) {
    return (
        <Card className="mb-6 border border-border rounded-xl shadow-sm">
            <CardContent className="px-6 py-4">
                <PageHeader
                    className="mb-0"
                    icon={<Wheat className="w-8 h-8" />}
                    title="Harvest Management"
                    subtitle="Track and manage harvest batches, quality control, and sales"
                    actions={
                        <Button
                            onClick={onAddBatch}
                            variant="default"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Batch
                        </Button>
                    }
                />
            </CardContent>
        </Card>
    );
}



