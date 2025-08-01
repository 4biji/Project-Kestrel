
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { FeedingLog } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { DialogDescription } from "./ui/dialog";

const formSchema = z.object({
  foodItem: z.string().min(1, "Food item is required."),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditFeedingLogFormProps {
  log: FeedingLog;
  onSubmit: (data: FeedingLog) => void;
  onCancel: () => void;
}

export function EditFeedingLogForm({ log, onSubmit, onCancel }: EditFeedingLogFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodItem: log.foodItem,
      amount: log.amount,
      notes: log.notes,
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit({
        ...log,
        ...values,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}

    