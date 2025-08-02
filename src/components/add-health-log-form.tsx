
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { HealthLog, PredefinedHealthIssue } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";

const formSchema = z.object({
  condition: z.string().min(1, "Condition is required."),
  treatment: z.string().min(1, "Treatment is required."),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddHealthLogFormProps {
  birdName: string;
  predefinedIssues: PredefinedHealthIssue[];
  onSubmit: (data: Omit<HealthLog, "id" | "datetime" | "logType">) => void;
  onCancel: () => void;
}

export function AddHealthLogForm({ birdName, predefinedIssues, onSubmit, onCancel }: AddHealthLogFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-muted-foreground">
            Log a new health event for {birdName}.
        </p>
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condition / Illness</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a condition" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {predefinedIssues.map(item => <SelectItem key={item.id} value={item.issue}>{item.issue} (Severity: {item.severity})</SelectItem>)}
                    </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="treatment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treatment Applied</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the treatment provided..." {...field} />
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
                <Textarea placeholder="Any other observations..." {...field} />
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
