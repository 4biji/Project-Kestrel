
"use client";

import Image from "next/image";
import { format, parseISO, differenceInDays } from "date-fns";
import type { TrainingLog, PerformanceRating } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { MoreVertical, Pencil, Trash2, Footprints, Clock, BarChart3 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import React from "react";

interface TrainingLogProps {
  logs: TrainingLog[];
  onEdit: (log: TrainingLog) => void;
  onDelete: (log: TrainingLog) => void;
}

interface CommonProps {
    logs: TrainingLog[];
    onEdit: (log: TrainingLog) => void;
    onDelete: (log: TrainingLog) => void;
}

const getPerformanceBadgeVariant = (performance?: string) => {
    switch (performance) {
      case 'Positive': return 'default';
      case 'Negative': return 'destructive';
      default: return 'secondary';
    }
}

export function ViewAllTrainingLogsDialog({ open, onOpenChange, logs, onEdit, onDelete }: { open: boolean, onOpenChange: (open: boolean) => void } & CommonProps) {
    const displayLogs = [...logs].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>All Training Logs</DialogTitle>
                    <DialogDescription>
                        A complete history of all recorded training sessions.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72">
                    <div className="space-y-4 pt-2 pr-4">
                        {displayLogs.map((log) => (
                            <div key={log.id} className="group p-3 bg-secondary/50 rounded-lg text-sm space-y-2 relative">
                                {log.imageUrl && (
                                    <div className="relative aspect-video rounded-md overflow-hidden">
                                        <Image src={log.imageUrl} alt={log.behavior} layout="fill" objectFit="cover" data-ai-hint="falcon training" />
                                    </div>
                                )}
                                <div className="font-medium">{log.behavior}</div>
                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                    <span>{format(parseISO(log.datetime), 'MMM d, yyyy HH:mm:ss')}</span>
                                    <div className="flex items-center gap-2">
                                        {log.performance && (
                                            <Badge variant={getPerformanceBadgeVariant(log.performance)}>{log.performance}</Badge>
                                        )}
                                        <Badge variant="outline">{log.duration} min</Badge>
                                    </div>
                                </div>
                                <p className="text-xs mt-1 text-muted-foreground italic">"{log.notes}"</p>
                                <div className="absolute top-1 right-1">
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


export function TrainingLogComponent({ logs }: TrainingLogProps) {
    const sortedLogs = [...logs].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
    const lastLog = sortedLogs.length > 0 ? sortedLogs[0] : null;

    const weeklyStats = React.useMemo(() => {
        const now = new Date();
        const last7DaysLogs = sortedLogs.filter(log => differenceInDays(now, parseISO(log.datetime)) <= 7);
        const totalDuration = last7DaysLogs.reduce((sum, log) => sum + log.duration, 0);
        const performanceCounts = last7DaysLogs.reduce((acc, log) => {
            if (log.performance) {
                acc[log.performance] = (acc[log.performance] || 0) + 1;
            }
            return acc;
        }, {} as Record<PerformanceRating, number>);
        return { totalDuration, performanceCounts };
    }, [sortedLogs]);


  return (
    <div className="space-y-2 -mt-2">
      {logs.length > 0 && lastLog ? (
          <div className="space-y-2">
            <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                <div className="font-medium flex items-center gap-2 whitespace-nowrap"><Footprints className="w-4 h-4 text-primary"/> Last Session</div>
                <div className="flex justify-between items-baseline mt-2">
                    <div className="flex items-baseline gap-2">
                        <div className="text-lg font-bold text-primary">{lastLog.behavior}</div>
                    </div>
                    {lastLog.performance && (
                        <Badge variant={getPerformanceBadgeVariant(lastLog.performance)}>{lastLog.performance}</Badge>
                    )}
                </div>
                 <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                    <span>{format(parseISO(lastLog.datetime), 'MMM d, HH:mm')}</span>
                    <span>{lastLog.duration} min</span>
                </div>
            </div>
             <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                <div className="font-medium flex items-center gap-2 whitespace-nowrap"><Clock className="w-4 h-4 text-primary"/> Weekly Total</div>
                <div className="text-xl font-bold text-primary mt-2">
                  {weeklyStats.totalDuration} minutes
              </div>
            </div>
             <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                <div className="font-medium flex items-center gap-2 whitespace-nowrap"><BarChart3 className="w-4 h-4 text-primary"/> Weekly Performance</div>
                <div className="text-xs text-muted-foreground mt-2 flex justify-around">
                    <span>P: {weeklyStats.performanceCounts.Positive || 0}</span>
                    <span>N: {weeklyStats.performanceCounts.Neutral || 0}</span>
                    <span>N: {weeklyStats.performanceCounts.Negative || 0}</span>
                </div>
            </div>
          </div>
      ) : (
        <p className="text-sm text-center text-muted-foreground py-10">No training records yet.</p>
      )}
    </div>
  );
}
