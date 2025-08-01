"use client";

import { format, parseISO } from "date-fns";
import type { WeightLog } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { LineChart, TrendingUp, TrendingDown } from "lucide-react";

interface WeightLogComponentProps {
  logs: WeightLog[];
}

export function WeightLogComponent({ logs }: WeightLogComponentProps) {
  const getWeightChange = (index: number) => {
    if (index === 0) return null;
    const currentWeight = logs[index].weight;
    const previousWeight = logs[index - 1].weight;
    const change = currentWeight - previousWeight;
    return change;
  };

  const sortedLogs = [...logs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-4">
      {sortedLogs.length > 0 ? (
        <ScrollArea className="h-64">
            <div className="space-y-3 pr-4">
            {sortedLogs.map((log, index) => {
              const weightChange = getWeightChange(sortedLogs.length - 1 - index);
              return (
                <div key={log.date} className="p-3 bg-secondary/50 rounded-lg text-sm">
                  <div className="flex justify-between font-medium">
                      <span>{format(parseISO(log.date), 'MMMM d, yyyy')}</span>
                      <span className="flex items-center gap-2">
                        {weightChange !== null && (
                           <span className={`text-xs flex items-center ${weightChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {weightChange > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {weightChange.toFixed(1)}g
                           </span>
                        )}
                        {log.weight}g
                      </span>
                  </div>
                </div>
              )
            })}
            </div>
        </ScrollArea>
      ) : (
        <p className="text-sm text-center text-muted-foreground py-10">No weight records yet.</p>
      )}
    </div>
  );
}
