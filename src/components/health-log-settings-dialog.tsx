
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { PredefinedHealthIssue } from "@/lib/types";
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

const healthIssueFormSchema = z.object({
  issue: z.string().min(1, "Issue is required"),
});

type HealthIssueFormValues = z.infer<typeof healthIssueFormSchema>;

interface HealthLogSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issues: PredefinedHealthIssue[];
  onSave: (issues: PredefinedHealthIssue[]) => void;
}

export function HealthLogSettingsDialog({
  open,
  onOpenChange,
  issues: initialIssues,
  onSave,
}: HealthLogSettingsDialogProps) {
  const [issues, setIssues] = useState(initialIssues);

  const form = useForm<HealthIssueFormValues>({
    resolver: zodResolver(healthIssueFormSchema),
    defaultValues: {
      issue: "",
    },
  });

  const handleAdd = (values: HealthIssueFormValues) => {
    const newIssue: PredefinedHealthIssue = {
      id: `issue-${Date.now()}`,
      ...values,
    };
    setIssues([...issues, newIssue]);
    form.reset();
  };

  const handleDelete = (id: string) => {
    setIssues(issues.filter((issue) => issue.id !== id));
  };

  const handleSave = () => {
    onSave(issues);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Health Issues</DialogTitle>
          <DialogDescription>
            Create a list of predefined health issues to quickly log treatments.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAdd)} className="flex items-end gap-2 pt-4">
            <FormField
              control={form.control}
              name="issue"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>New Issue</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Bumblefoot" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Add</Button>
          </form>
        </Form>

        <p className="text-xs text-muted-foreground">
          Your predefined issues.
        </p>
        <ScrollArea className="h-48 border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell>{issue.issue}</TableCell>
                  <TableCell className="text-right">
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleDelete(issue.id)}>
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
