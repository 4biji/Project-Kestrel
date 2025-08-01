
"use client";

import { useState, useEffect } from "react";
import { format, parseISO, differenceInHours } from "date-fns";
import type { WeightLog } from "@/lib/types";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { TrendingUp, TrendingDown, MoreVertical, Pencil, Trash2, Activity, ScrollText, GitCommitHorizontal } from "lucide-react";

interface WeightLogComponentProps {
  logs: WeightLog[];
  onEdit: (log: WeightLog) => void;
  onDelete: (log: WeightLog) => void;
}

export function WeightLogComponent({ logs, onEdit, onDelete }: WeightLogComponentProps) {
  const [sortedLogs, setSortedLogs] = useState<WeightLog[]>([]);
  const [displayLogs, setDisplayLogs] = useState<WeightLog[]>([]);
  const [lastLog, setLastLog] = useState<WeightLog | null>(null);
  const [averageHourlyLoss, setAverageHourlyLoss] = useState(0);
  const [lastWeightChange, setLastWeightChange] = useState<number | null>(null);


  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sortedByTimeAsc = [...logs].sort((a,b) => new Date(a.datetime).getTime() - new Date(a.datetime).getTime());
    const display = [...logs].sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
    
    setSortedLogs(sortedByTimeAsc);
    setDisplayLogs(display);
    setLastLog(display.length > 0 ? display[0] : null);

    if (display.length >= 2) {
        const last = display[0].weight;
        const secondLast = display[1].weight;
        setLastWeightChange(last - secondLast);
    } else {
        setLastWeightChange(null);
    }


    if (sortedByTimeAsc.length < 2) {
      setAverageHourlyLoss(0);
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
      return;
    }

    const avgLoss = hourlyLosses.reduce((sum, loss) => sum + loss, 0) / hourlyLosses.length;
    setAverageHourlyLoss(avgLoss);
  }, [logs]);

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
                  <div className={`text-xl font-bold mt-2 flex items-center ${lastWeightChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {lastWeightChange >= 0 ? <TrendingUp className="w-4 h-4 mr-0.5" /> : <TrendingDown className="w-4 h-4 mr-0.5" />}
                    {lastWeightChange.toFixed(1)}g
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


          <Dialog>
            <DialogTrigger asChild>
                <div className="text-center">
                    <Button variant="link" size="sm" className="text-muted-foreground gap-1">
                        <ScrollText className="w-3 h-3" />
                        View All Logs
                    </Button>
                </div>
            </DialogTrigger>
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
                                    <DialogClose asChild>
                                        <DropdownMenuItem onClick={() => onEdit(log)}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            <span>Edit</span>
                                        </DropdownMenuItem>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <DropdownMenuItem onClick={() => onDelete(log)} className="text-red-500 focus:text-red-500">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DialogClose>
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
        </>
      ) : (
        <p className="text-sm text-center text-muted-foreground py-10">No weight records yet.</p>
      )}
    </div>
  );
}
