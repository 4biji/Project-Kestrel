
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { FeedingLog, NutritionInfo } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const formSchema = z.object({
  foodItem: z.string({ required_error: "Please select a food item." }).min(1, "Food item is required."),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddFeedingLogFormProps {
  birdName: string;
  nutritionInfo: NutritionInfo[];
  onSubmit: (data: Omit<FeedingLog, "id" | "datetime" | "logType">) => void;
  onCancel: () => void;
}

export function AddFeedingLogForm({ birdName, nutritionInfo, onSubmit, onCancel }: AddFeedingLogFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a food type" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {nutritionInfo.map(item => <SelectItem key={item.id} value={item.foodType}>{item.foodType}</SelectItem>)}
                    </SelectContent>
                </Select>
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
