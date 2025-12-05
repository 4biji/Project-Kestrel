
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import type { FeedingLog } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const formSchema = z.object({
  date: z.date(),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
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
      date: parseISO(log.datetime),
      time: format(parseISO(log.datetime), "HH:mm"),
      foodItem: log.foodItem,
      amount: log.amount,
      notes: log.notes,
    },
  });

  const handleSubmit = (values: FormValues) => {
    const { date, time, ...rest } = values;
    const [hours, minutes] = time.split(':').map(Number);
    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(hours, minutes);

    onSubmit({
        ...log,
        ...rest,
        datetime: combinedDateTime.toISOString(),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                        <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
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
