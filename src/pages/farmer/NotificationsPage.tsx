import { useFarmerNotifications, useMarkNotificationRead } from '@/entities/notification';
import { useI18n } from '@/hooks/useI18n';
import { usePreferences } from '@/shared/contexts';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, PageContainer, PageHeader } from '@/shared/ui';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const formatDateTime = (value: string | null | undefined, locale: string) => {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString(locale);
  } catch {
    return value;
  }
};

export function NotificationsPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { preferences } = usePreferences();
  const notificationsQuery = useFarmerNotifications();
  const markReadMutation = useMarkNotificationRead();

  const notifications = notificationsQuery.data ?? [];
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.readAt).length,
    [notifications]
  );

  const handleOpenNotification = (notification: typeof notifications[number]) => {
    if (!notification.readAt) {
      markReadMutation.mutate(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <PageContainer>
      <Card className="mb-6 border border-border rounded-xl shadow-sm">
        <CardContent className="px-6 py-4">
          <PageHeader
            className="mb-0"
            icon={<Bell className="w-8 h-8" />}
            title={t('notifications.title')}
            subtitle={t('notifications.subtitle')}
          />
        </CardContent>
      </Card>

      <Card className="border border-border rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{t('common.inbox', 'Inbox')}</CardTitle>
          <Badge variant={unreadCount ? 'destructive' : 'secondary'}>
            {unreadCount} {t('notifications.filters.unread', 'unread').toLowerCase()}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationsQuery.isLoading && (
            <div className="text-sm text-muted-foreground">{t('common.loading', 'Loading')}...</div>
          )}

          {notificationsQuery.isError && (
            <div className="text-sm text-destructive">
              {notificationsQuery.error?.message || t('errors.loadFailed', 'Failed to load')}
            </div>
          )}

          {!notificationsQuery.isLoading && !notificationsQuery.isError && notifications.length === 0 && (
            <div className="text-sm text-muted-foreground">{t('notifications.noNotifications')}</div>
          )}

          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-4 transition ${
                notification.readAt ? 'bg-muted/30' : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{notification.title || t('common.notification', 'Notification')}</p>
                    {!notification.readAt && <Badge variant="outline">{t('notifications.filters.unread')}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.message || t('common.noMessage', 'No message provided.')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(notification.createdAt, preferences.locale)}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenNotification(notification)}
                  >
                    {t('common.view', 'View')}
                  </Button>
                  {!notification.readAt && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markReadMutation.mutate(notification.id)}
                      disabled={markReadMutation.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      {t('common.markRead', 'Mark read')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
