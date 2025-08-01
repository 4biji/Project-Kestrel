
"use client";

import { useState } from "react";
import type { Bird as BirdType, FeedingLog, HusbandryTask, TrainingLog, MuteLog, WeightLog } from "@/lib/types";
import { format } from 'date-fns';

import { BirdProfileHeader } from "@/components/bird-profile-header";
import { WeightChart } from "@/components/weight-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { WeightLogComponent } from "./weight-log";
import { EditWeightLogForm } from "./edit-weight-log-form";
import { AddWeightLogForm } from "./add-weight-log-form";
import { useToast } from "@/hooks/use-toast";
import { Scale, Plus, Bone, ShieldCheck, Footprints, Droplets, Settings } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { FeedingLogComponent } from "./feeding-log";
import { HusbandryLog } from "./husbandry-log";
import { TrainingLogComponent } from "./training-log";
import { MuteLogComponent } from "./mute-log";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { WeightChartSettings, type WeightChartSettingsData, weightChartSettingsSchema } from "./weight-chart-settings";

interface BirdDetailViewProps {
  initialData: {
    birds: BirdType[];
    feedingLogs: { [birdId: string]: FeedingLog[] };
    husbandryLogs: { [birdId: string]: HusbandryTask[] };
    trainingLogs: { [birdId: string]: TrainingLog[] };
    muteLogs: { [birdId: string]: MuteLog[] };
    weightLogs: { [birdId: string]: WeightLog[] };
  };
  birdId: string;
}

