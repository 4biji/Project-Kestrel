
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface FeedingCalcDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FeedingCalcDialog({ open, onOpenChange }: FeedingCalcDialogProps) {
    const [targetWeight, setTargetWeight] = useState('');
    const [percentage, setPercentage] = useState('5');
    const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);

     useEffect(() => {
        const tWeight = parseFloat(targetWeight);
        const perc = parseFloat(percentage);
        if (!isNaN(tWeight) && !isNaN(perc) && tWeight > 0) {
            setCalculatedAmount((tWeight * perc) / 100);
        } else {
            setCalculatedAmount(null);
        }
    }, [targetWeight, percentage]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Feeding Calculator</DialogTitle>
                    <DialogDescription>
                        Calculate the recommended feeding amount based on target weight.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="targetWeight">Target Weight (g)</Label>
                        <Input id="targetWeight" type="number" placeholder="e.g. 650" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="percentage">Percentage (%)</Label>
                        <Input id="percentage" type="number" placeholder="e.g. 5" value={percentage} onChange={(e) => setPercentage(e.target.value)} />
                    </div>
                    {calculatedAmount !== null && (
                        <div className="text-center pt-2 border-t mt-4">
                            <p className="text-sm text-muted-foreground">Recommended Amount</p>
                            <p className="text-2xl font-bold text-primary">{calculatedAmount.toFixed(1)}g</p>
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
