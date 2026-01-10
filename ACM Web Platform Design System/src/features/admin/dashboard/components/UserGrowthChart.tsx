import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserGrowthData } from '../types';
import { COLOR_PALETTE } from '../constants';

interface UserGrowthChartProps {
  data: UserGrowthData[];
}

/**
 * UserGrowthChart Component
 * 
 * Displays an area chart showing the growth trend of farmers and buyers over time.
 * Uses gradient fills for visual appeal and clear data separation.
 */
export const UserGrowthChart = ({ data }: UserGrowthChartProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>User Growth Trend</CardTitle>
        <CardDescription>Farmers and Buyers registration over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorFarmers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR_PALETTE.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLOR_PALETTE.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBuyers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR_PALETTE.secondary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLOR_PALETTE.secondary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <RechartsTooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="farmers"
              stroke={COLOR_PALETTE.primary}
              fill="url(#colorFarmers)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="buyers"
              stroke={COLOR_PALETTE.secondary}
              fill="url(#colorBuyers)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

