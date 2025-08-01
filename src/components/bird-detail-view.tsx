

      
"use client";

import { useState, useEffect } from "react";
import type { Bird as BirdType, LogEntry, FeedingLog, HusbandryTask, TrainingLog, MuteLog, WeightLog, NutritionInfo, HuntingLog, PredefinedHusbandryTask, PredefinedTraining } from "@/lib/types";
import { format } from 'date-fns';
import { Responsive, WidthProvider } from 'react-grid-layout';

import { BirdProfileHeader } from "@/components/bird-profile-header";
import { WeightChart } from "@/components/weight-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { WeightLogComponent, ViewAllLogsDialog } from "./weight-log";
import { AddWeightLogForm } from "./add-weight-log-form";
import { useToast } from "@/hooks/use-toast";
import { Scale, Plus, Bone, ShieldCheck, Footprints, Droplets, Settings, ScrollText, ClipboardList, Rabbit, Eye, EyeOff, PlusSquare } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { AddFeedingLogForm } from "./add-feeding-log-form";
import { AddMuteLogForm } from "./add-mute-log-form";
import { AddTrainingLogForm } from "./add-training-log-form";
import { AddHuntingLogForm } from "./add-hunting-log-form";
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
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WeightChartSettings, type WeightChartSettingsData, weightChartSettingsSchema } from "./weight-chart-settings";
import { NutritionTable } from "./nutrition-table";
import { nutritionInfo as initialNutritionInfo, predefinedHusbandryTasks as initialPredefinedHusbandryTasks, predefinedTraining as initialPredefinedTraining } from "@/lib/data";
import { type SettingsData } from "./settings-dialog";
import { HusbandrySettingsDialog } from "./husbandry-settings-dialog";
import { LogHusbandryTaskForm } from "./log-husbandry-task-form";
import { TrainingSettingsDialog } from "./training-settings-dialog";
import { EditLogDialog } from "./edit-log-dialog";

const ResponsiveGridLayout = WidthProvider(Responsive);

type LogType = 'weight' | 'feeding' | 'husbandry' | 'training' | 'mute' | 'hunting';

const defaultLayouts: Responsive.Layouts = {
    lg: [
      { i: 'weight-trend', x: 0, y: 0, w: 4, h: 2 },
      { i: 'weight-log', x: 0, y: 2, w: 1, h: 3 },
      { i: 'feeding-log', x: 1, y: 2, w: 1, h: 3 },
      { i: 'training-log', x: 2, y: 2, w: 1, h: 3 },
      { i: 'hunting-log', x: 3, y: 2, w: 1, h: 3 },
      { i: 'husbandry', x: 0, y: 5, w: 1, h: 3 },
      { i: 'mutes-castings', x: 1, y: 5, w: 1, h: 3 },
      { i: 'first-aid', x: 2, y: 5, w: 2, h: 3 },
    ],
};

interface BirdDetailViewProps {
  initialData: {
    birds: BirdType[];
    logs: { [birdId: string]: LogEntry[] };
  };
  birdId: string;
  settings: SettingsData;
}

