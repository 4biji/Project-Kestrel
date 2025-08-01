"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import type { WeightLog } from "@/lib/types"

interface WeightChartProps {
  data: WeightLog[];
}

export function WeightChart({ data }: WeightChartProps) {
    if (!data || data.length === 0) {
        return <div className="text-center text-muted-foreground py-10">No weight data available.</div>
    }

  return (
    <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
            data={data}
            margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
                domain={['dataMin - 5', 'dataMax + 5']}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
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
            />
            <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
            />
            </LineChart>
        </ResponsiveContainer>
    </div>
  )
}
