
"use client";

import { format, parseISO } from "date-fns";
import type { WeightLog } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { TrendingUp, TrendingDown, MoreVertical, Pencil, Trash2 } from "lucide-react";

interface WeightLogComponentProps {
  logs: WeightLog[];
  onEdit: (log: WeightLog) => void;
  onDelete: (log: WeightLog) => void;
}

export function WeightLogComponent({ logs, onEdit, onDelete }: WeightLogComponentProps) {
  const getWeightChange = (index: number) => {
    if (index === 0) return null;
    const currentWeight = sortedLogs[index].weight;
    const previousWeight = sortedLogs[index - 1].weight;
    // Note: with descending sort, previous is the one with the higher index
    const change = sortedLogs[index].weight - sortedLogs[index + 1]?.weight;
    return change;
  };
  
  const sortedLogs = [...logs].sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

  const getChangeForLog = (currentLog: WeightLog, index: number) => {
    if(index >= sortedLogs.length - 1) return null;
    const previousLog = sortedLogs[index+1];
    return currentLog.weight - previousLog.weight;
  }

  return (
    <div className="space-y-2">
      {sortedLogs.length > 0 ? (
        <ScrollArea className="h-64">
            <div className="space-y-2 pr-4">
            {sortedLogs.map((log, index) => {
              const weightChange = getChangeForLog(log, index);
              return (
                <div key={log.datetime} className="group flex items-center justify-between p-3 bg-secondary/50 rounded-lg text-sm">
                  <div>
                    <div className="font-medium">{format(parseISO(log.datetime), 'MMMM d, yyyy')}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                       <span>{log.weight}g</span>
                       <span className="text-muted-foreground/50">{format(parseISO(log.datetime), 'HH:mm:ss')}</span>
                       {weightChange !== null && !isNaN(weightChange) && (
                           <span className={`flex items-center ${weightChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {weightChange >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                            {weightChange.toFixed(1)}g
                           </span>
                        )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
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
              )
            })}
            </div>
        </ScrollArea>
      ) : (
        <p className="text-sm text-center text-muted-foreground py-10">No weight records yet.</p>
      )}
    </div>
  );
}
