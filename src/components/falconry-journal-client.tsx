
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Bird,
  Feather,
  Plus,
  Bot,
  Scale,
  Beef,
  ClipboardList,
  Dumbbell,
  Droplets,
} from "lucide-react";
import type { Bird as BirdType, FeedingLog, HusbandryTask, TrainingLog, MuteLog, WeightLog } from "@/lib/types";

import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { BirdProfileHeader } from "@/components/bird-profile-header";
import { FeedingLogComponent } from "@/components/feeding-log";
import { HusbandryLog } from "@/components/husbandry-log";
import { TrainingLogComponent } from "@/components/training-log";
import { MuteLogComponent } from "@/components/mute-log";
import { WeightChart } from "@/components/weight-chart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AiWeightAnalysis } from "./ai-weight-analysis";
import { WeightLogComponent } from "./weight-log";

interface FalconryJournalClientProps {
  initialData: {
    birds: BirdType[];
    feedingLogs: { [birdId: string]: FeedingLog[] };
    husbandryLogs: { [birdId: string]: HusbandryTask[] };
    trainingLogs: { [birdId: string]: TrainingLog[] };
    muteLogs: { [birdId: string]: MuteLog[] };
    weightLogs: { [birdId: string]: WeightLog[] };
  };
}

export function FalconryJournalClient({ initialData }: FalconryJournalClientProps) {
  const [birds, setBirds] = useState(initialData.birds);
  const [selectedBirdId, setSelectedBirdId] = useState(birds[0]?.id || null);

  const selectedBird = birds.find((b) => b.id === selectedBirdId);
  const birdFeedingLogs = selectedBird ? initialData.feedingLogs[selectedBird.id] || [] : [];
  const birdHusbandryLogs = selectedBird ? initialData.husbandryLogs[selectedBird.id] || [] : [];
  const birdTrainingLogs = selectedBird ? initialData.trainingLogs[selectedBird.id] || [] : [];
  const birdMuteLogs = selectedBird ? initialData.muteLogs[selectedBird.id] || [] : [];
  const birdWeightLogs = selectedBird ? initialData.weightLogs[selectedBird.id] || [] : [];
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground rounded-lg p-2">
                <Feather className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-semibold font-headline">Falconry Journal</h1>
            </div>
          </SidebarHeader>
          <SidebarMenu>
            {birds.map((bird) => (
              <SidebarMenuItem key={bird.id}>
                <SidebarMenuButton
                  onClick={() => setSelectedBirdId(bird.id)}
                  isActive={selectedBirdId === bird.id}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={bird.imageUrl} alt={bird.name} data-ai-hint="falcon bird" />
                    <AvatarFallback>
                      <Bird />
                    </AvatarFallback>
                  </Avatar>
                  <span>{bird.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <Button variant="ghost" className="w-full justify-start gap-2">
                <Plus className="w-4 h-4" />
                Add Bird
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          {selectedBird ? (
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <BirdProfileHeader bird={selectedBird} />
                <SidebarTrigger />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Scale className="w-5 h-5" /> Weight Trend
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <WeightChart data={birdWeightLogs} />
                        </CardContent>
                    </Card>
                    <AiWeightAnalysis weightLogs={birdWeightLogs} />
                </div>
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Scale className="w-5 h-5" /> Weight Log
                            </CardTitle>
                            <Button variant="ghost" size="icon"><Plus className="w-4 h-4"/></Button>
                        </CardHeader>
                        <CardContent>
                            <WeightLogComponent logs={birdWeightLogs} />
                        </CardContent>
                    </Card>
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Beef className="w-5 h-5" /> Feeding Log
                        </CardTitle>
                        <Button variant="ghost" size="icon"><Plus className="w-4 h-4"/></Button>
                    </CardHeader>
                    <CardContent>
                        <FeedingLogComponent logs={birdFeedingLogs} />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Dumbbell className="w-5 h-5" /> Training Log
                        </CardTitle>
                         <Button variant="ghost" size="icon"><Plus className="w-4 h-4"/></Button>
                    </CardHeader>
                    <CardContent>
                        <TrainingLogComponent logs={birdTrainingLogs} />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Droplets className="w-5 h-5" /> Mute & Casting Log
                        </CardTitle>
                         <Button variant="ghost" size="icon"><Plus className="w-4 h-4"/></Button>
                    </CardHeader>
                    <CardContent>
                        <MuteLogComponent logs={birdMuteLogs} />
                    </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Feather className="w-16 h-16 text-muted-foreground" />
              <h2 className="mt-4 text-2xl font-semibold">No Bird Selected</h2>
              <p className="mt-2 text-muted-foreground">
                Please select a bird from the sidebar or add a new one to begin.
              </p>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Add Bird
              </Button>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
