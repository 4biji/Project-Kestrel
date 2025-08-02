
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HeartPulse, Plus, Settings, ScrollText } from "lucide-react";
import type { HealthLog, PredefinedHealthIssue, LogEntry } from "@/lib/types";
import { HealthLogComponent, ViewAllHealthLogsDialog } from "./health-log";
import { HealthLogSettingsDialog } from "./health-log-settings-dialog";
import { AddHealthLogForm } from "./add-health-log-form";
import { HealthIssueDetailDialog } from "./health-issue-detail-dialog";
import { predefinedHealthIssues as initialPredefinedHealthIssues } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface HealthFirstAidCardProps {
    birdName: string;
    logs: HealthLog[];
    predefinedIssues: PredefinedHealthIssue[];
    onAddLog: (logData: Omit<HealthLog, 'id' | 'datetime' | 'logType'>) => void;
    onEditLog: (log: HealthLog) => void;
    onDeleteLog: (log: HealthLog) => void;
    onSaveIssues: (issues: PredefinedHealthIssue[]) => void;
}

export function HealthFirstAidCard({ birdName, logs, predefinedIssues, onAddLog, onEditLog, onDeleteLog, onSaveIssues }: HealthFirstAidCardProps) {
    const [isAddingLog, setIsAddingLog] = useState(false);
    const [isEditingSettings, setIsEditingSettings] = useState(false);
    const [isViewingAllLogs, setIsViewingAllLogs] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<PredefinedHealthIssue | null>(null);
    const [addingLogForIssue, setAddingLogForIssue] = useState<PredefinedHealthIssue | null>(null);

    const handleSaveSettings = (issues: PredefinedHealthIssue[]) => {
        onSaveIssues(issues)
    }

    const handleAddSubmit = (data: Omit<HealthLog, 'id' | 'datetime' | 'logType'>) => {
        onAddLog(data);
        setIsAddingLog(false);
        setAddingLogForIssue(null);
    }
    
    const handleAddForIssue = (issue: PredefinedHealthIssue) => {
        setAddingLogForIssue(issue);
        setSelectedIssue(null); 
    }
    
    const handleCloseDetailDialog = () => {
        setSelectedIssue(null);
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <HeartPulse className="w-5 h-5"/> Health & First Aid
                    </CardTitle>
                    <CardDescription>Track issues and access resources.</CardDescription>
                </div>
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => setIsAddingLog(true)}><Plus className="w-4 h-4"/></Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Settings className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => setIsEditingSettings(true)}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Manage Issues</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setIsViewingAllLogs(true)}>
                                <ScrollText className="mr-2 h-4 w-4" />
                                <span>View All Logs</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <HealthLogComponent 
                    logs={logs} 
                    predefinedIssues={predefinedIssues} 
                    onEdit={onEditLog} 
                    onDelete={onDeleteLog}
                    onIssueClick={setSelectedIssue}
                />
            </CardContent>

             <Dialog open={isAddingLog || !!addingLogForIssue} onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setIsAddingLog(false);
                    setAddingLogForIssue(null);
                }
             }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Health Log</DialogTitle>
                    </DialogHeader>
                    <AddHealthLogForm 
                        birdName={birdName}
                        predefinedIssues={predefinedIssues}
                        onSubmit={handleAddSubmit}
                        onCancel={() => {
                            setIsAddingLog(false);
                            setAddingLogForIssue(null);
                        }}
                        initialCondition={addingLogForIssue?.issue}
                    />
                </DialogContent>
            </Dialog>

            <HealthLogSettingsDialog 
                open={isEditingSettings}
                onOpenChange={setIsEditingSettings}
                issues={predefinedIssues}
                onSave={handleSaveSettings}
            />

            <ViewAllHealthLogsDialog
                open={isViewingAllLogs}
                onOpenChange={setIsViewingAllLogs}
                logs={logs}
                predefinedIssues={predefinedIssues}
                onEdit={onEditLog}
                onDelete={onDeleteLog}
            />
            
            {selectedIssue && (
                 <HealthIssueDetailDialog
                    open={!!selectedIssue}
                    onOpenChange={(isOpen) => !isOpen && handleCloseDetailDialog()}
                    issue={selectedIssue}
                    logs={logs.filter(log => log.condition === selectedIssue.issue)}
                    onAddLog={() => handleAddForIssue(selectedIssue)}
                    onEdit={onEditLog}
                    onDelete={onDeleteLog}
                />
            )}
        </Card>
    )
}
