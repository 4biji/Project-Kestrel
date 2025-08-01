
"use client";

import { useState } from "react";
import {
  Bird,
  Feather,
  Plus,
  LayoutDashboard,
  Settings,
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
import { ManageBirdsDialog } from "./manage-birds-dialog";
import { useToast } from "@/hooks/use-toast";

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
  const [birds, setBirds] = useState(initialData.birds);
  const router = useRouter();
  const pathname = usePathname();
  const [isManageBirdsOpen, setIsManageBirdsOpen] = useState(false);
  const { toast } = useToast();

  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  const handleSaveBirds = (updatedBirds: BirdType[]) => {
    const newBirds = updatedBirds.filter(b => !birds.some(ob => ob.id === b.id));
    const deletedBirds = birds.filter(b => !updatedBirds.some(ub => ub.id === b.id));
    const updatedBirdInfo = updatedBirds.find(b => {
        const original = birds.find(ob => ob.id === b.id);
        return original && JSON.stringify(original) !== JSON.stringify(b);
    });

    setBirds(updatedBirds);
    setIsManageBirdsOpen(false);

    if (newBirds.length > 0) {
        toast({ title: "Bird Added", description: `${newBirds.map(b => b.name).join(', ')} has been added.` });
    } else if (deletedBirds.length > 0) {
        toast({ title: "Bird Removed", description: `${deletedBirds.map(b => b.name).join(', ')} has been removed.`, variant: "destructive" });
        if (view === 'detail' && deletedBirds.some(b => b.id === initialSelectedBirdId)) {
            router.push('/');
        }
    } else if (updatedBirdInfo) {
        toast({ title: "Bird Updated", description: `${updatedBirdInfo.name}'s information has been updated.` });
    }
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
                <SidebarMenuButton onClick={() => setIsManageBirdsOpen(true)}>
                    <Settings className="w-4 h-4" />
                    Manage Birds
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
                <AllBirdsOverview initialData={{
                    birds: initialData.birds,
                    weightLogs: initialData.weightLogs,
                    feedingLogs: initialData.feedingLogs
                }} />
            ) : (
                <BirdDetailView 
                    initialData={initialData} 
                    birdId={initialSelectedBirdId!}
                />
            )}
        </main>
      </SidebarInset>
      <ManageBirdsDialog
        open={isManageBirdsOpen}
        onOpenChange={setIsManageBirdsOpen}
        birds={birds}
        onSave={handleSaveBirds}
      />
    </SidebarProvider>
  );
}
