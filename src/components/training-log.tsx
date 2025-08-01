"use client";

import Image from "next/image";
import { format, parseISO } from "date-fns";
import type { TrainingLog } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface TrainingLogProps {
  logs: TrainingLog[];
}

export function TrainingLogComponent({ logs }: TrainingLogProps) {
  return (
    <div className="space-y-4">
      {logs.length > 0 ? (
        <ScrollArea className="h-64">
          <div className="space-y-4 pr-4">
          {logs.map((log) => (
            <div key={log.id} className="p-3 bg-secondary/50 rounded-lg text-sm space-y-2">
              {log.imageUrl && (
                <div className="relative aspect-video rounded-md overflow-hidden">
                    <Image src={log.imageUrl} alt={log.behavior} layout="fill" objectFit="cover" data-ai-hint="falcon training" />
                </div>
              )}
              <div className="font-medium">{log.behavior}</div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{format(parseISO(log.date), 'MMMM d')}</span>
                <Badge variant="outline">{log.duration} min</Badge>
              </div>
              <p className="text-xs mt-1 text-muted-foreground italic">"{log.notes}"</p>
            </div>
          ))}
          </div>
        </ScrollArea>
      ) : (
        <p className="text-sm text-center text-muted-foreground py-10">No training records yet.</p>
      )}
    </div>
  );
}