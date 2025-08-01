
"use client";

import Image from "next/image";
import { format, parseISO } from "date-fns";
import type { MuteLog } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
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

    

    