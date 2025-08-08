

"use client";

import { useState, useRef } from "react";
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
import { Bird, View, Plus, Minus, Palette, Download, Upload, FileText } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { Theme, Bird as BirdType, LogEntry } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";


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
  appData: { birds: BirdType[], logs: { [key: string]: LogEntry[] } };
  onImportData: (data: { birds: BirdType[], logs: { [key: string]: LogEntry[] } }) => void;
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
  appData,
  onImportData,
}: SettingsDialogProps) {
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileToImport, setFileToImport] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<SettingsData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });


  const onSubmit = (data: SettingsData) => {
    onSave(data);
    onOpenChange(false);
  };
  
  const handleExport = () => {
    try {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(appData, null, 2)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "falconry_journal_data.json";
      link.click();
      toast({ title: 'Export Successful', description: 'Your data has been downloaded.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export your data.' });
      console.error("Export failed", error);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileToImport(file);
    }
  };

  const processImport = () => {
    if (!fileToImport) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('File content is not readable text.');
        }
        const data = JSON.parse(text);
        // Basic validation
        if (data.birds && data.logs && Array.isArray(data.birds)) {
          onImportData(data);
        } else {
          throw new Error('Invalid data structure in JSON file.');
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Import Failed', description: (error as Error).message || 'Could not parse the JSON file.' });
        console.error("Import failed", error);
      } finally {
        setFileToImport(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.onerror = () => {
        toast({ variant: 'destructive', title: 'Import Failed', description: 'Could not read the selected file.' });
    }
    reader.readAsText(fileToImport);
  };

   const handleDownloadTemplate = () => {
    try {
      const templateData = {
        birds: [
          {
            "id": "b1",
            "name": "Apollo",
            "species": "Peregrine Falcon",
            "gender": "Male",
            "imageUrl": "https://placehold.co/400x400.png",
            "weight": 650,
            "dateCaptured": "2022-09-15T00:00:00.000Z",
            "isHidden": false
          }
        ],
        logs: {
          "b1": [
            {
              "logType": "weight",
              "id": "w-b1-1",
              "datetime": "2023-10-26T08:00:00.000Z",
              "weight": 650
            }
          ]
        }
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(templateData, null, 2)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "import_template.json";
      link.click();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Download Failed', description: 'Could not create the template file.' });
    }
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
                                <FormLabel>Manage Birds</FormLabel>
                                <p className="text-sm text-muted-foreground">Add, edit, or remove birds.</p>
                            </div>
                            <Button type="button" variant="outline" onClick={onManageBirdsClick}>Manage</Button>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                                <FormLabel>Export Data</FormLabel>
                                <p className="text-sm text-muted-foreground">Save all your data to a JSON file.</p>
                            </div>
                            <Button type="button" variant="outline" onClick={handleExport}><Download className="mr-2"/>Export</Button>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                                <FormLabel>Import Data</FormLabel>
                                <p className="text-sm text-muted-foreground">Replace all data from a JSON file.</p>
                            </div>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                     <Button type="button" variant="destructive" onClick={handleImportClick}><Upload className="mr-2"/>Import</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. Importing a file will permanently overwrite all current birds and logs.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setFileToImport(null)}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={processImport}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                        </div>
                        <div className="flex justify-end">
                             <Button type="button" variant="link" className="text-xs h-auto p-0" onClick={handleDownloadTemplate}>
                                <FileText className="mr-1 h-3 w-3" />
                                Download Template
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
