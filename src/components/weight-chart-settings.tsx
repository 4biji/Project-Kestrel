
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Separator } from "./ui/separator";

export const weightChartSettingsSchema = z.object({
    style: z.enum(["monotone", "linear", "step"]).default("monotone"),
    dateRange: z.enum(["all", "30d", "7d", "1d"]).default("all"),
    showAverage: z.boolean().default(true),
    showFeedingEvents: z.boolean().default(true),
    alertBelowAverage: z.object({
        enabled: z.boolean().default(false),
        percentage: z.coerce.number().min(0).max(100).default(5),
    }).default({}),
    presetAlert: z.object({
        enabled: z.boolean().default(false),
        weight: z.coerce.number().min(0).default(0),
    }).default({}),
    huntingWeight: z.object({
        enabled: z.boolean().default(false),
        weight: z.coerce.number().min(0).default(0),
    }).default({}),
});

export type WeightChartSettingsData = z.infer<typeof weightChartSettingsSchema>;

interface WeightChartSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: WeightChartSettingsData;
  onSave: (settings: WeightChartSettingsData) => void;
  averageWeight: number;
}

export function WeightChartSettings({
  open,
  onOpenChange,
  settings,
  onSave,
  averageWeight,
}: WeightChartSettingsProps) {
  const form = useForm<WeightChartSettingsData>({
    resolver: zodResolver(weightChartSettingsSchema),
    defaultValues: settings,
  });

  const onSubmit = (data: WeightChartSettingsData) => {
    onSave(data);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Weight Trend Settings</DialogTitle>
          <DialogDescription>
            Customize the appearance of the weight chart.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="style"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Graph Style</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a style" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="monotone">Smooth</SelectItem>
                                    <SelectItem value="linear">Linear</SelectItem>
                                    <SelectItem value="step">Step</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="dateRange"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date Range</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a range" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="all">All Time</SelectItem>
                                        <SelectItem value="30d">Last 30 Days</SelectItem>
                                        <SelectItem value="7d">Last 7 Days</SelectItem>
                                        <SelectItem value="1d">Today</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                </div>
                
                <div className="space-y-4 rounded-md border p-4">
                     <FormField
                        control={form.control}
                        name="showFeedingEvents"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between">
                                <FormLabel>Show Feeding Events</FormLabel>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <FormField
                        control={form.control}
                        name="showAverage"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between">
                                <FormLabel>Show Average Weight ({averageWeight.toFixed(0)}g)</FormLabel>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="huntingWeight.enabled"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between">
                                <FormLabel>Show Hunting Weight</FormLabel>
                                 <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="huntingWeight.weight"
                        render={({ field }) => (
                             <FormItem>
                                <FormControl>
                                    <Input type="number" {...field} disabled={!form.watch('huntingWeight.enabled')} placeholder="Enter hunting weight in grams" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4 rounded-md border p-4">
                    <FormField
                        control={form.control}
                        name="alertBelowAverage.enabled"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between">
                                <FormLabel>Alert if {form.watch('alertBelowAverage.percentage')}% Below Average</FormLabel>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="alertBelowAverage.percentage"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="number" {...field} disabled={!form.watch('alertBelowAverage.enabled')} placeholder="Percentage below average" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                 <div className="space-y-4 rounded-md border p-4">
                    <FormField
                        control={form.control}
                        name="presetAlert.enabled"
                        render={({ field }) => (
                             <FormItem className="flex flex-row items-center justify-between">
                                <FormLabel>Alert if Below {form.watch('presetAlert.weight') || '...'}g</FormLabel>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="presetAlert.weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="number" {...field} disabled={!form.watch('presetAlert.enabled')} placeholder="Enter alert weight in grams" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
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