export function BirdDetailView({ initialData, birdId, settings }: BirdDetailViewProps) {
  const [birds, setBirds] = useState(initialData.birds);
  const [logs, setLogs] = useState(initialData.logs);

  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);

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
  
  const [isViewingAllWeightLogs, setIsViewingAllWeightLogs] = useState(false);
  const [isViewingAllTrainingLogs, setIsViewingAllTrainingLogs] = useState(false);
  const [isViewingAllFeedingLogs, setIsViewingAllFeedingLogs] = useState(false);
  const [isViewingAllHusbandryLogs, setIsViewingAllHusbandryLogs] = useState(false);
  const [isViewingAllMuteLogs, setIsViewingAllMuteLogs] = useState(false);
  const [isViewingAllHuntingLogs, setIsViewingAllHuntingLogs] = useState(false);

  const [isViewingNutritionTable, setIsViewingNutritionTable] = useState(false);
  const [isEditingHusbandrySettings, setIsEditingHusbandrySettings] = useState(false);
  const [isEditingTrainingSettings, setIsEditingTrainingSettings] = useState(false);

  const [predefinedHusbandryTasks, setPredefinedHusbandryTasks] = useState<PredefinedHusbandryTask[]>(initialPredefinedHusbandryTasks);
  const [predefinedTraining, setPredefinedTraining] = useState<PredefinedTraining[]>(initialPredefinedTraining);
  
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo[]>(initialNutritionInfo);
  
  const handleUpdateNutritionInfo = (newInfo: NutritionInfo[]) => {
    setNutritionInfo(newInfo);
    toast({
        title: "Nutrition Table Updated",
        description: "The food nutrition information has been saved.",
    });
  }

  const handleUpdateHusbandryTasks = (tasks: PredefinedHusbandryTask[]) => {
    setPredefinedHusbandryTasks(tasks);
    toast({
        title: "Husbandry Tasks Updated",
        description: "Your predefined tasks have been saved.",
    });
  }

  const handleUpdateTraining = (trainings: PredefinedTraining[]) => {
    setPredefinedTraining(trainings);
    toast({
        title: "Training Behaviors Updated",
        description: "Your predefined behaviors have been saved.",
    });
  }

  const selectedBird = birds.find(b => b.id === birdId);

  if (!selectedBird) {
    return <p>Bird not found.</p>;
  }

  const birdLogs = logs[selectedBird.id] || [];
  const birdWeightLogs = birdLogs.filter(l => l.logType === 'weight') as WeightLog[];
  const birdFeedingLogs = birdLogs.filter(l => l.logType === 'feeding') as FeedingLog[];
  const birdHusbandryLogs = birdLogs.filter(l => l.logType === 'husbandry') as HusbandryTask[];
  const birdTrainingLogs = birdLogs.filter(l => l.logType === 'training') as TrainingLog[];
  const birdMuteLogs = birdLogs.filter(l => l.logType === 'mute') as MuteLog[];
  const birdHuntingLogs = birdLogs.filter(l => l.logType === 'hunting') as HuntingLog[];
  
  const averageWeight = birdWeightLogs.length > 0 ? birdWeightLogs.reduce((acc, log) => acc + log.weight, 0) / birdWeightLogs.length : 0;


  const handleSaveChartSettings = (settings: WeightChartSettingsData) => {
    setChartSettings(settings);
    setIsEditingChartSettings(false);
    toast({
      title: "Chart Settings Updated",
      description: "Your changes to the weight chart have been saved.",
    });
  };

  const handleUpdateLog = (updatedLog: LogEntry) => {
    if (!editingLog) return;
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
      title: "Log Updated",
      description: `An entry has been updated.`,
    });
  };

  const handleDeleteLog = (logToDelete: LogEntry) => {
    if (!confirm('Are you sure you want to delete this log entry?')) return;
    
    setLogs(prevLogs => {
      const newLogs = { ...prevLogs };
      newLogs[birdId] = newLogs[birdId].filter(
        log => log.id !== logToDelete.id
      );
      return newLogs;
    });
    
    toast({
      title: "Log Deleted",
      description: `The entry has been removed.`,
      variant: "destructive"
    });
  };
  
  const handleAddLog = (newLogData: Omit<LogEntry, 'id' | 'datetime'>, logType: LogType) => {
    const newLog: LogEntry = {
      ...newLogData,
      id: `${logType.charAt(0)}${Date.now()}`,
      datetime: new Date().toISOString(),
      logType,
    } as LogEntry;

    if (logType === 'weight' && 'time' in newLogData && 'date' in newLogData) {
        const { date, time, ...rest } = newLogData as any;
        const [hours, minutes] = time.split(':').map(Number);
        const combinedDateTime = new Date(date);
        combinedDateTime.setHours(hours);
        combinedDateTime.setMinutes(minutes);
        (newLog as WeightLog).datetime = combinedDateTime.toISOString();
    }
    
    if (logType === 'feeding') {
      const feedingData = newLogData as Omit<FeedingLog, 'id' | 'datetime' | 'logType'>;
      const foodInfo = nutritionInfo.find(ni => ni.foodType.toLowerCase() === feedingData.foodItem.toLowerCase());
      if (foodInfo) {
        const protein = (feedingData.amount / 100) * foodInfo.proteinPer100g;
        (newLog as FeedingLog).protein = Math.round(protein * 10) / 10;
      }
    }


    setLogs(prev => ({
      ...prev,
      [birdId]: [newLog, ...(prev[birdId] || [])].sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
    }));

    setAddingLogType(null);
    toast({
        title: `${logType.charAt(0).toUpperCase() + logType.slice(1)} Log Added`,
    });
  };
  
  const getAddLogCardTitle = (logType: LogType | null) => {
    switch (logType) {
        case 'weight': return 'Add Weight Log';
        case 'feeding': return 'Add Feeding Log';
        case 'husbandry': return 'Log Husbandry Task';
        case 'training': return 'Add Training Log';
        case 'mute': return 'Add Mute/Casting Log';
        case 'hunting': return 'Add Hunting Log';
        default: return '';
    }
  }

  const handleEditLog = (log: LogEntry) => {
    setIsViewingAllWeightLogs(false);
    setIsViewingAllFeedingLogs(false);
    setIsViewingAllHusbandryLogs(false);
    setIsViewingAllHuntingLogs(false);
    setIsViewingAllMuteLogs(false);
    setIsViewingAllTrainingLogs(false);
    setEditingLog(log);
  }


  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
         <BirdProfileHeader bird={selectedBird} />
        <SidebarTrigger />
      </div>
      
      <ResponsiveGridLayout 
        className="layout"
        layouts={defaultLayouts}
        breakpoints={{lg: 1200, md: 768, sm: 640, xs: 0}}
        cols={{lg: 4, md: 2, sm: 1, xs: 1}}
        rowHeight={settings.rowHeight}
        isDraggable={false}
        isResizable={false}
      >
        <div key="weight-trend" style={{ display: settings.visibleCards['weight-trend'] ? 'block' : 'none' }}>
            <Card className="flex flex-col h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg"><Scale className="w-5 h-5"/> Weight Trend</CardTitle>
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={() => setIsEditingChartSettings(true)}>
                            <Settings className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <WeightChart data={birdWeightLogs} settings={chartSettings} feedingLogs={birdFeedingLogs} />
                </CardContent>
            </Card>
        </div>
        <div key="weight-log" style={{ display: settings.visibleCards['weight-log'] ? 'block' : 'none' }}>
            <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between">
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
                        <DropdownMenuItem onSelect={() => setIsViewingAllWeightLogs(true)}>
                        <ScrollText className="mr-2 h-4 w-4" />
                        <span>View All Logs</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
                <CardContent className="flex-grow">
                    <WeightLogComponent 
                        logs={birdWeightLogs} 
                        onEdit={handleEditLog}
                        onDelete={handleDeleteLog}
                    />
                </CardContent>
        </Card>
        </div>
        <div key="training-log" style={{ display: settings.visibleCards['training-log'] ? 'block' : 'none' }}>
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
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
                                <DropdownMenuItem onSelect={() => setIsEditingTrainingSettings(true)}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Manage Training</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setIsViewingAllTrainingLogs(true)}>
                                    <ScrollText className="mr-2 h-4 w-4" />
                                    <span>View All Logs</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent>
                    <TrainingLogComponent logs={birdTrainingLogs} onEdit={handleEditLog} onDelete={handleDeleteLog} />
                </CardContent>
            </Card>
        </div>
        <div key="feeding-log" style={{ display: settings.visibleCards['feeding-log'] ? 'block' : 'none' }}>
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
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
                    <FeedingLogComponent logs={birdFeedingLogs} onEdit={handleEditLog} onDelete={handleDeleteLog} />
                </CardContent>
            </Card>
        </div>
        <div key="hunting-log" style={{ display: settings.visibleCards['hunting-log'] ? 'block' : 'none' }}>
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
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
                   <HuntingLogComponent logs={birdHuntingLogs} onEdit={handleEditLog} onDelete={handleDeleteLog} />
                </CardContent>
            </Card>
        </div>
        <div key="husbandry" style={{ display: settings.visibleCards['husbandry'] ? 'block' : 'none' }}>
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
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
                                <DropdownMenuItem onSelect={() => setIsEditingHusbandrySettings(true)}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Manage Tasks</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setIsViewingAllHusbandryLogs(true)}>
                                    <ScrollText className="mr-2 h-4 w-4" />
                                    <span>View All Logs</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent>
                    <HusbandryLog 
                        predefinedTasks={predefinedHusbandryTasks}
                        loggedTasks={birdHusbandryLogs}
                        onCompleteTask={(task) => handleAddLog({task, completed: true}, 'husbandry')}
                        onEdit={handleEditLog}
                        onDelete={handleDeleteLog}
                    />
                </CardContent>
            </Card>
        </div>
        <div key="mutes-castings" style={{ display: settings.visibleCards['mutes-castings'] ? 'block' : 'none' }}>
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
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
                    <MuteLogComponent logs={birdMuteLogs} onEdit={handleEditLog} onDelete={handleDeleteLog} />
                </CardContent>
            </Card>
        </div>
        <div key="first-aid" style={{ display: settings.visibleCards['first-aid'] ? 'block' : 'none' }}>
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg"><PlusSquare className="w-5 h-5"/> First Aid</CardTitle>
                        <CardDescription>First aid information and logs.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-center text-muted-foreground py-10">First aid information coming soon.</p>
                </CardContent>
            </Card>
        </div>
      </ResponsiveGridLayout>
      
        <Dialog open={!!addingLogType} onOpenChange={(isOpen) => !isOpen && setAddingLogType(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{getAddLogCardTitle(addingLogType)}</DialogTitle>
                </DialogHeader>
                {addingLogType === 'weight' && <AddWeightLogForm onSubmit={(data) => handleAddLog(data, 'weight')} onCancel={() => setAddingLogType(null)} />}
                {addingLogType === 'feeding' && <AddFeedingLogForm birdName={selectedBird.name} nutritionInfo={nutritionInfo} onSubmit={(data) => handleAddLog(data, 'feeding')} onCancel={() => setAddingLogType(null)} />}
                {addingLogType === 'husbandry' && <LogHusbandryTaskForm birdName={selectedBird.name} predefinedTasks={predefinedHusbandryTasks} onSubmit={(data) => handleAddLog(data, 'husbandry')} onCancel={() => setAddingLogType(null)} />}
                {addingLogType === 'training' && <AddTrainingLogForm birdName={selectedBird.name} predefinedTraining={predefinedTraining} onSubmit={(data) => handleAddLog(data, 'training')} onCancel={() => setAddingLogType(null)} />}
                {addingLogType === 'mute' && <AddMuteLogForm birdName={selectedBird.name} onSubmit={(data) => handleAddLog(data, 'mute')} onCancel={() => setAddingLogType(null)} />}
                {addingLogType === 'hunting' && <AddHuntingLogForm birdName={selectedBird.name} onSubmit={(data) => handleAddLog(data, 'hunting')} onCancel={() => setAddingLogType(null)} />}
            </DialogContent>
        </Dialog>
        
        <EditLogDialog 
            log={editingLog} 
            open={!!editingLog} 
            onOpenChange={(isOpen) => !isOpen && setEditingLog(null)}
            onSubmit={handleUpdateLog}
        />

      {isEditingChartSettings && (
        <WeightChartSettings
          open={isEditingChartSettings}
          onOpenChange={setIsEditingChartSettings}
          settings={chartSettings}
          onSave={handleSaveChartSettings}
          averageWeight={averageWeight}
        />
      )}
      {isViewingAllWeightLogs && (
        <ViewAllLogsDialog
            open={isViewingAllWeightLogs}
            onOpenChange={setIsViewingAllWeightLogs}
            logs={birdWeightLogs}
            onEdit={handleEditLog}
            onDelete={handleDeleteLog}
        />
      )}
      {isViewingAllFeedingLogs && (
        <ViewAllFeedingLogsDialog
            open={isViewingAllFeedingLogs}
            onOpenChange={setIsViewingAllFeedingLogs}
            logs={birdFeedingLogs}
            onEdit={handleEditLog}
            onDelete={handleDeleteLog}
        />
      )}
      {isViewingAllHuntingLogs && (
        <ViewAllHuntingLogsDialog
            open={isViewingAllHuntingLogs}
            onOpenChange={setIsViewingAllHuntingLogs}
            logs={birdHuntingLogs}
            onEdit={handleEditLog}
            onDelete={handleDeleteLog}
        />
      )}
      {isViewingAllHusbandryLogs && (
        <ViewAllHusbandryTasksDialog
            open={isViewingAllHusbandryLogs}
            onOpenChange={setIsViewingAllHusbandryLogs}
            tasks={birdHusbandryLogs}
            onEdit={handleEditLog}
            onDelete={handleDeleteLog}
        />
       )}
      {isViewingAllTrainingLogs && (
        <ViewAllTrainingLogsDialog
            open={isViewingAllTrainingLogs}
            onOpenChange={setIsViewingAllTrainingLogs}
            logs={birdTrainingLogs}
            onEdit={handleEditLog}
            onDelete={handleDeleteLog}
        />
      )}
       {isViewingAllMuteLogs && (
        <ViewAllMuteLogsDialog
            open={isViewingAllMuteLogs}
            onOpenChange={setIsViewingAllMuteLogs}
            logs={birdMuteLogs}
            onEdit={handleEditLog}
            onDelete={handleDeleteLog}
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
       {isEditingHusbandrySettings && (
        <HusbandrySettingsDialog
            open={isEditingHusbandrySettings}
            onOpenChange={setIsEditingHusbandrySettings}
            tasks={predefinedHusbandryTasks}
            onSave={handleUpdateHusbandryTasks}
        />
       )}
        {isEditingTrainingSettings && (
            <TrainingSettingsDialog
                open={isEditingTrainingSettings}
                onOpenChange={setIsEditingTrainingSettings}
                trainings={predefinedTraining}
                onSave={handleUpdateTraining}
            />
        )}
    </div>
  );
}



    

    

    

    

