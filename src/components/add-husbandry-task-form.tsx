
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { HusbandryTask, PredefinedHusbandryTask } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  task: z.string().min(1, "Task description is required."),
});

type FormValues = z.infer<typeof formSchema>;

interface AddHusbandryTaskFormProps {
  birdName: string;
  predefinedTasks: PredefinedHusbandryTask[];
  onSubmit: (data: Omit<HusbandryTask, "id" | "completed" | "datetime" | "logType">) => void;
  onCancel: () => void;
}

export function AddHusbandryTaskForm({ birdName, predefinedTasks, onSubmit, onCancel }: AddHusbandryTaskFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-muted-foreground">
            Add a new husbandry task for {birdName}.
        </p>
        
        {predefinedTasks.length > 0 && (
            <>
            <FormItem>
              <FormLabel>Predefined Tasks</FormLabel>
                <Select onValueChange={(value) => form.setValue('task', value)}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a predefined task" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {predefinedTasks.map(item => <SelectItem key={item.id} value={item.task}>{item.task} ({item.frequency})</SelectItem>)}
                    </SelectContent>
                </Select>
            </FormItem>
            <div className="flex items-center">
                <Separator className="flex-1" />
                <span className="px-2 text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
            </div>
            </>
        )}

        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Task</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Clean mews" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Task</Button>
        </div>
      </form>
    </Form>
  );
}
