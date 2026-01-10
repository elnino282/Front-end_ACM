import { UserPlus, ShoppingBag, FileCheck, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

/**
 * QuickActions Component
 * 
 * Provides quick access buttons for common administrative tasks.
 * Each button has an icon and descriptive label.
 */
export const QuickActions = ({ onAction }: QuickActionsProps) => {
  const actions = [
    {
      id: 'add-farmer',
      icon: UserPlus,
      label: 'Add Farmer',
      color: 'text-blue-600',
    },
    {
      id: 'add-buyer',
      icon: ShoppingBag,
      label: 'Add Buyer',
      color: 'text-cyan-600',
    },
    {
      id: 'review-contracts',
      icon: FileCheck,
      label: 'Review Contracts',
      color: 'text-slate-600',
    },
    {
      id: 'generate-report',
      icon: BarChart3,
      label: 'Generate Report',
      color: 'text-emerald-600',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                onClick={() => onAction(action.id)}
              >
                <Icon className={`w-6 h-6 ${action.color}`} />
                <span className="text-sm">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

