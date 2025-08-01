
"use client";

import Image from "next/image";
import { format, parseISO } from "date-fns";
import type { TrainingLog } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

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

const getPerformanceBgColor = (performance?: string) => {
    switch (performance) {
        case 'Positive': return 'bg-green-100 dark:bg-green-900/30';
        case 'Negative': return 'bg-red-100 dark:bg-red-900/30';
        default: return 'bg-secondary/50';
    }
}

const getPerformanceTextColor = (performance?: string) => {
    switch (performance) {
        case 'Positive': return 'text-green-900 dark:text-green-100';
        case 'Negative': return 'text-red-900 dark:text-red-100';
        default: return 'text-foreground';
    }
}

const getPerformanceMutedTextColor = (performance?: string) => {
    switch (performance) {
        case 'Positive': return 'text-green-700 dark:text-green-300';
        case 'Negative': return 'text-red-700 dark:text-red-300';
        default: return 'text-muted-foreground';
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

  return (
    <div className="space-y-2 -mt-2">
      {sortedLogs.length > 0 ? (
          <div className="space-y-2">
          {sortedLogs.slice(0, 3).map((log) => (
            <div key={log.id} className={cn("p-3 rounded-lg text-sm space-y-2", getPerformanceBgColor(log.performance))}>
              {log.imageUrl && (
                <div className="relative aspect-video rounded-md overflow-hidden">
                    <Image src={log.imageUrl} alt={log.behavior} layout="fill" objectFit="cover" data-ai-hint="falcon training" />
                </div>
              )}
              <div className={cn("font-medium", getPerformanceTextColor(log.performance))}>{log.behavior}</div>
              <div className={cn("flex justify-between items-center text-xs", getPerformanceMutedTextColor(log.performance))}>
                <span>{format(parseISO(log.datetime), 'MMM d, yyyy HH:mm:ss')}</span>
                 <div className="flex items-center gap-2">
                    {log.performance && (
                        <Badge variant={getPerformanceBadgeVariant(log.performance)}>{log.performance}</Badge>
                    )}
                    <Badge variant="outline">{log.duration} min</Badge>
                </div>
              </div>
              {log.notes && <p className={cn("text-xs mt-1 italic", getPerformanceMutedTextColor(log.performance))}>"{log.notes}"</p>}
            </div>
          ))}
          </div>
      ) : (
        <p className="text-sm text-center text-muted-foreground py-10">No training records yet.</p>
      )}
    </div>
  );
}
