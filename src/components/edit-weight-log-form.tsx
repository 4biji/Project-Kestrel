
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { WeightLog } from "@/lib/types";

const formSchema = z.object({
  weight: z.coerce.number().positive("Weight must be a positive number."),
});

interface EditWeightLogFormProps {
  log: WeightLog;
  onSubmit: (data: WeightLog) => void;
  onCancel: () => void;
}

export function EditWeightLogForm({ log, onSubmit, onCancel }: EditWeightLogFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: log.weight,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...log,
      weight: values.weight,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <h3 className="font-semibold text-lg">Edit Weight Log</h3>
        <p className="text-sm text-muted-foreground">
          Editing entry for {format(new Date(log.date), "MMMM d, yyyy")}
        </p>
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (grams)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g. 650" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
