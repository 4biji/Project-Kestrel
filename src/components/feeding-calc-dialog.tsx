
"use client";

import { useState, useEffect } from "react";
import { format, differenceInHours, parseISO } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedingCalcDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    averageHourlyLoss: number;
    currentWeight: number;
}

export function FeedingCalcDialog({ open, onOpenChange, averageHourlyLoss, currentWeight }: FeedingCalcDialogProps) {
    const [targetWeight, setTargetWeight] = useState('');
    const [targetDate, setTargetDate] = useState<Date | undefined>(new Date());
    const [targetTime, setTargetTime] = useState(format(new Date(), "HH:mm"));
    const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);

     useEffect(() => {
        const tWeight = parseFloat(targetWeight);
        if (!isNaN(tWeight) && currentWeight > 0 && averageHourlyLoss > 0 && targetDate && targetTime) {
            const now = new Date();
            const [hours, minutes] = targetTime.split(':').map(Number);
            
            const combinedDateTime = new Date(targetDate);
            combinedDateTime.setHours(hours, minutes, 0, 0);

            if (combinedDateTime < now) {
                // If the time is in the past, maybe don't calculate or assume next day.
                // For now, we will calculate even if in the past for planning.
            }
            
            const hoursUntilTarget = differenceInHours(combinedDateTime, now);

            if (hoursUntilTarget > 0) {
                const projectedWeightLoss = hoursUntilTarget * averageHourlyLoss;
                const projectedWeight = currentWeight - projectedWeightLoss;
                const amountNeeded = tWeight - projectedWeight;
                setCalculatedAmount(amountNeeded > 0 ? amountNeeded : 0);
            } else {
                 setCalculatedAmount(0); // If time is in the past, no feeding needed to reach future weight
            }

        } else {
            setCalculatedAmount(null);
        }
    }, [targetWeight, targetDate, targetTime, averageHourlyLoss, currentWeight]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Feeding Calculator</DialogTitle>
                    <DialogDescription>
                        Calculate food needed based on target weight and time. Uses an average loss of {averageHourlyLoss.toFixed(2)}g/hr.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="targetWeight">Target Weight (g)</Label>
                        <Input id="targetWeight" type="number" placeholder="e.g. 650" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} />
                    </div>
                     <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Target Date & Time</Label>
                        <div className="flex gap-2">
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !targetDate && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {targetDate ? format(targetDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={targetDate}
                                    onSelect={setTargetDate}
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <Label></Label>
                        <Input id="targetTime" type="time" value={targetTime} onChange={(e) => setTargetTime(e.target.value)} />
                    </div>
                    {calculatedAmount !== null && (
                        <div className="text-center pt-4 border-t mt-4">
                            <p className="text-sm text-muted-foreground">Amount to Feed</p>
                            <p className="text-3xl font-bold text-primary">{calculatedAmount.toFixed(1)}g</p>
                        </div>
                    )}
                </div>
                 <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
