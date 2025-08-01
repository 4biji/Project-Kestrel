
"use client";

import { useState } from "react";
import { isToday, isThisWeek, isThisMonth, parseISO, format } from "date-fns";
import type { HusbandryTask, PredefinedHusbandryTask } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { MoreVertical, Pencil, Trash2, Calendar, CalendarCheck, CalendarClock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

interface HusbandryLogProps {
  predefinedTasks: PredefinedHusbandryTask[];
  loggedTasks: HusbandryTask[];
  onCompleteTask: (task: string) => void;
}

interface CommonProps {
    tasks: HusbandryTask[];
    onEdit: (task: HusbandryTask) => void;
    onDelete: (task: HusbandryTask) => void;
}

export function ViewAllHusbandryTasksDialog({ open, onOpenChange, tasks, onEdit, onDelete }: { open: boolean, onOpenChange: (open: boolean) => void } & CommonProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>All Husbandry Tasks</DialogTitle>
                    <DialogDescription>
                        A complete history of all husbandry tasks.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72">
                    <div className="space-y-2 pt-2 pr-4">
                        {tasks.map(task => (
                             <div key={task.id} className="group flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id={`dialog-${task.id}`}
                                        checked={task.completed}
                                        disabled
                                    />
                                    <div className="flex flex-col">
                                    <Label
                                        htmlFor={`dialog-${task.id}`}
                                        className={`text-sm ${
                                            task.completed ? "text-muted-foreground line-through" : ""
                                        }`}
                                    >
                                        {task.task}
                                    </Label>
                                     {task.completed && (
                                        <span className="text-xs text-muted-foreground">
                                            {format(parseISO(task.datetime), 'MMM d, yyyy HH:mm')}
                                        </span>
                                    )}
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        
                                            <DropdownMenuItem onClick={() => onEdit(task)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                <span>Edit</span>
                                            </DropdownMenuItem>
                                        
                                            <DropdownMenuItem onClick={() => onDelete(task)} className="text-red-500 focus:text-red-500">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        
                                    </DropdownMenuContent>
                                </DropdownMenu>
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

export function HusbandryLog({ predefinedTasks, loggedTasks, onCompleteTask }: HusbandryLogProps) {
  
  const getIsTaskCompleted = (task: string, frequency: 'daily' | 'weekly' | 'monthly') => {
    return loggedTasks.some(log => {
      if (log.task !== task || !log.completed) return false;
      const logDate = parseISO(log.datetime);
      switch(frequency) {
        case 'daily': return isToday(logDate);
        case 'weekly': return isThisWeek(logDate, { weekStartsOn: 1 });
        case 'monthly': return isThisMonth(logDate);
        default: return false;
      }
    });
  };

  const renderTaskList = (tasks: PredefinedHusbandryTask[], frequency: 'daily' | 'weekly' | 'monthly') => {
    if (tasks.length === 0) {
      return <p className="text-xs text-center text-muted-foreground py-2">No {frequency} tasks defined.</p>;
    }
    return (
      <div className="space-y-2">
        {tasks.map(task => {
          const isCompleted = getIsTaskCompleted(task.task, frequency);
          return (
            <div key={task.id} className="flex items-center space-x-3">
              <Checkbox
                id={task.id}
                checked={isCompleted}
                onCheckedChange={() => !isCompleted && onCompleteTask(task.task)}
                disabled={isCompleted}
              />
              <Label
                htmlFor={task.id}
                className={`text-sm ${
                  isCompleted ? "text-muted-foreground line-through" : ""
                }`}
              >
                {task.task}
              </Label>
            </div>
          );
        })}
      </div>
    );
  };

  const dailyTasks = predefinedTasks.filter(t => t.frequency === 'daily');
  const weeklyTasks = predefinedTasks.filter(t => t.frequency === 'weekly');
  const monthlyTasks = predefinedTasks.filter(t => t.frequency === 'monthly');

  return (
    <div className="space-y-2 -mt-2">
        <div className="p-3 bg-secondary/50 rounded-lg text-sm">
            <div className="font-medium flex items-center gap-2 whitespace-nowrap">
                <Calendar className="w-4 h-4 text-primary"/>
                Daily Tasks
            </div>
            <div className="mt-2">
                {renderTaskList(dailyTasks, 'daily')}
            </div>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg text-sm">
            <div className="font-medium flex items-center gap-2 whitespace-nowrap">
                <CalendarCheck className="w-4 h-4 text-primary"/>
                Weekly Tasks
            </div>
            <div className="mt-2">
                {renderTaskList(weeklyTasks, 'weekly')}
            </div>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg text-sm">
            <div className="font-medium flex items-center gap-2 whitespace-nowrap">
                <CalendarClock className="w-4 h-4 text-primary"/>
                Monthly Tasks
            </div>
            <div className="mt-2">
                {renderTaskList(monthlyTasks, 'monthly')}
            </div>
        </div>
    </div>
  );
}
