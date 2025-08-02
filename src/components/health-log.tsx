
"use client";

import { format, parseISO } from "date-fns";
import type { HealthLog, PredefinedHealthIssue, FirstAidLink } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { MoreVertical, Pencil, Trash2, AlertTriangle, Plus, PlusSquare, Siren } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface HealthLogProps {
  logs: HealthLog[];
  predefinedIssues: PredefinedHealthIssue[];
  firstAidLinks: FirstAidLink[];
  onEdit: (log: HealthLog) => void;
  onDelete: (log: HealthLog) => void;
  onIssueClick: (issue: PredefinedHealthIssue) => void;
}

interface CommonProps extends Omit<HealthLogProps, 'onIssueClick' | 'firstAidLinks'> {}

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


export function HealthLogComponent({ logs, predefinedIssues, firstAidLinks, onEdit, onDelete, onIssueClick }: HealthLogProps) {
  const sortedIssues = [...predefinedIssues].sort((a,b) => b.severity - a.severity);

  return (
    <div className="space-y-2 h-full">
      {predefinedIssues.length > 0 || firstAidLinks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            <Card className="flex flex-col h-full">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Siren className="w-4 h-4" />
                        Illnesses / Injuries
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="flex-grow overflow-hidden">
                    <ScrollArea className="h-full pr-4 -mr-4">
                        <div className="space-y-1">
                            {sortedIssues.map((issue) => (
                                <Button 
                                    key={issue.id} 
                                    variant="ghost" 
                                    className="flex justify-between items-center text-sm py-0.5 w-full h-auto font-normal"
                                    onClick={() => onIssueClick(issue)}
                                >
                                    <span>{issue.issue}</span>
                                    <Badge variant={getSeverityBadgeVariant(issue.severity)} className="px-1.5 py-0 text-xs">{issue.severity}</Badge>
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                 </CardContent>
            </Card>
          <Card className="flex flex-col justify-between h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">First Aid Resources</CardTitle>
                <ul className="space-y-2 text-sm pt-2">
                    {firstAidLinks.map(link => (
                         <li key={link.id}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                                <PlusSquare className="h-4 w-4" /> {link.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full">
            <AlertTriangle className="w-12 h-12 mb-4" />
            <p>No predefined health issues or links.</p>
            <p className="text-xs">Add some in the settings to see them here.</p>
        </div>
      )}
    </div>
  );
}
