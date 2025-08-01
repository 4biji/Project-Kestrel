
"use client";

import { format, parseISO } from "date-fns";
import type { FeedingLog } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";

interface FeedingLogProps {
  logs: FeedingLog[];
}

export function ViewAllFeedingLogsDialog({ open, onOpenChange, logs }: { open: boolean, onOpenChange: (open: boolean) => void, logs: FeedingLog[] }) {
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


export function FeedingLogComponent({ logs }: FeedingLogProps) {
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
