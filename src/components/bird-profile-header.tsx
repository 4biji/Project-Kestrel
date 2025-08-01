
"use client";
import type { Bird } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Scale, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";

interface BirdProfileHeaderProps {
  bird: Bird;
}

export function BirdProfileHeader({ bird }: BirdProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16 border-2 border-primary">
        <AvatarImage src={bird.imageUrl} alt={bird.name} data-ai-hint="falcon bird" />
        <AvatarFallback className="text-lg">{bird.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-3xl font-bold font-headline">{bird.name}</h1>
        <div className="text-muted-foreground flex items-center gap-2">
            <span>{bird.species} - {bird.gender}</span>
            <span className="text-xs">&bull;</span>
             <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                <span>Captured: {format(parseISO(bird.dateCaptured), "MMM d, yyyy")}</span>
             </div>
        </div>
        <Badge variant="secondary" className="mt-2">
            <Scale className="w-3 h-3 mr-1.5" />
            Current Weight: {bird.weight}g
        </Badge>
      </div>
    </div>
  );
}
