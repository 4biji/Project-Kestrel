
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { HuntingLog } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const formSchema = z.object({
  prey: z.string().min(1, "Prey is required."),
  outcome: z.enum(["Successful", "Unsuccessful"], { required_error: "Please select an outcome." }),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddHuntingLogFormProps {
  birdName: string;
  onSubmit: (data: Omit<HuntingLog, "id" | "datetime" | "logType">) => void;
  onCancel: () => void;
}

export function AddHuntingLogForm({ birdName, onSubmit, onCancel }: AddHuntingLogFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prey: "",
      outcome: "Successful",
      notes: "",
      imageUrl: "",
    },
  });

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-muted-foreground">
            Log a new hunt for {birdName}.
        </p>
        <FormField
          control={form.control}
          name="prey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prey</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Rabbit, Squirrel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="outcome"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Outcome</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an outcome" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Successful">Successful</SelectItem>
                        <SelectItem value="Unsuccessful">Unsuccessful</SelectItem>
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
                <Textarea placeholder="Describe the hunt..." {...field} />
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
