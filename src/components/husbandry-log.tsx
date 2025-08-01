"use client";

import { useState } from "react";
import type { HusbandryTask } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface HusbandryLogProps {
  tasks: HusbandryTask[];
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
        tasks.map((task) => (
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
