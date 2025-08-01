
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { PredefinedHusbandryTask } from "@/lib/types";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const husbandryTaskFormSchema = z.object({
  task: z.string().min(1, "Task is required"),
  frequency: z.enum(["daily", "weekly", "monthly"]),
});

type HusbandryTaskFormValues = z.infer<typeof husbandryTaskFormSchema>;

interface HusbandrySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: PredefinedHusbandryTask[];
  onSave: (tasks: PredefinedHusbandryTask[]) => void;
}

export function HusbandrySettingsDialog({
  open,
  onOpenChange,
  tasks: initialTasks,
  onSave,
}: HusbandrySettingsDialogProps) {
  const [tasks, setTasks] = useState(initialTasks);

  const form = useForm<HusbandryTaskFormValues>({
    resolver: zodResolver(husbandryTaskFormSchema),
    defaultValues: {
      task: "",
      frequency: "daily",
    },
  });

  const handleAdd = (values: HusbandryTaskFormValues) => {
    const newTask: PredefinedHusbandryTask = {
      id: `task-${Date.now()}`,
      ...values,
    };
    setTasks([...tasks, newTask]);
    form.reset();
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleSave = () => {
    onSave(tasks);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Husbandry Tasks</DialogTitle>
          <DialogDescription>
            Create a list of predefined tasks to quickly log your routines.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAdd)} className="flex items-end gap-2 pt-4">
            <FormField
              control={form.control}
              name="task"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>New Task</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Clean mews" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button type="submit">Add</Button>
          </form>
        </Form>

        <p className="text-xs text-muted-foreground">
          Your predefined tasks. You can quickly add these from the husbandry log.
        </p>
        <ScrollArea className="h-48 border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.task}</TableCell>
                  <TableCell className="capitalize">{task.frequency}</TableCell>
                  <TableCell className="text-right">
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleDelete(task.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
