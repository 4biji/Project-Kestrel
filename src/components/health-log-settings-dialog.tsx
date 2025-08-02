
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { PredefinedHealthIssue, FirstAidLink } from "@/lib/types";
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
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";

const healthIssueFormSchema = z.object({
  issue: z.string().min(1, "Issue is required"),
  severity: z.number().min(1).max(10).default(5),
});

type HealthIssueFormValues = z.infer<typeof healthIssueFormSchema>;

const firstAidLinkFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Must be a valid URL"),
});

type FirstAidLinkFormValues = z.infer<typeof firstAidLinkFormSchema>;

interface HealthLogSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issues: PredefinedHealthIssue[];
  links: FirstAidLink[];
  onSave: (issues: PredefinedHealthIssue[], links: FirstAidLink[]) => void;
}

export function HealthLogSettingsDialog({
  open,
  onOpenChange,
  issues: initialIssues,
  links: initialLinks,
  onSave,
}: HealthLogSettingsDialogProps) {
  const [issues, setIssues] = useState(initialIssues);
  const [links, setLinks] = useState(initialLinks);

  const issueForm = useForm<HealthIssueFormValues>({
    resolver: zodResolver(healthIssueFormSchema),
    defaultValues: { issue: "", severity: 5 },
  });

  const linkForm = useForm<FirstAidLinkFormValues>({
    resolver: zodResolver(firstAidLinkFormSchema),
    defaultValues: { title: "", url: "" },
  });

  const handleAddIssue = (values: HealthIssueFormValues) => {
    const newIssue: PredefinedHealthIssue = { id: `issue-${Date.now()}`, ...values };
    setIssues([...issues, newIssue]);
    issueForm.reset();
  };

  const handleDeleteIssue = (id: string) => {
    setIssues(issues.filter((issue) => issue.id !== id));
  };
  
  const handleAddLink = (values: FirstAidLinkFormValues) => {
    const newLink: FirstAidLink = { id: `link-${Date.now()}`, ...values };
    setLinks([...links, newLink]);
    linkForm.reset();
  };
  
  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const handleSave = () => {
    onSave(issues, links);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Health Issues & Resources</DialogTitle>
          <DialogDescription>
            Customize predefined health issues and first aid resource links.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
            <div>
                <h4 className="text-sm font-medium mb-2">Predefined Issues</h4>
                <Form {...issueForm}>
                <form onSubmit={issueForm.handleSubmit(handleAddIssue)} className="space-y-4">
                    <div className="flex items-end gap-2">
                    <FormField
                        control={issueForm.control}
                        name="issue"
                        render={({ field }) => (
                        <FormItem className="flex-grow">
                            <FormLabel className="sr-only">New Issue</FormLabel>
                            <FormControl>
                            <Input {...field} placeholder="e.g., Bumblefoot" />
                            </FormControl>
                        </FormItem>
                        )}
                    />
                     <Button type="submit">Add Issue</Button>
                    </div>
                    <FormField
                    control={issueForm.control}
                    name="severity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Default Severity: {field.value}</FormLabel>
                        <FormControl>
                            <Slider
                            min={1}
                            max={10}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                </form>
                </Form>
                <ScrollArea className="h-24 mt-2 border rounded-lg">
                <Table>
                    <TableBody>
                    {issues.map((issue) => (
                        <TableRow key={issue.id}>
                        <TableCell>{issue.issue}</TableCell>
                        <TableCell>{issue.severity}</TableCell>
                        <TableCell className="text-right">
                            <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteIssue(issue.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </ScrollArea>
            </div>

            <Separator />
            
            <div>
                <h4 className="text-sm font-medium mb-2">First Aid Links</h4>
                <Form {...linkForm}>
                    <form onSubmit={linkForm.handleSubmit(handleAddLink)} className="space-y-2">
                        <div className="flex items-end gap-2">
                            <FormField control={linkForm.control} name="title" render={({ field }) => (
                                <FormItem className="flex-grow"><FormLabel className="sr-only">Title</FormLabel><FormControl><Input {...field} placeholder="Link Title" /></FormControl></FormItem>
                            )}/>
                            <FormField control={linkForm.control} name="url" render={({ field }) => (
                                <FormItem className="flex-grow"><FormLabel className="sr-only">URL</FormLabel><FormControl><Input {...field} placeholder="https://example.com" /></FormControl></FormItem>
                            )}/>
                            <Button type="submit">Add Link</Button>
                        </div>
                    </form>
                </Form>
                 <ScrollArea className="h-24 mt-2 border rounded-lg">
                    <Table>
                        <TableBody>
                            {links.map((link) => (
                                <TableRow key={link.id}>
                                <TableCell>{link.title}</TableCell>
                                <TableCell className="text-right">
                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteLink(link.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>

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
