
"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine, Label } from "recharts"
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
    name: new Date(log.datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })).sort((a,b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

  const averageWeight = data.reduce((acc, log) => acc + log.weight, 0) / data.length;

  const alertBelowAverageWeight = averageWeight - (averageWeight * (settings.alertBelowAverage.percentage / 100));

  const getChartDomain = () => {
    const weightValues = data.map(log => log.weight);
    let allValues = [...weightValues];

    if (settings.showAverage) {
        allValues.push(averageWeight);
    }
    if (settings.alertBelowAverage.enabled) {
        allValues.push(alertBelowAverageWeight);
    }
    if (settings.presetAlert.enabled && settings.presetAlert.weight > 0) {
        allValues.push(settings.presetAlert.weight);
    }
    if (settings.huntingWeight.enabled && settings.huntingWeight.weight > 0) {
        allValues.push(settings.huntingWeight.weight);
    }
    
    if (allValues.length === 0) {
        return ['auto', 'auto'];
    }

    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const padding = (maxValue - minValue) * 0.1 || 10;

    return [minValue - padding, maxValue + padding];
  }


  return (
    <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
            data={chartData}
            margin={{
                top: 20,
                right: 30,
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
                domain={getChartDomain()}
                tickFormatter={(tick) => Math.round(tick).toString()}
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
             <Label 
                value={`${settings.style.charAt(0).toUpperCase() + settings.style.slice(1)} View`}
                position="top"
                offset={15}
                className="text-xs text-muted-foreground fill-current"
                style={{ textAnchor: 'middle', dominantBaseline: 'hanging' }}
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
                    label={{ value: `Avg: ${averageWeight.toFixed(0)}g`, position: 'right', fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeDasharray="3 3" 
                />
            )}
            {settings.alertBelowAverage.enabled && (
                <ReferenceLine
                    y={alertBelowAverageWeight}
                    label={{ value: `Alert: ${alertBelowAverageWeight.toFixed(0)}g`, position: 'right', fill: 'hsl(var(--destructive))', fontSize: 12 }}
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="4 4"
                />
            )}
            {settings.presetAlert.enabled && settings.presetAlert.weight > 0 && (
                 <ReferenceLine
                    y={settings.presetAlert.weight}
                    label={{ value: `Alert: ${settings.presetAlert.weight}g`, position: 'right', fill: 'hsl(var(--destructive))', fontSize: 12 }}
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="4 4"
                />
            )}
             {settings.huntingWeight.enabled && settings.huntingWeight.weight > 0 && (
                 <ReferenceLine
                    y={settings.huntingWeight.weight}
                    label={{ value: `Hunt: ${settings.huntingWeight.weight}g`, position: 'right', fill: 'hsl(140 80% 40%)', fontSize: 12 }}
                    stroke="hsl(140 80% 40%)"
                    strokeDasharray="4 4"
                />
            )}
            </LineChart>
        </ResponsiveContainer>
    </div>
  )
}
