
"use client";

import type { LogEntry } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { EditWeightLogForm } from "./edit-weight-log-form";
import { EditFeedingLogForm } from "./edit-feeding-log-form";
import { EditHusbandryTaskForm } from "./edit-husbandry-task-form";
import { EditTrainingLogForm } from "./edit-training-log-form";
import { EditMuteLogForm } from "./edit-mute-log-form";
import { EditHuntingLogForm } from "./edit-hunting-log-form";

interface EditLogDialogProps {
  log: LogEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (log: LogEntry) => void;
}

export function EditLogDialog({ log, open, onOpenChange, onSubmit }: EditLogDialogProps) {
  if (!log) return null;

  const handleCancel = () => onOpenChange(false);
  const handleSubmit = (data: LogEntry) => {
    onSubmit(data);
    onOpenChange(false);
  }

  const getForm = () => {
    switch (log.logType) {
      case 'weight':
        return <EditWeightLogForm log={log} onSubmit={handleSubmit} onCancel={handleCancel} />;
      case 'feeding':
        return <EditFeedingLogForm log={log} onSubmit={handleSubmit} onCancel={handleCancel} />;
      case 'husbandry':
        return <EditHusbandryTaskForm task={log} onSubmit={handleSubmit} onCancel={handleCancel} />;
      case 'training':
        return <EditTrainingLogForm log={log} onSubmit={handleSubmit} onCancel={handleCancel} />;
      case 'mute':
        return <EditMuteLogForm log={log} onSubmit={handleSubmit} onCancel={handleCancel} />;
      case 'hunting':
        return <EditHuntingLogForm log={log} onSubmit={handleSubmit} onCancel={handleCancel} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (log.logType) {
        case 'weight': return 'Edit Weight Log';
        case 'feeding': return 'Edit Feeding Log';
        case 'husbandry': return 'Edit Husbandry Task';
        case 'training': return 'Edit Training Log';
        case 'mute': return 'Edit Mute/Casting Log';
        case 'hunting': return 'Edit Hunting Log';
        default: return 'Edit Log';
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        {getForm()}
      </DialogContent>
    </Dialog>
  );
}
