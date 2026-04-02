import { Card } from "@/components/ui/card";
import { useI18n } from "@/hooks/useI18n";
import { useSeason } from "@/shared/contexts";
import {
    Activity,
    AlertTriangle,
    CheckSquare,
    Map,
    Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavItem {
  icon: React.ElementType;
  label: string;
  description: string;
  route?: string;
  scrollTo?: string;
  color: string;
}

/**
 * QuickNavGrid Component
 *
 * Displays a responsive grid of quick navigation cards for fast access to key features.
 */
export function QuickNavGrid() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { selectedSeasonId } = useSeason();

  const NAV_ITEMS: NavItem[] = [
    {
      icon: Map,
      label: t('nav.farms'),
      description: t('farms.subtitle'),
      route: "/farmer/farms",
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      icon: CheckSquare,
      label: t('nav.tasks'),
      description: t('dashboard.quickNav.tasksDesc'),
      route: selectedSeasonId
        ? `/farmer/seasons/${selectedSeasonId}/workspace/tasks`
        : "/farmer/seasons",
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
    },
    {
      icon: Package,
      label: t('nav.inventory'),
      description: t('dashboard.quickNav.inventoryDesc'),
      route: "/farmer/inventory",
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30",
    },
    {
      icon: AlertTriangle,
      label: t('nav.incidents'),
      description: t('dashboard.quickNav.incidentsDesc'),
      route: "/farmer/incidents",
      color: "text-red-600 bg-red-50 dark:bg-red-950/30",
    },
    {
      icon: Activity,
      label: t('dashboard.recentActivity'),
      description: t('dashboard.quickNav.activityDesc'),
      scrollTo: "recent-activity",
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  const handleClick = (item: NavItem) => {
    if (item.route) {
      navigate(item.route);
    } else if (item.scrollTo) {
      const element = document.getElementById(item.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        {t('dashboard.quickNav.title')}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.label}
              onClick={() => handleClick(item)}
              className="group cursor-pointer p-4 hover:shadow-md hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div
                  className={`p-2.5 rounded-lg ${item.color} transition-transform group-hover:scale-110`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
