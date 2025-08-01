"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Bot, Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { calculateAvgWeightLoss } from "@/ai/flows/calculate-avg-weight-loss";

interface AvgWeightLossCalculatorProps {
  birdId: string;
}

export function AvgWeightLossCalculator({ birdId }: AvgWeightLossCalculatorProps) {
  const [date, setDate] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const { toast } = useToast();

  const handleCalculate = async () => {
    if (!date?.from || !date?.to) {
      toast({
        title: "Invalid Date Range",
        description: "Please select both a start and end date.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await calculateAvgWeightLoss({
        birdId,
        startDate: format(date.from, "yyyy-MM-dd"),
        endDate: format(date.to, "yyyy-MM-dd"),
      });
      setResult(response.averageWeightLoss);
    } catch (error) {
      console.error("Error calculating average weight loss:", error);
      toast({
        title: "Calculation Failed",
        description: "An error occurred while communicating with the AI.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Button onClick={handleCalculate} disabled={isLoading || !date?.from || !date?.to}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Bot className="mr-2 h-4 w-4" />
          )}
          Calculate
        </Button>
      </div>
      {result !== null && (
        <Alert>
          <AlertTitle className="flex items-center gap-2">
            Analysis Complete
          </AlertTitle>
          <AlertDescription>
            The estimated average weight loss for the selected period is{" "}
            <span className="font-bold text-primary">{result.toFixed(2)}g</span>.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
