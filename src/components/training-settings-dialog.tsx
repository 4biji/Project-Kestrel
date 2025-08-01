
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { PredefinedTraining } from "@/lib/types";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { Trash2 } from "lucide-react";

const trainingFormSchema = z.object({
  behavior: z.string().min(1, "Behavior is required"),
});

type TrainingFormValues = z.infer<typeof trainingFormSchema>;

interface TrainingSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainings: PredefinedTraining[];
  onSave: (trainings: PredefinedTraining[]) => void;
}

export function TrainingSettingsDialog({
  open,
  onOpenChange,
  trainings: initialTrainings,
  onSave,
}: TrainingSettingsDialogProps) {
  const [trainings, setTrainings] = useState(initialTrainings);

  const form = useForm<TrainingFormValues>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: {
      behavior: "",
    },
  });

  const handleAdd = (values: TrainingFormValues) => {
    const newTraining: PredefinedTraining = {
      id: `train-${Date.now()}`,
      ...values,
    };
    setTrainings([...trainings, newTraining]);
    form.reset();
  };

  const handleDelete = (id: string) => {
    setTrainings(trainings.filter((t) => t.id !== id));
  };

  const handleSave = () => {
    onSave(trainings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Training Behaviors</DialogTitle>
          <DialogDescription>
            Create a list of predefined training behaviors to quickly log your sessions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAdd)} className="flex items-end gap-2 pt-4">
            <FormField
              control={form.control}
              name="behavior"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>New Behavior</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Lure stooping" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Add</Button>
          </form>
        </Form>

        <p className="text-xs text-muted-foreground">
          Your predefined behaviors. You can quickly add these from the training log.
        </p>
        <ScrollArea className="h-48 border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Behavior</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainings.map((training) => (
                <TableRow key={training.id}>
                  <TableCell>{training.behavior}</TableCell>
                  <TableCell className="text-right">
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleDelete(training.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
