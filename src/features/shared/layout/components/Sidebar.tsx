import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SidebarProps } from '../types';

/**
 * Sidebar Component
 * 
 * Side navigation panel with collapsible functionality.
 * Displays navigation items with icons, labels, and optional badges.
 * 
 * Single Responsibility: Side navigation UI
 */
export function Sidebar({
  navigationItems,
  currentView,
  collapsed,
  portalColor,
  onNavigate,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <aside
      className={`bg-card border-r border-border transition-all duration-300 shrink-0 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto bg-[rgba(255,255,255,0)]">
          {navigationItems.map((item) => (
            <TooltipProvider key={item.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      currentView === item.id
                        ? 'text-white shadow-md'
                        : 'text-foreground hover:bg-muted'
                    }`}
                    style={
                      currentView === item.id
                        ? { backgroundColor: portalColor }
                        : undefined
                    }
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto bg-white/20 text-white"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-full justify-center"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}

