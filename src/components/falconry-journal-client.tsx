

"use client";

import { useState, useEffect } from "react";
import {
  Bird,
  Feather,
  Plus,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import type { Bird as BirdType, LogEntry } from "@/lib/types";
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
import { SettingsDialog, type SettingsData, settingsSchema } from "./settings-dialog";
import { useToast } from "@/hooks/use-toast";
import { initialBirds, initialLogs } from "@/lib/data";

interface FalconryJournalClientProps {
  view: 'overview' | 'detail';
  selectedBirdId?: string | null;
}

export function FalconryJournalClient({ view, selectedBirdId }: FalconryJournalClientProps) {
  const [birds, setBirds] = useState<BirdType[]>(initialBirds);
  const [logs, setLogs] = useState<{ [birdId: string]: LogEntry[] }>(initialLogs);
  const router = useRouter();
  const pathname = usePathname();
  const [isManageBirdsOpen, setIsManageBirdsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsData>(() => settingsSchema.parse({}));
  const { toast } = useToast();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('default', 'forest', 'desert', 'coastal', 'lake', 'urban');
    root.classList.add(settings.theme);
    if (settings.darkMode) {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
  }, [settings]);

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
    
    if (newBirds.length > 0) {
        toast({ title: "Bird Added", description: `${newBirds.map(b => b.name).join(', ')} has been added.` });
        // Create an empty log array for the new bird
        setLogs(prevLogs => {
            const newLogs = { ...prevLogs };
            newBirds.forEach(bird => {
                if (!newLogs[bird.id]) {
                    newLogs[bird.id] = [];
                }
            });
            return newLogs;
        });
        // Navigate to the new bird's page
        router.push(`/bird/${newBirds[0].id}`);
    } else if (deletedBirds.length > 0) {
        toast({ title: "Bird Removed", description: `${deletedBirds.map(b => b.name).join(', ')} has been removed.`, variant: "destructive" });
        if (view === 'detail' && deletedBirds.some(b => b.id === selectedBirdId)) {
            router.push('/');
        }
    } else if (updatedBirdInfo) {
        toast({ title: "Bird Updated", description: `${updatedBirdInfo.name}'s information has been updated.` });
    } else {
       setIsManageBirdsOpen(false);
    }
  };

  const handleSaveSettings = (newSettings: SettingsData) => {
    setSettings(newSettings);
    setIsSettingsOpen(false);
    toast({
        title: "Settings Saved",
        description: "Your changes have been saved."
    })
  }
  
  const openManageBirds = () => {
    setIsSettingsOpen(false);
    setIsManageBirdsOpen(true);
  }
  
  const birdForDetail = view === 'detail' && selectedBirdId ? birds.find(b => b.id === selectedBirdId) : null;

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
              {birds.filter(b => !b.isHidden).map(bird => (
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
                    <Plus className="w-4 h-4" />
                    Manage Birds
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroup>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setIsSettingsOpen(true)}>
                    <Settings className="w-4 h-4" />
                    Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
            {view === 'overview' && (
                <AllBirdsOverview birds={birds} logs={logs} />
            )}
            {view === 'detail' && birdForDetail && (
                <BirdDetailView 
                    bird={birdForDetail} 
                    allBirds={birds}
                    logs={logs}
                    settings={settings}
                    setLogs={setLogs}
                    setBirds={setBirds}
                />
            )}
             {view === 'detail' && !birdForDetail && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <Feather className="w-16 h-16 text-muted-foreground" />
                    <h2 className="mt-4 text-2xl font-semibold">Bird not found.</h2>
                    <p className="mt-2 text-muted-foreground">
                        The bird you are looking for does not exist or has been deleted.
                    </p>
                    <Button className="mt-4" onClick={() => router.push('/')}>
                        Go to Overview
                    </Button>
                </div>
             )}
        </main>
      </SidebarInset>
      <ManageBirdsDialog
        open={isManageBirdsOpen}
        onOpenChange={setIsManageBirdsOpen}
        birds={birds}
        onSave={handleSaveBirds}
      />
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        settings={settings}
        onSave={handleSaveSettings}
        onManageBirdsClick={openManageBirds}
      />
    </SidebarProvider>
  );
}
