import {
    DollarSign,
    FileText,
    ShoppingCart,
    Users,
} from 'lucide-react';
import {
    ActivityData,
    HealthStatus,
    KPIData,
    PendingApproval,
    Priority,
    RecentActivity,
    SystemHealthMetric,
    UserGrowthData,
} from './types';

/**
 * Color palette for charts and UI elements
 */
export const COLOR_PALETTE = {
  primary: '#2563EB', // Blue
  secondary: '#0891B2', // Teal/Cyan
  tertiary: '#64748B', // Slate
  success: '#10B981', // Emerald Green
  warning: '#F59E0B', // Amber
  danger: '#EF4444', // Red
} as const;

/**
 * @deprecated PLACEHOLDER DATA - Do not use in production
 * TODO: Replace with real API data from:
 * - GET /api/v1/admin/stats/farmers - for farmer counts
 * - GET /api/v1/admin/stats/buyers - for buyer counts  
 * - GET /api/v1/admin/stats/contracts - for contract counts
 * - GET /api/v1/admin/stats/revenue - for revenue data
 */
export const PLACEHOLDER_KPI_DATA: KPIData[] = [
  {
    title: 'Total Farmers',
    value: '—',
    change: '—',
    trend: 'up',
    icon: Users,
    color: COLOR_PALETTE.primary,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    title: 'Total Buyers',
    value: '—',
    change: '—',
    trend: 'up',
    icon: ShoppingCart,
    color: COLOR_PALETTE.secondary,
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
  },
  {
    title: 'Active Contracts',
    value: '—',
    change: '—',
    trend: 'down',
    icon: FileText,
    color: COLOR_PALETTE.tertiary,
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-600',
  },
  {
    title: 'Total Revenue',
    value: '—',
    change: '—',
    trend: 'up',
    icon: DollarSign,
    color: COLOR_PALETTE.success,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
  },
];

/**
 * @deprecated PLACEHOLDER DATA - Do not use in production
 * TODO: Replace with real API data
 */
export const PLACEHOLDER_USER_GROWTH_DATA: UserGrowthData[] = [
  { month: 'Jan', farmers: 980, buyers: 650 },
  { month: 'Feb', farmers: 1050, buyers: 720 },
  { month: 'Mar', farmers: 1100, buyers: 760 },
  { month: 'Apr', farmers: 1150, buyers: 790 },
  { month: 'May', farmers: 1200, buyers: 820 },
  { month: 'Jun', farmers: 1248, buyers: 856 },
];

/**
 * @deprecated PLACEHOLDER DATA - Do not use in production
 * TODO: Replace with real API data from activity/audit logs
 */
export const PLACEHOLDER_ACTIVITY_DATA: ActivityData[] = [
  { name: 'Planting', value: 320, color: COLOR_PALETTE.primary },
  { name: 'Harvesting', value: 180, color: COLOR_PALETTE.secondary },
  { name: 'Sales', value: 240, color: COLOR_PALETTE.success },
  { name: 'Other', value: 160, color: COLOR_PALETTE.tertiary },
];

/**
 * @deprecated PLACEHOLDER DATA - Do not use in production  
 * TODO: Replace with real API data from system monitoring
 */
export const PLACEHOLDER_SYSTEM_HEALTH: SystemHealthMetric[] = [
  { metric: 'API Response Time', value: 98, status: 'excellent' },
  { metric: 'Database Performance', value: 95, status: 'excellent' },
  { metric: 'Server Uptime', value: 99.9, status: 'excellent' },
  { metric: 'Storage Capacity', value: 67, status: 'good' },
];

/**
 * @deprecated PLACEHOLDER DATA - Do not use in production
 * TODO: Replace with real API data from activity/audit logs
 */
export const PLACEHOLDER_RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: 1,
    user: 'John Farmer',
    userType: 'farmer',
    action: 'Created new plot',
    details: 'North Field - 5 hectares',
    time: '5 min ago',
    avatar: '',
  },
  {
    id: 2,
    user: 'Sarah Buyer',
    userType: 'buyer',
    action: 'Placed new order',
    details: 'Tomatoes - 500kg',
    time: '12 min ago',
    avatar: '',
  },
  {
    id: 3,
    user: 'Mike Anderson',
    userType: 'farmer',
    action: 'Completed harvest',
    details: 'East Field C - 2.5 tons',
    time: '28 min ago',
    avatar: '',
  },
  {
    id: 4,
    user: 'Emma Wilson',
    userType: 'buyer',
    action: 'Signed contract',
    details: 'Annual supply agreement',
    time: '1 hour ago',
    avatar: '',
  },
  {
    id: 5,
    user: 'David Chen',
    userType: 'farmer',
    action: 'Updated season plan',
    details: 'Spring 2025 season',
    time: '2 hours ago',
    avatar: '',
  },
];

/**
 * @deprecated PLACEHOLDER DATA - Do not use in production
 * TODO: Replace with real API data from pending approvals queue
 */
export const PLACEHOLDER_PENDING_APPROVALS: PendingApproval[] = [
  {
    id: 1,
    type: 'Farmer Registration',
    requester: 'Robert Johnson',
    date: '2025-11-10',
    priority: 'high',
  },
  {
    id: 2,
    type: 'Contract Review',
    requester: 'Green Valley Co.',
    date: '2025-11-09',
    priority: 'medium',
  },
  {
    id: 3,
    type: 'Buyer Verification',
    requester: 'Fresh Market Inc.',
    date: '2025-11-08',
    priority: 'high',
  },
  {
    id: 4,
    type: 'Document Upload',
    requester: 'Alice Martinez',
    date: '2025-11-08',
    priority: 'low',
  },
];

/**
 * Get Tailwind color class based on health status
 */
export const getStatusColor = (status: HealthStatus): string => {
  const colorMap: Record<HealthStatus, string> = {
    excellent: 'text-emerald-600',
    good: 'text-blue-600',
    warning: 'text-amber-600',
  };
  return colorMap[status];
};

/**
 * Get badge variant based on priority level
 */
export const getPriorityBadge = (priority: Priority): string => {
  const variantMap: Record<Priority, string> = {
    high: 'destructive',
    medium: 'default',
    low: 'secondary',
  };
  return variantMap[priority];
};

