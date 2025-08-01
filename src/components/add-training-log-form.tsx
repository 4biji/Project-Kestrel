
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { TrainingLog } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";

const formSchema = z.object({
  behavior: z.string().min(1, "Behavior is required."),
  duration: z.coerce.number().positive("Duration must be a positive number."),
  notes: z.string().min(1, "Notes are required."),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTrainingLogFormProps {
  birdName: string;
  onSubmit: (data: Omit<TrainingLog, "id" | "datetime">) => void;
  onCancel: () => void;
}

export function AddTrainingLogForm({ birdName, onSubmit, onCancel }: AddTrainingLogFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      behavior: "",
      duration: 10,
      notes: "",
      imageUrl: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogDescription>
            Log a new training session for {birdName}.
        </DialogDescription>
        <FormField
          control={form.control}
          name="behavior"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Behavior Trained</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Lure stooping" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 15" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the session..." {...field} />
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
              <FormLabel>Image URL (Optional)</FormLabel>
              <FormControl>
                <Input type="text" placeholder="https://placehold.co/600x400.png" {...field} />
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
