
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, BookOpen } from "lucide-react";

export function HealthFirstAidCard() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <HeartPulse className="w-5 h-5"/> Health & First Aid
                </CardTitle>
                <CardDescription>Quick references for common health issues.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                    <div className="font-medium flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary"/> Resources
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                        <a href="#" target="_blank" rel="noopener noreferrer" className="block hover:underline text-primary">Bumblefoot Treatment</a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="block hover:underline text-primary">Sour Crop Information</a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="block hover:underline text-primary">Feather Care and Damage</a>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
