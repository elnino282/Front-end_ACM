import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    Legend,
} from 'recharts';
import type { UserActivityFilter } from '../types';

interface UserActivityChartProps {
    filteredUserActivityData: Array<Record<string, string | number>>;
    userActivityFilter: UserActivityFilter;
    setUserActivityFilter: React.Dispatch<React.SetStateAction<UserActivityFilter>>;
}

export const UserActivityChart: React.FC<UserActivityChartProps> = ({
    filteredUserActivityData,
    userActivityFilter,
    setUserActivityFilter,
}) => {
    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>User Activity</CardTitle>
                        <CardDescription>Active users over time by role</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={userActivityFilter.farmers ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setUserActivityFilter({ ...userActivityFilter, farmers: !userActivityFilter.farmers })}
                            className={userActivityFilter.farmers ? 'bg-[#10B981] hover:bg-[#059669]' : ''}
                        >
                            Farmers
                        </Button>
                        <Button
                            variant={userActivityFilter.buyers ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setUserActivityFilter({ ...userActivityFilter, buyers: !userActivityFilter.buyers })}
                            className={userActivityFilter.buyers ? 'bg-[#0891B2] hover:bg-[#0E7490]' : ''}
                        >
                            Buyers
                        </Button>
                        <Button
                            variant={userActivityFilter.admins ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setUserActivityFilter({ ...userActivityFilter, admins: !userActivityFilter.admins })}
                            className={userActivityFilter.admins ? 'bg-[#8B5CF6] hover:bg-[#7C3AED]' : ''}
                        >
                            Admins
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={filteredUserActivityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <RechartsTooltip />
                        <Legend />
                        {userActivityFilter.farmers && (
                            <Line
                                type="monotone"
                                dataKey="farmers"
                                stroke="#10B981"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        )}
                        {userActivityFilter.buyers && (
                            <Line
                                type="monotone"
                                dataKey="buyers"
                                stroke="#0891B2"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        )}
                        {userActivityFilter.admins && (
                            <Line
                                type="monotone"
                                dataKey="admins"
                                stroke="#8B5CF6"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
