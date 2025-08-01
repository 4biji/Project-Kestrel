
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { TrainingLog, PredefinedTraining } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  behavior: z.string().min(1, "Behavior is required."),
  duration: z.coerce.number().positive("Duration must be a positive number."),
  notes: z.string().min(1, "Notes are required."),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTrainingLogFormProps {
  birdName: string;
  predefinedTraining: PredefinedTraining[];
  onSubmit: (data: Omit<TrainingLog, "id" | "datetime" | "logType">) => void;
  onCancel: () => void;
}

export function AddTrainingLogForm({ birdName, predefinedTraining, onSubmit, onCancel }: AddTrainingLogFormProps) {
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
        <p className="text-sm text-muted-foreground">
            Log a new training session for {birdName}.
        </p>

        {predefinedTraining.length > 0 && (
          <>
            <FormItem>
                <FormLabel>Predefined Behaviors</FormLabel>
                <Select onValueChange={(value) => form.setValue('behavior', value)}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a predefined behavior" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {predefinedTraining.map(item => <SelectItem key={item.id} value={item.behavior}>{item.behavior}</SelectItem>)}
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
          name="behavior"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Behavior Trained</FormLabel>
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
