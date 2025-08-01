
"use client";

import { useState } from "react";
import {
  Bird,
  Feather,
  Plus,
  LayoutDashboard,
} from "lucide-react";
import type { Bird as BirdType, FeedingLog, HusbandryTask, TrainingLog, MuteLog, WeightLog } from "@/lib/types";
import { usePathname, useRouter } from 'next/navigation';

import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { AllBirdsOverview } from "@/components/all-birds-overview";
import { BirdDetailView } from "@/components/bird-detail-view";

interface FalconryJournalClientProps {
  initialData: {
    birds: BirdType[];
    feedingLogs: { [birdId: string]: FeedingLog[] };
    husbandryLogs: { [birdId: string]: HusbandryTask[] };
    trainingLogs: { [birdId: string]: TrainingLog[] };
    muteLogs: { [birdId: string]: MuteLog[] };
    weightLogs: { [birdId: string]: WeightLog[] };
  };
  view: 'overview' | 'detail';
  selectedBirdId?: string | null;
}

export function FalconryJournalClient({ initialData, view, selectedBirdId: initialSelectedBirdId }: FalconryJournalClientProps) {
  const [birds] = useState(initialData.birds);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
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
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleNavigate('/')}
                isActive={pathname === '/'}
              >
                <LayoutDashboard />
                <span>All Birds Overview</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarGroup>
              <SidebarGroupLabel>Your Birds</SidebarGroupLabel>
              {birds.map(bird => (
                <SidebarMenuItem key={bird.id}>
                  <SidebarMenuButton
                    onClick={() => handleNavigate(`/bird/${bird.id}`)}
                    isActive={pathname === `/bird/${bird.id}`}
                  >
                    <Bird />
                    <span>{bird.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
               <SidebarMenuItem>
                <SidebarMenuButton>
                    <Plus className="w-4 h-4" />
                    Add Bird
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroup>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
            {view === 'overview' ? (
                <AllBirdsOverview initialData={initialData} />
            ) : (
                <BirdDetailView 
                    initialData={initialData} 
                    birdId={initialSelectedBirdId!}
                />
            )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
