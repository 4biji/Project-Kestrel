
"use client";

import { format, parseISO } from "date-fns";
import type { FeedingLog } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

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
                                    <div className="flex justify-between font-medium">
                                        <span>{log.foodItem}</span>
                                        <span>{log.amount}g</span>
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
    );
}


export function FeedingLogComponent({ logs, onEdit, onDelete }: FeedingLogProps) {
  return (
    <div className="space-y-4">
      {logs.length > 0 ? (
        <ScrollArea className="h-64">
            <div className="space-y-3 pr-4">
            {logs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-3 bg-secondary/50 rounded-lg text-sm">
                <div className="flex justify-between font-medium">
                    <span>{log.foodItem}</span>
                    <span>{log.amount}g</span>
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                    <span>{format(parseISO(log.datetime), 'MMM d, yyyy')}</span>
                    <span>{format(parseISO(log.datetime), 'HH:mm:ss')}</span>
                </div>
                {log.notes && <p className="text-xs mt-1 text-muted-foreground italic">"{log.notes}"</p>}
                </div>
            ))}
            </div>
        </ScrollArea>
      ) : (
        <p className="text-sm text-center text-muted-foreground py-10">No feeding records yet.</p>
      )}
    </div>
  );
}

    
