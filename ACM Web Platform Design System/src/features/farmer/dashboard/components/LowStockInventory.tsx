import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/hooks/useI18n";
import { Package, Plus } from "lucide-react";
import { InventoryItem } from "../types";

interface LowStockInventoryProps {
  inventory: InventoryItem[];
}

/**
 * Low Stock Inventory Component
 *
 * Displays inventory items that are below minimum stock levels with:
 * - Item count badge
 * - Current vs minimum stock comparison
 * - Progress bar visualization
 * - Quick action button to order supplies
 */
export function LowStockInventory({ inventory }: LowStockInventoryProps) {
  const { t } = useI18n();

  return (
    <Card className="border-border rounded-2xl shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('dashboard.lowStock.title')}</CardTitle>
            <CardDescription>{t('dashboard.lowStock.subtitle')}</CardDescription>
          </div>
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            {inventory.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {inventory.map((item) => {
            const percentage = (item.current / item.minimum) * 100;
            return (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    <span className="numeric text-destructive">
                      {item.current}
                    </span>
                    /{item.minimum} {item.unit}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
          <Button
            variant="outline"
            className="w-full mt-2 rounded-lg border-primary text-primary hover:bg-primary/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('dashboard.lowStock.orderButton')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}



