
"use client";

import Image from "next/image";
import { format, parseISO } from "date-fns";
import type { MuteLog } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";

interface MuteLogProps {
  logs: MuteLog[];
}

const getBadgeVariant = (condition: string) => {
    switch (condition) {
      case "Normal":
        return "default";
      case "Greenish":
      case "Blackish":
      case "Yellowish":
        return "destructive";
      default:
        return "secondary";
    }
};

export function ViewAllMuteLogsDialog({ open, onOpenChange, logs }: { open: boolean, onOpenChange: (open: boolean) => void, logs: MuteLog[] }) {
    const displayLogs = [...logs].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>All Mute & Casting Logs</DialogTitle>
                    <DialogDescription>
                        A complete history of all recorded mutes and castings.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72">
                    <div className="space-y-4 pt-2 pr-4">
                        {displayLogs.map((log) => (
                             <div key={log.id} className="p-3 bg-secondary/50 rounded-lg text-sm space-y-2">
                               {log.imageUrl && (
                                 <div className="relative aspect-video rounded-md overflow-hidden">
                                     <Image src={log.imageUrl} alt={log.condition} layout="fill" objectFit="cover" data-ai-hint="bird droppings" />
                                 </div>
                               )}
                               <div className="flex justify-between items-center">
                                 <span className="font-medium">Mute/Casting</span>
                                 <Badge variant={getBadgeVariant(log.condition)}>{log.condition}</Badge>
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

export function MuteLogComponent({ logs }: MuteLogProps) {
  return (
    <div className="space-y-4">
      {logs.length > 0 ? (
        <ScrollArea className="h-64">
           <div className="space-y-4 pr-4">
          {logs.slice(0, 3).map((log) => (
            <div key={log.id} className="p-3 bg-secondary/50 rounded-lg text-sm space-y-2">
              {log.imageUrl && (
                <div className="relative aspect-video rounded-md overflow-hidden">
                    <Image src={log.imageUrl} alt={log.condition} layout="fill" objectFit="cover" data-ai-hint="bird droppings" />
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-medium">Mute/Casting</span>
                <Badge variant={getBadgeVariant(log.condition)}>{log.condition}</Badge>
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
        <p className="text-sm text-center text-muted-foreground py-10">No mute or casting records.</p>
      )}
    </div>
  );
}
