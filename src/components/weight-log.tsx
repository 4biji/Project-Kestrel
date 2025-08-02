
"use client";

import { useState, useEffect } from "react";
import { format, parseISO, differenceInHours } from "date-fns";
import type { WeightLog } from "@/lib/types";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { TrendingUp, TrendingDown, MoreVertical, Pencil, Trash2, Activity, GitCommitHorizontal, Hourglass } from "lucide-react";

interface WeightLogComponentProps {
  logs: WeightLog[];
  onEdit: (log: WeightLog) => void;
  onDelete: (log: WeightLog) => void;
  onAverageLossChange?: (avgLoss: number) => void;
}

interface ViewAllLogsDialogProps extends Omit<WeightLogComponentProps, 'onAverageLossChange'> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ViewAllLogsDialog({ open, onOpenChange, logs, onEdit, onDelete }: ViewAllLogsDialogProps) {
    const displayLogs = [...logs].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

    const getChangeForLog = (currentLog: WeightLog) => {
        const currentIndex = displayLogs.findIndex(log => log.datetime === currentLog.datetime);
        if (currentIndex === -1 || currentIndex >= displayLogs.length - 1) return null;
        const previousLog = displayLogs[currentIndex + 1];
        return currentLog.weight - previousLog.weight;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>All Weight Logs</DialogTitle>
                    <DialogDescription>
                        A complete history of all recorded weights.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72">
                    <div className="space-y-2 pt-2 pr-4">
                        {displayLogs.map(log => (
                            <div key={log.datetime} className="group flex items-center justify-between p-2 bg-secondary/50 rounded-lg text-sm">
                                <div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{log.weight}g</span>
                                        <span className="text-muted-foreground/50">{format(parseISO(log.datetime), 'MMM d, HH:mm:ss')}</span>
                                        {(log => {
                                            const weightChange = getChangeForLog(log);
                                            return weightChange !== null && !isNaN(weightChange) && (
                                                <span className={`flex items-center ${weightChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {weightChange >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                                                    {weightChange.toFixed(1)}g
                                                </span>
                                            );
                                        })(log)}
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        
                                        <DropdownMenuItem onClick={() => onEdit(log)}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            <span>Edit</span>
                                        </DropdownMenuItem>
                                        
                                        
                                        <DropdownMenuItem onClick={() => onDelete(log)} className="text-red-500 focus:text-red-500">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                        
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function WeightLogComponent({ logs, onEdit, onDelete, onAverageLossChange }: WeightLogComponentProps) {
  const [displayLogs, setDisplayLogs] = useState<WeightLog[]>([]);
  const [lastLog, setLastLog] = useState<WeightLog | null>(null);
  const [averageHourlyLoss, setAverageHourlyLoss] = useState(0);
  const [lastWeightChange, setLastWeightChange] = useState<number | null>(null);
  const [lastHourlyChange, setLastHourlyChange] = useState<number | null>(null);


  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sortedByTimeDesc = [...logs].sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
    
    setDisplayLogs(sortedByTimeDesc);
    setLastLog(sortedByTimeDesc.length > 0 ? sortedByTimeDesc[0] : null);

    if (sortedByTimeDesc.length >= 2) {
        const last = sortedByTimeDesc[0];
        const secondLast = sortedByTimeDesc[1];
        setLastWeightChange(last.weight - secondLast.weight);

        const hoursApart = differenceInHours(parseISO(last.datetime), parseISO(secondLast.datetime));
        if (hoursApart > 0) {
            const weightChange = secondLast.weight - last.weight;
            if (weightChange > 0) { // only show loss
              setLastHourlyChange(weightChange / hoursApart);
            } else {
              setLastHourlyChange(0);
            }
        } else {
            setLastHourlyChange(null);
        }

    } else {
        setLastWeightChange(null);
        setLastHourlyChange(null);
    }
    
    const sortedByTimeAsc = [...logs].sort((a,b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
    if (sortedByTimeAsc.length < 2) {
      setAverageHourlyLoss(0);
      if (onAverageLossChange) onAverageLossChange(0);
      return;
    }

    const hourlyLosses: number[] = [];
    for (let i = 1; i < sortedByTimeAsc.length; i++) {
      const prevLog = sortedByTimeAsc[i-1];
      const currentLog = sortedByTimeAsc[i];
      const weightChange = prevLog.weight - currentLog.weight;

      if (weightChange > 0) { // Only consider weight loss
        const hoursApart = differenceInHours(parseISO(currentLog.datetime), parseISO(prevLog.datetime));
        if (hoursApart > 0) {
          const hourlyLoss = weightChange / hoursApart;
          hourlyLosses.push(hourlyLoss);
        }
      }
    }

    if (hourlyLosses.length === 0) {
      setAverageHourlyLoss(0);
      if (onAverageLossChange) onAverageLossChange(0);
      return;
    }

    const avgLoss = hourlyLosses.reduce((sum, loss) => sum + loss, 0) / hourlyLosses.length;
    setAverageHourlyLoss(avgLoss);
    if (onAverageLossChange) onAverageLossChange(avgLoss);
  }, [logs, onAverageLossChange]);

  const getChangeForLog = (currentLog: WeightLog) => {
    const currentIndex = displayLogs.findIndex(log => log.datetime === currentLog.datetime);
    if (currentIndex === -1 || currentIndex >= displayLogs.length - 1) return null;
    const previousLog = displayLogs[currentIndex + 1];
    return currentLog.weight - previousLog.weight;
  }

  return (
    <div className="space-y-2">
      {lastLog ? (
        <>
          <div className="group flex flex-col p-2.5 bg-secondary/50 rounded-lg text-sm -mt-2">
            <div className="font-medium whitespace-nowrap">Last Entry</div>
            <div className="flex items-center gap-2 mt-1">
                <div className="text-2xl font-bold text-primary">{lastLog.weight}g</div>
                {(log => {
                    const weightChange = getChangeForLog(log);
                    return weightChange !== null && !isNaN(weightChange) && (
                    <span className={`flex items-center text-lg font-bold ${weightChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {weightChange >= 0 ? <TrendingUp className="w-4 h-4 mr-0.5" /> : <TrendingDown className="w-4 h-4 mr-0.5" />}
                        {weightChange.toFixed(1)}g
                    </span>
                    );
                })(lastLog)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <span>{format(parseISO(lastLog.datetime), 'MMM d, HH:mm:ss')}</span>
            </div>
          </div>
          
          {lastWeightChange !== null && (
            <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                  <div className="font-medium flex items-center gap-2 whitespace-nowrap">
                    <GitCommitHorizontal className="w-4 h-4 text-primary"/>
                    Last Change
                  </div>
                  <div className="flex items-end gap-4">
                    <div className={`text-xl font-bold mt-2 flex items-center ${lastWeightChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {lastWeightChange >= 0 ? <TrendingUp className="w-4 h-4 mr-0.5" /> : <TrendingDown className="w-4 h-4 mr-0.5" />}
                        {lastWeightChange.toFixed(1)}g
                    </div>
                    {lastHourlyChange !== null && lastHourlyChange > 0 && (
                        <div className="flex items-center text-sm text-red-500">
                             <Hourglass className="w-3 h-3 mr-1" />
                            {lastHourlyChange.toFixed(2)}g/hr
                        </div>
                    )}
                  </div>
            </div>
          )}


          <div className="p-3 bg-secondary/50 rounded-lg text-sm">
              <div className="font-medium flex items-center gap-2 whitespace-nowrap">
                  <Activity className="w-4 h-4 text-primary"/>
                  Avg. Hourly Loss
              </div>
              <div className="text-xl font-bold text-primary mt-2">
                  {averageHourlyLoss.toFixed(2)}g/hr
              </div>
          </div>
        </>
      ) : (
        <p className="text-sm text-center text-muted-foreground py-10">No weight records yet.</p>
      )}
    </div>
  );
}
