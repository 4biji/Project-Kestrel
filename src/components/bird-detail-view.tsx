
"use client";

import { useState, useEffect } from "react";
import type { Bird as BirdType, FeedingLog, HusbandryTask, TrainingLog, MuteLog, WeightLog, NutritionInfo, HuntingLog } from "@/lib/types";
import { format } from 'date-fns';
import { Responsive, WidthProvider } from 'react-grid-layout';

import { BirdProfileHeader } from "@/components/bird-profile-header";
import { WeightChart } from "@/components/weight-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { WeightLogComponent, ViewAllLogsDialog } from "./weight-log";
import { EditWeightLogForm } from "./edit-weight-log-form";
import { AddWeightLogForm } from "./add-weight-log-form";
import { useToast } from "@/hooks/use-toast";
import { Scale, Plus, Bone, ShieldCheck, Footprints, Droplets, Settings, ScrollText, ClipboardList, X, Rabbit } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { AddFeedingLogForm } from "./add-feeding-log-form";
import { AddHusbandryTaskForm } from "./add-husbandry-task-form";
import { AddMuteLogForm } from "./add-mute-log-form";
import { AddTrainingLogForm } from "./add-training-log-form";
import { AddHuntingLogForm } from "./add-hunting-log-form";
import { EditFeedingLogForm } from "./edit-feeding-log-form";
import { EditHusbandryTaskForm } from "./edit-husbandry-task-form";
import { EditMuteLogForm } from "./edit-mute-log-form";
import { EditTrainingLogForm } from "./edit-training-log-form";
import { EditHuntingLogForm } from "./edit-hunting-log-form";
import { FeedingLogComponent, ViewAllFeedingLogsDialog } from "./feeding-log";
import { HusbandryLog, ViewAllHusbandryTasksDialog } from "./husbandry-log";
import { MuteLogComponent, ViewAllMuteLogsDialog } from "./mute-log";
import { TrainingLogComponent, ViewAllTrainingLogsDialog } from "./training-log";
import { HuntingLogComponent, ViewAllHuntingLogsDialog } from "./hunting-log";
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
import { NutritionTable } from "./nutrition-table";
import { nutritionInfo as initialNutritionInfo } from "@/lib/data";
import { type SettingsData } from "./settings-dialog";

const ResponsiveGridLayout = WidthProvider(Responsive);

type LogType = 'weight' | 'feeding' | 'husbandry' | 'training' | 'mute' | 'hunting';

interface BirdDetailViewProps {
  initialData: {
    birds: BirdType[];
    feedingLogs: { [birdId: string]: FeedingLog[] };
    husbandryLogs: { [birdId: string]: HusbandryTask[] };
    trainingLogs: { [birdId: string]: TrainingLog[] };
    muteLogs: { [birdId: string]: MuteLog[] };
    weightLogs: { [birdId: string]: WeightLog[] };
    huntingLogs: { [birdId: string]: HuntingLog[] };
  };
  birdId: string;
  settings: SettingsData;
}

