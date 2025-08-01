
"use client";

import { useState } from "react";
import type { HusbandryTask } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface HusbandryLogProps {
  tasks: HusbandryTask[];
}


export function ViewAllHusbandryTasksDialog({ open, onOpenChange, tasks }: { open: boolean, onOpenChange: (open: boolean) => void, tasks: HusbandryTask[] }) {
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
                            <div key={task.id} className="flex items-center space-x-3 p-2 bg-secondary/50 rounded-lg">
                                <Checkbox
                                    id={`dialog-${task.id}`}
                                    checked={task.completed}
                                    disabled
                                />
                                <Label
                                    htmlFor={`dialog-${task.id}`}
                                    className={`text-sm ${
                                        task.completed ? "text-muted-foreground line-through" : ""
                                    }`}
                                >
                                    {task.task}
                                </Label>
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

export function HusbandryLog({ tasks: initialTasks }: HusbandryLogProps) {
  const [tasks, setTasks] = useState(initialTasks);

  const handleCheckedChange = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="space-y-4">
      {tasks.length > 0 ? (
        tasks.slice(0, 5).map((task) => (
          <div key={task.id} className="flex items-center space-x-3">
            <Checkbox
              id={task.id}
              checked={task.completed}
              onCheckedChange={() => handleCheckedChange(task.id)}
            />
            <Label
              htmlFor={task.id}
              className={`text-sm ${
                task.completed ? "text-muted-foreground line-through" : ""
              }`}
            >
              {task.task}
            </Label>
          </div>
        ))
      ) : (
        <p className="text-sm text-center text-muted-foreground py-10">No husbandry tasks.</p>
      )}
    </div>
  );
}
