import { Menu, Bell, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SearchBar } from './SearchBar';
import { ProfileMenu } from './ProfileMenu';
import { HeaderProps } from '../types';

/**
 * Header Component
 * 
 * Top navigation bar with branding, breadcrumbs, search, and user actions.
 * Integrates SearchBar and ProfileMenu sub-components.
 * 
 * Single Responsibility: Top navigation UI
 */
export function Header({
  config,
  breadcrumbs,
  sidebarCollapsed: _sidebarCollapsed,
  searchQuery,
  unreadCount,
  userName,
  userEmail,
  userAvatar,
  portalType,
  theme,
  language,
  onToggleSidebar,
  onViewChange,
  onSearchChange,
  onAiDrawerOpen,
  onNotificationsOpen,
  onThemeChange,
  onLanguageChange,
  onLogout,
}: HeaderProps) {
  return (
    <header
      className="h-16 border-b border-white/10 flex items-center justify-between px-4 gap-4 shrink-0 z-50"
      style={{ backgroundColor: config.color }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="shrink-0 text-white hover:bg-white/10"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Logo */}
        <button
          onClick={() => onViewChange('dashboard')}
          className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white text-lg">{config.emoji}</span>
          </div>
          <div className="hidden md:block">
            <div className="font-semibold text-sm text-white">ACM Platform</div>
            <div className="text-xs text-white/80">{config.name}</div>
          </div>
        </button>

        <Separator orientation="vertical" className="h-8 hidden lg:block bg-white/20" />

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Breadcrumb className="hidden lg:block">
            <BreadcrumbList>
              {breadcrumbs.slice(0, 4).map((crumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <BreadcrumbSeparator className="text-white/60" />}
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 || !crumb.href ? (
                      <BreadcrumbPage className="text-white/90">{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        onClick={() => crumb.href && onViewChange(crumb.href)}
                        className="cursor-pointer text-white/70 hover:text-white"
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Global Search */}
        <SearchBar value={searchQuery} onChange={onSearchChange} />

        {/* AI Assistant Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onAiDrawerOpen}
                className="shrink-0 text-white hover:bg-white/10"
              >
                <Bot className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI Assistant</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Notifications Bell */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onNotificationsOpen}
                className="relative shrink-0 text-white hover:bg-white/10"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-8 bg-white/20" />

        {/* Profile Menu */}
        <ProfileMenu
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
          portalType={portalType}
          theme={theme}
          language={language}
          onThemeChange={onThemeChange}
          onLanguageChange={onLanguageChange}
          onViewChange={onViewChange}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}

