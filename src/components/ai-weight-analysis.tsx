
"use client";

import { useState } from "react";
import { format, subDays } from "date-fns";
import { Bot, Calendar as CalendarIcon, Zap } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import type { WeightLog } from "@/lib/types";
import { calculateAverageWeightLoss, CalculateAverageWeightLossOutput } from "@/ai/flows/calculate-average-weight-loss";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AiWeightAnalysisProps {
  weightLogs: WeightLog[];
}

export function AiWeightAnalysis({ weightLogs }: AiWeightAnalysisProps) {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });
  const [analysisResult, setAnalysisResult] = useState<CalculateAverageWeightLossOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyzeClick = async () => {
    if (!dateRange || !dateRange.from || !dateRange.to) {
      toast({
        title: "Invalid Date Range",
        description: "Please select a valid date range to run the analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await calculateAverageWeightLoss({
        weightLogs,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      });
      setAnalysisResult(result);
    } catch (error) {
      console.error("AI analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "The AI weight analysis could not be completed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
                 <div className="bg-primary/10 text-primary p-2 rounded-md">
                    <Bot className="w-6 h-6" />
                </div>
                <div>
                    <CardTitle className="text-lg">AI Weight Analysis</CardTitle>
                    <CardDescription>Get AI-powered insights into your bird's weight.</CardDescription>
                </div>
            </div>
            <Button onClick={handleAnalyzeClick} disabled={isLoading}>
                {isLoading ? (
                    <>
                    <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing...
                    </>
                ) : (
                    <>
                    <Zap className="w-4 h-4 mr-2" />
                    Analyze Weight
                    </>
                )}
            </Button>
        </div>
        <div className="pt-4">
             <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
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
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        )}
        {analysisResult && (
             <div className="bg-secondary/50 p-4 rounded-lg">
                <h4 className="font-semibold text-base flex items-center">
                    Average Weight Loss / Hour
                </h4>
                <p className="text-2xl font-bold text-primary mt-1">
                    {analysisResult.averageHourlyWeightLoss.toFixed(2)}g
                </p>
                <p className="text-xs text-muted-foreground mt-1">{analysisResult.summary}</p>
            </div>
        )}
        {!isLoading && !analysisResult && (
            <div className="text-center text-sm text-muted-foreground py-8">
                <p>Select a date range and click "Analyze Weight" to see insights.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
