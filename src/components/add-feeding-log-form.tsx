
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { FeedingLog } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

const formSchema = z.object({
  foodItem: z.string().min(1, "Food item is required."),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddFeedingLogFormProps {
  birdName: string;
  onSubmit: (data: Omit<FeedingLog, "id" | "datetime" | "logType">) => void;
  onCancel: () => void;
}

export function AddFeedingLogForm({ birdName, onSubmit, onCancel }: AddFeedingLogFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodItem: "",
      amount: 0,
      notes: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-muted-foreground">
            Log a new feeding for {birdName}.
        </p>
        <FormField
          control={form.control}
          name="foodItem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Food Item</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Quail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (grams)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 50" {...field} />
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
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any observations..." {...field} />
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
