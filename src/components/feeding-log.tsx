
"use client";

import { useState, useEffect } from "react";
import { format, parseISO, differenceInHours } from "date-fns";
import type { FeedingLog } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { MoreVertical, Pencil, Trash2, Bone, Activity, Calculator } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface FeedingLogProps {
  logs: FeedingLog[];
  onEdit: (log: FeedingLog) => void;
  onDelete: (log: FeedingLog) => void;
}

interface CommonProps {
    logs: FeedingLog[];
    onEdit: (log: FeedingLog) => void;
    onDelete: (log: FeedingLog) => void;
}

export function ViewAllFeedingLogsDialog({ open, onOpenChange, logs, onEdit, onDelete }: { open: boolean, onOpenChange: (open: boolean) => void } & CommonProps) {
    const displayLogs = [...logs].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>All Feeding Logs</DialogTitle>
                    <DialogDescription>
                        A complete history of all recorded feeding events.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72">
                    <div className="space-y-2 pt-2 pr-4">
                        {displayLogs.map(log => (
                            <div key={log.id} className="group p-3 bg-secondary/50 rounded-lg text-sm flex justify-between items-center">
                                <div>
                                    <div className="flex justify-between font-medium items-baseline">
                                        <span>{log.foodItem}</span>
                                        <div className="flex items-baseline gap-2">
                                            {log.protein && <span className="text-xs text-muted-foreground">{log.protein.toFixed(1)}g p</span>}
                                            <span className="font-bold">{log.amount}g</span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                        <span>{format(parseISO(log.datetime), 'MMM d, yyyy')}</span>
                                        <span>{format(parseISO(log.datetime), 'HH:mm:ss')}</span>
                                    </div>
                                    {log.notes && <p className="text-xs mt-1 text-muted-foreground italic">"{log.notes}"</p>}
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


export function FeedingLogComponent({ logs, onEdit, onDelete }: FeedingLogProps) {
    const [lastLog, setLastLog] = useState<FeedingLog | null>(null);
    const [averageFoodPerHour, setAverageFoodPerHour] = useState(0);
    const [averageProteinPerHour, setAverageProteinPerHour] = useState(0);
    const [targetWeight, setTargetWeight] = useState('');
    const [percentage, setPercentage] = useState('5');
    const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);


    useEffect(() => {
        if (typeof window === 'undefined' || logs.length === 0) return;

        const sortedByTime = [...logs].sort((a,b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
        setLastLog(sortedByTime[sortedByTime.length - 1]);

        if (sortedByTime.length < 2) {
            setAverageFoodPerHour(0);
            setAverageProteinPerHour(0);
            return;
        }

        const firstLogTime = parseISO(sortedByTime[0].datetime);
        const lastLogTime = parseISO(sortedByTime[sortedByTime.length - 1].datetime);
        const totalHours = differenceInHours(lastLogTime, firstLogTime);

        if (totalHours > 0) {
            const totalFood = sortedByTime.reduce((sum, log) => sum + log.amount, 0);
            setAverageFoodPerHour(totalFood / totalHours);

            const totalProtein = sortedByTime.reduce((sum, log) => sum + (log.protein || 0), 0);
            setAverageProteinPerHour(totalProtein / totalHours);
        } else {
            setAverageFoodPerHour(0);
            setAverageProteinPerHour(0);
        }

    }, [logs]);

    useEffect(() => {
        const tWeight = parseFloat(targetWeight);
        const perc = parseFloat(percentage);
        if (!isNaN(tWeight) && !isNaN(perc) && tWeight > 0) {
            setCalculatedAmount((tWeight * perc) / 100);
        } else {
            setCalculatedAmount(null);
        }
    }, [targetWeight, percentage]);


  return (
    <div className="space-y-2">
      {logs.length > 0 ? (
        <>
            <div className="group flex flex-col p-2.5 bg-secondary/50 rounded-lg text-sm -mt-2">
                 <div className="font-medium flex items-center gap-2 whitespace-nowrap">
                    <Activity className="w-4 h-4 text-primary"/>
                    Avg. Hourly Consumption
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                    <div className="text-2xl font-bold text-primary">
                        {averageFoodPerHour.toFixed(1)}g/hr
                    </div>
                    <div className="text-lg font-semibold">
                        {averageProteinPerHour.toFixed(1)}p/hr
                    </div>
                </div>
            </div>

            <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                <div className="font-medium whitespace-nowrap">Last Feeding</div>
                <div className="flex justify-between items-baseline mt-2">
                    <div className="flex items-baseline gap-2">
                        <div className="text-xl font-bold text-primary">{logs[0].amount}g</div>
                        <div className="text-md font-semibold">{logs[0].foodItem}</div>
                    </div>
                    {logs[0].protein && <span className="text-sm text-muted-foreground">{logs[0].protein.toFixed(1)}g p</span>}
                </div>
                 <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                    <span>{format(parseISO(logs[0].datetime), 'MMM d, HH:mm')}</span>
                </div>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg text-sm">
              <div className="font-medium flex items-center gap-2 whitespace-nowrap mb-2">
                  <Calculator className="w-4 h-4 text-primary"/>
                  Feeding Calc
              </div>
              <div className="space-y-2">
                  <div className="flex items-center gap-2">
                      <Label htmlFor="targetWeight" className="w-1/2">Target Weight (g)</Label>
                      <Input id="targetWeight" type="number" placeholder="e.g. 650" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2">
                      <Label htmlFor="percentage" className="w-1/2">Percentage (%)</Label>
                      <Input id="percentage" type="number" placeholder="e.g. 5" value={percentage} onChange={(e) => setPercentage(e.target.value)} />
                  </div>
                  {calculatedAmount !== null && (
                      <div className="text-center pt-2">
                          <p className="text-xs text-muted-foreground">Recommended Amount</p>
                          <p className="text-lg font-bold text-primary">{calculatedAmount.toFixed(1)}g</p>
                      </div>
                  )}
              </div>
          </div>
        </>
      ) : (
        <p className="text-sm text-center text-muted-foreground py-10">No feeding records yet.</p>
      )}
    </div>
  );
}
