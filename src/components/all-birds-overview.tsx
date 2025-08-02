
"use client";

import { useState } from "react";
import type { Bird as BirdType, WeightLog, FeedingLog, LogEntry } from "@/lib/types";
import { format } from 'date-fns';

import { BirdProfileHeader } from "@/components/bird-profile-header";
import { WeightChart } from "@/components/weight-chart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { WeightLogComponent, ViewAllLogsDialog } from "./weight-log";
import { EditWeightLogForm } from "./edit-weight-log-form";
import { AddWeightLogForm } from "./add-weight-log-form";
import { useToast } from "@/hooks/use-toast";
import { Scale, Feather, Plus, Settings, ScrollText } from "lucide-react";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WeightChartSettings, type WeightChartSettingsData, weightChartSettingsSchema } from "./weight-chart-settings";

interface AllBirdsOverviewProps {
  initialData: {
    birds: BirdType[];
    logs: { [birdId: string]: LogEntry[] };
  };
}

export function AllBirdsOverview({ initialData }: AllBirdsOverviewProps) {
  const [birds, setBirds] = useState(initialData.birds);
  const [logs, setLogs] = useState(initialData.logs);
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);
  const [addingWeightLogToBirdId, setAddingWeightLogToBirdId] = useState<string | null>(null);
  const [overviewTitle, setOverviewTitle] = useState("All Birds Weight Overview");
  const { toast } = useToast();

  const [chartSettings, setChartSettings] = useState<{ [birdId: string]: WeightChartSettingsData }>({});
  const [editingChartSettingsForBirdId, setEditingChartSettingsForBirdId] = useState<string | null>(null);
  const [viewingAllLogsForBirdId, setViewingAllLogsForBirdId] = useState<string | null>(null);

  const handleSaveChartSettings = (birdId: string, settings: WeightChartSettingsData) => {
    setChartSettings(prev => ({ ...prev, [birdId]: settings }));
    setEditingChartSettingsForBirdId(null);
    toast({
      title: "Chart Settings Updated",
      description: "Your changes to the weight chart have been saved.",
    });
  };

  const handleUpdateLog = (updatedLog: LogEntry) => {
    if (!editingLog) return;
    
    const birdId = Object.keys(logs).find(id => 
        logs[id].some(log => log.id === editingLog.id)
    );

    if (!birdId) return;

    setLogs(prevLogs => {
      const newLogs = { ...prevLogs };
      const logsForBird = newLogs[birdId].map(log => 
        log.id === editingLog.id ? updatedLog : log
      );
      newLogs[birdId] = logsForBird.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
      return newLogs;
    });

    setEditingLog(null);
    toast({
      title: "Weight Log Updated",
      description: `The entry for ${format(new Date(updatedLog.datetime), "MMMM d, yyyy")} has been updated.`,
    });
  };

  const handleDeleteLog = (logToDelete: LogEntry) => {
     if (!confirm('Are you sure you want to delete this weight log entry?')) {
      return;
    }
    
    const birdId = Object.keys(logs).find(id => 
        logs[id].some(log => log.id === logToDelete.id)
    );
    
    if (!birdId) return;

    setLogs(prevLogs => {
      const newLogs = { ...prevLogs };
      newLogs[birdId] = newLogs[birdId].filter(
        log => log.id !== logToDelete.id
      );
      return newLogs;
    });
    
    toast({
      title: "Weight Log Deleted",
      description: `The entry for ${format(new Date(logToDelete.datetime), "MMMM d, yyyy")} has been removed.`,
      variant: "destructive"
    });
  };
  
  const handleAddWeightLog = (newLogData: Omit<WeightLog, 'id' | 'datetime' | 'logType'> & { datetime: string }, birdId: string) => {
    const newLog: WeightLog = {
      ...newLogData,
      id: `w${Date.now()}`,
      logType: 'weight',
    };

    setLogs(prev => ({
      ...prev,
      [birdId]: [newLog, ...(prev[birdId] || [])].sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
    }));

    setAddingWeightLogToBirdId(null);
    toast({
        title: "Weight Log Added",
        description: `New weight of ${newLog.weight}g has been logged for ${birds.find(b => b.id === birdId)?.name}.`,
    });
  };

  const getDefaultChartSettings = (birdId: string): WeightChartSettingsData => {
    return weightChartSettingsSchema.parse({
        alertBelowAverage: {},
        presetAlert: {},
        huntingWeight: {},
    });
  };
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
         <h1 
          className="text-3xl font-bold font-headline"
          contentEditable
          suppressContentEditableWarning={true}
          onBlur={(e) => setOverviewTitle(e.currentTarget.textContent || "All Birds Weight Overview")}
          >
            {overviewTitle}
          </h1>
        <SidebarTrigger />
      </div>

    {birds.length > 0 ? (
        birds.map((bird, index) => {
            const birdLogs = logs[bird.id] || [];
            const birdWeightLogs = (birdLogs.filter(l => l.logType === 'weight') as WeightLog[]).sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
            const lastWeightLog = birdWeightLogs[0];
            const currentWeight = lastWeightLog ? lastWeightLog.weight : bird.weight;
            const birdFeedingLogs = birdLogs.filter(l => l.logType === 'feeding') as FeedingLog[];
            const birdForEditing = editingLog && editingLog.logType === 'weight' && Object.keys(logs).find(id => logs[id].some(l => l.id === editingLog.id)) === bird.id ? editingLog as WeightLog : null;
            const currentChartSettings = chartSettings[bird.id] || getDefaultChartSettings(bird.id);
            const averageWeight = birdWeightLogs.length > 0 ? birdWeightLogs.reduce((acc, log) => acc + log.weight, 0) / birdWeightLogs.length : 0;
            return (
                <div key={bird.id}>
                    <BirdProfileHeader bird={{...bird, weight: currentWeight}} />
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card className="h-full flex flex-col">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Scale className="w-5 h-5" /> Weight Trend
                                    </CardTitle>
                                    <Button variant="ghost" size="icon" onClick={() => setEditingChartSettingsForBirdId(bird.id)}>
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <WeightChart 
                                        data={birdWeightLogs} 
                                        settings={currentChartSettings} 
                                        feedingLogs={birdFeedingLogs}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-1">
                             <Card className="h-full">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Scale className="w-5 h-5" /> Weight Log
                                    </CardTitle>
                                    <div className="flex items-center">
                                     <Dialog open={addingWeightLogToBirdId === bird.id} onOpenChange={(isOpen) => !isOpen && setAddingWeightLogToBirdId(null)}>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={() => setAddingWeightLogToBirdId(bird.id)}>
                                                <Plus className="w-4 h-4"/>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add Weight Log for {bird.name}</DialogTitle>
                                                <DialogDescription>
                                                    Enter the date, time, and weight for the new log entry.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <AddWeightLogForm
                                                onSubmit={(data) => handleAddWeightLog(data, bird.id)}
                                                onCancel={() => setAddingWeightLogToBirdId(null)}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Settings className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onSelect={() => setViewingAllLogsForBirdId(bird.id)}>
                                                <ScrollText className="mr-2 h-4 w-4" />
                                                <span>View All Logs</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {birdForEditing ? (
                                        <EditWeightLogForm
                                            log={birdForEditing}
                                            onSubmit={handleUpdateLog as (log: WeightLog) => void}
                                            onCancel={() => setEditingLog(null)}
                                        />
                                    ) : (
                                        <WeightLogComponent 
                                            logs={birdWeightLogs}
                                            currentWeight={currentWeight}
                                            onEdit={(log) => setEditingLog(log)}
                                            onDelete={(log) => handleDeleteLog(log)}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                     {editingChartSettingsForBirdId === bird.id && (
                        <WeightChartSettings
                            open={editingChartSettingsForBirdId === bird.id}
                            onOpenChange={(isOpen) => !isOpen && setEditingChartSettingsForBirdId(null)}
                            settings={currentChartSettings}
                            onSave={(settings) => handleSaveChartSettings(bird.id, settings)}
                            averageWeight={averageWeight}
                        />
                    )}
                    {viewingAllLogsForBirdId === bird.id && (
                        <ViewAllLogsDialog
                            open={viewingAllLogsForBirdId === bird.id}
                            onOpenChange={(isOpen) => !isOpen && setViewingAllLogsForBirdId(null)}
                            logs={birdWeightLogs}
                            onEdit={(log) => setEditingLog(log)}
                            onDelete={(log) => handleDeleteLog(log)}
                        />
                    )}
                    {index < birds.length - 1 && <Separator className="my-8" />}
                </div>
            )
        })
    ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
        <Feather className="w-16 h-16 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-semibold">No Birds Available</h2>
        <p className="mt-2 text-muted-foreground">
            Add a bird to begin tracking their weight.
        </p>
        <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Add Bird
        </Button>
        </div>
    )}
    </div>
  )
}
