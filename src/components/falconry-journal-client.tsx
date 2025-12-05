

"use client";

import { useState, useEffect } from "react";
import {
  Bird,
  Feather,
  Plus,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";
import type { Bird as BirdType, LogEntry } from "@/lib/types";
import { usePathname, useRouter } from 'next/navigation';
import type { User } from "firebase/auth";

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
import { Button } from "./ui/button";
import { useAuth, logOut } from "@/lib/auth";

interface FalconryJournalClientProps {
  view: 'overview' | 'detail';
  selectedBirdId?: string | null;
}

export function FalconryJournalClient({ view, selectedBirdId }: FalconryJournalClientProps) {
  const [birds, setBirds] = useState<BirdType[]>([]);
  const [logs, setLogs] = useState<{ [birdId: string]: LogEntry[] }>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isManageBirdsOpen, setIsManageBirdsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsData>(() => settingsSchema.parse({}));
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>({} as User); // Assume user is logged in for now

  // useEffect(() => {
  //   const unsubscribe = useAuth(user => {
  //     if (user) {
  //       setUser(user);
  //     } else {
  //       router.push('/login');
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [router]);

  useEffect(() => {
    // For now, we'll use initial data directly to bypass login for testing
    setBirds(initialBirds);
    setLogs(initialLogs);
    
    try {
      const storedSettings = localStorage.getItem('falconry-settings');
      if (storedSettings) {
        setSettings(settingsSchema.parse(JSON.parse(storedSettings)));
      }
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        // We can re-enable localStorage persistence if needed, but for a pure test env,
        // starting fresh might be better.
        // localStorage.setItem('falconry-birds', JSON.stringify(birds));
        // localStorage.setItem('falconry-logs', JSON.stringify(logs));
        localStorage.setItem('falconry-settings', JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save to localStorage", error);
      }
    }
  }, [birds, logs, settings, isLoaded]);

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
    const originalBirdIds = new Set(birds.map(b => b.id));
    const updatedBirdIds = new Set(updatedBirds.map(b => b.id));

    // Handle Addition
    if (updatedBirds.length > birds.length) {
        const newBird = updatedBirds.find(b => !originalBirdIds.has(b.id));
        if (newBird) {
            setLogs(prevLogs => ({ ...prevLogs, [newBird.id]: [] }));
            setBirds(updatedBirds);
            toast({ title: "Bird Added", description: `${newBird.name} has been added.` });
            router.push(`/bird/${newBird.id}`);
        }
    }
    // Handle Updates
    else {
        const updatedBirdInfo = updatedBirds.find(b => {
            const original = birds.find(ob => ob.id === b.id);
            return original && JSON.stringify(original) !== JSON.stringify(b);
        });
        if (updatedBirdInfo) {
            toast({ title: "Bird Updated", description: `${updatedBirdInfo.name}'s information has been updated.` });
        }
        setBirds(updatedBirds);
    }
    
    setIsManageBirdsOpen(false);
  };

  const handleDeleteBird = (birdId: string, deleteLogs: boolean) => {
    const deletedBird = birds.find(b => b.id === birdId);
    if (!deletedBird) return;

    const updatedBirds = birds.filter(b => b.id !== birdId);
    setBirds(updatedBirds);

    if (deleteLogs) {
        const newLogs = { ...logs };
        delete newLogs[birdId];
        setLogs(newLogs);
    }
    
    toast({ title: "Bird Removed", description: `${deletedBird?.name} has been removed.`, variant: "destructive" });
    
    if (selectedBirdId === birdId) {
        router.push('/');
    }
    
    // Close the manage dialog if it's open
    setIsManageBirdsOpen(false);
  };

  const handleSaveSettings = (newSettings: SettingsData) => {
    setSettings(newSettings);
    setIsSettingsOpen(false);
    toast({
        title: "Settings Saved",
        description: "Your changes have been saved."
    })
  }

  const handleImportData = (data: { birds: BirdType[], logs: { [key: string]: LogEntry[] } }) => {
    setBirds(data.birds);
    setLogs(data.logs);
    setIsSettingsOpen(false);
    toast({
      title: 'Data Imported',
      description: 'Your journal data has been successfully imported.',
    });
    // Navigate to overview to prevent errors if the current bird was removed
    router.push('/');
  };
  
  const openManageBirds = () => {
    setIsSettingsOpen(false);
    setIsManageBirdsOpen(true);
  }

  const handleSignOut = async () => {
    await logOut();
    setUser(null);
    router.push('/login');
  };
  
  const birdForDetail = view === 'detail' && selectedBirdId ? birds.find(b => b.id === selectedBirdId) : null;

  if (!isLoaded || !user) {
    return <div className="flex items-center justify-center h-screen">Loading Journal...</div>
  }

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
                    <Bird className="h-5 w-5" />
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
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setIsSettingsOpen(true)}>
                    <Settings className="w-4 h-4" />
                    Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* {user && (
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleSignOut}>
                        <LogOut />
                        <span>Sign Out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              )} */}
            </SidebarGroup>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
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
             {view === 'detail' && !birdForDetail && isLoaded && (
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
        onDeleteBird={handleDeleteBird}
      />
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        settings={settings}
        onSave={handleSaveSettings}
        onManageBirdsClick={openManageBirds}
        appData={{ birds, logs }}
        onImportData={handleImportData}
      />
    </SidebarProvider>
  );
}
