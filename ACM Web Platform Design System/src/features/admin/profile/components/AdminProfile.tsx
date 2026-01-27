import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useProfileMe } from "@/entities/user";
import { useAuth } from "@/features/auth";
import { useI18n } from "@/hooks/useI18n";
import { AddressDisplay } from "@/shared/ui";
import {
    Calendar,
    Clock,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Shield,
    User,
} from "lucide-react";
import { useMemo, useState } from "react";
import type {
    AdminProfileData,
    NotificationPreferences,
    RecentActivity,
} from "../types";
import { EditProfileDialog } from "./EditProfileDialog";

/**
 * AdminProfile Component
 *
 * Displays admin user profile with:
 * - Personal information and avatar
 * - Contact details
 * - System overview statistics
 * - Notification preferences
 * - Edit profile functionality
 */
export function AdminProfile() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    systemAlerts: true,
    incidentReports: true,
  });

  // Use optimized hook with placeholderData from session
  const {
    data: profile,
    isLoading: profileLoading,
    isFetching,
  } = useProfileMe();

  // Check if we have session data to render immediately
  const hasSessionProfile = !!user?.profile;

  const profileData: AdminProfileData = useMemo(() => {
    const rawUsername = profile?.username || user?.username || "admin";
    // If username is an email, extract the part before @ for display
    const username = rawUsername.includes("@")
      ? rawUsername.split("@")[0]
      : rawUsername;
    // Use trim() to handle empty/whitespace-only strings properly
    const apiFullName = profile?.fullName?.trim();
    const sessionFullName = user?.profile?.fullName?.trim();
    const fullName = apiFullName || sessionFullName || username;

    // Build address from province and ward names
    const addressParts = [profile?.wardName, profile?.provinceName].filter(
      Boolean,
    );
    const address =
      addressParts.length > 0 ? addressParts.join(", ") : t('profile.notAvailable');

    // Format joined date
    const rawJoinedDate = profile?.joinedDate || user?.profile?.joinedDate;
    const joinedDate = rawJoinedDate
      ? new Date(rawJoinedDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : t('profile.notAvailable');

    return {
      id: Number(profile?.id ?? user?.profile?.id ?? user?.id ?? 0),
      username,
      displayName: fullName,
      email:
        profile?.email ||
        user?.profile?.email ||
        user?.email ||
        t('profile.notAvailable'),
      phone: profile?.phone || user?.profile?.phone || t('profile.notAvailable'),
      address,
      bio: undefined,
      role: "admin",
      status:
        (profile?.status || user?.profile?.status) === "ACTIVE"
          ? "active"
          : "inactive",
      joinedDate,
      lastLogin: t('profile.notAvailable'),
      provinceId: profile?.provinceId ?? user?.profile?.provinceId ?? undefined,
      wardId: profile?.wardId ?? user?.profile?.wardId ?? undefined,
    };
  }, [profile, user, t]);

  const recentActivities: RecentActivity[] = [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Only show full-page loading when NO session data and API is loading
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
            <h1 className="text-xl font-bold text-foreground">{t('admin.profile.title', 'Admin Profile')}</h1>
            {/* Subtle refresh indicator */}
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
                    <p className="text-base text-muted-foreground">
                      @{profileData.username}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-muted text-foreground"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {t('admin.profile.administrator', 'Administrator')}
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
                  <p className="text-base font-mono text-foreground">
                    #{profileData.id}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
                    <Calendar className="w-4 h-4" />
                    {t('profile.joinedDate')}
                  </div>
                  <p className="text-base text-foreground">
                    {profileData.joinedDate}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
                    <Clock className="w-4 h-4" />
                    {t('profile.lastLogin')}
                  </div>
                  <p className="text-base text-foreground">
                    {profileData.lastLogin}
                  </p>
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
                <p className="text-base font-mono text-foreground">
                  {profileData.phone}
                </p>
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
                <p className="text-sm text-muted-foreground">
                  {t('profile.recentActivity.empty')}
                </p>
              ) : (
                recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`flex items-start gap-4 py-4 ${
                      index !== recentActivities.length - 1
                        ? "border-b border-border"
                        : ""
                    }`}
                  >
                    <div className="bg-primary/10 rounded-2xl p-2 mt-0.5">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {activity.date}
                      </p>
                      <p className="text-base text-foreground">
                        {activity.description}
                      </p>
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
              <h4 className="text-base text-foreground">
                {t('profile.notifications.title')}
              </h4>

              <div className="space-y-4">
                <div className="bg-muted border border-border rounded-2xl p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <Label
                      htmlFor="system-alerts"
                      className="text-sm font-medium text-foreground"
                    >
                      {t('admin.profile.notifications.systemAlerts.label', 'Receive System Alerts')}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t('admin.profile.notifications.systemAlerts.description', 'Get notified about system events and updates')}
                    </p>
                  </div>
                  <Switch
                    id="system-alerts"
                    checked={notifications.systemAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        systemAlerts: checked,
                      }))
                    }
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="bg-muted border border-border rounded-2xl p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <Label
                      htmlFor="incident-reports"
                      className="text-sm font-medium text-foreground"
                    >
                      {t('admin.profile.notifications.incidentReports.label', 'Receive Incident Reports')}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t('admin.profile.notifications.incidentReports.description', 'Get immediate alerts for new incidents and issues')}
                    </p>
                  </div>
                  <Switch
                    id="incident-reports"
                    checked={notifications.incidentReports}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        incidentReports: checked,
                      }))
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
