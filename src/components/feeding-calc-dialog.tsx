
"use client";

import { useState, useEffect } from "react";
import { format, differenceInHours } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface FeedingCalcDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    averageHourlyLoss: number;
    currentWeight: number;
}

export function FeedingCalcDialog({ open, onOpenChange, averageHourlyLoss, currentWeight }: FeedingCalcDialogProps) {
    const [targetWeight, setTargetWeight] = useState('');
    const [targetTime, setTargetTime] = useState(format(new Date(), "HH:mm"));
    const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);

     useEffect(() => {
        const tWeight = parseFloat(targetWeight);
        if (!isNaN(tWeight) && currentWeight > 0 && averageHourlyLoss > 0 && targetTime) {
            const now = new Date();
            const [hours, minutes] = targetTime.split(':').map(Number);
            const targetDate = new Date();
            targetDate.setHours(hours, minutes, 0, 0);

            if (targetDate < now) {
                targetDate.setDate(targetDate.getDate() + 1);
            }
            
            const hoursUntilTarget = differenceInHours(targetDate, now);

            if (hoursUntilTarget > 0) {
                const projectedWeightLoss = hoursUntilTarget * averageHourlyLoss;
                const projectedWeight = currentWeight - projectedWeightLoss;
                const amountNeeded = tWeight - projectedWeight;
                setCalculatedAmount(amountNeeded > 0 ? amountNeeded : 0);
            } else {
                 setCalculatedAmount(null);
            }

        } else {
            setCalculatedAmount(null);
        }
    }, [targetWeight, targetTime, averageHourlyLoss, currentWeight]);

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
                        <Label htmlFor="targetTime">Target Time</Label>
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
