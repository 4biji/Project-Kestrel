
"use client";

import Image from "next/image";
import { format, parseISO } from "date-fns";
import type { MuteLog } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { MoreVertical, Pencil, Trash2, BookOpen } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface MuteLogProps {
  logs: MuteLog[];
  onEdit: (log: MuteLog) => void;
  onDelete: (log: MuteLog) => void;
}

interface CommonProps {
    logs: MuteLog[];
    onEdit: (log: MuteLog) => void;
    onDelete: (log: MuteLog) => void;
}


const getBadgeVariant = (condition?: string) => {
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

export function ViewAllMuteLogsDialog({ open, onOpenChange, logs, onEdit, onDelete }: { open: boolean, onOpenChange: (open: boolean) => void } & CommonProps) {
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
                             <div key={log.id} className="group p-3 bg-secondary/50 rounded-lg text-sm space-y-2 relative">
                               <div className="flex justify-between items-center">
                                 <span className="font-medium">{log.type}</span>
                                 {log.type === 'Mute' && log.condition && (
                                     <Badge variant={getBadgeVariant(log.condition)}>{log.condition}</Badge>
                                 )}
                               </div>
                                <div className="text-xs text-muted-foreground flex justify-between">
                                  <span>{format(parseISO(log.datetime), 'MMM d, yyyy')}</span>
                                  <span>{format(parseISO(log.datetime), 'HH:mm:ss')}</span>
                                </div>
                               {log.notes && <p className="text-xs mt-1 text-muted-foreground italic">"{log.notes}"</p>}
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

export function MuteLogComponent({ logs, onEdit, onDelete }: MuteLogProps) {
    const sortedLogs = [...logs].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
    const lastMute = sortedLogs.find(log => log.type === 'Mute');
    const lastCasting = sortedLogs.find(log => log.type === 'Casting');

  return (
    <div className="space-y-2 -mt-2">
      <div className="space-y-2">
        {logs.length > 0 ? (
          <>
            {lastMute && (
              <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                  <div className="font-medium">Last Mute</div>
                   <div className="flex justify-between items-baseline mt-2">
                       {lastMute.condition && (
                          <Badge variant={getBadgeVariant(lastMute.condition)}>{lastMute.condition}</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{format(parseISO(lastMute.datetime), 'MMM d, HH:mm')}</span>
                  </div>
                  {lastMute.notes && <p className="text-xs mt-1 text-muted-foreground italic">"{lastMute.notes}"</p>}
              </div>
            )}

            {lastCasting && (
              <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                  <div className="font-medium">Last Casting</div>
                  <div className="text-xs text-muted-foreground mt-2">{format(parseISO(lastCasting.datetime), 'MMM d, HH:mm')}</div>
                  {lastCasting.notes && <p className="text-xs mt-1 text-muted-foreground italic">"{lastCasting.notes}"</p>}
              </div>
            )}

            {!lastMute && !lastCasting && (
               <p className="text-sm text-center text-muted-foreground py-10">No mute or casting records.</p>
            )}
          </>
        ) : (
          <p className="text-sm text-center text-muted-foreground py-10">No mute or casting records.</p>
        )}
      </div>

      <div className="p-3 bg-secondary/50 rounded-lg text-sm">
          <div className="font-medium flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary"/> Resources</div>
           <div className="text-xs text-muted-foreground mt-2 space-y-1">
              <a href="https://www.themodernapprentice.com/mutes.htm" target="_blank" rel="noopener noreferrer" className="block hover:underline text-primary">The Modern Apprentice</a>
              <a href="https://clinicalavianpathologyservices.com/feces-mutes/" target="_blank" rel="noopener noreferrer" className="block hover:underline text-primary">Clinical Avian Pathology</a>
          </div>
      </div>
    </div>
  );
}
