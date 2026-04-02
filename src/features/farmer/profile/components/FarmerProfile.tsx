import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useFarms } from '@/entities/farm';
import { usePlots } from '@/entities/plot';
import { useSeasons } from '@/entities/season';
import { useProfileMe } from '@/entities/user';
import { useAuth } from '@/features/auth';
import { useI18n } from '@/hooks/useI18n';
import { AddressDisplay } from '@/shared/ui';
import {
    BookOpen,
    Calendar,
    CalendarCheck,
    CheckCircle2,
    ChevronRight,
    Clock,
    FileText,
    Grid3x3,
    Loader2,
    Mail,
    MapPin,
    Package,
    Phone,
    Sprout, TrendingUp,
    User
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type {
    FarmerProfileData,
    FarmOverviewStats,
    NotificationPreferences,
    RecentActivity
} from '../types';
import { EditProfileDialog } from './EditProfileDialog';

/**
 * FarmerProfile Component
 * 
 * Optimized to render instantly from session data while
 * fetching fresh data in the background.
 * 
 * Features:
 * - Instant render from session (no blocking spinner if session exists)
 * - Background refresh with subtle indicator
 * - Prefetched data from login for fastest load
 */
export function FarmerProfile() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    taskReminders: true,
    incidentAlerts: true,
  });

  // Use optimized hook with placeholderData from session
  const { data: profile, isLoading: profileLoading, isFetching } = useProfileMe();
  const { data: farmsData } = useFarms();
  const { data: plotsData } = usePlots();
  const { data: seasonsData } = useSeasons();

  const farms = farmsData?.content ?? [];
  const plots = plotsData ?? [];
  const seasons = seasonsData?.items ?? [];

  // Check if we have session data to render immediately (no blocking load needed)
  const hasSessionProfile = !!user?.profile;

  const profileData: FarmerProfileData = useMemo(() => {
    const rawUsername = profile?.username || user?.username || 'farmer';
    // If username is an email, extract the part before @ for display
    const username = rawUsername.includes('@') ? rawUsername.split('@')[0] : rawUsername;
    // Prioritize API profile data, then fall back to session user.profile data
    // Use trim() to handle empty/whitespace-only strings properly
    const apiFullName = profile?.fullName?.trim();
    const sessionFullName = user?.profile?.fullName?.trim();
    const fullName = apiFullName || sessionFullName || username;
    
    // Build address from province and ward names
    const addressParts = [profile?.wardName, profile?.provinceName].filter(Boolean);
    const address = addressParts.length > 0 ? addressParts.join(', ') : 'Not available';
    
    // Format joined date - use API profile or session user.profile data
    const rawJoinedDate = profile?.joinedDate || user?.profile?.joinedDate;
    const joinedDate = rawJoinedDate 
      ? new Date(rawJoinedDate).toLocaleDateString('en-GB', { 
          day: '2-digit', month: 'short', year: 'numeric' 
        })
      : 'Not available';

    return {
      id: Number(profile?.id ?? user?.profile?.id ?? user?.id ?? 0),
      username,
      displayName: fullName,
      email: profile?.email || user?.profile?.email || user?.email || 'Not available',
      phone: profile?.phone || user?.profile?.phone || 'Not available',
      address,
      bio: undefined,
      role: 'farmer',
      status: (profile?.status || user?.profile?.status) === 'ACTIVE' ? 'active' : 'inactive',
      joinedDate,
      lastLogin: 'Not available',
      provinceId: profile?.provinceId ?? user?.profile?.provinceId ?? undefined,
      wardId: profile?.wardId ?? user?.profile?.wardId ?? undefined,
    };
  }, [profile, user]);

  const farmStats: FarmOverviewStats = useMemo(() => {
    const totalFarms = farms.length;
    const totalArea = farms.reduce((sum, farm) => {
      const areaValue = typeof farm.area === 'string' ? parseFloat(farm.area) : farm.area ?? 0;
      return sum + (Number.isFinite(areaValue) ? areaValue : 0);
    }, 0);
    const totalPlots = plots.length;
    const activeSeasons = seasons.filter((season) => season.status === 'ACTIVE').length;

    return {
      totalFarms,
      totalArea,
      totalPlots,
      activeSeasons,
    };
  }, [farms, plots, seasons]);

  const recentActivities: RecentActivity[] = [];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'task':
        return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'field_log':
        return <BookOpen className="w-4 h-4 text-primary" />;
      case 'season':
        return <CalendarCheck className="w-4 h-4 text-primary" />;
      case 'plot':
        return <Grid3x3 className="w-4 h-4 text-primary" />;
      case 'harvest':
        return <Package className="w-4 h-4 text-primary" />;
      default:
        return <FileText className="w-4 h-4 text-primary" />;
    }
  };

  // Only show full-page loading when NO session data and API is loading
  // If we have session data, render immediately and fetch in background
  if (profileLoading && !hasSessionProfile) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        {t('profile.loading')}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="space-y-6 p-6 max-w-[1280px] mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">{t('profile.title')}</h1>
          {/* Subtle refresh indicator - only shows when fetching fresh data */}
          {isFetching && !profileLoading && (
            <Loader2 className="w-3 h-3 animate-spin text-primary" />
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setEditDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <User className="w-4 h-4 mr-2" />
            {t('profile.editProfile')}
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-start gap-8">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(profileData.displayName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold text-foreground">
                    {profileData.displayName}
                  </h2>
                  <p className="text-base text-muted-foreground">@{profileData.username}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-muted text-foreground">
                    <Sprout className="w-3 h-3 mr-1" />
                    {t('profile.farmer')}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <div className="w-2 h-2 rounded-full bg-primary mr-1.5" />
                    {t('profile.active')}
                  </Badge>
                </div>

                {profileData.bio && (
                  <p className="text-base text-muted-foreground max-w-md">
                    {profileData.bio}
                  </p>
                )}
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Metadata Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
                  <User className="w-4 h-4" />
                  {t('profile.userId')}
                </div>
                <p className="text-base font-mono text-foreground">#{profileData.id}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
                  <Calendar className="w-4 h-4" />
                  {t('profile.joinedDate')}
                </div>
                <p className="text-base text-foreground">{profileData.joinedDate}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
                  <Clock className="w-4 h-4" />
                  {t('profile.lastLogin')}
                </div>
                <p className="text-base text-foreground">{profileData.lastLogin}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-2 text-base font-normal text-foreground">
            <Mail className="w-5 h-5" />
            {t('profile.contactInfo.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
                <Mail className="w-5 h-5" />
                {t('profile.contactInfo.email')}
              </div>
              <p className="text-base text-foreground">{profileData.email}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
                <Phone className="w-5 h-5" />
                {t('profile.contactInfo.phone')}
              </div>
              <p className="text-base font-mono text-foreground">{profileData.phone}</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
              <MapPin className="w-5 h-5" />
              {t('profile.contactInfo.address')}
            </div>
            <AddressDisplay
              wardCode={profileData.wardId ?? null}
              fallback={profileData.address}
              className="text-base text-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Farm Overview Card */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-2 text-base font-normal text-foreground">
            <Sprout className="w-5 h-5" />
            {t('profile.farmOverview.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-4 gap-6">
            {/* Total Farms */}
            <div className="bg-muted/30 border border-border rounded-2xl p-4 flex items-center gap-4">
              <div className="bg-secondary/10 rounded-2xl p-3">
                <Sprout className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-mono text-foreground">{farmStats.totalFarms}</p>
                <p className="text-sm text-muted-foreground">{t('profile.farmOverview.totalFarms')}</p>
              </div>
            </div>

            {/* Total Area */}
            <div className="bg-muted/30 border border-border rounded-2xl p-4 flex items-center gap-4">
              <div className="bg-primary/10 rounded-2xl p-3">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-mono text-foreground">{farmStats.totalArea} ha</p>
                <p className="text-sm text-muted-foreground">{t('profile.farmOverview.totalArea')}</p>
              </div>
            </div>

            {/* Plots */}
            <div className="bg-muted/30 border border-border rounded-2xl p-4 flex items-center gap-4">
              <div className="bg-accent/10 rounded-2xl p-3">
                <Grid3x3 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-mono text-foreground">{farmStats.totalPlots}</p>
                <p className="text-sm text-muted-foreground">{t('profile.farmOverview.plots')}</p>
              </div>
            </div>

            {/* Active Seasons */}
            <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-4 flex items-center gap-4">
              <div className="bg-primary/10 rounded-2xl p-3">
                <CalendarCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-mono text-primary">{farmStats.activeSeasons}</p>
                <p className="text-sm text-primary opacity-80">{t('profile.farmOverview.activeSeasons')}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            {t('profile.farmOverview.viewDetails')}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity Card */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-2 text-base font-normal text-foreground">
            <Clock className="w-5 h-5" />
            {t('profile.recentActivity.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('profile.recentActivity.empty')}</p>
            ) : (
              recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`flex items-start gap-4 py-4 ${
                    index !== recentActivities.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="bg-primary/10 rounded-2xl p-2 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                    <p className="text-base text-foreground">{activity.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security & Account Card */}
      <Card className="border-border shadow-sm">
        <CardContent className="space-y-6">
          {/* Notification Preferences */}
          <div className="space-y-4">
            <h4 className="text-base text-foreground">{t('profile.notifications.title')}</h4>
            
            <div className="space-y-4">
              <div className="bg-muted border border-border rounded-2xl p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="task-reminders" className="text-sm font-medium text-foreground">
                    {t('profile.notifications.taskReminders.label')}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('profile.notifications.taskReminders.description')}
                  </p>
                </div>
                <Switch
                  id="task-reminders"
                  checked={notifications.taskReminders}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, taskReminders: checked }))
                  }
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="bg-muted border border-border rounded-2xl p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="incident-alerts" className="text-sm font-medium text-foreground">
                    {t('profile.notifications.incidentAlerts.label')}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('profile.notifications.incidentAlerts.description')}
                  </p>
                </div>
                <Switch
                  id="incident-alerts"
                  checked={notifications.incidentAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, incidentAlerts: checked }))
                  }
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        profileData={profileData}
      />
      </div>
    </div>
  );
}

