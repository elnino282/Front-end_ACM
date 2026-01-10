// Performance visualization charts section

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
} from 'recharts';
import type {
    PerformanceDataPoint,
    ErrorRateDataPoint,
    SlowPageDataPoint,
} from '../types';

interface PerformanceChartsProps {
    cpuMemoryData: PerformanceDataPoint[];
    errorRateData: ErrorRateDataPoint[];
    slowestPagesData: SlowPageDataPoint[];
}

export function PerformanceCharts({
    cpuMemoryData,
    errorRateData,
    slowestPagesData,
}: PerformanceChartsProps) {
    return (
        <>
            {/* Performance Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* CPU/Memory Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>CPU & Memory Usage</CardTitle>
                        <CardDescription>Resource utilization over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={cpuMemoryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="time" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <RechartsTooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="cpu"
                                    stroke="#2563EB"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    name="CPU %"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="memory"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    name="Memory %"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Error Rate Donut */}
                <Card>
                    <CardHeader>
                        <CardTitle>Error Rate by Service</CardTitle>
                        <CardDescription>Distribution of errors</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={errorRateData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={(entry) => entry.service}
                                >
                                    {errorRateData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Slowest Pages Bar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Top 10 Slowest Endpoints</CardTitle>
                    <CardDescription>Average latency and 95th percentile</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={slowestPagesData} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis type="number" stroke="#6b7280" />
                            <YAxis dataKey="page" type="category" width={200} stroke="#6b7280" />
                            <RechartsTooltip />
                            <Legend />
                            <Bar dataKey="latency" fill="#F59E0B" name="Avg Latency (ms)" radius={[0, 8, 8, 0]} />
                            <Bar dataKey="p95" fill="#EF4444" name="95th Percentile (ms)" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </>
    );
}
