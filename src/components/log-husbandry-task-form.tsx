
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { HusbandryTask, PredefinedHusbandryTask } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  task: z.string().min(1, "Task is required."),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LogHusbandryTaskFormProps {
  birdName: string;
  predefinedTasks: PredefinedHusbandryTask[];
  onSubmit: (data: Omit<HusbandryTask, "id" | "datetime" | "logType">) => void;
  onCancel: () => void;
}

export function LogHusbandryTaskForm({ birdName, predefinedTasks, onSubmit, onCancel }: LogHusbandryTaskFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
      notes: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit({
        ...values,
        completed: true,
    });
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("imageUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <p className="text-sm text-muted-foreground">
            Log a completed husbandry task for {birdName}.
        </p>
        
        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a task to log" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {predefinedTasks.map(item => <SelectItem key={item.id} value={item.task}>{item.task} ({item.frequency})</SelectItem>)}
                    </SelectContent>
                </Select>
                 <FormMessage />
            </FormItem>
          )}
        />
       
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Any notes on the task..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image (Optional)</FormLabel>
              <FormControl>
                 <Input type="file" accept="image/*" onChange={handleImageChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Log</Button>
        </div>
      </form>
    </Form>
  );
}
