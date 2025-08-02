

"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Bird, View, Plus, Minus, Palette } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { Theme } from "@/lib/types";


export const settingsSchema = z.object({
  isLayoutEditable: z.boolean().default(false),
  rowHeight: z.coerce.number().positive().default(125),
  theme: z.enum(['default', 'forest', 'desert', 'coastal', 'lake', 'urban']).default('default'),
  darkMode: z.boolean().default(false),
  visibleCards: z.object({
    'weight-trend': z.boolean().default(true),
    'weight-log': z.boolean().default(true),
    'training-log': z.boolean().default(true),
    'feeding-log': z.boolean().default(true),
    'hunting-log': z.boolean().default(true),
    'husbandry': z.boolean().default(true),
    'mutes-castings': z.boolean().default(true),
    'health-first-aid': z.boolean().default(true),
  }).default({
    'weight-trend': true,
    'weight-log': true,
    'training-log': true,
    'feeding-log': true,
    'hunting-log': true,
    'husbandry': true,
    'mutes-castings': true,
    'health-first-aid': true,
  }),
});

export type SettingsData = z.infer<typeof settingsSchema>;

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: SettingsData;
  onSave: (settings: SettingsData) => void;
  onManageBirdsClick: () => void;
}

const cardOptions = [
    { id: 'weight-trend', label: 'Weight Trend Chart' },
    { id: 'weight-log', label: 'Weight Log Summary' },
    { id: 'training-log', label: 'Training Log' },
    { id: 'feeding-log', label: 'Feeding Log' },
    { id: 'hunting-log', label: 'Hunting Log' },
    { id: 'husbandry', label: 'Husbandry Tasks' },
    { id: 'mutes-castings', label: 'Mutes & Castings' },
    { id: 'health-first-aid', label: 'Health Log' },
] as const;

export function SettingsDialog({
  open,
  onOpenChange,
  settings,
  onSave,
  onManageBirdsClick,
}: SettingsDialogProps) {
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your application settings.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 pt-4">
                <Collapsible open={isAppearanceOpen} onOpenChange={setIsAppearanceOpen} className="space-y-4 rounded-lg border p-4">
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                        <h3 className="font-medium text-foreground flex items-center gap-2">
                            <Palette className="w-4 h-4" />
                            Appearance
                        </h3>
                        {isAppearanceOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="darkMode"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                    <FormLabel>Dark Mode</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="theme"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Theme</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="default">Default</SelectItem>
                                            <SelectItem value="forest">Forest</SelectItem>
                                            <SelectItem value="desert">Desert</SelectItem>
                                            <SelectItem value="coastal">Coastal</SelectItem>
                                            <SelectItem value="lake">Lake</SelectItem>
                                            <SelectItem value="urban">Urban</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </CollapsibleContent>
                </Collapsible>

                 <Collapsible open={isDataManagementOpen} onOpenChange={setIsDataManagementOpen} className="space-y-4 rounded-lg border p-4">
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                        <h3 className="font-medium text-foreground flex items-center gap-2">
                            <Bird className="w-4 h-4" />
                            Data Management
                        </h3>
                        {isDataManagementOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4">
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
                                Manage
                            </Button>
                        </div>
                    </CollapsibleContent>
                </Collapsible>


                <Collapsible open={isDashboardOpen} onOpenChange={setIsDashboardOpen} className="space-y-4 rounded-lg border p-4">
                     <CollapsibleTrigger className="flex w-full items-center justify-between">
                        <h3 className="font-medium text-foreground flex items-center gap-2">
                            <View className="w-4 h-4" />
                            Dashboard
                        </h3>
                         {isDashboardOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4">
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
                                            Allow moving and resizing cards.
                                        </p>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rowHeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Row Height (in pixels)
                                    </FormLabel>
                                    <FormControl>
                                       <Input type="number" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="space-y-2">
                            <FormLabel>Visible Cards</FormLabel>
                            <p className="text-sm text-muted-foreground">
                                Choose which cards to display on the dashboard.
                            </p>
                            <div className="space-y-2 pt-2">
                                {cardOptions.map(card => (
                                    <FormField
                                        key={card.id}
                                        control={form.control}
                                        name={`visibleCards.${card.id}`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between">
                                                <FormLabel className="font-normal">{card.label}</FormLabel>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

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
