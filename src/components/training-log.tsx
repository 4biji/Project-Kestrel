
"use client";

import Image from "next/image";
import { format, parseISO } from "date-fns";
import type { TrainingLog } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";

interface TrainingLogProps {
  logs: TrainingLog[];
}

export function ViewAllTrainingLogsDialog({ open, onOpenChange, logs }: { open: boolean, onOpenChange: (open: boolean) => void, logs: TrainingLog[] }) {
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
                            <div key={log.id} className="p-3 bg-secondary/50 rounded-lg text-sm space-y-2">
                                {log.imageUrl && (
                                    <div className="relative aspect-video rounded-md overflow-hidden">
                                        <Image src={log.imageUrl} alt={log.behavior} layout="fill" objectFit="cover" data-ai-hint="falcon training" />
                                    </div>
                                )}
                                <div className="font-medium">{log.behavior}</div>
                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                    <span>{format(parseISO(log.datetime), 'MMM d, yyyy HH:mm:ss')}</span>
                                    <Badge variant="outline">{log.duration} min</Badge>
                                </div>
                                <p className="text-xs mt-1 text-muted-foreground italic">"{log.notes}"</p>
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
  return (
    <div className="space-y-4">
      {logs.length > 0 ? (
        <ScrollArea className="h-64">
          <div className="space-y-4 pr-4">
          {logs.slice(0, 3).map((log) => (
            <div key={log.id} className="p-3 bg-secondary/50 rounded-lg text-sm space-y-2">
              {log.imageUrl && (
                <div className="relative aspect-video rounded-md overflow-hidden">
                    <Image src={log.imageUrl} alt={log.behavior} layout="fill" objectFit="cover" data-ai-hint="falcon training" />
                </div>
              )}
              <div className="font-medium">{log.behavior}</div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{format(parseISO(log.datetime), 'MMM d, yyyy HH:mm:ss')}</span>
                <Badge variant="outline">{log.duration} min</Badge>
              </div>
              <p className="text-xs mt-1 text-muted-foreground italic">"{log.notes}"</p>
            </div>
          ))}
          </div>
        </ScrollArea>
      ) : (
        <p className="text-sm text-center text-muted-foreground py-10">No training records yet.</p>
      )}
    </div>
  );
}
