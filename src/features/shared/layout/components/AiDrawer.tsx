import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { AiDrawerProps } from '../types';

/**
 * AiDrawer Component
 * 
 * Side drawer for AI assistant chat interface.
 * Provides quick access to AI features with context chips.
 * 
 * Single Responsibility: AI assistant UI
 */
export function AiDrawer({ open, onOpenChange, portalColor }: AiDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[480px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" style={{ color: '#94D82D' }} />
            AI Assistant
          </SheetTitle>
          <SheetDescription>
            Get intelligent recommendations and insights for your farm
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Context Chips */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              Weather Forecast
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              Crop Recommendations
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              Pest Alerts
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              Expense Analysis
            </Badge>
          </div>

          {/* Chat Area */}
          <div className="border border-border rounded-lg p-4 bg-muted/30 min-h-[400px]">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#94D82D' }}
                >
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 bg-card p-3 rounded-lg">
                  <p className="text-sm">
                    Hello! I'm your AI farming assistant. I can help you with weather
                    forecasts, crop recommendations, pest management, and expense tracking.
                    What would you like to know?
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="relative">
            <Input
              placeholder="Ask me anything about your farm..."
              className="pr-12"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              style={{ backgroundColor: portalColor }}
            >
              Send
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

