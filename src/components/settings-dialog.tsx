
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "./ui/separator";
import { Bird } from "lucide-react";

const settingsSchema = z.object({
  isLayoutEditable: z.boolean().default(true),
});

export type SettingsData = z.infer<typeof settingsSchema>;

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: SettingsData;
  onSave: (settings: SettingsData) => void;
  onManageBirdsClick: () => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  settings,
  onSave,
  onManageBirdsClick,
}: SettingsDialogProps) {
  const form = useForm<SettingsData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  const onSubmit = (data: SettingsData) => {
    onSave(data);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your application settings.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                 <div className="space-y-4 rounded-lg border p-4">
                    <h3 className="font-medium text-foreground">General</h3>
                    <FormField
                        control={form.control}
                        name="isLayoutEditable"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between">
                                <div className="space-y-0.5">
                                    <FormLabel>
                                        Enable Layout Editing
                                    </FormLabel>
                                    <p className="text-sm text-muted-foreground">
                                        Allow moving and resizing dashboard cards.
                                    </p>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                
                <div className="space-y-4 rounded-lg border p-4">
                    <h3 className="font-medium text-foreground">Data Management</h3>
                    <div className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                            <FormLabel>
                                Manage Birds
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                                Add, edit, or remove birds from your journal.
                            </p>
                        </div>
                        <Button type="button" variant="outline" onClick={onManageBirdsClick}>
                            <Bird className="mr-2 h-4 w-4" /> Manage
                        </Button>
                    </div>
                </div>


                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save Settings</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
