
"use client";

import { useState } from "react";
import type { Bird as BirdType, WeightLog } from "@/lib/types";
import { format } from 'date-fns';

import { BirdProfileHeader } from "@/components/bird-profile-header";
import { WeightChart } from "@/components/weight-chart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { WeightLogComponent } from "./weight-log";
import { EditWeightLogForm } from "./edit-weight-log-form";
import { useToast } from "@/hooks/use-toast";
import { Scale, Feather, Plus } from "lucide-react";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";

interface AllBirdsOverviewProps {
  initialData: {
    birds: BirdType[];
    weightLogs: { [birdId: string]: WeightLog[] };
  };
}

export function AllBirdsOverview({ initialData }: AllBirdsOverviewProps) {
  const [birds, setBirds] = useState(initialData.birds);
  const [weightLogs, setWeightLogs] = useState(initialData.weightLogs);
  const [editingWeightLog, setEditingWeightLog] = useState<WeightLog | null>(null);
  const [overviewTitle, setOverviewTitle] = useState("All Birds Weight Overview");
  const { toast } = useToast();

  const handleUpdateWeightLog = (updatedLog: WeightLog) => {
    if (!editingWeightLog) return;
    
    const birdId = Object.keys(weightLogs).find(id => 
        weightLogs[id].some(log => log.datetime === editingWeightLog.datetime)
    );

    if (!birdId) return;

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
    
    const birdId = Object.keys(weightLogs).find(id => 
        weightLogs[id].some(log => log.datetime === logToDelete.datetime)
    );
    
    if (!birdId) return;

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
            const birdWeightLogs = weightLogs[bird.id] || [];
            const birdForEditing = editingWeightLog && Object.keys(weightLogs).find(id => weightLogs[id].some(l => l.datetime === editingWeightLog.datetime)) === bird.id ? editingWeightLog : null;
            return (
                <div key={bird.id}>
                    <BirdProfileHeader bird={bird} />
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <Card className="flex flex-col">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Scale className="w-5 h-5" /> Weight Trend
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <WeightChart data={birdWeightLogs} />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            <Card className="flex flex-col">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Scale className="w-5 h-5" /> Weight Log
                                    </CardTitle>
                                    <Button variant="ghost" size="icon"><Plus className="w-4 h-4"/></Button>
                                </CardHeader>
                                <CardContent className="h-[188px]">
                                    {birdForEditing ? (
                                        <EditWeightLogForm
                                            log={birdForEditing}
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
                    </div>
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
