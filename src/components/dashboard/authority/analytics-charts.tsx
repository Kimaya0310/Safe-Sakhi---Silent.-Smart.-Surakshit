'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';

const chartConfig = {
  alerts: { label: 'Alerts', color: 'hsl(var(--destructive))' },
  devices: { label: 'Devices', color: 'hsl(var(--primary))' },
};

const timeData = [
  { time: '00:00', alerts: 5 },
  { time: '03:00', alerts: 8 },
  { time: '06:00', alerts: 3 },
  { time: '09:00', alerts: 2 },
  { time: '12:00', alerts: 4 },
  { time: '15:00', alerts: 6 },
  { time: '18:00', alerts: 12 },
  { time: '21:00', alerts: 15 },
];

const reliabilityData = [
    { name: 'Online', value: 982, color: 'hsl(var(--chart-2))' },
    { name: 'Power Offs', value: 15, color: 'hsl(var(--chart-1))' },
    { name: 'Network Drops', value: 23, color: 'hsl(var(--chart-5))' },
]

export default function AnalyticsCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Time-based Risk Analytics</CardTitle>
          <CardDescription>Alerts by time of day</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={timeData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="time" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickMargin={5} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="alerts" fill="var(--color-alerts)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Device Reliability Metrics</CardTitle>
          <CardDescription>Aggregated device status during rides</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
            <ChartContainer config={chartConfig} className="h-64">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={reliabilityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                     {reliabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
              </PieChart>
            </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Response Time Analytics</CardTitle>
          <CardDescription>Average time to resolution</CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-4xl font-bold">18 min</p>
           <p className="text-sm text-muted-foreground">Area-wise averages coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
