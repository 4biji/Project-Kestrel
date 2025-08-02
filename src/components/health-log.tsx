
"use client";

import { format, parseISO } from "date-fns";
import type { HealthLog, PredefinedHealthIssue } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { MoreVertical, Pencil, Trash2, AlertTriangle, Plus, Link } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface HealthLogProps {
  logs: HealthLog[];
  predefinedIssues: PredefinedHealthIssue[];
  onEdit: (log: HealthLog) => void;
  onDelete: (log: HealthLog) => void;
}

interface CommonProps extends HealthLogProps {}

const getSeverityBadgeVariant = (severity: number): "destructive" | "secondary" | "default" => {
    if (severity >= 8) return "destructive";
    if (severity >= 4) return "secondary";
    return "default";
}

export function ViewAllHealthLogsDialog({ open, onOpenChange, logs, predefinedIssues, onEdit, onDelete }: { open: boolean, onOpenChange: (open: boolean) => void } & CommonProps) {
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
                        {displayLogs.map((log) => {
                            const issue = predefinedIssues.find(i => i.issue === log.condition);
                            const severity = issue?.severity || 0;
                            return (
                            <div key={log.id} className="group p-3 bg-secondary/50 rounded-lg text-sm space-y-2 relative">
                                <div className="flex justify-between items-start">
                                    <div className="font-medium">{log.condition}</div>
                                    <Badge variant={getSeverityBadgeVariant(severity)}>Severity: {severity}</Badge>
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
                        )})}
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


export function HealthLogComponent({ logs, predefinedIssues, onEdit, onDelete }: HealthLogProps) {
  const topSevereLog = [...logs]
    .map(log => {
        const issue = predefinedIssues.find(i => i.issue === log.condition);
        return { ...log, severity: issue?.severity || 0 };
    })
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 1);

  return (
    <div className="space-y-2 h-full">
      {logs.length > 0 && topSevereLog.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            <div className="space-y-4">
            {topSevereLog.map(log => (
                <Card key={log.id} className={cn(
                    "flex flex-col justify-between flex-grow",
                    log.severity >= 8 ? "border-destructive" : log.severity >= 4 ? "border-yellow-500" : ""
                )}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center justify-between">
                            <span>{log.condition}</span>
                            <Badge variant={getSeverityBadgeVariant(log.severity)}>
                            {log.severity}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {log.treatment}
                    </p>
                    <p className="text-xs text-muted-foreground pt-2">
                        {format(parseISO(log.datetime), "MMM d, yyyy")}
                    </p>
                    </CardContent>
                </Card>
            ))}
            </div>
          <Card className="flex flex-col justify-between h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">First Aid Resources</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm">
                    <li>
                        <a href="https://www.themodernapprentice.com/firstaid.htm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                            <Link className="h-4 w-4" /> The Modern Apprentice
                        </a>
                    </li>
                     <li>
                        <a href="https://nysfa.org/health-medical/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                            <Link className="h-4 w-4" /> NYS Falconry Association
                        </a>
                    </li>
                </ul>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full">
            <AlertTriangle className="w-12 h-12 mb-4" />
            <p>No critical health issues logged.</p>
            <p className="text-xs">Log a health event to see it here.</p>
        </div>
      )}
    </div>
  );
}
