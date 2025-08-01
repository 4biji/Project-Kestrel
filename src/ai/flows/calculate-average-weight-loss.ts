
'use server';
/**
 * @fileOverview Calculates average weight loss for a bird.
 *
 * - calculateAverageWeightLoss - A function that handles the weight loss calculation.
 * - CalculateAverageWeightLossInput - The input type for the function.
 * - CalculateAverageWeightLossOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import type { WeightLog } from '@/lib/types';
import { z } from 'genkit';
import {parseISO, differenceInHours} from 'date-fns';

const WeightLogSchema = z.object({
    datetime: z.string(),
    weight: z.number(),
});

const CalculateAverageWeightLossInputSchema = z.object({
  weightLogs: z.array(WeightLogSchema).describe("An array of the bird's weight log entries."),
  startDate: z.string().describe("The start date of the analysis period in ISO format."),
  endDate: z.string().describe("The end date of the analysis period in ISO format."),
});
export type CalculateAverageWeightLossInput = z.infer<typeof CalculateAverageWeightLossInputSchema>;


const CalculateAverageWeightLossOutputSchema = z.object({
    averageHourlyWeightLoss: z.number().describe("The average weight loss in grams per hour."),
    summary: z.string().describe("A brief, one-sentence summary of the analysis."),
});
export type CalculateAverageWeightLossOutput = z.infer<typeof CalculateAverageWeightLossOutputSchema>;


export async function calculateAverageWeightLoss(input: CalculateAverageWeightLossInput): Promise<CalculateAverageWeightLossOutput> {
  return calculateAverageWeightLossFlow(input);
}


const calculateAverageWeightLossFlow = ai.defineFlow(
  {
    name: 'calculateAverageWeightLossFlow',
    inputSchema: CalculateAverageWeightLossInputSchema,
    outputSchema: CalculateAverageWeightLossOutputSchema,
  },
  async (input) => {
    const { weightLogs, startDate, endDate } = input;

    const start = parseISO(startDate);
    const end = parseISO(endDate);

    const filteredLogs = weightLogs
      .map(log => ({ ...log, date: parseISO(log.datetime) }))
      .filter(log => log.date >= start && log.date <= end)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (filteredLogs.length < 2) {
      return {
        averageHourlyWeightLoss: 0,
        summary: "Not enough data in the selected range to calculate weight loss.",
      };
    }
    
    const hourlyLosses: number[] = [];

    for (let i = 1; i < filteredLogs.length; i++) {
        const prevLog = filteredLogs[i-1];
        const currentLog = filteredLogs[i];

        const weightChange = prevLog.weight - currentLog.weight;

        if (weightChange > 0) { // Only consider weight loss
            const hoursApart = differenceInHours(currentLog.date, prevLog.date);
            if (hoursApart > 0) {
                const hourlyLoss = weightChange / hoursApart;
                hourlyLosses.push(hourlyLoss);
            }
        }
    }

    if (hourlyLosses.length === 0) {
        return {
            averageHourlyWeightLoss: 0,
            summary: "No weight loss recorded in the selected period.",
        };
    }

    const averageHourlyWeightLoss = hourlyLosses.reduce((sum, loss) => sum + loss, 0) / hourlyLosses.length;
    
    const { output } = await ai.generate({
        prompt: `Based on an average hourly weight loss of ${averageHourlyWeightLoss.toFixed(2)}g, provide a very short, one-sentence summary for a falconer.`,
        output: {
            schema: z.object({ summary: z.string() })
        }
    });
    
    return {
        averageHourlyWeightLoss,
        summary: output?.summary || "Analysis complete."
    };
  }
);
