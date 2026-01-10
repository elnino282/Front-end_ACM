import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type UnderConstructionProps = {
  title: string;
};

export function UnderConstruction({ title }: UnderConstructionProps) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-[#F5F6F8] flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-[#6B7280]" />
          </div>
          <h3 className="mb-2 font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">
            This view is under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
