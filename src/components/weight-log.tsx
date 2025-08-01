
"use client";

import { format, parseISO, differenceInHours } from "date-fns";
import type { WeightLog } from "@/lib/types";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { TrendingUp, TrendingDown, MoreVertical, Pencil, Trash2, Activity } from "lucide-react";

interface WeightLogComponentProps {
  logs: WeightLog[];
  onEdit: (log: WeightLog) => void;
  onDelete: (log: WeightLog) => void;
}

export function WeightLogComponent({ logs, onEdit, onDelete }: WeightLogComponentProps) {
  const sortedLogs = [...logs].sort((a,b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  const displayLogs = [...logs].sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
  
  const lastLog = displayLogs.length > 0 ? displayLogs[0] : null;

  const getChangeForLog = (currentLog: WeightLog) => {
    const currentIndex = displayLogs.findIndex(log => log.datetime === currentLog.datetime);
    if (currentIndex === -1 || currentIndex >= displayLogs.length - 1) return null;
    const previousLog = displayLogs[currentIndex + 1];
    return currentLog.weight - previousLog.weight;
  }

  const calculateAverageHourlyWeightLoss = () => {
    if (sortedLogs.length < 2) return 0;

    const hourlyLosses: number[] = [];

    for (let i = 1; i < sortedLogs.length; i++) {
      const prevLog = sortedLogs[i-1];
      const currentLog = sortedLogs[i];

      const weightChange = prevLog.weight - currentLog.weight;

      if (weightChange > 0) { // Only consider weight loss
        const hoursApart = differenceInHours(parseISO(currentLog.datetime), parseISO(prevLog.datetime));
        if (hoursApart > 0) {
          const hourlyLoss = weightChange / hoursApart;
          hourlyLosses.push(hourlyLoss);
        }
      }
    }

    if (hourlyLosses.length === 0) return 0;

    const averageHourlyWeightLoss = hourlyLosses.reduce((sum, loss) => sum + loss, 0) / hourlyLosses.length;
    return averageHourlyWeightLoss;
  };

  const averageHourlyLoss = calculateAverageHourlyWeightLoss();

  return (
    <div className="space-y-2">
      {lastLog ? (
        <>
          <div className="group flex items-center justify-between p-3 bg-secondary/50 rounded-lg text-sm">
            <div>
              <div className="font-medium">Last Entry</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{lastLog.weight}g</span>
                <span className="text-muted-foreground/50">{format(parseISO(lastLog.datetime), 'MMM d, HH:mm:ss')}</span>
                {(log => {
                  const weightChange = getChangeForLog(log);
                  return weightChange !== null && !isNaN(weightChange) && (
                    <span className={`flex items-center ${weightChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {weightChange >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                      {weightChange.toFixed(1)}g
                    </span>
                  );
                })(lastLog)}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(lastLog)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(lastLog)} className="text-red-500 focus:text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg text-sm">
             <div className="font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary"/>
                Avg. Hourly Weight Loss
             </div>
             <div className="text-2xl font-bold text-primary mt-2">
                {averageHourlyLoss.toFixed(2)}g / hour
             </div>
          </div>
        </>
      ) : (
        <p className="text-sm text-center text-muted-foreground py-10">No weight records yet.</p>
      )}
    </div>
  );
}
