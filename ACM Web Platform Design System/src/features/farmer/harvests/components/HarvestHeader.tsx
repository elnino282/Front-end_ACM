import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/hooks/useI18n";
import { PageHeader } from "@/shared/ui";
import { Plus, Wheat } from "lucide-react";

interface HarvestHeaderProps {
    onAddBatch: () => void;
    isEmbedded?: boolean;
}

export function HarvestHeader({
    onAddBatch,
    isEmbedded,
}: HarvestHeaderProps) {
    const { t } = useI18n();

    if (isEmbedded) {
        return (
            <div className="flex justify-end mb-4">
                <Button onClick={onAddBatch} variant="default" className="bg-primary hover:bg-primary/90 text-white shadow-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('harvests.createButton')}
                </Button>
            </div>
        );
    }

    return (
        <Card className="mb-6 border border-border rounded-xl shadow-sm">
            <CardContent className="px-6 py-4">
                <PageHeader
                    className="mb-0"
                    icon={<Wheat className="w-8 h-8" />}
                    title={t('harvests.title')}
                    subtitle={t('harvests.subtitle')}
                    actions={
                        <Button
                            onClick={onAddBatch}
                            variant="default"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {t('harvests.createButton')}
                        </Button>
                    }
                />
            </CardContent>
        </Card>
    );
}



