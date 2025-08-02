
"use client";

import { format, parseISO } from "date-fns";
import type { HealthLog } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

interface HealthLogProps {
  logs: HealthLog[];
  onEdit: (log: HealthLog) => void;
  onDelete: (log: HealthLog) => void;
}

interface CommonProps {
    logs: HealthLog[];
    onEdit: (log: HealthLog) => void;
    onDelete: (log: HealthLog) => void;
}

const getSeverityBadgeVariant = (severity: number) => {
    if (severity >= 8) return "destructive";
    if (severity >= 4) return "secondary";
    return "default";
}

export function ViewAllHealthLogsDialog({ open, onOpenChange, logs, onEdit, onDelete }: { open: boolean, onOpenChange: (open: boolean) => void } & CommonProps) {
    const displayLogs = [...logs].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>All Health Logs</DialogTitle>
                    <DialogDescription>
                        A complete history of all recorded treatments.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72">
                    <div className="space-y-4 pt-2 pr-4">
                        {displayLogs.map((log) => (
                            <div key={log.id} className="group p-3 bg-secondary/50 rounded-lg text-sm space-y-2 relative">
                                <div className="flex justify-between items-start">
                                    <div className="font-medium">{log.condition}</div>
                                    <Badge variant={getSeverityBadgeVariant(log.severity)}>Severity: {log.severity}</Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {format(parseISO(log.datetime), 'MMM d, yyyy HH:mm')}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">Treatment:</p>
                                    <p className="text-xs text-muted-foreground">{log.treatment}</p>
                                </div>
                                {log.notes && (
                                    <div>
                                        <p className="text-xs font-semibold">Notes:</p>
                                        <p className="text-xs text-muted-foreground italic">"{log.notes}"</p>
                                    </div>
                                )}
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


export function HealthLogComponent({ logs, onEdit, onDelete }: HealthLogProps) {
  const sortedLogs = [...logs].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

  return (
    <div className="space-y-4">
      {sortedLogs.length > 0 ? (
        <ScrollArea className="h-full">
            <div className="space-y-4 pr-4">
                {sortedLogs.map(log => (
                    <div key={log.id} className="group p-3 bg-secondary/50 rounded-lg text-sm space-y-2 relative">
                        <div className="flex justify-between items-start">
                             <div className="font-medium">{log.condition}</div>
                             <Badge variant={getSeverityBadgeVariant(log.severity)}>Severity: {log.severity}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {format(parseISO(log.datetime), 'MMM d, yyyy HH:mm')}
                        </div>
                        <div>
                            <p className="text-xs font-semibold">Treatment:</p>
                            <p className="text-xs text-muted-foreground">{log.treatment}</p>
                        </div>
                        {log.notes && (
                            <div>
                                <p className="text-xs font-semibold">Notes:</p>
                                <p className="text-xs text-muted-foreground italic">"{log.notes}"</p>
                            </div>
                        )}
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
      ) : (
        <p className="text-sm text-center text-muted-foreground py-10">No health records yet.</p>
      )}
    </div>
  );
}
