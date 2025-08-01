
"use client";

import { format, parseISO } from "date-fns";
import type { WeightLog } from "@/lib/types";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { TrendingUp, TrendingDown, MoreVertical, Pencil, Trash2 } from "lucide-react";

interface WeightLogComponentProps {
  logs: WeightLog[];
  onEdit: (log: WeightLog) => void;
  onDelete: (log: WeightLog) => void;
}

export function WeightLogComponent({ logs, onEdit, onDelete }: WeightLogComponentProps) {
  const sortedLogs = [...logs].sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
  
  const lastLog = sortedLogs.length > 0 ? sortedLogs[0] : null;

  const getChangeForLog = (currentLog: WeightLog) => {
    const currentIndex = sortedLogs.findIndex(log => log.datetime === currentLog.datetime);
    if (currentIndex === -1 || currentIndex >= sortedLogs.length - 1) return null;
    const previousLog = sortedLogs[currentIndex + 1];
    return currentLog.weight - previousLog.weight;
  }

  return (
    <div className="space-y-2">
      {lastLog ? (
        <div className="group flex items-center justify-between p-3 bg-secondary/50 rounded-lg text-sm">
          <div>
            <div className="font-medium">Last Entry</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
               <span>{lastLog.weight}g</span>
               <span className="text-muted-foreground/50">{format(parseISO(lastLog.datetime), 'MMM d, HH:mm:ss')}</span>
               {(log => {
                 const weightChange = getChangeForLog(log);
                 return weightChange !== null && !isNaN(weightChange) && (
                   <span className={`flex items-center ${weightChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {weightChange >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                    {weightChange.toFixed(1)}g
                   </span>
                 );
               })(lastLog)}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(lastLog)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(lastLog)} className="text-red-500 focus:text-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <p className="text-sm text-center text-muted-foreground py-10">No weight records yet.</p>
      )}
    </div>
  );
}
