
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { HusbandryTask } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { DialogDescription } from "./ui/dialog";

const formSchema = z.object({
  task: z.string().min(1, "Task description is required."),
});

type FormValues = z.infer<typeof formSchema>;

interface AddHusbandryTaskFormProps {
  birdName: string;
  onSubmit: (data: Omit<HusbandryTask, "id" | "completed">) => void;
  onCancel: () => void;
}

export function AddHusbandryTaskForm({ birdName, onSubmit, onCancel }: AddHusbandryTaskFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogDescription>
            Add a new husbandry task for {birdName}.
        </DialogDescription>
        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task</FormLabel>
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
