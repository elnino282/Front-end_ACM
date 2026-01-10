import { Bell, CheckSquare, Sun, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationsDrawerProps, Notification } from '../types';

/**
 * NotificationsDrawer Component
 * 
 * Side drawer for displaying notifications with filtering and actions.
 * Supports marking individual or all notifications as read.
 * 
 * Single Responsibility: Notifications display and management UI
 */
export function NotificationsDrawer({
  open,
  onOpenChange,
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationsDrawerProps) {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="w-4 h-4 text-[#F4C542]" />;
      case 'weather':
        return <Sun className="w-4 h-4 text-[#4A90E2]" />;
      case 'inventory':
        return <Package className="w-4 h-4 text-[#E74C3C]" />;
      case 'incident':
        return <Bell className="w-4 h-4 text-[#F4C542]" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </span>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
                Mark all read
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            Alerts for tasks, weather, inventory, and incidents
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-2">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => onMarkAsRead(notification.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  notification.read
                    ? 'bg-muted/30 border-border'
                    : 'bg-card border-border shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      notification.read ? 'bg-muted' : 'bg-muted/50'
                    }`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

