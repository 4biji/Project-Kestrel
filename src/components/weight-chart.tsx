
"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts"
import type { WeightLog } from "@/lib/types"
import type { WeightChartSettingsData } from './weight-chart-settings';

interface WeightChartProps {
  data: WeightLog[];
  settings: WeightChartSettingsData;
}

export function WeightChart({ data, settings }: WeightChartProps) {
    if (!data || data.length === 0) {
        return <div className="text-center text-muted-foreground py-10">No weight data available.</div>
    }

  const chartData = data.map(log => ({
    ...log,
    // Format for display
    name: new Date(log.datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })).sort((a,b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

  const averageWeight = data.reduce((acc, log) => acc + log.weight, 0) / data.length;

  const alertBelowAverageWeight = averageWeight - (averageWeight * (settings.alertBelowAverage.percentage / 100));

  return (
    <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
            data={chartData}
            margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis 
                dataKey="name"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
                domain={['dataMin - 5', 'dataMax + 5']}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                width={30}
            />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    color: 'hsl(var(--card-foreground))'
                }}
                labelStyle={{ fontWeight: 'bold' }}
                formatter={(value: number) => [`${value}g`, "Weight"]}
                labelFormatter={(label) => {
                    const log = chartData.find(d => d.name === label);
                    return log ? new Date(log.datetime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : label
                }}
            />
            <Line 
                type={settings.style} 
                dataKey="weight" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
            />
            {settings.showAverage && (
                <ReferenceLine 
                    y={averageWeight} 
                    label={{ value: `Avg: ${averageWeight.toFixed(0)}g`, position: 'insideTopLeft', fill: 'hsl(var(--muted-foreground))' }} 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeDasharray="3 3" 
                />
            )}
            {settings.alertBelowAverage.enabled && (
                <ReferenceLine
                    y={alertBelowAverageWeight}
                    label={{ value: `Alert: ${alertBelowAverageWeight.toFixed(0)}g`, position: 'insideTopLeft', fill: 'hsl(var(--destructive-foreground))', background: {fill: 'hsl(var(--destructive))', padding: 4, borderRadius: 4} }}
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="4 4"
                />
            )}
            {settings.presetAlert.enabled && settings.presetAlert.weight > 0 && (
                 <ReferenceLine
                    y={settings.presetAlert.weight}
                    label={{ value: `Alert: ${settings.presetAlert.weight}g`, position: 'insideTopLeft', fill: 'hsl(var(--destructive-foreground))', background: {fill: 'hsl(var(--destructive))', padding: 4, borderRadius: 4} }}
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="4 4"
                />
            )}
             {settings.huntingWeight.enabled && settings.huntingWeight.weight > 0 && (
                 <ReferenceLine
                    y={settings.huntingWeight.weight}
                    label={{ value: `Hunt: ${settings.huntingWeight.weight}g`, position: 'insideTopLeft', fill: '#fff', background: {fill: 'hsl(140 80% 40%)', padding: 4, borderRadius: 4} }}
                    stroke="hsl(140 80% 40%)"
                    strokeDasharray="4 4"
                />
            )}
            </LineChart>
        </ResponsiveContainer>
    </div>
  )
}
