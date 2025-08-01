"use client";

import Image from "next/image";
import type { MuteLog } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface MuteLogProps {
  logs: MuteLog[];
}

export function MuteLogComponent({ logs }: MuteLogProps) {
  const getBadgeVariant = (condition: string) => {
    switch (condition) {
      case "Normal":
        return "default";
      case "Greenish":
      case "Blackish":
      case "Yellowish":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      {logs.length > 0 ? (
        <ScrollArea className="h-64">
           <div className="space-y-4 pr-4">
          {logs.map((log) => (
            <div key={log.id} className="p-3 bg-secondary/50 rounded-lg text-sm space-y-2">
              {log.imageUrl && (
                <div className="relative aspect-video rounded-md overflow-hidden">
                    <Image src={log.imageUrl} alt={log.condition} layout="fill" objectFit="cover" data-ai-hint="bird droppings" />
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-medium">Mute/Casting</span>
                <Badge variant={getBadgeVariant(log.condition)}>{log.condition}</Badge>
              </div>
               <div className="text-xs text-muted-foreground">
                 <span>{new Date(log.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}</span>
               </div>
              {log.notes && <p className="text-xs mt-1 text-muted-foreground italic">"{log.notes}"</p>}
            </div>
          ))}
          </div>
        </ScrollArea>
      ) : (
        <p className="text-sm text-center text-muted-foreground py-10">No mute or casting records.</p>
      )}
    </div>
  );
}
