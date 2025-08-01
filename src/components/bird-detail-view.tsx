
"use client";

import { useState } from "react";
import type { Bird as BirdType, FeedingLog, HusbandryTask, TrainingLog, MuteLog, WeightLog } from "@/lib/types";
import { format } from 'date-fns';
import { notFound } from "next/navigation";

import { BirdProfileHeader } from "@/components/bird-profile-header";
import { WeightChart } from "@/components/weight-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { WeightLogComponent } from "./weight-log";
import { EditWeightLogForm } from "./edit-weight-log-form";
import { useToast } from "@/hooks/use-toast";
import { Scale, Plus, Bone, ShieldCheck, Footprints, Droplets } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { FeedingLogComponent } from "./feeding-log";
import { HusbandryLog } from "./husbandry-log";
import { TrainingLogComponent } from "./training-log";
import { MuteLogComponent } from "./mute-log";
import { Button } from "./ui/button";

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
  const { toast } = useToast();

  const selectedBird = birds.find(b => b.id === birdId);

  if (!selectedBird) {
    // This should ideally be handled by the page component with notFound()
    return <p>Bird not found.</p>;
  }

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
  
  const birdWeightLogs = weightLogs[selectedBird.id] || [];
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Scale className="w-5 h-5"/> Weight Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <WeightChart data={birdWeightLogs} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Footprints className="w-5 h-5"/> Training Log</CardTitle>
                     <CardDescription>Records of training sessions and behaviors.</CardDescription>
                </CardHeader>
                <CardContent>
                    <TrainingLogComponent logs={birdTrainingLogs} />
                </CardContent>
            </Card>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex flex-col space-y-1.5">
                        <CardTitle className="flex items-center gap-2 text-lg"><Scale className="w-5 h-5"/> Weight Log</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon"><Plus className="w-4 h-4"/></Button>
                </CardHeader>
                <CardContent>
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
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Bone className="w-5 h-5"/> Feeding Log</CardTitle>
                    <CardDescription>Daily food intake and notes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FeedingLogComponent logs={birdFeedingLogs} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="w-5 h-5"/> Husbandry</CardTitle>
                    <CardDescription>Daily care and equipment checks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <HusbandryLog tasks={birdHusbandryLogs} />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Droplets className="w-5 h-5"/> Mutes & Castings</CardTitle>
                    <CardDescription>Health monitoring through droppings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <MuteLogComponent logs={birdMuteLogs} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