export function BirdDetailView({ initialData, birdId, settings }: BirdDetailViewProps) {
  const [birds, setBirds] = useState(initialData.birds);
  const [feedingLogs, setFeedingLogs] = useState(initialData.feedingLogs);
  const [husbandryLogs, setHusbandryLogs] = useState(initialData.husbandryLogs);
  const [trainingLogs, setTrainingLogs] = useState(initialData.trainingLogs);
  const [muteLogs, setMuteLogs] = useState(initialData.muteLogs);
  const [weightLogs, setWeightLogs] = useState(initialData.weightLogs);
  const [huntingLogs, setHuntingLogs] = useState(initialData.huntingLogs);
  
  const [editingWeightLog, setEditingWeightLog] = useState<WeightLog | null>(null);
  const [editingFeedingLog, setEditingFeedingLog] = useState<FeedingLog | null>(null);
  const [editingHusbandryTask, setEditingHusbandryTask] = useState<HusbandryTask | null>(null);
  const [editingTrainingLog, setEditingTrainingLog] = useState<TrainingLog | null>(null);
  const [editingMuteLog, setEditingMuteLog] = useState<MuteLog | null>(null);
  const [editingHuntingLog, setEditingHuntingLog] = useState<HuntingLog | null>(null);

  const [addingLogType, setAddingLogType] = useState<LogType | null>(null);
  const { toast } = useToast();

  const [chartSettings, setChartSettings] = useState<WeightChartSettingsData>(
    weightChartSettingsSchema.parse({
        huntingWeight: {},
        presetAlert: {},
        alertBelowAverage: {},
        showFeedingEvents: true,
    })
  );
  const [isEditingChartSettings, setIsEditingChartSettings] = useState(false);
  const [isViewingAllLogs, setIsViewingAllLogs] = useState(false);
  
  const [isViewingAllTrainingLogs, setIsViewingAllTrainingLogs] = useState(false);
  const [isViewingAllFeedingLogs, setIsViewingAllFeedingLogs] = useState(false);
  const [isViewingAllHusbandryLogs, setIsViewingAllHusbandryLogs] = useState(false);
  const [isViewingAllMuteLogs, setIsViewingAllMuteLogs] = useState(false);
  const [isViewingAllHuntingLogs, setIsViewingAllHuntingLogs] = useState(false);
  const [isViewingNutritionTable, setIsViewingNutritionTable] = useState(false);
  
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo[]>(initialNutritionInfo);
  
  const [layouts, setLayouts] = useState<Responsive.Layouts>({
    lg: [
      { i: 'weight-trend', x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
      { i: 'weight-log', x: 0, y: 2, w: 1, h: 2, minW: 1, minH: 2 },
      { i: 'training-log', x: 1, y: 2, w: 1, h: 2, minW: 1, minH: 2 },
      { i: 'feeding-log', x: 2, y: 2, w: 1, h: 2, minW: 1, minH: 2 },
      { i: 'hunting-log', x: 3, y: 2, w: 1, h: 2, minW: 1, minH: 2 },
      { i: 'husbandry', x: 0, y: 4, w: 1, h: 2, minW: 1, minH: 2 },
      { i: 'mutes-castings', x: 1, y: 4, w: 1, h: 2, minW: 1, minH: 2 },
      { i: 'add-log', x: 2, y: 4, w: 1, h: 2, minW: 1, minH: 2},
    ],
  });

  useEffect(() => {
    try {
      const savedLayouts = localStorage.getItem(`layouts_${birdId}`);
      if (settings.isLayoutEditable && savedLayouts) {
        setLayouts(JSON.parse(savedLayouts));
      }
    } catch (error) {
      console.error("Could not load layouts from local storage", error);
    }
  }, [birdId, settings.isLayoutEditable]);


  const onLayoutChange = (layout: any, allLayouts: Responsive.Layouts) => {
    try {
      if (settings.isLayoutEditable) {
        localStorage.setItem(`layouts_${birdId}`, JSON.stringify(allLayouts));
        setLayouts(allLayouts);
      }
    } catch (error) {
      console.error("Could not save layouts to local storage", error);
    }
  };


  const handleUpdateNutritionInfo = (newInfo: NutritionInfo[]) => {
    setNutritionInfo(newInfo);
    toast({
        title: "Nutrition Table Updated",
        description: "The food nutrition information has been saved.",
    });
  }

  const selectedBird = birds.find(b => b.id === birdId);

  if (!selectedBird) {
    return <p>Bird not found.</p>;
  }
  
  const birdWeightLogs = weightLogs[selectedBird.id] || [];
  const birdFeedingLogs = feedingLogs[selectedBird.id] || [];
  const birdHusbandryLogs = husbandryLogs[selectedBird.id] || [];
  const birdTrainingLogs = trainingLogs[selectedBird.id] || [];
  const birdMuteLogs = muteLogs[selectedBird.id] || [];
  const birdHuntingLogs = huntingLogs[selectedBird.id] || [];

  const averageWeight = birdWeightLogs.length > 0 ? birdWeightLogs.reduce((acc, log) => acc + log.weight, 0) / birdWeightLogs.length : 0;


  const handleSaveChartSettings = (settings: WeightChartSettingsData) => {
    setChartSettings(settings);
    setIsEditingChartSettings(false);
    toast({
      title: "Chart Settings Updated",
      description: "Your changes to the weight chart have been saved.",
    });
  };

  const createUpdater = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<{ [key: string]: T[] }>>, type: string) => (updatedItem: T) => {
    setter(prev => ({
        ...prev,
        [birdId]: prev[birdId].map(item => item.id === updatedItem.id ? updatedItem : item)
    }));
    toast({ title: `${type} Updated` });
  };

  const createDeleter = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<{ [key: string]: T[] }>>, type: string) => (itemToDelete: T) => {
    if (!confirm(`Are you sure you want to delete this ${type.toLowerCase()}?`)) return;
    setter(prev => ({
        ...prev,
        [birdId]: prev[birdId].filter(item => item.id !== itemToDelete.id)
    }));
    toast({ title: `${type} Deleted`, variant: 'destructive' });
  };

  const handleUpdateFeedingLog = createUpdater(setFeedingLogs, "Feeding Log");
  const handleDeleteFeedingLog = createDeleter(setFeedingLogs, "Feeding Log");
  const handleUpdateHusbandryTask = createUpdater(setHusbandryLogs, "Husbandry Task");
  const handleDeleteHusbandryTask = createDeleter(setHusbandryLogs, "Husbandry Task");
  const handleUpdateTrainingLog = createUpdater(setTrainingLogs, "Training Log");
  const handleDeleteTrainingLog = createDeleter(setTrainingLogs, "Training Log");
  const handleUpdateMuteLog = createUpdater(setMuteLogs, "Mute Log");
  const handleDeleteMuteLog = createDeleter(setMuteLogs, "Mute Log");
  const handleUpdateHuntingLog = createUpdater(setHuntingLogs, "Hunting Log");
  const handleDeleteHuntingLog = createDeleter(setHuntingLogs, "Hunting Log");


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
     if (!confirm('Are you sure you want to delete this weight log entry?')) return;
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
  
  const handleAddWeightLog = (newLog: Omit<WeightLog, 'datetime'> & { datetime: string }) => {
    const logWithDate: WeightLog = {
      ...newLog,
    };
    setWeightLogs(prev => ({
      ...prev,
      [birdId]: [logWithDate, ...(prev[birdId] || [])].sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
    }));
    setAddingLogType(null);
    toast({
      title: "Weight Log Added",
      description: `New weight of ${newLog.weight}g has been logged for ${selectedBird.name}.`,
    });
  };

   const handleAddFeedingLog = (data: Omit<FeedingLog, 'id' | 'datetime'>) => {
    const newLog: FeedingLog = { ...data, id: `f${Date.now()}`, datetime: new Date().toISOString() };
    setFeedingLogs(prev => ({...prev, [birdId]: [newLog, ...(prev[birdId] || [])]}));
    setAddingLogType(null);
    toast({ title: "Feeding Log Added" });
  };
  
  const handleAddHusbandryTask = (data: Omit<HusbandryTask, 'id' | 'completed'>) => {
    const newTask: HusbandryTask = { ...data, id: `h${Date.now()}`, completed: false };
    setHusbandryLogs(prev => ({...prev, [birdId]: [newTask, ...(prev[birdId] || [])]}));
    setAddingLogType(null);
    toast({ title: "Husbandry Task Added" });
  };
  
  const handleAddTrainingLog = (data: Omit<TrainingLog, 'id' | 'datetime'>) => {
    const newLog: TrainingLog = { ...data, id: `t${Date.now()}`, datetime: new Date().toISOString() };
    setTrainingLogs(prev => ({...prev, [birdId]: [newLog, ...(prev[birdId] || [])]}));
    setAddingLogType(null);
    toast({ title: "Training Log Added" });
  };
  
  const handleAddMuteLog = (data: Omit<MuteLog, 'id' | 'datetime'>) => {
    const newLog: MuteLog = { ...data, id: `m${Date.now()}`, datetime: new Date().toISOString() };
    setMuteLogs(prev => ({...prev, [birdId]: [newLog, ...(prev[birdId] || [])]}));
    setAddingLogType(null);
    toast({ title: "Mute/Casting Log Added" });
  };

  const handleAddHuntingLog = (data: Omit<HuntingLog, 'id' | 'datetime'>) => {
    const newLog: HuntingLog = { ...data, id: `hunt${Date.now()}`, datetime: new Date().toISOString() };
    setHuntingLogs(prev => ({...prev, [birdId]: [newLog, ...(prev[birdId] || [])]}));
    setAddingLogType(null);
    toast({ title: "Hunting Log Added" });
  };

  const getFilteredLayouts = () => {
    const visibleCardKeys = Object.entries(settings.visibleCards)
      .filter(([, visible]) => visible)
      .map(([key]) => key);

    if (addingLogType) {
      visibleCardKeys.push('add-log');
    }

    const filteredLayouts: Responsive.Layouts = {
      lg: layouts.lg?.filter(l => visibleCardKeys.includes(l.i)) || [],
    };
    return filteredLayouts;
  };
  
  const getAddLogCardTitle = (logType: LogType | null) => {
    switch (logType) {
        case 'weight': return 'Add Weight Log';
        case 'feeding': return 'Add Feeding Log';
        case 'husbandry': return 'Add Husbandry Task';
        case 'training': return 'Add Training Log';
        case 'mute': return 'Add Mute/Casting Log';
        case 'hunting': return 'Add Hunting Log';
        default: return '';
    }
  }


  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
         <BirdProfileHeader bird={selectedBird} />
        <SidebarTrigger />
      </div>
      
      <ResponsiveGridLayout 
        className="layout"
        layouts={getFilteredLayouts()}
        onLayoutChange={onLayoutChange}
        breakpoints={{lg: 1200, md: 768, sm: 640, xs: 0}}
        cols={{lg: 4, md: 2, sm: 1, xs: 1}}
        rowHeight={150}
        draggableHandle=".card-header"
        isDraggable={settings.isLayoutEditable}
        isResizable={settings.isLayoutEditable}
      >
        {settings.visibleCards['weight-trend'] && (
            <div key="weight-trend">
                <Card className="flex flex-col h-full">
                    <CardHeader className="flex flex-row items-center justify-between card-header cursor-move">
                        <CardTitle className="flex items-center gap-2 text-lg"><Scale className="w-5 h-5"/> Weight Trend</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setIsEditingChartSettings(true)}>
                            <Settings className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <WeightChart data={birdWeightLogs} settings={chartSettings} feedingLogs={birdFeedingLogs} />
                    </CardContent>
                </Card>
            </div>
        )}
        {settings.visibleCards['weight-log'] && (
            <div key="weight-log">
               <Card className="flex flex-col h-full">
               <CardHeader className="flex flex-row items-center justify-between card-header cursor-move">
                    <CardTitle className="flex items-center gap-2 text-lg"><Scale className="w-5 h-5"/> Weight Log</CardTitle>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" onClick={() => setAddingLogType('weight')}><Plus className="w-4 h-4"/></Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setIsViewingAllLogs(true)}>
                            <ScrollText className="mr-2 h-4 w-4" />
                            <span>View All Logs</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
        )}
        {settings.visibleCards['training-log'] && (
            <div key="training-log">
                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between card-header cursor-move">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg"><Footprints className="w-5 h-5"/> Training Log</CardTitle>
                            <CardDescription>Records of training sessions and behaviors.</CardDescription>
                        </div>
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" onClick={() => setAddingLogType('training')}><Plus className="w-4 h-4"/></Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => setIsViewingAllTrainingLogs(true)}>
                                        <ScrollText className="mr-2 h-4 w-4" />
                                        <span>View All Logs</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {editingTrainingLog ? (
                            <EditTrainingLogForm
                                log={editingTrainingLog}
                                onSubmit={(data) => {
                                    handleUpdateTrainingLog(data);
                                    setEditingTrainingLog(null);
                                }}
                                onCancel={() => setEditingTrainingLog(null)}
                            />
                        ) : (
                            <TrainingLogComponent logs={birdTrainingLogs} onEdit={setEditingTrainingLog} onDelete={handleDeleteTrainingLog} />
                        )}
                    </CardContent>
                </Card>
            </div>
        )}
        {settings.visibleCards['feeding-log'] && (
            <div key="feeding-log">
                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between card-header cursor-move">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg"><Bone className="w-5 h-5"/> Feeding Log</CardTitle>
                            <CardDescription>Daily food intake and notes.</CardDescription>
                        </div>
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" onClick={() => setAddingLogType('feeding')}><Plus className="w-4 h-4"/></Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => setIsViewingNutritionTable(true)}>
                                        <ClipboardList className="mr-2 h-4 w-4" />
                                        <span>Nutrition Table</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setIsViewingAllFeedingLogs(true)}>
                                        <ScrollText className="mr-2 h-4 w-4" />
                                        <span>View All Logs</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {editingFeedingLog ? (
                            <EditFeedingLogForm
                                log={editingFeedingLog}
                                onSubmit={(data) => {
                                    handleUpdateFeedingLog(data);
                                    setEditingFeedingLog(null);
                                }}
                                onCancel={() => setEditingFeedingLog(null)}
                            />
                        ) : (
                            <FeedingLogComponent logs={birdFeedingLogs} onEdit={setEditingFeedingLog} onDelete={handleDeleteFeedingLog} />
                        )}
                    </CardContent>
                </Card>
            </div>
        )}
        {settings.visibleCards['hunting-log'] && (
            <div key="hunting-log">
                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between card-header cursor-move">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg"><Rabbit className="w-5 h-5"/> Hunting Log</CardTitle>
                            <CardDescription>Records of hunting sessions.</CardDescription>
                        </div>
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" onClick={() => setAddingLogType('hunting')}><Plus className="w-4 h-4"/></Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => setIsViewingAllHuntingLogs(true)}>
                                        <ScrollText className="mr-2 h-4 w-4" />
                                        <span>View All Logs</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {editingHuntingLog ? (
                            <EditHuntingLogForm
                                log={editingHuntingLog}
                                onSubmit={(data) => {
                                    handleUpdateHuntingLog(data);
                                    setEditingHuntingLog(null);
                                }}
                                onCancel={() => setEditingHuntingLog(null)}
                            />
                        ) : (
                            <HuntingLogComponent logs={birdHuntingLogs} onEdit={setEditingHuntingLog} onDelete={handleDeleteHuntingLog} />
                        )}
                    </CardContent>
                </Card>
            </div>
        )}
        {settings.visibleCards['husbandry'] && (
            <div key="husbandry">
                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between card-header cursor-move">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="w-5 h-5"/> Husbandry</CardTitle>
                            <CardDescription>Daily care and equipment checks.</CardDescription>
                        </div>
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" onClick={() => setAddingLogType('husbandry')}><Plus className="w-4 h-4"/></Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => setIsViewingAllHusbandryLogs(true)}>
                                        <ScrollText className="mr-2 h-4 w-4" />
                                        <span>View All Logs</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {editingHusbandryTask ? (
                             <EditHusbandryTaskForm
                                task={editingHusbandryTask}
                                onSubmit={(data) => {
                                    handleUpdateHusbandryTask(data);
                                    setEditingHusbandryTask(null);
                                }}
                                onCancel={() => setEditingHusbandryTask(null)}
                            />
                        ) : (
                            <HusbandryLog tasks={birdHusbandryLogs} onEdit={setEditingHusbandryTask} onDelete={handleDeleteHusbandryTask} />
                        )}
                    </CardContent>
                </Card>
            </div>
        )}
        {settings.visibleCards['mutes-castings'] && (
            <div key="mutes-castings">
                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between card-header cursor-move">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg"><Droplets className="w-5 h-5"/> Mutes & Castings</CardTitle>
                            <CardDescription>Health monitoring through droppings.</CardDescription>
                        </div>
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" onClick={() => setAddingLogType('mute')}><Plus className="w-4 h-4"/></Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => setIsViewingAllMuteLogs(true)}>
                                        <ScrollText className="mr-2 h-4 w-4" />
                                        <span>View All Logs</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {editingMuteLog ? (
                            <EditMuteLogForm
                                log={editingMuteLog}
                                onSubmit={(data) => {
                                    handleUpdateMuteLog(data);
                                    setEditingMuteLog(null);
                                }}
                                onCancel={() => setEditingMuteLog(null)}
                            />
                        ) : (
                            <MuteLogComponent logs={birdMuteLogs} onEdit={setEditingMuteLog} onDelete={handleDeleteMuteLog} />
                        )}
                    </CardContent>
                </Card>
            </div>
        )}
        {addingLogType && (
             <div key="add-log">
                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between card-header cursor-move">
                        <CardTitle>{getAddLogCardTitle(addingLogType)}</CardTitle>
                         <Button variant="ghost" size="icon" onClick={() => setAddingLogType(null)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {addingLogType === 'weight' && <AddWeightLogForm onSubmit={handleAddWeightLog} onCancel={() => setAddingLogType(null)} />}
                        {addingLogType === 'feeding' && <AddFeedingLogForm birdName={selectedBird.name} onSubmit={handleAddFeedingLog} onCancel={() => setAddingLogType(null)} />}
                        {addingLogType === 'husbandry' && <AddHusbandryTaskForm birdName={selectedBird.name} onSubmit={handleAddHusbandryTask} onCancel={() => setAddingLogType(null)} />}
                        {addingLogType === 'training' && <AddTrainingLogForm birdName={selectedBird.name} onSubmit={handleAddTrainingLog} onCancel={() => setAddingLogType(null)} />}
                        {addingLogType === 'mute' && <AddMuteLogForm birdName={selectedBird.name} onSubmit={handleAddMuteLog} onCancel={() => setAddingLogType(null)} />}
                        {addingLogType === 'hunting' && <AddHuntingLogForm birdName={selectedBird.name} onSubmit={handleAddHuntingLog} onCancel={() => setAddingLogType(null)} />}
                    </CardContent>
                </Card>
            </div>
        )}
      </ResponsiveGridLayout>
      
      {isEditingChartSettings && (
        <WeightChartSettings
          open={isEditingChartSettings}
          onOpenChange={setIsEditingChartSettings}
          settings={chartSettings}
          onSave={handleSaveChartSettings}
          averageWeight={averageWeight}
        />
      )}
      {isViewingAllLogs && (
        <ViewAllLogsDialog
            open={isViewingAllLogs}
            onOpenChange={setIsViewingAllLogs}
            logs={birdWeightLogs}
            onEdit={setEditingWeightLog}
            onDelete={handleDeleteWeightLog}
        />
      )}
      {isViewingAllFeedingLogs && (
        <ViewAllFeedingLogsDialog
            open={isViewingAllFeedingLogs}
            onOpenChange={setIsViewingAllFeedingLogs}
            logs={birdFeedingLogs}
            onEdit={setEditingFeedingLog}
            onDelete={handleDeleteFeedingLog}
        />
      )}
      {isViewingAllHuntingLogs && (
        <ViewAllHuntingLogsDialog
            open={isViewingAllHuntingLogs}
            onOpenChange={setIsViewingAllHuntingLogs}
            logs={birdHuntingLogs}
            onEdit={setEditingHuntingLog}
            onDelete={handleDeleteHuntingLog}
        />
      )}
      {isViewingAllHusbandryLogs && (
        <ViewAllHusbandryTasksDialog
            open={isViewingAllHusbandryLogs}
            onOpenChange={setIsViewingAllHusbandryLogs}
            tasks={birdHusbandryLogs}
            onEdit={setEditingHusbandryTask}
            onDelete={handleDeleteHusbandryTask}
        />
       )}
      {isViewingAllTrainingLogs && (
        <ViewAllTrainingLogsDialog
            open={isViewingAllTrainingLogs}
            onOpenChange={setIsViewingAllTrainingLogs}
            logs={birdTrainingLogs}
            onEdit={setEditingTrainingLog}
            onDelete={handleDeleteTrainingLog}
        />
      )}
       {isViewingAllMuteLogs && (
        <ViewAllMuteLogsDialog
            open={isViewingAllMuteLogs}
            onOpenChange={setIsViewingAllMuteLogs}
            logs={birdMuteLogs}
            onEdit={setEditingMuteLog}
            onDelete={handleDeleteMuteLog}
        />
       )}
       {isViewingNutritionTable && (
        <NutritionTable
            open={isViewingNutritionTable}
            onOpenChange={setIsViewingNutritionTable}
            initialData={nutritionInfo}
            onSave={handleUpdateNutritionInfo}
        />
       )}

    </div>
  );
}
