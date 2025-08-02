
"use client";

import { format, parseISO } from "date-fns";
import type { WeightLog } from "@/lib/types";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { TrendingUp, TrendingDown, MoreVertical, Pencil, Trash2 } from "lucide-react";

interface ViewAllLogsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    logs: WeightLog[];
    onEdit: (log: WeightLog) => void;
    onDelete: (log: WeightLog) => void;
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
                                        <span className="font-bold text-sm text-foreground">{log.weight}g</span>
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
