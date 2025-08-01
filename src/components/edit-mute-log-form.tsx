
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { MuteLog, MuteCondition } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const muteConditions: MuteCondition[] = ['Normal', 'Urinate Only', 'Greenish', 'Blackish', 'Yellowish'];

const formSchema = z.object({
  condition: z.enum(muteConditions, { required_error: "Please select a condition." }),
  notes: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface EditMuteLogFormProps {
  log: MuteLog;
  onSubmit: (data: MuteLog) => void;
  onCancel: () => void;
}

export function EditMuteLogForm({ log, onSubmit, onCancel }: EditMuteLogFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      condition: log.condition,
      notes: log.notes,
      imageUrl: log.imageUrl,
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
            name="condition"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a condition" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {muteConditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any observations..." {...field} />
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
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}

    