export function BirdDetailView({ initialData, birdId }: BirdDetailViewProps) {
  const [birds, setBirds] = useState(initialData.birds);
  const [feedingLogs, setFeedingLogs] = useState(initialData.feedingLogs);
  const [husbandryLogs, setHusbandryLogs] = useState(initialData.husbandryLogs);
  const [trainingLogs, setTrainingLogs] = useState(initialData.trainingLogs);
  const [muteLogs, setMuteLogs] = useState(initialData.muteLogs);
  const [weightLogs, setWeightLogs] = useState(initialData.weightLogs);
  
  const [editingWeightLog, setEditingWeightLog] = useState<WeightLog | null>(null);
  const [isAddingWeightLog, setIsAddingWeightLog] = useState(false);
  const { toast } = useToast();

  const [chartSettings, setChartSettings] = useState<WeightChartSettingsData>(
    weightChartSettingsSchema.parse({})
  );
  const [isEditingChartSettings, setIsEditingChartSettings] = useState(false);

  const selectedBird = birds.find(b => b.id === birdId);

  if (!selectedBird) {
    // This should ideally be handled by the page component with notFound()
    return <p>Bird not found.</p>;
  }
  
  const birdWeightLogs = weightLogs[selectedBird.id] || [];
  const averageWeight = birdWeightLogs.length > 0 ? birdWeightLogs.reduce((acc, log) => acc + log.weight, 0) / birdWeightLogs.length : 0;


  const handleSaveChartSettings = (settings: WeightChartSettingsData) => {
    setChartSettings(settings);
    setIsEditingChartSettings(false);
    toast({
      title: "Chart Settings Updated",
      description: "Your changes to the weight chart have been saved.",
    });
  };

  const handleUpdateWeightLog = (updatedLog: WeightLog) => {
    if (!editingWeightLog) return;
    
    setWeightLogs(prevLogs => {
      const newLogs = { ...prevLogs };
      const logsForBird = newLogs[birdId].map(log => 
        log.datetime === editingWeightLog.datetime ? updatedLog : log
      );
      newLogs[birdId] = logsForBird.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
      return newLogs;
    });

    setEditingWeightLog(null);
    toast({
      title: "Weight Log Updated",
      description: `The entry for ${format(new Date(updatedLog.datetime), "MMMM d, yyyy")} has been updated.`,
    });
  };

  const handleDeleteWeightLog = (logToDelete: WeightLog) => {
     if (!confirm('Are you sure you want to delete this weight log entry?')) {
      return;
    }
    
    setWeightLogs(prevLogs => {
      const newLogs = { ...prevLogs };
      newLogs[birdId] = newLogs[birdId].filter(
        log => log.datetime !== logToDelete.datetime
      );
      return newLogs;
    });
    
    toast({
      title: "Weight Log Deleted",
      description: `The entry for ${format(new Date(logToDelete.datetime), "MMMM d, yyyy")} has been removed.`,
      variant: "destructive"
    });
  };
  
  const handleAddWeightLog = (newLog: Omit<WeightLog, 'datetime'>) => {
    const logWithDate: WeightLog = {
      ...newLog,
      datetime: new Date().toISOString(),
    };
  
    setWeightLogs(prev => ({
      ...prev,
      [birdId]: [logWithDate, ...(prev[birdId] || [])].sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
    }));
  
    setIsAddingWeightLog(false);
    toast({
      title: "Weight Log Added",
      description: `New weight of ${newLog.weight}g has been logged for ${selectedBird.name}.`,
    });
  };

  const birdFeedingLogs = feedingLogs[selectedBird.id] || [];
  const birdHusbandryLogs = husbandryLogs[selectedBird.id] || [];
  const birdTrainingLogs = trainingLogs[selectedBird.id] || [];
  const birdMuteLogs = muteLogs[selectedBird.id] || [];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
         <BirdProfileHeader bird={selectedBird} />
        <SidebarTrigger />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg"><Scale className="w-5 h-5"/> Weight Trend</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsEditingChartSettings(true)}>
                    <Settings className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent className="flex-grow h-[300px]">
                <WeightChart data={birdWeightLogs} settings={chartSettings} />
            </CardContent>
        </Card>
        <Card className="flex flex-col">
           <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg"><Scale className="w-5 h-5"/> Weight Log</CardTitle>
                <div className="flex items-center">
                 <Dialog open={isAddingWeightLog} onOpenChange={setIsAddingWeightLog}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Plus className="w-4 h-4"/></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Weight Log for {selectedBird.name}</DialogTitle>
                         <DialogDescription>
                            Enter the date, time, and weight for the new log entry.
                        </DialogDescription>
                      </DialogHeader>
                      <AddWeightLogForm
                        onSubmit={handleAddWeightLog}
                        onCancel={() => setIsAddingWeightLog(false)}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                {editingWeightLog ? (
                    <EditWeightLogForm
                        log={editingWeightLog}
                        onSubmit={handleUpdateWeightLog}
                        onCancel={() => setEditingWeightLog(null)}
                    />
                ) : (
                    <WeightLogComponent 
                        logs={birdWeightLogs} 
                        onEdit={setEditingWeightLog}
                        onDelete={handleDeleteWeightLog}
                    />
                )}
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 text-lg"><Footprints className="w-5 h-5"/> Training Log</CardTitle>
                    <CardDescription>Records of training sessions and behaviors.</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <TrainingLogComponent logs={birdTrainingLogs} />
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 text-lg"><Bone className="w-5 h-5"/> Feeding Log</CardTitle>
                    <CardDescription>Daily food intake and notes.</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <FeedingLogComponent logs={birdFeedingLogs} />
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="w-5 h-5"/> Husbandry</CardTitle>
                    <CardDescription>Daily care and equipment checks.</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <HusbandryLog tasks={birdHusbandryLogs} />
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 text-lg"><Droplets className="w-5 h-5"/> Mutes & Castings</CardTitle>
                    <CardDescription>Health monitoring through droppings.</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <MuteLogComponent logs={birdMuteLogs} />
            </CardContent>
        </Card>
      </div>
      
      {isEditingChartSettings && (
        <WeightChartSettings
          open={isEditingChartSettings}
          onOpenChange={setIsEditingChartSettings}
          settings={chartSettings}
          onSave={handleSaveChartSettings}
          averageWeight={averageWeight}
        />
      )}
    </div>
  );
}
