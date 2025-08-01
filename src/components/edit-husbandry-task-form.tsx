
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { HusbandryTask } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { DialogDescription } from "./ui/dialog";

const formSchema = z.object({
  task: z.string().min(1, "Task description is required."),
  completed: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditHusbandryTaskFormProps {
  task: HusbandryTask;
  onSubmit: (data: HusbandryTask) => void;
  onCancel: () => void;
}

export function EditHusbandryTaskForm({ task, onSubmit, onCancel }: EditHusbandryTaskFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: task.task,
      completed: task.completed,
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit({
        ...task,
        ...values,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
        <FormField
          control={form.control}
          name="completed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
               <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Completed
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}

    