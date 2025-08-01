"use client";

import type { FeedingLog } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";

interface FeedingLogProps {
  logs: FeedingLog[];
}

export function FeedingLogComponent({ logs }: FeedingLogProps) {
  return (
    <div className="space-y-4">
      {logs.length > 0 ? (
        <ScrollArea className="h-64">
            <div className="space-y-3 pr-4">
            {logs.map((log) => (
                <div key={log.id} className="p-3 bg-secondary/50 rounded-lg text-sm">
                <div className="flex justify-between font-medium">
                    <span>{log.foodItem}</span>
                    <span>{log.amount}g</span>
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                    <span>{new Date(log.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}</span>
                </div>
                {log.notes && <p className="text-xs mt-1 text-muted-foreground italic">"{log.notes}"</p>}
                </div>
            ))}
            </div>
        </ScrollArea>
      ) : (
        <p className="text-sm text-center text-muted-foreground py-10">No feeding records yet.</p>
      )}
    </div>
  );
}
